// =========================================================
//  GamificationEngine.js – Complete Optimized Version
//  Core Setup, State Management, Event System, XP/Karma/Levels, Badges, Quests
// =========================================================

/**
 * Manages gamification system: XP, levels, badges, quests, karma
 * Handles state persistence, event system, and reward mechanics
 */
export class GamificationEngine {
  // Configuration constants
  static SAVE_DEBOUNCE_MS = 100;
  static BADGE_CHECK_DEBOUNCE_MS = 300;
  static MAX_LOGS = 1000;
  static SPECTACLE_DURATION_MS = 4000;
  static SPECTACLE_PARTICLE_COUNT = 60;

  // Quest ID constants
  static QUEST_IDS = {
    GRATITUDE_ENTRY: 'gratitude_entry',
    JOURNAL_ENTRY: 'journal_entry',
    TAROT_SPREAD: 'tarot_spread',
    MEDITATION_SESSION: 'meditation_session',
    ENERGY_CHECKIN: 'energy_checkin',
    DAILY_BOOSTER: 'daily_booster'
  };

  /**
   * @param {Object} app - Main app instance with state and UI methods
   */
  constructor(app) {
    this.app = app;
    this.listeners = {};
    this.state = this.loadState() || this.defaultState();
    this.badgeCheckQueue = new Set();
    this.saveTimeout = null;
    this.badgeIds = new Set(this.state.badges.map(b => b.id));
    this._questDefinitions = null;
    this._badgeDefinitions = null;
    this.initializeQuests();
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

  /**
   * Initialize quests from definitions if not already loaded
   */
  initializeQuests() {
    const definitions = this.getQuestDefinitions();
    
    if (!this.state.quests.daily || this.state.quests.daily.length === 0) {
      this.state.quests = definitions;
      this.saveState();
      console.log('✅ Quests initialized from code definitions');
    }
  }

  /**
   * Get quest definitions (cached)
   * @returns {Object} Quest definitions by type (daily, weekly, monthly)
   */
  getQuestDefinitions() {
    if (this._questDefinitions) return this._questDefinitions;

    this._questDefinitions = {
      daily: [
        {
          id: GamificationEngine.QUEST_IDS.GRATITUDE_ENTRY,
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
          id: GamificationEngine.QUEST_IDS.JOURNAL_ENTRY,
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
          id: GamificationEngine.QUEST_IDS.TAROT_SPREAD,
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
          id: GamificationEngine.QUEST_IDS.MEDITATION_SESSION,
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
          id: GamificationEngine.QUEST_IDS.ENERGY_CHECKIN,
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
          id: GamificationEngine.QUEST_IDS.DAILY_BOOSTER,
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

    return this._questDefinitions;
  }

  /* ---------------------------------------------------------
     CLOUD + LOCAL PERSISTENCE
  --------------------------------------------------------- */
  /**
   * Save state to localStorage and cloud (debounced)
   */
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
    }, GamificationEngine.SAVE_DEBOUNCE_MS);
  }

  /**
   * Load state from cloud or localStorage with validation
   * @returns {Object|null} Loaded state or null
   */
  loadState() {
    try {
      let loadedState = null;

      // Try cloud first
      if (this.app?.state?.data && this.app.state.data.xp !== undefined) {
        loadedState = { ...this.app.state.data };
        
        // Remove deprecated fields
        const deprecated = ['streak.best', 'streak.lastCheckIn', 'energyLevel',
          'alignmentScore', 'chakraProgress', 'totalPracticeMinutes'];
        deprecated.forEach(field => {
          const parts = field.split('.');
          if (parts.length === 2) {
            if (loadedState[parts[0]]) delete loadedState[parts[0]][parts[1]];
          } else {
            delete loadedState[field];
          }
        });
      } else {
        // Fall back to localStorage
        const local = localStorage.getItem('gamificationState');
        if (local) loadedState = JSON.parse(local);
      }

      if (!loadedState) return null;

      // Validate and merge with defaults
      const validated = { ...this.defaultState(), ...loadedState };
      
      // Ensure arrays exist
      validated.badges = Array.isArray(validated.badges) ? validated.badges : [];
      validated.logs = Array.isArray(validated.logs) ? validated.logs : [];
      validated.unlockedFeatures = Array.isArray(validated.unlockedFeatures) ? validated.unlockedFeatures : [];

      return validated;
    } catch (error) {
      console.error('Failed to load gamification state:', error);
      return null;
    }
  }

  /**
   * Reload state from database
   */
  async reloadFromDatabase() {
    if (!this.app?.state) return;
    try {
      await this.app.state.loadAppData();
      this.state = this.loadState();
      this.badgeIds = new Set(this.state.badges.map(b => b.id));
      this.emit('stateReloaded', this.state);
      this.checkAllBadges();
      console.log('✅ Gamification state reloaded from database');
    } catch (error) {
      console.error('Failed to reload gamification state:', error);
    }
  }

  /* ---------------------------------------------------------
     EVENT BUS
  --------------------------------------------------------- */
  /**
   * Subscribe to event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Unsubscribe from event
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emit event to all subscribers
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try { cb(data); } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Cleanup all listeners and timers
   */
  destroy() {
    clearTimeout(this.saveTimeout);
    if (this.debouncedBadgeCheck?.timer) {
      clearTimeout(this.debouncedBadgeCheck.timer);
    }
    this.listeners = {};
    this.badgeCheckQueue.clear();
  }
/* ---------------------------------------------------------
     LIFETIME COUNTERS
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
     OPTIMIZED BADGE CHECKING
  --------------------------------------------------------- */
  /**
   * Queue badge check for specific category (debounced)
   * @param {string} category - Badge category to check
   */
  queueBadgeCheck(category) {
    this.badgeCheckQueue.add(category);
    this.debouncedBadgeCheck();
  }

  /**
   * Debounced badge check executor
   */
  debouncedBadgeCheck = this.debounce(() => {
    const categories = Array.from(this.badgeCheckQueue);
    this.badgeCheckQueue.clear();
    if (categories.includes('all')) {
      this.checkAllBadges();
    } else {
      categories.forEach(cat => this.checkBadgeCategory(cat));
    }
  }, GamificationEngine.BADGE_CHECK_DEBOUNCE_MS);

  /**
   * Debounce utility
   */
  debounce(fn, ms) {
    let timer;
    const debounced = (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
    debounced.timer = null;
    return debounced;
  }

  /* ---------------------------------------------------------
     CACHED DATA ACCESS
  --------------------------------------------------------- */
  /**
   * Get current app data
   */
  get currentData() {
    return this.app?.state?.data || {};
  }

  /**
   * Get counts of all user activities
   * @returns {Object} Activity counts by feature
   */
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
  /**
   * Add XP with optional boost multiplier
   * @param {number} amount - XP amount
   * @param {string} source - Source description
   */
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
  
  /**
   * Add Karma
   * @param {number} amount - Karma amount
   * @param {string} source - Source description
   */
  addKarma(amount, source = 'general') {
    if (!amount || amount <= 0) return;
    
    this.state.karma += amount;
    this.logAction('karma', { amount, source });
    this.emit('karmaGained', { amount, source });
    this.queueBadgeCheck('currency');
    this.saveState();
  }

  /**
   * Add both XP and Karma with single notification
   * @param {number} xp - XP amount
   * @param {number} karma - Karma amount
   * @param {string} source - Source description
   */
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
      this.app.showToast(`✅ ${parts.join(' • ')} from ${source}`, 'success');
    }
    
    // Check level up and badges once
    if (xp > 0) this.checkLevelUp();
    this.queueBadgeCheck('currency');
    this.saveState();
  }

