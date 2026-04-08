// Mini-Apps/ShadowAlchemyLab/js/src/Core/state.js

export const STORAGE_KEY = 'shadowAlchemyAppData';

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
};

export let state = {
  user: { name: 'User', lightParticles: 0, companionLevel: 1 },
  triggers: [],
  journalEntries: []
};

export function saveState() {
  ls.set(STORAGE_KEY, JSON.stringify(state));
}

export function loadState() {
  const raw = ls.get(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);

    // Migration: old tokens → lightParticles
    if (parsed.user?.tokens != null && parsed.user.lightParticles == null) {
      parsed.user.lightParticles = parsed.user.tokens;
      delete parsed.user.tokens;
    }
    // Ensure field exists and is a valid non-negative integer
    if (parsed.user?.lightParticles == null || !Number.isFinite(parsed.user.lightParticles)) {
      parsed.user.lightParticles = 0;
    }
    parsed.user.lightParticles = Math.max(0, Math.floor(parsed.user.lightParticles));

    // Recalculate level from persisted particles
    parsed.user.companionLevel = getCurrentLevel(parsed.user.lightParticles);

    state = Object.assign(state, parsed);
  } catch (e) {
    console.warn('[state] failed to load', e);
  }
}

/* ---------- level helpers ---------- */
const LEVELS = Object.freeze([
  Object.freeze({ level: 1, min: 0,   max: 49   }),
  Object.freeze({ level: 2, min: 50,  max: 109  }),
  Object.freeze({ level: 3, min: 110, max: 199  }),
  Object.freeze({ level: 4, min: 200, max: 299  }),
  Object.freeze({ level: 5, min: 300, max: 500  }),
  Object.freeze({ level: 6, min: 501, max: Infinity })
]);

export function getCurrentLevel(lp) {
  const n = Number.isFinite(lp) ? Math.max(0, lp) : 0;
  for (const L of LEVELS) if (n >= L.min && n <= L.max) return L.level;
  return 6;
}

export function getNextLevelInfo(lp) {
  const cur = getCurrentLevel(lp);
  if (cur >= 6) return { nextLevel: 6, needed: 0, current: lp, isMaxLevel: true };
  const next = LEVELS[cur]; // cur is 1-indexed; LEVELS[cur] = next level entry
  return { nextLevel: cur + 1, needed: next.min - lp, current: lp, isMaxLevel: false };
}
