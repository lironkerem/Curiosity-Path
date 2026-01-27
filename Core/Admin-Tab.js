/**
 * AdminTab - Administrative Panel for User Management
 * 
 * Manages bulk operations for users including:
 * - XP and Karma gifting
 * - Premium feature unlocking
 * - Badge awarding (preset and custom)
 * - Direct messaging with push notifications
 * 
 * @class AdminTab
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONSTANTS = {
  MESSAGE_TIMEOUT: 3000,
  EMOJI_MAX_LENGTH: 2,
  BADGE_NAME_MAX_LENGTH: 30,
  DESCRIPTION_MAX_LENGTH: 60,
  DEFAULT_XP: 100,
  DEFAULT_KARMA: 50,
  NOTIFICATION_ICON: '/Icons/icon-192x192.png',
  NOTIFICATION_TRUNCATE: 100,
  MAX_PANEL_HEIGHT: '2000px'
};

const RARITY_KARMA = {
  common: 3,
  uncommon: 5,
  rare: 10,
  epic: 15,
  legendary: 30
};

const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

// ============================================================================
// MAIN CLASS
// ============================================================================

export class AdminTab {
  /**
   * @param {Object} supabase - Supabase client instance
   */
  constructor(supabase) {
    this.supabase = supabase;
    this.users = []; // All fetched users with progress data
    this.selectedUsers = []; // Currently selected users for operations
    this.elements = {}; // Cached DOM elements
    
    // Premium features available for unlocking
    this.premiumFeatures = [
      'advance_tarot_spreads',
      'tarot_vision_ai',
      'shadow_alchemy_lab',
      'advanced_meditations',
      'luxury_blush_champagne_skin',
      'luxury_champagne_gold_skin',
      'luxury_marble_bronze_skin',
      'royal_indigo_skin',
      'earth_luxury_skin'
    ];
    
    // Preset badges with complete metadata
    this.availableBadges = [
      { 
        id: 'early_supporter', 
        name: 'Early Supporter', 
        icon: '🌟',
        xp: 100,
        rarity: 'epic',
        description: 'Joined during early access'
      },
      { 
        id: 'vip_member', 
        name: 'VIP Member', 
        icon: '👑',
        xp: 150,
        rarity: 'legendary',
        description: 'VIP community member'
      },
      { 
        id: 'beta_tester', 
        name: 'Beta Tester', 
        icon: '🧪',
        xp: 100,
        rarity: 'rare',
        description: 'Helped test new features'
      },
      { 
        id: 'spiritual_guide', 
        name: 'Spiritual Guide', 
        icon: '🕉️',
        xp: 150,
        rarity: 'epic',
        description: 'Community mentor and guide'
      },
      { 
        id: 'community_hero', 
        name: 'Community Hero', 
        icon: '🦸',
        xp: 200,
        rarity: 'legendary',
        description: 'Outstanding community contribution'
      }
    ];
  }

  // ==========================================================================
  // RENDERING METHODS
  // ==========================================================================

  /**
   * Renders the admin panel UI
   * @returns {HTMLElement} Container element with admin interface
   */
  async render() {
    const container = document.createElement('div');
    container.className = 'admin-tab';
    container.style.cssText = 'padding:20px;max-width:100%;color:var(--neuro-text);';

    container.innerHTML = this.getMainHTML();

    try {
      await this.fetchUsers();
      this.cacheElements(container);
      this.renderUserCheckboxes();
      this.attachEventListeners(container);
    } catch (error) {
      console.error('Error initializing admin panel:', error);
      this.showError(container, 'Failed to load users. Please refresh.');
    }

    return container;
  }

  /**
   * Generates main HTML structure
   * @returns {string} HTML string
   */
  getMainHTML() {
    return `
      <!-- User Selection Section -->
      <div style="background:var(--neuro-bg);border:2px solid var(--neuro-accent);border-radius:12px;padding:16px;margin-bottom:20px;box-shadow:var(--shadow-raised);">
        <h3 style="color:var(--neuro-text);margin-bottom:12px;font-size:0.95rem;font-weight:600;">👥 Select Users</h3>
        <div style="display:flex;gap:10px;margin-bottom:12px;">
          <button id="selectAll" style="flex:1;padding:8px 16px;background:var(--neuro-accent);color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;">Select All</button>
          <button id="clearSelection" style="flex:1;padding:8px 16px;background:#ff4757;color:white;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;font-weight:600;">Clear</button>
        </div>
        <div style="background:rgba(102,126,234,0.05);padding:8px 12px;border-radius:8px;margin-bottom:12px;">
          <span id="selectedCount" style="color:var(--neuro-text);font-weight:600;font-size:0.85rem;">0 users selected</span>
        </div>
        <div id="userCheckboxes" style="max-height:180px;overflow-y:auto;border:1px solid rgba(102,126,234,0.3);border-radius:8px;padding:8px;background:rgba(0,0,0,0.02);"></div>
      </div>

      <!-- Accordion Sections -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${this.getAccordionSection('xp-karma', '💎', 'XP & Karma')}
        ${this.getAccordionSection('features', '🔓', 'Premium Features')}
        ${this.getAccordionSection('badges', '🎖️', 'Badges')}
        ${this.getAccordionSection('messages', '💬', 'Messages')}
      </div>
      
      <div id="message" style="margin-top:20px;font-weight:bold;padding:12px;border-radius:8px;display:none;font-size:0.85rem;"></div>

      ${this.getStyles()}
    `;
  }

  /**
   * Generates accordion section HTML
   * @param {string} id - Section identifier
   * @param {string} icon - Section icon
   * @param {string} title - Section title
   * @returns {string} HTML string
   */
  getAccordionSection(id, icon, title) {
    return `
      <div class="admin-section">
        <button class="admin-accordion-btn" data-section="${id}">
          <span style="font-size:1.2rem;margin-right:10px;">${icon}</span>
          <span style="flex:1;text-align:left;font-weight:600;font-size:0.95rem;">${title}</span>
          <span class="accordion-chevron">▼</span>
        </button>
        <div class="admin-accordion-panel" id="panel-${id}"></div>
      </div>
    `;
  }

  /**
   * Returns CSS styles for the admin panel
   * @returns {string} Style tag with CSS
   */
  getStyles() {
    return `
      <style>
        .admin-section {
          background:var(--neuro-bg);
          border:2px solid var(--neuro-accent);
          border-radius:12px;
          box-shadow:var(--shadow-raised);
          overflow:hidden;
        }
        
        .admin-accordion-btn {
          display:flex;
          align-items:center;
          width:100%;
          padding:12px 16px;
          background:var(--neuro-bg);
          border:none;
          color:var(--neuro-text);
          cursor:pointer;
          font-size:0.95rem;
          transition:all 0.2s;
        }
        
        .admin-accordion-btn:hover {
          background:rgba(102,126,234,0.05);
        }
        
        .accordion-chevron {
          font-size:0.8rem;
          color:var(--neuro-text-light);
          transition:transform 0.2s;
        }
        
        .admin-accordion-btn.active .accordion-chevron {
          transform:rotate(180deg);
        }
        
        .admin-accordion-panel {
          padding:0 20px;
          max-height:0;
          overflow:hidden;
          transition:max-height 0.3s ease, padding 0.3s ease;
        }
        
        .admin-accordion-panel.active {
          max-height:${CONSTANTS.MAX_PANEL_HEIGHT};
          padding:20px;
        }
        
        .user-checkbox-item {
          display:flex;
          align-items:center;
          gap:8px;
          padding:8px;
          border-radius:6px;
          margin-bottom:4px;
          cursor:pointer;
          transition:background 0.2s;
        }
        .user-checkbox-item:hover {
          background:rgba(102,126,234,0.1);
        }
        .user-checkbox-item input[type="checkbox"] {
          cursor:pointer;
          width:16px;
          height:16px;
        }
        .admin-input {
          width:100%;
          padding:10px;
          background:var(--neuro-bg);
          border:2px solid var(--neuro-accent);
          border-radius:8px;
          color:var(--neuro-text);
          font-size:0.85rem;
          box-shadow:var(--shadow-inset-sm);
          transition:all 0.2s;
        }
        .admin-input:focus {
          outline:none;
          border-color:var(--neuro-accent-light);
          box-shadow:var(--shadow-glow);
        }
        .admin-btn {
          width:100%;
          padding:10px;
          background:var(--neuro-accent);
          color:white;
          border:none;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          font-size:0.85rem;
          box-shadow:var(--shadow-raised);
          transition:all 0.2s;
        }
        .admin-btn:hover {
          transform:translateY(-2px);
          box-shadow:var(--shadow-raised-hover);
        }
        .admin-btn:active {
          transform:translateY(0);
          box-shadow:var(--shadow-inset);
        }
        .admin-btn-secondary {
          background:#6c757d;
        }
        .admin-btn-secondary:hover {
          background:#5a6268;
        }
        .feature-checkbox-item {
          display:flex;
          align-items:center;
          gap:10px;
          padding:10px 12px;
          background:rgba(102,126,234,0.05);
          border:1px solid rgba(102,126,234,0.2);
          border-radius:8px;
          margin-bottom:8px;
          cursor:pointer;
          transition:all 0.2s;
        }
        .feature-checkbox-item:hover {
          background:rgba(102,126,234,0.15);
          border-color:var(--neuro-accent);
        }
        .feature-checkbox-item input {
          cursor:pointer;
          width:18px;
          height:18px;
        }
        .custom-badge-form {
          display:grid;
          gap:12px;
          background:rgba(102,126,234,0.05);
          padding:16px;
          border-radius:10px;
          border:1px solid rgba(102,126,234,0.2);
        }
        .form-group {
          display:flex;
          flex-direction:column;
          gap:6px;
        }
        .form-label {
          font-weight:600;
          font-size:0.85rem;
          color:var(--neuro-text);
        }
        .emoji-preview {
          font-size:3rem;
          text-align:center;
          padding:16px;
          background:rgba(102,126,234,0.1);
          border-radius:8px;
          margin-bottom:8px;
        }
      </style>
    `;
  }

  /**
   * Caches frequently accessed DOM elements
   * @param {HTMLElement} container - Main container element
   */
  cacheElements(container) {
    this.elements = {
      userCheckboxes: container.querySelector('#userCheckboxes'),
      selectedCount: container.querySelector('#selectedCount'),
      message: container.querySelector('#message'),
      selectAll: container.querySelector('#selectAll'),
      clearSelection: container.querySelector('#clearSelection')
    };
  }

  // ==========================================================================
  // DATA FETCHING & USER MANAGEMENT
  // ==========================================================================

  /**
   * Fetches all users and their progress from database
   * Combines profiles and user_progress tables
   * @throws {Error} If database query fails
   */
  async fetchUsers() {
    try {
      const [profilesResult, progressResult] = await Promise.all([
        this.supabase.from('profiles').select('id, name, email, phone'),
        this.supabase.from('user_progress').select('user_id, payload')
      ]);
      
      if (profilesResult.error) throw profilesResult.error;
      if (progressResult.error) throw progressResult.error;

      const progressMap = new Map(
        (progressResult.data || []).map(p => [p.user_id, p.payload])
      );

      this.users = (profilesResult.data || []).map(p => {
        const payload = progressMap.get(p.id) || {};
        return {
          id: p.id,
          name: p.name || 'No name',
          email: p.email || p.phone || 'No contact',
          xp: payload.xp || 0,
          karma: payload.karma || 0,
          level: payload.level || 1
        };
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      this.users = [];
      throw error;
    }
  }

  /**
   * Renders user checkboxes in the selection panel
   */
  renderUserCheckboxes() {
    if (!this.elements.userCheckboxes) return;

    this.elements.userCheckboxes.innerHTML = this.users.map(user => `
      <label class="user-checkbox-item">
        <input type="checkbox" class="user-checkbox" value="${user.id}">
        <span>${user.name} (${user.email}) - L${user.level}</span>
      </label>
    `).join('');
  }

  /**
   * Updates the selected users list based on checkboxes
   * @param {HTMLElement} container - Main container element
   */
  updateSelectedUsers(container) {
    const selected = Array.from(
      container.querySelectorAll('.user-checkbox:checked')
    ).map(cb => cb.value);
    
    this.selectedUsers = this.users.filter(u => selected.includes(u.id));
    
    if (this.elements.selectedCount) {
      this.elements.selectedCount.textContent = `${this.selectedUsers.length} users selected`;
    }
  }

  /**
   * Refreshes user data after operations
   * @param {HTMLElement} container - Main container element
   */
  async refreshUserData(container) {
    try {
      await this.fetchUsers();
      this.renderUserCheckboxes();
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }

  // ==========================================================================
  // SECTION CONTENT RENDERING
  // ==========================================================================

  /**
   * Renders content for specific accordion section
   * @param {HTMLElement} container - Main container element
   * @param {string} section - Section identifier
   */
  renderTabContent(container, section) {
    const panel = container.querySelector(`#panel-${section}`);
    if (!panel) return;

    const renderMap = {
      'xp-karma': () => this.renderXpKarmaSection(panel, container),
      'features': () => this.renderFeaturesSection(panel, container),
      'badges': () => this.renderBadgesSection(panel, container),
      'messages': () => this.renderMessagesSection(panel, container)
    };

    const renderFn = renderMap[section];
    if (renderFn) renderFn();
  }

  /**
   * Renders XP & Karma section
   */
  renderXpKarmaSection(panel, container) {
    panel.innerHTML = `
      <div style="display:grid;gap:24px;">
        <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
          <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">⚡ XP Gift Amount</label>
          <input type="number" id="xpAmount" class="admin-input" placeholder="Enter XP amount" min="0" value="${CONSTANTS.DEFAULT_XP}" style="margin-bottom:12px;">
          <button id="giftXp" class="admin-btn">🎁 Gift XP to Selected Users</button>
        </div>
        <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
          <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">🌟 Karma Gift Amount</label>
          <input type="number" id="karmaAmount" class="admin-input" placeholder="Enter Karma amount" min="0" value="${CONSTANTS.DEFAULT_KARMA}" style="margin-bottom:12px;">
          <button id="giftKarma" class="admin-btn">🎁 Gift Karma to Selected Users</button>
        </div>
      </div>
    `;
    this.attachXpKarmaHandlers(container);
  }

  /**
   * Renders Premium Features section
   */
  renderFeaturesSection(panel, container) {
    panel.innerHTML = `
      <div style="display:grid;gap:20px;">
        <div>
          <label style="display:block;margin-bottom:12px;font-weight:600;color:var(--neuro-text);">Select Features:</label>
          <div style="max-height:220px;overflow-y:auto;padding:4px;">
            ${this.premiumFeatures.map(f => `
              <label class="feature-checkbox-item">
                <input type="checkbox" class="feature-checkbox" value="${f}">
                <span style="flex:1;font-size:0.95rem;">${this.formatFeatureName(f)}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div style="background:rgba(102,126,234,0.05);padding:16px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
          <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);">⏰ Unlock Duration:</label>
          <select id="featureDuration" class="admin-input" style="margin-bottom:12px;">
            <option value="permanent">🔒 Permanent</option>
            <option value="24h">⏱️ 24 Hours (Temporary)</option>
            <option value="48h">⏱️ 48 Hours (Temporary)</option>
            <option value="72h">⏱️ 72 Hours (Temporary)</option>
            <option value="1week">⏱️ 1 Week (Temporary)</option>
          </select>
          <button id="unlockFeatures" class="admin-btn">🔓 Unlock for Selected Users</button>
        </div>
      </div>
    `;
    this.attachFeaturesHandlers(container);
  }

  /**
   * Renders Badges section
   */
  renderBadgesSection(panel, container) {
    panel.innerHTML = `
      <div style="display:grid;gap:20px;">
        <!-- Preset Badges -->
        <div>
          <label style="display:block;margin-bottom:12px;font-weight:600;color:var(--neuro-text);">Choose a Preset Badge:</label>
          <div style="display:grid;gap:10px;">
            ${this.availableBadges.map(badge => `
              <label class="feature-checkbox-item" style="cursor:pointer;padding:14px;">
                <input type="radio" name="badge" class="badge-radio" value="${badge.id}">
                <span style="font-size:1.8rem;margin-right:4px;">${badge.icon}</span>
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:1rem;">${badge.name}</div>
                  <div style="font-size:0.75rem;color:var(--neuro-text-light);">
                    +${badge.xp} XP • ${badge.rarity} • ${badge.description}
                  </div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Custom Badge Creator -->
        <div style="background:rgba(255,193,7,0.1);padding:16px;border-radius:10px;border:2px solid rgba(255,193,7,0.3);">
          <h4 style="font-weight:700;margin-bottom:12px;color:var(--neuro-text);">✨ Create Custom Badge</h4>
          <div class="custom-badge-form">
            <div class="emoji-preview" id="customEmojiPreview">🏆</div>
            
            <div class="form-group">
              <label class="form-label">Emoji Icon</label>
              <input type="text" id="customBadgeEmoji" class="admin-input" placeholder="Enter emoji (e.g., 🌟)" maxlength="${CONSTANTS.EMOJI_MAX_LENGTH}" value="🏆">
              <small style="font-size:0.75rem;color:var(--neuro-text-light);">Tip: Copy emoji from emojipedia.org</small>
            </div>
            
            <div class="form-group">
              <label class="form-label">Badge Name</label>
              <input type="text" id="customBadgeName" class="admin-input" placeholder="e.g., Super Star" maxlength="${CONSTANTS.BADGE_NAME_MAX_LENGTH}">
            </div>
            
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" id="customBadgeDesc" class="admin-input" placeholder="e.g., Outstanding achievement" maxlength="${CONSTANTS.DESCRIPTION_MAX_LENGTH}">
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="form-group">
                <label class="form-label">XP Reward</label>
                <input type="number" id="customBadgeXP" class="admin-input" placeholder="100" min="0" value="${CONSTANTS.DEFAULT_XP}">
              </div>
              
              <div class="form-group">
                <label class="form-label">Rarity</label>
                <select id="customBadgeRarity" class="admin-input">
                  <option value="common">Common (+${RARITY_KARMA.common} Karma)</option>
                  <option value="uncommon">Uncommon (+${RARITY_KARMA.uncommon} Karma)</option>
                  <option value="rare">Rare (+${RARITY_KARMA.rare} Karma)</option>
                  <option value="epic" selected>Epic (+${RARITY_KARMA.epic} Karma)</option>
                  <option value="legendary">Legendary (+${RARITY_KARMA.legendary} Karma)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Award Buttons -->
        <div style="background:rgba(102,126,234,0.05);padding:16px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);display:grid;gap:12px;">
          <button id="awardPresetBadge" class="admin-btn">🎖️ Award Preset Badge</button>
          <button id="awardCustomBadge" class="admin-btn admin-btn-secondary">✨ Award Custom Badge</button>
        </div>
      </div>
    `;
    this.attachBadgesHandlers(container);
  }

  /**
   * Renders Messages section
   */
  renderMessagesSection(panel, container) {
    panel.innerHTML = `
      <div style="display:grid;gap:20px;">
        <div style="background:rgba(102,126,234,0.05);padding:20px;border-radius:10px;border:1px solid rgba(102,126,234,0.2);">
          <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">📌 Message Title</label>
          <input type="text" id="messageTitle" class="admin-input" placeholder="e.g., Special Announcement" style="margin-bottom:20px;">
          
          <label style="display:block;margin-bottom:10px;font-weight:600;color:var(--neuro-text);font-size:1rem;">✏️ Message Content</label>
          <textarea id="messageContent" class="admin-input" rows="6" placeholder="Write your message here..." style="resize:vertical;font-family:inherit;margin-bottom:16px;"></textarea>
          
          <button id="sendMessage" class="admin-btn">💬 Send to Selected Users</button>
          
          <div style="margin-top:16px;padding:12px;background:rgba(255,193,7,0.1);border-radius:8px;border:1px solid rgba(255,193,7,0.3);">
            <p style="font-size:0.85rem;color:var(--neuro-text-light);margin:0;line-height:1.5;">
              💡 <strong>Note:</strong> Messages will be stored in user profiles and users will receive push notifications immediately.
            </p>
          </div>
        </div>
      </div>
    `;
    this.attachMessagesHandlers(container);
  }

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Attaches all main event listeners
   * @param {HTMLElement} container - Main container element
   */
  attachEventListeners(container) {
    // Select All / Clear buttons
    this.elements.selectAll?.addEventListener('click', () => {
      container.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = true);
      this.updateSelectedUsers(container);
    });

    this.elements.clearSelection?.addEventListener('click', () => {
      container.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false);
      this.updateSelectedUsers(container);
    });

    // User checkboxes
    container.querySelectorAll('.user-checkbox').forEach(cb => {
      cb.addEventListener('change', () => this.updateSelectedUsers(container));
    });

    // Accordion buttons
    container.querySelectorAll('.admin-accordion-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleAccordion(container, btn));
    });
  }

  /**
   * Toggles accordion panel open/closed
   * @param {HTMLElement} container - Main container element
   * @param {HTMLElement} btn - Accordion button clicked
   */
  toggleAccordion(container, btn) {
    const section = btn.dataset.section;
    const panel = container.querySelector(`#panel-${section}`);
    const isOpen = panel.classList.contains('active');
    
    // Close all panels
    container.querySelectorAll('.admin-accordion-panel').forEach(p => p.classList.remove('active'));
    container.querySelectorAll('.admin-accordion-btn').forEach(b => b.classList.remove('active'));
    
    // Open clicked panel if it was closed
    if (!isOpen) {
      panel.classList.add('active');
      btn.classList.add('active');
      
      // Load content if not already loaded
      if (!panel.dataset.filled) {
        this.renderTabContent(container, section);
        panel.dataset.filled = '1';
      }
    }
  }

  /**
   * Attaches XP and Karma button handlers
   * @param {HTMLElement} container - Main container element
   */
  attachXpKarmaHandlers(container) {
    container.querySelector('#giftXp')?.addEventListener('click', async () => {
      const amount = parseInt(container.querySelector('#xpAmount')?.value);
      if (!this.validateInput(amount, 'Please enter a valid XP amount')) return;
      if (!this.validateSelection()) return;
      await this.batchUpdate(container, amount, 0);
    });

    container.querySelector('#giftKarma')?.addEventListener('click', async () => {
      const amount = parseInt(container.querySelector('#karmaAmount')?.value);
      if (!this.validateInput(amount, 'Please enter a valid Karma amount')) return;
      if (!this.validateSelection()) return;
      await this.batchUpdate(container, 0, amount);
    });
  }

  /**
   * Attaches Premium Features button handlers
   * @param {HTMLElement} container - Main container element
   */
  attachFeaturesHandlers(container) {
    container.querySelector('#unlockFeatures')?.addEventListener('click', async () => {
      const features = Array.from(
        container.querySelectorAll('.feature-checkbox:checked')
      ).map(cb => cb.value);
      const duration = container.querySelector('#featureDuration')?.value;
      
      if (features.length === 0) {
        alert('Please select at least one feature');
        return;
      }
      if (!this.validateSelection()) return;
      
      await this.batchUnlockFeatures(container, features, duration);
    });
  }

  /**
   * Attaches Badge awarding button handlers
   * @param {HTMLElement} container - Main container element
   */
  attachBadgesHandlers(container) {
    // Emoji preview update
    const emojiInput = container.querySelector('#customBadgeEmoji');
    const emojiPreview = container.querySelector('#customEmojiPreview');
    
    emojiInput?.addEventListener('input', (e) => {
      const emoji = e.target.value.trim();
      if (emojiPreview) {
        emojiPreview.textContent = emoji || '🏆';
      }
    });

    // Award preset badge
    container.querySelector('#awardPresetBadge')?.addEventListener('click', async () => {
      const badgeId = container.querySelector('.badge-radio:checked')?.value;
      if (!badgeId) {
        alert('Please select a preset badge');
        return;
      }
      if (!this.validateSelection()) return;
      
      const badge = this.availableBadges.find(b => b.id === badgeId);
      await this.batchAwardBadge(container, badge);
    });

    // Award custom badge
    container.querySelector('#awardCustomBadge')?.addEventListener('click', async () => {
      if (!this.validateSelection()) return;
      
      const emoji = container.querySelector('#customBadgeEmoji')?.value.trim();
      const name = container.querySelector('#customBadgeName')?.value.trim();
      const description = container.querySelector('#customBadgeDesc')?.value.trim();
      const xp = parseInt(container.querySelector('#customBadgeXP')?.value) || CONSTANTS.DEFAULT_XP;
      const rarity = container.querySelector('#customBadgeRarity')?.value;
      
      if (!emoji || !name || !description) {
        alert('Please fill in all custom badge fields (emoji, name, and description)');
        return;
      }
      
      // Validate badge data
      try {
        this.validateBadgeData(emoji, name, description);
      } catch (error) {
        alert(error.message);
        return;
      }
      
      // Create custom badge object
      const customBadge = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: this.sanitizeInput(name, CONSTANTS.BADGE_NAME_MAX_LENGTH),
        icon: emoji,
        description: this.sanitizeInput(description, CONSTANTS.DESCRIPTION_MAX_LENGTH),
        xp,
        rarity
      };
      
      await this.batchAwardBadge(container, customBadge);
    });
  }

  /**
   * Attaches Message sending button handlers
   * @param {HTMLElement} container - Main container element
   */
  attachMessagesHandlers(container) {
    container.querySelector('#sendMessage')?.addEventListener('click', async () => {
      const title = container.querySelector('#messageTitle')?.value.trim();
      const content = container.querySelector('#messageContent')?.value.trim();
      
      if (!title || !content) {
        alert('Please enter both title and message');
        return;
      }
      if (!this.validateSelection()) return;
      
      await this.batchSendMessage(container, title, content);
    });
  }

  // ==========================================================================
  // VALIDATION HELPERS
  // ==========================================================================

  /**
   * Validates that users are selected
   * @param {string} message - Custom error message
   * @returns {boolean} True if valid
   */
  validateSelection(message = 'Please select at least one user') {
    if (this.selectedUsers.length === 0) {
      alert(message);
      return false;
    }
    return true;
  }

  /**
   * Validates numeric input
   * @param {number} value - Value to validate
   * @param {string} message - Error message
   * @returns {boolean} True if valid
   */
  validateInput(value, message) {
    if (!value || value < 0 || isNaN(value)) {
      alert(message);
      return false;
    }
    return true;
  }

  /**
   * Validates badge data
   * @param {string} emoji - Badge emoji
   * @param {string} name - Badge name
   * @param {string} description - Badge description
   * @throws {Error} If validation fails
   */
  validateBadgeData(emoji, name, description) {
    if (!emoji || emoji.length > CONSTANTS.EMOJI_MAX_LENGTH) {
      throw new Error('Invalid emoji (max 2 characters)');
    }
    if (!name || name.length > CONSTANTS.BADGE_NAME_MAX_LENGTH) {
      throw new Error(`Badge name too long (max ${CONSTANTS.BADGE_NAME_MAX_LENGTH} characters)`);
    }
    if (!description || description.length > CONSTANTS.DESCRIPTION_MAX_LENGTH) {
      throw new Error(`Description too long (max ${CONSTANTS.DESCRIPTION_MAX_LENGTH} characters)`);
    }
  }

  /**
   * Sanitizes and truncates input
   * @param {string} input - Input to sanitize
   * @param {number} maxLength - Maximum length
   * @returns {string} Sanitized input
   */
  sanitizeInput(input, maxLength) {
    return input.trim().substring(0, maxLength);
  }

  /**
   * Formats feature name for display
   * @param {string} feature - Feature identifier
   * @returns {string} Formatted name
   */
  formatFeatureName(feature) {
    return feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // ==========================================================================
  // BATCH OPERATIONS
  // ==========================================================================

  /**
   * Updates XP and/or Karma for selected users
   * @param {HTMLElement} container - Main container element
   * @param {number} xp - XP amount to add
   * @param {number} karma - Karma amount to add
   */
  async batchUpdate(container, xp, karma) {
    try {
      this.showMessage(container, 'Updating users...', MESSAGE_TYPES.INFO);
      
      const operations = this.selectedUsers.map(user => 
        this.updateSingleUser(user, xp, karma)
      );
      
      const results = await Promise.allSettled(operations);
      const success = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      this.showMessage(
        container, 
        `✅ Updated ${success} users${failed > 0 ? `, ${failed} failed` : ''}`, 
        MESSAGE_TYPES.SUCCESS
      );
      
      await this.refreshUserData(container);
    } catch (error) {
      console.error('Batch update failed:', error);
      this.showMessage(container, '❌ Update failed. Please try again.', MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * Updates a single user's XP/Karma and sends notification
   * @param {Object} user - User object
   * @param {number} xp - XP delta
   * @param {number} karma - Karma delta
   */
  async updateSingleUser(user, xp, karma) {
    const { error } = await this.supabase.rpc('update_user_gamification', {
      target_user_id: user.id,
      xp_delta: xp,
      karma_delta: karma
    });
    
    if (error) throw error;
    
    // Send notification
    await this.notifyUserUpdate(user.id, xp, karma);
  }

  /**
   * Unlocks premium features for selected users
   * @param {HTMLElement} container - Main container element
   * @param {Array<string>} features - Feature identifiers
   * @param {string} duration - Unlock duration
   */
  async batchUnlockFeatures(container, features, duration) {
    try {
      this.showMessage(container, 'Unlocking features...', MESSAGE_TYPES.INFO);
      
      // Note: Temporary unlocks require additional backend logic
      if (duration !== 'permanent') {
        this.showMessage(
          container, 
          '⚠️ Temporary unlocks require backend setup. Using permanent for now.', 
          MESSAGE_TYPES.INFO
        );
      }

      const operations = this.selectedUsers.map(user => 
        this.unlockFeaturesForUser(user, features)
      );
      
      const results = await Promise.allSettled(operations);
      const success = results.filter(r => r.status === 'fulfilled').length;
      
      this.showMessage(
        container, 
        `✅ Unlocked features for ${success} users`, 
        MESSAGE_TYPES.SUCCESS
      );
    } catch (error) {
      console.error('Batch unlock failed:', error);
      this.showMessage(container, '❌ Unlock failed. Please try again.', MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * Unlocks features for a single user
   * @param {Object} user - User object
   * @param {Array<string>} features - Feature identifiers
   */
  async unlockFeaturesForUser(user, features) {
    for (const feature of features) {
      const { error } = await this.supabase.rpc('update_user_gamification', {
        target_user_id: user.id,
        xp_delta: 0,
        karma_delta: 0,
        unlock_feature: feature
      });
      if (error) throw error;
    }

    // Send notification
    const featureList = features.map(f => this.formatFeatureName(f)).join(', ');
    await this.sendPushNotificationToUser(
      user.id,
      '🔓 New Features Unlocked!',
      `Admin unlocked: ${featureList}`
    );
  }

  /**
   * Awards badge to selected users
   * @param {HTMLElement} container - Main container element
   * @param {Object} badge - Badge object
   */
  async batchAwardBadge(container, badge) {
    try {
      this.showMessage(container, 'Awarding badges...', MESSAGE_TYPES.INFO);
      
      const operations = this.selectedUsers.map(user => 
        this.awardBadgeToUser(user, badge)
      );
      
      const results = await Promise.allSettled(operations);
      const success = results.filter(r => r.status === 'fulfilled').length;
      
      this.showMessage(
        container, 
        `✅ Awarded badge to ${success} users`, 
        MESSAGE_TYPES.SUCCESS
      );
    } catch (error) {
      console.error('Batch badge award failed:', error);
      this.showMessage(container, '❌ Badge award failed. Please try again.', MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * Awards badge to a single user
   * @param {Object} user - User object
   * @param {Object} badge - Badge object with id, name, icon, etc.
   */
  async awardBadgeToUser(user, badge) {
    const { data: progressData } = await this.supabase
      .from('user_progress')
      .select('payload')
      .eq('user_id', user.id)
      .single();

    const currentPayload = progressData?.payload || {};
    const badges = currentPayload.badges || [];
    
    // Check if badge already exists
    if (badges.find(b => b.id === badge.id)) {
      return; // Skip if already has badge
    }
    
    // Add complete badge data
    badges.push({
      id: badge.id,
      name: badge.name,
      icon: badge.icon,
      description: badge.description,
      xp: badge.xp,
      rarity: badge.rarity,
      date: new Date().toISOString(),
      unlocked: true
    });

    const { error } = await this.supabase
      .from('user_progress')
      .update({ 
        payload: { ...currentPayload, badges },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;

    // Send notification
    await this.sendPushNotificationToUser(
      user.id,
      '🎖️ New Badge Earned!',
      `You received the ${badge.name} badge from Aanandoham!`
    );
  }

  /**
   * Sends message to selected users
   * @param {HTMLElement} container - Main container element
   * @param {string} title - Message title
   * @param {string} content - Message content
   */
  async batchSendMessage(container, title, content) {
    try {
      this.showMessage(container, 'Sending messages...', MESSAGE_TYPES.INFO);
      
      const operations = this.selectedUsers.map(user => 
        this.sendMessageToUser(user, title, content)
      );
      
      const results = await Promise.allSettled(operations);
      const success = results.filter(r => r.status === 'fulfilled').length;
      
      this.showMessage(
        container, 
        `✅ Sent message to ${success} users`, 
        MESSAGE_TYPES.SUCCESS
      );
      
      // Clear form
      container.querySelector('#messageTitle').value = '';
      container.querySelector('#messageContent').value = '';
    } catch (error) {
      console.error('Batch message send failed:', error);
      this.showMessage(container, '❌ Message send failed. Please try again.', MESSAGE_TYPES.ERROR);
    }
  }

  /**
   * Sends message to a single user
   * @param {Object} user - User object
   * @param {string} title - Message title
   * @param {string} content - Message content
   */
  async sendMessageToUser(user, title, content) {
    const { data: progressData } = await this.supabase
      .from('user_progress')
      .select('payload')
      .eq('user_id', user.id)
      .single();

    const currentPayload = progressData?.payload || {};
    const messages = currentPayload.adminMessages || [];
    
    messages.push({
      id: Date.now() + Math.random(),
      title,
      content,
      date: new Date().toISOString(),
      read: false
    });

    const { error } = await this.supabase
      .from('user_progress')
      .update({ 
        payload: { ...currentPayload, adminMessages: messages },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) throw error;

    // Send notification
    const truncatedContent = content.substring(0, CONSTANTS.NOTIFICATION_TRUNCATE) + 
                            (content.length > CONSTANTS.NOTIFICATION_TRUNCATE ? '...' : '');
    
    await this.sendPushNotificationToUser(
      user.id,
      `💬 ${title}`,
      truncatedContent
    );
  }

  // ==========================================================================
  // NOTIFICATION SYSTEM
  // ==========================================================================

  /**
   * Sends notification for XP/Karma update
   * @param {string} userId - User ID
   * @param {number} xp - XP amount
   * @param {number} karma - Karma amount
   */
  async notifyUserUpdate(userId, xp, karma) {
    const messages = [];
    if (xp > 0) messages.push(`+${xp} XP`);
    if (karma > 0) messages.push(`+${karma} Karma`);
    
    if (messages.length === 0) return;
    
    await this.sendPushNotificationToUser(
      userId,
      '🎁 Aanandoham\'s Gift!',
      `You received ${messages.join(' and ')} from Aanandoham!`
    );
  }

  /**
   * Sends push notification to a specific user
   * @param {string} userId - User ID
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   */
  async sendPushNotificationToUser(userId, title, body) {
    try {
      const { data: subs, error } = await this.supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId);

      if (error) throw error;
      if (!subs || subs.length === 0) return;

      // Send to all user's subscribed devices
      const notificationPromises = subs.map(subData => 
        fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sub: subData.subscription,
            payload: {
              title,
              body,
              icon: CONSTANTS.NOTIFICATION_ICON,
              data: { url: '/' }
            }
          })
        }).catch(err => console.error('Failed to send notification:', err))
      );

      await Promise.allSettled(notificationPromises);
    } catch (error) {
      console.error('Error fetching user subscriptions:', error);
    }
  }

  // ==========================================================================
  // UI FEEDBACK
  // ==========================================================================

  /**
   * Displays message to user
   * @param {HTMLElement} container - Main container element
   * @param {string} text - Message text
   * @param {string} type - Message type (success/error/info)
   */
  showMessage(container, text, type) {
    const msgDiv = this.elements.message || container.querySelector('#message');
    if (!msgDiv) return;

    const colors = {
      [MESSAGE_TYPES.SUCCESS]: { bg: 'rgba(0,255,0,0.1)', text: '#00ff00' },
      [MESSAGE_TYPES.ERROR]: { bg: 'rgba(255,0,0,0.1)', text: '#ff4757' },
      [MESSAGE_TYPES.INFO]: { bg: 'rgba(102,126,234,0.1)', text: 'var(--neuro-text)' }
    };

    const color = colors[type] || colors[MESSAGE_TYPES.INFO];
    
    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
    msgDiv.style.background = color.bg;
    msgDiv.style.color = color.text;

    // Auto-hide success/error messages
    if (type !== MESSAGE_TYPES.INFO) {
      setTimeout(() => {
        msgDiv.style.display = 'none';
      }, CONSTANTS.MESSAGE_TIMEOUT);
    }
  }

  /**
   * Displays error message
   * @param {HTMLElement} container - Main container element
   * @param {string} text - Error message
   */
  showError(container, text) {
    this.showMessage(container, text, MESSAGE_TYPES.ERROR);
  }
}