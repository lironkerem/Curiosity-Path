/**
 * TIMER MIXIN
 * Countdown timer with visual ring for practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, TimerMixin);
 */


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
        // Visibility fix: track when tab was hidden so we can reconcile elapsed time on resume.
        this._timerHiddenAt     = null;
        this._timerVisibilityHandler = null;
    },

    // ── Controls ──────────────────────────────────────────────────────────────

    toggleTimer() {
        this.state.timerRunning ? this.pauseTimer() : this.startTimer();
    },

    startTimer() {
        if (this.state.timerRunning) return;
        this.state.timerRunning  = true;
        this._timerTickStart     = Date.now(); // wall-clock anchor for reconciliation
        this._setTimerBtn('running');
        this._setTimerGlow('running');

        this._timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this._updateTimer();

            if (this.state.timeLeft > 0 && this.state.timeLeft % 300 === 0) {
                if (this.state.fiveMinBellEnabled) this.play5MinBell?.();
            }

            if (this.state.timeLeft <= 0) this.completeTimer();
        }, 1000);

        // Visibility fix: suspend interval while tab is hidden, reconcile on return.
        this._attachVisibilityHandler();

        window.Core.showToast('Timer started');
    },

    pauseTimer() {
        this._clearInterval();
        this._detachVisibilityHandler();
        this.state.timerRunning = false;
        this._setTimerBtn('paused');
        this._setTimerGlow('paused');
    },

    completeTimer() {
        this._clearInterval();
        this._detachVisibilityHandler();
        this.state.timerRunning = false;
        this.state.timeLeft     = 0;
        this._setTimerBtn('done');
        this._updateTimer();
        this._setTimerGlow('idle');
        this.playCompletionSound?.();
        window.Core.showToast('Session complete!');
        this.onTimerComplete?.();
    },

    resetTimer() {
        this._clearInterval();
        this._detachVisibilityHandler();
        this.state.timerRunning = false;
        this.state.timeLeft     = this.state.initialTime;
        this._setTimerBtn('idle');
        this._updateTimer();
        this._setTimerGlow('idle');
    },

    adjustTime(minutes) {
        if (this.state.timerRunning) return;
        this.state.timeLeft    = Math.min(_TIMER_MAX_SEC, Math.max(_TIMER_MIN_SEC, this.state.timeLeft + minutes * 60));
        this.state.initialTime = this.state.timeLeft;
        this._updateTimer();
    },

    cleanupTimer() {
        this._clearInterval();
        this._detachVisibilityHandler();
        this.state.timerRunning = false;
    },

    // ── Visibility helpers ────────────────────────────────────────────────────

    /**
     * Suspend the setInterval while the tab is hidden and reconcile elapsed
     * time when it becomes visible again. This prevents:
     * - Waking the JS thread every second while the PWA is backgrounded
     * - A burst of rapid ticks / battery drain on mobile
     * - The timer drifting out of sync with wall-clock time
     */
    _attachVisibilityHandler() {
        if (this._timerVisibilityHandler) return; // already attached

        this._timerVisibilityHandler = () => {
            if (document.hidden) {
                // Tab hidden: stop the interval, record when we paused
                this._timerHiddenAt = Date.now();
                this._clearInterval();
            } else {
                // Tab visible again: reconcile elapsed seconds
                if (this._timerHiddenAt !== null) {
                    const elapsedSec = Math.round((Date.now() - this._timerHiddenAt) / 1000);
                    this._timerHiddenAt = null;
                    this.state.timeLeft = Math.max(0, this.state.timeLeft - elapsedSec);
                    this._updateTimer();

                    if (this.state.timeLeft <= 0) {
                        this.completeTimer();
                        return;
                    }
                }

                // Restart the interval only if the timer was running when hidden
                if (this.state.timerRunning && !this._timerInterval) {
                    this._timerInterval = setInterval(() => {
                        this.state.timeLeft--;
                        this._updateTimer();
                        if (this.state.timeLeft > 0 && this.state.timeLeft % 300 === 0) {
                            if (this.state.fiveMinBellEnabled) this.play5MinBell?.();
                        }
                        if (this.state.timeLeft <= 0) this.completeTimer();
                    }, 1000);
                }
            }
        };

        document.addEventListener('visibilitychange', this._timerVisibilityHandler);
    },

    _detachVisibilityHandler() {
        if (this._timerVisibilityHandler) {
            document.removeEventListener('visibilitychange', this._timerVisibilityHandler);
            this._timerVisibilityHandler = null;
        }
        this._timerHiddenAt = null;
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
        this._glowColor = glowColor; // stored for use in _setTimerGlow
        const C = _TIMER_CIRCUMFERENCE;

        // Inner comet ring — almost touching outer (outer r=180, stroke=14 → inner edge at ~173)
        const _INNER_R  = 163;
        const _INNER_C  = +(2 * Math.PI * _INNER_R).toFixed(2);
        // Comet head: ~35° arc; trail: ~120° arc
        const HEAD_LEN  = +(_INNER_C * 35  / 360).toFixed(2);
        const TRAIL_LEN = +(_INNER_C * 120 / 360).toFixed(2);
        const GAP       = +(_INNER_C - HEAD_LEN).toFixed(2);
        const TRAIL_GAP = +(_INNER_C - TRAIL_LEN).toFixed(2);

        const subtitleEl = subtitleHtml
            ?? `<div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${subtitle}</div>`;

        return `
        <style>
            /* Outer ring glow pulse while running */
            @keyframes timerGlow_${this.roomId} {
                0%,100% { filter: drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 0 18px ${glowColor}) drop-shadow(0 0 35px ${glowColor}); }
                50%      { filter: drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 35px ${glowColor}) drop-shadow(0 0 70px ${glowColor}); }
            }
            #${this.roomId}OuterSvg {
                filter: none;
                transition: filter 1.5s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}OuterSvg {
                animation: timerGlow_${this.roomId} 3s ease-in-out infinite;
                transition: none;
            }

            /* Comet head races clockwise: dashoffset 0 → -C in 1s */
            @keyframes cometHead_${this.roomId} {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -${_INNER_C}; }
            }
            /* Trail follows, slightly delayed */
            @keyframes cometTrail_${this.roomId} {
                from { stroke-dashoffset: ${HEAD_LEN}; }
                to   { stroke-dashoffset: ${HEAD_LEN - _INNER_C}; }
            }

            #${this.roomId}CometHead {
                stroke-dasharray:  ${HEAD_LEN} ${GAP};
                stroke-dashoffset: 0;
                animation: cometHead_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}CometTrail {
                stroke-dasharray:  ${TRAIL_LEN} ${TRAIL_GAP};
                stroke-dashoffset: ${HEAD_LEN};
                animation: cometTrail_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometHead,
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometTrail {
                animation-play-state: running;
            }
            /* Comet: hidden until timer starts, freezes on pause, hides on reset */
            #${this.roomId}CometSvg {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometSvg {
                opacity: 1;
            }
            #${this.roomId}TimerRingWrap.paused #${this.roomId}CometSvg {
                opacity: 1; /* visible but animation is paused = frozen */
            }
            #${this.roomId}TimerDisplay {
                font-variant-numeric: tabular-nums;
            }
            @media (prefers-reduced-motion: reduce) {
                #${this.roomId}CometHead,
                #${this.roomId}CometTrail {
                    animation: none !important;
                }
                #${this.roomId}OuterSvg {
                    animation: none !important;
                }
            }
        </style>

        <div id="${this.roomId}TimerRingWrap"
             aria-hidden="true"
             style="position:relative;width:min(380px,82vw);height:min(380px,82vw);margin-bottom:36px;">

            <!-- Outer progress ring (clockwise countdown) -->
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
                <!-- Progress -->
                <circle cx="200" cy="200" r="${_TIMER_RADIUS}"
                        fill="none" stroke="url(#${gradientId})"
                        stroke-width="14" stroke-linecap="round"
                        stroke-dasharray="${C}" stroke-dashoffset="0"
                        id="${this.roomId}TimerRing"/>
            </svg>

            <!-- Inner dark track (always visible) -->
            <svg width="100%" height="100%" viewBox="0 0 400 400"
                 style="position:absolute;top:0;left:0;z-index:3;">
                <circle cx="200" cy="200" r="${_INNER_R}"
                        fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="6"/>
            </svg>

            <!-- Inner comet ring (hidden until Start) -->
            <svg id="${this.roomId}CometSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:4;">
                <!-- Fading trail (neon blue, low opacity) -->
                <circle cx="200" cy="200" r="${_INNER_R}"
                        fill="none" stroke="#00cfff"
                        stroke-width="5" stroke-linecap="round"
                        opacity="0.25"
                        id="${this.roomId}CometTrail"/>
                <!-- Comet head (bright neon blue, glowing) -->
                <circle cx="200" cy="200" r="${_INNER_R}"
                        fill="none"
                        stroke="#00eeff"
                        stroke-width="6" stroke-linecap="round"
                        style="filter:drop-shadow(0 0 4px #00eeff) drop-shadow(0 0 10px #00cfff);"
                        id="${this.roomId}CometHead"/>
            </svg>

            <!-- Text content -->
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:5;width:65%;">
                <div id="${this.roomId}TimerDisplay"
                     role="timer" aria-live="off" aria-label="Timer"
                     style="font-size:clamp(2.8rem,12vw,5rem);font-weight:200;letter-spacing:0.04em;line-height:1;margin-bottom:10px;">
                    ${this.formatTime(this.state.timeLeft)}
                </div>
                ${subtitleEl}
            </div>
        </div>`;
    },

    buildTimerControls() {
        return `
        <div class="timer-controls" role="group" aria-label="Timer controls">
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="-5" aria-label="Subtract 5 minutes">−5m</button>
            <button type="button" class="t-btn primary" data-action="toggleTimer" id="${this.roomId}TimerBtn" aria-live="polite">${_BTN_LABEL.idle}</button>
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="5" aria-label="Add 5 minutes">+5m</button>
        </div>`;
    },

    /** Smoothly fade glow in/out. state: 'running' | 'paused' | 'idle' */
    _setTimerGlow(state) {
        const wrap = document.getElementById(`${this.roomId}TimerRingWrap`);
        const svg  = document.getElementById(`${this.roomId}OuterSvg`);
        if (!wrap || !svg) return;

        clearTimeout(this._glowTransitionTimer);
        wrap.classList.remove('running', 'paused');

        // Comet reacts immediately — set class right away
        if (state === 'running') wrap.classList.add('running');
        if (state === 'paused')  wrap.classList.add('paused');

        if (state === 'running') {
            // Glow: fade in via transition, then hand off to CSS pulse animation
            svg.style.animation  = '';
            svg.style.transition = 'filter 1.2s ease';
            svg.style.filter     = `drop-shadow(0 0 12px ${this._glowColor}) drop-shadow(0 0 35px ${this._glowColor}) drop-shadow(0 0 70px ${this._glowColor})`;
            this._glowTransitionTimer = setTimeout(() => {
                wrap.classList.add('running'); // ensure still running
                requestAnimationFrame(() => {
                    svg.style.transition = '';
                    svg.style.filter     = '';
                });
            }, 1200);
        } else {
            // Glow: fade out
            svg.style.animation  = 'none';
            svg.style.transition = 'filter 1.2s ease';
            svg.style.filter     = 'none';
        }
    },
};

export { TimerMixin };
