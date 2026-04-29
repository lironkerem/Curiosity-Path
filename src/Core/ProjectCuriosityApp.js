/**
 * ProjectCuriosityApp - Main Application Controller
 */

import { showToast }    from './Toast.js';
import * as modal       from './Modal.js';
import { GamificationEngine } from '../Core/GamificationEngine.js';
import { supabase }     from './Supabase.js';
import DailyCards       from '../Features/DailyCards.js';
import CTA              from './CTA.js';
import { clearCache }   from '/src/Core/DB.js';
import { CommunityDB }  from '/src/Mini-Apps/CommunityHub/js/community-supabase.js';
import { Core as CommunityCore } from '/src/Mini-Apps/CommunityHub/js/core.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEYS = Object.freeze({
  USER:             'pc_user',
  LAST_DAILY_RESET: 'lastDailyReset',
  ACTIVE_TAB:       'pc_active_tab'
});

const ANIMATION_DURATIONS = Object.freeze({
  LEVEL_UP:          3_000,
  ACHIEVEMENT_MODAL: 8_000
});

const TOAST_COOLDOWN = Object.freeze({
  DEFAULT:                1_200,
  TOAST_CLEANUP_INTERVAL: 60_000
});

const TAB_NAMES = Object.freeze({
  DASHBOARD:      'dashboard',
  CALCULATOR:     'calculator',
  FLIP_SCRIPT:    'flip-script',
  KARMA_SHOP:     'karma-shop',
  MEDITATIONS:    'meditations',
  TAROT:          'tarot',
  ENERGY:         'energy',
  HAPPINESS:      'happiness',
  GRATITUDE:      'gratitude',
  JOURNAL:        'journal',
  SHADOW_ALCHEMY: 'shadow-alchemy',
  CHATBOT:        'chatbot',
  COMMUNITY_HUB:  'community-hub'
});

const ALLOWED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

// ─── Safe localStorage ────────────────────────────────────────────────────────

const ls = {
  get: k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } }
};

// ─── Module-level side effects ────────────────────────────────────────────────

window.AppSupabase = supabase;

// ─── Lazy WhisperModal loader ─────────────────────────────────────────────────

async function _getWhisperModal() {
  if (!window.WhisperModal) {
    try {
      const mod = await import('/src/Mini-Apps/CommunityHub/js/WhisperModal.js');
      window.WhisperModal = mod.WhisperModal ?? mod.default;
    } catch (e) {
      console.warn('[App] WhisperModal failed to load:', e);
      return null;
    }
  }
  return window.WhisperModal;
}

// ─── ProjectCuriosityApp ──────────────────────────────────────────────────────

export default class ProjectCuriosityApp {
  constructor(deps) {
    this.deps         = deps;
    this.state        = new deps.AppState(this);
    this.auth         = new deps.AuthManager(this);
    this.nav          = null;
    this.dashboard    = null;
    this.gamification = null;
    this.dailyCards   = null;
    this.footerCTA    = null;
    this.features     = null;
    this.currentTab   = null;

    this._initialized               = false;
    this._gamificationListenersReady = false;

    this.toastThrottle              = new Map();
    this._toastCleanupInterval      = null;
    this._gamificationUnsubscribers = [];

    this.showToast = showToast;
    window.app = this;
  }

  // ─── Toast ──────────────────────────────────────────────────────────────────

  showToastOnce(msg, type = 'info', key = null, cooldown = TOAST_COOLDOWN.DEFAULT) {
    const k   = key || `${msg}:${type}`;
    const now = Date.now();
    if (now - (this.toastThrottle.get(k) || 0) < cooldown) return;
    this.toastThrottle.set(k, now);
    showToast(msg, type, k);
  }

  _startToastCleanup() {
    if (this._toastCleanupInterval) return;
    this._toastCleanupInterval = setInterval(() => {
      const cutoff = Date.now() - TOAST_COOLDOWN.DEFAULT * 2;
      for (const [k, ts] of this.toastThrottle) {
        if (ts < cutoff) this.toastThrottle.delete(k);
      }
    }, TOAST_COOLDOWN.TOAST_CLEANUP_INTERVAL);
  }

  _stopToastCleanup() {
    if (this._toastCleanupInterval) {
      clearInterval(this._toastCleanupInterval);
      this._toastCleanupInterval = null;
    }
  }

