// js/engines/shadowalchemy.js – Big-App Integration Engine (UNIFIED MARKUP)
class ShadowAlchemyEngine {
  constructor(app) {
    this.app = app;
    this.initialized = false;
  }

async render() {
  const tab = document.getElementById('shadow-alchemy-tab');

  // Check if feature is unlocked
  const isPrivileged = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
  const isLocked = !isPrivileged && !this.app.gamification?.state?.unlockedFeatures?.includes('shadow_alchemy_lab');

  if (isLocked) {
    // Show locked state
tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

   <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavShadow.png');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub"></span>
      </header>

      <div class="card relative" style="padding:3rem; text-align:center; opacity: 0.75;">
        <div style="margin-bottom: 1rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:5rem;height:5rem;opacity:0.3;"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
        <h2 style="color: var(--neuro-text); font-size: 2rem; margin-bottom: 1rem;">Premium Feature Locked</h2>
        <p style="color: var(--neuro-text-light); font-size: 1.2rem; margin-bottom: 2rem;">
          Unlock the Shadow Alchemy Lab in the Karma Shop to access this powerful transformation tool.
        </p>
        <button onclick="window.app.nav.switchTab('karma-shop')" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Visit Karma Shop
        </button>
      </div>

    </div>
  </div>
`;
    return;
  }

  // Original unlocked render code
tab.innerHTML = `
  <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

   <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavShadow.png');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub"></span>
      </header>

      <div class="card" style="padding:2rem">
        <main id="shadow-alchemy-main-content"></main>
      </div>

    </div>
  </div>
`;

  // initialise once
  if (!this.initialized) {
    await this.initializeShadowAlchemy();
    this.initialized = true;
  } else if (window.AppController?.renderDashboard) {
    window.AppController.renderDashboard();
  }
}
  async initializeShadowAlchemy() {
    try {
      console.log('🔮 Loading Shadow Alchemy Lab...');

      // engines
      await import('/Mini-Apps/ShadowAlchemyLab/js/engines/archetypesEngine.js');
      await this.loadScript('/Mini-Apps/ShadowAlchemyLab/js/engines/DailyJourneyEngine.js');

      // controller
      await import('/Mini-Apps/ShadowAlchemyLab/js/controller.js');

      if (window.AppController?.init) await window.AppController.init();
      console.log('✅ Shadow Alchemy Lab loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load Shadow Alchemy Lab:', err);
      const main = document.getElementById('shadow-alchemy-main-content');
      if (main) main.innerHTML = `
        <div class="card" style="text-align:center;padding:var(--spacing-xl)">
          <h3 style="color:var(--neuro-text)">Failed to Load</h3>
          <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
          <p style="color:var(--neuro-text-lighter);font-size:0.9rem;margin-top:1rem">${err.message}</p>
        </div>
      `;
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });
  }
}

export default ShadowAlchemyEngine;