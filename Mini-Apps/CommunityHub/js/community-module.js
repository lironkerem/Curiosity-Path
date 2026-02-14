/**
 * COMMUNITY MODULE
 * 
 * Manages community features and interactions:
 * - Community reflections feed
 * - Collective waves/events
 * - Active members display
 * - Safety and moderation tools
 * - Modal management for help, reporting, guidelines
 * 
 * @version 1.0.0
 */

const CommunityModule = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        isInitialized: false,
        appreciatedReflections: new Set() // Track user's appreciations
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        MIN_REFLECTION_LENGTH: 1,
        MAX_REFLECTION_LENGTH: 500,
        MIN_REPORT_LENGTH: 10,
        MIN_MODERATOR_MESSAGE_LENGTH: 10,
        MIN_TECHNICAL_DESCRIPTION_LENGTH: 10
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize the community module
     */
    init() {
        if (this.state.isInitialized) {
            console.warn('CommunityModule already initialized');
            return;
        }

        try {
            console.log('👥 Community Module Loaded');
            
            this.renderReflectionsHTML();
            this.renderReflections();
            this.renderWaves();
            this.renderMembers();
            
            this.state.isInitialized = true;
            console.log('✓ CommunityModule initialized');
            
        } catch (error) {
            console.error('CommunityModule initialization failed:', error);
        }
    },

    // ============================================================================
    // REFLECTIONS - HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for community reflections section
     * @returns {string} HTML string
     */
    getReflectionsHTML() {
        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Community Reflections</div>
                <div style="font-size: 12px; color: var(--text-muted);">Shared wisdom & moments</div>
            </div>
            <div class="reflection-card">
                <div class="ref-header">
                    <div class="ref-avatar" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">S</div>
                    <div class="ref-info">
                        <div class="ref-author" onclick="CommunityModule.viewMember(1)" style="cursor: pointer;">Sarah Chen</div>
                        <div class="ref-time">Earlier today</div>
                    </div>
                </div>
                <div class="ref-content">Sitting with discomfort today. Noticed how quickly the mind wants to escape into distraction. Returning to breath, again and again.</div>
                <div class="ref-actions">
                    <button class="ref-action" onclick="CommunityModule.appreciate(this, 1)">
                        <span>🙏</span> 
                        <span>Appreciate (3)</span>
                    </button>
                    <button class="ref-action" onclick="CommunityModule.whisper(1)">
                        <span>💬</span> 
                        <span>Whisper</span>
                    </button>
                </div>
            </div>
        </section>
        `;
    },

    /**
     * Render reflections HTML template into container
     */
    renderReflectionsHTML() {
        const container = document.getElementById('communityReflectionsContainer');
        if (!container) {
            console.warn('communityReflectionsContainer not found - skipping reflections render');
            return;
        }

        try {
            container.innerHTML = this.getReflectionsHTML();
            console.log('✓ Reflections HTML rendered');
        } catch (error) {
            console.error('Reflections HTML render error:', error);
        }
    },

    // ============================================================================
    // REFLECTIONS - DATA & INTERACTIONS
    // ============================================================================
    
    /**
     * Render reflections feed with data
     */
    renderReflections() {
        const container = document.getElementById('reflectionsContainer');
        if (!container) {
            console.warn('reflectionsContainer not found');
            return;
        }

        try {
            const reflections = this.getReflectionsData();
            
            container.innerHTML = reflections.map(ref => 
                this.getReflectionHTML(ref)
            ).join('');
            
            console.log(`✓ Rendered ${reflections.length} reflections`);
            
        } catch (error) {
            console.error('Reflections render error:', error);
        }
    },

    /**
     * Get sample reflections data
     * @returns {Array} Array of reflection objects
     */
    getReflectionsData() {
        return [
            {
                id: 1,
                author: 'Sarah Chen',
                avatar: 'S',
                avatarGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                time: '2 hours ago',
                content: 'Today I noticed how much easier it is to return to my breath when I practice with others. The collective energy is real.',
                appreciations: 12
            },
            {
                id: 2,
                author: 'Michael Ross',
                avatar: 'M',
                avatarGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                time: '5 hours ago',
                content: 'Grateful for this space. Three months of daily practice and I finally understand what "just sit" means.',
                appreciations: 8
            },
            {
                id: 3,
                author: 'Emma Liu',
                avatar: 'E',
                avatarGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                time: '1 day ago',
                content: 'The morning silence circle changed my entire day. Held space with 6 others and the peace lingered for hours.',
                appreciations: 15
            }
        ];
    },

    /**
     * Generate HTML for a single reflection
     * @param {Object} ref - Reflection data object
     * @returns {string} HTML string
     */
    getReflectionHTML(ref) {
        return `
            <div class="reflection" data-reflection-id="${ref.id}">
                <div class="ref-header">
                    <div class="ref-avatar" 
                         style="background: ${ref.avatarGradient}; cursor: pointer;" 
                         onclick="CommunityModule.viewMember(${ref.id})">
                        ${this.escapeHtml(ref.avatar)}
                    </div>
                    <div class="ref-meta">
                        <div class="ref-author" 
                             style="cursor: pointer;" 
                             onclick="CommunityModule.viewMember(${ref.id})">
                            ${this.escapeHtml(ref.author)}
                        </div>
                        <div class="ref-time">${this.escapeHtml(ref.time)}</div>
                    </div>
                </div>
                <div class="ref-content">${this.escapeHtml(ref.content)}</div>
                <div class="ref-actions">
                    <button class="ref-action" onclick="CommunityModule.appreciate(this, ${ref.id})">
                        <span>🙏</span>
                        <span>Appreciate (${ref.appreciations})</span>
                    </button>
                    <button class="ref-action" onclick="CommunityModule.whisper(${ref.id})">
                        <span>💬</span>
                        <span>Whisper</span>
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Share a new reflection
     */
    shareReflection() {
        const input = document.getElementById('reflectionInput');
        if (!input) {
            console.warn('reflectionInput not found');
            return;
        }
        
        try {
            const text = input.value.trim();
            
            // Validate input
            if (!this.validateReflection(text)) {
                return;
            }

            const container = document.getElementById('reflectionsContainer');
            if (!container) return;

            // Create new reflection element
            const div = document.createElement('div');
            div.className = 'reflection';
            div.innerHTML = this.getNewReflectionHTML(text);

            container.insertBefore(div, container.firstChild);
            
            // Reset input
            input.value = '';
            const counter = document.getElementById('charCount');
            if (counter) counter.textContent = '0';
            
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Reflection shared');
            }

            // TODO: Save to backend
            // if (window.SupabaseClient) {
            //     SupabaseClient.createReflection(text);
            // }
            
        } catch (error) {
            console.error('Share reflection error:', error);
        }
    },

    /**
     * Validate reflection input
     * @param {string} text - Reflection text
     * @returns {boolean} True if valid
     */
    validateReflection(text) {
        if (!text || text.length < this.config.MIN_REFLECTION_LENGTH) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Please write something first');
            }
            return false;
        }

        if (text.length > this.config.MAX_REFLECTION_LENGTH) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast(`Reflection too long (max ${this.config.MAX_REFLECTION_LENGTH} characters)`);
            }
            return false;
        }

        return true;
    },

    /**
     * Generate HTML for new user reflection
     * @param {string} text - Reflection content
     * @returns {string} HTML string
     */
    getNewReflectionHTML(text) {
        const user = window.Core?.state?.currentUser || {};
        const avatar = user.avatar || 'U';
        const name = user.name || 'Anonymous';
        const gradient = window.Core && typeof window.Core.getAvatarGradient === 'function' 
            ? window.Core.getAvatarGradient(name) 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        return `
            <div class="ref-header">
                <div class="ref-avatar" style="background: ${gradient};">${this.escapeHtml(avatar)}</div>
                <div class="ref-meta">
                    <div class="ref-author">${this.escapeHtml(name)}</div>
                    <div class="ref-time">Just now</div>
                </div>
            </div>
            <div class="ref-content">${this.escapeHtml(text)}</div>
            <div class="ref-actions">
                <button class="ref-action" onclick="CommunityModule.appreciate(this, 0)">
                    <span>🙏</span>
                    <span>Appreciate (0)</span>
                </button>
                <button class="ref-action" onclick="CommunityModule.whisper(0)">
                    <span>💬</span>
                    <span>Whisper</span>
                </button>
            </div>
        `;
    },

    /**
     * Appreciate/like a reflection
     * @param {HTMLElement} btn - Button element
     * @param {number} reflectionId - Reflection ID
     */
    appreciate(btn, reflectionId) {
        if (!btn) return;

        try {
            // Handle event delegation
            if (btn.target) {
                btn = btn.target.closest('.ref-action');
            }

            if (!btn) return;

            const isAppreciated = btn.classList.contains('active');
            btn.classList.toggle('active');
            
            // Update count
            const span = btn.querySelector('span:last-child');
            if (span) {
                const match = span.textContent.match(/\d+/);
                const count = match ? parseInt(match[0]) : 0;
                const newCount = isAppreciated ? count - 1 : count + 1;
                span.textContent = `Appreciate (${Math.max(0, newCount)})`;
            }

            // Track appreciation
            if (isAppreciated) {
                this.state.appreciatedReflections.delete(reflectionId);
            } else {
                this.state.appreciatedReflections.add(reflectionId);
            }

            // TODO: Save to backend
            // if (window.SupabaseClient && !isAppreciated) {
            //     SupabaseClient.appreciateReflection(reflectionId);
            // }
            
        } catch (error) {
            console.error('Appreciate error:', error);
        }
    },

    /**
     * Send whisper/DM (placeholder)
     * @param {number} reflectionId - Reflection ID
     */
    whisper(reflectionId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Whisper feature coming soon');
        }
        // TODO: Open DM modal
        console.log('Whisper to reflection:', reflectionId);
    },

    // ============================================================================
    // COLLECTIVE WAVES
    // ============================================================================
    
    /**
     * Render collective waves section
     */
    renderWaves() {
        const container = document.getElementById('wavesContainer');
        if (!container) {
            console.warn('wavesContainer not found');
            return;
        }

        try {
            const waves = this.getWavesData();
            
            container.innerHTML = waves.map(wave => 
                this.getWaveHTML(wave)
            ).join('');
            
            console.log(`✓ Rendered ${waves.length} waves`);
            
        } catch (error) {
            console.error('Waves render error:', error);
        }
    },

    /**
     * Get sample waves data
     * @returns {Array} Array of wave objects
     */
    getWavesData() {
        return [
            {
                id: 1,
                title: 'Evening Wind Down',
                time: 'Tonight at 8:00 PM',
                participants: 42,
                progress: 67
            },
            {
                id: 2,
                title: 'Sunday Morning Stillness',
                time: 'Tomorrow at 7:00 AM',
                participants: 28,
                progress: 45
            }
        ];
    },

    /**
     * Generate HTML for a wave card
     * @param {Object} wave - Wave data object
     * @returns {string} HTML string
     */
    getWaveHTML(wave) {
        return `
            <div class="wave-card" data-wave-id="${wave.id}">
                <div class="wave-header">
                    <div>
                        <div class="wave-title">${this.escapeHtml(wave.title)}</div>
                        <div class="wave-meta">${this.escapeHtml(wave.time)} • ${wave.participants} joined</div>
                    </div>
                </div>
                <div class="prog-bar">
                    <div class="prog-fill" style="width: ${Math.min(100, Math.max(0, wave.progress))}%"></div>
                </div>
                <button class="contrib-btn" onclick="CommunityModule.contributeWave(${wave.id})">
                    Contribute 20 Minutes
                </button>
            </div>
        `;
    },

    /**
     * Contribute time to a wave
     * @param {number} waveId - Wave ID
     */
    contributeWave(waveId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Contribution recorded! Start your practice.');
        }
        // TODO: Record contribution
        console.log('Contribute to wave:', waveId);
    },

    // ============================================================================
    // MEMBERS
    // ============================================================================
    
    /**
     * Render active members section
     */
    renderMembers() {
        const container = document.getElementById('activeMembersContainer');
        if (!container) {
            console.warn('activeMembersContainer not found');
            return;
        }

        try {
            // Placeholder - actual rendering might be in active-members.js
            console.log('✓ Members render initiated');
        } catch (error) {
            console.error('Members render error:', error);
        }
    },

    /**
     * View member profile (placeholder)
     * @param {number} memberId - Member ID
     */
    viewMember(memberId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Member profiles coming soon');
        }
        console.log('View member:', memberId);
    },

    // ============================================================================
    // SAFETY & MODERATION - MODALS
    // ============================================================================
    
    /**
     * Show crisis resources modal
     */
    showCrisisModal() {
        this.openModal('crisisModal');
    },

    closeCrisisModal() {
        this.closeModal('crisisModal');
    },

    /**
     * Show report modal
     */
    showReportModal() {
        this.openModal('reportModal');
    },

    closeReportModal() {
        this.closeModal('reportModal');
    },

    /**
     * Submit a report
     */
    submitReport() {
        const reason = document.getElementById('reportReason')?.value;
        const details = document.getElementById('reportDetails')?.value || '';

        if (!reason) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Please select a reason');
            }
            return;
        }

        const report = {
            reason,
            details: details.trim(),
            user_id: window.Core?.state?.currentUser?.id,
            timestamp: new Date().toISOString()
        };

        console.log('Report submitted:', report);

        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('✓ Report submitted. Thank you.');
        }

        this.closeReportModal();

        // Clear form
        const reasonEl = document.getElementById('reportReason');
        const detailsEl = document.getElementById('reportDetails');
        if (reasonEl) reasonEl.value = '';
        if (detailsEl) detailsEl.value = '';

        // TODO: Save to backend
        // if (window.SupabaseClient) {
        //     SupabaseClient.submitReport(report);
        // }
    },

    /**
     * Show block user modal
     */
    showBlockModal() {
        this.openModal('blockModal');
    },

    closeBlockModal() {
        this.closeModal('blockModal');
        const input = document.getElementById('blockUsername');
        if (input) input.value = '';
    },

    /**
     * Confirm block user action
     */
    confirmBlock() {
        const usernameEl = document.getElementById('blockUsername');
        if (!usernameEl) return;

        const username = usernameEl.value.trim();

        if (!username) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Please enter a username');
            }
            return;
        }

        const blockData = {
            blocker_id: window.Core?.state?.currentUser?.id,
            blocked_username: username,
            timestamp: new Date().toISOString()
        };

        console.log('User blocked:', blockData);

        // Hide messages from this user in current session
        this.hideMessagesFromUser(username);

        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast(`✓ ${username} has been blocked`);
        }

        this.closeBlockModal();

        // TODO: Save to backend
        // if (window.SupabaseClient) {
        //     SupabaseClient.blockUser(blockData);
        // }
    },

    /**
     * Hide messages from a specific user
     * @param {string} username - Username to hide
     */
    hideMessagesFromUser(username) {
        try {
            const chatMessages = document.querySelectorAll('.chat-msg');
            chatMessages.forEach(msg => {
                const authorEl = msg.querySelector('div');
                if (authorEl && authorEl.textContent.includes(username)) {
                    msg.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Hide messages error:', error);
        }
    },

    /**
     * Show help modal
     */
    showHelpModal() {
        this.openModal('helpModal');
    },

    closeHelpModal() {
        this.closeModal('helpModal');
    },

    needHelp() {
        this.showHelpModal();
    },

    /**
     * Show moderator contact modal
     */
    showModeratorModal() {
        this.closeHelpModal();
        this.openModal('moderatorModal');
    },

    closeModeratorModal() {
        this.closeModal('moderatorModal');
        
        // Clear form
        const urgencyEl = document.getElementById('moderatorUrgency');
        const messageEl = document.getElementById('moderatorMessage');
        if (urgencyEl) urgencyEl.value = 'low';
        if (messageEl) messageEl.value = '';
    },

    contactModerator() {
        this.showModeratorModal();
    },

    /**
     * Submit moderator contact request
     */
    submitModeratorRequest() {
        const urgency = document.getElementById('moderatorUrgency')?.value;
        const message = document.getElementById('moderatorMessage')?.value?.trim();

        if (!message || message.length < this.config.MIN_MODERATOR_MESSAGE_LENGTH) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast(`Please describe your situation (at least ${this.config.MIN_MODERATOR_MESSAGE_LENGTH} characters)`);
            }
            return;
        }

        const request = {
            urgency: urgency || 'low',
            message,
            user_id: window.Core?.state?.currentUser?.id,
            timestamp: new Date().toISOString()
        };

        console.log('Moderator request:', request);

        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('✓ Request sent. A moderator will reach out shortly.');
        }

        this.closeModeratorModal();

        // TODO: Save to backend
        // if (window.SupabaseClient) {
        //     SupabaseClient.contactModerator(request);
        // }
    },

    /**
     * Show technical issue modal
     */
    showTechnicalModal() {
        this.closeHelpModal();
        this.openModal('technicalModal');
    },

    closeTechnicalModal() {
        this.closeModal('technicalModal');
        
        // Clear form
        const typeEl = document.getElementById('technicalType');
        const descEl = document.getElementById('technicalDescription');
        const deviceEl = document.getElementById('technicalDevice');
        if (typeEl) typeEl.value = '';
        if (descEl) descEl.value = '';
        if (deviceEl) deviceEl.value = '';
    },

    reportTechnicalIssue() {
        this.showTechnicalModal();
    },

    /**
     * Submit technical issue
     */
    submitTechnicalIssue() {
        const type = document.getElementById('technicalType')?.value;
        const description = document.getElementById('technicalDescription')?.value?.trim();
        const device = document.getElementById('technicalDevice')?.value?.trim();

        if (!type) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast('Please select an issue type');
            }
            return;
        }

        if (!description || description.length < this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH) {
            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast(`Please provide more details (at least ${this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH} characters)`);
            }
            return;
        }

        const issue = {
            type,
            description,
            device: device || 'Not specified',
            user_id: window.Core?.state?.currentUser?.id,
            timestamp: new Date().toISOString()
        };

        console.log('Technical issue:', issue);

        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('✓ Issue reported. Our tech team will investigate.');
        }

        this.closeTechnicalModal();

        // TODO: Save to backend
        // if (window.SupabaseClient) {
        //     SupabaseClient.reportTechnicalIssue(issue);
        // }
    },

    /**
     * Show community guidelines modal
     */
    showGuidelinesModal() {
        this.closeHelpModal();
        this.openModal('guidelinesModal');
    },

    closeGuidelinesModal() {
        this.closeModal('guidelinesModal');
    },

    viewGuidelines() {
        this.showGuidelinesModal();
    },

    // ============================================================================
    // MODAL UTILITIES
    // ============================================================================
    
    /**
     * Open a modal by ID
     * @param {string} modalId - Modal element ID
     */
    openModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            } else {
                console.warn(`Modal not found: ${modalId}`);
            }
        } catch (error) {
            console.error('Open modal error:', error);
        }
    },

    /**
     * Close a modal by ID
     * @param {string} modalId - Modal element ID
     */
    closeModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        } catch (error) {
            console.error('Close modal error:', error);
        }
    },

    // ============================================================================
    // CHAT & INTERACTION
    // ============================================================================
    
    /**
     * Mute/unmute chat
     */
    muteChat() {
        const sidebar = document.getElementById('psSidebar');
        if (!sidebar) return;

        try {
            const isMuted = sidebar.classList.contains('muted');
            sidebar.classList.toggle('muted');

            const message = isMuted 
                ? '🔊 Chat unmuted' 
                : '🔇 Chat muted - you won\'t see new messages';

            if (window.Core && typeof window.Core.showToast === 'function') {
                window.Core.showToast(message);
            }

            // Close chat if it's open and being muted
            if (!isMuted && sidebar.classList.contains('open')) {
                if (window.Practice && typeof window.Practice.toggleChat === 'function') {
                    window.Practice.toggleChat();
                }
            }
            
        } catch (error) {
            console.error('Mute chat error:', error);
        }
    },

    // ============================================================================
    // EVENTS
    // ============================================================================
    
    /**
     * Register for an event
     * @param {number} eventId - Event ID
     */
    registerEvent(eventId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Registration confirmed! Check your email.');
        }
        // TODO: Handle event registration
        console.log('Register for event:', eventId);
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CommunityModule.init());
} else {
    // DOM already loaded
    CommunityModule.init();
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.CommunityModule = CommunityModule;
