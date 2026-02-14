/**
 * COLLECTIVE FIELD MODULE
 * 
 * Renders the Collective Field section featuring:
 * - Collective Energy Field with real-time presence count
 * - 24-Hour Calm Wave progress tracker
 * - Pulse/Send Calm functionality
 * - Animated SVG visualizations
 * 
 * @version 1.0.0
 */

const CollectiveField = {
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
        DEFAULT_PRESENCE_COUNT: 127,
        DEFAULT_ENERGY_LEVEL: 42,
        DEFAULT_WAVE_PROGRESS: 67,
        DEFAULT_WAVE_PARTICIPANTS: 48
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for collective field section
     * @returns {string} HTML string
     */
    getHTML() {
        return `
        <div class="section-header">
            <div class="section-title">Collective Field</div>
            <div style="font-size: 12px; color: var(--text-muted);">Real-time resonance</div>
        </div>

        <div class="collective-grid">
            ${this.getEnergyFieldHTML()}
            ${this.getCalmWaveHTML()}
        </div>
        `;
    },

    /**
     * Generate Collective Energy Field card HTML
     * @returns {string} HTML string
     */
    getEnergyFieldHTML() {
        const presenceCount = window.Core?.state?.presenceCount || this.config.DEFAULT_PRESENCE_COUNT;
        const energyLevel = this.config.DEFAULT_ENERGY_LEVEL;

        return `
            <!-- Collective Energy Field -->
            <div class="collective-card energy-card">
                <div class="collective-icon">
                    ${this.getEnergyFieldSVG()}
                </div>
                
                <div class="collective-title">Energy Field</div>
                
                <div class="collective-count">
                    <span class="count-number" id="presenceCount">${presenceCount}</span>
                    <span class="count-label">Present Now</span>
                </div>

                <div class="breath-indicator">
                    <span class="breath-dot" aria-hidden="true"></span>
                    <span>Collective breath</span>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" 
                                 id="pulseFill" 
                                 style="width: ${energyLevel}%"
                                 role="progressbar"
                                 aria-valuenow="${energyLevel}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <span class="progress-label">Energy Level</span>
                        <span class="progress-value">${energyLevel}%</span>
                    </div>
                </div>

                <button class="collective-action-btn" 
                        id="pulseBtn" 
                        onclick="CollectiveField.handleSendPulse()"
                        aria-label="Send calm energy to the collective field">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M12 6v12M6 12h12"/>
                    </svg>
                    <span>Send Calm</span>
                </button>
            </div>
        `;
    },

    /**
     * Generate 24-Hour Calm Wave card HTML
     * @returns {string} HTML string
     */
    getCalmWaveHTML() {
        const participants = this.config.DEFAULT_WAVE_PARTICIPANTS;
        const progress = this.config.DEFAULT_WAVE_PROGRESS;

        return `
            <!-- 24-Hour Calm Wave -->
            <div class="collective-card wave-card-new">
                <div class="collective-icon">
                    ${this.getCalmWaveSVG()}
                </div>
                
                <div class="collective-title">24h Calm Wave</div>
                
                <div class="collective-count">
                    <span class="count-number">${participants}</span>
                    <span class="count-label">Participants</span>
                </div>

                <div class="time-remaining">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12" aria-hidden="true">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zm0 1.5a.5.5 0 0 1 .5.5v4h3a.5.5 0 0 1 0 1h-3.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    <span>18 hours remaining</span>
                </div>

                <div class="collective-progress">
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar">
                            <div class="progress-fill" 
                                 style="width: ${progress}%"
                                 role="progressbar"
                                 aria-valuenow="${progress}"
                                 aria-valuemin="0"
                                 aria-valuemax="100">
                            </div>
                        </div>
                    </div>
                    <div class="progress-stats">
                        <span class="progress-label">Wave Building</span>
                        <span class="progress-value">${progress}%</span>
                    </div>
                </div>

                <button class="collective-action-btn" 
                        onclick="CollectiveField.handleContributeWave()"
                        aria-label="Contribute 20 minutes to the calm wave">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M12 6v12M6 12h12"/>
                    </svg>
                    <span>Contribute 20min</span>
                </button>
            </div>
        `;
    },

    /**
     * Generate Energy Field SVG visualization
     * @returns {string} SVG HTML string
     */
    getEnergyFieldSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="50" cy="50" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="2" opacity="0.5"/>
                <circle cx="50" cy="50" r="15" stroke="currentColor" stroke-width="2" opacity="0.7"/>
                <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9">
                    <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="3s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
    },

    /**
     * Generate Calm Wave SVG visualization
     * @returns {string} SVG HTML string
     */
    getCalmWaveSVG() {
        return `
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M10 50 Q 20 30, 30 50 T 50 50 T 70 50 T 90 50" 
                      stroke="currentColor" 
                      stroke-width="2.5" 
                      fill="none" 
                      opacity="0.4"/>
                <path d="M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50" 
                      stroke="currentColor" 
                      stroke-width="2.5" 
                      fill="none" 
                      opacity="0.6"/>
                <path d="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50" 
                      stroke="currentColor" 
                      stroke-width="3" 
                      fill="none">
                    <animate attributeName="d" 
                        values="M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 35, 30 50 T 50 50 T 70 50 T 90 50;
                                M10 50 Q 20 40, 30 50 T 50 50 T 70 50 T 90 50" 
                        dur="4s" 
                        repeatCount="indefinite"/>
                </path>
            </svg>
        `;
    },

    // ============================================================================
    // RENDERING
    // ============================================================================
    
    /**
     * Render collective field into container
     */
    render() {
        const container = document.getElementById('collectiveFieldContainer');
        if (!container) {
            console.warn('collectiveFieldContainer not found - skipping collective field render');
            return;
        }

        try {
            container.innerHTML = this.getHTML();
            this.state.isRendered = true;
            console.log('✓ Collective Field rendered');
        } catch (error) {
            console.error('Collective Field render error:', error);
        }
    },

    // ============================================================================
    // INTERACTIONS
    // ============================================================================
    
    /**
     * Handle send pulse action
     */
    handleSendPulse() {
        try {
            // Delegate to ProfileModule if available
            if (window.ProfileModule && typeof window.ProfileModule.sendPulse === 'function') {
                window.ProfileModule.sendPulse();
            } 
            // Fallback to ProfilePresence if available
            else if (window.ProfilePresence && typeof window.ProfilePresence.sendPulse === 'function') {
                window.ProfilePresence.sendPulse();
            } 
            // Direct implementation as fallback
            else {
                this.sendPulse();
            }
        } catch (error) {
            console.error('Send pulse error:', error);
        }
    },

    /**
     * Send pulse implementation (fallback)
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
        if (!btn) return;

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
            }, 600);
            
        } catch (error) {
            console.error('Pulse send error:', error);
        }
    },

    /**
     * Handle contribute to wave action
     */
    handleContributeWave() {
        try {
            // Delegate to CommunityModule if available
            if (window.CommunityModule && typeof window.CommunityModule.contributeWave === 'function') {
                window.CommunityModule.contributeWave(1); // Default wave ID
            }
            // Fallback to Community if available
            else if (window.Community && typeof window.Community.contributeWave === 'function') {
                window.Community.contributeWave();
            }
            // Direct implementation as fallback
            else {
                this.contributeWave();
            }
        } catch (error) {
            console.error('Contribute wave error:', error);
        }
    },

    /**
     * Contribute to wave implementation (fallback)
     */
    contributeWave() {
        if (window.Core && typeof window.Core.showToast === 'function') {
            window.Core.showToast('Contribution recorded! Start your practice.');
        }
        
        console.log('Contributed to calm wave');
        
        // TODO: Record contribution to backend
        // if (window.SupabaseClient) {
        //     SupabaseClient.contributeToWave({ waveId: 1, minutes: 20 });
        // }
    },

    // ============================================================================
    // UPDATES
    // ============================================================================
    
    /**
     * Update presence count display
     * @param {number} count - New presence count
     */
    updatePresenceCount(count) {
        if (typeof count !== 'number' || count < 0) {
            console.error('Invalid presence count:', count);
            return;
        }

        try {
            const countElement = document.getElementById('presenceCount');
            if (countElement) {
                countElement.textContent = count;
            }
        } catch (error) {
            console.error('Update presence count error:', error);
        }
    },

    /**
     * Update energy level display
     * @param {number} level - Energy level percentage (0-100)
     */
    updateEnergyLevel(level) {
        if (typeof level !== 'number' || level < 0 || level > 100) {
            console.error('Invalid energy level:', level);
            return;
        }

        try {
            const pulseFill = document.getElementById('pulseFill');
            if (pulseFill) {
                pulseFill.style.width = `${level}%`;
                pulseFill.setAttribute('aria-valuenow', level.toString());
            }

            const valueDisplay = document.querySelector('.energy-card .progress-value');
            if (valueDisplay) {
                valueDisplay.textContent = `${level}%`;
            }
        } catch (error) {
            console.error('Update energy level error:', error);
        }
    },

    /**
     * Refresh the collective field display
     */
    refresh() {
        try {
            this.render();
            console.log('✓ Collective Field refreshed');
        } catch (error) {
            console.error('Collective Field refresh error:', error);
        }
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-render when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CollectiveField.render());
} else {
    // DOM already loaded
    CollectiveField.render();
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.CollectiveField = CollectiveField;
