import{c as G,C as v,b as U}from"./community-hub-Bv-lWZW8.js";import{_ as z}from"./features-lazy-bN0WDG2L.js";const A={PRESENCE_RANGE:{min:8,max:23},FLOATING_ELEMENT_COUNT:20,UPDATE_INTERVAL_MS:6e5,STORAGE_PREFIX:"solar_",STORAGE_KEY_SUFFIX:"_data",IMAGE_BASE_URL:"/Community/Solar/",SEASONS:{SPRING:"spring",SUMMER:"summer",AUTUMN:"autumn",WINTER:"winter"},MIN_REFLECTION_LENGTH:10,FLOATING_ELEMENT_DURATION_MIN:10,FLOATING_ELEMENT_DURATION_RANGE:10,FLOATING_ELEMENT_DELAY_MAX:5},c={escapeHtml(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML},escapeAttr(e){return e?e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""},_closingBlock:e=>`<div class="solar-popup-highlight">
       <p><strong>Closing Line:</strong> "${e}"</p>
     </div>`,generateIntentionPracticeContent(e,t,o){const r=t.map(n=>`<button type="button" data-affirmation="${this.escapeAttr(n)}" class="solar-affirmation-btn">
         ${this.escapeHtml(n)}
       </button>`).join("");return`
      <div class="solar-popup-section">
        <h3>Purpose</h3>
        <p>${o.purpose}</p>
      </div>

      <div class="solar-popup-section">
        <h3>Set Your Intention</h3>
        <p>${o.intentionPrompt}</p>
        <label for="intentionText" class="sr-only">Your seasonal intention</label>
        <textarea id="intentionText" class="solar-textarea"
          placeholder="${o.intentionPlaceholder}" maxlength="500"
          aria-label="Your seasonal intention"
          style="min-height:100px;margin:1rem 0;"
        >${this.escapeHtml(e.intention||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${o.affirmationTitle||"Choose Affirmation"}</h3>
        <p>Select one affirmation or write your own:</p>
        <div class="solar-affirmations-grid">${r}</div>
        <label for="affirmationText" class="sr-only">Your affirmation</label>
        <textarea id="affirmationText" class="solar-textarea"
          placeholder="Or write your own..." maxlength="300"
          aria-label="Your affirmation"
          style="min-height:80px;margin-top:1rem;"
        >${this.escapeHtml(e.affirmation||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>${o.listTitle}</h3>
        <p>${o.listPrompt}</p>
        <label for="releaseListText" class="sr-only">${o.listTitle}</label>
        <textarea id="releaseListText" class="solar-textarea"
          placeholder="1. &#10;2. &#10;3. " maxlength="1000"
          aria-label="${o.listTitle}"
          style="min-height:120px;margin:1rem 0;"
        >${this.escapeHtml(e.releaseList||"")}</textarea>
      </div>

      <div class="solar-popup-section">
        <h3>Read Aloud</h3>
        <p>${o.readAloudText}</p>
      </div>

      ${this._closingBlock(o.closingLine)}
    `},generateFutureAlignmentContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section"><h3>Close Your Eyes</h3><p>${e.visualizationPrompt}</p></div>
      <div class="solar-popup-section"><h3>Notice Sensations</h3><p>Observe posture, breath, and energy tone.</p></div>
      <div class="solar-popup-section"><h3>${e.feelingTitle}</h3><p>${e.feelingPrompt}</p></div>
      ${this._closingBlock(e.closingLine)}
    `},generateBodyPracticeContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Practice Steps</h3>
        <ul class="solar-practice-steps">
          ${e.steps.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      ${e.subtleMovement?`<div class="solar-popup-section"><h3>Subtle Movement</h3><p>${e.subtleMovement}</p></div>`:""}
      ${this._closingBlock(e.closingLine)}
    `},generateEnergyAwarenessContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Energy Direction</h3>
        <ul class="solar-practice-steps">
          ${e.energySteps.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Sense ${e.energyQuality}</h3>
        <p>${e.energyGuideline}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Awareness Check</h3>
        <p>Notice subtle warmth, vibration, or light in your body.</p>
      </div>
      ${this._closingBlock(e.closingLine)}
    `},generateEnvironmentalClearingContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Choose One Small Space</h3>
        <p>A desk, a drawer, a digital folder, or your phone home screen.</p>
      </div>
      <div class="solar-popup-section"><h3>Remove Items</h3><p>${e.removePrompt}</p></div>
      ${this._closingBlock(e.closingLine)}
    `},generateRolePracticeContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Your Roles</h3>
        <p>Select roles you actively play:</p>
        <ul class="solar-practice-steps">
          ${e.roleExamples.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>${e.actionTitle}</h3>
        <p>${e.actionPrompt}</p>
      </div>
      ${this._closingBlock(e.closingLine)}
    `},generatePacePracticeContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Assess Your Pace</h3>
        <p>Answer: "At what pace am I currently living?"</p>
        <ul class="solar-practice-steps">
          ${e.paceOptions.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Choose a Small Adjustment</h3>
        <p>${e.adjustmentPrompt}</p>
        <ul class="solar-practice-steps">
          ${e.adjustmentExamples.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      ${this._closingBlock(e.closingLine)}
    `},generateRelationshipAuditContent(e){return`
      <div class="solar-popup-section"><h3>Purpose</h3><p>${e.purpose}</p></div>
      <div class="solar-popup-section">
        <h3>Identify Key Connections</h3>
        <p>${e.identifyPrompt}</p>
      </div>
      <div class="solar-popup-section">
        <h3>Decide One Action per Relationship</h3>
        <p>For each person, choose one action:</p>
        <ul class="solar-practice-steps">
          ${e.actionExamples.map(t=>`<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div class="solar-popup-section">
        <h3>Integrate Awareness</h3>
        <p>${e.integrationPrompt}</p>
      </div>
      ${this._closingBlock(e.closingLine)}
    `}},re=Object.freeze(Object.defineProperty({__proto__:null,SOLAR_CONSTANTS:A,SolarConfig:c},Symbol.toStringTag,{value:"Module"})),d={storage:{_key:e=>`${A.STORAGE_PREFIX}${e}${A.STORAGE_KEY_SUFFIX}`,get(e){const t=localStorage.getItem(this._key(e));if(!t)return null;try{return JSON.parse(t)}catch(o){return console.error(`[SolarUI] Error loading ${e} data:`,o),null}},set(e,t){try{return localStorage.setItem(this._key(e),JSON.stringify(t)),!0}catch(o){return console.error(`[SolarUI] Error saving ${e} data:`,o),!1}},clear(e){localStorage.removeItem(this._key(e))}},utils:{calculateDaysRemaining:e=>Math.ceil((e-new Date)/864e5),generateFloatingElements(e,t=A.FLOATING_ELEMENT_COUNT){const{FLOATING_ELEMENT_DELAY_MAX:o,FLOATING_ELEMENT_DURATION_MIN:r,FLOATING_ELEMENT_DURATION_RANGE:n}=A;let i="";for(let a=0;a<t;a++){const l=e[Math.floor(Math.random()*e.length)],s=(Math.random()*100).toFixed(2),u=(Math.random()*o).toFixed(2),x=(r+Math.random()*n).toFixed(2);i+=`<div class="solar-floating-element"
                      style="left:${s}%;animation-delay:${u}s;animation-duration:${x}s;">
                   ${l}
                 </div>`}return i},formatDate:e=>e.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})},renderers:{topBar({seasonName:e,emoji:t,daysText:o,livingPresenceCount:r}){return`
        <div class="solar-top-bar">
          <div class="solar-phase-left">
            <div class="solar-sun-icon">${t}</div>
            <div class="solar-phase-info">
              <h2>${e} Season</h2>
              <p>${o}</p>
            </div>
          </div>
          <div class="solar-live-count-top">
            <div class="solar-pulse-dot"></div>
            <span id="solarLiveCountTop">${r} members practicing with you now</span>
          </div>
          <button type="button" onclick="SolarUIManager.handleBackToHub()" class="solar-back-hub-btn" aria-label="Leave practice and return to hub">
            Gently Leave
          </button>
        </div>`},modeToggle(){const e=o=>o==="solo"?'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>':'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',t=(o,r,n)=>`<button type="button" class="solar-mode-btn${n?" active":""}" data-mode="${o}" aria-pressed="${n}">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${e(o)}</svg>
           <span>${r}</span>
         </button>`;return`<div class="solar-mode-toggle">${t("solo","Solo Practice",!0)}${t("group","Group Circle",!1)}</div>`},practiceCard(e,t){return`
        <div class="solar-practice-card" data-practice="${e.id}" data-locked="${t}" tabindex="0" role="button" aria-label="${e.title}${t?" - Complete":""}" style="cursor:pointer;">
          ${t?'<div class="solar-lock-icon">✓</div>':""}
          <div class="solar-practice-icon" style="background:${e.color};">${e.icon}</div>
          <h4 class="solar-practice-title">${e.title}</h4>
          <p class="solar-practice-desc">${e.description}</p>
        </div>`},savedInputs(e,t){const{intention:o,affirmation:r,releaseList:n}=e;if(!o&&!r&&!n)return"";const i=l=>c.escapeHtml(l),a=(l,s,u)=>`<div class="solar-input-display" style="margin-bottom:1rem;">
           <h4>${l}</h4>
           <p${u?' style="white-space:pre-line;"':""}>${i(s)}</p>
         </div>`;return`
        <div class="solar-saved-inputs">
          <h3>Your ${t} Harvest</h3>
          ${o?a("Season Intention",o,!1):""}
          ${r?a("Gratitude Affirmation",r,!1):""}
          ${n?a("Release/Growth List",n,!0):""}
          <p>Gathered with gratitude as the season completes</p>
        </div>`},groupPractice({seasonEmoji:e,seasonName:t,presenceCount:o,itemEmoji:r,collectiveFocus:n,collectiveNoun:i}){const a=t.toLowerCase();return`
        <div class="solar-group-container">
          <div class="solar-group-emoji">${e}</div>
          <h3 class="solar-group-title">Synchronized ${t} Gathering</h3>
          <p class="solar-group-desc">
            Join fellow practitioners in a collective practice for ${n||"seasonal alignment"}.
            Share intentions and witness the ${i||"energy"} of the season together.
          </p>
          <div class="solar-live-badge">
            <div class="solar-pulse-dot"></div>
            <span id="solarGroupPresenceBadge">${o} gathering now</span>
          </div>
          <div id="solarGroupAvatars" style="display:flex;gap:6px;justify-content:center;margin:1rem 0;flex-wrap:wrap;"></div>
          <h4 style="color:var(--season-accent);margin:2rem 0 1rem 0;">Group Practice Includes:</h4>
          <ul class="solar-group-list">
            <li><span>${r}</span> Join <span id="solarGroupJoinCount">${o}</span> practitioners in live circle</li>
            <li><span>${r}</span> 3-minute guided meditation for seasonal centering</li>
            <li><span>${r}</span> Set a private intention for ${a}</li>
            <li><span>${r}</span> Share one word with the collective field</li>
            <li><span>${r}</span> Witness the circle's ${i||"intentions"}</li>
            <li><span>${r}</span> 2-minute silent integration practice</li>
          </ul>
          <button type="button" class="solar-btn-primary" onclick="window.currentSolarRoom.showCollectiveIntentionPopup()">
            Join ${t} Circle
          </button>
          <p class="solar-group-note">Practice available throughout the ${a} season</p>
        </div>`},closureSection({title:e,intro:t,placeholder:o,buttonText:r,closingLine:n}){return`
        <div class="solar-closure">
          <h3>${e}</h3>
          <p>${t}</p>
          <label for="closureReflection" class="sr-only">${e}</label>
          <textarea id="closureReflection" class="solar-textarea" placeholder="${o}" aria-label="${o}"></textarea>
          ${n?`
            <div class="solar-popup-highlight" style="margin-top:1rem;">
              <p><em>"${n}"</em></p>
            </div>`:""}
          <button type="button" data-action="submit-closure" class="solar-btn-secondary" style="margin-top:1.5rem;">
            ${r}
          </button>
        </div>`},popup({title:e,content:t,hasSaveButton:o}){return`
        <div class="solar-popup-overlay" data-action="close-popup" role="dialog" aria-modal="true">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2>${e}</h2>
              <button type="button" class="solar-popup-close" data-action="close-popup" aria-label="Close practice">close</button>
            </div>
            <div class="solar-popup-body">${t}</div>
            <div class="solar-popup-footer">${o?'<button class="solar-popup-btn" data-action="save-practice">Save Practice</button>':'<button class="solar-popup-btn" data-action="close-popup">Complete</button>'}</div>
          </div>
        </div>`},inactiveRoom({seasonName:e,emoji:t,startDate:o,daysUntil:r}){return`
        <div class="solar-inactive">
          <div class="solar-inactive-container">
            <div class="solar-inactive-header">
              <div class="solar-inactive-sun"><div class="solar-sun-sphere" style="width:120px;height:120px;"></div></div>
              <h1 class="solar-inactive-title">${t} ${e} Solar Room</h1>
              <p class="solar-inactive-subtitle">Harvest &amp; Gratitude Practice Space</p>
            </div>
            <div class="solar-inactive-card">
              <h2>Season Not Yet Active</h2>
              <p>The ${e} Solar Room opens on <strong>${o}</strong></p>
              <p class="solar-inactive-days">${r} days until the ${e.toLowerCase()} season begins</p>
              <p class="solar-inactive-note">Return when the cycle turns and the season is ready.</p>
            </div>
          </div>
        </div>`}},switchMode(e){document.querySelectorAll(".solar-mode-btn").forEach(r=>{const n=r.dataset.mode===e;r.classList.toggle("active",n),r.setAttribute("aria-pressed",String(n))});const t=document.getElementById("soloContent"),o=document.getElementById("groupContent");t&&(t.style.display=e==="solo"?"block":"none"),o&&(o.style.display=e==="group"?"block":"none")},closePracticePopup(){var e;(e=document.getElementById("practicePopup"))==null||e.remove()},handleBackToHub(){var e,t,o,r,n,i,a;if((e=window.currentSolarRoom)!=null&&e.leaveRoom){window.currentSolarRoom.leaveRoom();return}(o=(t=window.currentSolarRoom)==null?void 0:t._clearPresence)==null||o.call(t),document.body.classList.remove("solar-room-active"),(n=(r=window.Rituals)==null?void 0:r.showClosing)!=null&&n.call(r)||((a=(i=G)==null?void 0:i.navigateTo)==null||a.call(i,"hubView"))},showToast(e){var t,o,r;(t=G)!=null&&t.showToast?G.showToast(e):(r=(o=window.app)==null?void 0:o.showToast)==null||r.call(o,e)},_stylesInjected:!1,injectStyles(){if(this._stylesInjected||document.getElementById("solar-shared-styles")){this._stylesInjected=!0;return}const e=document.createElement("style");e.id="solar-shared-styles",e.textContent=this._getSharedCSS(),document.head.appendChild(e),this._stylesInjected=!0},_getSharedCSS(){return`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

/* ── Solar CSS variables ─────────────────────────────────────────────────── */
:root {
  --solar-bg-dark: rgba(0,0,0,0.3);
  --solar-bg-darker: rgba(0,0,0,0.2);
  --solar-text-primary: rgba(224,224,255,0.9);
  --solar-text-secondary: rgba(224,224,255,0.7);
  --solar-text-muted: rgba(224,224,255,0.5);
  --solar-border-light: rgba(255,255,255,0.1);
  --solar-border-medium: rgba(255,255,255,0.15);
  --solar-border-accent: rgba(212,165,116,0.3);
  --solar-glow-warm: rgba(244,164,96,0.6);
  --solar-glow-soft: rgba(212,165,116,0.4);
  --solar-success: #4ade80;
  /* Season defaults (Autumn) — overridden per season */
  --season-accent: #d4a574;
  --season-accent-light: #f4a460;
  --season-accent-dark: #a67c52;
  --season-bg-start: #3a1f0f;
  --season-bg-mid1: #5a3520;
  --season-bg-mid2: #4a2615;
  --season-bg-mid3: #6a4530;
  --season-bg-end: #3a1f0f;
  --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Season theme variables ──────────────────────────────────────────────── */
body.solar-room-active[data-season="winter"] {
  --season-accent: #a0b8c8; --season-accent-light: #c0d4e4; --season-accent-dark: #7a8c9c;
  --season-bg-start: #1a2a3a; --season-bg-mid1: #2d4050; --season-bg-mid2: #1e3545;
  --season-bg-mid3: #2f4a5a; --season-bg-end: #1a2a3a; --season-sun-glow: rgba(160,184,200,0.4);
}
body.solar-room-active[data-season="spring"] {
  --season-accent: #ffd740; --season-accent-light: #ffe066; --season-accent-dark: #f4c542;
  --season-bg-start: #1a3a2a; --season-bg-mid1: #2d5a3d; --season-bg-mid2: #234a35;
  --season-bg-mid3: #3d6a4d; --season-bg-end: #1a3a2a; --season-sun-glow: rgba(255,215,64,0.4);
}
body.solar-room-active[data-season="summer"] {
  --season-accent: #ff8c42; --season-accent-light: #ffa552; --season-accent-dark: #ff6b35;
  --season-bg-start: #ff6b35; --season-bg-mid1: #ff8c42; --season-bg-mid2: #ffa552;
  --season-bg-mid3: #ffbe68; --season-bg-end: #ff6b35; --season-sun-glow: rgba(255,140,66,0.4);
}
body.solar-room-active[data-season="autumn"] {
  --season-accent: #d4a574; --season-accent-light: #e8b886; --season-accent-dark: #b8835c;
  --season-bg-start: #2a1a0a; --season-bg-mid1: #3d2510; --season-bg-mid2: #2d1c0c;
  --season-bg-mid3: #4a2e15; --season-bg-end: #2a1a0a; --season-sun-glow: rgba(212,165,116,0.4);
}

/* ── Background ──────────────────────────────────────────────────────────── */
body.solar-room-active[data-season] {
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%) !important;
  background-attachment: fixed !important;
}
.solar-room-bg {
  min-height: 100vh; width: 100%;
  background: linear-gradient(135deg,
    var(--season-bg-start) 0%, var(--season-bg-mid1) 25%,
    var(--season-bg-mid2) 50%, var(--season-bg-mid3) 75%,
    var(--season-bg-end) 100%);
  position: relative; overflow-x: hidden;
}

/* ── Floating elements ───────────────────────────────────────────────────── */
.solar-floating-bg{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;}
.solar-floating-element{position:absolute;font-size:2rem;animation:float linear infinite;opacity:0.6;}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.solar-word-item:hover{transform:scale(1.2);opacity:1!important;}
@keyframes float{0%{top:-50px;transform:translateX(0) rotate(0deg);opacity:0.6;}100%{top:100vh;transform:translateX(100px) rotate(360deg);opacity:0.3;}}

/* ── Top bar ─────────────────────────────────────────────────────────────── */
.solar-top-bar{position:relative;z-index:10;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:2rem;pointer-events:none;}
.solar-top-bar > *{pointer-events:auto;}
.solar-phase-left{display:flex;align-items:center;gap:1rem;justify-self:start;}
.solar-sun-icon{font-size:3rem;line-height:1;}
.solar-phase-info h2{font-size:1.5rem;color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;font-weight:500;line-height:1.2;}
.solar-phase-info p{font-size:0.9rem;color:rgba(212,165,116,0.7);margin:0.25rem 0 0 0;}
.solar-live-count-top{display:flex;align-items:center;gap:0.5rem;padding:0.5rem 1rem;background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.2);border-radius:20px;font-size:0.9rem;color:rgba(212,165,116,0.9);justify-self:center;}
.solar-pulse-dot{width:8px;height:8px;background:var(--solar-success);border-radius:50%;animation:pulse 2s infinite;}
.solar-back-hub-btn{padding:.65rem 1.5rem;background:linear-gradient(135deg,rgba(212,165,116,.18),rgba(166,124,82,.15));border:1px solid rgba(212,165,116,.35);border-radius:50px;color:rgba(212,165,116,.85);cursor:pointer;transition:all .35s;font-size:.88rem;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;justify-self:end;box-shadow:0 0 16px rgba(212,165,116,.1),inset 0 0 8px rgba(212,165,116,.05);}
.solar-back-hub-btn:hover{border-color:rgba(212,165,116,.65);color:var(--season-accent);box-shadow:0 0 28px rgba(212,165,116,.2),inset 0 0 12px rgba(212,165,116,.08);transform:translateY(-1px);}

