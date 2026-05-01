import { createModal } from '/src/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';

function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export function openShadowGuidedProcessViewModal(entry) {
  // Build steps safely
  const stepsWrap = document.createElement('div');
  for (const s of entry.steps) {
    const block = document.createElement('div');
    block.className = 'qa-block';

    const q = document.createElement('div');
    q.className = 'q';
    q.textContent = s.question;

    const a = document.createElement('div');
    a.className = 'a';
    a.textContent = s.answerText;

    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.style.cssText = 'font-size:0.85rem;margin-top:0.25rem';
    meta.textContent = `Emotion: ${s.emotion} | Intensity: ${s.intensity}/10`;

    block.append(q, a, meta);
    stepsWrap.appendChild(block);
  }

  if (entry.vent) {
    const ventBlock = document.createElement('div');
    ventBlock.className = 'qa-block';
    const vq = document.createElement('div'); vq.className = 'q'; vq.textContent = 'Cathartic Release';
    const va = document.createElement('div'); va.className = 'a'; va.textContent = entry.vent;
    ventBlock.append(vq, va);
    stepsWrap.appendChild(ventBlock);
  }

  const analysisBlock = document.createElement('div');
  analysisBlock.className = 'qa-block';
  const aq = document.createElement('div'); aq.className = 'q'; aq.textContent = 'Analysis';
  const aa = document.createElement('div'); aa.className = 'muted';
  aa.innerHTML = `<strong>Themes:</strong> ${esc(entry.themes?.join(', ') || 'None')}<br>
    <strong>Primary Emotion:</strong> ${esc(entry.primaryEmotion || 'Unknown')}<br>
    <strong>Suggested Practice:</strong> ${esc(entry.suggestedPractice?.title || 'None')}`;
  analysisBlock.append(aq, aa);
  stepsWrap.appendChild(analysisBlock);

  // Wrap in scrollable container
  const scrollWrap = document.createElement('div');
  scrollWrap.className = 'scrollable-content';
  const hr1 = document.createElement('hr');
  const hr2 = document.createElement('hr');
  scrollWrap.append(hr1, stepsWrap, hr2, analysisBlock);

  const { closeModal } = createModal({
    id:      'shadowGuidedProcessViewModal',
    title:   `Shadow Guided Process: ${esc(entry.caseId)}`,
    subtitle: new Date(entry.date).toLocaleString(),
    content: scrollWrap.outerHTML,   // safe — all built via DOM API
    actions: '<button id="closeShadowGuidedProcessModal" class="btn">Close</button>'
  });

  document.getElementById('closeShadowGuidedProcessModal').addEventListener('click', closeModal);
}