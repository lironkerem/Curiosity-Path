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

import { Core } from '../../core.js';

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

    loadYouTubeAPI() {
        if (window.YT?.Player) {
            this.initPlayer();
            return;
        }

        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
        }

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
            videoId:    session.videoId,
            playerVars: { autoplay: 1, controls: 1, modestbranding: 1, rel: 0, mute: 1 },
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

        if (this.state.isInSession || this.devMode) {
            event.target.playVideo();
            setTimeout(() => {
                event.target.unMute();
                event.target.setVolume(100);
            }, 500);
            this.state.sessionStarted = true;
        }

        this.onPlayerReadyCustom?.(event);
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
        Core.showToast('Session complete 🙏');
    },

    // ── Session / playback control ────────────────────────────────────────────

    startSession() {
        if (!this.state.playerReady || this.state.sessionStarted) return;
        const session = this.getCurrentSession();
        if (!session) return;

        this._showPlayer();
        this.state.player?.playVideo();
        this.state.sessionStarted = true;
        Core.showToast(`${session.emoji} Session starting…`);
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
        <div class="guided-player-container">
            <div id="${this.roomId}-youtube-player"></div>
            <div class="player-overlay" id="${this.roomId}PlayerOverlay">
                <div class="session-info">
                    <div class="session-emoji"    id="${this.roomId}SessionEmoji"   >${s?.emoji    || '🎧'}</div>
                    <div class="session-title"    id="${this.roomId}SessionTitle"   >${s?.title    || 'Loading...'}</div>
                    <div class="session-duration" id="${this.roomId}SessionDuration">${s?.duration || '00:00'}</div>
                    <div class="session-starts"   id="${this.roomId}SessionStatus"  >Waiting to start…</div>
                </div>
            </div>
        </div>`;
    },

    buildPlayerControls() {
        const cn = this.getClassName();
        return `
        <div class="guided-controls" id="${this.roomId}Controls" style="display:none;">
            <div class="control-buttons">
                <button class="control-btn"         onclick="${cn}.skipBackward()"><span style="font-size:20px;">⏪</span></button>
                <button class="control-btn primary"  onclick="${cn}.togglePlayPause()" id="${this.roomId}PlayBtn"><span style="font-size:24px;">⏸</span></button>
                <button class="control-btn"         onclick="${cn}.skipForward()"><span style="font-size:20px;">⏩</span></button>
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
