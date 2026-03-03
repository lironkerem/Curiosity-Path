// Mini-Apps/CommunityHub/CommunityHubEngine.js

const BASE_PATH = '/Mini-Apps/CommunityHub';

const RITUAL_TEXTS = [
  "Enter with intention, leave with gratitude",
  "This space holds you. Enter with presence.",
  "Breathe in. You are welcome here.",
  "Leave the noise behind. Step into stillness.",
  "You are exactly where you need to be.",
  "Enter gently. This moment is yours.",
  "Set down what you carry. Enter with an open heart.",
  "The space is ready. So are you.",
  "Come as you are. This is a place of welcome.",
  "Arrive fully. Begin with intention.",
];

class CommunityHubEngine {
  constructor(app) {
    this.app = app;
    this.initialized = false;
  }

  async render() {
    const tab = document.getElementById('community-hub-tab');
    if (!tab) {
      console.error('[CommunityHub] Tab element not found');
      return;
    }

    this.createFullscreenRoomContainer();

    if (!this.initialized) {
      tab.innerHTML = this._buildTabHTML();
    }

    // Double rAF ensures DOM is painted before overlay shows
    requestAnimationFrame(() => requestAnimationFrame(() => this._showRitualImmediately()));

    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
      console.log('✅ Community Hub loaded successfully');
    } else {
      // Re-visit: reset state so sections re-render
      if (window.Core) {
        window.Core.state.initialized = false;
        window.Core.init();
      }
      if (window.Rituals) {
        window.Rituals.state.hasSeenOpening = false;
      }
    }

