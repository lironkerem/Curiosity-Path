/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SILENT MEDITATION ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class SilentRoom
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 * @version 3.1.0 — PATCHED:
 *   - onLeave() now resets communityHubFullscreenContainer background
 *     so dim mode doesn't bleed into other rooms after leaving
 *   - devMode stays true (in development)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

class SilentRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'silent',
            roomType: 'always-open',
            name: 'Silent Meditation',
            icon: '🧘',
            description: 'Join others in silence. No guidance, shared energy.',
            energy: 'Peaceful',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Silent.png',
            participants: 4
        });

        this.initTimerState(1200); // 20 minutes default
        this.initSoundState();

        this.affirmations = [
            "Breathe in peace, breathe out tension",
            "This moment is enough",
            "I am here, I am present",
            "Let go of what was, embrace what is",
            "In stillness, I find clarity",
            "My breath is my anchor",
            "I trust the process of life",
            "Peace begins within",
            "I am worthy of this rest",
            "This too shall pass"
        ];

        this.affirmationInterval = null;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    onEnter() {
        this.startAffirmations();
    }

    onLeave() {
        this.resetState();

        // Reset dim mode so it doesn't bleed into other rooms
        const view = document.getElementById('practiceRoomView');
        if (view) view.classList.remove('dimmed');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = 'transparent';
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        if (btn) btn.textContent = '🌙 Dim';
    }

    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();

        if (this.affirmationInterval) {
            clearInterval(this.affirmationInterval);
            this.affirmationInterval = null;
        }
    }

    onOutsideClick(e) {
        const soundSettings = document.getElementById(`${this.roomId}SoundSettings`);
        if (soundSettings && !soundSettings.contains(e.target) &&
            !e.target.closest('[onclick*="toggleSoundSettings"]')) {
            soundSettings.classList.remove('visible');
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════════════════

    buildAdditionalHeaderButtons() {
        return `
            ${this.buildSoundButton()}
            <button class="ps-leave"
                    onclick="${this.getClassName()}.toggleDimMode()"
                    id="${this.roomId}DimModeBtn"
                    style="margin: 0; padding: 10px 16px; white-space: nowrap;">
                🌙 Dim
            </button>`;
    }

    buildBody() {
        return `
        ${this.buildSoundSettings()}
        <div class="ps-body">
            <main class="ps-main" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0;">

                <!-- Affirmation -->
                <div id="${this.roomId}RotatingAffirmation"
                     style="position: relative; max-width: 650px; text-align: center; font-size: 22px; font-weight: 600; letter-spacing: 0.02em; line-height: 1.6; margin-bottom: 30px; z-index: 10; opacity: 0.7; transition: opacity 0.5s ease;">
                </div>

                <!-- Timer -->
                ${this.buildTimerContainer()}

                <!-- Controls -->
                ${this.buildTimerControls()}

                <!-- Gratitude -->
                <div class="gratitude-container" id="${this.roomId}GratitudeContainer">
                    <button class="gratitude-btn" onclick="${this.getClassName()}.offerGratitude()">
                        🙏 Offer gratitude to the space
                    </button>
                </div>
            </main>
        </div>`;
    }

    getInstructions() {
        return `
            <p><strong>Welcome to the Silent Meditation space.</strong></p>

            <h3>How to Practice:</h3>
            <ul>
                <li>Set your timer using +/- buttons</li>
                <li>Click "Begin" to start</li>
                <li>Focus on your breath</li>
                <li>Use the timer ring as a visual anchor</li>
            </ul>

            <h3>Sound Settings:</h3>
            <ul>
                <li>5-minute bells for gentle reminders</li>
                <li>Ambient sounds for atmosphere</li>
                <li>Completion bell when session ends</li>
            </ul>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AFFIRMATIONS
    // ═══════════════════════════════════════════════════════════════════════

    startAffirmations() {
        this.rotateAffirmation();
        this.affirmationInterval = setInterval(() => {
            this.rotateAffirmation();
        }, 8000);
    }

    rotateAffirmation() {
        const container = document.getElementById(`${this.roomId}RotatingAffirmation`);
        if (!container) return;

        const text = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
        container.style.opacity = '0';
        setTimeout(() => {
            container.textContent  = text;
            container.style.opacity = '0.7';
        }, 500);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // FEATURES
    // ═══════════════════════════════════════════════════════════════════════

    toggleDimMode() {
        const view = document.getElementById('practiceRoomView');
        const btn  = document.getElementById(`${this.roomId}DimModeBtn`);
        if (view) {
            view.classList.toggle('dimmed');
            const isDimmed = view.classList.contains('dimmed');
            if (btn) btn.textContent = isDimmed ? '☀️ Bright' : '🌙 Dim';
            const container = document.getElementById('communityHubFullscreenContainer');
            if (container) container.style.background = isDimmed ? 'rgba(0,0,0,0.85)' : 'transparent';
        }
    }

    offerGratitude() {
        Core.showToast('🙏 Gratitude offered to the space');
        const container = document.getElementById(`${this.roomId}GratitudeContainer`);
        if (container) {
            container.style.transform = 'scale(1.05)';
            setTimeout(() => { container.style.transform = 'scale(1)'; }, 200);
        }
    }

    resetState() {
        this.state.timerRunning = false;
        this.state.timeLeft     = 1200;
    }
}

Object.assign(SilentRoom.prototype, TimerMixin);
Object.assign(SilentRoom.prototype, SoundSettingsMixin);

window.SilentRoom = new SilentRoom();
