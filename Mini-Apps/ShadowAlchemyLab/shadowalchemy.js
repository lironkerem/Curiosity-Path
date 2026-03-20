// Mini-Apps/ShadowAlchemyLab/js/engines/shadowalchemy.js
// Patched: inline onclick replaced with data-* + event listener,
// esc() on err.message in error fallback, type=button, aria-hidden on SVGs.

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

class ShadowAlchemyEngine {
  constructor(app) {
    this.app         = app;
    this.initialized = false;
  }

  async render() {
    const tab = document.getElementById('shadow-alchemy-tab');

    const isPrivileged = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
    const isLocked = !isPrivileged && !this.app.gamification?.state?.unlockedFeatures?.includes('shadow_alchemy_lab');

    if (isLocked) {
      tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavShadow.webp');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub" aria-hidden="true"></span>
      </header>

      <div class="card relative" style="padding:3rem;text-align:center;opacity:0.75;">
        <div style="margin-bottom:1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:5rem;height:5rem;opacity:0.3;" aria-hidden="true" focusable="false">
            <rect width="18" height="11" x="3" y="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 style="color:var(--neuro-text);font-size:2rem;margin-bottom:1rem;">Premium Feature Locked</h2>
        <p style="color:var(--neuro-text-light);font-size:1.2rem;margin-bottom:2rem;">
          Unlock the Shadow Alchemy Lab in the Karma Shop to access this powerful transformation tool.
        </p>
        <button type="button" id="shadow-lab-goto-shop" class="btn btn-primary" style="padding:1rem 2rem;font-size:1.1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          Visit Karma Shop
        </button>
      </div>

    </div>
  </div>`;

      // Wire the shop button safely (no inline onclick)
      const shopBtn = tab.querySelector('#shadow-lab-goto-shop');
      if (shopBtn) {
        shopBtn.addEventListener('click', () => {
          if (window.app?.nav?.switchTab) window.app.nav.switchTab('karma-shop');
        });
      }
      return;
    }

    // Unlocked render
    tab.innerHTML = `
  <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavShadow.webp');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub" aria-hidden="true"></span>
      </header>

      <main id="shadow-alchemy-main-content" aria-live="polite"></main>

    </div>
  </div>`;

    if (!this.initialized) {
      await this.initializeShadowAlchemy();
      this.initialized = true;
    } else if (window.AppController?.renderDashboard) {
      window.AppController.renderDashboard();
    }
  }

  async initializeShadowAlchemy() {
    try {
      await import('/Mini-Apps/ShadowAlchemyLab/js/engines/archetypesEngine.js');
      await this.loadScript('/Mini-Apps/ShadowAlchemyLab/js/engines/DailyJourneyEngine.js');
      await import('/Mini-Apps/ShadowAlchemyLab/js/controller.js');
      if (window.AppController?.init) await window.AppController.init();
    } catch (err) {
      console.error('Failed to load Shadow Alchemy Lab');
      const main = document.getElementById('shadow-alchemy-main-content');
      if (main) {
        // Use DOM API — no innerHTML with err.message
        main.textContent = '';
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'text-align:center;padding:var(--spacing-xl)';

        const h3 = document.createElement('h3');
        h3.style.color = 'var(--neuro-text)';
        h3.textContent = 'Failed to Load';

        const p = document.createElement('p');
        p.style.color = 'var(--neuro-text-light)';
        p.textContent = 'Please refresh the page and try again.';

        const errDetail = document.createElement('p');
        errDetail.style.cssText = 'color:var(--neuro-text-lighter);font-size:0.9rem;margin-top:1rem';
        errDetail.textContent = err.message; // textContent — XSS safe

        card.append(h3, p, errDetail);
        main.appendChild(card);
      }
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Only allow scripts from the expected Mini-Apps path
      if (!src.startsWith('/Mini-Apps/')) {
        return reject(new Error(`Blocked script from unexpected path: ${src}`));
      }
      if (document.querySelector(`script[src="${CSS.escape ? src : src.replace(/"/g, '')}"]`)) {
        return resolve();
      }
      const script   = document.createElement('script');
      script.src     = src;
      script.onload  = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }
}

export default ShadowAlchemyEngine;