  // ─── Profile ────────────────────────────────────────────────────────────────

  async saveQuickProfile() {
    const profileData = this._getProfileFormData();
    if (!profileData?.name) return this.showToast('Please fill in required fields', 'error');

    let avatarUrl = this.state.currentUser.avatarUrl;
    if (profileData.file) {
      if (!ALLOWED_AVATAR_TYPES.has(profileData.file.type))
        return this.showToast('Please upload a JPEG, PNG, WebP, or GIF image', 'error');
      if (profileData.file.size > MAX_AVATAR_BYTES)
        return this.showToast('Image must be smaller than 5 MB', 'error');
      try {
        avatarUrl = await this._uploadAvatar(profileData.file);
      } catch (e) {
        console.error('[App] Avatar upload failed:', e);
        return this.showToast('Failed to upload avatar', 'error');
      }
    }

    try {
      await this._saveProfileToDatabase(profileData, avatarUrl);
      this._updateLocalUserState(profileData, avatarUrl);
      this.showToast('Profile updated!', 'success');
      if (this.deps.UserTab) new this.deps.UserTab(this).syncAvatar();
    } catch (e) {
      console.error('[App] Profile save failed:', e);
      this.showToast('Failed to save profile to cloud', 'error');
    }
  }

  _getProfileFormData() {
    const nameEl = document.getElementById('profile-name');
    if (!nameEl) return null;
    return {
      name:     nameEl.value.trim().slice(0, 100),
      email:    (document.getElementById('profile-email')?.value.trim()  || '').slice(0, 254),
      phone:    (document.getElementById('profile-phone')?.value.trim()  || '').slice(0, 20),
      birthday:  document.getElementById('profile-birthday')?.value      || null,
      emoji:     document.getElementById('profile-emoji')?.value         || 'user',
      file:      document.getElementById('avatar-upload')?.files?.[0]   || null
    };
  }

