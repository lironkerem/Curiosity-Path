/**
 * COLLECTIVE FIELD MODULE
 *
 * Renders the Collective Field section:
 * - Collective Energy Field with real-time presence + pulse/hold gesture
 * - 24-Hour Calm Wave progress tracker + silence sessions
 * - Animated SVG visualizations + app-wide ripple
 *
 * @version 2.2.0
 */

import { Core } from './core.js';
import { CollectiveFieldDB } from './collective-field-db.js';

const CollectiveField = {

    // =========================================================================
    // STATE
    // =========================================================================

    state: {
        isRendered: false,

        // Send Calm
        calmsSentCount:   0,
        lastCalmSentAt:   null,
        isHolding:        false,
        holdProgress:     0,
        holdInterval:     null,
        HOLD_DURATION_MS: 3_000,
        COOLDOWN_MS:      30_000,

        // Energy Bar
        energyLevel:          42,
        energyDrainInterval:  null,
        _drainTicksApplied:   0,
        DRAIN_INACTIVITY_MS:  60 * 60 * 1_000,
        DRAIN_RATE_MS:        10 * 60 * 1_000,
        ENERGY_PER_PULSE:     5,

        // Calm Wave
        isContributing:       false,
        contributeStartedAt:  null,
        timerInterval:        null,
        countedAsParticipant: false,
        waveTotalMinutes:     967,
        WAVE_GOAL_MINUTES:    1_440,

        // Personal contribution (populated from Supabase)
        userTodayMinutes:    0,
        userAllTimeMinutes:  0,

        // Community data (populated from Supabase)
        communityPulseCount: 47,
        recentSenders:       [],
    },

    // =========================================================================
    // CONFIG
    // =========================================================================

    config: {
        DEFAULT_PRESENCE_COUNT:    127,
        DEFAULT_WAVE_PARTICIPANTS: 0,
    },

    // =========================================================================
    // FIELD LABELS (frozen)
    // =========================================================================

    _FIELD_LABELS: Object.freeze([
        { min: 80, text: 'The field is radiant',    svgPath: 'sun' },
        { min: 60, text: 'The field is strong',     svgPath: 'plus-circle' },
        { min: 40, text: 'The field is growing',    svgPath: 'leaf' },
        { min: 20, text: 'The field is flickering', svgPath: 'zap' },
        { min:  0, text: 'The field needs energy',  svgPath: 'alert-circle' },
    ]),

    // =========================================================================
    // RENDERING
    // =========================================================================

    render() {
        const container = document.getElementById('collectiveFieldContainer');
        if (!container) {
            console.warn('[CollectiveField] #collectiveFieldContainer not found');
            return;
        }

        this._cleanup();

        try {
            container.innerHTML = this._buildHTML();
            this.state.isRendered = true;

            this._startEnergyDrainWatchdog();

            this._lastSentRefreshInterval = setInterval(() => {
                const el = document.getElementById('lastSentLabel');
                if (el) el.textContent = this._getLastSentLabel();
            }, 60_000);

            if (this.state.isContributing) this._resumeWaveTick();

        } catch (err) {
            console.error('[CollectiveField] render error');
        }
    },

    _buildHTML() {
        return `
            <div class="section-header">
                <div class="section-title">Collective Field</div>
                <div style="font-size:12px;color:var(--text-muted);">Real-time resonance</div>
            </div>
            <div class="collective-grid">
                ${this._buildEnergyFieldHTML()}
                ${this._buildCalmWaveHTML()}
            </div>`;
    },

    _buildEnergyFieldHTML() {
        const { energyLevel, communityPulseCount } = this.state;
        const lastSentLabel  = this._getLastSentLabel();
        const recentSenders  = this._buildRecentSendersHTML();

        return `
            <div class="collective-card energy-card">
                <div class="collective-icon" aria-hidden="true">${this._buildEnergyFieldSVG()}</div>
                <div class="collective-title">Community Energy</div>

                <div class="collective-count">
                    <span class="count-number" id="communityPulseCount">${communityPulseCount}</span>
                    <span class="count-label">Pulses Sent Today</span>
                </div>

                <div id="fieldStateLabel"
                     style="font-size:13px;font-weight:600;color:var(--text-muted);margin:6px 0 0;text-align:center;"
                     aria-live="polite">
                    ${this._getFieldLabel(energyLevel)}
                </div>

                <div style="margin:10px 0;">
                    <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">Recent senders</div>
                    <div id="recentSendersStrip"
                         style="display:flex;gap:4px;align-items:center;min-height:26px;"
                         aria-label="Recent pulse senders">
                        ${recentSenders}
                    </div>
                    <div id="lastSentLabel" style="font-size:11px;color:var(--text-muted);margin-top:5px;">${lastSentLabel}</div>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="pulseFill"
                                 style="width:${energyLevel}%"
                                 role="progressbar"
                                 aria-valuenow="${energyLevel}" aria-valuemin="0" aria-valuemax="100"
                                 aria-label="Energy level ${energyLevel}%">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats" style="display:flex;align-items:center;">
                        <span class="progress-label">Energy Level</span>
                        <span class="progress-value" id="energyValue">${energyLevel}%</span>
                        <span id="adminEnergyBtn" style="display:none;margin-left:8px;">
                            <button type="button" id="adminAddEnergyBtn" title="Admin: Add Energy"
                                    aria-label="Admin: Add 10% energy"
                                    style="width:22px;height:22px;border-radius:50%;border:none;cursor:pointer;
                                           font-size:13px;font-weight:700;line-height:1;
                                           background:rgba(139,92,246,0.15);color:rgba(139,92,246,0.9);
                                           display:inline-flex;align-items:center;justify-content:center;">+</button>
                        </span>
                    </div>
                </div>

                <button type="button" class="collective-action-btn" id="pulseBtn"
                        aria-label="Hold to send energy to the community">
                    <svg class="hold-ring" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.2"/>
                        <circle id="holdRing" cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-dasharray="100.5" stroke-dashoffset="100.5"
                                stroke-linecap="round" transform="rotate(-90 18 18)"/>
                    </svg>
                    <span id="pulseBtnLabel">Hold to Send Energy</span>
                </button>
            </div>`;
    },

    _buildCalmWaveHTML() {
        const { waveTotalMinutes, WAVE_GOAL_MINUTES, userTodayMinutes, userAllTimeMinutes } = this.state;
        const participants     = this.config.DEFAULT_WAVE_PARTICIPANTS;
        const progress         = Math.min(Math.round((waveTotalMinutes / WAVE_GOAL_MINUTES) * 100), 100);
        const remainingMinutes = Math.max(WAVE_GOAL_MINUTES - waveTotalMinutes, 0);
        const remainingHrs     = Math.floor(remainingMinutes / 60);
        const remainingMins    = remainingMinutes % 60;
        const remainingLabel   = remainingHrs > 0 ? `${remainingHrs}h ${remainingMins}m` : `${remainingMins}m`;

        return `
            <div class="collective-card wave-card-new">
                <div class="collective-icon" style="position:relative;" aria-hidden="true">
                    ${this._buildCalmWaveSVG()}
                    <div id="waveRippleStage" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>
                </div>

                <div class="collective-title">24h Calm Wave</div>

                <div class="collective-count">
                    <span class="count-number" id="waveParticipants">${participants}</span>
                    <span class="count-label">Participants</span>
                </div>

                <div class="wave-time-block" style="position:relative;">
                    <div id="waveSessionClock"
                         style="overflow:hidden;max-height:0;opacity:0;transition:max-height 0.5s ease,opacity 0.4s ease,margin 0.4s ease;margin-bottom:0;">
                        <div id="waveCountUp"
                             style="font-size:32px;font-weight:700;letter-spacing:2px;color:var(--text-primary);line-height:1;"
                             aria-live="polite">00:00</div>
                        <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">your silence so far</div>
                    </div>

                    <div id="waveCollectiveTime"
                         style="transition:font-size 0.4s ease,opacity 0.4s ease,margin 0.4s ease;">
                        <div id="waveClockDisplay"
                             style="font-size:28px;font-weight:700;letter-spacing:1px;color:var(--text-primary);line-height:1.1;">${remainingLabel}</div>
                        <div id="waveClockLabel" style="font-size:11px;color:var(--text-muted);margin-top:2px;">to complete the wave</div>
                        <div id="waveMidnightLabel" style="font-size:10px;color:var(--text-muted);margin-top:1px;opacity:0.7;">resets at midnight UTC</div>
                    </div>

                    <div id="waveContribBlock"
                         style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border-subtle,rgba(0,0,0,0.08));transition:opacity 0.4s ease;">
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:3px;">Your contribution</div>
                        <div style="display:flex;gap:12px;align-items:baseline;">
                            <span>
                                <span id="userTodayDisplay" style="font-size:16px;font-weight:600;color:var(--text-primary);">${userTodayMinutes}m</span>
                                <span style="font-size:10px;color:var(--text-muted);margin-left:2px;">today</span>
                            </span>
                            <span>
                                <span id="userAllTimeDisplay" style="font-size:16px;font-weight:600;color:var(--text-primary);">${userAllTimeMinutes}m</span>
                                <span style="font-size:10px;color:var(--text-muted);margin-left:2px;">all time</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" id="waveFill"
                                 style="width:${progress}%"
                                 role="progressbar"
                                 aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"
                                 aria-label="Wave progress ${progress}%">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats" style="display:flex;align-items:center;">
                        <span class="progress-label">Wave Building</span>
                        <span class="progress-value" id="waveProgressValue">${progress}%</span>
                        <span id="adminWaveBtn" style="display:none;margin-left:8px;">
                            <button type="button" id="adminAddWaveBtn" title="Admin: Add 60 minutes to Wave"
                                    aria-label="Admin: Add 60 minutes to wave"
                                    style="width:22px;height:22px;border-radius:50%;border:none;cursor:pointer;
                                           font-size:13px;font-weight:700;line-height:1;
                                           background:rgba(139,92,246,0.15);color:rgba(139,92,246,0.9);
                                           display:inline-flex;align-items:center;justify-content:center;">+</button>
                        </span>
                    </div>
                </div>

                <button type="button" class="collective-action-btn" id="waveBtn"
                        aria-label="Contribute silence to the calm wave">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                         aria-hidden="true" focusable="false">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M12 6v12M6 12h12"/>
                    </svg>
                    <span id="waveBtnLabel">Start Silence</span>
                </button>
            </div>`;
    },

    _buildEnergyFieldSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true" focusable="false">
                <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                <circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="2" opacity="0.7"/>
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9">
                    <animate attributeName="r"       values="8;12;8"       dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.9;0.6;0.9"  dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>`;
    },

    _buildCalmWaveSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true" focusable="false">
                <path d="M10 50 Q 20 30, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.4"/>
                <path d="M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="2.5" fill="none" opacity="0.6"/>
                <path d="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50" stroke="currentColor" stroke-width="3"   fill="none">
                    <animate attributeName="d"
                        values="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50"
                        dur="4s" repeatCount="indefinite"/>
                </path>
            </svg>`;
    },

    // =========================================================================
    // EVENT WIRING (called after render)
    // =========================================================================

    _wireEvents() {
        const pulseBtn      = document.getElementById('pulseBtn');
        const waveBtn       = document.getElementById('waveBtn');
        const adminEnergy   = document.getElementById('adminAddEnergyBtn');
        const adminWave     = document.getElementById('adminAddWaveBtn');

        if (pulseBtn) {
            pulseBtn.addEventListener('mousedown',  () => this.handleHoldStart());
            pulseBtn.addEventListener('touchstart', () => this.handleHoldStart(), { passive: true });
            pulseBtn.addEventListener('mouseup',    () => this.handleHoldEnd());
            pulseBtn.addEventListener('touchend',   () => this.handleHoldEnd());
            pulseBtn.addEventListener('mouseleave', () => this.handleHoldCancel());
        }
        if (waveBtn) {
            waveBtn.addEventListener('click', () => this.handleContributeWave());
        }
        if (adminEnergy) {
            adminEnergy.addEventListener('click', () => this.adminAddEnergy());
        }
        if (adminWave) {
            adminWave.addEventListener('click', () => this.adminAddWaveMinutes());
        }
    },

    // =========================================================================
    // CLEANUP
    // =========================================================================

    _cleanup() {
        const s = this.state;
        const intervals = ['holdInterval', 'timerInterval', 'energyDrainInterval'];
        for (const key of intervals) {
            if (s[key]) { clearInterval(s[key]); s[key] = null; }
        }
        if (this._lastSentRefreshInterval) {
            clearInterval(this._lastSentRefreshInterval);
            this._lastSentRefreshInterval = null;
        }
        s.isHolding = false;
        // isContributing intentionally preserved - session survives re-render
    },

    // =========================================================================
    // HOLD GESTURE - SEND CALM
    // =========================================================================

    handleHoldStart() {
        const s = this.state;
        if (s.lastCalmSentAt && (Date.now() - s.lastCalmSentAt) < s.COOLDOWN_MS) {
            const remaining = Math.ceil((s.COOLDOWN_MS - (Date.now() - s.lastCalmSentAt)) / 1000);
            this._toast(`Wait ${remaining}s before sending again`);
            return;
        }
        if (s.isHolding) return;

        s.isHolding    = true;
        s.holdProgress = 0;

        document.getElementById('pulseBtn')?.classList.add('holding');

        const startTime = Date.now();
        s.holdInterval = setInterval(() => {
            const elapsed  = Date.now() - startTime;
            s.holdProgress = Math.min((elapsed / s.HOLD_DURATION_MS) * 100, 100);

            const ring = document.getElementById('holdRing');
            if (ring) ring.style.strokeDashoffset = 100.5 - (s.holdProgress / 100) * 100.5;

            if (s.holdProgress >= 100) {
                clearInterval(s.holdInterval);
                s.holdInterval = null;
                s.isHolding    = false;
                this._firePulse();
            }
        }, 50);
    },

    handleHoldEnd()    { if (this.state.isHolding) this._cancelHold(); },
    handleHoldCancel() { if (this.state.isHolding) this._cancelHold(); },

    _cancelHold() {
        const s = this.state;
        if (s.holdInterval) { clearInterval(s.holdInterval); s.holdInterval = null; }
        s.isHolding    = false;
        s.holdProgress = 0;
        document.getElementById('pulseBtn')?.classList.remove('holding');
        const ring = document.getElementById('holdRing');
        if (ring) ring.style.strokeDashoffset = '100.5';
    },

    _firePulse() {
        const s = this.state;
        s.lastCalmSentAt = Date.now();
        s.calmsSentCount++;

        const btn = document.getElementById('pulseBtn');
        if (btn) {
            btn.classList.remove('holding');
            btn.classList.add('fired');
            setTimeout(() => btn.classList.remove('fired'), 1_000);
        }

        const ring = document.getElementById('holdRing');
        if (ring) ring.style.strokeDashoffset = '100.5';

        this._addEnergy(s.ENERGY_PER_PULSE);
        this._triggerFieldRipple(s.calmsSentCount);
        this._triggerAppWideRipple();
        this._broadcastPulse(s.calmsSentCount);

        s.communityPulseCount++;
        this._addSelfToRecentSenders();
        this._refreshEnergyCardMeta();
        this._toast('Energy sent');
    },

    // =========================================================================
    // ENERGY BAR - FILL & DRAIN
    // =========================================================================

    _addEnergy(amount) {
        const s = this.state;
        s.energyLevel = Math.min(s.energyLevel + amount, 100);
        this._updateEnergyBar(s.energyLevel);
    },

    _startEnergyDrainWatchdog() {
        const s = this.state;
        if (s.energyDrainInterval) clearInterval(s.energyDrainInterval);

        s.energyDrainInterval = setInterval(() => {
            if (s.energyLevel <= 0) return;

            const sinceLastSend = s.lastCalmSentAt ? Date.now() - s.lastCalmSentAt : Infinity;
            if (sinceLastSend < s.DRAIN_INACTIVITY_MS) return;

            const inactivityBeyond = sinceLastSend - s.DRAIN_INACTIVITY_MS;
            const drainTicksDue    = Math.floor(inactivityBeyond / s.DRAIN_RATE_MS);
            const alreadyDrained   = s._drainTicksApplied;

            if (drainTicksDue > alreadyDrained) {
                s._drainTicksApplied = drainTicksDue;
                s.energyLevel        = Math.max(s.energyLevel - (drainTicksDue - alreadyDrained), 0);
                this._updateEnergyBar(s.energyLevel);
            }
        }, 60_000);
    },

    _resetDrainTicks() {
        this.state._drainTicksApplied = 0;
    },

    _updateEnergyBar(level) {
        const fill  = document.getElementById('pulseFill');
        const value = document.getElementById('energyValue');
        if (fill)  { fill.style.width = `${level}%`; fill.setAttribute('aria-valuenow', level); }
        if (value) value.textContent = `${level}%`;

        const adminBtn = document.getElementById('adminEnergyBtn');
        if (adminBtn) adminBtn.style.display = Core?.state?.currentUser?.is_admin ? 'inline' : 'none';
    },

    // =========================================================================
    // WAVE - CONTRIBUTE SILENCE
    // =========================================================================

    handleContributeWave() {
        this.state.isContributing ? this._endWave() : this._startWave();
    },

    _startWave() {
        const s = this.state;
        s.isContributing       = true;
        s.contributeStartedAt  = Date.now();
        s.countedAsParticipant = false;

        document.getElementById('waveBtn')?.classList.add('in-progress');
        const label = document.getElementById('waveBtnLabel');
        if (label) label.textContent = 'End Session';

        this._updateWaveStatusLine();
        this._toast('Silence started');

        s.timerInterval = setInterval(() => this._waveTick(), 1_000);
    },

    _resumeWaveTick() {
        const s = this.state;
        document.getElementById('waveBtn')?.classList.add('in-progress');
        const label = document.getElementById('waveBtnLabel');
        if (label) label.textContent = 'End Session';
        this._updateWaveStatusLine();
        s.timerInterval = setInterval(() => this._waveTick(), 1_000);
    },

    _waveTick() {
        const s = this.state;
        if (!s.isContributing) return;

        const elapsedMs = Date.now() - s.contributeStartedAt;

        if (!s.countedAsParticipant && elapsedMs >= 5 * 60 * 1_000) {
            s.countedAsParticipant = true;
            this._incrementParticipantCount();
            this._triggerAvatarRipple();
            this._toast("You're in the wave");
        }

        this._updateWaveStatusLine(elapsedMs);
    },

    _endWave() {
        const s = this.state;
        clearInterval(s.timerInterval);
        s.timerInterval  = null;
        s.isContributing = false;

        const elapsedMs     = Date.now() - s.contributeStartedAt;
        const minutesLogged = Math.floor(elapsedMs / 60_000);

        if (s.countedAsParticipant) {
            this._decrementParticipantCount();
            s.countedAsParticipant = false;
        }

        document.getElementById('waveBtn')?.classList.remove('in-progress');
        const label = document.getElementById('waveBtnLabel');

        if (minutesLogged < 1) {
            if (label) label.textContent = 'Start Silence';
            this._toast('Sit a little longer');
            this._updateWaveStatusLine();
            return;
        }

        s.waveTotalMinutes    = Math.min(s.waveTotalMinutes + minutesLogged, s.WAVE_GOAL_MINUTES);
        s.userTodayMinutes   += minutesLogged;
        s.userAllTimeMinutes += minutesLogged;
        this._updateWaveProgress();

        if (label) label.textContent = 'Start Silence';
        this._toast(`${minutesLogged}min contributed to the wave`);

        if (s.waveTotalMinutes >= s.WAVE_GOAL_MINUTES) this._onWaveComplete();
        this._updateWaveStatusLine();

        CollectiveFieldDB?.logWaveContribution(minutesLogged, true)
            .catch(() => console.error('[CollectiveField] logWaveContribution failed'));
    },

    _onWaveComplete() {
        this._toast('The wave is complete! A new one begins tomorrow.');
    },

    _updateWaveProgress() {
        const s        = this.state;
        const progress = Math.min(Math.round((s.waveTotalMinutes / s.WAVE_GOAL_MINUTES) * 100), 100);

        const fill  = document.getElementById('waveFill');
        const value = document.getElementById('waveProgressValue');
        if (fill)  { fill.style.width = `${progress}%`; fill.setAttribute('aria-valuenow', progress); }
        if (value) value.textContent = `${progress}%`;

        const adminWaveBtn = document.getElementById('adminWaveBtn');
        if (adminWaveBtn) adminWaveBtn.style.display = Core?.state?.currentUser?.is_admin ? 'inline' : 'none';
    },

    _updateWaveStatusLine(elapsedMs) {
        const s               = this.state;
        const sessionClock    = document.getElementById('waveSessionClock');
        const countUp         = document.getElementById('waveCountUp');
        const collectiveBlock = document.getElementById('waveCollectiveTime');
        const clockDisplay    = document.getElementById('waveClockDisplay');
        const contribBlock    = document.getElementById('waveContribBlock');
        if (!clockDisplay) return;

        const remainingMinutes = Math.max(s.WAVE_GOAL_MINUTES - s.waveTotalMinutes, 0);
        const remainingHrs     = Math.floor(remainingMinutes / 60);
        const remainingMins    = remainingMinutes % 60;
        clockDisplay.textContent = remainingHrs > 0 ? `${remainingHrs}h ${remainingMins}m` : `${remainingMins}m`;

        if (elapsedMs !== undefined && s.isContributing) {
            const givenMins = Math.floor(elapsedMs / 60_000);
            const givenSecs = Math.floor((elapsedMs % 60_000) / 1_000);
            if (countUp) countUp.textContent = `${String(givenMins).padStart(2, '0')}:${String(givenSecs).padStart(2, '0')}`;

            if (sessionClock)    { sessionClock.style.maxHeight = '60px'; sessionClock.style.opacity = '1'; sessionClock.style.marginBottom = '8px'; }
            if (collectiveBlock) { collectiveBlock.style.fontSize = '13px'; collectiveBlock.style.opacity = '0.45'; collectiveBlock.style.marginTop = '2px'; }
            if (contribBlock)    contribBlock.style.opacity = '0.5';
        } else {
            if (sessionClock)    { sessionClock.style.maxHeight = '0'; sessionClock.style.opacity = '0'; sessionClock.style.marginBottom = '0'; }
            if (collectiveBlock) { collectiveBlock.style.fontSize = ''; collectiveBlock.style.opacity = '1'; collectiveBlock.style.marginTop = ''; }
            if (contribBlock)    contribBlock.style.opacity = '1';

            const todayEl   = document.getElementById('userTodayDisplay');
            const allTimeEl = document.getElementById('userAllTimeDisplay');
            if (todayEl)   todayEl.textContent   = `${s.userTodayMinutes}m`;
            if (allTimeEl) allTimeEl.textContent  = `${s.userAllTimeMinutes}m`;
        }
    },

    // =========================================================================
    // RIPPLE ANIMATIONS
    // =========================================================================

    _triggerFieldRipple(sendCount) {
        const svg = document.querySelector('.energy-card svg');
        if (!svg) return;

        const intensity = Math.max(1 - (sendCount - 1) * 0.2, 0.2);
        const ripple    = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        Object.entries({ cx: '50', cy: '50', r: '10', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' })
            .forEach(([k, v]) => ripple.setAttribute(k, v));
        ripple.style.cssText = `opacity:${intensity};transition:r 1s ease-out,opacity 1s ease-out;`;
        svg.appendChild(ripple);

        requestAnimationFrame(() => requestAnimationFrame(() => {
            ripple.style.opacity = '0';
            ripple.setAttribute('r', '48');
        }));
        setTimeout(() => ripple.remove(), 1_100);
    },

    _triggerAppWideRipple() {
        if (!document.getElementById('appRippleStyles')) {
            const style = document.createElement('style');
            style.id = 'appRippleStyles';
            style.textContent = `
                @keyframes waterRipple  { 0%{width:0;height:0;opacity:0.8;box-shadow:0 0 0 0 rgba(90,180,160,0.3)} 30%{opacity:0.6;box-shadow:0 0 24px 8px rgba(90,180,160,0.15)} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0;box-shadow:0 0 0 0 rgba(90,180,160,0)} }
                @keyframes waterRipple2 { 0%{width:0;height:0;opacity:0} 15%{opacity:0.5} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                @keyframes waterRipple3 { 0%{width:0;height:0;opacity:0} 25%{opacity:0.3} 100%{width:var(--ripple-size);height:var(--ripple-size);opacity:0} }
                #appRippleOverlay { position:fixed;inset:0;pointer-events:none;z-index:99999;overflow:visible; }
                .app-wide-ripple  { position:absolute;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);will-change:width,height,opacity; }
                .app-wide-ripple.ring-1 { border:4px solid rgba(90,180,160,0.85);background:rgba(90,180,160,0.06);animation:waterRipple  2.6s cubic-bezier(0.1,0.4,0.3,1) forwards; }
                .app-wide-ripple.ring-2 { border:2.5px solid rgba(90,180,160,0.5);background:transparent;animation:waterRipple2 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.3s forwards; }
                .app-wide-ripple.ring-3 { border:1.5px solid rgba(90,180,160,0.3);background:transparent;animation:waterRipple3 2.6s cubic-bezier(0.1,0.4,0.3,1) 0.6s forwards; }
            `;
            document.head.appendChild(style);
        }

        let overlay = document.getElementById('appRippleOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'appRippleOverlay';
            document.body.appendChild(overlay);
        }

        const card    = document.querySelector('.energy-card');
        const rect    = card ? card.getBoundingClientRect() : null;
        const originX = rect ? rect.left + rect.width  / 2 : window.innerWidth  / 2;
        const originY = rect ? rect.top  + rect.height / 2 : window.innerHeight / 2;
        const size    = Math.hypot(window.innerWidth, window.innerHeight) * 2.2;

        ['ring-1', 'ring-2', 'ring-3'].forEach((cls, i) => {
            const ripple = document.createElement('div');
            ripple.className = `app-wide-ripple ${cls}`;
            ripple.style.cssText = `--ripple-size:${size}px;left:${originX}px;top:${originY}px;`;
            overlay.appendChild(ripple);
            setTimeout(() => ripple.remove(), 3_400 + i * 300);
        });
    },

    _triggerAvatarRipple() {
        if (!document.getElementById('waveRippleStyles')) {
            const style = document.createElement('style');
            style.id = 'waveRippleStyles';
            style.textContent = `
                @keyframes waveFloat {
                    0%   { transform:translateY(0) scale(1);    opacity:0; }
                    15%  { opacity:1; }
                    80%  { opacity:0.9; }
                    100% { transform:translateY(-90px) scale(0.7); opacity:0; }
                }
                .wave-avatar-ripple {
                    position:absolute;bottom:10px;width:32px;height:32px;border-radius:50%;
                    object-fit:cover;animation:waveFloat 2.8s ease-out forwards;
                    pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,0.15);
                    border:2px solid rgba(255,255,255,0.6);font-size:20px;
                    display:flex;align-items:center;justify-content:center;
                    background:var(--bg-card,#f0ece6);
                }
            `;
            document.head.appendChild(style);
        }

        const stage = document.getElementById('waveRippleStage');
        if (!stage) return;

        const user      = Core?.state?.currentUser;
        const avatarUrl = user?.avatar_url || null;
        const emoji     = user?.emoji || '🧘';
        const leftPx    = Math.floor(Math.random() * ((stage.offsetWidth || 80) - 36)) + 2;

        let el;
        if (avatarUrl) {
            el = document.createElement('img');
            el.src = avatarUrl;
            el.alt = '';
            el.className = 'wave-avatar-ripple';
            el.onerror = () => el.replaceWith(this._makeEmojiRipple(emoji, leftPx));
        } else {
            el = this._makeEmojiRipple(emoji, leftPx);
        }

        el.style.left = `${leftPx}px`;
        stage.appendChild(el);
        setTimeout(() => el.remove(), 3_000);
    },

    _makeEmojiRipple(emoji, leftPx) {
        const span = document.createElement('span');
        span.textContent = emoji;
        span.className   = 'wave-avatar-ripple';
        span.style.cssText = `left:${leftPx}px;line-height:28px;text-align:center;`;
        return span;
    },

    // =========================================================================
    // PARTICIPANT COUNTER
    // =========================================================================

    _incrementParticipantCount() {
        const el = document.getElementById('waveParticipants');
        if (el) el.textContent = (parseInt(el.textContent || '0', 10) || 0) + 1;
    },

    _decrementParticipantCount() {
        const el = document.getElementById('waveParticipants');
        if (el) el.textContent = Math.max((parseInt(el.textContent || '0', 10) || 0) - 1, 0);
    },

    // =========================================================================
    // BROADCAST / RECEIVE
    // =========================================================================

    _broadcastPulse() {
        CollectiveFieldDB?.recordPulse()
            .catch(() => console.error('[CollectiveField] recordPulse failed'));
    },

    receiveExternalPulse(payload) {
        const intensity = Math.min(payload.intensity || 0.6, 0.8);
        this._triggerFieldRipple(Math.round((1 - intensity) / 0.2) + 1);
    },

    // =========================================================================
    // ENERGY CARD META
    // =========================================================================

    _refreshEnergyCardMeta() {
        const s = this.state;
        const labelEl = document.getElementById('fieldStateLabel');
        const lastEl  = document.getElementById('lastSentLabel');
        const countEl = document.getElementById('communityPulseCount');
        const strip   = document.getElementById('recentSendersStrip');

        if (labelEl) labelEl.innerHTML   = this._getFieldLabel(s.energyLevel);
        if (lastEl)  lastEl.textContent  = this._getLastSentLabel();
        if (countEl) countEl.textContent = s.communityPulseCount;
        if (strip)   strip.innerHTML     = this._buildRecentSendersHTML();
    },

    _addSelfToRecentSenders() {
        const user = Core?.state?.currentUser;
        this.state.recentSenders = [
            { emoji: user?.emoji || '🧘', avatarUrl: user?.avatar_url || null },
            ...this.state.recentSenders,
        ].slice(0, 5);
    },

    _getFieldLabel(level) {
        const entry = this._FIELD_LABELS.find(l => level >= l.min) || this._FIELD_LABELS[this._FIELD_LABELS.length - 1];
        // Safe: text is from frozen constant array, not user data
        return `<span style="display:inline-flex;align-items:center;gap:5px;opacity:0.75;">${entry.text}</span>`;
    },

    _getLastSentLabel() {
        const last = this.state.lastCalmSentAt;
        if (!last) return 'Not sent yet';
        const secs = Math.floor((Date.now() - last) / 1_000);
        if (secs < 60)  return `Sent ${secs}s ago`;
        const mins = Math.floor(secs / 60);
        if (mins < 60)  return `Sent ${mins}m ago`;
        return `Sent ${Math.floor(mins / 60)}h ago`;
    },

    _buildRecentSendersHTML() {
        const senders = this.state.recentSenders;
        if (!senders.length) return '<span style="font-size:11px;color:var(--text-muted);font-style:italic;">No one yet - be first</span>';
        return senders.slice(0, 5).map(s => {
            if (s.avatarUrl) {
                // avatarUrl comes from Supabase profiles — safe for img src, not injected as HTML attribute string
                const img = document.createElement('img');
                img.src = s.avatarUrl;
                img.alt = '';
                img.width = 26;
                img.height = 26;
                img.loading = 'lazy';
                img.decoding = 'async';
                img.style.cssText = 'width:26px;height:26px;border-radius:50%;object-fit:cover;border:1.5px solid var(--border-subtle,rgba(0,0,0,0.1));';
                const wrapper = document.createElement('span');
                wrapper.appendChild(img);
                return wrapper.innerHTML;
            }
            const span = document.createElement('span');
            span.style.cssText = 'font-size:20px;line-height:26px;';
            span.title = 'Recent sender';
            span.textContent = s.emoji || '🧘';
            return span.outerHTML;
        }).join('');
    },

    // =========================================================================
    // PUBLIC UPDATES - called by Supabase / external modules
    // =========================================================================

    updatePresenceCount(count) {
        if (typeof count !== 'number' || count < 0) return;
        const el = document.getElementById('presenceCount');
        if (el) el.textContent = count;
    },

    updateEnergyLevel(level) {
        if (typeof level !== 'number' || level < 0 || level > 100) return;
        this.state.energyLevel = level;
        this._updateEnergyBar(level);
    },

    updateCommunityPulseCount(count) {
        this.state.communityPulseCount = count || 0;
        const el = document.getElementById('communityPulseCount');
        if (el) el.textContent = this.state.communityPulseCount;
    },

    updateRecentSenders(senders) {
        this.state.recentSenders = senders || [];
        const strip = document.getElementById('recentSendersStrip');
        if (strip) strip.innerHTML = this._buildRecentSendersHTML();
    },

    updateUserContribution(todayMinutes, allTimeMinutes) {
        this.state.userTodayMinutes   = todayMinutes   || 0;
        this.state.userAllTimeMinutes = allTimeMinutes || 0;
        if (!this.state.isContributing) this._updateWaveStatusLine();
    },

    updateWaveParticipants(count) {
        this.config.DEFAULT_WAVE_PARTICIPANTS = count || 0;
        const el = document.getElementById('waveParticipants');
        if (el) el.textContent = count || 0;
    },

    updateWaveTotalMinutes(totalMinutes) {
        if (typeof totalMinutes !== 'number' || totalMinutes < 0) return;
        this.state.waveTotalMinutes = Math.min(totalMinutes, this.state.WAVE_GOAL_MINUTES);
        this._updateWaveProgress();
        if (!this.state.isContributing) this._updateWaveStatusLine();
    },

    refresh() {
        try { this.render(); }
        catch { console.error('[CollectiveField] refresh error'); }
    },

    // =========================================================================
    // ADMIN
    // =========================================================================

    injectAdminUI() {
        const isAdmin   = Core?.state?.currentUser?.is_admin === true;
        const energyBtn = document.getElementById('adminEnergyBtn');
        const waveBtn   = document.getElementById('adminWaveBtn');
        if (energyBtn) energyBtn.style.display = isAdmin ? 'inline' : 'none';
        if (waveBtn)   waveBtn.style.display   = isAdmin ? 'inline' : 'none';
    },

    async adminAddEnergy() {
        if (!Core?.state?.currentUser?.is_admin) return;
        try {
            const sb = window.AppSupabase || window.CommunitySupabase;
            const { error } = await sb.rpc('increment_field_pulse', {
                p_date:       new Date().toISOString().slice(0, 10),
                p_energy_add: 10,
            });
            if (error) throw error;
            await window.CollectiveFieldDB.loadFieldState();
            this._toast('+10 Energy added');
        } catch {
            console.error('[CollectiveField] adminAddEnergy failed');
            this._toast('Could not add energy');
        }
    },

    async adminAddWaveMinutes() {
        if (!Core?.state?.currentUser?.is_admin) return;
        try {
            await window.CollectiveFieldDB.logWaveContribution(60, false);
            this._toast('+60 min added to Wave');
        } catch {
            console.error('[CollectiveField] adminAddWaveMinutes failed');
            this._toast('Could not add wave minutes');
        }
    },

    // =========================================================================
    // UTILITY
    // =========================================================================

    _toast(message) {
        Core?.showToast(message);
    },
};

// =========================================================================
// BOOTSTRAP
// =========================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CollectiveField.render());
} else {
    CollectiveField.render();
}

// bfcache compatible: pagehide instead of (only) beforeunload
window.addEventListener('pagehide',     () => CollectiveField._cleanup());
window.addEventListener('beforeunload', () => CollectiveField._cleanup());

window.CollectiveField = CollectiveField;

export { CollectiveField };
