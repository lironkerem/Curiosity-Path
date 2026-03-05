/**
 * user-tab-templates.js – Optimized & Consolidated 2026-01-26
 * HTML template generators for user menu sections
 */

import { BADGE_CATEGORIES, LEVEL_PROGRESSION, RARITY_COLORS } from './user-tab-data.js';
import { AVATAR_ICONS, renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';

// ============== MENU CONFIGURATION ==============

export const MENU_ITEMS = [
  { id: 'profile', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Profile' },
  { id: 'skins', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2z"/><path d="M6 11c1.5 0 3 .5 3 2"/><path d="M18 11c-1.5 0-3 .5-3 2"/></svg>', label: 'Skins' },
  { id: 'notifications', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>', label: 'Notifications' },
  { id: 'about', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>', label: 'About the App' },
  { id: 'rules', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>', label: 'Rules' },
  { id: 'contact', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>', label: 'Contact Me' },
  { id: 'export', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>', label: 'Export Data' },
  { id: 'billing', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>', label: 'Pricings' },
  { id: 'admin', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', label: 'Admin Hacks', admin: true }
];

// ============== AVATAR ICON PICKER ==============

/**
 * Build SVG icon picker grid
 * Each item stores a key (e.g. 'moon') as its data-value
 */
const ICON_PICKER_OPTIONS = Object.keys(AVATAR_ICONS)
  .map(key => `<button type="button" class="avatar-icon-btn" data-value="${key}" title="${key}">${AVATAR_ICONS[key]}</button>`)
  .join('');

// ============== UTILITY COMPONENTS ==============

/**
 * Create a toggle switch component
 * @param {string} id - Input ID
 * @param {string} label - Display label
 * @param {boolean} checked - Initial checked state
 * @param {boolean} disabled - Whether disabled
 * @returns {string} HTML string
 */
const toggle = (id, label, checked = false, disabled = false) => `
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">${label}</span>
    <label class="toggle-switch">
      <input type="checkbox" id="${id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
      <span class="toggle-slider"></span>
    </label>
  </div>`;

/**
 * Create a time input field
 * @param {string} id - Input ID
 * @param {string} label - Display label
 * @param {string} value - Initial value
 * @returns {string} HTML string
 */
const timeInput = (id, label, value) => `
  <div>
    <label style="font-size:.85rem;display:block;margin-bottom:6px;">${label}</label>
    <input 
      type="time" 
      id="${id}" 
      value="${value}" 
      style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
  </div>`;

/**
 * Create a notification section wrapper
 * @param {string} content - Section content
 * @returns {string} HTML string
 */
const notificationSection = (content) => `
  <div class="notification-section">${content}</div>`;

// ============== PROFILE SECTION ==============

/**
 * Render user profile section
 * @param {Object} u - User object with profile data
 * @returns {string} HTML string
 */
export const profile = (u = {}) => `
  <div class="accordion-inner">
    <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:10px;">
      <label class="avatar-upload-label" title="Click to change picture">
        <input type="file" id="avatar-upload" accept="image/*">
        <div class="profile-avatar-container">
          <img 
            id="profile-avatar-img" 
            src="${u.avatar_url || ''}" 
            style="${u.avatar_url ? '' : 'display:none;'}">
          <span 
            class="profile-avatar-emoji" 
            style="${u.avatar_url ? 'display:none;' : ''}">
            ${u.emoji || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'}
          </span>
        </div>
      </label>
      <select id="profile-emoji">
        ${EMOJI_OPTIONS.replace(`value="${u.emoji}"`, `value="${u.emoji}" selected`)}
      </select>
    </div>
    <input 
      id="profile-name" 
      type="text" 
      maxlength="30" 
      placeholder="Display name" 
      value="${u.name || ''}">
    <input 
      id="profile-email" 
      type="email" 
      placeholder="E-mail" 
      value="${u.email || ''}">
    <input 
      id="profile-phone" 
      type="tel" 
      placeholder="Phone" 
      value="${u.phone || ''}">
    <input 
      id="profile-birthday" 
      type="date" 
      value="${u.birthday || ''}">
    <input
      id="profile-country"
      type="text"
      maxlength="60"
      placeholder="Country"
      value="${u.country || ''}">
    <button class="btn-link" id="save-profile-btn">Save changes</button>

    <!-- Status Picker -->
    <div class="status-picker-section">
      <div class="status-picker-label">My Status</div>
      <div class="status-picker-options">
        ${[
          { status: 'online',  color: '#6b9b37', icon: '🟢', label: 'Available'     },
          { status: 'away',    color: '#e53e3e', icon: '🔴', label: 'Away'           },
          { status: 'silent',  color: '#7c3aed', icon: '🟣', label: 'In Silence'    },
          { status: 'deep',    color: '#1e40af', icon: '🔵', label: 'Deep Practice' },
          { status: 'offline', color: '#9ca3af', icon: '⚫', label: 'Offline'       },
        ].map(s => `
          <button
            class="status-option-btn"
            data-status="${s.status}"
            data-color="${s.color}"
            data-label="${s.label}"
            title="${s.label}">
            <span class="status-option-dot" style="background:${s.color};"></span>
            <span class="status-option-text">${s.label}</span>
          </button>`).join('')}
      </div>
    </div>
  </div>`;

// ============== SKINS SECTION ==============

/**
 * Render skins/themes section
 * @param {Object} app - App instance for checking unlocked features
 * @returns {string} HTML string
 */
export const skins = (app) => {
  const activeTheme = localStorage.getItem('activeTheme') || 'default';
  const isDark = document.body.classList.contains('dark-mode');
  const isPrivileged = app.state?.currentUser?.isAdmin || app.state?.currentUser?.isVip;

  const hasChampagne = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('luxury_champagne_gold_skin');
  const hasIndigo = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('royal_indigo_skin');
  const hasEarth = isPrivileged || app.gamification?.state?.unlockedFeatures?.includes('earth_luxury_skin');

  return `
    <div class="accordion-inner">
      ${toggle('dark-mode-toggle', '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark Mode', isDark)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
      ${toggle('theme-default', 'Default (Neumorphic)', activeTheme === 'default')
        .replace('id="theme-default"', 'class="theme-toggle" data-theme="default"')}
      ${toggle('theme-matrix', 'Escaping the Matrix', activeTheme === 'matrix-code')
        .replace('id="theme-matrix"', 'class="theme-toggle" data-theme="matrix-code"')}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
      ${createPremiumThemeToggle('champagne-gold', 'Champagne Gold', hasChampagne, activeTheme)}
      ${createPremiumThemeToggle('royal-indigo', 'Royal Indigo', hasIndigo, activeTheme)}
      ${createPremiumThemeToggle('earth-luxury', 'Earth Luxury', hasEarth, activeTheme)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
    </div>`;
};

/**
 * Create a premium theme toggle (helper for skins section)
 * @param {string} theme - Theme name
 * @param {string} label - Display label
 * @param {boolean} unlocked - Whether user has unlocked this theme
 * @param {string} activeTheme - Currently active theme
 * @returns {string} HTML string
 */
const createPremiumThemeToggle = (theme, label, unlocked, activeTheme) => `
  <div class="toggle-switch-container ${unlocked ? '' : 'disabled'}" 
       title="${unlocked ? '' : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Purchase in Karma Shop'}">
    <span class="toggle-switch-label">${label} ${unlocked ? '' : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'}</span>
    <label class="toggle-switch">
      <input 
        type="checkbox" 
        class="theme-toggle" 
        data-theme="${theme}" 
        ${activeTheme === theme ? 'checked' : ''} 
        ${unlocked ? '' : 'disabled'}>
      <span class="toggle-slider"></span>
    </label>
  </div>`;

// ============== NOTIFICATIONS SECTION ==============

/**
 * Render notifications settings section
 * @returns {string} HTML string
 */
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
    frequency: s?.frequency || 'minimum',
    timezone: s?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Save migrated settings back
  localStorage.setItem('notification_settings', JSON.stringify(settings));

  return `
    <div class="accordion-inner">
      <div style="margin-bottom:16px;">
        ${toggle('master-notifications-toggle', '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Enable Notifications', settings.enabled)}
        <small style="opacity:.7;display:block;margin-top:8px;">
          ${settings.enabled ? '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Enabled' : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Enable to receive notifications'}
        </small>
      </div>

      <div id="notification-options" style="${settings.enabled ? '' : 'opacity:.4;pointer-events:none;'}">
        ${renderTimezoneSection(settings.timezone)}
        ${renderTimeWindowSection(settings.window)}
        ${renderFrequencySection(settings.frequency)}
        
        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">

        <button class="btn-link" id="save-notification-settings" style="margin-top:12px;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Settings
        </button>
        <small style="opacity:.6;display:block;margin-top:8px;font-size:.7rem;text-align:center;">
          Auto-saves after changes
        </small>
      </div>
    </div>`;
};

/**
 * Render timezone display section
 * @param {string} timezone - Detected timezone
 * @returns {string} HTML string
 */
const renderTimezoneSection = (timezone) => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:8px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Your Timezone</h4>
  <div style="padding:10px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:.85rem;opacity:.7;">Detected:</span>
      <strong id="timezone-display" style="font-size:.9rem;">${timezone}</strong>
    </div>
    <small style="opacity:.6;display:block;margin-top:6px;font-size:.75rem;">
      Times below are in your local timezone
    </small>
  </div>
`);

/**
 * Render time window configuration section
 * @param {Object} window - Time window object {start, end}
 * @returns {string} HTML string
 */
const renderTimeWindowSection = (window) => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Daily Availability Window</h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">
    Set your Daily Window for Notifications
  </p>
  
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
    ${timeInput('notification-start-time', 'Start Time', window.start)}
    ${timeInput('notification-end-time', 'End Time', window.end)}
  </div>
  
  <small 
    id="time-validation-warning" 
    style="opacity:.7;display:none;font-size:.75rem;color:#ff9800;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Start time must be before end time
  </small>
`);

/**
 * Render frequency selection section
 * @param {string} frequency - Current frequency setting
 * @returns {string} HTML string
 */
const renderFrequencySection = (frequency) => notificationSection(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Notification Frequency</h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">
    How involved would you like to be?
  </p>
  
  <select 
    id="notification-frequency" 
    style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-size:.9rem;">
    <option value="minimum" ${frequency === 'minimum' ? 'selected' : ''}>
      Minimum (2 per day)
    </option>
    <option value="full" ${frequency === 'full' ? 'selected' : ''}>
      Full (4 per day)
    </option>
  </select>
  
  <div 
    id="frequency-warning" 
    style="display:none;margin-top:10px;padding:10px;background:rgba(255,152,0,.1);border-left:3px solid #ff9800;border-radius:6px;font-size:.8rem;">
    <strong style="color:#ff9800;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Short window detected</strong>
    <p style="margin:4px 0 0 0;opacity:.9;">
      Your window is less than 6 hours. FULL frequency may feel too frequent (4 notifications in a short time). 
      Consider using MINIMUM or extending your availability.
    </p>
  </div>
  
  ${renderFrequencyExplanation(frequency)}
`);

/**
 * Render explanation of selected frequency
 * @param {string} frequency - Current frequency setting
 * @returns {string} HTML string
 */
const renderFrequencyExplanation = (frequency) => `
  <div style="margin-top:12px;padding:10px;background:rgba(0,0,0,.05);border-radius:8px;font-size:.8rem;">
    <strong style="display:block;margin-bottom:6px;">What you'll receive:</strong>
    <div style="opacity:.85;line-height:1.6;">
      ${frequency === 'minimum' ? `
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> <strong>Awakening:</strong> Checking-in and Focusing</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <strong>Integration:</strong> Integrating the Day</div>
      ` : `
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> <strong>Awakening:</strong> Checking-in and Focusing</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> <strong>Recharge:</strong> Quick reset and Mindfulness</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg> <strong>Reflect:</strong> Gratitude and Inspiration</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <strong>Integration:</strong> Integrating the Day</div>
      `}
    </div>
  </div>`;

// ============== RULES SECTION ==============

/**
 * Render rules/gamification section
 * @returns {string} HTML string
 */
export const rules = () => `
  <div class="accordion-inner rules-panel">
    ${renderRulesHeader()}
    ${renderCurrencySection()}
    ${renderBadgesSection()}
  </div>`;

/** Render rules header card */
const renderRulesHeader = () => `
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
  </div>`;

/** Render XP & Karma currency section */
const renderCurrencySection = () => `
  <button class="rules-collapse-btn" data-target="currency-block">XP & Karma</button>
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
              <td>L${i + 1} - ${level[0]}</td>
              <td>${level[1].toLocaleString()}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </div>
  </div>`;

/** Render badges section with all categories */
const renderBadgesSection = () => `
  <button class="rules-collapse-btn" data-target="badges-block">Badges</button>
  <div id="badges-block" class="rules-collapse-content">
    ${BADGE_CATEGORIES.map(category => renderBadgeCategory(category)).join('')}
  </div>`;

/**
 * Render a single badge category
 * @param {Object} category - Badge category object
 * @returns {string} HTML string
 */
const renderBadgeCategory = (category) => `
  <section class="rules-category">
    <h4 class="rules-category-title">${category.title}</h4>
    <div class="rules-grid">
      ${category.badges.map(badge => renderBadgeCard(badge)).join('')}
    </div>
  </section>`;

/**
 * Render a single badge card
 * @param {Object} badge - Badge object
 * @returns {string} HTML string
 */
const renderBadgeCard = (badge) => `
  <div class="rules-card" data-rarity="${badge.rarity}">
    <div class="rules-card-icon">${badge.icon}</div>
    <div class="rules-card-body">
      <div class="rules-card-name">${badge.name}</div>
      <div class="rules-card-desc">${badge.desc}</div>
      <div class="rules-card-rewards">
        <span class="rules-xp">+${badge.xp} XP</span>
        <span class="rules-karma">+${badge.karma} Karma</span>
      </div>
    </div>
    <div class="rules-card-tag" style="color:${RARITY_COLORS[badge.rarity]}">
      ${badge.rarity}
    </div>
  </div>`;

// ============== SIMPLE SECTIONS ==============

/** Render about section */
export const about = () => `
  <div class="accordion-inner">
    <p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
    <p>Built to share tools, practices and ancient wisdom - digitally, from your device.</p>
  </div>`;

/** Render contact section */
export const contact = () => `
  <div class="accordion-inner">
    <p>Contact for questions, sessions, classes, retreats or technical issues.</p>
    <a href="https://lironkerem.wixsite.com/project-curiosity" 
       target="_blank" 
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Official website
    </a><br>
    <a href="mailto:lironkerem@gmail.com" 
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Email me
    </a><br>
    <a href="https://www.facebook.com/AanandohamsProjectCuriosity" 
       target="_blank" 
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Facebook Page
    </a>
  </div>`;

/** Render export data section */
export const exportData = () => `
  <div class="accordion-inner">
    <button class="btn-link" onclick="window.app.exportUserData()">
      Download JSON
    </button>
  </div>`;

/** Render admin section mount point */
export const admin = () => `
  <div class="accordion-inner">
    <div id="admin-tab-mount" style="min-height: 100px;">
      <div style="text-align:center;padding:20px;opacity:.7;">
        Click to load admin panel...
      </div>
    </div>
  </div>`;

/** Billing section (handled by pricing modal) */
export const billing = () => ``;

// ============== PRICING MODAL ==============

/**
 * Render full pricing modal
 * @returns {string} HTML string
 */
export const pricingModal = () => `
  <div id="pricing-modal-overlay" class="pricing-overlay">
    <div class="pricing-modal">
      <button class="pricing-close" aria-label="Close">✕</button>

      <h2 class="pricing-title">Choose Your Path</h2>
      <p class="pricing-sub">Unlock deeper features and support the journey.</p>

      <div class="pricing-cards" id="pricing-cards-container">
        ${renderPricingCard('free', 'Seeker', '$0', [
          'Core gratitude & journal',
          'Daily energy check-ins',
          'Tarot & meditation',
          'Ad-free experience'
        ], false, 'Current Plan')}
        
        ${renderPricingCard('practitioner', 'Practitioner', '$8', [
          'Everything in Seeker',
          'Advanced automations',
          'Premium skins & themes',
          'Cloud backup & sync'
        ], true, 'Upgrade')}
        
        ${renderPricingCard('master', 'Master', '$20', [
          'Everything in Practitioner',
          '1-on-1 monthly call',
          'Custom wellness plans',
          'Priority support'
        ], false, 'Upgrade')}
      </div>
      
      <div class="pricing-carousel-dots" id="pricing-dots">
        <span class="pricing-dot active"></span>
        <span class="pricing-dot"></span>
        <span class="pricing-dot"></span>
      </div>

      <p class="pricing-foot">
        Cancel or change anytime in <strong>Settings → Billing</strong>
      </p>
    </div>
  </div>`;

/**
 * Render a single pricing card
 * @param {string} plan - Plan ID
 * @param {string} title - Plan title
 * @param {string} price - Price display
 * @param {Array<string>} features - List of features
 * @param {boolean} featured - Whether this is the featured plan
 * @param {string} buttonText - Button label
 * @returns {string} HTML string
 */
const renderPricingCard = (plan, title, price, features, featured, buttonText) => {
  const badge = plan === 'free' ? 'Free' : plan === 'master' ? 'Adept' : 'Most Popular';
  const badgeClass = featured ? 'popular' : '';
  
  return `
    <div class="pricing-card ${featured ? 'featured' : ''}" data-plan="${plan}">
      <div class="pricing-badge ${badgeClass}">${badge}</div>
      <h3>${title}</h3>
      <div class="pricing-price">
        ${price}${plan !== 'free' ? '<span>/month</span>' : ''}
      </div>
      <ul>
        ${features.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <button class="pricing-btn ${featured ? 'primary' : ''}" data-plan="${plan}">
        ${buttonText}
      </button>
    </div>`;
};