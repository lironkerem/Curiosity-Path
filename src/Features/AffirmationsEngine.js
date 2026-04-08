// ============================================
// AFFIRMATIONS ENGINE - Professional & Optimized
// ============================================
// Manages daily and random affirmation display with full-screen experience
// Supports both dashboard and immersive viewing modes

import affirmationsData from '../src/Features/Data/AffirmationsList.js';

// Configuration constants
const CONFIG = {
  DEFAULT_AFFIRMATIONS: [
    { text: "I am worthy of love and belonging exactly as I am", tags: [] },
    { text: "I trust in the divine timing of my life", tags: [] },
    { text: "I am safe, protected, and guided", tags: [] }
  ]
};

class AffirmationsEngine {
  /**
   * Initialize the Affirmations Engine
   * @param {Object} app - Main app instance with utilities
   */
  constructor(app) {
    this.app = app;
    
    // Load affirmations with fallback hierarchy
    this.affirmations = window.affirmations || affirmationsData || {
      general_positive_affirmations: CONFIG.DEFAULT_AFFIRMATIONS
    };
    
    this.currentAffirmation = null;
    this._allAffirmations = null; // Cache for flattened affirmations list
    
  }

  // ============================================
  // Data Access Methods
  // ============================================

  /**
   * Get and cache flattened list of all affirmations
   * @returns {Array} All affirmations from all categories
   */
  _getAllAffirmations() {
    if (this._allAffirmations) return this._allAffirmations;

    // Flatten all categories into single array
    this._allAffirmations = Object.values(this.affirmations)
      .flat()
      .filter(Boolean); // Remove null/undefined entries

    return this._allAffirmations;
  }

  /**
   * Extract text from affirmation object or string
   * @param {Object|string} item - Affirmation item
   * @returns {string} Affirmation text
   */
  _extractText(item) {
    return typeof item === 'string' ? item : item.text;
  }

  /**
   * Calculate current day of year (1-365/366)
   * @returns {number} Day of year
   */
  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ============================================
  // Affirmation Getters
  // ============================================

  /**
   * Get the daily affirmation (consistent throughout the day)
   * Uses day-of-year to select from general_positive_affirmations
   * @returns {string} Daily affirmation text
   */
  getDailyAffirmation() {
    const general = this.affirmations.general_positive_affirmations || [];
    
    if (!general.length) {
      console.warn('⚠️ No affirmations loaded, using default');
      return "I am worthy of love and belonging exactly as I am.";
    }
    
    const dayIndex = this._getDayOfYear() % general.length;
    const affirmation = general[dayIndex];
    const text = this._extractText(affirmation);
    
    return text;
  }

  /**
   * Get a random affirmation from all categories
   * Updates currentAffirmation and triggers re-render
   */
  randomCard() {
    const allAffirmations = this._getAllAffirmations();
    
    if (!allAffirmations.length) {
      console.warn('⚠️ No affirmations available, using default');
      this.currentAffirmation = "I am worthy of love and belonging exactly as I am.";
    } else {
      const randomIndex = Math.floor(Math.random() * allAffirmations.length);
      const random = allAffirmations[randomIndex];
      this.currentAffirmation = this._extractText(random);
    }
    
    this.render();
  }

  /**
   * Reset to dashboard view (exit full-screen mode)
   */
  reset() {
    this.currentAffirmation = null;
    this.render();
  }

  // ============================================
  // Render Methods
  // ============================================

  /**
   * Main render method - displays either dashboard or full-screen view
   */
  render() {
    const tab = document.getElementById('affirmations-tab');
    if (!tab) return;
    
    tab.innerHTML = this.currentAffirmation 
      ? this._renderFullScreen()
      : this._renderDashboard();
  }

  /**
   * Render dashboard view with daily affirmation flip card
   * @returns {string} Dashboard HTML
   */
  _renderDashboard() {
    return `
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <h2 class="text-4xl font-bold text-white" style="margin-bottom: 1.5rem;">Positive Affirmations</h2>
          <p class="text-gray-400" style="margin-bottom: 2rem;">Powerful statements to reprogram your mindset</p>

          <div class="text-center" style="margin-bottom: 3rem;">
            <!-- Daily Affirmation Flip Card -->
            <div class="flip-card inline-block w-80 h-48" style="margin-bottom: 2rem;" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front bg-gradient-to-br from-pink-600 to-purple-600 p-8 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-white text-2xl font-bold" style="margin-bottom: 1rem;">Daily Affirmation</p>
                    <p class="text-pink-100" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;">Tap to reveal <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg></p>
                  </div>
                </div>
                <div class="flip-card-back bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                  <p class="text-white text-xl font-semibold text-center">
                    "${this.getDailyAffirmation()}"
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Random Affirmation Button -->
            <div>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary text-lg" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Random Affirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render full-screen affirmation view
   * @returns {string} Full-screen HTML
   */
  _renderFullScreen() {
    return `
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center w-full max-w-2xl">
            
            <!-- Icon Circle -->
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto" style="margin-bottom: 2rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;color:white;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            </div>
            
            <!-- Affirmation Text -->
            <p class="text-white text-4xl font-bold" style="margin-bottom: 3rem;">
              "${this.currentAffirmation}"
            </p>
            
            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
              <button onclick="window.featuresManager.engines.affirmations.reset()" class="btn btn-secondary">
                ← Back
              </button>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Another One
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Export for module systems and expose globally for onclick handlers
if (typeof window !== 'undefined') {
  window.AffirmationsEngine = AffirmationsEngine;
}

export default AffirmationsEngine;