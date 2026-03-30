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
import { DarkMode }     from '/Core/Utils.js';
import DailyCards       from '../Features/DailyCards.js';
import CTA              from './CTA.js';
import { fetchProgress, saveProgress, clearCache } from '/Core/DB.js';
import { CommunityDB }  from '/Mini-Apps/CommunityHub/js/community-supabase.js';
import { Core as CommunityCore } from '/Mini-Apps/CommunityHub/js/core.js';
import { MemberProfileModal } from '/Mini-Apps/CommunityHub/js/member-profile-modal.js';
import { WhisperModal } from '/Mini-Apps/CommunityHub/js/WhisperModal.js';

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

DarkMode.init();
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

  setupGamificationListeners() {
    if (this._gamificationListenersReady) return;
    this._gamificationListenersReady = true;

    const g = this.gamification;

    const subs = [
      g.on('levelUp',           ({ level, title }) => {
        showToast(`Level Up! You are now a ${title} (Level ${level})!`, 'success');
      }),
      g.on('streakUpdated',     ({ current, best }) => {
        if (current > 1) showToast(`${current} Day Streak!`, 'success');
        if (current === best && current > 3) showToast(`New Best Streak: ${best} Days!`, 'success');
      }),
      g.on('xpGained',          ({ amount, source, skipToast }) => {
        if (!skipToast) showToast(`+${amount} XP from ${source}`, 'success');
      }),
      g.on('karmaGained',       ({ amount, source, skipToast }) => {
        if (!skipToast) showToast(`+${amount} Karma from ${source}`, 'success');
      }),
      g.on('achievementUnlocked', achievement => {
        showToast(`Achievement: ${achievement.name}`, 'success');
        this.showAchievementModal(achievement);
      }),
      g.on('badgeUnlocked',     badge => {
        showToast(`New Badge: ${badge.name}`, 'success');
      }),
      g.on('chakraUpdated',     ({ chakra, value }) => {
        if (value >= 100) showToast(`${chakra} Chakra Mastered!`, 'success');
      }),
      g.on('featureUnlocked',   featureId => {
        showToast(`New Feature Unlocked: ${featureId}`, 'success');
      })
    ];

    this._gamificationUnsubscribers.push(...subs);
  }

  /** Simple level-up confetti element (supplementary to GamificationEngine spectacle) */
  playLevelUpAnimation() {
    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.className   = 'level-up-confetti';
    el.textContent = '🎉';
    Object.assign(el.style, {
      position: 'fixed', top: '40%', left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '3rem', animation: 'fadeOut 3s forwards',
      pointerEvents: 'none', zIndex: '10001'
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ANIMATION_DURATIONS.LEVEL_UP);
  }

  /**
   * Show achievement modal.
   * Built entirely via DOM methods — no innerHTML with achievement data (XSS safe).
   */
  showAchievementModal(achievement) {
    document.getElementById('achievement-modal')?.remove();

    const modalEl  = document.createElement('div');
    modalEl.id     = 'achievement-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-labelledby', 'achievement-modal-title');

    const wrapper  = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
      background: 'rgba(0,0,0,.75)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      zIndex: '10000', opacity: '0', transition: 'opacity 0.3s',
      backdropFilter: 'blur(4px)'
    });

    const content  = document.createElement('div');
    Object.assign(content.style, {
      background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      padding: '50px 40px', borderRadius: '25px', textAlign: 'center',
      maxWidth: '450px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,.4)',
      transform: 'scale(0.7) translateY(-50px)',
      transition: 'all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)'
    });

    // Icon — textContent, never innerHTML
    const icon     = document.createElement('div');
    icon.setAttribute('aria-hidden', 'true');
    Object.assign(icon.style, { fontSize: '5rem', marginBottom: '1.5rem' });
    icon.textContent = achievement.icon || '🏆';

    const h2       = document.createElement('h2');
    h2.id          = 'achievement-modal-title';
    Object.assign(h2.style, { color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,.3)' });
    h2.textContent = 'Achievement Unlocked!';

    const h3       = document.createElement('h3');
    Object.assign(h3.style, { color: 'rgba(255,255,255,.95)', fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' });
    h3.textContent = achievement.name || '';

    const desc     = document.createElement('p');
    Object.assign(desc.style, { color: 'rgba(255,255,255,.9)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' });
    desc.textContent = achievement.inspirational || '';

    const btn      = document.createElement('button');
    btn.type       = 'button';
    Object.assign(btn.style, {
      background: 'white', color: '#667eea', border: 'none',
      padding: '12px 40px', borderRadius: '50px', fontSize: '1.1rem',
      fontWeight: 'bold', cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,.2)', transition: 'all 0.3s'
    });
    btn.textContent = 'Awesome! 🎉';
    btn.addEventListener('mouseover', () => { btn.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseout',  () => { btn.style.transform = 'scale(1)'; });
    btn.addEventListener('click',     () => modalEl.remove());

    content.append(icon, h2, h3, desc, btn);
    wrapper.appendChild(content);
    modalEl.appendChild(wrapper);
    document.body.appendChild(modalEl);

    // Return focus on close
    const previouslyFocused = document.activeElement;
    const close = () => { modalEl.remove(); previouslyFocused?.focus(); };
    btn.addEventListener('click', close, { once: true });
    wrapper.addEventListener('click', e => { if (e.target === wrapper) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    // Animate in
    requestAnimationFrame(() => {
      wrapper.style.opacity          = '1';
      content.style.transform        = 'scale(1) translateY(0)';
    });

    // Auto-close
    setTimeout(close, ANIMATION_DURATIONS.ACHIEVEMENT_MODAL);

    // Focus the dismiss button
    setTimeout(() => btn.focus(), 100);
  }

  // ─── App initialization ─────────────────────────────────────────────────────

  async init() {
    try {
      // ── Capacitor deep link: handle OAuth callback on cold start ─────────────
      // When Android opens the app via curiositypath://login-callback, the app
      // cold-starts. getLaunchUrl() reads the URL synchronously before checkAuth().
      if (window.Capacitor?.isNativePlatform?.()) {
        const AppPlugin = window.Capacitor?.Plugins?.App;
        const Browser   = window.Capacitor?.Plugins?.Browser;

        const _handleDeepLink = async (url) => {
          if (!url || !url.startsWith('curiositypath://')) return false;
          if (Browser) await Browser.close().catch(() => {});
          const fragment     = url.split('#')[1] || url.split('?')[1] || '';
          const params       = new URLSearchParams(fragment);
          const accessToken  = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          if (accessToken && refreshToken) {
            await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
            return true;
          }
          return false;
        };

        if (AppPlugin) {
          // Register appUrlOpen FIRST — handles case where app is already running
          AppPlugin.addListener('appUrlOpen', async (event) => {
            const handled = await _handleDeepLink(event?.url || '');
            if (handled) {
              if (await this.auth.checkAuth()) {
                await this.state.loadData();
                await this.state.ready;
                if (!this._validateState()) this.state.data = this.state.emptyModel();
                await this.initializeApp();
              }
            }
          });

          // Check getLaunchUrl — handles cold start via deep link
          try {
            const launchData = await AppPlugin.getLaunchUrl();
            await _handleDeepLink(launchData?.url || '');
          } catch (e) {
            console.warn('[App] getLaunchUrl failed (non-fatal):', e);
          }
        }
      }

      if (!(await this.auth.checkAuth())) {
        return this.auth.renderAuthScreen();
      }
      await this.state.loadData();
      await this.state.ready;
      if (!this._validateState()) this.state.data = this.state.emptyModel();
      await this.initializeApp();
    } catch (error) {
      console.error('[App] Initialization failed:', error);
      this.showToast('Failed to initialize app. Please refresh.', 'error');
    }
  }

  _validateState() { return !!(this.state && this.state.data); }

  async initializeApp() {
    if (this._initialized) return;
    this._initialized = true;

    try {
      if (!this._validateState()) {
        await this.state.ready;
        if (!this._validateState()) this.state.data = this.state.emptyModel();
      }

      // Gamification
      this.gamification = new GamificationEngine(this);
      this.setupGamificationListeners();

      // Daily cards — fire & forget (non-blocking); only await if it gates visible UI
      this.dailyCards = new DailyCards(this);
      const boosterPromise = this.dailyCards.initializeBoosters().catch(e => {
        console.warn('[App] DailyCards.initializeBoosters() failed (non-fatal):', e);
      });

      // ── SHOW APP IMMEDIATELY ─────────────────────────────────────────────────
      // Render shell now so LCP / Speed Index are not blocked by network calls.
      this._hideAuthScreen();
      this._showMainApp();

      this.dashboard = new this.deps.DashboardManager(this);
      this.nav       = new this.deps.NavigationManager(this);
      this.nav.render();

      this.footerCTA = new CTA();
      this.footerCTA.render();

      this.checkDailyReset();
      this.loadModules();
      this.restoreLastTab();
      this._startToastCleanup();
      // ────────────────────────────────────────────────────────────────────────

      // Community DB is non-critical (only needed for the Active Members widget).
      // Run after the app is visible — never block initial render on it.
      Promise.resolve().then(async () => {
        try {
          if (!CommunityCore.state.initialized) {
            const communityReady = await CommunityDB.init();
            if (!communityReady) {
              console.warn('[App] CommunityDB.init() failed — Active Members widget unavailable');
            } else {
              await CommunityCore.loadCurrentUser();
              await CommunityDB.setPresence(
                CommunityCore.state.currentUser?.status   || 'online',
                CommunityCore.state.currentUser?.activity || '✨ Available',
                null
              );
            }
          }
        } catch (e) {
          console.warn('[App] Community init failed (non-fatal):', e);
        }
      });

      // Await booster init quietly in the background (already started above)
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
      this.features.destroy(previousTab);
    }
    this.features.init(tab);
  }

  async _loadCalculatorTab() {
    if (window.calculatorChunk === 'loaded') return;
    const host = document.getElementById('calculator-tab');
    if (!host) { console.error('[App] Calculator tab host not found'); return; }

    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    try {
      const { default: Launcher } = await import('/Mini-Apps/SelfAnalysisPro/loader.js');
      new Launcher(window.app).render();
      window.calculatorChunk = 'loaded';
    } catch (error) {
      console.error('[App] Calculator load failed:', error);
      host.textContent = 'Failed to load Self-Analysis Pro. Please try again.';
      this.showToast('Failed to load calculator', 'error');
    }
  }

  async _loadAdminTab() {
    if (window.adminTabLoaded) return;
    const host = document.getElementById('admin-tab');
    if (!host) { console.error('[App] Admin tab host not found'); return; }

    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Admin Panel...</p></div>';

    try {
      const { AdminTab } = await import('./AdminTab.js');
      const content     = await new AdminTab(supabase).render();
      host.innerHTML    = '';
      host.appendChild(content);
      window.adminTabLoaded = true;
    } catch (error) {
      console.error('[App] Admin tab load failed:', error);
      host.textContent = 'Failed to load Admin Panel. Please try again.';
      this.showToast('Failed to load admin panel', 'error');
    }
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
