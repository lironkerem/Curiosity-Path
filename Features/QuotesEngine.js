// ============================================
// QUOTES ENGINE - Professional & Optimized
// ============================================
// Manages inspirational quotes display with daily rotation
// Provides both featured daily quote and gallery view of all quotes

// Configuration constants
const CONFIG = {
  DEFAULT_QUOTES: [
    { text: "The quieter you become, the more you are able to hear", author: "Rumi" },
    { text: "Be the change you wish to see in the world", author: "Gandhi" },
    { text: "Peace comes from within. Do not seek it without", author: "Buddha" }
  ]
};

class QuotesEngine {
  /**
   * Initialize the Quotes Engine
   * @param {Object} app - Main app instance with utilities
   */
  constructor(app) {
    this.app = app;
    this.quotes = CONFIG.DEFAULT_QUOTES;
  }

  // ============================================
  // Quote Selection
  // ============================================

  /**
   * Get the daily quote (consistent throughout the day)
   * Uses day-of-year modulo to select from quotes array
   * @returns {Object} Quote object with {text, author}
   */
  getDailyQuote() {
    const dayOfYear = this._getDayOfYear();
    return this.quotes[dayOfYear % this.quotes.length];
  }

  /**
   * Calculate current day of year (1-365/366)
   * @returns {number} Day of year
   * @private
   */
  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ============================================
  // Render Methods
  // ============================================

  /**
   * Render the quotes tab with daily featured quote and full gallery
   */
  render() {
    const tab = document.getElementById('quotes-tab');
    if (!tab) return;

    const dailyQuote = this.getDailyQuote();

    tab.innerHTML = `
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <h2 class="text-4xl font-bold text-white" style="margin-bottom: 1rem;">Wisdom & Quotes</h2>
          <p class="text-gray-400" style="margin-bottom: 2rem;">Inspiration from spiritual teachers</p>

          <!-- Featured Daily Quote -->
          <div class="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-12 text-center border border-purple-500/30" style="margin-bottom: 3rem;">
            <p class="text-purple-200 text-sm uppercase tracking-wider" style="margin-bottom: 1.5rem;">Quote of the Day</p>
            <p class="text-white text-4xl font-light italic" style="margin-bottom: 2rem;">"${dailyQuote.text}"</p>
            <p class="text-purple-300 text-xl">— ${dailyQuote.author}</p>
          </div>

          <!-- All Quotes Gallery -->
          <h3 class="text-2xl font-bold text-white" style="margin-bottom: 1.5rem;">All Quotes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${this._renderQuotesGrid()}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render grid of all quotes
   * @returns {string} HTML for quotes grid
   * @private
   */
  _renderQuotesGrid() {
    return this.quotes.map(quote => `
      <div class="card">
        <p class="text-white text-lg italic" style="margin-bottom: 1rem;">"${quote.text}"</p>
        <p class="text-purple-400">— ${quote.author}</p>
      </div>
    `).join('');
  }
}

export default QuotesEngine;