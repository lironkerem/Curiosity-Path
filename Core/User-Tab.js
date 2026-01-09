// User-Tab.js  –  production-ready, no build, no assert, no globals
// 2026-01-09  –  CSS moved to main-styles.css, data in user-tab-data.json

import { supabase } from './Supabase.js';

/* ----------  private JSON cache  ---------- */
let UDATA = null;
async function getData() {
  if (UDATA) return UDATA;                       // already cached
  const res = await fetch('./user-tab-data.json');
  UDATA = await res.json();
  return UDATA;
}

/* ----------  helpers that need data  ---------- */
async function renderRulesHTML() {
  const data = await getData();
  const rarityColour = data.rarityColour;
  const categories = data.badgeCategories;
  return `
<div class="accordion-inner rules-panel">
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way, for a digital practitioner, to continue practicing Spirituality in the 21st Century.</p>
    <p>This App was built to share tools, practices and ancient wisdom – digitally, from your device.</p>
    <p>It is a convenient, accessible way, to stay connected to your 'Self', by small daily practices.</p>
    <p>My hope is that you will utilize it to enhance your life, one small function at a time.</p>
  </div>
  <button class="rules-collapse-btn" data-target="currency-block">XP & Karma</button>
  <div id="currency-block" class="rules-collapse-content">
    <div class="rules-legend">
      <span class="rules-legend-xp">XP = experience points</span>
      <span class="rules-legend-karma">Karma = in-app currency</span>
    </div>
    <div class="rules-currency">
      <div class="rules-currency-block">
        <div class="rules-currency-title">Core Currency Rules</div>
        <ul>
          <li>XP is the only way to level up.</li>
          <li>Karma is spent in the Karma-Shop for enhancements, premium features and private sessions.</li>
        </ul>
      </div>
      <div class="rules-currency-block">
        <div class="rules-currency-title">Level & XP Rules</div>
        <table class="rules-level-table">
          <tr><td>Level 1 – Seeker</td><td>0</td></tr>
          <tr><td>Level 2 – Practitioner</td><td>300</td></tr>
          <tr><td>Level 3 – Adept</td><td>800</td></tr>
          <tr><td>Level 4 – Healer</td><td>1 600</td></tr>
          <tr><td>Level 5 – Master</td><td>3 200</td></tr>
          <tr><td>Level 6 – Sage</td><td>6 500</td></tr>
          <tr><td>Level 7 – Enlightened</td><td>20 000</td></tr>
          <tr><td>Level 8 – Buddha</td><td>50 000</td></tr>
          <tr><td>Level 9 – Light</td><td>150 000</td></tr>
          <tr><td>Level 10 – Emptiness</td><td>400 000</td></tr>
        </table>
      </div>
    </div>
  </div>
  <button class="rules-collapse-btn" data-target="badges-block">Badges</button>
  <div id="badges-block" class="rules-collapse-content">
    ${categories.map(cat => `
    <section class="rules-category">
      <h4 class="rules-category-title">${cat.title}</h4>
      <div class="rules-grid">
        ${cat.badges.map(b => `
        <div class="rules-card" data-rarity="${b.rarity}">
          <div class="rules-card-icon">${b.icon}</div>
          <div class="rules-card-body">
            <div class="rules-card-name">${b.name}</div>
            <div class="rules-card-desc">${b.desc}</div>
            <div class="rules-card-rewards">
              <span class="rules-xp">+${b.xp} XP</span>
              <span class="rules-karma">+${b.karma} Karma</span>
            </div>
          </div>
          <div class="rules-card-tag" style="color:${rarityColour[b.rarity[0]]}">${b.rarity}</div>
        </div>`).join('')}
      </div>
    </section>`).join('')}
  </div>
</div>`;
}

