/**
 * ProjectCuriosityApp - Main Application Controller
 * 
 * Coordinates authentication, state management, navigation, and feature modules.
 * This is the central orchestrator that ties all app components together.
 */

/* global window, document, requestAnimationFrame */

import { showToast } from './Toast.js';
import * as modal from './Modal.js';
import { GamificationEngine } from '../Core/GamificationEngine.js';
import { supabase } from './Supabase.js';
import { DarkMode } from '/Core/Utils.js';
import DailyCards from '../Features/DailyCards.js';
import CTA from './CTA.js';
import { fetchProgress, saveProgress, clearCache } from '/Core/DB.js';

/* =========================================================
   CONSTANTS
   ========================================================= */

const STORAGE_KEYS = {
  USER: 'pc_user',
  LAST_DAILY_RESET: 'lastDailyReset'
};

const ANIMATION_DURATIONS = {
  LEVEL_UP: 3000,
  ACHIEVEMENT_MODAL: 8000,
  FADE_OUT: 300
};

const TOAST_COOLDOWN = {
  DEFAULT: 1200,
  TOAST_CLEANUP_INTERVAL: 60000 // Clean throttle map every minute
};

const TAB_NAMES = {
  DASHBOARD: 'dashboard',
  CALCULATOR: 'calculator',
  ADMIN: 'admin',
  FLIP_SCRIPT: 'flip-script',
  KARMA_SHOP: 'karma-shop',
  MEDITATIONS: 'meditations',
  TAROT: 'tarot',
  ENERGY: 'energy',
  HAPPINESS: 'happiness',
  GRATITUDE: 'gratitude',
  JOURNAL: 'journal',
  SHADOW_ALCHEMY: 'shadow-alchemy',
  CHATBOT: 'chatbot',
  COMMUNITY_HUB: 'community-hub'
};

const EMOJI = {
  LEVEL_UP: '🎉✨🌟⭐💫',
  ACHIEVEMENT: '🏆',
  FIRE: '🔥',
  TROPHY: '🏆',
  MEDAL: '🏅',
  BADGE: '🏖️',
  CHECKMARK: '✅',
  STAR: '🌟',
  GEM: '💎',
  SPARKLES: '💫',
  UNLOCK: '🔓'
};

// Initialize dark mode on module load
DarkMode.init();

// Expose Supabase client globally for Community Hub scripts
window.AppSupabase = supabase;

/* =========================================================
   MAIN APPLICATION CLASS
   ========================================================= */

export default class ProjectCuriosityApp {
  /**
   * @param {Object} deps - Dependency injection object
   * @param {Function} deps.AppState - State management class
   * @param {Function} deps.AuthManager - Authentication manager class
   * @param {Function} deps.NavigationManager - Navigation manager class
   * @param {Function} deps.DashboardManager - Dashboard manager class
   */
  constructor(deps) {
    this.deps = deps;
    this.state = new deps.AppState();
    this.auth = new deps.AuthManager(this);
    this.nav = null;
    this.dashboard = null;
    this.gamification = null;
    this.dailyCards = null;
    this.footerCTA = null;
    this.features = null;
    this.currentTab = null;

    // Initialization flags
    this._initialized = false;
    this._gamificationListenersReady = false;

    // Toast throttle management
    this.toastThrottle = new Map();
    this._toastCleanupInterval = null;

    // Gamification event cleanup
    this._gamificationUnsubscribers = [];

    // Bind methods
    this.showToast = showToast;

    // Expose to window for legacy compatibility
    window.app = this;
  }

  /* =========================================================
     TOAST MANAGEMENT
     ========================================================= */

  /**
   * Show toast with throttling to prevent spam
   * @param {string} msg - Message to display
   * @param {string} type - Toast type
   * @param {string|null} key - Optional unique key
   * @param {number} cooldown - Cooldown period in ms
   */
  showToastOnce(msg, type = 'info', key = null, cooldown = TOAST_COOLDOWN.DEFAULT) {
    const throttleKey = key || `${msg}:${type}`;
    const now = Date.now();
    const lastShown = this.toastThrottle.get(throttleKey) || 0;

    if (now - lastShown < cooldown) {
      return;
    }

    this.toastThrottle.set(throttleKey, now);
    showToast(msg, type, key);
  }

