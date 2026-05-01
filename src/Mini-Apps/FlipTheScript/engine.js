/* Mini-Apps/FlipTheScript/engine.js */

(function (global) {

  // Safe localStorage wrapper
  const ls = {
    get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
    set:    (k, v) => { try { localStorage.setItem(k, v); }      catch {} },
    remove: k      => { try { localStorage.removeItem(k); }      catch {} }
  };

  const AFF = (typeof global !== 'undefined' && global.affirmations) ? global.affirmations : null;

  let CATEGORY_KEYS = [];
  let categoryToAffirmations = {};
  let tagToCategories = {};
  let simpleKeywordIndex = {};
  let indexesBuilt = false;
  const lastChoiceIndex = {};

  const PHRASE_PATTERNS = Object.freeze({
    "loneliness_&_isolation": Object.freeze(["no one cares", "all alone", "by myself", "no friends"]),
    "imposter_syndrome":      Object.freeze(["not good enough", "don't deserve", "feel like a fake"]),
    "burnout_&_exhaustion":   Object.freeze(["can't do this", "too tired", "giving up", "so exhausted"]),
    "perfectionism":          Object.freeze(["not perfect", "must be perfect", "messed up"]),
    "shame_&_guilt":          Object.freeze(["feel guilty", "so ashamed", "my fault"])
  });

  const INTENSITY_WORDS = Object.freeze({
    high:   Object.freeze(["hate", "never", "always", "worthless", "terrible", "hopeless"]),
    medium: Object.freeze(["bad", "wrong", "hard", "difficult", "upset"]),
    low:    Object.freeze(["uncertain", "unsure", "confused", "worried"])
  });

  const TONE_STYLES = Object.freeze({
    fatigue:           Object.freeze({ prefix: "I allow myself to slow down,", connect: "in this stillness", ending: "my energy returns as I care for myself." }),
    severe_fatigue:    Object.freeze({ prefix: "Rest is not weakness, it's wisdom.", connect: "My body is asking for care,", ending: "and honoring that need is an act of my strength." }),
    loneliness:        Object.freeze({ prefix: "Connection lives within me,", connect: "even when life feels quiet", ending: "love is already finding its way to me." }),
    severe_loneliness: Object.freeze({ prefix: "I am never truly alone.", connect: "Even in silence, I matter deeply,", ending: "and connection is closer than it feels right now." }),
    anger:             Object.freeze({ prefix: "I breathe and notice the flame,", connect: "I let warmth become clarity", ending: "I can direct my passion toward purpose." }),
    rage:              Object.freeze({ prefix: "This intensity I feel is real and valid.", connect: "I take space to feel it safely,", ending: "then I channel this power toward what truly serves me." }),
    anxiety:           Object.freeze({ prefix: "I take a deep breath — I am safe now,", connect: "peace begins in my awareness", ending: "I can move through this moment with ease." }),
    panic:             Object.freeze({ prefix: "I ground myself right here, right now.", connect: "This feeling will pass,", ending: "and I have everything I need to get through it." }),
    confusion:         Object.freeze({ prefix: "Uncertainty is part of my growth,", connect: "I don't need all the answers", ending: "clarity will unfold in its own time for me." }),
    sadness:           Object.freeze({ prefix: "It's okay for me to feel what I feel,", connect: "I let the emotion move through", ending: "every tear waters new growth within me." }),
    severe_sadness:    Object.freeze({ prefix: "This pain I carry is heavy, and it's real.", connect: "I don't have to carry it alone,", ending: "and healing will come to me, one gentle moment at a time." }),
    neutral:           Object.freeze({ prefix: "With calm presence and awareness,", connect: "each thought I choose", ending: "reshapes my reality toward peace and purpose." }),
    crisis:            Object.freeze({ prefix: "If I am feeling unsafe, I can reach out for immediate support.", connect: "I do not have to carry this alone.", ending: "If I am in immediate danger, I will contact local emergency services now." })
  });

  // ---------------------------
  // Tokenizer
  // ---------------------------
  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .replace(/[''`]/g, "'").replace(/[""]/g, '"').replace(/[-—–]/g, ' ')
      .toLowerCase()
      .replace(/[^0-9a-z\u00C0-\u024F'\s]+/g, ' ')
      .split(/\s+/).filter(Boolean);
  }

  function randomIndexExcept(length, exceptIdx) {
    if (length === 0) return -1;
    if (length === 1) return 0;
    let idx, attempts = 0;
    do { idx = Math.floor(Math.random() * length); attempts++; }
    while (idx === exceptIdx && attempts < 6);
    return idx;
  }

  function randomItem(arr, categoryKey) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const idx = randomIndexExcept(arr.length, typeof lastChoiceIndex[categoryKey] === 'number' ? lastChoiceIndex[categoryKey] : -1);
    lastChoiceIndex[categoryKey] = idx;
    return arr[idx];
  }

  // ---------------------------
  // Build indexes
  // ---------------------------
  function buildIndexes(force = false) {
    if (indexesBuilt && !force) return;
    if (!AFF || typeof AFF !== 'object') { indexesBuilt = true; return; }

    CATEGORY_KEYS = Object.keys(AFF).filter(k => Array.isArray(AFF[k]) && AFF[k].length > 0);

    for (const cat of CATEGORY_KEYS) {
      const normalized = AFF[cat].map(it => {
        if (!it) return null;
        const t = typeof it === 'string' ? it : String(it.text || '');
        const tags = Array.isArray(it?.tags) ? it.tags.map(x => String(x).toLowerCase()) : [];
        return { text: t, tags };
      }).filter(Boolean);

      categoryToAffirmations[cat] = normalized;

      for (const item of normalized) {
        for (const tag of item.tags) {
          if (!tagToCategories[tag]) tagToCategories[tag] = new Set();
          tagToCategories[tag].add(cat);
        }
        for (const w of tokenize(item.text)) {
          if (!simpleKeywordIndex[w]) simpleKeywordIndex[w] = new Set();
          simpleKeywordIndex[w].add(cat);
        }
      }

      for (const cw of tokenize(cat.replace(/[_\-]/g, ' '))) {
        if (!simpleKeywordIndex[cw]) simpleKeywordIndex[cw] = new Set();
        simpleKeywordIndex[cw].add(cat);
      }
    }
    indexesBuilt = true;
  }

  function detectPhrases(text) {
    const lower = text.toLowerCase();
    const matches = {};
    for (const [category, phrases] of Object.entries(PHRASE_PATTERNS)) {
      for (const phrase of phrases) {
        if (lower.includes(phrase)) matches[category] = (matches[category] || 0) + 5;
      }
    }
    return matches;
  }

  function detectIntensity(text) {
    if (!text) return 'low';
    const words = tokenize(text);
    for (const w of words) { if (INTENSITY_WORDS.high.includes(w))   return 'high'; }
    for (const w of words) { if (INTENSITY_WORDS.medium.includes(w)) return 'medium'; }
    return 'low';
  }

  function scoreCategories(input) {
    buildIndexes();
    const wordSet = new Set(tokenize(input));
    const scores  = Object.create(null);

    for (const [cat, score] of Object.entries(detectPhrases(input))) {
      scores[cat] = (scores[cat] || 0) + score;
    }

    const lowerInput = input.toLowerCase();
    for (const cat of CATEGORY_KEYS) {
      if (lowerInput.includes(cat.toLowerCase().replace(/[_\-]/g, ' '))) {
        scores[cat] = (scores[cat] || 0) + 4;
      }
    }

    for (const w of wordSet) {
      const fromKeyword = simpleKeywordIndex[w];
      if (fromKeyword) for (const cat of fromKeyword) scores[cat] = (scores[cat] || 0) + 1;
      const fromTag = tagToCategories[w];
      if (fromTag)     for (const cat of fromTag)     scores[cat] = (scores[cat] || 0) + 3;
    }

    if (!Object.keys(scores).length) {
      const fallback = categoryToAffirmations['general_positive_affirmations'] ? 'general_positive_affirmations' : CATEGORY_KEYS[0];
      if (fallback) scores[fallback] = 1;
    }
    return scores;
  }

  function chooseTopCategory(scores) {
    let top = null, topScore = -Infinity;
    for (const [cat, s] of Object.entries(scores)) {
      if (s > topScore) { topScore = s; top = cat; }
    }
    return { topCategory: top, score: topScore, scores };
  }

  function selectAffirmationFromCategory(category) {
    const arr = (category && categoryToAffirmations[category]) || categoryToAffirmations['general_positive_affirmations'] || [];
    const pick = randomItem(arr, category || 'general_positive_affirmations');
    return pick ? pick.text : null;
  }

  function getRelatedAffirmations(category, currentAffirmation, count = 3) {
    const arr = category && categoryToAffirmations[category];
    if (!arr) return [];
    return arr
      .filter(item => item.text !== currentAffirmation)
      .map(item => item.text)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  function detectTone(text) {
    if (!text) return 'neutral';
    const s = text.toLowerCase();
    const intensity = detectIntensity(text);
    if (/\b(suicid|kill myself|end my life|want to die|harm myself)\b/.test(s)) return 'crisis';
    if (/\b(tired|exhausted|drained|sleepy|burned out)\b/.test(s))  return intensity === 'high' ? 'severe_fatigue'    : 'fatigue';
    if (/\b(alone|lonely|unloved|isolated)\b/.test(s))              return intensity === 'high' ? 'severe_loneliness' : 'loneliness';
    if (/\b(angry|hate|mad|furious|resent)\b/.test(s))              return intensity === 'high' ? 'rage'              : 'anger';
    if (/\b(anxious|worried|fear|panic|nervous)\b/.test(s))         return intensity === 'high' ? 'panic'             : 'anxiety';
    if (/\b(lost|confused|stuck|hopeless)\b/.test(s))               return 'confusion';
    if (/\b(sad|depress|cry|hurt)\b/.test(s))                       return intensity === 'high' ? 'severe_sadness'    : 'sadness';
    return 'neutral';
  }

  function composeExpandedLocal(input, basic) {
    const style = TONE_STYLES[detectTone(input)] || TONE_STYLES['neutral'];
    const patterns = [
      `${style.prefix} ${style.connect}, ${basic} ${style.ending}`,
      `${style.prefix} ${basic}. ${style.connect}, ${style.ending}`,
      `${basic} ${style.connect}. ${style.ending}`,
      `${style.prefix} ${basic} ${style.ending}`
    ];
    const hash = Math.abs(Array.from(input).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
    return patterns[hash % patterns.length];
  }

  async function categorizeInput(input) {
    buildIndexes();
    if (!AFF) return { topCategory: null, score: 0, scores: {}, intensity: 'low' };
    return { ...chooseTopCategory(scoreCategories(input)), intensity: detectIntensity(input) };
  }

  async function flipBasic(input) {
    buildIndexes();
    if (!AFF) return { basic: 'I choose thoughts that uplift and empower me.', category: null, scores: {}, intensity: 'low' };
    const catInfo  = await categorizeInput(input);
    const basic    = selectAffirmationFromCategory(catInfo.topCategory) || 'I choose thoughts that uplift and empower me.';
    return { basic, category: catInfo.topCategory, scores: catInfo.scores, intensity: catInfo.intensity };
  }

  async function flipExpanded(input, basic) { return composeExpandedLocal(input, basic); }

  async function flip(input) {
    const { basic, category, scores, intensity } = await flipBasic(input);
    return {
      basicAffirmation:    basic,
      expandedAffirmation: await flipExpanded(input, basic),
      category,
      scores,
      intensity,
      relatedAffirmations: getRelatedAffirmations(category, basic, 3)
    };
  }

  // ---------------------------
  // AI-Powered Custom Affirmation Generation
  // ⚠️ FLAG: generateAIAffirmation does not call any real AI endpoint.
  // The 1500 ms delay is artificial. If real AI integration is planned,
  // replace the body with an actual fetch to the Anthropic API (or similar).
  // ---------------------------
  function extractEmotionalWords(text) {
    const emotions = ['sad','angry','anxious','worried','scared','lonely','tired','frustrated','overwhelmed','hopeless','worthless'];
    const words = text.toLowerCase().split(/\s+/);
    return emotions.filter(e => words.some(w => w.includes(e)));
  }

  async function generateAIAffirmation(input) {
    await new Promise(r => setTimeout(r, 1500));
    const intensity = detectIntensity(input);
    const prefix = { high: "I hear the weight of what you're carrying.", medium: "I understand this is challenging for you.", low: "I acknowledge what you're experiencing." }[intensity] || "I acknowledge what you're experiencing.";
    const emotional = extractEmotionalWords(input);
    const transformation = emotional.length
      ? `You're transforming ${emotional.join(', ')} into strength and clarity.`
      : "You're transforming difficulty into growth.";
    return {
      affirmation: `${prefix} ${transformation} Every step forward, no matter how small, is proof of your resilience and courage.`,
      source: 'ai-generated',
      personalized: true
    };
  }

  // ---------------------------
  // Journal Entry Processing
  // ---------------------------
  function generateInsight() {
    const insights = [
      "This experience is shaping your emotional intelligence.",
      "Acknowledging these feelings is a sign of self-awareness and growth.",
      "You're learning valuable lessons about yourself through this.",
      "This moment of reflection shows your commitment to personal growth.",
      "Processing these emotions is an act of self-compassion."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }

  async function processJournalEntry(situation, feelings) {
    const result = await flip(`${situation} ${feelings}`);
    return { ...result, journalSpecific: true, situation, feelings, insight: generateInsight() };
  }

  // ---------------------------
  // Analytics & Insights
  // ---------------------------
  function analyzeUsagePatterns(history) {
    const categories = {}, timePatterns = {}, intensityTrends = [];
    for (const entry of history) {
      if (entry.category) categories[entry.category] = (categories[entry.category] || 0) + 1;
      if (entry.timestamp) {
        const h = new Date(entry.timestamp).getHours();
        const t = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
        timePatterns[t] = (timePatterns[t] || 0) + 1;
      }
      if (entry.intensity) intensityTrends.push({ date: entry.timestamp, intensity: entry.intensity });
    }
    return {
      topCategories: Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5),
      timePatterns,
      intensityTrends,
      totalFlips: history.length
    };
  }

  function formatCategoryName(cat) {
    if (!cat) return '';
    return cat.replace(/_/g, ' ').replace(/&/g, 'and')
      .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  function generateRecommendations(analysis, customAffirmations) {
    const recs = [];
    if (analysis.topCategories.length) {
      recs.push({ type: 'category', message: `You've been working on ${formatCategoryName(analysis.topCategories[0][0])}. Consider exploring related categories like self-compassion or gratitude.`, action: 'explore_categories' });
    }
    if ((analysis.timePatterns.evening || 0) > (analysis.timePatterns.morning || 0)) {
      recs.push({ type: 'timing', message: 'You tend to flip more in the evening. Try morning affirmations to start your day positively.', action: 'set_reminder' });
    }
    if (analysis.intensityTrends.slice(-7).filter(t => t.intensity === 'high').length >= 3) {
      recs.push({ type: 'support', message: 'You\'ve been dealing with intense emotions. Consider journaling or reaching out to someone you trust.', action: 'open_journal' });
    }
    if (customAffirmations.length < 3) {
      recs.push({ type: 'custom', message: 'Create custom affirmations that resonate deeply with your personal journey.', action: 'create_custom' });
    }
    return recs;
  }

  // ---------------------------
  // Social Sharing — Generate Card
  // ---------------------------
  function generateShareCard(affirmation, category, canvas) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#3F7652');
    gradient.addColorStop(1, '#5FAF7A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (category) {
      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(formatCategoryName(category).toUpperCase(), width / 2, 150);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    const words = affirmation.split(' ');
    const lines = [];
    let cur = '';
    for (const word of words) {
      const test = cur + word + ' ';
      if (ctx.measureText(test).width > width - 200 && cur) { lines.push(cur); cur = word + ' '; }
      else cur = test;
    }
    lines.push(cur);

    const lineH = 80;
    const startY = height / 2 - ((lines.length - 1) * lineH / 2);
    lines.forEach((line, i) => ctx.fillText(line.trim(), width / 2, startY + i * lineH));

    ctx.font = '35px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Flip The Script', width / 2, height - 100);
    return canvas;
  }

  // ---------------------------
  // Export affirmations as text file
  // ⚠️ FLAG: named exportToPDF but exports .txt — rename if desired.
  // ---------------------------
  async function exportToPDF(savedFlips) {
    const sep = '='.repeat(50);
    const favorites = savedFlips.filter(f => f.favorite);
    const regular   = savedFlips.filter(f => !f.favorite);

    const formatList = (list) => list.map((f, i) => {
      let s = `${i + 1}. ${f.text}\n`;
      if (f.tags?.length) s += `   Tags: ${f.tags.map(t => '#' + t).join(', ')}\n`;
      return s;
    }).join('\n');

    let content = `FLIP THE SCRIPT - MY AFFIRMATIONS\n${sep}\n\nGenerated: ${new Date().toLocaleDateString()}\nTotal Affirmations: ${savedFlips.length}\n\n${sep}\n\n`;
    if (favorites.length) content += `FAVORITE AFFIRMATIONS\n\n${formatList(favorites)}\n\n`;
    if (regular.length)   content += `ALL AFFIRMATIONS\n\n${formatList(regular)}`;

    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    const a   = Object.assign(document.createElement('a'), {
      href: url,
      download: `FlipTheScript_Affirmations_${new Date().toISOString().split('T')[0]}.txt`
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return true;
  }

  // ---------------------------
  // Reminder System
  // ---------------------------
  function scheduleReminder(time) {
    const [h, m] = time.split(':').map(Number);
    const hours   = Number.isInteger(h) ? h : 9;
    const minutes = Number.isInteger(m) ? m : 0;
    const now  = new Date();
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    setTimeout(() => { showReminderNotification(); scheduleReminder(time); }, next - now);
    return next;
  }

  function showReminderNotification() {
    if (Notification.permission !== 'granted') return;
    const msgs = ["Time to flip your thoughts!", "Ready to transform negativity into positivity?", "Let's turn today's challenges into affirmations!", "Your daily flip awaits!", "Time for some positive self-talk!"];
    new Notification('Flip The Script', { body: msgs[Math.floor(Math.random() * msgs.length)], tag: 'flip-reminder', requireInteraction: false });
  }

  function setupReminder(time, enabled) {
    if (!enabled || !('Notification' in window)) return { success: false, message: 'Notifications not supported' };
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(p => { if (p === 'granted') scheduleReminder(time); });
    } else if (Notification.permission === 'granted') {
      scheduleReminder(time);
    }
    ls.set('reminderSettings', JSON.stringify({ time, enabled }));
    return { success: true, message: 'Reminder set!' };
  }

  // ---------------------------
  // Custom Affirmation Management
  // ---------------------------
  function saveCustomAffirmation(text, category, tags) {
    const safeText = String(text || '').trim().slice(0, 500);
    if (!safeText) return null;
    const safeCategory = CATEGORY_KEYS.includes(category) ? category : 'general_positive_affirmations';
    const safeTags = (Array.isArray(tags) ? tags : String(tags || '').split(','))
      .map(t => String(t).trim().toLowerCase().slice(0, 50)).filter(Boolean);

    const custom = { text: safeText, category: safeCategory, tags: safeTags, created: new Date().toISOString(), custom: true, id: Date.now().toString(36) + Math.random().toString(36).slice(2) };
    const customs = getCustomAffirmations();
    customs.push(custom);
    ls.set('customAffirmations', JSON.stringify(customs));
    return custom;
  }

  function getCustomAffirmations() {
    try { return JSON.parse(ls.get('customAffirmations') || '[]'); } catch { return []; }
  }

  function deleteCustomAffirmation(id) {
    const safeId = String(id || '').slice(0, 100);
    ls.set('customAffirmations', JSON.stringify(getCustomAffirmations().filter(c => c.id !== safeId)));
    return true;
  }

  // ⚠️ FLAG: getAffirmationsWithCustom previously mutated frozen window.affirmations arrays (push on frozen = throw in strict mode).
  // Fixed: returns a plain copy merged with custom entries, never mutates originals.
  function getAffirmationsWithCustom() {
    const base = {};
    if (window.affirmations) {
      for (const [k, v] of Object.entries(window.affirmations)) base[k] = [...v];
    }
    for (const custom of getCustomAffirmations()) {
      const cat = custom.category;
      if (!base[cat]) base[cat] = [];
      base[cat].push({ text: custom.text, tags: custom.tags, custom: true });
    }
    return base;
  }

  // ---------------------------
  // Sentiment Analysis
  // ---------------------------
  function analyzeSentiment(text) {
    const pos = ['good','great','happy','joy','love','amazing','wonderful','excellent','positive'];
    const neg = ['bad','sad','hate','angry','terrible','awful','horrible','negative','worst'];
    const words = text.toLowerCase().split(/\s+/);
    let p = 0, n = 0;
    for (const w of words) {
      if (pos.some(x => w.includes(x))) p++;
      if (neg.some(x => w.includes(x))) n++;
    }
    const total = p + n;
    if (!total) return { sentiment: 'neutral', score: 0 };
    const score = (p - n) / total;
    return { sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral', score };
  }

  // ---------------------------
  // Expose Full API
  // ---------------------------
  global.FlipEngine = Object.freeze({
    flip, flipBasic, flipExpanded, categorizeInput,
    getRelatedAffirmations, detectIntensity, detectTone,
    generateAIAffirmation, processJournalEntry,
    analyzeUsagePatterns, generateRecommendations,
    generateShareCard, exportToPDF,
    setupReminder, scheduleReminder, showReminderNotification,
    saveCustomAffirmation, getCustomAffirmations, deleteCustomAffirmation, getAffirmationsWithCustom,
    analyzeSentiment, formatCategoryName,
    _helpers:  Object.freeze({ extractEmotionalWords, generateInsight }),
    _internal: Object.freeze({ buildIndexes, scoreCategories, composeExpandedLocal, tokenize, detectPhrases })
  });

  buildIndexes();
})(window);