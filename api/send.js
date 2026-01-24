// ============================================
// /api/send.js
// Sends push notifications using Web Push Protocol
// Handles subscription cleanup for expired subscriptions
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
 * Initializes Supabase client
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

  const { sub, payload } = req.body;

  // Validate request
  const validationError = validateRequest(sub, payload);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  try {
    // Send push notification
    await webpush.sendNotification(sub, JSON.stringify(payload));
    return res.status(200).json({ sent: true });

  } catch (error) {
    // Handle expired subscription (410 Gone)
    if (error.statusCode === 410) {
      await deleteExpiredSubscription(supabase, sub.endpoint);
      return res.status(410).json({ 
        error: 'Subscription expired', 
        deleted: true 
      });
    }

    // Handle other push notification errors
    console.error('Push notification error:', error.message);
    return res.status(400).json({ 
      error: 'Failed to send notification',
      message: error.message 
    });
  }
}