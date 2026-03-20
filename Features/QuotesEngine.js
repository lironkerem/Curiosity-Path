// ============================================
// QUOTES ENGINE - Professional & Optimized
// ============================================
// Manages inspirational quotes display with daily rotation
// Provides both featured daily quote and gallery view of all quotes

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Configuration constants — frozen
const CONFIG = Object.freeze({
  DEFAULT_QUOTES: Object.freeze([
    { text: 'The quieter you become, the more you are able to hear', author: 'Rumi' },
    { text: 'Be the change you wish to see in the world', author: 'Gandhi' },
    { text: 'Peace comes from within. Do not seek it without', author: 'Buddha' }
  ])
});

class QuotesEngine {
  /**
   * @param {Object} app - Main app instance
   */
  constructor(app) {
    this.app = app;
    this.quotes = CONFIG.DEFAULT_QUOTES;
  }

  // ── Quote Selection ────────────────────────────────────────────────────────

  getDailyQuote() {
    const dayOfYear = this._getDayOfYear();
    return this.quotes[dayOfYear % this.quotes.length];
  }

  _getDayOfYear() {
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  render() {
    const tab = document.getElementById('quotes-tab');
    if (!tab) return;

    const daily = this.getDailyQuote();

    tab.innerHTML = `
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-7xl mx-auto">

          <h2 class="text-4xl font-bold text-white" style="margin-bottom:1rem;">Wisdom &amp; Quotes</h2>
          <p class="text-gray-400" style="margin-bottom:2rem;">Inspiration from spiritual teachers</p>

          <!-- Featured Daily Quote -->
          <div class="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-12 text-center border border-purple-500/30" style="margin-bottom:3rem;">
            <p class="text-purple-200 text-sm uppercase tracking-wider" style="margin-bottom:1.5rem;">Quote of the Day</p>
            <p class="text-white text-4xl font-light italic" style="margin-bottom:2rem;">"${esc(daily.text)}"</p>
            <p class="text-purple-300 text-xl">- ${esc(daily.author)}</p>
          </div>

          <!-- All Quotes Gallery -->
          <h3 class="text-2xl font-bold text-white" style="margin-bottom:1.5rem;">All Quotes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${this._renderQuotesGrid()}
          </div>
        </div>
      </div>
    `;
  }

  _renderQuotesGrid() {
    return this.quotes.map(quote => `
      <div class="card">
        <p class="text-white text-lg italic" style="margin-bottom:1rem;">"${esc(quote.text)}"</p>
        <p class="text-purple-400">- ${esc(quote.author)}</p>
      </div>
    `).join('');
  }
}

export default QuotesEngine;
