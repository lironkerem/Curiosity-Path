/**
 * Utility Functions
 * Collection of helper functions, validators, and UI utilities
 * 
 * Exports:
 * - Utils: General utilities (escape, sanitize, debounce, cache)
 * - Validation: Input validation functions
 * - FormState: Form data management
 * - ProgressManager: Progress bar UI
 * - DarkMode: Theme management
 */

/* global window, document, localStorage, matchMedia */

/* =========================================================
   CONSTANTS
   ========================================================= */

const VALIDATION_LIMITS = {
  MAX_NAME_LENGTH: 120,
  MAX_LOCATION_LENGTH: 200,
  MAX_INPUT_LENGTH: 200,
  MIN_YEAR: 1900
};

const REGEX_PATTERNS = {
  NAME: /^[A-Za-z\u00C0-\u017F' -]+$/,
  DATE: /^\d{4}-\d{2}-\d{2}$/,
  TIME: /^\d{2}:\d{2}$/
};

const CACHE_CONFIG = {
  MAX_LOCATION_CACHE: 50,
  CACHE_EXPIRY_MS: 1000 * 60 * 60 * 24 // 24 hours
};

const DARK_MODE_STORAGE_KEY = 'pc_darkMode';

/* =========================================================
   1. BASIC UTILITIES
   ========================================================= */

/**
 * Collection of general utility functions
 */
export const Utils = {
  /**
   * Escape HTML to prevent XSS
   * @param {string} str - String to escape
   * @returns {string} Escaped HTML
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Sanitize user input
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeInput(str) {
    if (!str) return '';
    return String(str)
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, VALIDATION_LIMITS.MAX_INPUT_LENGTH);
  },

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function debounced(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function throttled(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Location geocoding cache
   * @private
   */
  _locationCache: new Map(),

  /**
   * Get cached location result
   * @param {string} query - Location query
   * @returns {Object|null} Cached result or null
   */
  getCachedLocation(query) {
    const key = query.toLowerCase().trim();
    const cached = this._locationCache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > CACHE_CONFIG.CACHE_EXPIRY_MS) {
      this._locationCache.delete(key);
      return null;
    }
    
    return cached.data;
  },

  /**
   * Set cached location result
   * @param {string} query - Location query
   * @param {Object} result - Result to cache
   */
  setCachedLocation(query, result) {
    const key = query.toLowerCase().trim();
    
    // Evict oldest if cache full
    if (this._locationCache.size >= CACHE_CONFIG.MAX_LOCATION_CACHE) {
      const firstKey = this._locationCache.keys().next().value;
      this._locationCache.delete(firstKey);
    }
    
    this._locationCache.set(key, {
      data: result,
      timestamp: Date.now()
    });
  },

  /**
   * Clear location cache
   */
  clearLocationCache() {
    this._locationCache.clear();
  },

  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return 'Invalid Date';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Deep clone object (simple version)
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }
};

/* =========================================================
   2. VALIDATION ENGINE
   ========================================================= */

/**
 * Input validation functions
 * All return { valid: boolean, message?: string }
 */
export const Validation = {
  /**
   * Validate name field
   * @param {string} value - Name to validate
   * @returns {Object} Validation result
   */
  validateName(value) {
    if (!value?.trim()) {
      return { valid: false, message: 'Name is required' };
    }
    
    const trimmed = value.trim();
    
    if (trimmed.length > VALIDATION_LIMITS.MAX_NAME_LENGTH) {
      return { valid: false, message: `Maximum ${VALIDATION_LIMITS.MAX_NAME_LENGTH} characters` };
    }
    
    if (!REGEX_PATTERNS.NAME.test(trimmed)) {
      return { 
        valid: false, 
        message: 'Only letters, spaces, hyphens, and apostrophes allowed' 
      };
    }
    
    return { valid: true };
  },

  /**
   * Validate date of birth
   * @param {string} value - Date string (YYYY-MM-DD)
   * @returns {Object} Validation result
   */
  validateDateOfBirth(value) {
    if (!value) {
      return { valid: false, message: 'Date of birth is required' };
    }
    
    if (!REGEX_PATTERNS.DATE.test(value)) {
      return { valid: false, message: 'Use YYYY-MM-DD format' };
    }
    
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return { valid: false, message: 'Invalid date' };
    }
    
    if (date.getFullYear() < VALIDATION_LIMITS.MIN_YEAR) {
      return { valid: false, message: `Year must be ${VALIDATION_LIMITS.MIN_YEAR} or later` };
    }
    
    if (date > new Date()) {
      return { valid: false, message: 'Future date not allowed' };
    }
    
    return { valid: true };
  },

  /**
   * Validate time of birth
   * @param {string} value - Time string (HH:MM)
   * @returns {Object} Validation result
   */
  validateTimeOfBirth(value) {
    // Optional field
    if (!value) return { valid: true };
    
    if (!REGEX_PATTERNS.TIME.test(value)) {
      return { valid: false, message: 'Use HH:MM format (24-hour)' };
    }
    
    const [hours, minutes] = value.split(':').map(Number);
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return { valid: false, message: 'Invalid time' };
    }
    
    return { valid: true };
  },

  /**
   * Validate location field
   * @param {string} value - Location string
   * @returns {Object} Validation result
   */
  validateLocation(value) {
    // Optional field
    if (!value?.trim()) return { valid: true };
    
    if (value.length > VALIDATION_LIMITS.MAX_LOCATION_LENGTH) {
      return { 
        valid: false, 
        message: `Maximum ${VALIDATION_LIMITS.MAX_LOCATION_LENGTH} characters` 
      };
    }
    
    return { valid: true };
  },

  /**
   * Validate email address
   * @param {string} value - Email to validate
   * @returns {Object} Validation result
   */
  validateEmail(value) {
    if (!value?.trim()) {
      return { valid: false, message: 'Email is required' };
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(value.trim())) {
      return { valid: false, message: 'Invalid email format' };
    }
    
    return { valid: true };
  }
};

