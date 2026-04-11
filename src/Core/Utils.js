/**
 * Utility Functions
 * Collection of helper functions, validators, and UI utilities.
 *
 * Exports:
 *   Utils           – General utilities (escape, sanitize, debounce, cache)
 *   Validation      – Input validation functions
 *   FormState       – Form data management
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const VALIDATION_LIMITS = Object.freeze({
  MAX_NAME_LENGTH:     120,
  MAX_LOCATION_LENGTH: 200,
  MAX_INPUT_LENGTH:    200,
  MIN_YEAR:            1900
});

const REGEX_PATTERNS = Object.freeze({
  NAME: /^[A-Za-z\u00C0-\u017F' -]+$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^\d{2}:\d{2}$/
});

const CACHE_CONFIG = Object.freeze({
  MAX_LOCATION_CACHE: 50,
  CACHE_EXPIRY_MS:    1_000 * 60 * 60 * 24 // 24 h
});

// ─── 1. Utils ─────────────────────────────────────────────────────────────────

export const Utils = {
  /**
   * Escape HTML to prevent XSS.
   * Uses DOM-based escaping so all entities are handled correctly.
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  },

  /**
   * Sanitise user input: trim, remove HTML brackets and control characters,
   * and truncate to MAX_INPUT_LENGTH.
   */
  sanitizeInput(str) {
    if (!str) return '';
    return String(str)
      .trim()
      .replace(/[<>]/g, '')
      .replace(/[\x00-\x1F\x7F]/g, '')
      .substring(0, VALIDATION_LIMITS.MAX_INPUT_LENGTH);
  },

  /** Standard debounce. */
  debounce(func, wait) {
    let timeout;
    return function debounced(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /** Standard throttle. */
  throttle(func, limit) {
    let inThrottle;
    return function throttled(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; }, limit);
      }
    };
  },

  /** @private In-memory location geocoding cache */
  _locationCache: new Map(),

  getCachedLocation(query) {
    const key    = query.toLowerCase().trim();
    const cached = this._locationCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_CONFIG.CACHE_EXPIRY_MS) {
      this._locationCache.delete(key);
      return null;
    }
    return cached.data;
  },

  setCachedLocation(query, result) {
    const key = query.toLowerCase().trim();
    if (this._locationCache.size >= CACHE_CONFIG.MAX_LOCATION_CACHE) {
      // Evict oldest entry
      this._locationCache.delete(this._locationCache.keys().next().value);
    }
    this._locationCache.set(key, { data: result, timestamp: Date.now() });
  },

  clearLocationCache() { this._locationCache.clear(); },

  /**
   * Format a date to a readable locale string.
   * @param {Date|string} date
   * @returns {string}
   */
  formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return 'Invalid Date';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  },

  /**
   * Deep-clone a plain object / array / primitive.
   * Uses structuredClone when available (faster, handles more types).
   * Falls back to manual recursion for older environments.
   */
  deepClone(obj) {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date)  return new Date(obj);
    if (Array.isArray(obj))   return obj.map(item => this.deepClone(item));
    const cloned = Object.create(null);
    for (const key of Object.keys(obj)) {
      cloned[key] = this.deepClone(obj[key]);
    }
    return cloned;
  }
};

// ─── 2. Validation ────────────────────────────────────────────────────────────

/** All methods return `{ valid: boolean, message?: string }` */
export const Validation = {
  validateName(value) {
    if (!value?.trim()) return { valid: false, message: 'Name is required' };
    const t = value.trim();
    if (t.length > VALIDATION_LIMITS.MAX_NAME_LENGTH)
      return { valid: false, message: `Maximum ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters` };
    if (!REGEX_PATTERNS.NAME.test(t))
      return { valid: false, message: 'Only letters, spaces, hyphens, and apostrophes allowed' };
    return { valid: true };
  },

  validateDateOfBirth(value) {
    if (!value) return { valid: false, message: 'Date of birth is required' };
    if (!REGEX_PATTERNS.DATE.test(value)) return { valid: false, message: 'Use YYYY-MM-DD format' };
    const date = new Date(value);
    if (isNaN(date.getTime()))                        return { valid: false, message: 'Invalid date' };
    if (date.getFullYear() < VALIDATION_LIMITS.MIN_YEAR)
      return { valid: false, message: `Year must be ${VALIDATION_LIMITS.MIN_YEAR} or later` };
    if (date > new Date())                            return { valid: false, message: 'Future date not allowed' };
    return { valid: true };
  },

  validateTimeOfBirth(value) {
    if (!value) return { valid: true }; // optional
    if (!REGEX_PATTERNS.TIME.test(value)) return { valid: false, message: 'Use HH:MM format (24-hour)' };
    const [h, m] = value.split(':').map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) return { valid: false, message: 'Invalid time' };
    return { valid: true };
  },

  validateLocation(value) {
    if (!value?.trim()) return { valid: true }; // optional
    if (value.length > VALIDATION_LIMITS.MAX_LOCATION_LENGTH)
      return { valid: false, message: `Maximum ${VALIDATION_LIMITS.MAX_LOCATION_LENGTH} characters` };
    return { valid: true };
  },

  validateEmail(value) {
    if (!value?.trim()) return { valid: false, message: 'Email is required' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
      return { valid: false, message: 'Invalid email format' };
    return { valid: true };
  }
};

// ─── 3. FormState ─────────────────────────────────────────────────────────────

/** Manages form data for the numerology calculator. */
export class FormState {
  static #KNOWN_FIELDS = new Set([
    'firstName', 'middleName', 'lastName',
    'dateOfBirth', 'timeOfBirth', 'locationOfBirth', 'includeY'
  ]);

  constructor() { this.reset(); }

  updateFormData(field, value) {
    if (!FormState.#KNOWN_FIELDS.has(field)) {
      console.warn(`[FormState] Unknown field "${field}"`);
      return;
    }
    this.formData[field] = value;
  }

  setAnalysisResults(results)  { this.analysisResults  = results; }
  getAnalysisResults()         { return this.analysisResults;  }
  setNarrativeResults(results) { this.narrativeResults = results; }
  getNarrativeResults()        { return this.narrativeResults; }

  reset() {
    this.formData = {
      firstName: '', middleName: '', lastName: '',
      dateOfBirth: '', timeOfBirth: '', locationOfBirth: '',
      includeY: false
    };
    this.analysisResults  = null;
    this.narrativeResults = null;
  }

  isComplete() {
    return !!(this.formData.firstName && this.formData.lastName && this.formData.dateOfBirth);
  }
}

// ─── Dev utilities ────────────────────────────────────────────────────────────
if (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.__utils = { Utils, Validation, FormState };
}

export default Utils;
