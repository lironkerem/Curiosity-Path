// ============================================
// Features/KarmaShopEngine.js (OPTIMIZED + SUPABASE SYNC + BUGFIX)
// ============================================

import { supabase } from '../Core/Supabase.js';

export class KarmaShopEngine {
  // Class constants - extracted to avoid duplication
  static NICE_NAMES = {
    xp_multiplier: '⚡ 2× XP Boost',
    karma_multiplier: '💫 2× Karma Multiplier',
    double_boost: '🔥 Double Boost',
    skip_all_daily: '⭐ Skip Daily Quests',
    skip_all_weekly: '📅 Skip Weekly Quests',
    skip_all_monthly: '🗓️ Skip Monthly Quests'
  };

  static SKIP_CAP_LIMITS = {
    dailySkips: 2,
    weeklySkips: 2,
    monthlySkips: 3
  };

  static CAP_MAP = {
    skip_all_daily: 'dailySkips',
    skip_all_weekly: 'weeklySkips',
    skip_all_monthly: 'monthlySkips'
  };

  constructor(app) {
    this.app = app;
    this.activeBoosts = [];
    this.items = [];
    this.skipCaps = {}; // Memory cache
    this._boostTicker = null;
    this._renderQueued = false;
    this._syncInProgress = false;
    this._initialized = false;

    // Start async init but don't block
    this.init().then(() => {
      this._initialized = true;
      console.log('[KarmaShop] Initialization complete');
    }).catch(err => {
      console.error('[KarmaShop] init failed:', err);
      this.activeBoosts = [];
      this.items = [];
      this._initialized = true;
    });
  }

  /**
   * Initialize the karma shop engine
   * Loads data from cloud/localStorage, initializes skip caps, checks expired boosts, and builds catalog
   */
  async init() {
    console.log('[KarmaShop] Initializing...');
    await this.loadFromCloud();
    this.initSkipCaps();
    this.checkExpiredBoosts();
    this.buildCatalog();
    console.log('[KarmaShop] Init complete with', this.activeBoosts.length, 'active boosts');
  }

  // Cleanup method to prevent memory leaks
  destroy() {
    this._clearTicker();
  }

  // Helper to clear boost ticker interval
  _clearTicker() {
    if (this._boostTicker) {
      clearInterval(this._boostTicker);
      this._boostTicker = null;
    }
  }

  /* ---------- CLOUD SYNC ---------- */
  
