/**
 * ProjectCuriosityApp - Main Application Controller
 *
 * Coordinates authentication, state management, navigation, and feature modules.
 * Central orchestrator that ties all app components together.
 */

import { showToast }    from './Toast.js';
import * as modal       from './Modal.js';
import { GamificationEngine } from '../Core/GamificationEngine.js';
import { supabase }     from './Supabase.js';
import DailyCards       from '../Features/DailyCards.js';
import CTA              from './CTA.js';
import { fetchProgress, saveProgress, clearCache } from '/src/Core/DB.js';
import { CommunityDB }  from '/src/Mini-Apps/CommunityHub/js/community-supabase.js';
import { Core as CommunityCore } from '/src/Mini-Apps/CommunityHub/js/core.js';
import { MemberProfileModal } from '/src/Mini-Apps/CommunityHub/js/member-profile-modal.js';
import { WhisperModal } from '/src/Mini-Apps/CommunityHub/js/WhisperModal.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEYS = Object.freeze({
  USER:             'pc_user',
  LAST_DAILY_RESET: 'lastDailyReset'
});

const ANIMATION_DURATIONS = Object.freeze({
  LEVEL_UP:          3_000,
  ACHIEVEMENT_MODAL: 8_000,
  FADE_OUT:          300
});

const TOAST_COOLDOWN = Object.freeze({
  DEFAULT:               1_200,
  TOAST_CLEANUP_INTERVAL: 60_000
});

const TAB_NAMES = Object.freeze({
  DASHBOARD:     'dashboard',
  CALCULATOR:    'calculator',
  ADMIN:         'admin',
  FLIP_SCRIPT:   'flip-script',
  KARMA_SHOP:    'karma-shop',
  MEDITATIONS:   'meditations',
  TAROT:         'tarot',
  ENERGY:        'energy',
  HAPPINESS:     'happiness',
  GRATITUDE:     'gratitude',
  JOURNAL:       'journal',
  SHADOW_ALCHEMY: 'shadow-alchemy',
  CHATBOT:       'chatbot',
  COMMUNITY_HUB: 'community-hub'
});

// Allowed avatar MIME types (security: only accept images)
const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
// Max avatar size: 5 MB
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

// ─── Safe localStorage ────────────────────────────────────────────────────────

const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } }
};

// ─── Module-level side effects ────────────────────────────────────────────────

// Expose Supabase client globally for Community Hub scripts (set in Supabase.js too)
window.AppSupabase = supabase;

// ─── ProjectCuriosityApp ──────────────────────────────────────────────────────

export default class ProjectCuriosityApp {
  /**
   * @param {Object} deps - Dependency injection
   * @param {Function} deps.AppState
   * @param {Function} deps.AuthManager
   * @param {Function} deps.NavigationManager
   * @param {Function} deps.DashboardManager
   * @param {Function} [deps.UserTab]
   */
  constructor(deps) {
    this.deps          = deps;
    this.state         = new deps.AppState(this);
    this.auth          = new deps.AuthManager(this);
    this.nav           = null;
    this.dashboard     = null;
    this.gamification  = null;
    this.dailyCards    = null;
    this.footerCTA     = null;
    this.features      = null;
    this.currentTab    = null;

    this._initialized              = false;
    this._gamificationListenersReady = false;

    this.toastThrottle             = new Map();
    this._toastCleanupInterval     = null;
    this._gamificationUnsubscribers = [];

    // showToast bound for external consumers
    this.showToast = showToast;

    window.app = this;
  }

  // ─── Toast management ───────────────────────────────────────────────────────

  showToastOnce(msg, type = 'info', key = null, cooldown = TOAST_COOLDOWN.DEFAULT) {
    const throttleKey = key || `${msg}:${type}`;
    const now         = Date.now();
    if (now - (this.toastThrottle.get(throttleKey) || 0) < cooldown) return;
    this.toastThrottle.set(throttleKey, now);
    showToast(msg, type, key);
  }

  _startToastCleanup() {
    if (this._toastCleanupInterval) return;
    this._toastCleanupInterval = setInterval(() => {
      const cutoff = Date.now() - TOAST_COOLDOWN.DEFAULT * 2;
      for (const [key, ts] of this.toastThrottle) {
        if (ts < cutoff) this.toastThrottle.delete(key);
      }
    }, TOAST_COOLDOWN.TOAST_CLEANUP_INTERVAL);
  }

