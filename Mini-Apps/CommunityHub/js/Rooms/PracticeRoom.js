/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRACTICE ROOM BASE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class PracticeRoom
 * @description Base class for all practice rooms with shared functionality
 * @version 3.1.0 — PATCHED: Supabase presence tracking in all lifecycle methods
 * 
 * Features:
 * - Room lifecycle management
 * - Standard UI components (header, safety dropdown, modals)
 * - Event handling
 * - Room card generation
 * - Template system for customization
 * - ✅ Presence tracking on enter/leave (all rooms, no per-room code needed)
 * 
 * Dependencies:
 * - Core (navigation, toast notifications)
 * - SafetyBar (safety modals)
 * - CommunityModule (safety actions)
 * - Rituals (closing ceremony)
 * - CommunityDB (presence tracking)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class PracticeRoom {
    /**
     * Initialize a practice room
     * @param {Object} config - Room configuration
     */
    constructor(config) {
        // Core identifiers
        this.roomId = config.roomId;
        this.roomType = config.roomType; // 'always-open' or 'timed'
        
        // Room metadata
        this.config = {
            name: config.name || 'Practice Room',
            icon: config.icon || '🧘',
            description: config.description || 'A space for practice',
            energy: config.energy || 'Peaceful',
            statusRingColor: config.statusRingColor || 'var(--neuro-accent)',
            imageUrl: config.imageUrl || '',
            ...config
        };
        
        // Room state
        this.state = {
            participants: config.participants || 0,
            isActive: true,
            ...config.state
        };
        
        // Event listeners registry
        this.eventListeners = [];
        
        // Bind all methods to this instance for onclick handlers
        this._bindAllMethods();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Initialize the room module
     * Called when module is loaded
     */
    init() {
        console.log(`${this.config.icon} ${this.config.name} Module Loaded`);
        this.updateRoomCard();
        // Register global bless handler for the card button onclick
        window[`${this.roomId}_blessRoom`] = () => this._blessRoom();
        // Register any hub-accessible modals (e.g. schedule modal) into the
        // permanent #roomHubModals container so they're available from the card
        // before the user ever enters the room.
        this.mountHubModals();
        // Load initial blessing count onto card
        this._loadBlessingCount();
        // Call custom initialization if defined
        if (this.onInit) this.onInit();
    }
    
    /**
     * Inject this room's hub-accessible modals into the permanent #roomHubModals
     * container. Called once at init() so modals exist in the DOM from app load,
     * regardless of whether the user has entered the room.
     *
     * Creates #roomHubModals if it doesn't exist yet (works whether the app
     * uses a static index.html or a dynamically built DOM via CommunityHubEngine).
     */
    mountHubModals() {
        const html = this.buildHubModals ? this.buildHubModals() : '';
        if (!html) return;

        // Ensure the permanent container exists — create it if needed
        let container = document.getElementById('roomHubModals');
        if (!container) {
            container = document.createElement('div');
            container.id = 'roomHubModals';
            container.style.cssText = 'position:relative;z-index:200000;';
            document.body.appendChild(container);
        }

        // Avoid double-injection
        const existing = document.getElementById(`${this.roomId}HubModalsSlot`);
        if (existing) existing.remove();

        const slot = document.createElement('div');
        slot.id = `${this.roomId}HubModalsSlot`;
        slot.innerHTML = html;
        container.appendChild(slot);
    }

    /**
     * Override in rooms that expose modals from the hub card (before room entry).
     * Return HTML string of modal(s). These are permanent — not re-rendered on
     * room entry, so they must be self-contained and not depend on room DOM.
     * @returns {string} Modal HTML
     */
    buildHubModals() { return ''; }

    // ═══════════════════════════════════════════════════════════════════════
    // BLESSINGS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Called when user clicks "Bless 🙏" on the room card.
     * Persists to DB + broadcasts to everyone inside.
     */
    async _blessRoom() {
        if (!window.CommunityDB || !CommunityDB.ready) {
            Core.showToast('🙏 Blessing sent ✨');
            return;
        }
        const btn = document.getElementById(`${this.roomId}BlessBtn`);
        if (btn) {
            btn.style.background = 'rgba(139,92,246,0.3)';
            btn.style.color      = 'var(--accent)';
            btn.innerHTML        = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.8;"><path d="M9 2C9 2 4 5 4 10C4 13.3 6.7 16 10 16L10.5 17H13.5L14 16C17.3 16 20 13.3 20 10C20 5 15 2 15 2C15 2 13.5 4 12 4C10.5 4 9 2 9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 17L9.5 20H14.5L13.5 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 20H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg> Blessed';
            btn.disabled         = true;
            setTimeout(() => {
                btn.style.background = 'rgba(139,92,246,0.12)';
                btn.style.color      = 'var(--text-muted)';
                btn.innerHTML        = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.8;"><path d="M9 2C9 2 4 5 4 10C4 13.3 6.7 16 10 16L10.5 17H13.5L14 16C17.3 16 20 13.3 20 10C20 5 15 2 15 2C15 2 13.5 4 12 4C10.5 4 9 2 9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 17L9.5 20H14.5L13.5 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 20H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg> Bless';
                btn.disabled         = false;
            }, 3000);
        }

        const result = await CommunityDB.blessRoom(this.roomId);
        Core.showToast('🙏 Blessing sent ✨');

        // Also trigger animation locally for the blesser if they're inside
        if (document.getElementById(`${this.roomId}BlessedCounter`)) {
            this._showBlessingAnimation();
            this._refreshBlessingCounter();
        }
    }

    /**
     * Load blessing count from DB and update card badge.
     */
    async _loadBlessingCount() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const rows = await CommunityDB.getRoomBlessings(this.roomId);
            this._updateCardBlessingBadge(rows.length);
        } catch(e) {}
    }

    _updateCardBlessingBadge(count) {
        const btn = document.getElementById(`${this.roomId}BlessBtn`);
        if (!btn) return;
        btn.innerHTML = count > 0
            ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.8;"><path d="M9 2C9 2 4 5 4 10C4 13.3 6.7 16 10 16L10.5 17H13.5L14 16C17.3 16 20 13.3 20 10C20 5 15 2 15 2C15 2 13.5 4 12 4C10.5 4 9 2 9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 17L9.5 20H14.5L13.5 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 20H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg> Bless <span style="font-size:10px;opacity:0.7;">${count}</span>`
            : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.8;"><path d="M9 2C9 2 4 5 4 10C4 13.3 6.7 16 10 16L10.5 17H13.5L14 16C17.3 16 20 13.3 20 10C20 5 15 2 15 2C15 2 13.5 4 12 4C10.5 4 9 2 9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 17L9.5 20H14.5L13.5 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 20H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg> Bless';
    }

    /**
     * Subscribe to incoming blessings while inside the room.
     * Called from enterRoom lifecycle.
     */
    _subscribeToBlessings() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        CommunityDB.subscribeToBlessings(this.roomId, (payload) => {
            this._showBlessingAnimation(payload);
            this._refreshBlessingCounter();
        });
    }

    /**
     * Fetch latest blessings and update the in-room header counter.
     */
    async _refreshBlessingCounter() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const rows = await CommunityDB.getRoomBlessings(this.roomId);
            this._renderBlessingCounter(rows);
            this._updateCardBlessingBadge(rows.length);
        } catch(e) {}
    }

    /**
     * Render blessing avatars into the header counter element.
     * @param {Array} rows
     */
    _renderBlessingCounter(rows) {
        const el = document.getElementById(`${this.roomId}BlessedCounter`);
        if (!el) return;

        if (rows.length === 0) {
            el.innerHTML = `<span style="font-size:12px;color:var(--text-muted);opacity:0.6;">No blessings yet</span>`;
            return;
        }

        const MAX = 5;
        const shown   = rows.slice(0, MAX);
        const overflow = rows.length - MAX;

        const avatars = shown.map(row => {
            const p         = row.profiles || {};
            const name      = p.name      || 'Member';
            const avatarUrl = p.avatar_url || '';
            const emoji     = p.emoji      || '';
            const initial   = emoji || name.charAt(0).toUpperCase();
            const gradient  = window.Core?.getAvatarGradient
                ? Core.getAvatarGradient(row.user_id || name)
                : 'linear-gradient(135deg,#a78bfa,#7c3aed)';
            const inner = avatarUrl
                ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
                : `<span style="color:white;font-size:9px;font-weight:700;">${initial}</span>`;
            const bg = avatarUrl ? 'transparent' : gradient;
            return `<div title="${name}" style="width:22px;height:22px;border-radius:50%;background:${bg};border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-left:-6px;flex-shrink:0;">${inner}</div>`;
        }).join('');

        const overflowBadge = overflow > 0
            ? `<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${overflow}</span>`
            : '';

        el.innerHTML = `
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;margin-right:4px;">🙏 Blessed by</span>
            <div style="display:flex;align-items:center;margin-left:6px;">${avatars}</div>
            ${overflowBadge}`;
    }

    /**
     * Full-screen blessing animation — calm floating particles.
     * Auto-removes after ~3.5 seconds.
     * @param {Object} [payload] — broadcaster info (optional)
     */
    _showBlessingAnimation(payload) {
        // Don't stack animations
        if (document.getElementById('blessingAnimationOverlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'blessingAnimationOverlay';
        overlay.style.cssText = `
            position:fixed;inset:0;pointer-events:none;z-index:999999;
            display:flex;align-items:center;justify-content:center;
            overflow:hidden;`;

        // Sender name pill (optional)
        const senderName = payload?.name ? payload.name : null;
        const senderHtml = senderName
            ? `<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                           background:rgba(0,0,0,0.45);backdrop-filter:blur(8px);
                           border-radius:40px;padding:10px 24px;
                           font-size:15px;color:white;font-weight:500;
                           animation:blessFadeInOut 3.5s ease forwards;white-space:nowrap;">
                   🙏 ${senderName} sends a blessing
               </div>`
            : '';

        // Generate floating particles
        const SYMBOLS = ['✨','🌸','💜','🌿','⭐','🕊️','💫','🌙'];
        const particles = Array.from({ length: 28 }, (_, i) => {
            const sym    = SYMBOLS[i % SYMBOLS.length];
            const left   = 5 + Math.random() * 90;
            const delay  = Math.random() * 1.8;
            const dur    = 2.5 + Math.random() * 1.5;
            const size   = 14 + Math.random() * 18;
            const rotate = -30 + Math.random() * 60;
            return `<div style="position:absolute;bottom:-40px;left:${left}%;
                                font-size:${size}px;opacity:0;
                                animation:blessFloat ${dur}s ${delay}s ease-out forwards;
                                transform:rotate(${rotate}deg);">${sym}</div>`;
        }).join('');

        overlay.innerHTML = `
            <style>
                @keyframes blessFloat {
                    0%   { transform:translateY(0) scale(0.6);  opacity:0; }
                    15%  { opacity:1; }
                    85%  { opacity:0.7; }
                    100% { transform:translateY(-110vh) scale(1.1); opacity:0; }
                }
                @keyframes blessFadeInOut {
                    0%   { opacity:0; transform:translate(-50%,-50%) scale(0.9); }
                    15%  { opacity:1; transform:translate(-50%,-50%) scale(1); }
                    75%  { opacity:1; }
                    100% { opacity:0; transform:translate(-50%,-50%) scale(1.05); }
                }
            </style>
            ${particles}
            ${senderHtml}`;

        // Attach to the fullscreen container if inside a room, else body
        const host = document.getElementById('communityHubFullscreenContainer') || document.body;
        host.appendChild(overlay);

        setTimeout(() => overlay.remove(), 4000);
    }

    /**
     * Enter the practice room.
     * Creates view, navigates, sets up listeners.
     * PATCHED: Updates Supabase presence with room ID after entry.
     */
    enterRoom() {
        if (!this.canEnterRoom()) {
            Core.showToast('Session in progress. Please wait for the next opening.');
            return;
        }
        
        // Stop shared hub subscription before entering room
        PracticeRoom.stopHubPresence();

        this.createPracticeView();
        Core.navigateTo('practiceRoomView');
        Core.showToast(`${this.config.icon} Entered ${this.config.name}`);
        
        this.setupEventListeners();
        if (this.onEnter) this.onEnter();
        this._setRoomPresence(this.roomId);

        setTimeout(async () => {
            await this.fetchRoomParticipants();
            this.subscribeToRoomParticipants();
        }, 300);

        // Blessings — load counter + subscribe to live broadcasts
        setTimeout(() => {
            this._refreshBlessingCounter();
            this._subscribeToBlessings();
        }, 400);

        // Log room entry for admin dashboard stats
        CommunityDB.logRoomEntry(this.roomId).then(entryId => {
            this._roomEntryId = entryId;
        }).catch(() => {});
    }
    
    /**
     * Leave the practice room.
     * Cleanup and navigate back to hub.
     * PATCHED: Resets Supabase presence back to hub / available.
     */
    leaveRoom() {
        this._clearRoomPresence();

        // Log room exit for admin dashboard stats
        if (this._roomEntryId) {
            CommunityDB.logRoomExit(this._roomEntryId).catch(() => {});
            this._roomEntryId = null;
        }

        // Unsubscribe from room-level presence subscriptions
        for (const sub of ['_presenceSub', '_sidebarPresenceSub']) {
            if (this[sub]) {
                try { this[sub].unsubscribe(); } catch(e) {}
                this[sub] = null;
            }
        }

        if (window.CommunityDB) CommunityDB.unsubscribeFromBlessings(this.roomId);

        this.cleanup();

        // Hide fullscreen container and restore body scroll handled by Core.navigateTo
        Core.navigateTo('hubView');
        Core.showToast(`Left ${this.config.name}`);
        if (this.onLeave) this.onLeave();

        // Restart shared hub subscription now that we're back on the hub
        PracticeRoom.startHubPresence();
    }

    /**
     * Gently leave — shows closing ritual, then cleans up room.
     * PATCHED: Resets Supabase presence before the ritual.
     */
    gentlyLeave() {
        this._clearRoomPresence();

        // Log room exit for admin dashboard stats
        if (this._roomEntryId) {
            CommunityDB.logRoomExit(this._roomEntryId).catch(() => {});
            this._roomEntryId = null;
        }

        // Unsubscribe from room-level presence subscriptions
        for (const sub of ['_presenceSub', '_sidebarPresenceSub']) {
            if (this[sub]) {
                try { this[sub].unsubscribe(); } catch(e) {}
                this[sub] = null;
            }
        }

        if (window.CommunityDB) CommunityDB.unsubscribeFromBlessings(this.roomId);

        this.cleanup();
        if (this.onLeave) this.onLeave();

        // Restart shared hub subscription now that we're back on the hub
        PracticeRoom.startHubPresence();

        // Closing ritual handles container hide + body scroll restore
        if (window.Rituals) {
            Rituals.showClosing();
        } else {
            Core.navigateTo('hubView');
        }
    }
    
    /**
     * Check if user can enter room (override for timed rooms)
     * @returns {boolean}
     */
    canEnterRoom() {
        return true; // Always-open rooms always return true
    }

    /**
     * Check if the room is within its real open window — ignores admin bypass.
     * Used purely for visual card state (border color, opacity, In Session badge).
     * Always-open rooms are always visually open.
     * Timed rooms delegate to CycleStateMixin._checkCycleWindow() if available,
     * otherwise fall back to true.
     * @returns {boolean}
     */
    _isWithinOpenWindow() {
        if (this.roomType !== 'timed') return true;
        if (typeof this._checkCycleWindow === 'function') {
            return this._checkCycleWindow();
        }
        return true; // Fallback: no cycle mixin, treat as open
    }
    
    /**
     * Cleanup room resources
     * Removes event listeners and clears intervals
     */
    cleanup() {
        // Remove all registered event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        
        // Call custom cleanup if defined
        if (this.onCleanup) this.onCleanup();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PRESENCE HELPERS (PRIVATE)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Update Supabase presence to show user is in this room.
     * @param {string} roomId
     */
    _setRoomPresence(roomId) {
        if (!window.CommunityDB || !CommunityDB.ready) return;

        try {
            // Use activity label from Practice config if available, else derive from room config
            const activity = (window.Practice?.config?.ROOM_ACTIVITIES?.[roomId])
                || `${this.config.icon} ${this.config.name}`;

            CommunityDB.setPresence('online', activity, roomId);

            if (window.Core?.state) {
                Core.state.currentRoom = roomId;
                if (Core.state.currentUser) Core.state.currentUser.activity = activity;
            }

            console.log(`[${roomId}] Presence → in room`);
        } catch (error) {
            console.error('[PracticeRoom] _setRoomPresence error:', error);
        }
    }

    /**
     * Reset Supabase presence back to "available at hub".
     */
    _clearRoomPresence() {
        if (!window.CommunityDB || !CommunityDB.ready) return;

        try {
            CommunityDB.setPresence('online', '✨ Available', null);

            if (window.Core?.state) {
                Core.state.currentRoom = null;
                if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
            }

            console.log(`[${this.roomId}] Presence → available`);
        } catch (error) {
            console.error('[PracticeRoom] _clearRoomPresence error:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // PARTICIPANT TRACKING (LIVE)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Fetch current participants for this room and update UI.
     * Call from onEnter() or after createPracticeView().
     */
    async fetchRoomParticipants() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const participants = await CommunityDB.getRoomParticipants(this.roomId);
            const blocked = await CommunityDB.getBlockedUsers();
            const visible = participants.filter(p => !blocked.has(p.user_id));
            this.state.participants = visible.length;
            this._updateParticipantUI(visible);
            this._updateRoomCardCount(visible.length);
        } catch (e) {
            console.error(`[${this.roomId}] fetchRoomParticipants error:`, e);
        }
    }

    /**
     * Subscribe to presence changes and keep participant UI live.
     * Stored on this._presenceSub for cleanup.
     */
    subscribeToRoomParticipants() {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        this._presenceSub = CommunityDB.subscribeToPresence(async () => {
            await this.fetchRoomParticipants();
        });
    }

    /**
     * Update the participant avatars + count in the room header.
     * @param {Array} participants - Filtered presence rows with profile join
     */
    _updateParticipantUI(participants) {
        const countEl = document.getElementById(`${this.roomId}ParticipantCount`);
        if (countEl) {
            const text = this.getParticipantText();
            countEl.textContent = text;
        }

        const stackEl = document.querySelector(`#${this.roomId}ParticipantStack`);
        if (stackEl) {
            stackEl.innerHTML = this._buildRealAvatars(participants);
        }
    }

    /**
     * Build real user avatar circles from presence rows.
     * Shows up to 5 avatars + overflow count.
     * @param {Array} participants
     * @returns {string} HTML
     */
    _buildRealAvatars(participants) {
        const MAX = 5;
        const shown = participants.slice(0, MAX);
        const overflow = participants.length - MAX;

        const avatarHTML = shown.map(p => {
            const profile = p.profiles || {};
            const name = profile.name || 'Member';
            const avatarUrl = profile.avatar_url || '';
            const emoji = profile.emoji || '';
            const initial = name.charAt(0).toUpperCase();
            const gradient = window.Core?.getAvatarGradient
                ? Core.getAvatarGradient(p.user_id || name)
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

            const inner = avatarUrl
                ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
                : `<span>${emoji || initial}</span>`;
            const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

            return `<div class="p-avatar" style="${bg}" title="${name}">${inner}</div>`;
        }).join('');

        const overflowHTML = overflow > 0
            ? `<div class="p-avatar" style="background:var(--surface);color:var(--text-muted);font-size:11px;">+${overflow}</div>`
            : '';

        return avatarHTML + overflowHTML;
    }

    /**
     * Fetch room participants and render them into a named sidebar list.
     * Also subscribes to realtime presence changes to keep it live.
     * @param {string} listId   - DOM id of the .campfire-participants container
     * @param {string} countId  - DOM id of the count element (optional)
     */
    async _refreshParticipantSidebar(listId, countId = null) {
        if (!window.CommunityDB || !CommunityDB.ready) return;
        try {
            const _doRefresh = async () => {
                const participants = await CommunityDB.getRoomParticipants(this.roomId);
                const blocked = await CommunityDB.getBlockedUsers();
                const visible = participants.filter(p => !blocked.has(p.user_id));
                this.state.participants = visible.length;

                const listEl = document.getElementById(listId);
                if (listEl) this._renderParticipantList(listEl, visible);

                if (countId) {
                    const countEl = document.getElementById(countId);
                    if (countEl) countEl.textContent = `${visible.length} present`;
                }
                this._updateRoomCardCount(visible.length);
            };

            // Initial load
            await _doRefresh();

            // Realtime — re-render sidebar on any presence change
            if (this._sidebarPresenceSub) {
                try { this._sidebarPresenceSub.unsubscribe(); } catch(e) {}
            }
            this._sidebarPresenceSub = CommunityDB.subscribeToPresence(async () => {
                // Only refresh if the sidebar is still in the DOM
                if (document.getElementById(listId)) {
                    await _doRefresh();
                } else {
                    // DOM is gone — unsubscribe
                    try { this._sidebarPresenceSub?.unsubscribe(); } catch(e) {}
                    this._sidebarPresenceSub = null;
                }
            });

        } catch(e) {
            console.error(`[${this.roomId}] _refreshParticipantSidebar error:`, e);
        }
    }

    /**
     * Render real user rows into a participant list container.
     * @param {HTMLElement} listEl
     * @param {Array}       participants - Presence rows with profile join
     */
    _renderParticipantList(listEl, participants) {
        if (participants.length === 0) {
            listEl.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:8px;">Just you here 🕯️</div>`;
            return;
        }
        listEl.innerHTML = participants.map(p => {
            const profile   = p.profiles || {};
            const userId    = p.user_id || profile.id || '';
            const name      = profile.name || 'Member';
            const avatarUrl = profile.avatar_url || '';
            const emoji     = profile.emoji || '';
            const initial   = name.charAt(0).toUpperCase();
            const gradient  = window.Core?.getAvatarGradient
                ? Core.getAvatarGradient(userId || name)
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            const inner = avatarUrl
                ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
                : `<span style="color:white;font-weight:600;">${emoji || initial}</span>`;
            const bg         = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
            const clickStyle = userId ? 'cursor:pointer;' : '';
            const clickFn    = userId ? `onclick="openMemberProfileAboveRoom('${userId}')"` : '';
            return `
            <div class="campfire-participant" ${clickFn} style="${clickStyle}">
                <div class="campfire-participant-avatar" style="${bg}display:flex;align-items:center;justify-content:center;">${inner}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${name}</div>
                    <div class="campfire-participant-country">${p.activity || '✨ Available'}</div>
                </div>
            </div>`;
        }).join('');
    }

    /**
     * Build the shared participant sidebar panel HTML used by rooms with a
     * right-hand "who's here" column (Tarot, Reiki, and any future tabbed rooms).
     *
     * Rooms call this instead of defining their own duplicate HTML.
     *
     * @param {string} title       - Panel heading text, e.g. "Tarot Students"
     * @param {string} listId      - DOM id for the scrollable list element
     * @param {string} countId     - DOM id for the count line element
     * @param {string} [height]    - CSS height of the list, default "400px"
     * @returns {string} HTML
     */
    buildParticipantSidebarHTML(title, listId, countId, height = '400px') {
        return `
        <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; background: var(--background);">
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 16px; text-align: center;">${title}</div>
            <div id="${countId}" style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; text-align: center;">
                ${this.state.participants} present
            </div>
            <div id="${listId}" class="campfire-participants" style="height: ${height}; overflow-y: auto;">
                <div style="color:var(--text-muted);font-size:13px;padding:8px;">Loading...</div>
            </div>
        </div>`;
    }

    /**
     * Update the participant count on the hub room card (without re-render).
     * @param {number} count
     */
    _updateRoomCardCount(count) {
        this.state.participants = count;
        const card = document.querySelector(`[data-room-id="${this.roomId}"]`);
        if (!card) return;
        const el = card.querySelector('.room-participants');
        if (el) el.textContent = this.getParticipantText();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI CREATION METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create the practice view DOM
     * Injects the full room interface into the fullscreen container
     */
    createPracticeView() {
        // Check for fullscreen container (Big App integration)
        const dynamicContent = document.getElementById('dynamicRoomContent');
        
        if (dynamicContent) {
            // Render into fullscreen container for Big App integration
            console.log(`[${this.roomId}] Rendering into fullscreen container`);
            
            // Inject safety modals
            SafetyBar.injectModals();
            
            const roomHTML = `
                ${this.buildHeader()}
                ${this.buildBody()}
                ${this.buildInstructionsModal()}
                ${this.buildAdditionalModals ? this.buildAdditionalModals() : ''}
            `;
            
            dynamicContent.innerHTML = roomHTML;
            
        } else {
            // Fallback: Original behavior for standalone version
            console.log(`[${this.roomId}] Rendering as standalone view`);
            
            // Don't recreate if already exists
            if (document.getElementById(`${this.roomId}View`)) return;
            
            // Inject safety modals
            SafetyBar.injectModals();
            
            const viewHTML = `
                <div class="view practice-space" id="${this.roomId}View">
                    ${this.buildHeader()}
                    ${this.buildBody()}
                    ${this.buildInstructionsModal()}
                    ${this.buildAdditionalModals ? this.buildAdditionalModals() : ''}
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', viewHTML);
        }
    }
    
    /**
     * Build header component
     * @returns {string} Header HTML
     */
    buildHeader() {
        const participantText = this.getParticipantText();
        const gradientStyle = this.getHeaderGradient();
        
        // Register gentlyLeave global for onclick
        window[`${this.roomId}_gentlyLeave`] = () => this.gentlyLeave();
        
        return `
        <header class="ps-header" style="padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; ${gradientStyle}">
            <div class="ps-info" style="display: flex; flex-direction: column; align-items: flex-start; flex: 1; min-width: 0;">
                <!-- Room Image -->
                <div style="width: 100%; display: flex; justify-content: flex-start; margin: 0; padding: 0;">
                    <img src="${this.config.imageUrl}" 
                         alt="${this.config.name}" 
                         style="max-width: 600px; width: 100%; height: auto; margin: 0; padding: 0; display: block;">
                </div>
                
                <!-- Participants + Blessed counters -->
                <div style="display:flex;align-items:center;gap:20px;margin-top:16px;flex-wrap:wrap;">
                    <!-- Online participants (left) -->
                    <div class="ps-participants" style="display: flex; align-items: center; gap: 8px;">
                        ${this.buildParticipantAvatars()}
                        <span style="font-size: 14px; font-weight: 500; letter-spacing: 0.05em;" id="${this.roomId}ParticipantCount">
                            ${participantText}
                        </span>
                    </div>
                    <!-- Blessed counter (right) -->
                    <div id="${this.roomId}BlessedCounter"
                         style="display:flex;align-items:center;gap:4px;opacity:0.85;">
                        <span style="font-size:12px;color:var(--text-muted);">Loading blessings…</span>
                    </div>
                </div>
            </div>
            
            <!-- Control Buttons -->
            <div style="display: flex; gap: 8px; position: relative; margin: 0; padding: 0; flex-wrap: wrap; justify-content: flex-end; align-items: center;">
                ${this.buildAdditionalHeaderButtons ? this.buildAdditionalHeaderButtons() : ''}
                ${this.buildSafetyDropdown()}
                <button class="ps-leave" onclick="window['${this.roomId}_gentlyLeave']()" 
                        style="margin: 0; padding: 10px 16px; white-space: nowrap;">
                    Gently Leave
                </button>
            </div>
        </header>`;
    }
    
    /**
     * Build safety dropdown component
     * @returns {string} Safety dropdown HTML
     */
    buildSafetyDropdown() {
        // Store bound methods for onclick handlers
        const toggleMethod = `${this.roomId}_toggleSafetyDropdown`;
        const showInstructionsMethod = `${this.roomId}_showInstructions`;
        window[toggleMethod] = (event) => this.toggleSafetyDropdown(event);
        window[showInstructionsMethod] = () => this.showInstructions();
        
        return `
        <div style="position: relative; margin: 0; padding: 0;" id="${this.roomId}SafetyDropdownContainer">
            <button class="ps-leave" 
                    onclick="${toggleMethod}(event)" 
                    style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); white-space: nowrap; padding: 10px 16px;">
                🛡️ Safety
                <span style="font-size: 12px;">▼</span>
            </button>
            <div id="${this.roomId}SafetyDropdown" 
                 style="display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); min-width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 100001;">
                <button onclick="${showInstructionsMethod}(); ${toggleMethod}(event);" 
                        style="width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 12px; color: var(--text);">
                    <span>📖</span> Instructions
                </button>
                <button onclick="CommunityModule.showReportModal(); ${toggleMethod}(event);" 
                        style="width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 12px; color: var(--text);">
                    <span>⚠️</span> Report Issue
                </button>
                <button onclick="CommunityModule.showBlockModal(); ${toggleMethod}(event);" 
                        style="width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 12px; color: var(--text);">
                    <span>🚫</span> Block User
                </button>
                <button onclick="CommunityModule.muteChat(); ${toggleMethod}(event);" 
                        style="width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; gap: 12px; color: var(--text);">
                    <span>🔇</span> Mute Chat
                </button>
                <button onclick="CommunityModule.showHelpModal(); ${toggleMethod}(event);" 
                        style="width: 100%; padding: 12px 16px; text-align: left; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 12px; color: var(--text);">
                    <span>🆘</span> Get Help
                </button>
            </div>
        </div>`;
    }
    
    /**
     * Build participant avatars
     * Renders placeholder initially; fetchRoomParticipants() replaces with real users.
     * @returns {string} Avatar HTML
     */
    buildParticipantAvatars() {
        const initials = this.config.name.split(' ').map(w => w[0]).slice(0, 2);
        return `
        <div class="participant-stack" id="${this.roomId}ParticipantStack">
            <div class="p-avatar" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">${initials[0] || 'P'}</div>
            <div class="p-avatar" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">${initials[1] || 'R'}</div>
        </div>`;
    }
    
    /**
     * Build main body content
     * MUST be overridden by child classes
     * @returns {string} Body HTML
     */
    buildBody() {
        return `
        <div class="ps-body">
            <main class="ps-main">
                <p>Override buildBody() method in your room class</p>
            </main>
        </div>`;
    }
    
    /**
     * Build instructions modal
     * Override this method to customize instructions
     * @returns {string} Modal HTML
     */
    buildInstructionsModal() {
        const instructions = this.getInstructions();
        const closeMethod = `${this.roomId}_closeInstructions`;
        window[closeMethod] = () => this.closeInstructions();
        
        return `
        <div class="modal-overlay" id="${this.roomId}InstructionsModal">
            <div class="modal-card">
                <button class="modal-close" onclick="${closeMethod}()">×</button>
                <div class="modal-content">
                    <h2 style="font-family: var(--serif); margin-top: 0;">📖 ${this.config.name}</h2>
                    ${instructions}
                    <button onclick="${closeMethod}()" 
                            style="width: 100%; padding: 12px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; margin-top: 16px;">
                        Close
                    </button>
                </div>
            </div>
        </div>`;
    }
    
    /**
     * Get instructions content
     * Override this method to provide custom instructions
     * @returns {string} Instructions HTML
     */
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
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENT HANDLING
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        setTimeout(() => {
            const handler = this.handleOutsideClick.bind(this);
            document.addEventListener('click', handler);
            this.eventListeners.push({
                element: document,
                event: 'click',
                handler: handler
            });
        }, 100);
    }
    
    /**
     * Handle clicks outside dropdowns
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
        const safetyDropdown = document.getElementById(`${this.roomId}SafetyDropdown`);
        const safetyContainer = document.getElementById(`${this.roomId}SafetyDropdownContainer`);
        
        if (safetyDropdown && safetyContainer && !safetyContainer.contains(e.target)) {
            safetyDropdown.style.display = 'none';
        }
        
        // Call custom outside click handler if defined
        if (this.onOutsideClick) this.onOutsideClick(e);
    }
    
    /**
     * Toggle safety dropdown visibility.
     * On mobile, renders as position:fixed using the button's screen coords
     * so overflow:hidden on ancestor containers cannot clip it.
     * @param {Event} event - Click event
     */
    toggleSafetyDropdown(event) {
        if (event) event.stopPropagation();
        const dropdown  = document.getElementById(`${this.roomId}SafetyDropdown`);
        const container = document.getElementById(`${this.roomId}SafetyDropdownContainer`);
        if (!dropdown) return;

        const isOpen = dropdown.style.display === 'block';

        if (isOpen) {
            dropdown.style.display = 'none';
            return;
        }

        // Position with fixed coords on all viewports so overflow:hidden never clips it
        if (container) {
            const rect = container.getBoundingClientRect();
            dropdown.style.position   = 'fixed';
            dropdown.style.top        = `${rect.bottom + 6}px`;
            dropdown.style.right      = `${window.innerWidth - rect.right}px`;
            dropdown.style.left       = 'auto';
            dropdown.style.zIndex     = '2147483640';
            dropdown.style.marginTop  = '0';
        }

        dropdown.style.display = 'block';
    }
    
    /**
     * Show instructions modal
     */
    showInstructions() {
        const dropdown = document.getElementById(`${this.roomId}SafetyDropdown`);
        if (dropdown) dropdown.style.display = 'none';
        
        const modal = document.getElementById(`${this.roomId}InstructionsModal`);
        if (modal) modal.classList.add('active');
    }
    
    /**
     * Close instructions modal
     */
    closeInstructions() {
        const modal = document.getElementById(`${this.roomId}InstructionsModal`);
        if (modal) modal.classList.remove('active');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // ROOM CARD MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Update room card on hub view
     */
    updateRoomCard() {
        const roomCard = document.querySelector(`[data-room-id="${this.roomId}"]`);
        if (!roomCard) return;
        
        const energySpan = roomCard.querySelector('.room-energy span');
        if (energySpan) {
            energySpan.textContent = this.getParticipantText();
        }
        
        // Update active state for timed rooms
        if (this.roomType === 'timed') {
            const canEnter       = this.canEnterRoom();
            const isVisuallyOpen = this._isWithinOpenWindow();
            roomCard.style.cursor  = canEnter ? 'pointer' : 'not-allowed';
            roomCard.style.opacity = isVisuallyOpen ? '1' : '0.55';
            roomCard.style.border  = `3px solid ${isVisuallyOpen ? '#22c55e' : '#ef4444'}`;
            roomCard.onclick       = canEnter ? () => this.enterRoom() : null;

            // Show/hide "In Session" overlay label
            let overlay = roomCard.querySelector('.in-session-label');
            if (!isVisuallyOpen) {
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'in-session-label';
                    overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;';
                    overlay.innerHTML = '<span style="background:rgba(239,68,68,0.85);color:white;font-size:11px;font-weight:700;letter-spacing:0.08em;padding:4px 10px;border-radius:4px;text-transform:uppercase;">In Session</span>';
                    roomCard.appendChild(overlay);
                }
            } else {
                if (overlay) overlay.remove();
            }

            // Update timer display if it exists
            const timerEl = roomCard.querySelector('.room-timer');
            if (timerEl && this.getTimerText) {
                timerEl.innerHTML = this.getTimerText();
            }
        } else {
            // Always-open rooms: always green
            roomCard.style.border = '3px solid #22c55e';
            roomCard.classList.add('active');
        }
        
        // Call custom update logic if defined
        if (this.onUpdateCard) this.onUpdateCard(roomCard);
    }
    
    /**
     * Generate room card HTML for hub view
     * @returns {string} Room card HTML
     */
    getRoomCardHTML() {
        const canEnter    = this.canEnterRoom();
        const isTimed     = this.roomType === 'timed';
        // Visual state is based on real session timing, regardless of admin access.
        // For timed rooms, check the actual cycle window (not admin bypass).
        const isVisuallyOpen = !isTimed || this._isWithinOpenWindow();
        const borderColor = isVisuallyOpen ? '#22c55e' : '#ef4444';
        const cursor      = canEnter ? 'pointer' : 'not-allowed';
        const opacity     = isVisuallyOpen ? '1' : '0.55';
        const methodName  = `${this.roomId}_enterRoom`;
        window[methodName] = () => this.enterRoom();
        const clickHandler = canEnter ? `onclick="${methodName}()"` : '';

        return `
        <div class="practice-room ${isVisuallyOpen ? 'active' : 'in-session'}"
             data-room-type="${this.roomType}"
             data-room-id="${this.roomId}"
             ${clickHandler}
             style="cursor: ${cursor};
                    border: 3px solid ${borderColor};
                    position: relative;
                    opacity: ${opacity};">

            ${this.getDevModeBadge()}

            ${!isVisuallyOpen && isTimed ? `
            <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;">
                <span style="background:rgba(239,68,68,0.85);color:white;font-size:11px;font-weight:700;letter-spacing:0.08em;padding:4px 10px;border-radius:4px;text-transform:uppercase;">In Session</span>
            </div>` : ''}

            <img src="${this.config.imageUrl}"
                 alt="${this.config.name}"
                 style="width: 100%; height: auto; display: block; margin-bottom: 12px;">

            <div class="room-desc" style="text-align: center; margin-bottom: 16px;">
                ${this.config.description}
            </div>

            ${this.buildCardFooter()}

            <!-- Bless button — bottom right, never triggers room entry -->
            <button id="${this.roomId}BlessBtn"
                    onclick="event.stopPropagation();${this.roomId}_blessRoom()"
                    title="Send a blessing to everyone inside"
                    style="position:absolute;bottom:10px;right:10px;
                           background:rgba(139,92,246,0.10);border:1px solid rgba(139,92,246,0.30);
                           border-radius:16px;padding:3px 10px;
                           font-size:11px;color:var(--text-muted);cursor:pointer;
                           display:flex;align-items:center;gap:4px;white-space:nowrap;
                           transition:all 0.2s;z-index:3;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;opacity:0.8;"><path d="M9 2C9 2 4 5 4 10C4 13.3 6.7 16 10 16L10.5 17H13.5L14 16C17.3 16 20 13.3 20 10C20 5 15 2 15 2C15 2 13.5 4 12 4C10.5 4 9 2 9 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10.5 17L9.5 20H14.5L13.5 17" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9.5 20H14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="10" r="2" stroke="currentColor" stroke-width="1.5"/></svg>
                Bless
            </button>
        </div>`;
    }

    buildCardFooter() {
        if (this.roomType === 'timed' && this.getTimerText) {
            // View Schedule link wired to showScheduleModal — bottom-left of footer
            const scheduleLink = this.showScheduleModal
                ? `<button onclick="event.stopPropagation();${this.getClassName()}.showScheduleModal()"
                           style="background:none;border:none;padding:0;font-size:11px;color:var(--text-muted);cursor:pointer;text-decoration:underline;text-align:left;">
                       📅 View Schedule
                   </button>`
                : '';
            return `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div class="room-participants" style="font-size: 12px; color: var(--text-muted);">
                    ${this.state.participants} present
                </div>
                <div class="room-timer" style="font-size: 11px; color: var(--text-muted); text-align: right; line-height: 1.4;">
                    ${this.getTimerText()}
                </div>
            </div>
            <div style="margin-top: 4px;">
                ${scheduleLink}
            </div>`;
        }

        return `
        <div style="text-align: left;">
            <span class="room-participants" style="font-size: 12px; color: var(--text-muted);">
                ${this.getParticipantText()}
            </span>
        </div>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Get class name for onclick handlers
     * @returns {string} Class name with window prefix
     */
    getClassName() {
        return 'window.' + this.constructor.name;
    }
    
    /**
     * Get participant count text
     * Override for custom text
     * @returns {string} Participant text
     */
    getParticipantText() {
        return `${this.state.participants} present`;
    }
    
    /**
     * Get header gradient style
     * Override for custom gradient
     * @returns {string} CSS gradient
     */
    getHeaderGradient() {
        return 'background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%);';
    }
    
    /**
     * Get dev mode badge if in dev mode
     * @returns {string} Badge HTML or empty string
     */
    getDevModeBadge() {
        return ''; // Admin mode is invisible — no badge shown
    }
    
    /**
     * Format time in MM:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Register an event listener for cleanup
     * @param {Element} element - DOM element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    registerEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }
    
    /**
     * Bind all methods to this instance
     * Called in constructor to enable onclick handlers to work
     * Walks the prototype chain to bind inherited methods from mixins
     */
    _bindAllMethods() {
        let proto = Object.getPrototypeOf(this);
        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                .filter(key => key !== 'constructor' && typeof this[key] === 'function')
                .forEach(key => {
                    this[key] = this[key].bind(this);
                });
            proto = Object.getPrototypeOf(proto);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// STATIC — SHARED HUB PRESENCE SUBSCRIPTION
// One subscription for all 8 room cards. Started when on the hub,
// stopped when entering a room.
// Call PracticeRoom.startHubPresence() from core.js after all rooms init.
// ═══════════════════════════════════════════════════════════════════════════

PracticeRoom._hubPresenceSub  = null;
PracticeRoom._hubRooms        = [];  // populated by startHubPresence()

/**
 * Register all room instances and start one shared presence subscription
 * that keeps all hub card counts live.
 * @param {Array} rooms - Array of PracticeRoom instances (optional — uses _hubRooms if omitted)
 */
PracticeRoom.startHubPresence = async function(rooms) {
    if (rooms) PracticeRoom._hubRooms = rooms;

    const allRooms = PracticeRoom._hubRooms;
    if (!allRooms.length) return;

    if (!window.CommunityDB?.ready) {
        const _interval = setInterval(() => {
            if (!window.CommunityDB?.ready) return;
            clearInterval(_interval);
            PracticeRoom.startHubPresence();
        }, 500);
        return;
    }

    // Stop any existing sub first
    PracticeRoom.stopHubPresence();

    const _refreshAll = async () => {
        // Fetch all presence rows once, then distribute counts per room
        const allPresence = await CommunityDB.getActiveMembers();
        allRooms.forEach(room => {
            const count = allPresence.filter(p => p.room_id === room.roomId).length;
            room.state.participants = count;
            room._updateRoomCardCount(count);
        });
    };

    await _refreshAll();

    PracticeRoom._hubPresenceSub = CommunityDB.subscribeToPresence(_refreshAll);
    console.log('[PracticeRoom] Shared hub presence subscription started');
};

/**
 * Stop the shared hub presence subscription.
 * Called before entering any room.
 */
PracticeRoom.stopHubPresence = function() {
    if (PracticeRoom._hubPresenceSub) {
        try { PracticeRoom._hubPresenceSub.unsubscribe(); } catch(e) {}
        PracticeRoom._hubPresenceSub = null;
        console.log('[PracticeRoom] Shared hub presence subscription stopped');
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.PracticeRoom = PracticeRoom;

/**
 * Global helper: opens MemberProfileModal and ensures its overlay z-index
 * is above the fullscreen practice room container (z-index:9999 in index.html).
 * Used by all participant lists and chat message names inside practice rooms.
 * @param {string} userId
 */
window.openMemberProfileAboveRoom = function(userId) {
    if (!window.MemberProfileModal || !userId) return;
    MemberProfileModal.open(userId);
    // After the modal renders (next frame), patch its overlay z-index
    requestAnimationFrame(() => {
        // MemberProfileModal typically appends an overlay to <body>.
        // Try common class/id patterns; adjust if your implementation differs.
        const candidates = [
            document.getElementById('memberProfileModal'),
            document.getElementById('memberProfileOverlay'),
            document.querySelector('.member-profile-overlay'),
            document.querySelector('.member-profile-modal'),
            document.querySelector('[class*="member"][class*="modal"]'),
            document.querySelector('[id*="memberProfile"]'),
        ];
        candidates.forEach(el => {
            if (el) el.style.zIndex = '200000';
        });
    });
};
