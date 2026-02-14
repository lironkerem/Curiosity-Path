/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TAROT ROOM (REFACTORED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class TarotRoom
 * @extends PracticeRoom
 * @mixes ChatMixin
 * @version 3.0.0
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

class TarotRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'tarot',
            roomType: 'always-open',
            name: 'Tarot Room',
            icon: '🔮',
            description: 'Daily guidance & personal draws with reflection',
            energy: 'Intuitive',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Tarot.png',
            participants: 8
        });
        
        // Initialize chat with two channels
        this.initChatState(['daily', 'personal']);
        
        // Tarot data
        this.TAROT_BASE_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/';
        
        this.MAJOR_ARCANA_NAMES = {
            0: "The Fool", 1: "The Magician", 2: "The High Priestess", 3: "The Empress",
            4: "The Emperor", 5: "The Hierophant", 6: "The Lovers", 7: "The Chariot",
            8: "Strength", 9: "The Hermit", 10: "Wheel of Fortune", 11: "Justice",
            12: "The Hanged Man", 13: "Death", 14: "Temperance", 15: "The Devil",
            16: "The Tower", 17: "The Star", 18: "The Moon", 19: "The Sun",
            20: "Judgement", 21: "The World"
        };
        
        this.MAJOR_ARCANA_MEANINGS = {
            0: "A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",
            1: "All the tools are in your hands. You are the bridge between spirit and matter.",
            2: "Silence holds the answers you seek. Trust your inner knowing.",
            3: "The Earth mirrors your abundance. Nurture what you love.",
            4: "True power is built through order and wisdom. Take authority over your life.",
            5: "Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",
            6: "Union of soul and choice of heart. Harmony is born when love aligns with truth.",
            7: "Willpower shapes destiny. Victory is achieved through balance of heart and mind.",
            8: "Gentle courage tames inner storms. True strength is soft yet unbreakable.",
            9: "Withdraw to reconnect with your light. The answers you seek are within.",
            10: "Life turns in divine rhythm. Every rise and fall carries hidden blessings.",
            11: "The scales always balance in time. Choose integrity.",
            12: "Surrender brings revelation. Sometimes you must pause to see from a higher angle.",
            13: "Endings are beginnings disguised. Transformation renews you into higher truth.",
            14: "Balance is your sacred art. Patience and moderation bring peace.",
            15: "Bondage is often self-made. Recognize what controls you and reclaim your power.",
            16: "When illusion collapses, liberation follows. Trust the breakdown.",
            17: "Hope returns like light after storm. Believe again in miracles.",
            18: "The path is unclear but alive with mystery. Feel your way through intuition.",
            19: "Joy, clarity, and vitality fill your being. Let your light shine.",
            20: "Awakening through self-realization. Rise into your higher purpose.",
            21: "Completion, integration, and mastery. Celebrate how far you've come."
        };
        
        this.suits = ['pentacles', 'swords', 'cups', 'wands'];
        
        this.MINOR_ARCANA_MEANINGS = {
            pentacles: {
                1: "New financial opportunity or material beginning. Plant seeds for future abundance.",
                2: "Balance between multiple priorities. Juggling responsibilities with grace.",
                3: "Collaboration and teamwork. Your skills are recognized and valued.",
                4: "Holding on too tightly. Security through control or fear of loss.",
                5: "Financial or material hardship. Temporary struggle leads to resilience.",
                6: "Generosity and fair exchange. Giving and receiving in balance.",
                7: "Patience with long-term investments. Results take time to manifest.",
                8: "Mastery through practice. Dedication to craft and skill development.",
                9: "Self-sufficiency and material comfort. Enjoying the fruits of your labor.",
                10: "Lasting wealth and legacy. Family, tradition, and generational abundance."
            },
            swords: {
                1: "Mental clarity and breakthrough. Truth cuts through confusion.",
                2: "Difficult decision or stalemate. Time to weigh options carefully.",
                3: "Heartbreak or painful truth. Necessary release brings healing.",
                4: "Rest and recovery. Taking time to recharge mentally.",
                5: "Conflict and defeat. Learning humility through challenge.",
                6: "Transition to calmer waters. Moving away from turmoil.",
                7: "Deception or strategy. Proceed with awareness and caution.",
                8: "Mental restriction. Breaking free from limiting beliefs.",
                9: "Anxiety and worry. Nightmares that lose power in daylight.",
                10: "Ending of a difficult cycle. Rock bottom becomes foundation."
            },
            cups: {
                1: "New emotional beginning. Opening your heart to love and connection.",
                2: "Partnership and mutual attraction. Harmony between two souls.",
                3: "Celebration and friendship. Joy shared multiplies.",
                4: "Emotional apathy or missed opportunity. Look beyond dissatisfaction.",
                5: "Loss and disappointment. Grief that teaches perspective.",
                6: "Nostalgia and innocence. Returning to simpler joys.",
                7: "Illusion and fantasy. Ground dreams in reality.",
                8: "Walking away from the familiar. Seeking deeper meaning.",
                9: "Emotional fulfillment. Wishes granted, contentment realized.",
                10: "Lasting happiness and family harmony. Emotional abundance overflows."
            },
            wands: {
                1: "Creative spark and new inspiration. Bold initiative ignites passion.",
                2: "Future planning and decisions. Vision meets preparation.",
                3: "Expansion and foresight. Progress through strategic action.",
                4: "Celebration and homecoming. Stability through joyful foundation.",
                5: "Competition and conflict. Growth through challenge.",
                6: "Victory and recognition. Success earned through perseverance.",
                7: "Standing your ground. Defending your position with courage.",
                8: "Swift action and momentum. Things move quickly now.",
                9: "Resilience and persistence. Nearly there—don't give up.",
                10: "Burden of responsibility. Carrying weight that may not be yours."
            }
        };
        
        this.COURT_CARD_MEANINGS = {
            pentacles: { Page: "Student of the material world.", Knight: "Methodical and reliable.", Queen: "Nurturer of resources.", King: "Master of the material realm." },
            swords: { Page: "Curious mind seeking truth.", Knight: "Driven by ideals and logic.", Queen: "Sharp intellect with experience.", King: "Authority through wisdom." },
            cups: { Page: "Emotionally open and intuitive.", Knight: "Romantic and idealistic.", Queen: "Emotionally mature and compassionate.", King: "Emotional mastery and diplomacy." },
            wands: { Page: "Enthusiastic explorer.", Knight: "Adventurous and impulsive.", Queen: "Confident and charismatic.", King: "Visionary leader." }
        };
        
        this.COURT_RANKS = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };
        this.SUIT_NAMES = { pentacles: 'Pentacles', swords: 'Swords', cups: 'Cups', wands: 'Wands' };
        
        // Room state
        this.state.dailyCard = null;
        this.state.personalDeck = [];
        this.state.personalDrawn = false;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════
    
    onInit() {
        this.state.personalDeck = this.buildFullDeck();
    }
    
    onEnter() {
        if (!this.state.dailyCard) {
            this.drawDailyCard();
        }
        setTimeout(() => this.renderDailyCard(), 100);
    }
    
    getParticipantText() {
        return `${this.state.participants} seeking guidance`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // UI BUILDING
    // ═══════════════════════════════════════════════════════════════════════
    
    buildBody() {
        return `
        <div class="ps-body" style="padding: 20px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <!-- Daily Card Section -->
                <div class="tarot-section" style="margin-bottom: 40px;">
                    <h2 style="font-family: var(--serif); text-align: center; margin-bottom: 20px;">
                        🌅 Today's Daily Card
                    </h2>
                    <div id="${this.roomId}DailyCardContainer" style="display: flex; flex-direction: column; align-items: center; padding: 30px; background: var(--surface); border-radius: var(--radius-lg); border: 2px solid var(--border);">
                        <!-- Card will be rendered here -->
                    </div>
                    
                    <!-- Daily Chat -->
                    <div style="margin-top: 20px;">
                        <h3 style="font-size: 16px; margin-bottom: 12px;">💬 Share Your Reflections</h3>
                        ${this.buildChatContainer('daily', 'Share your thoughts on today\'s card...')}
                    </div>
                </div>
                
                <!-- Personal Draw Section -->
                <div class="tarot-section">
                    <h2 style="font-family: var(--serif); text-align: center; margin-bottom: 20px;">
                        ✨ Your Personal Draw
                    </h2>
                    
                    ${!this.state.personalDrawn ? `
                    <div style="text-align: center; padding: 40px; background: var(--surface); border-radius: var(--radius-lg); border: 2px solid var(--border);">
                        <p style="margin-bottom: 20px; color: var(--text-muted);">
                            Draw a personal card for guidance on your specific question or situation.
                        </p>
                        <button onclick="${this.getClassName()}.drawPersonalCard()" 
                                style="padding: 14px 32px; background: var(--accent); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; font-size: 16px; cursor: pointer;">
                            🔮 Draw Your Card
                        </button>
                    </div>
                    ` : `
                    <div id="${this.roomId}PersonalCardContainer" style="display: flex; flex-direction: column; align-items: center; padding: 30px; background: var(--surface); border-radius: var(--radius-lg); border: 2px solid var(--border);">
                        <!-- Personal card will be rendered here -->
                    </div>
                    
                    <div id="${this.roomId}PersonalChatSection" style="margin-top: 20px; display: none;">
                        <h3 style="font-size: 16px; margin-bottom: 12px;">💬 Personal Reflections</h3>
                        ${this.buildChatContainer('personal', 'Reflect on your personal card...')}
                    </div>
                    `}
                </div>
            </div>
        </div>`;
    }
    
    getInstructions() {
        return `
            <p><strong>Daily guidance and personal card draws with community reflection.</strong></p>
            
            <h3>Two Types of Draws:</h3>
            <ul>
                <li>🌅 <strong>Daily Card</strong> - Shared guidance for the community</li>
                <li>✨ <strong>Personal Draw</strong> - Your own card for specific questions</li>
            </ul>
            
            <h3>How to Use:</h3>
            <ul>
                <li>Reflect on the daily card's message</li>
                <li>Share insights in the daily chat</li>
                <li>Draw a personal card when you need guidance</li>
                <li>Journal your reflections privately</li>
            </ul>
            
            <h3>The Tarot Deck:</h3>
            <ul>
                <li>22 Major Arcana - Life's big themes</li>
                <li>56 Minor Arcana - Day-to-day situations</li>
                <li>4 Suits: Pentacles, Swords, Cups, Wands</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAROT LOGIC
    // ═══════════════════════════════════════════════════════════════════════
    
    buildFullDeck() {
        const deck = [];
        
        // Major Arcana (0-21)
        for (let i = 0; i <= 21; i++) {
            deck.push({ number: i, suit: null });
        }
        
        // Minor Arcana (1-14 per suit)
        this.suits.forEach(suit => {
            for (let i = 1; i <= 14; i++) {
                deck.push({ number: i, suit: suit });
            }
        });
        
        return this.shuffleDeck(deck);
    }
    
    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    drawDailyCard() {
        const fullDeck = this.buildFullDeck();
        this.state.dailyCard = fullDeck[0];
    }
    
    drawPersonalCard() {
        if (this.state.personalDrawn) {
            Core.showToast('You already drew your card');
            return;
        }
        
        this.state.personalDeck = this.shuffleDeck(this.state.personalDeck);
        const card = this.state.personalDeck.pop();
        this.state.personalDrawn = true;
        
        const container = document.getElementById(`${this.roomId}PersonalCardContainer`);
        if (container) {
            container.innerHTML = this.buildCardDisplay(card);
        }
        
        // Show chat section
        const chatSection = document.getElementById(`${this.roomId}PersonalChatSection`);
        if (chatSection) chatSection.style.display = 'block';
        
        Core.showToast('✨ Card drawn');
    }
    
    renderDailyCard() {
        const container = document.getElementById(`${this.roomId}DailyCardContainer`);
        if (!container || !this.state.dailyCard) return;
        
        container.innerHTML = this.buildCardDisplay(this.state.dailyCard);
    }
    
    buildCardDisplay(card) {
        return `
            <img src="${this.getCardImage(card.number, card.suit)}" 
                 style="width: 280px; height: auto; border-radius: 12px; box-shadow: var(--shadow);"
                 onerror="this.src='${this.TAROT_BASE_URL}CardBacks.jpg'">
            <h4 style="font-family: var(--serif); font-size: 20px; margin: 16px 0 8px 0; text-align: center;">
                ${this.getCardName(card.number, card.suit)}
            </h4>
            <p style="text-align: center; color: var(--text-muted); max-width: 500px; line-height: 1.6;">
                ${this.getCardMeaning(card.number, card.suit)}
            </p>
        `;
    }
    
    getCardImage(number, suit) {
        if (suit === null) {
            // Major Arcana
            return `${this.TAROT_BASE_URL}${number}.jpg`;
        } else {
            // Minor Arcana
            return `${this.TAROT_BASE_URL}${suit}/${number}.jpg`;
        }
    }
    
    getCardName(number, suit) {
        if (suit === null) {
            return this.MAJOR_ARCANA_NAMES[number] || 'Unknown Card';
        } else {
            if (number >= 11 && number <= 14) {
                return `${this.COURT_RANKS[number]} of ${this.SUIT_NAMES[suit]}`;
            } else {
                return `${number} of ${this.SUIT_NAMES[suit]}`;
            }
        }
    }
    
    getCardMeaning(number, suit) {
        if (suit === null) {
            return this.MAJOR_ARCANA_MEANINGS[number] || 'A card of mystery and wisdom.';
        } else {
            if (number >= 11 && number <= 14) {
                const rank = this.COURT_RANKS[number];
                return this.COURT_CARD_MEANINGS[suit][rank] || 'A court card of wisdom.';
            } else {
                return this.MINOR_ARCANA_MEANINGS[suit][number] || 'A card of everyday wisdom.';
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // CHAT CUSTOMIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    getCustomMessageData(channel) {
        if (channel === 'daily' && this.state.dailyCard) {
            return {
                cardName: this.getCardName(this.state.dailyCard.number, this.state.dailyCard.suit)
            };
        }
        return {};
    }
}

// Apply mixins
Object.assign(TarotRoom.prototype, ChatMixin);

// Create and bind singleton instance
const tarotInstance = (() => {
    const instance = new TarotRoom();
    
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

window.TarotRoom = tarotInstance;
// CRITICAL: Create global variable for onclick handlers
if (typeof TarotRoom === 'undefined') {
    TarotRoom = tarotInstance;
}
