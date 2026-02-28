/**
 * LUNAR-CORE.JS v3.0
 * Base class for all lunar phase practice rooms.
 *
 * KEY CHANGES v3:
 * - Removed duplicate _escapeHtml (delegates to LunarConfig._escapeHtml)
 * - Merged two separate click handlers in _attachEventListeners into one
 * - Practice cards now have tabIndex + keydown for keyboard accessibility
 * - _bindMethods: only binds methods that actually exist (safe for subclasses)
 * - saveUserWeekData: guards against stale debounce after cleanup()
 * - submitClosure: saves reflection before reset
 * - Minor: used numeric separators for readability (86_400_000 etc.)
 */

class LunarRoom {

    static CONSTANTS = {
        MEDITATION_DURATION:    180,
        WITNESSING_DURATION:    120,
        SAVE_DEBOUNCE_MS:       500,
        MAX_INTENTION_LENGTH:   500,
        MAX_AFFIRMATION_LENGTH: 300,
        MAX_RELEASE_LIST_LENGTH:1000,
        MAX_WORD_LENGTH:        50,
        TIMER_INTERVAL_MS:      1000,
        LUNAR_CYCLE_DAYS:       29.53,
        MS_PER_DAY:             86_400_000
    };

    constructor(phaseConfig) {
        if (!phaseConfig) throw new Error('LunarRoom: phaseConfig is required');

        this.config            = phaseConfig;
        this.isActive          = false;
        this.currentPractice   = null;
        this.collectiveTimer   = null;
        this.collectiveWords   = null;
        this.saveDebounceTimer = null;
        this._retryCheckTimeout= null;
        this._hasLoggedWaiting = false;
        this.eventListeners    = [];
        this.userWeekData      = this._getDefaultUserData();
        this.weekStartDate     = null;
        this.weekEndDate       = null;
        this.domCache          = { dynamicContent: null, popup: null };

        this._bindMethods();
    }

    // ── Defaults & binding ───────────────────────────────────────────────────────

    _getDefaultUserData() {
        return {
            seedAffirmation: null, practiceCount: 0,
            journalEntries: [], emotionalEchoes: [],
            intentionShared: false, privateIntention: '',
            collectiveWord: '', intention: '', affirmation: '', releaseList: ''
        };
    }

    _bindMethods() {
        [
            'init', 'enterRoom', 'renderRoomDashboard', 'switchMode',
            'showPracticePopup', 'showCollectiveIntentionPopup',
            'startCollectiveStep2', 'startCollectiveStep3', 'startCollectiveStep4',
            'startCollectiveStep5', 'startMeditationTimer', 'startWitnessingTimer',
            'submitWordToCollective', 'completeCollectivePractice',
            'closeCollectivePopup', 'closePracticePopup', 'saveIntentionPractice',
            'submitClosure', 'showLockedMessage', 'enterGroupCircle', 'leaveRoom',
            '_handlePopupClick', '_clearTimer'
        ].forEach(m => { if (typeof this[m] === 'function') this[m] = this[m].bind(this); });
    }

    // ── Init ─────────────────────────────────────────────────────────────────────

    init() {
        try {
            console.log(`🌙 ${this.config.name} Room Loaded`);
            this.checkIfWeekActive();
            LunarUI.injectStyles(this.config.cssPrefix);
        } catch (e) {
            console.error(`${this.config.name} init error:`, e);
        }
    }

    checkIfWeekActive() {
        try {
            if (!window.LunarEngine?.currentMoonData) {
                if (!this._hasLoggedWaiting) {
                    console.log(`⏳ ${this.config.name}: Waiting for LunarEngine...`);
                    this._hasLoggedWaiting = true;
                }
                if (!this._retryCheckTimeout) {
                    this._retryCheckTimeout = setTimeout(() => {
                        this._retryCheckTimeout = null;
                        this.checkIfWeekActive();
                    }, 500);
                }
                return;
            }

            const isAdmin = window.Core?.state?.currentUser?.is_admin === true;
            if (isAdmin) {
                console.log(`🛡️ ADMIN: ${this.config.name} force-enabled`);
                this.isActive = true;
                this.calculateWeekDates();
                this.loadUserWeekData();
                return;
            }

            const phase = window.LunarEngine.currentMoonData.phase;
            this.isActive = this.config.phaseRanges.some(([lo, hi]) => phase >= lo && phase <= hi);

            if (this.isActive) {
                this.calculateWeekDates();
                this.loadUserWeekData();
            }
        } catch (e) {
            console.error('checkIfWeekActive error:', e);
            this.isActive = false;
        }
    }

