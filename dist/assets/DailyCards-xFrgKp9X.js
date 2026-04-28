var m=Object.defineProperty;var u=(s,t,e)=>t in s?m(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var n=(s,t,e)=>u(s,typeof t!="symbol"?t+"":t,e);import f from"./TarotEngine-CSp3crz6.js";import{I as y}from"./InquiryEngine--lsmi1J6.js";function r(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const c={get:s=>{try{return localStorage.getItem(s)}catch{return null}},set:(s,t)=>{try{localStorage.setItem(s,t)}catch{}},remove:s=>{try{localStorage.removeItem(s)}catch{}}},a=class a{constructor(t){this.app=t,this.happinessBoosters=[],this.boostersLoaded=!1,this.timerInterval=null,this._todayCache=null,this._todayCacheTime=0,this.inquiryEngine=new y("beginner"),this.tarotEngine=new f(t),this.initializeBoosters()}async initializeBoosters(){try{const t=await fetch("/Data/HappinessBoostersList.json");if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json();this.happinessBoosters=e.boosters||a.FALLBACK_BOOSTERS}catch(t){console.warn("DailyCards: Failed to load boosters, using fallback:",t),this.happinessBoosters=a.FALLBACK_BOOSTERS}this.boostersLoaded=!0}_getToday(){const t=Date.now();return t-this._todayCacheTime<a.TODAY_CACHE_DURATION?this._todayCache:(this._todayCache=new Date().toDateString(),this._todayCacheTime=t,this._todayCache)}_getDayOfYear(){const t=new Date,e=new Date(t.getFullYear(),0,0);return Math.floor((t-e)/a.MS_PER_DAY)}_getFromStorage(t){const e=this._getToday();try{const i=c.get(t);if(!i)return null;const o=JSON.parse(i);return o.date===e?o:null}catch(i){return console.error(`DailyCards: Storage read error for ${t}:`,i),null}}_saveToStorage(t,e){try{c.set(t,JSON.stringify({...e,date:this._getToday()}))}catch(i){console.error(`DailyCards: Storage write error for ${t}:`,i)}}_wasCardFlipped(t){return a.VALID_TYPES.has(t)?c.get(`${a.STORAGE_KEYS.FLIPPED_PREFIX}${t}`)===this._getToday():!1}_markCardFlipped(t){a.VALID_TYPES.has(t)&&c.set(`${a.STORAGE_KEYS.FLIPPED_PREFIX}${t}`,this._getToday())}getRandomBooster(){const t=this.happinessBoosters?.length?this.happinessBoosters:a.FALLBACK_BOOSTERS;return t[Math.floor(Math.random()*t.length)]}getDailyBooster(){return this.getRandomBooster()}getDailyTarotCard(){const t=this._getFromStorage(a.STORAGE_KEYS.TAROT);if(t)return t.card;const i=this.tarotEngine.shuffleDeck(this.tarotEngine.buildFullDeck())[this._getDayOfYear()%78],o={name:this.tarotEngine.getTarotCardName(i.number,i.suit),meaning:this.tarotEngine.getTarotCardMeaning(i.number,i.suit),image:this.tarotEngine.getTarotCardImage(i.number,i.suit)};return this._saveToStorage(a.STORAGE_KEYS.TAROT,{card:o}),o}getRandomAffirmation(){const t=window.affirmations?.general_positive_affirmations||[];if(!t.length)return"I am worthy of love and belonging exactly as I am.";const e=t[Math.floor(Math.random()*t.length)];return typeof e=="string"?e:e.text}getDailyAffirmation(){const t=this._getFromStorage(a.STORAGE_KEYS.AFFIRMATION);if(t)return t.affirmation;const e=this.getRandomAffirmation();return this._saveToStorage(a.STORAGE_KEYS.AFFIRMATION,{affirmation:e}),e}getDailyInquiry(){const t=this._getFromStorage(a.STORAGE_KEYS.INQUIRY);if(t)return t.inquiry;const e=a.INQUIRY_DOMAINS[Math.floor(Math.random()*a.INQUIRY_DOMAINS.length)],i=this.inquiryEngine.getRandomQuestion(e);return this._saveToStorage(a.STORAGE_KEYS.INQUIRY,{inquiry:i}),i}initMidnightTimer(){this.stopMidnightTimer();const t=()=>{const e=new Date,o=new Date(e.getFullYear(),e.getMonth(),e.getDate()+1)-e,l=Math.floor(o/36e5),h=Math.floor(o%36e5/6e4),g=Math.floor(o%6e4/1e3),d=document.getElementById("daily-cards-timer");d&&(d.textContent=`Resets in ${l}h ${h}m ${g}s`),o<=1e3&&setTimeout(()=>location.reload(),o)};t(),this.timerInterval=setInterval(t,1e3)}stopMidnightTimer(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null)}flipDailyCard(t){if(!a.VALID_TYPES.has(t)){console.warn(`DailyCards: Invalid card type "${t}"`);return}const e=document.getElementById(`${t}-flip`),i=document.getElementById(`${t}-header`),o=e?.closest(".daily-card-wrapper");if(!e||!i||!o){console.warn(`DailyCards: Card elements not found for type: ${t}`);return}e.classList.contains("flipped")||(t===a.CARD_TYPES.BOOSTER?this._updateBoosterContent(e):t===a.CARD_TYPES.INQUIRY&&this._updateInquiryContent(e)),e.classList.toggle("flipped"),i.classList.toggle("flipped"),o.classList.toggle("flipped"),e.classList.contains("flipped")&&(this._markCardFlipped(t),this.app.showToast(a.FLIP_MESSAGES[t]||"Card revealed!","success"))}_updateBoosterContent(t){const e=this.getRandomBooster(),i=t.querySelector(".dashboard-booster-content");i&&(i.innerHTML=`
      <div class="dashboard-booster-emoji">${r(e.emoji)}</div>
      <div class="inquiry-domain-badge"><span>${r(e.title)}</span></div>
      <p class="dashboard-booster-description">${r(e.description)}</p>
      <p class="dashboard-booster-meta">${r(e.duration)} • ${r(e.category)}</p>
    `)}_updateInquiryContent(t){const e=this.getDailyInquiry(),i=t.querySelector(".dashboard-booster-content");i&&(i.innerHTML=`
      <div class="dashboard-booster-emoji">${a.INTENSITY_EMOJIS[e.intensity]||"💭"}</div>
      <div class="inquiry-domain-badge"><span>${r(e.domain)}</span></div>
      <p class="dashboard-booster-description">${r(e.question)}</p>
    `)}_renderCardTemplate(t,e){const{title:i,frontTitle:o,frontContent:l,gradient:h=""}=e,d=(t===a.CARD_TYPES.BOOSTER?!1:this._wasCardFlipped(t))?"flipped":"";return`
      <div class="daily-card-full-container">
        <div class="card dashboard-daily-card">
          <div class="daily-card-wrapper ${d}"
               role="button" tabindex="0"
               aria-label="Flip ${r(i)} card"
               onclick="window.app.dailyCards.flipDailyCard('${r(t)}')"
               onkeydown="if(event.key==='Enter'||event.key===' ')window.app.dailyCards.flipDailyCard('${r(t)}')">
            <div class="daily-card-inner ${d}" id="${r(t)}-flip">

              <!-- Card Back -->
              <div class="daily-card-back">
                <p class="card-reveal-prompt">Click to reveal</p>
                <img src="${a.CARD_BACK_URL}"
                     alt="Card back"
                     class="dashboard-card-image"
                     loading="lazy" decoding="async"
                     width="120" height="200">
              </div>

              <!-- Card Front -->
              <div class="daily-card-front ${h}">
                ${l}
              </div>

            </div>
          </div>
        </div>

        <!-- Card Header -->
        <div class="daily-card-header-container ${d}" id="${r(t)}-header">
          <div class="daily-card-header-back">
            <h3 class="daily-card-header-title">${r(i)}</h3>
          </div>
          <div class="daily-card-header-front">
            <h3 class="daily-card-header-title">${r(o)}</h3>
          </div>
        </div>
      </div>
    `}renderDailyCard(t,e){return this._renderCardTemplate(t,{title:"Daily Tarot Guidance",frontTitle:"Daily Vibe",frontContent:`
        <div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
          <img src="${r(e.image)}" alt="${r(e.name)}"
               loading="lazy" decoding="async"
               width="300" height="500"
               style="width:100%;max-height:70%;flex-shrink:0;object-fit:contain;">
          <div style="text-align:center;overflow-y:auto;padding:0.75rem;flex:1;">
            <h4 class="tarot-card-name">${r(e.name)}</h4>
            <p class="tarot-card-meaning">${r(e.meaning)}</p>
          </div>
        </div>
      `})}renderAffirmationCard(t){return this._renderCardTemplate(a.CARD_TYPES.AFFIRMATION,{title:"Daily Affirmation",frontTitle:"Today's Mantra",gradient:"daily-card-gradient-affirmation",frontContent:`
        <div class="daily-card-content-wrapper">
          <p class="dashboard-affirmation-text">${r(t)}</p>
        </div>
      `})}renderBoosterCard(t){return this._renderCardTemplate(a.CARD_TYPES.BOOSTER,{title:"Happiness Booster",frontTitle:"Just Do It",gradient:"daily-card-gradient-booster",frontContent:`
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${r(t.emoji)}</div>
            <div class="inquiry-domain-badge"><span>${r(t.title)}</span></div>
            <p class="dashboard-booster-description">${r(t.description)}</p>
            <p class="dashboard-booster-meta">${r(t.duration)} • ${r(t.category)}</p>
          </div>
        </div>
      `})}renderInquiryCard(t){return this._renderCardTemplate(a.CARD_TYPES.INQUIRY,{title:"Daily Self-Inquiry",frontTitle:"Be Honest",gradient:"daily-card-gradient-inquiry",frontContent:`
        <div class="daily-card-content-wrapper">
          <div class="dashboard-booster-content">
            <div class="dashboard-booster-emoji">${a.INTENSITY_EMOJIS[t.intensity]||"💭"}</div>
            <div class="inquiry-domain-badge"><span>${r(t.domain)}</span></div>
            <p class="dashboard-booster-description">${r(t.question)}</p>
          </div>
        </div>
      `})}renderDailyCardsSection(){const t=this.getDailyTarotCard(),e=this.getDailyAffirmation(),i=this.getDailyBooster(),o=this.getDailyInquiry();return setTimeout(()=>this.initMidnightTimer(),100),`
      <div class="card dashboard-quest-hub mb-8" style="position:relative;">
        <span id="daily-cards-timer" class="countdown-badge" aria-live="polite"></span>
        <div class="dashboard-quest-header">
          <h3 class="dashboard-quest-title" style="display:flex;align-items:center;gap:0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M9 12c0 0 1.5-2 3-2s3 2 3 2-1.5 2-3 2-3-2-3-2z"/><circle cx="12" cy="12" r="1"/></svg>
            Your Daily Cards
          </h3>
        </div>
        <div class="grid grid-cols-2 gap-6" id="daily-cards-container">
          ${this.renderDailyCard(a.CARD_TYPES.TAROT,t)}
          ${this.renderAffirmationCard(e)}
          ${this.renderBoosterCard(i)}
          ${this.renderInquiryCard(o)}
        </div>
      </div>
    `}destroy(){this.stopMidnightTimer(),this._todayCache=null,this._todayCacheTime=0}};n(a,"CARD_BACK_URL","/Tarot%20Cards%20images/CardBacks.webp"),n(a,"STORAGE_KEYS",Object.freeze({BOOSTER:"daily_booster",TAROT:"daily_tarot_card",INQUIRY:"daily_inquiry",AFFIRMATION:"daily_affirmation",FLIPPED_PREFIX:"daily_card_flipped_"})),n(a,"CARD_TYPES",Object.freeze({TAROT:"tarot",AFFIRMATION:"affirmation",BOOSTER:"booster",INQUIRY:"inquiry"})),n(a,"VALID_TYPES",new Set(["tarot","affirmation","booster","inquiry"])),n(a,"INQUIRY_DOMAINS",Object.freeze(["Responsibility and Power","Emotional Honesty","Identity and Roles","Creativity and Expression","Shadow and Integration","Wisdom and Insight","Joy and Fulfillment","Physical Well-Being and Energy","Relationship","Spiritual Growth"])),n(a,"INTENSITY_EMOJIS",Object.freeze({1:"🌱",2:"🌿",3:"🌳",4:"🔥"})),n(a,"FLIP_MESSAGES",Object.freeze({tarot:"Tarot card revealed!",affirmation:"Affirmation revealed!",booster:"Booster revealed!",inquiry:"Daily inquiry revealed!"})),n(a,"TODAY_CACHE_DURATION",6e4),n(a,"MS_PER_DAY",864e5),n(a,"FALLBACK_BOOSTERS",Object.freeze([{id:1,title:"5-Minute Dance Party",emoji:"💃",description:"Put on your favorite song and move!",duration:"5 min",category:"Movement"},{id:2,title:"Gratitude Snapshot",emoji:"📸",description:"Notice 3 beautiful things around you",duration:"3 min",category:"Gratitude"},{id:3,title:"Power Pose",emoji:"🦸",description:"Stand like a superhero for 2 minutes",duration:"2 min",category:"Confidence"}]));let p=a;export{p as default};
