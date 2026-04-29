// ─── Critical Styles (blocking — above the fold only) ────────────────────────
import './styles/main-styles.css';

// ─── Mobile styles only on mobile ────────────────────────────────────────────
if (window.innerWidth <= 767) {
  import('./styles/mobile-styles.css');
}

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
    // Phase 1: Minimal boot — only what's needed to render auth screen
    const [
      aff,
      { QUOTES, getRandomQuote, getQuoteOfTheDay },
      Core,
      { default: UserTab }
    ] = await Promise.all([
      import('./Features/Data/AffirmationsList.js'),
      import('./Features/Data/QuotesList.js'),
      import('./Core/Index.js'),
      import('./Core/User-Tab.js')
    ]);

    window.affirmations = aff.default;
    window.QuotesData   = { QUOTES, getRandomQuote, getQuoteOfTheDay };

    // Phase 2: Boot app (auth check happens inside init())
    window.app = new Core.ProjectCuriosityApp({
      AppState:          Core.AppState,
      AuthManager:       Core.AuthManager,
      NavigationManager: Core.NavigationManager,
      DashboardManager:  Core.DashboardManager,
      UserTab
    });

    // Phase 3: Start the app (auth + data load)
    // All supporting modules (Toast, Modal, DB, Features, etc.) are imported
    // transitively by ProjectCuriosityApp and its dependencies — no need to
    // re-import them here. Vite bundles them into the correct chunks already.
    await window.app.init();

    // Phase 4: Non-critical skin + lazy features after app is interactive
    const loadIdle = () => {
      import('./styles/Skins/MatrixRain.js');
      import('./styles/user-tab-styles.css');
      import('./styles/community-hub.css');
      import('./Features/TarotVisionAI.js');
      import('./Mini-Apps/FlipTheScript/index.js');
      import('./Mini-Apps/ShadowAlchemyLab/shadowalchemy.js');
    };

    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(loadIdle, { timeout: 4000 });
    } else {
      setTimeout(loadIdle, 2000);
    }

  } catch (e) {
    console.error('[FATAL] Bootstrap failed:', e);
    document.body.innerHTML = '<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>';
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();