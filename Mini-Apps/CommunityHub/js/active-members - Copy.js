/**
 * ACTIVE MEMBERS MODULE
 * PATCHED: Real presence data from Supabase + realtime updates
 *
 * @version 2.0.0
 */

const ActiveMembers = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        isRendered: false
    },

    config: {
        STATUS_TYPES: {
            online:  'online',
            away:    'away',
            offline: 'offline'
        }
    },

    // ============================================================================
    // RENDERING
    // ============================================================================

    /**
     * Fetch real presence data from Supabase, render the section,
     * and subscribe to live updates.
     */
    async render() {
        const container = document.getElementById('activeMembersContainer');
        if (!container) {
            console.warn('activeMembersContainer not found — skipping active members render');
            return;
        }

        try {
            // Show loading state while fetching
            container.innerHTML = `
                <section class="section">
                    <div class="section-header">
                        <div class="section-title">Active Members</div>
                        <div style="font-size: 12px; color: var(--text-muted);">Loading...</div>
                    </div>
                </section>`;

            // Fetch real members + blocked list in parallel
            const [members, blocked] = await Promise.all([
                CommunityDB.getActiveMembers(),
                CommunityDB.getBlockedUsers()
            ]);

            const visible = members.filter(m => !blocked.has(m.user_id));
            const onlineCount = visible.filter(m => m.status === 'online').length;

            container.innerHTML = `
                <section class="section">
                    <div class="section-header">
                        <div class="section-title">Active Members</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${onlineCount} online</div>
                    </div>
                    <div class="active-members-grid">
                        ${visible.length > 0
                            ? visible.map(m => this.getMemberCardHTML(m)).join('')
                            : '<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online right now.</div>'
                        }
                    </div>
                </section>`;

            // Subscribe to live presence changes
            CommunityDB.subscribeToPresence(async (updatedMembers) => {
                const blocked = await CommunityDB.getBlockedUsers();
                const visible = updatedMembers.filter(m => !blocked.has(m.user_id));
                this._updateGrid(visible);
            });

            this.state.isRendered = true;
            console.log('✓ Active Members rendered');

        } catch (error) {
            console.error('Active Members render error:', error);
            if (container) {
                container.innerHTML = `
                    <section class="section">
                        <div class="section-header"><div class="section-title">Active Members</div></div>
                        <div style="color:var(--text-muted);font-size:13px;padding:12px">Could not load members.</div>
                    </section>`;
            }
        }
    },

    /**
     * Update just the grid content (called by realtime subscription).
     * @param {Array} members - Filtered presence rows
     */
    _updateGrid(members) {
        const grid = document.querySelector('#activeMembersContainer .active-members-grid');
        if (!grid) return;

        const onlineCount = members.filter(m => m.status === 'online').length;
        const countEl = document.querySelector('#activeMembersContainer .section-header div:last-child');
        if (countEl) countEl.textContent = `${onlineCount} online`;

        grid.innerHTML = members.length > 0
            ? members.map(m => this.getMemberCardHTML(m)).join('')
            : '<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online right now.</div>';
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================

    /**
     * Generate HTML for a single member card from a presence row.
     * @param {Object} presenceRow - Row from community_presence with profiles join
     * @returns {string} HTML string
     */
    getMemberCardHTML(presenceRow) {
        if (!presenceRow) return '';

        const profile  = presenceRow.profiles || {};
        const name     = profile.name  || 'Member';
        const emoji    = profile.emoji || '';
        const initial  = name.charAt(0).toUpperCase();
        const display  = emoji || initial;
        const status   = presenceRow.status   || 'online';
        const activity = presenceRow.activity || '✨ Available';
        const userId   = presenceRow.user_id;
        const gradient = Core.getAvatarGradient(userId || name);

        return `
            <div class="member-card-mini"
                 onclick="ActiveMembers.handleViewMember('${userId}')"
                 data-member-id="${userId}"
                 role="button"
                 tabindex="0"
                 aria-label="View ${this.escapeHtml(name)}'s profile">
                <div class="member-mini-avatar"
                     style="background: ${gradient};"
                     aria-hidden="true">
                    ${this.escapeHtml(display)}
                </div>
                <div class="member-mini-status ${status}"
                     aria-label="${status}"
                     title="${this.capitalizeFirst(status)}">
                </div>
                <div class="member-mini-name">${this.escapeHtml(name)}</div>
                <div class="member-mini-info">${this.escapeHtml(activity)}</div>
            </div>`;
    },

    // ============================================================================
    // INTERACTIONS
    // ============================================================================

    /**
     * Handle view member click — delegates to CommunityModule
     * @param {string} userId - User UUID
     */
    handleViewMember(userId) {
        if (!userId) return;
        try {
            if (window.CommunityModule && typeof window.CommunityModule.viewMember === 'function') {
                window.CommunityModule.viewMember(userId);
            } else {
                this.viewMember(userId);
            }
        } catch (error) {
            console.error('View member error:', error);
        }
    },

    /** Fallback view member */
    viewMember(userId) {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Member profiles coming soon');
        }
        console.log('View member:', userId);
    },

    // ============================================================================
    // UPDATES (status / activity can still be called by other modules)
    // ============================================================================

    updateMemberStatus(userId, status) {
        if (!this.config.STATUS_TYPES[status]) {
            console.error('Invalid status:', status);
            return;
        }
        try {
            const memberCard = document.querySelector(`[data-member-id="${userId}"]`);
            if (!memberCard) return;
            const statusIndicator = memberCard.querySelector('.member-mini-status');
            if (statusIndicator) {
                Object.values(this.config.STATUS_TYPES).forEach(s => statusIndicator.classList.remove(s));
                statusIndicator.classList.add(status);
                statusIndicator.setAttribute('aria-label', status);
                statusIndicator.setAttribute('title', this.capitalizeFirst(status));
            }
        } catch (error) {
            console.error('Update member status error:', error);
        }
    },

    updateMemberActivity(userId, activity) {
        if (!activity || typeof activity !== 'string') return;
        try {
            const memberCard = document.querySelector(`[data-member-id="${userId}"]`);
            if (!memberCard) return;
            const activityEl = memberCard.querySelector('.member-mini-info');
            if (activityEl) activityEl.textContent = activity;
        } catch (error) {
            console.error('Update member activity error:', error);
        }
    },

    async refresh() {
        this.state.isRendered = false;
        await this.render();
        console.log('✓ Active Members refreshed');
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    capitalizeFirst(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Render after DOM is ready. CommunityDB must be initialized first (done in Core.init).
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ActiveMembers.render());
} else {
    ActiveMembers.render();
}

window.ActiveMembers = ActiveMembers;
