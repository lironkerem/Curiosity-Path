// ============================================
// Features/KarmaShopEngine.js  (QUEST-SKIPS RESET MID-WEEK-MONTH + LIVE COUNTERS)
// ============================================

export class KarmaShopEngine {
  constructor(app) {
    this.app = app;
    try {
      this.activeBoosts = this.loadActiveBoosts();
      this.checkExpiredBoosts();
      this.buildCatalog();
    } catch (err) {
      console.error('[KarmaShop] init failed — using fallbacks', err);
      this.activeBoosts = [];
      this.items = [];
    }
    this.initSkipCaps();          // <-- NEW
  }

  /* ----------  cap helpers  ---------- */
  initSkipCaps() {
    const now = Date.now();
    const weekKey  = this._weekKey(now);
    const monthKey = this._monthKey(now);
    const yearKey  = this._yearKey(now);

    ['dailySkips','weeklySkips','monthlySkips'].forEach(type => {
      let raw = localStorage.getItem('karma_skip_caps_'+type);
      let obj = raw ? JSON.parse(raw) : {};
      const key = type==='dailySkips' ? weekKey :
                  type==='weeklySkips'? monthKey : yearKey;
      if (obj.key !== key) {   // new period → reset
        obj = { key, used: 0 };
      }
      localStorage.setItem('karma_skip_caps_'+type, JSON.stringify(obj));
    });
  }

  _weekKey(t) {   // "2026-W02"  (Sun-Sat week)
    const d = new Date(t);
    const y = d.getFullYear();
    const w = Math.ceil((d - new Date(y,0,1)) / 604800000);
    return `${y}-W${String(w).padStart(2,'0')}`;
  }
  _monthKey(t) {  // "2026-01"
    return new Date(t).toISOString().slice(0,7);
  }
  _yearKey(t) {   // "2026"
    return new Date(t).getFullYear().toString();
  }

  _useSkipCap(type) {
    const obj = JSON.parse(localStorage.getItem('karma_skip_caps_'+type));
    obj.used += 1;
    localStorage.setItem('karma_skip_caps_'+type, JSON.stringify(obj));
    this.render();   // refresh description counters
  }

  _skipCapUsed(type) {
    const obj = JSON.parse(localStorage.getItem('karma_skip_caps_'+type));
    return obj.used;
  }

  _skipCapMax(type) {
    return type==='dailySkips' ? 2 :
           type==='weeklySkips'? 2 : 3;
  }

  _capText(type){
    const max=this._skipCapMax(type);
    const period=type==='dailySkips'?'week':type==='weeklySkips'?'month':'year';
    const left=Math.max(0,max-this._skipCapUsed(type));
    return ` <span style="opacity:.7">Max ${max} per ${period} · ${left} left this ${period}.</span>`;
  }

  /* ---- remaining counter ---- */
  _capRemaining(itemId) {
    const map = { 'skip_all_daily':'dailySkips','skip_all_weekly':'weeklySkips','skip_all_monthly':'monthlySkips' };
    const type = map[itemId];
    if (!type) return '';
    const left = Math.max(0, this._skipCapMax(type) - this._skipCapUsed(type));
    return `<small class="karma-shop-cap-left">${left} left this ${type==='dailySkips'?'week':type==='weeklySkips'?'month':'year'}</small>`;
  }

  /* ---- reset estimate ---- */
  _whenResets(itemId){
    const d = new Date();
    if(itemId==='skip_all_daily')  { d.setDate(d.getDate()+(6-d.getDay())+1);  return 'Sunday'; }
    if(itemId==='skip_all_weekly') { d.setMonth(d.getMonth()+1,1); return 'next month'; }
    /*monthly*/                     { d.setMonth(0,1); d.setFullYear(d.getFullYear()+1); return 'next year'; }
  }

