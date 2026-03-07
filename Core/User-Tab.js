/**
 * User-Tab.js – Optimized & Consolidated 2026-01-26
 * Manages user menu, profile, settings, notifications, and themes
 */
import { renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';
import { supabase } from './Supabase.js';
import * as Templates from './user-tab-templates.js';

export default class UserTab {
  // Configuration constants
  static CONFIG = {
    MAX_AVATAR_SIZE: 5_242_880, // 5MB
    AUTOSAVE_DELAY: 1500,
    THEME_INIT_DELAY: 100,
    MIN_NOTIFICATION_WINDOW: 6, // hours
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

  /** @returns {Object|null} Current user from app state */
  get currentUser() {
    return this.app.state.currentUser;
  }

  // ============== RENDERING ==============

  render() {
    this.loadStylesheet();
    const u = this.currentUser;

    return `
      <div class="user-menu" id="user-menu">
        <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="avatar">
            <span class="disc-avatar-emoji"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
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
          <button class="dropdown-item" data-action="logout"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2V4z"/></svg> Logout</button>
        </div>
      </div>`;
  }

  /** Load CSS if not already present */
  loadStylesheet() {
    if (!document.getElementById('user-tab-styles')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './CSS/user-tab-styles.css';
      link.id = 'user-tab-styles';
      document.head.appendChild(link);
    }
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

    // Listen for status changes from Community Hub Hero Profile
    window.addEventListener('statusChanged', (e) => {
      const { status } = e.detail || {};
      if (!status) return;
      if (this.currentUser) {
        this.currentUser.community_status = status;
        this.currentUser.status = status; // keep both in sync
      }
      this.updateStatusRing(status);
      // Sync active state in picker if it's open
      document.querySelectorAll('.status-option-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
      });
    });
  }

  /** Attach handlers to dropdown menu */
  attachMenuHandlers() {
    this.dropdown.addEventListener('click', (e) => {
      const sectionBtn = e.target.closest('.dropdown-item[data-section]');
      const actionBtn = e.target.closest('.dropdown-item[data-action]');
      
      if (sectionBtn) {
        this.handleSectionClick(sectionBtn.dataset.section);
      } else if (actionBtn?.dataset.action === 'logout') {
        this.handleLogout();
      }
    });
  }

  /** Attach handlers to user menu button */
  attachButtonHandlers() {
    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.toggleDropdown(!expanded);
      
      // Collapse all sections when opening dropdown
      if (!expanded) this.collapseAllSections();
      
      this.syncAvatar();
    });
  }

  /** Attach global document handlers */
  attachGlobalHandlers() {
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!this.btn.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.toggleDropdown(false);
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.toggleDropdown(false);
        this.closePricingModal();
      }
    });
  }

  /** Toggle dropdown visibility */
  toggleDropdown(open) {
    this.btn.setAttribute('aria-expanded', open);
    this.dropdown.classList.toggle('active', open);
  }

  /** Initialize pricing modal in DOM */
  async initPricingModal() {
    await new Promise(r => requestAnimationFrame(r));
    
    if (!document.getElementById('pricing-modal-overlay')) {
      document.documentElement.insertAdjacentHTML('afterbegin', Templates.pricingModal());
      
      const overlay = document.getElementById('pricing-modal-overlay');
      const closeBtn = overlay.querySelector('.pricing-close');
      
      closeBtn.addEventListener('click', () => this.closePricingModal());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closePricingModal();
      });
    }
  }

  // ============== SECTION MANAGEMENT ==============

  /** Collapse all accordion panels */
  collapseAllSections() {
    document.querySelectorAll('.accordion-panel').forEach(panel => {
      panel.classList.remove('active');
      panel.dataset.filled = '';
    });
  }

  /**
   * Handle section click - toggle accordion
   * @param {string} section - Section ID to toggle
   */
  handleSectionClick(section) {
    if (section === 'billing') {
      this.showPricingModal();
      return;
    }

    const panel = document.getElementById(`panel-${section}`);
    if (!panel) return;

    const isOpen = panel.classList.contains('active');
    this.collapseAllSections();

    if (!isOpen) {
      panel.classList.add('active');
      // Render content on first open
      if (!panel.dataset.filled) {
        this.renderSection(section, panel);
        panel.dataset.filled = '1';
      }
    }
  }

  /**
   * Render section content based on type
   * @param {string} section - Section ID
   * @param {HTMLElement} panel - Target panel element
   */
  renderSection(section, panel) {
    const renderers = {
      profile: () => {
        panel.innerHTML = Templates.profile(this.currentUser);
        this.attachProfileHandlers();
      },
      skins: () => {
        panel.innerHTML = Templates.skins(this.app);
        this.attachSkinsHandlers();
      },
      notifications: () => {
        panel.innerHTML = Templates.notifications();
        this.attachNotificationsHandlers();
      },
      about: () => {
        panel.innerHTML = Templates.about();
      },
      rules: () => {
        panel.innerHTML = Templates.rules();
        this.attachRulesHandlers(panel);
      },
      contact: () => {
        panel.innerHTML = Templates.contact();
      },
      export: () => {
        panel.innerHTML = Templates.exportData();
      },
      admin: () => {
        panel.innerHTML = Templates.admin();
        this.loadAdminPanel();
      }
    };

    const renderer = renderers[section];
    if (renderer) renderer();
  }

  // ============== PROFILE MANAGEMENT ==============

  attachProfileHandlers() {
    // Icon picker: clicking an SVG button updates the hidden input + preview
    document.querySelectorAll('.avatar-icon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.value;
        const hiddenInput = document.getElementById('profile-emoji');
        const emojiSpan = document.querySelector('.profile-avatar-emoji');
        const img = document.getElementById('profile-avatar-img');

        if (hiddenInput) hiddenInput.value = key;
        if (emojiSpan) emojiSpan.innerHTML = renderAvatarIcon(key);
        if (img) {
          img.style.display = 'none';
          emojiSpan.style.display = 'block';
        }

        // Highlight selected
        document.querySelectorAll('.avatar-icon-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    this.attachListener('avatar-upload', 'change', () => {
      this.handleAvatarUpload();
    });

    this.attachListener('save-profile-btn', 'click', () => {
      this.saveQuickProfile();
    });

    // Status picker
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setStatus(btn.dataset.status, btn.dataset.color, btn.dataset.label);
      });
    });

    // Highlight current status on open
    this.updateStatusRing(this.currentUser?.community_status || 'offline');
  }

  /** Handle avatar image upload - uploads to Supabase Storage, saves public URL */
  async handleAvatarUpload() {
    const file = document.getElementById('avatar-upload').files[0];
    if (!file) return;

    if (file.size > UserTab.CONFIG.MAX_AVATAR_SIZE) {
      this.app.showToast('Image > 5 MB', 'error');
      return;
    }

    // Optimistic preview
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

      if (upErr) {
        console.warn('Avatar upload error:', upErr.message);
        this.app.showToast('Upload failed - please try again', 'error');
        return;
      }

      const { data } = supabase.storage.from('community-avatars').getPublicUrl(path);
      const publicUrl = data?.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : null;
      if (!publicUrl) { this.app.showToast('Upload failed - please try again', 'error'); return; }

      // Update img element to real URL (replace base64 preview)
      const img = document.getElementById('profile-avatar-img');
      if (img) img.src = publicUrl;

      // Save to profiles table
      const { error: saveErr } = await supabase
        .from('profiles')
        .upsert({ id: uid, avatar_url: publicUrl }, { onConflict: 'id' });

      if (saveErr) {
        console.warn('Profile avatar_url save error:', saveErr.message);
        this.app.showToast('Photo uploaded but profile save failed', 'warning');
        return;
      }

      // Sync into app state
      if (this.currentUser) this.currentUser.avatar_url = publicUrl;
      localStorage.setItem(`profile_${uid}`, JSON.stringify({
        ...JSON.parse(localStorage.getItem(`profile_${uid}`) || '{}'),
        avatar_url: publicUrl
      }));
      this.syncAvatar();
      this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Profile photo updated', 'success');

    } catch (err) {
      console.error('handleAvatarUpload error:', err);
      this.app.showToast('Upload failed - please try again', 'error');
    }
  }

  /** Save user profile (with lock to prevent double-save) */
  async saveQuickProfile() {
    if (this.saveProfileLock) return;
    this.saveProfileLock = true;

    const uid = this.currentUser?.id;
    if (!uid) {
      this.saveProfileLock = false;
      return this.app.showToast('Not logged in', 'error');
    }

    const payload = {
      name: document.getElementById('profile-name')?.value.trim() || null,
      email: document.getElementById('profile-email')?.value.trim() || null,
      phone: document.getElementById('profile-phone')?.value.trim() || null,
      birthday: document.getElementById('profile-birthday')?.value || null,
      emoji: document.getElementById('profile-emoji')?.value || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      country: document.getElementById('profile-country')?.value.trim() || null,
      // Preserve community_status - managed by setStatus(), not a form field
      community_status: this.currentUser?.community_status || 'online',
      // avatar_url is managed separately by handleAvatarUpload (Supabase Storage)
    };

    let savedOnServer = false;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: uid, ...payload }, { onConflict: 'id' });
      
      if (!error) savedOnServer = true;
    } catch (e) {
      console.warn('Profile save failed', e);
    }

    // Always save locally as backup
    localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
    Object.assign(this.currentUser, payload);
    
    this.syncAvatar();
    this.app.showToast(
      savedOnServer ? '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Profile saved' : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Saved locally',
      savedOnServer ? 'success' : 'warning'
    );
    
    this.saveProfileLock = false;
  }

  /** Fetch and restore user profile from server or localStorage */
  async hydrateUserProfile() {
    const uid = this.currentUser?.id;
    if (!uid) return;

    let data = null;

    // Try server first
    try {
      const { data: row, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (!error && row) data = row;
    } catch (e) {
      console.warn('Profile fetch error', e);
    }

    // Fallback to localStorage
    if (!data) {
      try {
        data = JSON.parse(localStorage.getItem(`profile_${uid}`));
      } catch (e) {
        console.warn('localStorage parse error', e);
      }
    }

    // Merge data into current user
    if (data) {
      const fields = ['name', 'email', 'phone', 'birthday', 'emoji', 'avatar_url', 'country', 'community_status'];
      fields.forEach(field => {
        if (data[field] !== undefined) {
          this.currentUser[field] = data[field];
        }
      });
      this.syncAvatar();
      this.updateStatusRing(this.currentUser.community_status || 'offline');
    }
  }

  // ============== SKINS & THEMES ==============

  attachSkinsHandlers() {
    this.attachListener('dark-mode-toggle', 'change', (e) => {
      this.handleDarkModeToggle(e.target.checked);
    });

    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        if (e.target.checked) {
          // Uncheck other theme toggles
          document.querySelectorAll('.theme-toggle').forEach(other => {
            if (other !== e.target) other.checked = false;
          });
          this.switchTheme(e.target.dataset.theme);
        } else {
          e.target.checked = true; // Keep one theme always selected
        }
      });
    });
  }

  /**
   * Handle dark mode toggle
   * @param {boolean} enabled - Whether dark mode is enabled
   */
  handleDarkModeToggle(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    
    const link = document.getElementById('dark-mode-css');
    if (link) link.disabled = !enabled;
    
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');

    // Reinit matrix rain if active
    if (localStorage.getItem('activeTheme') === 'matrix-code' && window.app?.initMatrixRain) {
      setTimeout(() => window.app.initMatrixRain(), 50);
    }
  }

  /**
   * Switch to a different theme
   * @param {string} name - Theme name
   */
  switchTheme(name) {
    // Disable dark mode CSS for non-default themes
    if (name !== 'default') {
      document.getElementById('dark-mode-css')?.setAttribute('disabled', 'true');
    }

    // Remove all theme classes
    document.body.classList.remove(...UserTab.THEME_CLASSES);

    // Remove theme stylesheets
    document.querySelectorAll('link[data-premium-theme]').forEach(l => l.remove());

    // Clean up matrix rain
    const rain = document.querySelector('.matrix-rain-container');
    if (rain) rain.remove();
    if (window.matrixRain) window.matrixRain.destroy();

    localStorage.setItem('activeTheme', name);

    // Handle default theme
    if (name === 'default') {
      document.getElementById('dark-mode-css')?.removeAttribute('disabled');
      return;
    }

    // Apply premium theme
    document.body.classList.add(name);
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `./CSS/Skins/${name}.css`;
    link.setAttribute('data-premium-theme', name);
    document.head.appendChild(link);

    // Initialize matrix rain if needed
    if (name === 'matrix-code') {
      if (window.matrixRain) window.matrixRain.init();
      if (window.app?.initMatrixRain) {
        setTimeout(() => window.app.initMatrixRain(), UserTab.CONFIG.THEME_INIT_DELAY);
      }
    }
  }

  /** Load saved theme from localStorage */
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

  /** Restore dark mode state from localStorage */
  restoreDarkMode() {
    const dark = localStorage.getItem('darkMode') === 'enabled';
    document.body.classList.toggle('dark-mode', dark);
    
    const link = document.getElementById('dark-mode-css');
    const toggle = document.getElementById('dark-mode-toggle');
    
    if (link) link.disabled = !dark;
    if (toggle) toggle.checked = dark;
  }

  // ============== NOTIFICATIONS ==============

  async attachNotificationsHandlers() {
    await this.hydrateNotificationSettings();

    const master = document.getElementById('master-notifications-toggle');
    const options = document.getElementById('notification-options');
    const startTime = document.getElementById('notification-start-time');
    const endTime = document.getElementById('notification-end-time');
    const frequency = document.getElementById('notification-frequency');
    const timezoneDisplay = document.getElementById('timezone-display');

    let saveTimeout;

    // Display detected timezone
    if (timezoneDisplay) {
      timezoneDisplay.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveNotificationSettings(), UserTab.CONFIG.AUTOSAVE_DELAY);
    };

    const checkWindowSize = () => {
      if (!startTime?.value || !endTime?.value) return;
      
      const diffHours = this.calculateTimeWindowHours(startTime.value, endTime.value);
      const warning = document.getElementById('frequency-warning');
      
      if (warning) {
        warning.style.display = 
          (diffHours < UserTab.CONFIG.MIN_NOTIFICATION_WINDOW && frequency.value === 'full') 
          ? 'block' 
          : 'none';
      }
    };

    // Master toggle handler
    master?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.enablePushNotifications();
        if (!granted) {
          e.target.checked = false;
          return;
        }
        this.toggleNotificationOptions(options, true);
      } else {
        await this.disablePushNotifications();
        this.toggleNotificationOptions(options, false);
      }
      autoSave();
    });

    // Time window handlers
    startTime?.addEventListener('change', () => {
      if (this.validateTimeWindow(startTime, endTime)) {
        checkWindowSize();
        autoSave();
      }
    });

    endTime?.addEventListener('change', () => {
      if (this.validateTimeWindow(startTime, endTime)) {
        checkWindowSize();
        autoSave();
      }
    });

    // Frequency handler
    frequency?.addEventListener('change', () => {
      checkWindowSize();
      autoSave();
    });

    // Manual save button
    this.attachListener('save-notification-settings', 'click', () => {
      if (this.validateTimeWindow(startTime, endTime)) {
        clearTimeout(saveTimeout);
        this.saveNotificationSettings();
      }
    });

    checkWindowSize();
  }

  /**
   * Calculate hours between two time strings
   * @param {string} start - Start time (HH:MM)
   * @param {string} end - End time (HH:MM)
   * @returns {number} Hours difference
   */
  calculateTimeWindowHours(start, end) {
    const toMinutes = time => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
    return (toMinutes(end) - toMinutes(start)) / 60;
  }

  /**
   * Validate notification time window
   * @param {HTMLInputElement} startTime - Start time input
   * @param {HTMLInputElement} endTime - End time input
   * @returns {boolean} Whether window is valid
   */
  validateTimeWindow(startTime, endTime) {
    if (!startTime?.value || !endTime?.value) return true;

    const startMin = this.timeToMinutes(startTime.value);
    const endMin = this.timeToMinutes(endTime.value);
    const isValid = startMin < endMin;

    const warning = document.getElementById('time-validation-warning');
    if (warning) warning.style.display = isValid ? 'none' : 'block';
    
    if (!isValid) {
      this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Start time must be before end time', 'warning');
    }

    return isValid;
  }

  /**
   * Convert time string to minutes
   * @param {string} time - Time string (HH:MM)
   * @returns {number} Minutes since midnight
   */
  timeToMinutes(time) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  /**
   * Toggle notification options visibility
   * @param {HTMLElement} options - Options container
   * @param {boolean} enabled - Whether enabled
   */
  toggleNotificationOptions(options, enabled) {
    if (!options) return;
    options.style.opacity = enabled ? '1' : '.4';
    options.style.pointerEvents = enabled ? 'auto' : 'none';
  }

  /** Enable push notifications */
  async enablePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Push not supported', 'error');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Permission denied', 'error');
        return false;
      }

      const sw = await navigator.serviceWorker.ready;
      let sub = await sw.pushManager.getSubscription();

      if (!sub) {
        const VAPID = typeof ENV_VAPID_KEY !== 'undefined' 
          ? ENV_VAPID_KEY 
          : 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc';
        
        sub = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(VAPID)
        });

        const payload = {
          ...sub.toJSON(),
          user_id: this.currentUser?.id || null
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

      this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Notifications enabled', 'success');
      return true;
    } catch (err) {
      console.error(err);
      this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Enable failed: ' + err.message, 'error');
      return false;
    }
  }

  /** Disable push notifications */
  async disablePushNotifications() {
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      
      if (sub) {
        await sub.unsubscribe();
        this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/></svg> Notifications disabled', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Convert base64 VAPID key to Uint8Array
   * @param {string} base64 - Base64 encoded key
   * @returns {Uint8Array} Decoded key
   */
  urlBase64ToUint8Array(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const b64 = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
  }

  /** Save notification settings to localStorage and server */
  saveNotificationSettings() {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const settings = {
      enabled: document.getElementById('master-notifications-toggle')?.checked || false,
      window: {
        start: document.getElementById('notification-start-time')?.value || '07:00',
        end: document.getElementById('notification-end-time')?.value || '22:00'
      },
      frequency: document.getElementById('notification-frequency')?.value || 'minimum',
      timezone
    };

    localStorage.setItem('notification_settings', JSON.stringify(settings));

    supabase.from('notification_prefs')
      .upsert({
        user_id: this.currentUser.id,
        prefs: settings
      }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) {
          console.error('Save error:', error);
          this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Saved locally only', 'warning');
        } else {
          this.app.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Settings saved', 'success');
        }
      });
  }

  /** Fetch and restore notification settings */
  async hydrateNotificationSettings() {
    const uid = this.currentUser?.id;
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

  /**
   * Restore notification UI from settings
   * @param {Object} settings - Notification settings object
   */
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
      this.toggleNotificationOptions(options, settings.enabled);
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
      timezoneDisplay.textContent = settings.timezone || 
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }

  // ============== RULES ==============

  /**
   * Attach handlers for rules section (collapsible categories)
   * @param {HTMLElement} panel - Rules panel container
   */
  attachRulesHandlers(panel) {
    // Collapse buttons
    panel.querySelectorAll('.rules-collapse-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = panel.querySelector('#' + btn.dataset.target);
        const isOpen = btn.classList.contains('active');
        btn.classList.toggle('active', !isOpen);
        target.classList.toggle('show', !isOpen);
      });
    });

    // Category toggles
    panel.querySelectorAll('.rules-category-title').forEach(title => {
      title.addEventListener('click', () => {
        title.parentElement.classList.toggle('open');
      });
    });
  }

  // ============== ADMIN ==============

  /** Dynamically load admin panel module */
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

  // ============== PRICING MODAL ==============

  /** Show pricing modal with theme inheritance */
  showPricingModal() {
    const overlay = document.getElementById('pricing-modal-overlay');
    if (!overlay) return;

    // Apply current theme to modal
    const themeClass = [...UserTab.THEME_CLASSES].find(cls => 
      document.body.classList.contains(cls)
    );
    if (themeClass) overlay.classList.add(themeClass);

    // Apply dark mode if active
    if (document.body.classList.contains('dark-mode')) {
      overlay.classList.add('dark-mode');
    }

    overlay.classList.add('show');
    document.body.classList.add('blur-behind');
    this.attachPricingButtons(overlay);

    // Initialize mobile carousel
    if (window.innerWidth <= 768) {
      this.initMobileCarousel();
    }
  }

  /** Initialize mobile carousel for pricing cards */
  initMobileCarousel() {
    const container = document.getElementById('pricing-cards-container');
    const dots = document.querySelectorAll('.pricing-dot');
    const cards = container.querySelectorAll('.pricing-card');

    container.scrollTo({ left: 0, behavior: 'smooth' });

    // Update dots on scroll
    container.addEventListener('scroll', () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 20;
      const activeIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    });

    // Click dots to scroll
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth + 20;
        container.scrollTo({ left: cardWidth * i, behavior: 'smooth' });
      });
    });
  }

  /** Close pricing modal */
  closePricingModal() {
    const overlay = document.getElementById('pricing-modal-overlay');
    if (overlay) overlay.classList.remove('show');
    document.body.classList.remove('blur-behind');
  }

  /**
   * Attach pricing button handlers
   * @param {HTMLElement} overlay - Modal overlay element
   */
  attachPricingButtons(overlay) {
    overlay.querySelectorAll('.pricing-btn').forEach(btn =>
      btn.addEventListener('click', (e) => {
        const plan = e.currentTarget.dataset.plan;
        this.app.startCheckout(plan);
        this.closePricingModal();
      }, { once: true })
    );
  }

  // ============== STATUS ==============

  static STATUS_COLORS = {
    online:  '#6b9b37',
    available: '#6b9b37',
    away:    '#e53e3e',
    guiding: '#e53e3e',
    silent:  '#7c3aed',
    deep:    '#1e40af',
    offline: '#9ca3af',
  };

  /**
   * Update the status ring color around the avatar button
   * @param {string} status - Status key
   */
  updateStatusRing(status = 'offline') {
    const color = UserTab.STATUS_COLORS[status] || UserTab.STATUS_COLORS.offline;
    if (this.btn) {
      this.btn.style.setProperty('--status-ring-color', color);
      this.btn.classList.add('has-status-ring');
    }
    // Highlight the active status button in the picker (if open)
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });
  }

  /**
   * Set user status - updates ring, saves to Supabase, updates local state
   * @param {string} status - Status key
   * @param {string} color  - Hex color
   * @param {string} label  - Display label
   */
  async setStatus(status, color, label) {
    // Normalize: keep both field names in sync on the user object
    if (this.currentUser) {
      this.currentUser.community_status = status;
      this.currentUser.status = status; // core.js maps community_status → .status
    }
    this.updateStatusRing(status);

    // Highlight active button
    document.querySelectorAll('.status-option-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === status);
    });

    // Optimistic instant update: update own dot in Active Members grid immediately
    const uid = this.currentUser?.id;
    if (uid && window.ActiveMembers) {
      window.ActiveMembers.updateMemberStatus(uid, status);
    }

    const STATUS_ACTIVITIES = {
      online:    '✨ Available',
      available: '✨ Available',
      away:      '🌿 Away',
      silent:    '🤫 In Silence',
      deep:      '🧘 Deep Practice',
      offline:   '💤 Offline',
    };
    const activity = STATUS_ACTIVITIES[status] || '✨ Available';

    try {
      const uid = this.currentUser?.id;
      if (!uid) throw new Error('Not logged in');

      // Write to both tables so all listeners (presence + profile) stay in sync
      const writes = [
        supabase.from('profiles').update({ community_status: status }).eq('id', uid),
      ];
      // CommunityDB.setPresence updates community_presence table (what ActiveMembers reads)
      if (window.CommunityDB?.ready) {
        writes.push(
          window.CommunityDB.setPresence(
            status,
            activity,
            window.Core?.state?.currentRoom || null
          )
        );
      }
      const results = await Promise.all(writes);
      const profileErr = results[0]?.error;
      if (profileErr) throw profileErr;

      this.app.showToast(`Status set to ${label}`, 'success');
    } catch (err) {
      console.error('setStatus error:', err);
      this.app.showToast('Could not update status', 'error');
    }

    // Notify other modules (e.g. Community Hub Hero Profile)
    window.dispatchEvent(new CustomEvent('statusChanged', { detail: { status } }));
  }

  // ============== AVATAR SYNC ==============

  /** Synchronize avatar display in user button */
  syncAvatar() {
    const { avatar_url, emoji = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' } = this.currentUser || {};
    const avImg = this.btn?.querySelector('.disc-avatar-img');
    const avEmoji = this.btn?.querySelector('.disc-avatar-emoji');

    if (!avImg || !avEmoji) return;

    const hasAvatar = avatar_url?.trim();

    // Toggle visibility
    avImg.classList.toggle('hidden', !hasAvatar);
    avEmoji.classList.toggle('hidden', hasAvatar);
    this.btn.classList.toggle('avatar-mode', hasAvatar);

    // Set content
    if (hasAvatar) {
      avImg.src = avatar_url;
    } else {
      avEmoji.textContent = emoji;
    }
  }

  // ============== LOGOUT ==============

  /** Handle user logout */
  async handleLogout() {
    try {
      this.toggleDropdown(false);

      if (this.app && typeof this.app.logout === 'function') {
        await this.app.logout();
      } else {
        console.error('app.logout() not available');
        this.app?.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Logout failed', 'error');
      }
    } catch (err) {
      console.error('Logout error:', err);
      this.app?.showToast('<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Logout error', 'error');
    }
  }

  // ============== UTILITY METHODS ==============

  /**
   * Attach event listener with null safety
   * @param {string} selector - Element ID
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  attachListener(selector, event, handler, options = {}) {
    document.getElementById(selector)?.addEventListener(event, handler, options);
  }
}