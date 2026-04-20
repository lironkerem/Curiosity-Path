/**
 * User-Tab.js – Optimized & Consolidated 2026-01-26
 * Manages user menu, profile, settings, notifications, and themes
 */
import { renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';
import { supabase } from './Supabase.js';
import * as Templates from './user-tab-templates.js';

export default class UserTab {
  static CONFIG = {
    MAX_AVATAR_SIZE: 5_242_880,
    AUTOSAVE_DELAY: 1500,
    THEME_INIT_DELAY: 100,
    MIN_NOTIFICATION_WINDOW: 6,
  };

  static THEME_CLASSES = new Set([
    'champagne-gold',
    'royal-indigo',
    'earth-luxury',
    'matrix-code'
  ]);

  constructor(app) {
    this.app = app;
    this.btn = null;
    this.dropdown = null;
    this.saveProfileLock = false;
  }

  get currentUser() {
    return this.app.state.currentUser;
  }

  // ============== RENDERING ==============

  render() {
    return `
      <div class="user-menu" id="user-menu">
        <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="avatar" width="32" height="32" decoding="async">
            <span class="disc-avatar-emoji"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          </span>
          <span class="disc-dot hidden"></span>
        </button>

        <div class="user-dropdown" id="user-dropdown" role="menu">
          ${typeof window !== 'undefined' && window._pwaInstallPrompt ? `
          <button class="btn-install-pwa" id="pwa-install-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Install App
          </button>` : ''}
          ${Templates.MENU_ITEMS.map(item =>
            `<button class="dropdown-item" data-section="${item.id}">${item.icon} ${item.label}</button>
             <div class="accordion-panel" id="panel-${item.id}"></div>`
          ).join('')}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" data-action="logout"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2V4z"/></svg> Logout</button>
        </div>
      </div>`;
  }

  // ============== INITIALIZATION ==============

  async init() {
    this.dropdown = document.getElementById('user-dropdown');
    this.btn = document.getElementById('user-menu-btn');

    if (!this.dropdown || !this.btn) return;

    this.attachMenuHandlers();
    this.attachButtonHandlers();
    this.attachGlobalHandlers();

    this.syncAvatar();
    this.loadActiveTheme();
    this.restoreDarkMode();
    await this.hydrateUserProfile();
    await this.initPricingModal();

    window.addEventListener('statusChanged', (e) => {
      const { status } = e.detail || {};
      if (!status) return;
      if (this.currentUser) {
        this.currentUser.community_status = status;
        this.currentUser.status = status;
      }
      this.updateStatusRing(status);
      document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
      });
    });
  }

  attachMenuHandlers() {
    this.dropdown.addEventListener('click', (e) => {
      const sectionBtn = e.target.closest('.dropdown-item[data-section]');
      const actionBtn  = e.target.closest('.dropdown-item[data-action]');
      const installBtn = e.target.closest('#pwa-install-menu-btn');

      if (installBtn)                              this.handlePwaInstall();
      else if (sectionBtn)                         this.handleSectionClick(sectionBtn.dataset.section);
      else if (actionBtn?.dataset.action === 'logout') this.handleLogout();
    });
  }

  async handlePwaInstall() {
    if (!window._pwaInstallPrompt) return;
    try {
      window._pwaInstallPrompt.prompt();
      const { outcome } = await window._pwaInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        window._pwaInstallPrompt = null;
        document.getElementById('pwa-install-menu-btn')?.remove();
        this.app?.showToast('App installed successfully! 🎉', 'success');
      }
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    }
    this.toggleDropdown(false);
  }

  attachButtonHandlers() {
    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.toggleDropdown(!expanded);
      if (!expanded) this.collapseAllSections();
      this.syncAvatar();
    });
  }

  attachGlobalHandlers() {
    document.addEventListener('click', (e) => {
      if (!this.btn.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.toggleDropdown(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleDropdown(false);
        this.closePricingModal();
      }
    });
  }

  toggleDropdown(open) {
    this.btn.setAttribute('aria-expanded', open);
    this.dropdown.classList.toggle('active', open);
  }

  async initPricingModal() {
    await new Promise(r => requestAnimationFrame(r));

    if (!document.getElementById('pricing-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.pricingModal());
      const overlay  = document.getElementById('pricing-modal-overlay');
      const closeBtn = overlay.querySelector('.pricing-close');
      closeBtn.addEventListener('click', () => this.closePricingModal());
      overlay.addEventListener('click', (e) => { if (e.target === overlay) this.closePricingModal(); });
    }
  }

  // ============== SECTION MANAGEMENT ==============

  collapseAllSections() {
    document.querySelectorAll('.accordion-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.dataset.filled = '';
    });
  }

  handleSectionClick(section) {
    if (section === 'billing') { this.showPricingModal(); return; }

    const panel = document.getElementById(`panel-${section}`);
    if (!panel) return;

    const isOpen = panel.classList.contains('active');
    this.collapseAllSections();

    if (!isOpen) {
      panel.classList.add('active');
      if (!panel.dataset.filled) {
        this.renderSection(section, panel);
        panel.dataset.filled = '1';
      }
    }
  }

  renderSection(section, panel) {
    const renderers = {
      profile:       () => { panel.innerHTML = Templates.profile(this.currentUser); this.attachProfileHandlers(); },
      skins:         () => { panel.innerHTML = Templates.skins(this.app); this.attachSkinsHandlers(); },
      notifications: () => { panel.innerHTML = Templates.notifications(); this.attachNotificationsHandlers(); },
      about:         () => { panel.innerHTML = Templates.about(); },
      rules:         () => { panel.innerHTML = Templates.rules(); this.attachRulesHandlers(panel); },
      contact:       () => { panel.innerHTML = Templates.contact(); },
      export:        () => { panel.innerHTML = Templates.exportData(); }
    };
    renderers[section]?.();
  }

  // ============== PROFILE MANAGEMENT ==============

  attachProfileHandlers() {
    const modal = document.getElementById('icon-picker-modal');
    document.getElementById('open-icon-picker-btn')?.addEventListener('click', () => { if (modal) modal.style.display = 'flex'; });
    document.getElementById('close-icon-picker-btn')?.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
    modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    document.querySelectorAll('.avatar-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key        = btn.dataset.value;
        const hiddenInput = document.getElementById('profile-emoji');
        const emojiSpan  = document.querySelector('.profile-avatar-emoji');
        const img        = document.getElementById('profile-avatar-img');

        if (hiddenInput) hiddenInput.value = key;
        if (emojiSpan)   emojiSpan.innerHTML = renderAvatarIcon(key);
        if (img) { img.style.display = 'none'; emojiSpan.style.display = 'block'; }

        document.querySelectorAll('.avatar-icon-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (modal) modal.style.display = 'none';
      });
    });

    this.attachListener('avatar-upload', 'change', () => this.handleAvatarUpload());
    this.attachListener('save-profile-btn', 'click', () => this.saveQuickProfile());
    this.attachListener('delete-account-btn', 'click', () => this.showDeleteAccountModal());

    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setStatus(btn.dataset.status, btn.dataset.color, btn.dataset.label));
    });

    this.updateStatusRing(this.currentUser?.community_status || 'offline');
  }

  async handleAvatarUpload() {
    const file = document.getElementById('avatar-upload').files[0];
    if (!file) return;

    if (file.size > UserTab.CONFIG.MAX_AVATAR_SIZE) {
      this.app.showToast('Image > 5 MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img   = document.getElementById('profile-avatar-img');
      const emoji = document.querySelector('.profile-avatar-emoji');
      if (img)   { img.src = e.target.result; img.style.display = 'block'; }
      if (emoji) emoji.style.display = 'none';
    };
    reader.readAsDataURL(file);

    this.app.showToast('Uploading photo...', 'info');

    try {
      const uid = this.currentUser?.id;
      if (!uid) { this.app.showToast('Not logged in', 'error'); return; }

      const ext  = file.name.split('.').pop().toLowerCase() || 'jpg';
      const path = `avatars/${uid}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('community-avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (upErr) { this.app.showToast('Upload failed - please try again', 'error'); return; }

      const { data } = supabase.storage.from('community-avatars').getPublicUrl(path);
      const publicUrl = data?.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : null;
      if (!publicUrl) { this.app.showToast('Upload failed - please try again', 'error'); return; }

      const img = document.getElementById('profile-avatar-img');
      if (img) img.src = publicUrl;

      const { error: saveErr } = await supabase
        .from('profiles')
        .upsert({ id: uid, avatar_url: publicUrl }, { onConflict: 'id' });

      if (saveErr) { this.app.showToast('Photo uploaded but profile save failed', 'warning'); return; }

      if (this.currentUser) this.currentUser.avatar_url = publicUrl;
      localStorage.setItem(`profile_${uid}`, JSON.stringify({
        ...JSON.parse(localStorage.getItem(`profile_${uid}`) || '{}'),
        avatar_url: publicUrl
      }));
      this.syncAvatar();
      this.app.showToast('Profile photo updated', 'success');

    } catch (err) {
      console.error('handleAvatarUpload error:', err);
      this.app.showToast('Upload failed - please try again', 'error');
    }
  }

  async saveQuickProfile() {
    if (this.saveProfileLock) return;
    this.saveProfileLock = true;

    const uid = this.currentUser?.id;
    if (!uid) { this.saveProfileLock = false; return this.app.showToast('Not logged in', 'error'); }

    const payload = {
      name:     document.getElementById('profile-name')?.value.trim()     || null,
      email:    document.getElementById('profile-email')?.value.trim()    || null,
      phone:    document.getElementById('profile-phone')?.value.trim()    || null,
      birthday: document.getElementById('profile-birthday')?.value        || null,
      emoji:    document.getElementById('profile-emoji')?.value           || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      country:  document.getElementById('profile-country')?.value.trim()  || null,
      community_status: this.currentUser?.community_status || 'online',
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase.from('profiles').upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (e) { console.warn('Profile save failed', e); }

    localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.currentUser, payload);

    this.syncAvatar();
    window.dispatchEvent(new CustomEvent('avatarChanged', {
      detail: { userId: uid, emoji: payload.emoji, avatarUrl: payload.avatar_url || this.currentUser?.avatar_url || null }
    }));
    this.app.showToast(
      savedOnServer
        ? '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Profile saved'
        : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Saved locally',
      savedOnServer ? 'success' : 'warning'
    );

    this.saveProfileLock = false;
  }

  async hydrateUserProfile() {
    const uid = this.currentUser?.id;
    if (!uid) return;

    let data = null;
    try {
      const { data: row, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (!error && row) data = row;
    } catch (e) { console.warn('Profile fetch error', e); }

    if (!data) {
      try { data = JSON.parse(localStorage.getItem(`profile_${uid}`)); }
      catch (e) { console.warn('localStorage parse error', e); }
    }

    if (data) {
      ['name','email','phone','birthday','emoji','avatar_url','country','community_status'].forEach(f => {
        if (data[f] !== undefined) this.currentUser[f] = data[f];
      });
      this.syncAvatar();
      this.updateStatusRing(this.currentUser.community_status || 'offline');
    }
  }

  // ============== SKINS & THEMES ==============

  attachSkinsHandlers() {
    this.attachListener('dark-mode-toggle', 'change', (e) => this.handleDarkModeToggle(e.target.checked));

    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          document.querySelectorAll('.theme-toggle').forEach(o => { if (o !== e.target) o.checked = false; });
          this.switchTheme(e.target.dataset.theme);
        } else {
          e.target.checked = true;
        }
      });
    });
  }

  handleDarkModeToggle(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

    // Only touch dark-mode skin when no premium skin is active
    const premiumActive = document.getElementById('dynamic-skin-style');
    if (!premiumActive) {
      if (enabled) window.loadSkin('dark-mode');
      else         window.removeSkin();
    }

    if (localStorage.getItem('activeTheme') === 'matrix-code' && window.app?.initMatrixRain) {
      setTimeout(() => window.app.initMatrixRain(), 50);
    }
  }

  switchTheme(name) {
    // Remove any active skin (inline style tag)
    window.removeSkin();

    // Remove all theme body classes
    document.body.classList.remove(...UserTab.THEME_CLASSES, 'dark-mode');

    // Clean up matrix rain
    document.querySelector('.matrix-rain-container')?.remove();
    if (window.matrixRain) window.matrixRain.destroy();

    localStorage.setItem('activeTheme', name);

    if (name === 'default') {
      // Restore dark mode if it was enabled
      if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        window.loadSkin('dark-mode');
      }
      return;
    }

    document.body.classList.add(name);
    window.loadSkin(name);

    if (name === 'matrix-code') {
      if (window.matrixRain) window.matrixRain.init();
      if (window.app?.initMatrixRain) {
        setTimeout(() => window.app.initMatrixRain(), UserTab.CONFIG.THEME_INIT_DELAY);
      }
    }
  }

  loadActiveTheme() {
    try {
      const theme = localStorage.getItem('activeTheme');
      if (theme && theme !== 'default') {
        setTimeout(() => this.switchTheme(theme), UserTab.CONFIG.THEME_INIT_DELAY);
      }
    } catch (e) {
      localStorage.setItem('activeTheme', 'default');
    }
  }

  restoreDarkMode() {
    const dark  = localStorage.getItem('darkMode') === 'enabled';
    const theme = localStorage.getItem('activeTheme') || 'default';

    document.body.classList.toggle('dark-mode', dark);

    // Only inject dark-mode skin when no premium theme is active
    if (theme === 'default' && dark) {
      window.loadSkin('dark-mode');
    }

    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.checked = dark;
  }

  // ============== NOTIFICATIONS ==============

  async attachNotificationsHandlers() {
    await this.hydrateNotificationSettings();

    const master    = document.getElementById('master-notifications-toggle');
    const options   = document.getElementById('notification-options');
    const startTime = document.getElementById('notification-start-time');
    const endTime   = document.getElementById('notification-end-time');
    const frequency = document.getElementById('notification-frequency');
    const timezoneDisplay = document.getElementById('timezone-display');

    let saveTimeout;
    if (timezoneDisplay) timezoneDisplay.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const autoSave = () => { clearTimeout(saveTimeout); saveTimeout = setTimeout(() => this.saveNotificationSettings(), UserTab.CONFIG.AUTOSAVE_DELAY); };

    const checkWindowSize = () => {
      if (!startTime?.value || !endTime?.value) return;
      const diffHours = this.calculateTimeWindowHours(startTime.value, endTime.value);
      const warning   = document.getElementById('frequency-warning');
      if (warning) warning.style.display = (diffHours < UserTab.CONFIG.MIN_NOTIFICATION_WINDOW && frequency.value === 'full') ? 'block' : 'none';
    };

    master?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.enablePushNotifications();
        if (!granted) { e.target.checked = false; return; }
        this.toggleNotificationOptions(options, true);
      } else {
        await this.disablePushNotifications();
        this.toggleNotificationOptions(options, false);
      }
      autoSave();
    });

    startTime?.addEventListener('change', () => { if (this.validateTimeWindow(startTime, endTime)) { checkWindowSize(); autoSave(); } });
    endTime?.addEventListener('change',   () => { if (this.validateTimeWindow(startTime, endTime)) { checkWindowSize(); autoSave(); } });

    frequency?.addEventListener('change', () => {
      checkWindowSize();
      autoSave();
      const explanationEl = document.getElementById('frequency-explanation');
      if (explanationEl) explanationEl.innerHTML = this.renderFrequencyExplanationHTML(frequency.value);
    });

    this.attachListener('save-notification-settings', 'click', () => {
      if (this.validateTimeWindow(startTime, endTime)) { clearTimeout(saveTimeout); this.saveNotificationSettings(); }
    });

    checkWindowSize();
  }

  calculateTimeWindowHours(start, end) {
    const toMinutes = t => { const [h,m] = t.split(':').map(Number); return h*60+m; };
    return (toMinutes(end) - toMinutes(start)) / 60;
  }

  validateTimeWindow(startTime, endTime) {
    if (!startTime?.value || !endTime?.value) return true;
    const isValid = this.timeToMinutes(startTime.value) < this.timeToMinutes(endTime.value);
    const warning = document.getElementById('time-validation-warning');
    if (warning) warning.style.display = isValid ? 'none' : 'block';
    if (!isValid) this.app.showToast('Start time must be before end time', 'warning');
    return isValid;
  }

  timeToMinutes(time) {
    const [h,m] = time.split(':').map(Number);
    return h*60+m;
  }

  toggleNotificationOptions(options, enabled) {
    if (!options) return;
    options.style.opacity       = enabled ? '1'    : '.4';
    options.style.pointerEvents = enabled ? 'auto' : 'none';
  }

  async enablePushNotifications() {
    if (!this.currentUser?.id) { this.app.showToast('Please log in to enable notifications', 'error'); return false; }
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) { this.app.showToast('Push not supported', 'error'); return false; }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { this.app.showToast('Permission denied', 'error'); return false; }

      const sw  = await navigator.serviceWorker.ready;
      let sub   = await sw.pushManager.getSubscription();

      if (!sub) {
        const VAPID = typeof ENV_VAPID_KEY !== 'undefined'
          ? ENV_VAPID_KEY
          : 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc';
        sub = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.urlBase64ToUint8Array(VAPID) });
      }

      const res = await fetch('/api/save-sub', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.app.auth?.session?.access_token && { Authorization: `Bearer ${this.app.auth.session.access_token}` })
        },
        body: JSON.stringify({ ...sub.toJSON(), user_id: this.currentUser.id })
      });

      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || `Save failed (${res.status})`); }

      this.app.showToast('Notifications enabled', 'success');
      return true;

    } catch (err) {
      console.error('enablePushNotifications:', err);
      this.app.showToast('Enable failed: ' + err.message, 'error');
      return false;
    }
  }

  async disablePushNotifications() {
    this.app.showToast('Notifications disabled', 'success');
  }

  urlBase64ToUint8Array(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const b64 = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
  }

  saveNotificationSettings() {
    const settings = {
      enabled:   document.getElementById('master-notifications-toggle')?.checked || false,
      window: {
        start: document.getElementById('notification-start-time')?.value || '07:00',
        end:   document.getElementById('notification-end-time')?.value   || '22:00'
      },
      frequency: document.getElementById('notification-frequency')?.value || 'minimum',
      timezone:  Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    localStorage.setItem('notification_settings', JSON.stringify(settings));

    supabase.from('notification_prefs')
      .upsert({ user_id: this.currentUser.id, prefs: settings }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) { console.error('Save error:', error); this.app.showToast('Saved locally only', 'warning'); }
        else        this.app.showToast('Settings saved', 'success');
      });
  }

  async hydrateNotificationSettings() {
    const uid = this.currentUser?.id;
    if (!uid) return;
    try {
      const { data } = await supabase.from('notification_prefs').select('prefs').eq('user_id', uid).single();
      if (data?.prefs) { localStorage.setItem('notification_settings', JSON.stringify(data.prefs)); this.restoreNotificationUI(data.prefs); }
      else { const local = localStorage.getItem('notification_settings'); if (local) this.restoreNotificationUI(JSON.parse(local)); }
    } catch (e) { console.warn('Settings sync error:', e); }
  }

  restoreNotificationUI(settings) {
    if (!settings) return;
    const master    = document.getElementById('master-notifications-toggle');
    const options   = document.getElementById('notification-options');
    const startTime = document.getElementById('notification-start-time');
    const endTime   = document.getElementById('notification-end-time');
    const frequency = document.getElementById('notification-frequency');
    const tzDisplay = document.getElementById('timezone-display');

    if (master)    { master.checked = settings.enabled || false; this.toggleNotificationOptions(options, settings.enabled); }
    if (startTime && settings.window?.start) startTime.value = settings.window.start;
    if (endTime   && settings.window?.end)   endTime.value   = settings.window.end;
    if (frequency && settings.frequency)     frequency.value = settings.frequency;
    if (tzDisplay) tzDisplay.textContent = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // ============== RULES ==============

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

  // ============== PRICING MODAL ==============

  showPricingModal() {
    const overlay = document.getElementById('pricing-modal-overlay');
    if (!overlay) return;

    const themeClass = [...UserTab.THEME_CLASSES].find(cls => document.body.classList.contains(cls));
    if (themeClass) overlay.classList.add(themeClass);
    if (document.body.classList.contains('dark-mode')) overlay.classList.add('dark-mode');

    overlay.classList.add('show');
    document.body.classList.add('blur-behind');
    this.attachPricingButtons(overlay);

    if (window.innerWidth <= 768) this.initMobileCarousel();
  }

  initMobileCarousel() {
    const container = document.getElementById('pricing-cards-container');
    const dots  = document.querySelectorAll('.pricing-dot');
    const cards = container.querySelectorAll('.pricing-card');
    container.scrollTo({ left: 0, behavior: 'smooth' });

    let _cachedCardWidth = null;
    const getCardWidth = () => { if (!_cachedCardWidth) _cachedCardWidth = cards[0].offsetWidth + 20; return _cachedCardWidth; };

    container.addEventListener('scroll', () => {
      const activeIndex = Math.round(container.scrollLeft / getCardWidth());
      dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
    }, { passive: true });

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      container.scrollTo({ left: getCardWidth() * i, behavior: 'smooth' });
    }));
  }

  closePricingModal() {
    document.getElementById('pricing-modal-overlay')?.classList.remove('show');
    document.body.classList.remove('blur-behind');
  }

  attachPricingButtons(overlay) {
    overlay.querySelectorAll('.pricing-btn').forEach(btn =>
      btn.addEventListener('click', (e) => {
        this.app.startCheckout(e.currentTarget.dataset.plan);
        this.closePricingModal();
      }, { once: true })
    );
  }

  // ============== STATUS ==============

  static STATUS_COLORS = {
    online:    '#6b9b37',
    available: '#6b9b37',
    away:      '#e53e3e',
    guiding:   '#e53e3e',
    silent:    '#7c3aed',
    deep:      '#1e40af',
    offline:   '#9ca3af',
  };

  updateStatusRing(status = 'offline') {
    const color = UserTab.STATUS_COLORS[status] || UserTab.STATUS_COLORS.offline;
    if (this.btn) {
      this.btn.style.setProperty('--status-ring-color', color);
      this.btn.classList.add('has-status-ring');
    }
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
  }

  async setStatus(status, color, label) {
    if (this.currentUser) {
      this.currentUser.community_status = status;
      this.currentUser.status = status;
    }
    this.updateStatusRing(status);
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });

    const uid = this.currentUser?.id;
    if (uid && window.ActiveMembers) window.ActiveMembers.updateMemberStatus(uid, status);

    const STATUS_ACTIVITIES = {
      online:    '✨ Available',
      available: '✨ Available',
      away:      '🌿 Away',
      silent:    '🤫 In Silence',
      deep:      '🧘 Deep Practice',
      offline:   '💤 Offline',
    };

    try {
      if (!uid) throw new Error('Not logged in');
      const writes = [supabase.from('profiles').update({ community_status: status }).eq('id', uid)];
      if (window.CommunityDB?.ready) {
        writes.push(window.CommunityDB.setPresence(status, STATUS_ACTIVITIES[status] || '✨ Available', window.Core?.state?.currentRoom || null));
      }
      const results   = await Promise.all(writes);
      const profileErr = results[0]?.error;
      if (profileErr) throw profileErr;
      this.app.showToast(`Status set to ${label}`, 'success');
    } catch (err) {
      console.error('setStatus error:', err);
      this.app.showToast('Could not update status', 'error');
    }

    window.dispatchEvent(new CustomEvent('statusChanged', { detail: { status } }));
  }

  // ============== AVATAR SYNC ==============

  syncAvatar() {
    const { avatar_url, emoji = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' } = this.currentUser || {};
    const avImg   = this.btn?.querySelector('.disc-avatar-img');
    const avEmoji = this.btn?.querySelector('.disc-avatar-emoji');

    if (!avImg || !avEmoji) return;

    const hasAvatar = avatar_url?.trim();
    avImg.classList.toggle('hidden', !hasAvatar);
    avEmoji.classList.toggle('hidden', !!hasAvatar);
    this.btn.classList.toggle('avatar-mode', !!hasAvatar);

    if (hasAvatar) avImg.src = avatar_url;
    else           avEmoji.innerHTML = renderAvatarIcon(emoji);
  }

  // ============== DELETE ACCOUNT ==============

  showDeleteAccountModal() {
    if (!document.getElementById('delete-account-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.deleteAccountModal());
    }

    const overlay    = document.getElementById('delete-account-modal-overlay');
    const input      = document.getElementById('delete-account-confirm-input');
    const confirmBtn = document.getElementById('delete-account-confirm-btn');
    const cancelBtn  = document.getElementById('delete-account-cancel-btn');

    input.value = '';
    confirmBtn.disabled = true;
    overlay.classList.add('show');

    const onInput = () => { confirmBtn.disabled = input.value.trim() !== 'DELETE'; };
    input.addEventListener('input', onInput);

    const close = () => { overlay.classList.remove('show'); input.removeEventListener('input', onInput); };
    cancelBtn.addEventListener('click', close, { once: true });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); }, { once: true });
    confirmBtn.addEventListener('click', async () => {
      if (input.value.trim() !== 'DELETE') return;
      close();
      await this.handleDeleteAccount();
    }, { once: true });

    setTimeout(() => input.focus(), 100);
  }

  async handleDeleteAccount() {
    const uid = this.currentUser?.id;
    if (!uid) return;

    this.toggleDropdown(false);
    this.app.showToast('Deleting your account…', 'info');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No active session');

      const res = await fetch(`${supabase.supabaseUrl}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': supabase.supabaseKey,
        },
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || 'Deletion failed');

      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut();

      this.app.showToast('Account deleted. Goodbye 🙏', 'success');
      setTimeout(() => { typeof this.app.logout === 'function' ? this.app.logout() : window.location.reload(); }, 1500);

    } catch (err) {
      console.error('handleDeleteAccount error:', err);
      this.app.showToast(`Deletion failed: ${err.message}`, 'error');
    }
  }

  // ============== LOGOUT ==============

  async handleLogout() {
    try {
      this.toggleDropdown(false);
      if (this.app && typeof this.app.logout === 'function') {
        await this.app.logout();
      } else {
        console.error('app.logout() not available');
        this.app?.showToast('Logout failed', 'error');
      }
    } catch (err) {
      console.error('Logout error:', err);
      this.app?.showToast('Logout error', 'error');
    }
  }

  // ============== UTILITY ==============

  renderFrequencyExplanationHTML(frequency) {
    const sun     = `<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>`;
    const moon    = `<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const circle  = `<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const reflect = `<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg>`;
    if (frequency === 'minimum') {
      return `<div>${sun} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${moon} <strong>Integration:</strong> Integrating the Day</div>`;
    }
    return `<div>${sun} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${circle} <strong>Recharge:</strong> Quick reset and Mindfulness</div><div>${reflect} <strong>Reflect:</strong> Gratitude and Inspiration</div><div>${moon} <strong>Integration:</strong> Integrating the Day</div>`;
  }

  attachListener(selector, event, handler, options = {}) {
    document.getElementById(selector)?.addEventListener(event, handler, options);
  }
}