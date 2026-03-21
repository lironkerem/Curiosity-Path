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
    9: "Resilience and persistence. Nearly there-don't give up.",
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
    this.TAROT_BASE_URL = '/public/Tarot Cards images/';
    this.CARD_BACK_URL = '/public/Tarot Cards images/CardBacks.webp';

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
      return `${this.TAROT_BASE_URL}${num}-${name}.webp`;
    }
    
    const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);
    const num = String(number).padStart(2, '0');
    return `${this.TAROT_BASE_URL}${suitCap}${num}.webp`;
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
      console.error(`[TarotEngine] Failed to find card elements for index ${index}`);
      return;
    }

    // Set card image with error handling
    front.innerHTML = `<img src="${card.imageUrl}" alt="${card.name}" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'tarot-card-error\'>🃏</div>'">`;
    
    // Update card details
    details.innerHTML = `<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${card.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${card.meaning}</p>`;
    details.style.opacity = '1';
    details.style.transition = 'opacity 0.5s ease 0.5s';
    
    // Flip the card
    container.classList.add('flipped');

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
    
    // Only record and reward non-trivial spreads (single/three-card are practice draws)
    const excludedSpreads = ['single', 'three'];
    if (!excludedSpreads.includes(this.selectedSpread)) {
      // Save reading — this triggers handleTarotGamification in AppState which awards
      // XP and progresses daily/weekly/monthly quests. Do NOT also call progressQuest
      // here or it will double-count.
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

      // Increment badge-tracking counter (separate from quest progress)
      if (this.app.gamification) {
        this.app.gamification.incrementTarotSpreads();
      }

      this.checkAchievements();
    }
  }

  /**
   * Check and grant badges based on total tarot spreads completed
   */
  checkAchievements() {
    const total = this.app.gamification?.state?.totalTarotSpreads || 0;
    const gm = this.app.gamification;
    if (!gm) return;

    // Map milestones to existing badge definitions in GamificationEngine
    if (total >= 1)   gm.checkAndGrantBadge('first_tarot',        gm.getBadgeDefinitions());
    if (total >= 10)  gm.checkAndGrantBadge('tarot_apprentice',   gm.getBadgeDefinitions());
    if (total >= 25)  gm.checkAndGrantBadge('tarot_mystic',       gm.getBadgeDefinitions());
    if (total >= 75)  gm.checkAndGrantBadge('tarot_oracle',       gm.getBadgeDefinitions());
    if (total >= 150) gm.checkAndGrantBadge('tarot_150',          gm.getBadgeDefinitions());
    if (total >= 400) gm.checkAndGrantBadge('tarot_400',          gm.getBadgeDefinitions());
  }

  /* ==================== RENDERING ==================== */

  /**
   * Render the tarot interface
   */
  buildTarotCTA() {
    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/public/Tabs/CommunityHub.webp" type="image/webp"><img src="/public/Tabs/CommunityHub.png" alt="Community" width="480" height="360" loading="lazy" decoding="async" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Learn & Practice Tarot with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Explore the cards together. Join live readings, share interpretations,
          and deepen your intuition in a space of collective wisdom.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'tarot'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"/></svg>
            Enter the Tarot Room
          </button>
        </div>
      </div>
    `;
  }

  render() {
    // Clean up any previous event handlers
    if (this.cleanup) this.cleanup();

    const tab = document.getElementById('tarot-tab');
    if (!tab) {
      console.error('[TarotEngine] tarot-tab element not found');
      return;
    }

    const spread = this.spreads[this.selectedSpread];
    const customKeys = ['options', 'pyramid', 'cross'];
    let cardArea = '';

    // Generate card area based on spread type
    if (customKeys.includes(this.selectedSpread)) {
      cardArea = this.renderCustomSpread(this.selectedSpread);
    } else {
      const num = spread.cards;
      let gridClass = 'md:grid-cols-1';
      if (num === 3) gridClass = 'md:grid-cols-3';
      else if (num === 6) gridClass = 'grid-cols-2 md:grid-cols-3';
      cardArea = `<div class="grid ${gridClass} place-items-center">${Array.from({ length: num }).map((_, i) => this.cardMarkup(i, spread.positions[i])).join('')}</div>`;
    }

    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/public/Tabs/NavTarot.webp');
                         --header-title:'';
                         --header-tag:'Self divination, through different Tarot spreads, to assist you in understanding yourself better'">
            <h1>Tarot Cards Guidance</h1>
            <h3>Self divination, through different Tarot spreads, to assist you in understanding yourself better</h3>
            <span class="header-sub"></span>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            ${Object.entries(this.spreads).map(([key, sp]) => {
              const isPremium = ['options', 'pyramid', 'cross'].includes(key);
              const isPrivileged = this.app.state?.currentUser?.isAdmin || this.app.state?.currentUser?.isVip;
              const isLocked = isPremium && !isPrivileged && !this.app.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads');
              return `
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${key}')"
                   class="card cursor-pointer relative ${this.selectedSpread === key ? 'border-4' : ''} ${isLocked ? 'opacity-75' : ''}"
                   style="${this.selectedSpread === key ? 'border-color: var(--neuro-accent);' : ''} padding: 1.5rem;"
                   title="${isLocked ? 'Purchase Advanced Tarot Spreads in Karma Shop to unlock' : ''}">
                ${isPremium ? '<span class="premium-badge-tr">PREMIUM</span>' : ''}
                ${isLocked ? '<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>' : ''}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${sp.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${sp.desc}</p>
              </div>`;
            }).join('')}
          </div>

          <div class="flex justify-center" style="margin-bottom: 3rem;padding:0 1.5rem;">
            ${(() => {
              const isPrivileged = this.app?.state?.currentUser?.isAdmin || this.app?.state?.currentUser?.isVip;
              const has = isPrivileged || this.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
              const locked = !has;
              return `
                <button id="tarot-vision-ai-btn"
                        class="btn w-full inline-flex items-center justify-center gap-3 px-6 py-6 text-xl font-bold text-white rounded-xl shadow transition-transform ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12s1.5-3 5-3 5 3 5 3-1.5 3-5 3-5-3-5-3Z"/><circle cx="12" cy="12" r="1"/></svg> Tarot Vision AI – Take a picture/upload a tarot card to analyse it
                  ${locked ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;opacity:0.3;margin-left:0.5rem;flex-shrink:0;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' : ''}
                  <span class="premium-badge">PREMIUM</span>
                </button>`;
            })()}
          </div>

          ${this.buildTarotCTA()}

          <div class="card" id="tarot-cards-result" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${spread.name}</h3>
            </div>
            ${cardArea}
          </div>

        </div>
      </div>

<style>
  .tarot-card-flip-container { 
    width: 100%;
    max-width: 200px;
    aspect-ratio: 200 / 350; 
    perspective: 1000px; 
    cursor: pointer; 
    position: relative;
    margin: 0 auto;
  }
  
  .tarot-card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  
  .tarot-card-flip-container.flipped .tarot-card-flip-inner {
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
  }
  
  .tarot-card-back {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .tarot-card-back img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .card-reveal-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
    color: var(--neuro-text);
    font-weight: 600;
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid rgba(128, 0, 128, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    font-size: 0.7rem;
    max-width: 90%;
  }
  
  .tarot-card-front {
    transform: rotateY(180deg);
  }
  
  .tarot-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .tarot-card-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background: #1a1a1a;
    border-radius: 8px;
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
    .card-reveal-prompt {
      padding: 1rem 1.5rem;
      border-width: 3px;
      font-size: 1rem;
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
    `;

    // Initialize event handlers after DOM is updated
    this.init();
  }

  /**
   * Generate card markup for a single card position
   * @param {number} index - Card index
   * @param {string} label - Position label
   * @returns {string} HTML for card
   */
  cardMarkup(index, label) {
    return `
      <div class="flex flex-col items-center mx-auto" style="width: clamp(140px, 24vw, 250px);">
        <h4 class="text-lg font-bold h-8" style="color: var(--neuro-accent); margin-bottom: 0rem;">${label}</h4>
        <div class="tarot-card-flip-container" id="tarot-card-container-${index}" onclick="window.featuresManager.engines.tarot.flipCard(${index})">
          <div class="tarot-card-flip-inner">
            <div class="tarot-card-back">
              <p class="card-reveal-prompt">Click to reveal</p>
              <img src="${this.CARD_BACK_URL}" alt="Card Back" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350">
            </div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div id="tarot-card-details-${index}" class="text-center" style="opacity: 0; height: clamp(60px, 12vw, 100px); overflow-y: auto; margin-top: 0rem;"></div>
      </div>`;
  }

  /**
   * Render custom spread layouts (pyramid, cross, options)
   * @param {string} spreadKey - Spread identifier
   * @returns {string} HTML for custom spread
   */
  renderCustomSpread(spreadKey) {
    const positions = this.spreads[spreadKey].positions;
    
    if (spreadKey === 'options') {
      return `
        <div class="flex flex-col items-center">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid grid-cols-3 place-items-center" style="margin-bottom: 1.5rem;">
            ${positions.slice(0, 3).map((p, i) => this.cardMarkup(i, p)).join('')}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid grid-cols-3 place-items-center" style="margin-bottom: 1.5rem;">
            ${positions.slice(3, 6).map((p, i) => this.cardMarkup(i + 3, p)).join('')}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid grid-cols-3 place-items-center">
            ${positions.slice(6, 9).map((p, i) => this.cardMarkup(i + 6, p)).join('')}
          </div>
        </div>`;
    }
    
    if (spreadKey === 'pyramid') {
      return `
        <div class="pyramid-triangle">
          <div class="pyr-row pyr-apex">${this.cardMarkup(8, positions[8])}${this.cardMarkup(0, positions[0])}</div>
          <div class="pyr-row pyr-upper">${this.cardMarkup(7, positions[7])}${this.cardMarkup(1, positions[1])}</div>
          <div class="pyr-row pyr-lower">${this.cardMarkup(6, positions[6])}${this.cardMarkup(2, positions[2])}</div>
          <div class="pyr-row pyr-base">${this.cardMarkup(5, positions[5])}${this.cardMarkup(4, positions[4])}${this.cardMarkup(3, positions[3])}</div>
        </div>`;
    }
    
    if (spreadKey === 'cross') {
      return `
        <div class="cross-shape">
          <div class="cross-top">${this.cardMarkup(3, positions[3])}</div>
          <div class="cross-mid">${this.cardMarkup(0, positions[0])}${this.cardMarkup(2, positions[2])}${this.cardMarkup(1, positions[1])}</div>
          <div class="cross-bot">${this.cardMarkup(4, positions[4])}</div>
        </div>`;
    }
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
          const isPrivileged = this.app?.state?.currentUser?.isAdmin || this.app?.state?.currentUser?.isVip;
          const locked = !isPrivileged && !this.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
          if (locked) {
            this.app?.showToast?.('Unlock Tarot Vision AI in the Karma Shop!', 'info');
          } else {
            this.app?.showToast?.('Tarot Vision AI opening...', 'info');
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
    const isPrivileged = this.app?.state?.currentUser?.isAdmin || this.app?.state?.currentUser?.isVip;
    if (!isPrivileged && premiumSpreads.includes(spreadKey) && 
        !this.app?.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads')) {
      this.app?.showToast?.('Unlock Advanced Tarot Spreads in the Karma Shop!', 'info');
      return;
    }
    
    this.selectedSpread = spreadKey;
    this.prepareReading();
    this.render();
    
    // Scroll to cards section
    setTimeout(() => {
      const cardsSection = document.querySelector('#tarot-cards-result');
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