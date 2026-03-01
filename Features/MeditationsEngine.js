// ===================================================================
// MEDITATIONS ENGINE - Optimized & Professional
// ===================================================================

/**
 * MeditationsEngine - Manages guided meditation sessions with YouTube integration
 * Handles playback, progress tracking, achievements, and user state management
 */
class MeditationsEngine {
  constructor(app) {
    this.app = app;
    
    // YouTube Player state
    this.ytPlayer = null;
    this.isPlaying = false;
    this.currentMeditation = null;
    this.sessionStartTime = null;
    this.progressInterval = null;
    
    // Event cleanup tracking
    this.eventCleanup = [];
    
    // Configuration
    this.pdfGuideUrl = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Source_PDF/Meditation_Demo.pdf';
    this.SKIP_SECONDS = 15;
    this.MIN_PLAYER_WIDTH = 380;
    this.PROGRESS_UPDATE_MS = 1000;

    // Initialize
    this.loadYouTubeAPI();
    this.meditations = this.getMeditationsData();
  }

  /**
   * Load YouTube IFrame API if not already loaded
   */
  loadYouTubeAPI() {
    if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => {
      window.ytReady = true;
    };
  }

  /**
   * Get meditations data with metadata for each session
   * @returns {Array} Array of meditation objects
   */
  getMeditationsData() {
    return [
      // FREE MEDITATIONS
      {
        id: 1,
        title: 'Grounding to the Center of Earth',
        duration: '29:56',
        category: 'Grounding',
        description: 'Connect deeply with Earth energy and find your center',
        embedUrl: 'https://www.youtube.com/embed/_KedpeSYwgA?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌍',
        type: 'guided',
        premium: false
      },
      {
        id: 2,
        title: 'Aura Adjustment and Cleaning',
        duration: '29:56',
        category: 'Energy',
        description: 'Cleanse and strengthen your energetic field',
        embedUrl: 'https://www.youtube.com/embed/gIMfdNkAC4g?enablejsapi=1&rel=0&playsinline=1',
        emoji: '✨',
        type: 'guided',
        premium: false
      },
      {
        id: 3,
        title: 'Chakra Cleaning',
        duration: '39:58',
        category: 'Chakras',
        description: 'Balance and clear all seven energy centers',
        embedUrl: 'https://www.youtube.com/embed/BFvmLeYg7cE?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌈',
        type: 'guided',
        premium: false
      },
      {
        id: 4,
        title: 'The Center of the Universe',
        duration: '29:56',
        category: 'Spiritual',
        description: 'Expand your consciousness to cosmic awareness',
        embedUrl: 'https://www.youtube.com/embed/1T2dNQ4M7Ko?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌌',
        type: 'guided',
        premium: false
      },
      {
        id: 5,
        title: 'Blowing Roses Healing Technique',
        duration: '29:56',
        category: 'Healing',
        description: 'Release emotional blockages with visualization',
        embedUrl: 'https://www.youtube.com/embed/3yQrtsHbSBo?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🌹',
        type: 'guided',
        premium: false
      },
      {
        id: 6,
        title: '3 Wishes Manifestation',
        duration: '29:52',
        category: 'Manifestation',
        description: 'Align your intentions with universal flow',
        embedUrl: 'https://www.youtube.com/embed/EvRa_qwgJao?enablejsapi=1&rel=0&playsinline=1',
        emoji: '⭐',
        type: 'guided',
        premium: false
      },
      // PREMIUM MEDITATIONS
      {
        id: 7,
        title: 'Meeting your Higher Self',
        duration: '29:56',
        category: 'Premium',
        description: 'Connect with your highest consciousness',
        embedUrl: 'https://www.youtube.com/embed/34mla-PnpeU?enablejsapi=1&rel=0&playsinline=1',
        emoji: '💎',
        type: 'guided',
        premium: true
      },
      {
        id: 8,
        title: 'Inner Temple',
        duration: '29:46',
        category: 'Premium',
        description: 'Create your sacred inner sanctuary',
        embedUrl: 'https://www.youtube.com/embed/t6o6lpftZBA?enablejsapi=1&rel=0&playsinline=1',
        emoji: '🔮',
        type: 'guided',
        premium: true
      },
      {
        id: 9,
        title: 'Gratitude Practice',
        duration: '29:56',
        category: 'Premium',
        description: 'Cultivate deep appreciation and abundance',
        embedUrl: 'https://www.youtube.com/embed/JyTwWAhsiq8?enablejsapi=1&rel=0&playsinline=1',
        emoji: '👑',
        type: 'guided',
        premium: true
      }
    ];
  }

