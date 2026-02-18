/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SILENT MEDITATION ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class SilentRoom
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 * @version 3.0.0
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
        
        // Initialize mixins
        this.initTimerState(1200); // 20 minutes default
        this.initSoundState();
        
        // Affirmation system
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
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onEnter() {
        this.startAffirmations();
    }
    
    onLeave() {
        this.resetState();
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
    // UI BUILDING
    // ═══════════════════════════════════════════════════════════════════════
    
    buildAdditionalHeaderButtons() {
        return `
            ${this.buildSoundButton()}
            <button class="ps-leave" 
                    onclick="${this.getClassName()}.toggleDimMode()" 
                    id="${this.roomId}DimModeBtn" 
                    style="margin: 0; padding: 12px 24px; white-space: nowrap; min-width: 120px;">
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
                     style="position: relative; max-width: 650px; text-align: center; font-size: 22px; font-weight: 600; letter-spacing: 0.02em; line-height: 1.6; margin-bottom: 30px; z-index: 10; opacity: 0.7;">
                </div>

                <!-- Timer Container -->
                ${this.buildTimerContainer()}
                
                <!-- Timer Controls -->
                ${this.buildTimerControls()}

                <!-- Gratitude Container -->
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
        
        const randomAffirmation = this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
        
        container.style.opacity = '0';
        setTimeout(() => {
            container.textContent = randomAffirmation;
            container.style.opacity = '0.7';
        }, 500);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // ADDITIONAL FEATURES
    // ═══════════════════════════════════════════════════════════════════════
    
    toggleDimMode() {
        const view = document.getElementById('practiceRoomView');
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        
        if (view) {
            view.classList.toggle('dimmed');
            const isDimmed = view.classList.contains('dimmed');
            if (btn) btn.textContent = isDimmed ? '☀️ Bright' : '🌙 Dim';
            
            const container = document.getElementById('communityHubFullscreenContainer');
            if (container) {
                container.style.background = isDimmed ? 'rgba(0,0,0,0.85)' : 'transparent';
            }
        }
    }
    
    offerGratitude() {
        Core.showToast('🙏 Gratitude offered to the space');
        
        // Add visual effect
        const container = document.getElementById(`${this.roomId}GratitudeContainer`);
        if (container) {
            container.style.transform = 'scale(1.05)';
            setTimeout(() => {
                container.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    resetState() {
        this.state.timerRunning = false;
        this.state.timeLeft = 1200;
    }
}

// Apply mixins
Object.assign(SilentRoom.prototype, TimerMixin);
Object.assign(SilentRoom.prototype, SoundSettingsMixin);

// Export singleton instance
window.SilentRoom = new SilentRoom();