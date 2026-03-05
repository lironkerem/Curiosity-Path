/**
 * CYCLE STATE MIXIN
 * Manages timed open/closed windows for practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, CycleStateMixin);
 *
 * Required config:
 *   - config.cycleDuration   (seconds) - full cycle length
 *   - config.openDuration    (seconds) - open window at cycle start
 *   - config.sessionDuration (seconds) - session length after open window
 */

import { Core } from '../../core.js';

const CycleStateMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initCycleState() {
        this.state.isOpen           = false;
        this.state.isInSession      = false;
        this.state.cycleStartTime   = null;
        this.state.nextOpenTime     = null;
        this.state.nextSessionStart = null;
        this._cycleInterval         = null;
    },

    initializeCycle() {
        const now     = Date.now();
        const cycleMs = this.config.cycleDuration * 1000;

        this.state.cycleStartTime = now - (now % cycleMs);
        this.setSessions?.(now);
        this.calculateCycleState();

        if (this._cycleInterval) clearInterval(this._cycleInterval);
        this._cycleInterval = setInterval(() => {
            this.calculateCycleState();
            this.updateRoomCard();
        }, 1000);
    },

    // ── State calculation ─────────────────────────────────────────────────────

    calculateCycleState() {
        const now     = Date.now();
        const cycleMs = this.config.cycleDuration * 1000;
        const openMs  = this.config.openDuration  * 1000;

        const timeIntoCycle     = (now - this.state.cycleStartTime) % cycleMs;
        const currentCycleStart = now - timeIntoCycle;

        if (currentCycleStart !== this.state.cycleStartTime) {
            this.state.cycleStartTime = currentCycleStart;
            this.setSessions?.(now);
        }

        const isOpen       = timeIntoCycle < openMs;
        this.state.isOpen      = isOpen;
        this.state.isInSession = !isOpen;

        if (isOpen) {
            const msLeft = openMs - timeIntoCycle;
            this.state.nextSessionStart = now + msLeft;
            this.state.nextOpenTime     = now + msLeft + (this.config.sessionDuration * 1000);
        } else {
            this.state.nextOpenTime     = now + (cycleMs - timeIntoCycle);
            this.state.nextSessionStart = null;
        }

        if (this.state.isInSession && !this.state.sessionStarted && this.isUserInRoom()) {
            this.startSession?.();
        }
    },

    // ── Room entry checks ─────────────────────────────────────────────────────

    isUserInRoom() {
        return Core?.state?.currentRoom === this.roomId;
    },

    canEnterRoom() {
        return Core.state?.currentUser?.is_admin === true || this.state.isOpen;
    },

    _checkCycleWindow() {
        return this.state.isOpen;
    },

    // ── Countdown helpers ─────────────────────────────────────────────────────

    _formatCountdown(targetMs, label) {
        if (!targetMs) return '';
        const diff = Math.max(0, targetMs - Date.now());
        const m    = Math.floor(diff / 60000);
        const s    = Math.floor((diff % 60000) / 1000);
        return `${label} ${m}:${String(s).padStart(2, '0')}`;
    },

    getTimeUntilSessionStarts() {
        return this._formatCountdown(this.state.nextSessionStart, 'Session begins in');
    },

    getCountdownToNextOpen() {
        return this._formatCountdown(this.state.nextOpenTime, 'Opens in');
    },

    getTimerText() {
        const nextTitle = this.getNextSession?.()?.title ?? 'Next Session';
        const countdown = this.state.isOpen
            ? this.getTimeUntilSessionStarts()
            : this.getCountdownToNextOpen();
        return `<strong>Next:</strong> ${nextTitle}<br>${countdown}`;
    },

    buildScheduleLink() {
        return `
        <div class="view-schedule"
             onclick="event.stopPropagation();${this.getClassName()}.showScheduleModal()"
             style="text-align:center;font-size:11px;color:var(--text-secondary);text-decoration:underline;cursor:pointer;">
            📅 View Schedule
        </div>`;
    },

    // ── Cleanup ───────────────────────────────────────────────────────────────

    cleanupCycle() {
        if (this._cycleInterval) {
            clearInterval(this._cycleInterval);
            this._cycleInterval = null;
        }
    },
};

export { CycleStateMixin };
