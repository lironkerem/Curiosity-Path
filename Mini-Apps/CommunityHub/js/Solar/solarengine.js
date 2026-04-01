/**
 * SOLARENGINE.JS
 * Solar cycle management: sun position calculations, visualizations,
 * seasonal practice rooms, and all sun-related functionality.
 */

import { SOLAR_CONSTANTS } from './solar-config.js';
import { Core } from '../core.js';
import { CommunityDB } from '../community-supabase.js';

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
  // ASTRONOMICAL SEASON DATES
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

    const prev = this.getSeasonDates(year - 1);
    if (now >= prev.winter.start && now <= prev.winter.end) return north ? 'winter' : 'summer';

    const curr = this.getSeasonDates(year);
    for (const season of ['spring', 'summer', 'autumn', 'winter']) {
      const { start, end } = curr[season];
      if (now >= start && now <= end) return north ? season : southMap[season];
    }
    return 'winter';
  },

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

  getSeasonInfo(now) {
    const nearest = this._getUpcomingTransitions(now)[0];
    const days    = Math.ceil((nearest.date - now) / 86_400_000);
    return `${days} days to ${nearest.name}`;
  },

  _getNextTransition(now) {
    const nearest = this._getUpcomingTransitions(now)[0];
    return {
      name: nearest.name.split(' ')[0],
      days: Math.ceil((nearest.date - now) / 86_400_000),
    };
  },

  getNextSeasonInfo(now) { return this._getNextTransition(now); },

  // ============================================================================
  // SOLAR VISUALIZATION
  // ============================================================================

  updateSolarVisualization() {
    if (!this.currentSolarData) return;
    this.drawWheelOfYear(this.currentSolarData);
  },

  drawWheelOfYear(data) {
    const svg = document.getElementById('solarSvg');
    if (!svg) return;

    // Square viewBox — scales responsively via CSS width:100%
    const S = 280, cx = 140, cy = 140, R = 110, Ri = 52;
    svg.setAttribute('viewBox', `0 0 ${S} ${S}`);
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', 'auto');
    svg.innerHTML = '';

    const ns = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs) => {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    };

    // Clip segments to circle
    const defs = el('defs', {});
    const clip = el('clipPath', { id: 'woyClip' });
    clip.appendChild(el('circle', { cx, cy, r: R - 1 }));
    defs.appendChild(clip);
    svg.appendChild(defs);

    // Quadrants clockwise from top:
    // Top-right = Spring, Bottom-right = Summer, Bottom-left = Autumn, Top-left = Winter
    const segs = [
      { d: `M${cx},${cy} L${cx},${cy-R} L${cx+R},${cy-R} L${cx+R},${cy} Z`, fill: '#C0DD97' },
      { d: `M${cx},${cy} L${cx+R},${cy} L${cx+R},${cy+R} L${cx},${cy+R} Z`, fill: '#FAC775' },
      { d: `M${cx},${cy} L${cx},${cy+R} L${cx-R},${cy+R} L${cx-R},${cy} Z`, fill: '#F0957B' },
      { d: `M${cx},${cy} L${cx-R},${cy} L${cx-R},${cy-R} L${cx},${cy-R} Z`, fill: '#B5D4F4' },
    ];
    const segG = el('g', { 'clip-path': 'url(#woyClip)' });
    segs.forEach(({ d, fill }) => segG.appendChild(el('path', { d, fill, opacity: '0.45', stroke: 'none' })));
    svg.appendChild(segG);

    // Circles
    svg.appendChild(el('circle', { cx, cy, r: R,  fill: 'none', stroke: 'var(--neuro-shadow-light)', 'stroke-width': '1.5' }));
    svg.appendChild(el('circle', { cx, cy, r: Ri, fill: 'none', stroke: 'var(--neuro-shadow-light)', 'stroke-width': '1', 'stroke-dasharray': '3 3', opacity: '0.6' }));

    // H/V dividers
    svg.appendChild(el('line', { x1: cx-R, y1: cy,   x2: cx+R, y2: cy,   stroke: 'var(--neuro-shadow-light)', 'stroke-width': '0.8' }));
    svg.appendChild(el('line', { x1: cx,   y1: cy-R, x2: cx,   y2: cy+R, stroke: 'var(--neuro-shadow-light)', 'stroke-width': '0.8' }));

    // Season labels
    const addLabel = (x, y, name, months, nc, mc) => {
      const t1 = el('text', { x, y,      'text-anchor': 'middle', fill: nc, 'font-size': '9',   'font-weight': '600' });
      t1.textContent = name;
      svg.appendChild(t1);
      const t2 = el('text', { x, y: y+11, 'text-anchor': 'middle', fill: mc, 'font-size': '7.5' });
      t2.textContent = months;
      svg.appendChild(t2);
    };
    addLabel(cx+55, cy-40, 'Spring', 'Mar · Apr · May', '#3B6D11', '#639922');
    addLabel(cx+55, cy+52, 'Summer', 'Jun · Jul · Aug',  '#854F0B', '#BA7517');
    addLabel(cx-55, cy+52, 'Autumn', 'Sep · Oct · Nov',  '#993C1D', '#D85A30');
    addLabel(cx-55, cy-40, 'Winter', 'Dec · Jan · Feb',  '#185FA5', '#378ADD');

    // Cardinal emojis
    const addEmoji = (x, y, emoji) => {
      const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': '11' });
      t.textContent = emoji;
      svg.appendChild(t);
    };
    addEmoji(cx,     cy-R+8,  '🌱');
    addEmoji(cx+R-6, cy+4,    '☀️');
    addEmoji(cx,     cy+R-2,  '🍂');
    addEmoji(cx-R+6, cy+4,    '❄️');

    // Tick marks
    [[cx,cy-R,cx,cy-R+8],[cx+R,cy,cx+R-8,cy],[cx,cy+R,cx,cy+R-8],[cx-R,cy,cx-R+8,cy]]
      .forEach(([x1,y1,x2,y2]) =>
        svg.appendChild(el('line', { x1, y1, x2, y2, stroke: 'var(--neuro-text)', 'stroke-width': '1.5', 'stroke-linecap': 'round' }))
      );

    // Live sun position — clockwise from top (Spring Equinox = day ~79)
    const now       = new Date();
    const dayOfYear = this.getDayOfYear(now);
    const angleRad  = (-Math.PI / 2) + (dayOfYear / 365) * 2 * Math.PI;
    const sx        = cx + R * Math.cos(angleRad);
    const sy        = cy + R * Math.sin(angleRad);

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      svg.appendChild(el('line', {
        x1: sx + Math.cos(a) * 10, y1: sy + Math.sin(a) * 10,
        x2: sx + Math.cos(a) * 15, y2: sy + Math.sin(a) * 15,
        stroke: '#EF9F27', 'stroke-width': '1.5', 'stroke-linecap': 'round',
      }));
    }
    svg.appendChild(el('circle', { cx: sx, cy: sy, r: '8',   fill: '#EF9F27', stroke: '#BA7517', 'stroke-width': '1.2' }));
    svg.appendChild(el('circle', { cx: sx, cy: sy, r: '3.5', fill: '#FCDE5A', opacity: '0.9' }));

    // Center text
    const { nextSeasonName, daysToNextSeason } = data;
    const dateStr       = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const currentSeason = this.getCurrentSeason();
    const seasonCap     = currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1);
    const sStart        = this.getSeasonDates(now.getFullYear())[currentSeason]?.start || now;
    const daysIn        = Math.max(1, Math.floor((now - sStart) / 86_400_000) + 1);

    const addCenter = (text, y, size, weight, fill) => {
      const t = el('text', { x: cx, y, 'text-anchor': 'middle', fill, 'font-size': size, 'font-weight': weight });
      t.textContent = text;
      svg.appendChild(t);
    };
    addCenter(dateStr,                                      cy - 10, '9',   '700', 'var(--neuro-text)');
    addCenter(`${daysIn} days in ${seasonCap}`,             cy + 3,  '7.5', '400', 'var(--neuro-text-light)');
    addCenter(`${daysToNextSeason} days to ${nextSeasonName}`, cy + 15, '7.5', '400', '#BA7517');
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
    const isAdmin       = Core?.state?.currentUser?.is_admin === true;
    const seasonDisplay = d.currentSeason.charAt(0).toUpperCase() + d.currentSeason.slice(1);

    container.innerHTML = `
      <div class="celestial-card-full solar-card">
        <div class="celestial-content-horizontal">
          <div class="celestial-visual-section">
            <div class="solar-visual" id="solarVisual">
              <svg width="100%" height="auto" viewBox="0 0 280 280" id="solarSvg" style="max-width:280px;display:block;margin:0 auto;" aria-hidden="true" focusable="false"></svg>
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
              <button type="button" class="join-btn-inline" onclick="SolarEngine.joinSolarRoom()">Join Space</button>
            </div>
          </div>
        </div>

        ${isAdmin ? this.renderAdminSection() : ''}
      </div>`;

    this.updateSolarVisualization();
    this._refreshOuterCard();
    this._attachSolarAdminListeners();
  },

  _attachSolarAdminListeners() {
    const header = document.querySelector('.solar-admin-header');
    if (header && !header._solarBound) {
      const togglePanel = () => {
        const panel  = document.getElementById(header.dataset.panel);
        const toggle = document.getElementById(header.dataset.toggle);
        const open   = panel?.style.display !== 'none';
        if (panel) panel.style.display = open ? 'none' : 'block';
        if (toggle) toggle.textContent = open ? '▶' : '▼';
        header.setAttribute('aria-expanded', String(!open));
      };
      header.addEventListener('click', togglePanel);
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); }
      });
      header._solarBound = true;
    }
    document.querySelectorAll('.solar-admin-header ~ div button[data-room-id]').forEach(btn => {
      if (!btn._solarBound) {
        btn.addEventListener('click', () => this.adminJoinRoom(btn.dataset.roomId));
        btn.addEventListener('mouseover', () => btn.style.background = 'var(--border)');
        btn.addEventListener('mouseout',  () => btn.style.background = 'var(--season-mood)');
        btn._solarBound = true;
      }
    });
  },

  _refreshOuterCard() {
    if (!CommunityDB?.ready) {
      if (!this._outerCardRetry) {
        this._outerCardRetry = setTimeout(() => {
          this._outerCardRetry = null;
          this._refreshOuterCard();
        }, 500);
      }
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
    return `
      <div style="margin-top:24px;border-radius:var(--radius-lg);border:2px dashed var(--neuro-accent-a30);overflow:hidden;">
        <div class="solar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${panelId}" data-toggle="${toggleId}">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Solar Room</span>
          <span id="${toggleId}" style="font-size:11px;">▶</span>
        </div>
        <div id="${panelId}" style="padding:16px 20px;background:var(--neuro-bg-lighter);border-top:1px solid var(--neuro-accent-a10);display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            ${this.solarRooms.map(r => `
              <button type="button" data-room-id="${r.roomId}"
                      style="padding:12px;background:var(--season-mood);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;text-align:left;transition:all 0.2s;">
                <div style="font-size:24px;margin-bottom:4px;">${r.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${r.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;text-transform:capitalize;">${r.season}</div>
              </button>`).join('')}
          </div>
        </div>
      </div>`;
  },

  adminJoinRoom(roomId) {
    this._loadAndEnterRoom(roomId);
  },

  injectAdminUI() {
    if (!Core?.state?.currentUser?.is_admin) return;
    const container = document.getElementById('solarContainer');
    if (!container || container.querySelector('#solarAdminPanel')) return;
    const card = container.querySelector('.celestial-card-full');
    if (card) card.insertAdjacentHTML('beforeend', this.renderAdminSection());
  },

  // ============================================================================
  // LAZY ROOM LOADING — dynamic import() replaces <script> injection
  // ============================================================================

  _roomFileMap: {
    'spring-equinox':  { file: 'spring-solar-room.js',  exportName: 'SpringSolarRoom'  },
    'summer-solstice': { file: 'summer-solar-room.js',  exportName: 'SummerSolarRoom'  },
    'autumn-equinox':  { file: 'autumn-solar-room.js',  exportName: 'AutumnSolarRoom'  },
    'winter-solstice': { file: 'winter-solar-room.js',  exportName: 'WinterSolarRoom'  },
  },

  async _loadAndEnterRoom(roomId) {
    const meta = this._roomFileMap[roomId];
    if (!meta) { Core?.showToast?.(`Unknown room: ${roomId}`); return; }

    try {
      const basePath = '/Mini-Apps/CommunityHub/js/Solar/';
      const mod = await import(`${basePath}${meta.file}`);
      const instance = mod[meta.exportName];
      instance
        ? instance.enterRoom()
        : Core?.showToast?.(`${roomId} failed to initialise`);
    } catch (err) {
      console.error(`[SolarEngine] _loadAndEnterRoom error for ${roomId}:`, err);
      Core?.showToast?.(`Failed to load ${meta.file}`);
    }
  },

  joinSolarRoom() {
    if (!this.currentSolarRoom) { Core?.showToast?.('Solar room not ready'); return; }
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

export { SolarEngine };

// Window bridge for inline onclick handlers (e.g. onclick="SolarEngine.joinSolarRoom()")
window.SolarEngine = SolarEngine;
