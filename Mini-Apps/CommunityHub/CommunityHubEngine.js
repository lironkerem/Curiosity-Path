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

    // Create fullscreen container FIRST (before any content, so rituals can work)
    this.createFullscreenRoomContainer();

    // Only build the HTML on first load - don't wipe it on re-visits
    if (!this.initialized) {
      tab.innerHTML = `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png');
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

    // Initialize once
    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
    } else {
      // Re-visit: reset Core so it re-renders all sections
      if (window.Core) {
        window.Core.state.initialized = false;
        window.Core.init();
      }
      // Show opening ritual on every tab re-visit
      if (window.Rituals) {
        window.Rituals.state.hasSeenOpening = false;
        window.Rituals.showOpening();
      }
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
      pointer-events: none;
    `;

    container.innerHTML = `
      <!-- Ritual Overlays (at fullscreen level) -->
      <div class="ritual-overlay opening" id="openingOverlay" role="dialog" aria-labelledby="openingRitualText">
          <div class="ritual-card">
              <div class="ritual-candle" aria-hidden="true"></div>
              <div class="ritual-text" id="openingRitualText">"Enter with intention, leave with gratitude"</div>
              <button class="ritual-btn" data-action="ritual-opening" aria-label="Enter the space">
                  Enter the Space
              </button>
          </div>
      </div>

      <div class="ritual-overlay closing" id="closingOverlay" role="dialog" aria-labelledby="closingRitualText">
          <div class="ritual-card">
              <div class="ritual-candle" aria-hidden="true"></div>
              <div class="ritual-text" id="closingRitualText">"Thank you for holding space with us"</div>
              <button class="ritual-btn" data-action="ritual-closing" aria-label="Close gently">
                  Close Gently
              </button>
          </div>
      </div>

      <!-- Practice Room View (fullscreen) -->
      <div id="practiceRoomView" class="view" style="min-height: 100vh; padding: 0; margin: 0; display: none;">
          <div class="practice-room-container" style="padding: 0; margin: 0;">
              <button class="back-to-hub-btn" 
                      data-action="back-to-hub" 
                      aria-label="Back to hub"
                      style="margin: 20px;">
                  ← Back to Hub
              </button>
              <div id="dynamicRoomContent"></div>
          </div>
      </div>
    `;

    document.body.appendChild(container);
    console.log('✓ Fullscreen room container created');
  }

  async initializeCommunityHub() {
    try {
      console.log('🌟 Loading Community Hub...');

      // Stylesheets - all parallel, non-blocking
      this.loadStylesheet('/Mini-Apps/CommunityHub/community-hub.css');
      this.loadStylesheet('/Mini-Apps/CommunityHub/lunar-styles.css');
      this.loadStylesheet('/Mini-Apps/CommunityHub/solar-styles.css');

      // GROUP 1: External CDN deps + core system in parallel
      await Promise.all([
        this.loadScript('https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js'),
        this.loadScript('https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.min.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/core.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/supabase-client.js'),
      ]);

      // GROUP 2: Modules that depend on core (parallel)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/rituals.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/profile-module.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/community-module.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/SafetyBar.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/PracticeRoom.js'), // base class needed before mixins
      ]);

      // GROUP 3: Mixins (depend on PracticeRoom base, load in parallel)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/YouTubePlayerMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/CycleStateMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/ChatMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/SoundSettingsMixin.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/TimerMixin.js'),
        // Solar constants must come before solar rooms
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-constants.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-config.js'),
        // Lunar core must come before lunar rooms
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-core.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-ui.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-config.js'),
      ]);

      // GROUP 4: All rooms + solar/lunar UI in parallel (deps from group 3 satisfied)
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
        // Solar base (needed before season rooms)
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-ui.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-base-room.js'),
        // Lunar engine
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunarengine.js'),
        // Dynamic sections
        this.loadScript('/Mini-Apps/CommunityHub/js/active-members.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/collective-field.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/resonance.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/upcoming-events.js'),
      ]);

      // GROUP 5: Season rooms + lunar rooms (depend on base classes from group 4)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/winter-solar-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/spring-solar-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/summer-solar-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/autumn-solar-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/newmoon-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/waxingmoon-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/fullmoon-room.js'),
        this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/waningmoon-room.js'),
      ]);

      // GROUP 6: Engines last (depend on all rooms being registered)
      await Promise.all([
        this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solarengine.js'),
      ]);

      // Initialize Core
      if (window.Core?.init) {
        window.Core.init();
        // Show opening ritual now that everything is ready
        if (window.Rituals) {
          window.Rituals.state.hasSeenOpening = false;
          window.Rituals.showOpening();
        }
        console.log('✅ Community Hub loaded successfully');
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
}

export default CommunityHubEngine;