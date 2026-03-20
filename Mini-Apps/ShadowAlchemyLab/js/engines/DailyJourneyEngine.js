/*! Mini-Apps/ShadowAlchemyLab/js/engines/DailyJourneyEngine.js
 *  Patched: ls wrapper, frozen data constants, crypto uid, esc() in HTML,
 *  type=button on buttons, parseInt radix 10, textContent for user text output.
 */
(function (window, document) {
  'use strict';

  const STORAGE_KEY    = 'daily_journey_v1';
  const REWARD_TOKENS  = 5;

  // Safe localStorage wrapper
  const ls = {
    get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
    set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
    remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
  };

  // XSS escape helper
  function esc(v) {
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Crypto-based UID
  function uid(prefix = '') {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      return prefix + Date.now().toString(36) + '-' + arr[0].toString(36) + arr[1].toString(36);
    }
    return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  /* ========== DATA LAYER (frozen) ========== */
  const CASES = Object.freeze([
    Object.freeze({ id: 'relationships', label: 'Relationships', intro: 'Mirrors and projections.' }),
    Object.freeze({ id: 'work',          label: 'Work',          intro: 'Identity, purpose, and worth.' }),
    Object.freeze({ id: 'money',         label: 'Money',         intro: 'Worth, scarcity, and value.' }),
    Object.freeze({ id: 'body',          label: 'Body',          intro: 'Shame, pride, and conditioning.' }),
    Object.freeze({ id: 'thoughts',      label: 'Thoughts',      intro: 'Internal narratives and limits.' }),
    Object.freeze({ id: 'lovelife',      label: 'Love Life',     intro: 'Intimacy, desire, vulnerability.' }),
    Object.freeze({ id: 'family',        label: 'Family',        intro: 'Inherited patterns and roles.' }),
    Object.freeze({ id: 'spirituality',  label: 'Spirituality',  intro: 'Meaning, faith, and existential unrest.' }),
    Object.freeze({ id: 'purpose',       label: 'Purpose',       intro: 'Direction, doubt, and the fear of wasting time.' }),
    Object.freeze({ id: 'play',          label: 'Play',          intro: 'Pleasure, guilt-free fun, and forgotten lightness.' })
  ]);

  // Whitelist of valid case IDs for validation
  const VALID_CASE_IDS = Object.freeze(new Set(CASES.map(c => c.id)));

  const QUESTIONS_TEMPLATE = Object.freeze([
    'Describe what happened or how you feel about {case} right now.',
    'What are you telling yourself about this situation? Notice any internal judgments or stories.',
    'Beneath that story, what emotion sits quietly? Name it and any bodily sensation.',
    'What need was not met here? What would this part of you ask for in a perfect world?',
    'If the shadow part could speak, what short message would it give you now? (Give it compassion.)'
  ]);

  const QUESTIONS_SPIRITUALITY = Object.freeze([
    'Describe what is stirring (or feels absent) in your spiritual life right now.',
    'What story are you telling yourself about your connection to something greater\u2014or to nothing at all?',
    'Sit quietly: what emotion lives under that story? Name it, and notice where it sits in the body.',
    'What sacred need is asking to be met here\u2014truth, trust, surrender, or simply space to doubt?',
    'If the restless or faithful part could speak a single whisper to you, what compassionate message would it offer?'
  ]);

  const QUESTIONS_PURPOSE = Object.freeze([
    'Describe the quiet (or loud) question you\u2019re hearing about your direction in life right now.',
    'What internal narrative links your worth to \u201cmaking it count\u201d or \u201cgetting it right\u201d?',
    'Beneath that narrative, what emotion waits\u2014restlessness, dread, longing, something else? Locate it physically.',
    'Which deeper need is asking for acknowledgment\u2014meaning, contribution, freedom, or simply permission to not know yet?',
    'If the part of you that fears wasted time could hand you a single sentence of kindness, what would it say?'
  ]);

  const QUESTIONS_PLAY = Object.freeze([
    'When you picture pure, light-hearted play, what moment\u2014or absence\u2014shows up first?',
    'What story do you carry about whether you\u2019ve \u201cearned\u201d joy or if it\u2019s a distraction from \u201creal work\u201d?',
    'Drop into the body: what emotion lives under that story\u2014guilt, fear of slack, wistful hunger? Name and locate it.',
    'Which need is quietly asking\u2014rest, creative mischief, sensory delight, or simply the right to exist without output?',
    'If your playful shadow could leap forward and gift you one playful permission slip, what exuberant words would it write?'
  ]);

  const EMOTIONS = Object.freeze([
    'Choose one', 'anger', 'sadness', 'fear', 'shame', 'guilt', 'joy',
    'relief', 'anxiety', 'loneliness', 'love', 'embarrassment'
  ]);

  const THEME_KEYWORDS = Object.freeze({
    rejection:   Object.freeze(['reject','rejected','rejection','ignored','left out']),
    control:     Object.freeze(['control','controlled','controlling','micromanage','must']),
    worth:       Object.freeze(['worth','worthless','deserve','deserved','value']),
    shame:       Object.freeze(['shame','ashamed','embarrass','humiliat']),
    abandonment: Object.freeze(['abandon','abandoned','left']),
    fear:        Object.freeze(['fear','afraid','scared','panic']),
    anger:       Object.freeze(['angry','anger','rage','mad']),
    grief:       Object.freeze(['loss','grief','grieve','sad']),
    envy:        Object.freeze(['envy','jealous','jealousy']),
    perfection:  Object.freeze(['perfect','must','should','ought'])
  });

  const PRACTICE_SUGGESTIONS = Object.freeze({
    grounding: Object.freeze({ id:'grounding', title:'Grounding Body Scan',   desc:'3\u20135 minute grounding body scan to settle energy.' }),
    breath:    Object.freeze({ id:'breath',    title:'Heart Breath',          desc:'4-6 breathing cycles focusing on the heart center.' }),
    mirror:    Object.freeze({ id:'mirror',    title:'Mirror Compassion',     desc:'2\u20134 minutes of soft mirror-gazing and kind phrases.' }),
    movement:  Object.freeze({ id:'movement',  title:'Somatic Release',       desc:'Safe movement or shaking for 2\u20135 minutes to discharge energy.' }),
    boundary:  Object.freeze({ id:'boundary',  title:'Boundary Script',       desc:'Write and rehearse a short, clear boundary message.' }),
    journal:   Object.freeze({ id:'journal',   title:'Free Vent Page',        desc:'Continue to write uncensored for 5\u201310 minutes.' })
  });

  const ARCHETYPE_SUGGESTIONS = Object.freeze({
    perfectionist: Object.freeze({ id:'perfectionist', name:'Perfectionist',  short:'Control and high standards' }),
    wounded_child: Object.freeze({ id:'wounded_child', name:'Wounded Child',  short:'Need for safety and validation' }),
    warrior:       Object.freeze({ id:'warrior',       name:'Warrior',        short:'Boundary and agency' }),
    lover:         Object.freeze({ id:'lover',         name:'Lover',          short:'Desire and intimacy' }),
    sage:          Object.freeze({ id:'sage',          name:'Sage',           short:'Wisdom and perspective' })
  });

  /* ========== STORAGE LAYER ========== */
  function loadAllJourneys() {
    const raw = ls.get(STORAGE_KEY);
    if (!raw) return [];
    try { return JSON.parse(raw); }
    catch (e) { console.warn('DailyJourneyEngine: load error', e); return []; }
  }

  function saveAllJourneys(list) {
    ls.set(STORAGE_KEY, JSON.stringify(list));
  }

  /* ========== ANALYSIS LAYER ========== */
  function extractThemes(text) {
    const t = (text || '').toLowerCase();
    const found = {};
    for (const theme in THEME_KEYWORDS) {
      for (const kw of THEME_KEYWORDS[theme]) {
        if (t.includes(kw)) found[theme] = (found[theme] || 0) + 1;
      }
    }
    return Object.keys(found).sort((a, b) => found[b] - found[a]);
  }

  function detectPrimaryEmotion(text) {
    const t = (text || '').toLowerCase();
    for (const em of EMOTIONS) if (t.includes(em)) return em;
    if (t.match(/(afraid|scared|panic)/)) return 'fear';
    if (t.match(/(angry|mad|rage)/))      return 'anger';
    if (t.match(/(sad|loss|grief)/))      return 'sadness';
    return 'neutral';
  }

  function calculateAverageIntensity(answers) {
    if (!Array.isArray(answers) || !answers.length) return 0;
    const sum = answers.reduce((s, a) => s + (parseInt(String(a.intensity), 10) || 0), 0);
    return Math.round((sum / answers.length) * 10) / 10;
  }

  function suggestPractice(themes) {
    if (!themes?.length) return PRACTICE_SUGGESTIONS.journal;
    if (themes.includes('shame') || themes.includes('rejection')) return PRACTICE_SUGGESTIONS.mirror;
    if (themes.includes('control') || themes.includes('perfection')) return PRACTICE_SUGGESTIONS.boundary;
    if (themes.includes('anger') || themes.includes('grief')) return PRACTICE_SUGGESTIONS.movement;
    if (themes.includes('fear') || themes.includes('anxiety')) return PRACTICE_SUGGESTIONS.breath;
    return PRACTICE_SUGGESTIONS.grounding;
  }

  function suggestArchetype(themes) {
    if (!themes?.length) return ARCHETYPE_SUGGESTIONS.wounded_child;
    if (themes.includes('perfection')) return ARCHETYPE_SUGGESTIONS.perfectionist;
    if (themes.includes('control'))    return ARCHETYPE_SUGGESTIONS.warrior;
    return ARCHETYPE_SUGGESTIONS.wounded_child;
  }

  /* ========== HELPERS ========== */
  function buildQuestions(caseId) {
    const caseLabel = (CASES.find(c => c.id === caseId) || {}).label || caseId;
    let tpl = QUESTIONS_TEMPLATE;
    switch (caseId) {
      case 'spirituality': tpl = QUESTIONS_SPIRITUALITY; break;
      case 'purpose':      tpl = QUESTIONS_PURPOSE;      break;
      case 'play':         tpl = QUESTIONS_PLAY;          break;
    }
    return tpl.map((text, idx) => ({
      id:   `q${idx + 1}`,
      text: text.replace('{case}', caseLabel)
    }));
  }

  function awardTokens(tokens = REWARD_TOKENS) {
    if (window.AppController && typeof window.AppController.addLightParticles === 'function') {
      try { window.AppController.addLightParticles(tokens); } catch (e) { console.warn('DailyJourneyEngine: addLightParticles error', e); }
    }
  }

  /* ========== UI LAYER ========== */
  function renderCaseSelection(root, callback) {
    root.innerHTML = `
      <h3>Choose an area of life to journal about today</h3>
      <div class="case-selection-grid" style="margin-bottom:1.5rem"></div>
    `;
    const grid = root.querySelector('.case-selection-grid');
    CASES.forEach(c => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn case-btn';
      btn.dataset.caseId = c.id; // safe — whitelisted IDs only
      btn.innerHTML = `<strong>${esc(c.label)}</strong><span class="muted" style="font-size:0.8rem;font-weight:400;">${esc(c.intro)}</span>`;
      grid.appendChild(btn);
    });
    grid.addEventListener('click', e => {
      const btn = e.target.closest('.case-btn');
      if (!btn) return;
      const caseId = btn.dataset.caseId;
      // Validate against whitelist before using
      if (VALID_CASE_IDS.has(caseId)) callback(caseId);
    });
  }

  function renderStep(root, session, questions, stepIndex, onBack, onNext) {
    const q               = questions[stepIndex];
    const progressPercent = Math.round((stepIndex / questions.length) * 100);

    const progressEl = root.querySelector('#journey-progress');
    if (progressEl) {
      progressEl.innerHTML = `
        <div class="muted" style="font-size:0.9rem">Step ${stepIndex + 1} of ${questions.length}</div>
        <div class="progress-bar" style="margin-top:8px">
          <div class="progress-fill" style="width:${progressPercent}%"></div>
        </div>`;
    }

    const emotionOptions = [...EMOTIONS, 'other', 'neutral']
      .map(em => `<option value="${esc(em)}">${esc(em.charAt(0).toUpperCase() + em.slice(1))}</option>`)
      .join('');

    const qBox = root.querySelector('#journey-question-box');
    if (qBox) {
      // Question text comes from frozen template strings — safe, but still esc for belt-and-suspenders
      qBox.innerHTML = `
        <h4>${esc(q.text)}</h4>
        <textarea id="journey-answer" class="form-input" placeholder="Write your response here..."
          style="min-height:120px;margin-top:0.5rem;" maxlength="5000"></textarea>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;align-items:center;">
          <div>
            <label class="form-label" for="journey-emotion">Primary emotion:</label>
            <select id="journey-emotion" class="form-input">${emotionOptions}</select>
          </div>
          <div>
            <label class="form-label" for="journey-intensity">Intensity: <span id="intensity-value">5</span></label>
            <input id="journey-intensity" type="range" min="1" max="10" value="5"
                   class="intensity-slider" aria-label="Intensity level 1 to 10">
          </div>
        </div>`;
    }

    const intensitySlider = root.querySelector('#journey-intensity');
    const intensityValue  = root.querySelector('#intensity-value');
    if (intensitySlider && intensityValue) {
      intensitySlider.addEventListener('input', () => { intensityValue.textContent = intensitySlider.value; });
    }

    // Restore existing answer if any
    const existing = session.steps.find(s => s.qid === q.id);
    if (existing) {
      const answerEl = root.querySelector('#journey-answer');
      if (answerEl) answerEl.value = existing.answerText || '';
      const emotionEl = root.querySelector('#journey-emotion');
      if (emotionEl) emotionEl.value = existing.emotion || 'neutral';
      if (intensitySlider) intensitySlider.value = parseInt(String(existing.intensity || 5), 10);
      if (intensityValue && intensitySlider) intensityValue.textContent = intensitySlider.value;
    }

    const navEl = root.querySelector('#journey-nav');
    if (navEl) {
      navEl.innerHTML = (stepIndex > 0 ? '<button type="button" id="journey-back" class="btn">Back</button>' : '') +
        `<button type="button" id="journey-next" class="btn btn-primary">
          ${stepIndex === questions.length - 1 ? 'Proceed to Vent' : 'Save &amp; Next'}
        </button>`;

      navEl.querySelector('#journey-next').addEventListener('click', () => {
        const answerEl    = root.querySelector('#journey-answer');
        const emotionEl   = root.querySelector('#journey-emotion');
        const intensityEl = root.querySelector('#journey-intensity');
        const stepEntry = {
          qid:        q.id,
          question:   q.text,
          answerText: (answerEl?.value || '').trim().slice(0, 5000),
          emotion:    EMOTIONS.includes(emotionEl?.value) ? emotionEl.value : 'neutral',
          intensity:  Math.max(1, Math.min(10, parseInt(String(intensityEl?.value || '5'), 10)))
        };
        onNext(stepEntry);
      });

      const backBtn = navEl.querySelector('#journey-back');
      if (backBtn) backBtn.addEventListener('click', onBack);
    }
  }

  function renderVent(root, onBack, onFinish) {
    const progressEl = root.querySelector('#journey-progress');
    if (progressEl) {
      progressEl.innerHTML = `
        <div class="muted" style="font-size:0.9rem">Integration &amp; Release</div>
        <div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:95%"></div></div>`;
    }

    const qBox = root.querySelector('#journey-question-box');
    if (qBox) {
      qBox.innerHTML = `
        <h4>Cathartic Venting</h4>
        <p class="muted">This space is for release, not editing. Write freely.</p>
        <textarea id="journey-vent" class="form-input" placeholder="Venting box..."
          style="min-height:180px;margin-top:0.5rem;" maxlength="10000"></textarea>`;
    }

    const navEl = root.querySelector('#journey-nav');
    if (navEl) {
      navEl.innerHTML = `
        <button type="button" id="journey-back" class="btn">Back to Questions</button>
        <button type="button" id="journey-finish" class="btn btn-primary">Finish Journey</button>`;
      navEl.querySelector('#journey-back').addEventListener('click', onBack);
      navEl.querySelector('#journey-finish').addEventListener('click', () => {
        const ventEl = root.querySelector('#journey-vent');
        onFinish((ventEl?.value || '').trim().slice(0, 10000));
      });
    }
  }

  function renderComplete(root, summary) {
    // Use DOM API — no innerHTML with user-derived text
    root.textContent = '';

    const h3 = document.createElement('h3');
    h3.textContent = 'Journey Complete';
    root.appendChild(h3);

    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Your reflection is saved. You earned light-particles for your practice.';
    root.appendChild(p);

    const stat = document.createElement('div');
    stat.className = 'neuro-stat';
    stat.style.cssText = 'text-align:left;margin-top:1.5rem;';

    const themes     = (summary.themes || []).slice(0, 3).join(', ') || 'None detected';
    const practice   = (summary.suggestedPractice  || {}).title || 'None';
    const archetype  = (summary.suggestedArchetype  || {}).name  || 'None';

    [
      ['Primary themes', themes],
      ['Suggested practice', practice],
      ['Suggested archetype', archetype]
    ].forEach(([label, value], i) => {
      const div = document.createElement('div');
      if (i > 0) div.style.marginTop = '6px';
      const strong = document.createElement('strong');
      strong.textContent = label + ': ';
      div.appendChild(strong);
      div.appendChild(document.createTextNode(value));
      stat.appendChild(div);
    });
    root.appendChild(stat);

    const actions = document.createElement('div');
    actions.className = 'card-actions';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'return-dash';
    btn.className = 'btn';
    btn.textContent = 'Return to Dashboard';
    actions.appendChild(btn);
    root.appendChild(actions);
  }

  /* ========== ENGINE CLASS ========== */
  const DailyJourneyEngine = {
    _lastSummary: null,
    init() { loadAllJourneys(); },
    getAllJourneys() { return loadAllJourneys(); },

    startDailyJourney(containerOrSelector, options = {}) {
      const root = (typeof containerOrSelector === 'string')
        ? document.querySelector(containerOrSelector)
        : containerOrSelector;
      if (!root) { console.warn('DailyJourneyEngine: no container found'); return; }

      // Validate caseId against whitelist
      const chosenCase = VALID_CASE_IDS.has(options.caseId) ? options.caseId : null;

      if (!chosenCase) {
        renderCaseSelection(root, caseId => { this.startDailyJourney(root, { caseId }); });
        return;
      }

      const questions  = buildQuestions(chosenCase);
      const session    = {
        id:        uid('journey-'),
        caseId:    chosenCase,
        startedAt: Date.now(),
        steps:     [],
        vent:      '',
        meta:      {}
      };
      const caseLabel = (CASES.find(c => c.id === chosenCase) || {}).label || chosenCase;

      root.innerHTML = `
        <h3>Daily Journey \u2013 ${esc(caseLabel)}</h3>
        <p class="muted">A guided 5-step reflection. Move slowly, breathe, and answer from the heart.</p>
        <div id="journey-progress" style="margin:1rem 0;"></div>
        <div id="journey-question-box" style="margin-top:8px;"></div>
        <div id="journey-nav" class="card-actions" style="margin-top:1rem;"></div>`;

      const self = this;
      function showStep() {
        const stepIndex = session.steps.length;
        if (stepIndex >= questions.length) {
          renderVent(root,
            () => { session.steps.pop(); showStep(); },
            vent => {
              session.vent = vent;
              self.completeJourney(session);
              renderComplete(root, self._lastSummary || {});
            }
          );
        } else {
          renderStep(root, session, questions, stepIndex,
            () => { session.steps.pop(); showStep(); },
            stepEntry => { session.steps.push(stepEntry); showStep(); }
          );
        }
      }
      showStep();
    },

    completeJourney(session) {
      const allText = session.steps.map(s => s.answerText).join(' ') + ' ' + (session.vent || '');
      const themes  = [];
      session.steps.forEach(s => extractThemes(s.answerText || '').forEach(f => { if (!themes.includes(f)) themes.push(f); }));
      extractThemes(session.vent || '').forEach(f => { if (!themes.includes(f)) themes.push(f); });

      const entry = {
        id:                uid('entry-'),
        sessionId:         session.id,
        caseId:            session.caseId,
        date:              new Date().toISOString(),
        steps:             session.steps.slice(),
        vent:              session.vent,
        meta:              session.meta || {},
        themes,
        primaryEmotion:    detectPrimaryEmotion(allText),
        intensity:         calculateAverageIntensity(session.steps),
        suggestedPractice: suggestPractice(themes),
        suggestedArchetype:suggestArchetype(themes)
      };

      const all = loadAllJourneys();
      all.push(entry);
      saveAllJourneys(all);
      awardTokens(REWARD_TOKENS);

      this._lastSummary = {
        themes:             entry.themes,
        suggestedPractice:  entry.suggestedPractice,
        suggestedArchetype: entry.suggestedArchetype
      };
      return { entry, summary: this._lastSummary };
    }
  };

  /* ========== GLOBAL EXPORT ========== */
  window.DailyJourneyEngine = DailyJourneyEngine;
  document.addEventListener('DOMContentLoaded', () => DailyJourneyEngine.init());

})(window, document);
