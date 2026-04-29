/**
 * AppState - Core Application State Manager
 * Cloud-first persistence: Supabase → localStorage → empty model
 */

/* global window, console, localStorage */

import { fetchProgress, saveProgress, clearCache } from '/src/Core/DB.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pc_appdata';

const ENTRY_TYPES = {
  ENERGY:     'energy',
  GRATITUDE:  'gratitude',
  MEDITATION: 'meditation',
  TAROT:      'tarot',
  FLIP:       'flip',
  JOURNAL:    'journal'
};

const XP_REWARDS = {
  [ENTRY_TYPES.ENERGY]:     20,
  [ENTRY_TYPES.GRATITUDE]:  30, // per entry
  [ENTRY_TYPES.MEDITATION]:  5, // per minute
  [ENTRY_TYPES.TAROT]:      25,
  [ENTRY_TYPES.FLIP]:       40,
  [ENTRY_TYPES.JOURNAL]:    35,
  DEFAULT:                  10
};

const STATS_WINDOW_DAYS = 7;
const CHAKRA_BOOST      = 5;

/** Top-level keys expected in a valid data model. Used to validate localStorage cache. */
const VALID_TOP_LEVEL_KEYS = new Set([
  'energyEntries', 'gratitudeEntries', 'tarotReadings', 'meditationEntries',
  'journalEntries', 'flipEntries', 'favorites', 'achievements', 'streaks', 'stats'
]);

// ─── AppState ─────────────────────────────────────────────────────────────────

export default class AppState {
  constructor(app) {
    this.app             = app;
    this.currentUser     = null;
    this.isAuthenticated = false;
    this.activeTab       = 'dashboard';
    this.data            = null;
    this.ready           = Promise.resolve(this);
  }

  /** Call explicitly after auth is confirmed. */
  async loadData() {
    this.data  = await this.loadAppData();
    this.ready = Promise.resolve(this);
    return this;
  }

  // ─── Load ─────────────────────────────────────────────────────────────────

  async loadAppData() {
    try {
      const cloud = await this.loadFromCloud();
      if (cloud) return cloud;
      const local = this.loadFromLocalStorage();
      return local || this.emptyModel();
    } catch (e) {
      console.error('Failed to load app data:', e);
      return this.emptyModel();
    }
  }

  async loadFromCloud() {
    try {
      const data = await fetchProgress(true);
      if (data == null) throw new Error('Cloud fetch returned null');
      if (Object.keys(data).length === 0) return this.emptyModel();
      return data;
    } catch (e) {
      console.warn('⚠️ Cloud read failed:', e.message);
      return null;
    }
  }

  loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Validate shape: must be an object with at least one known top-level key
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn('⚠️ localStorage data has unexpected shape, discarding');
        this.clearLocalStorage();
        return null;
      }
      const keys = Object.keys(parsed);
      const hasValidKey = keys.some(k => VALID_TOP_LEVEL_KEYS.has(k));
      if (!hasValidKey) {
        console.warn('⚠️ localStorage data failed shape validation, discarding');
        this.clearLocalStorage();
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('⚠️ localStorage parse failed, clearing cache:', e);
      this.clearLocalStorage();
      return null;
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async saveAppData() {
    await this.saveToCloud();
    this.saveToLocalStorage();
  }

  async saveToCloud() {
    try {
      await saveProgress(this.data);
    } catch (e) {
      console.error('❌ Cloud save failed:', e);
    }
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage quota exceeded, clearing cache');
        this.clearLocalStorage();
      } else {
        console.error('❌ localStorage save failed:', e);
      }
    }
  }

  clearLocalStorage() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }

  /** Clear DB-layer cache + localStorage before a forced reload. */
  clearCache() {
    clearCache();
    this.clearLocalStorage();
  }

  // ─── Data model ───────────────────────────────────────────────────────────

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
      streaks: { current: 0, longest: 0, lastActive: null },
      stats:   { totalSessions: 0, totalMeditations: 0, totalReadings: 0 }
      // Gamification state is managed flat by GamificationEngine via saveState().
    };
  }

  // ─── Streaks & stats ──────────────────────────────────────────────────────

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
      ? Math.round(recentEnergy.reduce((s, e) => s + (e.energy || 0), 0) / recentEnergy.length)
      : 0;

    return {
      currentStreak:    this.data.streaks?.current  || 0,
      longestStreak:    this.data.streaks?.longest  || 0,
      weeklyMeditations,
      totalMeditations: (this.data.meditationEntries || []).length,
      avgEnergy,
      totalGratitudes:  (this.data.gratitudeEntries || []).length,
      achievements:     (this.data.achievements     || []).length
    };
  }

  getTodayEntries(type) {
    const today = new Date().toDateString();
    const key   = `${type}Entries`;
    return (this.data[key] || []).filter(entry =>
      new Date(entry.date || entry.timestamp).toDateString() === today
    );
  }

  // ─── Entry management ─────────────────────────────────────────────────────

  async addEntry(type, entry) {
    const key = `${type}Entries`;
    if (!this.data[key]) this.data[key] = [];
    this.data[key].unshift({ ...entry, timestamp: new Date().toISOString() });
    await this.saveAppData();
    this.updateStreak();
    if (window.app?.gamification) this.triggerGamificationForEntry(type, entry);
  }

  // ─── Gamification triggers ────────────────────────────────────────────────

  triggerGamificationForEntry(type, entry) {
    const g = window.app.gamification;
    if (!g) return;
    switch (type) {
      case ENTRY_TYPES.ENERGY:
        g.addXP(XP_REWARDS[ENTRY_TYPES.ENERGY], 'Energy Check-in');
        g.progressQuest('weekly',  'energy_7', 1);
        g.progressQuest('monthly', 'monthly_energy_28', 1);
        break;
      case ENTRY_TYPES.GRATITUDE: {
        const count = entry.entries?.length || 1;
        g.addXP(XP_REWARDS[ENTRY_TYPES.GRATITUDE] * count, 'Gratitude Journal');
        g.progressQuest('daily',   'gratitude_entry',       count);
        g.progressQuest('weekly',  'gratitude_streak_7',    count);
        g.progressQuest('monthly', 'monthly_gratitude_28',  count);
        break;
      }
      case ENTRY_TYPES.MEDITATION: {
        const dur = entry.duration || 10;
        g.addXP(dur * XP_REWARDS[ENTRY_TYPES.MEDITATION], 'Meditation');
        g.progressQuest('daily',   'meditation_session', 1);
        g.progressQuest('weekly',  'meditate_3',         1);
        g.progressQuest('monthly', 'monthly_meditation_15', 1);
        if (entry.chakra) g.updateChakra(entry.chakra, CHAKRA_BOOST);
        break;
      }
      case ENTRY_TYPES.TAROT:
        g.addXP(XP_REWARDS[ENTRY_TYPES.TAROT], 'Tarot Reading');
        g.progressQuest('daily',   'tarot_spread',       1);
        g.progressQuest('weekly',  'tarot_4_days',       1);
        g.progressQuest('monthly', 'monthly_tarot_15',   1);
        break;
      case ENTRY_TYPES.FLIP:
        g.addXP(XP_REWARDS[ENTRY_TYPES.FLIP], 'Flip The Script');
        g.progressQuest('daily',   'flip_script',        1);
        g.progressQuest('weekly',  'flip_script_5',      1);
        g.progressQuest('monthly', 'monthly_flip_15',    1);
        break;
      case ENTRY_TYPES.JOURNAL:
        g.addXP(XP_REWARDS[ENTRY_TYPES.JOURNAL], 'Journal Entry');
        g.progressQuest('daily',   'journal_entry',      1);
        g.progressQuest('weekly',  'journal_5',          1);
        g.progressQuest('monthly', 'monthly_journal_20', 1);
        break;
      default:
        g.addXP(XP_REWARDS.DEFAULT, 'Activity');
    }
    g.updateStreak();
    g.checkAllBadges();
  }
}