  /**
   * Builds the Community Meditation Rooms CTA card
   */
  buildMeditationCTA() {
    // Calculate cycle state directly from the clock — works before Community Hub loads
    const calcCycle = (cycleSec, openSec) => {
      const now          = Date.now();
      const cycleMs      = cycleSec * 1000;
      const openMs       = openSec  * 1000;
      const timeInCycle  = now % cycleMs;
      if (timeInCycle < openMs) return null; // currently open
      const msUntilOpen  = cycleMs - timeInCycle;
      const m = Math.floor(msUntilOpen / 60000);
      const s = Math.floor((msUntilOpen % 60000) / 1000);
      return `Opens in ${m}:${String(s).padStart(2, '0')}`;
    };

    const guidedCountdown = calcCycle(60 * 60, 15 * 60);  // 60-min cycle, 15-min open
    const oshoCountdown   = calcCycle(90 * 60, 10 * 60);  // 90-min cycle, 10-min open

    const btnStyle = `
      flex: 1 1 200px;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: none;
      background: var(--neuro-bg);
      color: var(--neuro-text);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 6px 6px 14px var(--neuro-shadow-dark), -6px -6px 14px var(--neuro-shadow-light);
      transition: all 0.2s;
    `;

    const disabledStyle = `
      flex: 1 1 200px;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: none;
      background: var(--neuro-bg);
      color: var(--neuro-text-light);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
    `;

    return `
      <div class="card" style="margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.6rem;">🧘</span>
          <h3 style="margin: 0; font-size: 1.15rem; color: var(--neuro-text); font-weight: 700;">
            Meditate Together with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; color: var(--neuro-text-light); line-height: 1.6;">
          Practice in real time with others. Choose silence, guided visualization, or active OSHO techniques —
          all in shared, live spaces.
        </p>
        <div class="meditation-cta-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">

          <button
            type="button"
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            style="${btnStyle}"
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            🏘️ Enter the Community Hub
          </button>

          <button
            type="button"
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'silent'; window.app.nav.switchTab('community-hub')"
            style="${btnStyle}"
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            🧘 Silent Meditation
          </button>

          ${guidedCountdown ? `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${disabledStyle}">
              🎧 Guided — ${guidedCountdown}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.GuidedRoom?.showScheduleModal()"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;">
              📅 View Schedule
            </button>
          </div>
          ` : `
          <button
            type="button"
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'guided'; window.app.nav.switchTab('community-hub')"
            style="${btnStyle}"
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            🎧 Guided Visualizations
          </button>
          `}

          ${oshoCountdown ? `
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${disabledStyle}">
              💃 OSHO Active — ${oshoCountdown}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.OshoRoom?.showScheduleModal()"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;">
              📅 View Schedule
            </button>
          </div>
          ` : `
          <button
            type="button"
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'osho'; window.app.nav.switchTab('community-hub')"
            style="${btnStyle}"
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            💃 OSHO Active Meditations
          </button>
          `}

        </div>
      </div>
    `;
  }

