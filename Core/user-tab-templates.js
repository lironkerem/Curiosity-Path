// user-tab-templates.js – Updated with new notification system 2026-01-13

export const MENU_ITEMS = [
  { id: 'profile',        icon: '👤', label: 'Profile' },
  { id: 'skins',          icon: '🎭', label: 'Skins' },
  { id: 'notifications',  icon: '🔔', label: 'Notifications' },
  { id: 'automations',    icon: '⚙️', label: 'Automations' },
  { id: 'about',          icon: 'ℹ️', label: 'About the App' },
  { id: 'rules',          icon: '📜', label: 'Rules' },
  { id: 'contact',        icon: '📧', label: 'Contact Me' },
  { id: 'export',         icon: '💾', label: 'Export Data' },
  { id: 'billing',        icon: '⬆️', label: 'Pricings' },
  { id: 'admin',          icon: '🔧', label: 'Admin Hacks', admin: true }
];

const EMOJI_LIST = '👤♈️♉️♊️♋️♌️♍️♎️♏️♐️♑️♒️♓️🧘‍♀️🌙☀️🌟🔮🦋🌿🌸🕉️🍀';

// cached emoji options
const EMOJI_OPTIONS = [...EMOJI_LIST].map(e => `<option value="${e}">${e}</option>`).join('');

const toggle = (id, label, checked = false, disabled = false) => `
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">${label}</span>
    <label class="toggle-switch">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
      <span class="toggle-slider"></span>
    </label>
  </div>`;

export const profile = (u = {}) => `
  <div class="accordion-inner">
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;">
      <label class="avatar-upload-label" title="Click to change picture">
        <input type="file" id="avatar-upload" accept="image/*">
        <div class="profile-avatar-container">
          <img id="profile-avatar-img" src="${u.avatar_url || ''}" style="${u.avatar_url ? '' : 'display:none;'}">
          <span class="profile-avatar-emoji" style="${u.avatar_url ? 'display:none;' : ''}">${u.emoji || '👤'}</span>
        </div>
      </label>
      <select id="profile-emoji">${EMOJI_OPTIONS.replace(`value="${u.emoji}"`,`value="${u.emoji}" selected`)}</select>
    </div>
    <input id="profile-name" type="text" maxlength="30" placeholder="Display name" value="${u.name || ''}">
    <input id="profile-email" type="email" placeholder="E-mail" value="${u.email || ''}">
    <input id="profile-phone" type="tel" placeholder="Phone" value="${u.phone || ''}">
    <input id="profile-birthday" type="date" value="${u.birthday || ''}">
    <button class="btn-link" id="save-profile-btn">Save changes</button>
  </div>`;

export const skins = (app) => {
  const activeTheme = localStorage.getItem('activeTheme') || 'default';
  const isDark = document.body.classList.contains('dark-mode');
  const hasChampagne = app.gamification?.state?.unlockedFeatures?.includes('luxury_champagne_gold_skin');
  const hasIndigo = app.gamification?.state?.unlockedFeatures?.includes('royal_indigo_skin');
  const hasEarth = app.gamification?.state?.unlockedFeatures?.includes('earth_luxury_skin');

  return `
    <div class="accordion-inner">
      ${toggle('dark-mode-toggle', '🌙 Dark Mode', isDark)}
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
      ${toggle('theme-default', 'Default (Neumorphic)', activeTheme === 'default').replace('id="theme-default"', 'class="theme-toggle" data-theme="default"')}
      ${toggle('theme-matrix', 'Escaping the Matrix', activeTheme === 'matrix-code').replace('id="theme-matrix"', 'class="theme-toggle" data-theme="matrix-code"')}
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
      <div class="toggle-switch-container ${hasChampagne ? '' : 'disabled'}" title="${hasChampagne ? '' : '🔒 Purchase in Karma Shop'}">
        <span class="toggle-switch-label">Champagne Gold ${hasChampagne ? '' : '🔒'}</span>
        <label class="toggle-switch">
          <input type="checkbox" class="theme-toggle" data-theme="champagne-gold" ${activeTheme === 'champagne-gold' ? 'checked' : ''} ${hasChampagne ? '' : 'disabled'}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="toggle-switch-container ${hasIndigo ? '' : 'disabled'}" title="${hasIndigo ? '' : '🔒 Purchase in Karma Shop'}">
        <span class="toggle-switch-label">Royal Indigo ${hasIndigo ? '' : '🔒'}</span>
        <label class="toggle-switch">
          <input type="checkbox" class="theme-toggle" data-theme="royal-indigo" ${activeTheme === 'royal-indigo' ? 'checked' : ''} ${hasIndigo ? '' : 'disabled'}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="toggle-switch-container ${hasEarth ? '' : 'disabled'}" title="${hasEarth ? '' : '🔒 Purchase in Karma Shop'}">
        <span class="toggle-switch-label">Earth Luxury ${hasEarth ? '' : '🔒'}</span>
        <label class="toggle-switch">
          <input type="checkbox" class="theme-toggle" data-theme="earth-luxury" ${activeTheme === 'earth-luxury' ? 'checked' : ''} ${hasEarth ? '' : 'disabled'}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
    </div>`;
};

