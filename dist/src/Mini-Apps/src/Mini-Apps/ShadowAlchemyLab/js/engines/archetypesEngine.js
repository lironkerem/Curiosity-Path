/*
 * Mini-Apps/ShadowAlchemyLab/js/engines/archetypesEngine.js
 * Patched: ls wrapper, frozen constants, crypto-based session ID,
 * validated numeric fields, safe deepClone, parseInt radix 10.
 */

const STORAGE_KEY = 'archetypes_engine_v2';
const DATA_URL    = '/src/Mini-Apps/ShadowAlchemyLab/js/engines/archetypes_data.json';

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }  catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }      catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }      catch { /* noop */  } }
};

function nowISO() { return new Date().toISOString(); }

function deepClone(obj) {
  // Guard against non-serializable values
  try { return JSON.parse(JSON.stringify(obj)); }
  catch { return obj; }
}

// Crypto-based session ID with fallback
function newSessionId() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint32Array(2);
    crypto.getRandomValues(arr);
    return 's_' + arr[0].toString(36) + arr[1].toString(36);
  }
  return 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

class ArchetypesEngine {
  constructor(opts = {}) {
    this.universal   = {};
    this.shadows     = {};
    this.dataLoaded  = false;
    this.loadPromise = null;

    this.state = {
      createdAt:            nowISO(),
      lastUpdated:          nowISO(),
      activeArchetypeId:    null,
      activeShadowId:       null,
      selectedStepIndex:    0,
      answers:              {},
      progress:             0,
      xp:                   0,
      sessionId:            opts.sessionId || newSessionId(),
      completedArchetypes:  [],
      completedShadows:     []
    };

    this.loadUserState();
    this.loadPromise = this.loadArchetypeData();
  }

  // ========== DATA LOADING ==========
  async loadArchetypeData() {
    try {
      if (window.ARCHETYPES_DATA) {
        this.universal  = deepClone(window.ARCHETYPES_DATA.universalArchetypes);
        this.shadows    = deepClone(window.ARCHETYPES_DATA.shadowArchetypes);
        this.dataLoaded = true;
        return;
      }

      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error(`Failed to load archetype data: ${response.status}`);

      const data = await response.json();
      this.universal  = deepClone(data.universalArchetypes);
      this.shadows    = deepClone(data.shadowArchetypes);
      this.dataLoaded = true;

    } catch (e) {
      console.error('[ArchetypesEngine] Failed to load archetype data:', e);
      this.universal  = {};
      this.shadows    = {};
      this.dataLoaded = true;
    }
  }

  async ensureDataLoaded() {
    if (this.dataLoaded) return;
    await this.loadPromise;
  }

  // ========== PERSISTENCE ==========
  saveUserState() {
    this.state.lastUpdated = nowISO();
    ls.set(STORAGE_KEY, JSON.stringify(this.state));
  }

  loadUserState() {
    const raw = ls.get(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // Validate numeric fields before merging
      if (parsed.xp !== undefined) {
        parsed.xp = Math.max(0, Math.min(9999, parseInt(String(parsed.xp), 10) || 0));
      }
      if (parsed.progress !== undefined) {
        parsed.progress = Math.max(0, Math.min(100, parseInt(String(parsed.progress), 10) || 0));
      }
      if (parsed.selectedStepIndex !== undefined) {
        parsed.selectedStepIndex = Math.max(0, parseInt(String(parsed.selectedStepIndex), 10) || 0);
      }
      this.state = Object.assign(this.state, parsed);
    } catch (e) {
      console.warn('[ArchetypesEngine] Failed to load state', e);
    }
  }

  clearUserState() {
    ls.remove(STORAGE_KEY);
    this.state = {
      createdAt:           nowISO(),
      lastUpdated:         nowISO(),
      activeArchetypeId:   null,
      activeShadowId:      null,
      selectedStepIndex:   0,
      answers:             {},
      progress:            0,
      xp:                  0,
      sessionId:           newSessionId(),
      completedArchetypes: [],
      completedShadows:    []
    };
    this.saveUserState();
  }

  // ========== UNIVERSAL ARCHETYPE METHODS ==========
  getUniversalArchetypes() {
    return Object.values(this.universal).map(a => ({
      id:    a.id,
      title: a.title,
      icon:  a.icon,
      short: a.short
    }));
  }

  setActiveArchetype(archetypeId) {
    const archetype = this.universal[archetypeId];
    if (!archetype) return null;
    this.state.activeArchetypeId  = archetypeId;
    this.state.activeShadowId     = null;
    this.state.selectedStepIndex  = 0;
    this.state.answers            = {};
    this.state.progress           = 0;
    this.saveUserState();
    return deepClone(archetype);
  }