    calculateWeekDates() {
        try {
            const moonData = window.LunarEngine?.currentMoonData;
            if (!moonData) { console.error('No moon data'); return; }

            const { phase, age } = moonData;
            const C = LunarRoom.CONSTANTS;
            const now           = new Date();
            const lastNewMoon   = new Date(now - age * C.MS_PER_DAY);

            let range = this.config.phaseRanges.find(([lo, hi]) => phase >= lo && phase <= hi);

            if (!range) {
                const isAdmin = window.Core?.state?.currentUser?.is_admin === true;
                range = isAdmin ? this.config.phaseRanges[0] : null;
                if (!range) { this._calculateNextOccurrence(phase, age); return; }
            }

            this.weekStartDate = new Date(lastNewMoon.getTime() + range[0] * C.LUNAR_CYCLE_DAYS * C.MS_PER_DAY);
            this.weekEndDate   = new Date(lastNewMoon.getTime() + range[1] * C.LUNAR_CYCLE_DAYS * C.MS_PER_DAY);
        } catch (e) {
            console.error('calculateWeekDates error:', e);
        }
    }

    _calculateNextOccurrence(currentPhase, age) {
        try {
            const C           = LunarRoom.CONSTANTS;
            const now         = new Date();
            const lastNewMoon = new Date(now - age * C.MS_PER_DAY);
            const [lo, hi]    = this.config.phaseRanges[0];
            const origin      = currentPhase < lo
                ? lastNewMoon
                : new Date(lastNewMoon.getTime() + C.LUNAR_CYCLE_DAYS * C.MS_PER_DAY);

            this.weekStartDate = new Date(origin.getTime() + lo * C.LUNAR_CYCLE_DAYS * C.MS_PER_DAY);
            this.weekEndDate   = new Date(origin.getTime() + hi * C.LUNAR_CYCLE_DAYS * C.MS_PER_DAY);
        } catch (e) {
            console.error('_calculateNextOccurrence error:', e);
        }
    }

    getDaysRemaining() {
        if (!this.weekEndDate) return 0;
        return Math.max(0, Math.ceil((this.weekEndDate - new Date()) / LunarRoom.CONSTANTS.MS_PER_DAY));
    }

    shouldShowClosure() {
        const d = this.getDaysRemaining();
        return d > 0 && d <= 2;
    }

    // ── Persistence ──────────────────────────────────────────────────────────────

    loadUserWeekData() {
        try {
            const raw = localStorage.getItem(this.config.storageKey);
            if (raw) this.userWeekData = { ...this.userWeekData, ...JSON.parse(raw) };
        } catch (e) {
            console.error('loadUserWeekData error:', e);
        }
    }

    saveUserWeekData(immediate = false) {
        if (immediate) { this._performSave(); return; }
        clearTimeout(this.saveDebounceTimer);
        this.saveDebounceTimer = setTimeout(() => this._performSave(), LunarRoom.CONSTANTS.SAVE_DEBOUNCE_MS);
    }

    _performSave() {
        try {
            localStorage.setItem(this.config.storageKey, JSON.stringify(this.userWeekData));
        } catch (e) {
            console.error('_performSave error:', e);
            window.Core?.showToast('Failed to save data');
        }
    }

    // ── Validation & sanitization ────────────────────────────────────────────────

    _sanitizeInput(input) {
        return typeof input === 'string' ? input.replace(/<[^>]*>/g, '').trim() : '';
    }

    _validateIntention(v) {
        const C = LunarRoom.CONSTANTS;
        if (!v?.trim()) return { valid: false, error: 'Intention cannot be empty' };
        if (v.length > C.MAX_INTENTION_LENGTH)
            return { valid: false, error: `Intention must be under ${C.MAX_INTENTION_LENGTH} characters` };
        return { valid: true };
    }

    _validateAffirmation(v) {
        const C = LunarRoom.CONSTANTS;
        if (!v?.trim()) return { valid: false, error: 'Affirmation cannot be empty' };
        if (v.length > C.MAX_AFFIRMATION_LENGTH)
            return { valid: false, error: `Affirmation must be under ${C.MAX_AFFIRMATION_LENGTH} characters` };
        return { valid: true };
    }

    _validateCollectiveWord(v) {
        if (!v?.trim()) return { valid: false, error: 'Word cannot be empty' };
        if (v.length > LunarRoom.CONSTANTS.MAX_WORD_LENGTH)
            return { valid: false, error: `Word must be under ${LunarRoom.CONSTANTS.MAX_WORD_LENGTH} characters` };
        if (v.trim().includes(' ')) return { valid: false, error: 'Please enter only one word' };
        return { valid: true };
    }

    // ── Navigation ───────────────────────────────────────────────────────────────

