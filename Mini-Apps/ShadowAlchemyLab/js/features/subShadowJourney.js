// Mini-Apps/ShadowAlchemyLab/js/features/subShadowJourney.js
// Patched: esc() on all step/journey fields in innerHTML, type=button on all
// buttons, aria-hidden on SVGs, maxlength on textarea, showCompletion uses
// DOM API for user-derived content (completionMessage, recommendedPractice).

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';
import { showToast } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';

// XSS escape
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function openSubShadowJourneyModal(shadowId) {
  const engine = window.archetypesEngine;
  const shadow = engine.setActiveShadow(shadowId);
  if (!shadow) return showToast('Shadow journey not found', 'error');

  const { modal, closeModal } = createModal({
    id:       'subShadowJourneyModal',
    title:    `${esc(shadow.icon || '')} ${esc(shadow.title || '')}`,
    subtitle: `${esc(shadow.tagline || '')}
      <span style="font-size:0.85rem;display:inline-flex;align-items:center;gap:0.25rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:0.85rem;height:0.85rem;vertical-align:middle;" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/>
        </svg>
        ${esc(shadow.estimatedTime || '')}
      </span>`,
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

  renderStep(modal);
}

export async function renderStep(modal) {
  const engine    = window.archetypesEngine;
  const contentEl = modal.querySelector('#sub-shadow-journey-content');
  const idx       = engine.state.selectedStepIndex;
  const journey   = engine.getActiveJourney();
  if (!journey) return;

  const total    = journey.steps.length;
  if (idx >= total) return showCompletion(modal);

  const step     = engine.getStep(idx);
  const progress = Math.round((idx / total) * 100);
  const existing = engine.state.answers[step.id] || '';

  // Step content — all dynamic values from JSON data escaped
  contentEl.innerHTML = `
    <div style="background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset-sm);margin-bottom:var(--spacing-md)">
      <h4 style="margin:0 0 var(--spacing-xs) 0;color:var(--neuro-accent)">${esc(step.title)}</h4>
      <p class="muted" style="font-size:0.9rem;margin:0">Step ${idx + 1} of ${total}</p>
    </div>
    <div class="progress-bar" style="margin:var(--spacing-md) 0">
      <div class="progress-fill" style="width:${progress}%"></div>
    </div>
    <p style="margin-bottom:var(--spacing-md);line-height:1.6">${esc(step.description)}</p>
    <div style="background:var(--neuro-bg);padding:var(--spacing-lg);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset);margin:var(--spacing-lg) 0">
      <p style="font-weight:600;margin-bottom:var(--spacing-sm)">${esc(step.prompt)}</p>
      <p class="muted" style="font-size:0.9rem;line-height:1.5">${esc(step.guidance)}</p>
    </div>
    ${renderInput(step, existing)}
    <div class="modal-actions">
      ${idx > 0
        ? '<button type="button" id="step-back" class="btn">Back</button>'
        : '<button type="button" id="step-close" class="btn">Close</button>'}
      <button type="button" id="step-next" class="btn btn-primary">
        ${idx === total - 1 ? 'Complete Journey' : 'Next Step'}
      </button>
    </div>`;

  contentEl.querySelector('#step-back')?.addEventListener('click', () => {
    engine.previousStep();
    renderStep(modal);
  });
  contentEl.querySelector('#step-close')?.addEventListener('click', () => {
    engine.saveUserState();
    modal.remove();
    window.AppController.renderDashboard();
  });
  contentEl.querySelector('#step-next').addEventListener('click', () => {
    const resp = collectResponse(step, contentEl);
    if (!resp || (typeof resp === 'string' && resp.trim() === ''))
      return showToast('Please provide a response before continuing.', 'error');

    engine.submitUserResponse(step.id, resp);
    if (idx < total - 1) {
      engine.nextStep();
      renderStep(modal);
    } else {
      engine.state.selectedStepIndex = total;
      engine.saveUserState();
      renderStep(modal);
    }
  });
}

function renderInput(step, existing = '') {
  if (step.expectedInputType === 'choice' && step.choices) {
    const choices = step.choices.map(c =>
      `<label class="btn" style="display:block;text-align:left;cursor:pointer;box-shadow:var(--shadow-raised);padding:var(--spacing-md)">
        <input type="radio" name="step-choice" value="${esc(c)}" ${existing === c ? 'checked' : ''}> ${esc(c)}
      </label>`
    ).join('');
    return `<div style="display:grid;grid-template-columns:1fr;gap:var(--spacing-sm);margin:var(--spacing-lg) 0">${choices}</div>`;
  }
  // Textarea: existing is user's previous answer — set via value attribute (escaped)
  return `<textarea id="step-textarea" class="form-input"
    style="min-height:180px;margin:var(--spacing-lg) 0;resize:none"
    maxlength="5000"
    placeholder="Take your time. Write from the heart...">${esc(existing)}</textarea>`;
}

function collectResponse(step, container) {
  if (step.expectedInputType === 'choice') {
    const checked = container.querySelector('input[name="step-choice"]:checked');
    return checked ? checked.value : '';
  }
  return (container.querySelector('#step-textarea')?.value || '').trim().slice(0, 5000);
}

function showCompletion(modal) {
  const engine   = window.archetypesEngine;
  const journey  = engine.getActiveJourney();
  const summary  = engine.generateIntegrationSummary();
  const particles = 5;

  const contentEl = modal.querySelector('#sub-shadow-journey-content');
  contentEl.textContent = ''; // safe clear

  // Header
  const header = document.createElement('h3');
  header.style.cssText = 'display:flex;align-items:center;gap:0.5rem;';
  const checkSvg = document.createElement('span');
  checkSvg.setAttribute('aria-hidden', 'true');
  checkSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  header.append(checkSvg, document.createTextNode(' Journey Complete'));
  contentEl.appendChild(header);

  // Summary card
  const summaryCard = document.createElement('div');
  summaryCard.style.cssText = 'background:var(--neuro-bg);padding:var(--spacing-lg);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset-lg);margin:var(--spacing-lg) 0';

  // Completion message — from JSON data, set safely
  const completionMsg = document.createElement('p');
  completionMsg.style.cssText = 'margin-bottom:var(--spacing-md);white-space:pre-line';
  completionMsg.textContent = journey.completionMessage || '';
  summaryCard.appendChild(completionMsg);

  // Recommended practice
  const practiceBox = document.createElement('div');
  practiceBox.style.cssText = 'background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm);margin-top:var(--spacing-md)';
  const practiceLabel = document.createElement('strong');
  practiceLabel.textContent = 'Recommended Practice:';
  practiceBox.appendChild(practiceLabel);
  practiceBox.appendChild(document.createElement('br'));
  practiceBox.appendChild(document.createTextNode(journey.recommendedPractice || ''));
  summaryCard.appendChild(practiceBox);

  // XP earned
  const xpBox = document.createElement('div');
  xpBox.style.cssText = 'margin-top:var(--spacing-md);padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)';
  const xpLabel = document.createElement('strong');
  xpLabel.textContent = 'XP Earned: ';
  xpBox.appendChild(xpLabel);
  xpBox.appendChild(document.createTextNode(`+${engine.state.xp} points`));
  summaryCard.appendChild(xpBox);

  contentEl.appendChild(summaryCard);

  // Action button
  const actions = document.createElement('div');
  actions.className = 'modal-actions';
  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.id = 'complete-journey';
  completeBtn.className = 'btn btn-primary';
  completeBtn.textContent = 'Complete & Earn Light-Particles';
  actions.appendChild(completeBtn);
  contentEl.appendChild(actions);

  completeBtn.addEventListener('click', () => {
    window.AppController.addLightParticles(particles);
    import('/Mini-Apps/ShadowAlchemyLab/js/core/utils.js').then(m =>
      m.showToast(`${journey.title} complete! +${particles} Light-Particles earned.`)
    );
    engine.completeJourney();
    engine.clearUserState();
    modal.remove();
    window.AppController.renderDashboard();
  });
}
