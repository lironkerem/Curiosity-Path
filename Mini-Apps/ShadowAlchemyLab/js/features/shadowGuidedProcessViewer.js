// Mini-Apps/ShadowAlchemyLab/js/features/shadowGuidedProcessViewer.js
// Patched: all user-derived content set via DOM API (textContent),
// never innerHTML with entry data. type=button on close button.

import { createModal } from '/Mini-Apps/ShadowAlchemyLab/js/core/modal.js';

export function openShadowGuidedProcessViewModal(entry) {
  // Build steps content via DOM API — no innerHTML with user data
  const scrollable = document.createElement('div');
  scrollable.className = 'scrollable-content';

  const hr1 = document.createElement('hr');
  scrollable.appendChild(hr1);

  entry.steps.forEach(s => {
    const block = document.createElement('div');
    block.className = 'qa-block';

    const q = document.createElement('div');
    q.className = 'q';
    q.textContent = s.question; // from frozen template — still safe via textContent

    const a = document.createElement('div');
    a.className = 'a';
    a.textContent = s.answerText; // user input — XSS safe

    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.style.cssText = 'font-size:0.85rem;margin-top:0.25rem';
    meta.textContent = `Emotion: ${s.emotion || '\u2014'} | Intensity: ${s.intensity ?? 0}/10`;

    block.append(q, a, meta);
    scrollable.appendChild(block);
  });

  if (entry.vent) {
    const ventBlock = document.createElement('div');
    ventBlock.className = 'qa-block';

    const vq = document.createElement('div');
    vq.className = 'q';
    vq.textContent = 'Cathartic Release';

    const va = document.createElement('div');
    va.className = 'a';
    va.textContent = entry.vent; // user input — XSS safe

    ventBlock.append(vq, va);
    scrollable.appendChild(ventBlock);
  }

  const hr2 = document.createElement('hr');
  scrollable.appendChild(hr2);

  const analysisBlock = document.createElement('div');
  analysisBlock.className = 'qa-block';

  const aq = document.createElement('div');
  aq.className = 'q';
  aq.textContent = 'Analysis';

  const am = document.createElement('div');
  am.className = 'muted';

  const themesLine = document.createElement('div');
  const themesStrong = document.createElement('strong');
  themesStrong.textContent = 'Themes: ';
  themesLine.appendChild(themesStrong);
  themesLine.appendChild(document.createTextNode(entry.themes?.join(', ') || 'None'));

  const emotionLine = document.createElement('div');
  const emotionStrong = document.createElement('strong');
  emotionStrong.textContent = 'Primary Emotion: ';
  emotionLine.appendChild(emotionStrong);
  emotionLine.appendChild(document.createTextNode(entry.primaryEmotion || 'Unknown'));

  const practiceLine = document.createElement('div');
  const practiceStrong = document.createElement('strong');
  practiceStrong.textContent = 'Suggested Practice: ';
  practiceLine.appendChild(practiceStrong);
  practiceLine.appendChild(document.createTextNode(entry.suggestedPractice?.title || 'None'));

  am.append(themesLine, emotionLine, practiceLine);
  analysisBlock.append(aq, am);
  scrollable.appendChild(analysisBlock);

  // Serialize the built DOM node to a safe HTML string for createModal content
  // We use a wrapper and pass innerHTML of the wrapper — content is DOM-built, no user strings concatenated
  const wrapper = document.createElement('div');
  wrapper.appendChild(scrollable);

  const { closeModal } = createModal({
    id: 'shadowGuidedProcessViewModal',
    title: `Shadow Guided Process: ${entry.caseId}`,
    subtitle: new Date(entry.date).toLocaleString(),
    content: `<hr>${wrapper.innerHTML}`,   // safe: built entirely via DOM API above
    actions: '<button type="button" id="closeShadowGuidedProcessModal" class="btn">Close</button>'
  });

  document.getElementById('closeShadowGuidedProcessModal').addEventListener('click', closeModal);
}
