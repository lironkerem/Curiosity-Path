import { renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';
/**
 * Modal System
 * Provides confirmation dialogs, prompts, and alerts with neumorphic styling
 */

/* global window, document */

import { showToast } from './Toast.js';

/* --------------------------------------------------
   UTILITIES
   -------------------------------------------------- */

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Create modal overlay with cleanup handlers
 * @param {string} content - HTML content
 * @param {Function} onClose - Optional cleanup callback
 * @returns {Object} Modal elements and cleanup function
 */
function createModalOverlay(content, onClose = null) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = content;
  document.body.appendChild(overlay);

  let escapeHandler = null;

  const cleanup = () => {
    overlay.style.opacity = '0';
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
    }
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 200);
  };

  // Escape key handler
  escapeHandler = (e) => {
    if (e.key === 'Escape') cleanup();
  };
  document.addEventListener('keydown', escapeHandler);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) cleanup();
  });

  return { overlay, cleanup };
}

/* --------------------------------------------------
   NEUMORPHIC MODAL SYSTEM
   -------------------------------------------------- */

export class NeumorphicModal {
  /**
   * Show confirmation dialog
   * @param {string} msg - Message to display
   * @param {Function} onConfirm - Callback on confirm
   * @param {Object} opts - Options
   */
  static showConfirm(msg, onConfirm, opts = {}) {
    const {
      title = 'Confirm Action',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      isDanger = false,
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    } = opts;

    const content = `
      <div class="neuro-modal modal-small">
        <div class="modal-header">
          <div class="modal-icon">${icon}</div>
          <h3 class="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-actions">
          <button class="btn modal-cancel">${escapeHtml(cancelText)}</button>
          <button class="btn btn-primary modal-confirm ${isDanger ? 'modal-btn-danger' : ''}">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    const { overlay, cleanup } = createModalOverlay(content);

    overlay.querySelector('.modal-cancel').addEventListener('click', cleanup);
    overlay.querySelector('.modal-confirm').addEventListener('click', () => {
      cleanup();
      if (onConfirm) onConfirm();
    });
  }

  /**
   * Show prompt dialog
   * @param {string} msg - Message to display
   * @param {string} def - Default value
   * @param {Function} onConfirm - Callback with input value
   * @param {Object} opts - Options
   */
  static showPrompt(msg, def, onConfirm, opts = {}) {
    const {
      title = 'Edit Entry',
      confirmText = 'Save',
      cancelText = 'Cancel',
      placeholder = 'Enter text...',
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      multiline = false
    } = opts;

    const inputEl = multiline
      ? `<textarea class="form-input" rows="4" placeholder="${escapeHtml(placeholder)}">${escapeHtml(def || '')}</textarea>`
      : `<input type="text" class="form-input" aria-label="${escapeHtml(placeholder)}" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(def || '')}">`;