  buildCatalog() {
    this.items = [
      // POWER-UPS
      {
        id: 'xp_multiplier',
        name: 'XP Multiplier',
        description: 'Double all XP gains for 24 h',
        cost: 15, icon: '⚡', category: 'Power-Ups', consumable: true, duration: 86400000, rarity: 'uncommon'
      },
      {
        id: 'karma_multiplier',
        name: 'Karma Multiplier',
        description: 'Double all Karma gains for 24 h',
        cost: 20, icon: '💫', category: 'Power-Ups', consumable: true, duration: 86400000, rarity: 'rare'
      },
      {
        id: 'double_boost',
        name: 'Double Boost',
        description: 'Double your XP and Karma for 48 hours',
        cost: 60, icon: '🔥', category: 'Power-Ups', consumable: true, duration: 172800000, rarity: 'epic'
      },

      // QUEST HELPERS  (NO duration – we use reset helpers)
      {
        id: 'skip_all_daily',
        name: 'Skip All Daily Quests',
        description: `Instantly complete all daily quests
(gaining 200 XP | 50 Karma)
Max 2 per week · ${Math.max(0, this._skipCapMax('dailySkips') - this._skipCapUsed('dailySkips'))} left this week.`,
        cost: 70, icon: '⭐', category: 'Quest Helpers', consumable: true, rarity: 'uncommon'
      },
      {
        id: 'skip_all_weekly',
        name: 'Skip All Weekly Quests',
        description: `Instantly complete all weekly quests
(gaining 500 XP | 125 Karma)
Max 2 per month · ${Math.max(0, this._skipCapMax('weeklySkips') - this._skipCapUsed('weeklySkips'))} left this month.`,
        cost: 200, icon: '📅', category: 'Quest Helpers', consumable: true, rarity: 'rare'
      },
      {
        id: 'skip_all_monthly',
        name: 'Skip All Monthly Quests',
        description: `Instantly complete all monthly quests
(gaining 900 XP | 225 Karma)
Max 3 per year · ${Math.max(0, this._skipCapMax('monthlySkips') - this._skipCapUsed('monthlySkips'))} left this year.`,
        cost: 300, icon: '🗓️', category: 'Quest Helpers', consumable: true, rarity: 'epic'
      },

      // PREMIUM FEATURES
      {
        id: 'advanced_meditations',
        name: 'Advanced Meditations',
        description: 'Unlock premium guided meditation library',
        cost: 150, icon: '🧘‍♀️', category: 'Premium Features', consumable: false, rarity: 'rare'
      },
      {
        id: 'shadow_alchemy_lab',
        name: 'Shadow Alchemy Lab',
        description: 'Transform shadows into personal growth tools',
        cost: 200, icon: '🌑', category: 'Premium Features', consumable: false, rarity: 'epic'
      },
      {
        id: 'advance_tarot_spreads',
        name: 'Advance Tarot Spreads',
        description: 'Unlock premium spreads and TarotVision AI',
        cost: 300, icon: '🃏', category: 'Premium Features', consumable: false, rarity: 'legendary'
      },

      // PREMIUM SKINS
      {
        id: 'luxury_champagne_gold_skin',
        name: 'Luxury Champagne-Gold Skin',
        description: 'A rich champagne-gold colour theme for the entire app',
        cost: 200, icon: '🥂', category: 'Premium Skins', consumable: false, rarity: 'rare'
      },
      {
        id: 'royal_indigo_skin',
        name: 'Royal Indigo Skin',
        description: 'Deep royal-indigo luxury dark theme for the entire app',
        cost: 200, icon: '🟣', category: 'Premium Skins', consumable: false, rarity: 'epic'
      },
      {
        id: 'earth_luxury_skin',
        name: 'Earth Luxury Skin',
        description: 'Natural earth-tone luxury dark theme for the entire app',
        cost: 300, icon: '🌍', category: 'Premium Skins', consumable: false, rarity: 'legendary'
      },

      // MEET THE MASTER
      {
        id: 'private_consultation',
        name: 'Private Consultation with Aanandoham',
        description: 'Online Video Session',
        cost: 1000, icon: '🧘', category: 'Meet the Master', consumable: true, rarity: 'legendary'
      },
      {
        id: 'private_tarot_reading',
        name: 'Private Tarot Reading with Aanandoham',
        description: 'Online Tarot Session',
        cost: 1500, icon: '🔮', category: 'Meet the Master', consumable: true, rarity: 'legendary'
      },
      {
        id: 'reiki_healing',
        name: 'Reiki Healing with Aanandoham',
        description: 'Online Session and Distant Healing',
        cost: 1500, icon: '💫', category: 'Meet the Master', consumable: true, rarity: 'legendary'
      }
    ];
  }

  /* ----------  helpers  ---------- */
  safeUnlockFeature(flag) {
    try { this.app.gamification.unlockFeature(flag); } catch (e) { console.warn('[KarmaShop] unlockFeature error:', e); }
  }
  loadActiveBoosts() {
    try { return JSON.parse(localStorage.getItem('karma_active_boosts')) || []; } catch { return []; }
  }
  saveActiveBoosts() {
    localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
  }

