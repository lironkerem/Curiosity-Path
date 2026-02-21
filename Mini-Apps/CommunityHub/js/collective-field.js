/**
 * COLLECTIVE FIELD MODULE
 *
 * Renders the Collective Field section featuring:
 * - Collective Energy Field with real-time presence count
 * - 24-Hour Calm Wave progress tracker
 * - Pulse/Send Calm functionality (hold gesture)
 * - Animated SVG visualizations
 *
 * @version 2.0.0
 */

const CollectiveField = {
    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        isRendered: false,

        // Send Calm
        calmsSentCount: 0,        // total sends this session (drives diminishing effect)
        lastCalmSentAt: null,     // timestamp — enforces 30s cooldown
        isHolding: false,         // true while user is pressing and holding
        holdProgress: 0,          // 0–100, drives the charging ring animation
        holdInterval: null,       // interval ref for hold progress ticker
        HOLD_DURATION_MS: 3000,   // how long to hold before pulse fires
        COOLDOWN_MS: 30000,       // 30s between sends

        // Energy Bar
        energyLevel: 42,          // current energy % (0–100)
        energyDrainInterval: null,// interval ref for drain ticker
        DRAIN_INACTIVITY_MS: 60 * 60 * 1000,  // 1 hour of no sends before drain starts
        DRAIN_RATE_MS: 10 * 60 * 1000,        // lose 1% every 10 minutes of inactivity
        ENERGY_PER_PULSE: 5,      // % added per Send Calm

        // Contribute Wave
        isContributing: false,    // true while session is active
        contributeStartedAt: null,// timestamp of session start
        timerInterval: null,      // interval ref for count-up display
        countedAsParticipant: false, // true once 5min mark passed

        // Wave collective totals (will come from Supabase later)
        waveTotalMinutes: 967,    // total minutes contributed by all users today (~67%)
        WAVE_GOAL_MINUTES: 1440,  // 24 hours = 1440 minutes
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    config: {
        DEFAULT_PRESENCE_COUNT: 127,
        DEFAULT_WAVE_PARTICIPANTS: 48,
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================

    /**
     * Generate HTML for collective field section
     */
    getHTML() {
        return `
        <div class="section-header">
            <div class="section-title">Collective Field</div>
            <div style="font-size: 12px; color: var(--text-muted);">Real-time resonance</div>
        </div>

        <div class="collective-grid">
            ${this.getEnergyFieldHTML()}
            ${this.getCalmWaveHTML()}
        </div>
        `;
    },

    /**
     * Generate Collective Energy Field card HTML
     */
    getEnergyFieldHTML() {
        const presenceCount = window.Core?.state?.presenceCount || this.config.DEFAULT_PRESENCE_COUNT;
        const energyLevel = this.state.energyLevel;

        return `
            <!-- Collective Energy Field -->
            <div class="collective-card energy-card">
                <div class="collective-icon">
                    ${this.getEnergyFieldSVG()}
                </div>

                <div class="collective-title">Energy Field</div>

                <div class="collective-count">
                    <span class="count-number" id="presenceCount">${presenceCount}</span>
                    <span class="count-label">Present Now</span>
                </div>

                <div class="breath-indicator">
                    <span class="breath-dot" aria-hidden="true"></span>
                    <span>Collective breath</span>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill"
                                 id="pulseFill"
                                 style="width: ${energyLevel}%"
                                 role="progressbar"
                                 aria-valuenow="${energyLevel}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <span class="progress-label">Energy Level</span>
                        <span class="progress-value" id="energyValue">${energyLevel}%</span>
                    </div>
                </div>

                <button class="collective-action-btn"
                        id="pulseBtn"
                        onmousedown="CollectiveField.handleHoldStart()"
                        ontouchstart="CollectiveField.handleHoldStart()"
                        onmouseup="CollectiveField.handleHoldEnd()"
                        ontouchend="CollectiveField.handleHoldEnd()"
                        onmouseleave="CollectiveField.handleHoldCancel()"
                        aria-label="Hold to send calm energy to the collective field">
                    <svg class="hold-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                        <circle id="holdRing" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-dasharray="100.5" stroke-dashoffset="100.5"
                            stroke-linecap="round"
                            transform="rotate(-90 18 18)"/>
                    </svg>
                    <span id="pulseBtnLabel">Hold to Send</span>
                </button>
            </div>
        `;
    },

    /**
     * Generate 24-Hour Calm Wave card HTML
     */
    getCalmWaveHTML() {
        const participants = this.config.DEFAULT_WAVE_PARTICIPANTS;
        const totalMinutes = this.state.waveTotalMinutes;
        const goalMinutes = this.state.WAVE_GOAL_MINUTES;
        const progress = Math.min(Math.round((totalMinutes / goalMinutes) * 100), 100);
        const remainingMinutes = Math.max(goalMinutes - totalMinutes, 0);
        const remainingHrs = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        const remainingLabel = remainingHrs > 0
            ? `${remainingHrs}h ${remainingMins}m to complete the wave`
            : `${remainingMins}m to complete the wave`;

        return `
            <!-- 24-Hour Calm Wave -->
            <div class="collective-card wave-card-new">
                <div class="collective-icon" style="position: relative;">
                    ${this.getCalmWaveSVG()}
                    <div id="waveRippleStage" style="position: absolute; inset: 0; pointer-events: none; overflow: hidden;"></div>
                </div>

                <div class="collective-title">24h Calm Wave</div>

                <div class="collective-count">
                    <span class="count-number" id="waveParticipants">${participants}</span>
                    <span class="count-label">Participants</span>
                </div>

                <div class="time-remaining" id="waveStatusLine">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" aria-hidden="true">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 1.5a.5.5 0 0 1 .5.5v4h3a.5.5 0 0 1 0 1h-3.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    <span id="waveStatusText">${remainingLabel}</span>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill"
                                 id="waveFill"
                                 style="width: ${progress}%"
                                 role="progressbar"
                                 aria-valuenow="${progress}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <span class="progress-label">Wave Building</span>
                        <span class="progress-value" id="waveProgressValue">${progress}%</span>
                    </div>
                </div>

                <button class="collective-action-btn"
                        id="waveBtn"
                        onclick="CollectiveField.handleContributeWave()"
                        aria-label="Contribute silence to the calm wave">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M12 6v12M6 12h12"/>
                    </svg>
                    <span id="waveBtnLabel">Start Silence</span>
                </button>
            </div>
        `;
    },

    /**
     * Generate Energy Field SVG visualization
     */
    getEnergyFieldSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                <circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="2" opacity="0.7"/>
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9">
                    <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
    },

    /**
     * Generate Calm Wave SVG visualization
     */
    getCalmWaveSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 50 Q 20 30, 30 50 T 50 50 T 70 50 T 90 50"
                      stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.4"/>
                <path d="M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50"
                      stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.6"/>
                <path d="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50"
                      stroke="currentColor" stroke-width="3" fill="none">
                    <animate attributeName="d"
                        values="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50"
                        dur="4s" repeatCount="indefinite"/>
                </path>
            </svg>
        `;
    },

    // ============================================================================
    // RENDERING
    // ============================================================================

    /**
     * Render collective field into container
     */
    render() {
        const container = document.getElementById('collectiveFieldContainer');
        if (!container) {
            console.warn('collectiveFieldContainer not found - skipping collective field render');
            return;
        }

        // Clean up any running timers before re-rendering
        this._cleanup();

        try {
            container.innerHTML = this.getHTML();
            this.state.isRendered = true;

            // Start the energy drain watchdog
            this._startEnergyDrainWatchdog();

            // If a wave session was in progress, resume the tick display
            if (this.state.isContributing) {
                this._resumeWaveTick();
            }

            console.log('✓ Collective Field rendered');
        } catch (error) {
            console.error('Collective Field render error:', error);
        }
    },

    /**
     * Clear intervals (call before re-render or on page unload).
     * Note: energyDrainInterval is restarted on render — cleared here too.
     */
    _cleanup() {
        const s = this.state;
        if (s.holdInterval)        { clearInterval(s.holdInterval);        s.holdInterval = null; }
        if (s.timerInterval)       { clearInterval(s.timerInterval);       s.timerInterval = null; }
        if (s.energyDrainInterval) { clearInterval(s.energyDrainInterval); s.energyDrainInterval = null; }
        s.isHolding = false;
        // isContributing intentionally preserved — session survives re-render
    },

    // ============================================================================
    // INTERACTIONS — SEND CALM (Hold Gesture)
    // ============================================================================

    /**
     * User pressed down on the pulse button — start charging
     */
    handleHoldStart() {
        const s = this.state;

        // Enforce 30s cooldown
        if (s.lastCalmSentAt && (Date.now() - s.lastCalmSentAt) < s.COOLDOWN_MS) {
            const remaining = Math.ceil((s.COOLDOWN_MS - (Date.now() - s.lastCalmSentAt)) / 1000);
            this._showToast(`Wait ${remaining}s before sending again`);
            return;
        }

        if (s.isHolding) return;
        s.isHolding = true;
        s.holdProgress = 0;

        const btn = document.getElementById('pulseBtn');
        if (btn) btn.classList.add('holding');

        const startTime = Date.now();

        s.holdInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            s.holdProgress = Math.min((elapsed / s.HOLD_DURATION_MS) * 100, 100);

            // Update charging ring
            const ring = document.getElementById('holdRing');
            if (ring) {
                const offset = 100.5 - (s.holdProgress / 100) * 100.5;
                ring.style.strokeDashoffset = offset;
            }

            // Held long enough — fire
            if (s.holdProgress >= 100) {
                clearInterval(s.holdInterval);
                s.holdInterval = null;
                s.isHolding = false;
                this._firePulse();
            }
        }, 50);
    },

    /**
     * User released before completing hold — cancel
     */
    handleHoldEnd() {
        if (!this.state.isHolding) return;
        this._cancelHold();
    },

    /**
     * Cursor left the button mid-hold — cancel
     */
    handleHoldCancel() {
        if (!this.state.isHolding) return;
        this._cancelHold();
    },

    _cancelHold() {
        const s = this.state;
        if (s.holdInterval) { clearInterval(s.holdInterval); s.holdInterval = null; }
        s.isHolding = false;
        s.holdProgress = 0;

        const btn = document.getElementById('pulseBtn');
        if (btn) btn.classList.remove('holding');

        const ring = document.getElementById('holdRing');
        if (ring) ring.style.strokeDashoffset = '100.5';
    },

    /**
     * Pulse fully charged — fire it
     */
    _firePulse() {
        const s = this.state;
        s.lastCalmSentAt = Date.now();
        s.calmsSentCount++;

        const btn = document.getElementById('pulseBtn');
        if (btn) {
            btn.classList.remove('holding');
            btn.classList.add('fired');
            setTimeout(() => btn.classList.remove('fired'), 1000);
        }

        const ring = document.getElementById('holdRing');
        if (ring) ring.style.strokeDashoffset = '100.5';

        // Add energy to the bar (+5%, cap at 100)
        this._addEnergy(s.ENERGY_PER_PULSE);

        // Ripple SVG animation (intensity dims with repeated sends)
        this._triggerFieldRipple(s.calmsSentCount);

        // Broadcast to other users (Supabase realtime — wired later)
        this._broadcastPulse(s.calmsSentCount);

        this._showToast('Calm sent 🌿');
        console.log(`✓ Pulse fired (send #${s.calmsSentCount})`);
    },

    // ============================================================================
    // ENERGY BAR — Fill & Drain
    // ============================================================================

    /**
     * Add energy to the bar from a pulse.
     * @param {number} amount - % to add
     */
    _addEnergy(amount) {
        const s = this.state;
        s.energyLevel = Math.min(s.energyLevel + amount, 100);
        this._updateEnergyBar(s.energyLevel);
    },

    /**
     * Start the drain watchdog — checks every minute whether inactivity
     * threshold has been passed and drains accordingly.
     */
    _startEnergyDrainWatchdog() {
        const s = this.state;
        if (s.energyDrainInterval) clearInterval(s.energyDrainInterval);

        // Check every minute
        s.energyDrainInterval = setInterval(() => {
            if (s.energyLevel <= 0) return; // already empty

            const sinceLastSend = s.lastCalmSentAt
                ? Date.now() - s.lastCalmSentAt
                : Infinity; // never sent — treat as always inactive

            // Only drain if inactivity threshold crossed
            if (sinceLastSend < s.DRAIN_INACTIVITY_MS) return;

            // Check if enough time has passed for another 1% drain tick
            // Drain rate: 1% per DRAIN_RATE_MS of inactivity beyond the threshold
            const inactivityBeyondThreshold = sinceLastSend - s.DRAIN_INACTIVITY_MS;
            const drainTicksDue = Math.floor(inactivityBeyondThreshold / s.DRAIN_RATE_MS);
            const alreadyDrained = s._drainTicksApplied || 0;

            if (drainTicksDue > alreadyDrained) {
                const newDrainTicks = drainTicksDue - alreadyDrained;
                s._drainTicksApplied = drainTicksDue;
                s.energyLevel = Math.max(s.energyLevel - newDrainTicks, 0);
                this._updateEnergyBar(s.energyLevel);
                console.log(`⬇ Energy drained to ${s.energyLevel}%`);
            }
        }, 60 * 1000); // check every 60s
    },

    /**
     * Reset drain tick counter — called whenever a pulse fires (via _firePulse → _addEnergy)
     */
    _resetDrainTicks() {
        this.state._drainTicksApplied = 0;
    },

    /**
     * Update the energy bar DOM elements
     * @param {number} level - 0–100
     */
    _updateEnergyBar(level) {
        const fill = document.getElementById('pulseFill');
        const value = document.getElementById('energyValue');

        if (fill) {
            fill.style.width = `${level}%`;
            fill.setAttribute('aria-valuenow', level);
        }
        if (value) {
            value.textContent = `${level}%`;
        }
    },

    /**
     * Animate a ripple on the local energy field SVG.
     * Visual intensity diminishes with each subsequent send.
     * @param {number} sendCount
     */
    _triggerFieldRipple(sendCount) {
        const intensity = Math.max(1 - (sendCount - 1) * 0.2, 0.2);

        const svg = document.querySelector('.energy-card svg');
        if (!svg) return;

        const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ripple.setAttribute('cx', '50');
        ripple.setAttribute('cy', '50');
        ripple.setAttribute('r', '10');
        ripple.setAttribute('fill', 'none');
        ripple.setAttribute('stroke', 'currentColor');
        ripple.setAttribute('stroke-width', '2');
        ripple.style.opacity = intensity;
        ripple.style.transition = 'r 1s ease-out, opacity 1s ease-out';
        svg.appendChild(ripple);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ripple.style.opacity = '0';
                ripple.setAttribute('r', '48');
            });
        });

        setTimeout(() => ripple.remove(), 1100);
    },

    /**
     * Receive a pulse from another user (called by Supabase realtime — wired later).
     * @param {object} payload - { userId, intensity }
     */
    receiveExternalPulse(payload) {
        const intensity = Math.min(payload.intensity || 0.6, 0.8);
        this._triggerFieldRipple(Math.round((1 - intensity) / 0.2) + 1);
        console.log(`✓ External pulse received from ${payload.userId}`);
    },

    /**
     * Broadcast pulse to other users via Supabase realtime (stub).
     * @param {number} sendCount
     */
    _broadcastPulse(sendCount) {
        const intensity = Math.max(1 - (sendCount - 1) * 0.2, 0.2);
        // TODO: wire to Supabase realtime channel
        // CommunityDB.broadcastPulse({ intensity });
        console.log(`📡 Pulse broadcast queued (intensity: ${intensity.toFixed(1)})`);
    },

    // ============================================================================
    // INTERACTIONS — CONTRIBUTE WAVE (Count-up → Log on end)
    // ============================================================================

    /**
     * Main entry — toggles between starting and ending a session
     */
    handleContributeWave() {
        if (this.state.isContributing) {
            this._endWave();
        } else {
            this._startWave();
        }
    },

    /**
     * Start a silence session — count up from 0
     */
    _startWave() {
        const s = this.state;
        s.isContributing = true;
        s.contributeStartedAt = Date.now();
        s.countedAsParticipant = false;

        const btn = document.getElementById('waveBtn');
        const label = document.getElementById('waveBtnLabel');
        if (btn) btn.classList.add('in-progress');
        if (label) label.textContent = 'End Session';

        this._updateWaveStatusLine(); // immediate update
        this._showToast('Silence started 🤫');
        console.log('✓ Wave session started');

        s.timerInterval = setInterval(() => this._waveTick(), 1000);
    },

    /**
     * Resume count-up tick after a re-render (session was already running)
     */
    _resumeWaveTick() {
        const s = this.state;
        const btn = document.getElementById('waveBtn');
        const label = document.getElementById('waveBtnLabel');
        if (btn) btn.classList.add('in-progress');
        if (label) label.textContent = 'End Session';

        this._updateWaveStatusLine();
        s.timerInterval = setInterval(() => this._waveTick(), 1000);
    },

    /**
     * Called every second during an active session
     */
    _waveTick() {
        const s = this.state;
        if (!s.isContributing) return;

        const elapsedMs = Date.now() - s.contributeStartedAt;

        // After 5 minutes — count as participant
        if (!s.countedAsParticipant && elapsedMs >= 5 * 60 * 1000) {
            s.countedAsParticipant = true;
            this._incrementParticipantCount();
            this._triggerAvatarRipple();
            this._showToast('You\'re in the wave ✨');
        }

        // Update the status line (shows both personal time + collective remaining)
        this._updateWaveStatusLine(elapsedMs);
    },

    /**
     * Update the status line below the participant count.
     * Idle: shows collective time remaining.
     * Active: shows "Xm Ys given · Xh Xm to complete"
     * @param {number} [elapsedMs] - if provided, session is active
     */
    _updateWaveStatusLine(elapsedMs) {
        const s = this.state;
        const statusText = document.getElementById('waveStatusText');
        if (!statusText) return;

        const remainingMinutes = Math.max(s.WAVE_GOAL_MINUTES - s.waveTotalMinutes, 0);
        const remainingHrs = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        const collectiveLabel = remainingHrs > 0
            ? `${remainingHrs}h ${remainingMins}m to complete the wave`
            : `${remainingMins}m to complete the wave`;

        if (elapsedMs !== undefined && s.isContributing) {
            const givenMins = Math.floor(elapsedMs / 60000);
            const givenSecs = Math.floor((elapsedMs % 60000) / 1000);
            const givenLabel = givenMins > 0
                ? `${givenMins}m ${String(givenSecs).padStart(2, '0')}s given`
                : `${String(givenSecs).padStart(2, '0')}s given`;

            statusText.textContent = `${givenLabel} · ${collectiveLabel}`;
        } else {
            statusText.textContent = collectiveLabel;
        }
    },

    /**
     * User ends their silence session — log time if ≥ 1 minute
     */
    _endWave() {
        const s = this.state;
        clearInterval(s.timerInterval);
        s.timerInterval = null;
        s.isContributing = false;

        const elapsedMs = Date.now() - s.contributeStartedAt;
        const minutesLogged = Math.floor(elapsedMs / 60000);

        // Decrement participant count if they qualified
        if (s.countedAsParticipant) {
            this._decrementParticipantCount();
            s.countedAsParticipant = false;
        }

        // Reset button
        const btn = document.getElementById('waveBtn');
        const label = document.getElementById('waveBtnLabel');
        if (btn) btn.classList.remove('in-progress');

        if (minutesLogged < 1) {
            // Under 1 minute — not logged
            if (label) label.textContent = 'Start Silence';
            this._showToast('Sit a little longer 🙏');
            console.log('✓ Wave session ended — under 1min, nothing logged');
            this._updateWaveStatusLine(); // reset to collective view
            return;
        }

        // Log contribution — add to collective total
        s.waveTotalMinutes = Math.min(s.waveTotalMinutes + minutesLogged, s.WAVE_GOAL_MINUTES);
        this._updateWaveProgress();

        if (label) label.textContent = 'Start Silence';
        this._showToast(`${minutesLogged}min contributed to the wave 🌊`);
        console.log(`✓ Wave session ended — ${minutesLogged}min logged`);

        // Check if wave completed
        if (s.waveTotalMinutes >= s.WAVE_GOAL_MINUTES) {
            this._onWaveComplete();
        }

        this._updateWaveStatusLine(); // reset to collective view

        // TODO: persist to Supabase
        // CommunityDB.logWaveContribution({ minutes: minutesLogged });
    },

    /**
     * Called when the collective wave reaches 1440 minutes
     */
    _onWaveComplete() {
        this._showToast('🎉 The wave is complete! A new one begins tomorrow.');
        console.log('🎉 24h Calm Wave completed!');
        // TODO: trigger celebration animation, reset wave for next day
    },

    /**
     * Update the wave progress bar and value display
     */
    _updateWaveProgress() {
        const s = this.state;
        const progress = Math.min(Math.round((s.waveTotalMinutes / s.WAVE_GOAL_MINUTES) * 100), 100);

        const fill = document.getElementById('waveFill');
        const value = document.getElementById('waveProgressValue');

        if (fill) {
            fill.style.width = `${progress}%`;
            fill.setAttribute('aria-valuenow', progress);
        }
        if (value) {
            value.textContent = `${progress}%`;
        }
    },


    /**
     * Float the current user's avatar (or emoji fallback) up through the wave SVG.
     * Triggered at the 5-minute participant mark.
     */
    _triggerAvatarRipple() {
        // Inject keyframes once
        if (!document.getElementById('waveRippleStyles')) {
            const style = document.createElement('style');
            style.id = 'waveRippleStyles';
            style.textContent = `
                @keyframes waveFloat {
                    0%   { transform: translateY(0)   scale(1);    opacity: 0; }
                    15%  { opacity: 1; }
                    80%  { opacity: 0.9; }
                    100% { transform: translateY(-90px) scale(0.7); opacity: 0; }
                }
                .wave-avatar-ripple {
                    position: absolute;
                    bottom: 10px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                    animation: waveFloat 2.8s ease-out forwards;
                    pointer-events: none;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    border: 2px solid rgba(255,255,255,0.6);
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-card, #f0ece6);
                }
            `;
            document.head.appendChild(style);
        }

        const stage = document.getElementById('waveRippleStage');
        if (!stage) return;

        // Get avatar URL and emoji from Core state
        const user = window.Core?.state?.currentUser;
        const avatarUrl = user?.avatar_url || null;
        const emoji = user?.emoji || '🧘';

        // Random horizontal position within the stage
        const stageWidth = stage.offsetWidth || 80;
        const leftPx = Math.floor(Math.random() * (stageWidth - 36)) + 2;

        let el;
        if (avatarUrl) {
            el = document.createElement('img');
            el.src = avatarUrl;
            el.alt = 'You';
            el.className = 'wave-avatar-ripple';
            // Fallback to emoji if image fails to load
            el.onerror = () => {
                el.replaceWith(this._makeEmojiRipple(emoji, leftPx));
            };
        } else {
            el = this._makeEmojiRipple(emoji, leftPx);
        }

        el.style.left = `${leftPx}px`;
        stage.appendChild(el);

        // Remove from DOM after animation completes
        setTimeout(() => el.remove(), 3000);
    },

    /**
     * Create an emoji span for the ripple (used when no avatar photo available)
     * @param {string} emoji
     * @param {number} leftPx
     */
    _makeEmojiRipple(emoji, leftPx) {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'wave-avatar-ripple';
        span.style.left = `${leftPx}px`;
        span.style.lineHeight = '28px';
        span.style.textAlign = 'center';
        return span;
    },

    _incrementParticipantCount() {
        const el = document.getElementById('waveParticipants');
        if (el) el.textContent = parseInt(el.textContent || '0') + 1;
    },

    _decrementParticipantCount() {
        const el = document.getElementById('waveParticipants');
        if (el) el.textContent = Math.max(parseInt(el.textContent || '0') - 1, 0);
    },

    // ============================================================================
    // PUBLIC UPDATES (called externally — e.g. from Supabase subscriptions)
    // ============================================================================

    /**
     * Update presence count display
     * @param {number} count
     */
    updatePresenceCount(count) {
        if (typeof count !== 'number' || count < 0) return;
        const el = document.getElementById('presenceCount');
        if (el) el.textContent = count;
    },

    /**
     * Set energy level directly (e.g. from Supabase on init)
     * @param {number} level - 0–100
     */
    updateEnergyLevel(level) {
        if (typeof level !== 'number' || level < 0 || level > 100) return;
        this.state.energyLevel = level;
        this._updateEnergyBar(level);
    },

    /**
     * Set collective wave total (e.g. from Supabase on init or realtime update)
     * @param {number} totalMinutes
     */
    updateWaveTotalMinutes(totalMinutes) {
        if (typeof totalMinutes !== 'number' || totalMinutes < 0) return;
        this.state.waveTotalMinutes = Math.min(totalMinutes, this.state.WAVE_GOAL_MINUTES);
        this._updateWaveProgress();
        if (!this.state.isContributing) this._updateWaveStatusLine();
    },

    /**
     * Refresh the collective field display
     */
    refresh() {
        try {
            this.render();
        } catch (error) {
            console.error('Collective Field refresh error:', error);
        }
    },

    // ============================================================================
    // UTILITY
    // ============================================================================

    _showToast(message) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast(message);
        } else {
            console.log(`Toast: ${message}`);
        }
    },
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CollectiveField.render());
} else {
    CollectiveField.render();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => CollectiveField._cleanup());

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.CollectiveField = CollectiveField;
