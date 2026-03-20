// Mini-Apps/FlipTheScript/index.js

export default class FlipTheScriptApp {
  constructor(app) {
    this.app = app;
  }

  async render() {

    /* 1. Load affirmations data */
    if (!window.affirmations) {
      try {
        const affModule = await import('./data.js');
        window.affirmations = affModule.default || affModule.affirmations;
      } catch (err) {
        console.error('Failed to load affirmations:', err);
      }
    }

    /* 2. Load FlipEngine */
    if (!window.FlipEngine) {
      try {
        await import('./engine.js');
      } catch (err) {
        console.error('Failed to load FlipEngine:', err);
      }
    }

    /* 3. Build the shell */
    const tab = document.getElementById('flip-script-tab');
    tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!--  MOBILE-ONLY IMAGE + SUBTITLE HEADER  -->
      <header class="main-header project-curiosity"
              style="--header-img:url('/public/Tabs/NavFlip.webp');
                     --header-title:'';
                     --header-tag:'Flip your Negative thoughts, into Positive affirmations'">
        <h1>Flip the Script</h1>
        <p class="header-subtitle">Flip your Negative thoughts, into Positive affirmations</p>
        <span class="header-sub" aria-hidden="true"></span>
      </header>

      <!--  main card  -->
      <div class="card" style="padding:2rem;margin-bottom:2rem;">
        <section class="input-section" id="input-section" aria-label="Enter your thought">
          <div class="input-layout">
            <div class="input-main">
              <div class="textarea-wrapper">
                <textarea id="negative-input"
                          placeholder="Type or say your negative thought or belief here.."
                          maxlength="500"
                          aria-label="Your negative thought or belief"
                          aria-describedby="char-counter-desc"></textarea>
                <button id="voice-input-btn"
                        type="button"
                        class="voice-input-btn"
                        title="Speak your thought"
                        aria-label="Speak your thought">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                    <path d="M12 19v3"/><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>
                  </svg>
                </button>
                <div class="char-counter" id="char-counter-desc">
                  <span id="char-count" aria-live="polite" aria-atomic="true">0</span>/500 characters
                </div>
              </div>
            </div>

            <div class="flip-suggestions">
              <p class="suggestion-label" style="display:flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Try being more specific:
              </p>
              <div class="suggestion-buttons-grid">
                <button type="button" class="suggestion-btn" data-text="I feel ">I feel...</button>
                <button type="button" class="suggestion-btn" data-text="I can't ">I can't...</button>
                <button type="button" class="suggestion-btn" data-text="I'm worried about ">I'm worried about...</button>
                <button type="button" class="suggestion-btn" data-text="I hate ">I hate...</button>
                <button type="button" class="suggestion-btn" data-text="I'm afraid that ">I'm afraid that...</button>
                <button type="button" class="suggestion-btn" data-text="I always ">I always...</button>
              </div>
            </div>
          </div>

          <!--  action buttons  -->
          <div class="btn-group-vertical" style="gap:1.25rem;">
            <button id="flip-btn"
                    type="button"
                    class="btn primary flip-main-btn"
                    style="display:inline-flex;align-items:center;gap:0.4rem;"
                    aria-label="Flip your thought into a positive affirmation">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/>
              </svg>
              Flip It Now
            </button>
            <button id="clear-btn" type="button" class="btn secondary clear-small-btn">Clear</button>
          </div>

          <div class="progress-wrapper hidden" id="progress-wrapper" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Flip progress">
            <div class="progress-bar">
              <div class="progress-inner" id="progress-inner">0%</div>
            </div>
          </div>
        </section>

        <section id="output-section" class="output-main-event hidden" aria-label="Your flipped script" aria-live="polite">
          <div class="output-card">
            <div class="output-header">
              <h2 style="display:flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/>
                </svg>
                Your Flipped Script
              </h2>
            </div>
            <div class="output-content">
              <p id="extended-flip" class="flipped-text">Your Flipped Script will appear here...</p>
            </div>
            <button id="flip-another-btn"
                    type="button"
                    class="btn flip-another-inside"
                    style="display:inline-flex;align-items:center;gap:0.4rem;"
                    aria-label="Flip another thought">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
              </svg>
              Flip Another Thought
            </button>
            <div class="action-icons">
              <button id="save-extended"
                      type="button"
                      class="icon-btn"
                      title="Save"
                      aria-label="Save flip">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
              <button id="audio-extended"
                      type="button"
                      class="icon-btn"
                      title="Listen"
                      aria-label="Listen to flip">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      <!--  Saved Flips  -->
      <div class="card collapsible-card" id="saved-section">
        <button class="collapse-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="saved-collapse-content"
                style="padding:24px;cursor:pointer;display:flex;align-items:center;gap:12px;width:100%;background:none;border:none;text-align:left;">
          <span class="collapse-icon chevron" aria-hidden="true" style="font-size:1.5rem;transition:transform var(--transition-normal);color:var(--neuro-accent);">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--neuro-accent);flex-shrink:0;" aria-hidden="true" focusable="false">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <h2 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">My Flips</h2>
        </button>
        <div class="collapse-content collapsed" id="saved-collapse-content">
          <div style="padding:0 24px 24px;">
            <div class="saved-controls" style="margin-bottom:1rem;">
              <input type="text"
                     id="search-saved"
                     class="search-input w-full"
                     placeholder="Search saved flips..."
                     aria-label="Search saved flips"
                     maxlength="200">
            </div>
            <ul id="saved-list" style="margin-bottom:1rem;" aria-label="Saved flips"></ul>
            <div class="backup-restore flex gap-3">
              <button id="backup-id"
                      type="button"
                      class="btn flex-1"
                      style="display:inline-flex;align-items:center;gap:0.4rem;"
                      aria-label="Download backup of saved flips">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Backup
              </button>
              <button id="restore-id"
                      type="button"
                      class="btn flex-1"
                      style="display:inline-flex;align-items:center;gap:0.4rem;"
                      aria-label="Restore saved flips from backup file">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Restore
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!--  styles (dedup guard) -->`;

    // Inject styles with dedup guard
    if (!document.getElementById('fts-styles')) {
      const style = document.createElement('style');
      style.id = 'fts-styles';
      style.textContent = `
        .fts-wrapper {
          width: 100%;
          max-width: 80rem;
          margin: 0 auto;
        }
        @media (max-width: 80rem) {
          .fts-wrapper { max-width: calc(100% - 3rem); }
        }
        #flip-script-tab .text-center {
          background: linear-gradient(135deg, #8e44ad, #667eea);
          color: #fff;
          border-radius: var(--radius-2xl);
          padding: 1.25rem 1.5rem;
          box-shadow: var(--shadow-raised-lg);
        }
        #flip-script-tab .text-center h2,
        #flip-script-tab .text-center p { color: #fff; margin: 0; }
        .w-full  { width: 100%; }
        .flex    { display: flex; }
        .flex-1  { flex: 1 1 0%; }
        .gap-3   { gap: 0.75rem; }
        .collapse-content {
          max-height: 5000px;
          overflow: hidden;
          transition: max-height var(--transition-slow);
        }
        .collapse-content.collapsed { max-height: 0 !important; }
        .chevron {
          font-size: 1.5rem;
          transition: transform var(--transition-normal);
          color: var(--neuro-accent);
        }
        .collapse-toggle[aria-expanded="true"] .chevron { transform: rotate(90deg); }
      `;
      document.head.appendChild(style);
    }

    /* 4. Mount behaviour */
    import('./ui.js').then(m => m.mountUI(this.app));
  }
}
