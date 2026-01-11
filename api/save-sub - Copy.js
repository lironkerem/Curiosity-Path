// api/save-sub.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  
  const sub = req.body;
  if (!sub?.endpoint) return res.status(400).json({ error: 'bad sub' });

  // Get user_id from auth header or session
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      userId = user.id;
    }
  }

  // If no user_id from auth, try to get from request body
  if (!userId && req.body.user_id) {
    userId = req.body.user_id;
  }

  const { data, error } = await supabase
    .from('push_subscriptions')
    .upsert({
      endpoint: sub.endpoint,
      subscription: sub,
      user_id: userId
    }, { onConflict: 'endpoint' });
  
  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }
  
  console.log('Saved sub:', sub.endpoint, 'for user:', userId);
  res.json({ ok: true });
};