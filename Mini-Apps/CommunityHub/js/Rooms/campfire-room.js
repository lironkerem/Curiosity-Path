/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMMUNITY CAMPFIRE ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class CampfireRoom
 * @extends PracticeRoom
 * @mixes ChatMixin
 * @version 3.0.0
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
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onInit() {
        this.loadMessagesFromStorage('main');
    }
    
    onEnter() {
        this.renderSavedMessages('main');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // UI CUSTOMIZATION
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
                <div class="campfire-messages" id="${this.roomId}MainMessages" style="flex: 1; overflow-y: auto; padding: 20px; background: var(--background); border: 2px solid var(--border); border-radius: var(--radius-lg); margin-bottom: 16px;">
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
                    <div>
                        <div style="font-weight: 600; font-size: 16px;">Around the Fire</div>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                            ${this.state.participants} present
                        </div>
                    </div>
                </div>
                <div class="campfire-participants" id="${this.roomId}ParticipantsList">
                    ${this.buildParticipantsList()}
                </div>
            </aside>
        </div>`;
    }
    
    buildParticipantsList() {
        // Sample participants
        const participants = [
            { name: 'Alice', country: '🇺🇸 United States', color: '#667eea' },
            { name: 'Marco', country: '🇮🇹 Italy', color: '#f093fb' },
            { name: 'Yuki', country: '🇯🇵 Japan', color: '#4facfe' },
            { name: 'Sofia', country: '🇧🇷 Brazil', color: '#43e97b' }
        ];
        
        return participants.map(p => `
            <div class="campfire-participant" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: var(--radius-md); margin-bottom: 8px; background: var(--background);">
                <div class="campfire-participant-avatar" 
                     style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, ${p.color} 0%, ${p.color}dd 100%); display: flex; align-items: center; justify-content: center; font-weight: 600; color: white;">
                    ${p.name[0]}
                </div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name" style="font-weight: 500; font-size: 14px;">${p.name}</div>
                    <div class="campfire-participant-country" style="font-size: 11px; color: var(--text-muted);">${p.country}</div>
                </div>
            </div>
        `).join('');
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

// Create and bind singleton instance
const campfireInstance = (() => {
    const instance = new CampfireRoom();
    
    // Bind ALL methods to the instance
    let proto = Object.getPrototypeOf(instance);
    while (proto && proto !== Object.prototype) {
        Object.getOwnPropertyNames(proto).forEach(key => {
            if (key !== 'constructor' && typeof instance[key] === 'function') {
                instance[key] = instance[key].bind(instance);
            }
        });
        proto = Object.getPrototypeOf(proto);
    }
    
    return instance;
})();

window.CampfireRoom = campfireInstance;
// CRITICAL: Create global variable for onclick handlers
if (typeof CampfireRoom === 'undefined') {
    CampfireRoom = campfireInstance;
}
