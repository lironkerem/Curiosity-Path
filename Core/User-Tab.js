// User-Tab.js – Complete patched 2026-01-11
import { supabase } from './Supabase.js';
import * as Templates from './user-tab-templates.js';

export default class UserTab {
  constructor(app) {
    this.app = app;
    this.btn = null;
    this.dropdown = null;
    this.saveProfileLock = false;          // review fix – race guard
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
      else if (actionBtn?.dataset.action === 'logout') this.showLogoutModal();
    });

    this.btn = document.getElementById('user-menu-btn');
    if (!this.btn) return;

    this.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.btn.setAttribute('aria-expanded', !expanded);
      this.dropdown.classList.toggle('active');
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

    /* ----- pricing modal: insert & wire ----- */
    if (!document.getElementById('pricing-modal-overlay')) {
      document.body.insertAdjacentHTML('beforeend', Templates.pricingModal());
      const overlay  = document.getElementById('pricing-modal-overlay');
      const closeBtn = overlay.querySelector('.pricing-close');
      closeBtn.addEventListener('click', () => this.closePricingModal());
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closePricingModal();
      });
    }
  }

  handleSectionClick(section) {
    if (section === 'billing') {          // instant modal
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
      skins: () => { panel.innerHTML = Templates.skins(this.app); this.attachSkinsHandlers(); },   // renamed
      notifications: () => { panel.innerHTML = Templates.notifications(); this.attachNotificationsHandlers(); },
      automations: () => { panel.innerHTML = Templates.automations(); this.attachAutomationsHandlers(); },
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
      if (file.size > 5_242_880) {               // review fix – size guard
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

  // ============== SKINS  (was settings) =============
  attachSkinsHandlers() {                      // renamed handler
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

  // ============== NOTIFICATIONS =============
  async attachNotificationsHandlers() {
    await this.hydrateNotificationSettings();
    const master = document.getElementById('master-notifications-toggle');
    const options = document.getElementById('notification-options');
    let saveTimeout;

    const autoSave = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => this.saveNotificationSettings(), 1500);
    };

    master?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.enablePushNotifications();
        if (!granted) { e.target.checked = false; return; }
        options.style.opacity = '1'; options.style.pointerEvents = 'auto';
      } else {
        await this.disablePushNotifications();
        options.style.opacity = '.4'; options.style.pointerEvents = 'none';
      }
      autoSave();
    });

    ['morning', 'afternoon', 'evening', 'night'].forEach(p => {
      const toggle = document.getElementById(`reminder-${p}`);
      const time = document.getElementById(`time-${p}`);
      toggle?.addEventListener('change', (e) => { time.disabled = !e.target.checked; autoSave(); });
      time?.addEventListener('change', autoSave);
    });

    const quotes = document.getElementById('quotes-enabled');
    const affirmations = document.getElementById('affirmations-enabled');
    const freq = document.getElementById('inspirational-frequency');
    const updateFreq = () => {
      const any = quotes?.checked || affirmations?.checked;
      freq.disabled = !any; freq.parentElement.style.opacity = any ? '1' : '.4';
      freq.parentElement.style.pointerEvents = any ? 'auto' : 'none';
    };
    quotes?.addEventListener('change', () => { updateFreq(); autoSave(); });
    affirmations?.addEventListener('change', () => { updateFreq(); autoSave(); });
    freq?.addEventListener('change', autoSave);
    document.getElementById('wellness-notifications')?.addEventListener('change', autoSave);
    document.getElementById('save-notification-settings')?.addEventListener('click', () => {
      clearTimeout(saveTimeout); this.saveNotificationSettings();
    });
    document.getElementById('test-notification')?.addEventListener('click', () => this.sendTestNotification());
  }

  async enablePushNotifications() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      this.app.showToast('❌ Push not supported', 'error'); return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { this.app.showToast('❌ Permission denied', 'error'); return false; }
      const sw = await navigator.serviceWorker.ready;
      let sub = await sw.pushManager.getSubscription();
      if (!sub) {
        const VAPID = (typeof ENV_VAPID_KEY !== 'undefined' ? ENV_VAPID_KEY : 'BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc'); // env or fallback
        sub = await sw.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.urlBase64ToUint8Array(VAPID) });
        const payload = { ...sub.toJSON(), user_id: this.app.state?.currentUser?.id || null };
        const res = await fetch('/api/save-sub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.app.auth?.session?.access_token && { Authorization: `Bearer ${this.app.auth.session.access_token}` })
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Save failed');
      }
      this.app.showToast('✅ Notifications enabled', 'success'); return true;
    } catch (err) { console.error(err); this.app.showToast('❌ Enable failed: ' + err.message, 'error'); return false; }
  }

  async disablePushNotifications() {
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      if (sub) { await sub.unsubscribe(); this.app.showToast('🔕 Notifications disabled', 'success'); }
    } catch (e) { console.error(e); }
  }

  urlBase64ToUint8Array(base64) {
    const padding = '='.repeat((4 - base64.length % 4) % 4);
    const b64 = (base64 + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const raw = atob(b64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
  }

  saveNotificationSettings() {
    const settings = {
      enabled: document.getElementById('master-notifications-toggle')?.checked || false,
      reminders: {
        morning: { enabled: document.getElementById('reminder-morning')?.checked || false, time: document.getElementById('time-morning')?.value || '08:00' },
        afternoon: { enabled: document.getElementById('reminder-afternoon')?.checked || false, time: document.getElementById('time-afternoon')?.value || '13:00' },
        evening: { enabled: document.getElementById('reminder-evening')?.checked || false, time: document.getElementById('time-evening')?.value || '18:00' },
        night: { enabled: document.getElementById('reminder-night')?.checked || false, time: document.getElementById('time-night')?.value || '21:00' }
      },
      quotes: { enabled: document.getElementById('quotes-enabled')?.checked || false },
      affirmations: { enabled: document.getElementById('affirmations-enabled')?.checked || false },
      frequency: document.getElementById('inspirational-frequency')?.value || 'moderate',
      wellness: { enabled: document.getElementById('wellness-notifications')?.checked || false, automations: this.getWellnessAutomations() }
    };
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    supabase.from('notification_prefs')
      .upsert({ user_id: this.app.state.currentUser.id, prefs: settings }, { onConflict: 'user_id' })
      .then(({ error }) => {
        if (error) { console.error('Save error:', error); this.app.showToast('⚠️ Saved locally only', 'warning'); }
        else this.app.showToast('✅ Settings saved to server', 'success');
      });
  }

  getWellnessAutomations() {
    try {
      const stored = localStorage.getItem('wellness_automations');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          selfReset: { enabled: parsed.selfReset?.enabled || false, interval: parsed.selfReset?.interval || 60 },
          fullBodyScan: { enabled: parsed.fullBodyScan?.enabled || false, interval: parsed.fullBodyScan?.interval || 180 },
          nervousSystem: { enabled: parsed.nervousSystem?.enabled || false, interval: parsed.nervousSystem?.interval || 120 },
          tensionSweep: { enabled: parsed.tensionSweep?.enabled || false, interval: parsed.tensionSweep?.interval || 120 }
        };
      }
    } catch (e) { console.error('Parse error:', e); }
    return { selfReset: { enabled: false, interval: 60 }, fullBodyScan: { enabled: false, interval: 180 }, nervousSystem: { enabled: false, interval: 120 }, tensionSweep: { enabled: false, interval: 120 } };
  }

  async sendTestNotification() {
    try {
      const sw = await navigator.serviceWorker.ready;
      const sub = await sw.pushManager.getSubscription();
      if (!sub) return this.app.showToast('❌ No subscription found. Enable notifications first.', 'error');
      const SUPABASE_URL = 'https://qfbarhxfmzpgbgkaymuk.supabase.co';
      const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk';
      const response = await fetch(`${SUPABASE_URL}/functions/v1/push-cron/test-push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ sub: sub.toJSON(), payload: { title: '✨ The Curiosity Path', body: 'Test notification working perfectly!', icon: '/Icons/icon-192x192.png', data: { url: '/' } } })
      });
      if (response.ok) this.app.showToast('📱 Test sent! Check your device', 'success');
      else { const err = await response.json(); throw new Error(err.error || 'Send failed'); }
    } catch (err) { console.error(err); this.app.showToast('❌ Test failed: ' + err.message, 'error'); }
  }

  // ============== AUTOMATIONS =============
  attachAutomationsHandlers() {
    ['self-reset', 'full-body-scan', 'nervous-system', 'tension-sweep'].forEach(t => {
      const c = document.getElementById(`auto-${t}`);
      const i = document.getElementById(`interval-${t}`);
      const p = c?.closest('.automation-group')?.querySelector('.automation-controls');
      c?.addEventListener('change', (e) => { if (i) i.disabled = !e.target.checked; if (p) p.classList.toggle('disabled', !e.target.checked); });
    });
    document.getElementById('save-automations-btn')?.addEventListener('click', () => {
      const automations = {
        selfReset: { enabled: document.getElementById('auto-self-reset')?.checked || false, interval: parseInt(document.getElementById('interval-self-reset')?.value || 60) },
        fullBodyScan: { enabled: document.getElementById('auto-full-body-scan')?.checked || false, interval: parseInt(document.getElementById('interval-full-body-scan')?.value || 180) },
        nervousSystem: { enabled: document.getElementById('auto-nervous-system')?.checked || false, interval: parseInt(document.getElementById('interval-nervous-system')?.value || 120) },
        tensionSweep: { enabled: document.getElementById('auto-tension-sweep')?.checked || false, interval: parseInt(document.getElementById('interval-tension-sweep')?.value || 120) }
      };
      localStorage.setItem('wellness_automations', JSON.stringify(automations));
      this.saveNotificationSettings();          // keep wellness in sync
      this.app.showToast('✅ Automations saved & synced', 'success');
    });
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
  loadAdminPanel() {
    const mount = document.getElementById('admin-tab-mount');
    if (!mount) return;
    mount.innerHTML = '<div style="text-align:center;padding:20px;">Loading...</div>';
    import('./Admin-Tab.js')
      .then(({ AdminTab }) => import('./Supabase.js').then(({ supabase }) => new AdminTab(supabase).render()))
      .then(content => { mount.innerHTML = ''; mount.appendChild(content); })
      .catch(err => { mount.innerHTML = `<div style="color:#ff4757;padding:10px;">Failed: ${err.message}</div>`; });
  }

  // ============== PRICING MODAL =============
  showPricingModal() {
    const overlay = document.getElementById('pricing-modal-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
    document.body.classList.add('blur-behind');
    this.attachPricingButtons(overlay);
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
        this.app.startCheckout(plan);   // your existing handler
        this.closePricingModal();
      }, { once: true })
    );
  }

  // ============== AVATAR =============
  syncAvatar() {
    const u = this.app.state.currentUser || {};
    const avImg = this.btn.querySelector('.disc-avatar-img');
    const avEmoji = this.btn.querySelector('.disc-avatar-emoji');

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
  showLogoutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="neuro-modal modal-small">
        <div class="modal-header"><div class="modal-icon">🚪</div><h3 class="modal-title">Logout?</h3></div>
        <p class="modal-message">Are you sure?</p>
        <div class="modal-actions">
          <button class="btn" id="cancel-logout">Cancel</button>
          <button class="btn btn-primary" id="confirm-logout">Logout</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#cancel-logout').onclick = () => modal.remove();
    modal.querySelector('#confirm-logout').onclick = () => { modal.remove(); window.app.logout(); };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  // ============== SYNC HELPERS =============
  async hydrateNotificationSettings() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return;
    try {
      const { data, error } = await supabase.from('notification_prefs').select('prefs').eq('user_id', uid).single();
      if (data?.prefs) {
        localStorage.setItem('notification_settings', JSON.stringify(data.prefs));
        this.restoreNotificationUI(data.prefs);
      }
    } catch (e) { console.warn('Settings sync error:', e); }
  }

  restoreNotificationUI(settings) {
    if (!settings) return;
    const master = document.getElementById('master-notifications-toggle');
    if (master) {
      master.checked = settings.enabled || false;
      const options = document.getElementById('notification-options');
      if (options) { options.style.opacity = settings.enabled ? '1' : '.4'; options.style.pointerEvents = settings.enabled ? 'auto' : 'none'; }
    }
    ['morning', 'afternoon', 'evening', 'night'].forEach(period => {
      const config = settings.reminders?.[period]; if (!config) return;
      const toggle = document.getElementById(`reminder-${period}`); const time = document.getElementById(`time-${period}`);
      if (toggle) toggle.checked = config.enabled || false; if (time) { time.value = config.time || ''; time.disabled = !config.enabled; }
    });
    const quotes = document.getElementById('quotes-enabled'); const affirmations = document.getElementById('affirmations-enabled'); const freq = document.getElementById('inspirational-frequency');
    if (quotes) quotes.checked = settings.quotes?.enabled || false; if (affirmations) affirmations.checked = settings.affirmations?.enabled || false; if (freq) freq.value = settings.frequency || 'moderate';
    const wellness = document.getElementById('wellness-notifications'); if (wellness) wellness.checked = settings.wellness?.enabled || false;
  }
}