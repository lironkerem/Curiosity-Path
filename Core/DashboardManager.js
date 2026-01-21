// DashboardManager.js - Patched Bundle
// 1. Quest inspirational quotes now state exact targets.
// 2. Badge preview: 3×3 desktop, 3×2 mobile (CSS only).

import { InquiryEngine } from '../Features/InquiryEngine.js';
import DailyCards from '../Features/DailyCards.js';

const CONSTANTS = {
  BADGES_PREVIEW_COUNT: 9,          // keeps data logic intact
  BADGE_GRID_COLUMNS: 3,
  WELLNESS_POLL_INTERVAL: 3000,
  COUNTDOWN_UPDATE_INTERVAL: 1000,
  RENDER_DEBOUNCE_MS: 100,

  RARITY_GRADIENTS: {
    common:  'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
    uncommon:'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
    rare:    'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
    epic:    'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
    legendary:'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
  },
  KARMA_BY_RARITY: { common:3, uncommon:5, rare:10, epic:15, legendary:30 },

  // NEW: quest inspirational quotes (exact targets)
  QUEST_QUOTES: {
    daily: {
      gratitude:      'Log 10 gratuities (any entries) to complete this quest.',
      journal:        'Save 1 journal entry to complete this quest.',
      happiness:      'Refresh any happiness card 5 times to complete this quest.',
      tarot:          'Complete one 6-card (or larger) spread to complete this quest.',
      meditation:     'Finish 1 meditation session to complete this quest.',
      wellness:       'Run any wellness-tool once to complete this quest.',
      energy:         'Tick both day ☀️ and night 🌙 check-ins to complete this quest.'
    },
    weekly: {
      gratitude:      'Log 70 gratitudes across the week to complete this quest.',
      journal:        'Save 5 journal entries across the week to complete this quest.',
      happiness:      'Refresh happiness cards 35 times across the week to complete this quest.',
      tarot:          'Complete five 6-card (or larger) spreads across the week to complete this quest.',
      meditation:     'Finish 5 meditation sessions across the week to complete this quest.',
      wellness:       'Run wellness-tools 5 times across the week to complete this quest.',
      energy:         'Tick 14 energy check-ins (day & night) across the week to complete this quest.'
    },
    monthly: {
      gratitude:      'Log 300 gratitudes during the month to complete this quest.',
      journal:        'Save 20 journal entries during the month to complete this quest.',
      happiness:      'Refresh happiness cards 150 times during the month to complete this quest.',
      tarot:          'Complete twenty 6-card (or larger) spreads during the month to complete this quest.',
      meditation:     'Finish 20 meditation sessions during the month to complete this quest.',
      wellness:       'Run wellness-tools 20 times during the month to complete this quest.',
      energy:         'Tick 60 energy check-ins (day & night) during the month to complete this quest.'
    }
  }
};

export default class DashboardManager {
  constructor(app){
    this.app = app;
    this.currentQuote = null;
    this.dailyCards = new DailyCards(app);
    this.intervals = [];
    this.cachedElements = {};
    this.lastWellnessXP = {};
    if (window.app) window.app.dailyCards = this.dailyCards;
    this.setupQuestListeners();
    this.setupWellnessTracking();
    this.startCountdown();
    this.boundMethods = {
      refreshQuote: this.refreshQuote.bind(this),
      switchQuestTab: this.switchQuestTab.bind(this),
      toggleAllBadges: this.toggleAllBadges.bind(this)
    };
    if (window.app?.dashboard){
      window.app.dashboard.refreshQuote   = this.boundMethods.refreshQuote;
      window.app.dashboard.switchQuestTab = this.boundMethods.switchQuestTab;
      window.app.dashboard.toggleAllBadges= this.boundMethods.toggleAllBadges;
    }
    this.render = this.debounce(this._render.bind(this), CONSTANTS.RENDER_DEBOUNCE_MS);
  }

