/**
 * ADMIN DASHBOARD
 * Full-screen admin console for Community Hub.
 * @version 1.1.0
 */

import { Core } from './core.js';

const AdminDashboard = {

    // =========================================================================
    // STATE
    // =========================================================================

    _open:         false,
    _pollInterval: null,
    _bulkMembers:  [],
    _bulkSelected: new Set(),

    // =========================================================================
    // CONSTANTS
    // =========================================================================

    _SECTIONS: ['notifications', 'members', 'engagement', 'safety', 'leaderboard', 'rooms', 'retention', 'bulk'],

    _BULK_TABS: [
        ['xp',      '🎁 XP'],
        ['karma',   '🌀 Karma'],
        ['badge',   '🏅 Badge'],
        ['unlock',  '🔓 Unlock'],
        ['message', '💬 Message'],
    ],

    _BADGES: [
        ['first_step',       '🌱 First Step'],
        ['triple_threat',    '🎪 Triple Threat'],
        ['moon_walker',      '🌙 Moon Walker'],
        ['sun_keeper',       '☀️ Sun Keeper'],
        ['energy_master',    '⚡ Energy Master'],
        ['wave_rider',       '🌊 Wave Rider'],
        ['community_heart',  '💜 Community Heart'],
        ['deep_diver',       '🔱 Deep Diver'],
    ],

    _UNLOCKS: [
        ['premium_rooms',       'Premium Rooms'],
        ['extended_history',    'Extended History'],
        ['custom_themes',       'Custom Themes'],
        ['advanced_analytics',  'Advanced Analytics'],
        ['priority_support',    'Priority Support'],
    ],

    _NOTIF_ICONS: { report: '⚠️', help: '🆘', technical: '🔧' },

    // =========================================================================
    // STYLES - injected once
    // =========================================================================

    _injectStyles() {
        if (document.getElementById('adminDashStyles')) return;
        const style = document.createElement('style');
        style.id = 'adminDashStyles';
        style.textContent = `
            @keyframes adminPulse {
                0%,100% { transform:scale(1); }
                50%      { transform:scale(1.2); }
            }
            .admin-section-header {
                display:flex; align-items:center; justify-content:space-between;
                padding:12px 16px; cursor:pointer; border-radius:12px; user-select:none;
                background:var(--neuro-accent-a08); border:1px solid var(--neuro-accent-a20);
                margin-bottom:2px; transition:background 0.15s;
            }
            .admin-section-header:hover { background:var(--neuro-accent-a10); }
            .admin-section-body   { padding:12px 4px 4px; }
            .admin-stat-grid {
                display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px;
            }
            .admin-stat-card {
                background:var(--neuro-accent-a08); border-radius:12px;
                padding:14px 12px; text-align:center; border:1px solid var(--neuro-accent-a10);
            }
            .admin-stat-value { font-size:1.6rem; font-weight:700; color:var(--neuro-accent); }
            .admin-stat-label { font-size:0.72rem; color:var(--text-muted,#888); margin-top:2px; text-transform:uppercase; letter-spacing:0.5px; }
            .admin-notif-row {
                display:flex; gap:10px; align-items:flex-start;
                padding:10px 12px; border-radius:10px; margin-bottom:6px;
                background:rgba(255,255,255,0.5); border:1px solid rgba(0,0,0,0.06);
            }
            .admin-notif-row.unread { border-left:3px solid var(--neuro-accent); }
            .admin-table           { width:100%; border-collapse:collapse; font-size:0.83rem; }
            .admin-table th        { text-align:left; padding:6px 8px; color:var(--text-muted,#888); font-weight:600; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px; }
            .admin-table td        { padding:8px; border-top:1px solid rgba(0,0,0,0.06); }
            .admin-refl-row        { padding:10px 12px; border-radius:10px; margin-bottom:6px; background:rgba(255,255,255,0.5); border:1px solid rgba(0,0,0,0.06); }

            @media (max-width:767px) {
                .admin-stat-grid        { grid-template-columns:repeat(2,1fr) !important; gap:7px; }
                .admin-stat-card        { padding:9px 8px; border-radius:10px; }
                .admin-stat-value       { font-size:1.05rem; }
                .admin-stat-label       { font-size:0.63rem; }
                .admin-section-header   { padding:8px 10px; }
                .admin-section-body     { padding:6px 2px 2px; }
                .admin-notif-row        { padding:7px 8px; gap:7px; }
                .admin-table            { font-size:0.72rem; }
                .admin-table th         { font-size:0.62rem; padding:4px 5px; }
                .admin-table td         { padding:5px 6px; }
                .admin-refl-row         { padding:7px 8px; }
                #adminDashOverlay > div:first-child                                    { padding:10px 14px !important; }
                #adminDashOverlay > div:first-child span[style*="font-size:1.4rem"]    { font-size:1rem !important; }
                #adminDashOverlay > div:first-child div[style*="font-size:1rem"]       { font-size:0.85rem !important; }
                #adminDashOverlay > div:last-child                                     { padding:14px 12px 48px !important; }
            }
        `;
        document.head.appendChild(style);
    },

    // =========================================================================
    // BADGE - injected into hub after user loads
    // =========================================================================

    injectAdminUI() {
        if (Core?.state?.currentUser?.is_admin === true) this.injectBadge();
    },

    injectBadge() {
        if (document.getElementById('adminDashBadge')) return;
        if (!Core?.state?.currentUser?.is_admin) return;

        this._injectStyles();

        const badge = document.createElement('div');
        badge.id = 'adminDashBadge';
        badge.style.cssText = 'padding:0 0 32px;';
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
                <div class="card" style="padding:16px;">
                    <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/AdminDashboard.png"
                         onclick="AdminDashboard.openDashboard()"
                         alt="Open Admin Dashboard"
                         style="width:100%;border-radius:14px;cursor:pointer;display:block;
                                transition:opacity 0.15s,transform 0.15s;box-shadow:0 4px 16px rgba(0,0,0,0.1);"
                         onmouseover="this.style.opacity='0.9';this.style.transform='scale(1.01)'"
                         onmouseout="this.style.opacity='1';this.style.transform='scale(1)'">
                </div>
            </section>`;

        const upcoming  = document.getElementById('upcomingEventsContainer');
        const sanctuary = document.querySelector('.sanctuary-content');
        (upcoming ?? sanctuary ?? document.body).insertAdjacentElement(
            upcoming ? 'afterend' : 'beforeend',
            badge
        );

        this._startBadgePoll();
    },

    async _updateBadge() {
        const count = await CommunityDB.getUnreadNotificationCount();
        const badge = document.getElementById('adminDashUnreadBadge');
        if (!badge) return;
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'block' : 'none';
    },

    _startBadgePoll() {
        this._updateBadge();
        this._pollInterval = setInterval(() => this._updateBadge(), 60_000);
    },

    // =========================================================================
    // OPEN / CLOSE
    // =========================================================================

    openDashboard() {
        if (document.getElementById('adminDashOverlay')) return;
        this._open = true;

        const overlay = document.createElement('div');
        overlay.id = 'adminDashOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:var(--neuro-bg,#f0f0f3);overflow-y:auto;font-family:var(--font-body,sans-serif);';
        overlay.innerHTML = `
            <div style="position:sticky;top:0;z-index:10;
                        background:var(--neuro-accent);backdrop-filter:blur(12px);
                        padding:16px 20px;display:flex;align-items:center;justify-content:space-between;
                        box-shadow:0 2px 20px var(--neuro-accent-a30);">
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
            <div style="max-width:900px;margin:0 auto;padding:20px 16px 60px;">
                ${this._SECTIONS.map((id, i) =>
                    this._sectionShell(id, this._sectionTitle(id), i === 0)
                ).join('')}
            </div>`;

        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        this.refreshAll();
    },

    closeDashboard() {
        document.getElementById('adminDashOverlay')?.remove();
        document.body.style.overflow = '';
        this._open = false;
        this._updateBadge();
    },

    _sectionTitle(id) {
        return {
            notifications: '📬 Notifications',
            members:       '👥 Members',
            engagement:    '📊 Community Engagement',
            safety:        '🛡️ Safety & Stats',
            leaderboard:   '🏆 Leaderboard',
            rooms:         '⏰ Room Usage Today',
            retention:     '📈 Retention Signals',
            bulk:          '⚡ Bulk Actions',
        }[id] || id;
    },

    _sectionShell(id, title, startOpen = false) {
        return `
        <div style="margin-bottom:12px;">
            <div class="admin-section-header" onclick="AdminDashboard.toggleSection('${id}')">
                <span style="font-size:0.92rem;font-weight:700;color:var(--neuro-text,#333);">${title}</span>
                <span id="adminSecToggle_${id}" style="font-size:0.8rem;color:var(--neuro-accent);">${startOpen ? '▼' : '▶'}</span>
            </div>
            <div id="adminSec_${id}" class="admin-section-body" style="display:${startOpen ? 'block' : 'none'};">
                <div id="adminSecContent_${id}" style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>
            </div>
        </div>`;
    },

    toggleSection(id) {
        const body   = document.getElementById(`adminSec_${id}`);
        const toggle = document.getElementById(`adminSecToggle_${id}`);
        if (!body) return;
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        toggle.textContent = isOpen ? '▶' : '▼';
        if (!isOpen) this._loadSection(id);
    },

    // =========================================================================
    // REFRESH
    // =========================================================================

    refreshAll() {
        const sub = document.getElementById('adminDashSubtitle');
        if (sub) sub.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

        for (const id of this._SECTIONS) {
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
            await this[`_render${id.charAt(0).toUpperCase() + id.slice(1)}`](el);
        } catch (err) {
            el.innerHTML = `<div style="color:#ef4444;font-size:0.83rem;padding:8px;">Failed to load: ${this._esc(err.message)}</div>`;
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

        const unread = notifs.filter(n => !n.read).length;
        el.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <span style="font-size:0.82rem;color:var(--text-muted,#888);">${unread} unread of ${notifs.length}</span>
                <button onclick="AdminDashboard._markAllRead()"
                        style="padding:4px 12px;border-radius:99px;border:1px solid var(--neuro-accent-a30);
                               background:var(--neuro-accent-a08);color:var(--neuro-accent);
                               font-size:0.78rem;cursor:pointer;">Mark all read</button>
            </div>
            ${notifs.map(n => `
                <div class="admin-notif-row ${n.read ? '' : 'unread'}" id="adminNotif_${n.id}">
                    <span style="font-size:1.2rem;flex-shrink:0;">${this._NOTIF_ICONS[n.type] || '📋'}</span>
                    <div style="flex:1;min-width:0;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                            <span style="font-size:0.82rem;font-weight:600;text-transform:capitalize;">${n.type}</span>
                            <span style="font-size:0.72rem;color:var(--text-muted,#888);">${this._timeAgo(n.created_at)}</span>
                        </div>
                        <div style="font-size:0.82rem;color:var(--text-muted,#888);">
                            From: <strong>${n.payload?.sender_name || 'Unknown'}</strong>
                            ${n.payload?.room ? `· ${n.payload.room}` : ''}
                        </div>
                        ${n.payload?.message     ? `<div style="font-size:0.82rem;margin-top:4px;font-style:italic;">"${this._esc(n.payload.message)}"</div>`          : ''}
                        ${n.payload?.reason      ? `<div style="font-size:0.82rem;margin-top:4px;">Reason: ${this._esc(n.payload.reason)}</div>`                       : ''}
                        ${n.payload?.details     ? `<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(n.payload.details)}</div>`                : ''}
                        ${n.payload?.issueType   ? `<div style="font-size:0.82rem;margin-top:4px;">Type: ${this._esc(n.payload.issueType)}</div>`                      : ''}
                        ${n.payload?.description ? `<div style="font-size:0.82rem;color:var(--text-muted,#888);">${this._esc(n.payload.description)}</div>`            : ''}
                    </div>
                    ${!n.read ? `
                    <button onclick="AdminDashboard._markRead(${n.id})"
                            style="flex-shrink:0;padding:3px 8px;border-radius:6px;border:none;cursor:pointer;
                                   font-size:0.72rem;background:var(--neuro-accent-a10);color:var(--neuro-accent);">
                        ✓ Read
                    </button>` : ''}
                </div>`).join('')}`;
    },

    async _renderMembers(el) {
        const [stats, activeMembers, { data: allProfiles = [] }] = await Promise.all([
            CommunityDB.getAdminMemberStats(),
            CommunityDB.getActiveMembers(),
            CommunityDB._sb.from('profiles').select('id, name, emoji, avatar_url, community_status').order('name'),
        ]);

        const presenceMap = Object.fromEntries(activeMembers.map(m => [m.user_id, m]));
        const activeIds   = new Set(activeMembers.map(m => m.user_id));
        const offlineList = allProfiles.filter(p => !activeIds.has(p.id));

        const renderMember = (p, presence) => {
            const status   = presence?.status   || 'offline';
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
                            ? `<img src="${p.avatar_url}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">`
                            : (p.emoji || (p.name || '?').charAt(0))}
                    </div>
                    <div style="flex:1;min-width:0;">
                        <div style="font-size:0.85rem;font-weight:600;">${this._esc(p.name || 'Member')}</div>
                        <div style="font-size:0.75rem;color:var(--text-muted,#888);">${this._esc(activity)}</div>
                    </div>
                    <span style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${dot};"></span>
                </div>`;
        };

        el.innerHTML = `
            <div class="admin-stat-grid" style="margin-bottom:16px;">
                ${this._statCard(stats.total       || 0, 'Total Members')}
                ${this._statCard(stats.onlineNow   || 0, 'Online Now')}
                ${this._statCard(stats.newThisWeek || 0, 'New This Week')}
                ${this._statCard(offlineList.length,     'Offline')}
            </div>
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin-bottom:8px;">🟢 Online & Away</div>
            ${activeMembers.length
                ? activeMembers.map(m => renderMember(m.profiles || { id: m.user_id, name: 'Member' }, m)).join('')
                : '<div style="color:var(--text-muted,#888);font-size:0.83rem;margin-bottom:12px;">No members online.</div>'}
            <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                        color:var(--text-muted,#888);margin:12px 0 8px;">⚫ Offline (${offlineList.length})</div>
            ${offlineList.map(p => renderMember(p, presenceMap[p.id] || null)).join('')}`;
    },

    async _renderEngagement(el) {
        const stats = await CommunityDB.getAdminEngagementStats();
        el.innerHTML = `
            <div class="admin-stat-grid">
                ${this._statCard(stats.reflectionsToday   || 0, 'Reflections Today')}
                ${this._statCard(stats.reflectionsTotal   || 0, 'Reflections Total')}
                ${this._statCard(stats.whispersToday      || 0, 'Whispers Today')}
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
                <div style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;
                            margin-bottom:4px;background:rgba(255,255,255,0.5);">
                    <span style="font-size:1rem;">${['🥇','🥈','🥉'][i] || '·'}</span>
                    <span style="font-size:0.9rem;">${r.profiles?.emoji || ''}</span>
                    <span style="flex:1;font-size:0.85rem;font-weight:600;">${this._esc(r.profiles?.name || 'Member')}</span>
                    <span style="font-size:0.85rem;font-weight:700;color:var(--neuro-accent);">${r.payload?.[key] || 0}</span>
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
                <thead><tr><th>Room</th><th>Entries</th><th>Avg Duration</th></tr></thead>
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
                        : '<div style="color:var(--text-muted,#888);font-size:0.83rem;">None - great retention! 🎉</div>'}
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
    // BULK ACTIONS
    // =========================================================================

    async _renderBulk(el) {
        const { data: members = [] } = await CommunityDB._sb
            .from('profiles')
            .select('id, name, emoji, avatar_url, community_role')
            .order('name');

        this._bulkMembers  = members;
        this._bulkSelected = new Set();

        const selectStyle = 'width:100%;padding:8px 12px;border-radius:10px;margin-bottom:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;';
        const btnStyle    = 'width:100%;padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);';
        const inputStyle  = 'flex:1;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;';
        const mutedLabel  = 'font-size:0.82rem;color:var(--text-muted,#888);margin-bottom:8px;';

        el.innerHTML = `
            <div style="margin-bottom:16px;">

                <!-- Member selector -->
                <div style="margin-bottom:12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);">Select Members</div>
                        <div style="display:flex;gap:8px;">
                            <button onclick="AdminDashboard._bulkSelectAll()"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid var(--neuro-accent-a30);background:var(--neuro-accent-a08);color:var(--neuro-accent);font-size:0.75rem;font-weight:600;cursor:pointer;">All</button>
                            <button onclick="AdminDashboard._bulkSelectNone()"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid rgba(0,0,0,0.1);background:none;color:var(--text-muted,#888);font-size:0.75rem;font-weight:600;cursor:pointer;">None</button>
                        </div>
                    </div>
                    <input id="bulkMemberSearch" type="text" placeholder="Search members..."
                           oninput="AdminDashboard._bulkFilterMembers(this.value)"
                           style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.85rem;box-sizing:border-box;margin-bottom:8px;">
                    <div id="bulkMemberList"
                         style="max-height:220px;overflow-y:auto;border-radius:12px;border:1px solid rgba(0,0,0,0.07);background:var(--surface,#fff);padding:6px;">
                        ${this._bulkMembers.map(m => `
                            <label id="bulkRow_${m.id}"
                                   style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.1s;"
                                   onmouseover="this.style.background='var(--neuro-accent-a08)'"
                                   onmouseout="this.style.background='none'">
                                <input type="checkbox" value="${m.id}"
                                       onchange="AdminDashboard._bulkToggle('${m.id}',this.checked)"
                                       style="width:16px;height:16px;cursor:pointer;accent-color:var(--neuro-accent);">
                                <span style="font-size:1.1rem;">${m.emoji || '👤'}</span>
                                <span style="font-size:0.85rem;font-weight:600;color:var(--neuro-text);">${this._esc(m.name || 'Member')}</span>
                                <span style="font-size:0.75rem;color:var(--text-muted,#888);margin-left:auto;">${this._esc(m.community_role || 'Member')}</span>
                            </label>`).join('')}
                    </div>
                    <div id="bulkSelectedCount" style="font-size:0.78rem;color:var(--text-muted,#888);margin-top:6px;text-align:right;">0 members selected</div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.07);margin:16px 0;"></div>

                <!-- Tab bar -->
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;" id="bulkTabBar">
                    ${this._BULK_TABS.map(([id, label], i) => `
                        <button onclick="AdminDashboard._bulkShowTab('${id}')" id="bulkTab_${id}"
                                style="padding:6px 14px;border-radius:99px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.15s;
                                       ${i === 0 ? 'background:var(--neuro-accent-a20);color:var(--neuro-accent);' : 'background:rgba(0,0,0,0.05);color:var(--text-muted,#888);'}">
                            ${label}
                        </button>`).join('')}
                </div>

                <!-- XP panel -->
                <div id="bulkPanel_xp">
                    <div style="${mutedLabel}">Send XP to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkXpAmount" type="number" min="1" value="100" placeholder="XP amount" style="${inputStyle}">
                        <button onclick="AdminDashboard._bulkSendXP()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send XP</button>
                    </div>
                </div>

                <!-- Karma panel -->
                <div id="bulkPanel_karma" style="display:none;">
                    <div style="${mutedLabel}">Send Karma to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkKarmaAmount" type="number" min="1" value="10" placeholder="Karma amount" style="${inputStyle}">
                        <button onclick="AdminDashboard._bulkSendKarma()" style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send Karma</button>
                    </div>
                </div>

                <!-- Badge panel -->
                <div id="bulkPanel_badge" style="display:none;">
                    <div style="${mutedLabel}">Send a badge to all selected members</div>
                    <select id="bulkBadgeSelect" style="${selectStyle}">
                        ${this._BADGES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
                    </select>
                    <button onclick="AdminDashboard._bulkSendBadge()" style="${btnStyle}">Send Badge</button>
                </div>

                <!-- Unlock panel -->
                <div id="bulkPanel_unlock" style="display:none;">
                    <div style="${mutedLabel}">Unlock a feature for all selected members</div>
                    <select id="bulkUnlockSelect" style="${selectStyle}">
                        ${this._UNLOCKS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}
                    </select>
                    <button onclick="AdminDashboard._bulkSendUnlock()" style="${btnStyle}">Unlock Feature</button>
                </div>

                <!-- Message panel -->
                <div id="bulkPanel_message" style="display:none;">
                    <div style="${mutedLabel}">Broadcast a message - appears in recipients' Whispers inbox</div>
                    <textarea id="bulkMessageText" placeholder="Write your message..." rows="4"
                              style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;resize:vertical;box-sizing:border-box;margin-bottom:10px;"></textarea>
                    <button onclick="AdminDashboard._bulkSendMessage()" style="${btnStyle}">Send Message</button>
                </div>

            </div>`;
    },

    // ── Bulk helpers ──────────────────────────────────────────────────────────

    _bulkToggle(userId, checked) {
        this._bulkSelected[checked ? 'add' : 'delete'](userId);
        this._bulkUpdateCount();
    },

    _bulkSelectAll() {
        for (const m of this._bulkMembers) {
            this._bulkSelected.add(m.id);
            const cb = document.querySelector(`#bulkRow_${m.id} input[type=checkbox]`);
            if (cb) cb.checked = true;
        }
        this._bulkUpdateCount();
    },

    _bulkSelectNone() {
        this._bulkSelected.clear();
        document.querySelectorAll('#bulkMemberList input[type=checkbox]').forEach(cb => cb.checked = false);
        this._bulkUpdateCount();
    },

    _bulkUpdateCount() {
        const n  = this._bulkSelected.size;
        const el = document.getElementById('bulkSelectedCount');
        if (el) el.textContent = `${n} member${n !== 1 ? 's' : ''} selected`;
    },

    _bulkFilterMembers(query) {
        const q = query.toLowerCase();
        document.querySelectorAll('#bulkMemberList label').forEach(row => {
            const name = row.querySelector('span:nth-child(3)')?.textContent?.toLowerCase() || '';
            row.style.display = name.includes(q) ? '' : 'none';
        });
    },

    _bulkShowTab(tab) {
        for (const [id] of this._BULK_TABS) {
            const panel  = document.getElementById(`bulkPanel_${id}`);
            const btn    = document.getElementById(`bulkTab_${id}`);
            if (!panel || !btn) continue;
            const active = id === tab;
            panel.style.display  = active ? 'block' : 'none';
            btn.style.background = active ? 'var(--neuro-accent-a20)' : 'rgba(0,0,0,0.05)';
            btn.style.color      = active ? 'var(--neuro-accent)'  : 'var(--text-muted,#888)';
        }
    },

    _bulkGuard() {
        if (this._bulkSelected.size === 0) {
            Core.showToast('Select at least one member first');
            return false;
        }
        return true;
    },

    // Shared loop for XP / Karma bulk sends
    async _bulkSendGamification({ inputId, label, xpDelta = 0, karmaDelta = 0, notifTitle, notifBody }) {
        if (!this._bulkGuard()) return;
        const amount = parseInt(document.getElementById(inputId)?.value, 10);
        if (!amount || amount < 1) { Core.showToast(`Enter a valid ${label} amount`); return; }

        const ids = [...this._bulkSelected];
        Core.showToast(`Sending ${amount} ${label} to ${ids.length} members...`);
        let ok = 0;

        for (const uid of ids) {
            const success = await CommunityDB.adminUpdateGamification(uid, {
                xpDelta:    xpDelta    === 'amount' ? amount : xpDelta,
                karmaDelta: karmaDelta === 'amount' ? amount : karmaDelta,
            });
            if (success) {
                ok++;
                window.MemberProfileModal?._adminPushNotify?.(uid, notifTitle, notifBody(amount));
            }
        }
        Core.showToast(`✓ Sent ${amount} ${label} to ${ok}/${ids.length} members`);
    },

    async _bulkSendXP() {
        await this._bulkSendGamification({
            inputId:    'bulkXpAmount',
            label:      'XP',
            xpDelta:    'amount',
            notifTitle: '🎁 Gift from Aanandoham!',
            notifBody:  (n) => `You received +${n} XP!`,
        });
    },

    async _bulkSendKarma() {
        await this._bulkSendGamification({
            inputId:     'bulkKarmaAmount',
            label:       'Karma',
            karmaDelta:  'amount',
            notifTitle:  '🎁 Gift from Aanandoham!',
            notifBody:   (n) => `You received +${n} Karma!`,
        });
    },

    async _bulkSendBadge() {
        if (!this._bulkGuard()) return;
        const sel = document.getElementById('bulkBadgeSelect');
        const badgeId    = sel?.value;
        const badgeLabel = sel?.options[sel.selectedIndex]?.text || badgeId;
        if (!badgeId) { Core.showToast('Select a badge'); return; }

        const ids = [...this._bulkSelected];
        Core.showToast(`Sending badge to ${ids.length} members...`);
        let ok = 0;

        for (const uid of ids) {
            // Fetch raw payload directly - getUserProgress strips it to parsed fields only,
            // which would lose all other payload data (quests, logs, etc.) on save.
            const { data: raw } = await CommunityDB._sb
                .from('user_progress').select('payload').eq('user_id', uid).single();
            if (!raw) continue;

            const payload = typeof raw.payload === 'string' ? JSON.parse(raw.payload) : { ...raw.payload };
            const badges  = payload.badges || [];

            if (!badges.find(b => b.id === badgeId)) {
                badges.push({
                    id:          badgeId,
                    name:        badgeLabel.replace(/^[^\s]+\s/, '').trim(),
                    icon:        '🏅',
                    rarity:      'common',
                    xp:          0,
                    description: '',
                    date:        new Date().toISOString(),
                    unlocked:    true,
                });
            }

            const { error } = await CommunityDB._sb
                .from('user_progress')
                .update({ payload: { ...payload, badges }, updated_at: new Date().toISOString() })
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
        const sel          = document.getElementById('bulkUnlockSelect');
        const feature      = sel?.value;
        const featureLabel = sel?.options[sel.selectedIndex]?.text || feature;
        if (!feature) { Core.showToast('Select a feature'); return; }

        const ids = [...this._bulkSelected];
        Core.showToast(`Unlocking ${featureLabel} for ${ids.length} members...`);
        let ok = 0;

        for (const uid of ids) {
            const success = await CommunityDB.adminUpdateGamification(uid, { unlockFeature: feature });
            if (success) {
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

        const ids    = [...this._bulkSelected];
        Core.showToast(`Broadcasting to ${ids.length} members...`);
        const result = await CommunityDB.broadcastMessage(ids, message);

        if (result.sent > 0) {
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
            row.querySelector('button')?.remove();
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
        const diff  = Date.now() - new Date(iso).getTime();
        const mins  = Math.floor(diff / 60_000);
        const hours = Math.floor(diff / 3_600_000);
        const days  = Math.floor(diff / 86_400_000);
        if (mins  < 1)  return 'just now';
        if (mins  < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    },

    _formatDuration(seconds) {
        if (!seconds) return '-';
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
};

console.log('✅ AdminDashboard loaded');

// Window bridge: preserved for external callers
window.AdminDashboard = AdminDashboard;

export { AdminDashboard };
