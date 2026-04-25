var m=Object.defineProperty;var h=(a,e,t)=>e in a?m(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var c=(a,e,t)=>h(a,typeof e!="symbol"?e+"":e,t);import{a as g}from"./main-DtEioEnC.js";import{InquiryEngine as f}from"./InquiryEngine-BOqjDi6m.js";import"./features-lazy-bN0WDG2L.js";import"./community-hub-uUiMGgF_.js";import"./supabase-k82gbVKr.js";const o=class o{constructor(e){this.app=e,this.boosters=[{id:1,title:"5-Minute Dance Party",emoji:"💃",description:"Put on your favorite song and move your body!",duration:"5 min",category:"Movement"},{id:2,title:"Gratitude Snapshot",emoji:"📸",description:"Quickly name 3 things you're grateful for right now.",duration:"3 min",category:"Mindfulness"},{id:3,title:"Power Pose",emoji:"🦸",description:"Stand like a superhero for 2 minutes to boost confidence.",duration:"2 min",category:"Confidence"},{id:4,title:"Mindful Sip",emoji:"🍵",description:"Drink a glass of water or tea, focusing only on the sensation.",duration:"4 min",category:"Calm"},{id:5,title:"Quick Stretch",emoji:"🤸",description:"Gently stretch your arms, neck, and back for 3 minutes.",duration:"3 min",category:"Body"},{id:6,title:"Listen to One Song",emoji:"🎶",description:"Listen to one favorite song without any distractions.",duration:"4 min",category:"Joy"}],this.boostersLoaded=!1,this.currentBooster=this.getRandomBooster(),this.currentQuote=null,this.currentAffirmation=null,this.currentInquiry=null,this.affirmations=g,this.inquiryEngine=new f("beginner"),this._lastTracked=0,this._cachedElements={},this.loadBoosters()}async loadBoosters(){try{const e=await fetch("/Data/HappinessBoostersList.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();this.boosters=t.boosters,this.boostersLoaded=!0;const n=this._getElement("happiness-tab");n&&!n.classList.contains("hidden")&&this.render()}catch(e){console.error("Failed to load happiness boosters:",e),this.boostersLoaded=!0}}_getElement(e){return(!this._cachedElements[e]||!document.getElementById(e))&&(this._cachedElements[e]=document.getElementById(e)),this._cachedElements[e]}_getDayOfYear(){const e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((e-t)/864e5)}getDailyBooster(){return this.boosters[this._getDayOfYear()%this.boosters.length]}getRandomBooster(){return this.app.randomFrom(this.boosters)}getDailyAffirmation(){var n;const e=(n=this.affirmations)==null?void 0:n.general_positive_affirmations;if(!(e!=null&&e.length))return"You are doing great.";const t=e[this._getDayOfYear()%e.length];return typeof t=="string"?t:t.text}getRandomAffirmation(){const e=Object.values(this.affirmations||{}).flat().filter(Boolean);if(!e.length)return"You are capable of amazing things.";const t=this.app.randomFrom(e);return(t==null?void 0:t.text)||t||"You are capable of amazing things."}getRandomInquiry(){const e=this.inquiryEngine._getUniqueDomains(),t=e[Math.floor(Math.random()*e.length)];return this.inquiryEngine.getRandomQuestion(t)}getRandomQuote(){var e;return((e=window.QuotesData)==null?void 0:e.getRandomQuote())||{text:"Stay positive!",author:"Unknown"}}trackView(){const e=Date.now();if(this._lastTracked&&e-this._lastTracked<o.DEBOUNCE_MS)return this.getTodayViewCount();this._lastTracked=e;const t=new Date().toDateString();let n=this._getStorageData(t);if(n.count+=1,localStorage.setItem("daily_booster_views",JSON.stringify(n)),this.app.gamification){const r=this.app.gamification;r.progressQuest("daily","daily_booster",1),r.progressQuest("weekly","happiness_boosters_20",1),r.progressQuest("monthly","monthly_happiness_100",1)}return n.count}getTodayViewCount(){return this._getStorageData(new Date().toDateString()).count}_getStorageData(e){try{const t=localStorage.getItem("daily_booster_views");if(t){const n=JSON.parse(t);if(n.date===e)return n}}catch(t){console.error("Failed to parse storage data:",t)}return{date:e,count:0}}updateQuestDisplay(){const e=this.getTodayViewCount(),t=document.getElementById("happiness-quest-badge");if(t){const n=e>=o.QUEST_TARGET;t.style.cssText=`display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${n?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);"}`;const r=document.getElementById("happiness-quest-count");r&&(r.textContent=e)}this._toggleQuestCompleteBanner(e)}_toggleQuestCompleteBanner(e){const t="happiness-quest-complete";let n=document.getElementById(t);if(e>=o.QUEST_TARGET&&!n){n=document.createElement("div"),n.id=t,n.style.cssText="margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);",n.innerHTML=`<p class="text-center" style="color:#22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide-icon'><path d='M18 6 7 17l-5-5'/><path d='m22 10-7.5 7.5L13 16'/></svg> Daily quest complete! Keep exploring if you'd like!</p>`;const r=document.querySelector("#happiness-tab .universal-content");r==null||r.insertBefore(n,r.querySelector("main"))}else e<o.QUEST_TARGET&&n&&n.remove()}_flipCard(e,t){const n=this._getElement(e);if(!n)return;const r=n.querySelector(".flip-card-inner"),i=n.querySelector(".flip-card-back");i.innerHTML=t;const l=r.style.transform.match(/-?\d+\.?\d*/),s=l?parseFloat(l[0]):0;r.style.transform=`rotateY(${s+o.ROTATION_DEG}deg)`;const d=()=>{r.removeEventListener("transitionend",d),n.querySelector(".flip-card-front").innerHTML=t};r.addEventListener("transitionend",d)}_refreshContent(e,t,n,r,i,l){this[`current${e}`]=t.call(this);const s=this.trackView(),d=l.call(this,this[`current${e}`],r,i);if(this._flipCard(n,d),this.updateQuestDisplay(),this.app.gamification&&this.app.gamification.incrementHappinessViews(),this.app.showToast){const p=s>=o.QUEST_TARGET?`Quest complete! You've viewed ${o.QUEST_TARGET} items today!`:`New ${i.toLowerCase()} revealed! (${s}/${o.QUEST_TARGET})`;this.app.showToast(p,"success")}}refreshBooster(){this._refreshContent("Booster",this.getRandomBooster,"booster-card","booster","Booster",this._formatBooster)}refreshQuote(){this._refreshContent("Quote",this.getRandomQuote,"quote-card","quote","Quote",this._formatQuote)}refreshAffirmation(){this._refreshContent("Affirmation",this.getRandomAffirmation,"affirm-card","affirmation","Affirmation",this._formatAffirmation)}refreshInquiry(){this._refreshContent("Inquiry",this.getRandomInquiry,"inquiry-card","inquiry","Inquiry",this._formatInquiry)}_formatBooster(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> A Quick Happiness Booster</h2>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${e.title}</h3>
        <p class="mt-2 text-lg">${e.description}</p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>${e.duration}</span> • <span>${e.category}</span> • <span>${e.emoji}</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshBooster()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatQuote(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Inspirational Quote</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${e.text}"
      </p>
      <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
        - ${e.author}
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshQuote()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatAffirmation(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Positive Affirmation</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${e}"
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshAffirmation()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatInquiry(e){const t=o.INTENSITY_EMOJIS[e.intensity]||"💭";return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Self Inquiry</h2>
      </div>
      <div class="text-center">
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
            ${e.domain}
          </span>
        </div>
        <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
          ${e.question}
        </p>
        <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
          ${e.holding}
        </p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>Level ${e.intensity}</span> • <span>${t} Self-Inquiry</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshInquiry()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}render(){const e=this._getElement("happiness-tab");if(!e)return;this.currentBooster=this.getRandomBooster(),this.currentQuote=this.getRandomQuote(),this.currentAffirmation=this.getRandomAffirmation(),this.currentInquiry=this.getRandomInquiry();const t=this.getTodayViewCount();e.innerHTML=`
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavHappiness.webp');
                     --header-title:'';
                     --header-tag:'Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry'">
        <h1>Happiness and Motivation</h1>
        <h3>Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry</h3>
        <span class="header-sub"></span>
      </header>

      <div class="flex items-center justify-between" style="margin-bottom: 2rem; padding: 1rem; background: rgba(102, 126, 234, 0.05); border-radius: 8px;">
        <span style="color: var(--neuro-text); font-weight: 600;">Daily Quest Progress</span>
        <span id="happiness-quest-badge" style="display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${t>=o.QUEST_TARGET?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);"}"><span id="happiness-quest-count">${t}</span><span>/ ${o.QUEST_TARGET} Quest</span></span>
      </div>

      ${t>=o.QUEST_TARGET?`
        <div id="happiness-quest-complete" style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color: #22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg> Daily quest complete! Keep exploring if you'd like!</p>
        </div>
      `:""}

      <main class="space-y-6">
        ${this._renderCard("affirm-card","affirmation","Positive Affirmation",`<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentAffirmation}"
          </p>`,"refreshAffirmation")}

        ${this._renderCard("quote-card","quote","Inspirational Quote",`<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentQuote.text}"
          </p>
          <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
            - ${this.currentQuote.author}
          </p>`,"refreshQuote")}

        ${this._renderCard("booster-card","booster","A Quick Happiness Booster",`<h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${this.currentBooster.title}</h3>
          <p class="mt-2 text-lg">${this.currentBooster.description}</p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>${this.currentBooster.duration}</span> • <span>${this.currentBooster.category}</span>
          </div>`,"refreshBooster")}

        ${this._renderCard("inquiry-card","inquiry","Self Inquiry",`<div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
              ${this.currentInquiry.domain}
            </span>
          </div>
          <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
            ${this.currentInquiry.question}
          </p>
          <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
            ${this.currentInquiry.holding}
          </p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>Level ${this.currentInquiry.intensity}</span> • <span>Self-Inquiry</span>
          </div>`,"refreshInquiry")}
        ${this.buildCommunityCTA()}
      </main>
    </div>
  </div>`}buildCommunityCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Mingle & Practice, Chat and Be one with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>
    `}_renderCard(e,t,n,r,i){const s={affirmation:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',quote:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>',booster:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',inquiry:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'}[t]||"";return`
      <div class="neuro-card flip-card" id="${e}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="flex items-center" style="margin-bottom: 1rem;">
              ${s}
              <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">${n}</h2>
            </div>
            <div class="text-center">
              ${r}
            </div>
            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
              <button onclick="window.featuresManager.engines.happiness.${i}()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`}};c(o,"QUEST_TARGET",5),c(o,"DEBOUNCE_MS",1e3),c(o,"ROTATION_DEG",360),c(o,"INTENSITY_EMOJIS",{1:"🌱",2:"🌿",3:"🌳",4:"🔥"});let u=o;typeof window<"u"&&(window.HappinessEngine=u);export{u as default};
