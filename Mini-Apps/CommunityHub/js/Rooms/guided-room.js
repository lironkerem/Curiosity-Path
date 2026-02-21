/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GUIDED MEDITATION ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class GuidedRoom
 * @extends PracticeRoom
 * @mixes YouTubePlayerMixin, CycleStateMixin
 * @version 3.1.0 — PATCHED:
 *   - Session heading now updated in onEnter() to guarantee it reflects live data
 *   - "View Schedule" button added directly in buildBody (no reliance on mixin for trigger)
 *   - devMode stays true (in development)
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
            openDuration:  15 * 60,      // 15 minutes open window
            sessionDuration: 45 * 60     // 45 minutes session
        });

        this.devMode = true;

        this.initPlayerState();
        this.initCycleState();

        this.meditations = [
            { id: 1, title: 'Grounding to the Center of Earth',  duration: '29:56', category: 'Grounding',      videoId: '_KedpeSYwgA', emoji: '🌍', premium: false },
            { id: 2, title: 'Aura Adjustment and Cleaning',       duration: '29:56', category: 'Energy',         videoId: 'gIMfdNkAC4g', emoji: '✨', premium: false },
            { id: 3, title: 'Chakra Cleaning',                    duration: '39:58', category: 'Chakras',        videoId: 'BFvmLeYg7cE', emoji: '🌈', premium: false },
            { id: 4, title: 'The Center of the Universe',         duration: '29:56', category: 'Spiritual',      videoId: '1T2dNQ4M7Ko', emoji: '🌌', premium: false },
            { id: 5, title: 'Blowing Roses Healing Technique',    duration: '29:56', category: 'Healing',        videoId: '3yQrtsHbSBo', emoji: '🌹', premium: false },
            { id: 6, title: '3 Wishes Manifestation',             duration: '29:52', category: 'Manifestation',  videoId: 'EvRa_qwgJao', emoji: '⭐', premium: false },
            { id: 7, title: 'Meeting your Higher Self',           duration: '29:56', category: 'Premium',        videoId: '34mla-PnpeU', emoji: '💎', premium: true  },
            { id: 8, title: 'Inner Temple',                       duration: '29:46', category: 'Premium',        videoId: 't6o6lpftZBA', emoji: '🔮', premium: true  },
            { id: 9, title: 'Gratitude Practice',                 duration: '29:56', category: 'Premium',        videoId: 'JyTwWAhsiq8', emoji: '👑', premium: true  }
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
            const heading = document.getElementById(`${this.roomId}MeditationHeading`);
            const session = this.getCurrentSession();
            if (heading && session) {
                heading.textContent = `Current Session — ${session.emoji} ${session.title}`;
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
        const currentHour      = new Date(now).getHours();
        const meditationIndex  = currentHour % this.meditations.length;
        this.state.currentMeditation = this.meditations[meditationIndex];

        const nextIndex = (meditationIndex + 1) % this.meditations.length;
        this.state.nextMeditation = this.meditations[nextIndex];
    }

    getCurrentSession() { return this.state.currentMeditation; }
    getNextSession()    { return this.state.nextMeditation; }

    // ═══════════════════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════════════════

    buildBody() {
        const session = this.getCurrentSession();

        return `
        <div class="ps-body">
            <main class="ps-main">
                <!-- Current Session Title -->
                <h2 style="text-align: center; margin: 20px 0; font-size: 24px; font-weight: 600; color: var(--text);"
                    id="${this.roomId}MeditationHeading">
                    Current Session — ${session ? `${session.emoji} ${session.title}` : 'Loading...'}
                </h2>

                <!-- View Schedule button (always visible; does not depend on YouTubePlayerMixin) -->
                <div style="text-align:center; margin-bottom: 16px;">
                    <button onclick="${this.getClassName()}.showScheduleModal()"
                            style="padding: 10px 24px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 14px;">
                        📅 View Today's Schedule
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
                <li>Sessions start every hour at :10 minutes</li>
                <li>Open window: :55 to :10 (15 minutes)</li>
                <li>Session runs for 45 minutes</li>
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
    // SCHEDULE
    // ═══════════════════════════════════════════════════════════════════════

    showScheduleModal() {
        const modal   = document.getElementById(`${this.roomId}ScheduleModal`);
        const content = document.getElementById(`${this.roomId}ScheduleContent`);
        if (!modal || !content) return;

        const now         = new Date();
        const currentHour = now.getHours();

        let html = '<div class="schedule-list">';

        for (let i = 0; i < 24; i++) {
            const meditationIndex = i % this.meditations.length;
            const meditation      = this.meditations[meditationIndex];
            const isCurrent       = i === currentHour;
            const isPast          = i < currentHour;

            html += `
                <div class="schedule-item ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}"
                     style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: var(--radius-md); margin-bottom: 8px;
                            ${isCurrent ? 'background: var(--accent); color: white;' : 'background: var(--surface); opacity:' + (isPast ? '0.5' : '1') + ';'}">
                    <div style="font-weight: 600; min-width: 80px;">${this.formatHour(i)}</div>
                    <div style="flex: 1; display: flex; align-items: center; gap: 8px; margin: 0 12px;">
                        <span style="font-size: 20px;">${meditation.emoji}</span>
                        <span style="font-size: 14px;">${meditation.title}</span>
                        ${meditation.premium ? '<span style="font-size:10px;background:rgba(139,92,246,0.2);padding:2px 6px;border-radius:4px;">Premium</span>' : ''}
                    </div>
                    <div style="font-size: 12px; opacity: 0.8;">${meditation.duration}</div>
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

    formatHour(hour) {
        const period      = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:00 ${period}`;
    }
}

Object.assign(GuidedRoom.prototype, YouTubePlayerMixin);
Object.assign(GuidedRoom.prototype, CycleStateMixin);

window.GuidedRoom = new GuidedRoom();
