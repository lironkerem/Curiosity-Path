// Mini-Apps/ShadowAlchemyLab/js/features/triggerRelease.js
// Patched: type=button on all action buttons, esc() on entry values in HTML,
// crypto uid, parseInt radix 10, coreTrigger/emotion whitelist validation, input length caps.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';
import { showToast, showConfirmDialog } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';
import { state, saveState } from '/Mini-Apps/ShadowAlchemyLab/js/core/state.js';

// XSS escape
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

// Frozen trigger data
const CORE_TRIGGERS = Object.freeze({
  'Fear Based Triggers':         Object.freeze(['Fear','Anxiety','Panic','Worry','Insecurity','Vulnerability','Helplessness','Overwhelm','Shock','Apprehension']),
  'Anger Based Triggers':        Object.freeze(['Anger','Rage','Frustration','Irritation','Resentment','Bitterness','Contempt','Disgust','Hostility','Annoyance']),
  'Shame Based Triggers':        Object.freeze(['Shame','Embarrassment','Guilt','Humiliation','Unworthiness','Failure','Self hatred','Regret','Inferiority','Social fear of judgment']),
  'Sadness Based Triggers':      Object.freeze(['Sadness','Grief','Disappointment','Loneliness','Abandonment','Hopelessness','Despair','Feeling misunderstood','Feeling unseen','Melancholy']),
  'Control Based Triggers':      Object.freeze(['Powerlessness','Lack of control','Uncertainty','Confusion','Jealousy','Envy','Possessiveness','Fear of loss','Distrust']),
  'Relationship Based Triggers': Object.freeze(['Rejection','Betrayal','Neglect','Being ignored','Feeling dismissed','Lack of appreciation','Lack of validation','Feeling replaced','Feeling unwanted','Feeling unimportant']),
  'Identity Based Triggers':     Object.freeze(['Feeling attacked','Feeling criticized','Feeling excluded','Feeling misunderstood','Feeling judged','Feeling insufficient','Feeling disrespected','Feeling invisible','Feeling compared','Feeling underestimated']),
  'Boundary Based Triggers':     Object.freeze(['Feeling invaded','Feeling controlled','Feeling pressured','Feeling manipulated','Feeling used','Feeling exploited','Feeling trapped','Feeling suffocated']),
  'Performance Based Triggers':  Object.freeze(['Fear of failure','Fear of success','High expectations','Perfectionism','Pressure','Competition','Judgement from others','Self criticism']),
  'Existential Based Triggers':  Object.freeze(['Meaninglessness','Emptiness','Loss of purpose','Loss of identity','Isolation','Time pressure','Mortality','Change','Unpredictability'])
});

const VALID_CORE_TRIGGERS = Object.freeze(new Set(Object.keys(CORE_TRIGGERS)));

