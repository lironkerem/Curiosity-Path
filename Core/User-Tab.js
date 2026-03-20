/**
 * User-Tab.js
 * Manages user menu, profile, settings, notifications, and themes.
 */

import { renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';
import { supabase }                        from './Supabase.js';
import * as Templates                      from './user-tab-templates.js';

// ─── Safe localStorage ────────────────────────────────────────────────────────

const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  clear:  ()     => { try { localStorage.clear(); }            catch { /* noop */  } }
};

// ─── Allowed avatar MIME types ────────────────────────────────────────────────

const ALLOWED_AVATAR_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

// ─── UserTab ──────────────────────────────────────────────────────────────────

export default class UserTab {

  static CONFIG = Object.freeze({
    MAX_AVATAR_SIZE:          5_242_880, // 5 MB
    AUTOSAVE_DELAY:           1_500,
    THEME_INIT_DELAY:         100,
    MIN_NOTIFICATION_WINDOW:  6          // hours
  });

  static THEME_CLASSES = new Set([
    'champagne-gold', 'royal-indigo', 'earth-luxury', 'matrix-code'
  ]);

  static STATUS_COLORS = Object.freeze({
    online:    '#6b9b37',
    available: '#6b9b37',
    away:      '#e53e3e',
    guiding:   '#e53e3e',
    silent:    '#7c3aed',
    deep:      '#1e40af',
    offline:   '#9ca3af'
  });

  // Whitelist of known rules collapse target IDs (prevents querySelector injection)
  static RULES_TARGETS = new Set(['currency-block', 'badges-block']);

  constructor(app) {
    this.app             = app;
    this.btn             = null;
    this.dropdown        = null;
    this.saveProfileLock = false;
  }

  get currentUser() { return this.app.state.currentUser; }

  // ─── Rendering ─────────────────────────────────────────────────────────────

  render() {
    this.loadStylesheet();
    return `
      <div class="user-menu" id="user-menu">
        <button type="button" class="user-disc" id="user-menu-btn"
                aria-expanded="false" aria-controls="user-dropdown" aria-label="User menu">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="Your avatar" width="32" height="32" decoding="async">
            <span class="disc-avatar-emoji" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          </span>
          <span class="disc-dot hidden" aria-hidden="true"></span>
        </button>

        <div class="user-dropdown" id="user-dropdown" role="menu" aria-label="User menu options">
          ${Templates.MENU_ITEMS.map(item =>
            `<button type="button" class="dropdown-item" data-section="${item.id}" role="menuitem">${item.icon} ${item.label}</button>
             <div class="accordion-panel" id="panel-${item.id}" role="region" aria-label="${item.label}"></div>`
          ).join('')}
          <div class="dropdown-divider" role="separator"></div>
          <button type="button" class="dropdown-item" data-action="logout" role="menuitem">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2V4z"/></svg>
            Logout
          </button>
        </div>
      </div>`;
  }

  loadStylesheet() {
    if (!document.getElementById('user-tab-styles')) {
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = './CSS/user-tab-styles.css';
      link.id   = 'user-tab-styles';
      document.head.appendChild(link);
    }
  }

  // ─── Initialization ────────────────────────────────────────────────────────

