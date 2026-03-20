/**
 * SOUND SETTINGS MIXIN
 * Adds sound settings (bells, ambient) to practice rooms.
 *
 * Bells / bowls / chimes  → synthesised via Web Audio API (no files needed)
 * Ambient sounds          → streamed from free CC0 CDN URLs
 *
 * Usage: Object.assign(YourRoom.prototype, SoundSettingsMixin);
 */

import { Core } from '../../core.js';

// ─── Sound catalogue ──────────────────────────────────────────────────────────

const _BELL_OPTIONS = [
    { value: 'tingsha', label: 'Tingsha Bells' },
    { value: 'bowl',    label: 'Singing Bowl'  },
    { value: 'chime',   label: 'Wind Chime'    },
];

const _COMPLETION_OPTIONS = [
    { value: 'tibetan', label: 'Tibetan Bowl' },
    { value: 'gong',    label: 'Temple Gong'  },
    { value: 'bell',    label: 'Temple Bell'  },
];

const _AMBIENT_OPTIONS = [
    { value: 'stream', label: 'Gentle Stream' },
    { value: 'rain',   label: 'Soft Rain'     },
    { value: 'forest', label: 'Forest Birds'  },
    { value: 'ocean',  label: 'Ocean Waves'   },
];

const _AMBIENT_URLS = {
    stream: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2ded6c2d03.mp3',
    rain:   'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce70.mp3',
    forest: 'https://cdn.pixabay.com/audio/2021/10/19/audio_e7fb33e943.mp3',
    ocean:  'https://cdn.pixabay.com/audio/2021/09/06/audio_6f8e47c21a.mp3',
};

