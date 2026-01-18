// Core/AppState.js - patched: removed obsolete alignment/energy calls, fully functional
/* global window, console, localStorage */

import { fetchProgress, saveProgress } from '/Core/DB.js';

export default class AppState {
  constructor(app) {
    this.app = app;
    this.currentUser = null;
    this.isAuthenticated = false;
    this.activeTab = 'dashboard';
    this.ready = this.init();
  }

  async init() {
    this.data = await this.loadAppData();
    return this;
  }

  /* ---------- LOAD: cloud first, local fallback ---------- */
  async loadAppData() {
    try {
      const cloud = await fetchProgress();
      if (cloud != null) {
        if (Object.keys(cloud).length === 0) return this.emptyModel();
        console.log('📊 Loaded user data from cloud');
        return cloud;
      }
      throw new Error('Cloud fetch failed');
    } catch (e) {
      console.warn('⚠️ Cloud read failed, falling back to localStorage:', e.message);
      const raw = localStorage.getItem('pc_appdata');
      if (raw) try { return JSON.parse(raw); } catch { localStorage.removeItem('pc_appdata'); }
      console.log('📊 No cached data – initializing empty model');
      return this.emptyModel();
    }
  }

  /* ---------- SAVE: cloud (primary) + localStorage (cache) ---------- */
  async saveAppData() {
    try { await saveProgress(this.data); } catch (e) { console.error('❌ Cloud save failed:', e); }
    try { localStorage.setItem('pc_appdata', JSON.stringify(this.data)); } catch (e) {
      if (e.name === 'QuotaExceededError') localStorage.removeItem('pc_appdata');
    }
  }

  /* ---------- default empty model ---------- */
  emptyModel() {
    return {
      energyEntries: [],
      gratitudeEntries: [],
      tarotReadings: [],
      meditationHistory: [],
      favorites: [],
      achievements: [],
      streaks: { current: 0, longest: 0, lastActive: null },
      stats: { totalSessions: 0, totalMeditations: 0, totalReadings: 0 }
    };
  }

  /* ---------- streak & stat helpers ---------- */
  updateStreak() {
    const today = new Date().toDateString();
    const last = this.data.streaks.lastActive;
    if (last === today) return;

    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    this.data.streaks.current = last === yesterday.toDateString() ? this.data.streaks.current + 1 : 1;
    this.data.streaks.lastActive = today;
    if (this.data.streaks.current > this.data.streaks.longest) this.data.streaks.longest = this.data.streaks.current;
    this.saveAppData();
  }

  getStats() {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const weekMed = (this.data.meditationHistory || []).filter(m => new Date(m.timestamp) >= weekAgo).length;
    const recentEnergy = (this.data.energyEntries || []).slice(0, 7);
    const avgEnergy = recentEnergy.length
      ? Math.round(recentEnergy.reduce((s, e) => s + (e.energy || 0), 0) / recentEnergy.length)
      : 0;

    return {
      currentStreak: this.data.streaks?.current || 0,
      longestStreak: this.data.streaks?.longest || 0,
      weeklyMeditations: weekMed,
      avgEnergy,
      totalGratitudes: (this.data.gratitudeEntries || []).length,
      achievements: (this.data.achievements || []).length
    };
  }

  getTodayEntries(type) {
    const today = new Date().toDateString();
    const key = `${type}Entries`;
    if (!this.data[key]) return [];
    return this.data[key].filter(en => new Date(en.date || en.timestamp).toDateString() === today);
  }

  /* ---------- addEntry ---------- */
  async addEntry(type, entry) {
    const key = `${type}Entries`;
    if (!this.data[key]) this.data[key] = [];
    this.data[key].unshift({ ...entry, timestamp: new Date().toISOString() });

    await this.saveAppData();
    this.updateStreak();
    if (window.app?.gamification) this.triggerGamificationForEntry(type, entry);
  }

triggerGamificationForEntry(type, entry) {
  const g = window.app.gamification;
  switch (type) {
    case 'energy':
      g.addXP(20, 'Energy Check-in');
      g.progressQuest('daily', 'energy_checkin', 1);
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      break;
    case 'gratitude':
      const cnt = entry.entries?.length || 1;
      g.addXP(30 * cnt, 'Gratitude Journal');
      g.progressQuest('daily', 'gratitude_1', cnt);
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      break;
    case 'meditation':
      const dur = entry.duration || 10;
      g.addXP(dur * 5, 'Meditation');
      g.progressQuest('daily', 'meditate_10', dur);
      g.progressQuest('weekly', 'meditate_5', 1);
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      if (entry.chakra) g.updateChakra(entry.chakra, 5);
      break;
    case 'tarot':
      g.addXP(25, 'Tarot Reading');
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      break;
    case 'flip':
      g.addXP(40, 'Flip The Script');
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      break;
    case 'journal':
      g.addXP(35, 'Journal Entry');
      g.progressQuest('daily', 'journal_1', 1);
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
      break;
    default:
      g.addXP(10, 'Activity');
      g.updateStreak();
      g.checkAllBadges(); // ADD THIS
  }
}
}