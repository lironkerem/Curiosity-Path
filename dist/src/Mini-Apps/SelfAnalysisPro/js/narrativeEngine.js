// Mini-Apps/SelfAnalysisPro/js/narrativeEngine.js
// Narrative Engine: Numerology + Astrology + Tree of Life

// -----------------------------
// Templates & Static Text Data (all frozen)
// -----------------------------
const NumerologySingles = Object.freeze({
  1:  Object.freeze({ single: "You carry the fire of the pioneer, blazing trails with courage and independence.", lifePath: "You are here to learn independence and leadership, forging your own way with courage.", destiny: "Your purpose is to lead with initiative, showing others the power of self-reliance.", soulUrge: "Your heart longs for independence, freedom, and the chance to lead boldly.", personality: "You appear as confident and determined, someone who takes the lead naturally." }),
  2:  Object.freeze({ single: "You carry the gift of peace and partnership, seeking harmony and connection.", lifePath: "You are here to walk the path of peace and partnership, learning sensitivity and cooperation.", destiny: "Your purpose is to create harmony, bringing people together through diplomacy and care.", soulUrge: "Your heart longs for closeness, peace, and the beauty of deep connection.", personality: "You appear as gentle and kind, someone who brings calm and cooperation." }),
  3:  Object.freeze({ single: "You carry the joy of expression, a voice that inspires with creativity and light.", lifePath: "You are here to explore joy, creativity, and expression, sharing your light with others.", destiny: "Your purpose is to inspire through words, creativity, and joyful self-expression.", soulUrge: "Your heart longs for joy, creativity, and the freedom to express yourself.", personality: "You appear as expressive and charming, someone full of life and creativity." }),
  4:  Object.freeze({ single: "You carry the strength of the builder, grounding life in order and stability.", lifePath: "You are here to build strong foundations, mastering discipline, order, and stability.", destiny: "Your purpose is to create order and stability, building systems that last.", soulUrge: "Your heart longs for stability, order, and the security of solid foundations.", personality: "You appear as steady and dependable, someone grounded and practical." }),
  5:  Object.freeze({ single: "You carry the spirit of freedom, restless for change, adventure, and discovery.", lifePath: "You are here to embrace freedom, change, and adventure as your central lessons.", destiny: "Your purpose is to bring change, adaptability, and a spirit of adventure to others.", soulUrge: "Your heart longs for adventure, variety, and the thrill of discovery.", personality: "You appear as lively and curious, someone open to change and new ideas." }),
  6:  Object.freeze({ single: "You carry the heart of service, nurturing others with care and responsibility.", lifePath: "You are here to learn responsibility, love, and service through caring for others.", destiny: "Your purpose is to serve as a nurturer, spreading love, care, and responsibility.", soulUrge: "Your heart longs for love, harmony, and the chance to care for others.", personality: "You appear as warm and caring, someone devoted to love and responsibility." }),
  7:  Object.freeze({ single: "You carry the wisdom of the seeker, searching for truth in mystery and spirit.", lifePath: "You are here to seek wisdom, mystery, and spiritual truth as your guiding lessons.", destiny: "Your purpose is to share wisdom, insight, and spiritual depth with the world.", soulUrge: "Your heart longs for solitude, reflection, and the search for inner truth.", personality: "You appear as thoughtful and wise, someone who values depth and reflection." }),
  8:  Object.freeze({ single: "You carry the force of ambition, learning to balance power with integrity.", lifePath: "You are here to learn mastery of power, ambition, and material success with integrity.", destiny: "Your purpose is to manage power and resources wisely, building success with integrity.", soulUrge: "Your heart longs for success, recognition, and the ability to achieve mastery.", personality: "You appear as powerful and ambitious, someone others see as strong and capable." }),
  9:  Object.freeze({ single: "You carry the compassion of the giver, serving humanity with love and generosity.", lifePath: "You are here to serve with compassion, embodying universal love and generosity.", destiny: "Your purpose is to uplift humanity with compassion, service, and generosity.", soulUrge: "Your heart longs for compassion, giving, and serving something greater than yourself.", personality: "You appear as compassionate and generous, someone who radiates understanding." }),
  11: Object.freeze({ single: "You carry the light of vision, a channel of intuition and inspiration.", lifePath: "You are here to walk a higher spiritual path, learning to channel vision and intuition.", destiny: "Your purpose is to awaken others through spiritual light, vision, and inspiration.", soulUrge: "Your heart longs for spiritual connection, inspiration, and a higher calling.", personality: "You appear as intuitive and inspiring, someone with a presence that uplifts." }),
  22: Object.freeze({ single: "You carry the calling of the master builder, turning dreams into reality for many.", lifePath: "You are here to realize great dreams, grounding vision into practical structures.", destiny: "Your purpose is to build on a large scale, manifesting dreams into reality for many.", soulUrge: "Your heart longs to build something meaningful, leaving a legacy that endures.", personality: "You appear as capable and visionary, someone others trust to make big things happen." }),
  33: Object.freeze({ single: "You carry the path of the master teacher, uplifting others through compassion, guidance, and love.", lifePath: "You are here to live as a Master Teacher, guided by compassion, selfless service, and spiritual responsibility.", destiny: "Your purpose is to uplift as a healer and teacher, spreading wisdom and kindness through love.", soulUrge: "Your heart longs to nurture and guide others, finding joy in service and teaching.", personality: "You appear as a gentle yet powerful presence, someone others see as a teacher and healer." })
});

