// Mini-Apps/ShadowAlchemyLab/js/modal.js
// Patched: type=button, role=dialog, aria-modal, aria-labelledby, esc() for title/subtitle.

// XSS escape for values inserted into HTML
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function createModal({ id, title, subtitle, content, actions, onClose }) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id        = id;
  modal.className = 'modal-overlay';
  modal.style.zIndex = '10000';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', `${id}-title`);

  modal.innerHTML = `
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--spacing-md)">
        <div style="flex:1">
          <h3 id="${id}-title" style="margin:0">${esc(title)}</h3>
          ${subtitle ? `<p class="muted" style="margin-top:var(--spacing-xs)">${esc(subtitle)}</p>` : ''}
        </div>
        <button type="button" class="btn modal-close-btn" aria-label="Close modal"
                style="padding:8px 12px;font-size:1.2rem;margin-left:var(--spacing-md);flex-shrink:0">\u2715</button>
      </div>
      ${content}
      <div class="modal-actions">${actions}</div>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('active'));

  const closeModal = () => {
    modal.remove();
    if (typeof onClose === 'function') onClose();
  };

  modal.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Keyboard: close on Escape
  const onKeyDown = e => { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKeyDown); } };
  document.addEventListener('keydown', onKeyDown);

  return { modal, closeModal };
}
