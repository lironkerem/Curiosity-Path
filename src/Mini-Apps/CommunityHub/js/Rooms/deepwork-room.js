/*** DEEP WORK ROOM
 * @extends PracticeRoom
 * @mixes TimerMixin, SoundSettingsMixin
 */

import { PracticeRoom } from './PracticeRoom.js';
import { TimerMixin } from './mixins/TimerMixin.js';
import { SoundSettingsMixin } from './mixins/SoundSettingsMixin.js';
import { ChatMixin } from './mixins/ChatMixin.js';
import { CommunityDB } from '../community-supabase.js';

class DeepWorkRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'deepwork',
            roomType:    'always-open',
            name:        'Digital Nomads Deep Work',
            icon:        '🎯',
            description: 'Focus sessions with your community. Do hard things together. Set your intention. Start the timer. Get it done.',
            energy:      'Focused',
            imageUrl:    '/Community/Focus.webp',
            participants: 12,
        });

        this.devMode = true;

        this.initTimerState(1800);
        this.initSoundState();
        this.initChatState(['main']);

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
        }

        this.loadRoomChatFromDB('main');
        this._injectSenderAvatar('main');
        // Note: _refreshParticipantSidebar is already called by PracticeRoom.enterRoom()
        // — removed duplicate call here to avoid double DB fetch + dual subscription.

        requestAnimationFrame(() => {
            document.querySelector(`#${this.roomId}View .ps-main`)?.scrollTo(0, 0);
        });
    }

    onCleanup() {
        this.cleanupTimer();
        this.cleanupSound();
        if (CommunityDB?.ready) {
            try { CommunityDB.unsubscribeFromRoomChat('deepwork'); } catch {}
        }
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = 'transparent';
        document.getElementById('dynamicRoomContent')?.classList.remove('dimmed');
    }

    onTimerComplete() { this._switchToBreak(); }

    onOutsideClick(e) {
        const panel = document.getElementById(`${this.roomId}SoundSettings`);
        if (panel && !panel.contains(e.target) && !e.target.closest('[data-action="toggleSoundSettings"]')) {
            panel.classList.remove('visible');
        }
    }

    // ── Timer overrides ───────────────────────────────────────────────────────
    // Override only the DeepWork-specific behaviour; delegate core logic to mixin.

    pauseTimer() {
        this._clearInterval();
        this.state.timerRunning = false;
        this._setTimerBtn('paused');
        this._setTimerGlow('paused');
        this._switchToBreak();
    }

    // Override mixin label so 'running' state always shows 'Break' (not 'Pause')
    _setTimerBtn(state) {
        const btn = document.getElementById(`${this.roomId}TimerBtn`);
        if (!btn) return;
        const labels = { idle: 'Begin', running: 'Break', paused: 'Continue', done: 'Complete' };
        btn.textContent = labels[state] ?? state;
    }

    startTimer() {
        if (this.state.timerRunning) return;
        this.state.timerRunning = true;

        this._setTimerGlow('running');

        this._timerInterval = setInterval(() => {
            this.state.timeLeft--;
            this._updateTimer();
            if (this.state.timeLeft > 0 && this.state.timeLeft % 300 === 0) {
                if (this.state.fiveMinBellEnabled) this.play5MinBell?.();
            }
            if (this.state.timeLeft <= 0) this.completeTimer();
        }, 1000);

        // Visibility fix: suspend interval when tab hidden, reconcile on return.
        this._attachVisibilityHandler();

        this._restoreFocusStatus();
        window.Core.showToast('Timer started');
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

        // Drive collapsible chat panel
        this._setChatPanelOpen(isBreak);

        window.Core.showToast(isBreak ? 'Break time — chat unlocked!' : `${this.getStatusText()}`);
    }

    _setChatPanelOpen(open) {
        const panel   = document.getElementById(`${this.roomId}ChatPanelBody`);
        const header  = panel?.previousElementSibling;
        const chevron = document.getElementById(`${this.roomId}ChatChevron`);

        if (panel) {
            panel.style.maxHeight = open ? '600px' : '0px';
            panel.style.opacity   = open ? '1'     : '0';
        }
        if (header) header.style.opacity = open ? '1' : '0.35';
        if (chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(-90deg)';

        // Enable/disable input
        const chatInput = document.getElementById(`${this.roomId}MainInput`);
        const chatSend  = document.getElementById(`${this.roomId}MainSendBtn`);
        if (chatInput) {
            chatInput.disabled    = !open;
            chatInput.placeholder = open ? 'Share during your break...' : 'Pause timer to chat';
        }
        if (chatSend) chatSend.disabled = !open;
    }

    _toggleChatPanel() {
        // Only allow toggling when on break
        if (this.state.currentStatus !== 'break') return;
        const panel = document.getElementById(`${this.roomId}ChatPanelBody`);
        if (!panel) return;
        const isOpen = panel.style.maxHeight !== '0px';
        this._setChatPanelOpen(!isOpen);
    }

    getStatusText() {
        return { 'deep-focus': 'DEEP FOCUS', 'light-focus': 'LIGHT FOCUS', 'break': 'BREAK TIME' }[this.state.currentStatus] || 'DEEP FOCUS';
    }

    changeStatus(newStatus) {
        if (newStatus !== 'break') this.state.lastFocusStatus = newStatus;
        this._applyStatus(newStatus);
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

        // Update display — rAF ensures DOM is settled post-modal
        requestAnimationFrame(() => {
            this._updateTimer();
            this._setTimerBtn('idle');
            // Belt-and-suspenders: also update after a tick in case of CSS transition delay
            setTimeout(() => this._updateTimer(), 50);
        });

        const intentionDiv  = document.getElementById('currentIntention');
        const categoryBadge = document.getElementById('categoryBadge');
        if (intentionDiv) intentionDiv.textContent = this.state.currentIntention || 'Use this time to focus and get things done';
        if (categoryBadge) {
            const cat = this.CATEGORIES[this.state.currentCategory];
            categoryBadge.innerHTML        = `${cat.icon} ${cat.label}`;
            categoryBadge.style.background = cat.gradient;
            categoryBadge.style.border     = `2px solid ${cat.border}`;
        }

        window.Core.showToast('Session set - click Begin!');

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
        const view = document.getElementById('dynamicRoomContent');
        if (!view) return;
        view.classList.toggle('dimmed');
        const isDimmed = view.classList.contains('dimmed');
        document.getElementById(`${this.roomId}DimModeBtn`)?.textContent !== undefined &&
            (document.getElementById(`${this.roomId}DimModeBtn`).innerHTML = isDimmed ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright` : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim`);
        const container = document.getElementById('communityHubFullscreenContainer');
        if (container) container.style.background = isDimmed ? 'rgba(0,0,0,0.85)' : 'transparent';
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    getParticipantText() { return `${this.state.participants} working together`; }

    buildAdditionalHeaderButtons() {
        return `
            ${this.buildSoundButton()}
            <button type="button" class="ps-leave" data-action="toggleDimMode"
                    id="${this.roomId}DimModeBtn" style="margin:0;padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`;
    }

    buildBody() {
        const cat     = this.CATEGORIES[this.state.currentCategory];
        const isBreak = this.state.currentStatus === 'break';

        return `
        ${this.buildSoundSettings()}
        <div class="ps-body" style="display:flex;flex-direction:column;">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">

                <!-- Category pill (always shown, fallback "Focus") -->
                <div style="margin-bottom:16px;">
                    <span id="categoryBadge" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:${cat.gradient};border:2px solid ${cat.border};border-radius:var(--radius-full);font-size:14px;font-weight:700;letter-spacing:0.05em;">
                        ${cat.icon} ${this.state.currentCategory ? cat.label : 'Focus'}
                    </span>
                </div>

                <!-- Intention -->
                <div style="text-align:center;max-width:600px;margin-bottom:20px;">
                    <div id="currentIntention" style="font-size:clamp(1.1rem,4vw,1.75rem);font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        ${this.state.currentIntention || 'Use this time to focus and get things done'}
                    </div>
                </div>

                <!-- Timer ring -->
                ${this.buildTimerContainer({
                    gradientId:  'deepworkTimerGrad',
                    color1:      '#c1705a',
                    color2:      '#8b3a2a',
                    glowColor:   'rgba(193,112,90,0.7)',
                    subtitleHtml: `<div id="currentStatus" aria-live="polite" style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${this.getStatusText()}</div>`,
                })}

                <!-- Timer controls -->
                <div style="margin-bottom:24px;">
                ${this.buildTimerControls()}
                </div>

                <!-- Status buttons (below timer) -->
                <div style="display:flex;gap:8px;margin-top:20px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;">
                    ${['deep-focus','light-focus','break'].map(s => `
                    <button type="button" class="dw-status-btn" data-status="${s}"
                            data-action="changeStatus" data-status="${s}"
                            style="padding:10px 20px;border:2px solid ${this.state.currentStatus===s?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${this.state.currentStatus===s?'var(--accent)':'var(--surface)'};color:${this.state.currentStatus===s?'white':'var(--text)'};cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;">
                        ${{ 'deep-focus':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Deep Focus','light-focus':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Light Focus','break':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg> Break Time' }[s]}
                    </button>`).join('')}
                </div>
            </main>

            <!-- Chat below timer — collapsible -->
            <div style="padding:0 20px 20px;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;">
                    <!-- Header / toggle row -->
                    <div data-action="toggleChatPanel"
                         style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none;opacity:${isBreak ? '1' : '0.35'};">
                        <div style="display:flex;align-items:center;gap:8px;font-family:var(--serif);font-size:17px;font-weight:600;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:18px;height:18px;"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                            Break Room Chat
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            ${!isBreak ? '<span style="font-size:11px;opacity:0.6;font-style:italic;">☕ Opens on Break</span>' : ''}
                            <svg id="${this.roomId}ChatChevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;transition:transform 0.25s;transform:${isBreak ? 'rotate(0deg)' : 'rotate(-90deg)'};">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>
                    <!-- Collapsible body -->
                    <div id="${this.roomId}ChatPanelBody"
                         style="overflow:hidden;max-height:${isBreak ? '600px' : '0px'};transition:max-height 0.3s ease;opacity:${isBreak ? '1' : '0'};transition:max-height 0.3s ease,opacity 0.3s ease;">
                        <div style="padding:0 8px 24px;" class="tarot-daily-grid">
                            <div>
                                ${this.buildChatContainer('main', 'Share during your break...')}
                            </div>
                            ${this.buildParticipantSidebarHTML('Working Together', `${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`, 'auto')}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    buildHubModals() {
        return `
        <div class="modal-overlay" id="${this.roomId}SetupModal" style="z-index:200001;">
            <div class="modal-card" style="max-width:550px;max-height:90vh;overflow-y:auto;">
                <button type="button" class="modal-close" aria-label="Close setup modal" data-action="closeSetupModal">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:8px;text-align:center;">Start Deep Work Session</h2>
                    <p style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:24px;">Set your intention. Choose your time. Work in flow.</p>

                    <div style="margin-bottom:24px;">
                        <label for="${this.roomId}IntentionInput" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Your Intention</label>
                        <input type="text" id="${this.roomId}IntentionInput"
                               aria-label="Set your intention for this session"
                               placeholder="e.g., Finish proposal, Code feature..."
                               style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}CategoryLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Category</label>
                        <div id="${this.roomId}CategoryTiles" role="radiogroup" aria-labelledby="${this.roomId}CategoryLabel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                            ${Object.entries(this.CATEGORIES).map(([val, cat], i) => `
                            <button type="button" data-action="selectCategory" data-cat="${val}"
                                    style="padding:12px;text-align:center;border:2px solid ${i===0?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${i===0?'rgba(139,92,246,0.12)':'var(--surface)'};cursor:pointer;font-size:13px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${cat.icon} ${cat.label.charAt(0)+cat.label.slice(1).toLowerCase()}
                            </button>`).join('')}
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}DurationLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Duration</label>
                        <div id="${this.roomId}DurationTiles" role="radiogroup" aria-labelledby="${this.roomId}DurationLabel" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                            ${[25,50,90].map((d, i) => `
                            <button type="button" data-action="selectDuration" data-dur="${d}"
                                    style="padding:12px;text-align:center;border:2px solid ${i===0?'var(--accent)':'var(--border)'};border-radius:var(--radius-md);background:${i===0?'rgba(139,92,246,0.12)':'var(--surface)'};cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${d} min
                            </button>`).join('')}
                            <button type="button" data-action="selectDuration" data-dur="custom"
                                    style="padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                Custom
                            </button>
                        </div>
                        <div id="${this.roomId}CustomDurationDiv" style="display:none;margin-top:12px;">
                            <label for="${this.roomId}CustomMinutes" style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:4px;">Custom duration (minutes)</label>
                            <input type="number" id="${this.roomId}CustomMinutes"
                                   placeholder="Minutes (1–180)" min="1" max="180"
                                   style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                        </div>
                    </div>

                    <button type="button" data-action="confirmSetup"
                            style="width:100%;padding:14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Start Session
                    </button>
                </div>
            </div>
        </div>`;
    }

    // ── Action map ────────────────────────────────────────────────────────────

    getActions() {
        return {
            ...super.getActions(),
            toggleDimMode:   () => this.toggleDimMode(),
            toggleChatPanel: () => this._toggleChatPanel(),
            changeStatus:    e  => this.changeStatus(this._actionEl(e).dataset.status),
            closeSetupModal: () => this.closeSetupModal(),
            selectCategory:  e  => this.selectCategory(this._actionEl(e).dataset.cat),
            selectDuration:  e  => this.selectDuration(this._actionEl(e).dataset.dur),
            confirmSetup:    () => this.confirmSetup(),
        };
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
                <li>🎯 <strong>Deep Focus</strong> - Maximum concentration</li>
                <li>✨ <strong>Light Focus</strong> - Gentle background work</li>
                <li>☕ <strong>Break</strong> - Recharge and connect</li>
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
Object.assign(DeepWorkRoom.prototype, ChatMixin);

// Window bridge: preserved for inline onclick handlers
const deepWorkRoom = new DeepWorkRoom();
window.DeepWorkRoom = deepWorkRoom;
// Fix #7: signal CommunityHubEngine that this room's enterRoom function is ready.
window.dispatchRoomReady?.('deepwork');

export { DeepWorkRoom, deepWorkRoom };
