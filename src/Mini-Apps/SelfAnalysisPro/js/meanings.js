// Mini-Apps/SelfAnalysisPro/js/meanings.js
// Data Meanings and Interpretations Database

// XSS escape helper (used in dynamic HTML methods below)
function esc(v) {
  return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const DataMeanings = {
  numbers: Object.freeze({
    "1":  "Number Symbolism - The first creation, beginning, activity and dynamism.\nRepresents - Entrepreneurship, leadership, new beginnings, individuality, masculine and pioneering energy.",
    "2":  "Number Symbolism - Polarity, contrast, the maternal side, emotions and feelings, partnership and love.\nRepresents - Passivity, receptivity, femininity, gentleness, sensitivity, tolerance, cooperation.",
    "3":  "Number Symbolism - The child in the sacred triangle, the balance of creation, extroverted and social.\nRepresents - Balance between masculine and feminine, social relationships, expression, communication, joy of life, optimism, creativity.",
    "4":  "Number Symbolism - The physical plane, framework and work, discipline, order and organization.\nRepresents - Stability and practicality, laws and norms, morality, conscience and integrity.",
    "5":  "Number Symbolism - Movement and freedom, change, travels and dynamic aspect.\nRepresents - Spiritual change, desire to advance beyond routine with spontaneity, need for new experiences.",
    "6":  "Number Symbolism - The energy behind natural evolution, balance and harmony, love and beauty.\nRepresents - Art, aesthetics and creativity, ability to accept responsibility, nurturing family.",
    "7":  "Number Symbolism - Deep inner world, self-investigation, meditation, philosophy, spirituality.\nRepresents - Mysticism, philosophy, wisdom and spirituality, great inner depth, need for solitude and research.",
    "8":  "Number Symbolism - Achieving goals through determination and logic, attraction to power and status.\nRepresents - Practical, ambitious and focused, ability for material world success, seeing the big picture.",
    "9":  "Number Symbolism - The bridge between ending and new beginning, universal number, altruism.\nRepresents - Service to others wholeheartedly, interested in humanitarian problems, generosity and honesty.",
    "10": "Number Symbolism - Completeness, ready to begin a new cycle from a complete place.\nRepresents - The end of the circle, return to unity, complete evolutionary development.",
    "11": "Number Symbolism - High inspiration, connections with higher dimensions, spiritual teacher.\nRepresents - Master number, enhanced mystical abilities, enlightened people, high spiritual energy.",
    "22": "Number Symbolism - The master builder, ability to execute enormous projects with others.\nRepresents - Master number, innovative ideas and high ambition, ability to lead large groups and projects.",
    "33": "Number Symbolism - Master Teacher, most spiritually evolved Master Number.\nRepresents - Master number, humanitarian purpose, highest form of teaching and service."
  }),

  zodiac: Object.freeze({
    "Aries":       Object.freeze({ expression: "I am",       title: "Energy bursting outward, pioneer",                  keywords: "Beginning of action, breaking barriers, breakthrough" }),
    "Taurus":      Object.freeze({ expression: "I have",     title: "Peaceful lovers of earthly beauty",                 keywords: "Grounded, stable, continuous, calm, secure" }),
    "Gemini":      Object.freeze({ expression: "I think",    title: "Restless intelligence of the mind",                 keywords: "Power of mind, adaptive, dual understanding" }),
    "Cancer":      Object.freeze({ expression: "I feel",     title: "Hard outside, soft inside",                        keywords: "Strong emotions, deep subconscious connection, secretive" }),
    "Leo":         Object.freeze({ expression: "I will be",  title: "Center of attention and power",                    keywords: "Energetic, helpful, supportive, encouraging, noble" }),
    "Virgo":       Object.freeze({ expression: "I analyze",  title: "Mad scientist, laser mind",                        keywords: "Analysis into details, focused precision, organized" }),
    "Libra":       Object.freeze({ expression: "I balance",  title: "Iron fist in velvet glove",                        keywords: "Strong energy in refined way, desire for balance and harmony" }),
    "Scorpio":     Object.freeze({ expression: "I desire",   title: "Desire to experience everything intensely",        keywords: "Temptation to know more, transformation versus destruction" }),
    "Sagittarius": Object.freeze({ expression: "I see",      title: "Utopian vision, aim high",                        keywords: "Aspiration upward, adaptable, flexible, philosophical" }),
    "Capricorn":   Object.freeze({ expression: "I use",      title: "Knowledge to use tools at disposal",              keywords: "Very practical, high ambition step by step" }),
    "Aquarius":    Object.freeze({ expression: "I know",     title: "Spreader of knowledge",                           keywords: "Self-expression and communication, logical rather than emotional" }),
    "Pisces":      Object.freeze({ expression: "I believe",  title: "Very deep inner and emotional world",             keywords: "Hypersensitivity to environment, functioning from another dimension" })
  }),

  planets: Object.freeze({
    "Sun":     Object.freeze({ keywords: "360-degree angle of vision and control over the environment, center of the universe, the savior, nourishment.", advantages: "Light, wisdom, intuition, knowledge, service, giving life, love for humanity, responsibility, authority, rulership, leadership, confidence, organization, loyalty and reliability.", disadvantages: "Selfishness, egoism, arrogance, conceit, boasting, know-it-alls, doing everything alone, big-headedness, everything revolves around them." }),
    "Mercury": Object.freeze({ keywords: "Intellect, logic, communication, intelligence, information, languages, science, learning, logic, drawing conclusions.", advantages: "Practical, intelligent, quick understanding, analysis, logic, intellectual, scientific, high learning ability, open-minded.", disadvantages: "Mental illness, mental instability, nervous, confused, argumentative, cynicism, over-criticism, over-analysis and worry, inconsistent." }),
    "Venus":   Object.freeze({ keywords: "Power of attraction, instincts, emotions, femininity, beauty, art creation, acting from love, forces of nature.", advantages: "Love, beauty, charm, gentleness, harmony, art, emotionality, sensitivity, creativity, sentimentality, sophistication, the ability to express emotion without inhibitions, friendliness, power of persuasion, good taste.", disadvantages: "Emotional imbalance, jealousy, vengefulness, resentment, lack of morality, lack of responsibility, flirtatiousness." }),
    "Moon":    Object.freeze({ keywords: "Cyclicality, subconscious, reflection of light, mysterious, hidden, concealed, purification, imagination, intuition, memory, feminine energy.", advantages: "Extrasensory abilities, dreams, developed imagination, deep soul, idealist, showing affection, high ability to learn metaphysics and esoterics, ability to receive and contain, deep inner contemplation.", disadvantages: "Ungrounded, impractical, superficial, lazy, stubborn, lunatic, inconsistent, changeable, moving from one state to another, lack of concentration, changing moods, fits of rage, madness." }),
    "Mars":    Object.freeze({ keywords: "To execute, activity, defense, war, courage, motivation, daring, drive, masculinity, inner fire, destruction for the sake of progress.", advantages: "Action, initiative, taking risks, changing negative conditions, energy, movement, will, determination, leadership, authority, efficiency, decision, courage.", disadvantages: "Tyranny, arrogance, violence, aggression, lack of tact, without thinking, impulsiveness, aggressiveness, rudeness, lack of sensitivity." }),
    "Jupiter": Object.freeze({ keywords: "Movement and progress, rising above the current situation, protection, inspiration, help, new experiences, broad heart, abundance.", advantages: "Compassion, charity, good-heartedness, kindness, grace, generosity, broad-heartedness, joy, loyalty, open soul, optimism, tolerance, faith, service to others, balanced response, true love for all humanity.", disadvantages: "Passivity, lack of energy, lack of honesty, difficulty refusing people, pride, arrogance, boastfulness." }),
    "Saturn":  Object.freeze({ keywords: "Limitations, obstacles, persistence, endurance power, stubbornness, maintaining form, focusing energy, slowness.", advantages: "Stability, slowness, calmness, tranquility, systematicness, discipline, responsibility, traditionalism, ideas, inner contemplation, patience, focus, concentration, systematic and detailed persistence.", disadvantages: "Conservative, withdrawal, rigidity, sadness, closed-minded, finding obstacles and negativity in everything, seriousness, excessive routine, pessimism, delay, limitation, repression, impatience." }),
    "Neptune": Object.freeze({ keywords: "Dissolution of boundaries, dreams, illusions, spirituality, transcendence, the unseen realm, mysticism, compassion, imagination.", advantages: "Spiritual insight, psychic abilities, deep compassion, artistic inspiration, selfless service, connection to the divine, healing abilities, ability to merge with the greater whole, visionary imagination.", disadvantages: "Confusion, deception, escapism, addiction, lack of boundaries, unrealistic expectations, victimization, losing touch with reality, delusion, susceptibility to manipulation." }),
    "Pluto":   Object.freeze({ keywords: "Transformation, regeneration, power, death and rebirth, hidden depths, elimination, renewal, the shadow, deep psychology.", advantages: "Ability to transform fundamentally, penetrating insight, healing powers, regeneration, psychological depth, ability to eliminate what is no longer needed, facing the shadow, profound renewal.", disadvantages: "Destructiveness, obsession, compulsion, manipulation, power struggles, extremism, vindictiveness, inability to let go, transforming through crisis and pain." }),
    "Uranus":  Object.freeze({ keywords: "Revolution, innovation, sudden change, independence, originality, rebellion, awakening, freedom, electricity, genius.", advantages: "Originality, inventiveness, independence, humanitarian ideals, ability to break free from limitations, progressive thinking, sudden insights, revolutionary spirit, unique perspective.", disadvantages: "Rebelliousness, unpredictability, erratic behavior, detachment, stubbornness, revolutionary extremism, inability to cooperate, chaos, disruption for its own sake." }),
    "Earth":   Object.freeze({ keywords: "Grounding, embodiment, physical presence, manifestation, the body, material reality, rootedness, the here and now.", advantages: "Ability to manifest vision into reality, grounded presence, practical wisdom, connection to the physical body, appreciation of material beauty, stability, reliability, bringing spirit into form.", disadvantages: "Materialism, heaviness, resistance to change, being stuck in the mundane, inability to transcend physical limitations, excessive attachment to security, difficulty with abstract thinking." })
  }),

  elements: Object.freeze({
    "Earth": Object.freeze({ represents: "Tangible physical world, matter, density, solidity, security, basic needs, foundation stone, practical action, work, health.", traits: "<strong>Positive:</strong> Patience, stability, efficiency, action, practicality, perseverance, conservatism, caution, steadiness, methodicalness, modesty.<br><strong>Negative:</strong> Rigidity, coldness, slowness, stubbornness, laziness, perfectionism, selectiveness, routine-bound." }),
    "Air":   Object.freeze({ represents: "Mental world, thoughts, logic, intellect, communication, information, science, mathematics, analytical analysis, communication.", traits: "<strong>Positive:</strong> Intelligence, speech, diplomacy, mental balance, idealistic, inventiveness, learning ability, logical, curious, investigative, sharp, expressive, communicative, sharing knowledge.<br><strong>Negative:</strong> Compromising, naive, indecisive, flirtatious, stubborn in their opinions, outsiders, rebellious, lacking motivation, all talk and no action, pressured, restless, scattered, superficial, changing opinions quickly." }),
    "Water": Object.freeze({ represents: "World of emotions, intuition, imagination, creation, association, inner feminine energy, desires, empathy, containment.", traits: "<strong>Positive:</strong> Sensitivity, developed imagination, talent, artistry, openness, identification, empathy, intuitive, full of passion, active, healing powers, sympathetic, humble, mystical.<br><strong>Negative:</strong> Changing moods, unrealistic, living in illusion, elusive, stubborn, vindictive, jealous, self-centered, vulnerable, influenced, living in a bubble." }),
    "Fire":  Object.freeze({ represents: "Abstract spiritual world, energy, life force, development, change, burning, expansion, dynamism, independence, sexuality.", traits: "<strong>Positive:</strong> Adventurousness, courage, activity, enthusiasm, happiness, honesty, generosity, leadership, nobility, determination, strong willpower, optimism, aspiration for expansion, independence, freedom, responsibility.<br><strong>Negative:</strong> Audacity, lack of tact, selfishness, snobbery, condescension, dominance, arrogance, boastfulness, conceit, lack of perseverance, lack of consistency." })
  }),

  sefira: Object.freeze({
    "Keter (Crown)":        Object.freeze({ symbols: "The Point, The Crown, The Swastika.", titles: "Existence of Existences, Concealed of the Concealed, Ancient of Ancients, Ancient of Days, The Primordial Point, The Point within the Circle, The Most High, The Vast Countenance, The White Head, The Head which is Not, Macroprosopos, Amen, Lux Occulta, Lux Interna, He, The Divine Spark, The Thousand-petalled Lotus, The Sah, Yechida.", keywords: "All that Is, the breath of that which is not, the Source of Energy from the Infinite Unmanifest, Crystallization, The First Motion, That from which we come and to which we shall return, Ascension, Space, Unity, Union." }),
    "Chokhmah (Wisdom)":    Object.freeze({ symbols: "The Lingam, The Phallus, The Tower, Yod (\u05D9), The Inner Robe of Glory, The Standing Stone, The Straight Line, The Uplifted Rod of Power.", titles: "Av, Abba, The Supernal Father, Tetragramaton, Power of Yetzira.", keywords: "Pure Creative Force, Dynamic Outpouring Energy, The Wellspring, The Fountain and Water of Life, The Great Stimulator, The First Positive, Unorganized and Uncompensated Force, Ejaculation." }),
    "Binah (Understanding)": Object.freeze({ symbols: "The Yoni, The Vesica Picis, The Cup, The Chalice, The Outer Robe of Concealment, The Kteis.", titles: "Ama, The Dark sterile mother, Ima, The Bright fertile mother, Kursiya, The Throne, Marah, The Great Sea, The Fifty Gates of Understanding, The Mother of Form, The Superior Mother, The Organizer and Compensator.", keywords: "Form, Limitation, Constraint, Heaviness, Slowness, Inertia, Incarnation, Fate, Time, Space, Natural Law, The Womb, Enclosure, Containment, Death, Annihilation." }),
    "Chesed (Kindness)":    Object.freeze({ symbols: "The Solid Figure, The Pyramid, The Square, The Equal-Armed Cross, The Orb, The Wand, The Scepter, The Crook.", titles: "Gedulah, Magnificence, Love, Majesty, The Builder, The kindly shepherd, The loving father who is king, The Framework of Manifestation, The receptacle of all Powers.", keywords: "Authority, Leadership, Creativity, Inspiration, Vision, Excess, Waste, Birth, Service, Spiritual Love, Mercy, Compassion, Submission, Obliteration, The Annihilation Myth, The Atom Bomb." }),
    "Gevurah (Strength)":   Object.freeze({ symbols: "The Pentagon, The Five-petalled Tudor Rose, The Sword, The Spear, The Scourge, The Chain.", titles: "Din - Justice, Pachad - Fear, The warrior King, The Destroyer, The Eliminator of the Useless, The Clarifier, The Power of Judgment.", keywords: "Power, Strength, Severity, Justice, Cruelty, Oppression, Catabolism, Necessary Destruction, Domination, Retribution, Execution." }),
    "Tiferet (Beauty)":     Object.freeze({ symbols: "The Cube, The truncated pyramid, The Lamen, The rose-cross, The Calvary cross, Vav (\u05D5).", titles: "Zair anpin - the Lesser Countenance, the Microprospus, Melech - King, Adam - Man, the Son, Rachamim - Compassion, Charity, the scarified Gods, Redemption, Healing.", keywords: "Harmony, Integrity, Balance, Wholeness, Centrality, the Solar-Plexus, the Sun, Gold, the Son of God, a King, the Great Work, the Elemental Kings, the Higher Self, Self-importance, Self-sacrifice, the Philosopher's Stone." }),
    "Netzach (Victory)":    Object.freeze({ symbols: "The Rose, the Lamp, the Girdle.", titles: "Nature, Love, the Arts, The group-mind, Feelings, Emotions, Moods, Instincts, Intuition, Firmness.", keywords: "Life-Force, Beauty, Passion, Pleasure, Luxury, Sensuality, Desire, Joy, Excitement, Lust, Libido, Nurture, Drive, Empathy, Sympathy, Ecstatic Magic, Dance." }),
    "Hod (Splendor)":       Object.freeze({ symbols: "Names and Versicles, the Apron.", titles: "Reason, the Individual-Mind, Science, Magic, Language, Visualization.", keywords: "Logic, the Sciences, Mathematics, Speech, Words, Communication, Conceptualization, the Law, Protocol, Trickery, Philosophy, Ownership, Territory, Ritual Magic, Occult Knowledge, Esoteric Philosophy." }),
    "Yesod (Foundation)":   Object.freeze({ symbols: "The Perfumes, the Sandals.", titles: "The Astral-Light, the Treasure-house of images, the Receptacle of the Emanations, the Cyclic energies underlying Matter, the Aether-Currents.", keywords: "Imagination, the Unconscious-Mind, Dreams, the Astral-Plane, the Aether, Glue, Interface, Perception, Cosmetics, Appearance, Instinct, Illusion, Hidden Infrastructure, Divination, Mirrors and Crystals, Psychism, the Genitals, Secret Door, Tunnel, the Shamanic Tunnel, Sex and Reproduction." }),
    "Malkuth (Kingdom)":    Object.freeze({ symbols: "The Altar of the Double-Cube, the Equal-armed Cross, The Magic circle, the Mystic circle, the Triangle of art, He final (\u05D4).", titles: "The Gate, the Gate of Death, the Gate of the Shadow of Death, the Gate of Tears, the Gate of Justice, the Gate of Prayer, the Gate of the Daughter of the Mighty-ones, the Gate of the Garden of Eden, the Inferior Mother, Malka - Queen, Kala - Bride, the Virgin, Keter below, the Completion.", keywords: "The Real-World, Physical Matter, The Earth on which we walk, Mother Earth, Planet Earth, the 4 Elements, what we perceive with our 5 Senses, Practicality, Stability, Solidity, Heaviness, Dense Matter." })
  }),

  tarot: Object.freeze({
    major: Object.freeze({
      0: "A sacred beginning, full of faith and curiosity. Trust the unknown path before you. Every step forward reveals the next truth—life rewards those who dare to leap.",
      1: "All the tools are in your hands. You are the bridge between spirit and matter. Focus your will, and creation will respond to your intention.",
      2: "Silence holds the answers you seek. Intuition speaks through stillness and symbols. Trust your inner knowing—it guides beyond logic.",
      3: "The Earth mirrors your abundance. Nurture what you love, and life will bloom around you. Pleasure, beauty, and creation are your natural birthrights.",
      4: "True power is built through order and wisdom. Take authority over your life with structure and strength. Leadership comes from grounded purpose, not control.",
      5: "Seek guidance in tradition and timeless truth. Learn from those who walked before you. Spiritual growth begins when knowledge becomes lived wisdom.",
      6: "Union of soul and choice of heart. Harmony is born when love aligns with truth. Every relationship is a mirror of your own awakening.",
      7: "Willpower shapes destiny. Focus and discipline drive you through chaos. Victory is achieved through balance of heart and mind.",
      8: "Gentle courage tames inner storms. True strength is soft yet unbreakable. Master your impulses through compassion, not force.",
      9: "Withdraw to reconnect with your light. Solitude opens doors that noise conceals. The answers you seek are already burning within.",
      10: "Life turns in divine rhythm. Embrace change—it moves you where you're meant to go. Every rise and fall carries hidden blessings.",
      11: "The scales always balance in time. Every action meets its reflection. Choose integrity, for truth is the foundation of real peace.",
      12: "Surrender brings revelation. When you let go of control, clarity appears. Sometimes you must pause to see from a higher angle.",
      13: "Endings are beginnings disguised. Allow what has expired to dissolve. Transformation renews you into higher truth and freedom.",
      14: "Balance is your sacred art. Blend opposites into harmony and flow. Patience and moderation bring long-lasting peace.",
      15: "Bondage is often self-made. Recognize what controls you and reclaim your power. Freedom begins the moment you see truth without denial.",
      16: "When illusion collapses, liberation follows. Destruction clears the path for authenticity. Trust the breakdown—it's sacred renewal in disguise.",
      17: "Hope returns like light after storm. Believe again in miracles and healing. You are being guided toward your higher destiny.",
      18: "The path is unclear but alive with mystery. Feel your way through intuition, not logic. The night reveals what daylight hides.",
      19: "Joy, clarity, and vitality fill your being. Life celebrates you when you live openly. Let your light shine without apology.",
      20: "Awakening through self-realization. The past calls for resolution, not regret. Rise into your higher purpose and answer the soul's invitation.",
      21: "Completion, integration, and mastery. You've come full circle, wiser and freer. Celebrate how far you've come—the journey now begins anew."
    }),
    wands: Object.freeze({
      1: "A spark of inspiration ignites. New energy and purpose surge forward. Say yes to creation—this is your green light from spirit.",
      2: "Vision and decision meet. The world expands when you dare to plan boldly. Step beyond comfort—your horizon awaits.",
      3: "Your efforts begin to take form. Trust the momentum you've created. What you've set in motion is coming back multiplied.",
      4: "Celebration of stability and success. Pause to enjoy what you've built. Gratitude anchors future abundance.",
      5: "Conflicts arise to sharpen your will. Competing forces teach you to focus. Growth comes through challenge, not avoidance.",
      6: "Recognition for your achievements. You've earned this victory through perseverance. Accept the spotlight with humility and pride.",
      7: "Defend what you've created. Stand strong in your truth, even under pressure. Courage sustains you through opposition.",
      8: "Movement and progress accelerate. Energy flows freely toward results. Act quickly—momentum is on your side.",
      9: "You're tired but near completion. Stay strong—the final push matters most. Resilience now defines your victory.",
      10: "Responsibility weighs heavy. You've carried too much alone. Delegate, release, and return to balance before burnout.",
      11: "Curiosity fuels your next adventure. Approach life with wonder and courage. Inspiration comes through bold exploration.",
      12: "Passion drives you forward fast. Pursue what excites your soul. Just remember—impulse without direction burns out quickly.",
      13: "Confident, radiant, magnetic. You lead through authenticity and joy. Trust your intuition—it's your greatest power.",
      14: "Visionary leadership in motion. Inspire others through your clarity and courage. When you commit, destiny aligns with you."
    }),
    cups: Object.freeze({
      1: "A new emotional beginning. Love, healing, and creativity overflow. Open your heart—the universe is offering more.",
      2: "A sacred union of hearts. Mutual understanding deepens connection. Love flourishes when both souls meet in truth.",
      3: "Community and celebration uplift your spirit. Share joy, friendship, and creative energy. Togetherness amplifies abundance.",
      4: "Dissatisfaction hides opportunity. Look beyond what you think you lack. Gratitude opens new emotional doors.",
      5: "Grief teaches the value of letting go. Focus not on what's lost but what remains. Healing begins when acceptance replaces regret.",
      6: "Nostalgia and innocence return. Past memories bring comfort and clarity. Reconnect with what once made your heart pure.",
      7: "So many choices cloud your vision. Illusion disguises true desire. Clarity comes when you listen to your heart, not fantasy.",
      8: "A quiet walk away from what no longer feeds you. Seek deeper meaning beyond surface comfort. True fulfillment lies in spiritual alignment.",
      9: "Contentment and wish fulfillment arrive. You've manifested emotional satisfaction. Enjoy what you've created—you earned it.",
      10: "Emotional harmony and spiritual joy. Family, love, and unity flow in divine rhythm. This is the heart's ultimate fulfillment.",
      11: "A message of love or inspiration appears. Stay open and playful—magic moves through innocence. Creative dreams awaken now.",
      12: "The romantic, the dreamer, the believer. Follow your ideals with grace and devotion. Let your heart lead your next quest.",
      13: "Empathy and intuition flow naturally. You heal through compassion and understanding. Emotional depth is your quiet strength.",
      14: "Emotional mastery through balance. Lead with kindness, not control. Wisdom grows from knowing your own heart."
    }),
    swords: Object.freeze({
      1: "Clarity slices through confusion. A breakthrough in truth or awareness emerges. Speak and act with precision—the mind is your tool.",
      2: "A stalemate between logic and feeling. Pause before deciding—inner peace brings clarity. Balance both sides before you choose.",
      3: "Pain opens the heart to truth. Though sorrow cuts deep, healing follows honesty. This is the soul's purification through loss.",
      4: "Rest is required before renewal. Withdraw to regain clarity and peace. Silence rebuilds strength for what's next.",
      5: "Victory at what cost? Ego wins can isolate the heart. Choose battles that serve growth, not pride.",
      6: "A transition toward calmer waters. Leave old turmoil behind and move forward. Healing comes through conscious change.",
      7: "Strategy or deceit—choose wisely. Not every truth must be spoken, but every act must be conscious. Integrity is your quiet armor.",
      8: "You feel trapped, but the cage is mental. Release limiting thoughts and see the open door. Freedom begins with perception.",
      9: "Anxiety feeds on imagination. The mind creates what it fears. Breathe, ground, and remember—this is not the full truth.",
      10: "A painful ending clears illusion. The worst is over—rise renewed. Darkness gives way to dawn when you surrender completely.",
      11: "Curious and alert, hungry for truth. Watch, learn, and refine your ideas. Mental agility opens new paths.",
      12: "Decisive, bold, unstoppable. Take action but beware of haste. True strength is precision guided by purpose.",
      13: "Clarity through wisdom and detachment. Speak truth even when it cuts. Compassion and honesty must walk together.",
      14: "Authority through intellect and fairness. Lead with logic, integrity, and discernment. Master the mind, and the world follows."
    }),
    pentacles: Object.freeze({
      1: "A seed of prosperity takes root. Ground your vision through consistent effort. The material world now supports your growth.",
      2: "Balance the dance of priorities. Flexibility keeps life flowing. Adapt, juggle, and stay centered through change.",
      3: "Collaboration builds mastery. Work with others in harmony and respect. Shared vision creates tangible success.",
      4: "Security can turn to stagnation. Hold what you value, but stay open to flow. True wealth is trust, not control.",
      5: "Lack is a teacher, not a punishment. Help and hope exist if you lift your head. Hardship awakens faith and resilience.",
      6: "Giving and receiving restore balance. Generosity multiplies abundance. Flow your resources with fairness and gratitude.",
      7: "Pause and assess your progress. Growth takes time—patience is profit. Trust the process and refine where needed.",
      8: "Dedication leads to mastery. Hone your craft with steady hands and open mind. Excellence is built one effort at a time.",
      9: "Independence and self-worth blossom. You've created stability through devotion. Enjoy the luxury of what you've cultivated.",
      10: "Legacy, family, and long-term abundance. Prosperity is meant to be shared. Build something that lasts beyond you.",
      11: "A student of manifestation. Stay curious and grounded in learning. Small steps today become great achievements tomorrow.",
      12: "Steady progress and reliability win the race. Persistence turns plans into reality. Stay patient—consistency is your magic.",
      13: "Nurture life through care and practicality. Abundance grows under your touch. You create comfort by living in alignment with nature.",
      14: "Master of stability and material success. Lead through generosity and grounded wisdom. Prosperity expands when shared with purpose."
    })
  }),

  // ---------------------------
  // Helper methods
  // ---------------------------
  getNumberMeaning(number) {
    return this.numbers[String(number)] || "Meaning not available for this number.";
  },

  getZodiacMeaning(sign) {
    const m = this.zodiac[sign];
    if (!m) return "";
    return `<strong>Expression:</strong> ${esc(m.expression)}<br><strong>Title:</strong> ${esc(m.title)}<br><strong>Keywords:</strong> ${esc(m.keywords)}`;
  },

  getPlanetMeaning(planet) {
    const m = this.planets[planet];
    if (!m) return "";
    return `<strong>Keywords:</strong> ${esc(m.keywords)}<br><strong>Advantages:</strong> ${esc(m.advantages)}<br><strong>Disadvantages:</strong> ${esc(m.disadvantages)}`;
  },

  getElementMeaning(element) {
    const m = this.elements[element];
    if (!m) return "";
    // traits already contain <strong> tags from frozen data — those are trusted static strings
    return `<strong>Represents:</strong> ${esc(m.represents)}<br><strong>Character Traits:</strong><br>${m.traits}`;
  },

  getSefiraMeaning(sefira) {
    const m = this.sefira[sefira];
    if (!m) return "";
    return `<strong>Symbols:</strong> ${esc(m.symbols)}<br><strong>Associated Titles:</strong> ${esc(m.titles)}<br><strong>Keywords:</strong> ${esc(m.keywords)}`;
  },

  getTarotMeaning(suit, number) {
    if (suit === 'major') {
      return this.tarot.major[number] || "Tarot meaning not available.";
    }
    const suitName = String(suit || '').toLowerCase();
    if (this.tarot[suitName]) {
      return this.tarot[suitName][number] || "Tarot meaning not available.";
    }
    return "Tarot meaning not available.";
  }
};

window.DataMeanings = DataMeanings;
export default DataMeanings;
