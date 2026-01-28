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
    
    // YouTube Player
    this.ytPlayer = null;
    this.isPlaying = false;
    this.currentMeditation = null;
    this.sessionStartTime = null;
    this.progressInterval = null;
    
    // Event management
    this.eventCleanup = [];
    
    // DOM cache for performance
    this.domCache = {};
    
    // Configuration
    this.config = {
      pdfGuideUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Source_PDF/Meditation_Demo.pdf',
      skipSeconds: 15,
      minPlayerWidth: 380,
      progressUpdateMs: 1000
    };

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
   * Render the meditations tab UI
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

          ${this.renderWellnessToolkit()}
          ${this.renderMeditationsGrid()}
          ${this.renderAudioPlayer()}
          ${this.renderVideoPane()}

        </div>
      </div>
    `;

    // Cache DOM elements after render
    this.cacheDOM();
    
    // Setup event listeners
    this.attachEventListeners();
  }

  /**
   * Render wellness toolkit section
   * @returns {string} HTML string
   */
  renderWellnessToolkit() {
    return `
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
    `;
  }

  /**
   * Render meditations grid
   * @returns {string} HTML string
   */
  renderMeditationsGrid() {
    const freeMeditations = this.meditations.filter(m => !m.premium);
    const premiumMeditations = this.meditations.filter(m => m.premium);

    return `
      <div class="card" style="margin-bottom: 2rem;">
        <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
          <h3 class="dashboard-wellness-title">🎧 Free Guided Meditations</h3>
          <p class="dashboard-wellness-subtitle">Begin your journey with our foundational practices</p>
        </div>
        <div class="meditations-grid">
          ${freeMeditations.map(m => this.renderMeditationCard(m)).join('')}
        </div>
      </div>

      <div class="card">
        <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
          <h3 class="dashboard-wellness-title">💎 Premium Meditations</h3>
          <p class="dashboard-wellness-subtitle">Unlock advanced practices for deeper transformation</p>
        </div>
        <div class="meditations-grid">
          ${premiumMeditations.map(m => this.renderMeditationCard(m)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render individual meditation card
   * @param {Object} meditation - Meditation data object
   * @returns {string} HTML string
   */
  renderMeditationCard(meditation) {
    const isPremium = meditation.premium;
    const isLocked = isPremium && !this.app.state?.isPremium();
    const lockClass = isLocked ? 'locked' : '';

    return `
      <div class="meditation-card ${lockClass}" 
           data-meditation-id="${meditation.id}"
           onclick="window.featuresManager.engines.meditations.${isLocked ? 'showPremiumPrompt' : 'playMeditation'}(${meditation.id})">
        <div class="meditation-emoji">${meditation.emoji}</div>
        <h4 class="meditation-title">${meditation.title}</h4>
        <p class="meditation-category">${meditation.category}</p>
        <p class="meditation-description">${meditation.description}</p>
        <div class="meditation-footer">
          <span class="meditation-duration">⏱️ ${meditation.duration}</span>
          ${isPremium ? '<span class="premium-badge">👑 Premium</span>' : ''}
        </div>
        ${isLocked ? '<div class="meditation-lock-overlay"><div class="lock-icon">🔒</div></div>' : ''}
      </div>
    `;
  }

  /**
   * Render audio player controls
   * @returns {string} HTML string
   */
  renderAudioPlayer() {
    return `
      <div id="meditation-audio-player" class="meditation-audio-player hidden">
        <div class="player-container">
          <div class="player-progress-ring-container">
            <svg width="80" height="80" class="player-progress-svg">
              <circle cx="40" cy="40" r="36" class="player-progress-bg"/>
              <circle id="player-progress-ring" cx="40" cy="40" r="36" class="player-progress-circle"/>
            </svg>
            <div class="player-icon">🧘‍♀️</div>
          </div>
          <div class="player-info">
            <div id="player-title" class="player-title">Select a meditation</div>
            <div id="player-time" class="player-time">0:00 / 0:00</div>
          </div>
          <div class="player-controls">
            <button id="skip-back-btn" class="player-btn" onclick="window.featuresManager.engines.meditations.skipBackward()">⏪</button>
            <button id="play-pause-btn" class="player-btn player-btn-main" onclick="window.featuresManager.engines.meditations.togglePlayback()">▶️</button>
            <button id="skip-forward-btn" class="player-btn" onclick="window.featuresManager.engines.meditations.skipForward()">⏩</button>
            <button id="stop-btn" class="player-btn" onclick="window.featuresManager.engines.meditations.stopMeditation()">⏹️</button>
            <button id="video-toggle-btn" class="player-btn" onclick="window.featuresManager.engines.meditations.toggleVideoPane()" title="Show/Hide Video">📺</button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render video player pane
   * @returns {string} HTML string
   */
  renderVideoPane() {
    return `
      <div id="meditation-video-pane" class="meditation-video-pane hidden">
        <div class="video-pane-header">
          <span id="video-pane-title" class="video-pane-title">Meditation Video</span>
          <button class="video-pane-close" onclick="window.featuresManager.engines.meditations.hideVideoPane()">✕</button>
        </div>
        <div class="video-pane-content">
          <div id="yt-player-container"></div>
        </div>
      </div>
    `;
  }

  /**
   * Cache frequently accessed DOM elements for performance
   */
  cacheDOM() {
    this.domCache = {
      audioPlayer: document.getElementById('meditation-audio-player'),
      playPauseBtn: document.getElementById('play-pause-btn'),
      playerTitle: document.getElementById('player-title'),
      playerTime: document.getElementById('player-time'),
      progressRing: document.getElementById('player-progress-ring'),
      videoPane: document.getElementById('meditation-video-pane'),
      videoPaneTitle: document.getElementById('video-pane-title'),
      ytPlayerContainer: document.getElementById('yt-player-container')
    };
  }

  /**
   * Attach event listeners with proper cleanup tracking
   */
  attachEventListeners() {
    // Clear previous event listeners
    this.eventCleanup.forEach(cleanup => cleanup());
    this.eventCleanup = [];

    // Add resize handler for responsive video
    const handleResize = () => this.handleVideoResize();
    window.addEventListener('resize', handleResize);
    this.eventCleanup.push(() => window.removeEventListener('resize', handleResize));
  }

  /**
   * Handle video pane resize for responsive behavior
   */
  handleVideoResize() {
    if (!this.domCache.videoPane || this.domCache.videoPane.classList.contains('hidden')) return;
    
    const width = window.innerWidth;
    if (width < this.config.minPlayerWidth && !this.domCache.videoPane.classList.contains('hidden')) {
      this.hideVideoPane();
    }
  }

  /**
   * Show premium prompt for locked content
   */
  showPremiumPrompt() {
    this.app.showToast('🔒 This is a premium meditation. Upgrade to access all content!', 'info');
    
    // Optional: Trigger premium modal if available
    if (typeof this.app.showPremiumModal === 'function') {
      setTimeout(() => this.app.showPremiumModal(), 500);
    }
  }

  /**
   * Play selected meditation
   * @param {number} id - Meditation ID
   */
  playMeditation(id) {
    const meditation = this.meditations.find(m => m.id === id);
    if (!meditation) {
      console.error('Meditation not found:', id);
      return;
    }

    // Check premium access
    if (meditation.premium && !this.app.state?.isPremium()) {
      this.showPremiumPrompt();
      return;
    }

    this.currentMeditation = meditation;
    this.sessionStartTime = Date.now();

    // Update UI
    if (this.domCache.playerTitle) {
      this.domCache.playerTitle.textContent = meditation.title;
    }
    if (this.domCache.videoPaneTitle) {
      this.domCache.videoPaneTitle.textContent = meditation.title;
    }
    if (this.domCache.audioPlayer) {
      this.domCache.audioPlayer.classList.remove('hidden');
    }

    // Initialize YouTube player
    this.initYouTubePlayer(meditation.embedUrl);

    this.app.showToast(`🧘 Starting: ${meditation.title}`, 'success');
  }

  /**
   * Initialize YouTube IFrame player
   * @param {string} embedUrl - YouTube embed URL
   */
  initYouTubePlayer(embedUrl) {
    const videoId = this.extractVideoId(embedUrl);
    if (!videoId) {
      console.error('Invalid YouTube URL:', embedUrl);
      return;
    }

    // Wait for YouTube API
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(initPlayer, 100);
        return;
      }

      // Destroy existing player
      if (this.ytPlayer && typeof this.ytPlayer.destroy === 'function') {
        this.ytPlayer.destroy();
      }

      // Create new player
      this.ytPlayer = new window.YT.Player('yt-player-container', {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1
        },
        events: {
          onReady: (event) => this.onPlayerReady(event),
          onStateChange: (event) => this.onPlayerStateChange(event),
          onError: (event) => this.onPlayerError(event)
        }
      });
    };

    initPlayer();
  }

  /**
   * Extract video ID from YouTube URL
   * @param {string} url - YouTube URL
   * @returns {string|null} Video ID or null
   */
  extractVideoId(url) {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  }

  /**
   * YouTube player ready event handler
   * @param {Object} event - YouTube event
   */
  onPlayerReady(event) {
    this.isPlaying = true;
    if (this.domCache.playPauseBtn) {
      this.domCache.playPauseBtn.textContent = '⏸️';
    }

    // Start progress tracking
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.progressInterval = setInterval(() => this.updateProgress(), this.config.progressUpdateMs);

    // Auto-play
    event.target.playVideo();
  }

  /**
   * YouTube player state change handler
   * @param {Object} event - YouTube event
   */
  onPlayerStateChange(event) {
    const states = window.YT.PlayerState;
    
    switch (event.data) {
      case states.PLAYING:
        this.isPlaying = true;
        if (this.domCache.playPauseBtn) {
          this.domCache.playPauseBtn.textContent = '⏸️';
        }
        break;
        
      case states.PAUSED:
        this.isPlaying = false;
        if (this.domCache.playPauseBtn) {
          this.domCache.playPauseBtn.textContent = '▶️';
        }
        break;
        
      case states.ENDED:
        this.onMeditationComplete();
        break;
    }
  }

  /**
   * YouTube player error handler
   * @param {Object} event - YouTube error event
   */
  onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    this.app.showToast('⚠️ Video error. Please try another meditation.', 'error');
  }

  /**
   * Toggle video pane visibility
   */
  toggleVideoPane() {
    if (!this.domCache.videoPane) return;

    if (this.domCache.videoPane.classList.contains('hidden')) {
      this.showVideoPane();
    } else {
      this.hideVideoPane();
    }
  }

  /**
   * Show video pane
   */
  showVideoPane() {
    if (!this.domCache.videoPane) return;
    this.domCache.videoPane.classList.remove('hidden');
  }

  /**
   * Hide video pane
   */
  hideVideoPane() {
    if (!this.domCache.videoPane) return;
    this.domCache.videoPane.classList.add('hidden');
  }

  /**
   * Toggle play/pause state
   */
  togglePlayback() {
    if (!this.ytPlayer || typeof this.ytPlayer.getPlayerState !== 'function') {
      this.app.showToast('⏸️ Player not ready', 'info');
      return;
    }

    try {
      const state = this.ytPlayer.getPlayerState();
      const states = window.YT.PlayerState;

      if (state === states.PLAYING) {
        this.ytPlayer.pauseVideo();
      } else if (state === states.PAUSED || state === states.CUED) {
        this.ytPlayer.playVideo();
      } else {
        this.app.showToast('⏸️ Player not ready', 'info');
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
      this.app.showToast('⏸️ Player error', 'error');
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

      if (this.domCache.playPauseBtn) {
        this.domCache.playPauseBtn.textContent = '▶️';
      }
      if (this.domCache.audioPlayer) {
        this.domCache.audioPlayer.classList.add('hidden');
      }
      
      this.hideVideoPane();
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
      const newTime = Math.min(current + this.config.skipSeconds, duration);
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
      const newTime = Math.max(current - this.config.skipSeconds, 0);
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
        if (this.domCache.playerTime) {
          this.domCache.playerTime.textContent = 
            `${this.formatTime(current)} / ${this.formatTime(duration)}`;
        }
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
    const ring = this.domCache.progressRing;
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
   * Handle meditation completion
   */
  onMeditationComplete() {
    try {
      this.isPlaying = false;
      if (this.domCache.playPauseBtn) {
        this.domCache.playPauseBtn.textContent = '▶️';
      }
      
      this.app.showToast('🎉 Meditation complete! Well done.', 'success');
      
      if (!this.currentMeditation) return;

      // Calculate duration
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

      // Update quests
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
   * Check and grant meditation achievements
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
    if (this.config.pdfGuideUrl && this.config.pdfGuideUrl !== 'YOUR_PDF_URL_HERE') {
      window.open(this.config.pdfGuideUrl, '_blank');
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

      // Remove event listeners
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
      this.domCache = {};
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