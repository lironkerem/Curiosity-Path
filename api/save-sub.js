// ============================================
// /api/save-sub.js
// Saves push notification subscriptions to Supabase
// ============================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, keys, expirationTime, user_id } = req.body;

  if (!endpoint || !keys) {
    return res.status(400).json({ error: 'Invalid subscription data' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase credentials not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  // Service role key — safe here, this is a trusted server-side API route
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      endpoint,
      subscription: { endpoint, keys, expirationTime },
      user_id: user_id || null
    }, { onConflict: 'endpoint' });

  if (error) {
    console.error('save-sub error:', error.message, error.code);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ ok: true });
}