    enterRoom() {
        try {
            const isAdmin = window.Core?.state?.currentUser?.is_admin === true;
            if (!this.isActive && !isAdmin) {
                window.Core?.showToast(`${this.config.emoji} ${this.config.name} room opens during the ${this.config.name} phase`);
                return;
            }

            window.Core?.navigateTo('practiceRoomView');
            window.PracticeRoom?.stopHubPresence?.();
            window.currentLunarRoom = this;
            this.renderRoomDashboard();
            this._setPresence();
            this._loadCollectiveWords();
            setTimeout(() => this._refreshLivePresence(), 300);
        } catch (e) {
            console.error('enterRoom error:', e);
            window.Core?.showToast('Failed to enter room');
        }
    }

    leaveRoom() {
        try {
            this._clearPresence();
            ['_presenceSub', '_collectiveWordsSub'].forEach(k => {
                if (this[k]) { try { this[k].unsubscribe(); } catch (_) {} this[k] = null; }
            });
            this._clearTimer();
            this._removeEventListeners();
            window.currentLunarRoom = null;
            window.PracticeRoom?.startHubPresence?.();
            window.Core?.navigateTo('hubView');
        } catch (e) {
            console.error('leaveRoom error:', e);
        }
    }

    // ── Dashboard ────────────────────────────────────────────────────────────────

