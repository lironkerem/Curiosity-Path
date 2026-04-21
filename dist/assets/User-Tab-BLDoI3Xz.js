var $=Object.defineProperty;var B=(n,e,t)=>e in n?$(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var y=(n,e,t)=>B(n,typeof e!="symbol"?e+"":e,t);import{E as j,k as x,A as L}from"./gratitude-Bn2fTzdH.js";import{s as g}from"./main-CW35BtMg.js";import"./shadow-alchemy-C-dEHqCu.js";import"./energy-4z8lVD8r.js";import"./karma-shop-D1yE7bQ-.js";import"./meditations-CES81Rz5.js";import"./tarot-B0GthyV3.js";import"./happiness-DAi1EURr.js";import"./journal-BH1nmClJ.js";import"./community-9jcQcQ0g.js";import"./chatbot-uTedkiyq.js";import"./calculator-DlgMF4Ba.js";import"./flip-script-XMT58tzZ.js";import"./supabase-k82gbVKr.js";const P=Object.freeze([Object.freeze({title:"FIRST-WINS",badges:Object.freeze([{icon:"🌱",name:"First Step",desc:"do any single action",xp:10,karma:3,rarity:"common"},{icon:"💚",name:"First Gratitude",desc:"log 1 gratitude entry",xp:10,karma:3,rarity:"common"},{icon:"📓",name:"First Journal",desc:"save 1 journal entry",xp:10,karma:3,rarity:"common"},{icon:"⚡",name:"First Energy",desc:"log 1 energy check-in",xp:10,karma:3,rarity:"common"},{icon:"🃏",name:"First Reading",desc:"complete 1 tarot spread",xp:10,karma:3,rarity:"common"},{icon:"🧘",name:"First Meditation",desc:"finish 1 meditation session",xp:10,karma:3,rarity:"common"},{icon:"🛒",name:"First Purchase",desc:"buy anything in Karma Shop",xp:50,karma:3,rarity:"common"}])}),Object.freeze({title:"GRATITUDE",badges:Object.freeze([{icon:"❤️",name:"Gratitude Warrior",desc:"30 entries",xp:50,karma:5,rarity:"uncommon"},{icon:"💕",name:"Gratitude Legend",desc:"100 entries",xp:100,karma:10,rarity:"rare"},{icon:"💖",name:"Gratitude Sage",desc:"200 entries",xp:200,karma:15,rarity:"epic"},{icon:"💘",name:"Gratitude Titan",desc:"500 entries",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"JOURNAL",badges:Object.freeze([{icon:"📓",name:"Journal Keeper",desc:"20 entries",xp:50,karma:5,rarity:"uncommon"},{icon:"📚",name:"Journal Master",desc:"75 entries",xp:100,karma:10,rarity:"rare"},{icon:"📖",name:"Journal Sage",desc:"150 entries",xp:200,karma:15,rarity:"epic"},{icon:"📜",name:"Journal Titan",desc:"400 entries",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"ENERGY",badges:Object.freeze([{icon:"⚡",name:"Energy Tracker",desc:"30 logs",xp:50,karma:5,rarity:"uncommon"},{icon:"🔋",name:"Energy Sage",desc:"100 logs",xp:100,karma:10,rarity:"rare"},{icon:"🔌",name:"Energy Titan",desc:"300 logs",xp:300,karma:15,rarity:"epic"},{icon:"⚡️",name:"Energy Legend",desc:"600 logs",xp:600,karma:30,rarity:"legendary"}])}),Object.freeze({title:"TAROT",badges:Object.freeze([{icon:"🔮",name:"Tarot Apprentice",desc:"10 spreads",xp:25,karma:3,rarity:"common"},{icon:"🃏",name:"Tarot Mystic",desc:"25 spreads",xp:50,karma:5,rarity:"uncommon"},{icon:"🌙",name:"Tarot Oracle",desc:"75 spreads",xp:100,karma:10,rarity:"rare"},{icon:"🧙",name:"Tarot Sage",desc:"150 spreads",xp:200,karma:15,rarity:"epic"},{icon:"🔮",name:"Tarot Titan",desc:"400 spreads",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"MEDITATION",badges:Object.freeze([{icon:"🧘",name:"Meditation Devotee",desc:"20 sessions",xp:50,karma:5,rarity:"uncommon"},{icon:"🕉️",name:"Meditation Master",desc:"60 sessions",xp:100,karma:10,rarity:"rare"},{icon:"🧘‍♂️",name:"Meditation Sage",desc:"100 sessions",xp:300,karma:15,rarity:"epic"},{icon:"🧘‍♀️",name:"Meditation Titan",desc:"200 sessions",xp:700,karma:30,rarity:"legendary"}])}),Object.freeze({title:"STREAKS",badges:Object.freeze([{icon:"⭐",name:"Perfect Week",desc:"7 days all quests",xp:75,karma:10,rarity:"rare"},{icon:"💎",name:"Dedication",desc:"30-day login",xp:100,karma:15,rarity:"epic"},{icon:"🔱",name:"Unstoppable",desc:"60-day login",xp:150,karma:15,rarity:"epic"},{icon:"👑",name:"Legendary Streak",desc:"100-day login",xp:200,karma:30,rarity:"legendary"}])})]),O=Object.freeze([["Seeker",0],["Practitioner",300],["Adept",800],["Healer",1600],["Master",3200],["Sage",6500],["Enlightened",2e4],["Buddha",5e4],["Light",15e4],["Emptiness",4e5]]),_=Object.freeze({common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"}),D=[{id:"profile",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',label:"Profile"},{id:"skins",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2z"/><path d="M6 11c1.5 0 3 .5 3 2"/><path d="M18 11c-1.5 0-3 .5-3 2"/></svg>',label:"Skins"},{id:"notifications",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',label:"Notifications"},{id:"about",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',label:"About the App"},{id:"rules",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',label:"Rules"},{id:"contact",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',label:"Contact Me"},{id:"export",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',label:"Export Data"},{id:"billing",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>',label:"Pricings"}],N=Object.keys(L).map(n=>`<button type="button" class="avatar-icon-btn" data-value="${n}" title="${n}">${L[n]}<span style="text-transform:capitalize;letter-spacing:.02em;">${n.replace(/-/g," ")}</span></button>`).join(""),v=(n,e,t=!1,i=!1)=>`
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">${e}</span>
    <label class="toggle-switch">
      <input type="checkbox" id="${n}" ${t?"checked":""} ${i?"disabled":""}>
      <span class="toggle-slider"></span>
    </label>
  </div>`,A=(n,e,t)=>`
  <div>
    <label style="font-size:.85rem;display:block;margin-bottom:6px;">${e}</label>
    <input 
      type="time" 
      id="${n}" 
      value="${t}" 
      style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
  </div>`,k=n=>`
  <div class="notification-section">${n}</div>`,z=(n={})=>`
  <div class="accordion-inner">
    <div class="profile-avatar-header">
      <label class="avatar-upload-label" title="Click to change picture">
        <input type="file" id="avatar-upload" accept="image/*">
        <div class="profile-avatar-container">
          <img 
            id="profile-avatar-img" 
            src="${n.avatar_url||""}" 
            alt="Profile avatar"
            width="80" height="80"
            loading="lazy"
            decoding="async"
            style="${n.avatar_url?"":"display:none;"}">
          <span 
            class="profile-avatar-emoji" 
            style="${n.avatar_url?"display:none;":""}">
            ${x(n.emoji||"user")}
          </span>
        </div>
      </label>
      <!-- Hidden input stores the selected icon key -->
      <input type="hidden" id="profile-emoji" value="${j[n.emoji]||n.emoji||"user"}">
      <button type="button" class="btn" id="open-icon-picker-btn">
        Choose Icon
      </button>
    </div>

    <!-- Icon Picker Modal -->
    <div id="icon-picker-modal" style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
      <div style="background:var(--neuro-bg);border-radius:var(--radius-lg);padding:1.5rem;max-width:360px;width:90%;box-shadow:var(--shadow-raised-lg);max-height:80vh;display:flex;flex-direction:column;gap:1rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong style="font-size:1rem;">Choose your Icon</strong>
          <button type="button" id="close-icon-picker-btn" aria-label="Close icon picker" style="background:none;border:none;cursor:pointer;font-size:0.85rem;color:var(--neuro-text);padding:4px 8px;border-radius:6px;line-height:1;">✕</button>
        </div>
        <div class="avatar-icon-picker" id="avatar-icon-picker" style="overflow-y:auto;max-height:55vh;">
          ${N}
        </div>
      </div>
    </div>
    <input 
      id="profile-name" 
      type="text" 
      maxlength="30" 
      placeholder="Display name" 
      value="${n.name||""}">
    <input 
      id="profile-email" 
      type="email" 
      placeholder="E-mail" 
      value="${n.email||""}">
    <input 
      id="profile-phone" 
      type="tel" 
      placeholder="Phone" 
      value="${n.phone||""}">
    <input 
      id="profile-birthday" 
      type="date" 
      value="${n.birthday||""}">
    <input
      id="profile-country"
      type="text"
      maxlength="60"
      placeholder="Country"
      value="${n.country||""}">
    <button class="btn-link" id="save-profile-btn">Save changes</button>

    <!-- Status Picker -->
    <div class="status-picker-section">
      <div class="status-picker-label">My Status</div>
      <div class="status-picker-options">
        ${[{status:"online",color:"#6b9b37",icon:"🟢",label:"Available"},{status:"away",color:"#e53e3e",icon:"🔴",label:"Away"},{status:"silent",color:"#7c3aed",icon:"🟣",label:"In Silence"},{status:"deep",color:"#1e40af",icon:"🔵",label:"Deep Practice"},{status:"offline",color:"#9ca3af",icon:"⚫",label:"Offline"}].map(e=>`
          <button
            class="status-option-btn"
            data-status="${e.status}"
            data-color="${e.color}"
            data-label="${e.label}"
            title="${e.label}">
            <span class="status-option-dot" style="background:${e.color};"></span>
            <span class="status-option-text">${e.label}</span>
          </button>`).join("")}
      </div>
    </div>

    <!-- Delete Account -->
    <div class="delete-account-section">
      <button type="button" class="btn-delete-account" id="delete-account-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Delete Account
      </button>
    </div>
  </div>`,U=()=>`
  <div id="delete-account-modal-overlay" class="delete-account-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-account-title">
    <div class="delete-account-modal">
      <div class="delete-account-modal-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <h3 id="delete-account-title" class="delete-account-modal-title">Delete Your Account?</h3>
      <p class="delete-account-modal-body">
        This will permanently delete your profile, all your data, messages, and activity.<br>
        <strong>This cannot be undone.</strong>
      </p>
      <p class="delete-account-modal-confirm-label">Type <strong>DELETE</strong> to confirm:</p>
      <input
        type="text"
        id="delete-account-confirm-input"
        class="delete-account-confirm-input"
        placeholder="DELETE"
        autocomplete="off"
        maxlength="6">
      <div class="delete-account-modal-actions">
        <button type="button" class="btn-delete-cancel" id="delete-account-cancel-btn">Cancel</button>
        <button type="button" class="btn-delete-confirm" id="delete-account-confirm-btn" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Yes, Delete My Account
        </button>
      </div>
    </div>
  </div>`,H=n=>{var r,l,c,d,u,h,m,b,E,S,I,T,M;const e=localStorage.getItem("activeTheme")||"default",t=document.body.classList.contains("dark-mode"),i=((l=(r=n.state)==null?void 0:r.currentUser)==null?void 0:l.isAdmin)||((d=(c=n.state)==null?void 0:c.currentUser)==null?void 0:d.isVip),o=i||((m=(h=(u=n.gamification)==null?void 0:u.state)==null?void 0:h.unlockedFeatures)==null?void 0:m.includes("luxury_champagne_gold_skin")),a=i||((S=(E=(b=n.gamification)==null?void 0:b.state)==null?void 0:E.unlockedFeatures)==null?void 0:S.includes("royal_indigo_skin")),s=i||((M=(T=(I=n.gamification)==null?void 0:I.state)==null?void 0:T.unlockedFeatures)==null?void 0:M.includes("earth_luxury_skin"));return`
    <div class="accordion-inner">
      ${v("dark-mode-toggle",'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark Mode',t)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
      ${v("theme-default","Default (Neumorphic)",e==="default").replace('id="theme-default"','class="theme-toggle" data-theme="default"')}
      ${v("theme-matrix","Escaping the Matrix",e==="matrix-code").replace('id="theme-matrix"','class="theme-toggle" data-theme="matrix-code"')}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
      ${f("champagne-gold","Champagne Gold",o,e)}
      ${f("royal-indigo","Royal Indigo",a,e)}
      ${f("earth-luxury","Earth Luxury",s,e)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
    </div>`},f=(n,e,t,i)=>`
  <div class="toggle-switch-container ${t?"":"disabled"}" 
       title="${t?"":'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Purchase in Karma Shop'}">
    <span class="toggle-switch-label">${e} ${t?"":'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'}</span>
    <label class="toggle-switch">
      <input 
        type="checkbox" 
        class="theme-toggle" 
        data-theme="${n}" 
        ${i===n?"checked":""} 
        ${t?"":"disabled"}>
      <span class="toggle-slider"></span>
    </label>
  </div>`,q=()=>{var t,i;let n;try{n=JSON.parse(localStorage.getItem("notification_settings"))}catch{n=null}const e={enabled:(n==null?void 0:n.enabled)||!1,window:{start:((t=n==null?void 0:n.window)==null?void 0:t.start)||"07:00",end:((i=n==null?void 0:n.window)==null?void 0:i.end)||"22:00"},frequency:(n==null?void 0:n.frequency)||"minimum",timezone:(n==null?void 0:n.timezone)||Intl.DateTimeFormat().resolvedOptions().timeZone};return localStorage.setItem("notification_settings",JSON.stringify(e)),`
    <div class="accordion-inner">
      <div style="margin-bottom:16px;">
        ${v("master-notifications-toggle",'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Enable Notifications',e.enabled)}
      </div>

      <div id="notification-options" style="${e.enabled?"":"opacity:.4;pointer-events:none;"}">
        ${R(e.timezone)}
        ${F(e.window)}
        ${G(e.frequency)}
        
        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">

        <button class="btn-link" id="save-notification-settings" style="margin-top:12px;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Settings
        </button>
        <small style="opacity:.6;display:block;margin-top:8px;font-size:.7rem;text-align:center;">
          Auto-saves after changes
        </small>
      </div>
    </div>`},R=n=>k(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:8px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> Your Timezone</h4>
  <div style="padding:10px;background:rgba(0,0,0,.05);border-radius:8px;margin-bottom:16px;">
    <div style="display:flex;align-items:center;gap:8px;">
      <span style="font-size:.85rem;opacity:.7;">Detected:</span>
      <strong id="timezone-display" style="font-size:.9rem;">${n}</strong>
    </div>
    <small style="opacity:.6;display:block;margin-top:6px;font-size:.75rem;">
      Times below are in your local timezone
    </small>
  </div>
`),F=n=>k(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Daily Availability Window</h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">
    Set your Daily Window for Notifications
  </p>
  
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-bottom:16px;">
    ${A("notification-start-time","Start Time",n.start)}
    ${A("notification-end-time","End Time",n.end)}
  </div>
  
  <small 
    id="time-validation-warning" 
    style="opacity:.7;display:none;font-size:.75rem;color:#ff9800;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Start time must be before end time
  </small>
`),G=n=>k(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Notification Frequency</h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">
    How involved would you like to be?
  </p>
  
  <select 
    id="notification-frequency" 
    style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,.1);font-size:.9rem;">
    <option value="minimum" ${n==="minimum"?"selected":""}>
      Minimum (2 per day)
    </option>
    <option value="full" ${n==="full"?"selected":""}>
      Full (4 per day)
    </option>
  </select>
  
  <div 
    id="frequency-warning" 
    style="display:none;margin-top:10px;padding:10px;background:rgba(255,152,0,.1);border-left:3px solid #ff9800;border-radius:6px;font-size:.8rem;">
    <strong style="color:#ff9800;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Short window detected</strong>
    <p style="margin:4px 0 0 0;opacity:.9;">
      Your window is less than 6 hours. FULL frequency may feel too frequent (4 notifications in a short time). 
      Consider using MINIMUM or extending your availability.
    </p>
  </div>
  
  ${V(n)}
`),V=n=>`
  <div style="margin-top:12px;padding:10px;background:rgba(0,0,0,.05);border-radius:8px;font-size:.8rem;">
    <strong style="display:block;margin-bottom:6px;">What you'll receive:</strong>
    <div id="frequency-explanation" style="opacity:.85;line-height:1.6;">
      ${n==="minimum"?`
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> <strong>Awakening:</strong> Checking-in and Focusing</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <strong>Integration:</strong> Integrating the Day</div>
      `:`
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg> <strong>Awakening:</strong> Checking-in and Focusing</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> <strong>Recharge:</strong> Quick reset and Mindfulness</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg> <strong>Reflect:</strong> Gratitude and Inspiration</div>
        <div><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> <strong>Integration:</strong> Integrating the Day</div>
      `}
    </div>
  </div>`,W=()=>`
  <div class="accordion-inner rules-panel">
    ${J()}
    ${Y()}
    ${K()}
  </div>`,J=()=>`
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
  </div>`,Y=()=>`
  <button class="rules-collapse-btn" data-target="currency-block">XP & Karma</button>
  <div id="currency-block" class="rules-collapse-content">
    <div class="rules-legend">
      <span class="rules-legend-xp">XP = experience</span>
      <span class="rules-legend-karma">Karma = currency</span>
    </div>
    <div class="rules-currency">
      <div class="rules-currency-block">
        <div class="rules-currency-title">Rules</div>
        <ul>
          <li>XP levels you up</li>
          <li>Karma buys features</li>
        </ul>
      </div>
      <div class="rules-currency-block">
        <div class="rules-currency-title">Levels</div>
        <table class="rules-level-table">
          ${O.map((n,e)=>`
            <tr>
              <td>L${e+1} - ${n[0]}</td>
              <td>${n[1].toLocaleString()}</td>
            </tr>
          `).join("")}
        </table>
      </div>
    </div>
  </div>`,K=()=>`
  <button class="rules-collapse-btn" data-target="badges-block">Badges</button>
  <div id="badges-block" class="rules-collapse-content">
    ${P.map(n=>Z(n)).join("")}
  </div>`,Z=n=>`
  <section class="rules-category">
    <h4 class="rules-category-title">${n.title}</h4>
    <div class="rules-grid">
      ${n.badges.map(e=>X(e)).join("")}
    </div>
  </section>`,X=n=>`
  <div class="rules-card" data-rarity="${n.rarity}">
    <div class="rules-card-icon">${n.icon}</div>
    <div class="rules-card-body">
      <div class="rules-card-name">${n.name}</div>
      <div class="rules-card-desc">${n.desc}</div>
      <div class="rules-card-rewards">
        <span class="rules-xp">+${n.xp} XP</span>
        <span class="rules-karma">+${n.karma} Karma</span>
      </div>
    </div>
    <div class="rules-card-tag" style="color:${_[n.rarity]}">
      ${n.rarity}
    </div>
  </div>`,Q=()=>`
  <div class="accordion-inner">
    <p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
    <p>Built to share tools, practices and ancient wisdom - digitally, from your device.</p>
  </div>`,ee=()=>`
  <div class="accordion-inner">
    <p>Contact for questions, sessions, classes, retreats or technical issues.</p>
    <a href="https://lironkerem.wixsite.com/project-curiosity" 
       target="_blank" 
       rel="noopener noreferrer"
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Official website
    </a><br>
    <a href="mailto:lironkerem@gmail.com" 
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Email me
    </a><br>
    <a href="https://www.facebook.com/AanandohamsProjectCuriosity" 
       target="_blank" 
       rel="noopener noreferrer"
       style="font-weight:bold;text-decoration:underline;color:var(--neuro-accent);">
      Facebook Page
    </a>
  </div>`,te=()=>`
  <div class="accordion-inner">
    <button class="btn-link" data-action="export-data">
      Download JSON
    </button>
  </div>`,ie=()=>`
  <div id="pricing-modal-overlay" class="pricing-overlay">
    <div class="pricing-modal">
      <button class="pricing-close" aria-label="Close pricing modal">✕</button>

      <h2 class="pricing-title">Choose Your Path</h2>
      <p class="pricing-sub">Unlock deeper features and support the journey.</p>

      <div class="pricing-cards" id="pricing-cards-container">
        ${w("free","Seeker","$0",["Core gratitude & journal","Daily energy check-ins","Tarot & meditation","Ad-free experience"],!1,"Current Plan")}
        
        ${w("practitioner","Practitioner","$8",["Everything in Seeker","Advanced automations","Premium skins & themes","Cloud backup & sync"],!0,"Upgrade")}
        
        ${w("master","Master","$20",["Everything in Practitioner","1-on-1 monthly call","Custom wellness plans","Priority support"],!1,"Upgrade")}
      </div>
      
      <div class="pricing-carousel-dots" id="pricing-dots">
        <span class="pricing-dot active"></span>
        <span class="pricing-dot"></span>
        <span class="pricing-dot"></span>
      </div>

      <p class="pricing-foot">
        Cancel or change anytime in <strong>Settings → Billing</strong>
      </p>
    </div>
  </div>`,w=(n,e,t,i,o,a)=>`
    <div class="pricing-card ${o?"featured":""}" data-plan="${n}">
      <div class="pricing-badge ${o?"popular":""}">${n==="free"?"Free":n==="master"?"Adept":"Most Popular"}</div>
      <h3>${e}</h3>
      <div class="pricing-price">
        ${t}${n!=="free"?"<span>/month</span>":""}
      </div>
      <ul>
        ${i.map(l=>`<li>${l}</li>`).join("")}
      </ul>
      <button class="pricing-btn ${o?"primary":""}" data-plan="${n}">
        ${a}
      </button>
    </div>`,p=class p{constructor(e){this.app=e,this.btn=null,this.dropdown=null,this.saveProfileLock=!1}get currentUser(){return this.app.state.currentUser}render(){return`
      <div class="user-menu" id="user-menu">
        <button class="user-disc" id="user-menu-btn" aria-expanded="false" aria-controls="user-dropdown">
          <svg class="disc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.8-1.36-6.05-3.55C7.35 13.36 9.57 12 12 12s4.65 1.36 6.05 3.65C16.8 17.84 14.5 19.2 12 19.2z"/>
          </svg>
          <span class="disc-avatar">
            <img class="disc-avatar-img hidden" alt="avatar" width="32" height="32" decoding="async">
            <span class="disc-avatar-emoji"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          </span>
          <span class="disc-dot hidden"></span>
        </button>

        <div class="user-dropdown" id="user-dropdown" role="menu">
          ${typeof window<"u"&&window._pwaInstallPrompt?`
          <button class="btn-install-pwa" id="pwa-install-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Install App
          </button>`:""}
          ${D.map(e=>`<button class="dropdown-item" data-section="${e.id}">${e.icon} ${e.label}</button>
             <div class="accordion-panel" id="panel-${e.id}"></div>`).join("")}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" data-action="logout"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2V4z"/></svg> Logout</button>
        </div>
      </div>`}async init(){this.dropdown=document.getElementById("user-dropdown"),this.btn=document.getElementById("user-menu-btn"),!(!this.dropdown||!this.btn)&&(this.attachMenuHandlers(),this.attachButtonHandlers(),this.attachGlobalHandlers(),this.syncAvatar(),this.loadActiveTheme(),this.restoreDarkMode(),await this.hydrateUserProfile(),await this.initPricingModal(),window.addEventListener("statusChanged",e=>{const{status:t}=e.detail||{};t&&(this.currentUser&&(this.currentUser.community_status=t,this.currentUser.status=t),this.updateStatusRing(t),document.querySelectorAll(".status-option-btn").forEach(i=>{i.classList.toggle("active",i.dataset.status===t)}))}))}attachMenuHandlers(){this.dropdown.addEventListener("click",e=>{const t=e.target.closest(".dropdown-item[data-section]"),i=e.target.closest(".dropdown-item[data-action]");e.target.closest("#pwa-install-menu-btn")?this.handlePwaInstall():t?this.handleSectionClick(t.dataset.section):(i==null?void 0:i.dataset.action)==="logout"&&this.handleLogout()})}async handlePwaInstall(){var e,t;if(window._pwaInstallPrompt){try{window._pwaInstallPrompt.prompt();const{outcome:i}=await window._pwaInstallPrompt.userChoice;i==="accepted"&&(window._pwaInstallPrompt=null,(e=document.getElementById("pwa-install-menu-btn"))==null||e.remove(),(t=this.app)==null||t.showToast("App installed successfully! 🎉","success"))}catch(i){console.error("[PWA] Install prompt error:",i)}this.toggleDropdown(!1)}}attachButtonHandlers(){this.btn.addEventListener("click",e=>{e.stopPropagation();const t=this.btn.getAttribute("aria-expanded")==="true";this.toggleDropdown(!t),t||this.collapseAllSections(),this.syncAvatar()})}attachGlobalHandlers(){document.addEventListener("click",e=>{!this.btn.contains(e.target)&&!this.dropdown.contains(e.target)&&this.toggleDropdown(!1)}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(this.toggleDropdown(!1),this.closePricingModal())})}toggleDropdown(e){this.btn.setAttribute("aria-expanded",e),this.dropdown.classList.toggle("active",e)}async initPricingModal(){if(await new Promise(e=>requestAnimationFrame(e)),!document.getElementById("pricing-modal-overlay")){document.documentElement.insertAdjacentHTML("afterbegin",ie());const e=document.getElementById("pricing-modal-overlay");e.querySelector(".pricing-close").addEventListener("click",()=>this.closePricingModal()),e.addEventListener("click",i=>{i.target===e&&this.closePricingModal()})}}collapseAllSections(){document.querySelectorAll(".accordion-panel").forEach(e=>{e.classList.remove("active"),e.dataset.filled=""})}handleSectionClick(e){if(e==="billing"){this.showPricingModal();return}const t=document.getElementById(`panel-${e}`);if(!t)return;const i=t.classList.contains("active");this.collapseAllSections(),i||(t.classList.add("active"),t.dataset.filled||(this.renderSection(e,t),t.dataset.filled="1"))}renderSection(e,t){var o;const i={profile:()=>{t.innerHTML=z(this.currentUser),this.attachProfileHandlers()},skins:()=>{t.innerHTML=H(this.app),this.attachSkinsHandlers()},notifications:()=>{t.innerHTML=q(),this.attachNotificationsHandlers()},about:()=>{t.innerHTML=Q()},rules:()=>{t.innerHTML=W(),this.attachRulesHandlers(t)},contact:()=>{t.innerHTML=ee()},export:()=>{t.innerHTML=te()}};(o=i[e])==null||o.call(i)}attachProfileHandlers(){var t,i,o;const e=document.getElementById("icon-picker-modal");(t=document.getElementById("open-icon-picker-btn"))==null||t.addEventListener("click",()=>{e&&(e.style.display="flex")}),(i=document.getElementById("close-icon-picker-btn"))==null||i.addEventListener("click",()=>{e&&(e.style.display="none")}),e==null||e.addEventListener("click",a=>{a.target===e&&(e.style.display="none")}),document.querySelectorAll(".avatar-icon-btn").forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.value,r=document.getElementById("profile-emoji"),l=document.querySelector(".profile-avatar-emoji"),c=document.getElementById("profile-avatar-img");r&&(r.value=s),l&&(l.innerHTML=x(s)),c&&(c.style.display="none",l.style.display="block"),document.querySelectorAll(".avatar-icon-btn").forEach(d=>d.classList.remove("selected")),a.classList.add("selected"),e&&(e.style.display="none")})}),this.attachListener("avatar-upload","change",()=>this.handleAvatarUpload()),this.attachListener("save-profile-btn","click",()=>this.saveQuickProfile()),this.attachListener("delete-account-btn","click",()=>this.showDeleteAccountModal()),document.querySelectorAll(".status-option-btn").forEach(a=>{a.addEventListener("click",()=>this.setStatus(a.dataset.status,a.dataset.color,a.dataset.label))}),this.updateStatusRing(((o=this.currentUser)==null?void 0:o.community_status)||"offline")}async handleAvatarUpload(){var i;const e=document.getElementById("avatar-upload").files[0];if(!e)return;if(e.size>p.CONFIG.MAX_AVATAR_SIZE){this.app.showToast("Image > 5 MB","error");return}const t=new FileReader;t.onload=o=>{const a=document.getElementById("profile-avatar-img"),s=document.querySelector(".profile-avatar-emoji");a&&(a.src=o.target.result,a.style.display="block"),s&&(s.style.display="none")},t.readAsDataURL(e),this.app.showToast("Uploading photo...","info");try{const o=(i=this.currentUser)==null?void 0:i.id;if(!o){this.app.showToast("Not logged in","error");return}const a=e.name.split(".").pop().toLowerCase()||"jpg",s=`avatars/${o}.${a}`,{error:r}=await g.storage.from("community-avatars").upload(s,e,{upsert:!0,contentType:e.type});if(r){this.app.showToast("Upload failed - please try again","error");return}const{data:l}=g.storage.from("community-avatars").getPublicUrl(s),c=l!=null&&l.publicUrl?`${l.publicUrl}?t=${Date.now()}`:null;if(!c){this.app.showToast("Upload failed - please try again","error");return}const d=document.getElementById("profile-avatar-img");d&&(d.src=c);const{error:u}=await g.from("profiles").upsert({id:o,avatar_url:c},{onConflict:"id"});if(u){this.app.showToast("Photo uploaded but profile save failed","warning");return}this.currentUser&&(this.currentUser.avatar_url=c),localStorage.setItem(`profile_${o}`,JSON.stringify({...JSON.parse(localStorage.getItem(`profile_${o}`)||"{}"),avatar_url:c})),this.syncAvatar(),this.app.showToast("Profile photo updated","success")}catch(o){console.error("handleAvatarUpload error:",o),this.app.showToast("Upload failed - please try again","error")}}async saveQuickProfile(){var o,a,s,r,l,c,d,u,h;if(this.saveProfileLock)return;this.saveProfileLock=!0;const e=(o=this.currentUser)==null?void 0:o.id;if(!e)return this.saveProfileLock=!1,this.app.showToast("Not logged in","error");const t={name:((a=document.getElementById("profile-name"))==null?void 0:a.value.trim())||null,email:((s=document.getElementById("profile-email"))==null?void 0:s.value.trim())||null,phone:((r=document.getElementById("profile-phone"))==null?void 0:r.value.trim())||null,birthday:((l=document.getElementById("profile-birthday"))==null?void 0:l.value)||null,emoji:((c=document.getElementById("profile-emoji"))==null?void 0:c.value)||'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',country:((d=document.getElementById("profile-country"))==null?void 0:d.value.trim())||null,community_status:((u=this.currentUser)==null?void 0:u.community_status)||"online"};let i=!1;try{const{error:m}=await g.from("profiles").upsert({id:e,...t},{onConflict:"id"});m||(i=!0)}catch(m){console.warn("Profile save failed",m)}localStorage.setItem(`profile_${e}`,JSON.stringify(t)),Object.assign(this.currentUser,t),this.syncAvatar(),window.dispatchEvent(new CustomEvent("avatarChanged",{detail:{userId:e,emoji:t.emoji,avatarUrl:t.avatar_url||((h=this.currentUser)==null?void 0:h.avatar_url)||null}})),this.app.showToast(i?'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Profile saved':'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Saved locally',i?"success":"warning"),this.saveProfileLock=!1}async hydrateUserProfile(){var i;const e=(i=this.currentUser)==null?void 0:i.id;if(!e)return;let t=null;try{const{data:o,error:a}=await g.from("profiles").select("*").eq("id",e).single();!a&&o&&(t=o)}catch(o){console.warn("Profile fetch error",o)}if(!t)try{t=JSON.parse(localStorage.getItem(`profile_${e}`))}catch(o){console.warn("localStorage parse error",o)}t&&(["name","email","phone","birthday","emoji","avatar_url","country","community_status"].forEach(o=>{t[o]!==void 0&&(this.currentUser[o]=t[o])}),this.syncAvatar(),this.updateStatusRing(this.currentUser.community_status||"offline"))}attachSkinsHandlers(){this.attachListener("dark-mode-toggle","change",e=>this.handleDarkModeToggle(e.target.checked)),document.querySelectorAll(".theme-toggle").forEach(e=>{e.addEventListener("change",t=>{t.target.checked?(document.querySelectorAll(".theme-toggle").forEach(i=>{i!==t.target&&(i.checked=!1)}),this.switchTheme(t.target.dataset.theme)):t.target.checked=!0})})}handleDarkModeToggle(e){var o;document.body.classList.toggle("dark-mode",e),localStorage.setItem("darkMode",e?"enabled":"disabled");const t=localStorage.getItem("activeTheme")||"default";t!=="default"&&p.THEME_CLASSES.has(t)?window.removeDarkSkin():e?window.loadDarkSkin():window.removeDarkSkin(),t==="matrix-code"&&((o=window.app)!=null&&o.initMatrixRain)&&setTimeout(()=>window.app.initMatrixRain(),50)}switchTheme(e){var i,o;const t=localStorage.getItem("darkMode")==="enabled";if(window.removeSkin(),window.removeDarkSkin(),document.body.classList.remove(...p.THEME_CLASSES,"dark-mode"),(i=document.querySelector(".matrix-rain-container"))==null||i.remove(),window.matrixRain&&window.matrixRain.destroy(),localStorage.setItem("activeTheme",e),e==="default"){t&&(document.body.classList.add("dark-mode"),window.loadDarkSkin());return}document.body.classList.add(e),t&&document.body.classList.add("dark-mode"),window.loadSkin(e),e==="matrix-code"&&(window.matrixRain&&window.matrixRain.init(),(o=window.app)!=null&&o.initMatrixRain&&setTimeout(()=>window.app.initMatrixRain(),p.CONFIG.THEME_INIT_DELAY))}loadActiveTheme(){try{const e=localStorage.getItem("activeTheme");e&&e!=="default"&&setTimeout(()=>this.switchTheme(e),p.CONFIG.THEME_INIT_DELAY)}catch{localStorage.setItem("activeTheme","default")}}restoreDarkMode(){const e=localStorage.getItem("darkMode")==="enabled",t=localStorage.getItem("activeTheme")||"default";document.body.classList.toggle("dark-mode",e),t==="default"&&e&&window.loadDarkSkin();const i=document.getElementById("dark-mode-toggle");i&&(i.checked=e)}async attachNotificationsHandlers(){await this.hydrateNotificationSettings();const e=document.getElementById("master-notifications-toggle"),t=document.getElementById("notification-options"),i=document.getElementById("notification-start-time"),o=document.getElementById("notification-end-time"),a=document.getElementById("notification-frequency"),s=document.getElementById("timezone-display");let r;s&&(s.textContent=Intl.DateTimeFormat().resolvedOptions().timeZone);const l=()=>{clearTimeout(r),r=setTimeout(()=>this.saveNotificationSettings(),p.CONFIG.AUTOSAVE_DELAY)},c=()=>{if(!(i!=null&&i.value)||!(o!=null&&o.value))return;const d=this.calculateTimeWindowHours(i.value,o.value),u=document.getElementById("frequency-warning");u&&(u.style.display=d<p.CONFIG.MIN_NOTIFICATION_WINDOW&&a.value==="full"?"block":"none")};e==null||e.addEventListener("change",async d=>{if(d.target.checked){if(!await this.enablePushNotifications()){d.target.checked=!1;return}this.toggleNotificationOptions(t,!0)}else await this.disablePushNotifications(),this.toggleNotificationOptions(t,!1);l()}),i==null||i.addEventListener("change",()=>{this.validateTimeWindow(i,o)&&(c(),l())}),o==null||o.addEventListener("change",()=>{this.validateTimeWindow(i,o)&&(c(),l())}),a==null||a.addEventListener("change",()=>{c(),l();const d=document.getElementById("frequency-explanation");d&&(d.innerHTML=this.renderFrequencyExplanationHTML(a.value))}),this.attachListener("save-notification-settings","click",()=>{this.validateTimeWindow(i,o)&&(clearTimeout(r),this.saveNotificationSettings())}),c()}calculateTimeWindowHours(e,t){const i=o=>{const[a,s]=o.split(":").map(Number);return a*60+s};return(i(t)-i(e))/60}validateTimeWindow(e,t){if(!(e!=null&&e.value)||!(t!=null&&t.value))return!0;const i=this.timeToMinutes(e.value)<this.timeToMinutes(t.value),o=document.getElementById("time-validation-warning");return o&&(o.style.display=i?"none":"block"),i||this.app.showToast("Start time must be before end time","warning"),i}timeToMinutes(e){const[t,i]=e.split(":").map(Number);return t*60+i}toggleNotificationOptions(e,t){e&&(e.style.opacity=t?"1":".4",e.style.pointerEvents=t?"auto":"none")}async enablePushNotifications(){var e,t,i;if(!((e=this.currentUser)!=null&&e.id))return this.app.showToast("Please log in to enable notifications","error"),!1;if(!("serviceWorker"in navigator)||!("PushManager"in window))return this.app.showToast("Push not supported","error"),!1;try{if(await Notification.requestPermission()!=="granted")return this.app.showToast("Permission denied","error"),!1;const a=await navigator.serviceWorker.ready;let s=await a.pushManager.getSubscription();if(!s){const l=typeof ENV_VAPID_KEY<"u"?ENV_VAPID_KEY:"BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc";s=await a.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(l)})}const r=await fetch("/api/save-sub",{method:"POST",headers:{"Content-Type":"application/json",...((i=(t=this.app.auth)==null?void 0:t.session)==null?void 0:i.access_token)&&{Authorization:`Bearer ${this.app.auth.session.access_token}`}},body:JSON.stringify({...s.toJSON(),user_id:this.currentUser.id})});if(!r.ok){const l=await r.json().catch(()=>({}));throw new Error(l.error||`Save failed (${r.status})`)}return this.app.showToast("Notifications enabled","success"),!0}catch(o){return console.error("enablePushNotifications:",o),this.app.showToast("Enable failed: "+o.message,"error"),!1}}async disablePushNotifications(){this.app.showToast("Notifications disabled","success")}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),o=atob(i);return Uint8Array.from([...o].map(a=>a.charCodeAt(0)))}saveNotificationSettings(){var t,i,o,a;const e={enabled:((t=document.getElementById("master-notifications-toggle"))==null?void 0:t.checked)||!1,window:{start:((i=document.getElementById("notification-start-time"))==null?void 0:i.value)||"07:00",end:((o=document.getElementById("notification-end-time"))==null?void 0:o.value)||"22:00"},frequency:((a=document.getElementById("notification-frequency"))==null?void 0:a.value)||"minimum",timezone:Intl.DateTimeFormat().resolvedOptions().timeZone};localStorage.setItem("notification_settings",JSON.stringify(e)),g.from("notification_prefs").upsert({user_id:this.currentUser.id,prefs:e},{onConflict:"user_id"}).then(({error:s})=>{s?(console.error("Save error:",s),this.app.showToast("Saved locally only","warning")):this.app.showToast("Settings saved","success")})}async hydrateNotificationSettings(){var t;const e=(t=this.currentUser)==null?void 0:t.id;if(e)try{const{data:i}=await g.from("notification_prefs").select("prefs").eq("user_id",e).single();if(i!=null&&i.prefs)localStorage.setItem("notification_settings",JSON.stringify(i.prefs)),this.restoreNotificationUI(i.prefs);else{const o=localStorage.getItem("notification_settings");o&&this.restoreNotificationUI(JSON.parse(o))}}catch(i){console.warn("Settings sync error:",i)}}restoreNotificationUI(e){var l,c;if(!e)return;const t=document.getElementById("master-notifications-toggle"),i=document.getElementById("notification-options"),o=document.getElementById("notification-start-time"),a=document.getElementById("notification-end-time"),s=document.getElementById("notification-frequency"),r=document.getElementById("timezone-display");t&&(t.checked=e.enabled||!1,this.toggleNotificationOptions(i,e.enabled)),o&&((l=e.window)!=null&&l.start)&&(o.value=e.window.start),a&&((c=e.window)!=null&&c.end)&&(a.value=e.window.end),s&&e.frequency&&(s.value=e.frequency),r&&(r.textContent=e.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone)}attachRulesHandlers(e){e.querySelectorAll(".rules-collapse-btn").forEach(t=>{t.addEventListener("click",()=>{const i=e.querySelector("#"+t.dataset.target),o=t.classList.contains("active");t.classList.toggle("active",!o),i.classList.toggle("show",!o)})}),e.querySelectorAll(".rules-category-title").forEach(t=>{t.addEventListener("click",()=>t.parentElement.classList.toggle("open"))})}showPricingModal(){const e=document.getElementById("pricing-modal-overlay");if(!e)return;const t=[...p.THEME_CLASSES].find(i=>document.body.classList.contains(i));t&&e.classList.add(t),document.body.classList.contains("dark-mode")&&e.classList.add("dark-mode"),e.classList.add("show"),document.body.classList.add("blur-behind"),this.attachPricingButtons(e),window.innerWidth<=768&&this.initMobileCarousel()}initMobileCarousel(){const e=document.getElementById("pricing-cards-container"),t=document.querySelectorAll(".pricing-dot"),i=e.querySelectorAll(".pricing-card");e.scrollTo({left:0,behavior:"smooth"});let o=null;const a=()=>(o||(o=i[0].offsetWidth+20),o);e.addEventListener("scroll",()=>{const s=Math.round(e.scrollLeft/a());t.forEach((r,l)=>r.classList.toggle("active",l===s))},{passive:!0}),t.forEach((s,r)=>s.addEventListener("click",()=>{e.scrollTo({left:a()*r,behavior:"smooth"})}))}closePricingModal(){var e;(e=document.getElementById("pricing-modal-overlay"))==null||e.classList.remove("show"),document.body.classList.remove("blur-behind")}attachPricingButtons(e){e.querySelectorAll(".pricing-btn").forEach(t=>t.addEventListener("click",i=>{this.app.startCheckout(i.currentTarget.dataset.plan),this.closePricingModal()},{once:!0}))}updateStatusRing(e="offline"){const t=p.STATUS_COLORS[e]||p.STATUS_COLORS.offline;this.btn&&(this.btn.style.setProperty("--status-ring-color",t),this.btn.classList.add("has-status-ring")),document.querySelectorAll(".status-option-btn").forEach(i=>{i.classList.toggle("active",i.dataset.status===e)})}async setStatus(e,t,i){var s,r,l,c,d;this.currentUser&&(this.currentUser.community_status=e,this.currentUser.status=e),this.updateStatusRing(e),document.querySelectorAll(".status-option-btn").forEach(u=>{u.classList.toggle("active",u.dataset.status===e)});const o=(s=this.currentUser)==null?void 0:s.id;o&&window.ActiveMembers&&window.ActiveMembers.updateMemberStatus(o,e);const a={online:"✨ Available",available:"✨ Available",away:"🌿 Away",silent:"🤫 In Silence",deep:"🧘 Deep Practice",offline:"💤 Offline"};try{if(!o)throw new Error("Not logged in");const u=[g.from("profiles").update({community_status:e}).eq("id",o)];(r=window.CommunityDB)!=null&&r.ready&&u.push(window.CommunityDB.setPresence(e,a[e]||"✨ Available",((c=(l=window.Core)==null?void 0:l.state)==null?void 0:c.currentRoom)||null));const m=(d=(await Promise.all(u))[0])==null?void 0:d.error;if(m)throw m;this.app.showToast(`Status set to ${i}`,"success")}catch(u){console.error("setStatus error:",u),this.app.showToast("Could not update status","error")}window.dispatchEvent(new CustomEvent("statusChanged",{detail:{status:e}}))}syncAvatar(){var s,r;const{avatar_url:e,emoji:t='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'}=this.currentUser||{},i=(s=this.btn)==null?void 0:s.querySelector(".disc-avatar-img"),o=(r=this.btn)==null?void 0:r.querySelector(".disc-avatar-emoji");if(!i||!o)return;const a=e==null?void 0:e.trim();i.classList.toggle("hidden",!a),o.classList.toggle("hidden",!!a),this.btn.classList.toggle("avatar-mode",!!a),a?i.src=e:o.innerHTML=x(t)}showDeleteAccountModal(){document.getElementById("delete-account-modal-overlay")||document.documentElement.insertAdjacentHTML("afterbegin",U());const e=document.getElementById("delete-account-modal-overlay"),t=document.getElementById("delete-account-confirm-input"),i=document.getElementById("delete-account-confirm-btn"),o=document.getElementById("delete-account-cancel-btn");t.value="",i.disabled=!0,e.classList.add("show");const a=()=>{i.disabled=t.value.trim()!=="DELETE"};t.addEventListener("input",a);const s=()=>{e.classList.remove("show"),t.removeEventListener("input",a)};o.addEventListener("click",s,{once:!0}),e.addEventListener("click",r=>{r.target===e&&s()},{once:!0}),i.addEventListener("click",async()=>{t.value.trim()==="DELETE"&&(s(),await this.handleDeleteAccount())},{once:!0}),setTimeout(()=>t.focus(),100)}async handleDeleteAccount(){var t;if((t=this.currentUser)!=null&&t.id){this.toggleDropdown(!1),this.app.showToast("Deleting your account…","info");try{const{data:{session:i}}=await g.auth.getSession();if(!(i!=null&&i.access_token))throw new Error("No active session");const o=await fetch(`${g.supabaseUrl}/functions/v1/delete-account`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${i.access_token}`,apikey:g.supabaseKey}}),a=await o.json();if(!o.ok)throw new Error((a==null?void 0:a.error)||"Deletion failed");localStorage.clear(),sessionStorage.clear(),await g.auth.signOut(),this.app.showToast("Account deleted. Goodbye 🙏","success"),setTimeout(()=>{typeof this.app.logout=="function"?this.app.logout():window.location.reload()},1500)}catch(i){console.error("handleDeleteAccount error:",i),this.app.showToast(`Deletion failed: ${i.message}`,"error")}}}async handleLogout(){var e,t;try{this.toggleDropdown(!1),this.app&&typeof this.app.logout=="function"?await this.app.logout():(console.error("app.logout() not available"),(e=this.app)==null||e.showToast("Logout failed","error"))}catch(i){console.error("Logout error:",i),(t=this.app)==null||t.showToast("Logout error","error")}}renderFrequencyExplanationHTML(e){const t='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>',i='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',o='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',a='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg>';return e==="minimum"?`<div>${t} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${i} <strong>Integration:</strong> Integrating the Day</div>`:`<div>${t} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${o} <strong>Recharge:</strong> Quick reset and Mindfulness</div><div>${a} <strong>Reflect:</strong> Gratitude and Inspiration</div><div>${i} <strong>Integration:</strong> Integrating the Day</div>`}attachListener(e,t,i,o={}){var a;(a=document.getElementById(e))==null||a.addEventListener(t,i,o)}};y(p,"CONFIG",{MAX_AVATAR_SIZE:5242880,AUTOSAVE_DELAY:1500,THEME_INIT_DELAY:100,MIN_NOTIFICATION_WINDOW:6}),y(p,"THEME_CLASSES",new Set(["champagne-gold","royal-indigo","earth-luxury","matrix-code"])),y(p,"STATUS_COLORS",{online:"#6b9b37",available:"#6b9b37",away:"#e53e3e",guiding:"#e53e3e",silent:"#7c3aed",deep:"#1e40af",offline:"#9ca3af"});let C=p;export{C as default};