export function openTriggerReleaseModal(entry = null) {
  const isEditing = !!entry;

  const coreTriggerOptions = Object.keys(CORE_TRIGGERS).map(t =>
    `<option value="${esc(t)}" ${isEditing && entry.coreTrigger === t ? 'selected' : ''}>${esc(t)}</option>`
  ).join('');

  let emotionOptionsHTML = '<option value="">First select a Core Trigger</option>';
  if (isEditing && entry.coreTrigger && CORE_TRIGGERS[entry.coreTrigger]) {
    emotionOptionsHTML = CORE_TRIGGERS[entry.coreTrigger].map(e =>
      `<option value="${esc(e)}" ${entry.emotion === e ? 'selected' : ''}>${esc(e)}</option>`
    ).join('');
  }

  const initIntensity = isEditing ? Math.max(0, Math.min(10, parseInt(String(entry.intensity || 5), 10))) : 5;
  const initSource    = isEditing ? esc(entry.source || '') : '';
  const initText      = isEditing ? esc(entry.text   || '') : '';

  const { modal, closeModal } = createModal({
    id: 'triggerReleaseModal',
    title: isEditing ? 'View / Edit Trigger' : 'Trigger Release',
    subtitle: 'Record emotional reactions and patterns to understand your inner landscape.',
    content: `
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-height:calc(90vh - 220px);overflow-y:auto;padding-right:var(--spacing-sm)">

        <div>
          <label class="form-label" for="trigger-source">Who or What Triggered you?</label>
          <input type="text" id="trigger-source" class="form-input"
            placeholder="e.g., My boss, A comment, Traffic..."
            value="${initSource}" maxlength="200">
        </div>

        <div>
          <label class="form-label" for="trigger-textarea">Describe your trigger</label>
          <textarea id="trigger-textarea" class="form-input"
            style="min-height:150px;resize:none;margin-bottom:1.5rem"
            maxlength="5000"
            placeholder="What happened and how did it make you feel?">${initText}</textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)">
          <div>
            <label class="form-label" for="trigger-core-trigger">Core Trigger:</label>
            <select id="trigger-core-trigger" class="form-input">
              <option value="">Choose Core Trigger</option>
              ${coreTriggerOptions}
            </select>
          </div>
          <div>
            <label class="form-label" for="trigger-emotion">Specific emotion:</label>
            <select id="trigger-emotion" class="form-input"
              ${!isEditing || !entry.coreTrigger ? 'disabled' : ''}
              style="color:${!isEditing || !entry.coreTrigger ? '#9ca3af' : ''}">
              ${emotionOptionsHTML}
            </select>
          </div>
        </div>

        <div>
          <label class="form-label" for="trigger-intensity-slider">
            Intensity (0-10): <span id="trigger-intensity-value" class="intensity-value">${initIntensity}</span>
          </label>
          <input type="range" id="trigger-intensity-slider" class="intensity-slider"
            min="0" max="10" value="${initIntensity}"
            aria-label="Intensity level 0 to 10">
        </div>
      </div>`,
    actions: `
      ${isEditing ? '<button type="button" id="deleteTriggerEntry" class="btn">Delete</button>' : ''}
      <button type="button" id="closeTriggerModal" class="btn">Close</button>
      <button type="button" id="saveTriggerEntry" class="btn btn-primary">Save Entry</button>`
  });

  /* ---------- wire events ---------- */
  const slider       = modal.querySelector('#trigger-intensity-slider');
  const valueDisplay = modal.querySelector('#trigger-intensity-value');
  slider.addEventListener('input', () => { valueDisplay.textContent = slider.value; });

  const coreSelect   = modal.querySelector('#trigger-core-trigger');
  const emotionSelect= modal.querySelector('#trigger-emotion');

  coreSelect.addEventListener('change', () => {
    const selectedCore = coreSelect.value;
    if (VALID_CORE_TRIGGERS.has(selectedCore)) {
      emotionSelect.disabled = false;
      emotionSelect.style.color = '';
      emotionSelect.innerHTML = CORE_TRIGGERS[selectedCore].map(e =>
        `<option value="${esc(e)}">${esc(e)}</option>`
      ).join('');
    } else {
      emotionSelect.disabled = true;
      emotionSelect.style.color = '#9ca3af';
      emotionSelect.innerHTML = '<option value="">First select a Core Trigger</option>';
    }
  });

  modal.querySelector('#saveTriggerEntry').addEventListener('click', () => {
    const source    = modal.querySelector('#trigger-source').value.trim().slice(0, 200);
    const text      = modal.querySelector('#trigger-textarea').value.trim().slice(0, 5000);
    const core      = coreSelect.value;
    const emotion   = emotionSelect.value;
    const intensity = Math.max(0, Math.min(10, parseInt(slider.value, 10) || 0));

    if (!text)    return showToast('Please describe the trigger.', 'error');
    if (!VALID_CORE_TRIGGERS.has(core))  return showToast('Please select a Core Trigger.', 'error');
    if (!emotion) return showToast('Please select a specific emotion.', 'error');

    // Validate emotion against whitelist
    const validEmotions = CORE_TRIGGERS[core];
    if (!validEmotions || !validEmotions.includes(emotion)) {
      return showToast('Invalid emotion selection.', 'error');
    }

    if (isEditing) {
      const idx = state.triggers.findIndex(t => t.id === entry.id);
      if (idx >= 0) Object.assign(state.triggers[idx], { source, text, coreTrigger: core, emotion, intensity });
      showToast('Trigger updated successfully');
    } else {
      state.triggers.push({
        id:          uid('trigger-'),
        date:        new Date().toISOString(),
        source,
        text,
        coreTrigger: core,
        emotion,
        intensity
      });
      window.AppController.addLightParticles(1);
      showToast('Trigger released successfully');
    }
    saveState();
    window.AppController.renderDashboard();
    closeModal();
  });

  if (isEditing) {
    modal.querySelector('#deleteTriggerEntry').addEventListener('click', () => {
      showConfirmDialog('Delete this trigger? This action cannot be undone.', () => {
        state.triggers = state.triggers.filter(t => t.id !== entry.id);
        saveState();
        window.AppController.renderDashboard();
        closeModal();
        showToast('Trigger deleted');
      });
    });
  }

  modal.querySelector('#closeTriggerModal').addEventListener('click', closeModal);
}