  async init() {
    this.dropdown = document.getElementById('user-dropdown');
    this.btn      = document.getElementById('user-menu-btn');
    if (!this.dropdown || !this.btn) return;

    this.attachMenuHandlers();
    this.attachButtonHandlers();
    this.attachGlobalHandlers();

    this.syncAvatar();
    this.loadActiveTheme();
    this.restoreDarkMode();
    await this.hydrateUserProfile();
    await this.initPricingModal();

    window.addEventListener('statusChanged', e => {
      const { status } = e.detail || {};
      if (!status) return;
      if (this.currentUser) {
        this.currentUser.community_status = status;
        this.currentUser.status           = status;
      }
      this.updateStatusRing(status);
      document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
        btn.setAttribute('aria-checked', String(btn.dataset.status === status));
      });
    });
  }

  attachMenuHandlers() {
    this.dropdown.addEventListener('click', e => {
      const sectionBtn = e.target.closest('.dropdown-item[data-section]');
      const actionBtn  = e.target.closest('.dropdown-item[data-action]');
      if (sectionBtn)                              this.handleSectionClick(sectionBtn.dataset.section);
      else if (actionBtn?.dataset.action === 'logout') this.handleLogout();
    });
  }

  attachButtonHandlers() {
    this.btn.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.toggleDropdown(!expanded);
      if (!expanded) this.collapseAllSections();
      this.syncAvatar();
    });
  }

  attachGlobalHandlers() {
    document.addEventListener('click', e => {
      if (!this.btn.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.toggleDropdown(false);
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { this.toggleDropdown(false); this.closePricingModal(); }
    });
  }

  toggleDropdown(open) {
    this.btn.setAttribute('aria-expanded', String(open));
    this.dropdown.classList.toggle('active', open);
  }

  async initPricingModal() {
    await new Promise(r => requestAnimationFrame(r));
    if (!document.getElementById('pricing-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.pricingModal());
      const overlay  = document.getElementById('pricing-modal-overlay');
      const closeBtn = overlay?.querySelector('.pricing-close');
      closeBtn?.addEventListener('click', () => this.closePricingModal());
      overlay?.addEventListener('click', e => { if (e.target === overlay) this.closePricingModal(); });
    }
  }

  // ─── Section management ────────────────────────────────────────────────────

  collapseAllSections() {
    document.querySelectorAll('.accordion-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.dataset.filled = '';
    });
  }

  handleSectionClick(section) {
    if (section === 'billing') { this.showPricingModal(); return; }

    // Whitelist section names to prevent ID injection
    const KNOWN_SECTIONS = new Set(['profile', 'skins', 'notifications', 'about', 'rules', 'contact', 'export']);
    if (!KNOWN_SECTIONS.has(section)) return;

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
      skins:         () => { panel.innerHTML = Templates.skins(this.app);           this.attachSkinsHandlers();   },
      notifications: () => { panel.innerHTML = Templates.notifications();            this.attachNotificationsHandlers(); },
      about:         () => { panel.innerHTML = Templates.about();         },
      rules:         () => { panel.innerHTML = Templates.rules();         this.attachRulesHandlers(panel); },
      contact:       () => { panel.innerHTML = Templates.contact();       },
      export:        () => { panel.innerHTML = Templates.exportData();    }
    };
    renderers[section]?.();
  }

  // ─── Profile management ────────────────────────────────────────────────────

  attachProfileHandlers() {
    const modal = document.getElementById('icon-picker-modal');
    const previouslyFocused = document.activeElement;

    document.getElementById('open-icon-picker-btn')?.addEventListener('click', () => {
      if (modal) { modal.style.display = 'flex'; modal.querySelector('button')?.focus(); }
    });
    document.getElementById('close-icon-picker-btn')?.addEventListener('click', () => {
      if (modal) { modal.style.display = 'none'; previouslyFocused?.focus(); }
    });
    modal?.addEventListener('click', e => {
      if (e.target === modal) { modal.style.display = 'none'; previouslyFocused?.focus(); }
    });
    // Escape closes icon picker
    modal?.addEventListener('keydown', e => {
      if (e.key === 'Escape') { modal.style.display = 'none'; previouslyFocused?.focus(); }
    });

    document.querySelectorAll('.avatar-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key         = btn.dataset.value;
        const hiddenInput = document.getElementById('profile-emoji');
        const emojiSpan   = document.querySelector('.profile-avatar-emoji');
        const img         = document.getElementById('profile-avatar-img');

        if (hiddenInput) hiddenInput.value = key;
        if (emojiSpan)   emojiSpan.innerHTML = renderAvatarIcon(key);
        if (img)         { img.style.display = 'none'; emojiSpan.style.display = 'block'; }

        document.querySelectorAll('.avatar-icon-btn').forEach(b => {
          b.classList.remove('selected');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('selected');
        btn.setAttribute('aria-selected', 'true');

        if (modal) { modal.style.display = 'none'; previouslyFocused?.focus(); }
      });
    });

    this.attachListener('avatar-upload',       'change', () => this.handleAvatarUpload());
    this.attachListener('save-profile-btn',    'click',  () => this.saveQuickProfile());
    this.attachListener('delete-account-btn',  'click',  () => this.showDeleteAccountModal());

    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setStatus(btn.dataset.status, btn.dataset.color, btn.dataset.label));
    });

    this.updateStatusRing(this.currentUser?.community_status || 'offline');
  }

  async handleAvatarUpload() {
    const file = document.getElementById('avatar-upload')?.files?.[0];
    if (!file) return;

    // Validate type
    if (!ALLOWED_AVATAR_MIME.has(file.type)) {
      this.app.showToast('Please upload a JPEG, PNG, WebP, or GIF', 'error');
      return;
    }
    if (file.size > UserTab.CONFIG.MAX_AVATAR_SIZE) {
      this.app.showToast('Image must be smaller than 5 MB', 'error');
      return;
    }

    // Optimistic preview
    const reader   = new FileReader();
    reader.onload  = e => {
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

      // Use MIME type to determine extension — not file.name (security)
      const ext  = file.type.split('/')[1] || 'jpg';
      const path = `avatars/${uid}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('community-avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (upErr) {
        console.warn('[UserTab] Avatar upload error:', upErr.message);
        this.app.showToast('Upload failed — please try again', 'error');
        return;
      }

      const { data } = supabase.storage.from('community-avatars').getPublicUrl(path);
      const publicUrl = data?.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : null;
      if (!publicUrl) { this.app.showToast('Upload failed — please try again', 'error'); return; }

      const img = document.getElementById('profile-avatar-img');
      if (img) img.src = publicUrl;

      const { error: saveErr } = await supabase
        .from('profiles')
        .upsert({ id: uid, avatar_url: publicUrl }, { onConflict: 'id' });

      if (saveErr) {
        console.warn('[UserTab] avatar_url save error:', saveErr.message);
        this.app.showToast('Photo uploaded but profile save failed', 'warning');
        return;
      }

      if (this.currentUser) this.currentUser.avatar_url = publicUrl;

      // Update cached profile in localStorage
      try {
        const cached = JSON.parse(ls.get(`profile_${uid}`) || '{}');
        ls.set(`profile_${uid}`, JSON.stringify({ ...cached, avatar_url: publicUrl }));
      } catch { /* non-critical */ }

      this.syncAvatar();
      this.app.showToast('Profile photo updated', 'success');

    } catch (err) {
      console.error('[UserTab] handleAvatarUpload error:', err);
      this.app.showToast('Upload failed — please try again', 'error');
    }
  }

  async saveQuickProfile() {
    if (this.saveProfileLock) return;
    this.saveProfileLock = true;

    const uid = this.currentUser?.id;
    if (!uid) { this.saveProfileLock = false; return this.app.showToast('Not logged in', 'error'); }

    const payload = {
      name:             (document.getElementById('profile-name')?.value.trim()    || null)?.slice(0, 100),
      email:            (document.getElementById('profile-email')?.value.trim()   || null)?.slice(0, 254),
      phone:            (document.getElementById('profile-phone')?.value.trim()   || null)?.slice(0, 20),
      birthday:          document.getElementById('profile-birthday')?.value       || null,
      emoji:             document.getElementById('profile-emoji')?.value          || 'user',
      country:          (document.getElementById('profile-country')?.value.trim() || null)?.slice(0, 60),
      community_status:  this.currentUser?.community_status || 'online'
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: uid, ...payload }, { onConflict: 'id' });
      if (!error) savedOnServer = true;
    } catch (e) {
      console.warn('[UserTab] Profile save failed:', e);
    }

    ls.set(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.currentUser, payload);

    this.syncAvatar();
    window.dispatchEvent(new CustomEvent('avatarChanged', {
      detail: { userId: uid, emoji: payload.emoji, avatarUrl: this.currentUser?.avatar_url || null }
    }));

    // Toast text uses plain strings — no inline SVG in message (prevents HTML injection)
    this.app.showToast(
      savedOnServer ? 'Profile saved' : 'Saved locally',
      savedOnServer ? 'success' : 'warning'
    );

    this.saveProfileLock = false;
  }

  async hydrateUserProfile() {
    const uid = this.currentUser?.id;
    if (!uid) return;
    let data = null;

    try {
      const { data: row, error } = await supabase
        .from('profiles').select('*').eq('id', uid).single();
      if (!error && row) data = row;
    } catch (e) { console.warn('[UserTab] Profile fetch error:', e); }

    if (!data) {
      try { data = JSON.parse(ls.get(`profile_${uid}`)); } catch { /* noop */ }
    }

    if (data) {
      ['name','email','phone','birthday','emoji','avatar_url','country','community_status']
        .forEach(f => { if (data[f] !== undefined) this.currentUser[f] = data[f]; });
      this.syncAvatar();
      this.updateStatusRing(this.currentUser.community_status || 'offline');
    }
  }

  // ─── Skins & Themes ────────────────────────────────────────────────────────

  attachSkinsHandlers() {
    this.attachListener('dark-mode-toggle', 'change', e => this.handleDarkModeToggle(e.target.checked));

    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', e => {
        if (e.target.checked) {
          document.querySelectorAll('.theme-toggle').forEach(o => { if (o !== e.target) o.checked = false; });
          this.switchTheme(e.target.dataset.theme);
        } else {
          e.target.checked = true; // keep one selected
        }
      });
    });
  }

  handleDarkModeToggle(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    const link = document.getElementById('dark-mode-css');
    if (link) link.media = enabled ? 'all' : 'not all';
    ls.set('darkMode', enabled ? 'enabled' : 'disabled');
    if (ls.get('activeTheme') === 'matrix-code' && window.app?.initMatrixRain) {
      setTimeout(() => window.app.initMatrixRain(), 50);
    }
  }

  switchTheme(name) {
    // Validate against known themes to prevent arbitrary body class injection
    const VALID_THEMES = new Set([...UserTab.THEME_CLASSES, 'default']);
    if (!VALID_THEMES.has(name)) {
      console.warn(`[UserTab] switchTheme: unknown theme "${name}"`);
      return;
    }

    if (name !== 'default') {
      const dm = document.getElementById('dark-mode-css');
      if (dm) dm.media = 'not all';
    }

    document.body.classList.remove(...UserTab.THEME_CLASSES);
    document.querySelectorAll('link[id^="skin_"]').forEach(l => l.media = 'not all');
    document.querySelectorAll('link[data-premium-theme]').forEach(l => l.remove());

    const rain = document.querySelector('.matrix-rain-container');
    if (rain) rain.remove();
    if (window.matrixRain) window.matrixRain.destroy();

    ls.set('activeTheme', name);

    if (name === 'default') {
      const dm = document.getElementById('dark-mode-css');
      if (dm) dm.media = ls.get('darkMode') === 'enabled' ? 'all' : 'not all';
      return;
    }

    document.body.classList.add(name);

    const preloaded = document.getElementById(`skin_${name}`);
    if (preloaded) {
      preloaded.media = 'all';
    } else {
      const link = document.createElement('link');
      link.rel   = 'stylesheet';
      link.href  = `./CSS/Skins/${name}.css`;
      link.setAttribute('data-premium-theme', name);
      document.head.appendChild(link);
    }

    if (name === 'matrix-code') {
      window.matrixRain?.init();
      if (window.app?.initMatrixRain) {
        setTimeout(() => window.app.initMatrixRain(), UserTab.CONFIG.THEME_INIT_DELAY);
      }
    }
  }

  loadActiveTheme() {
    const theme = ls.get('activeTheme');
    if (theme && theme !== 'default') {
      setTimeout(() => this.switchTheme(theme), UserTab.CONFIG.THEME_INIT_DELAY);
    }
  }

  restoreDarkMode() {
    const dark   = ls.get('darkMode') === 'enabled';
    document.body.classList.toggle('dark-mode', dark);
    const link   = document.getElementById('dark-mode-css');
    const toggle = document.getElementById('dark-mode-toggle');
    if (link)   link.media     = dark ? 'all' : 'not all';
    if (toggle) toggle.checked = dark;
  }

  // ─── Notifications ─────────────────────────────────────────────────────────

  async attachNotificationsHandlers() {
    await this.hydrateNotificationSettings();

    const master   = document.getElementById('master-notifications-toggle');
    const options  = document.getElementById('notification-options');
    const startEl  = document.getElementById('notification-start-time');
    const endEl    = document.getElementById('notification-end-time');
    const freqEl   = document.getElementById('notification-frequency');
    const tzDisplay = document.getElementById('timezone-display');

    if (tzDisplay) tzDisplay.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let saveTimeout;
    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveNotificationSettings(), UserTab.CONFIG.AUTOSAVE_DELAY);
    };

    const checkWindowSize = () => {
      if (!startEl?.value || !endEl?.value) return;
      const diffHours = this.calculateTimeWindowHours(startEl.value, endEl.value);
      const warning   = document.getElementById('frequency-warning');
      if (warning) {
        warning.style.display =
          (diffHours < UserTab.CONFIG.MIN_NOTIFICATION_WINDOW && freqEl?.value === 'full')
            ? 'block' : 'none';
      }
    };

    master?.addEventListener('change', async e => {
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

    startEl?.addEventListener('change', () => {
      if (this.validateTimeWindow(startEl, endEl)) { checkWindowSize(); autoSave(); }
    });
    endEl?.addEventListener('change', () => {
      if (this.validateTimeWindow(startEl, endEl)) { checkWindowSize(); autoSave(); }
    });
    freqEl?.addEventListener('change', () => { checkWindowSize(); autoSave(); });

    this.attachListener('save-notification-settings', 'click', () => {
      if (this.validateTimeWindow(startEl, endEl)) {
        clearTimeout(saveTimeout);
        this.saveNotificationSettings();
      }
    });

    checkWindowSize();
  }

  calculateTimeWindowHours(start, end) {
    const toMins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    return (toMins(end) - toMins(start)) / 60;
  }

  validateTimeWindow(startEl, endEl) {
    if (!startEl?.value || !endEl?.value) return true;
    const isValid = this.timeToMinutes(startEl.value) < this.timeToMinutes(endEl.value);
    const warning = document.getElementById('time-validation-warning');
    if (warning) {
      warning.style.display = isValid ? 'none' : 'block';
      warning.setAttribute('aria-hidden', String(isValid));
    }
    if (!isValid) this.app.showToast('Start time must be before end time', 'warning');
    return isValid;
  }

  timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  toggleNotificationOptions(options, enabled) {
    if (!options) return;
    options.style.opacity       = enabled ? '1' : '.4';
    options.style.pointerEvents = enabled ? 'auto' : 'none';
    options.setAttribute('aria-hidden', String(!enabled));
  }

  async enablePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      this.app.showToast('Push not supported on this device', 'error');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { this.app.showToast('Permission denied', 'error'); return false; }

      const sw  = await navigator.serviceWorker.ready;
      let sub   = await sw.pushManager.getSubscription();

      if (!sub) {
        // VAPID key from global env or fallback
        const VAPID = (typeof ENV_VAPID_KEY !== 'undefined' && ENV_VAPID_KEY)
          ? ENV_VAPID_KEY
          : 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc';

        sub = await sw.pushManager.subscribe({
          userVisibleOnly:      true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID)
        });

        const payload = { ...sub.toJSON(), user_id: this.currentUser?.id || null };
        const headers = { 'Content-Type': 'application/json' };

        // Get current session token for authenticated API call
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;
        } catch { /* proceed without auth header */ }

        const res = await fetch('/api/save-sub', { method: 'POST', headers, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Subscription save failed');
      }

      this.app.showToast('Notifications enabled', 'success');
      return true;
    } catch (err) {
      console.error('[UserTab] enablePushNotifications error:', err);
      this.app.showToast('Enable failed: ' + err.message, 'error');
      return false;
    }
  }

  async disablePushNotifications() {
    try {
      const sw  = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      if (sub) { await sub.unsubscribe(); this.app.showToast('Notifications disabled', 'success'); }
    } catch (e) { console.error('[UserTab] disablePushNotifications error:', e); }
  }

  urlBase64ToUint8Array(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const b64     = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw     = atob(b64);
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

    ls.set('notification_settings', JSON.stringify(settings));

    supabase.from('notification_prefs')
      .upsert({ user_id: this.currentUser.id, prefs: settings }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) { console.error('[UserTab] notif save error:', error); this.app.showToast('Saved locally only', 'warning'); }
        else        { this.app.showToast('Settings saved', 'success'); }
      });
  }

  async hydrateNotificationSettings() {
    const uid = this.currentUser?.id;
    if (!uid) return;
    try {
      const { data } = await supabase
        .from('notification_prefs').select('prefs').eq('user_id', uid).single();
      if (data?.prefs) {
        ls.set('notification_settings', JSON.stringify(data.prefs));
        this.restoreNotificationUI(data.prefs);
      } else {
        const local = ls.get('notification_settings');
        if (local) try { this.restoreNotificationUI(JSON.parse(local)); } catch { /* noop */ }
      }
    } catch (e) { console.warn('[UserTab] Settings sync error:', e); }
  }

  restoreNotificationUI(settings) {
    if (!settings) return;
    const master    = document.getElementById('master-notifications-toggle');
    const options   = document.getElementById('notification-options');
    const startEl   = document.getElementById('notification-start-time');
    const endEl     = document.getElementById('notification-end-time');
    const freqEl    = document.getElementById('notification-frequency');
    const tzDisplay = document.getElementById('timezone-display');

    if (master)  { master.checked = settings.enabled || false; this.toggleNotificationOptions(options, settings.enabled); }
    if (startEl && settings.window?.start) startEl.value = settings.window.start;
    if (endEl   && settings.window?.end)   endEl.value   = settings.window.end;
    if (freqEl  && settings.frequency)     freqEl.value  = settings.frequency;
    if (tzDisplay) tzDisplay.textContent   = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // ─── Rules ─────────────────────────────────────────────────────────────────

  attachRulesHandlers(panel) {
    panel.querySelectorAll('.rules-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        // Whitelist known IDs to prevent arbitrary querySelector injection
        if (!UserTab.RULES_TARGETS.has(targetId)) return;
        const target   = panel.querySelector(`#${targetId}`);
        const isOpen   = btn.classList.contains('active');
        btn.classList.toggle('active', !isOpen);
        target?.classList.toggle('show', !isOpen);
      });
    });

    panel.querySelectorAll('.rules-category-title').forEach(title => {
      title.addEventListener('click', () => title.parentElement.classList.toggle('open'));
    });
  }

  // ─── Pricing modal ─────────────────────────────────────────────────────────

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
    const dots      = document.querySelectorAll('.pricing-dot');
    const cards     = container?.querySelectorAll('.pricing-card');
    if (!container || !cards?.length) return;

    container.scrollTo({ left: 0, behavior: 'smooth' });

    let _cachedCardWidth = null;
    const getCardWidth   = () => {
      if (!_cachedCardWidth) _cachedCardWidth = (cards[0]?.offsetWidth || 0) + 20;
      return _cachedCardWidth;
    };

    container.addEventListener('scroll', () => {
      const active = Math.round(container.scrollLeft / getCardWidth());
      dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        container.scrollTo({ left: getCardWidth() * i, behavior: 'smooth' });
      });
    });
  }

  closePricingModal() {
    document.getElementById('pricing-modal-overlay')?.classList.remove('show');
    document.body.classList.remove('blur-behind');
  }

  attachPricingButtons(overlay) {
    overlay.querySelectorAll('.pricing-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const plan = e.currentTarget.dataset.plan;
        this.app.startCheckout?.(plan);
        this.closePricingModal();
      }, { once: true });
    });
  }

  // ─── Status ────────────────────────────────────────────────────────────────

  updateStatusRing(status = 'offline') {
    const color = UserTab.STATUS_COLORS[status] || UserTab.STATUS_COLORS.offline;
    if (this.btn) {
      this.btn.style.setProperty('--status-ring-color', color);
      this.btn.classList.add('has-status-ring');
    }
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      const active = btn.dataset.status === status;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', String(active));
    });
  }

  async setStatus(status, color, label) {
    // Validate status against known values
    if (!UserTab.STATUS_COLORS[status]) {
      console.warn(`[UserTab] setStatus: unknown status "${status}"`);
      return;
    }

    if (this.currentUser) {
      this.currentUser.community_status = status;
      this.currentUser.status           = status;
    }
    this.updateStatusRing(status);

    const uid = this.currentUser?.id;
    if (uid && window.ActiveMembers) window.ActiveMembers.updateMemberStatus(uid, status);

    const ACTIVITIES = {
      online: '✨ Available', available: '✨ Available',
      away:   '🌿 Away',   silent: '🤫 In Silence',
      deep:   '🧘 Deep Practice', offline: '💤 Offline'
    };
    const activity = ACTIVITIES[status] || '✨ Available';

    try {
      if (!uid) throw new Error('Not logged in');

      const writes = [
        supabase.from('profiles').update({ community_status: status }).eq('id', uid)
      ];
      if (window.CommunityDB?.ready) {
        writes.push(window.CommunityDB.setPresence(status, activity, window.Core?.state?.currentRoom || null));
      }

      const results    = await Promise.all(writes);
      const profileErr = results[0]?.error;
      if (profileErr) throw profileErr;

      this.app.showToast(`Status set to ${label}`, 'success');
    } catch (err) {
      console.error('[UserTab] setStatus error:', err);
      this.app.showToast('Could not update status', 'error');
    }

    window.dispatchEvent(new CustomEvent('statusChanged', { detail: { status } }));
  }

  // ─── Avatar sync ───────────────────────────────────────────────────────────

  syncAvatar() {
    const { avatar_url, emoji = 'user' } = this.currentUser || {};
    const avImg   = this.btn?.querySelector('.disc-avatar-img');
    const avEmoji = this.btn?.querySelector('.disc-avatar-emoji');
    if (!avImg || !avEmoji) return;

    const hasAvatar = !!avatar_url?.trim();
    avImg.classList.toggle('hidden', !hasAvatar);
    avEmoji.classList.toggle('hidden', hasAvatar);
    this.btn.classList.toggle('avatar-mode', hasAvatar);

    if (hasAvatar) {
      avImg.src = avatar_url;
    } else {
      avEmoji.innerHTML = renderAvatarIcon(emoji);
    }
  }

  // ─── Delete account ────────────────────────────────────────────────────────

  showDeleteAccountModal() {
    if (!document.getElementById('delete-account-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.deleteAccountModal());
    }

    const overlay    = document.getElementById('delete-account-modal-overlay');
    const input      = document.getElementById('delete-account-confirm-input');
    const confirmBtn = document.getElementById('delete-account-confirm-btn');
    const cancelBtn  = document.getElementById('delete-account-cancel-btn');
    const previous   = document.activeElement;

    input.value         = '';
    confirmBtn.disabled = true;
    confirmBtn.setAttribute('aria-disabled', 'true');
    overlay.classList.add('show');

    const onInput = () => {
      const valid         = input.value.trim() === 'DELETE';
      confirmBtn.disabled = !valid;
      confirmBtn.setAttribute('aria-disabled', String(!valid));
    };
    input.addEventListener('input', onInput);

    const close = () => {
      overlay.classList.remove('show');
      input.removeEventListener('input', onInput);
      previous?.focus();
    };

    cancelBtn.addEventListener('click', close, { once: true });
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); }, { once: true });
    overlay.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });

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

      const res = await fetch(
        `${supabase.supabaseUrl}/functions/v1/delete-account`,
        {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey':         supabase.supabaseKey
          }
        }
      );

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.error || 'Deletion failed');

      // Clear local state
      ls.clear();
      try { sessionStorage.clear(); } catch { /* noop */ }

      await supabase.auth.signOut();
      this.app.showToast('Account deleted. Goodbye 🙏', 'success');

      setTimeout(() => {
        if (typeof this.app.logout === 'function') this.app.logout();
        else window.location.reload();
      }, 1_500);

    } catch (err) {
      console.error('[UserTab] handleDeleteAccount error:', err);
      this.app.showToast(`Deletion failed: ${err.message}`, 'error');
    }
  }

  // ─── Logout ─────────────────────────────────────────────────────────────────

  async handleLogout() {
    try {
      this.toggleDropdown(false);
      if (typeof this.app.logout === 'function') await this.app.logout();
      else { console.error('[UserTab] app.logout() not available'); this.app?.showToast('Logout failed', 'error'); }
    } catch (err) {
      console.error('[UserTab] Logout error:', err);
      this.app?.showToast('Logout error', 'error');
    }
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  attachListener(id, event, handler, options = {}) {
    document.getElementById(id)?.addEventListener(event, handler, options);
  }
}
