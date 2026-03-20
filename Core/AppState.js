/**
 * AppState - Core Application State Manager
 *
 * Manages user data persistence with cloud-first strategy:
 * - Primary:  Supabase cloud storage
 * - Fallback: localStorage cache
 *
 * Handles:
 * - User progress data (entries, readings, meditations)
 * - Streaks and statistics
 * - Gamification triggers
 * - Data synchronisation
 *
 * @class AppState
 */

import { fetchProgress, saveProgress, clearCache } from '/Core/DB.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'pc_appdata';

const ENTRY_TYPES = Object.freeze({
  ENERGY:     'energy',
  GRATITUDE:  'gratitude',
  MEDITATION: 'meditation',
  TAROT:      'tarot',
  FLIP:       'flip',
  JOURNAL:    'journal'
});

const XP_REWARDS = Object.freeze({
  [ENTRY_TYPES.ENERGY]:     20,
  [ENTRY_TYPES.GRATITUDE]:  30, // per entry
  [ENTRY_TYPES.MEDITATION]:  5, // per minute
  [ENTRY_TYPES.TAROT]:      25,
  [ENTRY_TYPES.FLIP]:       40,
  [ENTRY_TYPES.JOURNAL]:    35,
  DEFAULT:                  10
});

const STATS_WINDOW_DAYS = 7;
const CHAKRA_BOOST      = 5;

// ============================================================================
// HELPERS
// ============================================================================

/** Safe localStorage wrapper — silently fails in private-browsing contexts */
const storage = {
  get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch { /* noop */ }
  }
};

// ============================================================================
// MAIN CLASS
// ============================================================================

export default class AppState {
  /**
   * @param {Object} app - Main application instance
   */
  constructor(app) {
    this.app             = app;
    this.currentUser     = null;
    this.isAuthenticated = false;
    this.activeTab       = 'dashboard';
    this.data            = null;
    this.ready           = Promise.resolve(this);
  }

  /**
   * Loads data after authentication is confirmed.
   * Call this explicitly after checkAuth() succeeds.
   * @returns {Promise<AppState>}
   */
  async loadData() {
    this.data  = await this.loadAppData();
    this.ready = Promise.resolve(this);
    return this;
  }

  // ==========================================================================
  // DATA PERSISTENCE — LOAD
  // ==========================================================================

  /**
   * Cloud-first data load: Cloud → localStorage → empty model
   * @returns {Promise<Object>}
   */
  async loadAppData() {
    try {
      const cloudData = await this.loadFromCloud();
      if (cloudData) return cloudData;

      const localData = this.loadFromLocalStorage();
      if (localData) return localData;

      return this.emptyModel();
    } catch (error) {
      console.error('[AppState] loadAppData failed:', error);
      return this.emptyModel();
    }
  }

  /** @returns {Promise<Object|null>} */
  async loadFromCloud() {
    try {
      const cloudData = await fetchProgress(true);
      if (cloudData == null) throw new Error('Cloud fetch returned null');
      if (Object.keys(cloudData).length === 0) return this.emptyModel();
      return cloudData;
    } catch (error) {
      console.warn('[AppState] Cloud read failed:', error.message);
      return null;
    }
  }

  /** @returns {Object|null} */
  loadFromLocalStorage() {
    try {
      const raw = storage.get(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Basic shape validation — reject non-object payloads
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        this.clearLocalStorage();
        return null;
      }
      return parsed;
    } catch (error) {
      console.warn('[AppState] localStorage parse failed, clearing cache:', error);
      this.clearLocalStorage();
      return null;
    }
  }

  // ==========================================================================
  // DATA PERSISTENCE — SAVE
  // ==========================================================================

  async saveAppData() {
    await this.saveToCloud();
    this.saveToLocalStorage();
  }

  async saveToCloud() {
    try {
      await saveProgress(this.data);
    } catch (error) {
      console.error('[AppState] Cloud save failed:', error);
    }
  }

  saveToLocalStorage() {
    try {
      const ok = storage.set(STORAGE_KEY, JSON.stringify(this.data));
      if (!ok) {
        // QuotaExceededError or security error
        console.warn('[AppState] localStorage write failed — clearing cache');
        this.clearLocalStorage();
      }
    } catch (error) {
      console.error('[AppState] localStorage save error:', error);
    }
  }

  clearLocalStorage() {
    storage.remove(STORAGE_KEY);
  }

  /**
   * Clears the DB.js cloud fetch cache AND the local cache.
   * Call before reloading after an admin write.
   */
  clearCache() {
    clearCache();
    this.clearLocalStorage();
  }

  // ==========================================================================
  // DATA MODEL
  // ==========================================================================

  emptyModel() {
    return {
      energyEntries:     [],
      gratitudeEntries:  [],
      tarotReadings:     [],
      meditationEntries: [],
      journalEntries:    [],
      flipEntries:       [],
      favorites:         [],
      achievements:      [],
      streaks: {
        current:    0,
        longest:    0,
        lastActive: null
      },
      stats: {
        totalSessions:    0,
        totalMeditations: 0,
        totalReadings:    0
      }
      // Gamification data is managed flat by GamificationEngine
      // and persisted via saveState() → saveAppData(). No nested
      // gamification block here to avoid dual-shape conflicts.
    };
  }

  // ==========================================================================
  // STREAKS & STATISTICS
  // ==========================================================================

