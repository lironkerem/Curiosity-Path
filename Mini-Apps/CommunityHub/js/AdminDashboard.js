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
        badge.className = 'admin-dash-badge-wrap';
        badge.innerHTML = `
            <section class="section">
                <div class="section-header">
                    <div class="section-title">🛡️ Admin Tools</div>
                    <div class="section-subtitle">
                        <span id="adminDashUnreadBadge" class="admin-dash-unread-badge">0 new</span>
                        Community management
                    </div>
                </div>
                <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/AdminDashboard.png"
                     onclick="AdminDashboard.openDashboard()"
                     alt="Open Admin Dashboard"
                     class="admin-dash-img"
                     onmouseover="this.style.opacity='0.9';this.style.transform='scale(1.01)'"
                     onmouseout="this.style.opacity='1';this.style.transform='scale(1)'">
            </section>`;

        // Insert inside .sanctuary-content, after upcomingEventsContainer
        const sanctuaryContent = document.querySelector('.sanctuary-content');
        const upcoming = document.getElementById('upcomingEventsContainer');
        if (sanctuaryContent && upcoming) {
            upcoming.insertAdjacentElement('afterend', badge);
        } else if (sanctuaryContent) {
            sanctuaryContent.appendChild(badge);
        } else {
            document.body.appendChild(badge);
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

                @media (max-width: 767px) {
                    .admin-stat-grid { grid-template-columns:repeat(2,1fr) !important; gap:7px; }
                    .admin-stat-card { padding:9px 8px; border-radius:10px; }
                    .admin-stat-value { font-size:1.05rem; }
                    .admin-stat-label { font-size:0.63rem; }
                    .admin-section-header { padding:8px 10px; }
                    .admin-section-body { padding:6px 2px 2px; }
                    .admin-notif-row { padding:7px 8px; gap:7px; }
                    .admin-table { font-size:0.72rem; }
                    .admin-table th { font-size:0.62rem; padding:4px 5px; }
                    .admin-table td { padding:5px 6px; }
                    .admin-refl-row { padding:7px 8px; }
                    /* Overlay header */
                    #adminDashOverlay > div:first-child { padding:10px 14px !important; }
                    #adminDashOverlay > div:first-child span[style*="font-size:1.4rem"] { font-size:1rem !important; }
                    #adminDashOverlay > div:first-child div[style*="font-size:1rem"] { font-size:0.85rem !important; }
                    /* Content area */
                    #adminDashOverlay > div:last-child { padding:14px 12px 48px !important; }
                }
            `;
            document.head.appendChild(style);
        }

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
        overlay.className = 'admin-dash-overlay';

        overlay.innerHTML = `
            <!-- Header -->
            <div class="admin-dash-header">
                <div class="admin-dash-header-left">
                    <span class="admin-dash-header-icon">🛡️</span>
                    <div>
                        <div class="admin-dash-title">Admin Dashboard</div>
                        <div id="adminDashSubtitle" class="admin-dash-subtitle">Loading...</div>
                    </div>
                </div>
                <div class="admin-dash-header-right">
                    <button onclick="AdminDashboard.refreshAll()" class="admin-dash-refresh-btn">
                        ↻ Refresh
                    </button>
                    <button onclick="AdminDashboard.closeDashboard()" class="admin-dash-close-btn">
                        ✕
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="admin-dash-content">

                <!-- Notifications -->
                ${this._sectionShell('notifications', '📬 Notifications', true)}

                <!-- Members -->
                ${this._sectionShell('members', '👥 Members')}

                <!-- Engagement -->
                ${this._sectionShell('engagement', '📊 Community Engagement')}

                <!-- Safety -->
                ${this._sectionShell('safety', '🛡️ Safety & Stats')}

                <!-- Leaderboard -->
                ${this._sectionShell('leaderboard', '🏆 Leaderboard')}

                <!-- Room Usage -->
                ${this._sectionShell('rooms', '⏰ Room Usage Today')}

                <!-- Retention -->
                ${this._sectionShell('retention', '📈 Retention Signals')}

                <!-- Bulk Actions -->
                ${this._sectionShell('bulk', '⚡ Bulk Actions')}

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
        <div class="admin-sec-shell">
            <div class="admin-section-header" onclick="AdminDashboard.toggleSection('${id}')">
                <span class="admin-sec-title">${title}</span>
                <span id="adminSecToggle_${id}" class="admin-sec-toggle">${open ? '▼' : '▶'}</span>
            </div>
            <div id="adminSec_${id}" class="admin-section-body" style="display:${open ? 'block' : 'none'};">
                <div id="adminSecContent_${id}" class="admin-sec-loading">
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
        const sections = ['notifications','members','engagement','safety','leaderboard','rooms','retention','bulk'];
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
        el.innerHTML = '<div class="admin-sec-loading">Loading...</div>';

        try {
            switch (id) {
                case 'notifications': await this._renderNotifications(el); break;
                case 'members':       await this._renderMembers(el);       break;
                case 'engagement':    await this._renderEngagement(el);    break;
                case 'safety':        await this._renderSafety(el);        break;
                case 'leaderboard':   await this._renderLeaderboard(el);   break;
                case 'rooms':         await this._renderRooms(el);         break;
                case 'retention':     await this._renderRetention(el);     break;
                case 'bulk':          await this._renderBulk(el);           break;
            }
        } catch (err) {
            el.innerHTML = `<div class="admin-sec-error">Failed to load: ${err.message}</div>`;
        }
    },

    // =========================================================================
    // SECTION RENDERERS
    // =========================================================================

    async _renderNotifications(el) {
        const notifs = await CommunityDB.getAdminNotifications(30);
        if (!notifs.length) {
            el.innerHTML = '<div class="admin-sec-loading">No notifications yet.</div>';
            return;
        }

        const typeIcon = { report: '⚠️', help: '🆘', technical: '🔧' };
        const unread   = notifs.filter(n => !n.read).length;

        el.innerHTML = `
            <div class="admin-notif-header">
                <span class="admin-notif-count">${unread} unread of ${notifs.length}</span>
                <button onclick="AdminDashboard._markAllRead()" class="admin-notif-mark-btn">Mark all read</button>
            </div>
            ${notifs.map(n => `
                <div class="admin-notif-row ${n.read ? '' : 'unread'}" id="adminNotif_${n.id}">
                    <span class="admin-notif-icon">${typeIcon[n.type] || '📋'}</span>
                    <div class="admin-notif-body">
                        <div class="admin-notif-meta">
                            <span class="admin-notif-type">${n.type}</span>
                            <span class="admin-notif-time">${this._timeAgo(n.created_at)}</span>
                        </div>
                        <div class="admin-notif-from">
                            From: <strong>${n.payload?.sender_name || 'Unknown'}</strong>
                            ${n.payload?.room ? `· ${n.payload.room}` : ''}
                        </div>
                        ${n.payload?.message  ? `<div class="admin-notif-text admin-notif-text--italic">"${this._esc(n.payload.message)}"</div>` : ''}
                        ${n.payload?.reason   ? `<div class="admin-notif-text">Reason: ${this._esc(n.payload.reason)}</div>` : ''}
                        ${n.payload?.details  ? `<div class="admin-notif-text admin-notif-text--muted">${this._esc(n.payload.details)}</div>` : ''}
                        ${n.payload?.issueType ? `<div class="admin-notif-text">Type: ${this._esc(n.payload.issueType)}</div>` : ''}
                        ${n.payload?.description ? `<div class="admin-notif-text admin-notif-text--muted">${this._esc(n.payload.description)}</div>` : ''}
                    </div>
                    ${!n.read ? `
                    <button onclick="AdminDashboard._markRead(${n.id})" class="admin-notif-read-btn">
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
                <div class="admin-member-row" onclick="MemberProfileModal?.open('${p.id}')">
                    <div class="admin-member-avatar" style="background:${Core.getAvatarGradient(p.id)};">
                        ${p.avatar_url
                            ? `<img src="${p.avatar_url}" class="admin-member-avatar-img">`
                            : (p.emoji || (p.name || '?').charAt(0))}
                    </div>
                    <div class="admin-member-info">
                        <div class="admin-member-name">${this._esc(p.name || 'Member')}</div>
                        <div class="admin-member-activity">${this._esc(activity)}</div>
                    </div>
                    <span class="admin-member-dot" style="background:${dot};"></span>
                </div>`;
        };

        // Split into online/away and offline
        const activeList  = activeMembers;
        const activeIds   = new Set(activeMembers.map(m => m.user_id));
        const offlineList = allProfiles.filter(p => !activeIds.has(p.id));

        el.innerHTML = `
            <div class="admin-stat-grid admin-stat-grid--mb">
                ${this._statCard(stats.total || 0, 'Total Members')}
                ${this._statCard(stats.onlineNow || 0, 'Online Now')}
                ${this._statCard(stats.newThisWeek || 0, 'New This Week')}
                ${this._statCard(offlineList.length, 'Offline')}
            </div>

            <div class="admin-section-label">🟢 Online & Away</div>
            ${activeList.length
                ? activeList.map(m => renderMember(m.profiles || { id: m.user_id, name: 'Member' }, m)).join('')
                : '<div class="admin-empty">No members online.</div>'}

            <div class="admin-section-label admin-section-label--mt">⚫ Offline (${offlineList.length})</div>
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
                <div class="admin-lb-row">
                    <span class="admin-lb-medal">${['🥇','🥈','🥉'][i] || '·'}</span>
                    <span class="admin-lb-emoji">${r.profiles?.emoji || ''}</span>
                    <span class="admin-lb-name">${this._esc(r.profiles?.name || 'Member')}</span>
                    <span class="admin-lb-value">${r.payload?.[key] || 0}</span>
                </div>`).join('')
            : '<div class="admin-empty">No data yet.</div>';

        el.innerHTML = `
            <div class="admin-2col-grid">
                <div>
                    <div class="admin-section-label">⭐ Top XP</div>
                    ${renderList(lb.xp, 'xp')}
                </div>
                <div>
                    <div class="admin-section-label">🌀 Top Karma</div>
                    ${renderList(lb.karma, 'karma')}
                </div>
            </div>`;
    },

    async _renderRooms(el) {
        const rooms = await CommunityDB.getRoomUsageToday();

        if (!rooms.length) {
            el.innerHTML = '<div class="admin-empty">No room entries logged today yet.</div>';
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
                            <td class="admin-table-bold">${this._formatRoomId(r.room_id)}</td>
                            <td>${r.entries}</td>
                            <td>${this._formatDuration(avg)}</td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    },


    async _renderRetention(el) {
        const signals = await CommunityDB.getRetentionSignals();

        el.innerHTML = `
            <div class="admin-2col-grid">
                <div>
                    <div class="admin-section-label">😶 Going Quiet</div>
                    <div class="admin-section-sublabel">Active last week, not this week</div>
                    ${signals.quietMembers?.length
                        ? signals.quietMembers.map(id => `
                            <div class="admin-quiet-row" onclick="MemberProfileModal?.open('${id}')">
                                ${id.substring(0, 8)}...
                            </div>`).join('')
                        : '<div class="admin-empty">None — great retention! 🎉</div>'}
                </div>
                <div>
                    <div class="admin-section-label">🔥 Consistent</div>
                    <div class="admin-section-sublabel">Active last 3 days</div>
                    ${signals.streakMembers?.length
                        ? signals.streakMembers.map(m => `
                            <div class="admin-streak-row" onclick="MemberProfileModal?.open('${m.user_id}')">
                                <span>${m.emoji || '🧘'}</span>
                                <span class="admin-streak-name">${this._esc(m.name || 'Member')}</span>
                            </div>`).join('')
                        : '<div class="admin-empty">No data yet.</div>'}
                </div>
            </div>`;
    },

    // =========================================================================
    // BULK ACTIONS
    // =========================================================================

    async _renderBulk(el) {
        // Fetch all profiles for the member selector
        const { data: members } = await CommunityDB._sb
            .from('profiles')
            .select('id, name, emoji, avatar_url, community_role')
            .order('name');

        // Store members on instance for use by action handlers
        this._bulkMembers = members || [];
        this._bulkSelected = new Set();

        el.innerHTML = `
            <div class="admin-bulk-wrap">

                <!-- Member selector -->
                <div class="admin-bulk-selector">
                    <div class="admin-bulk-header">
                        <div class="admin-section-label">Select Members</div>
                        <div class="admin-bulk-btn-group">
                            <button onclick="AdminDashboard._bulkSelectAll()" class="admin-bulk-pill-btn admin-bulk-pill-btn--active">All</button>
                            <button onclick="AdminDashboard._bulkSelectNone()" class="admin-bulk-pill-btn">None</button>
                        </div>
                    </div>

                    <!-- Search -->
                    <input id="bulkMemberSearch" type="text" placeholder="Search members..."
                           oninput="AdminDashboard._bulkFilterMembers(this.value)"
                           class="admin-bulk-input admin-bulk-input--mb">

                    <!-- Member list -->
                    <div id="bulkMemberList" class="admin-bulk-list">
                        ${this._bulkMembers.map(m => `
                            <label id="bulkRow_${m.id}" class="admin-bulk-row"
                                   onmouseover="this.style.background='rgba(139,92,246,0.06)'"
                                   onmouseout="this.style.background='none'">
                                <input type="checkbox" value="${m.id}"
                                       onchange="AdminDashboard._bulkToggle('${m.id}', this.checked)"
                                       class="admin-bulk-checkbox">
                                <span class="admin-bulk-name-emoji">${m.emoji || '👤'}</span>
                                <span class="admin-bulk-member-name">${this._esc(m.name || 'Member')}</span>
                                <span class="admin-bulk-member-role">${this._esc(m.community_role || 'Member')}</span>
                            </label>`).join('')}
                    </div>

                    <!-- Selected count -->
                    <div id="bulkSelectedCount" class="admin-bulk-count">
                        0 members selected
                    </div>
                </div>

                <!-- Divider -->
                <div class="admin-bulk-divider"></div>

                <!-- Action tabs -->
                <div class="admin-bulk-tabs" id="bulkTabBar">
                    ${[['xp','🎁 XP'],['karma','🌀 Karma'],['badge','🏅 Badge'],['unlock','🔓 Unlock'],['message','💬 Message']]
                        .map(([id,label],i) => `
                        <button onclick="AdminDashboard._bulkShowTab('${id}')"
                                id="bulkTab_${id}"
                                class="admin-bulk-tab ${i===0 ? 'admin-bulk-tab--active' : ''}">
                            ${label}
                        </button>`).join('')}
                </div>

                <!-- XP panel -->
                <div id="bulkPanel_xp">
                    <div class="admin-bulk-panel-desc">Send XP to all selected members</div>
                    <div class="admin-bulk-action-row">
                        <input id="bulkXpAmount" type="number" min="1" value="100" placeholder="XP amount"
                               class="admin-bulk-input admin-bulk-input--flex">
                        <button onclick="AdminDashboard._bulkSendXP()" class="admin-bulk-action-btn">Send XP</button>
                    </div>
                </div>

                <!-- Karma panel -->
                <div id="bulkPanel_karma" style="display:none;">
                    <div class="admin-bulk-panel-desc">Send Karma to all selected members</div>
                    <div class="admin-bulk-action-row">
                        <input id="bulkKarmaAmount" type="number" min="1" value="10" placeholder="Karma amount"
                               class="admin-bulk-input admin-bulk-input--flex">
                        <button onclick="AdminDashboard._bulkSendKarma()" class="admin-bulk-action-btn">Send Karma</button>
                    </div>
                </div>

                <!-- Badge panel -->
                <div id="bulkPanel_badge" style="display:none;">
                    <div class="admin-bulk-panel-desc">Send a badge to all selected members</div>
                    <select id="bulkBadgeSelect" class="admin-bulk-select">
                        <option value="first_step">🌱 First Step</option>
                        <option value="triple_threat">🎪 Triple Threat</option>
                        <option value="moon_walker">🌙 Moon Walker</option>
                        <option value="sun_keeper">☀️ Sun Keeper</option>
                        <option value="energy_master">⚡ Energy Master</option>
                        <option value="wave_rider">🌊 Wave Rider</option>
                        <option value="community_heart">💜 Community Heart</option>
                        <option value="deep_diver">🔱 Deep Diver</option>
                    </select>
                    <button onclick="AdminDashboard._bulkSendBadge()" class="admin-bulk-action-btn admin-bulk-action-btn--full">Send Badge</button>
                </div>

                <!-- Unlock panel -->
                <div id="bulkPanel_unlock" style="display:none;">
                    <div class="admin-bulk-panel-desc">Unlock a feature for all selected members</div>
                    <select id="bulkUnlockSelect" class="admin-bulk-select">
                        <option value="premium_rooms">Premium Rooms</option>
                        <option value="extended_history">Extended History</option>
                        <option value="custom_themes">Custom Themes</option>
                        <option value="advanced_analytics">Advanced Analytics</option>
                        <option value="priority_support">Priority Support</option>
                    </select>
                    <button onclick="AdminDashboard._bulkSendUnlock()" class="admin-bulk-action-btn admin-bulk-action-btn--full">Unlock Feature</button>
                </div>

                <!-- Message panel -->
                <div id="bulkPanel_message" style="display:none;">
                    <div class="admin-bulk-panel-desc">Broadcast a message to all selected members — appears in their Whispers inbox</div>
                    <textarea id="bulkMessageText" placeholder="Write your message..."
                              rows="4" class="admin-bulk-textarea"></textarea>
                    <button onclick="AdminDashboard._bulkSendMessage()" class="admin-bulk-action-btn admin-bulk-action-btn--full">Send Message</button>
                </div>

            </div>`;
    },

    // ── Bulk helpers ──────────────────────────────────────────────────────────

    _bulkToggle(userId, checked) {
        if (checked) this._bulkSelected.add(userId);
        else         this._bulkSelected.delete(userId);
        this._bulkUpdateCount();
    },

    _bulkSelectAll() {
        this._bulkMembers.forEach(m => {
            this._bulkSelected.add(m.id);
            const cb = document.querySelector(`#bulkRow_${m.id} input[type=checkbox]`);
            if (cb) cb.checked = true;
        });
        this._bulkUpdateCount();
    },

    _bulkSelectNone() {
        this._bulkSelected.clear();
        document.querySelectorAll('#bulkMemberList input[type=checkbox]').forEach(cb => cb.checked = false);
        this._bulkUpdateCount();
    },

    _bulkUpdateCount() {
        const el = document.getElementById('bulkSelectedCount');
        if (el) el.textContent = `${this._bulkSelected.size} member${this._bulkSelected.size !== 1 ? 's' : ''} selected`;
    },

    _bulkFilterMembers(query) {
        const q = query.toLowerCase();
        document.querySelectorAll('#bulkMemberList label').forEach(row => {
            const name = row.querySelector('span:nth-child(3)')?.textContent?.toLowerCase() || '';
            row.style.display = name.includes(q) ? '' : 'none';
        });
    },

    _bulkShowTab(tab) {
        ['xp','karma','badge','unlock','message'].forEach(id => {
            const panel = document.getElementById(`bulkPanel_${id}`);
            const btn   = document.getElementById(`bulkTab_${id}`);
            if (!panel || !btn) return;
            const active = id === tab;
            panel.style.display = active ? 'block' : 'none';
            btn.classList.toggle('admin-bulk-tab--active', active);
        });
    },

    _bulkGuard() {
        if (this._bulkSelected.size === 0) {
            Core.showToast('Select at least one member first');
            return false;
        }
        return true;
    },

    async _bulkSendXP() {
        if (!this._bulkGuard()) return;
        const amount = parseInt(document.getElementById('bulkXpAmount')?.value, 10);
        if (!amount || amount < 1) { Core.showToast('Enter a valid XP amount'); return; }
        const ids = [...this._bulkSelected];
        Core.showToast(`Sending ${amount} XP to ${ids.length} members...`);
        let ok = 0;
        for (const uid of ids) {
            const { error } = await CommunityDB._sb.rpc('update_user_gamification', {
                target_user_id: uid, xp_delta: amount, karma_delta: 0
            });
            if (!error) {
                ok++;
                // push notify each recipient
                window.MemberProfileModal?._adminPushNotify?.(uid, '🎁 Gift from Aanandoham!', `You received +${amount} XP!`);
            }
        }
        Core.showToast(`✓ Sent ${amount} XP to ${ok}/${ids.length} members`);
    },

    async _bulkSendKarma() {
        if (!this._bulkGuard()) return;
        const amount = parseInt(document.getElementById('bulkKarmaAmount')?.value, 10);
        if (!amount || amount < 1) { Core.showToast('Enter a valid Karma amount'); return; }
        const ids = [...this._bulkSelected];
        Core.showToast(`Sending ${amount} Karma to ${ids.length} members...`);
        let ok = 0;
        for (const uid of ids) {
            const { error } = await CommunityDB._sb.rpc('update_user_gamification', {
                target_user_id: uid, xp_delta: 0, karma_delta: amount
            });
            if (!error) {
                ok++;
                window.MemberProfileModal?._adminPushNotify?.(uid, '🎁 Gift from Aanandoham!', `You received +${amount} Karma!`);
            }
        }
        Core.showToast(`✓ Sent ${amount} Karma to ${ok}/${ids.length} members`);
    },

    async _bulkSendBadge() {
        if (!this._bulkGuard()) return;
        const badgeId = document.getElementById('bulkBadgeSelect')?.value;
        const badgeLabel = document.getElementById('bulkBadgeSelect')?.options[document.getElementById('bulkBadgeSelect').selectedIndex]?.text || badgeId;
        if (!badgeId) { Core.showToast('Select a badge'); return; }
        const ids = [...this._bulkSelected];
        Core.showToast(`Sending badge to ${ids.length} members...`);
        let ok = 0;
        for (const uid of ids) {
            // Fetch current badges then append
            const progress = await CommunityDB.getUserProgress(uid);
            const badges = progress?.badges || [];
            if (!badges.find(b => (b.id || b) === badgeId)) {
                badges.push({ id: badgeId, earnedAt: new Date().toISOString() });
            }
            const { error } = await CommunityDB._sb
                .from('user_progress')
                .update({ payload: { ...progress, badges } })
                .eq('user_id', uid);
            if (!error) {
                ok++;
                window.MemberProfileModal?._adminPushNotify?.(uid, '🏅 New Badge!', `You earned the ${badgeLabel} badge!`);
            }
        }
        Core.showToast(`✓ Sent badge to ${ok}/${ids.length} members`);
    },

    async _bulkSendUnlock() {
        if (!this._bulkGuard()) return;
        const feature = document.getElementById('bulkUnlockSelect')?.value;
        const featureLabel = document.getElementById('bulkUnlockSelect')?.options[document.getElementById('bulkUnlockSelect').selectedIndex]?.text || feature;
        if (!feature) { Core.showToast('Select a feature'); return; }
        const ids = [...this._bulkSelected];
        Core.showToast(`Unlocking ${featureLabel} for ${ids.length} members...`);
        let ok = 0;
        for (const uid of ids) {
            const { error } = await CommunityDB._sb.rpc('update_user_gamification', {
                target_user_id: uid, xp_delta: 0, karma_delta: 0, unlock_feature: feature
            });
            if (!error) {
                ok++;
                window.MemberProfileModal?._adminPushNotify?.(uid, '🔓 Feature Unlocked!', `${featureLabel} has been unlocked for you!`);
            }
        }
        Core.showToast(`✓ Unlocked ${featureLabel} for ${ok}/${ids.length} members`);
    },

    async _bulkSendMessage() {
        if (!this._bulkGuard()) return;
        const message = document.getElementById('bulkMessageText')?.value?.trim();
        if (!message) { Core.showToast('Write a message first'); return; }
        const ids = [...this._bulkSelected];
        Core.showToast(`Broadcasting to ${ids.length} members...`);
        const result = await CommunityDB.broadcastMessage(ids, message);
        if (result.sent > 0) {
            // Push notify all recipients
            for (const uid of ids) {
                window.MemberProfileModal?._adminPushNotify?.(uid, '💬 Message from Aanandoham', message.substring(0, 80));
            }
            document.getElementById('bulkMessageText').value = '';
            Core.showToast(`✓ Message sent to ${result.sent}/${ids.length} members`);
        } else {
            Core.showToast('❌ Failed to send messages');
        }
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
