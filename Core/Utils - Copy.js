// Utils.js - COMPLETE PATCHED (dark-mode persistence fixed)
/* global window, document, localStorage, matchMedia */

/* =========================================================
   1.  BASIC UTILITIES
   ========================================================= */
const Utils = {
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  sanitizeInput(str) {
    if (!str) return '';
    return String(str).trim().replace(/[<>]/g, '').replace(/[\x00-\x1F\x7F]/g, '').substring(0, 200);
  },
  debounce(func, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => func.apply(this, args), wait);
    };
  },
  locationCache: new Map(),
  getCachedLocation(q) { return this.locationCache.get(q.toLowerCase().trim()); },
  setCachedLocation(q, r) {
    if (this.locationCache.size >= 50) this.locationCache.delete(this.locationCache.keys().next().value);
    this.locationCache.set(q.toLowerCase().trim(), r);
  }
};

/* =========================================================
   2.  VALIDATION ENGINE
   ========================================================= */
const Validation = {
  validateName(v) {
    if (!v?.trim()) return { valid: false, message: 'Required' };
    if (v.length > 120) return { valid: false, message: 'Max 120 characters' };
    if (!/^[A-Za-z\u00C0-\u017F' -]+$/.test(v.trim())) return { valid: false, message: 'Letters, spaces, hyphen, apostrophe only' };
    return { valid: true };
  },
  validateDateOfBirth(v) {
    if (!v) return { valid: false, message: 'Required' };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return { valid: false, message: 'Use YYYY-MM-DD' };
    const d = new Date(v);
    if (isNaN(d)) return { valid: false, message: 'Invalid date' };
    if (d.getFullYear() < 1900) return { valid: false, message: 'Year ≥ 1900' };
    if (d > new Date()) return { valid: false, message: 'Future date not allowed' };
    return { valid: true };
  },
  validateTimeOfBirth(v) {
    return !v || /^\d{2}:\d{2}$/.test(v) ? { valid: true } : { valid: false, message: 'Use HH:MM' };
  },
  validateLocation(v) {
    return !v?.trim() || v.length <= 200 ? { valid: true } : { valid: false, message: 'Max 200 characters' };
  }
};

/* =========================================================
   3.  APP-STATE MINI-STORE
   ========================================================= */
class AppState {
  constructor() {
    this.analysisResults = null;
    this.narrativeResults = null;
    this.formData = { firstName: '', middleName: '', lastName: '', dateOfBirth: '', timeOfBirth: '', locationOfBirth: '', includeY: false };
  }
  updateFormData(field, value) { this.formData[field] = value; }
  setAnalysisResults(r) { this.analysisResults = r; }
  getAnalysisResults() { return this.analysisResults; }
}

/* =========================================================
   4.  TOAST MANAGER
   ========================================================= */
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container') || this._ensureContainer();
  }
  _ensureContainer() {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999';
    document.body.appendChild(c);
    return c;
  }
  show(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.textContent = msg;
    const bg = type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6';
    t.style.cssText = `padding:12px 18px;margin-top:8px;border-radius:8px;color:#fff;transition:.3s;opacity:0;transform:translateY(10px);background:${bg}`;
    this.container.appendChild(t);
    setTimeout(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; }, 10);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; }, 2800);
    setTimeout(() => t.remove(), 3200);
  }
}

/* =========================================================
   5.  PROGRESS BAR MANAGER
   ========================================================= */
class ProgressManager {
  constructor() {
    this.wrapper = document.getElementById('progress-wrapper') || this._ensureWrapper();
    this.inner = document.getElementById('progress-inner') || this.wrapper.querySelector('.progress-inner');
    this.text  = document.getElementById('progress-text') || this.wrapper.querySelector('.progress-text');
  }
  _ensureWrapper() {
    const w = document.createElement('div');
    w.id = 'progress-wrapper';
    w.style.cssText = 'display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9998;width:280px';
    w.innerHTML = `<div class=progress-bar style="height:14px;border-radius:999px;background:#e0e5ec;box-shadow:inset 2px 2px 4px #b8bec5,inset -2px -2px 4px #ffffff;overflow:hidden"><div class=progress-inner style="height:100%;width:0;background:linear-gradient(90deg,#667eea,#764ba2);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;transition:width .25s"></div></div><div class=progress-text style="margin-top:6px;text-align:center;color:#6c757d;font-size:.8rem"></div>`;
    document.body.appendChild(w);
    return w;
  }
  show() { this.wrapper.style.display = 'block'; this.set(0, 'Starting…'); }
  hide() { this.wrapper.style.display = 'none'; }
  set(pct, msg = '') {
    this.inner.style.width = `${pct}%`;
    this.inner.textContent = `${Math.round(pct)}%`;
    if (msg) this.text.textContent = msg;
  }
  async animate(ms = 1200) {
    return new Promise(resolve => {
      let p = 0;
      const t = setInterval(() => {
        p += 6 + Math.random() * 6;
        if (p >= 98) { p = 98; clearInterval(t); }
        this.set(p, 'Working…');
      }, 40);
      setTimeout(() => { this.set(100, 'Done'); setTimeout(() => { this.hide(); resolve(); }, 400); }, ms);
    });
  }
}

/* =========================================================
   6.  DARK-MODE TOGGLE HELPER  (PERSISTENCE FIXED)
   ========================================================= */
const darkCSS = document.getElementById('dark-mode-css');
const STORAGE_KEY = 'pc_darkMode';

export const DarkMode = {
  init() {
    if (!darkCSS) return;
    if (localStorage.getItem(STORAGE_KEY) === null) localStorage.setItem(STORAGE_KEY, 'false');
    this.set(localStorage.getItem(STORAGE_KEY) === 'true');
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem(STORAGE_KEY) === null) this.set(e.matches);
    });
  },
  toggle(checked) { this.set(checked); localStorage.setItem(STORAGE_KEY, checked); },
  set(on) { document.body.classList.toggle('dark-mode', on); if (darkCSS) darkCSS.disabled = !on; }
};

/* =========================================================
   7.  GLOBAL EXPORTS
   ========================================================= */
Object.assign(window, { Utils, Validation, AppState, ToastManager, ProgressManager, DarkMode });
export default Utils;
export { Validation, AppState, ToastManager, ProgressManager };