async function renderProfileHTML(u) {
  const data = await getData();
  const emojiOpts = data.emojis.map(e => `<option ${e===u.emoji?'selected':''} value="${e}">${e}</option>`).join('');
  return `
<div class="accordion-inner">
  <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;">
    <label class="avatar-upload-label" title="Click to change picture">
      <input type="file" id="avatar-upload" accept="image/*">
      <div class="profile-avatar-container" id="profile-avatar-preview">
        <img id="profile-avatar-img" src="${u.avatar_url || ''}" style="${u.avatar_url ? '' : 'display:none;'}">
        <span class="profile-avatar-emoji" style="${u.avatar_url ? 'display:none;' : ''}">${u.emoji || '👤'}</span>
      </div>
    </label>
    <select id="profile-emoji">${emojiOpts}</select>
  </div>
  <input id="profile-name" type="text" maxlength="30" placeholder="Display name" value="${u.name || ''}">
  <input id="profile-email" type="email" placeholder="E-mail" value="${u.email || ''}">
  <input id="profile-phone" type="tel" placeholder="Phone" value="${u.phone || ''}">
  <input id="profile-birthday" type="date" value="${u.birthday || ''}">
  <button class="btn-link" id="save-profile-btn">Save changes</button>
</div>`;
}

async function renderAutomationsHTML() {
  const data = await getData();
  const cfg = { ...data.automationDefaults, ...JSON.parse(localStorage.getItem('wellness_automations') || '{}') };
  const items = [
    { id: 'self-reset',      name: '🧘 Self Reset',           key: 'selfReset' },
    { id: 'full-body-scan',  name: '🌊 Full Body Scan',       key: 'fullBodyScan' },
    { id: 'nervous-system',  name: '⚡ Nervous System Reset', key: 'nervousSystem' },
    { id: 'tension-sweep',   name: '🌀 Tension Sweep',        key: 'tensionSweep' }
  ];
  return `
<div class="accordion-inner">
  <p style="font-size:0.85rem;margin-bottom:12px;opacity:0.8;">Enable automatic reminders for your wellness practices</p>
  ${items.map(it => `
  <div class="automation-group">
    <div class="automation-header">
      <label class="automation-label">
        <input type="checkbox" id="auto-${it.id}" ${cfg[it.key].enabled ? 'checked' : ''}>
        <span>${it.name}</span>
      </label>
    </div>
    <div class="automation-controls ${cfg[it.key].enabled ? '' : 'disabled'}">
      <label>Every <input type="number" id="interval-${it.id}" value="${cfg[it.key].min}" min="15" max="480" step="15" ${cfg[it.key].enabled ? '' : 'disabled'}> minutes</label>
    </div>
  </div>`).join('')}
  <button class="btn-link" id="save-automations-btn">Save Automation Settings</button>
  <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
  <small style="opacity:.7;font-size:0.75rem;">⚠️ Automations will trigger pop-up reminders at your chosen intervals while the app is open.</small>
</div>`;
}

/* ----------  the class  ---------- */
export default class UserTab {
  constructor(app) { this.app = app; this.btn = null; }

