// push-cron Edge Function – Timezone-aware with improved slot distribution 2026-01-15
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3'

// ---------- ENV ----------
const supabase = createClient(
  Deno.env.get('SB_URL')!,
  Deno.env.get('SB_SERVICE_ROLE_KEY')!
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_EMAIL')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

// ---------- NOTIFICATION TEXTS ----------
const NOTIFICATION_TEXTS = {
  "awakening": [
    "Good morning. Take a moment to check your energy and see your 4 Daily Cards.",
    "Your day begins now. Observe your energy and discover the guidance of your Daily Cards.",
    "Start your day with awareness. Log your energy and look at today's 4 Daily Cards for insight.",
    "Pause for a moment. Check in with yourself and your Daily Cards to set the tone of your day.",
    "Morning is your reset. Take a deep breath, log your energy, and explore your 4 Daily Cards.",
    "Welcome the day. Note your energy and see what wisdom your Daily Cards hold.",
    "Begin consciously: record your energy and discover your guidance through the 4 Daily Cards.",
    "Open your morning mind. Take a breath, log your energy, and connect with your Daily Cards.",
    "Today is new. Observe your energy and let your 4 Daily Cards offer clarity.",
    "Greet your morning with awareness: energy check and Daily Cards insight await you.",
    "Take a quiet moment. Record your energy and reflect on your 4 Daily Cards.",
    "Morning clarity starts here. Log your energy and explore the guidance of the Cards.",
    "Set the tone for today: check your energy and see what the Daily Cards reveal.",
    "Begin with presence: a brief energy log and a look at your Daily Cards.",
    "Awaken your attention. Observe your energy and the messages of your 4 Daily Cards.",
    "Step into your morning mindfully. Log energy and see what the Cards suggest.",
    "A gentle start: notice your energy and discover guidance in the 4 Daily Cards.",
    "Your energy is your compass. Log it and review your Daily Cards for direction.",
    "Open your day with awareness. Energy check and Card insight are ready.",
    "Morning moment: pause, log your energy, and consult your 4 Daily Cards.",
    "Start conscious and clear: track your energy and see your Cards' guidance.",
    "Today begins with awareness: energy log and Daily Cards reflection.",
    "Take a mindful pause. Record energy and look at your 4 Daily Cards.",
    "Your day, your guidance: log energy and check your Cards.",
    "Morning clarity: notice your energy, then see the wisdom of your Daily Cards.",
    "Check in with yourself. Log your energy and explore the 4 Daily Cards.",
    "Set the intention for today. Start with an energy log and Daily Card review.",
    "Start your day with calm. Log energy and see what the 4 Daily Cards reveal.",
    "Awaken with awareness. Track energy and consult your Daily Cards.",
    "Begin thoughtfully: energy check and Daily Cards reflection to guide your day."
  ],
  "recharge": [
    "A gentle reminder: take a short moment for a reset or explore a Tarot Spread to refresh your energy.",
    "Pause and recharge: try a Happiness Booster, a quick meditation, or a Tarot insight.",
    "Your afternoon moment: reset, meditate, or enjoy a small practice to reconnect with yourself.",
    "Feeling the midday stretch? Take a brief pause with a reset or choose a practice that feels right.",
    "Engage your curiosity: a quick reset, meditation, or Tarot guidance can uplift your afternoon.",
    "Step back for a moment. Reset, meditate, or explore a Tarot spread to refresh your mind.",
    "The afternoon calls for presence: take a short reset or pick a practice to renew energy.",
    "Pause, breathe, and choose a small practice: meditation, Tarot, or a Happiness Booster.",
    "A mindful break: quick reset, brief meditation, or a Tarot spread can bring clarity.",
    "Refresh your energy: a short reset or a playful Happiness Booster is just right now.",
    "Your afternoon reset awaits. Take a few minutes for a practice or Tarot insight.",
    "Notice your energy. Pause, reset, or enjoy a short meditation to center yourself.",
    "Curiosity moment: quick reset, Happiness Booster, or Tarot spread to spark insight.",
    "Slow down briefly. Meditate, reset, or explore Tarot for a small boost.",
    "Midday check-in: pick a reset, meditation, or Tarot to lift your energy.",
    "Afternoon guidance: short reset or Happiness Booster can realign your focus.",
    "Step into stillness. Reset, meditate, or try a Tarot spread.",
    "Your afternoon pause: choose a reset, meditation, or Tarot reflection.",
    "Breathe, pause, refresh: pick a small practice to energize your afternoon.",
    "A gentle nudge: a quick reset, meditation, or Tarot can restore clarity.",
    "Recharge with ease: select a brief practice, Tarot spread, or Happiness Booster.",
    "Slow your pace. A reset or meditation will restore calm and clarity.",
    "Step back for a moment. Choose a Tarot spread or short reset.",
    "Midday clarity: a quick reset, meditation, or Happiness Booster is here for you.",
    "Take a mindful pause. Pick one practice to refresh energy.",
    "Afternoon spark: reset, meditate, or explore Tarot insight.",
    "Notice your energy. A brief reset or Happiness Booster can support you.",
    "Step into the present: a reset, meditation, or Tarot spread is available.",
    "Recharge your mind: quick reset or a Happiness Booster for the moment.",
    "Afternoon moment of care: pick a reset, meditate, or consult Tarot."
  ],
  "reflect": [
    "Slow down and reflect. A brief reset or gratitude practice can help integrate your day.",
    "Evening is for reflection: take a moment for gratitude or a gentle reset.",
    "Wind down gently. Pause for a reset or let an inspirational quote guide your evening thoughts.",
    "Before the day closes, reflect and recharge. A gratitude moment or reset is all you need.",
    "End your day on a calm note: practice gratitude or take a short reset to release the day's tension.",
    "Evening pause: a reset or gratitude practice can help settle your mind.",
    "Slowly unwind. Take a moment for reflection, reset, or gratitude.",
    "Your evening moment: pause, reset, or note what you are grateful for.",
    "Gently reflect on the day. A short reset or gratitude practice can bring calm.",
    "Evening check-in: pause, reset, and notice what you appreciate.",
    "Reflect and integrate. Take a reset or a gratitude moment before night.",
    "A calm evening: reset, practice gratitude, or enjoy a soft affirmation.",
    "Pause to digest the day: gratitude or a reset can support your evening.",
    "Evening reflection: take a short reset or note your gratitude.",
    "Wind down mindfully: a gratitude practice or gentle reset is perfect now.",
    "Your evening pause: reset, reflect, or read a soft affirmation.",
    "Ease into the night. Gratitude or reset brings calm and closure.",
    "Evening moment: reset briefly or practice gratitude.",
    "Reflect, release, restore. Short reset or gratitude practice now.",
    "Pause gently: reset, reflect, or read a quote to close your day.",
    "Evening intention: take a brief reset or practice gratitude.",
    "Slow the pace. Reset or note what you appreciate today.",
    "Calm your mind. A short reset or gratitude moment can help.",
    "Evening reflection: notice what you are grateful for and reset briefly.",
    "End-of-day pause: gratitude practice or reset to integrate the day.",
    "Evening care: reset, reflect, or enjoy a soft affirmation.",
    "Release and reflect: a reset or gratitude practice is gentle and effective.",
    "Evening clarity: take a moment for gratitude or a short reset.",
    "Pause with awareness: reset or gratitude can help settle your mind.",
    "Your day's close: brief reset, gratitude practice, or an inspirational quote."
  ],
  "integration": [
    "The day is ending. Log your evening energy, take a reset, or write a few thoughts to close the day.",
    "Nighttime pause: check in with your energy, reflect, and give yourself a gentle reset.",
    "Before sleep, note your energy, write a quick journal entry, or reset to ease into rest.",
    "End your day consciously. Log your evening energy and choose a reset or journaling moment.",
    "Close your day with awareness: a short reset, journaling, or energy check can help you rest.",
    "Evening check-in: record your energy, write a few thoughts, or take a gentle reset.",
    "Night pause: notice your energy, reset briefly, or journal before sleep.",
    "Finish the day with presence: evening energy log and journaling support your closure.",
    "Relax and reflect: log energy, reset, or write a few lines to close your day.",
    "Your evening moment: energy check, brief reset, or journaling for calm.",
    "End-of-day pause: log energy, write down reflections, or take a short reset.",
    "Nighttime reflection: check your energy, journal, or reset gently.",
    "Wind down consciously: energy log, reset, or journaling moment.",
    "Close your day mindfully. Log energy and take a brief reset.",
    "Evening awareness: check your energy, journal, or reset.",
    "Prepare for rest: log evening energy and reflect or reset briefly.",
    "Night pause: short reset, energy check, or journaling entry.",
    "Finish gently: record energy, take a reset, or journal.",
    "Evening reflection: log energy, reset briefly, or write a journal note.",
    "Close your day consciously: energy, reset, or journaling moment.",
    "End-of-day check-in: notice energy, reset, or journal for clarity.",
    "Nighttime care: log energy, reflect, or reset before sleep.",
    "Pause and reflect: short reset, energy log, or journaling moment.",
    "Evening closure: record energy and choose reset or journaling.",
    "Your day's end: energy log, gentle reset, or journaling moment.",
    "Finish mindfully: check energy, reset, or write down reflections.",
    "Night pause: energy log, journaling, or quick reset to settle.",
    "Consciously close your day: record energy and reset or journal.",
    "Evening calm: energy check, reset, or journaling for closure.",
    "End your day with care: log energy, reset, or journal briefly."
  ]
};

// ---------- HELPERS ----------
async function send(sub: any, payload: any) {
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload))
    console.log('      ✅ Sent:', payload.title)
  } catch (e: any) {
    console.error('      ❌ Send failed:', e.message)
    if (e.statusCode === 410) {
      await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      console.log('      🗑️  Deleted expired subscription')
    }
  }
}