  /**
   * Check if user has active XP boost
   * @returns {boolean}
   */
  hasActiveXPBoost() {
    try {
      const boosts = JSON.parse(localStorage.getItem('karma_active_boosts')) || [];
      const now = Date.now();
      return boosts.some(b => b.id === 'xp_multiplier' && b.expiresAt > now);
    } catch { 
      return false; 
    }
  }

  /**
   * Calculate current level and progress
   * @returns {Object} Level info with title, progress, pointsToNext
   */
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
    
    const cur = ladder[i];
    const next = ladder[i + 1] || ladder[i];
    const prog = next.xp === cur.xp ? 100 : ((this.state.xp - cur.xp) / (next.xp - cur.xp)) * 100;
    
    return { 
      level: cur.level, 
      title: cur.title, 
      progress: Math.round(prog), 
      pointsToNext: Math.max(0, next.xp - this.state.xp) 
    };
  }

  /**
   * Check and handle level up
   */
  checkLevelUp() {
    const prev = this.state.level;
    const { level, title } = this.calculateLevel();
    
    if (level > prev) {
      this.state.level = level;
      this.emit('levelUp', { level, title });
      this.addXP(50, `Level ${level}`);
      
      if (this.app?.showToast) {
        this.app.showToast(`🎉 Level ${level} – ${title}  +50 XP`, 'success');
      }
      
      showLevelUpSpectacle({ level, title, xp: 50, karma: 0 });
      this.queueBadgeCheck('level');
    }
  }

  /* ---------------------------------------------------------
     STREAK
  --------------------------------------------------------- */
  /**
   * Update daily streak
   */
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
     BADGE DEFINITIONS - 56 TOTAL (cached)
  --------------------------------------------------------- */
  /**
   * Get all badge definitions (cached)
   * @returns {Object} Badge definitions by ID
   */
  getBadgeDefinitions() {
    if (this._badgeDefinitions) return this._badgeDefinitions;

    this._badgeDefinitions = {
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
      journal_keeper: { name: 'Journal Keeper', icon: '📔', description: '20 journal entries', xp: 50, rarity: 'uncommon', category: 'journal' },
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
      happiness_300: { name: 'Happiness Sage', icon: '😃', description: '300 happiness booster views', xp: 200, rarity: 'epic', category: 'happiness' },
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

    return this._badgeDefinitions;
  }

  /* ---------------------------------------------------------
     OPTIMIZED BADGE CHECKING (category-based)
  --------------------------------------------------------- */
  /**
   * Check badges for specific category
   * @param {string} category - Category to check
   */
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

  /**
   * Generic threshold-based badge checker
   * @param {Object} badges - Badge definitions
   * @param {number} count - Current count
   * @param {Array} thresholds - Array of {threshold, badgeId}
   */
  checkBadgesByThresholds(badges, count, thresholds) {
    thresholds.forEach(({ threshold, badgeId }) => {
      if (count >= threshold) {
        this.checkAndGrantBadge(badgeId, badges);
      }
    });
  }

  checkGratitudeBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 1, badgeId: 'first_gratitude' },
      { threshold: 30, badgeId: 'gratitude_warrior' },
      { threshold: 100, badgeId: 'gratitude_legend' },
      { threshold: 200, badgeId: 'gratitude_200' },
      { threshold: 500, badgeId: 'gratitude_500' }
    ]);
  }

  checkJournalBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 1, badgeId: 'first_journal' },
      { threshold: 20, badgeId: 'journal_keeper' },
      { threshold: 75, badgeId: 'journal_master' },
      { threshold: 150, badgeId: 'journal_150' },
      { threshold: 400, badgeId: 'journal_400' }
    ]);
  }

  checkEnergyBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 1, badgeId: 'first_energy' },
      { threshold: 30, badgeId: 'energy_tracker' },
      { threshold: 100, badgeId: 'energy_sage' },
      { threshold: 300, badgeId: 'energy_300' },
      { threshold: 600, badgeId: 'energy_600' }
    ]);
  }

  checkTarotBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 1, badgeId: 'first_tarot' },
      { threshold: 10, badgeId: 'tarot_apprentice' },
      { threshold: 25, badgeId: 'tarot_mystic' },
      { threshold: 75, badgeId: 'tarot_oracle' },
      { threshold: 150, badgeId: 'tarot_150' },
      { threshold: 400, badgeId: 'tarot_400' }
    ]);
  }

  checkMeditationBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 1, badgeId: 'first_meditation' },
      { threshold: 20, badgeId: 'meditation_devotee' },
      { threshold: 60, badgeId: 'meditation_master' },
      { threshold: 100, badgeId: 'meditation_100' },
      { threshold: 200, badgeId: 'meditation_200' }
    ]);
  }

  checkHappinessBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 50, badgeId: 'happiness_seeker' },
      { threshold: 150, badgeId: 'joy_master' },
      { threshold: 300, badgeId: 'happiness_300' },
      { threshold: 700, badgeId: 'happiness_700' }
    ]);
  }

  checkWellnessBadges(badges, count) {
    this.checkBadgesByThresholds(badges, count, [
      { threshold: 50, badgeId: 'wellness_champion' },
      { threshold: 150, badgeId: 'wellness_guru' },
      { threshold: 300, badgeId: 'wellness_300' },
      { threshold: 700, badgeId: 'wellness_700' }
    ]);
  }

  checkStreakBadges(badges) {
    const streak = this.state.streak?.current || 0;
    this.checkBadgesByThresholds(badges, streak, [
      { threshold: 7, badgeId: 'perfect_week' },
      { threshold: 30, badgeId: 'dedication_streak' },
      { threshold: 60, badgeId: 'unstoppable' },
      { threshold: 100, badgeId: 'legendary_streak' }
    ]);
  }

  checkLevelBadges(badges) {
    const level = this.calculateLevel().level;
    this.checkBadgesByThresholds(badges, level, [
      { threshold: 5, badgeId: 'level_5_hero' },
      { threshold: 7, badgeId: 'level_7_hero' },
      { threshold: 10, badgeId: 'level_10_hero' }
    ]);
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
    if (todayGratitude && todayJournal && todayEnergy && todayMeditation) {
      this.checkAndGrantBadge('super_day', badges);
    }
    
    const usedFeatures = [
      counts.gratitude > 0, counts.journal > 0, counts.energy > 0, 
      counts.tarot > 0, counts.meditation > 0, counts.happiness > 0, counts.wellness > 0
    ];
    if (usedFeatures.every(Boolean)) this.checkAndGrantBadge('complete_explorer', badges);
    
    const featuresWithTenPlus = Object.values(counts).filter(c => c >= 10).length;
    if (featuresWithTenPlus >= 5) this.checkAndGrantBadge('renaissance_soul', badges);
  }

  /**
   * Check chakra-based badges
   * @param {Object} chakras - Chakra values by name
   */
  checkChakraBadges(chakras) {
    const badges = this.getBadgeDefinitions();
    const chakraKeys = ['root', 'sacral', 'solar', 'heart', 'throat', 'thirdEye', 'crown'];
    
    const all8Plus = chakraKeys.every(key => (chakras[key] || 0) >= 8);
    const all9Plus = chakraKeys.every(key => (chakras[key] || 0) >= 9);
    
    if (all8Plus) this.checkAndGrantBadge('chakra_balancer', badges);
    if (all9Plus) this.checkAndGrantBadge('chakra_master', badges);
  }

  /**
   * Check all badge categories
   */
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

  /**
   * Grant a badge to the user
   * @param {Object} badge - Badge object with id, name, icon, etc.
   */
  grantBadge(badge) {
    if (this.badgeIds.has(badge.id)) return;
    
    const karmaMap = { common: 3, uncommon: 5, rare: 10, epic: 15, legendary: 30 };
    const karma = karmaMap[badge.rarity] || 0;
    
    if (karma) {
      this.state.karma += karma;
      this.logAction('karma', { amount: karma, source: `Badge: ${badge.id}` });
    }
    
    this.state.badges.push({ ...badge, unlocked: true, date: new Date().toISOString() });
    this.badgeIds.add(badge.id);
    this.emit('badgeUnlocked', badge);
    
    if (badge.xp) this.addXP(badge.xp, `Badge: ${badge.id}`);
    if (badge.inspirational) this.emit('inspirationalMessage', badge.inspirational);
    
    this.saveState();
  }

  /**
   * Check and grant badge if conditions met
   * @param {string} badgeId - Badge ID to check
   * @param {Object} badgeDefinitions - Badge definitions object
   */
  checkAndGrantBadge(badgeId, badgeDefinitions) {
    if (this.badgeIds.has(badgeId)) return;
    
    const def = badgeDefinitions[badgeId];
    if (!def) {
      console.warn(`Badge definition not found: ${badgeId}`);
      return;
    }
    
    this.grantBadge({ 
      id: badgeId, 
      name: def.name, 
      icon: def.icon, 
      description: def.description, 
      xp: def.xp, 
      rarity: def.rarity, 
      inspirational: def.inspirational 
    });
  }
