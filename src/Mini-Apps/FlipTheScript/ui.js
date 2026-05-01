// Mini-Apps/FlipTheScript/ui.js

export function mountUI(app) {

  const ls = {
    get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
    set:    (k, v) => { try { localStorage.setItem(k, v); }      catch {} },
    remove: k      => { try { localStorage.removeItem(k); }      catch {} }
  };

  // ========== DOM Cache ==========
  const input           = document.getElementById('negative-input');
  const flipBtn         = document.getElementById('flip-btn');
  const clearBtn        = document.getElementById('clear-btn');
  const progressWrapper = document.getElementById('progress-wrapper');
  const progressInner   = document.getElementById('progress-inner');
  const extendedFlipEl  = document.getElementById('extended-flip');
  const saveExtendedBtn = document.getElementById('save-extended');
  const audioExtendedBtn= document.getElementById('audio-extended');
  const savedList       = document.getElementById('saved-list');
  const searchSaved     = document.getElementById('search-saved');
  const backupBtn       = document.getElementById('backup-id');
  const restoreBtn      = document.getElementById('restore-id');
  const charCount       = document.getElementById('char-count');
  const inputSection    = document.getElementById('input-section');
  const outputSection   = document.getElementById('output-section');
  const flipAnotherBtn  = document.getElementById('flip-another-btn');
  const voiceInputBtn   = document.getElementById('voice-input-btn');

  // ========== State ==========
  let savedFlips = [];
  try { savedFlips = JSON.parse(ls.get('savedFlips') || '[]'); } catch { savedFlips = []; }
  if (app.state?.data?.flipEntries?.length) savedFlips = app.state.data.flipEntries;

  let isListening   = false;
  let recognition   = null;
  let wasVoiceInput = false;

  // ========== Persistence ==========
  function persistSavedFlips() {
    ls.set('savedFlips', JSON.stringify(savedFlips));
    if (app.state) {
      app.state.data.flipEntries = savedFlips;
      app.state.saveAppData?.();
    }
  }
  window.addEventListener('pagehide', persistSavedFlips);

  // ========== Utils ==========
  const showToast = msg => app.showToast(msg);

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
    } else {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('Copied to clipboard!'); } catch {}
      ta.remove();
    }
  }

  function speakText(text) {
    if (!('speechSynthesis' in window)) { showToast('Audio not supported'); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9; u.pitch = 1; u.volume = 1;
    window.speechSynthesis.speak(u);
    showToast('Playing audio...');
  }

  // ========== SVG constants ==========
  const MIC_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 19v3"/><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;
  const FLIP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/></svg>`;

  // ========== Voice Input ==========
  function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      voiceInputBtn.style.display = 'none'; return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      voiceInputBtn.classList.add('listening');
      voiceInputBtn.setAttribute('aria-label', 'Stop listening');
      voiceInputBtn.textContent = '🔴';
      showToast('Listening... Speak now!');
    };

    recognition.onresult = ({ results }) => {
      input.value = results[0][0].transcript.slice(0, 500);
      charCount.textContent = input.value.length;
      showToast('Got it! Flipping now...');
      wasVoiceInput = true;
      setTimeout(() => { if (input.value.trim()) flipBtn.click(); }, 500);
    };

    recognition.onerror = ({ error }) => {
      isListening = false;
      voiceInputBtn.classList.remove('listening');
      voiceInputBtn.setAttribute('aria-label', 'Speak your thought');
      voiceInputBtn.innerHTML = MIC_SVG;
      const msgs = { 'no-speech': 'No speech detected. Try again!', 'not-allowed': 'Microphone access denied.', 'network': 'Network error. Check your connection.' };
      showToast(msgs[error] || 'Could not recognize speech. Try again.');
    };

    recognition.onend = () => {
      isListening = false;
      voiceInputBtn.classList.remove('listening');
      voiceInputBtn.setAttribute('aria-label', 'Speak your thought');
      voiceInputBtn.innerHTML = MIC_SVG;
    };
  }

  voiceInputBtn.addEventListener('click', () => {
    if (!recognition) { showToast('Speech recognition not supported'); return; }
    if (isListening) { recognition.stop(); return; }
    if (window.location.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(window.location.hostname)) {
      showToast('Microphone requires HTTPS.'); return;
    }
    try { recognition.start(); } catch { showToast('Could not start voice input. Try again.'); }
  });

  initSpeechRecognition();

  // ========== Character Counter ==========
  input.addEventListener('input', () => {
    const n = input.value.length;
    charCount.textContent = n;
    const counter = charCount.parentElement;
    counter.classList.toggle('danger',  n > 400);
    counter.classList.toggle('warning', n > 350 && n <= 400);
  });

  // ========== Suggestion Buttons ==========
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      input.value = (btn.getAttribute('data-text') || '').slice(0, 500);
      charCount.textContent = input.value.length;
      input.focus();
    });
  });

  // ========== Collapsible ==========
  document.querySelectorAll('.collapsible-card').forEach(card => {
    const toggle  = card.querySelector('.collapse-toggle');
    const content = card.querySelector('.collapse-content');
    const icon    = toggle?.querySelector('.collapse-icon');
    if (!toggle || !content) return;
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      content.classList.toggle('collapsed', expanded);
      if (icon) icon.textContent = expanded ? '▶' : '▼';
    });
  });

  // ========== Flip Another ==========
  flipAnotherBtn.addEventListener('click', () => {
    outputSection.classList.add('hidden');
    outputSection.classList.remove('show');
    inputSection.classList.remove('minimized');
    input.value = '';
    charCount.textContent = '0';
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => input.focus(), 300);
  });

  // ========== Enter key ==========
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); flipBtn.click(); }
  });

  // ========== Particles & Halo (capped at 12 particles) ==========
  function createHaloRings() {
    requestAnimationFrame(() => {
      const { left, top, width, height } = outputSection.getBoundingClientRect();
      const cx = left + width / 2, cy = top + height / 2;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const ring = Object.assign(document.createElement('div'), { className: 'halo-ring' });
          ring.style.left = cx + 'px'; ring.style.top = cy + 'px';
          document.body.appendChild(ring);
          setTimeout(() => ring.remove(), 1500);
        }, i * 300);
      }
    });
  }

  function createFlipParticles() {
    // Capped at 12 to reduce DOM thrash
    const particles = ['✨','⭐','💫','🌟','💥','⚡','🌠','💎','💚','🦋','🌸','✴️'];
    requestAnimationFrame(() => {
      const { left, top, width, height } = input.getBoundingClientRect();
      const cx = left + width / 2, cy = top + height / 2;
      particles.forEach((p, i) => {
        setTimeout(() => {
          const el = document.createElement('div');
          el.className = 'flip-particle';
          el.textContent = p;
          el.setAttribute('aria-hidden', 'true');
          el.style.left = cx + 'px'; el.style.top = cy + 'px';
          const angle = (i / particles.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
          const dist  = 350 + Math.random() * 200;
          el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
          el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2000);
        }, i * 30);
      });
    });
  }

  // ========== Flip Action ==========
  async function performFlip() {
    const text = input.value.trim();
    if (!text) { showToast('Please enter a thought first'); return; }

    flipBtn.disabled = true;
    flipBtn.textContent = 'Flipping...';

    const appContainer = document.querySelector('.app-container');
    appContainer?.classList.add('animating');

    const whoosh1 = Object.assign(document.createElement('div'), { className: 'whoosh-overlay' });
    const whoosh2 = Object.assign(document.createElement('div'), { className: 'whoosh-overlay-2' });
    document.body.append(whoosh1, whoosh2);

    createHaloRings();
    createFlipParticles();

    progressWrapper.classList.remove('hidden');
    progressInner.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 10, 100);
      progressInner.style.width = progress + '%';
      progressInner.textContent = progress + '%';
    }, 150);

    extendedFlipEl.textContent = 'Generating...';

    try {
      const result = await window.FlipEngine.flip(text);

      await new Promise(r => setTimeout(r, 100));
      inputSection.classList.add('minimized');
      outputSection.classList.remove('hidden');
      await new Promise(r => setTimeout(r, 200));
      outputSection.classList.add('show');

      setTimeout(() => outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      await new Promise(r => setTimeout(r, 750));

      extendedFlipEl.textContent = result.expandedAffirmation || result.basicAffirmation || 'No result';

      app.state?.addEntry?.('flip', { original: text, flipped: extendedFlipEl.textContent });

      extendedFlipEl.classList.add('text-reveal');
      setTimeout(() => extendedFlipEl.classList.remove('text-reveal'), 600);

      if (wasVoiceInput) {
        setTimeout(() => { speakText(extendedFlipEl.textContent); wasVoiceInput = false; }, 800);
      } else {
        wasVoiceInput = false;
      }
    } catch (err) {
      console.error(err);
      extendedFlipEl.textContent = 'Error generating flip.';
      showToast('Error occurred');
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        progressWrapper.classList.add('hidden');
        whoosh1.remove(); whoosh2.remove();
        appContainer?.classList.remove('animating');
      }, 1500);
      flipBtn.disabled = false;
      flipBtn.innerHTML = `${FLIP_SVG} Flip It Now`;
    }
  }

  flipBtn.addEventListener('click', performFlip);

  // ========== Clear ==========
  clearBtn.addEventListener('click', () => {
    input.value = '';
    extendedFlipEl.textContent = 'Your Flipped Script will appear here...';
    charCount.textContent = '0';
    if (!outputSection.classList.contains('hidden')) {
      outputSection.classList.add('hidden');
      outputSection.classList.remove('show');
      inputSection.classList.remove('minimized');
    }
  });

  // ========== Audio ==========
  audioExtendedBtn.addEventListener('click', () => speakText(extendedFlipEl.textContent));

  // ========== Save ==========
  function addSaved(text) {
    const t = text.trim().slice(0, 500);
    if (!t || t.includes('will appear here')) return;
    if (savedFlips.some(f => f.text === t)) { showToast('Already saved'); return; }
    savedFlips.unshift({ text: t, favorite: false, timestamp: new Date().toISOString() });
    persistSavedFlips();
    renderSaved();
    showToast('Saved!');
  }

  saveExtendedBtn.addEventListener('click', () => addSaved(extendedFlipEl.textContent));

  // ========== Render Saved ==========
  function renderSaved(filter = '') {
    savedList.innerHTML = '';
    const lower    = filter.toLowerCase();
    const filtered = filter ? savedFlips.filter(f => f.text.toLowerCase().includes(lower)) : savedFlips;

    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'saved-item';
      const p = document.createElement('p');
      p.className = 'placeholder';
      p.textContent = 'No saved flips yet.';
      li.appendChild(p);
      savedList.appendChild(li);
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach(item => {
      const actualIdx = savedFlips.indexOf(item);
      const li = document.createElement('li');
      li.className = 'saved-item' + (item.favorite ? ' favorite' : '');

      const textDiv = document.createElement('div');
      textDiv.style.flex = '1';
      const p = document.createElement('p');
      p.textContent = item.text;
      textDiv.appendChild(p);

      const actions = document.createElement('div');
      actions.className = 'action-icons';

      const mkBtn = (cls, label) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = `small-btn ${cls}`; b.textContent = label;
        return b;
      };

      const editBtn   = mkBtn('edit', 'Edit');
      const deleteBtn = mkBtn('delete', 'Delete');
      const favBtn    = mkBtn('favorite', item.favorite ? '★' : '☆');
      favBtn.setAttribute('aria-label', item.favorite ? 'Unfavorite' : 'Favorite');

      deleteBtn.addEventListener('click', () => {
        savedFlips.splice(actualIdx, 1);
        persistSavedFlips();
        renderSaved(filter);
        showToast('Deleted');
      });

      favBtn.addEventListener('click', () => {
        savedFlips[actualIdx].favorite = !savedFlips[actualIdx].favorite;
        persistSavedFlips();
        renderSaved(filter);
        showToast(savedFlips[actualIdx].favorite ? '⭐ Favorited' : '☆ Unfavorited');
      });

      editBtn.addEventListener('click', () => {
        const inp = document.createElement('input');
        inp.type = 'text'; inp.value = p.textContent;
        inp.className = 'edit-input'; inp.maxLength = 500;
        p.replaceWith(inp);
        inp.focus();
        const commit = () => {
          savedFlips[actualIdx].text = inp.value.trim().slice(0, 500);
          persistSavedFlips();
          renderSaved(filter);
        };
        inp.addEventListener('blur', commit);
        inp.addEventListener('keypress', e => { if (e.key === 'Enter') inp.blur(); });
      });

      actions.append(editBtn, deleteBtn, favBtn);
      li.append(textDiv, actions);
      frag.appendChild(li);
    });
    savedList.appendChild(frag);
  }

  // Debounced search
  let searchTimer;
  searchSaved.addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderSaved(e.target.value), 200);
  });

  // ========== Backup / Restore ==========
  backupBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ savedFlips, version: '2.0', exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `FlipTheScript_Backup_${new Date().toISOString().split('T')[0]}.json` });
    document.body.appendChild(a);
    a.click(); a.remove();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded!');
  });

  restoreBtn.addEventListener('click', () => {
    const fileInput = Object.assign(document.createElement('input'), { type: 'file', accept: 'application/json' });
    fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) { showToast('File too large'); return; }
      if (file.type !== 'application/json') { showToast('Invalid file type — JSON only'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = JSON.parse(reader.result);
          if (!Array.isArray(backup.savedFlips)) throw new Error('Invalid format');
          // Validate each item shape
          savedFlips = backup.savedFlips
            .filter(f => f && typeof f.text === 'string' && f.text.trim())
            .map(f => ({ text: f.text.trim().slice(0, 500), favorite: !!f.favorite, timestamp: f.timestamp || new Date().toISOString() }));
          persistSavedFlips();
          renderSaved();
          showToast('Backup restored!');
        } catch { showToast('Invalid backup file'); }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  });

  // ========== Keyboard Shortcuts (scoped, with cleanup) ==========
  function onKeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); flipBtn.click(); }
    else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      const t = extendedFlipEl.textContent;
      if (t && !t.includes('will appear here')) addSaved(t);
    } else if (e.key === 'Escape') { clearBtn.click(); }
  }
  document.addEventListener('keydown', onKeydown);
  // Cleanup on tab navigation away
  window.addEventListener('pagehide', () => document.removeEventListener('keydown', onKeydown), { once: true });

  // ========== Init ==========
  renderSaved();
}