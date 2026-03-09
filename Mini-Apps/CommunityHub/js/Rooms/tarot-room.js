/*** TAROT ROOM
 * @extends PracticeRoom
 * @mixes ChatMixin, TabRoomMixin
 *
 * Daily card: date-seeded - same card for all users, resets at midnight.
 */

import { PracticeRoom } from './PracticeRoom.js';
import { ChatMixin } from './mixins/ChatMixin.js';
import { TabRoomMixin } from './mixins/TabRoomMixin.js';
import { Core } from '../core.js';

class TarotRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'tarot',
            roomType:    'always-open',
            name:        'Tarot Room',
            icon:        '🔮',
            description: 'Daily guidance & personal draws with reflection',
            energy:      'Intuitive',
            imageUrl:    '/public/Community/Tarot.webp',
            participants: 8,
        });

        this.initChatState(['daily', 'personal']);

        this._tarotDataReady     = false;
        this._pendingDailyRender = false;

        this.state.dailyCard     = null;
        this.state.personalDeck  = [];
        this.state.personalDrawn = false;
        this.state.currentTab    = 'daily';

        this._initializeTarotData();
    }

    // ── Data initialisation ───────────────────────────────────────────────────

    async _initializeTarotData() {
        this.TAROT_BASE_URL = '/public/Tarot%20Cards%20images/';
        this.suits       = ['pentacles', 'swords', 'cups', 'wands'];
        this.SUIT_NAMES  = { pentacles: 'Pentacles', swords: 'Swords', cups: 'Cups', wands: 'Wands' };
        this.COURT_RANKS = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };

        try {
            const res = await fetch('/Mini-Apps/CommunityHub/js/Rooms/tarot-data.json');
            if (res.ok) {
                const data = await res.json();
                this._tarotData = data; // full enriched dataset
                // Build legacy lookup maps from new structure for getCardName / getCardMeaning
                this.MAJOR_ARCANA_NAMES    = {};
                this.MAJOR_ARCANA_MEANINGS = {};
                data.majorArcana.forEach(c => {
                    this.MAJOR_ARCANA_NAMES[c.id]    = c.name;
                    this.MAJOR_ARCANA_MEANINGS[c.id]  = c.upright;
                });
                this.MINOR_ARCANA_MEANINGS = {};
                this.COURT_CARD_MEANINGS   = {};
                ['pentacles','swords','cups','wands'].forEach(suit => {
                    this.MINOR_ARCANA_MEANINGS[suit] = {};
                    this.COURT_CARD_MEANINGS[suit]   = {};
                    (data.minorArcana[suit] || []).forEach(c => {
                        this.MINOR_ARCANA_MEANINGS[suit][c.number] = c.upright;
                    });
                    (data.courtCards[suit] || []).forEach(c => {
                        this.COURT_CARD_MEANINGS[suit][c.rank] = c.upright;
                    });
                });
            } else {
                this._loadInlineTarotData();
            }
        } catch {
            this._loadInlineTarotData();
        }

        this._tarotDataReady = true;
        if (this._pendingDailyRender) {
            this._pendingDailyRender = false;
            this._drawAndRenderDaily();
        }
    }

    _loadInlineTarotData() {
        this.MAJOR_ARCANA_NAMES = {
            0:"The Fool", 1:"The Magician", 2:"The High Priestess", 3:"The Empress",
            4:"The Emperor", 5:"The Hierophant", 6:"The Lovers", 7:"The Chariot",
            8:"Strength", 9:"The Hermit", 10:"Wheel of Fortune", 11:"Justice",
            12:"The Hanged Man", 13:"Death", 14:"Temperance", 15:"The Devil",
            16:"The Tower", 17:"The Star", 18:"The Moon", 19:"The Sun",
            20:"Judgement", 21:"The World"
        };
        this.MAJOR_ARCANA_MEANINGS = {
            0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",
            1:"All the tools are in your hands. You are the bridge between spirit and matter.",
            2:"Silence holds the answers you seek. Trust your inner knowing.",
            3:"The Earth mirrors your abundance. Nurture what you love.",
            4:"True power is built through order and wisdom. Take authority over your life.",
            5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",
            6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",
            7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",
            8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",
            9:"Withdraw to reconnect with your light. The answers you seek are within.",
            10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",
            11:"The scales always balance in time. Choose integrity.",
            12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",
            13:"Endings are beginnings disguised. Transformation renews you into higher truth.",
            14:"Balance is your sacred art. Patience and moderation bring peace.",
            15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",
            16:"When illusion collapses, liberation follows. Trust the breakdown.",
            17:"Hope returns like light after storm. Believe again in miracles.",
            18:"The path is unclear but alive with mystery. Feel your way through intuition.",
            19:"Joy, clarity, and vitality fill your being. Let your light shine.",
            20:"Awakening through self-realization. Rise into your higher purpose.",
            21:"Completion, integration, and mastery. Celebrate how far you've come."
        };
        this.MINOR_ARCANA_MEANINGS = {
            pentacles: {1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},
            swords:    {1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},
            cups:      {1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Fantasy and illusion. Choose wisely between dreams and reality.",8:"Walking away from what no longer serves. Seeking deeper meaning.",9:"Emotional fulfillment and contentment. Wishes coming true.",10:"Lasting happiness and harmony. Love overflowing in all forms."},
            wands:     {1:"Creative inspiration and new venture. Pure potential ready to ignite.",2:"Planning and vision. The world is yours to explore.",3:"Expansion and foresight. Leadership with strategic thinking.",4:"Celebration and homecoming. Achievement and stability.",5:"Competition and conflict. Challenges that test resolve.",6:"Victory and recognition. Success earned through effort.",7:"Standing your ground. Defense of values and boundaries.",8:"Swift action and momentum. Things moving quickly forward.",9:"Resilience and persistence. Last push before completion.",10:"Burden of responsibility. Strength to carry what must be carried."}
        };
        this.COURT_CARD_MEANINGS = {
            pentacles: {Page:"Studious and practical messenger. New opportunities in material realm.",Knight:"Reliable and methodical worker. Steady progress toward goals.",Queen:"Nurturing and prosperous provider. Grounded in abundance.",King:"Master of material world. Wealth through wisdom and patience."},
            swords:    {Page:"Curious and vigilant observer. Mental agility and truth-seeking.",Knight:"Swift and direct communicator. Action driven by intellect.",Queen:"Clear-minded and independent thinker. Wisdom through experience.",King:"Authoritative and analytical leader. Justice and mental mastery."},
            cups:      {Page:"Sensitive and intuitive messenger. Emotional openness and creativity.",Knight:"Romantic and idealistic dreamer. Following the heart's calling.",Queen:"Compassionate and emotionally intelligent. Nurturing through love.",King:"Emotionally balanced and wise. Mastery of feelings and relationships."},
            wands:     {Page:"Enthusiastic and adventurous explorer. Creative spark and potential.",Knight:"Passionate and impulsive adventurer. Bold action and courage.",Queen:"Confident and charismatic leader. Warmth and determination.",King:"Visionary and inspirational leader. Creative mastery and enterprise."}
        };
    }

    // ── Daily card (date-seeded) ───────────────────────────────────────────────

    _seededRng(seed) {
        let s = seed >>> 0;
        return function() {
            s += 0x6D2B79F5;
            let t = Math.imul(s ^ s >>> 15, 1 | s);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    _todaySeed() {
        const d = new Date();
        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    }

    _drawDailyCard() {
        const deck = this._buildFullDeck();
        const rng  = this._seededRng(this._todaySeed());
        this.state.dailyCard = deck[Math.floor(rng() * deck.length)];
    }

    _drawAndRenderDaily() {
        this._drawDailyCard();
        const container = document.getElementById(`${this.roomId}DailyCardContainer`);
        if (container && this.state.dailyCard) container.innerHTML = this._buildCardDisplay(this.state.dailyCard);
        const enriched = document.getElementById(`${this.roomId}EnrichedSections`);
        if (enriched && this.state.dailyCard) enriched.innerHTML = this._buildEnrichedSections(this.state.dailyCard);
        requestAnimationFrame(() => this._loadInterpretations());
    }

    // ── Deck & card logic ─────────────────────────────────────────────────────

    _buildFullDeck() {
        return [
            ...Array.from({ length: 22 }, (_, i) => ({ type: 'major', number: i, suit: 'major' })),
            ...this.suits.flatMap(suit =>
                Array.from({ length: 14 }, (_, i) => ({ type: i < 10 ? 'minor' : 'court', number: i + 1, suit }))
            ),
        ];
    }

    _shuffleDeck(deck) {
        const arr = [...deck];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    getCardName(number, suit = 'major') {
        if (suit === 'major') return this.MAJOR_ARCANA_NAMES?.[number] ?? 'The Fool';
        if (number <= 10)     return `${number} of ${this.SUIT_NAMES[suit]}`;
        return `${this.COURT_RANKS[number]} of ${this.SUIT_NAMES[suit]}`;
    }

    getCardMeaning(number, suit = 'major') {
        if (suit === 'major') return this.MAJOR_ARCANA_MEANINGS?.[number] ?? '';
        if (number <= 10)     return this.MINOR_ARCANA_MEANINGS?.[suit]?.[number] ?? '';
        return this.COURT_CARD_MEANINGS?.[suit]?.[this.COURT_RANKS[number]] ?? '';
    }

    // Returns the full enriched card object from tarot-data.json, or null
    getCardData(number, suit = 'major') {
        if (!this._tarotData) return null;
        if (suit === 'major') {
            return this._tarotData.majorArcana.find(c => c.id === number) ?? null;
        }
        if (number <= 10) {
            return (this._tarotData.minorArcana[suit] ?? []).find(c => c.number === number) ?? null;
        }
        const rank = this.COURT_RANKS[number];
        return (this._tarotData.courtCards[suit] ?? []).find(c => c.rank === rank) ?? null;
    }

    getCardImage(number, suit = 'major') {
        const n = String(number).padStart(2, '0');
        if (suit === 'major') return `${this.TAROT_BASE_URL}${n}-${this.getCardName(number,'major').replace(/\s+/g,'')}.webp`;
        const s = suit.charAt(0).toUpperCase() + suit.slice(1);
        return `${this.TAROT_BASE_URL}${s}${n}.webp`;
    }

    _buildCardDisplay(card) {
        const cardData = this.getCardData(card.number, card.suit);
        const subtitle = cardData?.title ?? '';
        return `
        <picture style="display:contents;">
          <source srcset="${this.getCardImage(card.number, card.suit)}" type="image/webp">
          <img src="${this.getCardImage(card.number, card.suit).replace('.webp', '.jpg')}"
               style="width:min(280px,100%);height:auto;border-radius:12px;box-shadow:var(--shadow);display:block;"
               alt="${this.getCardName(card.number, card.suit)}"
               loading="lazy" decoding="async"
               onerror="this.src='${this.TAROT_BASE_URL}CardBacks.webp'">
        </picture>
        <h4 style="font-family:var(--serif);font-size:20px;margin:12px 0 4px;text-align:center;">${this.getCardName(card.number, card.suit)}</h4>
        ${subtitle ? `<p style="font-family:var(--serif);font-size:16px;font-weight:700;color:var(--text);text-align:center;margin:0;letter-spacing:.01em;">${subtitle}</p>` : ''}`;
    }

    // ── Enriched daily sections ───────────────────────────────────────────────

    _buildEnrichedSections(card) {
        const data = this.getCardData(card.number, card.suit);
        if (!data) return ''; // enriched data not loaded yet

        // ── Derive Element & Aspect ──
        const SUIT_ELEMENT = { pentacles:'Earth', swords:'Air', cups:'Water', wands:'Fire' };
        const SUIT_ASPECT  = { pentacles:'Physical', swords:'Mental', cups:'Emotional', wands:'Spiritual' };
        const MAJOR_ELEMENT_MAP = { Air:'Air', Fire:'Fire', Water:'Water', Earth:'Earth' };

        let element = null;
        let aspect  = null;
        if (card.suit === 'major') {
            element = MAJOR_ELEMENT_MAP[data.correspondence] ?? null; // only show if pure element
        } else {
            element = SUIT_ELEMENT[card.suit] ?? null;
            aspect  = SUIT_ASPECT[card.suit] ?? null;
        }

        // ── Keywords pills ──
        const keywords = (data.keywords || [])
            .map(k => `<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${k}</span>`)
            .join('');

        // ── Attribute row ──
        const attrs = [];
        if (data.astrology && data.astrology !== '-') attrs.push({ label: 'Astrology',    value: data.astrology });
        if (element)                                   attrs.push({ label: 'Element',      value: element });
        if (aspect)                                    attrs.push({ label: 'Aspect',       value: aspect });
        if (data.treeOfLife)                           attrs.push({ label: 'Tree of Life', value: data.treeOfLife });
        const attrHTML = attrs.map(a => `
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${a.label}</div>
                <div style="font-size:13px;font-weight:500;">${a.value}</div>
            </div>`).join('');

        // ── Symbols list ──
        const symbolsHTML = (data.symbols || []).map(s => `<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${s}</li>`).join('');

        const roomId = this.roomId;

        return `
        <!-- ── Attributes & Meaning ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">

            <!-- REPRESENTS (moved above keywords) -->
            ${data.narrative ? `
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">
                    ${data.narrative}
                </p>
            </div>` : ''}

            <!-- KEYWORDS -->
            ${keywords ? `
            <div style="margin-bottom:20px;${data.narrative ? 'padding-top:20px;border-top:1px solid var(--border);' : ''}">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${keywords}</div>
            </div>` : ''}

            <!-- ATTRIBUTES ROW -->
            ${attrHTML ? `
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:20px;">
                ${attrHTML}
            </div>` : ''}

            <!-- UPRIGHT / REVERSED TOGGLE -->
            <div style="display:flex;justify-content:center;gap:8px;margin-bottom:16px;">
                <button id="${roomId}UprightBtn"
                    onclick="window.TarotRoom._setMeaningTab('upright')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--accent);background:var(--accent);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">
                    Upright
                </button>
                <button id="${roomId}ReversedBtn"
                    onclick="window.TarotRoom._setMeaningTab('reversed')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;">
                    Reversed
                </button>
            </div>
            <div id="${roomId}MeaningText" style="text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;">
                ${data.upright || ''}
            </div>
            <div id="${roomId}MeaningTextReversed" style="display:none;text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;color:var(--text-muted);">
                ${data.reversed || ''}
            </div>

            <!-- SYMBOLS ACCORDION -->
            ${symbolsHTML ? `
            <details style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span style="display:inline-block;">▶</span> Symbols Guide
                </summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">
                    ${symbolsHTML}
                </ul>
            </details>` : ''}
        </div>

        <!-- ── Today's Question ── -->
        ${(data.mysticalQuestion || data.dailyQuestion) ? `
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">🔮 Today's Question</div>
            ${data.dailyQuestion ? `<p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">${data.dailyQuestion}</p>` : ''}
            ${data.mysticalQuestion ? `<p style="font-size:13px;color:var(--text-muted);margin:10px auto 0;max-width:480px;font-style:italic;">Mystical: ${data.mysticalQuestion}</p>` : ''}
        </div>` : ''}

        <!-- ── Card Journal ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Card Journal</div>
                <button onclick="window.TarotRoom._toggleJournalLog()"
                    id="${roomId}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">
                Look closely at the card. What do you notice? Describe what you see — the characters, their posture, expression, actions. What colors stand out? Any symbols, objects, or small details that catch your eye? How does it make you feel?
            </p>
            <!-- Write form -->
            <div id="${roomId}JournalForm">
                <textarea id="${roomId}JournalInput"
                    placeholder="e.g. A figure stands at the edge of a cliff, looking up… the colors feel warm and golden… I notice a small dog at their feet…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"
                ></textarea>
                <button onclick="window.TarotRoom._saveJournalEntry()"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <!-- Log view (hidden by default) -->
            <div id="${roomId}JournalLog" style="display:none;">
                <div id="${roomId}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>

        <!-- ── Community Interpretations ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Interpretations</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line interpretation of today's card.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${roomId}InterpInput" type="text" maxlength="140"
                    placeholder="One line — what does this card say to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')window.TarotRoom._submitInterpretation()"
                />
                <button onclick="window.TarotRoom._submitInterpretation()"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${roomId}InterpList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading interpretations…</div>
            </div>
        </div>`;
    }

    _setMeaningTab(tab) {
        const upBtn  = document.getElementById(`${this.roomId}UprightBtn`);
        const rvBtn  = document.getElementById(`${this.roomId}ReversedBtn`);
        const upTxt  = document.getElementById(`${this.roomId}MeaningText`);
        const rvTxt  = document.getElementById(`${this.roomId}MeaningTextReversed`);
        if (!upBtn) return;
        if (tab === 'upright') {
            upBtn.style.background = 'var(--accent)'; upBtn.style.color = '#fff'; upBtn.style.borderColor = 'var(--accent)';
            rvBtn.style.background = 'transparent';   rvBtn.style.color = 'var(--text-muted)'; rvBtn.style.borderColor = 'var(--border)';
            upTxt.style.display = ''; rvTxt.style.display = 'none';
        } else {
            rvBtn.style.background = 'var(--accent)'; rvBtn.style.color = '#fff'; rvBtn.style.borderColor = 'var(--accent)';
            upBtn.style.background = 'transparent';   upBtn.style.color = 'var(--text-muted)'; upBtn.style.borderColor = 'var(--border)';
            upTxt.style.display = 'none'; rvTxt.style.display = '';
        }
    }

    // ── Journal ──────────────────────────────────────────────────────────────

    _toggleJournalLog() {
        const logDiv = document.getElementById(`${this.roomId}JournalLog`);
        const formDiv = document.getElementById(`${this.roomId}JournalForm`);
        const btn = document.getElementById(`${this.roomId}JournalLogBtn`);
        if (!logDiv) return;
        const showing = logDiv.style.display !== 'none';
        logDiv.style.display  = showing ? 'none' : '';
        formDiv.style.display = showing ? ''     : 'none';
        btn.textContent = showing ? 'View Log' : 'Write Entry';
        if (!showing) this._loadJournalLog();
    }

    async _saveJournalEntry() {
        const input = document.getElementById(`${this.roomId}JournalInput`);
        const text  = input?.value?.trim();
        if (!text) { Core.showToast('Please write something first'); return; }

        const user  = Core.state.currentUser;
        const card  = this.state.dailyCard;
        const today = new Date().toISOString().slice(0,10);

        try {
            await Core.supabase.from('tarot_reflections').insert({
                user_id:    user?.id,
                card_key:   `${card.suit}-${card.number}`,
                card_name:  this.getCardName(card.number, card.suit),
                date:       today,
                reflection: text,
            });
            input.value = '';
            Core.showToast('Saved to your journal ✨');
        } catch (e) {
            console.warn('[TarotRoom] journal save failed', e);
            Core.showToast('Could not save — please try again');
        }
    }

    async _loadJournalLog() {
        const user    = Core.state.currentUser;
        const listEl  = document.getElementById(`${this.roomId}JournalLogList`);
        if (!listEl || !user?.id) return;
        listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>`;

        try {
            const { data, error } = await Core.supabase
                .from('tarot_reflections')
                .select('id, card_name, date, reflection')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            if (error) throw error;
            if (!data || data.length === 0) {
                listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>`;
                return;
            }

            listEl.innerHTML = data.map(row => `
                <div id="jr-${row.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escHTML(row.card_name || '')} · ${row.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.TarotRoom._editJournalEntry('${row.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.TarotRoom._deleteJournalEntry('${row.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="jr-text-${row.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escHTML(row.reflection)}</div>
                    <div id="jr-edit-${row.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escHTML(row.reflection)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.TarotRoom._saveEditedEntry('${row.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.TarotRoom._cancelEditEntry('${row.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join('');
        } catch (e) {
            console.warn('[TarotRoom] load journal failed', e);
            listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>`;
        }
    }

    _editJournalEntry(id) {
        document.getElementById(`jr-text-${id}`)?.style && (document.getElementById(`jr-text-${id}`).style.display = 'none');
        document.getElementById(`jr-edit-${id}`)?.style && (document.getElementById(`jr-edit-${id}`).style.display = '');
    }

    _cancelEditEntry(id) {
        document.getElementById(`jr-text-${id}`)?.style && (document.getElementById(`jr-text-${id}`).style.display = '');
        document.getElementById(`jr-edit-${id}`)?.style && (document.getElementById(`jr-edit-${id}`).style.display = 'none');
    }

    async _saveEditedEntry(id) {
        const editDiv  = document.getElementById(`jr-edit-${id}`);
        const textarea = editDiv?.querySelector('textarea');
        const newText  = textarea?.value?.trim();
        if (!newText) return;
        try {
            await Core.supabase.from('tarot_reflections').update({ reflection: newText }).eq('id', id);
            const textDiv = document.getElementById(`jr-text-${id}`);
            if (textDiv) textDiv.textContent = newText;
            this._cancelEditEntry(id);
            Core.showToast('Entry updated');
        } catch (e) {
            console.warn('[TarotRoom] edit failed', e);
            Core.showToast('Could not update entry');
        }
    }

    async _deleteJournalEntry(id) {
        try {
            await Core.supabase.from('tarot_reflections').delete().eq('id', id);
            document.getElementById(`jr-${id}`)?.remove();
            Core.showToast('Entry deleted');
        } catch (e) {
            console.warn('[TarotRoom] delete failed', e);
            Core.showToast('Could not delete entry');
        }
    }


    async _submitInterpretation() {
        const input = document.getElementById(`${this.roomId}InterpInput`);
        const text  = input?.value?.trim();
        if (!text) return;

        const user = Core.state.currentUser;
        const card = this.state.dailyCard;
        const today = new Date().toISOString().slice(0,10);

        try {
            await Core.supabase.from('tarot_interpretations').insert({
                user_id:        user?.id,
                display_name:   user?.display_name || user?.username || 'A seeker',
                card_key:       `${card.suit}-${card.number}`,
                date:           today,
                interpretation: text,
            });
            input.value = '';
            await this._loadInterpretations();
            Core.showToast('Shared 🌀');
        } catch (e) {
            console.warn('[TarotRoom] interpretation save failed', e);
            Core.showToast('Could not share — please try again');
        }
    }

    async _loadInterpretations() {
        const card  = this.state.dailyCard;
        const today = new Date().toISOString().slice(0,10);
        const list  = document.getElementById(`${this.roomId}InterpList`);
        if (!list || !card) return;

        // Purge yesterday's (and older) entries — first visitor of the day cleans up silently
        Core.supabase.from('tarot_interpretations').delete().lt('date', today).then(() => {});

        try {
            const { data, error } = await Core.supabase
                .from('tarot_interpretations')
                .select('display_name, interpretation, created_at')
                .eq('card_key', `${card.suit}-${card.number}`)
                .eq('date', today)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (!data || data.length === 0) {
                list.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share an interpretation.</div>`;
                return;
            }

            list.innerHTML = data.map(row => `
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escHTML(row.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escHTML(row.interpretation)}</span>
                </div>`).join('');
        } catch (e) {
            console.warn('[TarotRoom] load interpretations failed', e);
            list.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load interpretations.</div>`;
        }
    }

    _escHTML(str) {
        return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // Override _renderParticipantList to use campfire-participant classes
    // (PracticeRoom base already does this, but we re-declare to be safe)
    _renderParticipantList(listEl, participants) {
        if (!participants.length) {
            listEl.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:8px;">Just you here 🕯️</div>`;
            return;
        }
        listEl.innerHTML = participants.map(p => {
            const profile   = p.profiles || {};
            const userId    = p.user_id || profile.id || '';
            const name      = profile.name      || 'Member';
            const avatarUrl = profile.avatar_url || '';
            const emoji     = profile.emoji      || '';
            const gradient  = Core?.getAvatarGradient?.(userId || name) ?? 'linear-gradient(135deg,#667eea,#764ba2)';
            const inner     = avatarUrl
                ? `<img src="${avatarUrl}" referrerpolicy="no-referrer" style="width:40px;height:40px;min-width:40px;min-height:40px;object-fit:cover;border-radius:50%;display:block;" alt="${name}">`
                : `<span style="color:white;font-weight:600;font-size:13px;">${emoji || name.charAt(0).toUpperCase()}</span>`;
            const bg    = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
            const click = userId ? `onclick="openMemberProfileAboveRoom('${userId}')"` : '';
            return `
            <div class="campfire-participant" ${click} style="${userId ? 'cursor:pointer;' : ''}">
                <div class="campfire-participant-avatar" style="${bg}width:40px;height:40px;min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;">${inner}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${name}</div>
                    <div class="campfire-participant-country">${p.activity || '✨ Available'}</div>
                </div>
            </div>`;
        }).join('');
    }

    drawPersonalCard() {
        if (this.state.personalDrawn) { Core.showToast('You already drew your card'); return; }
        this.state.personalDeck  = this._shuffleDeck(this.state.personalDeck);
        const card = this.state.personalDeck.pop();
        this.state.personalDrawn = true;
        const container = document.getElementById(`${this.roomId}PersonalCardContainer`);
        if (container) container.innerHTML = this._buildCardDisplay(card);
        Core.showToast('Card drawn');
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        this.state.personalDeck = this._buildFullDeck();

        if (this._tarotDataReady) {
            this._drawAndRenderDaily();
        } else {
            this._pendingDailyRender = true;
        }

        this.initializeChat();
        this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`);
        requestAnimationFrame(() => document.querySelector(`#${this.roomId}View .tarot-main`)?.scrollTo(0, 0));
    }

    // ── Overrides ─────────────────────────────────────────────────────────────

    getParticipantText() { return `${this.state.participants} seeking guidance`; }

    // ── UI ────────────────────────────────────────────────────────────────────

    buildBody() {
        return `
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg> Solo Card Learning`)}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTab()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTab()}</div>
                </div>
            </main>
        </div>`;
    }

    _buildDailyTab() {
        return `
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card</h3>
            <div id="${this.roomId}DailyCardContainer" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's card…</div>
            </div>
        </div>
        <!-- Enriched sections injected here after card loads -->
        <div id="${this.roomId}EnrichedSections"></div>
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer('daily', 'Share your thoughts on today\'s card...')}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML('Online Practitioners', `${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`, 'auto')}
        </div>`;
    }

    _buildPersonalTab() {
        return `
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg> Solo Card Learning</h3>
            <div id="${this.roomId}PersonalCardContainer" style="display:flex;flex-direction:column;align-items:center;gap:16px;min-height:200px;justify-content:center;">
                <button id="${this.roomId}DrawBtn" onclick="${this.getClassName()}.drawPersonalCard()"
                        style="padding:16px 32px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:16px;">
                    Draw Your Card
                </button>
            </div>
        </div>`;
    }

    getInstructions() {
        return `
            <p><strong>Daily guidance and personal card draws with community reflection.</strong></p>
            <h3>Two Types of Draws:</h3>
            <ul>
                <li>🌅 <strong>Daily Card</strong> - One shared card for the entire community each day. Resets at midnight.</li>
                <li>✨ <strong>Personal Draw</strong> - Your own card for specific questions.</li>
            </ul>
            <h3>How to Approach:</h3>
            <ul>
                <li>Approach with an open heart and curious mind</li>
                <li>There are no "bad" cards - only lessons and perspectives</li>
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
}

Object.assign(TarotRoom.prototype, ChatMixin);
Object.assign(TarotRoom.prototype, TabRoomMixin);

// Window bridge: preserved for inline onclick handlers
const tarotRoom = new TarotRoom();
window.TarotRoom = tarotRoom;

export { TarotRoom, tarotRoom };
