// ============================================
// AFFIRMATIONS ENGINE - OPTIMIZED
// ============================================

import affirmationsData from '../Features/Data/AffirmationsList.js';

class AffirmationsEngine {
  constructor(app) {
    this.app = app;
    this.affirmations = window.affirmations || affirmationsData || {
      general_positive_affirmations: [
        { text: "I am worthy of love and belonging exactly as I am", tags: [] },
        { text: "I trust in the divine timing of my life", tags: [] },
        { text: "I am safe, protected, and guided", tags: [] }
      ]
    };
    this.currentAffirmation = null;
    this._allAffirmations = null; // Cache flattened list
    
    console.log('✅ Affirmations loaded:', Object.keys(this.affirmations).length, 'categories');
  }

  _getAllAffirmations() {
    if (this._allAffirmations) return this._allAffirmations;
    
    this._allAffirmations = Object.values(this.affirmations)
      .filter(Array.isArray)
      .flat();
    
    return this._allAffirmations;
  }

  _extractText(item) {
    return typeof item === 'string' ? item : item.text;
  }

  _getDayOfYear() {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  }

  render() {
    const tab = document.getElementById('affirmations-tab');
    
    tab.innerHTML = this.currentAffirmation 
      ? this._renderFullScreen()
      : this._renderDashboard();
  }

  _renderDashboard() {
    return `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <h2 class="text-4xl font-bold text-white" style="margin-bottom: 1.5rem;">Positive Affirmations</h2>
          <p class="text-gray-400" style="margin-bottom: 2rem;">Powerful statements to reprogram your mindset</p>

          <div class="text-center" style="margin-bottom: 3rem;">
            <div class="flip-card inline-block w-80 h-48" style="margin-bottom: 2rem;" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front bg-gradient-to-br from-pink-600 to-purple-600 p-8 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-white text-2xl font-bold" style="margin-bottom: 1rem;">Daily Affirmation</p>
                    <p class="text-pink-100">Tap to reveal ✨</p>
                  </div>
                </div>
                <div class="flip-card-back bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                  <p class="text-white text-xl font-semibold text-center">
                    "${this.getDailyAffirmation()}"
                  </p>
                </div>
              </div>
            </div>
            <div>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary text-lg">
                🎲 Random Affirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderFullScreen() {
    return `
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center w-full max-w-2xl">
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto" style="margin-bottom: 2rem;">
              <span class="text-5xl">✨</span>
            </div>
            <p class="text-white text-4xl font-bold" style="margin-bottom: 3rem;">
              "${this.currentAffirmation}"
            </p>
            <div class="flex justify-center space-x-4">
              <button onclick="window.featuresManager.engines.affirmations.reset()" class="btn btn-secondary">
                ← Back
              </button>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary">
                🎲 Another One
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getDailyAffirmation() {
    const general = this.affirmations.general_positive_affirmations || [];
    
    if (!general.length) {
      console.warn('⚠️ No affirmations loaded');
      return "I am worthy of love and belonging exactly as I am.";
    }
    
    const affirmation = general[this._getDayOfYear() % general.length];
    const text = this._extractText(affirmation);
    
    console.log('💫 Daily affirmation selected:', text.substring(0, 50) + '...');
    return text;
  }

  randomCard() {
    const allAffirmations = this._getAllAffirmations();
    
    if (!allAffirmations.length) {
      console.warn('⚠️ No affirmations available');
      this.currentAffirmation = "I am worthy of love and belonging exactly as I am.";
    } else {
      const random = allAffirmations[Math.floor(Math.random() * allAffirmations.length)];
      this.currentAffirmation = this._extractText(random);
    }
    
    this.render();
  }

  reset() {
    this.currentAffirmation = null;
    this.render();
  }
}

export default AffirmationsEngine;

if (typeof window !== 'undefined') {
  window.AffirmationsEngine = AffirmationsEngine;
}