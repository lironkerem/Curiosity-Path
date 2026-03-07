/**
 * ACTIVE MEMBERS MODULE
 * Real presence data from Supabase + realtime updates
 * @version 2.1.0
 */

import { CommunityDB } from './community-supabase.js';
import { Core } from './core.js';
import { renderAvatarIcon } from './avatar-icons.js';

const ActiveMembers = {

    // =========================================================================
    // STATE & CONFIG
    // =========================================================================

    state: {
        isRendered: false
    },

    config: {
        VALID_STATUSES: new Set(['online', 'available', 'away', 'guiding', 'silent', 'deep', 'offline']),
        PRESENCE_RETRY_INTERVAL: 300
    },

    // =========================================================================
    // RENDERING
    // =========================================================================

    async render() {
        const container = document.getElementById('activeMembersContainer');
        if (!container) {
            console.warn('[ActiveMembers] #activeMembersContainer not found');
            return;
        }

        container.innerHTML = this._buildShell('Loading...');

        try {
            const [members, blocked] = await Promise.all([
                CommunityDB.getActiveMembers(),
                CommunityDB.getBlockedUsers()
            ]);

            const visible = members.filter(m => !blocked.has(m.user_id));
            container.innerHTML = this._buildShell(
                `${visible.filter(m => m.status === 'online' || m.status === 'available').length} online`,
                visible
            );

            this._subscribeToPresence();
            this.state.isRendered = true;

        } catch (error) {
            console.error('[ActiveMembers] render error:', error);
            container.innerHTML = this._buildShell('Could not load members.');
        }
    },

    _subscribeToPresence() {
        const cb = async (updatedMembers) => {
            const blocked = await CommunityDB.getBlockedUsers();
            this._updateGrid(updatedMembers.filter(m => !blocked.has(m.user_id)));
        };

        if (!CommunityDB.subscribeToPresence(cb)) {
            const interval = setInterval(() => {
                if (!CommunityDB.ready) return;
                clearInterval(interval);
                CommunityDB.subscribeToPresence(cb);
            }, this.config.PRESENCE_RETRY_INTERVAL);
        }
    },

    _updateGrid(members) {
        // Update every active-members-grid on the page (dashboard widget + community hub)
        const grids   = document.querySelectorAll('.active-members-grid');
        const counts  = document.querySelectorAll('.active-members-online-count');
        const onlineN = members.filter(m => m.status === 'online' || m.status === 'available').length;
        const cardsHTML = this._buildMemberCards(members);

        grids.forEach(grid => { grid.innerHTML = cardsHTML; });
        counts.forEach(el  => { el.textContent = `${onlineN} online`; });

        // Fallback: legacy selector used before this patch
        if (!grids.length) {
            const grid    = document.querySelector('#activeMembersContainer .active-members-grid');
            const countEl = document.querySelector('#activeMembersContainer .section-header div:last-child');
            if (grid)    grid.innerHTML    = cardsHTML;
            if (countEl) countEl.textContent = `${onlineN} online`;
        }
    },

    // =========================================================================
    // HTML BUILDERS
    // =========================================================================

    _buildShell(subtitle, members = null) {
        const body = members === null
            ? ''
            : `
            <div class="active-members-grid">
                ${this._buildMemberCards(members)}
            </div>
            <button onclick="window.WhisperModal?.open()"
                    style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:none;
                           cursor:pointer;font-size:0.88rem;font-weight:600;
                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                           box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           position:relative;transition:opacity 0.15s;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whispers
                <span id="whisperUnreadBadge"
                      style="display:none;background:var(--neuro-accent);color:#fff;
                             border-radius:99px;font-size:0.7rem;font-weight:700;
                             padding:2px 7px;min-width:18px;text-align:center;"></span>
            </button>`;

        return `
            <section class="section">
                <div class="section-header">
                    <div class="section-title">Active Members</div>
                    <div class="active-members-online-count" style="font-size:12px; color:var(--text-muted);">${subtitle}</div>
                </div>
                ${body}
            </section>`;
    },

    _buildMemberCards(members) {
        if (!members?.length) {
            return '<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online right now.</div>';
        }
        return members.map(m => this._getMemberCardHTML(m)).join('');
    },

    _getMemberCardHTML(row) {
        if (!row) return '';

        const profile   = row.profiles || {};
        const name      = profile.name      || 'Member';
        const emoji     = profile.emoji     || '';
        const avatarUrl = profile.avatar_url || '';
        const rawStatus = row.status        || 'online';
        const activity  = row.activity      || '✨ Available';
        const userId    = row.user_id;
        const gradient  = Core.getAvatarGradient(userId || name);
        const safeName  = this._escape(name);

        const DOT_CLASS_MAP = {
            online:    'online',
            available: 'online',
            away:      'away',
            guiding:   'away',
            silent:    'silent',
            deep:      'deep',
            offline:   'offline',
        };
        const dotClass = DOT_CLASS_MAP[rawStatus] || 'offline';

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" alt="${safeName}" loading="lazy">`
            : emoji
                ? `<span class="member-avatar-icon">${renderAvatarIcon(emoji)}</span>`
                : `<span>${this._escape(name.charAt(0).toUpperCase())}</span>`;

        return `
            <div class="member-card-mini"
                 onclick="ActiveMembers.handleViewMember('${userId}')"
                 data-member-id="${userId}"
                 role="button"
                 tabindex="0"
                 aria-label="View ${safeName}'s profile">
                <div class="member-mini-avatar"
                     style="${avatarUrl ? 'background:transparent;' : `background:${gradient};`}"
                     aria-hidden="true">
                    ${avatarInner}
                </div>
                <div class="member-mini-status ${dotClass}"
                     aria-label="${rawStatus}"
                     title="${this._capitalize(rawStatus)}"></div>
                <div class="member-mini-name">${safeName}</div>
                <div class="member-mini-info">${this._escape(activity)}</div>
            </div>`;
    },

    // =========================================================================
    // INTERACTIONS
    // =========================================================================

    handleViewMember(userId) {
        if (!userId) return;
        if (window.MemberProfileModal) {
            MemberProfileModal.open(userId);
        } else {
            Core.showToast('Member profiles loading...');
        }
    },

    // =========================================================================
    // LIVE UPDATES (called externally)
    // =========================================================================

    updateMemberStatus(userId, status) {
        if (!this.config.VALID_STATUSES.has(status)) {
            console.error('[ActiveMembers] Invalid status:', status);
            return;
        }
        const card = document.querySelector(`[data-member-id="${userId}"]`);
        const indicator = card?.querySelector('.member-mini-status');
        if (!indicator) return;

        const DOT_CLASS_MAP = {
            online: 'online', available: 'online',
            away: 'away', guiding: 'away',
            silent: 'silent', deep: 'deep',
            offline: 'offline',
        };

        ['online','away','offline','silent','deep'].forEach(s => indicator.classList.remove(s));
        indicator.classList.add(DOT_CLASS_MAP[status] || 'offline');

        indicator.setAttribute('aria-label', status);
        indicator.setAttribute('title', this._capitalize(status));
    },

    updateMemberActivity(userId, activity) {
        if (!activity || typeof activity !== 'string') return;
        const el = document.querySelector(`[data-member-id="${userId}"] .member-mini-info`);
        if (el) el.textContent = activity;
    },

    async refresh() {
        this.state.isRendered = false;
        await this.render();
    },

    // =========================================================================
    // UTILITIES
    // =========================================================================

    _escape(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },

    _capitalize(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// Named export for ES module consumers
export { ActiveMembers };

// Keep window assignment for classic scripts
window.ActiveMembers = ActiveMembers;
