// DashboardManager.js - Complete Patched Version with Admin Badge Support
// Optimized gamification dashboard with badges, quests, and wellness tracking

import { InquiryEngine } from '../Features/InquiryEngine.js';
import DailyCards from '../Features/DailyCards.js';

// Constants
const CONSTANTS = {
  BADGES_PREVIEW_COUNT: 9,
  BADGE_GRID_COLUMNS: 3,
  WELLNESS_POLL_INTERVAL: 3000,
  COUNTDOWN_UPDATE_INTERVAL: 1000,
  RENDER_DEBOUNCE_MS: 100,
  
  RARITY_GRADIENTS: {
    common: 'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
    uncommon: 'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
    rare: 'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
    epic: 'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
    legendary: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
  },
  
  KARMA_BY_RARITY: {
    common: 3,
    uncommon: 5,
    rare: 10,
    epic: 15,
    legendary: 30
  },
  
  BADGE_CATEGORIES: {
    'First Wins': ['first_step', 'first_gratitude', 'first_journal', 'first_energy', 'first_tarot', 'first_meditation', 'first_purchase'],
    'Gratitude Badges': ['gratitude_warrior', 'gratitude_legend', 'gratitude_200', 'gratitude_500'],
    'Journaling Badges': ['journal_keeper', 'journal_master', 'journal_150', 'journal_400'],
    'Energy Tracking Badges': ['energy_tracker', 'energy_sage', 'energy_300', 'energy_600'],
    'Tarot Spreads Badges': ['tarot_apprentice', 'tarot_mystic', 'tarot_oracle', 'tarot_150', 'tarot_400'],
    'Meditations Badges': ['meditation_devotee', 'meditation_master', 'meditation_100', 'meditation_200'],
    'Happiness and Motivation Badges': ['happiness_seeker', 'joy_master', 'happiness_300', 'happiness_700'],
    'Wellness Exercises Badges': ['wellness_champion', 'wellness_guru', 'wellness_300', 'wellness_700'],
    'Streaks Badges': ['perfect_week', 'dedication_streak', 'unstoppable', 'legendary_streak'],
    'Quest Completion Badges': ['weekly_warrior', 'monthly_master', 'quest_crusher', 'daily_champion'],
    'Karma Currency Badges': ['karma_collector', 'karma_lord', 'xp_milestone', 'xp_titan'],
    'Level-Up Badges': ['level_5_hero', 'level_7_hero', 'level_10_hero'],
    'Chakra Balance Badges': ['chakra_balancer', 'chakra_master'],
    'Cross-Features Badges': ['triple_threat', 'super_day', 'complete_explorer', 'renaissance_soul']
  }
};

export default class DashboardManager {
  constructor(app) {
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
    
    // Bind methods for external calls
    this.boundMethods = {
      refreshQuote: this.refreshQuote.bind(this),
      switchQuestTab: this.switchQuestTab.bind(this),
      toggleAllBadges: this.toggleAllBadges.bind(this)
    };
    
    // Expose methods globally for onclick handlers
    if (window.app?.dashboard) {
      window.app.dashboard.refreshQuote = this.boundMethods.refreshQuote;
      window.app.dashboard.switchQuestTab = this.boundMethods.switchQuestTab;
      window.app.dashboard.toggleAllBadges = this.boundMethods.toggleAllBadges;
    }
    
    // Create debounced render
    this.render = this.debounce(this._render.bind(this), CONSTANTS.RENDER_DEBOUNCE_MS);
  }

  /* ---------- Utility Methods ---------- */
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  _flipCard(cardId, newHtml) {
    const card = document.getElementById(cardId);
    if (!card) return;
    
    const inner = card.querySelector('.flip-card-inner');
    const back = card.querySelector('.flip-card-back');
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
    
    const monthly = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    
    return { daily, weekly, monthly };
  }

  _formatCountdown(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    
    const parts = [];
    if (d) parts.push(String(d).padStart(2, '0') + 'd');
    parts.push(
      String(h).padStart(2, '0') + 'h',
      String(m).padStart(2, '0') + 'm',
      String(s).padStart(2, '0') + 's'
    );
    return parts.join(' ');
  }

  /* ---------- Countdown & Intervals ---------- */
  
  startCountdown() {
    const interval = setInterval(() => this.updateCountdownDisplays(), CONSTANTS.COUNTDOWN_UPDATE_INTERVAL);
    this.intervals.push(interval);
  }

