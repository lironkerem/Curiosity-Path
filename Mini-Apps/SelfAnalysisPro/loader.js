/*  /js/apps/selfanalysis/loader.js  — Clean Big-App Integration with Production-Grade Pickers  */

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

    // Only render once
    if (this.isInitialized) {
      this.revalidate();
      return;
    }

    console.log('🎯 Loading Self-Analysis Pro...');
    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    // Fetch HTML content
    fetch('/Mini-Apps/SelfAnalysisPro/index.html')
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const appPage = doc.getElementById('app-page');
        
        if (!appPage) {
          throw new Error('app-page element not found in HTML');
        }

        // Build layout with Big-App header
        host.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!-- Big-App Unified Header -->
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavAnalysis.png');
                     --header-title:'';
                     --header-tag:'Analyse your \'Self\', using Numerology, Astrology, Tree of Life and Tarot'">
        <h1>Self-Analysis Pro</h1>
        <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
        <span class="header-sub"></span>
      </header>

      <!-- Mini-App Content -->
      <div class="selfanalysis-scope">
        ${appPage.innerHTML}
      </div>

    </div>
  </div>
`;
        
        // Initialize ALL components BEFORE booting the app
        return this.initializeComponents().then(() => {
          // Boot the mini-app
          return import('/Mini-Apps/SelfAnalysisPro/js/app.js');
        });
      })
      .then(module => {
        if (typeof module.bootSelfAnalysis === 'function') {
          this.instance = module.bootSelfAnalysis(host);
          this.isInitialized = true;
          console.log('✅ Self-Analysis Pro loaded');
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

  /* ---- Initialize ALL Components (Production-Grade Pickers + Location Autocomplete) ---- */
  async initializeComponents() {
    try {
      console.log('🎯 Initializing components...');
      
      // Import picker classes
      const [
        { CustomDatePicker },
        { CustomTimePicker },
        { StepIndicator }
      ] = await Promise.all([
        import('/Mini-Apps/SelfAnalysisPro/js/customDatePicker.js'),
        import('/Mini-Apps/SelfAnalysisPro/js/customTimePicker.js'),
        import('/Mini-Apps/SelfAnalysisPro/js/stepindicator.js')
      ]);
      
      // ✅ PRODUCTION FIX: Initialize date picker with callback
      if (document.getElementById('date-of-birth')) {
        window.customDatePicker = new CustomDatePicker('date-of-birth', {
          onChange: (value, input) => {
            console.log('📅 Date changed:', value);
            // Trigger validation immediately
            if (window.selfAnalysisApp?.ui) {
              window.selfAnalysisApp.ui.validateAll();
            }
          }
        });
        console.log('✅ CustomDatePicker initialized');
      }
      
      // ✅ PRODUCTION FIX: Initialize time picker with callback
      if (document.getElementById('time-of-birth')) {
        window.customTimePicker = new CustomTimePicker('time-of-birth', {
          onChange: (value, input) => {
            console.log('⏰ Time changed:', value);
            // Trigger validation immediately
            if (window.selfAnalysisApp?.ui) {
              window.selfAnalysisApp.ui.validateAll();
            }
          }
        });
        console.log('✅ CustomTimePicker initialized');
      }
      
      // Initialize step indicator
      if (document.getElementById('step-indicator')) {
        window.stepIndicator = new StepIndicator();
        window.resetStepIndicator = () => {
          if (window.stepIndicator) {
            window.stepIndicator.reset();
          }
        };
        console.log('✅ StepIndicator initialized');
      }
      
      // Initialize location autocomplete
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
    
    // Define displayResults BEFORE fetchLocations so it's in scope
    const displayResults = (list) => {
      console.log('🎯 displayResults called with:', list);
      
      if (!list || !list.length) {
        dropdown.innerHTML = '<div style="padding:10px;color:#888;">No locations found</div>';
        dropdown.classList.add('active');
        console.log('✅ Added active class (no results)');
        setTimeout(() => dropdown.classList.remove('active'), 2000);
        return;
      }
      
      dropdown.innerHTML = list.map(it => `
        <div class="location-option" data-lat="${it.lat}" data-lon="${it.lon}" data-name="${it.display_name}">
          ${it.display_name}
        </div>`).join('');
      
      dropdown.classList.add('active');
      console.log('✅ Dropdown activated with', list.length, 'results');
      
      dropdown.querySelectorAll('.location-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const name = opt.dataset.name;
          const lat = opt.dataset.lat;
          const lon = opt.dataset.lon;
          
          locationInput.value = name;
          locationInput.dataset.lat = lat;
          locationInput.dataset.lon = lon;
          
          dropdown.classList.remove('active');
          dropdown.innerHTML = '';
          
          console.log('✅ Location selected:', { name, lat, lon });
          console.log('✅ Dataset:', locationInput.dataset);
          
          locationInput.style.borderColor = '#4caf50';
          setTimeout(() => locationInput.style.borderColor = '', 1000);
          
          // ✅ Trigger validation after location selection
          if (window.selfAnalysisApp?.ui) {
            window.selfAnalysisApp.ui.validateAll();
          }
        });
      });
    };
    
    // Now define fetchLocations with access to displayResults
    const fetchLocations = async (q) => {
      console.log('🔍 Fetching locations for:', q);
      try {
        const res = await fetch(`${GEOCODE_API}?q=${encodeURIComponent(q)}`);
        
        console.log('📥 Geocode response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Geocode error:', errorText);
          throw new Error('geo err');
        }
        
        const data = await res.json();
        console.log('✅ Geocode data received:', data.length, 'results');
        
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
    
    // Input event listener
    locationInput.addEventListener('input', () => {
      const q = locationInput.value.trim();
      clearTimeout(debounceTimer);
      
      if (q.length < 3) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }
      
      const key = q.toLowerCase();
      if (cache.has(key)) {
        displayResults(cache.get(key));
        return;
      }
      
      debounceTimer = setTimeout(() => fetchLocations(q), 400);
    });
    
    // Click outside to close
    document.addEventListener('click', e => {
      if (e.target !== locationInput && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
    
    console.log('✅ Location autocomplete initialized');
  }

  /* ---- Re-validate form when tab is re-entered ---- */
  revalidate() {
    if (window.revalidateForm && typeof window.revalidateForm === 'function') {
      window.revalidateForm();
    }
  }

  /* ---- Cleanup when switching away from tab ---- */
  cleanup() {
    console.log('🧹 Self-Analysis cleanup (if needed)');
  }
}