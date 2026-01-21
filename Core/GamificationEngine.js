// =========================================================
//  GamificationEngine.js — Optimized 56-Badge System
//  Part 1: Core Setup, State Management, Event System
// =========================================================

export class GamificationEngine {
  constructor(app) {
    this.app = app;
    this.listeners = {};
    this.state = this.loadState() || this.defaultState();
    this.badgeCheckQueue = new Set();
    this.saveTimeout = null;
    this.initializeQuests();

    // Defer initial badge check until AppState is ready
    if (this.app?.state?.ready) {
      this.app.state.ready.then(() => this.checkAllBadges());
    } else {
      Promise.resolve().then(() => this.checkAllBadges());
    }
  }

  /* ---------------------------------------------------------
     DEFAULT STATE
  --------------------------------------------------------- */
  defaultState() {
    return {
      xp: 0,
      level: 1,
      karma: 0,
      streak: { current: 0, lastCheckIn: null },
      completedSessions: { daily: 0, weekly: 0 },
      badges: [],
      unlockedFeatures: [],
      quests: { daily: [], weekly: [], monthly: [] },
      logs: [],
      totalWellnessRuns: 0,
      totalTarotSpreads: 0,
      totalJournalEntries: 0,
      totalHappinessViews: 0,
      weeklyQuestCompletions: 0,
      monthlyQuestCompletions: 0,
      dailyQuestCompletions: 0,
      totalQuestCompletions: 0,
      dailyQuestStreak: 0,
      _bulkMode: false,
      settings: {
        xpPerAction: 10,
        xpPerLevel: 100,
        streakResetDays: 1,
        synergyBonus: 10
      }
    };
  }

  /* ---------------------------------------------------------
     QUESTS HUB
  --------------------------------------------------------- */

getQuestDefinitions() {
  return {
    daily: [
      {
        id: 'gratitude_entry',
        tab: 'gratitude',
        icon: '❤️',
        name: 'Daily Gratitude Practice',
        inspirational: 'Gratitude transforms what we have into enough.',
        target: 'Log 10 gratitudes (any entries) to complete this quest.',
        goal: 10,
        progress: 0,
        xpReward: 20,
        completed: false,
        karmaReward: 2
      },
      {
        id: 'journal_entry',
        tab: 'journal',
        icon: '📔',
        name: 'Daily Journaling',
        inspirational: 'Writing clarifies thoughts and soothes the soul.',
        target: 'Save 1 journal entry to complete this quest.',
        goal: 1,
        progress: 0,
        xpReward: 35,
        completed: false,
        karmaReward: 3
      },
      {
        id: 'tarot_spread',
        tab: 'tarot',
        icon: '🃏',
        name: 'Daily Tarot Spread',
        inspirational: 'The cards reveal what the heart already knows.',
        target: 'Complete one 6-card (or larger) spread to complete this quest.',
        goal: 1,
        progress: 0,
        xpReward: 25,
        completed: false,
        karmaReward: 2
      },
      {
        id: 'meditation_session',
        tab: 'meditations',
        icon: '🧘',
        name: 'Daily Meditation',
        inspirational: 'Peace begins within.',
        target: 'Finish 1 meditation session to complete this quest.',
        goal: 1,
        progress: 0,
        xpReward: 30,
        completed: false,
        karmaReward: 3
      },
      {
        id: 'energy_checkin',
        tab: 'energy',
        icon: '⚡',
        name: 'Daily Energy Check-in',
        inspirational: 'Awareness is the first step to transformation.',
        target: 'Tick both day ☀️ and night 🌙 check-ins to complete this quest.',
        goal: 2,
        progress: 0,
        xpReward: 20,
        completed: false,
        karmaReward: 2,
        subProgress: { day: false, night: false }
      },
      {
        id: 'daily_booster',
        tab: 'happiness',
        icon: '✨',
        name: 'Daily Affirmations/Boosters',
        inspirational: 'Joy is a practice, not a destination.',
        target: 'Refresh any happiness card 5 times to complete this quest.',
        goal: 5,
        progress: 0,
        xpReward: 15,
        completed: false,
        karmaReward: 1
      }
    ],
    weekly: [
      {
        id: 'gratitude_streak_7',
        icon: '💖',
        name: 'A Gratitude Streak',
        inspirational: 'Consistency breeds abundance.',
        target: 'Log 70 gratitudes across the week to complete this quest.',
        goal: 70,
        progress: 0,
        xpReward: 100,
        completed: false,
        karmaReward: 10
      },
      {
        id: 'journal_5',
        icon: '📝',
        name: 'Journal Writer',
        inspirational: 'Your story matters.',
        target: 'Save 5 journal entries across the week to complete this quest.',
        goal: 5,
        progress: 0,
        xpReward: 150,
        completed: false,
        karmaReward: 15
      },
      {
        id: 'energy_7',
        icon: '⚡',
        name: 'Weekly Energy Check-ins',
        inspirational: 'Track your rhythm, honor your cycles.',
        target: 'Tick 14 energy check-ins (day & night) across the week to complete this quest.',
        goal: 14,
        progress: 0,
        xpReward: 80,
        completed: false,
        karmaReward: 8
      },
      {
        id: 'happiness_boosters_20',
        icon: '🎨',
        name: 'Happy and Motivated Week',
        inspirational: 'Feed your mind with positivity.',
        target: 'Refresh happiness cards 35 times across the week to complete this quest.',
        goal: 35,
        progress: 0,
        xpReward: 120,
        completed: false,
        karmaReward: 12
      },
      {
        id: 'tarot_4_days',
        icon: '🔮',
        name: 'Tarot Lover',
        inspirational: 'Seek wisdom in the cards.',
        target: 'Complete five 6-card (or larger) spreads across the week to complete this quest.',
        goal: 5,
        progress: 0,
        xpReward: 100,
        completed: false,
        karmaReward: 10
      },
      {
        id: 'meditate_3',
        icon: '🌟',
        name: 'Meditating Adept',
        inspirational: 'Stillness is strength.',
        target: 'Finish 5 meditation sessions across the week to complete this quest.',
        goal: 5,
        progress: 0,
        xpReward: 120,
        completed: false,
        karmaReward: 12
      }
    ],
    monthly: [
      {
        id: 'monthly_energy_28',
        icon: '⚡',
        name: 'Monthly Energy Check-ins',
        inspirational: 'Know thyself through daily awareness.',
        target: 'Tick 60 energy check-ins (day & night) during the month to complete this quest.',
        goal: 60,
        progress: 0,
        xpReward: 300,
        completed: false,
        karmaReward: 30
      },
      {
        id: 'monthly_tarot_15',
        icon: '🔮',
        name: 'Tarot Enthusiast',
        inspirational: 'The universe speaks through symbols.',
        target: 'Complete twenty 6-card (or larger) spreads during the month to complete this quest.',
        goal: 20,
        progress: 0,
        xpReward: 400,
        completed: false,
        karmaReward: 40
      },
      {
        id: 'monthly_gratitude_28',
        icon: '💖',
        name: 'Gratitude Master',
        inspirational: 'Gratitude unlocks the fullness of life.',
        target: 'Log 300 gratitudes during the month to complete this quest.',
        goal: 300,
        progress: 0,
        xpReward: 350,
        completed: false,
        karmaReward: 35
      },
      {
        id: 'monthly_journal_20',
        icon: '📝',
        name: 'A Journalist',
        inspirational: 'Write to understand, reflect to grow.',
        target: 'Save 20 journal entries during the month to complete this quest.',
        goal: 20,
        progress: 0,
        xpReward: 500,
        completed: false,
        karmaReward: 50
      },
      {
        id: 'monthly_happiness_100',
        icon: '🎨',
        name: 'Super Good Month',
        inspirational: 'Choose joy every single day.',
        target: 'Refresh happiness cards 150 times during the month to complete this quest.',
        goal: 150,
        progress: 0,
        xpReward: 450,
        completed: false,
        karmaReward: 45
      },
      {
        id: 'monthly_meditation_15',
        icon: '🌟',
        name: 'Meditating Healer',
        inspirational: 'Through stillness, we find our true power.',
        target: 'Finish 20 meditation sessions during the month to complete this quest.',
        goal: 20,
        progress: 0,
        xpReward: 600,
        completed: false,
        karmaReward: 60
      }
    ]
  };
}

