// TarotEngine.js - Optimized Tarot Reading Engine

/* ==================== CONSTANTS ==================== */

// Major Arcana card names
const MAJOR_ARCANA_NAMES = {
  0: "The Fool", 1: "The Magician", 2: "The High Priestess", 3: "The Empress",
  4: "The Emperor", 5: "The Hierophant", 6: "The Lovers", 7: "The Chariot",
  8: "Strength", 9: "The Hermit", 10: "Wheel of Fortune", 11: "Justice",
  12: "The Hanged Man", 13: "Death", 14: "Temperance", 15: "The Devil",
  16: "The Tower", 17: "The Star", 18: "The Moon", 19: "The Sun",
  20: "Judgement", 21: "The World"
};

// Major Arcana meanings
const MAJOR_ARCANA_MEANINGS = {
  0: "A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",
  1: "All the tools are in your hands. You are the bridge between spirit and matter.",
  2: "Silence holds the answers you seek. Trust your inner knowing.",
  3: "The Earth mirrors your abundance. Nurture what you love.",
  4: "True power is built through order and wisdom. Take authority over your life.",
  5: "Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",
  6: "Union of soul and choice of heart. Harmony is born when love aligns with truth.",
  7: "Willpower shapes destiny. Victory is achieved through balance of heart and mind.",
  8: "Gentle courage tames inner storms. True strength is soft yet unbreakable.",
  9: "Withdraw to reconnect with your light. The answers you seek are within.",
  10: "Life turns in divine rhythm. Every rise and fall carries hidden blessings.",
  11: "The scales always balance in time. Choose integrity.",
  12: "Surrender brings revelation. Sometimes you must pause to see from a higher angle.",
  13: "Endings are beginnings disguised. Transformation renews you into higher truth.",
  14: "Balance is your sacred art. Patience and moderation bring peace.",
  15: "Bondage is often self-made. Recognize what controls you and reclaim your power.",
  16: "When illusion collapses, liberation follows. Trust the breakdown.",
  17: "Hope returns like light after storm. Believe again in miracles.",
  18: "The path is unclear but alive with mystery. Feel your way through intuition.",
  19: "Joy, clarity, and vitality fill your being. Let your light shine.",
  20: "Awakening through self-realization. Rise into your higher purpose.",
  21: "Completion, integration, and mastery. Celebrate how far you've come."
};

// Minor Arcana meanings by suit and number
const MINOR_ARCANA_MEANINGS = {
  pentacles: {
    1: "New financial opportunity or material beginning. Plant seeds for future abundance.",
    2: "Balance between multiple priorities. Juggling responsibilities with grace.",
    3: "Collaboration and teamwork. Your skills are recognized and valued.",
    4: "Holding on too tightly. Security through control or fear of loss.",
    5: "Financial or material hardship. Temporary struggle leads to resilience.",
    6: "Generosity and fair exchange. Giving and receiving in balance.",
    7: "Patience with long-term investments. Results take time to manifest.",
    8: "Mastery through practice. Dedication to craft and skill development.",
    9: "Self-sufficiency and material comfort. Enjoying the fruits of your labor.",
    10: "Lasting wealth and legacy. Family, tradition, and generational abundance."
  },
  swords: {
    1: "Mental clarity and breakthrough. Truth cuts through confusion.",
    2: "Difficult decision or stalemate. Time to weigh options carefully.",
    3: "Heartbreak or painful truth. Necessary release brings healing.",
    4: "Rest and recovery. Taking time to recharge mentally.",
    5: "Conflict and defeat. Learning humility through challenge.",
    6: "Transition to calmer waters. Moving away from turmoil.",
    7: "Deception or strategy. Proceed with awareness and caution.",
    8: "Mental restriction. Breaking free from limiting beliefs.",
    9: "Anxiety and worry. Nightmares that lose power in daylight.",
    10: "Ending of a difficult cycle. Rock bottom becomes foundation."
  },
  cups: {
    1: "New emotional beginning. Opening your heart to love and connection.",
    2: "Partnership and mutual attraction. Harmony between two souls.",
    3: "Celebration and friendship. Joy shared multiplies.",
    4: "Emotional apathy or missed opportunity. Look beyond dissatisfaction.",
    5: "Loss and disappointment. Grief that teaches perspective.",
    6: "Nostalgia and innocence. Returning to simpler joys.",
    7: "Illusion and fantasy. Ground dreams in reality.",
    8: "Walking away from the familiar. Seeking deeper meaning.",
    9: "Emotional fulfillment. Wishes granted, contentment realized.",
    10: "Lasting happiness and family harmony. Emotional abundance overflows."
  },
  wands: {
    1: "Creative spark and new inspiration. Bold initiative ignites passion.",
    2: "Future planning and decisions. Vision meets preparation.",
    3: "Expansion and foresight. Progress through strategic action.",
    4: "Celebration and homecoming. Stability through joyful foundation.",
    5: "Competition and conflict. Growth through challenge.",
    6: "Victory and recognition. Success earned through perseverance.",
    7: "Standing your ground. Defending your position with courage.",
    8: "Swift action and momentum. Things move quickly now.",
    9: "Resilience and persistence. Nearly there—don't give up.",
    10: "Burden of responsibility. Carrying weight that may not be yours."
  }
};

