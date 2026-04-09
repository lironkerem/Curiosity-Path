/* Mini-Apps/ShadowAlchemyLab/js/eventListeners.js
   Patched: ls wrapper replaces raw localStorage in delete handler,
   safe entry name via whitelist, removed console.error leaking internal paths. */

import { showToast, showConfirmDialog } from '/src/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';
import { state, saveState } from '/src/Mini-Apps/ShadowAlchemyLab/js/core/state.js';

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
};

// Whitelisted entry type names for display
const ENTRY_TYPE_NAMES = Object.freeze({
  journey: 'Shadow Guided Process',
  free:    'Shadow Dialogue',
  trigger: 'Trigger Release'
});

let attached = false;

export function attachDashboardListeners() {
  if (attached) return;
  attached = true;

  document.addEventListener('click', async e => {
    try {
      /* ignore slider clicks */
      if (e.target.classList.contains('intensity-slider') ||
          e.target.classList.contains('intensity-value')  ||
          e.target.closest('.intensity-slider')) return;

      const t  = e.target;
      const id = t.id || t.closest('button')?.id;

      /* main card buttons */
      if (id === 'startNewJourney' || t.closest('#startNewJourney')) {
        e.preventDefault();
        const { openShadowGuidedProcessModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowGuidedProcess.js');
        return openShadowGuidedProcessModal();
      }
      if (id === 'openFreeJournal' || t.closest('#openFreeJournal')) {
        e.preventDefault();
        const { openShadowDialogueModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowDialogue.js');
        return openShadowDialogueModal();
      }
      if (id === 'openTriggerLog' || t.closest('#openTriggerLog')) {
        e.preventDefault();
        const { openTriggerReleaseModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/triggerRelease.js');
        return openTriggerReleaseModal();
      }
      if (id === 'open-sub-shadows-lab' || t.closest('#open-sub-shadows-lab')) {
        e.preventDefault();
        const { openSubShadowsLabGrid } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/subShadowsLabGrid.js');
        return openSubShadowsLabGrid();
      }
      if (id === 'continue-last-session' || t.closest('#continue-last-session')) {
        e.preventDefault();
        const engine = window.archetypesEngine;
        if (engine.state.activeShadowId) {
          const { openSubShadowJourneyModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/subShadowJourney.js');
          return openSubShadowJourneyModal(engine.state.activeShadowId);
        }
        if (engine.state.activeArchetypeId) {
          const { openArchetypeIntegrationStudioModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/archetypeStudio.js');
          return openArchetypeIntegrationStudioModal();
        }
        return;
      }

      /* saved-work toggle */
      if (id === 'toggle-saved-work' || id === 'saved-work-arrow' || id === 'saved-work-header') {
        const content = document.getElementById('saved-work-content');
        const arrow   = document.getElementById('saved-work-arrow');
        const toggleBtn = document.getElementById('toggle-saved-work');
        if (content && arrow) {
          const hide = content.style.display !== 'none';
          content.style.display = hide ? 'none' : 'block';
          arrow.textContent = hide ? '\u25BC' : '\u25B2';
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', String(!hide));
        }
        return;
      }

      /* entry action buttons */
      const isEdit = t.classList.contains('entry-edit-btn');
      const isView = t.classList.contains('entry-view-btn');
      const isDel  = t.classList.contains('entry-delete-btn');

      if (isEdit || isView || isDel) {
        e.preventDefault();
        e.stopPropagation();
        const entryId   = t.dataset.entryId;
        const entryType = t.dataset.entryType;

        // Validate entryType against whitelist
        if (!ENTRY_TYPE_NAMES[entryType]) return;

        if (isEdit) {
          if (entryType === 'free') {
            const entry = state.journalEntries.find(j => j.id === entryId);
            if (entry) {
              const { openShadowDialogueModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowDialogue.js');
              return openShadowDialogueModal(entry);
            }
          }
          if (entryType === 'trigger') {
            const entry = state.triggers.find(tr => tr.id === entryId);
            if (entry) {
              const { openTriggerReleaseModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/triggerRelease.js');
              return openTriggerReleaseModal(entry);
            }
          }
          return;
        }

        if (isView) {
          if (entryType === 'journey') {
            const all   = window.DailyJourneyEngine?.getAllJourneys() || [];
            const entry = all.find(j => j.id === entryId);
            if (entry) {
              const { openShadowGuidedProcessViewModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowGuidedProcessViewer.js');
              return openShadowGuidedProcessViewModal(entry);
            }
          }
          return;
        }

        if (isDel) {
          const name = ENTRY_TYPE_NAMES[entryType] || 'entry';
          showConfirmDialog(`Delete this ${name}? This action cannot be undone.`, () => {
            if (entryType === 'journey') {
              const all     = window.DailyJourneyEngine?.getAllJourneys() || [];
              const filtered = all.filter(j => j.id !== entryId);
              ls.set('daily_journey_v1', JSON.stringify(filtered));
              showToast('Shadow Guided Process deleted');
            } else if (entryType === 'free') {
              state.journalEntries = state.journalEntries.filter(j => j.id !== entryId);
              saveState();
              showToast('Shadow Dialogue deleted');
            } else if (entryType === 'trigger') {
              state.triggers = state.triggers.filter(tr => tr.id !== entryId);
              saveState();
              showToast('Trigger Release deleted');
            }
            window.AppController.renderDashboard();
          });
          return;
        }
      }

      /* entry content clicks (view mode) */
      const entryContent = t.closest('.entry-content');
      if (entryContent) {
        const row = entryContent.closest('.journal-entry');
        if (!row) return;
        const rowId   = row.dataset.entryId;
        const rowType = row.dataset.entryType;

        if (!ENTRY_TYPE_NAMES[rowType]) return;

        if (rowType === 'journey') {
          const all   = window.DailyJourneyEngine?.getAllJourneys() || [];
          const entry = all.find(j => j.id === rowId);
          if (entry) {
            const { openShadowGuidedProcessViewModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowGuidedProcessViewer.js');
            return openShadowGuidedProcessViewModal(entry);
          }
        }
        if (rowType === 'free') {
          const entry = state.journalEntries.find(j => j.id === rowId);
          if (entry) {
            const { openShadowDialogueModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/shadowDialogue.js');
            return openShadowDialogueModal(entry);
          }
        }
        if (rowType === 'trigger') {
          const entry = state.triggers.find(tr => tr.id === rowId);
          if (entry) {
            const { openTriggerReleaseModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/triggerRelease.js');
            return openTriggerReleaseModal(entry);
          }
        }
        return;
      }

      /* archetype card clicks */
      const archetypeCard = t.closest('.archetype-card');
      if (archetypeCard) {
        const archetypeId = archetypeCard.dataset.archetypeId;
        if (archetypeId) {
          const { openArchetypeIntegrationStudioModal } = await import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Features/archetypeStudio.js');
          return openArchetypeIntegrationStudioModal(archetypeId);
        }
      }

    } catch (err) {
      // Log error without leaking internal paths
      console.error('[ShadowAlchemy] Click handler error');
    }
  });
}
