/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP WORK ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class DeepWorkRoom
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 * @version 3.0.0
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class DeepWorkRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'deepwork',
            roomType: 'always-open',
            name: 'Digital Nomads Deep Work',
            icon: '🎯',
            description: 'Focused work sessions. Pomodoro together.',
            energy: 'Focused',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Focus.png',
            participants: 12
        });
        
        // Initialize mixins
        this.initTimerState(1800); // 30 minutes default
        this.initSoundState();
        
        // Deep Work specific state
        this.state.currentStatus = 'deep-focus';
        this.state.lastFocusStatus = 'deep-focus';
        this.state.currentIntention = '';
        this.state.currentCategory = 'work';
        this.state.showSetup = true;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onEnter() {
        // Show setup modal on first entry
        if (this.state.showSetup) {
            setTimeout(() => this.showSetupModal(), 300);
        }
    }
    
    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();
    }
    
    onTimerComplete() {
        // Auto-switch to break when timer completes
        this.changeStatus('break');
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
    
    getParticipantText() {
        return `${this.state.participants} working together`;
    }
    
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
            <main class="ps-main" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                
                <!-- Status Selector -->
                <div class="status-selector" style="display: flex; gap: 12px; margin-bottom: 30px;">
                    <button class="status-btn ${this.state.currentStatus === 'deep-focus' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('deep-focus')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'deep-focus' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'deep-focus' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600;">
                        🎯 Deep Focus
                    </button>
                    <button class="status-btn ${this.state.currentStatus === 'light-focus' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('light-focus')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'light-focus' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'light-focus' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600;">
                        💡 Light Focus
                    </button>
                    <button class="status-btn ${this.state.currentStatus === 'break' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('break')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'break' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'break' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600;">
                        ☕ Break
                    </button>
                </div>
                
                <!-- Current Status Display -->
                <div id="currentStatus" style="font-size: 18px; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 20px; opacity: 0.8;">
                    ${this.getStatusText()}
                </div>
                
                <!-- Intention Display -->
                ${this.state.currentIntention ? `
                <div class="intention-display" style="max-width: 500px; text-align: center; margin-bottom: 30px; padding: 16px; background: var(--surface); border-radius: var(--radius-md); border: 2px solid var(--border);">
                    <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; margin-bottom: 8px;">
                        ${this.state.currentCategory}
                    </div>
                    <div style="font-size: 16px; font-weight: 500;">
                        ${this.state.currentIntention}
                    </div>
                </div>` : ''}
                
                <!-- Timer -->
                ${this.buildTimerContainer()}
                
                <!-- Timer Controls -->
                ${this.buildTimerControls()}
                
                <!-- Support Buttons -->
                <div class="support-buttons" style="display: flex; gap: 12px; margin-top: 30px;">
                    <button onclick="${this.getClassName()}.sendSupport('pulse')" 
                            style="padding: 10px 20px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); cursor: pointer; font-size: 14px;">
                        💫 Send focus energy
                    </button>
                    <button onclick="${this.getClassName()}.sendSupport('got-this')" 
                            style="padding: 10px 20px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); cursor: pointer; font-size: 14px;">
                        💪 You got this!
                    </button>
                    <button onclick="${this.getClassName()}.sendSupport('flow')" 
                            style="padding: 10px 20px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); cursor: pointer; font-size: 14px;">
                        🌊 Riding the flow
                    </button>
                </div>
            </main>
            
            <!-- Chat Sidebar (only visible during break) -->
            <aside class="deepwork-sidebar" id="${this.roomId}Sidebar" 
                   style="width: 0; overflow: hidden; transition: width 0.3s; background: var(--surface); border-left: 2px solid var(--border);">
                <div style="width: 300px; padding: 20px;">
                    <div style="font-weight: 600; margin-bottom: 16px;">Break Chat</div>
                    <div id="${this.roomId}ChatMessages" style="height: 400px; overflow-y: auto; margin-bottom: 16px; padding: 12px; background: var(--background); border-radius: var(--radius-md);"></div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" 
                               id="${this.roomId}ChatInput" 
                               placeholder="Break chat..."
                               ${this.state.currentStatus !== 'break' || this.state.timerRunning ? 'disabled' : ''}
                               style="flex: 1; padding: 10px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background);"
                               onkeypress="if(event.key==='Enter')${this.getClassName()}.sendChat()">
                        <button class="chat-send" 
                                onclick="${this.getClassName()}.sendChat()"
                                ${this.state.currentStatus !== 'break' || this.state.timerRunning ? 'disabled' : ''}
                                style="padding: 10px 16px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; cursor: pointer;">
                            →
                        </button>
                    </div>
                </div>
            </aside>
            
            <!-- Floating Chat Button -->
            <button class="fab-chat" 
                    id="${this.roomId}FabChat"
                    onclick="${this.getClassName()}.toggleChat()"
                    style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: var(--accent); border: none; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100;">
                💬
            </button>
        </div>`;
    }
    
    buildAdditionalModals() {
        return `
        <div class="modal-overlay" id="${this.roomId}SetupModal">
            <div class="modal-card">
                <h2 style="margin-bottom: 20px;">🎯 Set Your Intention</h2>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">What will you focus on?</label>
                    <input type="text" 
                           id="${this.roomId}IntentionInput" 
                           placeholder="e.g., Finish quarterly report"
                           style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background);">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Category</label>
                    <select id="${this.roomId}CategorySelect" 
                            style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background);">
                        <option value="work">Work</option>
                        <option value="study">Study</option>
                        <option value="creative">Creative</option>
                        <option value="planning">Planning</option>
                        <option value="learning">Learning</option>
                    </select>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Duration</label>
                    <select id="${this.roomId}DurationSelect" 
                            style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background);">
                        <option value="1500">25 minutes (Pomodoro)</option>
                        <option value="1800" selected>30 minutes</option>
                        <option value="2700">45 minutes</option>
                        <option value="3600">60 minutes</option>
                        <option value="5400">90 minutes</option>
                    </select>
                </div>
                
                <button onclick="${this.getClassName()}.startSession()" 
                        style="width: 100%; padding: 12px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; cursor: pointer; font-weight: 600;">
                    Start Session
                </button>
            </div>
        </div>`;
    }
    
    getInstructions() {
        return `
            <p><strong>Digital Nomads Deep Work space.</strong></p>
            
            <h3>How It Works:</h3>
            <ul>
                <li>Set your intention and duration</li>
                <li>Choose your focus level</li>
                <li>Work alongside others</li>
                <li>Take mindful breaks</li>
            </ul>
            
            <h3>Focus Levels:</h3>
            <ul>
                <li>🎯 Deep Focus - No interruptions</li>
                <li>💡 Light Focus - Gentle background</li>
                <li>☕ Break - Chat and recharge</li>
            </ul>
            
            <h3>Tips:</h3>
            <ul>
                <li>Use Pomodoro technique (25/5 cycles)</li>
                <li>Send support to others</li>
                <li>Take breaks seriously</li>
                <li>Stay hydrated</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // STATUS MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    changeStatus(status) {
        this.state.currentStatus = status;
        
        // Save last focus status
        if (status === 'deep-focus' || status === 'light-focus') {
            this.state.lastFocusStatus = status;
        }
        
        const statusDisplay = document.getElementById('currentStatus');
        if (statusDisplay) {
            statusDisplay.textContent = this.getStatusText();
        }
        
        // Update status buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'var(--surface)';
            btn.style.color = 'var(--text)';
        });
        
        const activeBtn = document.querySelector(`[onclick*="changeStatus('${status}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.style.background = 'var(--accent)';
            activeBtn.style.color = 'white';
        }
        
        // Stop timer when Break is selected
        if (status === 'break') {
            if (this.state.timerRunning) {
                this.pauseTimer();
            }
        }
        
        this.updateChatState();
    }
    
    getStatusText() {
        const statusMap = {
            'deep-focus': 'DEEP FOCUS',
            'light-focus': 'LIGHT FOCUS',
            'break': 'BREAK'
        };
        return statusMap[this.state.currentStatus] || 'FOCUS';
    }
    
    updateChatState() {
        const chatInput = document.getElementById(`${this.roomId}ChatInput`);
        const chatSend = document.querySelector(`#${this.roomId}Sidebar .chat-send`);
        const fab = document.getElementById(`${this.roomId}FabChat`);
        
        // Chat is enabled only during break AND when timer is not running
        const chatEnabled = this.state.currentStatus === 'break' && !this.state.timerRunning;
        
        if (chatInput) {
            chatInput.disabled = !chatEnabled;
            chatInput.placeholder = chatEnabled ? "Break chat..." : "Focus mode - chat during breaks";
        }
        if (chatSend) {
            chatSend.disabled = !chatEnabled;
        }
        if (fab) {
            fab.style.opacity = chatEnabled ? '1' : '0.5';
            fab.style.cursor = chatEnabled ? 'pointer' : 'not-allowed';
        }
        
        if (chatEnabled) {
            Core.showToast('Break time - chat enabled');
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SESSION MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    showSetupModal() {
        const modal = document.getElementById(`${this.roomId}SetupModal`);
        if (modal) modal.classList.add('active');
    }
    
    startSession() {
        const intentionInput = document.getElementById(`${this.roomId}IntentionInput`);
        const categorySelect = document.getElementById(`${this.roomId}CategorySelect`);
        const durationSelect = document.getElementById(`${this.roomId}DurationSelect`);
        
        if (intentionInput && intentionInput.value.trim()) {
            this.state.currentIntention = intentionInput.value.trim();
        }
        
        if (categorySelect) {
            this.state.currentCategory = categorySelect.value;
        }
        
        if (durationSelect) {
            const duration = parseInt(durationSelect.value);
            this.state.timeLeft = duration;
            this.state.initialTime = duration;
            this.updateTimerDisplay();
            this.updateTimerRing();
        }
        
        // Close modal
        const modal = document.getElementById(`${this.roomId}SetupModal`);
        if (modal) modal.classList.remove('active');
        
        this.state.showSetup = false;
        
        Core.navigateTo(`${this.roomId}View`);
        Core.showToast('🎯 Deep work session started');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // CHAT & ADDITIONAL FEATURES
    // ═══════════════════════════════════════════════════════════════════════
    
    toggleChat() {
        if (this.state.currentStatus !== 'break' || this.state.timerRunning) {
            Core.showToast('Chat available during breaks only');
            return;
        }
        
        const sidebar = document.getElementById(`${this.roomId}Sidebar`);
        const fab = document.getElementById(`${this.roomId}FabChat`);
        
        if (sidebar) {
            const isOpen = sidebar.style.width === '300px';
            sidebar.style.width = isOpen ? '0' : '300px';
            if (fab) fab.style.display = isOpen ? 'block' : 'none';
        }
    }
    
    sendChat() {
        if (this.state.currentStatus !== 'break' || this.state.timerRunning) {
            Core.showToast('Chat available during breaks only');
            return;
        }
        
        const input = document.getElementById(`${this.roomId}ChatInput`);
        if (!input || !input.value.trim()) return;
        
        input.value = '';
        Core.showToast('Message sent');
    }
    
    sendSupport(type) {
        const messages = {
            pulse: '💫 Sending focus energy',
            'got-this': '💪 You got this!',
            flow: '🌊 Riding the flow'
        };
        Core.showToast(messages[type] || 'Support sent');
    }
    
    toggleDimMode() {
        const view = document.getElementById(`${this.roomId}View`);
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        
        if (view) {
            view.classList.toggle('dimmed');
            const isDimmed = view.classList.contains('dimmed');
            if (btn) btn.textContent = isDimmed ? '☀️ Bright' : '🌙 Dim';
        }
    }
}

// Apply mixins
Object.assign(DeepWorkRoom.prototype, TimerMixin);
Object.assign(DeepWorkRoom.prototype, SoundSettingsMixin);

// Create and bind singleton instance
const deepworkInstance = (() => {
    const instance = new DeepWorkRoom();
    
    // Bind ALL methods to the instance
    let proto = Object.getPrototypeOf(instance);
    while (proto && proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).forEach(key => {
            if (key !== 'constructor' && typeof instance[key] === 'function') {
                instance[key] = instance[key].bind(instance);
            }
        });
        proto = Object.getPrototypeOf(proto);
    }
    
    return instance;
})();

window.DeepWorkRoom = deepworkInstance;
// CRITICAL: Create global variable for onclick handlers
if (typeof DeepWorkRoom === 'undefined') {
    DeepWorkRoom = deepworkInstance;
}
