// Mini-Apps/FlipTheScript/ui.js

export function mountUI(app) {

  // ---------------------------
  // Safe localStorage wrapper
  // ---------------------------
  const ls = {
    get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
    set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
    remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
  };

  // ---------------------------
  // XSS escape helper
  // ---------------------------
  function esc(v) {
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // ========== DOM Elements ==========
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
  try {
    const raw = ls.get('savedFlips');
    savedFlips = raw ? JSON.parse(raw) : [];
  } catch { savedFlips = []; }

  let isListening   = false;
  let recognition   = null;
  let wasVoiceInput = false;

  // On mount: prefer Supabase data over localStorage if available
  if (app.state?.data?.flipEntries?.length) {
    savedFlips = app.state.data.flipEntries;
  }

  // ========== Persistence ==========
  // Fixed: removed infinite self-call; persists to localStorage + Supabase
  function persistSavedFlips() {
    ls.set('savedFlips', JSON.stringify(savedFlips));
    if (app.state) {
      app.state.data.flipEntries = savedFlips;
      app.state.saveAppData();
    }
  }

  // bfcache: use pagehide in addition to any existing handlers
  window.addEventListener('pagehide', persistSavedFlips);

  // ========== Helper Functions ==========
  function showToast(message) {
    app.showToast(message);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('Copied to clipboard!'); } catch (_) {}
      document.body.removeChild(ta);
    }
  }

  function speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate   = 0.9;
      utterance.pitch  = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
      showToast('Playing audio...');
    } else {
      showToast('Audio not supported');
    }
  }

  // ========== Mic SVG ==========
  const MIC_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 19v3"/><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`;

  // ========== Voice Input (Speech Recognition) ==========
  function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      voiceInputBtn.style.display = 'none';
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous      = false;
    recognition.interimResults  = false;
    recognition.lang            = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      voiceInputBtn.classList.add('listening');
      voiceInputBtn.setAttribute('aria-label', 'Stop listening');
      voiceInputBtn.textContent = '🔴';
      showToast('Listening... Speak now!');
    };

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript.slice(0, 500); // enforce max
      charCount.textContent = input.value.length;
      showToast('Got it! Flipping now...');
      wasVoiceInput = true;
      setTimeout(() => {
        if (transcript.trim()) flipBtn.click();
      }, 500);
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      voiceInputBtn.classList.remove('listening');
      voiceInputBtn.setAttribute('aria-label', 'Speak your thought');
      voiceInputBtn.innerHTML = MIC_SVG;
      const msgs = {
        'no-speech':   'No speech detected. Try again!',
        'not-allowed': 'Microphone access denied. Please allow microphone access in browser settings.',
        'network':     'Network error. Check your internet connection.'
      };
      showToast(msgs[event.error] || 'Could not recognize speech. Try again.');
    };

    recognition.onend = () => {
      isListening = false;
      voiceInputBtn.classList.remove('listening');
      voiceInputBtn.setAttribute('aria-label', 'Speak your thought');
      voiceInputBtn.innerHTML = MIC_SVG;
    };
  }

  voiceInputBtn.addEventListener('click', async () => {
    if (!recognition) {
      showToast('Speech recognition not supported in this browser');
      return;
    }
    if (isListening) { recognition.stop(); return; }
    if (window.location.protocol !== 'https:' &&
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1') {
      showToast('Microphone requires HTTPS. Voice input only works on secure pages.');
      return;
    }
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      showToast('Could not start voice input. Please try again.');
    }
  });

  initSpeechRecognition();

  // ========== Character Counter ==========
  input.addEventListener('input', () => {
    const count = input.value.length;
    charCount.textContent = count;
    const counter = charCount.parentElement;
    counter.classList.remove('warning', 'danger');
    if (count > 400)      counter.classList.add('danger');
    else if (count > 350) counter.classList.add('warning');
  });

  // ========== Flip Suggestions ==========
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text') || '';
      input.value = text.slice(0, 500);
      charCount.textContent = input.value.length;
      input.focus();
    });
  });

  // ========== Collapsible Behavior ==========
  document.querySelectorAll('.collapsible-card').forEach(card => {
    const toggle  = card.querySelector('.collapse-toggle');
    const content = card.querySelector('.collapse-content');
    const icon    = toggle ? toggle.querySelector('.collapse-icon') : null;
    if (!toggle || !content) return;

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        content.classList.add('collapsed');
        if (icon) icon.textContent = '▶';
      } else {
        content.classList.remove('collapsed');
        if (icon) icon.textContent = '▼';
      }
    });
  });

  // ========== Flip Another Button ==========
  flipAnotherBtn.addEventListener('click', () => {
    outputSection.classList.add('hidden');
    outputSection.classList.remove('show');
    inputSection.classList.remove('minimized');
    input.value = '';
    charCount.textContent = '0';
    inputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => input.focus(), 300);
  });

  // ========== Handle Enter Key ==========
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      flipBtn.click();
    }
  });

  // ========== Create halo rings ==========
  function createHaloRings() {
    const section = document.getElementById('output-section');
    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const ring = document.createElement('div');
          ring.className = 'halo-ring';
          ring.style.left = centerX + 'px';
          ring.style.top  = centerY + 'px';
          document.body.appendChild(ring);
          setTimeout(() => ring.remove(), 1500);
        }, i * 300);
      }
    });
  }

  // ========== Create floating particles ==========
  function createFlipParticles() {
    const particles = ['✨','⭐','💫','🌟','💥','⚡','🌠','💎','💚','🦋','🌸','✴️','🎆','💖','🌈','💎','✴️','🎆','🎇','✨','⭐','💫','🌟','💥'];
    requestAnimationFrame(() => {
      const rect = input.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      particles.forEach((particle, i) => {
        setTimeout(() => {
          const el = document.createElement('div');
          el.className  = 'flip-particle';
          el.textContent = particle;
          el.setAttribute('aria-hidden', 'true');
          el.style.left = centerX + 'px';
          el.style.top  = centerY + 'px';
          const angle    = (i / particles.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
          const distance = 350 + Math.random() * 200;
          el.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
          el.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
          document.body.appendChild(el);
          setTimeout(() => el.remove(), 2000);
        }, i * 30);
      });
    });
  }

  // ========== Flip It Now SVG ==========
  const FLIP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/></svg>`;

  // ========== Enhanced Flip Action ==========
  async function performFlip() {
    const text = input.value.trim();
    if (!text) { showToast('Please enter a thought first'); return; }

    flipBtn.disabled = true;
    flipBtn.textContent = 'Flipping...';

    const appContainer = document.querySelector('.app-container');
    if (appContainer) appContainer.classList.add('animating');

    const whoosh1 = document.createElement('div');
    whoosh1.className = 'whoosh-overlay';
    document.body.appendChild(whoosh1);

    const whoosh2 = document.createElement('div');
    whoosh2.className = 'whoosh-overlay-2';
    document.body.appendChild(whoosh2);

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

    // Use textContent — never innerHTML for AI/user content
    extendedFlipEl.textContent = 'Generating...';

    try {
      const result = await window.FlipEngine.flip(text);

      await new Promise(resolve => setTimeout(resolve, 100));
      inputSection.classList.add('minimized');
      outputSection.classList.remove('hidden');
      await new Promise(resolve => setTimeout(resolve, 200));
      outputSection.classList.add('show');

      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);

      await new Promise(resolve => setTimeout(resolve, 750));

      // Set result via textContent — XSS safe
      extendedFlipEl.textContent = result.expandedAffirmation || result.basicAffirmation || 'No result';

      if (app.state) {
        app.state.addEntry('flip', {
          original: text,
          flipped: result.expandedAffirmation || result.basicAffirmation || ''
        });
      }

      extendedFlipEl.classList.add('text-reveal');
      await new Promise(resolve => setTimeout(resolve, 600));
      setTimeout(() => extendedFlipEl.classList.remove('text-reveal'), 600);

      if (wasVoiceInput) {
        setTimeout(() => {
          speakText(extendedFlipEl.textContent);
          wasVoiceInput = false;
        }, 800);
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
        whoosh1.remove();
        whoosh2.remove();
        if (appContainer) appContainer.classList.remove('animating');
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

  // ========== Saved Flips Rendering ==========
  function renderSaved(filter = '') {
    savedList.innerHTML = '';

    let filtered = savedFlips;
    if (filter) {
      const lower = filter.toLowerCase();
      filtered = savedFlips.filter(f => f.text.toLowerCase().includes(lower));
    }

    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.className = 'saved-item';
      const p = document.createElement('p');
      p.className = 'placeholder';
      p.textContent = 'No saved flips yet.';
      li.appendChild(p);
      savedList.appendChild(li);
      return;
    }

    filtered.forEach(item => {
      const actualIdx = savedFlips.indexOf(item);
      const li = document.createElement('li');
      li.className = 'saved-item';
      if (item.favorite) li.classList.add('favorite');

      // Build DOM safely — no innerHTML with user content
      const textDiv = document.createElement('div');
      textDiv.style.flex = '1';
      const p = document.createElement('p');
      p.textContent = item.text; // XSS safe
      textDiv.appendChild(p);

      const actions = document.createElement('div');
      actions.className = 'action-icons';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'small-btn edit';
      editBtn.textContent = 'Edit';

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'small-btn delete';
      deleteBtn.textContent = 'Delete';

      const favBtn = document.createElement('button');
      favBtn.type = 'button';
      favBtn.className = 'small-btn favorite';
      favBtn.textContent = item.favorite ? '★' : '☆';
      favBtn.setAttribute('aria-label', item.favorite ? 'Unfavorite' : 'Favorite');

      actions.append(editBtn, deleteBtn, favBtn);
      li.append(textDiv, actions);

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
        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.value = p.textContent;
        inputEl.className = 'edit-input';
        inputEl.maxLength = 500;
        p.replaceWith(inputEl);
        inputEl.focus();
        inputEl.addEventListener('blur', () => {
          savedFlips[actualIdx].text = inputEl.value.trim().slice(0, 500);
          persistSavedFlips();
          renderSaved(filter);
        });
        inputEl.addEventListener('keypress', e => {
          if (e.key === 'Enter') inputEl.blur();
        });
      });

      savedList.appendChild(li);
    });
  }

  searchSaved.addEventListener('input', e => renderSaved(e.target.value));

  // ========== Backup / Restore ==========
  backupBtn.addEventListener('click', () => {
    const backup = { savedFlips, version: '2.0', exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `FlipTheScript_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup downloaded!');
  });

  restoreBtn.addEventListener('click', () => {
    const inputFile = document.createElement('input');
    inputFile.type   = 'file';
    inputFile.accept = 'application/json';
    inputFile.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      // File size guard (5 MB)
      if (file.size > 5 * 1024 * 1024) { showToast('File too large'); return; }
      // MIME type guard
      if (file.type !== 'application/json') { showToast('Invalid file type — JSON only'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = JSON.parse(reader.result);
          if (Array.isArray(backup.savedFlips)) {
            savedFlips = backup.savedFlips;
            persistSavedFlips();
          }
          renderSaved();
          showToast('Backup restored!');
        } catch {
          showToast('Invalid backup file');
        }
      };
      reader.readAsText(file);
    };
    inputFile.click();
  });

  // ========== Keyboard Shortcuts ==========
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      flipBtn.click();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (extendedFlipEl.textContent && !extendedFlipEl.textContent.includes('will appear here')) {
        addSaved(extendedFlipEl.textContent);
      }
    }
    if (e.key === 'Escape') clearBtn.click();
  });

  // ========== Initialize ==========
  renderSaved();
}
