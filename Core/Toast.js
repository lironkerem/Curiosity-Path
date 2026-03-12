/**
 * Toast Notification System
 * Queue-based toast manager that prevents stacking and supports deduplication
 * 
 * Usage:
 *   showToast('Success!', 'success');
 *   showToast('Error occurred', 'error', 'unique-key');
 *   clearToasts();
 */

/* global window, document */

/* --------------------------------------------------
   CONSTANTS
   -------------------------------------------------- */

const TOAST_CONFIG = {
  ANIMATION_DELAY: 10,      // Delay before showing animation
  SHOW_DURATION: 3000,      // How long toast stays visible
  FADE_OUT_DURATION: 400,   // Fade out animation duration
  QUEUE_SPACING: 200,       // Delay between consecutive toasts
  CONTAINER_ID: 'toast-container'
};

const TOAST_ICONS = {
  info: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
  success: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
};

/* --------------------------------------------------
   TOAST QUEUE CLASS
   -------------------------------------------------- */

class ToastQueue {
  constructor() {
    this.queue = [];
    this.isShowing = false;
    this.currentToast = null;
    this.containerCache = null;
    this.observerSetup = false;
  }

  /**
   * Show a toast notification
   * @param {string} msg - Message to display
   * @param {string} type - Toast type (info, success, warning, error)
   * @param {string|null} key - Unique key for deduplication
   * @param {Object} options - Additional options
   */
  async show(msg, type = 'info', key = null, options = {}) {
    const {
      duration = TOAST_CONFIG.SHOW_DURATION,
      dismissible = false,
      icon = TOAST_ICONS[type]
    } = options;

    // Deduplicate by key
    if (key && this.queue.some(t => t.key === key)) {
      return;
    }

    this.queue.push({ msg, type, key, duration, dismissible, icon });
    
    if (!this.isShowing) {
      await this.processQueue();
    }
  }

  /**
   * Process toast queue
   */
  async processQueue() {
    if (!this.queue.length) {
      this.isShowing = false;
      return;
    }

    this.isShowing = true;
    const item = this.queue.shift();
    const container = this.getContainer();

    if (!container) {
      console.error(`Toast container "#${TOAST_CONFIG.CONTAINER_ID}" not found in DOM`);
      this.isShowing = false;
      this.queue = [];
      return;
    }

    // Remove previous toast if still present
    if (this.currentToast?.parentNode) {
      this.currentToast.remove();
    }

    // Create toast element
    const toast = this.createToastElement(item);
    this.currentToast = toast;
    container.appendChild(toast);

    // Show animation
    setTimeout(() => toast.classList.add('show'), TOAST_CONFIG.ANIMATION_DELAY);

    // Wait for display duration
    await this.waitForToast(toast, item.duration);

    // Small delay between toasts
    await this.sleep(TOAST_CONFIG.QUEUE_SPACING);

    // Process next in queue
    await this.processQueue();
  }

