/**
 * SOLAR-CONFIG.JS
 * Shared constants and content generators for all solar practice rooms.
 * Single source of truth - eliminates duplication across season files.
 */

// ============================================================================
// SOLAR CONSTANTS
// ============================================================================

const SOLAR_CONSTANTS = {
  PRESENCE_RANGE:                  { min: 8, max: 23 },
  FLOATING_ELEMENT_COUNT:          20,
  UPDATE_INTERVAL_MS:              600_000, // 10 min

  STORAGE_PREFIX:                  'solar_',
  STORAGE_KEY_SUFFIX:              '_data',

  IMAGE_BASE_URL:                  '/Public/Community/Solar/',

  SEASONS:                         { SPRING: 'spring', SUMMER: 'summer', AUTUMN: 'autumn', WINTER: 'winter' },

  MIN_REFLECTION_LENGTH:           10,

  FLOATING_ELEMENT_DURATION_MIN:   10,
  FLOATING_ELEMENT_DURATION_RANGE: 10,
  FLOATING_ELEMENT_DELAY_MAX:      5,
};

// ============================================================================
// SOLAR CONFIG - shared HTML generators
// ============================================================================

const SolarConfig = {

  // ── Shared XSS helpers ─────────────────────────────────────────────────────

  escapeHtml(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  },

  escapeAttr(text) {
    if (!text) return '';
    return text
      .replace(/&/g,  '&amp;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;');
  },

  // ── Closing-line block ─────────────────────────────────────────────────────
  _closingBlock: closingLine =>
    `<div class="solar-popup-highlight">
       <p><strong>Closing Line:</strong> "${closingLine}"</p>
     </div>`,

  // ── Practice 1: Intention ──────────────────────────────────────────────────
  generateIntentionPracticeContent(userData, affirmations, labels) {
    const affirmationButtons = affirmations.map(aff =>
      `<button data-affirmation="${this.escapeAttr(aff)}" class="solar-affirmation-btn">
         ${this.escapeHtml(aff)}
       </button>`
    ).join('');

    return `
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${labels.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Set Your Intention</h3>
        <p>${labels.intentionPrompt}</p>
        <textarea id="intentionText" class="solar-textarea"
          placeholder="${labels.intentionPlaceholder}" maxlength="500"
          style="min-height:100px;margin:1rem 0;"
        >${this.escapeHtml(userData.intention || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${labels.affirmationTitle || 'Choose Affirmation'}</h3>
        <p>Select one affirmation or write your own:</p>
        <div class="solar-affirmations-grid">${affirmationButtons}</div>
        <textarea id="affirmationText" class="solar-textarea"
          placeholder="Or write your own..." maxlength="300"
          style="min-height:80px;margin-top:1rem;"
        >${this.escapeHtml(userData.affirmation || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${labels.listTitle}</h3>
        <p>${labels.listPrompt}</p>
        <textarea id="releaseListText" class="solar-textarea"
          placeholder="1. &#10;2. &#10;3. " maxlength="1000"
          style="min-height:120px;margin:1rem 0;"
        >${this.escapeHtml(userData.releaseList || '')}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>Read Aloud</h3>
        <p>${labels.readAloudText}</p>
      </div>

      ${this._closingBlock(labels.closingLine)}
    `;
  },

  // ── Practice 2: Future Alignment ──────────────────────────────────────────
  generateFutureAlignmentContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section"><h3>Close Your Eyes</h3><p>${cfg.visualizationPrompt}</p></div>
      <div class="solar-popup-section"><h3>Notice Sensations</h3><p>Observe posture, breath, and energy tone.</p></div>
      <div class="solar-popup-section"><h3>${cfg.feelingTitle}</h3><p>${cfg.feelingPrompt}</p></div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 3: Body Practice ─────────────────────────────────────────────
  generateBodyPracticeContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Practice Steps</h3>
        <ul class="solar-practice-steps">
          ${cfg.steps.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      ${cfg.subtleMovement ? `<div class="solar-popup-section"><h3>Subtle Movement</h3><p>${cfg.subtleMovement}</p></div>` : ''}
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 4: Energy Awareness ──────────────────────────────────────────
  generateEnergyAwarenessContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Energy Direction</h3>
        <ul class="solar-practice-steps">
          ${cfg.energySteps.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Sense ${cfg.energyQuality}</h3>
        <p>${cfg.energyGuideline}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Awareness Check</h3>
        <p>Notice subtle warmth, vibration, or light in your body.</p>
      </div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 5: Environmental Clearing ────────────────────────────────────
  generateEnvironmentalClearingContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Choose One Small Space</h3>
        <p>A desk, a drawer, a digital folder, or your phone home screen.</p>
      </div>
      <div class="solar-popup-section"><h3>Remove Items</h3><p>${cfg.removePrompt}</p></div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 6: Role Practice ─────────────────────────────────────────────
  generateRolePracticeContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Your Roles</h3>
        <p>Select roles you actively play:</p>
        <ul class="solar-practice-steps">
          ${cfg.roleExamples.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>${cfg.actionTitle}</h3>
        <p>${cfg.actionPrompt}</p>
      </div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 7: Pace Practice ─────────────────────────────────────────────
  generatePacePracticeContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Assess Your Pace</h3>
        <p>Answer: "At what pace am I currently living?"</p>
        <ul class="solar-practice-steps">
          ${cfg.paceOptions.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Choose a Small Adjustment</h3>
        <p>${cfg.adjustmentPrompt}</p>
        <ul class="solar-practice-steps">
          ${cfg.adjustmentExamples.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },

  // ── Practice 8: Relationship Audit ────────────────────────────────────────
  generateRelationshipAuditContent(cfg) {
    return `
      <div class="solar-popup-section"><h3>Purpose</h3><p>${cfg.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Key Connections</h3>
        <p>${cfg.identifyPrompt}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Decide One Action per Relationship</h3>
        <p>For each person, choose one action:</p>
        <ul class="solar-practice-steps">
          ${cfg.actionExamples.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Integrate Awareness</h3>
        <p>${cfg.integrationPrompt}</p>
      </div>
      ${this._closingBlock(cfg.closingLine)}
    `;
  },
};

export { SOLAR_CONSTANTS, SolarConfig };
