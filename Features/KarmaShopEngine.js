// ============================================
// KARMA SHOP ENGINE – Gamification Store
// ============================================

import { supabase } from '../Core/Supabase.js';

/**
 * KarmaShopEngine: Manages the in-app karma currency shop with cloud sync,
 * boost tracking, quest skipping, and premium features.
 */
export class KarmaShopEngine {
  // ===== CONSTANTS =====
  static SKIP_CAP_LIMITS = {
    dailySkips: 2,
    weeklySkips: 2,
    monthlySkips: 3
  };

  static SKIP_RESET_MESSAGES = {
    skip_all_daily: 'tonight at midnight',
    skip_all_weekly: 'next Sunday',
    skip_all_monthly: 'the 1st of next month'
  };

  static BOOST_DISPLAY_NAMES = {
    xp_multiplier: '⚡ 2× XP Boost',
    karma_multiplier: '💫 2× Karma Multiplier',
    double_boost: '🔥 Double Boost',
    skip_all_daily: '⭐ Skip Daily Quests',
    skip_all_weekly: '📅 Skip Weekly Quests',
    skip_all_monthly: '🗓️ Skip Monthly Quests'
  };

  static RARITY_GRADIENTS = {
    common: 'linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)',
    uncommon: 'linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)',
    rare: 'linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)',
    epic: 'linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)',
    legendary: 'linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)'
  };

  static BOOST_TICKER_INTERVAL = 5000; // 5 seconds
  static RENDER_RETRY_DELAY = 100; // ms

  constructor(app) {
    if (!app) throw new Error('KarmaShopEngine requires app instance');
    
    this.app = app;
    this.activeBoosts = [];
    this.items = [];
    this.skipCaps = {}; // Memory cache for skip usage tracking
    
    // Internal state
    this._boostTicker = null;
    this._renderQueued = false;
    this._syncInProgress = false;
    this._initialized = false;

    // Start async initialization without blocking
    this.init()
      .then(() => {
        this._initialized = true;
        console.log('[KarmaShop] Initialization complete');
      })
      .catch(err => {
        console.error('[KarmaShop] Init failed:', err);
        this.activeBoosts = [];
        this.items = [];
        this._initialized = true; // Mark as initialized even on error
      });
  }

  /**
   * Initializes the karma shop by loading data and building catalog
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
    if (this._boostTicker) {
      clearInterval(this._boostTicker);
      this._boostTicker = null;
    }
  }

  // ===== CLOUD SYNC =====
  /**
   * Loads active boosts and purchase history from cloud or localStorage
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

      // Sync purchase history to localStorage
      if (cloudData.purchaseHistory) {
        localStorage.setItem('karma_purchase_history', JSON.stringify(cloudData.purchaseHistory));
      }

      // Cache active boosts locally
      localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
      console.log('[KarmaShop] ☁️ Loaded from cloud:', this.activeBoosts.length, 'boosts');
    } catch (err) {
      console.error('[KarmaShop] Cloud load failed, using localStorage:', err);
      this.activeBoosts = this.loadActiveBoosts();
    }
  }

  /**
   * Saves active boosts and purchase history to cloud and localStorage
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

      // Fetch current payload
      const { data: current, error: fetchError } = await supabase
        .from('user_progress')
        .select('payload')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      // Update karma shop data in payload
      const payload = current?.payload || {};
      payload.karmaShop = {
        activeBoosts: this.activeBoosts,
        purchaseHistory: this.getPurchaseHistory(),
        lastSync: new Date().toISOString()
      };

      // Upsert to cloud
      const { error: saveError } = await supabase
        .from('user_progress')
        .upsert(
          { user_id: user.id, payload, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );

      if (saveError) throw saveError;

      // Cache locally as backup
      this.saveActiveBoosts();
      console.log('[KarmaShop] ☁️ Synced to cloud');
    } catch (err) {
      console.error('[KarmaShop] Cloud save failed:', err);
      this.saveActiveBoosts(); // Fallback to local storage
    } finally {
      this._syncInProgress = false;
    }
  }

  // ===== ADMIN HELPER =====
  /**
   * Checks if current user has admin privileges
   */
  _isAdmin() {
    return Boolean(this.app.state?.currentUser?.isAdmin);
  }

