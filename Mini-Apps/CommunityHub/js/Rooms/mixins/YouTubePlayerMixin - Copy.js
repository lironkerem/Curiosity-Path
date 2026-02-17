/**
 * ═══════════════════════════════════════════════════════════════════════════
 * YOUTUBE PLAYER MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin YouTubePlayerMixin
 * @description Adds YouTube video player functionality to practice rooms
 * @version 3.0.0
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, YouTubePlayerMixin);
 * 
 * Requirements:
 *   - YouTube IFrame API
 *   - state.player, state.playerReady, state.playerInitialized
 *   - getCurrentSession() method returning { videoId, title, duration }
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const YouTubePlayerMixin = {
    /**
     * Initialize YouTube player state
     */
    initPlayerState() {
        this.state.player = null;
        this.state.playerReady = false;
        this.state.playerInitialized = false;
        this.state.sessionStarted = false;
    },
    
    /**
     * Load YouTube IFrame API
     */
    loadYouTubeAPI() {
        if (window.YT && window.YT.Player) {
            this.initPlayer();
            return;
        }
        
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.querySelector('script');
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        
        window.onYouTubeIframeAPIReady = () => {
            this.initPlayer();
        };
    },
    
    /**
     * Initialize YouTube player
     */
    initPlayer() {
        if (this.state.playerInitialized) return;
        
        const session = this.getCurrentSession();
        if (!session || !session.videoId) {
            console.warn('No video session available');
            return;
        }
        
        this.state.player = new YT.Player(`${this.roomId}-youtube-player`, {
            videoId: session.videoId,
            playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: this.onPlayerReady.bind(this),
                onStateChange: this.onPlayerStateChange.bind(this)
            }
        });
        
        this.state.playerInitialized = true;
    },
    
    /**
     * YouTube player ready callback
     * @param {Object} event - YouTube player event
     */
    onPlayerReady(event) {
        this.state.playerReady = true;
        console.log(`${this.config.icon} Player ready`);
        
        // Custom ready callback
        if (this.onPlayerReadyCustom) {
            this.onPlayerReadyCustom(event);
        }
    },
    
    /**
     * YouTube player state change callback
     * @param {Object} event - YouTube player event
     */
    onPlayerStateChange(event) {
        // YT.PlayerState.PLAYING = 1
        // YT.PlayerState.PAUSED = 2
        // YT.PlayerState.ENDED = 0
        
        if (event.data === YT.PlayerState.PLAYING) {
            this.onVideoPlaying();
        } else if (event.data === YT.PlayerState.ENDED) {
            this.onVideoEnded();
        }
    },
    
    /**
     * Handle video playing state
     */
    onVideoPlaying() {
        // Hide overlay
        const overlay = document.getElementById(`${this.roomId}PlayerOverlay`);
        if (overlay) overlay.style.display = 'none';
        
        // Show controls
        const controls = document.getElementById(`${this.roomId}Controls`);
        if (controls) controls.style.display = 'flex';
        
        // Start progress tracking
        this.startProgressTracking();
    },
    
    /**
     * Handle video ended state
     */
    onVideoEnded() {
        Core.showToast('Session complete 🙏');
        this.stopProgressTracking();
    },
    
    /**
     * Start session (play video)
     */
    startSession() {
        if (!this.state.playerReady || this.state.sessionStarted) return;
        
        const session = this.getCurrentSession();
        if (!session) return;
        
        // Hide overlay
        const overlay = document.getElementById(`${this.roomId}PlayerOverlay`);
        if (overlay) overlay.style.display = 'none';
        
        // Play video
        if (this.state.player && this.state.player.playVideo) {
            this.state.player.playVideo();
        }
        
        this.state.sessionStarted = true;
        Core.showToast(`${session.emoji} Session starting...`);
    },
    
    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (!this.state.player) return;
        
        const btn = document.getElementById(`${this.roomId}PlayBtn`);
        
        if (this.state.player.getPlayerState() === YT.PlayerState.PLAYING) {
            this.state.player.pauseVideo();
            if (btn) btn.innerHTML = '<span style="font-size: 24px;">▶</span>';
        } else {
            this.state.player.playVideo();
            if (btn) btn.innerHTML = '<span style="font-size: 24px;">⏸</span>';
        }
    },
    
    /**
     * Skip backward 10 seconds
     */
    skipBackward() {
        if (!this.state.player) return;
        const currentTime = this.state.player.getCurrentTime();
        this.state.player.seekTo(Math.max(0, currentTime - 10));
    },
    
    /**
     * Skip forward 10 seconds
     */
    skipForward() {
        if (!this.state.player) return;
        const currentTime = this.state.player.getCurrentTime();
        this.state.player.seekTo(currentTime + 10);
    },
    
    /**
     * Start progress tracking
     */
    startProgressTracking() {
        if (this.progressInterval) return;
        
        this.progressInterval = setInterval(() => {
            this.updateTimeDisplay();
        }, 1000);
    },
    
    /**
     * Stop progress tracking
     */
    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },
    
    /**
     * Update time display
     */
    updateTimeDisplay() {
        if (!this.state.player || !this.state.player.getCurrentTime) return;
        
        const current = Math.floor(this.state.player.getCurrentTime());
        const duration = Math.floor(this.state.player.getDuration());
        
        const timeDisplay = document.getElementById(`${this.roomId}TimeDisplay`);
        if (timeDisplay) {
            timeDisplay.textContent = `${this.formatTime(current)} / ${this.formatTime(duration)}`;
        }
    },
    
    /**
     * Build YouTube player container HTML
     * @returns {string} Player HTML
     */
    buildPlayerContainer() {
        const session = this.getCurrentSession();
        
        return `
        <div class="guided-player-container">
            <iframe id="${this.roomId}-youtube-player"
                width="100%"
                height="100%"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
            <div class="player-overlay" id="${this.roomId}PlayerOverlay">
                <div class="session-info">
                    <div class="session-emoji" id="${this.roomId}SessionEmoji">${session?.emoji || '🎧'}</div>
                    <div class="session-title" id="${this.roomId}SessionTitle">${session?.title || 'Loading...'}</div>
                    <div class="session-duration" id="${this.roomId}SessionDuration">${session?.duration || '00:00'}</div>
                    <div class="session-starts" id="${this.roomId}SessionStatus">Waiting to start...</div>
                </div>
            </div>
        </div>`;
    },
    
    /**
     * Build player controls HTML
     * @returns {string} Controls HTML
     */
    buildPlayerControls() {
        return `
        <div class="guided-controls" id="${this.roomId}Controls" style="display: none;">
            <div class="control-buttons">
                <button class="control-btn" onclick="${this.getClassName()}.skipBackward()">
                    <span style="font-size: 20px;">⏪</span>
                </button>
                <button class="control-btn primary" onclick="${this.getClassName()}.togglePlayPause()" id="${this.roomId}PlayBtn">
                    <span style="font-size: 24px;">⏸</span>
                </button>
                <button class="control-btn" onclick="${this.getClassName()}.skipForward()">
                    <span style="font-size: 20px;">⏩</span>
                </button>
            </div>
            
            <div class="time-display" id="${this.roomId}TimeDisplay">0:00 / 0:00</div>
        </div>`;
    },
    
    /**
     * Cleanup player on room exit
     */
    cleanupPlayer() {
        this.stopProgressTracking();
        
        if (this.state.player && this.state.player.destroy) {
            this.state.player.destroy();
        }
        
        this.state.player = null;
        this.state.playerReady = false;
        this.state.playerInitialized = false;
        this.state.sessionStarted = false;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.YouTubePlayerMixin = YouTubePlayerMixin;