const NumerologyPairRules = Object.freeze({
  "7-8":  "a seeker of hidden truths whose quiet depth meets the authority of presence. You unite wisdom with leadership, showing true power comes from inner clarity.",
  "5-4":  "an explorer drawn to freedom who is asked to master discipline. Your soul learns to dance between adventure and order, building structures that breathe.",
  "9-6":  "a compassionate visionary guided by love and care. You are called to serve humanity with a nurturing heart that heals and protects.",
  "1-3":  "a pioneer of bold beginnings whose purpose is to create and inspire. You blaze trails through expressive action, stirring others with vision and joy.",
  "2-7":  "a sensitive peacemaker with a quiet thirst for truth. You bridge heart and mind, turning intuition into wisdom others can trust.",
  "6-8":  "a nurturer whose path is bound with power. You learn to care for others while standing tall in authority, showing compassion and strength belong together.",
  "3-5":  "a joyful communicator with the restless spirit of a traveler. You bring stories, laughter and fresh ideas wherever you go.",
  "4-9":  "a builder of foundations whose inner longing is to heal the world. You turn stability into service, proving order can serve compassion.",
  "2-11": "a gentle mediator whose destiny shines with spiritual light. You channel intuition into illumination for others, balancing sensitivity with vision.",
  "4-22": "a master builder whose path is to create lasting structures. You ground higher vision into practical form, building legacies that endure.",
  "8-2":  "a leader driven by power who longs for peace. Your challenge is to rule not with force but with sensitivity, proving strength and gentleness can walk together.",
  "3-9":  "an expressive soul whose destiny is service. You uplift through words, art and inspiration, weaving joy into compassion.",
  "5-1":  "an adventurer who wears the mask of a pioneer. You inspire others with bold steps into freedom, leading by example.",
  "7-11": "a mystic seeker whose destiny is illumination. Your private search for truth ripples outward, shining as guidance for many.",
  "6-3":  "a caretaker with a joyful face. You nurture others with responsibility, laughter and creativity that lifts heavy hearts.",
  "2-8":  "a gentle soul learning the language of power. You prove that true authority is built on cooperation and respect.",
  "1-9":  "a humanitarian with a warrior's spirit. You fight for compassion, standing strong as a champion for those without voice.",
  "4-7":  "a builder who longs for inner truth. You ground spiritual wisdom into steady form, showing the sacred can live in structure.",
  "1-5":  "a trailblazer who craves freedom. You lead others into new experiences, showing independence is not isolation but adventure.",
  "5-11": "a restless traveler whose heart hears divine whispers. Your freedom-seeking path is also a spiritual calling, turning movement into illumination.",
  "7-9":  "a quiet seeker with a public face of compassion. You hold wisdom inside and kindness outside, embodying both depth and service.",
  "6-22": "a guardian of love chosen to build on a grand scale. You pour care into structures that uplift humanity.",
  "3-8":  "a communicator with the drive for success. You turn creativity into achievement, showing expression can also be power.",
  "2-6":  "a mediator who appears as the caretaker. You carry sensitivity and responsibility, proving that peace and love are the same force.",
  "7-33": "Together, your numbers weave compassion with wisdom, marking you as a Mystic Teacher who guides with both heart and insight.",
  "11-33":"Together, your numbers unite compassion with vision, making you an Inspired Guide whose love awakens others to their higher path.",
  "22-33":"Together, your numbers blend compassion with the master builder's power, creating a Master Architect who raises people and structures in service of humanity.",
  "6-33": "Together, your numbers echo the voice of the Healer twice over \u2014 a double call to serve with love, devotion and care.",
  "9-33": "Together, your numbers shine with universal love, shaping you into a Humanitarian Leader whose compassion embraces all."
});

