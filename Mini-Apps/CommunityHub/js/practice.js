/**
 * PRACTICE.JS - Generic Practice Utilities
 * PATCHED: Real room chat via Supabase + presence updates on room enter/leave
 *
 * @version 2.0.0
 */

const Practice = {

    // ============================================================================
    // STATE
    // ============================================================================

    timerInterval:       null,
    affirmationInterval: null,
    ambientAudio:        null,
    audioContext:        null,
    fiveMinuteEnabled:   false,
    ambientEnabled:      false,
    isInitialized:       false,

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    config: {
        DEFAULT_DURATION:             1200,    // 20 minutes in seconds
        AFFIRMATION_INTERVAL:         120000,  // 2 minutes in ms
        AFFIRMATION_DISPLAY_DURATION: 4000,    // 4 seconds in ms
        FIVE_MINUTE_WARNING:          300,     // 5 minutes in seconds
        BELL_DURATION:                3,       // seconds
        AMBIENT_VOLUME:               0.3,
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
            tibetan: [ { freq: 200, gain: 0.4 }, { freq: 400, gain: 0.2 }, { freq: 600, gain: 0.1 } ],
            bell:    [ { freq: 880, gain: 0.3 }, { freq: 1760, gain: 0.15 }, { freq: 1320, gain: 0.1 } ],
            chimes:  [ { freq: 660, gain: 0.25 }, { freq: 880, gain: 0.25 }, { freq: 1100, gain: 0.2 } ],
            tingsha: [ { freq: 2640, gain: 0.2 }, { freq: 5280, gain: 0.1 } ],
            bowl:    [ { freq: 432, gain: 0.3 }, { freq: 864, gain: 0.15 } ],
            soft:    [ { freq: 660, gain: 0.2 }, { freq: 1320, gain: 0.1 } ],
            om:      [ { freq: 136, gain: 0.4 }, { freq: 272, gain: 0.2 } ]
        },
        // Room ID → friendly activity label for presence
        ROOM_ACTIVITIES: {
            'silent-room':    '🧘 Silent practice',
            'guided-room':    '🎧 Guided session',
            'breathwork-room':'💨 Breathwork',
            'campfire-room':  '🔥 Around the fire',
            'osho-room':      '🌀 Osho space',
            'deepwork-room':  '🎯 Deep work',
            'tarot-room':     '🔮 Tarot reading',
            'reiki-room':     '✨ Reiki session'
        }
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

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
    // ROOM CHAT — SUPABASE INTEGRATION
    // ============================================================================

    /**
     * Call this when entering a practice room.
     * Loads chat history, subscribes to live messages, updates presence.
     * @param {string} roomId  e.g. 'campfire-room'
     */
    async initRoomChat(roomId) {
        if (!roomId) return;

        try {
            // Update presence: user is now in this room
            const activity = this.config.ROOM_ACTIVITIES[roomId] || '🌿 In practice';
            await CommunityDB.setPresence('online', activity, roomId);

            if (Core?.state) {
                Core.state.currentRoom = roomId;
                if (Core.state.currentUser) Core.state.currentUser.activity = activity;
            }

            // Load existing messages
            const messages = await CommunityDB.getRoomMessages(roomId, 50);
            const container = document.getElementById('chatMessages');

            if (container) {
                if (messages.length > 0) {
                    container.innerHTML = messages.map(m => {
                        const isOwn = m.profiles?.id === Core?.state?.currentUser?.id;
                        return this._buildChatMsgHTML(m, isOwn);
                    }).join('');
                } else {
                    container.innerHTML = '<div class="chat-ephemeral-notice">Chat disappears when the room closes</div>';
                }
                container.scrollTop = container.scrollHeight;
            }

            // Subscribe to incoming messages from other users
            CommunityDB.subscribeToRoomChat(roomId, (msg) => {
                const isOwn = msg.profiles?.id === Core?.state?.currentUser?.id;
                if (!isOwn) {
                    // Own messages are added optimistically in sendChat()
                    this.addChatMessage(msg);
                }
            });

            console.log(`✓ Room chat initialized: ${roomId}`);

        } catch (error) {
            console.error('initRoomChat error:', error);
        }
    },

    /**
     * Call this when leaving a practice room.
     * Unsubscribes from chat, resets presence to hub.
     * @param {string} roomId
     */
    async cleanupRoomChat(roomId) {
        if (!roomId) return;
        try {
            CommunityDB.unsubscribeFromRoomChat(roomId);
            await CommunityDB.setPresence('online', '✨ Available', null);

            if (Core?.state) {
                Core.state.currentRoom = null;
                if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
            }

            console.log(`✓ Room chat cleaned up: ${roomId}`);
        } catch (error) {
            console.error('cleanupRoomChat error:', error);
        }
    },

    /**
     * Build HTML for a single chat message from a DB row.
     * @param {Object}  msgRow
     * @param {boolean} isOwn
     * @returns {string}
     */
    _buildChatMsgHTML(msgRow, isOwn) {
        const profile = msgRow.profiles || {};
        const name    = profile.name  || 'Member';
        const emoji   = profile.emoji || name.charAt(0).toUpperCase();
        const time    = new Date(msgRow.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="chat-msg ${isOwn ? 'own' : ''}">
                ${!isOwn ? `<div class="chat-msg-sender">${this.escapeHtml(emoji)} ${this.escapeHtml(name)}</div>` : ''}
                <div>${this.escapeHtml(msgRow.message)}</div>
                <div class="chat-msg-time ${isOwn ? 'chat-msg-time--own' : ''}">${time}</div>
            </div>`;
    },

    // ============================================================================
    // TIMER CONTROLS
    // ============================================================================

    toggleTimer() {
        if (!window.Core?.state) { console.error('Core not available'); return; }
        if (window.Core.state.timerRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    },

    startTimer() {
        if (!window.Core?.state) return;
        try {
            window.Core.state.timerRunning = true;
            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Pause';

            this.timerInterval = setInterval(() => {
                if (window.Core.state.timeLeft > 0) {
                    window.Core.state.timeLeft--;
                    this.updateTimerDisplay();

                    if (window.Core.state.timeLeft === this.config.FIVE_MINUTE_WARNING && this.fiveMinuteEnabled) {
                        this.playBell('soft');
                        window.Core.showToast?.('5 minutes remaining');
                    }

                    if (window.Core.state.timeLeft === 0) {
                        this.completeSession();
                    }
                }
            }, 1000);
        } catch (error) {
            console.error('Timer start error:', error);
        }
    },

    pauseTimer() {
        if (!window.Core?.state) return;
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

    resetTimer() {
        if (!window.Core?.state) return;
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

    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display || !window.Core?.state) return;
        try {
            display.textContent = this.formatTime(window.Core.state.timeLeft);
        } catch (error) {
            console.error('Timer display update error:', error);
        }
    },

    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs    = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    setDuration(minutes) {
        if (!window.Core?.state) return;
        if (typeof minutes !== 'number' || minutes <= 0) return;
        try {
            window.Core.state.timeLeft = minutes * 60;
            this.updateTimerDisplay();
            window.Core.showToast?.(`Timer set to ${minutes} minutes`);
        } catch (error) {
            console.error('Set duration error:', error);
        }
    },

    completeSession() {
        try {
            this.pauseTimer();
            this.playBell('tibetan');
            window.Core.showToast?.('✨ Session complete');
            setTimeout(() => this.showGratitude(), 1000);
        } catch (error) {
            console.error('Session completion error:', error);
        }
    },

    // ============================================================================
    // AMBIENT SOUND
    // ============================================================================

    toggleAmbient() {
        if (this.ambientEnabled) {
            this.stopAmbientSound();
        } else {
            this.playAmbientSound();
        }
    },

    playAmbientSound() {
        try {
            if (!this.ambientAudio) {
                this.ambientAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
                this.ambientAudio.loop   = true;
                this.ambientAudio.volume = this.config.AMBIENT_VOLUME;
            }
            this.ambientAudio.play().catch(err => {
                console.error('Audio play failed:', err);
                window.Core.showToast?.('Unable to play audio');
            });
            this.ambientEnabled = true;
            const btn = document.getElementById('ambientBtn');
            if (btn) btn.classList.add('active');
            window.Core.showToast?.('🎵 Ambient sound on');
        } catch (error) {
            console.error('Ambient sound play error:', error);
        }
    },

    stopAmbientSound() {
        try {
            if (this.ambientAudio) {
                this.ambientAudio.pause();
                this.ambientAudio.currentTime = 0;
            }
            this.ambientEnabled = false;
            const btn = document.getElementById('ambientBtn');
            if (btn) btn.classList.remove('active');
            window.Core.showToast?.('🔇 Ambient sound off');
        } catch (error) {
            console.error('Ambient sound stop error:', error);
        }
    },

    // ============================================================================
    // AFFIRMATIONS
    // ============================================================================

    toggleAffirmations() {
        if (this.affirmationInterval) {
            this.stopAffirmations();
        } else {
            this.startAffirmations();
        }
    },

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

            showAffirmation();
            this.affirmationInterval = setInterval(showAffirmation, this.config.AFFIRMATION_INTERVAL);

            const btn = document.getElementById('affirmationsBtn');
            if (btn) btn.classList.add('active');
            window.Core.showToast?.('💫 Affirmations enabled');
        } catch (error) {
            console.error('Affirmations start error:', error);
        }
    },

    stopAffirmations() {
        try {
            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;
            const container = document.getElementById('affirmationText');
            if (container) container.parentElement?.classList.remove('visible');
            const btn = document.getElementById('affirmationsBtn');
            if (btn) btn.classList.remove('active');
            window.Core.showToast?.('Affirmations disabled');
        } catch (error) {
            console.error('Affirmations stop error:', error);
        }
    },

    // ============================================================================
    // BELL SOUNDS
    // ============================================================================

    toggle5MinuteBell() {
        try {
            this.fiveMinuteEnabled = !this.fiveMinuteEnabled;
            const btn = document.getElementById('fiveMinuteBtn');
            if (btn) btn.classList.toggle('active', this.fiveMinuteEnabled);
            window.Core.showToast?.(this.fiveMinuteEnabled ? '🔔 5-minute bell enabled' : '🔕 5-minute bell disabled');
        } catch (error) {
            console.error('5-minute bell toggle error:', error);
        }
    },

    playBell(type = 'tibetan') {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const frequencies = this.config.SOUND_PROFILES[type] || this.config.SOUND_PROFILES.tibetan;
            frequencies.forEach(({ freq, gain }) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode   = this.audioContext.createGain();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
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

    showGratitude() {
        const container = document.getElementById('gratitudeContainer');
        if (container) container.classList.add('visible');
    },

    offerGratitude() {
        try {
            window.Core.showToast?.('🙏 Gratitude offered to the space');
            const container = document.getElementById('gratitudeContainer');
            if (container) container.classList.remove('visible');
        } catch (error) {
            console.error('Gratitude offer error:', error);
        }
    },

    // ============================================================================
    // CHAT UI
    // ============================================================================

    toggleChat() {
        try {
            const sidebar = document.getElementById('psSidebar');
            const fab     = document.getElementById('fabChat');
            if (sidebar) sidebar.classList.toggle('open');
            if (fab) fab.classList.toggle('hidden', sidebar?.classList.contains('open'));
        } catch (error) {
            console.error('Chat toggle error:', error);
        }
    },

    /**
     * Send a chat message.
     * Shows the message immediately (optimistic), then saves to Supabase.
     * Other users receive it via the realtime subscription in initRoomChat().
     */
    async sendChat() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const text   = input.value.trim();
        if (!text) return;

        const roomId = Core?.state?.currentRoom;
        if (!roomId) {
            console.warn('[Practice] sendChat: no currentRoom set');
            return;
        }

        try {
            // Optimistically add own message to the UI immediately
            const messagesContainer = document.getElementById('chatMessages');
            if (messagesContainer) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const msg  = document.createElement('div');
                msg.className = 'chat-msg own';
                msg.innerHTML = `
                    <div>${this.escapeHtml(text)}</div>
                    <div class="chat-msg-time chat-msg-time--own">${time}</div>`;
                messagesContainer.appendChild(msg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            input.value = '';

            // Persist to Supabase — realtime will echo to other users
            await CommunityDB.sendRoomMessage(roomId, text);

        } catch (error) {
            console.error('sendChat error:', error);
        }
    },

    /**
     * Add an incoming message from another user (called by realtime subscription).
     * @param {Object} messageData - DB row with profiles join
     */
    addChatMessage(messageData) {
        if (!messageData) return;
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        try {
            const html = this._buildChatMsgHTML(messageData, false);
            const div  = document.createElement('div');
            div.innerHTML = html;
            const el = div.firstElementChild;
            if (el) {
                messagesContainer.appendChild(el);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } catch (error) {
            console.error('Add chat message error:', error);
        }
    },

    // ============================================================================
    // EXIT & CLEANUP
    // ============================================================================

    confirmLeave() {
        try {
            const presenceCount = window.Core?.state?.presenceCount || 0;
            if (presenceCount === 1) {
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
            this.leavePractice();
        }
    },

    /**
     * Leave practice room — clean up room chat, then clean up everything else.
     */
    async leavePractice() {
        try {
            // Clean up room chat subscription and reset presence FIRST
            const roomId = Core?.state?.currentRoom;
            if (roomId) {
                await this.cleanupRoomChat(roomId);
            }

            // Clean up timer
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            if (window.Core?.state) {
                window.Core.state.timerRunning = false;
                window.Core.state.timeLeft     = this.config.DEFAULT_DURATION;
            }

            // Clean up affirmations
            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;

            // Stop ambient sound
            this.stopAmbientSound();

            // Reset UI
            this.resetUIElements();

            // Navigate back
            if (window.Core && typeof window.Core.navigateTo === 'function') {
                window.Core.navigateTo('hubView');
            }

            window.Core.showToast?.('You left the space');
            console.log('✓ Practice cleanup complete');

        } catch (error) {
            console.error('Leave practice error:', error);
        }
    },

    resetUIElements() {
        try {
            const display = document.getElementById('timerDisplay');
            if (display) display.textContent = '20:00';

            const btn = document.getElementById('timerBtn');
            if (btn) btn.textContent = 'Begin';

            const gratitude = document.getElementById('gratitudeContainer');
            if (gratitude) gratitude.classList.remove('visible');

            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.innerHTML = '<div class="chat-ephemeral-notice">Chat disappears when the room closes</div>';
            }

            const sidebar = document.getElementById('psSidebar');
            if (sidebar) sidebar.classList.remove('open');

            const fab = document.getElementById('fabChat');
            if (fab) fab.classList.remove('hidden');
        } catch (error) {
            console.error('UI reset error:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    cleanup() {
        try {
            clearInterval(this.timerInterval);
            clearInterval(this.affirmationInterval);
            this.stopAmbientSound();
            if (this.audioContext) {
                this.audioContext.close();
                this.audioContext = null;
            }
            this.timerInterval       = null;
            this.affirmationInterval = null;
            this.ambientAudio        = null;
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
