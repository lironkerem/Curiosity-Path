// DailyCards.js - Optimized
// Handles all daily card functionality: Tarot, Affirmation, Booster, and Inquiry

import TarotEngine from '../Features/TarotEngine.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

export default class DailyCards {
  constructor(app) {
    this.app = app;
    this.happinessBoosters = [];
    this.boostersLoaded = false;
    this.timerInterval = null;
    
    // Constants
    this.CARD_BACK_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/CardBacks.jpg';
    this.STORAGE_KEYS = {
      BOOSTER: 'daily_booster',
      TAROT: 'daily_tarot_card',
      INQUIRY: 'daily_inquiry',
      AFFIRMATION: 'daily_affirmation',
      FLIPPED_PREFIX: 'daily_card_flipped_'
    };
    this.CARD_TYPES = {
      TAROT: 'tarot',
      AFFIRMATION: 'affirmation',
      BOOSTER: 'booster',
      INQUIRY: 'inquiry'
    };
    
    // Initialize engines
    this.inquiryEngine = new InquiryEngine('beginner');
    this.tarotEngine = new TarotEngine(app);
    
    // Cache today's date
    this._todayCache = null;
    this._todayCacheTime = 0;
    
    // Load boosters
    this.initializeBoosters();
  }

  // ========== INITIALIZATION ==========
  
