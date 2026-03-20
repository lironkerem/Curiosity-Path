// Mini-Apps/ShadowAlchemyLab/js/features/shadowDialogue.js
// Patched: esc() for entry.text in textarea initial value, type=button on action
// buttons, crypto uid, input length cap, target whitelist validation on save.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';
import { showToast, showConfirmDialog } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';
import { state, saveState } from '/Mini-Apps/ShadowAlchemyLab/js/core/state.js';

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Crypto-safe UID
function uid(prefix = '') {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    return prefix + Date.now().toString(36) + '-' + arr[0].toString(36) + arr[1].toString(36);
  }
  return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

const SHADOW_DIALOGUE_TARGETS = Object.freeze([
  'My Spouse','My Lover','My Child','My Family','My Mom','My Dad',
  'My Brother','My Sister','My Best Friend','My Friend','My Acquaintance',
  'My Boss','My Co-worker','My Neighbor','My Pet','My Body',
  'My Self','My God','My Life','My Job'
]);

const VALID_TARGETS = Object.freeze(new Set(SHADOW_DIALOGUE_TARGETS));

export function openShadowDialogueModal(entry = null) {
  const isEditing = !!entry;

  const { modal, closeModal } = createModal({
    id: 'shadowDialogueModal',
    title: isEditing ? 'View / Edit Entry' : 'Shadow Dialogue',
    subtitle: 'A space for free-form reflection. Write whatever comes to mind without judgment.',
    content: `
      <label style="display:block;margin-top:1rem;margin-bottom:.5rem;color:var(--neuro-text-light)" for="mirror-journal-target">Your Subject is?</label>
      <select id="mirror-journal-target" class="form-input" style="margin-bottom:1rem" aria-label="Select subject">
        <option value="">-- Your Subject is? --</option>
        ${SHADOW_DIALOGUE_TARGETS.map(t =>
          `<option value="${esc(t)}" ${isEditing && entry.target === t ? 'selected' : ''}>${esc(t)}</option>`
        ).join('')}
      </select>
      <label for="shadow-dialogue-textarea" class="sr-only">Your reflection</label>
      <textarea id="shadow-dialogue-textarea" class="form-input"
        style="min-height:250px;resize:none;margin-bottom:1rem"
        maxlength="10000"
        aria-label="Write your reflection here"
        placeholder="Write freely...">${isEditing ? esc(entry.text) : ''}</textarea>`,
    actions: `
      ${isEditing ? '<button type="button" id="deleteShadowDialogueEntry" class="btn">Delete</button>' : ''}
      <button type="button" id="closeShadowDialogueModal" class="btn">Close</button>
      <button type="button" id="saveShadowDialogue" class="btn btn-primary">Save Entry</button>`
  });

  modal.querySelector('#saveShadowDialogue').addEventListener('click', () => {
    const rawText  = modal.querySelector('#shadow-dialogue-textarea').value.trim().slice(0, 10000);
    const rawTarget= modal.querySelector('#mirror-journal-target').value;

    if (!rawText) return showToast('Please write something before saving.', 'error');

    // Validate target against whitelist
    const target = VALID_TARGETS.has(rawTarget) ? rawTarget : '';

    if (isEditing) {
      const idx = state.journalEntries.findIndex(j => j.id === entry.id);
      if (idx >= 0) Object.assign(state.journalEntries[idx], { text: rawText, target });
      showToast('Shadow Dialogue updated');
    } else {
      state.journalEntries.push({
        id:     uid('free-'),
        date:   new Date().toISOString(),
        text:   rawText,
        target
      });
      window.AppController.addLightParticles(1);
      showToast('Shadow Dialogue saved');
    }
    saveState();
    window.AppController.renderDashboard();
    closeModal();
  });

  if (isEditing) {
    modal.querySelector('#deleteShadowDialogueEntry').addEventListener('click', () => {
      showConfirmDialog('Delete this entry?', () => {
        state.journalEntries = state.journalEntries.filter(j => j.id !== entry.id);
        saveState();
        window.AppController.renderDashboard();
        closeModal();
        showToast('Entry deleted');
      });
    });
  }

  modal.querySelector('#closeShadowDialogueModal').addEventListener('click', closeModal);
}
