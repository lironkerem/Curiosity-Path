/*  /Mini-Apps/SelfAnalysisPro/js/app.js  – Big-App Integration Ready  */

import Utils from './utils.js';
import { UIManager } from './ui.js';
import { AstrologyEngine } from './astrology.js';
import NumerologyEngine from './numerology.js';
import { buildNarrative, getNumerologySummary, getAstrologySummary, getTreeSummary } from './narrativeEngine.js';
import { renderNatalChartBlock } from './ui.natal.js';

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

// Lazy loaders
const loadPDFAssembler = () => import('./PDFAssembler.js').then(m => m.default);
const loadTarotEngine  = () => import('./TarotEngine.js').then(m => m.default);

// Input length caps
const MAX_NAME     = 40;
const MAX_NAME_MID = 120;
const MAX_LOCATION = 200;

class SelfAnalysisApp {
  constructor() {
    this.appState         = { formData: {}, analysis: {} };
    this.astrologyEngine  = new AstrologyEngine();
    this.numerologyEngine = new NumerologyEngine();
    this.tarotEngine      = null;
    this.ui               = new UIManager();
    this.initialized      = false;
  }

  async init() {
    if (this.initialized) {
      this.ui.validateAll();
      return;
    }

    this.ui.init();
    this.ui.onAnalyze = (formData) => this.handleAnalyze(formData);
    this.ui.onClear   = ()         => this.clearAll();
    this.ui.onPdf     = ()         => this.downloadPDF();

    this.loadSavedProgress();
    this.initialized = true;

    // bfcache: persist progress on page hide
    window.addEventListener('pagehide', () => this.saveProgress());
  }

  /* ----------  Form Data  ---------- */
  collectFormData() {
    const form = document.getElementById('analysis-form');
    if (!form) return null;

    const loc = document.getElementById('location-birth');
    const locationLat = loc?.dataset?.lat || '';
    const locationLon = loc?.dataset?.lon || '';

    return {
      firstName:       Utils.sanitizeInput((form.firstName?.value  || '').slice(0, MAX_NAME)),
      middleName:      Utils.sanitizeInput((form.middleName?.value  || '').slice(0, MAX_NAME_MID)),
      lastName:        Utils.sanitizeInput((form.lastName?.value   || '').slice(0, MAX_NAME)),
      dateOfBirth:     form.dateOfBirth?.value  || '',
      timeOfBirth:     form.timeOfBirth?.value  || '',
      locationOfBirth: Utils.sanitizeInput((loc?.value || '').slice(0, MAX_LOCATION)),
      locationLat:     locationLat,
      locationLon:     locationLon,
      includeY:        form.includeY?.checked   || false
    };
  }

  saveProgress() {
    const data = this.collectFormData();
    if (!data) return;
    ls.set('selfAnalysisProgress', JSON.stringify({ ...data, timestamp: Date.now() }));
  }

  loadSavedProgress() {
    try {
      const raw = ls.get('selfAnalysisProgress');
      if (!raw) return;

      const data = JSON.parse(raw);
      const ageMinutes = (Date.now() - data.timestamp) / 1000 / 60;

      if (ageMinutes > 60) {
        ls.remove('selfAnalysisProgress');
        return;
      }

      const form = document.getElementById('analysis-form');
      if (!form) return;

      form.firstName.value  = (data.firstName  || '').slice(0, MAX_NAME);
      form.middleName.value = (data.middleName  || '').slice(0, MAX_NAME_MID);
      form.lastName.value   = (data.lastName   || '').slice(0, MAX_NAME);
      form.dateOfBirth.value = data.dateOfBirth || '';
      form.timeOfBirth.value = data.timeOfBirth || '';
      form.includeY.checked  = data.includeY    || false;

      const loc = document.getElementById('location-birth');
      if (loc && data.locationOfBirth) {
        loc.value = (data.locationOfBirth || '').slice(0, MAX_LOCATION);
        if (data.locationLat) loc.dataset.lat = data.locationLat;
        if (data.locationLon) loc.dataset.lon = data.locationLon;
      }
    } catch (e) {
      console.warn('Failed to load progress:', e);
    }
  }

