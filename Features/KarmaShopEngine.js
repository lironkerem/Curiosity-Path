// ============================================
// Features/KarmaShopEngine.js
// Manages karma shop items, boosts, and purchases with cloud sync
// ============================================

import { supabase } from '../Core/Supabase.js';

export class KarmaShopEngine {
  // Class constants
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

  static RESET_MESSAGES = {
    skip_all_daily: 'tonight at midnight',
    skip_all_weekly: 'next Sunday',
    skip_all_monthly: 'the 1st of next month'
  };

  static RARITY_GRADIENTS = {
    common: 'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
    uncommon: 'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
    rare: 'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
    epic: 'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
    legendary: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
  };

  constructor(app) {
    this.app = app;
    this.activeBoosts = [];
    this.items = [];
    this.skipCaps = {};
    this._boostTicker = null;
    this._renderQueued = false;
    this._syncInProgress = false;
    this._initialized = false;

    // Start async initialization
    this.init()
      .then(() => {
        this._initialized = true;
        console.log('[KarmaShop] Initialization complete');
      })
      .catch(err => {
        console.error('[KarmaShop] init failed:', err);
        this.activeBoosts = [];
        this.items = [];
        this._initialized = true;
      });
  }

  /**
   * Initialize the karma shop: load data, check boosts, build catalog
   */
  async init() {
    console.log('[KarmaShop] Initializing...');
    await this.loadFromCloud();
    this.initSkipCaps();
    this.checkExpiredBoosts();
    this.buildCatalog();
    console.log('[KarmaShop] Init complete with', this.activeBoosts.length, 'active boosts');
  }

  /**
   * Cleanup method to prevent memory leaks
   */
  destroy() {
    this._clearTicker();
  }

  /* ---------- CLOUD SYNC ---------- */
  
  /**
   * Load active boosts and purchase history from Supabase or localStorage
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

      // Load purchase history from cloud
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
   * Save active boosts and purchase history to Supabase and localStorage
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
      this.saveActiveBoosts();
    } finally {
      this._syncInProgress = false;
    }
  }

  /* ---------- ADMIN HELPER ---------- */
  
  _isAdmin() {
    return Boolean(this.app.state.currentUser?.isAdmin);
  }

  /* ---------- SKIP CAP HELPERS ---------- */
  
