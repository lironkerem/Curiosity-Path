/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TAROT ROOM (FULLY RESTORED & OPTIMIZED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @class TarotRoom
 * @extends PracticeRoom
 * @mixes ChatMixin
 * @version 3.1.0
 * 
 * Restored Features:
 * - Dual tab system (Daily Collective + Personal Draw)
 * - Community chat sections for both tabs
 * - Participant list sidebar
 * - Rich card display styling
 * - Complete tarot deck with all meanings
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
        
        // Initialize tarot data
        this.initializeTarotData();
        
        // Room state
        this.state.dailyCard = null;
        this.state.personalDeck = [];
        this.state.personalDrawn = false;
        this.state.currentTab = 'daily';
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAROT DATA INITIALIZATION (OPTIMIZED - EXTERNAL JSON)
    // ═══════════════════════════════════════════════════════════════════════
    
    async initializeTarotData() {
        this.TAROT_BASE_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/';
        this.suits = ['pentacles', 'swords', 'cups', 'wands'];
        
        this.SUIT_NAMES = {
            pentacles: 'Pentacles',
            swords: 'Swords',
            cups: 'Cups',
            wands: 'Wands'
        };
        
        this.COURT_RANKS = {
            11: 'Page',
            12: 'Knight',
            13: 'Queen',
            14: 'King'
        };
        
        // Load from external JSON file (falls back to inline if fetch fails)
        try {
            const response = await fetch('./js/Rooms/tarot-data.json');
            if (response.ok) {
                const data = await response.json();
                this.MAJOR_ARCANA_NAMES = data.majorArcana.names;
                this.MAJOR_ARCANA_MEANINGS = data.majorArcana.meanings;
                this.MINOR_ARCANA_MEANINGS = data.minorArcana;
                this.COURT_CARD_MEANINGS = data.courtCards;
            } else {
                this.loadInlineTarotData();
            }
        } catch (error) {
            console.warn('Failed to load external tarot data, using inline fallback');
            this.loadInlineTarotData();
        }
    }
    
    // Fallback: inline data if JSON file unavailable
    loadInlineTarotData() {
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
                7: "Fantasy and illusion. Choose wisely between dreams and reality.",
                8: "Walking away from what no longer serves. Seeking deeper meaning.",
                9: "Emotional fulfillment and contentment. Wishes coming true.",
                10: "Lasting happiness and harmony. Love overflowing in all forms."
            },
            wands: {
                1: "Creative inspiration and new venture. Pure potential ready to ignite.",
                2: "Planning and vision. The world is yours to explore.",
                3: "Expansion and foresight. Leadership with strategic thinking.",
                4: "Celebration and homecoming. Achievement and stability.",
                5: "Competition and conflict. Challenges that test resolve.",
                6: "Victory and recognition. Success earned through effort.",
                7: "Standing your ground. Defense of values and boundaries.",
                8: "Swift action and momentum. Things moving quickly forward.",
                9: "Resilience and persistence. Last push before completion.",
                10: "Burden of responsibility. Strength to carry what must be carried."
            }
        };
        
        this.COURT_CARD_MEANINGS = {
            pentacles: {
                'Page': "Studious and practical messenger. New opportunities in material realm.",
                'Knight': "Reliable and methodical worker. Steady progress toward goals.",
                'Queen': "Nurturing and prosperous provider. Grounded in abundance.",
                'King': "Master of material world. Wealth through wisdom and patience."
            },
            swords: {
                'Page': "Curious and vigilant observer. Mental agility and truth-seeking.",
                'Knight': "Swift and direct communicator. Action driven by intellect.",
                'Queen': "Clear-minded and independent thinker. Wisdom through experience.",
                'King': "Authoritative and analytical leader. Justice and mental mastery."
            },
            cups: {
                'Page': "Sensitive and intuitive messenger. Emotional openness and creativity.",
                'Knight': "Romantic and idealistic dreamer. Following the heart's calling.",
                'Queen': "Compassionate and emotionally intelligent. Nurturing through love.",
                'King': "Emotionally balanced and wise. Mastery of feelings and relationships."
            },
            wands: {
                'Page': "Enthusiastic and adventurous explorer. Creative spark and potential.",
                'Knight': "Passionate and impulsive adventurer. Bold action and courage.",
                'Queen': "Confident and charismatic leader. Warmth and determination.",
                'King': "Visionary and inspirational leader. Creative mastery and enterprise."
            }
        };
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDE: ON ENTER
    // ═══════════════════════════════════════════════════════════════════════
    
    onEnter() {
        // Draw daily card and build deck
        this.drawDailyCard();
        this.state.personalDeck = this.buildFullDeck();
        
        // Render daily card
        setTimeout(() => {
            this.renderDailyCard();
            
            // Scroll to top
            const mainContent = document.querySelector(`#${this.roomId}View .tarot-main`);
            if (mainContent) mainContent.scrollTop = 0;
            window.scrollTo(0, 0);
        }, 100);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDE: BUILD BODY WITH TAB SYSTEM
    // ═══════════════════════════════════════════════════════════════════════
    
    buildBody() {
        return `
        <div class="ps-body" style="display: flex;">
            <main class="tarot-main" style="flex: 1; padding: 24px; overflow-y: auto; display: flex; justify-content: center; align-items: flex-start;">
                <div style="width: 100%;">
                    
                    <!-- Tab Navigation -->
                    <div style="display: flex; gap: 12px; margin-bottom: 24px; border-bottom: 2px solid var(--border);">
                        <button id="${this.roomId}TabDaily" 
                                onclick="${this.getClassName()}.switchTab('daily')" 
                                style="padding: 12px 24px; background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%); color: white; border: none; border-bottom: 3px solid #8b5cf6; cursor: pointer; font-weight: 600; font-size: 16px; border-radius: 8px 8px 0 0;">
                            🌅 Daily Collective Card
                        </button>
                        <button id="${this.roomId}TabPersonal" 
                                onclick="${this.getClassName()}.switchTab('personal')" 
                                style="padding: 12px 24px; background: transparent; color: var(--text); border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: 600; font-size: 16px; border-radius: 8px 8px 0 0;">
                            ✨ Personal Card Draw
                        </button>
                    </div>
                    
                    <!-- Daily Card Tab Content -->
                    <div id="${this.roomId}DailyTab" style="display: block;">
                        ${this.buildDailyTab()}
                    </div>
                    
                    <!-- Personal Draw Tab Content -->
                    <div id="${this.roomId}PersonalTab" style="display: none;">
                        ${this.buildPersonalTab()}
                    </div>

                </div>
            </main>
        </div>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAB CONTENT BUILDERS
    // ═══════════════════════════════════════════════════════════════════════
    
    buildDailyTab() {
        return `
        <div style="background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 16px;">
            <h3 style="font-family: var(--serif); font-size: 24px; margin: 0 0 20px 0; text-align: center;">🌅 Daily Collective Card</h3>
            <div id="${this.roomId}DailyCardContainer" style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <!-- Daily card rendered here -->
            </div>
        </div>
        
        <!-- Community Chat + Online Tarot Students -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">
            <!-- Community Discussion (Left - 2/3) -->
            <div>
                <h4 style="font-family: var(--serif); font-size: 18px; margin: 0 0 16px 0; text-align: center;">💬 Community Discussion</h4>
                ${this.buildChatContainer('daily', 'Share your thoughts on today\'s card...')}
            </div>
            
            <!-- Online Tarot Students (Right - 1/3) -->
            ${this.buildParticipantList()}
        </div>`;
    }
    
    buildPersonalTab() {
        return `
        <div style="background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 16px;">
            <h3 style="font-family: var(--serif); font-size: 24px; margin: 0 0 20px 0; text-align: center;">✨ Personal Card Draw</h3>
            <div id="${this.roomId}PersonalCardContainer" style="display: flex; flex-direction: column; align-items: center; gap: 16px; min-height: 200px; justify-content: center;">
                <button id="${this.roomId}DrawBtn" 
                        onclick="${this.getClassName()}.drawPersonalCard()" 
                        style="padding: 16px 32px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 16px; transition: all 0.2s;">
                    Draw Your Card
                </button>
            </div>
        </div>`;
    }
    
    buildParticipantList() {
        return `
        <div style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; background: var(--background);">
            <div style="font-weight: 600; font-size: 16px; margin-bottom: 16px; text-align: center;">Tarot Students</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px; text-align: center;">${this.state.participants} present</div>
            <div class="campfire-participants" style="height: 400px; overflow-y: auto;">
                <div class="campfire-participant">
                    <div class="campfire-participant-avatar" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">A</div>
                    <div class="campfire-participant-info">
                        <div class="campfire-participant-name">Alice</div>
                        <div class="campfire-participant-country">🇺🇸 United States</div>
                    </div>
                </div>
                <div class="campfire-participant">
                    <div class="campfire-participant-avatar" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">M</div>
                    <div class="campfire-participant-info">
                        <div class="campfire-participant-name">Maya</div>
                        <div class="campfire-participant-country">🇮🇳 India</div>
                    </div>
                </div>
                <div class="campfire-participant">
                    <div class="campfire-participant-avatar" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">J</div>
                    <div class="campfire-participant-info">
                        <div class="campfire-participant-name">James</div>
                        <div class="campfire-participant-country">🇬🇧 United Kingdom</div>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAB SWITCHING
    // ═══════════════════════════════════════════════════════════════════════
    
    switchTab(tabName) {
        const dailyTab = document.getElementById(`${this.roomId}DailyTab`);
        const personalTab = document.getElementById(`${this.roomId}PersonalTab`);
        const dailyBtn = document.getElementById(`${this.roomId}TabDaily`);
        const personalBtn = document.getElementById(`${this.roomId}TabPersonal`);
        
        if (tabName === 'daily') {
            dailyTab.style.display = 'block';
            personalTab.style.display = 'none';
            dailyBtn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
            dailyBtn.style.color = 'white';
            dailyBtn.style.borderBottom = '3px solid #8b5cf6';
            personalBtn.style.background = 'transparent';
            personalBtn.style.color = 'var(--text)';
            personalBtn.style.borderBottom = '3px solid transparent';
        } else {
            dailyTab.style.display = 'none';
            personalTab.style.display = 'block';
            personalBtn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
            personalBtn.style.color = 'white';
            personalBtn.style.borderBottom = '3px solid #8b5cf6';
            dailyBtn.style.background = 'transparent';
            dailyBtn.style.color = 'var(--text)';
            dailyBtn.style.borderBottom = '3px solid transparent';
        }
        
        this.state.currentTab = tabName;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // TAROT DECK & CARD LOGIC
    // ═══════════════════════════════════════════════════════════════════════
    
    buildFullDeck() {
        return [
            // Major Arcana (0-21)
            ...Array.from({ length: 22 }, (_, i) => ({ type: 'major', number: i, suit: 'major' })),
            // Minor Arcana (1-10 + Court cards 11-14 for each suit)
            ...this.suits.flatMap(suit => 
                Array.from({ length: 14 }, (_, i) => ({
                    type: i < 10 ? 'minor' : 'court',
                    number: i + 1,
                    suit
                }))
            )
        ];
    }
    
    shuffleDeck(deck) {
        const arr = [...deck];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    getCardName(number, suit = 'major') {
        if (suit === 'major') return this.MAJOR_ARCANA_NAMES[number] || "The Fool";
        if (number <= 10) return `${number} of ${this.SUIT_NAMES[suit]}`;
        return `${this.COURT_RANKS[number]} of ${this.SUIT_NAMES[suit]}`;
    }
    
    getCardMeaning(number, suit = 'major') {
        if (suit === 'major') return this.MAJOR_ARCANA_MEANINGS[number] || '';
        if (number <= 10) return this.MINOR_ARCANA_MEANINGS[suit]?.[number] || '';
        return this.COURT_CARD_MEANINGS[suit]?.[this.COURT_RANKS[number]] || '';
    }
    
    getCardImage(number, suit = 'major') {
        if (suit === 'major') {
            const n = String(number).padStart(2, '0');
            const name = this.getCardName(number, 'major').replace(/\s+/g, '');
            return `${this.TAROT_BASE_URL}${n}-${name}.jpg`;
        }
        const s = suit.charAt(0).toUpperCase() + suit.slice(1);
        const n = String(number).padStart(2, '0');
        return `${this.TAROT_BASE_URL}${s}${n}.jpg`;
    }
    
    buildCardDisplay(card) {
        return `
            <img src="${this.getCardImage(card.number, card.suit)}" 
                 style="width: 280px; height: auto; border-radius: 12px; box-shadow: var(--shadow);"
                 onerror="this.src='${this.TAROT_BASE_URL}CardBacks.jpg'">
            <h4 style="font-family: var(--serif); font-size: 20px; margin: 8px 0; text-align: center;">${this.getCardName(card.number, card.suit)}</h4>
            <p style="text-align: center; color: var(--text-muted); max-width: 500px; line-height: 1.6;">${this.getCardMeaning(card.number, card.suit)}</p>
        `;
    }
    
    drawDailyCard() {
        if (!this.state.dailyCard) {
            const deck = this.buildFullDeck();
            this.state.dailyCard = deck[Math.floor(Math.random() * deck.length)];
        }
    }
    
    renderDailyCard() {
        const container = document.getElementById(`${this.roomId}DailyCardContainer`);
        if (!container || !this.state.dailyCard) return;
        
        container.innerHTML = this.buildCardDisplay(this.state.dailyCard);
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
        container.innerHTML = this.buildCardDisplay(card);
        
        Core.showToast('✨ Card drawn');
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDE: INSTRUCTIONS
    // ═══════════════════════════════════════════════════════════════════════
    
    getInstructions() {
        return `
            <p><strong>Daily guidance and personal card draws with community reflection.</strong></p>
            
            <h3>Two Types of Draws:</h3>
            <ul>
                <li>🌅 <strong>Daily Card</strong> - Shared guidance for the community each day</li>
                <li>✨ <strong>Personal Draw</strong> - Your own card for specific questions</li>
            </ul>
            
            <h3>How to Approach:</h3>
            <ul>
                <li>Approach with an open heart and curious mind</li>
                <li>There are no "bad" cards—only lessons and perspectives</li>
                <li>Your intuition matters more than memorized meanings</li>
                <li>Reflect deeply before sharing with the community</li>
            </ul>
            
            <h3>Guidelines:</h3>
            <ul>
                <li>Honor the sacred nature of divination</li>
                <li>Be respectful of others' interpretations</li>
                <li>Keep reflections authentic and thoughtful</li>
                <li>Avoid fortune-telling or predictions for others</li>
            </ul>`;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDE: PARTICIPANT TEXT
    // ═══════════════════════════════════════════════════════════════════════
    
    getParticipantText() {
        return `${this.state.participants} seeking guidance`;
    }
}

// Apply ChatMixin
Object.assign(TarotRoom.prototype, ChatMixin);

// Export as singleton
window.TarotRoom = new TarotRoom();