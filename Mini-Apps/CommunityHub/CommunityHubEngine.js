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

    // Render wrapper with header
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

    // Initialize once
    if (!this.initialized) {
      await this.initializeCommunityHub();
      this.initialized = true;
    } else if (window.Core?.init) {
      window.Core.init();
    }
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