/**
 * ACTIVE MEMBERS MODULE
 * Real presence data from Supabase + realtime updates
 * @version 3.1.0
 */

import { CommunityDB } from './community-supabase.js';
import { renderAvatarIcon } from './avatar-icons.js';

// ─────────────────────────────────────────────────────────────────────────────
// PRESENCE MANAGER  (singleton — owns the single Supabase channel)
// ─────────────────────────────────────────────────────────────────────────────

const PresenceManager = {
    _instances:    new Set(),
    _subscribed:   false,
    _retryTimer:   null,
    _blockedCache: null,

    register(instance) {
        this._instances.add(instance);
        if (!this._subscribed) this._subscribe();
    },

    unregister(instance) {
        this._instances.delete(instance);
        if (this._instances.size === 0) {
            this._unsubscribe();
            this._blockedCache = null;
        }
    },

    async getBlocked() {
        if (!this._blockedCache) {
            this._blockedCache = CommunityDB.getBlockedUsers().catch(() => new Set());
        }
        return this._blockedCache;
    },

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
        this._retryTimer = null;
        this._subscribed = false;
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE MEMBERS WIDGET
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

// How long to wait for CommunityDB to become ready before giving up (ms)
const DB_READY_TIMEOUT  = 10_000;
const DB_READY_INTERVAL = 150;

class ActiveMembersWidget {
    constructor(containerEl) {
        if (!(containerEl instanceof HTMLElement)) {
            throw new TypeError('[ActiveMembersWidget] containerEl must be an HTMLElement');
        }
        this.container  = containerEl;
        this.isRendered = false;
        this._destroyed = false;
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    render() {
        // Paint shell immediately — zero latency
        this.container.innerHTML = this._buildShell('Loading...');

        // Wait for CommunityDB to be ready, then fetch
        this._waitForDB()
            .then(() => Promise.all([
                CommunityDB.getActiveMembers(),
                PresenceManager.getBlocked(),
            ]))
            .then(([members, blocked]) => {
                if (this._destroyed) return;
                const visible = members.filter(m => !blocked.has(m.user_id));
                this._paint(visible);
                PresenceManager.register(this);
                this.isRendered = true;
            })
            .catch(err => {
                if (this._destroyed) return;
                console.error('[ActiveMembersWidget] render error:', err);
                this.container.innerHTML = this._buildShell('Could not load members.');
            });
    }

    async refresh() {
        this.isRendered = false;
        this.render();
    }

    updateMemberStatus(userId, status) {
        if (!VALID_STATUSES.has(status)) return;
        const card = this.container.querySelector(`[data-member-id="${userId}"]`);
        const dot  = card?.querySelector('.member-mini-status');
        if (!dot) return;
        ['online','away','offline','silent','deep'].forEach(s => dot.classList.remove(s));
        dot.classList.add(DOT_CLASS_MAP[status] || 'offline');
        dot.setAttribute('aria-label', status);
        dot.setAttribute('title', _capitalize(status));
    }

    updateMemberActivity(userId, activity) {
        if (!activity || typeof activity !== 'string') return;
        const el = this.container.querySelector(`[data-member-id="${userId}"] .member-mini-info`);
        if (el) el.textContent = activity;
    }

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

    destroy() {
        this._destroyed = true;
        PresenceManager.unregister(this);
        this.isRendered = false;
    }

    // ─── Internal ────────────────────────────────────────────────────────────

    /**
     * Resolves once CommunityDB.ready is true, or rejects after DB_READY_TIMEOUT.
     * This is the key fix for Issue 1: the Dashboard widget mounts before
     * CommunityDB.init() has run (it runs inside CommunityHubEngine, not on app boot).
     * We poll until it's ready rather than silently returning [].
     */
    _waitForDB() {
        if (CommunityDB.ready) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (this._destroyed) {
                    clearInterval(timer);
                    reject(new Error('widget destroyed'));
                } else if (CommunityDB.ready) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - start > DB_READY_TIMEOUT) {
                    clearInterval(timer);
                    reject(new Error('CommunityDB not ready after timeout'));
                }
            }, DB_READY_INTERVAL);
        });
    }

    _onPresenceUpdate(visibleMembers) {
        this._paint(visibleMembers);
    }

    _paint(members) {
        const onlineCount = members.filter(
            m => m.status === 'online' || m.status === 'available'
        ).length;

        const countEl = this.container.querySelector('.active-members-online-count');
        const grid    = this.container.querySelector('.active-members-grid');

        if (countEl && grid) {
            countEl.textContent = `${onlineCount} online`;
            grid.innerHTML = _buildMemberCards(members);
        } else {
            this.container.innerHTML = this._buildShell(`${onlineCount} online`, members);
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

    get _uid() {
        if (!this.__uid) this.__uid = Math.random().toString(36).slice(2, 7);
        return this.__uid;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PURE FUNCTIONS
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

window._activeMembersHandleView = function(userId) {
    if (!userId) return;
    if (window.MemberProfileModal) {
        window.MemberProfileModal.open(userId);
    } else {
        window.Core?.showToast('Member profiles loading...');
    }
};

window.addEventListener('avatarChanged', (e) => {
    const { userId, emoji, avatarUrl } = e.detail || {};
    if (!userId) return;
    PresenceManager._instances.forEach(inst => {
        inst.updateMemberAvatar(userId, { emoji, avatarUrl });
    });
});

export { ActiveMembersWidget, PresenceManager };
