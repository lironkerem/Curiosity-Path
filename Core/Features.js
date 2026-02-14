/**
 * Features.js - Feature Registry and Manager
 * Manages lazy initialization of feature engines and mini-apps
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

/* global window */

/* ---------- Engines ---------- */
import EnergyEngineEnhanced from '../Features/EnergyTracker.js';
import KarmaShopEngine      from '../Features/KarmaShopEngine.js';
import MeditationsEngine    from '../Features/MeditationsEngine.js';
import TarotEngine          from '../Features/TarotEngine.js';
import HappinessEngine      from '../Features/HappinessEngine.js';
import GratitudeEngine      from '../Features/GratitudeEngine.js';
import QuotesEngine         from '../Features/QuotesEngine.js';
import AffirmationsEngine   from '../Features/AffirmationsEngine.js';
import GamificationEngine   from './GamificationEngine.js';
import JournalEngine        from '../Features/JournalEngine.js';
import ShadowAlchemyEngine  from '../Mini-Apps/ShadowAlchemyLab/shadowalchemy.js';
import { ChatBotAI }        from '../Features/ChatBotAI.js';
import CommunityHubEngine   from '../Mini-Apps/CommunityHub/CommunityHubEngine.js';

/* ---------- Apps ---------- */
import FlipTheScriptApp     from '../Mini-Apps/FlipTheScript/index.js';

/** Feature ID constants */
export const FEATURE_IDS = {
  MEDITATIONS: 'meditations',
  TAROT: 'tarot',
  ENERGY: 'energy',
  HAPPINESS: 'happiness',
  GRATITUDE: 'gratitude',
  QUOTES: 'quotes',
  AFFIRMATIONS: 'affirmations',
  PROGRESS: 'progress',
  FLIP_SCRIPT: 'flip-script',
  JOURNAL: 'journal',
  SHADOW_ALCHEMY: 'shadow-alchemy',
  KARMA_SHOP: 'karma-shop',
  CHATBOT: 'chatbot',
  COMMUNITY_HUB: 'community-hub'
};

/** Feature registry mapping IDs to engine classes */
const FEATURE_MAP = {
  [FEATURE_IDS.MEDITATIONS]: MeditationsEngine,
  [FEATURE_IDS.TAROT]: TarotEngine,
  [FEATURE_IDS.ENERGY]: EnergyEngineEnhanced,
  [FEATURE_IDS.HAPPINESS]: HappinessEngine,
  [FEATURE_IDS.GRATITUDE]: GratitudeEngine,
  [FEATURE_IDS.QUOTES]: QuotesEngine,
  [FEATURE_IDS.AFFIRMATIONS]: AffirmationsEngine,
  [FEATURE_IDS.PROGRESS]: GamificationEngine,
  [FEATURE_IDS.FLIP_SCRIPT]: FlipTheScriptApp,
  [FEATURE_IDS.JOURNAL]: JournalEngine,
  [FEATURE_IDS.SHADOW_ALCHEMY]: ShadowAlchemyEngine,
  [FEATURE_IDS.KARMA_SHOP]: KarmaShopEngine,
  [FEATURE_IDS.CHATBOT]: ChatBotAI,
  [FEATURE_IDS.COMMUNITY_HUB]: CommunityHubEngine
};

/**
 * FeaturesManager - Manages feature lifecycle
 * Provides lazy initialization, status tracking, and cleanup
 */
class FeaturesManager {
  /**
   * Creates a new FeaturesManager instance
   * @param {Object} app - Main application instance
   * @throws {Error} If app instance not provided
   */
  constructor(app) {
    if (!app) {
      throw new Error('[Features] FeaturesManager requires app instance');
    }
    
    /** @type {Object} Main app reference */
    this.app = app;
    
    /** @type {Object} Initialized engine instances */
    this.engines = {};
    
    console.log('[Features] FeaturesManager initialized');
  }
  
