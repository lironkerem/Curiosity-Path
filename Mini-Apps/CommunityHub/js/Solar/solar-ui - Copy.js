/**
 * SOLAR-UI.JS
 * Shared UI manager for all seasonal solar practice rooms.
 */

import { SOLAR_CONSTANTS, SolarConfig } from './solar-config.js';
import { Core } from '../core.js';

const SolarUIManager = {

  // ── Storage ─────────────────────────────────────────────────────────────────
  storage: {
    _key: season =>
      `${SOLAR_CONSTANTS.STORAGE_PREFIX}${season}${SOLAR_CONSTANTS.STORAGE_KEY_SUFFIX}`,

    get(season) {
      const raw = localStorage.getItem(this._key(season));
      if (!raw) return null;
      try { return JSON.parse(raw); }
      catch (e) { console.error(`[SolarUI] Error loading ${season} data:`, e); return null; }
    },

    set(season, data) {
      try { localStorage.setItem(this._key(season), JSON.stringify(data)); return true; }
      catch (e) { console.error(`[SolarUI] Error saving ${season} data:`, e); return false; }
    },

    clear(season) { localStorage.removeItem(this._key(season)); },
  },

  // ── Utils ───────────────────────────────────────────────────────────────────
  utils: {
    calculateDaysRemaining: targetDate =>
      Math.ceil((targetDate - new Date()) / 86_400_000),

    generateFloatingElements(emojis, count = SOLAR_CONSTANTS.FLOATING_ELEMENT_COUNT) {
      const { FLOATING_ELEMENT_DELAY_MAX: dMax,
              FLOATING_ELEMENT_DURATION_MIN: durMin,
              FLOATING_ELEMENT_DURATION_RANGE: durRange } = SOLAR_CONSTANTS;
      let html = '';
      for (let i = 0; i < count; i++) {
        const emoji    = emojis[Math.floor(Math.random() * emojis.length)];
        const left     = (Math.random() * 100).toFixed(2);
        const delay    = (Math.random() * dMax).toFixed(2);
        const duration = (durMin + Math.random() * durRange).toFixed(2);
        html += `<div class="solar-floating-element"
                      style="left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;">
                   ${emoji}
                 </div>`;
      }
      return html;
    },

    formatDate: date => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  },

  // ── Renderers ───────────────────────────────────────────────────────────────
  renderers: {
    topBar({ seasonName, emoji, daysText, livingPresenceCount }) {
      return `
        <div class="solar-top-bar">
          <div class="solar-phase-left">
            <div class="solar-sun-icon">${emoji}</div>
            <div class="solar-phase-info">
              <h2>${seasonName} Season</h2>
              <p>${daysText}</p>
            </div>
          </div>
          <div class="solar-live-count-top">
            <div class="solar-pulse-dot"></div>
            <span id="solarLiveCountTop">${livingPresenceCount} members practicing with you now</span>
          </div>
          <button onclick="SolarUIManager.handleBackToHub()" class="solar-back-hub-btn">
            Gently Leave
          </button>
        </div>`;
    },

    modeToggle() {
      const icon = (d) => {
        if (d === 'solo') return `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>`;
        return `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>`;
      };
      const btn = (mode, label, active) =>
        `<button class="solar-mode-btn${active ? ' active' : ''}" data-mode="${mode}">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icon(mode)}</svg>
           <span>${label}</span>
         </button>`;
      return `<div class="solar-mode-toggle">${btn('solo', 'Solo Practice', true)}${btn('group', 'Group Circle', false)}</div>`;
    },

    practiceCard(practice, isLocked) {
      return `
        <div class="solar-practice-card" data-practice="${practice.id}" data-locked="${isLocked}" style="cursor:pointer;">
          ${isLocked ? '<div class="solar-lock-icon">✓</div>' : ''}
          <div class="solar-practice-icon" style="background:${practice.color};">${practice.icon}</div>
          <h4 class="solar-practice-title">${practice.title}</h4>
          <p class="solar-practice-desc">${practice.description}</p>
        </div>`;
    },

    savedInputs(data, seasonName) {
      const { intention, affirmation, releaseList } = data;
      if (!intention && !affirmation && !releaseList) return '';

      const esc  = t => SolarConfig.escapeHtml(t);
      const item = (title, body, pre) =>
        `<div class="solar-input-display" style="margin-bottom:1rem;">
           <h4>${title}</h4>
           <p${pre ? ' style="white-space:pre-line;"' : ''}>${esc(body)}</p>
         </div>`;

      return `
        <div class="solar-saved-inputs">
          <h3>Your ${seasonName} Harvest</h3>
          ${intention   ? item('Season Intention',        intention,   false) : ''}
          ${affirmation ? item('Gratitude Affirmation',   affirmation, false) : ''}
          ${releaseList ? item('Release/Growth List',     releaseList, true)  : ''}
          <p>Gathered with gratitude as the season completes</p>
        </div>`;
    },

    groupPractice({ seasonEmoji, seasonName, presenceCount, itemEmoji, collectiveFocus, collectiveNoun }) {
      const seasonLc = seasonName.toLowerCase();
      return `
        <div class="solar-group-container">
          <div class="solar-group-emoji">${seasonEmoji}</div>
          <h3 class="solar-group-title">Synchronized ${seasonName} Gathering</h3>
          <p class="solar-group-desc">
            Join fellow practitioners in a collective practice for ${collectiveFocus || 'seasonal alignment'}.
            Share intentions and witness the ${collectiveNoun || 'energy'} of the season together.
          </p>
          <div class="solar-live-badge">
            <div class="solar-pulse-dot"></div>
            <span id="solarGroupPresenceBadge">${presenceCount} gathering now</span>
          </div>
          <div id="solarGroupAvatars" style="display:flex;gap:6px;justify-content:center;margin:1rem 0;flex-wrap:wrap;"></div>
          <h4 style="color:var(--season-accent);margin:2rem 0 1rem 0;">Group Practice Includes:</h4>
          <ul class="solar-group-list">
            <li><span>${itemEmoji}</span> Join <span id="solarGroupJoinCount">${presenceCount}</span> practitioners in live circle</li>
            <li><span>${itemEmoji}</span> 3-minute guided meditation for seasonal centering</li>
            <li><span>${itemEmoji}</span> Set a private intention for ${seasonLc}</li>
            <li><span>${itemEmoji}</span> Share one word with the collective field</li>
            <li><span>${itemEmoji}</span> Witness the circle's ${collectiveNoun || 'intentions'}</li>
            <li><span>${itemEmoji}</span> 2-minute silent integration practice</li>
          </ul>
          <button class="solar-btn-primary" onclick="window.currentSolarRoom.showCollectiveIntentionPopup()">
            Join ${seasonName} Circle
          </button>
          <p class="solar-group-note">Practice available throughout the ${seasonLc} season</p>
        </div>`;
    },

    closureSection({ title, intro, placeholder, buttonText, closingLine }) {
      return `
        <div class="solar-closure">
          <h3>${title}</h3>
          <p>${intro}</p>
          <textarea id="closureReflection" class="solar-textarea" placeholder="${placeholder}"></textarea>
          ${closingLine ? `
            <div class="solar-popup-highlight" style="margin-top:1rem;">
              <p><em>"${closingLine}"</em></p>
            </div>` : ''}
          <button data-action="submit-closure" class="solar-btn-secondary" style="margin-top:1.5rem;">
            ${buttonText}
          </button>
        </div>`;
    },

    popup({ title, content, hasSaveButton }) {
      const footer = hasSaveButton
        ? `<button class="solar-popup-btn" data-action="save-practice">Save Practice</button>`
        : `<button class="solar-popup-btn" data-action="close-popup">Complete</button>`;
      return `
        <div class="solar-popup-overlay" data-action="close-popup">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2>${title}</h2>
              <button class="solar-popup-close" data-action="close-popup">×</button>
            </div>
            <div class="solar-popup-body">${content}</div>
            <div class="solar-popup-footer">${footer}</div>
          </div>
        </div>`;
    },

    inactiveRoom({ seasonName, emoji, startDate, daysUntil }) {
      return `
        <div class="solar-inactive">
          <div class="solar-inactive-container">
            <div class="solar-inactive-header">
              <div class="solar-inactive-sun"><div class="solar-sun-sphere" style="width:120px;height:120px;"></div></div>
              <h1 class="solar-inactive-title">${emoji} ${seasonName} Solar Room</h1>
              <p class="solar-inactive-subtitle">Harvest &amp; Gratitude Practice Space</p>
            </div>
            <div class="solar-inactive-card">
              <h2>Season Not Yet Active</h2>
              <p>The ${seasonName} Solar Room opens on <strong>${startDate}</strong></p>
              <p class="solar-inactive-days">${daysUntil} days until the ${seasonName.toLowerCase()} season begins</p>
              <p class="solar-inactive-note">Return when the cycle turns and the season is ready.</p>
            </div>
          </div>
        </div>`;
    },
  },

  // ── Interaction handlers ────────────────────────────────────────────────────
  switchMode(mode) {
    document.querySelectorAll('.solar-mode-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.mode === mode)
    );
    const solo  = document.getElementById('soloContent');
    const group = document.getElementById('groupContent');
    if (solo)  solo.style.display  = mode === 'solo'  ? 'block' : 'none';
    if (group) group.style.display = mode === 'group' ? 'block' : 'none';
  },

  closePracticePopup() {
    document.getElementById('practicePopup')?.remove();
  },

  handleBackToHub() {
    if (window.currentSolarRoom?.leaveRoom) {
      window.currentSolarRoom.leaveRoom();
      return;
    }
    window.currentSolarRoom?._clearPresence?.();
    document.body.classList.remove('solar-room-active');
    window.Rituals?.showClosing?.() || Core?.navigateTo?.('hubView');
  },

  showToast(message) {
    Core?.showToast
      ? Core.showToast(message)
      : console.log('[Toast]', message);
  },
};

window.SolarUIManager = SolarUIManager;

export { SolarUIManager };
