/**
 * SOLAR-UI.JS
 * Shared UI manager for all seasonal solar practice rooms
 * OPTIMIZED VERSION with bug fixes and improvements
 */

const SolarUIManager = {
  // Storage utilities
  storage: {
    get(season) {
      const key = `${SOLAR_CONSTANTS.STORAGE_PREFIX}${season}${SOLAR_CONSTANTS.STORAGE_KEY_SUFFIX}`;
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Error loading ${season} data:`, e);
        return null;
      }
    },
    
    set(season, data) {
      const key = `${SOLAR_CONSTANTS.STORAGE_PREFIX}${season}${SOLAR_CONSTANTS.STORAGE_KEY_SUFFIX}`;
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (e) {
        console.error(`Error saving ${season} data:`, e);
        return false;
      }
    },
    
    clear(season) {
      const key = `${SOLAR_CONSTANTS.STORAGE_PREFIX}${season}${SOLAR_CONSTANTS.STORAGE_KEY_SUFFIX}`;
      localStorage.removeItem(key);
    }
  },

  // Utility functions
  utils: {
    calculateDaysRemaining(targetDate) {
      return Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24));
    },
    
    generateFloatingElements(emojis, count = SOLAR_CONSTANTS.FLOATING_ELEMENT_COUNT) {
      let html = '';
      for (let i = 0; i < count; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * SOLAR_CONSTANTS.FLOATING_ELEMENT_DELAY_MAX;
        const duration = SOLAR_CONSTANTS.FLOATING_ELEMENT_DURATION_MIN + 
                        Math.random() * SOLAR_CONSTANTS.FLOATING_ELEMENT_DURATION_RANGE;
        
        html += `
          <div class="solar-floating-element" 
               style="left: ${left}%; 
                      animation-delay: ${delay}s; 
                      animation-duration: ${duration}s;">
            ${emoji}
          </div>
        `;
      }
      return html;
    },

    getRandomPresenceCount() {
      const { min, max } = SOLAR_CONSTANTS.PRESENCE_RANGE;
      const fallback = Math.floor(Math.random() * (max - min + 1)) + min;

      // Async-refresh from Supabase if a solar room is active
      if (window.CommunityDB && CommunityDB.ready && window.currentSolarRoom) {
        const roomId = `${window.currentSolarRoom.config?.name}-solar`;
        CommunityDB.getRoomPresence(roomId)
          .then(count => {
            if (typeof count === 'number') {
              // Update any live presence badges still in the DOM
              document.querySelectorAll('.solar-live-count-top span').forEach(el => {
                el.textContent = `${count} members practicing with you now`;
              });
              document.querySelectorAll('.solar-live-badge span').forEach(el => {
                el.textContent = `${count} gathering now`;
              });
            }
          })
          .catch(err => {
            console.warn('[SolarUIManager] getRandomPresenceCount DB error:', err);
          });
      }

      return fallback;
    },

    formatDate(date) {
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  },

  // Render components
  renderers: {
    topBar(config) {
      const { seasonName, emoji, daysText, livingPresenceCount } = config;
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
            <span>${livingPresenceCount} members practicing with you now</span>
          </div>
          <button onclick="SolarUIManager.handleBackToHub()" class="solar-back-hub-btn">
            Leave Practice
          </button>
        </div>
      `;
    },

    modeToggle() {
      return `
        <div class="solar-mode-toggle">
          <button class="solar-mode-btn active" data-mode="solo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Solo Practice</span>
          </button>
          <button class="solar-mode-btn" data-mode="group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Group Circle</span>
          </button>
        </div>
      `;
    },

    practiceCard(practice, isLocked) {
      const lockedAttr = isLocked ? 'data-locked="true"' : 'data-locked="false"';
      const lockIcon = isLocked ? '<div class="solar-lock-icon">✓</div>' : '';
      
      return `
        <div class="solar-practice-card" 
             data-practice="${practice.id}" 
             ${lockedAttr}
             style="cursor: pointer;">
          ${lockIcon}
          <div class="solar-practice-icon" style="background: ${practice.color};">
            ${practice.icon}
          </div>
          <h4 class="solar-practice-title">${practice.title}</h4>
          <p class="solar-practice-desc">${practice.description}</p>
        </div>
      `;
    },

    savedInputs(data, seasonName) {
      const { intention, affirmation, releaseList } = data;
      if (!intention && !affirmation && !releaseList) return '';

      let html = `
        <div class="solar-saved-inputs">
          <h3>Your ${seasonName} Harvest</h3>
      `;

      if (intention) {
        html += `
          <div class="solar-input-display" style="margin-bottom: 1rem;">
            <h4>Season Intention</h4>
            <p>${this._escapeHtml(intention)}</p>
          </div>
        `;
      }

      if (affirmation) {
        html += `
          <div class="solar-input-display" style="margin-bottom: 1rem;">
            <h4>Gratitude Affirmation</h4>
            <p>${this._escapeHtml(affirmation)}</p>
          </div>
        `;
      }

      if (releaseList) {
        html += `
          <div class="solar-input-display">
            <h4>Release/Growth List</h4>
            <p style="white-space: pre-line;">${this._escapeHtml(releaseList)}</p>
          </div>
        `;
      }

      html += `
          <p>Gathered with gratitude as the season completes</p>
        </div>
      `;

      return html;
    },
    
    _escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    groupPractice(config) {
      const { seasonEmoji, seasonName, presenceCount, itemEmoji, sessionTimes, collectiveFocus, collectiveNoun } = config;
      
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
            <span>${presenceCount} gathering now</span>
          </div>
          <h4 style="color: var(--season-accent); margin: 2rem 0 1rem 0;">Group Practice Includes:</h4>
          <ul class="solar-group-list">
            <li><span>${itemEmoji}</span> Join ${presenceCount} practitioners in live circle</li>
            <li><span>${itemEmoji}</span> 3-minute guided meditation for seasonal centering</li>
            <li><span>${itemEmoji}</span> Set a private intention for ${seasonName.toLowerCase()}</li>
            <li><span>${itemEmoji}</span> Share one word with the collective field</li>
            <li><span>${itemEmoji}</span> Witness the circle's ${collectiveNoun || 'intentions'}</li>
            <li><span>${itemEmoji}</span> 2-minute silent integration practice</li>
          </ul>
          <button class="solar-btn-primary" onclick="window.currentSolarRoom.showCollectiveIntentionPopup()">
            Join ${seasonName} Circle
          </button>
          <p class="solar-group-note">Practice available throughout the ${seasonName.toLowerCase()} season</p>
        </div>
      `;
    },

    closureSection() {
      return `
        <div class="solar-closure">
          <h3>Season Completion</h3>
          <p>Before the season ends, reflect on your journey through this harvest period.</p>
          <textarea id="closureReflection" class="solar-textarea" 
            placeholder="What is complete? What are you grateful for? What are you ready to release?"></textarea>
          <button data-action="submit-closure" class="solar-btn-secondary">
            Complete Season
          </button>
        </div>
      `;
    },

    popup(config) {
      const { title, content, hasSaveButton, saveAction } = config;
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
            <div class="solar-popup-body">
              ${content}
            </div>
            <div class="solar-popup-footer">
              ${footer}
            </div>
          </div>
        </div>
      `;
    },

    inactiveRoom(config) {
      const { seasonName, emoji, startDate, daysUntil } = config;
      
      return `
        <div class="solar-inactive">
          <div class="solar-inactive-container">
            <div class="solar-inactive-header">
              <div class="solar-inactive-sun">
                <div class="solar-sun-sphere" style="width: 120px; height: 120px;"></div>
              </div>
              <h1 class="solar-inactive-title">${emoji} ${seasonName} Solar Room</h1>
              <p class="solar-inactive-subtitle">Harvest & Gratitude Practice Space</p>
            </div>
            <div class="solar-inactive-card">
              <h2>Season Not Yet Active</h2>
              <p>The ${seasonName} Solar Room opens on <strong>${startDate}</strong></p>
              <p class="solar-inactive-days">${daysUntil} days until the ${seasonName.toLowerCase()} season begins</p>
              <p class="solar-inactive-note">Return when the cycle turns and the season is ready.</p>
            </div>
          </div>
        </div>
      `;
    }
  },

  // Interaction handlers
  switchMode(mode) {
    document.querySelectorAll('.solar-mode-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const modeBtn = document.querySelector(`[data-mode="${mode}"]`);
    if (modeBtn) modeBtn.classList.add('active');
    
    const soloContent = document.getElementById('soloContent');
    const groupContent = document.getElementById('groupContent');
    
    if (soloContent) soloContent.style.display = mode === 'solo' ? 'block' : 'none';
    if (groupContent) groupContent.style.display = mode === 'group' ? 'block' : 'none';
  },

  closePracticePopup() {
    const popup = document.getElementById('practicePopup');
    if (popup) popup.remove();
  },

  handleBackToHub() {
    // ── Clear Supabase presence ────────────────────────────────────────
    if (window.currentSolarRoom && typeof window.currentSolarRoom._clearPresence === 'function') {
      window.currentSolarRoom._clearPresence();
    }

    // Remove solar room background class
    document.body.classList.remove('solar-room-active');
    
    // FIXED: Trigger closing ritual instead of direct navigation
    if (window.Rituals && window.Rituals.showClosing) {
      window.Rituals.showClosing();
    } else {
      // Fallback: direct navigation if Rituals not available
      console.warn('Rituals module not available, navigating directly');
      if (window.Core && window.Core.navigateTo) {
        window.Core.navigateTo('hubView');
      }
    }
  },

  showToast(message) {
    if (window.Core && window.Core.showToast) {
      window.Core.showToast(message);
    } else {
      console.log('Toast:', message);
    }
  }
};

window.SolarUIManager = SolarUIManager;
console.log('☀️ Solar UI Manager loaded');
