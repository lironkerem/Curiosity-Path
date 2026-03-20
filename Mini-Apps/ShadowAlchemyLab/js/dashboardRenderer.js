// Mini-Apps/ShadowAlchemyLab/js/dashboardRenderer.js
// Patched: esc() on all dynamic values in HTML strings, type=button on buttons,
// crypto uid for trigger IDs, aria-label on icon buttons.

import { state, getNextLevelInfo } from '/Mini-Apps/ShadowAlchemyLab/js/core/state.js';
import { getCompanionVisual, getArchetypeIcon } from '/Mini-Apps/ShadowAlchemyLab/js/core/utils.js';

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Crypto-safe UID for trigger IDs
function uid(prefix = '') {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    return prefix + Date.now().toString(36) + '-' + arr[0].toString(36) + arr[1].toString(36);
  }
  return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

export function renderDashboard() {
  const main = document.getElementById('shadow-alchemy-main-content');
  if (!main) return;

  /* ---------- stats bar ---------- */
  const next = getNextLevelInfo(state.user.lightParticles);
  const statsBarHTML = `
    <div class="stats-bar">
      <div class="neuro-stat"><div class="stat-label">Your Shadow Companion</div><div class="stat-value">${esc(getCompanionVisual(state.user.companionLevel))}</div></div>
      <div class="neuro-stat"><div class="stat-label">Level</div><div class="stat-value">${esc(String(state.user.companionLevel))}</div></div>
      <div class="neuro-stat"><div class="stat-label">Light-Particles</div><div class="stat-value">${esc(String(state.user.lightParticles))}</div></div>
      <div class="neuro-stat"><div class="stat-label">${next.isMaxLevel ? 'Max Level!' : esc(`To Level ${next.nextLevel}`)}</div><div class="stat-value" style="font-size:1rem">${next.isMaxLevel ? '\u2728' : esc(`${next.needed} needed`)}</div></div>
    </div>`;

  /* ---------- recent entries ---------- */
  const allEntries = [
    ...(window.DailyJourneyEngine?.getAllJourneys() || []).map(j => ({ ...j, type: 'journey' })),
    ...(state.journalEntries || []).map(j => ({ ...j, type: 'free' })),
    ...(state.triggers || []).map(t => {
      // Assign a safe ID if missing
      if (!t.id) t.id = uid('trigger-');
      return { ...t, type: 'trigger' };
    })
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const recentHTML = allEntries.length
    ? allEntries.slice(0, 5).map(entry => {
        if (entry.type === 'journey')  return journeyRow(entry);
        if (entry.type === 'trigger')  return triggerRow(entry);
        return dialogueRow(entry);
      }).join('')
    : '<p class="muted">No entries saved yet.</p>';

  /* ---------- cards ---------- */
  const engine          = window.archetypesEngine;
  const hasActive       = (engine.state.activeArchetypeId || engine.state.activeShadowId) && engine.state.progress > 0;
  const universal       = engine.getUniversalArchetypes();
  const completedShadows= engine.getCompletedShadows();
  const allShadows      = engine.getAllShadows();
  const shadowPct       = allShadows.length ? Math.round((completedShadows.length / allShadows.length) * 100) : 0;

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
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Shadow Lab</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Your primary ritual for reflection and integration.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--spacing-lg);margin-top:var(--spacing-xl)">
        <button type="button" id="startNewJourney" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4" aria-label="Start 9-Step Shadow Guided Process"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg><span>9-Step Shadow<br>Guided Process</span></button>
        <button type="button" id="openFreeJournal" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4" aria-label="Open Shadow Dialogue"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>Shadow<br>Dialogue</span></button>
        <button type="button" id="openTriggerLog" class="btn" style="padding:var(--spacing-xl);font-size:1.1rem;font-weight:700;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--spacing-sm);text-align:center;line-height:1.4" aria-label="Open Trigger Release"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg><span>Trigger<br>Release</span></button>
      </div>
    </div>`;
}

function archetypeCard(universal, hasActive) {
  const engine = window.archetypesEngine;
  const activeId = esc(engine.state.activeArchetypeId || engine.state.activeShadowId || '');
  const progress  = esc(String(engine.state.progress || 0));
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:var(--spacing-lg)">
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">The Six Archetypes Integration Studio</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Enter a personalized Shadow Alchemy journey.</p>
      </div>
      ${hasActive ? `
        <div style="background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm);margin-bottom:var(--spacing-md)">
          <strong>Active Journey:</strong> ${activeId} (${progress}% complete)
          <button type="button" id="continue-last-session" class="btn btn-primary" style="width:100%;margin-top:var(--spacing-sm)">Continue Journey</button>
        </div>` : ''}
      <div class="archetype-grid">
        ${universal.map(a => `
          <div class="archetype-card" data-archetype-id="${esc(a.id)}" role="button" tabindex="0" aria-label="${esc(a.title)}">
            <div style="font-size:1.5rem;margin-bottom:0.25rem" aria-hidden="true">${esc(a.icon)}</div>
            <div style="font-weight:600">${esc(a.title)}</div>
            <div style="font-size:0.8rem;color:var(--neuro-text-lighter);margin-top:0.25rem">${esc(a.short)}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function subShadowsCard(allShadows, completedShadows, shadowPct) {
  return `
    <div class="card">
      <div style="text-align:center;margin-bottom:var(--spacing-lg)">
        <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg></div>
        <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Sub-Shadows Lab</h3>
        <p style="color:var(--neuro-text-light);font-size:0.95rem;max-width:500px;margin:0 auto">Deep dive into ${esc(String(allShadows.length))} specific shadow patterns.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--spacing-md);margin:var(--spacing-lg) 0">
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">15-25 Minutes</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">Per session</div></div>
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">+5 Light-Particles</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">Per completion</div></div>
        <div style="text-align:center;padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)"><div style="font-weight:600;font-size:0.9rem;margin-bottom:2px">${esc(String(allShadows.length))} Patterns</div><div style="font-size:0.8rem;color:var(--neuro-text-light)">To explore</div></div>
      </div>
      <button type="button" id="open-sub-shadows-lab" class="btn btn-primary" style="width:100%;padding:var(--spacing-lg);font-size:1.1rem;font-weight:700;margin-top:var(--spacing-sm);display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        Explore All ${esc(String(allShadows.length))} Shadow Patterns
      </button>
    </div>`;
}

function savedWorkCard(recentHTML) {
  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer" id="saved-work-header">
        <div style="text-align:center;flex:1">
          <div style="margin-bottom:var(--spacing-sm)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <h3 style="margin:0 0 var(--spacing-xs) 0;display:flex;align-items:center;justify-content:center;gap:0.5rem;">Your Saved Work</h3>
          <p style="color:var(--neuro-text-light);font-size:0.95rem;margin:0">Recent entries: Shadow Guided Process, Trigger Release, and Shadow Dialogue.</p>
        </div>
        <button type="button" class="btn" style="padding:8px 16px;margin-left:var(--spacing-md);flex-shrink:0" id="toggle-saved-work" aria-expanded="false" aria-controls="saved-work-content"><span id="saved-work-arrow" aria-hidden="true">\u25BC</span></button>
      </div>
      <div id="saved-work-content" style="display:none;margin-top:var(--spacing-md)" aria-live="polite">${recentHTML}</div>
    </div>`;
}

/* ---------- row helpers ---------- */
function journeyRow(j) {
  const dateStr  = new Date(j.date).toLocaleDateString();
  const emotion  = esc(j.primaryEmotion || '');
  const themes   = esc((j.themes || []).slice(0, 2).join(', '));
  return `
    <div class="journal-entry" data-entry-id="${esc(j.id)}" data-entry-type="journey" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Shadow Guided Process: ${esc(j.caseId)}</strong> \u2013 ${esc(dateStr)}</div>
        <div class="muted" style="font-size:0.9rem">${emotion}${emotion && themes ? ' | ' : ''}${themes}</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button type="button" class="btn btn-small entry-view-btn" data-entry-id="${esc(j.id)}" data-entry-type="journey" aria-label="View this journey">View</button>
        <button type="button" class="btn btn-small entry-delete-btn" data-entry-id="${esc(j.id)}" data-entry-type="journey" aria-label="Delete this journey">Delete</button>
      </div>
    </div>`;
}

function triggerRow(t) {
  const dateStr    = new Date(t.date).toLocaleDateString();
  const source     = t.source ? `: ${esc(t.source)}` : '';
  const coreTrigger= t.coreTrigger ? `${esc(t.coreTrigger)} \u2192 ` : '';
  const emotion    = t.emotion ? `${esc(t.emotion)} | ` : '';
  const intensity  = esc(String(t.intensity || 0));
  return `
    <div class="journal-entry" data-entry-id="${esc(t.id)}" data-entry-type="trigger" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Trigger Release${source}</strong> \u2013 ${esc(dateStr)}</div>
        <div class="muted" style="font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${coreTrigger}${emotion}Intensity: ${intensity}/10</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button type="button" class="btn btn-small entry-edit-btn" data-entry-id="${esc(t.id)}" data-entry-type="trigger" aria-label="Edit this trigger release">Edit</button>
        <button type="button" class="btn btn-small entry-delete-btn" data-entry-id="${esc(t.id)}" data-entry-type="trigger" aria-label="Delete this trigger release">Delete</button>
      </div>
    </div>`;
}

function dialogueRow(d) {
  const dateStr = new Date(d.date).toLocaleDateString();
  const target  = d.target ? `: ${esc(d.target)}` : '';
  const preview = esc((d.text || '').substring(0, 50));
  return `
    <div class="journal-entry" data-entry-id="${esc(d.id)}" data-entry-type="free" style="display:flex;justify-content:space-between;align-items:center;gap:var(--spacing-md)">
      <div style="flex:1;cursor:pointer;min-width:0" class="entry-content">
        <div><strong>Shadow Dialogue${target}</strong> \u2013 ${esc(dateStr)}</div>
        <div class="muted" style="font-size:0.9rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${preview}...</div>
      </div>
      <div class="entry-actions" style="display:flex;gap:var(--spacing-xs);flex-shrink:0">
        <button type="button" class="btn btn-small entry-edit-btn" data-entry-id="${esc(d.id)}" data-entry-type="free" aria-label="Edit this shadow dialogue">Edit</button>
        <button type="button" class="btn btn-small entry-delete-btn" data-entry-id="${esc(d.id)}" data-entry-type="free" aria-label="Delete this shadow dialogue">Delete</button>
      </div>
    </div>`;
}
