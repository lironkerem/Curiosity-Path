/**
 * Features.js - Feature Registry and Manager
 * All engines are lazy-loaded on first init() call — nothing executes at boot.
 */

// ─── Feature ID constants ─────────────────────────────────────────────────────

export const FEATURE_IDS = Object.freeze({
  MEDITATIONS:    'meditations',
  TAROT:          'tarot',
  ENERGY:         'energy',
  HAPPINESS:      'happiness',
  GRATITUDE:      'gratitude',
  QUOTES:         'quotes',
  AFFIRMATIONS:   'affirmations',
  PROGRESS:       'progress',
  FLIP_SCRIPT:    'flip-script',
  JOURNAL:        'journal',
  SHADOW_ALCHEMY: 'shadow-alchemy',
  KARMA_SHOP:     'karma-shop',
  CHATBOT:        'chatbot',
  COMMUNITY_HUB:  'community-hub',
  CALCULATOR:     'calculator'
});

// ─── Lazy factory map ─────────────────────────────────────────────────────────
// Each value is a () => import(...) — module code runs only when first called.

const FEATURE_LOADERS = Object.freeze({
  [FEATURE_IDS.MEDITATIONS]:    () => import('../Features/MeditationsEngine.js').then(m => m.default),
  [FEATURE_IDS.TAROT]:          () => import('../Features/TarotEngine.js').then(m => m.default),
  [FEATURE_IDS.ENERGY]:         () => import('../Features/EnergyTracker.js').then(m => m.default),
  [FEATURE_IDS.HAPPINESS]:      () => import('../Features/HappinessEngine.js').then(m => m.default),
  [FEATURE_IDS.GRATITUDE]:      () => import('../Features/GratitudeEngine.js').then(m => m.default),
  [FEATURE_IDS.QUOTES]:         () => import('../Features/QuotesEngine.js').then(m => m.default),
  [FEATURE_IDS.AFFIRMATIONS]:   () => import('../Features/AffirmationsEngine.js').then(m => m.default),
  [FEATURE_IDS.PROGRESS]:       () => import('./GamificationEngine.js').then(m => m.GamificationEngine ?? m.default),
  [FEATURE_IDS.FLIP_SCRIPT]:    () => import('../Mini-Apps/FlipTheScript/index.js').then(m => m.default),
  [FEATURE_IDS.JOURNAL]:        () => import('../Features/JournalEngine.js').then(m => m.default),
  [FEATURE_IDS.SHADOW_ALCHEMY]: () => import('../Mini-Apps/ShadowAlchemyLab/shadowalchemy.js').then(m => m.default),
  [FEATURE_IDS.KARMA_SHOP]:     () => import('../Features/KarmaShopEngine.js').then(m => m.default),
  [FEATURE_IDS.CHATBOT]:        () => import('../Features/ChatBotAI.js').then(m => m.ChatBotAI ?? m.default),
  [FEATURE_IDS.COMMUNITY_HUB]:  () => import('../Mini-Apps/CommunityHub/CommunityHubEngine.js').then(m => m.default),
  [FEATURE_IDS.CALCULATOR]:     () => import('../Mini-Apps/SelfAnalysisPro/loader.js').then(m => m.default),
});

// Cache resolved classes so we only import() once per feature
const _classCache = {};

// ─── FeaturesManager ─────────────────────────────────────────────────────────

class FeaturesManager {
  constructor(app) {
    if (!app) throw new Error('[Features] FeaturesManager requires app instance');
    this.app     = app;
    this.engines = {};
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Lazily loads + initialises a feature by ID.
   * Returns a Promise<boolean> — callers that previously used sync return value
   * should await or ignore the promise (both work).
   */
  async init(id) {
    try {
      const loader = FEATURE_LOADERS[id];
      if (!loader) {
        console.error(`[Features] Unknown feature: "${id}"`);
        return false;
      }

      // Resolve class once
      if (!_classCache[id]) _classCache[id] = await loader();
      const EngineClass = _classCache[id];

      // Instantiate once
      const engine = (this.engines[id] ??= new EngineClass(this.app));
      engine.render?.();
      return true;
    } catch (error) {
      console.error(`[Features] Error initialising "${id}":`, error);
      return false;
    }
  }

  async initMultiple(ids) {
    const results    = await Promise.all(ids.map(async id => ({ id, success: await this.init(id) })));
    const successful = results.filter(r =>  r.success).length;
    const failed     = results.filter(r => !r.success).length;
    return { results, successful, failed, total: ids.length };
  }

  getEngine(id)             { return this.engines[id] ?? null; }
  isInitialized(id)         { return !!this.engines[id]; }
  getInitializedFeatures()  { return Object.keys(this.engines); }
  getInitializedCount()     { return Object.keys(this.engines).length; }
  getAvailableFeatures()    { return Object.keys(FEATURE_LOADERS); }

  destroy(id) {
    try {
      const engine = this.engines[id];
      if (!engine) { console.warn(`[Features] Cannot destroy uninitialised feature: "${id}"`); return false; }
      engine.destroy?.();
      delete this.engines[id];
      return true;
    } catch (error) {
      console.error(`[Features] Error destroying "${id}":`, error);
      return false;
    }
  }

  destroyAll() {
    const ids = Object.keys(this.engines);
    let destroyed = 0;
    ids.forEach(id => { if (this.destroy(id)) destroyed++; });
    return { destroyed, total: ids.length };
  }

  getDebugInfo() {
    return {
      initialized:      this.getInitializedFeatures(),
      initializedCount: this.getInitializedCount(),
      available:        this.getAvailableFeatures(),
      availableCount:   this.getAvailableFeatures().length,
      engines: Object.fromEntries(
        Object.keys(this.engines).map(id => [id, {
          hasRender:  typeof this.engines[id].render  === 'function',
          hasDestroy: typeof this.engines[id].destroy === 'function'
        }])
      )
    };
  }
}

if (typeof window !== 'undefined') {
  window.FeaturesManager = FeaturesManager;
  window.FEATURE_IDS     = FEATURE_IDS;
}

export default FeaturesManager;