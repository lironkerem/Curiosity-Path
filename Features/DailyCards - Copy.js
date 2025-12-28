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
    // Set fallback boosters immediately
    this.happinessBoosters = [
      { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
      { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
      { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
    ];
    this.boostersLoaded = true;
    
    // Try to load from JSON asynchronously
    this.loadHappinessBoosters();
  }

  /* ===== Happiness Boosters ===== */
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

  /* ===== Daily Tarot Card ===== */
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

  /* ===== Daily Affirmation ===== */
  getDailyAffirmation() {
    if (window.affirmations?.general_positive_affirmations) {
      const list = window.affirmations.general_positive_affirmations;
      const day = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const a = list[day % list.length];
      return typeof a === 'string' ? a : a.text;
    }
    return "I am worthy of love and belonging exactly as I am.";
  }

  /* ===== Daily Inquiry ===== */
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

  /* ===== Midnight Timer ===== */
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
      
      // Reset at midnight
      if (msUntilMidnight <= 1000) {
        setTimeout(() => {
          location.reload();
        }, msUntilMidnight);
      }
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* ===== Card Flip Handler ===== */
  flipDailyCard(type) {
    const el = document.getElementById(`${type}-flip`);
    if (!el) return;
    const isFlipped = el.classList.contains('flipped');
    
    if (type === 'booster' && !isFlipped) {
      const b = this.getRandomBooster();
      const box = el.querySelector('.dashboard-booster-content');
      if (box) box.innerHTML = `
        <div class="dashboard-booster-emoji">${b.emoji}</div>
        <h4 class="dashboard-booster-title">${b.title}</h4>
        <p class="dashboard-booster-description">${b.description}</p>
        <p class="dashboard-booster-meta">${b.duration} • ${b.category}</p>`;
    }
    
    if (type === 'inquiry' && !isFlipped) {
      const inquiry = this.getDailyInquiry();
      const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
      const box = el.querySelector('.dashboard-booster-content');
      if (box) box.innerHTML = `
        <div class="dashboard-booster-emoji" style="font-size: 2.5rem; margin-bottom: 1rem;">
          ${intensityEmoji[inquiry.intensity] || '💭'}
        </div>
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
            ${inquiry.domain}
          </span>
        </div>
        <h4 class="dashboard-booster-title" style="font-size: 1.1rem; line-height: 1.4; margin-bottom: 1rem; color: var(--neuro-text);">
          ${inquiry.question}
        </h4>
        <p class="dashboard-booster-description" style="font-style: italic; color: var(--neuro-text-secondary); font-size: 0.95rem; margin-bottom: 0.5rem;">
          ${inquiry.holding}
        </p>
        <p class="dashboard-booster-meta" style="font-size: 0.8rem; color: var(--neuro-text-secondary);">
          Level ${inquiry.intensity} • Self-Inquiry
        </p>`;
    }
    
    el.classList.toggle('flipped');
    if (el.classList.contains('flipped')) {
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

  /* ===== Card Rendering Methods ===== */
  renderDailyCard(type, card, title, backImage) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_${type}`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="card dashboard-daily-card">
        <div class="daily-card-wrapper" onclick="window.app.dailyCards.flipDailyCard('${type}')">
          <div class="daily-card-inner ${flippedClass}" id="${type}-flip">
            <div class="daily-card-back">
              <div class="card-content h-full overflow-y-auto">
                <img src="${backImage}" alt="Card Back" class="dashboard-card-image">
                <h3 class="dashboard-card-title">${title}</h3>
                <p class="dashboard-card-subtitle">Click to Reveal</p>
              </div>
            </div>
            <div class="daily-card-front">
              <div class="card-content h-full overflow-y-auto">
                <img src="${card.image}" alt="${card.name}" class="dashboard-card-image">
                <h3 class="dashboard-card-title-front">${card.name}</h3>
                <p class="dashboard-card-meaning">${card.meaning}</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  renderAffirmationCard(affirmation) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_affirmation`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="card dashboard-daily-card">
        <div class="daily-card-wrapper" onclick="window.app.dailyCards.flipDailyCard('affirmation')">
          <div class="daily-card-inner ${flippedClass}" id="affirmation-flip">
            <div class="daily-card-back">
              <div class="card-content h-full overflow-y-auto">
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
                <h3 class="dashboard-card-title">Daily Affirmation</h3>
                <p class="dashboard-card-subtitle">Click to Reveal</p>
              </div>
            </div>
            <div class="daily-card-front">
              <div class="card-content daily-front-split">
                <div class="dashboard-affirmation-box-scroll">
                  <p class="dashboard-affirmation-text">${affirmation}</p>
                </div>
                <h3 class="dashboard-card-title-front daily-heading-bottom">Your Daily Affirmation</h3>
                <p class="dashboard-card-subtitle daily-sub-bottom">Embrace this message today</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  renderBoosterCard(booster) {
    const today = new Date().toDateString();
    const wasFlipped = localStorage.getItem(`daily_card_flipped_booster`) === today;
    const flippedClass = wasFlipped ? 'flipped' : '';
    
    return `
      <div class="card dashboard-daily-card">
        <div class="daily-card-wrapper" onclick="window.app.dailyCards.flipDailyCard('booster')">
          <div class="daily-card-inner ${flippedClass}" id="booster-flip">
            <div class="daily-card-back">
              <div class="card-content h-full overflow-y-auto">
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
                <h3 class="dashboard-card-title">Happiness Booster</h3>
                <p class="dashboard-card-subtitle">Click to Reveal</p>
              </div>
            </div>
            <div class="daily-card-front">
              <div class="card-content daily-front-split">
                <div class="dashboard-booster-box-scroll">
                  <div class="dashboard-booster-content">
                    <div class="dashboard-booster-emoji">${booster.emoji}</div>
                    <h4 class="dashboard-booster-title">${booster.title}</h4>
                    <p class="dashboard-booster-description">${booster.description}</p>
                    <p class="dashboard-booster-meta">${booster.duration} • ${booster.category}</p>
                  </div>
                </div>
                <h3 class="dashboard-card-title-front daily-heading-bottom">Your Happiness Booster</h3>
                <p class="dashboard-card-subtitle daily-sub-bottom">Do this to refresh yourself</p>
              </div>
            </div>
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
      <div class="card dashboard-daily-card">
        <div class="daily-card-wrapper" onclick="window.app.dailyCards.flipDailyCard('inquiry')">
          <div class="daily-card-inner ${flippedClass}" id="inquiry-flip">
            <div class="daily-card-back">
              <div class="card-content h-full overflow-y-auto">
                <img src="${this.CARD_BACK_URL}" alt="Card Back" class="dashboard-card-image">
                <h3 class="dashboard-card-title">Daily Inquiry</h3>
                <p class="dashboard-card-subtitle">Click to Reveal</p>
              </div>
            </div>
            <div class="daily-card-front">
              <div class="card-content daily-front-split">
                <div class="dashboard-inquiry-box-scroll">
                  <div class="dashboard-booster-content">
                    <div class="dashboard-booster-emoji" style="font-size: 3rem; margin-bottom: 1rem;">
                      ${intensityEmoji[inquiry.intensity] || '💭'}
                    </div>
                    <p class="dashboard-booster-description">${inquiry.question}</p>
                  </div>
                </div>
                <h3 class="dashboard-card-title-front daily-heading-bottom">Your Daily Inquiry</h3>
                <p class="dashboard-card-subtitle daily-sub-bottom">Contemplate deeply</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ===== Main Render Method ===== */
  renderDailyCardsSection() {
    const dailyCard = this.getDailyTarotCard();
    const dailyAff = this.getDailyAffirmation();
    const dailyBooster = this.getDailyBooster();
    const dailyInquiry = this.getDailyInquiry();
    
    // Start timer after render
    setTimeout(() => this.initMidnightTimer(), 100);
    
    return `
      <div class="card dashboard-quest-hub mb-8" style="position: relative;">
        <span id="daily-cards-timer" class="countdown-badge mt-4 md:mt-0" style="position: absolute; top: 1.5rem; right: 1.5rem;"></span>
        <div class="dashboard-quest-header mt-8 md:mt-0" style="text-align:center;">
          <h3 class="dashboard-quest-title">🎴 Your Daily Cards</h3>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          ${this.renderDailyCard('tarot', dailyCard, 'Daily Tarot Card', this.CARD_BACK_URL)}
          ${this.renderAffirmationCard(dailyAff)}
          ${this.renderBoosterCard(dailyBooster)}
          <div class="md:hidden">
            ${this.renderInquiryCard(dailyInquiry)}
          </div>
        </div>
      </div>`;
  }
}