  /* ---------- utility ---------- */
  debounce(func, wait){
    let timeout;
    return function executedFunction(...args){
      const later = () => { clearTimeout(timeout); func(...args); };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  _flipCard(cardId, newHtml){
    const card = document.getElementById(cardId);
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner'), back = card.querySelector('.flip-card-back');
    if (!inner || !back) return;
    back.innerHTML = newHtml;
    const currentY = parseFloat(inner.style.transform.replace(/[^\d.-]/g, '')) || 0;
    inner.style.transform = `rotateY(${currentY + 360}deg)`;
    const onEnd = () => { inner.removeEventListener('transitionend', onEnd); card.querySelector('.flip-card-front').innerHTML = newHtml; };
    inner.addEventListener('transitionend', onEnd);
  }
  _getNextResetTimes(){
    const now = new Date(), daily = new Date(now), weekly = new Date(now), monthly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    daily.setDate(daily.getDate() + 1); daily.setHours(0, 0, 0, 0);
    weekly.setDate(now.getDate() + ((7 - now.getDay()) % 7)); weekly.setHours(0, 0, 0, 0);
    if (weekly <= now) weekly.setDate(weekly.getDate() + 7);
    return { daily, weekly, monthly };
  }
  _formatCountdown(ms){
    const totalSec = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(totalSec / 86400), h = Math.floor((totalSec % 86400) / 3600), m = Math.floor((totalSec % 3600) / 60), s = totalSec % 60;
    const parts = [];
    if (d) parts.push(String(d).padStart(2, '0') + 'd');
    parts.push(String(h).padStart(2, '0') + 'h', String(m).padStart(2, '0') + 'm', String(s).padStart(2, '0') + 's');
    return parts.join(' ');
  }

  /* ---------- countdown ---------- */
  startCountdown(){
    const interval = setInterval(() => this.updateCountdownDisplays(), CONSTANTS.COUNTDOWN_UPDATE_INTERVAL);
    this.intervals.push(interval);
  }
  updateCountdownDisplays(){
    if (!this.app.gamification) return;
    try {
      const resets = this._getNextResetTimes(), now = new Date();
      ['daily', 'weekly', 'monthly'].forEach(type => {
        const el = document.getElementById(`countdown-${type}`);
        if (el) el.textContent = this._formatCountdown(resets[type] - now);
      });
    } catch (e) { console.error('Error updating countdown:', e); }
  }

  /* ---------- quest listeners ---------- */
  setupQuestListeners(){
    if (!this.app.gamification) return;
    this.app.gamification.on('questCompleted', q => {
      if (this.app.gamification._bulkMode) return;
      this.app.showToast(`✅ Quest Complete: ${q.name}! +${q.xpReward} XP`, 'success');
      if (q.inspirational) setTimeout(() => this.app.showToast(`💫 ${q.inspirational}`, 'info'), 1500);
      this.render();
    });
    this.app.gamification.on('bulkQuestsComplete', ({ type, done, xp, karma }) => {
      const msg = `✅ ${type.charAt(0).toUpperCase() + type.slice(1)} quests complete! +${xp} XP${karma ? ` +${karma} Karma` : ''}`;
      this.app.showToast(msg, 'success');
    });
    this.app.gamification.on('questProgress', () => this.render());
    this.app.gamification.on('dailyQuestsComplete', () => this.app.showToast('🌟 All Daily Quests Complete! +50 Bonus XP 🌟', 'success'));
    this.checkDailyReset();
  }
  checkDailyReset(){
    try {
      const today = new Date().toDateString(), lastReset = localStorage.getItem('last_quest_reset');
      if (lastReset !== today) {
        this.app.gamification.resetDailyQuests();
        localStorage.setItem('last_quest_reset', today);
      }
    } catch (e) { console.error('Error checking daily reset:', e); }
  }

  /* ---------- wellness ---------- */
  setupWellnessTracking(){
    const tools = [
      { name: 'Self Reset', getStats: window.getSelfResetStats },
      { name: 'Full Body Scan', getStats: window.getFullBodyScanStats },
      { name: 'Nervous System Reset', getStats: window.getNervousResetStats },
      { name: 'Tension Sweep', getStats: window.getTensionSweepStats }
    ];
    tools.forEach(tool => {
      if (tool.getStats) try {
        const stats = tool.getStats();
        this.lastWellnessXP[tool.name] = stats.xp || 0;
      } catch { this.lastWellnessXP[tool.name] = 0; }
    });
    const interval = setInterval(() => {
      tools.forEach(tool => {
        if (!tool.getStats) return;
        try {
          const stats = tool.getStats(), prev = this.lastWellnessXP[tool.name] || 0;
          if (stats.xp > prev) {
            const gained = stats.xp - prev, karma = Math.floor(gained / 10);
            this.lastWellnessXP[tool.name] = stats.xp;
            if (this.app.gamification) {
              this.app.gamification.addXP(gained, tool.name);
              this.app.gamification.addKarma(karma, tool.name);
            }
            this.app.showToast(`✅ ${tool.name} Complete! +${gained} XP, +${karma} Karma`, 'success');
            this.render();
          }
        } catch (e) { console.error(`Error tracking ${tool.name}:`, e); }
      });
    }, CONSTANTS.WELLNESS_POLL_INTERVAL);
    this.intervals.push(interval);
  }

  /* ---------- quote card ---------- */
  renderQuoteCard(){
    this.currentQuote = window.QuotesData ? window.QuotesData.getQuoteOfTheDay() : { text: 'What you think, you become. What you feel, you attract. What you imagine, you create.', author: 'Buddha' };
    return `
      <div class="neuro-card flip-card" id="dashboard-quote-card">
        <div class="flip-card-inner">
          <div class="flip-card-front flex flex-col justify-between">
            <div>
              <div class="flex items-center mb-8">
                <span class="text-3xl mr-4">📜</span>
                <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">Inspirational Quote</h2>
              </div>
              <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent); line-height: 1.5; padding-top: 2rem; padding-bottom: 2rem;">
                "${this.currentQuote.text}"
              </p>
              <p class="mt-6 text-center text-lg" style="color: var(--neuro-text);">
                — ${this.currentQuote.author}
              </p>
            </div>
            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
              <button onclick="window.app.dashboard.refreshQuote()" class="btn btn-secondary">🔄 Refresh Quote</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }
  refreshQuote(){
    if (!window.QuotesData) return;
    try {
      this.currentQuote = window.QuotesData.getRandomQuote();
      const html = `
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center mb-8">
              <span class="text-3xl mr-4">📜</span>
              <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">Inspirational Quote</h2>
            </div>
            <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent); line-height: 1.5; padding-top: 2rem; padding-bottom: 2rem;">
              "${this.currentQuote.text}"
            </p>
            <p class="mt-6 text-center text-lg" style="color: var(--neuro-text);">
              — ${this.currentQuote.author}
            </p>
          </div>
          <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
            <button onclick="window.app.dashboard.refreshQuote()" class="btn btn-secondary">🔄 Refresh Quote</button>
          </div>
        </div>`;
      this._flipCard('dashboard-quote-card', html);
      if (this.app.showToast) this.app.showToast('📜 New quote revealed!', 'success');
    } catch (e) { console.error('Error refreshing quote:', e); }
  }

  /* ---------- gamification widget ---------- */
  renderGamificationWidget(status, stats){
    if (!this.app.gamification) return '';
    if (!this.app.state) return '<div class="card dashboard-gamification mb-6"><p style="text-align:center;padding:20px;">Loading your progress...</p></div>';

    const levelInfo = this.app.gamification.calculateLevel();
    if (levelInfo.level > this.app.gamification.state.level) this.app.gamification.checkLevelUp();

    const statItems = [
      { value: status.karma, label: 'Karma', emoji: '💎' },
      { value: stats.totalGratitudes || 0, label: 'Gratitudes', emoji: '❤️' },
      { value: status.totalJournalEntries, label: 'Journaling', emoji: '📓' },
      { value: status.totalHappinessViews, label: 'Boosters', emoji: '💡' },
      { value: status.totalTarotSpreads, label: 'Tarot Spreads', emoji: '🔮' },
      { value: stats.weeklyMeditations || 0, label: 'Meditations', emoji: '🧘' },
      { value: status.totalWellnessRuns, label: 'Wellness Kit', emoji: '🌿' },
      { value: status.badges.length, label: 'Badges', emoji: '🎖️' }
    ];

    return `
      <div class="card dashboard-gamification mb-6">
        <div class="dashboard-wellness-header">
          <h3 class="dashboard-wellness-title">🧬 Your Online Spiritual Progress</h3>
          <p class="dashboard-wellness-subtitle">Track your online journey and celebrate every milestone</p>
        </div>
        <div class="dashboard-progress-track">
          <div class="dashboard-progress-fill" style="width:${levelInfo.progress}%">
            <div class="dashboard-progress-shimmer"></div>
          </div>
        </div>
        <p class="dashboard-xp-line">
          <span class="dashboard-xp-current">${status.xp}</span> XP
          <span class="dashboard-xp-sep">•</span>
          <span class="dashboard-xp-next">${levelInfo.pointsToNext}</span> to next
        </p>
        <div class="text-center mb-6">
          <h3 style="font-size:1.8rem;font-weight:bold;">
            You are ${levelInfo.title.match(/^[aeiou]/i) ? 'an' : 'a'} ${levelInfo.title} (Level ${levelInfo.level})
          </h3>
        </div>
        <div class="grid grid-cols-4 md:grid-cols-8 gap-2">
          ${statItems.map(item => `
            <div class="stat-card dashboard-stat-card" style="box-shadow:var(--shadow-inset);border-radius:12px;">
              <div class="dashboard-stat-value">${item.value}</div>
              <div class="dashboard-stat-emoji">${item.emoji}</div>
              <div class="dashboard-stat-label" style="font-weight:700;">${item.label}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ---------- wellness toolkit ---------- */
  renderWellnessToolkit(){
    return `
      <div class="card dashboard-wellness-toolkit mb-8">
        <div class="dashboard-wellness-header">
          <h3 class="dashboard-wellness-title">🌟 Wellness Toolkit</h3>
          <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
        </div>
        <div class="wellness-buttons-grid">
          <button class="wellness-tool-btn wellness-tool-active" onclick="window.openSelfReset()" aria-label="60-Second Self Reset">
            <div class="wellness-tool-icon">🧘</div>
            <div class="wellness-tool-content">
              <h4 class="wellness-tool-name">Self Reset</h4>
              <p class="wellness-tool-description">Short Breathing practice</p>
              <div class="wellness-tool-stats">
                <span class="wellness-stat-xp">✨ +10 XP</span>
                <span class="wellness-stat-karma">💎 +1 Karma</span>
              </div>
            </div>
          </button>
          <button class="wellness-tool-btn wellness-tool-active" onclick="window.openFullBodyScan()" aria-label="Full Body Scan">
            <div class="wellness-tool-icon">🌊</div>
            <div class="wellness-tool-content">
              <h4 class="wellness-tool-name">Full Body Scan</h4>
              <p class="wellness-tool-description">Progressive relaxation</p>
              <div class="wellness-tool-stats">
                <span class="wellness-stat-xp">✨ +10 XP</span>
                <span class="wellness-stat-karma">💎 +1 Karma</span>
              </div>
            </div>
          </button>
          <button class="wellness-tool-btn wellness-tool-active" onclick="window.openNervousReset()" aria-label="Nervous System Reset">
            <div class="wellness-tool-icon">⚡</div>
            <div class="wellness-tool-content">
              <h4 class="wellness-tool-name">Nervous System</h4>
              <p class="wellness-tool-description">Balance & regulation</p>
              <div class="wellness-tool-stats">
                <span class="wellness-stat-xp">✨ +10 XP</span>
                <span class="wellness-stat-karma">💎 +1 Karma</span>
              </div>
            </div>
          </button>
          <button class="wellness-tool-btn wellness-tool-active" onclick="window.openTensionSweep()" aria-label="Tension Sweep">
            <div class="wellness-tool-icon">🌀</div>
            <div class="wellness-tool-content">
              <h4 class="wellness-tool-name">Tension Sweep</h4>
              <p class="wellness-tool-description">Release stored tension</p>
              <div class="wellness-tool-stats">
                <span class="wellness-stat-xp">✨ +10 XP</span>
                <span class="wellness-stat-karma">💎 +1 Karma</span>
              </div>
            </div>
          </button>
        </div>
      </div>`;
  }

  /* ---------- quest hub ---------- */
  renderQuestHub(status){
    const dailyCompleted = status.quests?.daily?.filter(q => q.completed).length || 0;
    const dailyTotal = status.quests?.daily?.length || 0;
    const weeklyCompleted = status.quests?.weekly?.filter(q => q.completed).length || 0;
    const weeklyTotal = status.quests?.weekly?.length || 0;
    const monthlyCompleted = status.quests?.monthly?.filter(q => q.completed).length || 0;
    const monthlyTotal = status.quests?.monthly?.length || 0;

    return `
      <div class="card dashboard-quest-hub mb-8">
        <div class="dashboard-quest-header" style="text-align:center;">
          <h3 class="dashboard-quest-title">🎯 Quest Hub</h3>
        </div>
        <div class="quest-tabs">
          <button class="quest-tab-btn active" data-quest-tab="daily" onclick="window.app.dashboard.switchQuestTab('daily')">
            📋 Daily <span class="quest-count">(${dailyCompleted}/${dailyTotal})</span>
            <span id="countdown-daily" class="countdown-badge"></span>
          </button>
          <button class="quest-tab-btn" data-quest-tab="weekly" onclick="window.app.dashboard.switchQuestTab('weekly')">
            🌟 Weekly <span class="quest-count">(${weeklyCompleted}/${weeklyTotal})</span>
            <span id="countdown-weekly" class="countdown-badge"></span>
          </button>
          <button class="quest-tab-btn" data-quest-tab="monthly" onclick="window.app.dashboard.switchQuestTab('monthly')">
            ✨ Monthly <span class="quest-count">(${monthlyCompleted}/${monthlyTotal})</span>
            <span id="countdown-monthly" class="countdown-badge"></span>
          </button>
        </div>
        <div class="quest-tab-content active" id="quest-content-daily">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${status.quests.daily.map(q => this.renderQuestCard(q, 'daily')).join('')}
          </div>
          ${dailyCompleted === dailyTotal && dailyTotal > 0 ? `
            <div class="dashboard-quest-complete dashboard-quest-complete-daily">
              <p class="dashboard-quest-complete-text">🌟 All Daily Quests Complete! +50 Bonus XP 🌟</p>
            </div>` : ''}
        </div>
        <div class="quest-tab-content" id="quest-content-weekly" style="display:none">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${status.quests.weekly.map(q => this.renderQuestCard(q, 'weekly')).join('')}
          </div>
          ${weeklyCompleted === weeklyTotal && weeklyTotal > 0 ? `
            <div class="dashboard-quest-complete dashboard-quest-complete-weekly">
              <p class="dashboard-quest-complete-text">⭐ All Weekly Quests Complete! Amazing! ⭐</p>
            </div>` : ''}
        </div>
        <div class="quest-tab-content" id="quest-content-monthly" style="display:none">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${status.quests.monthly.map(q => this.renderQuestCard(q, 'monthly')).join('')}
          </div>
          ${monthlyCompleted === monthlyTotal && monthlyTotal > 0 ? `
            <div class="dashboard-quest-complete dashboard-quest-complete-monthly">
              <p class="dashboard-quest-complete-text">🎉 All Monthly Quests Complete! Legendary! 🎉</p>
            </div>` : ''}
        </div>
      </div>`;
  }
  switchQuestTab(tabName){
    document.querySelectorAll('.quest-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.questTab === tabName));
    document.querySelectorAll('.quest-tab-content').forEach(content => {
      const show = content.id === `quest-content-${tabName}`;
      content.style.display = show ? 'block' : 'none';
      content.classList.toggle('active', show);
    });
  }
  renderQuestCard(quest, questType = 'daily'){
    const progressPercent = Math.min(100, ((quest.progress || 0) / (quest.target || 1)) * 100);
    const isEnergy = quest.id === 'energy_checkin';
    const completedClass = quest.completed ? 'dashboard-quest-completed' : '';
    const clickableClass = (!quest.completed && quest.tab) ? 'dashboard-quest-clickable' : '';
    const hintHtml = (!quest.completed && quest.tab) ? '<div class="dashboard-quest-hint">👆 Click to start</div>' : '';
    const clickHandler = (!quest.completed && quest.tab) ? `onclick="window.app.nav.switchTab('${quest.tab}'); window.scrollTo({top:0,behavior:'smooth'});"` : '';

    // NEW: use exact-target inspirational quotes
    const inspirational = CONSTANTS.QUEST_QUOTES[questType][quest.id] || quest.inspirational;

    return `
      <div class="card dashboard-quest-card ${completedClass} ${clickableClass}" ${clickHandler}>
        ${quest.completed ? '<div class="dashboard-quest-checkmark">✓</div>' : ''}
        <div class="dashboard-quest-header">
          <div class="dashboard-quest-icon">${quest.icon}</div>
          <div class="dashboard-quest-info">
            <h4 class="dashboard-quest-name">${quest.name}</h4>
            <p class="dashboard-quest-inspirational">${inspirational}</p>
          </div>
        </div>
        ${!quest.completed ? `
          <div class="dashboard-quest-progress">
            ${isEnergy ? `
              <div class="dashboard-energy-checkin">
                <span class="${quest.subProgress?.day ? 'dashboard-energy-done' : ''}">☀️ Day ${quest.subProgress?.day ? '✓' : ''}</span>
                <span class="${quest.subProgress?.night ? 'dashboard-energy-done' : ''}">🌙 Night ${quest.subProgress?.night ? '✓' : ''}</span>
              </div>` : `
              <div class="dashboard-quest-progress-header">
                <span>Progress</span>
                <span>${quest.progress || 0}/${quest.target || 1}</span>
              </div>
              <div class="dashboard-quest-bar">
                <div class="dashboard-quest-fill" data-width="${progressPercent}"></div>
              </div>`}
          </div>` : '<div class="dashboard-quest-complete-msg">Quest Complete! 🎉</div>'}
        <div class="dashboard-quest-footer">
          <span class="dashboard-quest-xp">+${quest.xpReward} XP</span>
          ${quest.karmaReward ? `<span class="dashboard-quest-karma">+${quest.karmaReward} Karma</span>` : ''}
        </div>
        ${hintHtml}
      </div>`;
  }

  /* ---------- badges ---------- */
  renderRecentAchievements(status){
    if (!status.badges || status.badges.length === 0) return '';

    const allDefs = this.app.gamification.getBadgeDefinitions();
    const earned = new Set(status.badges.map(b => b.id));
    const knownAdminBadgeIds = new Set(['early_supporter','vip_member','beta_tester','spiritual_guide','community_hero']);

    const latestEarned = status.badges
      .slice()
      .reverse()
      .slice(0, CONSTANTS.BADGES_PREVIEW_COUNT)
      .map(b => {
        const isAdminBadge = knownAdminBadgeIds.has(b.id);
        const def = allDefs[b.id] || (isAdminBadge ? {
          name: b.name || 'Special Badge',
          icon: b.icon || '🏆',
          description: b.description || 'Admin awarded',
          xp: b.xp || 50,
          rarity: b.rarity || 'epic'
        } : null);
        if (!def) return null;
        return { ...b, ...def, earned: true, karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 15 };
      })
      .filter(Boolean);

    const gameBadges = Object.entries(allDefs).map(([id, def]) => ({
      id, ...def, earned: earned.has(id), karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 3
    }));
    const awardedAdminBadges = status.badges
      .filter(b => knownAdminBadgeIds.has(b.id))
      .map(b => ({
        id: b.id,
        name: b.name || 'Special Badge',
        icon: b.icon || '🏆',
        description: b.description || 'Admin awarded',
        xp: b.xp || 50,
        rarity: b.rarity || 'epic',
        earned: true,
        karma: CONSTANTS.KARMA_BY_RARITY[b.rarity || 'epic'] || 15
      }));

    const fullList = [...gameBadges, ...awardedAdminBadges];
    const categories = { ...CONSTANTS.BADGE_CATEGORIES };
    if (awardedAdminBadges.length > 0) categories['Admin Rewards'] = awardedAdminBadges.map(b => b.id);

    const previewHtml = latestEarned.map(badge => this.renderBadgeCard(badge)).join('');
    const categoryHtml = Object.entries(categories)
      .map(([categoryName, badgeIds]) => {
        const categoryBadges = badgeIds
          .map(id => fullList.find(b => b.id === id))
          .filter(Boolean);
        if (categoryBadges.length === 0) return '';
        return `
          <div class="badge-category">
            <h4 class="badge-category-title">${categoryName}</h4>
            <div class="badge-category-grid" style="display: grid; grid-template-columns: repeat(${CONSTANTS.BADGE_GRID_COLUMNS}, 1fr); gap: 1rem;">
              ${categoryBadges.map(badge => this.renderBadgeCard(badge)).join('')}
            </div>
          </div>`;
      })
      .join('');

    // NEW: mobile-only 3×2 grid (CSS)
    const mobileCss = `
      <style>
        @media (max-width: 768px){
          .badges-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .badge-category-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      </style>`;

    return `
      <div class="card dashboard-achievements mb-8">
        <div style="text-align:center;">
          <h3 class="dashboard-achievements-title">🏆 Earned Badges</h3>
          <div class="badges-grid" style="display: grid; grid-template-columns: repeat(auto-fill,minmax(140px,1fr)); gap: 1rem; margin-bottom: 1rem;">
            ${previewHtml}
          </div>
          <button class="btn btn-secondary" id="show-all-btn" onclick="window.app.dashboard.toggleAllBadges()">
            Show All Badges (${fullList.length})
          </button>
          <div id="all-badges-container" style="display:none; margin-top:1.5rem;">
            ${categoryHtml}
          </div>
        </div>
        ${mobileCss}
      </div>`;
  }
  renderBadgeCard(badge){
    const cardClass = badge.earned ? '' : 'badge-locked';
    const gradient = CONSTANTS.RARITY_GRADIENTS[badge.rarity] || CONSTANTS.RARITY_GRADIENTS.common;
    const icon = badge.earned ? badge.icon : '🔒';
    return `
      <div class="dashboard-badge-card ${cardClass}" style="background:${gradient};">
        <div class="badge-icon">${icon}</div>
        <div class="badge-title">${badge.name}</div>
        <div class="badge-sub">${badge.description}</div>
        <div class="badge-rewards">
          <span>+${badge.xp} XP</span>
          <span>+${badge.karma} Karma</span>
        </div>
      </div>`;
  }
  toggleAllBadges(){
    const container = document.getElementById('all-badges-container'), btn = document.getElementById('show-all-btn');
    if (!container || !btn) return;
    const isOpen = container.style.display !== 'none';
    container.style.display = isOpen ? 'none' : 'block';
    const allDefs = this.app.gamification.getBadgeDefinitions();
    const status = this.app.gamification.getStatusSummary();
    const adminOnlyBadges = status.badges.filter(b => !allDefs[b.id]);
    const totalCount = Object.keys(allDefs).length + adminOnlyBadges.length;
    btn.textContent = isOpen ? `Show All Badges (${totalCount})` : 'Show Less';
  }

  /* ---------- main render ---------- */
  async _render(){
    const dashboard = document.getElementById('dashboard-tab');
    if (!dashboard) return;
    try {
      this.currentQuote = window.QuotesData ? window.QuotesData.getQuoteOfTheDay() : { text: 'What you think, you become. What you feel, you attract. What you imagine, you create.', author: 'Buddha' };
      const status = this.app.gamification ? this.app.gamification.getStatusSummary() : {
        quests: { daily: [], weekly: [], monthly: [] },
        badges: [], xp: 0, karma: 0, streak: { current: 0 },
        totalJournalEntries: 0, totalHappinessViews: 0, totalTarotSpreads: 0, totalWellnessRuns: 0
      };
      const stats = this.app.state?.getStats?.() || {};
      const userName = this.app.state.currentUser?.name || 'Seeker';

      dashboard.innerHTML = `
        <div class="dashboard-container">
          <div class="dashboard-content">
            <header class="main-header project-curiosity"
                    style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavDashboard.png');
                           --header-title:'${userName}';
                           --header-tag:'Your journey inward begins here, so practice. explore. transform.'">
              <h1>${userName}'s Spiritual Dashboard</h1>
              <h3>Your journey inward begins here, so practice. explore. transform.</h3>
              <span class="header-sub"></span>
            </header>
            ${this.renderGamificationWidget(status, stats)}
            ${this.dailyCards.renderDailyCardsSection()}
            ${this.renderWellnessToolkit()}
            ${this.renderQuestHub(status)}
            ${this.renderRecentAchievements(status)}
            <div class="mb-8">${this.renderQuoteCard()}</div>
          </div>
        </div>`;

      this.animateProgressBars();
    } catch (e) {
      console.error('Error rendering dashboard:', e);
      dashboard.innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center;">
          <h2 style="color: var(--neuro-accent);">⚠️ Error Loading Dashboard</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>`;
    }
  }
  animateProgressBars(){
    requestAnimationFrame(() => {
      document.querySelectorAll('.dashboard-progress-width, .dashboard-quest-fill').forEach(el => {
        const width = el.dataset.width;
        if (width) el.style.width = width + '%';
      });
    });
  }

  /* ---------- cleanup ---------- */
  destroy(){
    this.intervals.forEach(i => clearInterval(i));
    this.intervals = [];
    this.cachedElements = {};
    if (window.app?.dashboard){
      delete window.app.dashboard.refreshQuote;
      delete window.app.dashboard.switchQuestTab;
      delete window.app.dashboard.toggleAllBadges;
    }
    console.log('DashboardManager destroyed and cleaned up');
  }
}