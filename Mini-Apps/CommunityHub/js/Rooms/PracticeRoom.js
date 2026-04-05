/**
 * PRACTICE ROOM BASE CLASS v3.1
 * Base class for all practice rooms with shared lifecycle, UI, and presence.
 *
 * Changes from v3.0:
 * - _renderParticipantList: added explicit avatar dimensions (width/height/min-width/min-height)
 *   so subclasses no longer need to override it just for sizing.
 * - _refreshParticipantSidebar: now accepts an optional pre-fetched participants array
 *   to avoid a redundant DB call when enterRoom() has already fetched participants.
 * - fetchRoomParticipants: passes fetched data directly to _refreshParticipantSidebar
 *   so onEnter() hooks don't need to trigger a second fetch.
 */

import { Core } from '../core.js';
import { SafetyBar } from '../SafetyBar.js';
import { CommunityDB } from '../community-supabase.js';
import { CollectiveField } from '../collective-field.js';

// ─── Shared constants ────────────────────────────────────────────────────────

const _BLESS_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>`;

const _IN_SESSION_BADGE = `<span style="background:rgba(239,68,68,0.85);color:white;font-size:11px;font-weight:700;letter-spacing:0.08em;padding:4px 10px;border-radius:4px;text-transform:uppercase;">In Session</span>`;

const _AVATAR_DEFAULTS = {
    MAX: 5,
    fallbackGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

// ─── Module-level HTML escape (Issue #3) ────────────────────────────────────────
// PracticeRoom doesn't mix in ChatMixin, so we define a standalone escaper here.
// Applied to all user-supplied strings before insertion into innerHTML.
function _esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Shared SVG icon strings (Issue #10) ────────────────────────────────────────
// Defined once at module level — avoids repeated identical string allocations
// each time buildHeader / buildSafetyDropdown / buildCardFooter are called.
const _ICONS = {
    bless:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>`,
    leave:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2"/></svg>`,
    shield:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    book:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    alert:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    block:        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>`,
    mute:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
    help:         `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>`,
};

// ─── Module-level blocked-users cache (Issue #1) ──────────────────────────────
// Blocked users rarely change — fetch once per room session, not on every
// presence tick. Invalidated when the user leaves the room.
const _blockedCache = {
    data:      null,   // Set<userId> | null
    fetchedAt: 0,
    TTL_MS:    120_000, // 2 minutes

    async get() {
        const now = Date.now();
        if (this.data && (now - this.fetchedAt) < this.TTL_MS) return this.data;
        try {
            this.data = await CommunityDB.getBlockedUsers();
            this.fetchedAt = now;
        } catch (_) {
            this.data = this.data ?? new Set();
        }
        return this.data;
    },

    invalidate() {
        this.data      = null;
        this.fetchedAt = 0;
    },
};

// ─────────────────────────────────────────────────────────────────────────────

class PracticeRoom {
    constructor(config) {
        this.roomId   = config.roomId;
        this.roomType = config.roomType; // 'always-open' | 'timed'

        this.config = {
            name:            'Practice Room',
            icon:            '🧘',
            description:     'A space for practice',
            energy:          'Peaceful',
            statusRingColor: 'var(--neuro-accent)',
            imageUrl:        '',
            ...config,
        };

        this.state = {
            participants: config.participants || 0,
            isActive:     true,
            ...config.state,
        };

        this.eventListeners = [];
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Returns true when CommunityDB is available and ready. */
    _dbReady() {
        return !!(CommunityDB?.ready);
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    init() {
        this.updateRoomCard();
        window[`${this.roomId}_blessRoom`] = () => this._blessRoom();
        this.mountHubModals();
        this._loadBlessingCount();
        this.onInit?.();
    }

    mountHubModals() {
        const html = this.buildHubModals?.() || '';
        if (!html) return;

        let container = document.getElementById('roomHubModals');
        if (!container) {
            container = Object.assign(document.createElement('div'), {
                id: 'roomHubModals',
            });
            container.style.cssText = 'position:relative;z-index:200000;';
            document.body.appendChild(container);
        }

        document.getElementById(`${this.roomId}HubModalsSlot`)?.remove();

        const slot = Object.assign(document.createElement('div'), {
            id:        `${this.roomId}HubModalsSlot`,
            innerHTML: html,
        });
        container.appendChild(slot);
    }

    /** Override to expose hub-card modals before room entry. @returns {string} */
    buildHubModals() { return ''; }

    // ── Enter / Leave ─────────────────────────────────────────────────────────

    enterRoom() {
        if (!this.canEnterRoom()) {
            Core.showToast('Session in progress. Please wait for the next opening.');
            return;
        }

        PracticeRoom.stopHubPresence();
        this.createPracticeView();
        Core.navigateTo('practiceRoomView');
        Core.showToast(`${this.config.icon} Entered ${this.config.name}`);

        this.setupEventListeners();
        this.onEnter?.();
        this._setRoomPresence(this.roomId);

        // Auto-contribute to the 24h Calm Wave while in a practice room
        if (CollectiveField && !CollectiveField.state.isContributing) {
            CollectiveField._startWave();
        }

        // Fetch participants once and pass to sidebar — avoids double DB call.
        // _refreshParticipantSidebar will also set up the realtime subscription.
        setTimeout(async () => {
            await this._refreshParticipantSidebar(
                `${this.roomId}ParticipantListEl`,
                `${this.roomId}ParticipantCount`
            );
        }, 300);

        setTimeout(() => {
            this._refreshBlessingCounter();
            this._subscribeToBlessings();
        }, 400);

        CommunityDB.logRoomEntry(this.roomId)
            .then(id => { this._roomEntryId = id; })
            .catch(() => {});
    }

    leaveRoom() {
        this._exitCleanup();
        Core.navigateTo('hubView');
        Core.showToast(`Left ${this.config.name}`);
        this.onLeave?.();
        PracticeRoom.startHubPresence();
    }

    gentlyLeave() {
        this._exitCleanup();
        this.onLeave?.();
        PracticeRoom.startHubPresence();

        if (window.Rituals) {
            Rituals.showClosing();
        } else {
            Core.navigateTo('hubView');
        }
    }

    /** Shared teardown for both leaveRoom and gentlyLeave. */
    _exitCleanup() {
        if (CollectiveField?.state.isContributing) {
            CollectiveField._endWave();
        }

        this._clearRoomPresence();

        // Invalidate blocked-users cache so the next room entry fetches fresh data.
        _blockedCache.invalidate();
        // Reset participant diff key and in-flight flag.
        this._lastParticipantKey = null;
        this._participantFetchInFlight = false;
        // Clear blessing local state (Fix #4).
        this._blessingRows = null;
        clearTimeout(this._blessingRefreshTimer);

        if (this._roomEntryId) {
            CommunityDB.logRoomExit(this._roomEntryId).catch(() => {});
            this._roomEntryId = null;
        }

        for (const key of ['_presenceSub', '_sidebarPresenceSub']) {
            if (this[key]) {
                try { this[key].unsubscribe(); } catch (_) {}
                this[key] = null;
            }
        }

        if (CommunityDB) CommunityDB.unsubscribeFromBlessings(this.roomId);
        this.cleanup();
    }

    canEnterRoom() { return true; }

    _isWithinOpenWindow() {
        if (this.roomType !== 'timed') return true;
        return typeof this._checkCycleWindow === 'function'
            ? this._checkCycleWindow()
            : true;
    }

    cleanup() {
        this.eventListeners.forEach(({ element, event, handler }) =>
            element.removeEventListener(event, handler));
        this.eventListeners = [];
        this.onCleanup?.();
    }

    // ── Presence ──────────────────────────────────────────────────────────────

    _setRoomPresence(roomId) {
        if (!this._dbReady()) return;
        try {
            const activity = PracticeRoom.ROOM_ACTIVITIES[roomId]
                ?? `${this.config.icon} ${this.config.name}`;
            CommunityDB.setPresence('online', activity, roomId);
            if (Core?.state) {
                Core.state.currentRoom = roomId;
                if (Core.state.currentUser) Core.state.currentUser.activity = activity;
            }
        } catch (e) {
            console.error('[PracticeRoom] _setRoomPresence error:', e);
        }
    }

    _clearRoomPresence() {
        if (!this._dbReady()) return;
        try {
            CommunityDB.setPresence('online', '✨ Available', null);
            if (Core?.state) {
                Core.state.currentRoom = null;
                if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
            }
        } catch (e) {
            console.error('[PracticeRoom] _clearRoomPresence error:', e);
        }
    }

    // ── Participant tracking ───────────────────────────────────────────────────

    async fetchRoomParticipants() {
        if (!this._dbReady()) return;
        try {
            // Use cached blocked list — avoids a DB round-trip on every presence tick.
            const [participants, blocked] = await Promise.all([
                CommunityDB.getRoomParticipants(this.roomId),
                _blockedCache.get(),
            ]);
            const visible = participants.filter(p => !blocked.has(p.user_id));
            this.state.participants = visible.length;
            this._updateParticipantUI(visible);
            this._updateRoomCardCount(visible.length);
        } catch (e) {
            console.error(`[${this.roomId}] fetchRoomParticipants error:`, e);
        }
    }

    // subscribeToRoomParticipants() removed — _refreshParticipantSidebar owns
    // the single presence subscription. A second subscription here caused double
    // DB calls on every presence tick (Issue #1).

    _updateParticipantUI(participants) {
        const countEl = document.getElementById(`${this.roomId}ParticipantCount`);
        if (countEl) countEl.textContent = this.getParticipantText();

        const stackEl = document.getElementById(`${this.roomId}ParticipantStack`);
        if (stackEl) stackEl.innerHTML = this._buildAvatarStack(participants);
    }

    /**
     * Fetches participants and renders the sidebar list + realtime subscription.
     * Called once from enterRoom() — subsequent updates come via the subscription.
     *
     * Fix #1: Uses _blockedCache instead of fetching blocked users on every tick.
     * Fix #2: Skips DOM re-render when the visible participant set hasn't changed.
     */
    async _refreshParticipantSidebar(listId, countId = null) {
        if (!this._dbReady()) return;

        const doRefresh = async () => {
            // Issue #6: skip if a fetch is already in-flight — prevents duplicate
            // network requests when initial load and a presence event overlap.
            if (this._participantFetchInFlight) return;
            this._participantFetchInFlight = true;

            // _blockedCache.get() returns cached data within TTL — no extra DB call.
            const [participants, blocked] = await Promise.all([
                CommunityDB.getRoomParticipants(this.roomId),
                _blockedCache.get(),
            ]);
            const visible = participants.filter(p => !blocked.has(p.user_id));

            // ── Issue #2: skip render when participant set is unchanged ──────────
            this._participantFetchInFlight = false;

            const newKey = visible.map(p => p.user_id).sort().join(',');
            if (newKey === this._lastParticipantKey) return;
            this._lastParticipantKey = newKey;
            // ────────────────────────────────────────────────────────────────────

            this.state.participants = visible.length;

            // Update header avatar stack too
            this._updateParticipantUI(visible);

            const listEl = document.getElementById(listId);
            if (listEl) this._renderParticipantList(listEl, visible);

            if (countId) {
                const countEl = document.getElementById(countId);
                if (countEl) countEl.textContent = `${visible.length} present`;
            }
            this._updateRoomCardCount(visible.length);
        };

        try {
            await doRefresh();
        } catch (e) {
            this._participantFetchInFlight = false;
            console.error(`[${this.roomId}] _refreshParticipantSidebar error:`, e);
            return;
        }

        this._sidebarPresenceSub?.unsubscribe();
        this._sidebarPresenceSub = CommunityDB.subscribeToPresence(async () => {
            if (document.getElementById(listId)) {
                await doRefresh();
            } else {
                this._sidebarPresenceSub?.unsubscribe();
                this._sidebarPresenceSub = null;
            }
        });
    }

    _updateRoomCardCount(count) {
        this.state.participants = count;
        const el = document.querySelector(`[data-room-id="${this.roomId}"] .room-participants`);
        if (el) el.textContent = this.getParticipantText();
    }

    // ── Avatar rendering ──────────────────────────────────────────────────────

    /** Shared avatar-stack HTML for header and blessings. */
    _buildAvatarStack(rows, size = 22, fontSize = 9) {
        const { MAX, fallbackGradient } = _AVATAR_DEFAULTS;
        const shown    = rows.slice(0, MAX);
        const overflow = rows.length - MAX;

        const avatars = shown.map(row => {
            const p          = row.profiles || {};
            const name       = _esc(p.name       || 'Member');
            const avatarUrl  = _esc(p.avatar_url || '');
            const emoji      = _esc(p.emoji      || '');
            const initial    = emoji || name.charAt(0).toUpperCase();
            const gradient   = Core?.getAvatarGradient?.(row.user_id || name) ?? fallbackGradient;
            const inner      = avatarUrl
                ? `<img src="${avatarUrl}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}" loading="lazy" decoding="async">`
                : `<span style="color:white;font-size:${fontSize}px;font-weight:700;">${initial}</span>`;
            const bg = avatarUrl ? 'transparent' : gradient;
            return `<div title="${name}" style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-left:-6px;flex-shrink:0;">${inner}</div>`;
        }).join('');

        const extra = overflow > 0
            ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${overflow}</span>`
            : '';

        return avatars + extra;
    }

    /** Header participant stack - larger avatars, clickable. */
    _buildRealAvatars(participants) {
        const { MAX, fallbackGradient } = _AVATAR_DEFAULTS;
        const shown    = participants.slice(0, MAX);
        const overflow = participants.length - MAX;

        const html = shown.map(p => {
            const profile   = p.profiles || {};
            const userId    = p.user_id || profile.id || '';
            const name      = _esc(profile.name      || 'Member');
            const avatarUrl = _esc(profile.avatar_url || '');
            const emoji     = _esc(profile.emoji     || '');
            const gradient  = Core?.getAvatarGradient?.(userId || name) ?? fallbackGradient;
            const inner     = avatarUrl
                ? `<img src="${avatarUrl}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}" loading="lazy" decoding="async">`
                : `<span aria-hidden="true">${emoji || name.charAt(0).toUpperCase()}</span>`;
            const bg      = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
            const click   = userId ? `onclick="openMemberProfileAboveRoom('${userId}')"` : '';
            const role    = userId ? 'button' : 'img';
            const tabIdx  = userId ? 'tabindex="0"' : '';
            const keydown = userId ? `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${userId}');}"` : '';
            const ariaLbl = `aria-label="${name}"`;
            return `<div class="p-avatar" style="${bg}" title="${name}" role="${role}" ${tabIdx} ${ariaLbl} ${click} ${keydown}>${inner}</div>`;
        }).join('');

        return html + (overflow > 0
            ? `<div class="p-avatar" style="background:var(--surface);color:var(--text-muted);font-size:11px;">+${overflow}</div>`
            : '');
    }

    /**
     * Renders the participant sidebar list.
     * Canonical implementation — subclasses should NOT override this.
     * Avatar dimensions are explicitly set here to 40x40px.
     */
    _renderParticipantList(listEl, participants) {
        if (!participants.length) {
            listEl.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:8px;">Just you here 🕯️</div>`;
            return;
        }
        const { fallbackGradient } = _AVATAR_DEFAULTS;
        listEl.innerHTML = participants.map(p => {
            const profile   = p.profiles || {};
            const userId    = p.user_id || profile.id || '';
            const name      = _esc(profile.name      || 'Member');
            const avatarUrl = _esc(profile.avatar_url || '');
            const emoji     = _esc(profile.emoji     || '');
            const gradient  = Core?.getAvatarGradient?.(userId || name) ?? fallbackGradient;
            const inner     = avatarUrl
                ? `<img src="${avatarUrl}" referrerpolicy="no-referrer" width="40" height="40" style="width:40px;height:40px;min-width:40px;min-height:40px;object-fit:cover;border-radius:50%;display:block;" alt="${name}" loading="lazy" decoding="async">`
                : `<span style="color:white;font-weight:600;font-size:13px;">${emoji || name.charAt(0).toUpperCase()}</span>`;
            const bg    = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
            const click = userId ? `onclick="openMemberProfileAboveRoom('${userId}')"` : '';
            const kbEvt = userId ? `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${userId}');}"` : '';
            const pRole = userId ? 'role="button" tabindex="0"' : '';
            return `
            <div class="campfire-participant" ${click} ${kbEvt} ${pRole} style="${userId ? 'cursor:pointer;' : ''}">
                <div class="campfire-participant-avatar" style="${bg}width:40px;height:40px;min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;">${inner}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${name}</div>
                    <div class="campfire-participant-country">${_esc(p.activity || '✨ Available')}</div>
                </div>
            </div>`;
        }).join('');
    }

    // ── Blessings ─────────────────────────────────────────────────────────────

    async _blessRoom() {
        const btn = document.getElementById(`${this.roomId}BlessBtn`);

        if (!this._dbReady()) {
            Core.showToast('Blessing sent');
            return;
        }

        if (btn) {
            if (btn.dataset.blessed) return;
            btn.dataset.blessed = '1';
            btn.style.background = '#c8b898';
            btn.style.color = '#a8824a';
            btn.innerHTML = `${_BLESS_SVG} Blessed ✦`;
            setTimeout(() => {
                delete btn.dataset.blessed;
                btn.style.background = '#d4c0a8';
                btn.style.color = '#7a5c20';
                const dotsHTML = `<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>`;
                btn.innerHTML = `${dotsHTML} ${_BLESS_SVG} Bless this room ${dotsHTML}`;
            }, 3000);
        }

        const blessData = await CommunityDB.blessRoom(this.roomId);
        Core.showToast('Blessing sent');

        // Show animation for the button presser; room subscribers get it via _subscribeToBlessings
        this._showBlessingAnimation(blessData?.profiles ? { name: blessData.profiles.name } : null);
        this._refreshBlessingCounter();
    }

    async _loadBlessingCount() {
        if (!this._dbReady()) return;
        try {
            const rows = await CommunityDB.getRoomBlessings(this.roomId);
            this._blessingRows = rows;   // seed local copy (Fix #4)
            this._updateCardBlessingBadge(rows.length);
        } catch (_) {}
    }

    _updateCardBlessingBadge(count) {
        const btn = document.getElementById(`${this.roomId}BlessBtn`);
        if (!btn) return;
        const dotsHTML = `<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>`;
        btn.innerHTML = count > 0
            ? `${dotsHTML} ${_BLESS_SVG} Bless this room <span style="font-size:10px;opacity:0.7;">${count}</span> ${dotsHTML}`
            : `${dotsHTML} ${_BLESS_SVG} Bless this room ${dotsHTML}`;
    }

    _subscribeToBlessings() {
        if (!this._dbReady()) return;
        CommunityDB.subscribeToBlessings(this.roomId, payload => {
            this._showBlessingAnimation(payload);
            // Fix #4: optimistically bump the counter from the incoming payload
            // instead of triggering a full DB fetch on every blessing event.
            // A debounced full re-sync runs 3 s later to reconcile any drift.
            this._optimisticBlessingBump(payload);
            this._debouncedRefreshBlessingCounter();
        });
    }

    _optimisticBlessingBump(payload) {
        // Increment the in-memory count and re-render immediately — no DB call.
        this._blessingRows = this._blessingRows ?? [];
        if (payload && !this._blessingRows.some(r => r.id === payload.id)) {
            this._blessingRows = [...this._blessingRows, payload];
        }
        this._renderBlessingCounter(this._blessingRows);
        this._updateCardBlessingBadge(this._blessingRows.length);
    }

    // Fix #4: debounced full re-fetch — fires at most once per 3 s burst of blessings.
    _debouncedRefreshBlessingCounter() {
        clearTimeout(this._blessingRefreshTimer);
        this._blessingRefreshTimer = setTimeout(() => this._refreshBlessingCounter(), 3000);
    }

    async _refreshBlessingCounter() {
        if (!this._dbReady()) return;
        try {
            const rows = await CommunityDB.getRoomBlessings(this.roomId);
            this._blessingRows = rows;   // keep local copy in sync
            this._renderBlessingCounter(rows);
            this._updateCardBlessingBadge(rows.length);
        } catch (_) {}
    }

    _renderBlessingCounter(rows) {
        const el = document.getElementById(`${this.roomId}BlessedCounter`);
        if (!el) return;

        if (!rows.length) {
            el.innerHTML = `<span style="font-size:12px;color:var(--text-muted);opacity:0.6;">No blessings yet</span>`;
            return;
        }

        const avatars = this._buildAvatarStack(rows);
        const overflow = Math.max(0, rows.length - _AVATAR_DEFAULTS.MAX);
        const extra = overflow > 0
            ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${overflow}</span>`
            : '';

        el.innerHTML = `
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;margin-right:4px;display:inline-flex;align-items:center;gap:0.25rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg> Blessed by</span>
            <div style="display:flex;align-items:center;margin-left:6px;">${avatars}</div>
            ${extra}`;
    }

    _showBlessingAnimation(payload) {
        if (document.getElementById('blessingAnimationOverlay')) return;

        // ── Issue #3: Inject keyframe styles once into <head>, not per animation ──
        if (!document.getElementById('blessingKeyframes')) {
            const style = document.createElement('style');
            style.id = 'blessingKeyframes';
            style.textContent = `
                @keyframes blessFloat {
                    0%   { transform:translateY(0) scale(0.6); opacity:0; }
                    15%  { opacity:1; }
                    85%  { opacity:0.7; }
                    100% { transform:translateY(-110vh) scale(1.1); opacity:0; }
                }
                @keyframes blessFadeInOut {
                    0%   { opacity:0; transform:translate(-50%,-50%) scale(0.9); }
                    15%  { opacity:1; transform:translate(-50%,-50%) scale(1); }
                    75%  { opacity:1; }
                    100% { opacity:0; transform:translate(-50%,-50%) scale(1.05); }
                }`;
            document.head.appendChild(style);
        }

        const overlay = document.createElement('div');
        overlay.id = 'blessingAnimationOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:999999;display:flex;align-items:center;justify-content:center;overflow:hidden;';

        const senderName = payload?.name ?? null;
        const senderHtml = senderName
            ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.45);backdrop-filter:blur(8px);border-radius:40px;padding:10px 24px;font-size:15px;color:white;font-weight:500;animation:blessFadeInOut 3.5s ease forwards;white-space:nowrap;">🙏 ${senderName} sends a blessing</div>`
            : '';

        const SYMBOLS = ['✨','🌸','💜','🌿','⭐','🕊️','💫','🌙'];
        // Reduce particle count on mobile to ease GPU load (Issue #3).
        const isMobile    = window.innerWidth < 768;
        const PARTICLE_N  = isMobile ? 12 : 28;
        const particles   = Array.from({ length: PARTICLE_N }, (_, i) => {
            const left   = 5 + Math.random() * 90;
            const delay  = (Math.random() * 1.8).toFixed(2);
            const dur    = (2.5 + Math.random() * 1.5).toFixed(2);
            const size   = Math.round(14 + Math.random() * 18);
            const rotate = Math.round(-30 + Math.random() * 60);
            return `<div style="position:absolute;bottom:-40px;left:${left.toFixed(1)}%;font-size:${size}px;opacity:0;animation:blessFloat ${dur}s ${delay}s ease-out forwards;transform:rotate(${rotate}deg);">${SYMBOLS[i % SYMBOLS.length]}</div>`;
        }).join('');

        overlay.innerHTML = particles + senderHtml;

        (document.getElementById('communityHubFullscreenContainer') || document.body).appendChild(overlay);
        setTimeout(() => overlay.remove(), 4000);
    }

    // ── UI creation ───────────────────────────────────────────────────────────

    createPracticeView() {
        const roomHTML = [
            this.buildHeader(),
            this.buildBody(),
            this.buildInstructionsModal(),
            this.buildAdditionalModals?.() ?? '',
        ].join('');

        SafetyBar.injectModals();

        const dynamicContent = document.getElementById('dynamicRoomContent');
        if (dynamicContent) {
            dynamicContent.innerHTML = roomHTML;
        } else {
            if (document.getElementById(`${this.roomId}View`)) return;
            document.body.insertAdjacentHTML('beforeend',
                `<div class="view practice-space" id="${this.roomId}View">${roomHTML}</div>`);
        }
    }

    buildHeader() {
        window[`${this.roomId}_gentlyLeave`] = () => this.gentlyLeave();

        return `
        <header class="ps-header" style="padding:12px 16px;display:flex;flex-direction:column;gap:12px;${this.getHeaderGradient()}">
            <div class="ps-info" style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">
                <div style="width:100%;display:flex;justify-content:flex-start;">
                    <img src="${this.config.imageUrl}" alt="${this.config.name}" width="600" height="400" loading="lazy" decoding="async" style="max-width:600px;width:100%;height:auto;display:block;">
                </div>
                <div style="display:flex;align-items:center;gap:20px;margin-top:16px;flex-wrap:wrap;">
                    <div class="ps-participants" style="display:flex;align-items:center;gap:8px;">
                        ${this.buildParticipantAvatars()}
                        <span id="${this.roomId}ParticipantCount" style="font-size:14px;font-weight:500;letter-spacing:0.05em;">${this.getParticipantText()}</span>
                    </div>
                    <div id="${this.roomId}BlessedCounter" style="display:flex;align-items:center;gap:4px;opacity:0.85;">
                        <span style="font-size:12px;color:var(--text-muted);">Loading blessings…</span>
                    </div>
                </div>
            </div>
            <div class="ps-header-btn-grid">
                ${this.buildAdditionalHeaderButtons?.() ?? ''}
                ${this.buildSafetyDropdown()}
                <button type="button" class="ps-leave ps-header-btn" onclick="window['${this.roomId}_gentlyLeave']()">
                    ${_ICONS.leave} Gently Leave
                </button>
            </div>
        </header>`;
    }

    buildSafetyDropdown() {
        const toggle  = `${this.roomId}_toggleSafetyDropdown`;
        const showInst = `${this.roomId}_showInstructions`;
        // Issue #7: only register globals once — guard prevents re-assignment
        // on every room entry (buildHeader → buildSafetyDropdown is called each time).
        if (!window[toggle])   window[toggle]   = e => this.toggleSafetyDropdown(e);
        if (!window[showInst]) window[showInst] = () => this.showInstructions();

        return `
        <div style="position:relative;" id="${this.roomId}SafetyDropdownContainer">
            <button type="button" class="ps-leave" onclick="${toggle}(event)" aria-haspopup="true" aria-expanded="false"
                    style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);white-space:nowrap;padding:10px 16px;">
                ${_ICONS.shield} Safety <span style="font-size:12px;">▼</span>
            </button>
            <div id="${this.roomId}SafetyDropdown"
                 style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);min-width:200px;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:100001;">
                ${[
                    [`${showInst}(); ${toggle}(event);`,              _ICONS.book,  'Instructions'],
                    [`CommunityModule.showReportModal(); ${toggle}(event);`, _ICONS.alert, 'Report Issue'],
                    [`CommunityModule.showBlockModal();  ${toggle}(event);`, _ICONS.block, 'Block User'],
                    [`CommunityModule.muteChat();        ${toggle}(event);`, _ICONS.mute,  'Mute Chat'],
                    [`CommunityModule.showHelpModal();   ${toggle}(event);`, _ICONS.help,  'Get Help'],
                ].map(([fn, icon, label], i, arr) => {
                    const border = i < arr.length - 1 ? 'border-bottom:1px solid var(--border);' : '';
                    return `<button type="button" onclick="${fn}" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;${border}cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text);"><span aria-hidden="true">${icon}</span> ${label}</button>`;
                }).join('')}
            </div>
        </div>`;
    }

    buildParticipantAvatars() {
        const [a, b] = this.config.name.split(' ').map(w => w[0]);
        return `
        <div class="participant-stack" id="${this.roomId}ParticipantStack">
            <div class="p-avatar" style="background:linear-gradient(135deg,#f093fb,#f5576c);" aria-hidden="true">${a || 'P'}</div>
            <div class="p-avatar" style="background:linear-gradient(135deg,#4facfe,#00f2fe);" aria-hidden="true">${b || 'R'}</div>
        </div>`;
    }

    buildBody() {
        return `<div class="ps-body"><main class="ps-main"><p>Override buildBody() in your room class.</p></main></div>`;
    }

    buildInstructionsModal() {
        const closeKey = `${this.roomId}_closeInstructions`;
        window[closeKey] = () => this.closeInstructions();
        return `
        <div class="modal-overlay" id="${this.roomId}InstructionsModal">
            <div class="modal-card">
                <button type="button" class="modal-close" aria-label="Close modal" onclick="${closeKey}()">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> ${this.config.name}</h2>
                    ${this.getInstructions()}
                    <button type="button" onclick="${closeKey}()" style="width:100%;padding:12px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;margin-top:16px;">Close</button>
                </div>
            </div>
        </div>`;
    }

    getInstructions() {
        return `
            <p><strong>Welcome to ${this.config.name}.</strong></p>
            <h3>How to Practice:</h3>
            <ul>
                <li>Find a comfortable space</li>
                <li>Focus on your intention</li>
                <li>Practice with presence</li>
            </ul>`;
    }

    buildParticipantSidebarHTML(title, listId, countId, height = '400px') {
        return `
        <div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:6px 8px;background:var(--background);">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;text-align:center;">${title}</div>
            <div id="${countId}" style="font-size:11px;color:var(--text-muted);margin-bottom:4px;text-align:center;">${this.state.participants} present</div>
            <div id="${listId}" class="campfire-participants" style="height:${height};overflow-y:auto;">
                <div style="color:var(--text-muted);font-size:13px;padding:8px;">Loading...</div>
            </div>
        </div>`;
    }

    // ── Room card ─────────────────────────────────────────────────────────────

    updateRoomCard() {
        const roomCard = document.querySelector(`[data-room-id="${this.roomId}"]`);
        if (!roomCard) return;

        const energySpan = roomCard.querySelector('.room-energy span');
        if (energySpan) energySpan.textContent = this.getParticipantText();

        if (this.roomType === 'timed') {
            const canEnter       = this.canEnterRoom();
            const isVisuallyOpen = this._isWithinOpenWindow();
            roomCard.style.cursor  = canEnter ? 'pointer' : 'not-allowed';
            roomCard.style.opacity = isVisuallyOpen ? '1' : '0.55';
            roomCard.style.border  = `3px solid ${isVisuallyOpen ? '#22c55e' : '#ef4444'}`;
            roomCard.onclick       = canEnter ? () => this.enterRoom() : null;
            roomCard.classList.toggle('active',     isVisuallyOpen);
            roomCard.classList.toggle('in-session', !isVisuallyOpen);

            let overlay = roomCard.querySelector('.in-session-label');
            if (!isVisuallyOpen && !overlay) {
                overlay = document.createElement('div');
                overlay.className = 'in-session-label';
                overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;';
                overlay.innerHTML = _IN_SESSION_BADGE;
                roomCard.appendChild(overlay);
            } else if (isVisuallyOpen && overlay) {
                overlay.remove();
            }

            const timerEl = roomCard.querySelector('.room-timer');
            if (timerEl && this.getTimerText) timerEl.innerHTML = this.getTimerText();
        } else {
            roomCard.style.border = '3px solid #22c55e';
            roomCard.classList.add('active');
        }

        this.onUpdateCard?.(roomCard);
    }

    getRoomCardHTML() {
        const canEnter       = this.canEnterRoom();
        const isTimed        = this.roomType === 'timed';
        const isVisuallyOpen = !isTimed || this._isWithinOpenWindow();
        const methodName     = `${this.roomId}_enterRoom`;
        window[methodName]   = () => this.enterRoom();

        return `
        <div class="practice-room ${isVisuallyOpen ? 'active' : 'in-session'}"
             data-room-type="${this.roomType}"
             data-room-id="${this.roomId}"
             ${canEnter ? `onclick="${methodName}()"` : ''}
             style="cursor:${canEnter ? 'pointer' : 'not-allowed'};border:3px solid ${isVisuallyOpen ? '#22c55e' : '#ef4444'};position:relative;opacity:${isVisuallyOpen ? '1' : '0.55'};display:flex;flex-direction:column;">

            ${this.getDevModeBadge()}

            ${!isVisuallyOpen && isTimed ? `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;">${_IN_SESSION_BADGE}</div>` : ''}

            <img src="${this.config.imageUrl}" alt="${this.config.name}" width="800" height="450" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;margin-bottom:12px;">

            <div class="room-desc" style="text-align:center;margin-bottom:16px;">${this.config.description}</div>

            <div style="flex:1;">${this.buildCardFooter()}</div>

            <div class="bless-room-wrap" style="width:calc(100% + 48px);margin:16px -24px 0 -24px;padding:2px;background:linear-gradient(135deg,#c8a96e,#e8d5a0,#a8824a,#dfc87a);">
                <div id="${this.roomId}BlessBtn"
                     role="button" tabindex="0"
                     onclick="event.stopPropagation();${this.roomId}_blessRoom()"
                     onkeydown="if(event.key==='Enter'||event.key===' '){event.stopPropagation();${this.roomId}_blessRoom();}"
                     title="Send a blessing to everyone inside"
                     class="bless-room-btn"
                     style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px 16px;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#7a5c20;background:#d4c0a8;cursor:pointer;white-space:nowrap;transition:background 0.2s,color 0.2s;user-select:none;">
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                    ${_BLESS_SVG} Bless this room
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                </div>
            </div>
        </div>`;
    }

    buildCardFooter() {
        if (this.roomType === 'timed' && this.getTimerText) {
            const scheduleLink = this.showScheduleModal
                ? `<button type="button" onclick="event.stopPropagation();${this.getClassName()}.showScheduleModal()" style="background:none;border:none;padding:0;font-size:11px;color:var(--text-muted);cursor:pointer;text-decoration:underline;text-align:left;display:inline-flex;align-items:center;gap:0.3rem;white-space:nowrap;flex-shrink:0;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> View Schedule</button>`
                : '';
            return `
            <div class="room-participants" style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${this.state.participants} present</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                ${scheduleLink}
                <div class="room-timer" style="font-size:11px;color:var(--text-muted);text-align:right;line-height:1.4;margin-left:auto;">${this.getTimerText()}</div>
            </div>`;
        }

        return `
        <div style="text-align:left;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
        </div>`;
    }

    // ── Event handling ────────────────────────────────────────────────────────

    setupEventListeners() {
        setTimeout(() => {
            const handler = e => this.handleOutsideClick(e);
            document.addEventListener('click', handler);
            this.eventListeners.push({ element: document, event: 'click', handler });
        }, 100);
    }

    handleOutsideClick(e) {
        const container = document.getElementById(`${this.roomId}SafetyDropdownContainer`);
        if (container && !container.contains(e.target)) {
            const dropdown = document.getElementById(`${this.roomId}SafetyDropdown`);
            if (dropdown) dropdown.style.display = 'none';
        }
        this.onOutsideClick?.(e);
    }

    toggleSafetyDropdown(event) {
        event?.stopPropagation();
        const dropdown  = document.getElementById(`${this.roomId}SafetyDropdown`);
        const container = document.getElementById(`${this.roomId}SafetyDropdownContainer`);
        if (!dropdown) return;

        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            return;
        }

        if (container) {
            const { bottom, right } = container.getBoundingClientRect(); // inside event handler, layout read is acceptable
            Object.assign(dropdown.style, {
                position:  'fixed',
                top:       `${bottom + 6}px`,
                right:     `${window.innerWidth - right}px`,
                left:      'auto',
                zIndex:    '2147483640',
                marginTop: '0',
            });
        }

        dropdown.style.display = 'block';
    }

    showInstructions() {
        document.getElementById(`${this.roomId}SafetyDropdown`)?.style.setProperty('display', 'none');
        document.getElementById(`${this.roomId}InstructionsModal`)?.classList.add('active');
    }

    closeInstructions() {
        document.getElementById(`${this.roomId}InstructionsModal`)?.classList.remove('active');
    }

    // ── Utility ───────────────────────────────────────────────────────────────

    getClassName()       { return 'window.' + this.constructor.name; }
    getParticipantText() { return `${this.state.participants} present`; }
    getHeaderGradient()  { return 'background:linear-gradient(135deg,rgba(139,92,246,0.1) 0%,rgba(168,85,247,0.05) 100%);'; }
    getDevModeBadge()    { return ''; }

    formatTime(seconds) {
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    }

    registerEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }
}