  getActiveJourney() {
    if (this.state.activeShadowId)    return this.shadows[this.state.activeShadowId]   || null;
    if (this.state.activeArchetypeId) return this.universal[this.state.activeArchetypeId] || null;
    return null;
  }

  // ========== SHADOW-SPECIFIC METHODS ==========
  getShadowsByArchetype(archetypeId) {
    return Object.values(this.shadows).filter(s => s.parent === archetypeId);
  }

  getAllShadows() {
    return Object.values(this.shadows);
  }

  setActiveShadow(shadowId) {
    const shadow = this.shadows[shadowId];
    if (!shadow) return null;
    this.state.activeShadowId     = shadowId;
    this.state.activeArchetypeId  = null;
    this.state.selectedStepIndex  = 0;
    this.state.answers            = {};
    this.state.progress           = 0;
    this.saveUserState();
    return deepClone(shadow);
  }

  // ========== STEP NAVIGATION ==========
  getStep(indexOrId) {
    const journey = this.getActiveJourney();
    if (!journey) return null;
    if (typeof indexOrId === 'number') {
      return journey.steps[indexOrId] ? deepClone(journey.steps[indexOrId]) : null;
    }
    const step = journey.steps.find(s => s.id === indexOrId);
    return step ? deepClone(step) : null;
  }

  nextStep() {
    const journey = this.getActiveJourney();
    if (!journey) return null;
    if (this.state.selectedStepIndex < journey.steps.length - 1) {
      this.state.selectedStepIndex += 1;
    }
    this.saveUserState();
    return this.getStep(this.state.selectedStepIndex);
  }

  previousStep() {
    if (this.state.selectedStepIndex > 0) this.state.selectedStepIndex -= 1;
    this.saveUserState();
    return this.getStep(this.state.selectedStepIndex);
  }

  // ========== RESPONSE SUBMISSION ==========
  submitUserResponse(stepId, data) {
    this.state.answers[stepId] = data;

    const journey = this.getActiveJourney();
    if (!journey) return this.state;

    const answeredCount = Object.keys(this.state.answers).length;
    this.state.xp       = Math.min(9999, answeredCount * 10);

    const totalSteps    = journey.steps.length;
    this.state.progress = totalSteps > 0
      ? Math.round((answeredCount / totalSteps) * 100)
      : 0;

    this.state.lastUpdated = nowISO();
    this.saveUserState();
    return deepClone(this.state);
  }

  // ========== COMPLETION ==========
  generateIntegrationSummary() {
    const journey = this.getActiveJourney();
    if (!journey) return null;
    const isUniversal = this.state.activeArchetypeId !== null;
    return {
      completionMessage:    journey.completionMessage,
      recommendedPractice:  journey.recommendedPractice,
      journeyType:          isUniversal ? 'universal' : 'shadow',
      journeyId:            isUniversal ? this.state.activeArchetypeId : this.state.activeShadowId,
      journeyTitle:         journey.title,
      answersGiven:         Object.keys(this.state.answers).length,
      totalSteps:           journey.steps.length,
      xpEarned:             this.state.xp
    };
  }

  completeJourney() {
    const journey = this.getActiveJourney();
    if (!journey) return null;
    const summary = this.generateIntegrationSummary();
    if (this.state.activeArchetypeId && !this.state.completedArchetypes.includes(this.state.activeArchetypeId)) {
      this.state.completedArchetypes.push(this.state.activeArchetypeId);
    }
    if (this.state.activeShadowId && !this.state.completedShadows.includes(this.state.activeShadowId)) {
      this.state.completedShadows.push(this.state.activeShadowId);
    }
    this.saveUserState();
    return summary;
  }

  // ========== PROGRESS TRACKING ==========
  getCompletedArchetypes() { return this.state.completedArchetypes || []; }
  getCompletedShadows()    { return this.state.completedShadows    || []; }

  getOverallProgress() {
    const totalUniversal = Object.keys(this.universal).length;
    const totalShadows   = Object.keys(this.shadows).length;
    const totalJourneys  = totalUniversal + totalShadows;
    const completed      = (this.state.completedArchetypes?.length || 0) +
                           (this.state.completedShadows?.length    || 0);
    return {
      completed,
      total:      totalJourneys,
      percentage: totalJourneys > 0 ? Math.round((completed / totalJourneys) * 100) : 0
    };
  }

  // ========== UTILITY ==========
  getUserState()     { return deepClone(this.state); }

  exportUserNotes() {
    const journey = this.getActiveJourney();
    return JSON.stringify({
      state:        this.state,
      activeJourney:journey,
      summary:      this.generateIntegrationSummary()
    }, null, 2);
  }
}

window.ArchetypesEngine = ArchetypesEngine;