export const notifications = () => {
  // Safe parsing with migration from old format
  let s;
  try {
    s = JSON.parse(localStorage.getItem('notification_settings'));
  } catch (e) {
    s = null;
  }

  // Migrate from old format or set defaults
  const settings = {
    enabled: s?.enabled || false,
    window: {
      start: s?.window?.start || '07:00',
      end: s?.window?.end || '22:00'
    },
    frequency: s?.frequency || 'minimum'
  };

  // Save migrated settings back
  localStorage.setItem('notification_settings', JSON.stringify(settings));

  return `
    <div class="accordion-inner">
      <div style="background:rgba(102,126,234,.1);border-radius:12px;padding:12px;margin-bottom:16px;">
        ${toggle('master-notifications-toggle', '🔔 Enable Notifications', s.enabled)}
        <small style="opacity:.7;display:block;margin-top:8px;">${s.enabled ? '✅ Enabled' : '⚠️ Enable to receive notifications'}</small>
      </div>

      <div id="notification-options" style="${settings.enabled ? '' : 'opacity:.4;pointer-events:none;'}">
        
        <div class="notification-section">
          <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;">⏰ Daily Availability Window</h4>
          <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">Set when you want to receive notifications each day</p>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
            <div>
              <label style="font-size:.85rem;display:block;margin-bottom:6px;">Start Time</label>
              <input type="time" id="notification-start-time" value="${settings.window.start}" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
            </div>
            <div>
              <label style="font-size:.85rem;display:block;margin-bottom:6px;">End Time</label>
              <input type="time" id="notification-end-time" value="${settings.window.end}" style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
            </div>
          </div>
          
          <small style="opacity:.7;display:block;font-size:.75rem;">⚠️ Start time must be before end time</small>
        </div>

        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">

        <div class="notification-section">
          <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;">📊 Notification Frequency</h4>
          <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">How many notifications per day?</p>
          
          <select id="notification-frequency" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-size:.9rem;">
            <option value="minimum" ${settings.frequency === 'minimum' ? 'selected' : ''}>Minimum (2 per day)</option>
            <option value="full" ${settings.frequency === 'full' ? 'selected' : ''}>Full (4 per day)</option>
          </select>
          
          <div style="margin-top:12px;padding:10px;background:rgba(0,0,0,.05);border-radius:8px;font-size:.8rem;">
            <strong style="display:block;margin-bottom:6px;">What you'll receive:</strong>
            <div style="opacity:.85;line-height:1.6;">
              ${settings.frequency === 'minimum' ? `
                <div>🌅 <strong>Morning:</strong> Energy log + daily cards</div>
                <div>🌙 <strong>Night:</strong> Energy log + journaling</div>
              ` : `
                <div>🌅 <strong>Morning:</strong> Energy log + daily cards</div>
                <div>☀️ <strong>Afternoon:</strong> Quick reset + practices</div>
                <div>🌆 <strong>Evening:</strong> Gratitude + inspiration</div>
                <div>🌙 <strong>Night:</strong> Energy log + journaling</div>
              `}
            </div>
          </div>
        </div>

        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">

        <button class="btn-link" id="save-notification-settings" style="margin-top:12px;">💾 Save Settings</button>
        <small style="opacity:.6;display:block;margin-top:8px;font-size:.7rem;text-align:center;">Auto-saves after changes</small>
        
        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
        
        <div style="padding:12px;background:rgba(102,126,234,.08);border-radius:8px;font-size:.8rem;">
          <strong style="display:block;margin-bottom:8px;">ℹ️ How it works:</strong>
          <ul style="margin:0;padding-left:20px;opacity:.85;line-height:1.6;">
            <li>Your daily window is divided into 4 time slots</li>
            <li>Each slot sends randomized, fresh messages</li>
            <li>Frequency controls how many slots are active</li>
            <li>Messages never repeat in the same way</li>
          </ul>
        </div>
      </div>
    </div>`;
};