  _stopToastCleanup() {
    if (this._toastCleanupInterval) {
      clearInterval(this._toastCleanupInterval);
      this._toastCleanupInterval = null;
    }
  }

  // ─── Profile management ─────────────────────────────────────────────────────

  async saveQuickProfile() {
    const profileData = this._getProfileFormData();
    if (!profileData?.name) {
      return this.showToast('Please fill in required fields', 'error');
    }

    let avatarUrl = this.state.currentUser.avatarUrl;

    if (profileData.file) {
      // Validate file type and size before upload
      if (!ALLOWED_AVATAR_TYPES.has(profileData.file.type)) {
        return this.showToast('Please upload a JPEG, PNG, WebP, or GIF image', 'error');
      }
      if (profileData.file.size > MAX_AVATAR_BYTES) {
        return this.showToast('Image must be smaller than 5 MB', 'error');
      }
      try {
        avatarUrl = await this._uploadAvatar(profileData.file);
      } catch (error) {
        console.error('[App] Avatar upload failed:', error);
        return this.showToast('Failed to upload avatar', 'error');
      }
    }

    try {
      await this._saveProfileToDatabase(profileData, avatarUrl);
      this._updateLocalUserState(profileData, avatarUrl);
      this.showToast('Profile updated!', 'success');
      if (this.deps.UserTab) new this.deps.UserTab(this).syncAvatar();
    } catch (error) {
      console.error('[App] Profile save failed:', error);
      this.showToast('Failed to save profile to cloud', 'error');
    }
  }

  /** @private */
  _getProfileFormData() {
    const nameEl = document.getElementById('profile-name');
    if (!nameEl) return null;

    const emailEl  = document.getElementById('profile-email');
    const phoneEl  = document.getElementById('profile-phone');
    const bdayEl   = document.getElementById('profile-birthday');
    const emojiEl  = document.getElementById('profile-emoji');
    const fileEl   = document.getElementById('avatar-upload');

    return {
      name:     nameEl.value.trim().slice(0, 100),
      email:    (emailEl?.value.trim()  || '').slice(0, 254),
      phone:    (phoneEl?.value.trim()  || '').slice(0, 20),
      birthday: bdayEl?.value           || null,
      emoji:    emojiEl?.value          || 'user',
      file:     fileEl?.files?.[0]      || null
    };
  }

