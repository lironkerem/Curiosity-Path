// ============================================
// HAPPINESS ENGINE - OPTIMIZED & CONSOLIDATED
// ============================================

import affirmationsData from '../Features/Data/AffirmationsList.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

class HappinessEngine {
  // Constants
  static QUEST_TARGET = 5;
  static DEBOUNCE_MS = 1000;
  static ROTATION_DEG = 360;
  static INTENSITY_EMOJIS = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };


  constructor(app) {
    this.app = app;
    this.boosters = [
      { id: 1, title: '5-Minute Dance Party', emoji: '💃', description: 'Put on your favorite song and move your body!', duration: '5 min', category: 'Movement' },
      { id: 2, title: 'Gratitude Snapshot', emoji: '📸', description: 'Quickly name 3 things you\'re grateful for right now.', duration: '3 min', category: 'Mindfulness' },
      { id: 3, title: 'Power Pose', emoji: '🦸', description: 'Stand like a superhero for 2 minutes to boost confidence.', duration: '2 min', category: 'Confidence' },
      { id: 4, title: 'Mindful Sip', emoji: '🍵', description: 'Drink a glass of water or tea, focusing only on the sensation.', duration: '4 min', category: 'Calm' },
      { id: 5, title: 'Quick Stretch', emoji: '🤸', description: 'Gently stretch your arms, neck, and back for 3 minutes.', duration: '3 min', category: 'Body' },
      { id: 6, title: 'Listen to One Song', emoji: '🎶', description: 'Listen to one favorite song without any distractions.', duration: '4 min', category: 'Joy' }
    ];
    this.boostersLoaded = false;
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = null;
    this.currentAffirmation = null;
    this.currentInquiry = null;
    this.affirmations = affirmationsData;
    this.inquiryEngine = new InquiryEngine('beginner');
    this._lastTracked = 0;
    this._cachedElements = {};
    this.loadBoosters();
  }

  // ============================================
  // DATA LOADING
  // ============================================

  /**
   * Asynchronously loads happiness boosters from JSON file
   * Falls back to default boosters if load fails
   */
  async loadBoosters() {
    try {
      const res = await fetch('./Features/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.boosters = data.boosters;
      this.boostersLoaded = true;
      
      const tab = this._getElement('happiness-tab');
      if (tab && !tab.classList.contains('hidden')) this.render();
    } catch (e) {
      console.error('Failed to load happiness boosters:', e);
      this.boostersLoaded = true; // Use default boosters
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Caches and returns DOM element by ID
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
   * Calculates current day of year (1-365/366)
   * @returns {number}
   */
  _getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  // ============================================
  // CONTENT GETTERS
  // ============================================

  /**
   * Returns daily booster based on day of year
   * @returns {Object}
   */
  getDailyBooster() {
    return this.boosters[this._getDayOfYear() % this.boosters.length];
  }

  /**
   * Returns random booster
   * @returns {Object}
   */
  getRandomBooster() {
    return this.app.randomFrom(this.boosters);
  }
  
  /**
   * Returns daily affirmation based on day of year
   * @returns {string}
   */
  getDailyAffirmation() {
    const list = this.affirmations?.general_positive_affirmations;
    if (!list?.length) return 'You are doing great.';
    const item = list[this._getDayOfYear() % list.length];
    return typeof item === 'string' ? item : item.text;
  }
  
  /**
   * Returns random affirmation from all categories
   * @returns {string}
   */
  getRandomAffirmation() {
    const pool = Object.values(this.affirmations || {})
      .flat()
      .filter(Boolean);
    
    if (!pool.length) return 'You are capable of amazing things.';
    
    const pick = this.app.randomFrom(pool);
    return pick?.text || pick || 'You are capable of amazing things.';
  }
  
  /**
   * Returns random self-inquiry question from random domain
   * @returns {Object}
   */
  getRandomInquiry() {
    const domains = this.inquiryEngine._getUniqueDomains();
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return this.inquiryEngine.getRandomQuestion(domain);
  }

  /**
   * Returns random quote from QuotesData
   * @returns {Object}
   */
  getRandomQuote() {
    return window.QuotesData?.getRandomQuote() || { 
      text: 'Stay positive!', 
      author: 'Unknown' 
    };
  }

  // ============================================
  // QUEST TRACKING
  // ============================================

  /**
   * Tracks a happiness content view and updates quest progress
   * Debounced to prevent double-counting
   * @returns {number} Total views today
   */
  trackView() {
    const now = Date.now();
    if (this._lastTracked && now - this._lastTracked < HappinessEngine.DEBOUNCE_MS) {
      return this.getTodayViewCount();
    }
    this._lastTracked = now;

    const today = new Date().toDateString();
    let data = this._getStorageData(today);
    data.count += 1;
    localStorage.setItem('daily_booster_views', JSON.stringify(data));
    
    // Update quest progress when target reached
    if (data.count === HappinessEngine.QUEST_TARGET && this.app.gamification) {
      this.app.gamification.progressQuest('daily', 'daily_booster', HappinessEngine.QUEST_TARGET);
    }
    
    return data.count;
  }

  /**
   * Gets today's view count without incrementing
   * @returns {number}
   */
  getTodayViewCount() {
    return this._getStorageData(new Date().toDateString()).count;
  }

  /**
   * Retrieves or initializes storage data for given date
   * @param {string} today - Date string
   * @returns {Object}
   */
  _getStorageData(today) {
    try {
      const stored = localStorage.getItem('daily_booster_views');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse storage data:', e);
    }
    return { date: today, count: 0 };
  }

  /**
   * Updates quest progress badge and completion banner
   */
  updateQuestDisplay() {
    const viewCount = this.getTodayViewCount();
    const badge = document.querySelector('#happiness-tab .badge');
    
    if (badge) {
      badge.textContent = `${viewCount} / ${HappinessEngine.QUEST_TARGET} (Quest)`;
      badge.className = `badge ${viewCount >= HappinessEngine.QUEST_TARGET ? 'badge-success' : 'badge-primary'}`;
    }
    
    this._toggleQuestCompleteBanner(viewCount);
  }

  /**
   * Shows/hides quest completion banner based on progress
   * @param {number} viewCount - Current view count
   */
  _toggleQuestCompleteBanner(viewCount) {
    const bannerId = 'happiness-quest-complete';
    let banner = document.getElementById(bannerId);
    
    if (viewCount >= HappinessEngine.QUEST_TARGET && !banner) {
      banner = document.createElement('div');
      banner.id = bannerId;
      banner.style.cssText = 'margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);';
      banner.innerHTML = '<p class="text-center" style="color:#22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'lucide-icon\'><path d=\'M18 6 7 17l-5-5\'/><path d=\'m22 10-7.5 7.5L13 16\'/></svg> Daily quest complete! Keep exploring if you\'d like!</p>';
      
      const header = document.querySelector('#happiness-tab .universal-content');
      header?.insertBefore(banner, header.querySelector('main'));
    } else if (viewCount < HappinessEngine.QUEST_TARGET && banner) {
      banner.remove();
    }
  }

  // ============================================
  // CARD ANIMATION
  // ============================================

  /**
   * Animates card flip transition with new content
   * @param {string} cardId - Card element ID
   * @param {string} newHtml - New HTML content
   */
  _flipCard(cardId, newHtml) {
    const card = this._getElement(cardId);
    if (!card) return;
    
    const inner = card.querySelector('.flip-card-inner');
    const back = card.querySelector('.flip-card-back');
    back.innerHTML = newHtml;
    
    const match = inner.style.transform.match(/-?\d+\.?\d*/);
    const currentY = match ? parseFloat(match[0]) : 0;
    inner.style.transform = `rotateY(${currentY + HappinessEngine.ROTATION_DEG}deg)`;
    
    const onEnd = () => {
      inner.removeEventListener('transitionend', onEnd);
      card.querySelector('.flip-card-front').innerHTML = newHtml;
    };
    inner.addEventListener('transitionend', onEnd);
  }

  // ============================================
  // CONTENT REFRESH (CONSOLIDATED)
  // ============================================

  /**
   * Generic refresh handler for all content types
   * @param {string} type - Content type (e.g., 'Booster', 'Quote')
   * @param {Function} getter - Content getter function
   * @param {string} cardId - Card element ID
   * @param {string} emoji - Card emoji
   * @param {string} title - Card title
   * @param {Function} formatter - HTML formatter function
   */
  _refreshContent(type, getter, cardId, emoji, title, formatter) {
    this[`current${type}`] = getter.call(this);
    const viewCount = this.trackView();
    const html = formatter.call(this, this[`current${type}`], emoji, title);
    
    this._flipCard(cardId, html);
    this.updateQuestDisplay();
    
    if (this.app.gamification) {
      this.app.gamification.incrementHappinessViews();
    }
    
    if (this.app.showToast) {
      const isComplete = viewCount >= HappinessEngine.QUEST_TARGET;
      const msg = isComplete 
        ? `Quest complete! You've viewed ${HappinessEngine.QUEST_TARGET} items today!`
        : `New ${title.toLowerCase()} revealed! (${viewCount}/${HappinessEngine.QUEST_TARGET})`;
      this.app.showToast(msg, 'success');
    }
  }

  refreshBooster() {
    this._refreshContent('Booster', this.getRandomBooster, 'booster-card', 
      'booster', 'Booster', this._formatBooster);
  }

  refreshQuote() {
    this._refreshContent('Quote', this.getRandomQuote, 'quote-card', 
      'quote', 'Quote', this._formatQuote);
  }

  refreshAffirmation() {
    this._refreshContent('Affirmation', this.getRandomAffirmation, 'affirm-card', 
      'affirmation', 'Affirmation', this._formatAffirmation);
  }

  refreshInquiry() {
    this._refreshContent('Inquiry', this.getRandomInquiry, 'inquiry-card', 
      'inquiry', 'Inquiry', this._formatInquiry);
  }

  // ============================================
  // HTML FORMATTERS
  // ============================================

  /**
   * Formats booster card HTML
   * @param {Object} booster - Booster object
   * @returns {string} HTML string
   */
  _formatBooster(booster) {
    return `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">${booster.emoji}</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> A Quick Happiness Booster</h2>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${booster.title}</h3>
        <p class="mt-2 text-lg">${booster.description}</p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>${booster.duration}</span> • <span>${booster.category}</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshBooster()" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  /**
   * Formats quote card HTML
   * @param {Object} quote - Quote object with text and author
   * @returns {string} HTML string
   */
  _formatQuote(quote) {
    return `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Inspirational Quote</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${quote.text}"
      </p>
      <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
        - ${quote.author}
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshQuote()" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  /**
   * Formats affirmation card HTML
   * @param {string} affirmation - Affirmation text
   * @returns {string} HTML string
   */
  _formatAffirmation(affirmation) {
    return `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Positive Affirmation</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${affirmation}"
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshAffirmation()" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  /**
   * Formats inquiry card HTML
   * @param {Object} inquiry - Inquiry object with question, domain, holding, intensity
   * @returns {string} HTML string
   */
  _formatInquiry(inquiry) {
    const emoji = HappinessEngine.INTENSITY_EMOJIS[inquiry.intensity] || '💭';
    return `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">${emoji}</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Self Inquiry</h2>
      </div>
      <div class="text-center">
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
            ${inquiry.domain}
          </span>
        </div>
        <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
          ${inquiry.question}
        </p>
        <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
          ${inquiry.holding}
        </p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>Level ${inquiry.intensity}</span> • <span>Self-Inquiry</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshInquiry()" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  // ============================================
  // RENDERING
  // ============================================

  /**
   * Renders the complete happiness tab with all content cards
   */
  render() {
    const tab = this._getElement('happiness-tab');
    if (!tab) return;
    
    // Generate fresh content
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = this.getRandomQuote();
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
        <span class="badge ${viewCount >= HappinessEngine.QUEST_TARGET ? 'badge-success' : 'badge-primary'}">${viewCount} / ${HappinessEngine.QUEST_TARGET} (Quest)</span>
      </div>

      ${viewCount >= HappinessEngine.QUEST_TARGET ? `
        <div id="happiness-quest-complete" style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color: #22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg> Daily quest complete! Keep exploring if you'd like!</p>
        </div>
      ` : ''}

      <main class="space-y-6">
        ${this._renderCard('affirm-card', 'affirmation', 'Positive Affirmation', 
          `<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentAffirmation}"
          </p>`, 'refreshAffirmation')}

        ${this._renderCard('quote-card', 'quote', 'Inspirational Quote', 
          `<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentQuote.text}"
          </p>
          <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
            - ${this.currentQuote.author}
          </p>`, 'refreshQuote')}

        ${this._renderCard('booster-card', 'booster', 'A Quick Happiness Booster', 
          `<h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${this.currentBooster.title}</h3>
          <p class="mt-2 text-lg">${this.currentBooster.description}</p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>${this.currentBooster.duration}</span> • <span>${this.currentBooster.category}</span>
          </div>`, 'refreshBooster')}

        ${this._renderCard('inquiry-card', 'inquiry', 'Self Inquiry', 
          `<div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
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
          </div>`, 'refreshInquiry')}
        ${this.buildCommunityCTA()}
      </main>
    </div>
  </div>`;
  }

  buildCommunityCTA() {
    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <img src="https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/CommunityHub.png" alt="Community" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;">
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Mingle & Practice, Chat and Be one with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renders a single flip card component
   * @param {string} id - Card ID
   * @param {string} emoji - Card emoji
   * @param {string} title - Card title
   * @param {string} content - Card content HTML
   * @param {string} refreshMethod - Refresh method name
   * @returns {string} HTML string
   */
  _renderCard(id, iconKey, title, content, refreshMethod) {
    const ICONS = {
      affirmation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
      quote: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>`,
      booster: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
      inquiry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
    };
    const icon = ICONS[iconKey] || '';
    return `
      <div class="neuro-card flip-card" id="${id}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="flex items-center" style="margin-bottom: 1rem;">
              ${icon}
              <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">${title}</h2>
            </div>
            <div class="text-center">
              ${content}
            </div>
            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
              <button onclick="window.featuresManager.engines.happiness.${refreshMethod}()" class="btn btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }
}

// Global export for browser
if (typeof window !== 'undefined') window.HappinessEngine = HappinessEngine;

export default HappinessEngine;