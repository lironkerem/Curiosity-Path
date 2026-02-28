/**
 * SOUND SETTINGS MIXIN
 * Adds sound settings (bells, ambient) to practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, SoundSettingsMixin);
 */

// ─── Sound catalogue (extend here to add new options) ────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────

const SoundSettingsMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initSoundState() {
        this.state.fiveMinBellEnabled  = false;
        this.state.ambientEnabled      = false;
        this.state.selectedBell        = 'tingsha';
        this.state.selectedCompletion  = 'tibetan';
        this.state.selectedAmbient     = 'stream';
    },

    // ── Panel ─────────────────────────────────────────────────────────────────

    toggleSoundSettings() {
        document.getElementById(`${this.roomId}SoundSettings`)?.classList.toggle('visible');
    },

    // ── Toggles ───────────────────────────────────────────────────────────────

    /**
     * Generic toggle: flips a boolean state key, syncs UI, shows toast.
     * @param {string} stateKey   - key on this.state to flip
     * @param {string} toggleId   - element id of the toggle-switch
     * @param {string} optionsId  - element id of the options panel
     * @param {string} label      - human label for toast ("5-minute bell")
     * @param {Function} [onEnable]  - called when toggled ON
     * @param {Function} [onDisable] - called when toggled OFF
     */
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

    // ── Preview ───────────────────────────────────────────────────────────────

    previewSound(soundType, event) {
        event?.stopPropagation();
        Core.showToast(`Playing ${soundType}…`);
        // TODO: wire to real audio file
    },

    // Alias — ambient preview uses the same behaviour
    previewAmbient(ambientType, event) {
        this.previewSound(ambientType, event);
    },

    // ── Playback stubs ────────────────────────────────────────────────────────

    playAmbientSound()  { /* TODO: start audio */ },
    stopAmbientSound()  { /* TODO: stop audio  */ },

    play5MinBell() {
        if (this.state.fiveMinBellEnabled) Core.showToast('🔔');
        // TODO: play bell audio
    },

    playCompletionSound() {
        Core.showToast('Session complete 🙏');
        // TODO: play completion audio
    },

    cleanupSound() {
        this.stopAmbientSound();
    },

    // ── HTML builders ─────────────────────────────────────────────────────────

    /** Single radio + label + preview button row. */
    _soundOption(groupName, value, label, previewFn) {
        return `
        <div class="sound-option">
            <input type="radio" name="${this.roomId}${groupName}" value="${value}">
            <label>${label}</label>
            <button class="sound-preview-btn" onclick="${this.getClassName()}.${previewFn}('${value}',event)">▶</button>
        </div>`;
    },

    buildSoundSettings() {
        const cn = this.getClassName();
        const id = this.roomId;

        const bellOptions = _BELL_OPTIONS.map(o =>
            this._soundOption('Bell5min', o.value, o.label, 'previewSound')).join('');

        const completionOptions = _COMPLETION_OPTIONS.map(o =>
            this._soundOption('Completion', o.value, o.label, 'previewSound')).join('');

        const ambientOptions = _AMBIENT_OPTIONS.map(o =>
            this._soundOption('Ambient', o.value, o.label, 'previewAmbient')).join('');

        return `
        <div class="sound-settings" id="${id}SoundSettings">

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">5-Minute Bell</span>
                    <div class="toggle-switch" id="${id}Toggle5min" onclick="${cn}.toggle5minBell()">
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
                    <div class="toggle-switch" id="${id}ToggleAmbient" onclick="${cn}.toggleAmbientSound()">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${id}AmbientOptions" style="display:none;">${ambientOptions}</div>
            </div>

        </div>`;
    },

    buildSoundButton() {
        return `
        <button class="ps-leave"
                onclick="${this.getClassName()}.toggleSoundSettings()"
                style="background:var(--surface);color:var(--text);padding:10px 16px;white-space:nowrap;">
            🔔 Sound
        </button>`;
    },
};

window.SoundSettingsMixin = SoundSettingsMixin;
