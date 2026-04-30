// Features/EnergyTracker.js

/**
 * EnergyEngineEnhanced - Tracks daily energy levels and chakra balance
 */
class EnergyEngineEnhanced {
  static CHAKRAS = [
    { key: 'root',     name: 'Root',       color: '#e04b4b' },
    { key: 'sacral',   name: 'Sacral',     color: '#f08a4b' },
    { key: 'solar',    name: 'Solar',      color: '#f6c24a' },
    { key: 'heart',    name: 'Heart',      color: '#6fcf97' },
    { key: 'throat',   name: 'Throat',     color: '#5fb7f0' },
    { key: 'thirdEye', name: 'Third Eye',  color: '#8b6be6' },
    { key: 'crown',    name: 'Crown',      color: '#c59ee9' }
  ];

  static MOODS = [
    'grounded','anxious','calm','happy','creative',
    'tired','focused','grateful','curious','confident'
  ];

  static MOOD_EMOJIS = {
    grounded:'🌍', anxious:'😰', calm:'😌', happy:'😊',
    creative:'🎨', tired:'😴', focused:'🎯', grateful:'🙏',
    curious:'🤔', confident:'💪'
  };

  static RESIZE_DEBOUNCE    = 120;
  static SEARCH_DEBOUNCE    = 300;
  static MAX_RENDER_RETRIES = 50;
  static MAX_HISTORY_DISPLAY = 30;
  static DAY_START_HOUR     = 5;
  static DAY_END_HOUR       = 17;

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

