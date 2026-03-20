/**
 * DashboardManager.js
 * Manages the user dashboard including gamification, quests, badges, and wellness tracking.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

import { InquiryEngine } from '../Features/InquiryEngine.js';
import DailyCards        from '../Features/DailyCards.js';
import { ActiveMembers } from '/Mini-Apps/CommunityHub/js/active-members.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const CONSTANTS = {
  BADGES_PREVIEW_COUNT:      9,
  BADGE_GRID_COLUMNS:        3,
  WELLNESS_POLL_INTERVAL:    3_000,
  COUNTDOWN_UPDATE_INTERVAL: 1_000,
  RENDER_DEBOUNCE_MS:        100,

  RARITY_GRADIENTS: {
    common:    'linear-gradient(135deg,rgba(245,245,247,.85) 0%,rgba(210,214,220,.85) 100%),linear-gradient(#f5f5f7,#d2d6dc)',
    uncommon:  'linear-gradient(135deg,rgba(0,224,132,.85) 0%,rgba(0,185,108,.85) 100%),linear-gradient(#00e084,#00b96c)',
    rare:      'linear-gradient(135deg,rgba(0,168,255,.85) 0%,rgba(0,123,204,.85) 100%),linear-gradient(#00a8ff,#007bcc)',
    epic:      'linear-gradient(135deg,rgba(184,0,230,.85) 0%,rgba(142,0,204,.85) 100%),linear-gradient(#b800e6,#8e00cc)',
    legendary: 'linear-gradient(135deg,rgba(255,195,0,.85) 0%,rgba(255,135,0,.85) 100%),linear-gradient(#ffc300,#ff8700)'
  },

  KARMA_BY_RARITY: {
    common: 3, uncommon: 5, rare: 10, epic: 15, legendary: 30
  },

  BADGE_CATEGORIES: {
    'First Wins':                   ['first_step','first_gratitude','first_journal','first_energy','first_tarot','first_meditation','first_purchase'],
    'Gratitude Badges':             ['gratitude_warrior','gratitude_legend','gratitude_200','gratitude_500'],
    'Journaling Badges':            ['journal_keeper','journal_master','journal_150','journal_400'],
    'Energy Tracking Badges':       ['energy_tracker','energy_sage','energy_300','energy_600'],
    'Tarot Spreads Badges':         ['tarot_apprentice','tarot_mystic','tarot_oracle','tarot_150','tarot_400'],
    'Meditations Badges':           ['meditation_devotee','meditation_master','meditation_100','meditation_200'],
    'Happiness and Motivation Badges': ['happiness_seeker','joy_master','happiness_300','happiness_700'],
    'Wellness Exercises Badges':    ['wellness_champion','wellness_guru','wellness_300','wellness_700'],
    'Streaks Badges':               ['perfect_week','dedication_streak','unstoppable','legendary_streak'],
    'Quest Completion Badges':      ['weekly_warrior','monthly_master','quest_crusher','daily_champion'],
    'Karma Currency Badges':        ['karma_collector','karma_lord','xp_milestone','xp_titan'],
    'Level-Up Badges':              ['level_5_hero','level_7_hero','level_10_hero'],
    'Chakra Balance Badges':        ['chakra_balancer','chakra_master'],
    'Cross-Features Badges':        ['triple_threat','super_day','complete_explorer','renaissance_soul']
  }
};

const UI_CONSTANTS = {
  MOBILE_BREAKPOINT:    768,
  BADGE_PREVIEW_DESKTOP: 9,
  BADGE_PREVIEW_MOBILE:  6,
  DAILY_BONUS_XP:       50
};

const KNOWN_ADMIN_BADGE_IDS = new Set([
  'early_supporter', 'vip_member', 'beta_tester', 'spiritual_guide', 'community_hero'
]);

// ─── Global navigation helper ─────────────────────────────────────────────────

window._navigateToHubSection = function(targetId) {
  window._pendingHubScrollTarget = targetId;
  window.app?.nav?.switchTab('community-hub');
};

// ─── DashboardManager ─────────────────────────────────────────────────────────

export default class DashboardManager {
  static FALLBACK_QUOTE = {
    text:   'What you think, you become. What you feel, you attract. What you imagine, you create.',
    author: 'Buddha'
  };

  constructor(app) {
    this.app          = app;
    this.currentQuote = null;
    this.dailyCards   = new DailyCards(app);
    this.intervals    = [];
    this.cachedElements = {};
    this.globals      = { QuotesData: () => window.QuotesData };

    if (window.app) window.app.dailyCards = this.dailyCards;

    this.setupQuestListeners();
    this.startCountdown();

    // Bind methods used via onclick attributes
    this.boundMethods = {
      refreshQuote:    this.refreshQuote.bind(this),
      switchQuestTab:  this.switchQuestTab.bind(this),
      toggleAllBadges: this.toggleAllBadges.bind(this)
    };

    if (window.app?.dashboard) {
      Object.assign(window.app.dashboard, this.boundMethods);
    }

    // Debounced main render
    this.render = this.debounce(this._render.bind(this), CONSTANTS.RENDER_DEBOUNCE_MS);
  }

  // ─── Utilities ─────────────────────────────────────────────────────────────

  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  _flipCard(cardId, newHtml) {
    const card  = document.getElementById(cardId);
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner');
    const back  = card.querySelector('.flip-card-back');
    if (!inner || !back) return;
    back.innerHTML = newHtml;
    const currentY = parseFloat(inner.style.transform.replace(/[^\d.-]/g, '')) || 0;
    inner.style.transform = `rotateY(${currentY + 360}deg)`;
    const onEnd = () => {
      inner.removeEventListener('transitionend', onEnd);
      const front = card.querySelector('.flip-card-front');
      if (front) front.innerHTML = newHtml;
    };
    inner.addEventListener('transitionend', onEnd);
  }

  _getNextResetTimes() {
    const now = new Date();
    const daily = new Date(now);
    daily.setDate(daily.getDate() + 1);
    daily.setHours(0, 0, 0, 0);
    const weekly = new Date(now);
    weekly.setDate(now.getDate() + ((7 - now.getDay()) % 7));
    weekly.setHours(0, 0, 0, 0);
    if (weekly <= now) weekly.setDate(weekly.getDate() + 7);
    const monthly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { daily, weekly, monthly };
  }

  _formatCountdown(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const parts = [];
    if (d) parts.push(`${String(d).padStart(2, '0')}d`);
    parts.push(`${String(h).padStart(2, '0')}h`, `${String(m).padStart(2, '0')}m`, `${String(s).padStart(2, '0')}s`);
    return parts.join(' ');
  }

  // ─── Countdown ─────────────────────────────────────────────────────────────

  startCountdown() {
    const id = setInterval(() => this.updateCountdownDisplays(), CONSTANTS.COUNTDOWN_UPDATE_INTERVAL);
    this.intervals.push(id);
  }

  updateCountdownDisplays() {
    if (!this.app.gamification || document.hidden) return;
    try {
      const resets = this._getNextResetTimes();
      const now    = new Date();
      ['daily', 'weekly', 'monthly'].forEach(type => {
        const el = document.getElementById(`countdown-${type}`);
        if (el) el.textContent = this._formatCountdown(resets[type] - now);
      });
    } catch (error) {
      console.error('[Dashboard] Countdown update failed:', error);
    }
  }

  // ─── Quest Listeners ───────────────────────────────────────────────────────

  setupQuestListeners() {
    if (!this.app.gamification) return;

    this.app.gamification.on('questCompleted', quest => {
      if (this.app.gamification.state._bulkMode) return;
      this.app.showToast(`Quest Complete: ${quest.name}! +${quest.xpReward} XP`, 'success');
      if (quest.inspirational) {
        setTimeout(() => this.app.showToast(quest.inspirational, 'info'), 1500);
      }
      this.render();
    });

    this.app.gamification.on('bulkQuestsComplete', ({ type, xp, karma }) => {
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      this.app.showToast(`${label} quests complete! +${xp} XP${karma ? ` +${karma} Karma` : ''}`, 'success');
    });

    this.app.gamification.on('questProgress', () => this.render());

    this.app.gamification.on('dailyQuestsComplete', () => {
      this.app.showToast(`All Daily Quests Complete! +${UI_CONSTANTS.DAILY_BONUS_XP} Bonus XP`, 'success');
    });
  }

  // ─── Quote Card ────────────────────────────────────────────────────────────

  renderQuoteCard() {
    const QuotesData  = this.globals.QuotesData();
    this.currentQuote = QuotesData
      ? QuotesData.getQuoteOfTheDay()
      : DashboardManager.FALLBACK_QUOTE;

    const quoteHtml = this._quoteInnerHtml(this.currentQuote);
    return `
      <div class="neuro-card flip-card" id="dashboard-quote-card">
        <div class="flip-card-inner">
          <div class="flip-card-front flex flex-col justify-between">${quoteHtml}</div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }

  _quoteInnerHtml(quote) {
    return `
      <div>
        <div class="flex items-center mb-8">
          <span class="text-3xl mr-4" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
          <h2 class="text-2xl font-bold" style="color:var(--neuro-text);">Inspirational Quote</h2>
        </div>
        <p class="text-2xl font-semibold text-center" style="color:var(--neuro-accent);line-height:1.5;padding-top:2rem;padding-bottom:2rem;">
          &ldquo;${quote.text}&rdquo;
        </p>
        <p class="mt-6 text-center text-lg" style="color:var(--neuro-text);">— ${quote.author}</p>
      </div>
      <div style="margin-top:2rem;display:flex;justify-content:flex-end;">
        <button type="button" onclick="window.app.dashboard.refreshQuote()" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh Quote
        </button>
      </div>`;
  }

  refreshQuote() {
    const QuotesData = this.globals.QuotesData();
    if (!QuotesData) return;
    try {
      this.currentQuote = QuotesData.getRandomQuote();
      this._flipCard('dashboard-quote-card', this._quoteInnerHtml(this.currentQuote));
      this.app.showToast?.('New quote revealed!', 'success');
    } catch (error) {
      console.error('[Dashboard] refreshQuote failed:', error);
    }
  }

  // ─── Gamification Widget ───────────────────────────────────────────────────

  renderGamificationWidget(status, stats) {
    if (!this.app.gamification) return '';
    if (!this.app.state) {
      return '<div class="card dashboard-gamification mb-6"><p style="text-align:center;padding:20px;">Loading your progress...</p></div>';
    }

    const levelInfo = this.app.gamification.calculateLevel();
    if (levelInfo.level > this.app.gamification.state.level) {
      this.app.gamification.checkLevelUp();
    }

    const statItems = [
      { value: status.karma,                    label: 'Karma',        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="6 3 18 3 22 9 12 22 2 9"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="12" y1="3" x2="2" y2="9"/><line x1="12" y1="3" x2="22" y2="9"/></svg>' },
      { value: stats.totalGratitudes || 0,      label: 'Gratitudes',   icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
      { value: status.totalJournalEntries,       label: 'Journaling',   icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
      { value: status.totalHappinessViews,       label: 'Boosters',     icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>' },
      { value: status.totalTarotSpreads,         label: 'Tarot Spreads',icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="11" height="14" rx="2"/><path d="M15.5 5.5 18 3l4 4-5.5 5.5"/><path d="m13 13 4.5 4.5"/><path d="m17.5 17.5 1 1"/></svg>' },
      { value: stats.weeklyMeditations || 0,     label: 'Meditations',  icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>' },
      { value: status.totalWellnessRuns,         label: 'Wellness Kit', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>' },
      { value: status.badges.length,             label: 'Badges',       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>' }
    ];

    const article = /^[aeiou]/i.test(levelInfo.title) ? 'an' : 'a';

    return `
      <div class="card dashboard-gamification mb-6">
        <div class="dashboard-wellness-header">
          <h2 class="dashboard-wellness-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Your Online Spiritual Progress
          </h2>
          <!-- Lighthouse: contrast fix — use --neuro-text-secondary (≥4.5:1 on card bg) instead of #6d5a42 on #c4ad91 -->
          <p class="dashboard-wellness-subtitle" style="color:var(--neuro-text-secondary,#4a3728);">Track your online journey and celebrate every milestone</p>
        </div>
        <div class="dashboard-progress-track" role="progressbar" aria-valuenow="${levelInfo.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="XP progress to next level">
          <div class="dashboard-progress-fill" style="width:${levelInfo.progress}%">
            <div class="dashboard-progress-shimmer"></div>
          </div>
        </div>
        <!-- Lighthouse: contrast fix — use darker green for XP numbers (#3d6e10 passes 4.5:1 on card bg) -->
        <p class="dashboard-xp-line" style="color:var(--neuro-text-secondary,#4a3728);">
          <span class="dashboard-xp-current" style="color:var(--neuro-accent-dark,#3d6e10);font-weight:700;">${status.xp}</span> XP
          <span class="dashboard-xp-sep">•</span>
          <span class="dashboard-xp-next" style="color:var(--neuro-accent-dark,#3d6e10);font-weight:700;">${levelInfo.pointsToNext}</span> to next
        </p>
        <div class="text-center mb-6">
          <h3 style="font-size:1.8rem;font-weight:bold;">You are ${article} ${levelInfo.title} (Level ${levelInfo.level})</h3>
        </div>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
          ${statItems.map(item => `
            <div class="stat-card dashboard-stat-card" style="box-shadow:var(--shadow-inset);border-radius:12px;">
              <!-- Lighthouse: contrast fix on stat values -->
              <div class="dashboard-stat-value" style="color:var(--neuro-accent-dark,#3d6e10);font-weight:700;">${item.value}</div>
              <div class="dashboard-stat-emoji" aria-hidden="true">${item.icon}</div>
              <div class="dashboard-stat-label" style="font-weight:700;color:var(--neuro-text-secondary,#4a3728);">${item.label}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ─── Wellness Toolkit ──────────────────────────────────────────────────────

  renderWellnessToolkit() {
    const tools = [
      { fn: 'openSelfReset',    label: '60-Second Self Reset',  name: 'Self Reset',      desc: 'Short Breathing practice' },
      { fn: 'openFullBodyScan', label: 'Full Body Scan',        name: 'Full Body Scan',  desc: 'Progressive relaxation' },
      { fn: 'openNervousReset', label: 'Nervous System Reset',  name: 'Nervous System',  desc: 'Balance & regulation' },
      { fn: 'openTensionSweep', label: 'Tension Sweep',         name: 'Tension Sweep',   desc: 'Release stored tension' }
    ];

    const icons = [
      '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>'
    ];

    return `
      <div class="card dashboard-wellness-toolkit mb-8">
        <div class="dashboard-wellness-header">
          <h2 class="dashboard-wellness-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            Wellness Toolkit
          </h2>
          <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
        </div>
        <div class="wellness-buttons-grid">
          ${tools.map((t, i) => `
            <button type="button" class="wellness-tool-btn wellness-tool-active"
                    onclick="window.${t.fn}()"
                    aria-label="${t.label}">
              <div class="wellness-tool-icon" aria-hidden="true">${icons[i]}</div>
              <div class="wellness-tool-content">
                <h3 class="wellness-tool-name">${t.name}</h3>
                <p class="wellness-tool-description">${t.desc}</p>
                <div class="wellness-tool-stats">
                  <span class="wellness-stat-xp" aria-label="Earns 10 XP">+10 XP</span>
                  <span class="wellness-stat-karma" aria-label="Earns 1 Karma">+1 Karma</span>
                </div>
              </div>
            </button>`).join('')}
        </div>
      </div>`;
  }

  // ─── Quest Hub ─────────────────────────────────────────────────────────────

  renderQuestHub(status) {
    try {
      const counts = ['daily', 'weekly', 'monthly'].reduce((acc, t) => {
        acc[t] = {
          completed: status.quests?.[t]?.filter(q => q.completed).length || 0,
          total:     status.quests?.[t]?.length || 0
        };
        return acc;
      }, {});

      const tabBtn = (type, label, iconHtml) => `
        <button type="button" class="quest-tab-btn${type === 'daily' ? ' active' : ''}"
                data-quest-tab="${type}"
                onclick="window.app.dashboard.switchQuestTab('${type}')"
                aria-selected="${type === 'daily'}"
                role="tab" id="quest-tab-${type}" aria-controls="quest-content-${type}">
          ${iconHtml} ${label}
          <span class="quest-count">(${counts[type].completed}/${counts[type].total})</span>
          <span id="countdown-${type}" class="countdown-badge" aria-live="off"></span>
        </button>`;

      const dailyIcon   = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      const weeklyIcon  = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h2v4H8z"/><path d="M14 14h2v4h-2z"/></svg>';
      const monthlyIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>';
      const giftIcon    = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>';
      const starIcon    = '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

      const questPanel = (type, label, isActive, completeMsg) => `
        <div class="quest-tab-content${isActive ? ' active' : ''}" id="quest-content-${type}"
             role="tabpanel" aria-labelledby="quest-tab-${type}"
             ${!isActive ? 'style="display:none"' : ''}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${status.quests[type].map(q => this.renderQuestCard(q, type)).join('')}
          </div>
          ${this.renderQuestCompleteMessage(type, counts[type].completed, counts[type].total, starIcon, completeMsg)}
        </div>`;

      return `
        <div class="card dashboard-quest-hub mb-8">
          <div class="dashboard-quest-header" style="text-align:center;">
            <h2 class="dashboard-quest-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              Quest Hub
            </h2>
          </div>
          <div class="quest-tabs" role="tablist" aria-label="Quest periods">
            ${tabBtn('daily',   'Daily',   dailyIcon)}
            ${tabBtn('weekly',  'Weekly',  weeklyIcon)}
            ${tabBtn('monthly', 'Monthly', monthlyIcon)}
          </div>
          ${questPanel('daily',   'Daily',   true,  `All Daily Quests Complete! +${UI_CONSTANTS.DAILY_BONUS_XP} Bonus XP`)}
          ${questPanel('weekly',  'Weekly',  false, 'All Weekly Quests Complete! Amazing!')}
          ${questPanel('monthly', 'Monthly', false, 'All Monthly Quests Complete! Legendary!')}
        </div>`;
    } catch (error) {
      console.error('[Dashboard] renderQuestHub failed:', error);
      return '<div class="card mb-8"><p style="text-align:center;padding:20px;">Unable to load quests. Please refresh.</p></div>';
    }
  }

  renderQuestCompleteMessage(type, completed, total, icon, message) {
    if (completed !== total || total === 0) return '';
    return `
      <div class="dashboard-quest-complete dashboard-quest-complete-${type}" role="status" aria-live="polite">
        <p class="dashboard-quest-complete-text">${icon} ${message} ${icon}</p>
      </div>`;
  }

  switchQuestTab(tabName) {
    // Sanitise input — only allow known tab names
    if (!['daily', 'weekly', 'monthly'].includes(tabName)) return;
    document.querySelectorAll('.quest-tab-btn').forEach(btn => {
      const active = btn.dataset.questTab === tabName;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    document.querySelectorAll('.quest-tab-content').forEach(content => {
      const show = content.id === `quest-content-${tabName}`;
      content.style.display = show ? 'block' : 'none';
      content.classList.toggle('active', show);
    });
  }

  renderQuestCard(quest, questType = 'daily') {
    const progressPercent = Math.min(100, ((quest.progress || 0) / (quest.goal || quest.target || 1)) * 100);
    const isEnergy        = quest.id === 'energy_checkin';
    const completedClass  = quest.completed ? 'dashboard-quest-completed' : '';
    const clickableClass  = (!quest.completed && quest.tab) ? 'dashboard-quest-clickable' : '';
    const hintHtml        = (!quest.completed && quest.tab)
      ? '<div class="dashboard-quest-hint" aria-hidden="true">Click to start</div>'
      : '';
    const clickHandler = (!quest.completed && quest.tab)
      ? `onclick="window.app.nav.switchTab('${quest.tab}'); window.scrollTo({top:0,behavior:'smooth'});"`
      : '';

    // Accessible label for clickable quest cards
    const cardRole  = (!quest.completed && quest.tab) ? 'role="button" tabindex="0"' : '';
    const cardLabel = (!quest.completed && quest.tab)
      ? `aria-label="Start quest: ${quest.name}"`
      : '';

    return `
      <div class="card dashboard-quest-card ${completedClass} ${clickableClass}"
           ${clickHandler} ${cardRole} ${cardLabel}>
        ${quest.completed ? '<div class="dashboard-quest-checkmark" aria-label="Completed">✓</div>' : ''}
        <div class="dashboard-quest-header">
          <div class="dashboard-quest-icon" aria-hidden="true">${quest.icon}</div>
          <div class="dashboard-quest-info">
            <h3 class="dashboard-quest-name">${quest.name}</h3>
            ${quest.inspirational ? `<p class="dashboard-quest-inspirational">${quest.inspirational}</p>` : ''}
            ${quest.target ? `<p class="dashboard-quest-target" style="font-size:0.85rem;color:var(--neuro-text-secondary);margin-top:0.25rem;">${quest.target}</p>` : ''}
          </div>
        </div>
        ${!quest.completed ? `
          <div class="dashboard-quest-progress">
            ${isEnergy ? `
              <div class="dashboard-energy-checkin">
                <span class="${quest.subProgress?.day ? 'dashboard-energy-done' : ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  Day ${quest.subProgress?.day ? '✓' : ''}
                </span>
                <span class="${quest.subProgress?.night ? 'dashboard-energy-done' : ''}">
                  <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  Night ${quest.subProgress?.night ? '✓' : ''}
                </span>
              </div>` : `
              <div class="dashboard-quest-progress-header">
                <span>Progress</span>
                <span>${quest.progress || 0}/${quest.goal || quest.target || 1}</span>
              </div>
              <div class="dashboard-quest-bar" role="progressbar"
                   aria-valuenow="${quest.progress || 0}"
                   aria-valuemin="0"
                   aria-valuemax="${quest.goal || quest.target || 1}"
                   aria-label="${quest.name} progress">
                <div class="dashboard-quest-fill" data-width="${progressPercent}"></div>
              </div>`}
          </div>`
        : '<div class="dashboard-quest-complete-msg">Quest Complete! 🎁</div>'}
        <div class="dashboard-quest-footer">
          <span class="dashboard-quest-xp">+${quest.xpReward} XP</span>
          ${quest.karmaReward ? `<span class="dashboard-quest-karma">+${quest.karmaReward} Karma</span>` : ''}
        </div>
        ${hintHtml}
      </div>`;
  }

  // ─── Badge Gallery ─────────────────────────────────────────────────────────

  renderRecentAchievements(status) {
    try {
      if (!status.badges?.length) return '';

      const allDefs    = this.app.gamification.getBadgeDefinitions();
      const earned     = new Set(status.badges.map(b => b.id));
      const isMobile   = window.innerWidth <= UI_CONSTANTS.MOBILE_BREAKPOINT;
      const previewCount = isMobile ? UI_CONSTANTS.BADGE_PREVIEW_MOBILE : UI_CONSTANTS.BADGE_PREVIEW_DESKTOP;

      const latestEarned     = this.getLatestEarnedBadges(status, allDefs, previewCount);
      const gameBadges       = this.getGameBadges(allDefs, earned);
      const awardedAdminBadges = this.getAwardedAdminBadges(status.badges);
      const fullList         = [...gameBadges, ...awardedAdminBadges];
      const categories       = this.buildBadgeCategories(fullList, awardedAdminBadges);
      const categoryHtml     = this.renderBadgeCategories(categories);
      const previewHtml      = latestEarned.map(b => this.renderBadgeCard(b)).join('');

      return `
        <div class="card dashboard-achievements mb-8">
          <div style="text-align:center;">
            <h2 class="dashboard-achievements-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              Earned Badges
            </h2>
            <div class="badges-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1rem;margin-bottom:1rem;"
                 role="list" aria-label="Earned badges">
              ${previewHtml}
            </div>
            <button type="button" class="btn btn-secondary" id="show-all-btn"
                    onclick="window.app.dashboard.toggleAllBadges()">
              Show All Badges (${fullList.length})
            </button>
            <div id="all-badges-container" style="display:none;margin-top:1.5rem;" aria-label="All badges by category">
              ${categoryHtml}
            </div>
          </div>
          <style>
            @media (max-width:${UI_CONSTANTS.MOBILE_BREAKPOINT}px) {
              .badges-grid { grid-template-columns: repeat(3,1fr) !important; gap:.5rem !important; }
              .badge-category-grid { grid-template-columns: repeat(2,1fr) !important; }
            }
          </style>
        </div>`;
    } catch (error) {
      console.error('[Dashboard] renderRecentAchievements failed:', error);
      return '<div class="card mb-8"><p style="text-align:center;padding:20px;">Unable to load badges.</p></div>';
    }
  }

  getLatestEarnedBadges(status, allDefs, count) {
    return status.badges
      .slice().reverse().slice(0, count)
      .map(b => this.processBadge(b, allDefs, KNOWN_ADMIN_BADGE_IDS.has(b.id)))
      .filter(Boolean);
  }

  processBadge(badge, allDefs, isAdmin) {
    const def = allDefs[badge.id] || (isAdmin ? this.getAdminBadgeDefaults(badge) : null);
    if (!def) return null;
    return { ...badge, ...def, earned: true, karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 15 };
  }

  getAdminBadgeDefaults(badge) {
    return {
      name:        badge.name        || 'Special Badge',
      icon:        badge.icon        || '🏅',
      description: badge.description || 'Admin awarded',
      xp:          badge.xp          || 50,
      rarity:      badge.rarity      || 'epic'
    };
  }

  getGameBadges(allDefs, earned) {
    return Object.entries(allDefs).map(([id, def]) => ({
      id, ...def, earned: earned.has(id),
      karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 3
    }));
  }

  getAwardedAdminBadges(badges) {
    return badges
      .filter(b => KNOWN_ADMIN_BADGE_IDS.has(b.id))
      .map(b => ({
        id:          b.id,
        name:        b.name        || 'Special Badge',
        icon:        b.icon        || '🏅',
        description: b.description || 'Admin awarded',
        xp:          b.xp          || 50,
        rarity:      b.rarity      || 'epic',
        earned:      true,
        karma:       CONSTANTS.KARMA_BY_RARITY[b.rarity || 'epic'] || 15
      }));
  }

  buildBadgeCategories(fullList, awardedAdminBadges) {
    const categories = { ...CONSTANTS.BADGE_CATEGORIES };
    if (awardedAdminBadges.length > 0) {
      categories['Admin Rewards'] = awardedAdminBadges.map(b => b.id);
    }
    return categories;
  }

  renderBadgeCategories(categories) {
    const allDefs          = this.app.gamification.getBadgeDefinitions();
    const status           = this.app.gamification.getStatusSummary();
    const earned           = new Set(status.badges.map(b => b.id));
    const gameBadges       = this.getGameBadges(allDefs, earned);
    const awardedAdminBadges = this.getAwardedAdminBadges(status.badges);
    const fullList         = [...gameBadges, ...awardedAdminBadges];

    return Object.entries(categories).map(([categoryName, badgeIds]) => {
      const categoryBadges = badgeIds.map(id => fullList.find(b => b.id === id)).filter(Boolean);
      if (categoryBadges.length === 0) return '';
      return `
        <div class="badge-category">
          <h3 class="badge-category-title">${categoryName}</h3>
          <div class="badge-category-grid"
               style="display:grid;grid-template-columns:repeat(${CONSTANTS.BADGE_GRID_COLUMNS},1fr);gap:1rem;"
               role="list" aria-label="${categoryName}">
            ${categoryBadges.map(b => this.renderBadgeCard(b)).join('')}
          </div>
        </div>`;
    }).join('');
  }

  renderBadgeCard(badge) {
    const locked   = !badge.earned;
    const gradient = CONSTANTS.RARITY_GRADIENTS[badge.rarity] || CONSTANTS.RARITY_GRADIENTS.common;
    const icon     = badge.earned
      ? badge.icon
      : '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
    const ariaLabel = `${badge.name}${locked ? ' (locked)' : ''}: ${badge.description}`;

    return `
      <div class="dashboard-badge-card${locked ? ' badge-locked' : ''}"
           style="background:${gradient};"
           role="listitem"
           aria-label="${ariaLabel}">
        <div class="badge-icon" aria-hidden="true">${icon}</div>
        <div class="badge-title">${badge.name}</div>
        <div class="badge-sub">${badge.description}</div>
        <div class="badge-rewards">
          <span>+${badge.xp} XP</span>
          <span>+${badge.karma} Karma</span>
        </div>
      </div>`;
  }

  toggleAllBadges() {
    const container = document.getElementById('all-badges-container');
    const btn       = document.getElementById('show-all-btn');
    if (!container || !btn) return;

    const isOpen = container.style.display !== 'none';
    container.style.display = isOpen ? 'none' : 'block';

    const allDefs        = this.app.gamification.getBadgeDefinitions();
    const status         = this.app.gamification.getStatusSummary();
    const adminOnlyBadges = status.badges.filter(b => !allDefs[b.id] && KNOWN_ADMIN_BADGE_IDS.has(b.id));
    const totalCount     = Object.keys(allDefs).length + adminOnlyBadges.length;

    btn.textContent = isOpen ? `Show All Badges (${totalCount})` : 'Show Less';
  }

  // ─── Main Render ───────────────────────────────────────────────────────────

  async _render() {
    const dashboard = document.getElementById('dashboard-tab');
    if (!dashboard) return;

    try {
      const status = this.app.gamification
        ? this.app.gamification.getStatusSummary()
        : { quests: { daily: [], weekly: [], monthly: [] }, badges: [], xp: 0, karma: 0, streak: { current: 0 }, totalJournalEntries: 0, totalHappinessViews: 0, totalTarotSpreads: 0, totalWellnessRuns: 0 };

      const stats    = this.app.state?.getStats?.() || {};
      const userName = this.app.state.currentUser?.name || 'Seeker';

      dashboard.innerHTML = `
        <div class="dashboard-container">
          <div class="dashboard-content">
            <header class="main-header project-curiosity"
                    style="--header-img:url('/public/Tabs/NavDashboard.webp');--header-title:'${userName}';--header-tag:'Your journey inward begins here';">
              <!-- Lighthouse heading order: h1 → h2 (was h3, fixed) -->
              <h1>${userName}'s Spiritual Dashboard</h1>
              <h2 style="font-size:1.1rem;font-weight:400;">Your journey inward begins here, so practice. explore. transform.</h2>
              <span class="header-sub"></span>
            </header>
            ${this.renderGamificationWidget(status, stats)}
            <div id="dashboardActiveMembersContainer"></div>
            ${this.dailyCards.renderDailyCardsSection()}
            <div id="sanctuaryContainer"></div>
            ${this.renderWellnessToolkit()}
            ${this.renderQuestHub(status)}
            ${this.renderRecentAchievements(status)}
            <div class="mb-8">${this.renderQuoteCard()}</div>
          </div>
        </div>`;

      this.animateProgressBars();

      // Render Active Members widget (ID swap technique preserved)
      const dashEl = document.getElementById('dashboardActiveMembersContainer');
      if (dashEl) {
        dashEl.id = 'activeMembersContainer';
        await ActiveMembers.render();
        dashEl.id = 'dashboardActiveMembersContainer';
      }

      this._renderSanctuarySection();

    } catch (error) {
      console.error('[Dashboard] _render failed:', error);
      dashboard.innerHTML = `
        <div class="card" style="padding:2rem;text-align:center;">
          <h2 style="color:var(--neuro-accent);">Error Loading Dashboard</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
          <button type="button" onclick="location.reload()" style="margin-top:1.5rem;padding:.75rem 2rem;background:var(--neuro-accent);color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer;">
            Retry
          </button>
        </div>`;
    }
  }

  animateProgressBars() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.dashboard-progress-width, .dashboard-quest-fill').forEach(el => {
        if (el.dataset.width) el.style.width = el.dataset.width + '%';
      });
    });
  }

  // ─── Sanctuary Section ─────────────────────────────────────────────────────

  _renderSanctuarySection() {
    const container = document.getElementById('sanctuaryContainer');
    if (!container) return;

    const features = [
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>', title: '8 Practice & Study Rooms',    desc: 'Join live rooms with other practitioners', target: 'roomsGrid' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', title: 'Chat & Connect',              desc: 'Talk, study and share with the community', target: 'communityReflectionsContainer' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>', title: 'Lunar Cycle Room',          desc: 'Practice in rhythm with the moon',       target: 'celestialLunarSection' },
      { icon: '<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>', title: 'Solar Cycle Room',           desc: 'Align your practice with the sun',       target: 'celestialSolarSection' }
    ];

    container.innerHTML = `
      <div class="card dashboard-wellness-toolkit dashboard-community-sanctuary mb-8">
        <img src="/public/Tabs/CommunityHub.webp" alt="Community Sanctuary"
             width="800" height="450" loading="lazy" decoding="async"
             style="width:100%;border-radius:var(--radius-md);display:block;aspect-ratio:16/9;object-fit:cover;">
        <div class="wellness-buttons-grid">
          ${features.map(f => `
            <button type="button" class="wellness-tool-btn wellness-tool-active"
                    onclick="window._navigateToHubSection('${f.target}')"
                    aria-label="${f.title}: ${f.desc}">
              <div class="wellness-tool-icon" aria-hidden="true">${f.icon}</div>
              <div class="wellness-tool-content">
                <h3 class="wellness-tool-name">${f.title}</h3>
                <p class="wellness-tool-description">${f.desc}</p>
              </div>
            </button>`).join('')}
        </div>
        <button type="button"
                onclick="window.app?.nav?.switchTab('community-hub')"
                class="btn btn-primary"
                style="width:100%;margin-top:1rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <picture>
            <source srcset="/public/Tabs/Community.webp" type="image/webp">
            <img src="/public/Tabs/Community.png" alt="" aria-hidden="true"
                 width="44" height="44" style="width:44px;height:44px;object-fit:contain;border-radius:4px;">
          </picture>
          Enter the Community Hub →
        </button>
      </div>`;
  }

  // ─── Cleanup ───────────────────────────────────────────────────────────────

  destroy() {
    this.intervals.forEach(id => clearInterval(id));
    this.intervals     = [];
    this.cachedElements = {};
    if (window.app?.dashboard) {
      delete window.app.dashboard.refreshQuote;
      delete window.app.dashboard.switchQuestTab;
      delete window.app.dashboard.toggleAllBadges;
    }
  }
}
