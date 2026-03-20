// Mini-Apps/ShadowAlchemyLab/js/features/subShadowsLabGrid.js
// Patched: frozen ARCHETYPE_META, esc() on all dynamic values, type=button,
// archetypeId whitelist validation, role+tabindex+keyboard on shadow items.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';
import { getArchetypeIcon } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';

// XSS escape
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const ARCHETYPE_META = Object.freeze([
  Object.freeze({ id: 'hero',    title: 'Hero',    color: '#ef4444' }),
  Object.freeze({ id: 'lover',   title: 'Lover',   color: '#ec4899' }),
  Object.freeze({ id: 'warrior', title: 'Warrior', color: '#f59e0b' }),
  Object.freeze({ id: 'sage',    title: 'Sage',    color: '#3b82f6' }),
  Object.freeze({ id: 'healer',  title: 'Healer',  color: '#22c55e' }),
  Object.freeze({ id: 'shadow',  title: 'Shadow',  color: '#8b5cf6' })
]);

// Whitelist of valid archetype IDs
const VALID_ARCHETYPE_IDS = Object.freeze(new Set(ARCHETYPE_META.map(a => a.id)));

export function openSubShadowsLabGrid() {
  const gridHTML = `<div class="archetype-grid">
    ${ARCHETYPE_META.map(a => {
      const icon = getArchetypeIcon(a.id);
      return `
        <button type="button"
                class="archetype-card"
                data-archetype="${esc(a.id)}"
                style="border:2px solid ${esc(a.color)}20"
                aria-label="Explore ${esc(a.title)} sub-shadows">
          <div style="font-size:2.2rem;margin-bottom:.4rem" aria-hidden="true">${esc(icon)}</div>
          <div>${esc(a.title)}</div>
        </button>`;
    }).join('')}
  </div>`;

  const { modal, closeModal } = createModal({
    id:       'subShadowsLabGridModal',
    title:    'Sub-Shadows Lab',
    subtitle: 'Choose an archetype to see its sub-shadows',
    content:  gridHTML,
    actions:  '<button type="button" class="btn" id="close-grid-btn">Close</button>'
  });

  modal.querySelectorAll('.archetype-card').forEach(card => {
    card.addEventListener('click', () => {
      const archetypeId = card.dataset.archetype;
      // Validate against whitelist before use
      if (!VALID_ARCHETYPE_IDS.has(archetypeId)) return;
      closeModal();
      openFilteredShadowList(archetypeId);
    });
  });

  modal.querySelector('#close-grid-btn').addEventListener('click', closeModal);
}

/* ---------- filtered list ---------- */
function openFilteredShadowList(archetypeId) {
  if (!VALID_ARCHETYPE_IDS.has(archetypeId)) return;

  const engine    = window.archetypesEngine;
  const shadows   = engine.getShadowsByArchetype(archetypeId);
  const completed = engine.getCompletedShadows();

  if (!shadows.length) {
    import('/Mini-Apps/ShadowAlchemyLab/js/core/utils.js')
      .then(m => m.showToast('No sub-shadows for this archetype yet.', 'info'));
    return;
  }

  const listHTML = `
    <div class="scrollable-content" style="max-height:60vh;overflow-y:auto">
      ${shadows.map(s => {
        const done   = completed.includes(s.id);
        const shadow = done ? 'var(--shadow-inset)' : 'var(--shadow-raised)';
        return `
          <div class="shadow-library-item"
               data-shadow-id="${esc(s.id)}"
               role="button"
               tabindex="0"
               aria-label="Start journey: ${esc(s.title)}"
               style="padding:var(--spacing-md);border-radius:var(--radius-md);margin-bottom:var(--spacing-sm);box-shadow:${shadow};cursor:pointer;transition:all var(--transition-fast);${done ? 'opacity:.7' : ''}">
            <div style="display:flex;align-items:center;gap:var(--spacing-sm)">
              <span style="font-size:1.3rem" aria-hidden="true">${esc(s.icon)}</span>
              <strong>${esc(s.title)}</strong>
              ${done ? '<span style="color:var(--neuro-success);margin-left:auto" aria-label="Completed">\u2713</span>' : ''}
            </div>
            <div class="muted" style="font-size:.85rem;margin-top:var(--spacing-xs)">${esc(s.tagline)}</div>
          </div>`;
      }).join('')}
    </div>`;

  const meta = ARCHETYPE_META.find(a => a.id === archetypeId);

  const { modal, closeModal } = createModal({
    id:       'filteredShadowListModal',
    title:    `${esc(getArchetypeIcon(archetypeId))} ${esc(meta?.title || '')} Sub-Shadows`,
    subtitle: 'Pick a shadow to begin its 15-25 min journey',
    content:  listHTML,
    actions:  '<button type="button" class="btn" id="close-filtered-btn">Close</button>'
  });

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
  });

  modal.querySelector('#close-filtered-btn').addEventListener('click', closeModal);
}
