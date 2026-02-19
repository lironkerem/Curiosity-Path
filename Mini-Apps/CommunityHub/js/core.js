/**
 * CORE.JS - Community Hub Central Management System
 * PATCHED: Full Supabase integration
 * 
 * @version 2.0.0
 */

const Core = {

    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        currentUser: {
            id:       null,
            name:     'Loading...',
            avatar:   '?',
            emoji:    '',
            avatar_url: null,
            bio:      '',
            status:   'online',
            role:     'Member',
            karma:    0,
            minutes:  0,
            circles:  0,
            offered:  0,
            email:    ''
        },
        currentRoom:     null,       // e.g. 'campfire-room' — set when entering a room
        currentActivity: '✨ Available',
        presenceCount:   0,
        presenceInterval: null,
        pulseSent:       false,
        timerRunning:    false,
        timeLeft:        1200,       // 20 minutes in seconds
        currentView:     'hubView',
        initialized:     false
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        DEV_MODE: true,
        ROOM_MODULES: [
            'SilentRoom',
            'CampfireRoom',
            'GuidedRoom',
            'BreathworkRoom',
            'OshoRoom',
            'DeepWorkRoom',
            'TarotRoom',
            'ReikiRoom'
        ],
        statusRings: {
            silent:    '#60a5fa',
            available: '#34d399',
            guiding:   '#fbbf24',
            deep:      '#a78bfa',
            resonant:  '#f472b6',
            offline:   '#d1d5db'
        },
        RENDER_DELAY:        100,
        CELESTIAL_INIT_DELAY: 500
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize the Community Hub application.
     * Now async so it can load real user data before rendering.
     */
    async init() {
        if (this.state.initialized) {
            console.warn('Core already initialized');
            return;
        }

        try {
            console.log('🌟 Community Hub Initializing...');

            // 1. Init Supabase data layer
            if (!window.CommunityDB) {
                throw new Error('CommunityDB not found — make sure community-supabase.js loaded first');
            }

            const dbReady = await CommunityDB.init();
            if (!dbReady) {
                throw new Error('Database not ready — is the user logged in?');
            }

            // 2. Load real user profile (replaces all hardcoded data)
            await this.loadCurrentUser();

            // 3. Go online and start heartbeat
            await CommunityDB.setPresence('online', '✨ Available', null);
            CommunityDB.startHeartbeat(60000);

            // 4. Mark offline when tab closes
            window.addEventListener('beforeunload', async () => {
                await CommunityDB.setOffline();
                CommunityDB.unsubscribeAll();
            });

            // 5. Standard setup (unchanged from original)
            this.setupEventListeners();
            this.initializeSafetyModals();
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
     * Load the authenticated user's profile from Supabase
     * and populate Core.state.currentUser with real data.
     */
    async loadCurrentUser() {
        try {
            const profile = await CommunityDB.getMyProfile();

            if (!profile) {
                console.warn('[Core] No profile found for user');
                return;
            }

            this.state.currentUser = {
                id:               profile.id,
                name:             profile.name             || 'Anonymous',
                avatar:           (profile.name || 'A').charAt(0).toUpperCase(),
                emoji:            profile.emoji            || '',
                avatar_url:       profile.avatar_url       || null,
                bio:              profile.inspiration      || 'Here to practice with intention.',
                status:           ['online','away','offline'].includes(profile.community_status)
                                    ? profile.community_status : 'online',
                role:             profile.community_role   || 'Member',
                minutes:          profile.total_minutes    || 0,
                circles:          profile.total_sessions   || 0,
                offered:          profile.gifts_given      || 0,
                birthday:         profile.birthday         || null,
                country:          profile.country          || null,
                email:            profile.email            || '',
                // karma/xp/badges loaded from user_progress.payload by GamificationEngine
                karma:            window.GamificationEngine?.state?.karma ?? 0,
                xp:               window.GamificationEngine?.state?.xp    ?? 0,
                badges:           window.GamificationEngine?.state?.badges ?? []
            };

            console.log('[Core] User loaded:', this.state.currentUser.name);

        } catch (error) {
            console.error('[Core] loadCurrentUser failed:', error);
        }
    },

    /**
     * Handle initialization errors gracefully
     */
    handleInitializationError(error) {
        this.showToast('Failed to initialize. Please refresh the page.');
        console.error('Initialization error details:', {
            message: error.message,
            stack:   error.stack,
            state:   this.state
        });
    },

    /**
     * Initialize consolidated modules
     */
    initializeModules() {
        const modules = [
            { name: 'Rituals',         instance: window.Rituals },
            { name: 'ProfileModule',   instance: window.ProfileModule },
            { name: 'CommunityModule', instance: window.CommunityModule }
        ];

        modules.forEach(({ name, instance }) => {
            try {
                if (instance && typeof instance.init === 'function') {
                    instance.init();
                    console.log(`✓ ${name} initialized`);
                } else {
                    console.warn(`⚠ ${name} module not found or missing init`);
                }
            } catch (error) {
                console.error(`✗ ${name} initialization failed:`, error);
            }
        });
    },

    // ============================================================================
    // PRACTICE ROOMS MANAGEMENT
    // ============================================================================

    initializePracticeRooms() {
        let initializedCount = 0;
        this.config.ROOM_MODULES.forEach(roomName => {
            try {
                const room = window[roomName];
                if (room) {
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
        console.log(`✓ Initialized ${initializedCount}/${this.config.ROOM_MODULES.length} practice rooms`);
    },

    scheduleRoomRendering() {
        setTimeout(() => {
            try {
                this.renderRooms();
            } catch (error) {
                console.error('Room rendering failed:', error);
            }
        }, this.config.RENDER_DELAY);
    },

    renderRooms() {
        const roomsGrid = document.getElementById('roomsGrid');
        if (!roomsGrid) {
            console.warn('roomsGrid element not found - skipping room rendering');
            return;
        }

        const roomCards = [];
        this.config.ROOM_MODULES.forEach(moduleName => {
            try {
                const module = window[moduleName];
                if (module && typeof module.getRoomCardHTML === 'function') {
                    const html = module.getRoomCardHTML();
                    if (html) roomCards.push(html);
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
    // CELESTIAL SYSTEMS
    // ============================================================================

    scheduleCelestialInit() {
        setTimeout(() => {
            try {
                this.initializeCelestialSystems();
            } catch (error) {
                console.error('Celestial initialization failed:', error);
            }
        }, this.config.CELESTIAL_INIT_DELAY);
    },

    initializeCelestialSystems() {
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

    navigateTo(viewId) {
        try {
            const fullscreenContainer = document.getElementById('communityHubFullscreenContainer');
            const hubTab = document.getElementById('community-hub-tab');

            if (viewId === 'hubView') {
                if (fullscreenContainer) fullscreenContainer.style.display = 'none';
                if (hubTab) hubTab.style.display = 'block';

                const views = document.querySelectorAll('#hubView');
                views.forEach(view => view.classList.add('active'));

                this.state.currentView = 'hubView';

            } else if (viewId === 'practiceRoomView') {
                if (fullscreenContainer) {
                    fullscreenContainer.style.display = 'block';

                    const openingOverlay = fullscreenContainer.querySelector('#openingOverlay');
                    const closingOverlay = fullscreenContainer.querySelector('#closingOverlay');
                    if (openingOverlay) openingOverlay.classList.remove('active');
                    if (closingOverlay) closingOverlay.classList.remove('active');

                    const practiceView = fullscreenContainer.querySelector('#practiceRoomView');
                    if (practiceView) {
                        practiceView.style.display = 'block';
                        practiceView.classList.add('active');
                    }
                }

                if (hubTab) {
                    hubTab.style.display = 'none';
                } else {
                    console.error('[Core] Hub tab not found!');
                }

                this.state.currentView = 'practiceRoomView';

            } else {
                console.warn(`[Core] Unexpected viewId: ${viewId}`);
            }
        } catch (error) {
            console.error('[Core] Navigation error:', error);
        }
    },

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) activeModal.classList.remove('active');
            }
        });

        console.log('✓ Event listeners set up');
    },

    // ============================================================================
    // PRESENCE & STATUS
    // ============================================================================

    /**
     * Fetch real online member count from Supabase and update display.
     * Also sets up a 30-second refresh interval.
     */
    async updatePresenceCount() {
        // Clear any existing interval to prevent stacking on re-visits
        if (this.state.presenceInterval) {
            clearInterval(this.state.presenceInterval);
        }

        const refresh = async () => {
            try {
                if (!window.CommunityDB || !CommunityDB.ready) return;
                const members = await CommunityDB.getActiveMembers();
                this.state.presenceCount = members.length;

                const el = document.getElementById('presenceCount');
                if (el) el.textContent = members.length;
            } catch (error) {
                console.error('[Core] updatePresenceCount error:', error);
            }
        };

        await refresh();
        this.state.presenceInterval = setInterval(refresh, 30000);
    },

    /**
     * Send a pulse to the community
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
        }, 60000);
    },

    // ============================================================================
    // TOAST NOTIFICATIONS
    // ============================================================================

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
    // MODAL MANAGEMENT
    // ============================================================================

    initializeSafetyModals() {
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

    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    getAvatarGradient(seed) {
        if (!seed || typeof seed !== 'string') seed = 'default';
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[Math.abs(hash) % gradients.length];
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.Core = Core;

if (!Core.config.DEV_MODE) {
    Object.freeze(Core.config);
}

console.log('✅ Core.js loaded (v2.0.0 — Supabase integrated)');