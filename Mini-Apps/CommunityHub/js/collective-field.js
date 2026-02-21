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

        // User's personal wave contributions
        userTodayMinutes: 0,      // minutes contributed today (loaded from Supabase later)
        userAllTimeMinutes: 0,    // all-time minutes contributed (loaded from Supabase later)

        // Energy card enrichment
        communityPulseCount: 47,  // total pulses sent today by all users (from Supabase later)
        recentSenders: [],        // [{ emoji, avatarUrl }] last few senders (from Supabase later)
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

        const fieldLabel = this._getFieldLabel(energyLevel);
        const lastSentLabel = this._getLastSentLabel();
        const recentSendersHTML = this._getRecentSendersHTML();

        return `
            <!-- Collective Energy Field -->
            <div class="collective-card energy-card">
                <div class="collective-icon">
                    ${this.getEnergyFieldSVG()}
                </div>

                <div class="collective-title">Community Energy</div>

                <!-- Big counter: Pulses Sent Today -->
                <div class="collective-count">
                    <span class="count-number" id="communityPulseCount">${this.state.communityPulseCount}</span>
                    <span class="count-label">Pulses Sent Today</span>
                </div>

                <!-- Dynamic field state label -->
                <div id="fieldStateLabel" style="font-size: 12px; font-style: italic; color: var(--text-muted); margin: 2px 0 6px; text-align: center;">
                    ${fieldLabel}
                </div>

                <!-- Last sent + recent senders row -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <div>
                        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 3px;">Recent senders</div>
                        <div id="recentSendersStrip" style="display: flex; gap: 4px; align-items: center; min-height: 26px;">
                            ${recentSendersHTML}
                        </div>
                    </div>
                    <span id="lastSentLabel" style="font-size: 11px; color: var(--text-muted); text-align: right; align-self: flex-end;">${lastSentLabel}</span>
                </div>

                <!-- Progress bar -->
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
                        aria-label="Hold to send energy to the community">
                    <svg class="hold-ring" viewBox="0 0 36 36" aria-hidden="true">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                        <circle id="holdRing" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-dasharray="100.5" stroke-dashoffset="100.5"
                            stroke-linecap="round"
                            transform="rotate(-90 18 18)"/>
                    </svg>
                    <span id="pulseBtnLabel">Hold to Send Energy</span>
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

                <div class="wave-time-block" style="position: relative;">

                    <!-- Session count-up clock (hidden when idle, grows into focus when active) -->
                    <div id="waveSessionClock" style="
                        overflow: hidden;
                        max-height: 0;
                        opacity: 0;
                        transition: max-height 0.5s ease, opacity 0.4s ease, margin 0.4s ease;
                        margin-bottom: 0;
                    ">
                        <div id="waveCountUp" style="font-size: 32px; font-weight: 700; letter-spacing: 2px; color: var(--text-primary); line-height: 1;" aria-live="polite">00:00</div>
                        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">your silence so far</div>
                    </div>

                    <!-- Collective time remaining (shrinks + dims when session active) -->
                    <div id="waveCollectiveTime" style="transition: font-size 0.4s ease, opacity 0.4s ease, margin 0.4s ease;">
                        <div id="waveClockDisplay" style="font-size: 28px; font-weight: 700; letter-spacing: 1px; color: var(--text-primary); line-height: 1.1;">
                            ${remainingLabel.replace(' to complete the wave', '')}
                        </div>
                        <div id="waveClockLabel" style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                            to complete the wave
                        </div>
                    </div>

                    <!-- Personal contribution (always visible, dims slightly when session active) -->
                    <div id="waveContribBlock" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-subtle, rgba(0,0,0,0.08)); transition: opacity 0.4s ease;">
                        <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 3px;">Your contribution</div>
                        <div style="display: flex; gap: 12px; align-items: baseline;">
                            <span>
                                <span id="userTodayDisplay" style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${this.state.userTodayMinutes}m</span>
                                <span style="font-size: 10px; color: var(--text-muted); margin-left: 2px;">today</span>
                            </span>
                            <span>
                                <span id="userAllTimeDisplay" style="font-size: 16px; font-weight: 600; color: var(--text-primary);">${this.state.userAllTimeMinutes}m</span>
                                <span style="font-size: 10px; color: var(--text-muted); margin-left: 2px;">all time</span>
                            </span>
                        </div>
                    </div>
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

            // Refresh last-sent label every 60s so it stays accurate
            this._lastSentRefreshInterval = setInterval(() => {
                const el = document.getElementById('lastSentLabel');
                if (el) el.textContent = this._getLastSentLabel();
            }, 60000);

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
        if (this._lastSentRefreshInterval) { clearInterval(this._lastSentRefreshInterval); this._lastSentRefreshInterval = null; }
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

        // Ripple SVG animation inside the energy card
        this._triggerFieldRipple(s.calmsSentCount);

        // App-wide ripple visible to everyone (local trigger + broadcast)
        this._triggerAppWideRipple();

        // Broadcast to other users (Supabase realtime — wired later)
        this._broadcastPulse(s.calmsSentCount);

        // Increment community pulse count locally
        s.communityPulseCount++;

        // Add self to recent senders strip
        this._addSelfToRecentSenders();

        // Refresh all meta elements on the card
        this._refreshEnergyCardMeta();

        this._showToast('Energy sent ⚡');
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
     * Returns an inspiring label based on current energy level
     * @param {number} level
     */
    _getFieldLabel(level) {
        if (level >= 80) return '✨ The field is radiant';
        if (level >= 60) return '🌿 The field is strong';
        if (level >= 40) return '🌱 The field is growing';
        if (level >= 20) return '🕯 The field flickers';
        return '🌑 The field needs energy';
    },

    /**
     * Returns a human-readable "last sent X ago" label
     */
    _getLastSentLabel() {
        const last = this.state.lastCalmSentAt;
        if (!last) return 'Not sent yet';
        const secs = Math.floor((Date.now() - last) / 1000);
        if (secs < 60)  return `Sent ${secs}s ago`;
        const mins = Math.floor(secs / 60);
        if (mins < 60)  return `Sent ${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        return `Sent ${hrs}h ago`;
    },

    /**
     * Render recent senders as small avatar circles
     */
    _getRecentSendersHTML() {
        const senders = this.state.recentSenders;
        if (!senders.length) {
            return '<span style="font-size: 11px; color: var(--text-muted); font-style: italic;">No one yet — be first</span>';
        }
        return senders.slice(0, 5).map(s => {
            if (s.avatarUrl) {
                return `<img src="${s.avatarUrl}" alt="" style="width:26px;height:26px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border-subtle,rgba(0,0,0,0.1));" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${s.emoji||'🧘'}',style:'font-size:20px;line-height:26px;'}))">`;
            }
            return `<span style="font-size:20px;line-height:26px;" title="Recent sender">${s.emoji || '🧘'}</span>`;
        }).join('');
    },

    /**
     * Update all energy card dynamic elements after a pulse fires
     */
    _refreshEnergyCardMeta() {
        const s = this.state;

        // Field state label
        const labelEl = document.getElementById('fieldStateLabel');
        if (labelEl) labelEl.textContent = this._getFieldLabel(s.energyLevel);

        // Last sent
        const lastEl = document.getElementById('lastSentLabel');
        if (lastEl) lastEl.textContent = this._getLastSentLabel();

        // Community pulse count (now the main big counter)
        const countEl = document.getElementById('communityPulseCount');
        if (countEl) countEl.textContent = s.communityPulseCount;

        // Recent senders strip
        const strip = document.getElementById('recentSendersStrip');
        if (strip) strip.innerHTML = this._getRecentSendersHTML();
    },

    /**
     * Add current user to the top of recentSenders, cap at 5
     */
    _addSelfToRecentSenders() {
        const user = window.Core?.state?.currentUser;
        const entry = {
            emoji: user?.emoji || '🧘',
            avatarUrl: user?.avatar_url || null,
        };
        // Prepend and deduplicate by avatarUrl/emoji
        this.state.recentSenders = [entry, ...this.state.recentSenders].slice(0, 5);
    },

    /**
     * Public: set recent senders from Supabase
     * @param {Array<{emoji, avatarUrl}>} senders
     */
    updateRecentSenders(senders) {
        this.state.recentSenders = senders || [];
        const strip = document.getElementById('recentSendersStrip');
        if (strip) strip.innerHTML = this._getRecentSendersHTML();
    },

    /**
     * Public: set community pulse count from Supabase
     * @param {number} count
     */
    updateCommunityPulseCount(count) {
        this.state.communityPulseCount = count || 0;
        const el = document.getElementById('communityPulseCount');
        if (el) el.textContent = this.state.communityPulseCount;
    },

        /**
     * Trigger a large ripple emanating from the Energy Field card position.
     * Called locally on fire AND by receiveExternalPulse for all online users.
     */
    _triggerAppWideRipple() {
        // Inject styles once
        if (!document.getElementById('appRippleStyles')) {
            const style = document.createElement('style');
            style.id = 'appRippleStyles';
            style.textContent = `
                @keyframes waterRipple {
                    0%   { width: 0px; height: 0px; opacity: 0.8; box-shadow: 0 0 0 0 rgba(90,180,160,0.3); }
                    30%  { opacity: 0.6; box-shadow: 0 0 24px 8px rgba(90,180,160,0.15); }
                    100% { width: var(--ripple-size); height: var(--ripple-size); opacity: 0; box-shadow: 0 0 0 0 rgba(90,180,160,0); }
                }
                @keyframes waterRipple2 {
                    0%   { width: 0px; height: 0px; opacity: 0; }
                    15%  { opacity: 0.5; }
                    100% { width: var(--ripple-size); height: var(--ripple-size); opacity: 0; }
                }
                @keyframes waterRipple3 {
                    0%   { width: 0px; height: 0px; opacity: 0; }
                    25%  { opacity: 0.3; }
                    100% { width: var(--ripple-size); height: var(--ripple-size); opacity: 0; }
                }
                #appRippleOverlay {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 99999;
                    overflow: visible;
                }
                .app-wide-ripple {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    will-change: width, height, opacity;
                }
                .app-wide-ripple.ring-1 {
                    border: 4px solid rgba(90, 180, 160, 0.85);
                    background: rgba(90, 180, 160, 0.06);
                    animation: waterRipple 2.6s cubic-bezier(0.1, 0.4, 0.3, 1) forwards;
                }
                .app-wide-ripple.ring-2 {
                    border: 2.5px solid rgba(90, 180, 160, 0.5);
                    background: transparent;
                    animation: waterRipple2 2.6s cubic-bezier(0.1, 0.4, 0.3, 1) 0.3s forwards;
                }
                .app-wide-ripple.ring-3 {
                    border: 1.5px solid rgba(90, 180, 160, 0.3);
                    background: transparent;
                    animation: waterRipple3 2.6s cubic-bezier(0.1, 0.4, 0.3, 1) 0.6s forwards;
                }
            `;
            document.head.appendChild(style);
        }

        // Use a persistent overlay div with no transforms — safe from parent clipping
        let overlay = document.getElementById('appRippleOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'appRippleOverlay';
            document.body.appendChild(overlay);
        }

        // Origin: centre of the Energy Field card
        const card = document.querySelector('.energy-card');
        let originX = window.innerWidth / 2;
        let originY = window.innerHeight / 2;
        if (card) {
            const rect = card.getBoundingClientRect();
            originX = rect.left + rect.width / 2;
            originY = rect.top + rect.height / 2;
        }

        // Target size: cover the full viewport diagonal
        const size = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) * 2.2;

        ['ring-1', 'ring-2', 'ring-3'].forEach((cls, i) => {
            const ripple = document.createElement('div');
            ripple.className = `app-wide-ripple ${cls}`;
            ripple.style.setProperty('--ripple-size', `${size}px`);
            ripple.style.left = `${originX}px`;
            ripple.style.top  = `${originY}px`;
            overlay.appendChild(ripple);
            // Remove after animation (2.6s duration + delay + buffer)
            setTimeout(() => ripple.remove(), 3400 + i * 300);
        });
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
     * Update the wave time block.
     *
     * Idle:   clock shows collective time remaining (large), contrib block shows today + all-time
     * Active: clock shows session count-up (large), contrib block hidden
     *
     * @param {number} [elapsedMs] - if provided, session is active
     */
    _updateWaveStatusLine(elapsedMs) {
        const s = this.state;
        const sessionClock    = document.getElementById('waveSessionClock');
        const countUp         = document.getElementById('waveCountUp');
        const collectiveBlock = document.getElementById('waveCollectiveTime');
        const clockDisplay    = document.getElementById('waveClockDisplay');
        const contribBlock    = document.getElementById('waveContribBlock');
        if (!clockDisplay) return;

        // Always keep collective time text current
        const remainingMinutes = Math.max(s.WAVE_GOAL_MINUTES - s.waveTotalMinutes, 0);
        const remainingHrs  = Math.floor(remainingMinutes / 60);
        const remainingMins = remainingMinutes % 60;
        clockDisplay.textContent = remainingHrs > 0
            ? `${remainingHrs}h ${remainingMins}m`
            : `${remainingMins}m`;

        if (elapsedMs !== undefined && s.isContributing) {
            // ── Active: count-up expands in, collective shrinks + dims ──
            const givenMins = Math.floor(elapsedMs / 60000);
            const givenSecs = Math.floor((elapsedMs % 60000) / 1000);
            if (countUp) countUp.textContent = `${String(givenMins).padStart(2, '0')}:${String(givenSecs).padStart(2, '0')}`;

            // Expand session clock
            if (sessionClock) {
                sessionClock.style.maxHeight   = '60px';
                sessionClock.style.opacity     = '1';
                sessionClock.style.marginBottom = '8px';
            }
            // Shrink + dim collective time
            if (collectiveBlock) {
                collectiveBlock.style.fontSize = '13px';
                collectiveBlock.style.opacity  = '0.45';
                collectiveBlock.style.marginTop = '2px';
            }
            // Dim contribution block slightly (still visible)
            if (contribBlock) contribBlock.style.opacity = '0.5';

        } else {
            // ── Idle: collapse session clock, restore collective to full size ──
            if (sessionClock) {
                sessionClock.style.maxHeight    = '0';
                sessionClock.style.opacity      = '0';
                sessionClock.style.marginBottom = '0';
            }
            if (collectiveBlock) {
                collectiveBlock.style.fontSize  = '';
                collectiveBlock.style.opacity   = '1';
                collectiveBlock.style.marginTop = '';
            }
            if (contribBlock) contribBlock.style.opacity = '1';

            // Refresh contribution numbers
            const todayEl   = document.getElementById('userTodayDisplay');
            const allTimeEl = document.getElementById('userAllTimeDisplay');
            if (todayEl)   todayEl.textContent  = `${s.userTodayMinutes}m`;
            if (allTimeEl) allTimeEl.textContent = `${s.userAllTimeMinutes}m`;
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

        // Log contribution — add to collective total and personal counters
        s.waveTotalMinutes  = Math.min(s.waveTotalMinutes + minutesLogged, s.WAVE_GOAL_MINUTES);
        s.userTodayMinutes  = s.userTodayMinutes  + minutesLogged;
        s.userAllTimeMinutes = s.userAllTimeMinutes + minutesLogged;
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
     * Set user's personal contribution totals (called on init from Supabase)
     * @param {number} todayMinutes
     * @param {number} allTimeMinutes
     */
    updateUserContribution(todayMinutes, allTimeMinutes) {
        this.state.userTodayMinutes   = todayMinutes   || 0;
        this.state.userAllTimeMinutes = allTimeMinutes || 0;
        if (!this.state.isContributing) this._updateWaveStatusLine();
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
