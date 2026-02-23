/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GUIDED MEDITATION ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class GuidedRoom
 * @extends PracticeRoom
 * @mixes YouTubePlayerMixin, CycleStateMixin
 * @version 3.0.0
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class GuidedRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'guided',
            roomType: 'timed',
            name: 'Guided Meditation',
            icon: '🎧',
            description: 'Hourly sessions. Timer & notifications.',
            energy: 'Focused',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Visualization.png',
            participants: 0,
            cycleDuration: 60 * 60,      // 60 minutes (hourly)
            openDuration: 15 * 60,       // 15 minutes open window
            sessionDuration: 45 * 60     // 45 minutes session
        });
        // Initialize mixins
        this.initPlayerState();
        this.initCycleState();
        
        // Meditation library
        this.meditations = [
            { id: 1, title: 'Grounding to the Center of Earth', duration: '29:56', category: 'Grounding', 
              videoId: '_KedpeSYwgA', emoji: '🌍', premium: false },
            { id: 2, title: 'Aura Adjustment and Cleaning', duration: '29:56', category: 'Energy', 
              videoId: 'gIMfdNkAC4g', emoji: '✨', premium: false },
            { id: 3, title: 'Chakra Cleaning', duration: '39:58', category: 'Chakras', 
              videoId: 'BFvmLeYg7cE', emoji: '🌈', premium: false },
            { id: 4, title: 'The Center of the Universe', duration: '29:56', category: 'Spiritual', 
              videoId: '1T2dNQ4M7Ko', emoji: '🌌', premium: false },
            { id: 5, title: 'Blowing Roses Healing Technique', duration: '29:56', category: 'Healing', 
              videoId: '3yQrtsHbSBo', emoji: '🌹', premium: false },
            { id: 6, title: '3 Wishes Manifestation', duration: '29:52', category: 'Manifestation', 
              videoId: 'EvRa_qwgJao', emoji: '⭐', premium: false },
            { id: 7, title: 'Meeting your Higher Self', duration: '29:56', category: 'Premium', 
              videoId: '34mla-PnpeU', emoji: '💎', premium: true },
            { id: 8, title: 'Inner Temple', duration: '29:46', category: 'Premium', 
              videoId: 't6o6lpftZBA', emoji: '🔮', premium: true },
            { id: 9, title: 'Gratitude Practice', duration: '29:56', category: 'Premium', 
              videoId: 'JyTwWAhsiq8', emoji: '👑', premium: true }
        ];
        
        this.state.currentMeditation = null;
        this.state.nextMeditation = null;
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
        const currentHour = new Date(now).getHours();
        const meditationIndex = currentHour % this.meditations.length;
        
        this.state.currentMeditation = this.meditations[meditationIndex];
        
        const nextIndex = (meditationIndex + 1) % this.meditations.length;
        this.state.nextMeditation = this.meditations[nextIndex];
    }
    
    getCurrentSession() {
        return this.state.currentMeditation;
    }
    
    getNextSession() {
        return this.state.nextMeditation;
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
                <h2>📅 Today's Meditation Schedule</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`;
    }
    
    getInstructions() {
        return `
            <p><strong>Hourly guided meditation sessions.</strong></p>
            
            <h3>How It Works:</h3>
            <ul>
                <li>A new session begins every hour, on the hour</li>
                <li>Open window: :00 to :15 (first 15 minutes of each hour)</li>
                <li>Session runs for 45 minutes · Room closes at :15</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>9 different meditations rotating hourly</li>
            </ul>
            
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Find a comfortable seated position</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Follow the guided instructions</li>
                <li>Allow yourself to fully receive</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SCHEDULE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    showScheduleModal() {
        const modal = document.getElementById(`${this.roomId}ScheduleModal`);
        const content = document.getElementById(`${this.roomId}ScheduleContent`);
        if (!modal || !content) return;

        const now      = Date.now();
        const cycleMs  = this.config.cycleDuration * 1000;  // 3600000 ms (1 hour)
        const openMs   = this.config.openDuration  * 1000;  // 900000 ms (15 min)

        // Current cycle index anchored to Unix epoch (same for all users)
        const currentCycle = Math.floor(now / cycleMs);

        let scheduleHTML = '<div class="schedule-list">';

        // Current session + next 5 = 6 rows
        for (let i = 0; i < 6; i++) {
            const cycleIndex      = currentCycle + i;
            const cycleStartMs    = cycleIndex * cycleMs;           // when this cycle's open window starts
            const cycleCloseMs    = cycleStartMs + openMs;          // when entry closes (:15)
            const meditationIndex = cycleIndex % this.meditations.length;
            const meditation      = this.meditations[meditationIndex];

            const isCurrent = i === 0;
            const timeIntoCycle = now - cycleStartMs;
            const isOpen        = isCurrent && timeIntoCycle >= 0 && timeIntoCycle < openMs;
            const isInSession   = isCurrent && timeIntoCycle >= openMs;

            // Local wall-clock open time (e.g. "3:00 PM")
            const openDate  = new Date(cycleStartMs);
            const closeDate = new Date(cycleCloseMs);
            const openStr   = openDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            const closeStr  = closeDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

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
                        <span style="font-size:22px;">${meditation.emoji}</span>
                        <div>
                            <div style="font-weight:600;font-size:14px;">${meditation.title}${badge}</div>
                            <div style="font-size:11px;opacity:0.7;">${meditation.duration}</div>
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
    
    formatHour(hour) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }
}

// Apply mixins
Object.assign(GuidedRoom.prototype, YouTubePlayerMixin);
Object.assign(GuidedRoom.prototype, CycleStateMixin);

// Export singleton instance
window.GuidedRoom = new GuidedRoom();