const NumerologyTriplets = Object.freeze({
  "7-11-33":  "You are the Prophet-Teacher \u2014 a soul of wisdom, vision, and compassion, guiding humanity through light, truth, and love.",
  "7-22-33":  "You are the Master Builder of Wisdom \u2014 grounding spiritual truth and compassion into structures that uplift many.",
  "6-9-33":   "You are the Triple Healer \u2014 an overflowing current of service and love, devoted to healing hearts and serving humanity.",
  "9-11-33":  "You are the Compassionate Visionary \u2014 called to teach and inspire on a universal scale, channeling love and higher vision.",
  "11-22-33": "You are the Teacher-Architect of Light \u2014 uniting vision, structure, and compassion to build legacies that endure."
});

const AstrologyTemplates = Object.freeze({
  sun: Object.freeze({
    meaning: "Your Sun sign is your core self \u2014 it shows your life force, identity, and vitality.",
    signs: Object.freeze({
      aries: "In Aries, your Sun burns with courage, drive, and pioneering fire.", taurus: "In Taurus, your Sun rests in patience, stability, and earthy strength.",
      gemini: "In Gemini, your Sun shines with curiosity, ideas, and a quicksilver spirit.", cancer: "In Cancer, your Sun glows with care, intuition, and emotional depth.",
      leo: "In Leo, your Sun blazes with confidence, pride, and radiant energy.", virgo: "In Virgo, your Sun moves with precision, service, and quiet diligence.",
      libra: "In Libra, your Sun seeks balance, beauty, and harmony in all things.", scorpio: "In Scorpio, your Sun carries depth, power, and transformative force.",
      sagittarius: "In Sagittarius, your Sun soars with freedom, truth, and a love of adventure.", capricorn: "In Capricorn, your Sun climbs with ambition, discipline, and steady vision.",
      aquarius: "In Aquarius, your Sun shines with originality, insight, and humanitarian spirit.", pisces: "In Pisces, your Sun flows with imagination, compassion, and dreamy wisdom."
    })
  }),
  moon: Object.freeze({
    meaning: "Your Moon sign is your emotional world \u2014 it shows how you feel, respond, and nurture yourself.",
    signs: Object.freeze({
      aries: "With Moon in Aries, your feelings are fiery, quick, and full of passion.", taurus: "With Moon in Taurus, your emotions are steady, calm, and rooted in comfort.",
      gemini: "With Moon in Gemini, your emotions are playful, curious, and changeable.", cancer: "With Moon in Cancer, your emotions are nurturing, sensitive, and protective.",
      leo: "With Moon in Leo, your emotions are expressive, warm, and dramatic.", virgo: "With Moon in Virgo, your emotions are thoughtful, practical, and refined.",
      libra: "With Moon in Libra, your emotions are gentle, balanced, and harmony-seeking.", scorpio: "With Moon in Scorpio, your emotions are deep, intense, and transformative.",
      sagittarius: "With Moon in Sagittarius, your emotions are adventurous, optimistic, and restless.", capricorn: "With Moon in Capricorn, your emotions are steady, serious, and resilient.",
      aquarius: "With Moon in Aquarius, your emotions are detached, clear, and original.", pisces: "With Moon in Pisces, your emotions are compassionate, imaginative, and dreamy."
    })
  }),
  rising: Object.freeze({
    meaning: "Your Rising sign is your outer mask \u2014 it shows how you come across to others and the energy you project.",
    signs: Object.freeze({
      aries: "With Aries Rising, you appear bold, dynamic, and ready for action.", taurus: "With Taurus Rising, you appear calm, grounded, and reliable.",
      gemini: "With Gemini Rising, you appear lively, curious, and expressive.", cancer: "With Cancer Rising, you appear gentle, caring, and protective.",
      leo: "With Leo Rising, you appear radiant, proud, and full of presence.", virgo: "With Virgo Rising, you appear thoughtful, refined, and precise.",
      libra: "With Libra Rising, you appear graceful, diplomatic, and balanced.", scorpio: "With Scorpio Rising, you appear mysterious, intense, and magnetic.",
      sagittarius: "With Sagittarius Rising, you appear open, adventurous, and enthusiastic.", capricorn: "With Capricorn Rising, you appear steady, ambitious, and dignified.",
      aquarius: "With Aquarius Rising, you appear unique, inventive, and progressive.", pisces: "With Pisces Rising, you appear soft, imaginative, and compassionate."
    })
  })
});

