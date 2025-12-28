// DailyCards.js
// Handles all daily card functionality: Tarot, Affirmation, Booster, and Inquiry

import { InquiryEngine } from '../Features/InquiryEngine.js';

export default class DailyCards {
  constructor(app) {
    this.app = app;
    this.happinessBoosters = [];
    this.currentBoosterIndex = null;
    this.boostersLoaded = false;
    this.CARD_BACK_URL = 'https://raw.githubusercontent.com/lironkerem/self-analysis-pro/main/assets/Tarot%20Cards%20images/CardBacks.jpg';
    
    // Initialize Inquiry Engine
    this.inquiryEngine = new InquiryEngine('beginner');
    
    // Load boosters synchronously with fallback
    this.initializeBoosters();
  }

  initializeBoosters() {
    this.happinessBoosters = [
      { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
      { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
      { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
    ];
    this.boostersLoaded = true;
    this.loadHappinessBoosters();
  }

  async loadHappinessBoosters() {
    try {
      const res = await fetch('./Features/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      this.happinessBoosters = data.boosters;
    } catch {
      this.happinessBoosters = [
        { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
        { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
        { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
      ];
    }
    this.boostersLoaded = true;
  }

  getRandomBooster() {
    if (!this.happinessBoosters?.length) {
      return { id: 0, title: 'Loading...', emoji: '⏳', description: 'Please wait', duration: '...', category: 'Loading' };
    }
    const i = Math.floor(Math.random() * this.happinessBoosters.length);
    this.currentBoosterIndex = i;
    return this.happinessBoosters[i];
  }

  getDailyBooster() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_booster');
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) return data.booster;
      } catch {}
    }
    
    const booster = this.getRandomBooster();
    localStorage.setItem('daily_booster', JSON.stringify({ booster, date: today }));
    return booster;
  }

  getDailyTarotCard() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_tarot_card');
    
    if (stored) {
      try {
        const d = JSON.parse(stored);
        if (d.date === today) return d.card;
      } catch {}
    }
    
    const eng = new TarotEngine(this.app);
    const deck = eng.shuffleDeck(eng.buildFullDeck());
    const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const c = deck[day % 78];
    const card = {
      name: eng.getTarotCardName(c.number, c.suit),
      meaning: eng.getTarotCardMeaning(c.number, c.suit),
      image: eng.getTarotCardImage(c.number, c.suit),
      date: today
    };
    
    localStorage.setItem('daily_tarot_card', JSON.stringify({ card, date: today }));
    return card;
  }

  getDailyAffirmation() {
    if (window.affirmations?.general_positive_affirmations) {
      const list = window.affirmations.general_positive_affirmations;
      const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const a = list[day % list.length];
      return typeof a === 'string' ? a : a.text;
    }
    return "I am worthy of love and belonging exactly as I am.";
  }

  getDailyInquiry() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_inquiry');
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.date === today) return data.inquiry;
      } catch (e) {
        console.error('Failed to parse stored inquiry:', e);
      }
    }
    
    const domains = [
      'Responsibility and Power', 'Emotional Honesty', 'Identity and Roles',
      'Creativity and Expression', 'Shadow and Integration', 'Wisdom and Insight',
      'Joy and Fulfillment', 'Physical Well-Being and Energy', 'Relationship',
      'Spiritual Growth'
    ];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const inquiry = this.inquiryEngine.getRandomQuestion(randomDomain);
    
    localStorage.setItem('daily_inquiry', JSON.stringify({ inquiry, date: today }));
    return inquiry;
  }

  initMidnightTimer() {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow - now;
      
      const hours = Math.floor(msUntilMidnight / (1000 * 60 * 60));
      const minutes = Math.floor((msUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msUntilMidnight % (1000 * 60)) / 1000);
      
      const timerEl = document.getElementById('daily-cards-timer');
      if (timerEl) {
        timerEl.textContent = `Resets in ${hours}h ${minutes}m ${seconds}s`;
      }
      
      if (msUntilMidnight <= 1000) {
        setTimeout(() => location.reload(), msUntilMidnight);
      }
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  flipDailyCard(type) {
    const cardEl = document.getElementById(`${type}-flip`);
    const headerEl = document.getElementById(`${type}-header`);
    const wrapperEl = cardEl?.closest('.daily-card-wrapper');
    if (!cardEl || !headerEl || !wrapperEl) return;
    
    const isFlipped = cardEl.classList.contains('flipped');
    
    // Update dynamic content before flip
    if (type === 'booster' && !isFlipped) {
      const b = this.getRandomBooster();
      const box = cardEl.querySelector('.dashboard-booster-content');
      if (box) box.innerHTML = `
        <div class="dashboard-booster-emoji">${b.emoji}</div>
        <h4 class="dashboard-booster-title">${b.title}</h4>
        <p class="dashboard-booster-description">${b.description}</p>
        <p class="dashboard-booster-meta">${b.duration} • ${b.category}</p>`;
    }
    
    if (type === 'inquiry' && !isFlipped) {
      const inquiry = this.getDailyInquiry();
      const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
      const box = cardEl.querySelector('.dashboard-booster-content');
      if (box) box.innerHTML = `
        <div class="dashboard-booster-emoji">${intensityEmoji[inquiry.intensity] || '💭'}</div>
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.2); border-radius: 8px; display: inline-block;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: white;">
            ${inquiry.domain}
          </span>
        </div>
        <p class="dashboard-booster-description">${inquiry.question}</p>`;
    }
    
    // Flip card, header, and wrapper
    cardEl.classList.toggle('flipped');
    headerEl.classList.toggle('flipped');
    wrapperEl.classList.toggle('flipped');
    
    if (cardEl.classList.contains('flipped')) {
      localStorage.setItem(`daily_card_flipped_${type}`, new Date().toDateString());
      const msg = {
        tarot: '✨ Tarot card revealed!',
        affirmation: '💫 Affirmation revealed!',
        booster: '😊 Booster revealed!',
        inquiry: '💭 Daily inquiry revealed!'
      };
      this.app.showToast(msg[type] || 'Card revealed!', 'success');
    }
  }

  renderDailyCard(type, card, title, backImage) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_${type}`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="daily-card-full-container">
        <!-- Container 1: Flippable Card -->
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" onclick="window.app.dailyCards.flipDailyCard('${type}')">
            <div class="daily-card-inner ${flippedClass}" id="${type}-flip">
              <div class="daily-card-back">
                <p style="text-align: center; color: var(--neuro-text); font-weight: 600; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(255, 255, 255, 0.9); padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: 2px solid var(--neuro-accent); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Click to reveal</p>
                <img src="${backImage}" alt="Card Back" class="dashboard-card-image">
              </div>
              <div class="daily-card-front" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                <img src="${card.image}" alt="${card.name}" style="width: 100%; max-height: 70%; flex-shrink: 0; object-fit: contain;">
                <div style="text-align: center; overflow-y: auto; padding: 0.75rem; flex: 1;">
                  <h4 style="color: var(--neuro-text); font-weight: 700; margin: 0 0 0.5rem 0; font-size: 1.1rem;">${card.name}</h4>
                  <p style="color: var(--neuro-text-light); font-size: 0.9rem; line-height: 1.5; margin: 0;">${card.meaning}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Container 2: Header Info -->
        <div class="daily-card-header-container ${flippedClass}" id="${type}-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">${title}</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">Daily vibe</h3>
          </div>
        </div>
      </div>`;
  }

  renderAffirmationCard(affirmation) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_affirmation`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="daily-card-full-container">
        <!-- Container 1: Flippable Card -->
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" onclick="window.app.dailyCards.flipDailyCard('affirmation')">
            <div class="daily-card-inner ${flippedClass}" id="affirmation-flip">
              <div class="daily-card-back">
                <p style="text-align: center; color: var(--neuro-text); font-weight: 600; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(255, 255, 255, 0.9); padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: 2px solid var(--neuro-accent); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Click to reveal</p>
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
              </div>
              <div class="daily-card-front daily-card-gradient-affirmation">
                <div class="daily-card-content-wrapper">
                  <p class="dashboard-affirmation-text">${affirmation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Container 2: Header Info -->
        <div class="daily-card-header-container ${flippedClass}" id="affirmation-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">Daily Affirmation</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">Your Daily Affirmation</h3>
          </div>
        </div>
      </div>`;
  }

  renderBoosterCard(booster) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_booster`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="daily-card-full-container">
        <!-- Container 1: Flippable Card -->
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" onclick="window.app.dailyCards.flipDailyCard('booster')">
            <div class="daily-card-inner ${flippedClass}" id="booster-flip">
              <div class="daily-card-back">
                <p style="text-align: center; color: var(--neuro-text); font-weight: 600; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(255, 255, 255, 0.9); padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: 2px solid var(--neuro-accent); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Click to reveal</p>
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
              </div>
              <div class="daily-card-front daily-card-gradient-booster">
                <div class="daily-card-content-wrapper">
                  <div class="dashboard-booster-content">
                    <div class="dashboard-booster-emoji">${booster.emoji}</div>
                    <h4 class="dashboard-booster-title">${booster.title}</h4>
                    <p class="dashboard-booster-description">${booster.description}</p>
                    <p class="dashboard-booster-meta">${booster.duration} • ${booster.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Container 2: Header Info -->
        <div class="daily-card-header-container ${flippedClass}" id="booster-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">Happiness Booster</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">Boost Now!</h3>
          </div>
        </div>
      </div>`;
  }

  renderInquiryCard(inquiry) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem('daily_card_flipped_inquiry') === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
    
    return `
      <div class="daily-card-full-container">
        <!-- Container 1: Flippable Card -->
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}" onclick="window.app.dailyCards.flipDailyCard('inquiry')">
            <div class="daily-card-inner ${flippedClass}" id="inquiry-flip">
              <div class="daily-card-back">
                <p style="text-align: center; color: var(--neuro-text); font-weight: 600; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(255, 255, 255, 0.9); padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: 2px solid var(--neuro-accent); box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">Click to reveal</p>
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
              </div>
              <div class="daily-card-front daily-card-gradient-inquiry">
                <div class="daily-card-content-wrapper">
                  <div class="dashboard-booster-content">
                    <div class="dashboard-booster-emoji">${intensityEmoji[inquiry.intensity] || '💭'}</div>
                    <div style="margin-bottom: 1rem; padding: 0.5rem; background: rgba(255,255,255,0.2); border-radius: 8px; display: inline-block;">
                      <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: white;">
                        ${inquiry.domain}
                      </span>
                    </div>
                    <p class="dashboard-booster-description">${inquiry.question}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Container 2: Header Info -->
        <div class="daily-card-header-container ${flippedClass}" id="inquiry-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">Daily Inquiry</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">Ask Yourself Truly!</h3>
          </div>
        </div>
      </div>`;
  }

  renderDailyCardsSection() {
    const dailyCard = this.getDailyTarotCard();
    const dailyAff = this.getDailyAffirmation();
    const dailyBooster = this.getDailyBooster();
    const dailyInquiry = this.getDailyInquiry();
    
    setTimeout(() => this.initMidnightTimer(), 100);
    
    return `
      <div class="card dashboard-quest-hub mb-8" style="position: relative;">
        <span id="daily-cards-timer" class="countdown-badge" style="position: absolute; top: 1rem; right: 1rem;"></span>
        <div class="dashboard-quest-header" style="text-align:center; margin-top: 3rem; margin-bottom: 2rem;">
          <h3 class="dashboard-quest-title">🎴 Your Daily Cards</h3>
        </div>
        <div class="grid grid-cols-2 gap-6">
          ${this.renderDailyCard('tarot', dailyCard, 'Daily Tarot Card', this.CARD_BACK_URL)}
          ${this.renderAffirmationCard(dailyAff)}
          ${this.renderBoosterCard(dailyBooster)}
          ${this.renderInquiryCard(dailyInquiry)}
        </div>
      </div>`;
  }
}