/* ---------------------------------------------------------
     QUEST MANAGEMENT
  --------------------------------------------------------- */
  /**
   * Progress energy check-in quest with day/night tracking
   * @param {string} timeOfDay - 'day' or 'night'
   */
  progressEnergyCheckin(timeOfDay) {
    const quest = this.state.quests.daily.find(q => q.id === GamificationEngine.QUEST_IDS.ENERGY_CHECKIN);
    if (!quest || quest.completed) return;
    
    if (!quest.subProgress) quest.subProgress = { day: false, night: false };
    
    const key = timeOfDay === 'day' ? 'day' : timeOfDay === 'night' ? 'night' : null;
    if (!key || quest.subProgress[key]) return;
    
    quest.subProgress[key] = true;
    quest.progress += 1;
    this.addXP(10, `Energy Check-in (${key})`);
    this.state.karma += 1;
    this.emit('questProgress', quest);
    
    if (quest.progress >= quest.goal) {
      quest.completed = true;
      this.addXP(10, 'Energy Check-in Bonus (Both Complete)');
      this.state.karma += 2;
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      this.emit('questCompleted', quest);
      
      if (this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this.state._bulkMode && this.app?.showToast) {
          this.app.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        }
        this.emit('dailyQuestsComplete', null);
      }
    }
    
    this.saveState();
  }

  /**
   * Progress a quest by increment
   * @param {string} questType - 'daily', 'weekly', or 'monthly'
   * @param {string} questId - Quest ID
   * @param {number} increment - Amount to increment
   */
  progressQuest(questType, questId, increment = 1) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest || quest.completed) return;
    
    quest.progress = Math.min(quest.goal, quest.progress + increment);
    
    if (quest.progress >= quest.goal) {
      quest.completed = true;
      this.addXP(quest.xpReward || 50, `Quest: ${quest.name}`);
      
      if (quest.karmaReward) this.state.karma += quest.karmaReward;
      if (quest.badge) this.grantBadge(quest.badge);
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      if (!this.state._bulkMode) this.emit('questCompleted', quest);
      
      if (questType === 'daily' && this.state.quests.daily.every(q => q.completed)) {
        this.addXP(50, 'Daily Quest Streak Bonus');
        this.state.karma += 5;
        if (!this.state._bulkMode && this.app?.showToast) {
          this.app.showToast('🎉 Daily quests finished! +50 XP +5 Karma', 'success');
        }
        if (!this.state._bulkMode) this.emit('dailyQuestsComplete', null);
      }
      
      this.queueBadgeCheck('quest');
    } else {
      this.emit('questProgress', quest);
    }
    
    this.saveState();
  }

  /**
   * Complete a quest immediately
   * @param {string} questType - 'daily', 'weekly', or 'monthly'
   * @param {string} questId - Quest ID
   */
  completeQuest(questType, questId) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest) return;
    this.progressQuest(questType, questId, quest.goal - quest.progress);
  }

  /**
   * Progress chakra-related quest
   * @param {string} questType - Quest type
   * @param {string} questId - Quest ID
   * @param {string} chakraName - Chakra name
   * @param {number} increment - Amount to increment
   */
  completeChakraQuest(questType, questId, chakraName, increment = 1) {
    this.progressQuest(questType, questId, increment);
  }

  /**
   * Reset daily quests
   */
  resetDailyQuests() { 
    this._resetQuests('daily'); 
  }

  /**
   * Reset weekly quests
   */
  resetWeeklyQuests() { 
    this._resetQuests('weekly'); 
  }

  /**
   * Reset monthly quests
   */
  resetMonthlyQuests() { 
    this._resetQuests('monthly'); 
  }

  /**
   * Internal quest reset logic
   * @param {string} type - Quest type to reset
   */
  _resetQuests(type) {
    const allComplete = this.state.quests[type]?.every(q => q.completed);
    
    if (allComplete) {
      if (type === 'daily') {
        this.state.dailyQuestCompletions = (this.state.dailyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = (this.state.dailyQuestStreak || 0) + 1;
      } else if (type === 'weekly') {
        this.addXP(200, 'Weekly Quest Completion Bonus');
        this.state.karma += 20;
        if (this.app?.showToast) {
          this.app.showToast('🎉 Weekly quests finished! +200 XP +20 Karma', 'success');
        }
        this.state.weeklyQuestCompletions = (this.state.weeklyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = 0;
      } else if (type === 'monthly') {
        this.addXP(800, 'Monthly Quest Completion Bonus');
        this.state.karma += 80;
        if (this.app?.showToast) {
          this.app.showToast('🎉 Monthly quests finished! +800 XP +80 Karma', 'success');
        }
        this.state.monthlyQuestCompletions = (this.state.monthlyQuestCompletions || 0) + 1;
      }
      this.queueBadgeCheck('quest');
    }
    
    this.state.quests[type]?.forEach(q => {
      q.progress = 0;
      q.completed = false;
      if (q.id === GamificationEngine.QUEST_IDS.ENERGY_CHECKIN) {
        q.subProgress = { day: false, night: false };
      }
    });
    
    this.emit('questsReset', type);
    this.saveState();
  }

  /**
   * Complete all daily quests at once
   */
  completeAllDaily() { 
    this._completeBatch('daily'); 
  }

  /**
   * Complete all weekly quests at once
   */
  completeAllWeekly() { 
    this._completeBatch('weekly'); 
  }

  /**
   * Complete all monthly quests at once
   */
  completeAllMonthly() { 
    this._completeBatch('monthly'); 
  }

  /**
   * Batch complete quests
   * @param {string} type - Quest type
   */
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

  /* ---------------------------------------------------------
     UTILITY FUNCTIONS
  --------------------------------------------------------- */
  /**
   * Unlock a feature
   * @param {string} featureId - Feature ID
   */
  unlockFeature(featureId) {
    if (this.state.unlockedFeatures.includes(featureId)) return;
    this.state.unlockedFeatures.push(featureId);
    this.emit('featureUnlocked', featureId);
    this.saveState();
  }

  /**
   * Log an action
   * @param {string} type - Action type
   * @param {Object} details - Action details
   */
  logAction(type, details = {}) {
    try {
      this.state.logs.push({ 
        timestamp: new Date().toISOString(), 
        type, 
        details 
      });
      
      if (this.state.logs.length > GamificationEngine.MAX_LOGS) {
        this.state.logs = this.state.logs.slice(-GamificationEngine.MAX_LOGS);
      }
      
      this.saveState();
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }

  /**
   * Get complete status summary
   * @returns {Object} Status summary
   */
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

  /**
   * Reset all gamification state
   */
  reset() {
    try {
      localStorage.removeItem('gamificationState');
      this.state = this.defaultState();
      this.badgeIds.clear();
      this.emit('reset', null);
      this.saveState();
    } catch (error) {
      console.error('Failed to reset gamification state:', error);
    }
  }
}

/* ---------------------------------------------------------
   LEVEL-UP SPECTACLE ANIMATION
--------------------------------------------------------- */
/**
 * Show level-up animation spectacle
 * @param {Object} options - Level up details
 * @param {number} options.level - New level
 * @param {string} options.title - Level title
 * @param {number} options.karma - Karma reward
 * @param {number} options.xp - XP reward
 */
function showLevelUpSpectacle({ level, title, karma = 0, xp = 0 }) {
  if (document.getElementById('lvl-spectacle')) return;
  
  const duration = GamificationEngine.SPECTACLE_DURATION_MS;
  
  // Inject styles
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
  
  // Create wrapper
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
  
  // Add particles
  const flare = wrap.querySelector('.lvl-flare');
  for (let i = 0; i < GamificationEngine.SPECTACLE_PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    const hue = 40 + Math.random() * 40;
    p.style.cssText = `position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; background: hsl(${hue}, 100%, 70%); border-radius: 50%; box-shadow: 0 0 6px hsl(${hue}, 100%, 70%); transform: translate(-50%, -50%); animation: particle ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.3}s ease-out forwards;`;
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    p.style.setProperty('--dx', `${Math.cos(angle) * distance}vmin`);
    p.style.setProperty('--dy', `${Math.sin(angle) * distance}vmin`);
    flare.appendChild(p);
  }
  
  // Cleanup
  setTimeout(() => { 
    wrap.remove(); 
    st.remove(); 
  }, duration);
}

export { showLevelUpSpectacle };
export default GamificationEngine;