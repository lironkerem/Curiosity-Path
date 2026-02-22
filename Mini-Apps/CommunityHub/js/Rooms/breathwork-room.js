/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BREATHWORK ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class BreathworkRoom
 * @extends PracticeRoom
 * @mixes YouTubePlayerMixin, CycleStateMixin
 * @version 3.0.0
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class BreathworkRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'breathwork',
            roomType: 'timed',
            name: 'Breathwork',
            icon: '💨',
            description: 'Holotropic, Wim Hof, and more.',
            energy: 'Transformative',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Breathwork.png',
            participants: 0,
            cycleDuration: 90 * 60,      // 90 minutes — anchors cleanly every 1.5hrs from midnight UTC
            openDuration: 10 * 60,       // 10 minutes open window
            sessionDuration: 80 * 60     // 80 minutes session
        });
        
        // Dev mode for testing
        this.devMode = true;
        
        // Initialize mixins
        this.initPlayerState();
        this.initCycleState();
        
        // Breathwork library - 5 techniques rotating every 90 minutes
        this.breathworkSessions = [
            { id: 1, title: 'Holotropic Breathwork', duration: '70:00', category: 'Deep', 
              videoId: 'DqmQFz7aZ8w', emoji: '🌊' },
            { id: 2, title: 'Wim Hof Method', duration: '70:00', category: 'Power', 
              videoId: 'DqmQFz7aZ8w', emoji: '❄️' },
            { id: 3, title: 'Box Breathing (Navy SEAL)', duration: '70:00', category: 'Focus', 
              videoId: 'DqmQFz7aZ8w', emoji: '⬜' },
            { id: 4, title: 'Pranayama - Nadi Shodhana', duration: '70:00', category: 'Balance', 
              videoId: 'DqmQFz7aZ8w', emoji: '🧘' },
            { id: 5, title: 'Circular Breathing', duration: '70:00', category: 'Energy', 
              videoId: 'DqmQFz7aZ8w', emoji: '🔄' }
        ];
        
        this.state.currentSession = null;
        this.state.nextSession = null;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onInit() {
        this.initializeCycle();
    }
    
    onEnter() {
        this.loadYouTubeAPI();
    }
    
    onCleanup() {
        this.cleanupPlayer();
        this.cleanupCycle();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // CYCLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    setSessions(now) {
        const cycleMs = this.config.cycleDuration * 1000;
        const cycleNumber = Math.floor(now / cycleMs);
        const sessionIndex = cycleNumber % this.breathworkSessions.length;
        
        this.state.currentSession = this.breathworkSessions[sessionIndex];
        
        const nextIndex = (sessionIndex + 1) % this.breathworkSessions.length;
        this.state.nextSession = this.breathworkSessions[nextIndex];
    }
    
    getCurrentSession() {
        return this.state.currentSession;
    }
    
    getNextSession() {
        return this.state.nextSession;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // UI BUILDING
    // ═══════════════════════════════════════════════════════════════════════
    
    buildBody() {
        const session = this.getCurrentSession();
        
        return `
        <div class="ps-body">
            <main class="ps-main">
                <!-- Current Session Title -->
                <h2 style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: 600; color: var(--text);" id="${this.roomId}MeditationHeading">
                    Current Session - ${session?.title || 'Loading...'}
                </h2>

                ${this.buildPlayerContainer()}
                ${this.buildPlayerControls()}
            </main>
        </div>`;
    }
    
    buildAdditionalModals() {
        return this.buildScheduleModal();
    }
    
    buildScheduleModal() {
        return `
        <div class="modal-overlay" id="${this.roomId}ScheduleModal">
            <div class="modal-card schedule-modal">
                <button class="modal-close" onclick="${this.getClassName()}.closeScheduleModal()">×</button>
                <h2>📅 Upcoming Breathwork Sessions</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`;
    }
    
    getInstructions() {
        return `
            <p><strong>Transformative breathwork sessions every 90 minutes.</strong></p>
            
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC (00:00, 01:30, 03:00...)</li>
                <li>Open window: first 10 minutes of each cycle — enter before :10 to join</li>
                <li>Session runs for 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>5 different techniques rotating each cycle</li>
            </ul>
            
            <h3>Safety Guidelines:</h3>
            <ul>
                <li>Find a safe position (lying or seated)</li>
                <li>Never practice while driving or in water</li>
                <li>Stop if you feel dizzy or uncomfortable</li>
                <li>Breathe normally if needed</li>
            </ul>
            
            <h3>Techniques:</h3>
            <ul>
                <li>🌊 Holotropic - Deep transformative breathing</li>
                <li>❄️ Wim Hof - Power breathing and breath holds</li>
                <li>⬜ Box Breathing - Military focus technique</li>
                <li>🧘 Pranayama - Traditional yogic breathing</li>
                <li>🔄 Circular - Continuous energy breathing</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCHEDULE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    showScheduleModal() {
        const modal = document.getElementById(`${this.roomId}ScheduleModal`);
        const content = document.getElementById(`${this.roomId}ScheduleContent`);
        if (!modal || !content) return;

        const now     = Date.now();
        const cycleMs = this.config.cycleDuration * 1000;  // 5400000 ms (90 min)
        const openMs  = this.config.openDuration  * 1000;  // 600000 ms (10 min)

        const currentCycle = Math.floor(now / cycleMs);

        let scheduleHTML = '<div class="schedule-list">';

        // Current session + next 5 = 6 rows
        for (let i = 0; i < 6; i++) {
            const cycleIndex   = currentCycle + i;
            const cycleStartMs = cycleIndex * cycleMs;
            const cycleCloseMs = cycleStartMs + openMs;
            const sessionIndex = cycleIndex % this.breathworkSessions.length;
            const session      = this.breathworkSessions[sessionIndex];

            const isCurrent     = i === 0;
            const timeIntoCycle = now - cycleStartMs;
            const isOpen        = isCurrent && timeIntoCycle >= 0 && timeIntoCycle < openMs;
            const isInSession   = isCurrent && timeIntoCycle >= openMs;

            const openStr  = new Date(cycleStartMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const closeStr = new Date(cycleCloseMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

            let badge = '';
            let rowStyle = 'background: var(--surface);';
            if (isOpen) {
                badge    = '<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>';
                rowStyle = 'background: var(--accent); color: white;';
            } else if (isInSession) {
                badge    = '<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>';
            }

            scheduleHTML += `
                <div class="schedule-item ${isCurrent ? 'current' : ''}"
                     style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:var(--radius-md);margin-bottom:8px;${rowStyle}">
                    <div style="display:flex;align-items:center;gap:12px;flex:1;">
                        <span style="font-size:24px;">${session.emoji}</span>
                        <div>
                            <div style="font-weight:600;font-size:14px;">${session.title}${badge}</div>
                            <div style="font-size:11px;opacity:0.7;">${session.category} · ${session.duration}</div>
                        </div>
                    </div>
                    <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
                        <div style="font-weight:600;">${openStr}</div>
                        <div style="opacity:0.6;">closes ${closeStr}</div>
                    </div>
                </div>`;
        }

        scheduleHTML += '</div>';
        content.innerHTML = scheduleHTML;
        modal.classList.add('active');
    }
    
    closeScheduleModal() {
        const modal = document.getElementById(`${this.roomId}ScheduleModal`);
        if (modal) modal.classList.remove('active');
    }
}

// Apply mixins
Object.assign(BreathworkRoom.prototype, YouTubePlayerMixin);
Object.assign(BreathworkRoom.prototype, CycleStateMixin);

// Export singleton instance
window.BreathworkRoom = new BreathworkRoom();