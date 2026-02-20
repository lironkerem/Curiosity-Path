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

        // Call custom initialization if defined
        if (this.onInit) this.onInit();
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
    }
    
    /**
     * Leave the practice room.
     * Cleanup and navigate back to hub.
     * PATCHED: Resets Supabase presence back to hub / available.
     */
    leaveRoom() {
        this._clearRoomPresence();

        // Unsubscribe from room-level presence subscriptions
        for (const sub of ['_presenceSub', '_sidebarPresenceSub']) {
            if (this[sub]) {
                try { this[sub].unsubscribe(); } catch(e) {}
                this[sub] = null;
            }
        }

        this.cleanup();
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

        // Unsubscribe from room-level presence subscriptions
        for (const sub of ['_presenceSub', '_sidebarPresenceSub']) {
            if (this[sub]) {
                try { this[sub].unsubscribe(); } catch(e) {}
                this[sub] = null;
            }
        }

        this.cleanup();
        if (this.onLeave) this.onLeave();

        // Restart shared hub subscription now that we're back on the hub
        PracticeRoom.startHubPresence();

        // Closing ritual
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
                : `<span style="color:white;font-weight:600;">${emoji || initial}</span>`;
            const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
            return `
            <div class="campfire-participant">
                <div class="campfire-participant-avatar" style="${bg}display:flex;align-items:center;justify-content:center;">${inner}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${name}</div>
                    <div class="campfire-participant-country">${p.activity || '✨ Available'}</div>
                </div>
            </div>`;
        }).join('');
    }

    /**
     * Update the participant count on the hub room card (without re-render).
     * @param {number} count
     */
    _updateRoomCardCount(count) {
        const card = document.querySelector(`[data-room-id="${this.roomId}"]`);
        if (!card) return;
        const el = card.querySelector('.room-participants');
        if (el) el.textContent = `${count} present`;
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
        <header class="ps-header" style="padding: 12px 16px; ${gradientStyle}">
            <div class="ps-info" style="display: flex; flex-direction: column; align-items: flex-start; width: 100%;">
                <!-- Room Image -->
                <div style="width: 100%; display: flex; justify-content: flex-start; margin: 0; padding: 0;">
                    <img src="${this.config.imageUrl}" 
                         alt="${this.config.name}" 
                         style="max-width: 600px; width: 100%; height: auto; margin: 0; padding: 0; display: block;">
                </div>
                
                <!-- Participants Count -->
                <div class="ps-participants" style="display: flex; align-items: center; gap: 8px; justify-content: center; margin-top: 16px;">
                    ${this.buildParticipantAvatars()}
                    <span style="font-size: 14px; font-weight: 500; letter-spacing: 0.05em;" id="${this.roomId}ParticipantCount">
                        ${participantText}
                    </span>
                </div>
            </div>
            
            <!-- Control Buttons -->
            <div style="display: flex; gap: 12px; position: relative; margin: 0; padding: 0; flex-wrap: nowrap;">
                ${this.buildAdditionalHeaderButtons ? this.buildAdditionalHeaderButtons() : ''}
                ${this.buildSafetyDropdown()}
                <button class="ps-leave" onclick="window['${this.roomId}_gentlyLeave']()" 
                        style="margin: 0; padding: 12px 24px; white-space: nowrap; min-width: 150px;">
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
                    style="display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); white-space: nowrap; min-width: 120px; padding: 12px 24px;">
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
     * Toggle safety dropdown visibility
     * @param {Event} event - Click event
     */
    toggleSafetyDropdown(event) {
        if (event) event.stopPropagation();
        const dropdown = document.getElementById(`${this.roomId}SafetyDropdown`);
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
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
            const isOpen = this.canEnterRoom();
            roomCard.style.cursor = isOpen ? 'pointer' : 'not-allowed';
            roomCard.style.opacity = isOpen ? '1' : '0.6';
            roomCard.style.border = `3px solid ${isOpen ? '#22c55e' : '#ef4444'}`;
            roomCard.onclick = isOpen ? () => this.enterRoom() : null;
            
            // Update timer display if it exists
            const timerEl = roomCard.querySelector('.room-timer');
            if (timerEl && this.getTimerText) {
                timerEl.innerHTML = this.getTimerText();
            }
        } else {
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
        const isOpen = this.canEnterRoom();
        const borderColor = isOpen ? '#22c55e' : '#ef4444';
        const cursor = isOpen ? 'pointer' : 'not-allowed';
        const opacity = isOpen ? '1' : '0.6';
        // Store bound method on window for onclick access
        const methodName = `${this.roomId}_enterRoom`;
        window[methodName] = () => this.enterRoom();
        const clickHandler = isOpen ? `onclick="${methodName}()"` : '';
        
        return `
        <div class="practice-room ${isOpen ? 'active' : 'in-session'}" 
             data-room-type="${this.roomType}" 
             data-room-id="${this.roomId}"
             ${clickHandler}
             style="cursor: ${cursor}; 
                    border: 3px solid ${borderColor}; 
                    position: relative;
                    opacity: ${opacity};">
            
            ${this.getDevModeBadge()}
            
            <img src="${this.config.imageUrl}" 
                 alt="${this.config.name}" 
                 style="width: 100%; height: auto; display: block; margin-bottom: 12px;">
            
            <div class="room-desc" style="text-align: center; margin-bottom: 16px;">
                ${this.config.description}
            </div>
            
            ${this.buildCardFooter()}
        </div>`;
    }
    
    /**
     * Build room card footer
     * Override for custom footer content
     * @returns {string} Footer HTML
     */
    buildCardFooter() {
        if (this.roomType === 'timed' && this.getTimerText) {
            return `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div class="room-participants" style="font-size: 12px; color: var(--text-muted);">
                    ${this.state.participants} present
                </div>
                <div class="room-timer" style="font-size: 11px; color: var(--text-muted); text-align: right; line-height: 1.4;">
                    ${this.getTimerText()}
                </div>
            </div>
            ${this.buildScheduleLink ? this.buildScheduleLink() : ''}`;
        }
        
        return `
        <div style="text-align: left;">
            <span style="font-size: 12px; color: var(--text-muted);">
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
        if (this.devMode) {
            return '<span style="position: absolute; top: 8px; right: 8px; background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">DEV MODE</span>';
        }
        return '';
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
