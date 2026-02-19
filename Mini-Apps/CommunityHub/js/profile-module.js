/**
 * PROFILE MODULE
 * v3.0.0 — Full Supabase integration
 * - Avatar: shows Google/uploaded image from profiles.avatar_url
 * - Name: from profiles.name
 * - Karma: from profiles.karma (with GamificationEngine fallback)
 * - Sessions: from profiles.total_sessions
 * - Gifts: from profiles.gifts_given
 * - Minutes: from profiles.total_minutes
 * - Badges: from GamificationEngine (earned badges)
 * - Birthday + Country: from profiles.birthday / profiles.country (editable)
 * - No auto-init: core.js calls init() after CommunityDB is ready
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
                            <div class="profile-avatar" id="profileAvatar" aria-label="Profile avatar">
                                <img id="profileAvatarImg"
                                     style="display:none;width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                                     alt="Profile photo">
                                <span id="profileAvatarFallback">?</span>
                            </div>
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

                        <div class="badges-row" id="badgesRow">
                            <!-- Populated dynamically from GamificationEngine -->
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
                            <div class="detail-row">
                                <span class="detail-label">Birthday</span>
                                <span class="detail-val" id="privateBirthday">—</span>
                                <button class="edit-inline-btn"
                                        onclick="ProfileModule.editBirthday()"
                                        title="Edit birthday"
                                        style="background:none;border:none;cursor:pointer;font-size:12px;opacity:0.6;margin-left:6px;">✏️</button>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Country</span>
                                <span class="detail-val" id="privateCountry">—</span>
                                <button class="edit-inline-btn"
                                        onclick="ProfileModule.editCountry()"
                                        title="Edit country"
                                        style="background:none;border:none;cursor:pointer;font-size:12px;opacity:0.6;margin-left:6px;">✏️</button>
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
            this.updateBadges();
            this.updateBirthday(user);
            this.updateCountry(user);
            console.log('✓ Profile data populated');
        } catch (error) {
            console.error('Profile data population error:', error);
        }
    },

    // ── Avatar ───────────────────────────────────────────────────────────────────

    updateAvatar(user) {
        const avatarWrap   = document.getElementById('profileAvatar');
        const avatarImg    = document.getElementById('profileAvatarImg');
        const avatarFallback = document.getElementById('profileAvatarFallback');
        if (!avatarWrap) return;

        // Priority 1: real photo from profiles.avatar_url
        const photoUrl = user.avatar_url || user.avatarUrl;
        if (photoUrl && avatarImg) {
            avatarImg.src = photoUrl;
            avatarImg.style.display = 'block';
            if (avatarFallback) avatarFallback.style.display = 'none';
            avatarWrap.style.background = 'transparent';
            return;
        }

        // Priority 2: emoji
        if (avatarFallback) {
            avatarFallback.textContent = user.emoji || user.avatar || '?';
            avatarFallback.style.display = 'block';
            if (avatarImg) avatarImg.style.display = 'none';
        }

        // Gradient background when no photo
        if (window.Core?.getAvatarGradient) {
            avatarWrap.style.background = Core.getAvatarGradient(user.id || user.name || 'default');
        }
    },

    // ── Name ─────────────────────────────────────────────────────────────────────

    updateName(user) {
        const el = document.getElementById('profileName');
        if (!el) return;
        // profiles.name is the display name
        el.textContent = user.name || user.displayName || 'Member';
    },

    // ── Karma ────────────────────────────────────────────────────────────────────

    updateKarma(user) {
        const el = document.getElementById('karmaBadge');
        if (!el) return;
        // GamificationEngine is authoritative for karma/xp (from user_progress.payload)
        const karma = window.GamificationEngine?.state?.karma ?? user.karma ?? 0;
        const xp    = window.GamificationEngine?.state?.xp    ?? user.xp    ?? 0;
        el.textContent = `⭐ ${karma.toLocaleString()} Karma  ·  ${xp.toLocaleString()} XP`;
    },

    // ── Bio ──────────────────────────────────────────────────────────────────────

    updateBio(user) {
        const el = document.getElementById('profileInspiration');
        if (!el) return;
        const text = user.bio || user.inspiration;
        if (text) el.textContent = `"${text}"`;
    },

    // ── Stats ────────────────────────────────────────────────────────────────────

    updateStats(user) {
        const sessions = document.getElementById('statCircles');
        if (sessions) {
            sessions.textContent = (user.circles ?? 0).toLocaleString();
        }

        const gifts = document.getElementById('statOffered');
        if (gifts) {
            gifts.textContent = (user.offered ?? 0).toLocaleString();
        }

        const minutes = document.getElementById('statMinutes');
        if (minutes) {
            this.formatMinutes(user.minutes ?? 0, minutes);
        }
    },

    formatMinutes(totalMinutes, el) {
        const n = typeof totalMinutes === 'number' && totalMinutes >= 0 ? totalMinutes : 0;
        const hours = Math.floor(n / 60);
        const mins  = n % 60;
        let text;
        if (hours === 0)    text = `${mins} minutes`;
        else if (mins === 0) text = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        else                text = `${hours}h ${mins}m`;
        if (el) el.textContent = text;
        return text;
    },

    // ── Role / Status ────────────────────────────────────────────────────────────

    updateRole(user) {
        const role = user.role || 'Member';
        const status = user.status || 'available';

        const roleEl = document.getElementById('profileRole');
        if (roleEl) roleEl.textContent = `👤 ${role}`;

        const privateRole = document.getElementById('privateRole');
        if (privateRole) privateRole.textContent = role;

        const privateStatus = document.getElementById('privateStatus');
        if (privateStatus) {
            privateStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    },

    // ── Birthday ─────────────────────────────────────────────────────────────────

    updateBirthday(user) {
        const el = document.getElementById('privateBirthday');
        if (!el) return;
        if (user.birthday) {
            // Format date nicely: "February 14" or "14 February 1990"
            try {
                const d = new Date(user.birthday + 'T00:00:00');
                el.textContent = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
            } catch {
                el.textContent = user.birthday;
            }
        } else {
            el.textContent = '—';
        }
    },

    // ── Country ──────────────────────────────────────────────────────────────────

    updateCountry(user) {
        const el = document.getElementById('privateCountry');
        if (!el) return;
        el.textContent = user.country || '—';
    },

    // ── Badges ───────────────────────────────────────────────────────────────────

    updateBadges() {
        const row = document.getElementById('badgesRow');
        if (!row) return;

        // Badges live in user_progress.payload.badges via GamificationEngine
        const earned = window.GamificationEngine?.state?.badges
                    ?? window.GamificationEngine?.state?.gamification?.badges
                    ?? [];

        if (!earned || earned.length === 0) {
            row.innerHTML = '<span style="font-size:12px;color:var(--text-muted);opacity:0.6;">No badges earned yet</span>';
            return;
        }

        // Show up to 8 most recently earned, newest first
        const toShow = [...earned].slice(-8).reverse();
        row.innerHTML = toShow.map(b => {
            const icon    = b.icon  || '🏅';
            const name    = b.name  || (typeof b === 'string' ? b : 'Badge');
            const rarity  = b.rarity || 'common';
            const rarityColors = { common:'#9ca3af', uncommon:'#10b981', rare:'#3b82f6', epic:'#a855f7', legendary:'#f59e0b' };
            const color   = rarityColors[rarity] || rarityColors.common;
            return `<div class="badge" style="border-color:${color};" title="${name}">
                        ${icon}
                        <div class="badge-tooltip">${name}</div>
                    </div>`;
        }).join('');
    },

    // ── Status Ring ──────────────────────────────────────────────────────────────

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
        if (window.Core?.updatePresenceCount) Core.updatePresenceCount();
    },

    // ============================================================================
    // EDITING
    // ============================================================================

    editProfile() {
        Core.showToast('Edit your profile in the main menu (👤 icon)');
    },

    async editInspiration() {
        const el = document.getElementById('profileInspiration');
        if (!el) return;
        try {
            const current = el.textContent.replace(/"/g, '').trim();
            const newText = prompt('Edit your inspiration message:', current);
            if (newText === null || !newText.trim()) return;

            const sanitized = newText.trim()
                .substring(0, this.config.MAX_INSPIRATION_LENGTH)
                .replace(/<[^>]*>/g, '');
            if (!sanitized) return;

            const ok = await CommunityDB.updateProfile({ inspiration: sanitized });
            if (!ok) { Core.showToast('Could not save — please try again'); return; }

            el.textContent = `"${sanitized}"`;
            if (Core?.state?.currentUser) Core.state.currentUser.inspiration = sanitized;
            Core.showToast('✓ Inspiration updated');
        } catch (error) {
            console.error('Error editing inspiration:', error);
        }
    },

    async editBirthday() {
        const current = Core?.state?.currentUser?.birthday || '';
        const newVal = prompt('Enter your birthday (YYYY-MM-DD):', current);
        if (newVal === null) return;

        const trimmed = newVal.trim();
        // Basic date format validation
        if (trimmed && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
            Core.showToast('Please use format YYYY-MM-DD');
            return;
        }

        const ok = await CommunityDB.updateProfile({ birthday: trimmed || null });
        if (!ok) { Core.showToast('Could not save — please try again'); return; }

        if (Core?.state?.currentUser) Core.state.currentUser.birthday = trimmed || null;
        this.updateBirthday(Core.state.currentUser);
        Core.showToast('✓ Birthday updated');
    },

    async editCountry() {
        const current = Core?.state?.currentUser?.country || '';
        const newVal = prompt('Enter your country:', current);
        if (newVal === null) return;

        const trimmed = newVal.trim().substring(0, 60);
        const ok = await CommunityDB.updateProfile({ country: trimmed || null });
        if (!ok) { Core.showToast('Could not save — please try again'); return; }

        if (Core?.state?.currentUser) Core.state.currentUser.country = trimmed || null;
        this.updateCountry(Core.state.currentUser);
        Core.showToast('✓ Country updated');
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
            if (privateDetails) privateDetails.classList.toggle('visible', view === 'private');
            this.state.currentView = view;
        } catch (error) {
            console.error('Error toggling profile view:', error);
        }
    },

    // ============================================================================
    // PULSE
    // ============================================================================

    async sendPulse() {
        if (!window.Core?.state) { console.error('Core not available'); return; }
        if (window.Core.state.pulseSent) { Core.showToast('Already offered'); return; }

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
                await CommunityDB.setPresence('online', '💗 Offering calm', Core.state.currentRoom || null);
                if (Core?.state?.currentUser) Core.state.currentUser.activity = '💗 Offering calm';
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
            input.addEventListener('input', () => { counter.textContent = input.value.length; });
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

// core.js calls ProfileModule.init() after CommunityDB is ready — no self-init here.
window.ProfileModule = ProfileModule;