function pad(n: number) { 
  return n.toString().padStart(2, '0') 
}

function getRandomText(slot: 'awakening' | 'recharge' | 'reflect' | 'integration'): string {
  const texts = NOTIFICATION_TEXTS[slot];
  return texts[Math.floor(Math.random() * texts.length)];
}

function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function getUserLocalTime(timezone: string): Date {
  try {
    // Get current UTC time
    const now = new Date();
    
    // Convert to user's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const get = (type: string) => parts.find(p => p.type === type)?.value || '0';
    
    // Reconstruct date in user's timezone
    const localDate = new Date(
      parseInt(get('year')),
      parseInt(get('month')) - 1,
      parseInt(get('day')),
      parseInt(get('hour')),
      parseInt(get('minute')),
      parseInt(get('second'))
    );
    
    return localDate;
  } catch (e) {
    console.error('Timezone conversion error:', e);
    return new Date(); // Fallback to UTC
  }
}

function calculateSlots(startTime: string, endTime: string): {
  awakening: { start: number; end: number };
  recharge: { start: number; end: number };
  reflect: { start: number; end: number };
  integration: { start: number; end: number };
} {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const windowDuration = end - start;

  // Awakening at availability start, Integration at availability end
  // Recharge and Reflect evenly distributed (1/3 and 2/3 through the window)
  const oneThird = windowDuration / 3;
  const twoThirds = (windowDuration * 2) / 3;

  return {
    awakening: { 
      start: start, 
      end: start + oneThird 
    },
    recharge: { 
      start: start + oneThird, 
      end: start + twoThirds 
    },
    reflect: { 
      start: start + twoThirds, 
      end: end 
    },
    integration: { 
      start: end, 
      end: end 
    }
  };
}

