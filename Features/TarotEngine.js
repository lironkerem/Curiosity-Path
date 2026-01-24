// TarotEngine.js - Optimized & Patched with Click to Reveal

class TarotEngine {
  constructor(app) {
    this.app = app;
    this.TAROT_BASE_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/';
    this.CARD_BACK_URL = 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tarot%20Cards%20images/CardBacks.jpg';

    this.spreads = {
      single: { name: 'A Single Card Oracle Spread', cards: 1, desc: 'A Single Card Clarification', positions: ['A Single Card'] },
      three: { name: 'A 3 Cards Quick Spread', cards: 3, desc: 'Past • Present • Future', positions: ['Past', 'Present', 'Future'] },
      six: { name: 'A 6 Cards Insight Spread', cards: 6, desc: 'Situational Analysis', positions: ['Situation', 'Challenge', 'Past Influence', 'Future Influence', 'Your Power', 'Outcome'] },
      options: { name: 'The Options Spread', cards: 9, desc: 'Evaluate your different Options', positions: ['Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)', 'Past (Subconscious)', 'Present (Conscious)', 'Future (Unconscious)'] },
      pyramid: {
        name: 'The Pyramid Spread',
        cards: 9,
        desc: 'Triangle of Past – Present – Future',
        positions: ['Where you came from', 'Where you came from', 'Where you came from', 'Where you are now', 'Where you are now', 'Where you are now', 'Where are you going', 'Where are you going', 'Where are you going']
      },
      cross: { name: 'The Simple Cross Spread', cards: 5, desc: 'A Simple Cross Snapshot of Now', positions: ['Direction of the Situation', 'The Root of the Situation', 'Summary', 'Positive side of Situation', 'Obstacles-Challenges'] }
    };

    this.selectedSpread = 'single';
    this.shuffledDeck = [];
    this.flippedCards = new Set();
    this.currentReading = [];
    this.cleanup = null;
    this.prepareReading();
  }

