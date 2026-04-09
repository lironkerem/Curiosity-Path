// ─── Styles ──────────────────────────────────────────────────────────────────
import './styles/main-styles.css';
import './styles/mobile-styles.css';
import './styles/community-hub.css';
import './styles/user-tab-styles.css';

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

// ─── Features ────────────────────────────────────────────────────────────────
import './Features/TarotEngine.js';
import './Features/TarotVisionAI.js';
import './Features/KarmaShopEngine.js';
import './Features/EnergyTracker.js';
import './Features/WellnessKit.js';
import './Features/AffirmationsEngine.js';
import './Features/ChatBotAI.js';
import './Features/DailyCards.js';
import './Features/GratitudeEngine.js';
import './Features/HappinessEngine.js';
import './Features/InquiryEngine.js';
import './Features/JournalEngine.js';
import './Features/MeditationsEngine.js';
import './Features/QuotesEngine.js';

// ─── Mini-Apps ───────────────────────────────────────────────────────────────
import './Mini-Apps/FlipTheScript/index.js';
import './Mini-Apps/ShadowAlchemyLab/shadowalchemy.js';

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