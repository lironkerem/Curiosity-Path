/**
 * Toast Notification System
 * Queue-based toast manager that prevents stacking and supports deduplication.
 *
 * Usage:
 *   showToast('Success!', 'success');
 *   showToast('Error occurred', 'error', 'unique-key');
 *   clearToasts();
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const TOAST_CONFIG = {
  ANIMATION_DELAY:   10,
  SHOW_DURATION:     3000,
  FADE_OUT_DURATION: 400,
  QUEUE_SPACING:     200,
  CONTAINER_ID:      'toast-container',
  MAX_MSG_LENGTH:    200 // truncate runaway messages
};

// All SVGs carry aria-hidden so screen readers use the role="alert" text only
const TOAST_ICONS = {
  info:    '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
  success: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error:   '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

// ─── ToastQueue ───────────────────────────────────────────────────────────────

class ToastQueue {
  constructor() {
    this.queue          = [];
    this.isShowing      = false;
    this.currentToast   = null;
    this.containerCache = null;
  }

  /**
   * Enqueue a toast notification.
   * @param {string}      msg        - Message text (will be text-content set, not innerHTML)
   * @param {string}      type       - 'info' | 'success' | 'warning' | 'error'
   * @param {string|null} key        - Optional deduplication key
   * @param {Object}      options    - { duration, dismissible, icon }
   */
  async show(msg, type = 'info', key = null, options = {}) {
    const {
      duration    = TOAST_CONFIG.SHOW_DURATION,
      dismissible = false,
      icon        = TOAST_ICONS[type] || TOAST_ICONS.info
    } = options;

    // Deduplicate by key
    if (key && this.queue.some(t => t.key === key)) return;

    // Sanitise message — truncate and ensure string
    const safeMsg = String(msg ?? '').slice(0, TOAST_CONFIG.MAX_MSG_LENGTH);

    this.queue.push({ msg: safeMsg, type, key, duration, dismissible, icon });
    if (!this.isShowing) await this.processQueue();
  }

  async processQueue() {
    if (!this.queue.length) { this.isShowing = false; return; }

    this.isShowing = true;
    const item      = this.queue.shift();
    const container = this.getContainer();

    if (!container) {
      console.error(`[Toast] Container "#${TOAST_CONFIG.CONTAINER_ID}" not found`);
      this.isShowing = false;
      this.queue     = [];
      return;
    }

    if (this.currentToast?.parentNode) this.currentToast.remove();

    const toast       = this.createToastElement(item);
    this.currentToast = toast;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), TOAST_CONFIG.ANIMATION_DELAY);
    await this.waitForToast(toast, item.duration);
    await this.sleep(TOAST_CONFIG.QUEUE_SPACING);
    await this.processQueue();
  }

  createToastElement(item) {
    const toast = document.createElement('div');
    toast.className = `toast ${item.type}`;
    // role="alert" for error/warning, role="status" for info/success
    toast.setAttribute('role', (item.type === 'error' || item.type === 'warning') ? 'alert' : 'status');
    toast.setAttribute('aria-live', (item.type === 'error' || item.type === 'warning') ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');

    if (item.icon) {
      const iconSpan     = document.createElement('span');
      iconSpan.className = 'toast-icon';
      iconSpan.innerHTML = item.icon; // safe — controlled SVG strings from TOAST_ICONS
      toast.appendChild(iconSpan);
    }

    // Use textContent (not innerHTML) to prevent XSS
    const msgSpan     = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = item.msg;
    toast.appendChild(msgSpan);

    if (item.dismissible) {
      const btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'toast-dismiss';
      btn.textContent = '×';
      btn.setAttribute('aria-label', 'Dismiss notification');
      btn.addEventListener('click', () => this.dismissToast(toast), { once: true });
      toast.appendChild(btn);
    }

    return toast;
  }

  waitForToast(toast, duration) {
    return new Promise(resolve => {
      toast._timeoutId = setTimeout(() => this.hideToast(toast, resolve), duration);
    });
  }

  hideToast(toast, callback) {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.parentNode?.removeChild(toast);
      if (this.currentToast === toast) this.currentToast = null;
      callback?.();
    }, TOAST_CONFIG.FADE_OUT_DURATION);
  }

  dismissToast(toast) {
    if (toast._timeoutId) clearTimeout(toast._timeoutId);
    this.hideToast(toast);
  }

  getContainer() {
    if (this.containerCache && document.contains(this.containerCache)) {
      return this.containerCache;
    }
    this.containerCache = document.getElementById(TOAST_CONFIG.CONTAINER_ID);
    if (!this.containerCache) {
      console.warn(`[Toast] Container not found — creating fallback.`);
      this.createContainer();
    }
    return this.containerCache;
  }

  createContainer() {
    const el   = document.createElement('div');
    el.id      = TOAST_CONFIG.CONTAINER_ID;
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
    document.body.appendChild(el);
    this.containerCache = el;
  }

  clear() {
    this.queue = [];
    if (this.currentToast) {
      if (this.currentToast._timeoutId) clearTimeout(this.currentToast._timeoutId);
      this.hideToast(this.currentToast);
    }
    this.isShowing = false;
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  getQueueLength() { return this.queue.length; }
  isActive()       { return this.isShowing; }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let toastQueue = null;
function getToastQueue() {
  if (!toastQueue) toastQueue = new ToastQueue();
  return toastQueue;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Show a toast notification.
 * @param {string}      msg     - Message to display
 * @param {string}      type    - 'info' | 'success' | 'warning' | 'error'
 * @param {string|null} key     - Optional deduplication key
 * @param {Object}      options - { duration, dismissible, icon }
 */
export const showToast = (msg, type = 'info', key = null, options = {}) =>
  getToastQueue().show(msg, type, key, options);

/** Clear all pending and current toasts. */
export const clearToasts = () => getToastQueue().clear();

/** @returns {number} Number of pending toasts */
export const getToastQueueLength = () => getToastQueue().getQueueLength();

/** @returns {boolean} True if showing or has queued toasts */
export const isToastActive = () => getToastQueue().isActive();

// ─── Dev utilities (localhost only) ──────────────────────────────────────────
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.__toast = { show: showToast, clear: clearToasts, getQueue: getToastQueue, config: TOAST_CONFIG };
}