  async initializeBoosters() {
    const fallback = [
      { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
      { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
      { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
    ];
    
    try {
      const res = await fetch('./Features/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.happinessBoosters = data.boosters || fallback;
    } catch (err) {
      console.warn('Failed to load boosters, using fallback:', err);
      this.happinessBoosters = fallback;
    }
    
    this.boostersLoaded = true;
  }

  // ========== UTILITIES ==========
  
  _getToday() {
    const now = Date.now();
    if (now - this._todayCacheTime < 60000) return this._todayCache; // Cache for 1 min
    this._todayCache = new Date().toDateString();
    this._todayCacheTime = now;
    return this._todayCache;
  }

  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  _getFromStorage(key) {
    const today = this._getToday();
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      const data = JSON.parse(stored);
      return data.date === today ? data : null;
    } catch (err) {
      console.error(`Storage read error for ${key}:`, err);
      return null;
    }
  }

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

  _wasCardFlipped(type) {
    return localStorage.getItem(`${this.STORAGE_KEYS.FLIPPED_PREFIX}${type}`) === this._getToday();
  }

  _markCardFlipped(type) {
    localStorage.setItem(`${this.STORAGE_KEYS.FLIPPED_PREFIX}${type}`, this._getToday());
  }

  // ========== CARD DATA GETTERS ==========

  getRandomBooster() {
    if (!this.happinessBoosters?.length) {
      const fallback = [
        { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
        { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
        { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
      ];
      const idx = Math.floor(Math.random() * fallback.length);
      return fallback[idx];
    }
    const idx = Math.floor(Math.random() * this.happinessBoosters.length);
    return this.happinessBoosters[idx];
  }

  getDailyBooster() {
    // Always return a fresh random booster - no caching
    return this.getRandomBooster();
  }

  getDailyTarotCard() {
    const cached = this._getFromStorage(this.STORAGE_KEYS.TAROT);
    if (cached) return cached.card;
    
    const deck = this.tarotEngine.shuffleDeck(this.tarotEngine.buildFullDeck());
    const dayOfYear = this._getDayOfYear();
    const c = deck[dayOfYear % 78];
    
    const card = {
      name: this.tarotEngine.getTarotCardName(c.number, c.suit),
      meaning: this.tarotEngine.getTarotCardMeaning(c.number, c.suit),
      image: this.tarotEngine.getTarotCardImage(c.number, c.suit)
    };
    
    this._saveToStorage(this.STORAGE_KEYS.TAROT, { card });
    return card;
  }

  getRandomAffirmation() {
    const affirmationsList = window.affirmations?.general_positive_affirmations || [];
    if (!affirmationsList.length) {
      return "I am worthy of love and belonging exactly as I am.";
    }
    
    const idx = Math.floor(Math.random() * affirmationsList.length);
    const affirmation = affirmationsList[idx];
    return typeof affirmation === 'string' ? affirmation : affirmation.text;
  }

  getDailyAffirmation() {
    const cached = this._getFromStorage(this.STORAGE_KEYS.AFFIRMATION);
    if (cached) return cached.affirmation;
    
    const affirmation = this.getRandomAffirmation();
    this._saveToStorage(this.STORAGE_KEYS.AFFIRMATION, { affirmation });
    return affirmation;
  }

  getDailyInquiry() {
    const cached = this._getFromStorage(this.STORAGE_KEYS.INQUIRY);
    if (cached) return cached.inquiry;
    
    const domains = [
      'Responsibility and Power', 'Emotional Honesty', 'Identity and Roles',
      'Creativity and Expression', 'Shadow and Integration', 'Wisdom and Insight',
      'Joy and Fulfillment', 'Physical Well-Being and Energy', 'Relationship',
      'Spiritual Growth'
    ];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const inquiry = this.inquiryEngine.getRandomQuestion(randomDomain);
    
    this._saveToStorage(this.STORAGE_KEYS.INQUIRY, { inquiry });
    return inquiry;
  }

  // ========== TIMER ==========

  initMidnightTimer() {
    this.stopMidnightTimer(); // Clean up existing
    
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow - now;
      
      const hours = Math.floor(msUntilMidnight / 3600000);
      const minutes = Math.floor((msUntilMidnight % 3600000) / 60000);
      const seconds = Math.floor((msUntilMidnight % 60000) / 1000);
      
      const timerEl = document.getElementById('daily-cards-timer');
      if (timerEl) {
        timerEl.textContent = `Resets in ${hours}h ${minutes}m ${seconds}s`;
      }
      
      if (msUntilMidnight <= 1000) {
        setTimeout(() => location.reload(), msUntilMidnight);
      }
    };
    
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  stopMidnightTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ========== CARD FLIPPING ==========

  flipDailyCard(type) {
    const cardEl = document.getElementById(`${type}-flip`);
    const headerEl = document.getElementById(`${type}-header`);
    const wrapperEl = cardEl?.closest('.daily-card-wrapper');
    if (!cardEl || !headerEl || !wrapperEl) return;
    
    const isFlipped = cardEl.classList.contains('flipped');
    
    // Update dynamic content before flip
    if (!isFlipped) {
      if (type === this.CARD_TYPES.BOOSTER) {
        this._updateBoosterContent(cardEl);
      } else if (type === this.CARD_TYPES.INQUIRY) {
        this._updateInquiryContent(cardEl);
      }
    }
    
    // Toggle flip
    cardEl.classList.toggle('flipped');
    headerEl.classList.toggle('flipped');
    wrapperEl.classList.toggle('flipped');
    
    // Save state and show toast
    if (cardEl.classList.contains('flipped')) {
      this._markCardFlipped(type);
      const messages = {
        [this.CARD_TYPES.TAROT]: '✨ Tarot card revealed!',
        [this.CARD_TYPES.AFFIRMATION]: '💫 Affirmation revealed!',
        [this.CARD_TYPES.BOOSTER]: '😊 Booster revealed!',
        [this.CARD_TYPES.INQUIRY]: '💭 Daily inquiry revealed!'
      };
      this.app.showToast(messages[type] || 'Card revealed!', 'success');
    }
  }

  _updateBoosterContent(cardEl) {
    // Get a fresh random booster every time
    const booster = this.getRandomBooster();
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="dashboard-booster-emoji">${booster.emoji}</div>
        <div class="inquiry-domain-badge">
          <span>${booster.title}</span>
        </div>
        <p class="dashboard-booster-description">${booster.description}</p>
        <p class="dashboard-booster-meta">${booster.duration} • ${booster.category}</p>`;
    }
  }

  _updateInquiryContent(cardEl) {
    const inquiry = this.getDailyInquiry();
    const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    if (contentBox) {
      contentBox.innerHTML = `
        <div class="dashboard-booster-emoji">${intensityEmoji[inquiry.intensity] || '💭'}</div>
        <div class="inquiry-domain-badge">
          <span>${inquiry.domain}</span>
        </div>
        <p class="dashboard-booster-description">${inquiry.question}</p>`;
    }
  }

  // ========== RENDERING ==========

  _renderCardTemplate(type, config) {
    const { title, frontTitle, backContent, frontContent, gradient = '' } = config;
    const wasFlipped = type === this.CARD_TYPES.BOOSTER ? false : this._wasCardFlipped(type);
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="daily-card-full-container">
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" onclick="window.app.dailyCards.flipDailyCard('${type}')">
            <div class="daily-card-inner ${flippedClass}" id="${type}-flip">
              <div class="daily-card-back">
                <p class="card-reveal-prompt">Click to reveal</p>
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
              </div>
              <div class="daily-card-front ${gradient}">
                ${frontContent}
              </div>
            </div>
          </div>
        </div>
        
        <div class="daily-card-header-container ${flippedClass}" id="${type}-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">${title}</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">${frontTitle}</h3>
          </div>
        </div>
      </div>`;
  }

  renderDailyCard(type, card) {
    return this._renderCardTemplate(type, {
      title: 'Daily Tarot Guidance',
      frontTitle: 'Daily Vibe',
      frontContent: `
        <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
          <img src="${card.image}" alt="${card.name}" style="width: 100%; max-height: 70%; flex-shrink: 0; object-fit: contain;">
          <div style="text-align: center; overflow-y: auto; padding: 0.75rem; flex: 1;">
            <h4 class="tarot-card-name">${card.name}</h4>
            <p class="tarot-card-meaning">${card.meaning}</p>
          </div>
        </div>`
    });
  }

  renderAffirmationCard(affirmation) {
    return this._renderCardTemplate(this.CARD_TYPES.AFFIRMATION, {
      title: 'Daily Affirmation',
      frontTitle: 'Today\'s Mantra',
      gradient: 'daily-card-gradient-affirmation',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <p class="dashboard-affirmation-text">${affirmation}</p>
        </div>`
    });
  }

  renderBoosterCard(booster) {
    return this._renderCardTemplate(this.CARD_TYPES.BOOSTER, {
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
        </div>`
    });
  }

  renderInquiryCard(inquiry) {
    const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
    
    return this._renderCardTemplate(this.CARD_TYPES.INQUIRY, {
      title: 'Daily Self-Inquiry',
      frontTitle: 'Be Honest',
      gradient: 'daily-card-gradient-inquiry',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${intensityEmoji[inquiry.intensity] || '💭'}</div>
            <div class="inquiry-domain-badge">
              <span>${inquiry.domain}</span>
            </div>
            <p class="dashboard-booster-description">${inquiry.question}</p>
          </div>
        </div>`
    });
  }

  renderDailyCardsSection() {
    const dailyCard = this.getDailyTarotCard();
    const dailyAff = this.getDailyAffirmation();
    const dailyBooster = this.getDailyBooster();
    const dailyInquiry = this.getDailyInquiry();
    
    setTimeout(() => this.initMidnightTimer(), 100);
    
    return `
      <div class="card dashboard-quest-hub mb-8" style="position: relative;">
        <span id="daily-cards-timer" class="countdown-badge"></span>
        <div class="dashboard-quest-header">
          <h3 class="dashboard-quest-title">🎴 Your Daily Cards</h3>
        </div>
        <div class="grid grid-cols-2 gap-6" id="daily-cards-container">
          ${this.renderDailyCard(this.CARD_TYPES.TAROT, dailyCard)}
          ${this.renderAffirmationCard(dailyAff)}
          ${this.renderBoosterCard(dailyBooster)}
          ${this.renderInquiryCard(dailyInquiry)}
        </div>
      </div>`;
  }

  // ========== CLEANUP ==========

  destroy() {
    this.stopMidnightTimer();
  }
}