  /**
   * Initializes a feature by ID
   * Uses lazy initialization - only creates engine when first needed
   * @public
   * @param {string} id - Feature ID from FEATURE_IDS
   * @returns {boolean} True if initialization successful
   */
  init(id) {
    try {
      const EngineClass = FEATURE_MAP[id];
      
      if (!EngineClass) {
        console.error(`[Features] Unknown feature: ${id}`);
        return false;
      }
      
      // Lazy initialization with nullish coalescing
      // Only creates new instance if not already initialized
      const engine = (this.engines[id] ??= new EngineClass(this.app));
      
      // Call render if available
      engine.render?.();
      
      console.log(`[Features] Initialized: ${id}`);
      return true;
      
    } catch (error) {
      console.error(`[Features] Error initializing ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Initializes multiple features
   * @public
   * @param {string[]} ids - Array of feature IDs
   * @returns {Object} Results object with success/failure counts
   */
  initMultiple(ids) {
    const results = ids.map(id => ({
      id,
      success: this.init(id)
    }));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`[Features] Batch init: ${successful} succeeded, ${failed} failed`);
    
    return {
      results,
      successful,
      failed,
      total: ids.length
    };
  }
  
  /**
   * Gets an initialized engine instance
   * @public
   * @param {string} id - Feature ID
   * @returns {Object|null} Engine instance or null if not initialized
   */
  getEngine(id) {
    return this.engines[id] || null;
  }
  
  /**
   * Checks if a feature is initialized
   * @public
   * @param {string} id - Feature ID
   * @returns {boolean} True if feature is initialized
   */
  isInitialized(id) {
    return !!this.engines[id];
  }
  
  /**
   * Gets list of all initialized feature IDs
   * @public
   * @returns {string[]} Array of initialized feature IDs
   */
  getInitializedFeatures() {
    return Object.keys(this.engines);
  }
  
  /**
   * Gets count of initialized features
   * @public
   * @returns {number} Number of initialized features
   */
  getInitializedCount() {
    return Object.keys(this.engines).length;
  }
  
  /**
   * Gets list of all available feature IDs
   * @public
   * @returns {string[]} Array of all available feature IDs
   */
  getAvailableFeatures() {
    return Object.keys(FEATURE_MAP);
  }
  
  /**
   * Destroys a specific feature and cleans up resources
   * @public
   * @param {string} id - Feature ID to destroy
   * @returns {boolean} True if destroyed successfully
   */
  destroy(id) {
    try {
      const engine = this.engines[id];
      
      if (!engine) {
        console.warn(`[Features] Cannot destroy uninitialized feature: ${id}`);
        return false;
      }
      
      // Call destroy method if available
      if (typeof engine.destroy === 'function') {
        engine.destroy();
      }
      
      // Remove from registry
      delete this.engines[id];
      
      console.log(`[Features] Destroyed: ${id}`);
      return true;
      
    } catch (error) {
      console.error(`[Features] Error destroying ${id}:`, error);
      return false;
    }
  }
  
  /**
   * Destroys all initialized features
   * @public
   * @returns {Object} Results with destroyed count
   */
  destroyAll() {
    const ids = Object.keys(this.engines);
    let destroyed = 0;
    
    ids.forEach(id => {
      if (this.destroy(id)) {
        destroyed++;
      }
    });
    
    console.log(`[Features] Destroyed all features: ${destroyed}/${ids.length}`);
    
    return {
      destroyed,
      total: ids.length
    };
  }
  
  /**
   * Gets debug information about feature status
   * @public
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    return {
      initialized: this.getInitializedFeatures(),
      initializedCount: this.getInitializedCount(),
      available: this.getAvailableFeatures(),
      availableCount: this.getAvailableFeatures().length,
      engines: Object.keys(this.engines).reduce((acc, id) => {
        acc[id] = {
          hasRender: typeof this.engines[id].render === 'function',
          hasDestroy: typeof this.engines[id].destroy === 'function'
        };
        return acc;
      }, {})
    };
  }
}

/* Expose to window for legacy code compatibility */
if (typeof window !== 'undefined') {
  window.FeaturesManager = FeaturesManager;
  Object.assign(window, FEATURE_MAP);
  window.FEATURE_IDS = FEATURE_IDS;
}

export default FeaturesManager;