  /* ---------------------------------------------------------
     CLOUD + LOCAL PERSISTENCE (with error handling)
  --------------------------------------------------------- */
  saveState() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('gamificationState', JSON.stringify(this.state));
        if (this.app?.state) {
          this.app.state.data = { ...this.app.state.data, ...this.state };
          this.app.state.saveAppData();
        }
      } catch (error) {
        console.error('Failed to save gamification state:', error);
      }
    }, 100);
  }

  loadState() {
    try {
      if (this.app?.state?.data && this.app.state.data.xp !== undefined) {
        const cloud = { ...this.app.state.data };
        const deprecated = ['streak.best', 'streak.lastCheckIn', 'energyLevel',
          'alignmentScore', 'chakraProgress', 'totalPracticeMinutes'];
        deprecated.forEach(field => {
          const parts = field.split('.');
          if (parts.length === 2) {
            if (cloud[parts[0]]) delete cloud[parts[0]][parts[1]];
          } else {
            delete cloud[field];
          }
        });
        return { ...this.defaultState(), ...cloud };
      }
      const local = localStorage.getItem('gamificationState');
      if (local) return { ...this.defaultState(), ...JSON.parse(local) };
      return null;
    } catch (error) {
      console.error('Failed to load gamification state:', error);
      return null;
    }
  }

  async reloadFromDatabase() {
    if (!this.app?.state) return;
    try {
      await this.app.state.loadAppData();
      this.state = this.loadState();
      this.emit('stateReloaded', this.state);
      this.checkAllBadges();
      console.log('✅ Gamification state reloaded from database');
    } catch (error) {
      console.error('Failed to reload gamification state:', error);
    }
  }

  /* ---------------------------------------------------------
     EVENT BUS (with cleanup)
  --------------------------------------------------------- */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try { cb(data); } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
  destroy() {
    clearTimeout(this.saveTimeout);
    this.listeners = {};
  }

  /* ---------------------------------------------------------
     LIFETIME COUNTERS (optimized with category checks)
  --------------------------------------------------------- */
  incrementWellnessRuns() {
    this.state.totalWellnessRuns += 1;
    this.queueBadgeCheck('wellness');
    this.saveState();
    this.emit('wellnessRunCompleted', this.state.totalWellnessRuns);
  }
  incrementTarotSpreads() {
    this.state.totalTarotSpreads += 1;
    this.queueBadgeCheck('tarot');
    this.saveState();
    this.emit('tarotSpreadCompleted', this.state.totalTarotSpreads);
  }
  incrementJournalEntries() {
    this.state.totalJournalEntries += 1;
    this.queueBadgeCheck('journal');
    this.saveState();
    this.emit('journalEntrySaved', this.state.totalJournalEntries);
  }
  incrementHappinessViews() {
    this.state.totalHappinessViews += 1;
    this.queueBadgeCheck('happiness');
    this.saveState();
    this.emit('happinessViewAdded', this.state.totalHappinessViews);
  }

  /* ---------------------------------------------------------
     OPTIMIZED BADGE CHECKING (category-based + debounced)
  --------------------------------------------------------- */
  queueBadgeCheck(category) {
    this.badgeCheckQueue.add(category);
    this.debouncedBadgeCheck();
  }
  debouncedBadgeCheck = this.debounce(() => {
    const categories = Array.from(this.badgeCheckQueue);
    this.badgeCheckQueue.clear();
    if (categories.includes('all')) this.checkAllBadges();
    else categories.forEach(cat => this.checkBadgeCategory(cat));
  }, 300);
  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ---------------------------------------------------------
     CACHED DATA ACCESS
  --------------------------------------------------------- */
  get currentData() {
    return this.app?.state?.data || {};
  }
  getCounts() {
    const data = this.currentData;
    return {
      gratitude: (data.gratitudeEntries || []).length,
      journal: (data.journalEntries || []).length,
      energy: (data.energyEntries || []).length,
      tarot: this.state.totalTarotSpreads || 0,
      meditation: (data.meditationHistory || []).length,
      happiness: this.state.totalHappinessViews || 0,
      wellness: this.state.totalWellnessRuns || 0
    };
  }

  /* ---------------------------------------------------------
     XP / KARMA / LEVEL
  --------------------------------------------------------- */
  addXP(amount, source = 'general') {
    if (!amount || amount <= 0) return;
    let final = amount;
    if (this.hasActiveXPBoost()) final = amount * 2;
    this.state.xp += final;
    this.logAction('xp', { amount: final, source, boosted: final !== amount });
    this.emit('xpGained', { amount: final, source });
    this.checkLevelUp();
    this.queueBadgeCheck('currency');
    this.saveState();
  }
  addKarma(amount, source = 'general') {
    if (!amount || amount <= 0) return;
    this.state.karma += amount;
    this.logAction('karma', { amount, source });
    this.emit('karmaGained', { amount, source });
    this.queueBadgeCheck('currency');
    this.saveState();
  }
