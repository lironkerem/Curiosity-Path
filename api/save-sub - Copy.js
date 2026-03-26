// ============================================
// /api/save-sub.js
// Saves push notification subscriptions to Supabase
// Supports both authenticated and anonymous users
// ============================================

import { createClient } from '@supabase/supabase-js';

/**
 * Validates push subscription object
 * @param {Object} subscription - Push subscription data
 * @returns {boolean} True if valid
 */
function isValidSubscription(subscription) {
  return subscription && 
         typeof subscription === 'object' && 
         typeof subscription.endpoint === 'string' &&
         subscription.endpoint.length > 0;
}

/**
 * Creates Supabase client with optional authentication
 * @param {string|null} authHeader - Authorization header value
 * @returns {Object} Supabase client instance
 */
function createSupabaseClient(authHeader) {
  const config = {
    global: authHeader ? {
      headers: { Authorization: authHeader }
    } : undefined
  };

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    config
  );
}

/**
 * Extracts user ID from auth token or request body
 * @param {Object} supabase - Supabase client
 * @param {string|null} authHeader - Authorization header
 * @param {string|null} bodyUserId - User ID from request body
 * @returns {Promise<string|null>} User ID or null
 */
async function getUserId(supabase, authHeader, bodyUserId) {
  // Use provided user_id if available
  if (bodyUserId) {
    return bodyUserId;
  }

  // Extract from auth token
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (!error && user) {
      return user.id;
    }
  }

  return null;
}

/**
 * Main handler for saving push subscriptions
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const subscription = req.body;

  // Validate subscription data
  if (!isValidSubscription(subscription)) {
    return res.status(400).json({ error: 'Invalid subscription data' });
  }

  // Check Supabase configuration
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Supabase credentials not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const authHeader = req.headers.authorization;
    const supabase = createSupabaseClient(authHeader);
    
    // Get user ID from token or request body
    const userId = await getUserId(supabase, authHeader, subscription.user_id);

    // Upsert subscription (insert or update)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: subscription.endpoint,
        subscription: subscription,
        user_id: userId
      }, { 
        onConflict: 'endpoint',
        ignoreDuplicates: false 
      });
    
    if (error) {
      console.error('Failed to save subscription:', error.message);
      return res.status(500).json({ error: 'Failed to save subscription' });
    }
    
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Unexpected error in save-sub:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}