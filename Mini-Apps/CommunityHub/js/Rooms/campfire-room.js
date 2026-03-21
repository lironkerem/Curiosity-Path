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
            description: 'A warm space to share, reflect, and connect with the community. Pull up a chair. Real conversations, real people, real connection.',
            energy:      'Social',
            imageUrl:    '/public/Community/Campfire.webp',
            participants: 12,
        });

        this.initChatState(['main']);
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        this.loadRoomChatFromDB('main');
        this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`);
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
        <div class="ps-body">
            <main class="campfire-main" aria-label="Community Campfire chat" style="padding:20px;min-width:0;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
                    <div>
                        <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;">Gather Around the Fire</h4>
                        <div style="display:flex;flex-direction:column;height:auto;">
                            ${this.buildChatContainer('main', 'Share from the heart...')}
                        </div>
                        <div class="campfire-hint" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;">
                            💫 Speak from the heart · Listen with presence
                        </div>
                    </div>
                    ${this.buildParticipantSidebarHTML('Around the Fire', `${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`, 'auto')}
                </div>
            </main>
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