  // ===== SKIP CAP MANAGEMENT =====
  /**
   * Initializes skip caps with period-based reset keys
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
      
      // Reset if period has changed
      if (obj.key !== key) {
        obj = { key, used: 0 };
      }
      
      this.skipCaps[type] = obj; // Cache in memory
      localStorage.setItem(storageKey, JSON.stringify(obj));
    });
  }

  /**
   * Generates week key for daily skip tracking (YYYY-Www)
   */
  _weekKey(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const weekNumber = Math.ceil((date - new Date(year, 0, 1)) / 604800000);
    return `${year}-W${String(weekNumber).padStart(2, '0')}`;
  }

  /**
   * Generates month key for weekly skip tracking (YYYY-MM)
   */
  _monthKey(timestamp) {
    return new Date(timestamp).toISOString().slice(0, 7);
  }

  /**
   * Generates year key for monthly skip tracking (YYYY)
   */
  _yearKey(timestamp) {
    return new Date(timestamp).getFullYear().toString();
  }

  /**
   * Increments skip cap usage for a given type
   */
  _useSkipCap(type) {
    if (this._isAdmin()) return; // Admins have unlimited skips
    
    this.skipCaps[type].used += 1;
    localStorage.setItem(`karma_skip_caps_${type}`, JSON.stringify(this.skipCaps[type]));
    this.queueRender();
  }

  /**
   * Returns number of skips used for a type
   */
  _skipCapUsed(type) {
    return this.skipCaps[type]?.used || 0;
  }

  /**
   * Returns maximum allowed skips for a type
   */
  _skipCapMax(type) {
    return KarmaShopEngine.SKIP_CAP_LIMITS[type] || 0;
  }

  /**
   * Returns user-friendly reset time description
   */
  _whenResets(itemId) {
    return KarmaShopEngine.SKIP_RESET_MESSAGES[itemId] || 'soon';
  }

  // ===== CATALOG =====
  /**
   * Builds the shop catalog with all available items
   */
  buildCatalog() {
    this.items = [
      // Power-Ups
      {
        id: 'xp_multiplier',
        name: '2× XP Boost',
        icon: '⚡',
        description: 'Double your XP gains for 30 minutes',
        cost: 100,
        category: 'Power-Ups',
        rarity: 'uncommon',
        consumable: true,
        duration: 30 * 60 * 1000 // 30 minutes
      },
      {
        id: 'karma_multiplier',
        name: '2× Karma Multiplier',
        icon: '💫',
        description: 'Double your Karma earnings for 30 minutes',
        cost: 150,
        category: 'Power-Ups',
        rarity: 'rare',
        consumable: true,
        duration: 30 * 60 * 1000
      },
      {
        id: 'double_boost',
        name: 'Double Boost',
        icon: '🔥',
        description: '2× XP and 2× Karma for 1 hour',
        cost: 250,
        category: 'Power-Ups',
        rarity: 'epic',
        consumable: true,
        duration: 60 * 60 * 1000 // 1 hour
      },

      // Quest Helpers
      {
        id: 'skip_all_daily',
        name: 'Skip All Daily Quests',
        icon: '⭐',
        description: 'Complete all daily quests instantly (limited uses per week)',
        cost: 200,
        category: 'Quest Helpers',
        rarity: 'rare',
        consumable: true
      },
      {
        id: 'skip_all_weekly',
        name: 'Skip All Weekly Quests',
        icon: '📅',
        description: 'Complete all weekly quests instantly (limited uses per month)',
        cost: 500,
        category: 'Quest Helpers',
        rarity: 'epic',
        consumable: true
      },
      {
        id: 'skip_all_monthly',
        name: 'Skip All Monthly Quests',
        icon: '🗓️',
        description: 'Complete all monthly quests instantly (limited uses per year)',
        cost: 1000,
        category: 'Quest Helpers',
        rarity: 'legendary',
        consumable: true
      },

      // Premium Features
      {
        id: 'premium_themes',
        name: 'Premium Themes Pack',
        icon: '🎨',
        description: 'Unlock exclusive theme customization options',
        cost: 300,
        category: 'Premium Features',
        rarity: 'rare',
        consumable: false
      },
      {
        id: 'custom_avatar',
        name: 'Custom Avatar Upload',
        icon: '👤',
        description: 'Upload your own profile picture',
        cost: 200,
        category: 'Premium Features',
        rarity: 'uncommon',
        consumable: false
      },
      {
        id: 'advanced_stats',
        name: 'Advanced Analytics',
        icon: '📊',
        description: 'Unlock detailed progress tracking and insights',
        cost: 400,
        category: 'Premium Features',
        rarity: 'epic',
        consumable: false
      },

      // Premium Skins
      {
        id: 'skin_golden',
        name: 'Golden Theme',
        icon: '🏆',
        description: 'Luxury golden interface theme',
        cost: 500,
        category: 'Premium Skins',
        rarity: 'epic',
        consumable: false
      },
      {
        id: 'skin_midnight',
        name: 'Midnight Theme',
        icon: '🌙',
        description: 'Elegant dark theme with purple accents',
        cost: 300,
        category: 'Premium Skins',
        rarity: 'rare',
        consumable: false
      },
      {
        id: 'skin_nature',
        name: 'Nature Theme',
        icon: '🌿',
        description: 'Calming green and earth-tone theme',
        cost: 250,
        category: 'Premium Skins',
        rarity: 'uncommon',
        consumable: false
      },

      // Meet the Master
      {
        id: 'master_meditation',
        name: '1-on-1 Meditation Session',
        icon: '🧘',
        description: 'Personal guided meditation with Aanandoham',
        cost: 2000,
        category: 'Meet the Master',
        rarity: 'legendary',
        consumable: true
      },
      {
        id: 'master_consultation',
        name: 'Personal Wellness Consultation',
        icon: '💬',
        description: 'One-on-one wellness and mindfulness consultation',
        cost: 3000,
        category: 'Meet the Master',
        rarity: 'legendary',
        consumable: true
      }
    ];
  }

