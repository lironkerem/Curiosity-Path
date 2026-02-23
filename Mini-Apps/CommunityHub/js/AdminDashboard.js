/**
 * ADMIN DASHBOARD
 * Full-screen admin console for Community Hub.
 * Accessible via a badge button injected into the hub header.
 *
 * Sections:
 *  1. 📬 Notifications
 *  2. 👥 Members
 *  3. 📊 Engagement
 *  4. ⚡ Collective Field
 *  5. 🌙☀️ Celestial
 *  6. 🛡️ Safety & Stats
 *  7. 🏆 Leaderboard
 *  8. ⏰ Room Usage
 *  9. 💬 Recent Reflections
 * 10. 👁️ Activity Feed
 *
 * @version 1.0.0
 */

const AdminDashboard = {

    // =========================================================================
    // STATE
    // =========================================================================

    _open:         false,
    _pollInterval: null,
    _sections:     {}, // track collapsed state per section

    // =========================================================================
    // BADGE — injected into hub header
    // =========================================================================

    injectBadge() {
        if (document.getElementById('adminDashBadge')) return;

        const isAdmin = window.Core?.state?.currentUser?.is_admin === true;
        if (!isAdmin) return;

        // Inject as a static section at the bottom of the hub, after upcomingEventsContainer
        const anchor = document.getElementById('upcomingEventsContainer')
                    || document.querySelector('.sanctuary-content')
                    || document.body;

        const badge = document.createElement('div');
        badge.id = 'adminDashBadge';
        badge.style.cssText = 'padding: 0 0 32px;';
        badge.innerHTML = `
            <section class="section">
                <div class="section-header">
                    <div class="section-title">🛡️ Admin Tools</div>
                    <div style="font-size:12px;color:var(--text-muted);">
                        <span id="adminDashUnreadBadge"
                              style="display:none;background:#ef4444;color:#fff;border-radius:99px;
                                     font-size:10px;font-weight:700;padding:2px 8px;margin-right:6px;
                                     animation:adminPulse 1.5s infinite;">0 new</span>
                        Community management
                    </div>
                </div>
                <button onclick="AdminDashboard.openDashboard()"
                        style="width:100%;padding:14px;border-radius:14px;border:none;cursor:pointer;
                               font-size:0.92rem;font-weight:700;letter-spacing:0.3px;
                               background:rgba(139,92,246,0.1);color:rgba(139,92,246,0.9);
                               border:1.5px solid rgba(139,92,246,0.25);
                               display:flex;align-items:center;justify-content:center;gap:10px;
                               transition:background 0.15s,box-shadow 0.15s;"
                        onmouseover="this.style.background='rgba(139,92,246,0.18)';this.style.boxShadow='0 4px 16px rgba(139,92,246,0.2)'"
                        onmouseout="this.style.background='rgba(139,92,246,0.1)';this.style.boxShadow='none'">
                    🛡️ Open Admin Dashboard
                </button>
            </section>`;

        // Insert after upcomingEventsContainer if found, else append
        if (anchor.id === 'upcomingEventsContainer') {
            anchor.insertAdjacentElement('afterend', badge);
        } else {
            anchor.appendChild(badge);
        }

        // Inject pulse animation
        if (!document.getElementById('adminDashStyles')) {
            const style = document.createElement('style');
            style.id = 'adminDashStyles';
            style.textContent = `
                @keyframes adminPulse {
                    0%,100% { transform:scale(1); }
                    50%      { transform:scale(1.2); }
                }
                .admin-section-header {
                    display:flex;align-items:center;justify-content:space-between;
                    padding:12px 16px;cursor:pointer;
                    border-radius:12px;user-select:none;
                    background:rgba(139,92,246,0.06);
                    border:1px solid rgba(139,92,246,0.15);
                    margin-bottom:2px;transition:background 0.15s;
                }
                .admin-section-header:hover { background:rgba(139,92,246,0.1); }
                .admin-section-body { padding:12px 4px 4px; }
                .admin-stat-grid {
                    display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;
                }
                .admin-stat-card {
                    background:rgba(139,92,246,0.06);border-radius:12px;
                    padding:14px 12px;text-align:center;
                    border:1px solid rgba(139,92,246,0.12);
                }
                .admin-stat-value { font-size:1.6rem;font-weight:700;color:rgba(139,92,246,0.9); }
                .admin-stat-label { font-size:0.72rem;color:var(--text-muted,#888);margin-top:2px;text-transform:uppercase;letter-spacing:0.5px; }
                .admin-notif-row {
                    display:flex;gap:10px;align-items:flex-start;padding:10px 12px;
                    border-radius:10px;margin-bottom:6px;
                    background:rgba(255,255,255,0.5);
                    border:1px solid rgba(0,0,0,0.06);
                }
                .admin-notif-row.unread { border-left:3px solid rgba(139,92,246,0.8); }
                .admin-table { width:100%;border-collapse:collapse;font-size:0.83rem; }
                .admin-table th { text-align:left;padding:6px 8px;color:var(--text-muted,#888);font-weight:600;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px; }
                .admin-table td { padding:8px;border-top:1px solid rgba(0,0,0,0.06); }
                .admin-refl-row { padding:10px 12px;border-radius:10px;margin-bottom:6px;background:rgba(255,255,255,0.5);border:1px solid rgba(0,0,0,0.06); }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(badge);
        this._startBadgePoll();
    },

    async _updateBadge() {
        const count = await CommunityDB.getUnreadNotificationCount();
        const badge = document.getElementById('adminDashUnreadBadge');
        if (!badge) return;
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    },

    _startBadgePoll() {
        this._updateBadge();
        this._pollInterval = setInterval(() => this._updateBadge(), 60000);
    },

    // =========================================================================
    // OPEN / CLOSE
    // =========================================================================

    openDashboard() {
        if (document.getElementById('adminDashOverlay')) return;
        this._open = true;

        const overlay = document.createElement('div');
        overlay.id = 'adminDashOverlay';
        overlay.style.cssText = `
            position:fixed;inset:0;z-index:99999;
            background:var(--neuro-bg,#f0f0f3);
            overflow-y:auto;font-family:var(--font-body,sans-serif);`;

        overlay.innerHTML = `
            <!-- Header -->
            <div style="position:sticky;top:0;z-index:10;
                        background:rgba(139,92,246,0.92);backdrop-filter:blur(12px);
                        padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
                        box-shadow:0 2px 20px rgba(139,92,246,0.3);">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:1.4rem;">🛡️</span>
                    <div>
                        <div style="font-size:1rem;font-weight:700;color:#fff;letter-spacing:0.5px;">Admin Dashboard</div>
                        <div id="adminDashSubtitle" style="font-size:0.72rem;color:rgba(255,255,255,0.7);">Loading...</div>
                    </div>
                </div>
                <div style="display:flex;gap:10px;align-items:center;">
                    <button onclick="AdminDashboard.refreshAll()"
                            style="padding:6px 14px;border-radius:99px;border:1px solid rgba(255,255,255,0.3);
                                   background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;font-size:0.82rem;">
                        ↻ Refresh
                    </button>
                    <button onclick="AdminDashboard.closeDashboard()"
                            style="width:32px;height:32px;border-radius:50%;border:none;
                                   background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:1.1rem;">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div style="max-width:900px;margin:0 auto;padding:20px 16px 60px;">

                <!-- Notifications -->
                ${this._sectionShell('notifications', '📬 Notifications', true)}

                <!-- Members -->
                ${this._sectionShell('members', '👥 Members')}

                <!-- Engagement -->
                ${this._sectionShell('engagement', '📊 Community Engagement')}

                <!-- Collective Field -->
                ${this._sectionShell('collective', '⚡ Collective Field')}

                <!-- Celestial -->
                ${this._sectionShell('celestial', '🌙☀️ Celestial Status')}

                <!-- Safety -->
                ${this._sectionShell('safety', '🛡️ Safety & Stats')}

                <!-- Leaderboard -->
                ${this._sectionShell('leaderboard', '🏆 Leaderboard')}

                <!-- Room Usage -->
                ${this._sectionShell('rooms', '⏰ Room Usage Today')}

                <!-- Recent Reflections -->
                ${this._sectionShell('reflections', '💬 Recent Reflections')}

                <!-- Retention -->
                ${this._sectionShell('retention', '📈 Retention Signals')}

            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        this.refreshAll();
    },

    closeDashboard() {
        const overlay = document.getElementById('adminDashOverlay');
        if (overlay) overlay.remove();
        document.body.style.overflow = '';
        this._open = false;
        this._updateBadge();
    },

    _sectionShell(id, title, startOpen = false) {
        const open = startOpen;
        return `
        <div style="margin-bottom:12px;">
            <div class="admin-section-header" onclick="AdminDashboard.toggleSection('${id}')">
                <span style="font-size:0.92rem;font-weight:700;color:var(--neuro-text,#333);">${title}</span>
                <span id="adminSecToggle_${id}" style="font-size:0.8rem;color:rgba(139,92,246,0.7);">${open ? '▼' : '▶'}</span>
            </div>
            <div id="adminSec_${id}" class="admin-section-body" style="display:${open ? 'block' : 'none'};">
                <div id="adminSecContent_${id}" style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">
                    Loading...
                </div>
            </div>
        </div>`;
    },

    toggleSection(id) {
        const body   = document.getElementById(`adminSec_${id}`);
        const toggle = document.getElementById(`adminSecToggle_${id}`);
        if (!body) return;
        const open = body.style.display !== 'none';
        body.style.display   = open ? 'none' : 'block';
        toggle.textContent   = open ? '▶' : '▼';
        if (!open) this._loadSection(id);
    },

    // =========================================================================
    // REFRESH ALL
    // =========================================================================

    async refreshAll() {
        const now = new Date();
        const sub = document.getElementById('adminDashSubtitle');
        if (sub) sub.textContent = `Last updated: ${now.toLocaleTimeString()}`;

        // Load all open sections + notifications always
        const sections = ['notifications','members','engagement','collective','celestial','safety','leaderboard','rooms','reflections','retention'];
        for (const id of sections) {
            const body = document.getElementById(`adminSec_${id}`);
            if (body && (body.style.display !== 'none' || id === 'notifications')) {
                this._loadSection(id);
            }
        }
    },

    async _loadSection(id) {
        const el = document.getElementById(`adminSecContent_${id}`);
        if (!el) return;
        el.innerHTML = '<div style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>';

        try {
            switch (id) {
                case 'notifications': await this._renderNotifications(el); break;
                case 'members':       await this._renderMembers(el);       break;
                case 'engagement':    await this._renderEngagement(el);    break;
                case 'collective':    await this._renderCollective(el);    break;
                case 'celestial':     await this._renderCelestial(el);     break;
                case 'safety':        await this._renderSafety(el);        break;
                case 'leaderboard':   await this._renderLeaderboard(el);   break;
                case 'rooms':         await this._renderRooms(el);         break;
                case 'reflections':   await this._renderReflections(el);   break;
                case 'retention':     await this._renderRetention(el);     break;
            }
        } catch (err) {
            el.innerHTML = `<div style="color:#ef4444;font-size:0.83rem;padding:8px;">Failed to load: ${err.message}</div>`;
        }
    },

    // =========================================================================
    // SECTION RENDERERS
    // =========================================================================

    async _renderNotifications(el) {
        const notifs = await CommunityDB.getAdminNotifications(30);
        if (!notifs.length) {
            el.innerHTML = '<div style="color:var(--text-muted,#888);padding:8px;font-size:0.83rem;">No notifications yet.</div>';
            return;
        }

        const typeIcon = { report: '⚠️', help: '🆘', technical: '🔧' };
        const unread   = notifs.filter(n => !n.read).length;

        el.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:0.82rem;color:var(--text-muted,#888);">${unread} unread of ${notifs.length}</span>
                <button onclick="AdminDashboard._markAllRead()"
                        style="padding:4px 12px;border-radius:99px;border:1px solid rgba(139,92,246,0.3);
                               background:rgba(139,92,246,0.08);color:rgba(139,92,246,0.9);
                               font-size:0.78rem;cursor:pointer;">Mark all read</button>
            </div>
            ${notifs.map(n => `
                <div class="admin-notif-row ${n.read ? '' : 'unread'}" id="adminNotif_${n.id}">
                    <span style="font-size:1.2rem;flex-shrink:0;">${typeIcon[n.type] || '📋'}</span>
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize;">${n.type}</span>
                            <span style="font-size:0.72rem;color:var(--text-muted,#888);">${this._timeAgo(n.created_at)}</span>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-muted,#888);">
                            From: <strong>${n.payload?.sender_name || 'Unknown'}</strong>
                            ${n.payload?.room ? `· ${n.payload.room}` : ''}
                        </div>
                        ${n.payload?.message  ? `<div style="font-size:0.82rem;margin-top:4px;font-style:italic;">"${this._esc(n.payload.message)}"</div>` : ''}
                        ${n.payload?.reason   ? `<div style="font-size:0.82rem;margin-top:4px;">Reason: ${this._esc(n.payload.reason)}</div>` : ''}
                        ${n.payload?.details  ? `<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(n.payload.details)}</div>` : ''}
                        ${n.payload?.issueType ? `<div style="font-size:0.82rem;margin-top:4px;">Type: ${this._esc(n.payload.issueType)}</div>` : ''}
                        ${n.payload?.description ? `<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(n.payload.description)}</div>` : ''}
                    </div>
                    ${!n.read ? `
                    <button onclick="AdminDashboard._markRead(${n.id})"
                            style="flex-shrink:0;padding:3px 8px;border-radius:6px;border:none;cursor:pointer;
                                   font-size:0.72rem;background:rgba(139,92,246,0.1);color:rgba(139,92,246,0.8);">
                        ✓ Read
                    </button>` : ''}
                </div>`).join('')}`;
    },

    async _renderMembers(el) {
        const [stats, activeMembers, allProfiles] = await Promise.all([
            CommunityDB.getAdminMemberStats(),
            CommunityDB.getActiveMembers(),
            CommunityDB._sb.from('profiles').select('id, name, emoji, avatar_url, community_status')
                .order('name').then(r => r.data || []),
        ]);

        // Build a map of active presence rows by user_id
        const presenceMap = {};
        activeMembers.forEach(m => { presenceMap[m.user_id] = m; });

        const renderMember = (p, presence) => {
            const status   = presence?.status || 'offline';
            const activity = presence?.activity || '💤 Offline';
            const dot      = status === 'online' ? '#22c55e' : status === 'away' ? '#f59e0b' : '#aaa';
            return `
                <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);cursor:pointer;"
                     onclick="MemberProfileModal?.open('${p.id}')">
                    <div style="width:32px;height:32px;border-radius:50%;
                                background:${Core.getAvatarGradient(p.id)};
                                display:flex;align-items:center;justify-content:center;
                                font-size:0.9rem;color:#fff;flex-shrink:0;overflow:hidden;">
                        ${p.avatar_url
                            ? `<img src="${p.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
                            : (p.emoji || (p.name || '?').charAt(0))}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.85rem;font-weight:600;">${this._esc(p.name || 'Member')}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted,#888);">${this._esc(activity)}</div>
                    </div>
                    <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${dot};"></span>
                </div>`;
        };

        // Split into online/away and offline
        const activeList  = activeMembers;
        const activeIds   = new Set(activeMembers.map(m => m.user_id));
        const offlineList = allProfiles.filter(p => !activeIds.has(p.id));

        el.innerHTML = `
            <div class="admin-stat-grid" style="margin-bottom:16px;">
                ${this._statCard(stats.total || 0, 'Total Members')}
                ${this._statCard(stats.onlineNow || 0, 'Online Now')}
                ${this._statCard(stats.newThisWeek || 0, 'New This Week')}
                ${this._statCard(offlineList.length, 'Offline')}
            </div>

            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin-bottom:8px;">🟢 Online & Away</div>
            ${activeList.length
                ? activeList.map(m => renderMember(m.profiles || { id: m.user_id, name: 'Member' }, m)).join('')
                : '<div style="color:var(--text-muted,#888);font-size:0.83rem;margin-bottom:12px;">No members online.</div>'}

            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin:12px 0 8px;">⚫ Offline (${offlineList.length})</div>
            ${offlineList.map(p => renderMember(p, null)).join('')}`;
    },

    async _renderEngagement(el) {
        const stats = await CommunityDB.getAdminEngagementStats();
        el.innerHTML = `
            <div class="admin-stat-grid">
                ${this._statCard(stats.reflectionsToday  || 0, 'Reflections Today')}
                ${this._statCard(stats.reflectionsTotal  || 0, 'Reflections Total')}
                ${this._statCard(stats.whispersToday     || 0, 'Whispers Today')}
                ${this._statCard(stats.appreciationsToday || 0, 'Appreciations Today')}
            </div>`;
    },

    async _renderCollective(el) {
        const s = window.CollectiveField?.state;
        if (!s) { el.innerHTML = '<div style="color:var(--text-muted,#888);font-size:0.83rem;">Collective Field not loaded.</div>'; return; }

        const waveGoal = s.WAVE_GOAL_MINUTES || 1440;
        const wavePct  = Math.round(((s.waveTotalMinutes || 0) / waveGoal) * 100);

        el.innerHTML = `
            <div class="admin-stat-grid">
                ${this._statCard((s.energyLevel || 0) + '%', 'Energy Level')}
                ${this._statCard(s.communityPulseCount || 0, 'Pulses Today')}
                ${this._statCard((s.waveTotalMinutes || 0) + ' min', 'Wave Minutes')}
                ${this._statCard(wavePct + '%', 'Wave Progress')}
                ${this._statCard(s.DEFAULT_WAVE_PARTICIPANTS || 0, 'Wave Participants')}
            </div>`;
    },

    async _renderCelestial(el) {
        const lunar = window.LunarEngine;
        const solar = window.SolarEngine;

        const lunarRoom = lunar?.currentLunarRoom;
        const lunarData = lunar?.currentMoonData;
        const solarRoom = solar?._currentRoom;

        el.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div style="background:rgba(139,92,246,0.06);border-radius:12px;padding:14px;border:1px solid rgba(139,92,246,0.12);">
                    <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:6px;">🌙 Lunar</div>
                    <div style="font-size:0.9rem;font-weight:600;">${lunarData?.phaseName || 'Loading...'}</div>
                    <div style="font-size:0.78rem;color:var(--text-muted,#888);margin-top:2px;">${lunarData ? Math.round(lunarData.fraction * 100) + '% illuminated' : ''}</div>
                    <div style="font-size:0.78rem;margin-top:6px;">Active room: <strong>${lunarRoom?.roomName || '—'}</strong></div>
                    ${lunarData?.nextFullMoon ? `<div style="font-size:0.72rem;color:var(--text-muted,#888);margin-top:4px;">Next full moon: ${Math.ceil((lunarData.nextFullMoon - new Date()) / (1000*60*60*24))} days</div>` : ''}
                </div>
                <div style="background:rgba(251,191,36,0.08);border-radius:12px;padding:14px;border:1px solid rgba(251,191,36,0.2);">
                    <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:6px;">☀️ Solar</div>
                    <div style="font-size:0.9rem;font-weight:600;">${solar?._currentSeason || 'Loading...'}</div>
                    <div style="font-size:0.78rem;margin-top:6px;">Active room: <strong>${solarRoom?.roomName || '—'}</strong></div>
                </div>
            </div>`;
    },

    async _renderSafety(el) {
        const [safety, pushCount] = await Promise.all([
            CommunityDB.getSafetyStats(),
            CommunityDB.getPushSubscriptionCount(),
        ]);

        el.innerHTML = `
            <div class="admin-stat-grid">
                ${this._statCard(safety.unreadNotifs    || 0, 'Unread Notifications')}
                ${this._statCard(safety.reportsThisWeek || 0, 'Reports This Week')}
                ${this._statCard(safety.blockedTotal    || 0, 'Blocked Relationships')}
                ${this._statCard(pushCount              || 0, 'Push Subscriptions')}
            </div>`;
    },

    async _renderLeaderboard(el) {
        const lb = await CommunityDB.getLeaderboard();

        const renderList = (list, key) => list.length
            ? list.map((r, i) => `
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);">
                    <span style="font-size:1rem;">${['🥇','🥈','🥉'][i] || '·'}</span>
                    <span style="font-size:0.9rem;">${r.profiles?.emoji || ''}</span>
                    <span style="flex:1;font-size:0.85rem;font-weight:600;">${this._esc(r.profiles?.name || 'Member')}</span>
                    <span style="font-size:0.85rem;font-weight:700;color:rgba(139,92,246,0.9);">${r.payload?.[key] || 0}</span>
                </div>`).join('')
            : '<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>';

        el.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">⭐ Top XP</div>
                    ${renderList(lb.xp, 'xp')}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">🌀 Top Karma</div>
                    ${renderList(lb.karma, 'karma')}
                </div>
            </div>`;
    },

    async _renderRooms(el) {
        const rooms = await CommunityDB.getRoomUsageToday();

        if (!rooms.length) {
            el.innerHTML = '<div style="color:var(--text-muted,#888);font-size:0.83rem;">No room entries logged today yet.</div>';
            return;
        }

        el.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Room</th>
                        <th>Entries</th>
                        <th>Avg Duration</th>
                    </tr>
                </thead>
                <tbody>
                    ${rooms.map(r => {
                        const avg = r.entries > 0 ? Math.round(r.totalSeconds / r.entries) : 0;
                        return `<tr>
                            <td style="font-weight:600;">${this._formatRoomId(r.room_id)}</td>
                            <td>${r.entries}</td>
                            <td>${this._formatDuration(avg)}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    },

    async _renderReflections(el) {
        const reflections = await CommunityDB.getRecentReflectionsAdmin(5);

        if (!reflections.length) {
            el.innerHTML = '<div style="color:var(--text-muted,#888);font-size:0.83rem;">No reflections yet.</div>';
            return;
        }

        el.innerHTML = reflections.map(r => `
            <div class="admin-refl-row">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <span style="font-size:0.82rem;font-weight:600;">
                        ${r.profiles?.emoji || ''} ${this._esc(r.profiles?.name || 'Member')}
                    </span>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:0.72rem;color:var(--text-muted,#888);">${this._timeAgo(r.created_at)}</span>
                        <button onclick="AdminDashboard._deleteReflection('${r.id}', this)"
                                style="padding:2px 8px;border-radius:6px;border:none;cursor:pointer;
                                       font-size:0.72rem;background:rgba(239,68,68,0.1);color:#ef4444;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
                <div style="font-size:0.83rem;color:var(--neuro-text,#333);line-height:1.5;">
                    ${this._esc(r.content)}
                </div>
            </div>`).join('');
    },

    async _renderRetention(el) {
        const signals = await CommunityDB.getRetentionSignals();

        el.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">😶 Going Quiet</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;">Active last week, not this week</div>
                    ${signals.quietMembers?.length
                        ? signals.quietMembers.map(id => `
                            <div style="padding:6px 10px;border-radius:8px;margin-bottom:4px;
                                        background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);
                                        font-size:0.83rem;cursor:pointer;"
                                 onclick="MemberProfileModal?.open('${id}')">
                                ${id.substring(0, 8)}...
                            </div>`).join('')
                        : '<div style="color:var(--text-muted,#888);font-size:0.83rem;">None — great retention! 🎉</div>'}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                                color:var(--text-muted,#888);margin-bottom:8px;">🔥 Consistent</div>
                    <div style="font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;">Active last 3 days</div>
                    ${signals.streakMembers?.length
                        ? signals.streakMembers.map(m => `
                            <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;
                                        margin-bottom:4px;background:rgba(34,197,94,0.06);
                                        border:1px solid rgba(34,197,94,0.15);cursor:pointer;"
                                 onclick="MemberProfileModal?.open('${m.user_id}')">
                                <span>${m.emoji || '🧘'}</span>
                                <span style="font-size:0.83rem;font-weight:600;">${this._esc(m.name || 'Member')}</span>
                            </div>`).join('')
                        : '<div style="color:var(--text-muted,#888);font-size:0.83rem;">No data yet.</div>'}
                </div>
            </div>`;
    },

    // =========================================================================
    // ACTIONS
    // =========================================================================

    async _markRead(id) {
        await CommunityDB.markNotificationRead(id);
        const row = document.getElementById(`adminNotif_${id}`);
        if (row) {
            row.classList.remove('unread');
            const btn = row.querySelector('button');
            if (btn) btn.remove();
        }
        this._updateBadge();
    },

    async _markAllRead() {
        await CommunityDB.markAllNotificationsRead();
        this._loadSection('notifications');
        this._updateBadge();
    },

    async _deleteReflection(reflectionId, btn) {
        if (!confirm('Delete this reflection?')) return;
        btn.disabled = true;
        const ok = await CommunityDB.deleteReflection(reflectionId);
        if (ok) {
            btn.closest('.admin-refl-row')?.remove();
            Core.showToast('✓ Reflection deleted');
        } else {
            Core.showToast('❌ Could not delete');
            btn.disabled = false;
        }
    },

    // =========================================================================
    // HELPERS
    // =========================================================================

    _statCard(value, label) {
        return `
            <div class="admin-stat-card">
                <div class="admin-stat-value">${value}</div>
                <div class="admin-stat-label">${label}</div>
            </div>`;
    },

    _timeAgo(iso) {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);
        if (mins  < 1)   return 'just now';
        if (mins  < 60)  return `${mins}m ago`;
        if (hours < 24)  return `${hours}h ago`;
        return `${days}d ago`;
    },

    _formatDuration(seconds) {
        if (!seconds) return '—';
        if (seconds < 60)   return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${(seconds / 3600).toFixed(1)}h`;
    },

    _formatRoomId(id) {
        return (id || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    _esc(str) {
        if (!str) return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },

    // =========================================================================
    // injectAdminUI — called by core.js after user loads
    // =========================================================================

    injectAdminUI() {
        if (window.Core?.state?.currentUser?.is_admin === true) {
            this.injectBadge();
        }
    },
};

window.AdminDashboard = AdminDashboard;
console.log('✅ AdminDashboard loaded');
