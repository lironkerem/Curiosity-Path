// ─── Styles ───────────────────────────────────────────────────────────────────
import './styles/main-styles.css';
import './styles/user-tab-styles.css';
import './styles/community-hub.css';

// ─── Mobile styles only on mobile, desktop skips parsing them ────────────
if (window.innerWidth <= 767) {
  import('./styles/mobile-styles.css');
}

// ─── Core shared modules ──────────────────────────────────────────────────────
import './Core/member-profile-modal.js'; // sets window.MemberProfileModal
import './Core/active-members.js';       // sets window.ActiveMembers shim

// ─── Skin / Matrix ───────────────────────────────────────────────────────────
import './styles/Skins/MatrixRain.js';

// ─── Core ────────────────────────────────────────────────────────────────────
import './Core/Utils.js';
import './Core/GamificationEngine.js';
import './Core/Features.js';
import './Core/Modal.js';
import './Core/Modal-Compat.js';
import './Core/Toast.js';
import './Core/CTA.js';
import './Core/DB.js';
import './Core/avatar-icons.js';

// ─── Features needed before first paint ──────────────────────────────────────
import './Features/DailyCards.js';
import './Features/WellnessKit.js';

// ─── Deferred — not in Features.js registry ──────────────────────────────────
const lazyFeatures = () => import('./Features/TarotVisionAI.js');

// ─── Mini-Apps (deferred) ─────────────────────────────────────────────────────
const lazyMiniApps = () => Promise.all([
  import('./Mini-Apps/FlipTheScript/index.js'),
  import('./Mini-Apps/ShadowAlchemyLab/shadowalchemy.js'),
]);

// ─── Community Hub (on-demand — heaviest chunk) ───────────────────────────────
let communityHubLoaded = false;
window.lazyLoadCommunityHub = async function () {
  if (communityHubLoaded) return;
  communityHubLoaded = true;
  await import('./Mini-Apps/CommunityHub/CommunityHubEngine.js');
};

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

    // Load non-critical features after app is interactive
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => { lazyFeatures(); lazyMiniApps(); }, { timeout: 3000 });
    } else {
      setTimeout(() => { lazyFeatures(); lazyMiniApps(); }, 1500);
    }

  } catch (e) {
    console.error('[FATAL] Bootstrap failed:', e);
    document.body.innerHTML = '<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>';
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();