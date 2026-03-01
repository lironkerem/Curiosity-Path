/**
 * SOLARENGINE.JS
 * Solar cycle management: sun position calculations, visualizations,
 * seasonal practice rooms, and all sun-related functionality.
 */

const SolarEngine = {

  location: { latitude: 31.0, longitude: 0.0, name: 'Default' },
  currentSolarData: null,
  currentSolarRoom: null,

  solarRooms: [
    {
      season: 'spring', icon: '🌱', roomName: 'Spring Awakening', roomId: 'spring-equinox',
      description: 'Renewal energy and fresh beginnings',
      energy: 'Renewal, Growth, Awakening',
      practices: ['Dawn meditation', 'Renewal rituals', 'Energy activation', 'New beginning visualization'],
    },
    {
      season: 'summer', icon: '☀️', roomName: 'Summer Radiance', roomId: 'summer-solstice',
      description: 'Peak vitality and expansive energy',
      energy: 'Vitality, Expansion, Power',
      practices: ['Solar noon meditation', 'Fire ceremony', 'Peak energy practice', 'Celebration ritual'],
    },
    {
      season: 'autumn', icon: '🍂', roomName: 'Autumn Harvest', roomId: 'autumn-equinox',
      description: 'Gratitude and preparation for rest',
      energy: 'Gratitude, Harvest, Balance',
      practices: ['Gratitude meditation', 'Harvest ritual', 'Balance practice', 'Reflection ceremony'],
    },
    {
      season: 'winter', icon: '❄️', roomName: 'Winter Stillness', roomId: 'winter-solstice',
      description: 'Deep rest and inner contemplation',
      energy: 'Rest, Stillness, Contemplation',
      practices: ['Deep rest meditation', 'Inner journey', 'Stillness practice', 'Contemplative silence'],
    },
  ],

  // ============================================================================
  // INIT
  // ============================================================================

  init() {
    if (this._initialized) return;
    this._initialized = true;
    console.log('☀️ Solar Engine Initialized');

    if (typeof SunCalc === 'undefined') {
      console.error('❌ SunCalc library not loaded! Sun visualizations will not work.');
      return;
    }

    const run = () => this.updateAll();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.location = { latitude: coords.latitude, longitude: coords.longitude, name: 'Your Location' };
          run();
        },
        run,
        { timeout: 5000, maximumAge: 3_600_000 }
      );
    } else {
      run();
    }

    setInterval(run, SOLAR_CONSTANTS.UPDATE_INTERVAL_MS);
  },

  updateAll() {
    this.updateSolarData();
    this.updateSolarVisualization();
    this.updateSolarRoom();
    this.renderSolarCard();
  },

  setLocation(latitude, longitude, name) {
    this.location = { latitude, longitude, name };
    this.updateAll();
  },

  // ============================================================================
  // SUN POSITION CALCULATIONS
  // ============================================================================

  updateSolarData() {
    if (typeof SunCalc === 'undefined') { console.error('❌ SunCalc not available'); return; }

    const now               = new Date();
    const { latitude, longitude } = this.location;
    const sunTimes          = SunCalc.getTimes(now, latitude, longitude);
    const declination       = this.calculateSunDeclination(now);
    const { name: nextSeasonName, days: daysToNextSeason } = this._getNextTransition(now);

    this.currentSolarData = {
      sunrise:         sunTimes.sunrise,
      sunset:          sunTimes.sunset,
      solarNoon:       sunTimes.solarNoon,
      declination,
      seasonInfo:      this.getSeasonInfo(now),
      currentSeason:   this.getCurrentSeason(),
      nextSeasonName,
      daysToNextSeason,
      position:        SunCalc.getPosition(now, latitude, longitude),
    };

    this.renderSolarInfo();
  },

  renderSolarInfo() {
    const data = this.currentSolarData;
    if (!data) return;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('sunrise',   this.formatTime(data.sunrise));
    set('sunset',    this.formatTime(data.sunset));
    set('solarNoon', this.formatTime(data.solarNoon));
    set('seasonInfo', data.seasonInfo);

    const decl = document.getElementById('solarDeclination');
    if (decl) {
      const v = decl.querySelector('.decl-value');
      if (v) v.textContent = `${Math.abs(data.declination).toFixed(1)}° ${data.declination >= 0 ? 'N' : 'S'}`;
    }
  },

  calculateSunDeclination(date) {
    const dayOfYear = this.getDayOfYear(date);
    return 23.44 * Math.sin(2 * Math.PI * (dayOfYear - 81) / 365);
  },

  getDayOfYear(date) {
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86_400_000);
  },

  // ============================================================================
  // ASTRONOMICAL SEASON DATES (Jean Meeus, Astronomical Algorithms Ch. 27)
  // Cached per year. Zero gaps between seasons guaranteed.
  // ============================================================================

  getSeasonDates(year) {
    if (!this._seasonDatesCache) this._seasonDatesCache = {};
    if (this._seasonDatesCache[year]) return this._seasonDatesCache[year];

    const Y = (year - 2000) / 1000;

    const _jde0 = season => {
      const t = {
        spring: [2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057],
        summer: [2451716.56767, 365241.62603,  0.00325,  0.00888, -0.00030],
        autumn: [2451810.21715, 365242.01767, -0.11575,  0.00337,  0.00078],
        winter: [2451900.05952, 365242.74049, -0.06223, -0.00823,  0.00032],
      }[season];
      return t[0] + t[1]*Y + t[2]*Y**2 + t[3]*Y**3 + t[4]*Y**4;
    };

    const _correct = jde => {
      const T  = (jde - 2451545.0) / 36525;
      const W  = 35999.373 * T - 2.47;
      const dL = 1 + 0.0334 * Math.cos(W * Math.PI / 180) + 0.0007 * Math.cos(2 * W * Math.PI / 180);
      const S  = [
        [485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],
        [182, 27.85,445267.112],[156, 73.14,45036.886],[136,171.52,22518.443],
        [ 77,222.54, 65928.934],[ 74,296.72,  3034.906],[ 70,243.58, 9037.513],
        [ 58,119.81, 33718.148],[ 52,297.17,   150.678],[ 50, 21.02, 2281.226],
      ].reduce((s, [a, b, c]) => s + a * Math.cos((b + c * T) * Math.PI / 180), 0);
      return jde + (0.00001 * S) / dL;
    };

    const toDate    = jde => new Date((jde - 2440587.5) * 86_400_000);
    const dayBefore = d   => new Date(d.getTime() - 86_400_000);
    const start     = s   => toDate(_correct(_jde0(s)));

    const sp = start('spring'), su = start('summer'), au = start('autumn'), wi = start('winter');
    const spNext = toDate(_correct(_jde0('spring') + (Y + 1 / 1000 - Y) * 365242.37404)); // next year spring approx — recalculate properly:
    // Re-derive next year's spring properly
    const spNextProper = toDate(_correct(
      (() => {
        const Y2 = (year + 1 - 2000) / 1000;
        const t = [2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057];
        return t[0] + t[1]*Y2 + t[2]*Y2**2 + t[3]*Y2**3 + t[4]*Y2**4;
      })()
    ));

    const dates = {
      spring: { start: sp,  end: dayBefore(su) },
      summer: { start: su,  end: dayBefore(au) },
      autumn: { start: au,  end: dayBefore(wi) },
      winter: { start: wi,  end: dayBefore(spNextProper) },
    };

    this._seasonDatesCache[year] = dates;
    return dates;
  },

  getCurrentSeason() {
    const now   = new Date();
    const year  = now.getFullYear();
    const north = this.location.latitude >= 0;
    const southMap = { spring: 'autumn', summer: 'winter', autumn: 'spring', winter: 'summer' };

    // Check previous year's winter (spans year boundary)
    const prev = this.getSeasonDates(year - 1);
    if (now >= prev.winter.start && now <= prev.winter.end) return north ? 'winter' : 'summer';

    const curr = this.getSeasonDates(year);
    for (const season of ['spring', 'summer', 'autumn', 'winter']) {
      const { start, end } = curr[season];
      if (now >= start && now <= end) return north ? season : southMap[season];
    }
    return 'winter';
  },

  /**
   * Returns all four upcoming season transitions for a given year, sorted by date.
   * Used by both getSeasonInfo() and _getNextTransition().
   * @private
   */
  _getUpcomingTransitions(now) {
    const year = now.getFullYear();
    const curr = this.getSeasonDates(year);
    const next = this.getSeasonDates(year + 1);
    return [
      { name: 'Spring Equinox', date: curr.spring.start },
      { name: 'Summer Solstice', date: curr.summer.start },
      { name: 'Autumn Equinox',  date: curr.autumn.start },
      { name: 'Winter Solstice', date: curr.winter.start },
      { name: 'Spring Equinox',  date: next.spring.start },
    ].filter(e => e.date > now)
     .sort((a, b) => a.date - b.date);
  },

  /** Returns the "X days to Next Season Name" string shown on the outer card. */
  getSeasonInfo(now) {
    const nearest = this._getUpcomingTransitions(now)[0];
    const days    = Math.ceil((nearest.date - now) / 86_400_000);
    return `${days} days to ${nearest.name}`;
  },

  /** Returns { name, days } for the next season transition. */
  _getNextTransition(now) {
    const nearest = this._getUpcomingTransitions(now)[0];
    return {
      name: nearest.name.split(' ')[0], // 'Spring', 'Summer', etc.
      days: Math.ceil((nearest.date - now) / 86_400_000),
    };
  },

  // Keep public alias for any external callers
  getNextSeasonInfo(now) { return this._getNextTransition(now); },

  // ============================================================================
  // SOLAR VISUALIZATION
  // ============================================================================

  updateSolarVisualization() {
    if (!this.currentSolarData) return;
    this.drawSolarArc(this.currentSolarData.declination);
  },

  drawSolarArc(declination) {
    const svg = document.getElementById('solarSvg');
    if (!svg) return;

    const W = 280, H = 180, R = 100;
    const cx = W / 2, baseY = H - 30, arcTop = baseY - R;
    svg.innerHTML = '';

    // Arc
    const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arc.setAttribute('d', `M ${cx - R} ${baseY} Q ${cx} ${arcTop} ${cx + R} ${baseY}`);
    arc.setAttribute('stroke', 'var(--season-accent)');
    arc.setAttribute('stroke-width', '3');
    arc.setAttribute('fill', 'none');
    arc.setAttribute('opacity', '0.6');
    svg.appendChild(arc);

    // Season labels
    this.addSeasonLabel(svg, cx - R, baseY, '🍂', 'Autumn');
    this.addSeasonLabel(svg, cx, arcTop - 10, '☀️', 'Summer');
    this.addSeasonLabel(svg, cx + R, baseY, '🌱', 'Spring');
    this.addSeasonLabel(svg, cx, baseY + 25, '❄️', 'Winter');

    // Sun position
    const t = Math.PI * (declination + 23.44) / 46.88;
    const sx = cx - R * Math.cos(t);
    const sy = baseY - R * Math.sin(t);

    const sun = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    sun.setAttribute('cx', sx); sun.setAttribute('cy', sy);
    sun.setAttribute('r', '12'); sun.setAttribute('fill', '#fbbf24');
    sun.setAttribute('stroke', '#f59e0b'); sun.setAttribute('stroke-width', '2');
    svg.appendChild(sun);

    // Rays
    for (let i = 0; i < 8; i++) {
      const a   = i * Math.PI / 4;
      const ray = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      ray.setAttribute('x1', sx + Math.cos(a) * 15);
      ray.setAttribute('y1', sy + Math.sin(a) * 15);
      ray.setAttribute('x2', sx + Math.cos(a) * 23);
      ray.setAttribute('y2', sy + Math.sin(a) * 23);
      ray.setAttribute('stroke', '#fbbf24'); ray.setAttribute('stroke-width', '2');
      svg.appendChild(ray);
    }
  },

  addSeasonLabel(svg, x, y, emoji, text) {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x); label.setAttribute('y', y);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', 'var(--text-muted)');
    label.setAttribute('font-size', '12'); label.setAttribute('font-weight', '600');
    label.textContent = `${emoji} ${text}`;
    svg.appendChild(label);
  },

  // ============================================================================
  // ROOM MANAGEMENT
  // ============================================================================

  updateSolarRoom() {
    const season = this.getCurrentSeason();
    const room   = this.solarRooms.find(r => r.season === season);
    if (room && room !== this.currentSolarRoom) {
      this.currentSolarRoom = room;
      this.renderSolarRoom(room);
      console.log(`☀️ Solar room: ${room.roomName}`);
    }
  },

  renderSolarRoom(room) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('solarRoomIcon', room.icon);
    set('solarRoomName', room.roomName);
    set('solarRoomDesc', room.description);
    const roomEl = document.getElementById('solarPracticeRoom');
    if (roomEl) {
      roomEl.setAttribute('data-room-id',     room.roomId);
      roomEl.setAttribute('data-room-energy', room.energy);
    }
  },

  getCurrentRoom() { return this.currentSolarRoom; },

  // ============================================================================
  // RENDER OUTER CARD
  // ============================================================================

  renderSolarCard() {
    const container = document.getElementById('solarContainer');
    if (!container) { console.warn('SolarEngine: solarContainer not found'); return; }

    if (!this.currentSolarData || !this.currentSolarRoom) {
      container.innerHTML = '<p style="color:var(--text-muted);padding:20px;">Loading solar data...</p>';
      return;
    }

    const { currentSolarData: d, currentSolarRoom: room } = this;
    const isAdmin       = window.Core?.state?.currentUser?.is_admin === true;
    const seasonDisplay = d.currentSeason.charAt(0).toUpperCase() + d.currentSeason.slice(1);

    container.innerHTML = `
      <div class="celestial-card-full solar-card">
        <div class="celestial-content-horizontal">
          <div class="celestial-visual-section">
            <div class="solar-visual" id="solarVisual">
              <svg width="280" height="180" viewBox="0 0 280 180" id="solarSvg"></svg>
            </div>
          </div>
          <div class="celestial-info-section">
            <div class="celestial-info-title">Solar Position &amp; Seasons</div>
            <div class="solar-info">
              <div class="solar-season-name">${seasonDisplay}</div>
              <div class="solar-declination">Declination: <span class="decl-value">${d.declination > 0 ? '+' : ''}${d.declination.toFixed(1)}°</span></div>
            </div>
            <div class="next-season">Next: ${d.nextSeasonName} (${d.daysToNextSeason} days)</div>
          </div>
          <div class="celestial-times-section">
            <div class="celestial-time">
              <span class="time-label">Sunrise</span>
              <span class="time-value" id="sunrise">${this.formatTime(d.sunrise)}</span>
            </div>
            <div class="celestial-time">
              <span class="time-label">Sunset</span>
              <span class="time-value" id="sunset">${this.formatTime(d.sunset)}</span>
            </div>
          </div>
        </div>

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
                <div class="energy-pulse" style="background:var(--ring-guiding);"></div>
                <span id="solarRoomPresence">0 present</span>
              </div>
              <button class="join-btn-inline" onclick="SolarEngine.joinSolarRoom()">Join Space</button>
            </div>
          </div>
        </div>

        ${isAdmin ? this.renderAdminSection() : ''}
      </div>`;

    this.updateSolarVisualization();
    this._refreshOuterCard();
  },

  _refreshOuterCard() {
    if (!window.CommunityDB?.ready) {
      const iv = setInterval(() => {
        if (!window.CommunityDB?.ready) return;
        clearInterval(iv);
        this._refreshOuterCard();
      }, 500);
      return;
    }

    const room   = this.currentSolarRoom;
    if (!room) return;
    const roomId = `${room.season}-solar`;

    const count = async () => {
      try {
        const p  = await CommunityDB.getRoomParticipants(roomId);
        const el = document.getElementById('solarRoomPresence');
        if (el) el.textContent = `${p.length} present`;
      } catch(e) { console.warn('[SolarEngine] _refreshOuterCard error:', e); }
    };

    count();
    try { this._outerCardSub?.unsubscribe(); } catch(e) {}
    this._outerCardSub = CommunityDB.subscribeToPresence(count);
  },

  // ============================================================================
  // ADMIN PANEL
  // ============================================================================

  renderAdminSection() {
    const panelId  = 'solarAdminPanel';
    const toggleId = 'solarAdminToggle';
    const toggleFn = `
      const p=document.getElementById('${panelId}'),t=document.getElementById('${toggleId}'),o=p.style.display!=='none';
      p.style.display=o?'none':'block';t.textContent=o?'▶':'▼';`;

    return `
      <div style="margin-top:24px;border-radius:var(--radius-lg);border:2px dashed rgba(139,92,246,0.5);overflow:hidden;">
        <div onclick="${toggleFn}" style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;cursor:pointer;background:var(--surface);user-select:none;">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(139,92,246,0.9);">🛡️ ADMIN: Enter Any Solar Room</span>
          <span id="${toggleId}" style="font-size:11px;color:rgba(139,92,246,0.7);">▶</span>
        </div>
        <div id="${panelId}" style="padding:16px 20px;background:var(--surface);border-top:1px solid rgba(139,92,246,0.2);display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            ${this.solarRooms.map(r => `
              <button onclick="SolarEngine.adminJoinRoom('${r.roomId}')"
                      style="padding:12px;background:var(--season-mood);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;text-align:left;transition:all 0.2s;"
                      onmouseover="this.style.background='var(--border)'"
                      onmouseout="this.style.background='var(--season-mood)'">
                <div style="font-size:24px;margin-bottom:4px;">${r.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${r.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;text-transform:capitalize;">${r.season}</div>
              </button>`).join('')}
          </div>
        </div>
      </div>`;
  },

  adminJoinRoom(roomId) {
    console.log(`🛡️ ADMIN: Joining ${roomId}`);
    this._loadAndEnterRoom(roomId);
  },

  injectAdminUI() {
    if (!window.Core?.state?.currentUser?.is_admin) return;
    const container = document.getElementById('solarContainer');
    if (!container || container.querySelector('#solarAdminPanel')) return;
    const card = container.querySelector('.celestial-card-full');
    if (card) card.insertAdjacentHTML('beforeend', this.renderAdminSection());
  },

  // ============================================================================
  // LAZY ROOM LOADING
  // ============================================================================

  _roomFileMap: {
    'spring-equinox':  { file: 'spring-solar-room.js',  globalName: 'SpringSolarRoom'  },
    'summer-solstice': { file: 'summer-solar-room.js',  globalName: 'SummerSolarRoom'  },
    'autumn-equinox':  { file: 'autumn-solar-room.js',  globalName: 'AutumnSolarRoom'  },
    'winter-solstice': { file: 'winter-solar-room.js',  globalName: 'WinterSolarRoom'  },
  },

  _loadAndEnterRoom(roomId) {
    const meta = this._roomFileMap[roomId];
    if (!meta) { window.Core?.showToast?.(`☀️ Unknown room: ${roomId}`); return; }

    const enter = () => {
      const instance = window[meta.globalName];
      instance
        ? instance.enterRoom()
        : window.Core?.showToast?.(`⚠️ ${roomId} failed to initialise`);
    };

    if (window[meta.globalName]) { enter(); return; }

    const script  = document.createElement('script');
    script.src    = `/Mini-Apps/CommunityHub/js/Solar/${meta.file}`;
    script.onload = () => setTimeout(enter, 50);
    script.onerror= () => window.Core?.showToast?.(`⚠️ Failed to load ${meta.file}`);
    document.body.appendChild(script);
  },

  joinSolarRoom() {
    if (!this.currentSolarRoom) { window.Core?.showToast?.('⚠️ Solar room not ready'); return; }
    this._loadAndEnterRoom(this.currentSolarRoom.roomId);
  },

  // ============================================================================
  // UTILITIES
  // ============================================================================

  formatTime: date => (!date || isNaN(date.getTime()))
    ? 'N/A'
    : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),

  formatDate: date =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),

  getSolarData() { return this.currentSolarData; },
};

window.SolarEngine = SolarEngine;
console.log('☀️ Solar Engine loaded');
