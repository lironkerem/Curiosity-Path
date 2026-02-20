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
                        <!-- Name + Role -->
                        <div class="profile-name-row">
                            <div class="profile-name" id="profileName">Loading...</div>
                            <div id="profileRoleBadge"
                                 style="font-size:0.78rem;font-weight:600;
                                        color:var(--primary,#667eea);
                                        background:rgba(102,126,234,0.1);
                                        border-radius:99px;padding:3px 10px;
                                        white-space:nowrap;">
                                👤 Member
                            </div>
                        </div>

                        <!-- Inspiration -->
                        <div class="profile-inspiration">
                            <span id="profileInspiration">"Here to practice with intention."</span>
                            <button class="edit-inspiration-btn"
                                    onclick="ProfileModule.editInspiration()"
                                    aria-label="Edit inspiration">
                                ✏️
                            </button>
                        </div>

                        <!-- Level — prominent, below inspiration -->
                        <div id="profileLevelRow"
                             style="margin:0.6rem 0 0.4rem;display:flex;align-items:center;gap:8px;">
                            <span id="profileLevelBadge"
                                  style="font-size:1rem;font-weight:700;
                                         color:var(--primary,#667eea);
                                         background:rgba(102,126,234,0.12);
                                         border-radius:99px;padding:5px 14px;
                                         letter-spacing:0.02em;">
                            </span>
                        </div>

                        <!-- Birthday + Country -->
                        <div id="profileLocationRow"
                             style="display:flex;gap:16px;flex-wrap:wrap;
                                    font-size:0.82rem;color:var(--text-muted);
                                    margin-bottom:0.6rem;">
                            <span id="profileBirthdayDisplay"></span>
                            <span id="profileCountryDisplay"></span>
                        </div>

                        <!-- Stats: XP, Karma, Streak, Minutes -->
                        <div class="profile-stats">
                            <div class="p-stat">
                                <span class="p-stat-num" id="statXP">0</span>
                                <div class="p-stat-label">XP</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statKarma">0</span>
                                <div class="p-stat-label">Karma</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statStreak">0</span>
                                <div class="p-stat-label">🔥 Streak</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statMinutesStat">0</span>
                                <div class="p-stat-label">Minutes</div>
                            </div>
                        </div>

                        <div class="profile-activity-counts" id="profileActivityCounts"
                             style="display:flex;gap:12px;flex-wrap:wrap;font-size:0.78rem;color:var(--text-muted);margin-bottom:0.5rem;">
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
                                <button class="edit-inline-btn"
                                        onclick="ProfileModule.editRole()"
                                        title="Edit community role"
                                        style="background:none;border:none;cursor:pointer;font-size:12px;opacity:0.6;margin-left:6px;">✏️</button>
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
            this.updateProfileLocationRow(user);
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
        const g = window.CommunityDB?.getOwnGamificationState?.();

        const karma  = g?.karma  ?? user.karma  ?? 0;
        const xp     = g?.xp     ?? user.xp     ?? 0;
        const level  = g?.level  ?? user.level  ?? 1;
        const streak = g?.streak ?? 0;

        const statKarma = document.getElementById('statKarma');
        if (statKarma) statKarma.textContent = karma.toLocaleString();

        const statXP = document.getElementById('statXP');
        if (statXP) statXP.textContent = xp.toLocaleString();

        const statStreak = document.getElementById('statStreak');
        if (statStreak) statStreak.textContent = streak;

        // Minutes stat (top-level stat box)
        const statMinutesStat = document.getElementById('statMinutesStat');
        if (statMinutesStat) statMinutesStat.textContent = (user.total_minutes ?? user.minutes ?? 0).toLocaleString();

        // Level badge — prominent
        const levelTitles = {1:'Seeker',2:'Practitioner',3:'Adept',4:'Healer',5:'Master',6:'Sage',7:'Enlightened',8:'Buddha',9:'Light',10:'Emptiness'};
        const title = levelTitles[level] || 'Seeker';
        const levelBadge = document.getElementById('profileLevelBadge');
        if (levelBadge) levelBadge.textContent = `✦ Level ${level} · ${title}`;

        if (g) this.updateActivityCounts(g);
    },

    updateActivityCounts(g) {
        const el = document.getElementById('profileActivityCounts');
        if (!el) return;
        const items = [
            g.totalSessions    > 0 ? `🧘 ${g.totalSessions} meditations`   : null,
            g.totalTarotSpreads > 0 ? `🔮 ${g.totalTarotSpreads} readings`  : null,
            g.totalJournalEntries > 0 ? `📓 ${g.totalJournalEntries} journal entries` : null,
            g.streak           > 0 ? `🔥 ${g.streak}-day streak`            : null,
        ].filter(Boolean);
        el.innerHTML = items.map(i => `<span>${i}</span>`).join('');
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
        const role   = user.community_role || user.role || 'Member';
        const status = user.status || 'available';

        // Role pill next to name
        const roleBadge = document.getElementById('profileRoleBadge');
        if (roleBadge) roleBadge.textContent = `👤 ${role}`;

        // Keep private details in sync
        const privateRole = document.getElementById('privateRole');
        if (privateRole) privateRole.textContent = role;

        const privateStatus = document.getElementById('privateStatus');
        if (privateStatus) privateStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    },

    updateProfileLocationRow(user) {
        const birthdayEl = document.getElementById('profileBirthdayDisplay');
        const countryEl  = document.getElementById('profileCountryDisplay');

        if (birthdayEl) {
            if (user.birthday) {
                try {
                    const d = new Date(user.birthday + 'T00:00:00');
                    const formatted = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
                    birthdayEl.textContent = `🎂 ${formatted}`;
                } catch {
                    birthdayEl.textContent = `🎂 ${user.birthday}`;
                }
            } else {
                birthdayEl.textContent = '';
            }
        }

        if (countryEl) {
            if (user.country) {
                // Convert country name to flag emoji via regional indicator letters
                const flag = this._countryFlag(user.country);
                countryEl.textContent = `${flag} ${user.country}`;
            } else {
                countryEl.textContent = '';
            }
        }
    },

    _countryFlag(countryName) {
        // Map common country names to ISO 3166-1 alpha-2 codes for flag emoji
        const map = {
            'israel':'IL','united states':'US','usa':'US','us':'US','united kingdom':'GB','uk':'GB',
            'canada':'CA','australia':'AU','germany':'DE','france':'FR','spain':'ES','italy':'IT',
            'netherlands':'NL','belgium':'BE','switzerland':'CH','sweden':'SE','norway':'NO',
            'denmark':'DK','finland':'FI','poland':'PL','portugal':'PT','austria':'AT',
            'india':'IN','china':'CN','japan':'JP','south korea':'KR','brazil':'BR',
            'mexico':'MX','argentina':'AR','south africa':'ZA','russia':'RU','ukraine':'UA',
            'greece':'GR','turkey':'TR','egypt':'EG','new zealand':'NZ','ireland':'IE',
            'singapore':'SG','thailand':'TH','indonesia':'ID','malaysia':'MY','philippines':'PH',
        };
        const code = map[countryName.toLowerCase().trim()];
        if (!code) return '🌍';
        // Regional indicator symbols: 🇦 = U+1F1E6, offset by char code - 65
        return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
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
        const earned = window.app?.gamification?.state?.badges ?? [];

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
        // Create a hidden file input and trigger it
        let input = document.getElementById('_avatarFileInput');
        if (!input) {
            input = document.createElement('input');
            input.id       = '_avatarFileInput';
            input.type     = 'file';
            input.accept   = 'image/jpeg,image/png,image/webp,image/gif';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.addEventListener('change', () => {
                const file = input.files?.[0];
                if (file) this._uploadAvatar(file);
                input.value = ''; // reset so same file can be re-selected
            });
        }
        input.click();
    },

    async _uploadAvatar(file) {
        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Core.showToast('Image too large — max 5MB');
            return;
        }

        // Show preview immediately (optimistic)
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('profileAvatarImg');
            const fallback = document.getElementById('profileAvatarFallback');
            const wrap = document.getElementById('profileAvatar');
            if (img) { img.src = e.target.result; img.style.display = 'block'; }
            if (fallback) fallback.style.display = 'none';
            if (wrap) wrap.style.background = 'transparent';
        };
        reader.readAsDataURL(file);

        Core.showToast('Uploading photo...');

        const url = await CommunityDB.uploadAvatar(file);
        if (url) {
            if (Core?.state?.currentUser) Core.state.currentUser.avatar_url = url;
            Core.showToast('✓ Profile photo updated');
        } else {
            Core.showToast('Upload failed — please try again');
            // Revert preview to previous avatar
            this.updateAvatar(Core.state.currentUser);
        }
    },

    async editRole() {
        const current = Core?.state?.currentUser?.role || '';
        const newVal = prompt('Enter your community role (e.g. Meditator, Healer, Teacher):', current);
        if (newVal === null) return;

        const trimmed = newVal.trim().substring(0, 60);
        const ok = await CommunityDB.updateProfile({ community_role: trimmed || null });
        if (!ok) { Core.showToast('Could not save — please try again'); return; }

        if (Core?.state?.currentUser) Core.state.currentUser.role = trimmed || 'Member';
        this.updateRole(Core.state.currentUser);
        Core.showToast('✓ Role updated');
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
        const row = document.getElementById('privateBirthday')?.closest('.detail-row');
        if (!row || row.querySelector('input')) return; // already editing

        const current = Core?.state?.currentUser?.birthday || '';
        const valEl   = document.getElementById('privateBirthday');
        const editBtn = row.querySelector('.edit-inline-btn');

        // Hide value + edit button, show inline input
        if (valEl)   valEl.style.display   = 'none';
        if (editBtn) editBtn.style.display = 'none';

        const input = document.createElement('input');
        input.type  = 'date';
        input.value = current;
        input.style.cssText = `flex:1;padding:4px 8px;border-radius:8px;
            border:1px solid rgba(0,0,0,0.15);font-size:0.85rem;
            background:var(--neuro-bg);color:var(--neuro-text);`;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✓';
        saveBtn.style.cssText = `margin-left:6px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;font-weight:700;
            background:var(--primary,#667eea);color:#fff;`;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.style.cssText = `margin-left:4px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;opacity:0.6;
            background:rgba(0,0,0,0.06);color:var(--neuro-text);`;

        const cancel = () => {
            input.remove(); saveBtn.remove(); cancelBtn.remove();
            if (valEl)   valEl.style.display   = '';
            if (editBtn) editBtn.style.display = '';
        };

        const save = async () => {
            const trimmed = input.value;
            if (trimmed && !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
                Core.showToast('Invalid date'); return;
            }
            saveBtn.disabled = true; saveBtn.textContent = '...';
            const ok = await CommunityDB.updateProfile({ birthday: trimmed || null });
            if (!ok) { Core.showToast('Could not save — please try again'); saveBtn.disabled = false; saveBtn.textContent = '✓'; return; }
            if (Core?.state?.currentUser) Core.state.currentUser.birthday = trimmed || null;
            cancel();
            this.updateBirthday(Core.state.currentUser);
            this.updateProfileLocationRow(Core.state.currentUser);
            Core.showToast('✓ Birthday updated');
        };

        saveBtn.onclick  = save;
        cancelBtn.onclick = cancel;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
        });

        row.appendChild(input);
        row.appendChild(saveBtn);
        row.appendChild(cancelBtn);
        input.focus();
    },

    async editCountry() {
        const row = document.getElementById('privateCountry')?.closest('.detail-row');
        if (!row || row.querySelector('input')) return; // already editing

        const current = Core?.state?.currentUser?.country || '';
        const valEl   = document.getElementById('privateCountry');
        const editBtn = row.querySelector('.edit-inline-btn');

        if (valEl)   valEl.style.display   = 'none';
        if (editBtn) editBtn.style.display = 'none';

        const input = document.createElement('input');
        input.type        = 'text';
        input.value       = current;
        input.maxLength   = 60;
        input.placeholder = 'Your country';
        input.style.cssText = `flex:1;padding:4px 8px;border-radius:8px;
            border:1px solid rgba(0,0,0,0.15);font-size:0.85rem;
            background:var(--neuro-bg);color:var(--neuro-text);`;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✓';
        saveBtn.style.cssText = `margin-left:6px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;font-weight:700;
            background:var(--primary,#667eea);color:#fff;`;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.style.cssText = `margin-left:4px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;opacity:0.6;
            background:rgba(0,0,0,0.06);color:var(--neuro-text);`;

        const cancel = () => {
            input.remove(); saveBtn.remove(); cancelBtn.remove();
            if (valEl)   valEl.style.display   = '';
            if (editBtn) editBtn.style.display = '';
        };

        const save = async () => {
            const trimmed = input.value.trim().substring(0, 60);
            saveBtn.disabled = true; saveBtn.textContent = '...';
            const ok = await CommunityDB.updateProfile({ country: trimmed || null });
            if (!ok) { Core.showToast('Could not save — please try again'); saveBtn.disabled = false; saveBtn.textContent = '✓'; return; }
            if (Core?.state?.currentUser) Core.state.currentUser.country = trimmed || null;
            cancel();
            this.updateCountry(Core.state.currentUser);
            this.updateProfileLocationRow(Core.state.currentUser);
            Core.showToast('✓ Country updated');
        };

        saveBtn.onclick   = save;
        cancelBtn.onclick = cancel;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
        });

        row.appendChild(input);
        row.appendChild(saveBtn);
        row.appendChild(cancelBtn);
        input.focus();
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
        }
    },

    refresh() {
        try {
            this.populateData();
        } catch (error) {
            console.error('Profile refresh error:', error);
        }
    }
};

// core.js calls ProfileModule.init() after CommunityDB is ready — no self-init here.
window.ProfileModule = ProfileModule;