  // ===== PURCHASE LOGIC =====
  /**
   * Checks if an item can be purchased
   */
  canPurchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return { can: false, reason: 'Item not found' };

    const karma = this.app.gamification?.state?.karma || 0;
    
    // Check if already owned (non-consumable)
    if (!item.consumable && this.isItemOwned(itemId)) {
      return { can: false, reason: 'Already owned' };
    }

    // Check if boost is already active
    if (item.consumable && this.isBoostActive(itemId)) {
      return { can: false, reason: 'Already active' };
    }

    // Check skip cap limits
    if (itemId.startsWith('skip_all_')) {
      const type = itemId.replace('skip_all_', '') + 'Skips';
      const used = this._skipCapUsed(type);
      const max = this._skipCapMax(type);
      
      if (!this._isAdmin() && used >= max) {
        return { can: false, reason: `Cap reached (resets ${this._whenResets(itemId)})` };
      }
    }

    // Check karma balance
    if (karma < item.cost) {
      return { can: false, reason: 'Not enough Karma' };
    }

    return { can: true };
  }

  /**
   * Executes a purchase transaction
   */
  purchase(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) {
      this.app.showToast('❌ Item not found', 'error');
      return;
    }

    const check = this.canPurchase(itemId);
    if (!check.can) {
      this.app.showToast(`⚠️ Cannot purchase: ${check.reason}`, 'warning');
      return;
    }

    // Deduct karma
    this.app.gamification.state.karma -= item.cost;
    this.app.gamification.saveState();

    // Add to purchase history
    this.addToPurchaseHistory(itemId, item.cost);

    // Handle different item types
    if (item.consumable) {
      if (itemId.startsWith('skip_all_')) {
        this.applySkipAllQuests(itemId);
      } else if (item.category === 'Meet the Master') {
        this.showMasterPurchasePopup(item);
      } else {
        this.activateBoost(itemId, item.duration);
      }
    } else {
      // Permanent item - mark as owned
      this.markItemOwned(itemId);
      this.app.showToast(`✅ ${item.name} unlocked!`, 'success');
    }

    this.saveToCloud();
    this.queueRender();
  }

  /**
   * Activates a timed boost
   */
  activateBoost(boostId, duration) {
    const expiresAt = Date.now() + duration;
    this.activeBoosts.push({ id: boostId, expiresAt });
    this.saveActiveBoosts();
    
    const item = this.items.find(i => i.id === boostId);
    this.app.showToast(`🎉 ${item?.name || boostId} activated!`, 'success');
  }

  /**
   * Applies quest skip (completes all quests of a type)
   */
  applySkipAllQuests(skipType) {
    const skipMap = {
      skip_all_daily: {
        type: 'dailySkips',
        label: 'daily',
        minXP: 50,
        minKarma: 30,
        resetFn: this.getNextMidnight
      },
      skip_all_weekly: {
        type: 'weeklySkips',
        label: 'weekly',
        minXP: 150,
        minKarma: 100,
        resetFn: this.getNextSunday
      },
      skip_all_monthly: {
        type: 'monthlySkips',
        label: 'monthly',
        minXP: 500,
        minKarma: 300,
        resetFn: this.getNextMonth
      }
    };

    const cfg = skipMap[skipType];
    if (!cfg) return;

    // Use skip cap
    this._useSkipCap(cfg.type);

    // Complete all quests of this category
    const quests = this.app.gamification?.quests || [];
    const questsToComplete = quests.filter(q => 
      q.category === cfg.label && !q.completed
    );

    if (questsToComplete.length === 0) {
      this.app.showToast(`ℹ️ No ${cfg.label} quests to complete`, 'info');
      return;
    }

    // Calculate and award XP/Karma
    let totalXP = 0;
    let totalKarma = 0;

    this.app.gamification._bulkMode = true;
    questsToComplete.forEach(quest => {
      totalXP += quest.xp ?? 0;
      totalKarma += quest.karma ?? 0;
      quest.completed = true;
    });
    this.app.gamification._bulkMode = false;

    // Ensure minimum rewards
    totalXP = Math.max(totalXP, cfg.minXP);
    totalKarma = Math.max(totalKarma, cfg.minKarma);

    // Award rewards
    this.app.gamification.state.xp += totalXP;
    this.app.gamification.state.karma += totalKarma;
    this.app.gamification.saveState();

    // Track boost with reset time
    const resetAt = cfg.resetFn.call(this);
    this.activeBoosts.push({ id: skipType, resetAt });
    this.saveActiveBoosts();

    this.app.showToast(
      `✅ All ${cfg.label} quests completed! (+${totalXP} XP | +${totalKarma} Karma)`,
      'success'
    );
  }

  /**
   * Shows WhatsApp contact popup for Master sessions
   */
  showMasterPurchasePopup(item) {
    const userName = this.app.state?.currentUser?.name || 'Friend';
    const message = `${item.name} bought using ${item.cost} ✨ for ${userName}.`;
    
    const overlay = document.createElement('div');
    overlay.className = 'karma-shop-master-overlay';
    overlay.innerHTML = `
      <div class="card karma-shop-master-card">
        <div class="karma-shop-master-icon">🧘</div>
        <h3 class="karma-shop-master-title">Meet the Master</h3>
        <p class="karma-shop-master-message">${this.escapeHtml(message)}</p>
        <p class="karma-shop-master-instructions">
          Screenshot or save this message, then contact Aanandoham via WhatsApp to schedule your session:
        </p>
        <a href="https://wa.me/+972524588767?text=${encodeURIComponent(message)}" 
           target="_blank" 
           class="btn btn-primary karma-shop-master-btn-wa">
          Open WhatsApp
        </a>
        <button onclick="this.closest('.karma-shop-master-overlay').remove()" 
                class="btn btn-secondary karma-shop-master-btn-close">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ===== RENDER =====
  /**
   * Queues a render with requestAnimationFrame debouncing
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
   * Main render method - displays shop interface
   */
  render() {
    const tab = document.getElementById('karma-shop-tab');
    if (!tab) {
      console.error('[KarmaShop] karma-shop-tab element not found');
      return;
    }

    // Show loading state if not initialized
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
      setTimeout(() => this.render(), KarmaShopEngine.RENDER_RETRY_DELAY);
      return;
    }

    // Clear existing boost ticker
    if (this._boostTicker) {
      clearInterval(this._boostTicker);
      this._boostTicker = null;
    }

    const karma = this.app.gamification?.state?.karma || 0;
    const purchaseHistory = this.getPurchaseHistory();
    const categories = [
      'Power-Ups',
      'Quest Helpers',
      'Premium Features',
      'Premium Skins',
      'Meet the Master'
    ];
    
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
            const categoryItems = this.items.filter(i => i.category === category);
            if (categoryItems.length === 0) return '';
            
            return `
              <div class="karma-shop-category">
                <h3 class="karma-shop-category-title">${category}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  ${categoryItems.map(item => this.renderShopItem(item)).join('')}
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
   * Renders active boosts section with countdown timers
   */
  renderActiveBoosts() {
    this.checkExpiredBoosts();
    
    if (this.activeBoosts.length === 0) return '';

    const initialContent = this.activeBoosts.map(boost => {
      const isQuestSkip = boost.id.startsWith('skip_all_');
      const timeLeft = isQuestSkip 
        ? (boost.resetAt || 0) - Date.now()
        : boost.expiresAt - Date.now();
      
      return `
        <div class="karma-shop-boost-item">
          <span class="karma-shop-boost-name">
            ${KarmaShopEngine.BOOST_DISPLAY_NAMES[boost.id] || boost.id}
          </span>
          <span class="karma-shop-boost-time">${this._fmtDuration(timeLeft)}</span>
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
   * Starts interval ticker to update boost countdowns
   */
  startBoostTicker() {
    if (this.activeBoosts.length === 0) return;

    const updateBoostTimes = () => {
      const container = document.getElementById('boosts-list-live');
      if (!container) {
        console.warn('[KarmaShop] boosts-list-live element not found');
        return;
      }

      container.innerHTML = this.activeBoosts.map(boost => {
        const isQuestSkip = boost.id.startsWith('skip_all_');
        const timeLeft = isQuestSkip
          ? (boost.resetAt || 0) - Date.now()
          : boost.expiresAt - Date.now();
        
        return `
          <div class="karma-shop-boost-item">
            <span class="karma-shop-boost-name">
              ${KarmaShopEngine.BOOST_DISPLAY_NAMES[boost.id] || boost.id}
            </span>
            <span class="karma-shop-boost-time">${this._fmtDuration(timeLeft)}</span>
          </div>
        `;
      }).join('');
    };

    // Wait for DOM to be ready, then start ticker
    setTimeout(() => {
      const container = document.getElementById('boosts-list-live');
      if (container) {
        this._boostTicker = setInterval(updateBoostTimes, KarmaShopEngine.BOOST_TICKER_INTERVAL);
      } else {
        console.error('[KarmaShop] Could not start boost ticker - element not found');
      }
    }, KarmaShopEngine.RENDER_RETRY_DELAY);
  }

  /**
   * Renders a single shop item card
   */
  renderShopItem(item) {
    const purchaseCheck = this.canPurchase(item.id);
    const isOwned = !item.consumable && this.isItemOwned(item.id);
    const isActive = item.consumable && this.isBoostActive(item.id);
    const badgeText = isOwned ? 'OWNED' : isActive ? 'ACTIVE' : '';
    const rarityGradient = this.getRarityColor(item.rarity);

    return `
      <div class="card karma-shop-item" 
           data-rarity="${item.rarity}" 
           style="background:${rarityGradient}">
        ${badgeText ? `<div class="karma-shop-item-owned-badge">${badgeText}</div>` : ''}
        <div class="karma-shop-item-content">
          <div class="karma-shop-item-icon">${item.icon}</div>
          <h4 class="karma-shop-item-name">${this.escapeHtml(item.name)}</h4>
          <p class="karma-shop-item-description">${this.escapeHtml(item.description)}</p>
        </div>
        <div class="karma-shop-item-footer">
          <div class="karma-shop-item-meta">
            <span class="karma-shop-item-rarity karma-shop-rarity-${item.rarity}">
              ${item.rarity}
            </span>
            <span class="karma-shop-item-rarity karma-shop-item-cost karma-shop-rarity-${item.rarity}">
              ${item.cost} 💎
            </span>
          </div>
          <button 
            onclick="window.featuresManager.engines['karma-shop'].purchase('${item.id}')"
            class="btn ${purchaseCheck.can ? 'btn-primary' : 'btn-secondary'} karma-shop-item-btn"
            ${!purchaseCheck.can ? 'disabled' : ''}>
            ${isOwned ? '✓ Owned' : isActive ? '✓ Active' : purchaseCheck.can ? '🛒 Purchase' : purchaseCheck.reason}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renders purchase history section
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
                <span class="karma-shop-history-item-name">
                  ${item?.icon || '📦'} ${this.escapeHtml(item?.name || purchase.itemId)}
                </span>
                <span class="karma-shop-history-item-meta">
                  ${date} • ${purchase.cost} Karma
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Gets gradient CSS for item rarity
   */
  getRarityColor(rarity) {
    return KarmaShopEngine.RARITY_GRADIENTS[rarity] || KarmaShopEngine.RARITY_GRADIENTS.common;
  }

  // ===== BOOST STATE MANAGEMENT =====
  /**
   * Checks if a boost is currently active
   */
  isBoostActive(boostId) {
    return this.activeBoosts.some(b => b.id === boostId);
  }

  /**
   * Removes expired boosts from active list
   */
  checkExpiredBoosts() {
    const now = Date.now();
    const before = this.activeBoosts.length;
    
    this.activeBoosts = this.activeBoosts.filter(boost => {
      const isQuestSkip = boost.id.startsWith('skip_all_');
      const expiry = isQuestSkip ? boost.resetAt : boost.expiresAt;
      return expiry && expiry > now;
    });

    // Save if any were removed
    if (this.activeBoosts.length !== before) {
      this.saveActiveBoosts();
    }
  }

  /**
   * Loads active boosts from localStorage
   */
  loadActiveBoosts() {
    return this._getLocalStorage('karma_active_boosts', []);
  }

  /**
   * Saves active boosts to localStorage
   */
  saveActiveBoosts() {
    localStorage.setItem('karma_active_boosts', JSON.stringify(this.activeBoosts));
  }

  // ===== OWNERSHIP TRACKING =====
  /**
   * Checks if a non-consumable item is owned
   */
  isItemOwned(itemId) {
    const owned = this._getLocalStorage('karma_owned_items', []);
    return owned.includes(itemId);
  }

  /**
   * Marks a non-consumable item as owned
   */
  markItemOwned(itemId) {
    const owned = this._getLocalStorage('karma_owned_items', []);
    if (!owned.includes(itemId)) {
      owned.push(itemId);
      localStorage.setItem('karma_owned_items', JSON.stringify(owned));
    }
  }

  // ===== PURCHASE HISTORY =====
  /**
   * Adds purchase to history
   */
  addToPurchaseHistory(itemId, cost) {
    const history = this.getPurchaseHistory();
    history.push({
      itemId,
      cost,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('karma_purchase_history', JSON.stringify(history));
  }

  /**
   * Gets purchase history from localStorage
   */
  getPurchaseHistory() {
    return this._getLocalStorage('karma_purchase_history', []);
  }

  // ===== RESET TIME CALCULATORS =====
  /**
   * Gets timestamp for next midnight (daily quest reset)
   */
  getNextMidnight() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime();
  }

  /**
   * Gets timestamp for next Sunday (weekly quest reset)
   */
  getNextSunday() {
    const today = new Date();
    const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + daysUntilSunday);
    nextSunday.setHours(0, 0, 0, 0);
    return nextSunday.getTime();
  }

  /**
   * Gets timestamp for first day of next month (monthly quest reset)
   */
  getNextMonth() {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    nextMonth.setHours(0, 0, 0, 0);
    return nextMonth.getTime();
  }

  // ===== UTILITY METHODS =====
  /**
   * Formats milliseconds into human-readable duration
   */
  _fmtDuration(ms) {
    if (ms <= 0) return 'Expired';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Safely retrieves and parses localStorage item
   */
  _getLocalStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(`[KarmaShop] Failed to parse localStorage key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Escapes HTML to prevent XSS attacks
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default KarmaShopEngine;