/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SOUND SETTINGS MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin SoundSettingsMixin
 * @description Adds sound settings functionality (bells, ambient sounds) to rooms
 * @version 3.0.0
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, SoundSettingsMixin);
 * 
 * Features:
 *   - 5-minute bell toggle
 *   - Completion sound selection
 *   - Ambient sound toggle and selection
 *   - Sound preview
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SoundSettingsMixin = {
    /**
     * Initialize sound settings state
     */
    initSoundState() {
        this.state.fiveMinBellEnabled = false;
        this.state.ambientEnabled = false;
        this.state.selectedBell = 'tingsha';
        this.state.selectedCompletion = 'tibetan';
        this.state.selectedAmbient = 'stream';
    },
    
    /**
     * Toggle sound settings panel
     */
    toggleSoundSettings() {
        const panel = document.getElementById(`${this.roomId}SoundSettings`);
        if (panel) {
            panel.classList.toggle('visible');
        }
    },
    
    /**
     * Toggle 5-minute bell
     */
    toggle5minBell() {
        this.state.fiveMinBellEnabled = !this.state.fiveMinBellEnabled;
        
        const toggle = document.getElementById(`${this.roomId}Toggle5min`);
        const options = document.getElementById(`${this.roomId}5minOptions`);
        
        if (toggle) {
            toggle.classList.toggle('active', this.state.fiveMinBellEnabled);
        }
        
        if (options) {
            options.style.display = this.state.fiveMinBellEnabled ? 'block' : 'none';
        }
        
        Core.showToast(this.state.fiveMinBellEnabled ? '5-minute bell enabled' : '5-minute bell disabled');
    },
    
    /**
     * Toggle ambient sound
     */
    toggleAmbientSound() {
        this.state.ambientEnabled = !this.state.ambientEnabled;
        
        const toggle = document.getElementById(`${this.roomId}ToggleAmbient`);
        const options = document.getElementById(`${this.roomId}AmbientOptions`);
        
        if (toggle) {
            toggle.classList.toggle('active', this.state.ambientEnabled);
        }
        
        if (options) {
            options.style.display = this.state.ambientEnabled ? 'block' : 'none';
        }
        
        Core.showToast(this.state.ambientEnabled ? 'Ambient sound enabled' : 'Ambient sound disabled');
        
        // Start/stop ambient sound playback
        if (this.state.ambientEnabled) {
            this.playAmbientSound();
        } else {
            this.stopAmbientSound();
        }
    },
    
    /**
     * Preview a sound
     * @param {string} soundType - Sound type to preview
     * @param {Event} event - Click event
     */
    previewSound(soundType, event) {
        if (event) event.stopPropagation();
        Core.showToast(`Playing ${soundType}...`);
        // TODO: Play actual sound file
    },
    
    /**
     * Preview ambient sound
     * @param {string} ambientType - Ambient sound type
     * @param {Event} event - Click event
     */
    previewAmbient(ambientType, event) {
        if (event) event.stopPropagation();
        Core.showToast(`Playing ${ambientType}...`);
        // TODO: Play actual ambient sound
    },
    
    /**
     * Play ambient sound
     */
    playAmbientSound() {
        // TODO: Implement actual audio playback
        console.log('Playing ambient sound:', this.state.selectedAmbient);
    },
    
    /**
     * Stop ambient sound
     */
    stopAmbientSound() {
        // TODO: Implement actual audio stop
        console.log('Stopping ambient sound');
    },
    
    /**
     * Play 5-minute bell
     */
    play5MinBell() {
        if (!this.state.fiveMinBellEnabled) return;
        // TODO: Play actual bell sound
        Core.showToast('🔔');
    },
    
    /**
     * Play completion sound
     */
    playCompletionSound() {
        // TODO: Play actual completion sound
        Core.showToast('Session complete 🙏');
    },
    
    /**
     * Build sound settings panel HTML
     * @returns {string} Sound settings HTML
     */
    buildSoundSettings() {
        return `
        <div class="sound-settings" id="${this.roomId}SoundSettings">
            <!-- 5-Minute Bell -->
            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">5-Minute Bell</span>
                    <div class="toggle-switch" id="${this.roomId}Toggle5min" onclick="${this.getClassName()}.toggle5minBell()">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${this.roomId}5minOptions" style="display: none;">
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Bell5min" value="tingsha" checked>
                        <label>Tingsha Bells</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('tingsha', event)">▶</button>
                    </div>
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Bell5min" value="bowl">
                        <label>Singing Bowl</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('bowl', event)">▶</button>
                    </div>
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Bell5min" value="chime">
                        <label>Wind Chime</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('chime', event)">▶</button>
                    </div>
                </div>
            </div>

            <!-- Completion Sound -->
            <div class="sound-section">
                <div class="sound-section-title">Completion Sound</div>
                <div class="sound-option">
                    <input type="radio" name="${this.roomId}Completion" value="tibetan" checked>
                    <label>Tibetan Bowl</label>
                    <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('tibetan', event)">▶</button>
                </div>
                <div class="sound-option">
                    <input type="radio" name="${this.roomId}Completion" value="gong">
                    <label>Temple Gong</label>
                    <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('gong', event)">▶</button>
                </div>
                <div class="sound-option">
                    <input type="radio" name="${this.roomId}Completion" value="bell">
                    <label>Temple Bell</label>
                    <button class="sound-preview-btn" onclick="${this.getClassName()}.previewSound('bell', event)">▶</button>
                </div>
            </div>

            <!-- Ambient Sound -->
            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">Ambient Sound</span>
                    <div class="toggle-switch" id="${this.roomId}ToggleAmbient" onclick="${this.getClassName()}.toggleAmbientSound()">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${this.roomId}AmbientOptions" style="display: none;">
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Ambient" value="stream" checked>
                        <label>Gentle Stream</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewAmbient('stream', event)">▶</button>
                    </div>
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Ambient" value="rain">
                        <label>Soft Rain</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewAmbient('rain', event)">▶</button>
                    </div>
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Ambient" value="forest">
                        <label>Forest Birds</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewAmbient('forest', event)">▶</button>
                    </div>
                    <div class="sound-option">
                        <input type="radio" name="${this.roomId}Ambient" value="ocean">
                        <label>Ocean Waves</label>
                        <button class="sound-preview-btn" onclick="${this.getClassName()}.previewAmbient('ocean', event)">▶</button>
                    </div>
                </div>
            </div>
        </div>`;
    },
    
    /**
     * Build sound button for header
     * @returns {string} Sound button HTML
     */
    buildSoundButton() {
        return `
        <button class="ps-leave" 
                onclick="${this.getClassName()}.toggleSoundSettings()" 
                style="background: var(--surface); color: var(--text); margin: 0; padding: 10px 16px; white-space: nowrap;">
            🔔 Sound
        </button>`;
    },
    
    /**
     * Cleanup sound on room exit
     */
    cleanupSound() {
        this.stopAmbientSound();
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.SoundSettingsMixin = SoundSettingsMixin;
