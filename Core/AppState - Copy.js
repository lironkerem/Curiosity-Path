/**
 * AppState - Core Application State Manager
 * 
 * Manages user data persistence with cloud-first strategy:
 * - Primary: Supabase cloud storage
 * - Fallback: localStorage cache
 * 
 * Handles:
 * - User progress data (entries, readings, meditations)
 * - Streaks and statistics
 * - Gamification triggers
 * - Data synchronization
 * 
 * @class AppState
 */

/* global window, console, localStorage */

import { fetchProgress, saveProgress } from '/Core/DB.js';

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'pc_appdata';

const ENTRY_TYPES = {
  ENERGY: 'energy',
  GRATITUDE: 'gratitude',
  MEDITATION: 'meditation',
  TAROT: 'tarot',
  FLIP: 'flip',
  JOURNAL: 'journal'
};

const XP_REWARDS = {
  [ENTRY_TYPES.ENERGY]: 20,
  [ENTRY_TYPES.GRATITUDE]: 30, // per entry
  [ENTRY_TYPES.MEDITATION]: 5, // per minute
  [ENTRY_TYPES.TAROT]: 25,
  [ENTRY_TYPES.FLIP]: 40,
  [ENTRY_TYPES.JOURNAL]: 35,
  DEFAULT: 10
};

const STATS_WINDOW_DAYS = 7;
const CHAKRA_BOOST = 5;

// ============================================================================
// MAIN CLASS
// ============================================================================

export default class AppState {
  /**
   * @param {Object} app - Main application instance
   */
  constructor(app) {
    this.app = app;
    this.currentUser = null;
    this.isAuthenticated = false;
    this.activeTab = 'dashboard';
    this.data = null;
    this.ready = this.init();
  }

  /**
   * Initializes the app state by loading data
   * @returns {Promise<AppState>} This instance when ready
   */
  async init() {
    this.data = await this.loadAppData();
    return this;
  }

  // ==========================================================================
  // DATA PERSISTENCE - LOAD
  // ==========================================================================

  /**
   * Loads app data with cloud-first strategy
   * Priority: Cloud → localStorage → Empty model
   * @returns {Promise<Object>} User data object
   */
  async loadAppData() {
    try {
      const cloudData = await this.loadFromCloud();
      if (cloudData) return cloudData;
      
      // Cloud failed, try localStorage
      const localData = this.loadFromLocalStorage();
      if (localData) return localData;
      
      // No data found, initialize empty
      console.log('📊 No cached data — initializing empty model');
      return this.emptyModel();
    } catch (error) {
      console.error('Failed to load app data:', error);
      return this.emptyModel();
    }
  }

  /**
   * Loads data from cloud storage
   * @returns {Promise<Object|null>} Cloud data or null if failed
   */
  async loadFromCloud() {
    try {
      const cloudData = fetchProgress(true);
      
      if (cloudData == null) {
        throw new Error('Cloud fetch returned null');
      }
      
      // Check if empty object (new user)
      if (Object.keys(cloudData).length === 0) {
        return this.emptyModel();
      }
      
      console.log('📊 Loaded user data from cloud');
      return cloudData;
    } catch (error) {
      console.warn('⚠️ Cloud read failed:', error.message);
      return null;
    }
  }

