/*  /src/Mini-Apps/SelfAnalysisPro/loader.js  — Clean Big-App Integration  */

// XSS escape for dynamic HTML attributes
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

export default class SelfAnalysisLauncher {
  constructor(bigApp) {
    this.bigApp = bigApp;
    this.instance = null;
    this.isInitialized = false;
    this._outsideClickHandler = null;
  }

  render() {
    const host = document.getElementById('calculator-tab');
    if (!host) { console.error('Calculator tab not found'); return; }

    // ── Premium lock check ──
    const isPrivileged = this.bigApp.state?.currentUser?.isAdmin || this.bigApp.state?.currentUser?.isVip;
    const isLocked = !isPrivileged && !this.bigApp.gamification?.state?.unlockedFeatures?.includes('self_analysis_pro');

    if (isLocked) {
      this._renderLocked(host);
      return;
    }

    if (this.isInitialized) { this.revalidate(); return; }

    host.innerHTML = '<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>';

    fetch('/src/Mini-Apps/SelfAnalysisPro/index.html')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
      .then(html => {
        const doc    = new DOMParser().parseFromString(html, 'text/html');
        const appPage = doc.getElementById('app-page');
        if (!appPage) throw new Error('app-page element not found in HTML');

        // Use textContent for header strings — no dynamic data injected here
        host.innerHTML = `
<div style="padding:1.5rem;min-height:100vh;">
  <div class="universal-content">
    <header class="main-header project-curiosity"
            style="--header-img:url('/Tabs/NavAnalysis.webp');--header-title:'';--header-tag:'Analyse your \\'Self\\', using Numerology, Astrology, Tree of Life and Tarot'">
      <h1>Self-Analysis Pro</h1>
      <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
      <span class="header-sub"></span>
    </header>
    <div class="selfanalysis-scope">${appPage.innerHTML}</div>
  </div>
</div>`;

        return this.initializeComponents().then(() =>
          import(/* @vite-ignore */ '/src/Mini-Apps/SelfAnalysisPro/js/app.js')
        );
      })
      .then(module => {
        if (typeof module.bootSelfAnalysis !== 'function') throw new Error('bootSelfAnalysis not found');
        this.instance = module.bootSelfAnalysis(host);
        this.isInitialized = true;
      })
      .catch(err => {
        console.error('Self-Analysis loader failed:', err);
        // ⚠️ err.message is internal — safe to show, but keep it minimal
        const msg = document.createElement('div');
        msg.className = 'card';
        msg.style.cssText = 'padding:2rem;text-align:center;color:var(--neuro-error);';
        const h = document.createElement('h2'); h.textContent = 'Failed to Load Self-Analysis Pro';
        const p = document.createElement('p');  p.textContent = err.message;
        const btn = document.createElement('button');
        btn.className = 'btn btn-primary';
        btn.textContent = 'Reload Page';
        btn.type = 'button';
        btn.addEventListener('click', () => location.reload());
        msg.append(h, p, btn);
        host.innerHTML = '';
        host.appendChild(msg);
      });
  }

  _renderLocked(host) {
    host.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:1.5rem;min-height:100vh;';

    const inner = document.createElement('div');
    inner.className = 'universal-content';

    // Header
    const header = document.createElement('header');
    header.className = 'main-header project-curiosity';
    header.style.cssText = "--header-img:url('/Tabs/NavAnalysis.webp');--header-title:'';--header-tag:'Analyse your \\'Self\\', using Numerology, Astrology, Tree of Life and Tarot'";
    const h1 = document.createElement('h1'); h1.textContent = 'Self-Analysis Pro';
    const h3 = document.createElement('h3'); h3.textContent = "Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot";
    header.append(h1, h3, document.createElement('span'));

    // Card
    const card = document.createElement('div');
    card.className = 'card relative';
    card.style.cssText = 'padding:3rem;text-align:center;opacity:0.75;';

    const iconDiv = document.createElement('div');
    iconDiv.style.marginBottom = '1rem';
    iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:5rem;height:5rem;opacity:0.3;" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

    const cardH2 = document.createElement('h2');
    cardH2.style.cssText = 'color:var(--neuro-text);font-size:2rem;margin-bottom:1rem;';
    cardH2.textContent = 'Premium Feature Locked';

    const cardP = document.createElement('p');
    cardP.style.cssText = 'color:var(--neuro-text-light);font-size:1.2rem;margin-bottom:2rem;';
    cardP.textContent = 'Unlock Self-Analysis Pro in the Karma Shop to access your full Numerology, Astrology & Tree of Life analysis.';

    const shopBtn = document.createElement('button');
    shopBtn.className = 'btn btn-primary';
    shopBtn.type = 'button';
    shopBtn.style.cssText = 'padding:1rem 2rem;font-size:1.1rem;';
    shopBtn.textContent = 'Visit Karma Shop';
    // No inline onclick — use event listener
    shopBtn.addEventListener('click', () => window.app?.nav?.switchTab('karma-shop'));

    card.append(iconDiv, cardH2, cardP, shopBtn);
    inner.append(header, card);
    wrap.appendChild(inner);
    host.appendChild(wrap);
  }

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

