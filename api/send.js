// ============================================
// /api/send.js
// Sends push notifications using Web Push Protocol
// Handles subscription cleanup for expired subscriptions
//
// Supports two modes:
//   1. { sub, payload }    — single subscription (existing behaviour)
//   2. { userId, payload } — server-side lookup via service role (bypasses RLS)
// ============================================

import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

/**
 * Validates push notification payload
 */
function validateRequest(subscription, payload) {
  if (!subscription || !subscription.endpoint) {
    return { error: 'Invalid subscription object' };
  }
  if (!payload || typeof payload !== 'object') {
    return { error: 'Invalid payload object' };
  }
  return null;
}

/**
 * Initializes Web Push VAPID configuration
 */
function initializeWebPush() {
  if (!process.env.VAPID_EMAIL || !process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    throw new Error('VAPID credentials not configured');
  }
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Deletes an expired or invalid subscription from the database.
 * Uses service role to bypass RLS.
 */
async function deleteExpiredSubscription(endpoint) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);
    if (error) console.warn('[send.js] Failed to delete expired subscription:', error.message);
  } catch (err) {
    console.warn('[send.js] Error deleting subscription:', err.message);
  }
}

// Initialize VAPID once at cold-start — log but don't crash if missing
let vapidReady = false;
try {
  initializeWebPush();
  vapidReady = true;
} catch (err) {
  console.error('[send.js] VAPID initialization error:', err.message);
}

/**
 * Main handler for sending push notifications
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!vapidReady) {
    return res.status(500).json({ error: 'VAPID not configured' });
  }

  const { sub, userId, payload } = req.body;

  // -------------------------------------------------------------------------
  // MODE 2: userId provided — server-side subscription lookup (bypasses RLS)
  // Used by AdminDashboard and MemberProfileModal admin actions.
  // -------------------------------------------------------------------------
  if (userId && !sub) {
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload object' });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[send.js] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return res.status(500).json({ error: 'Service not configured' });
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    } catch (err) {
      console.error('[send.js] Failed to create supabaseAdmin client:', err.message);
      return res.status(500).json({ error: 'Failed to create admin client' });
    }

    const { data: subs, error: dbError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);

    if (dbError) {
      console.error('[send.js] Failed to fetch subscriptions:', dbError.message);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }

    if (!subs?.length) {
      // No subscriptions is a valid state — not an error
      return res.status(200).json({ sent: 0, reason: 'no subscriptions found' });
    }

    const results = await Promise.allSettled(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(s.subscription, JSON.stringify(payload));
        } catch (err) {
          // Clean up expired/invalid subscriptions silently
          if (err.statusCode === 410 || err.statusCode === 404) {
            await deleteExpiredSubscription(s.subscription?.endpoint);
          } else {
            console.warn('[send.js] Push send error:', err.message);
          }
          throw err; // still counts as rejected for the summary
        }
      })
    );

    const sent   = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    // Always return 200 — partial failures are expected (expired subs etc.)
    return res.status(200).json({ sent, failed });
  }

  // -------------------------------------------------------------------------
  // MODE 1: single subscription object passed directly
  // Used by service workers / legacy callers that pass { sub, payload }.
  // -------------------------------------------------------------------------
  const validationError = validateRequest(sub, payload);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return res.status(200).json({ sent: true });

  } catch (err) {
    // 410 Gone or 404 Not Found = subscription expired/unregistered.
    // Clean it up and return 200 — this is not a caller error.
    if (err.statusCode === 410 || err.statusCode === 404) {
      await deleteExpiredSubscription(sub.endpoint);
      return res.status(200).json({ sent: false, reason: 'subscription expired, cleaned up' });
    }

    console.error('[send.js] Push notification error:', err.message);
    return res.status(400).json({
      error: 'Failed to send notification',
      message: err.message,
    });
  }
}