/**
 * RITUALS.JS - Opening & Closing Ceremonies
 * 
 * Manages the spiritual rituals that frame the user's experience:
 * - Opening ritual: Welcoming users with intention
 * - Closing ritual: Graceful exit from practice spaces
 * - Room cleanup coordination
 * 
 * Features:
 * - Auto-show opening on first visit
 * - Graceful transitions between hub and practice rooms
 * - Automatic cleanup of active practice sessions
 * 
 * @version 1.0.0
 */

const Rituals = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        hasSeenOpening: false,
        isInitialized: false,
        autoCloseTimer: null
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        ROOM_MODULES: [
            'BreathworkRoom',
            'SilentRoom',
            'GuidedRoom',
            'OshoRoom',
            'DeepWorkRoom',
            'CampfireRoom',
            'TarotRoom',
            'ReikiRoom',
            // Celestial rooms
            'NewMoonRoom',
            'WaxingMoonRoom',
            'FullMoonRoom',
            'WaningMoonRoom',
            'SpringSolarRoom',
            'SummerSolarRoom',
            'AutumnSolarRoom',
            'WinterSolarRoom'
        ]
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize Rituals module
     */
    init() {
        if (this.state.isInitialized) {
            console.warn('Rituals already initialized');
            return;
        }

        try {
            console.log('🕯️ Rituals Module Loaded');
            
            // Check if user has seen opening before
            this.loadState();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // DON'T auto-show here - let CommunityHubEngine control timing
            // to ensure DOM is fully ready
            
            this.state.isInitialized = true;
            
        } catch (error) {
            console.error('Rituals initialization failed:', error);
        }
    },

    /**
     * Set up event listeners for ritual interactions
     */
    setupEventListeners() {
        // ESC key to close any active ritual
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openingOverlay = document.getElementById('openingOverlay');
                const closingOverlay = document.getElementById('closingOverlay');
                
                if (openingOverlay && openingOverlay.classList.contains('active')) {
                    this.completeOpening();
                } else if (closingOverlay && closingOverlay.classList.contains('active')) {
                    this.completeClosing();
                }
            }
        });

        // Click handlers for ritual buttons (delegated)
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            
            if (action === 'ritual-opening') {
                this.completeOpening();
            } else if (action === 'ritual-closing') {
                this.completeClosing();
            }
        });
    },

    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    
    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem('rituals_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.state.hasSeenOpening = parsed.hasSeenOpening || false;
            }
        } catch (error) {
            console.error('Failed to load rituals state:', error);
        }
    },

    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem('rituals_state', JSON.stringify({
                hasSeenOpening: this.state.hasSeenOpening
            }));
        } catch (error) {
            console.error('Failed to save rituals state:', error);
        }
    },

    // ============================================================================
    // OPENING RITUAL
    // ============================================================================
    
    /**
     * Show opening ritual overlay
     */
    showOpening() {
        const overlay = document.getElementById('openingOverlay');
        if (!overlay) {
            console.warn('Opening overlay not found');
            return;
        }
        try {
            overlay.classList.add('active');
            console.log('✓ Opening ritual displayed');
            this.state.autoCloseTimer = setTimeout(() => {
                this.completeOpening();
            }, 5000);
        } catch (error) {
            console.error('Error showing opening ritual:', error);
        }
    },

    /**
     * Complete opening ritual and welcome user
     */
    completeOpening() {
        const overlay = document.getElementById('openingOverlay');
        if (!overlay) return;
        try {
            if (this.state.autoCloseTimer) {
                clearTimeout(this.state.autoCloseTimer);
                this.state.autoCloseTimer = null;
            }
            overlay.classList.remove('active');
            this.state.hasSeenOpening = true;
            this.saveState();
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Welcome to the space');
            }
            console.log('✓ Opening ritual completed');
        } catch (error) {
            console.error('Error completing opening ritual:', error);
        }
    },

    // ============================================================================
    // CLOSING RITUAL
    // ============================================================================
    
    /**
     * Show closing ritual overlay (when user leaves any room)
     */
    showClosing() {
        const overlay = document.getElementById('closingOverlay');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (!overlay) {
            console.warn('Closing overlay not found');
            return;
        }
        try {
            if (container) {
                container.style.display = 'block';
                container.style.pointerEvents = 'auto';
            }
            overlay.classList.add('active');
            console.log('✓ Closing ritual displayed');
        } catch (error) {
            console.error('Error showing closing ritual:', error);
        }
    },

    /**
     * Complete closing ritual - clean up any active room and return to hub
     */
    completeClosing() {
        const overlay = document.getElementById('closingOverlay');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (!overlay) {
            console.warn('Closing overlay not found');
            return;
        }

        try {
            overlay.classList.remove('active');
            if (container) {
                container.style.display = 'none';
            }
            
            // Clean up any active practice room
            this.cleanupActiveRoom();
            
            // Navigate back to hub
            if (window.Core && typeof window.Core.navigateTo === 'function') {
                window.Core.navigateTo('hubView');
            }
            
            // Show gratitude toast
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Space closed with gratitude');
            }
            
            console.log('✓ Closing ritual completed');
            
        } catch (error) {
            console.error('Error completing closing ritual:', error);
        }
    },

    // ============================================================================
    // ROOM CLEANUP
    // ============================================================================
    
    /**
     * Clean up whichever room is currently active
     * Calls leaveRoom() on the active room module
     */
    cleanupActiveRoom() {
        try {
            const activeRoom = this.findActiveRoom();
            
            if (activeRoom) {
                console.log(`Cleaning up active room: ${activeRoom.name}`);
                
                // Call the room's cleanup method if available
                if (typeof activeRoom.module.leaveRoom === 'function') {
                    activeRoom.module.leaveRoom();
                    console.log(`✓ Called leaveRoom() for ${activeRoom.name}`);
                } else if (typeof activeRoom.module.cleanup === 'function') {
                    activeRoom.module.cleanup();
                    console.log(`✓ Called cleanup() for ${activeRoom.name}`);
                } else {
                    // Room doesn't have cleanup methods (e.g., Solar/Lunar rooms)
                    // That's okay - just log it
                    console.log(`ℹ️ ${activeRoom.name} has no cleanup method (this is okay)`);
                }
            } else {
                console.log('No active room to cleanup');
            }
            
        } catch (error) {
            console.error('Error cleaning up active room:', error);
        }
    },

    /**
     * Find the currently active room module
     * @returns {Object|null} Object with room name and module, or null
     */
    findActiveRoom() {
        // FIRST: Check if practiceRoomView is active (used by Solar/Lunar rooms)
        const practiceRoomView = document.getElementById('practiceRoomView');
        if (practiceRoomView && practiceRoomView.classList.contains('active')) {
            // Check if there's a currentSolarRoom or currentLunarRoom
            if (window.currentSolarRoom) {
                return { 
                    name: 'CurrentSolarRoom', 
                    module: window.currentSolarRoom 
                };
            }
            
            if (window.currentLunarRoom) {
                return { 
                    name: 'CurrentLunarRoom', 
                    module: window.currentLunarRoom 
                };
            }
        }
        
        // SECOND: Check individual room views
        for (const roomName of this.config.ROOM_MODULES) {
            try {
                const room = window[roomName];
                
                if (!room) continue;
                
                // Check if this room's view is active
                const viewId = this.getRoomViewId(room, roomName);
                const view = document.getElementById(viewId);
                
                if (view && view.classList.contains('active')) {
                    return { name: roomName, module: room };
                }
                
            } catch (error) {
                console.error(`Error checking room ${roomName}:`, error);
            }
        }
        
        return null;
    },

    /**
     * Get the view ID for a room
     * @param {Object} room - Room module instance
     * @param {string} roomName - Room name
     * @returns {string} View ID
     */
    getRoomViewId(room, roomName) {
        // Try multiple strategies to find the view ID
        
        // Strategy 1: Room has explicit roomId property
        if (room.roomId) {
            return `${room.roomId}PracticeView`;
        }
        
        // Strategy 2: Room has viewId property
        if (room.viewId) {
            return room.viewId;
        }
        
        // Strategy 3: Derive from room name
        const baseName = roomName.toLowerCase().replace('room', '');
        return `${baseName}PracticeView`;
    },

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================
    
    /**
     * Reset rituals state (for testing/debugging)
     */
    reset() {
        try {
            this.state.hasSeenOpening = false;
            this.saveState();
            console.log('✓ Rituals state reset');
        } catch (error) {
            console.error('Error resetting rituals state:', error);
        }
    },

    /**
     * Check if a specific ritual overlay exists
     * @param {string} type - 'opening' or 'closing'
     * @returns {boolean} True if overlay exists
     */
    hasOverlay(type) {
        const overlayId = `${type}Overlay`;
        return !!document.getElementById(overlayId);
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.Rituals = Rituals;