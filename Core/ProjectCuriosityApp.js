// Core/ProjectCuriosityApp.js
/* global window, document, confirm, requestAnimationFrame */

import { showToast } from './Toast.js';
import * as modal from './Modal.js';
import { GamificationEngine } from '../Features/GamificationEngine.js';
import { WellnessAutomationManager } from '../Features/WellnessAutomationManager.js';
import { supabase } from './Supabase.js';
import { DarkMode } from '/Core/Utils.js';
import CTA from './CTA.js';

// Constants
const STORAGE_KEYS = {
  USER: 'pc_user',
  LAST_DAILY_RESET: 'lastDailyReset'
};

const ANIMATION_DURATIONS = {
  LEVEL_UP: 3000,
  ACHIEVEMENT_MODAL: 8000,
  TOAST_FADE: 300
};

const EMOJI = {
  LEVEL_UP: '\u{1F389}\u{2728}\u{1F31F}\u{2B50}\u{1F4AB}',
  ACHIEVEMENT: '\u{1F3C6}',
  FIRE: '\u{1F525}',
  TROPHY: '\u{1F3C6}',
  MEDAL: '\u{1F3C5}',
  BADGE: '\u{1F396}',
  CHECKMARK: '\u{2705}',
  STAR: '\u{1F31F}',
  GEM: '\u{1F48E}',
  SPARKLES: '\u{1F4AB}',
  UNLOCK: '\u{1F513}'
};

DarkMode.init();

export default class ProjectCuriosityApp {
  constructor(deps) {
    this.deps = deps;
    this.state = new deps.AppState();
    this.auth = new deps.AuthManager(this);
    this.nav = null;
    this.dashboard = null;
    this.gamification = null;
    this.wellnessAutomation = null;
    this.footerCTA = null;

    this.showToast = showToast;
    window.app = this;
  }

  /* ---------- PROFILE ---------- */
  /**
   * Saves user profile with avatar upload support
   * @returns {Promise<void>}
   */
  async saveQuickProfile() {
    const profileData = this._getProfileFormData();
    if (!profileData) {
      return this.showToast('Please fill in required fields', 'error');
    }

    let avatarUrl = this.state.currentUser.avatarUrl;

    if (profileData.file) {
      try {
        avatarUrl = await this._uploadAvatar(profileData.file);
      } catch (e) {
        console.error('Avatar upload failed:', e);
        return this.showToast('Failed to upload avatar', 'error');
      }
    }

    try {
      await this._saveProfileToDatabase(profileData, avatarUrl);
      this._updateLocalUserState(profileData, avatarUrl);
      this.showToast('Profile updated!', 'success');
      
      if (this.deps.UserTab) {
        new this.deps.UserTab(this).syncAvatar();
      }
    } catch (e) {
      console.error('Failed to save profile:', e);
      return this.showToast('Failed to save profile to cloud', 'error');
    }
  }

  _getProfileFormData() {
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const phoneEl = document.getElementById('profile-phone');
    const bdayEl = document.getElementById('profile-birthday');
    const emojiEl = document.getElementById('profile-emoji');
    const fileEl = document.getElementById('avatar-upload');

    return {
      name: nameEl?.value.trim(),
      email: emailEl?.value.trim(),
      phone: phoneEl?.value.trim(),
      birthday: bdayEl?.value || null,
      emoji: emojiEl?.value,
      file: fileEl?.files[0]
    };
  }