  updateCountdownDisplays() {
    if (!this.app.gamification) return;
    
    try {
      const resets = this._getNextResetTimes();
      const now = new Date();
      
      ['daily', 'weekly', 'monthly'].forEach(type => {
        const el = document.getElementById(`countdown-${type}`);
        if (el) {
          el.textContent = this._formatCountdown(resets[type] - now);
        }
      });
    } catch (error) {
      console.error('Error updating countdown:', error);
    }
  }

  /* ---------- Quest Listeners ---------- */
  
  setupQuestListeners() {
    if (!this.app.gamification) return;
    
    this.app.gamification.on('questCompleted', quest => {
      if (this.app.gamification._bulkMode) return;
      
      this.app.showToast(`✅ Quest Complete: ${quest.name}! +${quest.xpReward} XP`, 'success');
      
      if (quest.inspirational) {
        setTimeout(() => {
          this.app.showToast(`💫 ${quest.inspirational}`, 'info');
        }, 1500);
      }
      
      this.render();
    });
    
    this.app.gamification.on('bulkQuestsComplete', ({ type, done, xp, karma }) => {
      const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
      const message = `✅ ${typeCapitalized} quests complete! +${xp} XP${karma ? ` +${karma} Karma` : ''}`;
      this.app.showToast(message, 'success');
    });
    
    this.app.gamification.on('questProgress', () => this.render());
    
    this.app.gamification.on('dailyQuestsComplete', () => {
      this.app.showToast('🌟 All Daily Quests Complete! +50 Bonus XP 🌟', 'success');
    });
    
    this.checkDailyReset();
  }

  checkDailyReset() {
    try {
      const today = new Date().toDateString();
      const lastReset = localStorage.getItem('last_quest_reset');
      
      if (lastReset !== today) {
        this.app.gamification.resetDailyQuests();
        localStorage.setItem('last_quest_reset', today);
      }
    } catch (error) {
      console.error('Error checking daily reset:', error);
    }
  }

  /* ---------- Wellness Tracking ---------- */
  
  setupWellnessTracking() {
    const tools = [
      { name: 'Self Reset', getStats: window.getSelfResetStats },
      { name: 'Full Body Scan', getStats: window.getFullBodyScanStats },
      { name: 'Nervous System Reset', getStats: window.getNervousResetStats },
      { name: 'Tension Sweep', getStats: window.getTensionSweepStats }
    ];
    
    // Initialize tracking
    tools.forEach(tool => {
      if (tool.getStats) {
        try {
          const stats = tool.getStats();
          this.lastWellnessXP[tool.name] = stats.xp || 0;
        } catch (error) {
          console.error(`Error initializing ${tool.name}:`, error);
          this.lastWellnessXP[tool.name] = 0;
        }
      }
    });
    
    const interval = setInterval(() => {
      tools.forEach(tool => {
        if (!tool.getStats) return;
        
        try {
          const stats = tool.getStats();
          const prev = this.lastWellnessXP[tool.name] || 0;
          
          if (stats.xp > prev) {
            const gained = stats.xp - prev;
            const karma = Math.floor(gained / 10);
            this.lastWellnessXP[tool.name] = stats.xp;
            
            if (this.app.gamification) {
              this.app.gamification.addXP(gained, tool.name);
              this.app.gamification.addKarma(karma, tool.name);
            }
            
            this.app.showToast(
              `✅ ${tool.name} Complete! +${gained} XP, +${karma} Karma`,
              'success'
            );
            this.render();
          }
        } catch (error) {
          console.error(`Error tracking ${tool.name}:`, error);
        }
      });
    }, CONSTANTS.WELLNESS_POLL_INTERVAL);
    
    this.intervals.push(interval);
  }

  /* ---------- Quote Card ---------- */
  