function isInSlot(currentMinutes: number, slotStart: number, slotEnd: number): boolean {
  // Check if we're within 7 minutes of slot start
  const diff = Math.abs(currentMinutes - slotStart);
  return diff <= 7;
}

async function hasBeenSentToday(userId: string, slotName: string, timezone: string): Promise<boolean> {
  try {
    // Get today's start in user's timezone (00:00:00)
    const userLocalTime = getUserLocalTime(timezone);
    userLocalTime.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from('notification_log')
      .select('id')
      .eq('user_id', userId)
      .eq('slot', slotName)
      .gte('sent_at', userLocalTime.toISOString())
      .limit(1)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error('      ⚠️  Error checking notification log:', error);
      return false; // If error, allow sending (fail-open)
    }
    
    return !!data;
  } catch (e) {
    console.error('      ⚠️  hasBeenSentToday error:', e);
    return false;
  }
}

async function logNotification(userId: string, slotName: string) {
  const { error } = await supabase
    .from('notification_log')
    .insert({
      user_id: userId,
      slot: slotName,
      sent_at: new Date().toISOString()
    });
  
  if (error) {
    console.error('      ⚠️  Failed to log notification:', error);
  }
}

// ---------- MAIN ----------
Deno.serve(async (req: Request) => {
  const nowUTC = new Date();
  const timeUTC = `${pad(nowUTC.getHours())}:${pad(nowUTC.getMinutes())}`;

  console.log(`\n🕐 Cron running at ${timeUTC} UTC`);
  console.log(`   UTC: ${nowUTC.toUTCString()}`);

  const { data: prefs, error: prefsError } = await supabase
    .from('notification_prefs')
    .select('user_id,prefs');
  
  console.log(`   Found ${prefs?.length || 0} users with notification prefs`);
  
  if (prefsError) {
    console.error('   ❌ Prefs query error:', prefsError);
    return new Response(JSON.stringify({ error: prefsError.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (!prefs || prefs.length === 0) {
    console.log('   ⚠️  No users with notification prefs found');
    return new Response(JSON.stringify({ ok: true, message: 'no prefs', time: timeUTC }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  let sentCount = 0;

  for (const { user_id, prefs: userPrefs } of prefs) {
    console.log(`\n   👤 User: ${user_id.substring(0, 8)}...`);
    console.log(`      Notifications enabled: ${userPrefs.enabled}`);
    
    if (!userPrefs.enabled) {
      console.log('      ⏭️  Skipped (notifications disabled)');
      continue;
    }

    // Validate window and timezone
    if (!userPrefs.window?.start || !userPrefs.window?.end) {
      console.log('      ⚠️  Skipped (invalid window configuration)');
      continue;
    }

    const timezone = userPrefs.timezone || 'UTC';
    console.log(`      Timezone: ${timezone}`);

    // Get user's local time
    const userLocalTime = getUserLocalTime(timezone);
    const userLocalHour = userLocalTime.getHours();
    const userLocalMinute = userLocalTime.getMinutes();
    const currentMinutes = userLocalHour * 60 + userLocalMinute;
    
    console.log(`      User local time: ${pad(userLocalHour)}:${pad(userLocalMinute)} (${currentMinutes} min)`);

    // Get user's subscriptions
    const { data: subRows, error: subError } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', user_id);

    if (subError) {
      console.error(`      ❌ Subscription query error:`, subError);
      continue;
    }

    console.log(`      Active subscriptions: ${subRows?.length || 0}`);
    
    if (!subRows || subRows.length === 0) {
      console.log('      ⏭️  Skipped (no active subscriptions)');
      continue;
    }
    
    const userSubs = subRows.map(row => row.subscription);

    // Calculate time slots from user's window
    const slots = calculateSlots(userPrefs.window.start, userPrefs.window.end);
    console.log(`      Daily window: ${userPrefs.window.start} - ${userPrefs.window.end}`);
    console.log(`      Frequency: ${userPrefs.frequency}`);

    // Determine which slots are active based on frequency
    const activeSlots: Array<'awakening' | 'recharge' | 'reflect' | 'integration'> = 
      userPrefs.frequency === 'full' 
        ? ['awakening', 'recharge', 'reflect', 'integration']
        : ['awakening', 'integration'];

    console.log(`      Active slots: ${activeSlots.join(', ')}`);

    // Check each active slot
    for (const slotName of activeSlots) {
      const slot = slots[slotName];
      const inSlot = isInSlot(currentMinutes, slot.start, slot.end);
      
      console.log(`         ${slotName}: start=${Math.round(slot.start)}min, match=${inSlot}`);

      if (inSlot) {
        // ⭐ CHECK IF ALREADY SENT TODAY (using user's timezone)
        const alreadySent = await hasBeenSentToday(user_id, slotName, timezone);
        
        if (alreadySent) {
          console.log(`         ⏭️  ${slotName}: already sent today, skipping`);
          continue;
        }

        const randomText = getRandomText(slotName);
        const title = slotName === 'awakening' ? '🌅 Awakening' :
                     slotName === 'recharge' ? '☀️ Recharge' :
                     slotName === 'reflect' ? '🌆 Reflect' :
                     '🌙 Integration';

        const payload = {
          title,
          body: randomText,
          icon: '/Icons/icon-512-maskable.png',
          badge: '/Icons/badge-96x96.png',
          data: { url: '/' }
        };

        // Send to all user's devices
        for (const sub of userSubs) {
          await send(sub, payload);
        }
        
        // ⭐ LOG THAT WE SENT IT
        await logNotification(user_id, slotName);
        
        sentCount += userSubs.length;
        console.log(`         ✅ Sent to ${userSubs.length} device(s)`);
      }
    }
  }

  console.log(`\n✅ Cron complete: ${sentCount} notifications sent\n`);

  return new Response(JSON.stringify({ 
    ok: true, 
    time: timeUTC, 
    users_checked: prefs.length,
    notifications_sent: sentCount 
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
});