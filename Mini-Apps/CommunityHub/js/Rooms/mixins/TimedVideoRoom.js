/**
 * TIMED VIDEO ROOM - Shared base class
 * Extends PracticeRoom with YouTubePlayerMixin + CycleStateMixin behaviour
 * for rooms that follow the timed open-window + rotating video session pattern.
 *
 * Subclasses must provide:
 *   - super({ ...PracticeRoom config, cycleDuration, openDuration, sessionDuration })
 *   - this.sessions = [ { title, duration, category?, videoId, emoji }, ... ]
 *   - this.scheduleModalTitle  (string shown in modal <h2>)
 *   - getInstructions()        (HTML string)
 *
 * Subclasses may override:
 *   - buildBody()              (defaults to heading + player + controls)
 */

import { YouTubePlayerMixin } from './YouTubePlayerMixin.js';
import { CycleStateMixin } from './CycleStateMixin.js';
import { PracticeRoom } from '../PracticeRoom.js';

class TimedVideoRoom extends PracticeRoom {
    constructor(config) {
        super(config);
        this.initPlayerState();
        this.initCycleState();

        this.sessions             = [];
        this.scheduleModalTitle   = '📅 Upcoming Sessions';
        this.state.currentSession = null;
        this.state.nextSession    = null;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onInit()    { this.initializeCycle(); }
    onEnter()   { this.loadYouTubeAPI(); }
    onCleanup() { this.cleanupPlayer(); this.cleanupCycle(); }

    // ── Cycle / session ───────────────────────────────────────────────────────

    setSessions(now) {
        const idx = Math.floor(now / (this.config.cycleDuration * 1000)) % this.sessions.length;
        this.state.currentSession = this.sessions[idx];
        this.state.nextSession    = this.sessions[(idx + 1) % this.sessions.length];
    }

    getCurrentSession() { return this.state.currentSession; }
    getNextSession()    { return this.state.nextSession; }

    // ── UI ────────────────────────────────────────────────────────────────────

    buildBody() {
        const session = this.getCurrentSession();
        return `
        <div class="ps-body">
            <main class="ps-main">
                <h2 style="text-align:center;margin:20px 0;font-size:24px;font-weight:600;color:var(--text);"
                    id="${this.roomId}SessionHeading" aria-live="polite">
                    Current Session - ${session?.title || 'Loading…'}
                </h2>
                ${this.buildPlayerContainer()}
                ${this.buildPlayerControls()}
            </main>
        </div>`;
    }

    buildHubModals() { return this._buildScheduleModalShell(); }

    _buildScheduleModalShell() {
        return `
        <div class="modal-overlay" id="${this.roomId}ScheduleModal" role="dialog" aria-modal="true" aria-labelledby="${this.roomId}ScheduleTitle">
            <div class="modal-card schedule-modal">
                <button type="button" class="modal-close" aria-label="Close schedule modal" onclick="${this.getClassName()}.closeScheduleModal()">×</button>
                <h2 id="${this.roomId}ScheduleTitle">${this.scheduleModalTitle}</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`;
    }

    // ── Schedule modal ────────────────────────────────────────────────────────

    showScheduleModal() {
        const modal   = document.getElementById(`${this.roomId}ScheduleModal`);
        const content = document.getElementById(`${this.roomId}ScheduleContent`);
        if (!modal || !content) return;

        const now       = Date.now();
        const cycleMs   = this.config.cycleDuration * 1000;
        const openMs    = this.config.openDuration  * 1000;
        const baseCycle = Math.floor(now / cycleMs);

        const rows = Array.from({ length: 6 }, (_, i) =>
            this._buildScheduleRow(now, cycleMs, openMs, baseCycle + i, i === 0)
        ).join('');

        content.innerHTML = `<div class="schedule-list">${rows}</div>`;
        modal.classList.add('active');
    }

    _buildScheduleRow(now, cycleMs, openMs, cycleIndex, isCurrent) {
        const cycleStart  = cycleIndex * cycleMs;
        const cycleClose  = cycleStart + openMs;
        const session     = this.sessions[cycleIndex % this.sessions.length];
        const timeInto    = now - cycleStart;
        const isOpen      = isCurrent && timeInto >= 0 && timeInto < openMs;
        const isInSession = isCurrent && timeInto >= openMs;

        const fmt = ms => new Date(ms).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        const badge = isOpen
            ? `<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>`
            : isInSession
                ? `<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>`
                : '';

        const rowBg = isOpen ? 'background:var(--accent);color:white;' : 'background:var(--surface);';

        return `
        <div class="schedule-item${isCurrent ? ' current' : ''}"
             style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:var(--radius-md);margin-bottom:8px;${rowBg}">
            <div style="display:flex;align-items:center;gap:12px;flex:1;">
                <span style="font-size:24px;">${session.emoji}</span>
                <div>
                    <div style="font-weight:600;font-size:14px;">${session.title}${badge}</div>
                    <div style="font-size:11px;opacity:0.7;">${[session.category, session.duration].filter(Boolean).join(' · ')}</div>
                </div>
            </div>
            <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
                <div style="font-weight:600;">${fmt(cycleStart)}</div>
                <div style="opacity:0.6;">closes ${fmt(cycleClose)}</div>
            </div>
        </div>`;
    }

    closeScheduleModal() {
        document.getElementById(`${this.roomId}ScheduleModal`)?.classList.remove('active');
    }
}

// Apply mixins onto the base class - all subclasses inherit them automatically
Object.assign(TimedVideoRoom.prototype, YouTubePlayerMixin);
Object.assign(TimedVideoRoom.prototype, CycleStateMixin);

export { TimedVideoRoom };