    renderRoomDashboard() {
        try {
            const container = this.domCache.dynamicContent ??= document.getElementById('dynamicRoomContent');
            if (!container) { console.error('dynamicRoomContent not found'); return; }

            const now              = new Date();
            const daysRemaining    = this.getDaysRemaining();
            const daysUntilStart   = Math.ceil((this.weekStartDate - now) / LunarRoom.CONSTANTS.MS_PER_DAY);
            const presenceCount    = this.getLivingPresenceCount();
            const daysText         = this.isActive
                ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`
                : `${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'} until ${this.config.name}`;

            container.innerHTML = `
                <div class="lunar-room-bg">
                    <div class="${this.config.cssPrefix}-starfield lunar-starfield">
                        ${LunarUI.generateStarfield()}
                    </div>
                    ${LunarUI.renderTopBar({ emoji: this.config.emoji, name: this.config.name, daysText, livingPresenceCount: presenceCount, cssPrefix: this.config.cssPrefix })}
                    <div class="${this.config.cssPrefix}-content-wrapper lunar-content-wrapper">
                        ${LunarUI.renderMoonVisual({ cssPrefix: this.config.cssPrefix, sphereClass: `${this.config.cssPrefix}-moon-sphere`, glowClass: `${this.config.cssPrefix}-moon-glow` })}
                        ${LunarUI.renderIntroCard({ imageUrl: this.config.imageUrl, description: this.config.description })}
                        ${LunarUI.renderModeToggle({ cssPrefix: this.config.cssPrefix, globalName: this.config.globalName })}
                        <div class="lunar-practice-mode active" data-mode="solo">${this._renderSoloPracticeMode()}</div>
                        <div class="lunar-practice-mode" data-mode="group">${this._renderGroupCircleMode(presenceCount)}</div>
                        ${this._renderClosureSection()}
                        <div class="lunar-wisdom-section">${LunarUI.renderWisdomText(this.config.wisdomQuote)}</div>
                    </div>
                </div>`;

            this._attachEventListeners(container);
        } catch (e) {
            console.error('renderRoomDashboard error:', e);
        }
    }

    _renderSoloPracticeMode() {
        const hasCompleted = !!(this.userWeekData.intention || this.userWeekData.affirmation);
        return `
            <div class="lunar-mode-description">
                <h3>Your Sacred Space</h3>
                <p>${this.config.modeDescription || 'Individual practices for this lunar phase'}</p>
            </div>
            <div class="lunar-practices-section">
                <div class="lunar-practices-grid">${this._renderPracticeCards()}</div>
            </div>
            ${hasCompleted ? this._renderSavedInputs() : ''}`;
    }

    _renderPracticeCards() {
        const entries       = Object.entries(this.config.practices);
        const firstKey      = entries[0]?.[0];
        const hasCompleted  = !!(this.userWeekData.intention || this.userWeekData.affirmation);

        return entries.map(([key, p]) => {
            const isLocked = key === firstKey && hasCompleted;
            return `
                <div class="lunar-practice-card ${this.config.cssPrefix}-practice-card${isLocked ? ' locked' : ''}"
                     data-practice="${key}" data-locked="${isLocked}"
                     tabindex="0" role="button"
                     aria-label="${p.title}${isLocked ? ' — Complete' : ''}">
                    <div class="lunar-practice-icon" style="color:${p.color};">${p.icon}</div>
                    <div class="lunar-practice-info">
                        <h4>${p.title}</h4>
                        <p>${p.description}</p>
                    </div>
                    ${isLocked ? '<div class="lunar-lock-badge">✓ Complete</div>' : ''}
                </div>`;
        }).join('');
    }

    _renderSavedInputs() {
        const { intention, affirmation, releaseList } = this.userWeekData;
        const L = this.config.savedInputLabels;
        const esc = t => LunarConfig._escapeHtml(t);

        return `
            <div class="lunar-saved-inputs">
                <h3>${L.title}</h3>
                ${intention   ? `<div class="lunar-saved-item"><div class="lunar-saved-label">${L.intention}</div><div class="lunar-saved-text">${esc(intention)}</div></div>` : ''}
                ${affirmation ? `<div class="lunar-saved-item"><div class="lunar-saved-label">${L.affirmation}</div><div class="lunar-saved-text">${esc(affirmation)}</div></div>` : ''}
                ${releaseList ? `<div class="lunar-saved-item"><div class="lunar-saved-label">${L.releaseList}</div><div class="lunar-saved-text">${esc(releaseList).replace(/\n/g, '<br>')}</div></div>` : ''}
                <div class="lunar-saved-footer">${L.footer}</div>
            </div>`;
    }

    _renderGroupCircleMode(presenceCount) {
        return `
            <div class="lunar-group-intro">
                <h3>Group Intention Circle</h3>
                <p>Join others in ${this.config.collectiveFocus}. Together we create ${this.config.collectiveNoun}.</p>
                <div class="lunar-live-presence">
                    <div class="lunar-pulse-dot"></div>
                    <span>${presenceCount} members in circle</span>
                </div>
                <div class="lunar-group-avatars">${LunarUI.renderMockAvatars(presenceCount)}</div>
                <button class="lunar-join-circle-btn" data-action="enter-group-circle">Enter the Circle</button>
            </div>`;
    }

    _renderClosureSection() {
        if (!this.shouldShowClosure()) return '';
        const C = LunarRoom.CONSTANTS;
        return `
            <div class="lunar-closure-section">
                <h3>${this.config.closureTitle}</h3>
                <p>${this.config.closureDescription}</p>
                <textarea id="closureReflection" class="lunar-textarea-large"
                    placeholder="${this.config.closurePlaceholder}"
                    maxlength="${C.MAX_INTENTION_LENGTH}"></textarea>
                <button class="lunar-popup-btn" data-action="submit-closure">
                    ${this.config.closureButton}
                </button>
            </div>`;
    }

    // ── Events ───────────────────────────────────────────────────────────────────

    _attachEventListeners(container) {
        this._removeEventListeners();

        const handler = (e) => {
            // Practice cards (click or keyboard)
            const card = e.target.closest('.lunar-practice-card');
            if (card && (e.type === 'click' || e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                card.dataset.locked === 'true'
                    ? this.showLockedMessage()
                    : this.showPracticePopup(card.dataset.practice);
                return;
            }

            // Data-action buttons
            if (e.type !== 'click') return;
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            switch (btn.dataset.action) {
                case 'switch-mode':       this.switchMode(btn.dataset.mode); break;
                case 'enter-group-circle':this.enterGroupCircle();           break;
                case 'submit-closure':    this.submitClosure();              break;
                case 'back-to-hub':
                    window.Rituals ? Rituals.showClosing() : this.leaveRoom();
                    break;
            }
        };

        container.addEventListener('click',   handler);
        container.addEventListener('keydown', handler);
        this.eventListeners.push(
            { element: container, type: 'click',   handler },
            { element: container, type: 'keydown', handler }
        );
    }

    _removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => element?.removeEventListener(type, handler));
        this.eventListeners = [];
    }

    switchMode(mode) {
        document.querySelectorAll('.lunar-practice-mode').forEach(el =>
            el.classList.toggle('active', el.dataset.mode === mode));
        document.querySelectorAll('.lunar-mode-btn').forEach(btn =>
            btn.classList.toggle('active', btn.dataset.mode === mode));
    }

    // ── Practice popups ──────────────────────────────────────────────────────────

    showPracticePopup(practiceKey) {
        try {
            const practice = this.config.practices[practiceKey];
            if (!practice) { console.error(`Practice not found: ${practiceKey}`); return; }

            this.currentPractice = practiceKey;
            const isFirstPractice = practiceKey === Object.keys(this.config.practices)[0];

            const popup = LunarUI.createPopup({
                icon: practice.icon, title: practice.title, subtitle: practice.description,
                content: this.getPracticeContent(practiceKey),
                cssPrefix: this.config.cssPrefix,
                hasFooter: !isFirstPractice,
                onClose: () => this.closePracticePopup()
            });

            (document.getElementById('communityHubFullscreenContainer') ?? document.body).appendChild(popup);
            this.domCache.popup = popup;
            this._attachPopupListeners(popup, practiceKey);
        } catch (e) {
            console.error('showPracticePopup error:', e);
        }
    }

