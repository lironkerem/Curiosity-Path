/*** REIKI CHAKRA ROOM
 * @extends PracticeRoom
 * @mixes ChatMixin, TabRoomMixin
 */

import { PracticeRoom } from './PracticeRoom.js';
import { ChatMixin } from './mixins/ChatMixin.js';
import { TabRoomMixin } from './mixins/TabRoomMixin.js';
import { Core } from '../core.js';
import { CommunityDB } from '../community-supabase.js';

class ReikiRoom extends PracticeRoom {
    constructor() {
        super({
            roomId:      'reiki',
            roomType:    'always-open',
            name:        'Reiki Chakra Room',
            icon:        '✨',
            description: '7-day chakra rhythm with energy healing',
            energy:      'Healing',
            imageUrl:    '/public/Community/Reiki.webp',
            participants: 15,
        });

        this.initChatState(['daily', 'personal']);

        this._chakraDataReady         = false;
        this.state.currentDay         = null;
        this.state.personalFocus      = null;
        this.state.dailyImageIndex    = 0;
        this.state.personalImageIndex = 0;
        this.state.currentTab         = 'daily';

        this._initializeChakraData();
    }

    // ── Chakra data ───────────────────────────────────────────────────────────

    async _initializeChakraData() {
        this.DAY_MAP = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        try {
            const response = await fetch('/Mini-Apps/CommunityHub/js/Rooms/chakra-data.json');
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
        this.updateRoomCard();
    }

    _loadInlineChakraData() {
        this.CHAKRA_SCHEDULE = {
            Monday: {
                key: 'sacral', name: 'Sacral Chakra - Svadhisthana', planet: '🌙 Moon',
                color: 'Orange', theme: 'Emotional flow, creativity, softness',
                element: 'Water', sense: 'Taste', symbol: 'Lotus with 6 petals',
                endocrineGland: 'Gonads (Sex glands)', bodyAreas: 'Ovaries, testes, prostate, sexual organs, spleen, uterus, urinary bladder',
                location: 'Two fingers below the navel.',
                visualization: 'Sunrise, swimming in pure natural waters on full moon',
                keywords: ['Emotions', 'creativity', 'flow', 'sexuality', 'relationships', 'self-worth', 'desires', 'empathy'],
                roleAndPurpose: 'The second chakra is the center of our emotions and creativity. Through it, we begin to understand our responses to both our internal and external worlds. From here, we create through emotion and express it creatively to the outside world.',
                commonIssues: ['Emotional repression', 'Dependency on others', 'Creative blocks', 'Kidney problems', 'Fertility issues'],
                fundamentalTruths: ['I feel!', 'Honor your neighbors!'],
                guidedReflections: ['Do I allow myself to fully feel my emotions, or do I suppress them to appear in control?', 'In what areas of life do I resist flow and spontaneity, and why?', 'How often do I create for the joy of creating, rather than for validation or outcome?'],
                image:  '/public/Community/Chakras/Svadhistana1.webp',
                image2: '/public/Community/Chakras/Svadhistana2.webp',
                practice:  ['Gentle hip circles for 1 minute', 'Place hand on lower abdomen, breathe softly', 'Drink water slowly, noticing sensation', 'Move freely to music for 2 minutes', 'Write one sentence about how you feel right now', 'Stretch hips or lower back gently', 'Smile intentionally and hold it for 30 seconds', 'Take a warm shower mindfully', 'Name one thing you enjoy today', 'Say: I allow myself to feel'],
                practice2: ['Rock pelvis forward and back while seated', 'Place warm hands on lower belly', 'Draw a simple shape or doodle', 'Notice one pleasant sensation in your body', 'Roll shoulders in slow circles', 'Stretch inner thighs lightly', 'Breathe into hips and lower back', 'Allow one emotion without judging it', 'Move hands like water for 1 minute', 'Say: I allow movement and change'],
                inquiry: 'What am I feeling right now without judging it?'
            },
            Tuesday: {
                key: 'root', name: 'Root Chakra - Muladhara', planet: '♂️ Mars',
                color: 'Bright red', theme: 'Grounding, strength, action',
                element: 'Earth', sense: 'Smell', symbol: 'Lotus with 4 petals',
                endocrineGland: 'Adrenal glands', bodyAreas: 'Kidneys, spine, large intestine, legs, bones',
                location: 'At the base of the spine, between the genitals and the anus.',
                visualization: 'Circulating blood, flowing lava at the center of the earth',
                keywords: ['Physical', 'grounding', 'survival', 'security', 'stability', 'family', 'tribe', 'culture'],
                roleAndPurpose: 'The role of the first chakra is the survival instinct in the physical world. It is connected to our primal emotions and programmed by the family, friends, and society in which we live.',
                commonIssues: ['Addictions and uncontrollable desires', 'Nervous system problems', 'Poor blood circulation', 'Money and career issues'],
                fundamentalTruths: ['I exist!', 'All is one!'],
                guidedReflections: ['Do I feel safe existing as I am, without needing to prove or justify my worth?', 'Where in my life do I still operate out of fear of not having enough?', 'Do I trust life to provide for me, or do I feel I must constantly fight for survival?'],
                image:  '/public/Community/Chakras/Muladhara1.webp',
                image2: '/public/Community/Chakras/Muladhara2.webp',
                practice:  ['Stand barefoot and feel your weight for 60 seconds', 'Slow inhale 4 sec, exhale 6 sec, 5 rounds', 'Name 3 things you can physically touch right now', 'Press feet firmly into the floor and tense legs for 10 sec', 'Eat something warm and simple with full attention', 'Walk slowly, feeling heel to toe contact', 'Place hands on lower belly and breathe', 'Clean or organize one small physical space', 'Sit and feel your spine connect to the ground', 'Say out loud: I am here, I am safe'],
                practice2: ['Sit and press your feet into the floor for 30 seconds', 'Slow walk for 2 minutes without phone', 'Place a heavy object on your thighs and feel its weight', 'Eat one bite of food extremely slowly', 'Touch a solid surface and focus on texture', 'Stand and shift weight side to side', 'Tense entire body for 5 sec, release completely', 'Notice 3 red things around you', 'Visualize roots growing from your feet', 'Say: I am grounded and stable'],
                inquiry: 'What concrete action strengthens my life today?'
            },
            Wednesday: {
                key: 'throat', name: 'Throat Chakra - Vishuddha', planet: '☿ Mercury',
                color: 'Light blue, silver, blue-green', theme: 'Truth, expression, clarity',
                element: 'Ether (Space)', sense: 'Hearing', symbol: 'Lotus with 16 petals',
                endocrineGland: 'Thyroid', bodyAreas: 'Throat, bronchi, voice mechanism, lungs, digestive tract, mouth',
                location: 'Throat.',
                visualization: 'Blue clear skies, sky reflections on calm water',
                keywords: ['Truth', 'courage', 'voice', 'communication', 'judgment', 'acceptance', 'trust'],
                roleAndPurpose: 'The fifth chakra is our communication center and the foundation for creating our future and self-protection. Through it, we express our thoughts, feelings, and what we want and need.',
                commonIssues: ['Inability to say "no" or "yes"', 'Feeling victimized', 'Lack of assertiveness', 'Throat and jaw problems'],
                fundamentalTruths: ['I feel, think, and express with love!', 'Surrender your will to the divine will!'],
                guidedReflections: ['Do I express my truth openly, or do I censor myself to avoid conflict?', 'How often do I truly listen — not just hear — what others are saying?', 'What unspoken truths have been living in my throat, waiting to be released?'],
                image:  '/public/Community/Chakras/Vissudha1.webp',
                image2: '/public/Community/Chakras/Vissudha2.webp',
                practice:  ['Take a deep breath and sigh out loud', 'Hum gently for 1 minute', 'Speak one honest sentence aloud', 'Roll shoulders and relax neck', 'Drink water mindfully', 'Write one thing you want to say but haven\'t', 'Sing one line of a song', 'Place hand on throat and breathe', 'Speak slower than usual for one minute', 'Say: My voice matters'],
                practice2: ['Make any sound for 30 seconds', 'Gently massage your neck', 'Write and read aloud one true statement', 'Practice saying "no" out loud', 'Stretch your jaw wide, then relax', 'Whisper, then speak normally', 'Notice when you hold back words', 'Gargle water mindfully', 'Speak your name clearly 3 times', 'Say: I express my truth'],
                inquiry: 'What truth wants to be spoken or written?'
            },
            Thursday: {
                key: 'third-eye', name: 'Third Eye Chakra - Ajna', planet: '♃ Jupiter',
                color: 'Bright dark blue, transparent indigo', theme: 'Intuition, vision, insight',
                element: 'Light', sense: 'All senses including supernatural senses', symbol: 'Lotus with 96 petals',
                endocrineGland: 'Pituitary', bodyAreas: 'Lower brain, left eye, ears, nose, nervous system',
                location: 'Center of the forehead, one finger above the eyebrows.',
                visualization: 'Starry night skies, celestial bodies, galaxies',
                keywords: ['Imagination', 'visualization', 'intuition', 'manifestation', 'creation', 'vision'],
                roleAndPurpose: 'The sixth chakra is our center of vision — both inner and outer. Through it, we see reality and broadcast images and visions that represent our reality. It is responsible for our good mood and behavior through influence on hormones secreted in the brain.',
                commonIssues: ['Difficulty planning the future', 'Underdeveloped imagination', 'Vision problems', 'Hormonal imbalance'],
                fundamentalTruths: ['I feel, think, and express my vision with love!', 'Seek only the truth!'],
                guidedReflections: ['How clearly do I see my life direction right now?', 'Do I trust my intuition as a valid source of truth, or do I dismiss it?', 'How connected do I feel to my inner wisdom and higher guidance?'],
                image:  '/public/Community/Chakras/Ajna1.webp',
                image2: '/public/Community/Chakras/Ajna2.webp',
                practice:  ['Focus on space between eyebrows', 'Close eyes and look inward', 'Trust your intuition on one decision', 'Meditate in darkness for 5 minutes', 'Notice synchronicities today', 'Visualize indigo light at third eye', 'Ask a question and listen for inner answer', 'Practice seeing with eyes closed', 'Trust your first instinct', 'Say: I see clearly'],
                practice2: ['Gently press center of forehead', 'Imagine opening inner eye', 'Write down one intuitive hit', 'Notice patterns in your life', 'Practice visualization', 'Breathe indigo light through third eye', 'Trust gut feelings', 'Observe dreams and symbols', 'Release need to understand everything', 'Say: My intuition guides me'],
                inquiry: 'What does my intuition know that my mind doesn\'t?'
            },
            Friday: {
                key: 'heart', name: 'Heart Chakra - Anahata', planet: '♀ Venus',
                color: 'Bright green, bright pink, gold', theme: 'Love, compassion, connection',
                element: 'Air', sense: 'Touch', symbol: 'Lotus with 12 petals',
                endocrineGland: 'Thymus', bodyAreas: 'Heart, circulatory system, arms, hands',
                location: 'Center of the chest, heart area.',
                visualization: 'Green and blooming nature, plant blossoms, pink and endless skies',
                keywords: ['Universal love', 'compassion', 'mercy', 'giving', 'balance', 'calm', 'integration'],
                roleAndPurpose: 'The fourth chakra is our heart center and the point of balance. Its role is to combine the lessons of the other chakras, blend them with universal love and compassion, and radiate this energy outward from a stable place.',
                commonIssues: ['Difficulties in relationships', 'Inability to give and receive love', 'Heart problems', 'Lung problems'],
                fundamentalTruths: ['I feel and think with love!', 'Love is the divine power!'],
                guidedReflections: ['Do I allow myself to receive love as easily as I give it?', 'How easily do I forgive myself and others?', 'What would change if I chose to let love, not fear, guide every decision?'],
                image:  '/public/Community/Chakras/Anahata1.webp',
                image2: '/public/Community/Chakras/Anahata2.webp',
                practice:  ['Place both hands on your heart', 'Take 3 deep breaths into your chest', 'Think of someone you love', 'Hug yourself gently', 'Smile at your reflection', 'Write one thing you appreciate about yourself', 'Send a kind message to someone', 'Stretch arms wide and open chest', 'Notice something beautiful around you', 'Say: I am worthy of love'],
                practice2: ['Press palms together at heart center', 'Breathe green light into chest', 'Forgive yourself for one small thing', 'List 3 people/things you\'re grateful for', 'Give yourself a compliment out loud', 'Visualize someone you care about happy', 'Place hand on heart and feel it beat', 'Do one act of kindness', 'Open arms wide and breathe deeply', 'Say: Love flows through me'],
                inquiry: 'Where can I offer more compassion today - to myself or others?'
            },
            Saturday: {
                key: 'crown', name: 'Crown Chakra - Sahasrara', planet: '♄ Saturn',
                color: 'Pure white, bright light, purple', theme: 'Awareness, unity, transcendence',
                element: 'Beyond element', sense: 'Beyond sense', symbol: 'Lotus with 1,000 petals',
                endocrineGland: 'Pineal', bodyAreas: 'Upper brain, right eye, cerebral cortex, central nervous system',
                location: 'Top of the head, crown of the skull.',
                visualization: 'Peak of a very high snowy mountain',
                keywords: ['Cosmic consciousness', 'unity', 'wholeness', 'transcendence', 'inspiration', 'spiritual development'],
                roleAndPurpose: 'The seventh chakra is our divinity center. It centralizes streams of high spiritual energy and our role and mission in this life. It also reminds us that we are one with the source and all spiritual beings.',
                commonIssues: ['Lack of direction', 'Dizziness', 'Feelings of disconnection', 'Deep depression', 'Learning disabilities'],
                fundamentalTruths: ['I feel, think, and express the vision of a higher purpose with love!', 'Live in the moment!'],
                guidedReflections: ['How connected do I feel to a higher source or divine presence in my daily life?', 'Do I trust that my life has a meaningful purpose?', 'How can I embody the awareness that I am not separate from the universe?'],
                image:  '/public/Community/Chakras/Sahasrara1.webp',
                image2: '/public/Community/Chakras/Sahasrara2.webp',
                practice:  ['Sit in silence for 3 minutes', 'Focus awareness at crown of head', 'Notice thoughts without following them', 'Breathe white or violet light', 'Feel connection to something larger', 'Practice gratitude for consciousness itself', 'Observe without judgment for 2 minutes', 'Visualize light entering crown', 'Rest in pure awareness', 'Say: I am connected to all that is'],
                practice2: ['Meditate on infinite space', 'Gently touch top of head', 'Imagine boundaries dissolving', 'Breathe as if the universe breathes you', 'Notice awareness of being aware', 'Feel unity with all beings', 'Rest in stillness and openness', 'Visualize violet light at crown', 'Simply be, without doing', 'Say: I am one with everything'],
                inquiry: 'What is awareness itself noticing right now?'
            },
            Sunday: {
                key: 'solar', name: 'Solar Plexus Chakra - Manipura', planet: '☉ Sun',
                color: 'Bright yellow', theme: 'Confidence, direction, expansion',
                element: 'Fire', sense: 'Sight', symbol: 'Lotus with 10 petals',
                endocrineGland: 'Pancreas', bodyAreas: 'Stomach, liver, gallbladder, nervous system',
                location: 'Two fingers above the navel.',
                visualization: 'Gentle rays of the sun, a rich yellow wheat field',
                keywords: ['Thoughts', 'intellect', 'ego', 'personal power', 'will', 'self-control', 'self-expression'],
                roleAndPurpose: 'The third chakra is the mental power center, responsible for our opinions, beliefs, self-esteem and self-confidence. It acts as an "energy pump" for the physical body and subtle bodies.',
                commonIssues: ['Power struggles', 'Anger', 'Resentment', 'Digestive and metabolic problems', 'Weight issues'],
                fundamentalTruths: ['I feel and think!', 'Honor yourself!'],
                guidedReflections: ['Do I trust myself to make the right decisions, or do I constantly seek external approval?', 'Where in my life do I give away my power, and why do I allow it?', 'What would my life look like if I fully trusted my inner fire?'],
                image:  '/public/Community/Chakras/Manipura1.webp',
                image2: '/public/Community/Chakras/Manipura2.webp',
                practice:  ['Stand tall and open your chest for 30 seconds', 'Take 5 strong belly breaths', 'Place hand above navel and feel warmth', 'Do one small task you have been avoiding', 'Sit upright and feel your core engaged', 'Say your name out loud with confidence', 'Visualize a warm yellow light in your belly', 'Clench fists, release slowly, repeat 3 times', 'Make one clear decision today', 'Say: I trust myself'],
                practice2: ['Stand in a power pose for 1 minute', 'Laugh out loud for 15 seconds', 'List 3 things you\'re good at', 'Breathe fire breath (quick exhales)', 'Straighten your posture fully', 'Make strong eye contact with yourself in mirror', 'Do 5 confident shoulder rolls', 'Visualize golden light expanding from core', 'Complete one unfinished task', 'Say: I am powerful and capable'],
                inquiry: 'Where am I ready to step up or expand?'
            }
        };
    }

    _buildChakraOptions() {
        const scheduleKeys = {
            root: 'Tuesday', sacral: 'Monday', solar: 'Sunday',
            heart: 'Friday', throat: 'Wednesday', 'third-eye': 'Thursday', crown: 'Saturday',
        };

        this.CHAKRA_OPTIONS = [
            { value: 'root',      label: 'Root Chakra',   image: '/public/Community/Chakras/Muladhara1.jpg',   image2: '/public/Community/Chakras/Muladhara2.webp' },
            { value: 'sacral',    label: 'Sacral Chakra', image: '/public/Community/Chakras/Svadhistana1.jpg', image2: '/public/Community/Chakras/Svadhistana2.webp' },
            { value: 'solar',     label: 'Solar Plexus',  image: '/public/Community/Chakras/Manipura1.jpg',    image2: '/public/Community/Chakras/Manipura2.webp' },
            { value: 'heart',     label: 'Heart Chakra',  image: '/public/Community/Chakras/Anahata1.jpg',     image2: '/public/Community/Chakras/Anahata2.webp' },
            { value: 'throat',    label: 'Throat Chakra', image: '/public/Community/Chakras/Vissudha1.jpg',    image2: '/public/Community/Chakras/Vissudha2.webp' },
            { value: 'third-eye', label: 'Third Eye',     image: '/public/Community/Chakras/Ajna1.jpg',        image2: '/public/Community/Chakras/Ajna2.webp' },
            { value: 'crown',     label: 'Crown Chakra',  image: '/public/Community/Chakras/Sahasrara1.jpg',   image2: '/public/Community/Chakras/Sahasrara2.webp' },
        ];

        this.CHAKRA_OPTIONS.forEach(opt => {
            const day = scheduleKeys[opt.value];
            if (day && this.CHAKRA_SCHEDULE[day]) {
                const sched = this.CHAKRA_SCHEDULE[day];
                opt.practices  = sched.practice;
                opt.practices2 = sched.practice2;
                opt.inquiry    = sched.inquiry;
                // Copy enriched fields
                ['name','planet','color','theme','element','sense','symbol','endocrineGland',
                 'bodyAreas','location','visualization','keywords','roleAndPurpose',
                 'commonIssues','fundamentalTruths','guidedReflections'].forEach(k => {
                    if (sched[k] !== undefined) opt[k] = opt[k] ?? sched[k];
                });
            }
        });
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    onEnter() {
        this.initializeChat();
        this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`);
        requestAnimationFrame(() => document.querySelector(`#${this.roomId}View .tarot-main`)?.scrollTo(0, 0));
    }

    // ── Overrides ─────────────────────────────────────────────────────────────

    getClassName() { return 'ReikiRoom'; }
    getParticipantText() { return `${this.state.participants} healing together`; }

    buildCardFooter() {
        if (!this._chakraDataReady || !this.state.currentDay) {
            return `<div style="text-align:left;"><span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span></div>`;
        }
        const todayChakra = this.CHAKRA_SCHEDULE[this.state.currentDay];
        return `
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            <span style="font-size:12px;color:var(--text);font-weight:600;">${todayChakra?.name ?? ''}</span>
        </div>`;
    }

    // ── Image carousel ────────────────────────────────────────────────────────

    _stepDailyImage(delta) {
        this.state.dailyImageIndex = (this.state.dailyImageIndex + delta + 2) % 2;
        const chakra = this.CHAKRA_SCHEDULE?.[this.state.currentDay];
        const img    = document.getElementById(`${this.roomId}DailyCarouselImg`);
        if (img && chakra) img.src = this.state.dailyImageIndex === 0 ? chakra.image : chakra.image2;
    }

    nextDailyImage()     { this._stepDailyImage(+1); }
    previousDailyImage() { this._stepDailyImage(-1); }

    _stepPersonalImage(delta) {
        this.state.personalImageIndex = (this.state.personalImageIndex + delta + 2) % 2;
        const selected = this.CHAKRA_OPTIONS?.find(o => o.value === this.state.personalFocus);
        const img      = document.getElementById(`${this.roomId}PersonalCarouselImg`);
        if (img && selected) img.src = this.state.personalImageIndex === 0 ? selected.image : selected.image2;
    }

    nextPersonalImage()     { this._stepPersonalImage(+1); }
    previousPersonalImage() { this._stepPersonalImage(-1); }

    // ── Personal session ──────────────────────────────────────────────────────

    startPersonalSession() {
        if (!this._chakraDataReady) { Core.showToast('Loading chakra data, please wait…'); return; }
        const focus = document.getElementById(`${this.roomId}PersonalFocus`)?.value;
        if (!focus) { Core.showToast('Please select a focus'); return; }

        this.state.personalFocus      = focus;
        this.state.personalImageIndex = 0;
        const selected = this.CHAKRA_OPTIONS.find(o => o.value === focus);

        const container = document.getElementById(`${this.roomId}PersonalSession`);
        if (!container) return;
        container.style.display = 'block';
        container.innerHTML = this.buildChakraDisplay(selected, 0,
            `${this.getClassName()}.previousPersonalImage()`,
            `${this.getClassName()}.nextPersonalImage()`,
            false, false
        );
        Core.showToast(`${selected.label} session started`);
    }

    // ── Chakra display ────────────────────────────────────────────────────────

    buildChakraDisplay(chakra, imageIndex, onPrev, onNext, isDaily = false, showCommunity = false) {
        const img = imageIndex === 0 ? chakra.image : chakra.image2;

        // ── Keywords pills ──
        const keywords = (chakra.keywords || [])
            .map(k => `<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${k}</span>`)
            .join('');

        // ── Attribute row (Planet · Element · Color · Symbol · Sense · Location · Body Areas · Gland) ──
        const attrDefs = [
            { label: 'Planet',    value: chakra.planet },
            { label: 'Element',   value: chakra.element },
            { label: 'Color',     value: chakra.color },
            { label: 'Symbol',    value: chakra.symbol },
            { label: 'Sense',     value: chakra.sense },
            { label: 'Location',  value: chakra.location },
            { label: 'Body Areas', value: chakra.bodyAreas },
            { label: 'Gland',     value: chakra.endocrineGland },
        ];
        const attrHTML = attrDefs
            .filter(a => a.value)
            .map(a => `
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${a.label}</div>
                <div style="font-size:13px;font-weight:500;">${a.value}</div>
            </div>`).join('');

        // ── Common Issues list ──
        const issuesHTML = (chakra.commonIssues || [])
            .map(i => `<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${i}</li>`)
            .join('');

        // ── Guided reflections ──
        const reflectionsHTML = (chakra.guidedReflections || [])
            .map(q => `<li style="margin:8px 0;font-size:14px;line-height:1.6;color:var(--text);">${q}</li>`)
            .join('');

        const cn     = this.getClassName();
        const roomId = this.roomId;
        const prefix = isDaily ? 'Daily' : 'Personal';

        return `
        <!-- ── Image carousel ── -->
        <div style="text-align:center;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <button onclick="${onPrev}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">‹</button>
            <img id="${roomId}${prefix}CarouselImg"
                 src="${img}" alt="${chakra.name}" loading="lazy" decoding="async"
                 style="max-width:min(500px,calc(100% - 100px));width:100%;height:auto;border-radius:var(--radius-md);box-shadow:0 4px 12px rgba(0,0,0,0.1);display:block;flex:1 1 auto;min-width:0;">
            <button onclick="${onNext}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">›</button>
        </div>
        <h4 style="font-family:var(--serif);font-size:20px;margin:0 0 20px;text-align:center;">${chakra.name}</h4>

        <!-- ── Enriched card ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">

            <!-- REPRESENTS -->
            ${chakra.roleAndPurpose ? `
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">${chakra.roleAndPurpose}</p>
            </div>` : ''}

            <!-- THEME -->
            ${chakra.theme ? `
            <div style="text-align:center;margin-bottom:20px;padding-top:16px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">Theme</div>
                <p style="font-size:14px;font-weight:600;color:var(--text);margin:0;">${chakra.theme}</p>
            </div>` : ''}

            <!-- KEYWORDS -->
            ${keywords ? `
            <div style="margin-bottom:20px;padding-top:20px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${keywords}</div>
            </div>` : ''}

            <!-- ATTRIBUTES ROW -->
            ${attrHTML ? `
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
                ${attrHTML}
            </div>` : ''}
        </div>

        <!-- ── Fundamental Truths & Visualization (standalone section) ── -->
        ${(chakra.fundamentalTruths?.length || chakra.visualization) ? `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:16px;text-align:center;">Fundamental Truths</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${(chakra.fundamentalTruths || []).map(t => `
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.7;margin:0;text-align:center;color:var(--text);">"${t}"</p>`).join('')}
                ${chakra.visualization ? `
                <div style="margin-top:8px;padding-top:12px;border-top:1px solid var(--border);">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;text-align:center;">Visualization</div>
                    <p style="font-size:14px;color:var(--text-muted);text-align:center;margin:0;font-style:italic;">${chakra.visualization}</p>
                </div>` : ''}
            </div>
        </div>` : ''}

        <!-- ── Common Issues + Guided Reflections (combined collapsible card) ── -->
        ${(issuesHTML || reflectionsHTML) ? `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;display:flex;flex-direction:column;gap:8px;">
            ${issuesHTML ? `
            <details>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span>▶</span> Common Issues
                </summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">
                    ${issuesHTML}
                </ul>
            </details>` : ''}
            ${reflectionsHTML ? `
            <details ${issuesHTML ? 'style="border-top:1px solid var(--border);padding-top:8px;"' : ''}>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span>▶</span> Guided Reflections for Clarity &amp; Growth
                </summary>
                <p style="font-size:13px;color:var(--text-muted);margin:10px 0 12px 0;line-height:1.6;font-style:italic;">Take a few moments to reflect on each question. Let your answers flow naturally, without overthinking or judgment. There are no wrong answers here.</p>
                <ul style="margin:0;padding:0;list-style:none;">
                    ${reflectionsHTML}
                </ul>
            </details>` : ''}
        </div>` : ''}

        <!-- ── Today's Inquiry (moved below Guided Reflections) ── -->
        ${chakra.inquiry ? `
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">${isDaily ? "Today's" : 'Guiding'} Inquiry</div>
            <p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">"${chakra.inquiry}"</p>
        </div>` : ''}

        <!-- ── Chakra Journal ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Chakra Journal</div>
                <button onclick="${cn}._toggleChakraJournalLog('${prefix}')"
                    id="${roomId}${prefix}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">
                Sit with this chakra's energy for a moment. What do you notice in your body? What emotions or thoughts arise? How does this energy center feel in your life right now?
            </p>
            <div id="${roomId}${prefix}JournalForm">
                <textarea id="${roomId}${prefix}JournalInput"
                    placeholder="e.g. I notice tension in my chest… this chakra feels blocked lately… I'm drawn to the color ${chakra.color}…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"
                ></textarea>
                <button onclick="${cn}._saveChakraJournalEntry('${prefix}', '${chakra.key}', '${chakra.name?.replace(/'/g, "\\'")}')"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <div id="${roomId}${prefix}JournalLog" style="display:none;">
                <div id="${roomId}${prefix}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>

        ${showCommunity ? `
        <!-- ── Community Energy ── -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Energy</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line reflection on today's chakra energy.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${roomId}EnergyInput" type="text" maxlength="140"
                    placeholder="One line — what does this chakra energy mean to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')${cn}._submitCommunityEnergy()"
                />
                <button onclick="${cn}._submitCommunityEnergy()"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${roomId}EnergyList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>
            </div>
        </div>` : ''}`;
    }

    // ── UI ────────────────────────────────────────────────────────────────────

    buildBody() {
        return `
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg> Today's Collective Energy`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work`)}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTab()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTab()}</div>
                </div>
            </main>
        </div>`;
    }

    _buildDailyTab() {
        if (!this._chakraDataReady || !this.state.currentDay) {
            return `<div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;text-align:center;"><div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's focus…</div></div>`;
        }
        const todayChakra = this.CHAKRA_SCHEDULE[this.state.currentDay];
        const cn          = this.getClassName();
        return `
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg> Today's Collective Energy</h3>
            ${this.buildChakraDisplay(todayChakra, this.state.dailyImageIndex, `${cn}.previousDailyImage()`, `${cn}.nextDailyImage()`, true, true)}
        </div>
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 8px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;margin-right:4px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer('daily', 'Share your thoughts on today\'s chakra...')}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML('Online Lightworkers', `${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`)}
        </div>`;
    }

    _buildPersonalTab() {
        return `
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work</h3>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;font-weight:600;">Choose Your Focus:</label>
                <select id="${this.roomId}PersonalFocus"
                        style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--background);font-size:14px;">
                    <option value="">Select a chakra...</option>
                    ${(this.CHAKRA_OPTIONS || []).map(o => `<option value="${o.value}">${o.label}</option>`).join('')}
                </select>
            </div>
            <button onclick="${this.getClassName()}.startPersonalSession()"
                    style="width:100%;padding:14px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:16px;">
                Begin Session
            </button>
            <div id="${this.roomId}PersonalSession" style="margin-top:24px;display:none;"></div>
        </div>`;
    }

    // ── Journal ──────────────────────────────────────────────────────────────

    _toggleChakraJournalLog(prefix) {
        const roomId  = this.roomId;
        const logDiv  = document.getElementById(`${roomId}${prefix}JournalLog`);
        const formDiv = document.getElementById(`${roomId}${prefix}JournalForm`);
        const btn     = document.getElementById(`${roomId}${prefix}JournalLogBtn`);
        if (!logDiv) return;
        const showing = logDiv.style.display !== 'none';
        logDiv.style.display  = showing ? 'none' : '';
        formDiv.style.display = showing ? ''     : 'none';
        btn.textContent = showing ? 'View Log' : 'Write Entry';
        if (!showing) this._loadChakraJournalLog(prefix);
    }

    async _saveChakraJournalEntry(prefix, chakraKey, chakraName) {
        const roomId = this.roomId;
        const input  = document.getElementById(`${roomId}${prefix}JournalInput`);
        const text   = input?.value?.trim();
        if (!text) { Core.showToast('Please write something first'); return; }

        const user  = Core.state.currentUser;
        const today = new Date().toISOString().slice(0,10);

        try {
            await CommunityDB._sb.from('reiki_sessions').insert({
                user_id:     user?.id,
                chakra_key:  chakraKey,
                chakra_name: chakraName,
                date:        today,
                entry:       text,
            });
            input.value = '';
            Core.showToast('Saved to your chakra journal ✨');
        } catch (e) {
            console.warn('[ReikiRoom] journal save failed', e);
            Core.showToast('Could not save — please try again');
        }
    }

    async _loadChakraJournalLog(prefix) {
        const roomId = this.roomId;
        const user   = Core.state.currentUser;
        const listEl = document.getElementById(`${roomId}${prefix}JournalLogList`);
        if (!listEl || !user?.id) return;
        listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>`;

        try {
            const { data, error } = await CommunityDB._sb
                .from('reiki_sessions')
                .select('id, chakra_name, date, entry')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(30);

            if (error) throw error;
            if (!data || data.length === 0) {
                listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>`;
                return;
            }

            const cn = this.getClassName();
            listEl.innerHTML = data.map(row => `
                <div id="rj-${row.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escapeHtml(row.chakra_name || '')} · ${row.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.ReikiRoom._editSessionEntry('${row.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.ReikiRoom._deleteSessionEntry('${row.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="rj-text-${row.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escapeHtml(row.entry)}</div>
                    <div id="rj-edit-${row.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escapeHtml(row.entry)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.ReikiRoom._saveEditedEntry('${row.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.ReikiRoom._cancelEditEntry('${row.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join('');
        } catch (e) {
            console.warn('[ReikiRoom] load journal failed', e);
            listEl.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>`;
        }
    }

    _editSessionEntry(id) {
        document.getElementById(`rj-text-${id}`)?.style && (document.getElementById(`rj-text-${id}`).style.display = 'none');
        document.getElementById(`rj-edit-${id}`)?.style && (document.getElementById(`rj-edit-${id}`).style.display = '');
    }

    _cancelEditEntry(id) {
        document.getElementById(`rj-text-${id}`)?.style && (document.getElementById(`rj-text-${id}`).style.display = '');
        document.getElementById(`rj-edit-${id}`)?.style && (document.getElementById(`rj-edit-${id}`).style.display = 'none');
    }

    async _saveEditedEntry(id) {
        const editDiv  = document.getElementById(`rj-edit-${id}`);
        const textarea = editDiv?.querySelector('textarea');
        const newText  = textarea?.value?.trim();
        if (!newText) return;
        try {
            await CommunityDB._sb.from('reiki_sessions').update({ entry: newText }).eq('id', id);
            const textDiv = document.getElementById(`rj-text-${id}`);
            if (textDiv) textDiv.textContent = newText;
            this._cancelEditEntry(id);
            Core.showToast('Entry updated');
        } catch (e) {
            console.warn('[ReikiRoom] edit failed', e);
            Core.showToast('Could not update entry');
        }
    }

    async _deleteSessionEntry(id) {
        try {
            await CommunityDB._sb.from('reiki_sessions').delete().eq('id', id);
            document.getElementById(`rj-${id}`)?.remove();
            Core.showToast('Entry deleted');
        } catch (e) {
            console.warn('[ReikiRoom] delete failed', e);
            Core.showToast('Could not delete entry');
        }
    }

    // ── Community Energy ─────────────────────────────────────────────────────

    async _submitCommunityEnergy() {
        const input = document.getElementById(`${this.roomId}EnergyInput`);
        const text  = input?.value?.trim();
        if (!text) return;

        const user     = Core.state.currentUser;
        const chakra   = this.CHAKRA_SCHEDULE[this.state.currentDay];
        const today    = new Date().toISOString().slice(0,10);

        try {
            await CommunityDB._sb.from('reiki_shares').insert({
                user_id:      user?.id,
                display_name: user?.display_name || user?.username || user?.name || 'A seeker',
                chakra_key:   chakra?.key,
                date:         today,
                share:        text,
            });
            input.value = '';
            await this._loadCommunityEnergy();
            Core.showToast('Shared 🌀');
        } catch (e) {
            console.warn('[ReikiRoom] community energy save failed', e);
            Core.showToast('Could not share — please try again');
        }
    }

    async _loadCommunityEnergy() {
        const chakra = this.CHAKRA_SCHEDULE[this.state.currentDay];
        const today  = new Date().toISOString().slice(0,10);
        const list   = document.getElementById(`${this.roomId}EnergyList`);
        if (!list || !chakra) return;

        // Purge old entries silently
        CommunityDB._sb.from('reiki_shares').delete().lt('date', today).then(() => {});

        try {
            const { data, error } = await CommunityDB._sb
                .from('reiki_shares')
                .select('display_name, share, created_at')
                .eq('chakra_key', chakra.key)
                .eq('date', today)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            if (!data || data.length === 0) {
                list.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share today's energy.</div>`;
                return;
            }

            list.innerHTML = data.map(row => `
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escapeHtml(row.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escapeHtml(row.share)}</span>
                </div>`).join('');
        } catch (e) {
            console.warn('[ReikiRoom] load community energy failed', e);
            list.innerHTML = `<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load.</div>`;
        }
    }

    _escapeHtml(str) {
        return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── onEnter hook: load community energy after render ─────────────────────

    onEnter() {
        this.initializeChat();
        this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`, `${this.roomId}ParticipantCount`);
        requestAnimationFrame(() => {
            document.querySelector(`#${this.roomId}View .tarot-main`)?.scrollTo(0, 0);
            this._loadCommunityEnergy();
        });
    }

    getInstructions() {
        return `
            <p><strong>A space for energy healing and chakra alignment.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li><strong>Today's Collective Energy:</strong> Each day follows a planetary chakra cycle. The entire community focuses on one chakra energy.</li>
                <li><strong>Solo Chakra Work:</strong> Choose any chakra for your individual needs.</li>
                <li><strong>Community Discussion:</strong> Share your experiences and healing journey.</li>
            </ul>
            <h3>7-Day Planetary Chakra Cycle:</h3>
            <ul>
                <li><strong>Sunday (Sun):</strong> Solar Plexus - Confidence &amp; expansion</li>
                <li><strong>Monday (Moon):</strong> Sacral Chakra - Emotional flow &amp; creativity</li>
                <li><strong>Tuesday (Mars):</strong> Root Chakra - Grounding &amp; strength</li>
                <li><strong>Wednesday (Mercury):</strong> Throat Chakra - Truth &amp; expression</li>
                <li><strong>Thursday (Jupiter):</strong> Third Eye - Intuition &amp; vision</li>
                <li><strong>Friday (Venus):</strong> Heart Chakra - Love &amp; connection</li>
                <li><strong>Saturday (Saturn):</strong> Crown Chakra - Awareness &amp; unity</li>
            </ul>
            <h3>Energy Work Guidelines:</h3>
            <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Practice non-forcing - allow energy to flow naturally</li>
                <li>Be patient with yourself</li>
                <li>This is complementary to medical care, not a replacement</li>
            </ul>`;
    }
}

Object.assign(ReikiRoom.prototype, ChatMixin);
Object.assign(ReikiRoom.prototype, TabRoomMixin);

// Window bridge: preserved for inline onclick handlers
const reikiRoom = new ReikiRoom();
window.ReikiRoom = reikiRoom;

export { ReikiRoom, reikiRoom };
