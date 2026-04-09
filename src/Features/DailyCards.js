// Features/DailyCards.js

import TarotEngine from '../Features/TarotEngine.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }    catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }        catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }        catch { /* noop */  } }
};

/**
 * DailyCards - Manages daily card reveals (Tarot, Affirmation, Booster, Inquiry)
 * Card flipping animations, midnight timer, localStorage caching, daily rotation
 */
export default class DailyCards {
  static CARD_BACK_URL = '/Tarot%20Cards%20images/CardBacks.webp';

  static STORAGE_KEYS = Object.freeze({
    BOOSTER:        'daily_booster',
    TAROT:          'daily_tarot_card',
    INQUIRY:        'daily_inquiry',
    AFFIRMATION:    'daily_affirmation',
    FLIPPED_PREFIX: 'daily_card_flipped_'
  });

  static CARD_TYPES = Object.freeze({
    TAROT:       'tarot',
    AFFIRMATION: 'affirmation',
    BOOSTER:     'booster',
    INQUIRY:     'inquiry'
  });

  // Whitelist of valid card types for querySelector / localStorage key construction
  static VALID_TYPES = new Set(['tarot', 'affirmation', 'booster', 'inquiry']);

  static INQUIRY_DOMAINS = Object.freeze([
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
  ]);

