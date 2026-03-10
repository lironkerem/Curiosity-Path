// js/dashboardRenderer.js (PATCHED FOR BIG-APP INTEGRATION)
import { state, getNextLevelInfo } from '/Mini-Apps/ShadowAlchemyLab/js/core/state.js';
import { getCompanionVisual, getArchetypeIcon } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';

export function renderDashboard() {
  const main = document.getElementById('shadow-alchemy-main-content');
  if (!main) return;

  /* ---------- stats bar ---------- */
  const next = getNextLevelInfo(state.user.lightParticles);
  const statsBarHTML = `
    <div class="stats-bar">
      <div class="neuro-stat"><div class="stat-label">Your Shadow Companion</div><div class="stat-value">${getCompanionVisual(state.user.companionLevel)}</div></div>
      <div class="neuro-stat"><div class="stat-label">Level</div><div class="stat-value">${state.user.companionLevel}</div></div>
      <div class="neuro-stat"><div class="stat-label">Light-Particles</div><div class="stat-value">${state.user.lightParticles}</div></div>
      <div class="neuro-stat"><div class="stat-label">${next.isMaxLevel ? 'Max Level!' : `To Level ${next.nextLevel}`}</div><div class="stat-value" style="font-size:1rem">${next.isMaxLevel ? '✨' : `${next.needed} needed`}</div></div>
    </div>`;

  /* ---------- recent entries ---------- */
  const allEntries = [
    ...(window.DailyJourneyEngine?.getAllJourneys() || []).map(j => ({ ...j, type: 'journey' })),
    ...(state.journalEntries || []).map(j => ({ ...j, type: 'free' })),
    ...(state.triggers || []).map(t => {
      if (!t.id) t.id = `trigger-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return { ...t, type: 'trigger' };
    })
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentHTML = allEntries.length
    ? allEntries.slice(0, 5).map(entry => {
        if (entry.type === 'journey') return journeyRow(entry);
        if (entry.type === 'trigger') return triggerRow(entry);
        return dialogueRow(entry);
      }).join('')
    : '<p class="muted">No entries saved yet.</p>';

  /* ---------- cards ---------- */
  const engine = window.archetypesEngine;
  const hasActive = (engine.state.activeArchetypeId || engine.state.activeShadowId) && engine.state.progress > 0;
  const universal = engine.getUniversalArchetypes();
  const completedShadows = engine.getCompletedShadows();
  const allShadows = engine.getAllShadows();
  const shadowPct = allShadows.length ? Math.round((completedShadows.length / allShadows.length) * 100) : 0;

  main.innerHTML = `
    ${statsBarHTML}
    <div class="dashboard">
      ${shadowLabCard()}
      ${archetypeCard(universal, hasActive)}
      ${subShadowsCard(allShadows, completedShadows, shadowPct)}
      ${savedWorkCard(recentHTML)}
    </div>`;
}

/* ---------- card fragments ---------- */
function shadowLabCard() {
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:var(--spacing-lg)">
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="13" r="8"/><path d="M12 2v3"/><path d="m4.93 5.93 2.12 2.12"/><path d="M2 13h3"/><path d="m19.07 5.93-2.12 2.12"/><path d="M19 13h3"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Shadow Lab</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Your primary ritual for reflection and integration.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--spacing-lg);margin-top:var(--spacing-xl)">
        <button id="startNewJourney" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg><span>9-Step Shadow<br>Guided Process</span></button>
        <button id="openFreeJournal" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Shadow<br>Dialogue</span></button>
        <button id="openTriggerLog" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg><span>Trigger<br>Release</span></button>
      </div>
    </div>`;
}

function archetypeCard(universal, hasActive) {
  const engine = window.archetypesEngine;
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:var(--spacing-lg)">
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">The Six Archetypes Integration Studio</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Enter a personalized Shadow Alchemy journey.</p>
      </div>
      ${hasActive ? `
        <div style="background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm);margin-bottom:var(--spacing-md)">
          <strong>Active Journey:</strong> ${engine.state.activeArchetypeId || engine.state.activeShadowId} (${engine.state.progress}% complete)
          <button id="continue-last-session" class="btn btn-primary" style="width:100%;margin-top:var(--spacing-sm)">Continue Journey</button>
        </div>` : ''}
      <div class="archetype-grid">
        ${universal.map(a => `
          <div class="archetype-card" data-archetype-id="${a.id}">
            <div style="font-size:1.5rem;margin-bottom:0.25rem">${a.icon}</div>
            <div style="font-weight:600">${a.title}</div>
            <div style="font-size:0.8rem;color:var(--neuro-text-lighter);margin-top:0.25rem">${a.short}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function subShadowsCard(allShadows, completedShadows, shadowPct) {
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:var(--spacing-lg)">
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Sub-Shadows Lab</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Deep dive into 17 specific shadow patterns.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);margin:var(--spacing-lg) 0">
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="margin-bottom:var(--spacing-xs)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg></div><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">15-25 Minutes</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">Per session</div></div>
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="margin-bottom:var(--spacing-xs)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg></div><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">+5 Light-Particles</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">Per completion</div></div>
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="margin-bottom:var(--spacing-xs)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">17 Patterns</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">To explore</div></div>
      </div>
      <button id="open-sub-shadows-lab" class="btn btn-primary" style="width:100%;padding:var(--spacing-lg);font-size:1.1rem;font-weight:700;margin-top:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="13" r="8"/><path d="M12 2v3"/><path d="m4.93 5.93 2.12 2.12"/><path d="M2 13h3"/><path d="m19.07 5.93-2.12 2.12"/><path d="M19 13h3"/></svg> Explore All ${allShadows.length} Shadow Patterns</button>
    </div>`;
}

function savedWorkCard(recentHTML) {
  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" id="saved-work-header">
        <div style="text-align:center;flex:1">
          <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Your Saved Work</h3>
          <p style="color:var(--neuro-text-light);font-size:0.95rem;margin:0">Recent entries: Shadow Guided Process, Trigger Release, and Shadow Dialogue.</p>
        </div>
        <button class="btn" style="padding:8px 16px;margin-left:var(--spacing-md);flex-shrink:0" id="toggle-saved-work"><span id="saved-work-arrow">▼</span></button>
      </div>
      <div id="saved-work-content" style="display:none;margin-top:var(--spacing-md)">${recentHTML}</div>
    </div>`;
}

/* ---------- row helpers ---------- */
function journeyRow(j) {
  return `
    <div class="journal-entry" data-entry-id="${j.id}" data-entry-type="journey" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Shadow Guided Process: ${j.caseId}</strong> – ${new Date(j.date).toLocaleDateString()}</div>
        <div class="muted" style="font-size:0.9rem">${j.primaryEmotion || ''} | ${j.themes?.slice(0, 2).join(', ') || ''}</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button class="btn btn-small entry-view-btn" data-entry-id="${j.id}" data-entry-type="journey">View</button>
        <button class="btn btn-small entry-delete-btn" data-entry-id="${j.id}" data-entry-type="journey">Delete</button>
      </div>
    </div>`;
}

function triggerRow(t) {
  return `
    <div class="journal-entry" data-entry-id="${t.id}" data-entry-type="trigger" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Trigger Release</strong>${t.source ? `: ${t.source}` : ''} – ${new Date(t.date).toLocaleDateString()}</div>
        <div class="muted" style="font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.coreTrigger ? `${t.coreTrigger} → ` : ''}${t.emotion ? `${t.emotion} | ` : ''}Intensity: ${t.intensity}/10</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button class="btn btn-small entry-edit-btn" data-entry-id="${t.id}" data-entry-type="trigger">Edit</button>
        <button class="btn btn-small entry-delete-btn" data-entry-id="${t.id}" data-entry-type="trigger">Delete</button>
      </div>
    </div>`;
}

function dialogueRow(d) {
  return `
    <div class="journal-entry" data-entry-id="${d.id}" data-entry-type="free" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Shadow Dialogue${d.target ? `: ${d.target}` : ''}</strong> – ${new Date(d.date).toLocaleDateString()}</div>
        <div class="muted" style="font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.text.substring(0, 50)}...</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button class="btn btn-small entry-edit-btn" data-entry-id="${d.id}" data-entry-type="free">Edit</button>
        <button class="btn btn-small entry-delete-btn" data-entry-id="${d.id}" data-entry-type="free">Delete</button>
      </div>
    </div>`;
}