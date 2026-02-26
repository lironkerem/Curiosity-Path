// Mini-Apps/CommunityHub/CommunityHubEngine.js - Big-App Integration Engine
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

    // Create fullscreen container FIRST
    this.createFullscreenRoomContainer();

    // Only build the HTML on first load - don't wipe it on re-visits
    if (!this.initialized) {
      tab.innerHTML = `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh; position: relative;">
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
            <!-- Season Flash Notification -->
            <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

            <!-- WhatsApp Community Link -->
            <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="whatsapp-float"
               aria-label="Join our Community Chat on WhatsApp">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                     alt="WhatsApp" 
                     width="24" 
                     height="24">
                <span>Join our Community Chat</span>
            </a>

            <!-- Main Hub View -->
            <div id="hubView" class="view active">
                <!-- Profile Hero - Dynamically rendered -->
                <div id="profileHeroContainer"></div>

                <!-- Sanctuary Content -->
                <div class="sanctuary-content">
                    <!-- Active Members - Dynamically rendered -->
                    <div id="activeMembersContainer"></div>

                    <!-- Collective Field - Dynamically rendered -->
                    <div id="collectiveFieldContainer"></div>

                    <!-- Resonance - Dynamically rendered (currently disabled) -->
                    <div id="resonanceContainer"></div>

                    <!-- Practice Spaces Section -->
                    <section class="section" aria-labelledby="practiceSpacesTitle">
                        <div class="section-header">
                            <div class="section-title" id="practiceSpacesTitle">Practice Spaces</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Choose your practice</div>
                        </div>
                        <div class="rooms-grid" id="roomsGrid">
                            <!-- Rooms dynamically rendered by core.js -->
                        </div>
                    </section>

                    <!-- Celestial Cycles Section -->
                    <section class="section" aria-labelledby="celestialCyclesTitle">
                        <div class="section-header">
                            <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                            <div style="font-size: 12px; color: var(--text-muted);">Practice with nature's rhythms</div>
                        </div>
                        
                        <!-- Lunar Phases -->
                        <div id="lunarContainer" class="celestial-container">
                            <!-- Lunar rooms dynamically rendered -->
                        </div>

                        <!-- Solar Seasons -->
                        <div id="solarContainer" class="celestial-container">
                            <!-- Solar rooms dynamically rendered -->
                        </div>
                    </section>

                    <!-- Community Reflections - Dynamically rendered -->
                    <div id="communityReflectionsContainer"></div>

                    <!-- Upcoming Events - Dynamically rendered -->
                    <div id="upcomingEventsContainer"></div>
                </div>
            </div>

            <!-- Toast Notifications -->
            <div class="toast" id="toast" role="alert" aria-live="assertive"></div>
          </div>

        </div>
      </div>
    `;
    } // end if (!this.initialized)

    // Show ritual immediately before scripts load - pick random text inline
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this._showRitualImmediately();
      });
    });

    // Initialize once
    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
        console.log('✅ Community Hub loaded successfully');
    } else {
      // Re-visit: reset Core so it re-renders all sections
      if (window.Core) {
        window.Core.state.initialized = false;
        window.Core.init();
      }
      if (window.Rituals) {
        window.Rituals.state.hasSeenOpening = false;
      }
    }
  }

  /**
   * Show the opening ritual overlay immediately to prevent content blink
   * Called before tab content renders
   */
  _showRitualImmediately() {
    const overlay = document.getElementById('openingOverlay');
    if (overlay) {
      const texts = [
        "Enter with intention, leave with gratitude",
        "This space holds you. Enter with presence.",
        "Breathe in. You are welcome here.",
        "Leave the noise behind. Step into stillness.",
        "You are exactly where you need to be.",
        "Enter gently. This moment is yours.",
        "Set down what you carry. Enter with an open heart.",
        "The space is ready. So are you.",
        "Come as you are. This is a place of welcome.",
        "Arrive fully. Begin with intention."
      ];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const textEl = document.getElementById('openingRitualText');
      if (textEl) textEl.textContent = `"${randomText}"`;

      document.body.classList.add('ritual-active');
      overlay.classList.add('active');
    }
  }

  /**
   * Creates a fullscreen container for practice rooms at body level
   * This allows rooms to break free from the app's card containers
   */
  createFullscreenRoomContainer() {
    // Check if container already exists
    if (document.getElementById('communityHubFullscreenContainer')) {
      return;
    }

    const container = document.createElement('div');
    container.id = 'communityHubFullscreenContainer';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99999;
      background: transparent;
      display: none;
      overflow: auto;
      pointer-events: auto;
    `;

    container.innerHTML = `
      <!-- Closing Ritual Overlay only - opening is inside the tab -->
      <div class="ritual-overlay closing" id="closingOverlay" role="dialog" aria-labelledby="closingRitualText">
          <div class="ritual-card">
              <div class="ritual-candle" aria-hidden="true">
                ${this._buildCandleSVG('c')}
              </div>
              <div class="ritual-text" id="closingRitualText"></div>
              <button class="ritual-btn" data-action="ritual-closing" aria-label="Close gently">
                  Close Gently
              </button>
          </div>
      </div>

      <!-- Room renders directly here -->
      <div id="dynamicRoomContent" style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow-y: auto; overflow-x: hidden;"></div>
    `;

    document.body.appendChild(container);

    // Inject opening overlay directly into app-container (or body) as fixed
    // This ensures it covers everything: header, nav, content, footer
    if (!document.getElementById('openingOverlay')) {
      const openingOverlay = document.createElement('div');
      openingOverlay.innerHTML = `
        <div id="openingOverlay" class="ritual-overlay opening" role="dialog">
            <div class="ritual-card">
                <div class="ritual-candle" aria-hidden="true">
                  ${this._buildCandleSVG('o')}
                </div>
                <div class="ritual-text" id="openingRitualText"></div>
                <button class="ritual-btn" data-action="ritual-opening" aria-label="Enter the space">
                    Enter the Space
                </button>
            </div>
        </div>
      `;
      const appContainer = document.getElementById('app-container') || document.body;
      appContainer.appendChild(openingOverlay.firstElementChild);
    }

  }

  async initializeCommunityHub() {
    try {

      // Stylesheets
      this.loadStylesheet('/Mini-Apps/CommunityHub/community-hub.css');

      // GROUP 1: External CDN deps + core system in parallel
      await Promise.all([
        this.loadScript('https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js'),

        this.loadScript('/Mini-Apps/CommunityHub/js/core.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/supabase-client.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/community-supabase.js'),
      ]);

      // GROUP 2: Modules that depend on core (parallel)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/rituals.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/profile-module.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/community-module.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/member-profile-modal.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/WhisperModal.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/SafetyBar.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/AdminDashboard.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/collective-field-db.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/PracticeRoom.js'), // base class needed before mixins
      ]);

      // GROUP 3: Mixins (depend on PracticeRoom base, load in parallel)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/YouTubePlayerMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/CycleStateMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/ChatMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/SoundSettingsMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/TimerMixin.js'),
        // Solar config (includes constants) must come before solar rooms
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-config.js'),
        // Lunar core must come before lunar rooms
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-core.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-ui.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-config.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunarengine.js'),
      ]);

      // Initialize LunarEngine now — lunar room configs (Group 5) need currentMoonData ready
      if (window.LunarEngine && typeof window.LunarEngine.init === 'function') {
        window.LunarEngine.init();
      }

      // GROUP 4a: Solar base must load sequentially (solar-ui → solar-base-room)
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-ui.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-base-room.js');

      // GROUP 4b: All rooms + remaining deps in parallel (BaseSolarRoom now guaranteed)
      // Solar season room files are loaded on-demand when user enters a room
      await Promise.all([
        // Practice rooms
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/silent-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/guided-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/osho-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/breathwork-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/deepwork-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/campfire-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/tarot-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/reiki-room.js'),
        // Dynamic sections
        this.loadScript('/Mini-Apps/CommunityHub/js/active-members.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/collective-field.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/resonance.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/upcoming-events.js'),
      ]);

      // GROUP 5: (Solar and Lunar room files are all loaded on-demand — nothing to load here)

      // GROUP 6: Engines last (depend on all rooms being registered)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solarengine.js'),
      ]);

      // Initialize Core
      if (window.Core?.init) {
        window.Core.init();
        if (window.Rituals) {
          window.Rituals.state.hasSeenOpening = false;
        }
        // Initialize Collective Field DB (realtime + polling)
        if (window.CollectiveFieldDB) {
          await window.CollectiveFieldDB.init();
        }
      } else {
        throw new Error('Core module not found');
      }

    } catch (err) {
      console.error('❌ Failed to load Community Hub:', err);
      const main = document.getElementById('community-hub-main-content');
      if (main) {
        main.innerHTML = `
          <div class="card" style="text-align:center;padding:var(--spacing-xl)">
            <h3 style="color:var(--neuro-text)">Failed to Load</h3>
            <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
            <p style="color:var(--neuro-text-lighter);font-size:0.9rem;margin-top:1rem">${err.message}</p>
          </div>
        `;
      }
    }
  }

  loadStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }

  /**
   * Generate candle SVG with unique gradient IDs
   * @param {string} idSuffix - Suffix for gradient IDs ('c' for closing, 'o' for opening)
   * @returns {string} SVG HTML
   */
  _buildCandleSVG(idSuffix) {
    return `
      <svg viewBox="0 0 48 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="flame-outer" cx="24" cy="16" rx="7" ry="11" fill="url(#flameGradOuter-${idSuffix})" opacity="0.9"/>
        <ellipse class="flame-inner" cx="24" cy="18" rx="4.5" ry="7.5" fill="url(#flameGradInner-${idSuffix})" opacity="0.95"/>
        <ellipse class="flame-core" cx="24" cy="20" rx="2" ry="3.5" fill="#fff9e6" opacity="0.95"/>
        <line x1="24" y1="26" x2="24" y2="29" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="14" y="29" width="20" height="34" rx="3" fill="url(#candleGrad-${idSuffix})"/>
        <path d="M14 35 Q11 38 12 43 Q13 46 14 48 L14 35Z" fill="url(#dripGrad-${idSuffix})" opacity="0.7"/>
        <path d="M34 38 Q37 41 36 46 Q35 48 34 49 L34 38Z" fill="url(#dripGrad-${idSuffix})" opacity="0.5"/>
        <ellipse cx="24" cy="29" rx="10" ry="2.5" fill="url(#topGrad-${idSuffix})"/>
        <rect x="17" y="31" width="4" height="28" rx="2" fill="white" opacity="0.08"/>
        <defs>
          <radialGradient id="flameGradOuter-${idSuffix}" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stop-color="#ffe066"/><stop offset="50%" stop-color="#ff9a00"/><stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameGradInner-${idSuffix}" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stop-color="#fff5c0"/><stop offset="60%" stop-color="#ffb830"/><stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="candleGrad-${idSuffix}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#c8a882"/><stop offset="40%" stop-color="#e8d0b0"/><stop offset="70%" stop-color="#d4b88a"/><stop offset="100%" stop-color="#b89060"/>
          </linearGradient>
          <linearGradient id="dripGrad-${idSuffix}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e8d0b0"/><stop offset="100%" stop-color="#c8a882" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="topGrad-${idSuffix}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f0dfc0"/><stop offset="100%" stop-color="#c8a882"/>
          </radialGradient>
        </defs>
      </svg>`;
  }
}

      console.log('🌟 Loading Community Hub...');
export default CommunityHubEngine;