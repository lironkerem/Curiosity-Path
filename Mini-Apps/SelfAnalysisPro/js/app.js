/*  /js/apps/selfanalysis/js/app.js  – Big-App Integration Ready  */

import Utils from './utils.js';
import { UIManager } from './ui.js';
import { AstrologyEngine } from './astrology.js';
import NumerologyEngine from './numerology.js';
import { buildNarrative, getNumerologySummary, getAstrologySummary, getTreeSummary } from './narrativeEngine.js';
import { renderNatalChartBlock } from './ui.natal.js';

// Lazy loaders
const loadPDFAssembler = () => import('./PDFAssembler.js').then(m => m.default);
const loadTarotEngine = () => import('./TarotEngine.js').then(m => m.default);

class SelfAnalysisApp {
  constructor() {
    this.appState = { formData: {}, analysis: {} };
    this.astrologyEngine = new AstrologyEngine();
    this.numerologyEngine = new NumerologyEngine();
    this.tarotEngine = null;
    this.ui = new UIManager();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      console.log('⚠️ App already initialized, skipping');
      this.ui.validateAll(); // Re-validate on tab switch
      return;
    }

    console.log('🚀 Initializing Self-Analysis Pro...');
    
    this.ui.init();
    this.ui.onAnalyze = (formData) => this.handleAnalyze(formData);
    this.ui.onClear = () => this.clearAll();
    this.ui.onPdf = () => this.downloadPDF();
    
    this.loadSavedProgress();
    this.initialized = true;
    console.log('✅ Self-Analysis Pro ready');
  }

  /* ----------  Form Data  ---------- */
