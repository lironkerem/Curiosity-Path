/**
 * Toast Notification System
 * Queue-based toast manager with deduplication.
 */

/* --------------------------------------------------
   CONSTANTS
   -------------------------------------------------- */

const TOAST_CONFIG = {
  ANIMATION_DELAY:  10,
  SHOW_DURATION:    3000,
  FADE_OUT_DURATION: 400,
  QUEUE_SPACING:    200,
  CONTAINER_ID:     'toast-container'
};

const TOAST_ICONS = {
  info:    '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
  success: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error:   '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

/* --------------------------------------------------
   TOAST QUEUE CLASS
   -------------------------------------------------- */

class ToastQueue {
  constructor() {
    this.queue          = [];
    this.isShowing      = false;
    this.currentToast   = null;
    this.containerCache = null;
  }

  async show(msg, type = 'info', key = null, options = {}) {
    const {
      duration    = TOAST_CONFIG.SHOW_DURATION,
      dismissible = false,
      icon        = TOAST_ICONS[type]
    } = options;

    if (key && this.queue.some(t => t.key === key)) return;

    this.queue.push({ msg, type, key, duration, dismissible, icon });
    if (!this.isShowing) await this.processQueue();
  }

  async processQueue() {
    if (!this.queue.length) { this.isShowing = false; return; }

    this.isShowing = true;
    const item      = this.queue.shift();
    const container = this.getContainer();

    if (!container) {
      console.error(`Toast container "#${TOAST_CONFIG.CONTAINER_ID}" not found`);
      this.isShowing = false;
      this.queue = [];
      return;
    }

    if (this.currentToast?.parentNode) this.currentToast.remove();

    const toast = this.createToastElement(item);
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
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    if (item.icon) {
      const s = document.createElement('span');
      s.className = 'toast-icon';
      s.innerHTML = item.icon;
      toast.appendChild(s);
    }

    const m = document.createElement('span');
    m.className = 'toast-message';
    m.textContent = item.msg;
    toast.appendChild(m);

    if (item.dismissible) {
      const btn = document.createElement('button');
      btn.className = 'toast-dismiss';
      btn.textContent = '×';
      btn.setAttribute('aria-label', 'Dismiss notification');
      btn.addEventListener('click', () => this.dismissToast(toast));
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
    if (this.containerCache && document.contains(this.containerCache)) return this.containerCache;
    this.containerCache = document.getElementById(TOAST_CONFIG.CONTAINER_ID);
    if (!this.containerCache) {
      console.warn(`Toast container "#${TOAST_CONFIG.CONTAINER_ID}" not found. Creating one.`);
      const c = document.createElement('div');
      c.id = TOAST_CONFIG.CONTAINER_ID;
      c.setAttribute('aria-live', 'polite');
      c.setAttribute('aria-atomic', 'true');
      document.body.appendChild(c);
      this.containerCache = c;
    }
    return this.containerCache;
  }

  clear() {
    this.queue = [];
    if (this.currentToast?.parentNode) {
      if (this.currentToast._timeoutId) clearTimeout(this.currentToast._timeoutId);
      this.hideToast(this.currentToast);
    }
    this.isShowing = false;
  }

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  getQueueLength() { return this.queue.length; }
  isActive() { return this.isShowing; }
}

/* --------------------------------------------------
   SINGLETON + PUBLIC API
   -------------------------------------------------- */

let toastQueue = null;
const getToastQueue = () => (toastQueue ??= new ToastQueue());

export const showToast         = (msg, type = 'info', key = null, options = {}) => getToastQueue().show(msg, type, key, options);
export const clearToasts       = () => getToastQueue().clear();
export const getToastQueueLength = () => getToastQueue().getQueueLength();
export const isToastActive     = () => getToastQueue().isActive();

/* --------------------------------------------------
   DEV UTILITIES
   -------------------------------------------------- */
if (typeof window !== 'undefined' && import.meta.url.includes('localhost')) {
  window.__toast = { show: showToast, clear: clearToasts, getQueue: getToastQueue, config: TOAST_CONFIG };
}