    _attachPopupListeners(popup, practiceKey) {
        popup.querySelectorAll('[data-action="close-popup"]').forEach(btn =>
            btn.addEventListener('click', this.closePracticePopup));
        popup.addEventListener('click', this._handlePopupClick);

        if (practiceKey === Object.keys(this.config.practices)[0]) {
            popup.querySelector('[data-action="save-practice"]')?.addEventListener('click', this.saveIntentionPractice);
            popup.querySelectorAll('[data-affirmation]').forEach(btn =>
                btn.addEventListener('click', () => {
                    const ta = popup.querySelector('#affirmationText');
                    if (ta) ta.value = btn.dataset.affirmation;
                })
            );
        }
    }

    _handlePopupClick(e) {
        if (e.target === e.currentTarget) this.closePracticePopup();
    }

    getPracticeContent(practiceKey) {
        try {
            const getter = this.config.practiceContent[practiceKey];
            if (getter) return getter(this.userWeekData, this.config.prebuiltAffirmations);
            return `<div class="lunar-popup-section"><h3>Practice</h3><p>${this.config.practices[practiceKey].description}</p></div>`;
        } catch (e) {
            console.error('getPracticeContent error:', e);
            return '<p>Error loading practice content</p>';
        }
    }

    closePracticePopup() {
        const popup = this.domCache.popup ?? document.querySelector('.lunar-practice-popup');
        if (popup) { popup.remove(); this.domCache.popup = null; }
    }

    saveIntentionPractice() {
        try {
            const intentionEl    = document.getElementById('intentionText');
            const affirmationEl  = document.getElementById('affirmationText');
            const releaseListEl  = document.getElementById('releaseListText');

            if (!intentionEl || !affirmationEl || !releaseListEl) {
                console.error('Form elements not found'); return;
            }

            const intention   = this._sanitizeInput(intentionEl.value);
            const affirmation = this._sanitizeInput(affirmationEl.value);
            const releaseList = this._sanitizeInput(releaseListEl.value);

            const iv = this._validateIntention(intention);
            if (!iv.valid) { window.Core?.showToast(iv.error); return; }

            const av = this._validateAffirmation(affirmation);
            if (!av.valid) { window.Core?.showToast(av.error); return; }

            Object.assign(this.userWeekData, { intention, affirmation, releaseList });
            this.userWeekData.practiceCount++;
            this.saveUserWeekData(true);
            window.Core?.showToast('✅ Practice saved');
            this.closePracticePopup();
            this.renderRoomDashboard();
        } catch (e) {
            console.error('saveIntentionPractice error:', e);
            window.Core?.showToast('Failed to save practice');
        }
    }

    showLockedMessage() {
        window.Core?.showToast('✓ Practice completed for this cycle');
    }

    // ── Collective intention ─────────────────────────────────────────────────────

    showCollectiveIntentionPopup() {
        try {
            const popup = LunarUI.createPopup({
                icon: '🌙', title: 'Collective Intention Circle',
                subtitle: `Join others in ${this.config.collectiveFocus}`,
                content: this._getCollectiveStep1Content(),
                cssPrefix: this.config.cssPrefix, hasFooter: false,
                onClose: () => this.closeCollectivePopup()
            });

            (document.getElementById('communityHubFullscreenContainer') ?? document.body).appendChild(popup);
            this.domCache.popup = popup;
            popup.querySelector('[data-action="begin-collective"]')?.addEventListener('click', this.startCollectiveStep2);
            popup.addEventListener('click', this._handlePopupClick);
        } catch (e) {
            console.error('showCollectiveIntentionPopup error:', e);
        }
    }

    _getCollectiveStep1Content() {
        return `
            <div class="lunar-popup-section" style="text-align:center;">
                <p>This practice creates space for collective intention.</p>
                <p>You will be guided through 5 steps:</p>
                <ol style="text-align:left;max-width:500px;margin:2rem auto;">
                    <li>Silent meditation (3 minutes)</li>
                    <li>Write your private intention</li>
                    <li>Choose one word for the collective</li>
                    <li>Silent witnessing (2 minutes)</li>
                    <li>Complete the practice</li>
                </ol>
                <button class="lunar-popup-btn" data-action="begin-collective">Begin Practice</button>
            </div>`;
    }