const SignToElement = Object.freeze({
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water"
});

const AstrologyTriplets = Object.freeze({
  "leo-gemini-pisces":          "Radiant, imaginative, and curious \u2014 you bring light through both heart and expression.",
  "scorpio-cancer-capricorn":   "Deep, nurturing, and resilient \u2014 you guard what you love with strength and vision.",
  "virgo-taurus-capricorn":     "Practical, steady, and grounded \u2014 you create stability and shape the world with patience.",
  "sagittarius-aries-leo":      "Bold, passionate, and dynamic \u2014 you inspire through courage and zest for life.",
  "aquarius-libra-gemini":      "Ideas flow with brilliance \u2014 you shine as a thinker, connector, and innovator."
});

const TreeTemplates = Object.freeze({
  keter:     "Keter is the crown, pure spirit before form \u2014 your path begins in divine inspiration.",
  chokhmah:  "Chokhmah is wisdom, the spark of insight \u2014 your path is to see beyond the surface.",
  binah:     "Binah is understanding, the womb of form \u2014 your path is to give structure to vision.",
  chesed:    "Chesed is mercy, overflowing love \u2014 your path is to give generously and expand with kindness.",
  gevurah:   "Gevurah is discipline, strength, and limits \u2014 your path is to learn balance through boundaries.",
  tiferet:   "Tiferet is harmony, beauty, and balance \u2014 your path is to unite heart, mind, and spirit.",
  netzach:   "Netzach is victory, persistence, and endurance \u2014 your path is to move forward with courage and resilience.",
  hod:       "Hod is glory, intellect, and communication \u2014 your path is to honor truth through expression and clarity.",
  yesod:     "Yesod is foundation, connection, and energy flow \u2014 your path is to bridge the inner and the outer, spirit and matter.",
  malkhut:   "Malkhut is kingdom, embodiment \u2014 your path is to bring spirit fully into the world, living as the vessel of creation."
});

const TreeBridges = Object.freeze({
  "chesed-gevurah": "You walk the bridge between Chesed and Gevurah \u2014 balancing love with discipline.",
  "tiferet-yesod":  "You walk the bridge between Tiferet and Yesod \u2014 harmony rooted in foundation.",
  "netzach-hod":    "You walk the bridge between Netzach and Hod \u2014 persistence guided by clarity."
});

// -------------------------
// Helper functions
// -------------------------
function numerologySpecialOverride(nums) {
  const counts = {};
  nums.forEach(n => { counts[n] = (counts[n] || 0) + 1; });

  if (counts[33] >= 3) {
    return "Your chart resounds with the rare frequency of Master 33, a soul born to teach, heal, and serve at the highest level. Compassion is not just your path but your essence \u2014 you embody love as a living presence, guiding others by example.";
  }
  for (const numStr in counts) {
    const num = Number(numStr);
    if (counts[num] >= 3) {
      const s = NumerologySingles[num]?.single;
      if (s) return `Three of your core numbers are ${num}. ${s} This alignment gives a focused intensity to that quality in your life.`;
    }
  }
  return null;
}

function checkAstrologyOverride(astrology) {
  const { sun, moon, rising } = astrology;
  if (!sun || !moon || !rising) return null;
  if (sun === moon && moon === rising) {
    const capSign = sun.charAt(0).toUpperCase() + sun.slice(1);
    return `Your chart burns with pure ${capSign} energy \u2014 your identity, emotions, and presence all aligned as one expression.`;
  }
  return null;
}

