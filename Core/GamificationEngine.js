/**
 * =========================================================
 * GamificationEngine.js - Optimized & Consolidated
 * =========================================================
 * Manages XP, levels, karma, badges, quests, and streaks
 * for the wellness app gamification system.
 */

// Configuration constants
const CONFIG = {
  SAVE_DEBOUNCE_MS: 100,
  BADGE_CHECK_DEBOUNCE_MS: 300,
  MAX_LOGS: 1000,
  LEVEL_UP_SPECTACLE_DURATION: 4000,
  PARTICLE_COUNT: 60,
  QUEST_REWARDS: {
    DAILY_BONUS: { xp: 50, karma: 5 },
    WEEKLY_BONUS: { xp: 200, karma: 20 },
    MONTHLY_BONUS: { xp: 800, karma: 80 }
  },
  LEVEL_UP_BONUS_XP: 50
};

// Karma rewards by badge rarity
const KARMA_BY_RARITY = {
  common: 3,
  uncommon: 5,
  rare: 10,
  epic: 15,
  legendary: 30
};

// Level progression ladder
const LEVEL_LADDER = [
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

export class GamificationEngine {
  constructor(app) {
    this.app = app;
    this.listeners = {};
    this.state = this.loadState() || this.defaultState();
    this.badgeCheckQueue = new Set();
    this.saveTimeout = null;
    this.initializeQuests();
  }

  /**
   * Returns the default state structure
   */
  defaultState() {
    return {
      xp: 0,
      level: 1,
      karma: 0,
      streak: { current: 0, best: 0, lastCheckIn: null },
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
      activeBoosts: [],
      skipCaps: {},
      settings: {
        xpPerAction: 10,
        xpPerLevel: 100,
        streakResetDays: 1,
        synergyBonus: 10
      }
    };
  }

  /**
   * Initialize quest definitions if not already present.
   * For new users: sets full definitions.
   * For existing users: merges definition properties into saved state
   * AND appends any new quests not yet present (e.g. after app updates).
   */
  initializeQuests() {
    const definitions = this.getQuestDefinitions();
    if (!this.state.quests.daily || this.state.quests.daily.length === 0) {
      this.state.quests = definitions;
      this.saveState();
    } else {
      ['daily', 'weekly', 'monthly'].forEach(type => {
        const saved = this.state.quests[type] || [];
        const defs = definitions[type] || [];

        // Merge definition properties into existing saved quests
        const merged = saved.map(quest => {
          const def = defs.find(d => d.id === quest.id);
          return def ? { ...def, ...quest } : quest;
        });

        // Append any new quests from definitions not yet in saved state
        defs.forEach(def => {
          if (!merged.find(q => q.id === def.id)) {
            merged.push({ ...def });
          }
        });

        this.state.quests[type] = merged;
      });
      this.saveState();
    }
  }

  /**
   * Returns quest definitions for daily, weekly, and monthly quests
   */
  getQuestDefinitions() {
    return {
      daily: [
        {
          id: 'gratitude_entry',
          tab: 'gratitude',
          icon: '❤️',
          name: 'Daily Gratitude Practice',
          inspirational: 'Gratitude transforms what we have into enough.',
          target: 'Log 10 gratitudes',
          goal: 10,
          progress: 0,
          xpReward: 20,
          completed: false,
          karmaReward: 2
        },
        {
          id: 'journal_entry',
          tab: 'journal',
          icon: '📓',
          name: 'Daily Journaling',
          inspirational: 'Writing clarifies thoughts.',
          target: 'Save 1 journal entry',
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
          inspirational: 'The cards reveal truth.',
          target: 'Complete one 6-card spread',
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
          target: 'Finish 1 meditation',
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
          inspirational: 'Awareness is transformation.',
          target: 'Day & night check-ins',
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
          name: 'Daily Affirmations',
          inspirational: 'Joy is practice.',
          target: 'Refresh cards 5 times',
          goal: 5,
          progress: 0,
          xpReward: 15,
          completed: false,
          karmaReward: 1
        },
        {
          id: 'flip_script',
          tab: 'flip-script',
          icon: '🔄',
          name: 'Flip The Script',
          inspirational: 'Every negative thought holds the seed of its opposite.',
          target: 'Flip 1 negative thought',
          goal: 1,
          progress: 0,
          xpReward: 40,
          completed: false,
          karmaReward: 4
        }
      ],
      weekly: [
        {
          id: 'gratitude_streak_7',
          tab: 'gratitude',
          icon: '💖',
          name: 'Gratitude Streak',
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
          tab: 'journal',
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
          tab: 'energy',
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
          tab: 'happiness',
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
          tab: 'tarot',
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
          tab: 'meditations',
          icon: '🌟',
          name: 'Meditating Adept',
          inspirational: 'Stillness is strength.',
          target: 'Finish 5 meditation sessions across the week to complete this quest.',
          goal: 5,
          progress: 0,
          xpReward: 120,
          completed: false,
          karmaReward: 12
        },
        {
          id: 'flip_script_5',
          tab: 'flip-script',
          icon: '🔄',
          name: 'Script Flipper',
          inspirational: 'Rewire your mind one thought at a time.',
          target: 'Flip 5 negative thoughts across the week to complete this quest.',
          goal: 5,
          progress: 0,
          xpReward: 150,
          completed: false,
          karmaReward: 15
        }
      ],
      monthly: [
        {
          id: 'monthly_flip_15',
          tab: 'flip-script',
          icon: '🔄',
          name: 'Master Script Flipper',
          inspirational: 'You are the author of your own story.',
          target: 'Flip 15 negative thoughts during the month to complete this quest.',
          goal: 15,
          progress: 0,
          xpReward: 400,
          completed: false,
          karmaReward: 40
        },
        {
          id: 'monthly_energy_28',
          tab: 'energy',
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
          tab: 'tarot',
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
          tab: 'gratitude',
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
          tab: 'journal',
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
          tab: 'happiness',
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
          tab: 'meditations',
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

  // =========================================================
  // STATE MANAGEMENT
  // =========================================================

  /**
   * Saves state to localStorage and cloud (debounced)
   * Logs are excluded from cloud save to prevent payload bloat.
   */
  saveState() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem('gamificationState', JSON.stringify(this.state));
        if (this.app?.state) {
          // Exclude logs from cloud payload — kept in localStorage only
          const { logs: _logs, ...cloudState } = this.state;
          this.app.state.data = { ...this.app.state.data, ...cloudState };
          this.app.state.saveAppData();
        }
      } catch (error) {
        console.error('Failed to save gamification state:', error);
      }
    }, CONFIG.SAVE_DEBOUNCE_MS);
  }

  /**
   * Loads state from cloud or localStorage
   */
  loadState() {
    try {
      // Try loading from cloud first
      if (this.app?.state?.data && this.app.state.data.xp !== undefined) {
        const cloud = { ...this.app.state.data };
        
        // Remove deprecated fields
        const deprecated = [
          'streak.lastCheckIn',
          'energyLevel',
          'alignmentScore',
          'chakraProgress',
          'totalPracticeMinutes'
        ];
        
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
      
      // Fall back to localStorage
      const local = localStorage.getItem('gamificationState');
      if (local) return { ...this.defaultState(), ...JSON.parse(local) };
      
      return null;
    } catch (error) {
      console.error('Failed to load gamification state:', error);
      return null;
    }
  }

  /**
   * Reloads state from database
   */
  async reloadFromDatabase() {
    if (!this.app?.state) return;
    try {
      await this.app.state.loadData(); // loadData() assigns result to this.data
      this.state = this.loadState();
      this.emit('stateReloaded', this.state);
      this.checkAllBadges();
    } catch (error) {
      console.error('Failed to reload gamification state:', error);
    }
  }

  /**
   * Resets all gamification data
   */
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

  // =========================================================
  // EVENT SYSTEM
  // =========================================================

  /**
   * Registers an event listener
   * @returns Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  /**
   * Removes an event listener
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  /**
   * Emits an event to all registered listeners
   */
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Cleanup method - clears timeouts and listeners
   */
  destroy() {
    clearTimeout(this.saveTimeout);
    this.listeners = {};
  }

  // =========================================================
  // COUNTER INCREMENTS (Consolidated)
  // =========================================================

  /**
   * Generic counter increment method (DRY principle)
   */
  _incrementCounter(stateKey, category, eventName) {
    this.state[stateKey] += 1;
    this.queueBadgeCheck(category);
    this.saveState();
    this.emit(eventName, this.state[stateKey]);
  }

  incrementWellnessRuns() {
    this._incrementCounter('totalWellnessRuns', 'wellness', 'wellnessRunCompleted');
  }

  incrementTarotSpreads() {
    this._incrementCounter('totalTarotSpreads', 'tarot', 'tarotSpreadCompleted');
  }

  incrementJournalEntries() {
    this._incrementCounter('totalJournalEntries', 'journal', 'journalEntrySaved');
  }

  incrementHappinessViews() {
    this._incrementCounter('totalHappinessViews', 'happiness', 'happinessViewAdded');
  }

  // =========================================================
  // BADGE CHECKING
  // =========================================================

  /**
   * Queues a badge category for checking (debounced)
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
  }, CONFIG.BADGE_CHECK_DEBOUNCE_MS);

  /**
   * Generic debounce utility
   */
  debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /**
   * Gets current app data
   */
  get currentData() {
    return this.app?.state?.data || {};
  }

  /**
   * Returns counts for each feature
   */
  getCounts() {
    const data = this.currentData;
    return {
      gratitude: (data.gratitudeEntries || []).length,
      journal: (data.journalEntries || []).length,
      energy: (data.energyEntries || []).length,
      tarot: this.state.totalTarotSpreads || 0,
      meditation: (data.meditationEntries || []).length,
      happiness: this.state.totalHappinessViews || 0,
      wellness: this.state.totalWellnessRuns || 0
    };
  }

  // =========================================================
  // XP & KARMA
  // =========================================================

  /**
   * Adds XP with optional boost multiplier
   */
  addXP(amount, source = 'general', skipToast = false) {
    if (!amount || amount <= 0) return;
    
    let final = amount;
    if (this.hasActiveXPBoost()) final = amount * 2;
    
    this.state.xp += final;
    this.logAction('xp', { amount: final, source, boosted: final !== amount });
    this.emit('xpGained', { amount: final, source, skipToast });
    this.checkLevelUp();
    this.queueBadgeCheck('currency');
    this.saveState();
  }

  /**
   * Adds karma
   */
  addKarma(amount, source = 'general', skipToast = false) {
    if (!amount || amount <= 0) return;

    let final = amount;
    if (this.hasActiveKarmaBoost()) final = amount * 2;

    this.state.karma += final;
    this.logAction('karma', { amount: final, source, boosted: final !== amount });
    this.emit('karmaGained', { amount: final, source, skipToast });
    this.queueBadgeCheck('currency');
    this.saveState();
  }

  /**
   * Adds both XP and Karma in one operation with single toast
   */
  addBoth(xp, karma, source = 'general') {
    if (!xp && !karma) return;

    let finalXP = xp;
    let finalKarma = karma;

    // Add XP
    if (xp > 0) {
      if (this.hasActiveXPBoost()) finalXP = xp * 2;
      this.state.xp += finalXP;
      this.logAction('xp', { amount: finalXP, source, boosted: finalXP !== xp });
      this.emit('xpGained', { amount: finalXP, source, skipToast: true });
    }

    // Add Karma
    if (karma > 0) {
      if (this.hasActiveKarmaBoost()) finalKarma = karma * 2;
      this.state.karma += finalKarma;
      this.logAction('karma', { amount: finalKarma, source, boosted: finalKarma !== karma });
      this.emit('karmaGained', { amount: finalKarma, source, skipToast: true });
    }

    // Single combined toast showing actual awarded amounts
    if (this.app?.showToast) {
      const parts = [];
      if (xp > 0) parts.push(`+${finalXP} XP`);
      if (karma > 0) parts.push(`+${finalKarma} Karma`);
      this.app.showToast(`${parts.join(' • ')} from ${source}`, 'success');
    }

    if (xp > 0) this.checkLevelUp();
    this.queueBadgeCheck('currency');
    this.saveState();
  }

  /**
   * Checks if XP boost (xp_multiplier or double_boost) is active
   */
  hasActiveXPBoost() {
    try {
      const boosts = this.state.activeBoosts || [];
      const now = Date.now();
      return boosts.some(b =>
        (b.id === 'xp_multiplier' || b.id === 'double_boost') && b.expiresAt > now
      );
    } catch {
      return false;
    }
  }

  /**
   * Checks if a karma boost (karma_multiplier or double_boost) is active
   */
  hasActiveKarmaBoost() {
    try {
      const boosts = this.state.activeBoosts || [];
      const now = Date.now();
      return boosts.some(b =>
        (b.id === 'karma_multiplier' || b.id === 'double_boost') && b.expiresAt > now
      );
    } catch {
      return false;
    }
  }

  /**
   * Activates a boost and persists it to state (replaces localStorage-only approach)
   * @param {string} id - Boost ID (e.g. 'xp_multiplier')
   * @param {number} durationMs - Duration in milliseconds
   */
  activateBoost(id, durationMs) {
    if (!this.state.activeBoosts) this.state.activeBoosts = [];
    // Remove existing boost of same type
    this.state.activeBoosts = this.state.activeBoosts.filter(b => b.id !== id);
    const expiresAt = Date.now() + durationMs;
    this.state.activeBoosts.push({ id, expiresAt });
    this.saveState();
    this.emit('boostActivated', { id, expiresAt });
  }

  // =========================================================
  // LEVEL SYSTEM
  // =========================================================

  /**
   * Calculates current level and progress
   */
  calculateLevel() {
    let i = LEVEL_LADDER.length - 1;
    while (i > 0 && this.state.xp < LEVEL_LADDER[i].xp) i--;
    
    const cur = LEVEL_LADDER[i];
    const next = LEVEL_LADDER[i + 1] || cur;
    const prog = next.xp === cur.xp 
      ? 100 
      : ((this.state.xp - cur.xp) / (next.xp - cur.xp)) * 100;
    
    return {
      level: cur.level,
      title: cur.title,
      progress: Math.round(prog),
      pointsToNext: Math.max(0, next.xp - this.state.xp)
    };
  }

  /**
   * Checks if user leveled up and triggers celebration
   */
  checkLevelUp() {
    const prev = this.state.level;
    const { level, title } = this.calculateLevel();
    
    if (level > prev) {
      this.state.level = level;
      this.emit('levelUp', { level, title });
      this.addXP(CONFIG.LEVEL_UP_BONUS_XP, `Level ${level}`, true);
      
      if (this.app?.showToast) {
        this.app.showToast(
          `🎉 Level ${level} – ${title}  +${CONFIG.LEVEL_UP_BONUS_XP} XP`,
          'success'
        );
      }
      
      showLevelUpSpectacle({ 
        level, 
        title, 
        xp: CONFIG.LEVEL_UP_BONUS_XP, 
        karma: 0 
      });
      
      this.queueBadgeCheck('level');
    }
  }

  // =========================================================
  // STREAK SYSTEM
  // =========================================================

  /**
   * Updates user's daily streak
   */
  updateStreak() {
    const today = new Date().toDateString();
    if (this.state.streak.lastCheckIn === today) return;

    const last = this.state.streak.lastCheckIn 
      ? new Date(this.state.streak.lastCheckIn) 
      : null;
    const diff = last 
      ? (new Date(today) - last) / (1000 * 60 * 60 * 24) 
      : null;

    if (!last || diff > this.state.settings.streakResetDays) {
      this.state.streak.current = 1;
    } else {
      this.state.streak.current += 1;
    }

    // Track best streak
    if (this.state.streak.current > (this.state.streak.best || 0)) {
      this.state.streak.best = this.state.streak.current;
    }

    this.state.streak.lastCheckIn = today;
    this.emit('streakUpdated', { 
      current: this.state.streak.current,
      best: this.state.streak.best
    });
    this.queueBadgeCheck('streak');
    this.saveState();
  }

  // =========================================================
  // BADGE DEFINITIONS & CHECKING
  // =========================================================

  /**
   * Returns all badge definitions
   */
  getBadgeDefinitions() {
    return {
      // First-time badges
      first_step: { name: 'First Step', icon: '🌱', description: 'Any first action in the app', xp: 10, rarity: 'common', category: 'first' },
      first_gratitude: { name: 'First Gratitude', icon: '💚', description: 'First gratitude entry', xp: 10, rarity: 'common', category: 'first' },
      first_journal: { name: 'First Journal', icon: '📝', description: 'First journal entry', xp: 10, rarity: 'common', category: 'first' },
      first_energy: { name: 'First Energy', icon: '⚡', description: 'First energy check-in', xp: 10, rarity: 'common', category: 'first' },
      first_tarot: { name: 'First Reading', icon: '🃏', description: 'First tarot spread', xp: 10, rarity: 'common', category: 'first' },
      first_meditation: { name: 'First Meditation', icon: '🧘', description: 'First meditation session', xp: 10, rarity: 'common', category: 'first' },
      first_purchase: { name: 'First Purchase', icon: '🛒', description: 'First purchase in the Karma Shop', xp: 50, rarity: 'epic', category: 'currency' },

      // Gratitude badges
      gratitude_warrior: { name: 'Gratitude Warrior', icon: '❤️', description: '30 gratitude entries', xp: 50, rarity: 'uncommon', category: 'gratitude' },
      gratitude_legend: { name: 'Gratitude Legend', icon: '💗', description: '100 gratitude entries', xp: 100, rarity: 'rare', category: 'gratitude' },
      gratitude_200: { name: 'Gratitude Sage', icon: '💖', description: '200 gratitude entries', xp: 200, rarity: 'epic', category: 'gratitude' },
      gratitude_500: { name: 'Gratitude Titan', icon: '💘', description: '500 gratitude entries', xp: 500, rarity: 'legendary', category: 'gratitude' },

      // Journal badges
      journal_keeper: { name: 'Journal Keeper', icon: '📓', description: '20 journal entries', xp: 50, rarity: 'uncommon', category: 'journal' },
      journal_master: { name: 'Journal Master', icon: '📚', description: '75 journal entries', xp: 100, rarity: 'rare', category: 'journal' },
      journal_150: { name: 'Journal Sage', icon: '📖', description: '150 journal entries', xp: 200, rarity: 'epic', category: 'journal' },
      journal_400: { name: 'Journal Titan', icon: '📜', description: '400 journal entries', xp: 500, rarity: 'legendary', category: 'journal' },

      // Energy badges
      energy_tracker: { name: 'Energy Tracker', icon: '⚡', description: '30 energy logs', xp: 50, rarity: 'uncommon', category: 'energy' },
      energy_sage: { name: 'Energy Sage', icon: '🔋', description: '100 energy logs', xp: 100, rarity: 'rare', category: 'energy' },
      energy_300: { name: 'Energy Titan', icon: '🔌', description: '300 energy logs', xp: 300, rarity: 'epic', category: 'energy' },
      energy_600: { name: 'Energy Legend', icon: '⚡️', description: '600 energy logs', xp: 600, rarity: 'legendary', category: 'energy' },

      // Tarot badges
      tarot_apprentice: { name: 'Tarot Apprentice', icon: '🔮', description: '10 tarot spreads', xp: 25, rarity: 'common', category: 'tarot' },
      tarot_mystic: { name: 'Tarot Mystic', icon: '🃏', description: '25 tarot spreads', xp: 50, rarity: 'uncommon', category: 'tarot' },
      tarot_oracle: { name: 'Tarot Oracle', icon: '🌙', description: '75 tarot spreads', xp: 100, rarity: 'rare', category: 'tarot' },
      tarot_150: { name: 'Tarot Sage', icon: '🧙', description: '150 tarot spreads', xp: 200, rarity: 'epic', category: 'tarot' },
      tarot_400: { name: 'Tarot Titan', icon: '🔮', description: '400 tarot spreads', xp: 500, rarity: 'legendary', category: 'tarot' },

      // Meditation badges
      meditation_devotee: { name: 'Meditation Devotee', icon: '🧘', description: '20 meditation sessions', xp: 50, rarity: 'uncommon', category: 'meditation' },
      meditation_master: { name: 'Meditation Master', icon: '🕉️', description: '60 meditation sessions', xp: 100, rarity: 'rare', category: 'meditation' },
      meditation_100: { name: 'Meditation Sage', icon: '🧘‍♂️', description: '100 meditation sessions', xp: 300, rarity: 'epic', category: 'meditation' },
      meditation_200: { name: 'Meditation Titan', icon: '🧘‍♀️', description: '200 meditation sessions', xp: 700, rarity: 'legendary', category: 'meditation' },

      // Happiness badges
      happiness_seeker: { name: 'Happiness Seeker', icon: '😊', description: '50 happiness booster views', xp: 50, rarity: 'uncommon', category: 'happiness' },
      joy_master: { name: 'Joy Master', icon: '🎉', description: '150 happiness booster views', xp: 100, rarity: 'rare', category: 'happiness' },
      happiness_300: { name: 'Happiness Sage', icon: '😍', description: '300 happiness booster views', xp: 200, rarity: 'epic', category: 'happiness' },
      happiness_700: { name: 'Happiness Titan', icon: '🤩', description: '700 happiness booster views', xp: 500, rarity: 'legendary', category: 'happiness' },

      // Wellness badges
      wellness_champion: { name: 'Wellness Champion', icon: '🌿', description: '50 wellness exercises', xp: 50, rarity: 'uncommon', category: 'wellness' },
      wellness_guru: { name: 'Wellness Guru', icon: '🌳', description: '150 wellness exercises', xp: 100, rarity: 'rare', category: 'wellness' },
      wellness_300: { name: 'Wellness Titan', icon: '🌲', description: '300 wellness exercises', xp: 300, rarity: 'epic', category: 'wellness' },
      wellness_700: { name: 'Wellness Legend', icon: '🌎', description: '700 wellness exercises', xp: 1000, rarity: 'legendary', category: 'wellness' },

      // Streak badges
      perfect_week: { name: 'Perfect Week', icon: '⭐', description: 'Complete all daily quests 7 days straight', xp: 75, rarity: 'rare', category: 'streak' },
      dedication_streak: { name: 'Dedication', icon: '💎', description: '30-day streak', xp: 100, rarity: 'epic', category: 'streak' },
      unstoppable: { name: 'Unstoppable', icon: '🔥', description: '60-day streak', xp: 150, rarity: 'epic', category: 'streak' },
      legendary_streak: { name: 'Legendary Streak', icon: '👑', description: '100-day streak', xp: 200, rarity: 'legendary', category: 'streak' },

      // Quest badges
      weekly_warrior: { name: 'Weekly Warrior', icon: '🔥', description: 'Finish every weekly quest 4 separate weeks', xp: 100, rarity: 'epic', category: 'quest' },
      monthly_master: { name: 'Monthly Master', icon: '🌟', description: 'Finish every monthly quest at least once', xp: 150, rarity: 'epic', category: 'quest' },
      quest_crusher: { name: 'Quest Crusher', icon: '🎯', description: '100 total quests (any type)', xp: 150, rarity: 'epic', category: 'quest' },
      daily_champion: { name: 'Daily Champion', icon: '⭐', description: 'Finish all dailies on 30 separate days', xp: 100, rarity: 'rare', category: 'quest' },

      // Currency badges
      karma_collector: { name: 'Karma Collector', icon: '💰', description: '500 karma accumulated', xp: 50, rarity: 'rare', category: 'currency' },
      karma_lord: { name: 'Karma Lord', icon: '💎', description: '2000 karma accumulated', xp: 200, rarity: 'legendary', category: 'currency' },
      xp_milestone: { name: 'XP Legend', icon: '⚡', description: '10000 XP earned', xp: 100, rarity: 'epic', category: 'currency' },
      xp_titan: { name: 'XP Titan', icon: '⚡', description: '50000 XP earned', xp: 200, rarity: 'legendary', category: 'currency' },

      // Level badges
      level_5_hero: { name: 'Rising Star', icon: '🎯', description: 'Reach Level 5', xp: 100, rarity: 'epic', category: 'level' },
      level_7_hero: { name: 'Enlightened Soul', icon: '🌟', description: 'Reach Level 7', xp: 150, rarity: 'epic', category: 'level' },
      level_10_hero: { name: 'Enlightened Master', icon: '👑', description: 'Reach Level 10', xp: 300, rarity: 'legendary', category: 'level' },

      // Chakra badges
      chakra_balancer: { name: 'Chakra Balancer', icon: '🌈', description: 'All 7 chakras ≥ 8 in one session', xp: 75, rarity: 'epic', category: 'chakra' },
      chakra_master: { name: 'Chakra Master', icon: '🎨', description: 'All 7 chakras ≥ 9 in one session', xp: 150, rarity: 'legendary', category: 'chakra' },

      // Cross-feature badges
      triple_threat: { name: 'Triple Threat', icon: '🎪', description: 'Use 3 different features in one day', xp: 25, rarity: 'uncommon', category: 'cross' },
      super_day: { name: 'Super Day', icon: '💫', description: 'Gratitude + journal + energy + meditation in one day', xp: 50, rarity: 'rare', category: 'cross' },
      complete_explorer: { name: 'Complete Explorer', icon: '🗺️', description: 'Use every main feature at least once', xp: 100, rarity: 'epic', category: 'cross' },
      renaissance_soul: { name: 'Renaissance Soul', icon: '🎭', description: '≥ 10 actions in 5+ different features', xp: 150, rarity: 'epic', category: 'cross' }
    };
  }

  /**
   * Routes badge checking to appropriate category method
   */
  checkBadgeCategory(category) {
    const badges = this.getBadgeDefinitions();
    const counts = this.getCounts();

    const categoryMap = {
      gratitude: () => this.checkGratitudeBadges(badges, counts.gratitude),
      journal: () => this.checkJournalBadges(badges, counts.journal),
      energy: () => this.checkEnergyBadges(badges, counts.energy),
      tarot: () => this.checkTarotBadges(badges, counts.tarot),
      meditation: () => this.checkMeditationBadges(badges, counts.meditation),
      happiness: () => this.checkHappinessBadges(badges, counts.happiness),
      wellness: () => this.checkWellnessBadges(badges, counts.wellness),
      streak: () => this.checkStreakBadges(badges),
      quest: () => this.checkQuestBadges(badges),
      currency: () => this.checkCurrencyBadges(badges),
      level: () => this.checkLevelBadges(badges),
      cross: () => this.checkCrossFeatureBadges(badges)
    };

    const checkFn = categoryMap[category];
    if (checkFn) checkFn();
  }

  // Badge checking methods by category
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
    if (this.state.dailyQuestStreak >= 7) this.checkAndGrantBadge('perfect_week', badges);
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

  checkCrossFeatureBadges(badges) {
    const data = this.currentData;
    const today = new Date().toDateString();
    const counts = this.getCounts();
    
    // First step badge
    const totalActions = Object.values(counts).reduce((a, b) => a + b, 0);
    if (totalActions >= 1) this.checkAndGrantBadge('first_step', badges);

    // Today's feature usage
    const todayGratitude = (data.gratitudeEntries || []).some(
      e => new Date(e.timestamp).toDateString() === today
    );
    const todayJournal = (data.journalEntries || []).some(
      e => new Date(e.timestamp).toDateString() === today
    );
    const todayEnergy = (data.energyEntries || []).some(
      e => new Date(e.timestamp).toDateString() === today
    );
    const todayTarot = (data.tarotReadings || []).some(
      e => new Date(e.timestamp).toDateString() === today
    );
    const todayMeditation = (data.meditationEntries || []).some(
      e => new Date(e.timestamp).toDateString() === today
    );

    const todayFeatures = [
      todayGratitude,
      todayJournal,
      todayEnergy,
      todayTarot,
      todayMeditation
    ].filter(Boolean).length;

    if (todayFeatures >= 3) this.checkAndGrantBadge('triple_threat', badges);
    if (todayGratitude && todayJournal && todayEnergy && todayMeditation) {
      this.checkAndGrantBadge('super_day', badges);
    }

    // Complete explorer
    const usedFeatures = [
      counts.gratitude > 0,
      counts.journal > 0,
      counts.energy > 0,
      counts.tarot > 0,
      counts.meditation > 0,
      counts.happiness > 0,
      counts.wellness > 0
    ];
    if (usedFeatures.every(Boolean)) {
      this.checkAndGrantBadge('complete_explorer', badges);
    }

    // Renaissance soul
    const featuresWithTenPlus = Object.values(counts).filter(c => c >= 10).length;
    if (featuresWithTenPlus >= 5) {
      this.checkAndGrantBadge('renaissance_soul', badges);
    }
  }

  /**
   * Checks chakra-specific badges
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
   * Checks all badge categories
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
   * Grants a badge to the user
   */
  grantBadge(badge) {
    if (this.state.badges.find(b => b.id === badge.id)) return;

    // Add karma based on rarity
    const karma = KARMA_BY_RARITY[badge.rarity] || 0;
    if (karma) {
      this.state.karma += karma;
      this.logAction('karma', { amount: karma, source: `Badge: ${badge.id}` });
    }

    // Add badge to collection
    this.state.badges.push({
      ...badge,
      unlocked: true,
      date: new Date().toISOString()
    });

    this.emit('badgeUnlocked', badge);
    
    if (badge.xp) this.addXP(badge.xp, `Badge: ${badge.id}`, true);
    if (badge.inspirational) this.emit('inspirationalMessage', badge.inspirational);
    
    this.saveState();
  }

  /**
   * Checks if badge should be granted and grants it
   */
  checkAndGrantBadge(badgeId, badgeDefinitions) {
    if (this.state.badges.find(b => b.id === badgeId)) return;
    
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

  // =========================================================
  // QUEST SYSTEM
  // =========================================================

  /**
   * Progresses energy check-in quest with day/night sub-tracking
   */
  progressEnergyCheckin(timeOfDay) {
    const quest = this.state.quests.daily.find(q => q.id === 'energy_checkin');
    if (!quest || quest.completed) return;

    if (!quest.subProgress) {
      quest.subProgress = { day: false, night: false };
    }

    const key = timeOfDay === 'day' ? 'day' : timeOfDay === 'night' ? 'night' : null;
    if (!key || quest.subProgress[key]) return;

    quest.subProgress[key] = true;
    quest.progress += 1;
    
    this.addXP(10, `Energy Check-in (${key})`, true);
    this.state.karma += 1;
    this.emit('questProgress', quest);

    // Check if quest completed
    if (quest.progress >= quest.goal) {
      quest.completed = true;
      this.addXP(10, 'Energy Check-in Bonus (Both Complete)', true);
      this.state.karma += 2;
      
      if (quest.inspirational) {
        this.emit('inspirationalMessage', quest.inspirational);
      }
      
      this.emit('questCompleted', quest);

      // Check if all dailies complete
      if (this.state.quests.daily.every(q => q.completed)) {
        const { xp, karma } = CONFIG.QUEST_REWARDS.DAILY_BONUS;
        this.addXP(xp, 'Daily Quest Streak Bonus', true);
        this.state.karma += karma;
        
        if (!this.state._bulkMode && this.app?.showToast) {
          this.app.showToast(`Daily quests finished! +${xp} XP +${karma} Karma`, 'success');
        }
        
        this.emit('dailyQuestsComplete', null);
      }
    }

    this.saveState();
  }

  /**
   * Progresses a quest by a given increment
   */
  progressQuest(questType, questId, increment = 1) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    quest.progress = Math.min(quest.goal, quest.progress + increment);

    if (quest.progress >= quest.goal) {
      quest.completed = true;
      this.addXP(quest.xpReward || 50, `Quest: ${quest.name}`, true);
      
      if (quest.karmaReward) this.state.karma += quest.karmaReward;
      if (quest.badge) this.grantBadge(quest.badge);
      if (quest.inspirational) this.emit('inspirationalMessage', quest.inspirational);
      if (!this.state._bulkMode) this.emit('questCompleted', quest);

      // Check if all dailies complete
      if (questType === 'daily' && this.state.quests.daily.every(q => q.completed)) {
        const { xp, karma } = CONFIG.QUEST_REWARDS.DAILY_BONUS;
        this.addXP(xp, 'Daily Quest Streak Bonus', true);
        this.state.karma += karma;
        
        if (!this.state._bulkMode && this.app?.showToast) {
          this.app.showToast(`Daily quests finished! +${xp} XP +${karma} Karma`, 'success');
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
   * Completes a quest immediately
   */
  completeQuest(questType, questId) {
    const quest = this.state.quests[questType]?.find(q => q.id === questId);
    if (!quest) return;
    this.progressQuest(questType, questId, quest.goal - quest.progress);
  }

  /**
   * Completes chakra quest (wrapper for progressQuest)
   */
  completeChakraQuest(questType, questId, chakraName, increment = 1) {
    this.progressQuest(questType, questId, increment);
  }

  /**
   * Resets quests for a given period
   */
  _resetQuests(type) {
    const allComplete = this.state.quests[type]?.every(q => q.completed);
    
    if (allComplete) {
      if (type === 'daily') {
        this.state.dailyQuestCompletions = (this.state.dailyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = (this.state.dailyQuestStreak || 0) + 1;
      } else if (type === 'weekly') {
        const { xp, karma } = CONFIG.QUEST_REWARDS.WEEKLY_BONUS;
        this.addXP(xp, 'Weekly Quest Completion Bonus', true);
        this.state.karma += karma;
        
        if (this.app?.showToast) {
          this.app.showToast(`Weekly quests finished! +${xp} XP +${karma} Karma`, 'success');
        }
        
        this.state.weeklyQuestCompletions = (this.state.weeklyQuestCompletions || 0) + 1;
        this.state.dailyQuestStreak = 0;
      } else if (type === 'monthly') {
        const { xp, karma } = CONFIG.QUEST_REWARDS.MONTHLY_BONUS;
        this.addXP(xp, 'Monthly Quest Completion Bonus', true);
        this.state.karma += karma;
        
        if (this.app?.showToast) {
          this.app.showToast(`Monthly quests finished! +${xp} XP +${karma} Karma`, 'success');
        }
        
        this.state.monthlyQuestCompletions = (this.state.monthlyQuestCompletions || 0) + 1;
      }
      
      this.queueBadgeCheck('quest');
    }

    // Reset all quests in the period
    this.state.quests[type]?.forEach(q => {
      q.progress = 0;
      q.completed = false;
      if (q.id === 'energy_checkin') {
        q.subProgress = { day: false, night: false };
      }
    });

    this.emit('questsReset', type);
    this.saveState();
  }

  resetDailyQuests() {
    this._resetQuests('daily');
  }

  resetWeeklyQuests() {
    this._resetQuests('weekly');
  }

  resetMonthlyQuests() {
    this._resetQuests('monthly');
  }

  /**
   * Completes all quests in a batch (for testing/admin)
   */
  _completeBatch(type) {
    const quests = this.state.quests[type];
    if (!quests?.length) return;

    let done = 0;
    let xp = 0;
    let karma = 0;

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

  completeAllDaily() {
    this._completeBatch('daily');
  }

  completeAllWeekly() {
    this._completeBatch('weekly');
  }

  completeAllMonthly() {
    this._completeBatch('monthly');
  }

  // =========================================================
  // UTILITY METHODS
  // =========================================================

  /**
   * Unlocks a feature for the user
   */
  unlockFeature(featureId) {
    if (this.state.unlockedFeatures.includes(featureId)) return;
    this.state.unlockedFeatures.push(featureId);
    this.emit('featureUnlocked', featureId);
    this.saveState();
  }

  /**
   * Logs an action to the activity log
   */
  logAction(type, details = {}) {
    try {
      this.state.logs.push({
        timestamp: new Date().toISOString(),
        type,
        details
      });
      
      // Keep only last 1000 logs
      if (this.state.logs.length > CONFIG.MAX_LOGS) {
        this.state.logs = this.state.logs.slice(-CONFIG.MAX_LOGS);
      }
      
      this.saveState();
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }

  /**
   * Returns a summary of the user's status
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
}

// =========================================================
// LEVEL UP SPECTACLE (Visual Celebration)
// =========================================================

/**
 * Shows an animated level-up celebration overlay
 */
function showLevelUpSpectacle({ level, title, karma = 0, xp = 0 }) {
  // Prevent duplicate spectacles
  if (document.getElementById('lvl-spectacle')) return;

  const duration = CONFIG.LEVEL_UP_SPECTACLE_DURATION;

  // Inject styles
  const st = document.createElement('style');
  st.id = 'lvl-spectacle-styles';
  st.textContent = `
    #lvl-spectacle {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .lvl-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(10, 5, 40, 0.7) 0%, rgba(0, 0, 0, 0.9) 80%);
      animation: fadeIn 0.6s ease-out forwards;
    }
    .lvl-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 40px 0 #fff, 0 0 80px 0 #9f7aea, 0 0 120px 0 #4f46e5;
    }
    .lvl-ring-a {
      width: 30vmin;
      height: 30vmin;
      border: 2.5vmin solid transparent;
      background: conic-gradient(from 0deg, #c084fc, #818cf8, #60a5fa, #c084fc) border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: spin 2.5s linear infinite;
    }
    .lvl-ring-b {
      width: 40vmin;
      height: 40vmin;
      border: 1.5vmin solid rgba(255, 255, 255, 0.15);
      animation: spin 4s linear infinite reverse;
    }
    .lvl-flare {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 120vmin;
      height: 120vmin;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
      transform: translate(-50%, -50%) scale(0);
      animation: flare 1.2s 0.3s ease-out forwards;
    }
    .lvl-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      animation: textIn 0.8s 0.5s ease-out forwards;
      opacity: 0;
    }
    .lvl-title {
      font-size: clamp(3rem, 12vmin, 8rem);
      font-weight: 900;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fde68a 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
    }
    .lvl-sub {
      font-size: clamp(1.2rem, 4vmin, 2.5rem);
      margin-top: 0.5em;
      color: #e0e0ff;
    }
    .lvl-rewards {
      font-size: clamp(0.9rem, 3vmin, 1.3rem);
      margin-top: 1em;
      color: #c4b5fd;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes flare {
      to { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    @keyframes textIn {
      from { transform: translate(-50%, -30%); opacity: 0; }
      to { transform: translate(-50%, -50%); opacity: 1; }
    }
    @keyframes particle {
      to {
        transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(st);

  // Create spectacle container
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

  // Add particle effects
  const flare = wrap.querySelector('.lvl-flare');
  for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    const hue = 40 + Math.random() * 40;
    p.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 4px;
      height: 4px;
      background: hsl(${hue}, 100%, 70%);
      border-radius: 50%;
      box-shadow: 0 0 6px hsl(${hue}, 100%, 70%);
      transform: translate(-50%, -50%);
      animation: particle ${1.2 + Math.random() * 0.8}s ${Math.random() * 0.3}s ease-out forwards;
    `;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    p.style.setProperty('--dx', `${Math.cos(angle) * distance}vmin`);
    p.style.setProperty('--dy', `${Math.sin(angle) * distance}vmin`);
    flare.appendChild(p);
  }

  // Auto-remove after duration
  setTimeout(() => {
    wrap.remove();
    st.remove();
  }, duration);
}

export { showLevelUpSpectacle };
export default GamificationEngine;