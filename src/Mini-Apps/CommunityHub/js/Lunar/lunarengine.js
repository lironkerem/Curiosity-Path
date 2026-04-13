/**
 * LUNARENGINE.JS v3.0
 * Lunar cycle management: phase calculations, visualizations, room routing.
 *
 * KEY CHANGES v3:
 * - Deduped lunarRooms (New Moon 0-0.068 and 0.932-1.0 merged via phaseRanges)
 * - Removed inline onclick handlers from admin panel (XSS risk)
 * - Extracted timer constant to avoid magic numbers
 * - _refreshOuterCard: replaced polling interval with single retry
 * - renderLunarCard: extracted room HTML to _renderRoomSection()
 */

import { LunarUI } from './lunar-ui.js';
import SunCalc from 'suncalc';
const _cdb = () => window.CommunityDB;

const LunarEngine = {

    location: { latitude: 31.0, longitude: 0.0, name: 'Default' },
    currentMoonData: null,
    currentLunarRoom: null,

    /** Canonical room definitions - one entry per room, multi-range via phaseRanges */
    lunarRooms: [
        {
            phaseRanges: [[0, 0.068], [0.932, 1.0]],
            phaseName:   'New Moon',
            icon:        '🌑',
            roomName:    'New Moon Intentions',
            description: 'Set intentions and plant seeds for the lunar cycle',
            roomId:      'new-moon',
            energy:      'Beginning, Stillness, Potential',
            practices:   ['Silent meditation', 'Intention setting', 'Vision journaling', 'Seed planting ritual']
        },
        {
            phaseRanges: [[0.068, 0.432]],
            phaseName:   'Waxing Moon',
            icon:        '🌓',
            roomName:    'Waxing Growth Practice',
            description: 'Build momentum and cultivate expanding energy',
            roomId:      'waxing-moon',
            energy:      'Growth, Action, Building',
            practices:   ['Dynamic movement', 'Energy cultivation', 'Goal visualization', 'Action planning meditation']
        },
        {
            phaseRanges: [[0.432, 0.568]],
            phaseName:   'Full Moon',
            icon:        '🌕',
            roomName:    'Full Moon Illumination',
            description: 'Celebrate fullness and release what no longer serves',
            roomId:      'full-moon',
            energy:      'Culmination, Release, Clarity',
            practices:   ['Celebration ritual', 'Gratitude meditation', 'Release ceremony', 'Moon bathing']
        },
        {
            phaseRanges: [[0.568, 0.932]],
            phaseName:   'Waning Moon',
            icon:        '🌗',
            roomName:    'Waning Release Practice',
            description: 'Let go and reflect on the lunar journey',
            roomId:      'waning-moon',
            energy:      'Release, Reflection, Rest',
            practices:   ['Reflection meditation', 'Letting go ritual', 'Rest and restore', 'Completion ceremony']
        }
    ],

    // ── Init ────────────────────────────────────────────────────────────────────

    init() {
        if (this._initialized) return;
        this._initialized = true;

        const run = () => this.updateAll();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    this.location = { latitude: coords.latitude, longitude: coords.longitude, name: 'Your Location' };
                    run();
                },
                () => run(),
                { timeout: 5000, maximumAge: 3_600_000 }
            );
        } else {
            run();
        }

        setInterval(() => this.updateAll(), 600_000); // 10-minute refresh
    },

    // ── Data ────────────────────────────────────────────────────────────────────

    updateAll() {
        this.updateMoonData();
        this.updateMoonVisualization();
        this.updateLunarRoom();
        this.renderLunarCard();
    },

    setLocation(latitude, longitude, name) {
        this.location = { latitude, longitude, name };
        this.updateAll();
    },

    updateMoonData() {
        const now = new Date();
        const illum = SunCalc.getMoonIllumination(now);
        const times = SunCalc.getMoonTimes(now, this.location.latitude, this.location.longitude);

        this.currentMoonData = {
            phase:        illum.phase,
            fraction:     illum.fraction,
            angle:        illum.angle,
            rise:         times.rise,
            set:          times.set,
            phaseName:    this.getMoonPhaseName(illum.phase),
            age:          illum.phase * 29.53,
            nextFullMoon: this.getNextFullMoon(now)
        };

        this._renderMoonInfo();
    },

    _renderMoonInfo() {
        const d = this.currentMoonData;
        if (!d) return;

        const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
        set('moonPhaseName',    d.phaseName);
        set('moonIllumination', `${Math.round(d.fraction * 100)}% illuminated`);
        set('moonAge',          `${d.age.toFixed(1)} days old`);
        set('moonrise',         d.rise ? this.formatTime(d.rise) : 'No rise today');
        set('moonset',          d.set  ? this.formatTime(d.set)  : 'No set today');

        const days = Math.ceil((d.nextFullMoon - new Date()) / 86_400_000);
        set('nextPhase', `Next Full Moon: ${this.formatDate(d.nextFullMoon)} (${days} days)`);
    },

    // ── Visualization ───────────────────────────────────────────────────────────

    updateMoonVisualization() {
        if (this.currentMoonData) this.drawMoon(this.currentMoonData.phase, this.currentMoonData.angle);
    },

    drawMoon(phase, angle) {
        const svg = document.getElementById('moonSvg');
        if (!svg) return;

        const SIZE = 120, R = 50, CX = 60, CY = 60;
        svg.innerHTML = '';

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', `rotate(${((angle * 180 / Math.PI) * -1).toFixed(2)}, ${CX}, ${CY})`);
        svg.appendChild(g);

        const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bg.setAttribute('cx', CX); bg.setAttribute('cy', CY);
        bg.setAttribute('r', R);  bg.setAttribute('fill', '#2d3748');
        g.appendChild(bg);

        const offset = Math.cos(phase * 2 * Math.PI) * R;
        const lit    = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lit.setAttribute('fill', '#f7fafc');
        lit.setAttribute('d', phase < 0.5
            ? `M ${CX},${CY-R} A ${R},${R} 0 0 1 ${CX},${CY+R} Q ${CX+offset},${CY} ${CX},${CY-R}`
            : `M ${CX},${CY-R} Q ${CX+offset},${CY} ${CX},${CY+R} A ${R},${R} 0 0 1 ${CX},${CY-R}`
        );
        g.appendChild(lit);

        // Craters
        [{ x: 0.3, y: -0.2, r: 0.15 }, { x: -0.2, y: 0.3, r: 0.1 }, { x: 0.1, y: 0.4, r: 0.08 }]
            .forEach(({ x, y, r }) => {
                const visible = (phase < 0.5 && x > 0) || (phase >= 0.5 && x < 0) || (phase > 0.45 && phase < 0.55);
                if (!visible) return;
                const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                c.setAttribute('cx', CX + x * R); c.setAttribute('cy', CY + y * R);
                c.setAttribute('r', r * R); c.setAttribute('fill', 'rgba(0,0,0,0.15)');
                g.appendChild(c);
            });
    },

    getMoonPhaseName(phase) {
        if (phase < 0.03 || phase > 0.97) return 'New Moon';
        if (phase < 0.22) return 'Waxing Crescent';
        if (phase < 0.28) return 'First Quarter';
        if (phase < 0.47) return 'Waxing Gibbous';
        if (phase < 0.53) return 'Full Moon';
        if (phase < 0.72) return 'Waning Gibbous';
        if (phase < 0.78) return 'Last Quarter';
        return 'Waning Crescent';
    },

    getNextFullMoon(from) {
        const phase = SunCalc.getMoonIllumination(from).phase;
        const days  = phase < 0.5 ? (0.5 - phase) * 29.53 : (1.5 - phase) * 29.53;
        return new Date(from.getTime() + days * 86_400_000);
    },

    // ── Room management ─────────────────────────────────────────────────────────

    getLunarRoomByPhase(phase) {
        return this.lunarRooms.find(r =>
            r.phaseRanges.some(([lo, hi]) => phase >= lo && phase <= hi)
        ) ?? this.lunarRooms[0];
    },

    updateLunarRoom() {
        if (!this.currentMoonData) return;
        const room = this.getLunarRoomByPhase(this.currentMoonData.phase);
        if (this.currentLunarRoom?.roomId !== room.roomId) {
        }
        this.currentLunarRoom = room;
    },

    getCurrentRoom() { return this.currentLunarRoom; },

    // ── Lazy-load & enter ───────────────────────────────────────────────────────

    _ROOM_MODULES: {
        'new-moon':    () => import('./newmoon-room.js'),
        'waxing-moon': () => import('./waxingmoon-room.js'),
        'full-moon':   () => import('./fullmoon-room.js'),
        'waning-moon': () => import('./waningmoon-room.js'),
    },

    _roomExportName: {
        'new-moon':    'NewMoonRoom',
        'waxing-moon': 'WaxingMoonRoom',
        'full-moon':   'FullMoonRoom',
        'waning-moon': 'WaningMoonRoom',
    },

    async _loadAndEnterRoom(roomId) {
        const loader = this._ROOM_MODULES[roomId];
        if (!loader) { window.Core?.showToast(`Unknown room: ${roomId}`); return; }

        try {
            const mod = await loader();
            const instance = mod[this._roomExportName[roomId]];
            if (instance) instance.enterRoom();
            else window.Core?.showToast(`${roomId} failed to initialise`);
        } catch (e) {
            console.error(`[LunarEngine] Failed to load ${roomId}:`, e);
            window.Core?.showToast(`Failed to load ${roomId}`);
        }
    },

    joinLunarRoom() {
        if (!this.currentLunarRoom) { window.Core?.showToast('Lunar room not ready'); return; }
        this._loadAndEnterRoom(this.currentLunarRoom.roomId);
    },

    adminJoinRoom(roomId) {
        this._loadAndEnterRoom(roomId);
    },

    // ── Card rendering ──────────────────────────────────────────────────────────

    renderLunarCard() {
        const container = document.getElementById('lunarContainer');
        if (!container) { console.warn('LunarEngine: #lunarContainer not found'); return; }

        LunarUI.injectStyles();

        if (!this.currentMoonData || !this.currentLunarRoom) {
            container.innerHTML = '<p style="color:var(--text-muted);padding:20px;">Loading lunar data...</p>';
            return;
        }

        const { currentMoonData: d, currentLunarRoom: room } = this;
        const isAdmin = window.Core?.state?.currentUser?.is_admin;

        container.innerHTML = `
            <div class="celestial-card-full lunar-card">
                <div class="celestial-content-horizontal">
                    <div class="celestial-visual-section">
                        <div class="moon-visual">
                            <svg width="120" height="120" viewBox="0 0 120 120" id="moonSvg" aria-hidden="true" focusable="false"></svg>
                        </div>
                    </div>
                    <div class="celestial-info-section">
                        <div class="celestial-info-title">Lunar Phase &amp; Cycles</div>
                        <div class="moon-phase-name" id="moonPhaseName">${d.phaseName}</div>
                        <div class="moon-illumination" id="moonIllumination">${Math.round(d.fraction * 100)}% illuminated</div>
                        <div class="moon-age" id="moonAge">${d.age.toFixed(1)} days old</div>
                        <div class="next-phase" id="nextPhase">
                            Next Full Moon: ${this.formatDate(d.nextFullMoon)}
                            (${Math.ceil((d.nextFullMoon - new Date()) / 86_400_000)} days)
                        </div>
                    </div>
                    <div class="celestial-times-section">
                        <div class="celestial-time">
                            <span class="time-label">Moonrise</span>
                            <span class="time-value" id="moonrise">${d.rise ? this.formatTime(d.rise) : 'No rise today'}</span>
                        </div>
                        <div class="celestial-time">
                            <span class="time-label">Moonset</span>
                            <span class="time-value" id="moonset">${d.set ? this.formatTime(d.set) : 'No set today'}</span>
                        </div>
                    </div>
                </div>
                ${this._renderRoomSection(room)}
                ${isAdmin ? this._renderAdminSection() : ''}
            </div>`;

        this.updateMoonVisualization();
        this._refreshOuterCard();
    },

    _renderRoomSection(room) {
        return `
            <div class="celestial-practice-room" data-room-type="lunar" id="lunarPracticeRoom">
                <div class="room-divider"></div>
                <div class="room-content-inline">
                    <div class="room-header-inline">
                        <div class="room-icon-inline" id="lunarRoomIcon">${room.icon}</div>
                        <div class="room-info-inline">
                            <div class="room-name-inline" id="lunarRoomName">${room.roomName}</div>
                            <div class="room-desc-inline" id="lunarRoomDesc">${room.description}</div>
                        </div>
                    </div>
                    <div class="room-meta-inline">
                        <div class="room-energy">
                            <div class="energy-pulse" style="background:var(--ring-silent);"></div>
                            <span id="lunarRoomPresence">0 present</span>
                        </div>
                        <button type="button" class="btn btn-primary join-btn-inline" data-action="join-lunar-room">Join Space</button>
                    </div>
                </div>
            </div>`;
    },

    /** Attach join-button listener after card renders (called by renderLunarCard). */
    _attachCardListeners() {
        const btn = document.querySelector('[data-action="join-lunar-room"]');
        if (btn && !btn._lunarBound) {
            btn.addEventListener('click', () => this.joinLunarRoom());
            btn._lunarBound = true;
        }
    },

    _renderAdminSection() {
        const panelId  = 'lunarAdminPanel';
        const toggleId = 'lunarAdminToggle';

        const seen = new Set();
        const uniqueRooms = this.lunarRooms.filter(r => seen.has(r.roomId) ? false : seen.add(r.roomId));

        const buttons = uniqueRooms.map(r => `
            <button type="button" class="lunar-admin-room-btn" data-room-id="${r.roomId}">
                <div style="font-size:24px;margin-bottom:4px;">${r.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${r.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${r.phaseName}</div>
            </button>`
        ).join('');

        return `
            <div class="lunar-admin-wrapper">
                <div class="lunar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${panelId}" data-toggle="${toggleId}">
                    <span style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Lunar Room</span>
                    <span id="${toggleId}">▶</span>
                </div>
                <div id="${panelId}" class="lunar-admin-body" style="display:none;">
                    <div class="lunar-admin-grid">${buttons}</div>
                </div>
            </div>`;
    },

    /** Wire up admin panel toggle + room buttons. Called once after renderLunarCard. */
    _attachAdminListeners() {
        const header = document.querySelector('.lunar-admin-header');
        if (header && !header._lunarBound) {
            const togglePanel = () => {
                const panel  = document.getElementById(header.dataset.panel);
                const toggle = document.getElementById(header.dataset.toggle);
                const open   = panel.style.display !== 'none';
                panel.style.display  = open ? 'none' : 'block';
                toggle.textContent   = open ? '▶' : '▼';
                header.setAttribute('aria-expanded', String(!open));
            };
            header.addEventListener('click', togglePanel);
            header.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); }
            });
            header._lunarBound = true;
        }

        document.querySelectorAll('.lunar-admin-room-btn').forEach(btn => {
            if (!btn._lunarBound) {
                btn.addEventListener('click', () => this.adminJoinRoom(btn.dataset.roomId));
                btn._lunarBound = true;
            }
        });
    },

    // ── Presence ────────────────────────────────────────────────────────────────

    _refreshOuterCard() {
        if (!_cdb()?.ready) {
            if (!this._outerCardRetry) {
                this._outerCardRetry = setTimeout(() => {
                    this._outerCardRetry = null;
                    this._refreshOuterCard();
                }, 500);
            }
            return;
        }

        const roomId = this.currentLunarRoom?.roomId;
        if (!roomId) return;

        const doCount = async () => {
            try {
                const participants = await _cdb()?.getRoomParticipants(roomId);
                const el = document.getElementById('lunarRoomPresence');
                if (el) el.textContent = `${participants.length} present`;
            } catch (e) {
                console.warn('[LunarEngine] _refreshOuterCard error:', e);
            }
        };

        doCount();
        this._attachCardListeners();
        this._attachAdminListeners();

        if (this._outerCardSub) { try { this._outerCardSub.unsubscribe(); } catch (e) {} }
        this._outerCardSub = _cdb()?.subscribeToPresence(doCount);
    },

    // ── Utils ───────────────────────────────────────────────────────────────────

    formatTime(date) {
        if (!date || isNaN(date.getTime())) return 'N/A';
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    },

    formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    getMoonData() { return this.currentMoonData; },

    // Legacy: kept for external callers that still reference renderLunarRoom()
    renderLunarRoom() { this.renderLunarCard(); },

    injectAdminUI() {
        const isAdmin = window.Core?.state?.currentUser?.is_admin;
        if (!isAdmin) return;
        const card = document.querySelector('#lunarContainer .celestial-card-full');
        if (card && !document.getElementById('lunarAdminPanel')) {
            const div = document.createElement('div');
            div.innerHTML = this._renderAdminSection();
            card.appendChild(div.firstElementChild);
            this._attachAdminListeners();
        }
    }
};

// Window bridge: preserved for any external code referencing window.LunarEngine
window.LunarEngine = LunarEngine;

export { LunarEngine };
