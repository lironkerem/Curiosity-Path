// Mini-Apps/SelfAnalysisPro/js/ui.js
// UI Management
// Patched: removed console.log spam, XSS-safe dynamic content, type=button on
// dynamic buttons, esc() for dynamic values in HTML, TarotEngine.initImageLoading.

import DataMeanings from './meanings.js';
import TarotEngine from './TarotEngine.js';

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

class UIManager {
  constructor() {
    this.tarot             = new TarotEngine();
    this.onAnalyze         = null;
    this.onPdf             = null;
    this.onClear           = null;
    this.progressMgr       = null;
    this.toast             = null;
    this._debouncedValidate= null;
  }

  /* ----------------- Initialization & Wiring ----------------- */
  init() {
    if (typeof window.ProgressManager === 'function') {
      try { this.progressMgr = new window.ProgressManager(); } catch (e) { console.warn('ProgressManager init failed', e); }
    }
    if (typeof window.ToastManager === 'function') {
      try { this.toast = new window.ToastManager(); } catch (e) { console.warn('ToastManager init failed', e); }
    }

    this.form        = document.getElementById('analysis-form');
    this.btnAnalyze  = document.getElementById('btn-analyze');
    this.btnPdf      = document.getElementById('btn-pdf');
    this.btnClear    = document.getElementById('btn-clear');

    this._debouncedValidate = window.Utils?.debounce
      ? window.Utils.debounce((...a) => this.validateAll(...a), 220)
      : (() => this.validateAll());

    if (this.form) {
      this.form.addEventListener('input', () => {
        try { this._debouncedValidate(); } catch { this.validateAll(); }
      });
      this.form.addEventListener('submit', ev => {
        ev.preventDefault();
        if (!this.validateAll()) {
          this.showToast('Please fix the highlighted fields', 'error');
          return;
        }
        const formData = this.getFormData();
        if (typeof this.onAnalyze === 'function') {
          this.showProgress(5, 'Starting\u2026');
          this.onAnalyze(formData);
        }
      });
    }

    if (this.btnPdf) {
      this.btnPdf.disabled = true;
      this.btnPdf.addEventListener('click', e => {
        e.preventDefault();
        if (typeof this.onPdf === 'function') this.onPdf();
      });
    }

    if (this.btnClear) {
      this.btnClear.addEventListener('click', e => {
        e.preventDefault();
        if (this.form) this.form.reset();
        this.clearResults();
        if (typeof this.onClear === 'function') this.onClear();
        this.validateAll();
      });
    }

    this.initializeExpandableCards();
    this.validateAll();
  }

