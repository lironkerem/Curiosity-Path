// ============================================
// HAPPINESS ENGINE - OPTIMIZED & CONSOLIDATED
// ============================================

import affirmationsData from '../Features/Data/AffirmationsList.js';
import { InquiryEngine } from '../Features/InquiryEngine.js';

class HappinessEngine {
  static QUEST_TARGET    = 5;
  static DEBOUNCE_MS     = 1000;
  static ROTATION_DEG    = 360;
  static INTENSITY_EMOJIS = { 1:'🌱', 2:'🌿', 3:'🌳', 4:'🔥' };

  constructor(app) {
    this.app = app;
    this.boosters = [
      { id:1, title:'5-Minute Dance Party',  emoji:'💃', description:"Put on your favorite song and move your body!", duration:'5 min', category:'Movement' },
      { id:2, title:'Gratitude Snapshot',    emoji:'📸', description:"Quickly name 3 things you're grateful for right now.", duration:'3 min', category:'Mindfulness' },
      { id:3, title:'Power Pose',            emoji:'🦸', description:'Stand like a superhero for 2 minutes to boost confidence.', duration:'2 min', category:'Confidence' },
      { id:4, title:'Mindful Sip',           emoji:'🍵', description:'Drink a glass of water or tea, focusing only on the sensation.', duration:'4 min', category:'Calm' },
      { id:5, title:'Quick Stretch',         emoji:'🤸', description:'Gently stretch your arms, neck, and back for 3 minutes.', duration:'3 min', category:'Body' },
      { id:6, title:'Listen to One Song',    emoji:'🎶', description:'Listen to one favorite song without any distractions.', duration:'4 min', category:'Joy' }
    ];
    this.boostersLoaded      = false;
    this.currentBooster      = this.getRandomBooster();
    this.currentQuote        = null;
    this.currentAffirmation  = null;
    this.currentInquiry      = null;
    this.affirmations        = affirmationsData;
    this.inquiryEngine       = new InquiryEngine('beginner');
    this._lastTracked        = 0;
    this._cachedElements     = {};
    this.loadBoosters();
  }

  // ── XSS escape helper ──────────────────────────────────────────────────────
  _esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Data Loading ───────────────────────────────────────────────────────────

