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
      :  },

  // ── Styles ───────────────────────────────────────────────────────────────────
  _stylesInjected: false,

  injectStyles() {
    if (this._stylesInjected || document.getElementById('solar-shared-styles')) {
      this._stylesInjected = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'solar-shared-styles';
    style.textContent = this._getSharedCSS();
    document.head.appendChild(style);
    this._stylesInjected = true;
  },

  _getSharedCSS() {
    return `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

/* ── Solar CSS variables ─────────────────────────────────────────────────── */
:root {
  --solar-bg-dark: rgba(0,0,0,0.3);
  --solar-bg-darker: rgba(0,0,0,0.2);
  --solar-text-primary: rgba(224,224,255,0.9);
  --solar-text-secondary: rgba(224,224,255,0.7);
  --solar-text-muted: rgba(224,224,255,0.5);
  --solar-border-light: rgba(255,255,255,0.1);
  --solar-border-medium: rgba(255,255,255,0.15);
  --solar-border-accent: rgba(212,165,116,0.3);
  --solar-glow-warm: rgba(244,164,96,0.6);
  --solar-glow-soft: rgba(212,165,116,0.4);
  --solar-success: #4ade80;
  /* Season defaults (Autumn) — overridden per season */
  --season-accent: #d4a574;
  --season-accent-light: #f4a460;
  --season-accent-dark: #a67c52;
  --season-bg-start: #3a1f0f;
  --season-bg-mid1: #5a3520;
  --season-bg-mid2: #4a2615;
  --season-bg-mid3: #6a4530;
  --season-bg-end: #3a1f0f;
  --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Season theme variables ──────────────────────────────────────────────── */
body.solar-room-active[data-season="winter"] {
  --season-accent: #a0b8c8; --season-accent-light: #c0d4e4; --season-accent-dark: #7a8c9c;
  --season-bg-start: #1a2a3a; --season-bg-mid1: #2d4050; --season-bg-mid2: #1e3545;
  --season-bg-mid3: #2f4a5a; --season-bg-end: #1a2a3a; --season-sun-glow: rgba(160,184,200,0.4);
}
body.solar-room-active[data-season="spring"] {
  --season-accent: #ffd740; --season-accent-light: #ffe066; --season-accent-dark: #f4c542;
  --season-bg-start: #1a3a2a; --season-bg-mid1: #2d5a3d; --season-bg-mid2: #234a35;
  --season-bg-mid3: #3d6a4d; --season-bg-end: #1a3a2a; --season-sun-glow: rgba(255,215,64,0.4);
}
body.solar-room-active[data-season="summer"] {
  --season-accent: #ff8c42; --season-accent-light: #ffa552; --season-accent-dark: #ff6b35;
  --season-bg-start: #ff6b35; --season-bg-mid1: #ff8c42; --season-bg-mid2: #ffa552;
  --season-bg-mid3: #ffbe68; --season-bg-end: #ff6b35; --season-sun-glow: rgba(255,140,66,0.4);
}
body.solar-room-active[data-season="autumn"] {
  --season-accent: #d4a574; --season-accent-light: #e8b886; --season-accent-dark: #b8835c;
  --season-bg-start: #2a1a0a; --season-bg-mid1: #3d2510; --season-bg-mid2: #2d1c0c;
  --season-bg-mid3: #4a2e15; --season-bg-end: #2a1a0a; --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Background ──────────────────────────────────────────────────────────── */
body.solar-room-active[data-season] {
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%) !important;
  background-attachment: fixed !important;
}
.solar-room-bg {
  min-height: 100vh; width: 100%;
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%);
  position: relative; overflow-x: hidden;
}

/* ── Floating elements ───────────────────────────────────────────────────── */
.solar-floating-bg{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;}
.solar-floating-element{position:absolute;font-size:2rem;animation:float linear infinite;opacity:0.6;}
@keyframes float{0%{top:-50px;transform:translateX(0) rotate(0deg);opacity:0.6;}100%{top:100vh;transform:translateX(100px) rotate(360deg);opacity:0.3;}}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
.solar-top-bar{position:relative;z-index:10;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:2rem;pointer-events:none;}
.solar-top-bar > *{pointer-events:auto;}
.solar-phase-left{display:flex;align-items:center;gap:1rem;justify-self:start;}
.solar-sun-icon{font-size:3rem;line-height:1;}
.solar-phase-info h2{font-size:1.5rem;color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.2;}
.solar-phase-info p{font-size:0.9rem;color:rgba(212,165,116,0.7);margin:0.25rem 0 0 0;}
.solar-live-count-top{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.2);border-radius:20px;font-size:0.9rem;color:rgba(212,165,116,0.9);justify-self:center;}
.solar-pulse-dot{width:8px;height:8px;background:var(--solar-success);border-radius:50%;animation:pulse 2s infinite;}
.solar-back-hub-btn{padding:0.625rem 1.25rem;background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.3);border-radius:12px;color:rgba(212,165,116,0.9);cursor:pointer;transition:all var(--transition-normal);font-size:0.9rem;justify-self:end;}
.solar-back-hub-btn:hover{background:rgba(212,165,116,0.2);border-color:rgba(212,165,116,0.5);}

/* ── Content wrapper ─────────────────────────────────────────────────────── */
.solar-content-wrapper{max-width:900px;margin:0 auto;padding:2rem 2rem 4rem 2rem;position:relative;z-index:2;}

/* ── Sun visual ──────────────────────────────────────────────────────────── */
.solar-sun-visual{display:flex;justify-content:center;margin-bottom:3rem;}
.solar-sun-glow{width:160px;height:160px;display:flex;align-items:center;justify-content:center;}
.solar-sun-sphere{width:100%;height:100%;background:radial-gradient(circle at 35% 35%,var(--season-accent-light) 0%,var(--season-accent) 40%,var(--season-accent-dark) 100%);border-radius:50%;box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);animation:sunGlow 4s ease-in-out infinite;}
@keyframes sunGlow{0%,100%{box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);}50%{box-shadow:0 0 50px var(--solar-glow-warm),0 0 100px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.4);}}

/* ── Intro card ──────────────────────────────────────────────────────────── */
.solar-intro-card{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:20px;padding:2rem;margin-bottom:3rem;text-align:center;}
.solar-season-img{width:100%;max-width:500px;height:auto;margin:0 auto 1.5rem;display:block;border-radius:12px;filter:invert(1);}
.solar-intro-card p{color:var(--solar-text-secondary);font-size:1.1rem;line-height:1.7;margin:0;}

/* ── Mode toggle ─────────────────────────────────────────────────────────── */
.solar-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:2rem;}
.solar-mode-btn{display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:0.875rem;background:rgba(255,255,255,0.03);border:1px solid var(--solar-border-light);border-radius:12px;color:var(--solar-text-muted);cursor:pointer;transition:all var(--transition-normal);font-size:0.95rem;}
.solar-mode-btn:hover{background:var(--neuro-warning-a10);border-color:rgba(212,165,116,0.3);color:rgba(212,165,116,0.9);}
.solar-mode-btn.active{background:linear-gradient(135deg,rgba(212,165,116,0.2) 0%,rgba(166,124,82,0.2) 100%);border-color:rgba(212,165,116,0.5);color:var(--season-accent);}
.solar-mode-btn svg{flex-shrink:0;}
.solar-mode-content{animation:fadeIn 0.5s ease-out;}
.solar-mode-description{text-align:center;margin-bottom:2.5rem;}
.solar-mode-description h3{color:var(--season-accent);font-size:1.5rem;margin-bottom:0.5rem;font-family:'Cormorant Garamond',serif;}
.solar-mode-description p{color:var(--solar-text-secondary);margin:0;}

/* ── Practices grid ──────────────────────────────────────────────────────── */
.solar-practices-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin:0 auto 3rem;max-width:800px;}
.solar-practice-card{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:16px;padding:1.5rem;cursor:pointer;transition:all var(--transition-normal);position:relative;}
.solar-practice-card:hover{border-color:var(--season-accent);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,0.2);}
.solar-practice-card.locked{opacity:0.6;cursor:not-allowed;}
.solar-lock-icon{position:absolute;top:1rem;right:1rem;color:var(--solar-success);font-size:1.5rem;}
.solar-practice-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:white;}
.solar-practice-icon svg{width:24px;height:24px;}
.solar-practice-title{color:var(--season-accent);margin-bottom:0.5rem;font-size:1.2rem;font-family:'Cormorant Garamond',serif;}
.solar-practice-desc{color:var(--solar-text-secondary);margin:0;font-size:0.95rem;}

/* ── Saved inputs ────────────────────────────────────────────────────────── */
.solar-saved-inputs{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:16px;padding:2rem;margin-top:2rem;}
.solar-saved-inputs h3{color:var(--season-accent);margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;text-align:center;}
.solar-input-display{background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1.5rem;}
.solar-input-display h4{color:var(--season-accent);margin-bottom:0.75rem;font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;}
.solar-input-display p{color:var(--solar-text-primary);margin:0;line-height:1.6;}
.solar-saved-inputs > p{text-align:center;color:var(--solar-text-muted);font-size:0.9rem;margin:2rem 0 0 0;font-style:italic;}

/* ── Group practice ──────────────────────────────────────────────────────── */
.solar-group-container{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2.5rem;text-align:center;}
.solar-group-emoji{font-size:3rem;margin-bottom:1rem;}
.solar-group-title{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;font-size:1.5rem;}
.solar-group-desc{color:var(--solar-text-secondary);margin-bottom:2rem;line-height:1.7;}
.solar-live-badge{display:inline-flex;align-items:center;gap:0.75rem;background:var(--solar-bg-darker);padding:1rem 1.5rem;border-radius:12px;margin-bottom:2rem;}
.solar-live-badge span{color:var(--solar-text-primary);font-weight:500;}
.solar-group-list{text-align:left;color:var(--solar-text-secondary);list-style:none;padding:0;max-width:500px;margin:0 auto 2rem;}
.solar-group-list li{margin-bottom:0.75rem;padding-left:1.5rem;position:relative;}
.solar-group-list li span{position:absolute;left:0;}
.solar-btn-primary{padding:1rem 2rem;background:linear-gradient(135deg,var(--season-accent) 0%,var(--season-accent-dark) 100%);border:none;border-radius:12px;color:white;font-size:1.1rem;cursor:pointer;font-weight:500;transition:transform var(--transition-fast);}
.solar-btn-primary:hover{transform:scale(1.05);}
.solar-group-note{color:var(--solar-text-muted);margin-top:1.5rem;font-size:0.9rem;font-style:italic;}

/* ── Closure ─────────────────────────────────────────────────────────────── */
.solar-closure{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2rem;margin:3rem 0 2rem;}
.solar-closure h3{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-closure p{color:var(--solar-text-secondary);margin-bottom:1.5rem;}
.solar-textarea{width:100%;min-height:100px;background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1rem;color:var(--solar-text-primary);font-family:inherit;font-size:1rem;line-height:1.6;box-sizing:border-box;resize:vertical;}
.solar-textarea:focus{outline:none;border-color:var(--season-accent);}
.solar-btn-secondary{margin-top:1rem;padding:0.75rem 1.5rem;background:linear-gradient(135deg,var(--season-accent) 0%,var(--season-accent-dark) 100%);border:none;border-radius:12px;color:white;cursor:pointer;font-weight:500;font-size:1rem;transition:transform var(--transition-fast);}
.solar-btn-secondary:hover{transform:scale(1.02);}

/* ── Popup ───────────────────────────────────────────────────────────────── */
.solar-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:2rem;animation:fadeIn 0.3s;}
.solar-popup-content{background:linear-gradient(135deg,#2a1810 0%,#3a2515 100%);border:1px solid rgba(212,165,116,0.3);border-radius:20px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;animation:slideUp 0.3s;}
.solar-popup-header{padding:2rem 2rem 1rem 2rem;border-bottom:1px solid rgba(212,165,116,0.2);display:flex;justify-content:space-between;align-items:center;}
.solar-popup-header h2{color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;}
.solar-popup-close{background:none;border:none;color:rgba(212,165,116,0.6);font-size:2rem;cursor:pointer;line-height:1;padding:0;width:32px;height:32px;transition:color var(--transition-normal);}
.solar-popup-close:hover{color:var(--season-accent);}
.solar-popup-body{padding:2rem;}
.solar-popup-section{margin-bottom:2rem;}
.solar-popup-section:last-child{margin-bottom:0;}
.solar-popup-section h3{color:var(--season-accent);margin-bottom:1rem;font-size:1.3rem;font-family:'Cormorant Garamond',serif;}
.solar-popup-section p{color:var(--solar-text-secondary);line-height:1.7;margin-bottom:1rem;}
.solar-popup-section ul{color:var(--solar-text-secondary);line-height:1.8;padding-left:1.5rem;margin:0;}
.solar-popup-section li{margin-bottom:0.75rem;}
.solar-popup-highlight{background:var(--neuro-warning-a10);border-left:3px solid var(--season-accent);padding:1rem 1.5rem;border-radius:8px;margin:1.5rem 0;}
.solar-popup-highlight p{color:var(--solar-text-primary);font-style:italic;margin:0;}
.solar-popup-footer{padding:1.5rem 2rem;border-top:1px solid rgba(212,165,116,0.2);text-align:center;}
.solar-popup-btn{padding:0.75rem 2rem;background:linear-gradient(135deg,var(--season-accent) 0%,var(--season-accent-dark) 100%);border:none;border-radius:12px;color:white;font-size:1rem;cursor:pointer;font-weight:500;transition:transform var(--transition-fast);}
.solar-popup-btn:hover{transform:scale(1.05);}
.solar-affirmation-btn{display:block;width:100%;padding:0.75rem;background:rgba(255,255,255,0.05);border:1px solid var(--solar-border-light);border-radius:8px;color:var(--solar-text-secondary);cursor:pointer;text-align:left;transition:all var(--transition-normal);margin-bottom:0.5rem;font-size:0.95rem;}
.solar-affirmation-btn:hover{background:var(--neuro-warning-a10);border-color:rgba(212,165,116,0.3);color:var(--season-accent);}

/* ── Inactive room ───────────────────────────────────────────────────────── */
.solar-inactive{min-height:100vh;background:linear-gradient(135deg,#2a1810 0%,#4a2820 100%);padding:2rem;}
.solar-inactive-container{max-width:800px;margin:0 auto;text-align:center;}
.solar-inactive-header{margin-bottom:3rem;}
.solar-inactive-sun{display:inline-block;width:120px;height:120px;position:relative;margin-bottom:1.5rem;}
.solar-inactive-title{font-family:'Cormorant Garamond',serif;font-size:3rem;color:var(--season-accent);margin-bottom:0.5rem;text-shadow:0 2px 10px rgba(212,165,116,0.3);}
.solar-inactive-subtitle{color:rgba(212,165,116,0.7);font-size:1.2rem;}
.solar-inactive-card{background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.3);border-radius:20px;padding:3rem;}
.solar-inactive-card h2{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-inactive-card p{color:var(--solar-text-secondary);font-size:1.1rem;margin-bottom:1.5rem;}
.solar-inactive-days{color:rgba(212,165,116,0.6);font-size:1rem;}
.solar-inactive-note{color:var(--solar-text-muted);margin-top:2rem;font-style:italic;}

/* ── Responsive: tablet (max 1024px) ────────────────────────────────────── */
@media (max-width:1024px) {
  .solar-top-bar{padding:1.25rem 1.5rem !important;grid-template-columns:1fr auto 1fr !important;}
  .solar-content-wrapper{padding:1.5rem 1.5rem 3rem !important;}
  .solar-sun-glow{width:130px !important;height:130px !important;}
  .solar-practices-grid{grid-template-columns:repeat(2,1fr) !important;max-width:100% !important;}
  .solar-popup-content{max-width:640px !important;}
}

/* ── Responsive: mobile (max 768px) ─────────────────────────────────────── */
@media (max-width:768px) {
  /* Top bar: emoji+name left, button right, live count below */
  .solar-top-bar{grid-template-columns:1fr auto !important;grid-template-rows:auto auto !important;padding:0.75rem 1rem !important;gap:0.5rem !important;}
  .solar-phase-left{grid-column:1 !important;grid-row:1 !important;}
  .solar-back-hub-btn{grid-column:2 !important;grid-row:1 !important;justify-self:end !important;align-self:center !important;padding:0.45rem 0.85rem !important;font-size:0.78rem !important;}
  .solar-live-count-top{grid-column:1 / -1 !important;grid-row:2 !important;justify-self:stretch !important;justify-content:center !important;padding:0.375rem 0.75rem !important;font-size:0.8rem !important;}
  .solar-live-count-top span{font-size:0.8rem !important;}
  .solar-sun-icon{font-size:1.75rem !important;}
  .solar-phase-info h2{font-size:1rem !important;}
  .solar-phase-info p{font-size:0.78rem !important;margin-top:0.15rem !important;}
  /* Content */
  .solar-content-wrapper{padding:1.25rem 1rem 2.5rem !important;}
  .solar-sun-visual{margin-bottom:1.5rem !important;}
  .solar-sun-glow{width:100px !important;height:100px !important;}
  .solar-intro-card{padding:1.25rem !important;margin-bottom:1.5rem !important;border-radius:14px !important;}
  .solar-season-img{max-width:220px !important;margin-bottom:1rem !important;}
  .solar-intro-card p{font-size:0.95rem !important;line-height:1.65 !important;}
  /* Mode toggle */
  .solar-mode-toggle{grid-template-columns:1fr !important;gap:0.625rem !important;margin-bottom:1.25rem !important;}
  .solar-mode-btn{padding:0.75rem !important;font-size:0.9rem !important;}
  .solar-mode-description{margin-bottom:1.25rem !important;}
  .solar-mode-description h3{font-size:1.2rem !important;}
  .solar-mode-description p{font-size:0.9rem !important;}
  /* Practices */
  .solar-practices-grid{grid-template-columns:1fr !important;gap:0.875rem !important;margin-bottom:1.5rem !important;max-width:100% !important;}
  .solar-practice-card{padding:1.1rem !important;}
  .solar-practice-title{font-size:1.05rem !important;margin-bottom:0.375rem !important;}
  .solar-practice-desc{font-size:0.875rem !important;}
  .solar-practice-icon{width:40px !important;height:40px !important;margin-bottom:0.75rem !important;border-radius:10px !important;}
  .solar-practice-icon svg{width:20px !important;height:20px !important;}
  /* Saved inputs */
  .solar-saved-inputs{padding:1.25rem !important;border-radius:14px !important;}
  .solar-saved-inputs h3{font-size:1.2rem !important;margin-bottom:1rem !important;}
  .solar-input-display{padding:1rem !important;border-radius:10px !important;}
  .solar-input-display h4{font-size:0.9rem !important;}
  .solar-input-display p{font-size:0.9rem !important;}
  /* Group */
  .solar-group-container{padding:1.5rem 1rem !important;border-radius:16px !important;}
  .solar-group-emoji{font-size:2rem !important;margin-bottom:0.75rem !important;}
  .solar-group-title{font-size:1.3rem !important;margin-bottom:0.75rem !important;}
  .solar-group-desc{font-size:0.9rem !important;line-height:1.6 !important;margin-bottom:1.25rem !important;}
  .solar-live-badge{padding:0.75rem 1rem !important;margin-bottom:1.25rem !important;border-radius:10px !important;}
  .solar-live-badge span{font-size:0.875rem !important;}
  .solar-group-list{font-size:0.875rem !important;max-width:100% !important;margin-bottom:1.25rem !important;padding-left:0 !important;}
  .solar-group-list li{margin-bottom:0.5rem !important;padding-left:1.25rem !important;font-size:0.875rem !important;}
  .solar-btn-primary{padding:0.875rem 1.5rem !important;font-size:1rem !important;width:100%;box-sizing:border-box;}
  .solar-group-note{font-size:0.8rem !important;margin-top:1rem !important;}
  /* Closure */
  .solar-closure{padding:1.25rem !important;margin:1.5rem 0 1rem !important;border-radius:14px !important;}
  .solar-closure h3{font-size:1.2rem !important;margin-bottom:0.75rem !important;}
  .solar-closure p{font-size:0.9rem !important;margin-bottom:1rem !important;}
  .solar-textarea{font-size:0.9rem !important;padding:0.75rem !important;min-height:80px !important;border-radius:10px !important;}
  .solar-btn-secondary{padding:0.75rem 1.25rem !important;font-size:0.9rem !important;width:100%;box-sizing:border-box;}
  /* Popup — sheet from bottom */
  .solar-popup-overlay{padding:0 !important;align-items:flex-end !important;}
  .solar-popup-content{max-width:100% !important;width:100% !important;max-height:92vh !important;border-radius:24px 24px 0 0 !important;}
  .solar-popup-header{padding:1.25rem 1.25rem 0.875rem !important;}
  .solar-popup-header h2{font-size:1.2rem !important;}
  .solar-popup-close{font-size:1.5rem !important;width:28px !important;height:28px !important;}
  .solar-popup-body{padding:1.25rem !important;}
  .solar-popup-section{margin-bottom:1.25rem !important;}
  .solar-popup-section h3{font-size:1.1rem !important;margin-bottom:0.625rem !important;}
  .solar-popup-section p,.solar-popup-section li{font-size:0.9rem !important;line-height:1.6 !important;}
  .solar-popup-highlight{padding:0.75rem 1rem !important;border-radius:8px !important;margin:0.875rem 0 !important;}
  .solar-popup-footer{padding:1rem 1.25rem !important;}
  .solar-popup-btn{padding:0.875rem !important;font-size:0.95rem !important;}
  .solar-affirmation-btn{font-size:0.875rem !important;padding:0.625rem !important;}
  /* Inactive */
  .solar-inactive{padding:1.25rem !important;}
  .solar-inactive-title{font-size:clamp(1.5rem,7vw,2.5rem) !important;}
  .solar-inactive-subtitle{font-size:1rem !important;}
  .solar-inactive-card{padding:1.5rem 1rem !important;border-radius:14px !important;}
  .solar-inactive-card h2{font-size:1.2rem !important;}
  .solar-inactive-card p{font-size:0.9rem !important;}
  .solar-inactive-sun{width:80px !important;height:80px !important;}
}

/* ── Responsive: extra small (max 380px) ─────────────────────────────────── */
@media (max-width:380px) {
  .solar-sun-glow{width:72px !important;height:72px !important;}
  .solar-content-wrapper{padding:0.75rem 0.625rem 1.5rem !important;}
  .solar-intro-card{padding:0.875rem !important;}
  .solar-season-img{max-width:160px !important;}
  .solar-inactive-title{font-size:clamp(1.3rem,7vw,2rem) !important;}
  .solar-inactive-card{padding:1.25rem 0.875rem !important;}
}
    `;
  },
};

window.SolarUIManager = SolarUIManager;

export { SolarUIManager };
