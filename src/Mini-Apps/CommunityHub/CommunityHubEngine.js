// Mini-Apps/CommunityHub/CommunityHubEngine.js
// v3.0 - All room/utility scripts converted to ES module dynamic import()

import { CommunityDB }       from './js/community-supabase.js';
import { Core }              from './js/core.js';
import { MemberProfileModal } from './js/member-profile-modal.js';
import { WhisperModal }      from './js/WhisperModal.js';

const BASE_PATH = '/src/Mini-Apps/CommunityHub';

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
    } else {
      // Re-visit: only refresh presence-dependent UI, not the full Core init.
      // Full Core.init() re-fetches the current user + re-renders every section,
      // causing a visible flash and 2-4 extra DB calls on every tab switch (Issue #5).
      this._refreshHubPresence();
    }

    // Issue #1: suspend chat subscriptions when user leaves the Hub tab entirely
    this._attachHubVisibility();

    // Auto-open a room requested from an external CTA (e.g. Energy Tracker).
    // Fix #7: use a one-shot CustomEvent instead of a 200 ms setInterval poll,
    // so the JS thread isn't kept busy during initialisation.
    if (window._pendingRoomOpen) {
      const roomKey = window._pendingRoomOpen;
      window._pendingRoomOpen = null;

      const fn = window[`${roomKey}_enterRoom`];
      if (typeof fn === 'function') {
        fn();
      } else {
        // Room module not yet registered — listen for the ready signal.
        const handler = e => {
          if (e.detail?.roomKey !== roomKey) return;
          document.removeEventListener('practiceRoomReady', handler);
          window[`${roomKey}_enterRoom`]?.();
        };
        document.addEventListener('practiceRoomReady', handler);
        // Safety timeout: clean up listener after 8 s if room never registers.
        setTimeout(() => document.removeEventListener('practiceRoomReady', handler), 8000);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // HTML Builders
  // ---------------------------------------------------------------------------

  _buildTabHTML() {
    return `
      <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavCommunity.webp');
                         --header-title:'';
                         --header-tag:'A space for mindful practice and togetherness'">
            <h1>Community Hub</h1>
            <h3>A space for mindful practice and togetherness</h3>
            <span class="header-sub"></span>
          </header>

            <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

            <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4"
               target="_blank" rel="noopener noreferrer"
               class="whatsapp-float"
               aria-label="Join our Community Chat on WhatsApp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                   alt="" width="24" height="24" aria-hidden="true" role="presentation">
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
                  </div>
                  <div class="rooms-grid" id="roomsGrid"></div>
                </section>

                <section class="section" id="celestialLunarSection" aria-labelledby="celestialCyclesTitle">
                  <div class="section-header">
                    <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                  </div>
                  <div id="lunarContainer" class="celestial-container"></div>
                </section>

                <section class="section" id="celestialSolarSection" aria-label="Solar Cycles">
                  <div id="solarContainer" class="celestial-container"></div>
                </section>

                <div id="communityReflectionsContainer"></div>
                <div id="upcomingEventsContainer"></div>
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
    if (window.Rituals?.state?.hasSeenOpening) return;
    const overlay = document.getElementById('openingOverlay');
    if (!overlay) return;

    const textEl = document.getElementById('openingRitualText');
    if (textEl) {
      textEl.textContent = `"${RITUAL_TEXTS[Math.floor(Math.random() * RITUAL_TEXTS.length)]}"`;
    }

    document.body.classList.add('ritual-active');
    overlay.classList.add('active');

    // Auto-dismiss after 5 s (mirrors Rituals.config.OPENING_AUTO_CLOSE_MS)
    setTimeout(() => {
      if (window.Rituals) window.Rituals.completeOpening();
      else {
        overlay.classList.remove('active');
        document.body.classList.remove('ritual-active');
      }
    }, 5000);
  }

  // ---------------------------------------------------------------------------
  // Lightweight hub refresh on re-visit (Issue #5)
  // ---------------------------------------------------------------------------

  _refreshHubPresence() {
    // Re-run only the presence-sensitive parts: active member count, room card
    // participant counts, and CollectiveField — not a full user/profile reload.
    try {
      if (window.PracticeRoom?._hubRooms?.length) {
        PracticeRoom.startHubPresence();
      }
      if (window.CollectiveFieldDB?.refreshCount) {
        window.CollectiveFieldDB.refreshCount();
      }
    } catch (e) {
      // Fallback: full init if lightweight refresh isn't available yet
      console.warn('[CommunityHub] _refreshHubPresence fallback to Core.init', e);
      Core.state.initialized = false;
      Core.init();
    }
  }

  // ---------------------------------------------------------------------------
  // YouTube API preload (Issue #4)
  // ---------------------------------------------------------------------------

  _preloadYouTubeAPI() {
    if (window.YT?.Player) return; // already loaded
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return; // already injected
    const tag = document.createElement('script');
    tag.src   = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
    // onYouTubeIframeAPIReady is handled per-room in YouTubePlayerMixin.loadYouTubeAPI()
  }

  // ---------------------------------------------------------------------------
  // Hub visibility — suspend/resume chat subs on tab hide (Issue #1)
  // ---------------------------------------------------------------------------

  _attachHubVisibility() {
    if (this._hubVisibilityHandler) return; // already attached

    this._hubVisibilityHandler = () => {
      if (document.hidden) {
        // User left the Hub tab — unsubscribe all active room chat channels
        // to stop processing WebSocket messages in the background.
        this._hubChatRooms?.forEach(roomId => {
          try { CommunityDB.unsubscribeFromRoomChat(roomId); } catch (_) {}
        });
      } else {
        // User returned — re-subscribe to chat for whichever room is active
        const currentRoom = Core?.state?.currentRoom;
        if (currentRoom && this._hubChatResubscribe) {
          this._hubChatResubscribe(currentRoom);
        }
      }
    };

    document.addEventListener('visibilitychange', this._hubVisibilityHandler);
  }

  /**
   * Register which rooms have active chat subs, and how to resubscribe.
   * Called by ChatMixin rooms after they subscribe.
   * @param {string[]} roomIds
   * @param {function} resubFn  - called with roomId when tab becomes visible again
   */
  registerHubChatRooms(roomIds, resubFn) {
    this._hubChatRooms       = roomIds;
    this._hubChatResubscribe = resubFn;
  }

  // ---------------------------------------------------------------------------
  // Script / Style Loading
  // ---------------------------------------------------------------------------

  loadStylesheet(href, { critical = false } = {}) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = href;
    if (!critical) {
      // Non-critical: load async then swap to stylesheet
      link.rel    = 'preload';
      link.as     = 'style';
      link.onload = function () { this.rel = 'stylesheet'; };
    }
    document.head.appendChild(link);
  }

  /** Legacy helper: load a non-module CDN/external script tag. */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = Object.assign(document.createElement('script'), { src, async: true });
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.body.appendChild(script);
    });
  }

  /** Dynamic ES module import with absolute path. */
  _import(path) {
    return import(/* @vite-ignore */ `${BASE_PATH}/${path}`);
  }

  /** Parallel dynamic imports. */
  _importAll(paths) {
    return Promise.all(paths.map(p => this._import(p)));
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  async initializeCommunityHub() {
    try {
      // Group 1: CDN scripts (not ES modules — keep as script tags)
      await this.loadScript('https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js');

      // Group 2: Hub utilities — also pre-load YouTube IFrame API here so
      // timed rooms don't each trigger a script load on entry (Issue #4).
      this._preloadYouTubeAPI();
      await this._importAll([
        'js/rituals.js',
        'js/profile-module.js',
        'js/community-module.js',
        'js/SafetyBar.js',
        'js/AdminDashboard.js',
        'js/collective-field-db.js',
        'js/Rooms/PracticeRoom.js',
      ]);

      // Group 3: Mixins + Lunar/Solar foundations + composite classes that
      // depend on them. All loaded in one parallel batch (Fix #6 — TimedVideoRoom
      // and TabRoomMixin don't need to wait for a separate sequential await).
      await this._importAll([
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
        'js/Rooms/mixins/TimedVideoRoom.js',
        'js/Rooms/mixins/TabRoomMixin.js',
      ]);

      // Init LunarEngine early - lunar rooms need currentMoonData
      window.LunarEngine?.init?.();

      // Group 4a: Solar UI must precede base room (sequential)
      await this._import('js/Solar/solar-ui.js');
      await this._import('js/Solar/solar-base-room.js');

      // Group 4b: All rooms + dynamic sections (parallel)
      await this._importAll([
        'js/Rooms/silent-room.js',
        'js/Rooms/guided-room.js',
        'js/Rooms/osho-room.js',
        'js/Rooms/breathwork-room.js',
        'js/Rooms/deepwork-room.js',
        'js/Rooms/campfire-room.js',
        'js/Rooms/tarot-room.js',
        'js/Rooms/reiki-room.js',
        'js/collective-field.js',
        'js/resonance.js',
        'js/upcoming-events.js',
      ]);

      // Group 5: Engines last
      await this._import('js/Solar/solarengine.js');

      // Boot Core
      if (!Core?.init) throw new Error('Core module not found');

      Core.init();

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

export default CommunityHubEngine;
