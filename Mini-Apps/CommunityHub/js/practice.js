/**
 * PRACTICE.JS - Generic Practice Utilities
 * 
 * Provides shared functionality for all practice rooms:
 * - Timer controls and management
 * - Bell sounds (multiple types)
 * - Ambient sound playback
 * - Affirmation display system
 * - Chat functionality
 * - Session completion and gratitude
 * - Clean exit and resource cleanup
 * 
 * Room-specific logic is handled in individual room modules.
 * 
 * @version 1.0.0
 */

const Practice = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    timerInterval: null,
    affirmationInterval: null,
    ambientAudio: null,
    audioContext: null,
    fiveMinuteEnabled: false,
    ambientEnabled: false,
    isInitialized: false,

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        DEFAULT_DURATION: 1200, // 20 minutes in seconds
        AFFIRMATION_INTERVAL: 120000, // 2 minutes in ms
        AFFIRMATION_DISPLAY_DURATION: 4000, // 4 seconds in ms
        FIVE_MINUTE_WARNING: 300, // 5 minutes in seconds
        BELL_DURATION: 3, // seconds
        AMBIENT_VOLUME: 0.3,
        AFFIRMATIONS: [
            "I am present in this moment",
            "Peace flows through me",
            "I am exactly where I need to be",
            "My breath guides me home",
            "I release what no longer serves me",
            "I am connected to all things",
            "Stillness is my power",
            "I trust the journey"
        ],
        SOUND_PROFILES: {
            tibetan: [
                { freq: 200, gain: 0.4 },
                { freq: 400, gain: 0.2 },
                { freq: 600, gain: 0.1 }
            ],
            bell: [
                { freq: 880, gain: 0.3 },
                { freq: 1760, gain: 0.15 },
                { freq: 1320, gain: 0.1 }
            ],
            chimes: [
                { freq: 660, gain: 0.25 },
                { freq: 880, gain: 0.25 },
                { freq: 1100, gain: 0.2 }
            ],
            tingsha: [
                { freq: 2640, gain: 0.2 },
                { freq: 5280, gain: 0.1 }
            ],
            bowl: [
                { freq: 432, gain: 0.3 },
                { freq: 864, gain: 0.15 }
            ],
            soft: [
                { freq: 660, gain: 0.2 },
                { freq: 1320, gain: 0.1 }
            ],
            om: [
                { freq: 136, gain: 0.4 },
                { freq: 272, gain: 0.2 }
            ]
        }
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize Practice module
     */
    init() {
        if (this.isInitialized) {
            console.warn('Practice module already initialized');
            return;
        }

        try {
            console.log('🧘 Practice Module Loaded');
            this.isInitialized = true;
        } catch (error) {
            console.error('Practice initialization failed:', error);
        }
    },

    // ============================================================================
    // TIMER CONTROLS
    // ============================================================================
    
    /**
     * Toggle timer between running and paused
     */
    toggleTimer() {
        if (!window.Core || !window.Core.state) {
            console.error('Core not available');
            return;
        }

        if (window.Core.state.timerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    },
    
    /**
     * Start the practice timer
     */
    startTimer() {
        if (!window.Core || !window.Core.state) {
            console.error('Core not available');
            return;
        }

        try {
            window.Core.state.timerRunning = true;
            
            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Pause';
            
            this.timerInterval = setInterval(() => {
                if (window.Core.state.timeLeft > 0) {
                    window.Core.state.timeLeft--;
                    this.updateTimerDisplay();
                    
                    // 5-minute warning
                    if (window.Core.state.timeLeft === this.config.FIVE_MINUTE_WARNING && this.fiveMinuteEnabled) {
                        this.playBell('soft');
                        if (typeof window.Core.showToast === 'function') {
                            window.Core.showToast('5 minutes remaining');
                        }
                    }
                    
                    // Session complete
                    if (window.Core.state.timeLeft === 0) {
                        this.completeSession();
                    }
                }
            }, 1000);
            
        } catch (error) {
            console.error('Timer start error:', error);
        }
    },
    
    /**
     * Pause the practice timer
     */
    pauseTimer() {
        if (!window.Core || !window.Core.state) return;

        try {
            window.Core.state.timerRunning = false;
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            
            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Resume';
            
        } catch (error) {
            console.error('Timer pause error:', error);
        }
    },
    
    /**
     * Reset timer to default duration
     */
    resetTimer() {
        if (!window.Core || !window.Core.state) return;

        try {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            
            window.Core.state.timerRunning = false;
            window.Core.state.timeLeft = this.config.DEFAULT_DURATION;
            
            this.updateTimerDisplay();
            
            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Begin';
            
        } catch (error) {
            console.error('Timer reset error:', error);
        }
    },
    
    /**
     * Update timer display element
     */
    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display || !window.Core || !window.Core.state) return;
        
        try {
            const timeStr = this.formatTime(window.Core.state.timeLeft);
            display.textContent = timeStr;
        } catch (error) {
            console.error('Timer display update error:', error);
        }
    },

    /**
     * Format seconds into MM:SS
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) {
            return '0:00';
        }
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    /**
     * Set timer duration
     * @param {number} minutes - Duration in minutes
     */
    setDuration(minutes) {
        if (!window.Core || !window.Core.state) return;
        if (typeof minutes !== 'number' || minutes <= 0) {
            console.error('Invalid duration:', minutes);
            return;
        }

        try {
            window.Core.state.timeLeft = minutes * 60;
            this.updateTimerDisplay();
            
            if (typeof window.Core.showToast === 'function') {
                window.Core.showToast(`Timer set to ${minutes} minutes`);
            }
        } catch (error) {
            console.error('Set duration error:', error);
        }
    },
    
    /**
     * Complete the practice session
     */
    completeSession() {
        try {
            this.pauseTimer();
            this.playBell('tibetan');
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('✨ Session complete');
            }
            
            // Show gratitude prompt after a delay
            setTimeout(() => this.showGratitude(), 1000);
            
        } catch (error) {
            console.error('Session completion error:', error);
        }
    },

    // ============================================================================
    // AMBIENT SOUND
    // ============================================================================
    
    /**
     * Toggle ambient sound on/off
     */
    toggleAmbient() {
        if (this.ambientEnabled) {
            this.stopAmbientSound();
        } else {
            this.playAmbientSound();
        }
    },
    
    /**
     * Play ambient sound
     */
    playAmbientSound() {
        try {
            if (!this.ambientAudio) {
                this.ambientAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                this.ambientAudio.loop = true;
                this.ambientAudio.volume = this.config.AMBIENT_VOLUME;
            }
            
            this.ambientAudio.play().catch(err => {
                console.error('Audio play failed:', err);
                if (typeof window.Core?.showToast === 'function') {
                    window.Core.showToast('Unable to play audio');
                }
            });
            
            this.ambientEnabled = true;
            
            const btn = document.getElementById('ambientBtn');
            if (btn) btn.classList.add('active');
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('🎵 Ambient sound on');
            }
            
        } catch (error) {
            console.error('Ambient sound play error:', error);
        }
    },
    
    /**
     * Stop ambient sound
     */
    stopAmbientSound() {
        try {
            if (this.ambientAudio) {
                this.ambientAudio.pause();
                this.ambientAudio.currentTime = 0;
            }
            
            this.ambientEnabled = false;
            
            const btn = document.getElementById('ambientBtn');
            if (btn) btn.classList.remove('active');
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('🔇 Ambient sound off');
            }
            
        } catch (error) {
            console.error('Ambient sound stop error:', error);
        }
    },

    // ============================================================================
    // AFFIRMATIONS
    // ============================================================================
    
    /**
     * Toggle affirmations on/off
     */
    toggleAffirmations() {
        if (this.affirmationInterval) {
            this.stopAffirmations();
        } else {
            this.startAffirmations();
        }
    },
    
    /**
     * Start displaying affirmations
     */
    startAffirmations() {
        try {
            let index = 0;
            const container = document.getElementById('affirmationText');
            
            const showAffirmation = () => {
                if (container) {
                    container.textContent = this.config.AFFIRMATIONS[index];
                    container.parentElement?.classList.add('visible');
                    
                    setTimeout(() => {
                        container.parentElement?.classList.remove('visible');
                    }, this.config.AFFIRMATION_DISPLAY_DURATION);
                }
                index = (index + 1) % this.config.AFFIRMATIONS.length;
            };
            
            showAffirmation(); // Show first one immediately
            this.affirmationInterval = setInterval(showAffirmation, this.config.AFFIRMATION_INTERVAL);
            
            const btn = document.getElementById('affirmationsBtn');
            if (btn) btn.classList.add('active');
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('💫 Affirmations enabled');
            }
            
        } catch (error) {
            console.error('Affirmations start error:', error);
        }
    },
    
    /**
     * Stop displaying affirmations
     */
    stopAffirmations() {
        try {
            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;
            
            const container = document.getElementById('affirmationText');
            if (container) {
                container.parentElement?.classList.remove('visible');
            }
            
            const btn = document.getElementById('affirmationsBtn');
            if (btn) btn.classList.remove('active');
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('Affirmations disabled');
            }
            
        } catch (error) {
            console.error('Affirmations stop error:', error);
        }
    },

    // ============================================================================
    // BELL SOUNDS
    // ============================================================================
    
    /**
     * Toggle 5-minute warning bell
     */
    toggle5MinuteBell() {
        try {
            this.fiveMinuteEnabled = !this.fiveMinuteEnabled;
            
            const btn = document.getElementById('fiveMinuteBtn');
            if (btn) btn.classList.toggle('active', this.fiveMinuteEnabled);
            
            const message = this.fiveMinuteEnabled 
                ? '🔔 5-minute bell enabled' 
                : '🔕 5-minute bell disabled';
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast(message);
            }
            
        } catch (error) {
            console.error('5-minute bell toggle error:', error);
        }
    },
    
    /**
     * Play a bell sound using Web Audio API
     * @param {string} type - Bell type (tibetan, bell, chimes, etc.)
     */
    playBell(type = 'tibetan') {
        try {
            // Create or reuse audio context
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const frequencies = this.config.SOUND_PROFILES[type] || this.config.SOUND_PROFILES.tibetan;
            
            frequencies.forEach(({ freq, gain }) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                
                // Bell envelope - quick attack, long decay
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(gain, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + this.config.BELL_DURATION);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + this.config.BELL_DURATION);
            });
            
        } catch (error) {
            console.error('Bell play error:', error);
        }
    },

    // ============================================================================
    // GRATITUDE
    // ============================================================================
    
    /**
     * Show gratitude prompt
     */
    showGratitude() {
        const container = document.getElementById('gratitudeContainer');
        if (container) {
            container.classList.add('visible');
        }
    },

    /**
     * Offer gratitude and close prompt
     */
    offerGratitude() {
        try {
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('🙏 Gratitude offered to the space');
            }
            
            const container = document.getElementById('gratitudeContainer');
            if (container) {
                container.classList.remove('visible');
            }
            
        } catch (error) {
            console.error('Gratitude offer error:', error);
        }
    },

    // ============================================================================
    // CHAT FUNCTIONALITY
    // ============================================================================
    
    /**
     * Toggle chat sidebar
     */
    toggleChat() {
        try {
            const sidebar = document.getElementById('psSidebar');
            const fab = document.getElementById('fabChat');
            
            if (sidebar) sidebar.classList.toggle('open');
            if (fab) fab.classList.toggle('hidden', sidebar?.classList.contains('open'));
            
        } catch (error) {
            console.error('Chat toggle error:', error);
        }
    },

    /**
     * Send a chat message
     */
    sendChat() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        
        try {
            const text = input.value.trim();
            if (!text) return;
            
            const messagesContainer = document.getElementById('chatMessages');
            if (!messagesContainer) return;
            
            // Create message element
            const msg = document.createElement('div');
            msg.className = 'chat-msg own';
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            msg.innerHTML = `
                <div>${this.escapeHtml(text)}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px; text-align: right;">${time}</div>
            `;
            
            messagesContainer.appendChild(msg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            input.value = '';
            
            // TODO: Send to backend
            // if (window.SupabaseClient) {
            //     SupabaseClient.sendChatMessage(roomId, text);
            // }
            
        } catch (error) {
            console.error('Chat send error:', error);
        }
    },

    /**
     * Add an incoming chat message
     * @param {Object} messageData - Message data object
     */
    addChatMessage(messageData) {
        if (!messageData) return;
        
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;
        
        try {
            const msg = document.createElement('div');
            msg.className = 'chat-msg';
            
            msg.innerHTML = `
                <div>${this.escapeHtml(messageData.message || '')}</div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${this.escapeHtml(messageData.created_at || '')}</div>
            `;
            
            messagesContainer.appendChild(msg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
        } catch (error) {
            console.error('Add chat message error:', error);
        }
    },

    // ============================================================================
    // EXIT & CLEANUP
    // ============================================================================
    
    /**
     * Confirm leave - check if last person in room
     */
    confirmLeave() {
        try {
            const presenceCount = window.Core?.state?.presenceCount || 0;
            
            if (presenceCount === 1) {
                // Last person - show closing ritual if available
                if (window.Rituals && typeof window.Rituals.showClosing === 'function') {
                    window.Rituals.showClosing();
                } else {
                    this.leavePractice();
                }
            } else {
                this.leavePractice();
            }
            
        } catch (error) {
            console.error('Confirm leave error:', error);
            this.leavePractice(); // Fallback to direct leave
        }
    },

    /**
     * Leave practice and clean up all resources
     */
    leavePractice() {
        try {
            // Clean up timer
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            
            if (window.Core && window.Core.state) {
                window.Core.state.timerRunning = false;
                window.Core.state.timeLeft = this.config.DEFAULT_DURATION;
            }
            
            // Clean up affirmations
            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;
            
            // Stop ambient sound
            this.stopAmbientSound();
            
            // Reset UI elements
            this.resetUIElements();
            
            // Navigate back to hub
            if (window.Core && typeof window.Core.navigateTo === 'function') {
                window.Core.navigateTo('hubView');
            }
            
            if (typeof window.Core?.showToast === 'function') {
                window.Core.showToast('You left the space');
            }
            
            console.log('✓ Practice cleanup complete');
            
        } catch (error) {
            console.error('Leave practice error:', error);
        }
    },

    /**
     * Reset all UI elements to initial state
     */
    resetUIElements() {
        try {
            // Timer display
            const display = document.getElementById('timerDisplay');
            if (display) display.textContent = '20:00';
            
            // Timer button
            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Begin';
            
            // Hide gratitude
            const gratitude = document.getElementById('gratitudeContainer');
            if (gratitude) gratitude.classList.remove('visible');
            
            // Clear and reset chat
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '<div style="text-align: center; color: var(--text-muted); font-size: 12px; margin: 20px 0; font-style: italic;">Chat disappears when the room closes</div>';
            }
            
            // Close sidebar
            const sidebar = document.getElementById('psSidebar');
            if (sidebar) sidebar.classList.remove('open');
            
            // Show fab
            const fab = document.getElementById('fabChat');
            if (fab) fab.classList.remove('hidden');
            
        } catch (error) {
            console.error('UI reset error:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Clean up all Practice resources
     */
    cleanup() {
        try {
            clearInterval(this.timerInterval);
            clearInterval(this.affirmationInterval);
            this.stopAmbientSound();
            
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            
            this.timerInterval = null;
            this.affirmationInterval = null;
            this.ambientAudio = null;
            
            console.log('✓ Practice resources cleaned up');
            
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.Practice = Practice;