  /**
   * Create toast DOM element
   * @param {Object} item - Toast item data
   * @returns {HTMLElement} Toast element
   */
  createToastElement(item) {
    const toast = document.createElement('div');
    toast.className = `toast ${item.type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Add icon if provided
    if (item.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'toast-icon';
      iconSpan.innerHTML = item.icon;
      toast.appendChild(iconSpan);
    }

    // Add message
    const msgSpan = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = item.msg;
    toast.appendChild(msgSpan);

    // Add dismiss button if dismissible
    if (item.dismissible) {
      const dismissBtn = document.createElement('button');
      dismissBtn.className = 'toast-dismiss';
      dismissBtn.textContent = '×';
      dismissBtn.setAttribute('aria-label', 'Dismiss notification');
      dismissBtn.addEventListener('click', () => {
        this.dismissToast(toast);
      });
      toast.appendChild(dismissBtn);
    }

    return toast;
  }

  /**
   * Wait for toast display duration
   * @param {HTMLElement} toast - Toast element
   * @param {number} duration - Display duration in ms
   * @returns {Promise} Resolves when toast is hidden
   */
  waitForToast(toast, duration) {
    return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        this.hideToast(toast, resolve);
      }, duration);

      // Store timeout ID for early dismissal
      toast._timeoutId = timeoutId;
    });
  }

  /**
   * Hide toast with animation
   * @param {HTMLElement} toast - Toast element
   * @param {Function} callback - Called when hidden
   */
  hideToast(toast, callback) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
      if (this.currentToast === toast) {
        this.currentToast = null;
      }
      if (callback) callback();
    }, TOAST_CONFIG.FADE_OUT_DURATION);
  }

  /**
   * Dismiss toast immediately (user interaction)
   * @param {HTMLElement} toast - Toast element
   */
  dismissToast(toast) {
    // Clear timeout
    if (toast._timeoutId) {
      clearTimeout(toast._timeoutId);
    }
    this.hideToast(toast);
  }

  /**
   * Get or cache toast container
   * @returns {HTMLElement|null} Container element
   */
  getContainer() {
    // Return cached container if still in DOM
    if (this.containerCache && document.contains(this.containerCache)) {
      return this.containerCache;
    }

    // Find and cache container
    this.containerCache = document.getElementById(TOAST_CONFIG.CONTAINER_ID);
    
    if (!this.containerCache) {
      console.warn(`Toast container "#${TOAST_CONFIG.CONTAINER_ID}" not found. Creating one.`);
      this.createContainer();
    }

    return this.containerCache;
  }

  /**
   * Create toast container if missing
   */
  createContainer() {
    const container = document.createElement('div');
    container.id = TOAST_CONFIG.CONTAINER_ID;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
    this.containerCache = container;
  }

  /**
   * Clear all toasts
   */
  clear() {
    this.queue = [];
    
    if (this.currentToast?.parentNode) {
      if (this.currentToast._timeoutId) {
        clearTimeout(this.currentToast._timeoutId);
      }
      this.hideToast(this.currentToast);
    }
    
    this.isShowing = false;
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current queue length
   * @returns {number} Number of pending toasts
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * Check if currently showing a toast
   * @returns {boolean} True if showing
   */
  isActive() {
    return this.isShowing;
  }
}

/* --------------------------------------------------
   SINGLETON INSTANCE
   -------------------------------------------------- */

// Create module-level singleton (no window pollution)
let toastQueue = null;

/**
 * Get or create toast queue instance
 * @returns {ToastQueue} Singleton instance
 */
function getToastQueue() {
  if (!toastQueue) {
    toastQueue = new ToastQueue();
  }
  return toastQueue;
}

/* --------------------------------------------------
   PUBLIC API
   -------------------------------------------------- */

/**
 * Show a toast notification
 * @param {string} msg - Message to display
 * @param {string} type - Toast type (info, success, warning, error)
 * @param {string|null} key - Optional unique key for deduplication
 * @param {Object} options - Additional options
 * @returns {Promise} Resolves when toast is queued
 */
export const showToast = (msg, type = 'info', key = null, options = {}) => {
  return getToastQueue().show(msg, type, key, options);
};

/**
 * Clear all pending and current toasts
 */
export const clearToasts = () => {
  getToastQueue().clear();
};

/**
 * Get current queue length
 * @returns {number} Number of pending toasts
 */
export const getToastQueueLength = () => {
  return getToastQueue().getQueueLength();
};

/**
 * Check if toast system is active
 * @returns {boolean} True if showing or has queued toasts
 */
export const isToastActive = () => {
  return getToastQueue().isActive();
};

/* --------------------------------------------------
   DEVELOPMENT UTILITIES
   -------------------------------------------------- */

// Expose in development for debugging
if (typeof window !== 'undefined' && import.meta.url.includes('localhost')) {
  window.__toast = {
    show: showToast,
    clear: clearToasts,
    getQueue: () => getToastQueue(),
    config: TOAST_CONFIG
  };
}