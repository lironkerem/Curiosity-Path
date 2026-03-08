// Features/DailyCards.js

import TarotEngine from '../Features/TarotEngine.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

/**
 * DailyCards - Manages daily card reveals (Tarot, Affirmation, Booster, Inquiry)
 * Features: Card flipping animations, midnight timer, localStorage caching,
 * daily rotation of content
 */
export default class DailyCards {
  // Constants
  static CARD_BACK_URL = '/public/Tarot%20Cards%20images/CardBacks.webp';
  
  static STORAGE_KEYS = {
    BOOSTER: 'daily_booster',
    TAROT: 'daily_tarot_card',
    INQUIRY: 'daily_inquiry',
    AFFIRMATION: 'daily_affirmation',
    FLIPPED_PREFIX: 'daily_card_flipped_'
  };
  
  static CARD_TYPES = {
    TAROT: 'tarot',
    AFFIRMATION: 'affirmation',
    BOOSTER: 'booster',
    INQUIRY: 'inquiry'
  };

  static INQUIRY_DOMAINS = [
    'Responsibility and Power',
    'Emotional Honesty',
    'Identity and Roles',
    'Creativity and Expression',
    'Shadow and Integration',
    'Wisdom and Insight',
    'Joy and Fulfillment',
    'Physical Well-Being and Energy',
    'Relationship',
    'Spiritual Growth'
  ];

  static INTENSITY_EMOJIS = {
    1: '🌱',
    2: '🌿',
    3: '🌳',
    4: '🔥'
  };

  static FLIP_MESSAGES = {
    tarot: 'Tarot card revealed!',
    affirmation: 'Affirmation revealed!',
    booster: 'Booster revealed!',
    inquiry: 'Daily inquiry revealed!'
  };

  static TODAY_CACHE_DURATION = 60000; // 1 minute
  static MS_PER_DAY = 86400000;
  static FALLBACK_BOOSTERS = [
    { 
      id: 1, 
      title: '5-Minute Dance Party', 
      emoji: '💃', 
      description: 'Put on your favorite song and move!', 
      duration: '5 min', 
      category: 'Movement' 
    },
    { 
      id: 2, 
      title: 'Gratitude Snapshot', 
      emoji: '📸', 
      description: 'Notice 3 beautiful things around you', 
      duration: '3 min', 
      category: 'Gratitude' 
    },
    { 
      id: 3, 
      title: 'Power Pose', 
      emoji: '🦸', 
      description: 'Stand like a superhero for 2 minutes', 
      duration: '2 min', 
      category: 'Confidence' 
    }
  ];

  constructor(app) {
    this.app = app;
    this.happinessBoosters = [];
    this.boostersLoaded = false;
    this.timerInterval = null;
    
    // Date caching for performance
    this._todayCache = null;
    this._todayCacheTime = 0;
    
    // Initialize engines
    this.inquiryEngine = new InquiryEngine('beginner');
    this.tarotEngine = new TarotEngine(app);
    
    // Load boosters data
    this.initializeBoosters();
  }

  /* ==================== INITIALIZATION ==================== */

  /**
   * Loads happiness boosters from JSON file with fallback
   */
  async initializeBoosters() {
    try {
      const response = await fetch('./Features/Data/HappinessBoostersList.json');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      this.happinessBoosters = data.boosters || DailyCards.FALLBACK_BOOSTERS;
      
    } catch (err) {
      console.warn('Failed to load boosters, using fallback:', err);
      this.happinessBoosters = DailyCards.FALLBACK_BOOSTERS;
    }
    
    this.boostersLoaded = true;
  }

  /* ==================== DATE & TIME UTILITIES ==================== */

  /**
   * Gets today's date string with caching
   * @returns {string} Date string
   */
  _getToday() {
    const now = Date.now();
    
    // Return cached value if still valid
    if (now - this._todayCacheTime < DailyCards.TODAY_CACHE_DURATION) {
      return this._todayCache;
    }
    
    this._todayCache = new Date().toDateString();
    this._todayCacheTime = now;
    return this._todayCache;
  }