  /** @private — uploads avatar, returns public URL */
  async _uploadAvatar(file) {
    // Use a safe filename — no user-controlled characters in the path
    const ext  = file.type.split('/')[1] || 'jpg';
    const path = `avatars/${this.state.currentUser.id}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    if (error) throw error;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl;
  }

  /** @private */
  async _saveProfileToDatabase(profileData, avatarUrl) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id:         this.state.currentUser.id,
        name:       profileData.name,
        phone:      profileData.phone,
        birthday:   profileData.birthday,
        emoji:      profileData.emoji,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    if (error) throw error;
  }

  /** @private */
  _updateLocalUserState(profileData, avatarUrl) {
    const user = {
      ...this.state.currentUser,
      name:      profileData.name,
      email:     profileData.email,
      phone:     profileData.phone,
      birthday:  profileData.birthday,
      emoji:     profileData.emoji,
      avatarUrl
    };
    this.state.currentUser = user;
    ls.set(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // ─── Gamification setup ─────────────────────────────────────────────────────

  _setupGamificationListeners() {
    if (this._gamificationListenersReady) return;
    if (!this.gamification) return;

    const g = this.gamification;

    const onLevelUp = ({ detail }) => {
      const { newLevel, title } = detail || {};
      if (!newLevel) return;
      this.showToastOnce(`🎉 Level Up! You reached Level ${newLevel}${title ? ` — ${title}` : ''}`, 'success', 'level-up', ANIMATION_DURATIONS.LEVEL_UP);
    };

    const onAchievement = ({ detail }) => {
      const { achievement } = detail || {};
      if (!achievement) return;
      this.showToastOnce(`🏆 Achievement Unlocked: ${achievement.name}`, 'success', `ach-${achievement.id}`, ANIMATION_DURATIONS.ACHIEVEMENT_MODAL);
    };

    const onKarmaChange = ({ detail }) => {
      const { amount, reason } = detail || {};
      if (!amount) return;
      const sign = amount > 0 ? '+' : '';
      this.showToastOnce(`✨ ${sign}${amount} Karma${reason ? ` — ${reason}` : ''}`, amount > 0 ? 'success' : 'warning', `karma-${reason}`, TOAST_COOLDOWN.DEFAULT);
    };

    window.addEventListener('levelUp',     onLevelUp);
    window.addEventListener('achievement', onAchievement);
    window.addEventListener('karmaChange', onKarmaChange);

    this._gamificationUnsubscribers.push(
      () => window.removeEventListener('levelUp',     onLevelUp),
      () => window.removeEventListener('achievement', onAchievement),
      () => window.removeEventListener('karmaChange', onKarmaChange)
    );

    this._gamificationListenersReady = true;
  }

  // ─── App initialization ─────────────────────────────────────────────────────

  async init() {
    const authenticated = await this.auth.checkAuth();
    if (!authenticated) {
      this.auth.renderAuthScreen();
    }
  }

  async initializeApp() {
    if (this._initialized) return;
    this._initialized = true;

    try {
      this._startToastCleanup();

      // ── Navigation ───────────────────────────────────────────────────────────
      this.nav = new this.deps.NavigationManager(this);
      this.nav.init();

      // ── User Tab ─────────────────────────────────────────────────────────────
      if (this.deps.UserTab) {
        this.userTab = new this.deps.UserTab(this);
        const headerHtml = this.userTab.render();
        const headerEl   = document.querySelector('.app-header, header, #app-header');
        if (headerEl) {
          headerEl.insertAdjacentHTML('beforeend', headerHtml);
        }
        await this.userTab.init();
      }

      // ── Gamification ─────────────────────────────────────────────────────────
      this.gamification = new GamificationEngine(this);
      await this.gamification.loadState();
      this._setupGamificationListeners();

      // ── Daily Cards ──────────────────────────────────────────────────────────
      this.dailyCards = new DailyCards(this);

      // ── Footer CTA ───────────────────────────────────────────────────────────
      this.footerCTA = new CTA(this);

      // ── Show app ─────────────────────────────────────────────────────────────
      this._hideAuthScreen();
      this._showMainApp();

      // ── Load modules & restore tab ───────────────────────────────────────────
      this.loadModules();
      this.restoreLastTab();
      this.checkDailyReset();

      // ── Community Hub ────────────────────────────────────────────────────────
      const boosterPromise = (async () => {
        try {
          await CommunityCore.init(this);
          window.CommunityDB = CommunityDB;

          if (!CommunityDB.ready) await CommunityDB.init(this.state.currentUser);

          window.MemberProfileModal = MemberProfileModal;
          MemberProfileModal.init();

          WhisperModal.init(this.state.currentUser);
        } catch (e) {
          console.warn('[App] Community Hub init failed (non-fatal):', e);
        }
      })();

      // ── Whisper push notification handlers ───────────────────────────────────

      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'OPEN_WHISPER_THREAD') {
            const { senderId } = event.data;
            if (!senderId) return;
            CommunityDB.getProfile(senderId).then(profile => {
              if (profile) {
                WhisperModal.openThread(profile.id, profile.name, profile.emoji, profile.avatar_url);
              }
            }).catch(e => console.warn('[App] Whisper deep-link profile fetch failed:', e));
          }
        });
      }

      const _whisperParam = new URLSearchParams(window.location.search).get('whisper');
      if (_whisperParam) {
        const _tryOpenWhisper = () => {
          if (CommunityDB.ready) {
            CommunityDB.getProfile(_whisperParam).then(profile => {
              if (profile) {
                WhisperModal.openThread(profile.id, profile.name, profile.emoji, profile.avatar_url);
              }
            }).catch(e => console.warn('[App] Whisper cold-launch profile fetch failed:', e));
          } else {
            setTimeout(_tryOpenWhisper, 300);
          }
        };
        _tryOpenWhisper();
      }

      await boosterPromise;

    } catch (error) {
      console.error('[App] initializeApp failed:', error);
      this.showToast('Failed to load app. Please refresh.', 'error');
    }
  }

  _hideAuthScreen() {
    const el = document.getElementById('auth-screen');
    if (el) el.style.display = 'none';
  }

  _showMainApp() {
    const el = document.getElementById('main-app');
    if (el) el.classList.remove('hidden');
  }

  // ─── Daily reset ────────────────────────────────────────────────────────────

  checkDailyReset() {
    const today     = new Date().toDateString();
    const lastReset = ls.get(STORAGE_KEYS.LAST_DAILY_RESET);
    if (lastReset !== today) {
      this.gamification.resetDailyQuests();
      ls.set(STORAGE_KEYS.LAST_DAILY_RESET, today);
    }
  }

  // ─── Module loading ─────────────────────────────────────────────────────────

  loadModules() {
    if (this.dashboard && this.state.data) this.dashboard.render();

    if (window.FeaturesManager) {
      try {
        this.features = new window.FeaturesManager(this);
        window.featuresManager = this.features;
      } catch (error) {
        console.error('[App] FeaturesManager init failed:', error);
      }
    }
  }

  // ─── Tab management ─────────────────────────────────────────────────────────

  initializeTab(tab) {
    const previousTab = this.currentTab;

    if (previousTab === TAB_NAMES.DASHBOARD && tab !== TAB_NAMES.DASHBOARD) {
      this.dashboard?.destroy();
    }

    this.currentTab = tab;

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
          console.warn('[App] Admin access denied');
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
        this._initFeatureTab(tab, previousTab);
        break;

      default:
        console.warn(`[App] Unknown tab: "${tab}"`);
    }
  }

  _initDashboardTab() {
    if (!this.dashboard) this.dashboard = new this.deps.DashboardManager(this);
    this.dashboard.render();
  }

  _initFeatureTab(tab, previousTab = null) {
    if (!this.features) {
      console.error('[App] FeaturesManager not available');
      this.showToast('Feature not available', 'error');
      return;
    }
    if (previousTab && previousTab !== tab && previousTab !== TAB_NAMES.DASHBOARD) {
      if (previousTab !== TAB_NAMES.COMMUNITY_HUB) {
        this.features.destroy(previousTab);
      }
    }
    this.features.init(tab);
  }

  async _loadCalculatorTab() {
    if (window.calculatorChunk === 'loaded') return;
    const host = document.getElementById('calculator-tab');
    if (!host) { console.error('[App] Calculator tab host not found'); return; }

    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    try {
      const { default: Launcher } = await import('/src/Mini-Apps/SelfAnalysisPro/loader.js');
      new Launcher(window.app).render();
      window.calculatorChunk = 'loaded';
    } catch (error) {
      console.error('[App] Calculator load failed:', error);
      host.textContent = 'Failed to load Self-Analysis Pro. Please try again.';
      this.showToast('Failed to load calculator', 'error');
    }
  }

  async _loadAdminTab() {
    // AdminTab removed
    console.warn('[App] AdminTab is no longer available.');
  }

  restoreLastTab() {
    this.nav?.switchTab(TAB_NAMES.DASHBOARD);
  }

  // ─── Modal helpers ───────────────────────────────────────────────────────────

  openSettings() { modal.openSettings(this); }
  openAbout()    { modal.openAbout(this);    }
  openContact()  { modal.openContact(this);  }

  // ─── Utility ─────────────────────────────────────────────────────────────────

  randomFrom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  async logout() {
    try {
      this.features?.destroyAll();
      clearCache();
      await this.auth.signOut();
    } catch (error) {
      console.error('[App] Logout failed:', error);
      this.showToast('Logout failed. Please try again.', 'error');
    }
  }

  // ─── Destroy ─────────────────────────────────────────────────────────────────

  destroy() {
    this._stopToastCleanup();
    this.toastThrottle.clear();

    this._gamificationUnsubscribers.forEach(fn => { if (typeof fn === 'function') fn(); });
    this._gamificationUnsubscribers = [];

    this.gamification?.destroy();
    this.gamification = null;

    this.dashboard?.destroy();
    this.dashboard = null;

    this.footerCTA = null;

    this._initialized               = false;
    this._gamificationListenersReady = false;
  }
}