  /* ----------  template cache  ---------- */
  static #tpl = null;
  static #pool = document.createElement('div');
  render() {
    if (UserTab.#tpl) return UserTab.#tpl.cloneNode(true);
    UserTab.#pool.innerHTML = `
<div class="user-menu" id="user-menu">
  <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
    <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/></svg>
    <span class="disc-avatar"><img class="disc-avatar-img hidden" alt="avatar"><span class="disc-avatar-emoji">👤</span></span>
    <span class="disc-dot hidden"></span>
  </button>
  <div class="user-dropdown" id="user-dropdown" role="menu">
    <button class="dropdown-item" data-section="profile">👤 Profile</button>
    <div class="accordion-panel" id="panel-profile"></div>
    <button class="dropdown-item" data-section="settings">🎭 Skins</button>
    <div class="accordion-panel" id="panel-settings"></div>
    <button class="dropdown-item" data-section="notifications">🔔 Notifications</button>
    <div class="accordion-panel" id="panel-notifications"></div>
    <button class="dropdown-item" data-section="automations">⚙️ Automations</button>
    <div class="accordion-panel" id="panel-automations"></div>
    <button class="dropdown-item" data-section="about">ℹ️ About the App</button>
    <div class="accordion-panel" id="panel-about"></div>
    <button class="dropdown-item" data-section="rules">📜 Rules</button>
    <div class="accordion-panel" id="panel-rules"></div>
    <button class="dropdown-item" data-section="contact">📧 Contact Me</button>
    <div class="accordion-panel" id="panel-contact"></div>
    <button class="dropdown-item" data-section="export">💾 Export Data</button>
    <div class="accordion-panel" id="panel-export"></div>
    <button class="dropdown-item" data-section="billing">⬆️ Pricings</button>
    ${this.app.state.currentUser?.isAdmin ? `
    <button class="dropdown-item" data-section="admin">🔧 Admin Hacks</button>
    <div class="accordion-panel" id="panel-admin"></div>` : ''}
    <div class="dropdown-divider"></div>
    <button class="dropdown-item" data-action="logout">🚪 Logout</button>
  </div>
</div>`;
    UserTab.#tpl = UserTab.#pool.firstElementChild;
    return UserTab.#tpl.cloneNode(true);
  }

  /* ----------  profile  ---------- */
  async saveQuickProfile() {
    clearTimeout(this._profileDebounce);
    this._profileDebounce = setTimeout(async () => {
      const uid = this.app.state?.currentUser?.id;
      if (!uid) return this.app.showToast('Not logged in', 'error');
      const payload = {
        name:       document.getElementById('profile-name')?.value.trim()   || null,
        email:      document.getElementById('profile-email')?.value.trim()  || null,
        phone:      document.getElementById('profile-phone')?.value.trim()  || null,
        birthday:   document.getElementById('profile-birthday')?.value      || null,
        emoji:      document.getElementById('profile-emoji')?.value         || '👤',
        avatar_url: document.getElementById('profile-avatar-img')?.src || ''
      };
      let savedOnServer = false;
      try {
        const { error } = await supabase.from('profiles').upsert({ id: uid, ...payload }, { onConflict: 'id' });
        if (!error) savedOnServer = true;
      } catch (e) { console.warn('Profile server save failed', e); }
      localStorage.setItem(`profile_${uid}`, JSON.stringify(payload));
      Object.assign(this.app.state.currentUser, payload);
      this.syncAvatar();
      this.app.showToast(savedOnServer ? '✅ Profile saved & synced' : '⚠️ Saved locally (offline)', savedOnServer ? 'success' : 'warning');
    }, 600);
  }
  async hydrateUserProfile() {
    const uid = this.app.state?.currentUser?.id;
    if (!uid) return;
    const localKey = `profile_${uid}`;
    let data = null;
    try {
      const { data: row, error } = await supabase.from('profiles').select('*').eq('id', uid).single();
      if (!error && row) data = row;
    } catch (e) { console.warn('Profile fetch error', e); }
    if (!data) { try { data = JSON.parse(localStorage.getItem(localKey)); } catch (e) {} }
    if (data) {
      const target = this.app.state.currentUser;
      ['name','email','phone','birthday','emoji','avatar_url'].forEach(k => { if (data[k] !== undefined) target[k] = data[k]; });
      this.syncAvatar();
    }
  }

  /* ----------  other static HTML helpers  ---------- */
  renderAboutHTML() {
    return getData().then(data => `<div class="accordion-inner"><p>${data.aboutText}</p></div>`);
  }
  renderContactHTML() {
    return `<div class="accordion-inner">
      <p>Contact me for questions, private sessions, classes, retreats, guidance or any technical issues.</p>
      <a href="https://lironkerem.wixsite.com/project-curiosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Official website</a><br>
      <a href="mailto:lironkerem@gmail.com" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Email me</a><br>
      <a href="https://www.facebook.com/AanandohamsProjectCuriosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Facebook Page</a>
    </div>`;
  }
  renderExportHTML() {
    return `<div class="accordion-inner"><button class="btn-link" onclick="window.app.exportUserData()">Download JSON</button></div>`;
  }
  renderBillingHTML() {
    return `<div class="accordion-inner">
      <p><strong>Free</strong> - basic tools, ads free forever.</p>
      <p><strong>Practitioner</strong> - full Premium packs, monthly.</p>
      <p><strong>Adept</strong> - Premium packs + Sessions discounts, monthly.</p>
      <p><strong>Master</strong> - Premium packs + Discounts + 1-on-1 calls.</p>
      <button class="btn-link">Choose plan</button>
    </div>`;
  }
  renderAdminHTML() {
    return `<div class="accordion-inner" id="admin-panel-container"><div id="admin-tab-mount"></div></div>`;
  }
  renderSettingsHTML() {
    const activeTheme = localStorage.getItem('activeTheme') || 'default';
    const isDarkMode = document.body.classList.contains('dark-mode');
    const has = f => this.app.gamification?.state?.unlockedFeatures?.includes(f) || false;
    return `
<div class="accordion-inner">
  <div style="margin-bottom:16px;">
    <div class="toggle-switch-container">
      <span class="toggle-switch-label">🌙 Dark Mode</span>
      <label class="toggle-switch">
        <input type="checkbox" id="dark-mode-toggle" ${isDarkMode ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    </div>
  </div>
  <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
  <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">Default (Neumorphic)</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="default" ${activeTheme === 'default' ? 'checked' : ''}>
      <span class="toggle-slider"></span>
    </label>
  </div>
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">Escaping the Matrix</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="matrix-code" ${activeTheme === 'matrix-code' ? 'checked' : ''}>
      <span class="toggle-slider"></span>
    </label>
  </div>
  <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
  <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
  <div class="toggle-switch-container ${has('luxury_champagne_gold_skin') ? '' : 'disabled'}" title="${has('luxury_champagne_gold_skin') ? '' : '🔒 Purchase in Karma Shop to unlock'}">
    <span class="toggle-switch-label">Champagne Gold ${has('luxury_champagne_gold_skin') ? '' : '🔒'}</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="champagne-gold" ${activeTheme === 'champagne-gold' ? 'checked' : ''} ${has('luxury_champagne_gold_skin') ? '' : 'disabled'}>
      <span class="toggle-slider"></span>
    </label>
  </div>
  <div class="toggle-switch-container ${has('royal_indigo_skin') ? '' : 'disabled'}" title="${has('royal_indigo_skin') ? '' : '🔒 Purchase in Karma Shop to unlock'}">
    <span class="toggle-switch-label">Royal Indigo ${has('royal_indigo_skin') ? '' : '🔒'}</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="royal-indigo" ${activeTheme === 'royal-indigo' ? 'checked' : ''} ${has('royal_indigo_skin') ? '' : 'disabled'}>
      <span class="toggle-slider"></span>
    </label>
  </div>
  <div class="toggle-switch-container ${has('earth_luxury_skin') ? '' : 'disabled'}" title="${has('earth_luxury_skin') ? '' : '🔒 Purchase in Karma Shop to unlock'}">
    <span class="toggle-switch-label">Earth Luxury ${has('earth_luxury_skin') ? '' : '🔒'}</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="earth-luxury" ${activeTheme === 'earth-luxury' ? 'checked' : ''} ${has('earth_luxury_skin') ? '' : 'disabled'}>
      <span class="toggle-slider"></span>
    </label>
  </div>
  <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
  <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
</div>`;
  }

  /* ----------  init  ---------- */
  init() {
    // register helpers once
    if (!window.app.renderProfileHTML) {
      window.app.renderProfileHTML  = (u) => renderProfileHTML(u);
      window.app.renderRulesHTML    = () => renderRulesHTML();
      window.app.renderAboutHTML    = () => getData().then(d => `<div class="accordion-inner"><p>${d.aboutText}</p></div>`);
      window.app.renderContactHTML  = () => this.renderContactHTML();
      window.app.renderExportHTML   = () => this.renderExportHTML();
      window.app.renderBillingHTML  = () => this.renderBillingHTML();
      window.app.renderAdminHTML    = () => this.renderAdminHTML();
      window.app.renderSettingsHTML = () => this.renderSettingsHTML();
      window.app.renderAutomationsHTML = () => renderAutomationsHTML();
    }
    const dropdown = document.getElementById('user-dropdown');
    if (!dropdown) return;
    // single delegate
    dropdown.addEventListener('click', e => {
      const sec = e.target.closest('[data-section]');
      if (sec) this.openSection(sec.dataset.section);
      if (e.target.dataset.action === 'logout') this.showLogoutModal();
    });
    this.btn = document.getElementById('user-menu-btn');
    if (!this.btn) return;
    this.btn.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = this.btn.getAttribute('aria-expanded') === 'true';
      this.btn.setAttribute('aria-expanded', !expanded);
      dropdown.classList.toggle('active');
      this.syncAvatar();
      // prefetch other panels while menu open
      requestIdleCallback(() => {
        if (!UDATA) getData();          // JSON
        import('./renderRulesHTML.js'); // optional code-split
        import('./renderNotificationsHTML.js');
      }, { timeout: 2000 });
    });
    document.addEventListener('click', e => {
      if (!this.btn.contains(e.target) && !dropdown.contains(e.target)) {
        this.btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.btn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('active');
      }
    });
    this.syncAvatar();
    this.loadActiveTheme();
    this.restoreDarkMode();
    this.hydrateUserProfile();
  }

  async openSection(section) {
    const panel = document.getElementById(`panel-${section}`);
    const isOpen = panel.classList.contains('active');
    document.querySelectorAll('.accordion-panel').forEach(p => p.classList.remove('active'));
    if (!isOpen) {
      panel.classList.add('active');
      if (!panel.dataset.filled) {
        // async helpers
        if (section === 'profile')  panel.innerHTML = await window.app.renderProfileHTML(this.app.state.currentUser || {});
        else if (section === 'rules')    panel.innerHTML = await window.app.renderRulesHTML();
        else if (section === 'automations') panel.innerHTML = await window.app.renderAutomationsHTML();
        else panel.innerHTML = await window.app[`render${section.charAt(0).toUpperCase() + section.slice(1)}HTML`]();
        panel.dataset.filled = '1';
        if (section === 'profile')       this.attachProfileHandlers();
        if (section === 'settings')      this.attachSettingsHandlers();
        if (section === 'notifications') this.attachNotificationsHandlers();
        if (section === 'automations')   this.attachAutomationsHandlers();
      }
    }
  }

  attachProfileHandlers() {
    document.getElementById('profile-emoji')?.addEventListener('change', e => {
      document.querySelector('.profile-avatar-emoji').textContent = e.target.value;
      const img = document.getElementById('profile-avatar-img');
      if (img) { img.style.display = 'none'; document.querySelector('.profile-avatar-emoji').style.display = 'block'; }
    });
    document.getElementById('avatar-upload')?.addEventListener('change', () => this.liveAvatarPreview());
    document.getElementById('save-profile-btn')?.addEventListener('click', () => this.saveQuickProfile());
  }
  attachSettingsHandlers() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', e => {
        const activeTheme = localStorage.getItem('activeTheme') || 'default';
        const isChecked = e.target.checked;
        if (isChecked) document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', isChecked ? 'enabled' : 'disabled');
        if (activeTheme === 'default') {
          const darkLink = document.getElementById('dark-mode-css');
          if (darkLink) darkLink.disabled = !isChecked;
        }
        if (activeTheme === 'matrix-code' && window.app?.initMatrixRain) setTimeout(() => window.app.initMatrixRain(), 50);
      });
    }
    document.querySelectorAll('.theme-toggle').forEach(toggle => {
      toggle.addEventListener('change', e => {
        if (e.target.checked) {
          document.querySelectorAll('.theme-toggle').forEach(other => { if (other !== e.target) other.checked = false; });
          this.switchTheme(e.target.dataset.theme);
        } else e.target.checked = true;
      });
    });
  }
  attachNotificationsHandlers() {
    const masterToggle = document.getElementById('master-notifications-toggle');
    const optionsDiv = document.getElementById('notification-options');
    let saveTimeout;
    const autoSave = () => { clearTimeout(saveTimeout); saveTimeout = setTimeout(() => this.app.saveNotificationSettings(), 1500); };
    masterToggle?.addEventListener('change', async (e) => {
      if (e.target.checked) {
        const granted = await this.app.enablePushNotifications();
        if (!granted) { e.target.checked = false; return; }
        optionsDiv.style.opacity = '1'; optionsDiv.style.pointerEvents = 'auto';
      } else {
        await this.app.disablePushNotifications();
        optionsDiv.style.opacity = '.4'; optionsDiv.style.pointerEvents = 'none';
      }
      autoSave();
    });
    ['morning', 'afternoon', 'evening', 'night'].forEach(p => {
      const toggle = document.getElementById(`reminder-${p}`);
      const timeInput = document.getElementById(`time-${p}`);
      toggle?.addEventListener('change', e => { timeInput.disabled = !e.target.checked; autoSave(); });
      timeInput?.addEventListener('change', autoSave);
    });
    const quotesToggle = document.getElementById('quotes-enabled');
    const affirmationsToggle = document.getElementById('affirmations-enabled');
    const freqSelect = document.getElementById('inspirational-frequency');
    const updateFreq = () => { const any = quotesToggle?.checked || affirmationsToggle?.checked; freqSelect.disabled = !any; freqSelect.parentElement.style.opacity = any ? '1' : '.4'; freqSelect.parentElement.style.pointerEvents = any ? 'auto' : 'none'; };
    quotesToggle?.addEventListener('change', () => { updateFreq(); autoSave(); });
    affirmationsToggle?.addEventListener('change', () => { updateFreq(); autoSave(); });
    freqSelect?.addEventListener('change', autoSave);
    document.getElementById('wellness-notifications')?.addEventListener('change', autoSave);
    document.getElementById('save-notification-settings')?.addEventListener('click', () => { clearTimeout(saveTimeout); this.app.saveNotificationSettings(); });
    document.getElementById('test-notification')?.addEventListener('click', () => this.app.sendTestNotification());
  }
  attachAutomationsHandlers() {
    ['self-reset', 'full-body-scan', 'nervous-system', 'tension-sweep'].forEach(t => {
      const c = document.getElementById(`auto-${t}`);
      const i = document.getElementById(`interval-${t}`);
      const p = c?.closest('.automation-group')?.querySelector('.automation-controls');
      c?.addEventListener('change', e => { if (i) i.disabled = !e.target.checked; if (p) p.classList.toggle('disabled', !e.target.checked); });
    });
    document.getElementById('save-automations-btn')?.addEventListener('click', () => this.saveAutomations());
  }
  saveAutomations() {
    getData().then(data => {
      const cfg = {
        selfReset:      { enabled: document.getElementById('auto-self-reset')?.checked     || false, min: parseInt(document.getElementById('interval-self-reset')?.value      || data.automationDefaults.selfReset.min)  },
        fullBodyScan:   { enabled: document.getElementById('auto-full-body-scan')?.checked  || false, min: parseInt(document.getElementById('interval-full-body-scan')?.value  || data.automationDefaults.fullBodyScan.min) },
        nervousSystem:  { enabled: document.getElementById('auto-nervous-system')?.checked || false, min: parseInt(document.getElementById('interval-nervous-system')?.value || data.automationDefaults.nervousSystem.min) },
        tensionSweep:   { enabled: document.getElementById('auto-tension-sweep')?.checked  || false, min: parseInt(document.getElementById('interval-tension-sweep')?.value  || data.automationDefaults.tensionSweep.min) }
      };
      localStorage.setItem('wellness_automations', JSON.stringify(cfg));
      if (window.app.restartAutomations) window.app.restartAutomations();
      const notifSettings = JSON.parse(localStorage.getItem('notification_settings')) || {};
      if (notifSettings.enabled && notifSettings.wellness?.enabled) window.app.scheduleNotifications(notifSettings);
      this.app.showToast('✅ Automation settings saved!', 'success');
    });
  }
  liveAvatarPreview() {
    const file = document.getElementById('avatar-upload').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('profile-avatar-img');
      const emoji = document.querySelector('.profile-avatar-emoji');
      if (img) { img.src = e.target.result; img.style.display = 'block'; }
      if (emoji) emoji.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
  loadActiveTheme() {
    try {
      const t = localStorage.getItem('activeTheme');
      if (t && t !== 'default') setTimeout(() => this.switchTheme(t), 100);
    } catch (e) {
      console.warn(e);
      localStorage.setItem('activeTheme', 'default');
    }
  }
  switchTheme(themeName) {
    if (themeName !== 'default') {
      const darkLink = document.getElementById('dark-mode-css');
      if (darkLink) darkLink.disabled = true;
    }
    document.body.classList.remove('champagne-gold', 'royal-indigo', 'earth-luxury', 'matrix-code');
    document.querySelectorAll('link[data-premium-theme]').forEach(l => l.remove());
    const rain = document.querySelector('.matrix-rain-container');
    if (rain) rain.remove();
    localStorage.setItem('activeTheme', themeName);
    if (themeName === 'default') {
      const darkLink = document.getElementById('dark-mode-css');
      if (darkLink) darkLink.disabled = false;
      return;
    }
    document.body.classList.add(themeName);
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = `./Assets/CSS/${themeName}.css`; link.setAttribute('data-premium-theme', themeName);
    document.head.appendChild(link);
    if (themeName === 'matrix-code' && window.app?.initMatrixRain) setTimeout(() => window.app.initMatrixRain(), 100);
  }
  restoreDarkMode() {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved === 'enabled';
    if (isDark) {
      document.body.classList.add('dark-mode');
      const activeTheme = localStorage.getItem('activeTheme') || 'default';
      const darkLink = document.getElementById('dark-mode-css');
      if (darkLink) darkLink.disabled = (activeTheme !== 'default');
      const toggle = document.getElementById('dark-mode-toggle');
      if (toggle) toggle.checked = true;
    }
  }
  loadAdminPanel() {
    const mount = document.getElementById('admin-tab-mount');
    if (!mount) return;
    mount.innerHTML = '<div style="text-align:center;padding:20px;color:var(--neuro-text);">Loading admin panel...</div>';
    import('./Admin-Tab.js')
      .then(({ AdminTab }) => import('./Supabase.js').then(({ supabase }) => new AdminTab(supabase).render()))
      .then(content => { mount.innerHTML = ''; mount.appendChild(content); })
      .catch(err => { console.error(err); mount.innerHTML = '<div style="color:#ff4757;padding:10px;">Failed to load admin panel: ' + err.message + '</div>'; });
  }
  syncAvatar() {
    const u = this.app.state.currentUser || {};
    const img = this.btn.querySelector('.disc-avatar-img');
    const emoji = this.btn.querySelector('.disc-avatar-emoji');
    const dot = this.btn.querySelector('.disc-dot');
    if (u.avatar_url && u.avatar_url.trim() !== '') {
      img.src = u.avatar_url;
      img.classList.remove('hidden');
      emoji.classList.add('hidden');
      this.btn.classList.add('avatar-mode');
    } else {
      emoji.textContent = u.emoji || '👤';
      img.classList.add('hidden');
      emoji.classList.remove('hidden');
      this.btn.classList.remove('avatar-mode');
    }
    if (!dot.classList.contains('animate')) dot.classList.add('animate');
  }

  /* ----------  logout modal  ---------- */
  static #logoutTpl = null;
  showLogoutModal() {
    if (!UserTab.#logoutTpl) {
      UserTab.#pool.innerHTML = `
<div class="modal-overlay">
  <div class="neuro-modal modal-small">
    <div class="modal-header"><div class="modal-icon">🚪</div><h3 class="modal-title">Logout?</h3></div>
    <p class="modal-message">Are you sure you want to logout?</p>
    <div class="modal-actions">
      <button class="btn" id="cancel-logout">Cancel</button>
      <button class="btn btn-primary" id="confirm-logout">Logout</button>
    </div>
  </div>
</div>`;
      UserTab.#logoutTpl = UserTab.#pool.firstElementChild;
    }
    document.body.appendChild(UserTab.#logoutTpl.cloneNode(true));
    const modal = document.querySelector('.modal-overlay:last-of-type');
    modal.querySelector('#cancel-logout').onclick = () => modal.remove();
    modal.querySelector('#confirm-logout').onclick = () => { modal.remove(); window.app.logout(); };
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
  }
}