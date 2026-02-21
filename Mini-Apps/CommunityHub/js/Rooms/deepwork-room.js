/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEEP WORK ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class DeepWorkRoom
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 * @version 3.3.0 — PATCHED:
 *   - Optimistic message now uses same _buildBreakMsgHTML() as DB messages (consistent styling)
 *   - Current user avatar shown beside chat input (live from Core.state.currentUser)
 *   - _injectChatAvatar() called on enter so avatar always renders
 *   - leaveRoom / cleanup resets communityHubFullscreenContainer background to prevent dim bleed
 *   - devMode stays true (in development)
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

        this.initTimerState(1800);
        this.initSoundState();

        this.state.currentStatus          = 'deep-focus';
        this.state.lastFocusStatus        = 'deep-focus';
        this.state.currentIntention       = '';
        this.state.currentCategory        = 'work';
        this.state.showSetup              = true;
        this.state.customDurationVisible  = false;

        this.CATEGORIES = {
            work:     { icon: '💼', label: 'WORK',     gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(239,68,68,0.2) 100%)',   border: 'rgba(245,158,11,0.3)' },
            study:    { icon: '📚', label: 'STUDY',    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.2) 100%)',  border: 'rgba(59,130,246,0.3)' },
            creative: { icon: '🎨', label: 'CREATIVE', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.2) 100%)',  border: 'rgba(236,72,153,0.3)' },
            reading:  { icon: '📖', label: 'READING',  gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(59,130,246,0.2) 100%)',  border: 'rgba(34,197,94,0.3)' },
            planning: { icon: '📋', label: 'PLANNING', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)', border: 'rgba(139,92,246,0.3)' },
            coding:   { icon: '💻', label: 'CODING',   gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(59,130,246,0.2) 100%)', border: 'rgba(16,185,129,0.3)' }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    onEnter() {
        if (this.state.showSetup) {
            setTimeout(() => this.showSetupModal(), 300);
        }

        setTimeout(() => {
            const mainContent = document.querySelector(`#${this.roomId}View .ps-main`);
            if (mainContent) mainContent.scrollTop = 0;
            window.scrollTo(0, 0);
        }, 100);

        this._loadBreakChat();

        // Inject current user avatar beside chat input
        setTimeout(() => this._injectChatAvatar(), 400);
    }

    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();
        if (window.CommunityDB && CommunityDB.ready) {
            try { CommunityDB.unsubscribeFromRoomChat('deepwork'); } catch {}
        }

        // Reset dim mode background so it doesn't bleed to other rooms
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = 'transparent';
    }

    onTimerComplete() {
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
    // BREAK CHAT — SUPABASE
    // ═══════════════════════════════════════════════════════════════════════

    async _loadBreakChat() {
        const container = document.getElementById(`${this.roomId}ChatMessages`);
        if (!container) return;
        if (!window.CommunityDB || !CommunityDB.ready) return;

        try {
            const rows    = await CommunityDB.getRoomMessages('deepwork', 50);
            const blocked = await CommunityDB.getBlockedUsers();
            const visible = rows.filter(r => !blocked.has(r.profiles?.id));

            visible.forEach(row => {
                container.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(row));
            });
            container.scrollTop = container.scrollHeight;

            CommunityDB.subscribeToRoomChat('deepwork', async (newMsg) => {
                if (newMsg.profiles?.id === window.Core?.state?.currentUser?.id) return;
                const blocked = await CommunityDB.getBlockedUsers();
                if (blocked.has(newMsg.profiles?.id)) return;
                const c = document.getElementById(`${this.roomId}ChatMessages`);
                if (c) {
                    c.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(newMsg));
                    c.scrollTop = c.scrollHeight;
                }
            });
        } catch (error) {
            console.error('[DeepWorkRoom] _loadBreakChat error:', error);
        }
    }

    /**
     * Build a chat message HTML from a DB row or a local message object.
     * Handles both DB rows (row.profiles) and optimistic local messages.
     * @param {Object} row - DB row with optional profiles join, or local {message, created_at, _isOwn}
     */
    _buildBreakMsgHTML(row) {
        const profile   = row.profiles || {};
        const isOwn     = row._isOwn || (profile.id === window.Core?.state?.currentUser?.id);
        const name      = isOwn ? 'You' : (profile.name || 'Member');
        const avatarUrl = isOwn ? (window.Core?.state?.currentUser?.avatar_url || '') : (profile.avatar_url || '');
        const emoji     = isOwn ? (window.Core?.state?.currentUser?.emoji || '') : (profile.emoji || '');
        const initial   = emoji || name.charAt(0).toUpperCase();
        const gradient  = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(profile.id || name)
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        const time      = new Date(row.created_at || Date.now())
            .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const text      = this._escapeHtml(row.message || '');

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
            : `<span style="color:white;font-weight:600;font-size:11px;">${initial}</span>`;
        const avatarBg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        return `
            <div style="margin-bottom:12px;padding:8px;background:var(--surface);border-radius:var(--radius-md);">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <div style="width:24px;height:24px;border-radius:50%;${avatarBg}display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                        ${avatarInner}
                    </div>
                    <span style="font-size:11px;color:var(--text-muted);">${name} · ${time}</span>
                </div>
                <div style="font-size:13px;padding-left:32px;">${text}</div>
            </div>`;
    }

    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SENDER AVATAR — inject user avatar beside chat input
    // ═══════════════════════════════════════════════════════════════════════

    _injectChatAvatar() {
        const wrapper = document.getElementById(`${this.roomId}ChatAvatarWrapper`);
        if (!wrapper) return;

        const user = window.Core?.state?.currentUser;
        if (!user) return;

        const name      = user.name || 'Me';
        const avatarUrl = user.avatar_url || '';
        const emoji     = user.emoji || '';
        const initial   = emoji || name.charAt(0).toUpperCase();
        const gradient  = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(user.id || name)
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        const inner = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
            : `<span style="color:white;font-weight:600;font-size:11px;">${initial}</span>`;
        const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        wrapper.innerHTML = `
            <div style="width:28px;height:28px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                ${inner}
            </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SEND CHAT — optimistic render uses _buildBreakMsgHTML (unified)
    // ═══════════════════════════════════════════════════════════════════════

    async sendChat() {
        const input     = document.getElementById(`${this.roomId}ChatInput`);
        if (!input || !input.value.trim() || this.state.currentStatus !== 'break') return;

        const text      = input.value.trim();
        const container = document.getElementById(`${this.roomId}ChatMessages`);
        input.value     = '';

        // Optimistic render — uses same builder as DB rows for visual consistency
        const optimistic = {
            message:    text,
            created_at: new Date().toISOString(),
            _isOwn:     true,
            profiles:   { id: window.Core?.state?.currentUser?.id }
        };
        if (container) {
            container.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(optimistic));
            container.scrollTop = container.scrollHeight;
        }

        if (window.CommunityDB && CommunityDB.ready) {
            try {
                await CommunityDB.sendRoomMessage('deepwork', text);
            } catch (error) {
                console.error('[DeepWorkRoom] sendChat DB error:', error);
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI
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
                    ${['deep-focus','light-focus','break'].map(s => `
                    <button class="status-btn ${this.state.currentStatus === s ? 'active' : ''}"
                            onclick="${this.getClassName()}.changeStatus('${s}', event)"
                            style="padding:12px 24px;border:2px solid var(--border);border-radius:var(--radius-md);
                                   background:${this.state.currentStatus === s ? 'var(--accent)' : 'var(--surface)'};
                                   color:${this.state.currentStatus === s ? 'white' : 'var(--text)'};
                                   cursor:pointer;font-weight:600;transition:all 0.2s;">
                        ${{ 'deep-focus': '🎯 Deep', 'light-focus': '✨ Light', 'break': '☕ Break' }[s]}
                    </button>`).join('')}
                </div>

                <!-- Intention Display -->
                <div style="text-align: center; max-width: 600px; margin-bottom: 30px; margin-top: 60px;">
                    ${this.state.currentIntention ? `
                    <div style="margin-bottom: 16px;">
                        <span id="categoryBadge" style="padding:10px 20px;background:${categoryData.gradient};border:2px solid ${categoryData.border};border-radius:var(--radius-lg);font-size:15px;font-weight:700;letter-spacing:0.05em;">
                            ${categoryData.icon} ${categoryData.label}
                        </span>
                    </div>
                    <div id="currentIntention" style="font-size:28px;font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        ${this.state.currentIntention}
                    </div>` : `
                    <div id="currentIntention" style="font-size:28px;font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        Set your intention to begin
                    </div>`}
                </div>

                <!-- Timer -->
                <div style="position: relative; width: 400px; height: 400px; margin-bottom: 20px;">
                    <svg width="400" height="400" viewBox="0 0 400 400"
                         style="transform: rotate(-90deg); position: absolute; top: 0; left: 0; z-index: 2;">
                        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#deepWorkTimerGradient)"
                                stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="1131" stroke-dashoffset="1131"
                                id="${this.roomId}TimerRing"/>
                        <defs>
                            <linearGradient id="deepWorkTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%"   stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#ef4444"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); text-align: center; z-index: 3;">
                        <div id="${this.roomId}TimerDisplay" style="font-size:84px;font-weight:200;letter-spacing:0.05em;margin-bottom:8px;">
                            ${this.formatTime(this.state.timeLeft)}
                        </div>
                        <div id="currentStatus" style="font-size:16px;text-transform:uppercase;letter-spacing:0.2em;opacity:0.6;">
                            ${this.getStatusText()}
                        </div>
                    </div>
                </div>

                <!-- Timer Controls -->
                <div class="timer-controls" style="margin-bottom: 40px; display: flex; gap: 12px;">
                    <button class="t-btn" onclick="${this.getClassName()}.adjustTime(-5)"
                            style="padding:12px 20px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-weight:600;">
                        -5m
                    </button>
                    <button class="t-btn primary" onclick="${this.getClassName()}.toggleTimer()"
                            id="${this.roomId}TimerBtn"
                            style="padding:12px 32px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        ${this.state.timerRunning ? 'Pause' : 'Begin'}
                    </button>
                    <button class="t-btn" onclick="${this.getClassName()}.adjustTime(5)"
                            style="padding:12px 20px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-weight:600;">
                        +5m
                    </button>
                </div>
            </main>

            <!-- Chat Sidebar -->
            <aside class="ps-sidebar" id="${this.roomId}Sidebar"
                   style="width: 0; overflow: hidden; transition: width 0.3s ease; background: var(--surface); border-left: 2px solid var(--border);">
                <div style="width:320px;padding:20px;height:100%;display:flex;flex-direction:column;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <span style="font-weight:600;font-size:16px;">Break Room Chat</span>
                        <button onclick="${this.getClassName()}.toggleChat()"
                                style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--text-muted);line-height:1;">×</button>
                    </div>
                    <div class="chat-messages" id="${this.roomId}ChatMessages"
                         style="flex:1;overflow-y:auto;padding:12px;background:var(--background);border-radius:var(--radius-md);margin-bottom:12px;">
                        <div style="text-align:center;color:var(--text-muted);font-size:11px;margin:20px 0;font-style:italic;">
                            Chat opens during breaks only.
                        </div>
                    </div>
                    <div>
                        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-align:center;">
                            Light conversation during breaks
                        </div>
                        <!-- Input row with user avatar -->
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                            <div id="${this.roomId}ChatAvatarWrapper">
                                <div style="width:28px;height:28px;border-radius:50%;background:var(--border);flex-shrink:0;"></div>
                            </div>
                            <div style="flex:1;display:flex;gap:6px;">
                                <input type="text" id="${this.roomId}ChatInput"
                                       placeholder="Break chat..."
                                       onkeypress="if(event.key==='Enter')${this.getClassName()}.sendChat()"
                                       ${this.state.currentStatus !== 'break' ? 'disabled' : ''}
                                       style="flex:1;padding:10px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--background);">
                                <button onclick="${this.getClassName()}.sendChat()"
                                        ${this.state.currentStatus !== 'break' ? 'disabled' : ''}
                                        style="padding:10px 14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-size:18px;">↑</button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- Floating Chat Button -->
        <button id="${this.roomId}FabChat"
                onclick="${this.getClassName()}.toggleChat()"
                style="position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:var(--accent);border:none;color:white;font-size:24px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:100;transition:all 0.3s;">
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
                    <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:8px;text-align:center;">Start Deep Work Session</h2>
                    <p style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:24px;">Set your intention. Choose your time. Work in flow.</p>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Your Intention</label>
                        <input type="text" id="${this.roomId}IntentionInput"
                               placeholder="e.g., Finish proposal, Code feature..."
                               style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                    </div>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Category</label>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                            ${Object.entries(this.CATEGORIES).map(([val, cat], i) => `
                            <label style="position:relative;cursor:pointer;">
                                <input type="radio" name="${this.roomId}Category" value="${val}" ${i === 0 ? 'checked' : ''} style="position:absolute;opacity:0;">
                                <span style="display:block;padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:13px;">${cat.icon} ${cat.label.charAt(0) + cat.label.slice(1).toLowerCase()}</span>
                            </label>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Duration</label>
                        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                            ${[30, 60, 90].map((d, i) => `
                            <label style="position:relative;cursor:pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="${d}" ${i === 0 ? 'checked' : ''} onclick="${this.getClassName()}.toggleCustomDuration(false)" style="position:absolute;opacity:0;">
                                <span style="display:block;padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);">${d} min</span>
                            </label>`).join('')}
                            <label style="position:relative;cursor:pointer;">
                                <input type="radio" name="${this.roomId}Duration" value="custom" onclick="${this.getClassName()}.toggleCustomDuration(true)" style="position:absolute;opacity:0;">
                                <span style="display:block;padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);">Custom</span>
                            </label>
                        </div>
                        <div id="${this.roomId}CustomDuration" style="display:none;margin-top:12px;">
                            <input type="number" id="${this.roomId}CustomMinutes" placeholder="Enter minutes (1-180)"
                                   min="1" max="180"
                                   style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;">
                        </div>
                    </div>

                    <button onclick="${this.getClassName()}.confirmSetup()"
                            style="width:100%;padding:14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
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
                <li>🎯 <strong>Deep Focus</strong> — Maximum concentration, no interruptions</li>
                <li>✨ <strong>Light Focus</strong> — Gentle background work</li>
                <li>☕ <strong>Break</strong> — Recharge and connect with others</li>
            </ul>

            <h3>Tips:</h3>
            <ul>
                <li>Use Pomodoro technique: 25–50 min work, 5–15 min break</li>
                <li>Chat is only available during breaks</li>
                <li>Use Dim mode to reduce distractions</li>
                <li>Ambient sounds can enhance focus</li>
            </ul>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // DEEP WORK METHODS
    // ═══════════════════════════════════════════════════════════════════════

    getStatusText() {
        return { 'deep-focus': 'DEEP FOCUS', 'light-focus': 'LIGHT FOCUS', 'break': 'BREAK TIME' }[this.state.currentStatus] || 'DEEP FOCUS';
    }

    changeStatus(newStatus, event = null) {
        if (newStatus !== 'break') this.state.lastFocusStatus = newStatus;
        this.state.currentStatus = newStatus;

        const statusDisplay = document.getElementById('currentStatus');
        if (statusDisplay) statusDisplay.textContent = this.getStatusText();

        document.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
        if (event?.target) event.target.classList.add('active');

        const chatInput = document.getElementById(`${this.roomId}ChatInput`);
        const chatSend  = document.querySelector(`#${this.roomId}Sidebar .chat-send, #${this.roomId}Sidebar button[onclick*="sendChat"]`);
        const isBreak   = newStatus === 'break';
        if (chatInput) chatInput.disabled = !isBreak;
        if (chatSend)  chatSend.disabled  = !isBreak;

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
        const div = document.getElementById(`${this.roomId}CustomDuration`);
        if (div) div.style.display = show ? 'block' : 'none';
        this.state.customDurationVisible = show;
    }

    confirmSetup() {
        const intentionInput = document.getElementById(`${this.roomId}IntentionInput`);
        this.state.currentIntention = intentionInput?.value.trim() || 'Focus session';

        document.querySelectorAll(`input[name="${this.roomId}Category"]`).forEach(input => {
            if (input.checked) this.state.currentCategory = input.value;
        });

        let duration = 30;
        document.querySelectorAll(`input[name="${this.roomId}Duration"]`).forEach(input => {
            if (input.checked) {
                duration = input.value === 'custom'
                    ? (parseInt(document.getElementById(`${this.roomId}CustomMinutes`)?.value) || 30)
                    : parseInt(input.value);
            }
        });

        this.state.timeLeft  = duration * 60;
        this.state.showSetup = false;
        this.closeSetupModal();

        setTimeout(() => {
            this.updateTimerDisplay();
            const intentionDiv  = document.getElementById('currentIntention');
            const categoryBadge = document.getElementById('categoryBadge');
            if (intentionDiv)  intentionDiv.textContent = this.state.currentIntention;
            if (categoryBadge) {
                const cat = this.CATEGORIES[this.state.currentCategory];
                categoryBadge.innerHTML        = `${cat.icon} ${cat.label}`;
                categoryBadge.style.background = cat.gradient;
                categoryBadge.style.border     = `2px solid ${cat.border}`;
            }
        }, 100);

        Core.showToast('Session started!');
    }

    toggleChat() {
        const sidebar = document.getElementById(`${this.roomId}Sidebar`);
        if (sidebar) {
            const isOpen = sidebar.style.width !== '0px' && sidebar.style.width !== '' && sidebar.style.width !== '0';
            sidebar.style.width = isOpen ? '0' : '320px';
            if (!isOpen) this._injectChatAvatar();
        }
    }

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

    // ═══════════════════════════════════════════════════════════════════════
    // TIMER OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════

    updateTimerDisplay() {
        const timerDisplay = document.getElementById(`${this.roomId}TimerDisplay`);
        const timerRing    = document.getElementById(`${this.roomId}TimerRing`);
        if (timerDisplay) timerDisplay.textContent = this.formatTime(this.state.timeLeft);
        if (timerRing) {
            const totalTime    = this.state.timerDuration || 1800;
            const progress     = (totalTime - this.state.timeLeft) / totalTime;
            const circumference = 1131;
            timerRing.style.strokeDashoffset = circumference - (progress * circumference);
        }
    }
}

Object.assign(DeepWorkRoom.prototype, TimerMixin);
Object.assign(DeepWorkRoom.prototype, SoundSettingsMixin);

window.DeepWorkRoom = new DeepWorkRoom();