  /* ---- reset-time helpers ---- */
  _nextDailyReset() {
    const t = new Date();
    t.setHours(24, 0, 0, 0);
    return t.getTime();
  }
  _nextWeeklyReset() {
    const t = new Date();
    const daysToSun = (7 - t.getDay()) % 7 || 7;
    t.setDate(t.getDate() + daysToSun);
    t.setHours(0, 0, 0, 0);
    return t.getTime();
  }
  _nextMonthlyReset() {
    const t = new Date();
    t.setMonth(t.getMonth() + 1, 1);
    t.setHours(0, 0, 0, 0);
    return t.getTime();
  }

  /* ---- live counter formatter ---- */
  _fmtDuration(ms) {
    const secs = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(secs / 86400);
    const hrs  = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const ss   = secs % 60;
    const pad  = n => n.toString().padStart(2, '0');
    if (days) return `${days}d ${pad(hrs)}:${pad(mins)}:${pad(ss)}`;
    return `${pad(hrs)}:${pad(mins)}:${pad(ss)}`;
  }

  checkExpiredBoosts() {
    const now = Date.now();
    const before = this.activeBoosts.length;
    this.activeBoosts = this.activeBoosts.filter(b => {
      if (b.id.startsWith('skip_all_')) {
        const resetFn = b.id === 'skip_all_daily'  ? this._nextDailyReset
                      : b.id === 'skip_all_weekly' ? this._nextWeeklyReset
                      : this._nextMonthlyReset;
        return now < resetFn.call(this);
      }
      return b.expiresAt > now;
    });
    if (before !== this.activeBoosts.length) this.render();
    this.saveActiveBoosts();
  }
  isBoostActive(boostId) {
    this.checkExpiredBoosts();
    if (boostId.startsWith('skip_all_')) {
      const resetFn = boostId === 'skip_all_daily'  ? this._nextDailyReset
                    : boostId === 'skip_all_weekly' ? this._nextWeeklyReset
                    : this._nextMonthlyReset;
      return Date.now() < resetFn.call(this);
    }
    return this.activeBoosts.some(b => b.id === boostId);
  }
  activateBoost(boostId, duration) {
    this.activeBoosts.push({ id: boostId, expiresAt: Date.now() + duration });
    this.saveActiveBoosts();
  }

  /* ----------  purchase rules  ---------- */
  canPurchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return { can: false, reason: 'Item not found' };
    const karma = this.app.gamification.state.karma;
    if (karma < item.cost) return { can: false, reason: `Need ${item.cost - karma} more Karma` };
    /* ----- FIX: skip quest-helpers from “already active” ----- */
    if (item.consumable && this.isBoostActive(itemId) && !itemId.startsWith('skip_all_'))
      return { can: false, reason: 'Already active' };
    if (!item.consumable && this.isItemOwned(itemId)) return { can: false, reason: 'Already owned' };

