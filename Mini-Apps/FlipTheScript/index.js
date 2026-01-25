// Mini-Apps/FlipTheScript/index.js
let cssCache = null;

async function loadCSS() {
  if (cssCache) return cssCache;
  const res = await fetch(new URL('../../../CSS/neumorphic-theme.css', import.meta.url));
  cssCache = await res.text();
  return cssCache;
}

export default class FlipTheScriptApp {
  constructor(app) {
    this.app = app;
  }

  async render() {
    /* 1.  inject global neumorphic styles once */
    if (!document.querySelector('#flip-the-script-styles')) {
      const style = document.createElement('style');
      style.id = 'flip-the-script-styles';
      style.textContent = await loadCSS();
      document.head.appendChild(style);
    }

    /* 2.  Google font for Amatic SC */
    if (!document.querySelector('#flip-script-fonts')) {
      const fontLink = document.createElement('link');
      fontLink.id = 'flip-script-fonts';
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&display=swap';
      document.head.appendChild(fontLink);
    }

    /* 3.  load affirmations data */
    if (!window.affirmations) {
      try {
        const affModule = await import('./data.js');
        window.affirmations = affModule.default || affModule.affirmations;
        console.log('✅ Affirmations loaded');
      } catch (err) {
        console.error('Failed to load affirmations:', err);
      }
    }

    /* 4.  load FlipEngine */
    if (!window.FlipEngine) {
      try {
        await import('./engine.js');
        console.log('✅ FlipEngine loaded');
      } catch (err) {
        console.error('Failed to load FlipEngine:', err);
      }
    }

    /* 5.  build the responsive shell (1280 px desktop / 100 % - 3 rem mobile) */
    const tab = document.getElementById('flip-script-tab');
    tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!--  MOBILE-ONLY IMAGE + SUBTITLE HEADER  -->
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavFlip.png');
                     --header-title:'';
                     --header-tag:'Flip your Negative thoughts, into Positive affirmations'">
        <h1>Flip the Script</h1>
        <h3>Flip your Negative thoughts, into Positive affirmations</h3>
        <span class="header-sub"></span>
      </header>

      <!--  main card  -->
      <div class="card" style="padding:2rem;margin-bottom: 2rem;">
        <section class="input-section" id="input-section">
          <div class="input-layout">
            <div class="input-main">
              <div class="textarea-wrapper">
                <textarea id="negative-input" placeholder="Type or say your negative thought or belief here.." maxlength="500"></textarea>
                <button id="voice-input-btn" class="voice-input-btn" title="Speak your thought">🎤</button>
                <div class="char-counter"><span id="char-count">0</span>/500 characters</div>
              </div>
            </div>
            <div class="flip-suggestions">
              <p class="suggestion-label">💭 Try being more specific:</p>
              <div class="suggestion-buttons-grid">
                <button class="suggestion-btn" data-text="I feel ">I feel...</button>
                <button class="suggestion-btn" data-text="I can't ">I can't...</button>
                <button class="suggestion-btn" data-text="I'm worried about ">I'm worried about...</button>
                <button class="suggestion-btn" data-text="I hate ">I hate...</button>
                <button class="suggestion-btn" data-text="I'm afraid that ">I'm afraid that...</button>
                <button class="suggestion-btn" data-text="I always ">I always...</button>
              </div>
            </div>
          </div>

          <!--  buttons with roomy gap  -->
          <div class="btn-group-vertical" style="gap:1.25rem;">
            <button id="flip-btn" class="btn primary flip-main-btn">✨ Flip It Now ✨</button>
            <button id="clear-btn" class="btn secondary clear-small-btn">Clear</button>
          </div>

          <div class="progress-wrapper hidden" id="progress-wrapper">
            <div class="progress-bar">
              <div class="progress-inner" id="progress-inner">0%</div>
            </div>
          </div>
        </section>

        <section id="output-section" class="output-main-event hidden">
          <div class="output-card">
            <div class="output-header">
              <h2>✨ Your Flipped Script</h2>
            </div>
            <div class="output-content">
              <p id="extended-flip" class="flipped-text">Your Flipped Script will appear here...</p>
            </div>
            <button id="flip-another-btn" class="btn flip-another-inside">🔄 Flip Another Thought</button>
            <div class="action-icons">
              <button id="save-extended" class="icon-btn" title="Save">💾</button>
              <button id="audio-extended" class="icon-btn" title="Listen">🔊</button>
            </div>
          </div>
        </section>
      </div>

      <!--  Saved Flips  -->
      <div class="card collapsible-card" id="saved-section">
        <button class="collapse-toggle" aria-expanded="false" style="padding: 24px; cursor: pointer; display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; text-align: left;">
          <span class="collapse-icon chevron" style="font-size: 1.5rem; transition: transform var(--transition-normal); color: var(--neuro-accent);">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">Your Saved Flips</h3>
        </button>
        <div class="collapse-content collapsed">
          <div style="padding: 0 24px 24px;">
            <div class="saved-controls" style="margin-bottom: 1rem;">
              <input type="text" id="search-saved" class="search-input w-full" placeholder="🔍 Search saved flips...">
            </div>
            <ul id="saved-list" style="margin-bottom: 1rem;"></ul>
            <div class="backup-restore flex gap-3">
              <button id="backup-id" class="btn flex-1">📥 Backup</button>
              <button id="restore-id" class="btn flex-1">📤 Restore</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!--  responsive width helper  -->
  <style>
    .fts-wrapper{
      width:100%;
      max-width:80rem;          /* 1280 px  */
      margin:0 auto;
    }
    @media (max-width:80rem){
      .fts-wrapper{ max-width:calc(100% - 3rem); } /* 100 % - 24 px  */
    }
    /*  purple gradient title card  */
    #flip-script-tab .text-center{
      background:linear-gradient(135deg,#8e44ad,#667eea);
      color:#fff;
      border-radius:var(--radius-2xl);
      padding:1.25rem 1.5rem;
      box-shadow:var(--shadow-raised-lg);
    }
    #flip-script-tab .text-center h2,
    #flip-script-tab .text-center p{ color:#fff; margin:0; }

    /*  utilities for saved-card content  */
    .w-full{width:100%;}
    .flex{display:flex;}
    .flex-1{flex:1 1 0%;}
    .gap-3{gap:0.75rem;}
    
    /* Collapsible styles */
    .collapse-content { 
      max-height: 5000px; 
      overflow: hidden; 
      transition: max-height var(--transition-slow); 
    }
    .collapse-content.collapsed { 
      max-height: 0 !important; 
    }
    .chevron { 
      font-size: 1.5rem; 
      transition: transform var(--transition-normal); 
      color: var(--neuro-accent); 
    }
    .collapse-toggle[aria-expanded="true"] .chevron { 
      transform: rotate(90deg); 
    }
  </style>
`;

    /* 6.  mount behaviour */
    import('./ui.js').then(m => m.mountUI(this.app));
  }
}