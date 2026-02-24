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
        <header class="profile-hero" style="border-radius:20px 20px 0 0;overflow:hidden;">
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

                        <!-- Status picker -->
                        <div style="position:relative;">
                            <button id="statusPickerBtn"
                                    onclick="ProfileModule.toggleStatusPicker()"
                                    style="display:flex;align-items:center;gap:6px;
                                           padding:5px 12px;border-radius:99px;border:none;
                                           cursor:pointer;font-size:0.78rem;font-weight:600;
                                           background:var(--neuro-bg,#f0f0f3);
                                           color:var(--neuro-text);
                                           box-shadow:2px 2px 6px rgba(0,0,0,0.1),-1px -1px 4px rgba(255,255,255,0.7);
                                           transition:box-shadow 0.15s;">
                                <span id="statusPickerDot"
                                      style="width:9px;height:9px;border-radius:50%;
                                             background:var(--ring-available,#6b9b37);
                                             flex-shrink:0;"></span>
                                <span id="statusPickerLabel">Available</span>
                                <span style="opacity:0.5;font-size:10px;">▼</span>
                            </button>

                            <div id="statusPickerDropdown"
                                 style="display:none;position:absolute;top:calc(100% + 8px);left:50%;
                                        transform:translateX(-50%);
                                        background:var(--neuro-bg,#f0f0f3);
                                        border-radius:14px;padding:6px;
                                        box-shadow:6px 6px 16px rgba(0,0,0,0.15),-3px -3px 10px rgba(255,255,255,0.7);
                                        z-index:999;min-width:170px;">
                                ${[
                                    {status:'online',   label:'Available',   color:'var(--ring-available,#6b9b37)', icon:'🟢'},
                                    {status:'away',     label:'Away',        color:'var(--ring-guiding,#d4a574)',   icon:'🟡'},
                                    {status:'silent',   label:'In Silence',  color:'var(--ring-silent,#6ba3b3)',    icon:'🔵'},
                                    {status:'deep',     label:'Deep Practice',color:'var(--ring-deep,#8b7355)',    icon:'🟤'},
                                    {status:'offline',  label:'Offline',     color:'var(--ring-offline,#a89279)',   icon:'⚫'},
                                ].map(s => `
                                <button onclick="ProfileModule.setStatus('${s.status}','${s.label}','${s.color}')"
                                        style="display:flex;align-items:center;gap:10px;width:100%;
                                               padding:8px 10px;border:none;border-radius:10px;
                                               background:none;cursor:pointer;font-size:0.82rem;
                                               color:var(--neuro-text);text-align:left;
                                               transition:background 0.15s;"
                                        onmouseover="this.style.background='rgba(0,0,0,0.05)'"
                                        onmouseout="this.style.background='none'">
                                    <span style="width:10px;height:10px;border-radius:50%;
                                                 background:${s.color};flex-shrink:0;"></span>
                                    ${s.label}
                                </button>`).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="profile-info">
                        <!-- Name + Role pill -->
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
                             style="margin:0.6rem 0 0.4rem;display:flex;align-items:center;">
                            <span id="profileLevelBadge"
                                  style="font-size:1rem;font-weight:700;
                                         color:var(--primary,#667eea);
                                         background:rgba(102,126,234,0.12);
                                         border-radius:99px;padding:5px 14px;">
                            </span>
                        </div>

                        <!-- Birthday + Country inline -->
                        <div id="profileLocationRow"
                             style="display:flex;gap:16px;flex-wrap:wrap;
                                    font-size:0.82rem;color:var(--text-muted);
                                    margin-bottom:0.6rem;">
                            <span id="profileBirthdayDisplay"></span>
                            <span id="profileCountryDisplay"></span>
                        </div>

                        <!-- Stats: XP, Karma, Blessings, Favourite Room -->
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
                                <span class="p-stat-num" id="statBlessings">0</span>
                                <div class="p-stat-label">🙏 Blessings</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statFavRoom">—</span>
                                <div class="p-stat-label">Fav Room</div>
                            </div>
                        </div>

                        <div class="profile-activity-counts" id="profileActivityCounts"
                             style="display:flex;gap:12px;flex-wrap:wrap;font-size:0.78rem;color:var(--text-muted);margin-top:10px;margin-bottom:0.5rem;">
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
                                My Activity
                            </button>
                        </div>

                        <div class="private-details" id="privateDetails">
                            <!-- My Activity Cards -->
                            <div id="myActivityGrid"
                                 style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">

                                <div class="activity-card" onclick="ProfileModule.openActivityModal('journal')"
                                     style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
                                            cursor:pointer;text-align:center;
                                            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s,box-shadow 0.15s;">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">📓</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">Journal</div>
                                    <div id="activityCount_journal"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">— entries</div>
                                </div>

                                <div class="activity-card" onclick="ProfileModule.openActivityModal('gratitude')"
                                     style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
                                            cursor:pointer;text-align:center;
                                            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s,box-shadow 0.15s;">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">🙏</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">Gratitude</div>
                                    <div id="activityCount_gratitude"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">— entries</div>
                                </div>

                                <div class="activity-card" onclick="ProfileModule.openActivityModal('energy')"
                                     style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
                                            cursor:pointer;text-align:center;
                                            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s,box-shadow 0.15s;">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">⚡</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">Energy</div>
                                    <div id="activityCount_energy"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">— check-ins</div>
                                </div>

                                <div class="activity-card" onclick="ProfileModule.openActivityModal('flip')"
                                     style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
                                            cursor:pointer;text-align:center;
                                            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s,box-shadow 0.15s;">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">🔄</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">Flip the Script</div>
                                    <div id="activityCount_flip"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">— entries</div>
                                </div>

                            </div>
                        </div>

                        <!-- Activity Modal -->
                        <div id="activityModal"
                             style="display:none;position:fixed;inset:0;z-index:9999;
                                    background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                                    align-items:center;justify-content:center;
                                    opacity:0;transition:opacity 0.25s ease;">
                            <div id="activityModalInner"
                                 style="background:var(--neuro-bg,#f0f0f3);
                                        border-radius:20px;padding:1.5rem;
                                        max-width:480px;width:92%;max-height:80vh;
                                        position:relative;display:flex;flex-direction:column;
                                        box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                                        transform:translateY(16px);transition:transform 0.25s ease;">
                                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                                    <div id="activityModalTitle"
                                         style="font-size:1.1rem;font-weight:700;color:var(--neuro-text);"></div>
                                    <button onclick="ProfileModule.closeActivityModal()"
                                            style="background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
                                </div>
                                <div id="activityModalBody"
                                     style="overflow-y:auto;flex:1;padding-right:4px;"></div>
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
            this.loadActivityData().catch(() => {});
            this.loadCommunityStats().catch(() => {});
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

        // Blessings + Favourite Room loaded separately via loadCommunityStats()

        const levelTitles = {1:'Seeker',2:'Practitioner',3:'Adept',4:'Healer',5:'Master',6:'Sage',7:'Enlightened',8:'Buddha',9:'Light',10:'Emptiness'};
        const title = levelTitles[level] || 'Seeker';
        const levelBadge = document.getElementById('profileLevelBadge');
        if (levelBadge) levelBadge.textContent = `✦ Level ${level} · ${title}`;

        if (g) this.updateActivityCounts(g);
    },

    async loadCommunityStats() {
        if (!window.CommunityDB?.ready) return;
        try {
            const userId = window.Core?.state?.currentUser?.id;
            if (!userId) return;

            // ── Blessings sent ────────────────────────────────────────────────
            // room_blessings has one row per user per room — count rows for this user
            const { count: blessingCount, error: bErr } = await CommunityDB._sb
                .from('room_blessings')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);
            const statBlessings = document.getElementById('statBlessings');
            if (statBlessings) statBlessings.textContent = (!bErr && blessingCount != null)
                ? blessingCount.toLocaleString()
                : '0';

            // ── Favourite room (most visited via room_entries) ────────────────
            const { data: entries, error: rErr } = await CommunityDB._sb
                .from('room_entries')
                .select('room_id')
                .eq('user_id', userId);

            const statFavRoom = document.getElementById('statFavRoom');
            if (!rErr && entries && entries.length > 0) {
                // Count entries per room
                const counts = {};
                entries.forEach(e => { counts[e.room_id] = (counts[e.room_id] || 0) + 1; });
                const favRoomId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                // Prettify room ID (e.g. "silent-room" → "Silent Room")
                const pretty = favRoomId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                if (statFavRoom) statFavRoom.textContent = pretty;
            } else {
                if (statFavRoom) statFavRoom.textContent = '—';
            }
        } catch (e) {
            console.warn('[ProfileModule] loadCommunityStats error:', e);
        }
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
    // NOTE: XP, Karma, Blessings, FavRoom are handled by updateKarma() and loadCommunityStats()
    // This method is retained for any legacy stat elements outside the main stats row.
    updateStats(user) {
        // No-op: all active stats are populated via updateKarma() and loadCommunityStats()
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

        const roleBadge = document.getElementById('profileRoleBadge');
        if (roleBadge) roleBadge.textContent = `👤 ${role}`;

        const privateRole = document.getElementById('privateRole');
        if (privateRole) privateRole.textContent = role;

        const privateStatus = document.getElementById('privateStatus');
        if (privateStatus) privateStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
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

    async updateProfileLocationRow(user) {
        // If birthday/country not on currentUser, fetch from DB
        let birthday = user.birthday;
        let country  = user.country;

        if ((!birthday && !country) && window.CommunityDB?.ready) {
            try {
                const profile = await CommunityDB.getMyProfile();
                if (profile) {
                    birthday = profile.birthday;
                    country  = profile.country;
                    // Cache back onto currentUser for future calls
                    if (window.Core?.state?.currentUser) {
                        Core.state.currentUser.birthday = birthday;
                        Core.state.currentUser.country  = country;
                    }
                }
            } catch (e) {}
        }

        const birthdayEl = document.getElementById('profileBirthdayDisplay');
        const countryEl  = document.getElementById('profileCountryDisplay');

        if (birthdayEl) {
            if (birthday) {
                try {
                    const d = new Date(birthday + 'T00:00:00');
                    const formatted = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
                    birthdayEl.textContent = `🎂 ${formatted}`;
                } catch { birthdayEl.textContent = `🎂 ${birthday}`; }
            } else {
                birthdayEl.textContent = '';
            }
        }

        if (countryEl) {
            if (country) {
                const flag = this._countryFlag(country);
                countryEl.textContent = `${flag} ${country}`;
            } else {
                countryEl.textContent = '';
            }
        }
    },

    _countryFlag(countryName) {
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
        return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
    },

    // ============================================================================
    // MY ACTIVITY — data loading + modals
    // ============================================================================

    async loadActivityData() {
        // Wait for AppState to finish loading from cloud/localStorage
        if (window.app?.state?.ready) {
            try { await window.app.state.ready; } catch (e) {}
        }

        let data = null;

        // Read from app.state.data — the authoritative source for all entry types
        const appData = window.app?.state?.data;
        if (appData) {
            data = {
                journalEntries:   appData.journalEntries   || [],
                energyEntries:    appData.energyEntries    || [],
                gratitudeEntries: appData.gratitudeEntries || [],
                flipEntries:      appData.flipEntries      || [],
            };
        }

        // Fallback: if all arrays empty, fetch directly from user_progress.payload
        // (handles edge case where ProfileModule loads before app.state is populated)
        if (!data || Object.values(data).every(arr => arr.length === 0)) {
            try {
                if (window.CommunityDB?.ready) {
                    const payload = await CommunityDB.getOwnFullProgress();
                    if (payload) {
                        data = {
                            journalEntries:   payload.journalEntries   || [],
                            energyEntries:    payload.energyEntries    || [],
                            gratitudeEntries: payload.gratitudeEntries || [],
                            flipEntries:      payload.flipEntries      || [],
                        };
                    }
                }
            } catch (e) {
                console.warn("[ProfileModule] loadActivityData fallback failed:", e);
            }
        }

        if (!data) return;
        this._activityData = data;

        // Update counts on cards
        this._setActivityCount("journal",   data.journalEntries.length,   "entries");
        this._setActivityCount("gratitude", data.gratitudeEntries.length, "entries");
        this._setActivityCount("energy",    data.energyEntries.length,    "check-ins");
        this._setActivityCount("flip",      data.flipEntries.length,      "entries");
    },

    _setActivityCount(type, count, label) {
        const el = document.getElementById(`activityCount_${type}`);
        if (el) el.textContent = count > 0 ? `${count} ${label}` : `No ${label} yet`;
    },

    async openActivityModal(type) {
        if (!this._activityData) await this.loadActivityData();

        const configs = {
            journal:   { title: '📓 Journal Entries',       icon: '📓' },
            gratitude: { title: '🙏 Gratitude Entries',     icon: '🙏' },
            energy:    { title: '⚡ Energy Check-ins',       icon: '⚡' },
            flip:      { title: '🔄 Flip the Script',       icon: '🔄' },
        };

        const cfg     = configs[type];
        const entries = this._activityData?.[`${type}Entries`] || [];

        const titleEl = document.getElementById('activityModalTitle');
        const bodyEl  = document.getElementById('activityModalBody');
        if (titleEl) titleEl.textContent = cfg.title;
        if (bodyEl)  bodyEl.innerHTML = entries.length > 0
            ? entries.map(e => this._renderActivityEntry(type, e)).join('')
            : `<div style="text-align:center;color:var(--text-muted);padding:2rem;">No entries yet</div>`;

        const modal = document.getElementById('activityModal');
        const inner = document.getElementById('activityModalInner');
        if (!modal) return;
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            inner.style.transform = 'translateY(0)';
        });

        // Close on backdrop
        modal.onclick = (e) => { if (e.target === modal) this.closeActivityModal(); };

        // Close on Escape
        this._activityEscHandler = (e) => { if (e.key === 'Escape') this.closeActivityModal(); };
        document.addEventListener('keydown', this._activityEscHandler);
    },

    closeActivityModal() {
        const modal = document.getElementById('activityModal');
        const inner = document.getElementById('activityModalInner');
        if (!modal) return;
        modal.style.opacity = '0';
        inner.style.transform = 'translateY(16px)';
        setTimeout(() => { modal.style.display = 'none'; }, 250);
        if (this._activityEscHandler) {
            document.removeEventListener('keydown', this._activityEscHandler);
        }
    },

    _renderActivityEntry(type, entry) {
        const date = this._formatEntryDate(entry.timestamp || entry.date);
        const base = `border-radius:12px;padding:12px 14px;margin-bottom:10px;
                      background:var(--surface,rgba(0,0,0,0.03));
                      border-left:3px solid var(--primary,#667eea);
                      font-size:0.86rem;line-height:1.6;`;

        switch (type) {
            case 'journal': {
                const text = entry.situation || entry.feelings || '';
                const mood = entry.mood ? `<span style="margin-left:6px;opacity:0.7;">${entry.mood}</span>` : '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}${mood}</div>
                    <div style="color:var(--neuro-text);">${this._esc(text)}</div>
                </div>`;
            }
            case 'gratitude': {
                const items = entry.entries || [];
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${date}</div>
                    ${items.map((g, i) => `<div style="margin-bottom:3px;">🙏 ${this._esc(g)}</div>`).join('')}
                </div>`;
            }
            case 'energy': {
                const level = entry.energy ?? '—';
                const notes = entry.notes ? `<div style="margin-top:4px;opacity:0.8;">${this._esc(entry.notes)}</div>` : '';
                const tags  = (entry.moodTags || []).length
                    ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;">
                        ${entry.moodTags.map(t => `<span style="background:rgba(102,126,234,0.12);color:var(--primary);border-radius:99px;padding:2px 8px;font-size:0.72rem;">${this._esc(t)}</span>`).join('')}
                       </div>` : '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}</div>
                    <div style="font-size:1rem;font-weight:700;color:var(--primary);">⚡ Energy: ${level}/10</div>
                    ${tags}${notes}
                </div>`;
            }
            case 'flip': {
                const text = entry.situation || entry.original || entry.text || entry.content || '';
                const reframe = entry.reframe || entry.flipped || '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}</div>
                    ${text ? `<div style="color:var(--neuro-text);">📝 ${this._esc(text)}</div>` : ''}
                    ${reframe ? `<div style="margin-top:6px;color:var(--primary);">✨ ${this._esc(reframe)}</div>` : ''}
                </div>`;
            }
            default: return '';
        }
    },

    _formatEntryDate(ts) {
        if (!ts) return '';
        try {
            const d = new Date(typeof ts === 'number' ? ts : ts);
            return d.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric', year:'numeric' });
        } catch { return String(ts); }
    },

    _esc(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
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
            const rarityLabels = { common:'Common', uncommon:'Uncommon', rare:'Rare', epic:'Epic', legendary:'Legendary' };
            const color   = rarityColors[rarity] || rarityColors.common;
            return `<div title="${name} · ${rarityLabels[rarity] || 'Common'}"
                        style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                               width:52px;height:60px;border-radius:12px;
                               background:var(--neuro-bg,#f0f0f3);
                               box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                               border-bottom:3px solid ${color};
                               cursor:default;transition:transform 0.15s,box-shadow 0.15s;
                               position:relative;overflow:hidden;"
                        onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='4px 4px 12px rgba(0,0,0,0.15),-2px -2px 8px rgba(255,255,255,0.8)'"
                        onmouseout="this.style.transform='';this.style.boxShadow='3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7)'">
                        <div style="position:absolute;top:0;left:0;right:0;height:3px;
                                    background:${color};opacity:0.3;border-radius:12px 12px 0 0;"></div>
                        <span style="font-size:1.5rem;line-height:1;">${icon}</span>
                    </div>`;
        }).join('');
    },

    // ── Status Ring ──────────────────────────────────────────────────────────────

    updateStatusRing(status) {
        const ring = document.getElementById('statusRing');
        const colorMap = {
            online:    { color: 'var(--ring-available, #6b9b37)', label: 'Available'     },
            available: { color: 'var(--ring-available, #6b9b37)', label: 'Available'     },
            away:      { color: 'var(--ring-guiding,   #d4a574)', label: 'Away'          },
            silent:    { color: 'var(--ring-silent,     #6ba3b3)', label: 'In Silence'   },
            guiding:   { color: 'var(--ring-guiding,   #d4a574)', label: 'Away'          },
            deep:      { color: 'var(--ring-deep,       #8b7355)', label: 'Deep Practice'},
            offline:   { color: 'var(--ring-offline,    #a89279)', label: 'Offline'      },
        };
        const cfg = colorMap[status] || colorMap.offline;

        if (ring) {
            ring.style.borderColor = cfg.color;
            ring.style.boxShadow   = `0 0 0 4px ${cfg.color.replace('var(', 'color-mix(in srgb, ').replace(')', ' 20%, transparent)')}`;
        }

        // Keep picker button in sync
        const dot = document.getElementById('statusPickerDot');
        const lbl = document.getElementById('statusPickerLabel');
        if (dot) dot.style.background = cfg.color;
        if (lbl) lbl.textContent = cfg.label;
    },

    toggleStatusPicker() {
        const dropdown = document.getElementById('statusPickerDropdown');
        if (!dropdown) return;
        const isOpen = dropdown.style.display !== 'none';
        dropdown.style.display = isOpen ? 'none' : 'block';

        // Close when clicking outside
        if (!isOpen) {
            const close = (e) => {
                if (!document.getElementById('statusPickerBtn')?.contains(e.target) &&
                    !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', close);
                }
            };
            setTimeout(() => document.addEventListener('click', close), 0);
        }
    },

    async setStatus(status, label, color) {
        // Close dropdown
        const dropdown = document.getElementById('statusPickerDropdown');
        if (dropdown) dropdown.style.display = 'none';

        // Activity label per status
        const activityMap = {
            online:  '✨ Available',
            away:    '🌿 Away',
            silent:  '🤫 In Silence',
            deep:    '🧘 Deep Practice',
            offline: '💤 Offline',
        };
        const activity = activityMap[status] || '✨ Available';

        // Update UI immediately
        this.updateStatusRing(status);
        const dot   = document.getElementById('statusPickerDot');
        const lbl   = document.getElementById('statusPickerLabel');
        if (dot) dot.style.background = color;
        if (lbl) lbl.textContent = label;

        // Update in-memory state
        if (window.Core?.state?.currentUser) Core.state.currentUser.status = status;

        // Persist to Supabase
        try {
            const roomId = Core?.state?.currentRoom || null;
            await Promise.all([
                CommunityDB.setPresence(status, activity, roomId),
                CommunityDB.updateProfile({ community_status: status }),
            ]);
            Core.showToast(`Status set to ${label}`);
        } catch (err) {
            console.error('[ProfileModule] setStatus error:', err);
            Core.showToast('Could not update status — please try again');
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

        if (Core?.state?.currentUser) {
            Core.state.currentUser.community_role = trimmed || 'Member';
            Core.state.currentUser.role = trimmed || 'Member'; // keep both in sync
        }
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
                const isPublicBtn  = btn.textContent.trim() === 'Public View';
                const isPrivateBtn = btn.textContent.trim() === 'My Activity';
                const isActive = (view === 'public' && isPublicBtn) || (view === 'private' && isPrivateBtn);
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
