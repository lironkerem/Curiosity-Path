/**
 * LUNAR-CORE.JS v2.0
 * Base class for all lunar phase practice rooms
 * 
 * IMPROVEMENTS:
 * - Removed XSS vulnerabilities (no onclick strings)
 * - Added input validation and sanitization
 * - Proper error handling with try-catch
 * - Memory leak prevention
 * - Event delegation
 * - Debounced saves
 * - Constants for magic numbers
 * - Comprehensive JSDoc
 * 
 * @class LunarRoom
 */

class LunarRoom {
    // ============================================================================
    // CONSTANTS
    // ============================================================================
    
    static CONSTANTS = {
        MEDITATION_DURATION: 180,      // 3 minutes in seconds
        WITNESSING_DURATION: 120,       // 2 minutes in seconds
        SAVE_DEBOUNCE_MS: 500,          // Debounce delay for saves
        MAX_INTENTION_LENGTH: 500,      // Max characters for intention
        MAX_AFFIRMATION_LENGTH: 300,    // Max characters for affirmation
        MAX_RELEASE_LIST_LENGTH: 1000,  // Max characters for release list
        MAX_WORD_LENGTH: 50,            // Max characters for collective word
        TIMER_INTERVAL_MS: 1000,        // Timer update interval
        LUNAR_CYCLE_DAYS: 29.53,        // Average lunar cycle length
        MS_PER_DAY: 86400000            // Milliseconds per day
    };

    /**
     * Create a lunar room instance
     * @param {Object} phaseConfig - Configuration object for this lunar phase
     */
    constructor(phaseConfig) {
        if (!phaseConfig) {
            throw new Error('LunarRoom: phaseConfig is required');
        }

        this.config = phaseConfig;
        
        // Room state
        this.isActive = false;
        this.currentPractice = null;
        this.collectiveTimer = null;
        this.collectiveWords = null;
        this.saveDebounceTimer = null;
        this._retryCheckTimeout = null; // ✅ ADDED: For retrying LunarEngine check
        this.eventListeners = []; // Track for cleanup
        
        // User data structure with defaults
        this.userWeekData = this._getDefaultUserData();

        // Week tracking
        this.weekStartDate = null;
        this.weekEndDate = null;
        
        // DOM cache
        this.domCache = {
            dynamicContent: null,
            popup: null
        };
        
        // Bind methods to preserve context
        this._bindMethods();
    }

    /**
     * Get default user data structure
     * @private
     * @returns {Object} Default user data
     */
    _getDefaultUserData() {
        return {
            seedAffirmation: null,
            practiceCount: 0,
            journalEntries: [],
            emotionalEchoes: [],
            intentionShared: false,
            privateIntention: '',
            collectiveWord: '',
            intention: '',
            affirmation: '',
            releaseList: ''
        };
    }