  /**
   * Initialize skip caps tracking with period-based keys
   */
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
      this.skipCaps[type] = obj;
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
    return KarmaShopEngine.RESET_MESSAGES[itemId] || 'soon';
  }

  /* ---------- CATALOG ---------- */
  
  buildCatalog() {
    this.items = [
      { id: 'xp_multiplier', name: '2× XP Boost', icon: '⚡', description: 'Double all XP gains for 24 hours', cost: 50, category: 'Power-Ups', rarity: 'rare', consumable: true },
      { id: 'karma_multiplier', name: '2× Karma Multiplier', icon: '💫', description: 'Double all Karma gains for 24 hours', cost: 75, category: 'Power-Ups', rarity: 'epic', consumable: true },
      { id: 'double_boost', name: 'Double Boost', icon: '🔥', description: 'Double both XP and Karma for 24 hours', cost: 100, category: 'Power-Ups', rarity: 'legendary', consumable: true },
      { id: 'skip_all_daily', name: 'Skip All Daily Quests', icon: '⭐', description: 'Instantly complete all Daily quests with full rewards', cost: 30, category: 'Quest Helpers', rarity: 'uncommon', consumable: true },
      { id: 'skip_all_weekly', name: 'Skip All Weekly Quests', icon: '📅', description: 'Instantly complete all Weekly quests with full rewards', cost: 60, category: 'Quest Helpers', rarity: 'rare', consumable: true },
      { id: 'skip_all_monthly', name: 'Skip All Monthly Quests', icon: '🗓️', description: 'Instantly complete all Monthly quests with full rewards', cost: 120, category: 'Quest Helpers', rarity: 'epic', consumable: true },
      { id: 'premium_skin_cosmic', name: 'Cosmic Theme', icon: '🌌', description: 'Unlock a cosmic-inspired UI theme', cost: 150, category: 'Premium Skins', rarity: 'legendary', consumable: false },
      { id: 'premium_skin_forest', name: 'Forest Glade Theme', icon: '🌲', description: 'Unlock a nature-inspired UI theme', cost: 100, category: 'Premium Skins', rarity: 'epic', consumable: false },
      { id: 'premium_feature_analytics', name: 'Advanced Analytics', icon: '📊', description: 'Unlock detailed progress tracking and insights', cost: 200, category: 'Premium Features', rarity: 'legendary', consumable: false },
      { id: 'premium_feature_custom_quests', name: 'Custom Quest Creator', icon: '✨', description: 'Create your own personalized quests', cost: 250, category: 'Premium Features', rarity: 'legendary', consumable: false },
      { id: 'meet_master_session', name: 'Virtual Session with Aanandoham', icon: '🧘', description: 'Book a 1-hour virtual session to deepen your practice', cost: 300, category: 'Meet the Master', rarity: 'legendary', consumable: true },
      { id: 'meet_master_workshop', name: 'Group Workshop', icon: '👥', description: 'Join a 2-hour interactive group workshop', cost: 200, category: 'Meet the Master', rarity: 'epic', consumable: true }
    ];
  }

  /* ---------- PURCHASE LOGIC ---------- */
  
  /**
   * Check if user can purchase an item
   * @param {string} itemId - The item ID to check
   * @returns {Object} Object with can (boolean) and reason (string)
   */
  canPurchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return { can: false, reason: 'Item not found' };
    
    const karma = this.app.gamification.state.karma;
    if (karma < item.cost) return { can: false, reason: 'Not enough Karma' };
    if (!item.consumable && this.isItemOwned(itemId)) return { can: false, reason: 'Already owned' };
    if (item.consumable && this.isBoostActive(itemId)) return { can: false, reason: 'Already active' };
    
    // Check skip caps
    if (itemId === 'skip_all_daily' && this._skipCapUsed('dailySkips') >= this._skipCapMax('dailySkips') && !this._isAdmin()) {
      return { can: false, reason: `Resets ${this._whenResets(itemId)}` };
    }
    if (itemId === 'skip_all_weekly' && this._skipCapUsed('weeklySkips') >= this._skipCapMax('weeklySkips') && !this._isAdmin()) {
      return { can: false, reason: `Resets ${this._whenResets(itemId)}` };
    }
    if (itemId === 'skip_all_monthly' && this._skipCapUsed('monthlySkips') >= this._skipCapMax('monthlySkips') && !this._isAdmin()) {
      return { can: false, reason: `Resets ${this._whenResets(itemId)}` };
    }
    
    return { can: true, reason: '' };
  }

  /**
   * Purchase an item from the shop
   * @param {string} itemId - The item ID to purchase
   */
  purchase(itemId) {
    try {
      const item = this.items.find(i => i.id === itemId);
      if (!item) {
        this.app.showToast('❌ Item not found', 'error');
        return;
      }

      const check = this.canPurchase(itemId);
      if (!check.can) {
        this.app.showToast(`❌ Cannot purchase: ${check.reason}`, 'error');
        return;
      }

      // Deduct karma
      this.app.gamification.state.karma -= item.cost;
      this.app.gamification.saveState();

      // Record purchase
      this.recordPurchase(itemId, item.cost);

      // Apply item effect
      if (item.consumable) {
        this.activateBoost(itemId);
      }

      // Special handling for "Meet the Master" items
      if (item.category === 'Meet the Master') {
        this.showMasterPurchasePopup(item);
      }

      this.saveToCloud();
      this.queueRender();
      this.app.showToast(`✅ Purchased ${item.name}!`, 'success');
    } catch (err) {
      console.error('[KarmaShop] Purchase failed:', err);
      this.app.showToast('❌ Purchase failed. Please try again.', 'error');
    }
  }

  /**
   * Activate a consumable boost
   * @param {string} boostId - The boost ID to activate
   */
  activateBoost(boostId) {
    if (boostId.startsWith('skip_all_')) {
      this.skipAllQuests(boostId);
      return;
    }

    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    this.activeBoosts.push({ id: boostId, expiresAt });
    this.saveActiveBoosts();
  }

  /**
   * Check if a boost is currently active
   * @param {string} boostId - The boost ID to check
   * @returns {boolean}
   */
  isBoostActive(boostId) {
    return this.activeBoosts.some(b => b.id === boostId);
  }

  /**
   * Check if a non-consumable item is owned
   * @param {string} itemId - The item ID to check
   * @returns {boolean}
   */
  isItemOwned(itemId) {
    const history = this.getPurchaseHistory();
    return history.some(p => p.itemId === itemId);
  }

  /**
   * Check and remove expired boosts
   */
  checkExpiredBoosts() {
    const now = Date.now();
    const before = this.activeBoosts.length;
    this.activeBoosts = this.activeBoosts.filter(boost => {
      const isQuest = boost.id.startsWith('skip_all_');
      const expiry = isQuest ? (boost.resetAt || 0) : boost.expiresAt;
      return expiry > now;
    });
    if (this.activeBoosts.length !== before) {
      this.saveActiveBoosts();
      console.log('[KarmaShop] Removed', before - this.activeBoosts.length, 'expired boosts');
    }
  }

  /* ---------- PERSISTENCE ---------- */
  
  loadActiveBoosts() {
    return this._getLocalStorage('karma_active_boosts', []);
  }

  saveActiveBoosts() {
    localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
  }

  getPurchaseHistory() {
    return this._getLocalStorage('karma_purchase_history', []);
  }

  recordPurchase(itemId, cost) {
    const history = this.getPurchaseHistory();
    history.push({ itemId, cost, timestamp: Date.now() });
    localStorage.setItem('karma_purchase_history', JSON.stringify(history));
  }

  _getLocalStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  /* ---------- SKIP QUESTS ---------- */
  
  /**
   * Skip all quests of a specific type
   * @param {string} skipType - Type of skip (skip_all_daily, skip_all_weekly, skip_all_monthly)
   */
  skipAllQuests(skipType) {
    const configs = {
      skip_all_daily: { 
        label: 'Daily', 
        filter: q => q.frequency === 'daily', 
        cap: 'dailySkips', 
        minXP: 50, 
        minKarma: 5,
        resetFn: () => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return tomorrow.getTime();
        }
      },
      skip_all_weekly: { 
        label: 'Weekly', 
        filter: q => q.frequency === 'weekly', 
        cap: 'weeklySkips', 
        minXP: 100, 
        minKarma: 10,
        resetFn: () => {
          const nextSunday = new Date();
          nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
          nextSunday.setHours(0, 0, 0, 0);
          return nextSunday.getTime();
        }
      },
      skip_all_monthly: { 
        label: 'Monthly', 
        filter: q => q.frequency === 'monthly', 
        cap: 'monthlySkips', 
        minXP: 200, 
        minKarma: 20,
        resetFn: () => {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(1);
          nextMonth.setHours(0, 0, 0, 0);
          return nextMonth.getTime();
        }
      }
    };

    const cfg = configs[skipType];
    if (!cfg) return;

    this._useSkipCap(cfg.cap);
    
    const todo = this.app.questEngine.quests.filter(cfg.filter).filter(q => !q.completed);
    if (todo.length === 0) {
      this.app.showToast(`No incomplete ${cfg.label} quests to skip`, 'info');
      return;
    }

    // Calculate and award XP/Karma
    let xp = 0, karma = 0;
    this.app.gamification._bulkMode = true;
    todo.forEach(q => { 
      xp += q.xp ?? 0; 
      karma += q.karma ?? 0; 
      q.completed = true; 
    });
    this.app.gamification._bulkMode = false;
    
    xp = Math.max(xp, cfg.minXP);
    karma = Math.max(karma, cfg.minKarma);
    
    this.app.gamification.state.xp += xp;
    this.app.gamification.state.karma += karma;
    this.app.gamification.saveState();
    
    // Store reset time
    const resetAt = cfg.resetFn.call(this);
    this.activeBoosts.push({ id: skipType, resetAt });
    this.saveActiveBoosts();
    
    this.app.showToast(`✅ All ${cfg.label} quests completed! (+${xp} XP | +${karma} Karma)`, 'success');
  }

  /**
   * Show popup for "Meet the Master" purchases
   * @param {Object} item - The purchased item
   */
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

  /* ---------- RENDER ---------- */
  
  /**
   * Queue a render using requestAnimationFrame for performance
   */
  queueRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;
    requestAnimationFrame(() => { 
      this.render(); 
      this._renderQueued = false; 
    });
  }

  /**
   * Render the karma shop UI
   */
  render() {
    const tab = document.getElementById('karma-shop-tab');
    if (!tab) { 
      console.error('[KarmaShop] karma-shop-tab element not found'); 
      return; 
    }

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
      setTimeout(() => this.render(), 100);
      return;
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

  /**
   * Render active boosts section
   * @returns {string} HTML string
   */
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

  /**
   * Start interval ticker to update boost timers
   */
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

  /**
   * Clear the boost ticker interval
   */
  _clearTicker() {
    if (this._boostTicker) {
      clearInterval(this._boostTicker);
      this._boostTicker = null;
    }
  }

  /**
   * Render a single shop item card
   * @param {Object} item - The shop item
   * @returns {string} HTML string
   */
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
          <button onclick="window.featuresManager.engines['karma-shop'].purchase('${item.id}')" 
                  class="btn ${canBuy.can ? 'btn-primary' : 'btn-secondary'} karma-shop-item-btn" 
                  ${!canBuy.can ? 'disabled' : ''}>
            ${isOwned ? '✓ Owned' : isActive ? '✓ Active' : canBuy.can ? '🛒 Purchase' : canBuy.reason}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render purchase history section
   * @param {Array} purchaseHistory - Array of purchase records
   * @returns {string} HTML string
   */
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

  /**
   * Get rarity color gradient
   * @param {string} rarity - Item rarity level
   * @returns {string} CSS gradient string
   */
  getRarityColor(rarity) {
    return KarmaShopEngine.RARITY_GRADIENTS[rarity] || KarmaShopEngine.RARITY_GRADIENTS.common;
  }

  /**
   * Format duration in milliseconds to human-readable string
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted duration
   */
  _fmtDuration(ms) {
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }
}

export default KarmaShopEngine;