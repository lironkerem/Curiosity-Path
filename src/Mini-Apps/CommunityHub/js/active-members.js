/**
 * ACTIVE MEMBERS MODULE
 * Real presence data from Supabase + realtime updates
 * @version 3.0.0
 *
 * ARCHITECTURE CHANGE (v3):
 *  - Converted from singleton object → instantiable class (ActiveMembersWidget)
 *  - Each mount point (Dashboard, Community Hub) creates its own instance
 *  - Shared presence subscription is managed by a single PresenceManager
 *  - No more ID-swap hack; render() accepts a DOM element directly
 *  - Blocked users are fetched once and cached; re-fetched only on change
 *  - `window.ActiveMembers` is kept for legacy event listeners (avatarChanged etc.)
 *    but now refers to the Hub instance (the canonical one)
 */

import { CommunityDB } from './community-supabase.js';
import { renderAvatarIcon } from './avatar-icons.js';

// ─────────────────────────────────────────────────────────────────────────────
// PRESENCE MANAGER  (singleton — owns the single Supabase channel)
// Notifies every registered ActiveMembersWidget instance on updates.
// ─────────────────────────────────────────────────────────────────────────────

const PresenceManager = {
    _instances:   new Set(),   // registered ActiveMembersWidget instances
    _subscribed:  false,
    _retryTimer:  null,
    _blockedCache: null,       // Promise<Set<string>> — fetched once, shared

    /** Register a widget instance to receive live updates */
    register(instance) {
        this._instances.add(instance);
        if (!this._subscribed) this._subscribe();
    },

    /** Unregister a widget instance (e.g. on destroy) */
    unregister(instance) {
        this._instances.delete(instance);
        // If no more consumers, tear down the channel
        if (this._instances.size === 0) {
            this._unsubscribe();
            this._blockedCache = null;
        }
    },

    /** Fetch blocked users — result is cached for the session */
    async getBlocked() {
        if (!this._blockedCache) {
            this._blockedCache = CommunityDB.getBlockedUsers().catch(() => new Set());
        }
        return this._blockedCache;
    },

    /** Invalidate blocked-user cache (call after block/unblock actions) */
    invalidateBlocked() {
        this._blockedCache = null;
    },

    _subscribe() {
        if (!CommunityDB.ready) {
            this._retryTimer = setInterval(() => {
                if (!CommunityDB.ready) return;
                clearInterval(this._retryTimer);
                this._retryTimer = null;
                this._doSubscribe();
            }, 300);
            return;
        }
        this._doSubscribe();
    },

    _doSubscribe() {
        const ok = CommunityDB.subscribeToPresence(async (updatedMembers) => {
            const blocked = await this.getBlocked();
            const visible = updatedMembers.filter(m => !blocked.has(m.user_id));
            this._instances.forEach(inst => inst._onPresenceUpdate(visible));
        });
        this._subscribed = !!ok;
    },

    _unsubscribe() {
        clearInterval(this._retryTimer);
        this._retryTimer  = null;
        this._subscribed  = false;
        // CommunityDB.subscribeToPresence re-uses the same channel key,
        // so unsubscribing here is handled by CommunityDB._unsub('presence')
        // if called explicitly — we leave that to the Hub's own cleanup.
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE MEMBERS WIDGET  (one instance per mount point)
// ─────────────────────────────────────────────────────────────────────────────

const VALID_STATUSES = new Set(['online', 'available', 'away', 'guiding', 'silent', 'deep', 'offline']);

const DOT_CLASS_MAP = {
    online:    'online',
    available: 'online',
    away:      'away',
    guiding:   'away',
    silent:    'silent',
    deep:      'deep',
    offline:   'offline',
};

class ActiveMembersWidget {
    /**
     * @param {HTMLElement} containerEl  - The DOM element to render into.
     *                                     Must remain in the document for the
     *                                     lifetime of this instance.
     */
    constructor(containerEl) {
        if (!(containerEl instanceof HTMLElement)) {
            throw new TypeError('[ActiveMembersWidget] containerEl must be an HTMLElement');
        }
        this.container  = containerEl;
        this.isRendered = false;
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    /**
     * Initial render. Paints the shell immediately (no DB wait),
     * then fills in member data async without blocking the caller.
     */
    render() {
        // Paint skeleton NOW — synchronous, zero latency
        this.container.innerHTML = this._buildShell('Loading...');

        // Fetch data in parallel, non-blocking
        Promise.all([
            CommunityDB.getActiveMembers(),
            PresenceManager.getBlocked(),
        ]).then(([members, blocked]) => {
            const visible = members.filter(m => !blocked.has(m.user_id));
            this._paint(visible);
            PresenceManager.register(this);
            this.isRendered = true;
        }).catch(err => {
            console.error('[ActiveMembersWidget] render error:', err);
            this.container.innerHTML = this._buildShell('Could not load members.');
        });
    }

    /** Force a full re-fetch and re-render */
    async refresh() {
        this.isRendered = false;
        this.render();
    }

    /** Update a single member's status dot in-place */
    updateMemberStatus(userId, status) {
        if (!VALID_STATUSES.has(status)) {
            console.error('[ActiveMembersWidget] Invalid status:', status);
            return;
        }
        const card = this.container.querySelector(`[data-member-id="${userId}"]`);
        const dot  = card?.querySelector('.member-mini-status');
        if (!dot) return;

        ['online','away','offline','silent','deep'].forEach(s => dot.classList.remove(s));
        dot.classList.add(DOT_CLASS_MAP[status] || 'offline');
        dot.setAttribute('aria-label', status);
        dot.setAttribute('title', _capitalize(status));
    }

    /** Update a single member's activity text in-place */
    updateMemberActivity(userId, activity) {
        if (!activity || typeof activity !== 'string') return;
        const el = this.container.querySelector(`[data-member-id="${userId}"] .member-mini-info`);
        if (el) el.textContent = activity;
    }

    /** Update avatar after a profile save */
    updateMemberAvatar(userId, { emoji, avatarUrl } = {}) {
        const card     = this.container.querySelector(`[data-member-id="${userId}"]`);
        const avatarEl = card?.querySelector('.member-mini-avatar');
        if (!avatarEl) return;

        if (avatarUrl) {
            avatarEl.style.background = 'transparent';
            avatarEl.innerHTML = `<img src="${avatarUrl}"
                style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                alt="" loading="lazy" decoding="async">`;
        } else if (emoji) {
            avatarEl.style.background = '';
            avatarEl.innerHTML = `<span class="member-avatar-icon">${renderAvatarIcon(emoji)}</span>`;
        }
    }

    /** Clean up — unregister from PresenceManager */
    destroy() {
        PresenceManager.unregister(this);
        this.isRendered = false;
    }

    // ─── Called by PresenceManager on live updates ───────────────────────────

    _onPresenceUpdate(visibleMembers) {
        this._paint(visibleMembers);
    }

    // ─── Rendering helpers ───────────────────────────────────────────────────

    _paint(members) {
        const onlineCount = members.filter(
            m => m.status === 'online' || m.status === 'available'
        ).length;

        // Update counter without full re-render if already rendered
        const countEl = this.container.querySelector('.active-members-online-count');
        const grid    = this.container.querySelector('.active-members-grid');

        if (countEl && grid) {
            countEl.textContent = `${onlineCount} online`;
            grid.innerHTML = _buildMemberCards(members);
        } else {
            this.container.innerHTML = this._buildShell(
                `${onlineCount} online`,
                members
            );
        }
    }

    _buildShell(subtitle, members = null) {
        const body = members === null ? '' : `
            <div class="active-members-grid">
                ${_buildMemberCards(members)}
            </div>
            <button type="button" onclick="window.WhisperModal?.open()"
                    style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:none;
                           cursor:pointer;font-size:0.88rem;font-weight:600;
                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                           box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           position:relative;transition:opacity 0.15s;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round" class="lucide-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Whispers
                <span id="whisperUnreadBadge"
                      style="display:none;background:var(--neuro-accent);color:#fff;
                             border-radius:99px;font-size:0.7rem;font-weight:700;
                             padding:2px 7px;min-width:18px;text-align:center;"></span>
            </button>`;

        return `
            <section class="section" aria-labelledby="activeMembersTitle-${this._uid}">
                <div class="section-header">
                    <div class="section-title" id="activeMembersTitle-${this._uid}">Active Members</div>
                    <div class="active-members-online-count"
                         style="font-size:12px;color:var(--text-muted);">${subtitle}</div>
                </div>
                ${body}
            </section>`;
    }

    /** Unique ID per instance to avoid duplicate aria IDs */
    get _uid() {
        if (!this.__uid) this.__uid = Math.random().toString(36).slice(2, 7);
        return this.__uid;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PURE FUNCTIONS  (stateless helpers shared by all instances)
// ─────────────────────────────────────────────────────────────────────────────

function _buildMemberCards(members) {
    if (!members?.length) {
        return '<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online</div>';
    }
    return members.map(_getMemberCardHTML).join('');
}

function _getMemberCardHTML(row) {
    if (!row) return '';

    const profile   = row.profiles || {};
    const name      = profile.name       || 'Member';
    const emoji     = profile.emoji      || '';
    const avatarUrl = profile.avatar_url || '';
    const rawStatus = row.status         || 'online';
    const activity  = row.activity       || '✨ Available';
    const userId    = row.user_id;
    const gradient  = window.Core?.getAvatarGradient(userId || name);
    const safeName  = _escape(name);
    const dotClass  = DOT_CLASS_MAP[rawStatus] || 'offline';

    const avatarInner = avatarUrl
        ? `<img src="${avatarUrl}"
               style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
               alt="${safeName}" loading="lazy">`
        : emoji
            ? `<span class="member-avatar-icon">${renderAvatarIcon(emoji)}</span>`
            : `<span>${_escape(name.charAt(0).toUpperCase())}</span>`;

    return `
        <div class="member-card-mini"
             onclick="window._activeMembersHandleView('${userId}')"
             data-member-id="${userId}"
             role="button"
             tabindex="0"
             aria-label="View ${safeName}'s profile"
             onkeydown="if(event.key==='Enter'||event.key===' '){
                 event.preventDefault();
                 window._activeMembersHandleView('${userId}');
             }">
            <div class="member-mini-avatar"
                 style="${avatarUrl ? 'background:transparent;' : `background:${gradient};`}"
                 aria-hidden="true">
                ${avatarInner}
            </div>
            <div class="member-mini-status ${dotClass}"
                 aria-label="${rawStatus}"
                 title="${_capitalize(rawStatus)}"></div>
            <div class="member-mini-name">${safeName}</div>
            <div class="member-mini-info">${_escape(activity)}</div>
        </div>`;
}

function _escape(str) {
    if (!str || typeof str !== 'string') return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function _capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Global click handler (avoids inline script CSP issues with per-instance binding)
window._activeMembersHandleView = function(userId) {
    if (!userId) return;
    if (window.MemberProfileModal) {
        window.MemberProfileModal.open(userId);
    } else {
        window.Core?.showToast('Member profiles loading...');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL avatarChanged LISTENER
// Forwards to all registered instances
// ─────────────────────────────────────────────────────────────────────────────

window.addEventListener('avatarChanged', (e) => {
    const { userId, emoji, avatarUrl } = e.detail || {};
    if (!userId) return;
    PresenceManager._instances.forEach(inst => {
        inst.updateMemberAvatar(userId, { emoji, avatarUrl });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { ActiveMembersWidget, PresenceManager };
