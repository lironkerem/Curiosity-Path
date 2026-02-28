/**
 * DEEP WORK ROOM
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 */

class DeepWorkRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'deepwork',
            roomType:    'always-open',
            name:        'Digital Nomads Deep Work',
            icon:        '🎯',
            description: 'Focused work sessions. Pomodoro together.',
            energy:      'Focused',
            imageUrl:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Focus.png',
            participants: 12,
        });

        this.devMode = true;

        this.initTimerState(1800);
        this.initSoundState();

        this.state.currentStatus    = 'deep-focus';
        this.state.lastFocusStatus  = 'deep-focus';
        this.state.currentIntention = '';
        this.state.currentCategory  = 'work';
        this.state.selectedDuration = 25;
        this.state.showSetup        = true;

        this.CATEGORIES = {
            work:     { icon: '💼', label: 'WORK',     gradient: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2))',   border: 'rgba(245,158,11,0.3)' },
            study:    { icon: '📚', label: 'STUDY',    gradient: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,51,234,0.2))',  border: 'rgba(59,130,246,0.3)' },
            creative: { icon: '🎨', label: 'CREATIVE', gradient: 'linear-gradient(135deg,rgba(236,72,153,0.2),rgba(168,85,247,0.2))',  border: 'rgba(236,72,153,0.3)' },
            reading:  { icon: '📖', label: 'READING',  gradient: 'linear-gradient(135deg,rgba(34,197,94,0.2),rgba(59,130,246,0.2))',   border: 'rgba(34,197,94,0.3)' },
            planning: { icon: '📋', label: 'PLANNING', gradient: 'linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2))',  border: 'rgba(139,92,246,0.3)' },
            coding:   { icon: '💻', label: 'CODING',   gradient: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2))',  border: 'rgba(16,185,129,0.3)' },
        };
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        if (this.state.showSetup) {
            setTimeout(() => this.showSetupModal(), 300);
        } else {
            setTimeout(() => this.showInstructions(), 300);
        }

        this._loadBreakChat();
        this._injectChatAvatar();
        this._refreshParticipantSidebar(`${this.roomId}ParticipantsList`, `${this.roomId}SidebarCount`);

        requestAnimationFrame(() => {
            document.querySelector(`#${this.roomId}View .ps-main`)?.scrollTo(0, 0);
        });
    }

    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();
        if (window.CommunityDB?.ready) {
            try { CommunityDB.unsubscribeFromRoomChat('deepwork'); } catch {}
        }
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = 'transparent';
        document.getElementById('practiceRoomView')?.classList.remove('dimmed');
    }

    onTimerComplete() { this._switchToBreak(); }

    onOutsideClick(e) {
        const panel = document.getElementById(`${this.roomId}SoundSettings`);
        if (panel && !panel.contains(e.target) && !e.target.closest('[onclick*="toggleSoundSettings"]')) {
            panel.classList.remove('visible');
        }
    }

    // ── Timer overrides ───────────────────────────────────────────────────────
    // Override only the DeepWork-specific behaviour; delegate core logic to mixin.

    pauseTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this._setTimerBtn('paused'); // shows 'Continue' via _BTN_LABEL
        this._switchToBreak();
    }

    startTimer() {
        if (this.state.timerRunning) return;
        this.state.timerRunning = true;

        // Override btn label to 'Break' instead of mixin's 'Pause'
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (btn) btn.textContent = 'Break';

        this._timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this._updateTimer();
            if (this.state.timeLeft > 0 && this.state.timeLeft % 300 === 0) {
                if (this.state.fiveMinBellEnabled) this.play5MinBell?.();
            }
            if (this.state.timeLeft <= 0) this.completeTimer();
        }, 1000);

        this._restoreFocusStatus();
        Core.showToast('Timer started');
    }

    // ── Status management ─────────────────────────────────────────────────────

    _switchToBreak() {
        if (this.state.currentStatus !== 'break') {
            this.state.lastFocusStatus = this.state.currentStatus;
        }
        this._applyStatus('break');
    }

    _restoreFocusStatus() {
        this._applyStatus(this.state.lastFocusStatus || 'deep-focus');
    }

    _applyStatus(newStatus) {
        this.state.currentStatus = newStatus;
        const isBreak = newStatus === 'break';

        const statusDisplay = document.getElementById('currentStatus');
        if (statusDisplay) statusDisplay.textContent = this.getStatusText();

        document.querySelectorAll('.dw-status-btn').forEach(btn => {
            const active = btn.dataset.status === newStatus;
            btn.style.background = active ? 'var(--accent)' : 'var(--surface)';
            btn.style.color      = active ? 'white'         : 'var(--text)';
            btn.style.border     = `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`;
        });

        const chatInput = document.getElementById(`${this.roomId}ChatInput`);
        const chatSend  = document.getElementById(`${this.roomId}ChatSendBtn`);
        if (chatInput) {
            chatInput.disabled    = !isBreak;
            chatInput.placeholder = isBreak ? 'Break chat...' : 'Pause timer to chat';
        }
        if (chatSend) chatSend.disabled = !isBreak;

        const chatSection = document.getElementById(`${this.roomId}ChatSection`);
        if (chatSection) chatSection.style.display = isBreak ? 'flex' : 'none';
        if (isBreak) this._injectChatAvatar();

        Core.showToast(isBreak ? '☕ Break time — chat unlocked!' : `🎯 ${this.getStatusText()}`);
    }

    getStatusText() {
        return { 'deep-focus': 'DEEP FOCUS', 'light-focus': 'LIGHT FOCUS', 'break': 'BREAK TIME' }[this.state.currentStatus] || 'DEEP FOCUS';
    }

    changeStatus(newStatus) {
        if (newStatus !== 'break') this.state.lastFocusStatus = newStatus;
        this._applyStatus(newStatus);
    }

    // ── Break chat ────────────────────────────────────────────────────────────

    async _loadBreakChat() {
        const container = document.getElementById(`${this.roomId}ChatMessages`);
        if (!container || !window.CommunityDB?.ready) return;
        try {
            const [rows, blocked] = await Promise.all([
                CommunityDB.getRoomMessages('deepwork', 50),
                CommunityDB.getBlockedUsers(),
            ]);
            rows.filter(r => !blocked.has(r.profiles?.id))
                .forEach(row => container.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(row)));
            container.scrollTop = container.scrollHeight;

            CommunityDB.subscribeToRoomChat('deepwork', async (newMsg) => {
                if (newMsg.profiles?.id === window.Core?.state?.currentUser?.id) return;
                const bl = await CommunityDB.getBlockedUsers();
                if (bl.has(newMsg.profiles?.id)) return;
                const c = document.getElementById(`${this.roomId}ChatMessages`);
                if (c) { c.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(newMsg)); c.scrollTop = c.scrollHeight; }
            });
        } catch (e) {
            console.error('[DeepWorkRoom] _loadBreakChat error:', e);
        }
    }

    async sendChat() {
        const input = document.getElementById(`${this.roomId}ChatInput`);
        if (!input?.value.trim() || this.state.currentStatus !== 'break') return;
        const text = input.value.trim();
        input.value = '';
        const container  = document.getElementById(`${this.roomId}ChatMessages`);
        const optimistic = { message: text, created_at: new Date().toISOString(), _isOwn: true, profiles: { id: window.Core?.state?.currentUser?.id } };
        if (container) { container.insertAdjacentHTML('beforeend', this._buildBreakMsgHTML(optimistic)); container.scrollTop = container.scrollHeight; }
        if (window.CommunityDB?.ready) {
            try { await CommunityDB.sendRoomMessage('deepwork', text); }
            catch (e) { console.error('[DeepWorkRoom] sendChat error:', e); }
        }
    }

    // ── Avatar helpers ────────────────────────────────────────────────────────

    /**
     * Build avatar HTML for a given user object + size.
     * Shared by _buildBreakMsgHTML and _injectChatAvatar.
     */
    _buildAvatarHTML(name, avatarUrl, emoji, userId, size = 24) {
        const initial  = emoji || name.charAt(0).toUpperCase();
        const gradient = window.Core?.getAvatarGradient ? Core.getAvatarGradient(userId || name) : 'linear-gradient(135deg,#667eea,#764ba2)';
        const inner    = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
            : `<span style="color:white;font-weight:600;font-size:${Math.round(size*0.45)}px;">${initial}</span>`;
        const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
        return `<div style="width:${size}px;height:${size}px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">${inner}</div>`;
    }

    _buildBreakMsgHTML(row) {
        const profile   = row.profiles || {};
        const isOwn     = row._isOwn || (profile.id === window.Core?.state?.currentUser?.id);
        const name      = isOwn ? (window.Core?.state?.currentUser?.name || 'You') : (profile.name || 'Member');
        const avatarUrl = isOwn ? (window.Core?.state?.currentUser?.avatar_url || '') : (profile.avatar_url || '');
        const emoji     = isOwn ? (window.Core?.state?.currentUser?.emoji || '') : (profile.emoji || '');
        const userId    = profile.id || null;
        const clickable = userId && !isOwn;
        const time      = new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const text      = this._escapeHtml(row.message || '');
        const nameEl    = clickable
            ? `<span style="cursor:pointer;" onclick="openMemberProfileAboveRoom('${userId}')">${name}</span>`
            : `<span>${name}</span>`;
        const avatar    = this._buildAvatarHTML(name, avatarUrl, emoji, userId, 24);
        const clickAttr = clickable ? `onclick="openMemberProfileAboveRoom('${userId}')" style="cursor:pointer;"` : '';

        return `
        <div style="margin-bottom:12px;padding:8px;background:var(--surface);border-radius:var(--radius-md);">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <div ${clickAttr}>${avatar}</div>
                <span style="font-size:11px;color:var(--text-muted);">${nameEl} · ${time}</span>
            </div>
            <div style="font-size:13px;padding-left:32px;">${text}</div>
        </div>`;
    }

    _injectChatAvatar() {
        const wrapper = document.getElementById(`${this.roomId}ChatAvatarWrapper`);
        const user    = window.Core?.state?.currentUser;
        if (!wrapper || !user) return;
        wrapper.innerHTML = this._buildAvatarHTML(user.name || 'Me', user.avatar_url || '', user.emoji || '', user.id, 28);
    }

    _escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Setup modal ───────────────────────────────────────────────────────────

    showSetupModal()  { document.getElementById(`${this.roomId}SetupModal`)?.classList.add('active'); }
    closeSetupModal() { document.getElementById(`${this.roomId}SetupModal`)?.classList.remove('active'); }

    confirmSetup() {
        const intentionInput = document.getElementById(`${this.roomId}IntentionInput`);
        this.state.currentIntention = intentionInput?.value.trim() || 'Focus session';

        const dur      = this.state.selectedDuration;
        const raw      = dur === 'custom' ? parseInt(document.getElementById(`${this.roomId}CustomMinutes`)?.value) : parseInt(dur);
        const duration = Math.max(1, Math.min(180, raw || 25));
        const secs     = duration * 60;

        this.state.timeLeft    = secs;
        this.state.initialTime = secs;
        this.state.showSetup   = false;
        this.closeSetupModal();

        this._updateTimer();

        const intentionDiv  = document.getElementById('currentIntention');
        const categoryBadge = document.getElementById('categoryBadge');
        if (intentionDiv) intentionDiv.textContent = this.state.currentIntention;
        if (categoryBadge) {
            const cat = this.CATEGORIES[this.state.currentCategory];
            if (cat) {
                categoryBadge.innerHTML        = `${cat.icon} ${cat.label}`;
                categoryBadge.style.background = cat.gradient;
                categoryBadge.style.border     = `2px solid ${cat.border}`;
                categoryBadge.style.display    = 'inline-block';
            }
        }

        Core.showToast('✨ Session set — click Begin!');
        setTimeout(() => this.showInstructions(), 200);
    }

    // ── Tile selection ────────────────────────────────────────────────────────

    _selectTile(containerId, attrName, value) {
        document.querySelectorAll(`#${containerId} [${attrName}]`).forEach(el => {
            const active = String(el.getAttribute(attrName)) === String(value);
            el.style.border     = `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`;
            el.style.background = active ? 'rgba(139,92,246,0.12)' : 'var(--surface)';
        });
    }

    selectCategory(value) {
        this.state.currentCategory = value;
        this._selectTile(`${this.roomId}CategoryTiles`, 'data-cat', value);
    }

    selectDuration(value) {
        this.state.selectedDuration = value;
        this._selectTile(`${this.roomId}DurationTiles`, 'data-dur', value);
        const customDiv = document.getElementById(`${this.roomId}CustomDurationDiv`);
        if (customDiv) customDiv.style.display = value === 'custom' ? 'block' : 'none';
    }

    // ── Dim mode ──────────────────────────────────────────────────────────────

    toggleDimMode() {
        const view = document.getElementById('practiceRoomView');
        if (!view) return;
        view.classList.toggle('dimmed');
        const isDimmed = view.classList.contains('dimmed');
        document.getElementById(`${this.roomId}DimModeBtn`)?.textContent !== undefined &&
            (document.getElementById(`${this.roomId}DimModeBtn`).textContent = isDimmed ? '☀️ Bright' : '🌙 Dim');
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = isDimmed ? 'rgba(0,0,0,0.85)' : 'transparent';
    }

    // ── Chat toggle (mobile FAB) ───────────────────────────────────────────────

    toggleChat() {
        const sidebar = document.getElementById(`${this.roomId}Sidebar`);
        const section = document.getElementById(`${this.roomId}ChatSection`);
        if (!section) return;

        const isVisible = section.style.display !== 'none';
        if (isVisible) {
            section.style.display = 'none';
            if (sidebar && window.innerWidth <= 767) sidebar.style.display = 'none';
        } else {
            if (sidebar) {
                if (window.innerWidth <= 767) {
                    sidebar.style.cssText = `display:block !important;position:fixed;bottom:100px;right:16px;width:min(340px,calc(100vw - 32px));max-height:60vh;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);box-shadow:0 8px 32px rgba(0,0,0,0.3);z-index:199999;overflow:hidden;`;
                } else {
                    sidebar.style.removeProperty('display');
                }
            }
            section.style.display       = 'flex';
            section.style.flexDirection = 'column';
            this._injectChatAvatar();
        }
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    getParticipantText() { return `${this.state.participants} working together`; }

    buildAdditionalHeaderButtons() {
        return `
            ${this.buildSoundButton()}
            <button class="ps-leave" onclick="${this.getClassName()}.toggleDimMode()"
                    id="${this.roomId}DimModeBtn" style="margin:0;padding:10px 16px;white-space:nowrap;">
                🌙 Dim
            </button>`;
    }

    buildBody() {
        const cat     = this.CATEGORIES[this.state.currentCategory];
        const isBreak = this.state.currentStatus === 'break';
        const cn      = this.getClassName();
        const C       = +(2 * Math.PI * 180).toFixed(2); // circumference

        return `
        ${this.buildSoundSettings()}
        <div class="ps-body" style="display:flex;">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">

                <!-- Status buttons -->
                <div style="display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;justify-content:center;">
                    ${['deep-focus','light-focus','break'].map(s => `
                    <button class="dw-status-btn" data-status="${s}"
                            onclick="${cn}.changeStatus('${s}')"
                            style="padding:12px 24px;border:2px solid ${this.state.currentStatus===s?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${this.state.currentStatus===s?'var(--accent)':'var(--surface)'};color:${this.state.currentStatus===s?'white':'var(--text)'};cursor:pointer;font-weight:600;transition:all 0.2s;">
                        ${{ 'deep-focus':'🎯 Deep','light-focus':'✨ Light','break':'☕ Break' }[s]}
                    </button>`).join('')}
                </div>

                <!-- Intention -->
                <div style="text-align:center;max-width:600px;margin-bottom:20px;margin-top:16px;">
                    ${this.state.currentIntention ? `
                    <div style="margin-bottom:16px;">
                        <span id="categoryBadge" style="padding:10px 20px;background:${cat.gradient};border:2px solid ${cat.border};border-radius:var(--radius-lg);font-size:15px;font-weight:700;letter-spacing:0.05em;">
                            ${cat.icon} ${cat.label}
                        </span>
                    </div>` : ''}
                    <div id="currentIntention" style="font-size:clamp(1.1rem,4vw,1.75rem);font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        ${this.state.currentIntention || 'Set your intention to begin'}
                    </div>
                </div>

                <!-- Timer ring -->
                <div style="position:relative;width:min(400px,85vw);height:min(400px,85vw);margin-bottom:20px;">
                    <svg width="100%" height="100%" viewBox="0 0 400 400"
                         style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:2;">
                        <defs>
                            <linearGradient id="dwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%"   stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#ef4444"/>
                            </linearGradient>
                        </defs>
                        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                        <circle cx="200" cy="200" r="180" fill="none" stroke="url(#dwGrad)"
                                stroke-width="8" stroke-linecap="round"
                                stroke-dasharray="${C}" stroke-dashoffset="0"
                                id="${this.roomId}TimerRing"/>
                    </svg>
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:3;">
                        <div id="${this.roomId}TimerDisplay" style="font-size:clamp(2.5rem,14vw,5.25rem);font-weight:200;letter-spacing:0.05em;margin-bottom:8px;">
                            ${this.formatTime(this.state.timeLeft)}
                        </div>
                        <div id="currentStatus" style="font-size:16px;text-transform:uppercase;letter-spacing:0.2em;opacity:0.6;">
                            ${this.getStatusText()}
                        </div>
                    </div>
                </div>

                <!-- Timer controls -->
                <div style="margin-bottom:40px;display:flex;gap:12px;">
                    <button onclick="${cn}.adjustTime(-5)" style="padding:12px 20px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-weight:600;">-5m</button>
                    <button onclick="${cn}.toggleTimer()" id="${this.roomId}TimerBtn"
                            style="padding:12px 32px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        ${this.state.timerRunning ? 'Break' : 'Begin'}
                    </button>
                    <button onclick="${cn}.adjustTime(5)" style="padding:12px 20px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-weight:600;">+5m</button>
                </div>
            </main>

            <!-- Sidebar -->
            <aside id="${this.roomId}Sidebar" class="dw-sidebar"
                   style="background:var(--surface);border-left:2px solid var(--border);overflow:hidden;">
                <div style="padding:20px;height:100%;display:flex;flex-direction:column;min-height:0;box-sizing:border-box;">
                    <div style="flex-shrink:0;margin-bottom:16px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <span style="font-weight:600;font-size:15px;">Active Members</span>
                            <span id="${this.roomId}SidebarCount" style="font-size:11px;color:var(--text-muted);">Loading...</span>
                        </div>
                        <div id="${this.roomId}ParticipantsList" class="campfire-participants" style="max-height:180px;overflow-y:auto;">
                            <div style="color:var(--text-muted);font-size:13px;padding:8px;">Loading...</div>
                        </div>
                    </div>
                    <div style="height:1px;background:var(--border);flex-shrink:0;margin-bottom:16px;"></div>
                    <div id="${this.roomId}ChatSection"
                         style="display:${isBreak?'flex':'none'};flex-direction:column;flex:1;min-height:0;">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-shrink:0;">
                            <span style="font-weight:600;font-size:15px;">Break Room Chat</span>
                        </div>
                        <div id="${this.roomId}ChatMessages"
                             style="flex:1;overflow-y:auto;padding:12px;background:var(--background);border-radius:var(--radius-md);margin-bottom:12px;min-height:0;">
                            <div style="text-align:center;color:var(--text-muted);font-size:11px;margin:20px 0;font-style:italic;">Say hello 👋</div>
                        </div>
                        <div style="flex-shrink:0;">
                            <div style="display:flex;align-items:center;gap:6px;">
                                <div id="${this.roomId}ChatAvatarWrapper" style="flex-shrink:0;">
                                    <div style="width:28px;height:28px;border-radius:50%;background:var(--border);"></div>
                                </div>
                                <input type="text" id="${this.roomId}ChatInput"
                                       placeholder="Break chat..."
                                       onkeypress="if(event.key==='Enter')${cn}.sendChat()"
                                       style="flex:1;min-width:0;padding:10px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--background);">
                                <button id="${this.roomId}ChatSendBtn" onclick="${cn}.sendChat()"
                                        style="flex-shrink:0;padding:10px 12px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-size:18px;">↑</button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        <!-- FAB — z-index above fullscreen container -->
        <button onclick="${cn}.toggleChat()"
                style="position:fixed;bottom:30px;right:30px;width:60px;height:60px;border-radius:50%;background:var(--accent);border:none;color:white;font-size:24px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.3);z-index:200000;transition:all 0.3s;">
            💬
        </button>`;
    }

    buildHubModals() {
        const cn = this.getClassName();
        return `
        <div class="modal-overlay" id="${this.roomId}SetupModal" style="z-index:200001;">
            <div class="modal-card" style="max-width:550px;max-height:90vh;overflow-y:auto;">
                <button class="modal-close" onclick="${cn}.closeSetupModal()">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:8px;text-align:center;">Start Deep Work Session</h2>
                    <p style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:24px;">Set your intention. Choose your time. Work in flow.</p>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Your Intention</label>
                        <input type="text" id="${this.roomId}IntentionInput"
                               placeholder="e.g., Finish proposal, Code feature..."
                               style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                    </div>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Category</label>
                        <div id="${this.roomId}CategoryTiles" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                            ${Object.entries(this.CATEGORIES).map(([val, cat], i) => `
                            <div onclick="${cn}.selectCategory('${val}')" data-cat="${val}"
                                 style="padding:12px;text-align:center;border:2px solid ${i===0?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${i===0?'rgba(139,92,246,0.12)':'var(--surface)'};cursor:pointer;font-size:13px;font-weight:600;transition:all 0.15s;user-select:none;">
                                ${cat.icon} ${cat.label.charAt(0)+cat.label.slice(1).toLowerCase()}
                            </div>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Duration</label>
                        <div id="${this.roomId}DurationTiles" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                            ${[25,50,90].map((d, i) => `
                            <div onclick="${cn}.selectDuration(${d})" data-dur="${d}"
                                 style="padding:12px;text-align:center;border:2px solid ${i===0?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${i===0?'rgba(139,92,246,0.12)':'var(--surface)'};cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;">
                                ${d} min
                            </div>`).join('')}
                            <div onclick="${cn}.selectDuration('custom')" data-dur="custom"
                                 style="padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;">
                                Custom
                            </div>
                        </div>
                        <div id="${this.roomId}CustomDurationDiv" style="display:none;margin-top:12px;">
                            <input type="number" id="${this.roomId}CustomMinutes"
                                   placeholder="Minutes (1–180)" min="1" max="180"
                                   style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                        </div>
                    </div>

                    <button onclick="${cn}.confirmSetup()"
                            style="width:100%;padding:14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        ✨ Start Session
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
                <li>Set your intention and duration, then click Begin</li>
                <li>Pause → automatically switches to Break (chat unlocks)</li>
                <li>Continue → restores your previous focus mode</li>
                <li>Or switch modes manually using the status buttons</li>
            </ul>
            <h3>Focus Levels:</h3>
            <ul>
                <li>🎯 <strong>Deep Focus</strong> — Maximum concentration</li>
                <li>✨ <strong>Light Focus</strong> — Gentle background work</li>
                <li>☕ <strong>Break</strong> — Recharge and connect</li>
            </ul>
            <h3>Tips:</h3>
            <ul>
                <li>Pomodoro: 25–50 min work, 5–15 min break</li>
                <li>Chat only available during Break mode</li>
                <li>Use 🌙 Dim to reduce distractions</li>
            </ul>`;
    }
}

Object.assign(DeepWorkRoom.prototype, TimerMixin);
Object.assign(DeepWorkRoom.prototype, SoundSettingsMixin);

window.DeepWorkRoom = new DeepWorkRoom();
