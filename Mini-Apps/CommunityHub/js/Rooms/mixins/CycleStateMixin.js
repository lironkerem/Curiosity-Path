/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CYCLE STATE MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin CycleStateMixin
 * @description Manages timed cycles with open/closed windows for practice rooms
 * @version 3.0.0
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, CycleStateMixin);
 * 
 * Requirements:
 *   - config.cycleDuration (in seconds)
 *   - config.openDuration (in seconds)
 *   - config.sessionDuration (in seconds)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const CycleStateMixin = {
    /**
     * Initialize cycle state
     */
    initCycleState() {
        this.state.isOpen = false;
        this.state.isInSession = false;
        this.state.cycleStartTime = null;
        this.state.nextOpenTime = null;
        this.state.nextSessionStart = null;
        
        this.cycleInterval = null;
        this.countdownInterval = null;
    },
    
    /**
     * Initialize the cycle timing
     * Call this in room's init() method
     */
    initializeCycle() {
        const now = Date.now();
        const cycleMs = this.config.cycleDuration * 1000;
        
        // Calculate current cycle start time
        const timeIntoCurrentCycle = now % cycleMs;
        this.state.cycleStartTime = now - timeIntoCurrentCycle;
        
        // Set current and next sessions (if room has sessions)
        if (this.setSessions) {
            this.setSessions(now);
        }
        
        this.calculateCycleState();
        
        // Clean up existing interval if present
        if (this.cycleInterval) clearInterval(this.cycleInterval);
        this.cycleInterval = setInterval(() => this.calculateCycleState(), 1000);
        
        // Update countdown every second
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        this.countdownInterval = setInterval(() => {
            this.calculateCycleState();
            this.updateRoomCard();
        }, 1000);
    },
    
    /**
     * Calculate current cycle state (open/closed)
     */
    calculateCycleState() {
        const now = Date.now();
        const cycleMs = this.config.cycleDuration * 1000;
        const openMs  = this.config.openDuration  * 1000;

        const timeIntoCycle = (now - this.state.cycleStartTime) % cycleMs;

        // Detect cycle boundary: timeIntoCycle wraps back near 0 → new cycle started.
        // Refresh cycleStartTime and sessions so current/next session titles stay accurate.
        const currentCycleStart = now - timeIntoCycle;
        if (currentCycleStart !== this.state.cycleStartTime) {
            this.state.cycleStartTime = currentCycleStart;
            if (this.setSessions) this.setSessions(now);
        }

        const isInOpenWindow = timeIntoCycle < openMs;

        this.state.isOpen      = isInOpenWindow;
        this.state.isInSession = !isInOpenWindow;

        // Calculate next state transition times
        if (isInOpenWindow) {
            const msUntilClose = openMs - timeIntoCycle;
            this.state.nextSessionStart = now + msUntilClose;
            this.state.nextOpenTime     = now + msUntilClose + (this.config.sessionDuration * 1000);
        } else {
            // Next open window = start of next cycle
            const msUntilNextCycle = cycleMs - timeIntoCycle;
            this.state.nextOpenTime     = now + msUntilNextCycle;
            this.state.nextSessionStart = null;
        }

        // Auto-start session if user is in room and session begins
        if (this.state.isInSession && !this.state.sessionStarted && this.isUserInRoom()) {
            if (this.startSession) this.startSession();
        }
    },
    
    /**
     * Check if user is currently in the room
     * @returns {boolean}
     */
    isUserInRoom() {
        return document.getElementById(`${this.roomId}View`) !== null;
    },
    
    /**
     * Override canEnterRoom for timed rooms.
     * Admins can always enter regardless of cycle state.
     * @returns {boolean}
     */
    canEnterRoom() {
        const isAdmin = Core.state?.currentUser?.is_admin === true;
        return isAdmin || this.state.isOpen;
    },

    /**
     * Raw cycle window check — no admin bypass.
     * Used by PracticeRoom._isWithinOpenWindow() for visual card state only
     * (border color, opacity, In Session badge).
     * @returns {boolean}
     */
    _checkCycleWindow() {
        return this.state.isOpen;
    },
    
    /**
     * Get countdown to next session start
     * @returns {string} Formatted countdown
     */
    getTimeUntilSessionStarts() {
        if (!this.state.nextSessionStart) return '';
        const diff = Math.max(0, this.state.nextSessionStart - Date.now());
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `Session begins in ${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    /**
     * Get countdown to next open window
     * @returns {string} Formatted countdown
     */
    getCountdownToNextOpen() {
        if (!this.state.nextOpenTime) return '';
        const diff = Math.max(0, this.state.nextOpenTime - Date.now());
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `Opens in ${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    /**
     * Get timer text for room card
     * @returns {string} Timer HTML
     */
    getTimerText() {
        const nextSession = this.getNextSession ? this.getNextSession() : null;
        const nextTitle = nextSession ? nextSession.title : 'Next Session';
        
        return `<strong>Next:</strong> ${nextTitle}<br>${this.state.isOpen ? (this.getTimeUntilSessionStarts() || '') : (this.getCountdownToNextOpen() || '')}`;
    },
    
    /**
     * Build schedule link for room card
     * @returns {string} Schedule link HTML
     */
    buildScheduleLink() {
        return `
        <div class="view-schedule" 
             onclick="event.stopPropagation(); ${this.getClassName()}.showScheduleModal()" 
             style="text-align: center; font-size: 11px; color: var(--text-secondary); text-decoration: underline; cursor: pointer; margin: 0; padding: 0;">
            📅 View Schedule
        </div>`;
    },
    
    /**
     * Cleanup cycle intervals
     */
    cleanupCycle() {
        if (this.cycleInterval) {
            clearInterval(this.cycleInterval);
            this.cycleInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.CycleStateMixin = CycleStateMixin;
