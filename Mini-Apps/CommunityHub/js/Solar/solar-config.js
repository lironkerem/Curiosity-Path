/**
 * SOLAR-CONFIG.JS
 * Shared configuration and content generators for solar rooms
 * Eliminates duplicate code across season-specific room files
 * 
 * @namespace SolarConfig
 */

// ============================================================================
// SOLAR CONSTANTS (Merged from solar-constants.js)
// ============================================================================
const SOLAR_CONSTANTS = {
  // UI Configuration
  PRESENCE_RANGE: { min: 8, max: 23 },
  FLOATING_ELEMENT_COUNT: 20,
  UPDATE_INTERVAL_MS: 600000, // 10 minutes
  
  // Storage Configuration
  STORAGE_PREFIX: 'solar_',
  STORAGE_KEY_SUFFIX: '_data',
  
  // Image Configuration
  IMAGE_BASE_URL: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Solar/',
  
  // Season Names
  SEASONS: {
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn',
    WINTER: 'winter'
  },
  
  // Validation
  MIN_REFLECTION_LENGTH: 10,
  
  // Animation
  FLOATING_ELEMENT_DURATION_MIN: 10,
  FLOATING_ELEMENT_DURATION_RANGE: 10,
  FLOATING_ELEMENT_DELAY_MAX: 5
};

window.SOLAR_CONSTANTS = SOLAR_CONSTANTS;

// ============================================================================
// SOLAR CONFIG
// ============================================================================

const SolarConfig = {
  /**
   * Generate intention practice content (Practice 1)
   * Used by all seasons with different labels
   * @param {Object} userData - User's saved data
   * @param {Array<string>} affirmations - Array of prebuilt affirmations
   * @param {Object} labels - Season-specific labels
   * @returns {string} HTML content
   */
  generateIntentionPracticeContent(userData, affirmations, labels) {
    const { intention, releaseList } = userData;
    
    const affirmationButtons = affirmations.map(aff => `
      <button data-affirmation="${this._escapeAttr(aff)}" 
              class="solar-affirmation-btn"
              style="padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; color: rgba(224, 224, 255, 0.8); cursor: pointer; text-align: left; transition: all 0.3s;">
        ${this._escapeHtml(aff)}
      </button>
    `).join('');

    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${labels.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Set Your Intention</h3>
        <p>${labels.intentionPrompt}</p>
        <textarea 
          id="intentionText" 
          class="solar-textarea" 
          placeholder="${labels.intentionPlaceholder}"
          maxlength="500"
          style="min-height: 100px; margin: 1rem 0;"
        >${this._escapeHtml(intention || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${labels.affirmationTitle || 'Choose Affirmation'}</h3>
        <p>Select one affirmation or write your own:</p>
        <div style="display: grid; gap: 0.5rem; margin: 1rem 0;">
          ${affirmationButtons}
        </div>
        <textarea 
          id="affirmationText" 
          class="solar-textarea" 
          placeholder="Or write your own..."
          maxlength="300"
          style="min-height: 80px; margin-top: 1rem;"
        >${this._escapeHtml(userData.affirmation || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${labels.listTitle}</h3>
        <p>${labels.listPrompt}</p>
        <textarea 
          id="releaseListText" 
          class="solar-textarea" 
          placeholder="1. &#10;2. &#10;3. "
          maxlength="1000"
          style="min-height: 120px; margin: 1rem 0;"
        >${this._escapeHtml(releaseList || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>Read Aloud</h3>
        <p>${labels.readAloudText}</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${labels.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate future alignment content (Practice 2)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateFutureAlignmentContent(config) {
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Close Your Eyes</h3>
        <p>${config.visualizationPrompt}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Notice Sensations</h3>
        <p>Observe posture, breath, and energy tone.</p>
      </div>

      <div class="solar-popup-section">
        <h3>${config.feelingTitle}</h3>
        <p>${config.feelingPrompt}</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate body practice content (Practice 3)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateBodyPracticeContent(config) {
    const stepsHTML = config.steps.map(step => `<li>${step}</li>`).join('');
    
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Practice Steps</h3>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${stepsHTML}
        </ul>
      </div>

      ${config.subtleMovement ? `
        <div class="solar-popup-section">
          <h3>Subtle Movement</h3>
          <p>${config.subtleMovement}</p>
        </div>
      ` : ''}

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate energy awareness content (Practice 4)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateEnergyAwarenessContent(config) {
    const energyStepsHTML = config.energySteps.map(step => `<li>${step}</li>`).join('');
    
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Energy Direction</h3>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${energyStepsHTML}
        </ul>
      </div>

      <div class="solar-popup-section">
        <h3>Sense ${config.energyQuality}</h3>
        <p>${config.energyGuideline}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Awareness Check</h3>
        <p>Notice subtle warmth, vibration, or light in your body.</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate environmental clearing content (Practice 5)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateEnvironmentalClearingContent(config) {
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Choose One Small Space</h3>
        <p>A desk, a drawer, a digital folder, or your phone home screen.</p>
      </div>

      <div class="solar-popup-section">
        <h3>Remove Items</h3>
        <p>${config.removePrompt}</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate role practice content (Practice 6)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateRolePracticeContent(config) {
    const rolesHTML = config.roleExamples.map(role => `<li>${role}</li>`).join('');
    
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Identify Your Roles</h3>
        <p>Select roles you actively play:</p>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${rolesHTML}
        </ul>
      </div>

      <div class="solar-popup-section">
        <h3>${config.actionTitle}</h3>
        <p>${config.actionPrompt}</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate pace practice content (Practice 7)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generatePacePracticeContent(config) {
    const optionsHTML = config.paceOptions.map(opt => `<li>${opt}</li>`).join('');
    const adjustmentsHTML = config.adjustmentExamples.map(adj => `<li>${adj}</li>`).join('');
    
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Assess Your Pace</h3>
        <p>Answer: "At what pace am I currently living?"</p>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${optionsHTML}
        </ul>
      </div>

      <div class="solar-popup-section">
        <h3>Choose a Small Adjustment</h3>
        <p>${config.adjustmentPrompt}</p>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${adjustmentsHTML}
        </ul>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
      </div>
    `;
  },

  /**
   * Generate relationship audit content (Practice 8)
   * @param {Object} config - Season-specific configuration
   * @returns {string} HTML content
   */
  generateRelationshipAuditContent(config) {
    const actionsHTML = config.actionExamples.map(act => `<li>${act}</li>`).join('');
    
    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${config.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Identify Key Connections</h3>
        <p>${config.identifyPrompt}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Decide One Action per Relationship</h3>
        <p>For each person, choose one action:</p>
        <ul style="text-align: left; margin: 1rem 0; line-height: 1.8;">
          ${actionsHTML}
        </ul>
      </div>

      <div class="solar-popup-section">
        <h3>Integrate Awareness</h3>
        <p>${config.integrationPrompt}</p>
      </div>

      <div class="solar-popup-highlight" style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-top: 1rem;">
        <p><strong>Closing Line:</strong> "${config.closingLine}"</p>
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

window.SolarConfig = SolarConfig;
console.log('🌞 Solar Config loaded');