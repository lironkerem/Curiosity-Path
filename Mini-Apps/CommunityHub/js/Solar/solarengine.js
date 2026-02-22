/**
 * SOLARENGINE.JS (OPTIMIZED)
 * Complete solar cycle management: sun position calculations, visualizations,
 * solar practice rooms, and all sun-related functionality
 */

const SolarEngine = {
  // User location — resolved from browser geolocation on init, falls back to UTC-neutral coords
  location: {
    latitude: 31.0,
    longitude: 0.0,
    name: 'Default'
  },

  // Current solar data
  currentSolarData: null,
  currentSolarRoom: null,

  // Solar Practice Room Configurations (4 rooms based on seasons)
  solarRooms: [
    {
      season: 'spring',
      icon: '🌱',
      roomName: 'Spring Awakening',
      description: 'Renewal energy and fresh beginnings',
      roomId: 'spring-equinox',
      energy: 'Renewal, Growth, Awakening',
      practices: [
        'Dawn meditation',
        'Renewal rituals',
        'Energy activation',
        'New beginning visualization'
      ]
    },
    {
      season: 'summer',
      icon: '☀️',
      roomName: 'Summer Radiance',
      description: 'Peak vitality and expansive energy',
      roomId: 'summer-solstice',
      energy: 'Vitality, Expansion, Power',
      practices: [
        'Solar noon meditation',
        'Fire ceremony',
        'Peak energy practice',
        'Celebration ritual'
      ]
    },
    {
      season: 'autumn',
      icon: '🍂',
      roomName: 'Autumn Harvest',
      description: 'Gratitude and preparation for rest',
      roomId: 'autumn-equinox',
      energy: 'Gratitude, Harvest, Balance',
      practices: [
        'Gratitude meditation',
        'Harvest ritual',
        'Balance practice',
        'Reflection ceremony'
      ]
    },
    {
      season: 'winter',
      icon: '❄️',
      roomName: 'Winter Stillness',
      description: 'Deep rest and inner contemplation',
      roomId: 'winter-solstice',
      energy: 'Rest, Stillness, Contemplation',
      practices: [
        'Deep rest meditation',
        'Inner journey',
        'Stillness practice',
        'Contemplative silence'
      ]
    }
  ],

  // Initialize solar engine
  init() {
    // Guard against double-initialization
    if (this._initialized) return;
    this._initialized = true;

    console.log('☀️ Solar Engine Initialized');

    // Check if SunCalc is available
    if (typeof SunCalc === 'undefined') {
      console.error('❌ SunCalc library not loaded! Sun visualizations will not work.');
      return;
    }

    // Resolve user location from browser, then run first update
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.location = {
            latitude:  pos.coords.latitude,
            longitude: pos.coords.longitude,
            name:      'Your Location'
          };
          this.updateAll();
        },
        () => {
          // Permission denied or unavailable — run with fallback coords
          this.updateAll();
        },
        { timeout: 5000, maximumAge: 3600000 }
      );
    } else {
      this.updateAll();
    }

    // Update every 10 minutes
    setInterval(() => this.updateAll(), SOLAR_CONSTANTS.UPDATE_INTERVAL_MS);
  },

  // Update all solar data
  updateAll() {
    this.updateSolarData();
    this.updateSolarVisualization();
    this.updateSolarRoom();
    this.renderSolarCard();
  },

  // Set custom location
  setLocation(latitude, longitude, name) {
    this.location = { latitude, longitude, name };
    this.updateAll();
  },

  // ===== SUN POSITION CALCULATIONS =====
  updateSolarData() {
    if (typeof SunCalc === 'undefined') {
      console.error('❌ SunCalc not available in updateSolarData');
      return;
    }
    
    const now = new Date();
    const { latitude, longitude } = this.location;

    // Get sun times from SunCalc
    const sunTimes = SunCalc.getTimes(now, latitude, longitude);
    const sunPos = SunCalc.getPosition(now, latitude, longitude);

    // Calculate declination
    const declination = this.calculateSunDeclination(now);
    const seasonInfo = this.getSeasonInfo(now);
    const currentSeason = this.getCurrentSeason();
    const nextSeasonInfo = this.getNextSeasonInfo(now);

    this.currentSolarData = {
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      solarNoon: sunTimes.solarNoon,
      declination: declination,
      seasonInfo: seasonInfo,
      currentSeason: currentSeason,
      nextSeasonName: nextSeasonInfo.name,
      daysToNextSeason: nextSeasonInfo.days,
      position: sunPos
    };

    // Update UI
    this.renderSolarInfo();
  },

  renderSolarInfo() {
    const data = this.currentSolarData;
    if (!data) return;

    // Update sun times
    const sunriseEl = document.getElementById('sunrise');
    if (sunriseEl) sunriseEl.textContent = this.formatTime(data.sunrise);

    const sunsetEl = document.getElementById('sunset');
    if (sunsetEl) sunsetEl.textContent = this.formatTime(data.sunset);

    const solarNoonEl = document.getElementById('solarNoon');
    if (solarNoonEl) solarNoonEl.textContent = this.formatTime(data.solarNoon);

    // Update declination
    const declinationDir = data.declination >= 0 ? 'N' : 'S';
    const declinationEl = document.getElementById('solarDeclination');
    if (declinationEl) {
      const valueEl = declinationEl.querySelector('.decl-value');
      if (valueEl) {
        valueEl.textContent = `${Math.abs(data.declination).toFixed(1)}° ${declinationDir}`;
      }
    }

    // Update season info
    const seasonInfoEl = document.getElementById('seasonInfo');
    if (seasonInfoEl) seasonInfoEl.textContent = data.seasonInfo;
  },

  calculateSunDeclination(date) {
    // Declination varies from -23.44° (winter solstice) to +23.44° (summer solstice)
    const dayOfYear = this.getDayOfYear(date);
    const angle = 2 * Math.PI * (dayOfYear - 81) / 365;
    const declination = 23.44 * Math.sin(angle);
    return declination;
  },

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },

  getSeasonInfo(now) {
    const year = now.getFullYear();
    
    // Approximate equinox/solstice dates
    const springEquinox = new Date(year, 2, 20); // March 20
    const summerSolstice = new Date(year, 5, 21); // June 21
    const autumnEquinox = new Date(year, 8, 22); // September 22
    const winterSolstice = new Date(year, 11, 21); // December 21
    
    const events = [
      { name: 'Spring Equinox', date: springEquinox },
      { name: 'Summer Solstice', date: summerSolstice },
      { name: 'Autumn Equinox', date: autumnEquinox },
      { name: 'Winter Solstice', date: winterSolstice },
    ];

    // Find next event
    let nextEvent = null;
    let minDiff = Infinity;

    events.forEach(event => {
      let diff = event.date - now;
      if (diff < 0) {
        // Event already passed this year, check next year
        event.date = new Date(year + 1, event.date.getMonth(), event.date.getDate());
        diff = event.date - now;
      }
      if (diff < minDiff) {
        minDiff = diff;
        nextEvent = event;
      }
    });

    const daysUntil = Math.ceil(minDiff / (1000 * 60 * 60 * 24));
    return `${daysUntil} days to ${nextEvent.name}`;
  },

  getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDate();
    
    // Determine hemisphere based on location
    const isNorthernHemisphere = this.location.latitude >= 0;
    
    let season;
    
    if (isNorthernHemisphere) {
      if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
        season = 'spring';
      } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 20)) {
        season = 'summer';
      } else if ((month === 8 && day >= 21) || month === 9 || month === 10 || (month === 11 && day <= 20)) {
        season = 'autumn';
      } else {
        season = 'winter';
      }
    } else {
      // Southern hemisphere seasons are reversed
      if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
        season = 'autumn';
      } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 20)) {
        season = 'winter';
      } else if ((month === 8 && day >= 21) || month === 9 || month === 10 || (month === 11 && day <= 20)) {
        season = 'spring';
      } else {
        season = 'summer';
      }
    }
    
    return season;
  },

  getNextSeasonInfo(now) {
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    const seasonDates = [
      { name: 'Spring', month: 2, day: 20 },
      { name: 'Summer', month: 5, day: 21 },
      { name: 'Autumn', month: 8, day: 22 },
      { name: 'Winter', month: 11, day: 21 }
    ];
    
    // Find next season
    for (let season of seasonDates) {
      let seasonDate = new Date(year, season.month, season.day);
      if (seasonDate > now) {
        const daysUntil = Math.ceil((seasonDate - now) / (1000 * 60 * 60 * 24));
        return { name: season.name, days: daysUntil };
      }
    }
    
    // If all dates have passed, return first season of next year
    const nextSeasonDate = new Date(year + 1, seasonDates[0].month, seasonDates[0].day);
    const daysUntil = Math.ceil((nextSeasonDate - now) / (1000 * 60 * 60 * 24));
    return { name: seasonDates[0].name, days: daysUntil };
  },

  // ===== SOLAR VISUALIZATION =====
  updateSolarVisualization() {
    if (!this.currentSolarData) return;
    const now = new Date();
    this.drawSolarArc(this.currentSolarData.declination, now);
  },

  drawSolarArc(declination, date) {
    const svg = document.getElementById('solarSvg');
    if (!svg) return;

    const width = 280;
    const height = 180;
    
    svg.innerHTML = '';

    // Define solstice/equinox positions
    const centerX = width / 2;
    const baseY = height - 30;
    const arcRadius = 100;
    
    // Draw the arc representing yearly cycle
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const startX = centerX - arcRadius;
    const endX = centerX + arcRadius;
    const arcTop = baseY - arcRadius;
    
    arc.setAttribute('d', `M ${startX} ${baseY} Q ${centerX} ${arcTop} ${endX} ${baseY}`);
    arc.setAttribute('stroke', 'var(--season-accent)');
    arc.setAttribute('stroke-width', '3');
    arc.setAttribute('fill', 'none');
    arc.setAttribute('opacity', '0.6');
    svg.appendChild(arc);

    // Add season labels
    this.addSeasonLabel(svg, startX, baseY, '🍂', 'Autumn');
    this.addSeasonLabel(svg, centerX, arcTop - 10, '☀️', 'Summer');
    this.addSeasonLabel(svg, endX, baseY, '🌱', 'Spring');
    this.addSeasonLabel(svg, centerX, baseY + 25, '❄️', 'Winter');

    // Calculate current position on arc based on declination
    const normalized = (declination + 23.44) / 46.88; // 0 to 1
    const angle = Math.PI * normalized; // 0 to PI
    
    const currentX = centerX - arcRadius * Math.cos(angle);
    const currentY = baseY - arcRadius * Math.sin(angle);

    // Draw current sun position
    const sun = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sun.setAttribute('cx', currentX);
    sun.setAttribute('cy', currentY);
    sun.setAttribute('r', '12');
    sun.setAttribute('fill', '#fbbf24');
    sun.setAttribute('stroke', '#f59e0b');
    sun.setAttribute('stroke-width', '2');
    svg.appendChild(sun);

    // Add rays
    for (let i = 0; i < 8; i++) {
      const rayAngle = (i * Math.PI) / 4;
      const rayLength = 8;
      const ray = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ray.setAttribute('x1', currentX + Math.cos(rayAngle) * 15);
      ray.setAttribute('y1', currentY + Math.sin(rayAngle) * 15);
      ray.setAttribute('x2', currentX + Math.cos(rayAngle) * (15 + rayLength));
      ray.setAttribute('y2', currentY + Math.sin(rayAngle) * (15 + rayLength));
      ray.setAttribute('stroke', '#fbbf24');
      ray.setAttribute('stroke-width', '2');
      svg.appendChild(ray);
    }
  },

  addSeasonLabel(svg, x, y, emoji, text) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', 'var(--text-muted)');
    label.setAttribute('font-size', '12');
    label.setAttribute('font-weight', '600');
    label.textContent = `${emoji} ${text}`;
    svg.appendChild(label);
  },

  // ===== SOLAR ROOM MANAGEMENT =====
  updateSolarRoom() {
    const currentSeason = this.getCurrentSeason();
    const room = this.solarRooms.find(r => r.season === currentSeason);
    
    if (room && room !== this.currentSolarRoom) {
      this.currentSolarRoom = room;
      this.renderSolarRoom(room);
      console.log(`☀️ Solar room changed to: ${room.roomName}`);
    }
  },

  renderSolarRoom(room) {
    // Update room icon
    const iconEl = document.getElementById('solarRoomIcon');
    if (iconEl) iconEl.textContent = room.icon;

    // Update room name
    const nameEl = document.getElementById('solarRoomName');
    if (nameEl) nameEl.textContent = room.roomName;

    // Update room description
    const descEl = document.getElementById('solarRoomDesc');
    if (descEl) descEl.textContent = room.description;

    // Update room energy in the practice room data attribute
    const roomEl = document.getElementById('solarPracticeRoom');
    if (roomEl) {
      roomEl.setAttribute('data-room-id', room.roomId);
      roomEl.setAttribute('data-room-energy', room.energy);
    }

    // Presence count is kept live by _refreshOuterCard() — no random update here
  },

  getCurrentRoom() {
    return this.currentSolarRoom;
  },

  // ===== PRACTICE ROOM JOINING =====

  // Maps roomId → { file, globalName } for lazy loading
  _roomFileMap: {
    'spring-equinox':  { file: 'spring-solar-room.js',  globalName: 'SpringSolarRoom'  },
    'summer-solstice': { file: 'summer-solar-room.js',  globalName: 'SummerSolarRoom'  },
    'autumn-equinox':  { file: 'autumn-solar-room.js',  globalName: 'AutumnSolarRoom'  },
    'winter-solstice': { file: 'winter-solar-room.js',  globalName: 'WinterSolarRoom'  },
  },

  /**
   * Load a solar room file on demand, then enter it.
   * If the global already exists the script is skipped.
   * @param {string} roomId
   * @private
   */
  _loadAndEnterRoom(roomId) {
    const meta = this._roomFileMap[roomId];
    if (!meta) {
      if (window.Core) window.Core.showToast(`☀️ Unknown room: ${roomId}`);
      return;
    }

    const enter = () => {
      const instance = window[meta.globalName];
      if (instance) {
        instance.enterRoom();
      } else {
        if (window.Core) window.Core.showToast(`⚠️ ${roomId} failed to initialise`);
      }
    };

    // Already loaded — enter immediately
    if (window[meta.globalName]) {
      enter();
      return;
    }

    // Lazy-load the script, then enter
    const base = '/Mini-Apps/CommunityHub/js/Solar/';
    const script = document.createElement('script');
    script.src = base + meta.file;
    script.onload = () => {
      // Give the room's init() a tick to complete before entering
      setTimeout(enter, 50);
    };
    script.onerror = () => {
      if (window.Core) window.Core.showToast(`⚠️ Failed to load ${meta.file}`);
    };
    document.body.appendChild(script);
  },

  joinSolarRoom() {
    if (!this.currentSolarRoom) {
      if (window.Core) window.Core.showToast('⚠️ Solar room not ready');
      return;
    }
    this._loadAndEnterRoom(this.currentSolarRoom.roomId);
  },

  // ===== UTILITIES =====
  formatTime(date) {
    if (!date || isNaN(date.getTime())) return 'N/A';
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  },

  formatDate(date) {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  },

  // Get current solar data for external use
  getSolarData() {
    return this.currentSolarData;
  },

  // ===== RENDER SOLAR CARD TO CONTAINER =====
  renderSolarCard() {
    const container = document.getElementById('solarContainer');
    if (!container) {
      console.warn('SolarEngine: solarContainer not found in DOM');
      return;
    }

    if (!this.currentSolarData || !this.currentSolarRoom) {
      container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">Loading solar data...</p>';
      return;
    }

    const room = this.currentSolarRoom;
    const data = this.currentSolarData;
    const devMode = window.Core && window.Core.config && window.Core.config.DEV_MODE;
    
    // Capitalize season name
    const seasonDisplay = data.currentSeason.charAt(0).toUpperCase() + data.currentSeason.slice(1);

    container.innerHTML = `
      <div class="celestial-card-full solar-card">
        <div class="celestial-content-horizontal">
          <!-- Solar Visual -->
          <div class="celestial-visual-section">
            <div class="solar-visual" id="solarVisual">
              <svg width="280" height="180" viewBox="0 0 280 180" id="solarSvg">
                <!-- Solar arc will be drawn here -->
              </svg>
            </div>
          </div>

          <!-- Solar Info (matching Lunar style) -->
          <div class="celestial-info-section">
            <div class="celestial-info-title">Solar Position & Seasons</div>
            <div class="solar-info">
              <div class="solar-season-name">${seasonDisplay}</div>
              <div class="solar-declination">Declination: ${data.declination > 0 ? '+' : ''}${data.declination.toFixed(1)}°</div>
            </div>
            <div class="next-season">
              Next: ${data.nextSeasonName} (${data.daysToNextSeason} days)
            </div>
          </div>

          <!-- Solar Times -->
          <div class="celestial-times-section">
            <div class="celestial-time">
              <span class="time-label">Sunrise</span>
              <span class="time-value" id="sunrise">${this.formatTime(data.sunrise)}</span>
            </div>
            <div class="celestial-time">
              <span class="time-label">Sunset</span>
              <span class="time-value" id="sunset">${this.formatTime(data.sunset)}</span>
            </div>
          </div>
        </div>

        <!-- Integrated Solar Practice Room -->
        <div class="celestial-practice-room" data-room-type="solar" id="solarPracticeRoom">
          <div class="room-divider"></div>
          <div class="room-content-inline">
            <div class="room-header-inline">
              <div class="room-icon-inline" id="solarRoomIcon">${room.icon}</div>
              <div class="room-info-inline">
                <div class="room-name-inline" id="solarRoomName">${room.roomName}</div>
                <div class="room-desc-inline" id="solarRoomDesc">${room.description}</div>
              </div>
            </div>
            <div class="room-meta-inline">
              <div class="room-energy">
                <div class="energy-pulse" style="background: var(--ring-guiding);"></div>
                <span id="solarRoomPresence">0 present</span>
              </div>
              <button class="join-btn-inline" onclick="SolarEngine.joinSolarRoom()">Join Space</button>
            </div>
          </div>
        </div>

        ${devMode ? this.renderDevModeSection() : ''}
      </div>
    `;

    // Redraw solar visualization after rendering
    this.updateSolarVisualization();

    // Fetch live presence count for outer card
    this._refreshOuterCard();
  },

  // Fetch live participant count for outer solar card and subscribe to realtime updates
  _refreshOuterCard() {
    if (!window.CommunityDB || !CommunityDB.ready) {
      const _interval = setInterval(() => {
        if (!window.CommunityDB?.ready) return;
        clearInterval(_interval);
        this._refreshOuterCard();
      }, 500);
      return;
    }

    const room = this.currentSolarRoom;
    if (!room) return;
    const roomId = `${room.season}-solar`;

    const _doCount = async () => {
      try {
        const participants = await CommunityDB.getRoomParticipants(roomId);
        const el = document.getElementById('solarRoomPresence');
        if (el) el.textContent = `${participants.length} present`;
      } catch(e) {
        console.warn('[SolarEngine] _refreshOuterCard error:', e);
      }
    };

    _doCount();

    // Realtime
    if (this._outerCardSub) {
      try { this._outerCardSub.unsubscribe(); } catch(e) {}
    }
    this._outerCardSub = CommunityDB.subscribeToPresence(_doCount);
  },

  // Render DEV MODE section with all solar rooms
  renderDevModeSection() {
    return `
      <div style="margin-top: 24px; padding: 20px; background: var(--surface); border-radius: var(--radius-lg); border: 2px dashed var(--primary);">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); margin-bottom: 16px;">
          🔧 DEV MODE: All Solar Rooms
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
          ${this.solarRooms.map(room => `
            <button 
              onclick="SolarEngine.devJoinRoom('${room.roomId}')"
              style="padding: 12px; background: var(--season-mood); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all 0.2s;"
              onmouseover="this.style.background='var(--border)'"
              onmouseout="this.style.background='var(--season-mood)'"
            >
              <div style="font-size: 24px; margin-bottom: 4px;">${room.icon}</div>
              <div style="font-size: 13px; font-weight: 600; color: var(--text);">${room.roomName}</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px; text-transform: capitalize;">${room.season}</div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  },

  // DEV MODE: Join any room directly (also lazy-loads)
  devJoinRoom(roomId) {
    console.log(`🔧 DEV MODE: Joining ${roomId}`);
    this._loadAndEnterRoom(roomId);
  }
};

// Expose globally
window.SolarEngine = SolarEngine;
console.log('☀️ Solar Engine loaded (optimized)');