  async _uploadAvatar(file) {
    const ext = file.name.split('.').pop();
    const path = `avatars/${this.state.currentUser.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    
    if (error) throw error;
    
    return supabase.storage
      .from('avatars')
      .getPublicUrl(path).data.publicUrl;
  }

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

  /* ---------- GAMIFICATION ---------- */
  setupGamificationListeners() {
    const g = this.gamification;
    
    g.on('levelUp', ({ level, title }) => {
      showToast(`${EMOJI.LEVEL_UP.slice(0, 2)} Level Up! You are now a ${title} (Level ${level})!`, 'success');
      this.playLevelUpAnimation();
    });
    
    g.on('xpGained', ({ amount, source }) => 
      showToast(`${EMOJI.SPARKLES} +${amount} XP from ${source}`, 'info')
    );
    
    g.on('streakUpdated', ({ current, best }) => {
      if (current > 1) {
        showToast(`${EMOJI.FIRE} ${current} Day Streak!`, 'success');
      }
      if (current === best && current > 3) {
        showToast(`${EMOJI.TROPHY} New Best Streak: ${best} Days!`, 'success');
      }
    });
    
    g.on('achievementUnlocked', a => {
      showToast(`${EMOJI.MEDAL} Achievement: ${a.name}`, 'success');
      this.showAchievementModal(a);
    });
    
    g.on('badgeUnlocked', b => 
      showToast(`${EMOJI.BADGE} New Badge: ${b.name}`, 'success')
    );
    
    g.on('questCompleted', q => 
      showToast(`${EMOJI.CHECKMARK} Quest Complete: ${q.name}`, 'success')
    );
    
    g.on('dailyQuestsComplete', () => 
      showToast(`${EMOJI.STAR} All Daily Quests Complete! +50 Bonus XP`, 'success')
    );
    
    g.on('chakraUpdated', ({ chakra, value }) => {
      if (value >= 100) {
        showToast(`${EMOJI.GEM} ${chakra} Chakra Mastered!`, 'success');
      }
    });
    
    g.on('inspirationalMessage', m => 
      showToast(`${EMOJI.SPARKLES} ${m}`, 'info')
    );
    
    g.on('featureUnlocked', id => 
      showToast(`${EMOJI.UNLOCK} New Feature Unlocked: ${id}`, 'success')
    );
  }

  playLevelUpAnimation() {
    const el = document.createElement('div');
    el.className = 'level-up-confetti';
    el.textContent = EMOJI.LEVEL_UP;
    el.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);font-size:3rem;animation:fadeOut 3s forwards';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ANIMATION_DURATIONS.LEVEL_UP);
  }

  showAchievementModal(a) {
    const exists = document.getElementById('achievement-modal');
    if (exists) exists.remove();

    const modalEl = document.createElement('div');
    modalEl.id = 'achievement-modal';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity .3s;backdrop-filter:blur(4px)';
    
    const content = document.createElement('div');
    content.style.cssText = 'background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:50px 40px;border-radius:25px;text-align:center;max-width:450px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.4);transform:scale(.7) translateY(-50px);transition:all .4s cubic-bezier(.68,-.55,.265,1.55)';
    
    const icon = document.createElement('div');
    icon.style.cssText = 'font-size:5rem;margin-bottom:1.5rem;animation:bounce .6s ease-in-out';
    icon.textContent = a.icon || EMOJI.ACHIEVEMENT;
    
    const title = document.createElement('h2');
    title.style.cssText = 'color:white;font-size:2rem;font-weight:bold;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.3)';
    title.textContent = 'Achievement Unlocked!';
    
    const name = document.createElement('h3');
    name.style.cssText = 'color:rgba(255,255,255,.95);font-size:1.5rem;font-weight:600;margin-bottom:1rem';
    name.textContent = a.name;
    
    const description = document.createElement('p');
    description.style.cssText = 'color:rgba(255,255,255,.9);font-size:1.1rem;line-height:1.6;margin-bottom:2rem';
    description.textContent = a.inspirational || '';
    
    const button = document.createElement('button');
    button.style.cssText = 'background:white;color:#667eea;border:none;padding:12px 40px;border-radius:50px;font-size:1.1rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:all .3s';
    button.textContent = `Awesome! ${EMOJI.LEVEL_UP.slice(0, 2)}`;
    button.onmouseover = () => button.style.transform = 'scale(1.05)';
    button.onmouseout = () => button.style.transform = 'scale(1)';
    button.onclick = () => modalEl.remove();
    
    content.append(icon, title, name, description, button);
    wrapper.appendChild(content);
    modalEl.appendChild(wrapper);
    document.body.appendChild(modalEl);
    
    requestAnimationFrame(() => {
      wrapper.style.opacity = '1';
      content.style.transform = 'scale(1) translateY(0)';
    });
    
    setTimeout(() => modalEl.remove(), ANIMATION_DURATIONS.ACHIEVEMENT_MODAL);
    wrapper.addEventListener('click', e => {
      if (e.target === wrapper) modalEl.remove();
    });
  }

  /* ---------- APP BOOTSTRAP ---------- */
  async init() {
    try {
      console.log('\u{1F9D8} Initializing Project Curiosity...');
      
      if (!await this.auth.checkAuth()) {
        return this.auth.renderAuthScreen();
      }
      
      await this.state.ready;
      
      if (!this._validateState()) {
        this.state.data = this.state.emptyModel();
      }
      
      await this.initializeApp();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showToast('Failed to initialize app. Please refresh.', 'error');
    }
  }

  _validateState() {
    return this.state && this.state.data;
  }

  async initializeApp() {
    try {
      console.log('\u{2705} User authenticated, loading data...');
      
      if (!this._validateState()) {
        await this.state.ready;
        if (!this._validateState()) {
          this.state.data = this.state.emptyModel();
        }
      }

      this.gamification = new GamificationEngine(this);
      this.wellnessAutomation = new WellnessAutomationManager(this);
      this.setupGamificationListeners();

      this._hideAuthScreen();
      this._showMainApp();

      this.dashboard = new this.deps.DashboardManager(this);
      this.nav = new this.deps.NavigationManager(this);
      this.nav.render();

      this.footerCTA = new CTA();
      this.footerCTA.render();

      this.loadModules();
      this.restoreLastTab();
      this.checkDailyReset();
      
      console.log('\u{1F389} Project Curiosity loaded successfully!');
    } catch (error) {
      console.error('App initialization failed:', error);
      this.showToast('Failed to load app. Please refresh.', 'error');
    }
  }

  _hideAuthScreen() {
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
  }

  _showMainApp() {
    const app = document.getElementById('main-app');
    if (app) app.classList.remove('hidden');
  }

  /* ---------- DAILY RESET ---------- */
  checkDailyReset() {
    const last = localStorage.getItem(STORAGE_KEYS.LAST_DAILY_RESET);
    const today = new Date().toDateString();
    
    if (last !== today) {
      this.gamification.resetDailyQuests();
      localStorage.setItem(STORAGE_KEYS.LAST_DAILY_RESET, today);
      console.log('\u{1F4C5} Daily quests reset');
    }
  }

  /* ---------- MODULE LOADER ---------- */
  loadModules() {
    if (this.dashboard && this.state.data) {
      this.dashboard.render();
    }
    
    if (window.FeaturesManager) {
      try {
        window.featuresManager = new window.FeaturesManager(this);
      } catch (e) {
        console.error('FeaturesManager init failed', e);
      }
    }
  }

  /* ---------- TAB SWITCH ---------- */
/* ---------- TAB SWITCH WITH CLEANUP ---------- */
initializeTab(tab) {
  // Clean up dashboard when leaving it
  if (this.currentTab === 'dashboard' && tab !== 'dashboard' && this.dashboard) {
    this.dashboard.destroy();
  }
  
  // Store current tab
  this.currentTab = tab;
  
  switch (tab) {
    case 'dashboard':
      // Recreate dashboard when returning to it
      if (this.deps.DashboardManager) {
        this.dashboard = new this.deps.DashboardManager(this);
        this.dashboard.render();
      }
      break;

    case 'calculator':
      this._loadCalculatorTab();
      break;

    case 'admin':
      if (this.state.currentUser.isAdmin) {
        this._loadAdminTab();
      }
      break;

    case 'flip-script':
    case 'karma-shop':
    case 'meditations':
    case 'tarot':
    case 'energy':
    case 'happiness':
    case 'gratitude':
    case 'journal':
    case 'shadow-alchemy':
    case 'chatbot':
      window.featuresManager?.init(tab);
      break;

    default:
      console.warn(`Unknown tab: ${tab}`);
  }
}

  async _loadCalculatorTab() {
    if (window.calculatorChunk === 'loaded') return;
    
    const host = document.getElementById('calculator-tab');
    if (!host) return;
    
    try {
      host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';
      const { default: SelfAnalysisLauncher } = await import('/Mini-Apps/SelfAnalysisPro/loader.js');
      new SelfAnalysisLauncher(window.app).render();
      window.calculatorChunk = 'loaded';
    } catch (error) {
      console.error('Failed to load calculator tab:', error);
      host.innerHTML = '<p>Failed to load Self-Analysis Pro. Please try again.</p>';
    }
  }

  async _loadAdminTab() {
    if (window.adminTabLoaded) return;
    
    const host = document.getElementById('admin-tab');
    if (!host) return;
    
    try {
      host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Admin Panel...</p></div>';
      const { AdminTab } = await import('./AdminTab.js');
      const adminTab = new AdminTab(supabase);
      const content = await adminTab.render();
      host.innerHTML = '';
      host.appendChild(content);
      window.adminTabLoaded = true;
    } catch (error) {
      console.error('Failed to load admin tab:', error);
      host.innerHTML = '<p>Failed to load Admin Panel. Please try again.</p>';
    }
  }

  restoreLastTab() {
    if (this.nav) {
      this.nav.switchTab('dashboard');
    }
  }

  /* ---------- MISC ---------- */
  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
      this.showToast('Logout failed. Please try again.', 'error');
    }
  }

  openSettings() {
    modal.openSettings(this);
  }

  openAbout() {
    modal.openAbout(this);
  }

  openContact() {
    modal.openContact(this);
  }

  randomFrom(arr) {
    return Array.isArray(arr) && arr.length ? arr[Math.random() * arr.length | 0] : null;
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.random() * (i + 1) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Cleanup method for destroying the app instance
   */
  destroy() {
    if (this.footerCTA) {
      this.footerCTA = null;
    }
  }
}