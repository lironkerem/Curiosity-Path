var T=Object.defineProperty;var b=(c,e,t)=>e in c?T(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var _=(c,e,t)=>b(c,typeof e!="symbol"?e+"":e,t);import{L as h,c as f}from"./communityHub-ayl7iYTk.js";const w={generateIntentionPracticeContent(c,e,t){const{intention:i="",affirmation:n="",releaseList:o=""}=c,r=e.map(s=>`
            <button type="button" data-affirmation="${this._escapeAttr(s)}" class="lunar-affirmation-btn">
                ${this._escapeHtml(s)}
            </button>`).join("");return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${t.purpose}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One Clear Intention</h3>
                <p>Write one sentence beginning with:</p>
                <div class="lunar-popup-highlight">
                    <p>"${t.intentionPrompt}"</p>
                </div>
                <textarea id="intentionText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="500"
                    aria-label="Your intention"
                    placeholder="${t.intentionPrompt}"
                >${this._escapeHtml(i)}</textarea>
                <p class="lunar-helper-text">${t.intentionHelper}</p>
            </div>

            <div class="lunar-popup-section">
                <h3>One ${t.affirmationType} Affirmation</h3>
                <p>${t.affirmationPrompt}</p>
                <div class="lunar-affirmation-grid">${r}</div>
                <textarea id="affirmationText" class="lunar-textarea-large"
                    style="min-height:80px;" maxlength="300"
                    aria-label="Your affirmation"
                    placeholder="Or write your own..."
                >${this._escapeHtml(n)}</textarea>
                ${t.affirmationHelper?`<p class="lunar-helper-text">${t.affirmationHelper}</p>`:""}
            </div>

            <div class="lunar-popup-section">
                <h3>${t.listTitle}</h3>
                <p>${t.listPrompt}</p>
                ${t.listHelper?`<p class="lunar-helper-text">${t.listHelper}</p>`:""}
                <textarea id="releaseListText" class="lunar-textarea-large"
                    style="min-height:120px;" maxlength="1000"
                    aria-label="${t.listTitle}"
                    placeholder="1. &#10;2. &#10;3. "
                >${this._escapeHtml(o)}</textarea>
                ${t.listFooter?`<div class="lunar-popup-highlight"><p>${t.listFooter}</p></div>`:""}
            </div>

            <div class="lunar-popup-footer">
                <button type="button" class="lunar-popup-btn" data-action="save-practice" aria-label="Save your practice">
                    Save Practice
                </button>
            </div>`},generateFutureAlignmentContent({purpose:c,steps:e,guideline:t}){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${c}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${e.map(i=>`<li>${i}</li>`).join("")}</ul>
            </div>
            <div class="lunar-popup-highlight"><p>${t}</p></div>`},generateBodyPracticeContent({purpose:c,steps:e,guideline:t}){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${c}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Practice Steps</h3>
                <ul>${e.map(i=>`<li>${i}</li>`).join("")}</ul>
                <div class="lunar-popup-highlight" style="margin-top:1rem;">
                    <p>${t}</p>
                </div>
            </div>`},generateEnergyAwarenessContent(c){return`
            <div class="lunar-popup-section">
                <h3>Purpose</h3>
                <p>${c.purpose}</p>
            </div>
            <div class="lunar-popup-section">
                <h3>Energy Direction</h3>
                <ul>${c.energySteps.map(e=>`<li>${e}</li>`).join("")}</ul>
                <div class="lunar-popup-highlight"><p>${c.energyGuideline}</p></div>
            </div>
            <div class="lunar-popup-section">
                <h3>${c.awarenessTitle}</h3>
                <p>${c.awarenessPrompt}</p>
                ${c.awarenessExample?`<p class="lunar-helper-text"><em>${c.awarenessExample}</em></p>`:""}
            </div>
            <div class="lunar-popup-section">
                <h3>Closing</h3>
                <div class="lunar-popup-highlight"><p>"${c.closingStatement}"</p></div>
                <p>Say once, out loud or silently. End the practice.</p>
            </div>`},_escapeHtml(c){if(!c)return"";const e=document.createElement("div");return e.textContent=c,e.innerHTML},_escapeAttr(c){return c?c.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}},p=()=>window.CommunityDB,d=class d{constructor(e){if(!e)throw new Error("LunarRoom: phaseConfig is required");this.config=e,this.isActive=!1,this.currentPractice=null,this.collectiveTimer=null,this.collectiveWords=null,this.saveDebounceTimer=null,this._retryCheckTimeout=null,this._hasLoggedWaiting=!1,this.eventListeners=[],this.userWeekData=this._getDefaultUserData(),this.weekStartDate=null,this.weekEndDate=null,this.domCache={dynamicContent:null,popup:null},this._bindMethods()}_getDefaultUserData(){return{seedAffirmation:null,practiceCount:0,journalEntries:[],emotionalEchoes:[],intentionShared:!1,privateIntention:"",collectiveWord:"",intention:"",affirmation:"",releaseList:""}}_bindMethods(){["init","enterRoom","renderRoomDashboard","switchMode","showPracticePopup","showCollectiveIntentionPopup","startCollectiveStep2","startCollectiveStep3","startCollectiveStep4","startCollectiveStep5","startMeditationTimer","startWitnessingTimer","submitWordToCollective","completeCollectivePractice","closeCollectivePopup","closePracticePopup","saveIntentionPractice","submitClosure","showLockedMessage","enterGroupCircle","leaveRoom","_handlePopupClick","_clearTimer"].forEach(e=>{typeof this[e]=="function"&&(this[e]=this[e].bind(this))})}init(){try{this.checkIfWeekActive(),h.injectStyles(this.config.cssPrefix)}catch(e){console.error(`${this.config.name} init error:`,e)}}checkIfWeekActive(){var e,t,i,n;try{if(!((e=f)!=null&&e.currentMoonData)){this._hasLoggedWaiting||(this._hasLoggedWaiting=!0),this._retryCheckTimeout||(this._retryCheckTimeout=setTimeout(()=>{this._retryCheckTimeout=null,this.checkIfWeekActive()},500));return}if((n=(i=(t=window.Core)==null?void 0:t.state)==null?void 0:i.currentUser)==null?void 0:n.is_admin){this.isActive=!0,this.calculateWeekDates(),this.loadUserWeekData();return}const r=f.currentMoonData.phase;this.isActive=this.config.phaseRanges.some(([s,a])=>r>=s&&r<=a),this.isActive&&(this.calculateWeekDates(),this.loadUserWeekData())}catch(o){console.error("checkIfWeekActive error:",o),this.isActive=!1}}calculateWeekDates(){var e,t,i,n;try{const o=(e=f)==null?void 0:e.currentMoonData;if(!o){console.error("No moon data");return}const{phase:r,age:s}=o,a=d.CONSTANTS,l=new Date,m=new Date(l-s*a.MS_PER_DAY);let u=this.config.phaseRanges.find(([v,g])=>r>=v&&r<=g);if(!u&&(u=((n=(i=(t=window.Core)==null?void 0:t.state)==null?void 0:i.currentUser)==null?void 0:n.is_admin)?this.config.phaseRanges[0]:null,!u)){this._calculateNextOccurrence(r,s);return}this.weekStartDate=new Date(m.getTime()+u[0]*a.LUNAR_CYCLE_DAYS*a.MS_PER_DAY),this.weekEndDate=new Date(m.getTime()+u[1]*a.LUNAR_CYCLE_DAYS*a.MS_PER_DAY)}catch(o){console.error("calculateWeekDates error:",o)}}_calculateNextOccurrence(e,t){try{const i=d.CONSTANTS,n=new Date,o=new Date(n-t*i.MS_PER_DAY),[r,s]=this.config.phaseRanges[0],a=e<r?o:new Date(o.getTime()+i.LUNAR_CYCLE_DAYS*i.MS_PER_DAY);this.weekStartDate=new Date(a.getTime()+r*i.LUNAR_CYCLE_DAYS*i.MS_PER_DAY),this.weekEndDate=new Date(a.getTime()+s*i.LUNAR_CYCLE_DAYS*i.MS_PER_DAY)}catch(i){console.error("_calculateNextOccurrence error:",i)}}getDaysRemaining(){return this.weekEndDate?Math.max(0,Math.ceil((this.weekEndDate-new Date)/d.CONSTANTS.MS_PER_DAY)):0}shouldShowClosure(){const e=this.getDaysRemaining();return e>0&&e<=2}loadUserWeekData(){try{const e=localStorage.getItem(this.config.storageKey);e&&(this.userWeekData={...this.userWeekData,...JSON.parse(e)})}catch(e){console.error("loadUserWeekData error:",e)}}saveUserWeekData(e=!1){if(e){this._performSave();return}clearTimeout(this.saveDebounceTimer),this.saveDebounceTimer=setTimeout(()=>this._performSave(),d.CONSTANTS.SAVE_DEBOUNCE_MS)}_performSave(){var e;try{localStorage.setItem(this.config.storageKey,JSON.stringify(this.userWeekData))}catch(t){console.error("_performSave error:",t),(e=window.Core)==null||e.showToast("Failed to save data")}}_sanitizeInput(e){return typeof e=="string"?e.replace(/<[^>]*>/g,"").trim():""}_validateIntention(e){const t=d.CONSTANTS;return e!=null&&e.trim()?e.length>t.MAX_INTENTION_LENGTH?{valid:!1,error:`Intention must be under ${t.MAX_INTENTION_LENGTH} characters`}:{valid:!0}:{valid:!1,error:"Intention cannot be empty"}}_validateAffirmation(e){const t=d.CONSTANTS;return e!=null&&e.trim()?e.length>t.MAX_AFFIRMATION_LENGTH?{valid:!1,error:`Affirmation must be under ${t.MAX_AFFIRMATION_LENGTH} characters`}:{valid:!0}:{valid:!1,error:"Affirmation cannot be empty"}}_validateCollectiveWord(e){return e!=null&&e.trim()?e.length>d.CONSTANTS.MAX_WORD_LENGTH?{valid:!1,error:`Word must be under ${d.CONSTANTS.MAX_WORD_LENGTH} characters`}:e.trim().includes(" ")?{valid:!1,error:"Please enter only one word"}:{valid:!0}:{valid:!1,error:"Word cannot be empty"}}enterRoom(){var e,t,i,n,o,r,s,a;try{const l=(i=(t=(e=window.Core)==null?void 0:e.state)==null?void 0:t.currentUser)==null?void 0:i.is_admin;if(!this.isActive&&!l){(n=window.Core)==null||n.showToast(`${this.config.emoji} ${this.config.name} room opens during the ${this.config.name} phase`);return}(o=window.Core)==null||o.navigateTo("practiceRoomView"),(s=(r=window.PracticeRoom)==null?void 0:r.stopHubPresence)==null||s.call(r),window.currentLunarRoom=this,this.renderRoomDashboard(),this._setPresence(),this._loadCollectiveWords(),setTimeout(()=>this._refreshLivePresence(),300)}catch(l){console.error("enterRoom error:",l),(a=window.Core)==null||a.showToast("Failed to enter room")}}leaveRoom(){var e,t,i;try{this._clearPresence(),["_presenceSub","_collectiveWordsSub"].forEach(n=>{if(this[n]){try{this[n].unsubscribe()}catch{}this[n]=null}}),this._clearTimer(),this._removeEventListeners(),window.currentLunarRoom=null,(t=(e=window.PracticeRoom)==null?void 0:e.startHubPresence)==null||t.call(e),(i=window.Core)==null||i.navigateTo("hubView")}catch(n){console.error("leaveRoom error:",n)}}renderRoomDashboard(){var e;try{const t=(e=this.domCache).dynamicContent??(e.dynamicContent=document.getElementById("dynamicRoomContent"));if(!t){console.error("dynamicRoomContent not found");return}const i=new Date,n=this.getDaysRemaining(),o=Math.ceil((this.weekStartDate-i)/d.CONSTANTS.MS_PER_DAY),r=this.getLivingPresenceCount(),s=this.isActive?`${n} ${n===1?"day":"days"} remaining`:`${o} ${o===1?"day":"days"} until ${this.config.name}`;t.innerHTML=`
                <div class="lunar-room-bg">
                    <div class="${this.config.cssPrefix}-starfield lunar-starfield">
                        ${h.generateStarfield()}
                    </div>
                    ${h.renderTopBar({emoji:this.config.emoji,name:this.config.name,daysText:s,livingPresenceCount:r,cssPrefix:this.config.cssPrefix})}
                    <div class="${this.config.cssPrefix}-content-wrapper lunar-content-wrapper">
                        ${h.renderMoonVisual({cssPrefix:this.config.cssPrefix,sphereClass:`${this.config.cssPrefix}-moon-sphere`,glowClass:`${this.config.cssPrefix}-moon-glow`})}
                        ${h.renderIntroCard({imageUrl:this.config.imageUrl,description:this.config.description})}
                        ${h.renderModeToggle({cssPrefix:this.config.cssPrefix,globalName:this.config.globalName})}
                        <div class="lunar-practice-mode active" data-mode="solo">${this._renderSoloPracticeMode()}</div>
                        <div class="lunar-practice-mode" data-mode="group">${this._renderGroupCircleMode(r)}</div>
                        ${this._renderClosureSection()}
                        <div class="lunar-wisdom-section">${h.renderWisdomText(this.config.wisdomQuote)}</div>
                    </div>
                </div>`,this._attachEventListeners(t)}catch(t){console.error("renderRoomDashboard error:",t)}}_renderSoloPracticeMode(){const e=!!(this.userWeekData.intention||this.userWeekData.affirmation);return`
            <div class="lunar-mode-description">
                <h3>Your Sacred Space</h3>
                <p>${this.config.modeDescription||"Individual practices for this lunar phase"}</p>
            </div>
            <div class="lunar-practices-section">
                <div class="lunar-practices-grid">${this._renderPracticeCards()}</div>
            </div>
            ${e?this._renderSavedInputs():""}`}_renderPracticeCards(){var n;const e=Object.entries(this.config.practices),t=(n=e[0])==null?void 0:n[0],i=!!(this.userWeekData.intention||this.userWeekData.affirmation);return e.map(([o,r])=>{const s=o===t&&i;return`
                <div class="lunar-practice-card ${this.config.cssPrefix}-practice-card${s?" locked":""}"
                     data-practice="${o}" data-locked="${s}"
                     tabindex="0" role="button"
                     aria-label="${r.title}${s?" - Complete":""}">
                    <div class="lunar-practice-icon" style="color:${r.color};">${r.icon}</div>
                    <div class="lunar-practice-info">
                        <h4>${r.title}</h4>
                        <p>${r.description}</p>
                    </div>
                    ${s?'<div class="lunar-lock-badge">✓ Complete</div>':""}
                </div>`}).join("")}_renderSavedInputs(){const{intention:e,affirmation:t,releaseList:i}=this.userWeekData,n=this.config.savedInputLabels,o=r=>w._escapeHtml(r);return`
            <div class="lunar-saved-inputs">
                <h3>${n.title}</h3>
                ${e?`<div class="lunar-saved-item"><div class="lunar-saved-label">${n.intention}</div><div class="lunar-saved-text">${o(e)}</div></div>`:""}
                ${t?`<div class="lunar-saved-item"><div class="lunar-saved-label">${n.affirmation}</div><div class="lunar-saved-text">${o(t)}</div></div>`:""}
                ${i?`<div class="lunar-saved-item"><div class="lunar-saved-label">${n.releaseList}</div><div class="lunar-saved-text">${o(i).replace(/\n/g,"<br>")}</div></div>`:""}
                <div class="lunar-saved-footer">${n.footer}</div>
            </div>`}_renderGroupCircleMode(e){return`
            <div class="lunar-group-intro">
                <h3>Group Intention Circle</h3>
                <p>Join others in ${this.config.collectiveFocus}. Together we create ${this.config.collectiveNoun}.</p>
                <div class="lunar-live-presence">
                    <div class="lunar-pulse-dot"></div>
                    <span>${e} members in circle</span>
                </div>
                <div class="lunar-group-avatars">${h.renderMockAvatars(e)}</div>
                <button type="button" class="lunar-join-circle-btn" data-action="enter-group-circle">Enter the Circle</button>
            </div>`}_renderClosureSection(){if(!this.shouldShowClosure())return"";const e=d.CONSTANTS;return`
            <div class="lunar-closure-section">
                <h3>${this.config.closureTitle}</h3>
                <p>${this.config.closureDescription}</p>
                <label for="closureReflection" class="sr-only">${this.config.closureTitle}</label>
                <textarea id="closureReflection" class="lunar-textarea-large"
                    placeholder="${this.config.closurePlaceholder}"
                    aria-label="${this.config.closurePlaceholder}"
                    maxlength="${e.MAX_INTENTION_LENGTH}"></textarea>
                <button type="button" class="lunar-popup-btn" data-action="submit-closure">
                    ${this.config.closureButton}
                </button>
            </div>`}_attachEventListeners(e){this._removeEventListeners();const t=i=>{const n=i.target.closest(".lunar-practice-card");if(n&&(i.type==="click"||i.key==="Enter"||i.key===" ")){i.preventDefault(),n.dataset.locked==="true"?this.showLockedMessage():this.showPracticePopup(n.dataset.practice);return}if(i.type!=="click")return;const o=i.target.closest("[data-action]");if(o)switch(o.dataset.action){case"switch-mode":this.switchMode(o.dataset.mode);break;case"enter-group-circle":this.enterGroupCircle();break;case"submit-closure":this.submitClosure();break;case"back-to-hub":window.Rituals?Rituals.showClosing():this.leaveRoom();break}};e.addEventListener("click",t),e.addEventListener("keydown",t),this.eventListeners.push({element:e,type:"click",handler:t},{element:e,type:"keydown",handler:t})}_removeEventListeners(){this.eventListeners.forEach(({element:e,type:t,handler:i})=>e==null?void 0:e.removeEventListener(t,i)),this.eventListeners=[]}switchMode(e){document.querySelectorAll(".lunar-practice-mode").forEach(t=>t.classList.toggle("active",t.dataset.mode===e)),document.querySelectorAll(".lunar-mode-btn").forEach(t=>{const i=t.dataset.mode===e;t.classList.toggle("active",i),t.setAttribute("aria-pressed",String(i))})}showPracticePopup(e){try{const t=this.config.practices[e];if(!t){console.error(`Practice not found: ${e}`);return}this.currentPractice=e;const i=e===Object.keys(this.config.practices)[0],n=h.createPopup({icon:t.icon,title:t.title,subtitle:t.description,content:this.getPracticeContent(e),cssPrefix:this.config.cssPrefix,hasFooter:!i,onClose:()=>this.closePracticePopup()});(document.getElementById("communityHubFullscreenContainer")??document.body).appendChild(n),this.domCache.popup=n,this._attachPopupListeners(n,e)}catch(t){console.error("showPracticePopup error:",t)}}_attachPopupListeners(e,t){var i;e.querySelectorAll('[data-action="close-popup"]').forEach(n=>n.addEventListener("click",this.closePracticePopup)),e.addEventListener("click",this._handlePopupClick),t===Object.keys(this.config.practices)[0]&&((i=e.querySelector('[data-action="save-practice"]'))==null||i.addEventListener("click",this.saveIntentionPractice),e.querySelectorAll("[data-affirmation]").forEach(n=>n.addEventListener("click",()=>{const o=e.querySelector("#affirmationText");o&&(o.value=n.dataset.affirmation)})))}_handlePopupClick(e){e.target===e.currentTarget&&this.closePracticePopup()}getPracticeContent(e){try{const t=this.config.practiceContent[e];return t?t(this.userWeekData,this.config.prebuiltAffirmations):`<div class="lunar-popup-section"><h3>Practice</h3><p>${this.config.practices[e].description}</p></div>`}catch(t){return console.error("getPracticeContent error:",t),"<p>Error loading practice content</p>"}}closePracticePopup(){const e=this.domCache.popup??document.querySelector(".lunar-practice-popup");e&&(e.remove(),this.domCache.popup=null)}saveIntentionPractice(){var e,t,i,n;try{const o=document.getElementById("intentionText"),r=document.getElementById("affirmationText"),s=document.getElementById("releaseListText");if(!o||!r||!s){console.error("Form elements not found");return}const a=this._sanitizeInput(o.value),l=this._sanitizeInput(r.value),m=this._sanitizeInput(s.value),u=this._validateIntention(a);if(!u.valid){(e=window.Core)==null||e.showToast(u.error);return}const v=this._validateAffirmation(l);if(!v.valid){(t=window.Core)==null||t.showToast(v.error);return}Object.assign(this.userWeekData,{intention:a,affirmation:l,releaseList:m}),this.userWeekData.practiceCount++,this.saveUserWeekData(!0),(i=window.Core)==null||i.showToast("Practice saved"),this.closePracticePopup(),this.renderRoomDashboard()}catch(o){console.error("saveIntentionPractice error:",o),(n=window.Core)==null||n.showToast("Failed to save practice")}}showLockedMessage(){var e;(e=window.Core)==null||e.showToast("✓ Practice completed for this cycle")}showCollectiveIntentionPopup(){var e;try{const t=h.createPopup({icon:"🌙",title:"Collective Intention Circle",subtitle:`Join others in ${this.config.collectiveFocus}`,content:this._getCollectiveStep1Content(),cssPrefix:this.config.cssPrefix,hasFooter:!1,onClose:()=>this.closeCollectivePopup()});(document.getElementById("communityHubFullscreenContainer")??document.body).appendChild(t),this.domCache.popup=t,t.querySelectorAll('[data-action="close-popup"]').forEach(i=>i.addEventListener("click",this.closeCollectivePopup)),(e=t.querySelector('[data-action="begin-collective"]'))==null||e.addEventListener("click",this.startCollectiveStep2),t.addEventListener("click",this._handlePopupClick)}catch(t){console.error("showCollectiveIntentionPopup error:",t)}}_getCollectiveStep1Content(){return`
            <div class="lunar-popup-section" style="text-align:center;">
                <p>This practice creates space for collective intention.</p>
                <p>You will be guided through 5 steps:</p>
                <ol style="text-align:left;max-width:500px;margin:2rem auto;">
                    <li>Silent meditation (3 minutes)</li>
                    <li>Write your private intention</li>
                    <li>Choose one word for the collective</li>
                    <li>Silent witnessing (2 minutes)</li>
                    <li>Complete the practice</li>
                </ol>
                <button class="lunar-popup-btn" data-action="begin-collective">Begin Practice</button>
            </div>`}startCollectiveStep2(){var t,i;const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 1: Silent Meditation</h3>
                <p>Take 3 minutes to center yourself before setting your intention.</p>
                <div id="meditationTimer" class="lunar-timer-display">3:00</div>
                <button id="startMeditationBtn" class="lunar-popup-btn" data-action="start-meditation">Begin Meditation</button>
                <button id="skipToIntentionBtn" class="lunar-popup-btn lunar-btn-secondary" data-action="skip-meditation" style="display:none;">Continue to Intention</button>
            </div>`,(t=e.querySelector('[data-action="start-meditation"]'))==null||t.addEventListener("click",this.startMeditationTimer),(i=e.querySelector('[data-action="skip-meditation"]'))==null||i.addEventListener("click",this.startCollectiveStep3))}startMeditationTimer(){var e;(e=document.getElementById("startMeditationBtn"))==null||e.style.setProperty("display","none"),this._runTimer("meditationTimer",d.CONSTANTS.MEDITATION_DURATION,()=>{const t=document.getElementById("skipToIntentionBtn");t&&(t.textContent="Continue to Intention",t.style.display="block")}),setTimeout(()=>{const t=document.getElementById("skipToIntentionBtn");t&&(t.style.display="block")},1e4)}startCollectiveStep3(){var t;this._clearTimer();const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section">
                <h3>Step 2: Your Private Intention</h3>
                <p>Write your intention for this ${this.config.name} cycle. This remains private.</p>
                <textarea id="privateIntentionText" class="lunar-textarea-large"
                    placeholder="I intend to..."
                    maxlength="${d.CONSTANTS.MAX_INTENTION_LENGTH}"
                >${w._escapeHtml(this.userWeekData.privateIntention||"")}</textarea>
                <button class="lunar-popup-btn" data-action="save-private-intention">Continue</button>
            </div>`,(t=e.querySelector('[data-action="save-private-intention"]'))==null||t.addEventListener("click",this.startCollectiveStep4))}startCollectiveStep4(){var i;const e=document.getElementById("privateIntentionText");e&&(this.userWeekData.privateIntention=this._sanitizeInput(e.value));const t=document.getElementById("collectiveIntentionContent");t&&(t.innerHTML=`
            <div class="lunar-popup-section">
                <h3>Step 3: Choose One Word</h3>
                <p>From your intention, choose one word to contribute to the collective field.</p>
                <div class="lunar-intention-preview">
                    <div class="lunar-preview-label">Your intention:</div>
                    <p>${w._escapeHtml(this.userWeekData.privateIntention||"No intention set")}</p>
                </div>
                <input type="text" id="collectiveWordInput" class="lunar-word-input"
                    aria-label="Enter your word for this lunar phase"
                    placeholder="Your word..." maxlength="${d.CONSTANTS.MAX_WORD_LENGTH}">
                <button class="lunar-popup-btn" data-action="submit-collective-word">Plant Your Word</button>
            </div>`,(i=t.querySelector('[data-action="submit-collective-word"]'))==null||i.addEventListener("click",()=>{const n=document.getElementById("collectiveWordInput");n&&this.submitWordToCollective(n.value)}))}submitWordToCollective(e){var n,o,r;const t=this._sanitizeInput(e),i=this._validateCollectiveWord(t);if(!i.valid){(n=window.Core)==null||n.showToast(i.error);return}this.userWeekData.collectiveWord=t,this.userWeekData.intentionShared=!0,this.collectiveWords||(this.collectiveWords=this.getMockCollectiveWords()),this.collectiveWords.push({word:t,timestamp:Date.now()}),(o=p())!=null&&o.ready&&((r=p())==null||r.sendRoomMessage(`${this._getLunarRoomId()}-collective`,t).catch(s=>console.error("[LunarRoom] submitWordToCollective DB error:",s))),this.startCollectiveStep5()}startCollectiveStep5(){var t,i;const e=document.getElementById("collectiveIntentionContent");e&&(e.innerHTML=`
            <div class="lunar-popup-section" style="text-align:center;">
                <h3>Step 4: Collective Intention Field</h3>
                <p style="margin-bottom:2rem;">Your word has been planted. Witness the collective intentions emerging.</p>
                <div id="wordCloud" class="lunar-word-cloud">
                    ${h.renderWordCloud(this.collectiveWords??this.getMockCollectiveWords())}
                </div>
                <p class="lunar-word-count"><strong>${this.getCollectiveWordsCount()}</strong> intentions planted in this ${this.config.name} cycle</p>
                <div style="margin:2rem 0;">
                    <h4 class="lunar-witness-title">Step 5: Silent Witnessing (2 min)</h4>
                    <div id="witnessingTimer" class="lunar-timer-small">2:00</div>
                    <button id="startWitnessingBtn" class="lunar-popup-btn" data-action="start-witnessing">Begin Silent Witnessing</button>
                    <button id="completeBtn" class="lunar-popup-btn lunar-btn-success" data-action="complete-collective" style="display:none;">Complete Practice</button>
                </div>
            </div>`,(t=e.querySelector('[data-action="start-witnessing"]'))==null||t.addEventListener("click",this.startWitnessingTimer),(i=e.querySelector('[data-action="complete-collective"]'))==null||i.addEventListener("click",this.completeCollectivePractice))}startWitnessingTimer(){var e;(e=document.getElementById("startWitnessingBtn"))==null||e.style.setProperty("display","none"),this._runTimer("witnessingTimer",d.CONSTANTS.WITNESSING_DURATION,()=>{const t=document.getElementById("completeBtn");t&&(t.style.display="block")})}_runTimer(e,t,i){let n=t;const o=document.getElementById(e);o&&(this.collectiveTimer=setInterval(()=>{n--;const r=Math.floor(n/60),s=n%60;o.textContent=`${r}:${String(s).padStart(2,"0")}`,n<=0&&(this._clearTimer(),o.textContent="Complete",i==null||i())},d.CONSTANTS.TIMER_INTERVAL_MS))}completeCollectivePractice(){var e;this.userWeekData.practiceCount++,this.saveUserWeekData(!0),(e=window.Core)==null||e.showToast("Intention planted with the collective"),this.closeCollectivePopup(),this.renderRoomDashboard()}closeCollectivePopup(){this._clearTimer(),this.closePracticePopup()}enterGroupCircle(){this.showCollectiveIntentionPopup()}submitClosure(){var e,t,i;try{const n=document.getElementById("closureReflection");n&&(this.userWeekData.closureReflection=this._sanitizeInput(n.value),this.saveUserWeekData(!0)),(e=window.Core)==null||e.showToast(this.config.completionMessage),this.userWeekData=this._getDefaultUserData(),this.saveUserWeekData(!0),(t=window.Core)==null||t.navigateTo("hubView")}catch(n){console.error("submitClosure error:",n),(i=window.Core)==null||i.showToast("Failed to submit closure")}}_clearTimer(){this.collectiveTimer&&(clearInterval(this.collectiveTimer),this.collectiveTimer=null)}getLivingPresenceCount(){return typeof this._cachedPresenceCount=="number"?this._cachedPresenceCount:0}getMockCollectiveWords(){const e=Date.now();return[{word:"Growth",timestamp:e-864e5},{word:"Peace",timestamp:e-72e6},{word:"Courage",timestamp:e-432e5},{word:"Clarity",timestamp:e-36e6},{word:"Healing",timestamp:e-216e5},{word:"Trust",timestamp:e-18e6},{word:"Love",timestamp:e-144e5},{word:"Balance",timestamp:e-72e5},{word:"Freedom",timestamp:e-36e5},{word:"Joy",timestamp:e-18e5}]}getCollectiveWordsCount(){return(this.collectiveWords??this.getMockCollectiveWords()).length}_getLunarRoomId(){return{newmoon:"new-moon",waxingmoon:"waxing-moon",fullmoon:"full-moon",waningmoon:"waning-moon"}[this.config.cssPrefix]??this.config.cssPrefix}_setPresence(){var e,t,i;if((e=p())!=null&&e.ready)try{const n=this._getLunarRoomId(),o=`${this.config.emoji} ${this.config.name}`;(t=p())==null||t.setPresence("online",o,n),(i=window.Core)!=null&&i.state&&(window.Core.state.currentRoom=n,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=o))}catch(n){console.error("[LunarRoom] _setPresence error:",n)}}_clearPresence(){var e,t,i;if((e=p())!=null&&e.ready)try{(t=p())==null||t.setPresence("online","✨ Available",null),(i=window.Core)!=null&&i.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(n){console.error("[LunarRoom] _clearPresence error:",n)}}async _refreshLivePresence(){var i,n;if(!((i=p())!=null&&i.ready))return;const e=this._getLunarRoomId(),t=async()=>{var o,r;try{const s=await((o=p())==null?void 0:o.getRoomParticipants(e)),a=await((r=p())==null?void 0:r.getBlockedUsers()),l=s.filter(g=>!a.has(g.user_id));this._cachedPresenceCount=l.length,this._cachedParticipants=l;const m=document.getElementById("lunarLiveCountTop");m&&(m.textContent=`${l.length} members practicing with you now`);const u=document.querySelector(".lunar-live-presence span");u&&(u.textContent=`${l.length} members in circle`);const v=document.querySelector(".lunar-group-avatars");v&&(v.innerHTML=this._buildRealAvatars(l))}catch(s){console.warn("[LunarRoom] _refreshLivePresence error:",s)}};if(await t(),this._presenceSub)try{this._presenceSub.unsubscribe()}catch{}this._presenceSub=(n=p())==null?void 0:n.subscribeToPresence(t)}_buildRealAvatars(e){const i=e.slice(0,5),n=e.length-5,o=i.map(s=>{var g,C;const a=s.profiles??{},l=a.name??a.display_name??"?",m=l.charAt(0).toUpperCase(),u=((C=(g=window.Core)==null?void 0:g.getAvatarGradient)==null?void 0:C.call(g,s.user_id))??"background:#8B7AFF";let v=a.avatar_url?`<img src="${a.avatar_url}" alt="${m}" width="40" height="40" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:a.emoji?`<span style="font-size:18px;">${a.emoji}</span>`:`<span style="font-size:14px;font-weight:600;">${m}</span>`;return`<div class="lunar-avatar" style="${u};display:flex;align-items:center;justify-content:center;" aria-label="${l}">${v}</div>`}).join(""),r=n>0?`<div class="lunar-avatar" style="background:#333;display:flex;align-items:center;justify-content:center;font-size:12px;">+${n}</div>`:`<div class="lunar-avatar lunar-join-avatar" role="button" tabindex="0" aria-label="Join circle" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><span aria-hidden="true">+</span></div>`;return o+r}async _loadCollectiveWords(){var i,n;if(!((i=p())!=null&&i.ready))return;const e=`${this._getLunarRoomId()}-collective`,t=async()=>{var o;try{const r=await((o=p())==null?void 0:o.getRoomMessages(e,100));if(r!=null&&r.length){this.collectiveWords=r.map(l=>({word:l.message,timestamp:new Date(l.created_at).getTime()}));const s=document.getElementById("wordCloud");s&&(s.innerHTML=h.renderWordCloud(this.collectiveWords));const a=document.querySelector(".lunar-word-count strong");a&&(a.textContent=this.collectiveWords.length)}}catch(r){console.warn("[LunarRoom] _loadCollectiveWords error:",r)}};if(await t(),this._collectiveWordsSub)try{this._collectiveWordsSub.unsubscribe()}catch{}this._collectiveWordsSub=(n=p())==null?void 0:n.subscribeToRoomChat(e,t)}cleanup(){this._clearTimer(),this._removeEventListeners(),clearTimeout(this.saveDebounceTimer),clearTimeout(this._retryCheckTimeout),["_presenceSub","_collectiveWordsSub"].forEach(e=>{if(this[e]){try{this[e].unsubscribe()}catch{}this[e]=null}}),this.domCache={dynamicContent:null,popup:null}}};_(d,"CONSTANTS",{MEDITATION_DURATION:180,WITNESSING_DURATION:120,SAVE_DEBOUNCE_MS:500,MAX_INTENTION_LENGTH:500,MAX_AFFIRMATION_LENGTH:300,MAX_RELEASE_LIST_LENGTH:1e3,MAX_WORD_LENGTH:50,TIMER_INTERVAL_MS:1e3,LUNAR_CYCLE_DAYS:29.53,MS_PER_DAY:864e5});let y=d;export{y as L,w as a};