// Court card meanings by suit and rank
const COURT_CARD_MEANINGS = {
  pentacles: {
    Page: "Student of the material world. Eager to learn practical skills and build security.",
    Knight: "Methodical and reliable. Steady progress toward tangible goals.",
    Queen: "Nurturer of resources. Abundant, practical, and grounded in care.",
    King: "Master of the material realm. Wealthy in wisdom and resources."
  },
  swords: {
    Page: "Curious mind seeking truth. Quick wit but inexperienced with consequences.",
    Knight: "Driven by ideals and logic. Charging forward with mental clarity.",
    Queen: "Sharp intellect with experience. Clear boundaries and honest communication.",
    King: "Authority through wisdom. Just, logical, and fair in judgment."
  },
  cups: {
    Page: "Emotionally open and intuitive. Beginning to understand feelings and dreams.",
    Knight: "Romantic and idealistic. Following the heart with passion.",
    Queen: "Emotionally mature and compassionate. Deeply intuitive and nurturing.",
    King: "Emotional mastery and diplomacy. Calm waters and balanced heart."
  },
  wands: {
    Page: "Enthusiastic explorer. New creative ventures and bold messages.",
    Knight: "Adventurous and impulsive. Chasing passion with fiery energy.",
    Queen: "Confident and charismatic. Inspiring others through authentic presence.",
    King: "Visionary leader. Turning inspiration into lasting impact."
  }
};

// Court card rank mapping
const COURT_RANKS = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };

// Suit name mapping
const SUIT_NAMES = {
  pentacles: 'Pentacles',
  swords: 'Swords',
  cups: 'Cups',
  wands: 'Wands'
};

// Animation timing constants
const ANIMATION_TIMING = {
  FLIP_DURATION: 900,
  SCROLL_DELAY: 100
};

/* ==================== MAIN CLASS ==================== */

class TarotEngine {
  constructor(app) {
    this.app = app;
    this.TAROT_BASE_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/';
    this.CARD_BACK_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/CardBacks.jpg';

    // Spread configurations
    this.spreads = {
      single: {
        name: 'A Single Card Oracle Spread',
        cards: 1,
        desc: 'A Single Card Clarification',
        positions: ['A Single Card']
      },
      three: {
        name: 'A 3 Cards Quick Spread',
        cards: 3,
        desc: 'Past • Present • Future',
        positions: ['Past', 'Present', 'Future']
      },
      six: {
        name: 'A 6 Cards Insight Spread',
        cards: 6,
        desc: 'Situational Analysis',
        positions: ['Situation', 'Challenge', 'Past Influence', 'Future Influence', 'Your Power', 'Outcome']
      },
      options: {
        name: 'The Options Spread',
        cards: 9,
        desc: 'Evaluate your different Options',
        positions: ['Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)']
      },
      pyramid: {
        name: 'The Pyramid Spread',
        cards: 9,
        desc: 'Triangle of Past – Present – Future',
        positions: ['Where you came from', 'Where you came from', 'Where you came from', 'Where you are now', 'Where you are now', 'Where you are now', 'Where are you going', 'Where are you going', 'Where are you going']
      },
      cross: {
        name: 'The Simple Cross Spread',
        cards: 5,
        desc: 'A Simple Cross Snapshot of Now',
        positions: ['Direction of the Situation', 'The Root of the Situation', 'Summary', 'Positive side of Situation', 'Obstacles-Challenges']
      }
    };

    this.selectedSpread = 'single';
    this.shuffledDeck = [];
    this.flippedCards = new Set();
    this.currentReading = [];
    this.cleanup = null;
    this.cachedElements = {}; // DOM element cache
    this.prepareReading();
  }