    /**
     * Bind all methods to preserve context
     * @private
     */
    _bindMethods() {
        const methodsToBind = [
            'init', 'enterRoom', 'renderRoomDashboard', 'switchMode',
            'showPracticePopup', 'showCollectiveIntentionPopup',
            'startCollectiveStep2', 'startCollectiveStep3', 'startCollectiveStep4',
            'startCollectiveStep5', 'startMeditationTimer', 'startWitnessingTimer',
            'submitWordToCollective', 'completeCollectivePractice',
            'closeCollectivePopup', 'closePracticePopup', 'saveIntentionPractice',
            'submitClosure', 'showLockedMessage', 'enterGroupCircle', 'leaveRoom',
            '_handlePopupClick', '_handleCloseClick', '_clearTimer'
        ];

        methodsToBind.forEach(method => {
            if (typeof this[method] === 'function') {
                this[method] = this[method].bind(this);
            }
        });
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    /**
     * Initialize the lunar room
     * Sets up styles and checks phase activation
     */
    init() {
        try {
            console.log(`🌙 ${this.config.name} Room Module Loaded`);
            this.checkIfWeekActive();
            LunarUI.injectStyles(this.config.cssPrefix);
        } catch (error) {
            console.error(`${this.config.name} init error:`, error);
        }
    }

    /**
     * Check if we're in the correct lunar phase
     * Handles both DEV_MODE and production phase detection
     */
    checkIfWeekActive() {
        try {
            // Check if LunarEngine is ready (required for both DEV and production)
            if (!window.LunarEngine?.currentMoonData) {
                // Only log the first time, not on every retry
                if (!this._retryCheckTimeout) {
                    console.log(`⏳ ${this.config.name}: Waiting for LunarEngine...`);
                    this._retryCheckTimeout = setTimeout(() => {
                        this._retryCheckTimeout = null;
                        this.checkIfWeekActive();
                    }, 500);
                }
                return;
            }

            // DEV MODE: Always active, but still calculate dates properly
            if (window.Core?.config?.DEV_MODE) {
                console.log(`🔧 DEV MODE: ${this.config.name} force-enabled (phase: ${window.LunarEngine.currentMoonData.phase.toFixed(3)})`);
                this.isActive = true;
                this.calculateWeekDates();
                this.loadUserWeekData();
                return;
            }

            const phase = window.LunarEngine.currentMoonData.phase;
            
            // Check if phase falls within this room's range(s)
            // ✅ FIXED: Changed < to <= to handle edge case where phase === range[1]
            this.isActive = this.config.phaseRanges.some(range => 
                phase >= range[0] && phase <= range[1]
            );
            
            if (this.isActive) {
                this.calculateWeekDates();
                this.loadUserWeekData();
            }
        } catch (error) {
            console.error('Error checking week active:', error);
            this.isActive = false;
        }
    }

    /**
     * Calculate start and end dates for this lunar phase
     */
    calculateWeekDates() {
        try {
            const now = new Date();
            const moonData = window.LunarEngine?.currentMoonData;
            
            if (!moonData) {
                console.error('No moon data available');
                return;
            }
            
            const phase = moonData.phase;
            const age = moonData.age;
            const cycleDuration = LunarRoom.CONSTANTS.LUNAR_CYCLE_DAYS;
            
            // Find which range we're in (FIXED: handle edge case where phase === range[1])
            let activeRange = this.config.phaseRanges.find(range => 
                phase >= range[0] && phase <= range[1] // ✅ FIXED: Changed < to <=
            );
            
            // ✅ DEV_MODE FIX: If not in phase but DEV_MODE is on, use first range as fallback
            if (!activeRange) {
                if (window.Core?.config?.DEV_MODE) {
                    activeRange = this.config.phaseRanges[0];
                } else {
                    // Not in phase - calculate next occurrence
                    this.calculateNextOccurrence(phase, age, cycleDuration);
                    return;
                }
            }

            // Calculate last New Moon date (when phase was 0)
            const lastNewMoonDate = new Date(
                now.getTime() - (age * LunarRoom.CONSTANTS.MS_PER_DAY)
            );
            
            // Calculate when this phase started (relative to last New Moon)
            this.weekStartDate = new Date(
                lastNewMoonDate.getTime() + 
                (activeRange[0] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
            );
            
            // Calculate when this phase ends (relative to last New Moon)
            this.weekEndDate = new Date(
                lastNewMoonDate.getTime() + 
                (activeRange[1] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
            );
            
            
        } catch (error) {
            console.error('Error calculating week dates:', error);
        }
    }

    /**
     * Calculate next occurrence of this phase
     * @param {number} currentPhase - Current moon phase (0-1)
     * @param {number} age - Current moon age in days
     * @param {number} cycleDuration - Lunar cycle duration in days
     */
    calculateNextOccurrence(currentPhase, age, cycleDuration) {
        try {
            const now = new Date();
            const lastNewMoonDate = new Date(
                now.getTime() - (age * LunarRoom.CONSTANTS.MS_PER_DAY)
            );
            
            // Check if next occurrence is in this cycle or next
            const nextRange = this.config.phaseRanges[0];
            
            if (currentPhase < nextRange[0]) {
                // Next occurrence is in this cycle
                this.weekStartDate = new Date(
                    lastNewMoonDate.getTime() + 
                    (nextRange[0] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
                );
                this.weekEndDate = new Date(
                    lastNewMoonDate.getTime() + 
                    (nextRange[1] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
                );
            } else {
                // Next occurrence is in next cycle
                const nextNewMoonDate = new Date(
                    lastNewMoonDate.getTime() + 
                    (cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
                );
                this.weekStartDate = new Date(
                    nextNewMoonDate.getTime() + 
                    (nextRange[0] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
                );
                this.weekEndDate = new Date(
                    nextNewMoonDate.getTime() + 
                    (nextRange[1] * cycleDuration * LunarRoom.CONSTANTS.MS_PER_DAY)
                );
            }
        } catch (error) {
            console.error('Error calculating next occurrence:', error);
        }
    }

    /**
     * Get days remaining in current phase
     * Uses actual weekEndDate for accurate countdown
     * @returns {number} Days remaining in phase
     */
    getDaysRemaining() {
        if (!this.weekEndDate) {
            return 0;
        }
        
        const now = new Date();
        const msRemaining = this.weekEndDate.getTime() - now.getTime();
        const daysRemaining = Math.ceil(msRemaining / LunarRoom.CONSTANTS.MS_PER_DAY);
        
        return Math.max(0, daysRemaining);
    }

    /**
     * Check if closure section should be shown
     * Only shows in last 2 days of phase
     * @returns {boolean} True if in last 2 days
     */
    shouldShowClosure() {
        const daysRemaining = this.getDaysRemaining();
        return daysRemaining <= 2 && daysRemaining > 0;
    }

    // ============================================================================
    // DATA PERSISTENCE
    // ============================================================================

    /**
     * Load user data from localStorage
     * Merges with defaults to ensure all properties exist
     */
    loadUserWeekData() {
        try {
            const savedData = localStorage.getItem(this.config.storageKey);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.userWeekData = { ...this.userWeekData, ...parsed };
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Continue with default data
        }
    }

    /**
     * Save user data to localStorage with debouncing
     * @param {boolean} immediate - Skip debounce if true
     */
    saveUserWeekData(immediate = false) {
        try {
            if (immediate) {
                this._performSave();
                return;
            }

            // Debounced save
            if (this.saveDebounceTimer) {
                clearTimeout(this.saveDebounceTimer);
            }
            
            this.saveDebounceTimer = setTimeout(() => {
                this._performSave();
            }, LunarRoom.CONSTANTS.SAVE_DEBOUNCE_MS);
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    /**
     * Perform the actual save operation
     * @private
     */
    _performSave() {
        try {
            localStorage.setItem(
                this.config.storageKey, 
                JSON.stringify(this.userWeekData)
            );
        } catch (error) {
            console.error('Error performing save:', error);
            if (window.Core) {
                window.Core.showToast('Failed to save data');
            }
        }
    }

    // ============================================================================
    // INPUT VALIDATION & SANITIZATION
    // ============================================================================

    /**
     * Sanitize user input to prevent XSS
     * @param {string} input - User input string
     * @returns {string} Sanitized string
     */
    _sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Remove any HTML tags and trim
        return input
            .replace(/<[^>]*>/g, '')
            .trim();
    }

    /**
     * Validate intention input
     * @param {string} intention - Intention text
     * @returns {Object} Validation result {valid: boolean, error: string}
     */
    _validateIntention(intention) {
        if (!intention || intention.trim().length === 0) {
            return { valid: false, error: 'Intention cannot be empty' };
        }
        
        if (intention.length > LunarRoom.CONSTANTS.MAX_INTENTION_LENGTH) {
            return { 
                valid: false, 
                error: `Intention must be under ${LunarRoom.CONSTANTS.MAX_INTENTION_LENGTH} characters` 
            };
        }
        
        return { valid: true, error: null };
    }

    /**
     * Validate affirmation input
     * @param {string} affirmation - Affirmation text
     * @returns {Object} Validation result
     */
    _validateAffirmation(affirmation) {
        if (!affirmation || affirmation.trim().length === 0) {
            return { valid: false, error: 'Affirmation cannot be empty' };
        }
        
        if (affirmation.length > LunarRoom.CONSTANTS.MAX_AFFIRMATION_LENGTH) {
            return { 
                valid: false, 
                error: `Affirmation must be under ${LunarRoom.CONSTANTS.MAX_AFFIRMATION_LENGTH} characters` 
            };
        }
        
        return { valid: true, error: null };
    }

    /**
     * Validate collective word input
     * @param {string} word - Single word for collective
     * @returns {Object} Validation result
     */
    _validateCollectiveWord(word) {
        if (!word || word.trim().length === 0) {
            return { valid: false, error: 'Word cannot be empty' };
        }
        
        if (word.length > LunarRoom.CONSTANTS.MAX_WORD_LENGTH) {
            return { 
                valid: false, 
                error: `Word must be under ${LunarRoom.CONSTANTS.MAX_WORD_LENGTH} characters` 
            };
        }
        
        // Check if it's actually a single word
        if (word.trim().includes(' ')) {
            return { valid: false, error: 'Please enter only one word' };
        }
        
        return { valid: true, error: null };
    }

    // ============================================================================
    // ROOM NAVIGATION
    // ============================================================================

    /**
     * Enter the practice room
     * Handles navigation and rendering
     */
    enterRoom() {
        try {
            if (!this.isActive) {
                if (window.Core) {
                    window.Core.showToast(
                        `${this.config.emoji} ${this.config.name} room opens during the ${this.config.name} phase`
                    );
                }
                return;
            }

            if (window.Core) {
                window.Core.navigateTo('practiceRoomView');
            }

            // Stop hub card subscription while inside a room
            if (window.PracticeRoom?.stopHubPresence) {
                PracticeRoom.stopHubPresence();
            }

            window.currentLunarRoom = this;
            this.renderRoomDashboard();
            window.scrollTo(0, 0);

            // ── Supabase presence ──────────────────────────────────────────
            this._setPresence();

            // ── Load collective words from DB ──────────────────────────────
            this._loadCollectiveWords();

            // ── Live participant count + realtime subscription ─────────────
            setTimeout(() => this._refreshLivePresence(), 300);

        } catch (error) {
            console.error('Error entering room:', error);
            if (window.Core) {
                window.Core.showToast('Failed to enter room');
            }
        }
    }

    /**
     * Leave the practice room and return to hub
     */
    leaveRoom() {
        try {
            // ── Supabase presence ──────────────────────────────────────────
            this._clearPresence();

            // ── Unsubscribe from presence subscription ─────────────────────
            if (this._presenceSub) {
                try { this._presenceSub.unsubscribe(); } catch(e) {}
                this._presenceSub = null;
            }
            if (this._collectiveWordsSub) {
                try { this._collectiveWordsSub.unsubscribe(); } catch(e) {}
                this._collectiveWordsSub = null;
            }

            // Cleanup
            this._clearTimer();
            this._removeEventListeners();
            window.currentLunarRoom = null;

            // ── Restart shared hub presence subscription ───────────────────
            if (window.PracticeRoom?.startHubPresence) {
                PracticeRoom.startHubPresence();
            }

            if (window.Core) {
                window.Core.navigateTo('hubView');
            }
        } catch (error) {
            console.error('Error leaving room:', error);
        }
    }

    // ============================================================================
    // DASHBOARD RENDERING
    // ============================================================================

    /**
     * Render the main room dashboard
     * Uses cached DOM queries for performance
     */
    renderRoomDashboard() {
        try {
            const container = this.domCache.dynamicContent || 
                             document.getElementById('dynamicRoomContent');
            
            if (!container) {
                console.error('Dynamic content container not found');
                return;
            }

            this.domCache.dynamicContent = container;

            const now = new Date();
            const daysRemaining = this.getDaysRemaining(); // ✅ FIXED: Use new method
            const daysUntilStart = Math.ceil(
                (this.weekStartDate - now) / LunarRoom.CONSTANTS.MS_PER_DAY
            );
            const livingPresenceCount = this.getLivingPresenceCount();
            
            const inPhase = this.isActive;
            const daysText = inPhase 
                ? `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`
                : `${daysUntilStart} ${daysUntilStart === 1 ? 'day' : 'days'} until ${this.config.name}`;

            // Generate starfield
            const starfieldHTML = LunarUI.generateStarfield();

            container.innerHTML = `
                <div class="lunar-room-bg">
                <div class="${this.config.cssPrefix}-starfield lunar-starfield">
                    ${starfieldHTML}
                </div>

                ${LunarUI.renderTopBar({
                    emoji: this.config.emoji,
                    name: this.config.name,
                    daysText,
                    livingPresenceCount,
                    cssPrefix: this.config.cssPrefix
                })}

                <div class="${this.config.cssPrefix}-content-wrapper lunar-content-wrapper">

                    ${LunarUI.renderMoonVisual({
                        cssPrefix: this.config.cssPrefix,
                        sphereClass: `${this.config.cssPrefix}-moon-sphere`,
                        glowClass: `${this.config.cssPrefix}-moon-glow`
                    })}

                    ${LunarUI.renderIntroCard({
                        imageUrl: this.config.imageUrl,
                        description: this.config.description
                    })}

                    ${LunarUI.renderModeToggle({ 
                        cssPrefix: this.config.cssPrefix,
                        globalName: this.config.globalName
                    })}

                    <!-- Solo Practice Mode (Default) -->
                    <div class="lunar-practice-mode active" data-mode="solo">
                        ${this._renderSoloPracticeMode()}
                    </div>

                    <!-- Group Circle Mode -->
                    <div class="lunar-practice-mode" data-mode="group">
                        ${this._renderGroupCircleMode(livingPresenceCount)}
                    </div>

                    ${this._renderClosureSection()}

                    <div class="lunar-wisdom-section">
                        ${LunarUI.renderWisdomText(this.config.wisdomQuote)}
                    </div>
                </div>
                </div>
            `;

            // Attach event listeners with delegation
            this._attachEventListeners(container);

        } catch (error) {
            console.error('Error rendering dashboard:', error);
        }
    }

    /**
     * Render solo practice mode content
     * @private
     * @returns {string} HTML string
     */
    _renderSoloPracticeMode() {
        const hasCompletedIntention = !!(
            this.userWeekData.intention || 
            this.userWeekData.affirmation
        );

        return `
            <div class="lunar-mode-description">
                <h3>Your Sacred Space</h3>
                <p>${this.config.modeDescription || 'Individual practices for this lunar phase'}</p>
            </div>

            <div class="lunar-practices-section">
                <div class="lunar-practices-grid">
                    ${this._renderPracticeCards()}
                </div>
            </div>

            ${hasCompletedIntention ? this._renderSavedInputs() : ''}
        `;
    }

    /**
     * Render practice cards
     * @private
     * @returns {string} HTML string
     */
    _renderPracticeCards() {
        const practices = Object.entries(this.config.practices);
        const firstPracticeKey = practices[0]?.[0];
        const hasCompletedIntention = !!(
            this.userWeekData.intention || 
            this.userWeekData.affirmation
        );

        return practices.map(([key, practice]) => {
            const isLocked = key === firstPracticeKey && hasCompletedIntention;
            const lockClass = isLocked ? 'locked' : '';
            
            return `
                <div class="lunar-practice-card ${this.config.cssPrefix}-practice-card ${lockClass}" 
                     data-practice="${key}"
                     data-locked="${isLocked}">
                    <div class="lunar-practice-icon" style="color: ${practice.color};">
                        ${practice.icon}
                    </div>
                    <div class="lunar-practice-info">
                        <h4>${practice.title}</h4>
                        <p>${practice.description}</p>
                    </div>
                    ${isLocked ? '<div class="lunar-lock-badge">✓ Complete</div>' : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Render saved user inputs
     * @private
     * @returns {string} HTML string
     */
    _renderSavedInputs() {
        const { intention, affirmation, releaseList } = this.userWeekData;
        const labels = this.config.savedInputLabels;

        return `
            <div class="lunar-saved-inputs">
                <h3>${labels.title}</h3>
                ${intention ? `
                    <div class="lunar-saved-item">
                        <div class="lunar-saved-label">${labels.intention}</div>
                        <div class="lunar-saved-text">${this._escapeHtml(intention)}</div>
                    </div>
                ` : ''}
                ${affirmation ? `
                    <div class="lunar-saved-item">
                        <div class="lunar-saved-label">${labels.affirmation}</div>
                        <div class="lunar-saved-text">${this._escapeHtml(affirmation)}</div>
                    </div>
                ` : ''}
                ${releaseList ? `
                    <div class="lunar-saved-item">
                        <div class="lunar-saved-label">${labels.releaseList}</div>
                        <div class="lunar-saved-text">${this._escapeHtml(releaseList).replace(/\n/g, '<br>')}</div>
                    </div>
                ` : ''}
                <div class="lunar-saved-footer">${labels.footer}</div>
            </div>
        `;
    }

    /**
     * Render group circle mode content
     * @private
     * @param {number} presenceCount - Number of present members
     * @returns {string} HTML string
     */
    _renderGroupCircleMode(presenceCount) {
        return `
            <div class="lunar-group-intro">
                <h3>Group Intention Circle</h3>
                <p>Join others in ${this.config.collectiveFocus}. Together we create ${this.config.collectiveNoun}.</p>
                
                <div class="lunar-live-presence">
                    <div class="lunar-pulse-dot"></div>
                    <span>${presenceCount} members in circle</span>
                </div>
                
                <div class="lunar-group-avatars">
                    ${LunarUI.renderMockAvatars(presenceCount)}
                </div>
                
                <button class="lunar-join-circle-btn" data-action="enter-group-circle">
                    Enter the Circle
                </button>
            </div>
        `;
    }

    /**
     * Render closure section
     * Only shows in last 2 days of phase
     * @private
     * @returns {string} HTML string
     */
    _renderClosureSection() {
        // ✅ FIXED: Use shouldShowClosure method
        if (!this.shouldShowClosure()) return '';

        return `
            <div class="lunar-closure-section">
                <h3>${this.config.closureTitle}</h3>
                <p>${this.config.closureDescription}</p>
                <textarea 
                    id="closureReflection" 
                    class="lunar-textarea-large" 
                    placeholder="${this.config.closurePlaceholder}"
                    maxlength="${LunarRoom.CONSTANTS.MAX_INTENTION_LENGTH}"
                ></textarea>
                <button class="lunar-popup-btn" data-action="submit-closure">
                    ${this.config.closureButton}
                </button>
            </div>
        `;
    }

    // ============================================================================
    // EVENT HANDLING
    // ============================================================================

    /**
     * Attach event listeners using delegation
     * @private
     * @param {HTMLElement} container - Container element
     */
    _attachEventListeners(container) {
        // Remove old listeners
        this._removeEventListeners();

        // Practice card clicks
        const handlePracticeClick = (e) => {
            const card = e.target.closest('.lunar-practice-card');
            if (!card) return;

            const practiceKey = card.dataset.practice;
            const isLocked = card.dataset.locked === 'true';

            if (isLocked) {
                this.showLockedMessage();
            } else {
                this.showPracticePopup(practiceKey);
            }
        };

        // Button actions
        const handleButtonClick = (e) => {
            const button = e.target.closest('[data-action]');
            if (!button) return;

            const action = button.dataset.action;

            switch (action) {
                case 'switch-mode':
                    const mode = button.dataset.mode;
                    if (mode) this.switchMode(mode);
                    break;
                case 'enter-group-circle':
                    this.enterGroupCircle();
                    break;
                case 'submit-closure':
                    this.submitClosure();
                    break;
                case 'back-to-hub':
                    if (window.Rituals) {
                        Rituals.showClosing();
                    } else {
                        this.leaveRoom();
                    }
                    break;
            }
        };

        container.addEventListener('click', handlePracticeClick);
        container.addEventListener('click', handleButtonClick);

        // Store listeners for cleanup
        this.eventListeners.push(
            { element: container, type: 'click', handler: handlePracticeClick },
            { element: container, type: 'click', handler: handleButtonClick }
        );
    }

    /**
     * Remove all tracked event listeners
     * @private
     */
    _removeEventListeners() {
        this.eventListeners.forEach(({ element, type, handler }) => {
            element?.removeEventListener(type, handler);
        });
        this.eventListeners = [];
    }

    /**
     * Switch between solo and group modes
     * @param {string} mode - 'solo' or 'group'
     */
    switchMode(mode) {
        try {
            const modes = document.querySelectorAll('.lunar-practice-mode');
            const buttons = document.querySelectorAll('.lunar-mode-btn');

            modes.forEach(m => {
                m.classList.toggle('active', m.dataset.mode === mode);
            });

            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        } catch (error) {
            console.error('Error switching mode:', error);
        }
    }

    // ============================================================================
    // PRACTICE POPUPS
    // ============================================================================

    /**
     * Show practice popup
     * @param {string} practiceKey - Key of the practice to show
     */
    showPracticePopup(practiceKey) {
        try {
            const practice = this.config.practices[practiceKey];
            if (!practice) {
                console.error(`Practice not found: ${practiceKey}`);
                return;
            }

            this.currentPractice = practiceKey;

            const content = this.getPracticeContent(practiceKey);
            const hasOwnFooter = practiceKey === Object.keys(this.config.practices)[0];

            const popup = LunarUI.createPopup({
                icon: practice.icon,
                title: practice.title,
                subtitle: practice.description,
                content: content,
                cssPrefix: this.config.cssPrefix,
                hasFooter: !hasOwnFooter,
                onClose: () => this.closePracticePopup()
            });

            const _popupTarget = document.getElementById('communityHubFullscreenContainer') || document.body;
            _popupTarget.appendChild(popup);
            this.domCache.popup = popup;

            // Attach popup-specific event listeners
            this._attachPopupListeners(popup, practiceKey);

        } catch (error) {
            console.error('Error showing practice popup:', error);
        }
    }

    /**
     * Attach event listeners to popup
     * @private
     * @param {HTMLElement} popup - Popup element
     * @param {string} practiceKey - Practice key
     */
    _attachPopupListeners(popup, practiceKey) {
        // ✅ FIXED: Use querySelectorAll to get ALL close buttons (X and footer)
        const closeButtons = popup.querySelectorAll('[data-action="close-popup"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', this.closePracticePopup);
        });

        // Background click
        popup.addEventListener('click', this._handlePopupClick);

        // Save button for intention practice
        if (practiceKey === Object.keys(this.config.practices)[0]) {
            const saveBtn = popup.querySelector('[data-action="save-practice"]');
            if (saveBtn) {
                saveBtn.addEventListener('click', this.saveIntentionPractice);
            }

            // Affirmation selection buttons
            const affirmationBtns = popup.querySelectorAll('[data-affirmation]');
            affirmationBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const affirmation = btn.dataset.affirmation;
                    const textarea = popup.querySelector('#affirmationText');
                    if (textarea) {
                        textarea.value = affirmation;
                    }
                });
            });
        }
    }

    /**
     * Handle popup background click
     * @private
     * @param {Event} e - Click event
     */
    _handlePopupClick(e) {
        if (e.target === e.currentTarget) {
            this.closePracticePopup();
        }
    }

    /**
     * Get practice content HTML
     * @param {string} practiceKey - Practice key
     * @returns {string} HTML content
     */
    getPracticeContent(practiceKey) {
        try {
            const contentGetter = this.config.practiceContent[practiceKey];
            
            if (contentGetter) {
                return contentGetter(this.userWeekData, this.config.prebuiltAffirmations);
            }
            
            const practice = this.config.practices[practiceKey];
            return `
                <div class="lunar-popup-section">
                    <h3>Practice</h3>
                    <p>${practice.description}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error getting practice content:', error);
            return '<p>Error loading practice content</p>';
        }
    }

    /**
     * Close practice popup
     */
    closePracticePopup() {
        try {
            const popup = this.domCache.popup || 
                         document.querySelector('.lunar-practice-popup');
            if (popup) {
                popup.remove();
                this.domCache.popup = null;
            }
        } catch (error) {
            console.error('Error closing popup:', error);
        }
    }

    /**
     * Save intention practice with validation
     */
    saveIntentionPractice() {
        try {
            const intentionEl = document.getElementById('intentionText');
            const affirmationEl = document.getElementById('affirmationText');
            const releaseListEl = document.getElementById('releaseListText');

            if (!intentionEl || !affirmationEl || !releaseListEl) {
                console.error('Required form elements not found');
                return;
            }

            const intention = this._sanitizeInput(intentionEl.value);
            const affirmation = this._sanitizeInput(affirmationEl.value);
            const releaseList = this._sanitizeInput(releaseListEl.value);

            // Validate inputs
            const intentionValid = this._validateIntention(intention);
            const affirmationValid = this._validateAffirmation(affirmation);

            if (!intentionValid.valid) {
                if (window.Core) {
                    window.Core.showToast(intentionValid.error);
                }
                return;
            }

            if (!affirmationValid.valid) {
                if (window.Core) {
                    window.Core.showToast(affirmationValid.error);
                }
                return;
            }

            // Save data
            this.userWeekData.intention = intention;
            this.userWeekData.affirmation = affirmation;
            this.userWeekData.releaseList = releaseList;
            this.userWeekData.practiceCount++;
            
            this.saveUserWeekData(true); // Immediate save

            if (window.Core) {
                window.Core.showToast('✅ Practice saved');
            }

            this.closePracticePopup();
            this.renderRoomDashboard();

        } catch (error) {
            console.error('Error saving intention practice:', error);
            if (window.Core) {
                window.Core.showToast('Failed to save practice');
            }
        }
    }

    /**
     * Show locked practice message
     */
    showLockedMessage() {
        if (window.Core) {
            window.Core.showToast('✓ Practice completed for this cycle');
        }
    }

    // ============================================================================
    // COLLECTIVE INTENTION
    // ============================================================================

    /**
     * Show collective intention popup (Step 1)
     */
    showCollectiveIntentionPopup() {
        try {
            const popup = LunarUI.createPopup({
                icon: '🌙',
                title: 'Collective Intention Circle',
                subtitle: `Join others in ${this.config.collectiveFocus}`,
                content: this._getCollectiveStep1Content(),
                cssPrefix: this.config.cssPrefix,
                hasFooter: false,
                onClose: () => this.closeCollectivePopup()
            });

            const _popupTarget = document.getElementById('communityHubFullscreenContainer') || document.body;
            _popupTarget.appendChild(popup);
            this.domCache.popup = popup;

            // Attach listeners
            const beginBtn = popup.querySelector('[data-action="begin-collective"]');
            if (beginBtn) {
                beginBtn.addEventListener('click', this.startCollectiveStep2);
            }

            popup.addEventListener('click', this._handlePopupClick);

        } catch (error) {
            console.error('Error showing collective popup:', error);
        }
    }

    /**
     * Get collective step 1 content
     * @private
     * @returns {string} HTML content
     */
    _getCollectiveStep1Content() {
        return `
            <div class="lunar-popup-section" style="text-align: center;">
                <p>This practice creates space for collective intention.</p>
                <p>You will be guided through 5 steps:</p>
                <ol style="text-align: left; max-width: 500px; margin: 2rem auto;">
                    <li>Silent meditation (3 minutes)</li>
                    <li>Write your private intention</li>
                    <li>Choose one word for the collective</li>
                    <li>Silent witnessing (2 minutes)</li>
                    <li>Complete the practice</li>
                </ol>
                <button class="lunar-popup-btn" data-action="begin-collective">
                    Begin Practice
                </button>
            </div>
        `;
    }

    /**
     * Start collective step 2 (meditation)
     */
    startCollectiveStep2() {
        try {
            const content = document.getElementById('collectiveIntentionContent');
            if (!content) return;
            
            content.innerHTML = `
                <div class="lunar-popup-section" style="text-align: center;">
                    <h3>Step 1: Silent Meditation</h3>
                    <p>Take 3 minutes to center yourself before setting your intention.</p>
                    <div id="meditationTimer" class="lunar-timer-display">3:00</div>
                    <button id="startMeditationBtn" class="lunar-popup-btn" data-action="start-meditation">
                        Begin Meditation
                    </button>
                    <button id="skipToIntentionBtn" class="lunar-popup-btn lunar-btn-secondary" data-action="skip-meditation" style="display: none;">
                        Continue to Intention
                    </button>
                </div>
            `;

            // Attach listeners
            const startBtn = content.querySelector('[data-action="start-meditation"]');
            const skipBtn = content.querySelector('[data-action="skip-meditation"]');

            if (startBtn) {
                startBtn.addEventListener('click', this.startMeditationTimer);
            }
            if (skipBtn) {
                skipBtn.addEventListener('click', this.startCollectiveStep3);
            }

        } catch (error) {
            console.error('Error starting collective step 2:', error);
        }
    }

    /**
     * Start meditation timer
     */
    startMeditationTimer() {
        try {
            const startBtn = document.getElementById('startMeditationBtn');
            if (startBtn) startBtn.style.display = 'none';
            
            let timeLeft = LunarRoom.CONSTANTS.MEDITATION_DURATION;
            const timerDisplay = document.getElementById('meditationTimer');
            const skipBtn = document.getElementById('skipToIntentionBtn');

            if (!timerDisplay) return;

            this.collectiveTimer = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    this._clearTimer();
                    timerDisplay.textContent = 'Complete';
                    if (skipBtn) {
                        skipBtn.textContent = 'Continue to Intention';
                        skipBtn.style.display = 'block';
                    }
                }
            }, LunarRoom.CONSTANTS.TIMER_INTERVAL_MS);

            // Show skip button after 10 seconds
            setTimeout(() => {
                if (skipBtn) skipBtn.style.display = 'block';
            }, 10000);

        } catch (error) {
            console.error('Error starting meditation timer:', error);
            this._clearTimer();
        }
    }

    /**
     * Start collective step 3 (private intention)
     */
    startCollectiveStep3() {
        try {
            this._clearTimer();
            
            const content = document.getElementById('collectiveIntentionContent');
            if (!content) return;
            
            content.innerHTML = `
                <div class="lunar-popup-section">
                    <h3>Step 2: Your Private Intention</h3>
                    <p>Write your intention for this ${this.config.name} cycle. This remains private.</p>
                    <textarea 
                        id="privateIntentionText" 
                        class="lunar-textarea-large" 
                        placeholder="I intend to..."
                        maxlength="${LunarRoom.CONSTANTS.MAX_INTENTION_LENGTH}"
                    >${this._escapeHtml(this.userWeekData.privateIntention || '')}</textarea>
                    <button class="lunar-popup-btn" data-action="save-private-intention">
                        Continue
                    </button>
                </div>
            `;

            // Attach listener
            const continueBtn = content.querySelector('[data-action="save-private-intention"]');
            if (continueBtn) {
                continueBtn.addEventListener('click', this.startCollectiveStep4);
            }

        } catch (error) {
            console.error('Error starting collective step 3:', error);
        }
    }

    /**
     * Start collective step 4 (collective word)
     */
    startCollectiveStep4() {
        try {
            // Save private intention
            const intentionEl = document.getElementById('privateIntentionText');
            if (intentionEl) {
                this.userWeekData.privateIntention = this._sanitizeInput(intentionEl.value);
            }

            const content = document.getElementById('collectiveIntentionContent');
            if (!content) return;
            
            content.innerHTML = `
                <div class="lunar-popup-section">
                    <h3>Step 3: Choose One Word</h3>
                    <p>From your intention, choose one word to contribute to the collective field.</p>
                    
                    <div class="lunar-intention-preview">
                        <div class="lunar-preview-label">Your intention:</div>
                        <p>${this._escapeHtml(this.userWeekData.privateIntention || 'No intention set')}</p>
                    </div>

                    <input 
                        type="text" 
                        id="collectiveWordInput" 
                        class="lunar-word-input" 
                        placeholder="Your word..."
                        maxlength="${LunarRoom.CONSTANTS.MAX_WORD_LENGTH}"
                    />
                    <button class="lunar-popup-btn" data-action="submit-collective-word">
                        Plant Your Word
                    </button>
                </div>
            `;

            // Attach listener
            const submitBtn = content.querySelector('[data-action="submit-collective-word"]');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    const wordInput = document.getElementById('collectiveWordInput');
                    if (wordInput) {
                        this.submitWordToCollective(wordInput.value);
                    }
                });
            }

        } catch (error) {
            console.error('Error starting collective step 4:', error);
        }
    }

    /**
     * Submit word to collective with validation
     * @param {string} word - User's collective word
     */
    submitWordToCollective(word) {
        try {
            const sanitized = this._sanitizeInput(word);
            const validation = this._validateCollectiveWord(sanitized);

            if (!validation.valid) {
                if (window.Core) {
                    window.Core.showToast(validation.error);
                }
                return;
            }

            this.userWeekData.collectiveWord = sanitized;
            this.userWeekData.intentionShared = true;

            if (!this.collectiveWords) {
                this.collectiveWords = this.getMockCollectiveWords();
            }
            this.collectiveWords.push({ word: sanitized, timestamp: Date.now() });

            // ── Persist to Supabase ────────────────────────────────────────
            if (window.CommunityDB && CommunityDB.ready) {
                const collectiveRoomId = `${this._getLunarRoomId()}-collective`;
                CommunityDB.sendRoomMessage(collectiveRoomId, sanitized).catch(err => {
                    console.error('[LunarRoom] submitWordToCollective DB error:', err);
                });
            }

            this.startCollectiveStep5();

        } catch (error) {
            console.error('Error submitting collective word:', error);
            if (window.Core) {
                window.Core.showToast('Failed to submit word');
            }
        }
    }

    /**
     * Start collective step 5 (witnessing)
     */
    startCollectiveStep5() {
        try {
            const content = document.getElementById('collectiveIntentionContent');
            if (!content) return;
            
            content.innerHTML = `
                <div class="lunar-popup-section" style="text-align: center;">
                    <h3>Step 4: Collective Intention Field</h3>
                    <p style="margin-bottom: 2rem;">Your word has been planted. Witness the collective intentions emerging.</p>

                    <div id="wordCloud" class="lunar-word-cloud">
                        ${LunarUI.renderWordCloud(this.collectiveWords || this.getMockCollectiveWords())}
                    </div>

                    <p class="lunar-word-count">
                        <strong>${this.getCollectiveWordsCount()}</strong> intentions planted in this ${this.config.name} cycle
                    </p>

                    <div style="margin: 2rem 0;">
                        <h4 class="lunar-witness-title">Step 5: Silent Witnessing (2 min)</h4>
                        <div id="witnessingTimer" class="lunar-timer-small">2:00</div>
                        <button id="startWitnessingBtn" class="lunar-popup-btn" data-action="start-witnessing">
                            Begin Silent Witnessing
                        </button>
                        <button id="completeBtn" class="lunar-popup-btn lunar-btn-success" data-action="complete-collective" style="display: none;">
                            Complete Practice
                        </button>
                    </div>
                </div>
            `;

            // Attach listeners
            const startBtn = content.querySelector('[data-action="start-witnessing"]');
            const completeBtn = content.querySelector('[data-action="complete-collective"]');

            if (startBtn) {
                startBtn.addEventListener('click', this.startWitnessingTimer);
            }
            if (completeBtn) {
                completeBtn.addEventListener('click', this.completeCollectivePractice);
            }

        } catch (error) {
            console.error('Error starting collective step 5:', error);
        }
    }

    /**
     * Start witnessing timer
     */
    startWitnessingTimer() {
        try {
            const startBtn = document.getElementById('startWitnessingBtn');
            if (startBtn) startBtn.style.display = 'none';
            
            let timeLeft = LunarRoom.CONSTANTS.WITNESSING_DURATION;
            const timerDisplay = document.getElementById('witnessingTimer');

            if (!timerDisplay) return;

            this.collectiveTimer = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 0) {
                    this._clearTimer();
                    timerDisplay.textContent = 'Complete';
                    const completeBtn = document.getElementById('completeBtn');
                    if (completeBtn) {
                        completeBtn.style.display = 'block';
                    }
                }
            }, LunarRoom.CONSTANTS.TIMER_INTERVAL_MS);

        } catch (error) {
            console.error('Error starting witnessing timer:', error);
            this._clearTimer();
        }
    }

