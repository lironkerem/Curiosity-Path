/**
 * ACTIVE MEMBERS MODULE
 * Real presence data from Supabase + realtime updates
 * @version 2.2.0
 */

import { CommunityDB } from './community-supabase.js';
import { Core } from './core.js';
import { renderAvatarIcon } from './avatar-icons.js';

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } },
};

const VALID_STATUSES = Object.freeze(new Set(['online', 'available', 'away', 'guiding', 'silent', 'deep', 'offline']));

const DOT_CLASS_MAP = Object.freeze({
  online:    'online',
  available: 'online',
  away:      'away',
  guiding:   'away',
  silent:    'silent',
  deep:      'deep',
  offline:   'offline',
});

const ActiveMembers = {

    // =========================================================================
    // STATE & CONFIG
    // =========================================================================

    state: {
        isRendered: false,
    },

    config: {
        VALID_STATUSES,
        PRESENCE_RETRY_INTERVAL: 300,
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
                CommunityDB.getBlockedUsers(),
            ]);

            const visible = members.filter(m => !blocked.has(m.user_id));
            container.innerHTML = this._buildShell(
                `${visible.filter(m => m.status === 'online' || m.status === 'available').length} online`,
                visible
            );

            this._subscribeToPresence();
            this.state.isRendered = true;

        } catch (err) {
            console.error('[ActiveMembers] render error');
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
        const grids   = document.querySelectorAll('.active-members-grid');
        const counts  = document.querySelectorAll('.active-members-online-count');
        const onlineN = members.filter(m => m.status === 'online' || m.status === 'available').length;

        const frag = document.createDocumentFragment();
        members.forEach(m => {
            const tmp = document.createElement('div');
            tmp.innerHTML = this._getMemberCardHTML(m);
            while (tmp.firstChild) frag.appendChild(tmp.firstChild);
        });

        grids.forEach(grid => {
            grid.innerHTML = '';
            grid.appendChild(frag.cloneNode(true));
        });
        counts.forEach(el => { el.textContent = `${onlineN} online`; });

        // Fallback: legacy selector
        if (!grids.length) {
            const grid    = document.querySelector('#activeMembersContainer .active-members-grid');
            const countEl = document.querySelector('#activeMembersContainer .section-header div:last-child');
            if (grid) {
                grid.innerHTML = '';
                grid.appendChild(frag.cloneNode(true));
            }
            if (countEl) countEl.textContent = `${onlineN} online`;
        }
    },

    // =========================================================================
    // HTML BUILDERS
    // =========================================================================

    _buildShell(subtitle, members = null) {
        const section = document.createElement('section');
        section.className = 'section';
        section.setAttribute('aria-labelledby', 'activeMembersTitle');

        const header = document.createElement('div');
        header.className = 'section-header';

        const title = document.createElement('div');
        title.className = 'section-title';
        title.id = 'activeMembersTitle';
        title.textContent = 'Active Members';

        const sub = document.createElement('div');
        sub.className = 'active-members-online-count';
        sub.style.cssText = 'font-size:12px; color:var(--text-muted);';
        sub.textContent = subtitle;

        header.appendChild(title);
        header.appendChild(sub);
        section.appendChild(header);

        if (members !== null) {
            const grid = document.createElement('div');
            grid.className = 'active-members-grid';
            if (members.length) {
                members.forEach(m => {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = this._getMemberCardHTML(m);
                    while (tmp.firstChild) grid.appendChild(tmp.firstChild);
                });
            } else {
                const empty = document.createElement('div');
                empty.style.cssText = 'color:var(--text-muted);font-size:13px;padding:12px';
                empty.textContent = 'No members online right now.';
                grid.appendChild(empty);
            }
            section.appendChild(grid);

            // Whisper button - built via DOM API
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.style.cssText = 'width:100%;margin-top:12px;padding:12px;border-radius:12px;border:none;' +
                'cursor:pointer;font-size:0.88rem;font-weight:600;' +
                'background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);' +
                'box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);' +
                'display:flex;align-items:center;justify-content:center;gap:8px;' +
                'position:relative;transition:opacity 0.15s;';
            btn.setAttribute('aria-label', 'Open Whispers');
            btn.addEventListener('click', () => window.WhisperModal?.open());

            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('xmlns', svgNS);
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('fill', 'none');
            svg.setAttribute('stroke', 'currentColor');
            svg.setAttribute('stroke-width', '2');
            svg.setAttribute('stroke-linecap', 'round');
            svg.setAttribute('stroke-linejoin', 'round');
            svg.setAttribute('aria-hidden', 'true');
            svg.setAttribute('focusable', 'false');
            svg.classList.add('lucide-icon');
            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('d', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');
            svg.appendChild(path);

            const label = document.createElement('span');
            label.textContent = 'Whispers';

            const badge = document.createElement('span');
            badge.id = 'whisperUnreadBadge';
            badge.style.cssText = 'display:none;background:var(--neuro-accent);color:#fff;' +
                'border-radius:99px;font-size:0.7rem;font-weight:700;' +
                'padding:2px 7px;min-width:18px;text-align:center;';

            btn.appendChild(svg);
            btn.appendChild(label);
            btn.appendChild(badge);
            section.appendChild(btn);
        }

        const wrapper = document.createElement('div');
        wrapper.appendChild(section);
        return wrapper.innerHTML;
    },

    _getMemberCardHTML(row) {
        if (!row) return '';

        const profile   = row.profiles || {};
        const name      = profile.name      || 'Member';
        const emoji     = profile.emoji     || '';
        const avatarUrl = profile.avatar_url || '';
        const rawStatus = VALID_STATUSES.has(row.status) ? row.status : 'offline';
        const activity  = typeof row.activity === 'string' ? row.activity : '✨ Available';
        const userId    = row.user_id || '';
        const gradient  = Core.getAvatarGradient(userId || name);
        const safeName  = this._escape(name);
        const dotClass  = DOT_CLASS_MAP[rawStatus] || 'offline';

        const card = document.createElement('div');
        card.className = 'member-card-mini';
        card.setAttribute('data-member-id', userId);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `View ${safeName}'s profile`);
        card.addEventListener('click', () => ActiveMembers.handleViewMember(userId));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ActiveMembers.handleViewMember(userId);
            }
        });

        const avatarEl = document.createElement('div');
        avatarEl.className = 'member-mini-avatar';
        avatarEl.style.cssText = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
        avatarEl.setAttribute('aria-hidden', 'true');

        if (avatarUrl) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = safeName;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;';
            avatarEl.appendChild(img);
        } else if (emoji) {
            const iconSpan = document.createElement('span');
            iconSpan.className = 'member-avatar-icon';
            iconSpan.innerHTML = renderAvatarIcon(emoji);
            avatarEl.appendChild(iconSpan);
        } else {
            const initial = document.createElement('span');
            initial.textContent = name.charAt(0).toUpperCase();
            avatarEl.appendChild(initial);
        }

        const statusDot = document.createElement('div');
        statusDot.className = `member-mini-status ${dotClass}`;
        statusDot.setAttribute('aria-label', rawStatus);
        statusDot.setAttribute('title', this._capitalize(rawStatus));

        const nameEl = document.createElement('div');
        nameEl.className = 'member-mini-name';
        nameEl.textContent = name;

        const infoEl = document.createElement('div');
        infoEl.className = 'member-mini-info';
        infoEl.textContent = activity;

        card.appendChild(avatarEl);
        card.appendChild(statusDot);
        card.appendChild(nameEl);
        card.appendChild(infoEl);

        const wrapper = document.createElement('div');
        wrapper.appendChild(card);
        return wrapper.innerHTML;
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
        if (!VALID_STATUSES.has(status)) {
            console.error('[ActiveMembers] Invalid status');
            return;
        }
        const card = document.querySelector(`[data-member-id="${userId}"]`);
        const indicator = card?.querySelector('.member-mini-status');
        if (!indicator) return;

        ['online', 'away', 'offline', 'silent', 'deep'].forEach(s => indicator.classList.remove(s));
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
    },
};

// bfcache: unsubscribe presence on pagehide
window.addEventListener('pagehide', () => {
    try { window.CommunityDB?.unsubscribeAll?.(); } catch { /* noop */ }
});

// Named export for ES module consumers
export { ActiveMembers };

// Window bridge for classic scripts
window.ActiveMembers = ActiveMembers;

// Listen for avatar changes from User Tab profile save
window.addEventListener('avatarChanged', (e) => {
    const { userId, emoji, avatarUrl } = e.detail || {};
    if (!userId) return;
    const card = document.querySelector(`[data-member-id="${userId}"]`);
    if (!card) return;
    const avatarEl = card.querySelector('.member-mini-avatar');
    if (!avatarEl) return;

    if (avatarUrl) {
        avatarEl.style.background = 'transparent';
        avatarEl.innerHTML = '';
        const img = document.createElement('img');
        img.src = avatarUrl;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;';
        avatarEl.appendChild(img);
    } else if (emoji) {
        avatarEl.style.background = '';
        avatarEl.innerHTML = '';
        const span = document.createElement('span');
        span.className = 'member-avatar-icon';
        span.innerHTML = renderAvatarIcon(emoji);
        avatarEl.appendChild(span);
    }
});
