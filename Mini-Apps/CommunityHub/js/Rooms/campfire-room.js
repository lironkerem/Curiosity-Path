/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMMUNITY CAMPFIRE ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class CampfireRoom
 * @extends PracticeRoom
 * @mixes ChatMixin
 * @version 3.2.0 — PATCHED:
 *   - Removed duplicate buildParticipantsList() definition (was silently overriding live version)
 *   - Chat input now shows current user's real avatar / emoji / initial
 *   - Sidebar fully driven by live Supabase presence (_renderCampfireSidebar)
 *   - No hardcoded mock participants
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

class CampfireRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'campfire',
            roomType: 'always-open',
            name: 'Community Campfire',
            icon: '🔥',
            description: 'Gather, share, connect. Open chat & inspire.',
            energy: 'Social',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Campfire.png',
            participants: 12
        });

        // Initialize chat with persistence
        this.initChatState(['main']);
        this.chatPersistence = true;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    onInit() {
        // History loads from Supabase in onEnter() after the DOM is ready.
    }

    onEnter() {
        // Load chat history from Supabase and subscribe to realtime.
        this.loadRoomChatFromDB('main');

        // Wire real participants in sidebar + live updates
        this._refreshParticipantSidebar(
            `${this.roomId}ParticipantsList`,
            `${this.roomId}SidebarCount`
        );

        // Inject current user avatar into the chat input row
        setTimeout(() => this._injectSenderAvatar(), 400);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SENDER AVATAR — inject current user's avatar beside input
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Render the current user's avatar beside the message input.
     * Called after DOM is ready.
     */
    _injectSenderAvatar() {
        const wrapper = document.getElementById(`${this.roomId}SenderAvatarWrapper`);
        if (!wrapper) return;

        const user = window.Core?.state?.currentUser;
        if (!user) return;

        const name      = user.name || 'Me';
        const avatarUrl = user.avatar_url || '';
        const emoji     = user.emoji || '';
        const initial   = name.charAt(0).toUpperCase();
        const gradient  = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(user.id || name)
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        const inner = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
            : `<span style="color:white;font-weight:600;font-size:13px;">${emoji || initial}</span>`;
        const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        wrapper.innerHTML = `
            <div style="width:36px;height:36px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                ${inner}
            </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════════════════

    getHeaderGradient() {
        return 'background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%);';
    }

    getParticipantText() {
        return `${this.state.participants} around the fire`;
    }

    buildBody() {
        return `
        <div class="ps-body" style="display: flex; gap: 0; height: calc(100vh - 200px);">
            <main class="campfire-main" style="flex: 1; display: flex; flex-direction: column; padding: 20px;">
                <h2 style="font-family: var(--serif); text-align: center; margin-bottom: 20px;">
                    Gather Around the Fire
                </h2>

                <!-- Messages Container -->
                <div class="campfire-messages" id="${this.roomId}MainMessages"
                     style="flex: 1; overflow-y: auto; padding: 20px; background: var(--background); border: 2px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 16px;">
                    <div class="campfire-welcome" style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 48px; margin-bottom: 12px;">🔥</div>
                        <div style="color: var(--text-muted); font-size: 14px; font-style: italic; line-height: 1.6;">
                            Welcome to the Campfire. Share your journey, insights, and heart.
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <div class="campfire-input-area" style="background: var(--surface); padding: 16px; border-radius: var(--radius-lg); border: 2px solid var(--border);">
                    <div style="display: flex; gap: 12px; align-items: center;">
                        <!-- Current user avatar -->
                        <div id="${this.roomId}SenderAvatarWrapper">
                            <div style="width:36px;height:36px;border-radius:50%;background:var(--border);flex-shrink:0;"></div>
                        </div>
                        <input type="text"
                               class="campfire-input"
                               id="${this.roomId}MainInput"
                               placeholder="Share from the heart..."
                               style="flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background); font-size: 14px;"
                               onkeypress="if(event.key==='Enter')CampfireRoom.sendMessage('main')">
                        <button class="campfire-send"
                                onclick="CampfireRoom.sendMessage('main')"
                                style="padding: 12px 24px; background: var(--accent); border: none; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; color: white;">
                            <span style="font-size: 20px;">→</span>
                        </button>
                    </div>
                    <div class="campfire-hint" style="text-align: center; margin-top: 12px; font-size: 12px; color: var(--text-muted); font-style: italic;">
                        💫 Speak from the heart · Listen with presence
                    </div>
                </div>
            </main>

            <!-- Sidebar -->
            <aside class="campfire-sidebar-always-visible" id="${this.roomId}Sidebar"
                   style="width: 300px; background: var(--surface); border-left: 2px solid var(--border); padding: 20px; overflow-y: auto;">
                <div class="campfire-sidebar-header" style="margin-bottom: 20px;">
                    <div style="font-weight: 600; font-size: 16px;">Around the Fire</div>
                    <div id="${this.roomId}SidebarCount" style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                        Loading...
                    </div>
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

// Apply mixins
Object.assign(CampfireRoom.prototype, ChatMixin);

// Export singleton instance
window.CampfireRoom = new CampfireRoom();
