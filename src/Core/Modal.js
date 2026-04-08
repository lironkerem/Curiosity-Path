/**
 * Modal System
 * Confirmation dialogs, prompts, alerts, and app-level modals with neumorphic styling.
 */

import { renderAvatarIcon, EMOJI_TO_KEY } from './avatar-icons.js';
import { showToast }                       from './Toast.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str ?? '');
  return div.innerHTML;
}

/** Safe localStorage wrapper */
const ls = {
  set:    (k, v) => { try { localStorage.setItem(k, v); }  catch { /* noop */ } },
  get:    k      => { try { return localStorage.getItem(k); } catch { return null; } }
};

/**
 * Create a modal overlay with Escape/outside-click close and basic focus trap.
 * @param {string}   content   - Inner HTML for the modal card
 * @param {Function} [onClose] - Optional cleanup callback
 * @returns {{ overlay: HTMLElement, cleanup: Function }}
 */
function createModalOverlay(content, onClose = null) {
  const overlay         = document.createElement('div');
  overlay.className     = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML     = content;
  document.body.appendChild(overlay);

  // Return focus to previously focused element on close
  const previouslyFocused = document.activeElement;

  let escapeHandler = null;

  const cleanup = () => {
    overlay.style.opacity = '0';
    document.removeEventListener('keydown', escapeHandler);
    setTimeout(() => {
      overlay.remove();
      previouslyFocused?.focus();
      onClose?.();
    }, 200);
  };

  escapeHandler = e => { if (e.key === 'Escape') cleanup(); };
  document.addEventListener('keydown', escapeHandler);

  overlay.addEventListener('click', e => { if (e.target === overlay) cleanup(); });

  // Auto-focus first focusable element
  setTimeout(() => {
    const first = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    first?.focus();
  }, 50);

  return { overlay, cleanup };
}

// ─── NeumorphicModal ──────────────────────────────────────────────────────────

export class NeumorphicModal {
  /**
   * Show a confirmation dialog.
   */
  static showConfirm(msg, onConfirm, opts = {}) {
    const {
      title       = 'Confirm Action',
      confirmText = 'Confirm',
      cancelText  = 'Cancel',
      isDanger    = false,
      icon        = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    } = opts;

    const content = `
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${icon}</div>
          <h3 class="modal-title" id="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${escapeHtml(cancelText)}</button>
          <button type="button" class="btn btn-primary modal-confirm ${isDanger ? 'modal-btn-danger' : ''}">${escapeHtml(confirmText)}</button>
        </div>
      </div>`;

    const { overlay, cleanup } = createModalOverlay(content);
    overlay.setAttribute('aria-labelledby', 'modal-title');
    overlay.querySelector('.modal-cancel').addEventListener('click', cleanup);
    overlay.querySelector('.modal-confirm').addEventListener('click', () => {
      cleanup();
      onConfirm?.();
    });
  }

  /**
   * Show a prompt dialog.
   */
  static showPrompt(msg, def, onConfirm, opts = {}) {
    const {
      title       = 'Edit Entry',
      confirmText = 'Save',
      cancelText  = 'Cancel',
      placeholder = 'Enter text...',
      icon        = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
      multiline   = false
    } = opts;

    const inputId = 'modal-prompt-input';
    const inputEl = multiline
      ? `<textarea id="${inputId}" class="form-input" rows="4" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}">${escapeHtml(def || '')}</textarea>`
      : `<input id="${inputId}" type="text" class="form-input" placeholder="${escapeHtml(placeholder)}" aria-label="${escapeHtml(placeholder)}" value="${escapeHtml(def || '')}">`;

    const content = `
      <div class="neuro-modal" role="document">
        <div class="modal-header">
          <div class="modal-icon icon-small" aria-hidden="true">${icon}</div>
          <h3 class="modal-title" id="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-input-wrapper">${inputEl}</div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${escapeHtml(cancelText)}</button>
          <button type="button" class="btn btn-primary modal-confirm">${escapeHtml(confirmText)}</button>
        </div>
      </div>`;

    const { overlay, cleanup } = createModalOverlay(content);
    overlay.setAttribute('aria-labelledby', 'modal-title');
    const input = overlay.querySelector('input, textarea');

    const submit = () => {
      const v = input.value.trim();
      if (v) { cleanup(); onConfirm?.(v); }
    };

    setTimeout(() => { input.focus(); input.select?.(); }, 100);

    overlay.querySelector('.modal-cancel').addEventListener('click', cleanup);
    overlay.querySelector('.modal-confirm').addEventListener('click', submit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !multiline) { e.preventDefault(); submit(); }
      if (e.key === 'Escape') cleanup();
    });
  }

  /**
   * Show an alert dialog.
   */
  static showAlert(msg, opts = {}) {
    const {
      title      = 'Notice',
      buttonText = 'OK',
      type       = 'info',
      icon       = null
    } = opts;

    const icons = {
      info:    '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',
      success: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      warning: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      error:   '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };

    const content = `
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${icon || icons[type] || icons.info}</div>
          <h3 class="modal-title" id="modal-title">${escapeHtml(title)}</h3>
          <p class="modal-message">${escapeHtml(msg)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary modal-confirm" style="width:100%">${escapeHtml(buttonText)}</button>
        </div>
      </div>`;

    const { overlay, cleanup } = createModalOverlay(content);
    overlay.setAttribute('aria-labelledby', 'modal-title');
    overlay.querySelector('.modal-confirm').addEventListener('click', cleanup);
  }
}

