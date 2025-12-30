// Core/Features.js
/* global window */
/* ----------  Engines  ---------- */
import EnergyEngineEnhanced from '../Features/EnergyTracker.js';
import KarmaShopEngine      from '../Features/KarmaShopEngine.js';
import MeditationsEngine    from '../Features/MeditationsEngine.js';
import TarotEngine          from '../Features/TarotEngine.js';
import HappinessEngine      from '../Features/HappinessEngine.js';
import GratitudeEngine      from '../Features/GratitudeEngine.js';
import QuotesEngine         from '../Features/QuotesEngine.js';
import AffirmationsEngine   from '../Features/AffirmationsEngine.js';
import GamificationEngine   from '../Features/GamificationEngine.js';
import JournalEngine        from '../Features/JournalEngine.js';
import ShadowAlchemyEngine  from '../Mini-Apps/ShadowAlchemyLab/shadowalchemy.js';
import { ChatBotAI }        from '../Features/ChatBotAI.js';
/* ----------  Apps  ---------- */
import FlipTheScriptApp     from '../Mini-Apps/FlipTheScript/index.js';

const MAP = {
  meditations     : MeditationsEngine,
  tarot           : TarotEngine,
  energy          : EnergyEngineEnhanced,
  happiness       : HappinessEngine,
  gratitude       : GratitudeEngine,
  quotes          : QuotesEngine,
  affirmations    : AffirmationsEngine,
  progress        : GamificationEngine,
  'flip-script'   : FlipTheScriptApp,
  journal         : JournalEngine,
  'shadow-alchemy': ShadowAlchemyEngine,
  'karma-shop'    : KarmaShopEngine,
  chatbot         : ChatBotAI
};

class FeaturesManager {
  constructor(app) { 
    this.app = app; 
    this.engines = {}; 
  }
  
init(id) {
  const C = MAP[id];
  if (!C) return console.error(`Unknown feature: ${id}`);
  
  // Special handling for ChatBotAI
  if (id === 'chatbot') {
    if (!this.engines[id]) {
      // Add delay for mobile to ensure tab is visible
      const initChatbot = () => {
        const target = document.querySelector('#chatbot-tab');
        if (!target || target.style.display === 'none') {
          // Tab not ready, retry
          setTimeout(initChatbot, 50);
          return;
        }
        this.engines[id] = new C({apiUrl: '/api/chat'});
        this.engines[id].mount('#chatbot-tab');
      };
      
      // Small delay for mobile devices
      if (window.innerWidth <= 767) {
        setTimeout(initChatbot, 100);
      } else {
        initChatbot();
      }
    }
    return;
  }
  
  // Standard initialization for other features
  (this.engines[id] ??= new C(this.app)).render?.();
}
}

/* expose to window for legacy code */
typeof window !== 'undefined' && (window.FeaturesManager = FeaturesManager, Object.assign(window, MAP));

export default FeaturesManager;