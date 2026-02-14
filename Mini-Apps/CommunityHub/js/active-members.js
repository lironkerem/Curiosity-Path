/**
 * ACTIVE MEMBERS MODULE
 * 
 * Displays currently active/online community members:
 * - Member avatars with status indicators
 * - Current activity status
 * - Click to view member profiles
 * - Dynamic online count
 * 
 * @version 1.0.0
 */

const ActiveMembers = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        isRendered: false
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        STATUS_TYPES: {
            online: 'online',
            away: 'away',
            offline: 'offline'
        }
    },

    // ============================================================================
    // DATA
    // ============================================================================
    
    /**
     * Get sample active members data
     * @returns {Array} Array of member objects
     */
    getMembersData() {
        return [
            {
                id: 1,
                name: 'Sarah',
                avatar: 'S',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                status: 'online',
                activity: '🧘 In practice'
            },
            {
                id: 2,
                name: 'Michael',
                avatar: 'M',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                status: 'online',
                activity: '🎯 Deep work'
            },
            {
                id: 3,
                name: 'Emma',
                avatar: 'E',
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                status: 'online',
                activity: '💨 Breathwork'
            },
            {
                id: 4,
                name: 'David',
                avatar: 'D',
                gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                status: 'online',
                activity: '✨ Available'
            },
            {
                id: 5,
                name: 'Laura',
                avatar: 'L',
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                status: 'away',
                activity: '🌙 Resting'
            },
            {
                id: 6,
                name: 'James',
                avatar: 'J',
                gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                status: 'online',
                activity: '📖 Journaling'
            }
        ];
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for active members section
     * @returns {string} HTML string
     */
    getHTML() {
        const members = this.getMembersData();
        const onlineCount = members.filter(m => m.status === 'online').length;

        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Active Members</div>
                <div style="font-size: 12px; color: var(--text-muted);">${onlineCount} online</div>
            </div>
            <div class="active-members-grid">
                ${members.map(member => this.getMemberCardHTML(member)).join('')}
            </div>
        </section>
        `;
    },

    /**
     * Generate HTML for a single member card
     * @param {Object} member - Member data object
     * @returns {string} HTML string
     */
    getMemberCardHTML(member) {
        if (!member) return '';

        return `
            <div class="member-card-mini" 
                 onclick="ActiveMembers.handleViewMember(${member.id})"
                 data-member-id="${member.id}"
                 role="button"
                 tabindex="0"
                 aria-label="View ${this.escapeHtml(member.name)}'s profile">
                <div class="member-mini-avatar" 
                     style="background: ${member.gradient};"
                     aria-hidden="true">
                    ${this.escapeHtml(member.avatar)}
                </div>
                <div class="member-mini-status ${member.status}" 
                     aria-label="${member.status}"
                     title="${this.capitalizeFirst(member.status)}">
                </div>
                <div class="member-mini-name">${this.escapeHtml(member.name)}</div>
                <div class="member-mini-info">${this.escapeHtml(member.activity)}</div>
            </div>
        `;
    },

    // ============================================================================
    // RENDERING
    // ============================================================================
    
    /**
     * Render active members into container
     */
    render() {
        const container = document.getElementById('activeMembersContainer');
        if (!container) {
            console.warn('activeMembersContainer not found - skipping active members render');
            return;
        }

        try {
            container.innerHTML = this.getHTML();
            this.state.isRendered = true;
            console.log('✓ Active Members rendered');
        } catch (error) {
            console.error('Active Members render error:', error);
        }
    },

    // ============================================================================
    // INTERACTIONS
    // ============================================================================
    
    /**
     * Handle view member action
     * @param {number} memberId - Member ID
     */
    handleViewMember(memberId) {
        if (typeof memberId !== 'number') {
            console.error('Invalid member ID:', memberId);
            return;
        }

        try {
            // Delegate to CommunityModule if available
            if (window.CommunityModule && typeof window.CommunityModule.viewMember === 'function') {
                window.CommunityModule.viewMember(memberId);
            }
            // Fallback to Community if available
            else if (window.Community && typeof window.Community.viewMember === 'function') {
                window.Community.viewMember(memberId);
            }
            // Direct fallback
            else {
                this.viewMember(memberId);
            }
        } catch (error) {
            console.error('View member error:', error);
        }
    },

    /**
     * View member implementation (fallback)
     * @param {number} memberId - Member ID
     */
    viewMember(memberId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Member profiles coming soon');
        }
        
        console.log('View member:', memberId);
        
        // TODO: Open member profile modal
        // const member = this.getMembersData().find(m => m.id === memberId);
        // if (member) {
        //     this.openMemberProfile(member);
        // }
    },

    // ============================================================================
    // UPDATES
    // ============================================================================
    
    /**
     * Update a member's status
     * @param {number} memberId - Member ID
     * @param {string} status - New status (online, away, offline)
     */
    updateMemberStatus(memberId, status) {
        if (!this.config.STATUS_TYPES[status]) {
            console.error('Invalid status:', status);
            return;
        }

        try {
            const memberCard = document.querySelector(`[data-member-id="${memberId}"]`);
            if (!memberCard) {
                console.warn(`Member card not found: ${memberId}`);
                return;
            }

            const statusIndicator = memberCard.querySelector('.member-mini-status');
            if (statusIndicator) {
                // Remove all status classes
                Object.values(this.config.STATUS_TYPES).forEach(s => {
                    statusIndicator.classList.remove(s);
                });
                
                // Add new status class
                statusIndicator.classList.add(status);
                statusIndicator.setAttribute('aria-label', status);
                statusIndicator.setAttribute('title', this.capitalizeFirst(status));
            }
            
            console.log(`Member ${memberId} status updated to ${status}`);
            
        } catch (error) {
            console.error('Update member status error:', error);
        }
    },

    /**
     * Update a member's activity
     * @param {number} memberId - Member ID
     * @param {string} activity - New activity text
     */
    updateMemberActivity(memberId, activity) {
        if (!activity || typeof activity !== 'string') {
            console.error('Invalid activity:', activity);
            return;
        }

        try {
            const memberCard = document.querySelector(`[data-member-id="${memberId}"]`);
            if (!memberCard) {
                console.warn(`Member card not found: ${memberId}`);
                return;
            }

            const activityElement = memberCard.querySelector('.member-mini-info');
            if (activityElement) {
                activityElement.textContent = activity;
            }
            
            console.log(`Member ${memberId} activity updated to ${activity}`);
            
        } catch (error) {
            console.error('Update member activity error:', error);
        }
    },

    /**
     * Refresh the active members display
     */
    refresh() {
        try {
            this.render();
            console.log('✓ Active Members refreshed');
        } catch (error) {
            console.error('Active Members refresh error:', error);
        }
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
    },

    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalizeFirst(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Get online member count
     * @returns {number} Number of online members
     */
    getOnlineCount() {
        return this.getMembersData().filter(m => m.status === 'online').length;
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-render when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ActiveMembers.render());
} else {
    // DOM already loaded
    ActiveMembers.render();
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.ActiveMembers = ActiveMembers;