  renderQuoteCard() {
    this.currentQuote = window.QuotesData 
      ? window.QuotesData.getQuoteOfTheDay()
      : { 
          text: 'What you think, you become. What you feel, you attract. What you imagine, you create.',
          author: 'Buddha'
        };
    
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
            <div class="pt-8 flex justify-end">
              <button onclick="window.app.dashboard.refreshQuote()" class="btn btn-secondary">
                🔄 Refresh Quote
              </button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`;
  }

  refreshQuote() {
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
          <div class="pt-8 flex justify-end">
            <button onclick="window.app.dashboard.refreshQuote()" class="btn btn-secondary">
              🔄 Refresh Quote
            </button>
          </div>
        </div>`;
      
      this._flipCard('dashboard-quote-card', html);
      
      if (this.app.showToast) {
        this.app.showToast('📜 New quote revealed!', 'success');
      }
    } catch (error) {
      console.error('Error refreshing quote:', error);
    }
  }

  /* ---------- Gamification Widget ---------- */
  
  renderGamificationWidget(status, stats) {
    if (!this.app.gamification) return '';
    if (!this.app.state) {
      return '<div class="card dashboard-gamification mb-6"><p style="text-align:center;padding:20px;">Loading your progress...</p></div>';
    }

    // Auto-correct level & trigger spectacle if needed
    const levelInfo = this.app.gamification.calculateLevel();
    if (levelInfo.level > this.app.gamification.state.level) {
      this.app.gamification.checkLevelUp();
    }

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

  /* ---------- Wellness Toolkit ---------- */
  
  renderWellnessToolkit() {
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

  /* ---------- Quest Hub ---------- */
  
  renderQuestHub(status) {
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

  switchQuestTab(tabName) {
    document.querySelectorAll('.quest-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.questTab === tabName);
    });
    
    document.querySelectorAll('.quest-tab-content').forEach(content => {
      const show = content.id === `quest-content-${tabName}`;
      content.style.display = show ? 'block' : 'none';
      content.classList.toggle('active', show);
    });
  }

  renderQuestCard(quest, questType = 'daily') {
    const progressPercent = Math.min(100, ((quest.progress || 0) / (quest.target || 1)) * 100);
    
    let progressContent = `
      <div class="dashboard-quest-progress-header">
        <span>Progress</span>
        <span>${quest.progress || 0}/${quest.target || 1}</span>
      </div>`;
    
    if (quest.id === 'energy_checkin') {
      const dayDone = quest.subProgress?.day || false;
      const nightDone = quest.subProgress?.night || false;
      progressContent = `
        <div class="dashboard-energy-checkin">
          <span class="${dayDone ? 'dashboard-energy-done' : ''}">☀️ Day ${dayDone ? '✓' : ''}</span>
          <span class="${nightDone ? 'dashboard-energy-done' : ''}">🌙 Night ${nightDone ? '✓' : ''}</span>
        </div>`;
    }
    
    const isClickable = !quest.completed && quest.tab;
    const completedClass = quest.completed ? 'dashboard-quest-completed' : '';
    const clickableClass = isClickable ? 'dashboard-quest-clickable' : '';
    const hintHtml = isClickable ? '<div class="dashboard-quest-hint">👆 Click to start</div>' : '';
    const clickHandler = isClickable
      ? `onclick="window.app.nav.switchTab('${quest.tab}'); window.scrollTo({top:0,behavior:'smooth'});"`
      : '';

    return `
      <div class="card dashboard-quest-card ${completedClass} ${clickableClass}" ${clickHandler}>
        ${quest.completed ? '<div class="dashboard-quest-checkmark">✓</div>' : ''}
        <div class="dashboard-quest-header">
          <div class="dashboard-quest-icon">${quest.icon}</div>
          <div class="dashboard-quest-info">
            <h4 class="dashboard-quest-name">${quest.name}</h4>
            <p class="dashboard-quest-inspirational">${quest.inspirational}</p>
          </div>
        </div>
        ${!quest.completed ? `
          <div class="dashboard-quest-progress">
            ${progressContent}
            <div class="dashboard-quest-bar">
              <div class="dashboard-quest-fill" data-width="${progressPercent}"></div>
            </div>
          </div>` : '<div class="dashboard-quest-complete-msg">Quest Complete! 🎉</div>'}
        <div class="dashboard-quest-footer">
          <span class="dashboard-quest-xp">+${quest.xpReward} XP</span>
          ${quest.karmaReward ? `<span class="dashboard-quest-karma">+${quest.karmaReward} Karma</span>` : ''}
        </div>
        ${hintHtml}
      </div>`;
  }

  /* ---------- Badge Gallery (WITH ADMIN BADGE SUPPORT) ---------- */
  
  renderRecentAchievements(status) {
    if (!status.badges || status.badges.length === 0) return '';
    
    const allDefs = this.app.gamification.getBadgeDefinitions();
    const earned = new Set(status.badges.map(b => b.id));

    // List of known admin badge IDs from Admin-Tab.js
    const knownAdminBadgeIds = new Set([
      'early_supporter',
      'vip_member', 
      'beta_tester',
      'spiritual_guide',
      'community_hero'
    ]);

    // Latest earned badges for preview (game badges + admin badges)
    const latestEarned = status.badges
      .slice()
      .reverse()
      .slice(0, CONSTANTS.BADGES_PREVIEW_COUNT)
      .map(b => {
        // Check if it's a known admin badge
        const isAdminBadge = knownAdminBadgeIds.has(b.id);
        
        // Get definition from game badges OR use stored admin badge data
        const def = allDefs[b.id] || (isAdminBadge ? {
          name: b.name || 'Special Badge',
          icon: b.icon || '🏆',
          description: b.description || 'Admin awarded',
          xp: b.xp || 50,
          rarity: b.rarity || 'epic'
        } : null);
        
        // Skip if not a valid badge (not in game defs AND not a known admin badge)
        if (!def) return null;
        
        return {
          ...b,
          ...def,
          earned: true,
          karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 15
        };
      })
      .filter(Boolean); // Remove nulls

    // Full badge list (game badges only for "Show All")
    const gameBadges = Object.entries(allDefs).map(([id, def]) => ({
      id,
      ...def,
      earned: earned.has(id),
      karma: CONSTANTS.KARMA_BY_RARITY[def.rarity] || 3
    }));

    // Get only KNOWN admin badges that were actually awarded
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

    // Category-organized badges (add admin category ONLY if badges were awarded)
    const categories = { ...CONSTANTS.BADGE_CATEGORIES };
    if (awardedAdminBadges.length > 0) {
      categories['Admin Rewards'] = awardedAdminBadges.map(b => b.id);
    }

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

    // Preview badges HTML
    const previewHtml = latestEarned
      .map(badge => this.renderBadgeCard(badge))
      .join('');

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
      </div>`;
  }

  renderBadgeCard(badge) {
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

  toggleAllBadges() {
    const container = document.getElementById('all-badges-container');
    const btn = document.getElementById('show-all-btn');
    
    if (!container || !btn) return;
    
    const isOpen = container.style.display !== 'none';
    container.style.display = isOpen ? 'none' : 'block';
    
    const allDefs = this.app.gamification.getBadgeDefinitions();
    const status = this.app.gamification.getStatusSummary();
    const adminOnlyBadges = status.badges.filter(b => !allDefs[b.id]);
    const totalCount = Object.keys(allDefs).length + adminOnlyBadges.length;
    
    btn.textContent = isOpen 
      ? `Show All Badges (${totalCount})` 
      : 'Show Less';
  }

  /* ---------- Main Render ---------- */
  
  async _render() {
    const dashboard = document.getElementById('dashboard-tab');
    if (!dashboard) return;

    try {
      // Get quote
      this.currentQuote = window.QuotesData 
        ? window.QuotesData.getQuoteOfTheDay()
        : { 
            text: 'What you think, you become. What you feel, you attract. What you imagine, you create.',
            author: 'Buddha'
          };

      // Get status (will now include admin-awarded badges)
      const status = this.app.gamification 
        ? this.app.gamification.getStatusSummary()
        : {
            quests: { daily: [], weekly: [], monthly: [] },
            badges: [],
            xp: 0,
            karma: 0,
            streak: { current: 0 },
            totalJournalEntries: 0,
            totalHappinessViews: 0,
            totalTarotSpreads: 0,
            totalWellnessRuns: 0
          };

      const stats = this.app.state?.getStats?.() || {};
      const userName = this.app.state.currentUser?.name || 'Seeker';

      dashboard.innerHTML = `
        <div class="dashboard-container">
          <div class="dashboard-content">
            <header class="main-header project-curiosity"
                    style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavDashboard.png');
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

      // Animate progress bars
      this.animateProgressBars();
      
    } catch (error) {
      console.error('Error rendering dashboard:', error);
      dashboard.innerHTML = `
        <div class="card" style="padding: 2rem; text-align: center;">
          <h2 style="color: var(--neuro-accent);">⚠️ Error Loading Dashboard</h2>
          <p>Please refresh the page or contact support if the issue persists.</p>
        </div>`;
    }
  }

  animateProgressBars() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.dashboard-progress-width, .dashboard-quest-fill').forEach(el => {
        const width = el.dataset.width;
        if (width) {
          el.style.width = width + '%';
        }
      });
    });
  }

  /* ---------- Cleanup ---------- */
  
  destroy() {
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    // Clear cached elements
    this.cachedElements = {};
    
    // Remove global references
    if (window.app?.dashboard) {
      delete window.app.dashboard.refreshQuote;
      delete window.app.dashboard.switchQuestTab;
      delete window.app.dashboard.toggleAllBadges;
    }
    
    console.log('DashboardManager destroyed and cleaned up');
  }
}