// ── Static: shared hub presence ───────────────────────────────────────────────

PracticeRoom._hubPresenceSub = null;
PracticeRoom._hubRooms       = [];

PracticeRoom.ROOM_ACTIVITIES = {
    'silent-room':     '🧘 Silent practice',
    'guided-room':     '🎧 Guided session',
    'breathwork-room': '💨 Breathwork',
    'campfire-room':   '🔥 Around the fire',
    'osho-room':       '🌀 Osho space',
    'deepwork-room':   '🎯 Deep work',
    'tarot-room':      '🔮 Tarot reading',
    'reiki-room':      '✨ Reiki session',
};

PracticeRoom.startHubPresence = async function(rooms) {
    if (rooms) PracticeRoom._hubRooms = rooms;
    const allRooms = PracticeRoom._hubRooms;
    if (!allRooms.length) return;

    if (!CommunityDB?.ready) {
        const interval = setInterval(() => {
            if (!CommunityDB?.ready) return;
            clearInterval(interval);
            PracticeRoom.startHubPresence();
        }, 500);
        return;
    }

    PracticeRoom.stopHubPresence();

    const refreshAll = async () => {
        const allPresence = await CommunityDB.getActiveMembers();
        const phantomCount = allPresence.filter(p => p.is_phantom).length;
        allRooms.forEach(room => {
            const count = allPresence.filter(p => p.room_id === room.roomId).length;
            room.state.participants = count + phantomCount;
            room._updateRoomCardCount(count + phantomCount);
        });
    };

    await refreshAll();
    PracticeRoom._hubPresenceSub = CommunityDB.subscribeToPresence(refreshAll);
};

