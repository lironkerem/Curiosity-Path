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
        this._setTimerGlow(true);

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
        this._setTimerGlow(false);
        Core.showToast('Timer paused');
    },

    completeTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this.state.timeLeft     = 0;
        this._setTimerBtn('done');
        this._updateTimer();
        this._setTimerGlow(false);
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
        this._setTimerGlow(false);
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

    /**
     * Build the timer ring container.
     * @param {string} subtitle      - Text shown below the time display (e.g. 'in silence' or dynamic status id)
     * @param {string} gradientId    - Unique SVG gradient id (avoid collisions between rooms)
     * @param {string} color1        - Gradient start color
     * @param {string} color2        - Gradient end color
     * @param {string} glowColor     - CSS color for the running glow (rgba recommended)
     * @param {string} subtitleHtml  - Raw HTML for subtitle (overrides subtitle string if provided)
     */
    buildTimerContainer({
        subtitle     = 'in practice',
        gradientId   = `timerGrad_${this.roomId}`,
        color1       = '#a78bfa',
        color2       = '#c084fc',
        glowColor    = 'rgba(167,139,250,0.35)',
        subtitleHtml = null,
    } = {}) {
        const C              = _TIMER_CIRCUMFERENCE;
        // Inner seconds ring: smaller radius
        const _INNER_R       = 148;
        const _INNER_C       = +(2 * Math.PI * _INNER_R).toFixed(2);
        const innerGradId    = `${gradientId}_inner`;
        const subtitleEl     = subtitleHtml
            ?? `<div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${subtitle}</div>`;

        return `
        <style>
            /* Outer ring: pulsing glow when running */
            @keyframes timerGlow_${this.roomId} {
                0%,100% { filter: drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 20px ${glowColor}); }
                50%      { filter: drop-shadow(0 0 18px ${glowColor}) drop-shadow(0 0 44px ${glowColor}); }
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}OuterSvg {
                animation: timerGlow_${this.roomId} 3s ease-in-out infinite;
            }
            /* Inner seconds ring: sweep 0→full in 1s, CSS-driven */
            @keyframes secondsSweep_${this.roomId} {
                0%   { stroke-dashoffset: ${_INNER_C}; }
                100% { stroke-dashoffset: 0; }
            }
            #${this.roomId}SecondsRing {
                stroke-dasharray: ${_INNER_C};
                stroke-dashoffset: ${_INNER_C};
                animation: secondsSweep_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}SecondsRing {
                animation-play-state: running;
            }
            #${this.roomId}TimerDisplay {
                font-variant-numeric: tabular-nums;
            }
        </style>

        <div id="${this.roomId}TimerRingWrap"
             style="position:relative;width:min(380px,82vw);height:min(380px,82vw);margin-bottom:36px;">

            <!-- Outer progress ring (clockwise shrink) -->
            <svg id="${this.roomId}OuterSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:2;">
                <defs>
                    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stop-color="${color1}"/>
                        <stop offset="100%" stop-color="${color2}"/>
                    </linearGradient>
                </defs>
                <!-- Track -->
                <circle cx="200" cy="200" r="${_TIMER_RADIUS}"
                        fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="14"/>
                <!-- Progress — clockwise: starts full, offset grows as time runs out -->
                <circle cx="200" cy="200" r="${_TIMER_RADIUS}"
                        fill="none" stroke="url(#${gradientId})"
                        stroke-width="14" stroke-linecap="round"
                        stroke-dasharray="${C}" stroke-dashoffset="0"
                        id="${this.roomId}TimerRing"/>
            </svg>

            <!-- Inner seconds ring (CSS sweep, clockwise, 1s per revolution) -->
            <svg width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:3;">
                <defs>
                    <linearGradient id="${innerGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stop-color="${color1}" stop-opacity="0.5"/>
                        <stop offset="100%" stop-color="${color2}" stop-opacity="0.9"/>
                    </linearGradient>
                </defs>
                <!-- Inner track (dark) -->
                <circle cx="200" cy="200" r="${_INNER_R}"
                        fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="8"/>
                <!-- Seconds sweep -->
                <circle cx="200" cy="200" r="${_INNER_R}"
                        fill="none" stroke="url(#${innerGradId})"
                        stroke-width="8" stroke-linecap="round"
                        id="${this.roomId}SecondsRing"/>
            </svg>

            <!-- Text content -->
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:4;width:65%;">
                <div id="${this.roomId}TimerDisplay"
                     style="font-size:clamp(2.8rem,12vw,5rem);font-weight:200;letter-spacing:0.04em;line-height:1;margin-bottom:10px;">
                    ${this.formatTime(this.state.timeLeft)}
                </div>
                ${subtitleEl}
            </div>
        </div>`;
    },

    buildTimerControls() {
        const cn = this.getClassName();
        return `
        <div class="timer-controls">
            <button class="t-btn" onclick="${cn}.adjustTime(-5)">−5m</button>
            <button class="t-btn primary" onclick="${cn}.toggleTimer()" id="${this.roomId}TimerBtn">${_BTN_LABEL.idle}</button>
            <button class="t-btn" onclick="${cn}.adjustTime(5)">+5m</button>
        </div>`;
    },

    /** Toggle glow animation on the ring wrap when timer starts/stops. */
    _setTimerGlow(running) {
        document.getElementById(`${this.roomId}TimerRingWrap`)
            ?.classList.toggle('running', running);
    },
};

export { TimerMixin };
