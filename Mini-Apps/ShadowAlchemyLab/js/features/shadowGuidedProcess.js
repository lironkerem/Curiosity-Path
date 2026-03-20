// Mini-Apps/ShadowAlchemyLab/js/features/shadowGuidedProcess.js
// Patched: type=button on close-error button, error message via DOM API
// (textContent not innerHTML), console.error doesn't leak message detail.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';

export function openShadowGuidedProcessModal() {
  const { modal, closeModal } = createModal({
    id: 'shadowGuidedProcessModal',
    title: 'Shadow Guided Process',
    subtitle: '',
    content: '<div id="shadow-guided-process-content" style="overflow-y:auto;max-height:calc(90vh - 100px)"></div>',
    actions: '',
    onClose: () => window.AppController.renderDashboard()
  });

  const card = modal.querySelector('.modal-card');
  card.style.maxWidth    = '700px';
  card.style.maxHeight   = '90vh';
  card.style.display     = 'flex';
  card.style.flexDirection = 'column';

  const contentEl = modal.querySelector('#shadow-guided-process-content');

  function showError(message) {
    contentEl.textContent = ''; // safe clear
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'padding:2rem;text-align:center;color:var(--neuro-error);';

    const h3 = document.createElement('h3');
    h3.textContent = 'Engine Not Loaded';

    const p = document.createElement('p');
    p.textContent = String(message); // XSS safe — textContent

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'close-error';
    btn.className = 'btn';
    btn.style.marginTop = '1rem';
    btn.textContent = 'Close';
    btn.addEventListener('click', closeModal);

    wrapper.append(h3, p, btn);
    contentEl.appendChild(wrapper);
  }

  if (!window.DailyJourneyEngine) {
    console.error('DailyJourneyEngine not found');
    showError('The Daily Journey Engine is not available. Please refresh the page.');
    return;
  }

  setTimeout(() => {
    try {
      window.DailyJourneyEngine.startDailyJourney(contentEl);
    } catch (error) {
      console.error('Failed to start Daily Journey');
      showError('Error starting journey. Please refresh the page and try again.');
    }
  }, 100);

  // Watch for the return button that DailyJourneyEngine injects
  const observer = new MutationObserver(() => {
    const btn = contentEl.querySelector('#return-dash');
    if (btn) {
      btn.addEventListener('click', closeModal);
      observer.disconnect();
    }
  });
  observer.observe(contentEl, { childList: true, subtree: true });
}
