/**
 * CommunityHubEngine.js - Community Hub Integration Engine
 * Integrates the Community Hub into the main Curiosity Path application
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

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

    // Render main layout
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
            <main id="community-hub-main-content"></main>
          </div>

        </div>
      </div>
    `;

    // Initialize Community Hub on first load
    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
    } else if (window.Core?.init) {
      // Re-render if already initialized
      window.Core.init();
    }
  }

  async initializeCommunityHub() {
    try {
      console.log('🌟 Loading Community Hub...');

      const mainContent = document.getElementById('community-hub-main-content');
      
      // Inject Community Hub HTML structure
      mainContent.innerHTML = `
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

        <!-- Ritual Overlays -->
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

        <!-- Main Hub View -->
        <div id="hubView" class="view active">
            <!-- Profile Hero -->
            <div id="profileHeroContainer"></div>

            <!-- Sanctuary Content -->
            <div class="sanctuary-content">
                <!-- Dynamic Sections -->
                <div id="activeMembersContainer"></div>
                <div id="collectiveFieldContainer"></div>
                <div id="resonanceContainer"></div>

                <!-- Practice Spaces Section -->
                <section class="section" aria-labelledby="practiceSpacesTitle">
                    <div class="section-header">
                        <div class="section-title" id="practiceSpacesTitle">Practice Spaces</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Choose your practice</div>
                    </div>
                    <div class="rooms-grid" id="roomsGrid"></div>
                </section>

                <!-- Celestial Cycles Section -->
                <section class="section" aria-labelledby="celestialCyclesTitle">
                    <div class="section-header">
                        <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Practice with nature's rhythms</div>
                    </div>
                    
                    <div id="lunarContainer" class="celestial-container"></div>
                    <div id="solarContainer" class="celestial-container"></div>
                </section>

                <!-- Community Sections -->
                <div id="communityReflectionsContainer"></div>
                <div id="upcomingEventsContainer"></div>
            </div>
        </div>

        <!-- Practice Room View -->
        <div id="practiceRoomView" class="view">
            <div class="practice-room-container">
                <button class="back-to-hub-btn" 
                        data-action="back-to-hub" 
                        aria-label="Back to hub">
                    ← Back to Hub
                </button>
                <div id="dynamicRoomContent"></div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div class="toast" id="toast" role="alert" aria-live="assertive"></div>
      `;

      // Load stylesheets
      await this.loadStylesheets();

      // Load external dependencies
      await this.loadExternalDependencies();

      // Load Community Hub scripts in order
      await this.loadCommunityHubScripts();

      // Initialize Core
      if (window.Core && typeof window.Core.init === 'function') {
        window.Core.init();
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

  async loadStylesheets() {
    const stylesheets = [
      '/Mini-Apps/CommunityHub/community-hub.css',
      '/Mini-Apps/CommunityHub/lunar-styles.css',
      '/Mini-Apps/CommunityHub/solar-styles.css'
    ];

    for (const href of stylesheets) {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    }
  }

  async loadExternalDependencies() {
    const dependencies = [
      { src: 'https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js', name: 'SunCalc' },
      { src: 'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.min.js', name: 'Astronomy' }
    ];

    for (const dep of dependencies) {
      if (!document.querySelector(`script[src="${dep.src}"]`)) {
        await this.loadScript(dep.src);
        console.log(`✓ Loaded ${dep.name}`);
      }
    }
  }

  async loadCommunityHubScripts() {
    const basePath = '/Mini-Apps/CommunityHub/js';
    
    const scripts = [
      // Core System
      `${basePath}/core.js`,
      `${basePath}/supabase-client.js`,
      `${basePath}/rituals.js`,
      
      // Modules
      `${basePath}/profile-module.js`,
      `${basePath}/community-module.js`,
      `${basePath}/SafetyBar.js`,
      
      // Practice Room Base & Mixins
      `${basePath}/Rooms/PracticeRoom.js`,
      `${basePath}/Rooms/mixins/YouTubePlayerMixin.js`,
      `${basePath}/Rooms/mixins/CycleStateMixin.js`,
      `${basePath}/Rooms/mixins/ChatMixin.js`,
      `${basePath}/Rooms/mixins/SoundSettingsMixin.js`,
      `${basePath}/Rooms/mixins/TimerMixin.js`,
      
      // Practice Rooms
      `${basePath}/Rooms/silent-room.js`,
      `${basePath}/Rooms/guided-room.js`,
      `${basePath}/Rooms/osho-room.js`,
      `${basePath}/Rooms/breathwork-room.js`,
      `${basePath}/Rooms/deepwork-room.js`,
      `${basePath}/Rooms/campfire-room.js`,
      `${basePath}/Rooms/tarot-room.js`,
      `${basePath}/Rooms/reiki-room.js`,
      
      // Lunar System
      `${basePath}/Lunar/lunar-core.js`,
      `${basePath}/Lunar/lunar-ui.js`,
      `${basePath}/Lunar/lunar-config.js`,
      `${basePath}/Lunar/lunarengine.js`,
      `${basePath}/Lunar/newmoon-room.js`,
      `${basePath}/Lunar/waxingmoon-room.js`,
      `${basePath}/Lunar/fullmoon-room.js`,
      `${basePath}/Lunar/waningmoon-room.js`,
      
      // Solar System
      `${basePath}/Solar/solar-constants.js`,
      `${basePath}/Solar/solar-config.js`,
      `${basePath}/Solar/solar-ui.js`,
      `${basePath}/Solar/solar-base-room.js`,
      `${basePath}/Solar/winter-solar-room.js`,
      `${basePath}/Solar/spring-solar-room.js`,
      `${basePath}/Solar/summer-solar-room.js`,
      `${basePath}/Solar/autumn-solar-room.js`,
      `${basePath}/Solar/solarengine.js`,
      
      // Dynamic Sections
      `${basePath}/active-members.js`,
      `${basePath}/collective-field.js`,
      `${basePath}/resonance.js`,
      `${basePath}/upcoming-events.js`
    ];

    // Load scripts sequentially to maintain dependencies
    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await this.loadScript(src);
      }
    }
    
    console.log('✓ All Community Hub scripts loaded');
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }

  destroy() {
    // Clean up if needed
    this.initialized = false;
    console.log('🗑️ Community Hub destroyed');
  }
}

export default CommunityHubEngine;
