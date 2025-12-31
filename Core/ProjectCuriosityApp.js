// Core/ProjectCuriosityApp.js
/* global window, document, confirm, requestAnimationFrame */

import { showToast } from './Toast.js';
import * as modal from './Modal.js';
import { GamificationEngine } from '../Features/GamificationEngine.js';
import WellnessAutomationManager from '../Features/WellnessAutomationManager.js';
import { supabase } from './Supabase.js';
import { DarkMode } from '/Core/Utils.js';
import CTA from './CTA.js';

DarkMode.init();          // checkbox & runtime toggles only

export default class ProjectCuriosityApp {
  constructor(deps) {
    this.deps   = deps;
    this.state  = new deps.AppState();
    this.auth   = new deps.AuthManager(this);
    this.nav    = null;
    this.dashboard = null;
    this.gamification = null;
    this.wellnessAutomation = null;

    this.showToast = showToast;
    window.app = this;
  }

  /* ---------- PROFILE ---------- */
  async saveQuickProfile() {
    const name   = document.getElementById('profile-name')?.value.trim();
    const email  = document.getElementById('profile-email')?.value.trim();
    const phone  = document.getElementById('profile-phone')?.value.trim();
    const bday   = document.getElementById('profile-birthday')?.value || null;
    const emoji  = document.getElementById('profile-emoji')?.value;
    const file   = document.getElementById('avatar-upload')?.files[0];

    let avatarUrl = this.state.currentUser.avatarUrl;

    if (file) {
      try {
        const ext  = file.name.split('.').pop();
        const path = `avatars/${this.state.currentUser.id}-${Date.now()}.${ext}`;
        const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
        if (error) throw error;
        avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      } catch (e) {
        console.error('Avatar upload failed:', e);
        return this.showToast('Failed to upload avatar', 'error');
      }
    }

    const payload = { id: this.state.currentUser.id, name, phone, birthday: bday, emoji, avatar_url: avatarUrl, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error('❌ Failed to save profile:', error);
      return this.showToast('Failed to save profile to cloud', 'error');
    }

    const user = { ...this.state.currentUser, name, email, phone, birthday: bday, emoji, avatarUrl };
    this.state.currentUser = user;
    localStorage.setItem('pc_user', JSON.stringify(user));
    this.showToast('Profile updated!', 'success');

    if (this.deps.UserTab) new this.deps.UserTab(this).syncAvatar();
  }

  /* ---------- GAMIFICATION ---------- */
  setupGamificationListeners() {
    const g = this.gamification;
    g.on('levelUp', ({ level, title }) => {
      showToast(`🎉 Level Up! You are now a ${title} (Level ${level})!`, 'success');
      this.playLevelUpAnimation();
    });
    g.on('xpGained', ({ amount, source }) => showToast(`✨ +${amount} XP from ${source}`, 'info'));
    g.on('streakUpdated', ({ current, best }) => {
      if (current > 1) showToast(`🔥 ${current} Day Streak!`, 'success');
      if (current === best && current > 3) showToast(`🏆 New Best Streak: ${best} Days!`, 'success');
    });
    g.on('achievementUnlocked', a => {
      showToast(`🏅 Achievement: ${a.name}`, 'success');
      this.showAchievementModal(a);
    });
    g.on('badgeUnlocked', b => showToast(`🎖️ New Badge: ${b.name}`, 'success'));
    g.on('questCompleted', q => showToast(`✅ Quest Complete: ${q.name}`, 'success'));
    g.on('dailyQuestsComplete', () => showToast('🌟 All Daily Quests Complete! +50 Bonus XP', 'success'));
    g.on('chakraUpdated', ({ chakra, value }) => {
      if (value >= 100) showToast(`💎 ${chakra} Chakra Mastered!`, 'success');
    });
    g.on('inspirationalMessage', m => showToast(`💫 ${m}`, 'info'));
    g.on('featureUnlocked', id => showToast(`🔓 New Feature Unlocked: ${id}`, 'success'));
  }