  /* ==================== CARD DATA METHODS ==================== */

  /**
   * Get the name of a tarot card
   * @param {number} number - Card number
   * @param {string} suit - Card suit (major, pentacles, swords, cups, wands)
   * @returns {string} Card name
   */
  getTarotCardName(number, suit = 'major') {
    if (suit === 'major') {
      return MAJOR_ARCANA_NAMES[number] || "The Fool";
    }
    
    // Minor arcana numbered cards
    if (number <= 10) {
      return `${number} of ${SUIT_NAMES[suit]}`;
    }
    
    // Court cards
    return `${COURT_RANKS[number]} of ${SUIT_NAMES[suit]}`;
  }

  /**
   * Get the image URL for a tarot card
   * @param {number} number - Card number
   * @param {string} suit - Card suit
   * @returns {string} Image URL
   */
  getTarotCardImage(number, suit = 'major') {
    if (suit === 'major') {
      const num = String(number).padStart(2, '0');
      const name = this.getTarotCardName(number, 'major').replace(/\s+/g, '');
      return `${this.TAROT_BASE_URL}${num}-${name}.jpg`;
    }
    
    const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);
    const num = String(number).padStart(2, '0');
    return `${this.TAROT_BASE_URL}${suitCap}${num}.jpg`;
  }

  /**
   * Get the meaning text for a tarot card
   * @param {number} number - Card number
   * @param {string} suit - Card suit
   * @returns {string} Card meaning
   */
  getTarotCardMeaning(number, suit = 'major') {
    if (suit === 'major') {
      return MAJOR_ARCANA_MEANINGS[number] || "New beginnings and infinite possibility await you.";
    }
    
    // Minor arcana numbered cards
    if (number <= 10) {
      return MINOR_ARCANA_MEANINGS[suit]?.[number] || "This card brings its unique energy to your reading.";
    }
    
    // Court cards
    const rank = COURT_RANKS[number];
    return COURT_CARD_MEANINGS[suit]?.[rank] || "This court card represents a person or energy in your life.";
  }

  /* ==================== DECK MANAGEMENT ==================== */

  /**
   * Build a complete 78-card tarot deck
   * @returns {Array} Full deck of card objects
   */
  buildFullDeck() {
    const suits = ['pentacles', 'swords', 'cups', 'wands'];
    
    return [
      // Major Arcana (22 cards)
      ...Array.from({ length: 22 }, (_, i) => ({
        type: 'major',
        number: i,
        suit: 'major'
      })),
      // Minor Arcana (56 cards: 14 per suit)
      ...suits.flatMap(suit =>
        Array.from({ length: 14 }, (_, i) => ({
          type: i < 10 ? 'minor' : 'court',
          number: i + 1,
          suit
        }))
      )
    ];
  }

  /**
   * Shuffle deck using Fisher-Yates algorithm
   * @param {Array} deck - Deck to shuffle
   * @returns {Array} Shuffled deck
   */
  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Prepare a new reading by shuffling the deck and resetting state
   */
  prepareReading() {
    const fullDeck = this.buildFullDeck();
    this.shuffledDeck = this.shuffleDeck(fullDeck);
    this.flippedCards.clear();
    this.currentReading = [];
    this.cachedElements = {}; // Clear DOM cache on new reading
  }

  /* ==================== CARD INTERACTION ==================== */

  /**
   * Flip a card at the given index and reveal its details
   * @param {number} index - Card position index in the spread
   */
  flipCard(index) {
    // Prevent double-flipping or flipping with no cards left
    if (this.flippedCards.has(index) || !this.shuffledDeck.length) return;

    // Handle pyramid animation (cache query for performance)
    const pyramid = this.cachedElements.pyramid || 
      (this.cachedElements.pyramid = document.querySelector('.pyramid-triangle'));
    
    if (pyramid) {
      requestAnimationFrame(() => {
        pyramid.style.minHeight = `${pyramid.offsetHeight}px`;
        pyramid.classList.add('flipping');
        setTimeout(() => {
          pyramid.classList.remove('flipping');
          pyramid.style.minHeight = '';
        }, ANIMATION_TIMING.FLIP_DURATION);
      });
    }

    // Mark card as flipped and draw from deck
    this.flippedCards.add(index);
    const cardData = this.shuffledDeck.pop();
    const card = {
      name: this.getTarotCardName(cardData.number, cardData.suit),
      meaning: this.getTarotCardMeaning(cardData.number, cardData.suit),
      imageUrl: this.getTarotCardImage(cardData.number, cardData.suit),
      cardData
    };
    this.currentReading.push(card);

    // Update DOM elements
    const container = document.getElementById(`tarot-card-container-${index}`);
    const front = container?.querySelector('.tarot-card-front');
    const details = document.getElementById(`tarot-card-details-${index}`);

    if (!container || !front || !details) {
      console.error(`Failed to find card elements for index ${index}`);
      return;
    }

    // Flip animation
    front.style.backgroundImage = `url(${card.imageUrl})`;
    setTimeout(() => container.classList.add('flipped'), 50);

    // Reveal card details
    setTimeout(() => {
      details.innerHTML = `
        <div class="font-bold text-lg mb-2 text-amber-100">${card.name}</div>
        <p class="text-sm text-gray-300 leading-relaxed">${card.meaning}</p>
      `;
      details.classList.remove('hidden');
      details.style.opacity = '0';
      setTimeout(() => { details.style.opacity = '1'; }, 50);
    }, 400);

    // Check if spread is complete
    this.checkSpreadCompletion();
  }

  /**
   * Check if all cards in the spread have been flipped
   */
  checkSpreadCompletion() {
    if (this.flippedCards.size === this.spreads[this.selectedSpread].cards) {
      this.completeTarotSpread();
    }
  }

  /**
   * Handle spread completion - save reading and update progress
   */
  completeTarotSpread() {
    const spreadType = this.spreads[this.selectedSpread].name;
    
    // Save reading to app state
    if (this.app.state) {
      const reading = {
        spreadType,
        spreadKey: this.selectedSpread,
        cards: this.currentReading.map(c => ({ name: c.name, meaning: c.meaning })),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      this.app.state.addEntry('tarot', reading);
    }
    
    // Update progress for non-trivial spreads
    const excludedSpreads = ['single', 'three'];
    if (!excludedSpreads.includes(this.selectedSpread)) {
      if (this.app.gamification) {
        this.app.gamification.progressQuest('daily', 'tarot_spread', 1);
        this.app.gamification.incrementTarotSpreads();
      }
      if (this.app.showToast) {
        this.app.showToast(`✨ ${spreadType} complete!`, 'success');
      }
      this.checkAchievements();
    }
  }

  /**
   * Check and grant achievements based on total readings
   */
  checkAchievements() {
    const total = this.app.state?.data?.tarotEntries?.length || 0;
    const gm = this.app.gamification;
    if (!gm) return;

    if (total === 1) {
      gm.grantAchievement({ 
        id: 'first_tarot', 
        name: 'First Reading', 
        xp: 50, 
        icon: '🃏', 
        inspirational: 'You\'ve opened the door to divine guidance!' 
      });
    }
    if (total === 10) {
      gm.grantAchievement({ 
        id: 'tarot_10', 
        name: 'Tarot Apprentice', 
        xp: 100, 
        icon: '🔮', 
        inspirational: '10 readings! The cards speak to you clearly!' 
      });
    }
    if (total === 50) {
      gm.grantAchievement({ 
        id: 'tarot_50', 
        name: 'Tarot Master', 
        xp: 250, 
        icon: '✨', 
        inspirational: '50 readings! You are attuned to cosmic wisdom!' 
      });
    }
    if (total === 100) {
      gm.grantAchievement({ 
        id: 'tarot_100', 
        name: 'Oracle of the Cards', 
        xp: 500, 
        icon: '🌟', 
        inspirational: '100 readings! The universe speaks through you!' 
      });
    }
  }

  /* ==================== RENDERING ==================== */

  /**
   * Render the tarot interface
   */
  render() {
    // Clean up any previous event handlers
    if (this.cleanup) this.cleanup();

    const tab = document.getElementById('tarot-tab');
    if (!tab) {
      console.error('[TarotEngine] tarot-tab element not found');
      return;
    }

    const spread = this.spreads[this.selectedSpread];
    const premiumSpreads = ['options', 'pyramid', 'cross'];
    const isPremium = premiumSpreads.includes(this.selectedSpread);
    const isUnlocked = this.app?.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads');

    tab.innerHTML = `
<style>
  /* Card flip containers */
  .tarot-card-flip-container {
    perspective: 1000px;
    width: 100%;
    max-width: 160px;
    margin: 0 auto;
    aspect-ratio: 2/3;
    cursor: pointer;
    position: relative;
  }
  
  .tarot-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  
  .tarot-card-flip-container.flipped .tarot-card-inner {
    transform: rotateY(180deg);
  }
  
  .tarot-card-front,
  .tarot-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    background-size: cover;
    background-position: center;
  }
  
  .tarot-card-back {
    background-image: url('${this.CARD_BACK_URL}');
  }
  
  .tarot-card-front {
    transform: rotateY(180deg);
    background-color: #1a1a1a;
  }
  
  /* Card details section */
  .tarot-card-details {
    transition: opacity 0.6s ease-in-out;
  }
  
  /* Grid responsive spacing */
  #tarot-tab .grid {
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
  
  #tarot-tab .grid.md\\:grid-cols-3,
  #tarot-tab .grid.grid-cols-2.md\\:grid-cols-3 {
    column-gap: 0.5rem !important;
    row-gap: 0.75rem !important;
  }
  
  @media (min-width: 400px) {
    #tarot-tab .grid {
      gap: 0.65rem;
      padding: 0 1rem;
    }
    #tarot-tab .grid.md\\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\\:grid-cols-3 {
      column-gap: 0.65rem !important;
      row-gap: 0.85rem !important;
    }
  }
  
  @media (min-width: 640px) {
    #tarot-tab .grid {
      gap: 0.75rem;
      padding: 0 1rem;
    }
    #tarot-tab .grid.md\\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\\:grid-cols-3 {
      column-gap: 0.75rem !important;
      row-gap: 1rem !important;
    }
  }
  
  @media (min-width: 768px) {
    #tarot-tab .grid { 
      gap: 1rem 1.5rem; 
      padding: 0;
    }
    #tarot-tab .grid.md\\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\\:grid-cols-3 {
      column-gap: 1.5rem !important;
      row-gap: 1rem !important;
    }
    .tarot-card-flip-container { 
      max-width: 220px; 
    }
    #tarot-tab .flex.flex-col.items-center.mx-auto { 
      max-width: 220px;
    }
  }
  
  @media (min-width: 1600px) { 
    .tarot-card-flip-container { 
      max-width: 240px; 
    }
    #tarot-tab .flex.flex-col.items-center.mx-auto { 
      max-width: 240px;
    }
  }
  
  /* Pyramid layout */
  .pyramid-triangle { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .pyr-row { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
    width: 100%; 
  }
  
  @media (min-width: 768px) {
    .pyramid-triangle { gap: 1rem; }
    .pyr-row { gap: 1rem; }
    .pyr-apex { gap: 2rem; }
    .pyr-upper { gap: 8rem; }
    .pyr-lower { gap: 14rem; }
    .pyr-base { gap: 6rem; }
  }
  
  @media (min-width: 1024px) {
    .pyr-upper { gap: 15rem; }
    .pyr-lower { gap: 25rem; }
    .pyr-base { gap: 12rem; }
  }
  
  /* Cross layout */
  .cross-shape { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .cross-top, 
  .cross-bot { 
    display: flex; 
    justify-content: center; 
  }
  
  .cross-mid { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
  }
  
  @media (min-width: 768px) {
    .cross-shape { gap: 1rem; }
    .cross-mid { gap: 8rem; }
  }
  
  @media (min-width: 1024px) {
    .cross-mid { gap: 15rem; }
  }
  
  /* Premium badge */
  .premium-badge {
    position: static;
    transform: none;
    margin-left: 0.75rem;
    background: linear-gradient(135deg, #fcd34d, #f59e0b);
    color: #111;
    font-size: .65rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 9999px;
    letter-spacing: .5px;
  }
</style>

<!-- Tarot Vision AI Button -->
<div class="card bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-700/50">
  <button id="tarot-vision-ai-btn" class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
    <span class="text-2xl">📸</span>
    <span class="text-lg">Tarot Vision AI</span>
    ${!isUnlocked ? '<span class="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full ml-2">🔒 Premium</span>' : ''}
  </button>
</div>

<!-- Spread Selection -->
<div class="card bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
  <h2 class="text-2xl font-bold mb-4 text-amber-400">Choose Your Spread</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    ${Object.keys(this.spreads).map(key => {
      const s = this.spreads[key];
      const locked = premiumSpreads.includes(key) && !isUnlocked;
      const selected = this.selectedSpread === key;
      return `
        <button
          onclick="window.featuresManager.engines.tarot.selectSpread('${key}')"
          class="relative p-4 rounded-lg border-2 transition-all ${
            selected
              ? 'bg-amber-600/30 border-amber-500'
              : locked
              ? 'bg-gray-800/30 border-gray-600 opacity-60 cursor-not-allowed'
              : 'bg-gray-800/50 border-gray-600 hover:border-amber-500'
          }"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-bold text-amber-100">${s.name}</span>
            ${locked ? '<span class="text-xs">🔒</span>' : ''}
          </div>
          <p class="text-sm text-gray-400">${s.desc}</p>
          <p class="text-xs text-gray-500 mt-2">${s.cards} card${s.cards > 1 ? 's' : ''}</p>
        </button>
      `;
    }).join('')}
  </div>
</div>

<!-- Cards Display -->
<div class="card bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
  <div class="flex justify-between items-center mb-6">
    <h2 class="text-2xl font-bold text-amber-400 flex items-center">
      ${spread.name}
      ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
    </h2>
    <button
      onclick="window.featuresManager.engines.tarot.reset()"
      class="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
    >
      🔄 New Reading
    </button>
  </div>
  
  <p class="text-gray-400 mb-6">${spread.desc}</p>
  
  ${this.renderSpreadLayout(spread)}
</div>
    `;

    // Initialize event handlers after DOM is updated
    this.init();
  }

  /**
   * Render the layout for the current spread
   * @param {Object} spread - Spread configuration
   * @returns {string} HTML for spread layout
   */
  renderSpreadLayout(spread) {
    if (this.selectedSpread === 'pyramid') {
      return this.renderPyramidLayout();
    } else if (this.selectedSpread === 'cross') {
      return this.renderCrossLayout();
    } else {
      return this.renderGridLayout(spread);
    }
  }

  /**
   * Render standard grid layout
   * @param {Object} spread - Spread configuration
   * @returns {string} HTML for grid layout
   */
  renderGridLayout(spread) {
    const gridClass = spread.cards === 1 ? 'grid-cols-1' :
                      spread.cards === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                      spread.cards === 5 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5' :
                      spread.cards === 6 ? 'grid-cols-2 md:grid-cols-3' :
                      'grid-cols-2 md:grid-cols-3';

    return `
      <div class="grid ${gridClass}">
        ${Array.from({ length: spread.cards }, (_, i) => this.renderCard(i, spread.positions[i])).join('')}
      </div>
    `;
  }

  /**
   * Render pyramid spread layout
   * @returns {string} HTML for pyramid layout
   */
  renderPyramidLayout() {
    return `
      <div class="pyramid-triangle">
        <div class="pyr-row pyr-apex">${this.renderCard(0, 'Where you came from')}</div>
        <div class="pyr-row pyr-upper">${this.renderCard(1, 'Where you came from')}${this.renderCard(2, 'Where you came from')}</div>
        <div class="pyr-row pyr-lower">${this.renderCard(3, 'Where you are now')}${this.renderCard(4, 'Where you are now')}${this.renderCard(5, 'Where you are now')}</div>
        <div class="pyr-row pyr-base">${this.renderCard(6, 'Where are you going')}${this.renderCard(7, 'Where are you going')}${this.renderCard(8, 'Where are you going')}</div>
      </div>
    `;
  }

  /**
   * Render cross spread layout
   * @returns {string} HTML for cross layout
   */
  renderCrossLayout() {
    const positions = this.spreads.cross.positions;
    return `
      <div class="cross-shape">
        <div class="cross-top">${this.renderCard(0, positions[0])}</div>
        <div class="cross-mid">${this.renderCard(1, positions[1])}${this.renderCard(2, positions[2])}${this.renderCard(3, positions[3])}</div>
        <div class="cross-bot">${this.renderCard(4, positions[4])}</div>
      </div>
    `;
  }

  /**
   * Render individual card
   * @param {number} index - Card index
   * @param {string} position - Position label
   * @returns {string} HTML for card
   */
  renderCard(index, position) {
    return `
      <div class="flex flex-col items-center mx-auto">
        <div
          id="tarot-card-container-${index}"
          class="tarot-card-flip-container"
          onclick="window.featuresManager.engines.tarot.flipCard(${index})"
        >
          <div class="tarot-card-inner">
            <div class="tarot-card-back"></div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div class="mt-3 text-center">
          <p class="text-sm font-semibold text-amber-300 mb-2">${position}</p>
          <div id="tarot-card-details-${index}" class="tarot-card-details hidden"></div>
        </div>
      </div>
    `;
  }

  /* ==================== PUBLIC METHODS ==================== */

  /**
   * Initialize the tarot tab and set up event handlers
   */
  init() {
    // Attach vision AI button handler
    setTimeout(() => {
      const visionBtn = document.getElementById('tarot-vision-ai-btn');
      if (visionBtn) {
        const handler = () => {
          const locked = !this.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
          if (locked) {
            this.app?.showToast?.('🔒 Unlock Tarot Vision AI in the Karma Shop!', 'info');
          } else {
            this.app?.showToast?.('📸 Tarot Vision AI opening...', 'info');
            // Add your AI vision feature trigger here
          }
        };
        visionBtn.onclick = handler;
        this.cleanup = () => { visionBtn.onclick = null; };
      }
    }, 0);
  }

  /**
   * Select a spread and prepare new reading
   * @param {string} spreadKey - Key of the spread to select
   */
  selectSpread(spreadKey) {
    const premiumSpreads = ['options', 'pyramid', 'cross'];
    
    // Check if spread is locked
    if (premiumSpreads.includes(spreadKey) && 
        !this.app?.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads')) {
      this.app?.showToast?.('🔒 Unlock Advanced Tarot Spreads in the Karma Shop!', 'info');
      return;
    }
    
    this.selectedSpread = spreadKey;
    this.prepareReading();
    this.render();
    
    // Scroll to cards section
    setTimeout(() => {
      const cardsSection = document.querySelector('#tarot-tab .card:last-child');
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, ANIMATION_TIMING.SCROLL_DELAY);
  }

  /**
   * Reset current spread with new shuffle
   */
  reset() {
    this.selectSpread(this.selectedSpread);
  }
}

// Export for both ES modules and global scope
if (typeof window !== 'undefined') window.TarotEngine = TarotEngine;
export default TarotEngine;