    startCollectiveStep2() {
        const content = document.getElementById('collectiveIntentionContent');
        if (!content) return;
        content.innerHTML = `
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 1: Silent Meditation</h3>
                <p>Take 3 minutes to center yourself before setting your intention.</p>
                <div id="meditationTimer" class="lunar-timer-display">3:00</div>
                <button id="startMeditationBtn" class="lunar-popup-btn" data-action="start-meditation">Begin Meditation</button>
                <button id="skipToIntentionBtn" class="lunar-popup-btn lunar-btn-secondary" data-action="skip-meditation" style="display:none;">Continue to Intention</button>
            </div>`;
        content.querySelector('[data-action="start-meditation"]')?.addEventListener('click', this.startMeditationTimer);
        content.querySelector('[data-action="skip-meditation"]')?.addEventListener('click',  this.startCollectiveStep3);
    }

    startMeditationTimer() {
        document.getElementById('startMeditationBtn')?.style.setProperty('display', 'none');
        this._runTimer('meditationTimer', LunarRoom.CONSTANTS.MEDITATION_DURATION, () => {
            const skip = document.getElementById('skipToIntentionBtn');
            if (skip) { skip.textContent = 'Continue to Intention'; skip.style.display = 'block'; }
        });
        setTimeout(() => {
            const skip = document.getElementById('skipToIntentionBtn');
            if (skip) skip.style.display = 'block';
        }, 10_000);
    }

    startCollectiveStep3() {
        this._clearTimer();
        const content = document.getElementById('collectiveIntentionContent');
        if (!content) return;
        content.innerHTML = `
            <div class="lunar-popup-section">
                <h3>Step 2: Your Private Intention</h3>
                <p>Write your intention for this ${this.config.name} cycle. This remains private.</p>
                <textarea id="privateIntentionText" class="lunar-textarea-large"
                    placeholder="I intend to..."
                    maxlength="${LunarRoom.CONSTANTS.MAX_INTENTION_LENGTH}"
                >${LunarConfig._escapeHtml(this.userWeekData.privateIntention || '')}</textarea>
                <button class="lunar-popup-btn" data-action="save-private-intention">Continue</button>
            </div>`;
        content.querySelector('[data-action="save-private-intention"]')?.addEventListener('click', this.startCollectiveStep4);
    }

    startCollectiveStep4() {
        const intentionEl = document.getElementById('privateIntentionText');
        if (intentionEl) this.userWeekData.privateIntention = this._sanitizeInput(intentionEl.value);

        const content = document.getElementById('collectiveIntentionContent');
        if (!content) return;
        content.innerHTML = `
            <div class="lunar-popup-section">
                <h3>Step 3: Choose One Word</h3>
                <p>From your intention, choose one word to contribute to the collective field.</p>
                <div class="lunar-intention-preview">
                    <div class="lunar-preview-label">Your intention:</div>
                    <p>${LunarConfig._escapeHtml(this.userWeekData.privateIntention || 'No intention set')}</p>
                </div>
                <input type="text" id="collectiveWordInput" class="lunar-word-input"
                    placeholder="Your word..." maxlength="${LunarRoom.CONSTANTS.MAX_WORD_LENGTH}">
                <button class="lunar-popup-btn" data-action="submit-collective-word">Plant Your Word</button>
            </div>`;
        content.querySelector('[data-action="submit-collective-word"]')?.addEventListener('click', () => {
            const w = document.getElementById('collectiveWordInput');
            if (w) this.submitWordToCollective(w.value);
        });
    }

    submitWordToCollective(word) {
        const sanitized  = this._sanitizeInput(word);
        const validation = this._validateCollectiveWord(sanitized);
        if (!validation.valid) { window.Core?.showToast(validation.error); return; }

        this.userWeekData.collectiveWord  = sanitized;
        this.userWeekData.intentionShared = true;
        if (!this.collectiveWords) this.collectiveWords = this.getMockCollectiveWords();
        this.collectiveWords.push({ word: sanitized, timestamp: Date.now() });

        if (window.CommunityDB?.ready) {
            CommunityDB.sendRoomMessage(`${this._getLunarRoomId()}-collective`, sanitized)
                .catch(e => console.error('[LunarRoom] submitWordToCollective DB error:', e));
        }

        this.startCollectiveStep5();
    }

    startCollectiveStep5() {
        const content = document.getElementById('collectiveIntentionContent');
        if (!content) return;
        content.innerHTML = `
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 4: Collective Intention Field</h3>
                <p style="margin-bottom:2rem;">Your word has been planted. Witness the collective intentions emerging.</p>
                <div id="wordCloud" class="lunar-word-cloud">
                    ${LunarUI.renderWordCloud(this.collectiveWords ?? this.getMockCollectiveWords())}
                </div>
                <p class="lunar-word-count"><strong>${this.getCollectiveWordsCount()}</strong> intentions planted in this ${this.config.name} cycle</p>
                <div style="margin:2rem 0;">
                    <h4 class="lunar-witness-title">Step 5: Silent Witnessing (2 min)</h4>
                    <div id="witnessingTimer" class="lunar-timer-small">2:00</div>
                    <button id="startWitnessingBtn" class="lunar-popup-btn" data-action="start-witnessing">Begin Silent Witnessing</button>
                    <button id="completeBtn" class="lunar-popup-btn lunar-btn-success" data-action="complete-collective" style="display:none;">Complete Practice</button>
                </div>
            </div>`;
        content.querySelector('[data-action="start-witnessing"]')?.addEventListener('click', this.startWitnessingTimer);
        content.querySelector('[data-action="complete-collective"]')?.addEventListener('click', this.completeCollectivePractice);
    }

    startWitnessingTimer() {
        document.getElementById('startWitnessingBtn')?.style.setProperty('display', 'none');
        this._runTimer('witnessingTimer', LunarRoom.CONSTANTS.WITNESSING_DURATION, () => {
            const btn = document.getElementById('completeBtn');
            if (btn) btn.style.display = 'block';
        });
    }

    /** Shared timer helper used by both meditation and witnessing. */
    _runTimer(displayId, duration, onComplete) {
        let remaining = duration;
        const display = document.getElementById(displayId);
        if (!display) return;

        this.collectiveTimer = setInterval(() => {
            remaining--;
            const m = Math.floor(remaining / 60), s = remaining % 60;
            display.textContent = `${m}:${String(s).padStart(2, '0')}`;
            if (remaining <= 0) {
                this._clearTimer();
                display.textContent = 'Complete';
                onComplete?.();
            }
        }, LunarRoom.CONSTANTS.TIMER_INTERVAL_MS);
    }

    completeCollectivePractice() {
        this.userWeekData.practiceCount++;
        this.saveUserWeekData(true);
        window.Core?.showToast('🌱 Intention planted with the collective');
        this.closeCollectivePopup();
        this.renderRoomDashboard();
    }

    closeCollectivePopup() {
        this._clearTimer();
        this.closePracticePopup();
    }

    enterGroupCircle() { this.showCollectiveIntentionPopup(); }

    // ── Closure ──────────────────────────────────────────────────────────────────

    submitClosure() {
        try {
            const reflectionEl = document.getElementById('closureReflection');
            if (reflectionEl) {
                // Persist reflection before reset
                this.userWeekData.closureReflection = this._sanitizeInput(reflectionEl.value);
                this.saveUserWeekData(true);
            }
            window.Core?.showToast(this.config.completionMessage);
            this.userWeekData = this._getDefaultUserData();
            this.saveUserWeekData(true);
            window.Core?.navigateTo('hubView');
        } catch (e) {
            console.error('submitClosure error:', e);
            window.Core?.showToast('Failed to submit closure');
        }
    }

    // ── Utilities ────────────────────────────────────────────────────────────────

    _clearTimer() {
        if (this.collectiveTimer) { clearInterval(this.collectiveTimer); this.collectiveTimer = null; }
    }

    getLivingPresenceCount() {
        return typeof this._cachedPresenceCount === 'number' ? this._cachedPresenceCount : 0;
    }

    getMockCollectiveWords() {
        const now = Date.now();
        return [
            { word: 'Growth',  timestamp: now - 86_400_000 },
            { word: 'Peace',   timestamp: now - 72_000_000 },
            { word: 'Courage', timestamp: now - 43_200_000 },
            { word: 'Clarity', timestamp: now - 36_000_000 },
            { word: 'Healing', timestamp: now - 21_600_000 },
            { word: 'Trust',   timestamp: now - 18_000_000 },
            { word: 'Love',    timestamp: now - 14_400_000 },
            { word: 'Balance', timestamp: now -  7_200_000 },
            { word: 'Freedom', timestamp: now -  3_600_000 },
            { word: 'Joy',     timestamp: now -  1_800_000 }
        ];
    }

    getCollectiveWordsCount() {
        return (this.collectiveWords ?? this.getMockCollectiveWords()).length;
    }

    // ── Supabase helpers ─────────────────────────────────────────────────────────

    _getLunarRoomId() {
        return { newmoon: 'new-moon', waxingmoon: 'waxing-moon', fullmoon: 'full-moon', waningmoon: 'waning-moon' }[this.config.cssPrefix]
            ?? this.config.cssPrefix;
    }

