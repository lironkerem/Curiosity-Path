/**
 * ═══════════════════════════════════════════════════════════════════════════
 * OSHO ACTIVE MEDITATION ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class OshoRoom
 * @extends PracticeRoom
 * @mixes YouTubePlayerMixin, CycleStateMixin
 * @version 3.1.0 — PATCHED:
 *   - Session heading now updated in onEnter() to guarantee it reflects live data
 *   - "View Schedule" button added directly in buildBody
 *   - devMode stays true (in development)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

class OshoRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'osho',
            roomType: 'timed',
            name: 'OSHO Active',
            icon: '💃',
            description: '7 OSHO methods. Dynamic practice.',
            energy: 'Dynamic',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/OSHO.png',
            participants: 0,
            cycleDuration:   100 * 60,
            openDuration:     10 * 60,
            sessionDuration:  90 * 60
        });

        this.devMode = true;

        this.initPlayerState();
        this.initCycleState();

        this.oshoMeditations = [
            { id: 1, title: 'OSHO Chakra Breathing Meditation', duration: '77:00', category: 'Energy',   videoId: 'DqmQFz7aZ8w', emoji: '🌬️' },
            { id: 2, title: 'OSHO Chakra Sounds Meditation',    duration: '77:00', category: 'Sound',    videoId: 'DqmQFz7aZ8w', emoji: '🎵' },
            { id: 3, title: 'OSHO Devavani Meditation',         duration: '77:00', category: 'Voice',    videoId: 'DqmQFz7aZ8w', emoji: '🗣️' },
            { id: 4, title: 'OSHO Kundalini Meditation',        duration: '77:00', category: 'Movement', videoId: 'DqmQFz7aZ8w', emoji: '💃' },
            { id: 5, title: 'OSHO Mandala Meditation',          duration: '77:00', category: 'Energy',   videoId: 'DqmQFz7aZ8w', emoji: '⭕' },
            { id: 6, title: 'OSHO Nadabrahma Meditation',       duration: '77:00', category: 'Humming',  videoId: 'DqmQFz7aZ8w', emoji: '🕉️' },
            { id: 7, title: 'OSHO Nataraj Meditation',          duration: '77:00', category: 'Dance',    videoId: 'DqmQFz7aZ8w', emoji: '🎭' }
        ];

        this.state.currentMeditation = null;
        this.state.nextMeditation    = null;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    onInit() {
        this.initializeCycle();
    }

    onEnter() {
        this.loadYouTubeAPI();

        // Update heading with the live current session after DOM is ready
        setTimeout(() => {
            const heading    = document.getElementById(`${this.roomId}MeditationHeading`);
            const meditation = this.getCurrentSession();
            if (heading && meditation) {
                heading.textContent = `Current Session — ${meditation.emoji} ${meditation.title}`;
            }
        }, 150);
    }

    onCleanup() {
        this.cleanupPlayer();
        this.cleanupCycle();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CYCLE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════

    setSessions(now) {
        const cycleMs          = this.config.cycleDuration * 1000;
        const cycleNumber      = Math.floor(now / cycleMs);
        const meditationIndex  = cycleNumber % this.oshoMeditations.length;
        this.state.currentMeditation = this.oshoMeditations[meditationIndex];

        const nextIndex = (meditationIndex + 1) % this.oshoMeditations.length;
        this.state.nextMeditation = this.oshoMeditations[nextIndex];
    }

    getCurrentSession() { return this.state.currentMeditation; }
    getNextSession()    { return this.state.nextMeditation; }

    // ═══════════════════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════════════════

    buildBody() {
        const meditation = this.getCurrentSession();

        return `
        <div class="ps-body">
            <main class="ps-main">
                <!-- Current Meditation Title -->
                <h2 style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: 600; color: var(--text);"
                    id="${this.roomId}MeditationHeading">
                    Current Session — ${meditation ? `${meditation.emoji} ${meditation.title}` : 'Loading...'}
                </h2>

                <!-- View Schedule button -->
                <div style="text-align:center; margin-bottom: 16px;">
                    <button onclick="${this.getClassName()}.showScheduleModal()"
                            style="padding: 10px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        📅 View Upcoming Sessions
                    </button>
                </div>

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
                <h2>📅 Upcoming OSHO Sessions</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`;
    }

    getInstructions() {
        return `
            <p><strong>Active OSHO meditation techniques every 100 minutes.</strong></p>

            <h3>How It Works:</h3>
            <ul>
                <li>Open window: First 10 minutes of each cycle</li>
                <li>Session runs for 90 minutes</li>
                <li>7 different OSHO methods rotating continuously</li>
            </ul>

            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Enter during the open window</li>
                <li>Follow the practice</li>
                <li>Express freely — move, breathe, sound</li>
                <li>Allow whatever arises</li>
            </ul>

            <h3>The 7 Methods:</h3>
            <ul>
                <li>🌬️ Chakra Breathing — Energy activation</li>
                <li>🎵 Chakra Sounds — Vocal energy work</li>
                <li>🗣️ Devavani — Gibberish and silence</li>
                <li>💃 Kundalini — Shaking and dancing</li>
                <li>⭕ Mandala — Running in circles</li>
                <li>🕉️ Nadabrahma — Humming meditation</li>
                <li>🎭 Nataraj — Dance meditation</li>
            </ul>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SCHEDULE
    // ═══════════════════════════════════════════════════════════════════════

    showScheduleModal() {
        const modal   = document.getElementById(`${this.roomId}ScheduleModal`);
        const content = document.getElementById(`${this.roomId}ScheduleContent`);
        if (!modal || !content) return;

        const now          = Date.now();
        const cycleMs      = this.config.cycleDuration * 1000;
        const currentCycle = Math.floor(now / cycleMs);

        let html = '<div class="schedule-list">';

        // Show next 14 sessions (2 full rotations of 7)
        for (let i = 0; i < 14; i++) {
            const cycleIndex       = currentCycle + i;
            const meditationIndex  = cycleIndex % this.oshoMeditations.length;
            const meditation       = this.oshoMeditations[meditationIndex];
            const cycleStart       = cycleIndex * cycleMs;
            const timeUntil        = cycleStart - now;
            const isCurrent        = i === 0;

            const hours   = Math.floor(timeUntil / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

            let timeText = '';
            if (isCurrent && this.state.isOpen) timeText = 'Open Now';
            else if (isCurrent)                 timeText = 'In Session';
            else if (hours > 0)                 timeText = `In ${hours}h ${minutes}m`;
            else if (minutes > 0)               timeText = `In ${minutes}m`;
            else                                timeText = 'Starting soon';

            html += `
                <div class="schedule-item ${isCurrent ? 'current' : ''}"
                     style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:var(--radius-md);margin-bottom:8px;
                            ${isCurrent ? 'background:var(--accent);color:white;' : 'background:var(--surface);'}">
                    <div style="flex:1;display:flex;align-items:center;gap:12px;">
                        <span style="font-size:24px;">${meditation.emoji}</span>
                        <div>
                            <div style="font-weight:600;font-size:14px;">${meditation.title}</div>
                            <div style="font-size:11px;opacity:0.7;">${meditation.category} · ${meditation.duration}</div>
                        </div>
                    </div>
                    <div style="font-size:12px;font-weight:500;">${timeText}</div>
                </div>`;
        }

        html += '</div>';
        content.innerHTML = html;
        modal.classList.add('active');
    }

    closeScheduleModal() {
        const modal = document.getElementById(`${this.roomId}ScheduleModal`);
        if (modal) modal.classList.remove('active');
    }
}

Object.assign(OshoRoom.prototype, YouTubePlayerMixin);
Object.assign(OshoRoom.prototype, CycleStateMixin);

window.OshoRoom = new OshoRoom();
