// Features/EnergyTracker.js

/**
 * EnergyEngineEnhanced - Tracks daily energy levels and chakra balance
 * Features: Overall energy tracking, chakra-specific ratings, mood tagging,
 * day/night check-ins, weekly trends, and historical journal
 */
class EnergyEngineEnhanced {
  // Configuration constants
  static CHAKRAS = [
    { key: 'root', name: 'Root', color: '#e04b4b' },
    { key: 'sacral', name: 'Sacral', color: '#f08a4b' },
    { key: 'solar', name: 'Solar', color: '#f6c24a' },
    { key: 'heart', name: 'Heart', color: '#6fcf97' },
    { key: 'throat', name: 'Throat', color: '#5fb7f0' },
    { key: 'thirdEye', name: 'Third Eye', color: '#8b6be6' },
    { key: 'crown', name: 'Crown', color: '#c59ee9' }
  ];

  static MOODS = [
    'grounded', 'anxious', 'calm', 'happy', 'creative', 
    'tired', 'focused', 'grateful', 'curious', 'confident'
  ];

  static MOOD_EMOJIS = {
    grounded: '🌍', anxious: '😰', calm: '😌', happy: '😊',
    creative: '🎨', tired: '😴', focused: '🎯', grateful: '🙏',
    curious: '🤔', confident: '💪'
  };

  static RESIZE_DEBOUNCE = 120;
  static SEARCH_DEBOUNCE = 300;
  static MAX_RENDER_RETRIES = 50;
  static MAX_HISTORY_DISPLAY = 30;
  static DAY_START_HOUR = 5;
  static DAY_END_HOUR = 17;

  constructor(app) {
    this.app = app;
    this.searchQuery = '';
    this.isDestroyed = false;
    this.domCache = {};
    this.resizeTimeout = null;
    this.searchDebounce = null;
    this.boundHandleResize = null;
    this._boundMoodHandler = null;
    
    this.currentCheckin = this.getTodayCheckin();
    this.initializeListeners();
    this.scheduleInitialRender();
  }

  /* ==================== INITIALIZATION ==================== */

