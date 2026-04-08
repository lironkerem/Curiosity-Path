// ============================================
// INQUIRY ENGINE - Professional & Optimized
// ============================================
// Manages self-inquiry question selection with intensity filtering
// Tracks daily selections to avoid repetition and supports multiple user levels

import { InquiryList } from './Data/InquiryList.js';

// Configuration constants — frozen to prevent accidental mutation
const CONFIG = Object.freeze({
  INTENSITY_MAP: Object.freeze({
    beginner:     Object.freeze([1, 2]),
    intermediate: Object.freeze([1, 2, 3]),
    advanced:     Object.freeze([1, 2, 3, 4])
  }),
  DEFAULT_LEVEL: 'beginner'
});

export class InquiryEngine {
  /**
   * @param {string} userLevel - 'beginner' | 'intermediate' | 'advanced'
   */
  constructor(userLevel = CONFIG.DEFAULT_LEVEL) {
    this.userLevel = userLevel;
    this.todaySelections = []; // Track question IDs shown today
  }

  // ── Configuration ──────────────────────────────────────────────────────────

  getAllowedIntensities() {
    return CONFIG.INTENSITY_MAP[this.userLevel] || CONFIG.INTENSITY_MAP[CONFIG.DEFAULT_LEVEL];
  }

  setUserLevel(level) {
    if (CONFIG.INTENSITY_MAP[level]) {
      this.userLevel = level;
    } else {
      console.warn(`InquiryEngine: Invalid level "${level}". Using "${CONFIG.DEFAULT_LEVEL}".`);
      this.userLevel = CONFIG.DEFAULT_LEVEL;
    }
  }

  resetDailySelections() {
    this.todaySelections = [];
  }

  // ── Question Selection ─────────────────────────────────────────────────────

  /**
   * Get a random question from a domain using 4-tier fallback strategy.
   * @param {string} domain
   * @returns {Object} Question object {id, domain, question, holding, intensity}
   */
  getRandomQuestion(domain) {
    const allowed = this.getAllowedIntensities();

    // Strategy 1: unused + correct intensity + correct domain
    let pool = InquiryList.filter(
      q => q.domain === domain &&
           allowed.includes(q.intensity) &&
           !this.todaySelections.includes(q.id)
    );

    // Strategy 2: reset domain selections, retry with intensity filter
    if (!pool.length) {
      this._resetDomainSelections(domain);
      pool = InquiryList.filter(
        q => q.domain === domain && allowed.includes(q.intensity)
      );
    }

    // Strategy 3: ignore intensity, any question from domain
    if (!pool.length) {
      pool = InquiryList.filter(q => q.domain === domain);
    }

    // Strategy 4: final safety net — entire library
    if (!pool.length) {
      console.warn(`InquiryEngine: No questions for domain "${domain}". Using fallback.`);
      pool = InquiryList;
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];
    this.todaySelections.push(pick.id);
    return pick;
  }

  /**
   * Generate questions across multiple domains.
   * @param {string[]|null} domains - null = all domains
   * @returns {Object[]}
   */
  generateDailyInquiries(domains = null) {
    const selected = domains || this._getUniqueDomains();
    return selected
      .map(domain => this.getRandomQuestion(domain))
      .filter(Boolean);
  }

  // ── Private ────────────────────────────────────────────────────────────────

  _resetDomainSelections(domain) {
    this.todaySelections = this.todaySelections.filter(id => {
      const q = InquiryList.find(item => item.id === id);
      return q?.domain !== domain;
    });
  }

  _getUniqueDomains() {
    return [...new Set(InquiryList.map(q => q.domain))];
  }
}
