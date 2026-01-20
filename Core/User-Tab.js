// User-Tab.js – Updated with collapsed sections & validation fix 2026-01-19
import { supabase } from './Supabase.js';
import * as Templates from './user-tab-templates.js';

export default class UserTab {
  constructor(app) {
    this.app = app;
    this.btn = null;
    this.dropdown = null;
    this.saveProfileLock = false;
  }

  render() {
    if (!document.getElementById('user-tab-styles')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './Assets/CSS/user-tab-styles.css';
      link.id = 'user-tab-styles';
      document.head.appendChild(link);
    }

    const u = this.app.state.currentUser;
    return `
      <div class="user-menu" id="user-menu">
        <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="avatar">
            <span class="disc-avatar-emoji">👤</span>
          </span>
          <span class="disc-dot hidden"></span>
        </button>

        <div class="user-dropdown" id="user-dropdown" role="menu">
          ${Templates.MENU_ITEMS.map(item =>
            item.admin && !u?.isAdmin ? '' :
            `<button class="dropdown-item" data-section="${item.id}">${item.icon} ${item.label}</button>
             <div class="accordion-panel" id="panel-${item.id}"></div>`
          ).join('')}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" data-action="logout">🚪 Logout</button>
        </div>
      </div>`;
  }

  async init() {
    this.dropdown = document.getElementById('user-dropdown');
    if (!this.dropdown) return;

    this.dropdown.addEventListener('click', (e) => {
      const sectionBtn = e.target.closest('.dropdown-item[data-section]');
      const actionBtn = e.target.closest('.dropdown-item[data-action]');
      if (sectionBtn) this.handleSectionClick(sectionBtn.dataset.section);
      else if (actionBtn?.dataset.action === 'logout') this.handleLogout();
    });

    this.btn = document.getElementById('user-menu-btn');
    if (!this.btn) return;

    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.btn.setAttribute('aria-expanded', !expanded);
      this.dropdown.classList.toggle('active');
      
      // COLLAPSE ALL SECTIONS when opening dropdown
      if (!expanded) {
        this.collapseAllSections();
      }
      
      this.syncAvatar();
    });

    document.addEventListener('click', (e) => {
      if (!this.btn.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.btn.setAttribute('aria-expanded', 'false');
        this.dropdown.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.btn.setAttribute('aria-expanded', 'false');
        this.dropdown.classList.remove('active');
        this.closePricingModal();
      }
    });

    this.syncAvatar();
    this.loadActiveTheme();
    this.restoreDarkMode();
    await this.hydrateUserProfile();

    await new Promise(r => requestAnimationFrame(r));
    if (!document.getElementById('pricing-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.pricingModal());
      const overlay  = document.getElementById('pricing-modal-overlay');
      const closeBtn = overlay.querySelector('.pricing-close');
      closeBtn.addEventListener('click', () => this.closePricingModal());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closePricingModal();
      });
    }
  }

  // NEW: Collapse all sections
  collapseAllSections() {
    document.querySelectorAll('.accordion-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.dataset.filled = ''; // Clear filled state
    });
  }

  handleSectionClick(section) {
    if (section === 'billing') {
      this.showPricingModal();
      return;
    }
    const panel = document.getElementById(`panel-${section}`);
    if (!panel) return;

    const isOpen = panel.classList.contains('active');
    document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('active'));

    if (!isOpen) {
      panel.classList.add('active');
      if (!panel.dataset.filled) {
        this.renderSection(section, panel);
        panel.dataset.filled = '1';
      }
    }
  }

  renderSection(section, panel) {
    const u = this.app.state.currentUser;
    const renderers = {
      profile: () => { panel.innerHTML = Templates.profile(u); this.attachProfileHandlers(); },
      skins: () => { panel.innerHTML = Templates.skins(this.app); this.attachSkinsHandlers(); },
      notifications: () => { panel.innerHTML = Templates.notifications(); this.attachNotificationsHandlers(); },
      about: () => { panel.innerHTML = Templates.about(); },
      rules: () => { panel.innerHTML = Templates.rules(); this.attachRulesHandlers(panel); },
      contact: () => { panel.innerHTML = Templates.contact(); },
      export: () => { panel.innerHTML = Templates.exportData(); },
      billing: () => { /* nothing – handled directly */ },
      admin: () => { panel.innerHTML = Templates.admin(); this.loadAdminPanel(); }
    };
    const renderer = renderers[section];
    if (renderer) renderer();
  }

  // ============== PROFILE ==============
  attachProfileHandlers() {
    document.getElementById('profile-emoji')?.addEventListener('change', (e) => {
      const emojiSpan = document.querySelector('.profile-avatar-emoji');
      const img = document.getElementById('profile-avatar-img');
      if (emojiSpan) emojiSpan.textContent = e.target.value;
      if (img) { img.style.display = 'none'; emojiSpan.style.display = 'block'; }
    });

    document.getElementById('avatar-upload')?.addEventListener('change', () => {
      const file = document.getElementById('avatar-upload').files[0];
      if (!file) return;
      if (file.size > 5_242_880) {
        this.app.showToast('Image > 5 MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.getElementById('profile-avatar-img');
        const emoji = document.querySelector('.profile-avatar-emoji');
        if (img) { img.src = e.target.result; img.style.display = 'block'; }
        if (emoji) emoji.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('save-profile-btn')?.addEventListener('click', () => this.saveQuickProfile());
  }

  async saveQuickProfile() {
    if (this.saveProfileLock) return;
    this.saveProfileLock = true;
    const uid = this.app.state?.currentUser?.id;
    if (!uid) { this.saveProfileLock = false; return this.app.showToast('Not logged in', 'error'); }

    const payload = {
      name: document.getElementById('profile-name')?.value.trim() || null,
      email: document.getElementById('profile-email')?.value.trim() || null,
      phone: document.getElementById('profile-phone')?.value.trim() || null,
      birthday: document.getElementById('profile-birthday')?.value || null,
      emoji: document.getElementById('profile-emoji')?.value || '👤',
      avatar_url: document.getElementById('profile-avatar-img')?.src || ''
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase.from('profiles').upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (e) { console.warn('Profile save failed', e); }

    localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.app.state.currentUser, payload);
    this.syncAvatar();
    this.app.showToast(savedOnServer ? '✅ Profile saved' : '⚠️ Saved locally', savedOnServer ? 'success' : 'warning');
    this.saveProfileLock = false;
  }

  async hydrateUserProfile() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return;
    let data = null;
    try {
      const { data: row, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (!error && row) data = row;
    } catch (e) { console.warn('Profile fetch error', e); }
    if (!data) {
      try { data = JSON.parse(localStorage.getItem(`profile_${uid}`)); } catch (e) {}
    }
    if (data) {
      const target = this.app.state.currentUser;
      ['name', 'email', 'phone', 'birthday', 'emoji', 'avatar_url'].forEach(k => {
        if (data[k] !== undefined) target[k] = data[k];
      });
      this.syncAvatar();
    }
  }

  // ============== SKINS  =============
  attachSkinsHandlers() {
    document.getElementById('dark-mode-toggle')?.addEventListener('change', (e) => {
      const on = e.target.checked;
      document.body.classList.toggle('dark-mode', on);
      const link = document.getElementById('dark-mode-css');
      if (link) link.disabled = !on;
      localStorage.setItem('darkMode', on ? 'enabled' : 'disabled');
      if (localStorage.getItem('activeTheme') === 'matrix-code' && window.app?.initMatrixRain) {
        setTimeout(() => window.app.initMatrixRain(), 50);
      }
    });

    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.querySelectorAll('.theme-toggle').forEach(other => { if (other !== e.target) other.checked = false; });
          this.switchTheme(e.target.dataset.theme);
        } else e.target.checked = true;
      });
    });
  }

  switchTheme(name) {
    if (name !== 'default') document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
    document.body.classList.remove('champagne-gold', 'royal-indigo', 'earth-luxury', 'matrix-code');
    document.querySelectorAll('link[data-premium-theme]').forEach(l => l.remove());
    const rain = document.querySelector('.matrix-rain-container');
    if (rain) rain.remove();
    if (window.matrixRain) window.matrixRain.destroy();
    localStorage.setItem('activeTheme', name);
    if (name === 'default') {
      document.getElementById('dark-mode-css')?.removeAttribute('disabled');
      return;
    }
    document.body.classList.add(name);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./Assets/CSS/Skins/${name}.css`;
    link.setAttribute('data-premium-theme', name);
    document.head.appendChild(link);
    if (name === 'matrix-code') {
      if (window.matrixRain) window.matrixRain.init();
      if (window.app?.initMatrixRain) setTimeout(() => window.app.initMatrixRain(), 100);
    }
  }

  loadActiveTheme() {
    try {
      const theme = localStorage.getItem('activeTheme');
      if (theme && theme !== 'default') setTimeout(() => this.switchTheme(theme), 100);
    } catch (e) {
      localStorage.setItem('activeTheme', 'default');
    }
  }

  restoreDarkMode() {
    const dark = localStorage.getItem('darkMode') === 'enabled';
    document.body.classList.toggle('dark-mode', dark);
    const link = document.getElementById('dark-mode-css');
    const toggle = document.getElementById('dark-mode-toggle');
    if (link) link.disabled = !dark;
    if (toggle) toggle.checked = dark;
  }

  // ============== NOTIFICATIONS (WITH VALIDATION FIX) =============
  async attachNotificationsHandlers() {
    await this.hydrateNotificationSettings();
    const master = document.getElementById('master-notifications-toggle');
    const options = document.getElementById('notification-options');
    const startTime = document.getElementById('notification-start-time');
    const endTime = document.getElementById('notification-end-time');
    const frequency = document.getElementById('notification-frequency');
    const warning = document.getElementById('frequency-warning');
    const validationWarning = document.getElementById('time-validation-warning');
    const timezoneDisplay = document.getElementById('timezone-display');
    let saveTimeout;

    // Display detected timezone
    if (timezoneDisplay) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      timezoneDisplay.textContent = tz;
    }

    const checkWindowSize = () => {
      if (!startTime?.value || !endTime?.value || !warning) return;
      const start = startTime.value.split(':').map(Number);
      const end = endTime.value.split(':').map(Number);
      const startMin = start[0] * 60 + start[1];
      const endMin = end[0] * 60 + end[1];
      const diffHours = (endMin - startMin) / 60;
      
      if (diffHours < 6 && frequency.value === 'full') {
        warning.style.display = 'block';
      } else {
        warning.style.display = 'none';
      }
    };

    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveNotificationSettings(), 1500);
    };

    const validateWindow = () => {
      if (!startTime?.value || !endTime?.value) return true;
      const start = startTime.value.split(':').map(Number);
      const end = endTime.value.split(':').map(Number);
      const startMin = start[0] * 60 + start[1];
      const endMin = end[0] * 60 + end[1];
      
      if (startMin >= endMin) {
        if (validationWarning) {
          validationWarning.style.display = 'block';
        }
        this.app.showToast('⚠️ Start time must be before end time', 'warning');
        return false;
      }
      
      if (validationWarning) {
        validationWarning.style.display = 'none';
      }
      return true;
    };

    master?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.enablePushNotifications();
        if (!granted) { 
          e.target.checked = false; 
          return; 
        }
        options.style.opacity = '1';
        options.style.pointerEvents = 'auto';
      } else {
        await this.disablePushNotifications();
        options.style.opacity = '.4';
        options.style.pointerEvents = 'none';
      }
      autoSave();
    });

    startTime?.addEventListener('change', () => {
      if (validateWindow()) {
        checkWindowSize();
        autoSave();
      }
    });

    endTime?.addEventListener('change', () => {
      if (validateWindow()) {
        checkWindowSize();
        autoSave();
      }
    });

    frequency?.addEventListener('change', () => {
      checkWindowSize();
      autoSave();
    });

    document.getElementById('save-notification-settings')?.addEventListener('click', () => {
      if (validateWindow()) {
        clearTimeout(saveTimeout);
        this.saveNotificationSettings();
      }
    });

    checkWindowSize();
  }

  async enablePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      this.app.showToast('❌ Push not supported', 'error');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        this.app.showToast('❌ Permission denied', 'error');
        return false;
      }
      const sw = await navigator.serviceWorker.ready;
      let sub = await sw.pushManager.getSubscription();
      if (!sub) {
        const VAPID = (typeof ENV_VAPID_KEY !== 'undefined' ? ENV_VAPID_KEY : 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc');
        sub = await sw.pushManager.subscribe({ 
          userVisibleOnly: true, 
          applicationServerKey: this.urlBase64ToUint8Array(VAPID) 
        });
        const payload = { 
          ...sub.toJSON(), 
          user_id: this.app.state?.currentUser?.id || null 
        };
        const res = await fetch('/api/save-sub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.app.auth?.session?.access_token && { 
              Authorization: `Bearer ${this.app.auth.session.access_token}` 
            })
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Save failed');
      }
      this.app.showToast('✅ Notifications enabled', 'success');
      return true;
    } catch (err) {
      console.error(err);
      this.app.showToast('❌ Enable failed: ' + err.message, 'error');
      return false;
    }
  }

  async disablePushNotifications() {
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        this.app.showToast('🔕 Notifications disabled', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  }

  urlBase64ToUint8Array(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const b64 = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
  }

  saveNotificationSettings() {
    // Auto-detect timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const settings = {
      enabled: document.getElementById('master-notifications-toggle')?.checked || false,
      window: {
        start: document.getElementById('notification-start-time')?.value || '07:00',
        end: document.getElementById('notification-end-time')?.value || '22:00'
      },
      frequency: document.getElementById('notification-frequency')?.value || 'minimum',
      timezone: timezone
    };

    localStorage.setItem('notification_settings', JSON.stringify(settings));
    
    supabase.from('notification_prefs')
      .upsert({ 
        user_id: this.app.state.currentUser.id, 
        prefs: settings 
      }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) {
          console.error('Save error:', error);
          this.app.showToast('⚠️ Saved locally only', 'warning');
        } else {
          this.app.showToast('✅ Settings saved', 'success');
        }
      });
  }

  async hydrateNotificationSettings() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return;
    
    try {
      const { data, error } = await supabase
        .from('notification_prefs')
        .select('prefs')
        .eq('user_id', uid)
        .single();
      
      if (data?.prefs) {
        localStorage.setItem('notification_settings', JSON.stringify(data.prefs));
        this.restoreNotificationUI(data.prefs);
      } else {
        const local = localStorage.getItem('notification_settings');
        if (local) {
          this.restoreNotificationUI(JSON.parse(local));
        }
      }
    } catch (e) {
      console.warn('Settings sync error:', e);
    }
  }

  restoreNotificationUI(settings) {
    if (!settings) return;
    
    const master = document.getElementById('master-notifications-toggle');
    const options = document.getElementById('notification-options');
    const startTime = document.getElementById('notification-start-time');
    const endTime = document.getElementById('notification-end-time');
    const frequency = document.getElementById('notification-frequency');
    const timezoneDisplay = document.getElementById('timezone-display');

    if (master) {
      master.checked = settings.enabled || false;
      if (options) {
        options.style.opacity = settings.enabled ? '1' : '.4';
        options.style.pointerEvents = settings.enabled ? 'auto' : 'none';
      }
    }

    if (startTime && settings.window?.start) {
      startTime.value = settings.window.start;
    }

    if (endTime && settings.window?.end) {
      endTime.value = settings.window.end;
    }

    if (frequency && settings.frequency) {
      frequency.value = settings.frequency;
    }

    if (timezoneDisplay) {
      timezoneDisplay.textContent = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  // ============== RULES =============
  attachRulesHandlers(panel) {
    panel.querySelectorAll('.rules-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = panel.querySelector('#' + btn.dataset.target);
        const isOpen = btn.classList.contains('active');
        btn.classList.toggle('active', !isOpen);
        target.classList.toggle('show', !isOpen);
      });
    });
    panel.querySelectorAll('.rules-category-title').forEach(title => {
      title.addEventListener('click', () => title.parentElement.classList.toggle('open'));
    });
  }

  // ============== ADMIN =============
  async loadAdminPanel() {
    const mount = document.getElementById('admin-tab-mount');
    if (!mount) return;
    
    mount.innerHTML = '<div style="text-align:center;padding:20px;">Loading...</div>';
    
    try {
      const adminModule = await import('./Admin-Tab.js');
      const { supabase } = await import('./Supabase.js');
      
      const AdminTab = adminModule.AdminTab || adminModule.default;
      const adminTab = new AdminTab(supabase);
      const content = await adminTab.render();
      
      mount.innerHTML = '';
      if (typeof content === 'string') {
        mount.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        mount.appendChild(content);
      } else {
        mount.innerHTML = '<div style="color:#ff4757;padding:10px;">Invalid content returned</div>';
      }
    } catch (err) {
      console.error('Admin panel error:', err);
      mount.innerHTML = `<div style="color:#ff4757;padding:10px;">Failed to load: ${err.message}</div>`;
    }
  }

  // ============== PRICING MODAL =============
showPricingModal() {
  const overlay = document.getElementById('pricing-modal-overlay');
  if (!overlay) return;
  
  const themeClass = ['champagne-gold', 'royal-indigo', 'earth-luxury', 'matrix-code']
    .find(cls => document.body.classList.contains(cls));
  
  if (themeClass) {
    overlay.classList.add(themeClass);
  }
  
  if (document.body.classList.contains('dark-mode')) {
    overlay.classList.add('dark-mode');
  }
  
  overlay.classList.add('show');
  document.body.classList.add('blur-behind');
  this.attachPricingButtons(overlay);
  
  if (window.innerWidth <= 768) {
    const container = document.getElementById('pricing-cards-container');
    const dots = document.querySelectorAll('.pricing-dot');
    const cards = container.querySelectorAll('.pricing-card');
    
    container.scrollTo({ left: 0, behavior: 'smooth' });
    
    container.addEventListener('scroll', () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 20;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    });
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 20;
        container.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
      });
    });
  }
}

  closePricingModal() {
    const overlay = document.getElementById('pricing-modal-overlay');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('blur-behind');
  }

  attachPricingButtons(overlay) {
    overlay.querySelectorAll('.pricing-btn').forEach(btn =>
      btn.addEventListener('click', (e) => {
        const plan = e.currentTarget.dataset.plan;
        this.app.startCheckout(plan);
        this.closePricingModal();
      }, { once: true })
    );
  }

  // ============== AVATAR =============
  syncAvatar() {
    const u = this.app.state.currentUser || {};
    const avImg = this.btn?.querySelector('.disc-avatar-img');
    const avEmoji = this.btn?.querySelector('.disc-avatar-emoji');

    if (!avImg || !avEmoji) return;

    if (u.avatar_url && u.avatar_url.trim()) {
      avImg.src = u.avatar_url;
      avImg.classList.remove('hidden');
      avEmoji.classList.add('hidden');
      this.btn.classList.add('avatar-mode');
    } else {
      avEmoji.textContent = u.emoji || '👤';
      avImg.classList.add('hidden');
      avEmoji.classList.remove('hidden');
      this.btn.classList.remove('avatar-mode');
    }
  }

  // ============== LOGOUT =============
  async handleLogout() {
    try {
      if (this.btn) this.btn.setAttribute('aria-expanded', 'false');
      if (this.dropdown) this.dropdown.classList.remove('active');

      if (this.app && typeof this.app.logout === 'function') {
        await this.app.logout();
      } else {
        console.error('app.logout() not available');
        this.app?.showToast('❌ Logout failed', 'error');
      }
    } catch (err) {
      console.error('Logout error:', err);
      this.app?.showToast('❌ Logout error', 'error');
    }
  }
}