  async loadBoosters() {
    try {
      const res  = await fetch('/Data/HappinessBoostersList.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.boosters = data.boosters;
      this.boostersLoaded = true;
      // Fixed: use .active class (not .hidden) to detect visible tab
      const tab = this._getElement('happiness-tab');
      if (tab?.classList.contains('active')) this.render();
    } catch (e) {
      console.error('Failed to load happiness boosters:', e);
      this.boostersLoaded = true;
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────────

  _getElement(id) {
    if (!this._cachedElements[id] || !document.getElementById(id)) {
      this._cachedElements[id] = document.getElementById(id);
    }
    return this._cachedElements[id];
  }

  _getDayOfYear() {
    const now = new Date();
    return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  }

  // ── Content Getters ────────────────────────────────────────────────────────

  getDailyBooster()      { return this.boosters[this._getDayOfYear() % this.boosters.length]; }
  getRandomBooster()     { return this.app.randomFrom(this.boosters); }

  getDailyAffirmation() {
    const list = this.affirmations?.general_positive_affirmations;
    if (!list?.length) return 'You are doing great.';
    const item = list[this._getDayOfYear() % list.length];
    return typeof item === 'string' ? item : item.text;
  }

  getRandomAffirmation() {
    const pool = Object.values(this.affirmations || {}).flat().filter(Boolean);
    if (!pool.length) return 'You are capable of amazing things.';
    const pick = this.app.randomFrom(pool);
    return pick?.text || pick || 'You are capable of amazing things.';
  }

  getRandomInquiry() {
    const domains = this.inquiryEngine._getUniqueDomains();
    return this.inquiryEngine.getRandomQuestion(domains[Math.floor(Math.random() * domains.length)]);
  }

  getRandomQuote() {
    return window.QuotesData?.getRandomQuote() || { text:'Stay positive!', author:'Unknown' };
  }

  // ── Quest Tracking ─────────────────────────────────────────────────────────

  trackView() {
    const now = Date.now();
    if (this._lastTracked && now - this._lastTracked < HappinessEngine.DEBOUNCE_MS) return this.getTodayViewCount();
    this._lastTracked = now;
    const today = new Date().toDateString();
    let data = this._getStorageData(today);
    data.count += 1;
    localStorage.setItem('daily_booster_views', JSON.stringify(data));
    if (this.app.gamification) {
      const gm = this.app.gamification;
      gm.progressQuest('daily',   'daily_booster',          1);
      gm.progressQuest('weekly',  'happiness_boosters_20',  1);
      gm.progressQuest('monthly', 'monthly_happiness_100',  1);
    }
    return data.count;
  }

  getTodayViewCount() { return this._getStorageData(new Date().toDateString()).count; }

  _getStorageData(today) {
    try {
      const stored = localStorage.getItem('daily_booster_views');
      if (stored) { const p = JSON.parse(stored); if (p.date === today) return p; }
    } catch (e) { console.error('Failed to parse storage data:', e); }
    return { date: today, count: 0 };
  }

  updateQuestDisplay() {
    const viewCount = this.getTodayViewCount();
    const badge     = document.getElementById('happiness-quest-badge');
    if (badge) {
      const isComplete = viewCount >= HappinessEngine.QUEST_TARGET;
      badge.style.cssText = `display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${isComplete ? 'background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);' : 'background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);'}`;
      const countEl = document.getElementById('happiness-quest-count');
      if (countEl) countEl.textContent = viewCount;
    }
    this._toggleQuestCompleteBanner(viewCount);
  }

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

  // ── Card Animation ─────────────────────────────────────────────────────────

  _flipCard(cardId, newHtml) {
    const card = this._getElement(cardId);
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner');
    const back  = card.querySelector('.flip-card-back');
    back.innerHTML = newHtml;
    const match    = inner.style.transform.match(/-?\d+\.?\d*/);
    const currentY = match ? parseFloat(match[0]) : 0;
    inner.style.transform = `rotateY(${currentY + HappinessEngine.ROTATION_DEG}deg)`;
    const onEnd = () => {
      inner.removeEventListener('transitionend', onEnd);
      card.querySelector('.flip-card-front').innerHTML = newHtml;
    };
    inner.addEventListener('transitionend', onEnd);
  }

  // ── Content Refresh ────────────────────────────────────────────────────────

  _refreshContent(type, getter, cardId, title, formatter) {
    this[`current${type}`] = getter.call(this);
    const viewCount = this.trackView();
    const html      = formatter.call(this, this[`current${type}`], title);
    this._flipCard(cardId, html);
    this.updateQuestDisplay();
    if (this.app.gamification) this.app.gamification.incrementHappinessViews();
    if (this.app.showToast) {
      const isComplete = viewCount >= HappinessEngine.QUEST_TARGET;
      this.app.showToast(
        isComplete
          ? `Quest complete! You've viewed ${HappinessEngine.QUEST_TARGET} items today!`
          : `New ${title.toLowerCase()} revealed! (${viewCount}/${HappinessEngine.QUEST_TARGET})`,
        'success'
      );
    }
  }

  refreshBooster()     { this._refreshContent('Booster',    this.getRandomBooster,    'booster-card',  'Booster',     this._formatBooster);    }
  refreshQuote()       { this._refreshContent('Quote',      this.getRandomQuote,      'quote-card',    'Quote',       this._formatQuote);       }
  refreshAffirmation() { this._refreshContent('Affirmation',this.getRandomAffirmation,'affirm-card',   'Affirmation', this._formatAffirmation); }
  refreshInquiry()     { this._refreshContent('Inquiry',    this.getRandomInquiry,    'inquiry-card',  'Inquiry',     this._formatInquiry);     }

  // ── HTML Formatters (all escaped) ─────────────────────────────────────────

  _formatBooster(booster) {
    return `
      <div class="flex items-center" style="margin-bottom:1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <h2 class="text-2xl font-bold" style="color:var(--neuro-text);"> A Quick Happiness Booster</h2>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color:var(--neuro-accent);">${this._esc(booster.title)}</h3>
        <p class="mt-2 text-lg">${this._esc(booster.description)}</p>
        <div class="mt-4 text-sm" style="color:var(--neuro-text-light);">
          <span>${this._esc(booster.duration)}</span> • <span>${this._esc(booster.category)}</span> • <span>${this._esc(booster.emoji)}</span>
        </div>
      </div>
      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshBooster()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  _formatQuote(quote) {
    return `
      <div class="flex items-center" style="margin-bottom:1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
        <h2 class="text-2xl font-bold" style="color:var(--neuro-text);"> Inspirational Quote</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color:var(--neuro-accent);">"${this._esc(quote.text)}"</p>
      <p class="mt-3 text-center text-lg" style="color:var(--neuro-text);">- ${this._esc(quote.author)}</p>
      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshQuote()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  _formatAffirmation(affirmation) {
    return `
      <div class="flex items-center" style="margin-bottom:1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        <h2 class="text-2xl font-bold" style="color:var(--neuro-text);"> Positive Affirmation</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color:var(--neuro-accent);">"${this._esc(affirmation)}"</p>
      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshAffirmation()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  _formatInquiry(inquiry) {
    const emoji = HappinessEngine.INTENSITY_EMOJIS[inquiry.intensity] || '💭';
    return `
      <div class="flex items-center" style="margin-bottom:1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <h2 class="text-2xl font-bold" style="color:var(--neuro-text);"> Self Inquiry</h2>
      </div>
      <div class="text-center">
        <div style="margin-bottom:1rem;padding:0.5rem;background:var(--neuro-bg-secondary);border-radius:8px;display:inline-block;">
          <span style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:var(--neuro-accent);">${this._esc(inquiry.domain)}</span>
        </div>
        <p class="text-2xl font-semibold" style="color:var(--neuro-accent);line-height:1.4;margin-bottom:1rem;">${this._esc(inquiry.question)}</p>
        <p class="mt-2 text-lg" style="font-style:italic;color:var(--neuro-text-secondary);">${this._esc(inquiry.holding)}</p>
        <div class="mt-4 text-sm" style="color:var(--neuro-text-light);">
          <span>Level ${inquiry.intensity}</span> • <span>${emoji} Self-Inquiry</span>
        </div>
      </div>
      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshInquiry()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`;
  }

  // ── Rendering ──────────────────────────────────────────────────────────────

  render() {
    const tab = this._getElement('happiness-tab');
    if (!tab) return;
    this.currentBooster     = this.getRandomBooster();
    this.currentQuote       = this.getRandomQuote();
    this.currentAffirmation = this.getRandomAffirmation();
    this.currentInquiry     = this.getRandomInquiry();
    const viewCount         = this.getTodayViewCount();

    tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavHappiness.webp');--header-title:'';
                     --header-tag:'Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry'">
        <h1>Happiness and Motivation</h1>
        <h3>Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry</h3>
        <span class="header-sub"></span>
      </header>

      <div class="flex items-center justify-between" style="margin-bottom:2rem;padding:1rem;background:rgba(102,126,234,0.05);border-radius:8px;">
        <span style="color:var(--neuro-text);font-weight:600;">Daily Quest Progress</span>
        <span id="happiness-quest-badge" style="display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${viewCount >= HappinessEngine.QUEST_TARGET ? 'background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);' : 'background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);'}"><span id="happiness-quest-count">${viewCount}</span><span>/ ${HappinessEngine.QUEST_TARGET} Quest</span></span>
      </div>

      ${viewCount >= HappinessEngine.QUEST_TARGET ? `
        <div id="happiness-quest-complete" style="margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color:#22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg> Daily quest complete! Keep exploring if you'd like!</p>
        </div>` : ''}

      <main class="space-y-6">
        ${this._renderCard('affirm-card',  'affirmation', 'Positive Affirmation',
          `<p class="text-2xl font-semibold text-center" style="color:var(--neuro-accent);">"${this._esc(this.currentAffirmation)}"</p>`,
          'refreshAffirmation')}

        ${this._renderCard('quote-card', 'quote', 'Inspirational Quote',
          `<p class="text-2xl font-semibold text-center" style="color:var(--neuro-accent);">"${this._esc(this.currentQuote.text)}"</p>
           <p class="mt-3 text-center text-lg" style="color:var(--neuro-text);">- ${this._esc(this.currentQuote.author)}</p>`,
          'refreshQuote')}

        ${this._renderCard('booster-card', 'booster', 'A Quick Happiness Booster',
          `<h3 class="text-2xl font-bold" style="color:var(--neuro-accent);">${this._esc(this.currentBooster.title)}</h3>
           <p class="mt-2 text-lg">${this._esc(this.currentBooster.description)}</p>
           <div class="mt-4 text-sm" style="color:var(--neuro-text-light);"><span>${this._esc(this.currentBooster.duration)}</span> • <span>${this._esc(this.currentBooster.category)}</span></div>`,
          'refreshBooster')}

        ${this._renderCard('inquiry-card', 'inquiry', 'Self Inquiry',
          `<div style="margin-bottom:1rem;padding:0.5rem;background:var(--neuro-bg-secondary);border-radius:8px;display:inline-block;">
             <span style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:var(--neuro-accent);">${this._esc(this.currentInquiry.domain)}</span>
           </div>
           <p class="text-2xl font-semibold" style="color:var(--neuro-accent);line-height:1.4;margin-bottom:1rem;">${this._esc(this.currentInquiry.question)}</p>
           <p class="mt-2 text-lg" style="font-style:italic;color:var(--neuro-text-secondary);">${this._esc(this.currentInquiry.holding)}</p>
           <div class="mt-4 text-sm" style="color:var(--neuro-text-light);"><span>Level ${this.currentInquiry.intensity}</span> • <span>Self-Inquiry</span></div>`,
          'refreshInquiry')}
        ${this.buildCommunityCTA()}
      </main>
    </div>
  </div>`;
  }

  buildCommunityCTA() {
    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin:0 0 0.75rem;font-size:1.15rem;text-align:center;">Mingle &amp; Practice, Chat and Be one with the Community</h3>
        </div>
        <p style="margin:0 0 1.5rem;font-size:0.92rem;line-height:1.6;">Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button onclick="document.activeElement?.blur();window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>`;
  }

  _renderCard(id, iconKey, title, content, refreshMethod) {
    const ICONS = {
      affirmation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
      quote:       `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>`,
      booster:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
      inquiry:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
    };
    return `
      <div class="neuro-card flip-card" id="${id}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="flex items-center" style="margin-bottom:1rem;">${ICONS[iconKey] || ''}<h2 class="text-2xl font-bold" style="color:var(--neuro-text);">${title}</h2></div>
            <div class="text-center">${content}</div>
            <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
              <button onclick="window.featuresManager.engines.happiness.${refreshMethod}()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }
}

export default HappinessEngine;