/* =========================================================
   3. FORM STATE MANAGER
   ========================================================= */

/**
 * Manages form data and analysis results
 * Renamed from AppState to avoid confusion with Core/AppState.js
 */
export class FormState {
  constructor() {
    this.analysisResults = null;
    this.narrativeResults = null;
    this.formData = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      locationOfBirth: '',
      includeY: false
    };
  }

  /**
   * Update form field
   * @param {string} field - Field name
   * @param {any} value - Field value
   */
  updateFormData(field, value) {
    if (this.formData.hasOwnProperty(field)) {
      this.formData[field] = value;
    } else {
      console.warn(`FormState: Unknown field "${field}"`);
    }
  }

  /**
   * Set analysis results
   * @param {Object} results - Analysis results
   */
  setAnalysisResults(results) {
    this.analysisResults = results;
  }

  /**
   * Get analysis results
   * @returns {Object|null} Analysis results
   */
  getAnalysisResults() {
    return this.analysisResults;
  }

  /**
   * Set narrative results
   * @param {Object} results - Narrative results
   */
  setNarrativeResults(results) {
    this.narrativeResults = results;
  }

  /**
   * Get narrative results
   * @returns {Object|null} Narrative results
   */
  getNarrativeResults() {
    return this.narrativeResults;
  }

  /**
   * Reset form data
   */
  reset() {
    this.formData = {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      locationOfBirth: '',
      includeY: false
    };
    this.analysisResults = null;
    this.narrativeResults = null;
  }

  /**
   * Check if form is complete
   * @returns {boolean} True if all required fields filled
   */
  isComplete() {
    return !!(
      this.formData.firstName &&
      this.formData.lastName &&
      this.formData.dateOfBirth
    );
  }
}

/* =========================================================
   4. PROGRESS BAR MANAGER
   ========================================================= */

/**
 * Manages animated progress bar UI
 */
export class ProgressManager {
  constructor(containerId = 'progress-wrapper') {
    this.containerId = containerId;
    this.wrapper = null;
    this.inner = null;
    this.text = null;
    this._initialize();
  }

  /**
   * Initialize or find progress bar elements
   * @private
   */
  _initialize() {
    this.wrapper = document.getElementById(this.containerId);
    
    if (!this.wrapper) {
      this.wrapper = this._createProgressBar();
    }
    
    this.inner = this.wrapper.querySelector('.progress-inner');
    this.text = this.wrapper.querySelector('.progress-text');
  }

  /**
   * Create progress bar DOM structure
   * @private
   * @returns {HTMLElement} Progress wrapper element
   */
  _createProgressBar() {
    const wrapper = document.createElement('div');
    wrapper.id = this.containerId;
    wrapper.style.cssText = `
      display: none;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 9998;
      width: 280px;
    `;
    
    wrapper.innerHTML = `
      <div class="progress-bar" style="
        height: 14px;
        border-radius: 999px;
        background: #e0e5ec;
        box-shadow: inset 2px 2px 4px #b8bec5, inset -2px -2px 4px #ffffff;
        overflow: hidden;
      ">
        <div class="progress-inner" style="
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, #667eea, #764ba2);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          transition: width 0.25s;
        "></div>
      </div>
      <div class="progress-text" style="
        margin-top: 6px;
        text-align: center;
        color: #6c757d;
        font-size: 0.8rem;
      "></div>
    `;
    
    document.body.appendChild(wrapper);
    return wrapper;
  }

