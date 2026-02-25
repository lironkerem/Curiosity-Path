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
        <div class="modal-card" style="max-width: 500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('crisis')" aria-label="Close crisis resources">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">🆘 Crisis Resources</h2>
                
                <div style="line-height: 1.8; color: var(--text); font-size: 14px;">
                    <p style="margin-bottom: 20px;"><strong>If you're in crisis, please reach out immediately.</strong></p>
                    
                    <div style="background: #fee; border-left: 4px solid #c33; padding: 16px; margin-bottom: 20px; border-radius: var(--radius-md);">
                        <strong>🚨 Emergency:</strong> Call 911 (US) or your local emergency number
                    </div>

                    <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px;">24/7 Hotlines:</h3>
                    <ul style="padding-left: 20px;">
                        <li style="margin-bottom: 12px;"><strong>National Suicide Prevention Lifeline:</strong><br>988 or 1-800-273-8255</li>
                        <li style="margin-bottom: 12px;"><strong>Crisis Text Line:</strong><br>Text HOME to 741741</li>
                        <li style="margin-bottom: 12px;"><strong>SAMHSA National Helpline:</strong><br>1-800-662-4357</li>
                    </ul>
                </div>

                <button onclick="SafetyBar.closeModal('crisis')" 
                        style="width: 100%; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px; margin-top: 16px;">
                    Close
                </button>
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
        <div class="modal-card" style="max-width: 500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('report')" aria-label="Close report modal">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">⚠️ Report Issue</h2>
                
                <div style="margin-bottom: 20px;">
                    <label for="reportReason" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">What happened?</label>
                    <select id="reportReason" style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                        <option value="">Select a reason...</option>
                        <option value="harassment">Harassment or bullying</option>
                        <option value="spam">Spam or advertising</option>
                        <option value="inappropriate">Inappropriate content</option>
                        <option value="safety">Safety concern</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="reportDetails" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Details (optional)</label>
                    <textarea id="reportDetails" 
                              placeholder="Please provide any additional context..." 
                              style="width: 100%; min-height: 100px; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px; resize: vertical;">
                    </textarea>
                </div>

                <div style="padding: 16px; background: var(--season-mood); border-radius: var(--radius-md); margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                    Reports are reviewed within 24 hours. Serious violations are addressed immediately.
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="SafetyBar.closeModal('report')" 
                            style="flex: 1; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitReport()" 
                            style="flex: 1; padding: 12px 24px; border: none; background: var(--text); color: var(--season-mood); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Submit Report
                    </button>
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
        <div class="modal-card" style="max-width: 450px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('block')" aria-label="Close block modal">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">🚫 Block User</h2>
                
                <p style="margin-bottom: 20px; line-height: 1.6;">Blocked users won't be able to see your messages or interact with you.</p>

                <div style="margin-bottom: 20px;">
                    <label for="blockUsername" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Username to block</label>
                    <input type="text" 
                           id="blockUsername" 
                           placeholder="Enter username..." 
                           style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                </div>

                <div style="padding: 16px; background: var(--season-mood); border-radius: var(--radius-md); margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                    <strong>Note:</strong> You can unblock users anytime from your settings.
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="SafetyBar.closeModal('block')" 
                            style="flex: 1; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.confirmBlock()" 
                            style="flex: 1; padding: 12px 24px; border: none; background: var(--text); color: var(--season-mood); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Block User
                    </button>
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
        <div class="modal-card" style="max-width: 500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('help')" aria-label="Close help modal">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">💬 Get Help</h2>
                
                <div style="line-height: 1.6; font-size: 14px;">
                    <p style="margin-bottom: 16px;">Choose the support you need:</p>
                    
                    <button onclick="SafetyBar.showCrisisResources()" 
                            style="width: 100%; padding: 16px; margin-bottom: 12px; text-align: left; background: #fee; border: 2px solid #c33; border-radius: var(--radius-md); cursor: pointer; font-size: 14px;">
                        <strong>🆘 Crisis Resources</strong><br>
                        <span style="font-size: 12px; color: #666;">24/7 hotlines and emergency support</span>
                    </button>

                    <div style="margin-bottom: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); overflow: hidden;">
                        <button onclick="SafetyBar.toggleHelpMePanel()"
                                style="width: 100%; padding: 16px; text-align: left; background: var(--surface); border: none; cursor: pointer; font-size: 14px;">
                            <strong>🆘 Help Me</strong><br>
                            <span style="font-size: 12px; color: var(--text-muted);">Send a quick message directly to the admin</span>
                        </button>
                        <div id="helpMePanel" style="display:none; padding: 12px 16px 16px; background: var(--surface); border-top: 1px solid var(--border);">
                            <textarea id="helpMeText"
                                      placeholder="What's happening? We're here..."
                                      rows="3"
                                      style="width:100%;padding:10px;border-radius:8px;border:1px solid var(--border);
                                             background:var(--season-mood);font-size:13px;resize:none;
                                             box-sizing:border-box;margin-bottom:10px;"></textarea>
                            <button onclick="SafetyBar.submitHelpMe()"
                                    style="width:100%;padding:10px;border:none;border-radius:8px;cursor:pointer;
                                           font-size:13px;font-weight:700;
                                           background:var(--text);color:var(--season-mood);">
                                Send to Admin
                            </button>
                        </div>
                    </div>

                    <button onclick="SafetyBar.showTechnicalSupport()" 
                            style="width: 100%; padding: 16px; margin-bottom: 12px; text-align: left; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; font-size: 14px;">
                        <strong>🔧 Technical Issue</strong><br>
                        <span style="font-size: 12px; color: var(--text-muted);">Report bugs or problems</span>
                    </button>

                    <button onclick="SafetyBar.showGuidelines()" 
                            style="width: 100%; padding: 16px; text-align: left; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-md); cursor: pointer; font-size: 14px;">
                        <strong>📜 Community Guidelines</strong><br>
                        <span style="font-size: 12px; color: var(--text-muted);">Learn about our values and rules</span>
                    </button>
                </div>

                <button onclick="SafetyBar.closeModal('help')" 
                        style="width: 100%; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px; margin-top: 16px;">
                    Close
                </button>
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
        <div class="modal-card" style="max-width: 500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('moderator')" aria-label="Close moderator contact">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">👥 Contact Moderator</h2>
                
                <div style="margin-bottom: 20px;">
                    <label for="moderatorUrgency" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Urgency Level</label>
                    <select id="moderatorUrgency" style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Needs attention</option>
                        <option value="high">High - Urgent matter</option>
                        <option value="immediate">Immediate - Safety concern</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="moderatorMessage" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">How can we help?</label>
                    <textarea id="moderatorMessage" 
                              placeholder="Describe your situation..." 
                              style="width: 100%; min-height: 120px; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px; resize: vertical;">
                    </textarea>
                </div>

                <div style="padding: 16px; background: var(--season-mood); border-radius: var(--radius-md); margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
                    <strong>Available 24/7</strong> - A moderator will respond based on your urgency level. For immediate safety concerns, select "Immediate" above.
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="SafetyBar.closeModal('moderator')" 
                            style="flex: 1; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitModeratorRequest()" 
                            style="flex: 1; padding: 12px 24px; border: none; background: var(--text); color: var(--season-mood); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Send Request
                    </button>
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
        <div class="modal-card" style="max-width: 500px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('technical')" aria-label="Close technical issue modal">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">🔧 Report Technical Issue</h2>
                
                <div style="margin-bottom: 20px;">
                    <label for="technicalType" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Issue Type</label>
                    <select id="technicalType" style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                        <option value="">Select issue type...</option>
                        <option value="audio">Audio/Sound not working</option>
                        <option value="timer">Timer malfunction</option>
                        <option value="chat">Chat issues</option>
                        <option value="connection">Connection problems</option>
                        <option value="display">Display/Visual issues</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="technicalDescription" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Description</label>
                    <textarea id="technicalDescription" 
                              placeholder="What happened? What were you trying to do?" 
                              style="width: 100%; min-height: 100px; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px; resize: vertical;">
                    </textarea>
                </div>

                <div style="margin-bottom: 20px;">
                    <label for="technicalDevice" style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Browser & Device</label>
                    <input type="text" 
                           id="technicalDevice" 
                           placeholder="e.g., Chrome on Mac, Firefox on Windows" 
                           style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                </div>

                <div style="display: flex; gap: 12px;">
                    <button onclick="SafetyBar.closeModal('technical')" 
                            style="flex: 1; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Cancel
                    </button>
                    <button onclick="SafetyBar.submitTechnicalIssue()" 
                            style="flex: 1; padding: 12px 24px; border: none; background: var(--text); color: var(--season-mood); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        Submit Issue
                    </button>
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
        <div class="modal-card" style="max-width: 600px;">
            <button class="modal-close" onclick="SafetyBar.closeModal('guidelines')" aria-label="Close guidelines">×</button>
            <div class="modal-content" style="text-align: left;">
                <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 20px; text-align: center;">📜 Community Guidelines</h2>
                
                <div style="line-height: 1.8; color: var(--text); font-size: 14px;">
                    <p style="margin-bottom: 20px;"><strong>Welcome to our mindful community.</strong> These guidelines help us create a safe, supportive space for everyone.</p>
                    
                    <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px;">✨ Our Core Values</h3>
                    <ul style="padding-left: 20px;">
                        <li style="margin-bottom: 8px;"><strong>Kindness:</strong> Treat all members with compassion and respect</li>
                        <li style="margin-bottom: 8px;"><strong>Presence:</strong> Be fully here, authentic and engaged</li>
                        <li style="margin-bottom: 8px;"><strong>Non-judgment:</strong> Honor each person's unique journey</li>
                        <li style="margin-bottom: 8px;"><strong>Confidentiality:</strong> What's shared in spaces stays in spaces</li>
                    </ul>

                    <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🕊️ Expected Behavior</h3>
                    <ul style="padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Use respectful, inclusive language</li>
                        <li style="margin-bottom: 8px;">Honor the intention of each space (silence in silent rooms)</li>
                        <li style="margin-bottom: 8px;">Support others without giving unsolicited advice</li>
                        <li style="margin-bottom: 8px;">Respect boundaries and consent</li>
                        <li style="margin-bottom: 8px;">Report concerns to moderators</li>
                    </ul>

                    <h3 style="font-size: 16px; margin-top: 20px; margin-bottom: 10px;">🚫 Not Permitted</h3>
                    <ul style="padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Harassment, bullying, or hate speech</li>
                        <li style="margin-bottom: 8px;">Spam or commercial solicitation</li>
                        <li style="margin-bottom: 8px;">Sharing others' personal information</li>
                        <li style="margin-bottom: 8px;">Impersonation or deception</li>
                        <li style="margin-bottom: 8px;">Inappropriate or explicit content</li>
                    </ul>

                    <p style="margin-top: 20px; padding: 16px; background: var(--season-mood); border-radius: var(--radius-md); font-size: 13px;">
                        <strong>Questions?</strong> Contact our moderators anytime. Violations may result in warnings, temporary suspension, or permanent removal.
                    </p>
                </div>

                <button onclick="SafetyBar.closeModal('guidelines')" 
                        style="width: 100%; padding: 12px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px; margin-top: 16px;">
                    Close
                </button>
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
