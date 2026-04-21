// ─── Styles (critical path) ───────────────────────────────────────────────────
import './styles/main-styles.css';
import './styles/mobile-styles.css';
import './styles/user-tab-styles.css';
import './styles/community-hub.css';

// ─── Skins (bundled by Vite, served as text/css — no MIME issues) ─────────────
import champagneGold from './styles/Skins/champagne-gold.css?inline';
import royalIndigo   from './styles/Skins/royal-indigo.css?inline';
import earthLuxury   from './styles/Skins/earth-luxury.css?inline';
import matrixCode    from './styles/Skins/matrix-code.css?inline';
import darkMode      from './styles/dark-mode.css?inline';

const SKINS = {
  'champagne-gold': champagneGold,
  'royal-indigo':   royalIndigo,
  'earth-luxury':   earthLuxury,
  'matrix-code':    matrixCode,
};

const SKIN_STYLE_ID      = 'dynamic-skin-style';
const DARK_MODE_STYLE_ID = 'dynamic-dark-mode-style';

/** Load/replace a premium skin (never touches dark-mode layer) */
window.loadSkin = (name) => {
  // Legacy callers sometimes pass 'dark-mode' — redirect correctly
  if (name === 'dark-mode') { window.loadDarkSkin(); return; }

  document.getElementById(SKIN_STYLE_ID)?.remove();
  const css = SKINS[name];
  if (!css) return;
  const s = document.createElement('style');
  s.id = SKIN_STYLE_ID;
  s.textContent = css;
  document.head.appendChild(s);
};

/** Remove premium skin only */
window.removeSkin = () => document.getElementById(SKIN_STYLE_ID)?.remove();

/**
 * Load the standalone dark-mode.css overlay.
 * Only used when NO premium skin is active (default theme + dark mode).
 */
window.loadDarkSkin = () => {
  if (document.getElementById(DARK_MODE_STYLE_ID)) return; // already loaded
  const s = document.createElement('style');
  s.id = DARK_MODE_STYLE_ID;
  s.textContent = darkMode;
  document.head.appendChild(s);
};

/** Remove the standalone dark-mode overlay */
window.removeDarkSkin = () => document.getElementById(DARK_MODE_STYLE_ID)?.remove();

// ─── Skin / Matrix ───────────────────────────────────────────────────────────
import './styles/Skins/MatrixRain.js';

// ─── Core (always needed at boot) ────────────────────────────────────────────
import './Core/Utils.js';
import './Core/GamificationEngine.js';
import './Core/Features.js';
import './Core/Modal.js';
import './Core/Modal-Compat.js';
import './Core/Toast.js';
import './Core/CTA.js';
import './Core/DB.js';
import './Core/avatar-icons.js';

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

    window.app = new Core.ProjectCuriosityApp({
      AppState:          Core.AppState,
      AuthManager:       Core.AuthManager,
      NavigationManager: Core.NavigationManager,
      DashboardManager:  Core.DashboardManager,
      UserTab
    });

    window.app.init();

  } catch (e) {
    console.error('[FATAL] Bootstrap failed:', e);
    document.body.innerHTML = '<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>';
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();