    _setPresence() {
        if (!window.CommunityDB?.ready) return;
        try {
            const roomId   = this._getLunarRoomId();
            const activity = `${this.config.emoji} ${this.config.name}`;
            CommunityDB.setPresence('online', activity, roomId);
            if (window.Core?.state) {
                Core.state.currentRoom = roomId;
                if (Core.state.currentUser) Core.state.currentUser.activity = activity;
            }
        } catch (e) { console.error('[LunarRoom] _setPresence error:', e); }
    }

    _clearPresence() {
        if (!window.CommunityDB?.ready) return;
        try {
            CommunityDB.setPresence('online', '✨ Available', null);
            if (window.Core?.state) {
                Core.state.currentRoom = null;
                if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
            }
        } catch (e) { console.error('[LunarRoom] _clearPresence error:', e); }
    }

    async _refreshLivePresence() {
        if (!window.CommunityDB?.ready) return;
        const roomId = this._getLunarRoomId();

        const refresh = async () => {
            try {
                const participants = await CommunityDB.getRoomParticipants(roomId);
                const blocked      = await CommunityDB.getBlockedUsers();
                const visible      = participants.filter(p => !blocked.has(p.user_id));
                this._cachedPresenceCount = visible.length;
                this._cachedParticipants  = visible;

                const el = document.getElementById('lunarLiveCountTop');
                if (el) el.textContent = `${visible.length} members practicing with you now`;

                const circleEl = document.querySelector('.lunar-live-presence span');
                if (circleEl) circleEl.textContent = `${visible.length} members in circle`;

                const avatarEl = document.querySelector('.lunar-group-avatars');
                if (avatarEl) avatarEl.innerHTML = this._buildRealAvatars(visible);
            } catch (e) { console.warn('[LunarRoom] _refreshLivePresence error:', e); }
        };

        await refresh();
        if (this._presenceSub) { try { this._presenceSub.unsubscribe(); } catch (_) {} }
        this._presenceSub = CommunityDB.subscribeToPresence(refresh);
    }

    _buildRealAvatars(participants) {
        const MAX      = 5;
        const shown    = participants.slice(0, MAX);
        const overflow = participants.length - MAX;

        const html = shown.map(p => {
            const profile  = p.profiles ?? {};
            const name     = profile.name ?? profile.display_name ?? '?';
            const initial  = name.charAt(0).toUpperCase();
            const gradient = window.Core?.getAvatarGradient?.(p.user_id) ?? 'background:#8B7AFF';
            let inner = profile.avatar_url
                ? `<img src="${profile.avatar_url}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                : profile.emoji
                    ? `<span style="font-size:18px;">${profile.emoji}</span>`
                    : `<span style="font-size:14px;font-weight:600;">${initial}</span>`;
            return `<div class="lunar-avatar" style="${gradient};display:flex;align-items:center;justify-content:center;" aria-label="${name}">${inner}</div>`;
        }).join('');

        const extra = overflow > 0
            ? `<div class="lunar-avatar" style="background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;">+${overflow}</div>`
            : `<div class="lunar-avatar lunar-join-avatar" aria-label="Join circle"><span>+</span></div>`;

        return html + extra;
    }

    async _loadCollectiveWords() {
        if (!window.CommunityDB?.ready) return;
        const collectiveRoomId = `${this._getLunarRoomId()}-collective`;

        const load = async () => {
            try {
                const rows = await CommunityDB.getRoomMessages(collectiveRoomId, 100);
                if (rows?.length) {
                    this.collectiveWords = rows.map(r => ({ word: r.message, timestamp: new Date(r.created_at).getTime() }));
                    const cloudEl = document.getElementById('wordCloud');
                    if (cloudEl) cloudEl.innerHTML = LunarUI.renderWordCloud(this.collectiveWords);
                    const countEl = document.querySelector('.lunar-word-count strong');
                    if (countEl) countEl.textContent = this.collectiveWords.length;
                }
            } catch (e) { console.warn('[LunarRoom] _loadCollectiveWords error:', e); }
        };

        await load();
        if (this._collectiveWordsSub) { try { this._collectiveWordsSub.unsubscribe(); } catch (_) {} }
        this._collectiveWordsSub = CommunityDB.subscribeToRoomChat(collectiveRoomId, load);
    }

    cleanup() {
        this._clearTimer();
        this._removeEventListeners();
        clearTimeout(this.saveDebounceTimer);
        clearTimeout(this._retryCheckTimeout);
        ['_presenceSub', '_collectiveWordsSub'].forEach(k => {
            if (this[k]) { try { this[k].unsubscribe(); } catch (_) {} this[k] = null; }
        });
        this.domCache = { dynamicContent: null, popup: null };
    }
}

window.LunarRoom = LunarRoom;
window.LunarRoom.CONSTANTS = LunarRoom.CONSTANTS;
