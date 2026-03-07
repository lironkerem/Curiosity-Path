/*** SILENT MEDITATION ROOM
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 */

import { PracticeRoom } from './PracticeRoom.js';
import { TimerMixin } from './mixins/TimerMixin.js';
import { SoundSettingsMixin } from './mixins/SoundSettingsMixin.js';
import { Core } from '../core.js';

class SilentRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'silent',
            roomType:    'always-open',
            name:        'Silent Meditation',
            icon:        '🧘',
            description: 'Join others in silence. No guidance, shared energy.',
            energy:      'Peaceful',
            imageUrl:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Silent.png',
            participants: 4,
        });

        this.initTimerState(1200); // 20 min default
        this.initSoundState();

        this.affirmations = [
            'Breathe in peace, breathe out tension',
            'This moment is enough',
            'I am here, I am present',
            'Let go of what was, embrace what is',
            'In stillness, I find clarity',
            'My breath is my anchor',
            'I trust the process of life',
            'Peace begins within',
            'I am worthy of this rest',
            'This too shall pass',
        ];

        this._affirmationInterval = null;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        this.startAffirmations();
    }

    onLeave() {
        this.resetTimer(); // resets state + DOM btn label + ring
        this._resetDimMode();
    }

    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();
        if (this._affirmationInterval) {
            clearInterval(this._affirmationInterval);
            this._affirmationInterval = null;
        }
    }

    onOutsideClick(e) {
        const panel = document.getElementById(`${this.roomId}SoundSettings`);
        if (panel && !panel.contains(e.target) && !e.target.closest('[onclick*="toggleSoundSettings"]')) {
            panel.classList.remove('visible');
        }
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    buildAdditionalHeaderButtons() {
        return `
            ${this.buildSoundButton()}
            <button class="ps-leave" onclick="${this.getClassName()}.toggleDimMode()"
                    id="${this.roomId}DimModeBtn" style="padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`;
    }

    buildBody() {
        return `
        ${this.buildSoundSettings()}
        <div class="ps-body">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;">
                <div id="${this.roomId}RotatingAffirmation"
                     style="position:relative;max-width:650px;text-align:center;font-size:22px;font-weight:600;letter-spacing:0.02em;line-height:1.6;margin-bottom:30px;z-index:10;opacity:0.7;transition:opacity 0.5s ease;">
                </div>
                ${this.buildTimerContainer()}
                ${this.buildTimerControls()}
                <div class="gratitude-container" id="${this.roomId}GratitudeContainer">
                    <button class="gratitude-btn" onclick="${this.getClassName()}.offerGratitude()">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg> Offer gratitude to the space
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

    // ── Affirmations ──────────────────────────────────────────────────────────

    startAffirmations() {
        this.rotateAffirmation();
        this._affirmationInterval = setInterval(() => this.rotateAffirmation(), 8000);
    }

    rotateAffirmation() {
        const el = document.getElementById(`${this.roomId}RotatingAffirmation`);
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => {
            el.textContent   = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
            el.style.opacity = '0.7';
        }, 500);
    }

    // ── Features ──────────────────────────────────────────────────────────────

    toggleDimMode() {
        const view = document.getElementById('dynamicRoomContent');
        if (!view) return;
        view.classList.toggle('dimmed');
        const isDimmed = view.classList.contains('dimmed');
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        if (btn) btn.innerHTML = isDimmed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim`;
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = isDimmed ? 'rgba(0,0,0,0.85)' : 'transparent';
    }

    /** Reset dim mode to default - called on leave. */
    _resetDimMode() {
        const view = document.getElementById('dynamicRoomContent');
        if (view) view.classList.remove('dimmed');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = 'transparent';
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        if (btn) btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim`;
    }

    offerGratitude() {
        Core.showToast('Gratitude offered to the space');
        const el = document.getElementById(`${this.roomId}GratitudeContainer`);
        if (!el) return;
        el.style.transform = 'scale(1.05)';
        setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
    }
}

Object.assign(SilentRoom.prototype, TimerMixin);
Object.assign(SilentRoom.prototype, SoundSettingsMixin);

// Window bridge: preserved for inline onclick handlers
const silentRoom = new SilentRoom();
window.SilentRoom = silentRoom;

export { SilentRoom, silentRoom };
