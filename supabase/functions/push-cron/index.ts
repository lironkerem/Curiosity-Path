import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE')!)

webpush.setVapidDetails(
  Deno.env.get('VAPID_EMAIL')!,
  Deno.env.get('VAPID_PUBLIC')!,
  Deno.env.get('VAPID_PRIVATE')!
)

serve(async () => {
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // 1.  all users that want notifications
  const { data: prefs } = await supabase.from('notification_prefs').select('user_id,prefs')

  for (const { user_id, prefs } of prefs || []) {
    if (!prefs.enabled) continue

    const { data: subRows } = await supabase
          .from('push_subscriptions')
          .select('subscription')
          .eq('user_id', user_id)

    if (!subRows.length) continue
    const sub = subRows[0].subscription

    // 2.  daily check-ins
    for (const [period, cfg] of Object.entries(prefs.reminders)) {
      if (cfg.enabled && cfg.time === time) {
        await send(sub, {
          title: { morning: '🌅 Good Morning!', afternoon: '☀️ Afternoon check-in', evening: '🌆 Evening reflection', night: '🌙 Good night' }[period]!,
          body: { morning: 'Start your day with intention…', afternoon: 'Take a moment to breathe…', evening: 'How was your day?', night: 'Rest well…' }[period]!,
          icon: '/Icons/icon-192x192.png'
        })
      }
    }

    // 3.  inspirational (quotes / affirmations) – intensity decides how many per day
    if (prefs.quotes.enabled || prefs.affirmations.enabled) {
      const gaps = { light: 4, moderate: 2, intense: 1 }[prefs.frequency]          // hours
      if (now.getMinutes() === 0 && now.getHours() % gaps === 0) {                 // on the hour
        const body = prefs.quotes.enabled && Math.random() < 0.5
            ? await randomQuote()
            : await randomAffirmation()
        await send(sub, { title: '💭 Inspiration', body, icon: '/Icons/icon-192x192.png' })
      }
    }

    // 4.  wellness automations
    if (prefs.wellness?.enabled) {
      const auto = prefs.wellness.automations || {}
      for (const [key, cfg] of Object.entries(auto)) {
        if (!cfg.enabled) continue
        const min = cfg.interval
        // we fire when minutes modulo interval == 0
        if (now.getMinutes() % min === 0) {
          const msg = {
            selfReset: { title: '🧘 Self-reset', body: 'Time to pause…' },
            fullBodyScan: { title: '🌊 Body scan', body: 'Scan head-to-toe…' },
            nervousSystem: { title: '⚡ Nervous reset', body: 'Breathe deeply…' },
            tensionSweep: { title: '🌀 Tension sweep', body: 'Let go…' }
          }[key]!
          await send(sub, { ...msg, icon: '/Icons/icon-192x192.png' })
        }
      }
    }
  }

  return new Response('ok', { status: 200 })
})

async function send(sub: any, payload: any) {
  try { await webpush.sendNotification(sub, JSON.stringify(payload)) } catch (e: any) {
    if (e.statusCode === 410) {
      await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
    }
  }
}

async function randomQuote() {
  // you can fetch from your QuotesList table or hard-code a few
  return '“The present moment is the only time over which we have dominion.” – Thích Nhất Hạnh'
}
async function randomAffirmation() {
  return 'I am calm, centred, and creative.'
}