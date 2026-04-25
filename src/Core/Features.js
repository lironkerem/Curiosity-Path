/**
 * Features.js - Feature Registry and Manager
 * Manages lazy initialisation of feature engines and mini-apps.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
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

// ─── Feature registry (loaders only — no eager imports) ──────────────────────

const FEATURE_LOADERS = Object.freeze({
  [FEATURE_IDS.MEDITATIONS]:    () => import('../Features/MeditationsEngine.js').then(m => m.default),
  [FEATURE_IDS.TAROT]:          () => import('../Features/TarotEngine.js').then(m => m.default),
  [FEATURE_IDS.ENERGY]:         () => import('../Features/EnergyTracker.js').then(m => m.default),
  [FEATURE_IDS.HAPPINESS]:      () => import('../Features/HappinessEngine.js').then(m => m.default),
  [FEATURE_IDS.GRATITUDE]:      () => import('../Features/GratitudeEngine.js').then(m => m.default),
  [FEATURE_IDS.QUOTES]:         () => import('../Features/QuotesEngine.js').then(m => m.default),
  [FEATURE_IDS.AFFIRMATIONS]:   () => import('../Features/AffirmationsEngine.js').then(m => m.default),
  [FEATURE_IDS.PROGRESS]:       () => import('./GamificationEngine.js').then(m => m.default),
  [FEATURE_IDS.FLIP_SCRIPT]:    () => import('../Mini-Apps/FlipTheScript/index.js').then(m => m.default),
  [FEATURE_IDS.JOURNAL]:        () => import('../Features/JournalEngine.js').then(m => m.default),
  [FEATURE_IDS.SHADOW_ALCHEMY]: () => import('../Mini-Apps/ShadowAlchemyLab/shadowalchemy.js').then(m => m.default),
  [FEATURE_IDS.KARMA_SHOP]:     () => import('../Features/KarmaShopEngine.js').then(m => m.default),
  [FEATURE_IDS.CHATBOT]:        () => import('../Features/ChatBotAI.js').then(m => m.ChatBotAI),
  [FEATURE_IDS.COMMUNITY_HUB]:  () => import('../Mini-Apps/CommunityHub/CommunityHubEngine.js').then(m => m.default),
  [FEATURE_IDS.CALCULATOR]:     () => import('../Mini-Apps/SelfAnalysisPro/loader.js').then(m => m.default),
});

// ─── FeaturesManager ─────────────────────────────────────────────────────────

/**
 * Manages feature lifecycle: lazy init, status tracking, cleanup.
 */
class FeaturesManager {
  /**
   * @param {Object} app - Main application instance
   * @throws {Error} If app is not provided
   */
  constructor(app) {
    if (!app) throw new Error('[Features] FeaturesManager requires app instance');
    this.app      = app;
    this.engines  = {};
    this._loading = {}; // in-flight promises
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Lazily initialises a feature by ID (async).
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async init(id) {
    try {
      // Return existing engine immediately
      if (this.engines[id]) {
        this.engines[id].render?.();
        return true;
      }

      // Deduplicate concurrent calls for the same id
      if (!this._loading[id]) {
        const loader = FEATURE_LOADERS[id];
        if (!loader) {
          console.error(`[Features] Unknown feature: "${id}"`);
          return false;
        }
        this._loading[id] = loader().then(EngineClass => {
          this.engines[id] = new EngineClass(this.app);
          delete this._loading[id];
          return this.engines[id];
        });
      }

      const engine = await this._loading[id];
      engine.render?.();
      return true;
    } catch (error) {
      console.error(`[Features] Error initialising "${id}":`, error);
      delete this._loading[id];
      return false;
    }
  }

  /**
   * Initialises multiple features in parallel.
   * @param {string[]} ids
   * @returns {Promise<{ results: Array, successful: number, failed: number, total: number }>}
   */
  async initMultiple(ids) {
    const results    = await Promise.all(ids.map(async id => ({ id, success: await this.init(id) })));
    const successful = results.filter(r =>  r.success).length;
    const failed     = results.filter(r => !r.success).length;
    return { results, successful, failed, total: ids.length };
  }

  /**
   * Returns an initialised engine, or null.
   * @param {string} id
   * @returns {Object|null}
   */
  getEngine(id) {
    return this.engines[id] ?? null;
  }

  /** @param {string} id @returns {boolean} */
  isInitialized(id) {
    return !!this.engines[id];
  }

  /** @returns {string[]} */
  getInitializedFeatures() {
    return Object.keys(this.engines);
  }

  /** @returns {number} */
  getInitializedCount() {
    return Object.keys(this.engines).length;
  }

  /** @returns {string[]} */
  getAvailableFeatures() {
    return Object.keys(FEATURE_LOADERS);
  }

  /**
   * Destroys a single feature engine.
   * @param {string} id
   * @returns {boolean}
   */
  destroy(id) {
    try {
      const engine = this.engines[id];
      if (!engine) {
        console.warn(`[Features] Cannot destroy uninitialised feature: "${id}"`);
        return false;
      }
      engine.destroy?.();
      delete this.engines[id];
      return true;
    } catch (error) {
      console.error(`[Features] Error destroying "${id}":`, error);
      return false;
    }
  }

  /**
   * Destroys all initialised features.
   * @returns {{ destroyed: number, failed: number }}
   */
  destroyAll() {
    const ids       = Object.keys(this.engines);
    let   destroyed = 0;
    ids.forEach(id => { if (this.destroy(id)) destroyed++; });
    return { destroyed, total: ids.length };
  }

  /**
   * Returns debug information about feature status.
   * @returns {Object}
   */
  getDebugInfo() {
    return {
      initialized:      this.getInitializedFeatures(),
      initializedCount: this.getInitializedCount(),
      available:        this.getAvailableFeatures(),
      availableCount:   this.getAvailableFeatures().length,
      loading:          Object.keys(this._loading),
      engines: Object.fromEntries(
        Object.keys(this.engines).map(id => [id, {
          hasRender:  typeof this.engines[id].render  === 'function',
          hasDestroy: typeof this.engines[id].destroy === 'function'
        }])
      )
    };
  }
}

// ─── Minimal window exposure (only what legacy onclick handlers need) ─────────
if (typeof window !== 'undefined') {
  window.FeaturesManager = FeaturesManager;
  window.FEATURE_IDS     = FEATURE_IDS;
}

export default FeaturesManager;