function checkAstrologyTriplet(astrology) {
  const { sun, moon, rising } = astrology;
  if (!sun || !moon || !rising) return null;
  const key = [sun, moon, rising].slice().sort().join('-');
  return AstrologyTriplets[key] || null;
}

function checkAstrologyPairs(astrology) {
  const { sun, moon, rising } = astrology;
  const results = [];
  if (!sun || !moon || !rising) return results;

  const sunElem    = SignToElement[sun];
  const moonElem   = SignToElement[moon];
  const risingElem = SignToElement[rising];

  if (sunElem === moonElem) {
    results.push(`Your Sun and Moon share the ${sunElem} element, giving unity between your core self and your feelings.`);
  } else {
    if (sunElem === 'fire'  && moonElem === 'water') results.push('You burn with passion yet feel with depth \u2014 a dynamic of action and sensitivity.');
    if (sunElem === 'earth' && moonElem === 'air')   results.push('Your grounded self meets a restless mind \u2014 steady yet curious.');
  }
  if (risingElem === 'fire'  && (sunElem === 'water' || moonElem === 'water')) results.push('Though your inner self feels deeply, you project a bold, fiery presence.');
  if (risingElem === 'earth' && (sunElem === 'air'   || moonElem === 'air'))   results.push('Though ideas flow within, your outer presence appears steady and practical.');

  return results;
}

function getAstrologyClosing(astrology) {
  const { sun, moon, rising } = astrology;
  if (!sun || !moon || !rising) return 'Your chart holds a balance of forces, each element shaping your wholeness.';

  const counts = { fire: 0, earth: 0, air: 0, water: 0 };
  [sun, moon, rising].forEach(s => { const el = SignToElement[s]; if (el) counts[el]++; });
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

  switch (dominant) {
    case 'fire':  return 'Your chart glows with fire, urging you to act, lead, and inspire.';
    case 'earth': return 'Your chart rests on earth, seeking stability, patience, and steady growth.';
    case 'air':   return 'Your chart moves with air, weaving ideas, communication, and connection.';
    case 'water': return 'Your chart flows with water, guiding you through empathy and intuition.';
    default:      return 'Your chart holds a balance of forces, each element shaping your wholeness.';
  }
}

function checkTreeOverride(tree) {
  if (!tree) return null;
  if (tree === 'keter')   return 'You stand in Keter, the crown of pure spirit \u2014 a soul close to the source of creation.';
  if (tree === 'malkhut') return 'You stand in Malkhut, the vessel of embodiment \u2014 your calling is to live spirit fully in the world.';
  return null;
}

function checkTreeBridge(tree) {
  if (!tree) return null;
  if (tree === 'chesed' || tree === 'gevurah') return TreeBridges['chesed-gevurah'];
  if (tree === 'tiferet' || tree === 'yesod')  return TreeBridges['tiferet-yesod'];
  if (tree === 'netzach' || tree === 'hod')    return TreeBridges['netzach-hod'];
  return null;
}

function getTreeClosing(tree) {
  if (!tree) return 'Your journey unfolds as you walk your sefira\u2019s path, bringing its light to life.';
  switch (tree) {
    case 'keter':   return 'Your journey unfolds as you bring divine inspiration into human experience.';
    case 'binah':   return 'Your journey unfolds as you shape wisdom into understanding and form.';
    case 'tiferet': return 'Your journey unfolds as you harmonize strength and compassion into beauty.';
    case 'yesod':   return 'Your journey unfolds as you channel energy into connection and manifestation.';
    case 'malkhut': return 'Your journey unfolds as you embody spirit in the everyday world.';
    default:        return 'Your journey unfolds as you walk your sefira\u2019s path, bringing its light to life.';
  }
}

function sortedNumericKeyFromPair(a, b) {
  return [Number(a), Number(b)].sort((x, y) => x - y).join('-');
}

function sortedNumericKeyFromTriplet(a, b, c) {
  return [Number(a), Number(b), Number(c)].sort((x, y) => x - y).join('-');
}