// ─── Profile & Avatar ─────────────────────────────────────────────────────────

/**
 * Save user profile from the quick-edit dropdown.
 * Input lengths are capped to prevent oversized localStorage writes.
 */
export function saveQuickProfile(app) {
  const u = app.state.currentUser;
  u.name       = (document.getElementById('dropdown-displayname')?.value.trim() || 'Seeker').slice(0, 100);
  u.email      = (document.getElementById('dropdown-email')?.value.trim()       || '').slice(0, 254);
  u.phone      = (document.getElementById('dropdown-phone')?.value.trim()       || '').slice(0, 20);
  u.birthday   =  document.getElementById('dropdown-birthday')?.value           || '';
  u.avatarEmoji = document.getElementById('dropdown-emoji')?.value              || '';
  ls.set('pc_user', JSON.stringify(u));
  refreshAvatar(app);
  showToast('Profile saved ✔', 'success');
}

/**
 * Refresh avatar display elements in the UI.
 */
export function refreshAvatar(app) {
  const u   = app.state.currentUser;
  const img = document.getElementById('user-avatar-img');
  const em  = document.getElementById('user-avatar-emoji');
  const pre = document.getElementById('avatar-preview');

  if (u.avatarFile) {
    if (img) { img.src = u.avatarFile; img.style.display = 'block'; }
    if (em)  em.style.display = 'none';
    if (pre) {
      // Build img element safely (no innerHTML with user data)
      pre.textContent = '';
      const avatarImg   = document.createElement('img');
      avatarImg.src     = u.avatarFile;
      avatarImg.alt     = 'User avatar';
      avatarImg.width   = 80;
      avatarImg.height  = 80;
      avatarImg.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover';
      avatarImg.loading = 'lazy';
      avatarImg.decoding = 'async';
      pre.appendChild(avatarImg);
    }
  } else {
    if (img) img.style.display = 'none';
    if (em) {
      em.style.display = 'block';
      // Use renderAvatarIcon so we always get a valid SVG, never raw user data in innerHTML
      em.innerHTML = renderAvatarIcon(u.avatarEmoji || 'user');
    }
    if (pre) pre.innerHTML = renderAvatarIcon(u.avatarEmoji || 'user');
  }

  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = u.name || 'Seeker'; // textContent — not innerHTML
}

/**
 * Handle avatar file upload — resizes to 50×50 and stores as data URL.
 * Validates file type before processing.
 */
export function avatarUploadHandler(app) {
  const file = document.getElementById('avatar-upload')?.files?.[0];
  if (!file) return;

  // Security: only accept image MIME types
  if (!file.type.startsWith('image/')) {
    showToast('Please upload an image file', 'error');
    return;
  }

  const reader    = new FileReader();
  reader.onload   = e => {
    const img   = new Image();
    img.onload  = () => {
      const canvas  = document.createElement('canvas');
      canvas.width  = canvas.height = 50;
      canvas.getContext('2d').drawImage(img, 0, 0, 50, 50);
      app.state.currentUser.avatarFile  = canvas.toDataURL('image/png');
      app.state.currentUser.avatarEmoji = '';
      refreshAvatar(app);
    };
    img.onerror = () => showToast('Could not load image', 'error');
    img.src     = e.target.result;
  };
  reader.onerror  = () => showToast('Could not read file', 'error');
  reader.readAsDataURL(file);
}

// ─── Modal builders ───────────────────────────────────────────────────────────

/**
 * Build and display a named modal card.
 * The `innerHTML` param is trusted HTML from internal generators only —
 * never pass raw user data here.
 */
export function buildModal(app, id, title, innerHTML) {
  document.getElementById(`${id}-modal`)?.remove();

  const modal      = document.createElement('div');
  modal.id         = `${id}-modal`;
  modal.className  = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', `${id}-modal-title`);
  modal.innerHTML  = `
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="${id}-modal-title">${escapeHtml(title)}</h2>
        <button type="button" class="modal-close-btn" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">${innerHTML}</div>
    </div>`;

  document.body.appendChild(modal);

  const previouslyFocused = document.activeElement;
  const close = () => {
    modal.remove();
    previouslyFocused?.focus();
  };

  modal.querySelector('.modal-close-btn').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
  });

  // Auto-focus first interactive element
  setTimeout(() => {
    modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus();
  }, 50);

  modal._app = app;
  return modal;
}

export function openSettings(app) {
  const modal = buildModal(app, 'settings', 'Settings', settingsModalContent());
  attachSettingsHandlers(modal, app);
}

