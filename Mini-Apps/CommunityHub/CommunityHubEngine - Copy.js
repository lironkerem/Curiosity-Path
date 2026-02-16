/**
 * CommunityHubEngine.js - LIGHTWEIGHT VERSION
 * Loads Community Hub ONLY when tab is clicked (lazy loading)
 * Prevents browser freeze by not blocking initialization
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

class CommunityHubEngine {
  constructor(app) {
    this.app = app;
    this.initialized = false;
    this.loading = false;
  }

  async render() {
    const tab = document.getElementById('community-hub-tab');
    
    if (!tab) {
      console.error('[CommunityHub] Tab element not found');
      return;
    }

    // Show loading state immediately
    if (!this.initialized && !this.loading) {
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

            <div class="card" style="padding:2rem; text-align:center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🌟</div>
              <h2 style="color: var(--neuro-text);">Loading Community Hub...</h2>
              <p style="color: var(--neuro-text-light); margin-top: 1rem;">
                Preparing your sacred space...
              </p>
              <div style="margin-top: 2rem;">
                <div class="loading-spinner"></div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Load asynchronously without blocking
      this.initializeCommunityHub().catch(err => {
        console.error('[CommunityHub] Failed to load:', err);
        this.showError(err);
      });
      
      return;
    }

    // Already initialized - just show it
    if (this.initialized && window.Core) {
      window.Core.init();
    }
  }

  async initializeCommunityHub() {
    if (this.loading) return; // Prevent duplicate loads
    this.loading = true;

    try {
      console.log('🌟 Loading Community Hub...');

      const tab = document.getElementById('community-hub-tab');
      const mainContent = document.getElementById('community-hub-main-content');

      // Step 1: Load stylesheets (non-blocking)
      this.loadStylesheets();

      // Step 2: Load external dependencies
      await this.loadExternalDependencies();

      // Step 3: Inject HTML structure
      if (!mainContent) {
        this.injectHTML(tab);
      }

      // Step 4: Load Community Hub scripts with timeout protection
      await this.loadCommunityHubScriptsWithTimeout();

      // Step 5: Initialize Core
      if (window.Core && typeof window.Core.init === 'function') {
        window.Core.init();
        this.initialized = true;
        console.log('✅ Community Hub loaded successfully');
      } else {
        throw new Error('Core module not found after loading scripts');
      }

    } catch (err) {
      console.error('❌ Failed to load Community Hub:', err);
      this.showError(err);
    } finally {
      this.loading = false;
    }
  }

  injectHTML(tab) {
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
            <main id="community-hub-main-content">
              <!-- Season Flash -->
              <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

              <!-- WhatsApp Link -->
              <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="whatsapp-float"
                 aria-label="Join Community Chat">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                       alt="WhatsApp" width="24" height="24">
                  <span>Join our Community Chat</span>
              </a>

              <!-- Ritual Overlays -->
              <div class="ritual-overlay opening" id="openingOverlay">
                  <div class="ritual-card">
                      <div class="ritual-candle"></div>
                      <div class="ritual-text" id="openingRitualText">
                        "Enter with intention, leave with gratitude"
                      </div>
                      <button class="ritual-btn" data-action="ritual-opening">Enter the Space</button>
                  </div>
              </div>

              <div class="ritual-overlay closing" id="closingOverlay">
                  <div class="ritual-card">
                      <div class="ritual-candle"></div>
                      <div class="ritual-text" id="closingRitualText">
                        "Thank you for holding space with us"
                      </div>
                      <button class="ritual-btn" data-action="ritual-closing">Close Gently</button>
                  </div>
              </div>

              <!-- Hub View -->
              <div id="hubView" class="view active">
                  <div id="profileHeroContainer"></div>
                  <div class="sanctuary-content">
                      <div id="activeMembersContainer"></div>
                      <div id="collectiveFieldContainer"></div>
                      <div id="resonanceContainer"></div>

                      <section class="section">
                          <div class="section-header">
                              <div class="section-title">Practice Spaces</div>
                              <div style="font-size: 12px; color: var(--text-muted);">
                                Choose your practice
                              </div>
                          </div>
                          <div class="rooms-grid" id="roomsGrid"></div>
                      </section>

                      <section class="section">
                          <div class="section-header">
                              <div class="section-title">Celestial Cycles</div>
                              <div style="font-size: 12px; color: var(--text-muted);">
                                Practice with nature's rhythms
                              </div>
                          </div>
                          <div id="lunarContainer" class="celestial-container"></div>
                          <div id="solarContainer" class="celestial-container"></div>
                      </section>

                      <div id="communityReflectionsContainer"></div>
                      <div id="upcomingEventsContainer"></div>
                  </div>
              </div>

              <!-- Practice Room View -->
              <div id="practiceRoomView" class="view">
                  <div class="practice-room-container">
                      <button class="back-to-hub-btn" data-action="back-to-hub">
                        ← Back to Hub
                      </button>
                      <div id="dynamicRoomContent"></div>
                  </div>
              </div>

              <!-- Toast -->
              <div class="toast" id="toast" role="alert"></div>
            </main>
          </div>
        </div>
      </div>
    `;
  }

  loadStylesheets() {
    const stylesheets = [
      '/Mini-Apps/CommunityHub/community-hub.css',
      '/Mini-Apps/CommunityHub/lunar-styles.css',
      '/Mini-Apps/CommunityHub/solar-styles.css'
    ];

    stylesheets.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onerror = () => console.warn(`[CommunityHub] Failed to load CSS: ${href}`);
        document.head.appendChild(link);
      }
    });
  }

  async loadExternalDependencies() {
    const dependencies = [
      'https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js',
      'https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.min.js'
    ];

    const promises = dependencies.map(src => 
      this.loadScript(src).catch(err => {
        console.warn(`[CommunityHub] Optional dependency failed: ${src}`);
        return null; // Don't fail entire load
      })
    );

    await Promise.allSettled(promises);
  }

  async loadCommunityHubScriptsWithTimeout() {
    const TIMEOUT = 10000; // 10 second timeout
    
    const loadPromise = this.loadCommunityHubScripts();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Script loading timeout')), TIMEOUT)
    );

    return Promise.race([loadPromise, timeoutPromise]);
  }

  async loadCommunityHubScripts() {
    const basePath = '/Mini-Apps/CommunityHub/js';
    
    const scriptGroups = [
      // Core (critical)
      [
        `${basePath}/core.js`,
        `${basePath}/rituals.js`
      ],
      // Modules (important)
      [
        `${basePath}/profile-module.js`,
        `${basePath}/community-module.js`,
        `${basePath}/SafetyBar.js`
      ],
      // Practice Rooms (can fail gracefully)
      [
        `${basePath}/Rooms/PracticeRoom.js`,
        `${basePath}/Rooms/mixins/YouTubePlayerMixin.js`,
        `${basePath}/Rooms/mixins/CycleStateMixin.js`,
        `${basePath}/Rooms/mixins/ChatMixin.js`,
        `${basePath}/Rooms/mixins/SoundSettingsMixin.js`,
        `${basePath}/Rooms/mixins/TimerMixin.js`
      ]
    ];

    // Load critical scripts first
    for (const group of scriptGroups) {
      await Promise.allSettled(
        group.map(src => this.loadScript(src))
      );
    }

    // Load remaining scripts without blocking
    this.loadRemainingScriptsAsync(basePath);
  }

  loadRemainingScriptsAsync(basePath) {
    const remainingScripts = [
      // Rooms
      `${basePath}/Rooms/silent-room.js`,
      `${basePath}/Rooms/guided-room.js`,
      `${basePath}/Rooms/osho-room.js`,
      `${basePath}/Rooms/breathwork-room.js`,
      `${basePath}/Rooms/deepwork-room.js`,
      `${basePath}/Rooms/campfire-room.js`,
      `${basePath}/Rooms/tarot-room.js`,
      `${basePath}/Rooms/reiki-room.js`,
      
      // Lunar
      `${basePath}/Lunar/lunar-core.js`,
      `${basePath}/Lunar/lunar-ui.js`,
      `${basePath}/Lunar/lunar-config.js`,
      `${basePath}/Lunar/lunarengine.js`,
      `${basePath}/Lunar/newmoon-room.js`,
      `${basePath}/Lunar/waxingmoon-room.js`,
      `${basePath}/Lunar/fullmoon-room.js`,
      `${basePath}/Lunar/waningmoon-room.js`,
      
      // Solar
      `${basePath}/Solar/solar-constants.js`,
      `${basePath}/Solar/solar-config.js`,
      `${basePath}/Solar/solar-ui.js`,
      `${basePath}/Solar/solar-base-room.js`,
      `${basePath}/Solar/winter-solar-room.js`,
      `${basePath}/Solar/spring-solar-room.js`,
      `${basePath}/Solar/summer-solar-room.js`,
      `${basePath}/Solar/autumn-solar-room.js`,
      `${basePath}/Solar/solarengine.js`,
      
      // Modules
      `${basePath}/active-members.js`,
      `${basePath}/collective-field.js`,
      `${basePath}/resonance.js`,
      `${basePath}/upcoming-events.js`
    ];

    // Load in background without blocking
    setTimeout(() => {
      remainingScripts.forEach(src => {
        this.loadScript(src).catch(err => 
          console.warn(`[CommunityHub] Optional script failed: ${src}`)
        );
      });
    }, 100);
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve();
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.async = false; // Maintain order
      
      const timeout = setTimeout(() => {
        reject(new Error(`Script load timeout: ${src}`));
      }, 5000);
      
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load: ${src}`));
      };
      
      document.body.appendChild(script);
    });
  }

  showError(err) {
    const tab = document.getElementById('community-hub-tab');
    if (!tab) return;

    tab.innerHTML = `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShadow.png');">
            <h1>Community Hub</h1>
            <h3>A space for mindful practice and togetherness</h3>
          </header>

          <div class="card" style="padding:3rem; text-align:center;">
            <div style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.5;">⚠️</div>
            <h2 style="color: var(--neuro-text);">Unable to Load Community Hub</h2>
            <p style="color: var(--neuro-text-light); margin: 1rem 0;">
              Some resources couldn't be loaded. Please check your connection and try again.
            </p>
            <details style="margin-top: 2rem; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
              <summary style="cursor: pointer; color: var(--neuro-text-light); font-size: 0.9rem;">
                Technical Details
              </summary>
              <pre style="background: var(--neuro-surface); padding: 1rem; border-radius: 8px; overflow: auto; margin-top: 1rem; font-size: 0.85rem; color: var(--neuro-text-lighter);">${err.message}</pre>
            </details>
            <button onclick="location.reload()" 
                    style="margin-top: 2rem; padding: 1rem 2rem; background: var(--neuro-accent); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    this.initialized = false;
    this.loading = false;
    console.log('🗑️ Community Hub destroyed');
  }
}

export default CommunityHubEngine;
