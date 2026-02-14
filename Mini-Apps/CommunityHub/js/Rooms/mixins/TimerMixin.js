/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TIMER MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin TimerMixin
 * @description Adds countdown timer functionality to practice rooms
 * @version 3.0.0
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, TimerMixin);
 * 
 * Features:
 *   - Countdown timer with visual ring
 *   - Start/pause/stop controls
 *   - Time adjustment
 *   - Completion callback
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TimerMixin = {
    /**
     * Initialize timer state
     * @param {number} defaultTime - Default time in seconds (default: 1200 = 20 min)
     */
    initTimerState(defaultTime = 1200) {
        this.state.timerRunning = false;
        this.state.timeLeft = defaultTime;
        this.state.initialTime = defaultTime;
        this.timerInterval = null;
    },
    
    /**
     * Toggle timer start/pause
     */
    toggleTimer() {
        if (this.state.timerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    },
    
    /**
     * Start the timer
     */
    startTimer() {
        if (this.state.timerRunning) return;
        
        this.state.timerRunning = true;
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = 'Pause';
        
        this.timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimerDisplay();
            this.updateTimerRing();
            
            // Check for 5-minute bell
            if (this.state.timeLeft % 300 === 0 && this.state.timeLeft > 0) {
                if (this.state.fiveMinBellEnabled && this.play5MinBell) {
                    this.play5MinBell();
                }
            }
            
            // Timer complete
            if (this.state.timeLeft <= 0) {
                this.completeTimer();
            }
        }, 1000);
        
        Core.showToast('Timer started');
    },
    
    /**
     * Pause the timer
     */
    pauseTimer() {
        this.stopTimer();
        this.state.timerRunning = false;
        
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = 'Continue';
        
        Core.showToast('Timer paused');
    },
    
    /**
     * Stop the timer (clear interval but keep state)
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    
    /**
     * Complete the timer
     */
    completeTimer() {
        this.stopTimer();
        this.state.timerRunning = false;
        this.state.timeLeft = 0;
        
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = 'Complete';
        
        // Play completion sound if available
        if (this.playCompletionSound) {
            this.playCompletionSound();
        }
        
        Core.showToast('🎉 Session complete!');
        
        // Call custom completion callback
        if (this.onTimerComplete) {
            this.onTimerComplete();
        }
    },
    
    /**
     * Reset the timer
     */
    resetTimer() {
        this.stopTimer();
        this.state.timerRunning = false;
        this.state.timeLeft = this.state.initialTime;
        
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = 'Begin';
        
        this.updateTimerDisplay();
        this.updateTimerRing();
    },
    
    /**
     * Adjust timer by minutes
     * @param {number} minutes - Minutes to add/subtract
     */
    adjustTime(minutes) {
        if (this.state.timerRunning) return;
        
        this.state.timeLeft = Math.max(60, this.state.timeLeft + (minutes * 60));
        this.state.timeLeft = Math.min(7200, this.state.timeLeft); // Max 120 minutes
        this.state.initialTime = this.state.timeLeft;
        
        this.updateTimerDisplay();
        this.updateTimerRing();
    },
    
    /**
     * Update timer display
     */
    updateTimerDisplay() {
        const display = document.getElementById(`${this.roomId}TimerDisplay`);
        if (display) {
            display.textContent = this.formatTime(this.state.timeLeft);
        }
    },
    
    /**
     * Update timer ring progress
     */
    updateTimerRing() {
        const ring = document.getElementById(`${this.roomId}TimerRing`);
        if (!ring) return;
        
        const progress = (this.state.timeLeft / this.state.initialTime) * 100;
        const circumference = 2 * Math.PI * 180; // radius = 180
        const offset = circumference - (progress / 100) * circumference;
        
        ring.style.strokeDashoffset = offset;
    },
    
    /**
     * Build timer container HTML
     * @returns {string} Timer HTML
     */
    buildTimerContainer() {
        return `
        <div style="position: relative; width: 400px; height: 400px; margin-bottom: 40px;">
            <!-- Timer Ring SVG -->
            <svg width="400" height="400" viewBox="0 0 400 400" style="transform: rotate(-90deg); position: absolute; top: 0; left: 0; z-index: 2;">
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                <circle cx="200" cy="200" r="180" fill="none" stroke="url(#timerGradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1131" stroke-dashoffset="0" id="${this.roomId}TimerRing"/>
                <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#a78bfa"/>
                        <stop offset="100%" stop-color="#c084fc"/>
                    </linearGradient>
                </defs>
            </svg>
            
            <!-- Timer Display -->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 3;">
                <div id="${this.roomId}TimerDisplay" style="font-size: 84px; font-weight: 200; letter-spacing: 0.05em; margin-bottom: 8px;">${this.formatTime(this.state.timeLeft)}</div>
                <div style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.6;">in silence</div>
            </div>
        </div>`;
    },
    
    /**
     * Build timer controls HTML
     * @returns {string} Controls HTML
     */
    buildTimerControls() {
        return `
        <div class="timer-controls">
            <button class="t-btn" onclick="${this.getClassName()}.adjustTime(-5)">-5m</button>
            <button class="t-btn primary" onclick="${this.getClassName()}.toggleTimer()" id="${this.roomId}TimerBtn">Begin</button>
            <button class="t-btn" onclick="${this.getClassName()}.adjustTime(5)">+5m</button>
        </div>`;
    },
    
    /**
     * Cleanup timer on room exit
     */
    cleanupTimer() {
        this.stopTimer();
        this.state.timerRunning = false;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.TimerMixin = TimerMixin;