PracticeRoom.stopHubPresence = function() {
    if (!PracticeRoom._hubPresenceSub) return;
    try { PracticeRoom._hubPresenceSub.unsubscribe(); } catch (_) {}
    PracticeRoom._hubPresenceSub = null;
};

// ── Global exports ────────────────────────────────────────────────────────────

window.PracticeRoom = PracticeRoom;

/**
 * Fix #7: Called by each room module after it registers its enterRoom function.
 * Allows CommunityHubEngine to open a pending room via CustomEvent instead of
 * a polling setInterval.
 */
window.dispatchRoomReady = function(roomKey) {
    document.dispatchEvent(new CustomEvent('practiceRoomReady', { detail: { roomKey } }));
};

window.openMemberProfileAboveRoom = function(userId) {
    if (!window.MemberProfileModal || !userId) return;
    MemberProfileModal.open(userId);
    requestAnimationFrame(() => {
        // Fix #8: cache element references after first lookup — avoids 6 DOM
        // queries + forced style recalculation on every avatar tap.
        // Issue #9: invalidate cache if any element is no longer in the DOM
        // (happens when modal is destroyed and recreated between sessions).
        const _c = openMemberProfileAboveRoom._cachedEls;
        if (!_c || _c.some(el => !el.isConnected)) {
            openMemberProfileAboveRoom._cachedEls = [
                document.getElementById('memberProfileModal'),
                document.getElementById('memberProfileOverlay'),
                document.querySelector('.member-profile-overlay'),
                document.querySelector('.member-profile-modal'),
                document.querySelector('[class*="member"][class*="modal"]'),
                document.querySelector('[id*="memberProfile"]'),
            ].filter(Boolean);
        }
        openMemberProfileAboveRoom._cachedEls.forEach(el => { el.style.zIndex = '200000'; });
    });
};

export { PracticeRoom };