  /**
   * Show progress bar
   * @param {string} message - Initial message
   */
  show(message = 'Starting…') {
    if (!this.wrapper) this._initialize();
    this.wrapper.style.display = 'block';
    this.set(0, message);
  }

  /**
   * Hide progress bar
   */
  hide() {
    if (this.wrapper) {
      this.wrapper.style.display = 'none';
    }
  }

  /**
   * Set progress percentage and message
   * @param {number} percentage - Progress (0-100)
   * @param {string} message - Status message
   */
  set(percentage, message = '') {
    if (!this.inner) return;
    
    const pct = Math.max(0, Math.min(100, percentage));
    this.inner.style.width = `${pct}%`;
    this.inner.textContent = `${Math.round(pct)}%`;
    
    if (message && this.text) {
      this.text.textContent = message;
    }
  }

  /**
   * Animate progress bar to completion
   * @param {number} duration - Animation duration in ms
   * @returns {Promise} Resolves when complete
   */
  async animate(duration = 1200) {
    return new Promise(resolve => {
      let progress = 0;
      const increment = 6 + Math.random() * 6;
      const intervalTime = 40;
      
      const interval = setInterval(() => {
        progress += increment;
        
        if (progress >= 98) {
          progress = 98;
          clearInterval(interval);
        }
        
        this.set(progress, 'Working…');
      }, intervalTime);
      
      setTimeout(() => {
        clearInterval(interval);
        this.set(100, 'Done!');
        
        setTimeout(() => {
          this.hide();
          resolve();
        }, 400);
      }, duration);
    });
  }

  /**
   * Cleanup and remove progress bar
   */
  destroy() {
    if (this.wrapper?.parentNode) {
      this.wrapper.remove();
    }
    this.wrapper = null;
    this.inner = null;
    this.text = null;
  }
}

/* =========================================================
   5. DARK MODE MANAGER
   ========================================================= */

/**
 * Dark mode theme management
 */
export const DarkMode = {
  _initialized: false,
  
  /**
   * Initialize dark mode
   */
  init() {
    if (this._initialized) return;
    
    const darkCSS = document.getElementById('dark-mode-css');
    if (!darkCSS) {
      console.warn('DarkMode: #dark-mode-css stylesheet not found');
      return;
    }
    
    // Set default if not set
    if (localStorage.getItem(DARK_MODE_STORAGE_KEY) === null) {
      const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(prefersDark));
    }
    
    // Apply saved preference
    const isDark = localStorage.getItem(DARK_MODE_STORAGE_KEY) === 'true';
    this.set(isDark);
    
    // Listen for system preference changes
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set preference
      if (localStorage.getItem(DARK_MODE_STORAGE_KEY) === null) {
        this.set(e.matches);
      }
    });
    
    this._initialized = true;
  },

  /**
   * Toggle dark mode
   * @param {boolean} enabled - True to enable dark mode
   */
  toggle(enabled) {
    this.set(enabled);
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(enabled));
  },

  /**
   * Set dark mode without saving preference
   * @param {boolean} enabled - True to enable dark mode
   */
  set(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    
    const darkCSS = document.getElementById('dark-mode-css');
    if (darkCSS) {
      darkCSS.disabled = !enabled;
    }
  },

  /**
   * Get current dark mode state
   * @returns {boolean} True if dark mode enabled
   */
  isEnabled() {
    return document.body.classList.contains('dark-mode');
  },

  /**
   * Reset to system preference
   */
  resetToSystem() {
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.removeItem(DARK_MODE_STORAGE_KEY);
    this.set(prefersDark);
  }
};

/* =========================================================
   6. BACKWARD COMPATIBILITY & WINDOW EXPOSURE
   ========================================================= */

// For legacy code that expects AppState name
export const AppState = FormState;

// Auto-initialize DarkMode
DarkMode.init();

// Expose to window for debugging and compatibility
if (typeof window !== 'undefined') {
  // Check if running on localhost (without import.meta)
  const isLocalhost = 
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost');
  
  // Always expose in development, optionally in production
  if (isLocalhost || window.__enableUtilsGlobals) {
    window.__utils = {
      Utils,
      Validation,
      FormState,
      ProgressManager,
      DarkMode
    };
  }
}

/* =========================================================
   7. DEFAULT EXPORT
   ========================================================= */

export default Utils;