  async _uploadAvatar(file) {
    const ext  = file.type.split('/')[1] || 'jpg';
    const path = `avatars/${this.state.currentUser.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
  }

  async _saveProfileToDatabase(profileData, avatarUrl) {
    const { error } = await supabase.from('profiles').upsert({
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

  _updateLocalUserState(profileData, avatarUrl) {
    const user = { ...this.state.currentUser, ...profileData, avatarUrl };
    this.state.currentUser = user;
    ls.set(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // ─── Gamification ────────────────────────────────────────────────────────────

  setupGamificationListeners() {
    if (this._gamificationListenersReady) return;
    this._gamificationListenersReady = true;
    const g = this.gamification;
    const subs = [
      g.on('levelUp',             ({ level, title })        => showToast(`Level Up! You are now a ${title} (Level ${level})!`, 'success')),
      g.on('streakUpdated',       ({ current, best })       => {
        if (current > 1)                     showToast(`${current} Day Streak!`, 'success');
        if (current === best && current > 3) showToast(`New Best Streak: ${best} Days!`, 'success');
      }),
      g.on('xpGained',            ({ amount, source, skipToast }) => { if (!skipToast) showToast(`+${amount} XP from ${source}`, 'success'); }),
      g.on('karmaGained',         ({ amount, source, skipToast }) => { if (!skipToast) showToast(`+${amount} Karma from ${source}`, 'success'); }),
      g.on('achievementUnlocked', achievement => { showToast(`Achievement: ${achievement.name}`, 'success'); this.showAchievementModal(achievement); }),
      g.on('badgeUnlocked',       badge       => showToast(`New Badge: ${badge.name}`, 'success')),
      g.on('chakraUpdated',       ({ chakra, value }) => { if (value >= 100) showToast(`${chakra} Chakra Mastered!`, 'success'); }),
      g.on('featureUnlocked',     featureId   => showToast(`New Feature Unlocked: ${featureId}`, 'success'))
    ];
    this._gamificationUnsubscribers.push(...subs);
  }

  showAchievementModal(achievement) {
    document.getElementById('achievement-modal')?.remove();

    const modalEl = document.createElement('div');
    modalEl.id    = 'achievement-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-labelledby', 'achievement-modal-title');

    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position:'fixed',top:'0',left:'0',width:'100%',height:'100%',
      background:'rgba(0,0,0,.75)',display:'flex',alignItems:'center',
      justifyContent:'center',zIndex:'10000',opacity:'0',
      transition:'opacity 0.3s',backdropFilter:'blur(4px)'
    });

    const content = document.createElement('div');
    Object.assign(content.style, {
      background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
      padding:'50px 40px',borderRadius:'25px',textAlign:'center',
      maxWidth:'450px',width:'90%',boxShadow:'0 20px 60px rgba(0,0,0,.4)',
      transform:'scale(0.7) translateY(-50px)',
      transition:'all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)'
    });

    const icon = document.createElement('div');
    icon.setAttribute('aria-hidden', 'true');
    icon.style.cssText = 'font-size:5rem;margin-bottom:1.5rem';
    icon.textContent   = achievement.icon || '🏆';

    const h2 = document.createElement('h2');
    h2.id    = 'achievement-modal-title';
    h2.style.cssText = 'color:white;font-size:2rem;font-weight:bold;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.3)';
    h2.textContent   = 'Achievement Unlocked!';

    const h3 = document.createElement('h3');
    h3.style.cssText = 'color:rgba(255,255,255,.95);font-size:1.5rem;font-weight:600;margin-bottom:1rem';
    h3.textContent   = achievement.name || '';

    const desc = document.createElement('p');
    desc.style.cssText = 'color:rgba(255,255,255,.9);font-size:1.1rem;line-height:1.6;margin-bottom:2rem';
    desc.textContent   = achievement.inspirational || '';

    const btn = document.createElement('button');
    btn.type  = 'button';
    btn.style.cssText = 'background:white;color:#667eea;border:none;padding:12px 40px;border-radius:50px;font-size:1.1rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:all 0.3s';
    btn.textContent   = 'Awesome! 🎉';
    btn.addEventListener('mouseover', () => { btn.style.transform = 'scale(1.05)'; });
    btn.addEventListener('mouseout',  () => { btn.style.transform = 'scale(1)'; });

    content.append(icon, h2, h3, desc, btn);
    wrapper.appendChild(content);
    modalEl.appendChild(wrapper);
    document.body.appendChild(modalEl);

    const prev  = document.activeElement;
    const close = () => { modalEl.remove(); prev?.focus(); };

    btn.addEventListener('click', close, { once: true });
    wrapper.addEventListener('click', e => { if (e.target === wrapper) close(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    requestAnimationFrame(() => {
      wrapper.style.opacity   = '1';
      content.style.transform = 'scale(1) translateY(0)';
    });

    setTimeout(close, ANIMATION_DURATIONS.ACHIEVEMENT_MODAL);
    setTimeout(() => btn.focus(), 100);
  }

  // ─── Initialization ──────────────────────────────────────────────────────────

  async init() {
    try {
      // _setAuthenticated() calls loadData() + initializeApp() on successful OAuth/email login.
      // If checkAuth() returns false the user sees the auth screen instead.
      if (!(await this.auth.checkAuth())) {
        this.auth.renderAuthScreen();
      }
    } catch (e) {
      console.error('[App] Initialization failed:', e);
      this.showToast('Failed to initialize app. Please refresh.', 'error');
    }
  }

  async initializeApp() {
    if (this._initialized) return;
    this._initialized = true;

    try {
      if (!this.state?.data) this.state.data = this.state.emptyModel();

      this.gamification = new GamificationEngine(this);
      this.setupGamificationListeners();

      this.dailyCards = new DailyCards(this);
      const boosterPromise = this.dailyCards.initializeBoosters().catch(e => {
        console.warn('[App] DailyCards.initializeBoosters() failed (non-fatal):', e);
      });

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

      // Community — non-critical
      Promise.resolve().then(async () => {
        try {
          if (!CommunityCore.state.initialized) {
            const ok = await CommunityDB.init();
            if (!ok) {
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
        } catch (e) { console.warn('[App] Community init failed (non-fatal):', e); }
      });

      // SW push: open whisper thread when app is already open
      if (navigator.serviceWorker) {
        navigator.serviceWorker.addEventListener('message', async event => {
          if (event.data?.type !== 'OPEN_WHISPER_THREAD' || !event.data.senderId) return;
          const whisper = await _getWhisperModal();
          if (!whisper) return;
          CommunityDB.getProfile(event.data.senderId)
            .then(p => { if (p) whisper.openThread(p.id, p.name, p.emoji, p.avatar_url); })
            .catch(e => console.warn('[App] Whisper deep-link failed:', e));
        });
      }

      // Cold-launch deep-link: ?whisper=<senderId>
      const whisperParam = new URLSearchParams(window.location.search).get('whisper');
      if (whisperParam) {
        const tryOpen = async () => {
          if (!CommunityDB.ready) { setTimeout(tryOpen, 300); return; }
          const whisper = await _getWhisperModal();
          if (!whisper) return;
          CommunityDB.getProfile(whisperParam).then(p => {
            if (p) {
              whisper.openThread(p.id, p.name, p.emoji, p.avatar_url);
              const url = new URL(window.location.href);
              url.searchParams.delete('whisper');
              history.replaceState(null, '', url);
            }
          }).catch(e => console.warn('[App] Whisper cold-launch failed:', e));
        };
        tryOpen();
      }

      await boosterPromise;

    } catch (e) {
      console.error('[App] initializeApp failed:', e);
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

  // ─── Daily reset ─────────────────────────────────────────────────────────────

  checkDailyReset() {
    const today = new Date().toDateString();
    if (ls.get(STORAGE_KEYS.LAST_DAILY_RESET) !== today) {
      this.gamification.resetDailyQuests();
      ls.set(STORAGE_KEYS.LAST_DAILY_RESET, today);
    }
  }

  // ─── Modules ─────────────────────────────────────────────────────────────────

  loadModules() {
    if (this.dashboard && this.state.data) this.dashboard.render();

    if (window.FeaturesManager) {
      try {
        this.features = new window.FeaturesManager(this);
        window.featuresManager = this.features;
      } catch (e) { console.error('[App] FeaturesManager init failed:', e); }
    }
  }

  // ─── Tab management ──────────────────────────────────────────────────────────

  initializeTab(tab) {
    const prev = this.currentTab;
    if (prev === TAB_NAMES.DASHBOARD && tab !== TAB_NAMES.DASHBOARD) {
      this.dashboard?.destroy();
    }
    this.currentTab = tab;

    switch (tab) {
      case TAB_NAMES.DASHBOARD:
        if (!this.dashboard) this.dashboard = new this.deps.DashboardManager(this);
        this.dashboard.render();
        break;
      case TAB_NAMES.CALCULATOR:
        this._loadCalculatorTab();
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
        this._initFeatureTab(tab, prev);
        break;
      default:
        console.warn(`[App] Unknown tab: "${tab}"`);
    }
  }

  _initFeatureTab(tab, prev = null) {
    if (!this.features) {
      console.error('[App] FeaturesManager not available');
      this.showToast('Feature not available', 'error');
      return;
    }
    if (prev && prev !== tab && prev !== TAB_NAMES.DASHBOARD) {
      if (prev !== TAB_NAMES.COMMUNITY_HUB && prev !== TAB_NAMES.CALCULATOR) {
        this.features.destroy(prev);
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
    } catch (e) {
      console.error('[App] Calculator load failed:', e);
      host.textContent = 'Failed to load Self-Analysis Pro. Please try again.';
      this.showToast('Failed to load calculator', 'error');
    }
  }

  // ─── Tab restore ─────────────────────────────────────────────────────────────

  restoreLastTab() {
    const saved = ls.get(STORAGE_KEYS.ACTIVE_TAB);
    // Only restore known tabs; fall back to dashboard
    const tab = (saved && Object.values(TAB_NAMES).includes(saved)) ? saved : TAB_NAMES.DASHBOARD;
    this.nav?.switchTab(tab);
  }

  // ─── Modals ──────────────────────────────────────────────────────────────────

  openSettings() { modal.openSettings(this); }
  openAbout()    { modal.openAbout(this);    }
  openContact()  { modal.openContact(this);  }

  // ─── Utilities ───────────────────────────────────────────────────────────────

  randomFrom(arr) {
    if (!Array.isArray(arr) || !arr.length) return null;
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
    } catch (e) {
      console.error('[App] Logout failed:', e);
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
    this.dashboard    = null;
    this.footerCTA    = null;
    this._initialized               = false;
    this._gamificationListenersReady = false;
  }
}