collectFormData() {
  const form = document.getElementById('analysis-form');
  if (!form) return;
  
  const loc = document.getElementById('location-birth');
  
  // FIX: Properly extract lat/lon from dataset
  const locationLat = loc?.dataset?.lat || '';
  const locationLon = loc?.dataset?.lon || '';
  
  console.log('📍 Collecting location data:', {
    value: loc?.value,
    lat: locationLat,
    lon: locationLon
  });
  
  return {
    firstName: Utils.sanitizeInput(form.firstName?.value || ''),
    middleName: Utils.sanitizeInput(form.middleName?.value || ''),
    lastName: Utils.sanitizeInput(form.lastName?.value || ''),
    dateOfBirth: form.dateOfBirth?.value || '',
    timeOfBirth: form.timeOfBirth?.value || '',
    locationOfBirth: Utils.sanitizeInput(loc?.value || ''),
    locationLat: locationLat,  // FIX: These were previously empty
    locationLon: locationLon,  // FIX: These were previously empty
    includeY: form.includeY?.checked || false
  };
}

  saveProgress() {
    try {
      const data = this.collectFormData();
      localStorage.setItem('selfAnalysisProgress', JSON.stringify({
        ...data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }

  loadSavedProgress() {
    try {
      const raw = localStorage.getItem('selfAnalysisProgress');
      if (!raw) return;
      
      const data = JSON.parse(raw);
      const ageMinutes = (Date.now() - data.timestamp) / 1000 / 60;
      
      if (ageMinutes > 60) {
        localStorage.removeItem('selfAnalysisProgress');
        return;
      }
      
      const form = document.getElementById('analysis-form');
      if (!form) return;
      
      form.firstName.value = data.firstName || '';
      form.middleName.value = data.middleName || '';
      form.lastName.value = data.lastName || '';
      form.dateOfBirth.value = data.dateOfBirth || '';
      form.timeOfBirth.value = data.timeOfBirth || '';
      form.includeY.checked = data.includeY || false;
      
      const loc = document.getElementById('location-birth');
      if (loc && data.locationOfBirth) {
        loc.value = data.locationOfBirth;
        if (data.locationLat) loc.dataset.lat = data.locationLat;
        if (data.locationLon) loc.dataset.lon = data.locationLon;
      }
      
      console.log('✅ Restored saved progress');
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
      console.log('📊 Running analysis...');

      // 1. Numerology (always local)
      this.ui.showProgress(30, 'Calculating numerology...');
      const numerology = this.numerologyEngine.analyze(formData);
      
      // 2. Timezone (if coordinates available)
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
        console.warn('⚠️ Astrology limited mode:', err.message);
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
        lifePath: numerology.lifePath ? this.tarotEngine.getCardsForNumber(numerology.lifePath.value) : [],
        expression: numerology.expression ? this.tarotEngine.getCardsForNumber(numerology.expression.value) : [],
        soulUrge: numerology.soulUrge ? this.tarotEngine.getCardsForNumber(numerology.soulUrge.value) : []
      };
      
      // 5. Build narrative
      this.ui.showProgress(85, 'Writing story...');
      const user = {
        firstName: formData.firstName,
        numerology: {
          lifePath: numerology.lifePath?.value,
          destiny: numerology.expression?.value,
          soulUrge: numerology.soulUrge?.value
        },
        astrology: {
          sun: astrology?.zodiac?.name?.toLowerCase()
        },
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
      
      localStorage.removeItem('selfAnalysisProgress');
      console.log('✅ Analysis complete');
      
    } catch (err) {
      console.error('❌ Analysis failed:', err);
      this.ui.showToast(err.message || 'Analysis failed', 'error');
      this.ui.showProgress(0, '');
    }
  }

  async fetchTimezone(lat, lon, dateStr) {
    try {
      const res = await fetch('/api/astro-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          endpoint: 'timezone', 
          params: { lat, lon, dateOfBirth: dateStr } 
        }),
        signal: AbortSignal.timeout(8000)
      });
      
      if (!res.ok) throw new Error('Timezone fetch failed');
      const data = await res.json();
      return data.tzone || 0;
    } catch (e) {
      console.warn('⚠️ Timezone failed, using UTC:', e);
      return 0;
    }
  }

renderResults() {
  const { numerology, astrology, narrative } = this.appState.analysis;
  
  // Build summaries
  const numSum = getNumerologySummary({
    lifePath: numerology.lifePath?.value,
    destiny: numerology.expression?.value,
    soulUrge: numerology.soulUrge?.value
  });
  
  const astroSum = getAstrologySummary({
    sun: astrology?.zodiac?.name?.toLowerCase()
  });
  
  const treeSum = getTreeSummary(astrology?.sefira?.toLowerCase()?.split('(')[0]?.trim());
  
  // Update UI
  const fill = (id, html) => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('placeholder-text');
      el.innerHTML = html;
    }
  };
  
  fill('summary-numerology-content', numSum.join('<br><br>'));
  fill('summary-astrology-content', 
  (astrology?.zodiac 
    ? `<strong>Zodiac:</strong> ${astrology.zodiac.name}<br>
<strong>Planet:</strong> ${astrology.zodiac.planet}<br>
<strong>Element:</strong> ${astrology.zodiac.element}<br><br>`
    : '') + astroSum.join('<br><br>')
);
  fill('summary-tree-content', 
    (astrology?.sefira ? `<strong>Sefira:</strong> ${astrology.sefira}<br><br>` : '') + treeSum
  );
  fill('personal-narrative-content', narrative.replace(/\n/g, '\n'));
  
  // Populate deep cards
  this.ui.populateResults(
    { ...numerology, zodiac: astrology?.zodiac, sefira: astrology?.sefira },
    null
  );
  
  // ✅ Render natal chart if available
  if (astrology && (astrology.planets || astrology.houses || astrology.natalChart)) {
    console.log('🎯 Rendering natal chart with data:', astrology);
    renderNatalChartBlock(astrology);
  } else {
    console.log('⚠️ No natal chart data available');
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
    localStorage.removeItem('selfAnalysisProgress');
    
    this.ui.clearResults();
    this.ui.enablePdf(false);
    this.ui.validateAll();
    
    // Reset step indicator
    if (window.resetStepIndicator) {
      window.resetStepIndicator();
    }
    
    console.log('🧹 Form cleared');
  }

  async downloadPDF() {
    const { formData, analysis } = this.appState;
    if (!analysis.numerology) return;
    
    try {
      const PDFAssembler = await loadPDFAssembler();
      const pdf = new PDFAssembler({
        sourcePdfUrl: '/Public/Source_PDF/Self%20Analysis%20Pro%20Guidebook.pdf',
        options: { 
          autoDownload: true, 
          downloadFilename: `${formData.firstName}_Self-Analysis.pdf` 
        }
      });
      
      await pdf.assemble(this.appState);
      this.ui.showToast('PDF downloaded!', 'success');
    } catch (e) {
      console.error('❌ PDF failed:', e);
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
  
  // Re-validation hook for tab switching
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