  /**
   * Main render method - builds the complete meditation interface
   */
  render() {
    const tab = document.getElementById('meditations-tab');
    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavMeditations.png');
                         --header-title:'';
                         --header-tag:'Aanandoham\\'s curated, unique collection of guided meditations'">
            <h1>Guided Meditations</h1>
            <h3>Aanandoham's curated, unique collection of guided meditations</h3>
            <span class="header-sub"></span>
          </header>

          <div class="text-center" style="margin-bottom: 2rem;">
            <button onclick="window.featuresManager.engines.meditations.openPDFGuide()" 
                    class="btn btn-primary" 
                    style="padding: 12px 32px; display: inline-flex; align-items: center; gap: 8px;">
              📖 A Demo from the 'Art of Meditation' Workbook - Free For you (PDF)
            </button>
          </div>

          <div class="card dashboard-wellness-toolkit" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header">
              <h3 class="dashboard-wellness-title">🌟 Wellness Toolkit</h3>
              <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
            </div>
            <div class="wellness-buttons-grid">
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openSelfReset()" aria-label="Open 60-Second Self Reset">
                <div class="wellness-tool-icon">🧘</div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Self Reset</h4>
                  <p class="wellness-tool-description">Short Breathing practice</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">✨ +10 XP</span>
                    <span class="wellness-stat-karma">💎 +1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openFullBodyScan()" aria-label="Full Body Scan">
                <div class="wellness-tool-icon">🌊</div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Full Body Scan</h4>
                  <p class="wellness-tool-description">Progressive relaxation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">✨ +10 XP</span>
                    <span class="wellness-stat-karma">💎 +1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openNervousReset()" aria-label="Nervous System Reset">
                <div class="wellness-tool-icon">⚡</div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Nervous System</h4>
                  <p class="wellness-tool-description">Balance & regulation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">✨ +10 XP</span>
                    <span class="wellness-stat-karma">💎 +1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openTensionSweep()" aria-label="Tension Sweep">
                <div class="wellness-tool-icon">🌀</div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Tension Sweep</h4>
                  <p class="wellness-tool-description">Release stored tension</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">✨ +10 XP</span>
                    <span class="wellness-stat-karma">💎 +1 Karma</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          ${this.buildMeditationCTA()}

          <div class="card" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
              <h3 class="dashboard-wellness-title">🎧 Guided Meditations</h3>
              <p class="dashboard-wellness-subtitle">Aanandoham's private, curated, unique collection</p>
            </div>

            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem;">
              ${this.renderMeditationCards()}
            </div>
          </div>

          ${this.renderPlayer()}

        </div>
      </div>

      ${this.renderStyles()}
    `;

    this.attachEventListeners();
  }

  /**
   * Render all meditation cards
   * @returns {string} HTML string of all meditation cards
   */
  renderMeditationCards() {
    return this.meditations.map(med => {
      const isPremium = med.premium;
      const isLocked = isPremium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations');
      
      return `
        <div class="meditation-card ${isLocked ? 'locked' : ''}" 
             title="${isLocked ? '🔒 Purchase Advanced Meditations in Karma Shop to unlock' : ''}">
          ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
          ${isLocked ? '<div class="lock-icon">🔒</div>' : ''}
          
          <div class="meditation-header">
            <span class="meditation-emoji">${med.emoji}</span>
            <span class="meditation-duration">${med.duration}</span>
          </div>
          
          <h4 class="meditation-title">${med.title}</h4>
          <p class="meditation-description">${med.description}</p>

          <div class="meditation-actions">
            <button class="btn btn-secondary flex-1" onclick="window.featuresManager.engines.meditations.playAudio(${med.id})">
              🎧 Audio
            </button>
            <button class="btn btn-primary flex-1" onclick="window.featuresManager.engines.meditations.playVideo(${med.id})">
              ▶️ Video
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render the floating player interface
   * @returns {string} HTML string for player
   */
  renderPlayer() {
    return `
      <div id="meditation-player-wrapper" class="player-wrapper">
        <div id="meditation-audio-player" class="compact-player hidden">
          <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="player-close-btn">✕</button>
          
          <div id="video-pane" class="video-pane hidden">
            <iframe id="yt-iframe"
                    width="100%"
                    height="100%"
                    frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
            </iframe>
          </div>
          
          <div class="player-info">
            <div id="player-emoji" class="player-emoji">🎧</div>
            <div class="player-text">
              <h4 id="player-title" class="font-bold">No Meditation Selected</h4>
              <p id="player-time" class="text-sm">0:00 / 0:00</p>
            </div>
          </div>
          
          <div class="player-controls">
            <button onclick="window.featuresManager.engines.meditations.skipBackward()" class="icon-btn">⏪</button>
            <div class="play-pause-wrapper">
              <svg class="progress-ring" width="60" height="60">
                <circle class="progress-ring-bg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
                <circle id="player-progress-ring" class="progress-ring-fg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
              </svg>
              <button onclick="window.featuresManager.engines.meditations.togglePlay()" id="play-pause-btn" class="btn btn-primary play-pause-btn">▶️</button>
              <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="stop-btn" title="Stop">⏹️</button>
            </div>
            <button onclick="window.featuresManager.engines.meditations.skipForward()" class="icon-btn">⏩</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render all CSS styles for the meditation interface
   * @returns {string} CSS in style tags
   */
  renderStyles() {
    return `
      <style>
        @media (max-width: 600px) {
          .meditation-cta-grid { grid-template-columns: 1fr !important; }
        }
        /* Meditation Cards */
        .meditation-card {
          flex: 0 1 320px;
          max-width: 320px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 1.5rem;
          box-shadow: 8px 8px 16px var(--neuro-shadow-dark), -8px -8px 16px var(--neuro-shadow-light);
          position: relative;
          transition: transform 0.2s;
        }
        .meditation-card.locked { opacity: 0.75; }
        .premium-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .lock-icon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 3rem;
          opacity: 0.3;
          z-index: 1;
        }
        .meditation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .meditation-emoji { font-size: 2rem; }
        .meditation-duration {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
        }
        .meditation-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--neuro-text);
          margin-bottom: 0.5rem;
        }
        .meditation-description {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
          margin-bottom: 0.75rem;
        }
        .meditation-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Player Wrapper - Fixed positioning */
        .player-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          transition: none;
        }
        .compact-player {
          width: 380px;
          min-width: 380px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 20px 20px 40px var(--neuro-shadow-dark), -20px -20px 40px var(--neuro-shadow-light);
          user-select: none;
          position: relative;
          transition: opacity 0.3s, transform 0.3s;
        }
        .compact-player.hidden {
          transform: translateY(100px);
          opacity: 0;
          pointer-events: none;
        }
        .compact-player.video-mode {
          max-width: none;
          padding: 12px;
        }
        .player-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 30px;
          height: 30px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--neuro-text-light);
          font-size: 1.2rem;
          z-index: 10;
        }
        
        /* Player Info - Draggable header */
        .player-info {
          cursor: grab;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .player-info:active { cursor: grabbing; }
        .player-emoji {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          background: var(--neuro-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .player-text #player-title {
          color: var(--neuro-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .player-text #player-time { color: var(--neuro-text-light); }
        
        /* Player Controls */
        .player-controls {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-shrink: 0;
        }
        .play-pause-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
        }
        .play-pause-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
        }
        .play-pause-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Progress Ring */
        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
        }
        .progress-ring-bg { stroke: var(--neuro-shadow-dark); }
        .progress-ring-fg {
          stroke: var(--neuro-accent);
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.1s linear;
        }
        .player-controls .icon-btn {
          width: 40px;
          height: 40px;
          padding: 0;
        }
        
        /* Video Pane */
        .video-pane {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 240px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .video-pane iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .video-pane.hidden { display: none; }
        
        /* Stop Button */
        .stop-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateX(34px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--neuro-bg);
          box-shadow: 2px 2px 6px var(--neuro-shadow-dark), -2px -2px 6px var(--neuro-shadow-light);
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--neuro-text);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .stop-btn:active {
          box-shadow: inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light);
        }
      </style>
    `;
  }

  /**
   * Attach event listeners (currently minimal, cleanup handled in cleanup())
   */
  attachEventListeners() {
    // Clean up old listeners
    this.cleanup();
  }

  /**
   * Play meditation in audio-only mode
   * @param {number} id - Meditation ID
   */
  playAudio(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    
    // Check premium access
    if (med.premium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('🔒 Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    
    this._play(med, false);
  }

  /**
   * Play meditation with video visible
   * @param {number} id - Meditation ID
   */
  playVideo(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    
    // Check premium access
    if (med.premium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('🔒 Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    
    this._play(med, true);
  }

  /**
   * Internal method to start playing a meditation
   * @param {Object} med - Meditation object
   * @param {boolean} showVideo - Whether to show video pane
   */
  _play(med, showVideo) {
    try {
      this.currentMeditation = med;
      this.sessionStartTime = Date.now();

      // Update player UI
      const playerBox = document.getElementById('meditation-audio-player');
      document.getElementById('player-emoji').textContent = med.emoji;
      document.getElementById('player-title').textContent = med.title;
      playerBox.classList.remove('hidden');

      // Start YouTube player
      if (med.embedUrl) {
        this._startYouTubePlayer(med, showVideo);
      }
    } catch (error) {
      console.error('Error starting meditation:', error);
      this.app.showToast('❌ Error starting meditation', 'error');
    }
  }

  /**
   * Initialize YouTube player with the meditation video
   * @param {Object} med - Meditation object
   * @param {boolean} showVideo - Whether to show video pane
   */
  _startYouTubePlayer(med, showVideo) {
    if (!window.ytReady) {
      this.app.showToast('🎧 Initializing player… please tap again.', 'info');
      window.onYouTubeIframeAPIReady = () => {
        window.ytReady = true;
        this._startYouTubePlayer(med, showVideo);
      };
      return;
    }

    try {
      const videoId = med.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1];
      const iframe = document.getElementById('yt-iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&playsinline=1`;

      if (!this.ytPlayer || typeof this.ytPlayer.playVideo !== 'function') {
        // Create new player
        this.ytPlayer = new YT.Player('yt-iframe', {
          events: {
            onReady: (e) => {
              document.getElementById('play-pause-btn').disabled = false;
              if (!showVideo) {
                this.ytPlayer.playVideo();
                this.app.showToast('🎧 Audio playing', 'success');
              } else {
                this.app.showToast('Ready – tap play to start', 'info');
              }
            },
            onStateChange: (e) => this._handleYouTubeStateChange(e),
            onError: (e) => {
              console.error('YouTube player error:', e);
              this.app.showToast('❌ Video error', 'error');
            }
          }
        });
      } else {
        // Reuse existing player
        this.ytPlayer.loadVideoById(videoId);
        if (!showVideo) {
          setTimeout(() => this.ytPlayer.playVideo(), 500);
        }
      }

      document.getElementById('play-pause-btn').disabled = true;

      // Show/hide video pane
      if (showVideo) {
        this._showVideoPane();
      } else {
        this._hideVideoPane();
      }

      this._startProgressUpdates();
    } catch (error) {
      console.error('Error initializing YouTube player:', error);
      this.app.showToast('❌ Error loading video', 'error');
    }
  }

  /**
   * Handle YouTube player state changes
   * @param {Object} event - YouTube state change event
   */
  _handleYouTubeStateChange(event) {
    const eng = window.featuresManager.engines.meditations;
    
    if (event.data === YT.PlayerState.ENDED && eng.currentMeditation) {
      eng.onMeditationComplete();
    }
    
    if (event.data === YT.PlayerState.PLAYING) {
      eng.isPlaying = true;
      document.getElementById('play-pause-btn').textContent = '⏸️';
    }
    
    if (event.data === YT.PlayerState.PAUSED) {
      eng.isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶️';
    }
  }

  /**
   * Start interval for updating progress display
   */
  _startProgressUpdates() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    this.progressInterval = setInterval(() => {
      if (this.isPlaying) {
        this.updateProgress();
      }
    }, this.PROGRESS_UPDATE_MS);
  }

  /**
   * Show video pane and enable drag
   */
  _showVideoPane() {
    document.getElementById('video-pane').classList.remove('hidden');
    document.getElementById('meditation-audio-player').classList.add('video-mode');
    this.initDrag();
  }

  /**
   * Hide video pane
   */
  _hideVideoPane() {
    document.getElementById('video-pane').classList.add('hidden');
    document.getElementById('meditation-audio-player').classList.remove('video-mode');
  }

  /**
   * Initialize drag functionality for player
   */
  initDrag() {
    const header = document.querySelector('.player-info');
    const wrap = document.getElementById('meditation-player-wrapper');
    if (!header || !wrap) return;

    let px, py, dx, dy;

    const start = (e) => {
      px = e.touches ? e.touches[0].clientX : e.clientX;
      py = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = wrap.getBoundingClientRect();
      dx = px - rect.left;
      dy = py - rect.top;
      
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', end);
      document.addEventListener('touchmove', move, { passive: false });
      document.addEventListener('touchend', end);
      e.preventDefault();
    };

    const move = (e) => {
      const cx = (e.touches ? e.touches[0].clientX : e.clientX) - dx;
      const cy = (e.touches ? e.touches[0].clientY : e.clientY) - dy;
      wrap.style.left = cx + 'px';
      wrap.style.top = cy + 'px';
      wrap.style.bottom = 'auto';
      wrap.style.right = 'auto';
    };

    const end = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', end);
    };

    header.addEventListener('mousedown', start);
    header.addEventListener('touchstart', start, { passive: false });

    // Track cleanup
    this.eventCleanup.push(() => {
      header.removeEventListener('mousedown', start);
      header.removeEventListener('touchstart', start);
    });
  }

  /**
   * Toggle play/pause state
   */
  togglePlay() {
    if (!this.currentMeditation) return;

    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        if (this.isPlaying) {
          this.ytPlayer.pauseVideo();
        } else {
          this.ytPlayer.playVideo();
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
        this.app.showToast('⏸️ Player not ready', 'info');
      }
    }
  }

  /**
   * Stop meditation and cleanup
   */
  stopMeditation() {
    try {
      if (this.ytPlayer && typeof this.ytPlayer.stopVideo === 'function') {
        this.ytPlayer.stopVideo();
      }
      
      this.isPlaying = false;
      this.currentMeditation = null;
      this.sessionStartTime = null;

      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      document.getElementById('play-pause-btn').textContent = '▶️';
      document.getElementById('meditation-audio-player').classList.add('hidden');
      this._hideVideoPane();
    } catch (error) {
      console.error('Error stopping meditation:', error);
    }
  }

  /**
   * Skip forward in meditation
   */
  skipForward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      const newTime = Math.min(current + this.SKIP_SECONDS, duration);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  }

  /**
   * Skip backward in meditation
   */
  skipBackward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const newTime = Math.max(current - this.SKIP_SECONDS, 0);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  }

  /**
   * Update progress display
   */
  updateProgress() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      
      if (duration > 0) {
        document.getElementById('player-time').textContent = 
          `${this.formatTime(current)} / ${this.formatTime(duration)}`;
        this.updateRing(current, duration);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  /**
   * Update circular progress ring
   * @param {number} current - Current time in seconds
   * @param {number} duration - Total duration in seconds
   */
  updateRing(current, duration) {
    const ring = document.getElementById('player-progress-ring');
    if (!ring || !duration || duration === 0) return;
    
    try {
      const r = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * r;
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      
      const progress = current / duration;
      const offset = circumference - (progress * circumference);
      ring.style.strokeDashoffset = isNaN(offset) ? circumference : offset;
    } catch (error) {
      console.error('Error updating ring:', error);
    }
  }

  /**
   * Handle meditation completion - save session and grant rewards
   */
  onMeditationComplete() {
    try {
      this.isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶️';
      this.app.showToast('🎉 Meditation complete! Well done.', 'success');
      
      if (!this.currentMeditation) return;

      // Calculate duration in minutes
      const duration = this.ytPlayer 
        ? Math.floor((this.ytPlayer.getDuration() || 0) / 60)
        : 0;
      
      const chakra = this.getChakraFromMeditation(this.currentMeditation.category);
      
      // Create session data
      const sessionData = {
        type: this.currentMeditation.type || 'guided',
        meditationId: this.currentMeditation.id,
        title: this.currentMeditation.title,
        category: this.currentMeditation.category,
        duration: duration,
        chakra: chakra,
        timestamp: new Date().toISOString(),
        sessionStartTime: this.sessionStartTime,
        completedAt: Date.now()
      };

      // Save to state
      if (this.app.state) {
        this.app.state.addEntry('meditation', sessionData);
      }

      // Update quest progress
      if (sessionData.type === 'guided' && this.app.gamification) {
        this.app.gamification.progressQuest('daily', 'meditation_session', 1);
      }

      // Check for achievements
      this.checkAchievements();
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error completing meditation:', error);
    }
  }

  /**
   * Check and grant meditation-related achievements
   */
  checkAchievements() {
    try {
      const total = this.app.state?.data?.meditationEntries?.length || 0;
      const gm = this.app.gamification;
      if (!gm) return;

      const achievements = [
        { 
          count: 1, 
          id: 'first_meditation', 
          name: 'First Journey Within', 
          xp: 50, 
          icon: '🧘', 
          msg: 'You have begun the sacred practice of meditation!' 
        },
        { 
          count: 10, 
          id: 'meditation_10', 
          name: 'Meditation Practitioner', 
          xp: 100, 
          icon: '🕉️', 
          msg: '10 meditations! Your inner light grows brighter!' 
        },
        { 
          count: 50, 
          id: 'meditation_50', 
          name: 'Meditation Master', 
          xp: 250, 
          icon: '✨', 
          msg: '50 meditations! You are a beacon of inner peace!' 
        },
        { 
          count: 100, 
          id: 'meditation_100', 
          name: 'Enlightened One', 
          xp: 500, 
          icon: '🌟', 
          msg: '100 meditations! You walk in pure awareness!' 
        }
      ];

      achievements.forEach(ach => {
        if (total === ach.count) {
          gm.grantAchievement({
            id: ach.id,
            name: ach.name,
            xp: ach.xp,
            icon: ach.icon,
            inspirational: ach.msg
          });
        }
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  /**
   * Map meditation category to chakra
   * @param {string} category - Meditation category
   * @returns {string|null} Chakra name or null
   */
  getChakraFromMeditation(category) {
    const mapping = {
      Grounding: 'root',
      Energy: 'sacral',
      Chakras: 'heart',
      Spiritual: 'crown',
      Healing: 'heart',
      Manifestation: 'solar',
      Premium: 'crown'
    };
    return mapping[category] || null;
  }

  /**
   * Format seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Open PDF meditation guide in new tab
   */
  openPDFGuide() {
    if (this.pdfGuideUrl && this.pdfGuideUrl !== 'YOUR_PDF_URL_HERE') {
      window.open(this.pdfGuideUrl, '_blank');
    } else {
      this.app.showToast('ℹ️ PDF Guide is not yet available.', 'info');
    }
  }

  /**
   * Cleanup resources and event listeners
   */
  cleanup() {
    try {
      // Clear interval
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      // Remove tracked event listeners
      this.eventCleanup.forEach(cleanup => cleanup());
      this.eventCleanup = [];

      // Destroy YouTube player
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        this.ytPlayer.destroy();
        this.ytPlayer = null;
      }

      // Reset state
      this.isPlaying = false;
      this.currentMeditation = null;
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export for browser and module environments
if (typeof window !== 'undefined') {
  window.MeditationsEngine = MeditationsEngine;
}

export default MeditationsEngine;