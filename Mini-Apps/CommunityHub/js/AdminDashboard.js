/**
 * ADMIN DASHBOARD
 * Full-screen admin console for Community Hub.
 * @version 1.2.0
 */

import { Core } from './core.js';

// XSS escape helper
function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// Safe localStorage wrapper
const ls = {
    get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
    set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
    remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } },
};

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

    _SECTIONS: Object.freeze(['notifications', 'members', 'engagement', 'safety', 'leaderboard', 'rooms', 'retention', 'bulk']),

    _BULK_TABS: Object.freeze([
        ['xp',      '🎁 XP'],
        ['karma',   '🌀 Karma'],
        ['badge',   '🏅 Badge'],
        ['unlock',  '🔓 Unlock'],
        ['message', '💬 Message'],
    ]),

    _BADGES: Object.freeze([
        ['first_step',       '🌱 First Step'],
        ['triple_threat',    '🎪 Triple Threat'],
        ['moon_walker',      '🌙 Moon Walker'],
        ['sun_keeper',       '☀️ Sun Keeper'],
        ['energy_master',    '⚡ Energy Master'],
        ['wave_rider',       '🌊 Wave Rider'],
        ['community_heart',  '💜 Community Heart'],
        ['deep_diver',       '🔱 Deep Diver'],
    ]),

    _UNLOCKS: Object.freeze([
        ['premium_rooms',       'Premium Rooms'],
        ['extended_history',    'Extended History'],
        ['custom_themes',       'Custom Themes'],
        ['advanced_analytics',  'Advanced Analytics'],
        ['priority_support',    'Priority Support'],
    ]),

    _NOTIF_ICONS: Object.freeze({ report: '⚠️', help: '🆘', technical: '🔧' }),

    // Whitelisted section IDs to prevent selector injection
    _SECTION_ID_WHITELIST: Object.freeze(new Set(['notifications', 'members', 'engagement', 'safety', 'leaderboard', 'rooms', 'retention', 'bulk'])),

    // Whitelisted bulk tab IDs
    _BULK_TAB_WHITELIST: Object.freeze(new Set(['xp', 'karma', 'badge', 'unlock', 'message'])),

    // Whitelisted badge IDs
    _BADGE_ID_WHITELIST: Object.freeze(new Set(['first_step', 'triple_threat', 'moon_walker', 'sun_keeper', 'energy_master', 'wave_rider', 'community_heart', 'deep_diver'])),

    // Whitelisted unlock feature IDs
    _UNLOCK_FEATURE_WHITELIST: Object.freeze(new Set(['premium_rooms', 'extended_history', 'custom_themes', 'advanced_analytics', 'priority_support'])),

    // =========================================================================
    // STYLES
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
    // BADGE
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
            <section class="section" aria-labelledby="adminToolsTitle">
                <div class="section-header">
                    <div class="section-title" id="adminToolsTitle" style="display:flex;align-items:center;gap:0.5rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        Admin Tools
                    </div>
                    <div style="font-size:12px;color:var(--text-muted);">
                        <span id="adminDashUnreadBadge"
                              aria-live="polite"
                              style="display:none;background:#ef4444;color:#fff;border-radius:99px;
                                     font-size:10px;font-weight:700;padding:2px 8px;margin-right:6px;
                                     animation:adminPulse 1.5s infinite;">0 new</span>
                        Community management
                    </div>
                </div>
                <div class="card" style="padding:16px;">
                    <picture>
                      <source srcset="/public/Community/AdminDashboard.webp" type="image/webp">
                      <img src="/public/Community/AdminDashboard.png"
                           id="adminDashOpenBtn"
                           alt="Open Admin Dashboard"
                           width="48" height="48" loading="lazy" decoding="async"
                           style="width:100%;border-radius:14px;cursor:pointer;display:block;
                                  transition:opacity 0.15s,transform 0.15s;box-shadow:0 4px 16px rgba(0,0,0,0.1);"
                           tabindex="0"
                           role="button"
                           aria-label="Open Admin Dashboard">
                    </picture>
                </div>
            </section>`;

        const upcoming  = document.getElementById('upcomingEventsContainer');
        const sanctuary = document.querySelector('.sanctuary-content');
        (upcoming ?? sanctuary ?? document.body).insertAdjacentElement(
            upcoming ? 'afterend' : 'beforeend',
            badge
        );

        // Wire events via JS — no inline onclick
        const imgBtn = document.getElementById('adminDashOpenBtn');
        if (imgBtn) {
            imgBtn.addEventListener('click', () => AdminDashboard.openDashboard());
            imgBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); AdminDashboard.openDashboard(); }
            });
            imgBtn.addEventListener('mouseover', () => { imgBtn.style.opacity = '0.9'; imgBtn.style.transform = 'scale(1.01)'; });
            imgBtn.addEventListener('mouseout',  () => { imgBtn.style.opacity = '1';   imgBtn.style.transform = 'scale(1)'; });
        }

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
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-label', 'Admin Dashboard');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:var(--neuro-bg,#f0f0f3);overflow-y:auto;font-family:var(--font-body,sans-serif);';

        // Header
        const header = document.createElement('div');
        header.style.cssText = 'position:sticky;top:0;z-index:10;background:var(--neuro-accent);backdrop-filter:blur(12px);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 20px var(--neuro-accent-a30);';

        const titleGroup = document.createElement('div');
        titleGroup.style.cssText = 'display:flex;align-items:center;gap:10px;';
        titleGroup.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
        const titleText = document.createElement('div');
        const titleLine = document.createElement('div');
        titleLine.style.cssText = 'font-size:1rem;font-weight:700;color:#fff;letter-spacing:0.5px;';
        titleLine.textContent = 'Admin Dashboard';
        const subtitleLine = document.createElement('div');
        subtitleLine.id = 'adminDashSubtitle';
        subtitleLine.style.cssText = 'font-size:0.72rem;color:rgba(255,255,255,0.7);';
        subtitleLine.textContent = 'Loading...';
        titleText.appendChild(titleLine);
        titleText.appendChild(subtitleLine);
        titleGroup.appendChild(titleText);

        const btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display:flex;gap:10px;align-items:center;';

        const refreshBtn = document.createElement('button');
        refreshBtn.type = 'button';
        refreshBtn.textContent = '↻ Refresh';
        refreshBtn.setAttribute('aria-label', 'Refresh dashboard');
        refreshBtn.style.cssText = 'padding:6px 14px;border-radius:99px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.15);color:#fff;cursor:pointer;font-size:0.82rem;';
        refreshBtn.addEventListener('click', () => AdminDashboard.refreshAll());

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.textContent = '✕';
        closeBtn.setAttribute('aria-label', 'Close Admin Dashboard');
        closeBtn.style.cssText = 'width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,0.2);color:#fff;cursor:pointer;font-size:1.1rem;';
        closeBtn.addEventListener('click', () => AdminDashboard.closeDashboard());

        btnGroup.appendChild(refreshBtn);
        btnGroup.appendChild(closeBtn);
        header.appendChild(titleGroup);
        header.appendChild(btnGroup);
        overlay.appendChild(header);

        const body = document.createElement('div');
        body.style.cssText = 'max-width:900px;margin:0 auto;padding:20px 16px 60px;';
        body.innerHTML = this._SECTIONS.map((id, i) =>
            this._sectionShell(id, this._sectionTitle(id), i === 0)
        ).join('');

        overlay.appendChild(body);
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
        const titles = {
            notifications: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Notifications`,
            members:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Members`,
            engagement:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Community Engagement`,
            safety:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Safety &amp; Stats`,
            leaderboard:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> Leaderboard`,
            rooms:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg> Room Usage Today`,
            retention:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg> Retention Signals`,
            bulk:          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Bulk Actions`,
        };
        return titles[id] || esc(id);
    },

    _sectionShell(id, title, startOpen = false) {
        const safeId = this._SECTION_ID_WHITELIST.has(id) ? id : '';
        if (!safeId) return '';
        return `
        <div style="margin-bottom:12px;">
            <div class="admin-section-header" role="button" tabindex="0"
                 aria-expanded="${startOpen}"
                 data-toggle-section="${safeId}"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();AdminDashboard.toggleSection('${safeId}');}">
                <span style="font-size:0.92rem;font-weight:700;color:var(--neuro-text,#333);">${title}</span>
                <span id="adminSecToggle_${safeId}" aria-hidden="true" style="font-size:0.8rem;color:var(--neuro-accent);">${startOpen ? '▼' : '▶'}</span>
            </div>
            <div id="adminSec_${safeId}" class="admin-section-body" style="display:${startOpen ? 'block' : 'none'};" role="region" aria-labelledby="adminSecToggle_${safeId}">
                <div id="adminSecContent_${safeId}" style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>
            </div>
        </div>`;
    },

    toggleSection(id) {
        if (!this._SECTION_ID_WHITELIST.has(id)) return;
        const body   = document.getElementById(`adminSec_${id}`);
        const toggle = document.getElementById(`adminSecToggle_${id}`);
        const header = document.querySelector(`[data-toggle-section="${id}"]`);
        if (!body) return;
        const isOpen = body.style.display !== 'none';
        body.style.display = isOpen ? 'none' : 'block';
        if (toggle) toggle.textContent = isOpen ? '▶' : '▼';
        if (header) header.setAttribute('aria-expanded', !isOpen);
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
        if (!this._SECTION_ID_WHITELIST.has(id)) return;
        const el = document.getElementById(`adminSecContent_${id}`);
        if (!el) return;
        el.innerHTML = '<div style="color:var(--text-muted,#888);font-size:0.83rem;padding:8px;">Loading...</div>';
        try {
            await this[`_render${id.charAt(0).toUpperCase() + id.slice(1)}`](el);
        } catch (err) {
            el.innerHTML = '';
            const errDiv = document.createElement('div');
            errDiv.style.cssText = 'color:#ef4444;font-size:0.83rem;padding:8px;';
            errDiv.textContent = 'Failed to load section.';
            el.appendChild(errDiv);
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

        const headerDiv = document.createElement('div');
        headerDiv.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;';

        const countSpan = document.createElement('span');
        countSpan.style.cssText = 'font-size:0.82rem;color:var(--text-muted,#888);';
        countSpan.textContent = `${unread} unread of ${notifs.length}`;

        const markAllBtn = document.createElement('button');
        markAllBtn.type = 'button';
        markAllBtn.textContent = 'Mark all read';
        markAllBtn.style.cssText = 'padding:4px 12px;border-radius:99px;border:1px solid var(--neuro-accent-a30);background:var(--neuro-accent-a08);color:var(--neuro-accent);font-size:0.78rem;cursor:pointer;';
        markAllBtn.addEventListener('click', () => AdminDashboard._markAllRead());

        headerDiv.appendChild(countSpan);
        headerDiv.appendChild(markAllBtn);
        el.innerHTML = '';
        el.appendChild(headerDiv);

        notifs.forEach(n => {
            const row = document.createElement('div');
            row.className = `admin-notif-row${n.read ? '' : ' unread'}`;
            row.id = `adminNotif_${n.id}`;

            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'font-size:1.2rem;flex-shrink:0;';
            iconSpan.textContent = this._NOTIF_ICONS[n.type] || '📋';

            const content = document.createElement('div');
            content.style.cssText = 'flex:1;min-width:0;';

            const topRow = document.createElement('div');
            topRow.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:2px;';
            const typeSpan = document.createElement('span');
            typeSpan.style.cssText = 'font-size:0.82rem;font-weight:600;text-transform:capitalize;';
            typeSpan.textContent = n.type;
            const timeSpan = document.createElement('span');
            timeSpan.style.cssText = 'font-size:0.72rem;color:var(--text-muted,#888);';
            timeSpan.textContent = this._timeAgo(n.created_at);
            topRow.appendChild(typeSpan);
            topRow.appendChild(timeSpan);

            const fromDiv = document.createElement('div');
            fromDiv.style.cssText = 'font-size:0.82rem;color:var(--text-muted,#888);';
            const strong = document.createElement('strong');
            strong.textContent = n.payload?.sender_name || 'Unknown';
            fromDiv.textContent = 'From: ';
            fromDiv.appendChild(strong);
            if (n.payload?.room) fromDiv.append(` · ${n.payload.room}`);

            content.appendChild(topRow);
            content.appendChild(fromDiv);

            const addLine = (val, prefix = '') => {
                if (!val) return;
                const d = document.createElement('div');
                d.style.cssText = 'font-size:0.82rem;margin-top:4px;';
                d.textContent = prefix ? `${prefix}${val}` : val;
                content.appendChild(d);
            };

            if (n.payload?.message)     addLine(n.payload.message);
            if (n.payload?.reason)      addLine(n.payload.reason, 'Reason: ');
            if (n.payload?.details)     addLine(n.payload.details);
            if (n.payload?.issueType)   addLine(n.payload.issueType, 'Type: ');
            if (n.payload?.description) addLine(n.payload.description);

            row.appendChild(iconSpan);
            row.appendChild(content);

            if (!n.read) {
                const readBtn = document.createElement('button');
                readBtn.type = 'button';
                readBtn.textContent = '✓ Read';
                readBtn.style.cssText = 'flex-shrink:0;padding:3px 8px;border-radius:6px;border:none;cursor:pointer;font-size:0.72rem;background:var(--neuro-accent-a10);color:var(--neuro-accent);';
                readBtn.addEventListener('click', () => AdminDashboard._markRead(n.id));
                row.appendChild(readBtn);
            }

            el.appendChild(row);
        });
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

        const renderMemberRow = (p, presence) => {
            const status   = presence?.status   || 'offline';
            const activity = typeof presence?.activity === 'string' ? presence.activity : '💤 Offline';
            const dot      = status === 'online' ? '#22c55e' : status === 'away' ? '#f59e0b' : '#aaa';

            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;margin-bottom:4px;background:rgba(255,255,255,0.5);cursor:pointer;';
            row.setAttribute('role', 'button');
            row.setAttribute('tabindex', '0');
            row.setAttribute('aria-label', `View ${p.name || 'Member'}'s profile`);
            row.addEventListener('click', () => window.MemberProfileModal?.open(p.id));
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.MemberProfileModal?.open(p.id); }
            });

            const avatarDiv = document.createElement('div');
            avatarDiv.style.cssText = `width:32px;height:32px;border-radius:50%;background:${Core.getAvatarGradient(p.id)};display:flex;align-items:center;justify-content:center;font-size:0.9rem;color:#fff;flex-shrink:0;overflow:hidden;`;

            if (p.avatar_url) {
                const img = document.createElement('img');
                img.src = p.avatar_url;
                img.alt = 'Member avatar';
                img.width = 40;
                img.height = 40;
                img.loading = 'lazy';
                img.decoding = 'async';
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
                avatarDiv.appendChild(img);
            } else {
                avatarDiv.textContent = p.emoji || (p.name || '?').charAt(0);
            }

            const info = document.createElement('div');
            info.style.cssText = 'flex:1;min-width:0;';
            const nameEl = document.createElement('div');
            nameEl.style.cssText = 'font-size:0.85rem;font-weight:600;';
            nameEl.textContent = p.name || 'Member';
            const actEl = document.createElement('div');
            actEl.style.cssText = 'font-size:0.75rem;color:var(--text-muted,#888);';
            actEl.textContent = activity;
            info.appendChild(nameEl);
            info.appendChild(actEl);

            const dotEl = document.createElement('span');
            dotEl.style.cssText = `width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${dot};`;

            row.appendChild(avatarDiv);
            row.appendChild(info);
            row.appendChild(dotEl);
            return row;
        };

        el.innerHTML = `
            <div class="admin-stat-grid" style="margin-bottom:16px;">
                ${this._statCard(stats.total       || 0, 'Total Members')}
                ${this._statCard(stats.onlineNow   || 0, 'Online Now')}
                ${this._statCard(stats.newThisWeek || 0, 'New This Week')}
                ${this._statCard(offlineList.length,     'Offline')}
            </div>`;

        const onlineLabel = document.createElement('div');
        onlineLabel.style.cssText = 'font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:8px;';
        onlineLabel.textContent = '🟢 Online & Away';
        el.appendChild(onlineLabel);

        if (activeMembers.length) {
            activeMembers.forEach(m => el.appendChild(renderMemberRow(m.profiles || { id: m.user_id, name: 'Member' }, m)));
        } else {
            const none = document.createElement('div');
            none.style.cssText = 'color:var(--text-muted,#888);font-size:0.83rem;margin-bottom:12px;';
            none.textContent = 'No members online.';
            el.appendChild(none);
        }

        const offlineLabel = document.createElement('div');
        offlineLabel.style.cssText = 'font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin:12px 0 8px;';
        offlineLabel.textContent = `⚫ Offline (${offlineList.length})`;
        el.appendChild(offlineLabel);

        offlineList.forEach(p => el.appendChild(renderMemberRow(p, presenceMap[p.id] || null)));
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

        const renderList = (list, key) => {
            if (!list.length) {
                el.appendChild((() => { const d = document.createElement('div'); d.style.cssText = 'color:var(--text-muted,#888);font-size:0.83rem;'; d.textContent = 'No data yet.'; return d; })());
                return '';
            }
            return list.map((r, i) => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;margin-bottom:4px;background:rgba(255,255,255,0.5);';
                const medal = document.createElement('span');
                medal.style.cssText = 'font-size:1rem;';
                medal.textContent = ['🥇', '🥈', '🥉'][i] || '·';
                const emojiEl = document.createElement('span');
                emojiEl.style.cssText = 'font-size:0.9rem;';
                emojiEl.textContent = r.profiles?.emoji || '';
                const nameEl = document.createElement('span');
                nameEl.style.cssText = 'flex:1;font-size:0.85rem;font-weight:600;';
                nameEl.textContent = r.profiles?.name || 'Member';
                const scoreEl = document.createElement('span');
                scoreEl.style.cssText = 'font-size:0.85rem;font-weight:700;color:var(--neuro-accent);';
                scoreEl.textContent = r.payload?.[key] || 0;
                row.appendChild(medal);
                row.appendChild(emojiEl);
                row.appendChild(nameEl);
                row.appendChild(scoreEl);
                return row.outerHTML;
            }).join('');
        };

        el.innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:8px;">⭐ Top XP</div>
                    ${renderList(lb.xp, 'xp')}
                </div>
                <div>
                    <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:8px;">🌀 Top Karma</div>
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

        const table = document.createElement('table');
        table.className = 'admin-table';
        table.innerHTML = '<thead><tr><th scope="col">Room</th><th scope="col">Entries</th><th scope="col">Avg Duration</th></tr></thead>';
        const tbody = document.createElement('tbody');
        rooms.forEach(r => {
            const avg = r.entries > 0 ? Math.round(r.totalSeconds / r.entries) : 0;
            const tr = document.createElement('tr');
            const tdRoom = document.createElement('td');
            tdRoom.style.fontWeight = '600';
            tdRoom.textContent = this._formatRoomId(r.room_id);
            const tdEntries = document.createElement('td');
            tdEntries.textContent = r.entries;
            const tdDur = document.createElement('td');
            tdDur.textContent = this._formatDuration(avg);
            tr.appendChild(tdRoom);
            tr.appendChild(tdEntries);
            tr.appendChild(tdDur);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        el.innerHTML = '';
        el.appendChild(table);
    },

    async _renderRetention(el) {
        const signals = await CommunityDB.getRetentionSignals();
        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:16px;';

        // Quiet members
        const quietCol = document.createElement('div');
        const quietTitle = document.createElement('div');
        quietTitle.style.cssText = 'font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:8px;';
        quietTitle.textContent = '😶 Going Quiet';
        const quietSub = document.createElement('div');
        quietSub.style.cssText = 'font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;';
        quietSub.textContent = 'Active last week, not this week';
        quietCol.appendChild(quietTitle);
        quietCol.appendChild(quietSub);

        if (signals.quietMembers?.length) {
            signals.quietMembers.forEach(id => {
                const row = document.createElement('div');
                row.style.cssText = 'padding:6px 10px;border-radius:8px;margin-bottom:4px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);font-size:0.83rem;cursor:pointer;';
                row.setAttribute('role', 'button');
                row.setAttribute('tabindex', '0');
                row.textContent = `${String(id).substring(0, 8)}...`;
                row.addEventListener('click', () => window.MemberProfileModal?.open(id));
                row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.MemberProfileModal?.open(id); } });
                quietCol.appendChild(row);
            });
        } else {
            const none = document.createElement('div');
            none.style.cssText = 'color:var(--text-muted,#888);font-size:0.83rem;';
            none.textContent = 'None - great retention! 🎉';
            quietCol.appendChild(none);
        }

        // Streak members
        const streakCol = document.createElement('div');
        const streakTitle = document.createElement('div');
        streakTitle.style.cssText = 'font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);margin-bottom:8px;';
        streakTitle.textContent = '🔥 Consistent';
        const streakSub = document.createElement('div');
        streakSub.style.cssText = 'font-size:0.75rem;color:var(--text-muted,#888);margin-bottom:8px;';
        streakSub.textContent = 'Active last 3 days';
        streakCol.appendChild(streakTitle);
        streakCol.appendChild(streakSub);

        if (signals.streakMembers?.length) {
            signals.streakMembers.forEach(m => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:8px;margin-bottom:4px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);cursor:pointer;';
                row.setAttribute('role', 'button');
                row.setAttribute('tabindex', '0');
                row.addEventListener('click', () => window.MemberProfileModal?.open(m.user_id));
                row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.MemberProfileModal?.open(m.user_id); } });
                const emojiSpan = document.createElement('span');
                emojiSpan.textContent = m.emoji || '🧘';
                const nameEl = document.createElement('span');
                nameEl.style.cssText = 'font-size:0.83rem;font-weight:600;';
                nameEl.textContent = m.name || 'Member';
                row.appendChild(emojiSpan);
                row.appendChild(nameEl);
                streakCol.appendChild(row);
            });
        } else {
            const none = document.createElement('div');
            none.style.cssText = 'color:var(--text-muted,#888);font-size:0.83rem;';
            none.textContent = 'No data yet.';
            streakCol.appendChild(none);
        }

        grid.appendChild(quietCol);
        grid.appendChild(streakCol);
        el.innerHTML = '';
        el.appendChild(grid);
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
                <div style="margin-bottom:12px;">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                        <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted,#888);">Select Members</div>
                        <div style="display:flex;gap:8px;">
                            <button type="button" id="bulkSelectAllBtn"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid var(--neuro-accent-a30);background:var(--neuro-accent-a08);color:var(--neuro-accent);font-size:0.75rem;font-weight:600;cursor:pointer;">All</button>
                            <button type="button" id="bulkSelectNoneBtn"
                                    style="padding:4px 10px;border-radius:99px;border:1px solid rgba(0,0,0,0.1);background:none;color:var(--text-muted,#888);font-size:0.75rem;font-weight:600;cursor:pointer;">None</button>
                        </div>
                    </div>
                    <input id="bulkMemberSearch" type="search" placeholder="Search members..."
                           aria-label="Search members"
                           style="width:100%;padding:8px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.85rem;box-sizing:border-box;margin-bottom:8px;">
                    <div id="bulkMemberList"
                         role="listbox" aria-label="Select members" aria-multiselectable="true"
                         style="max-height:220px;overflow-y:auto;border-radius:12px;border:1px solid rgba(0,0,0,0.07);background:var(--surface,#fff);padding:6px;">
                        ${members.map(m => `
                            <label id="bulkRow_${m.id}"
                                   style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background 0.1s;"
                                   onmouseover="this.style.background='var(--neuro-accent-a08)'"
                                   onmouseout="this.style.background='none'">
                                <input type="checkbox" value="${esc(m.id)}"
                                       data-member-id="${esc(m.id)}"
                                       style="width:16px;height:16px;cursor:pointer;accent-color:var(--neuro-accent);">
                                <span style="font-size:1.1rem;">${m.emoji || '👤'}</span>
                                <span style="font-size:0.85rem;font-weight:600;color:var(--neuro-text);">${esc(m.name || 'Member')}</span>
                                <span style="font-size:0.75rem;color:var(--text-muted,#888);margin-left:auto;">${esc(m.community_role || 'Member')}</span>
                            </label>`).join('')}
                    </div>
                    <div id="bulkSelectedCount" role="status" style="font-size:0.78rem;color:var(--text-muted,#888);margin-top:6px;text-align:right;">0 members selected</div>
                </div>

                <div style="border-top:1px solid rgba(0,0,0,0.07);margin:16px 0;"></div>

                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;" id="bulkTabBar" role="tablist">
                    ${this._BULK_TABS.map(([id, label], i) => `
                        <button type="button" id="bulkTab_${esc(id)}" role="tab"
                                data-bulk-tab="${esc(id)}"
                                aria-selected="${i === 0}"
                                style="padding:6px 14px;border-radius:99px;border:none;cursor:pointer;font-size:0.8rem;font-weight:600;transition:all 0.15s;${i === 0 ? 'background:var(--neuro-accent-a20);color:var(--neuro-accent);' : 'background:rgba(0,0,0,0.05);color:var(--text-muted,#888);'}">
                            ${label}
                        </button>`).join('')}
                </div>

                <div id="bulkPanel_xp" role="tabpanel">
                    <div style="${mutedLabel}">Send XP to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkXpAmount" type="number" min="1" max="100000" value="100"
                               placeholder="XP amount" aria-label="XP amount" style="${inputStyle}">
                        <button type="button" id="bulkSendXpBtn"
                                style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send XP</button>
                    </div>
                </div>

                <div id="bulkPanel_karma" style="display:none;" role="tabpanel">
                    <div style="${mutedLabel}">Send Karma to all selected members</div>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <input id="bulkKarmaAmount" type="number" min="1" max="100000" value="10"
                               placeholder="Karma amount" aria-label="Karma amount" style="${inputStyle}">
                        <button type="button" id="bulkSendKarmaBtn"
                                style="padding:8px 18px;border-radius:10px;border:none;cursor:pointer;font-size:0.88rem;font-weight:700;background:var(--neuro-accent-a20);color:var(--neuro-accent);">Send Karma</button>
                    </div>
                </div>

                <div id="bulkPanel_badge" style="display:none;" role="tabpanel">
                    <div style="${mutedLabel}">Send a badge to all selected members</div>
                    <select id="bulkBadgeSelect" aria-label="Select badge" style="${selectStyle}">
                        ${this._BADGES.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}
                    </select>
                    <button type="button" id="bulkSendBadgeBtn" style="${btnStyle}">Send Badge</button>
                </div>

                <div id="bulkPanel_unlock" style="display:none;" role="tabpanel">
                    <div style="${mutedLabel}">Unlock a feature for all selected members</div>
                    <select id="bulkUnlockSelect" aria-label="Select feature to unlock" style="${selectStyle}">
                        ${this._UNLOCKS.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}
                    </select>
                    <button type="button" id="bulkSendUnlockBtn" style="${btnStyle}">Unlock Feature</button>
                </div>

                <div id="bulkPanel_message" style="display:none;" role="tabpanel">
                    <div style="${mutedLabel}">Broadcast a message - appears in recipients' Whispers inbox</div>
                    <textarea id="bulkMessageText" placeholder="Write your message..." rows="4"
                              maxlength="5000"
                              aria-label="Broadcast message"
                              style="width:100%;padding:10px 12px;border-radius:10px;border:1px solid rgba(0,0,0,0.1);background:var(--surface,#fff);color:var(--neuro-text);font-size:0.88rem;resize:vertical;box-sizing:border-box;margin-bottom:10px;"></textarea>
                    <button type="button" id="bulkSendMessageBtn" style="${btnStyle}">Send Message</button>
                </div>
            </div>`;

        // Wire events via addEventListener (no inline handlers on dynamic content)
        document.getElementById('bulkSelectAllBtn')?.addEventListener('click', () => this._bulkSelectAll());
        document.getElementById('bulkSelectNoneBtn')?.addEventListener('click', () => this._bulkSelectNone());
        document.getElementById('bulkMemberSearch')?.addEventListener('input', (e) => this._bulkFilterMembers(e.target.value));
        document.getElementById('bulkSendXpBtn')?.addEventListener('click', () => this._bulkSendXP());
        document.getElementById('bulkSendKarmaBtn')?.addEventListener('click', () => this._bulkSendKarma());
        document.getElementById('bulkSendBadgeBtn')?.addEventListener('click', () => this._bulkSendBadge());
        document.getElementById('bulkSendUnlockBtn')?.addEventListener('click', () => this._bulkSendUnlock());
        document.getElementById('bulkSendMessageBtn')?.addEventListener('click', () => this._bulkSendMessage());

        // Checkbox delegation
        document.getElementById('bulkMemberList')?.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const id = e.target.dataset.memberId;
                if (id) this._bulkToggle(id, e.target.checked);
            }
        });

        // Tab bar delegation
        document.getElementById('bulkTabBar')?.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-bulk-tab]');
            if (btn) this._bulkShowTab(btn.dataset.bulkTab);
        });
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
        const q = String(query || '').toLowerCase();
        document.querySelectorAll('#bulkMemberList label').forEach(row => {
            const nameEl = row.querySelector('span:nth-child(3)');
            const name = nameEl?.textContent?.toLowerCase() || '';
            row.style.display = name.includes(q) ? '' : 'none';
        });
    },

    _bulkShowTab(tab) {
        if (!this._BULK_TAB_WHITELIST.has(tab)) return;
        for (const [id] of this._BULK_TABS) {
            const panel  = document.getElementById(`bulkPanel_${id}`);
            const btn    = document.getElementById(`bulkTab_${id}`);
            if (!panel || !btn) continue;
            const active = id === tab;
            panel.style.display  = active ? 'block' : 'none';
            btn.style.background = active ? 'var(--neuro-accent-a20)' : 'rgba(0,0,0,0.05)';
            btn.style.color      = active ? 'var(--neuro-accent)' : 'var(--text-muted,#888)';
            btn.setAttribute('aria-selected', active);
        }
    },

    _bulkGuard() {
        if (this._bulkSelected.size === 0) {
            Core.showToast('Select at least one member first');
            return false;
        }
        return true;
    },

    async _bulkSendGamification({ inputId, label, xpDelta = 0, karmaDelta = 0, notifTitle, notifBody }) {
        if (!this._bulkGuard()) return;
        const raw = document.getElementById(inputId)?.value;
        const amount = parseInt(raw, 10);
        if (!Number.isInteger(amount) || amount < 1) { Core.showToast(`Enter a valid ${label} amount`); return; }

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
        Core.showToast(`Sent ${amount} ${label} to ${ok}/${ids.length} members`);
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
            inputId:    'bulkKarmaAmount',
            label:      'Karma',
            karmaDelta: 'amount',
            notifTitle: '🎁 Gift from Aanandoham!',
            notifBody:  (n) => `You received +${n} Karma!`,
        });
    },

    async _bulkSendBadge() {
        if (!this._bulkGuard()) return;
        const sel     = document.getElementById('bulkBadgeSelect');
        const badgeId = sel?.value;

        // Whitelist validation
        if (!badgeId || !this._BADGE_ID_WHITELIST.has(badgeId)) { Core.showToast('Select a badge'); return; }

        const opt        = sel?.options[sel.selectedIndex];
        const badgeLabel = opt?.text || badgeId;
        const badgeName  = badgeLabel.replace(/^[^\s]+\s/, '').trim();
        const badgeIcon  = opt?.dataset?.icon   || '🏅';
        const badgeRarity= opt?.dataset?.rarity || 'common';
        const badgeXp    = parseInt(opt?.dataset?.xp, 10) || 0;
        const badgeDesc  = opt?.dataset?.desc   || '';

        const ids = [...this._bulkSelected];
        Core.showToast(`Sending badge to ${ids.length} members...`);
        let ok = 0;

        for (const uid of ids) {
            const success = await CommunityDB.adminUpdateGamification(uid, {
                badgeId, badgeName, badgeIcon, badgeRarity, badgeXp, badgeDesc,
            });
            if (success) {
                ok++;
                window.MemberProfileModal?._adminPushNotify?.(uid, '🏅 New Badge!', `You earned the ${badgeLabel} badge!`);
            }
        }
        Core.showToast(`Sent badge to ${ok}/${ids.length} members`);
    },

    async _bulkSendUnlock() {
        if (!this._bulkGuard()) return;
        const sel     = document.getElementById('bulkUnlockSelect');
        const feature = sel?.value;

        // Whitelist validation
        if (!feature || !this._UNLOCK_FEATURE_WHITELIST.has(feature)) { Core.showToast('Select a feature'); return; }

        const featureLabel = sel?.options[sel.selectedIndex]?.text || feature;
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
        Core.showToast(`Unlocked ${featureLabel} for ${ok}/${ids.length} members`);
    },

    async _bulkSendMessage() {
        if (!this._bulkGuard()) return;
        const message = document.getElementById('bulkMessageText')?.value?.trim();
        if (!message)           { Core.showToast('Write a message first'); return; }
        if (message.length > 5000) { Core.showToast('Message too long (max 5000 characters)'); return; }

        const ids    = [...this._bulkSelected];
        Core.showToast(`Broadcasting to ${ids.length} members...`);
        const result = await CommunityDB.broadcastMessage(ids, message);

        if (result.sent > 0) {
            for (const uid of ids) {
                window.MemberProfileModal?._adminPushNotify?.(uid, '💬 Message from Aanandoham', message.substring(0, 80));
            }
            const ta = document.getElementById('bulkMessageText');
            if (ta) ta.value = '';
            Core.showToast(`Message sent to ${result.sent}/${ids.length} members`);
        } else {
            Core.showToast('Failed to send messages');
        }
    },

    // =========================================================================
    // ACTIONS
    // =========================================================================

    async _markRead(id) {
        if (!Number.isInteger(id) && typeof id !== 'string') return;
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
        if (!reflectionId) return;
        if (!confirm('Delete this reflection?')) return;
        btn.disabled = true;
        const ok = await CommunityDB.deleteReflection(reflectionId);
        if (ok) {
            btn.closest('.admin-refl-row')?.remove();
            Core.showToast('Reflection deleted');
        } else {
            Core.showToast('Could not delete');
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
                <div class="admin-stat-label">${esc(label)}</div>
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

    _esc: esc,
};

window.AdminDashboard = AdminDashboard;

// bfcache: stop badge poll on pagehide
window.addEventListener('pagehide', () => {
    if (AdminDashboard._pollInterval) {
        clearInterval(AdminDashboard._pollInterval);
        AdminDashboard._pollInterval = null;
    }
});

export { AdminDashboard };
