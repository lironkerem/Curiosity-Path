/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRACTICE ROOM BASE CLASS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class PracticeRoom
 * @description Base class for all practice rooms with shared functionality
 * @version 3.0.0
 * 
 * Features:
 * - Room lifecycle management
 * - Standard UI components (header, safety dropdown, modals)
 * - Event handling
 * - Room card generation
 * - Template system for customization
 * 
 * Dependencies:
 * - Core (navigation, toast notifications)
 * - SafetyBar (safety modals)
 * - CommunityModule (safety actions)
 * - Rituals (closing ceremony)
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
            statusRingColor: config.statusRingColor || 'var(--season-accent)',
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
     * Enter the practice room
     * Creates view and navigates to it
     */
    enterRoom() {
        // Check if entry is allowed (for timed rooms)
        if (!this.canEnterRoom()) {
            Core.showToast('Session in progress. Please wait for the next opening.');
            return;
        }
        
        this.createPracticeView();
        Core.navigateTo(`${this.roomId}View`);
        Core.showToast(`${this.config.icon} Entered ${this.config.name}`);
        
        this.setupEventListeners();
        
        // Call custom entry logic if defined
        if (this.onEnter) this.onEnter();
    }
    
    /**
     * Leave the practice room
     * Cleanup and navigate back to hub
     */
    leaveRoom() {
        this.cleanup();
        Core.navigateTo('hubView');
        Core.showToast(`Left ${this.config.name}`);
        
        // Call custom leave logic if defined
        if (this.onLeave) this.onLeave();
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
    // UI CREATION METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    /**
     * Create the practice view DOM
     * Injects the full room interface
     */
    createPracticeView() {
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
    
    /**
     * Build header component
     * @returns {string} Header HTML
     */
    buildHeader() {
        const participantText = this.getParticipantText();
        const gradientStyle = this.getHeaderGradient();
        
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
                <button class="ps-leave" onclick="Rituals.showClosing()" 
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
                 style="display: none; position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); min-width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 1000;">
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
     * Override this method to customize avatars
     * @returns {string} Avatar HTML
     */
    buildParticipantAvatars() {
        const initials = this.config.name.split(' ').map(w => w[0]).slice(0, 2);
        return `
        <div class="participant-stack">
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
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.PracticeRoom = PracticeRoom;
