/**
 * TAB ROOM MIXIN
 * Shared tab-switching UI for rooms with a Daily + Personal two-tab layout.
 *
 * Usage: Object.assign(YourRoom.prototype, TabRoomMixin);
 *
 * Expects elements with IDs:
 *   ${roomId}DailyTab      / ${roomId}PersonalTab     - content panels
 *   ${roomId}TabDaily      / ${roomId}TabPersonal      - nav buttons
 */

const TabRoomMixin = {

    switchTab(tabName) {
        const dailyTab    = document.getElementById(`${this.roomId}DailyTab`);
        const personalTab = document.getElementById(`${this.roomId}PersonalTab`);
        const dailyBtn    = document.getElementById(`${this.roomId}TabDaily`);
        const personalBtn = document.getElementById(`${this.roomId}TabPersonal`);
        if (!dailyTab || !personalTab || !dailyBtn || !personalBtn) return;

        const isDaily = tabName === 'daily';
        dailyTab.style.display    = isDaily ? 'block' : 'none';
        personalTab.style.display = isDaily ? 'none'  : 'block';
        this._styleTab(dailyBtn,    isDaily);
        this._styleTab(personalBtn, !isDaily);
        this.state.currentTab = tabName;
    },

    _styleTab(btn, isActive) {
        btn.style.background   = isActive ? 'linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%)' : 'transparent';
        btn.style.color        = isActive ? 'white' : 'var(--text)';
        btn.style.borderBottom = isActive ? '3px solid var(--neuro-accent)' : '3px solid transparent';
    },

    buildTabNav(dailyLabel, personalLabel) {
        const cn = this.getClassName();
        return `
        <div style="display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid var(--border);flex-wrap:wrap;">
            <button id="${this.roomId}TabDaily" onclick="${cn}.switchTab('daily')"
                    style="padding:10px 16px;background:linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%);color:white;border:none;border-bottom:3px solid var(--neuro-accent);cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${dailyLabel}
            </button>
            <button id="${this.roomId}TabPersonal" onclick="${cn}.switchTab('personal')"
                    style="padding:10px 16px;background:transparent;color:var(--text);border:none;border-bottom:3px solid transparent;cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${personalLabel}
            </button>
        </div>`;
    },
};

export { TabRoomMixin };
