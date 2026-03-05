/*** COMMUNITY CAMPFIRE ROOM
 * @extends PracticeRoom
 * @mixes ChatMixin
 */

import { PracticeRoom } from './PracticeRoom.js';
import { ChatMixin } from './mixins/ChatMixin.js';

class CampfireRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'campfire',
            roomType:    'always-open',
            name:        'Community Campfire',
            icon:        '🔥',
            description: 'Gather, share, connect. Open chat & inspire.',
            energy:      'Social',
            imageUrl:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Campfire.png',
            participants: 12,
        });

        this.initChatState(['main']);
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        this.loadRoomChatFromDB('main');
        this._refreshParticipantSidebar(`${this.roomId}ParticipantsList`, `${this.roomId}SidebarCount`);
        this._injectSenderAvatar('main');
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    getHeaderGradient() {
        return 'background:linear-gradient(135deg,rgba(234,88,12,0.1) 0%,rgba(251,146,60,0.05) 100%);';
    }

    getParticipantText() {
        return `${this.state.participants} around the fire`;
    }

    buildBody() {
        return `
        <div class="ps-body campfire-body" style="display:flex;gap:0;min-height:0;flex:1;">
            <main class="campfire-main" style="flex:1;display:flex;flex-direction:column;padding:20px;min-width:0;">
                <h2 style="font-family:var(--serif);text-align:center;margin-bottom:20px;">
                    Gather Around the Fire
                </h2>
                ${this.buildChatContainer('main', 'Share from the heart...')}
                <div class="campfire-hint" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;">
                    💫 Speak from the heart · Listen with presence
                </div>
            </main>
            <aside class="campfire-sidebar-always-visible" id="${this.roomId}Sidebar">
                <div class="campfire-sidebar-header" style="margin-bottom:20px;">
                    <div style="font-weight:600;font-size:16px;">Around the Fire</div>
                    <div id="${this.roomId}SidebarCount" style="font-size:12px;color:var(--text-muted);margin-top:2px;">Loading...</div>
                </div>
                <div class="campfire-participants" id="${this.roomId}ParticipantsList">
                    <div style="color:var(--text-muted);font-size:13px;padding:12px;">Loading...</div>
                </div>
            </aside>
        </div>`;
    }

    getInstructions() {
        return `
            <p><strong>A warm gathering space for authentic connection.</strong></p>
            <h3>Campfire Values:</h3>
            <ul>
                <li>💫 Share authentically from the heart</li>
                <li>❤️ Listen with presence and care</li>
                <li>🌟 Inspire and uplift each other</li>
                <li>🤝 Connect across all borders</li>
            </ul>
            <h3>What to Share:</h3>
            <ul>
                <li>Reflections from your practice</li>
                <li>Insights and breakthroughs</li>
                <li>Gratitude and appreciation</li>
                <li>Questions and curiosity</li>
                <li>Support and encouragement</li>
            </ul>
            <h3>Guidelines:</h3>
            <ul>
                <li>Be respectful and kind</li>
                <li>Keep it positive and uplifting</li>
                <li>No spam or self-promotion</li>
                <li>Honor everyone's journey</li>
            </ul>`;
    }
}

Object.assign(CampfireRoom.prototype, ChatMixin);

// Window bridge: preserved for inline onclick handlers
const campfireRoom = new CampfireRoom();
window.CampfireRoom = campfireRoom;

export { CampfireRoom, campfireRoom };
