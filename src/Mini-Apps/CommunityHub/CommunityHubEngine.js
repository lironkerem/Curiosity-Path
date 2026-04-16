// Mini-Apps/CommunityHub/CommunityHubEngine.js
// v4.1 - ActiveMembersWidget refactor (production-grade instance management)

import { CommunityDB }        from './js/community-supabase.js';
import { Core }               from './js/core.js';
import { MemberProfileModal } from './js/member-profile-modal.js';
import { WhisperModal }       from './js/WhisperModal.js';
import { ActiveMembersWidget } from './js/active-members.js';

// ── Group 2: Hub utilities ──────────────────────────────────────────────────
import './js/rituals.js';
import './js/profile-module.js';
import './js/community-module.js';
import './js/SafetyBar.js';
import './js/AdminDashboard.js';
import './js/collective-field-db.js';
import './js/Rooms/PracticeRoom.js';

// ── Group 3: Mixins + Lunar/Solar foundations ───────────────────────────────
import './js/Rooms/mixins/YouTubePlayerMixin.js';
import './js/Rooms/mixins/CycleStateMixin.js';
import './js/Rooms/mixins/ChatMixin.js';
import './js/Rooms/mixins/SoundSettingsMixin.js';
import './js/Rooms/mixins/TimerMixin.js';
import './js/Solar/solar-config.js';
import './js/Lunar/lunar-core.js';
import './js/Lunar/lunar-ui.js';
import './js/Lunar/lunar-config.js';
import './js/Lunar/lunarengine.js';
import './js/Rooms/mixins/TimedVideoRoom.js';
import './js/Rooms/mixins/TabRoomMixin.js';

// ── Group 4: Solar UI + base room (order-sensitive) ─────────────────────────
import './js/Solar/solar-ui.js';
import './js/Solar/solar-base-room.js';

// ── Group 4b: All rooms + dynamic sections ──────────────────────────────────
import './js/Rooms/silent-room.js';
import './js/Rooms/guided-room.js';
import './js/Rooms/osho-room.js';
import './js/Rooms/breathwork-room.js';
import './js/Rooms/deepwork-room.js';
import './js/Rooms/campfire-room.js';
import './js/Rooms/tarot-room.js';
import './js/Rooms/reiki-room.js';
import './js/collective-field.js';
import './js/resonance.js';
import './js/upcoming-events.js';

// ── Group 5: Engines ────────────────────────────────────────────────────────
import './js/Solar/solarengine.js';

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
    this._activeMembersWidget = null;
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
      this._refreshHubPresence();
    }

    // Issue #1: suspend chat subscriptions when user leaves the Hub tab entirely
    this._attachHubVisibility();

    // Auto-open a room requested from an external CTA (e.g. Energy Tracker).
    if (window._pendingRoomOpen) {
      const roomKey = window._pendingRoomOpen;
      window._pendingRoomOpen = null;

      const fn = window[`${roomKey}_enterRoom`];
      if (typeof fn === 'function') {
        fn();
      } else {
        const handler = e => {
          if (e.detail?.roomKey !== roomKey) return;
          document.removeEventListener('practiceRoomReady', handler);
          window[`${roomKey}_enterRoom`]?.();
        };
        document.addEventListener('practiceRoomReady', handler);
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
      </svg>`;
  }

  // ---------------------------------------------------------------------------
  // Ritual overlay
  // ---------------------------------------------------------------------------

  createFullscreenRoomContainer() {
    if (document.getElementById('openingOverlay')) return;
    const el = document.createElement('div');
    el.innerHTML = `
      <div id="openingOverlay" class="opening-overlay" role="dialog" aria-modal="true" aria-labelledby="openingRitualText">
        <div class="opening-overlay-content">
          <p id="openingRitualText" class="opening-ritual-text"></p>
          <button class="opening-enter-btn" onclick="window.Rituals?.completeOpening()">Enter the Space</button>
        </div>
      </div>`;
    const root = document.getElementById('app-container') || document.body;
    root.appendChild(el.firstElementChild);
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
    try {
      // Refresh active members widget in-place — no full Core.init() needed
      this._activeMembersWidget?.refresh();

      if (window.PracticeRoom?._hubRooms?.length) {
        PracticeRoom.startHubPresence();
      }
      if (window.CollectiveFieldDB?.refreshCount) {
        window.CollectiveFieldDB.refreshCount();
      }
    } catch (e) {
      console.warn('[CommunityHub] _refreshHubPresence fallback to Core.init', e);
      Core.state.initialized = false;
      Core.init();
    }
  }

  // ---------------------------------------------------------------------------
  // YouTube API preload (Issue #4)
  // ---------------------------------------------------------------------------

  _preloadYouTubeAPI() {
    if (window.YT?.Player) return;
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
    const tag = document.createElement('script');
    tag.src   = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  }

  // ---------------------------------------------------------------------------
  // Hub visibility — suspend/resume chat subs on tab hide (Issue #1)
  // ---------------------------------------------------------------------------

  _attachHubVisibility() {
    if (this._hubVisibilityHandler) return;

    this._hubVisibilityHandler = () => {
      if (document.hidden) {
        this._hubChatRooms?.forEach(roomId => {
          try { CommunityDB.unsubscribeFromRoomChat(roomId); } catch (_) {}
        });
      } else {
        const currentRoom = Core?.state?.currentRoom;
        if (currentRoom && this._hubChatResubscribe) {
          this._hubChatResubscribe(currentRoom);
        }
      }
    };

    document.addEventListener('visibilitychange', this._hubVisibilityHandler);
  }

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
      link.rel    = 'preload';
      link.as     = 'style';
      link.onload = function () { this.rel = 'stylesheet'; };
    }
    document.head.appendChild(link);
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = Object.assign(document.createElement('script'), { src, async: true });
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.body.appendChild(script);
    });
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  async initializeCommunityHub() {
    try {
      this._preloadYouTubeAPI();

      window.LunarEngine?.init?.();

      if (!Core?.init) throw new Error('Core module not found');

      await CommunityDB.init();
      window.CommunityDB = CommunityDB;

      await Core.init();
      window.Core = Core;

      // Mount Active Members widget — non-blocking, owns its container element directly
      const hubMembersEl = document.getElementById('activeMembersContainer');
      if (hubMembersEl) {
        if (this._activeMembersWidget) {
          this._activeMembersWidget.destroy();
        }
        this._activeMembersWidget = new ActiveMembersWidget(hubMembersEl);
        this._activeMembersWidget.render();
      }

      window.CollectiveField?.render();
      window.Resonance?.render();
      window.UpcomingEvents?.render();

      if (window.ProfileModule) {
        window.ProfileModule.state.isInitialized = false;
        try { window.ProfileModule.init(); } catch(e) { console.warn('[CommunityHub] ProfileModule re-init:', e); }
      }
      if (window.CommunityModule) {
        window.CommunityModule.state.isInitialized = false;
        try { window.CommunityModule.init(); } catch(e) { console.warn('[CommunityHub] CommunityModule re-init:', e); }
      }

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

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  destroy() {
    if (this._activeMembersWidget) {
      this._activeMembersWidget.destroy();
      this._activeMembersWidget = null;
    }
    if (this._hubVisibilityHandler) {
      document.removeEventListener('visibilitychange', this._hubVisibilityHandler);
      this._hubVisibilityHandler = null;
    }
  }
}

export default CommunityHubEngine;