function checkNumerologyPairs(nums) {
  const insights = [];
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const key = sortedNumericKeyFromPair(nums[i], nums[j]);
      if (NumerologyPairRules[key] && !seen.has(key)) { insights.push(NumerologyPairRules[key]); seen.add(key); }
    }
  }
  return insights;
}

function checkNumerologyTriplets(nums) {
  const insights = [];
  const seen = new Set();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const key = sortedNumericKeyFromTriplet(nums[i], nums[j], nums[k]);
        if (NumerologyTriplets[key] && !seen.has(key)) { insights.push(NumerologyTriplets[key]); seen.add(key); }
      }
    }
  }
  return insights;
}

function gatherNumerologyInsights(nums) {
  const special = numerologySpecialOverride(nums);
  if (special) return { special, pairs: [], triplets: [] };
  return { special: null, pairs: checkNumerologyPairs(nums), triplets: checkNumerologyTriplets(nums) };
}

function sanitizeSign(sign) {
  if (!sign) return null;
  return String(sign).toLowerCase();
}

function sanitizeTree(tree) {
  if (!tree) return null;
  return String(tree).toLowerCase();
}

function renderNumerologySinglesBlock(numerology) {
  const { lifePath, destiny, soulUrge, personality } = numerology;
  const parts = [];
  if (lifePath  && NumerologySingles[lifePath])   parts.push(`Your Life Path ${lifePath} shows ${NumerologySingles[lifePath].lifePath}`);
  if (destiny   && NumerologySingles[destiny])    parts.push(`Your Destiny ${destiny} reveals ${NumerologySingles[destiny].destiny}`);
  if (soulUrge  && NumerologySingles[soulUrge])   parts.push(`Deep within, your Soul Urge ${soulUrge} says ${NumerologySingles[soulUrge].soulUrge}`);
  if (personality && NumerologySingles[personality]) parts.push(`To the world, your Personality ${personality} appears as ${NumerologySingles[personality].personality}`);
  return parts.join(' ') + ' ';
}

function renderAstrologySinglesBlock(astrology) {
  const sun    = sanitizeSign(astrology.sun);
  const moon   = sanitizeSign(astrology.moon);
  const rising = sanitizeSign(astrology.rising);
  const parts  = [];
  if (sun    && AstrologyTemplates.sun.signs[sun])       parts.push(AstrologyTemplates.sun.meaning    + ' ' + AstrologyTemplates.sun.signs[sun]);
  if (moon   && AstrologyTemplates.moon.signs[moon])     parts.push(AstrologyTemplates.moon.meaning   + ' ' + AstrologyTemplates.moon.signs[moon]);
  if (rising && AstrologyTemplates.rising.signs[rising]) parts.push(AstrologyTemplates.rising.meaning + ' ' + AstrologyTemplates.rising.signs[rising]);
  return parts.join(' ') + ' ';
}

function renderTreeBlock(treeKey) {
  const tree = sanitizeTree(treeKey);
  if (!tree) return '';
  return (TreeTemplates[tree] || `You stand in ${tree}, a unique place on the Tree of Life.`) + ' ';
}

function composeClosings(numerologyClosing, astrologyClosing, treeClosing) {
  return `${numerologyClosing} ${astrologyClosing} ${treeClosing}`.trim();
}

