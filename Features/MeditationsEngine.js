// ===================================================================
// MEDITATIONS ENGINE  (centered-wrapper patch)
// ===================================================================
class MeditationsEngine {
  constructor(app) {
    this.app = app;
    this.currentAudio = null;
    this.isPlaying = false;
    this.currentMeditation = null;
    this.sessionStartTime = null;
    this.pdfGuideUrl = 'YOUR_PDF_URL_HERE'; // Replace with actual PDF URL

    //  load YouTube API once, globally
    if (!window.YT && !document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = () => {
      window.ytReady = true; // global flag
    };

    this.meditations = [
      // --------------  FREE  --------------
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

      // --------------  PREMIUM --------------
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

  /* --------------  UI RENDER -------------- */
  render() {
    const tab = document.getElementById('meditations-tab');
    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <!--  MOBILE-ONLY IMAGE + SUBTITLE HEADER  -->
          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavMeditations.png');
                         --header-title:'';
                         --header-tag:'Aanandoham\'s curated, unique collection of guided meditations'">
            <h1>Guided Meditations</h1>
            <h3>Aanandoham's curated, unique collection of guided meditations</h3>
            <span class="header-sub"></span>
          </header>

          <!--  PDF BUTTON  -->
          <div class="text-center" style="margin-bottom: 2rem;">
            <button onclick="window.featuresManager.engines.meditations.openPDFGuide()" 
                    class="btn btn-primary" 
                    style="padding: 12px 32px; display: inline-flex; align-items: center; gap: 8px;">
              📖 A simple Meditation-Guide for you (PDF file)
            </button>
          </div>

          <!--  WELLNESS TOOLKIT  -->
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

          <!--  GUIDED MEDITATIONS WRAPPER CARD  -->
          <div class="card" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
              <h3 class="dashboard-wellness-title">🎧 Guided Meditations (Audio & Video)</h3>
              <p class="dashboard-wellness-subtitle">Aanandoham's curated, unique collection</p>
            </div>

            <!--  CENTERED FLEX WRAP  -->
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem;">
              ${this.meditations.map(med => {
                const isPremium = med.premium;
                const isLocked  = isPremium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations');
                return `
                <div class="card relative ${isLocked ? 'opacity-75' : ''}" 
                     title="${isLocked ? '🔒 Purchase Advanced Meditations in Karma Shop to unlock' : ''}"
                     style="flex:0 1 320px;max-width:320px;">
                  ${med.category === 'Premium' ? '<span class="premium-badge-tr">PREMIUM</span>' : ''}
                  ${isLocked ? '<div style="position:absolute;top:1rem;right:1rem;font-size:3rem;opacity:0.3;z-index:1;">🔒</div>' : ''}
                  
                  <div class="flex items-center justify-between" style="margin-bottom: 0.75rem;">
                    <span class="text-3xl">${med.emoji}</span>
                    <span class="text-sm" style="color:var(--neuro-text-light);">${med.duration}</span>
                  </div>
                  
                  <h4 class="text-xl font-bold" style="color:var(--neuro-text);margin-bottom: 0.5rem;">${med.title}</h4>
                  <p style="color:var(--neuro-text-light);" class="text-sm" style="margin-bottom: 0.75rem;">${med.description}</p>
                  <span class="badge badge-primary">${med.category}</span>

                  <div class="mt-4 flex gap-2">
                    <button class="btn btn-secondary flex-1" onclick="window.featuresManager.engines.meditations.playAudio(${med.id})">
                      🎧 Audio
                    </button>
                    <button class="btn btn-primary flex-1" onclick="window.featuresManager.engines.meditations.playVideo(${med.id})">
                      ▶️ Video
                    </button>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>

          <!--  PLAYER WRAPPER  -->
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
              <audio id="meditation-audio" preload="metadata" crossOrigin="anonymous"></audio>
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
              <div id="resize-l" class="resize-corner resize-l" title="Resize"></div>
              <div id="resize-r" class="resize-corner resize-r" title="Resize"></div>
            </div>
          </div>

        </div>
      </div>

      <style>
        /*  wrapper lets us position anywhere  */
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
        }
        .compact-player.hidden { transform: translateY(100px); opacity: 0; pointer-events: none; }
        .compact-player.video-mode { max-width: none; padding: 12px; }
        .play-pause-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .player-close-btn { position: absolute; top: 15px; right: 15px; width: 30px; height: 30px; border: none; background: none; cursor: pointer; color: var(--neuro-text-light); font-size: 1.2rem; line-height: 1; z-index: 10; }
        
        /*  header becomes drag handle  */
        .player-info {
          cursor: grab;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .player-info:active {
          cursor: grabbing;
        }

        .player-emoji { width: 50px; height: 50px; flex-shrink: 0; background: var(--neuro-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light); }
        .player-text #player-title { color: var(--neuro-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .player-text #player-time { color: var(--neuro-text-light); }
        .player-controls { display: flex; justify-content: space-around; align-items: center; flex-shrink: 0; }
        .play-pause-wrapper { position: relative; width: 60px; height: 60px; }
        .play-pause-btn { width: 50px; height: 50px; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 0; }
        .progress-ring { position: absolute; top: 0; left: 0; }
        .progress-ring-bg { stroke: var(--neuro-shadow-dark); }
        .progress-ring-fg { stroke: var(--neuro-accent); transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset .1s linear; }
        .player-controls .icon-btn { width: 40px; height: 40px; padding: 0; }

        /*  video pane - fills available space  */
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
        .video-pane.hidden { 
          display: none; 
        }

        /*  STOP button inside ring  */
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

        /*  corner resize handles  */
        .resize-corner {
          position: absolute;
          top: 0;
          width: 18px;
          height: 18px;
          cursor: nwse-resize;
          background: linear-gradient(135deg, var(--neuro-accent) 40%, transparent 40%);
          opacity: .5;
          transition: opacity .2s;
          z-index: 5;
        }
        .resize-corner:hover { opacity: 1; }
        .resize-l { left: 0; border-radius: 0 0 var(--radius-xl) 0; }
        .resize-r { right: 0; border-radius: 0 0 0 var(--radius-xl); transform: scaleX(-1); }
      </style>
    `;
  }

  /* ------------- PUBLIC AUDIO / VIDEO ENTRYS ------------- */
  playAudio(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    if (med.premium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('🔒 Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    this._play(id, 'audio');
  }

  playVideo(id) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;
    if (med.premium && !this.app.gamification?.state?.unlockedFeatures?.includes('advanced_meditations')) {
      this.app.showToast('🔒 Unlock Advanced Meditations in the Karma Shop!', 'info');
      return;
    }
    this._play(id, 'video');
  }

  /* ------------- PRIVATE CORE ------------- */
  _play(id, mode) {
    const med = this.meditations.find(m => m.id === id);
    if (!med) return;

    this.currentMeditation = med;
    this.sessionStartTime = Date.now();

    /*  show same pop-up  */
    const playerBox = document.getElementById('meditation-audio-player');
    document.getElementById('player-emoji').textContent = med.emoji;
    document.getElementById('player-title').textContent = med.title;
    playerBox.classList.remove('hidden');

    if (mode === 'video' && med.embedUrl) {
      this._startYouTube(med);
    } else if (mode === 'audio') {
      this._startAudio(med);
    }
  }

  /* ------------- YOUTUBE – VISIBLE & RESIZABLE & DRAGGABLE ------------- */
  _startYouTube(med) {
    if (!window.ytReady) {
      this.app.showToast('🎧 Initialising player… please tap again.', 'info');
      window.onYouTubeIframeAPIReady = () => {
        window.ytReady = true;
        this._startYouTube(med);
      };
      return;
    }

    const videoId = med.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1];

    /*  1.  force iframe src *now* so the document exists  */
    const iframe = document.getElementById('yt-iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&playsinline=1`;

    /*  2.  create API object only once  */
    if (!window.ytPlayer || typeof window.ytPlayer.playVideo !== 'function') {
      window.ytPlayer = new YT.Player('yt-iframe', {
        events: {
          onReady: (e) => {
            document.getElementById('play-pause-btn').disabled = false;
            this.app.showToast('Ready – tap play to start', 'info');
          },
          onStateChange: (e) => {
            const eng = window.featuresManager.engines.meditations;
            if (e.data === YT.PlayerState.ENDED && eng.currentMeditation) eng.onMeditationComplete();
            if (e.data === YT.PlayerState.PLAYING)  { eng.isPlaying = true;  document.getElementById('play-pause-btn').textContent = '⏸️'; }
            if (e.data === YT.PlayerState.PAUSED)   { eng.isPlaying = false; document.getElementById('play-pause-btn').textContent = '▶️'; }
          }
        }
      });
    } else {
      /*  3.  player exists – cue new video  */
      window.ytPlayer.loadVideoById(videoId);
    }

    /*  4.  grey until onReady fires  */
    document.getElementById('play-pause-btn').disabled = true;
    this._showVideoPane();

    // Start progress update interval
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying) this.updateProgress();
    }, 1000);
  }

  /* ------------- AUDIO branch (YouTube audio without video pane) ------------- */
  _startAudio(med) {
    if (!window.ytReady) {
      this.app.showToast('🎧 Initialising player… please tap again.', 'info');
      window.onYouTubeIframeAPIReady = () => {
        window.ytReady = true;
        this._startAudio(med);
      };
      return;
    }

    const videoId = med.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1];

    /*  force iframe src  */
    const iframe = document.getElementById('yt-iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&playsinline=1`;

    /*  create or reuse YouTube player  */
    if (!window.ytPlayer || typeof window.ytPlayer.playVideo !== 'function') {
      window.ytPlayer = new YT.Player('yt-iframe', {
        events: {
          onReady: (e) => {
            document.getElementById('play-pause-btn').disabled = false;
            window.ytPlayer.playVideo();
            this.app.showToast('🎧 Audio playing', 'success');
          },
          onStateChange: (e) => {
            const eng = window.featuresManager.engines.meditations;
            if (e.data === YT.PlayerState.ENDED && eng.currentMeditation) eng.onMeditationComplete();
            if (e.data === YT.PlayerState.PLAYING)  { eng.isPlaying = true;  document.getElementById('play-pause-btn').textContent = '⏸️'; }
            if (e.data === YT.PlayerState.PAUSED)   { eng.isPlaying = false; document.getElementById('play-pause-btn').textContent = '▶️'; }
          }
        }
      });
    } else {
      /*  player exists – load new video and auto-play  */
      window.ytPlayer.loadVideoById(videoId);
      window.ytPlayer.playVideo();
    }

    /*  grey until ready  */
    document.getElementById('play-pause-btn').disabled = true;

    /*  keep video pane HIDDEN for audio mode  */
    this._hideVideoPane();

    // Start progress update interval
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      if (this.isPlaying) this.updateProgress();
    }, 1000);
  }

  /* ------------- VIDEO PANE HELPERS ------------- */
  _showVideoPane() {
    document.getElementById('video-pane').classList.remove('hidden');
    document.getElementById('resize-l').classList.remove('hidden');
    document.getElementById('resize-r').classList.remove('hidden');
    document.getElementById('meditation-audio-player').classList.add('video-mode');
    this.initDrag();
    this.initResize();
  }
  _hideVideoPane() {
    document.getElementById('video-pane').classList.add('hidden');
    document.getElementById('resize-l').classList.add('hidden');
    document.getElementById('resize-r').classList.add('hidden');
    document.getElementById('meditation-audio-player').classList.remove('video-mode');
  }

  /* ------------- DRAG-TO-MOVE (header) ------------- */
  initDrag() {
    const header = document.querySelector('.player-info');
    const wrap = document.getElementById('meditation-player-wrapper');
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
  }

  /* ------------- DRAG-TO-RESIZE (top corners - only grows from starting size) ------------- */
  initResize() {
    const player = document.getElementById('meditation-audio-player');
    const corners = [
      { el: document.getElementById('resize-l'), dir: -1 },
      { el: document.getElementById('resize-r'), dir: 1 }
    ];

    corners.forEach(c => {
      let startX, startW, startY, startH;
      const start = (e) => {
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        startW = player.offsetWidth;
        startH = player.offsetHeight;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
        document.addEventListener('touchmove', move, { passive: false });
        document.addEventListener('touchend', end);
        e.preventDefault();
      };

      const move = (e) => {
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;

        // Only allow growing, not shrinking (minimum is original start size)
        const newW = Math.max(startW, startW + c.dir * cx);
        const newH = Math.max(startH, startH + cy);

        player.style.width = newW + 'px';
        player.style.height = newH + 'px';
      };

      const end = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', end);
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
      };

      c.el.addEventListener('mousedown', start);
      c.el.addEventListener('touchstart', start, { passive: false });
    });
  }

  /* ------------- CONTROLS (work for both modes) ------------- */
  togglePlay() {
    if (!this.currentMeditation) return;

    /*  guard: wait until the API object exists AND has methods  */
    if (this.currentMeditation.embedUrl && (!window.ytPlayer || typeof window.ytPlayer.playVideo !== 'function')) {
      this.app.showToast('⳿ Player finishing setup – please wait', 'info');
      return;
    }

    if (this.currentMeditation.embedUrl && window.ytPlayer) {
      if (this.isPlaying) {
        window.ytPlayer.pauseVideo();
        this.isPlaying = false;
      } else {
        window.ytPlayer.playVideo();
        this.isPlaying = true;
      }
      document.getElementById('play-pause-btn').textContent = this.isPlaying ? '⏸️' : '▶️';
      return;
    }

    if (!this.currentAudio) return;
    if (this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      document.getElementById('play-pause-btn').textContent = '▶️';
    } else {
      this.currentAudio.play();
      this.isPlaying = true;
      document.getElementById('play-pause-btn').textContent = '⏸️';
    }
  }

  /* ------------- STOP & CLOSE ------------- */
  stopMeditation() {
    if (this.currentMeditation?.embedUrl && window.ytPlayer) {
      window.ytPlayer.stopVideo();
      this.isPlaying = false;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
    }
    // Clear progress interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    this.currentMeditation = null;
    this.sessionStartTime = null;
    document.getElementById('play-pause-btn').textContent = '▶️';
    document.getElementById('meditation-audio-player').classList.add('hidden');
    this._hideVideoPane();
  }

  skipForward() {
    if (this.currentMeditation?.embedUrl && window.ytPlayer) {
      const t = window.ytPlayer.getCurrentTime() + 15;
      window.ytPlayer.seekTo(Math.min(t, window.ytPlayer.getDuration()), true);
      return;
    }
    if (this.currentAudio) {
      this.currentAudio.currentTime = Math.min(this.currentAudio.currentTime + 15, this.currentAudio.duration);
    }
  }

  skipBackward() {
    if (this.currentMeditation?.embedUrl && window.ytPlayer) {
      const t = window.ytPlayer.getCurrentTime() - 15;
      window.ytPlayer.seekTo(Math.max(t, 0), true);
      return;
    }
    if (this.currentAudio) {
      this.currentAudio.currentTime = Math.max(this.currentAudio.currentTime - 15, 0);
    }
  }

  updateProgress() {
    if (this.currentMeditation?.embedUrl && window.ytPlayer) {
      const cur = window.ytPlayer.getCurrentTime() || 0;
      const dur = window.ytPlayer.getDuration() || 0;
      document.getElementById('player-time').textContent = `${this.formatTime(cur)} / ${this.formatTime(dur)}`;
      this.updateRing(cur, dur);
      return;
    }
    if (!this.currentAudio || !this.currentAudio.duration) return;
    document.getElementById('player-time').textContent = `${this.formatTime(this.currentAudio.currentTime)} / ${this.formatTime(this.currentAudio.duration)}`;
    this.updateRing(this.currentAudio.currentTime, this.currentAudio.duration);
  }

  updateRing(current, duration) {
    const ring = document.getElementById('player-progress-ring');
    if (!ring || !duration) return;
    const r = ring.r.baseVal.value, c = 2 * Math.PI * r;
    ring.style.strokeDasharray = `${c} ${c}`;
    const offset = c - (current / duration) * c;
    ring.style.strokeDashoffset = isNaN(offset) ? c : offset;
  }

  onMeditationComplete() {
    this.isPlaying = false;
    document.getElementById('play-pause-btn').textContent = '▶️';
    this.app.showToast('🎉 Meditation complete! Well done.', 'success');
    if (!this.currentMeditation) return;
    const dur = this.currentMeditation.embedUrl
      ? Math.floor((window.ytPlayer?.getDuration() || 0) / 60)
      : Math.floor((this.currentAudio?.duration || 0) / 60);
    const chakra = this.getChakraFromMeditation(this.currentMeditation.category);
    const sessionData = {
      type: this.currentMeditation.type || 'guided',
      meditationId: this.currentMeditation.id,
      title: this.currentMeditation.title,
      category: this.currentMeditation.category,
      duration: dur,
      chakra: chakra,
      timestamp: new Date().toISOString(),
      sessionStartTime: this.sessionStartTime,
      completedAt: Date.now()
    };
    if (this.app.state) this.app.state.addEntry('meditation', sessionData);
    if (sessionData.type === 'guided' && this.app.gamification) this.app.gamification.progressQuest('daily', 'meditation_session', 1);
    this.checkAchievements();
    this.sessionStartTime = null;
  }

  checkAchievements() {
    const total = this.app.state?.data?.meditationEntries?.length || 0;
    const gm = this.app.gamification;
    if (!gm) return;
    if (total === 1) gm.grantAchievement({ id: 'first_meditation', name: 'First Journey Within', xp: 50, icon: '🧘', inspirational: "You have begun the sacred practice of meditation!" });
    if (total === 10) gm.grantAchievement({ id: 'meditation_10', name: 'Meditation Practitioner', xp: 100, icon: '🕉️', inspirational: '10 meditations! Your inner light grows brighter!' });
    if (total === 50) gm.grantAchievement({ id: 'meditation_50', name: 'Meditation Master', xp: 250, icon: '✨', inspirational: '50 meditations! You are a beacon of inner peace!' });
    if (total === 100) gm.grantAchievement({ id: 'meditation_100', name: 'Enlightened One', xp: 500, icon: '🌟', inspirational: '100 meditations! You walk in pure awareness!' });
  }

  getChakraFromMeditation(category) {
    const mapping = { Grounding: 'root', Energy: 'sacral', Chakras: 'heart', Spiritual: 'crown', Healing: 'heart', Manifestation: 'solar', Premium: 'crown' };
    return mapping[category] || null;
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  openPDFGuide() {
    if (this.pdfGuideUrl && this.pdfGuideUrl !== 'YOUR_PDF_URL_HERE') window.open(this.pdfGuideUrl, '_blank');
    else this.app.showToast('ℹ️ PDF Guide is not yet available.', 'info');
  }
}

// Export
if (typeof window !== 'undefined') window.MeditationsEngine = MeditationsEngine;
export default MeditationsEngine;