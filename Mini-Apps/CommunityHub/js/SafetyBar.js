/**
 * SAFETYBAR.JS - Community Safety & Support System
 * 
 * Provides reusable safety modals and controls for all practice rooms.
 * Used by: Silent, Breathwork, DeepWork, Guided, OSHO, Campfire, and other rooms.
 * 
 * Features:
 * - Crisis resources with hotline information
 * - User reporting and blocking functionality
 * - Moderator contact system
 * - Technical issue reporting
 * - Community guidelines display
 * 
 * @version 1.2.0 — PATCHED:
 *   - Added openModal() public method with re-injection guard fix
 *   - injectModals() resets stale guard when modals are missing from DOM
 *   - Added CommunityModule shim so dropdown items correctly open modals
 */

const SafetyBar = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        modalsInjected: false
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize SafetyBar module
     */
    init() {
        console.log('🛡️ SafetyBar Module Loaded');
    },

    /**
     * Inject all safety modals into the DOM
     * Call this once when a room is created
     * Prevents duplicate modal injection
     */
    injectModals() {
        // If guard says injected but the modal is gone (e.g. dynamicContent was wiped),
        // reset so we re-inject correctly.
        if (this.state.modalsInjected && !document.getElementById('reportModal')) {
            this.state.modalsInjected = false;
        }

        // Prevent duplicate injection
        if (this.state.modalsInjected || document.getElementById('reportModal')) {
            return;
        }

        try {
            const modalsHTML = this.getAllModalsHTML();
            document.body.insertAdjacentHTML('beforeend', modalsHTML);
            this.state.modalsInjected = true;
            console.log('✓ SafetyBar modals injected');
        } catch (error) {
            console.error('Failed to inject SafetyBar modals:', error);
        }
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for all safety modals
     * @returns {string} Complete HTML for all modals
     */
    getAllModalsHTML() {
        return `
            ${this.getCrisisModalHTML()}
            ${this.getReportModalHTML()}
            ${this.getBlockModalHTML()}
            ${this.getHelpModalHTML()}
            ${this.getModeratorModalHTML()}
            ${this.getTechnicalModalHTML()}
            ${this.getGuidelinesModalHTML()}
        `;
    },

    /**
     * Generate Crisis Resources Modal HTML
     * @returns {string} Modal HTML
     */
    getCrisisModalHTML() {
        return `
    <!-- Crisis Resources Modal -->
    <div class="modal-overlay" id="crisisModal" onclick="SafetyBar.handleOverlayClick(event, 'crisis')">
        <div class="modal-card modal-card--md">
            <button class="modal-close" onclick="SafetyBar.closeModal('crisis')" aria-label="Close crisis resources">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">🆘 Crisis Resources</h2>
                <div class="sb-modal-body">
                    <p class="sb-form-group"><strong>If you're in crisis, please reach out immediately.</strong></p>
                    <div class="sb-emergency-alert">
                        <strong>🚨 Emergency:</strong> Call 911 (US) or your local emergency number
                    </div>
                    <h3 class="sb-section-h3">24/7 Hotlines:</h3>
                    <ul class="sb-list">
                        <li class="sb-list-item--wide"><strong>National Suicide Prevention Lifeline:</strong><br>988 or 1-800-273-8255</li>
                        <li class="sb-list-item--wide"><strong>Crisis Text Line:</strong><br>Text HOME to 741741</li>
                        <li class="sb-list-item--wide"><strong>SAMHSA National Helpline:</strong><br>1-800-662-4357</li>
                    </ul>
                </div>
                <button onclick="SafetyBar.closeModal('crisis')" class="sb-btn-close">Close</button>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Report Space Modal HTML
     * @returns {string} Modal HTML
     */
    getReportModalHTML() {
        return `
    <!-- Report Space Modal -->
    <div class="modal-overlay" id="reportModal" onclick="SafetyBar.handleOverlayClick(event, 'report')">
        <div class="modal-card modal-card--md">
            <button class="modal-close" onclick="SafetyBar.closeModal('report')" aria-label="Close report modal">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">⚠️ Report Issue</h2>
                <div class="sb-form-group">
                    <label for="reportReason" class="sb-label">What happened?</label>
                    <select id="reportReason" class="sb-field">
                        <option value="">Select a reason...</option>
                        <option value="harassment">Harassment or bullying</option>
                        <option value="spam">Spam or advertising</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="safety">Safety concern</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="sb-form-group">
                    <label for="reportDetails" class="sb-label">Details (optional)</label>
                    <textarea id="reportDetails"
                              placeholder="Please provide any additional context..."
                              class="sb-field sb-field--textarea">
                    </textarea>
                </div>
                <div class="sb-note">
                    Reports are reviewed within 24 hours. Serious violations are addressed immediately.
                </div>
                <div class="sb-btn-row">
                    <button onclick="SafetyBar.closeModal('report')" class="sb-btn-cancel">Cancel</button>
                    <button onclick="SafetyBar.submitReport()" class="sb-btn-primary">Submit Report</button>
                </div>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Block User Modal HTML
     * @returns {string} Modal HTML
     */
    getBlockModalHTML() {
        return `
    <!-- Block User Modal -->
    <div class="modal-overlay" id="blockModal" onclick="SafetyBar.handleOverlayClick(event, 'block')">
        <div class="modal-card modal-card--sm">
            <button class="modal-close" onclick="SafetyBar.closeModal('block')" aria-label="Close block modal">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">🚫 Block User</h2>
                <p class="sb-form-group sb-body-text">Blocked users won't be able to see your messages or interact with you.</p>
                <div class="sb-form-group">
                    <label for="blockUsername" class="sb-label">Username to block</label>
                    <input type="text"
                           id="blockUsername"
                           placeholder="Enter username..."
                           class="sb-field">
                </div>
                <div class="sb-note">
                    <strong>Note:</strong> You can unblock users anytime from your settings.
                </div>
                <div class="sb-btn-row">
                    <button onclick="SafetyBar.closeModal('block')" class="sb-btn-cancel">Cancel</button>
                    <button onclick="SafetyBar.confirmBlock()" class="sb-btn-primary">Block User</button>
                </div>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Help Modal HTML
     * @returns {string} Modal HTML
     */
    getHelpModalHTML() {
        return `
    <!-- Help Modal -->
    <div class="modal-overlay" id="helpModal" onclick="SafetyBar.handleOverlayClick(event, 'help')">
        <div class="modal-card modal-card--md">
            <button class="modal-close" onclick="SafetyBar.closeModal('help')" aria-label="Close help modal">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">💬 Get Help</h2>
                <div class="sb-modal-body">
                    <p class="sb-help-intro">Choose the support you need:</p>
                    <button onclick="SafetyBar.showCrisisResources()" class="sb-help-btn-crisis">
                        <strong>🆘 Crisis Resources</strong><br>
                        <span class="sb-help-subtitle--crisis">24/7 hotlines and emergency support</span>
                    </button>
                    <div class="sb-help-panel-wrap">
                        <button onclick="SafetyBar.toggleHelpMePanel()" class="sb-help-toggle-btn">
                            <strong>🆘 Help Me</strong><br>
                            <span class="sb-help-subtitle">Send a quick message directly to the admin</span>
                        </button>
                        <div id="helpMePanel" class="sb-help-panel" style="display:none;">
                            <textarea id="helpMeText"
                                      placeholder="What's happening? We're here..."
                                      rows="3"
                                      class="sb-help-textarea"></textarea>
                            <button onclick="SafetyBar.submitHelpMe()" class="sb-help-send-btn">
                                Send to Admin
                            </button>
                        </div>
                    </div>
                    <button onclick="SafetyBar.showTechnicalSupport()" class="sb-help-btn">
                        <strong>🔧 Technical Issue</strong><br>
                        <span class="sb-help-subtitle">Report bugs or problems</span>
                    </button>
                    <button onclick="SafetyBar.showGuidelines()" class="sb-help-btn">
                        <strong>📜 Community Guidelines</strong><br>
                        <span class="sb-help-subtitle">Learn about our values and rules</span>
                    </button>
                </div>
                <button onclick="SafetyBar.closeModal('help')" class="sb-btn-close">Close</button>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Moderator Contact Modal HTML
     * @returns {string} Modal HTML
     */
    getModeratorModalHTML() {
        return `
    <!-- Moderator Contact Modal -->
    <div class="modal-overlay" id="moderatorModal" onclick="SafetyBar.handleOverlayClick(event, 'moderator')">
        <div class="modal-card modal-card--md">
            <button class="modal-close" onclick="SafetyBar.closeModal('moderator')" aria-label="Close moderator contact">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">👥 Contact Moderator</h2>
                <div class="sb-form-group">
                    <label for="moderatorUrgency" class="sb-label">Urgency Level</label>
                    <select id="moderatorUrgency" class="sb-field">
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent matter</option>
                        <option value="immediate">Immediate - Safety concern</option>
                    </select>
                </div>
                <div class="sb-form-group">
                    <label for="moderatorMessage" class="sb-label">How can we help?</label>
                    <textarea id="moderatorMessage"
                              placeholder="Describe your situation..."
                              class="sb-field sb-field--textarea sb-field--tall">
                    </textarea>
                </div>
                <div class="sb-note">
                    <strong>Available 24/7</strong> - A moderator will respond based on your urgency level. For immediate safety concerns, select "Immediate" above.
                </div>
                <div class="sb-btn-row">
                    <button onclick="SafetyBar.closeModal('moderator')" class="sb-btn-cancel">Cancel</button>
                    <button onclick="SafetyBar.submitModeratorRequest()" class="sb-btn-primary">Send Request</button>
                </div>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Technical Issue Modal HTML
     * @returns {string} Modal HTML
     */
    getTechnicalModalHTML() {
        return `
    <!-- Technical Issue Modal -->
    <div class="modal-overlay" id="technicalModal" onclick="SafetyBar.handleOverlayClick(event, 'technical')">
        <div class="modal-card modal-card--md">
            <button class="modal-close" onclick="SafetyBar.closeModal('technical')" aria-label="Close technical issue modal">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">🔧 Report Technical Issue</h2>
                <div class="sb-form-group">
                    <label for="technicalType" class="sb-label">Issue Type</label>
                    <select id="technicalType" class="sb-field">
                        <option value="">Select issue type...</option>
                        <option value="audio">Audio/Sound not working</option>
                        <option value="timer">Timer malfunction</option>
                        <option value="chat">Chat issues</option>
                        <option value="connection">Connection problems</option>
                        <option value="display">Display/Visual issues</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="sb-form-group">
                    <label for="technicalDescription" class="sb-label">Description</label>
                    <textarea id="technicalDescription"
                              placeholder="What happened? What were you trying to do?"
                              class="sb-field sb-field--textarea">
                    </textarea>
                </div>
                <div class="sb-form-group">
                    <label for="technicalDevice" class="sb-label">Browser & Device</label>
                    <input type="text"
                           id="technicalDevice"
                           placeholder="e.g., Chrome on Mac, Firefox on Windows"
                           class="sb-field">
                </div>
                <div class="sb-btn-row">
                    <button onclick="SafetyBar.closeModal('technical')" class="sb-btn-cancel">Cancel</button>
                    <button onclick="SafetyBar.submitTechnicalIssue()" class="sb-btn-primary">Submit Issue</button>
                </div>
            </div>
        </div>
    </div>
        `;
    },

    /**
     * Generate Community Guidelines Modal HTML
     * @returns {string} Modal HTML
     */
    getGuidelinesModalHTML() {
        return `
    <!-- Community Guidelines Modal -->
    <div class="modal-overlay" id="guidelinesModal" onclick="SafetyBar.handleOverlayClick(event, 'guidelines')">
        <div class="modal-card modal-card--lg">
            <button class="modal-close" onclick="SafetyBar.closeModal('guidelines')" aria-label="Close guidelines">×</button>
            <div class="modal-content modal-content--left">
                <h2 class="sb-modal-h2">📜 Community Guidelines</h2>
                <div class="sb-modal-body">
                    <p class="sb-form-group"><strong>Welcome to our mindful community.</strong> These guidelines help us create a safe, supportive space for everyone.</p>
                    <h3 class="sb-section-h3">✨ Our Core Values</h3>
                    <ul class="sb-list">
                        <li class="sb-list-item"><strong>Kindness:</strong> Treat all members with compassion and respect</li>
                        <li class="sb-list-item"><strong>Presence:</strong> Be fully here, authentic and engaged</li>
                        <li class="sb-list-item"><strong>Non-judgment:</strong> Honor each person's unique journey</li>
                        <li class="sb-list-item"><strong>Confidentiality:</strong> What's shared in spaces stays in spaces</li>
                    </ul>
                    <h3 class="sb-section-h3">🕊️ Expected Behavior</h3>
                    <ul class="sb-list">
                        <li class="sb-list-item">Use respectful, inclusive language</li>
                        <li class="sb-list-item">Honor the intention of each space (silence in silent rooms)</li>
                        <li class="sb-list-item">Support others without giving unsolicited advice</li>
                        <li class="sb-list-item">Respect boundaries and consent</li>
                        <li class="sb-list-item">Report concerns to moderators</li>
                    </ul>
                    <h3 class="sb-section-h3">🚫 Not Permitted</h3>
                    <ul class="sb-list">
                        <li class="sb-list-item">Harassment, bullying, or hate speech</li>
                        <li class="sb-list-item">Spam or commercial solicitation</li>
                        <li class="sb-list-item">Sharing others' personal information</li>
                        <li class="sb-list-item">Impersonation or deception</li>
                        <li class="sb-list-item">Inappropriate or explicit content</li>
                    </ul>
                    <p class="sb-guidelines-note">
                        <strong>Questions?</strong> Contact our moderators anytime. Violations may result in warnings, temporary suspension, or permanent removal.
                    </p>
                </div>
                <button onclick="SafetyBar.closeModal('guidelines')" class="sb-btn-close">Close</button>
            </div>
        </div>
    </div>
        `;
    },

    // ============================================================================
    // MODAL CONTROLS
    // ============================================================================
    
    /**
     * Handle overlay click to close modal
     * @param {Event} event - Click event
     * @param {string} type - Modal type
     */
    handleOverlayClick(event, type) {
        if (event.target === event.currentTarget) {
            this.closeModal(type);
        }
    },

    /**
     * Open a specific modal by type.
     * Ensures modals are injected (handles re-injection after DOM wipe).
     * @param {string} type - Modal type (crisis, report, block, help, moderator, technical, guidelines)
     */
    openModal(type) {
        this.injectModals();
        const modal = document.getElementById(`${type}Modal`);
        if (modal) {
            modal.classList.add('active');
        } else {
            console.warn(`[SafetyBar] openModal: #${type}Modal not found`);
        }
    },

    /**
     * Close a specific modal
     * @param {string} type - Modal type (crisis, report, block, etc.)
     */
    closeModal(type) {
        const modalId = `${type}Modal`;
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.remove('active');
        }

        // Delegate to Community module if available
        if (window.Community) {
            const methodName = `close${this.capitalize(type)}Modal`;
            if (typeof window.Community[methodName] === 'function') {
                window.Community[methodName]();
            }
        }
    },

    /**
     * Show crisis resources modal
     */
    showCrisisResources() {
        this.closeModal('help');
        if (window.Community && typeof window.Community.showCrisisModal === 'function') {
            window.Community.showCrisisModal();
        }
    },

    /**
     * Show moderator contact modal
     */
    showModeratorContact() {
        this.closeModal('help');
        if (window.Community && typeof window.Community.showModeratorModal === 'function') {
            window.Community.showModeratorModal();
        }
    },

    /**
     * Show technical support modal
     */
    showTechnicalSupport() {
        this.closeModal('help');
        if (window.Community && typeof window.Community.showTechnicalModal === 'function') {
            window.Community.showTechnicalModal();
        }
    },

    /**
     * Show community guidelines modal
     */
    showGuidelines() {
        this.closeModal('help');
        if (window.Community && typeof window.Community.showGuidelinesModal === 'function') {
            window.Community.showGuidelinesModal();
        }
    },

    // ============================================================================
    // FORM SUBMISSIONS
    // ============================================================================
    
    /**
     * Submit a report — delegates to Community module AND notifies admins
     */
    async submitReport() {
        const reason  = document.getElementById('reportReason')?.value;
        const details = document.getElementById('reportDetails')?.value?.trim();

        if (!reason) { Core.showToast('Please select a reason'); return; }

        // Delegate to Community module for existing DB report logic
        if (window.Community && typeof window.Community.submitReport === 'function') {
            window.Community.submitReport();
        }

        // Also write to admin_notifications + push notify
        try {
            await SafetyBar._writeAdminNotification('report', {
                reason,
                details,
                room: SafetyBar._getCurrentRoom(),
            });
            await SafetyBar._pushAdmins('⚠️ New Report', `${SafetyBar._senderName()} reported: ${reason}${details ? ' — ' + details.substring(0, 60) : ''}`);
        } catch (err) {
            console.error('submitReport admin notify error:', err);
        }
    },

    /**
     * Confirm block user action
     */
    confirmBlock() {
        if (window.Community && typeof window.Community.confirmBlock === 'function') {
            window.Community.confirmBlock();
        } else {
            console.error('Community.confirmBlock not available');
        }
    },

    /**
     * Toggle the Help Me inline panel
     */
    toggleHelpMePanel() {
        const panel = document.getElementById('helpMePanel');
        if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    },

    /**
     * Submit a Help Me request — writes to admin_notifications + push notifies admins
     */
    async submitHelpMe() {
        const text = document.getElementById('helpMeText')?.value?.trim();
        if (!text) { Core.showToast('Please write a short message'); return; }

        const btn = document.querySelector('#helpMePanel button');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

        try {
            await SafetyBar._writeAdminNotification('help', {
                message: text,
                room: SafetyBar._getCurrentRoom(),
            });
            await SafetyBar._pushAdmins('🆘 Help Request', `${SafetyBar._senderName()} needs help: "${text.substring(0, 80)}"`);
            Core.showToast('✓ Your message was sent to the admin');
            document.getElementById('helpMeText').value = '';
            document.getElementById('helpMePanel').style.display = 'none';
            SafetyBar.closeModal('help');
        } catch (err) {
            console.error('submitHelpMe error:', err);
            Core.showToast('❌ Could not send — please try again');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Send to Admin'; }
        }
    },

    /**
     * Submit technical issue — delegates to Community module AND notifies admins
     */
    async submitTechnicalIssue() {
        const type        = document.getElementById('technicalType')?.value;
        const description = document.getElementById('technicalDescription')?.value?.trim();
        const device      = document.getElementById('technicalDevice')?.value?.trim();

        // Delegate to Community module if available
        if (window.Community && typeof window.Community.submitTechnicalIssue === 'function') {
            window.Community.submitTechnicalIssue();
        }

        // Also write to admin_notifications + push notify
        try {
            await SafetyBar._writeAdminNotification('technical', {
                issueType:   type,
                description,
                device,
                room: SafetyBar._getCurrentRoom(),
            });
            await SafetyBar._pushAdmins('🔧 Technical Issue', `${SafetyBar._senderName()}: ${type || 'issue'}${description ? ' — ' + description.substring(0, 60) : ''}`);
        } catch (err) {
            console.error('submitTechnicalIssue admin notify error:', err);
        }
    },

    // ============================================================================
    // ADMIN NOTIFICATION HELPERS
    // ============================================================================

    /**
     * Write a notification record to admin_notifications table
     */
    async _writeAdminNotification(type, payload) {
        if (!window.CommunityDB?.ready) return;
        const { error } = await CommunityDB._sb
            .from('admin_notifications')
            .insert({
                type,
                from_user_id: CommunityDB.userId || null,
                payload: {
                    ...payload,
                    sender_name: SafetyBar._senderName(),
                    timestamp:   new Date().toISOString(),
                },
            });
        if (error) console.error('[SafetyBar] _writeAdminNotification:', error.message);
    },

    /**
     * Push notify all admin users
     */
    async _pushAdmins(title, body) {
        if (!window.CommunityDB?.ready) return;
        try {
            // Get all admin user IDs
            const { data: admins } = await CommunityDB._sb
                .from('profiles')
                .select('id')
                .eq('is_admin', true);

            if (!admins?.length) return;

            // Get push subscriptions for all admins
            const adminIds = admins.map(a => a.id);
            const { data: subs } = await CommunityDB._sb
                .from('push_subscriptions')
                .select('subscription')
                .in('user_id', adminIds);

            if (!subs?.length) return;

            await Promise.allSettled(subs.map(s =>
                fetch('/api/send', {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({
                        sub:     s.subscription,
                        payload: { title, body, icon: '/icons/icon-192x192.png', data: { url: '/' } }
                    })
                }).catch(() => {})
            ));
        } catch (err) {
            console.error('[SafetyBar] _pushAdmins error:', err);
        }
    },

    /**
     * Get current room name from URL or active room state
     */
    _getCurrentRoom() {
        // Try to get from active practice room
        const roomTitle = document.querySelector('.room-title, .room-name-inline, #roomTitle');
        if (roomTitle) return roomTitle.textContent?.trim() || 'Unknown Room';
        return 'Community Hub';
    },

    /**
     * Get sender display name
     */
    _senderName() {
        return window.Core?.state?.currentUser?.name || 'A member';
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.SafetyBar = SafetyBar;

// ============================================================================
// COMMUNITYMODULE SHIM
// ============================================================================
// PracticeRoom.buildSafetyDropdown() calls CommunityModule.showReportModal()
// etc., but those methods either don't exist or don't trigger SafetyBar modals
// (which require classList.add('active')). This shim wires every dropdown call
// to SafetyBar.openModal(). Existing CommunityModule methods are never replaced.

(function () {
    const shim = {
        showReportModal:     () => SafetyBar.openModal('report'),
        showBlockModal:      () => SafetyBar.openModal('block'),
        showHelpModal:       () => SafetyBar.openModal('help'),
        showCrisisModal:     () => SafetyBar.openModal('crisis'),
        showModeratorModal:  () => SafetyBar.openModal('moderator'),
        showTechnicalModal:  () => SafetyBar.openModal('technical'),
        showGuidelinesModal: () => SafetyBar.openModal('guidelines'),
        muteChat:            () => window.Core?.showToast?.('Chat muted'),
        closeReportModal:     () => SafetyBar.closeModal('report'),
        closeBlockModal:      () => SafetyBar.closeModal('block'),
        closeHelpModal:       () => SafetyBar.closeModal('help'),
        closeCrisisModal:     () => SafetyBar.closeModal('crisis'),
        closeModeratorModal:  () => SafetyBar.closeModal('moderator'),
        closeTechnicalModal:  () => SafetyBar.closeModal('technical'),
        closeGuidelinesModal: () => SafetyBar.closeModal('guidelines'),
    };

    if (window.CommunityModule) {
        Object.keys(shim).forEach(method => {
            if (typeof window.CommunityModule[method] !== 'function') {
                window.CommunityModule[method] = shim[method];
            }
        });
        console.log('🛡️ SafetyBar: patched missing methods on CommunityModule');
    } else {
        window.CommunityModule = shim;
        console.log('🛡️ SafetyBar: CommunityModule created as safety shim');
    }
})();
