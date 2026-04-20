const x={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},k={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},T={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Illusion and fantasy. Ground dreams in reality.",8:"Walking away from the familiar. Seeking deeper meaning.",9:"Emotional fulfillment. Wishes granted, contentment realized.",10:"Lasting happiness and family harmony. Emotional abundance overflows."},wands:{1:"Creative spark and new inspiration. Bold initiative ignites passion.",2:"Future planning and decisions. Vision meets preparation.",3:"Expansion and foresight. Progress through strategic action.",4:"Celebration and homecoming. Stability through joyful foundation.",5:"Competition and conflict. Growth through challenge.",6:"Victory and recognition. Success earned through perseverance.",7:"Standing your ground. Defending your position with courage.",8:"Swift action and momentum. Things move quickly now.",9:"Resilience and persistence. Nearly there-don't give up.",10:"Burden of responsibility. Carrying weight that may not be yours."}},S={pentacles:{Page:"Student of the material world. Eager to learn practical skills and build security.",Knight:"Methodical and reliable. Steady progress toward tangible goals.",Queen:"Nurturer of resources. Abundant, practical, and grounded in care.",King:"Master of the material realm. Wealthy in wisdom and resources."},swords:{Page:"Curious mind seeking truth. Quick wit but inexperienced with consequences.",Knight:"Driven by ideals and logic. Charging forward with mental clarity.",Queen:"Sharp intellect with experience. Clear boundaries and honest communication.",King:"Authority through wisdom. Just, logical, and fair in judgment."},cups:{Page:"Emotionally open and intuitive. Beginning to understand feelings and dreams.",Knight:"Romantic and idealistic. Following the heart with passion.",Queen:"Emotionally mature and compassionate. Deeply intuitive and nurturing.",King:"Emotional mastery and diplomacy. Calm waters and balanced heart."},wands:{Page:"Enthusiastic explorer. New creative ventures and bold messages.",Knight:"Adventurous and impulsive. Chasing passion with fiery energy.",Queen:"Confident and charismatic. Inspiring others through authentic presence.",King:"Visionary leader. Turning inspiration into lasting impact."}},w={11:"Page",12:"Knight",13:"Queen",14:"King"},v={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},b={FLIP_DURATION:900,SCROLL_DELAY:100};class C{constructor(t){this.app=t,this.TAROT_BASE_URL="/Tarot Cards images/",this.CARD_BACK_URL="/Tarot Cards images/CardBacks.webp",this.spreads={single:{name:"A Single Card Oracle Spread",cards:1,desc:"A Single Card Clarification",positions:["A Single Card"]},three:{name:"A 3 Cards Quick Spread",cards:3,desc:"Past • Present • Future",positions:["Past","Present","Future"]},six:{name:"A 6 Cards Insight Spread",cards:6,desc:"Situational Analysis",positions:["Situation","Challenge","Past Influence","Future Influence","Your Power","Outcome"]},options:{name:"The Options Spread",cards:9,desc:"Evaluate your different Options",positions:["Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)"]},pyramid:{name:"The Pyramid Spread",cards:9,desc:"Triangle of Past – Present – Future",positions:["Where you came from","Where you came from","Where you came from","Where you are now","Where you are now","Where you are now","Where are you going","Where are you going","Where are you going"]},cross:{name:"The Simple Cross Spread",cards:5,desc:"A Simple Cross Snapshot of Now",positions:["Direction of the Situation","The Root of the Situation","Summary","Positive side of Situation","Obstacles-Challenges"]}},this.selectedSpread="single",this.shuffledDeck=[],this.flippedCards=new Set,this.currentReading=[],this.cleanup=null,this.cachedElements={},this.prepareReading()}getTarotCardName(t,e="major"){return e==="major"?x[t]||"The Fool":t<=10?`${t} of ${v[e]}`:`${w[t]} of ${v[e]}`}getTarotCardImage(t,e="major"){if(e==="major"){const a=String(t).padStart(2,"0"),o=this.getTarotCardName(t,"major").replace(/\s+/g,"");return`${this.TAROT_BASE_URL}${a}-${o}.webp`}const i=e.charAt(0).toUpperCase()+e.slice(1),r=String(t).padStart(2,"0");return`${this.TAROT_BASE_URL}${i}${r}.webp`}getTarotCardMeaning(t,e="major"){var r,a;if(e==="major")return k[t]||"New beginnings and infinite possibility await you.";if(t<=10)return((r=T[e])==null?void 0:r[t])||"This card brings its unique energy to your reading.";const i=w[t];return((a=S[e])==null?void 0:a[i])||"This court card represents a person or energy in your life."}buildFullDeck(){const t=["pentacles","swords","cups","wands"];return[...Array.from({length:22},(e,i)=>({type:"major",number:i,suit:"major"})),...t.flatMap(e=>Array.from({length:14},(i,r)=>({type:r<10?"minor":"court",number:r+1,suit:e})))]}shuffleDeck(t){const e=[...t];for(let i=e.length-1;i>0;i--){const r=Math.floor(Math.random()*(i+1));[e[i],e[r]]=[e[r],e[i]]}return e}prepareReading(){const t=this.buildFullDeck();this.shuffledDeck=this.shuffleDeck(t),this.flippedCards.clear(),this.currentReading=[],this.cachedElements={}}flipCard(t){if(this.flippedCards.has(t)||!this.shuffledDeck.length)return;const e=this.cachedElements.pyramid||(this.cachedElements.pyramid=document.querySelector(".pyramid-triangle"));e&&requestAnimationFrame(()=>{e.style.minHeight=`${e.offsetHeight}px`,e.classList.add("flipping"),setTimeout(()=>{e.classList.remove("flipping"),e.style.minHeight=""},b.FLIP_DURATION)}),this.flippedCards.add(t);const i=this.shuffledDeck.pop(),r={name:this.getTarotCardName(i.number,i.suit),meaning:this.getTarotCardMeaning(i.number,i.suit),imageUrl:this.getTarotCardImage(i.number,i.suit),cardData:i};this.currentReading.push(r);const a=document.getElementById(`tarot-card-container-${t}`),o=a==null?void 0:a.querySelector(".tarot-card-front"),n=document.getElementById(`tarot-card-details-${t}`);if(!a||!o||!n){console.error(`[TarotEngine] Failed to find card elements for index ${t}`);return}o.innerHTML=`<img src="${r.imageUrl}" alt="${r.name}" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class='tarot-card-error'>🃏</div>'">`,n.innerHTML=`<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${r.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${r.meaning}</p>`,n.style.opacity="1",n.style.transition="opacity 0.5s ease 0.5s",a.classList.add("flipped"),this.checkSpreadCompletion()}checkSpreadCompletion(){this.flippedCards.size===this.spreads[this.selectedSpread].cards&&this.completeTarotSpread()}completeTarotSpread(){const t=this.spreads[this.selectedSpread].name;if(!["single","three"].includes(this.selectedSpread)){if(this.app.state){const i={spreadType:t,spreadKey:this.selectedSpread,cards:this.currentReading.map(r=>({name:r.name,meaning:r.meaning})),timestamp:new Date().toISOString(),date:new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})};this.app.state.addEntry("tarot",i)}this.app.gamification&&this.app.gamification.incrementTarotSpreads(),this.checkAchievements()}}checkAchievements(){var i,r;const t=((r=(i=this.app.gamification)==null?void 0:i.state)==null?void 0:r.totalTarotSpreads)||0,e=this.app.gamification;e&&(t>=1&&e.checkAndGrantBadge("first_tarot",e.getBadgeDefinitions()),t>=10&&e.checkAndGrantBadge("tarot_apprentice",e.getBadgeDefinitions()),t>=25&&e.checkAndGrantBadge("tarot_mystic",e.getBadgeDefinitions()),t>=75&&e.checkAndGrantBadge("tarot_oracle",e.getBadgeDefinitions()),t>=150&&e.checkAndGrantBadge("tarot_150",e.getBadgeDefinitions()),t>=400&&e.checkAndGrantBadge("tarot_400",e.getBadgeDefinitions()))}buildTarotCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" loading="lazy" decoding="async" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Learn & Practice Tarot with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Explore the cards together. Join live readings, share interpretations,
          and deepen your intuition in a space of collective wisdom.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'tarot'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"/></svg>
            Enter the Tarot Room
          </button>
        </div>
      </div>
    `}render(){this.cleanup&&this.cleanup();const t=document.getElementById("tarot-tab");if(!t){console.error("[TarotEngine] tarot-tab element not found");return}const e=this.spreads[this.selectedSpread],i=["options","pyramid","cross"];let r="";if(i.includes(this.selectedSpread))r=this.renderCustomSpread(this.selectedSpread);else{const a=e.cards;let o="md:grid-cols-1";(a===3||a===6)&&(o="tarot-3col-grid");const n=a===1;r=`<div class="grid ${o}${n?"":" place-items-center"}${n?" tarot-single-grid":""}">${Array.from({length:a}).map((d,s)=>this.cardMarkup(s,e.positions[s],n)).join("")}</div>`}t.innerHTML=`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavTarot.webp');
                         --header-title:'';
                         --header-tag:'Self divination, through different Tarot spreads, to assist you in understanding yourself better'">
            <h1>Tarot Cards Guidance</h1>
            <h3>Self divination, through different Tarot spreads, to assist you in understanding yourself better</h3>
            <span class="header-sub"></span>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            ${Object.entries(this.spreads).map(([a,o])=>{var s,h,m,g,l,c,u;const n=["options","pyramid","cross"].includes(a),p=((h=(s=this.app.state)==null?void 0:s.currentUser)==null?void 0:h.isAdmin)||((g=(m=this.app.state)==null?void 0:m.currentUser)==null?void 0:g.isVip),d=n&&!p&&!((u=(c=(l=this.app.gamification)==null?void 0:l.state)==null?void 0:c.unlockedFeatures)!=null&&u.includes("advance_tarot_spreads"));return`
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${a}')"
                   class="card cursor-pointer relative ${this.selectedSpread===a?"border-4":""} ${d?"opacity-75":""}"
                   style="${this.selectedSpread===a?"border-color: var(--neuro-accent);":""} padding: 1.5rem;"
                   title="${d?"Purchase Advanced Tarot Spreads in Karma Shop to unlock":""}">
                ${n?'<span class="premium-badge-tr">PREMIUM</span>':""}
                ${d?'<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':""}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${o.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${o.desc}</p>
              </div>`}).join("")}
          </div>

          <div style="margin-bottom: 3rem; padding: 0 1.5rem;">
            ${(()=>{var p,d,s,h,m,g,l,c,u,f;const n=!(((s=(d=(p=this.app)==null?void 0:p.state)==null?void 0:d.currentUser)==null?void 0:s.isAdmin)||((g=(m=(h=this.app)==null?void 0:h.state)==null?void 0:m.currentUser)==null?void 0:g.isVip)||((f=(u=(c=(l=this.app)==null?void 0:l.gamification)==null?void 0:c.state)==null?void 0:u.unlockedFeatures)==null?void 0:f.includes("tarot_vision_ai")));return`
                <button id="tarot-vision-ai-btn"
                        class="btn ${n?"opacity-50 cursor-not-allowed":"hover:scale-[1.02]"}"
                        style="position:relative;display:flex !important;align-items:center;gap:1.25rem;
                               width:100%;padding:1.25rem 1.5rem;text-align:left;border-radius:0.75rem;
                               min-height:5rem;box-sizing:border-box;">
                  <span class="premium-badge" style="position:absolute;top:0.6rem;right:0.6rem;margin:0;z-index:1;">PREMIUM</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;flex-shrink:0;"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12s1.5-3 5-3 5 3 5 3-1.5 3-5 3-5-3-5-3Z"/><circle cx="12" cy="12" r="1"/></svg>
                  <span style="display:flex;flex-direction:column;gap:0.2rem;flex:1;min-width:0;padding-right:${n?"3rem":"4rem"};">
                    <span style="font-size:1.2rem;font-weight:700;line-height:1.2;white-space:nowrap;">Tarot Vision AI</span>
                    <span style="font-size:0.9rem;font-weight:400;opacity:0.85;line-height:1.3;white-space:normal;">Take a picture or upload a tarot card to analyse it</span>
                  </span>
                  ${n?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.75rem;height:1.75rem;opacity:0.45;flex-shrink:0;margin-left:auto;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                </button>`})()}
          </div>

          <div class="card" id="tarot-cards-result" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${e.name}</h3>
            </div>
            ${r}
          </div>

          ${this.buildTarotCTA()}

        </div>
      </div>

<style>
  .tarot-card-flip-container { 
    width: 100%;
    aspect-ratio: 200 / 350; 
    perspective: 1000px; 
    cursor: pointer; 
    position: relative;
    margin: 0 auto;
  }
  
  .tarot-card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  
  .tarot-card-flip-container.flipped .tarot-card-flip-inner {
    transform: rotateY(180deg);
  }
  
  .tarot-card-front,
  .tarot-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .tarot-card-back {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .tarot-card-back img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .card-reveal-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
    color: var(--neuro-text);
    font-weight: 600;
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid rgba(128, 0, 128, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    font-size: 0.7rem;
    max-width: 90%;
  }
  
  .tarot-card-front {
    transform: rotateY(180deg);
  }
  
  .tarot-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .tarot-card-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background: #1a1a1a;
    border-radius: 8px;
  }
  
  /* Single card spread - fills container on mobile, capped on desktop */
  .tarot-single-grid {
    width: 100%;
  }
  .tarot-single-grid .flex.flex-col.items-center.mx-auto {
    width: 100%;
    max-width: 100%;
  }
  .tarot-single-grid .tarot-card-flip-container {
    width: 100%;
    max-width: 100%;
  }

  /* Shared 3-column grid — always 3 cols, always fits container */
  .tarot-3col-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.5rem;
    width: 100%;
    overflow: hidden;
  }
  .tarot-3col-grid .flex.flex-col.items-center.mx-auto {
    width: 100% !important;
    max-width: 100% !important;
  }
  .tarot-3col-grid .tarot-card-flip-container {
    max-width: 100% !important;
    width: 100% !important;
  }

  @media (min-width: 400px) {
    .tarot-3col-grid { gap: 0.65rem; }
  }
  @media (min-width: 640px) {
    .tarot-3col-grid { gap: 0.75rem; }
  }
  @media (min-width: 768px) {
    .tarot-3col-grid { gap: 1rem 1.5rem; }
    .tarot-card-flip-container { max-width: 220px; }
    .tarot-single-grid .flex.flex-col.items-center.mx-auto { width: 320px; max-width: 320px; }
    .tarot-single-grid .tarot-card-flip-container { max-width: 320px !important; }
    .card-reveal-prompt {
      padding: 1rem 1.5rem;
      border-width: 3px;
      font-size: 1rem;
    }
  }
  @media (min-width: 1600px) {
    .tarot-card-flip-container { max-width: 240px; }
    .tarot-single-grid .flex.flex-col.items-center.mx-auto { width: 360px; max-width: 360px; }
    .tarot-single-grid .tarot-card-flip-container { max-width: 360px !important; }
  }
  
  /* Pyramid layout */
  .pyramid-triangle { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .pyr-row { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
    width: 100%; 
  }
  
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
  .cross-shape { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .cross-top, 
  .cross-bot { 
    display: flex; 
    justify-content: center; 
  }
  
  .cross-mid { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
  }
  
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
    `,this.init()}cardMarkup(t,e,i=!1){const r=i?"width:100%;":"width: clamp(140px, 24vw, 250px);",a=i?"clamp(80px, 16vw, 120px)":"clamp(60px, 12vw, 100px)";return`
      <div class="flex flex-col items-center mx-auto" style="${r}">
        <h4 class="text-lg font-bold h-8" style="color: var(--neuro-accent); margin-bottom: 0rem;">${e}</h4>
        <div class="tarot-card-flip-container" id="tarot-card-container-${t}" onclick="window.featuresManager.engines.tarot.flipCard(${t})">
          <div class="tarot-card-flip-inner">
            <div class="tarot-card-back">
              <p class="card-reveal-prompt">Click to reveal</p>
              <img src="${this.CARD_BACK_URL}" alt="Card Back" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350">
            </div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div id="tarot-card-details-${t}" class="text-center" style="opacity: 0; height: ${a}; overflow-y: auto; margin-top: 0rem;"></div>
      </div>`}renderCustomSpread(t){const e=this.spreads[t].positions;if(t==="options")return`
        <div class="flex flex-col items-center" style="width:100%;">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${e.slice(0,3).map((i,r)=>this.cardMarkup(r,i)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${e.slice(3,6).map((i,r)=>this.cardMarkup(r+3,i)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid tarot-3col-grid place-items-center" style="width:100%;">
            ${e.slice(6,9).map((i,r)=>this.cardMarkup(r+6,i)).join("")}
          </div>
        </div>`;if(t==="pyramid")return`
        <div class="pyramid-triangle">
          <div class="pyr-row pyr-apex">${this.cardMarkup(8,e[8])}${this.cardMarkup(0,e[0])}</div>
          <div class="pyr-row pyr-upper">${this.cardMarkup(7,e[7])}${this.cardMarkup(1,e[1])}</div>
          <div class="pyr-row pyr-lower">${this.cardMarkup(6,e[6])}${this.cardMarkup(2,e[2])}</div>
          <div class="pyr-row pyr-base">${this.cardMarkup(5,e[5])}${this.cardMarkup(4,e[4])}${this.cardMarkup(3,e[3])}</div>
        </div>`;if(t==="cross")return`
        <div class="cross-shape">
          <div class="cross-top">${this.cardMarkup(3,e[3])}</div>
          <div class="cross-mid">${this.cardMarkup(0,e[0])}${this.cardMarkup(2,e[2])}${this.cardMarkup(1,e[1])}</div>
          <div class="cross-bot">${this.cardMarkup(4,e[4])}</div>
        </div>`}init(){setTimeout(()=>{const t=document.getElementById("tarot-vision-ai-btn");if(t){const e=()=>{var a,o,n,p,d,s,h,m,g,l,c,u,f,y;!(((n=(o=(a=this.app)==null?void 0:a.state)==null?void 0:o.currentUser)==null?void 0:n.isAdmin)||((s=(d=(p=this.app)==null?void 0:p.state)==null?void 0:d.currentUser)==null?void 0:s.isVip))&&!((l=(g=(m=(h=this.app)==null?void 0:h.gamification)==null?void 0:m.state)==null?void 0:g.unlockedFeatures)!=null&&l.includes("tarot_vision_ai"))?(u=(c=this.app)==null?void 0:c.showToast)==null||u.call(c,"Unlock Tarot Vision AI in the Karma Shop!","info"):(y=(f=this.app)==null?void 0:f.showToast)==null||y.call(f,"Tarot Vision AI opening...","info")};t.onclick=e,this.cleanup=()=>{t.onclick=null}}},0)}selectSpread(t){var r,a,o,n,p,d,s,h,m,g,l,c;const e=["options","pyramid","cross"];if(!(((o=(a=(r=this.app)==null?void 0:r.state)==null?void 0:a.currentUser)==null?void 0:o.isAdmin)||((d=(p=(n=this.app)==null?void 0:n.state)==null?void 0:p.currentUser)==null?void 0:d.isVip))&&e.includes(t)&&!((g=(m=(h=(s=this.app)==null?void 0:s.gamification)==null?void 0:h.state)==null?void 0:m.unlockedFeatures)!=null&&g.includes("advance_tarot_spreads"))){(c=(l=this.app)==null?void 0:l.showToast)==null||c.call(l,"Unlock Advanced Tarot Spreads in the Karma Shop!","info");return}this.selectedSpread=t,this.prepareReading(),this.render(),setTimeout(()=>{const u=document.querySelector("#tarot-cards-result");u&&u.scrollIntoView({behavior:"smooth",block:"start"})},b.SCROLL_DELAY)}reset(){this.selectSpread(this.selectedSpread)}}typeof window<"u"&&(window.TarotEngine=C);export{C as default};