export const automations = () => {
  const defaults = { selfReset: { enabled: false, interval: 60 }, fullBodyScan: { enabled: false, interval: 180 }, nervousSystem: { enabled: false, interval: 120 }, tensionSweep: { enabled: false, interval: 120 } };
  const a = { ...defaults, ...JSON.parse(localStorage.getItem('wellness_automations') || '{}') };
  const items = [
    { id: 'self-reset', name: '🧘 Self Reset', key: 'selfReset' },
    { id: 'full-body-scan', name: '🌊 Full Body Scan', key: 'fullBodyScan' },
    { id: 'nervous-system', name: '⚡ Nervous System Reset', key: 'nervousSystem' },
    { id: 'tension-sweep', name: '🌀 Tension Sweep', key: 'tensionSweep' }
  ];

  return `
    <div class="accordion-inner">
      <p style="font-size:.85rem;margin-bottom:12px;opacity:.8;">Enable automatic reminders for wellness practices</p>
      ${items.map(it => {
        const cfg = a[it.key];
        return `
        <div class="automation-group">
          <label class="automation-label">
            <input type="checkbox" id="auto-${it.id}" ${cfg.enabled ? 'checked' : ''}>
            <span>${it.name}</span>
          </label>
          <div class="automation-controls ${cfg.enabled ? '' : 'disabled'}">
            <label>Every <input type="number" id="interval-${it.id}" value="${cfg.interval}" min="15" max="480" step="15" ${cfg.enabled ? '' : 'disabled'}> minutes</label>
          </div>
        </div>`;
      }).join('')}
      <button class="btn-link" id="save-automations-btn">Save Settings</button>
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7;font-size:.75rem;">⚠️ Pop-up reminders while app is open</small>
    </div>`;
};

