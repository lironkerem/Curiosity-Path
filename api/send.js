import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { sub, payload } = req.body;

  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    res.json({ sent: true });
  } catch (err) {
    // 410 = subscription expired, delete it from database
    if (err.statusCode === 410) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', sub.endpoint);
      
      console.log('Deleted expired subscription:', sub.endpoint);
      return res.status(410).json({ error: 'subscription gone', deleted: true });
    }
    res.status(400).json({ error: err.message });
  }
};