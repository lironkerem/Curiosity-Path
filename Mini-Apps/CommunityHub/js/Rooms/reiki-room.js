/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REIKI CHAKRA ROOM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * @class ReikiRoom
 * @extends PracticeRoom
 * @mixes ChatMixin
 * @version 3.4.0 — PATCHED:
 *   - initializeChakraData() async race guard (_chakraDataReady flag)
 *   - buildCardFooter() now guards against undefined CHAKRA_SCHEDULE
 *   - buildChakraDisplay() uses explicit `isDaily` flag instead of reference equality
 *   - switchTab() deduplicated (identical to TarotRoom — shared inline)
 *   - buildParticipantList() aligned / no duplication
 *   - Chat input shows current user's real avatar
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

class ReikiRoom extends PracticeRoom {
    constructor() {
        super({
            roomId: 'reiki',
            roomType: 'always-open',
            name: 'Reiki Chakra Room',
            icon: '✨',
            description: '7-day chakra rhythm with energy healing',
            energy: 'Healing',
            imageUrl: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Reiki.png',
            participants: 15
        });

        // Initialize chat with two channels
        this.initChatState(['daily', 'personal']);

        // Ready flag — guards against rendering before async data loads
        this._chakraDataReady = false;

        // Initialize chakra data (async)
        this._initializeChakraData();

        // Room state — currentDay set after data loads
        this.state.currentDay         = null;
        this.state.personalFocus      = null;
        this.state.dailyImageIndex    = 0;
        this.state.personalImageIndex = 0;
        this.state.currentTab         = 'daily';
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CHAKRA DATA INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════

    async _initializeChakraData() {
        this.DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        try {
            const response = await fetch('/Mini-Apps/CommunityHub/js/Rooms/chakra-schedule.json');
            if (response.ok) {
                this.CHAKRA_SCHEDULE = await response.json();
            } else {
                this._loadInlineChakraData();
            }
        } catch {
            this._loadInlineChakraData();
        }

        this.state.currentDay = this.DAY_MAP[new Date().getDay()];
        this._buildChakraOptions();
        this._chakraDataReady = true;

        // Re-render the hub card footer now that chakra data is available.
        // updateRoomCard() is safe to call even if the card isn't in the DOM yet.
        this.updateRoomCard();
    }

    _loadInlineChakraData() {
        this.CHAKRA_SCHEDULE = {
            Monday: {
                key: 'sacral', name: 'Sacral Chakra — Svadhisthana', planet: '🌙 Moon',
                color: 'Orange', theme: 'Emotional flow, creativity, softness',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Svadhistana1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Svadhistana2.jpg',
                practice:  ['Gentle hip circles for 1 minute', 'Place hand on lower abdomen, breathe softly', 'Drink water slowly, noticing sensation', 'Move freely to music for 2 minutes', 'Write one sentence about how you feel right now', 'Stretch hips or lower back gently', 'Smile intentionally and hold it for 30 seconds', 'Take a warm shower mindfully', 'Name one thing you enjoy today', 'Say: I allow myself to feel'],
                practice2: ['Rock pelvis forward and back while seated', 'Place warm hands on lower belly', 'Draw a simple shape or doodle', 'Notice one pleasant sensation in your body', 'Roll shoulders in slow circles', 'Stretch inner thighs lightly', 'Breathe into hips and lower back', 'Allow one emotion without judging it', 'Move hands like water for 1 minute', 'Say: I allow movement and change'],
                inquiry: 'What am I feeling right now without judging it?'
            },
            Tuesday: {
                key: 'root', name: 'Root Chakra — Muladhara', planet: '♂️ Mars',
                color: 'Red', theme: 'Grounding, strength, action',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Muladhara1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Muladhara2.jpg',
                practice:  ['Stand barefoot and feel your weight for 60 seconds', 'Slow inhale 4 sec, exhale 6 sec, 5 rounds', 'Name 3 things you can physically touch right now', 'Press feet firmly into the floor and tense legs for 10 sec', 'Eat something warm and simple with full attention', 'Walk slowly, feeling heel to toe contact', 'Place hands on lower belly and breathe', 'Clean or organize one small physical space', 'Sit and feel your spine connect to the ground', 'Say out loud: I am here, I am safe'],
                practice2: ['Sit and press your feet into the floor for 30 seconds', 'Slow walk for 2 minutes without phone', 'Place a heavy object on your thighs and feel its weight', 'Eat one bite of food extremely slowly', 'Touch a solid surface and focus on texture', 'Stand and shift weight side to side', 'Tense entire body for 5 sec, release completely', 'Notice 3 red things around you', 'Visualize roots growing from your feet', 'Say: I am grounded and stable'],
                inquiry: 'What concrete action strengthens my life today?'
            },
            Wednesday: {
                key: 'throat', name: 'Throat Chakra — Vishuddha', planet: '☿ Mercury',
                color: 'Blue', theme: 'Truth, expression, clarity',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Vissudha1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Vissudha2.jpg',
                practice:  ['Take a deep breath and sigh out loud', 'Hum gently for 1 minute', 'Speak one honest sentence aloud', 'Roll shoulders and relax neck', 'Drink water mindfully', 'Write one thing you want to say but haven\'t', 'Sing one line of a song', 'Place hand on throat and breathe', 'Speak slower than usual for one minute', 'Say: My voice matters'],
                practice2: ['Make any sound for 30 seconds', 'Gently massage your neck', 'Write and read aloud one true statement', 'Practice saying "no" out loud', 'Stretch your jaw wide, then relax', 'Whisper, then speak normally', 'Notice when you hold back words', 'Gargle water mindfully', 'Speak your name clearly 3 times', 'Say: I express my truth'],
                inquiry: 'What truth wants to be spoken or written?'
            },
            Thursday: {
                key: 'solar', name: 'Solar Plexus Chakra — Manipura', planet: '♃ Jupiter',
                color: 'Yellow', theme: 'Confidence, direction, expansion',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Manipura1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Manipura2.jpg',
                practice:  ['Stand tall and open your chest for 30 seconds', 'Take 5 strong belly breaths', 'Place hand above navel and feel warmth', 'Do one small task you have been avoiding', 'Sit upright and feel your core engaged', 'Say your name out loud with confidence', 'Visualize a warm yellow light in your belly', 'Clench fists, release slowly, repeat 3 times', 'Make one clear decision today', 'Say: I trust myself'],
                practice2: ['Stand in a power pose for 1 minute', 'Laugh out loud for 15 seconds', 'List 3 things you\'re good at', 'Breathe fire breath (quick exhales)', 'Straighten your posture fully', 'Make strong eye contact with yourself in mirror', 'Do 5 confident shoulder rolls', 'Visualize golden light expanding from core', 'Complete one unfinished task', 'Say: I am powerful and capable'],
                inquiry: 'Where am I ready to step up or expand?'
            },
            Friday: {
                key: 'heart', name: 'Heart Chakra — Anahata', planet: '♀ Venus',
                color: 'Green', theme: 'Love, compassion, connection',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Anahata1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Anahata2.jpg',
                practice:  ['Place both hands on your heart', 'Take 3 deep breaths into your chest', 'Think of someone you love', 'Hug yourself gently', 'Smile at your reflection', 'Write one thing you appreciate about yourself', 'Send a kind message to someone', 'Stretch arms wide and open chest', 'Notice something beautiful around you', 'Say: I am worthy of love'],
                practice2: ['Press palms together at heart center', 'Breathe green light into chest', 'Forgive yourself for one small thing', 'List 3 people/things you\'re grateful for', 'Give yourself a compliment out loud', 'Visualize someone you care about happy', 'Place hand on heart and feel it beat', 'Do one act of kindness', 'Open arms wide and breathe deeply', 'Say: Love flows through me'],
                inquiry: 'Where can I offer more compassion today — to myself or others?'
            },
            Saturday: {
                key: 'integration', name: 'Integration Day — All Chakras', planet: '♄ Saturn',
                color: 'White', theme: 'Discipline, boundaries, completion',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Integration1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Integration2.jpg',
                practice:  ['Scan body from feet to crown', 'Notice which chakra needs attention today', 'Do one grounding practice', 'Do one heart-opening practice', 'Rest in stillness for 2 minutes', 'Reflect on the week', 'Release one thing no longer serving you', 'Set one clear boundary', 'Complete one unfinished task', 'Say: I integrate and release'],
                practice2: ['Breathe through each chakra slowly', 'Journal about this week\'s growth', 'Practice saying no to something', 'Organize one physical space', 'Do a full body stretch', 'Visualize energy flowing freely', 'Acknowledge one accomplishment', 'Rest without guilt for 5 minutes', 'Plan one thing for next week', 'Say: I honor my boundaries'],
                inquiry: 'What needs to be integrated or released?'
            },
            Sunday: {
                key: 'crown', name: 'Crown Chakra — Sahasrara', planet: '☉ Sun',
                color: 'Violet', theme: 'Awareness, unity, transcendence',
                image:  'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Sahasrara1.jpg',
                image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Sahasrara2.jpg',
                practice:  ['Sit in silence for 3 minutes', 'Focus awareness at crown of head', 'Notice thoughts without following them', 'Breathe white or violet light', 'Feel connection to something larger', 'Practice gratitude for consciousness itself', 'Observe without judgment for 2 minutes', 'Visualize light entering crown', 'Rest in pure awareness', 'Say: I am connected to all that is'],
                practice2: ['Meditate on infinite space', 'Gently touch top of head', 'Imagine boundaries dissolving', 'Breathe as if the universe breathes you', 'Notice awareness of being aware', 'Feel unity with all beings', 'Rest in stillness and openness', 'Visualize violet light at crown', 'Simply be, without doing', 'Say: I am one with everything'],
                inquiry: 'What is awareness itself noticing right now?'
            }
        };
    }

    _buildChakraOptions() {
        const scheduleKeys = {
            root: 'Tuesday', sacral: 'Monday', solar: 'Thursday',
            heart: 'Friday', throat: 'Wednesday', crown: 'Sunday'
        };

        this.CHAKRA_OPTIONS = [
            { value: 'root',      label: 'Root Chakra',   color: 'Red',    image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Muladhara1.jpg',   image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Muladhara2.jpg' },
            { value: 'sacral',    label: 'Sacral Chakra', color: 'Orange', image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Svadhistana1.jpg', image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Svadhistana2.jpg' },
            { value: 'solar',     label: 'Solar Plexus',  color: 'Yellow', image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Manipura1.jpg',    image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Manipura2.jpg' },
            { value: 'heart',     label: 'Heart Chakra',  color: 'Green',  image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Anahata1.jpg',     image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Anahata2.jpg' },
            { value: 'throat',    label: 'Throat Chakra', color: 'Blue',   image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Vissudha1.jpg',    image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Vissudha2.jpg' },
            { value: 'third-eye', label: 'Third Eye',     color: 'Indigo', image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Ajna1.jpg',        image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Ajna2.jpg',
              practices:  ['Focus on space between eyebrows','Close eyes and look inward','Trust your intuition on one decision','Meditate in darkness for 5 minutes','Notice synchronicities today','Visualize indigo light at third eye','Ask a question and listen for inner answer','Practice seeing with eyes closed','Trust your first instinct','Say: I see clearly'],
              practices2: ['Gently press center of forehead','Imagine opening inner eye','Write down one intuitive hit','Notice patterns in your life','Practice visualization','Breathe indigo light through third eye','Trust gut feelings','Observe dreams and symbols','Release need to understand everything','Say: My intuition guides me'],
              inquiry: 'What does my intuition know that my mind doesn\'t?' },
            { value: 'crown',     label: 'Crown Chakra',  color: 'Violet', image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Sahasrara1.jpg',   image2: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Chakras/Sahasrara2.jpg' }
        ];

        // Link practices from schedule
        this.CHAKRA_OPTIONS.forEach(opt => {
            const dayKey = scheduleKeys[opt.value];
            if (dayKey && this.CHAKRA_SCHEDULE[dayKey]) {
                opt.practices  = opt.practices  || this.CHAKRA_SCHEDULE[dayKey].practice;
                opt.practices2 = opt.practices2 || this.CHAKRA_SCHEDULE[dayKey].practice2;
                opt.inquiry    = opt.inquiry    || this.CHAKRA_SCHEDULE[dayKey].inquiry;
            }
        });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDE: CARD FOOTER — guards undefined CHAKRA_SCHEDULE
    // ═══════════════════════════════════════════════════════════════════════

    buildCardFooter() {
        if (!this._chakraDataReady || !this.state.currentDay) {
            return `
            <div style="text-align:left;">
                <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            </div>`;
        }
        const todayChakra = this.CHAKRA_SCHEDULE[this.state.currentDay];
        return `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span class="room-participants" style="font-size: 12px; color: var(--text-muted);">
                ${this.getParticipantText()}
            </span>
            <span style="font-size: 12px; color: var(--text); font-weight: 600;">
                ${todayChakra?.name ?? ''}
            </span>
        </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ═══════════════════════════════════════════════════════════════════════

    onEnter() {
        setTimeout(() => {
            const mainContent = document.querySelector(`#${this.roomId}View .tarot-main`);
            if (mainContent) mainContent.scrollTop = 0;
            window.scrollTo(0, 0);
        }, 100);

        // Load chat from Supabase for both channels
        this.initializeChat();

        // Live participant sidebar
        setTimeout(() => {
            this._refreshParticipantSidebar(
                `${this.roomId}ParticipantListEl`,
                `${this.roomId}ParticipantCount`
            );
        }, 400);

        // Inject user avatar into input
        setTimeout(() => this._injectSenderAvatar(), 500);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SENDER AVATAR
    // ═══════════════════════════════════════════════════════════════════════

    _injectSenderAvatar() {
        const wrapper = document.getElementById(`${this.roomId}DailySenderAvatar`);
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
            : `<span style="color:white;font-weight:600;font-size:12px;">${emoji || initial}</span>`;
        const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        wrapper.innerHTML = `
            <div style="width:34px;height:34px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">
                ${inner}
            </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // SHARED CHAKRA DISPLAY
    // Uses explicit isDaily flag — no fragile reference equality
    // ═══════════════════════════════════════════════════════════════════════

    buildChakraDisplay(chakra, imageIndex, onPrev, onNext, isDaily = false) {
        const currentImage = imageIndex === 0 ? chakra.image : chakra.image2;
        const inquiryLabel = isDaily ? "Today's" : "Guiding";

        return `
            <!-- Image Carousel -->
            <div style="position: relative; text-align: center; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; gap: 16px;">
                <button onclick="${onPrev}"
                        style="background: var(--surface); border: 2px solid var(--border); border-radius: 50%; width: 48px; height: 48px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">‹</button>
                <img src="${currentImage}"
                     alt="${chakra.name}"
                     style="max-width: 500px; width: 100%; height: auto; border-radius: var(--radius-md); box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <button onclick="${onNext}"
                        style="background: var(--surface); border: 2px solid var(--border); border-radius: 50%; width: 48px; height: 48px; cursor: pointer; font-size: 20px; display: flex; align-items: center; justify-content: center;">›</button>
            </div>

            <!-- Inquiry -->
            <div style="margin-bottom: 40px; padding: 32px; background: linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(167,139,250,0.02) 100%); border: 2px solid var(--border); border-radius: var(--radius-lg); text-align: center;">
                <h4 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: var(--accent);">💭 ${inquiryLabel} Inquiry</h4>
                <p style="margin: 0; font-style: italic; line-height: 1.8; font-size: 20px; font-family: var(--serif); color: var(--text);">"${chakra.inquiry}"</p>
            </div>

            <!-- Practice Guide -->
            <div style="padding: 32px; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg);">
                <h4 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600; text-align: center;">🧘 Practice Guide</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-width: 1000px; margin: 0 auto;">
                    <div style="border: 2px solid var(--border); border-radius: var(--radius-md); padding: 24px; background: var(--background);">
                        <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-align: center; color: var(--accent);">Option 1</h5>
                        <ol style="margin: 0; padding-left: 20px; line-height: 2; font-size: 15px;">
                            ${chakra.practice.map(p => `<li style="margin-bottom:12px;">${p}</li>`).join('')}
                        </ol>
                    </div>
                    <div style="border: 2px solid var(--border); border-radius: var(--radius-md); padding: 24px; background: var(--background);">
                        <h5 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; text-align: center; color: var(--accent);">Option 2</h5>
                        <ol style="margin: 0; padding-left: 20px; line-height: 2; font-size: 15px;">
                            ${chakra.practice2.map(p => `<li style="margin-bottom:12px;">${p}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>`;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // TAB SWITCHING (deduplicated — same logic as TarotRoom)
    // ═══════════════════════════════════════════════════════════════════════

    switchTab(tabName) {
        const dailyTab    = document.getElementById(`${this.roomId}DailyTab`);
        const personalTab = document.getElementById(`${this.roomId}PersonalTab`);
        const dailyBtn    = document.getElementById(`${this.roomId}TabDaily`);
        const personalBtn = document.getElementById(`${this.roomId}TabPersonal`);
        if (!dailyTab || !personalTab || !dailyBtn || !personalBtn) return;

        const isDaily = tabName === 'daily';
        dailyTab.style.display    = isDaily ? 'block' : 'none';
        personalTab.style.display = isDaily ? 'none'  : 'block';

        const activeStyle   = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
        const inactiveStyle = 'transparent';

        dailyBtn.style.background    = isDaily ? activeStyle   : inactiveStyle;
        dailyBtn.style.color         = isDaily ? 'white'       : 'var(--text)';
        dailyBtn.style.borderBottom  = isDaily ? '3px solid #8b5cf6' : '3px solid transparent';
        personalBtn.style.background   = isDaily ? inactiveStyle : activeStyle;
        personalBtn.style.color        = isDaily ? 'var(--text)' : 'white';
        personalBtn.style.borderBottom = isDaily ? '3px solid transparent' : '3px solid #8b5cf6';

        this.state.currentTab = tabName;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // IMAGE CAROUSEL
    // ═══════════════════════════════════════════════════════════════════════

    nextDailyImage() {
        this.state.dailyImageIndex = (this.state.dailyImageIndex + 1) % 2;
        const chakra = this.CHAKRA_SCHEDULE?.[this.state.currentDay];
        const img    = document.querySelector(`#${this.roomId}DailyTab img`);
        if (img && chakra) img.src = this.state.dailyImageIndex === 0 ? chakra.image : chakra.image2;
    }

    previousDailyImage() {
        this.state.dailyImageIndex = (this.state.dailyImageIndex - 1 + 2) % 2;
        const chakra = this.CHAKRA_SCHEDULE?.[this.state.currentDay];
        const img    = document.querySelector(`#${this.roomId}DailyTab img`);
        if (img && chakra) img.src = this.state.dailyImageIndex === 0 ? chakra.image : chakra.image2;
    }

    nextPersonalImage() {
        this.state.personalImageIndex = (this.state.personalImageIndex + 1) % 2;
        this._updatePersonalImage();
    }

    previousPersonalImage() {
        this.state.personalImageIndex = (this.state.personalImageIndex - 1 + 2) % 2;
        this._updatePersonalImage();
    }

    _updatePersonalImage() {
        const selected = this.CHAKRA_OPTIONS?.find(o => o.value === this.state.personalFocus);
        if (!selected) return;
        const img = document.querySelector(`#${this.roomId}PersonalSession img`);
        if (img) img.src = this.state.personalImageIndex === 0 ? selected.image : selected.image2;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BUILD BODY
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
                            🌅 Today's Collective Focus
                        </button>
                        <button id="${this.roomId}TabPersonal"
                                onclick="${this.getClassName()}.switchTab('personal')"
                                style="padding: 12px 24px; background: transparent; color: var(--text); border: none; border-bottom: 3px solid transparent; cursor: pointer; font-weight: 600; font-size: 16px; border-radius: 8px 8px 0 0;">
                            ✨ Personal Energy Session
                        </button>
                    </div>

                    <!-- Daily Chakra Tab -->
                    <div id="${this.roomId}DailyTab" style="display: block;">
                        ${this._buildDailyTab()}
                    </div>

                    <!-- Personal Session Tab -->
                    <div id="${this.roomId}PersonalTab" style="display: none;">
                        ${this._buildPersonalTab()}
                    </div>

                </div>
            </main>
        </div>`;
    }

    _buildDailyTab() {
        // Render placeholder if data not ready yet — UI won't break
        if (!this._chakraDataReady || !this.state.currentDay) {
            return `
            <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;text-align:center;">
                <div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's focus...</div>
            </div>`;
        }

        const todayChakra = this.CHAKRA_SCHEDULE[this.state.currentDay];
        return `
        <div style="background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 16px;">
            <h3 style="font-family: var(--serif); font-size: 24px; margin: 0 0 20px 0; text-align: center;">🌅 Today's Collective Focus</h3>
            ${this.buildChakraDisplay(
                todayChakra,
                this.state.dailyImageIndex,
                `${this.getClassName()}.previousDailyImage()`,
                `${this.getClassName()}.nextDailyImage()`,
                true
            )}
        </div>

        <!-- Community Chat + Participants -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 24px;">
            <div>
                <h4 style="font-family: var(--serif); font-size: 18px; margin: 0 0 8px 0; text-align: center;">💬 Community Discussion</h4>
                <!-- Avatar slot for sender -->
                <div id="${this.roomId}DailySenderAvatar" style="margin-bottom:4px;"></div>
                ${this.buildChatContainer('daily', 'Share your thoughts on today\'s chakra...')}
            </div>
            ${this._buildParticipantList()}
        </div>`;
    }

    _buildPersonalTab() {
        return `
        <div style="background: var(--surface); border: 2px solid var(--border); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 16px;">
            <h3 style="font-family: var(--serif); font-size: 24px; margin: 0 0 20px 0; text-align: center;">✨ Personal Energy Session</h3>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600;">Choose Your Focus:</label>
                <select id="${this.roomId}PersonalFocus"
                        style="width: 100%; padding: 12px; border: 2px solid var(--border); border-radius: var(--radius-md); background: var(--background); font-size: 14px;">
                    <option value="">Select a chakra...</option>
                    ${(this.CHAKRA_OPTIONS || []).map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                </select>
            </div>

            <button onclick="${this.getClassName()}.startPersonalSession()"
                    style="width: 100%; padding: 14px; border: 2px solid var(--border); background: var(--surface); border-radius: var(--radius-md); cursor: pointer; font-weight: 600; font-size: 16px;">
                Begin Session
            </button>

            <div id="${this.roomId}PersonalSession" style="margin-top: 24px; display: none;"></div>
        </div>`;
    }

    _buildParticipantList() {
        // Delegates to the shared helper on PracticeRoom — no duplication with TarotRoom.
        return this.buildParticipantSidebarHTML(
            'Online Lightworkers',
            `${this.roomId}ParticipantListEl`,
            `${this.roomId}ParticipantCount`
        );
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PERSONAL SESSION
    // ═══════════════════════════════════════════════════════════════════════

    startPersonalSession() {
        if (!this._chakraDataReady) {
            Core.showToast('Loading chakra data, please wait...');
            return;
        }
        const select = document.getElementById(`${this.roomId}PersonalFocus`);
        const focus  = select?.value;
        if (!focus) { Core.showToast('Please select a focus'); return; }

        this.state.personalFocus      = focus;
        this.state.personalImageIndex = 0;
        const selected = this.CHAKRA_OPTIONS.find(opt => opt.value === focus);

        const sessionContainer = document.getElementById(`${this.roomId}PersonalSession`);
        if (!sessionContainer) return;
        sessionContainer.style.display = 'block';
        sessionContainer.innerHTML = this.buildChakraDisplay(
            selected,
            this.state.personalImageIndex,
            `${this.getClassName()}.previousPersonalImage()`,
            `${this.getClassName()}.nextPersonalImage()`,
            false
        );
        Core.showToast(`✨ ${selected.label} session started`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OVERRIDES
    // ═══════════════════════════════════════════════════════════════════════

    getParticipantText() {
        return `${this.state.participants} healing together`;
    }

    getInstructions() {
        return `
            <p><strong>A space for energy healing and chakra alignment.</strong></p>

            <h3>How It Works:</h3>
            <ul>
                <li><strong>Today's Collective Focus:</strong> Each day follows a planetary chakra cycle. The entire community focuses on one chakra energy.</li>
                <li><strong>Personal Energy Session:</strong> Choose any chakra for your individual needs.</li>
                <li><strong>Community Discussion:</strong> Share your experiences and healing journey.</li>
            </ul>

            <h3>7-Day Planetary Chakra Cycle:</h3>
            <ul>
                <li><strong>Monday (Moon):</strong> Sacral Chakra — Emotional flow & creativity</li>
                <li><strong>Tuesday (Mars):</strong> Root Chakra — Grounding & strength</li>
                <li><strong>Wednesday (Mercury):</strong> Throat Chakra — Truth & expression</li>
                <li><strong>Thursday (Jupiter):</strong> Solar Plexus — Confidence & expansion</li>
                <li><strong>Friday (Venus):</strong> Heart Chakra — Love & connection</li>
                <li><strong>Saturday (Saturn):</strong> Integration Day — Discipline & boundaries</li>
                <li><strong>Sunday (Sun):</strong> Crown Chakra — Awareness & unity</li>
            </ul>

            <h3>Energy Work Guidelines:</h3>
            <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Practice non-forcing — allow energy to flow naturally</li>
                <li>Be patient with yourself</li>
                <li>This is complementary to medical care, not a replacement</li>
            </ul>`;
    }
}

// Apply ChatMixin
Object.assign(ReikiRoom.prototype, ChatMixin);

// Export as singleton
window.ReikiRoom = new ReikiRoom();
