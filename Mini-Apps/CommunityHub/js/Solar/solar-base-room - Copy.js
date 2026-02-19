/**
 * SOLAR-BASE-ROOM.JS
 * Base implementation for all seasonal solar practice rooms
 * Contains all shared logic to eliminate code duplication
 */

const BaseSolarRoom = {
  // Default structure (will be overridden by specific rooms)
  config: {},
  userData: {},
  practices: {},
  prebuiltAffirmations: [],
  
  isActive: false,
  startDate: null,
  endDate: null,
  collectiveTimer: null,
  eventListeners: [], // ✅ ADDED: Track event listeners for cleanup
  saveDebounceTimer: null, // ✅ ADDED: Debounced saves

  // ============================================================================
  // CONSTANTS
  // ============================================================================
  
  CONSTANTS: {
    MAX_INTENTION_LENGTH: 500,
    MAX_AFFIRMATION_LENGTH: 300,
    MAX_RELEASE_LIST_LENGTH: 1000,
    SAVE_DEBOUNCE_MS: 500
  },

  // ============================================================================
  // UTILITY METHODS (Lunar-style architecture)
  // ============================================================================

  /**
   * Sanitize user input to prevent XSS
   * @param {string} input - Raw user input
   * @returns {string} Sanitized input
   */
  _sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .slice(0, 1000) // Max length
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '');
  },

  /**
   * Escape HTML for safe display
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  _escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Remove event listeners for cleanup
   */
  _removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    });
    this.eventListeners = [];
  },

  /**
   * Clear active timer
   */
  _clearTimer() {
    if (this.collectiveTimer) {
      clearInterval(this.collectiveTimer);
      this.collectiveTimer = null;
    }
  },

  /**
   * Cleanup method called before room destruction
   */
  cleanup() {
    this._clearTimer();
    this._removeEventListeners();
    if (this.saveDebounceTimer) {
      clearTimeout(this.saveDebounceTimer);
      this.saveDebounceTimer = null;
    }
  },

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize the room
   */
  init() {
    try {
      console.log(`🌞 ${this.config.displayName} Solar Room initialized`);
      this.checkIfActive();
      if (this.isActive) {
        this.calculateDates();
        this.loadData();
      }
    } catch (error) {
      console.error(`${this.config.displayName} init error:`, error);
    }
  },

  /**
   * Check if season is currently active
   * Handles year-spanning seasons (like Winter: Dec 21 - Feb 19)
   */
  checkIfActive() {
    // FIXED: Check for DEV_MODE first
    if (window.Core && window.Core.config && window.Core.config.DEV_MODE) {
      this.isActive = true;
      console.log(`🔧 DEV MODE: ${this.config.displayName} room force-enabled`);
      return;
    }

    const now = new Date();
    const { startMonth, startDay, endMonth, endDay } = this.config;
    
    // Check if season spans year boundary (e.g., Winter: Dec to Feb)
    if (startMonth > endMonth) {
      this.isActive = (
        (now.getMonth() === startMonth && now.getDate() >= startDay) ||
        (now.getMonth() > startMonth) ||
        (now.getMonth() < endMonth) ||
        (now.getMonth() === endMonth && now.getDate() <= endDay)
      );
    } else {
      // Standard season within same year
      this.isActive = (
        (now.getMonth() === startMonth && now.getDate() >= startDay) ||
        (now.getMonth() > startMonth && now.getMonth() < endMonth) ||
        (now.getMonth() === endMonth && now.getDate() <= endDay)
      );
    }
  },

  /**
   * Calculate start and end dates for current season
   * Handles year-spanning seasons correctly
   */
  calculateDates() {
    const year = new Date().getFullYear();
    const now = new Date();
    
    this.startDate = new Date(year, this.config.startMonth, this.config.startDay);
    
    // Handle year-spanning seasons
    if (this.config.startMonth > this.config.endMonth) {
      // If we're in the early months (Jan, Feb), the season started last year
      if (now.getMonth() < this.config.startMonth) {
        this.startDate = new Date(year - 1, this.config.startMonth, this.config.startDay);
        this.endDate = new Date(year, this.config.endMonth, this.config.endDay);
      } else {
        // We're in late months (Dec), season ends next year
        this.endDate = new Date(year + 1, this.config.endMonth, this.config.endDay);
      }
    } else {
      // Normal season
      this.endDate = new Date(year, this.config.endMonth, this.config.endDay);
    }
  },

  /**
   * Load saved user data from localStorage
   */
  loadData() {
    const saved = SolarUIManager.storage.get(this.config.name);
    if (saved && new Date(saved.seasonStartDate).getTime() === this.startDate.getTime()) {
      this.userData = saved.data;
    }
  },

  /**
   * Save user data to localStorage
   */
  saveData() {
    const success = SolarUIManager.storage.set(this.config.name, {
      seasonStartDate: this.startDate.toISOString(),
      data: this.userData
    });
    
    if (!success) {
      SolarUIManager.showToast('⚠️ Could not save data. Check storage limits.');
    }
  },

  /**
   * Enter the practice room
   */
  enterRoom() {
    // FIXED: In DEV_MODE, always allow entry
    const devMode = window.Core && window.Core.config && window.Core.config.DEV_MODE;
    
    if (!this.isActive && !devMode) {
      SolarUIManager.showToast(`${this.config.emoji} ${this.config.displayName} room opens during ${this.config.displayName.toLowerCase()} season`);
      return;
    }

    // FIXED: Force dates calculation even in DEV_MODE
    if (devMode && !this.startDate) {
      this.calculateDates();
    }

    if (window.Core && window.Core.navigateTo) {
      window.Core.navigateTo('practiceRoomView');
    }

    // Add solar room background class
    document.body.classList.add('solar-room-active');

    this.renderDashboard();
    window.scrollTo(0, 0);

    // ── Supabase presence ──────────────────────────────────────────────
    this._setPresence();

    // ── Load collective words from DB ──────────────────────────────────
    this._loadCollectiveWords();
  },

  /**
   * Render the main dashboard
   */
  renderDashboard() {
    const container = document.getElementById('dynamicRoomContent');
    if (!container) {
      console.error('dynamicRoomContent container not found');
      return;
    }

    document.body.setAttribute('data-season', this.config.name);
    window.currentSolarRoom = this;

    const daysRemaining = SolarUIManager.utils.calculateDaysRemaining(this.endDate);
    const presenceCount = SolarUIManager.utils.getRandomPresenceCount();
    const daysText = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`;
    const imageUrl = `${SOLAR_CONSTANTS.IMAGE_BASE_URL}${this.config.displayName}.png`;

    container.innerHTML = `
      <div class="solar-room-bg">
      <div class="solar-floating-bg">
        ${SolarUIManager.utils.generateFloatingElements(this.config.floatingEmojis)}
      </div>
      
      ${SolarUIManager.renderers.topBar({
        seasonName: this.config.displayName,
        emoji: this.config.emoji,
        daysText,
        livingPresenceCount: presenceCount
      })}
      
      <div class="solar-content-wrapper">
        <div class="solar-sun-visual">
          <div class="solar-sun-glow">
            <div class="solar-sun-sphere"></div>
          </div>
        </div>
        
        <div class="solar-intro-card">
          <img src="${imageUrl}" 
               alt="${this.config.displayName} Season" 
               class="solar-season-img"
               loading="lazy">
          <p>${this.config.wisdom}</p>
        </div>
        
        ${SolarUIManager.renderers.modeToggle()}
        
        <div id="soloContent" class="solar-mode-content">
          <div class="solar-mode-description">
            <h3>Your Sacred Space</h3>
            <p>${this.config.modeDescription || 'Individual practices for this season'}</p>
          </div>
          
          <div class="solar-practices-grid" id="practicesGrid">
            ${Object.values(this.practices).map(p => 
              SolarUIManager.renderers.practiceCard(p, this.isPracticeLocked(p))
            ).join('')}
          </div>
          
          ${SolarUIManager.renderers.savedInputs(this.userData, this.config.displayName)}
        </div>
        
        <div id="groupContent" class="solar-mode-content" style="display: none;">
          ${SolarUIManager.renderers.groupPractice({
            seasonEmoji: this.config.seasonEmoji,
            seasonName: this.config.displayName,
            presenceCount,
            itemEmoji: this.config.itemEmoji,
            sessionTimes: this.config.sessionTimes,
            collectiveFocus: this.config.collectiveFocus,
            collectiveNoun: this.config.collectiveNoun
          })}
        </div>
        
        ${daysRemaining <= 7 ? SolarUIManager.renderers.closureSection() : ''}
      </div>
      </div>
    `;
    
    // ✅ ADDED: Attach event listeners with delegation (Lunar-style)
    this._attachEventListeners(container);
  },

  /**
   * Attach event listeners using delegation (Lunar-style architecture)
   * @param {HTMLElement} container - Container element
   */
  _attachEventListeners(container) {
    try {
      // Remove old listeners
      this._removeEventListeners();

      // Practice card clicks
      const practicesGrid = container.querySelector('#practicesGrid');
      if (practicesGrid) {
        const handlePracticeClick = (e) => {
          const card = e.target.closest('.solar-practice-card');
          if (!card) return;

          const practiceId = card.dataset.practice;
          const isLocked = card.dataset.locked === 'true';

          if (isLocked) {
            SolarUIManager.showToast('⚠️ Complete the first practice to unlock others');
          } else {
            this.showPracticePopup(practiceId);
          }
        };

        practicesGrid.addEventListener('click', handlePracticeClick);
        this.eventListeners.push({ 
          element: practicesGrid, 
          event: 'click', 
          handler: handlePracticeClick 
        });
      }

      // Mode toggle buttons
      const handleModeToggle = (e) => {
        const btn = e.target.closest('.solar-mode-btn');
        if (!btn) return;

        const mode = btn.dataset.mode;
        if (mode) {
          SolarUIManager.switchMode(mode);
        }
      };

      const modeToggle = container.querySelector('.solar-mode-toggle');
      if (modeToggle) {
        modeToggle.addEventListener('click', handleModeToggle);
        this.eventListeners.push({ 
          element: modeToggle, 
          event: 'click', 
          handler: handleModeToggle 
        });
      }

      // Closure button
      const closureBtn = container.querySelector('[data-action="submit-closure"]');
      if (closureBtn) {
        const handleClosure = () => this.submitClosure();
        closureBtn.addEventListener('click', handleClosure);
        this.eventListeners.push({ 
          element: closureBtn, 
          event: 'click', 
          handler: handleClosure 
        });
      }

    } catch (error) {
      console.error('Error attaching event listeners:', error);
    }
  },

  /**
   * Check if a practice should be locked
   * Override this method in specific rooms for custom logic
   */
  isPracticeLocked(practice) {
    // Default: no practices are locked
    return false;
  },

  /**
   * Get practice content by ID
   * Routes to specific content getter methods
   */
  getPracticeContent(practiceId) {
    // Convert practiceId to method name (e.g., 'intentionPlanting' -> 'getIntentionPlantingContent')
    const methodName = 'get' + practiceId.charAt(0).toUpperCase() + practiceId.slice(1) + 'Content';
    
    if (typeof this[methodName] === 'function') {
      return this[methodName]();
    }
    
    console.error(`Content method ${methodName} not found for practice ${practiceId}`);
    return `
      <div class="solar-popup-section">
        <p>Practice content not available.</p>
      </div>
    `;
  },

  /**
   * Show practice popup
   */
  showPracticePopup(practiceId) {
    try {
      const practice = this.practices[practiceId];
      if (!practice) {
        console.error(`Practice ${practiceId} not found`);
        return;
      }

      const popup = document.createElement('div');
      popup.id = 'practicePopup';
      popup.innerHTML = SolarUIManager.renderers.popup({
        title: practice.title,
        content: this.getPracticeContent(practiceId),
        hasSaveButton: practice.hasSaveData,
        saveAction: `window.currentSolarRoom.savePractice('${practiceId}')`
      });
      
      const _popupTarget = document.getElementById('communityHubFullscreenContainer') || document.body;
      _popupTarget.appendChild(popup);
      
      // ✅ ADDED: Attach event listeners for affirmation buttons
      this._attachPopupListeners(popup, practiceId);
      
    } catch (error) {
      console.error('Error showing practice popup:', error);
    }
  },

  /**
   * Attach event listeners to popup (Lunar-style)
   * @param {HTMLElement} popup - Popup element
   * @param {string} practiceId - Practice ID
   */
  _attachPopupListeners(popup, practiceId) {
    try {
      // Affirmation button clicks
      const affirmationButtons = popup.querySelectorAll('.solar-affirmation-btn');
      if (affirmationButtons.length > 0) {
        affirmationButtons.forEach(btn => {
          btn.addEventListener('click', () => {
            const affirmationText = btn.dataset.affirmation;
            const textarea = document.getElementById('affirmationText');
            if (textarea) {
              textarea.value = affirmationText;
            }
          });
        });
      }

      // Save button (if has save data)
      const saveBtn = popup.querySelector('[data-action="save-practice"]');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.savePractice(practiceId));
      }

      // Close buttons (both X and footer button)
      const closeButtons = popup.querySelectorAll('[data-action="close-popup"]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => SolarUIManager.closePracticePopup());
      });
      
    } catch (error) {
      console.error('Error attaching popup listeners:', error);
    }
  },

  /**
   * Save practice data with sanitization (Lunar-style)
   * Override this method in specific rooms for custom save logic
   */
  savePractice(practiceId) {
    try {
      const practice = this.practices[practiceId];
      if (!practice || !practice.hasSaveData) return;
      
      // Get form elements
      const intentionEl = document.getElementById('intentionText');
      const affirmationEl = document.getElementById('affirmationText');
      const releaseListEl = document.getElementById('releaseListText');
      
      if (!intentionEl && !affirmationEl && !releaseListEl) {
        SolarUIManager.showToast('⚠️ Form elements not found');
        return;
      }
      
      // ✅ ADDED: Sanitize all inputs (Lunar-style security)
      if (intentionEl) {
        this.userData.intention = this._sanitizeInput(intentionEl.value);
      }
      if (affirmationEl) {
        this.userData.affirmation = this._sanitizeInput(affirmationEl.value);
      }
      if (releaseListEl) {
        this.userData.releaseList = this._sanitizeInput(releaseListEl.value);
      }
      
      this.userData.practiceCount++;
      this.saveData();
      
      SolarUIManager.showToast('✅ Practice saved');
      SolarUIManager.closePracticePopup();
      this.renderDashboard();
      
    } catch (error) {
      console.error('Error saving practice:', error);
      SolarUIManager.showToast('⚠️ Failed to save practice');
    }
  },

  /**
   * Submit season closure reflection
   */
  submitClosure() {
    const reflectionEl = document.getElementById('closureReflection');
    if (!reflectionEl) {
      SolarUIManager.showToast('⚠️ Reflection field not found');
      return;
    }
    
    const reflection = reflectionEl.value.trim();
    
    if (!reflection) {
      SolarUIManager.showToast('Please write your closing reflection');
      return;
    }
    
    if (reflection.length < SOLAR_CONSTANTS.MIN_REFLECTION_LENGTH) {
      SolarUIManager.showToast(`Please write at least ${SOLAR_CONSTANTS.MIN_REFLECTION_LENGTH} characters`);
      return;
    }

    this.userData.closureReflection = reflection;
    this.userData.completedDate = new Date().toISOString();
    this.saveData();

    SolarUIManager.showToast(`${this.config.emoji} ${this.config.displayName} season complete. Rest well until the next cycle.`);
    
    // Reinitialize to reset for next cycle
    setTimeout(() => this.init(), 1000);
  },

  // ============================================================================
  // GROUP CIRCLE / COLLECTIVE PRACTICE METHODS
  // ============================================================================

  /**
   * Show collective practice popup (Group Circle entry point)
   */
  showCollectiveIntentionPopup() {
    try {
      const popup = document.createElement('div');
      popup.id = 'collectivePopup';
      popup.className = 'solar-practice-popup';
      
      popup.innerHTML = `
        <div class="solar-popup-overlay" onclick="event.target.closest('#collectivePopup').remove()">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2>${this.config.seasonEmoji} ${this.config.displayName} Group Circle</h2>
              <button class="solar-popup-close" onclick="document.getElementById('collectivePopup').remove()">×</button>
            </div>
            <div class="solar-popup-body" id="collectiveIntentionContent">
              ${this._renderCollectiveStep1()}
            </div>
          </div>
        </div>
      `;
      
      const _popupTarget = document.getElementById('communityHubFullscreenContainer') || document.body;
      _popupTarget.appendChild(popup);
      
    } catch (error) {
      console.error('Error showing collective popup:', error);
    }
  },

  /**
   * Render Step 1: Welcome
   */
  _renderCollectiveStep1() {
    const presenceCount = SolarUIManager.utils.getRandomPresenceCount();
    
    return `
      <div class="solar-popup-section" style="text-align: center;">
        <div class="solar-live-badge" style="margin-bottom: 2rem;">
          <div class="solar-pulse-dot"></div>
          <span>${presenceCount} practitioners in circle now</span>
        </div>
        
        <h3>Welcome to the ${this.config.displayName} Circle</h3>
        <p style="margin: 1.5rem 0;">
          This is a shared practice for ${this.config.collectiveFocus || 'seasonal alignment'}.
        </p>
        
        <p>You will be guided through 5 steps:</p>
        <ol style="text-align: left; max-width: 500px; margin: 2rem auto; line-height: 1.8;">
          <li>Silent meditation (3 minutes)</li>
          <li>Write your private seasonal intention</li>
          <li>Choose one word for the collective field</li>
          <li>Witness the collective ${this.config.collectiveNoun || 'energy'}</li>
          <li>Silent witnessing (2 minutes)</li>
        </ol>
        
        <button class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep2()">
          Begin Practice
        </button>
      </div>
    `;
  },

  /**
   * Step 2: Meditation
   */
  startCollectiveStep2() {
    try {
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      
      content.innerHTML = `
        <div class="solar-popup-section" style="text-align: center;">
          <h3>Step 1: Silent Meditation</h3>
          <p>Take 3 minutes to center yourself in the ${this.config.displayName} energy.</p>
          <div id="meditationTimer" class="solar-timer-display">
            3:00
          </div>
          <button id="startMeditationBtn" class="solar-popup-btn" 
                  onclick="window.currentSolarRoom.startMeditationTimer()">
            Begin Meditation
          </button>
          <button id="skipToIntentionBtn" class="solar-popup-btn solar-btn-secondary" 
                  onclick="window.currentSolarRoom.startCollectiveStep3()" 
                  style="display: none; margin-top: 1rem;">
            Continue to Intention
          </button>
        </div>
      `;
      
    } catch (error) {
      console.error('Error starting step 2:', error);
    }
  },

  /**
   * Start meditation timer
   */
  startMeditationTimer() {
    try {
      const startBtn = document.getElementById('startMeditationBtn');
      if (startBtn) startBtn.style.display = 'none';
      
      let timeLeft = 180; // 3 minutes
      const timerDisplay = document.getElementById('meditationTimer');
      const skipBtn = document.getElementById('skipToIntentionBtn');
      
      if (!timerDisplay) return;
      
      this.collectiveTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
          clearInterval(this.collectiveTimer);
          this.collectiveTimer = null;
          timerDisplay.textContent = 'Complete';
          if (skipBtn) {
            skipBtn.textContent = 'Continue to Intention';
            skipBtn.style.display = 'block';
          }
        }
      }, 1000);
      
      // Show skip button after 10 seconds
      setTimeout(() => {
        if (skipBtn) skipBtn.style.display = 'block';
      }, 10000);
      
    } catch (error) {
      console.error('Error starting meditation timer:', error);
      if (this.collectiveTimer) {
        clearInterval(this.collectiveTimer);
        this.collectiveTimer = null;
      }
    }
  },

  /**
   * Step 3: Private Intention
   */
  startCollectiveStep3() {
    try {
      if (this.collectiveTimer) {
        clearInterval(this.collectiveTimer);
        this.collectiveTimer = null;
      }
      
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      
      content.innerHTML = `
        <div class="solar-popup-section">
          <h3>Step 2: Your Private Intention</h3>
          <p>Set a personal intention for this ${this.config.displayName} season. This remains private.</p>
          <textarea id="privateIntentionText" 
                    class="solar-textarea" 
                    placeholder="This ${this.config.displayName}, I intend to..."
                    maxlength="500"
                    style="min-height: 120px; margin: 1.5rem 0;"></textarea>
          <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.7);">
            This intention is for you alone. It will not be shared.
          </p>
        </div>
        
        <div class="solar-popup-footer">
          <button class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep4()">
            Continue
          </button>
        </div>
      `;
      
    } catch (error) {
      console.error('Error starting step 3:', error);
    }
  },

  /**
   * Step 4: Collective Word
   */
  startCollectiveStep4() {
    try {
      const intentionEl = document.getElementById('privateIntentionText');
      if (intentionEl) {
        this.userData.privateIntention = intentionEl.value.trim();
      }
      
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      
      content.innerHTML = `
        <div class="solar-popup-section">
          <h3>Step 3: Share One Word</h3>
          <p>Choose a single word that captures your ${this.config.displayName} energy or intention.</p>
          <p style="font-size: 0.9rem; color: rgba(224, 224, 255, 0.7); margin-bottom: 1.5rem;">
            This word will be shared with the collective field.
          </p>
          
          <input type="text" 
                 id="collectiveWordInput" 
                 class="solar-input"
                 placeholder="Your word..."
                 maxlength="50"
                 style="font-size: 1.2rem; padding: 1rem; text-align: center; margin: 1rem 0; width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text);">
          
          <p style="font-size: 0.85rem; color: rgba(224, 224, 255, 0.6); margin-top: 0.5rem;">
            Examples: Growth, Rest, Joy, Clarity, Strength, Peace
          </p>
        </div>
        
        <div class="solar-popup-footer">
          <button class="solar-popup-btn" onclick="window.currentSolarRoom.submitWordToCollective()">
            Add to Circle
          </button>
        </div>
      `;
      
    } catch (error) {
      console.error('Error starting step 4:', error);
    }
  },

  /**
   * Submit word and show collective field
   */
  submitWordToCollective() {
    try {
      const wordInput = document.getElementById('collectiveWordInput');
      const word = wordInput ? wordInput.value.trim() : '';
      
      if (!word) {
        SolarUIManager.showToast('Please enter a word');
        return;
      }
      
      if (word.length > 50) {
        SolarUIManager.showToast('Word is too long');
        return;
      }
      
      this.userData.collectiveWord = word;
      this.userData.intentionShared = true;

      // ── Persist to Supabase ────────────────────────────────────────────
      if (window.CommunityDB && CommunityDB.ready) {
        const collectiveRoomId = `${this._getSolarRoomId()}-collective`;
        CommunityDB.sendRoomMessage(collectiveRoomId, word).catch(err => {
          console.error('[BaseSolarRoom] submitWordToCollective DB error:', err);
        });
      }
      
      this.startCollectiveStep5();
      
    } catch (error) {
      console.error('Error submitting word:', error);
    }
  },

  /**
   * Step 5: Witness collective field
   */
  startCollectiveStep5() {
    try {
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      
      // PATCHED: prefer words loaded from DB, fall back to mock
      const words = (this._dbCollectiveWords && this._dbCollectiveWords.length > 0)
        ? this._dbCollectiveWords
        : this._getMockCollectiveWords();
      const wordCloudHTML = this._renderWordCloud(words);
      const totalWords = words.length;
      
      content.innerHTML = `
        <div class="solar-popup-section" style="text-align: center;">
          <h3>Step 4: The Collective ${this.config.displayName} Field</h3>
          <p>These are the ${this.config.collectiveNoun || 'intentions'} planted by practitioners in this circle.</p>
        </div>
        
        <div id="wordCloud" style="padding: 2rem; margin: 2rem 0; background: rgba(255,255,255,0.03); border-radius: 12px; min-height: 200px; display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; justify-content: center;">
          ${wordCloudHTML}
        </div>
        
        <p style="text-align: center; font-size: 0.9rem; color: rgba(224, 224, 255, 0.7); margin-bottom: 2rem;">
          <strong>${totalWords}</strong> ${this.config.collectiveNoun || 'intentions'} in this ${this.config.displayName} cycle
        </p>
        
        <div style="margin: 2rem 0;">
          <h4 style="text-align: center; margin-bottom: 1rem;">Step 5: Silent Witnessing (2 min)</h4>
          <div id="witnessingTimer" class="solar-timer-display">
            2:00
          </div>
          <button id="startWitnessingBtn" class="solar-popup-btn" 
                  onclick="window.currentSolarRoom.startWitnessingTimer()">
            Begin Silent Witnessing
          </button>
          <button id="completeBtn" class="solar-popup-btn" 
                  onclick="window.currentSolarRoom.completeCollectivePractice()" 
                  style="display: none; margin-top: 1rem; background: var(--season-accent); color: white;">
            Complete Practice
          </button>
        </div>
      `;
      
    } catch (error) {
      console.error('Error starting step 5:', error);
    }
  },

  /**
   * Start witnessing timer
   */
  startWitnessingTimer() {
    try {
      const startBtn = document.getElementById('startWitnessingBtn');
      if (startBtn) startBtn.style.display = 'none';
      
      let timeLeft = 120; // 2 minutes
      const timerDisplay = document.getElementById('witnessingTimer');
      
      if (!timerDisplay) return;
      
      this.collectiveTimer = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
          clearInterval(this.collectiveTimer);
          this.collectiveTimer = null;
          timerDisplay.textContent = 'Complete';
          const completeBtn = document.getElementById('completeBtn');
          if (completeBtn) {
            completeBtn.style.display = 'block';
          }
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error starting witnessing timer:', error);
      if (this.collectiveTimer) {
        clearInterval(this.collectiveTimer);
        this.collectiveTimer = null;
      }
    }
  },

  /**
   * Complete collective practice
   */
  completeCollectivePractice() {
    try {
      this.userData.practiceCount++;
      this.saveData();
      
      SolarUIManager.showToast(`${this.config.seasonEmoji} ${this.config.collectiveNoun || 'Intention'} planted with the collective`);
      
      const popup = document.getElementById('collectivePopup');
      if (popup) popup.remove();
      
      this.renderDashboard();
      
    } catch (error) {
      console.error('Error completing collective practice:', error);
    }
  },

  /**
   * Get mock collective words (replace with API call in production)
   */
  _getMockCollectiveWords() {
    // Season-specific word sets
    const seasonWords = {
      spring: ['Growth', 'Renewal', 'Hope', 'Bloom', 'Energy', 'Fresh', 'Vitality', 'Emerge', 'Awaken', 'Begin'],
      summer: ['Radiance', 'Joy', 'Abundance', 'Vibrant', 'Expansion', 'Bright', 'Celebrate', 'Fullness', 'Alive', 'Shine'],
      autumn: ['Harvest', 'Gratitude', 'Release', 'Balance', 'Gather', 'Wisdom', 'Reflection', 'Abundance', 'Thanks', 'Ripen'],
      winter: ['Rest', 'Stillness', 'Peace', 'Wisdom', 'Quiet', 'Restore', 'Deep', 'Calm', 'Reflection', 'Inner']
    };
    
    const words = seasonWords[this.config.name] || seasonWords.spring;
    const now = Date.now();
    
    return words.map((word, i) => ({
      word,
      timestamp: now - (i * 3600000) // 1 hour apart
    }));
  },

  // ============================================================================
  // SUPABASE INTEGRATION HELPERS (PRIVATE)
  // ============================================================================

  /**
   * Derive the Supabase/DB room_id for this solar season.
   * @private
   * @returns {string} e.g. 'spring-solar'
   */
  _getSolarRoomId() {
    return `${this.config.name}-solar`;
  },

  /**
   * Update Supabase presence to show user is in this solar room.
   * @private
   */
  _setPresence() {
    if (!window.CommunityDB || !CommunityDB.ready) return;
    try {
      const roomId   = this._getSolarRoomId();
      const activity = `${this.config.emoji} ${this.config.displayName}`;
      CommunityDB.setPresence('online', activity, roomId);

      if (window.Core?.state) {
        Core.state.currentRoom = roomId;
        if (Core.state.currentUser) Core.state.currentUser.activity = activity;
      }
    } catch (err) {
      console.error('[BaseSolarRoom] _setPresence error:', err);
    }
  },

  /**
   * Reset Supabase presence back to "available at hub".
   * @private
   */
  _clearPresence() {
    if (!window.CommunityDB || !CommunityDB.ready) return;
    try {
      CommunityDB.setPresence('online', '✨ Available', null);

      if (window.Core?.state) {
        Core.state.currentRoom = null;
        if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
      }
    } catch (err) {
      console.error('[BaseSolarRoom] _clearPresence error:', err);
    }
  },

  /**
   * Load collective words from Supabase for this season.
   * Falls back to mock data if DB unavailable.
   * Populates this._dbCollectiveWords for use in startCollectiveStep5.
   * @private
   */
  async _loadCollectiveWords() {
    if (!window.CommunityDB || !CommunityDB.ready) return;
    try {
      const collectiveRoomId = `${this._getSolarRoomId()}-collective`;
      const rows = await CommunityDB.getRoomMessages(collectiveRoomId, 100);

      if (rows && rows.length > 0) {
        this._dbCollectiveWords = rows.map(row => ({
          word:      row.message,
          timestamp: new Date(row.created_at).getTime()
        }));
      }
    } catch (err) {
      console.warn('[BaseSolarRoom] _loadCollectiveWords error:', err);
    }
  },

    if (!words || words.length === 0) {
      return '<p style="color: rgba(224,224,255,0.5);">No words yet. Be the first to share.</p>';
    }
    
    return words.map(item => {
      const size = 1 + Math.random() * 1.5; // Random size between 1 and 2.5rem
      const opacity = 0.6 + Math.random() * 0.4; // Random opacity 0.6-1.0
      
      return `
        <span style="font-size: ${size}rem; 
                     opacity: ${opacity}; 
                     color: var(--season-accent, #e0e0ff); 
                     font-weight: 600; 
                     display: inline-block; 
                     margin: 0.5rem; 
                     transition: all 0.3s;"
              onmouseover="this.style.transform='scale(1.2)'; this.style.opacity='1';"
              onmouseout="this.style.transform='scale(1)'; this.style.opacity='${opacity}';">
          ${item.word}
        </span>
      `;
    }).join('');
  }
};

window.BaseSolarRoom = BaseSolarRoom;
console.log('🌍 Base Solar Room loaded');