  /* ----------  Main Analysis Flow  ---------- */
  async handleAnalyze(formData) {
    try {
      this.appState.formData = formData;

      if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
        throw new Error('Required fields missing');
      }

      this.ui.showProgress(10, 'Starting analysis...');

      // 1. Numerology
      this.ui.showProgress(30, 'Calculating numerology...');
      const numerology = this.numerologyEngine.analyze(formData);

      // 2. Timezone
      let tzone = null;
      if (formData.locationLat && formData.locationLon && formData.dateOfBirth) {
        this.ui.showProgress(40, 'Fetching timezone...');
        tzone = await this.fetchTimezone(formData.locationLat, formData.locationLon, formData.dateOfBirth);
      }
      formData.tzone = tzone;

      // 3. Astrology
      this.ui.showProgress(50, 'Reading stars...');
      let astrology = null;
      try {
        astrology = await this.astrologyEngine.analyze(formData);
      } catch (err) {
        console.warn('Astrology limited mode:', err.message);
        const [y, m, d] = formData.dateOfBirth.split('-').map(Number);
        const zodiac = this.astrologyEngine.getZodiacSign(m, d);
        astrology = { zodiac, sefira: null, planets: null, houses: null };
      }

      // 4. Tarot (lazy load)
      this.ui.showProgress(70, 'Loading tarot engine...');
      if (!this.tarotEngine) {
        const TarotEngine = await loadTarotEngine();
        this.tarotEngine = new TarotEngine();
      }

      this.ui.showProgress(75, 'Generating tarot...');
      const tarot = {
        lifePath:   numerology.lifePath   ? this.tarotEngine.getCardsForNumber(numerology.lifePath.value)   : [],
        expression: numerology.expression ? this.tarotEngine.getCardsForNumber(numerology.expression.value) : [],
        soulUrge:   numerology.soulUrge   ? this.tarotEngine.getCardsForNumber(numerology.soulUrge.value)   : []
      };

      // 5. Narrative
      this.ui.showProgress(85, 'Writing story...');
      const user = {
        firstName: formData.firstName,
        numerology: {
          lifePath:  numerology.lifePath?.value,
          destiny:   numerology.expression?.value,
          soulUrge:  numerology.soulUrge?.value
        },
        astrology: { sun: astrology?.zodiac?.name?.toLowerCase() },
        tree: astrology?.sefira?.toLowerCase()?.split('(')[0]?.trim()
      };
      const narrative = buildNarrative(user);

      // 6. Store results
      this.appState.analysis = { numerology, astrology, tarot, narrative };

      // 7. Display
      this.ui.showProgress(95, 'Displaying results...');
      this.renderResults();

      this.ui.showProgress(100, 'Complete!');
      this.ui.enablePdf(true);

      ls.remove('selfAnalysisProgress');

    } catch (err) {
      console.error('Analysis failed:', err);
      this.ui.showToast(err.message || 'Analysis failed', 'error');
      this.ui.showProgress(0, '');
    }
  }

  async fetchTimezone(lat, lon, dateStr) {
    try {
      const res = await fetch('/api/astro-proxy', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ endpoint: 'timezone', params: { lat, lon, dateOfBirth: dateStr } }),
        signal:  AbortSignal.timeout(8000)
      });
      if (!res.ok) throw new Error('Timezone fetch failed');
      const data = await res.json();
      return data.tzone || 0;
    } catch (e) {
      console.warn('Timezone failed, using UTC:', e);
      return 0;
    }
  }

  renderResults() {
    const { numerology, astrology, narrative } = this.appState.analysis;

    const numSum   = getNumerologySummary({
      lifePath:  numerology.lifePath?.value,
      destiny:   numerology.expression?.value,
      soulUrge:  numerology.soulUrge?.value
    });
    const astroSum = getAstrologySummary({ sun: astrology?.zodiac?.name?.toLowerCase() });
    const treeSum  = getTreeSummary(astrology?.sefira?.toLowerCase()?.split('(')[0]?.trim());

    // Helper: set innerHTML only for trusted static content from narrativeEngine/summaries
    const fill = (id, html) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('placeholder-text');
        el.innerHTML = html;
      }
    };

    fill('summary-numerology-content', numSum.join('<br><br>'));

    // Astrology summary — escape dynamic zodiac values
    const zodiacHtml = astrology?.zodiac
      ? `<strong>Zodiac:</strong> ${esc(astrology.zodiac.name)}<br>` +
        `<strong>Planet:</strong> ${esc(astrology.zodiac.planet)}<br>` +
        `<strong>Element:</strong> ${esc(astrology.zodiac.element)}<br><br>`
      : '';
    fill('summary-astrology-content', zodiacHtml + astroSum.join('<br><br>'));

    const sefiraHtml = astrology?.sefira
      ? `<strong>Sefira:</strong> ${esc(astrology.sefira)}<br><br>`
      : '';
    fill('summary-tree-content', sefiraHtml + treeSum);

    // Narrative — set via textContent to avoid XSS
    const narrativeEl = document.getElementById('personal-narrative-content');
    if (narrativeEl) {
      narrativeEl.classList.remove('placeholder-text');
      narrativeEl.textContent = narrative;
    }

    // Populate deep cards
    this.ui.populateResults(
      { ...numerology, zodiac: astrology?.zodiac, sefira: astrology?.sefira },
      null
    );

    // Natal chart
    if (astrology && (astrology.planets || astrology.houses || astrology.natalChart)) {
      renderNatalChartBlock(astrology);
    }
  }

  clearAll() {
    const form = document.getElementById('analysis-form');
    if (form) form.reset();

    const loc = document.getElementById('location-birth');
    if (loc) {
      loc.value = '';
      delete loc.dataset.lat;
      delete loc.dataset.lon;
    }

    this.appState = { formData: {}, analysis: {} };
    ls.remove('selfAnalysisProgress');

    this.ui.clearResults();
    this.ui.enablePdf(false);
    this.ui.validateAll();

    if (typeof window.resetStepIndicator === 'function') {
      window.resetStepIndicator();
    }
  }

  async downloadPDF() {
    const { formData, analysis } = this.appState;
    if (!analysis.numerology) return;

    try {
      const PDFAssembler = await loadPDFAssembler();
      const pdf = new PDFAssembler({
        sourcePdfUrl: '/public/Source_PDF/Self%20Analysis%20Pro%20Guidebook.pdf',
        options: {
          autoDownload:     true,
          downloadFilename: `${esc(formData.firstName)}_Self-Analysis.pdf`
        }
      });
      await pdf.assemble(this.appState);
      this.ui.showToast('PDF downloaded!', 'success');
    } catch (e) {
      console.error('PDF failed:', e);
      this.ui.showToast('PDF generation failed', 'error');
    }
  }
}

/* ----------  Big-App Boot Hook  ---------- */
export function bootSelfAnalysis(hostElement) {
  window.selfAnalysisHost = hostElement;

  if (!window.selfAnalysisApp) {
    window.selfAnalysisApp = new SelfAnalysisApp();
  }

  window.selfAnalysisApp.init();

  window.revalidateForm = () => {
    if (window.selfAnalysisApp?.ui) {
      window.selfAnalysisApp.ui.validateAll();
    }
  };

  return window.selfAnalysisApp;
}

/* ----------  Standalone Safety  ---------- */
if (window.location.pathname.includes('selfanalysis')) {
  window.addEventListener('DOMContentLoaded', () => {
    const app = new SelfAnalysisApp();
    app.init();
    window.selfAnalysisApp = app;
  });
}
