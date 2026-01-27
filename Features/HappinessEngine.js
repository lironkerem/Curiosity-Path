// ============================================
// HAPPINESS ENGINE - Professional & Optimized
// ============================================
// Manages happiness boosters, affirmations, quotes, and self-inquiry questions
// Handles daily quest tracking and view counting with localStorage persistence

import affirmationsData from '../Features/Data/AffirmationsList.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

// Configuration constants
const CONFIG = {
  QUEST_TARGET: 5,
  THROTTLE_MS: 1000,
  DEFAULT_BOOSTERS: [
    { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move your body!', duration: '5 min', category: 'Movement' },
    { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Quickly name 3 things you\'re grateful for right now.', duration: '3 min', category: 'Mindfulness' },
    { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes to boost confidence.', duration: '2 min', category: 'Confidence' },
    { id: 4, title: 'Mindful Sip', emoji: '🍵', description: 'Drink a glass of water or tea, focusing only on the sensation.', duration: '4 min', category: 'Calm' },
    { id: 5, title: 'Quick Stretch', emoji: '🤸', description: 'Gently stretch your arms, neck, and back for 3 minutes.', duration: '3 min', category: 'Body' },
    { id: 6, title: 'Listen to One Song', emoji: '🎶', description: 'Listen to one favorite song without any distractions.', duration: '4 min', category: 'Joy' }
  ],
  INQUIRY_DOMAINS: [
    'Responsibility and Power',
    'Emotional Honesty',
    'Identity and Roles',
    'Creativity and Expression',
    'Shadow and Integration',
    'Wisdom and Insight',
    'Joy and Fulfillment',
    'Physical Well-Being and Energy',
    'Relationship',
    'Spiritual Growth',
    'Fear and Resistance',
    'Boundaries and Consent',
    'Purpose and Direction',
    'Mind and Awareness'
  ],
  INTENSITY_EMOJI: { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' }
};

class HappinessEngine {
  /**
   * Initialize the Happiness Engine
   * @param {Object} app - Main app instance with utilities (randomFrom, gamification, showToast)
   */
  constructor(app) {
    this.app = app;
    this.boosters = CONFIG.DEFAULT_BOOSTERS;
    this.boostersLoaded = true;
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = null;
    this.currentAffirmation = null;
    this.currentInquiry = null;
    this.affirmations = window.affirmations || affirmationsData;
    this.inquiryEngine = new InquiryEngine('beginner');
    
    // Performance optimization: throttle tracking and cache DOM elements
    this._lastTracked = 0;
    this._cachedElements = {};
    
    this.loadBoosters();
  }

  /**
   * Load happiness boosters from external JSON file
   * Falls back to default boosters if fetch fails
   */
  async loadBoosters() {
    try {
      const res = await fetch('./Features/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.boosters = data.boosters;
      this.boostersLoaded = true;
      
      // Re-render if happiness tab is currently visible
      const tab = this._getElement('happiness-tab');
      if (tab && !tab.classList.contains('hidden')) this.render();
    } catch (e) {
      console.error('Failed to load boosters, using defaults:', e);
    }
  }

  /**
   * Get or cache DOM element by ID for performance
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  _getElement(id) {
    if (!this._cachedElements[id] || !document.getElementById(id)) {
      this._cachedElements[id] = document.getElementById(id);
    }
    return this._cachedElements[id];
  }

  /**
   * Calculate current day of year (1-365/366)
   * @returns {number}
   */
  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ============================================
  // Content Getters
  // ============================================

  getDailyBooster() {
    return this.boosters[this._getDayOfYear() % this.boosters.length];
  }

  getRandomBooster() {
    return this.app.randomFrom(this.boosters);
  }

  getDailyAffirmation() {
    const list = this.affirmations?.general_positive_affirmations;
    if (!list?.length) return 'You are doing great.';
    const item = list[this._getDayOfYear() % list.length];
    return typeof item === 'string' ? item : item.text;
  }

  getRandomAffirmation() {
    const src = this.affirmations;
    if (!src) return 'You are capable of amazing things.';

    // Flatten all affirmation categories into single pool
    const pool = Object.values(src)
      .flat()
      .filter(Boolean); // Remove null/undefined entries

    if (!pool.length) return 'You are capable of amazing things.';

    const pick = this.app.randomFrom(pool);
    return typeof pick === 'string' ? pick : pick.text;
  }

  getRandomInquiry() {
    const domain = CONFIG.INQUIRY_DOMAINS[Math.floor(Math.random() * CONFIG.INQUIRY_DOMAINS.length)];
    return this.inquiryEngine.getRandomQuestion(domain);
  }

  // ============================================
  // Quest & View Tracking
  // ============================================

  /**
   * Track happiness tab view and update quest progress
   * Throttled to prevent rapid duplicate tracking
   * @returns {number} Current view count for today
   */
  trackView() {
    const now = Date.now();
    
    // Throttle: prevent tracking if called within 1 second
    if (this._lastTracked && now - this._lastTracked < CONFIG.THROTTLE_MS) {
      return this.getTodayViewCount();
    }
    this._lastTracked = now;

    const today = new Date().toDateString();
    let data = this._getStorageData(today);
    data.count += 1;
    
    try {
      localStorage.setItem('daily_booster_views', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save view count:', e);
    }
    
    // Progress gamification quest when target reached
    if (data.count <= CONFIG.QUEST_TARGET && this.app.gamification) {
      if (data.count === CONFIG.QUEST_TARGET) {
        this.app.gamification.progressQuest('daily', 'daily_booster', CONFIG.QUEST_TARGET);
      }
    }
    
    return data.count;
  }

  /**
   * Get view count for today without tracking
   * @returns {number}
   */
  getTodayViewCount() {
    return this._getStorageData(new Date().toDateString()).count;
  }

  /**
   * Get stored view data from localStorage
   * @param {string} today - Date string
   * @returns {Object} {date, count}
   */
  _getStorageData(today) {
    try {
      const stored = localStorage.getItem('daily_booster_views');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed;
      }
    } catch (e) {
      console.error('Failed to read view count:', e);
    }
    return { date: today, count: 0 };
  }

  /**
   * Update quest progress badge and completion banner in UI
   */
  updateQuestDisplay() {
    const viewCount = this.getTodayViewCount();
    const badge = document.querySelector('#happiness-tab .badge');
    
    if (badge) {
      badge.textContent = `${viewCount} / ${CONFIG.QUEST_TARGET} (Quest)`;
      badge.className = `badge ${viewCount >= CONFIG.QUEST_TARGET ? 'badge-success' : 'badge-primary'}`;
    }
    
    const bannerId = 'happiness-quest-complete';
    let banner = document.getElementById(bannerId);
    
    // Show completion banner when quest target reached
    if (viewCount >= CONFIG.QUEST_TARGET && !banner) {
      banner = document.createElement('div');
      banner.id = bannerId;
      banner.style.cssText = 'margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);';
      banner.innerHTML = '<p class="text-center" style="color:#22c55e;">🎉 Daily quest complete! Keep exploring if you\'d like!</p>';
      
      const header = document.querySelector('#happiness-tab .universal-content');
      header?.insertBefore(banner, header.querySelector('main'));
    } else if (viewCount < CONFIG.QUEST_TARGET && banner) {
      banner.remove();
    }
  }

  // ============================================
  // Card Animation & Refresh Logic
  // ============================================

  /**
   * Animate card flip with 360° rotation
   * @param {string} cardId - Card element ID
   * @param {string} newHtml - New content HTML
   */
  _flipCard(cardId, newHtml) {
    const card = this._getElement(cardId);
    if (!card) return;
    
    const inner = card.querySelector('.flip-card-inner');
    const back = card.querySelector('.flip-card-back');
    back.innerHTML = newHtml;
    
    // Extract current rotation and add 360 degrees
    const match = inner.style.transform.match(/-?\d+\.?\d*/);
    const currentY = match ? parseFloat(match[0]) : 0;
    inner.style.transform = `rotateY(${currentY + 360}deg)`;
    
    // Update front content after animation completes
    const onEnd = () => {
      inner.removeEventListener('transitionend', onEnd);
      card.querySelector('.flip-card-front').innerHTML = newHtml;
    };
    inner.addEventListener('transitionend', onEnd);
  }

  /**
   * Generic refresh handler for all card types
   * @param {string} type - Property name (currentBooster, currentQuote, etc.)
   * @param {Function} getter - Method to get new content
   * @param {string} cardId - Card element ID
   * @param {string} emoji - Card emoji
   * @param {string} title - Card title
   * @param {Function} formatter - Function to format content HTML
   */
  _handleRefresh(type, getter, cardId, emoji, title, formatter) {
    this[type] = getter.call(this);
    const viewCount = this.trackView();
    const html = this._generateCardHTML(emoji, title, formatter(this[type]), cardId.replace('-card', ''));
    
    this._flipCard(cardId, html);
    this.updateQuestDisplay();
    
    // Update gamification stats
    if (this.app.gamification) {
      this.app.gamification.incrementHappinessViews();
    }
    
    // Show toast notification
    if (this.app.showToast) {
      const msg = viewCount >= CONFIG.QUEST_TARGET
        ? `✨ Quest complete! You've viewed ${CONFIG.QUEST_TARGET} items today!`
        : `✨ New ${title.toLowerCase()} revealed! (${viewCount}/${CONFIG.QUEST_TARGET})`;
      this.app.showToast(msg, 'success');
    }
  }

  /**
   * Generate standardized card HTML structure
   * @param {string} emoji - Card emoji/icon
   * @param {string} title - Card title
   * @param {string} contentHTML - Inner content HTML
   * @param {string} refreshMethod - Method name to call on refresh
   * @returns {string} Complete card HTML
   */
  _generateCardHTML(emoji, title, contentHTML, refreshMethod) {
    return `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">${emoji}</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">${title}</h2>
      </div>
      ${contentHTML}
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refresh${refreshMethod.charAt(0).toUpperCase() + refreshMethod.slice(1)}()" class="btn btn-secondary">🔄 Refresh</button>
      </div>`;
  }

  // ============================================
  // Refresh Methods for Each Card Type
  // ============================================

  refreshBooster() {
    this._handleRefresh('currentBooster', this.getRandomBooster, 'booster-card', this.currentBooster?.emoji || '💪', 'A Quick Happiness Booster', (b) => `
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${b.title}</h3>
        <p class="mt-2 text-lg">${b.description}</p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>${b.duration}</span> • <span>${b.category}</span>
        </div>
      </div>`);
  }

  refreshQuote() {
    const getQuote = () => window.QuotesData?.getRandomQuote() || { text: 'Stay positive!', author: 'Unknown' };
    this._handleRefresh('currentQuote', getQuote, 'quote-card', '📜', 'Inspirational Quote', (q) => `
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${q.text}"
      </p>
      <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
        - ${q.author}
      </p>`);
  }

  refreshAffirmation() {
    this._handleRefresh('currentAffirmation', this.getRandomAffirmation, 'affirm-card', '✨', 'Positive Affirmation', (a) => `
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${a}"
      </p>`);
  }

  refreshInquiry() {
    this._handleRefresh('currentInquiry', this.getRandomInquiry, 'inquiry-card', '💭', 'Self Inquiry', (i) => `
      <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
        <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
          ${i.domain}
        </span>
      </div>
      <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
        ${i.question}
      </p>
      <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
        ${i.holding}
      </p>
      <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
        <span>Level ${i.intensity}</span> • <span>Self-Inquiry</span>
      </div>`);
  }

  // ============================================
  // Main Render Method
  // ============================================

  /**
   * Render the complete happiness tab UI
   * Generates fresh content on each render
   */
  render() {
    const tab = this._getElement('happiness-tab');
    if (!tab) return;
    
    // Generate fresh content for initial render
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = window.QuotesData?.getRandomQuote() || { text: 'Stay positive!', author: 'Unknown' };
    this.currentAffirmation = this.getRandomAffirmation();
    this.currentInquiry = this.getRandomInquiry();

    const viewCount = this.getTodayViewCount();

    tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavHappiness.png');
                     --header-title:'';
                     --header-tag:'Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry'">
        <h1>Happiness and Motivation</h1>
        <h3>Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry</h3>
        <span class="header-sub"></span>
      </header>

      <div class="flex items-center justify-between" style="margin-bottom: 2rem; padding: 1rem; background: rgba(102, 126, 234, 0.05); border-radius: 8px;">
        <span style="color: var(--neuro-text); font-weight: 600;">Daily Quest Progress</span>
        <span class="badge ${viewCount >= CONFIG.QUEST_TARGET ? 'badge-success' : 'badge-primary'}">${viewCount} / ${CONFIG.QUEST_TARGET} (Quest)</span>
      </div>

      ${viewCount >= CONFIG.QUEST_TARGET ? `
        <div id="happiness-quest-complete" style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color: #22c55e;">🎉 Daily quest complete! Keep exploring if you'd like!</p>
        </div>
      ` : ''}

<main class="space-y-6">
  ${this._renderCard('affirm-card', '✨', 'Positive Affirmation', `
    <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
      "${this.currentAffirmation}"
    </p>
  `, 'refreshAffirmation')}

  ${this._renderCard('quote-card', '📜', 'Inspirational Quote', `
    <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
      "${this.currentQuote.text}"
    </p>
    <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
      - ${this.currentQuote.author}
    </p>
  `, 'refreshQuote')}

  ${this._renderCard('booster-card', this.currentBooster.emoji, 'A Quick Happiness Booster', `
    <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${this.currentBooster.title}</h3>
    <p class="mt-2 text-lg">${this.currentBooster.description}</p>
    <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
      <span>${this.currentBooster.duration}</span> • <span>${this.currentBooster.category}</span>
    </div>
  `, 'refreshBooster')}

  ${this._renderCard('inquiry-card', CONFIG.INTENSITY_EMOJI[this.currentInquiry.intensity] || '💭', 'Self Inquiry', `
    <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
      <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
        ${this.currentInquiry.domain}
      </span>
    </div>
    <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
      ${this.currentInquiry.question}
    </p>
    <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
      ${this.currentInquiry.holding}
    </p>
    <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
      <span>Level ${this.currentInquiry.intensity}</span> • <span>Self-Inquiry</span>
    </div>
  `, 'refreshInquiry')}
</main>
    </div>
  </div>`;
  }

  /**
   * Render individual card component
   * @param {string} id - Card element ID
   * @param {string} emoji - Card emoji/icon
   * @param {string} title - Card title
   * @param {string} content - Card inner content HTML
   * @param {string} refreshMethod - Method name to call on refresh
   * @returns {string} Card HTML
   */
  _renderCard(id, emoji, title, content, refreshMethod) {
    return `
      <div class="neuro-card flip-card" id="${id}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="flex items-center" style="margin-bottom: 1rem;">
              <span class="text-3xl" style="margin-right:0.25rem">${emoji}</span>
              <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">${title}</h2>
            </div>
            <div class="text-center">
              ${content}
            </div>
            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
              <button onclick="window.featuresManager.engines.happiness.${refreshMethod}()" class="btn btn-secondary">🔄 Refresh</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }
}

// Export for module systems and expose globally for onclick handlers
if (typeof window !== 'undefined') window.HappinessEngine = HappinessEngine;
export default HappinessEngine;