  /**
   * Load active boosts and purchase history from Supabase cloud storage
   * Falls back to localStorage if user is not logged in or cloud data is unavailable
   */
  async loadFromCloud() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[KarmaShop] No user, loading from localStorage');
        this.activeBoosts = this.loadActiveBoosts();
        return;
      }

      const { data, error } = await supabase
        .from('user_progress')
        .select('payload')
        .eq('user_id', user.id)
        .single();

      if (error || !data?.payload) {
        console.log('[KarmaShop] No cloud data, loading from localStorage');
        this.activeBoosts = this.loadActiveBoosts();
        return;
      }

      const cloudData = data.payload.karmaShop || {};
      this.activeBoosts = cloudData.activeBoosts || [];

      // Also load purchase history from cloud
      if (cloudData.purchaseHistory) {
        localStorage.setItem('karma_purchase_history', JSON.stringify(cloudData.purchaseHistory));
      }

      // Cache in localStorage
      localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
      console.log('[KarmaShop] ☁️ Loaded from cloud:', this.activeBoosts.length, 'boosts');
    } catch (err) {
      console.error('[KarmaShop] Cloud load failed, using localStorage:', err);
      this.activeBoosts = this.loadActiveBoosts();
    }
  }

  /**
   * Save active boosts and purchase history to Supabase cloud storage
   * Prevents concurrent sync operations and always caches to localStorage as fallback
   */
  async saveToCloud() {
    if (this._syncInProgress) return;
    this._syncInProgress = true;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('[KarmaShop] No user, saving to localStorage only');
        this.saveActiveBoosts();
        return;
      }

      // Get current payload
      const { data: current, error: fetchError } = await supabase
        .from('user_progress')
        .select('payload')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      const payload = current?.payload || {};
      // Update karma shop data
      payload.karmaShop = {
        activeBoosts: this.activeBoosts,
        purchaseHistory: this.getPurchaseHistory(),
        lastSync: new Date().toISOString()
      };

      // Save to cloud
      const { error: saveError } = await supabase
        .from('user_progress')
        .upsert(
          { user_id: user.id, payload, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (saveError) throw saveError;

      // Cache locally
      this.saveActiveBoosts();
      console.log('[KarmaShop] ☁️ Synced to cloud');
    } catch (err) {
      console.error('[KarmaShop] Cloud save failed:', err);
      this.saveActiveBoosts(); // fallback
    } finally {
      this._syncInProgress = false;
    }
  }

  /* ---------- Admin Helper ---------- */
  _isAdmin() {
    return Boolean(this.app.state.currentUser?.isAdmin);
  }

  /* ---------- Cap Helpers (Optimized with cache) ---------- */
  initSkipCaps() {
    const now = Date.now();
    const periods = {
      dailySkips: { key: this._weekKey(now), type: 'dailySkips' },
      weeklySkips: { key: this._monthKey(now), type: 'weeklySkips' },
      monthlySkips: { key: this._yearKey(now), type: 'monthlySkips' }
    };

    Object.entries(periods).forEach(([type, { key }]) => {
      const storageKey = `karma_skip_caps_${type}`;
      let obj = this._getLocalStorage(storageKey, {});
      if (obj.key !== key) obj = { key, used: 0 };
      this.skipCaps[type] = obj; // Cache in memory
      localStorage.setItem(storageKey, JSON.stringify(obj));
    });
  }

  _weekKey(t) {
    const d = new Date(t);
    const y = d.getFullYear();
    const w = Math.ceil((d - new Date(y, 0, 1)) / 604800000);
    return `${y}-W${String(w).padStart(2, '0')}`;
  }

  _monthKey(t) {
    return new Date(t).toISOString().slice(0, 7);
  }

  _yearKey(t) {
    return new Date(t).getFullYear().toString();
  }

  _useSkipCap(type) {
    if (this._isAdmin()) return;
    this.skipCaps[type].used += 1;
    localStorage.setItem(`karma_skip_caps_${type}`, JSON.stringify(this.skipCaps[type]));
    this.queueRender();
  }

  _skipCapUsed(type) {
    return this.skipCaps[type]?.used || 0;
  }

  _skipCapMax(type) {
    return KarmaShopEngine.SKIP_CAP_LIMITS[type] || 0;
  }

  _whenResets(itemId) {
    const resetMap = {
      skip_all_daily: 'tonight at midnight',
      skip_all_weekly: 'next Sunday',
      skip_all_monthly: 'the 1st of next month'
    };
    return resetMap[itemId] || 'soon';
  }

  /* ---------- Catalog ---------- */
  
  /**
   * Build the karma shop catalog with all available items
   * Dynamically includes remaining skip cap information in item descriptions
   */
  buildCatalog() {
    const capsLeft = {
      daily: Math.max(0, this._skipCapMax('dailySkips') - this._skipCapUsed('dailySkips')),
      weekly: Math.max(0, this._skipCapMax('weeklySkips') - this._skipCapUsed('weeklySkips')),
      monthly: Math.max(0, this._skipCapMax('monthlySkips') - this._skipCapUsed('monthlySkips'))
    };

    this.items = [
      // POWER-UPS
      { id: 'xp_multiplier', name: 'XP Multiplier', description: 'Double all XP gains for 24 h', cost: 15, icon: '⚡', category: 'Power-Ups', consumable: true, duration: 86400000, rarity: 'uncommon' },
      { id: 'karma_multiplier', name: 'Karma Multiplier', description: 'Double all Karma gains for 24 h', cost: 20, icon: '💫', category: 'Power-Ups', consumable: true, duration: 86400000, rarity: 'rare' },
      { id: 'double_boost', name: 'Double Boost', description: 'Double your XP and Karma for 48 hours', cost: 60, icon: '🔥', category: 'Power-Ups', consumable: true, duration: 172800000, rarity: 'epic' },

      // QUEST HELPERS
      { id: 'skip_all_daily', name: 'Skip All Daily Quests', description: `Instantly complete all daily quests\n(gaining 200 XP | 50 Karma)\nMax 2 per week · ${capsLeft.daily} left this week.`, cost: 70, icon: '⭐', category: 'Quest Helpers', consumable: true, rarity: 'uncommon' },
      { id: 'skip_all_weekly', name: 'Skip All Weekly Quests', description: `Instantly complete all weekly quests\n(gaining 500 XP | 125 Karma)\nMax 2 per month · ${capsLeft.weekly} left this month.`, cost: 200, icon: '📅', category: 'Quest Helpers', consumable: true, rarity: 'rare' },
      { id: 'skip_all_monthly', name: 'Skip All Monthly Quests', description: `Instantly complete all monthly quests\n(gaining 900 XP | 225 Karma)\nMax 3 per year · ${capsLeft.monthly} left this year.`, cost: 300, icon: '🗓️', category: 'Quest Helpers', consumable: true, rarity: 'epic' },

      // PREMIUM FEATURES
      { id: 'advanced_meditations', name: 'Advanced Meditations', description: 'Unlock premium guided meditation library', cost: 150, icon: '🧘‍♀️', category: 'Premium Features', consumable: false, rarity: 'rare' },
      { id: 'shadow_alchemy_lab', name: 'Shadow Alchemy Lab', description: 'Transform shadows into personal growth tools', cost: 200, icon: '🌑', category: 'Premium Features', consumable: false, rarity: 'epic' },
      { id: 'advance_tarot_spreads', name: 'Advance Tarot Spreads', description: 'Unlock premium spreads and TarotVision AI', cost: 300, icon: '🃏', category: 'Premium Features', consumable: false, rarity: 'legendary' },

      // PREMIUM SKINS
      { id: 'luxury_champagne_gold_skin', name: 'Luxury Champagne-Gold Skin', description: 'A rich champagne-gold colour theme for the entire app', cost: 200, icon: '🥂', category: 'Premium Skins', consumable: false, rarity: 'rare' },
      { id: 'royal_indigo_skin', name: 'Royal Indigo Skin', description: 'Deep royal-indigo luxury dark theme for the entire app', cost: 200, icon: '🟣', category: 'Premium Skins', consumable: false, rarity: 'epic' },
      { id: 'earth_luxury_skin', name: 'Earth Luxury Skin', description: 'Natural earth-tone luxury dark theme for the entire app', cost: 300, icon: '🌍', category: 'Premium Skins', consumable: false, rarity: 'legendary' },

      // MEET THE MASTER
      { id: 'private_consultation', name: 'Private Consultation with Aanandoham', description: 'Online Video Session', cost: 1000, icon: '🧘', category: 'Meet the Master', consumable: true, rarity: 'legendary' },
      { id: 'private_tarot_reading', name: 'Private Tarot Reading with Aanandoham', description: 'Online Tarot Session', cost: 1500, icon: '🔮', category: 'Meet the Master', consumable: true, rarity: 'legendary' },
      { id: 'reiki_healing', name: 'Reiki Healing with Aanandoham', description: 'Online Session and Distant Healing', cost: 1500, icon: '💫', category: 'Meet the Master', consumable: true, rarity: 'legendary' }
    ];
  }

  /* ---------- Helpers ---------- */
  safeUnlockFeature(flag) {
    try { this.app.gamification.unlockFeature(flag); } catch (e) { console.warn('[KarmaShop] unlockFeature error:', e); }
  }

  loadActiveBoosts() { return this._getLocalStorage('karma_active_boosts', []); }
  saveActiveBoosts() {
    localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
    this.saveToCloud();
  }

  _getLocalStorage(key, fallback) {
    try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
  }
  _setLocalStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(`[KarmaShop] localStorage write failed for ${key}:`, e); }
  }

  /* ---------- Quest Reset Helpers ---------- */
  _nextQuestDailyReset() { const t = new Date(); t.setHours(24, 0, 0, 0); if (t <= Date.now()) t.setDate(t.getDate() + 1); return t.getTime(); }
  _nextQuestWeeklyReset() { const t = new Date(); const daysToSun = (7 - t.getDay()) % 7 || 7; t.setDate(t.getDate() + daysToSun); t.setHours(0, 0, 0, 0); return t.getTime(); }
  _nextQuestMonthlyReset() { const t = new Date(); t.setMonth(t.getMonth() + 1, 1); t.setHours(0, 0, 0, 0); return t.getTime(); }

  /* ---------- Duration Formatter ---------- */
  _fmtDuration(ms) {
    const secs = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(secs / 86400);
    const hrs = Math.floor((secs % 86400) / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const ss = secs % 60;
    const pad = n => n.toString().padStart(2, '0');
    return days ? `${days}d ${pad(hrs)}:${pad(mins)}:${pad(ss)}` : `${pad(hrs)}:${pad(mins)}:${pad(ss)}`;
  }

  /* ---------- Boost Management ---------- */
  checkExpiredBoosts() {
    const now = Date.now();
    const before = this.activeBoosts.length;
    this.activeBoosts = this.activeBoosts.filter(b => {
      if (b.id.startsWith('skip_all_')) return now < (b.resetAt || 0); // BUGFIX: use stored resetAt
      return b.expiresAt > now;
    });
    if (before !== this.activeBoosts.length) { this.saveActiveBoosts(); this.queueRender(); }
  }

  isBoostActive(boostId) {
    if (boostId.startsWith('skip_all_')) {
      const boost = this.activeBoosts.find(b => b.id === boostId);
      return boost ? Date.now() < (boost.resetAt || 0) : false; // BUGFIX: use stored resetAt
    }
    return this.activeBoosts.some(b => b.id === boostId);
  }

  activateBoost(boostId, duration) {
    this.activeBoosts.push({ id: boostId, expiresAt: Date.now() + duration });
    this.saveActiveBoosts();
  }

  /* ---------- Purchase Logic ---------- */
  /**
   * Check if a user can purchase a specific item
   * Validates karma balance, ownership status, active boosts, and skip caps
   * @param {string} itemId - The ID of the item to check
   * @returns {Object} Object with 'can' (boolean) and 'reason' (string) properties
   */
  canPurchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return { can: false, reason: 'Item not found' };
    const karma = this.app.gamification.state.karma;
    if (karma < item.cost) return { can: false, reason: `Need ${item.cost - karma} more Karma` };
    if (item.consumable && this.isBoostActive(itemId) && !itemId.startsWith('skip_all_')) return { can: false, reason: 'Already active' };
    if (!item.consumable && this.isItemOwned(itemId)) return { can: false, reason: 'Already owned' };
    // Cap check (admin bypass)
    if (!this._isAdmin() && KarmaShopEngine.CAP_MAP[itemId]) {
      const type = KarmaShopEngine.CAP_MAP[itemId];
      const used = this._skipCapUsed(type);
      const max = this._skipCapMax(type);
      if (used >= max) return { can: false, reason: `Cap reached (${max}/${max})` };
    }
    return { can: true };
  }

  isItemOwned(itemId) {
    const inHistory = this.getPurchaseHistory().some(p => p.itemId === itemId);
    const isUnlocked = this.app.gamification?.state?.unlockedFeatures?.includes(itemId);
    return inHistory || isUnlocked;
  }

  /**
   * Purchase an item from the karma shop
   * @param {string} itemId - The ID of the item to purchase
   * @returns {boolean} True if purchase was successful, false otherwise
   */
  purchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) { this.app.showToast('❌ Item not found', 'error'); return false; }
    const check = this.canPurchase(itemId);
    if (!check.can) {
      if (itemId.startsWith('skip_all_')) {
        const type = KarmaShopEngine.CAP_MAP[itemId];
        const periodName = type === 'dailySkips' ? 'week' : type === 'weeklySkips' ? 'month' : 'year';
        this.app.showToast(`⏳ You've used all ${this._skipCapMax(type)} purchases for this ${periodName}. Resets ${this._whenResets(itemId)}.`, 'info');
      }
      this.app.showToast(`❌ ${check.reason}`, 'error');
      return false;
    }
    // Deduct karma
    this.app.gamification.state.karma -= item.cost;
    this.app.gamification.saveState();
    // Record purchase
    this.recordPurchase(itemId, item.cost);
    // Update skip cap if applicable
    if (KarmaShopEngine.CAP_MAP[itemId]) {
      this._useSkipCap(KarmaShopEngine.CAP_MAP[itemId]);
    }
    // First purchase badge
    const history = this.getPurchaseHistory();
    if (history.length === 1) this.app.gamification.grantBadge({ id: 'first_purchase', name: 'First Purchase', icon: '🛒', description: 'First purchase in the Karma Shop', xp: 50, rarity: 'epic' });
    // Apply effect
    this.applyItemEffect(itemId, item);
    this.app.showToast(`✅ Purchased: ${item.name}!`, 'success');
    this.queueRender();
    return true;
  }

  recordPurchase(itemId, cost) {
    const history = this.getPurchaseHistory();
    history.push({ itemId, cost, timestamp: new Date().toISOString() });
    localStorage.setItem('karma_purchase_history', JSON.stringify(history));
    this.saveToCloud();
  }

  getPurchaseHistory() { return this._getLocalStorage('karma_purchase_history', []); }

  /**
   * Apply the effect of a purchased item (boosts, unlocks, quest skips, etc.)
   * @param {string} itemId - The ID of the purchased item
   * @param {Object} item - The item object containing cost, name, etc.
   */
  applyItemEffect(itemId, item) {
    try {
      // POWER-UPS
      if (itemId === 'xp_multiplier') { this.activateBoost('xp_multiplier', item.duration); this.app.showToast('⚡ 2× XP active for 24 h!', 'success'); } else if (itemId === 'karma_multiplier') { this.activateBoost('karma_multiplier', item.duration); this.app.showToast('💫 2× Karma active for 24 h!', 'success'); } else if (itemId === 'double_boost') { this.activateBoost('double_boost', item.duration); this.app.showToast('🔥 2× XP + 2× Karma active for 48 h!', 'success'); }
      // QUEST HELPERS (Unified) - BUGFIX: store concrete resetAt once
      else if (itemId.startsWith('skip_all_')) this._applyQuestSkip(itemId);
      // PREMIUM FEATURES
      else if (itemId === 'advanced_meditations') { this.safeUnlockFeature('advanced_meditations'); this.app.showToast('🧘‍♀️ Advanced meditations unlocked!', 'success'); } else if (itemId === 'shadow_alchemy_lab') { this.safeUnlockFeature('shadow_alchemy_lab'); this.app.showToast('🌑 Shadow Alchemy Lab unlocked!', 'success'); } else if (itemId === 'advance_tarot_spreads') { this.safeUnlockFeature('advance_tarot_spreads'); this.safeUnlockFeature('tarot_vision_ai'); this.app.showToast('🃏 Advanced Tarot Spreads & 🔮 Tarot Vision AI unlocked!', 'success'); }
      // PREMIUM SKINS
      else if (itemId === 'luxury_champagne_gold_skin') { this.safeUnlockFeature('luxury_champagne_gold_skin'); this.app.showToast('🥂 Luxury Champagne-Gold Skin unlocked!', 'success'); } else if (itemId === 'royal_indigo_skin') { this.safeUnlockFeature('royal_indigo_skin'); this.app.showToast('🟣 Royal Indigo Skin unlocked!', 'success'); } else if (itemId === 'earth_luxury_skin') { this.safeUnlockFeature('earth_luxury_skin'); this.app.showToast('🌍 Earth Luxury Skin unlocked!', 'success'); }
      // MEET THE MASTER
      else if (['private_consultation', 'private_tarot_reading', 'reiki_healing'].includes(itemId)) this.showMasterPurchasePopup(item);
    } catch (err) { console.error('[KarmaShop] applyItemEffect error:', err); this.app.showToast('❌ Could not apply item – please reload', 'error'); }
  }

  // Unified quest skip logic - BUGFIX: store resetAt once
  _applyQuestSkip(skipType) {
    const config = {
      skip_all_daily: { period: 'daily', minXP: 200, minKarma: 50, resetFn: this._nextQuestDailyReset, label: 'daily' },
      skip_all_weekly: { period: 'weekly', minXP: 500, minKarma: 125, resetFn: this._nextQuestWeeklyReset, label: 'weekly' },
      skip_all_monthly: { period: 'monthly', minXP: 900, minKarma: 225, resetFn: this._nextQuestMonthlyReset, label: 'monthly' }
    };
    const cfg = config[skipType];
    if (!cfg) return;
    const todo = this.app.gamification.state.quests[cfg.period].filter(q => !q.completed);
    let xp = 0, karma = 0;
    this.app.gamification._bulkMode = true;
    todo.forEach(q => { xp += q.xp ?? 0; karma += q.karma ?? 0; q.completed = true; });
    this.app.gamification._bulkMode = false;
    xp = Math.max(xp, cfg.minXP);
    karma = Math.max(karma, cfg.minKarma);
    this.app.gamification.state.xp += xp;
    this.app.gamification.state.karma += karma;
    this.app.gamification.saveState();
    const resetAt = cfg.resetFn.call(this); // compute once
    this.activeBoosts.push({ id: skipType, resetAt }); // BUGFIX: store resetAt
    this.saveActiveBoosts();
    this.app.showToast(`✅ All ${cfg.label} quests completed! (+${xp} XP | +${karma} Karma)`, 'success');
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
        <p class="karma-shop-master-instructions">Screenshot or save this message, then contact Aanandoham via WhatsApp to schedule your session:</p>
        <a href="https://wa.me/+972524588767?text=${encodeURIComponent(msg)}" target="_blank" class="btn btn-primary karma-shop-master-btn-wa">Open WhatsApp</a>
        <button onclick="this.closest('.karma-shop-master-overlay').remove()" class="btn btn-secondary karma-shop-master-btn-close">Close</button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /* ---------- Render (Debounced) ---------- */
  queueRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;
    requestAnimationFrame(() => { this.render(); this._renderQueued = false; });
  }

  /**
   * Render the karma shop interface
   * Shows loading state if not initialized, then displays shop items by category
   */
  render() {
    const tab = document.getElementById('karma-shop-tab');
    if (!tab) { console.error('[KarmaShop] karma-shop-tab element not found'); return; }
    if (!this._initialized) {
      tab.innerHTML = `
        <div class="karma-shop-container">
          <div class="karma-shop-content">
            <div class="card" style="text-align: center; padding: 3rem;">
              <h3>Loading Karma Shop...</h3>
              <p style="color: var(--neuro-text-light); margin-top: 1rem;">Syncing your data...</p>
            </div>
          </div>
        </div>
      `;
      setTimeout(() => this.render(), 100); return;
    }
    this._clearTicker();
    const karma = this.app.gamification.state.karma;
    const purchaseHistory = this.getPurchaseHistory();
    const categories = ['Power-Ups', 'Quest Helpers', 'Premium Features', 'Premium Skins', 'Meet the Master'];
    const boostsHTML = this.renderActiveBoosts();
    tab.innerHTML = `
      <div class="karma-shop-container">
        <div class="karma-shop-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavShop.png');
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
          ${boostsHTML}
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
    this.startBoostTicker();
  }

  renderActiveBoosts() {
    this.checkExpiredBoosts();
    if (this.activeBoosts.length === 0) return '';
    const initialContent = this.activeBoosts.map(boost => {
      const isQuest = boost.id.startsWith('skip_all_');
      const msLeft = isQuest ? (boost.resetAt || 0) - Date.now() : boost.expiresAt - Date.now();
      return `
        <div class="karma-shop-boost-item">
          <span class="karma-shop-boost-name">${KarmaShopEngine.NICE_NAMES[boost.id] || boost.id}</span>
          <span class="karma-shop-boost-time">${this._fmtDuration(msLeft)}</span>
        </div>
      `;
    }).join('');
    return `
      <div class="card karma-shop-boosts">
        <h3 class="karma-shop-boosts-title">🔋 Active Boosts</h3>
        <div class="karma-shop-boosts-list" id="boosts-list-live">${initialContent}</div>
      </div>
    `;
  }

  startBoostTicker() {
    if (this.activeBoosts.length === 0) return;
    const tick = () => {
      const box = document.getElementById('boosts-list-live');
      if (!box) { 
        console.warn('[KarmaShop] boosts-list-live element not found'); 
        this._clearTicker();
        return; 
      }
      box.innerHTML = this.activeBoosts.map(boost => {
        const isQuest = boost.id.startsWith('skip_all_');
        const msLeft = isQuest ? (boost.resetAt || 0) - Date.now() : boost.expiresAt - Date.now();
        return `
          <div class="karma-shop-boost-item">
            <span class="karma-shop-boost-name">${KarmaShopEngine.NICE_NAMES[boost.id] || boost.id}</span>
            <span class="karma-shop-boost-time">${this._fmtDuration(msLeft)}</span>
          </div>
        `;
      }).join('');
    };
    setTimeout(() => { 
      const box = document.getElementById('boosts-list-live'); 
      if (box) {
        this._boostTicker = setInterval(tick, 5000);
      } else {
        console.error('[KarmaShop] Could not start boost ticker - element not found');
      }
    }, 100);
  }

  renderShopItem(item) {
    const canBuy = this.canPurchase(item.id);
    const isOwned = !item.consumable && this.isItemOwned(item.id);
    const isActive = item.consumable && this.isBoostActive(item.id);
    const badgeText = isOwned ? 'OWNED' : isActive ? 'ACTIVE' : '';
    const rarityColor = this.getRarityColor(item.rarity);
    return `
      <div class="card karma-shop-item" data-rarity="${item.rarity}" style="background:${rarityColor}">
        ${badgeText ? `<div class="karma-shop-item-owned-badge">${badgeText}</div>` : ''}
        <div class="karma-shop-item-content">
          <div class="karma-shop-item-icon">${item.icon}</div>
          <h4 class="karma-shop-item-name">${item.name}</h4>
          <p class="karma-shop-item-description">${item.description}</p>
        </div>
        <div class="karma-shop-item-footer">
          <div class="karma-shop-item-meta">
            <span class="karma-shop-item-rarity karma-shop-rarity-${item.rarity}">${item.rarity}</span>
            <span class="karma-shop-item-rarity karma-shop-item-cost karma-shop-rarity-${item.rarity}">${item.cost} 💎</span>
          </div>
          <button onclick="window.featuresManager.engines['karma-shop'].purchase('${item.id}')" class="btn ${canBuy.can ? 'btn-primary' : 'btn-secondary'} karma-shop-item-btn" ${!canBuy.can ? 'disabled' : ''}>
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
      common: 'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
      uncommon: 'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
      rare: 'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
      epic: 'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
      legendary: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
    };
    return gradients[rarity] || gradients.common;
  }
}

export default KarmaShopEngine;