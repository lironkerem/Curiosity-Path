// Features/EnergyTracker.js - Optimized Version

class EnergyEngineEnhanced {
  constructor(app) {
    this.app = app;
    this.searchQuery = '';
    this.isDestroyed = false;
    this.domCache = {};
    this.resizeTimeout = null;
    this.searchDebounce = null;

    this.CHAKRAS = [
      { key: 'root', name: 'Root', color: '#e04b4b' },
      { key: 'sacral', name: 'Sacral', color: '#f08a4b' },
      { key: 'solar', name: 'Solar', color: '#f6c24a' },
      { key: 'heart', name: 'Heart', color: '#6fcf97' },
      { key: 'throat', name: 'Throat', color: '#5fb7f0' },
      { key: 'thirdEye', name: 'Third Eye', color: '#8b6be6' },
      { key: 'crown', name: 'Crown', color: '#c59ee9' }
    ];
    
    this.MOODS = ['grounded', 'anxious', 'calm', 'happy', 'creative', 'tied', 'focused', 'grateful', 'curious', 'confident'];
    
    this.currentCheckin = this.getTodayCheckin();
    this.initializeListeners();
    this.scheduleInitialRender();
  }

  initializeListeners() {
    this.boundHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.boundHandleResize);
  }

  scheduleInitialRender() {
    let retry = 0;
    const attemptRender = () => {
      if (this.isDestroyed) return;
      if (document.getElementById('energy-tab')) {
        this.render();
        return;
      }
      if (++retry < 50) requestAnimationFrame(attemptRender);
    };
    requestAnimationFrame(attemptRender);
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (!this.isDestroyed && document.getElementById('energy-tab')?.offsetParent) {
        this.updateChartsOnly();
      }
    }, 120);
  }

  updateChartsOnly() {
    const weeklyBox = document.querySelector('.weekly-chart-box');
    const radarContainer = document.querySelector('.chakra-balance-radar');
    if (weeklyBox) weeklyBox.innerHTML = this.renderWeeklyChart(this.getWeeklyData());
    if (radarContainer) radarContainer.innerHTML = this.renderRadarChart(this.getChakraAverages(), 200);
  }

  destroy() {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.boundHandleResize);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.searchDebounce);
    this.domCache = {};
  }

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
      console.error('Error loading checkin:', err);
      return this.createDefaultCheckin();
    }
  }

  createDefaultCheckin() {
    return {
      overallEnergy: 6, moodTags: [], chakras: this.getDefaultChakraSnapshot(),
      notes: '', practicesDone: [], timestamp: Date.now(), dayCheckin: false, nightCheckin: false
    };
  }

  getDefaultChakraSnapshot() {
    const s = {};
    this.CHAKRAS.forEach(c => s[c.key] = 5);
    return s;
  }

  getISODate(t = Date.now()) {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  }

  getTimeOfDayInfo() {
    const h = new Date().getHours();
    const isDay = h >= 5 && h < 17;
    return {
      period: isDay ? 'day' : 'night',
      greeting: h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening',
      isDay
    };
  }

  saveCheckin(commit = false) {
    try {
      const { period } = this.getTimeOfDayInfo();
      const entries = this.app.state.data.energyEntries || [];
      const today = this.getISODate();
      const idx = entries.findIndex(e => this.getISODate(e.timestamp) === today);
      
      if (period === 'day') this.currentCheckin.dayCheckin = true;
      else this.currentCheckin.nightCheckin = true;
      
      const entry = {
        energy: this.currentCheckin.overallEnergy,
        moodTags: this.currentCheckin.moodTags,
        chakras: this.currentCheckin.chakras,
        notes: this.currentCheckin.notes,
        practicesDone: commit ? [...(this.currentCheckin.practicesDone || []), 'manual'] : (this.currentCheckin.practicesDone || []),
        timestamp: Date.now(),
        date: today,
        dayCheckin: this.currentCheckin.dayCheckin,
        nightCheckin: this.currentCheckin.nightCheckin,
        timeOfDay: period
      };
      
      if (idx >= 0) {
        entry.dayCheckin = entry.dayCheckin || entries[idx].dayCheckin;
        entry.nightCheckin = entry.nightCheckin || entries[idx].nightCheckin;
        entries[idx] = entry;
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
      
      this.app.showToast(`✅ ${period === 'day' ? 'Day' : 'Night'} energy check-in saved!`, 'success');
      this.checkAchievements();
      this.render();
    } catch (err) {
      console.error('Error saving checkin:', err);
      this.app.showToast('❌ Failed to save check-in', 'error');
    }
  }

  checkAchievements() {
    const gm = this.app.gamification;
    if (!gm) return;
    
    const total = this.app.state.data.energyEntries?.length || 0;
    const achievements = [
      { t: 1, id: 'first_energy', n: 'Energy Awareness', xp: 50, ic: '⚡', insp: 'You\'ve begun tracking your energy!' },
      { t: 10, id: 'energy_10', n: 'Energy Explorer', xp: 100, ic: '🌟', insp: '10 check-ins! Your awareness grows!' },
      { t: 50, id: 'energy_50', n: 'Energy Master', xp: 250, ic: '✨', insp: '50 check-ins! You understand your energy patterns!' },
      { t: 100, id: 'energy_100', n: 'Energy Sage', xp: 500, ic: '🔮', insp: '100 check-ins! You are a master of energy flow!' }
    ];
    
    achievements.forEach(a => {
      if (total === a.t) gm.grantAchievement({ id: a.id, name: a.n, xp: a.xp, icon: a.ic, inspirational: a.insp });
    });
  }

  getWeeklyData() {
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(this.getISODate(d.getTime()));
    }
    const entries = this.app.state.data.energyEntries || [];
    return last7.map(date => {
      const e = entries.find(en => this.getISODate(en.timestamp) === date);
      return e ? e.energy : 0;
    });
  }

  getChakraAverages() {
    const entries = this.app.state.data.energyEntries || [];
    if (!entries.length) return this.getDefaultChakraSnapshot();
    
    const totals = {};
    this.CHAKRAS.forEach(c => totals[c.key] = 0);
    
    let count = 0;
    entries.forEach(en => {
      if (en.chakras) {
        count++;
        this.CHAKRAS.forEach(c => totals[c.key] += (en.chakras[c.key] || 0));
      }
    });
    
    if (!count) return this.getDefaultChakraSnapshot();
    
    const avg = {};
    this.CHAKRAS.forEach(c => avg[c.key] = Math.round((totals[c.key] / count) * 10) / 10);
    return avg;
  }

  render() {
    if (this.isDestroyed) return;
    const tab = document.getElementById('energy-tab');
    if (!tab) return;
    
    try {
      const stats = this.app.state.getStats();
      const weeklyData = this.getWeeklyData();
      const chakraAvg = this.getChakraAverages();
      const { period, greeting } = this.getTimeOfDayInfo();
      const checkinStatus = period === 'day' ? this.currentCheckin.dayCheckin : this.currentCheckin.nightCheckin;
      
      tab.innerHTML = this.buildMainHTML(stats, weeklyData, chakraAvg, greeting, period, checkinStatus);
      this.clearDOMCache();
      this.attachEventListeners();
    } catch (err) {
      console.error('Render error:', err);
      tab.innerHTML = '<div class="card"><p>Error loading. Please refresh.</p></div>';
    }
  }

  clearDOMCache() {
    this.domCache = {};
  }

  getElement(id) {
    if (!this.domCache[id]) this.domCache[id] = document.getElementById(id);
    return this.domCache[id];
  }

  buildMainHTML(stats, weeklyData, chakraAvg, greeting, period, checkinStatus) {
    const journalEntries = this.app.state.data.energyEntries || [];
    const filteredJournal = this.searchQuery 
      ? journalEntries.filter(e => ((e.notes || '').toLowerCase().includes(this.searchQuery.toLowerCase()) || (e.moodTags || []).join(' ').toLowerCase().includes(this.searchQuery.toLowerCase())))
      : journalEntries;

    return `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <header class="main-header project-curiosity" style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavEnergy.png');--header-title:'';--header-tag:'Check, review, track and learn your energy patterns - Overall and Chakras'">
            <h1>Energy Tracker</h1>
            <h3>Check, review, track and learn your energy patterns - Overall and Chakras</h3>
          </header>

          <div class="card" style="margin-bottom: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
              <div>
                <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">Good ${greeting}</h3>
                <p class="text-sm" style="color:var(--neuro-text-light);">Log in your Overall Energy and your Specific Chakras</p>
                ${checkinStatus ? `<p class="text-sm mt-1" style="color:var(--neuro-success);">✓ ${period === 'day' ? 'Day' : 'Night'} check-in completed</p>` : ''}
              </div>
              <div class="text-right">
                <p class="text-sm" style="color:var(--neuro-text-light);">${new Date().toLocaleDateString()}</p>
                <p class="text-sm" style="color:var(--neuro-text-light);">Streak: ${stats.currentStreak} day(s)</p>
                <div class="flex gap-2 mt-2 justify-end text-xs">
                  <span class="${this.currentCheckin.dayCheckin ? 'badge badge-success' : 'badge'}" style="padding:4px 8px;">☀️ Day ${this.currentCheckin.dayCheckin ? '✓' : ''}</span>
                  <span class="${this.currentCheckin.nightCheckin ? 'badge badge-success' : 'badge'}" style="padding:4px 8px;">🌙 Night ${this.currentCheckin.nightCheckin ? '✓' : ''}</span>
                </div>
              </div>
            </div>

            <div style="margin-bottom: 2rem;">
              <label class="form-label">Overall Energy Level</label>
              <div class="flex items-center gap-4">
                <input type="range" id="energy-overall-slider" min="0" max="10" step="0.5" value="${this.currentCheckin.overallEnergy}" class="flex-1"/>
                <span id="energy-overall-value" class="text-3xl font-bold" style="color:var(--neuro-accent);min-width:3rem;text-align:center;">${this.currentCheckin.overallEnergy}</span>
              </div>
              <div class="flex justify-between mt-2"><span class="text-sm" style="color:var(--neuro-text-light);">Low</span><span class="text-sm" style="color:var(--neuro-text-light);">High</span></div>
            </div>

            <div style="margin-bottom: 2rem;">
              <label class="form-label">Current Mood</label>
              <div id="mood-chips" class="flex flex-wrap gap-2">${this.MOODS.map(mood => `<button class="chip ${this.currentCheckin.moodTags.includes(mood) ? 'active' : ''}" data-mood="${mood}">${this.getMoodEmoji(mood)} ${this.capitalize(mood)}</button>`).join('')}</div>
            </div>

            <div style="margin-bottom: 2rem;">
              <label class="form-label">Chakra Check-in</label>
              <div id="chakra-row" class="chakra-row">${this.buildChakraRow()}</div>
            </div>

            <div style="margin-bottom: 2rem;">
              <label for="energy-notes" class="form-label">Notes, Thoughts, Emotions, Mood</label>
              <textarea id="energy-notes" class="form-input" placeholder="Any reflections, situations, or notable events regarding your energies...">${this.currentCheckin.notes || ''}</textarea>
            </div>

            <div class="flex gap-3 flex-wrap">
              <button id="btn-save-checkin" class="btn btn-primary">💾 Save ${period === 'day' ? 'Day' : 'Night'} Check-in</button>
              <button id="btn-reset-today" class="btn btn-secondary">🔄 Reset Form</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom: 2rem;">
            <div class="card p-4 card-flex">
              <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">Weekly Trend</h3>
              <div class="card-body w-full"><div class="weekly-chart-box">${this.renderWeeklyChart(weeklyData)}</div></div>
            </div>
            <div class="card p-4">
              <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">Chakra Balance</h3>
              <div class="flex justify-center chakra-balance-radar">${this.renderRadarChart(chakraAvg, 200)}</div>
              <div class="grid grid-cols-4 gap-2 mt-3 text-xs text-center">${this.CHAKRAS.map(c => `<div><div class="font-bold" style="color:${c.color};">${chakraAvg[c.key]}</div><div class="text-gray-500">${c.name}</div></div>`).join('')}</div>
            </div>
          </div>

          <div class="card calc-expandable-card" id="journal-collapsible-card">
            <div class="calc-expandable-header" id="journal-collapsible-header"><span class="chevron">›</span><h3 class="text-2xl font-bold" style="color:var(--neuro-text);margin-bottom: 1.5rem;">📖 My Energy Trackings Log</h3></div>
            <div class="calc-expandable-content">
              <div style="margin-bottom: 2rem;"><input type="text" id="journal-search" class="form-input" placeholder="Search notes or moods..." value="${this.searchQuery}"/></div>
              <div class="space-y-4">
                ${filteredJournal.length === 0 
                  ? `<div class="card text-center" style="padding:4rem;"><div class="text-7xl" style="margin-bottom: 1rem;">📋</div><p style="color:var(--neuro-text-light);">${this.searchQuery ? 'No entries found matching your search' : 'No journal entries yet. Your check-ins will appear here.'}</p></div>` 
                  : filteredJournal.slice(0, 30).map(e => this.renderJournalEntry(e)).join('')}
                ${filteredJournal.length > 30 ? '<div class="text-center mt-6"><p class="text-sm" style="color:var(--neuro-text-light);">Showing 30 most recent entries</p></div>' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
      ${this.buildStyles()}
    `;
  }

  buildChakraRow() {
    return this.CHAKRAS.map(c => {
      const val = this.currentCheckin.chakras[c.key] || 5;
      const im = Math.abs(5 - val);
      const pulseSize = Math.min(12, im * 2 + 2);
      const pulseOpacity = Math.min(0.48, im / 6 + 0.08);
      return `
        <div class="chakra-mini-card" data-chakra="${c.key}">
          <div class="chakra-pulse" style="box-shadow:0 0 ${pulseSize}px ${c.color}${Math.floor(pulseOpacity * 255).toString(16)};opacity:${im > 0 ? 1 : 0};transform:scale(${1 + im * 0.01})"></div>
          <div class="chakra-icon" style="background:${c.color}">${c.name.charAt(0)}</div>
          <div style="font-size:13px;font-weight:700;text-align:center">${c.name}</div>
          <input type="range" class="chakra-slider" data-chakra="${c.key}" min="0" max="10" step="0.5" value="${val}" style="width:100%"/>
          <div class="chakra-value" style="font-size:13px;font-weight:700">${val}</div>
        </div>`;
    }).join('');
  }

  attachEventListeners() {
    const slider = this.getElement('energy-overall-slider');
    const value = this.getElement('energy-overall-value');
    if (slider && value) {
      slider.addEventListener('input', e => {
        const v = parseFloat(e.target.value);
        this.currentCheckin.overallEnergy = v;
        value.textContent = v;
      });
    }

    const notes = this.getElement('energy-notes');
    if (notes) notes.addEventListener('input', e => this.currentCheckin.notes = e.target.value);

    // single bound handler – remove old ones first
    this._boundMoodHandler = this._boundMoodHandler || ((e) => {
      const mood = e.currentTarget.dataset.mood;
      const idx = this.currentCheckin.moodTags.indexOf(mood);
      if (idx >= 0) {
        this.currentCheckin.moodTags.splice(idx, 1);
        e.currentTarget.classList.remove('active');
      } else {
        this.currentCheckin.moodTags.push(mood);
        e.currentTarget.classList.add('active');
      }
    });
    document.querySelectorAll('[data-mood]').forEach(chip => {
      chip.removeEventListener('click', this._boundMoodHandler);
      chip.addEventListener('click', this._boundMoodHandler);
    });

    document.querySelectorAll('.chakra-slider').forEach(sl => {
      sl.addEventListener('input', e => {
        const key = e.target.dataset.chakra;
        const val = parseFloat(e.target.value);
        this.currentCheckin.chakras[key] = val;
        const card = e.target.closest('.chakra-mini-card');
        const valueDiv = card.querySelector('.chakra-value');
        if (valueDiv) valueDiv.textContent = val;
        
        const im = Math.abs(5 - val);
        const pulseSize = Math.min(12, im * 2 + 2);
        const pulseOpacity = Math.min(0.48, im / 6 + 0.08);
        const chakra = this.CHAKRAS.find(c => c.key === key);
        const pulse = card.querySelector('.chakra-pulse');
        if (pulse && chakra) {
          pulse.style.boxShadow = `0 0 ${pulseSize}px ${chakra.color}${Math.floor(pulseOpacity * 255).toString(16)}`;
          pulse.style.opacity = im > 0 ? 1 : 0;
          pulse.style.transform = `scale(${1 + im * 0.01})`;
        }
      });
    });

    const saveBtn = this.getElement('btn-save-checkin');
    if (saveBtn) saveBtn.addEventListener('click', () => this.saveCheckin(false));

    const resetBtn = this.getElement('btn-reset-today');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Clear form? (saved entry stays)')) {
          this.currentCheckin = this.createDefaultCheckin();
          this.render();
        }
      });
    }

    const header = this.getElement('journal-collapsible-header');
    const card = this.getElement('journal-collapsible-card');
    if (header && card) {
      header.addEventListener('click', () => card.classList.toggle('expanded'));
    }

    const search = this.getElement('journal-search');
    if (search) {
      search.addEventListener('input', e => {
        clearTimeout(this.searchDebounce);
        this.searchDebounce = setTimeout(() => {
          this.searchQuery = e.target.value;
          this.render();
          card?.classList.add('expanded');
        }, 300);
      });
    }
  }

  renderJournalEntry(entry) {
    const date = new Date(entry.timestamp);
    const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const badges = [];
    if (entry.dayCheckin) badges.push('<span class="badge badge-success" style="font-size:0.75rem">☀️ Day</span>');
    if (entry.nightCheckin) badges.push('<span class="badge badge-success" style="font-size:0.75rem">🌙 Night</span>');
    
    return `
      <div class="card" style="border-left:4px solid var(--neuro-accent)">
        <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
          <div>
            <div class="font-bold text-lg" style="color:var(--neuro-text)">${dateStr}</div>
            <div class="text-sm" style="color:var(--neuro-text-light)">${timeStr}</div>
            ${badges.length ? `<div class="flex gap-2 mt-2">${badges.join('')}</div>` : ''}
          </div>
          <div class="text-right"><div class="text-3xl font-bold" style="color:var(--neuro-accent)">${entry.energy}</div><div class="text-sm" style="color:var(--neuro-text-light)">Energy</div></div>
        </div>
        ${(entry.moodTags || []).length ? `<div class="flex flex-wrap gap-2" style="margin-bottom: 1rem;">${entry.moodTags.map(m => `<span class="badge" style="font-size:0.85rem">${this.getMoodEmoji(m)} ${this.capitalize(m)}</span>`).join('')}</div>` : ''}
        ${entry.notes ? `<div style="color:var(--neuro-text);line-height:1.6;white-space:pre-wrap">${entry.notes}</div>` : ''}
        ${entry.chakras ? `<div class="mt-4 pt-4" style="border-top:1px solid rgba(0,0,0,.05)"><div class="text-sm font-bold" style="color:var(--neuro-text-light);margin-bottom: 0.5rem;">Chakras:</div><div class="grid grid-cols-4 md:grid-cols-7 gap-2">${this.CHAKRAS.map(c => `<div class="text-center"><div class="text-xs" style="color:var(--neuro-text-light);margin-bottom: 0.25rem;">${c.name}</div><div class="text-sm font-bold" style="color:${c.color}">${entry.chakras[c.key] || 5}</div></div>`).join('')}</div></div>` : ''}
      </div>`;
  }

  renderWeeklyChart(points) {
    const parent = document.querySelector('#energy-tab .card-body');
    if (!parent) return '<div style="padding:2rem;color:var(--neuro-text-light)">Loading...</div>';
    
    const pxW = parent.clientWidth;
    const pxH = parent.clientHeight;
    const topSpace = 20;
    const extraSpace = 105;
    const viewBoxHeight = pxH + extraSpace + topSpace;
    const narrow = 0.55;
    const short = 1.00;
    const gapPc = 0.01;
    const dayW = pxW / 7;
    const rowH = (pxH / 10) * short;
    const gap = dayW * gapPc;
    const barW = dayW * narrow - gap;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const barColour = v => {
      if (v === 0) return '#e04b4b';
      if (v <= 3) return '#f08a4b';
      if (v <= 6) return '#f6c24a';
      if (v <= 9) return '#6fcf97';
      return '#ffd700';
    };
    
    let svg = `<svg viewBox="0 ${-topSpace} ${pxW} ${viewBoxHeight}" style="width:100%;height:100%;display:block">`;
    
    for (let r = 0; r <= 10; r += 2) {
      const y = pxH - r * rowH;
      svg += `<line x1="0" y1="${y}" x2="${pxW}" y2="${y}" stroke="rgba(0,0,0,.08)" stroke-width="1"/>`;
      svg += `<text x="6" y="${y + 5}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle">${r}</text>`;
    }
    
    points.forEach((p, i) => {
      const val = Math.min(10, Math.max(0, p));
      const barH = val === 0 ? 6 : val * rowH;
      const x = i * dayW + gap;
      const cx = x + barW / 2;
      const y = pxH - barH;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2" fill="${barColour(val)}"/>`;
      const labelY = pxH + 22;
      svg += `<text x="${cx}" y="${labelY}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle" transform="rotate(-90,${cx},${labelY})">${days[i]}</text>`;
    });
    
    const nonZero = points.filter(v => v > 0);
    const avg = nonZero.length ? (nonZero.reduce((s, v) => s + v, 0) / nonZero.length).toFixed(1) : '—';
    svg += `<text x="${pxW / 2}" y="${pxH + 85}" font-size="14" font-weight="bold" fill="var(--neuro-text)" text-anchor="middle">7 Days Average: ${avg}</text></svg>`;
    return svg;
  }

  renderRadarChart(values, size) {
    const keys = this.CHAKRAS.map(c => c.key);
    const cx = size / 2;
    const cy = size / 2;
    const rMax = size / 2 - 24;
    
    const pts = keys.map((k, i) => {
      const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
      const v = Math.max(0, Math.min(10, values[k] || 0));
      return `${cx + Math.cos(a) * rMax * (v / 10)},${cy + Math.sin(a) * rMax * (v / 10)}`;
    }).join(' ');
    
    return `
      <svg viewBox="0 0 ${size} ${size}" style="max-width:100%;height:auto">
        ${[0.25, 0.5, 0.75, 1].map(r => `<circle cx="${cx}" cy="${cy}" r="${rMax * r}" stroke="#e6eef4" fill="none" stroke-width="1"/>`).join('')}
        ${keys.map((k, i) => {
          const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          return `<line x1="${cx}" y1="${cy}" x2="${cx + Math.cos(a) * rMax}" y2="${cy + Math.sin(a) * rMax}" stroke="#eef6fa" stroke-width="1"/>`;
        }).join('')}
        <polygon points="${pts}" fill="rgba(102,126,234,.2)" stroke="var(--neuro-accent)" stroke-width="2"/>
        ${this.CHAKRAS.map((c, i) => {
          const a = (Math.PI * 2 * i) / keys.length - Math.PI / 2;
          const x = cx + Math.cos(a) * (rMax + 12);
          const y = cy + Math.sin(a) * (rMax + 12);
          return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--neuro-text-light)">${c.name}</text>`;
        }).join('')}
      </svg>`;
  }

  buildStyles() {
    return `
      <style>
        .card-flex { display: flex; flex-direction: column; }
        .card-body { flex: 1 1 0; min-height: 0; width: 100%; }
        .weekly-chart-box { aspect-ratio: 7/10; max-width: 100%; max-height: 100%; margin: auto; display: flex; align-items: center; justify-content: center; }
        .chakra-row { display: flex; gap: 12px; padding: 8px 2px; }
        .chakra-mini-card { flex: 1 1 0; min-width: 112px; background: var(--neuro-bg); border-radius: 12px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; box-shadow: 8px 8px 18px var(--neuro-shadow-dark), -8px -8px 18px var(--neuro-shadow-light); }
        .chakra-icon { width: 36px; height: 36px; border-radius: 50%; color: white; display: grid; place-items: center; font-weight: 700; font-size: 0.9rem; box-shadow: inset 4px 4px 8px rgba(0,0,0,.1), inset -4px -4px 8px rgba(255,255,255,.2); }
        .chakra-pulse { position: absolute; inset: -6px; border-radius: 16px; pointer-events: none; transition: all 260ms ease; }
        .chip { background: rgba(31,45,61,0.04); border: 1px solid rgba(0,0,0,0.02); padding: 8px 16px; border-radius: 999px; cursor: pointer; font-size: 0.9rem; transition: all .2s; }
        .chip.active { background: linear-gradient(90deg, rgba(246,194,74,0.16), rgba(110,231,183,0.12)); box-shadow: inset 4px 4px 8px rgba(0,0,0,.04), inset -4px -4px 8px rgba(255,255,255,.7); }
        .calc-expandable-header { padding: 24px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
        .calc-expandable-header h3 { margin: 0; font-size: 1.1rem; color: var(--neuro-text); }
        .chevron { font-size: 1.5rem; transition: transform var(--transition-normal); color: var(--neuro-accent); }
        .calc-expandable-card.expanded .chevron { transform: rotate(90deg); }
        .calc-expandable-content { max-height: 0; overflow: hidden; transition: max-height var(--transition-slow); }
        .calc-expandable-card.expanded .calc-expandable-content { max-height: 5000px; padding: 0 24px 24px; }
      </style>
    `;
  }

  getMoodEmoji(mood) {
    const map = {
      grounded: '🌍',
      anxious: '😰',
      calm: '😌',
      happy: '😊',
      creative: '🎨',
      tired: '😴',
      focused: '🎯',
      grateful: '🙏',
      curious: '🤔',
      confident: '💪'
    };
    return map[mood] || '😊';
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

if (typeof window !== 'undefined') window.EnergyEngineEnhanced = EnergyEngineEnhanced;
export default EnergyEngineEnhanced;