export const rules = () => {
  const categories = [
    { title: 'FIRST-WINS', badges: [{ icon: '🌱', name: 'First Step', desc: 'do any single action', xp: 10, karma: 3, rarity: 'common' }, { icon: '💚', name: 'First Gratitude', desc: 'log 1 gratitude entry', xp: 10, karma: 3, rarity: 'common' }, { icon: '📝', name: 'First Journal', desc: 'save 1 journal entry', xp: 10, karma: 3, rarity: 'common' }, { icon: '⚡', name: 'First Energy', desc: 'log 1 energy check-in', xp: 10, karma: 3, rarity: 'common' }, { icon: '🃏', name: 'First Reading', desc: 'complete 1 tarot spread', xp: 10, karma: 3, rarity: 'common' }, { icon: '🧘', name: 'First Meditation', desc: 'finish 1 meditation session', xp: 10, karma: 3, rarity: 'common' }, { icon: '🛒', name: 'First Purchase', desc: 'buy anything in Karma Shop', xp: 50, karma: 3, rarity: 'common' }] },
    { title: 'GRATITUDE', badges: [{ icon: '❤️', name: 'Gratitude Warrior', desc: '30 entries', xp: 50, karma: 5, rarity: 'uncommon' }, { icon: '💕', name: 'Gratitude Legend', desc: '100 entries', xp: 100, karma: 10, rarity: 'rare' }, { icon: '💖', name: 'Gratitude Sage', desc: '200 entries', xp: 200, karma: 15, rarity: 'epic' }, { icon: '💘', name: 'Gratitude Titan', desc: '500 entries', xp: 500, karma: 30, rarity: 'legendary' }] },
    { title: 'JOURNAL', badges: [{ icon: '📔', name: 'Journal Keeper', desc: '20 entries', xp: 50, karma: 5, rarity: 'uncommon' }, { icon: '📚', name: 'Journal Master', desc: '75 entries', xp: 100, karma: 10, rarity: 'rare' }, { icon: '📖', name: 'Journal Sage', desc: '150 entries', xp: 200, karma: 15, rarity: 'epic' }, { icon: '📜', name: 'Journal Titan', desc: '400 entries', xp: 500, karma: 30, rarity: 'legendary' }] },
    { title: 'ENERGY', badges: [{ icon: '⚡', name: 'Energy Tracker', desc: '30 logs', xp: 50, karma: 5, rarity: 'uncommon' }, { icon: '🔋', name: 'Energy Sage', desc: '100 logs', xp: 100, karma: 10, rarity: 'rare' }, { icon: '🔌', name: 'Energy Titan', desc: '300 logs', xp: 300, karma: 15, rarity: 'epic' }, { icon: '⚡️', name: 'Energy Legend', desc: '600 logs', xp: 600, karma: 30, rarity: 'legendary' }] },
    { title: 'TAROT', badges: [{ icon: '🔮', name: 'Tarot Apprentice', desc: '10 spreads', xp: 25, karma: 3, rarity: 'common' }, { icon: '🃏', name: 'Tarot Mystic', desc: '25 spreads', xp: 50, karma: 5, rarity: 'uncommon' }, { icon: '🌙', name: 'Tarot Oracle', desc: '75 spreads', xp: 100, karma: 10, rarity: 'rare' }, { icon: '🧙', name: 'Tarot Sage', desc: '150 spreads', xp: 200, karma: 15, rarity: 'epic' }, { icon: '🔮', name: 'Tarot Titan', desc: '400 spreads', xp: 500, karma: 30, rarity: 'legendary' }] },
    { title: 'MEDITATION', badges: [{ icon: '🧘', name: 'Meditation Devotee', desc: '20 sessions', xp: 50, karma: 5, rarity: 'uncommon' }, { icon: '🕉️', name: 'Meditation Master', desc: '60 sessions', xp: 100, karma: 10, rarity: 'rare' }, { icon: '🧘‍♂️', name: 'Meditation Sage', desc: '100 sessions', xp: 300, karma: 15, rarity: 'epic' }, { icon: '🧘‍♀️', name: 'Meditation Titan', desc: '200 sessions', xp: 700, karma: 30, rarity: 'legendary' }] },
    { title: 'STREAKS', badges: [{ icon: '⭐', name: 'Perfect Week', desc: '7 days all quests', xp: 75, karma: 10, rarity: 'rare' }, { icon: '💎', name: 'Dedication', desc: '30-day login', xp: 100, karma: 15, rarity: 'epic' }, { icon: '🔱', name: 'Unstoppable', desc: '60-day login', xp: 150, karma: 15, rarity: 'epic' }, { icon: '👑', name: 'Legendary Streak', desc: '100-day login', xp: 200, karma: 30, rarity: 'legendary' }] }
  ];
  const rc = { common: '#9ca3af', uncommon: '#10b981', rare: '#3b82f6', epic: '#a855f7', legendary: '#f59e0b' };

  return `
<div class="accordion-inner rules-panel">
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
  </div>
  <button class="rules-collapse-btn" data-target="currency-block">XP & Karma</button>
  <div id="currency-block" class="rules-collapse-content">
    <div class="rules-legend">
      <span class="rules-legend-xp">XP = experience</span>
      <span class="rules-legend-karma">Karma = currency</span>
    </div>
    <div class="rules-currency">
      <div class="rules-currency-block">
        <div class="rules-currency-title">Rules</div>
        <ul><li>XP levels you up</li><li>Karma buys features</li></ul>
      </div>
      <div class="rules-currency-block">
        <div class="rules-currency-title">Levels</div>
        <table class="rules-level-table">
          ${[['Seeker', 0], ['Practitioner', 300], ['Adept', 800], ['Healer', 1600], ['Master', 3200], ['Sage', 6500], ['Enlightened', 20000], ['Buddha', 50000], ['Light', 150000], ['Emptiness', 400000]].map((l, i) => `<tr><td>L${i + 1} – ${l[0]}</td><td>${l[1].toLocaleString()}</td></tr>`).join('')}
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
          <div class="rules-card-tag" style="color:${rc[b.rarity]}">${b.rarity}</div>
        </div>`).join('')}
      </div>
    </section>`).join('')}
  </div>
</div>`;
};

