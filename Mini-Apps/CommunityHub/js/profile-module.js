/**
 * PROFILE MODULE
 * PATCHED: Saves inspiration to Supabase, pulse updates presence
 *
 * @version 2.0.0
 */

const ProfileModule = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        currentView:   'public',
        isInitialized: false
    },

    config: {
        MAX_INSPIRATION_LENGTH: 200,
        PULSE_ANIMATION_DURATION: 600
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    init() {
        if (this.state.isInitialized) {
            console.warn('ProfileModule already initialized');
            return;
        }
        try {
            console.log('👤 Profile Module Loaded');
            this.renderHTML();
            this.populateData();
            this.setupCharCounter();
            this.state.isInitialized = true;
            console.log('✓ ProfileModule initialized');
        } catch (error) {
            console.error('ProfileModule initialization failed:', error);
        }
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================

    getHTML() {
        return `
        <header class="profile-hero">
            <div class="profile-container">
                <div class="profile-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-wrap">
                            <div class="profile-avatar" id="profileAvatar" aria-label="Profile avatar">A</div>
                            <div class="profile-status-ring" id="statusRing" aria-hidden="true"></div>
                            <button class="edit-avatar"
                                    onclick="ProfileModule.editProfile()"
                                    aria-label="Edit profile">
                                📷
                            </button>
                        </div>
                    </div>

                    <div class="profile-info">
                        <div class="profile-name-row">
                            <div class="profile-name" id="profileName">Loading...</div>
                            <div class="karma-badge" id="karmaBadge">⭐ 0 Karma</div>
                        </div>

                        <div class="profile-inspiration">
                            <span id="profileInspiration">"Here to practice with intention."</span>
                            <button class="edit-inspiration-btn"
                                    onclick="ProfileModule.editInspiration()"
                                    aria-label="Edit inspiration">
                                ✏️
                            </button>
                        </div>

                        <div class="profile-meta">
                            <span id="profileRole">👤 Member</span>
                        </div>

                        <div class="profile-stats">
                            <div class="p-stat">
                                <span class="p-stat-num" id="statCircles">0</span>
                                <div class="p-stat-label">Sessions</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statOffered">0</span>
                                <div class="p-stat-label">Gifts</div>
                            </div>
                        </div>

                        <div class="badges-row">
                            <div class="badge">🔥<div class="badge-tooltip">7-Day Streak</div></div>
                            <div class="badge">🧘<div class="badge-tooltip">Zen Master</div></div>
                            <div class="badge">⭐<div class="badge-tooltip">First Share</div></div>
                            <div class="badge">🎯<div class="badge-tooltip">Deep Focus</div></div>
                        </div>

                        <div class="view-toggle">
                            <button class="v-btn active"
                                    onclick="ProfileModule.toggleProfileView('public')"
                                    aria-pressed="true">
                                Public View
                            </button>
                            <button class="v-btn"
                                    onclick="ProfileModule.toggleProfileView('private')"
                                    aria-pressed="false">
                                Private View
                            </button>
                        </div>

                        <div class="private-details" id="privateDetails">
                            <div class="detail-row">
                                <span class="detail-label">Total Practice Time</span>
                                <span class="detail-val" id="statMinutes">0 minutes</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Community Role</span>
                                <span class="detail-val" style="color: var(--primary);" id="privateRole">Member</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Status</span>
                                <span class="detail-val" id="privateStatus">Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>`;
    },

    renderHTML() {
        const container = document.getElementById('profileHeroContainer');
        if (!container) {
            console.warn('profileHeroContainer not found — skipping profile render');
            return;
        }
        try {
            container.innerHTML = this.getHTML();
            console.log('✓ Profile HTML rendered');
        } catch (error) {
            console.error('Profile HTML render error:', error);
        }
    },

    // ============================================================================
    // DATA POPULATION
    // ============================================================================

    /**
     * Populate profile UI from Core.state.currentUser.
     * Core.init() loads the real user before calling ProfileModule.init(),
     * so all data here is real Supabase data.
     */
    populateData() {
        if (!window.Core?.state?.currentUser) {
            console.warn('Core.state.currentUser not available');
            return;
        }
        try {
            const user = window.Core.state.currentUser;
            this.updateAvatar(user);
            this.updateName(user);
            this.updateKarma(user);
            this.updateBio(user);
            this.updateStats(user);
            this.updateStatusRing(user.status);
            this.updateRole(user);
            console.log('✓ Profile data populated');
        } catch (error) {
            console.error('Profile data population error:', error);
        }
    },

    updateAvatar(user) {
        const avatar = document.getElementById('profileAvatar');
        if (!avatar) return;

        // Show emoji if available, otherwise initial
        avatar.textContent = user.emoji || user.avatar || 'U';

        if (window.Core && typeof window.Core.getAvatarGradient === 'function') {
            avatar.style.background = window.Core.getAvatarGradient(user.id || user.name || 'default');
        }
    },

    updateName(user) {
        const name = document.getElementById('profileName');
        if (name && user.name) name.textContent = user.name;
    },

    updateKarma(user) {
        const karma = document.getElementById('karmaBadge');
        if (karma && typeof user.karma === 'number') {
            karma.textContent = `⭐ ${user.karma.toLocaleString()} Karma`;
        }
    },

    updateBio(user) {
        const bio = document.getElementById('profileInspiration');
        if (bio && user.bio) bio.textContent = `"${user.bio}"`;
    },

    updateStats(user) {
        const statMinutes = document.getElementById('statMinutes');
        if (statMinutes && typeof user.minutes === 'number') {
            statMinutes.textContent = this.formatMinutes(user.minutes);
        }

        const statCircles = document.getElementById('statCircles');
        if (statCircles && typeof user.circles === 'number') {
            statCircles.textContent = user.circles.toLocaleString();
        }

        const statOffered = document.getElementById('statOffered');
        if (statOffered && typeof user.offered === 'number') {
            statOffered.textContent = user.offered.toLocaleString();
        }
    },

    updateRole(user) {
        const role = document.getElementById('profileRole');
        if (role && user.role) role.textContent = `👤 ${user.role}`;

        const privateRole = document.getElementById('privateRole');
        if (privateRole && user.role) privateRole.textContent = user.role;

        const privateStatus = document.getElementById('privateStatus');
        if (privateStatus && user.status) {
            privateStatus.textContent = user.status.charAt(0).toUpperCase() + user.status.slice(1);
        }
    },

    formatMinutes(totalMinutes) {
        if (typeof totalMinutes !== 'number' || totalMinutes < 0) return '0 minutes';
        const hours   = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours === 0)       return `${minutes} minutes`;
        if (minutes === 0)     return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    },

    updateStatusRing(status) {
        const ring = document.getElementById('statusRing');
        if (!ring) return;
        try {
            const statusRings = window.Core?.config?.statusRings || {};
            const color = statusRings[status] || statusRings.offline || '#d1d5db';
            ring.style.borderColor = color;
            ring.style.boxShadow   = `0 0 0 4px ${color}33`;
        } catch (error) {
            console.error('Error updating status ring:', error);
        }
    },

    updatePresenceCount() {
        if (window.Core && typeof window.Core.updatePresenceCount === 'function') {
            window.Core.updatePresenceCount();
        }
    },

    // ============================================================================
    // PROFILE EDITING
    // ============================================================================

    editProfile() {
        Core.showToast('Profile editing coming soon');
        console.log('Edit profile clicked');
    },

    /**
     * Edit and save the inspiration (bio) message.
     * Saves to Supabase profiles.inspiration.
     */
    async editInspiration() {
        const inspirationEl = document.getElementById('profileInspiration');
        if (!inspirationEl) return;

        try {
            const currentText = inspirationEl.textContent.replace(/"/g, '').trim();
            const newText = prompt('Edit your inspiration message:', currentText);

            if (newText === null || !newText.trim()) return;

            const sanitized = this.sanitizeInspiration(newText.trim());
            if (!sanitized) return;

            // Save to Supabase
            const ok = await CommunityDB.updateProfile({ inspiration: sanitized });
            if (!ok) {
                Core.showToast('Could not save — please try again');
                return;
            }

            // Update display
            inspirationEl.textContent = `"${sanitized}"`;

            // Update local state
            if (Core?.state?.currentUser) {
                Core.state.currentUser.bio = sanitized;
            }

            Core.showToast('✓ Inspiration updated');

        } catch (error) {
            console.error('Error editing inspiration:', error);
        }
    },

    sanitizeInspiration(text) {
        if (!text || typeof text !== 'string') return '';
        return text.trim()
            .substring(0, this.config.MAX_INSPIRATION_LENGTH)
            .replace(/<[^>]*>/g, '');
    },

    // ============================================================================
    // VIEW TOGGLE
    // ============================================================================

    toggleProfileView(view) {
        if (view !== 'public' && view !== 'private') return;
        try {
            const privateDetails = document.getElementById('privateDetails');
            const buttons = document.querySelectorAll('.v-btn');

            buttons.forEach(btn => {
                const isActive = btn.textContent.toLowerCase().includes(view);
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive.toString());
            });

            if (privateDetails) {
                privateDetails.classList.toggle('visible', view === 'private');
            }

            this.state.currentView = view;
        } catch (error) {
            console.error('Error toggling profile view:', error);
        }
    },

    // ============================================================================
    // PULSE SYSTEM
    // ============================================================================

    async sendPulse() {
        if (!window.Core?.state) {
            console.error('Core not available');
            return;
        }

        if (window.Core.state.pulseSent) {
            Core.showToast('Already offered');
            return;
        }

        const btn = document.getElementById('pulseBtn');
        if (!btn) return;

        try {
            btn.classList.add('sending');

            setTimeout(async () => {
                btn.classList.remove('sending');
                btn.classList.add('sent');
                btn.innerHTML = '✓<span class="pulse-ripple"></span>';

                window.Core.state.pulseSent = true;

                const pulseFill = document.getElementById('pulseFill');
                if (pulseFill) pulseFill.style.width = '50%';

                Core.showToast('💗 Calm offered to the community');

                // Update presence to show "offering calm"
                await CommunityDB.setPresence(
                    'online',
                    '💗 Offering calm',
                    Core.state.currentRoom || null
                );
                if (Core?.state?.currentUser) {
                    Core.state.currentUser.activity = '💗 Offering calm';
                }

            }, this.config.PULSE_ANIMATION_DURATION);

        } catch (error) {
            console.error('Error sending pulse:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    setupCharCounter() {
        const input   = document.getElementById('reflectionInput');
        const counter = document.getElementById('charCount');
        if (input && counter) {
            input.addEventListener('input', () => {
                counter.textContent = input.value.length;
            });
            console.log('✓ Character counter initialized');
        }
    },

    refresh() {
        try {
            this.populateData();
            console.log('✓ Profile refreshed');
        } catch (error) {
            console.error('Profile refresh error:', error);
        }
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProfileModule.init());
} else {
    ProfileModule.init();
}

window.ProfileModule = ProfileModule;
