// Mini-Apps/ShadowAlchemyLab/js/core/utils.js
// Patched: showConfirmDialog rebuilt via DOM API (no innerHTML with user content),
// type=button on all buttons, aria attrs on modal, textContent for toast.

export function getCompanionVisual(level) {
  const stages = Object.freeze(['\uD83C\uDF31 Seedling', '\uD83D\uDD25 Flame', '\uD83D\uDC0D Serpent', '\uD83D\uDD4A\uFE0F Phoenix', '\uD83D\uDCAB Light-Being', '\u2728 Ascended']);
  return stages[Math.min(Math.max(0, level - 1), stages.length - 1)];
}

export function getArchetypeIcon(id) {
  const map = Object.freeze({ hero: '\uD83C\uDF15', lover: '\uD83C\uDF38', warrior: '\uD83D\uDD25', sage: '\uD83D\uDC8E', healer: '\uD83C\uDF0A', shadow: '\uD83C\uDF11' });
  return map[id] || '\uD83D\uDD2E';
}

export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.textContent = String(message); // XSS safe
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

export function showConfirmDialog(message, onConfirm, onCancel) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '10000';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'confirm-dialog-title');

  const card = document.createElement('div');
  card.className = 'modal-card';
  card.style.cssText = 'max-width:400px;padding:var(--spacing-xl)';

  const title = document.createElement('h3');
  title.id = 'confirm-dialog-title';
  title.style.cssText = 'margin:0 0 var(--spacing-md);text-align:center';
  title.textContent = 'Confirm Deletion';

  const msg = document.createElement('p');
  msg.style.cssText = 'color:var(--neuro-text-light);text-align:center;margin-bottom:var(--spacing-xl)';
  msg.textContent = String(message); // XSS safe

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:var(--spacing-sm);justify-content:center';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.id = 'confirm-cancel';
  cancelBtn.className = 'btn';
  cancelBtn.style.flex = '1';
  cancelBtn.textContent = 'Cancel';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.id = 'confirm-delete';
  deleteBtn.className = 'btn btn-primary';
  deleteBtn.style.cssText = 'flex:1;background:linear-gradient(135deg,#ef4444,#dc2626)';
  deleteBtn.textContent = 'Delete';

  btnRow.append(cancelBtn, deleteBtn);
  card.append(title, msg, btnRow);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  cancelBtn.addEventListener('click', () => { close(); if (typeof onCancel === 'function') onCancel(); });
  deleteBtn.addEventListener('click', () => { close(); if (typeof onConfirm === 'function') onConfirm(); });
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
}