  playLevelUpAnimation() {
    const el = document.createElement('div');
    el.className = 'level-up-confetti';
    el.innerHTML = '🎉✨🌟⭐💫';
    el.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);font-size:3rem;animation:fadeOut 3s forwards';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  showAchievementModal(a) {
    const exists = document.getElementById('achievement-modal');
    if (exists) exists.remove();

    const modalEl = Object.assign(document.createElement('div'), {
      id: 'achievement-modal',
      innerHTML: `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity .3s;backdrop-filter:blur(4px)">
          <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:50px 40px;border-radius:25px;text-align:center;max-width:450px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.4);transform:scale(.7) translateY(-50px);transition:all .4s cubic-bezier(.68,-.55,.265,1.55)">
            <div style="font-size:5rem;margin-bottom:1.5rem;animation:bounce .6s ease-in-out">${a.icon || '🏆'}</div>
            <h2 style="color:white;font-size:2rem;font-weight:bold;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,.3)">Achievement Unlocked!</h2>
            <h3 style="color:rgba(255,255,255,.95);font-size:1.5rem;font-weight:600;margin-bottom:1rem">${a.name}</h3>
            <p style="color:rgba(255,255,255,.9);font-size:1.1rem;line-height:1.6;margin-bottom:2rem">${a.inspirational || ''}</p>
            <button onclick="this.closest('#achievement-modal').remove()" style="background:white;color:#667eea;border:none;padding:12px 40px;border-radius:50px;font-size:1.1rem;font-weight:bold;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:all .3s" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Awesome! 🎉</button>
          </div>
        </div>`
    });
    document.body.appendChild(modalEl);
    requestAnimationFrame(() => {
      modalEl.firstElementChild.style.opacity = 1;
      modalEl.firstElementChild.firstElementChild.style.transform = 'scale(1) translateY(0)';
    });
    setTimeout(() => modalEl.remove(), 8000);
    modalEl.addEventListener('click', e => { if (e.target === modalEl.firstElementChild) modalEl.remove(); });
  }

  /* ---------- APP BOOTSTRAP ---------- */
  async init() {
    console.log('🧘 Initializing Project Curiosity...');
    if (!await this.auth.checkAuth()) return this.auth.renderAuthScreen();
    await this.state.ready;                       // wait for data
    if (!this.state.data) this.state.data = this.state.emptyModel(); // emergency
    this.initializeApp();
  }

  async initializeApp() {
    console.log('✅ User authenticated, loading data...');
    if (!this.state.data) await this.state.ready;
    if (!this.state.data) this.state.data = this.state.emptyModel();

    this.gamification      = new GamificationEngine(this);
    this.wellnessAutomation = new WellnessAutomationManager(this);
    this.setupGamificationListeners();

    const authScreen = document.getElementById('auth-screen');
    if (authScreen) authScreen.style.display = 'none';
    const app = document.getElementById('main-app');
    if (app) app.classList.remove('hidden');

    this.dashboard = new this.deps.DashboardManager(this);
    this.nav       = new this.deps.NavigationManager(this);
    this.nav.render();

    this.footerCTA = new CTA();
    this.footerCTA.render();

    this.initMatrixRain();
    this.loadModules();
    this.restoreLastTab();
    this.checkDailyReset();
    console.log('🎉 Project Curiosity loaded successfully!');
  }

  /* ---------- MATRIX RAIN ---------- */
  initMatrixRain() {
    document.querySelector('.matrix-rain-container')?.remove();
    if (!document.body.classList.contains('matrix-code')) return;
    
    const chars   = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789';
    const isMob   = window.innerWidth <= 768;
    const baseSp  = isMob ? 0.8 : 3;
    
    // CHECK FOR DARK MODE - use red if dark, green if light
    const isDarkMode = document.body.classList.contains('dark-mode');
    const matrixColor = isDarkMode ? '#ff0041' : '#00ff41';
    const matrixGlow = isDarkMode ? 'rgba(255,0,65,.6)' : 'rgba(0,255,65,.6)';
    
    const container = document.createElement('div');
    container.className = 'matrix-rain-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;overflow:hidden';
    
    const cols = [];
    for (let i = 0; i < 25; i++) {
      const col = document.createElement('div');
      col.className = 'matrix-column'; // Add class for CSS targeting
      col.style.cssText = `font-family:'Share Tech Mono',monospace;font-size:24px;line-height:28px;color:${matrixColor};opacity:.6;white-space:pre;text-shadow:0 0 10px ${matrixColor},0 0 20px ${matrixGlow};position:absolute;left:${4 * i}%;top:0;will-change:transform`;
      col.textContent = Array.from({ length: 100 }, () => chars[Math.random() * chars.length | 0]).join('\n');
      container.appendChild(col);
      cols.push({ el: col, y: -Math.random() * 4000, sp: baseSp + (isMob ? Math.random() * 1.2 : Math.random() * 4) });
    }
    
    document.body.insertBefore(container, document.body.firstChild);
    
    const run = () => {
      if (!document.body.classList.contains('matrix-code')) {
        // CLEANUP: Remove matrix rain if theme switched
        container.remove();
        return;
      }
      cols.forEach(c => {
        c.y += c.sp;
        if (c.y > window.innerHeight + 2000) c.y = -2000;
        c.el.style.transform = `translateY(${c.y}px)`;
      });
      requestAnimationFrame(run);
    };
    run();
    console.log(`✅ Matrix rain initialized (${isDarkMode ? 'RED' : 'GREEN'}) with 25 columns at z-index -1`);
  }

  /* ---------- DAILY RESET ---------- */
  checkDailyReset() {
    const last = localStorage.getItem('lastDailyReset');
    const today = new Date().toDateString();
    if (last !== today) {
      this.gamification.resetDailyQuests();
      localStorage.setItem('lastDailyReset', today);
      console.log('📅 Daily quests reset');
    }
  }

  /* ---------- MODULE LOADER ---------- */
  loadModules() {
    if (this.dashboard && this.state.data) this.dashboard.render();
    if (window.FeaturesManager) {
      try { window.featuresManager = new window.FeaturesManager(this); } catch (e) { console.error('FeaturesManager init failed', e); }
    }
  }

  /* ---------- TAB SWITCH ---------- */
  initializeTab(tab) {
    switch (tab) {
      case 'dashboard':
        if (this.dashboard && this.state.data) this.dashboard.render();
        break;
      case 'calculator':
        (async () => {
          if (window.calculatorChunk === 'loaded') return;
          const host = document.getElementById('calculator-tab');
          if (!host) return;
          host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro…</p></div>';
          const { default: SelfAnalysisLauncher } = await import('/Mini-Apps/SelfAnalysisPro/loader.js');
          new SelfAnalysisLauncher(window.app).render();
          window.calculatorChunk = 'loaded';
        })();
        break;
case 'admin':
      if (this.state.currentUser.isAdmin) {
        (async () => {
          if (window.adminTabLoaded) return;
          const host = document.getElementById('admin-tab');
          if (!host) return;
          host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Admin Panel…</p></div>';
          const { AdminTab } = await import('./AdminTab.js');
          const adminTab = new AdminTab(supabase);
          const content = await adminTab.render();
          host.innerHTML = '';
          host.appendChild(content);
          window.adminTabLoaded = true;
        })();
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

  restoreLastTab() { if (this.nav) this.nav.switchTab('dashboard'); }

  /* ---------- MISC ---------- */
async logout() {
  await this.auth.signOut();
}
  openSettings() { modal.openSettings(this); }
  openAbout()    { modal.openAbout(this); }
  openContact()  { modal.openContact(this); }

  randomFrom(arr) { return Array.isArray(arr) && arr.length ? arr[Math.random() * arr.length | 0] : null; }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.random() * (i + 1) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}