  initializeListeners() {
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.boundHandleResize);
  }

  scheduleInitialRender() {
    let retry = 0;
    const attemptRender = () => {
      if (this.isDestroyed) return;
      if (document.getElementById('energy-tab')) { this.render(); return; }
      if (++retry < EnergyEngineEnhanced.MAX_RENDER_RETRIES) requestAnimationFrame(attemptRender);
    };
    requestAnimationFrame(attemptRender);
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (!this.isDestroyed && document.getElementById('energy-tab')?.offsetParent) {
        this.updateChartsOnly();
      }
    }, EnergyEngineEnhanced.RESIZE_DEBOUNCE);
  }

  updateChartsOnly() {
    const weeklyBox      = document.querySelector('.weekly-chart-box');
    const radarContainer = document.querySelector('.chakra-balance-radar');
    if (weeklyBox)      weeklyBox.innerHTML      = this.renderWeeklyChart(this.getWeeklyData());
    if (radarContainer) radarContainer.innerHTML = this.renderRadarChart(this.getChakraAverages(), 200);
  }

  /* ==================== DATA MANAGEMENT ==================== */

  getTodayCheckin() {
    try {
      const today   = this.getISODate();
      const entries = this.app.state.data.energyEntries || [];
      const todayEntry = entries.find(e => this.getISODate(e.timestamp) === today);
      if (todayEntry?.chakras) {
        return {
          overallEnergy:  todayEntry.energy      || 6,
          moodTags:       todayEntry.moodTags    || [],
          chakras:        todayEntry.chakras,
          notes:          todayEntry.notes       || '',
          practicesDone:  todayEntry.practicesDone || [],
          timestamp:      todayEntry.timestamp,
          dayCheckin:     todayEntry.dayCheckin  || false,
          nightCheckin:   todayEntry.nightCheckin|| false
        };
      }
      return this.createDefaultCheckin();
    } catch (err) {
      console.error('Error loading check-in:', err);
      return this.createDefaultCheckin();
    }
  }

  createDefaultCheckin() {
    return {
      overallEnergy: 6, moodTags: [],
      chakras: this.getDefaultChakraSnapshot(),
      notes: '', practicesDone: [],
      timestamp: Date.now(), dayCheckin: false, nightCheckin: false
    };
  }

  getDefaultChakraSnapshot() {
    const s = {};
    EnergyEngineEnhanced.CHAKRAS.forEach(c => s[c.key] = 5);
    return s;
  }

  getISODate(timestamp = Date.now()) {
    const d = new Date(timestamp);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  }

  getTimeOfDayInfo() {
    const hour  = new Date().getHours();
    const isDay = hour >= EnergyEngineEnhanced.DAY_START_HOUR && hour < EnergyEngineEnhanced.DAY_END_HOUR;
    let greeting;
    if (hour < 12) greeting = 'morning';
    else if (hour < 18) greeting = 'afternoon';
    else greeting = 'evening';
    return { period: isDay ? 'day' : 'night', greeting, isDay };
  }

  saveCheckin(commit = false) {
    try {
      const { period } = this.getTimeOfDayInfo();
      const entries    = this.app.state.data.energyEntries || [];
      const today      = this.getISODate();
      const existingIndex = entries.findIndex(e => this.getISODate(e.timestamp) === today);

      if (period === 'day') this.currentCheckin.dayCheckin   = true;
      else                  this.currentCheckin.nightCheckin = true;

      const entry = {
        energy:        this.currentCheckin.overallEnergy,
        moodTags:      this.currentCheckin.moodTags,
        chakras:       this.currentCheckin.chakras,
        notes:         this.currentCheckin.notes,
        practicesDone: commit
          ? [...(this.currentCheckin.practicesDone || []), 'manual']
          : (this.currentCheckin.practicesDone || []),
        timestamp:    Date.now(),
        date:         today,
        dayCheckin:   this.currentCheckin.dayCheckin,
        nightCheckin: this.currentCheckin.nightCheckin,
        timeOfDay:    period
      };

      if (existingIndex >= 0) {
        entry.dayCheckin   = entry.dayCheckin   || entries[existingIndex].dayCheckin;
        entry.nightCheckin = entry.nightCheckin || entries[existingIndex].nightCheckin;
        entries[existingIndex] = entry;
      } else {
        entries.unshift(entry);
      }

      this.app.state.data.energyEntries = entries;
      this.app.state.saveAppData();
      this.app.state.updateStreak();

      if (this.app.gamification) {
        this.app.gamification.progressEnergyCheckin(period);
        this.app.gamification.checkChakraBadges(this.currentCheckin.chakras);
      }

      this.app.showToast(`${period === 'day' ? 'Day' : 'Night'} energy check-in saved!`, 'success');
      this.render();
    } catch (err) {
      console.error('Error saving check-in:', err);
      this.app.showToast('Failed to save check-in', 'error');
    }
  }

  getWeeklyData() {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(this.getISODate(d.getTime()));
    }
    const entries = this.app.state.data.energyEntries || [];
    return last7Days.map(date => {
      const e = entries.find(e => this.getISODate(e.timestamp) === date);
      return e ? e.energy : 0;
    });
  }

  getChakraAverages() {
    const entries = this.app.state.data.energyEntries || [];
    if (!entries.length) return this.getDefaultChakraSnapshot();
    const totals = {};
    EnergyEngineEnhanced.CHAKRAS.forEach(c => totals[c.key] = 0);
    let count = 0;
    entries.forEach(entry => {
      if (entry.chakras) {
        count++;
        EnergyEngineEnhanced.CHAKRAS.forEach(c => { totals[c.key] += (entry.chakras[c.key] || 0); });
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

  render() {
    if (this.isDestroyed) return;
    const tab = document.getElementById('energy-tab');
    if (!tab) return;
    try {
      const stats        = this.app.state.getStats();
      const weeklyData   = this.getWeeklyData();
      const chakraAvg    = this.getChakraAverages();
      const { period, greeting } = this.getTimeOfDayInfo();
      const checkinStatus = period === 'day'
        ? this.currentCheckin.dayCheckin
        : this.currentCheckin.nightCheckin;
      tab.innerHTML = this.buildMainHTML(stats, weeklyData, chakraAvg, greeting, period, checkinStatus);
      this.clearDOMCache();
      this.attachEventListeners();
    } catch (err) {
      console.error('Render error:', err);
      tab.innerHTML = '<div class="card"><p>Error loading. Please refresh.</p></div>';
    }
  }

  clearDOMCache() { this.domCache = {}; }

  getElement(id) {
    if (!this.domCache[id]) this.domCache[id] = document.getElementById(id);
    return this.domCache[id];
  }

  buildMainHTML(stats, weeklyData, chakraAvg, greeting, period, checkinStatus) {
    const journalEntries  = this.app.state.data.energyEntries || [];
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

  filterJournalEntries(entries) {
    if (!this.searchQuery) return entries;
    const q = this.searchQuery.toLowerCase();
    return entries.filter(e =>
      (e.notes || '').toLowerCase().includes(q) ||
      (e.moodTags || []).join(' ').toLowerCase().includes(q)
    );
  }

  buildHeader() {
    return `
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavEnergy.webp');--header-title:'';
                     --header-tag:'Check, review, track and learn your energy patterns - Overall and Chakras'">
        <h1>Energy Tracker</h1>
        <h3>Check, review, track and learn your energy patterns - Overall and Chakras</h3>
      </header>`;
  }

  buildReikiCTA() {
    return `
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin:0;font-size:1.15rem;text-align:center;">Learn &amp; Practice Reiki and Chakras with the Community</h3>
        </div>
        <p style="margin:0 0 1.5rem;font-size:0.92rem;line-height:1.6;">Deepen your energy practice together. Join live sessions, guided meditations, and group healing circles - all in one place.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button onclick="document.activeElement?.blur();window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
          <button onclick="document.activeElement?.blur();window._pendingRoomOpen='reiki';window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            Enter the Reiki Room
          </button>
        </div>
      </div>`;
  }

  buildCheckinCard(stats, greeting, period, checkinStatus) {
    return `
      <div class="card" style="margin-bottom:2rem;">
        ${this.buildCheckinHeader(stats, greeting, period, checkinStatus)}
        ${this.buildOverallEnergySlider()}
        ${this.buildMoodSelector()}
        ${this.buildChakraSection()}
        ${this.buildNotesSection()}
        ${this.buildActionButtons(period)}
      </div>`;
  }

  buildCheckinHeader(stats, greeting, period, checkinStatus) {
    return `
      <div class="flex items-center justify-between" style="margin-bottom:2rem;">
        <div>
          <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">Good ${greeting}</h3>
          <p class="text-sm" style="color:var(--neuro-text-light);">Log in your Overall Energy and your Specific Chakras</p>
          ${checkinStatus ? `<p class="text-sm mt-1" style="color:var(--neuro-success);">✓ ${period === 'day' ? 'Day' : 'Night'} check-in completed</p>` : ''}
        </div>
        <div class="text-right">
          <p class="text-sm" style="color:var(--neuro-text-light);">${new Date().toLocaleDateString()}</p>
          <p class="text-sm" style="color:var(--neuro-text-light);">Streak: ${stats.currentStreak} day(s)</p>
          <div class="flex gap-2 mt-2 justify-end text-xs">
            <span class="${this.currentCheckin.dayCheckin ? 'badge badge-success' : 'badge'}" style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              ${this.currentCheckin.dayCheckin ? '✓' : ''}
            </span>
            <span class="${this.currentCheckin.nightCheckin ? 'badge badge-success' : 'badge'}" style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ${this.currentCheckin.nightCheckin ? '✓' : ''}
            </span>
          </div>
        </div>
      </div>`;
  }

  buildOverallEnergySlider() {
    return `
      <div style="margin-bottom:2rem;">
        <label class="form-label">Overall Energy Level</label>
        <div class="flex items-center gap-4">
          <input type="range" id="energy-overall-slider" min="0" max="10" step="0.5"
                 value="${this.currentCheckin.overallEnergy}" class="flex-1" aria-label="Overall energy level"/>
          <span id="energy-overall-value" class="text-3xl font-bold"
                style="color:var(--neuro-accent);min-width:3rem;text-align:center;">
            ${this.currentCheckin.overallEnergy}
          </span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-sm" style="color:var(--neuro-text-light);">Low</span>
          <span class="text-sm" style="color:var(--neuro-text-light);">High</span>
        </div>
      </div>`;
  }

  buildMoodSelector() {
    return `
      <div style="margin-bottom:2rem;">
        <label class="form-label">Current Mood</label>
        <div id="mood-chips" class="flex flex-wrap gap-2">
          ${EnergyEngineEnhanced.MOODS.map(mood => `
            <button class="chip ${this.currentCheckin.moodTags.includes(mood) ? 'active' : ''}"
                    data-mood="${mood}" type="button">
              ${this.getMoodEmoji(mood)} ${this.capitalize(mood)}
            </button>`).join('')}
        </div>
      </div>`;
  }

  buildChakraSection() {
    return `
      <div style="margin-bottom:2rem;">
        <label class="form-label">Chakra Check-in</label>
        <div id="chakra-row" class="chakra-row">${this.buildChakraRow()}</div>
      </div>`;
  }

  buildNotesSection() {
    return `
      <div style="margin-bottom:2rem;">
        <label for="energy-notes" class="form-label">Notes, Thoughts, Emotions, Mood</label>
        <textarea id="energy-notes" class="form-input"
                  placeholder="Any reflections, situations, or notable events regarding your energies..."
                  aria-label="Energy notes">${this.currentCheckin.notes || ''}</textarea>
      </div>`;
  }

  buildActionButtons(period) {
    return `
      <div class="energy-action-buttons">
        <button id="btn-save-checkin" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
          Save ${period === 'day' ? 'Day' : 'Night'} Check-in
        </button>
        <button id="btn-reset-today" class="btn btn-secondary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Form
        </button>
      </div>`;
  }

  buildChakraRow() {
    return EnergyEngineEnhanced.CHAKRAS.map(chakra => {
      const value      = this.currentCheckin.chakras[chakra.key] || 5;
      const intensity  = Math.abs(5 - value);
      const pulseSize  = Math.min(12, intensity * 2 + 2);
      const pulseOpacity = Math.min(0.48, intensity / 6 + 0.08);
      const pulseHex   = Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
      return `
        <div class="chakra-mini-card" data-chakra="${chakra.key}">
          <div class="chakra-pulse"
               style="box-shadow:0 0 ${pulseSize}px ${chakra.color}${pulseHex};
                      opacity:${intensity > 0 ? 1 : 0};transform:scale(${1 + intensity * 0.01})"></div>
          <div class="chakra-icon" style="background:${chakra.color}">${chakra.name.charAt(0)}</div>
          <div style="font-size:13px;font-weight:700;text-align:center">${chakra.name}</div>
          <input type="range" class="chakra-slider" data-chakra="${chakra.key}"
                 min="0" max="10" step="0.5" value="${value}" style="width:100%"
                 aria-label="${chakra.name} level"/>
          <div class="chakra-value" style="font-size:13px;font-weight:700">${value}</div>
        </div>`;
    }).join('');
  }

  buildChartsSection(weeklyData, chakraAvg) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom:2rem;">
        <div class="card p-4 card-flex">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom:1rem;">Weekly Trend</h3>
          <div class="card-body w-full">
            <div class="weekly-chart-box">${this.renderWeeklyChart(weeklyData)}</div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom:1rem;">Chakra Balance</h3>
          <div class="flex justify-center chakra-balance-radar">${this.renderRadarChart(chakraAvg, 200)}</div>
          <div class="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
            ${EnergyEngineEnhanced.CHAKRAS.map(c => `
              <div>
                <div class="font-bold" style="color:${c.color};">${chakraAvg[c.key]}</div>
                <div class="text-gray-500">${c.name}</div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  buildJournalSection(filteredJournal) {
    return `
      <div class="card calc-expandable-card" id="journal-collapsible-card">
        <div class="calc-expandable-header" id="journal-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--neuro-accent);flex-shrink:0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">My Energy Tracker</h3>
        </div>
        <div class="calc-expandable-content">
          <div style="margin-bottom:2rem;">
            <input type="text" id="journal-search" class="form-input"
                   placeholder="Search notes or moods..." value="${this.searchQuery}"
                   aria-label="Search journal entries"/>
          </div>
          <div class="space-y-4">${this.buildJournalEntries(filteredJournal)}</div>
        </div>
      </div>`;
  }

  buildJournalEntries(filteredJournal) {
    if (!filteredJournal.length) {
      return `
        <div class="card text-center" style="padding:4rem;">
          <div style="display:flex;justify-content:center;margin-bottom:1rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:56px;height:56px;color:var(--neuro-text-light);"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <p style="color:var(--neuro-text-light);">
            ${this.searchQuery ? 'No entries found matching your search' : 'No journal entries yet. Your check-ins will appear here.'}
          </p>
        </div>`;
    }
    const display = filteredJournal.slice(0, EnergyEngineEnhanced.MAX_HISTORY_DISPLAY).map(e => this.renderJournalEntry(e)).join('');
    const more    = filteredJournal.length > EnergyEngineEnhanced.MAX_HISTORY_DISPLAY
      ? `<div class="text-center mt-6"><p class="text-sm" style="color:var(--neuro-text-light);">Showing ${EnergyEngineEnhanced.MAX_HISTORY_DISPLAY} most recent entries</p></div>`
      : '';
    return display + more;
  }

  renderJournalEntry(entry) {
    const date    = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    const badges  = [];
    if (entry.dayCheckin)   badges.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Day</span>');
    if (entry.nightCheckin) badges.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Night</span>');
    return `
      <div class="card" style="border-left:4px solid var(--neuro-accent)">
        <div class="flex justify-between items-start" style="margin-bottom:1rem;">
          <div>
            <div class="font-bold text-lg" style="color:var(--neuro-text)">${dateStr}</div>
            <div class="text-sm" style="color:var(--neuro-text-light)">${timeStr}</div>
            ${badges.length ? `<div class="flex gap-2 mt-2">${badges.join('')}</div>` : ''}
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-3xl font-bold" style="color:var(--neuro-accent)">${entry.energy}</div>
              <div class="text-sm" style="color:var(--neuro-text-light);">Energy</div>
            </div>
            <button class="btn-delete-entry" data-timestamp="${entry.timestamp}" title="Delete entry"
                    style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;
                           border-radius:50%;border:none;cursor:pointer;background:rgba(224,75,75,0.1);
                           color:#e04b4b;flex-shrink:0;transition:background 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
        ${this.buildEntryMoodTags(entry)}
        ${this.buildEntryNotes(entry)}
        ${this.buildEntryChakras(entry)}
      </div>`;
  }

  buildEntryMoodTags(entry) {
    if (!entry.moodTags?.length) return '';
    return `
      <div class="flex flex-wrap gap-2" style="margin-bottom:1rem;">
        ${entry.moodTags.map(mood => `
          <span class="badge" style="font-size:0.85rem">${this.getMoodEmoji(mood)} ${this.capitalize(mood)}</span>`).join('')}
      </div>`;
  }

  // PATCHED: escape notes before rendering to prevent XSS
  buildEntryNotes(entry) {
    if (!entry.notes) return '';
    const escaped = String(entry.notes)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return `<div style="color:var(--neuro-text);line-height:1.6;white-space:pre-wrap">${escaped}</div>`;
  }

  buildEntryChakras(entry) {
    if (!entry.chakras) return '';
    return `
      <div class="mt-4 pt-4" style="border-top:1px solid rgba(0,0,0,.05)">
        <div class="text-sm font-bold" style="color:var(--neuro-text-light);margin-bottom:0.5rem;">Chakras:</div>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
          ${EnergyEngineEnhanced.CHAKRAS.map(c => `
            <div class="text-center">
              <div class="text-xs" style="color:var(--neuro-text-light);margin-bottom:0.25rem;">${c.name}</div>
              <div class="text-sm font-bold" style="color:${c.color}">${entry.chakras[c.key] || 5}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ==================== CHART RENDERING ==================== */

  renderWeeklyChart(points) {
    const parent = document.querySelector('#energy-tab .card-body');
    if (!parent) return '<div style="padding:2rem;color:var(--neuro-text-light)">Loading...</div>';
    const WIDTH = parent.clientWidth, HEIGHT = parent.clientHeight;
    const TOP_SPACE = 20, EXTRA_SPACE = 105;
    const VIEW_HEIGHT = HEIGHT + EXTRA_SPACE + TOP_SPACE;
    const NARROW_FACTOR = 0.55, GAP_PERCENT = 0.01;
    const DAY_WIDTH = WIDTH / 7, ROW_HEIGHT = HEIGHT / 10;
    const GAP = DAY_WIDTH * GAP_PERCENT, BAR_WIDTH = DAY_WIDTH * NARROW_FACTOR - GAP;
    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const getBarColor = v => v === 0 ? '#e04b4b' : v <= 3 ? '#f08a4b' : v <= 6 ? '#f6c24a' : v <= 9 ? '#6fcf97' : '#ffd700';
    let svg = `<svg viewBox="0 ${-TOP_SPACE} ${WIDTH} ${VIEW_HEIGHT}" style="width:100%;height:100%;display:block">`;
    for (let row = 0; row <= 10; row += 2) {
      const y = HEIGHT - row * ROW_HEIGHT;
      svg += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="rgba(0,0,0,.08)" stroke-width="1"/>`;
      svg += `<text x="6" y="${y + 5}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle">${row}</text>`;
    }
    points.forEach((point, i) => {
      const value    = Math.min(10, Math.max(0, point));
      const barHeight = value === 0 ? 6 : value * ROW_HEIGHT;
      const x = i * DAY_WIDTH + GAP, centerX = x + BAR_WIDTH / 2, y = HEIGHT - barHeight;
      svg += `<rect x="${x}" y="${y}" width="${BAR_WIDTH}" height="${barHeight}" rx="2" fill="${getBarColor(value)}"/>`;
      const labelY = HEIGHT + 22;
      svg += `<text x="${centerX}" y="${labelY}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle" transform="rotate(-90,${centerX},${labelY})">${DAYS[i]}</text>`;
    });
    const nonZero  = points.filter(v => v > 0);
    const average  = nonZero.length ? (nonZero.reduce((s, v) => s + v, 0) / nonZero.length).toFixed(1) : '-';
    svg += `<text x="${WIDTH / 2}" y="${HEIGHT + 85}" font-size="14" font-weight="bold" fill="var(--neuro-text)" text-anchor="middle">7 Days Average: ${average}</text>`;
    svg += '</svg>';
    return svg;
  }

  renderRadarChart(values, size) {
    const keys = EnergyEngineEnhanced.CHAKRAS.map(c => c.key);
    const cx = size / 2, cy = size / 2, maxR = size / 2 - 24;
    const points = keys.map((key, i) => {
      const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
      const val   = Math.max(0, Math.min(10, values[key] || 0));
      return `${cx + Math.cos(angle) * maxR * (val / 10)},${cy + Math.sin(angle) * maxR * (val / 10)}`;
    }).join(' ');
    return `
      <svg viewBox="0 0 ${size} ${size}" style="max-width:100%;height:auto">
        ${[0.25,0.5,0.75,1].map(r => `<circle cx="${cx}" cy="${cy}" r="${maxR * r}" stroke="#e6eef4" fill="none" stroke-width="1"/>`).join('')}
        ${keys.map((_, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          return `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(angle) * maxR}" y2="${cy + Math.sin(angle) * maxR}" stroke="#eef6fa" stroke-width="1"/>`;
        }).join('')}
        <polygon points="${points}" fill="rgba(102,126,234,.2)" stroke="var(--neuro-accent)" stroke-width="2"/>
        ${EnergyEngineEnhanced.CHAKRAS.map((c, i) => {
          const angle = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          return `<text x="${cx + Math.cos(angle) * (maxR + 12)}" y="${cy + Math.sin(angle) * (maxR + 12)}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--neuro-text-light)">${c.name}</text>`;
        }).join('')}
      </svg>`;
  }

  /* ==================== EVENT HANDLERS ==================== */

  attachEventListeners() {
    this.attachOverallEnergyListener();
    this.attachNotesListener();
    this.attachMoodListeners();
    this.attachChakraListeners();
    this.attachButtonListeners();
    this.attachCollapsibleListener();
    this.attachSearchListener();
    this.attachDeleteListeners();
  }

  attachDeleteListeners() {
    document.querySelectorAll('.btn-delete-entry').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ts = parseInt(e.currentTarget.dataset.timestamp);
        if (confirm('Delete this energy entry?')) this.deleteEnergyEntry(ts);
      });
    });
  }

  deleteEnergyEntry(timestamp) {
    try {
      const entries = this.app.state.data.energyEntries || [];
      const index   = entries.findIndex(e => e.timestamp === timestamp);
      if (index >= 0) {
        entries.splice(index, 1);
        this.app.state.data.energyEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('Entry deleted', 'success');
        this.render();
      }
    } catch (err) {
      console.error('Error deleting entry:', err);
      this.app.showToast('Failed to delete entry', 'error');
    }
  }

  attachOverallEnergyListener() {
    const slider = this.getElement('energy-overall-slider');
    const valueDisplay = this.getElement('energy-overall-value');
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value);
        this.currentCheckin.overallEnergy = v;
        valueDisplay.textContent = v;
      });
    }
  }

  attachNotesListener() {
    const notes = this.getElement('energy-notes');
    if (notes) notes.addEventListener('input', (e) => { this.currentCheckin.notes = e.target.value; });
  }

  attachMoodListeners() {
    this._boundMoodHandler = (e) => {
      const chip = e.currentTarget;
      if (!chip) return;
      const mood  = chip.dataset.mood;
      if (!mood)  return;
      const index = this.currentCheckin.moodTags.indexOf(mood);
      if (index >= 0) { this.currentCheckin.moodTags.splice(index, 1); chip.classList.remove('active'); }
      else            { this.currentCheckin.moodTags.push(mood);       chip.classList.add('active'); }
    };
    document.querySelectorAll('[data-mood]').forEach(chip => {
      chip.removeEventListener('click', this._boundMoodHandler);
      chip.addEventListener('click', this._boundMoodHandler);
    });
  }

  attachChakraListeners() {
    document.querySelectorAll('.chakra-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const key   = e.target.dataset.chakra;
        const value = parseFloat(e.target.value);
        this.currentCheckin.chakras[key] = value;
        const card     = e.target.closest('.chakra-mini-card');
        const valueDiv = card?.querySelector('.chakra-value');
        if (valueDiv) valueDiv.textContent = value;
        this.updateChakraPulse(card, key, value);
      });
    });
  }

  updateChakraPulse(card, key, value) {
    if (!card) return;
    const intensity    = Math.abs(5 - value);
    const pulseSize    = Math.min(12, intensity * 2 + 2);
    const pulseOpacity = Math.min(0.48, intensity / 6 + 0.08);
    const chakra       = EnergyEngineEnhanced.CHAKRAS.find(c => c.key === key);
    const pulse        = card.querySelector('.chakra-pulse');
    if (pulse && chakra) {
      const hex = Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
      pulse.style.boxShadow = `0 0 ${pulseSize}px ${chakra.color}${hex}`;
      pulse.style.opacity   = intensity > 0 ? 1 : 0;
      pulse.style.transform = `scale(${1 + intensity * 0.01})`;
    }
  }

  attachButtonListeners() {
    const saveBtn  = this.getElement('btn-save-checkin');
    const resetBtn = this.getElement('btn-reset-today');
    if (saveBtn)  saveBtn.addEventListener('click', () => this.saveCheckin(false));
    if (resetBtn) resetBtn.addEventListener('click', () => {
      if (confirm('Clear form? (saved entry stays)')) { this.currentCheckin = this.createDefaultCheckin(); this.render(); }
    });
  }

  attachCollapsibleListener() {
    const header = this.getElement('journal-collapsible-header');
    const card   = this.getElement('journal-collapsible-card');
    if (header && card) header.addEventListener('click', () => card.classList.toggle('expanded'));
  }

  attachSearchListener() {
    const search = this.getElement('journal-search');
    const card   = this.getElement('journal-collapsible-card');
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

  buildStyles() {
    return `
      <style>
        .card-flex{display:flex;flex-direction:column;}
        .card-body{flex:1 1 0;min-height:0;width:100%;}
        .weekly-chart-box{aspect-ratio:7/10;max-width:100%;max-height:100%;margin:auto;display:flex;align-items:center;justify-content:center;}
        .chakra-row{display:flex;gap:12px;padding:8px 2px;}
        .chakra-mini-card{flex:1 1 0;min-width:112px;background:var(--neuro-bg);border-radius:12px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:8px;position:relative;box-shadow:8px 8px 18px var(--neuro-shadow-dark),-8px -8px 18px var(--neuro-shadow-light);}
        .chakra-icon{width:36px;height:36px;border-radius:50%;color:white;display:grid;place-items:center;font-weight:700;font-size:0.9rem;box-shadow:inset 4px 4px 8px rgba(0,0,0,.1),inset -4px -4px 8px rgba(255,255,255,.2);}
        .chakra-pulse{position:absolute;inset:-6px;border-radius:16px;pointer-events:none;transition:all 260ms ease;}
        .energy-action-buttons{display:flex;gap:0.75rem;}
        .energy-action-buttons .btn{flex:1;}
        .chip{background:rgba(31,45,61,0.04);border:1px solid rgba(0,0,0,0.02);padding:8px 16px;border-radius:999px;cursor:pointer;font-size:0.9rem;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
        .chip.active{background:linear-gradient(90deg,rgba(246,194,74,0.16),rgba(110,231,183,0.12));box-shadow:inset 4px 4px 8px rgba(0,0,0,.04),inset -4px -4px 8px rgba(255,255,255,.7);}
        .badge{display:inline-flex;align-items:center;justify-content:center;gap:4px;line-height:1;}
        .calc-expandable-header{padding:24px;cursor:pointer;display:flex;align-items:center;gap:12px;}
        .calc-expandable-header h3{margin:0;font-size:1.1rem;color:var(--neuro-text);}
        .chevron{font-size:1.5rem;transition:transform var(--transition-normal);color:var(--neuro-accent);}
        .calc-expandable-card.expanded .chevron{transform:rotate(90deg);}
        .calc-expandable-content{max-height:0;overflow:hidden;transition:max-height var(--transition-slow);}
        .calc-expandable-card.expanded .calc-expandable-content{max-height:5000px;padding:0 24px 24px;}
        @media(max-width:768px){
          .energy-action-buttons{flex-direction:column;}
          .energy-action-buttons .btn{width:100%;}
          .chakra-row{flex-wrap:wrap;}
          .chakra-mini-card{min-width:calc(50% - 6px);}
        }
      </style>`;
  }

  /* ==================== UTILITY METHODS ==================== */

  getMoodEmoji(mood)  { return EnergyEngineEnhanced.MOOD_EMOJIS[mood] || '😊'; }
  capitalize(str)     { return str.charAt(0).toUpperCase() + str.slice(1); }

  /* ==================== CLEANUP ==================== */

  destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.boundHandleResize);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.searchDebounce);
    this.domCache = {};
    this._boundMoodHandler = null;
  }
}

if (typeof window !== 'undefined') window.EnergyEngineEnhanced = EnergyEngineEnhanced;
export default EnergyEngineEnhanced;