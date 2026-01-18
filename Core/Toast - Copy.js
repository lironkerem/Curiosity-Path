// Toast.js - Queue System to prevent stacking toasts
/* global window, document */

class ToastQueue {
  constructor() {
    this.queue = [];
    this.isShowing = false;
    this.currentToast = null;
  }

  async show(msg, type = 'info') {
    this.queue.push({ msg, type });
    if (!this.isShowing) await this.processQueue();
  }

  async processQueue() {
    if (!this.queue.length) { this.isShowing = false; return; }
    this.isShowing = true;
    const { msg, type } = this.queue.shift();
    const container = document.getElementById('toast-container');
    if (!container) { this.isShowing = false; this.queue = []; return; }

    if (this.currentToast?.parentNode) this.currentToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = msg;
    this.currentToast = toast;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    await new Promise(resolve => {
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => { toast.remove(); this.currentToast = null; resolve(); }, 400);
      }, 1500);
    });
    await new Promise(r => setTimeout(r, 200));
    await this.processQueue();
  }

  clear() {
    this.queue = [];
    if (this.currentToast?.parentNode) {
      this.currentToast.classList.remove('show');
      setTimeout(() => this.currentToast?.remove(), 400);
    }
    this.isShowing = false;
  }
}

const toastQueue = new ToastQueue();

export const showToast = (msg, type = 'info') => toastQueue.show(msg, type);
export const clearToasts = () => toastQueue.clear();