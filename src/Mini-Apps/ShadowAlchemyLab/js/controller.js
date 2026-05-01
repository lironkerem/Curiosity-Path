/* Mini-Apps/ShadowAlchemyLab/js/controller.js */

import { state, saveState, loadState, getCurrentLevel } from '/src/Mini-Apps/ShadowAlchemyLab/js/core/state.js';
import { renderDashboard } from '/src/Mini-Apps/ShadowAlchemyLab/js/dashboardRenderer.js';
import { attachDashboardListeners } from '/src/Mini-Apps/ShadowAlchemyLab/js/eventListeners.js';

const archetypesEngine = new ArchetypesEngine({ sessionId: `s_${Date.now()}` }); // global, loaded via <script>

window.AppController = Object.freeze({
  init,
  renderDashboard,
  addLightParticles
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
  const amount = Math.max(0, parseInt(String(n), 10) || 0);
  if (amount === 0) return;

  const prevLevel = state.user.companionLevel;
  state.user.lightParticles  = Math.max(0, (state.user.lightParticles || 0) + amount);
  // FIXED: reuse exported getCurrentLevel — removed duplicate LEVELS + local fn
  state.user.companionLevel  = getCurrentLevel(state.user.lightParticles);

  if (state.user.companionLevel > prevLevel) {
    import('/src/Mini-Apps/ShadowAlchemyLab/js/core/utils.js').then(u =>
      u.showToast(`Your Shadow Companion evolved to Level ${state.user.companionLevel}! ${u.getCompanionVisual(state.user.companionLevel)}`)
    );
  }
  saveState();
  renderDashboard();
}

/* ---------- auto-boot (disabled when Big-App present) ---------- */
if (!window.app) {
  document.addEventListener('DOMContentLoaded', init);
}

window.archetypesEngine = archetypesEngine;