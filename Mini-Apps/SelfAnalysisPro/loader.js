/*  /Mini-Apps/SelfAnalysisPro/js/loader.js  — Clean Big-App Integration  */

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
      console.error('Calculator tab not found');
      return;
    }

    if (this.isInitialized) {
      this.revalidate();
      return;
    }

    console.log('Loading Self-Analysis Pro...');
    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    fetch('/Mini-Apps/SelfAnalysisPro/index.html')
      .then(r => {
        if (!r.ok) throw new Error(`Failed to fetch HTML: ${r.status}`);
        return r.text();
      })
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const appPage = doc.getElementById('app-page');

        if (!appPage) throw new Error('app-page element not found in HTML');

        host.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavAnalysis.webp');
                     --header-title:'';
                     --header-tag:'Analyse your Self, using Numerology, Astrology, Tree of Life and Tarot'">
        <h1>Self-Analysis Pro</h1>
        <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
        <span class="header-sub" aria-hidden="true"></span>
      </header>

      <div class="selfanalysis-scope">
        ${appPage.innerHTML}
      </div>

    </div>
  </div>
`;

        return this.initializeComponents().then(() => {
          return import('/Mini-Apps/SelfAnalysisPro/js/app.js');
        });
      })
      .then(module => {
        if (typeof module.bootSelfAnalysis === 'function') {
          this.instance = module.bootSelfAnalysis(host);
          this.isInitialized = true;
          console.log('Self-Analysis Pro loaded');
        } else {
          throw new Error('bootSelfAnalysis function not found');
        }
      })
      .catch(err => {
        console.error('Self-Analysis loader failed:', err);
        // Use textContent for the error message to prevent XSS
        const errDiv = document.createElement('div');
        errDiv.className = 'card';
        errDiv.style.cssText = 'padding:2rem;text-align:center;color:var(--neuro-error);';

        const h2 = document.createElement('h2');
        h2.textContent = 'Failed to Load Self-Analysis Pro';

        const p = document.createElement('p');
        p.textContent = err.message;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary';
        btn.textContent = 'Reload Page';
        btn.addEventListener('click', () => location.reload());

        errDiv.append(h2, p, btn);
        host.innerHTML = '';
        host.appendChild(errDiv);
      });
  }

  /* ---- Initialize ALL Components ---- */
  async initializeComponents() {
    try {
      console.log('Initializing components...');

      const [
        { CustomDatePicker },
        { CustomTimePicker },
        { StepIndicator }
      ] = await Promise.all([
        import('/Mini-Apps/SelfAnalysisPro/js/customDatePicker.js'),
        import('/Mini-Apps/SelfAnalysisPro/js/customTimePicker.js'),
        import('/Mini-Apps/SelfAnalysisPro/js/stepindicator.js')
      ]);

      if (document.getElementById('date-of-birth')) {
        window.customDatePicker = new CustomDatePicker('date-of-birth');
        console.log('CustomDatePicker initialized');
      }

      if (document.getElementById('time-of-birth')) {
        window.customTimePicker = new CustomTimePicker('time-of-birth');
        console.log('CustomTimePicker initialized');
      }

      if (document.getElementById('step-indicator')) {
        window.stepIndicator = new StepIndicator();
        window.resetStepIndicator = () => {
          if (window.stepIndicator) window.stepIndicator.reset();
        };
        console.log('StepIndicator initialized');
      }

      this.initializeLocationAutocomplete();

    } catch (err) {
      console.error('Failed to initialize components:', err);
      throw err;
    }
  }

  /* ---- Location Autocomplete ---- */
  initializeLocationAutocomplete() {
    const locationInput = document.getElementById('location-birth');
    const dropdown = document.getElementById('location-dropdown');

    if (!locationInput || !dropdown) {
      console.warn('Location elements not found');
      return;
    }

    const GEOCODE_API = '/api/geocode';
    let debounceTimer;
    const cache = new Map();

    const displayResults = (list) => {
      if (!list || !list.length) {
        dropdown.textContent = '';
        const msg = document.createElement('div');
        msg.style.cssText = 'padding:10px;color:#888;';
        msg.textContent = 'No locations found';
        dropdown.appendChild(msg);
        dropdown.classList.add('active');
        setTimeout(() => dropdown.classList.remove('active'), 2000);
        return;
      }

      dropdown.textContent = '';
      list.forEach(it => {
        const opt = document.createElement('div');
        opt.className = 'location-option';
        opt.setAttribute('role', 'option');
        opt.setAttribute('tabindex', '0');
        // Store coords as data attributes — use esc for safety
        opt.dataset.lat  = String(parseFloat(it.lat)  || 0);
        opt.dataset.lon  = String(parseFloat(it.lon)  || 0);
        opt.dataset.name = String(it.display_name || '').slice(0, 300);
        opt.textContent  = opt.dataset.name; // XSS-safe

        opt.addEventListener('click',    () => selectLocation(opt));
        opt.addEventListener('keydown',  e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectLocation(opt); } });

        dropdown.appendChild(opt);
      });

      dropdown.classList.add('active');
    };

    const selectLocation = (opt) => {
      locationInput.value       = opt.dataset.name;
      locationInput.dataset.lat = opt.dataset.lat;
      locationInput.dataset.lon = opt.dataset.lon;
      dropdown.classList.remove('active');
      dropdown.textContent = '';
      locationInput.style.borderColor = '#4caf50';
      setTimeout(() => { locationInput.style.borderColor = ''; }, 1000);
    };

    const fetchLocations = async (q) => {
      try {
        const res = await fetch(`${GEOCODE_API}?q=${encodeURIComponent(q)}`, {
          signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) throw new Error(`Geocode ${res.status}`);
        const data = await res.json();
        cache.set(q.toLowerCase(), data);
        if (cache.size > 50) cache.delete(cache.keys().next().value);
        displayResults(data);
      } catch (e) {
        console.warn('Location fetch error:', e.message);
        dropdown.textContent = '';
        const msg = document.createElement('div');
        msg.style.cssText = 'padding:10px;color:#d32f2f;background:#ffebee;';
        msg.textContent = 'Unable to load suggestions. Try typing your city name.';
        dropdown.appendChild(msg);
        dropdown.classList.add('active');
        setTimeout(() => dropdown.classList.remove('active'), 3000);
      }
    };

    locationInput.addEventListener('input', () => {
      const q = locationInput.value.trim().slice(0, 200); // enforce maxlength
      clearTimeout(debounceTimer);
      if (q.length < 3) {
        dropdown.classList.remove('active');
        dropdown.textContent = '';
        return;
      }
      const key = q.toLowerCase();
      if (cache.has(key)) { displayResults(cache.get(key)); return; }
      debounceTimer = setTimeout(() => fetchLocations(q), 400);
    });

    document.addEventListener('click', e => {
      if (e.target !== locationInput && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    console.log('Location autocomplete initialized');
  }

  /* ---- Re-validate form when tab is re-entered ---- */
  revalidate() {
    if (typeof window.revalidateForm === 'function') window.revalidateForm();
  }

  /* ---- Cleanup when switching away from tab ---- */
  cleanup() {
    console.log('Self-Analysis cleanup');
  }
}
