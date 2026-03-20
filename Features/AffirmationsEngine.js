// ============================================
// AFFIRMATIONS ENGINE - Professional & Optimized
// ============================================
// Manages daily and random affirmation display with full-screen experience
// Supports both dashboard and immersive viewing modes

import affirmationsData from '../Features/Data/AffirmationsList.js';

// Configuration constants — frozen
const CONFIG = Object.freeze({
  DEFAULT_AFFIRMATIONS: Object.freeze([
    { text: 'I am worthy of love and belonging exactly as I am', tags: [] },
    { text: 'I trust in the divine timing of my life', tags: [] },
    { text: 'I am safe, protected, and guided', tags: [] }
  ])
});

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

class AffirmationsEngine {
  /**
   * @param {Object} app - Main app instance
   */
  constructor(app) {
    this.app = app;

    this.affirmations = window.affirmations || affirmationsData || {
      general_positive_affirmations: CONFIG.DEFAULT_AFFIRMATIONS
    };

    this.currentAffirmation = null;
    this._allAffirmations = null; // lazy cache
  }

  // ── Data Access ────────────────────────────────────────────────────────────

  _getAllAffirmations() {
    if (this._allAffirmations) return this._allAffirmations;
    this._allAffirmations = Object.values(this.affirmations).flat().filter(Boolean);
    return this._allAffirmations;
  }

  _extractText(item) {
    return typeof item === 'string' ? item : (item?.text ?? '');
  }

  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ── Affirmation Getters ────────────────────────────────────────────────────

  getDailyAffirmation() {
    const general = this.affirmations.general_positive_affirmations || [];
    if (!general.length) {
      console.warn('AffirmationsEngine: No affirmations loaded, using default');
      return 'I am worthy of love and belonging exactly as I am.';
    }
    const dayIndex = this._getDayOfYear() % general.length;
    return this._extractText(general[dayIndex]);
  }

  randomCard() {
    const all = this._getAllAffirmations();
    if (!all.length) {
      console.warn('AffirmationsEngine: No affirmations available, using default');
      this.currentAffirmation = 'I am worthy of love and belonging exactly as I am.';
    } else {
      this.currentAffirmation = this._extractText(
        all[Math.floor(Math.random() * all.length)]
      );
    }
    this.render();
  }

  reset() {
    this.currentAffirmation = null;
    this.render();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const tab = document.getElementById('affirmations-tab');
    if (!tab) return;
    tab.innerHTML = this.currentAffirmation
      ? this._renderFullScreen()
      : this._renderDashboard();
  }

  _renderDashboard() {
    const daily = esc(this.getDailyAffirmation());
    return `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <h2 class="text-4xl font-bold text-white" style="margin-bottom:1.5rem;">Positive Affirmations</h2>
          <p class="text-gray-400" style="margin-bottom:2rem;">Powerful statements to reprogram your mindset</p>

          <div class="text-center" style="margin-bottom:3rem;">
            <!-- Daily Affirmation Flip Card -->
            <div class="flip-card inline-block w-80 h-48" style="margin-bottom:2rem;"
                 role="button" tabindex="0" aria-label="Daily affirmation flip card — tap to reveal"
                 onclick="this.classList.toggle('flipped')"
                 onkeydown="if(event.key==='Enter'||event.key===' ')this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front bg-gradient-to-br from-pink-600 to-purple-600 p-8 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-white text-2xl font-bold" style="margin-bottom:1rem;">Daily Affirmation</p>
                    <p class="text-pink-100" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;">
                      Tap to reveal
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
                    </p>
                  </div>
                </div>
                <div class="flip-card-back bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                  <p class="text-white text-xl font-semibold text-center">"${daily}"</p>
                </div>
              </div>
            </div>

            <!-- Random Affirmation Button -->
            <div>
              <button type="button"
                      onclick="window.featuresManager.engines.affirmations.randomCard()"
                      class="btn btn-primary text-lg"
                      style="display:inline-flex;align-items:center;gap:0.5rem;"
                      aria-label="Show random affirmation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Random Affirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderFullScreen() {
    const text = esc(this.currentAffirmation);
    return `
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center w-full max-w-2xl">

            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto" style="margin-bottom:2rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false" style="width:48px;height:48px;color:white;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            </div>

            <p class="text-white text-4xl font-bold" style="margin-bottom:3rem;">"${text}"</p>

            <div class="flex justify-center space-x-4">
              <button type="button"
                      onclick="window.featuresManager.engines.affirmations.reset()"
                      class="btn btn-secondary"
                      aria-label="Back to dashboard">
                ← Back
              </button>
              <button type="button"
                      onclick="window.featuresManager.engines.affirmations.randomCard()"
                      class="btn btn-primary"
                      style="display:inline-flex;align-items:center;gap:0.5rem;"
                      aria-label="Show another affirmation">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Another One
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.AffirmationsEngine = AffirmationsEngine;
}

export default AffirmationsEngine;
