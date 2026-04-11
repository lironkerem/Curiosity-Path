/**
 * CORE.JS - Community Hub Central Management System
 * @version 2.1.0 - Supabase integrated
 */

import { CommunityDB } from './community-supabase.js';

const Core = {

    // =========================================================================
    // STATE
    // =========================================================================

    state: {
        currentUser: {
            id:         null,
            name:       'Loading...',
            avatar:     '?',
            emoji:      '',
            avatar_url: null,
            bio:        '',
            status:     'online',
            role:       'Member',
            karma:      0,
            xp:         0,
            badges:     [],
            minutes:    0,
            circles:    0,
            offered:    0,
            birthday:   null,
            country:    null,
            email:      '',
            is_admin:   false
        },
        currentRoom:      null,
        currentActivity:  '✨ Available',
        presenceCount:    0,
        presenceInterval: null,
        pulseSent:        false,
        timerRunning:     false,
        timeLeft:         1200,   // 20 min in seconds
        currentView:      'hubView',
        initialized:      false
    },

    // =========================================================================
    // CONFIGURATION
    // =========================================================================

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
        STATUS_RINGS: {
            silent:    '#60a5fa',
            available: '#34d399',
            guiding:   '#fbbf24',
            deep:      '#a78bfa',
            resonant:  '#f472b6',
            offline:   '#d1d5db'
        },
        AVATAR_GRADIENTS: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ],
        ADMIN_MODULES:       ['CollectiveField', 'LunarEngine', 'SolarEngine', 'UpcomingEvents', 'AdminDashboard'],
        RENDER_DELAY:         100,
        CELESTIAL_INIT_DELAY: 500,
        CELESTIAL_POLL_MAX:   25,   // × 200ms = 5s max wait for SunCalc
        PRESENCE_INTERVAL:    30000,
        HEARTBEAT_INTERVAL:   60000,
        PULSE_COOLDOWN:       60000
    },

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    async init() {
        if (this.state.initialized) {
            console.warn('[Core] Already initialized');
            return;
        }

        try {
            const dbReady = await CommunityDB.init();
            if (!dbReady) throw new Error('Database not ready - is the user logged in?');

            await this.loadCurrentUser();

            console.log('[Core] currentUser loaded:', { id: this.state.currentUser.id, name: this.state.currentUser.name, avatar_url: this.state.currentUser.avatar_url, is_admin: this.state.currentUser.is_admin, community_role: this.state.currentUser.community_role });

            // If avatar_url not in DB profile, fall back to Google OAuth avatar
            // (AuthManager stores it as avatarUrl on app.state.currentUser)
            if (!this.state.currentUser.avatar_url) {
                const appUser = window.app?.state?.currentUser;
                const googleAvatar = appUser?.avatarUrl || appUser?.avatar_url || null;
                if (googleAvatar) this.state.currentUser.avatar_url = googleAvatar;
            }

            await CommunityDB.setPresence(
                this.state.currentUser.status   || 'online',
                this.state.currentUser.activity || '✨ Available',
                null
            );
            CommunityDB.startHeartbeat(this.config.HEARTBEAT_INTERVAL);

            window.addEventListener('pagehide', () => {
                CommunityDB.setOffline();
                CommunityDB.unsubscribeAll();
            });

            this.setupEventListeners();
            this.initializeSafetyModals();
            this.initializeModules();
            this.initializePracticeRooms();
            this.scheduleRoomRendering();
            this.scheduleCelestialInit();
            this.updatePresenceCount();

            // Inject admin UI after modules have rendered
            setTimeout(() => this._injectAdminUIAll(), 1000);

            this.state.initialized = true;

            // Scroll to a section requested from the Dashboard sanctuary widget
            if (window._pendingHubScrollTarget) {
                const targetId = window._pendingHubScrollTarget;
                window._pendingHubScrollTarget = null;

                const doScroll = () => {
                    const maxAttempts = 60; // 6 seconds max
                    let attempts = 0;
                    let lastHeight = 0;
                    let stableCount = 0;

                    const poll = setInterval(() => {
                        attempts++;

                        // Wait for ritual overlay to clear first
                        if (document.body.classList.contains('ritual-active')) {
                            lastHeight = 0;
                            stableCount = 0;
                            return;
                        }

                        const el = document.getElementById(targetId);
                        const currentHeight = el ? el.offsetHeight : 0;

                        if (currentHeight > 10) {
                            if (currentHeight === lastHeight) {
                                stableCount++;
                            } else {
                                stableCount = 0; // height still changing, reset
                            }
                            lastHeight = currentHeight;
                        }

                        // Fire scroll once height is stable for 3 consecutive polls (300ms)
                        const ready = stableCount >= 3 || attempts >= maxAttempts;
                        if (ready && currentHeight > 0) {
                            clearInterval(poll);
                            const bottomBar = document.getElementById('mobile-bottom-bar');
                            const offset = bottomBar ? bottomBar.offsetHeight + 16 : 16;
                            requestAnimationFrame(() => {
                              const top = el.getBoundingClientRect().top + window.scrollY - offset;
                              window.scrollTo({ top, behavior: 'smooth' });
                            });
                        } else if (attempts >= maxAttempts) {
                            clearInterval(poll);
                        }
                    }, 100);
                };

                doScroll();
            }

        } catch (error) {
            console.error('❌ [Core] Initialization failed:', error);
            this.handleInitializationError(error);
        }
    },

    async loadCurrentUser() {
        try {
            const p = await CommunityDB.getMyProfile();
            if (!p) {
                console.warn('[Core] No profile found for current user');
                return;
            }

            const validStatuses = new Set(['online', 'available', 'away', 'guiding', 'silent', 'deep', 'offline']);
            const resolvedStatus = validStatuses.has(p.community_status) ? p.community_status : 'online';

            this.state.currentUser = {
                id:               p.id,
                name:             p.name             || 'Anonymous',
                avatar:           (p.name || 'A').charAt(0).toUpperCase(),
                emoji:            p.emoji            || '',
                avatar_url:       p.avatar_url       || null,
                bio:              p.inspiration      || 'Here to practice with intention.',
                status:           resolvedStatus,
                community_status: resolvedStatus,
                role:             p.is_admin ? 'Admin' : (p.community_role || 'Member'),
                community_role:   p.community_role   || 'Member',
                minutes:          p.total_minutes    || 0,
                circles:          p.total_sessions   || 0,
                offered:          p.gifts_given      || 0,
                birthday:         p.birthday         || null,
                country:          p.country          || null,
                email:            p.email            || '',
                is_admin:         !!p.is_admin,
                // Gamification - sourced from GamificationEngine
                karma:            window.app?.gamification?.state?.karma  ?? 0,
                xp:               window.app?.gamification?.state?.xp     ?? 0,
                badges:           window.app?.gamification?.state?.badges ?? []
            };

        } catch (error) {
            console.error('[Core] loadCurrentUser failed:', error);
        }
    },

    // =========================================================================
    // MODULE INITIALIZATION
    // =========================================================================

    initializeModules() {
        const modules = [
            { name: 'Rituals',         instance: window.Rituals },
            { name: 'ProfileModule',   instance: window.ProfileModule },
            { name: 'CommunityModule', instance: window.CommunityModule }
        ];

        for (const { name, instance } of modules) {
            if (instance?.init) {
                try {
                    // Reset isInitialized so a stale-state singleton always re-runs
                    // after Core has finished loading the current user.
                    if (instance.state?.isInitialized !== undefined) {
                        instance.state.isInitialized = false;
                    }
                    instance.init();
                }
                catch (e) { console.error(`✗ [Core] ${name} init failed:`, e); }
            } else {
                console.warn(`⚠ [Core] ${name} not found or missing init()`);
            }
        }

        if (window.ActiveMembers?.render) {
            window.ActiveMembers.render().catch(e =>
                console.error('✗ [Core] ActiveMembers.render() failed:', e)
            );
        } else {
            console.warn('⚠ [Core] ActiveMembers not found');
        }
    },

    _injectAdminUIAll() {
        for (const name of this.config.ADMIN_MODULES) {
            const m = window[name];
            if (m?.injectAdminUI) {
                try { m.injectAdminUI(); }
                catch (e) { console.warn(`[Core] injectAdminUI failed on ${name}:`, e); }
            }
        }
    },

    handleInitializationError(error) {
        this.showToast('Failed to initialize. Please refresh the page.');
        console.error('[Core] Init error details:', {
            message: error.message,
            stack:   error.stack,
            state:   this.state
        });
    },

    // =========================================================================
    // PRACTICE ROOMS
    // =========================================================================

    initializePracticeRooms() {
        const initialized = [];

        for (const roomName of this.config.ROOM_MODULES) {
            const room = window[roomName];
            if (!room) {
                console.warn(`⚠ [Core] ${roomName} not found on window`);
                continue;
            }
            if (!room.init) {
                console.warn(`⚠ [Core] ${roomName} missing init()`);
                continue;
            }
            try {
                room.init();
                initialized.push(room);
            } catch (e) {
                console.error(`✗ [Core] ${roomName} init failed:`, e);
            }
        }

        if (window.PracticeRoom && initialized.length) {
            PracticeRoom.startHubPresence(initialized);
        }
    },

    scheduleRoomRendering() {
        setTimeout(() => {
            try { this.renderRooms(); }
            catch (e) { console.error('[Core] Room rendering failed:', e); }
        }, this.config.RENDER_DELAY);
    },

    renderRooms() {
        const grid = document.getElementById('roomsGrid');
        if (!grid) {
            console.warn('[Core] #roomsGrid not found - skipping render');
            return;
        }

        const cards = this.config.ROOM_MODULES.reduce((acc, name) => {
            const mod = window[name];
            if (!mod?.getRoomCardHTML) {
                console.warn(`⚠ [Core] ${name} missing getRoomCardHTML()`);
                return acc;
            }
            try {
                const html = mod.getRoomCardHTML();
                if (html) acc.push(html);
            } catch (e) {
                console.error(`✗ [Core] getRoomCardHTML failed for ${name}:`, e);
            }
            return acc;
        }, []);

        if (cards.length) {
            grid.innerHTML = cards.join('');
        } else {
            console.warn('[Core] No room cards to render');
        }
    },

    // =========================================================================
    // CELESTIAL SYSTEMS
    // =========================================================================

    scheduleCelestialInit() {
        setTimeout(() => {
            try { this.initializeCelestialSystems(); }
            catch (e) { console.error('[Core] Celestial init failed:', e); }
        }, this.config.CELESTIAL_INIT_DELAY);
    },

    initializeCelestialSystems() {
        const tryInit = (attemptsLeft) => {
            if (typeof SunCalc === 'undefined') {
                if (attemptsLeft > 0) {
                    setTimeout(() => tryInit(attemptsLeft - 1), 200);
                } else {
                    console.error('[Core] SunCalc never loaded - celestial systems unavailable');
                }
                return;
            }

            for (const [name, engine] of [['LunarEngine', window.LunarEngine], ['SolarEngine', window.SolarEngine]]) {
                if (engine?.init) {
                    try { engine.init(); }
                    catch (e) { console.error(`✗ [Core] ${name} init failed:`, e); }
                } else {
                    console.warn(`⚠ [Core] ${name} not found`);
                }
            }
        };

        tryInit(this.config.CELESTIAL_POLL_MAX);
    },

    // =========================================================================
    // NAVIGATION
    // =========================================================================

    navigateTo(viewId) {
        try {
            const fullscreen = document.getElementById('communityHubFullscreenContainer');
            const hubTab     = document.getElementById('community-hub-tab');

            if (viewId === 'hubView') {
                if (fullscreen) fullscreen.style.display = 'none';
                if (hubTab)     hubTab.style.display = 'block';
                document.body.style.overflow = '';
                document.querySelectorAll('#hubView').forEach(v => v.classList.add('active'));
                this.state.currentView = 'hubView';

            } else if (viewId === 'practiceRoomView') {
                if (fullscreen) {
                    fullscreen.style.display = 'flex';
                    fullscreen.querySelector('#openingOverlay')?.classList.remove('active');
                    fullscreen.querySelector('#closingOverlay')?.classList.remove('active');
                }
                if (hubTab) {
                    hubTab.style.display = 'none';
                } else {
                    console.error('[Core] Hub tab element not found');
                }
                document.body.style.overflow = 'hidden';
                this.state.currentView = 'practiceRoomView';

            } else {
                console.warn(`[Core] Unknown viewId: "${viewId}"`);
            }
        } catch (e) {
            console.error('[Core] Navigation error:', e);
        }
    },

    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================

    setupEventListeners() {
        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.classList.remove('active');
            }
        });

        // Close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelector('.modal-overlay.active')?.classList.remove('active');
            }
        });
    },

    // =========================================================================
    // PRESENCE & STATUS
    // =========================================================================

    async updatePresenceCount() {
        if (this.state.presenceInterval) {
            clearInterval(this.state.presenceInterval);
        }

        const refresh = async () => {
            try {
                if (!CommunityDB.ready) return;
                const members = await CommunityDB.getActiveMembers();
                this.state.presenceCount = members.length;
                const el = document.getElementById('presenceCount');
                if (el) el.textContent = members.length;
            } catch (e) {
                console.error('[Core] updatePresenceCount error:', e);
            }
        };

        await refresh();
        this.state.presenceInterval = setInterval(refresh, this.config.PRESENCE_INTERVAL);
    },

    sendPulse() {
        if (this.state.pulseSent) {
            this.showToast('Please wait before sending another pulse');
            return;
        }
        this.state.pulseSent = true;
        this.showToast('Pulse sent to the community');
        setTimeout(() => { this.state.pulseSent = false; }, this.config.PULSE_COOLDOWN);
    },

    // =========================================================================
    // TOAST
    // =========================================================================

    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) {
            console.warn('[Core] #toast element not found');
            return;
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    },

    // =========================================================================
    // MODALS
    // =========================================================================

    initializeSafetyModals() {
        if (document.getElementById('reportModal')) return;

        document.body.insertAdjacentHTML('beforeend', `
            <!-- Report Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close report modal" onclick="CommunityModule.closeReportModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Report Issue</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Help us maintain a safe space. Your report is confidential.</p>
                        <label for="reportReason" style="display:block; margin-bottom:8px; font-weight:600;">Reason:</label>
                        <select id="reportReason" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;">
                            <option value="">Select a reason...</option>
                            <option value="harassment">Harassment or bullying</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam or advertising</option>
                            <option value="safety">Safety concern</option>
                            <option value="other">Other</option>
                        </select>
                        <label for="reportDetails" style="display:block; margin-bottom:8px; font-weight:600;">Details (optional):</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide any additional context..." style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); resize:vertical; margin-bottom:16px;"></textarea>
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeReportModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.submitReport()" style="flex:1; padding:12px; background:var(--accent); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Submit Report</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Block Modal -->
            <div class="modal-overlay" id="blockModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close block modal" onclick="CommunityModule.closeBlockModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block User</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Blocking will hide all messages from this user.</p>
                        <label for="blockUsername" style="display:block; margin-bottom:8px; font-weight:600;">Username:</label>
                        <input type="text" id="blockUsername" placeholder="Enter username to block" autocomplete="off" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;" />
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeBlockModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.confirmBlock()" style="flex:1; padding:12px; background:#e74c3c; color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Block User</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Help Modal -->
            <div class="modal-overlay" id="helpModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close help modal" onclick="CommunityModule.closeHelpModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg> Get Help</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px;">If you're experiencing a crisis or need immediate support:</p>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Crisis Resources</h3>
                            <p style="margin:8px 0;"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p style="margin:8px 0;"><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p style="margin:8px 0;"><strong>International:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">findahelpline.com</a></p>
                        </div>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Community Support</h3>
                            <p style="margin:8px 0;">Contact our moderators for non-emergency concerns</p>
                            <p style="margin:8px 0;"><strong>Email:</strong> support@community.example.com</p>
                        </div>
                        <button type="button" onclick="CommunityModule.closeHelpModal()" style="width:100%; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Close</button>
                    </div>
                </div>
            </div>
        `);
    },

    // =========================================================================
    // UTILITIES
    // =========================================================================

    formatTime(seconds) {
        if (typeof seconds !== 'number' || seconds < 0) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    },

    getAvatarGradient(seed) {
        if (!seed || typeof seed !== 'string') seed = 'default';
        const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return this.config.AVATAR_GRADIENTS[Math.abs(hash) % this.config.AVATAR_GRADIENTS.length];
    }
};

// Named export for ES module consumers
export { Core };

// Keep window assignment for classic scripts that still reference window.Core
window.Core = Core;

