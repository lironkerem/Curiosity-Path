import{N as c}from"./Modal-BqVvY5UO.js";import"./community-hub-BdcPwhoU.js";import"./features-lazy-bN0WDG2L.js";import"./main-BZACSTar.js";import"./supabase-k82gbVKr.js";const u=[{id:"happy",emoji:"😊",title:"Happy"},{id:"joyful",emoji:"😄",title:"Joyful"},{id:"excited",emoji:"🤩",title:"Excited"},{id:"loved",emoji:"🥰",title:"Loved"},{id:"grateful",emoji:"🙏",title:"Grateful"},{id:"peaceful",emoji:"😌",title:"Peaceful"},{id:"calm",emoji:"🧘",title:"Calm"},{id:"relaxed",emoji:"😎",title:"Relaxed"},{id:"proud",emoji:"😤",title:"Proud"},{id:"confident",emoji:"💪",title:"Confident"},{id:"hopeful",emoji:"🌟",title:"Hopeful"},{id:"inspired",emoji:"✨",title:"Inspired"},{id:"sad",emoji:"😢",title:"Sad"},{id:"crying",emoji:"😭",title:"Crying"},{id:"lonely",emoji:"😔",title:"Lonely"},{id:"disappointed",emoji:"😞",title:"Disappointed"},{id:"anxious",emoji:"😰",title:"Anxious"},{id:"worried",emoji:"😟",title:"Worried"},{id:"stressed",emoji:"😫",title:"Stressed"},{id:"overwhelmed",emoji:"🤯",title:"Overwhelmed"},{id:"angry",emoji:"😠",title:"Angry"},{id:"frustrated",emoji:"😤",title:"Frustrated"},{id:"annoyed",emoji:"😒",title:"Annoyed"},{id:"tired",emoji:"😴",title:"Tired"},{id:"sick",emoji:"🤒",title:"Sick"},{id:"confused",emoji:"😕",title:"Confused"},{id:"surprised",emoji:"😲",title:"Surprised"},{id:"shocked",emoji:"😱",title:"Shocked"},{id:"nervous",emoji:"😬",title:"Nervous"},{id:"embarrassed",emoji:"😳",title:"Embarrassed"}],p=["What made you smile today?","What are you grateful for right now?","What's on your mind?","How are you really feeling?","What would you like to remember about today?","What challenged you today?","What did you learn about yourself?","What are you looking forward to?"],d=400;class b{constructor(e){this.app=e,this.currentPage=0,this.viewMode="write",this.isOpen=!1,this.isLocked=!1,this.activeModals=[]}render(){let e=document.getElementById("journal-tab");if(!e){const t=document.getElementById("main-content");if(!t)return;e=document.createElement("div"),e.id="journal-tab",e.className="tab-content",t.appendChild(e)}e.innerHTML=`
      <div class="journal-container">
        <div class="universal-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavJournal.webp');
                         --header-title:'';
                         --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
            <h1>My Personal Journal</h1>
            <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
            <span class="header-sub"></span>
          </header>
          
          <div class="journal-book-wrapper" id="journal-wrapper">
            <!-- Journal content injected here -->
          </div>
        </div>
      </div>
    `,this.initializeLockState(),this.renderJournal()}renderJournal(){const e=document.getElementById("journal-wrapper");if(!e)return;const t=!!this.app.state.data.journalPin;this.isOpen?this.renderOpenBook(e,t):this.renderClosedBook(e,t)}renderClosedBook(e,t){var i;const o=((i=this.app.state.currentUser)==null?void 0:i.name)||"My",n=t&&this.isLocked?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':"";e.innerHTML=`
      <div class="journal-closed" id="open-journal" style="opacity: 0; transform: scale(0.95);">
        <div class="journal-cover-title">${o}'s<br>Personal Journal</div>
        <div class="journal-cover-subtitle">Tap to open and begin writing</div>
        <div class="journal-lock">${n}</div>
      </div>`;const s=e.querySelector(".journal-closed");requestAnimationFrame(()=>{s.style.transition="opacity 0.5s ease-out, transform 0.5s ease-out",s.style.opacity="1",s.style.transform="scale(1)"}),s.addEventListener("click",()=>{t&&this.isLocked?this.promptUnlock():this.openBook()})}renderOpenBook(e,t){e.innerHTML=`
      <div class="journal-book" style="opacity: 0; transform: scale(0.95);">
        <!-- Top Navigation Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div class="mode-toggle">
            <button class="journal-btn-neuro mode-btn active" data-mode="write" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Write</button>
            <button class="journal-btn-neuro mode-btn" data-mode="read" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Read</button>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <button class="journal-btn-neuro lock-toggle-btn" id="lock-toggle" style="display:inline-flex;align-items:center;gap:0.4rem;">
              ${t&&this.isLocked?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'} Lock Journal
            </button>
            ${t?'<button class="journal-btn-neuro" id="pin-settings" title="PIN Settings" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>':""}
            <button class="journal-btn-neuro close-book-btn" id="close-journal" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Close</button>
          </div>
        </div>

        <!-- Pages Container -->
        <div class="journal-pages" id="journal-pages"></div>

        <!-- Bottom Controls -->
        <div class="journal-controls">
          <div class="journal-nav">
            <button class="journal-btn-neuro" id="prev-page" disabled>← Previous</button>
            <span class="page-indicator" id="page-indicator"></span>
            <button class="journal-btn-neuro" id="next-page" disabled>Next →</button>
          </div>
          <div style="display:flex;justify-content:center;margin-top:1rem;">
            <button class="journal-btn-neuro save-btn" id="save-entry" style="display:none;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> Save Entry</button>
          </div>
        </div>
      </div>`;const o=e.querySelector(".journal-book");requestAnimationFrame(()=>{o.style.transition="opacity 0.5s ease-out, transform 0.5s ease-out",o.style.opacity="1",o.style.transform="scale(1)"}),this.attachOpenEventListeners(),this.renderCurrentView()}renderWriteMode(){const e=document.getElementById("journal-pages"),t=document.getElementById("save-entry");t&&(t.style.display="block");const o=this.getRandomPrompt(),n=this.formatDate(new Date);e.innerHTML=`
      <div class="journal-page write-mode">
        <div class="journal-date">${n}</div>

        <textarea class="journal-textarea" 
                  id="journal-entry-text" 
                  placeholder="Dear Journal, ${o}"></textarea>

        <div class="prompt-box">
          <div class="prompt-text" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Writing prompt: ${o}</div>
        </div>

        <div class="prompt-box">
          <div class="prompt-text">Your Mood</div>
          <div class="journal-mood" style="margin-top:.6rem;">
            ${this.renderMoodButtons()}
          </div>
        </div>
      </div>`,this.attachMoodListeners(e),this.updateNavigation()}renderReadMode(e="none"){const t=document.getElementById("journal-pages"),o=document.getElementById("save-entry");o&&(o.style.display="none");const n=this.app.state.data.journalEntries||[];if(n.length===0){this.renderEmptyJournal(t);return}const i=[...n].sort((m,v)=>new Date(v.timestamp)-new Date(m.timestamp))[this.currentPage],a=n.indexOf(i),r=i.mood?this.getMoodEmoji(i.mood):"",l=i.date||this.formatDate(new Date(i.timestamp)),h=e==="left"?"page-flip-left":e==="right"?"page-flip-right":"";t.innerHTML=`
      <div class="journal-page read-mode ${h}">
        <div class="entry-actions">
          <button class="action-btn" onclick="window.featuresManager.engines.journal.editEntry(${a})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Edit</button>
          <button class="action-btn" onclick="window.featuresManager.engines.journal.deleteEntry(${a})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Delete</button>
        </div>
        <div class="journal-date">
          ${r?r+" ":""}
          ${l}
        </div>
        <div class="entry-content">${this.escapeHtml(i.situation||i.feelings||"")}</div>
      </div>`,this.updateNavigation()}renderEmptyJournal(e){e.innerHTML=`
      <div class="journal-page">
        <div class="empty-journal">
          <div class="empty-journal-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <p>Your journal is empty</p>
          <p style="font-size:.9rem;margin-top:.5rem;">Switch to Write mode to create your first entry</p>
        </div>
      </div>`,this.updateNavigation()}initializeLockState(){this.app.state.data.journalPin&&(this.isLocked=this.app.state.data.journalLocked!==!1)}promptSetPin(){const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',title:"Set Journal PIN",content:`
        <div class="modal-input-wrapper">
          <label class="form-label">Enter 4-digit PIN</label>
          <input type="password" id="pin-input" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <label class="form-label" style="margin-top:1rem;">Confirm PIN</label>
          <input type="password" id="pin-confirm" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <p style="font-size:.85rem;color:var(--neuro-text-muted);margin-top:.5rem;">
            You can reset PIN using your account password
          </p>
        </div>
      `,onConfirm:t=>{const o=t.querySelector("#pin-input"),n=t.querySelector("#pin-confirm"),s=o.value,i=n.value;return s.length!==4||!/^\d{4}$/.test(s)?(this.app.showToast("PIN must be 4 digits","warning"),!1):s!==i?(this.app.showToast("PINs do not match","warning"),!1):(this.app.state.data.journalPin=btoa(s),this.app.state.saveAppData(),this.isLocked=!0,this.app.showToast("PIN set successfully!","success"),this.renderJournal(),!0)}});setTimeout(()=>{var t;return(t=e.querySelector("#pin-input"))==null?void 0:t.focus()},100)}promptUnlock(){var o;const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',title:"Unlock Journal",content:`
        <div class="modal-input-wrapper">
          <label class="form-label">Enter your PIN</label>
          <input type="password" id="unlock-pin" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <button class="btn" id="forgot-pin" style="margin-top:.5rem;font-size:.85rem;">
            Forgot PIN? Use account password
          </button>
        </div>
      `,onConfirm:n=>{const s=n.querySelector("#unlock-pin"),i=s.value,a=atob(this.app.state.data.journalPin||"");return i===a?(this.isLocked=!1,this.isOpen=!0,this.app.showToast("Journal unlocked!","success"),this.openBook(),!0):(this.app.showToast("Incorrect PIN","error"),s.value="",s.focus(),!1)}});(o=e.querySelector("#forgot-pin"))==null||o.addEventListener("click",()=>{this.closeModal(e),this.resetPinWithAuth()});const t=e.querySelector("#unlock-pin");t==null||t.addEventListener("keydown",n=>{var s;n.key==="Enter"&&((s=e.querySelector(".modal-confirm"))==null||s.click())}),setTimeout(()=>t==null?void 0:t.focus(),100)}async resetPinWithAuth(){const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',title:"Reset PIN",content:`
        <div class="modal-input-wrapper">
          <p style="margin-bottom:1rem;">Enter your account password to reset your journal PIN</p>
          <label class="form-label">Account Password</label>
          <input type="password" id="auth-password" class="form-input" placeholder="Enter your password">
        </div>
      `,onConfirm:async o=>{const n=o.querySelector("#auth-password"),s=n.value;if(!s)return this.app.showToast("Please enter your password","warning"),!1;try{const{error:i}=await this.app.supabase.auth.signInWithPassword({email:this.app.state.currentUser.email,password:s});return i?(this.app.showToast("Incorrect password","error"),n.value="",n.focus(),!1):(delete this.app.state.data.journalPin,this.app.state.saveAppData(),this.isLocked=!1,this.app.showToast("PIN reset! Set a new one","success"),setTimeout(()=>this.promptSetPin(),300),!0)}catch(i){return console.error("Authentication error:",i),this.app.showToast("Authentication failed","error"),!1}}}),t=e.querySelector("#auth-password");t==null||t.addEventListener("keydown",o=>{var n;o.key==="Enter"&&((n=e.querySelector(".modal-confirm"))==null||n.click())}),setTimeout(()=>t==null?void 0:t.focus(),100)}showPinSettings(){var t,o;const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',title:"PIN Settings",content:`
        <div class="modal-input-wrapper">
          <button class="btn btn-primary" id="change-pin" style="width:100%;margin-bottom:.5rem;">
            Change PIN
          </button>
          <button class="btn" id="remove-pin" style="width:100%;">
            Remove PIN Lock
          </button>
        </div>
      `,cancelOnly:!0});(t=e.querySelector("#change-pin"))==null||t.addEventListener("click",()=>{this.closeModal(e),this.promptSetPin()}),(o=e.querySelector("#remove-pin"))==null||o.addEventListener("click",()=>{this.closeModal(e),c.showConfirm("Remove PIN lock from your journal? Your journal will remain accessible without a PIN.",()=>{delete this.app.state.data.journalPin,this.app.state.saveAppData(),this.isLocked=!1,this.app.showToast("PIN removed","success"),this.renderJournal()},{title:"Remove PIN?",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',confirmText:"Remove PIN"})})}saveEntry(){const e=document.getElementById("journal-entry-text"),t=e==null?void 0:e.value.trim();if(!t){this.app.showToast("Please write something in your journal","warning");return}const o=document.querySelector(".mood-btn.active"),n=(o==null?void 0:o.dataset.mood)||null,s={situation:t,feelings:"",mood:n,timestamp:new Date().toISOString(),date:this.formatDate(new Date)};this.app.state.addEntry("journal",s),this.app.gamification&&this.app.gamification.incrementJournalEntries(),this.app.showToast("Journal entry saved!","success"),e.value="",document.querySelectorAll(".mood-btn").forEach(i=>i.classList.remove("active")),this.checkAchievements(),this.switchMode("read")}editEntry(e){const t=this.app.state.data.journalEntries||[],o=t[e];if(!o)return;const n=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',title:"Edit Journal Entry",content:`
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            How did you feel?
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            ${this.renderMoodButtons(o.mood)}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            Entry
          </label>
          <textarea id="edit-entry" class="form-input" rows="8" placeholder="Write your thoughts...">${this.escapeHtml(o.situation||o.feelings||"")}</textarea>
        </div>
      `,onConfirm:s=>{const a=s.querySelector("#edit-entry").value.trim();if(!a)return this.app.showToast("Please write something","warning"),!1;const r=s.querySelector(".mood-btn.active"),l=(r==null?void 0:r.dataset.mood)||null;return t[e].situation=a,t[e].feelings="",t[e].mood=l,this.app.state.data.journalEntries=t,this.app.state.saveAppData(),this.app.showToast("Journal entry updated!","success"),this.renderCurrentView(),!0}});this.attachMoodListeners(n),setTimeout(()=>{var s;return(s=n.querySelector("#edit-entry"))==null?void 0:s.focus()},100)}deleteEntry(e){c.showConfirm("Are you sure you want to delete this journal entry? This action cannot be undone.",()=>{const t=this.app.state.data.journalEntries||[];t.splice(e,1),this.app.state.data.journalEntries=t,this.app.state.saveAppData(),this.app.showToast("Journal entry deleted","info"),this.currentPage>=t.length&&(this.currentPage=Math.max(0,t.length-1)),this.renderCurrentView()},{title:"Delete Journal Entry",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',confirmText:"Delete",isDanger:!0})}openBook(){const e=document.querySelector(".journal-closed");if(!e){this.isOpen=!0,this.renderJournal();return}e.style.transition=`opacity ${d}ms ease-in, transform ${d}ms ease-in`,e.style.opacity="0",e.style.transform="scale(0.9)",setTimeout(()=>{this.isOpen=!0,this.renderJournal()},d)}closeBook(){const e=document.querySelector(".journal-book");if(!e){this.isOpen=!1,this.renderJournal();return}e.style.transition=`opacity ${d}ms ease-in, transform ${d}ms ease-in`,e.style.opacity="0",e.style.transform="scale(0.9)",setTimeout(()=>{this.isOpen=!1,this.app.state.data.journalPin&&(this.isLocked=!0,this.app.state.data.journalLocked=!0,this.app.state.saveAppData()),this.renderJournal()},d)}switchMode(e){var t;this.viewMode=e,this.currentPage=0,document.querySelectorAll(".mode-btn").forEach(o=>o.classList.remove("active")),(t=document.querySelector(`[data-mode="${e}"]`))==null||t.classList.add("active"),this.renderCurrentView()}navigatePage(e){const o=(this.app.state.data.journalEntries||[]).length-1,n=this.currentPage+e;n<0||n>o||(this.currentPage=n,this.renderReadMode(e>0?"right":"left"))}updateNavigation(){const e=this.app.state.data.journalEntries||[],t=document.getElementById("prev-page"),o=document.getElementById("next-page"),n=document.getElementById("page-indicator");this.viewMode==="write"?(t&&(t.style.display="none"),o&&(o.style.display="none"),n&&(n.textContent="")):(t&&(t.style.display="block",t.disabled=this.currentPage===0),o&&(o.style.display="block",o.disabled=this.currentPage>=e.length-1),n&&(n.textContent=e.length?`Entry ${this.currentPage+1} of ${e.length}`:""))}renderCurrentView(){this.viewMode==="write"?this.renderWriteMode():this.renderReadMode()}attachOpenEventListeners(){const e=document.getElementById("close-journal");e==null||e.addEventListener("click",()=>this.closeBook());const t=document.getElementById("lock-toggle");t==null||t.addEventListener("click",()=>this.handleLockToggle());const o=document.getElementById("pin-settings");o==null||o.addEventListener("click",()=>this.showPinSettings()),document.querySelectorAll(".mode-btn").forEach(a=>{a.addEventListener("click",r=>{const l=r.target.dataset.mode;this.switchMode(l)})});const n=document.getElementById("prev-page"),s=document.getElementById("next-page");n==null||n.addEventListener("click",()=>this.navigatePage(-1)),s==null||s.addEventListener("click",()=>this.navigatePage(1));const i=document.getElementById("save-entry");i==null||i.addEventListener("click",()=>this.saveEntry())}handleLockToggle(){!!this.app.state.data.journalPin?this.isLocked?this.promptUnlock():(this.isLocked=!0,this.app.state.data.journalLocked=!0,this.app.state.saveAppData(),this.app.showToast("Journal locked","info"),this.renderJournal()):this.promptSetPin()}attachMoodListeners(e){e.querySelectorAll(".mood-btn").forEach(t=>{t.addEventListener("click",o=>{e.querySelectorAll(".mood-btn").forEach(n=>n.classList.remove("active")),o.currentTarget.classList.add("active")})})}checkAchievements(){var n,s;const e=((s=(n=this.app.gamification)==null?void 0:n.state)==null?void 0:s.totalJournalEntries)||0,t=this.app.gamification;if(!t)return;const o=t.getBadgeDefinitions();e>=1&&t.checkAndGrantBadge("first_journal",o),e>=20&&t.checkAndGrantBadge("journal_keeper",o),e>=75&&t.checkAndGrantBadge("journal_master",o),e>=150&&t.checkAndGrantBadge("journal_150",o),e>=400&&t.checkAndGrantBadge("journal_400",o)}createModal({icon:e,title:t,content:o,onConfirm:n,cancelOnly:s=!1}){const i=document.createElement("div");i.className="modal-overlay",i.innerHTML=`
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">${e}</div>
          <h3 class="modal-title">${t}</h3>
        </div>
        ${o}
        <div class="modal-actions">
          <button class="btn modal-cancel">${s?"Close":"Cancel"}</button>
          ${s?"":'<button class="btn btn-primary modal-confirm">Confirm</button>'}
        </div>
      </div>`,document.body.appendChild(i),this.activeModals.push(i);const a=()=>this.closeModal(i);i.querySelector(".modal-cancel").onclick=a,!s&&n&&(i.querySelector(".modal-confirm").onclick=()=>{n(i)!==!1&&this.closeModal(i)}),i.onclick=l=>{l.target===i&&a()};const r=l=>{l.key==="Escape"&&(a(),document.removeEventListener("keydown",r))};return document.addEventListener("keydown",r),i}closeModal(e){e.style.opacity="0",setTimeout(()=>{e.remove(),this.activeModals=this.activeModals.filter(t=>t!==e)},200)}cleanup(){this.activeModals.forEach(e=>e.remove()),this.activeModals=[]}getRandomPrompt(){return p[Math.floor(Math.random()*p.length)]}formatDate(e){return e.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}renderMoodButtons(e=null){return u.map(t=>`<button class="mood-btn ${e===t.id?"active":""}" 
              data-mood="${t.id}" 
              title="${t.title}">${t.emoji}</button>`).join("")}getMoodEmoji(e){const t=u.find(o=>o.id===e);return t?t.emoji:""}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}export{b as default};
