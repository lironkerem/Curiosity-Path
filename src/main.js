/**
 * src/main.js — Application Entry Point
 *
 * Single source of truth for app initialization.
 * Imports styles, bootstraps core modules, and starts the app.
 */

// ─── Styles ──────────────────────────────────────────────────────────────────
import './styles/main-styles.css';
import './styles/mobile-styles.css';
import './styles/community-hub.css';

// ─── Service Worker ───────────────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
      .catch(err => console.error('[SW] Registration failed:', err));
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function init() {
  try {
    const [aff, { QUOTES, getRandomQuote, getQuoteOfTheDay }] = await Promise.all([
      import('./Features/Data/AffirmationsList.js'),
      import('./Features/Data/QuotesList.js')
    ]);

    window.affirmations = aff.default;
    window.QuotesData   = { QUOTES, getRandomQuote, getQuoteOfTheDay };

    const Core                 = await import('./Core/Index.js');
    const { default: UserTab } = await import('./Core/User-Tab.js');

    window.app = new Core.ProjectCuriosityApp({
      AppState: