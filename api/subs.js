// ============================================
// /api/subs.js
// Retrieves all push notification subscriptions
// Used for broadcasting notifications to all users
// ============================================

import { createClient } from '@supabase/supabase-js';

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

// Initialize Supabase client
let supabase;
try {
  supabase = initializeSupabase();
} catch (error) {
  console.error('Initialization error:', error.message);
}

/**
 * Main handler for retrieving push subscriptions
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Supabase is initialized
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('subscription');
    
    if (error) {
      console.error('Failed to fetch subscriptions:', error.message);
      return res.status(500).json({ 
        error: 'Failed to fetch subscriptions',
        message: error.message 
      });
    }
    
    // Extract subscription objects from rows
    const subscriptions = data.map(row => row.subscription);
    
    return res.status(200).json(subscriptions);

  } catch (error) {
    console.error('Unexpected error in subs:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}