  /**
   * Start periodic cleanup of toast throttle map
   * @private
   */
  _startToastCleanup() {
    if (this._toastCleanupInterval) return;

    this._toastCleanupInterval = setInterval(() => {
      const now = Date.now();
      const cutoff = now - (TOAST_COOLDOWN.DEFAULT * 2);

      for (const [key, timestamp] of this.toastThrottle.entries()) {
        if (timestamp < cutoff) {
          this.toastThrottle.delete(key);
        }
      }
    }, TOAST_COOLDOWN.TOAST_CLEANUP_INTERVAL);
  }

  /**
   * Stop toast cleanup interval
   * @private
   */
  _stopToastCleanup() {
    if (this._toastCleanupInterval) {
      clearInterval(this._toastCleanupInterval);
      this._toastCleanupInterval = null;
    }
  }

  /* =========================================================
     PROFILE MANAGEMENT
     ========================================================= */

  /**
   * Save user profile with avatar upload
   */
  async saveQuickProfile() {
    const profileData = this._getProfileFormData();

    if (!profileData || !profileData.name) {
      return this.showToast('Please fill in required fields', 'error');
    }

    let avatarUrl = this.state.currentUser.avatarUrl;

    // Upload avatar if file selected
    if (profileData.file) {
      try {
        avatarUrl = await this._uploadAvatar(profileData.file);
      } catch (error) {
        console.error('Avatar upload failed:', error);
        return this.showToast('Failed to upload avatar', 'error');
      }
    }

    // Save to database
    try {
      await this._saveProfileToDatabase(profileData, avatarUrl);
      this._updateLocalUserState(profileData, avatarUrl);
      this.showToast('Profile updated!', 'success');

      // Sync avatar in UserTab if available
      if (this.deps.UserTab) {
        new this.deps.UserTab(this).syncAvatar();
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      return this.showToast('Failed to save profile to cloud', 'error');
    }
  }

  /**
   * Get profile form data from DOM
   * @private
   * @returns {Object|null} Profile data or null if form not found
   */
  _getProfileFormData() {
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const phoneEl = document.getElementById('profile-phone');
    const bdayEl = document.getElementById('profile-birthday');
    const emojiEl = document.getElementById('profile-emoji');
    const fileEl = document.getElementById('avatar-upload');

    if (!nameEl) return null;

    return {
      name: nameEl.value.trim(),
      email: emailEl?.value.trim() || '',
      phone: phoneEl?.value.trim() || '',
      birthday: bdayEl?.value || null,
      emoji: emojiEl?.value || '👤',
      file: fileEl?.files[0] || null
    };
  }

  /**
   * Upload avatar file to Supabase storage
   * @private
   * @param {File} file - Avatar file
   * @returns {Promise<string>} Public URL of uploaded avatar
   */
  async _uploadAvatar(file) {
    const ext = file.name.split('.').pop();
    const path = `avatars/${this.state.currentUser.id}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Save profile to Supabase database
   * @private
   * @param {Object} profileData - Profile data
   * @param {string} avatarUrl - Avatar URL
   */
  async _saveProfileToDatabase(profileData, avatarUrl) {
    const payload = {
      id: this.state.currentUser.id,
      name: profileData.name,
      phone: profileData.phone,
      birthday: profileData.birthday,
      emoji: profileData.emoji,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) throw error;
  }

  /**
   * Update local user state and localStorage
   * @private
   * @param {Object} profileData - Profile data
   * @param {string} avatarUrl - Avatar URL
   */
  _updateLocalUserState(profileData, avatarUrl) {
    const user = {
      ...this.state.currentUser,
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      birthday: profileData.birthday,
      emoji: profileData.emoji,
      avatarUrl
    };

    this.state.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  /* =========================================================
     GAMIFICATION SETUP
     ========================================================= */

  /**
   * Setup gamification event listeners
   */
  setupGamificationListeners() {
    if (this._gamificationListenersReady) return;
    this._gamificationListenersReady = true;

    const g = this.gamification;

    // Level up
    const unsub1 = g.on('levelUp', ({ level, title }) => {
      showToast(
        `${EMOJI.LEVEL_UP.slice(0, 2)} Level Up! You are now a ${title} (Level ${level})!`,
        'success'
      );
      this.playLevelUpAnimation();
    });

    // Streak updated
    const unsub2 = g.on('streakUpdated', ({ current, best }) => {
      if (current > 1) {
        showToast(`${EMOJI.FIRE} ${current} Day Streak!`, 'success');
      }
      if (current === best && current > 3) {
        showToast(`${EMOJI.TROPHY} New Best Streak: ${best} Days!`, 'success');
      }
    });

    // XP gained (respects skipToast flag)
    const unsub3 = g.on('xpGained', ({ amount, source, skipToast }) => {
      if (skipToast) return;
      showToast(`+${amount} XP from ${source}`, 'success');
    });

    // Karma gained (respects skipToast flag)
    const unsub4 = g.on('karmaGained', ({ amount, source, skipToast }) => {
      if (skipToast) return;
      showToast(`+${amount} Karma from ${source}`, 'success');
    });

    // Achievement unlocked
    const unsub5 = g.on('achievementUnlocked', (achievement) => {
      showToast(`${EMOJI.MEDAL} Achievement: ${achievement.name}`, 'success');
      this.showAchievementModal(achievement);
    });

    // Badge unlocked
    const unsub6 = g.on('badgeUnlocked', (badge) => {
      showToast(`${EMOJI.BADGE} New Badge: ${badge.name}`, 'success');
    });

    // Quest completed
    const unsub7 = g.on('questCompleted', (quest) => {
      showToast(`${EMOJI.CHECKMARK} Quest Complete: ${quest.name}`, 'success');
    });

    // All daily quests complete
    const unsub8 = g.on('dailyQuestsComplete', () => {
      showToast(`${EMOJI.STAR} All Daily Quests Complete! +50 Bonus XP`, 'success');
    });

    // Chakra updated
    const unsub9 = g.on('chakraUpdated', ({ chakra, value }) => {
      if (value >= 100) {
        showToast(`${EMOJI.GEM} ${chakra} Chakra Mastered!`, 'success');
      }
    });

    // Inspirational message
    const unsub10 = g.on('inspirationalMessage', (message) => {
      showToast(`${EMOJI.SPARKLES} ${message}`, 'info');
    });

    // Feature unlocked
    const unsub11 = g.on('featureUnlocked', (featureId) => {
      showToast(`${EMOJI.UNLOCK} New Feature Unlocked: ${featureId}`, 'success');
    });

    // Store unsubscribers for cleanup
    this._gamificationUnsubscribers.push(
      unsub1, unsub2, unsub3, unsub4, unsub5, unsub6,
      unsub7, unsub8, unsub9, unsub10, unsub11
    );
  }

  /**
   * Play level up animation
   */
  playLevelUpAnimation() {
    const el = document.createElement('div');
    el.className = 'level-up-confetti';
    el.textContent = EMOJI.LEVEL_UP;
    el.style.cssText = `
      position: fixed;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      animation: fadeOut 3s forwards;
      pointer-events: none;
      z-index: 10001;
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), ANIMATION_DURATIONS.LEVEL_UP);
  }
