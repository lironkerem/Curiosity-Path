/**
 * PROFILE MODULE
 * 
 * Manages user profile display and interactions:
 * - Profile hero section rendering
 * - User stats and badges display
 * - Public/Private view toggle
 * - Profile editing functionality
 * - Status ring management
 * - Pulse/calm offering system
 * 
 * @version 1.0.0
 */

const ProfileModule = {
    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        currentView: 'public', // 'public' or 'private'
        isInitialized: false
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        MAX_INSPIRATION_LENGTH: 200,
        PULSE_ANIMATION_DURATION: 600
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    /**
     * Initialize the profile module
     */
    init() {
        if (this.state.isInitialized) {
            console.warn('ProfileModule already initialized');
            return;
        }

        try {
            console.log('👤 Profile Module Loaded');
            
            this.renderHTML();
            this.populateData();
            this.setupCharCounter();
            
            this.state.isInitialized = true;
            console.log('✓ ProfileModule initialized');
            
        } catch (error) {
            console.error('ProfileModule initialization failed:', error);
        }
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for profile hero section
     * @returns {string} HTML string
     */
    getHTML() {
        return `
        <header class="profile-hero">
            <div class="profile-container">
                <div class="profile-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-wrap">
                            <div class="profile-avatar" id="profileAvatar" aria-label="Profile avatar">A</div>
                            <div class="profile-status-ring" id="statusRing" aria-hidden="true"></div>
                            <button class="edit-avatar" 
                                    onclick="ProfileModule.editProfile()" 
                                    aria-label="Edit profile">
                                📷
                            </button>
                        </div>
                    </div>
                    
                    <div class="profile-info">
                        <div class="profile-name-row">
                            <div class="profile-name" id="profileName">Alex Morgan</div>
                            <div class="karma-badge" id="karmaBadge">⭐ 1,240 Karma</div>
                        </div>
                        
                        <div class="profile-inspiration">
                            <span id="profileInspiration">"Finding stillness in the chaos. Here to practice with intention."</span>
                            <button class="edit-inspiration-btn" 
                                    onclick="ProfileModule.editInspiration()" 
                                    aria-label="Edit inspiration">
                                ✏️
                            </button>
                        </div>

                        <div class="profile-meta">
                            <span>🎂 March 12, 1995</span>
                            <span id="profileLocation">📍 Tel Aviv, Israel</span>
                            <span id="profileRole">👑 Space Holder</span>
                        </div>

                        <div class="profile-stats">
                            <div class="p-stat">
                                <span class="p-stat-num">8</span>
                                <div class="p-stat-label">Level</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num">2,450</span>
                                <div class="p-stat-label">XP</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statCircles">48</span>
                                <div class="p-stat-label">Sessions</div>
                            </div>
                            <div class="p-stat">
                                <span class="p-stat-num" id="statOffered">12</span>
                                <div class="p-stat-label">Gifts</div>
                            </div>
                        </div>

                        <div class="badges-row">
                            <div class="badge">🔥<div class="badge-tooltip">7-Day Streak</div></div>
                            <div class="badge">🧘<div class="badge-tooltip">Zen Master</div></div>
                            <div class="badge">⭐<div class="badge-tooltip">First Share</div></div>
                            <div class="badge">🎯<div class="badge-tooltip">Deep Focus</div></div>
                        </div>

                        <div class="view-toggle">
                            <button class="v-btn active" 
                                    onclick="ProfileModule.toggleProfileView('public')"
                                    aria-pressed="true">
                                Public View
                            </button>
                            <button class="v-btn" 
                                    onclick="ProfileModule.toggleProfileView('private')"
                                    aria-pressed="false">
                                Private View
                            </button>
                        </div>

                        <div class="private-details" id="privateDetails">
                            <div class="detail-row">
                                <span class="detail-label">Current Streak</span>
                                <span class="detail-val" style="color: var(--ring-guiding);">🔥 7 days</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Total Practice Time</span>
                                <span class="detail-val" id="statMinutes">24 hours 18 minutes</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Favorite Practice</span>
                                <span class="detail-val">Morning Silence</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Community Role</span>
                                <span class="detail-val" style="color: var(--primary);">Space Holder</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Service XP</span>
                                <span class="detail-val">340 (from holding space)</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Invisible Helps</span>
                                <span class="detail-val">6 spaces held today</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Joined</span>
                                <span class="detail-val">March 2024</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Season Resonance</span>
                                <span class="detail-val">Winter (Stillness)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        `;
    },

    /**
     * Render HTML into container
     */
    renderHTML() {
        const container = document.getElementById('profileHeroContainer');
        if (!container) {
            console.warn('profileHeroContainer not found - skipping profile render');
            return;
        }

        try {
            container.innerHTML = this.getHTML();
            console.log('✓ Profile HTML rendered');
        } catch (error) {
            console.error('Profile HTML render error:', error);
        }
    },

    // ============================================================================
    // DATA POPULATION
    // ============================================================================
    
    /**
     * Populate profile with user data from Core.state
     */
    populateData() {
        if (!window.Core || !window.Core.state || !window.Core.state.currentUser) {
            console.warn('Core.state.currentUser not available');
            return;
        }

        try {
            const user = window.Core.state.currentUser;
            
            this.updateAvatar(user);
            this.updateName(user);
            this.updateKarma(user);
            this.updateBio(user);
            this.updateStats(user);
            this.updateStatusRing(user.status);
            this.updatePresenceCount();
            
            console.log('✓ Profile data populated');
            
        } catch (error) {
            console.error('Profile data population error:', error);
        }
    },

    /**
     * Update avatar display
     * @param {Object} user - User data object
     */
    updateAvatar(user) {
        const avatar = document.getElementById('profileAvatar');
        if (avatar && user.avatar) {
            avatar.textContent = user.avatar;
            
            if (window.Core && typeof window.Core.getAvatarGradient === 'function') {
                avatar.style.background = window.Core.getAvatarGradient(user.name || 'default');
            }
        }
    },

    /**
     * Update name display
     * @param {Object} user - User data object
     */
    updateName(user) {
        const name = document.getElementById('profileName');
        if (name && user.name) {
            name.textContent = user.name;
        }
    },

    /**
     * Update karma badge
     * @param {Object} user - User data object
     */
    updateKarma(user) {
        const karma = document.getElementById('karmaBadge');
        if (karma && typeof user.karma === 'number') {
            karma.textContent = `⭐ ${user.karma.toLocaleString()} Karma`;
        }
    },

    /**
     * Update bio/inspiration text
     * @param {Object} user - User data object
     */
    updateBio(user) {
        const bio = document.getElementById('profileBio');
        if (bio && user.bio) {
            bio.textContent = user.bio;
        }
    },

    /**
     * Update all stats displays
     * @param {Object} user - User data object
     */
    updateStats(user) {
        // Minutes
        const statMinutes = document.getElementById('statMinutes');
        if (statMinutes && typeof user.minutes === 'number') {
            statMinutes.textContent = this.formatMinutes(user.minutes);
        }

        // Sessions/Circles
        const statCircles = document.getElementById('statCircles');
        if (statCircles && typeof user.circles === 'number') {
            statCircles.textContent = user.circles.toLocaleString();
        }

        // Offerings
        const statOffered = document.getElementById('statOffered');
        if (statOffered && typeof user.offered === 'number') {
            statOffered.textContent = user.offered.toLocaleString();
        }
    },

    /**
     * Format minutes into hours and minutes
     * @param {number} totalMinutes - Total minutes
     * @returns {string} Formatted time string
     */
    formatMinutes(totalMinutes) {
        if (typeof totalMinutes !== 'number' || totalMinutes < 0) {
            return '0 minutes';
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours === 0) {
            return `${minutes} minutes`;
        } else if (minutes === 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        } else {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        }
    },

    /**
     * Update status ring color based on user status
     * @param {string} status - User status (available, silent, guiding, etc.)
     */
    updateStatusRing(status) {
        const ring = document.getElementById('statusRing');
        if (!ring) return;

        try {
            const statusRings = window.Core?.config?.statusRings || {};
            const color = statusRings[status] || statusRings.offline || '#d1d5db';
            
            ring.style.borderColor = color;
            ring.style.boxShadow = `0 0 0 4px ${color}33`;
            
        } catch (error) {
            console.error('Error updating status ring:', error);
        }
    },

    /**
     * Update presence count display
     */
    updatePresenceCount() {
        if (window.Core && typeof window.Core.updatePresenceCount === 'function') {
            window.Core.updatePresenceCount();
        }
    },

    // ============================================================================
    // PROFILE EDITING
    // ============================================================================
    
    /**
     * Edit profile (placeholder for modal)
     */
    editProfile() {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Profile editing coming soon');
        }
        
        // TODO: Open profile edit modal
        console.log('Edit profile clicked');
    },

    /**
     * Edit inspiration message
     */
    editInspiration() {
        const inspirationEl = document.getElementById('profileInspiration');
        if (!inspirationEl) {
            console.warn('profileInspiration element not found');
            return;
        }

        try {
            const currentText = inspirationEl.textContent.replace(/"/g, '').trim();
            const newText = prompt('Edit your inspiration message:', currentText);
            
            if (newText !== null && newText.trim()) {
                const sanitized = this.sanitizeInspiration(newText.trim());
                
                if (sanitized) {
                    inspirationEl.textContent = `"${sanitized}"`;
                    
                    if (window.Core && typeof window.Core.showToast === 'function') {
                        window.Core.showToast('Inspiration updated');
                    }
                    
                    // TODO: Save to backend
                    // if (window.SupabaseClient) {
                    //     SupabaseClient.updateUserProfile({ inspiration: sanitized });
                    // }
                }
            }
            
        } catch (error) {
            console.error('Error editing inspiration:', error);
        }
    },

    /**
     * Sanitize and validate inspiration text
     * @param {string} text - Raw inspiration text
     * @returns {string} Sanitized text
     */
    sanitizeInspiration(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }

        // Trim and limit length
        let sanitized = text.trim().substring(0, this.config.MAX_INSPIRATION_LENGTH);
        
        // Basic XSS prevention (remove HTML tags)
        sanitized = sanitized.replace(/<[^>]*>/g, '');
        
        return sanitized;
    },

    // ============================================================================
    // VIEW TOGGLE
    // ============================================================================
    
    /**
     * Toggle between public and private profile views
     * @param {string} view - 'public' or 'private'
     */
    toggleProfileView(view) {
        if (view !== 'public' && view !== 'private') {
            console.error('Invalid view type:', view);
            return;
        }

        try {
            const privateDetails = document.getElementById('privateDetails');
            const buttons = document.querySelectorAll('.v-btn');
            
            // Update button states
            buttons.forEach(btn => {
                const isActive = btn.textContent.toLowerCase().includes(view);
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive.toString());
            });
            
            // Toggle private details visibility
            if (privateDetails) {
                privateDetails.classList.toggle('visible', view === 'private');
            }
            
            this.state.currentView = view;
            console.log(`Profile view: ${view}`);
            
        } catch (error) {
            console.error('Error toggling profile view:', error);
        }
    },

    // ============================================================================
    // PULSE SYSTEM
    // ============================================================================
    
    /**
     * Send pulse - offer calm to community
     */
    sendPulse() {
        if (!window.Core || !window.Core.state) {
            console.error('Core not available');
            return;
        }

        if (window.Core.state.pulseSent) {
            if (typeof window.Core.showToast === 'function') {
                window.Core.showToast('Already offered');
            }
            return;
        }

        const btn = document.getElementById('pulseBtn');
        if (!btn) {
            console.warn('Pulse button not found');
            return;
        }

        try {
            btn.classList.add('sending');
            
            setTimeout(() => {
                btn.classList.remove('sending');
                btn.classList.add('sent');
                btn.innerHTML = '✓<span class="pulse-ripple"></span>';
                
                window.Core.state.pulseSent = true;
                
                // Update pulse bar
                const pulseFill = document.getElementById('pulseFill');
                if (pulseFill) {
                    pulseFill.style.width = '50%';
                }
                
                if (typeof window.Core.showToast === 'function') {
                    window.Core.showToast('Calm offered');
                }
                
            }, this.config.PULSE_ANIMATION_DURATION);
            
        } catch (error) {
            console.error('Error sending pulse:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    /**
     * Setup character counter for reflection input
     */
    setupCharCounter() {
        const input = document.getElementById('reflectionInput');
        const counter = document.getElementById('charCount');
        
        if (input && counter) {
            input.addEventListener('input', () => {
                counter.textContent = input.value.length;
            });
            
            console.log('✓ Character counter initialized');
        }
    },

    /**
     * Refresh profile data (useful after updates)
     */
    refresh() {
        try {
            this.populateData();
            console.log('✓ Profile refreshed');
        } catch (error) {
            console.error('Profile refresh error:', error);
        }
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProfileModule.init());
} else {
    // DOM already loaded
    ProfileModule.init();
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.ProfileModule = ProfileModule;