    // Auto-open a room requested from an external CTA (e.g. Energy Tracker)
    // Runs on every visit - poll until the room function is available
    if (window._pendingRoomOpen) {
      const roomKey = window._pendingRoomOpen;
      window._pendingRoomOpen = null;
      const tryOpen = setInterval(() => {
        const fn = window[`${roomKey}_enterRoom`];
        if (typeof fn === 'function') {
          clearInterval(tryOpen);
          fn();
        }
      }, 200);
      setTimeout(() => clearInterval(tryOpen), 8000); // safety timeout
    }
  }

  // ---------------------------------------------------------------------------
  // HTML Builders
  // ---------------------------------------------------------------------------

  _buildTabHTML() {
    return `
      <div style="background:var(--neuro-bg); padding:1.5rem; min-height:100vh; position:relative;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavCommunity.png');
                         --header-title:'';
                         --header-tag:'A space for mindful practice and togetherness'">
            <h1>Community Hub</h1>
            <h3>A space for mindful practice and togetherness</h3>
            <span class="header-sub"></span>
          </header>

          <div class="card" style="padding:2rem">
            <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

            <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4"
               target="_blank" rel="noopener noreferrer"
               class="whatsapp-float"
               aria-label="Join our Community Chat on WhatsApp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                   alt="WhatsApp" width="24" height="24">
              <span>Join our Community Chat</span>
            </a>

            <div id="hubView" class="view active">
              <div id="profileHeroContainer"></div>

              <div class="sanctuary-content">
                <div id="activeMembersContainer"></div>
                <div id="collectiveFieldContainer"></div>
                <div id="resonanceContainer"></div>

                <section class="section" aria-labelledby="practiceSpacesTitle">
                  <div class="section-header">
                    <div class="section-title" id="practiceSpacesTitle">Practice Spaces</div>
                    <div style="font-size:12px; color:var(--text-muted);">Choose your practice</div>
                  </div>
                  <div class="rooms-grid" id="roomsGrid"></div>
                </section>

                <section class="section" id="celestialLunarSection" aria-labelledby="celestialCyclesTitle">
                  <div class="section-header">
                    <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                    <div style="font-size:12px; color:var(--text-muted);">Practice with nature's rhythms</div>
                  </div>
                  <div id="lunarContainer" class="celestial-container"></div>
                </section>

                <section class="section" id="celestialSolarSection">
                  <div id="solarContainer" class="celestial-container"></div>
                </section>

                <div id="communityReflectionsContainer"></div>
                <div id="upcomingEventsContainer"></div>
              </div>
            </div>

            <div class="toast" id="toast" role="alert" aria-live="assertive"></div>
          </div>

        </div>
      </div>
    `;
  }

  _buildCandleSVG(idSuffix) {
    return `
      <svg viewBox="0 0 48 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="flame-outer" cx="24" cy="16" rx="7" ry="11" fill="url(#flameGradOuter-${idSuffix})" opacity="0.9"/>
        <ellipse class="flame-inner" cx="24" cy="18" rx="4.5" ry="7.5" fill="url(#flameGradInner-${idSuffix})" opacity="0.95"/>
        <ellipse class="flame-core"  cx="24" cy="20" rx="2" ry="3.5" fill="#fff9e6" opacity="0.95"/>
        <line x1="24" y1="26" x2="24" y2="29" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="14" y="29" width="20" height="34" rx="3" fill="url(#candleGrad-${idSuffix})"/>
        <path d="M14 35 Q11 38 12 43 Q13 46 14 48 L14 35Z" fill="url(#dripGrad-${idSuffix})" opacity="0.7"/>
        <path d="M34 38 Q37 41 36 46 Q35 48 34 49 L34 38Z" fill="url(#dripGrad-${idSuffix})" opacity="0.5"/>
        <ellipse cx="24" cy="29" rx="10" ry="2.5" fill="url(#topGrad-${idSuffix})"/>
        <rect x="17" y="31" width="4" height="28" rx="2" fill="white" opacity="0.08"/>
        <defs>
          <radialGradient id="flameGradOuter-${idSuffix}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#ffe066"/>
            <stop offset="50%"  stop-color="#ff9a00"/>
            <stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameGradInner-${idSuffix}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#fff5c0"/>
            <stop offset="60%"  stop-color="#ffb830"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="candleGrad-${idSuffix}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#c8a882"/>
            <stop offset="40%"  stop-color="#e8d0b0"/>
            <stop offset="70%"  stop-color="#d4b88a"/>
            <stop offset="100%" stop-color="#b89060"/>
          </linearGradient>
          <linearGradient id="dripGrad-${idSuffix}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#e8d0b0"/>
            <stop offset="100%" stop-color="#c8a882" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="topGrad-${idSuffix}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#f0dfc0"/>
            <stop offset="100%" stop-color="#c8a882"/>
          </radialGradient>
        </defs>
      </svg>`;
  }

  _buildRitualCard({ id, textId, type, action, label, buttonText }) {
    return `
      <div class="ritual-overlay ${type}" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${textId}">
        <div class="ritual-card">
          <div class="ritual-candle" aria-hidden="true">${this._buildCandleSVG(type[0])}</div>
          <div class="ritual-text" id="${textId}"></div>
          <button class="ritual-btn" data-action="${action}" aria-label="${label}">${buttonText}</button>
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------------------
  // DOM Setup
  // ---------------------------------------------------------------------------

  createFullscreenRoomContainer() {
    if (document.getElementById('communityHubFullscreenContainer')) return;

    const container = document.createElement('div');
    container.id = 'communityHubFullscreenContainer';
    container.style.cssText = 'position:fixed;inset:0;z-index:99999;background:transparent;display:none;overflow:auto;pointer-events:auto;';

    container.innerHTML = `
      ${this._buildRitualCard({
        id: 'closingOverlay', textId: 'closingRitualText', type: 'closing',
        action: 'ritual-closing', label: 'Close gently', buttonText: 'Close Gently',
      })}
      <div id="dynamicRoomContent" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;width:100%;"></div>
    `;

    document.body.appendChild(container);

    // Opening overlay goes into app-container (or body) so it covers all UI chrome
    if (!document.getElementById('openingOverlay')) {
      const el = document.createElement('div');
      el.innerHTML = this._buildRitualCard({
        id: 'openingOverlay', textId: 'openingRitualText', type: 'opening',
        action: 'ritual-opening', label: 'Enter the space', buttonText: 'Enter the Space',
      });
      const root = document.getElementById('app-container') || document.body;
      root.appendChild(el.firstElementChild);
    }
  }

  _showRitualImmediately() {
    const overlay = document.getElementById('openingOverlay');
    if (!overlay) return;

    const textEl = document.getElementById('openingRitualText');
    if (textEl) {
      textEl.textContent = `"${RITUAL_TEXTS[Math.floor(Math.random() * RITUAL_TEXTS.length)]}"`;
    }

    document.body.classList.add('ritual-active');
    overlay.classList.add('active');
  }

  // ---------------------------------------------------------------------------
  // Script / Style Loading
  // ---------------------------------------------------------------------------

  loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
    document.head.appendChild(link);
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = Object.assign(document.createElement('script'), { src });
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.body.appendChild(script);
    });
  }

  // Convenience: prepend base path and load
  _load(path) {
    return this.loadScript(`${BASE_PATH}/${path}`);
  }

  _loadAll(paths) {
    return Promise.all(paths.map(p => this._load(p)));
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  async initializeCommunityHub() {
    try {
      this.loadStylesheet(`${BASE_PATH}/community-hub.css`);

      // Group 1: CDN + core system
      await Promise.all([
        this.loadScript('https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js'),
        this._load('js/core.js'),
        this._load('js/supabase-client.js'),
        this._load('js/community-supabase.js'),
      ]);

      // Group 2: Modules dependent on core
      await this._loadAll([
        'js/rituals.js',
        'js/profile-module.js',
        'js/community-module.js',
        'js/member-profile-modal.js',
        'js/WhisperModal.js',
        'js/SafetyBar.js',
        'js/AdminDashboard.js',
        'js/collective-field-db.js',
        'js/Rooms/PracticeRoom.js',
      ]);

      // Group 3: Mixins + Lunar/Solar foundations
      await this._loadAll([
        'js/Rooms/mixins/YouTubePlayerMixin.js',
        'js/Rooms/mixins/CycleStateMixin.js',
        'js/Rooms/mixins/ChatMixin.js',
        'js/Rooms/mixins/SoundSettingsMixin.js',
        'js/Rooms/mixins/TimerMixin.js',
        'js/Solar/solar-config.js',
        'js/Lunar/lunar-core.js',
        'js/Lunar/lunar-ui.js',
        'js/Lunar/lunar-config.js',
        'js/Lunar/lunarengine.js',
      ]);

      // Group 3b: Composite classes that depend on Group 3 mixins
      // Must be sequential - TimedVideoRoom extends YouTubePlayerMixin + CycleStateMixin,
      // and TabRoomMixin is used by rooms in Group 4b.
      await this._loadAll([
        'js/Rooms/mixins/TimedVideoRoom.js',
        'js/Rooms/mixins/TabRoomMixin.js',
      ]);

      // Init LunarEngine early - lunar rooms need currentMoonData
      window.LunarEngine?.init?.();

      // Group 4a: Solar UI must precede base room (sequential)
      await this._load('js/Solar/solar-ui.js');
      await this._load('js/Solar/solar-base-room.js');

      // Group 4b: All rooms + dynamic sections (parallel)
      await this._loadAll([
        'js/Rooms/silent-room.js',
        'js/Rooms/guided-room.js',
        'js/Rooms/osho-room.js',
        'js/Rooms/breathwork-room.js',
        'js/Rooms/deepwork-room.js',
        'js/Rooms/campfire-room.js',
        'js/Rooms/tarot-room.js',
        'js/Rooms/reiki-room.js',
        'js/active-members.js',
        'js/collective-field.js',
        'js/resonance.js',
        'js/upcoming-events.js',
      ]);

      // Group 5: Engines last
      await this._load('js/Solar/solarengine.js');

      // Boot Core
      if (!window.Core?.init) throw new Error('Core module not found');

      window.Core.init();

      if (window.Rituals) window.Rituals.state.hasSeenOpening = false;
      if (window.CollectiveFieldDB) await window.CollectiveFieldDB.init();

    } catch (err) {
      console.error('❌ Failed to load Community Hub:', err);
      const main = document.getElementById('community-hub-main-content');
      if (main) {
        main.innerHTML = `
          <div class="card" style="text-align:center; padding:var(--spacing-xl)">
            <h3 style="color:var(--neuro-text)">Failed to Load</h3>
            <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
            <p style="color:var(--neuro-text-lighter); font-size:0.9rem; margin-top:1rem">${err.message}</p>
          </div>`;
      }
    }
  }
}

console.log('🌟 Loading Community Hub...');
export default CommunityHubEngine;
