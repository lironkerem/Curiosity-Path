/**
 * user-tab-templates.js
 * HTML template generators for user menu sections.
 */

import { BADGE_CATEGORIES, LEVEL_PROGRESSION, RARITY_COLORS } from './user-tab-data.js';
import { AVATAR_ICONS, renderAvatarIcon, EMOJI_TO_KEY }        from './avatar-icons.js';

// ─── XSS helper ───────────────────────────────────────────────────────────────

/** Escape a value for safe use in HTML attribute or text context */
function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Safe localStorage ────────────────────────────────────────────────────────

const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } }
};

// ─── Menu configuration ───────────────────────────────────────────────────────

export const MENU_ITEMS = [
  { id: 'profile',       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',                                                                                                                                                                                                                                                                                           label: 'Profile'       },
  { id: 'skins',         icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2z"/><path d="M6 11c1.5 0 3 .5 3 2"/><path d="M18 11c-1.5 0-3 .5-3 2"/></svg>',                                                                                                                                                                                                                                    label: 'Skins'         },
  { id: 'notifications', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',                                                                                                                                                                                                                                                                                       label: 'Notifications' },
  { id: 'about',         icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',                                                                                                                                                                                                                                                                               label: 'About the App' },
  { id: 'rules',         icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',                                                                                                                                                                                                                                                                                   label: 'Rules'         },
  { id: 'contact',       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',                                                                                                                                                                                                                                                                 label: 'Contact Me'    },
  { id: 'export',        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',                                                                                                                                                                                                                                       label: 'Export Data'   },
  { id: 'billing',       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>',                                                                                                                                                                                                                                                                                                                    label: 'Pricings'      }
];

// ─── Avatar icon picker ───────────────────────────────────────────────────────

// Built once at module load — keys are controlled strings, safe for data-value
const ICON_PICKER_OPTIONS = Object.keys(AVATAR_ICONS)
  .map(key => `<button type="button" class="avatar-icon-btn" data-value="${esc(key)}" title="${esc(key)}" aria-label="${esc(key)}">${AVATAR_ICONS[key]}</button>`)
  .join('');

// ─── Utility components ───────────────────────────────────────────────────────

const toggle = (id, label, checked = false, disabled = false) => `
  <div class="toggle-switch-container">
    <span class="toggle-switch-label" id="label-${esc(id)}">${label}</span>
    <label class="toggle-switch">
      <input type="checkbox" id="${esc(id)}" aria-labelledby="label-${esc(id)}"
             ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
      <span class="toggle-slider"></span>
    </label>
  </div>`;

const timeInput = (id, label, value) => `
  <div>
    <label for="${esc(id)}" style="font-size:.85rem;display:block;margin-bottom:6px;">${esc(label)}</label>
    <input type="time" id="${esc(id)}" value="${esc(value)}"
           style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
  </div>`;

const notificationSection = content => `<div class="notification-section">${content}</div>`;

// ─── Profile section ──────────────────────────────────────────────────────────

export const profile = (u = {}) => `
  <div class="accordion-inner">
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;">
      <label class="avatar-upload-label" title="Click to change picture">
        <input type="file" id="avatar-upload" accept="image/*" aria-label="Upload profile picture">
        <div class="profile-avatar-container">
          <img
            id="profile-avatar-img"
            src="${esc(u.avatar_url || '')}"
            alt="Profile avatar"
            width="80" height="80"
            loading="lazy" decoding="async"
            style="${u.avatar_url ? '' : 'display:none;'}">
          <span class="profile-avatar-emoji" style="${u.avatar_url ? 'display:none;' : ''}" aria-hidden="true">
            ${renderAvatarIcon(u.emoji || 'user')}
          </span>
        </div>
      </label>
      <input type="hidden" id="profile-emoji" value="${esc(EMOJI_TO_KEY[u.emoji] || u.emoji || 'user')}">
      <button type="button" class="btn" id="open-icon-picker-btn" style="margin-top:4px;font-size:0.85rem;padding:6px 16px;">
        Choose Icon
      </button>
    </div>

    <!-- Icon Picker Modal -->
    <div id="icon-picker-modal" role="dialog" aria-modal="true" aria-label="Choose your icon"
         style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
      <div style="background:var(--neuro-bg);border-radius:var(--radius-lg);padding:1.5rem;max-width:360px;width:90%;box-shadow:var(--shadow-raised-lg);max-height:80vh;display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:1rem;" id="icon-picker-title">Choose your Icon</strong>
          <button type="button" id="close-icon-picker-btn" aria-label="Close icon picker"
                  style="background:none;border:none;cursor:pointer;font-size:0.85rem;color:var(--neuro-text);padding:4px 8px;border-radius:6px;line-height:1;">✕</button>
        </div>
        <div class="avatar-icon-picker" id="avatar-icon-picker" role="listbox" aria-labelledby="icon-picker-title" style="overflow-y:auto;max-height:55vh;">
          ${ICON_PICKER_OPTIONS}
        </div>
      </div>
    </div>

    <!-- Profile fields — values escaped to prevent XSS -->
    <label for="profile-name" class="sr-only">Display name</label>
    <input id="profile-name"    type="text"  maxlength="100" placeholder="Display name" value="${esc(u.name     || '')}">
    <label for="profile-email" class="sr-only">Email</label>
    <input id="profile-email"   type="email" maxlength="254" placeholder="E-mail"       value="${esc(u.email    || '')}">
    <label for="profile-phone" class="sr-only">Phone</label>
    <input id="profile-phone"   type="tel"   maxlength="20"  placeholder="Phone"        value="${esc(u.phone    || '')}">
    <label for="profile-birthday" class="sr-only">Birthday</label>
    <input id="profile-birthday" type="date"                                             value="${esc(u.birthday || '')}">
    <label for="profile-country" class="sr-only">Country</label>
    <input id="profile-country" type="text"  maxlength="60"  placeholder="Country"      value="${esc(u.country  || '')}">

    <button type="button" class="btn-link" id="save-profile-btn">Save changes</button>

    <!-- Status Picker -->
    <div class="status-picker-section">
      <div class="status-picker-label" id="status-picker-label">My Status</div>
      <div class="status-picker-options" role="radiogroup" aria-labelledby="status-picker-label">
        ${[
          { status: 'online',  color: '#6b9b37', label: 'Available'     },
          { status: 'away',    color: '#e53e3e', label: 'Away'           },
          { status: 'silent',  color: '#7c3aed', label: 'In Silence'    },
          { status: 'deep',    color: '#1e40af', label: 'Deep Practice' },
          { status: 'offline', color: '#9ca3af', label: 'Offline'       }
        ].map(s => `
          <button type="button" class="status-option-btn" role="radio" aria-checked="false"
                  data-status="${esc(s.status)}" data-color="${esc(s.color)}" data-label="${esc(s.label)}"
                  title="${esc(s.label)}">
            <span class="status-option-dot" style="background:${esc(s.color)};" aria-hidden="true"></span>
            <span class="status-option-text">${esc(s.label)}</span>
          </button>`).join('')}
      </div>
    </div>

    <!-- Delete Account -->
    <div class="delete-account-section">
      <button type="button" class="btn-delete-account" id="delete-account-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Delete Account
      </button>
    </div>
  </div>`;

// ─── Delete Account Modal ─────────────────────────────────────────────────────

export const deleteAccountModal = () => `
  <div id="delete-account-modal-overlay" class="delete-account-overlay"
       role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
    <div class="delete-account-modal">
      <div class="delete-account-modal-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h3 id="delete-account-title" class="delete-account-modal-title">Delete Your Account?</h3>
      <p class="delete-account-modal-body">
        This will permanently delete your profile, all your data, messages, and activity.<br>
        <strong>This cannot be undone.</strong>
      </p>
      <p class="delete-account-modal-confirm-label">Type <strong>DELETE</strong> to confirm:</p>
      <label for="delete-account-confirm-input" class="sr-only">Type DELETE to confirm account deletion</label>
      <input type="text" id="delete-account-confirm-input" class="delete-account-confirm-input"
             placeholder="DELETE" autocomplete="off" maxlength="6" aria-describedby="delete-account-title">
      <div class="delete-account-modal-actions">
        <button type="button" class="btn-delete-cancel"  id="delete-account-cancel-btn">Cancel</button>
        <button type="button" class="btn-delete-confirm" id="delete-account-confirm-btn" disabled aria-disabled="true">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Yes, Delete My Account
        </button>
      </div>
    </div>
  </div>`;

// ─── Skins section ────────────────────────────────────────────────────────────

export const skins = (app) => {
  const activeTheme  = ls.get('activeTheme') || 'default';
  const isDark       = document.body.classList.contains('dark-mode');
  const isPrivileged = app.state?.currentUser?.isAdmin || app.state?.currentUser?.isVip;

  const hasChampagne = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('luxury_champagne_gold_skin');
  const hasIndigo    = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('royal_indigo_skin');
  const hasEarth     = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('earth_luxury_skin');

  const moonIcon   = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  return `
    <div class="accordion-inner">
      ${toggle('dark-mode-toggle', `${moonIcon} Dark Mode`, isDark)}

      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
      ${toggle('theme-default', 'Default (Neumorphic)', activeTheme === 'default')
        .replace('id="theme-default"', 'class="theme-toggle" data-theme="default"')}
      ${toggle('theme-matrix', 'Escaping the Matrix', activeTheme === 'matrix-code')
        .replace('id="theme-matrix"', 'class="theme-toggle" data-theme="matrix-code"')}

      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
      ${premiumThemeToggle('champagne-gold', 'Champagne Gold', hasChampagne, activeTheme)}
      ${premiumThemeToggle('royal-indigo',   'Royal Indigo',   hasIndigo,    activeTheme)}
      ${premiumThemeToggle('earth-luxury',   'Earth Luxury',   hasEarth,     activeTheme)}

      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
    </div>`;
};

const premiumThemeToggle = (theme, label, unlocked, activeTheme) => {
  const lockSvg = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  return `
  <div class="toggle-switch-container${unlocked ? '' : ' disabled'}"
       title="${unlocked ? '' : 'Purchase in Karma Shop'}">
    <span class="toggle-switch-label">${esc(label)} ${unlocked ? '' : lockSvg}</span>
    <label class="toggle-switch">
      <input type="checkbox" class="theme-toggle" data-theme="${esc(theme)}"
             ${activeTheme === theme ? 'checked' : ''} ${unlocked ? '' : 'disabled'}
             aria-label="${esc(label)}${unlocked ? '' : ' (locked)'}">
      <span class="toggle-slider"></span>
    </label>
  </div>`;
};

// ─── Notifications section ────────────────────────────────────────────────────

export const notifications = () => {
  let s = null;
  try { s = JSON.parse(ls.get('notification_settings')); } catch { /* use defaults */ }

  const settings = {
    enabled:   s?.enabled || false,
    window:    { start: s?.window?.start || '07:00', end: s?.window?.end || '22:00' },
    frequency: s?.frequency || 'minimum',
    timezone:  s?.timezone  || Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Persist migrated settings
  ls.set('notification_settings', JSON.stringify(settings));

  const bellIcon    = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
  const checkIcon   = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  const warnIcon    = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  const saveIcon    = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

  return `
    <div class="accordion-inner">
      <div style="margin-bottom:16px;">
        ${toggle('master-notifications-toggle', `${bellIcon} Enable Notifications`, settings.enabled)}
        <small style="opacity:.7;display:block;margin-top:8px;" aria-live="polite">
          ${settings.enabled ? `${checkIcon} Enabled` : `${warnIcon} Enable to receive notifications`}
        </small>
      </div>

      <div id="notification-options" style="${settings.enabled ? '' : 'opacity:.4;pointer-events:none;'}" aria-hidden="${settings.enabled ? 'false' : 'true'}">
        ${renderTimezoneSection(settings.timezone)}
        ${renderTimeWindowSection(settings.window)}
        ${renderFrequencySection(settings.frequency)}

        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
        <button type="button" class="btn-link" id="save-notification-settings" style="margin-top:12px;">
          ${saveIcon} Save Settings
        </button>
        <small style="opacity:.6;display:block;margin-top:8px;font-size:.7rem;text-align:center;">
          Auto-saves after changes
        </small>
      </div>
    </div>`;
};

const renderTimezoneSection = tz => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:8px;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    Your Timezone
  </h4>
  <div style="padding:10px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:.85rem;opacity:.7;">Detected:</span>
      <strong id="timezone-display" style="font-size:.9rem;">${esc(tz)}</strong>
    </div>
    <small style="opacity:.6;display:block;margin-top:6px;font-size:.75rem;">Times below are in your local timezone</small>
  </div>`);

const renderTimeWindowSection = win => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    Daily Availability Window
  </h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">Set your Daily Window for Notifications</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
    ${timeInput('notification-start-time', 'Start Time', win.start)}
    ${timeInput('notification-end-time',   'End Time',   win.end)}
  </div>
  <small id="time-validation-warning" role="alert" aria-live="polite"
         style="opacity:.7;display:none;font-size:.75rem;color:#ff9800;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    Start time must be before end time
  </small>`);

const renderFrequencySection = freq => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    Notification Frequency
  </h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">How involved would you like to be?</p>
  <label for="notification-frequency" class="sr-only">Notification frequency</label>
  <select id="notification-frequency"
          style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-size:.9rem;">
    <option value="minimum" ${freq === 'minimum' ? 'selected' : ''}>Minimum (2 per day)</option>
    <option value="full"    ${freq === 'full'    ? 'selected' : ''}>Full (4 per day)</option>
  </select>
  <div id="frequency-warning" role="alert" aria-live="polite"
       style="display:none;margin-top:10px;padding:10px;background:rgba(255,152,0,.1);border-left:3px solid #ff9800;border-radius:6px;font-size:.8rem;">
    <strong style="color:#ff9800;">Short window detected</strong>
    <p style="margin:4px 0 0;opacity:.9;">Your window is less than 6 hours. FULL frequency may feel too frequent. Consider MINIMUM or extending your availability.</p>
  </div>
  ${renderFrequencyExplanation(freq)}`);

const renderFrequencyExplanation = freq => {
  const sunIcon  = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const awakeIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>';

  const items = freq === 'minimum'
    ? [`${awakeIcon} <strong>Awakening:</strong> Checking-in and Focusing`, `${moonIcon} <strong>Integration:</strong> Integrating the Day`]
    : [`${awakeIcon} <strong>Awakening:</strong> Checking-in and Focusing`, `${sunIcon} <strong>Recharge:</strong> Quick reset and Mindfulness`, `${awakeIcon} <strong>Reflect:</strong> Gratitude and Inspiration`, `${moonIcon} <strong>Integration:</strong> Integrating the Day`];

  return `
    <div style="margin-top:12px;padding:10px;background:rgba(0,0,0,.05);border-radius:8px;font-size:.8rem;">
      <strong style="display:block;margin-bottom:6px;">What you'll receive:</strong>
      <div style="opacity:.85;line-height:1.6;">${items.map(i => `<div>${i}</div>`).join('')}</div>
    </div>`;
};

// ─── Rules section ────────────────────────────────────────────────────────────

export const rules = () => `
  <div class="accordion-inner rules-panel">
    ${renderRulesHeader()}
    ${renderCurrencySection()}
    ${renderBadgesSection()}
  </div>`;

const renderRulesHeader = () => `
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
  </div>`;

const renderCurrencySection = () => `
  <button type="button" class="rules-collapse-btn" data-target="currency-block">XP &amp; Karma</button>
  <div id="currency-block" class="rules-collapse-content">
    <div class="rules-legend">
      <span class="rules-legend-xp">XP = experience</span>
      <span class="rules-legend-karma">Karma = currency</span>
    </div>
    <div class="rules-currency">
      <div class="rules-currency-block">
        <div class="rules-currency-title">Rules</div>
        <ul>
          <li>XP levels you up</li>
          <li>Karma buys features</li>
        </ul>
      </div>
      <div class="rules-currency-block">
        <div class="rules-currency-title">Levels</div>
        <table class="rules-level-table">
          ${LEVEL_PROGRESSION.map((level, i) => `
            <tr>
              <td>L${i + 1} – ${esc(level[0])}</td>
              <td>${Number(level[1]).toLocaleString()}</td>
            </tr>`).join('')}
        </table>
      </div>
    </div>
  </div>`;

const renderBadgesSection = () => `
  <button type="button" class="rules-collapse-btn" data-target="badges-block">Badges</button>
  <div id="badges-block" class="rules-collapse-content">
    ${BADGE_CATEGORIES.map(cat => renderBadgeCategory(cat)).join('')}
  </div>`;

const renderBadgeCategory = cat => `
  <section class="rules-category">
    <h4 class="rules-category-title">${esc(cat.title)}</h4>
    <div class="rules-grid">
      ${cat.badges.map(b => renderBadgeCard(b)).join('')}
    </div>
  </section>`;

const renderBadgeCard = badge => `
  <div class="rules-card" data-rarity="${esc(badge.rarity)}">
    <div class="rules-card-icon" aria-hidden="true">${badge.icon}</div>
    <div class="rules-card-body">
      <div class="rules-card-name">${esc(badge.name)}</div>
      <div class="rules-card-desc">${esc(badge.desc)}</div>
      <div class="rules-card-rewards">
        <span class="rules-xp">+${esc(badge.xp)} XP</span>
        <span class="rules-karma">+${esc(badge.karma)} Karma</span>
      </div>
    </div>
    <div class="rules-card-tag" style="color:${esc(RARITY_COLORS[badge.rarity] || '#9ca3af')}">
      ${esc(badge.rarity)}
    </div>
  </div>`;

// ─── Simple sections ──────────────────────────────────────────────────────────

export const about = () => `
  <div class="accordion-inner">
    <p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
    <p>Built to share tools, practices and ancient wisdom – digitally, from your device.</p>
  </div>`;

export const contact = () => `
  <div class="accordion-inner">
    <p>Contact for questions, sessions, classes, retreats or technical issues.</p>
    <a href="https://lironkerem.wixsite.com/project-curiosity"
       target="_blank" rel="noopener noreferrer"
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Official website
    </a><br>
    <a href="mailto:lironkerem@gmail.com"
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Email me
    </a><br>
    <a href="https://www.facebook.com/AanandohamsProjectCuriosity"
       target="_blank" rel="noopener noreferrer"
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Facebook Page
    </a>
  </div>`;

export const exportData = () => `
  <div class="accordion-inner">
    <button type="button" class="btn-link" data-action="export-data">Download JSON</button>
  </div>`;

export const billing = () => '';

// ─── Pricing modal ────────────────────────────────────────────────────────────

export const pricingModal = () => `
  <div id="pricing-modal-overlay" class="pricing-overlay"
       role="dialog" aria-modal="true" aria-labelledby="pricing-modal-title">
    <div class="pricing-modal">
      <button type="button" class="pricing-close" aria-label="Close pricing modal">✕</button>
      <h2 id="pricing-modal-title" class="pricing-title">Choose Your Path</h2>
      <p class="pricing-sub">Unlock deeper features and support the journey.</p>

      <div class="pricing-cards" id="pricing-cards-container">
        ${renderPricingCard('free',         'Seeker',       '$0',  ['Core gratitude &amp; journal','Daily energy check-ins','Tarot &amp; meditation','Ad-free experience'],                          false, 'Current Plan')}
        ${renderPricingCard('practitioner', 'Practitioner', '$8',  ['Everything in Seeker','Advanced automations','Premium skins &amp; themes','Cloud backup &amp; sync'],                          true,  'Upgrade'     )}
        ${renderPricingCard('master',       'Master',       '$20', ['Everything in Practitioner','1-on-1 monthly call','Custom wellness plans','Priority support'],                                  false, 'Upgrade'     )}
      </div>

      <div class="pricing-carousel-dots" id="pricing-dots" aria-hidden="true">
        <span class="pricing-dot active"></span>
        <span class="pricing-dot"></span>
        <span class="pricing-dot"></span>
      </div>

      <p class="pricing-foot">Cancel or change anytime in <strong>Settings → Billing</strong></p>
    </div>
  </div>`;

const renderPricingCard = (plan, title, price, features, featured, buttonText) => {
  const badge      = plan === 'free' ? 'Free' : plan === 'master' ? 'Adept' : 'Most Popular';
  const badgeClass = featured ? 'popular' : '';
  return `
    <div class="pricing-card${featured ? ' featured' : ''}" data-plan="${esc(plan)}">
      <div class="pricing-badge ${badgeClass}">${esc(badge)}</div>
      <h3>${esc(title)}</h3>
      <div class="pricing-price">${esc(price)}${plan !== 'free' ? '<span>/month</span>' : ''}</div>
      <ul>${features.map(f => `<li>${f}</li>`).join('')}</ul>
      <button type="button" class="pricing-btn${featured ? ' primary' : ''}" data-plan="${esc(plan)}">
        ${esc(buttonText)}
      </button>
    </div>`;
};