    /**
     * Complete collective practice
     */
    completeCollectivePractice() {
        try {
            this.userWeekData.practiceCount++;
            this.saveUserWeekData(true);

            if (window.Core) {
                window.Core.showToast('🌱 Intention planted with the collective');
            }

            this.closeCollectivePopup();
            this.renderRoomDashboard();

        } catch (error) {
            console.error('Error completing collective practice:', error);
        }
    }

    /**
     * Close collective popup
     */
    closeCollectivePopup() {
        try {
            this._clearTimer();
            const popup = this.domCache.popup || 
                         document.querySelector('.lunar-practice-popup');
            if (popup) {
                popup.remove();
                this.domCache.popup = null;
            }
        } catch (error) {
            console.error('Error closing collective popup:', error);
        }
    }

    /**
     * Enter group circle (alias for showCollectiveIntentionPopup)
     */
    enterGroupCircle() {
        this.showCollectiveIntentionPopup();
    }

    // ============================================================================
    // CLOSURE & CYCLE COMPLETION
    // ============================================================================

    /**
     * Submit cycle closure reflection
     */
    submitClosure() {
        try {
            const reflectionEl = document.getElementById('closureReflection');
            const reflection = reflectionEl ? 
                this._sanitizeInput(reflectionEl.value) : '';

            if (window.Core) {
                window.Core.showToast(this.config.completionMessage);
            }

            // Reset for next cycle
            this.userWeekData = this._getDefaultUserData();
            this.saveUserWeekData(true);
            
            // Navigate to hub
            if (window.Core) {
                window.Core.navigateTo('hubView');
            }

        } catch (error) {
            console.error('Error submitting closure:', error);
            if (window.Core) {
                window.Core.showToast('Failed to submit closure');
            }
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    /**
     * Clear active timer
     * @private
     */
    _clearTimer() {
        if (this.collectiveTimer) {
            clearInterval(this.collectiveTimer);
            this.collectiveTimer = null;
        }
    }

    /**
     * Escape HTML to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get living presence count — returns cached value synchronously (0 on first call).
     * Actual count is fetched async via _refreshLivePresence().
     * @returns {number}
     */
    getLivingPresenceCount() {
        return typeof this._cachedPresenceCount === 'number' ? this._cachedPresenceCount : 0;
    }

    /**
     * Fetch live participant count + real avatars from Supabase,
     * update DOM, and subscribe to realtime presence changes.
     * Called on enterRoom() and whenever the dashboard re-renders.
     * @private
     */
    async _refreshLivePresence() {
        if (!window.CommunityDB || !CommunityDB.ready) return;

        const roomId = this._getLunarRoomId();

        const _doRefresh = async () => {
            try {
                const participants = await CommunityDB.getRoomParticipants(roomId);
                const blocked      = await CommunityDB.getBlockedUsers();
                const visible      = participants.filter(p => !blocked.has(p.user_id));
                const count        = visible.length;

                this._cachedPresenceCount  = count;
                this._cachedParticipants   = visible;

                // ── Top bar live count ──────────────────────────────────────
                const topEl = document.getElementById('lunarLiveCountTop');
                if (topEl) topEl.textContent = `${count} members practicing with you now`;

                // ── Group circle count ──────────────────────────────────────
                const circleEl = document.querySelector('.lunar-live-presence span');
                if (circleEl) circleEl.textContent = `${count} members in circle`;

                // ── Group circle avatars ────────────────────────────────────
                const avatarEl = document.querySelector('.lunar-group-avatars');
                if (avatarEl) avatarEl.innerHTML = this._buildRealAvatars(visible);

            } catch (err) {
                console.warn('[LunarRoom] _refreshLivePresence error:', err);
            }
        };

        await _doRefresh();

        // Realtime subscription — update whenever presence changes
        if (this._presenceSub) {
            try { this._presenceSub.unsubscribe(); } catch(e) {}
        }
        this._presenceSub = CommunityDB.subscribeToPresence(_doRefresh);
    }

    /**
     * Build real user avatars from participant data (photo > emoji > initial).
     * @param {Array} participants
     * @returns {string} HTML string
     * @private
     */
    _buildRealAvatars(participants) {
        const MAX = 5;
        const shown = participants.slice(0, MAX);
        const overflow = participants.length - MAX;

        const avatarHTML = shown.map(p => {
            const profile = p.profiles || {};
            const name    = profile.name || profile.display_name || '?';
            const initial = name.charAt(0).toUpperCase();
            const gradient = window.Core?.getAvatarGradient
                ? Core.getAvatarGradient(p.user_id)
                : `background: #8B7AFF`;

            let inner;
            if (profile.avatar_url) {
                inner = `<img src="${profile.avatar_url}" alt="${initial}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
            } else if (profile.emoji) {
                inner = `<span style="font-size:18px;">${profile.emoji}</span>`;
            } else {
                inner = `<span style="font-size:14px;font-weight:600;">${initial}</span>`;
            }

            return `<div class="lunar-avatar" style="${gradient};display:flex;align-items:center;justify-content:center;" aria-label="${name}">${inner}</div>`;
        }).join('');

        const overflowHTML = overflow > 0
            ? `<div class="lunar-avatar" style="background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;">+${overflow}</div>`
            : `<div class="lunar-avatar lunar-join-avatar" aria-label="Join circle"><span>+</span></div>`;

        return avatarHTML + overflowHTML;
    }

    /**
     * Get mock collective words (replace with API call in production)
     * @returns {Array} Array of word objects
     */
    getMockCollectiveWords() {
        const now = Date.now();
        return [
            { word: 'Growth', timestamp: now - 86400000 },
            { word: 'Peace', timestamp: now - 72000000 },
            { word: 'Courage', timestamp: now - 43200000 },
            { word: 'Clarity', timestamp: now - 36000000 },
            { word: 'Healing', timestamp: now - 21600000 },
            { word: 'Trust', timestamp: now - 18000000 },
            { word: 'Love', timestamp: now - 14400000 },
            { word: 'Balance', timestamp: now - 7200000 },
            { word: 'Freedom', timestamp: now - 3600000 },
            { word: 'Joy', timestamp: now - 1800000 }
        ];
    }

    /**
     * Get collective words count
     * @returns {number} Count of words
     */
    getCollectiveWordsCount() {
        const words = this.collectiveWords || this.getMockCollectiveWords();
        return words.length;
    }

    // ============================================================================
    // SUPABASE INTEGRATION HELPERS (PRIVATE)
    // ============================================================================

    /**
     * Derive the Supabase/DB room_id for this lunar phase.
     * Maps cssPrefix → hyphenated room ID used in community_presence.
     * @private
     * @returns {string}
     */
    _getLunarRoomId() {
        const map = {
            newmoon:    'new-moon',
            waxingmoon: 'waxing-moon',
            fullmoon:   'full-moon',
            waningmoon: 'waning-moon'
        };
        return map[this.config.cssPrefix] || this.config.cssPrefix;
    }

    /**
     * Update Supabase presence to show user is in this lunar room.
     * @private
     */
    _setPresence() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const roomId   = this._getLunarRoomId();
            const activity = `${this.config.emoji} ${this.config.name}`;
            CommunityDB.setPresence('online', activity, roomId);

            if (window.Core?.state) {
                Core.state.currentRoom = roomId;
                if (Core.state.currentUser) Core.state.currentUser.activity = activity;
            }
        } catch (err) {
            console.error('[LunarRoom] _setPresence error:', err);
        }
    }

    /**
     * Reset Supabase presence back to "available at hub".
     * @private
     */
    _clearPresence() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            CommunityDB.setPresence('online', '✨ Available', null);

            if (window.Core?.state) {
                Core.state.currentRoom = null;
                if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
            }
        } catch (err) {
            console.error('[LunarRoom] _clearPresence error:', err);
        }
    }

    /**
     * Load collective words from Supabase for this phase.
     * Falls back to mock data if DB unavailable.
     * Subscribes to realtime updates so new words appear live.
     * @private
     */
    async _loadCollectiveWords() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const collectiveRoomId = `${this._getLunarRoomId()}-collective`;

            const _doLoad = async () => {
                const rows = await CommunityDB.getRoomMessages(collectiveRoomId, 100);
                if (rows && rows.length > 0) {
                    this.collectiveWords = rows.map(row => ({
                        word:      row.message,
                        timestamp: new Date(row.created_at).getTime()
                    }));

                    // Update word cloud if currently visible
                    const cloudEl = document.getElementById('wordCloud');
                    if (cloudEl && window.LunarUI) {
                        cloudEl.innerHTML = LunarUI.renderWordCloud(this.collectiveWords);
                    }
                    const countEl = document.querySelector('.lunar-word-count strong');
                    if (countEl) countEl.textContent = this.collectiveWords.length;
                }
            };

            await _doLoad();

            // Realtime — new words from other users appear instantly
            if (this._collectiveWordsSub) {
                try { this._collectiveWordsSub.unsubscribe(); } catch(e) {}
            }
            this._collectiveWordsSub = CommunityDB.subscribeToRoomChat(collectiveRoomId, async () => {
                await _doLoad();
            });

        } catch (err) {
            console.warn('[LunarRoom] _loadCollectiveWords error:', err);
        }
    }

    /**
     * Cleanup method to be called before room destruction
     */
    cleanup() {
        this._clearTimer();
        this._removeEventListeners();
        if (this.saveDebounceTimer) {
            clearTimeout(this.saveDebounceTimer);
        }
        if (this._retryCheckTimeout) {
            clearTimeout(this._retryCheckTimeout);
        }
        if (this._presenceSub) {
            try { this._presenceSub.unsubscribe(); } catch(e) {}
            this._presenceSub = null;
        }
        if (this._collectiveWordsSub) {
            try { this._collectiveWordsSub.unsubscribe(); } catch(e) {}
            this._collectiveWordsSub = null;
        }
        this.domCache = { dynamicContent: null, popup: null };
    }
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

// Expose base class globally
window.LunarRoom = LunarRoom;

// Expose constants for external use
window.LunarRoom.CONSTANTS = LunarRoom.CONSTANTS;