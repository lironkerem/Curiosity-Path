/**
 * YOUTUBE PLAYER MIXIN
 * Adds YouTube video player functionality to practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, YouTubePlayerMixin);
 *
 * Requirements:
 *   - YouTube IFrame API
 *   - getCurrentSession() → { videoId, title, duration, emoji }
 */


// ─── YT player state aliases ──────────────────────────────────────────────────
const _YT = { ENDED: 0, PLAYING: 1, PAUSED: 2 };

// ─────────────────────────────────────────────────────────────────────────────

const YouTubePlayerMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initPlayerState() {
        this.state.player             = null;
        this.state.playerReady        = false;
        this.state.playerInitialized  = false;
        this.state.sessionStarted     = false;
        this._progressInterval        = null;
    },

    // ── API loading ───────────────────────────────────────────────────────────

    /**
     * FIX #1 — Call this from onInit() (room card render) to load the YT script
     * early, without creating the player yet. Eliminates script-load lag on entry.
     */
    preloadYouTubeAPI() {
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) return;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    },

    /**
     * Call this from onEnter(). By now the script is likely already loaded
     * (preloaded during onInit), so initPlayer() fires immediately.
     */
    loadYouTubeAPI() {
        if (window.YT?.Player) {
            this.initPlayer();
            return;
        }

        // Script was preloaded but API not ready yet — queue up
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            prev?.();
            this.initPlayer();
        };
    },

    initPlayer() {
        if (this.state.playerInitialized) return;

        const session = this.getCurrentSession();
        if (!session?.videoId) {
            console.warn(`[${this.roomId}] No video session available`);
            return;
        }

        this.state.player = new YT.Player(`${this.roomId}-youtube-player`, {
            videoId: session.videoId,
            playerVars: {
                // FIX #2 — No autoplay:1. We control playback via startSession().
                // mute:1 kept so the browser allows cueVideoById() to buffer silently.
                autoplay: 0, controls: 1, modestbranding: 1, rel: 0, mute: 1,
            },
            events: {
                onReady:       e => this.onPlayerReady(e),
                onStateChange: e => this.onPlayerStateChange(e),
            },
        });

        this.state.playerInitialized = true;
    },

    // ── Player callbacks ──────────────────────────────────────────────────────

    onPlayerReady(event) {
        this.state.playerReady = true;

        // Cue (buffer) the video silently. Do NOT play yet.
        // startSession() will play + unmute when the cycle window opens.
        event.target.cueVideoById(this.getCurrentSession()?.videoId);

        // Regular users cannot enter mid-session — only admins can.
        // If an admin enters while a session is running, seek to the correct
        // offset so they're synchronized with all other participants.
        if (this.state.isInSession && window.Core.state?.currentUser?.is_admin) {
            this._startAtCycleOffset(event.target);
        }

        this.onPlayerReadyCustom?.(event);
    },

    /**
     * Seeks the player to the correct position within an already-running session,
     * then unmutes and plays. Admin-only path.
     */
    _startAtCycleOffset(player) {
        const cycleMs    = this.config.cycleDuration * 1000;
        const openMs     = this.config.openDuration  * 1000;
        const now        = Date.now();
        const timeIntoCycle = (now - this.state.cycleStartTime) % cycleMs;
        const sessionElapsed = Math.max(0, (timeIntoCycle - openMs) / 1000); // seconds into session

        player.seekTo(sessionElapsed, true);
        player.unMute();
        player.setVolume(100);
        player.playVideo();
        this.state.sessionStarted = true;
        this._showPlayer();

        const session = this.getCurrentSession();
        if (session) window.Core.showToast(`${session.emoji} Joining session in progress…`);
    },

    onPlayerStateChange(event) {
        if      (event.data === _YT.PLAYING) this.onVideoPlaying();
        else if (event.data === _YT.ENDED)   this.onVideoEnded();
    },

    // ── Playback events ───────────────────────────────────────────────────────

    onVideoPlaying() {
        this._showPlayer();
        this.startProgressTracking();
    },

    onVideoEnded() {
        this.stopProgressTracking();
        window.Core.showToast('Session complete');
    },

    // ── Session / playback control ────────────────────────────────────────────

    /**
     * Called by CycleStateMixin when the open window closes and session begins.
     * Player is already buffered — playback starts instantly.
     */
    startSession() {
        if (!this.state.playerReady || this.state.sessionStarted) return;
        const session = this.getCurrentSession();
        if (!session) return;

        this._showPlayer();
        this.state.player?.unMute();
        this.state.player?.setVolume(100);
        this.state.player?.playVideo();
        this.state.sessionStarted = true;
        window.Core.showToast(`${session.emoji} Session starting…`);
    },

    togglePlayPause() {
        if (!this.state.player) return;
        const isPlaying = this.state.player.getPlayerState() === _YT.PLAYING;
        isPlaying ? this.state.player.pauseVideo() : this.state.player.playVideo();

        const btn = document.getElementById(`${this.roomId}PlayBtn`);
        if (btn) btn.innerHTML = `<span style="font-size:24px;">${isPlaying ? '▶' : '⏸'}</span>`;
    },

    _seek(delta) {
        if (!this.state.player) return;
        this.state.player.seekTo(Math.max(0, this.state.player.getCurrentTime() + delta));
    },

    skipBackward() { this._seek(-10); },
    skipForward()  { this._seek(+10); },

    // ── Progress tracking ─────────────────────────────────────────────────────

    startProgressTracking() {
        if (this._progressInterval) return;
        this._progressInterval = setInterval(() => this.updateTimeDisplay(), 1000);
    },

    stopProgressTracking() {
        if (this._progressInterval) {
            clearInterval(this._progressInterval);
            this._progressInterval = null;
        }
    },

    updateTimeDisplay() {
        if (!this.state.player?.getCurrentTime) return;
        const el = document.getElementById(`${this.roomId}TimeDisplay`);
        if (el) {
            const cur = Math.floor(this.state.player.getCurrentTime());
            const dur = Math.floor(this.state.player.getDuration());
            el.textContent = `${this.formatTime(cur)} / ${this.formatTime(dur)}`;
        }
    },

    // ── Private helpers ───────────────────────────────────────────────────────

    _showPlayer() {
        const overlay = document.getElementById(`${this.roomId}PlayerOverlay`);
        if (overlay) overlay.style.display = 'none';

        const controls = document.getElementById(`${this.roomId}Controls`);
        if (controls) controls.style.display = 'flex';
    },

    // ── HTML builders ─────────────────────────────────────────────────────────

    buildPlayerContainer() {
        const s = this.getCurrentSession();
        return `
        <div class="guided-player-container" role="region" aria-label="Video player">
            <div id="${this.roomId}-youtube-player"></div>
            <div class="player-overlay" id="${this.roomId}PlayerOverlay">
                <div class="session-info" aria-live="polite">
                    <div class="session-emoji"    id="${this.roomId}SessionEmoji"   >${s?.emoji    || '🎧'}</div>
                    <div class="session-title"    id="${this.roomId}SessionTitle"   >${s?.title    || 'Loading...'}</div>
                    <div class="session-duration" id="${this.roomId}SessionDuration">${s?.duration || '00:00'}</div>
                    <div class="session-starts"   id="${this.roomId}SessionStatus"  >Waiting to start…</div>
                </div>
            </div>
        </div>`;
    },

    buildPlayerControls() {
        return `
        <div class="guided-controls" id="${this.roomId}Controls" style="display:none;">
            <div class="control-buttons">
                <button type="button" class="control-btn" aria-label="Skip backward 10 seconds" data-action="skipBackward"><span style="font-size:20px;">⏪</span></button>
                <button type="button" class="control-btn primary" aria-label="Play or pause" data-action="togglePlayPause" id="${this.roomId}PlayBtn"><span style="font-size:24px;">⏸</span></button>
                <button type="button" class="control-btn" aria-label="Skip forward 10 seconds" data-action="skipForward"><span style="font-size:20px;">⏩</span></button>
            </div>
            <div class="time-display" id="${this.roomId}TimeDisplay">0:00 / 0:00</div>
        </div>`;
    },

    // ── Cleanup ───────────────────────────────────────────────────────────────

    cleanupPlayer() {
        this.stopProgressTracking();
        this.state.player?.destroy();
        this.state.player            = null;
        this.state.playerReady       = false;
        this.state.playerInitialized = false;
        this.state.sessionStarted    = false;
    },
};

export { YouTubePlayerMixin };
