/*  Mini-Apps/ShadowAlchemyLab/js/controller.js
    Patched: frozen LEVELS, renamed addTokens → addLightParticles (matching
    DailyJourneyEngine call), validated n parameter, parseInt radix 10. */

import { state, saveState, loadState } from '/src/Mini-Apps/ShadowAlchemyLab/js/src/Core/state.js';
import { renderDashboard } from '/src/Mini-Apps/ShadowAlchemyLab/js/dashboardRenderer.js';
import { attachDashboardListeners } from '/src/Mini-Apps/ShadowAlchemyLab/js/eventListeners.js';

const archetypesEngine = new ArchetypesEngine({   // global, loaded via <script>
  sessionId: `s_${Date.now()}`
});

window.AppController = Object.freeze({
  init,
  renderDashboard,
  addLightParticles   // renamed from addTokens — matches DailyJourneyEngine callsite
});

/* ---------- bootstrap ---------- */
async function init() {
  await archetypesEngine.ensureDataLoaded();
  loadState();
  renderDashboard();
  attachDashboardListeners();
}

/* ---------- shared helpers ---------- */
function addLightParticles(n = 1) {
  // Validate input
  const amount = Math.max(0, parseInt(String(n), 10) || 0);
  if (amount === 0) return;

  const prevLevel = state.user.companionLevel;
  state.user.lightParticles = Math.max(0, (state.user.lightParticles || 0) + amount);
  state.user.companionLevel = getCurrentLevel(state.user.lightParticles);

  if (state.user.companionLevel > prevLevel) {
    import('/src/Mini-Apps/ShadowAlchemyLab/js/src/Core/utils.js').then(u =>
      u.showToast(`Your Shadow Companion evolved to Level ${state.user.companionLevel}! ${u.getCompanionVisual(state.user.companionLevel)}`)
    );
  }
  saveState();
  renderDashboard();
}

/* ---------- level helper (frozen) ---------- */
const LEVELS = Object.freeze([
  Object.freeze({ level: 1, min: 0,   max: 49   }),
  Object.freeze({ level: 2, min: 50,  max: 109  }),
  Object.freeze({ level: 3, min: 110, max: 199  }),
  Object.freeze({ level: 4, min: 200, max: 299  }),
  Object.freeze({ level: 5, min: 300, max: 500  }),
  Object.freeze({ level: 6, min: 501, max: Infinity })
]);

function getCurrentLevel(lp) {
  const n = Math.max(0, parseInt(String(lp), 10) || 0);
  for (const L of LEVELS) if (n >= L.min && n <= L.max) return L.level;
  return 6;
}

/* ---------- auto-boot (disabled when Big-App present) ---------- */
if (!window.app) {
  document.addEventListener('DOMContentLoaded', init);
}

window.archetypesEngine = archetypesEngine;