  /**
   * Loads data from localStorage cache
   * @returns {Object|null} Cached data or null if invalid
   */
  loadFromLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      
      const parsed = JSON.parse(raw);
      console.log('📊 Loaded user data from localStorage cache');
      return parsed;
    } catch (error) {
      console.warn('⚠️ localStorage parse failed, clearing cache:', error);
      this.clearLocalStorage();
      return null;
    }
  }

  // ==========================================================================
  // DATA PERSISTENCE - SAVE
  // ==========================================================================

  /**
   * Saves app data to cloud (primary) and localStorage (cache)
   * Handles errors gracefully and clears cache if quota exceeded
   */
  async saveAppData() {
    // Save to cloud (primary storage)
    await this.saveToCloud();
    
    // Save to localStorage (cache/fallback)
    this.saveToLocalStorage();
  }

  /**
   * Saves data to cloud storage
   */
  async saveToCloud() {
    try {
      await saveProgress(this.data);
    } catch (error) {
      console.error('❌ Cloud save failed:', error);
    }
  }

  /**
   * Saves data to localStorage cache
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage quota exceeded, clearing cache');
        this.clearLocalStorage();
      } else {
        console.error('❌ localStorage save failed:', error);
      }
    }
  }

  /**
   * Clears localStorage cache
   */
  clearLocalStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  // ==========================================================================
  // DATA MODEL
  // ==========================================================================

  /**
   * Returns empty data model structure for new users
   * @returns {Object} Empty data model
   */
  emptyModel() {
    return {
      // User entries
      energyEntries: [],
      gratitudeEntries: [],
      tarotReadings: [],
      meditationHistory: [],
      journalEntries: [],
      flipEntries: [],
      
      // User preferences
      favorites: [],
      achievements: [],
      
      // Progress tracking
      streaks: {
        current: 0,
        longest: 0,
        lastActive: null
      },
      
      // Statistics
      stats: {
        totalSessions: 0,
        totalMeditations: 0,
        totalReadings: 0
      },
      
      // Gamification data
      gamification: {
        xp: 0,
        level: 1,
        achievements: [],
        badges: [],
        quests: {},
        streaks: {
          current: 0,
          longest: 0,
          lastActive: null
        }
      }
    };
  }

  // ==========================================================================
  // STREAKS & STATISTICS
  // ==========================================================================

  /**
   * Updates user's daily streak
   * Increments if consecutive day, resets if missed day
   */
  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = this.data.streaks.lastActive;
    
    // Already updated today
    if (lastActive === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    // Increment if consecutive, reset if broken
    if (lastActive === yesterdayStr) {
      this.data.streaks.current += 1;
    } else {
      this.data.streaks.current = 1;
    }
    
    this.data.streaks.lastActive = today;
    
    // Update longest streak if current exceeds it
    if (this.data.streaks.current > this.data.streaks.longest) {
      this.data.streaks.longest = this.data.streaks.current;
    }
    
    this.saveAppData();
  }

  /**
   * Calculates and returns user statistics
   * @returns {Object} Statistics object
   */
  getStats() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - STATS_WINDOW_DAYS);
    
    // Calculate weekly meditations
    const weeklyMeditations = (this.data.meditationHistory || [])
      .filter(m => new Date(m.timestamp) >= weekAgo)
      .length;
    
    // Calculate average energy
    const recentEnergy = (this.data.energyEntries || []).slice(0, STATS_WINDOW_DAYS);
    const avgEnergy = recentEnergy.length
      ? Math.round(
          recentEnergy.reduce((sum, entry) => sum + (entry.energy || 0), 0) / recentEnergy.length
        )
      : 0;

    return {
      currentStreak: this.data.streaks?.current || 0,
      longestStreak: this.data.streaks?.longest || 0,
      weeklyMeditations,
      avgEnergy,
      totalGratitudes: (this.data.gratitudeEntries || []).length,
      achievements: (this.data.achievements || []).length
    };
  }

  /**
   * Gets today's entries for a specific type
   * @param {string} type - Entry type (energy, gratitude, etc.)
   * @returns {Array} Today's entries
   */
  getTodayEntries(type) {
    const today = new Date().toDateString();
    const key = `${type}Entries`;
    
    if (!this.data[key]) return [];
    
    return this.data[key].filter(entry => {
      const entryDate = new Date(entry.date || entry.timestamp);
      return entryDate.toDateString() === today;
    });
  }

  // ==========================================================================
  // ENTRY MANAGEMENT
  // ==========================================================================

  /**
   * Adds a new entry of specified type
   * Triggers streak update and gamification rewards
   * @param {string} type - Entry type
   * @param {Object} entry - Entry data
   */
  async addEntry(type, entry) {
    const key = `${type}Entries`;
    
    // Initialize array if doesn't exist
    if (!this.data[key]) {
      this.data[key] = [];
    }
    
    // Add entry with timestamp
    const newEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    this.data[key].unshift(newEntry);

    // Persist changes
    await this.saveAppData();
    
    // Update streak
    this.updateStreak();
    
    // Trigger gamification rewards
    if (window.app?.gamification) {
      this.triggerGamificationForEntry(type, entry);
    }
  }

  // ==========================================================================
  // GAMIFICATION INTEGRATION
  // ==========================================================================

  /**
   * Triggers gamification rewards based on entry type
   * Awards XP, progresses quests, updates streaks, checks badges
   * @param {string} type - Entry type
   * @param {Object} entry - Entry data
   */
  triggerGamificationForEntry(type, entry) {
    const gamification = window.app.gamification;
    if (!gamification) return;

    switch (type) {
      case ENTRY_TYPES.ENERGY:
        this.handleEnergyGamification(gamification);
        break;
        
      case ENTRY_TYPES.GRATITUDE:
        this.handleGratitudeGamification(gamification, entry);
        break;
        
      case ENTRY_TYPES.MEDITATION:
        this.handleMeditationGamification(gamification, entry);
        break;
        
      case ENTRY_TYPES.TAROT:
        this.handleTarotGamification(gamification);
        break;
        
      case ENTRY_TYPES.FLIP:
        this.handleFlipGamification(gamification);
        break;
        
      case ENTRY_TYPES.JOURNAL:
        this.handleJournalGamification(gamification);
        break;
        
      default:
        this.handleDefaultGamification(gamification);
    }
  }

  /**
   * Handles energy check-in gamification
   */
  handleEnergyGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.ENERGY], 'Energy Check-in');
    gamification.progressQuest('daily', 'energy_checkin', 1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  /**
   * Handles gratitude journal gamification
   */
  handleGratitudeGamification(gamification, entry) {
    const count = entry.entries?.length || 1;
    const xp = XP_REWARDS[ENTRY_TYPES.GRATITUDE] * count;
    
    gamification.addXP(xp, 'Gratitude Journal');
    gamification.progressQuest('daily', 'gratitude_1', count);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  /**
   * Handles meditation gamification
   */
  handleMeditationGamification(gamification, entry) {
    const duration = entry.duration || 10;
    const xp = duration * XP_REWARDS[ENTRY_TYPES.MEDITATION];
    
    gamification.addXP(xp, 'Meditation');
    gamification.progressQuest('daily', 'meditate_10', duration);
    gamification.progressQuest('weekly', 'meditate_5', 1);
    gamification.updateStreak();
    gamification.checkAllBadges();
    
    // Update chakra if specified
    if (entry.chakra) {
      gamification.updateChakra(entry.chakra, CHAKRA_BOOST);
    }
  }

  /**
   * Handles tarot reading gamification
   */
  handleTarotGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.TAROT], 'Tarot Reading');
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  /**
   * Handles flip the script gamification
   */
  handleFlipGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.FLIP], 'Flip The Script');
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  /**
   * Handles journal entry gamification
   */
  handleJournalGamification(gamification) {
    gamification.addXP(XP_REWARDS[ENTRY_TYPES.JOURNAL], 'Journal Entry');
    gamification.progressQuest('daily', 'journal_1', 1);
    gamification.updateStreak();
    gamification.checkAllBadges();
  }

  /**
   * Handles default activity gamification
   */
  handleDefaultGamification(gamification) {
    gamification.addXP(XP_REWARDS.DEFAULT, 'Activity');
    gamification.updateStreak();
    gamification.checkAllBadges();
  }
}