addBoth(xp, karma, source = 'general') {
  if (!xp && !karma) return;
  
  // Add XP silently
  if (xp > 0) {
    let final = xp;
    if (this.hasActiveXPBoost()) final = xp * 2;
    this.state.xp += final;
    this.logAction('xp', { amount: final, source, boosted: final !== xp });
    this.emit('xpGained', { amount: final, source, skipToast: true });
  }
  
  // Add Karma silently
  if (karma > 0) {
    this.state.karma += karma;
    this.logAction('karma', { amount: karma, source });
    this.emit('karmaGained', { amount: karma, source, skipToast: true });
  }
  
  // Show combined toast
  if (this.app?.showToast) {
    const parts = [];
    if (xp > 0) parts.push(`+${xp} XP`);
    if (karma > 0) parts.push(`+${karma} Karma`);
    this.app.showToast(`✅ ${parts.join(' ')} from ${source}`, 'success');
  }
  
  // Check level up and badges
  if (xp > 0) this.checkLevelUp();
  this.queueBadgeCheck('currency');
  this.saveState();
}
  hasActiveXPBoost() {
    try {
      const boosts = JSON.parse(localStorage.getItem('karma_active_boosts')) || [];
      const now = Date.now();
      return boosts.some(b => b.id === 'xp_multiplier' && b.expiresAt > now);
    } catch { return false; }
  }
  calculateLevel() {
    const ladder = [
      { level: 1, title: 'Seeker', xp: 0 },
      { level: 2, title: 'Practitioner', xp: 800 },
      { level: 3, title: 'Adept', xp: 2000 },
      { level: 4, title: 'Healer', xp: 4200 },
      { level: 5, title: 'Master', xp: 7000 },
      { level: 6, title: 'Sage', xp: 12000 },
      { level: 7, title: 'Enlightened', xp: 30000 },
      { level: 8, title: 'Buddha', xp: 60000 },
      { level: 9, title: 'Light', xp: 180000 },
      { level: 10, title: 'Emptiness', xp: 450000 }
    ];
    let i = ladder.length - 1;
    while (i > 0 && this.state.xp < ladder[i].xp) i--;
    const cur = ladder[i], next = ladder[i + 1] || ladder[i];
    const prog = next.xp === cur.xp ? 100 : ((this.state.xp - cur.xp) / (next.xp - cur.xp)) * 100;
    return { level: cur.level, title: cur.title, progress: Math.round(prog), pointsToNext: Math.max(0, next.xp - this.state.xp) };
  }
  checkLevelUp() {
    const prev = this.state.level;
    const { level, title } = this.calculateLevel();
    if (level > prev) {
      this.state.level = level;
      this.emit('levelUp', { level, title });
      this.addXP(50, `Level ${level}`);
      if (this.app?.showToast) this.app.showToast(`🎉 Level ${level} — ${title}  +50 XP`, 'success');
      showLevelUpSpectacle({ level, title, xp: 50, karma: 0 });
      this.queueBadgeCheck('level');
    }
  }

  /* ---------------------------------------------------------
     STREAK
  --------------------------------------------------------- */
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.streak.lastCheckIn === today) return;
    const last = this.state.streak.lastCheckIn ? new Date(this.state.streak.lastCheckIn) : null;
    const diff = last ? (new Date(today) - last) / (1000 * 60 * 60 * 24) : null;
    if (!last || diff > this.state.settings.streakResetDays) {
      this.state.streak.current = 1;
    } else {
      this.state.streak.current += 1;
    }
    this.state.streak.lastCheckIn = today;
    this.emit('streakUpdated', { current: this.state.streak.current });
    this.queueBadgeCheck('streak');
    this.saveState();
  }

  /* ---------------------------------------------------------
     BADGE DEFINITIONS - 56 TOTAL
  --------------------------------------------------------- */
  getBadgeDefinitions() {
    return {
      first_step: { name: 'First Step', icon: '🌱', description: 'Any first action in the app', xp: 10, rarity: 'common', category: 'first' },
      first_gratitude: { name: 'First Gratitude', icon: '💚', description: 'First gratitude entry', xp: 10, rarity: 'common', category: 'first' },
      first_journal: { name: 'First Journal', icon: '📝', description: 'First journal entry', xp: 10, rarity: 'common', category: 'first' },
      first_energy: { name: 'First Energy', icon: '⚡', description: 'First energy check-in', xp: 10, rarity: 'common', category: 'first' },
      first_tarot: { name: 'First Reading', icon: '🃏', description: 'First tarot spread', xp: 10, rarity: 'common', category: 'first' },
      first_meditation: { name: 'First Meditation', icon: '🧘', description: 'First meditation session', xp: 10, rarity: 'common', category: 'first' },
      first_purchase: { name: 'First Purchase', icon: '🛒', description: 'First purchase in the Karma Shop', xp: 50, rarity: 'epic', category: 'currency' },
      gratitude_warrior: { name: 'Gratitude Warrior', icon: '❤️', description: '30 gratitude entries', xp: 50, rarity: 'uncommon', category: 'gratitude' },
      gratitude_legend: { name: 'Gratitude Legend', icon: '💗', description: '100 gratitude entries', xp: 100, rarity: 'rare', category: 'gratitude' },
      gratitude_200: { name: 'Gratitude Sage', icon: '💖', description: '200 gratitude entries', xp: 200, rarity: 'epic', category: 'gratitude' },
      gratitude_500: { name: 'Gratitude Titan', icon: '💘', description: '500 gratitude entries', xp: 500, rarity: 'legendary', category: 'gratitude' },
      journal_keeper: { name: 'Journal Keeper', icon: '📓', description: '20 journal entries', xp: 50, rarity: 'uncommon', category: 'journal' },
      journal_master: { name: 'Journal Master', icon: '📚', description: '75 journal entries', xp: 100, rarity: 'rare', category: 'journal' },
      journal_150: { name: 'Journal Sage', icon: '📖', description: '150 journal entries', xp: 200, rarity: 'epic', category: 'journal' },
      journal_400: { name: 'Journal Titan', icon: '📜', description: '400 journal entries', xp: 500, rarity: 'legendary', category: 'journal' },
      energy_tracker: { name: 'Energy Tracker', icon: '⚡', description: '30 energy logs', xp: 50, rarity: 'uncommon', category: 'energy' },
      energy_sage: { name: 'Energy Sage', icon: '🔋', description: '100 energy logs', xp: 100, rarity: 'rare', category: 'energy' },
      energy_300: { name: 'Energy Titan', icon: '🔌', description: '300 energy logs', xp: 300, rarity: 'epic', category: 'energy' },
      energy_600: { name: 'Energy Legend', icon: '⚡️', description: '600 energy logs', xp: 600, rarity: 'legendary', category: 'energy' },
      tarot_apprentice: { name: 'Tarot Apprentice', icon: '🔮', description: '10 tarot spreads', xp: 25, rarity: 'common', category: 'tarot' },
      tarot_mystic: { name: 'Tarot Mystic', icon: '🃏', description: '25 tarot spreads', xp: 50, rarity: 'uncommon', category: 'tarot' },
      tarot_oracle: { name: 'Tarot Oracle', icon: '🌙', description: '75 tarot spreads', xp: 100, rarity: 'rare', category: 'tarot' },
      tarot_150: { name: 'Tarot Sage', icon: '🧙', description: '150 tarot spreads', xp: 200, rarity: 'epic', category: 'tarot' },
      tarot_400: { name: 'Tarot Titan', icon: '🔮', description: '400 tarot spreads', xp: 500, rarity: 'legendary', category: 'tarot' },
      meditation_devotee: { name: 'Meditation Devotee', icon: '🧘', description: '20 meditation sessions', xp: 50, rarity: 'uncommon', category: 'meditation' },
      meditation_master: { name: 'Meditation Master', icon: '🕉️', description: '60 meditation sessions', xp: 100, rarity: 'rare', category: 'meditation' },
      meditation_100: { name: 'Meditation Sage', icon: '🧘‍♂️', description: '100 meditation sessions', xp: 300, rarity: 'epic', category: 'meditation' },
      meditation_200: { name: 'Meditation Titan', icon: '🧘‍♀️', description: '200 meditation sessions', xp: 700, rarity: 'legendary', category: 'meditation' },
      happiness_seeker: { name: 'Happiness Seeker', icon: '😊', description: '50 happiness booster views', xp: 50, rarity: 'uncommon', category: 'happiness' },
      joy_master: { name: 'Joy Master', icon: '🎉', description: '150 happiness booster views', xp: 100, rarity: 'rare', category: 'happiness' },
      happiness_300: { name: 'Happiness Sage', icon: '😁', description: '300 happiness booster views', xp: 200, rarity: 'epic', category: 'happiness' },
      happiness_700: { name: 'Happiness Titan', icon: '🤩', description: '700 happiness booster views', xp: 500, rarity: 'legendary', category: 'happiness' },
      wellness_champion: { name: 'Wellness Champion', icon: '🌿', description: '50 wellness exercises', xp: 50, rarity: 'uncommon', category: 'wellness' },
      wellness_guru: { name: 'Wellness Guru', icon: '🌳', description: '150 wellness exercises', xp: 100, rarity: 'rare', category: 'wellness' },
      wellness_300: { name: 'Wellness Titan', icon: '🌲', description: '300 wellness exercises', xp: 300, rarity: 'epic', category: 'wellness' },
      wellness_700: { name: 'Wellness Legend', icon: '🌎', description: '700 wellness exercises', xp: 1000, rarity: 'legendary', category: 'wellness' },
      perfect_week: { name: 'Perfect Week', icon: '⭐', description: 'Complete all daily quests 7 days straight', xp: 75, rarity: 'rare', category: 'streak' },
      dedication_streak: { name: 'Dedication', icon: '💎', description: '30-day streak', xp: 100, rarity: 'epic', category: 'streak' },
      unstoppable: { name: 'Unstoppable', icon: '🔥', description: '60-day streak', xp: 150, rarity: 'epic', category: 'streak' },
      legendary_streak: { name: 'Legendary Streak', icon: '👑', description: '100-day streak', xp: 200, rarity: 'legendary', category: 'streak' },
      weekly_warrior: { name: 'Weekly Warrior', icon: '🔥', description: 'Finish every weekly quest 4 separate weeks', xp: 100, rarity: 'epic', category: 'quest' },
      monthly_master: { name: 'Monthly Master', icon: '🌟', description: 'Finish every monthly quest at least once', xp: 150, rarity: 'epic', category: 'quest' },
      quest_crusher: { name: 'Quest Crusher', icon: '🎯', description: '100 total quests (any type)', xp: 150, rarity: 'epic', category: 'quest' },
      daily_champion: { name: 'Daily Champion', icon: '⭐', description: 'Finish all dailies on 30 separate days', xp: 100, rarity: 'rare', category: 'quest' },
      karma_collector: { name: 'Karma Collector', icon: '💰', description: '500 karma accumulated', xp: 50, rarity: 'rare', category: 'currency' },
      karma_lord: { name: 'Karma Lord', icon: '💎', description: '2000 karma accumulated', xp: 200, rarity: 'legendary', category: 'currency' },
      xp_milestone: { name: 'XP Legend', icon: '⚡', description: '10000 XP earned', xp: 100, rarity: 'epic', category: 'currency' },
      xp_titan: { name: 'XP Titan', icon: '⚡', description: '50000 XP earned', xp: 200, rarity: 'legendary', category: 'currency' },
      level_5_hero: { name: 'Rising Star', icon: '🎯', description: 'Reach Level 5', xp: 100, rarity: 'epic', category: 'level' },
      level_7_hero: { name: 'Enlightened Soul', icon: '🌟', description: 'Reach Level 7', xp: 150, rarity: 'epic', category: 'level' },
      level_10_hero: { name: 'Enlightened Master', icon: '👑', description: 'Reach Level 10', xp: 300, rarity: 'legendary', category: 'level' },
      chakra_balancer: { name: 'Chakra Balancer', icon: '🌈', description: 'All 7 chakras ≥ 8 in one session', xp: 75, rarity: 'epic', category: 'chakra' },
      chakra_master: { name: 'Chakra Master', icon: '🎨', description: 'All 7 chakras ≥ 9 in one session', xp: 150, rarity: 'legendary', category: 'chakra' },
      triple_threat: { name: 'Triple Threat', icon: '🎪', description: 'Use 3 different features in one day', xp: 25, rarity: 'uncommon', category: 'cross' },
      super_day: { name: 'Super Day', icon: '💫', description: 'Gratitude + journal + energy + meditation in one day', xp: 50, rarity: 'rare', category: 'cross' },
      complete_explorer: { name: 'Complete Explorer', icon: '🗺️', description: 'Use every main feature at least once', xp: 100, rarity: 'epic', category: 'cross' },
      renaissance_soul: { name: 'Renaissance Soul', icon: '🎭', description: '≥ 10 actions in 5+ different features', xp: 150, rarity: 'epic', category: 'cross' }
    };
  }

  /* ---------------------------------------------------------
     OPTIMIZED BADGE CHECKING (category-based)
  --------------------------------------------------------- */
  checkBadgeCategory(category) {
    const badges = this.getBadgeDefinitions();
    const counts = this.getCounts();
    switch (category) {
      case 'gratitude': this.checkGratitudeBadges(badges, counts.gratitude); break;
      case 'journal': this.checkJournalBadges(badges, counts.journal); break;
      case 'energy': this.checkEnergyBadges(badges, counts.energy); break;
      case 'tarot': this.checkTarotBadges(badges, counts.tarot); break;
      case 'meditation': this.checkMeditationBadges(badges, counts.meditation); break;
      case 'happiness': this.checkHappinessBadges(badges, counts.happiness); break;
      case 'wellness': this.checkWellnessBadges(badges, counts.wellness); break;
      case 'streak': this.checkStreakBadges(badges); break;
      case 'quest': this.checkQuestBadges(badges); break;
      case 'currency': this.checkCurrencyBadges(badges); break;
      case 'level': this.checkLevelBadges(badges); break;
      case 'cross': this.checkCrossFeatureBadges(badges); break;
      default: break;
    }
  }
  checkGratitudeBadges(badges, count) {
    if (count >= 1) this.checkAndGrantBadge('first_gratitude', badges);
    if (count >= 30) this.checkAndGrantBadge('gratitude_warrior', badges);
    if (count >= 100) this.checkAndGrantBadge('gratitude_legend', badges);
    if (count >= 200) this.checkAndGrantBadge('gratitude_200', badges);
    if (count >= 500) this.checkAndGrantBadge('gratitude_500', badges);
  }
  checkJournalBadges(badges, count) {
    if (count >= 1) this.checkAndGrantBadge('first_journal', badges);
    if (count >= 20) this.checkAndGrantBadge('journal_keeper', badges);
    if (count >= 75) this.checkAndGrantBadge('journal_master', badges);
    if (count >= 150) this.checkAndGrantBadge('journal_150', badges);
    if (count >= 400) this.checkAndGrantBadge('journal_400', badges);
  }
  checkEnergyBadges(badges, count) {
    if (count >= 1) this.checkAndGrantBadge('first_energy', badges);
    if (count >= 30) this.checkAndGrantBadge('energy_tracker', badges);
    if (count >= 100) this.checkAndGrantBadge('energy_sage', badges);
    if (count >= 300) this.checkAndGrantBadge('energy_300', badges);
    if (count >= 600) this.checkAndGrantBadge('energy_600', badges);
  }
  checkTarotBadges(badges, count) {
    if (count >= 1) this.checkAndGrantBadge('first_tarot', badges);
    if (count >= 10) this.checkAndGrantBadge('tarot_apprentice', badges);
    if (count >= 25) this.checkAndGrantBadge('tarot_mystic', badges);
    if (count >= 75) this.checkAndGrantBadge('tarot_oracle', badges);
    if (count >= 150) this.checkAndGrantBadge('tarot_150', badges);
    if (count >= 400) this.checkAndGrantBadge('tarot_400', badges);
  }
  checkMeditationBadges(badges, count) {
    if (count >= 1) this.checkAndGrantBadge('first_meditation', badges);
    if (count >= 20) this.checkAndGrantBadge('meditation_devotee', badges);
    if (count >= 60) this.checkAndGrantBadge('meditation_master', badges);
    if (count >= 100) this.checkAndGrantBadge('meditation_100', badges);
    if (count >= 200) this.checkAndGrantBadge('meditation_200', badges);
  }
  checkHappinessBadges(badges, count) {
    if (count >= 50) this.checkAndGrantBadge('happiness_seeker', badges);
    if (count >= 150) this.checkAndGrantBadge('joy_master', badges);
    if (count >= 300) this.checkAndGrantBadge('happiness_300', badges);
    if (count >= 700) this.checkAndGrantBadge('happiness_700', badges);
  }
  checkWellnessBadges(badges, count) {
    if (count >= 50) this.checkAndGrantBadge('wellness_champion', badges);
    if (count >= 150) this.checkAndGrantBadge('wellness_guru', badges);
    if (count >= 300) this.checkAndGrantBadge('wellness_300', badges);
    if (count >= 700) this.checkAndGrantBadge('wellness_700', badges);
  }
  checkStreakBadges(badges) {
    const streak = this.state.streak?.current || 0;
    if (streak >= 7) this.checkAndGrantBadge('perfect_week', badges);
    if (streak >= 30) this.checkAndGrantBadge('dedication_streak', badges);
    if (streak >= 60) this.checkAndGrantBadge('unstoppable', badges);
    if (streak >= 100) this.checkAndGrantBadge('legendary_streak', badges);
  }
  checkLevelBadges(badges) {
    const level = this.calculateLevel().level;
    if (level >= 5) this.checkAndGrantBadge('level_5_hero', badges);
    if (level >= 7) this.checkAndGrantBadge('level_7_hero', badges);
    if (level >= 10) this.checkAndGrantBadge('level_10_hero', badges);
  }
  checkCurrencyBadges(badges) {
    if (this.state.karma >= 500) this.checkAndGrantBadge('karma_collector', badges);
    if (this.state.karma >= 2000) this.checkAndGrantBadge('karma_lord', badges);
    if (this.state.xp >= 10000) this.checkAndGrantBadge('xp_milestone', badges);
    if (this.state.xp >= 50000) this.checkAndGrantBadge('xp_titan', badges);
  }
  checkQuestBadges(badges) {
    if (this.state.weeklyQuestCompletions >= 4) this.checkAndGrantBadge('weekly_warrior', badges);
    if (this.state.monthlyQuestCompletions >= 1) this.checkAndGrantBadge('monthly_master', badges);
    if (this.state.totalQuestCompletions >= 100) this.checkAndGrantBadge('quest_crusher', badges);
    if (this.state.dailyQuestCompletions >= 30) this.checkAndGrantBadge('daily_champion', badges);
  }

  // =========================================================
  //  Part 3: Cross-Feature, Chakra, All-Badges, Granting, Quests
  // =========================================================
  checkCrossFeatureBadges(badges) {
    const data = this.currentData;
    const today = new Date().toDateString();
    const counts = this.getCounts();
    const totalActions = Object.values(counts).reduce((a, b) => a + b, 0);
    if (totalActions >= 1) this.checkAndGrantBadge('first_step', badges);
    const todayGratitude = (data.gratitudeEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayJournal = (data.journalEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayEnergy = (data.energyEntries || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayTarot = (data.tarotReadings || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayMeditation = (data.meditationHistory || []).some(e => new Date(e.timestamp).toDateString() === today);
    const todayFeatures = [todayGratitude, todayJournal, todayEnergy, todayTarot, todayMeditation].filter(Boolean).length;
    if (todayFeatures >= 3) this.checkAndGrantBadge('triple_threat', badges);
    if (todayGratitude && todayJournal && todayEnergy && todayMeditation) this.checkAndGrantBadge('super_day', badges);
    const usedFeatures = [counts.gratitude > 0, counts.journal > 0, counts.energy > 0, counts.tarot > 0, counts.meditation > 0, counts.happiness > 0, counts.wellness > 0];
    if (usedFeatures.every(Boolean)) this.checkAndGrantBadge('complete_explorer', badges);
    const featuresWithTenPlus = Object.values(counts).filter(c => c >= 10).length;
    if (featuresWithTenPlus >= 5) this.checkAndGrantBadge('renaissance_soul', badges);
  }
  checkChakraBadges(chakras) {
    const badges = this.getBadgeDefinitions();
    const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdEye', 'crown'];
    const all8Plus = chakraKeys.every(key => (chakras[key] || 0) >= 8);
    const all9Plus = chakraKeys.every(key => (chakras[key] || 0) >= 9);
    if (all8Plus) this.checkAndGrantBadge('chakra_balancer', badges);
    if (all9Plus) this.checkAndGrantBadge('chakra_master', badges);
  }
  checkAllBadges() {
    if (!this.app?.state?.data) return;
    const badges = this.getBadgeDefinitions();
    const counts = this.getCounts();
    this.checkGratitudeBadges(badges, counts.gratitude);
    this.checkJournalBadges(badges, counts.journal);
    this.checkEnergyBadges(badges, counts.energy);
    this.checkTarotBadges(badges, counts.tarot);
    this.checkMeditationBadges(badges, counts.meditation);
    this.checkHappinessBadges(badges, counts.happiness);
    this.checkWellnessBadges(badges, counts.wellness);
    this.checkStreakBadges(badges);
    this.checkQuestBadges(badges);
    this.checkCurrencyBadges(badges);
    this.checkLevelBadges(badges);
    this.checkCrossFeatureBadges(badges);
  }
  grantBadge(badge) {
    if (this.state.badges.find(b => b.id === badge.id)) return;
    const karmaMap = { common: 3, uncommon: 5, rare: 10, epic: 15, legendary: 30 };
    const karma = karmaMap[badge.rarity] || 0;
    if (karma) {
      this.state.karma += karma;
      this.logAction('karma', { amount: karma, source: `Badge: ${badge.id}` });
    }
    this.state.badges.push({ ...badge, unlocked: true, date: new Date().toISOString() });
    this.emit('badgeUnlocked', badge);
    if (badge.xp) this.addXP(badge.xp, `Badge: ${badge.id}`);
    if (badge.inspirational) this.emit('inspirationalMessage', badge.inspirational);
    this.saveState();
  }
  checkAndGrantBadge(badgeId, badgeDefinitions) {
    if (this.state.badges.find(b => b.id === badgeId)) return;
    const def = badgeDefinitions[badgeId];
    if (!def) { console.warn(`Badge definition not found: ${badgeId}`); return; }
    this.grantBadge({ id: badgeId, name: def.name, icon: def.icon, description: def.description, xp: def.xp, rarity: def.rarity, inspirational: def.inspirational });
  }

  // =========================================================
  //  Part 4: Quests, Resets, Bulk, Unlocks, Logging, Status
  // =========================================================
  progressEnergyCheckin(timeOfDay) {
    const quest = this.state.quests.daily.find(q => q.id === 'energy_checkin');
    if (!quest || quest.completed) return;
    if (!quest.subProgress) quest.subProgress = { day: false, night: false };
    const key = timeOfDay === 'day' ? 'day' : timeOfDay === 'night' ? 'night' : null;
    if (!key || quest.subProgress[key]) return;
    quest.subProgress[key] = true;
    quest.progress += 1;
    this.addXP(10, `Energy Check-in (${key})`);
    this.state.karma += 1;
    this.emit('questProgress', quest);
    if (quest.progress >= quest.target) {
      quest.completed = true;
      this.addXP(10, 'Energy Check-in Bonus (Both Complete)');
      this.state.karma += 2;
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      this.emit('questCompleted', quest);
      if (this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this.state._bulkMode && this.app?.showToast) this.app.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        this.emit('dailyQuestsComplete', null);
      }
    }
    this.saveState();
  }
  progressQuest(questType, questId, increment = 1) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    quest.progress = Math.min(quest.target, quest.progress + increment);
    if (quest.progress >= quest.target) {
      quest.completed = true;
      this.addXP(quest.xpReward || 50, `Quest: ${quest.name}`);
      if (quest.karmaReward) this.state.karma += quest.karmaReward;
      if (quest.badge) this.grantBadge(quest.badge);
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      if (!this.state._bulkMode) this.emit('questCompleted', quest);
      if (questType === 'daily' && this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this.state._bulkMode && this.app?.showToast) this.app.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        if (!this.state._bulkMode) this.emit('dailyQuestsComplete', null);
      }
      this.queueBadgeCheck('quest');
    } else {
      this.emit('questProgress', quest);
    }
    this.saveState();
  }
  completeQuest(questType, questId) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest) return;
    this.progressQuest(questType, questId, quest.target - quest.progress);
  }
  completeChakraQuest(questType, questId, chakraName, increment = 1) {
    this.progressQuest(questType, questId, increment);
  }
  resetDailyQuests() { this._resetQuests('daily'); }
  resetWeeklyQuests() { this._resetQuests('weekly'); }
  resetMonthlyQuests() { this._resetQuests('monthly'); }
  _resetQuests(type) {
    const allComplete = this.state.quests[type]?.every(q => q.completed);
    if (allComplete) {
      if (type === 'daily') {
        this.state.dailyQuestCompletions = (this.state.dailyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = (this.state.dailyQuestStreak || 0) + 1;
      } else if (type === 'weekly') {
        this.addXP(200, 'Weekly Quest Completion Bonus');
        this.state.karma += 20;
        if (this.app?.showToast) this.app.showToast('🎉 Weekly quests finished! +200 XP +20 Karma', 'success');
        this.state.weeklyQuestCompletions = (this.state.weeklyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = 0;
      } else if (type === 'monthly') {
        this.addXP(800, 'Monthly Quest Completion Bonus');
        this.state.karma += 80;
        if (this.app?.showToast) this.app.showToast('🎉 Monthly quests finished! +800 XP +80 Karma', 'success');
        this.state.monthlyQuestCompletions = (this.state.monthlyQuestCompletions || 0) + 1;
      }
      this.queueBadgeCheck('quest');
    }
    this.state.quests[type]?.forEach(q => {
      q.progress = 0;
      q.completed = false;
      if (q.id === 'energy_checkin') q.subProgress = { day: false, night: false };
    });
    this.emit('questsReset', type);
    this.saveState();
  }
  completeAllDaily() { this._completeBatch('daily'); }
  completeAllWeekly() { this._completeBatch('weekly'); }
  completeAllMonthly() { this._completeBatch('monthly'); }
  _completeBatch(type) {
    const quests = this.state.quests[type];
    if (!quests?.length) return;
    let done = 0, xp = 0, karma = 0;
    this.state._bulkMode = true;
    quests.forEach(q => {
      if (!q.completed) {
        this.completeQuest(type, q.id);
        done++;
        xp += q.xpReward || 50;
        karma += q.karmaReward || 0;
      }
    });
    this.state._bulkMode = false;
    if (done) this.emit('bulkQuestsComplete', { type, done, xp, karma });
  }
  unlockFeature(featureId) {
    if (this.state.unlockedFeatures.includes(featureId)) return;
    this.state.unlockedFeatures.push(featureId);
    this.emit('featureUnlocked', featureId);
    this.saveState();
  }
  logAction(type, details = {}) {
    try {
      this.state.logs.push({ timestamp: new Date().toISOString(), type, details });
      if (this.state.logs.length > 1000) this.state.logs = this.state.logs.slice(-1000);
      this.saveState();
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }
  getStatusSummary() {
    const levelInfo = this.calculateLevel();
    return {
      xp: this.state.xp,
      level: this.state.level,
      pointsToNext: levelInfo.pointsToNext,
      levelTitle: levelInfo.title,
      karma: this.state.karma,
      streak: this.state.streak,
      badges: this.state.badges,
      unlockedFeatures: this.state.unlockedFeatures,
      quests: this.state.quests,
      logs: this.state.logs,
      totalWellnessRuns: this.state.totalWellnessRuns,
      totalTarotSpreads: this.state.totalTarotSpreads,
      totalJournalEntries: this.state.totalJournalEntries,
      totalHappinessViews: this.state.totalHappinessViews
    };
  }
  reset() {
    try {
      localStorage.removeItem('gamificationState');
      this.state = this.defaultState();
      this.emit('reset', null);
      this.saveState();
    } catch (error) {
      console.error('Failed to reset gamification state:', error);
    }
  }
}

/* ---------------------------------------------------------
   LEVEL-UP SPECTACLE (Inlined Animation)
--------------------------------------------------------- */
function showLevelUpSpectacle({ level, title, karma = 0, xp = 0 }) {
  if (document.getElementById('lvl-spectacle')) return;
  const duration = 4000;
  const st = document.createElement('style');
  st.id = 'lvl-spectacle-styles';
  st.textContent = `
    #lvl-spectacle { position: fixed; inset: 0; z-index: 9999; pointer-events: none; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    .lvl-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(10, 5, 40, 0.7) 0%, rgba(0, 0, 0, 0.9) 80%); animation: fadeIn 0.6s ease-out forwards; }
    .lvl-ring { position: absolute; left: 50%; top: 50%; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 0 40px 0 #fff, 0 0 80px 0 #9f7aea, 0 0 120px 0 #4f46e5; }
    .lvl-ring-a { width: 30vmin; height: 30vmin; border: 2.5vmin solid transparent; background: conic-gradient(from 0deg, #c084fc, #818cf8, #60a5fa, #c084fc) border-box; mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; animation: spin 2.5s linear infinite; }
    .lvl-ring-b { width: 40vmin; height: 40vmin; border: 1.5vmin solid rgba(255, 255, 255, 0.15); animation: spin 4s linear infinite reverse; }
    .lvl-flare { position: absolute; left: 50%; top: 50%; width: 120vmin; height: 120vmin; background: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%); transform: translate(-50%, -50%) scale(0); animation: flare 1.2s 0.3s ease-out forwards; }
    .lvl-text { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; color: #fff; animation: textIn 0.8s 0.5s ease-out forwards; opacity: 0; }
    .lvl-title { font-size: clamp(3rem, 12vmin, 8rem); font-weight: 900; letter-spacing: 0.05em; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fde68a 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 30px rgba(251, 191, 36, 0.6); }
    .lvl-sub { font-size: clamp(1.2rem, 4vmin, 2.5rem); margin-top: 0.5em; color: #e0e0ff; }
    .lvl-rewards { font-size: clamp(0.9rem, 3vmin, 1.3rem); margin-top: 1em; color: #c4b5fd; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
    @keyframes flare { to { transform: translate(-50%, -50%) scale(2); opacity: 0; } }
    @keyframes textIn { from { transform: translate(-50%, -30%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
    @keyframes particle { to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); opacity: 0; } }
  `;
  document.head.appendChild(st);
  const wrap = document.createElement('div');
  wrap.id = 'lvl-spectacle';
  wrap.innerHTML = `
    <div class="lvl-overlay"></div>
    <div class="lvl-ring lvl-ring-a"></div>
    <div class="lvl-ring lvl-ring-b"></div>
    <div class="lvl-flare"></div>
    <div class="lvl-text">
      <div class="lvl-title">LEVEL ${level}</div>
      <div class="lvl-sub">${title}</div>
      <div class="lvl-rewards">+${xp} XP${karma ? ` +${karma} Karma` : ''}</div>
    </div>
  `;
  document.body.appendChild(wrap);
  const flare = wrap.querySelector('.lvl-flare');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    const hue = 40 + Math.random() * 40;
    p.style.cssText = `position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; background: hsl(${hue}, 100%, 70%); border-radius: 50%; box-shadow: 0 0 6px hsl(${hue}, 100%, 70%); transform: translate(-50%, -50%); animation: particle ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.3}s ease-out forwards;`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    p.style.setProperty('--dx', `${Math.cos(angle) * distance}vmin`);
    p.style.setProperty('--dy', `${Math.sin(angle) * distance}vmin`);
    flare.appendChild(p);
  }
  setTimeout(() => { wrap.remove(); st.remove(); }, duration);
}

export { showLevelUpSpectacle };
export default GamificationEngine;