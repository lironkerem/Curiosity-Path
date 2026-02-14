/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP WORK ROOM (FULLY RESTORED & OPTIMIZED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class DeepWorkRoom
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 * @version 3.1.0
 * 
 * Restored Features:
 * - Animated SVG timer ring with gradient
 * - Rich setup modal with grid layouts
 * - Category badge display
 * - Break-only chat sidebar
 * - Dim mode toggle
 * - Sound settings
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
        this.state.customDurationVisible = false;
        
        // Category data
        this.CATEGORIES = {
            work: { icon: '💼', label: 'WORK', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)', border: 'rgba(245, 158, 11, 0.3)' },
            study: { icon: '📚', label: 'STUDY', gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)', border: 'rgba(59, 130, 246, 0.3)' },
            creative: { icon: '🎨', label: 'CREATIVE', gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)', border: 'rgba(236, 72, 153, 0.3)' },
            reading: { icon: '📖', label: 'READING', gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)', border: 'rgba(34, 197, 94, 0.3)' },
            planning: { icon: '📋', label: 'PLANNING', gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)', border: 'rgba(139, 92, 246, 0.3)' },
            coding: { icon: '💻', label: 'CODING', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)', border: 'rgba(16, 185, 129, 0.3)' }
        };
        
        // Auto-bind methods
        this.bindMethods();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // METHOD BINDING
    // ═══════════════════════════════════════════════════════════════════════
    
    bindMethods() {
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        methods.forEach(method => {
            if (method !== 'constructor' && typeof this[method] === 'function') {
                this[method] = this[method].bind(this);
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onEnter() {
        // Show setup modal on first entry
        if (this.state.showSetup) {
            setTimeout(() => this.showSetupModal(), 300);
        }
        
        // Scroll to top
        setTimeout(() => {
            const mainContent = document.querySelector(`#${this.roomId}View .ps-main`);
            if (mainContent) mainContent.scrollTop = 0;
            window.scrollTo(0, 0);
        }, 100);
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
        const categoryData = this.CATEGORIES[this.state.currentCategory];
        
        return `
        ${this.buildSoundSettings()}
        <div class="ps-body">
            <main class="ps-main" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px;">
                
                <!-- Status Selector -->
                <div class="status-selector" style="display: flex; gap: 8px; margin-bottom: 30px;">
                    <button class="status-btn ${this.state.currentStatus === 'deep-focus' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('deep-focus')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'deep-focus' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'deep-focus' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        🎯 Deep
                    </button>
                    <button class="status-btn ${this.state.currentStatus === 'light-focus' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('light-focus')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'light-focus' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'light-focus' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        ✨ Light
                    </button>
                    <button class="status-btn ${this.state.currentStatus === 'break' ? 'active' : ''}" 
                            onclick="${this.getClassName()}.changeStatus('break')"
                            style="padding: 12px 24px; border: 2px solid var(--border); border-radius: var(--radius-md); background: ${this.state.currentStatus === 'break' ? 'var(--accent)' : 'var(--surface)'}; color: ${this.state.currentStatus === 'break' ? 'white' : 'var(--text)'}; cursor: pointer; font-weight: 600; transition: all 0.2s;">
                        ☕ Break
                    </button>
                </div>
                
                <!-- Intention Display -->
                <div style="text-align: center; max-width: 600px; margin-bottom: 30px; margin-top: 60px;">
                    ${this.state.currentIntention ? `
                    <div style="margin-bottom: 16px;">
                        <span id="categoryBadge" style="padding: 10px 20px; background: ${categoryData.gradient}; border: 2px solid ${categoryData.border}; border-radius: var(--radius-lg); font-size: 15px; font-weight: 700; letter-spacing: 0.05em;">
                            ${categoryData.icon} ${categoryData.label}
                        </span>
                    </div>
                    <div id="currentIntention" style="font-size: 28px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.4; opacity: 0.9;">
                        ${this.state.currentIntention}
                    </div>
                    ` : `
                    <div id="currentIntention" style="font-size: 28px; font-weight: 700; letter-spacing: 0.02em; line-height: 1.4; opacity: 0.9;">
                        Set your intention to begin
                    </div>
                    `}
                </div>

                <!-- Timer Container with SVG Ring -->
                <div style="position: relative; width: 400px; height: 400px; margin-bottom: 20px;">
                    <!-- Timer Ring SVG -->
                    <svg width="400" height="400" viewBox="0 0 400 400" style="transform: rotate(-90deg); position: absolute; top: 0; left: 0; z-index: 2;">
                        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="8"/>
                        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#deepWorkTimerGradient)" stroke-width="8" stroke-linecap="round" stroke-dasharray="1131" stroke-dashoffset="1131" id="${this.roomId}TimerRing"/>
                        <defs>
                            <linearGradient id="deepWorkTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#ef4444"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    <!-- Timer Display -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 3;">
                        <div id="${this.roomId}TimerDisplay" style="font-size: 84px; font-weight: 200; letter-spacing: 0.05em; margin-bottom: 8px;">
                            ${this.formatTime(this.state.timeLeft)}
                        </div>
                        <div id="currentStatus" style="font-size: 16px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.6;">
                            ${this.getStatusText()}
                        </div>
                    </div>
                </div>
                
                <!-- Timer Controls -->
                <div class="timer-controls" style="margin-bottom: 40px; display: flex; gap: 12px;">
                    <button class="t-btn" 
                            onclick="${this.getClassName()}.adjustTime(-5)"
                            style="padding: 12px 20px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); cursor: pointer; font-weight: 600;">
                        -5m
                    </button>
                    <button class="t-btn primary" 
                            onclick="${this.getClassName()}.toggleTimer()" 
                            id="${this.roomId}TimerBtn"
                            style="padding: 12px 32px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; cursor: pointer; font-weight: 600; font-size: 16px;">
                        ${this.state.timerRunning ? 'Pause' : 'Begin'}
                    </button>
                    <button class="t-btn" 
                            onclick="${this.getClassName()}.adjustTime(5)"
                            style="padding: 12px 20px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); cursor: pointer; font-weight: 600;">
                        +5m
                    </button>
                </div>
            </main>

            <!-- Chat Sidebar (Break Room) -->
            <aside class="ps-sidebar" id="${this.roomId}Sidebar" style="width: 0; overflow: hidden; transition: width 0.3s ease; background: var(--surface); border-left: 2px solid var(--border); position: relative;">
                <div style="width: 320px; padding: 20px; height: 100%; display: flex; flex-direction: column;">
                    <div class="chat-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="font-weight: 600; font-size: 16px;">Break Room Chat</span>
                        <button class="chat-close" 
                                onclick="${this.getClassName()}.toggleChat()"
                                style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted); line-height: 1;">
                            ×
                        </button>
                    </div>
                    <div class="chat-messages" 
                         id="${this.roomId}ChatMessages"
                         style="flex: 1; overflow-y: auto; padding: 12px; background: var(--background); border-radius: var(--radius-md); margin-bottom: 12px;">
                        <div style="text-align: center; color: var(--text-muted); font-size: 11px; margin: 20px 0; font-style: italic;">
                            Chat opens during breaks only.
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <div class="chat-hint" style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px; text-align: center;">
                            Light conversation during breaks
                        </div>
                        <div class="chat-wrap" style="display: flex; gap: 8px;">
                            <input type="text" 
                                   class="chat-input" 
                                   id="${this.roomId}ChatInput" 
                                   placeholder="Break chat..." 
                                   onkeypress="if(event.key==='Enter')${this.getClassName()}.sendChat()"
                                   ${this.state.currentStatus !== 'break' ? 'disabled' : ''}
                                   style="flex: 1; padding: 10px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background);">
                            <button class="chat-send" 
                                    onclick="${this.getClassName()}.sendChat()"
                                    ${this.state.currentStatus !== 'break' ? 'disabled' : ''}
                                    style="padding: 10px 16px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; cursor: pointer; font-size: 18px;">
                                ↑
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- Floating Chat Button -->
        <button class="fab-chat" 
                id="${this.roomId}FabChat"
                onclick="${this.getClassName()}.toggleChat()"
                style="position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: var(--accent); border: none; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100; transition: all 0.3s;">
            💬
        </button>`;
    }
    
    buildAdditionalModals() {
        return this.buildSetupModal();
    }
    
    buildSetupModal() {
        return `
        <div class="modal-overlay" id="${this.roomId}SetupModal">
            <div class="modal-card" style="max-width: 550px;">
                <button class="modal-close" onclick="${this.getClassName()}.closeSetupModal()">×</button>
                <div class="modal-content">
                    <h2 style="font-family: var(--serif); margin-top: 0; margin-bottom: 8px; text-align: center;">Start Deep Work Session</h2>
                    <p style="text-align: center; color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">Set your intention. Choose your time. Work in flow.</p>
                    
                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Your Intention</label>
                        <input type="text" 
                               id="${this.roomId}IntentionInput" 
                               placeholder="e.g., Finish proposal, Code feature..." 
                               style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Category</label>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="work" checked style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">💼 Work</span>
                            </label>
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="study" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">📚 Study</span>
                            </label>
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="creative" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">🎨 Creative</span>
                            </label>
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="reading" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">📖 Reading</span>
                            </label>
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="planning" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">📋 Planning</span>
                            </label>
                            <label class="category-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Category" value="coding" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s; font-size: 13px;">💻 Coding</span>
                            </label>
                        </div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Duration</label>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                            <label class="duration-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="30" checked onclick="${this.getClassName()}.toggleCustomDuration(false)" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s;">30 min</span>
                            </label>
                            <label class="duration-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="60" onclick="${this.getClassName()}.toggleCustomDuration(false)" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s;">60 min</span>
                            </label>
                            <label class="duration-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="90" onclick="${this.getClassName()}.toggleCustomDuration(false)" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s;">90 min</span>
                            </label>
                            <label class="duration-option" style="position: relative; cursor: pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="custom" onclick="${this.getClassName()}.toggleCustomDuration(true)" style="position: absolute; opacity: 0;">
                                <span style="display: block; padding: 12px; text-align: center; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); transition: all 0.2s;">Custom</span>
                            </label>
                        </div>
                        <div id="${this.roomId}CustomDuration" style="display: none; margin-top: 12px;">
                            <input type="number" 
                                   id="${this.roomId}CustomMinutes" 
                                   placeholder="Enter minutes (1-180)" 
                                   min="1" 
                                   max="180" 
                                   style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--surface); font-size: 14px;">
                        </div>
                    </div>

                    <button class="t-btn primary" 
                            onclick="${this.getClassName()}.confirmSetup()" 
                            style="width: 100%; padding: 14px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; cursor: pointer; font-weight: 600; font-size: 16px;">
                        Start Session
                    </button>
                </div>
            </div>
        </div>`;
    }
    
    getInstructions() {
        return `
            <p><strong>Digital Nomads Deep Work space.</strong></p>
            
            <h3>How It Works:</h3>
            <ul>
                <li>Set your intention and duration</li>
                <li>Choose your focus level (Deep, Light, or Break)</li>
                <li>Work alongside others in focused sprints</li>
                <li>Take mindful breaks and chat</li>
            </ul>
            
            <h3>Focus Levels:</h3>
            <ul>
                <li>🎯 <strong>Deep Focus</strong> - Maximum concentration, no interruptions</li>
                <li>✨ <strong>Light Focus</strong> - Gentle background work</li>
                <li>☕ <strong>Break</strong> - Recharge and connect with others</li>
            </ul>
            
            <h3>Tips:</h3>
            <ul>
                <li>Use Pomodoro technique: 25-50 min work, 5-15 min break</li>
                <li>Chat is only available during breaks</li>
                <li>Use Dim mode to reduce distractions</li>
                <li>Ambient sounds can enhance focus</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // DEEP WORK SPECIFIC METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    getStatusText() {
        const statusMap = {
            'deep-focus': 'DEEP FOCUS',
            'light-focus': 'LIGHT FOCUS',
            'break': 'BREAK TIME'
        };
        return statusMap[this.state.currentStatus] || 'DEEP FOCUS';
    }
    
    changeStatus(newStatus) {
        if (newStatus !== 'break') {
            this.state.lastFocusStatus = newStatus;
        }
        this.state.currentStatus = newStatus;
        
        // Update UI
        const statusDisplay = document.getElementById('currentStatus');
        if (statusDisplay) {
            statusDisplay.textContent = this.getStatusText();
        }
        
        // Update status buttons
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Handle chat availability
        const chatInput = document.getElementById(`${this.roomId}ChatInput`);
        const chatSend = document.querySelector('.chat-send');
        if (newStatus === 'break') {
            if (chatInput) chatInput.disabled = false;
            if (chatSend) chatSend.disabled = false;
        } else {
            if (chatInput) chatInput.disabled = true;
            if (chatSend) chatSend.disabled = true;
        }
        
        Core.showToast(`Switched to ${this.getStatusText()}`);
    }
    
    showSetupModal() {
        const modal = document.getElementById(`${this.roomId}SetupModal`);
        if (modal) modal.classList.add('active');
    }
    
    closeSetupModal() {
        const modal = document.getElementById(`${this.roomId}SetupModal`);
        if (modal) modal.classList.remove('active');
    }
    
    toggleCustomDuration(show) {
        const customDiv = document.getElementById(`${this.roomId}CustomDuration`);
        if (customDiv) {
            customDiv.style.display = show ? 'block' : 'none';
        }
        this.state.customDurationVisible = show;
    }
    
    confirmSetup() {
        const intentionInput = document.getElementById(`${this.roomId}IntentionInput`);
        const categoryInputs = document.querySelectorAll(`input[name="${this.roomId}Category"]`);
        const durationInputs = document.querySelectorAll(`input[name="${this.roomId}Duration"]`);
        
        // Get intention
        this.state.currentIntention = intentionInput.value.trim() || 'Focus session';
        
        // Get category
        categoryInputs.forEach(input => {
            if (input.checked) this.state.currentCategory = input.value;
        });
        
        // Get duration
        let duration = 30;
        durationInputs.forEach(input => {
            if (input.checked) {
                if (input.value === 'custom') {
                    const customInput = document.getElementById(`${this.roomId}CustomMinutes`);
                    duration = parseInt(customInput.value) || 30;
                } else {
                    duration = parseInt(input.value);
                }
            }
        });
        
        this.state.timeLeft = duration * 60;
        this.state.showSetup = false;
        
        this.closeSetupModal();
        Core.navigateTo(`${this.roomId}View`);
        
        // Update display
        setTimeout(() => {
            this.updateTimerDisplay();
            const intentionDiv = document.getElementById('currentIntention');
            const categoryBadge = document.getElementById('categoryBadge');
            if (intentionDiv) {
                intentionDiv.textContent = this.state.currentIntention;
            }
            if (categoryBadge) {
                const catData = this.CATEGORIES[this.state.currentCategory];
                categoryBadge.innerHTML = `${catData.icon} ${catData.label}`;
                categoryBadge.style.background = catData.gradient;
                categoryBadge.style.border = `2px solid ${catData.border}`;
            }
        }, 100);
        
        Core.showToast('Session started!');
    }
    
    toggleChat() {
        const sidebar = document.getElementById(`${this.roomId}Sidebar`);
        if (sidebar) {
            const isOpen = sidebar.style.width !== '0px' && sidebar.style.width !== '';
            sidebar.style.width = isOpen ? '0' : '320px';
        }
    }
    
    sendChat() {
        const input = document.getElementById(`${this.roomId}ChatInput`);
        if (!input || !input.value.trim() || this.state.currentStatus !== 'break') return;
        
        const messagesContainer = document.getElementById(`${this.roomId}ChatMessages`);
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
        const msgHTML = `
            <div style="margin-bottom: 12px; padding: 8px; background: var(--surface); border-radius: var(--radius-md);">
                <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">You · ${time}</div>
                <div style="font-size: 13px;">${input.value}</div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', msgHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        input.value = '';
    }
    
    toggleDimMode() {
        const body = document.body;
        body.classList.toggle('dim-mode');
        
        const btn = document.getElementById(`${this.roomId}DimModeBtn`);
        if (btn) {
            btn.textContent = body.classList.contains('dim-mode') ? '☀️ Bright' : '🌙 Dim';
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TIMER OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    updateTimerDisplay() {
        const timerDisplay = document.getElementById(`${this.roomId}TimerDisplay`);
        const timerRing = document.getElementById(`${this.roomId}TimerRing`);
        
        if (timerDisplay) {
            timerDisplay.textContent = this.formatTime(this.state.timeLeft);
        }
        
        if (timerRing) {
            const totalTime = this.state.timerDuration || 1800;
            const progress = (totalTime - this.state.timeLeft) / totalTime;
            const circumference = 1131; // 2 * π * 180
            const offset = circumference - (progress * circumference);
            timerRing.style.strokeDashoffset = offset;
        }
    }
}

// Apply mixins
Object.assign(DeepWorkRoom.prototype, TimerMixin);
Object.assign(DeepWorkRoom.prototype, SoundSettingsMixin);

// Export as singleton
window.DeepWorkRoom = new DeepWorkRoom();