  static INTENSITY_EMOJIS = Object.freeze({ 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' });

  static FLIP_MESSAGES = Object.freeze({
    tarot:       'Tarot card revealed!',
    affirmation: 'Affirmation revealed!',
    booster:     'Booster revealed!',
    inquiry:     'Daily inquiry revealed!'
  });

  static TODAY_CACHE_DURATION = 60000; // 1 minute
  static MS_PER_DAY           = 86400000;

  static FALLBACK_BOOSTERS = Object.freeze([
    { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move!', duration: '5 min', category: 'Movement' },
    { id: 2, title: 'Gratitude Snapshot',   emoji: '📸', description: 'Notice 3 beautiful things around you', duration: '3 min', category: 'Gratitude' },
    { id: 3, title: 'Power Pose',           emoji: '🦸', description: 'Stand like a superhero for 2 minutes', duration: '2 min', category: 'Confidence' }
  ]);

  constructor(app) {
    this.app = app;
    this.happinessBoosters = [];
    this.boostersLoaded    = false;
    this.timerInterval     = null;
    this._todayCache       = null;
    this._todayCacheTime   = 0;

    this.inquiryEngine = new InquiryEngine('beginner');
    this.tarotEngine   = new TarotEngine(app);

    this.initializeBoosters();
  }

  /* ==================== INITIALIZATION ==================== */

  async initializeBoosters() {
    try {
      const response = await fetch('./src/Features/Data/HappinessBoostersList.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.happinessBoosters = data.boosters || DailyCards.FALLBACK_BOOSTERS;
    } catch (err) {
      console.warn('DailyCards: Failed to load boosters, using fallback:', err);
      this.happinessBoosters = DailyCards.FALLBACK_BOOSTERS;
    }
    this.boostersLoaded = true;
  }

  /* ==================== DATE & TIME UTILITIES ==================== */

  _getToday() {
    const now = Date.now();
    if (now - this._todayCacheTime < DailyCards.TODAY_CACHE_DURATION) return this._todayCache;
    this._todayCache     = new Date().toDateString();
    this._todayCacheTime = now;
    return this._todayCache;
  }

  _getDayOfYear() {
    const now   = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / DailyCards.MS_PER_DAY);
  }

  /* ==================== STORAGE MANAGEMENT ==================== */

  _getFromStorage(key) {
    const today = this._getToday();
    try {
      const stored = ls.get(key);
      if (!stored) return null;
      const data = JSON.parse(stored);
      return data.date === today ? data : null;
    } catch (err) {
      console.error(`DailyCards: Storage read error for ${key}:`, err);
      return null;
    }
  }

  _saveToStorage(key, value) {
    try {
      ls.set(key, JSON.stringify({ ...value, date: this._getToday() }));
    } catch (err) {
      console.error(`DailyCards: Storage write error for ${key}:`, err);
    }
  }

  _wasCardFlipped(type) {
    if (!DailyCards.VALID_TYPES.has(type)) return false;
    return ls.get(`${DailyCards.STORAGE_KEYS.FLIPPED_PREFIX}${type}`) === this._getToday();
  }

  _markCardFlipped(type) {
    if (!DailyCards.VALID_TYPES.has(type)) return;
    ls.set(`${DailyCards.STORAGE_KEYS.FLIPPED_PREFIX}${type}`, this._getToday());
  }

  /* ==================== CARD DATA GETTERS ==================== */

  getRandomBooster() {
    const boosters = this.happinessBoosters?.length ? this.happinessBoosters : DailyCards.FALLBACK_BOOSTERS;
    return boosters[Math.floor(Math.random() * boosters.length)];
  }

  getDailyBooster() {
    return this.getRandomBooster();
  }

  getDailyTarotCard() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.TAROT);
    if (cached) return cached.card;
    const deck       = this.tarotEngine.shuffleDeck(this.tarotEngine.buildFullDeck());
    const selected   = deck[this._getDayOfYear() % 78];
    const card = {
      name:    this.tarotEngine.getTarotCardName(selected.number, selected.suit),
      meaning: this.tarotEngine.getTarotCardMeaning(selected.number, selected.suit),
      image:   this.tarotEngine.getTarotCardImage(selected.number, selected.suit)
    };
    this._saveToStorage(DailyCards.STORAGE_KEYS.TAROT, { card });
    return card;
  }

  getRandomAffirmation() {
    const list = window.affirmations?.general_positive_affirmations || [];
    if (!list.length) return 'I am worthy of love and belonging exactly as I am.';
    const item = list[Math.floor(Math.random() * list.length)];
    return typeof item === 'string' ? item : item.text;
  }

  getDailyAffirmation() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.AFFIRMATION);
    if (cached) return cached.affirmation;
    const affirmation = this.getRandomAffirmation();
    this._saveToStorage(DailyCards.STORAGE_KEYS.AFFIRMATION, { affirmation });
    return affirmation;
  }

  getDailyInquiry() {
    const cached = this._getFromStorage(DailyCards.STORAGE_KEYS.INQUIRY);
    if (cached) return cached.inquiry;
    const domain  = DailyCards.INQUIRY_DOMAINS[Math.floor(Math.random() * DailyCards.INQUIRY_DOMAINS.length)];
    const inquiry = this.inquiryEngine.getRandomQuestion(domain);
    this._saveToStorage(DailyCards.STORAGE_KEYS.INQUIRY, { inquiry });
    return inquiry;
  }

  /* ==================== MIDNIGHT TIMER ==================== */

  initMidnightTimer() {
    this.stopMidnightTimer();
    const updateTimer = () => {
      const now             = new Date();
      const tomorrow        = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const msUntilMidnight = tomorrow - now;
      const hours           = Math.floor(msUntilMidnight / 3600000);
      const minutes         = Math.floor((msUntilMidnight % 3600000) / 60000);
      const seconds         = Math.floor((msUntilMidnight % 60000) / 1000);

      const timerEl = document.getElementById('daily-cards-timer');
      if (timerEl) timerEl.textContent = `Resets in ${hours}h ${minutes}m ${seconds}s`;

      if (msUntilMidnight <= 1000) setTimeout(() => location.reload(), msUntilMidnight);
    };
    updateTimer();
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  stopMidnightTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }

  /* ==================== CARD FLIPPING ==================== */

  flipDailyCard(type) {
    // Whitelist check — type is used in getElementById and localStorage key
    if (!DailyCards.VALID_TYPES.has(type)) {
      console.warn(`DailyCards: Invalid card type "${type}"`);
      return;
    }

    const cardEl    = document.getElementById(`${type}-flip`);
    const headerEl  = document.getElementById(`${type}-header`);
    const wrapperEl = cardEl?.closest('.daily-card-wrapper');

    if (!cardEl || !headerEl || !wrapperEl) {
      console.warn(`DailyCards: Card elements not found for type: ${type}`);
      return;
    }

    const isFlipped = cardEl.classList.contains('flipped');

    if (!isFlipped) {
      if (type === DailyCards.CARD_TYPES.BOOSTER) this._updateBoosterContent(cardEl);
      else if (type === DailyCards.CARD_TYPES.INQUIRY) this._updateInquiryContent(cardEl);
    }

    cardEl.classList.toggle('flipped');
    headerEl.classList.toggle('flipped');
    wrapperEl.classList.toggle('flipped');

    if (cardEl.classList.contains('flipped')) {
      this._markCardFlipped(type);
      this.app.showToast(DailyCards.FLIP_MESSAGES[type] || 'Card revealed!', 'success');
    }
  }

  _updateBoosterContent(cardEl) {
    const booster    = this.getRandomBooster();
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    if (!contentBox) return;
    // Use textContent / esc() — booster data comes from a JSON file, but sanitise defensively
    contentBox.innerHTML = `
      <div class="dashboard-booster-emoji">${esc(booster.emoji)}</div>
      <div class="inquiry-domain-badge"><span>${esc(booster.title)}</span></div>
      <p class="dashboard-booster-description">${esc(booster.description)}</p>
      <p class="dashboard-booster-meta">${esc(booster.duration)} • ${esc(booster.category)}</p>
    `;
  }

  _updateInquiryContent(cardEl) {
    const inquiry    = this.getDailyInquiry();
    const contentBox = cardEl.querySelector('.dashboard-booster-content');
    if (!contentBox) return;
    contentBox.innerHTML = `
      <div class="dashboard-booster-emoji">${DailyCards.INTENSITY_EMOJIS[inquiry.intensity] || '💭'}</div>
      <div class="inquiry-domain-badge"><span>${esc(inquiry.domain)}</span></div>
      <p class="dashboard-booster-description">${esc(inquiry.question)}</p>
    `;
  }

  /* ==================== RENDERING ==================== */

  _renderCardTemplate(type, config) {
    const { title, frontTitle, frontContent, gradient = '' } = config;
    const wasFlipped  = type === DailyCards.CARD_TYPES.BOOSTER ? false : this._wasCardFlipped(type);
    const flippedClass = wasFlipped ? 'flipped' : '';

    return `
      <div class="daily-card-full-container">
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${flippedClass}"
               role="button" tabindex="0"
               aria-label="Flip ${esc(title)} card"
               onclick="window.app.dailyCards.flipDailyCard('${esc(type)}')"
               onkeydown="if(event.key==='Enter'||event.key===' ')window.app.dailyCards.flipDailyCard('${esc(type)}')">
            <div class="daily-card-inner ${flippedClass}" id="${esc(type)}-flip">

              <!-- Card Back -->
              <div class="daily-card-back">
                <p class="card-reveal-prompt">Click to reveal</p>
                <img src="${DailyCards.CARD_BACK_URL}"
                     alt="Card back"
                     class="dashboard-card-image"
                     loading="lazy" decoding="async"
                     width="120" height="200">
              </div>

              <!-- Card Front -->
              <div class="daily-card-front ${gradient}">
                ${frontContent}
              </div>

            </div>
          </div>
        </div>

        <!-- Card Header -->
        <div class="daily-card-header-container ${flippedClass}" id="${esc(type)}-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">${esc(title)}</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">${esc(frontTitle)}</h3>
          </div>
        </div>
      </div>
    `;
  }

  renderDailyCard(type, card) {
    return this._renderCardTemplate(type, {
      title:      'Daily Tarot Guidance',
      frontTitle: 'Daily Vibe',
      frontContent: `
        <div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
          <img src="${esc(card.image)}" alt="${esc(card.name)}"
               loading="lazy" decoding="async"
               width="300" height="500"
               style="width:100%;max-height:70%;flex-shrink:0;object-fit:contain;">
          <div style="text-align:center;overflow-y:auto;padding:0.75rem;flex:1;">
            <h4 class="tarot-card-name">${esc(card.name)}</h4>
            <p class="tarot-card-meaning">${esc(card.meaning)}</p>
          </div>
        </div>
      `
    });
  }

  renderAffirmationCard(affirmation) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.AFFIRMATION, {
      title:      'Daily Affirmation',
      frontTitle: "Today's Mantra",
      gradient:   'daily-card-gradient-affirmation',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <p class="dashboard-affirmation-text">${esc(affirmation)}</p>
        </div>
      `
    });
  }

  renderBoosterCard(booster) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.BOOSTER, {
      title:      'Happiness Booster',
      frontTitle: 'Just Do It',
      gradient:   'daily-card-gradient-booster',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${esc(booster.emoji)}</div>
            <div class="inquiry-domain-badge"><span>${esc(booster.title)}</span></div>
            <p class="dashboard-booster-description">${esc(booster.description)}</p>
            <p class="dashboard-booster-meta">${esc(booster.duration)} • ${esc(booster.category)}</p>
          </div>
        </div>
      `
    });
  }

  renderInquiryCard(inquiry) {
    return this._renderCardTemplate(DailyCards.CARD_TYPES.INQUIRY, {
      title:      'Daily Self-Inquiry',
      frontTitle: 'Be Honest',
      gradient:   'daily-card-gradient-inquiry',
      frontContent: `
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${DailyCards.INTENSITY_EMOJIS[inquiry.intensity] || '💭'}</div>
            <div class="inquiry-domain-badge"><span>${esc(inquiry.domain)}</span></div>
            <p class="dashboard-booster-description">${esc(inquiry.question)}</p>
          </div>
        </div>
      `
    });
  }

  renderDailyCardsSection() {
    const dailyCard    = this.getDailyTarotCard();
    const dailyAff     = this.getDailyAffirmation();
    const dailyBooster = this.getDailyBooster();
    const dailyInquiry = this.getDailyInquiry();

    setTimeout(() => this.initMidnightTimer(), 100);

    return `
      <div class="card dashboard-quest-hub mb-8" style="position:relative;">
        <span id="daily-cards-timer" class="countdown-badge" aria-live="polite"></span>
        <div class="dashboard-quest-header">
          <h3 class="dashboard-quest-title" style="display:flex;align-items:center;gap:0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M9 12c0 0 1.5-2 3-2s3 2 3 2-1.5 2-3 2-3-2-3-2z"/><circle cx="12" cy="12" r="1"/></svg>
            Your Daily Cards
          </h3>
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

  destroy() {
    this.stopMidnightTimer();
    this._todayCache     = null;
    this._todayCacheTime = 0;
  }
}
