// Mini-Apps/ShadowAlchemyLab/js/features/archetypeStudio.js
// Patched: esc() on journey title/subtitle inserted into createModal,
// fixed top-level import() statement moved inside function body,
// type=button on close button (handled by createModal patch).

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';
import { getArchetypeIcon } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';

// XSS escape — used for journey.title / subtitle from external JSON data
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function openArchetypeIntegrationStudioModal(archetypeId = null) {
  const engine = window.archetypesEngine;
  if (archetypeId) engine.setActiveArchetype(archetypeId);

  // Clear any active shadow
  engine.state.activeShadowId = null;

  const journey = engine.getActiveJourney();
  if (!journey) return;

  const { modal, closeModal } = createModal({
    id:       'archetypeIntegrationStudioModal',
    title:    `${esc(journey.icon || getArchetypeIcon(journey.id))} ${esc(journey.title)}`,
    subtitle: esc(journey.subtitle || ''),
    content:  '<div id="sub-shadow-journey-content" style="overflow-y:auto;max-height:calc(90vh - 200px)"></div>',
    actions:  '',
    onClose: () => {
      engine.saveUserState();
      window.AppController.renderDashboard();
    }
  });

  const card = modal.querySelector('.modal-card');
  card.style.maxWidth  = '700px';
  card.style.maxHeight = '90vh';

  // Dynamic import inside the function body (not at top level)
  import('/Mini-Apps/ShadowAlchemyLab/js/features/subShadowJourney.js')
    .then(m => m.renderStep(modal));
}