      if (document.getElementById('date-of-birth'))  window.customDatePicker = new CustomDatePicker('date-of-birth');
      if (document.getElementById('time-of-birth'))  window.customTimePicker = new CustomTimePicker('time-of-birth');
      if (document.getElementById('step-indicator')) {
        window.stepIndicator = new StepIndicator();
        window.resetStepIndicator = () => window.stepIndicator?.reset();
      }

      this.initializeLocationAutocomplete();
    } catch (err) {
      console.error('Failed to initialize components:', err);
      throw err;
    }
  }

  initializeLocationAutocomplete() {
    const locationInput = document.getElementById('location-birth');
    const dropdown      = document.getElementById('location-dropdown');
    if (!locationInput || !dropdown) { console.warn('Location elements not found'); return; }

    const GEOCODE_API = '/api/geocode';
    let debounceTimer;
    const cache = new Map();

    const displayResults = (list) => {
      dropdown.innerHTML = '';

      if (!list?.length) {
        const msg = document.createElement('div');
        msg.style.cssText = 'padding:10px;color:#888;';
        msg.textContent = 'No locations found';
        dropdown.appendChild(msg);
        dropdown.classList.add('active');
        setTimeout(() => dropdown.classList.remove('active'), 2000);
        return;
      }

      list.forEach(it => {
        const opt = document.createElement('div');
        opt.className = 'location-option';
        // Safe: data-* set via property, display name via textContent
        opt.dataset.lat  = it.lat;
        opt.dataset.lon  = it.lon;
        opt.dataset.name = it.display_name;
        opt.textContent  = it.display_name; // ← XSS fix: was innerHTML
        opt.addEventListener('click', () => {
          locationInput.value       = opt.dataset.name;
          locationInput.dataset.lat = opt.dataset.lat;
          locationInput.dataset.lon = opt.dataset.lon;
          dropdown.classList.remove('active');
          dropdown.innerHTML = '';
          locationInput.style.borderColor = '#4caf50';
          setTimeout(() => { locationInput.style.borderColor = ''; }, 1000);
        });
        dropdown.appendChild(opt);
      });

      dropdown.classList.add('active');
    };

    const fetchLocations = async (q) => {
      try {
        const res = await fetch(`${GEOCODE_API}?q=${encodeURIComponent(q)}`, {
          signal: AbortSignal.timeout(8000)
        });
        if (!res.ok) throw new Error(`geo ${res.status}`);
        const data = await res.json();
        if (cache.size >= 50) cache.delete(cache.keys().next().value);
        cache.set(q.toLowerCase(), data);
        displayResults(data);
      } catch (e) {
        if (e.name === 'AbortError') return;
        console.warn('Location fetch error:', e.message);
        dropdown.innerHTML = '';
        const errMsg = document.createElement('div');
        errMsg.style.cssText = 'padding:10px;color:#d32f2f;background:#ffebee;';
        errMsg.textContent = 'Unable to load suggestions. Try typing your city name.';
        dropdown.appendChild(errMsg);
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

  revalidate() {
    if (typeof window.revalidateForm === 'function') window.revalidateForm();
  }

  destroy() {
    if (this._outsideClickHandler) {
      document.removeEventListener('click', this._outsideClickHandler);
      this._outsideClickHandler = null;
    }
    this.instance = null;
    this.isInitialized = false;
  }
}