  /**
   * Gets current day of year (1-365/366)
   * @returns {number} Day of year
   */
  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / DailyCards.MS_PER_DAY);
  }

  /* ==================== STORAGE MANAGEMENT ==================== */

  /**
   * Retrieves data from localStorage with date validation
   * @param {string} key - Storage key
   * @returns {Object|null} Stored data or null
   */
  _getFromStorage(key) {
    const today = this._getToday();
    
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      
      // Only return if it's from today
      return data.date === today ? data : null;
      
    } catch (err) {
      console.error(`Storage read error for ${key}:`, err);
      return null;
    }
  }

  /**
   * Saves data to localStorage with today's date
   * @param {string} key - Storage key
   * @param {Object} value - Data to save
   */
  _saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify({
        ...value,
        date: this._getToday()
      }));
    } catch (err) {
      console.error(`Storage write error for ${key}:`, err);
    }
  }

  /**
   * Checks if a card was already flipped today
   * @param {string} type - Card type
   * @returns {boolean}
   */
  _wasCardFlipped(type) {
    const flippedDate = localStorage.getItem(
      `${DailyCards.STORAGE_KEYS.FLIPPED_PREFIX}${type}`
    );
    return flippedDate === this._getToday();
  }

  /**
   * Marks a card as flipped for today
   * @param {string} type - Card type
   */
  _markCardFlipped(type) {
    localStorage.setItem(
      `${DailyCards.STORAGE_KEYS.FLIPPED_PREFIX}${type}`,
      this._getToday()
    );
  }

  /* ==================== CARD DATA GETTERS ==================== */

  /**
   * Gets a random happiness booster
   * @returns {Object} Booster object
   */
  getRandomBooster() {
    const boosters = this.happinessBoosters?.length 
      ? this.happinessBoosters 
      : DailyCards.FALLBACK_BOOSTERS;
    
    const index = Math.floor(Math.random() * boosters.length);
    return boosters[index];
  }

  /**
   * Gets daily happiness booster (always fresh/random)
   * @returns {Object} Booster object
   */
  getDailyBooster() {
    // Boosters are intentionally random each time, not cached
    return this.getRandomBooster();
  }

  /**
   * Gets daily tarot card (seeded by day of year)
   * @returns {Object} Tarot card object with name, meaning, image
   */
  getDailyTarotCard() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.TAROT);
    if (cached) return cached.card;
    
    // Generate deterministic card based on day of year
    const deck = this.tarotEngine.shuffleDeck(this.tarotEngine.buildFullDeck());
    const dayOfYear = this._getDayOfYear();
    const selectedCard = deck[dayOfYear % 78]; // 78 cards in tarot deck
    
    const card = {
      name: this.tarotEngine.getTarotCardName(selectedCard.number, selectedCard.suit),
      meaning: this.tarotEngine.getTarotCardMeaning(selectedCard.number, selectedCard.suit),
      image: this.tarotEngine.getTarotCardImage(selectedCard.number, selectedCard.suit)
    };
    
    this._saveToStorage(DailyCards.STORAGE_KEYS.TAROT, { card });
    return card;
  }

  /**
   * Gets a random affirmation from global affirmations list
   * @returns {string} Affirmation text
   */
  getRandomAffirmation() {
    const affirmationsList = window.affirmations?.general_positive_affirmations || [];
    
    if (!affirmationsList.length) {
      return "I am worthy of love and belonging exactly as I am.";
    }
    
    const index = Math.floor(Math.random() * affirmationsList.length);
    const affirmation = affirmationsList[index];
    
    // Handle both string and object formats
    return typeof affirmation === 'string' ? affirmation : affirmation.text;
  }

  /**
   * Gets daily affirmation (cached per day)
   * @returns {string} Affirmation text
   */
  getDailyAffirmation() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.AFFIRMATION);
    if (cached) return cached.affirmation;
    
    const affirmation = this.getRandomAffirmation();
    this._saveToStorage(DailyCards.STORAGE_KEYS.AFFIRMATION, { affirmation });
    return affirmation;
  }

  /**
   * Gets daily inquiry question (cached per day)
   * @returns {Object} Inquiry object with domain, question, intensity
   */
  getDailyInquiry() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.INQUIRY);
    if (cached) return cached.inquiry;
    
    // Select random domain
    const randomDomain = DailyCards.INQUIRY_DOMAINS[
      Math.floor(Math.random() * DailyCards.INQUIRY_DOMAINS.length)
    ];
    
    const inquiry = this.inquiryEngine.getRandomQuestion(randomDomain);
    this._saveToStorage(DailyCards.STORAGE_KEYS.INQUIRY, { inquiry });
    return inquiry;
  }

  /* ==================== MIDNIGHT TIMER ==================== */

  /**
   * Initializes countdown timer to midnight
   */
  initMidnightTimer() {
    this.stopMidnightTimer(); // Clean up any existing timer
    
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );
      const msUntilMidnight = tomorrow - now;
      
      // Calculate time components
      const hours = Math.floor(msUntilMidnight / 3600000);
      const minutes = Math.floor((msUntilMidnight % 3600000) / 60000);
      const seconds = Math.floor((msUntilMidnight % 60000) / 1000);
      
      // Update timer display
      const timerEl = document.getElementById('daily-cards-timer');
      if (timerEl) {
        timerEl.textContent = `Resets in ${hours}h ${minutes}m ${seconds}s`;
      }
      
      // Reload page at midnight
      if (msUntilMidnight <= 1000) {
        setTimeout(() => location.reload(), msUntilMidnight);
      }
    };
    
    updateTimer(); // Initial update
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  /**
   * Stops the midnight timer
   */
  stopMidnightTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /* ==================== CARD FLIPPING ==================== */

  /**
   * Flips a daily card
   * @param {string} type - Card type (tarot, affirmation, booster, inquiry)
   */
  flipDailyCard(type) {
    const cardEl = document.getElementById(`${type}-flip`);
    const headerEl = document.getElementById(`${type}-header`);
    const wrapperEl = cardEl?.closest('.daily-card-wrapper');
    
    if (!cardEl || !headerEl || !wrapperEl) {
      console.warn(`Card elements not found for type: ${type}`);
      return;
    }
    
    const isCurrentlyFlipped = cardEl.classList.contains('flipped');
    
    // Update dynamic content before flipping (for cards that change)
    if (!isCurrentlyFlipped) {
      if (type === DailyCards.CARD_TYPES.BOOSTER) {
        this._updateBoosterContent(cardEl);
      } else if (type === DailyCards.CARD_TYPES.INQUIRY) {
        this._updateInquiryContent(cardEl);
      }
    }
    
    // Toggle flip state
    cardEl.classList.toggle('flipped');
    headerEl.classList.toggle('flipped');
    wrapperEl.classList.toggle('flipped');
    
    // Save flip state and show notification
    if (cardEl.classList.contains('flipped')) {
      this._markCardFlipped(type);
      this.app.showToast(
        DailyCards.FLIP_MESSAGES[type] || 'Card revealed!',
        'success'
      );
    }
  }

  /**
   * Updates booster card content with fresh random booster
   * @param {HTMLElement} cardEl - Card element
   */
  _updateBoosterContent(cardEl) {
    const booster = this.getRandomBooster();
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="dashboard-booster-emoji">${booster.emoji}</div>
        <div class="inquiry-domain-badge">
          <span>${booster.title}</span>
        </div>
        <p class="dashboard-booster-description">${booster.description}</p>
        <p class="dashboard-booster-meta">${booster.duration} • ${booster.category}</p>
      `;
    }
  }

  /**
   * Updates inquiry card content
   * @param {HTMLElement} cardEl - Card element
   */
  _updateInquiryContent(cardEl) {
    const inquiry = this.getDailyInquiry();
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="dashboard-booster-emoji">
          ${DailyCards.INTENSITY_EMOJIS[inquiry.intensity] || '💭'}
        </div>
        <div class="inquiry-domain-badge">
          <span>${inquiry.domain}</span>
        </div>
        <p class="dashboard-booster-description">${inquiry.question}</p>
      `;
    }
  }

  /* ==================== RENDERING ==================== */

  /**
   * Renders a card template with flip animation
   * @param {string} type - Card type
   * @param {Object} config - Card configuration
   * @returns {string} HTML string
   */
  _renderCardTemplate(type, config) {
    const { title, frontTitle, frontContent, gradient = '' } = config;
    
    // Boosters don't persist flip state, others do
    const wasFlipped = type === DailyCards.CARD_TYPES.BOOSTER 
      ? false 
      : this._wasCardFlipped(type);
    
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="daily-card-full-container">
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" 
               onclick="window.app.dailyCards.flipDailyCard('${type}')">
            <div class="daily-card-inner ${flippedClass}" id="${type}-flip">
              
              <!-- Card Back -->
              <div class="daily-card-back">
                <p class="card-reveal-prompt">Click to reveal</p>
                <picture><source srcset="${DailyCards.CARD_BACK_URL}" type="image/webp"><img src="${DailyCards.CARD_BACK_URL.replace('.webp', '.jpg')}" 
                     alt="Card Back" 
                     class="dashboard-card-image"
                     loading="lazy"
                     decoding="async"></picture>
              </div>
              
              <!-- Card Front -->
              <div class="daily-card-front ${gradient}">
                ${frontContent}
              </div>
              
            </div>
          </div>
        </div>
        
        <!-- Card Header -->
        <div class="daily-card-header-container ${flippedClass}" id="${type}-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">${title}</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">${frontTitle}</h3>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders tarot card
   * @param {string} type - Card type identifier
   * @param {Object} card - Tarot card data
   * @returns {string} HTML string
   */
  renderDailyCard(type, card) {
    return this._renderCardTemplate(type, {
      title: 'Daily Tarot Guidance',
      frontTitle: 'Daily Vibe',
      frontContent: `
        <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
          <picture><source srcset="${card.image.replace(/\.(jpg|jpeg|png)$/i, '.webp')}" type="image/webp"><img src="${card.image}" 
               alt="${card.name}" 
               style="width: 100%; max-height: 70%; flex-shrink: 0; object-fit: contain;"
               loading="lazy"
               decoding="async"></picture>
          <div style="text-align: center; overflow-y: auto; padding: 0.75rem; flex: 1;">
            <h4 class="tarot-card-name">${card.name}</h4>
            <p class="tarot-card-meaning">${card.meaning}</p>
          </div>
        </div>
      `
    });
  }

  /**
   * Renders affirmation card
   * @param {string} affirmation - Affirmation text
   * @returns {string} HTML string
   */
  renderAffirmationCard(affirmation) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.AFFIRMATION, {
      title: 'Daily Affirmation',
      frontTitle: 'Today\'s Mantra',
      gradient: 'daily-card-gradient-affirmation',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <p class="dashboard-affirmation-text">${affirmation}</p>
        </div>
      `
    });
  }

  /**
   * Renders happiness booster card
   * @param {Object} booster - Booster data
   * @returns {string} HTML string
   */
  renderBoosterCard(booster) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.BOOSTER, {
      title: 'Happiness Booster',
      frontTitle: 'Just Do It',
      gradient: 'daily-card-gradient-booster',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${booster.emoji}</div>
            <div class="inquiry-domain-badge">
              <span>${booster.title}</span>
            </div>
            <p class="dashboard-booster-description">${booster.description}</p>
            <p class="dashboard-booster-meta">${booster.duration} • ${booster.category}</p>
          </div>
        </div>
      `
    });
  }

  /**
   * Renders inquiry card
   * @param {Object} inquiry - Inquiry data
   * @returns {string} HTML string
   */
  renderInquiryCard(inquiry) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.INQUIRY, {
      title: 'Daily Self-Inquiry',
      frontTitle: 'Be Honest',
      gradient: 'daily-card-gradient-inquiry',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">
              ${DailyCards.INTENSITY_EMOJIS[inquiry.intensity] || '💭'}
            </div>
            <div class="inquiry-domain-badge">
              <span>${inquiry.domain}</span>
            </div>
            <p class="dashboard-booster-description">${inquiry.question}</p>
          </div>
        </div>
      `
    });
  }

  /**
   * Renders complete daily cards section
   * @returns {string} HTML string
   */
  renderDailyCardsSection() {
    const dailyCard = this.getDailyTarotCard();
    const dailyAff = this.getDailyAffirmation();
    const dailyBooster = this.getDailyBooster();
    const dailyInquiry = this.getDailyInquiry();
    
    // Initialize timer after render
    setTimeout(() => this.initMidnightTimer(), 100);
    
    return `
      <div class="card dashboard-quest-hub mb-8" style="position: relative;">
        <span id="daily-cards-timer" class="countdown-badge"></span>
        <div class="dashboard-quest-header">
          <h3 class="dashboard-quest-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="10" height="14" x="2" y="5" rx="2"/><rect width="10" height="14" x="12" y="5" rx="2"/></svg> Your Daily Cards</h3>
        </div>
        <div class="grid grid-cols-2 gap-6" id="daily-cards-container">
          ${this.renderDailyCard(DailyCards.CARD_TYPES.TAROT, dailyCard)}
          ${this.renderAffirmationCard(dailyAff)}
          ${this.renderBoosterCard(dailyBooster)}
          ${this.renderInquiryCard(dailyInquiry)}
        </div>
      </div>
    `;
  }

  /* ==================== CLEANUP ==================== */

  /**
   * Cleanup method - stops timer and clears resources
   */
  destroy() {
    this.stopMidnightTimer();
    this._todayCache = null;
    this._todayCacheTime = 0;
  }
}