// ============================================
// INQUIRY ENGINE - Professional & Optimized
// ============================================
// Manages self-inquiry question selection with intensity filtering
// Tracks daily selections to avoid repetition and supports multiple user levels

import { InquiryList } from './Data/InquiryList.js';

// Configuration constants
const CONFIG = {
  INTENSITY_MAP: {
    beginner: [1, 2],
    intermediate: [1, 2, 3],
    advanced: [1, 2, 3, 4]
  },
  DEFAULT_LEVEL: 'beginner'
};

export class InquiryEngine {
  /**
   * Initialize the Inquiry Engine
   * @param {string} userLevel - User's inquiry level: 'beginner', 'intermediate', or 'advanced'
   */
  constructor(userLevel = CONFIG.DEFAULT_LEVEL) {
    this.userLevel = userLevel;
    this.todaySelections = []; // Track question IDs shown today to avoid repetition
  }

  // ============================================
  // Configuration Methods
  // ============================================

  /**
   * Get allowed intensity levels for current user level
   * @returns {Array<number>} Array of allowed intensity levels (1-4)
   */
  getAllowedIntensities() {
    return CONFIG.INTENSITY_MAP[this.userLevel] || CONFIG.INTENSITY_MAP[CONFIG.DEFAULT_LEVEL];
  }

  /**
   * Set user's inquiry level
   * @param {string} level - 'beginner', 'intermediate', or 'advanced'
   */
  setUserLevel(level) {
    if (CONFIG.INTENSITY_MAP[level]) {
      this.userLevel = level;
    } else {
      console.warn(`Invalid level: ${level}. Using '${CONFIG.DEFAULT_LEVEL}'.`);
      this.userLevel = CONFIG.DEFAULT_LEVEL;
    }
  }

  /**
   * Reset daily selections (call at start of new day)
   */
  resetDailySelections() {
    this.todaySelections = [];
  }

  // ============================================
  // Question Selection Logic
  // ============================================

  /**
   * Get a random inquiry question from specified domain
   * Uses fallback strategy to ensure a question is always returned:
   * 1. Try: unused + correct intensity + correct domain
   * 2. Try: reset domain selections + correct intensity + correct domain
   * 3. Try: any intensity + correct domain
   * 4. Fallback: any question from entire library
   * 
   * @param {string} domain - Question domain (e.g., 'Emotional Honesty', 'Shadow and Integration')
   * @returns {Object} Question object with {id, domain, question, holding, intensity}
   */
  getRandomQuestion(domain) {
    const allowed = this.getAllowedIntensities();

    // Strategy 1: Unused questions matching intensity and domain
    let pool = InquiryList.filter(
      q => q.domain === domain &&
           allowed.includes(q.intensity) &&
           !this.todaySelections.includes(q.id)
    );

    // Strategy 2: Reset domain-specific selections and try again
    if (!pool.length) {
      this._resetDomainSelections(domain);
      pool = InquiryList.filter(
        q => q.domain === domain && allowed.includes(q.intensity)
      );
    }

    // Strategy 3: Ignore intensity filter, use any question from domain
    if (!pool.length) {
      pool = InquiryList.filter(q => q.domain === domain);
    }

    // Strategy 4: Final safety net - use entire library (should rarely hit)
    if (!pool.length) {
      console.warn(`No questions found for domain: ${domain}. Using fallback.`);
      pool = InquiryList;
    }

    // Select random question from pool
    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.todaySelections.push(pick.id);
    
    return pick; // Guaranteed non-null
  }

  /**
   * Reset selections for a specific domain
   * Removes all question IDs from todaySelections that belong to the given domain
   * @param {string} domain - Domain to reset
   * @private
   */
  _resetDomainSelections(domain) {
    this.todaySelections = this.todaySelections.filter(id => {
      const question = InquiryList.find(item => item.id === id);
      return question?.domain !== domain;
    });
  }

  /**
   * Generate multiple daily inquiry questions across different domains
   * @param {Array<string>} domains - Optional array of domains to select from. If null, uses all available domains
   * @returns {Array<Object>} Array of question objects
   */
  generateDailyInquiries(domains = null) {
    const selectedDomains = domains || this._getUniqueDomains();
    return selectedDomains
      .map(domain => this.getRandomQuestion(domain))
      .filter(Boolean); // Remove any potential nulls (safety check)
  }

  /**
   * Get all unique domains from InquiryList
   * @returns {Array<string>} Array of unique domain names
   * @private
   */
  _getUniqueDomains() {
    return [...new Set(InquiryList.map(q => q.domain))];
  }
}