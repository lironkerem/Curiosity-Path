/**OSHO ACTIVE MEDITATION ROOM - @extends TimedVideoRoom */

import { TimedVideoRoom } from './mixins/TimedVideoRoom.js';

class OshoRoom extends TimedVideoRoom {
    constructor() {
        super({
            roomId:          'osho',
            roomType:        'timed',
            name:            'OSHO Active',
            icon:            '💃',
            description:     'OSHO Active Meditations practices (with instructions). View Schedule for details.',
            energy:          'Dynamic',
            imageUrl:        '/Community/OSHO.webp',
            participants:    0,
            cycleDuration:   90 * 60,
            openDuration:    10 * 60,
            sessionDuration: 80 * 60,
        });

        this.scheduleModalTitle = '📅 Upcoming OSHO Sessions';

        this.sessions = [
            { title: 'OSHO Dynamic Meditation',    duration: '77:00', category: 'Energy',   introVideoId: 'Q_PFlkHH7IA', videoId: 'tLUxtq3peR8', emoji: '🔥' },
            { title: 'OSHO Kundalini Meditation',  duration: '77:00', category: 'Movement', introVideoId: 'O3-wH2VBdN8', videoId: 'vEyageQp6w8', emoji: '💃' },
            { title: 'OSHO Nadabrahma Meditation', duration: '77:00', category: 'Humming',  introVideoId: 'tnVsMXf88Pw', videoId: 'yVGhzBVT64A', emoji: '🕉️' },
            { title: 'OSHO Nataraj Meditation',    duration: '77:00', category: 'Dance',    introVideoId: 'pxg3FmOeQhk', videoId: 'grSjP12Q4Oc', emoji: '🎭' },
            { title: 'OSHO Whirling Meditation',   duration: '77:00', category: 'Spinning', introVideoId: 'Jk2AaABIKTY', videoId: 'EKvLFs9niXY', emoji: '🌀' },
        ];
    }

    // ── Dual-video: play intro first, then auto-advance to practice ───────────

    onEnter() {
        this._playingIntro = false;
        super.onEnter();
    }

    // Override initPlayer to load the introVideoId first
    initPlayer() {
        if (this.state.playerInitialized) return;

        const session = this.getCurrentSession();
        if (!session?.introVideoId) {
            super.initPlayer();
            return;
        }

        this._playingIntro = true;

        this.state.player = new YT.Player(`${this.roomId}-youtube-player`, {
            videoId: session.introVideoId,
            playerVars: {
                // FIX #2 — No autoplay:1. Intro plays via startSession() or
                // _startAtCycleOffset() when the session window opens.
                autoplay: 0, controls: 1, modestbranding: 1, rel: 0, mute: 1,
            },
            events: {
                onReady:       e => this.onPlayerReady(e),
                onStateChange: e => this.onPlayerStateChange(e),
            },
        });

        this.state.playerInitialized = true;
    }

    // startSession is called by CycleStateMixin when the open window closes.
    // For OSHO we play the intro video first (already cued), then the practice.
    startSession() {
        if (!this.state.playerReady || this.state.sessionStarted) return;
        const session = this.getCurrentSession();
        if (!session) return;

        this._playingIntro = true;
        this._showPlayer();
        this.state.player?.unMute();
        this.state.player?.setVolume(100);
        this.state.player?.playVideo();
        this.state.sessionStarted = true;
        window.Core.showToast(`${session.emoji} Intro starting…`);
    }

    // When intro ends, auto-load the practice video
    onVideoEnded() {
        if (this._playingIntro) {
            this._playingIntro = false;
            const session = this.getCurrentSession();
            if (session?.videoId && this.state.player) {
                this.state.player.loadVideoById(session.videoId);
                this.state.player.playVideo();
                window.Core.showToast(`${session.emoji} Practice starting…`);
            }
        } else {
            this.stopProgressTracking();
            window.Core.showToast('Session complete');
        }
    }

    getInstructions() {
        return `
            <p><strong>Active OSHO meditation techniques every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>Each session begins with guided instructions, then the full practice</li>
                <li>5 OSHO methods rotating each cycle</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Enter during the open window</li>
                <li>Express freely - move, breathe, sound</li>
                <li>Allow whatever arises</li>
            </ul>
            <h3>The 5 Methods:</h3>
            <ul>
                <li>🔥 Dynamic - Cathartic active meditation</li>
                <li>💃 Kundalini - Shaking and dancing</li>
                <li>🕉️ Nadabrahma - Humming meditation</li>
                <li>🎭 Nataraj - Dance meditation</li>
                <li>🌀 Whirling - Sufi spinning meditation</li>
            </ul>`;
    }
}

// Window bridge: preserved for inline onclick handlers
const oshoRoom = new OshoRoom();
window.OshoRoom = oshoRoom;
// Fix #7: signal CommunityHubEngine that this room's enterRoom function is ready.
window.dispatchRoomReady?.('osho');

export { OshoRoom, oshoRoom };