/* ── Content wrapper ─────────────────────────────────────────────────────── */
.solar-content-wrapper{max-width:900px;margin:0 auto;padding:2rem 2rem 4rem 2rem;position:relative;z-index:2;}

/* ── Sun visual ──────────────────────────────────────────────────────────── */
.solar-sun-visual{display:flex;justify-content:center;margin-bottom:3rem;}
.solar-sun-glow{width:160px;height:160px;display:flex;align-items:center;justify-content:center;}
.solar-sun-sphere{width:100%;height:100%;background:radial-gradient(circle at 35% 35%,var(--season-accent-light) 0%,var(--season-accent) 40%,var(--season-accent-dark) 100%);border-radius:50%;box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);animation:sunGlow 4s ease-in-out infinite;}
@keyframes sunGlow{0%,100%{box-shadow:0 0 40px var(--solar-glow-warm),0 0 80px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.3);}50%{box-shadow:0 0 50px var(--solar-glow-warm),0 0 100px var(--season-sun-glow),inset -8px -8px 20px rgba(0,0,0,0.3),inset 10px 10px 25px rgba(255,255,255,0.4);}}

/* ── Intro card ──────────────────────────────────────────────────────────── */
.solar-intro-card{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:20px;padding:2rem;margin-bottom:3rem;text-align:center;}
.solar-season-img{width:100%;max-width:500px;height:auto;margin:0 auto 1.5rem;display:block;border-radius:12px;filter:invert(1);}
.solar-intro-card p{color:var(--solar-text-secondary);font-size:1.1rem;line-height:1.7;margin:0;}

/* ── Mode toggle ─────────────────────────────────────────────────────────── */
.solar-mode-toggle{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-bottom:2rem;background:rgba(0,0,0,.2);border:1px solid rgba(212,165,116,.1);border-radius:50px;padding:.3rem;}
.solar-mode-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem;background:transparent;border:none;border-radius:50px;color:rgba(212,165,116,.4);cursor:pointer;transition:all .35s;font-size:.9rem;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.03em;}
.solar-mode-btn:hover{color:rgba(212,165,116,.75);}
.solar-mode-btn.active{background:linear-gradient(135deg,rgba(212,165,116,.22),rgba(166,124,82,.2));border:1px solid rgba(212,165,116,.45);color:var(--season-accent);box-shadow:0 0 20px rgba(212,165,116,.12),inset 0 0 10px rgba(212,165,116,.06);}
.solar-mode-btn svg{flex-shrink:0;opacity:.7;}
.solar-mode-btn.active svg{opacity:1;}
.solar-mode-content{animation:fadeIn 0.5s ease-out;}
.solar-mode-description{text-align:center;margin-bottom:2.5rem;}
.solar-mode-description h3{color:var(--season-accent);font-size:1.5rem;margin-bottom:0.5rem;font-family:'Cormorant Garamond',serif;}
.solar-mode-description p{color:var(--solar-text-secondary);margin:0;}

/* ── Practices grid ──────────────────────────────────────────────────────── */
.solar-practices-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;margin:0 auto 3rem;max-width:800px;}
.solar-practice-card{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:16px;padding:1.5rem;cursor:pointer;transition:all var(--transition-normal);position:relative;}
.solar-practice-card:hover{border-color:var(--season-accent);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,0.2);}
.solar-practice-card.locked{opacity:0.6;cursor:not-allowed;}
.solar-lock-icon{position:absolute;top:1rem;right:1rem;color:var(--solar-success);font-size:1.5rem;}
.solar-practice-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:white;}
.solar-practice-icon svg{width:24px;height:24px;}
.solar-practice-title{color:var(--season-accent);margin-bottom:0.5rem;font-size:1.2rem;font-family:'Cormorant Garamond',serif;}
.solar-practice-desc{color:var(--solar-text-secondary);margin:0;font-size:0.95rem;}

/* ── Saved inputs ────────────────────────────────────────────────────────── */
.solar-saved-inputs{background:rgba(212,165,116,0.05);border:1px solid rgba(212,165,116,0.15);border-radius:16px;padding:2rem;margin-top:2rem;}
.solar-saved-inputs h3{color:var(--season-accent);margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;text-align:center;}
.solar-input-display{background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1.5rem;}
.solar-input-display h4{color:var(--season-accent);margin-bottom:0.75rem;font-size:1rem;text-transform:uppercase;letter-spacing:0.05em;}
.solar-input-display p{color:var(--solar-text-primary);margin:0;line-height:1.6;}
.solar-saved-inputs > p{text-align:center;color:var(--solar-text-muted);font-size:0.9rem;margin:2rem 0 0 0;font-style:italic;}

