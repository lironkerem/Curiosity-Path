/*  /js/apps/selfanalysis/loader.js  — Clean Big-App Integration  */

export default class SelfAnalysisLauncher {
  constructor(bigApp) {
    this.bigApp = bigApp;
    this.instance = null;
    this.isInitialized = false;
  }

  /* ---- Big-App calls this when calculator-tab is shown ---- */
  render() {
    const host = document.getElementById('calculator-tab');
    if (!host) {
      console.error('❌ Calculator tab not found');
      return;
    }

    // ── Premium lock check ──
    const isPrivileged = this.bigApp.state?.currentUser?.isAdmin || this.bigApp.state?.currentUser?.isVip;
    const isLocked = !isPrivileged && !this.bigApp.gamification?.state?.unlockedFeatures?.includes('self_analysis_pro');

    if (isLocked) {
      host.innerHTML = `
        <div style="padding:1.5rem;min-height:100vh;">
          <div class="universal-content">
            <header class="main-header project-curiosity"
                    style="--header-img:url('/Tabs/NavAnalysis.webp');
                           --header-title:'';
                           --header-tag:'Analyse your \\'Self\\', using Numerology, Astrology, Tree of Life and Tarot'">
              <h1>Self-Analysis Pro</h1>
              <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
              <span class="header-sub"></span>
            </header>
            <div class="card relative" style="padding:3rem;text-align:center;opacity:0.75;">
              <div style="margin-bottom:1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:5rem;height:5rem;opacity:0.3;">
                  <rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2 style="color:var(--neuro-text);font-size:2rem;margin-bottom:1rem;">Premium Feature Locked</h2>
              <p style="color:var(--neuro-text-light);font-size:1.2rem;margin-bottom:2rem;">
                Unlock Self-Analysis Pro in the Karma Shop to access your full Numerology, Astrology &amp; Tree of Life analysis.
              </p>
              <button onclick="window.app.nav.switchTab('karma-shop')" class="btn btn-primary" style="padding:1rem 2rem;font-size:1.1rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                Visit Karma Shop
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Only render once
    if (this.isInitialized) {
      this.revalidate();
      return;
    }

    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    // Fetch HTML content
    fetch('/src/Mini-Apps/SelfAnalysisPro/index.html')
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const appPage = doc.getElementById('app-page');
        
        if (!appPage) {
          throw new Error('app-page element not found in HTML');
        }

        host.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavAnalysis.webp');
                     --header-title:'';
                     --header-tag:'Analyse your \\'Self\\', using Numerology, Astrology, Tree of Life and Tarot'">
        <h1>Self-Analysis Pro</h1>
        <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
        <span class="header-sub"></span>
      </header>
      <div class="selfanalysis-scope">
        ${appPage.innerHTML}
      </div>
    </div>
  </div>
`;
        
        return this.initializeComponents().then(() => {
          return import(/* @vite-ignore */ '/src/Mini-Apps/SelfAnalysisPro/js/app.js');
        });
      })
      .then(module => {
        if (typeof module.bootSelfAnalysis === 'function') {
          this.instance = module.bootSelfAnalysis(host);
          this.isInitialized = true;
        } else {
          throw new Error('bootSelfAnalysis function not found');
        }
      })
      .catch(err => {
        console.error('❌ Self-Analysis loader failed:', err);
        host.innerHTML = `
          <div class="card" style="padding:2rem;text-align:center;color:var(--neuro-error);">
            <h2>Failed to Load Self-Analysis Pro</h2>
            <p>${err.message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
          </div>
        `;
      });
  }

  /* ---- Initialize ALL Components (Pickers + Location Autocomplete) ---- */
  async initializeComponents() {
    try {
      const [
        { CustomDatePicker },
        { CustomTimePicker },
        { StepIndicator }
      ] = await Promise.all([
        import(/* @vite-ignore */ '/src/Mini-Apps/SelfAnalysisPro/js/customDatePicker.js'),
        import(/* @vite-ignore */ '/src/Mini-Apps/SelfAnalysisPro/js/customTimePicker.js'),
        import(/* @vite-ignore */ '/src/Mini-Apps/SelfAnalysisPro/js/stepindicator.js')
      ]);
      
      if (document.getElementById('date-of-birth')) {
        window.customDatePicker = new CustomDatePicker('date-of-birth');
      }
      if (document.getElementById('time-of-birth')) {
        window.customTimePicker = new CustomTimePicker('time-of-birth');
      }
      if (document.getElementById('step-indicator')) {
        window.stepIndicator = new StepIndicator();
        window.resetStepIndicator = () => { if (window.stepIndicator) window.stepIndicator.reset(); };
      }
      
      this.initializeLocationAutocomplete();
    } catch (err) {
      console.error('❌ Failed to initialize components:', err);
      throw err;
    }
  }

  /* ---- Location Autocomplete ---- */
  initializeLocationAutocomplete() {
    const locationInput = document.getElementById('location-birth');
    const dropdown = document.getElementById('location-dropdown');
    
    if (!locationInput || !dropdown) {
      console.warn('⚠️ Location elements not found');
      return;
    }
    
    const GEOCODE_API = '/api/geocode';
    let debounceTimer;
    const cache = new Map();
    
    const displayResults = (list) => {
      if (!list || !list.length) {
        dropdown.innerHTML = '<div style="padding:10px;color:#888;">No locations found</div>';
        dropdown.classList.add('active');
        setTimeout(() => dropdown.classList.remove('active'), 2000);
        return;
      }
      
      dropdown.innerHTML = list.map(it => `
        <div class="location-option" data-lat="${it.lat}" data-lon="${it.lon}" data-name="${it.display_name}">
          ${it.display_name}
        </div>`).join('');
      
      dropdown.classList.add('active');
      
      dropdown.querySelectorAll('.location-option').forEach(opt => {
        opt.addEventListener('click', () => {
          locationInput.value = opt.dataset.name;
          locationInput.dataset.lat = opt.dataset.lat;
          locationInput.dataset.lon = opt.dataset.lon;
          dropdown.classList.remove('active');
          dropdown.innerHTML = '';
          locationInput.style.borderColor = '#4caf50';
          setTimeout(() => locationInput.style.borderColor = '', 1000);
        });
      });
    };
    
    const fetchLocations = async (q) => {
      try {
        const res = await fetch(`${GEOCODE_API}?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('geo err');
        const data = await res.json();
        cache.set(q.toLowerCase(), data);
        if (cache.size > 50) cache.delete(cache.keys().next().value);
        displayResults(data);
      } catch (e) {
        console.warn('❌ Location fetch error:', e.message);
        dropdown.innerHTML = '<div style="padding:10px;color:#d32f2f;background:#ffebee;">Unable to load suggestions. Try typing your city name.</div>';
        dropdown.classList.add('active');
        setTimeout(() => dropdown.classList.remove('active'), 3000);
      }
    };
    
    locationInput.addEventListener('input', () => {
      const q = locationInput.value.trim();
      clearTimeout(debounceTimer);
      if (q.length < 3) { dropdown.classList.remove('active'); dropdown.innerHTML = ''; return; }
      const key = q.toLowerCase();
      if (cache.has(key)) { displayResults(cache.get(key)); return; }
      debounceTimer = setTimeout(() => fetchLocations(q), 400);
    });

    this._outsideClickHandler = (e) => {
      if (e.target !== locationInput && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    };
    document.addEventListener('click', this._outsideClickHandler);
  }

  /* ---- Re-validate form when tab is re-entered ---- */
  revalidate() {
    if (typeof window.revalidateForm === 'function') window.revalidateForm();
  }

  /* ---- Cleanup ---- */
  destroy() {
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
    this.instance = null;
    this.isInitialized = false;
  }
}