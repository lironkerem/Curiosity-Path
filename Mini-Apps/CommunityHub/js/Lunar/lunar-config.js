/**
 * LUNAR-CONFIG.JS v2.0
 * Shared configuration and content generators for lunar rooms
 * Eliminates duplicate code across phase-specific room files
 * 
 * @namespace LunarConfig
 */

const LunarConfig = {
    /**
     * Generate intention practice content (used by all phases)
     * @param {Object} userData - User's saved data
     * @param {Array<string>} affirmations - Array of prebuilt affirmations
     * @param {Object} labels - Phase-specific labels
     * @returns {string} HTML content
     */
    generateIntentionPracticeContent(userData, affirmations, labels) {
        const { intention, affirmation, releaseList } = userData;
        
        const affirmationButtons = affirmations.map(aff => `
            <button data-affirmation="${this._escapeAttr(aff)}" 
                    class="lunar-affirmation-btn"
                    style="padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: rgba(224, 224, 255, 0.8); cursor: pointer; text-align: left; transition: all 0.3s;">
                ${this._escapeHtml(aff)}
            </button>
        `).join('');

        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${labels.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One Clear Intention</h3>
                <p>Write one sentence beginning with:</p>
                <div class="lunar-popup-highlight">
                    <p>"${labels.intentionPrompt}"</p>
                </div>
                <textarea 
                    id="intentionText" 
                    placeholder="${labels.intentionPrompt}" 
                    class="lunar-textarea-large" 
                    style="min-height: 80px;"
                    maxlength="500"
                    aria-label="Your intention"
                >${this._escapeHtml(intention || '')}</textarea>
                <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.6); margin-top: 0.5rem;">
                    ${labels.intentionHelper}
                </p>
            </div>

            <div class="lunar-popup-section">
                <h3>One ${labels.affirmationType} Affirmation</h3>
                <p>${labels.affirmationPrompt}</p>
                <div style="display: grid; gap: 0.5rem; margin: 1rem 0;">
                    ${affirmationButtons}
                </div>
                <textarea 
                    id="affirmationText" 
                    placeholder="Or write your own..." 
                    class="lunar-textarea-large" 
                    style="min-height: 80px;"
                    maxlength="300"
                    aria-label="Your affirmation"
                >${this._escapeHtml(affirmation || '')}</textarea>
                ${labels.affirmationHelper ? `
                    <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.6); margin-top: 0.5rem;">
                        ${labels.affirmationHelper}
                    </p>
                ` : ''}
            </div>

            <div class="lunar-popup-section">
                <h3>${labels.listTitle}</h3>
                <p>${labels.listPrompt}</p>
                ${labels.listHelper ? `
                    <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.7); margin-top: 0.5rem;">
                        ${labels.listHelper}
                    </p>
                ` : ''}
                <textarea 
                    id="releaseListText" 
                    placeholder="1. &#10;2. &#10;3. " 
                    class="lunar-textarea-large" 
                    style="min-height: 120px;"
                    maxlength="1000"
                    aria-label="${labels.listTitle}"
                >${this._escapeHtml(releaseList || '')}</textarea>
                ${labels.listFooter ? `
                <div class="lunar-popup-highlight" style="margin-top: 1rem;">
                    <p>${labels.listFooter}</p>
                </div>
                ` : ''}
            </div>

            <div class="lunar-popup-footer">
                <button class="lunar-popup-btn" data-action="save-practice" aria-label="Save your practice">
                    Save Practice
                </button>
            </div>
        `;
    },

    /**
     * Generate future alignment content
     * @param {Object} config - Phase-specific configuration
     * @returns {string} HTML content
     */
    generateFutureAlignmentContent(config) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${config.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>
                    ${config.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>

            <div class="lunar-popup-highlight">
                <p>${config.guideline}</p>
            </div>
        `;
    },

    /**
     * Generate body practice content
     * @param {Object} config - Phase-specific configuration
     * @returns {string} HTML content
     */
    generateBodyPracticeContent(config) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${config.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>
                    ${config.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
                <div class="lunar-popup-highlight" style="margin-top: 1rem;">
                    <p>${config.guideline}</p>
                </div>
            </div>
        `;
    },

    /**
     * Generate energy awareness content
     * @param {Object} config - Phase-specific configuration
     * @returns {string} HTML content
     */
    generateEnergyAwarenessContent(config) {
        return `
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${config.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>Energy Direction</h3>
                <ul>
                    ${config.energySteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
                <div class="lunar-popup-highlight">
                    <p>${config.energyGuideline}</p>
                </div>
            </div>

            <div class="lunar-popup-section">
                <h3>${config.awarenessTitle}</h3>
                <p>${config.awarenessPrompt}</p>
                ${config.awarenessExample ? `
                    <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.7); margin-top: 0.5rem;">
                        <em>${config.awarenessExample}</em>
                    </p>
                ` : ''}
            </div>

            <div class="lunar-popup-section">
                <h3>Closing</h3>
                <div class="lunar-popup-highlight">
                    <p>"${config.closingStatement}"</p>
                </div>
                <p>Say once, out loud or silently. End the practice.</p>
            </div>
        `;
    },

    /**
     * Escape HTML to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Escape attribute value to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeAttr(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.LunarConfig = LunarConfig;
