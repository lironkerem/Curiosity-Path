// Mini-Apps/SelfAnalysisPro/js/utils.js
// Patched: frozen objects, safe sanitizeInput, ls wrapper, textContent for toasts

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
};

const Utils = Object.freeze({
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  sanitizeInput(str) {
    if (!str) return '';
    return String(str)
      .trim()
      .replace(/[<>]/g, '')              // Remove angle brackets
      .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
      .substring(0, 200);
  },

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  locationCache: new Map(),

  getCachedLocation(query) {
    return this.locationCache.get(query.toLowerCase().trim());
  },

  setCachedLocation(query, results) {
    const key = query.toLowerCase().trim();
    if (this.locationCache.size >= 50) {
      this.locationCache.delete(this.locationCache.keys().next().value);
    }
    this.locationCache.set(key, results);
  }
});

const Validation = Object.freeze({
  validateName(value) {
    if (!value?.trim()) return { valid: false, message: 'Required' };
    if (value.length > 120) return { valid: false, message: 'Maximum 120 characters allowed' };
    if (!/^[A-Za-z\u00C0-\u017F' -]+$/.test(value.trim()))
      return { valid: false, message: 'Only letters, spaces, hyphen, apostrophe allowed' };
    return { valid: true };
  },

  validateDateOfBirth(value) {
    if (!value) return { valid: false, message: 'Required' };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
      return { valid: false, message: 'Please use YYYY-MM-DD' };
    const date = new Date(value);
    if (isNaN(date.getTime())) return { valid: false, message: 'Invalid date' };
    if (date.getFullYear() < 1900) return { valid: false, message: 'Year must be 1900 or later' };
    if (date > new Date()) return { valid: false, message: 'Date cannot be in the future' };
    return { valid: true };
  },

  validateTimeOfBirth(value) {
    return (!value || /^\d{2}:\d{2}$/.test(value))
      ? { valid: true }
      : { valid: false, message: 'Please use HH:MM format' };
  },

  validateLocation(value) {
    return (!value?.trim() || value.length <= 200)
      ? { valid: true }
      : { valid: false, message: 'Maximum 200 characters allowed' };
  }
});

class AppState {
  constructor() {
    this.analysisResults  = null;
    this.narrativeResults = null;
    this.formData = {
      firstName: '', middleName: '', lastName: '',
      dateOfBirth: '', timeOfBirth: '', locationOfBirth: '', includeY: false
    };
  }

  updateFormData(field, value) { this.formData[field] = value; }
  setAnalysisResults(results)  { this.analysisResults = results; }
  getAnalysisResults()         { return this.analysisResults; }
}

class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
  }

  show(message, type = 'success') {
    if (!this.container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = String(message); // XSS-safe — never innerHTML
    this.container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'),    10);
    setTimeout(() => toast.classList.remove('show'), 3000);
    setTimeout(() => toast.remove(),                 3400);
  }
}

class ProgressManager {
  constructor() {
    this.wrapper = document.getElementById('progress-wrapper');
    this.inner   = document.getElementById('progress-inner');
    this.text    = document.getElementById('progress-text');
  }

  show() {
    if (this.wrapper) this.wrapper.style.display = 'block';
    this.setProgress(0, 'Starting...');
  }

  hide() {
    if (this.wrapper) this.wrapper.style.display = 'none';
  }

  setProgress(percentage, message = '') {
    if (this.inner) {
      this.inner.style.width  = `${Math.min(100, Math.max(0, percentage))}%`;
      this.inner.textContent  = `${Math.round(percentage)}%`;
      // Update aria-valuenow on the wrapper if present
      if (this.wrapper) this.wrapper.setAttribute('aria-valuenow', String(Math.round(percentage)));
    }
    if (message && this.text) this.text.textContent = String(message);
  }

  async animate(duration = 1000) {
    return new Promise(resolve => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 8 + Math.random() * 7;
        if (progress >= 98) { progress = 98; clearInterval(interval); }
        this.setProgress(progress, 'Analyzing...');
      }, 40);
      setTimeout(() => {
        this.setProgress(100, 'Complete');
        setTimeout(() => { this.hide(); resolve(); }, 500);
      }, duration);
    });
  }
}

// Expose globally
window.Utils           = Utils;
window.Validation      = Validation;
window.AppState        = AppState;
window.ToastManager    = ToastManager;
window.ProgressManager = ProgressManager;
window.ls              = ls;

export default Utils;
