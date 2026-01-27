// ===================================================================
// MEDITATIONS ENGINE – Guided Meditation Player
// ===================================================================

/**
 * MeditationsEngine: Manages guided meditation playback with YouTube integration,
 * progress tracking, achievements, and wellness toolkit features.
 */
class MeditationsEngine {
  // ===== CONSTANTS =====
  static SKIP_SECONDS = 15;
  static MIN_PLAYER_WIDTH = 380;
  static PROGRESS_UPDATE_MS = 1000;

  static WELLNESS_TOOLS = [
    {
      id: 'self-reset',
      icon: '🧘',
      name: 'Self Reset',
      description: 'Short Breathing practice',
      xp: 10,
      karma: 1,
      onclick: 'window.openSelfReset()'
    },
    {
      id: 'body-scan',
      icon: '🌊',
      name: 'Full Body Scan',
      description: 'Progressive relaxation',
      xp: 10,
      karma: 1,
      onclick: 'window.openFullBodyScan()'
    },
    {
      id: 'nervous-reset',
      icon: '⚡',
      name: 'Nervous System',
      description: 'Balance & regulation',
      xp: 10,
      karma: 1,
      onclick: 'window.openNervousReset()'
    },
    {
      id: 'tension-sweep',
      icon: '🌀',
      name: 'Tension Sweep',
      description: 'Release stored tension',
      xp: 10,
      karma: 1,
      onclick: 'window.openTensionSweep()'
    }
  ];

  static ACHIEVEMENTS = [
    { count: 1, id: 'first_meditation', name: 'First Journey Within', xp: 50, icon: '🧘', 
      msg: 'You have begun the sacred practice of meditation!' },
    { count: 10, id: 'meditation_10', name: 'Meditation Practitioner', xp: 100, icon: '🕉️', 
      msg: '10 meditations! Your inner light grows brighter!' },
    { count: 50, id: 'meditation_50', name: 'Meditation Master', xp: 250, icon: '✨', 
      msg: '50 meditations! You are a beacon of inner peace!' },
    { count: 100, id: 'meditation_100', name: 'Enlightened One', xp: 500, icon: '🌟', 
      msg: '100 meditations! You walk in pure awareness!' }
  ];

  static CHAKRA_MAPPING = {
    Grounding: 'root',
    Energy: 'sacral',
    Chakras: 'heart',
    Spiritual: 'crown',
    Healing: 'heart',
    Manifestation: 'solar',
    Premium: 'crown'
  };

  constructor(app) {
    if (!app) throw new Error('MeditationsEngine requires app instance');
    
    this.app = app;
    this.ytPlayer = null;
    this.isPlaying = false;
    this.currentMeditation = null;
    this.sessionStartTime = null;
    this.progressInterval = null;
    this.eventCleanup = [];
    this.pdfGuideUrl = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Source_PDF/Meditation_Demo.pdf';

    this.loadYouTubeAPI();
    this.meditations = this.getMeditationsData();
  }

  /**
   * Loads YouTube IFrame API if not already present
   */
  loadYouTubeAPI() {
    if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
    
    window.onYouTubeIframeAPIReady = () => {
      window.ytReady = true;
    };
  }

