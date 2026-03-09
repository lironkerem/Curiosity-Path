/**
 * TIMER MIXIN
 * Countdown timer with visual ring for practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, TimerMixin);
 */

import { Core } from '../../core.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const _TIMER_RADIUS        = 180;
const _TIMER_CIRCUMFERENCE = +(2 * Math.PI * _TIMER_RADIUS).toFixed(2); // 1130.97
const _TIMER_MIN_SEC       = 60;
const _TIMER_MAX_SEC       = 7200; // 120 min

const _BTN_LABEL = { idle: 'Begin', running: 'Pause', paused: 'Continue', done: 'Complete' };

// ─────────────────────────────────────────────────────────────────────────────

const TimerMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initTimerState(defaultTime = 1200) {
        this.state.timerRunning = false;
        this.state.timeLeft     = defaultTime;
        this.state.initialTime  = defaultTime;
        this._timerInterval     = null;
    },

    // ── Controls ──────────────────────────────────────────────────────────────

    toggleTimer() {
        this.state.timerRunning ? this.pauseTimer() : this.startTimer();
    },

    startTimer() {
        if (this.state.timerRunning) return;
        this.state.timerRunning = true;
        this._setTimerBtn('running');

        this._timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this._updateTimer();

            if (this.state.timeLeft > 0 && this.state.timeLeft % 300 === 0) {
                if (this.state.fiveMinBellEnabled) this.play5MinBell?.();
            }

            if (this.state.timeLeft <= 0) this.completeTimer();
        }, 1000);

        Core.showToast('Timer started');
    },

    pauseTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this._setTimerBtn('paused');
        Core.showToast('Timer paused');
    },

    completeTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this.state.timeLeft     = 0;
        this._setTimerBtn('done');
        this._updateTimer();
        this.playCompletionSound?.();
        Core.showToast('Session complete!');
        this.onTimerComplete?.();
    },

    resetTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this.state.timeLeft     = this.state.initialTime;
        this._setTimerBtn('idle');
        this._updateTimer();
    },

    adjustTime(minutes) {
        if (this.state.timerRunning) return;
        this.state.timeLeft    = Math.min(_TIMER_MAX_SEC, Math.max(_TIMER_MIN_SEC, this.state.timeLeft + minutes * 60));
        this.state.initialTime = this.state.timeLeft;
        this._updateTimer();
    },

    cleanupTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
    },

    // ── Private helpers ───────────────────────────────────────────────────────

    _clearInterval() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    },

    _setTimerBtn(state) {
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = _BTN_LABEL[state];
    },

    _updateTimer() {
        const display = document.getElementById(`${this.roomId}TimerDisplay`);
        if (display) display.textContent = this.formatTime(this.state.timeLeft);

        const ring = document.getElementById(`${this.roomId}TimerRing`);
        if (ring) {
            const progress = this.state.timeLeft / this.state.initialTime;
            ring.style.strokeDashoffset = _TIMER_CIRCUMFERENCE * (1 - progress);
        }
    },

    updateTimerDisplay() { this._updateTimer(); },
    updateTimerRing()    { this._updateTimer(); },

    // ── HTML builders ─────────────────────────────────────────────────────────

    buildTimerContainer() {
        const C = _TIMER_CIRCUMFERENCE;
        return `
        <div style="position:relative;width:min(400px,85vw);height:min(400px,85vw);margin-bottom:40px;">
            <svg width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:2;">
                <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stop-color="#a78bfa"/>
                        <stop offset="100%" stop-color="#c084fc"/>
                    </linearGradient>
                </defs>
                <circle cx="200" cy="200" r="${_TIMER_RADIUS}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                <circle cx="200" cy="200" r="${_TIMER_RADIUS}" fill="none" stroke="url(#timerGradient)"
                        stroke-width="8" stroke-linecap="round"
                        stroke-dasharray="${C}" stroke-dashoffset="0"
                        id="${this.roomId}TimerRing"/>
            </svg>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:3;">
                <div id="${this.roomId}TimerDisplay"
                     style="font-size:clamp(2.5rem,14vw,5.25rem);font-weight:200;letter-spacing:0.05em;margin-bottom:8px;">
                    ${this.formatTime(this.state.timeLeft)}
                </div>
                <div style="font-size:16px;text-transform:uppercase;letter-spacing:0.2em;opacity:0.6;">in silence</div>
            </div>
        </div>`;
    },

    buildTimerControls() {
        const cn = this.getClassName();
        return `
        <div class="timer-controls">
            <button class="t-btn" onclick="${cn}.adjustTime(-5)">-5m</button>
            <button class="t-btn primary" onclick="${cn}.toggleTimer()" id="${this.roomId}TimerBtn">${_BTN_LABEL.idle}</button>
            <button class="t-btn" onclick="${cn}.adjustTime(5)">+5m</button>
        </div>`;
    },
};

export { TimerMixin };
