/**
 * RITUALS.JS - Opening & Closing Ceremonies
 * @version 1.2.0
 *
 * Manages the spiritual rituals that frame the user's experience:
 * - Opening ritual: Welcoming users with intention
 * - Closing ritual: Graceful exit from practice spaces
 * - Room cleanup coordination
 */

import { Core } from '../core.js';

const Rituals = {

    // ============================================================================
    // STATE & CONFIG
    // ============================================================================

    state: {
        hasSeenOpening: false,
        isInitialized:  false,
        autoCloseTimer: null,
    },

    config: {
        OPENING_AUTO_CLOSE_MS: 5000,
        OPENING_COOLDOWN_MS: 24 * 60 * 60 * 1000, // 24 hours

        OPENING_TEXTS: [
            "Enter with intention, leave with gratitude",
            "This space holds you. Enter with presence.",
            "Breathe in. You are welcome here.",
            "Leave the noise behind. Step into stillness.",
            "You are exactly where you need to be.",
            "Enter gently. This moment is yours.",
            "Set down what you carry. Enter with an open heart.",
            "The space is ready. So are you.",
            "Come as you are. This is a place of welcome.",
            "Arrive fully. Begin with intention.",
        ],

        CLOSING_TEXTS: [
            "Thank you for holding space with us",
            "Carry the stillness with you as you go.",
            "You showed up. That is enough.",
            "May what was planted here continue to grow.",
            "Go gently. You have done something meaningful.",
            "The practice continues beyond this space.",
            "Thank you for your presence in this circle.",
            "Rest in what was received here today.",
            "You are changed by having paused. Go well.",
            "Until next time - carry the quiet with you.",
        ],

        ROOM_MODULES: [
            'BreathworkRoom', 'SilentRoom', 'GuidedRoom', 'OshoRoom',
            'DeepWorkRoom',   'CampfireRoom', 'TarotRoom', 'ReikiRoom',
            // Celestial rooms
            'NewMoonRoom',   'WaxingMoonRoom', 'FullMoonRoom', 'WaningMoonRoom',
            'SpringSolarRoom','SummerSolarRoom','AutumnSolarRoom','WinterSolarRoom',
        ],
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    init() {
        if (this.state.isInitialized) {
            console.warn('Rituals already initialized');
            return;
        }
        try {
            console.log('🕯️ Rituals Module Loaded');
            this.loadState();
            this.setupEventListeners();
            this.state.isInitialized = true;
        } catch (error) {
            console.error('Rituals initialization failed:', error);
        }
    },

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const opening = document.getElementById('openingOverlay');
            const closing = document.getElementById('closingOverlay');
            if (opening?.classList.contains('active'))      this.completeOpening();
            else if (closing?.classList.contains('active')) this.completeClosing();
        });

        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'ritual-opening') this.completeOpening();
            else if (action === 'ritual-closing') this.completeClosing();
        });
    },

    // ============================================================================
    // STATE PERSISTENCE
    // ============================================================================

    loadState() {
        try {
            const ts = localStorage.getItem('rituals_lastSeen');
            if (ts) {
                const elapsed = Date.now() - parseInt(ts, 10);
                this.state.hasSeenOpening = elapsed < this.config.OPENING_COOLDOWN_MS;
            }
        } catch (error) {
            console.error('Failed to load rituals state:', error);
        }
    },

    saveState() {
        try {
            localStorage.setItem('rituals_lastSeen', Date.now().toString());
        } catch (error) {
            console.error('Failed to save rituals state:', error);
        }
    },

    // ============================================================================
    // OPENING RITUAL
    // ============================================================================

    showOpening() {
        const overlay = document.getElementById('openingOverlay');
        if (!overlay) { console.warn('Opening overlay not found'); return; }

        const textEl = document.getElementById('openingRitualText');
        if (textEl) textEl.textContent = `"${this._randomText('OPENING_TEXTS')}"`;

        document.body.classList.add('ritual-active');
        overlay.classList.add('active');
        this.state.autoCloseTimer = setTimeout(() => this.completeOpening(), this.config.OPENING_AUTO_CLOSE_MS);
        console.log('✓ Opening ritual displayed');
    },

    completeOpening() {
        const overlay = document.getElementById('openingOverlay');
        if (!overlay) return;

        clearTimeout(this.state.autoCloseTimer);
        this.state.autoCloseTimer = null;

        overlay.classList.remove('active');
        document.body.classList.remove('ritual-active');
        this.state.hasSeenOpening = true;
        this.saveState();
        Core?.showToast?.('Welcome to the space');
        console.log('✓ Opening ritual completed');
    },

    // ============================================================================
    // CLOSING RITUAL
    // ============================================================================

    showClosing() {
        const overlay    = document.getElementById('closingOverlay');
        const container  = document.getElementById('communityHubFullscreenContainer');
        if (!overlay) { console.warn('Closing overlay not found'); return; }

        const textEl = document.getElementById('closingRitualText');
        if (textEl) textEl.textContent = `"${this._randomText('CLOSING_TEXTS')}"`;

        document.body.classList.add('ritual-active');
        if (container) {
            container.style.display      = 'block';
            container.style.pointerEvents = 'auto';
        }
        overlay.classList.add('active');
        console.log('✓ Closing ritual displayed');
    },

    completeClosing() {
        const overlay   = document.getElementById('closingOverlay');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (!overlay) { console.warn('Closing overlay not found'); return; }

        overlay.classList.remove('active');
        document.body.classList.remove('ritual-active');
        document.body.style.overflow = '';
        if (container) container.style.display = 'none';

        this.cleanupActiveRoom();
        Core?.navigateTo?.('hubView');
        Core?.showToast?.('Space closed with gratitude');
        console.log('✓ Closing ritual completed');
    },

    // ============================================================================
    // ROOM CLEANUP
    // ============================================================================

    cleanupActiveRoom() {
        const activeRoom = this.findActiveRoom();
        if (!activeRoom) { console.log('No active room to cleanup'); return; }

        console.log(`Cleaning up active room: ${activeRoom.name}`);
        const { module, name } = activeRoom;

        if (typeof module.leaveRoom === 'function') {
            module.leaveRoom();
            console.log(`✓ Called leaveRoom() for ${name}`);
        } else if (typeof module.cleanup === 'function') {
            module.cleanup();
            console.log(`✓ Called cleanup() for ${name}`);
        } else {
            console.log(`ℹ️ ${name} has no cleanup method`);
        }
    },

    findActiveRoom() {
        // Prefer dynamic room references
        if (window.currentSolarRoom) return { name: 'CurrentSolarRoom', module: window.currentSolarRoom };
        if (window.currentLunarRoom) return { name: 'CurrentLunarRoom', module: window.currentLunarRoom };

        const dynamicContent = document.getElementById('dynamicRoomContent');
        const hasContent     = dynamicContent?.children.length > 0;
        const hasHeader      = !!document.querySelector('.ps-header');
        if (!hasContent || !hasHeader) return null;

        for (const roomName of this.config.ROOM_MODULES) {
            const room = window[roomName];
            if (!room?.roomId) continue;

            const { roomId } = room;
            if (document.getElementById(`${roomId}ParticipantStack`) ||
                document.getElementById(`${roomId}View`)             ||
                document.getElementById(`${roomId}TimerDisplay`)) {
                return { name: roomName, module: room };
            }
        }

        return null;
    },

    /**
     * Derive a view ID for a room module.
     * Tries room.roomId, then room.viewId, then falls back to name-based convention.
     * @param {Object} room
     * @param {string} roomName
     * @returns {string}
     */
    getRoomViewId(room, roomName) {
        if (room.roomId) return `${room.roomId}PracticeView`;
        if (room.viewId) return room.viewId;
        return `${roomName.toLowerCase().replace('room', '')}PracticeView`;
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    /** Returns a random entry from a named config text array. */
    _randomText(key) {
        const arr = this.config[key];
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /** Reset opening state (for testing/debugging). */
    reset() {
        this.state.hasSeenOpening = false;
        localStorage.removeItem('rituals_lastSeen');
        console.log('✓ Rituals state reset');
    },

    /** Check if a ritual overlay element exists in the DOM. */
    hasOverlay(type) {
        return !!document.getElementById(`${type}Overlay`);
    },
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

// Window bridge: preserved for external callers
window.Rituals = Rituals;

export { Rituals };
