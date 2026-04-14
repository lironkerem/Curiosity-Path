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
 * @param {Object} subscription - Push subscription object
 * @param {Object} payload - Notification payload
 * @returns {Object|null} Error object if validation fails, null if valid
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
 * Initializes Supabase client (anon key — for existing single-sub path)
 * @returns {Object} Supabase client instance
 */
function initializeSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
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
 * Deletes expired subscription from database
 * @param {Object} supabase - Supabase client
 * @param {string} endpoint - Subscription endpoint
 */
async function deleteExpiredSubscription(supabase, endpoint) {
  try {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) {
      console.error('Failed to delete expired subscription:', error.message);
    }
  } catch (error) {
    console.error('Error deleting subscription:', error.message);
  }
}

// Initialize services
let supabase;
try {
  supabase = initializeSupabase();
  initializeWebPush();
} catch (error) {
  console.error('Initialization error:', error.message);
}

/**
 * Main handler for sending push notifications
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if services are initialized
  if (!supabase) {
    return res.status(500).json({ error: 'Service not configured' });
  }

  const { sub, userId, payload } = req.body;

  // -----------------------------------------------------------------------
  // MODE 2: userId provided — server-side subscription lookup (bypasses RLS)
  // Used by admin gift/role/message actions in member-profile-modal.js
  // -----------------------------------------------------------------------
  if (userId && !sub) {
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload object' });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured');
      return res.status(500).json({ error: 'Service not configured' });
    }

    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: subs, error: dbError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId);

    if (dbError) {
      console.error('Failed to fetch subscriptions:', dbError.message);
      return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }

    if (!subs?.length) {
      return res.status(200).json({ sent: 0, reason: 'no subscriptions found' });
    }

    const results = await Promise.allSettled(
      subs.map(s => webpush.sendNotification(s.subscription, JSON.stringify(payload)))
    );

    const sent   = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    return res.status(200).json({ sent, failed });
  }

  // -----------------------------------------------------------------------
  // MODE 1: single subscription object passed directly (existing behaviour)
  // -----------------------------------------------------------------------
  const validationError = validateRequest(sub, payload);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return res.status(200).json({ sent: true });

  } catch (error) {
    // Handle expired subscription (410 Gone)
    if (error.statusCode === 410) {
      await deleteExpiredSubscription(supabase, sub.endpoint);
      return res.status(410).json({
        error: 'Subscription expired',
        deleted: true,
      });
    }

    console.error('Push notification error:', error.message);
    return res.status(400).json({
      error: 'Failed to send notification',
      message: error.message,
    });
  }
}
