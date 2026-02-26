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

            // 2b. Inject admin UI after modules have rendered
            setTimeout(() => this._injectAdminUIAll(), 1000);

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
                role:             profile.is_admin === true ? 'Admin' : (profile.community_role || 'Member'),
                minutes:          profile.total_minutes    || 0,
                circles:          profile.total_sessions   || 0,
                offered:          profile.gifts_given      || 0,
                birthday:         profile.birthday         || null,
                country:          profile.country          || null,
                email:            profile.email            || '',
                is_admin:         profile.is_admin          === true,
                // karma/xp/badges loaded from GamificationEngine (lives at window.app.gamification)
                karma:            window.app?.gamification?.state?.karma  ?? 0,
                xp:               window.app?.gamification?.state?.xp     ?? 0,
                badges:           window.app?.gamification?.state?.badges ?? []
            };


        } catch (error) {
            console.error('[Core] loadCurrentUser failed:', error);
        }
    },

    /**
     * Call injectAdminUI() on all modules that support it.
     * Runs after loadCurrentUser() so is_admin is guaranteed to be set.
     */
    _injectAdminUIAll() {
        const modules = [
            window.CollectiveField,
            window.LunarEngine,
            window.SolarEngine,
            window.UpcomingEvents,
            window.AdminDashboard,
        ];
        modules.forEach(m => {
            if (m && typeof m.injectAdminUI === 'function') {
                try { m.injectAdminUI(); } catch(e) { console.warn('injectAdminUI failed:', e); }
            }
        });
    },

    /**
     * Call injectAdminUI() on all modules that support it.
     * Runs after loadCurrentUser() so is_admin is guaranteed to be set.
     */
    _injectAdminUIAll() {
        const modules = [
            window.CollectiveField,
            window.LunarEngine,
            window.SolarEngine,
            window.UpcomingEvents,
            window.AdminDashboard,
        ];
        modules.forEach(m => {
            if (m && typeof m.injectAdminUI === 'function') {
                try { m.injectAdminUI(); } catch(e) { console.warn('injectAdminUI failed:', e); }
            }
        });
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
                } else {
                    console.warn(`⚠ ${name} module not found or missing init`);
                }
            } catch (error) {
                console.error(`✗ ${name} initialization failed:`, error);
            }
        });

        // ActiveMembers uses render() not init() — call it after CommunityDB is ready
        if (window.ActiveMembers && typeof window.ActiveMembers.render === 'function') {
            window.ActiveMembers.render().catch(e =>
                console.error('✗ ActiveMembers render failed:', e)
            );
        } else {
            console.warn('⚠ ActiveMembers not found');
        }
    },

    // ============================================================================
    // PRACTICE ROOMS MANAGEMENT
    // ============================================================================

    initializePracticeRooms() {
        let initializedCount = 0;
        const roomInstances = [];

        this.config.ROOM_MODULES.forEach(roomName => {
            try {
                const room = window[roomName];
                if (room) {
                    if (typeof room.init === 'function') {
                        room.init();
                        roomInstances.push(room);
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


        // Start one shared hub presence subscription for all room cards
        if (window.PracticeRoom && roomInstances.length) {
            PracticeRoom.startHubPresence(roomInstances);
        }
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
        const _tryInit = (attemptsLeft) => {
            if (typeof SunCalc === 'undefined' && attemptsLeft > 0) {
                setTimeout(() => _tryInit(attemptsLeft - 1), 200);
                return;
            }

            if (window.LunarEngine && typeof window.LunarEngine.init === 'function') {
                try {
                    window.LunarEngine.init();
                } catch (error) {
                    console.error('✗ Lunar initialization failed:', error);
                }
            } else {
                console.warn('⚠ LunarEngine not found');
            }

            if (window.SolarEngine && typeof window.SolarEngine.init === 'function') {
                try {
                    window.SolarEngine.init();
                } catch (error) {
                    console.error('✗ Solar initialization failed:', error);
                }
            } else {
                console.warn('⚠ SolarEngine not found');
            }
        };

        _tryInit(25); // poll up to 25 × 200ms = 5 seconds
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
                document.body.style.overflow = ''; // restore body scroll

                const views = document.querySelectorAll('#hubView');
                views.forEach(view => view.classList.add('active'));

                this.state.currentView = 'hubView';

            } else if (viewId === 'practiceRoomView') {
                if (fullscreenContainer) {
                    fullscreenContainer.style.display = 'flex';

                    const openingOverlay = fullscreenContainer.querySelector('#openingOverlay');
                    const closingOverlay = fullscreenContainer.querySelector('#closingOverlay');
                    if (openingOverlay) openingOverlay.classList.remove('active');
                    if (closingOverlay) closingOverlay.classList.remove('active');
                }

                if (hubTab) {
                    hubTab.style.display = 'none';
                } else {
                    console.error('[Core] Hub tab not found!');
                }

                document.body.style.overflow = 'hidden'; // lock body scroll
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
            return;
        }

        const modalsHTML = `
            <!-- Report Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal-card">
                    <button class="modal-close" onclick="CommunityModule.closeReportModal()">×</button>
                    <h2>⚠️ Report Issue</h2>
                    <div class="modal-content">
                        <p class="modal-desc modal-desc--muted">Help us maintain a safe space. Your report is confidential.</p>
                        <label class="modal-label">Reason:</label>
                        <select id="reportReason" class="modal-field">
                            <option value="">Select a reason...</option>
                            <option value="harassment">Harassment or bullying</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam or advertising</option>
                            <option value="safety">Safety concern</option>
                            <option value="other">Other</option>
                        </select>
                        <label class="modal-label">Details (optional):</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide any additional context..." class="modal-field modal-field--textarea"></textarea>
                        <div class="modal-btn-row">
                            <button onclick="CommunityModule.closeReportModal()" class="modal-btn-cancel">Cancel</button>
                            <button onclick="CommunityModule.submitReport()" class="modal-btn-submit">Submit Report</button>
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
                        <p class="modal-desc modal-desc--muted">Blocking will hide all messages from this user.</p>
                        <label class="modal-label">Username:</label>
                        <input type="text" id="blockUsername" placeholder="Enter username to block" class="modal-field" />
                        <div class="modal-btn-row">
                            <button onclick="CommunityModule.closeBlockModal()" class="modal-btn-cancel">Cancel</button>
                            <button onclick="CommunityModule.confirmBlock()" class="modal-btn-danger">Block User</button>
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
                        <p class="modal-desc">If you're experiencing a crisis or need immediate support:</p>
                        <div class="modal-resource-card">
                            <h3 class="modal-resource-title">Crisis Resources</h3>
                            <p class="modal-resource-p"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p class="modal-resource-p"><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p class="modal-resource-p"><strong>International:</strong> <a href="https://findahelpline.com" target="_blank" class="modal-link">findahelpline.com</a></p>
                        </div>
                        <div class="modal-resource-card">
                            <h3 class="modal-resource-title">Community Support</h3>
                            <p class="modal-resource-p">Contact our moderators for non-emergency concerns</p>
                            <p class="modal-resource-p"><strong>Email:</strong> support@community.example.com</p>
                        </div>
                        <button onclick="CommunityModule.closeHelpModal()" class="modal-btn-close">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalsHTML);
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

            console.log('🌟 Community Hub Initializing...');
            console.log('✅ Community Hub Initialized Successfully');
console.log('✅ Core.js loaded (v2.0.0 — Supabase integrated)');