/**
   * Show achievement modal with animation
   * @param {Object} achievement - Achievement object
   */
  showAchievementModal(achievement) {
    // Remove existing modal if present
    const existing = document.getElementById('achievement-modal');
    if (existing) existing.remove();

    const modalEl = document.createElement('div');
    modalEl.id = 'achievement-modal';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s;
      backdrop-filter: blur(4px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 50px 40px;
      border-radius: 25px;
      text-align: center;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      transform: scale(0.7) translateY(-50px);
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    const icon = document.createElement('div');
    icon.style.cssText = `
      font-size: 5rem;
      margin-bottom: 1.5rem;
      animation: bounce 0.6s ease-in-out;
    `;
    icon.textContent = achievement.icon || EMOJI.ACHIEVEMENT;

    const title = document.createElement('h2');
    title.style.cssText = `
      color: white;
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    `;
    title.textContent = 'Achievement Unlocked!';

    const name = document.createElement('h3');
    name.style.cssText = `
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    `;
    name.textContent = achievement.name;

    const description = document.createElement('p');
    description.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    `;
    description.textContent = achievement.inspirational || '';

    const button = document.createElement('button');
    button.style.cssText = `
      background: white;
      color: #667eea;
      border: none;
      padding: 12px 40px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
    `;
    button.textContent = `Awesome! ${EMOJI.LEVEL_UP.slice(0, 2)}`;
    button.onmouseover = () => (button.style.transform = 'scale(1.05)');
    button.onmouseout = () => (button.style.transform = 'scale(1)');
    button.onclick = () => modalEl.remove();

    content.append(icon, title, name, description, button);
    wrapper.appendChild(content);
    modalEl.appendChild(wrapper);
    document.body.appendChild(modalEl);

    // Trigger animations
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      content.style.transform = 'scale(1) translateY(0)';
    });

    // Auto-close after duration
    setTimeout(() => modalEl.remove(), ANIMATION_DURATIONS.ACHIEVEMENT_MODAL);

    // Click outside to close
    wrapper.addEventListener('click', (e) => {
      if (e.target === wrapper) modalEl.remove();
    });
  }

  /* =========================================================
     APP INITIALIZATION
     ========================================================= */

  /**
   * Initialize application
   */
  async init() {
    try {
      console.log('🧘 Initializing Project Curiosity...');

      // Check authentication
      if (!(await this.auth.checkAuth())) {
        return this.auth.renderAuthScreen();
      }

      // Load data now that auth is confirmed
      await this.state.loadData();

      // Wait for state to be ready
      await this.state.ready;

      // Validate state
      if (!this._validateState()) {
        this.state.data = this.state.emptyModel();
      }

      // Initialize main app
      await this.initializeApp();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showToast('Failed to initialize app. Please refresh.', 'error');
    }
  }

  /**
   * Validate state integrity
   * @private
   * @returns {boolean} True if state is valid
   */
  _validateState() {
    return !!(this.state && this.state.data);
  }

  /**
   * Initialize main application components
   */
  async initializeApp() {
    if (this._initialized) return;
    this._initialized = true;

    try {
      console.log('✅ User authenticated, loading data...');

      // Ensure state is valid
      if (!this._validateState()) {
        await this.state.ready;
        if (!this._validateState()) {
          this.state.data = this.state.emptyModel();
        }
      }

      // Initialize gamification
      this.gamification = new GamificationEngine(this);
      this.setupGamificationListeners();

      // Initialize daily cards
      this.dailyCards = new DailyCards(this);
      await this.dailyCards.initializeBoosters();

      // Initialize CommunityDB for the Active Members dashboard widget.
      // We call CommunityDB.init() directly — intentionally NOT calling Core.init() —
      // so Core.state.initialized stays false and CommunityHubEngine can run it
      // in full when the user navigates to the Community Hub tab.
      if (window.CommunityDB) {
        const communityReady = await window.CommunityDB.init();
        if (!communityReady) {
          console.warn('[App] CommunityDB.init() failed — Active Members widget will be unavailable');
        } else {
          // Modals are self-initializing — they call init() inside their own open()
        }
      }

      // Show main app UI
      this._hideAuthScreen();
      this._showMainApp();

      // Initialize managers
      this.dashboard = new this.deps.DashboardManager(this);
      this.nav = new this.deps.NavigationManager(this);
      this.nav.render();

      // Initialize footer CTA
      this.footerCTA = new CTA();
      this.footerCTA.render();

      // Load feature modules
      this.loadModules();

      // Restore last active tab
      this.restoreLastTab();

      // Check if daily quests need reset
      this.checkDailyReset();

      // Start toast cleanup
      this._startToastCleanup();

      console.log('🎉 Project Curiosity loaded successfully!');
    } catch (error) {
      console.error('App initialization failed:', error);
      this.showToast('Failed to load app. Please refresh.', 'error');
    }
  }

  /**
   * Hide authentication screen
   * @private
   */
  _hideAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
  }

  /**
   * Show main application
   * @private
   */
  _showMainApp() {
    const app = document.getElementById('main-app');
    if (app) app.classList.remove('hidden');
  }

  /* =========================================================
     DAILY RESET
     ========================================================= */

  /**
   * Check and perform daily reset if needed
   */
  checkDailyReset() {
    const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_DAILY_RESET);
    const today = new Date().toDateString();

    if (lastReset !== today) {
      this.gamification.resetDailyQuests();
      localStorage.setItem(STORAGE_KEYS.LAST_DAILY_RESET, today);
      console.log('📅 Daily quests reset');
    }
  }

  /* =========================================================
     MODULE LOADING
     ========================================================= */

  /**
   * Load feature modules
   */
  loadModules() {
    // Render dashboard if ready
    if (this.dashboard && this.state.data) {
      this.dashboard.render();
    }

    // Initialize features manager if available
if (window.FeaturesManager) {
  try {
    this.features = new window.FeaturesManager(this);
    window.featuresManager = this.features;
  } catch (error) {
    console.error('FeaturesManager initialization failed:', error);
  }
}
  }

  /* =========================================================
     TAB MANAGEMENT
     ========================================================= */

  /**
   * Initialize and switch to tab
   * @param {string} tab - Tab name
   */
  initializeTab(tab) {
    // Cleanup previous tab
    if (this.currentTab === TAB_NAMES.DASHBOARD && tab !== TAB_NAMES.DASHBOARD) {
      if (this.dashboard) {
        this.dashboard.destroy();
      }
    }

    this.currentTab = tab;

    // Route to appropriate handler
    switch (tab) {
      case TAB_NAMES.DASHBOARD:
        this._initDashboardTab();
        break;

      case TAB_NAMES.CALCULATOR:
        this._loadCalculatorTab();
        break;

      case TAB_NAMES.ADMIN:
        if (this.state.currentUser?.isAdmin) {
          this._loadAdminTab();
        } else {
          console.warn('Admin access denied');
          this.showToast('Admin access required', 'error');
        }
        break;

      case TAB_NAMES.FLIP_SCRIPT:
      case TAB_NAMES.KARMA_SHOP:
      case TAB_NAMES.MEDITATIONS:
      case TAB_NAMES.TAROT:
      case TAB_NAMES.ENERGY:
      case TAB_NAMES.HAPPINESS:
      case TAB_NAMES.GRATITUDE:
      case TAB_NAMES.JOURNAL:
      case TAB_NAMES.SHADOW_ALCHEMY:
      case TAB_NAMES.CHATBOT:
      case TAB_NAMES.COMMUNITY_HUB:
        this._initFeatureTab(tab);
        break;

      default:
        console.warn(`Unknown tab: ${tab}`);
        this.showToast(`Tab "${tab}" not found`, 'error');
    }
  }

  /**
   * Initialize dashboard tab
   * @private
   */
  _initDashboardTab() {
    if (this.deps.DashboardManager) {
      this.dashboard = new this.deps.DashboardManager(this);
      this.dashboard.render();
    }
  }

  /**
   * Initialize feature tab
   * @private
   * @param {string} tab - Tab name
   */
  _initFeatureTab(tab) {
  if (this.features) {
    this.features.init(tab);
  } else {
    console.error('FeaturesManager not available');
    this.showToast('Feature not available', 'error');
  }
}

  /**
   * Load calculator tab (lazy loaded)
   * @private
   */
  async _loadCalculatorTab() {
    if (window.calculatorChunk === 'loaded') return;

    const host = document.getElementById('calculator-tab');
    if (!host) {
      console.error('Calculator tab host not found');
      return;
    }

    try {
      host.innerHTML = `
        <div class="loading-spinner-inner">
          <div class="spinner"></div>
          <p>Loading Self-Analysis Pro...</p>
        </div>
      `;

      const { default: SelfAnalysisLauncher } = await import(
        '/Mini-Apps/SelfAnalysisPro/loader.js'
      );

      new SelfAnalysisLauncher(window.app).render();
      window.calculatorChunk = 'loaded';
    } catch (error) {
      console.error('Failed to load calculator tab:', error);
      host.innerHTML = '<p>Failed to load Self-Analysis Pro. Please try again.</p>';
      this.showToast('Failed to load calculator', 'error');
    }
  }

  /**
   * Load admin tab (lazy loaded)
   * @private
   */
  async _loadAdminTab() {
    if (window.adminTabLoaded) return;

    const host = document.getElementById('admin-tab');
    if (!host) {
      console.error('Admin tab host not found');
      return;
    }

    try {
      host.innerHTML = `
        <div class="loading-spinner-inner">
          <div class="spinner"></div>
          <p>Loading Admin Panel...</p>
        </div>
      `;

      const { AdminTab } = await import('./AdminTab.js');
      const adminTab = new AdminTab(supabase);
      const content = await adminTab.render();

      host.innerHTML = '';
      host.appendChild(content);
      window.adminTabLoaded = true;
    } catch (error) {
      console.error('Failed to load admin tab:', error);
      host.innerHTML = '<p>Failed to load Admin Panel. Please try again.</p>';
      this.showToast('Failed to load admin panel', 'error');
    }
  }

  /**
   * Restore last active tab
   */
  restoreLastTab() {
    if (this.nav) {
      this.nav.switchTab(TAB_NAMES.DASHBOARD);
    }
  }

  /* =========================================================
     MODAL HELPERS
     ========================================================= */

  /**
   * Open settings modal
   */
  openSettings() {
    modal.openSettings(this);
  }

  /**
   * Open about modal
   */
  openAbout() {
    modal.openAbout(this);
  }

  /**
   * Open contact modal
   */
  openContact() {
    modal.openContact(this);
  }

  /* =========================================================
     UTILITY METHODS
     ========================================================= */

  /**
   * Get random element from array
   * @param {Array} arr - Array to pick from
   * @returns {*} Random element or null
   */
  randomFrom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Shuffle array in place
   * @param {Array} arr - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

/* =========================================================
   LOGOUT
   ========================================================= */
/**
 * Logout current user
 */
async logout() {
  try {
    if (this.features) {
      this.features.destroyAll();
    }
    
    clearCache();
    
    await this.auth.signOut();
  } catch (error) {
    console.error('Logout failed:', error);
    this.showToast('Logout failed. Please try again.', 'error');
  }
}

  /* =========================================================
     CLEANUP
     ========================================================= */

  /**
   * Cleanup and destroy app instance
   */
  destroy() {
    // Stop toast cleanup
    this._stopToastCleanup();

    // Clear toast throttle map
    this.toastThrottle.clear();

    // Unsubscribe from gamification events
    this._gamificationUnsubscribers.forEach(unsub => {
      if (typeof unsub === 'function') unsub();
    });
    this._gamificationUnsubscribers = [];

    // Destroy gamification engine
    if (this.gamification) {
      this.gamification.destroy();
      this.gamification = null;
    }

    // Cleanup dashboard
    if (this.dashboard) {
      this.dashboard.destroy();
      this.dashboard = null;
    }

    // Cleanup footer CTA
    if (this.footerCTA) {
      this.footerCTA = null;
    }

    // Clear initialization flags
    this._initialized = false;
    this._gamificationListenersReady = false;

    console.log('🧹 ProjectCuriosityApp destroyed');
  }
}