  /**
   * Initializes global event listeners
   */
  initializeListeners() {
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.boundHandleResize);
  }

  /**
   * Attempts to render once DOM is ready
   */
  scheduleInitialRender() {
    let retry = 0;
    const attemptRender = () => {
      if (this.isDestroyed) return;
      
      if (document.getElementById('energy-tab')) {
        this.render();
        return;
      }
      
      if (++retry < EnergyEngineEnhanced.MAX_RENDER_RETRIES) {
        requestAnimationFrame(attemptRender);
      }
    };
    requestAnimationFrame(attemptRender);
  }

  /**
   * Handles window resize with debouncing
   */
  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (!this.isDestroyed && document.getElementById('energy-tab')?.offsetParent) {
        this.updateChartsOnly();
      }
    }, EnergyEngineEnhanced.RESIZE_DEBOUNCE);
  }

  /**
   * Updates only charts without full re-render
   */
  updateChartsOnly() {
    const weeklyBox = document.querySelector('.weekly-chart-box');
    const radarContainer = document.querySelector('.chakra-balance-radar');
    
    if (weeklyBox) {
      weeklyBox.innerHTML = this.renderWeeklyChart(this.getWeeklyData());
    }
    if (radarContainer) {
      radarContainer.innerHTML = this.renderRadarChart(this.getChakraAverages(), 200);
    }
  }

  /* ==================== DATA MANAGEMENT ==================== */

  /**
   * Gets today's check-in data or creates default
   * @returns {Object} Check-in data
   */
  getTodayCheckin() {
    try {
      const today = this.getISODate();
      const entries = this.app.state.data.energyEntries || [];
      const todayEntry = entries.find(e => this.getISODate(e.timestamp) === today);
      
      if (todayEntry?.chakras) {
        return {
          overallEnergy: todayEntry.energy || 6,
          moodTags: todayEntry.moodTags || [],
          chakras: todayEntry.chakras,
          notes: todayEntry.notes || '',
          practicesDone: todayEntry.practicesDone || [],
          timestamp: todayEntry.timestamp,
          dayCheckin: todayEntry.dayCheckin || false,
          nightCheckin: todayEntry.nightCheckin || false
        };
      }
      
      return this.createDefaultCheckin();
    } catch (err) {
      console.error('Error loading check-in:', err);
      return this.createDefaultCheckin();
    }
  }

  /**
   * Creates default check-in object
   */
  createDefaultCheckin() {
    return {
      overallEnergy: 6,
      moodTags: [],
      chakras: this.getDefaultChakraSnapshot(),
      notes: '',
      practicesDone: [],
      timestamp: Date.now(),
      dayCheckin: false,
      nightCheckin: false
    };
  }

  /**
   * Creates default chakra values (all set to 5)
   */
  getDefaultChakraSnapshot() {
    const snapshot = {};
    EnergyEngineEnhanced.CHAKRAS.forEach(c => snapshot[c.key] = 5);
    return snapshot;
  }

  /**
   * Gets ISO date string (YYYY-MM-DD)
   * @param {number} timestamp - Optional timestamp
   * @returns {string} ISO date
   */
  getISODate(timestamp = Date.now()) {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }

  /**
   * Gets current time of day information
   * @returns {Object} Period, greeting, and isDay flag
   */
  getTimeOfDayInfo() {
    const hour = new Date().getHours();
    const isDay = hour >= EnergyEngineEnhanced.DAY_START_HOUR && 
                  hour < EnergyEngineEnhanced.DAY_END_HOUR;
    
    let greeting;
    if (hour < 12) greeting = 'morning';
    else if (hour < 18) greeting = 'afternoon';
    else greeting = 'evening';
    
    return {
      period: isDay ? 'day' : 'night',
      greeting,
      isDay
    };
  }

  /**
   * Saves current check-in to state
   * @param {boolean} commit - Whether this is a manual commit
   */
  saveCheckin(commit = false) {
    try {
      const { period } = this.getTimeOfDayInfo();
      const entries = this.app.state.data.energyEntries || [];
      const today = this.getISODate();
      const existingIndex = entries.findIndex(e => this.getISODate(e.timestamp) === today);
      
      // Mark appropriate check-in as complete
      if (period === 'day') {
        this.currentCheckin.dayCheckin = true;
      } else {
        this.currentCheckin.nightCheckin = true;
      }
      
      // Build entry object
      const entry = {
        energy: this.currentCheckin.overallEnergy,
        moodTags: this.currentCheckin.moodTags,
        chakras: this.currentCheckin.chakras,
        notes: this.currentCheckin.notes,
        practicesDone: commit 
          ? [...(this.currentCheckin.practicesDone || []), 'manual']
          : (this.currentCheckin.practicesDone || []),
        timestamp: Date.now(),
        date: today,
        dayCheckin: this.currentCheckin.dayCheckin,
        nightCheckin: this.currentCheckin.nightCheckin,
        timeOfDay: period
      };
      
      // Update or add entry
      if (existingIndex >= 0) {
        // Preserve existing check-in flags
        entry.dayCheckin = entry.dayCheckin || entries[existingIndex].dayCheckin;
        entry.nightCheckin = entry.nightCheckin || entries[existingIndex].nightCheckin;
        entries[existingIndex] = entry;
      } else {
        entries.unshift(entry);
      }
      
      // Save and update
      this.app.state.data.energyEntries = entries;
      this.app.state.saveAppData();
      this.app.state.updateStreak();
      
      // Gamification integration
      if (this.app.gamification) {
        this.app.gamification.progressEnergyCheckin(period);
        this.app.gamification.checkChakraBadges(this.currentCheckin.chakras);
      }
      
      this.app.showToast(
        `✅ ${period === 'day' ? 'Day' : 'Night'} energy check-in saved!`, 
        'success'
      );
      this.render();
      
    } catch (err) {
      console.error('Error saving check-in:', err);
      this.app.showToast('❌ Failed to save check-in', 'error');
    }
  }

  /**
   * Gets energy data for the last 7 days
   * @returns {Array<number>} Array of energy values
   */
  getWeeklyData() {
    const last7Days = [];
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(this.getISODate(date.getTime()));
    }
    
    const entries = this.app.state.data.energyEntries || [];
    
    return last7Days.map(date => {
      const entry = entries.find(e => this.getISODate(e.timestamp) === date);
      return entry ? entry.energy : 0;
    });
  }

  /**
   * Calculates average chakra values across all entries
   * @returns {Object} Average values for each chakra
   */
  getChakraAverages() {
    const entries = this.app.state.data.energyEntries || [];
    if (!entries.length) return this.getDefaultChakraSnapshot();
    
    const totals = {};
    EnergyEngineEnhanced.CHAKRAS.forEach(c => totals[c.key] = 0);
    
    let count = 0;
    entries.forEach(entry => {
      if (entry.chakras) {
        count++;
        EnergyEngineEnhanced.CHAKRAS.forEach(c => {
          totals[c.key] += (entry.chakras[c.key] || 0);
        });
      }
    });
    
    if (!count) return this.getDefaultChakraSnapshot();
    
    const averages = {};
    EnergyEngineEnhanced.CHAKRAS.forEach(c => {
      averages[c.key] = Math.round((totals[c.key] / count) * 10) / 10;
    });
    
    return averages;
  }

  /* ==================== RENDERING ==================== */

  /**
   * Main render method
   */
  render() {
    if (this.isDestroyed) return;
    
    const tab = document.getElementById('energy-tab');
    if (!tab) return;
    
    try {
      const stats = this.app.state.getStats();
      const weeklyData = this.getWeeklyData();
      const chakraAvg = this.getChakraAverages();
      const { period, greeting } = this.getTimeOfDayInfo();
      const checkinStatus = period === 'day' 
        ? this.currentCheckin.dayCheckin 
        : this.currentCheckin.nightCheckin;
      
      tab.innerHTML = this.buildMainHTML(
        stats, 
        weeklyData, 
        chakraAvg, 
        greeting, 
        period, 
        checkinStatus
      );
      
      this.clearDOMCache();
      this.attachEventListeners();
      
    } catch (err) {
      console.error('Render error:', err);
      tab.innerHTML = '<div class="card"><p>Error loading. Please refresh.</p></div>';
    }
  }

  /**
   * Clears DOM element cache
   */
  clearDOMCache() {
    this.domCache = {};
  }

  /**
   * Gets cached DOM element
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  getElement(id) {
    if (!this.domCache[id]) {
      this.domCache[id] = document.getElementById(id);
    }
    return this.domCache[id];
  }

  /**
   * Builds main HTML structure
   */
  buildMainHTML(stats, weeklyData, chakraAvg, greeting, period, checkinStatus) {
    const journalEntries = this.app.state.data.energyEntries || [];
    const filteredJournal = this.filterJournalEntries(journalEntries);

    return `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          ${this.buildHeader()}
          ${this.buildCheckinCard(stats, greeting, period, checkinStatus)}
          ${this.buildReikiCTA()}
          ${this.buildChartsSection(weeklyData, chakraAvg)}
          ${this.buildJournalSection(filteredJournal)}
        </div>
      </div>
      ${this.buildStyles()}
    `;
  }

  /**
   * Filters journal entries by search query
   */
  filterJournalEntries(entries) {
    if (!this.searchQuery) return entries;
    
    const query = this.searchQuery.toLowerCase();
    return entries.filter(e => {
      const notesMatch = (e.notes || '').toLowerCase().includes(query);
      const moodsMatch = (e.moodTags || []).join(' ').toLowerCase().includes(query);
      return notesMatch || moodsMatch;
    });
  }

  /**
   * Builds header HTML
   */
  buildHeader() {
    return `
      <header class="main-header project-curiosity" 
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavEnergy.png');
                     --header-title:'';
                     --header-tag:'Check, review, track and learn your energy patterns - Overall and Chakras'">
        <h1>Energy Tracker</h1>
        <h3>Check, review, track and learn your energy patterns - Overall and Chakras</h3>
      </header>
    `;
  }

  /**
   * Builds Reiki & Chakras Community CTA section
   */
  buildReikiCTA() {
    return `
      <div class="card" style="margin-bottom: 2rem; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
          <span style="font-size: 1.6rem;">🌀</span>
          <h3 style="margin: 0; font-size: 1.15rem; color: var(--neuro-text); font-weight: 700;">
            Learn & Practice Reiki and Chakras with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; color: var(--neuro-text-light); line-height: 1.6;">
          Deepen your energy practice together. Join live sessions, guided meditations,
          and group healing circles — all in one place.
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button
            type="button"
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            style="
              padding: 0.65rem 1.5rem;
              border-radius: 999px;
              border: none;
              background: var(--neuro-bg);
              color: var(--neuro-text);
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 6px 6px 14px var(--neuro-shadow-dark), -6px -6px 14px var(--neuro-shadow-light);
              transition: all 0.2s;
            "
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            🏘️ Enter the Community Hub
          </button>
          <button
            type="button"
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'reiki'; window.app.nav.switchTab('community-hub')"
            style="
              padding: 0.65rem 1.5rem;
              border-radius: 999px;
              border: none;
              background: linear-gradient(135deg, rgba(246,194,74,0.18), rgba(139,107,230,0.18));
              color: var(--neuro-accent);
              font-size: 0.9rem;
              font-weight: 700;
              cursor: pointer;
              box-shadow: inset 4px 4px 8px rgba(0,0,0,.04), inset -4px -4px 8px rgba(255,255,255,.6);
              transition: all 0.2s;
            "
            onmouseover="this.style.transform='translateY(-1px)'"
            onmouseout="this.style.transform='translateY(0)'"
          >
            ✨ Enter the Reiki Room Directly
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Builds check-in card HTML
   */
  buildCheckinCard(stats, greeting, period, checkinStatus) {
    return `
      <div class="card" style="margin-bottom: 2rem;">
        ${this.buildCheckinHeader(stats, greeting, period, checkinStatus)}
        ${this.buildOverallEnergySlider()}
        ${this.buildMoodSelector()}
        ${this.buildChakraSection()}
        ${this.buildNotesSection()}
        ${this.buildActionButtons(period)}
      </div>
    `;
  }

  /**
   * Builds check-in header
   */
  buildCheckinHeader(stats, greeting, period, checkinStatus) {
    return `
      <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
        <div>
          <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">Good ${greeting}</h3>
          <p class="text-sm" style="color:var(--neuro-text-light);">
            Log in your Overall Energy and your Specific Chakras
          </p>
          ${checkinStatus ? `
            <p class="text-sm mt-1" style="color:var(--neuro-success);">
              ✓ ${period === 'day' ? 'Day' : 'Night'} check-in completed
            </p>
          ` : ''}
        </div>
        <div class="text-right">
          <p class="text-sm" style="color:var(--neuro-text-light);">
            ${new Date().toLocaleDateString()}
          </p>
          <p class="text-sm" style="color:var(--neuro-text-light);">
            Streak: ${stats.currentStreak} day(s)
          </p>
          <div class="flex gap-2 mt-2 justify-end text-xs">
            <span class="${this.currentCheckin.dayCheckin ? 'badge badge-success' : 'badge'}" 
                  style="padding:4px 8px;">
              ☀️ Day ${this.currentCheckin.dayCheckin ? '✓' : ''}
            </span>
            <span class="${this.currentCheckin.nightCheckin ? 'badge badge-success' : 'badge'}" 
                  style="padding:4px 8px;">
              🌙 Night ${this.currentCheckin.nightCheckin ? '✓' : ''}
            </span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Builds overall energy slider
   */
  buildOverallEnergySlider() {
    return `
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Overall Energy Level</label>
        <div class="flex items-center gap-4">
          <input type="range" 
                 id="energy-overall-slider" 
                 min="0" 
                 max="10" 
                 step="0.5" 
                 value="${this.currentCheckin.overallEnergy}" 
                 class="flex-1"
                 aria-label="Overall energy level"/>
          <span id="energy-overall-value" 
                class="text-3xl font-bold" 
                style="color:var(--neuro-accent);min-width:3rem;text-align:center;">
            ${this.currentCheckin.overallEnergy}
          </span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-sm" style="color:var(--neuro-text-light);">Low</span>
          <span class="text-sm" style="color:var(--neuro-text-light);">High</span>
        </div>
      </div>
    `;
  }

  /**
   * Builds mood selector chips
   */
  buildMoodSelector() {
    return `
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Current Mood</label>
        <div id="mood-chips" class="flex flex-wrap gap-2">
          ${EnergyEngineEnhanced.MOODS.map(mood => `
            <button class="chip ${this.currentCheckin.moodTags.includes(mood) ? 'active' : ''}" 
                    data-mood="${mood}"
                    type="button">
              ${this.getMoodEmoji(mood)} ${this.capitalize(mood)}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Builds chakra check-in section
   */
  buildChakraSection() {
    return `
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Chakra Check-in</label>
        <div id="chakra-row" class="chakra-row">
          ${this.buildChakraRow()}
        </div>
      </div>
    `;
  }

  /**
   * Builds notes textarea
   */
  buildNotesSection() {
    return `
      <div style="margin-bottom: 2rem;">
        <label for="energy-notes" class="form-label">
          Notes, Thoughts, Emotions, Mood
        </label>
        <textarea id="energy-notes" 
                  class="form-input" 
                  placeholder="Any reflections, situations, or notable events regarding your energies..."
                  aria-label="Energy notes"
        >${this.currentCheckin.notes || ''}</textarea>
      </div>
    `;
  }

  /**
   * Builds action buttons
   */
  buildActionButtons(period) {
    return `
      <div class="flex gap-3 flex-wrap">
        <button id="btn-save-checkin" class="btn btn-primary">
          💾 Save ${period === 'day' ? 'Day' : 'Night'} Check-in
        </button>
        <button id="btn-reset-today" class="btn btn-secondary">
          🔄 Reset Form
        </button>
      </div>
    `;
  }

  /**
   * Builds chakra mini-cards row
   */
  buildChakraRow() {
    return EnergyEngineEnhanced.CHAKRAS.map(chakra => {
      const value = this.currentCheckin.chakras[chakra.key] || 5;
      const intensity = Math.abs(5 - value);
      const pulseSize = Math.min(12, intensity * 2 + 2);
      const pulseOpacity = Math.min(0.48, intensity / 6 + 0.08);
      const pulseHex = Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
      
      return `
        <div class="chakra-mini-card" data-chakra="${chakra.key}">
          <div class="chakra-pulse" 
               style="box-shadow:0 0 ${pulseSize}px ${chakra.color}${pulseHex};
                      opacity:${intensity > 0 ? 1 : 0};
                      transform:scale(${1 + intensity * 0.01})">
          </div>
          <div class="chakra-icon" style="background:${chakra.color}">
            ${chakra.name.charAt(0)}
          </div>
          <div style="font-size:13px;font-weight:700;text-align:center">
            ${chakra.name}
          </div>
          <input type="range" 
                 class="chakra-slider" 
                 data-chakra="${chakra.key}" 
                 min="0" 
                 max="10" 
                 step="0.5" 
                 value="${value}" 
                 style="width:100%"
                 aria-label="${chakra.name} level"/>
          <div class="chakra-value" style="font-size:13px;font-weight:700">
            ${value}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Builds charts section (weekly trend + chakra balance)
   */
  buildChartsSection(weeklyData, chakraAvg) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom: 2rem;">
        <div class="card p-4 card-flex">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">
            Weekly Trend
          </h3>
          <div class="card-body w-full">
            <div class="weekly-chart-box">
              ${this.renderWeeklyChart(weeklyData)}
            </div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">
            Chakra Balance
          </h3>
          <div class="flex justify-center chakra-balance-radar">
            ${this.renderRadarChart(chakraAvg, 200)}
          </div>
          <div class="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
            ${EnergyEngineEnhanced.CHAKRAS.map(c => `
              <div>
                <div class="font-bold" style="color:${c.color};">
                  ${chakraAvg[c.key]}
                </div>
                <div class="text-gray-500">${c.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Builds journal section (collapsible history)
   */
  buildJournalSection(filteredJournal) {
    return `
      <div class="card calc-expandable-card" id="journal-collapsible-card">
        <div class="calc-expandable-header" id="journal-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;
                     text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">
            My Energy Tracker
          </h3>
        </div>
        <div class="calc-expandable-content">
          <div style="margin-bottom: 2rem;">
            <input type="text" 
                   id="journal-search" 
                   class="form-input" 
                   placeholder="Search notes or moods..." 
                   value="${this.searchQuery}"
                   aria-label="Search journal entries"/>
          </div>
          <div class="space-y-4">
            ${this.buildJournalEntries(filteredJournal)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Builds journal entries list
   */
  buildJournalEntries(filteredJournal) {
    if (filteredJournal.length === 0) {
      return `
        <div class="card text-center" style="padding:4rem;">
          <div class="text-7xl" style="margin-bottom: 1rem;">📋</div>
          <p style="color:var(--neuro-text-light);">
            ${this.searchQuery 
              ? 'No entries found matching your search' 
              : 'No journal entries yet. Your check-ins will appear here.'}
          </p>
        </div>
      `;
    }

    const displayEntries = filteredJournal
      .slice(0, EnergyEngineEnhanced.MAX_HISTORY_DISPLAY)
      .map(e => this.renderJournalEntry(e))
      .join('');

    const showMoreMessage = filteredJournal.length > EnergyEngineEnhanced.MAX_HISTORY_DISPLAY
      ? `<div class="text-center mt-6">
           <p class="text-sm" style="color:var(--neuro-text-light);">
             Showing ${EnergyEngineEnhanced.MAX_HISTORY_DISPLAY} most recent entries
           </p>
         </div>`
      : '';

    return displayEntries + showMoreMessage;
  }

  /**
   * Renders a single journal entry
   */
  renderJournalEntry(entry) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const badges = [];
    if (entry.dayCheckin) {
      badges.push('<span class="badge badge-success" style="font-size:0.75rem">☀️ Day</span>');
    }
    if (entry.nightCheckin) {
      badges.push('<span class="badge badge-success" style="font-size:0.75rem">🌙 Night</span>');
    }

    return `
      <div class="card" style="border-left:4px solid var(--neuro-accent)">
        <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
          <div>
            <div class="font-bold text-lg" style="color:var(--neuro-text)">${dateStr}</div>
            <div class="text-sm" style="color:var(--neuro-text-light)">${timeStr}</div>
            ${badges.length ? `<div class="flex gap-2 mt-2">${badges.join('')}</div>` : ''}
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold" style="color:var(--neuro-accent)">${entry.energy}</div>
            <div class="text-sm" style="color:var(--neuro-text-light);">Energy</div>
          </div>
        </div>
        ${this.buildEntryMoodTags(entry)}
        ${this.buildEntryNotes(entry)}
        ${this.buildEntryChakras(entry)}
      </div>
    `;
  }

  /**
   * Builds mood tags for journal entry
   */
  buildEntryMoodTags(entry) {
    if (!entry.moodTags || entry.moodTags.length === 0) return '';
    
    return `
      <div class="flex flex-wrap gap-2" style="margin-bottom: 1rem;">
        ${entry.moodTags.map(mood => `
          <span class="badge" style="font-size:0.85rem">
            ${this.getMoodEmoji(mood)} ${this.capitalize(mood)}
          </span>
        `).join('')}
      </div>
    `;
  }

  /**
   * Builds notes section for journal entry
   */
  buildEntryNotes(entry) {
    if (!entry.notes) return '';
    
    return `
      <div style="color:var(--neuro-text);line-height:1.6;white-space:pre-wrap">
        ${entry.notes}
      </div>
    `;
  }

  /**
   * Builds chakra values for journal entry
   */
  buildEntryChakras(entry) {
    if (!entry.chakras) return '';
    
    return `
      <div class="mt-4 pt-4" style="border-top:1px solid rgba(0,0,0,.05)">
        <div class="text-sm font-bold" style="color:var(--neuro-text-light);margin-bottom: 0.5rem;">
          Chakras:
        </div>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
          ${EnergyEngineEnhanced.CHAKRAS.map(c => `
            <div class="text-center">
              <div class="text-xs" style="color:var(--neuro-text-light);margin-bottom: 0.25rem;">
                ${c.name}
              </div>
              <div class="text-sm font-bold" style="color:${c.color}">
                ${entry.chakras[c.key] || 5}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ==================== CHART RENDERING ==================== */

  /**
   * Renders weekly energy chart as SVG
   * @param {Array<number>} points - Energy values for 7 days
   * @returns {string} SVG markup
   */
  renderWeeklyChart(points) {
    const parent = document.querySelector('#energy-tab .card-body');
    if (!parent) {
      return '<div style="padding:2rem;color:var(--neuro-text-light)">Loading...</div>';
    }

    const WIDTH = parent.clientWidth;
    const HEIGHT = parent.clientHeight;
    const TOP_SPACE = 20;
    const EXTRA_SPACE = 105;
    const VIEW_HEIGHT = HEIGHT + EXTRA_SPACE + TOP_SPACE;
    const NARROW_FACTOR = 0.55;
    const GAP_PERCENT = 0.01;
    const DAY_WIDTH = WIDTH / 7;
    const ROW_HEIGHT = HEIGHT / 10;
    const GAP = DAY_WIDTH * GAP_PERCENT;
    const BAR_WIDTH = DAY_WIDTH * NARROW_FACTOR - GAP;
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Color mapping based on energy value
    const getBarColor = (value) => {
      if (value === 0) return '#e04b4b';
      if (value <= 3) return '#f08a4b';
      if (value <= 6) return '#f6c24a';
      if (value <= 9) return '#6fcf97';
      return '#ffd700';
    };

    // Start SVG
    let svg = `<svg viewBox="0 ${-TOP_SPACE} ${WIDTH} ${VIEW_HEIGHT}" 
                    style="width:100%;height:100%;display:block">`;

    // Grid lines and labels
    for (let row = 0; row <= 10; row += 2) {
      const y = HEIGHT - row * ROW_HEIGHT;
      svg += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" 
                    stroke="rgba(0,0,0,.08)" stroke-width="1"/>`;
      svg += `<text x="6" y="${y + 5}" font-size="14" font-weight="bold" 
                    fill="var(--neuro-text-light)" text-anchor="middle">${row}</text>`;
    }

    // Bars
    points.forEach((point, i) => {
      const value = Math.min(10, Math.max(0, point));
      const barHeight = value === 0 ? 6 : value * ROW_HEIGHT;
      const x = i * DAY_WIDTH + GAP;
      const centerX = x + BAR_WIDTH / 2;
      const y = HEIGHT - barHeight;
      
      svg += `<rect x="${x}" y="${y}" width="${BAR_WIDTH}" height="${barHeight}" 
                    rx="2" fill="${getBarColor(value)}"/>`;
      
      const labelY = HEIGHT + 22;
      svg += `<text x="${centerX}" y="${labelY}" font-size="14" font-weight="bold" 
                    fill="var(--neuro-text-light)" text-anchor="middle" 
                    transform="rotate(-90,${centerX},${labelY})">${DAYS[i]}</text>`;
    });

    // Average calculation
    const nonZero = points.filter(v => v > 0);
    const average = nonZero.length 
      ? (nonZero.reduce((sum, v) => sum + v, 0) / nonZero.length).toFixed(1) 
      : '—';
    
    svg += `<text x="${WIDTH / 2}" y="${HEIGHT + 85}" font-size="14" font-weight="bold" 
                  fill="var(--neuro-text)" text-anchor="middle">
              7 Days Average: ${average}
            </text>`;
    svg += '</svg>';

    return svg;
  }

  /**
   * Renders chakra balance radar chart
   * @param {Object} values - Chakra values
   * @param {number} size - Chart size in pixels
   * @returns {string} SVG markup
   */
  renderRadarChart(values, size) {
    const keys = EnergyEngineEnhanced.CHAKRAS.map(c => c.key);
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size / 2 - 24;

    // Calculate polygon points
    const points = keys.map((key, i) => {
      const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
      const value = Math.max(0, Math.min(10, values[key] || 0));
      const x = centerX + Math.cos(angle) * maxRadius * (value / 10);
      const y = centerY + Math.sin(angle) * maxRadius * (value / 10);
      return `${x},${y}`;
    }).join(' ');

    return `
      <svg viewBox="0 0 ${size} ${size}" style="max-width:100%;height:auto">
        ${[0.25, 0.5, 0.75, 1].map(ratio => `
          <circle cx="${centerX}" cy="${centerY}" r="${maxRadius * ratio}" 
                  stroke="#e6eef4" fill="none" stroke-width="1"/>
        `).join('')}
        
        ${keys.map((key, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          const x2 = centerX + Math.cos(angle) * maxRadius;
          const y2 = centerY + Math.sin(angle) * maxRadius;
          return `<line x1="${centerX}" y1="${centerY}" x2="${x2}" y2="${y2}" 
                        stroke="#eef6fa" stroke-width="1"/>`;
        }).join('')}
        
        <polygon points="${points}" 
                 fill="rgba(102,126,234,.2)" 
                 stroke="var(--neuro-accent)" 
                 stroke-width="2"/>
        
        ${EnergyEngineEnhanced.CHAKRAS.map((c, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          const x = centerX + Math.cos(angle) * (maxRadius + 12);
          const y = centerY + Math.sin(angle) * (maxRadius + 12);
          return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" 
                        font-size="10" fill="var(--neuro-text-light)">${c.name}</text>`;
        }).join('')}
      </svg>
    `;
  }

  /* ==================== EVENT HANDLERS ==================== */

  /**
   * Attaches all event listeners
   */
  attachEventListeners() {
    this.attachOverallEnergyListener();
    this.attachNotesListener();
    this.attachMoodListeners();
    this.attachChakraListeners();
    this.attachButtonListeners();
    this.attachCollapsibleListener();
    this.attachSearchListener();
  }

  /**
   * Attaches overall energy slider listener
   */
  attachOverallEnergyListener() {
    const slider = this.getElement('energy-overall-slider');
    const valueDisplay = this.getElement('energy-overall-value');
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.currentCheckin.overallEnergy = value;
        valueDisplay.textContent = value;
      });
    }
  }

  /**
   * Attaches notes textarea listener
   */
  attachNotesListener() {
    const notes = this.getElement('energy-notes');
    if (notes) {
      notes.addEventListener('input', (e) => {
        this.currentCheckin.notes = e.target.value;
      });
    }
  }

  /**
   * Attaches mood chip listeners
   */
  attachMoodListeners() {
    if (!this._boundMoodHandler) {
      this._boundMoodHandler = (e) => {
        const mood = e.currentTarget.dataset.mood;
        const index = this.currentCheckin.moodTags.indexOf(mood);
        
        if (index >= 0) {
          this.currentCheckin.moodTags.splice(index, 1);
          e.currentTarget.classList.remove('active');
        } else {
          this.currentCheckin.moodTags.push(mood);
          e.currentTarget.classList.add('active');
        }
      };
    }

    document.querySelectorAll('[data-mood]').forEach(chip => {
      chip.removeEventListener('click', this._boundMoodHandler);
      chip.addEventListener('click', this._boundMoodHandler);
    });
  }

  /**
   * Attaches chakra slider listeners
   */
  attachChakraListeners() {
    document.querySelectorAll('.chakra-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const key = e.target.dataset.chakra;
        const value = parseFloat(e.target.value);
        this.currentCheckin.chakras[key] = value;
        
        // Update value display
        const card = e.target.closest('.chakra-mini-card');
        const valueDiv = card?.querySelector('.chakra-value');
        if (valueDiv) valueDiv.textContent = value;
        
        // Update pulse effect
        this.updateChakraPulse(card, key, value);
      });
    });
  }

  /**
   * Updates chakra pulse effect
   */
  updateChakraPulse(card, key, value) {
    if (!card) return;
    
    const intensity = Math.abs(5 - value);
    const pulseSize = Math.min(12, intensity * 2 + 2);
    const pulseOpacity = Math.min(0.48, intensity / 6 + 0.08);
    const chakra = EnergyEngineEnhanced.CHAKRAS.find(c => c.key === key);
    const pulse = card.querySelector('.chakra-pulse');
    
    if (pulse && chakra) {
      const pulseHex = Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
      pulse.style.boxShadow = `0 0 ${pulseSize}px ${chakra.color}${pulseHex}`;
      pulse.style.opacity = intensity > 0 ? 1 : 0;
      pulse.style.transform = `scale(${1 + intensity * 0.01})`;
    }
  }

  /**
   * Attaches button listeners
   */
  attachButtonListeners() {
    const saveBtn = this.getElement('btn-save-checkin');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveCheckin(false));
    }

    const resetBtn = this.getElement('btn-reset-today');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Clear form? (saved entry stays)')) {
          this.currentCheckin = this.createDefaultCheckin();
          this.render();
        }
      });
    }
  }

  /**
   * Attaches collapsible header listener
   */
  attachCollapsibleListener() {
    const header = this.getElement('journal-collapsible-header');
    const card = this.getElement('journal-collapsible-card');
    
    if (header && card) {
      header.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });
    }
  }

  /**
   * Attaches search input listener with debouncing
   */
  attachSearchListener() {
    const search = this.getElement('journal-search');
    const card = this.getElement('journal-collapsible-card');
    
    if (search) {
      search.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.render();
          card?.classList.add('expanded');
        }, EnergyEngineEnhanced.SEARCH_DEBOUNCE);
      });
    }
  }

  /* ==================== STYLES ==================== */

  /**
   * Builds component styles
   */
  buildStyles() {
    return `
      <style>
        .card-flex { 
          display: flex; 
          flex-direction: column; 
        }
        .card-body { 
          flex: 1 1 0; 
          min-height: 0; 
          width: 100%; 
        }
        .weekly-chart-box { 
          aspect-ratio: 7/10; 
          max-width: 100%; 
          max-height: 100%; 
          margin: auto; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .chakra-row { 
          display: flex; 
          gap: 12px; 
          padding: 8px 2px; 
        }
        .chakra-mini-card { 
          flex: 1 1 0; 
          min-width: 112px; 
          background: var(--neuro-bg); 
          border-radius: 12px; 
          padding: 10px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 8px; 
          position: relative; 
          box-shadow: 8px 8px 18px var(--neuro-shadow-dark), 
                      -8px -8px 18px var(--neuro-shadow-light); 
        }
        .chakra-icon { 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          color: white; 
          display: grid; 
          place-items: center; 
          font-weight: 700; 
          font-size: 0.9rem; 
          box-shadow: inset 4px 4px 8px rgba(0,0,0,.1), 
                      inset -4px -4px 8px rgba(255,255,255,.2); 
        }
        .chakra-pulse { 
          position: absolute; 
          inset: -6px; 
          border-radius: 16px; 
          pointer-events: none; 
          transition: all 260ms ease; 
        }
        .chip { 
          background: rgba(31,45,61,0.04); 
          border: 1px solid rgba(0,0,0,0.02); 
          padding: 8px 16px; 
          border-radius: 999px; 
          cursor: pointer; 
          font-size: 0.9rem; 
          transition: all .2s; 
        }
        .chip.active { 
          background: linear-gradient(90deg, rgba(246,194,74,0.16), rgba(110,231,183,0.12)); 
          box-shadow: inset 4px 4px 8px rgba(0,0,0,.04), 
                      inset -4px -4px 8px rgba(255,255,255,.7); 
        }
        .calc-expandable-header { 
          padding: 24px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .calc-expandable-header h3 { 
          margin: 0; 
          font-size: 1.1rem; 
          color: var(--neuro-text); 
        }
        .chevron { 
          font-size: 1.5rem; 
          transition: transform var(--transition-normal); 
          color: var(--neuro-accent); 
        }
        .calc-expandable-card.expanded .chevron { 
          transform: rotate(90deg); 
        }
        .calc-expandable-content { 
          max-height: 0; 
          overflow: hidden; 
          transition: max-height var(--transition-slow); 
        }
        .calc-expandable-card.expanded .calc-expandable-content { 
          max-height: 5000px; 
          padding: 0 24px 24px; 
        }

        @media (max-width: 768px) {
          .chakra-row {
            flex-wrap: wrap;
          }
          .chakra-mini-card {
            min-width: calc(50% - 6px);
          }
        }
      </style>
    `;
  }

  /* ==================== UTILITY METHODS ==================== */

  /**
   * Gets emoji for mood
   */
  getMoodEmoji(mood) {
    return EnergyEngineEnhanced.MOOD_EMOJIS[mood] || '😊';
  }

  /**
   * Capitalizes first letter of string
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ==================== CLEANUP ==================== */

  /**
   * Cleanup method - removes listeners and clears state
   */
  destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.boundHandleResize);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.searchDebounce);
    this.domCache = {};
    this._boundMoodHandler = null;
  }
}

// Global export for compatibility
if (typeof window !== 'undefined') {
  window.EnergyEngineEnhanced = EnergyEngineEnhanced;
}

export default EnergyEngineEnhanced;