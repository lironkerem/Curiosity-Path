/**
 * CORE.JS - Community Hub Central Management System (PATCHED FOR REFACTORED ROOMS)
 * 
 * Responsibilities:
 * - Global state management
 * - Application initialization and lifecycle
 * - Module coordination and dependency management
 * - Season detection and management
 * - Navigation and view switching
 * - Utility functions
 * 
 * @version 1.2.0 - Compatible with Refactored Practice Rooms
 */

const Core = {
    // ============================================================================
    // STATE MANAGEMENT
    // ============================================================================
    
    state: {
        currentUser: {
            id: 'user_123',
            name: 'Alex Morgan',
            avatar: 'A',
            bio: 'Finding stillness in the chaos. Here to practice with intention.',
            karma: 1247,
            minutes: 2340,
            circles: 48,
            offered: 127,
            status: 'available' // available, silent, guiding, deep, resonant, offline
        },
        currentSeason: 'winter',
        presenceCount: 127,
        pulseSent: false,
        timerRunning: false,
        timeLeft: 1200, // 20 minutes in seconds
        currentView: 'hubView',
        initialized: false
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        DEV_MODE: true, // Set to true to access all lunar/solar rooms regardless of phase/season
        seasons: ['winter', 'spring', 'summer', 'autumn'],
        statusRings: {
            silent: '#60a5fa',
            available: '#34d399',
            guiding: '#fbbf24',
            deep: '#a78bfa',
            resonant: '#f472b6',
            offline: '#d1d5db'
        },
        SEASON_CHECK_INTERVAL: 86400000, // 24 hours in ms
        RENDER_DELAY: 100, // Delay before rendering rooms
        CELESTIAL_INIT_DELAY: 500 // Increased delay for Solar system to ensure SunCalc is loaded
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize the Community Hub application
     * Sets up all modules, event listeners, and renders initial state
     */
    init() {
        // Prevent double initialization
        if (this.state.initialized) {
            console.warn('Core already initialized');
            return;
        }

        try {
            console.log('🌟 Community Hub Initializing...');
            
            this.setupEventListeners();
            this.autoDetectSeason();
            this.startSeasonMonitoring();
            this.initializeSafetyModals(); // Initialize safety modals
            this.initializeModules();
            this.initializePracticeRooms();
            this.scheduleRoomRendering();
            this.scheduleCelestialInit();
            this.updatePresenceCount();
            
            this.state.initialized = true;
            console.log('✅ Community Hub Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Core initialization failed:', error);
            this.handleInitializationError(error);
        }
    },

    /**
     * Handle initialization errors gracefully
     */
    handleInitializationError(error) {
        const message = 'Failed to initialize application. Please refresh the page.';
        this.showToast(message);
        
        // Log detailed error for debugging
        console.error('Initialization error details:', {
            message: error.message,
            stack: error.stack,
            state: this.state
        });
    },

    /**
     * Start periodic season monitoring
     */
    startSeasonMonitoring() {
        setInterval(() => {
            try {
                this.autoDetectSeason();
            } catch (error) {
                console.error('Season monitoring error:', error);
            }
        }, this.config.SEASON_CHECK_INTERVAL);
    },

    /**
     * Initialize consolidated modules with error handling
     */
    initializeModules() {
        const modules = [
            { name: 'Rituals', instance: window.Rituals },
            { name: 'ProfileModule', instance: window.ProfileModule },
            { name: 'CommunityModule', instance: window.CommunityModule }
        ];

        modules.forEach(({ name, instance }) => {
            try {
                if (instance && typeof instance.init === 'function') {
                    instance.init();
                    console.log(`✓ ${name} initialized`);
                } else {
                    console.warn(`⚠ ${name} module not found or missing init method`);
                }
            } catch (error) {
                console.error(`✗ ${name} initialization failed:`, error);
            }
        });
    },

    // ============================================================================
    // PRACTICE ROOMS MANAGEMENT
    // ============================================================================
    
    /**
     * Initialize all practice room modules
     * PATCHED: Now properly handles refactored room instances
     */
    initializePracticeRooms() {
        const rooms = [
            'SilentRoom',
            'CampfireRoom',
            'GuidedRoom',
            'BreathworkRoom',
            'OshoRoom',
            'DeepWorkRoom',
            'TarotRoom',
            'ReikiRoom'
        ];

        let initializedCount = 0;

        rooms.forEach(roomName => {
            try {
                const room = window[roomName];
                if (room) {
                    // Check if room has init method and call it
                    if (typeof room.init === 'function') {
                        room.init();
                        console.log(`✓ ${roomName} initialized`);
                        initializedCount++;
                    } else {
                        console.warn(`⚠ ${roomName} missing init method`);
                    }
                } else {
                    console.warn(`⚠ ${roomName} not found on window`);
                }
            } catch (error) {
                console.error(`✗ Failed to initialize ${roomName}:`, error);
            }
        });

        console.log(`✓ Initialized ${initializedCount}/${rooms.length} practice rooms`);
    },

    /**
     * Schedule room rendering with delay to ensure DOM is ready
     */
    scheduleRoomRendering() {
        setTimeout(() => {
            try {
                this.renderRooms();
            } catch (error) {
                console.error('Room rendering failed:', error);
            }
        }, this.config.RENDER_DELAY);
    },

    /**
     * Render all practice room cards to the hub view
     * PATCHED: Now properly calls getRoomCardHTML() on room instances
     */
    renderRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        
        if (!roomsGrid) {
            console.warn('roomsGrid element not found - skipping room rendering');
            return;
        }

        const roomModules = [
            'SilentRoom',
            'CampfireRoom',
            'GuidedRoom',
            'BreathworkRoom',
            'OshoRoom',
            'DeepWorkRoom',
            'TarotRoom',
            'ReikiRoom'
        ];

        const roomCards = [];
        
        roomModules.forEach(moduleName => {
            try {
                const module = window[moduleName];
                if (module && typeof module.getRoomCardHTML === 'function') {
                    const html = module.getRoomCardHTML();
                    if (html) {
                        roomCards.push(html);
                    }
                } else {
                    console.warn(`⚠ ${moduleName} missing getRoomCardHTML method`);
                }
            } catch (error) {
                console.error(`✗ Failed to get card HTML for ${moduleName}:`, error);
            }
        });

        if (roomCards.length > 0) {
            roomsGrid.innerHTML = roomCards.join('');
            console.log(`✓ Rendered ${roomCards.length} practice room cards`);
        } else {
            console.warn('No room cards to render');
        }
    },

    // ============================================================================
    // CELESTIAL SYSTEMS MANAGEMENT
    // ============================================================================
    
    /**
     * Schedule initialization of celestial (lunar/solar) systems
     * Delayed to ensure all dependencies are loaded
     */
    scheduleCelestialInit() {
        setTimeout(() => {
            try {
                this.initializeCelestialSystems();
            } catch (error) {
                console.error('Celestial initialization failed:', error);
            }
        }, this.config.CELESTIAL_INIT_DELAY);
    },

    /**
     * Initialize lunar and solar room systems
     */
    initializeCelestialSystems() {
        // Initialize Lunar System
        if (window.LunarEngine && typeof window.LunarEngine.init === 'function') {
            try {
                window.LunarEngine.init();
                console.log('✓ Lunar system initialized');
            } catch (error) {
                console.error('✗ Lunar initialization failed:', error);
            }
        } else {
            console.warn('⚠ LunarEngine not found');
        }

        // Initialize Solar System
        if (window.SolarEngine && typeof window.SolarEngine.init === 'function') {
            try {
                window.SolarEngine.init();
                console.log('✓ Solar system initialized');
            } catch (error) {
                console.error('✗ Solar initialization failed:', error);
            }
        } else {
            console.warn('⚠ SolarEngine not found');
        }
    },

    // ============================================================================
    // NAVIGATION & VIEW MANAGEMENT
    // ============================================================================
    
    /**
     * Navigate between different views in the application
     * Handles both in-tab hub views and fullscreen practice rooms
     * @param {string} viewId - ID of the view to navigate to
     */
    navigateTo(viewId) {
        try {
            console.log(`[Core] navigateTo called with viewId: ${viewId}`);
            
            const fullscreenContainer = document.getElementById('communityHubFullscreenContainer');
            const hubTab = document.getElementById('community-hub-tab');
            
            console.log(`[Core] fullscreenContainer exists: ${!!fullscreenContainer}`);
            console.log(`[Core] hubTab exists: ${!!hubTab}`);
            
            if (viewId === 'hubView') {
                // Returning to hub - hide fullscreen container, show hub tab
                if (fullscreenContainer) {
                    fullscreenContainer.style.display = 'none';
                    console.log('[Core] Fullscreen container hidden');
                }
                if (hubTab) {
                    hubTab.style.display = 'block';
                    console.log('[Core] Hub tab shown');
                }
                
                // Update view state within hub
                const views = document.querySelectorAll('#hubView');
                views.forEach(view => view.classList.add('active'));
                
                this.state.currentView = 'hubView';
                console.log('[Core] Navigated to hubView');
                
            } else if (viewId === 'practiceRoomView') {
                // Entering practice room - show fullscreen container, COMPLETELY HIDE hub tab
                console.log('[Core] Entering practice room...');
                
                if (fullscreenContainer) {
                    fullscreenContainer.style.display = 'block';
                    console.log('[Core] Fullscreen container shown');
                    
                    // Activate practice room view within fullscreen container
                    const practiceView = fullscreenContainer.querySelector('#practiceRoomView');
                    if (practiceView) {
                        practiceView.classList.add('active');
                        console.log('[Core] Practice view activated');
                    }
                }
                
                // CRITICAL: Completely hide the entire community-hub-tab
                if (hubTab) {
                    hubTab.style.display = 'none';
                    console.log('[Core] Hub tab hidden - display:', window.getComputedStyle(hubTab).display);
                } else {
                    console.error('[Core] Hub tab not found! Cannot hide it.');
                }
                
                this.state.currentView = 'practiceRoomView';
                console.log('[Core] Navigated to practiceRoomView (fullscreen)');
                
            } else {
                // Fallback for other views (shouldn't happen in normal flow)
                console.warn(`[Core] Unexpected viewId: ${viewId} - ignoring`);
            }
        } catch (error) {
            console.error('[Core] Navigation error:', error);
        }
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
        });

        console.log('✓ Event listeners set up');
    },

    // ============================================================================
    // PRESENCE & STATUS MANAGEMENT
    // ============================================================================
    
    /**
     * Update the presence count display
     */
    updatePresenceCount() {
        // Simulate presence count update
        setInterval(() => {
            this.state.presenceCount = Math.floor(Math.random() * 50) + 100;
        }, 30000); // Update every 30 seconds
    },

    /**
     * Send a pulse to other users
     */
    sendPulse() {
        if (this.state.pulseSent) {
            this.showToast('Please wait before sending another pulse');
            return;
        }

        this.state.pulseSent = true;
        this.showToast('💫 Pulse sent to the community');

        setTimeout(() => {
            this.state.pulseSent = false;
        }, 60000); // 1 minute cooldown
    },

    // ============================================================================
    // TOAST NOTIFICATIONS
    // ============================================================================
    
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.warn('Toast element not found');
            return;
        }

        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },

    // ============================================================================
    // SEASON MANAGEMENT
    // ============================================================================
    
    /**
     * Automatically detect and set the current season based on date
     */
    autoDetectSeason() {
        const now = new Date();
        const month = now.getMonth(); // 0-11
        
        let season;
        
        // Northern Hemisphere seasons
        if (month >= 2 && month <= 4) {
            season = 'spring';  // March, April, May
        } else if (month >= 5 && month <= 7) {
            season = 'summer';  // June, July, August
        } else if (month >= 8 && month <= 10) {
            season = 'autumn';  // September, October, November
        } else {
            season = 'winter';  // December, January, February
        }
        
        // Only change if different
        if (this.state.currentSeason !== season) {
            console.log(`Season auto-detected: ${season}`);
            this.changeSeason(season, true);
        }
    },

    /**
     * Manually change the season
     * @param {string} season - Target season
     * @param {boolean} isAuto - Whether this is an automatic change
     */
    changeSeason(season, isAuto = false) {
        if (!this.config.seasons.includes(season)) {
            console.error(`Invalid season: ${season}`);
            return;
        }
        
        try {
            this.state.currentSeason = season;
            document.body.className = season;
            this.updateSeasonWheel(season);
            this.triggerSeasonFlash();
            
            const message = isAuto 
                ? `✨ Season shifted to ${season}` 
                : `Season changed to ${season}`;
            this.showToast(message);
            
        } catch (error) {
            console.error('Season change error:', error);
        }
    },

    /**
     * Update the season wheel UI
     * @param {string} season - Current season
     */
    updateSeasonWheel(season) {
        const wheel = document.querySelector('.season-wheel');
        if (!wheel) return;

        const seasonIndex = this.config.seasons.indexOf(season);
        const rotation = seasonIndex * 90; // 90 degrees per season
        wheel.style.transform = `rotate(${rotation}deg)`;
    },

    /**
     * Trigger the season change flash effect
     */
    triggerSeasonFlash() {
        const flash = document.getElementById('seasonFlash');
        if (flash) {
            flash.classList.add('active');
            setTimeout(() => flash.classList.remove('active'), 2000);
        }
    },

    // ============================================================================
    // MODAL MANAGEMENT
    // ============================================================================
    
    /**
     * Initialize safety modals (called during app init)
     * Creates the HTML for report, block, and help modals
     */
    initializeSafetyModals() {
        // Check if modals already exist
        if (document.getElementById('reportModal')) {
            console.log('Safety modals already initialized');
            return;
        }
        
        const modalsHTML = `
            <!-- Report Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal-card">
                    <button class="modal-close" onclick="CommunityModule.closeReportModal()">×</button>
                    <h2>⚠️ Report Issue</h2>
                    <div class="modal-content">
                        <p style="margin-bottom: 16px; color: var(--text-muted);">Help us maintain a safe space. Your report is confidential.</p>
                        
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Reason:</label>
                        <select id="reportReason" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); margin-bottom: 16px;">
                            <option value="">Select a reason...</option>
                            <option value="harassment">Harassment or bullying</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam or advertising</option>
                            <option value="safety">Safety concern</option>
                            <option value="other">Other</option>
                        </select>
                        
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Details (optional):</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide any additional context..." style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); resize: vertical; margin-bottom: 16px;"></textarea>
                        
                        <div style="display: flex; gap: 12px;">
                            <button onclick="CommunityModule.closeReportModal()" style="flex: 1; padding: 12px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button onclick="CommunityModule.submitReport()" style="flex: 1; padding: 12px; background: var(--accent); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">Submit Report</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Block User Modal -->
            <div class="modal-overlay" id="blockModal">
                <div class="modal-card">
                    <button class="modal-close" onclick="CommunityModule.closeBlockModal()">×</button>
                    <h2>🚫 Block User</h2>
                    <div class="modal-content">
                        <p style="margin-bottom: 16px; color: var(--text-muted);">Blocking will hide all messages from this user.</p>
                        
                        <label style="display: block; margin-bottom: 8px; font-weight: 600;">Username:</label>
                        <input type="text" id="blockUsername" placeholder="Enter username to block" style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); color: var(--text); margin-bottom: 16px;" />
                        
                        <div style="display: flex; gap: 12px;">
                            <button onclick="CommunityModule.closeBlockModal()" style="flex: 1; padding: 12px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">Cancel</button>
                            <button onclick="CommunityModule.confirmBlock()" style="flex: 1; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">Block User</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Help Modal -->
            <div class="modal-overlay" id="helpModal">
                <div class="modal-card">
                    <button class="modal-close" onclick="CommunityModule.closeHelpModal()">×</button>
                    <h2>🆘 Get Help</h2>
                    <div class="modal-content">
                        <p style="margin-bottom: 16px;">If you're experiencing a crisis or need immediate support:</p>
                        
                        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
                            <h3 style="margin-top: 0; font-size: 16px;">Crisis Resources</h3>
                            <p style="margin: 8px 0;"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p style="margin: 8px 0;"><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p style="margin: 8px 0;"><strong>International:</strong> <a href="https://findahelpline.com" target="_blank" style="color: var(--accent);">findahelpline.com</a></p>
                        </div>
                        
                        <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
                            <h3 style="margin-top: 0; font-size: 16px;">Community Support</h3>
                            <p style="margin: 8px 0;">Contact our moderators for non-emergency concerns</p>
                            <p style="margin: 8px 0;"><strong>Email:</strong> support@community.example.com</p>
                        </div>
                        
                        <button onclick="CommunityModule.closeHelpModal()" style="width: 100%; padding: 12px; border: 1px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600;">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
        console.log('✓ Safety modals initialized');
    },

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================
    
    /**
     * Format seconds into MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) {
            return '0:00';
        }
        
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    /**
     * Generate a consistent avatar gradient based on a seed string
     * @param {string} seed - Seed string (e.g., user ID)
     * @returns {string} CSS gradient string
     */
    getAvatarGradient(seed) {
        if (!seed || typeof seed !== 'string') {
            seed = 'default';
        }
        
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        
        // Generate consistent index from seed
        const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = Math.abs(hash) % gradients.length;
        
        return gradients[index];
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

// Expose Core to global scope
window.Core = Core;

// Freeze config in production to prevent accidental modification
if (!Core.config.DEV_MODE) {
    Object.freeze(Core.config);
}

console.log('✅ Core.js loaded and ready (v1.2.0 - Refactored Rooms Compatible)');