export function openAbout(app)   { buildModal(app, 'about',   'About',           aboutModalContent());        }
export function openContact(app) {
  const modal = buildModal(app, 'contact', 'Contact us', contactModalContent());
  attachContactHandlers(modal, app);
}
export function openBilling(app) {
  const modal = buildModal(app, 'billing', 'Choose your plan', billingModalContent(app));
  attachBillingHandlers(modal, app);
}

// ─── Modal content ────────────────────────────────────────────────────────────

export const settingsModalContent = () => `
  <div class="settings-tabs" role="tablist">
    <button type="button" class="tab-btn active" data-tab="general" role="tab" aria-selected="true"  aria-controls="general">General</button>
    <button type="button" class="tab-btn"         data-tab="privacy" role="tab" aria-selected="false" aria-controls="privacy">Privacy</button>
    <button type="button" class="tab-btn"         data-tab="notifs"  role="tab" aria-selected="false" aria-controls="notifs">Notifications</button>
    <button type="button" class="tab-btn"         data-tab="data"    role="tab" aria-selected="false" aria-controls="data">Data</button>
  </div>
  <div id="general" class="tab-pane active" role="tabpanel" aria-labelledby="tab-general">
    <label for="settings-lang">App language</label>
    <select id="settings-lang" class="form-input"><option>English</option></select>
    <label for="settings-theme">Theme</label>
    <select id="settings-theme" class="form-input"><option>Neumorphic Light</option></select>
    <label for="settings-reminder">Daily reminder</label>
    <input id="settings-reminder" type="time" class="form-input" aria-label="Select reminder time">
  </div>
  <div id="privacy" class="tab-pane" role="tabpanel" aria-labelledby="tab-privacy">
    <label><input type="checkbox"> Allow analytics</label>
    <label><input type="checkbox"> Share progress with friends</label>
  </div>
  <div id="notifs" class="tab-pane" role="tabpanel" aria-labelledby="tab-notifs">
    <label><input type="checkbox" checked> Morning quote</label>
    <label><input type="checkbox" checked> Streak reminder</label>
  </div>
  <div id="data" class="tab-pane" role="tabpanel" aria-labelledby="tab-data">
    <p>Download everything we store about you.</p>
    <button type="button" class="btn btn-secondary export-data-btn">Export JSON</button>
  </div>`;

export const aboutModalContent = () => `
  <p>Digital Curiosity v1.0<br>
  Built with ❤️ by Aanandoham.<br>
  Licences: MIT (code), CC-BY (images).</p>`;

export const contactModalContent = () => `
  <form class="contact-form" novalidate>
    <label for="contact-subject">Subject</label>
    <input id="contact-subject" class="form-input" name="subject" placeholder="Subject" maxlength="150" required>
    <label for="contact-body">Message</label>
    <textarea id="contact-body" class="form-input" name="body" rows="4" placeholder="Your message" maxlength="2000" required></textarea>
    <button type="submit" class="btn btn-primary">Send</button>
  </form>`;

export const billingModalContent = (app) => `
  <div class="plans-grid">
    ${(app.plans || []).map(p => `
      <div class="plan-card ${escapeHtml(p.id)}">
        <div class="plan-price">${escapeHtml(p.price)}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <ul>${(p.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
        ${app.state.currentUser.plan === p.id
          ? '<span class="badge badge-success">Current</span>'
          : `<button type="button" class="btn btn-primary select-plan-btn" data-plan="${escapeHtml(p.id)}">Choose</button>`
        }
      </div>`).join('')}
  </div>`;

// ─── Handlers ─────────────────────────────────────────────────────────────────

function attachSettingsHandlers(modal, app) {
  const tabs  = modal.querySelectorAll('.tab-btn');
  const panes = modal.querySelectorAll('.tab-pane');

  tabs.forEach(btn => btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    // Validate tab name is one of the known tabs (prevents selector injection)
    if (!['general', 'privacy', 'notifs', 'data'].includes(target)) return;
    tabs.forEach(t  => { t.classList.remove('active');  t.setAttribute('aria-selected', 'false'); });
    panes.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    modal.querySelector(`#${target}`)?.classList.add('active');
  }));

  modal.querySelector('.export-data-btn')?.addEventListener('click', () => {
    app.exportUserData?.();
  });
}

function attachContactHandlers(modal, app) {
  modal.querySelector('.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    app.sendContact?.(e);
  });
}

function attachBillingHandlers(modal, app) {
  modal.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => selectPlan(app, btn.dataset.plan));
  });
}

export const selectPlan = (app, planId) => {
  showToast(`Plan "${escapeHtml(planId)}" selected – payment integration needed`, 'info');
};

/** @deprecated Use data-tab attributes and attachSettingsHandlers instead */
export const switchSettingTab = (ev, tab) => {
  // Validate tab to prevent selector injection
  if (!['general', 'privacy', 'notifs', 'data'].includes(tab)) return;
  const container = ev.target.closest('.modal-card');
  if (!container) return;
  container.querySelectorAll('.tab-btn').forEach(b  => b.classList.remove('active'));
  ev.target.classList.add('active');
  container.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  container.querySelector(`#${tab}`)?.classList.add('active');
};