const _BELL_PROFILES = {
    tingsha: {
        baseFreq: 900,
        partials: [
            { mult: 1.0,  gain: 0.6,  decay: 2.5 },
            { mult: 2.76, gain: 0.3,  decay: 1.8 },
            { mult: 5.40, gain: 0.15, decay: 1.0 },
        ],
    },
    bowl: {
        baseFreq: 220,
        partials: [
            { mult: 1.0,  gain: 0.7,  decay: 6.0 },
            { mult: 2.71, gain: 0.35, decay: 4.0 },
            { mult: 5.20, gain: 0.12, decay: 2.5 },
        ],
    },
    chime: {
        baseFreq: 1200,
        partials: [
            { mult: 1.0,  gain: 0.5,  decay: 1.5 },
            { mult: 1.86, gain: 0.25, decay: 1.0 },
            { mult: 3.01, gain: 0.10, decay: 0.6 },
        ],
    },
    tibetan: {
        baseFreq: 180,
        partials: [
            { mult: 1.0,  gain: 0.7,  decay: 8.0 },
            { mult: 2.68, gain: 0.4,  decay: 6.0 },
            { mult: 5.10, gain: 0.15, decay: 3.5 },
        ],
    },
    gong: {
        baseFreq: 80,
        partials: [
            { mult: 1.0,  gain: 0.8,  decay: 6.0 },
            { mult: 2.20, gain: 0.5,  decay: 5.0 },
            { mult: 3.50, gain: 0.25, decay: 3.5 },
            { mult: 5.00, gain: 0.10, decay: 2.0 },
        ],
    },
    bell: {
        baseFreq: 440,
        partials: [
            { mult: 1.0,  gain: 0.65, decay: 4.0 },
            { mult: 2.75, gain: 0.3,  decay: 3.0 },
            { mult: 5.40, gain: 0.12, decay: 1.8 },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────

const SoundSettingsMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initSoundState() {
        this.state.fiveMinBellEnabled  = false;
        this.state.ambientEnabled      = false;
        this.state.selectedBell        = 'tingsha';
        this.state.selectedCompletion  = 'tibetan';
        this.state.selectedAmbient     = 'stream';
        this._audioCtx                 = null;
        this._ambientAudio             = null;
    },

    // ── AudioContext ──────────────────────────────────────────────────────────

    _getAudioCtx() {
        if (!this._audioCtx) {
            this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
        }
        return this._audioCtx;
    },

    // ── Bell synthesis ────────────────────────────────────────────────────────

    _playBellProfile(profileKey, gainMult = 1) {
        const profile = _BELL_PROFILES[profileKey];
        if (!profile) return;

        const ctx  = this._getAudioCtx();
        const now  = ctx.currentTime;

        profile.partials.forEach(({ mult, gain, decay }) => {
            const osc      = ctx.createOscillator();
            const gainNode = ctx.createGain();

            osc.type      = 'sine';
            osc.frequency.setValueAtTime(profile.baseFreq * mult, now);

            gainNode.gain.setValueAtTime(gain * gainMult, now);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + decay);
        });
    },

    // ── Panel ─────────────────────────────────────────────────────────────────

    toggleSoundSettings() {
        document.getElementById(`${this.roomId}SoundSettings`)?.classList.toggle('visible');
    },

    // ── Toggles ───────────────────────────────────────────────────────────────

    _toggleFeature(stateKey, toggleId, optionsId, label, onEnable, onDisable) {
        const next = !this.state[stateKey];
        this.state[stateKey] = next;

        document.getElementById(toggleId)?.classList.toggle('active', next);
        const opts = document.getElementById(optionsId);
        if (opts) opts.style.display = next ? 'block' : 'none';

        Core.showToast(`${label} ${next ? 'enabled' : 'disabled'}`);
        (next ? onEnable : onDisable)?.call(this);
    },

    toggle5minBell() {
        this._toggleFeature(
            'fiveMinBellEnabled',
            `${this.roomId}Toggle5min`,
            `${this.roomId}5minOptions`,
            '5-minute bell',
        );
    },

    toggleAmbientSound() {
        this._toggleFeature(
            'ambientEnabled',
            `${this.roomId}ToggleAmbient`,
            `${this.roomId}AmbientOptions`,
            'Ambient sound',
            this.playAmbientSound,
            this.stopAmbientSound,
        );
    },

    // ── Selection handlers ────────────────────────────────────────────────────

    selectBell(value)       { this.state.selectedBell = value; },
    selectCompletion(value) { this.state.selectedCompletion = value; },

    selectAmbient(value) {
        this.state.selectedAmbient = value;
        if (this.state.ambientEnabled) {
            this.stopAmbientSound();
            this.playAmbientSound();
        }
    },

    // ── Preview ───────────────────────────────────────────────────────────────

    previewSound(soundType, event) {
        event?.stopPropagation();
        this._playBellProfile(soundType);
        Core.showToast(`▶ ${soundType}`);
    },

    previewAmbient(ambientType, event) {
        event?.stopPropagation();
        const url = _AMBIENT_URLS[ambientType];
        if (!url) return;
        if (this._previewAudio) {
            this._previewAudio.pause();
            this._previewAudio = null;
        }
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(() => Core.showToast('Preview unavailable'));
        this._previewAudio = audio;
        setTimeout(() => {
            audio.pause();
            this._previewAudio = null;
        }, 4000);
        Core.showToast(`▶ ${ambientType}`);
    },

    // ── Playback ──────────────────────────────────────────────────────────────

    playAmbientSound() {
        const url = _AMBIENT_URLS[this.state.selectedAmbient];
        if (!url) return;
        this.stopAmbientSound();
        const audio = new Audio(url);
        audio.loop   = true;
        audio.volume = 0.35;
        audio.play().catch(() => Core.showToast('Ambient audio unavailable'));
        this._ambientAudio = audio;
    },

    stopAmbientSound() {
        if (this._ambientAudio) {
            this._ambientAudio.pause();
            this._ambientAudio.src = '';
            this._ambientAudio     = null;
        }
    },

    play5MinBell() {
        if (!this.state.fiveMinBellEnabled) return;
        this._playBellProfile(this.state.selectedBell, 0.7);
        Core.showToast('5-minute bell');
    },

    playCompletionSound() {
        this._playBellProfile(this.state.selectedCompletion, 1.0);
        Core.showToast('Session complete');
    },

    cleanupSound() {
        this.stopAmbientSound();
        if (this._previewAudio) {
            this._previewAudio.pause();
            this._previewAudio = null;
        }
        if (this._audioCtx) {
            this._audioCtx.close();
            this._audioCtx = null;
        }
    },

    // ── HTML builders ─────────────────────────────────────────────────────────

    _soundOption(groupName, value, label, previewFn, selectFn) {
        const cn      = this.getClassName();
        const checked = this.state[`selected${groupName}`] === value ? 'checked' : '';
        return `
        <div class="sound-option">
            <input type="radio" name="${this.roomId}${groupName}" value="${value}" ${checked}
                   id="${this.roomId}_${groupName}_${value}"
                   onchange="${cn}.${selectFn}('${value}')">
            <label for="${this.roomId}_${groupName}_${value}">${label}</label>
            <button type="button" class="sound-preview-btn" aria-label="Preview ${label}" onclick="${cn}.${previewFn}('${value}',event)">▶</button>
        </div>`;
    },

    buildSoundSettings() {
        const cn = this.getClassName();
        const id = this.roomId;

        const bellOptions = _BELL_OPTIONS.map(o =>
            this._soundOption('Bell', o.value, o.label, 'previewSound', 'selectBell')).join('');

        const completionOptions = _COMPLETION_OPTIONS.map(o =>
            this._soundOption('Completion', o.value, o.label, 'previewSound', 'selectCompletion')).join('');

        const ambientOptions = _AMBIENT_OPTIONS.map(o =>
            this._soundOption('Ambient', o.value, o.label, 'previewAmbient', 'selectAmbient')).join('');

        return `
        <div class="sound-settings" id="${id}SoundSettings">

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">5-Minute Bell</span>
                    <div class="toggle-switch" id="${id}Toggle5min" role="switch" aria-checked="false" tabindex="0" onclick="${cn}.toggle5minBell()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${cn}.toggle5minBell();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${id}5minOptions" style="display:none;">${bellOptions}</div>
            </div>

            <div class="sound-section">
                <div class="sound-section-title">Completion Sound</div>
                ${completionOptions}
            </div>

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">Ambient Sound</span>
                    <div class="toggle-switch" id="${id}ToggleAmbient" role="switch" aria-checked="false" tabindex="0" onclick="${cn}.toggleAmbientSound()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();${cn}.toggleAmbientSound();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${id}AmbientOptions" style="display:none;">${ambientOptions}</div>
            </div>

        </div>`;
    },

    buildSoundButton() {
        return `
        <button type="button" class="ps-leave"
                onclick="${this.getClassName()}.toggleSoundSettings()"
                aria-label="Sound settings" aria-expanded="false"
                style="background:var(--surface);color:var(--text);padding:10px 16px;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Sound
        </button>`;
    },
};

export { SoundSettingsMixin };