  /**
   * Returns the complete meditation library data
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

  // ===== MAIN RENDER =====
  /**
   * Renders the meditations tab with library and player
   */
  render() {
    const tab = document.getElementById('meditations-tab');
    if (!tab) {
      console.error('[Meditations] meditations-tab element not found');
      return;
    }

    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          ${this.renderHeader()}
          ${this.renderPDFButton()}
          ${this.renderWellnessToolkit()}
          ${this.renderMeditationLibrary()}
          ${this.renderAudioPlayer()}

        </div>
      </div>
    `;
  }

  /**
   * Renders page header
   */
  renderHeader() {
    return `
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavMeditations.png');
                     --header-title:'';
                     --header-tag:'Aanandoham\\'s curated, unique collection of guided meditations'">
        <h1>Guided Meditations</h1>
        <h3>Aanandoham's curated, unique collection of guided meditations</h3>
        <span class="header-sub"></span>
      </header>
    `;
  }

  /**
   * Renders PDF guide download button
   */
  renderPDFButton() {
    return `
      <div class="text-center" style="margin-bottom: 2rem;">
        <button onclick="window.featuresManager.engines.meditations.openPDFGuide()" 
                class="btn btn-primary" 
                style="padding: 12px 32px; display: inline-flex; align-items: center; gap: 8px;">
          📖 A Demo from the 'Art of Meditation' Workbook - Free For you (PDF)
        </button>
      </div>
    `;
  }

  /**
   * Renders wellness toolkit section with quick practices
   */
  renderWellnessToolkit() {
    return `
      <div class="card dashboard-wellness-toolkit" style="margin-bottom: 2rem;">
        <div class="dashboard-wellness-header">
          <h3 class="dashboard-wellness-title">🌟 Wellness Toolkit</h3>
          <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
        </div>
        <div class="wellness-buttons-grid">
          ${MeditationsEngine.WELLNESS_TOOLS.map(tool => `
            <button class="wellness-tool-btn wellness-tool-active" 
                    onclick="${tool.onclick}" 
                    aria-label="${tool.name}">
              <div class="wellness-tool-icon">${tool.icon}</div>
              <div class="wellness-tool-content">
                <h4 class="wellness-tool-name">${tool.name}</h4>
                <p class="wellness-tool-description">${tool.description}</p>
                <div class="wellness-tool-stats">
                  <span class="wellness-stat-xp">✨ +${tool.xp} XP</span>
                  <span class="wellness-stat-karma">💎 +${tool.karma} Karma</span>
                </div>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Renders meditation library grid
   */
  renderMeditationLibrary() {
    const freeMeditations = this.meditations.filter(m => !m.premium);
    const premiumMeditations = this.meditations.filter(m => m.premium);

    return `
      <div class="card" style="margin-bottom: 2rem;">
        <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
          <h3 class="dashboard-wellness-title">🎧 Meditation Library</h3>
          <p class="dashboard-wellness-subtitle">Choose a guided journey</p>
        </div>
        
        <!-- Free Meditations -->
        <div style="margin-bottom: 2rem;">
          <h4 style="margin-bottom: 1rem; color: var(--neuro-text);">✨ Free Meditations</h4>
          <div class="meditations-grid">
            ${freeMeditations.map(m => this.renderMeditationCard(m)).join('')}
          </div>
        </div>

        <!-- Premium Meditations -->
        ${premiumMeditations.length > 0 ? `
          <div>
            <h4 style="margin-bottom: 1rem; color: var(--neuro-text);">💎 Premium Meditations</h4>
            <div class="meditations-grid">
              ${premiumMeditations.map(m => this.renderMeditationCard(m)).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders individual meditation card
   */
  renderMeditationCard(meditation) {
    const isPremium = meditation.premium;
    const premiumBadge = isPremium ? '<div class="meditation-premium-badge">PREMIUM 💎</div>' : '';

    return `
      <div class="meditation-card ${isPremium ? 'meditation-premium' : ''}" 
           onclick="window.featuresManager.engines.meditations.playMeditation(${meditation.id})">
        ${premiumBadge}
        <div class="meditation-emoji">${meditation.emoji}</div>
        <h4 class="meditation-title">${this.escapeHtml(meditation.title)}</h4>
        <p class="meditation-category">${meditation.category}</p>
        <p class="meditation-description">${this.escapeHtml(meditation.description)}</p>
        <div class="meditation-duration">⏱️ ${meditation.duration}</div>
      </div>
    `;
  }

  /**
   * Renders audio player controls (initially hidden)
   */
  renderAudioPlayer() {
    return `
      <div id="meditation-audio-player" class="card hidden" style="position:sticky;bottom:2rem;z-index:100;">
        <div class="player-header">
          <div class="player-info">
            <div id="player-title" class="player-title">No meditation playing</div>
            <div id="player-category" class="player-category"></div>
          </div>
          <button onclick="window.featuresManager.engines.meditations.stopMeditation()" 
                  class="btn btn-secondary btn-sm">✖️</button>
        </div>

        <div class="player-progress-container">
          <svg width="120" height="120" class="player-progress-svg">
            <circle cx="60" cy="60" r="52" class="player-progress-bg"/>
            <circle id="player-progress-ring" cx="60" cy="60" r="52" class="player-progress-ring"
                    style="stroke-dasharray: 326.73 326.73; stroke-dashoffset: 326.73;"/>
          </svg>
          <div id="player-time" class="player-time">0:00 / 0:00</div>
        </div>

        <div class="player-controls">
          <button onclick="window.featuresManager.engines.meditations.skipBackward()" 
                  class="player-btn" 
                  aria-label="Skip backward 15 seconds">⏪</button>
          <button id="play-pause-btn" 
                  onclick="window.featuresManager.engines.meditations.togglePlayback()" 
                  class="player-btn player-btn-main" 
                  aria-label="Play/Pause">▶️</button>
          <button onclick="window.featuresManager.engines.meditations.skipForward()" 
                  class="player-btn" 
                  aria-label="Skip forward 15 seconds">⏩</button>
        </div>

        <div id="video-pane" class="video-pane hidden">
          <div id="yt-player-wrapper" style="width:100%;min-width:${MeditationsEngine.MIN_PLAYER_WIDTH}px;"></div>
        </div>
      </div>
    `;
  }

  // ===== PLAYBACK CONTROL =====
  /**
   * Initializes and plays a meditation by ID
   */
  playMeditation(id) {
    const meditation = this.meditations.find(m => m.id === id);
    if (!meditation) {
      this.app.showToast('❌ Meditation not found', 'error');
      return;
    }

    // Check premium access
    if (meditation.premium && !this.app.state?.currentUser?.isPremium) {
      this.app.showToast('🔒 This is a premium meditation', 'warning');
      return;
    }

    this.currentMeditation = meditation;
    this.sessionStartTime = Date.now();

    // Update player UI
    document.getElementById('player-title').textContent = meditation.title;
    document.getElementById('player-category').textContent = meditation.category;
    document.getElementById('meditation-audio-player').classList.remove('hidden');

    // Initialize YouTube player
    this._initYouTubePlayer(meditation);
  }

  /**
   * Initializes YouTube IFrame player
   */
  _initYouTubePlayer(meditation) {
    const videoId = this._extractVideoId(meditation.embedUrl);
    if (!videoId) {
      this.app.showToast('❌ Invalid video URL', 'error');
      return;
    }

    const wrapper = document.getElementById('yt-player-wrapper');
    if (!wrapper) {
      console.error('[Meditations] yt-player-wrapper not found');
      return;
    }

    // Clear previous player
    wrapper.innerHTML = '<div id="yt-player"></div>';

    // Wait for YouTube API
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      try {
        this.ytPlayer = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1
          },
          events: {
            onReady: () => this._onPlayerReady(),
            onStateChange: (event) => this._onPlayerStateChange(event)
          }
        });
      } catch (error) {
        console.error('Error creating YouTube player:', error);
        this.app.showToast('❌ Failed to load player', 'error');
      }
    };

    initPlayer();
  }

  /**
   * Extracts video ID from YouTube URL
   */
  _extractVideoId(url) {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  }

  /**
   * Handles YouTube player ready event
   */
  _onPlayerReady() {
    this.isPlaying = true;
    document.getElementById('play-pause-btn').textContent = '⏸️';
    
    // Start progress updates
    this.progressInterval = setInterval(
      () => this.updateProgress(),
      MeditationsEngine.PROGRESS_UPDATE_MS
    );

    this.app.showToast('▶️ Meditation started', 'info');
  }

  /**
   * Handles YouTube player state changes
   */
  _onPlayerStateChange(event) {
    const YT = window.YT;
    if (!YT) return;

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        this.isPlaying = true;
        document.getElementById('play-pause-btn').textContent = '⏸️';
        break;
      
      case YT.PlayerState.PAUSED:
        this.isPlaying = false;
        document.getElementById('play-pause-btn').textContent = '▶️';
        break;
      
      case YT.PlayerState.ENDED:
        this.onMeditationComplete();
        break;
    }
  }

  /**
   * Shows video player pane
   */
  _showVideoPane() {
    const pane = document.getElementById('video-pane');
    if (pane) pane.classList.remove('hidden');
  }

  /**
   * Hides video player pane
   */
  _hideVideoPane() {
    const pane = document.getElementById('video-pane');
    if (pane) pane.classList.add('hidden');
  }

  /**
   * Toggles play/pause state
   */
  togglePlayback() {
    if (!this.ytPlayer || typeof this.ytPlayer.getPlayerState !== 'function') {
      this.app.showToast('⏸️ Player not ready', 'info');
      return;
    }

    try {
      const state = this.ytPlayer.getPlayerState();
      const YT = window.YT;
      
      if (!YT) return;

      if (state === YT.PlayerState.PLAYING) {
        this.ytPlayer.pauseVideo();
      } else if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.CUED) {
        this.ytPlayer.playVideo();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      this.app.showToast('⏸️ Player not ready', 'info');
    }
  }

  /**
   * Stops meditation and hides player
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

      const playBtn = document.getElementById('play-pause-btn');
      const player = document.getElementById('meditation-audio-player');
      
      if (playBtn) playBtn.textContent = '▶️';
      if (player) player.classList.add('hidden');
      
      this._hideVideoPane();
    } catch (error) {
      console.error('Error stopping meditation:', error);
    }
  }

  /**
   * Skips forward by SKIP_SECONDS
   */
  skipForward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      const newTime = Math.min(current + MeditationsEngine.SKIP_SECONDS, duration);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  }

  /**
   * Skips backward by SKIP_SECONDS
   */
  skipBackward() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const newTime = Math.max(current - MeditationsEngine.SKIP_SECONDS, 0);
      this.ytPlayer.seekTo(newTime, true);
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  }

  // ===== PROGRESS TRACKING =====
  /**
   * Updates progress display and ring
   */
  updateProgress() {
    if (!this.ytPlayer || typeof this.ytPlayer.getCurrentTime !== 'function') return;
    
    try {
      const current = this.ytPlayer.getCurrentTime() || 0;
      const duration = this.ytPlayer.getDuration() || 0;
      
      if (duration > 0) {
        const timeDisplay = document.getElementById('player-time');
        if (timeDisplay) {
          timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
        }
        this.updateRing(current, duration);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }

  /**
   * Updates circular progress ring
   */
  updateRing(current, duration) {
    const ring = document.getElementById('player-progress-ring');
    if (!ring || !duration || duration === 0) return;
    
    try {
      const radius = ring.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      ring.style.strokeDasharray = `${circumference} ${circumference}`;
      
      const progress = current / duration;
      const offset = circumference - (progress * circumference);
      ring.style.strokeDashoffset = isNaN(offset) ? circumference : offset;
    } catch (error) {
      console.error('Error updating ring:', error);
    }
  }

  // ===== COMPLETION & ACHIEVEMENTS =====
  /**
   * Handles meditation completion - saves session and checks achievements
   */
  onMeditationComplete() {
    try {
      this.isPlaying = false;
      const playBtn = document.getElementById('play-pause-btn');
      if (playBtn) playBtn.textContent = '▶️';
      
      this.app.showToast('🎉 Meditation complete! Well done.', 'success');
      
      if (!this.currentMeditation) return;

      const duration = this.ytPlayer 
        ? Math.floor((this.ytPlayer.getDuration() || 0) / 60)
        : 0;
      
      const chakra = this.getChakraFromMeditation(this.currentMeditation.category);
      
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

      // Save session
      if (this.app.state) {
        this.app.state.addEntry('meditation', sessionData);
      }

      // Progress quest
      if (sessionData.type === 'guided' && this.app.gamification) {
        this.app.gamification.progressQuest('daily', 'meditation_session', 1);
      }

      this.checkAchievements();
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error completing meditation:', error);
    }
  }

  /**
   * Checks and grants meditation achievements
   */
  checkAchievements() {
    try {
      const total = this.app.state?.data?.meditationEntries?.length || 0;
      const gm = this.app.gamification;
      if (!gm) return;

      MeditationsEngine.ACHIEVEMENTS.forEach(achievement => {
        if (total === achievement.count) {
          gm.grantAchievement({
            id: achievement.id,
            name: achievement.name,
            xp: achievement.xp,
            icon: achievement.icon,
            inspirational: achievement.msg
          });
        }
      });
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  /**
   * Maps meditation category to chakra
   */
  getChakraFromMeditation(category) {
    return MeditationsEngine.CHAKRA_MAPPING[category] || null;
  }

  // ===== UTILITY METHODS =====
  /**
   * Formats seconds to MM:SS
   */
  formatTime(seconds) {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Opens PDF guide in new tab
   */
  openPDFGuide() {
    if (this.pdfGuideUrl && this.pdfGuideUrl !== 'YOUR_PDF_URL_HERE') {
      window.open(this.pdfGuideUrl, '_blank');
    } else {
      this.app.showToast('ℹ️ PDF Guide is not yet available.', 'info');
    }
  }

  /**
   * Escapes HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  cleanup() {
    try {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }

      this.eventCleanup.forEach(fn => fn());
      this.eventCleanup = [];

      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        this.ytPlayer.destroy();
        this.ytPlayer = null;
      }

      this.isPlaying = false;
      this.currentMeditation = null;
      this.sessionStartTime = null;
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export for module systems and global window access
if (typeof window !== 'undefined') {
  window.MeditationsEngine = MeditationsEngine;
}

export default MeditationsEngine;