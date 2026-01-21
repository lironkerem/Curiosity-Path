// ============================================
// HAPPINESS ENGINE - OPTIMIZED
// ============================================

import affirmationsData from '../Features/Data/AffirmationsList.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

class HappinessEngine {
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
    this.boostersLoaded = true;
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = null;
    this.currentAffirmation = null;
    this.currentInquiry = null;
    this.affirmations = window.affirmations || affirmationsData;
    this.inquiryEngine = new InquiryEngine('beginner');
    this._lastTracked = 0;
    this._cachedElements = {};
    this.loadBoosters();
  }

  async loadBoosters() {
    try {
      const res = await fetch('./Features/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      this.boosters = data.boosters;
      this.boostersLoaded = true;
      const tab = this._getElement('happiness-tab');
      if (tab && !tab.classList.contains('hidden')) this.render();
    } catch (e) { console.error('boosters load failed', e); }
  }

  _getElement(id) {
    if (!this._cachedElements[id] || !document.getElementById(id)) {
      this._cachedElements[id] = document.getElementById(id);
    }
    return this._cachedElements[id];
  }

  _getDayOfYear() {
    const now = new Date(), start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  }

  getDailyBooster() { return this.boosters[this._getDayOfYear() % this.boosters.length]; }
  getRandomBooster() { return this.app.randomFrom(this.boosters); }
  
  getDailyAffirmation() {
    const list = this.affirmations?.general_positive_affirmations;
    if (!list?.length) return 'You are doing great.';
    const item = list[this._getDayOfYear() % list.length];
    return typeof item === 'string' ? item : item.text;
  }
  
  getRandomAffirmation() {
    const src = this.affirmations;
    if (!src) return 'You are capable of amazing things.';

    // flatten once, keep only real items
    const pool = Object.values(src)
                       .flat()
                       .filter(Boolean);   // removes null/undefined

    if (!pool.length) return 'You are capable of amazing things.';

    const pick = this.app.randomFrom(pool);
    return typeof pick === 'string' ? pick : pick.text;
  }
  
  getRandomInquiry() {
    const domains = [
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
    ];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return this.inquiryEngine.getRandomQuestion(domain);
  }

  trackView() {
    const now = Date.now();
    if (this._lastTracked && now - this._lastTracked < 1000) return this.getTodayViewCount();
    this._lastTracked = now;

    const today = new Date().toDateString();
    let data = this._getStorageData(today);
    data.count += 1;
    localStorage.setItem('daily_booster_views', JSON.stringify(data));
    
    if (data.count <= 5 && this.app.gamification) {
      if (data.count === 5) {
        this.app.gamification.progressQuest('daily', 'daily_booster', 5);
      }
    }
    return data.count;
  }

  getTodayViewCount() {
    return this._getStorageData(new Date().toDateString()).count;
  }

  _getStorageData(today) {
    try {
      const s = localStorage.getItem('daily_booster_views');
      if (s) {
        const p = JSON.parse(s);
        if (p.date === today) return p;
      }
    } catch {}
    return { date: today, count: 0 };
  }

  updateQuestDisplay() {
    const viewCount = this.getTodayViewCount();
    const badge = document.querySelector('#happiness-tab .badge');
    if (badge) {
      badge.textContent = `${viewCount} / 5 (Quest)`;
      badge.className = `badge ${viewCount >= 5 ? 'badge-success' : 'badge-primary'}`;
    }
    
    const bannerId = 'happiness-quest-complete';
    let banner = document.getElementById(bannerId);
    
    if (viewCount >= 5 && !banner) {
      banner = document.createElement('div');
      banner.id = bannerId;
      banner.style.cssText = 'margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);';
      banner.innerHTML = '<p class="text-center" style="color:#22c55e;">🎉 Daily quest complete! Keep exploring if you\'d like!</p>';
      const header = document.querySelector('#happiness-tab .universal-content');
      header?.insertBefore(banner, header.querySelector('main'));
    } else if (viewCount < 5 && banner) {
      banner.remove();
    }
  }

  _flipCard(cardId, newHtml) {
    const card = this._getElement(cardId);
    if (!card) return;
    
    const inner = card.querySelector('.flip-card-inner');
    const back = card.querySelector('.flip-card-back');
    back.innerHTML = newHtml;
    
    const match = inner.style.transform.match(/-?\d+\.?\d*/);
    const currentY = match ? parseFloat(match[0]) : 0;
    inner.style.transform = `rotateY(${currentY + 360}deg)`;
    
    const onEnd = () => {
      inner.removeEventListener('transitionend', onEnd);
      card.querySelector('.flip-card-front').innerHTML = newHtml;
    };
    inner.addEventListener('transitionend', onEnd);
  }

  _handleRefresh(type, getter, cardId, emoji, title, formatter) {
    this[type] = getter.call(this);
    const viewCount = this.trackView();
    const html = formatter(this[type], emoji, title);
    this._flipCard(cardId, html);
    this.updateQuestDisplay();
    
    if (this.app.gamification) this.app.gamification.incrementHappinessViews();
    if (this.app.showToast) {
      const msg = viewCount >= 5 
        ? `✨ Quest complete! You've viewed 5 items today!`
        : `✨ New ${title.toLowerCase()} revealed! (${viewCount}/5)`;
      this.app.showToast(msg, viewCount >= 5 ? 'success' : 'success');
    }
  }

  refreshBooster() {
    this._handleRefresh('currentBooster', this.getRandomBooster, 'booster-card', '💪', 'Booster', (b, emoji) => `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">${b.emoji}</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> A Quick Happiness Booster</h2>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${b.title}</h3>
        <p class="mt-2 text-lg">${b.description}</p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>${b.duration}</span> • <span>${b.category}</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshBooster()" class="btn btn-secondary">🔄 Refresh Booster</button>
      </div>`);
  }

  refreshQuote() {
    const getQuote = () => window.QuotesData?.getRandomQuote() || { text: 'Stay positive!', author: 'Unknown' };
    this._handleRefresh('currentQuote', getQuote, 'quote-card', '📜', 'Quote', (q) => `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">📜</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Inspirational Quote</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${q.text}"
      </p>
      <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
        - ${q.author}
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshQuote()" class="btn btn-secondary">🔄 Refresh Quote</button>
      </div>`);
  }

  refreshAffirmation() {
    this._handleRefresh('currentAffirmation', this.getRandomAffirmation, 'affirm-card', '✨', 'Affirmation', (a) => `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">✨</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Positive Affirmation</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${a}"
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshAffirmation()" class="btn btn-secondary">🔄 Refresh Affirmation</button>
      </div>`);
  }

  refreshInquiry() {
    const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };
    this._handleRefresh('currentInquiry', this.getRandomInquiry, 'inquiry-card', '💭', 'Inquiry', (i) => `
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <span class="text-3xl" style="margin-right:0.25rem">${intensityEmoji[i.intensity] || '💭'}</span>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Self Inquiry</h2>
      </div>
      <div class="text-center">
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
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshInquiry()" class="btn btn-secondary">🔄 Refresh Inquiry</button>
      </div>`);
  }

  render() {
    const tab = this._getElement('happiness-tab');
    if (!tab) return;
    
    // Fresh outputs on every render
    this.currentBooster = this.getRandomBooster();
    this.currentQuote = window.QuotesData?.getRandomQuote() || { text: 'Stay positive!', author: 'Unknown' };
    this.currentAffirmation = this.getRandomAffirmation();
    this.currentInquiry = this.getRandomInquiry();

    const viewCount = this.getTodayViewCount();
    const intensityEmoji = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '🔥' };

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
        <span class="badge ${viewCount >= 5 ? 'badge-success' : 'badge-primary'}">${viewCount} / 5 (Quest)</span>
      </div>

      ${viewCount >= 5 ? `
        <div id="happiness-quest-complete" style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color: #22c55e;">🎉 Daily quest complete! Keep exploring if you'd like!</p>
        </div>
      ` : ''}

      <main class="space-y-6">
        ${this._renderCard('booster-card', this.currentBooster.emoji, 'A Quick Happiness Booster', `
          <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${this.currentBooster.title}</h3>
          <p class="mt-2 text-lg">${this.currentBooster.description}</p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>${this.currentBooster.duration}</span> • <span>${this.currentBooster.category}</span>
          </div>
        `, 'refreshBooster')}

        ${this._renderCard('quote-card', '📜', 'Inspirational Quote', `
          <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentQuote.text}"
          </p>
          <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
            - ${this.currentQuote.author}
          </p>
        `, 'refreshQuote')}

        ${this._renderCard('affirm-card', '✨', 'Positive Affirmation', `
          <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentAffirmation}"
          </p>
        `, 'refreshAffirmation')}

        ${this._renderCard('inquiry-card', intensityEmoji[this.currentInquiry.intensity] || '💭', 'Self Inquiry', `
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

if (typeof window !== 'undefined') window.HappinessEngine = HappinessEngine;
export default HappinessEngine;