/* ── Group practice ──────────────────────────────────────────────────────── */
.solar-group-container{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2.5rem;text-align:center;}
.solar-group-emoji{font-size:3rem;margin-bottom:1rem;}
.solar-group-title{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;font-size:1.5rem;}
.solar-group-desc{color:var(--solar-text-secondary);margin-bottom:2rem;line-height:1.7;}
.solar-live-badge{display:inline-flex;align-items:center;gap:0.75rem;background:var(--solar-bg-darker);padding:1rem 1.5rem;border-radius:12px;margin-bottom:2rem;}
.solar-live-badge span{color:var(--solar-text-primary);font-weight:500;}
.solar-group-list{text-align:left;color:var(--solar-text-secondary);list-style:none;padding:0;max-width:500px;margin:0 auto 2rem;}
.solar-group-list li{margin-bottom:0.75rem;padding-left:1.5rem;position:relative;}
.solar-group-list li span{position:absolute;left:0;}
.solar-btn-primary{padding:1rem 2.5rem;background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));border:1px solid rgba(212,165,116,.45);border-radius:50px;color:var(--season-accent);font-size:1rem;cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.05em;transition:all .35s;box-shadow:0 0 24px rgba(212,165,116,.12),inset 0 0 12px rgba(212,165,116,.06);}
.solar-btn-primary:hover{border-color:rgba(212,165,116,.7);color:#fff;box-shadow:0 0 40px rgba(212,165,116,.28),inset 0 0 16px rgba(212,165,116,.1);transform:translateY(-2px);}
.solar-group-note{color:var(--solar-text-muted);margin-top:1.5rem;font-size:0.9rem;font-style:italic;}

/* ── Closure ─────────────────────────────────────────────────────────────── */
.solar-closure{background:var(--neuro-warning-a10);border:1px solid var(--solar-border-accent);border-radius:20px;padding:2rem;margin:3rem 0 2rem;}
.solar-closure h3{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-closure p{color:var(--solar-text-secondary);margin-bottom:1.5rem;}
.solar-textarea{width:100%;min-height:100px;background:var(--solar-bg-dark);border:1px solid var(--solar-border-light);border-radius:12px;padding:1rem;color:var(--solar-text-primary);font-family:inherit;font-size:1rem;line-height:1.6;box-sizing:border-box;resize:vertical;}
.solar-textarea:focus{outline:none;border-color:var(--season-accent);}
.solar-btn-secondary{margin-top:1rem;padding:.75rem 2rem;background:linear-gradient(135deg,rgba(212,165,116,.15),rgba(166,124,82,.2));border:1px solid rgba(212,165,116,.35);border-radius:50px;color:rgba(212,165,116,.8);cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;font-size:.95rem;transition:all .35s;box-shadow:0 0 16px rgba(212,165,116,.08),inset 0 0 8px rgba(212,165,116,.04);}
.solar-btn-secondary:hover{border-color:rgba(212,165,116,.6);color:var(--season-accent);box-shadow:0 0 28px rgba(212,165,116,.2),inset 0 0 12px rgba(212,165,116,.08);transform:translateY(-1px);}

/* ── Popup ───────────────────────────────────────────────────────────────── */
.solar-popup-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:999999;padding:2rem;animation:fadeIn 0.3s;}
.solar-popup-content{background:linear-gradient(135deg,#2a1810 0%,#3a2515 100%);border:1px solid rgba(212,165,116,0.3);border-radius:20px;max-width:600px;width:100%;max-height:85vh;overflow-y:auto;animation:slideUp 0.3s;}
.solar-popup-header{padding:2rem 2rem 1rem 2rem;border-bottom:1px solid rgba(212,165,116,0.2);display:flex;justify-content:space-between;align-items:center;}
.solar-popup-header h2{color:var(--season-accent);margin:0;font-family:'Cormorant Garamond',serif;}
.solar-popup-close{background:linear-gradient(135deg,rgba(212,165,116,.18),rgba(166,124,82,.15));
    border:1px solid rgba(212,165,116,.35);border-radius:50px;
    width:auto;height:auto;padding:.35rem 1rem;
    color:rgba(212,165,116,.85);font-size:.88rem;font-family:'Cormorant Garamond',serif;font-style:italic;
    cursor:pointer;line-height:1;transition:all .35s;
    box-shadow:0 0 12px rgba(212,165,116,.1),inset 0 0 6px rgba(212,165,116,.05);}
.solar-popup-close:hover{border-color:rgba(212,165,116,.65);color:var(--season-accent);transform:translateY(-1px);
    box-shadow:0 0 24px rgba(212,165,116,.2),inset 0 0 10px rgba(212,165,116,.08);}
.solar-popup-body{padding:2rem;}
.solar-popup-section{margin-bottom:2rem;}
.solar-popup-section:last-child{margin-bottom:0;}
.solar-popup-section h3{color:var(--season-accent);margin-bottom:1rem;font-size:1.3rem;font-family:'Cormorant Garamond',serif;}
.solar-popup-section p{color:var(--solar-text-secondary);line-height:1.7;margin-bottom:1rem;}
.solar-popup-section ul{color:var(--solar-text-secondary);line-height:1.8;padding-left:1.5rem;margin:0;}
.solar-popup-section li{margin-bottom:0.75rem;}
.solar-popup-highlight{background:var(--neuro-warning-a10);border-left:3px solid var(--season-accent);padding:1rem 1.5rem;border-radius:8px;margin:1.5rem 0;}
.solar-popup-highlight p{color:var(--solar-text-primary);font-style:italic;margin:0;}
.solar-popup-footer{padding:1.5rem 2rem;border-top:1px solid rgba(212,165,116,0.2);text-align:center;}
.solar-popup-btn{padding:.9rem 2rem;background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));border:1px solid rgba(212,165,116,.45);border-radius:50px;color:var(--season-accent);font-size:.95rem;cursor:pointer;font-family:'Cormorant Garamond',serif;font-style:italic;letter-spacing:.04em;transition:all .35s;box-shadow:0 0 20px rgba(212,165,116,.1),inset 0 0 10px rgba(212,165,116,.05);width:100%;}
.solar-popup-btn:hover{border-color:rgba(212,165,116,.7);color:#fff;box-shadow:0 0 36px rgba(212,165,116,.25),inset 0 0 14px rgba(212,165,116,.08);transform:translateY(-2px);}
.solar-affirmation-btn{display:block;width:100%;padding:.65rem 1.25rem;
    background:linear-gradient(135deg,rgba(212,165,116,.15),rgba(166,124,82,.12));
    border:1px solid rgba(212,165,116,.3);border-radius:50px;
    color:rgba(212,165,116,.75);cursor:pointer;text-align:center;
    font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;letter-spacing:.03em;
    transition:all .35s;margin-bottom:.5rem;
    box-shadow:0 0 10px rgba(212,165,116,.06),inset 0 0 5px rgba(212,165,116,.03);}
.solar-affirmation-btn:hover{background:linear-gradient(135deg,rgba(212,165,116,.25),rgba(166,124,82,.3));
    border-color:rgba(212,165,116,.6);color:var(--season-accent);
    box-shadow:0 0 22px rgba(212,165,116,.18),inset 0 0 10px rgba(212,165,116,.07);transform:translateY(-1px);}

/* ── Inactive room ───────────────────────────────────────────────────────── */
.solar-inactive{min-height:100vh;background:linear-gradient(135deg,#2a1810 0%,#4a2820 100%);padding:2rem;}
.solar-inactive-container{max-width:800px;margin:0 auto;text-align:center;}
.solar-inactive-header{margin-bottom:3rem;}
.solar-inactive-sun{display:inline-block;width:120px;height:120px;position:relative;margin-bottom:1.5rem;}
.solar-inactive-title{font-family:'Cormorant Garamond',serif;font-size:3rem;color:var(--season-accent);margin-bottom:0.5rem;text-shadow:0 2px 10px rgba(212,165,116,0.3);}
.solar-inactive-subtitle{color:rgba(212,165,116,0.7);font-size:1.2rem;}
.solar-inactive-card{background:var(--neuro-warning-a10);border:1px solid rgba(212,165,116,0.3);border-radius:20px;padding:3rem;}
.solar-inactive-card h2{color:var(--season-accent);margin-bottom:1rem;font-family:'Cormorant Garamond',serif;}
.solar-inactive-card p{color:var(--solar-text-secondary);font-size:1.1rem;margin-bottom:1.5rem;}
.solar-inactive-days{color:rgba(212,165,116,0.6);font-size:1rem;}
.solar-inactive-note{color:var(--solar-text-muted);margin-top:2rem;font-style:italic;}

/* ── Responsive: tablet (max 1024px) ────────────────────────────────────── */
@media (max-width:1024px) {
  .solar-top-bar{padding:1.25rem 1.5rem !important;grid-template-columns:1fr auto 1fr !important;}
  .solar-content-wrapper{padding:1.5rem 1.5rem 3rem !important;}
  .solar-sun-glow{width:130px !important;height:130px !important;}
  .solar-practices-grid{grid-template-columns:repeat(2,1fr) !important;max-width:100% !important;}
  .solar-popup-content{max-width:640px !important;}
}

/* ── Responsive: mobile (max 768px) ─────────────────────────────────────── */
@media (max-width:768px) {
  /* Top bar: emoji+name left, button right, live count below */
  .solar-top-bar{grid-template-columns:1fr auto !important;grid-template-rows:auto auto !important;padding:0.75rem 1rem !important;gap:0.5rem !important;}
  .solar-phase-left{grid-column:1 !important;grid-row:1 !important;}
  .solar-back-hub-btn{grid-column:2 !important;grid-row:1 !important;justify-self:end !important;align-self:center !important;padding:0.45rem 0.85rem !important;font-size:0.78rem !important;}
  .solar-live-count-top{grid-column:1 / -1 !important;grid-row:2 !important;justify-self:stretch !important;justify-content:center !important;padding:0.375rem 0.75rem !important;font-size:0.8rem !important;}
  .solar-live-count-top span{font-size:0.8rem !important;}
  .solar-sun-icon{font-size:1.75rem !important;}
  .solar-phase-info h2{font-size:1rem !important;}
  .solar-phase-info p{font-size:0.78rem !important;margin-top:0.15rem !important;}
  /* Content */
  .solar-content-wrapper{padding:1.25rem 1rem 2.5rem !important;}
  .solar-sun-visual{margin-bottom:1.5rem !important;}
  .solar-sun-glow{width:100px !important;height:100px !important;}
  .solar-intro-card{padding:1.25rem !important;margin-bottom:1.5rem !important;border-radius:14px !important;}
  .solar-season-img{max-width:220px !important;margin-bottom:1rem !important;}
  .solar-intro-card p{font-size:0.95rem !important;line-height:1.65 !important;}
  /* Mode toggle */
  .solar-mode-toggle{grid-template-columns:1fr !important;gap:0.4rem !important;margin-bottom:1.25rem !important;padding:.25rem !important;}
  .solar-mode-btn{padding:0.75rem !important;font-size:0.9rem !important;justify-content:center !important;}
  .solar-mode-description{margin-bottom:1.25rem !important;}
  .solar-mode-description h3{font-size:1.2rem !important;}
  .solar-mode-description p{font-size:0.9rem !important;}
  /* Practices */
  .solar-practices-grid{grid-template-columns:1fr !important;gap:0.875rem !important;margin-bottom:1.5rem !important;max-width:100% !important;}
  .solar-practice-card{padding:1.1rem !important;}
  .solar-practice-title{font-size:1.05rem !important;margin-bottom:0.375rem !important;}
  .solar-practice-desc{font-size:0.875rem !important;}
  .solar-practice-icon{width:40px !important;height:40px !important;margin-bottom:0.75rem !important;border-radius:10px !important;}
  .solar-practice-icon svg{width:20px !important;height:20px !important;}
  /* Saved inputs */
  .solar-saved-inputs{padding:1.25rem !important;border-radius:14px !important;}
  .solar-saved-inputs h3{font-size:1.2rem !important;margin-bottom:1rem !important;}
  .solar-input-display{padding:1rem !important;border-radius:10px !important;}
  .solar-input-display h4{font-size:0.9rem !important;}
  .solar-input-display p{font-size:0.9rem !important;}
  /* Group */
  .solar-group-container{padding:1.5rem 1rem !important;border-radius:16px !important;}
  .solar-group-emoji{font-size:2rem !important;margin-bottom:0.75rem !important;}
  .solar-group-title{font-size:1.3rem !important;margin-bottom:0.75rem !important;}
  .solar-group-desc{font-size:0.9rem !important;line-height:1.6 !important;margin-bottom:1.25rem !important;}
  .solar-live-badge{padding:0.75rem 1rem !important;margin-bottom:1.25rem !important;border-radius:10px !important;}
  .solar-live-badge span{font-size:0.875rem !important;}
  .solar-group-list{font-size:0.875rem !important;max-width:100% !important;margin-bottom:1.25rem !important;padding-left:0 !important;}
  .solar-group-list li{margin-bottom:0.5rem !important;padding-left:1.25rem !important;font-size:0.875rem !important;}
  .solar-btn-primary{padding:0.875rem 1.5rem !important;font-size:1rem !important;width:100%;box-sizing:border-box;}
  .solar-group-note{font-size:0.8rem !important;margin-top:1rem !important;}
  /* Closure */
  .solar-closure{padding:1.25rem !important;margin:1.5rem 0 1rem !important;border-radius:14px !important;}
  .solar-closure h3{font-size:1.2rem !important;margin-bottom:0.75rem !important;}
  .solar-closure p{font-size:0.9rem !important;margin-bottom:1rem !important;}
  .solar-textarea{font-size:0.9rem !important;padding:0.75rem !important;min-height:80px !important;border-radius:10px !important;}
  .solar-btn-secondary{padding:0.75rem 1.25rem !important;font-size:0.9rem !important;width:100%;box-sizing:border-box;}
  /* Popup — sheet from bottom */
  .solar-popup-overlay{padding:0 !important;align-items:flex-end !important;}
  .solar-popup-content{max-width:100% !important;width:100% !important;max-height:92vh !important;border-radius:24px 24px 0 0 !important;}
  .solar-popup-header{padding:1.25rem 1.25rem 0.875rem !important;}
  .solar-popup-header h2{font-size:1.2rem !important;}
  .solar-popup-close{font-size:.8rem !important;padding:.3rem .875rem !important;}
  .solar-popup-body{padding:1.25rem !important;}
  .solar-popup-section{margin-bottom:1.25rem !important;}
  .solar-popup-section h3{font-size:1.1rem !important;margin-bottom:0.625rem !important;}
  .solar-popup-section p,.solar-popup-section li{font-size:0.9rem !important;line-height:1.6 !important;}
  .solar-popup-highlight{padding:0.75rem 1rem !important;border-radius:8px !important;margin:0.875rem 0 !important;}
  .solar-popup-footer{padding:1rem 1.25rem !important;}
  .solar-popup-btn{padding:0.875rem !important;font-size:0.95rem !important;}
  .solar-affirmation-btn{font-size:0.875rem !important;padding:0.625rem !important;}
  /* Inactive */
  .solar-inactive{padding:1.25rem !important;}
  .solar-inactive-title{font-size:clamp(1.5rem,7vw,2.5rem) !important;}
  .solar-inactive-subtitle{font-size:1rem !important;}
  .solar-inactive-card{padding:1.5rem 1rem !important;border-radius:14px !important;}
  .solar-inactive-card h2{font-size:1.2rem !important;}
  .solar-inactive-card p{font-size:0.9rem !important;}
  .solar-inactive-sun{width:80px !important;height:80px !important;}
}

/* ── Responsive: extra small (max 380px) ─────────────────────────────────── */
@media (max-width:380px) {
  .solar-sun-glow{width:72px !important;height:72px !important;}
  .solar-content-wrapper{padding:0.75rem 0.625rem 1.5rem !important;}
  .solar-intro-card{padding:0.875rem !important;}
  .solar-season-img{max-width:160px !important;}
  .solar-inactive-title{font-size:clamp(1.3rem,7vw,2rem) !important;}
  .solar-inactive-card{padding:1.25rem 0.875rem !important;}
}
    `}};window.SolarUIManager=d;const ne=Object.freeze(Object.defineProperty({__proto__:null,SolarUIManager:d},Symbol.toStringTag,{value:"Module"})),P={location:{latitude:31,longitude:0,name:"Default"},currentSolarData:null,currentSolarRoom:null,solarRooms:[{season:"spring",icon:"🌱",roomName:"Spring Awakening",roomId:"spring-equinox",description:"Renewal energy and fresh beginnings",energy:"Renewal, Growth, Awakening",practices:["Dawn meditation","Renewal rituals","Energy activation","New beginning visualization"]},{season:"summer",icon:"☀️",roomName:"Summer Radiance",roomId:"summer-solstice",description:"Peak vitality and expansive energy",energy:"Vitality, Expansion, Power",practices:["Solar noon meditation","Fire ceremony","Peak energy practice","Celebration ritual"]},{season:"autumn",icon:"🍂",roomName:"Autumn Harvest",roomId:"autumn-equinox",description:"Gratitude and preparation for rest",energy:"Gratitude, Harvest, Balance",practices:["Gratitude meditation","Harvest ritual","Balance practice","Reflection ceremony"]},{season:"winter",icon:"❄️",roomName:"Winter Stillness",roomId:"winter-solstice",description:"Deep rest and inner contemplation",energy:"Rest, Stillness, Contemplation",practices:["Deep rest meditation","Inner journey","Stillness practice","Contemplative silence"]}],init(){if(this._initialized)return;this._initialized=!0;const e=()=>this.updateAll();navigator.geolocation?navigator.geolocation.getCurrentPosition(({coords:t})=>{this.location={latitude:t.latitude,longitude:t.longitude,name:"Your Location"},e()},e,{timeout:5e3,maximumAge:36e5}):e(),setInterval(e,A.UPDATE_INTERVAL_MS)},updateAll(){this.updateSolarData(),this.updateSolarVisualization(),this.updateSolarRoom(),this.renderSolarCard()},setLocation(e,t,o){this.location={latitude:e,longitude:t,name:o},this.updateAll()},updateSolarData(){const e=new Date,{latitude:t,longitude:o}=this.location,r=U.getTimes(e,t,o),n=this.calculateSunDeclination(e),{name:i,days:a}=this._getNextTransition(e);this.currentSolarData={sunrise:r.sunrise,sunset:r.sunset,solarNoon:r.solarNoon,declination:n,seasonInfo:this.getSeasonInfo(e),currentSeason:this.getCurrentSeason(),nextSeasonName:i,daysToNextSeason:a,position:U.getPosition(e,t,o)},this.renderSolarInfo()},renderSolarInfo(){const e=this.currentSolarData;if(!e)return;const t=(r,n)=>{const i=document.getElementById(r);i&&(i.textContent=n)};t("sunrise",this.formatTime(e.sunrise)),t("sunset",this.formatTime(e.sunset)),t("solarNoon",this.formatTime(e.solarNoon)),t("seasonInfo",e.seasonInfo);const o=document.getElementById("solarDeclination");if(o){const r=o.querySelector(".decl-value");r&&(r.textContent=`${Math.abs(e.declination).toFixed(1)}° ${e.declination>=0?"N":"S"}`)}},calculateSunDeclination(e){const t=this.getDayOfYear(e);return 23.44*Math.sin(2*Math.PI*(t-81)/365)},getDayOfYear(e){return Math.floor((e-new Date(e.getFullYear(),0,0))/864e5)},getSeasonDates(e){if(this._seasonDatesCache||(this._seasonDatesCache={}),this._seasonDatesCache[e])return this._seasonDatesCache[e];const t=(e-2e3)/1e3,o=p=>{const m={spring:[245162380984e-5,365242.37404,.05169,-.00411,-57e-5],summer:[245171656767e-5,365241.62603,.00325,.00888,-3e-4],autumn:[245181021715e-5,365242.01767,-.11575,.00337,78e-5],winter:[245190005952e-5,365242.74049,-.06223,-.00823,32e-5]}[p];return m[0]+m[1]*t+m[2]*t**2+m[3]*t**3+m[4]*t**4},r=p=>{const m=(p-2451545)/36525,M=35999.373*m-2.47,_=1+.0334*Math.cos(M*Math.PI/180)+7e-4*Math.cos(2*M*Math.PI/180),B=[[485,324.96,1934.136],[203,337.23,32964.467],[199,342.08,20.186],[182,27.85,445267.112],[156,73.14,45036.886],[136,171.52,22518.443],[77,222.54,65928.934],[74,296.72,3034.906],[70,243.58,9037.513],[58,119.81,33718.148],[52,297.17,150.678],[50,21.02,2281.226]].reduce((L,[k,$,N])=>L+k*Math.cos(($+N*m)*Math.PI/180),0);return p+1e-5*B/_},n=p=>new Date((p-24405875e-1)*864e5),i=p=>new Date(p.getTime()-864e5),a=p=>n(r(o(p))),l=a("spring"),s=a("summer"),u=a("autumn"),x=a("winter"),E=n(r((()=>{const p=(e+1-2e3)/1e3,m=[245162380984e-5,365242.37404,.05169,-.00411,-57e-5];return m[0]+m[1]*p+m[2]*p**2+m[3]*p**3+m[4]*p**4})())),C={spring:{start:l,end:i(s)},summer:{start:s,end:i(u)},autumn:{start:u,end:i(x)},winter:{start:x,end:i(E)}};return this._seasonDatesCache[e]=C,C},getCurrentSeason(){const e=new Date,t=e.getFullYear(),o=this.location.latitude>=0,r={spring:"autumn",summer:"winter",autumn:"spring",winter:"summer"},n=this.getSeasonDates(t-1);if(e>=n.winter.start&&e<=n.winter.end)return o?"winter":"summer";const i=this.getSeasonDates(t);for(const a of["spring","summer","autumn","winter"]){const{start:l,end:s}=i[a];if(e>=l&&e<=s)return o?a:r[a]}return"winter"},_getUpcomingTransitions(e){const t=e.getFullYear(),o=this.getSeasonDates(t),r=this.getSeasonDates(t+1);return[{name:"Spring Equinox",date:o.spring.start},{name:"Summer Solstice",date:o.summer.start},{name:"Autumn Equinox",date:o.autumn.start},{name:"Winter Solstice",date:o.winter.start},{name:"Spring Equinox",date:r.spring.start}].filter(n=>n.date>e).sort((n,i)=>n.date-i.date)},getSeasonInfo(e){const t=this._getUpcomingTransitions(e)[0];return`${Math.ceil((t.date-e)/864e5)} days to ${t.name}`},_getNextTransition(e){const t=this._getUpcomingTransitions(e)[0];return{name:t.name.split(" ")[0],days:Math.ceil((t.date-e)/864e5)}},getNextSeasonInfo(e){return this._getNextTransition(e)},updateSolarVisualization(){this.currentSolarData&&this.drawWheelOfYear(this.currentSolarData)},drawWheelOfYear(e){var W;const t=document.getElementById("solarSvg");if(!t)return;const o=280,r=140,n=140,i=110,a=52;t.setAttribute("viewBox",`0 0 ${o} ${o}`),t.setAttribute("width","100%"),t.style.height="auto",t.innerHTML="";const l="http://www.w3.org/2000/svg",s=(h,g)=>{const S=document.createElementNS(l,h);return Object.entries(g).forEach(([I,T])=>S.setAttribute(I,T)),S},u=s("defs",{}),x=s("clipPath",{id:"woyClip"});x.appendChild(s("circle",{cx:r,cy:n,r:i-1})),u.appendChild(x),t.appendChild(u);const E=[{d:`M${r},${n} L${r},${n-i} L${r+i},${n-i} L${r+i},${n} Z`,fill:"#C0DD97"},{d:`M${r},${n} L${r+i},${n} L${r+i},${n+i} L${r},${n+i} Z`,fill:"#FAC775"},{d:`M${r},${n} L${r},${n+i} L${r-i},${n+i} L${r-i},${n} Z`,fill:"#F0957B"},{d:`M${r},${n} L${r-i},${n} L${r-i},${n-i} L${r},${n-i} Z`,fill:"#B5D4F4"}],C=s("g",{"clip-path":"url(#woyClip)"});E.forEach(({d:h,fill:g})=>C.appendChild(s("path",{d:h,fill:g,opacity:"0.45",stroke:"none"}))),t.appendChild(C),t.appendChild(s("circle",{cx:r,cy:n,r:i,fill:"none",stroke:"var(--neuro-shadow-light)","stroke-width":"1.5"})),t.appendChild(s("circle",{cx:r,cy:n,r:a,fill:"none",stroke:"var(--neuro-shadow-light)","stroke-width":"1","stroke-dasharray":"3 3",opacity:"0.6"})),t.appendChild(s("line",{x1:r-i,y1:n,x2:r+i,y2:n,stroke:"var(--neuro-shadow-light)","stroke-width":"0.8"})),t.appendChild(s("line",{x1:r,y1:n-i,x2:r,y2:n+i,stroke:"var(--neuro-shadow-light)","stroke-width":"0.8"}));const p=(h,g,S,I,T,D)=>{const F=s("text",{x:h,y:g,"text-anchor":"middle",fill:T,"font-size":"9","font-weight":"600"});F.textContent=S,t.appendChild(F);const H=s("text",{x:h,y:g+11,"text-anchor":"middle",fill:D,"font-size":"7.5"});H.textContent=I,t.appendChild(H)};p(r+55,n-40,"Spring","Mar · Apr · May","#3B6D11","#639922"),p(r+55,n+52,"Summer","Jun · Jul · Aug","#854F0B","#BA7517"),p(r-55,n+52,"Autumn","Sep · Oct · Nov","#993C1D","#D85A30"),p(r-55,n-40,"Winter","Dec · Jan · Feb","#185FA5","#378ADD");const m=(h,g,S)=>{const I=s("text",{x:h,y:g,"text-anchor":"middle","font-size":"11"});I.textContent=S,t.appendChild(I)};m(r,n-i+8,"🌱"),m(r+i-6,n+4,"☀️"),m(r,n+i-2,"🍂"),m(r-i+6,n+4,"❄️"),[[r,n-i,r,n-i+8],[r+i,n,r+i-8,n],[r,n+i,r,n+i-8],[r-i,n,r-i+8,n]].forEach(([h,g,S,I])=>t.appendChild(s("line",{x1:h,y1:g,x2:S,y2:I,stroke:"var(--neuro-text)","stroke-width":"1.5","stroke-linecap":"round"})));const M=79,_=new Date,B=this.getDayOfYear(_),L=-Math.PI/2+(B-M)/365*2*Math.PI,k=r+i*Math.cos(L),$=n+i*Math.sin(L);for(let h=0;h<8;h++){const g=h*Math.PI/4;t.appendChild(s("line",{x1:k+Math.cos(g)*10,y1:$+Math.sin(g)*10,x2:k+Math.cos(g)*15,y2:$+Math.sin(g)*15,stroke:"#EF9F27","stroke-width":"1.5","stroke-linecap":"round"}))}t.appendChild(s("circle",{cx:k,cy:$,r:"8",fill:"#EF9F27",stroke:"#BA7517","stroke-width":"1.2"})),t.appendChild(s("circle",{cx:k,cy:$,r:"3.5",fill:"#FCDE5A",opacity:"0.9"}));const{nextSeasonName:N,daysToNextSeason:Y}=e,V=_.toLocaleDateString("en-US",{month:"short",day:"numeric"}),j=this.getCurrentSeason(),q=j.charAt(0).toUpperCase()+j.slice(1),J=((W=this.getSeasonDates(_.getFullYear())[j])==null?void 0:W.start)||_,X=Math.max(1,Math.floor((_-J)/864e5)+1),O=(h,g,S,I,T)=>{const D=s("text",{x:r,y:g,"text-anchor":"middle",fill:T,"font-size":S,"font-weight":I});D.textContent=h,t.appendChild(D)};O(V,n-10,"9","700","var(--neuro-text)"),O(`${X} days in ${q}`,n+3,"7.5","400","var(--neuro-text-light)"),O(`${Y} days to ${N}`,n+15,"7.5","400","#BA7517")},updateSolarRoom(){const e=this.getCurrentSeason(),t=this.solarRooms.find(o=>o.season===e);t&&t!==this.currentSolarRoom&&(this.currentSolarRoom=t,this.renderSolarRoom(t))},renderSolarRoom(e){const t=(r,n)=>{const i=document.getElementById(r);i&&(i.textContent=n)};t("solarRoomIcon",e.icon),t("solarRoomName",e.roomName),t("solarRoomDesc",e.description);const o=document.getElementById("solarPracticeRoom");o&&(o.setAttribute("data-room-id",e.roomId),o.setAttribute("data-room-energy",e.energy))},getCurrentRoom(){return this.currentSolarRoom},renderSolarCard(){var i,a,l;const e=document.getElementById("solarContainer");if(!e){console.warn("SolarEngine: solarContainer not found");return}if(!this.currentSolarData||!this.currentSolarRoom){e.innerHTML='<p style="color:var(--text-muted);padding:20px;">Loading solar data...</p>';return}const{currentSolarData:t,currentSolarRoom:o}=this,r=(l=(a=(i=window.Core)==null?void 0:i.state)==null?void 0:a.currentUser)==null?void 0:l.is_admin,n=t.currentSeason.charAt(0).toUpperCase()+t.currentSeason.slice(1);e.innerHTML=`
      <div class="celestial-card-full solar-card">
        <div class="celestial-content-horizontal">
          <div class="celestial-visual-section">
            <div class="solar-visual" id="solarVisual">
              <svg width="100%" viewBox="0 0 280 280" id="solarSvg" style="max-width:280px;display:block;margin:0 auto;" aria-hidden="true" focusable="false"></svg>
            </div>
          </div>
          <div class="celestial-info-section">
            <div class="celestial-info-title">Solar Position &amp; Seasons</div>
            <div class="solar-info">
              <div class="solar-season-name">${n}</div>
              <div class="solar-declination">Declination: <span class="decl-value">${t.declination>0?"+":""}${t.declination.toFixed(1)}°</span></div>
            </div>
            <div class="next-season">Next: ${t.nextSeasonName} (${t.daysToNextSeason} days)</div>
          </div>
          <div class="celestial-times-section">
            <div class="celestial-time">
              <span class="time-label">Sunrise</span>
              <span class="time-value" id="sunrise">${this.formatTime(t.sunrise)}</span>
            </div>
            <div class="celestial-time">
              <span class="time-label">Sunset</span>
              <span class="time-value" id="sunset">${this.formatTime(t.sunset)}</span>
            </div>
          </div>
        </div>

        <div class="celestial-practice-room" data-room-type="solar" id="solarPracticeRoom">
          <div class="room-divider"></div>
          <div class="room-content-inline">
            <div class="room-header-inline">
              <div class="room-icon-inline" id="solarRoomIcon">${o.icon}</div>
              <div class="room-info-inline">
                <div class="room-name-inline" id="solarRoomName">${o.roomName}</div>
                <div class="room-desc-inline" id="solarRoomDesc">${o.description}</div>
              </div>
            </div>
            <div class="room-meta-inline">
              <div class="room-energy">
                <div class="energy-pulse" style="background:var(--ring-guiding);"></div>
                <span id="solarRoomPresence">0 present</span>
              </div>
              <button type="button" class="btn btn-primary join-btn-inline" onclick="SolarEngine.joinSolarRoom()">Join Space</button>
            </div>
          </div>
        </div>

        ${r?this.renderAdminSection():""}
      </div>`,this.updateSolarVisualization(),this._refreshOuterCard(),this._attachSolarAdminListeners()},_attachSolarAdminListeners(){const e=document.querySelector(".solar-admin-header");if(e&&!e._solarBound){const t=()=>{const o=document.getElementById(e.dataset.panel),r=document.getElementById(e.dataset.toggle),n=(o==null?void 0:o.style.display)!=="none";o&&(o.style.display=n?"none":"block"),r&&(r.textContent=n?"▶":"▼"),e.setAttribute("aria-expanded",String(!n))};e.addEventListener("click",t),e.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),t())}),e._solarBound=!0}document.querySelectorAll(".solar-admin-header ~ div button[data-room-id]").forEach(t=>{t._solarBound||(t.addEventListener("click",()=>this.adminJoinRoom(t.dataset.roomId)),t.addEventListener("mouseover",()=>t.style.background="var(--border)"),t.addEventListener("mouseout",()=>t.style.background="var(--season-mood)"),t._solarBound=!0)})},_refreshOuterCard(){var r,n;if(!((r=v)!=null&&r.ready)){this._outerCardRetry||(this._outerCardRetry=setTimeout(()=>{this._outerCardRetry=null,this._refreshOuterCard()},500));return}const e=this.currentSolarRoom;if(!e)return;const t=`${e.season}-solar`,o=async()=>{try{const i=await v.getRoomParticipants(t),a=document.getElementById("solarRoomPresence");a&&(a.textContent=`${i.length} present`)}catch(i){console.warn("[SolarEngine] _refreshOuterCard error:",i)}};o();try{(n=this._outerCardSub)==null||n.unsubscribe()}catch{}this._outerCardSub=v.subscribeToPresence(o)},renderAdminSection(){const e="solarAdminPanel",t="solarAdminToggle";return`
      <div style="margin-top:24px;border-radius:var(--radius-lg);border:2px dashed var(--neuro-accent-a30);overflow:hidden;">
        <div class="solar-admin-header" role="button" tabindex="0" aria-expanded="false" data-panel="${e}" data-toggle="${t}">
          <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ADMIN: Enter Any Solar Room</span>
          <span id="${t}" style="font-size:11px;">▶</span>
        </div>
        <div id="${e}" style="padding:16px 20px;background:var(--neuro-bg-lighter);border-top:1px solid var(--neuro-accent-a10);display:none;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
            ${this.solarRooms.map(o=>`
              <button type="button" data-room-id="${o.roomId}"
                      style="padding:12px;background:var(--season-mood);border:1px solid var(--border);border-radius:var(--radius-md);cursor:pointer;text-align:left;transition:all 0.2s;">
                <div style="font-size:24px;margin-bottom:4px;">${o.icon}</div>
                <div style="font-size:13px;font-weight:600;color:var(--text);">${o.roomName}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;text-transform:capitalize;">${o.season}</div>
              </button>`).join("")}
          </div>
        </div>
      </div>`},adminJoinRoom(e){this._loadAndEnterRoom(e)},injectAdminUI(){var o,r,n;if(!((n=(r=(o=window.Core)==null?void 0:o.state)==null?void 0:r.currentUser)!=null&&n.is_admin))return;const e=document.getElementById("solarContainer");if(!e||e.querySelector("#solarAdminPanel"))return;const t=e.querySelector(".celestial-card-full");t&&t.insertAdjacentHTML("beforeend",this.renderAdminSection())},_ROOM_MODULES:{"spring-equinox":()=>z(()=>Promise.resolve().then(()=>Q),void 0),"summer-solstice":()=>z(()=>Promise.resolve().then(()=>Z),void 0),"autumn-equinox":()=>z(()=>Promise.resolve().then(()=>K),void 0),"winter-solstice":()=>z(()=>Promise.resolve().then(()=>ee),void 0)},_roomExportName:{"spring-equinox":"SpringSolarRoom","summer-solstice":"SummerSolarRoom","autumn-equinox":"AutumnSolarRoom","winter-solstice":"WinterSolarRoom"},async _loadAndEnterRoom(e){var o,r,n,i,a,l;const t=this._ROOM_MODULES[e];if(!t){(r=(o=window.Core)==null?void 0:o.showToast)==null||r.call(o,`Unknown room: ${e}`);return}try{const u=(await t())[this._roomExportName[e]];u?u.enterRoom():(i=(n=window.Core)==null?void 0:n.showToast)==null||i.call(n,`${e} failed to initialise`)}catch(s){console.error(`[SolarEngine] _loadAndEnterRoom error for ${e}:`,s),(l=(a=window.Core)==null?void 0:a.showToast)==null||l.call(a,`Failed to load ${e}`)}},joinSolarRoom(){var e,t;if(!this.currentSolarRoom){(t=(e=window.Core)==null?void 0:e.showToast)==null||t.call(e,"Solar room not ready");return}this._loadAndEnterRoom(this.currentSolarRoom.roomId)},formatTime:e=>!e||isNaN(e.getTime())?"N/A":e.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0}),formatDate:e=>e.toLocaleDateString("en-US",{month:"short",day:"numeric"}),getSolarData(){return this.currentSolarData}};window.SolarEngine=P;const ie=Object.freeze(Object.defineProperty({__proto__:null,SolarEngine:P},Symbol.toStringTag,{value:"Module"})),R={config:{},practices:{},prebuiltAffirmations:[],userData:{intention:"",affirmation:"",releaseList:"",practiceCount:0,closureReflection:"",completedDate:null,privateIntention:"",collectiveWord:"",intentionShared:!1},isActive:!1,startDate:null,endDate:null,collectiveTimer:null,saveDebounceTimer:null,eventListeners:[],CONSTANTS:{MAX_INTENTION_LENGTH:500,MAX_AFFIRMATION_LENGTH:300,MAX_RELEASE_LIST_LENGTH:1e3,SAVE_DEBOUNCE_MS:500},_sanitizeInput(e){return typeof e!="string"?"":e.trim().slice(0,1e3).replace(/<script[^>]*>.*?<\/script>/gi,"").replace(/<iframe[^>]*>.*?<\/iframe>/gi,"").replace(/<object[^>]*>.*?<\/object>/gi,"")},_escapeHtml:e=>c.escapeHtml(e),_removeEventListeners(){this.eventListeners.forEach(({element:e,event:t,handler:o})=>e==null?void 0:e.removeEventListener(t,o)),this.eventListeners=[]},_clearTimer(){this.collectiveTimer&&(clearInterval(this.collectiveTimer),this.collectiveTimer=null)},cleanup(){this._clearTimer(),this._removeEventListeners(),clearTimeout(this.saveDebounceTimer),this.saveDebounceTimer=null,this._unsubPresence(),this._unsubCollectiveWords()},_unsubPresence(){var e;try{(e=this._presenceSub)==null||e.unsubscribe()}catch{}this._presenceSub=null},_unsubCollectiveWords(){var e;try{(e=this._collectiveWordsSub)==null||e.unsubscribe()}catch{}this._collectiveWordsSub=null},_startCountdownTimer(e,t,o,r){var n;try{(n=document.getElementById(t))!=null&&n.style&&(document.getElementById(t).style.display="none");const i=document.getElementById(e);if(!i)return;i.setAttribute("role","timer"),i.setAttribute("aria-live","off");let a=o;this._clearTimer(),this.collectiveTimer=setInterval(()=>{a--;const l=Math.floor(a/60),s=a%60;i.textContent=`${l}:${String(s).padStart(2,"0")}`,a<=0&&(this._clearTimer(),i.textContent="Complete",r==null||r())},1e3)}catch(i){console.error("[BaseSolarRoom] _startCountdownTimer error:",i),this._clearTimer()}},init(){try{this.checkIfActive(),this.isActive&&(this.calculateDates(),this.loadData())}catch(e){console.error(`${this.config.displayName} init error:`,e)}},checkIfActive(){var i,a,l;if((l=(a=(i=window.Core)==null?void 0:i.state)==null?void 0:a.currentUser)!=null&&l.is_admin){this.isActive=!0;return}const e=new Date,t=e.getFullYear(),o=this.config.name,r=P.getSeasonDates(t)[o];if(e>=r.start&&e<=r.end){this.isActive=!0;return}const n=P.getSeasonDates(t-1)[o];this.isActive=e>=n.start&&e<=n.end},calculateDates(){const e=new Date,t=this.config.name,o=P.getSeasonDates(e.getFullYear()-1)[t];if(e>=o.start&&e<=o.end){this.startDate=o.start,this.endDate=o.end;return}const r=P.getSeasonDates(e.getFullYear())[t];this.startDate=r.start,this.endDate=r.end},loadData(){var t;const e=d.storage.get(this.config.name);e&&new Date(e.seasonStartDate).getTime()===((t=this.startDate)==null?void 0:t.getTime())&&(this.userData=e.data)},saveData(){d.storage.set(this.config.name,{seasonStartDate:this.startDate.toISOString(),data:this.userData})||d.showToast("Could not save data. Check storage limits.")},enterRoom(){var t,o,r,n,i,a,l;const e=(r=(o=(t=window.Core)==null?void 0:t.state)==null?void 0:o.currentUser)==null?void 0:r.is_admin;if(!this.isActive&&!e){d.showToast(`${this.config.emoji} ${this.config.displayName} room opens during ${this.config.displayName.toLowerCase()} season`);return}this.startDate||this.calculateDates(),(i=(n=window.Core)==null?void 0:n.navigateTo)==null||i.call(n,"practiceRoomView"),(l=(a=window.PracticeRoom)==null?void 0:a.stopHubPresence)==null||l.call(a),document.body.classList.add("solar-room-active"),this.renderDashboard(),this._setPresence(),this._loadCollectiveWords()},leaveRoom(){var e,t,o,r;try{this._clearPresence(),this._unsubPresence(),this._unsubCollectiveWords(),this._clearTimer(),this._removeEventListeners(),document.body.classList.remove("solar-room-active"),window.currentSolarRoom=null,(t=(e=window.PracticeRoom)==null?void 0:e.startHubPresence)==null||t.call(e),(r=(o=window.Core)==null?void 0:o.navigateTo)==null||r.call(o,"hubView")}catch(n){console.error("Error leaving solar room:",n)}},renderDashboard(){d.injectStyles();const e=document.getElementById("dynamicRoomContent");if(!e){console.error("dynamicRoomContent not found");return}document.body.setAttribute("data-season",this.config.name),window.currentSolarRoom=this;const t=d.utils.calculateDaysRemaining(this.endDate),o=`${t} ${t===1?"day":"days"} remaining`,r=`${A.IMAGE_BASE_URL}${this.config.displayName}.webp`,n=this.getLivingPresenceCount();e.innerHTML=`
      <div class="solar-room-bg">
        <div class="solar-floating-bg">
          ${d.utils.generateFloatingElements(this.config.floatingEmojis)}
        </div>

        ${d.renderers.topBar({seasonName:this.config.displayName,emoji:this.config.emoji,daysText:o,livingPresenceCount:n})}

        <div class="solar-content-wrapper">
          <div class="solar-sun-visual">
            <div class="solar-sun-glow"><div class="solar-sun-sphere"></div></div>
          </div>

          <div class="solar-intro-card">
            <picture>
              <source srcset="${r}" type="image/webp">
              <img src="${r.replace(".webp",".png")}" alt="${this.config.displayName} Season"
                   width="600" height="400" class="solar-season-img" loading="lazy" decoding="async">
            </picture>
            <p>${this.config.wisdom}</p>
          </div>

          ${d.renderers.modeToggle()}

          <div id="soloContent" class="solar-mode-content">
            <div class="solar-mode-description">
              <h3>Your Sacred Space</h3>
              <p>${this.config.modeDescription||"Individual practices for this season"}</p>
            </div>
            <div class="solar-practices-grid" id="practicesGrid">
              ${Object.values(this.practices).map(i=>d.renderers.practiceCard(i,this.isPracticeLocked(i))).join("")}
            </div>
            ${d.renderers.savedInputs(this.userData,this.config.displayName)}
          </div>

          <div id="groupContent" class="solar-mode-content" style="display:none;">
            ${d.renderers.groupPractice({seasonEmoji:this.config.seasonEmoji,seasonName:this.config.displayName,presenceCount:n,itemEmoji:this.config.itemEmoji,sessionTimes:this.config.sessionTimes,collectiveFocus:this.config.collectiveFocus,collectiveNoun:this.config.collectiveNoun})}
          </div>

          ${t<=7?d.renderers.closureSection(this.config.closure):""}
        </div>
      </div>`,this._attachEventListeners(e),setTimeout(()=>this._refreshLivePresence(),300)},_attachEventListeners(e){try{this._removeEventListeners();const t=(i,a,l)=>{i&&(i.addEventListener(a,l),this.eventListeners.push({element:i,event:a,handler:l}))},o=e.querySelector("#practicesGrid"),r=i=>{const a=i.target.closest(".solar-practice-card");a&&(i.type==="keydown"&&i.key!=="Enter"&&i.key!==" "||(i.type==="keydown"&&i.preventDefault(),a.dataset.locked==="true"?d.showToast("Complete the first practice to unlock others"):this.showPracticePopup(a.dataset.practice)))};t(o,"click",r),t(o,"keydown",r),t(e.querySelector(".solar-mode-toggle"),"click",i=>{const a=i.target.closest(".solar-mode-btn");a!=null&&a.dataset.mode&&d.switchMode(a.dataset.mode)});const n=e.querySelector('[data-action="submit-closure"]');t(n,"click",()=>this.submitClosure())}catch(t){console.error("Error attaching event listeners:",t)}},isPracticeLocked:()=>!1,getPracticeContent(e){const t=`get${e.charAt(0).toUpperCase()}${e.slice(1)}Content`;return typeof this[t]=="function"?this[t]():(console.error(`[BaseSolarRoom] Content method ${t} not found for ${e}`),'<div class="solar-popup-section"><p>Practice content not available.</p></div>')},showPracticePopup(e){try{const t=this.practices[e];if(!t){console.error(`Practice ${e} not found`);return}const o=document.createElement("div");o.id="practicePopup",o.innerHTML=d.renderers.popup({title:t.title,content:this.getPracticeContent(e),hasSaveButton:!!t.hasSaveData}),(document.getElementById("communityHubFullscreenContainer")||document.body).appendChild(o),this._attachPopupListeners(o,e)}catch(t){console.error("Error showing practice popup:",t)}},_attachPopupListeners(e,t){var o;try{e.querySelectorAll(".solar-affirmation-btn").forEach(r=>{r.addEventListener("click",()=>{const n=document.getElementById("affirmationText");n&&(n.value=r.dataset.affirmation)})}),(o=e.querySelector('[data-action="save-practice"]'))==null||o.addEventListener("click",()=>this.savePractice(t)),e.querySelectorAll('[data-action="close-popup"]').forEach(r=>r.addEventListener("click",()=>d.closePracticePopup()))}catch(r){console.error("Error attaching popup listeners:",r)}},savePractice(e){try{const t=this.practices[e];if(!(t!=null&&t.hasSaveData))return;const o=a=>{const l=document.getElementById(a);return l?this._sanitizeInput(l.value):null},r=o("intentionText"),n=o("affirmationText"),i=o("releaseListText");r!==null&&(this.userData.intention=r),n!==null&&(this.userData.affirmation=n),i!==null&&(this.userData.releaseList=i),this.userData.practiceCount++,this.saveData(),d.showToast("Practice saved"),d.closePracticePopup(),this.renderDashboard()}catch(t){console.error("Error saving practice:",t),d.showToast("Failed to save practice")}},submitClosure(){const e=document.getElementById("closureReflection");if(!e){d.showToast("Reflection field not found");return}const t=e.value.trim();if(!t){d.showToast("Please write your closing reflection");return}if(t.length<A.MIN_REFLECTION_LENGTH){d.showToast(`Please write at least ${A.MIN_REFLECTION_LENGTH} characters`);return}this.userData.closureReflection=t,this.userData.completedDate=new Date().toISOString(),this.saveData(),d.showToast(`${this.config.emoji} ${this.config.displayName} season complete. Rest well until the next cycle.`),setTimeout(()=>this.init(),1e3)},showCollectiveIntentionPopup(){try{const e=document.createElement("div");e.id="collectivePopup",e.className="solar-practice-popup",e.innerHTML=`
        <div class="solar-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="collectivePopupTitle">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2 id="collectivePopupTitle">${this.config.seasonEmoji} ${this.config.displayName} Group Circle</h2>
              <button type="button" class="solar-popup-close" aria-label="Close group circle" data-close-collective>×</button>
            </div>
            <div class="solar-popup-body" id="collectiveIntentionContent">
              ${this._renderCollectiveStep1()}
            </div>
          </div>
        </div>`,e.querySelector(".solar-popup-overlay").addEventListener("click",t=>{t.target===t.currentTarget&&e.remove()}),e.querySelector("[data-close-collective]").addEventListener("click",()=>e.remove()),(document.getElementById("communityHubFullscreenContainer")||document.body).appendChild(e)}catch(e){console.error("Error showing collective popup:",e)}},_renderCollectiveStep1(){const e=this.getLivingPresenceCount(),t=this._cachedParticipants?this._buildRealAvatars(this._cachedParticipants):"";return`
      <div class="solar-popup-section" style="text-align:center;">
        <div class="solar-live-badge" style="margin-bottom:1rem;">
          <div class="solar-pulse-dot"></div>
          <span id="solarCollectivePresenceBadge">${e} practitioners in circle now</span>
        </div>
        ${t?`<div id="solarCollectiveAvatars" style="display:flex;gap:6px;justify-content:center;margin-bottom:2rem;">${t}</div>`:""}
        <h3>Welcome to the ${this.config.displayName} Circle</h3>
        <p style="margin:1.5rem 0;">This is a shared practice for ${this.config.collectiveFocus||"seasonal alignment"}.</p>
        <p>You will be guided through 5 steps:</p>
        <ol style="text-align:left;max-width:500px;margin:2rem auto;line-height:1.8;">
          <li>Silent meditation (3 minutes)</li>
          <li>Write your private seasonal intention</li>
          <li>Choose one word for the collective field</li>
          <li>Witness the collective ${this.config.collectiveNoun||"energy"}</li>
          <li>Silent witnessing (2 minutes)</li>
        </ol>
        <button class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep2()">Begin Practice</button>
      </div>`},startCollectiveStep2(){try{const e=document.getElementById("collectiveIntentionContent");if(!e)return;e.innerHTML=`
        <div class="solar-popup-section" style="text-align:center;">
          <h3>Step 1: Silent Meditation</h3>
          <p>Take 3 minutes to center yourself in the ${this.config.displayName} energy.</p>
          <div id="meditationTimer" class="solar-timer-display">3:00</div>
          <button type="button" id="startMeditationBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.startMeditationTimer()">Begin Meditation</button>
          <button type="button" id="skipToIntentionBtn" class="solar-popup-btn solar-btn-secondary"
                  onclick="window.currentSolarRoom.startCollectiveStep3()"
                  style="display:none;margin-top:1rem;">Continue to Intention</button>
        </div>`}catch(e){console.error("Error starting step 2:",e)}},startMeditationTimer(){this._startCountdownTimer("meditationTimer","startMeditationBtn",180,()=>{const e=document.getElementById("skipToIntentionBtn");e&&(e.textContent="Continue to Intention",e.style.display="block")}),setTimeout(()=>{const e=document.getElementById("skipToIntentionBtn");e&&(e.style.display="block")},1e4)},startCollectiveStep3(){try{this._clearTimer();const e=document.getElementById("collectiveIntentionContent");if(!e)return;e.innerHTML=`
        <div class="solar-popup-section">
          <h3>Step 2: Your Private Intention</h3>
          <p>Set a personal intention for this ${this.config.displayName} season. This remains private.</p>
          <label for="privateIntentionText" class="sr-only">Your private seasonal intention</label>
          <textarea id="privateIntentionText" class="solar-textarea"
            placeholder="This ${this.config.displayName}, I intend to..." maxlength="500"
            aria-label="Your private seasonal intention"
            style="min-height:120px;margin:1.5rem 0;"></textarea>
          <p style="font-size:0.9rem;color:rgba(224,224,255,0.7);">This intention is for you alone. It will not be shared.</p>
        </div>
        <div class="solar-popup-footer">
          <button type="button" class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep4()">Continue</button>
        </div>`}catch(e){console.error("Error starting step 3:",e)}},startCollectiveStep4(){try{const e=document.getElementById("privateIntentionText");e&&(this.userData.privateIntention=e.value.trim());const t=document.getElementById("collectiveIntentionContent");if(!t)return;t.innerHTML=`
        <div class="solar-popup-section">
          <h3>Step 3: Share One Word</h3>
          <p>Choose a single word that captures your ${this.config.displayName} energy or intention.</p>
          <p style="font-size:0.9rem;color:rgba(224,224,255,0.7);margin-bottom:1.5rem;">This word will be shared with the collective field.</p>
          <input type="text" id="collectiveWordInput" class="solar-input"
                 aria-label="Enter your word for this solar season"
                 placeholder="Your word..." maxlength="50"
                 style="font-size:1.2rem;padding:1rem;text-align:center;margin:1rem 0;width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text);">
          <p style="font-size:0.85rem;color:rgba(224,224,255,0.6);margin-top:0.5rem;">Examples: Growth, Rest, Joy, Clarity, Strength, Peace</p>
        </div>
        <div class="solar-popup-footer">
          <button type="button" class="solar-popup-btn" onclick="window.currentSolarRoom.submitWordToCollective()">Add to Circle</button>
        </div>`}catch(e){console.error("Error starting step 4:",e)}},submitWordToCollective(){var e,t;try{const o=((e=document.getElementById("collectiveWordInput"))==null?void 0:e.value.trim())||"";if(!o){d.showToast("Please enter a word");return}if(o.length>50){d.showToast("Word is too long");return}this.userData.collectiveWord=o,this.userData.intentionShared=!0,(t=v)!=null&&t.ready&&v.sendRoomMessage(`${this._getSolarRoomId()}-collective`,o).catch(r=>console.error("[BaseSolarRoom] submitWordToCollective DB error:",r)),this.startCollectiveStep5()}catch(o){console.error("Error submitting word:",o)}},startCollectiveStep5(){var e;try{const t=document.getElementById("collectiveIntentionContent");if(!t)return;const o=(e=this._dbCollectiveWords)!=null&&e.length?this._dbCollectiveWords:this._getMockCollectiveWords(),r=this._renderWordCloud(o);t.innerHTML=`
        <div class="solar-popup-section" style="text-align:center;">
          <h3>Step 4: The Collective ${this.config.displayName} Field</h3>
          <p>These are the ${this.config.collectiveNoun||"intentions"} planted by practitioners in this circle.</p>
        </div>
        <div id="wordCloud" style="padding:2rem;margin:2rem 0;background:rgba(255,255,255,0.03);border-radius:12px;min-height:200px;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;">
          ${r}
        </div>
        <p style="text-align:center;font-size:0.9rem;color:rgba(224,224,255,0.7);margin-bottom:2rem;">
          <span class="solar-word-count"><strong>${o.length}</strong></span> ${this.config.collectiveNoun||"intentions"} in this ${this.config.displayName} cycle
        </p>
        <div style="margin:2rem 0;">
          <h4 style="text-align:center;margin-bottom:1rem;">Step 5: Silent Witnessing (2 min)</h4>
          <div id="witnessingTimer" class="solar-timer-display">2:00</div>
          <button type="button" id="startWitnessingBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.startWitnessingTimer()">Begin Silent Witnessing</button>
          <button type="button" id="completeBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.completeCollectivePractice()"
                  style="display:none;margin-top:1rem;background:var(--season-accent);color:white;">Complete Practice</button>
        </div>`}catch(t){console.error("Error starting step 5:",t)}},startWitnessingTimer(){this._startCountdownTimer("witnessingTimer","startWitnessingBtn",120,()=>{const e=document.getElementById("completeBtn");e&&(e.style.display="block")})},completeCollectivePractice(){var e;try{this.userData.practiceCount++,this.saveData(),d.showToast(`${this.config.seasonEmoji} ${this.config.collectiveNoun||"Intention"} planted with the collective`),(e=document.getElementById("collectivePopup"))==null||e.remove(),this.renderDashboard()}catch(t){console.error("Error completing collective practice:",t)}},_getMockCollectiveWords(){const e={spring:["Growth","Renewal","Hope","Bloom","Energy","Fresh","Vitality","Emerge","Awaken","Begin"],summer:["Radiance","Joy","Abundance","Vibrant","Expansion","Bright","Celebrate","Fullness","Alive","Shine"],autumn:["Harvest","Gratitude","Release","Balance","Gather","Wisdom","Reflection","Abundance","Thanks","Ripen"],winter:["Rest","Stillness","Peace","Wisdom","Quiet","Restore","Deep","Calm","Reflection","Inner"]},t=e[this.config.name]||e.spring,o=Date.now();return t.map((r,n)=>({word:r,timestamp:o-n*36e5}))},_getSolarRoomId:function(){return`${this.config.name}-solar`},getLivingPresenceCount(){return typeof this._cachedPresenceCount=="number"?this._cachedPresenceCount:0},async _refreshLivePresence(){var o;if(!((o=v)!=null&&o.ready))return;const e=this._getSolarRoomId(),t=async()=>{try{const r=await v.getRoomParticipants(e),n=await v.getBlockedUsers(),i=r.filter(u=>!n.has(u.user_id)),a=i.length;this._cachedPresenceCount=a,this._cachedParticipants=i;const l=(u,x)=>{const E=document.getElementById(u);E&&(E.textContent=x)};l("solarLiveCountTop",`${a} members practicing with you now`),l("solarGroupPresenceBadge",`${a} gathering now`),l("solarGroupJoinCount",a),l("solarCollectivePresenceBadge",`${a} practitioners in circle now`);const s=document.getElementById("solarGroupAvatars");s&&(s.innerHTML=this._buildRealAvatars(i))}catch(r){console.warn("[BaseSolarRoom] _refreshLivePresence error:",r)}};await t(),this._unsubPresence(),this._presenceSub=v.subscribeToPresence(t)},_buildRealAvatars(e){const o=e.slice(0,5),r=e.length-5,n="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.2);",i=o.map(l=>{var p,m;const s=l.profiles||{},u=s.name||s.display_name||"?",x=u.charAt(0).toUpperCase(),E=((m=(p=window.Core)==null?void 0:p.getAvatarGradient)==null?void 0:m.call(p,l.user_id))??"background:var(--season-accent,#f59e0b)";let C;return s.avatar_url?C=`<img src="${s.avatar_url}" alt="${x}" width="40" height="40" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:s.emoji?C=`<span style="font-size:18px;">${s.emoji}</span>`:C=`<span style="font-size:13px;font-weight:600;">${x}</span>`,`<div class="solar-avatar" style="${E};${n}" aria-label="${u}">${C}</div>`}).join(""),a=r>0?`<div class="solar-avatar" style="background:rgba(255,255,255,0.1);${n}font-size:12px;">+${r}</div>`:"";return i+a},_setPresence(){var e,t;if((e=v)!=null&&e.ready)try{const o=this._getSolarRoomId(),r=`${this.config.emoji} ${this.config.displayName}`;v.setPresence("online",r,o),(t=window.Core)!=null&&t.state&&(window.Core.state.currentRoom=o,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=r))}catch(o){console.error("[BaseSolarRoom] _setPresence error:",o)}},_clearPresence(){var e,t;if((e=v)!=null&&e.ready)try{v.setPresence("online","✨ Available",null),(t=window.Core)!=null&&t.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(o){console.error("[BaseSolarRoom] _clearPresence error:",o)}},async _loadCollectiveWords(){var e;if((e=v)!=null&&e.ready)try{const t=`${this._getSolarRoomId()}-collective`,o=async()=>{const r=await v.getRoomMessages(t,100);if(!(r!=null&&r.length))return;this._dbCollectiveWords=r.map(a=>({word:a.message,timestamp:new Date(a.created_at).getTime()}));const n=document.getElementById("wordCloud");n&&(n.innerHTML=this._renderWordCloud(this._dbCollectiveWords));const i=document.querySelector(".solar-word-count strong");i&&(i.textContent=this._dbCollectiveWords.length)};await o(),this._unsubCollectiveWords(),this._collectiveWordsSub=v.subscribeToRoomChat(t,o)}catch(t){console.warn("[BaseSolarRoom] _loadCollectiveWords error:",t)}},_renderWordCloud(e){return e!=null&&e.length?e.map(({word:t})=>{const o=(1+Math.random()*1.5).toFixed(2),r=(.6+Math.random()*.4).toFixed(2);return`<span class="solar-word-item" style="font-size:${o}rem;opacity:${r};color:var(--season-accent,#e0e0ff);font-weight:600;display:inline-block;margin:0.5rem;transition:all 0.3s;">${t}</span>`}).join(""):'<p style="color:rgba(224,224,255,0.5);">No words yet. Be the first to share.</p>'}},ae=Object.freeze(Object.defineProperty({__proto__:null,BaseSolarRoom:R},Symbol.toStringTag,{value:"Module"})),f=Object.create(R);f.config={name:"spring",displayName:"Spring",emoji:"🌸",seasonEmoji:"🌸",itemEmoji:"🌱",sessionTimes:"sunrise and sunset",startMonth:2,startDay:20,endMonth:5,endDay:20,floatingEmojis:["🌸","🌱","🌿"],wisdom:"As the spring sun awakens the earth, we plant our intentions and embrace the season of growth and renewal.",closure:{title:"Spring Completion",intro:"As spring comes to fullness, reflect on the seeds you have planted and the growth you have nurtured through this season of renewal.",placeholder:"What intentions took root? What grew beyond your expectations? What are you ready to bring into the fullness of summer?",buttonText:"Complete Spring",closingLine:"I celebrate the growth of this season and step forward into summer with an open heart."},modeDescription:"Individual practices for renewal, growth, and planting intentions",collectiveFocus:"planting collective intentions for growth",collectiveNoun:"seeds of intention"};f.prebuiltAffirmations=["I welcome new beginnings with open arms","I am ready to grow and expand","I plant seeds of intention for my future","I embrace the fresh energy of spring","I trust in the cycle of renewal","I awaken to new possibilities","I am vibrant and full of life","I celebrate growth in all its forms","I honor my journey of transformation","I bloom with grace and vitality"];f.practices={intentionPlanting:{id:"intentionPlanting",title:"Intention and Planting",hasSaveData:!0,description:"Set clear priorities for growth",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'},futureAlignment:{id:"futureAlignment",title:"Future Alignment Visualization",description:"Integrate vision and direction",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>'},bodyAwakening:{id:"bodyAwakening",title:"Body Awakening and Breath",description:"Energize and activate the body",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>'},energyAwareness:{id:"energyAwareness",title:"Energy and Awareness",description:"Activate energy for growth",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},environmentalClearing:{id:"environmentalClearing",title:"Environmental Clearing",description:"Create space for fresh energy",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'},roleExpansion:{id:"roleExpansion",title:"Role Expansion Practice",description:"Embrace roles that support growth",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>'},paceActivation:{id:"paceActivation",title:"Pace Activation Practice",description:"Align with forward momentum",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},relationshipSpringAudit:{id:"relationshipSpringAudit",title:"Relationship Spring Audit",description:"Energize or refresh connections",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'}};f.getIntentionPlantingContent=function(){return c.generateIntentionPracticeContent(this.userData,this.prebuiltAffirmations,{purpose:"Plant clear intentions for growth this season",intentionPrompt:"What do you want to cultivate this Spring season?",intentionPlaceholder:"This Spring, I choose to focus on...",affirmationTitle:"Choose Growth Affirmation",listTitle:"Seeds to Plant",listPrompt:"Write 3 new projects, habits, or intentions you want to begin:",readAloudText:"Say your intention and seeds out loud once.",closingLine:"I honor what I plant this season and nurture it with care."})};f.getFutureAlignmentContent=function(){return c.generateFutureAlignmentContent({purpose:"Integrate vision and direction for the season",visualizationPrompt:"Visualize yourself at the end of Spring feeling aligned, energized, and inspired.",feelingTitle:"Feel Expansion",feelingPrompt:"Do not visualize outcomes-simply feel the state of readiness and growth.",closingLine:"I move through this season aligned with my true potential."})};f.getBodyAwakeningContent=function(){return c.generateBodyPracticeContent({purpose:"Energize and activate the body for new beginnings",steps:["Stand or sit comfortably, feet hip-width apart, knees soft","Inhale slowly through the nose, exhale gently through the mouth","Repeat 5 times"],subtleMovement:"Optionally, stretch arms overhead or roll shoulders to awaken energy.",closingLine:"My body is energized and ready to grow this season."})};f.getEnergyAwarenessContent=function(){return c.generateEnergyAwarenessContent({purpose:"Activate and direct internal energy for growth",energySteps:["Place hands on solar plexus","Imagine energy radiating upward and outward, like new shoots emerging"],energyQuality:"Expansion",energyGuideline:"Spring energy is about activation and outward growth.",closingLine:"I open my energy to growth and new possibilities."})};f.getEnvironmentalClearingContent=function(){return c.generateEnvironmentalClearingContent({purpose:"Create space for fresh energy and opportunities",removePrompt:"Take 3 things that no longer serve you and remove or delete them. Make room for new energy.",closingLine:"I create space for fresh growth and inspiration."})};f.getRoleExpansionContent=function(){return c.generateRolePracticeContent({purpose:"Consciously embrace roles that support growth",roleExamples:["Learner","Creator","Leader","Supporter","Explorer","Innovator"],actionTitle:"Expand One Role",actionPrompt:"Choose one role to consciously step into more fully this season.",closingLine:"I step into my roles with openness and energy this season."})};f.getPaceActivationContent=function(){return c.generatePacePracticeContent({purpose:"Align personal tempo with the season's forward momentum",paceOptions:["Slower than optimal","Appropriate","Already active"],adjustmentPrompt:"Select one action to increase forward momentum:",adjustmentExamples:["Start the day with energy","Add a new activity","Step into action sooner"],closingLine:"I allow my pace to rise with the season's energy."})};f.getRelationshipSpringAuditContent=function(){return c.generateRelationshipAuditContent({purpose:"Identify relationships to energize or refresh",identifyPrompt:"List 2–3 key people in your life: one that feels alive and inspiring, one that feels stagnant or uninspiring.",actionExamples:["Engage actively","Show appreciation","Energize connection","Set fresh boundaries"],integrationPrompt:"Notice your energy as you consider these relationships. Observe how your choices create room for renewal.",closingLine:"I nurture my connections with openness and clarity."})};f.init();console.log("🌸 Spring Solar Room loaded");const Q=Object.freeze(Object.defineProperty({__proto__:null,SpringSolarRoom:f},Symbol.toStringTag,{value:"Module"})),y=Object.create(R);y.config={name:"summer",displayName:"Summer",emoji:"☀️",seasonEmoji:"☀️",itemEmoji:"🌻",sessionTimes:"midday and golden hour",startMonth:5,startDay:21,endMonth:7,endDay:20,floatingEmojis:["☀️","🌻","🌺"],wisdom:"As the summer sun shines at its brightest, we celebrate the fullness of life and embrace our radiant potential.",closure:{title:"Summer Completion",intro:"As the peak of summer begins to soften, reflect on the vitality, joy, and radiance you have expressed and embodied this season.",placeholder:"What did you celebrate? Where did you shine most brightly? What abundance are you grateful for as the light begins to turn?",buttonText:"Complete Summer",closingLine:"I honor the fullness of this season and release it with gratitude as the light gently turns."},modeDescription:"Individual practices for vitality, expansion, and celebration",collectiveFocus:"celebrating collective vitality and abundance",collectiveNoun:"expressions of joy"};y.prebuiltAffirmations=["I shine brightly with confidence and joy","I embrace the fullness of life","I am abundant and overflowing with energy","I celebrate my vitality and strength","I trust in the power of expansion","I radiate warmth and positivity","I am vibrant and alive","I honor the peak of my potential","I bask in the light of abundance","I embody the energy of summer"];y.practices={intentionRadiance:{id:"intentionRadiance",title:"Intention and Radiance",hasSaveData:!0,description:"Set intentions for expressing energy",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'},futureAlignment:{id:"futureAlignment",title:"Future Alignment Visualization",description:"Integrate clarity for joyful expression",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>'},bodyActivation:{id:"bodyActivation",title:"Body Activation and Breath",description:"Energize and enliven presence",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>'},energyAwareness:{id:"energyAwareness",title:"Energy and Awareness",description:"Amplify energy for expansion",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},environmentalClearing:{id:"environmentalClearing",title:"Environmental Clearing",description:"Create space for abundance",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'},roleExpansion:{id:"roleExpansion",title:"Role Expansion Practice",description:"Express roles with creativity",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>'},paceAlignment:{id:"paceAlignment",title:"Pace Alignment Practice",description:"Harmonize with vibrant energy",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},relationshipSummerAudit:{id:"relationshipSummerAudit",title:"Relationship Summer Audit",description:"Energize or celebrate connections",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'}};y.getIntentionRadianceContent=function(){return c.generateIntentionPracticeContent(this.userData,this.prebuiltAffirmations,{purpose:"Set intentions for full self-expression this season",intentionPrompt:"What do you want to radiate this Summer season?",intentionPlaceholder:"This Summer, I choose to focus on...",affirmationTitle:"Choose Radiance Affirmation",listTitle:"Celebration List",listPrompt:"Write 3 ways you want to express your energy and joy:",readAloudText:"Say your intention and celebrations out loud once.",closingLine:"I honor my light and allow it to shine brightly this season."})};y.getFutureAlignmentContent=function(){return c.generateFutureAlignmentContent({purpose:"Integrate clarity and direction for joyful expression",visualizationPrompt:"Visualize yourself at the height of Summer feeling vibrant, energized, and fully present.",feelingTitle:"Feel Radiance",feelingPrompt:"Do not visualize outcomes-simply feel the fullness of presence and joy.",closingLine:"I move through this season in alignment with my true radiance."})};y.getBodyActivationContent=function(){return c.generateBodyPracticeContent({purpose:"Energize the body and enliven presence",steps:["Stand or sit comfortably, feet hip-width apart, knees soft","Inhale fully through the nose, exhale gently through the mouth","Repeat 5 times"],subtleMovement:"Optionally, stretch arms outward or sway gently to open the body.",closingLine:"My body is vibrant, energized, and ready to express joy."})};y.getEnergyAwarenessContent=function(){return c.generateEnergyAwarenessContent({purpose:"Amplify and circulate energy for expansion",energySteps:["Place hands on heart and crown","Imagine energy radiating outward from the heart and upward from the crown"],energyQuality:"Expansion",energyGuideline:"Summer energy is about full expression, openness, and circulation.",closingLine:"I let my energy flow freely, fully embracing this season."})};y.getEnvironmentalClearingContent=function(){return c.generateEnvironmentalClearingContent({purpose:"Create space for abundance and creative energy",removePrompt:"Take 3 things that no longer serve you and remove or delete them. Make room for joy and inspiration.",closingLine:"I create space for abundance and new possibilities."})};y.getRoleExpansionContent=function(){return c.generateRolePracticeContent({purpose:"Consciously express roles that reflect energy and creativity",roleExamples:["Creator","Leader","Supporter","Explorer","Teacher","Artist"],actionTitle:"Amplify One Role",actionPrompt:"Choose one role to step into fully this season, expressing energy and joy.",closingLine:"I step into my roles with confidence and radiance this season."})};y.getPaceAlignmentContent=function(){return c.generatePacePracticeContent({purpose:"Harmonize your tempo with Summer's vibrant energy",paceOptions:["Slower than desired","Appropriate","Already energized"],adjustmentPrompt:"Select one action to increase flow and presence:",adjustmentExamples:["Start the day energetically","Add movement","Fully engage in an activity"],closingLine:"I allow my pace to align with the energy of this season."})};y.getRelationshipSummerAuditContent=function(){return c.generateRelationshipAuditContent({purpose:"Identify relationships to energize or celebrate",identifyPrompt:"List 2–3 key people in your life: one that feels inspiring and alive, one that feels neutral or stagnant.",actionExamples:["Engage fully","Express appreciation","Energize connection","Set playful boundaries"],integrationPrompt:"Notice how your energy shifts as you consider these relationships. Observe the expansion or contraction of joy.",closingLine:"I nurture my connections with vibrancy and clarity."})};y.init();console.log("☀️ Summer Solar Room loaded");const Z=Object.freeze(Object.defineProperty({__proto__:null,SummerSolarRoom:y},Symbol.toStringTag,{value:"Module"})),b=Object.create(R);b.config={name:"autumn",displayName:"Autumn",emoji:"🍂",seasonEmoji:"🍂",itemEmoji:"🍁",sessionTimes:"sunrise and sunset",startMonth:8,startDay:21,endMonth:10,endDay:20,floatingEmojis:["🍂","🍁","🌾"],wisdom:"As the autumn sun sets earlier each day, we gather our harvest and give thanks for the abundance we have received.",closure:{title:"Autumn Completion",intro:"As the autumn season draws to its close, gather your harvest and give thanks for all that has ripened and been received.",placeholder:"What have you harvested this season? What are you grateful for? What are you ready to release before the stillness of winter?",buttonText:"Complete Autumn",closingLine:"I gather my harvest with gratitude and release what is complete, ready to rest."},modeDescription:"Individual practices for gratitude, harvest, and preparation",collectiveFocus:"sharing collective gratitude and harvest",collectiveNoun:"harvests of gratitude"};b.prebuiltAffirmations=["I celebrate the harvest of my efforts","I am grateful for the abundance in my life","I honor the cycle of growth and rest","I release what no longer serves me with grace","I trust the wisdom of seasonal change","I gather strength for the quieter months ahead","I embrace transformation and letting go","I am rooted in gratitude and presence","I honor my growth and prepare for renewal","I welcome the wisdom of autumn"];b.practices={intentionHarvest:{id:"intentionHarvest",title:"Intention and Harvest",hasSaveData:!0,description:"Consolidate seasonal priorities",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'},futureAlignment:{id:"futureAlignment",title:"Future Alignment Visualization",description:"Integrate clarity and direction",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>'},bodyGrounding:{id:"bodyGrounding",title:"Body Grounding and Breath",description:"Signal safety and stability",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>'},energyAwareness:{id:"energyAwareness",title:"Energy and Awareness",description:"Consolidate and protect energy",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},environmentalClearing:{id:"environmentalClearing",title:"Environmental Clearing",description:"Create external order",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'},roleShedding:{id:"roleShedding",title:"Role Shedding Practice",description:"Consciously prune roles",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>'},paceRecalibration:{id:"paceRecalibration",title:"Pace Recalibration",description:"Align tempo with seasonal slowing",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},relationshipAudit:{id:"relationshipAudit",title:"Seasonal Relationship Audit",description:"Prune or nurture connections",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'}};b.getIntentionHarvestContent=function(){return c.generateIntentionPracticeContent(this.userData,this.prebuiltAffirmations,{purpose:"Consolidate seasonal priorities and harvest learnings",intentionPrompt:"What do you want to focus on this Autumn season?",intentionPlaceholder:"This Autumn, I choose to focus on...",affirmationTitle:"Choose Gratitude Affirmation",listTitle:"Harvest List",listPrompt:"Write 3 achievements, learnings, or resources you want to carry forward:",readAloudText:"Say your intention and harvest list out loud once.",closingLine:"I honor what I have gathered and carry it with care."})};b.getFutureAlignmentContent=function(){return c.generateFutureAlignmentContent({purpose:"Integrate clarity and direction for the season",visualizationPrompt:"Visualize yourself at the end of Autumn feeling aligned, grounded, and at ease.",feelingTitle:"Feel Alignment",feelingPrompt:"Do not visualize outcomes-simply feel the state of integration.",closingLine:"I move through this season in harmony with my true path."})};b.getBodyGroundingContent=function(){return c.generateBodyPracticeContent({purpose:"Signal safety and stability before seasonal change",steps:["Stand or sit comfortably, feet hip-width apart, knees soft","Inhale slowly through the nose, exhale gently through the mouth","Repeat 5 times"],subtleMovement:"Optionally, gently roll shoulders or stretch arms to release tension.",closingLine:"My body is grounded and ready to receive this season."})};b.getEnergyAwarenessContent=function(){return c.generateEnergyAwarenessContent({purpose:"Consolidate internal energy and protect what is harvested",energySteps:["Place hands on lower belly","Imagine energy collecting inward rather than radiating outward"],energyQuality:"Containment",energyGuideline:"Autumn energy is about holding and integrating, not expanding.",closingLine:"I contain my energy with care, honoring what I have gathered."})};b.getEnvironmentalClearingContent=function(){return c.generateEnvironmentalClearingContent({purpose:"Create external order to support internal consolidation",removePrompt:"Take 3 things that no longer serve you and remove or delete them. Do not reorganize-only subtraction.",closingLine:"I create space by letting go."})};b.getRoleSheddingContent=function(){return c.generateRolePracticeContent({purpose:"Consciously prune seasonal roles",roleExamples:["Parent","Leader","Fixer","Supporter","Creator","Learner"],actionTitle:"Soften One Role",actionPrompt:"Choose one role to consciously step back from or soften this season.",closingLine:"I allow my roles to rest and breathe this season."})};b.getPaceRecalibrationContent=function(){return c.generatePacePracticeContent({purpose:"Align personal tempo with seasonal slowing",paceOptions:["Faster than sustainable","Appropriate","Already slowed"],adjustmentPrompt:"Select one action to recalibrate your pace today:",adjustmentExamples:["Start the day slower","Reduce transitions","Leave earlier","Do fewer things per day"],closingLine:"I allow my pace to change with the season."})};b.getRelationshipAuditContent=function(){return c.generateRelationshipAuditContent({purpose:"Identify relationships to prune or nurture",identifyPrompt:"List 2–3 key people in your life: one that feels alive, inspiring, or supportive, and one that feels heavy, draining, or unresolved.",actionExamples:["Show gratitude","Limit interaction","Step back","Simply observe"],integrationPrompt:"Notice your energy and tension as you consider these relationships. Observe how your choices affect internal space.",closingLine:"I tend my connections with care and clarity."})};b.init();console.log("🍂 Autumn Solar Room loaded");const K=Object.freeze(Object.defineProperty({__proto__:null,AutumnSolarRoom:b},Symbol.toStringTag,{value:"Module"})),w=Object.create(R);w.config={name:"winter",displayName:"Winter",emoji:"❄️",seasonEmoji:"❄️",itemEmoji:"⛄",sessionTimes:"twilight hours",startMonth:11,startDay:21,endMonth:1,endDay:19,floatingEmojis:["❄️","⛄","🌨️"],wisdom:"In the quiet stillness of winter, we rest deeply and listen to the wisdom that emerges from silence.",closure:{title:"Winter Completion",intro:"As the winter season draws to a close, take a moment to honor the stillness and wisdom you have gathered in the quiet.",placeholder:"What did you discover in the silence? What wisdom emerged from this period of rest? What are you ready to carry forward into spring?",buttonText:"Complete Winter",closingLine:"I honor the wisdom gathered in stillness and carry it gently into the light."},modeDescription:"Individual practices for rest, contemplation, and inner wisdom",collectiveFocus:"honoring collective rest and inner wisdom",collectiveNoun:"whispers of wisdom"};w.prebuiltAffirmations=["I embrace the stillness within","I rest deeply and restore fully","I trust the wisdom of quiet contemplation","I honor my need for pause and reflection","I find peace in the darkness","I am held in the gentle silence of winter","I surrender to the cycle of rest","I listen to the whispers of my inner wisdom","I am complete in this moment of stillness","I trust the regenerative power of winter"];w.practices={intentionReflection:{id:"intentionReflection",title:"Intention and Reflection",hasSaveData:!0,description:"Consolidate insights and prepare for renewal",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'},futureAlignment:{id:"futureAlignment",title:"Future Alignment Visualization",description:"Integrate insight and prepare for future growth",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>'},bodyGrounding:{id:"bodyGrounding",title:"Body Grounding and Breath",description:"Signal safety, stability, and rejuvenation",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3"/><path d="M12 11v10M8 15l4-4 4 4M8 21h8"/></svg>'},energyAwareness:{id:"energyAwareness",title:"Energy and Awareness",description:"Consolidate internal energy and protect vital reserves",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'},environmentalClearing:{id:"environmentalClearing",title:"Environmental Clearing",description:"Create supportive external space for inner calm",color:"var(--ring-silent)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>'},roleShedding:{id:"roleShedding",title:"Role Shedding Practice",description:"Consciously release or soften roles that drain energy",color:"var(--ring-available)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>'},paceRecalibration:{id:"paceRecalibration",title:"Pace Recalibration Practice",description:"Align personal tempo with Winter's stillness",color:"var(--ring-deep)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},relationshipWinterAudit:{id:"relationshipWinterAudit",title:"Relationship Winter Audit",description:"Identify connections to rest, nurture, or let go",color:"var(--ring-resonant)",icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'}};w.getIntentionReflectionContent=function(){return c.generateIntentionPracticeContent(this.userData,this.prebuiltAffirmations,{purpose:"Consolidate insights and prepare for renewal",intentionPrompt:"What do you want to focus on this Winter season?",intentionPlaceholder:"This Winter, I choose to focus on...",affirmationTitle:"Choose Stillness Affirmation",listTitle:"Reflection List",listPrompt:"Write 3 insights or lessons you wish to integrate:",readAloudText:"Say your intention and reflections out loud once.",closingLine:"I honor my inner wisdom and hold it with care this season."})};w.getFutureAlignmentContent=function(){return c.generateFutureAlignmentContent({purpose:"Integrate insight and prepare for future growth",visualizationPrompt:"Visualize yourself at the end of Winter feeling restored, aligned, and centered.",feelingTitle:"Feel Integration",feelingPrompt:"Do not visualize outcomes-simply feel inner stability and readiness.",closingLine:"I move through this season in harmony with my inner truth."})};w.getBodyGroundingContent=function(){return c.generateBodyPracticeContent({purpose:"Signal safety, stability, and rejuvenation",steps:["Stand or sit comfortably, feet hip-width apart, knees soft","Inhale deeply through the nose, exhale slowly through the mouth","Repeat 5 times"],subtleMovement:"Optionally, gently stretch or roll shoulders to release tension and encourage circulation.",closingLine:"My body is grounded, calm, and ready to rest this season."})};w.getEnergyAwarenessContent=function(){return c.generateEnergyAwarenessContent({purpose:"Consolidate internal energy and protect vital reserves",energySteps:["Place hands on heart and lower belly","Imagine energy gathering inward and settling into the center"],energyQuality:"Containment",energyGuideline:"Winter energy is about inward focus, replenishment, and stillness.",closingLine:"I hold my energy with care, honoring my need for restoration."})};w.getEnvironmentalClearingContent=function(){return c.generateEnvironmentalClearingContent({purpose:"Create supportive external space for inner calm",removePrompt:"Take 3 things that no longer serve you and remove or delete them. Do not reorganize-simply create space.",closingLine:"I create stillness in my environment to support inner clarity."})};w.getRoleSheddingContent=function(){return c.generateRolePracticeContent({purpose:"Consciously release or soften roles that drain energy",roleExamples:["Leader","Caregiver","Worker","Supporter","Creator","Learner"],actionTitle:"Soften One Role",actionPrompt:"Choose one role to consciously step back from or pause this season.",closingLine:"I allow my roles to rest and restore my energy this season."})};w.getPaceRecalibrationContent=function(){return c.generatePacePracticeContent({purpose:"Align personal tempo with Winter's stillness",paceOptions:["Faster than sustainable","Appropriate","Already slowed"],adjustmentPrompt:"Select one action to slow or restore balance:",adjustmentExamples:["Pause before starting tasks","Reduce transitions","Allow more rest periods"],closingLine:"I allow my pace to align with the natural rhythm of this season."})};w.getRelationshipWinterAuditContent=function(){return c.generateRelationshipAuditContent({purpose:"Identify connections to rest, nurture, or let go",identifyPrompt:"List 2–3 key people in your life: one that feels supportive and nourishing, one that feels heavy or draining.",actionExamples:["Express gratitude","Limit interaction","Step back","Simply observe"],integrationPrompt:"Notice how your energy shifts as you consider these relationships. Observe the space created for calm and restoration.",closingLine:"I tend my connections with care and preserve my energy this season."})};w.init();console.log("❄️ Winter Solar Room loaded");const ee=Object.freeze(Object.defineProperty({__proto__:null,WinterSolarRoom:w},Symbol.toStringTag,{value:"Module"}));export{ne as a,ie as b,ae as c,re as s};