  updateStreak() {
    const today     = new Date().toDateString();
    const lastActive = this.data.streaks.lastActive;

    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.data.streaks.current = (lastActive === yesterday.toDateString())
      ? this.data.streaks.current + 1
      : 1;

    this.data.streaks.lastActive = today;

    if (this.data.streaks.current > this.data.streaks.longest) {
      this.data.streaks.longest = this.data.streaks.current;
    }

    this.saveAppData();
  }

  getStats() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - STATS_WINDOW_DAYS);

    const weeklyMeditations = (this.data.meditationEntries || [])
      .filter(m => new Date(m.timestamp) >= weekAgo).length;

    const recentEnergy = (this.data.energyEntries || []).slice(0, STATS_WINDOW_DAYS);
    const avgEnergy    = recentEnergy.length
      ? Math.round(
          recentEnergy.reduce((sum, e) => sum + (e.energy || 0), 0) / recentEnergy.length
        )
      : 0;

    return {
      currentStreak:    this.data.streaks?.current    || 0,
      longestStreak:    this.data.streaks?.longest    || 0,
      weeklyMeditations,
      avgEnergy,
      totalGratitudes:  (this.data.gratitudeEntries || []).length,
      achievements:     (this.data.achievements     || []).length
    };
  }

  getTodayEntries(type) {
    const today = new Date().toDateString();
    const key   = `${type}Entries`;
    if (!this.data[key]) return [];
    return this.data[key].filter(entry => {
      const d = new Date(entry.date || entry.timestamp);
      return d.toDateString() === today;
    });
  }

  // ==========================================================================
  // ENTRY MANAGEMENT
  // ==========================================================================

  async addEntry(type, entry) {
    // Validate type to prevent arbitrary key injection
    const validTypes = new Set(Object.values(ENTRY_TYPES));
    if (!validTypes.has(type)) {
      console.warn(`[AppState] addEntry: unknown type "${type}"`);
      return;
    }

    const key = `${type}Entries`;
    if (!this.data[key]) this.data[key] = [];

    const newEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    this.data[key].unshift(newEntry);

    await this.saveAppData();
    this.updateStreak();

    if (window.app?.gamification) {
      this.triggerGamificationForEntry(type, entry);
    }
  }

  // ==========================================================================
  // GAMIFICATION INTEGRATION
  // ==========================================================================

  triggerGamificationForEntry(type, entry) {
    const gamification = window.app?.gamification;
    if (!gamification) return;

    const handlers = {
      [ENTRY_TYPES.ENERGY]:     () => this.handleEnergyGamification(gamification),
      [ENTRY_TYPES.GRATITUDE]:  () => this.handleGratitudeGamification(gamification, entry),
      [ENTRY_TYPES.MEDITATION]: () => this.handleMeditationGamification(gamification, entry),
      [ENTRY_TYPES.TAROT]:      () => this.handleTarotGamification(gamification),
      [ENTRY_TYPES.FLIP]:       () => this.handleFlipGamification(gamification),
      [ENTRY_TYPES.JOURNAL]:    () => this.handleJournalGamification(gamification)
    };

    (handlers[type] || (() => this.handleDefaultGamification(gamification)))();
  }

  handleEnergyGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.ENERGY], 'Energy Check-in');
    gamification.progressQuest('weekly',  'energy_7',            1);
    gamification.progressQuest('monthly', 'monthly_energy_28',   1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  handleGratitudeGamification(gamification, entry) {
    const count = entry.entries?.length || 1;
    const xp    = XP_REWARDS[ENTRY_TYPES.GRATITUDE] * count;
    gamification.addXP(xp, 'Gratitude Journal');
    gamification.progressQuest('daily',   'gratitude_entry',       count);
    gamification.progressQuest('weekly',  'gratitude_streak_7',    count);
    gamification.progressQuest('monthly', 'monthly_gratitude_28',  count);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  handleMeditationGamification(gamification, entry) {
    const duration = entry.duration || 10;
    const xp       = duration * XP_REWARDS[ENTRY_TYPES.MEDITATION];
    gamification.addXP(xp, 'Meditation');
    gamification.progressQuest('daily',   'meditation_session',       1);
    gamification.progressQuest('weekly',  'meditate_3',               1);
    gamification.progressQuest('monthly', 'monthly_meditation_15',    1);
    gamification.updateStreak();
    gamification.checkAllBadges();
    if (entry.chakra) gamification.updateChakra(entry.chakra, CHAKRA_BOOST);
  }

  handleTarotGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.TAROT], 'Tarot Reading');
    gamification.progressQuest('daily',   'tarot_spread',       1);
    gamification.progressQuest('weekly',  'tarot_4_days',       1);
    gamification.progressQuest('monthly', 'monthly_tarot_15',   1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  handleFlipGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.FLIP], 'Flip The Script');
    gamification.progressQuest('daily',   'flip_script',       1);
    gamification.progressQuest('weekly',  'flip_script_5',     1);
    gamification.progressQuest('monthly', 'monthly_flip_15',   1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  handleJournalGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.JOURNAL], 'Journal Entry');
    gamification.progressQuest('daily',   'journal_entry',       1);
    gamification.progressQuest('weekly',  'journal_5',           1);
    gamification.progressQuest('monthly', 'monthly_journal_20',  1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  handleDefaultGamification(gamification) {
    gamification.addXP(XP_REWARDS.DEFAULT, 'Activity');
    gamification.updateStreak();
    gamification.checkAllBadges();
  }
}
