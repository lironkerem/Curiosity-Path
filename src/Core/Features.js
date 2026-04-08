/**
 * Features.js - Feature Registry and Manager
 * Manages lazy initialisation of feature engines and mini-apps.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

/* ---------- Engine imports ---------- */
import EnergyEngineEnhanced from '../src/Features/EnergyTracker.js';
import KarmaShopEngine      from '../src/Features/KarmaShopEngine.js';
import MeditationsEngine    from '../src/Features/MeditationsEngine.js';
import TarotEngine          from '../src/Features/TarotEngine.js';
import HappinessEngine      from '../src/Features/HappinessEngine.js';
import GratitudeEngine      from '../src/Features/GratitudeEngine.js';
import QuotesEngine         from '../src/Features/QuotesEngine.js';
import AffirmationsEngine   from '../src/Features/AffirmationsEngine.js';
import GamificationEngine   from './GamificationEngine.js';
import JournalEngine        from '../src/Features/JournalEngine.js';
import ShadowAlchemyEngine  from '../src/Mini-Apps/ShadowAlchemyLab/shadowalchemy.js';
import CommunityHubEngine   from '../src/Mini-Apps/CommunityHub/CommunityHubEngine.js';
import { ChatBotAI }        from '../src/Features/ChatBotAI.js';

/* ---------- App imports ---------- */
import FlipTheScriptApp from '../src/Mini-Apps/FlipTheScript/index.js';

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
  COMMUNITY_HUB:  'community-hub'
});

// ─── Feature registry ─────────────────────────────────────────────────────────

const FEATURE_MAP = Object.freeze({
  [FEATURE_IDS.MEDITATIONS]:    MeditationsEngine,
  [FEATURE_IDS.TAROT]:          TarotEngine,
  [FEATURE_IDS.ENERGY]:         EnergyEngineEnhanced,
  [FEATURE_IDS.HAPPINESS]:      HappinessEngine,
  [FEATURE_IDS.GRATITUDE]:      GratitudeEngine,
  [FEATURE_IDS.QUOTES]:         QuotesEngine,
  [FEATURE_IDS.AFFIRMATIONS]:   AffirmationsEngine,
  [FEATURE_IDS.PROGRESS]:       GamificationEngine,
  [FEATURE_IDS.FLIP_SCRIPT]:    FlipTheScriptApp,
  [FEATURE_IDS.JOURNAL]:        JournalEngine,
  [FEATURE_IDS.SHADOW_ALCHEMY]: ShadowAlchemyEngine,
  [FEATURE_IDS.KARMA_SHOP]:     KarmaShopEngine,
  [FEATURE_IDS.CHATBOT]:        ChatBotAI,
  [FEATURE_IDS.COMMUNITY_HUB]:  CommunityHubEngine
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
    this.app     = app;
    this.engines = {};
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Lazily initialises a feature by ID.
   * @param {string} id
   * @returns {boolean} true if successful
   */
  init(id) {
    try {
      const EngineClass = FEATURE_MAP[id];
      if (!EngineClass) {
        console.error(`[Features] Unknown feature: "${id}"`);
        return false;
      }
      // Lazy init — only create once
      const engine = (this.engines[id] ??= new EngineClass(this.app));
      engine.render?.();
      return true;
    } catch (error) {
      console.error(`[Features] Error initialising "${id}":`, error);
      return false;
    }
  }

  /**
   * Initialises multiple features in sequence.
   * @param {string[]} ids
   * @returns {{ results: Array, successful: number, failed: number, total: number }}
   */
  initMultiple(ids) {
    const results    = ids.map(id => ({ id, success: this.init(id) }));
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
    return Object.keys(FEATURE_MAP);
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
   * @returns {{ destroyed: number, total: number }}
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
// Avoid polluting window with every engine class — expose only the manager and IDs.
if (typeof window !== 'undefined') {
  window.FeaturesManager = FeaturesManager;
  window.FEATURE_IDS     = FEATURE_IDS;
}

export default FeaturesManager;