  /* ---- Expandable cards ---- */
  initializeExpandableCards() {
    setTimeout(() => {
      document.querySelectorAll('.expandable-card').forEach(card => {
        const header  = card.querySelector('.expandable-header');
        const content = card.querySelector('.expandable-content');
        if (!header || !content) return;

        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);

        const isExpanded = card.classList.contains('expanded');
        content.style.display = isExpanded ? 'block' : 'none';
        newHeader.setAttribute('aria-expanded', String(isExpanded));

        const toggle = () => {
          const expanded = card.classList.contains('expanded');
          card.classList.toggle('expanded');
          content.style.display = expanded ? 'none' : 'block';
          newHeader.setAttribute('aria-expanded', String(!expanded));

          if (card.dataset.section === 'personal-narrative') {
            const parentCard = card.closest('.story-watermark');
            if (parentCard) parentCard.classList.toggle('story-expanded', !expanded);
          }
        };

        newHeader.addEventListener('click', toggle);
        newHeader.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
      });
    }, 100);
  }

  /* -------------- Form Validation & Data -------------- */
  validateAll() {
    if (!this.form) return false;
    let ok = true;

    const fields = {
      first:    { input: 'first-name',     error: 'first-error',    validator: 'validateName',        required: true  },
      middle:   { input: 'middle-name',    error: 'middle-error',   validator: 'validateName',        required: false },
      last:     { input: 'last-name',      error: 'last-error',     validator: 'validateName',        required: true  },
      dob:      { input: 'date-of-birth',  error: 'dob-error',      validator: 'validateDateOfBirth', required: true  },
      tob:      { input: 'time-of-birth',  error: 'tob-error',      validator: 'validateTimeOfBirth', required: false },
      location: { input: 'location-birth', error: 'location-error', validator: 'validateLocation',    required: false }
    };

    Object.values(fields).forEach(({ input, error, validator, required }) => {
      const inputEl = document.getElementById(input);
      const errorEl = document.getElementById(error);
      const res = window.Validation?.[validator]?.(inputEl?.value);
      if (!res || !res.valid) {
        if (required) ok = false;
        if (errorEl) errorEl.textContent = res?.message || (required ? 'Required' : '');
      } else {
        if (errorEl) errorEl.textContent = '';
      }
    });

    if (this.btnAnalyze) this.btnAnalyze.disabled = !ok;
    return ok;
  }

  getFormData() {
    if (!this.form) return {};
    const formEl = this.form;
    const loc    = document.getElementById('location-birth');
    const locationLat = loc?.dataset?.lat || '';
    const locationLon = loc?.dataset?.lon || '';

    const fd = {
      firstName:       window.Utils?.sanitizeInput(formEl.elements['firstName']?.value      || ''),
      middleName:      window.Utils?.sanitizeInput(formEl.elements['middleName']?.value      || ''),
      lastName:        window.Utils?.sanitizeInput(formEl.elements['lastName']?.value       || ''),
      dateOfBirth:     formEl.elements['dateOfBirth']?.value   || '',
      timeOfBirth:     formEl.elements['timeOfBirth']?.value   || '',
      locationOfBirth: window.Utils?.sanitizeInput(formEl.elements['locationOfBirth']?.value || ''),
      locationLat,
      locationLon,
      includeY: formEl.elements['includeY']?.checked || false
    };
    fd.first    = fd.firstName;
    fd.last     = fd.lastName;
    fd.fullName = `${fd.firstName} ${fd.middleName ? fd.middleName + ' ' : ''}${fd.lastName}`.trim();
    return fd;
  }

  /* ------------------ Progress & Toast ------------------ */
  showProgress(percentage, message = '') {
    if (!this.progressMgr && typeof window.ProgressManager === 'function') {
      try { this.progressMgr = new window.ProgressManager(); } catch { /* noop */ }
    }
    if (this.progressMgr) {
      this.progressMgr.setProgress(percentage, message);
      if (percentage < 100) {
        if (this.progressMgr.wrapper) this.progressMgr.wrapper.style.display = 'block';
      } else {
        setTimeout(() => this.progressMgr.hide(), 400);
      }
    }
  }

  enablePdf(enable = true) {
    if (this.btnPdf) {
      this.btnPdf.disabled = !enable;
      this.btnPdf.setAttribute('aria-disabled', String(!enable));
    }
  }

  showToast(message, type = 'success') {
    if (this.toast && typeof this.toast.show === 'function') return this.toast.show(message, type);
    console.log(`[toast:${type}] ${message}`);
  }

  /* ----------------- Rendering & Results ----------------- */
  populateResults(results, narrativeResults) {
    this.updateQuickSummary(results, narrativeResults);
    this.updateDeepAnalysis(results);
    this.generateNumerologyCards(results);

    if (narrativeResults?.fullNarrative) {
      const el = document.getElementById('personal-narrative-content');
      if (el) { el.classList.remove('placeholder-text'); el.textContent = narrativeResults.fullNarrative; }
    }

    this.initializeExpandableCards();
  }

  displayResults(payload) {
    if (!payload) return;
    const results = payload.num
      ? Object.assign({}, payload.num, payload.astro, payload.tree, { sefira: payload.tree?.sephiroth?.[0] })
      : payload;
    this.populateResults(results, payload.narrative || payload);
    this.showProgress(100, 'Complete');
    this.enablePdf(true);
  }

  _renderTarotSection(cards, title = 'Tarot Correspondences') {
    if (!cards || cards.length === 0) return '';
    const cardsHTML = this.tarot.renderCards(cards);
    return `<div class="tarot-section-wrapper"><h3 class="tarot-section-title">${esc(title)}</h3>${cardsHTML}</div>`;
  }

  _insertTarotAndInit(targetEl, cards, title) {
    const html = this._renderTarotSection(cards, title);
    targetEl.insertAdjacentHTML('afterend', html);
    // Attach load/error handlers — avoids inline onload/onerror
    TarotEngine.initImageLoading(targetEl.parentElement);
  }

  updateQuickSummary(results, narrativeResults) {
    if (!narrativeResults) return;

    const numContent = document.getElementById('summary-numerology-content');
    if (numContent && narrativeResults.numerologySummary?.length) {
      numContent.classList.remove('placeholder-text');
      numContent.innerHTML = narrativeResults.numerologySummary.join('<br><br>');
    }

    const astroContent = document.getElementById('summary-astrology-content');
    if (astroContent) {
      astroContent.classList.remove('placeholder-text');
      let astroHTML = '';
      if (results.zodiac) {
        astroHTML += `Zodiac Sign: <strong>${esc(results.zodiac.name || '\u2014')}</strong><br>`;
        astroHTML += `Ruling Planet(s): <strong>${esc(results.zodiac.planet || '\u2014')}</strong><br>`;
        astroHTML += `Alchemical Element: <strong>${esc(results.zodiac.element || '\u2014')}</strong><br><br>`;
      }
      if (narrativeResults.astrologySummary?.length) {
        astroHTML += narrativeResults.astrologySummary.join('<br><br>');
      }
      astroContent.innerHTML = astroHTML;
    }

    const treeContent = document.getElementById('summary-tree-content');
    if (treeContent) {
      treeContent.classList.remove('placeholder-text');
      let treeHTML = '';
      if (results.sefira) treeHTML += `Prominent Sefira: <strong>${esc(results.sefira)}</strong><br><br>`;
      treeHTML += narrativeResults.treeSummary || 'No Tree of Life summary available.';
      treeContent.innerHTML = treeHTML;
    }
  }

  updateDeepAnalysis(results) {
    const astroPlaceholder = document.getElementById('astrology-content-placeholder');
    if (astroPlaceholder) astroPlaceholder.style.display = 'none';

    ['zodiac-sign', 'ruling-planet', 'alchemical-element', 'natal-chart'].forEach(section => {
      const card = document.querySelector(`.expandable-card[data-section="${section}"]`);
      if (card) { card.classList.remove('hidden'); card.style.display = 'block'; }
    });

    const treePlaceholder = document.getElementById('tree-content-placeholder');
    const treeData        = document.getElementById('tree-content-data');
    if (treePlaceholder) { treePlaceholder.classList.add('hidden');    treePlaceholder.style.display = 'none'; }
    if (treeData)        { treeData.classList.remove('hidden');         treeData.style.display = 'block'; }

    // Set plain text values — XSS safe
    const deepElements = {
      'deep-zodiac':  results.zodiac?.name    || '\u2014',
      'deep-planet':  results.zodiac?.planet  || '\u2014',
      'deep-element': results.zodiac?.element || '\u2014',
      'deep-sefira':  results.sefira          || '\u2014'
    };
    Object.entries(deepElements).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    });

    // Zodiac Sign
    if (results.zodiac?.name) {
      const headerEl  = document.getElementById('zodiac-meaning-header');
      const meaningEl = document.getElementById('zodiac-meaning');
      if (headerEl)  headerEl.textContent = `The meaning of ${results.zodiac.name}`;
      if (meaningEl) {
        meaningEl.innerHTML = DataMeanings.getZodiacMeaning(results.zodiac.name);
        this._insertTarotAndInit(meaningEl, this.tarot.getCardsForZodiac(results.zodiac.name), 'Tarot Correspondences');
      }
    }

    // Ruling Planet(s)
    if (results.zodiac?.planet) {
      const headerEl  = document.getElementById('planet-meaning-header');
      const meaningEl = document.getElementById('planet-meaning');
      const planets   = String(results.zodiac.planet).split(',').map(p => p.trim());

      if (headerEl) {
        headerEl.textContent = planets.length > 1
          ? `The meanings of ${planets.join(' and ')}`
          : `The meaning of ${planets[0]}`;
      }

      if (meaningEl) {
        let html = '';
        planets.forEach((planet, index) => {
          if (index > 0) html += '<hr style="margin:20px 0;border:1px solid #ddd;">';
          html += `<h4 style="color:#3F7652;margin-top:${index > 0 ? '20px' : '0'};">${esc(planet)}</h4>`;
          html += DataMeanings.getPlanetMeaning(planet);
        });
        meaningEl.innerHTML = html;

        const allPlanetCards = planets.flatMap(p => this.tarot.getCardsForPlanet(p));
        if (allPlanetCards.length > 0) {
          this._insertTarotAndInit(meaningEl, allPlanetCards, planets.length > 1 ? 'Tarot Correspondences' : 'Tarot Correspondence');
        }
      }
    }

    // Element
    if (results.zodiac?.element) {
      const headerEl  = document.getElementById('element-meaning-header');
      const meaningEl = document.getElementById('element-meaning');
      if (headerEl)  headerEl.textContent = `The meaning of ${results.zodiac.element}`;
      if (meaningEl) {
        meaningEl.innerHTML = DataMeanings.getElementMeaning(results.zodiac.element);
        this._insertTarotAndInit(meaningEl, this.tarot.getCardsForElement(results.zodiac.element), 'Tarot Suit Correspondence');
      }
    }

    // Sefira
    if (results.sefira) {
      const headerEl  = document.getElementById('sefira-meaning-header');
      const meaningEl = document.getElementById('sefira-meaning');
      if (headerEl)  headerEl.textContent = `The meaning of ${results.sefira}`;
      if (meaningEl) {
        meaningEl.innerHTML = DataMeanings.getSefiraMeaning(results.sefira);
        const sefiraName = String(results.sefira).split('(')[0].trim();
        this._insertTarotAndInit(meaningEl, this.tarot.getCardsForSefira(sefiraName, null), 'Tarot Correspondences');
      }
    }

    this.initializeTarotClickHandlers();
  }

  generateNumerologyCards(results) {
    const container = document.getElementById('numerology-cards-container');
    if (!container) return;

    const cardConfigs = Object.freeze([
      { key: 'firstName',     title: 'Life Lessons (First Name)',               explanation: 'Life Lessons are derived from the consonants in your full birth name. They represent the recurring challenges and opportunities for growth that your soul specifically chose for this lifetime.' },
      { key: 'lastName',      title: 'Spiritual Support (Last Name)',            explanation: 'Derived from the vowels in your full name, Spiritual Support reflects the inner guidance, resources, and strengths your soul possesses.' },
      { key: 'lifePath',      title: 'Life Path (Date of Birth)',                explanation: 'The Life Path Number, derived from your birth date, is considered the most fundamental number in the chart. It outlines your primary purpose, life direction, and key lessons.' },
      { key: 'expression',    title: 'Destiny (Full Name)',                      explanation: 'The Expression or Destiny Number is calculated from the full name and reveals your core abilities, talents, and life mission.' },
      { key: 'soulsDirection',title: "Soul's Direction (Full Name + Date of Birth)", explanation: "Soul's Direction highlights the ultimate trajectory of your soul. It represents the integration of lessons learned, natural talents, and spiritual inclinations." },
      { key: 'personality',   title: 'Personality (Outer)',                     explanation: 'Derived from the consonants in your name, the Personality Number reveals how others perceive you and the traits you project.' },
      { key: 'soulUrge',      title: "Soul's Urge (Desire)",                    explanation: "Calculated from the vowels in your name, the Soul's Urge reflects your inner motivations, drives, and what truly fulfills you." },
      { key: 'maturity',      title: 'Maturity Number',                         explanation: 'The Maturity Number represents the full potential of your life journey. It indicates the qualities, talents, and wisdom you are likely to fully develop later in life.' },
      { key: 'balance',       title: 'Balance Number',                          explanation: 'Derived from the initials of your full name, the Balance Number provides insight into how you respond to stress, challenges, or uncertainty.' },
      { key: 'birthday',      title: 'Birthday',                                explanation: 'The Birthday Number comes from the day of the month you were born and represents a specific talent, skill, or attribute you bring to life.' }
    ]);

    container.innerHTML = cardConfigs.map(config => {
      const data = results[config.key];
      if (!data) return '';
      const tarotCards = this.tarot.getCardsForNumber(data.value);
      const tarotHTML  = tarotCards.length > 0 ? this._renderTarotSection(tarotCards, 'Tarot Correspondences') : '';

      return `<section class="expandable-card numerology-card" data-section="${config.key}">
        <div class="expandable-header" tabindex="0" role="button" aria-expanded="false">
          <span class="chevron" aria-hidden="true">\u203A</span><span>${esc(config.title)}</span>
        </div>
        <div class="expandable-content">
          <div class="calculation-trace">${esc(data.trace || '\u2014')}</div>
          <div class="sum-line">Sum total of numbers = ${esc(String(data.raw))} / Reduced = ${esc(String(data.value))}</div>
          <div class="final-number">FINAL NUMBER = ${esc(String(data.value))}</div>
          <hr>
          <div class="explanation-heading">Explanation for ${esc(config.title)}:</div>
          <div class="explanation-text">${esc(config.explanation)}</div>
          <div class="explanation-heading">Meaning of the number ${esc(String(data.value))}:</div>
          <div class="explanation-text">${esc(DataMeanings.getNumberMeaning(data.value))}</div>
          ${tarotHTML}
        </div>
      </section>`;
    }).join('');

    // Init image loading for newly inserted tarot cards
    TarotEngine.initImageLoading(container);

    this.addSpecialNumerologyCards(container, results);
    this.initializeExpandableCards();
    this.initializeTarotClickHandlers();
  }

  addSpecialNumerologyCards(container, results) {
    const karmicTrace   = results.karmicDebt?.length
      ? results.karmicDebt.map(k => `${esc(k.place)}=${esc(String(k.raw))}`).join(' ; ')
      : 'None';
    const karmicMeaning = results.karmicDebt?.length
      ? 'Karmic Debt Numbers indicate unresolved lessons or challenges carried from past lifetimes.'
      : 'No karmic debt numbers detected.';

    container.innerHTML += `<section class="expandable-card numerology-card" data-section="karmic">
      <div class="expandable-header" tabindex="0" role="button" aria-expanded="false">
        <span class="chevron" aria-hidden="true">\u203A</span><span>Karmic Debt</span>
      </div>
      <div class="expandable-content">
        <div class="calculation-trace">${karmicTrace}</div>
        <div class="sum-line">Karmic Numbers: ${karmicTrace}</div>
        <div class="final-number">KARMIC ANALYSIS = ${results.karmicDebt?.length || 0} numbers found</div>
        <hr>
        <div class="explanation-heading">Explanation for Karmic Debt:</div>
        <div class="explanation-text">${karmicMeaning}</div>
      </div>
    </section>`;

    if (results.pinnacles) {
      const p = results.pinnacles;
      const pinnacleTrace = `P1=${p.p1.value}(${p.p1.raw}), P2=${p.p2.value}(${p.p2.raw}), P3=${p.p3.value}(${p.p3.raw}), P4=${p.p4.value}(${p.p4.raw})`;

      let pinnaclesTarot = '';
      [p.p1.value, p.p2.value, p.p3.value, p.p4.value].forEach((val, idx) => {
        const cards = this.tarot.getCardsForNumber(val);
        if (cards.length > 0) {
          pinnaclesTarot += `<div class="tarot-card-spacing"><strong class="tarot-subsection-title">Pinnacle ${idx + 1} (${esc(String(val))}) Tarot:</strong></div>`;
          pinnaclesTarot += this.tarot.renderCards(cards);
        }
      });

      container.innerHTML += `<section class="expandable-card numerology-card" data-section="pinnacles">
        <div class="expandable-header" tabindex="0" role="button" aria-expanded="false">
          <span class="chevron" aria-hidden="true">\u203A</span><span>4 Cycles of Pinnacles</span>
        </div>
        <div class="expandable-content">
          <div class="calculation-trace">${esc(pinnacleTrace)}</div>
          <div class="sum-line">Four Major Life Phases</div>
          <div class="final-number">PINNACLES = ${esc(String(p.p1.value))}, ${esc(String(p.p2.value))}, ${esc(String(p.p3.value))}, ${esc(String(p.p4.value))}</div>
          <hr>
          <div class="explanation-heading">Explanation for 4 Pinnacle Cycles:</div>
          <div class="explanation-text">The Pinnacle Cycles are four major phases in life, derived from the birth date, that outline opportunities, challenges, and growth patterns in each stage.</div>
          ${pinnaclesTarot}
        </div>
      </section>`;
    }

    if (results.challenges) {
      const c = results.challenges;
      const challengeTrace = `C1=${c.ch1.value}(${c.ch1.raw}), C2=${c.ch2.value}(${c.ch2.raw}), C3=${c.ch3.value}(${c.ch3.raw}), C4=${c.ch4.value}(${c.ch4.raw})`;

      let challengesTarot = '';
      [c.ch1.value, c.ch2.value, c.ch3.value, c.ch4.value].forEach((val, idx) => {
        const cards = this.tarot.getCardsForNumber(val);
        if (cards.length > 0) {
          challengesTarot += `<div class="tarot-card-spacing"><strong class="tarot-subsection-title">Challenge ${idx + 1} (${esc(String(val))}) Tarot:</strong></div>`;
          challengesTarot += this.tarot.renderCards(cards);
        }
      });

      container.innerHTML += `<section class="expandable-card numerology-card" data-section="challenges">
        <div class="expandable-header" tabindex="0" role="button" aria-expanded="false">
          <span class="chevron" aria-hidden="true">\u203A</span><span>Challenge Numbers</span>
        </div>
        <div class="expandable-content">
          <div class="calculation-trace">${esc(challengeTrace)}</div>
          <div class="sum-line">Four Life Challenge Areas</div>
          <div class="final-number">CHALLENGES = ${esc(String(c.ch1.value))}, ${esc(String(c.ch2.value))}, ${esc(String(c.ch3.value))}, ${esc(String(c.ch4.value))}</div>
          <hr>
          <div class="explanation-heading">Explanation for Challenge Numbers:</div>
          <div class="explanation-text">Challenge Numbers indicate obstacles, recurring difficulties, or tests of character that require conscious effort and resilience.</div>
          ${challengesTarot}
        </div>
      </section>`;
    }

    TarotEngine.initImageLoading(container);
  }

  initializeTarotClickHandlers() {
    setTimeout(() => {
      document.querySelectorAll('.tarot-card').forEach(card => {
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);

        newCard.addEventListener('click', () => {
          this.showTarotModal(
            newCard.getAttribute('data-card-type'),
            newCard.getAttribute('data-card-suit'),
            newCard.getAttribute('data-card-number')
          );
        });
        newCard.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.showTarotModal(
              newCard.getAttribute('data-card-type'),
              newCard.getAttribute('data-card-suit'),
              newCard.getAttribute('data-card-number')
            );
          }
        });
      });

      // Re-init image loading after clone
      TarotEngine.initImageLoading(document);
    }, 100);
  }

  showTarotModal(cardType, cardSuit, cardNumber) {
    let meaning  = '';
    let cardName = '';

    if (cardType === 'major') {
      meaning  = DataMeanings.getTarotMeaning('major', Number(cardNumber));
      cardName = this.tarot.getMajorArcanaName(Number(cardNumber));
    } else {
      meaning = DataMeanings.getTarotMeaning(cardSuit, Number(cardNumber));
      if (cardType === 'court') {
        const courtNames = Object.freeze({ 11:'Page', 12:'Knight', 13:'Queen', 14:'King' });
        cardName = `${courtNames[cardNumber] || ''} of ${String(cardSuit).charAt(0).toUpperCase() + cardSuit.slice(1)}`;
      } else {
        cardName = `${cardNumber} of ${String(cardSuit).charAt(0).toUpperCase() + cardSuit.slice(1)}`;
      }
    }

    let modal = document.getElementById('tarot-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'tarot-modal';
      modal.className = 'tarot-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'tarot-modal-title');

      const content = document.createElement('div');
      content.className = 'tarot-modal-content';

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'tarot-modal-close';
      closeBtn.setAttribute('aria-label', 'Close tarot card detail');
      closeBtn.textContent = '\u00D7';
      closeBtn.addEventListener('click', () => modal.classList.remove('show'));

      const titleEl = document.createElement('h3');
      titleEl.className = 'tarot-modal-title';
      titleEl.id = 'tarot-modal-title';

      const bodyEl = document.createElement('div');
      bodyEl.className = 'tarot-modal-body';

      content.append(closeBtn, titleEl, bodyEl);
      modal.appendChild(content);
      document.body.appendChild(modal);

      modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
    }

    // Use textContent — meaning text comes from frozen DataMeanings, still safe
    modal.querySelector('.tarot-modal-title').textContent = cardName;
    modal.querySelector('.tarot-modal-body').textContent  = meaning;
    modal.classList.add('show');
  }

  clearResults() {
    ['summary-numerology-content','summary-astrology-content','summary-tree-content'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.add('placeholder-text'); el.textContent = 'Run analysis to see your summary.'; }
    });

    const narrativeContent = document.getElementById('personal-narrative-content');
    if (narrativeContent) { narrativeContent.classList.add('placeholder-text'); narrativeContent.textContent = 'Run analysis to see your personalized narrative.'; }

    const deepElements = {
      'deep-zodiac':  'Run analysis to see your Zodiac Sign',
      'deep-planet':  'Run analysis to see your Ruling Planet',
      'deep-element': 'Run analysis to see your Alchemical Element',
      'deep-sefira':  'Run analysis to see your Prominent Sefira'
    };
    Object.entries(deepElements).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = text; el.classList.add('placeholder-text'); }
    });

    ['zodiac','planet','element','sefira'].forEach(type => {
      const headerEl  = document.getElementById(`${type}-meaning-header`);
      const meaningEl = document.getElementById(`${type}-meaning`);
      if (headerEl)  headerEl.textContent = '';
      if (meaningEl) meaningEl.innerHTML  = '';
    });

    const container = document.getElementById('numerology-cards-container');
    if (container) { container.classList.add('placeholder-text'); container.innerHTML = 'Run analysis to see your complete Numerology report.'; }

    const natalOutput = document.getElementById('natal-chart-output');
    if (natalOutput) { natalOutput.classList.add('placeholder-text'); natalOutput.textContent = 'Enter time of birth and location of birth to generate your complete natal chart.'; }

    ['zodiac-sign','ruling-planet','alchemical-element','natal-chart'].forEach(section => {
      const card = document.querySelector(`.expandable-card[data-section="${section}"]`);
      if (card) { card.classList.add('hidden'); card.style.display = 'none'; }
    });

    const treePlaceholder = document.getElementById('tree-content-placeholder');
    const treeData        = document.getElementById('tree-content-data');
    if (treePlaceholder) { treePlaceholder.classList.remove('hidden'); treePlaceholder.style.display = 'block'; }
    if (treeData)        { treeData.classList.add('hidden');           treeData.style.display = 'none'; }

    const astroPlaceholder = document.getElementById('astrology-content-placeholder');
    if (astroPlaceholder) astroPlaceholder.style.display = 'block';

    this.enablePdf(false);
  }
}

export { UIManager };
