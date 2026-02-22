/**
 * LUNARENGINE.JS
 * Complete lunar cycle management: moon phase calculations, visualizations, 
 * lunar practice rooms, and all moon-related functionality
 */

const LunarEngine = {
    // User location — resolved from browser geolocation on init, falls back to UTC-neutral coords
    location: {
        latitude: 31.0,
        longitude: 0.0,
        name: 'Default'
    },

    // Current moon data
    currentMoonData: null,
    currentLunarRoom: null,

    // Lunar Practice Room Configurations (4 rooms based on moon phase)
    // New Moon and Full Moon = ~5 days each (2 days before, day of, 2 days after)
    // Waxing and Waning = remaining ~10-11 days each
    lunarRooms: [
        {
            phaseRange: [0, 0.068],
            phaseName: 'New Moon',
            icon: '🌑',
            roomName: 'New Moon Intentions',
            description: 'Set intentions and plant seeds for the lunar cycle',
            roomId: 'new-moon',
            energy: 'Beginning, Stillness, Potential',
            practices: [
                'Silent meditation',
                'Intention setting',
                'Vision journaling',
                'Seed planting ritual'
            ]
        },
        {
            phaseRange: [0.068, 0.432],
            phaseName: 'Waxing Moon',
            icon: '🌓',
            roomName: 'Waxing Growth Practice',
            description: 'Build momentum and cultivate expanding energy',
            roomId: 'waxing-moon',
            energy: 'Growth, Action, Building',
            practices: [
                'Dynamic movement',
                'Energy cultivation',
                'Goal visualization',
                'Action planning meditation'
            ]
        },
        {
            phaseRange: [0.432, 0.568],
            phaseName: 'Full Moon',
            icon: '🌕',
            roomName: 'Full Moon Illumination',
            description: 'Celebrate fullness and release what no longer serves',
            roomId: 'full-moon',
            energy: 'Culmination, Release, Clarity',
            practices: [
                'Celebration ritual',
                'Gratitude meditation',
                'Release ceremony',
                'Moon bathing'
            ]
        },
        {
            phaseRange: [0.568, 0.932],
            phaseName: 'Waning Moon',
            icon: '🌗',
            roomName: 'Waning Release Practice',
            description: 'Let go and reflect on the lunar journey',
            roomId: 'waning-moon',
            energy: 'Release, Reflection, Rest',
            practices: [
                'Reflection meditation',
                'Letting go ritual',
                'Rest and restore',
                'Completion ceremony'
            ]
        },
        {
            phaseRange: [0.932, 1.0],
            phaseName: 'New Moon',
            icon: '🌑',
            roomName: 'New Moon Intentions',
            description: 'Set intentions and plant seeds for the lunar cycle',
            roomId: 'new-moon',
            energy: 'Beginning, Stillness, Potential',
            practices: [
                'Silent meditation',
                'Intention setting',
                'Vision journaling',
                'Seed planting ritual'
            ]
        }
    ],

    // Initialize lunar engine
    init() {
        console.log('🌙 Lunar Engine Initialized');
        
        // Check if SunCalc is available
        if (typeof SunCalc === 'undefined') {
            console.error('❌ SunCalc library not loaded! Moon visualizations will not work.');
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
                    // Permission denied or unavailable — run with fallback (UTC-neutral coords)
                    this.updateAll();
                },
                { timeout: 5000, maximumAge: 3600000 }
            );
        } else {
            this.updateAll();
        }
        
        // Update every 10 minutes
        setInterval(() => this.updateAll(), 600000);
    },

    // Update all lunar data
    updateAll() {
        this.updateMoonData();
        this.updateMoonVisualization();
        this.updateLunarRoom();
        this.renderLunarCard(); // Render card to container
    },

    // Set custom location
    setLocation(latitude, longitude, name) {
        this.location = { latitude, longitude, name };
        this.updateAll();
    },

    // ===== MOON PHASE CALCULATIONS =====
    updateMoonData() {
        if (typeof SunCalc === 'undefined') {
            console.error('❌ SunCalc not available in updateMoonData');
            return;
        }
        
        const now = new Date();
        const { latitude, longitude } = this.location;

        // Get moon illumination data from SunCalc
        const moonIllum = SunCalc.getMoonIllumination(now);
        const moonTimes = SunCalc.getMoonTimes(now, latitude, longitude);

        this.currentMoonData = {
            phase: moonIllum.phase,
            fraction: moonIllum.fraction,
            angle: moonIllum.angle,
            rise: moonTimes.rise,
            set: moonTimes.set,
            phaseName: this.getMoonPhaseName(moonIllum.phase),
            age: moonIllum.phase * 29.53,
            nextFullMoon: this.getNextFullMoon(now)
        };

        // Update UI
        this.renderMoonInfo();
    },

    renderMoonInfo() {
        const data = this.currentMoonData;
        if (!data) return;

        // Update moon phase name
        const phaseNameEl = document.getElementById('moonPhaseName');
        if (phaseNameEl) phaseNameEl.textContent = data.phaseName;

        // Update illumination
        const illumEl = document.getElementById('moonIllumination');
        if (illumEl) illumEl.textContent = `${Math.round(data.fraction * 100)}% illuminated`;

        // Update moon age
        const ageEl = document.getElementById('moonAge');
        if (ageEl) ageEl.textContent = `${data.age.toFixed(1)} days old`;

        // Update moon times
        if (data.rise) {
            const riseEl = document.getElementById('moonrise');
            if (riseEl) riseEl.textContent = this.formatTime(data.rise);
        } else {
            const riseEl = document.getElementById('moonrise');
            if (riseEl) riseEl.textContent = 'No rise today';
        }

        if (data.set) {
            const setEl = document.getElementById('moonset');
            if (setEl) setEl.textContent = this.formatTime(data.set);
        } else {
            const setEl = document.getElementById('moonset');
            if (setEl) setEl.textContent = 'No set today';
        }

        // Calculate next full moon
        const now = new Date();
        const daysUntil = Math.ceil((data.nextFullMoon - now) / (1000 * 60 * 60 * 24));
        const nextPhaseEl = document.getElementById('nextPhase');
        if (nextPhaseEl) {
            nextPhaseEl.textContent = `Next Full Moon: ${this.formatDate(data.nextFullMoon)} (${daysUntil} days)`;
        }
    },

    // ===== MOON VISUALIZATION =====
    updateMoonVisualization() {
        if (!this.currentMoonData) return;
        this.drawMoon(this.currentMoonData.phase, this.currentMoonData.angle);
    },

    drawMoon(phase, angle) {
        const svg = document.getElementById('moonSvg');
        if (!svg) return;

        const size = 120;
        const radius = 50;
        const centerX = size / 2;
        const centerY = size / 2;

        // Clear previous moon
        svg.innerHTML = '';

        // Wrap everything in a group so the libration angle rotates the whole moon
        // SunCalc angle: negative = lit from right (waxing), positive = lit from left (waning)
        // Convert to degrees and apply as rotation around center
        const tiltDeg = (angle * 180 / Math.PI) * -1;
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `rotate(${tiltDeg.toFixed(2)}, ${centerX}, ${centerY})`);
        svg.appendChild(group);

        // Create moon circle background (dark side)
        const moonBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        moonBg.setAttribute('cx', centerX);
        moonBg.setAttribute('cy', centerY);
        moonBg.setAttribute('r', radius);
        moonBg.setAttribute('fill', '#2d3748');
        group.appendChild(moonBg);

        // Calculate illuminated portion
        const phaseAngle = phase * 2 * Math.PI;
        const offset = Math.cos(phaseAngle) * radius;

        // Create illuminated portion
        const moonLight = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        let d;
        if (phase < 0.5) {
            // Waxing: light on right side
            d = `M ${centerX},${centerY - radius} 
                 A ${radius},${radius} 0 0 1 ${centerX},${centerY + radius}
                 Q ${centerX + offset},${centerY} ${centerX},${centerY - radius}`;
        } else {
            // Waning: light on left side  
            d = `M ${centerX},${centerY - radius}
                 Q ${centerX + offset},${centerY} ${centerX},${centerY + radius}
                 A ${radius},${radius} 0 0 1 ${centerX},${centerY - radius}`;
        }

        moonLight.setAttribute('d', d);
        moonLight.setAttribute('fill', '#f7fafc');
        group.appendChild(moonLight);

        // Add subtle crater texture
        this.addMoonCraters(group, centerX, centerY, radius, phase);
    },

    addMoonCraters(svg, cx, cy, radius, phase) {
        // Add a few subtle craters for realism
        const craters = [
            { x: 0.3, y: -0.2, r: 0.15 },
            { x: -0.2, y: 0.3, r: 0.1 },
            { x: 0.1, y: 0.4, r: 0.08 },
        ];

        craters.forEach(crater => {
            const craterX = cx + (crater.x * radius);
            const craterY = cy + (crater.y * radius);
            const craterR = crater.r * radius;

            // Only show crater if it's on illuminated side
            const isVisible = (phase < 0.5 && crater.x > 0) || (phase >= 0.5 && crater.x < 0) || 
                             (phase > 0.45 && phase < 0.55);

            if (isVisible) {
                const craterCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                craterCircle.setAttribute('cx', craterX);
                craterCircle.setAttribute('cy', craterY);
                craterCircle.setAttribute('r', craterR);
                craterCircle.setAttribute('fill', 'rgba(0, 0, 0, 0.15)');
                svg.appendChild(craterCircle);
            }
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

    getNextFullMoon(fromDate) {
        // Simple approximation: full moon every 29.53 days
        const lunarCycle = 29.53;
        const moonIllum = SunCalc.getMoonIllumination(fromDate);
        const currentPhase = moonIllum.phase;
        
        let daysUntilFull;
        if (currentPhase < 0.5) {
            daysUntilFull = (0.5 - currentPhase) * lunarCycle;
        } else {
            daysUntilFull = (1 + 0.5 - currentPhase) * lunarCycle;
        }
        
        const nextFull = new Date(fromDate.getTime() + daysUntilFull * 24 * 60 * 60 * 1000);
        return nextFull;
    },

    // ===== LUNAR PRACTICE ROOM MANAGEMENT =====
    updateLunarRoom() {
        if (!this.currentMoonData) {
            return;
        }

        const phase = this.currentMoonData.phase;

        // Find the appropriate room based on current phase
        const room = this.lunarRooms.find(r => {
            const matches = phase >= r.phaseRange[0] && phase <= r.phaseRange[1];
            return matches;
        }) || this.lunarRooms[0]; // Default to New Moon if edge case

        // Always update current room to ensure sync
        const roomChanged = this.currentLunarRoom?.roomId !== room.roomId;
        this.currentLunarRoom = room;
        
        if (roomChanged) {
            console.log(`✨ Lunar room CHANGED to: ${room.roomName} (phase: ${phase.toFixed(3)})`);
        }
    },

    renderLunarRoom(room) {
        // Update room icon
        const iconEl = document.getElementById('lunarRoomIcon');
        if (iconEl) iconEl.textContent = room.icon;

        // Update room name
        const nameEl = document.getElementById('lunarRoomName');
        if (nameEl) nameEl.textContent = room.roomName;

        // Update room description
        const descEl = document.getElementById('lunarRoomDesc');
        if (descEl) descEl.textContent = room.description;

        // Update room energy in the practice room data attribute
        const roomEl = document.getElementById('lunarPracticeRoom');
        if (roomEl) {
            roomEl.setAttribute('data-room-id', room.roomId);
            roomEl.setAttribute('data-room-energy', room.energy);
        }

        // Update presence count — managed by _refreshOuterCard() via Supabase
        // Do not overwrite here to avoid clobbering live count
    },

    getLunarRoomByPhase(phase) {
        // ✅ FIXED: Changed < to <= to handle edge case where phase === phaseRange[1]
        return this.lunarRooms.find(r => 
            phase >= r.phaseRange[0] && phase <= r.phaseRange[1]
        ) || this.lunarRooms[0];
    },

    getCurrentRoom() {
        return this.currentLunarRoom;
    },

    // ===== PRACTICE ROOM JOINING =====
    joinLunarRoom() {
        if (!this.currentLunarRoom) {
            if (window.Core) {
                window.Core.showToast('⚠️ Lunar room not ready');
            }
            return;
        }

        const room = this.currentLunarRoom;
        
        // Route to the appropriate phase-specific room
        if (room.roomId === 'new-moon' && window.NewMoonRoom) {
            window.NewMoonRoom.enterRoom();
            return;
        }
        
        if (room.roomId === 'waxing-moon' && window.WaxingMoonRoom) {
            window.WaxingMoonRoom.enterRoom();
            return;
        }
        
        if (room.roomId === 'full-moon' && window.FullMoonRoom) {
            window.FullMoonRoom.enterRoom();
            return;
        }
        
        if (room.roomId === 'waning-moon' && window.WaningMoonRoom) {
            window.WaningMoonRoom.enterRoom();
            return;
        }
        
        // Fallback: If phase room not available, show toast
        if (window.Core) {
            window.Core.showToast(`🌙 ${room.roomName} opening soon`);
        }
        
        return;
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

    // Get current moon data for external use
    getMoonData() {
        return this.currentMoonData;
    },

    // ===== RENDER LUNAR CARD TO CONTAINER =====
    renderLunarCard() {
        const container = document.getElementById('lunarContainer');
        if (!container) {
            console.warn('LunarEngine: lunarContainer not found in DOM');
            return;
        }

        if (!this.currentMoonData || !this.currentLunarRoom) {
            container.innerHTML = '<p style="color: var(--text-muted); padding: 20px;">Loading lunar data...</p>';
            return;
        }

        const room = this.currentLunarRoom;
        const data = this.currentMoonData;
        const devMode = window.Core && window.Core.config.DEV_MODE;

        container.innerHTML = `
            <div class="celestial-card-full lunar-card">
                <div class="celestial-content-horizontal">
                    <!-- Moon Visual -->
                    <div class="celestial-visual-section">
                        <div class="moon-visual">
                            <svg width="120" height="120" viewBox="0 0 120 120" id="moonSvg">
                                <!-- Moon will be drawn here by updateMoonVisualization -->
                            </svg>
                        </div>
                    </div>

                    <!-- Moon Info -->
                    <div class="celestial-info-section">
                        <div class="celestial-info-title">Lunar Phase & Cycles</div>
                        <div class="moon-info">
                            <div class="moon-phase-name" id="moonPhaseName">${data.phaseName}</div>
                            <div class="moon-illumination" id="moonIllumination">${Math.round(data.fraction * 100)}% illuminated</div>
                            <div class="moon-age" id="moonAge">${data.age.toFixed(1)} days old</div>

                        </div>
                        <div class="next-phase" id="nextPhase">
                            Next Full Moon: ${this.formatDate(data.nextFullMoon)} (${Math.ceil((data.nextFullMoon - new Date()) / (1000 * 60 * 60 * 24))} days)
                        </div>
                    </div>

                    <!-- Moon Times -->
                    <div class="celestial-times-section">
                        <div class="celestial-time">
                            <span class="time-label">Moonrise</span>
                            <span class="time-value" id="moonrise">${data.rise ? this.formatTime(data.rise) : 'No rise today'}</span>
                        </div>
                        <div class="celestial-time">
                            <span class="time-label">Moonset</span>
                            <span class="time-value" id="moonset">${data.set ? this.formatTime(data.set) : 'No set today'}</span>
                        </div>
                    </div>
                </div>

                <!-- Integrated Lunar Practice Room -->
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
                                <div class="energy-pulse" style="background: var(--ring-silent);"></div>
                                <span id="lunarRoomPresence">0 present</span>
                            </div>
                            <button class="join-btn-inline" onclick="LunarEngine.joinLunarRoom()">Join Space</button>
                        </div>
                    </div>
                </div>

                ${devMode ? this.renderDevModeSection() : ''}
            </div>
        `;

        // Redraw moon visualization after rendering
        this.updateMoonVisualization();

        // Fetch live presence count for outer card
        this._refreshOuterCard();
    },

    // Fetch live participant count for the outer lunar card and subscribe to realtime updates
    _refreshOuterCard() {
        if (!window.CommunityDB || !CommunityDB.ready) {
            const _interval = setInterval(() => {
                if (!window.CommunityDB?.ready) return;
                clearInterval(_interval);
                this._refreshOuterCard();
            }, 500);
            return;
        }

        const room   = this.currentLunarRoom;
        if (!room) return;
        const roomId = room.roomId;

        const _doCount = async () => {
            try {
                const participants = await CommunityDB.getRoomParticipants(roomId);
                const el = document.getElementById('lunarRoomPresence');
                if (el) el.textContent = `${participants.length} present`;
            } catch(e) {
                console.warn('[LunarEngine] _refreshOuterCard error:', e);
            }
        };

        _doCount();

        // Realtime
        if (this._outerCardSub) {
            try { this._outerCardSub.unsubscribe(); } catch(e) {}
        }
        this._outerCardSub = CommunityDB.subscribeToPresence(_doCount);
    },

    // Render DEV MODE section with all lunar rooms
    renderDevModeSection() {
        return `
            <div style="margin-top: 24px; padding: 20px; background: var(--surface); border-radius: var(--radius-lg); border: 2px dashed var(--primary);">
                <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--primary); margin-bottom: 16px;">
                    🔧 DEV MODE: All Lunar Rooms
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
                    ${this.lunarRooms.map(room => `
                        <button 
                            onclick="LunarEngine.devJoinRoom('${room.roomId}')"
                            style="padding: 12px; background: var(--season-mood); border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; text-align: left; transition: all 0.2s;"
                            onmouseover="this.style.background='var(--border)'"
                            onmouseout="this.style.background='var(--season-mood)'"
                        >
                            <div style="font-size: 24px; margin-bottom: 4px;">${room.icon}</div>
                            <div style="font-size: 13px; font-weight: 600; color: var(--text);">${room.roomName}</div>
                            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${room.phaseName}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // DEV MODE: Join any room directly
    devJoinRoom(roomId) {
        
        if (roomId === 'new-moon' && window.NewMoonRoom) {
            window.NewMoonRoom.enterRoom();
            return;
        }
        
        if (roomId === 'waxing-moon' && window.WaxingMoonRoom) {
            window.WaxingMoonRoom.enterRoom();
            return;
        }
        
        if (roomId === 'full-moon' && window.FullMoonRoom) {
            window.FullMoonRoom.enterRoom();
            return;
        }
        
        if (roomId === 'waning-moon' && window.WaningMoonRoom) {
            window.WaningMoonRoom.enterRoom();
            return;
        }
        
        if (window.Core) {
            window.Core.showToast(`⚠️ ${roomId} module not loaded`);
        }
    }
};

// Expose globally
window.LunarEngine = LunarEngine;
