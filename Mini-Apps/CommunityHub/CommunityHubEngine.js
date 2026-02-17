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

    // Render Community Hub dashboard (stays in tab container)
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

    // Initialize once
    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
    } else if (window.Core?.init) {
      window.Core.init();
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
      display: block;
      overflow: auto;
      pointer-events: none;
    `;

    container.innerHTML = `
      <!-- Ritual Overlays (at fullscreen level) -->
      <div class="ritual-overlay opening" id="openingOverlay" role="dialog" aria-labelledby="openingRitualText" 
           style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100000; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.95); pointer-events: auto;">
          <div class="ritual-card" style="text-align: center; color: white; padding: 40px;">
              <div class="ritual-candle" aria-hidden="true" style="font-size: 48px; margin-bottom: 20px;">🕯️</div>
              <div class="ritual-text" id="openingRitualText" style="font-size: 24px; margin-bottom: 30px; font-style: italic;">"Enter with intention, leave with gratitude"</div>
              <button class="ritual-btn" data-action="ritual-opening" aria-label="Enter the space" 
                      style="padding: 12px 32px; font-size: 16px; background: white; color: black; border: none; border-radius: 8px; cursor: pointer;">
                  Enter the Space
              </button>
          </div>
      </div>

      <div class="ritual-overlay closing" id="closingOverlay" role="dialog" aria-labelledby="closingRitualText"
           style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 100000; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.95); pointer-events: auto;">
          <div class="ritual-card" style="text-align: center; color: white; padding: 40px;">
              <div class="ritual-candle" aria-hidden="true" style="font-size: 48px; margin-bottom: 20px;">🕯️</div>
              <div class="ritual-text" id="closingRitualText" style="font-size: 24px; margin-bottom: 30px; font-style: italic;">"Thank you for holding space with us"</div>
              <button class="ritual-btn" data-action="ritual-closing" aria-label="Close gently"
                      style="padding: 12px 32px; font-size: 16px; background: white; color: black; border: none; border-radius: 8px; cursor: pointer;">
                  Close Gently
              </button>
          </div>
      </div>

      <!-- Practice Room View (fullscreen) -->
      <div id="practiceRoomView" class="view" style="min-height: 100vh; padding: 0; margin: 0;">
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

      // Load stylesheets
      this.loadStylesheet('/Mini-Apps/CommunityHub/community-hub.css');
      this.loadStylesheet('/Mini-Apps/CommunityHub/lunar-styles.css');
      this.loadStylesheet('/Mini-Apps/CommunityHub/solar-styles.css');

      // Load external dependencies
      await this.loadScript('https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js');
      await this.loadScript('https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.min.js');

      // Load core system
      await this.loadScript('/Mini-Apps/CommunityHub/js/core.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/supabase-client.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/rituals.js');

      // Load modules
      await this.loadScript('/Mini-Apps/CommunityHub/js/profile-module.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/community-module.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/SafetyBar.js');

      // Load practice room base & mixins
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/PracticeRoom.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/YouTubePlayerMixin.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/CycleStateMixin.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/ChatMixin.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/SoundSettingsMixin.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/mixins/TimerMixin.js');

      // Load practice rooms
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/silent-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/guided-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/osho-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/breathwork-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/deepwork-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/campfire-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/tarot-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Rooms/reiki-room.js');

      // Load lunar system
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-core.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-ui.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunar-config.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/lunarengine.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/newmoon-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/waxingmoon-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/fullmoon-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Lunar/waningmoon-room.js');

      // Load solar system
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-constants.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-config.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-ui.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solar-base-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/winter-solar-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/spring-solar-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/summer-solar-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/autumn-solar-room.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/Solar/solarengine.js');

      // Load dynamic sections
      await this.loadScript('/Mini-Apps/CommunityHub/js/active-members.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/collective-field.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/resonance.js');
      await this.loadScript('/Mini-Apps/CommunityHub/js/upcoming-events.js');

      // Initialize Core
      if (window.Core?.init) {
        window.Core.init();
        
        // Give DOM a moment to settle, then show opening ritual
        setTimeout(() => {
          console.log('🔍 Checking for opening ritual...');
          console.log('Rituals object:', window.Rituals);
          console.log('Has seen opening:', window.Rituals?.state?.hasSeenOpening);
          
          const overlay = document.getElementById('openingOverlay');
          console.log('Opening overlay element:', overlay);
          
          if (window.Rituals && !window.Rituals.state.hasSeenOpening) {
            console.log('✅ Triggering opening ritual...');
            window.Rituals.showOpening();
          } else {
            console.log('⏭️ Skipping opening ritual (already seen)');
          }
        }, 300);
        
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