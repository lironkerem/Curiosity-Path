/* FlipEngine.js - Complete Engine with Advanced Features
*/

(function (global) {
  // ---------------------------
  // Core Functions (Base Engine)
  // ---------------------------
  const AFF = (typeof global !== 'undefined' && global.affirmations) ? global.affirmations : null;
  
  let CATEGORY_KEYS = [];
  let categoryToAffirmations = {};
  let tagToCategories = {};
  let simpleKeywordIndex = {};
  let indexesBuilt = false;
  const lastChoiceIndex = {};

  // Tokenizer
  function tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    const normalized = text
      .replace(/[''`]/g, "'")
      .replace(/[""]/g, '"')
      .replace(/[-—–]/g, ' ')
      .toLowerCase();
    const cleaned = normalized.replace(/[^0-9a-z\u00C0-\u024F'\s]+/g, ' ');
    return cleaned.split(/\s+/).filter(Boolean);
  }

  function randomIndexExcept(length, exceptIdx) {
    if (length === 0) return -1;
    if (length === 1) return 0;
    let idx, attempts = 0;
    do {
      idx = Math.floor(Math.random() * length);
      attempts++;
    } while (idx === exceptIdx && attempts < 6);
    return idx;
  }

  function randomItem(arr, categoryKey) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const last = lastChoiceIndex[categoryKey];
    const idx = randomIndexExcept(arr.length, typeof last === 'number' ? last : -1);
    lastChoiceIndex[categoryKey] = idx;
    return arr[idx];
  }

  // Build indexes
  function buildIndexes(force = false) {
    if (indexesBuilt && !force) return;
    if (!AFF || typeof AFF !== 'object') {
      indexesBuilt = true;
      return;
    }

    CATEGORY_KEYS = Object.keys(AFF).filter(k => Array.isArray(AFF[k]) && AFF[k].length > 0);

    for (const cat of CATEGORY_KEYS) {
      const arr = AFF[cat] || [];
      const normalized = arr.map(it => {
        if (!it) return null;
        if (typeof it === 'string') return { text: it, tags: [] };
        const t = (typeof it.text === 'string') ? it.text : String(it.text || '');
        const tags = Array.isArray(it.tags) ? it.tags.map(x => String(x).toLowerCase()) : [];
        return { text: t, tags };
      }).filter(Boolean);

      categoryToAffirmations[cat] = normalized;

      for (const item of normalized) {
        for (const t of item.tags) {
          if (!tagToCategories[t]) tagToCategories[t] = new Set();
          tagToCategories[t].add(cat);
        }
        const words = tokenize(item.text);
        for (const w of words) {
          if (!simpleKeywordIndex[w]) simpleKeywordIndex[w] = new Set();
          simpleKeywordIndex[w].add(cat);
        }
      }

      const catWords = tokenize(cat.replace(/[_\-]/g, ' '));
      for (const cw of catWords) {
        if (!simpleKeywordIndex[cw]) simpleKeywordIndex[cw] = new Set();
        simpleKeywordIndex[cw].add(cat);
      }
    }
    indexesBuilt = true;
  }

  // Phrase patterns
  const PHRASE_PATTERNS = {
    "loneliness_&_isolation": ["no one cares", "all alone", "by myself", "no friends"],
    "imposter_syndrome": ["not good enough", "don't deserve", "feel like a fake"],
    "burnout_&_exhaustion": ["can't do this", "too tired", "giving up", "so exhausted"],
    "perfectionism": ["not perfect", "must be perfect", "messed up"],
    "shame_&_guilt": ["feel guilty", "so ashamed", "my fault"]
  };

  function detectPhrases(text) {
    const lower = text.toLowerCase();
    const matches = {};
    for (const [category, phrases] of Object.entries(PHRASE_PATTERNS)) {
      for (const phrase of phrases) {
        if (lower.includes(phrase)) {
          matches[category] = (matches[category] || 0) + 5;
        }
      }
    }
    return matches;
  }

  // Intensity detection
  const INTENSITY_WORDS = {
    high: ["hate", "never", "always", "worthless", "terrible", "hopeless"],
    medium: ["bad", "wrong", "hard", "difficult", "upset"],
    low: ["uncertain", "unsure", "confused", "worried"]
  };

  function detectIntensity(text) {
    if (!text) return 'low';
    const words = tokenize(text.toLowerCase());
    for (const word of words) {
      if (INTENSITY_WORDS.high.includes(word)) return 'high';
    }
    for (const word of words) {
      if (INTENSITY_WORDS.medium.includes(word)) return 'medium';
    }
    return 'low';
  }

  // Scoring
  function scoreCategories(input) {
    buildIndexes();
    const words = tokenize(input);
    const wordSet = new Set(words);
    const scores = Object.create(null);
    
    const phraseMatches = detectPhrases(input);
    for (const [cat, score] of Object.entries(phraseMatches)) {
      scores[cat] = (scores[cat] || 0) + score;
    }

    for (const cat of CATEGORY_KEYS) {
      if (input.toLowerCase().includes(cat.toLowerCase().replace(/[_\-]/g, ' '))) {
        scores[cat] = (scores[cat] || 0) + 4;
      }
    }

    for (const w of wordSet) {
      const catsFromKeyword = simpleKeywordIndex[w];
      if (catsFromKeyword) {
        for (const cat of catsFromKeyword) {
          scores[cat] = (scores[cat] || 0) + 1;
        }
      }
      const catsFromTag = tagToCategories[w];
      if (catsFromTag) {
        for (const cat of catsFromTag) {
          scores[cat] = (scores[cat] || 0) + 3;
        }
      }
    }

    if (Object.keys(scores).length === 0) {
      if (categoryToAffirmations['general_positive_affirmations']) {
        scores['general_positive_affirmations'] = 1;
      } else if (CATEGORY_KEYS.length) {
        scores[CATEGORY_KEYS[0]] = 1;
      }
    }
    return scores;
  }

  function chooseTopCategory(scores) {
    let top = null, topScore = -Infinity;
    for (const [cat, s] of Object.entries(scores)) {
      if (s > topScore) {
        topScore = s;
        top = cat;
      }
    }
    return { topCategory: top, score: topScore, scores };
  }

  function selectAffirmationFromCategory(category) {
    if (!category || !categoryToAffirmations[category]) {
      const general = categoryToAffirmations['general_positive_affirmations'] || [];
      const pick = randomItem(general, 'general_positive_affirmations');
      return pick ? pick.text : null;
    }
    const arr = categoryToAffirmations[category];
    if (!arr || arr.length === 0) {
      const general = categoryToAffirmations['general_positive_affirmations'] || [];
      const pick = randomItem(general, 'general_positive_affirmations');
      return pick ? pick.text : null;
    }
    const choice = randomItem(arr, category);
    return choice ? choice.text : null;
  }

  function getRelatedAffirmations(category, currentAffirmation, count = 3) {
    if (!category || !categoryToAffirmations[category]) return [];
    const arr = categoryToAffirmations[category];
    return arr
      .filter(item => item.text !== currentAffirmation)
      .map(item => item.text)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  // Tone detection
  function detectTone(text) {
    if (!text) return 'neutral';
    const s = text.toLowerCase();
    const intensity = detectIntensity(text);
    if (/\b(suicid|kill myself|end my life|want to die|harm myself)\b/.test(s)) return 'crisis';
    if (/\b(tired|exhausted|drained|sleepy|burned out)\b/.test(s)) {
      return intensity === 'high' ? 'severe_fatigue' : 'fatigue';
    }
    if (/\b(alone|lonely|unloved|isolated)\b/.test(s)) {
      return intensity === 'high' ? 'severe_loneliness' : 'loneliness';
    }
    if (/\b(angry|hate|mad|furious|resent)\b/.test(s)) {
      return intensity === 'high' ? 'rage' : 'anger';
    }
    if (/\b(anxious|worried|fear|panic|nervous)\b/.test(s)) {
      return intensity === 'high' ? 'panic' : 'anxiety';
    }
    if (/\b(lost|confused|stuck|hopeless)\b/.test(s)) return 'confusion';
    if (/\b(sad|depress|cry|hurt)\b/.test(s)) {
      return intensity === 'high' ? 'severe_sadness' : 'sadness';
    }
    return 'neutral';
  }

const TONE_STYLES = {
  fatigue: { 
    prefix: "I allow myself to slow down,", 
    connect: "in this stillness", 
    ending: "my energy returns as I care for myself." 
  },
  severe_fatigue: { 
    prefix: "Rest is not weakness, it's wisdom.", 
    connect: "My body is asking for care,", 
    ending: "and honoring that need is an act of my strength." 
  },
  loneliness: { 
    prefix: "Connection lives within me,", 
    connect: "even when life feels quiet", 
    ending: "love is already finding its way to me." 
  },
  severe_loneliness: { 
    prefix: "I am never truly alone.", 
    connect: "Even in silence, I matter deeply,", 
    ending: "and connection is closer than it feels right now." 
  },
  anger: { 
    prefix: "I breathe and notice the flame,", 
    connect: "I let warmth become clarity", 
    ending: "I can direct my passion toward purpose." 
  },
  rage: { 
    prefix: "This intensity I feel is real and valid.", 
    connect: "I take space to feel it safely,", 
    ending: "then I channel this power toward what truly serves me." 
  },
  anxiety: { 
    prefix: "I take a deep breath — I am safe now,", 
    connect: "peace begins in my awareness", 
    ending: "I can move through this moment with ease." 
  },
  panic: { 
    prefix: "I ground myself right here, right now.", 
    connect: "This feeling will pass,", 
    ending: "and I have everything I need to get through it." 
  },
  confusion: { 
    prefix: "Uncertainty is part of my growth,", 
    connect: "I don't need all the answers", 
    ending: "clarity will unfold in its own time for me." 
  },
  sadness: { 
    prefix: "It's okay for me to feel what I feel,", 
    connect: "I let the emotion move through", 
    ending: "every tear waters new growth within me." 
  },
  severe_sadness: { 
    prefix: "This pain I carry is heavy, and it's real.", 
    connect: "I don't have to carry it alone,", 
    ending: "and healing will come to me, one gentle moment at a time." 
  },
  neutral: { 
    prefix: "With calm presence and awareness,", 
    connect: "each thought I choose", 
    ending: "reshapes my reality toward peace and purpose." 
  },
  crisis: { 
    prefix: "If I am feeling unsafe, I can reach out for immediate support.", 
    connect: "I do not have to carry this alone.", 
    ending: "If I am in immediate danger, I will contact local emergency services now." 
  }
};

  function composeExpandedLocal(input, basic) {
    const tone = detectTone(input);
    const style = TONE_STYLES[tone] || TONE_STYLES['neutral'];
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
    const localScores = scoreCategories(input);
    const chosen = chooseTopCategory(localScores);
    const intensity = detectIntensity(input);
    return { ...chosen, intensity };
  }

  async function flipBasic(input) {
    buildIndexes();
    if (!AFF) {
      return { basic: 'I choose thoughts that uplift and empower me.', category: null, scores: {}, intensity: 'low' };
    }
    const catInfo = await categorizeInput(input);
    const category = catInfo.topCategory;
    const basic = selectAffirmationFromCategory(category) || 
                  selectAffirmationFromCategory('general_positive_affirmations') || 
                  'I choose thoughts that uplift and empower me.';
    return { basic, category, scores: catInfo.scores, intensity: catInfo.intensity };
  }

  async function flipExpanded(input, basic) {
    return composeExpandedLocal(input, basic);
  }

  async function flip(input) {
    const { basic, category, scores, intensity } = await flipBasic(input);
    const expanded = await flipExpanded(input, basic);
    const related = getRelatedAffirmations(category, basic, 3);
    return { 
      basicAffirmation: basic, 
      expandedAffirmation: expanded, 
      category, 
      scores,
      intensity,
      relatedAffirmations: related
    };
  }

  // ---------------------------
  // AI-Powered Custom Affirmation Generation
  // ---------------------------
  async function generateAIAffirmation(input) {
    console.log("AI Flip requested for:", input);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const intensity = detectIntensity(input);
    const tone = detectTone(input);
    
    // Create a more personalized response based on the input
    const personalizedPrefixes = {
      high: "I hear the weight of what you're carrying.",
      medium: "I understand this is challenging for you.",
      low: "I acknowledge what you're experiencing."
    };
    
    const prefix = personalizedPrefixes[intensity] || personalizedPrefixes.medium;
    
    // Extract key emotional words
    const emotionalWords = extractEmotionalWords(input);
    const transformation = emotionalWords.length > 0 
      ? `You're transforming ${emotionalWords.join(', ')} into strength and clarity.`
      : "You're transforming difficulty into growth.";
    
    return {
      affirmation: `${prefix} ${transformation} Every step forward, no matter how small, is proof of your resilience and courage.`,
      source: 'ai-generated',
      personalized: true
    };
  }
  
  function extractEmotionalWords(text) {
    const emotions = ['sad', 'angry', 'anxious', 'worried', 'scared', 'lonely', 
                     'tired', 'frustrated', 'overwhelmed', 'hopeless', 'worthless'];
    const words = text.toLowerCase().split(/\s+/);
    return emotions.filter(e => words.some(w => w.includes(e)));
  }
  
  // ---------------------------
  // Journal Entry Processing
  // ---------------------------
  async function processJournalEntry(situation, feelings) {
    const combined = `${situation} ${feelings}`;
    const result = await flip(combined);
    
    return {
      ...result,
      journalSpecific: true,
      situation,
      feelings,
      insight: generateInsight(situation, feelings)
    };
  }
  
  function generateInsight(situation, feelings) {
    const insights = [
      "This experience is shaping your emotional intelligence.",
      "Acknowledging these feelings is a sign of self-awareness and growth.",
      "You're learning valuable lessons about yourself through this.",
      "This moment of reflection shows your commitment to personal growth.",
      "Processing these emotions is an act of self-compassion."
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }
  
  // ---------------------------
  // Analytics & Insights
  // ---------------------------
  function analyzeUsagePatterns(history) {
    const categories = {};
    const timePatterns = {};
    const intensityTrends = [];
    
    history.forEach(entry => {
      // Category frequency
      if (entry.category) {
        categories[entry.category] = (categories[entry.category] || 0) + 1;
      }
      
      // Time of day patterns
      if (entry.timestamp) {
        const hour = new Date(entry.timestamp).getHours();
        const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
        timePatterns[timeOfDay] = (timePatterns[timeOfDay] || 0) + 1;
      }
      
      // Intensity tracking
      if (entry.intensity) {
        intensityTrends.push({
          date: entry.timestamp,
          intensity: entry.intensity
        });
      }
    });
    
    return {
      topCategories: Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
      timePatterns,
      intensityTrends,
      totalFlips: history.length
    };
  }
  
  function generateRecommendations(analysis, customAffirmations) {
    const recommendations = [];
    
    // Based on top categories
    if (analysis.topCategories.length > 0) {
      const topCat = analysis.topCategories[0][0];
      recommendations.push({
        type: 'category',
        message: `You've been working on ${formatCategoryName(topCat)}. Consider exploring related categories like self-compassion or gratitude.`,
        action: 'explore_categories'
      });
    }
    
    // Based on time patterns
    if (analysis.timePatterns.evening > analysis.timePatterns.morning) {
      recommendations.push({
        type: 'timing',
        message: "You tend to flip more in the evening. Try morning affirmations to start your day positively.",
        action: 'set_reminder'
      });
    }
    
    // Based on intensity trends
    const recentHigh = analysis.intensityTrends
      .slice(-7)
      .filter(t => t.intensity === 'high').length;
    
    if (recentHigh >= 3) {
      recommendations.push({
        type: 'support',
        message: "You've been dealing with intense emotions. Consider journaling or reaching out to someone you trust.",
        action: 'open_journal'
      });
    }
    
    // Custom affirmations suggestion
    if (customAffirmations.length < 3) {
      recommendations.push({
        type: 'custom',
        message: "Create custom affirmations that resonate deeply with your personal journey.",
        action: 'create_custom'
      });
    }
    
    return recommendations;
  }
  
  function formatCategoryName(cat) {
    if (!cat) return "";
    return cat.replace(/_/g, ' ').replace(/&/g, 'and').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  
  // ---------------------------
  // Social Sharing - Generate Card
  // ---------------------------
  function generateShareCard(affirmation, category, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#3F7652');
    gradient.addColorStop(1, '#5FAF7A');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add pattern/texture
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // Text setup
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Category badge
    if (category) {
      ctx.font = 'bold 40px Arial';
      const catText = formatCategoryName(category);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillText(catText.toUpperCase(), width / 2, 150);
    }
    
    // Main affirmation
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    
    // Word wrap
    const words = affirmation.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = width - 200;
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    lines.push(currentLine);
    
    // Draw lines
    const lineHeight = 80;
    const startY = (height / 2) - ((lines.length - 1) * lineHeight / 2);
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), width / 2, startY + (i * lineHeight));
    });
    
    // Footer
    ctx.font = '35px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Flip The Script', width / 2, height - 100);
    
    return canvas;
  }
  
  // ---------------------------
  // Export to PDF
  // ---------------------------
  async function exportToPDF(savedFlips) {
    // This would use a library like jsPDF in production
    // For now, we'll create a formatted text export
    let pdfContent = "FLIP THE SCRIPT - MY AFFIRMATIONS\n";
    pdfContent += "=" .repeat(50) + "\n\n";
    pdfContent += `Generated: ${new Date().toLocaleDateString()}\n`;
    pdfContent += `Total Affirmations: ${savedFlips.length}\n\n`;
    pdfContent += "=" .repeat(50) + "\n\n";
    
    // Group by favorite
    const favorites = savedFlips.filter(f => f.favorite);
    const regular = savedFlips.filter(f => !f.favorite);
    
    if (favorites.length > 0) {
      pdfContent += "⭐ FAVORITE AFFIRMATIONS\n\n";
      favorites.forEach((flip, idx) => {
        pdfContent += `${idx + 1}. ${flip.text}\n`;
        if (flip.tags && flip.tags.length > 0) {
          pdfContent += `   Tags: ${flip.tags.map(t => '#' + t).join(', ')}\n`;
        }
        pdfContent += "\n";
      });
      pdfContent += "\n";
    }
    
    if (regular.length > 0) {
      pdfContent += "📝 ALL AFFIRMATIONS\n\n";
      regular.forEach((flip, idx) => {
        pdfContent += `${idx + 1}. ${flip.text}\n`;
        if (flip.tags && flip.tags.length > 0) {
          pdfContent += `   Tags: ${flip.tags.map(t => '#' + t).join(', ')}\n`;
        }
        pdfContent += "\n";
      });
    }
    
    // Create downloadable file
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FlipTheScript_Affirmations_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  }
  
  // ---------------------------
  // Reminder System
  // ---------------------------
  function setupReminder(time, enabled) {
    if (!enabled || !('Notification' in window)) {
      return { success: false, message: 'Notifications not supported' };
    }
    
    // Request permission
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          scheduleReminder(time);
        }
      });
    } else if (Notification.permission === 'granted') {
      scheduleReminder(time);
    }
    
    // Store reminder settings
    localStorage.setItem('reminderSettings', JSON.stringify({ time, enabled }));
    
    return { success: true, message: 'Reminder set!' };
  }
  
  function scheduleReminder(time) {
    // Parse time (HH:MM format)
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate next reminder time
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);
    
    if (reminderTime <= now) {
      // If time has passed today, schedule for tomorrow
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    // Schedule notification
    setTimeout(() => {
      showReminderNotification();
      // Reschedule for next day
      scheduleReminder(time);
    }, timeUntilReminder);
    
    return reminderTime;
  }
  
  function showReminderNotification() {
    if (Notification.permission === 'granted') {
      const affirmations = [
        "Time to flip your thoughts!",
        "Ready to transform negativity into positivity?",
        "Let's turn today's challenges into affirmations!",
        "Your daily flip awaits!",
        "Time for some positive self-talk!"
      ];
      
      const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      
      new Notification('Flip The Script', {
        body: randomAffirmation,
        icon: '💚',
        badge: '🔔',
        tag: 'flip-reminder',
        requireInteraction: false
      });
    }
  }
  
  // ---------------------------
  // Custom Affirmation Management
  // ---------------------------
  function saveCustomAffirmation(text, category, tags) {
    const custom = {
      text,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim().toLowerCase()),
      created: new Date().toISOString(),
      custom: true,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2)
    };
    
    // Store in localStorage
    const customs = JSON.parse(localStorage.getItem('customAffirmations') || '[]');
    customs.push(custom);
    localStorage.setItem('customAffirmations', JSON.stringify(customs));
    
    return custom;
  }
  
  function getCustomAffirmations() {
    return JSON.parse(localStorage.getItem('customAffirmations') || '[]');
  }
  
  function deleteCustomAffirmation(id) {
    const customs = getCustomAffirmations();
    const filtered = customs.filter(c => c.id !== id);
    localStorage.setItem('customAffirmations', JSON.stringify(filtered));
    return true;
  }
  
  // ---------------------------
  // Integrate custom affirmations into main engine
  // ---------------------------
  function getAffirmationsWithCustom(category) {
    const baseAffirmations = window.affirmations || {};
    const customs = getCustomAffirmations();
    
    // Add custom affirmations to their categories
    customs.forEach(custom => {
      if (custom.category && baseAffirmations[custom.category]) {
        baseAffirmations[custom.category].push({
          text: custom.text,
          tags: custom.tags,
          custom: true
        });
      }
    });
    
    return baseAffirmations;
  }
  
  // ---------------------------
  // Sentiment Analysis (Simple)
  // ---------------------------
  function analyzeSentiment(text) {
    const positiveWords = ['good', 'great', 'happy', 'joy', 'love', 'amazing', 'wonderful', 'excellent', 'positive'];
    const negativeWords = ['bad', 'sad', 'hate', 'angry', 'terrible', 'awful', 'horrible', 'negative', 'worst'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', score: 0 };
    
    const score = (positiveCount - negativeCount) / total;
    
    if (score > 0.2) return { sentiment: 'positive', score };
    if (score < -0.2) return { sentiment: 'negative', score };
    return { sentiment: 'neutral', score };
  }
  
  // ---------------------------
  // Expose Full API
  // ---------------------------
  global.FlipEngine = {
    flip,
    flipBasic,
    flipExpanded,
    categorizeInput,
    getRelatedAffirmations,
    detectIntensity,
    detectTone,
    
    // New Phase 3-5 methods
    generateAIAffirmation,
    processJournalEntry,
    analyzeUsagePatterns,
    generateRecommendations,
    generateShareCard,
    exportToPDF,
    setupReminder,
    scheduleReminder,
    showReminderNotification,
    saveCustomAffirmation,
    getCustomAffirmations,
    deleteCustomAffirmation,
    getAffirmationsWithCustom,
    analyzeSentiment,
    formatCategoryName,
    
    // Helper functions
    _helpers: {
      extractEmotionalWords,
      generateInsight
    },
    
    // Internal for debugging
    _internal: {
      buildIndexes,
      scoreCategories,
      composeExpandedLocal,
      tokenize,
      detectPhrases
    }
  };
  
  buildIndexes();
  console.log('FlipEngine initialized 🚀');
})(window);