    // ----------  cap check  ----------
    const capMap = {
      'skip_all_daily':  'dailySkips',
      'skip_all_weekly': 'weeklySkips',
      'skip_all_monthly':'monthlySkips'
    };
    if (capMap[itemId]) {
      const used = this._skipCapUsed(capMap[itemId]);
      const max  = this._skipCapMax(capMap[itemId]);
      if (used >= max) return { can: false, reason: `Cap reached (${max}/${max})` };
    }
    return { can: true };
  }
  isItemOwned(itemId) {
    const inHistory = this.getPurchaseHistory().some(p => p.itemId === itemId);
    const isUnlocked = this.app.gamification?.state?.unlockedFeatures?.includes(itemId);
    return inHistory || isUnlocked;
  }

  purchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) { this.app.showToast('❌ Item not found', 'error'); return false; }
    const check = this.canPurchase(itemId);
    if (!check.can) {
      /* ----- friendly toast when quota exhausted ----- */
      if (itemId.startsWith('skip_all_')) {
        const map = { 'skip_all_daily':'dailySkips','skip_all_weekly':'weeklySkips','skip_all_monthly':'monthlySkips' };
        this.app.showToast(`⏳  You’ve used all ${this._skipCapMax(map[itemId])} purchases for this ${map[itemId]==='dailySkips'?'week':map[itemId]==='weeklySkips'?'month':'year'}.  Resets ${this._whenResets(itemId)}.`, 'info');
      }
      this.app.showToast(`❌ ${check.reason}`, 'error');
      return false;
    }
    this.app.gamification.state.karma -= item.cost;
    this.app.gamification.saveState();
    this.recordPurchase(itemId, item.cost);
    const history = this.getPurchaseHistory();

    // burn a cap if quest skip
    const capMap = { 'skip_all_daily':'dailySkips','skip_all_weekly':'weeklySkips','skip_all_monthly':'monthlySkips' };
    if (capMap[itemId]) this._useSkipCap(capMap[itemId]);

    if (history.length === 1) {
      this.app.gamification.grantBadge({
        id: 'first_purchase',
        name: 'First Purchase',
        icon: '🛒',
        description: 'First purchase in the Karma Shop',
        xp: 50,
        rarity: 'epic'
      });
    }
    this.applyItemEffect(itemId, item);
    this.app.showToast(`✅ Purchased: ${item.name}!`, 'success');
    this.render();
    return true;
  }
  recordPurchase(itemId, cost) {
    const history = this.getPurchaseHistory();
    history.push({ itemId, cost, timestamp: new Date().toISOString() });
    localStorage.setItem('karma_purchase_history', JSON.stringify(history));
  }
  getPurchaseHistory() {
    try { return JSON.parse(localStorage.getItem('karma_purchase_history')) || []; } catch { return []; }
  }

  /* ----------  effects  ---------- */
  applyItemEffect(itemId, item) {
    try {
      switch (itemId) {
        /*  POWER-UPS  */
        case 'xp_multiplier':
          this.activateBoost('xp_multiplier', item.duration);
          this.app.showToast('⚡ 2× XP active for 24 h!', 'success');
          break;
        case 'karma_multiplier':
          this.activateBoost('karma_multiplier', item.duration);
          this.app.showToast('💫 2× Karma active for 24 h!', 'success');
          break;
        case 'double_boost':
          this.activateBoost('double_boost', item.duration);
          this.app.showToast('🔥 2× XP + 2× Karma active for 48 h!', 'success');
          break;

        /*  QUEST HELPERS – calendar reset  */
        case 'skip_all_daily': {
          const todo = this.app.gamification.state.quests.daily.filter(q => !q.completed);
          let xp = 0, karma = 0;
          todo.forEach(q => {
            xp   += q.xp   ?? 0;
            karma += q.karma ?? 0;
            this.app.gamification.completeQuest('daily', q.id);
          });
          xp   = Math.max(xp,   200);
          karma = Math.max(karma, 50);
          this.app.gamification.grantXP(xp);
          this.app.gamification.grantKarma(karma);
          this.activateBoost('skip_all_daily', this._nextDailyReset() - Date.now());
          this.app.showToast(`✅ All daily quests completed! (+${xp} XP | +${karma} Karma)`, 'success');
          break;
        }
        case 'skip_all_weekly': {
          const todo = this.app.gamification.state.quests.weekly.filter(q => !q.completed);
          let xp = 0, karma = 0;
          todo.forEach(q => {
            xp   += q.xp   ?? 0;
            karma += q.karma ?? 0;
            this.app.gamification.completeQuest('weekly', q.id);
          });
          xp   = Math.max(xp,   500);
          karma = Math.max(karma, 125);
          this.app.gamification.grantXP(xp);
          this.app.gamification.grantKarma(karma);
          this.activateBoost('skip_all_weekly', this._nextWeeklyReset() - Date.now());
          this.app.showToast(`✅ All weekly quests completed! (+${xp} XP | +${karma} Karma)`, 'success');
          break;
        }
        case 'skip_all_monthly': {
          const todo = this.app.gamification.state.quests.monthly.filter(q => !q.completed);
          let xp = 0, karma = 0;
          todo.forEach(q => {
            xp   += q.xp   ?? 0;
            karma += q.karma ?? 0;
            this.app.gamification.completeQuest('monthly', q.id);
          });
          xp   = Math.max(xp,   900);
          karma = Math.max(karma, 225);
          this.app.gamification.grantXP(xp);
          this.app.gamification.grantKarma(karma);
          this.activateBoost('skip_all_monthly', this._nextMonthlyReset() - Date.now());
          this.app.showToast(`✅ All monthly quests completed! (+${xp} XP | +${karma} Karma)`, 'success');
          break;
        }

        /*  PREMIUM FEATURES  */
        case 'advanced_meditations':
          this.safeUnlockFeature('advanced_meditations');
          this.app.showToast('🧘‍♀️ Advanced meditations unlocked!', 'success');
          break;
        case 'shadow_alchemy_lab':
          this.safeUnlockFeature('shadow_alchemy_lab');
          this.app.showToast('🌑 Shadow Alchemy Lab unlocked!', 'success');
          break;
        case 'advance_tarot_spreads':
          this.safeUnlockFeature('advance_tarot_spreads');
          this.safeUnlockFeature('tarot_vision_ai');
          this.app.showToast('🃏 Advanced Tarot Spreads & 🔮 Tarot Vision AI unlocked!', 'success');
          break;

        /*  PREMIUM SKINS  */
        case 'luxury_champagne_gold_skin':
          this.safeUnlockFeature('luxury_champagne_gold_skin');
          this.app.showToast('🥂 Luxury Champagne-Gold Skin unlocked!', 'success');
          break;
        case 'royal_indigo_skin':
          this.safeUnlockFeature('royal_indigo_skin');
          this.app.showToast('🟣 Royal Indigo Skin unlocked!', 'success');
          break;
        case 'earth_luxury_skin':
          this.safeUnlockFeature('earth_luxury_skin');
          this.app.showToast('🌍 Earth Luxury Skin unlocked!', 'success');
          break;

        /*  MEET THE MASTER  */
        case 'private_consultation':
        case 'private_tarot_reading':
        case 'reiki_healing':
          this.showMasterPurchasePopup(item);
          break;
      }
    } catch (err) {
      console.error('[KarmaShop] applyItemEffect error:', err);
      this.app.showToast('❌ Could not apply item — please reload', 'error');
    }
  }

  showMasterPurchasePopup(item) {
    const userName = this.app.state.currentUser?.name || 'Friend';
    const karma = item.cost;
    const msg = `${item.name} bought using ${karma} ✨ for ${userName}.`;
    const overlay = document.createElement('div');
    overlay.className = 'karma-shop-master-overlay';
    overlay.innerHTML = `
      <div class="card karma-shop-master-card">
        <div class="karma-shop-master-icon">🧘</div>
        <h3 class="karma-shop-master-title">Meet the Master</h3>
        <p class="karma-shop-master-message">${msg}</p>
        <p class="karma-shop-master-instructions">
          Screenshot or save this message, then contact Aanandoham via WhatsApp to schedule your session:
        </p>
        <a href="https://wa.me/+972524588767?text=${encodeURIComponent(msg)}" target="_blank" class="btn btn-primary karma-shop-master-btn-wa">
          Open WhatsApp
        </a>
        <button onclick="this.closest('.karma-shop-master-overlay').remove()" class="btn btn-secondary karma-shop-master-btn-close">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /* ----------  render  ---------- */
  render() {
    const tab = document.getElementById('karma-shop-tab');
    if (!tab) return;

    if (this._boostTicker) { clearInterval(this._boostTicker); this._boostTicker = null; }

    const karma = this.app.gamification.state.karma;
    const purchaseHistory = this.getPurchaseHistory();
    const categories = ['Power-Ups', 'Quest Helpers', 'Premium Features', 'Premium Skins', 'Meet the Master'];

    tab.innerHTML = `
      <div class="karma-shop-container">
        <div class="karma-shop-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/NavShop.png');
                         --header-title:'';
                         --header-tag:'Exchange your Karma tokens for goodies and upgrades'">
            <h1>The Karma Shop</h1>
            <h3>Exchange your Karma tokens for goodies and upgrades</h3>
            <span class="header-sub"></span>
          </header>

          <div class="card karma-shop-balance">
            <h3 class="karma-shop-balance-title">Your Karma Balance</h3>
            <p class="karma-shop-balance-amount">${karma}</p>
            <p class="karma-shop-balance-subtitle">Earn more by completing quests, using features and practices</p>
          </div>

          ${this.renderActiveBoosts()}

          ${categories.map(category => {
              const catItems = this.items.filter(i => i.category === category);
              if (catItems.length === 0) return '';
              return `
                <div class="karma-shop-category">
                  <h3 class="karma-shop-category-title">${category}</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${catItems.map(item => this.renderShopItem(item)).join('')}
                  </div>
                </div>
              `;
          }).join('')}

          ${purchaseHistory.length > 0 ? this.renderPurchaseHistory(purchaseHistory) : ''}
        </div>
      </div>
    `;
  }

  renderActiveBoosts() {
    this.checkExpiredBoosts();
    if (this.activeBoosts.length === 0) return '';

    const niceNames = {
      'xp_multiplier': '⚡ 2× XP Boost',
      'karma_multiplier': '💫 2× Karma Multiplier',
      'double_boost': '🔥 Double Boost',
      'skip_all_daily': '⭐ Skip Daily Quests',
      'skip_all_weekly': '📅 Skip Weekly Quests',
      'skip_all_monthly': '🗓️ Skip Monthly Quests'
    };

    const html = `
      <div class="card karma-shop-boosts">
        <h3 class="karma-shop-boosts-title">📋 Active Boosts</h3>
        <div class="karma-shop-boosts-list" id="boosts-list-live"></div>
      </div>
    `;

    const tick = () => {
      const box = document.getElementById('boosts-list-live');
      if (!box) return;
      box.innerHTML = this.activeBoosts.map(boost => {
        const isQuest = boost.id.startsWith('skip_all_');
        const msLeft  = isQuest
          ? (boost.id === 'skip_all_daily'  ? this._nextDailyReset()
            : boost.id === 'skip_all_weekly' ? this._nextWeeklyReset()
            : this._nextMonthlyReset()) - Date.now()
          : boost.expiresAt - Date.now();
        return `
          <div class="karma-shop-boost-item">
            <span class="karma-shop-boost-name">${niceNames[boost.id] || boost.id}</span>
            <span class="karma-shop-boost-time">${this._fmtDuration(msLeft)}</span>
          </div>
        `;
      }).join('');
    };

    tick();
    this._boostTicker = setInterval(tick, 1000);
    return html;
  }

  renderShopItem(item) {
    const canBuy   = this.canPurchase(item.id);
    const isOwned  = !item.consumable && this.isItemOwned(item.id);
    const isActive = item.consumable && this.isBoostActive(item.id);
    const badgeText = isOwned ? 'OWNED' : isActive ? 'ACTIVE' : '';
    const rarityColor = this.getRarityColor(item.rarity);

    return `
  <div class="card karma-shop-item"
       data-rarity="${item.rarity}"
       style="background:${rarityColor}">
        ${badgeText ? `<div class="karma-shop-item-owned-badge">${badgeText}</div>` : ''}
        <div class="karma-shop-item-content">
          <div class="karma-shop-item-icon">${item.icon}</div>
          <h4 class="karma-shop-item-name">${item.name}</h4>
          <p class="karma-shop-item-description">${item.description}</p>
        </div>
        <div class="karma-shop-item-footer">
          <div class="karma-shop-item-meta">
            <span class="karma-shop-item-rarity karma-shop-rarity-${item.rarity}">${item.rarity}</span>
           <span class="karma-shop-item-rarity karma-shop-item-cost karma-shop-rarity-${item.rarity}">
            ${item.cost} 💎
           </span>
          </div>
          <button 
            onclick="window.featuresManager.engines['karma-shop'].purchase('${item.id}')" 
            class="btn ${canBuy.can ? 'btn-primary' : 'btn-secondary'} karma-shop-item-btn" 
            ${!canBuy.can ? 'disabled' : ''}>
            ${isOwned ? '✓ Owned' : isActive ? '✓ Active' : canBuy.can ? '🛒 Purchase' : canBuy.reason}
          </button>
        </div>
      </div>
    `;
  }

  renderPurchaseHistory(purchaseHistory) {
    return `
      <div class="card karma-shop-history">
        <h3 class="karma-shop-history-title">📜 Purchase History</h3>
        <div class="karma-shop-history-list">
          ${purchaseHistory.slice(-10).reverse().map(purchase => {
            const item = this.items.find(i => i.id === purchase.itemId);
            const date = new Date(purchase.timestamp).toLocaleDateString();
            return `
              <div class="karma-shop-history-item">
                <span class="karma-shop-history-item-name">${item?.icon || '📦'} ${item?.name || purchase.itemId}</span>
                <span class="karma-shop-history-item-meta">${date} • ${purchase.cost} Karma</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  getRarityColor(rarity) {
    const gradients = {
      common:    'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
      uncommon:  'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
      rare:      'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
      epic:      'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
      legendary: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
    };
    return gradients[rarity] || gradients.common;
  }
}

export default KarmaShopEngine;