    const content = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">${icon}</div>
          <h3 class="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-input-wrapper">${inputEl}</div>
        <div class="modal-actions">
          <button class="btn modal-cancel">${escapeHtml(cancelText)}</button>
          <button class="btn btn-primary modal-confirm">${escapeHtml(confirmText)}</button>
        </div>
      </div>
    `;

    const { overlay, cleanup } = createModalOverlay(content);
    const input = overlay.querySelector('input, textarea');

    const submit = () => {
      const v = input.value.trim();
      if (v) {
        cleanup();
        if (onConfirm) onConfirm(v);
      }
    };

    // Focus and select input
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    overlay.querySelector('.modal-cancel').addEventListener('click', cleanup);
    overlay.querySelector('.modal-confirm').addEventListener('click', submit);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !multiline) {
        e.preventDefault();
        submit();
      }
      if (e.key === 'Escape') cleanup();
    });
  }

  /**
   * Show alert dialog
   * @param {string} msg - Message to display
   * @param {Object} opts - Options
   */
  static showAlert(msg, opts = {}) {
    const {
      title = 'Notice',
      buttonText = 'OK',
      icon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
      type = 'info'
    } = opts;

    const icons = {
      info: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
      success: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };

    const content = `
      <div class="neuro-modal modal-small">
        <div class="modal-header">
          <div class="modal-icon">${icon || icons[type]}</div>
          <h3 class="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary modal-confirm" style="width:100%">${escapeHtml(buttonText)}</button>
        </div>
      </div>
    `;

    const { overlay, cleanup } = createModalOverlay(content);
    overlay.querySelector('.modal-confirm').addEventListener('click', cleanup);
  }
}

/* --------------------------------------------------
   PROFILE & AVATAR MANAGEMENT
   -------------------------------------------------- */

/**
 * Save user profile from quick edit dropdown
 * @param {Object} app - App instance
 */
export function saveQuickProfile(app) {
  const u = app.state.currentUser;
  u.name = document.getElementById('dropdown-displayname').value.trim() || 'Seeker';
  u.email = document.getElementById('dropdown-email').value.trim();
  u.phone = document.getElementById('dropdown-phone').value.trim();
  u.birthday = document.getElementById('dropdown-birthday').value;
  u.avatarEmoji = document.getElementById('dropdown-emoji').value;
  localStorage.setItem('pc_user', JSON.stringify(u));
  refreshAvatar(app);
  showToast('Profile saved ✔', 'success');
}

/**
 * Refresh avatar display in UI
 * @param {Object} app - App instance
 */
export function refreshAvatar(app) {
  const u = app.state.currentUser;
  const img = document.getElementById('user-avatar-img');
  const em = document.getElementById('user-avatar-emoji');
  const avatarPreview = document.getElementById('avatar-preview');

  if (u.avatarFile) {
    img.src = u.avatarFile;
    img.style.display = 'block';
    em.style.display = 'none';
    avatarPreview.innerHTML = `<img src="${u.avatarFile}" alt="User avatar" width="80" height="80" style="width:100%;height:100%;border-radius:50%;object-fit:cover" loading="lazy" decoding="async">`;
  } else {
    img.style.display = 'none';
    em.style.display = 'block';
    em.textContent = u.avatarEmoji || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    avatarPreview.textContent = u.avatarEmoji || '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
  }

  document.getElementById('user-name').textContent = u.name;
}

/**
 * Handle avatar file upload
 * @param {Object} app - App instance
 */
export function avatarUploadHandler(app) {
  const file = document.getElementById('avatar-upload').files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 50;
      canvas.getContext('2d').drawImage(img, 0, 0, 50, 50);
      app.state.currentUser.avatarFile = canvas.toDataURL('image/png');
      app.state.currentUser.avatarEmoji = '';
      refreshAvatar(app);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

/* --------------------------------------------------
   MODAL BUILDERS
   -------------------------------------------------- */

/**
 * Build and show a modal
 * @param {Object} app - App instance
 * @param {string} id - Modal ID
 * @param {string} title - Modal title
 * @param {string} innerHTML - Modal content HTML
 */
export function buildModal(app, id, title, innerHTML) {
  // Remove existing modal if present
  document.getElementById(id + '-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = id + '-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <h3>${escapeHtml(title)}</h3>
        <button class="modal-close-btn">✕</button>
      </div>
      <div class="modal-body">${innerHTML}</div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close button handler
  modal.querySelector('.modal-close-btn').addEventListener('click', () => {
    modal.remove();
  });

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  // Store reference for modal-specific functions
  modal._app = app;

  return modal;
}

/**
 * Open settings modal
 * @param {Object} app - App instance
 */
export function openSettings(app) {
  const modal = buildModal(app, 'settings', 'Settings', settingsModalContent());
  attachSettingsHandlers(modal, app);
}

/**
 * Open about modal
 * @param {Object} app - App instance
 */
export function openAbout(app) {
  buildModal(app, 'about', 'About', aboutModalContent());
}

/**
 * Open contact modal
 * @param {Object} app - App instance
 */
export function openContact(app) {
  const modal = buildModal(app, 'contact', 'Contact us', contactModalContent());
  attachContactHandlers(modal, app);
}

/**
 * Open billing modal
 * @param {Object} app - App instance
 */
export function openBilling(app) {
  const modal = buildModal(app, 'billing', 'Choose your plan', billingModalContent(app));
  attachBillingHandlers(modal, app);
}

/* --------------------------------------------------
   MODAL CONTENT GENERATORS
   -------------------------------------------------- */

/**
 * Generate settings modal content
 */
export const settingsModalContent = () => `
  <div class="settings-tabs">
    <button class="tab-btn active" data-tab="general">General</button>
    <button class="tab-btn" data-tab="privacy">Privacy</button>
    <button class="tab-btn" data-tab="notifs">Notifications</button>
    <button class="tab-btn" data-tab="data">Data</button>
  </div>
  <div id="general" class="tab-pane active">
    <label>App language</label>
    <select class="form-input"><option>English</option></select>
    <label>Theme</label>
    <select class="form-input"><option>Neumorphic Light</option></select>
    <label>Daily reminder</label>
    <input type="time" class="form-input" aria-label="Select time">
  </div>
  <div id="privacy" class="tab-pane">
    <label><input type="checkbox"> Allow analytics</label>
    <label><input type="checkbox"> Share progress with friends</label>
  </div>
  <div id="notifs" class="tab-pane">
    <label><input type="checkbox" checked> Morning quote</label>
    <label><input type="checkbox" checked> Streak reminder</label>
  </div>
  <div id="data" class="tab-pane">
    <p>Download everything we store about you.</p>
    <button class="btn btn-secondary export-data-btn">Export JSON</button>
  </div>
`;

/**
 * Generate about modal content
 */
export const aboutModalContent = () => `
  <p>Digital Curiosity v 1.0<br>
  Built with <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> by Aanandoham.<br>
  Licences: MIT (code), CC-BY (images).</p>
`;

/**
 * Generate contact modal content
 */
export const contactModalContent = () => `
  <form class="contact-form">
    <input class="form-input" name="subject" aria-label="Subject" placeholder="Subject" required>
    <textarea class="form-input" name="body" rows="4" placeholder="Your message" required></textarea>
    <button class="btn btn-primary">Send</button>
  </form>
`;

/**
 * Generate billing modal content
 * @param {Object} app - App instance
 */
export const billingModalContent = (app) => `
  <div class="plans-grid">
    ${app.plans.map(p => `
      <div class="plan-card ${p.id}">
        <div class="plan-price">${escapeHtml(p.price)}</div>
        <h4>${escapeHtml(p.name)}</h4>
        <ul>${p.features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
        ${app.state.currentUser.plan === p.id
          ? '<span class="badge badge-success">Current</span>'
          : `<button class="btn btn-primary select-plan-btn" data-plan="${escapeHtml(p.id)}">Choose</button>`
        }
      </div>
    `).join('')}
  </div>
`;

/* --------------------------------------------------
   EVENT HANDLERS
   -------------------------------------------------- */

/**
 * Attach settings tab switching handlers
 */
function attachSettingsHandlers(modal, app) {
  const tabs = modal.querySelectorAll('.tab-btn');
  const panes = modal.querySelectorAll('.tab-pane');

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      // Update active tab button
      tabs.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');

      // Update active pane
      panes.forEach(p => p.classList.remove('active'));
      modal.querySelector(`#${targetTab}`).classList.add('active');
    });
  });

  // Export data handler
  const exportBtn = modal.querySelector('.export-data-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (app.exportUserData) app.exportUserData();
    });
  }
}

/**
 * Attach contact form handler
 */
function attachContactHandlers(modal, app) {
  const form = modal.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (app.sendContact) app.sendContact(e);
    });
  }
}

/**
 * Attach billing plan selection handlers
 */
function attachBillingHandlers(modal, app) {
  const planBtns = modal.querySelectorAll('.select-plan-btn');
  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.dataset.plan;
      selectPlan(app, planId);
    });
  });
}

/**
 * Handle plan selection
 * @param {Object} app - App instance
 * @param {string} planId - Selected plan ID
 */
export const selectPlan = (app, planId) => {
  showToast(`Plan "${planId}" selected – payment integration needed`, 'info');
};

/**
 * Switch settings tab (legacy - kept for compatibility)
 * @deprecated Use data-tab attributes and attachSettingsHandlers instead
 */
export const switchSettingTab = (ev, tab) => {
  const container = ev.target.closest('.modal-card');
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  ev.target.classList.add('active');
  container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  container.querySelector(`#${tab}`).classList.add('active');
};