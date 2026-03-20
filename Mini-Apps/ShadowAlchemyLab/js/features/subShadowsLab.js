// Mini-Apps/ShadowAlchemyLab/js/features/subShadowsLab.js
// Patched: esc() on all shadow data in HTML, type=button on close button,
// aria-hidden on decorative SVGs, role=button+tabindex on shadow items,
// keyboard (Enter/Space) handler on shadow items.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';

// XSS escape
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function openSubShadowsLabModal() {
  const engine           = window.archetypesEngine;
  const allShadows       = engine.getAllShadows();
  const completedShadows = engine.getCompletedShadows();

  const categories = {
    'Hero Shadows': [], 'Lover Shadows': [], 'Warrior Shadows': [],
    'Sage Shadows': [], 'Healer Shadows': [], 'Shadow Shadows': []
  };
  allShadows.forEach(s => {
    if (categories[s.category]) categories[s.category].push(s);
  });

  const categoriesHTML = Object.entries(categories)
    .filter(([, shadows]) => shadows.length)
    .map(([category, shadows]) => `
      <div style="margin-bottom:var(--spacing-lg)">
        <h4 style="color:var(--neuro-accent);margin-bottom:var(--spacing-sm)">${esc(category)}</h4>
        <div style="display:grid;gap:var(--spacing-sm)">
          ${shadows.map(s => {
            const done = completedShadows.includes(s.id);
            const shadow = done
              ? 'inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light)'
              : '4px 4px 8px var(--neuro-shadow-dark), -4px -4px 8px var(--neuro-shadow-light)';
            return `
              <div class="shadow-library-item"
                   data-shadow-id="${esc(s.id)}"
                   role="button"
                   tabindex="0"
                   aria-label="Start journey: ${esc(s.title)}"
                   style="padding:var(--spacing-md);border-radius:var(--radius-md);box-shadow:${shadow};cursor:pointer;transition:all var(--transition-fast);${done ? 'opacity:0.7' : ''}">
                <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-xs)">
                  <span style="font-size:1.2rem" aria-hidden="true">${esc(s.icon)}</span>
                  <strong>${esc(s.title)}</strong>
                  ${done ? '<span style="color:var(--neuro-success);margin-left:auto" aria-label="Completed">\u2713 Complete</span>' : ''}
                </div>
                <div class="muted" style="font-size:0.85rem;margin-bottom:var(--spacing-xs)">${esc(s.tagline)}</div>
                <div class="muted" style="font-size:0.8rem;display:flex;align-items:center;gap:0.25rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:0.85rem;height:0.85rem;vertical-align:middle;" aria-hidden="true" focusable="false">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/>
                  </svg>
                  ${esc(s.estimatedTime)}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`).join('');

  const { modal, closeModal } = createModal({
    id:       'subShadowsLabModal',
    title:    'Sub-Shadows Lab',
    subtitle: 'Targeted 15-25 minute journeys focused on specific shadow patterns. Click any shadow to begin.',
    content:  `<div class="scrollable-content" style="overflow-y:auto">${categoriesHTML}</div>`,
    actions:  '<button type="button" id="close-sub-shadows-lab-btn" class="btn">Close</button>'
  });

  const card = modal.querySelector('.modal-card');
  card.style.maxWidth  = '700px';
  card.style.maxHeight = '90vh';

  modal.querySelector('#close-sub-shadows-lab-btn').addEventListener('click', closeModal);

  modal.querySelectorAll('.shadow-library-item').forEach(item => {
    const openJourney = () => {
      const shadowId = item.dataset.shadowId;
      closeModal();
      import('/Mini-Apps/ShadowAlchemyLab/js/features/subShadowJourney.js')
        .then(m => m.openSubShadowJourneyModal(shadowId));
    };

    item.addEventListener('click', openJourney);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openJourney(); }
    });

    item.addEventListener('mouseenter', () => {
      if (!completedShadows.includes(item.dataset.shadowId)) {
        item.style.transform = 'translateY(-2px)';
        item.style.boxShadow = '6px 6px 12px var(--neuro-shadow-dark), -6px -6px 12px var(--neuro-shadow-light)';
      }
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.boxShadow = completedShadows.includes(item.dataset.shadowId)
        ? 'inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light)'
        : '4px 4px 8px var(--neuro-shadow-dark), -4px -4px 8px var(--neuro-shadow-light)';
    });
  });
}