function capitalizeName(name) {
  if (!name) return 'Seeker';
  return String(name).split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

// -------------------------
// Main narrative builder
// -------------------------
function buildNarrative(user) {
  if (!user) return 'No user data provided.';
  const firstName = capitalizeName(user.firstName || 'Seeker');

  const numerology = user.numerology || {};
  const lp   = Number(numerology.lifePath)   || null;
  const dest = Number(numerology.destiny)    || null;
  const soul = Number(numerology.soulUrge)   || null;
  const pers = Number(numerology.personality)|| null;
  const nums = [lp, dest, soul, pers].filter(n => n !== null && !Number.isNaN(n));

  const numerologySpecial = numerologySpecialOverride(nums);
  if (numerologySpecial) {
    const astrology = user.astrology || {};
    const astrologyOverride = checkAstrologyOverride(astrology);
    const astrologyTrip     = checkAstrologyTriplet(astrology);
    const astrologyPairs    = checkAstrologyPairs(astrology);
    const tree = sanitizeTree(user.tree);

    let letter = `${firstName}, my Dear Seeker,\n\n`;
    letter += `${numerologySpecial}\n\n`;
    if (astrologyOverride) {
      letter += `${astrologyOverride}\n\n`;
    } else {
      if (astrologyTrip) letter += `${astrologyTrip}\n\n`;
      if (astrologyPairs?.length > 0) letter += astrologyPairs.join(' ') + '\n\n';
      letter += renderAstrologySinglesBlock(astrology) + '\n';
      letter += getAstrologyClosing(astrology) + '\n\n';
    }
    const treeOverride = checkTreeOverride(tree);
    if (treeOverride) letter += `${treeOverride}\n\n`;
    letter += `${renderTreeBlock(tree)}${getTreeClosing(tree)}\n\n`;
    letter += 'With light and clarity,\nAanandoham\n(Liron Kerem)';
    return letter;
  }

  let narrative = `${firstName}, my Dear Seeker,\n\n`;
  const numerologyTripPairs = gatherNumerologyInsights(nums);
  const hasPairOrTripletInsights =
    (numerologyTripPairs.triplets?.length > 0) || (numerologyTripPairs.pairs?.length > 0);

  if (numerologyTripPairs.triplets?.length > 0) narrative += numerologyTripPairs.triplets.join(' ') + '\n\n';
  if (numerologyTripPairs.pairs?.length > 0)    narrative += numerologyTripPairs.pairs.join(' ')    + '\n\n';

  const singlesBlock = renderNumerologySinglesBlock({ lifePath: lp, destiny: dest, soulUrge: soul, personality: pers });
  if (!hasPairOrTripletInsights) narrative += 'Your numbers speak as the first voices of your soul. ';
  narrative += singlesBlock;
  narrative += '\n\n';

  const astrology = user.astrology || {};
  const astroOverride = checkAstrologyOverride(astrology);
  narrative += 'Your stars add their own music. ';
  if (astroOverride) {
    narrative += astroOverride + '\n\n';
  } else {
    const astroTrip   = checkAstrologyTriplet(astrology);
    const astroPairs  = checkAstrologyPairs(astrology);
    if (astroTrip) narrative += astroTrip + ' ';
    if (astroPairs?.length > 0) narrative += astroPairs.join(' ') + ' ';
    narrative += renderAstrologySinglesBlock(astrology);
    narrative += getAstrologyClosing(astrology) + '\n\n';
  }

  const tree        = sanitizeTree(user.tree);
  const treeOverride = checkTreeOverride(tree);
  if (treeOverride) {
    narrative += treeOverride + ' ';
  } else if (TreeTemplates[tree]) {
    narrative += TreeTemplates[tree] + ' ';
  } else {
    narrative += 'The Tree of Life reflects a unique place for you, carrying lessons that unfold as you walk your path. ';
  }
  const treeBridge = checkTreeBridge(tree);
  if (treeBridge) narrative += treeBridge + ' ';
  narrative += getTreeClosing(tree) + '\n\n';

  // Element/number dominance crossover
  const numGroupCounts = { practical: 0, emotional: 0, spiritual: 0, creative: 0 };
  const groupDef = Object.freeze({ practical: [4,8,22], emotional: [2,6,9,33], spiritual: [7,11], creative: [1,3,5] });
  nums.forEach(n => { for (const g in groupDef) { if (groupDef[g].includes(n)) numGroupCounts[g]++; } });
  const numDominant = Object.entries(numGroupCounts).sort((a, b) => b[1] - a[1])[0][0] || null;

  const astro = user.astrology || {};
  const sun    = sanitizeSign(astro.sun);
  const moon   = sanitizeSign(astro.moon);
  const rising = sanitizeSign(astro.rising);
  let elementDominance = null;
  if (sun && moon && rising) {
    const elCounts = { fire: 0, earth: 0, air: 0, water: 0 };
    [sun, moon, rising].forEach(s => { const el = SignToElement[s]; if (el) elCounts[el]++; });
    elementDominance = Object.entries(elCounts).sort((a, b) => b[1] - a[1])[0][0];
  }

  if (numDominant && elementDominance) {
    if      (numDominant === 'spiritual' && elementDominance === 'water') narrative += 'This inward search (numerology) meets your watery stars, deepening your emotional wisdom and making your spiritual quest especially felt by others.\n\n';
    else if (numDominant === 'creative'  && elementDominance === 'fire')  narrative += 'Your creative drive aligns with fiery stars \u2014 imagination and courage push you forward together.\n\n';
    else if (numDominant === 'practical' && elementDominance === 'earth') narrative += 'Your practical nature finds reflection in earthy stars, strengthening your talent for grounding vision into reality.\n\n';
    else if (numDominant === 'emotional' && elementDominance === 'air')   narrative += "Your heart's drive for connection meets airy clarity, helping you speak feeling into ideas that move others.\n\n";
  }

  const numerologyClosing = (function(lp, dest, soul, pers) {
    const groups = Object.freeze({ practical: [4,8,22], emotional: [2,6,9,33], spiritual: [7,11], creative: [1,3,5] });
    const counts = { practical: 0, emotional: 0, spiritual: 0, creative: 0 };
    [lp, dest, soul, pers].forEach(num => { for (const key in groups) if (groups[key].includes(num)) counts[key]++; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    switch (dominant) {
      case 'practical':  return 'Together these numbers suggest a path of steady creation, where vision becomes form and your strength lies in building what endures.';
      case 'emotional':
        if ([lp, dest, soul, pers].includes(33)) return 'Together these numbers suggest the calling of a Master Teacher \u2014 a path of love, service, and guiding others with compassion.';
        return 'Together these numbers suggest a journey of the heart, where compassion and connection are the forces that guide your way.';
      case 'spiritual':  return 'Together these numbers suggest a sacred path, where wisdom and inner light shape your journey into a beacon for others.';
      case 'creative':   return 'Together these numbers suggest a life of bold expression, where imagination and freedom are the sparks that carry you forward.';
      default:           return 'Together these numbers suggest a path that is uniquely yours \u2014 a dance of soul, destiny, heart and presence.';
    }
  })(lp, dest, soul, pers);

  narrative += composeClosings(numerologyClosing, getAstrologyClosing(astrology), getTreeClosing(tree)) + '\n\n';
  narrative += 'With light and clarity,\nAanandoham\n(Liron Kerem)';
  return narrative;
}

function getNumerologySummary(numerology) {
  if (!numerology) return [];
  const { lifePath, destiny, soulUrge, personality } = numerology;
  const lines = [];
  if (lifePath    && NumerologySingles[lifePath])    lines.push(`<strong>Life Path Number ${lifePath}:</strong> ${NumerologySingles[lifePath].lifePath}`);
  if (destiny     && NumerologySingles[destiny])     lines.push(`<strong>Destiny Number ${destiny}:</strong> ${NumerologySingles[destiny].destiny}`);
  if (soulUrge    && NumerologySingles[soulUrge])    lines.push(`<strong>Soul\u2019s Urge Number ${soulUrge}:</strong> ${NumerologySingles[soulUrge].soulUrge}`);
  if (personality && NumerologySingles[personality]) lines.push(`<strong>Personality Number ${personality}:</strong> ${NumerologySingles[personality].personality}`);
  return lines;
}

function getAstrologySummary(astrology) {
  if (!astrology) return [];
  const { sun, moon, rising } = astrology;
  const lines = [];
  if (sun    && AstrologyTemplates.sun.signs[sun])       lines.push(`Sun: ${AstrologyTemplates.sun.signs[sun]}`);
  if (moon   && AstrologyTemplates.moon.signs[moon])     lines.push(`Moon: ${AstrologyTemplates.moon.signs[moon]}`);
  if (rising && AstrologyTemplates.rising.signs[rising]) lines.push(`Rising: ${AstrologyTemplates.rising.signs[rising]}`);
  return lines;
}

function getTreeSummary(tree) {
  if (!tree) return '';
  return TreeTemplates[sanitizeTree(tree)] || '';
}

export { buildNarrative, getNumerologySummary, getAstrologySummary, getTreeSummary };

if (typeof window !== 'undefined') {
  window.buildNarrative        = buildNarrative;
  window.getNumerologySummary  = getNumerologySummary;
  window.getAstrologySummary   = getAstrologySummary;
  window.getTreeSummary        = getTreeSummary;
}