export const about = () => `<div class="accordion-inner"><p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p><p>A digital way for practitioners to continue Spirituality in the 21st Century.</p><p>Built to share tools, practices and ancient wisdom - digitally, from your device.</p></div>`;

export const contact = () => `<div class="accordion-inner"><p>Contact for questions, sessions, classes, retreats or technical issues.</p><a href="https://lironkerem.wixsite.com/project-curiosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Official website</a><br><a href="mailto:lironkerem@gmail.com" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Email me</a><br><a href="https://www.facebook.com/AanandohamsProjectCuriosity" target="_blank" style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">Facebook Page</a></div>`;

export const exportData = () => `<div class="accordion-inner"><button class="btn-link" onclick="window.app.exportUserData()">Download JSON</button></div>`;

export const admin = () => `
  <div class="accordion-inner">
    <div id="admin-tab-mount" style="min-height: 100px;">
      <div style="text-align:center;padding:20px;opacity:.7;">
        Click to load admin panel...
      </div>
    </div>
  </div>`;

export const billing = () => ``;

export const pricingModal = () => `
  <div id="pricing-modal-overlay" class="pricing-overlay">
    <div class="pricing-modal">
      <button class="pricing-close" aria-label="Close">✕</button>

      <h2 class="pricing-title">Choose Your Path</h2>
      <p class="pricing-sub">Unlock deeper features and support the journey.</p>

      <div class="pricing-cards" id="pricing-cards-container">

        <div class="pricing-card" data-plan="free">
          <div class="pricing-badge">Free</div>
          <h3>Seeker</h3>
          <div class="pricing-price">$0</div>
          <ul>
            <li>Core gratitude & journal</li>
            <li>Daily energy check-ins</li>
            <li>Tarot & meditation</li>
            <li>Ad-free experience</li>
          </ul>
          <button class="pricing-btn" data-plan="free">Current Plan</button>
        </div>

        <div class="pricing-card featured" data-plan="practitioner">
          <div class="pricing-badge popular">Most Popular</div>
          <h3>Practitioner</h3>
          <div class="pricing-price">$8<span>/month</span></div>
          <ul>
            <li>Everything in Seeker</li>
            <li>Advanced automations</li>
            <li>Premium skins & themes</li>
            <li>Cloud backup & sync</li>
          </ul>
          <button class="pricing-btn primary" data-plan="practitioner">Upgrade</button>
        </div>

        <div class="pricing-card" data-plan="master">
          <div class="pricing-badge">Adept</div>
          <h3>Master</h3>
          <div class="pricing-price">$20<span>/month</span></div>
          <ul>
            <li>Everything in Practitioner</li>
            <li>1-on-1 monthly call</li>
            <li>Custom wellness plans</li>
            <li>Priority support</li>
          </ul>
          <button class="pricing-btn" data-plan="master">Upgrade</button>
        </div>

      </div>
      
      <div class="pricing-carousel-dots" id="pricing-dots">
        <span class="pricing-dot active"></span>
        <span class="pricing-dot"></span>
        <span class="pricing-dot"></span>
      </div>

      <p class="pricing-foot">Cancel or change anytime in <strong>Settings → Billing</strong></p>
    </div>
  </div>`;