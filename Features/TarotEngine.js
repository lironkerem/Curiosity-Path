/**
 * TarotEngine.js - Tarot Reading Engine
 * Handles tarot card spreads, shuffling, revealing, and rendering
 */

class TarotEngine {
  // Constants
  static MAJOR_ARCANA_COUNT = 22; // 0-21
  static MINOR_ARCANA_PER_SUIT = 14; // 1-14 (1-10 pips, 11-14 court)
  static SUITS = ['pentacles', 'swords', 'cups', 'wands'];
  
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
        positions: [
          'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 
          'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 
          'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)'
        ] 
      },
      pyramid: {
        name: 'The Pyramid Spread',
        cards: 9,
        desc: 'Triangle of Past – Present – Future',
        positions: [
          'Where you came from', 'Where you came from', 'Where you came from', 
          'Where you are now', 'Where you are now', 'Where you are now', 
          'Where are you going', 'Where are you going', 'Where are you going'
        ]
      },
      cross: { 
        name: 'The Simple Cross Spread', 
        cards: 5, 
        desc: 'A Simple Cross Snapshot of Now', 
        positions: ['Direction of the Situation', 'The Root of the Situation', 'Summary', 'Positive side of Situation', 'Obstacles-Challenges'] 
      }
    };

    // State management
    this.selectedSpread = 'single';
    this.shuffledDeck = [];
    this.flippedCards = new Set();
    this.currentReading = [];
    this.cleanup = null;
    
    this.prepareReading();
  }

  /* ==================== CARD DATA ==================== */
  
  /**
   * Consolidated Major Arcana data
   * Each entry: [number, name, meaning]
   */
  static MAJOR_ARCANA = [
    [0, "The Fool", "A sacred beginning, full of faith and curiosity. Trust the unknown path before you."],
    [1, "The Magician", "All the tools are in your hands. You are the bridge between spirit and matter."],
    [2, "The High Priestess", "Silence holds the answers you seek. Trust your inner knowing."],
    [3, "The Empress", "The Earth mirrors your abundance. Nurture what you love."],
    [4, "The Emperor", "True power is built through order and wisdom. Take authority over your life."],
    [5, "The Hierophant", "Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom."],
    [6, "The Lovers", "Union of soul and choice of heart. Harmony is born when love aligns with truth."],
    [7, "The Chariot", "Willpower shapes destiny. Victory is achieved through balance of heart and mind."],
    [8, "Strength", "Gentle courage tames inner storms. True strength is soft yet unbreakable."],
    [9, "The Hermit", "Withdraw to reconnect with your light. The answers you seek are within."],
    [10, "Wheel of Fortune", "Life turns in divine rhythm. Every rise and fall carries hidden blessings."],
    [11, "Justice", "The scales always balance in time. Choose integrity."],
    [12, "The Hanged Man", "Surrender brings revelation. Sometimes you must pause to see from a higher angle."],
    [13, "Death", "Endings are beginnings disguised. Transformation renews you into higher truth."],
    [14, "Temperance", "Balance is your sacred art. Patience and moderation bring peace."],
    [15, "The Devil", "Bondage is often self-made. Recognize what controls you and reclaim your power."],
    [16, "The Tower", "When illusion collapses, liberation follows. Trust the breakdown."],
    [17, "The Star", "Hope returns like light after storm. Believe again in miracles."],
    [18, "The Moon", "The path is unclear but alive with mystery. Feel your way through intuition."],
    [19, "The Sun", "Joy, clarity, and vitality fill your being. Let your light shine."],
    [20, "Judgement", "Awakening through self-realization. Rise into your higher purpose."],
    [21, "The World", "Completion, integration, and mastery. Celebrate how far you've come."]
  ];

  /**
   * Minor Arcana meanings by suit and number
   */
  static MINOR_ARCANA_MEANINGS = {
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

  /**
   * Court card meanings
   */
  static COURT_MEANINGS = {
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

  /**
   * Court card rank mappings
   */
  static COURT_RANKS = {
    11: 'Page',
    12: 'Knight',
    13: 'Queen',
    14: 'King'
  };

  /* ==================== CARD UTILITIES ==================== */

  /**
   * Get card name by number and suit
   * @param {number} number - Card number
   * @param {string} suit - Card suit (major, pentacles, swords, cups, wands)
   * @returns {string} Card name
   */
  getTarotCardName(number, suit = 'major') {
    if (suit === 'major') {
      const card = TarotEngine.MAJOR_ARCANA.find(c => c[0] === number);
      return card ? card[1] : "The Fool";
    }
    
    // Minor/Court cards
    const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
    if (number <= 10) {
      return `${number} of ${suitName}`;
    }
    
    const rank = TarotEngine.COURT_RANKS[number];
    return `${rank} of ${suitName}`;
  }

  /**
   * Get card image URL
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
   * Get card meaning/interpretation
   * @param {number} number - Card number
   * @param {string} suit - Card suit
   * @returns {string} Card meaning
   */
  getTarotCardMeaning(number, suit = 'major') {
    if (suit === 'major') {
      const card = TarotEngine.MAJOR_ARCANA.find(c => c[0] === number);
      return card ? card[2] : "New beginnings and infinite possibility await you.";
    }
    
    // Minor Arcana (1-10)
    if (number <= 10) {
      return TarotEngine.MINOR_ARCANA_MEANINGS[suit]?.[number] || 
             "This card brings its unique energy to your reading.";
    }
    
    // Court cards (11-14)
    const rank = TarotEngine.COURT_RANKS[number];
    return TarotEngine.COURT_MEANINGS[suit]?.[rank] || 
           "This court card represents a person or energy in your life.";
  }

  /* ==================== DECK MANAGEMENT ==================== */

  /**
   * Build complete 78-card tarot deck
   * @returns {Array} Full deck array
   */
  buildFullDeck() {
    const deck = [];
    
    // Add Major Arcana (22 cards: 0-21)
    for (let i = 0; i < TarotEngine.MAJOR_ARCANA_COUNT; i++) {
      deck.push({ type: 'major', number: i, suit: 'major' });
    }
    
    // Add Minor Arcana (56 cards: 4 suits × 14 cards)
    TarotEngine.SUITS.forEach(suit => {
      for (let i = 1; i <= TarotEngine.MINOR_ARCANA_PER_SUIT; i++) {
        deck.push({ 
          type: i <= 10 ? 'minor' : 'court', 
          number: i, 
          suit 
        });
      }
    });
    
    return deck;
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
   * Prepare new reading - shuffle deck and reset state
   */
  prepareReading() {
    const fullDeck = this.buildFullDeck();
    this.shuffledDeck = this.shuffleDeck(fullDeck);
    this.flippedCards.clear();
    this.currentReading = [];
  }

  /* ==================== CARD INTERACTION ==================== */

  /**
   * Flip a card and reveal its content
   * @param {number} index - Card index in spread
   */
  flipCard(index) {
    // Prevent double-flipping or flipping when deck is empty
    if (this.flippedCards.has(index) || this.shuffledDeck.length === 0) return;

    // Handle pyramid animation with layout stability
    const pyramid = document.querySelector('.pyramid-triangle');
    if (pyramid) {
      requestAnimationFrame(() => {
        pyramid.style.minHeight = `${pyramid.offsetHeight}px`;
        pyramid.classList.add('flipping');
        setTimeout(() => {
          pyramid.classList.remove('flipping');
          pyramid.style.minHeight = '';
        }, 900);
      });
    }

    // Mark card as flipped
    this.flippedCards.add(index);
    
    // Draw card from deck
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
    const front = container.querySelector('.tarot-card-front');
    const details = document.getElementById(`tarot-card-details-${index}`);

    if (front && details) {
      // Apply flip animation
      container.classList.add('flipped');
      
      // Update card front image
      front.style.backgroundImage = `url('${card.imageUrl}')`;
      
      // Update card details
      details.innerHTML = `
        <div class="text-sm font-semibold text-purple-300 mb-1">${card.name}</div>
        <div class="text-xs text-gray-300 leading-relaxed">${card.meaning}</div>
      `;
    }
  }

  /* ==================== RENDERING ==================== */

  /**
   * Generate HTML for individual card
   * @param {number} index - Card index
   * @param {string} position - Position label
   * @returns {string} HTML string
   */
  renderCard(index, position) {
    const isFlipped = this.flippedCards.has(index);
    const clickable = !isFlipped ? 'cursor-pointer hover:scale-105 transition-transform' : '';

    return `
      <div class="flex flex-col items-center mx-auto">
        <div class="tarot-card-flip-container ${clickable}" 
             id="tarot-card-container-${index}" 
             onclick="${!isFlipped ? `window.app.tarotEngine.flipCard(${index})` : ''}">
          <div class="tarot-card-inner">
            <div class="tarot-card-back"></div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div class="mt-2 text-center text-xs text-gray-400 font-medium">${position}</div>
        <div class="mt-2 text-center text-sm" id="tarot-card-details-${index}">
          ${isFlipped ? '' : '<span class="text-gray-500 text-xs italic">Click to reveal</span>'}
        </div>
      </div>
    `;
  }

  /**
   * Generate layout for pyramid spread
   * @returns {string} HTML string
   */
  renderPyramidLayout() {
    const spread = this.spreads.pyramid;
    return `
      <div class="pyramid-triangle">
        <div class="pyr-row pyr-apex">${this.renderCard(0, spread.positions[0])}</div>
        <div class="pyr-row pyr-upper">
          ${this.renderCard(1, spread.positions[1])}
          ${this.renderCard(2, spread.positions[2])}
        </div>
        <div class="pyr-row pyr-lower">
          ${this.renderCard(3, spread.positions[3])}
          ${this.renderCard(4, spread.positions[4])}
          ${this.renderCard(5, spread.positions[5])}
        </div>
        <div class="pyr-row pyr-base">
          ${this.renderCard(6, spread.positions[6])}
          ${this.renderCard(7, spread.positions[7])}
          ${this.renderCard(8, spread.positions[8])}
        </div>
      </div>
    `;
  }

  /**
   * Generate layout for cross spread
   * @returns {string} HTML string
   */
  renderCrossLayout() {
    const spread = this.spreads.cross;
    return `
      <div class="cross-shape">
        <div class="cross-top">${this.renderCard(0, spread.positions[0])}</div>
        <div class="cross-mid">
          ${this.renderCard(1, spread.positions[1])}
          ${this.renderCard(2, spread.positions[2])}
          ${this.renderCard(3, spread.positions[3])}
        </div>
        <div class="cross-bot">${this.renderCard(4, spread.positions[4])}</div>
      </div>
    `;
  }

  /**
   * Generate layout for grid spreads (single, three, six, options)
   * @returns {string} HTML string
   */
  renderGridLayout() {
    const spread = this.spreads[this.selectedSpread];
    const gridClass = spread.cards === 1 ? 'grid-cols-1' :
                      spread.cards === 3 ? 'grid-cols-1 sm:grid-cols-3' :
                      spread.cards === 6 ? 'grid-cols-2 md:grid-cols-3' :
                      'grid-cols-3';

    return `
      <div class="grid ${gridClass} gap-4">
        ${Array.from({ length: spread.cards }, (_, i) => 
          this.renderCard(i, spread.positions[i])
        ).join('')}
      </div>
    `;
  }

  /**
   * Main render function - generates complete UI
   */
  render() {
    const spread = this.spreads[this.selectedSpread];
    const premiumSpreads = ['options', 'pyramid', 'cross'];
    const isPremium = premiumSpreads.includes(this.selectedSpread);

    // Generate spread layout
    let cardsLayout;
    if (this.selectedSpread === 'pyramid') {
      cardsLayout = this.renderPyramidLayout();
    } else if (this.selectedSpread === 'cross') {
      cardsLayout = this.renderCrossLayout();
    } else {
      cardsLayout = this.renderGridLayout();
    }

    // Main UI structure
    const html = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-purple-300">🔮 Tarot Reading</h2>
            <button id="tarot-vision-ai-btn" 
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors">
              📸 Tarot Vision AI
            </button>
          </div>
          <p class="text-gray-400 text-sm">
            Choose your spread, shuffle the deck, and reveal your cards
          </p>
        </div>

        <!-- Spread Selection -->
        <div class="card">
          <h3 class="text-lg font-semibold text-purple-300 mb-4">Choose Your Spread</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            ${Object.entries(this.spreads).map(([key, s]) => {
              const isSelected = this.selectedSpread === key;
              const isLocked = premiumSpreads.includes(key) && 
                             !this.app.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads');
              
              return `
                <button onclick="window.app.tarotEngine.selectSpread('${key}')"
                        class="p-4 rounded-lg border-2 transition-all ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-500/20' 
                            : 'border-gray-700 bg-gray-800/50 hover:border-purple-600'
                        } ${isLocked ? 'opacity-60' : ''}">
                  <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-white flex items-center">
                      ${s.name}
                      ${isLocked ? '<span class="premium-badge">PREMIUM</span>' : ''}
                    </div>
                  </div>
                  <div class="text-xs text-gray-400">${s.desc}</div>
                  <div class="text-xs text-purple-400 mt-1">${s.cards} card${s.cards > 1 ? 's' : ''}</div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Cards Display -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-purple-300">
                ${spread.name}
                ${isPremium ? '<span class="premium-badge">PREMIUM</span>' : ''}
              </h3>
              <p class="text-sm text-gray-400 mt-1">${spread.desc}</p>
            </div>
            <button onclick="window.app.tarotEngine.reset()" 
                    class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors">
              🔄 New Reading
            </button>
          </div>
          ${cardsLayout}
        </div>
      </div>

      ${this.getStyles()}
    `;

    // Inject HTML
    const tarotTab = document.getElementById('tarot-tab');
    if (tarotTab) {
      tarotTab.innerHTML = html;
    }

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners after render
   */
  setupEventListeners() {
    setTimeout(() => {
      const visionBtn = document.getElementById('tarot-vision-ai-btn');
      if (visionBtn) {
        const handler = () => {
          const locked = !this.app.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
          if (locked) {
            this.app.showToast('🔒 Unlock Tarot Vision AI in the Karma Shop!', 'info');
          } else {
            this.app.showToast('📸 Tarot Vision AI opening...', 'info');
            // Add your AI vision feature trigger here
          }
        };
        visionBtn.onclick = handler;
        this.cleanup = () => { visionBtn.onclick = null; };
      }
    }, 0);
  }

  /**
   * Handle spread selection
   * @param {string} spreadKey - Spread identifier
   */
  selectSpread(spreadKey) {
    const premiumSpreads = ['options', 'pyramid', 'cross'];
    
    // Check premium lock
    if (premiumSpreads.includes(spreadKey) && 
        !this.app.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads')) {
      this.app.showToast('🔒 Unlock Advanced Tarot Spreads in the Karma Shop!', 'info');
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
    }, 100);
  }

  /**
   * Reset current spread
   */
  reset() {
    this.selectSpread(this.selectedSpread);
  }

  /**
   * Get CSS styles for tarot cards
   * @returns {string} Style tag with CSS
   */
  getStyles() {
    return `
<style>
  /* ==================== CARD FLIP MECHANICS ==================== */
  .tarot-card-flip-container {
    width: 100%;
    max-width: 180px;
    aspect-ratio: 2/3;
    perspective: 1000px;
  }

  .tarot-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
    transform-style: preserve-3d;
  }

  .tarot-card-flip-container.flipped .tarot-card-inner {
    transform: rotateY(180deg);
  }

  .tarot-card-back,
  .tarot-card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 0.75rem;
    background-size: cover;
    background-position: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .tarot-card-back {
    background-image: url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/CardBacks.jpg');
  }

  .tarot-card-front {
    transform: rotateY(180deg);
    background-color: #1f2937;
  }

  /* ==================== RESPONSIVE GRID SPACING ==================== */
  #tarot-tab .grid {
    gap: 0.5rem;
    padding: 0 0.5rem;
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

  /* ==================== PYRAMID LAYOUT ==================== */
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

  /* ==================== CROSS LAYOUT ==================== */
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

  /* ==================== PREMIUM BADGE ==================== */
  .premium-badge {
    position: static;
    transform: none;
    margin-left: 0.75rem;
    background: linear-gradient(135deg, #fcd34d, #f59e0b);
    color: #111;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 9999px;
    letter-spacing: 0.5px;
  }
</style>
    `;
  }
}

// Export for module systems and browser global
if (typeof window !== 'undefined') window.TarotEngine = TarotEngine;
export default TarotEngine;