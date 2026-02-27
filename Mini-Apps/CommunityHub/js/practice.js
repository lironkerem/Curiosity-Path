/**
 * PRACTICE.JS - Generic Practice Utilities
 * @version 2.1.0
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
        DEFAULT_DURATION:             1200,
        AFFIRMATION_INTERVAL:         120000,
        AFFIRMATION_DISPLAY_DURATION: 4000,
        FIVE_MINUTE_WARNING:          300,
        BELL_DURATION:                3,
        AMBIENT_VOLUME:               0.3,
        EMPTY_CHAT_HTML:              '<div style="text-align:center;color:var(--text-muted);font-size:12px;margin:20px 0;font-style:italic">Chat disappears when the room closes</div>',
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
        ROOM_ACTIVITIES: {
            'silent-room':     '🧘 Silent practice',
            'guided-room':     '🎧 Guided session',
            'breathwork-room': '💨 Breathwork',
            'campfire-room':   '🔥 Around the fire',
            'osho-room':       '🌀 Osho space',
            'deepwork-room':   '🎯 Deep work',
            'tarot-room':      '🔮 Tarot reading',
            'reiki-room':      '✨ Reiki session'
        }
    },

    // ============================================================================
    // DOM CACHE — populated on first access via _el()
    // ============================================================================

    _domCache: {},

    /** Returns a cached DOM element, or null. */
    _el(id) {
        if (!(id in this._domCache)) {
            this._domCache[id] = document.getElementById(id);
        }
        return this._domCache[id];
    },

    /** Call when leaving a room to bust stale references. */
    _clearDomCache() {
        this._domCache = {};
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    init() {
        if (this.isInitialized) {
            console.warn('Practice module already initialized');
            return;
        }
        console.log('🧘 Practice Module Loaded');
        this.isInitialized = true;
    },

    // ============================================================================
    // ROOM CHAT — SUPABASE INTEGRATION
    // ============================================================================

    async initRoomChat(roomId) {
        if (!roomId) return;
        try {
            const activity = this.config.ROOM_ACTIVITIES[roomId] || '🌿 In practice';
            await CommunityDB.setPresence('online', activity, roomId);

            const coreState = window.Core?.state;
            if (coreState) {
                coreState.currentRoom = roomId;
                if (coreState.currentUser) coreState.currentUser.activity = activity;
            }

            const messages   = await CommunityDB.getRoomMessages(roomId, 50);
            const container  = this._el('chatMessages');

            if (container) {
                const userId = window.Core?.state?.currentUser?.id;
                container.innerHTML = messages.length
                    ? messages.map(m => this._buildChatMsgHTML(m, m.profiles?.id === userId)).join('')
                    : this.config.EMPTY_CHAT_HTML;
                container.scrollTop = container.scrollHeight;
            }

            CommunityDB.subscribeToRoomChat(roomId, (msg) => {
                if (msg.profiles?.id !== window.Core?.state?.currentUser?.id) {
                    this.addChatMessage(msg);
                }
            });

            console.log(`✓ Room chat initialized: ${roomId}`);
        } catch (error) {
            console.error('initRoomChat error:', error);
        }
    },

    async cleanupRoomChat(roomId) {
        if (!roomId) return;
        try {
            CommunityDB.unsubscribeFromRoomChat(roomId);
            await CommunityDB.setPresence('online', '✨ Available', null);

            const coreState = window.Core?.state;
            if (coreState) {
                coreState.currentRoom = null;
                if (coreState.currentUser) coreState.currentUser.activity = '✨ Available';
            }

            console.log(`✓ Room chat cleaned up: ${roomId}`);
        } catch (error) {
            console.error('cleanupRoomChat error:', error);
        }
    },

    _buildChatMsgHTML(msgRow, isOwn) {
        const profile = msgRow.profiles || {};
        const name    = profile.name  || 'Member';
        const emoji   = profile.emoji || name.charAt(0).toUpperCase();
        const time    = new Date(msgRow.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `
            <div class="chat-msg${isOwn ? ' own' : ''}">
                ${!isOwn ? `<div style="font-size:11px;color:var(--text-muted);margin-bottom:2px">${this.escapeHtml(emoji)} ${this.escapeHtml(name)}</div>` : ''}
                <div>${this.escapeHtml(msgRow.message)}</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:4px;text-align:${isOwn ? 'right' : 'left'}">${time}</div>
            </div>`;
    },

    // ============================================================================
    // TIMER CONTROLS
    // ============================================================================

    toggleTimer() {
        const state = window.Core?.state;
        if (!state) { console.error('Core not available'); return; }
        state.timerRunning ? this.pauseTimer() : this.startTimer();
    },

    startTimer() {
        const state = window.Core?.state;
        if (!state) return;
        try {
            state.timerRunning = true;
            const btn = this._el('timerBtn');
            if (btn) btn.textContent = 'Pause';

            this.timerInterval = setInterval(() => {
                if (state.timeLeft > 0) {
                    state.timeLeft--;
                    this.updateTimerDisplay();

                    if (state.timeLeft === this.config.FIVE_MINUTE_WARNING && this.fiveMinuteEnabled) {
                        this.playBell('soft');
                        window.Core.showToast?.('5 minutes remaining');
                    }

                    if (state.timeLeft === 0) this.completeSession();
                }
            }, 1000);
        } catch (error) {
            console.error('Timer start error:', error);
        }
    },

    pauseTimer() {
        const state = window.Core?.state;
        if (!state) return;
        state.timerRunning = false;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        const btn = this._el('timerBtn');
        if (btn) btn.textContent = 'Resume';
    },

    resetTimer() {
        const state = window.Core?.state;
        if (!state) return;
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        state.timerRunning = false;
        state.timeLeft = this.config.DEFAULT_DURATION;
        this.updateTimerDisplay();
        const btn = this._el('timerBtn');
        if (btn) btn.textContent = 'Begin';
    },

    updateTimerDisplay() {
        const display = this._el('timerDisplay');
        const state   = window.Core?.state;
        if (display && state) display.textContent = this.formatTime(state.timeLeft);
    },

    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) return '0:00';
        return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
    },

    setDuration(minutes) {
        const state = window.Core?.state;
        if (!state || typeof minutes !== 'number' || minutes <= 0) return;
        state.timeLeft = minutes * 60;
        this.updateTimerDisplay();
        window.Core.showToast?.(`Timer set to ${minutes} minutes`);
    },

    completeSession() {
        this.pauseTimer();
        this.playBell('tibetan');
        window.Core.showToast?.('✨ Session complete');
        setTimeout(() => this.showGratitude(), 1000);
    },

    // ============================================================================
    // AMBIENT SOUND
    // ============================================================================

    toggleAmbient() {
        this.ambientEnabled ? this.stopAmbientSound() : this.playAmbientSound();
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
            this._el('ambientBtn')?.classList.add('active');
            window.Core.showToast?.('🎵 Ambient sound on');
        } catch (error) {
            console.error('Ambient sound play error:', error);
        }
    },

    stopAmbientSound() {
        if (!this.ambientAudio) return;
        try {
            this.ambientAudio.pause();
            this.ambientAudio.currentTime = 0;
            this.ambientEnabled = false;
            this._el('ambientBtn')?.classList.remove('active');
            window.Core.showToast?.('🔇 Ambient sound off');
        } catch (error) {
            console.error('Ambient sound stop error:', error);
        }
    },

    // ============================================================================
    // AFFIRMATIONS
    // ============================================================================

    toggleAffirmations() {
        this.affirmationInterval ? this.stopAffirmations() : this.startAffirmations();
    },

    startAffirmations() {
        try {
            let index = 0;
            const container = this._el('affirmationText');

            const showAffirmation = () => {
                if (container) {
                    container.textContent = this.config.AFFIRMATIONS[index];
                    container.parentElement?.classList.add('visible');
                    setTimeout(() => container.parentElement?.classList.remove('visible'),
                        this.config.AFFIRMATION_DISPLAY_DURATION);
                }
                index = (index + 1) % this.config.AFFIRMATIONS.length;
            };

            showAffirmation();
            this.affirmationInterval = setInterval(showAffirmation, this.config.AFFIRMATION_INTERVAL);
            this._el('affirmationsBtn')?.classList.add('active');
            window.Core.showToast?.('💫 Affirmations enabled');
        } catch (error) {
            console.error('Affirmations start error:', error);
        }
    },

    stopAffirmations() {
        clearInterval(this.affirmationInterval);
        this.affirmationInterval = null;
        this._el('affirmationText')?.parentElement?.classList.remove('visible');
        this._el('affirmationsBtn')?.classList.remove('active');
        window.Core.showToast?.('Affirmations disabled');
    },

    // ============================================================================
    // BELL SOUNDS
    // ============================================================================

    toggle5MinuteBell() {
        this.fiveMinuteEnabled = !this.fiveMinuteEnabled;
        this._el('fiveMinuteBtn')?.classList.toggle('active', this.fiveMinuteEnabled);
        window.Core.showToast?.(this.fiveMinuteEnabled ? '🔔 5-minute bell enabled' : '🔕 5-minute bell disabled');
    },

    playBell(type = 'tibetan') {
        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx  = this.audioContext;
            const now  = ctx.currentTime;
            const bell = this.config.BELL_DURATION;
            const freqs = this.config.SOUND_PROFILES[type] || this.config.SOUND_PROFILES.tibetan;

            freqs.forEach(({ freq, gain }) => {
                const osc      = ctx.createOscillator();
                const gainNode = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(gain, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + bell);
                osc.connect(gainNode);
                gainNode.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + bell);
            });
        } catch (error) {
            console.error('Bell play error:', error);
        }
    },

    // ============================================================================
    // GRATITUDE
    // ============================================================================

    showGratitude() {
        this._el('gratitudeContainer')?.classList.add('visible');
    },

    offerGratitude() {
        window.Core.showToast?.('🙏 Gratitude offered to the space');
        this._el('gratitudeContainer')?.classList.remove('visible');
    },

    // ============================================================================
    // CHAT UI
    // ============================================================================

    toggleChat() {
        const sidebar = this._el('psSidebar');
        const fab     = this._el('fabChat');
        sidebar?.classList.toggle('open');
        fab?.classList.toggle('hidden', sidebar?.classList.contains('open') ?? false);
    },

    async sendChat() {
        const input = this._el('chatInput');
        if (!input) return;

        const text   = input.value.trim();
        if (!text) return;

        const roomId = window.Core?.state?.currentRoom;
        if (!roomId) {
            console.warn('[Practice] sendChat: no currentRoom set');
            return;
        }

        try {
            const container = this._el('chatMessages');
            if (container) {
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const msg  = document.createElement('div');
                msg.className = 'chat-msg own';
                msg.innerHTML = `
                    <div>${this.escapeHtml(text)}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-top:4px;text-align:right">${time}</div>`;
                container.appendChild(msg);
                container.scrollTop = container.scrollHeight;
            }

            input.value = '';
            await CommunityDB.sendRoomMessage(roomId, text);
        } catch (error) {
            console.error('sendChat error:', error);
        }
    },

    addChatMessage(messageData) {
        if (!messageData) return;
        const container = this._el('chatMessages');
        if (!container) return;

        const html = this._buildChatMsgHTML(messageData, false);
        const div  = document.createElement('div');
        div.innerHTML = html;
        const el = div.firstElementChild;
        if (el) {
            container.appendChild(el);
            container.scrollTop = container.scrollHeight;
        }
    },

    // ============================================================================
    // EXIT & CLEANUP
    // ============================================================================

    confirmLeave() {
        const presenceCount = window.Core?.state?.presenceCount || 0;
        if (presenceCount === 1 && typeof window.Rituals?.showClosing === 'function') {
            window.Rituals.showClosing();
        } else {
            this.leavePractice();
        }
    },

    async leavePractice() {
        try {
            const roomId = window.Core?.state?.currentRoom;
            if (roomId) await this.cleanupRoomChat(roomId);

            clearInterval(this.timerInterval);
            this.timerInterval = null;

            const state = window.Core?.state;
            if (state) {
                state.timerRunning = false;
                state.timeLeft     = this.config.DEFAULT_DURATION;
            }

            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;

            this.stopAmbientSound();
            this.resetUIElements();
            this._clearDomCache();

            window.Core?.navigateTo?.('hubView');
            window.Core?.showToast?.('You left the space');
            console.log('✓ Practice cleanup complete');
        } catch (error) {
            console.error('Leave practice error:', error);
        }
    },

    resetUIElements() {
        const display = this._el('timerDisplay');
        if (display) display.textContent = '20:00';

        const btn = this._el('timerBtn');
        if (btn) btn.textContent = 'Begin';

        this._el('gratitudeContainer')?.classList.remove('visible');

        const chatMessages = this._el('chatMessages');
        if (chatMessages) chatMessages.innerHTML = this.config.EMPTY_CHAT_HTML;

        this._el('psSidebar')?.classList.remove('open');
        this._el('fabChat')?.classList.remove('hidden');
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
        this._clearDomCache();
        console.log('✓ Practice resources cleaned up');
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.Practice = Practice;
