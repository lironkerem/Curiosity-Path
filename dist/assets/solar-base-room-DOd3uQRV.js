import{b as l,d as a,e as f,f as v,S as b}from"./communityHub-1t0pn7A5.js";const C={config:{},practices:{},prebuiltAffirmations:[],userData:{intention:"",affirmation:"",releaseList:"",practiceCount:0,closureReflection:"",completedDate:null,privateIntention:"",collectiveWord:"",intentionShared:!1},isActive:!1,startDate:null,endDate:null,collectiveTimer:null,saveDebounceTimer:null,eventListeners:[],CONSTANTS:{MAX_INTENTION_LENGTH:500,MAX_AFFIRMATION_LENGTH:300,MAX_RELEASE_LIST_LENGTH:1e3,SAVE_DEBOUNCE_MS:500},_sanitizeInput(e){return typeof e!="string"?"":e.trim().slice(0,1e3).replace(/<script[^>]*>.*?<\/script>/gi,"").replace(/<iframe[^>]*>.*?<\/iframe>/gi,"").replace(/<object[^>]*>.*?<\/object>/gi,"")},_escapeHtml:e=>b.escapeHtml(e),_removeEventListeners(){this.eventListeners.forEach(({element:e,event:t,handler:o})=>e==null?void 0:e.removeEventListener(t,o)),this.eventListeners=[]},_clearTimer(){this.collectiveTimer&&(clearInterval(this.collectiveTimer),this.collectiveTimer=null)},cleanup(){this._clearTimer(),this._removeEventListeners(),clearTimeout(this.saveDebounceTimer),this.saveDebounceTimer=null,this._unsubPresence(),this._unsubCollectiveWords()},_unsubPresence(){var e;try{(e=this._presenceSub)==null||e.unsubscribe()}catch{}this._presenceSub=null},_unsubCollectiveWords(){var e;try{(e=this._collectiveWordsSub)==null||e.unsubscribe()}catch{}this._collectiveWordsSub=null},_startCountdownTimer(e,t,o,i){var n;try{(n=document.getElementById(t))!=null&&n.style&&(document.getElementById(t).style.display="none");const r=document.getElementById(e);if(!r)return;r.setAttribute("role","timer"),r.setAttribute("aria-live","off");let s=o;this._clearTimer(),this.collectiveTimer=setInterval(()=>{s--;const c=Math.floor(s/60),d=s%60;r.textContent=`${c}:${String(d).padStart(2,"0")}`,s<=0&&(this._clearTimer(),r.textContent="Complete",i==null||i())},1e3)}catch(r){console.error("[BaseSolarRoom] _startCountdownTimer error:",r),this._clearTimer()}},init(){try{this.checkIfActive(),this.isActive&&(this.calculateDates(),this.loadData())}catch(e){console.error(`${this.config.displayName} init error:`,e)}},checkIfActive(){var r,s,c;if((c=(s=(r=window.Core)==null?void 0:r.state)==null?void 0:s.currentUser)!=null&&c.is_admin){this.isActive=!0;return}const e=new Date,t=e.getFullYear(),o=this.config.name,i=v.getSeasonDates(t)[o];if(e>=i.start&&e<=i.end){this.isActive=!0;return}const n=v.getSeasonDates(t-1)[o];this.isActive=e>=n.start&&e<=n.end},calculateDates(){const e=new Date,t=this.config.name,o=v.getSeasonDates(e.getFullYear()-1)[t];if(e>=o.start&&e<=o.end){this.startDate=o.start,this.endDate=o.end;return}const i=v.getSeasonDates(e.getFullYear())[t];this.startDate=i.start,this.endDate=i.end},loadData(){var t;const e=a.storage.get(this.config.name);e&&new Date(e.seasonStartDate).getTime()===((t=this.startDate)==null?void 0:t.getTime())&&(this.userData=e.data)},saveData(){a.storage.set(this.config.name,{seasonStartDate:this.startDate.toISOString(),data:this.userData})||a.showToast("Could not save data. Check storage limits.")},enterRoom(){var t,o,i,n,r,s,c;const e=(i=(o=(t=window.Core)==null?void 0:t.state)==null?void 0:o.currentUser)==null?void 0:i.is_admin;if(!this.isActive&&!e){a.showToast(`${this.config.emoji} ${this.config.displayName} room opens during ${this.config.displayName.toLowerCase()} season`);return}this.startDate||this.calculateDates(),(r=(n=window.Core)==null?void 0:n.navigateTo)==null||r.call(n,"practiceRoomView"),(c=(s=window.PracticeRoom)==null?void 0:s.stopHubPresence)==null||c.call(s),document.body.classList.add("solar-room-active"),this.renderDashboard(),this._setPresence(),this._loadCollectiveWords()},leaveRoom(){var e,t,o,i;try{this._clearPresence(),this._unsubPresence(),this._unsubCollectiveWords(),this._clearTimer(),this._removeEventListeners(),document.body.classList.remove("solar-room-active"),window.currentSolarRoom=null,(t=(e=window.PracticeRoom)==null?void 0:e.startHubPresence)==null||t.call(e),(i=(o=window.Core)==null?void 0:o.navigateTo)==null||i.call(o,"hubView")}catch(n){console.error("Error leaving solar room:",n)}},renderDashboard(){a.injectStyles();const e=document.getElementById("dynamicRoomContent");if(!e){console.error("dynamicRoomContent not found");return}document.body.setAttribute("data-season",this.config.name),window.currentSolarRoom=this;const t=a.utils.calculateDaysRemaining(this.endDate),o=`${t} ${t===1?"day":"days"} remaining`,i=`${f.IMAGE_BASE_URL}${this.config.displayName}.webp`,n=this.getLivingPresenceCount();e.innerHTML=`
      <div class="solar-room-bg">
        <div class="solar-floating-bg">
          ${a.utils.generateFloatingElements(this.config.floatingEmojis)}
        </div>

        ${a.renderers.topBar({seasonName:this.config.displayName,emoji:this.config.emoji,daysText:o,livingPresenceCount:n})}

        <div class="solar-content-wrapper">
          <div class="solar-sun-visual">
            <div class="solar-sun-glow"><div class="solar-sun-sphere"></div></div>
          </div>

          <div class="solar-intro-card">
            <picture>
              <source srcset="${i}" type="image/webp">
              <img src="${i.replace(".webp",".png")}" alt="${this.config.displayName} Season"
                   width="600" height="400" class="solar-season-img" loading="lazy" decoding="async">
            </picture>
            <p>${this.config.wisdom}</p>
          </div>

          ${a.renderers.modeToggle()}

          <div id="soloContent" class="solar-mode-content">
            <div class="solar-mode-description">
              <h3>Your Sacred Space</h3>
              <p>${this.config.modeDescription||"Individual practices for this season"}</p>
            </div>
            <div class="solar-practices-grid" id="practicesGrid">
              ${Object.values(this.practices).map(r=>a.renderers.practiceCard(r,this.isPracticeLocked(r))).join("")}
            </div>
            ${a.renderers.savedInputs(this.userData,this.config.displayName)}
          </div>

          <div id="groupContent" class="solar-mode-content" style="display:none;">
            ${a.renderers.groupPractice({seasonEmoji:this.config.seasonEmoji,seasonName:this.config.displayName,presenceCount:n,itemEmoji:this.config.itemEmoji,sessionTimes:this.config.sessionTimes,collectiveFocus:this.config.collectiveFocus,collectiveNoun:this.config.collectiveNoun})}
          </div>

          ${t<=7?a.renderers.closureSection(this.config.closure):""}
        </div>
      </div>`,this._attachEventListeners(e),setTimeout(()=>this._refreshLivePresence(),300)},_attachEventListeners(e){try{this._removeEventListeners();const t=(r,s,c)=>{r&&(r.addEventListener(s,c),this.eventListeners.push({element:r,event:s,handler:c}))},o=e.querySelector("#practicesGrid"),i=r=>{const s=r.target.closest(".solar-practice-card");s&&(r.type==="keydown"&&r.key!=="Enter"&&r.key!==" "||(r.type==="keydown"&&r.preventDefault(),s.dataset.locked==="true"?a.showToast("Complete the first practice to unlock others"):this.showPracticePopup(s.dataset.practice)))};t(o,"click",i),t(o,"keydown",i),t(e.querySelector(".solar-mode-toggle"),"click",r=>{const s=r.target.closest(".solar-mode-btn");s!=null&&s.dataset.mode&&a.switchMode(s.dataset.mode)});const n=e.querySelector('[data-action="submit-closure"]');t(n,"click",()=>this.submitClosure())}catch(t){console.error("Error attaching event listeners:",t)}},isPracticeLocked:()=>!1,getPracticeContent(e){const t=`get${e.charAt(0).toUpperCase()}${e.slice(1)}Content`;return typeof this[t]=="function"?this[t]():(console.error(`[BaseSolarRoom] Content method ${t} not found for ${e}`),'<div class="solar-popup-section"><p>Practice content not available.</p></div>')},showPracticePopup(e){try{const t=this.practices[e];if(!t){console.error(`Practice ${e} not found`);return}const o=document.createElement("div");o.id="practicePopup",o.innerHTML=a.renderers.popup({title:t.title,content:this.getPracticeContent(e),hasSaveButton:!!t.hasSaveData}),(document.getElementById("communityHubFullscreenContainer")||document.body).appendChild(o),this._attachPopupListeners(o,e)}catch(t){console.error("Error showing practice popup:",t)}},_attachPopupListeners(e,t){var o;try{e.querySelectorAll(".solar-affirmation-btn").forEach(i=>{i.addEventListener("click",()=>{const n=document.getElementById("affirmationText");n&&(n.value=i.dataset.affirmation)})}),(o=e.querySelector('[data-action="save-practice"]'))==null||o.addEventListener("click",()=>this.savePractice(t)),e.querySelectorAll('[data-action="close-popup"]').forEach(i=>i.addEventListener("click",()=>a.closePracticePopup()))}catch(i){console.error("Error attaching popup listeners:",i)}},savePractice(e){try{const t=this.practices[e];if(!(t!=null&&t.hasSaveData))return;const o=s=>{const c=document.getElementById(s);return c?this._sanitizeInput(c.value):null},i=o("intentionText"),n=o("affirmationText"),r=o("releaseListText");i!==null&&(this.userData.intention=i),n!==null&&(this.userData.affirmation=n),r!==null&&(this.userData.releaseList=r),this.userData.practiceCount++,this.saveData(),a.showToast("Practice saved"),a.closePracticePopup(),this.renderDashboard()}catch(t){console.error("Error saving practice:",t),a.showToast("Failed to save practice")}},submitClosure(){const e=document.getElementById("closureReflection");if(!e){a.showToast("Reflection field not found");return}const t=e.value.trim();if(!t){a.showToast("Please write your closing reflection");return}if(t.length<f.MIN_REFLECTION_LENGTH){a.showToast(`Please write at least ${f.MIN_REFLECTION_LENGTH} characters`);return}this.userData.closureReflection=t,this.userData.completedDate=new Date().toISOString(),this.saveData(),a.showToast(`${this.config.emoji} ${this.config.displayName} season complete. Rest well until the next cycle.`),setTimeout(()=>this.init(),1e3)},showCollectiveIntentionPopup(){try{const e=document.createElement("div");e.id="collectivePopup",e.className="solar-practice-popup",e.innerHTML=`
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
        </div>`}catch(e){console.error("Error starting step 4:",e)}},submitWordToCollective(){var e,t;try{const o=((e=document.getElementById("collectiveWordInput"))==null?void 0:e.value.trim())||"";if(!o){a.showToast("Please enter a word");return}if(o.length>50){a.showToast("Word is too long");return}this.userData.collectiveWord=o,this.userData.intentionShared=!0,(t=l)!=null&&t.ready&&l.sendRoomMessage(`${this._getSolarRoomId()}-collective`,o).catch(i=>console.error("[BaseSolarRoom] submitWordToCollective DB error:",i)),this.startCollectiveStep5()}catch(o){console.error("Error submitting word:",o)}},startCollectiveStep5(){var e;try{const t=document.getElementById("collectiveIntentionContent");if(!t)return;const o=(e=this._dbCollectiveWords)!=null&&e.length?this._dbCollectiveWords:this._getMockCollectiveWords(),i=this._renderWordCloud(o);t.innerHTML=`
        <div class="solar-popup-section" style="text-align:center;">
          <h3>Step 4: The Collective ${this.config.displayName} Field</h3>
          <p>These are the ${this.config.collectiveNoun||"intentions"} planted by practitioners in this circle.</p>
        </div>
        <div id="wordCloud" style="padding:2rem;margin:2rem 0;background:rgba(255,255,255,0.03);border-radius:12px;min-height:200px;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;">
          ${i}
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
        </div>`}catch(t){console.error("Error starting step 5:",t)}},startWitnessingTimer(){this._startCountdownTimer("witnessingTimer","startWitnessingBtn",120,()=>{const e=document.getElementById("completeBtn");e&&(e.style.display="block")})},completeCollectivePractice(){var e;try{this.userData.practiceCount++,this.saveData(),a.showToast(`${this.config.seasonEmoji} ${this.config.collectiveNoun||"Intention"} planted with the collective`),(e=document.getElementById("collectivePopup"))==null||e.remove(),this.renderDashboard()}catch(t){console.error("Error completing collective practice:",t)}},_getMockCollectiveWords(){const e={spring:["Growth","Renewal","Hope","Bloom","Energy","Fresh","Vitality","Emerge","Awaken","Begin"],summer:["Radiance","Joy","Abundance","Vibrant","Expansion","Bright","Celebrate","Fullness","Alive","Shine"],autumn:["Harvest","Gratitude","Release","Balance","Gather","Wisdom","Reflection","Abundance","Thanks","Ripen"],winter:["Rest","Stillness","Peace","Wisdom","Quiet","Restore","Deep","Calm","Reflection","Inner"]},t=e[this.config.name]||e.spring,o=Date.now();return t.map((i,n)=>({word:i,timestamp:o-n*36e5}))},_getSolarRoomId:function(){return`${this.config.name}-solar`},getLivingPresenceCount(){return typeof this._cachedPresenceCount=="number"?this._cachedPresenceCount:0},async _refreshLivePresence(){var o;if(!((o=l)!=null&&o.ready))return;const e=this._getSolarRoomId(),t=async()=>{try{const i=await l.getRoomParticipants(e),n=await l.getBlockedUsers(),r=i.filter(u=>!n.has(u.user_id)),s=r.length;this._cachedPresenceCount=s,this._cachedParticipants=r;const c=(u,p)=>{const m=document.getElementById(u);m&&(m.textContent=p)};c("solarLiveCountTop",`${s} members practicing with you now`),c("solarGroupPresenceBadge",`${s} gathering now`),c("solarGroupJoinCount",s),c("solarCollectivePresenceBadge",`${s} practitioners in circle now`);const d=document.getElementById("solarGroupAvatars");d&&(d.innerHTML=this._buildRealAvatars(r))}catch(i){console.warn("[BaseSolarRoom] _refreshLivePresence error:",i)}};await t(),this._unsubPresence(),this._presenceSub=l.subscribeToPresence(t)},_buildRealAvatars(e){const o=e.slice(0,5),i=e.length-5,n="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.2);",r=o.map(c=>{var g,y;const d=c.profiles||{},u=d.name||d.display_name||"?",p=u.charAt(0).toUpperCase(),m=((y=(g=window.Core)==null?void 0:g.getAvatarGradient)==null?void 0:y.call(g,c.user_id))??"background:var(--season-accent,#f59e0b)";let h;return d.avatar_url?h=`<img src="${d.avatar_url}" alt="${p}" width="40" height="40" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`:d.emoji?h=`<span style="font-size:18px;">${d.emoji}</span>`:h=`<span style="font-size:13px;font-weight:600;">${p}</span>`,`<div class="solar-avatar" style="${m};${n}" aria-label="${u}">${h}</div>`}).join(""),s=i>0?`<div class="solar-avatar" style="background:rgba(255,255,255,0.1);${n}font-size:12px;">+${i}</div>`:"";return r+s},_setPresence(){var e,t;if((e=l)!=null&&e.ready)try{const o=this._getSolarRoomId(),i=`${this.config.emoji} ${this.config.displayName}`;l.setPresence("online",i,o),(t=window.Core)!=null&&t.state&&(window.Core.state.currentRoom=o,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=i))}catch(o){console.error("[BaseSolarRoom] _setPresence error:",o)}},_clearPresence(){var e,t;if((e=l)!=null&&e.ready)try{l.setPresence("online","✨ Available",null),(t=window.Core)!=null&&t.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(o){console.error("[BaseSolarRoom] _clearPresence error:",o)}},async _loadCollectiveWords(){var e;if((e=l)!=null&&e.ready)try{const t=`${this._getSolarRoomId()}-collective`,o=async()=>{const i=await l.getRoomMessages(t,100);if(!(i!=null&&i.length))return;this._dbCollectiveWords=i.map(s=>({word:s.message,timestamp:new Date(s.created_at).getTime()}));const n=document.getElementById("wordCloud");n&&(n.innerHTML=this._renderWordCloud(this._dbCollectiveWords));const r=document.querySelector(".solar-word-count strong");r&&(r.textContent=this._dbCollectiveWords.length)};await o(),this._unsubCollectiveWords(),this._collectiveWordsSub=l.subscribeToRoomChat(t,o)}catch(t){console.warn("[BaseSolarRoom] _loadCollectiveWords error:",t)}},_renderWordCloud(e){return e!=null&&e.length?e.map(({word:t})=>{const o=(1+Math.random()*1.5).toFixed(2),i=(.6+Math.random()*.4).toFixed(2);return`<span class="solar-word-item" style="font-size:${o}rem;opacity:${i};color:var(--season-accent,#e0e0ff);font-weight:600;display:inline-block;margin:0.5rem;transition:all 0.3s;">${t}</span>`}).join(""):'<p style="color:rgba(224,224,255,0.5);">No words yet. Be the first to share.</p>'}};export{C as B};