  /* ---------- Card names, images, meanings ---------- */
  getTarotCardName(number, suit = 'major') {
    if (suit === 'major') {
      const names = { 0: "The Fool", 1: "The Magician", 2: "The High Priestess", 3: "The Empress", 4: "The Emperor", 5: "The Hierophant", 6: "The Lovers", 7: "The Chariot", 8: "Strength", 9: "The Hermit", 10: "Wheel of Fortune", 11: "Justice", 12: "The Hanged Man", 13: "Death", 14: "Temperance", 15: "The Devil", 16: "The Tower", 17: "The Star", 18: "The Moon", 19: "The Sun", 20: "Judgement", 21: "The World" };
      return names[number] || "The Fool";
    } else {
      const suitNames = { pentacles: 'Pentacles', swords: 'Swords', cups: 'Cups', wands: 'Wands' };
      if (number <= 10) return `${number} of ${suitNames[suit]}`;
      const courts = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };
      return `${courts[number]} of ${suitNames[suit]}`;
    }
  }

  getTarotCardImage(number, suit = 'major') {
    if (suit === 'major') {
      const num = String(number).padStart(2, '0');
      const name = this.getTarotCardName(number, 'major').replace(/\s+/g, '');
      return `${this.TAROT_BASE_URL}${num}-${name}.jpg`;
    } else {
      const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);
      const num = String(number).padStart(2, '0');
      return `${this.TAROT_BASE_URL}${suitCap}${num}.jpg`;
    }
  }

  getTarotCardMeaning(number, suit = 'major') {
    if (suit === 'major') {
      const meanings = { 0: "A sacred beginning, full of faith and curiosity. Trust the unknown path before you.", 1: "All the tools are in your hands. You are the bridge between spirit and matter.", 2: "Silence holds the answers you seek. Trust your inner knowing.", 3: "The Earth mirrors your abundance. Nurture what you love.", 4: "True power is built through order and wisdom. Take authority over your life.", 5: "Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.", 6: "Union of soul and choice of heart. Harmony is born when love aligns with truth.", 7: "Willpower shapes destiny. Victory is achieved through balance of heart and mind.", 8: "Gentle courage tames inner storms. True strength is soft yet unbreakable.", 9: "Withdraw to reconnect with your light. The answers you seek are within.", 10: "Life turns in divine rhythm. Every rise and fall carries hidden blessings.", 11: "The scales always balance in time. Choose integrity.", 12: "Surrender brings revelation. Sometimes you must pause to see from a higher angle.", 13: "Endings are beginnings disguised. Transformation renews you into higher truth.", 14: "Balance is your sacred art. Patience and moderation bring peace.", 15: "Bondage is often self-made. Recognize what controls you and reclaim your power.", 16: "When illusion collapses, liberation follows. Trust the breakdown.", 17: "Hope returns like light after storm. Believe again in miracles.", 18: "The path is unclear but alive with mystery. Feel your way through intuition.", 19: "Joy, clarity, and vitality fill your being. Let your light shine.", 20: "Awakening through self-realization. Rise into your higher purpose.", 21: "Completion, integration, and mastery. Celebrate how far you've come." };
      return meanings[number] || "New beginnings and infinite possibility await you.";
    } else if (number <= 10) {
      return this.getMinorArcanaMeaning(number, suit);
    } else {
      return this.getCourtCardMeaning(number, suit);
    }
  }

  getMinorArcanaMeaning(number, suit) {
    const meanings = {
      pentacles: { 1: "New financial opportunity or material beginning. Plant seeds for future abundance.", 2: "Balance between multiple priorities. Juggling responsibilities with grace.", 3: "Collaboration and teamwork. Your skills are recognized and valued.", 4: "Holding on too tightly. Security through control or fear of loss.", 5: "Financial or material hardship. Temporary struggle leads to resilience.", 6: "Generosity and fair exchange. Giving and receiving in balance.", 7: "Patience with long-term investments. Results take time to manifest.", 8: "Mastery through practice. Dedication to craft and skill development.", 9: "Self-sufficiency and material comfort. Enjoying the fruits of your labor.", 10: "Lasting wealth and legacy. Family, tradition, and generational abundance." },
      swords: { 1: "Mental clarity and breakthrough. Truth cuts through confusion.", 2: "Difficult decision or stalemate. Time to weigh options carefully.", 3: "Heartbreak or painful truth. Necessary release brings healing.", 4: "Rest and recovery. Taking time to recharge mentally.", 5: "Conflict and defeat. Learning humility through challenge.", 6: "Transition to calmer waters. Moving away from turmoil.", 7: "Deception or strategy. Proceed with awareness and caution.", 8: "Mental restriction. Breaking free from limiting beliefs.", 9: "Anxiety and worry. Nightmares that lose power in daylight.", 10: "Ending of a difficult cycle. Rock bottom becomes foundation." },
      cups: { 1: "New emotional beginning. Opening your heart to love and connection.", 2: "Partnership and mutual attraction. Harmony between two souls.", 3: "Celebration and friendship. Joy shared multiplies.", 4: "Emotional apathy or missed opportunity. Look beyond dissatisfaction.", 5: "Loss and disappointment. Grief that teaches perspective.", 6: "Nostalgia and innocence. Returning to simpler joys.", 7: "Illusion and fantasy. Ground dreams in reality.", 8: "Walking away from the familiar. Seeking deeper meaning.", 9: "Emotional fulfillment. Wishes granted, contentment realized.", 10: "Lasting happiness and family harmony. Emotional abundance overflows." },
      wands: { 1: "Creative spark and new inspiration. Bold initiative ignites passion.", 2: "Future planning and decisions. Vision meets preparation.", 3: "Expansion and foresight. Progress through strategic action.", 4: "Celebration and homecoming. Stability through joyful foundation.", 5: "Competition and conflict. Growth through challenge.", 6: "Victory and recognition. Success earned through perseverance.", 7: "Standing your ground. Defending your position with courage.", 8: "Swift action and momentum. Things move quickly now.", 9: "Resilience and persistence. Nearly there—don't give up.", 10: "Burden of responsibility. Carrying weight that may not be yours." }
    };
    return meanings[suit]?.[number] || "This card brings its unique energy to your reading.";
  }

  getCourtCardMeaning(number, suit) {
    const courtNames = { 11: 'Page', 12: 'Knight', 13: 'Queen', 14: 'King' };
    const rank = courtNames[number];
    const meanings = {
      pentacles: { Page: "Student of the material world. Eager to learn practical skills and build security.", Knight: "Methodical and reliable. Steady progress toward tangible goals.", Queen: "Nurturer of resources. Abundant, practical, and grounded in care.", King: "Master of the material realm. Wealthy in wisdom and resources." },
      swords: { Page: "Curious mind seeking truth. Quick wit but inexperienced with consequences.", Knight: "Driven by ideals and logic. Charging forward with mental clarity.", Queen: "Sharp intellect with experience. Clear boundaries and honest communication.", King: "Authority through wisdom. Just, logical, and fair in judgment." },
      cups: { Page: "Emotionally open and intuitive. Beginning to understand feelings and dreams.", Knight: "Romantic and idealistic. Following the heart with passion.", Queen: "Emotionally mature and compassionate. Deeply intuitive and nurturing.", King: "Emotional mastery and diplomacy. Calm waters and balanced heart." },
      wands: { Page: "Enthusiastic explorer. New creative ventures and bold messages.", Knight: "Adventurous and impulsive. Chasing passion with fiery energy.", Queen: "Confident and charismatic. Inspiring others through authentic presence.", King: "Visionary leader. Turning inspiration into lasting impact." }
    };
    return meanings[suit]?.[rank] || "This court card represents a person or energy in your life.";
  }

  /* ---------- Deck & shuffle ---------- */
  buildFullDeck() {
    const fullDeck = [];
    for (let i = 0; i <= 21; i++) fullDeck.push({ type: 'major', number: i, suit: 'major' });
    const suits = ['pentacles', 'swords', 'cups', 'wands'];
    suits.forEach(suit => { for (let i = 1; i <= 14; i++) fullDeck.push({ type: i <= 10 ? 'minor' : 'court', number: i, suit }); });
    return fullDeck;
  }

  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  prepareReading() {
    const fullDeck = this.buildFullDeck();
    this.shuffledDeck = this.shuffleDeck(fullDeck);
    this.flippedCards.clear();
    this.currentReading = [];
  }

  /* ---------- Flip & reveal ---------- */
  flipCard(index) {
    if (this.flippedCards.has(index) || !this.shuffledDeck.length) return;

    const pyramid = document.querySelector('.pyramid-triangle');
    if (pyramid) {
      requestAnimationFrame(() => {
        pyramid.style.minHeight = `${pyramid.offsetHeight}px`;
        pyramid.classList.add('flipping');
        setTimeout(() => {
          pyramid.classList.remove('flipping');
          pyramid.style.minHeight = '';
        }, 900);
      });
    }

    this.flippedCards.add(index);
    const cardData = this.shuffledDeck.pop();
    const card = {
      name: this.getTarotCardName(cardData.number, cardData.suit),
      meaning: this.getTarotCardMeaning(cardData.number, cardData.suit),
      imageUrl: this.getTarotCardImage(cardData.number, cardData.suit),
      cardData
    };
    this.currentReading.push(card);

    const container = document.getElementById(`tarot-card-container-${index}`);
    const front = container.querySelector('.tarot-card-front');
    const details = document.getElementById(`tarot-card-details-${index}`);
    front.innerHTML = `<img src="${card.imageUrl}" alt="${card.name}" class="tarot-card-image" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'tarot-card-error\\'>🃏</div>'">`;
    details.innerHTML = `<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${card.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${card.meaning}</p>`;
    details.style.opacity = '1';
    details.style.transition = 'opacity 0.5s ease 0.5s';
    container.classList.add('flipped');
    this.checkSpreadCompletion();
  }

  /* ---------- Quest & achievements ---------- */
  checkSpreadCompletion() {
    if (this.flippedCards.size === this.spreads[this.selectedSpread].cards) this.completeTarotSpread();
  }

  completeTarotSpread() {
    const spreadType = this.spreads[this.selectedSpread].name;
    
    if (this.app.state) {
      const reading = {
        spreadType,
        spreadKey: this.selectedSpread,
        cards: this.currentReading.map(c => ({ name: c.name, meaning: c.meaning })),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      };
      this.app.state.addEntry('tarot', reading);
    }
    
    const excludedSpreads = ['single', 'three'];
    if (!excludedSpreads.includes(this.selectedSpread)) {
      if (this.app.gamification) {
        this.app.gamification.progressQuest('daily', 'tarot_spread', 1);
        this.app.gamification.incrementTarotSpreads();
      }
      if (this.app.showToast) {
        this.app.showToast(`✨ ${spreadType} complete!`, 'success');
      }
      this.checkAchievements();
    }
  }

  checkAchievements() {
    const total = this.app.state?.data?.tarotEntries?.length || 0;
    const gm = this.app.gamification;
    if (!gm) return;
    if (total === 1) gm.grantAchievement({ id: 'first_tarot', name: 'First Reading', xp: 50, icon: '🃏', inspirational: 'You\'ve opened the door to divine guidance!' });
    if (total === 10) gm.grantAchievement({ id: 'tarot_10', name: 'Tarot Apprentice', xp: 100, icon: '🔮', inspirational: '10 readings! The cards speak to you clearly!' });
    if (total === 50) gm.grantAchievement({ id: 'tarot_50', name: 'Tarot Master', xp: 250, icon: '✨', inspirational: '50 readings! You are attuned to cosmic wisdom!' });
    if (total === 100) gm.grantAchievement({ id: 'tarot_100', name: 'Oracle of the Cards', xp: 500, icon: '🌟', inspirational: '100 readings! The universe speaks through you!' });
  }

  /* ---------- Layout helpers ---------- */
  cardMarkup(index, label) {
    return `
      <div class="flex flex-col items-center mx-auto" style="width: clamp(140px, 24vw, 250px);">
        <h4 class="text-lg font-bold h-8" style="color: var(--neuro-accent); margin-bottom: 0rem;">${label}</h4>
        <div class="tarot-card-flip-container" id="tarot-card-container-${index}" onclick="window.featuresManager.engines.tarot.flipCard(${index})">
          <div class="tarot-card-flip-inner">
            <div class="tarot-card-back">
              <p class="card-reveal-prompt">Click to reveal</p>
              <img src="${this.CARD_BACK_URL}" alt="Card Back" class="tarot-card-image">
            </div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div id="tarot-card-details-${index}" class="text-center" style="opacity: 0; height: clamp(60px, 12vw, 100px); overflow-y: auto; margin-top: 0rem;"></div>
      </div>`;
  }

  renderCustomSpread(spreadKey) {
    const positions = this.spreads[spreadKey].positions;
    if (spreadKey === 'options') {
      return `
        <div class="flex flex-col items-center">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid grid-cols-3 place-items-center" style="margin-bottom: 1.5rem;">
            ${positions.slice(0, 3).map((p, i) => this.cardMarkup(i, p)).join('')}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid grid-cols-3 place-items-center" style="margin-bottom: 1.5rem;">
            ${positions.slice(3, 6).map((p, i) => this.cardMarkup(i + 3, p)).join('')}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid grid-cols-3 place-items-center">
            ${positions.slice(6, 9).map((p, i) => this.cardMarkup(i + 6, p)).join('')}
          </div>
        </div>`;
    }
    if (spreadKey === 'pyramid') {
      return `
        <div class="pyramid-triangle">
          <div class="pyr-row pyr-apex">${this.cardMarkup(8, positions[8])}${this.cardMarkup(0, positions[0])}</div>
          <div class="pyr-row pyr-upper">${this.cardMarkup(7, positions[7])}${this.cardMarkup(1, positions[1])}</div>
          <div class="pyr-row pyr-lower">${this.cardMarkup(6, positions[6])}${this.cardMarkup(2, positions[2])}</div>
          <div class="pyr-row pyr-base">${this.cardMarkup(5, positions[5])}${this.cardMarkup(4, positions[4])}${this.cardMarkup(3, positions[3])}</div>
        </div>`;
    }
    if (spreadKey === 'cross') {
      return `
        <div class="cross-shape">
          <div class="cross-top">${this.cardMarkup(3, positions[3])}</div>
          <div class="cross-mid">${this.cardMarkup(0, positions[0])}${this.cardMarkup(2, positions[2])}${this.cardMarkup(1, positions[1])}</div>
          <div class="cross-bot">${this.cardMarkup(4, positions[4])}</div>
        </div>`;
    }
  }

  /* ---------- Main render ---------- */
  render() {
    if (this.cleanup) this.cleanup();

    const tab = document.getElementById('tarot-tab');
    if (!tab) return;

    const spread = this.spreads[this.selectedSpread];
    const customKeys = ['options', 'pyramid', 'cross'];
    let cardArea = '';

    if (customKeys.includes(this.selectedSpread)) {
      cardArea = this.renderCustomSpread(this.selectedSpread);
    } else {
      const num = spread.cards;
      let gridClass = 'md:grid-cols-1';
      if (num === 3) gridClass = 'md:grid-cols-3';
      else if (num === 6) gridClass = 'grid-cols-2 md:grid-cols-3';
      cardArea = `<div class="grid ${gridClass} place-items-center">${Array.from({ length: num }).map((_, i) => this.cardMarkup(i, spread.positions[i])).join('')}</div>`;
    }

    tab.innerHTML = `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/NavTarot.png');
                         --header-title:'';
                         --header-tag:'Self divination, through different Tarot spreads, to assist you in understanding yourself better'">
            <h1>Tarot Cards Guidance</h1>
            <h3>Self divination, through different Tarot spreads, to assist you in understanding yourself better</h3>
            <span class="header-sub"></span>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            ${Object.entries(this.spreads).map(([key, sp]) => {
              const isPremium = ['options', 'pyramid', 'cross'].includes(key);
              const isLocked = isPremium && !this.app.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads');
              return `
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${key}')"
                   class="card cursor-pointer relative ${this.selectedSpread === key ? 'border-4' : ''} ${isLocked ? 'opacity-75' : ''}"
                   style="${this.selectedSpread === key ? 'border-color: var(--neuro-accent);' : ''} padding: 1.5rem;"
                   title="${isLocked ? '🔒 Purchase Advanced Tarot Spreads in Karma Shop to unlock' : ''}">
                ${isPremium ? '<span class="premium-badge-tr">PREMIUM</span>' : ''}
                ${isLocked ? '<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;">🔒</div>' : ''}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${sp.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${sp.desc}</p>
              </div>`;
            }).join('')}
          </div>

          <div class="flex justify-center" style="margin-bottom: 3rem;padding:0 1.5rem;">
            ${(() => {
              const has = this.app?.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
              const locked = !has;
              return `
                <button id="tarot-vision-ai-btn"
                        class="btn w-full inline-flex items-center justify-center gap-3 px-6 py-6 text-xl font-bold text-white rounded-xl shadow transition-transform ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}">
                  🔮 Tarot Vision AI – Take a picture/upload a tarot card to analyse it
                  ${locked ? '<span style="font-size: 3rem; opacity: .3; margin-left: .5rem;">🔒</span>' : ''}
                  <span class="premium-badge">PREMIUM</span>
                </button>`;
            })()}
          </div>

          <div class="card" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${spread.name}</h3>
              <p style="color: var(--neuro-text-light);">Click the cards to reveal their meaning</p>
            </div>
            ${cardArea}
          </div>

        </div>
      </div>

<style>
  .tarot-card-flip-container { 
    width: 100%;
    max-width: 200px;
    aspect-ratio: 200 / 350; 
    perspective: 1000px; 
    cursor: pointer; 
  }
  .tarot-card-flip-inner { 
    position: relative; 
    width: 100%; 
    height: 100%; 
    transition: transform 0.8s; 
    transform-style: preserve-3d; 
  }
  .tarot-card-flip-container.flipped .tarot-card-flip-inner { 
    transform: rotateY(180deg); 
  }
  .tarot-card-back, .tarot-card-front { 
    position: absolute; 
    width: 100%; 
    height: 100%; 
    backface-visibility: hidden; 
  }
  .tarot-card-back { 
    position: relative; 
  }
  .tarot-card-front { 
    transform: rotateY(180deg); 
  }
  .tarot-card-image { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    border-radius: 12px; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
  }
  .tarot-card-error { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    height: 100%; 
    font-size: 4rem; 
  }
  
  /* Card reveal prompt - matching Daily Cards styling */
  .card-reveal-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: clamp(0.7rem, 2.5vw, 0.95rem);
    font-weight: 600;
    letter-spacing: 0.5px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 10;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  @media (min-width: 768px) {
    .card-reveal-prompt {
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
    }
  }
  
  /* Responsive card container */
  #tarot-tab .flex.flex-col.items-center.mx-auto {
    width: 100% !important;
    max-width: 200px;
    min-width: 0;
    flex-shrink: 1;
  }
  
  #tarot-tab .flex.flex-col.items-center.mx-auto h4 {
    font-size: clamp(0.65rem, 2.5vw, 1.125rem);
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
  
  #tarot-tab [id^="tarot-card-details-"] {
    font-size: clamp(0.6rem, 2vw, 0.875rem);
    height: clamp(40px, 12vw, 100px);
  }
  
  #tarot-tab .grid { 
    gap: 0.5rem;
    max-width: 100%;
    padding: 0 0.75rem;
    min-width: 0;
    width: 100%;
  }
  
  #tarot-tab .grid.md\:grid-cols-3,
  #tarot-tab .grid.grid-cols-2.md\:grid-cols-3 {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    column-gap: 0.5rem !important;
    row-gap: 0.75rem !important;
  }
  
  @media (min-width: 400px) {
    #tarot-tab .grid {
      gap: 0.65rem;
      padding: 0 1rem;
    }
    #tarot-tab .grid.md\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\:grid-cols-3 {
      column-gap: 0.65rem !important;
      row-gap: 0.85rem !important;
    }
  }
  
  @media (min-width: 640px) {
    #tarot-tab .grid {
      gap: 0.75rem;
      padding: 0 1rem;
    }
    #tarot-tab .grid.md\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\:grid-cols-3 {
      column-gap: 0.75rem !important;
      row-gap: 1rem !important;
    }
  }
  
  @media (min-width: 768px) {
    #tarot-tab .grid { 
      gap: 1rem 1.5rem; 
      padding: 0;
    }
    #tarot-tab .grid.md\:grid-cols-3,
    #tarot-tab .grid.grid-cols-2.md\:grid-cols-3 {
      column-gap: 1.5rem !important;
      row-gap: 1rem !important;
    }
    .tarot-card-flip-container { 
      max-width: 220px; 
    }
    #tarot-tab .flex.flex-col.items-center.mx-auto { 
      max-width: 220px;
    }
  }
  
  @media (min-width: 1600px) { 
    .tarot-card-flip-container { 
      max-width: 240px; 
    }
    #tarot-tab .flex.flex-col.items-center.mx-auto { 
      max-width: 240px;
    }
  }
  
  /* Pyramid layout */
  .pyramid-triangle { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .pyr-row { display: flex; justify-content: center; gap: 0.5rem; width: 100%; }
  @media (min-width: 768px) {
    .pyramid-triangle { gap: 1rem; }
    .pyr-row { gap: 1rem; }
    .pyr-apex { gap: 2rem; }
    .pyr-upper { gap: 8rem; }
    .pyr-lower { gap: 14rem; }
    .pyr-base { gap: 6rem; }
  }
  @media (min-width: 1024px) {
    .pyr-upper { gap: 15rem; }
    .pyr-lower { gap: 25rem; }
    .pyr-base { gap: 12rem; }
  }
  
  /* Cross layout */
  .cross-shape { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  .cross-top, .cross-bot { display: flex; justify-content: center; }
  .cross-mid { display: flex; justify-content: center; gap: 0.5rem; }
  @media (min-width: 768px) {
    .cross-shape { gap: 1rem; }
    .cross-mid { gap: 8rem; }
  }
  @media (min-width: 1024px) {
    .cross-mid { gap: 15rem; }
  }
  
  .premium-badge {
    position: static;
    transform: none;
    margin-left: 0.75rem;
    background: linear-gradient(135deg, #fcd34d, #f59e0b);
    color: #111;
    font-size: .65rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 9999px;
    letter-spacing: .5px;
  }
</style>
    `;

    setTimeout(() => {
      const visionBtn = document.getElementById('tarot-vision-ai-btn');
      if (visionBtn) {
        const handler = () => {
          const locked = !this.app.gamification?.state?.unlockedFeatures?.includes('tarot_vision_ai');
          if (locked) {
            this.app.showToast('🔒 Unlock Tarot Vision AI in the Karma Shop!', 'info');
          } else {
            this.app.showToast('📸 Tarot Vision AI opening...', 'info');
            // Add your AI vision feature trigger here
          }
        };
        visionBtn.onclick = handler;
        this.cleanup = () => { visionBtn.onclick = null; };
      }
    }, 0);
  }

  selectSpread(spreadKey) {
    const premiumSpreads = ['options', 'pyramid', 'cross'];
    if (premiumSpreads.includes(spreadKey) && 
        !this.app.gamification?.state?.unlockedFeatures?.includes('advance_tarot_spreads')) {
      this.app.showToast('🔒 Unlock Advanced Tarot Spreads in the Karma Shop!', 'info');
      return;
    }
    this.selectedSpread = spreadKey;
    this.prepareReading();
    this.render();
    
    // Scroll to cards section
    setTimeout(() => {
      const cardsSection = document.querySelector('#tarot-tab .card:last-child');
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  reset() {
    this.selectSpread(this.selectedSpread);
  }
}

if (typeof window !== 'undefined') window.TarotEngine = TarotEngine;
export default TarotEngine;