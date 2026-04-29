var L=Object.defineProperty;var $=(n,e,t)=>e in n?L(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var y=(n,e,t)=>$(n,typeof e!="symbol"?e+"":e,t);import{c as B}from"./supabase-DmJIYYE5.js";const T={dev:{url:"https://caayiswyoynmeuimvwyn.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0"},prod:{url:"https://qfbarhxfmzpgbgkaymuk.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}};function j(){try{return"https://qfbarhxfmzpgbgkaymuk.supabase.co"}catch{}return T.prod.url}function O(){try{return"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}catch{}return T.prod.anonKey}const I=j(),z=O(),P={auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:typeof window<"u"?window.localStorage:void 0},global:{headers:{"x-app-name":"digital-curiosity","x-app-version":"1.0.0"}},realtime:{timeout:1e4}};let m=null;try{m=B(I,z,P)}catch(n){console.error("[Supabase] Failed to initialise client:",n)}const u=m;typeof window<"u"&&(window.AppSupabase=m);function E(){return m?!0:(console.error("[Supabase] Client not initialised"),!1)}async function C(){if(!E())return null;try{const{data:{user:n},error:e}=await m.auth.getUser();if(e)throw e;return n}catch(n){return console.error("[Supabase] getCurrentUser failed:",n),null}}async function _(){return!!await C()}async function N(){if(!E())return!1;try{const{error:n}=await m.auth.signOut();if(n)throw n;return!0}catch(n){return console.error("[Supabase] signOut failed:",n),!1}}async function D(){if(!E())return!1;try{const{error:n}=await m.from("user_data").select("count",{count:"exact",head:!0});if(n&&n.code!=="PGRST116")throw n;return!0}catch(n){return console.error("[Supabase] Connection test failed:",n),!1}}function U(){let n=!1;try{n=!0}catch{}return{url:I,usingEnvironmentVariables:n,source:n?"Vite environment":"hardcoded fallback",initialized:!!m}}typeof window<"u"&&window.location.hostname==="localhost"&&(window.__supabase={client:m,config:U(),test:D,getCurrentUser:C,isAuthenticated:_,signOut:N,url:I});const l='xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"',h={user:`<svg ${l}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,aries:`<svg ${l}><path d="M12 20V10c0-3.31-2.69-6-6-6"/><path d="M12 20V10c0-3.31 2.69-6 6-6"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg>`,taurus:`<svg ${l}><circle cx="12" cy="14" r="7"/><path d="M5 9C5 6 7 3 12 3s7 3 7 6"/><path d="M9 9H4"/><path d="M20 9h-5"/></svg>`,gemini:`<svg ${l}><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,cancer:`<svg ${l}><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M4 8c0-2 1-4 4-4"/><path d="M20 16c0 2-1 4-4 4"/></svg>`,leo:`<svg ${l}><circle cx="8" cy="8" r="4"/><path d="M12 8h4a4 4 0 0 1 0 8h-1"/><path d="M15 16v4"/></svg>`,virgo:`<svg ${l}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4V8a6 6 0 0 0-12 0"/><path d="M15 16v4"/><path d="M17 16l1.5 4"/></svg>`,libra:`<svg ${l}><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 16a6 6 0 0 0 12 0"/></svg>`,scorpio:`<svg ${l}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="18" y1="4" x2="18" y2="12"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4"/><polyline points="15 9 18 12 21 9"/></svg>`,sagittarius:`<svg ${l}><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/><line x1="5" y1="19" x2="12" y2="12"/></svg>`,capricorn:`<svg ${l}><path d="M6 20V8a4 4 0 0 1 8 0v4a4 4 0 0 0 4 4h0"/><path d="M18 16l2 2-2 2"/></svg>`,aquarius:`<svg ${l}><path d="M3 10c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/><path d="M3 16c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/></svg>`,pisces:`<svg ${l}><line x1="12" y1="4" x2="12" y2="20"/><path d="M4 8c2 2 4 4 8 4s6-2 8-4"/><path d="M4 16c2-2 4-4 8-4s6 2 8 4"/></svg>`,meditation:`<svg ${l}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M6 17c0-2 2-4 6-4s6 2 6 4"/></svg>`,moon:`<svg ${l}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,sun:`<svg ${l}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,star:`<svg ${l}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,crystal:`<svg ${l}><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></svg>`,butterfly:`<svg ${l}><path d="M12 22V12"/><path d="M12 12C12 12 8 9 4 10c-3 1-3 5 0 6 2 1 5 0 8-4z"/><path d="M12 12C12 12 16 9 20 10c3 1 3 5 0 6-2 1-5 0-8-4z"/><circle cx="12" cy="5" r="2"/></svg>`,leaf:`<svg ${l}><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>`,flower:`<svg ${l}><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>`,om:`<svg ${l}><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 0 8 0"/><circle cx="12" cy="8" r="1"/></svg>`,clover:`<svg ${l}><path d="M12 12c-2-2.5-4-3-6-2s-3 4-1 6 5 2 7-4z"/><path d="M12 12c2-2.5 4-3 6-2s3 4 1 6-5 2-7-4z"/><path d="M12 12c-2.5-2-3-4-2-6s4-3 6-1-2 5-4 7z"/><path d="M12 12c2.5-2 3-4 2-6s-4-3-6-1 2 5 4 7z"/><line x1="12" y1="12" x2="12" y2="22"/></svg>`},A={"👤":"user","♈️":"aries","♉️":"taurus","♊️":"gemini","♋️":"cancer","♌️":"leo","♍️":"virgo","♎️":"libra","♏️":"scorpio","♐️":"sagittarius","♑️":"capricorn","♒️":"aquarius","♓️":"pisces","🧘‍♀️":"meditation","🌙":"moon","☀️":"sun","🌟":"star","🔮":"crystal","🦋":"butterfly","🌿":"leaf","🌸":"flower","🕉️":"om","🍀":"clover"};function b(n){return h[n]||h[A[n]]||h.user}const H=Object.freeze([Object.freeze({title:"FIRST-WINS",badges:Object.freeze([{icon:"🌱",name:"First Step",desc:"do any single action",xp:10,karma:3,rarity:"common"},{icon:"💚",name:"First Gratitude",desc:"log 1 gratitude entry",xp:10,karma:3,rarity:"common"},{icon:"📓",name:"First Journal",desc:"save 1 journal entry",xp:10,karma:3,rarity:"common"},{icon:"⚡",name:"First Energy",desc:"log 1 energy check-in",xp:10,karma:3,rarity:"common"},{icon:"🃏",name:"First Reading",desc:"complete 1 tarot spread",xp:10,karma:3,rarity:"common"},{icon:"🧘",name:"First Meditation",desc:"finish 1 meditation session",xp:10,karma:3,rarity:"common"},{icon:"🛒",name:"First Purchase",desc:"buy anything in Karma Shop",xp:50,karma:3,rarity:"common"}])}),Object.freeze({title:"GRATITUDE",badges:Object.freeze([{icon:"❤️",name:"Gratitude Warrior",desc:"30 entries",xp:50,karma:5,rarity:"uncommon"},{icon:"💕",name:"Gratitude Legend",desc:"100 entries",xp:100,karma:10,rarity:"rare"},{icon:"💖",name:"Gratitude Sage",desc:"200 entries",xp:200,karma:15,rarity:"epic"},{icon:"💘",name:"Gratitude Titan",desc:"500 entries",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"JOURNAL",badges:Object.freeze([{icon:"📓",name:"Journal Keeper",desc:"20 entries",xp:50,karma:5,rarity:"uncommon"},{icon:"📚",name:"Journal Master",desc:"75 entries",xp:100,karma:10,rarity:"rare"},{icon:"📖",name:"Journal Sage",desc:"150 entries",xp:200,karma:15,rarity:"epic"},{icon:"📜",name:"Journal Titan",desc:"400 entries",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"ENERGY",badges:Object.freeze([{icon:"⚡",name:"Energy Tracker",desc:"30 logs",xp:50,karma:5,rarity:"uncommon"},{icon:"🔋",name:"Energy Sage",desc:"100 logs",xp:100,karma:10,rarity:"rare"},{icon:"🔌",name:"Energy Titan",desc:"300 logs",xp:300,karma:15,rarity:"epic"},{icon:"⚡️",name:"Energy Legend",desc:"600 logs",xp:600,karma:30,rarity:"legendary"}])}),Object.freeze({title:"TAROT",badges:Object.freeze([{icon:"🔮",name:"Tarot Apprentice",desc:"10 spreads",xp:25,karma:3,rarity:"common"},{icon:"🃏",name:"Tarot Mystic",desc:"25 spreads",xp:50,karma:5,rarity:"uncommon"},{icon:"🌙",name:"Tarot Oracle",desc:"75 spreads",xp:100,karma:10,rarity:"rare"},{icon:"🧙",name:"Tarot Sage",desc:"150 spreads",xp:200,karma:15,rarity:"epic"},{icon:"🔮",name:"Tarot Titan",desc:"400 spreads",xp:500,karma:30,rarity:"legendary"}])}),Object.freeze({title:"MEDITATION",badges:Object.freeze([{icon:"🧘",name:"Meditation Devotee",desc:"20 sessions",xp:50,karma:5,rarity:"uncommon"},{icon:"🕉️",name:"Meditation Master",desc:"60 sessions",xp:100,karma:10,rarity:"rare"},{icon:"🧘‍♂️",name:"Meditation Sage",desc:"100 sessions",xp:300,karma:15,rarity:"epic"},{icon:"🧘‍♀️",name:"Meditation Titan",desc:"200 sessions",xp:700,karma:30,rarity:"legendary"}])}),Object.freeze({title:"STREAKS",badges:Object.freeze([{icon:"⭐",name:"Perfect Week",desc:"7 days all quests",xp:75,karma:10,rarity:"rare"},{icon:"💎",name:"Dedication",desc:"30-day login",xp:100,karma:15,rarity:"epic"},{icon:"🔱",name:"Unstoppable",desc:"60-day login",xp:150,karma:15,rarity:"epic"},{icon:"👑",name:"Legendary Streak",desc:"100-day login",xp:200,karma:30,rarity:"legendary"}])})]),R=Object.freeze([["Seeker",0],["Practitioner",300],["Adept",800],["Healer",1600],["Master",3200],["Sage",6500],["Enlightened",2e4],["Buddha",5e4],["Light",15e4],["Emptiness",4e5]]),F=Object.freeze({common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"}),q=[{id:"profile",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',label:"Profile"},{id:"skins",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2z"/><path d="M6 11c1.5 0 3 .5 3 2"/><path d="M18 11c-1.5 0-3 .5-3 2"/></svg>',label:"Skins"},{id:"notifications",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',label:"Notifications"},{id:"about",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',label:"About the App"},{id:"rules",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',label:"Rules"},{id:"contact",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',label:"Contact Me"},{id:"export",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',label:"Export Data"},{id:"billing",icon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 11 12 6 7 11"/><polyline points="17 18 12 13 7 18"/></svg>',label:"Pricings"}],J=Object.keys(h).map(n=>`<button type="button" class="avatar-icon-btn" data-value="${n}" title="${n}">${h[n]}<span style="text-transform:capitalize;letter-spacing:.02em;">${n.replace(/-/g," ")}</span></button>`).join(""),v=(n,e,t=!1,i=!1)=>`
  <div class="toggle-switch-container">
    <span class="toggle-switch-label">${e}</span>
    <label class="toggle-switch">
      <input type="checkbox" id="${n}" ${t?"checked":""} ${i?"disabled":""}>
      <span class="toggle-slider"></span>
    </label>
  </div>`,M=(n,e,t)=>`
  <div>
    <label style="font-size:.85rem;display:block;margin-bottom:6px;">${e}</label>
    <input 
      type="time" 
      id="${n}" 
      value="${t}" 
      style="width:100%;padding:8px;border-radius:8px;border:1px solid rgba(0,0,0,.1);">
  </div>`,S=n=>`
  <div class="notification-section">${n}</div>`,V=(n={})=>`
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
            ${b(n.emoji||"user")}
          </span>
        </div>
      </label>
      <!-- Hidden input stores the selected icon key -->
      <input type="hidden" id="profile-emoji" value="${A[n.emoji]||n.emoji||"user"}">
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
          ${J}
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
  </div>`,G=()=>`
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
  </div>`,X=n=>{const e=localStorage.getItem("activeTheme")||"default",t=document.body.classList.contains("dark-mode"),i=n.state?.currentUser?.isAdmin||n.state?.currentUser?.isVip,o=i||n.gamification?.state?.unlockedFeatures?.includes("luxury_champagne_gold_skin"),a=i||n.gamification?.state?.unlockedFeatures?.includes("royal_indigo_skin"),s=i||n.gamification?.state?.unlockedFeatures?.includes("earth_luxury_skin");return`
    <div class="accordion-inner">
      ${v("dark-mode-toggle",'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark Mode',t)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Select Theme</div>
      ${v("theme-default","Default (Neumorphic)",e==="default").replace('id="theme-default"','class="theme-toggle" data-theme="default"')}
      ${v("theme-matrix","Escaping the Matrix",e==="matrix-code").replace('id="theme-matrix"','class="theme-toggle" data-theme="matrix-code"')}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">
      
      <div style="margin-bottom:12px;font-weight:600;">Premium Themes</div>
      ${w("champagne-gold","Champagne Gold",o,e)}
      ${w("royal-indigo","Royal Indigo",a,e)}
      ${w("earth-luxury","Earth Luxury",s,e)}
      
      <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:12px 0;">
      <small style="opacity:.7">Changes apply immediately. Dark mode works with all themes!</small>
    </div>`},w=(n,e,t,i)=>`
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
  </div>`,W=()=>{let n;try{n=JSON.parse(localStorage.getItem("notification_settings"))}catch{n=null}const e={enabled:n?.enabled||!1,window:{start:n?.window?.start||"07:00",end:n?.window?.end||"22:00"},frequency:n?.frequency||"minimum",timezone:n?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone};return localStorage.setItem("notification_settings",JSON.stringify(e)),`
    <div class="accordion-inner">
      <div style="margin-bottom:16px;">
        ${v("master-notifications-toggle",'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> Enable Notifications',e.enabled)}
      </div>

      <div id="notification-options" style="${e.enabled?"":"opacity:.4;pointer-events:none;"}">
        ${Y(e.timezone)}
        ${Z(e.window)}
        ${K(e.frequency)}
        
        <hr style="border:none;height:1px;background:rgba(0,0,0,.1);margin:16px 0;">

        <button class="btn-link" id="save-notification-settings" style="margin-top:12px;">
          <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Settings
        </button>
        <small style="opacity:.6;display:block;margin-top:8px;font-size:.7rem;text-align:center;">
          Auto-saves after changes
        </small>
      </div>
    </div>`},Y=n=>S(`
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
`),Z=n=>S(`
  <h4 style="font-size:.9rem;font-weight:600;margin-bottom:12px;"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Daily Availability Window</h4>
  <p style="font-size:.85rem;opacity:.8;margin-bottom:12px;">
    Set your Daily Window for Notifications
  </p>
  
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:12px;margin-bottom:16px;">
    ${M("notification-start-time","Start Time",n.start)}
    ${M("notification-end-time","End Time",n.end)}
  </div>
  
  <small 
    id="time-validation-warning" 
    style="opacity:.7;display:none;font-size:.75rem;color:#ff9800;">
    <svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Start time must be before end time
  </small>
`),K=n=>S(`
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
  
  ${Q(n)}
`),Q=n=>`
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
  </div>`,ee=()=>`
  <div class="accordion-inner rules-panel">
    ${te()}
    ${ie()}
    ${ne()}
  </div>`,te=()=>`
  <div class="rules-top-card">
    <h4>The Curiosity Path <span style="opacity:.7">by Aanandoham, 2026</span></h4>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
  </div>`,ie=()=>`
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
          ${R.map((n,e)=>`
            <tr>
              <td>L${e+1} - ${n[0]}</td>
              <td>${n[1].toLocaleString()}</td>
            </tr>
          `).join("")}
        </table>
      </div>
    </div>
  </div>`,ne=()=>`
  <button class="rules-collapse-btn" data-target="badges-block">Badges</button>
  <div id="badges-block" class="rules-collapse-content">
    ${H.map(n=>oe(n)).join("")}
  </div>`,oe=n=>`
  <section class="rules-category">
    <h4 class="rules-category-title">${n.title}</h4>
    <div class="rules-grid">
      ${n.badges.map(e=>ae(e)).join("")}
    </div>
  </section>`,ae=n=>`
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
    <div class="rules-card-tag" style="color:${F[n.rarity]}">
      ${n.rarity}
    </div>
  </div>`,se=()=>`
  <div class="accordion-inner">
    <p><strong>The Curiosity Path</strong> by Aanandoham, 2026.</p>
    <p>A digital way for practitioners to continue Spirituality in the 21st Century.</p>
    <p>Built to share tools, practices and ancient wisdom - digitally, from your device.</p>
  </div>`,re=()=>`
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
  </div>`,le=()=>`
  <div class="accordion-inner">
    <button class="btn-link" data-action="export-data">
      Download JSON
    </button>
  </div>`,ce=()=>`
  <div id="pricing-modal-overlay" class="pricing-overlay">
    <div class="pricing-modal">
      <button class="pricing-close" aria-label="Close pricing modal">✕</button>

      <h2 class="pricing-title">Choose Your Path</h2>
      <p class="pricing-sub">Unlock deeper features and support the journey.</p>

      <div class="pricing-cards" id="pricing-cards-container">
        ${x("free","Seeker","$0",["Core gratitude & journal","Daily energy check-ins","Tarot & meditation","Ad-free experience"],!1,"Current Plan")}
        
        ${x("practitioner","Practitioner","$8",["Everything in Seeker","Advanced automations","Premium skins & themes","Cloud backup & sync"],!0,"Upgrade")}
        
        ${x("master","Master","$20",["Everything in Practitioner","1-on-1 monthly call","Custom wellness plans","Priority support"],!1,"Upgrade")}
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
  </div>`,x=(n,e,t,i,o,a)=>`
    <div class="pricing-card ${o?"featured":""}" data-plan="${n}">
      <div class="pricing-badge ${o?"popular":""}">${n==="free"?"Free":n==="master"?"Adept":"Most Popular"}</div>
      <h3>${e}</h3>
      <div class="pricing-price">
        ${t}${n!=="free"?"<span>/month</span>":""}
      </div>
      <ul>
        ${i.map(d=>`<li>${d}</li>`).join("")}
      </ul>
      <button class="pricing-btn ${o?"primary":""}" data-plan="${n}">
        ${a}
      </button>
    </div>`,c=class c{constructor(e){this.app=e,this.btn=null,this.dropdown=null,this.saveProfileLock=!1}get currentUser(){return this.app.state.currentUser}render(){return this.currentUser,`
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
          ${q.map(e=>`<button class="dropdown-item" data-section="${e.id}">${e.icon} ${e.label}</button>
             <div class="accordion-panel" id="panel-${e.id}"></div>`).join("")}
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" data-action="logout"><svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2V4z"/></svg> Logout</button>
        </div>
      </div>`}async init(){this.dropdown=document.getElementById("user-dropdown"),this.btn=document.getElementById("user-menu-btn"),!(!this.dropdown||!this.btn)&&(this.attachMenuHandlers(),this.attachButtonHandlers(),this.attachGlobalHandlers(),this.syncAvatar(),this.loadActiveTheme(),this.restoreDarkMode(),await this.hydrateUserProfile(),window.addEventListener("statusChanged",e=>{const{status:t}=e.detail||{};t&&(this.currentUser&&(this.currentUser.community_status=t,this.currentUser.status=t),this.updateStatusRing(t),document.querySelectorAll(".status-option-btn").forEach(i=>{i.classList.toggle("active",i.dataset.status===t)}))}))}attachMenuHandlers(){this.dropdown.addEventListener("click",e=>{const t=e.target.closest(".dropdown-item[data-section]"),i=e.target.closest(".dropdown-item[data-action]");e.target.closest("#pwa-install-menu-btn")?this.handlePwaInstall():t?this.handleSectionClick(t.dataset.section):i?.dataset.action==="logout"&&this.handleLogout()})}async handlePwaInstall(){if(window._pwaInstallPrompt){try{window._pwaInstallPrompt.prompt();const{outcome:e}=await window._pwaInstallPrompt.userChoice;e==="accepted"&&(window._pwaInstallPrompt=null,document.getElementById("pwa-install-menu-btn")?.remove(),this.app?.showToast("App installed successfully! 🎉","success"))}catch(e){console.error("[PWA] Install prompt error:",e)}this.toggleDropdown(!1)}}attachButtonHandlers(){this.btn.addEventListener("click",e=>{e.stopPropagation();const t=this.btn.getAttribute("aria-expanded")==="true";this.toggleDropdown(!t),t||this.collapseAllSections(),this.syncAvatar()})}attachGlobalHandlers(){document.addEventListener("click",e=>{!this.btn.contains(e.target)&&!this.dropdown.contains(e.target)&&this.toggleDropdown(!1)}),document.addEventListener("keydown",e=>{e.key==="Escape"&&(this.toggleDropdown(!1),this.closePricingModal())})}toggleDropdown(e){this.btn.setAttribute("aria-expanded",e),this.dropdown.classList.toggle("active",e)}async initPricingModal(){if(await new Promise(e=>requestAnimationFrame(e)),!document.getElementById("pricing-modal-overlay")){document.documentElement.insertAdjacentHTML("afterbegin",ce());const e=document.getElementById("pricing-modal-overlay");e.querySelector(".pricing-close").addEventListener("click",()=>this.closePricingModal()),e.addEventListener("click",i=>{i.target===e&&this.closePricingModal()})}}collapseAllSections(){document.querySelectorAll(".accordion-panel").forEach(e=>{e.classList.remove("active"),e.dataset.filled=""})}async handleSectionClick(e){if(e==="billing"){await this.initPricingModal(),this.showPricingModal();return}const t=document.getElementById(`panel-${e}`);if(!t)return;const i=t.classList.contains("active");this.collapseAllSections(),i||(t.classList.add("active"),t.dataset.filled||(this.renderSection(e,t),t.dataset.filled="1"))}renderSection(e,t){({profile:()=>{t.innerHTML=V(this.currentUser),this.attachProfileHandlers()},skins:()=>{t.innerHTML=X(this.app),this.attachSkinsHandlers()},notifications:()=>{t.innerHTML=W(),this.attachNotificationsHandlers()},about:()=>{t.innerHTML=se()},rules:()=>{t.innerHTML=ee(),this.attachRulesHandlers(t)},contact:()=>{t.innerHTML=re()},export:()=>{t.innerHTML=le()}})[e]?.()}attachProfileHandlers(){const e=document.getElementById("icon-picker-modal");document.getElementById("open-icon-picker-btn")?.addEventListener("click",()=>{e&&(e.style.display="flex")}),document.getElementById("close-icon-picker-btn")?.addEventListener("click",()=>{e&&(e.style.display="none")}),e?.addEventListener("click",t=>{t.target===e&&(e.style.display="none")}),document.querySelectorAll(".avatar-icon-btn").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.value,o=document.getElementById("profile-emoji"),a=document.querySelector(".profile-avatar-emoji"),s=document.getElementById("profile-avatar-img");o&&(o.value=i),a&&(a.innerHTML=b(i)),s&&(s.style.display="none",a.style.display="block"),document.querySelectorAll(".avatar-icon-btn").forEach(r=>r.classList.remove("selected")),t.classList.add("selected"),e&&(e.style.display="none")})}),this.attachListener("avatar-upload","change",()=>this.handleAvatarUpload()),this.attachListener("save-profile-btn","click",()=>this.saveQuickProfile()),this.attachListener("delete-account-btn","click",()=>this.showDeleteAccountModal()),document.querySelectorAll(".status-option-btn").forEach(t=>{t.addEventListener("click",()=>{this.setStatus(t.dataset.status,t.dataset.color,t.dataset.label)})}),this.updateStatusRing(this.currentUser?.community_status||"offline")}async handleAvatarUpload(){const e=document.getElementById("avatar-upload").files[0];if(!e)return;if(e.size>c.CONFIG.MAX_AVATAR_SIZE){this.app.showToast("Image > 5 MB","error");return}const t=new FileReader;t.onload=i=>{const o=document.getElementById("profile-avatar-img"),a=document.querySelector(".profile-avatar-emoji");o&&(o.src=i.target.result,o.style.display="block"),a&&(a.style.display="none")},t.readAsDataURL(e),this.app.showToast("Uploading photo...","info");try{const i=this.currentUser?.id;if(!i){this.app.showToast("Not logged in","error");return}const o=e.name.split(".").pop().toLowerCase()||"jpg",a=`avatars/${i}.${o}`,{error:s}=await u.storage.from("community-avatars").upload(a,e,{upsert:!0,contentType:e.type});if(s){console.warn("Avatar upload error:",s.message),this.app.showToast("Upload failed - please try again","error");return}const{data:r}=u.storage.from("community-avatars").getPublicUrl(a),d=r?.publicUrl?`${r.publicUrl}?t=${Date.now()}`:null;if(!d){this.app.showToast("Upload failed - please try again","error");return}const p=document.getElementById("profile-avatar-img");p&&(p.src=d);const{error:g}=await u.from("profiles").upsert({id:i,avatar_url:d},{onConflict:"id"});if(g){console.warn("Profile avatar_url save error:",g.message),this.app.showToast("Photo uploaded but profile save failed","warning");return}this.currentUser&&(this.currentUser.avatar_url=d),localStorage.setItem(`profile_${i}`,JSON.stringify({...JSON.parse(localStorage.getItem(`profile_${i}`)||"{}"),avatar_url:d})),this.syncAvatar(),this.app.showToast("Profile photo updated","success")}catch(i){console.error("handleAvatarUpload error:",i),this.app.showToast("Upload failed - please try again","error")}}async saveQuickProfile(){if(this.saveProfileLock)return;this.saveProfileLock=!0;const e=this.currentUser?.id;if(!e)return this.saveProfileLock=!1,this.app.showToast("Not logged in","error");const t={name:document.getElementById("profile-name")?.value.trim()||null,email:document.getElementById("profile-email")?.value.trim()||null,phone:document.getElementById("profile-phone")?.value.trim()||null,birthday:document.getElementById("profile-birthday")?.value||null,emoji:document.getElementById("profile-emoji")?.value||'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',country:document.getElementById("profile-country")?.value.trim()||null,community_status:this.currentUser?.community_status||"online"};let i=!1;try{const{error:o}=await u.from("profiles").upsert({id:e,...t},{onConflict:"id"});o||(i=!0)}catch(o){console.warn("Profile save failed",o)}localStorage.setItem(`profile_${e}`,JSON.stringify(t)),Object.assign(this.currentUser,t),this.syncAvatar(),window.dispatchEvent(new CustomEvent("avatarChanged",{detail:{userId:e,emoji:t.emoji,avatarUrl:t.avatar_url||this.currentUser?.avatar_url||null}})),this.app.showToast(i?'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Profile saved':'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Saved locally',i?"success":"warning"),this.saveProfileLock=!1}async hydrateUserProfile(){const e=this.currentUser?.id;if(!e)return;let t=null;try{const{data:i,error:o}=await u.from("profiles").select("*").eq("id",e).single();!o&&i&&(t=i)}catch(i){console.warn("Profile fetch error",i)}if(!t)try{t=JSON.parse(localStorage.getItem(`profile_${e}`))}catch(i){console.warn("localStorage parse error",i)}t&&(["name","email","phone","birthday","emoji","avatar_url","country","community_status"].forEach(i=>{t[i]!==void 0&&(this.currentUser[i]=t[i])}),this.syncAvatar(),this.updateStatusRing(this.currentUser.community_status||"offline"))}attachSkinsHandlers(){this.attachListener("dark-mode-toggle","change",e=>{this.handleDarkModeToggle(e.target.checked)}),document.querySelectorAll(".theme-toggle").forEach(e=>{e.addEventListener("change",t=>{t.target.checked?(document.querySelectorAll(".theme-toggle").forEach(i=>{i!==t.target&&(i.checked=!1)}),this.switchTheme(t.target.dataset.theme)):t.target.checked=!0})})}handleDarkModeToggle(e){document.body.classList.toggle("dark-mode",e);const t=document.getElementById("dark-mode-css");t&&(t.media=e?"all":"not all"),localStorage.setItem("darkMode",e?"enabled":"disabled"),localStorage.getItem("activeTheme")==="matrix-code"&&window.app?.initMatrixRain&&setTimeout(()=>window.app.initMatrixRain(),50)}switchTheme(e){if(e!=="default"){const o=document.getElementById("dark-mode-css");o&&(o.media="not all")}document.body.classList.remove(...c.THEME_CLASSES),document.querySelectorAll('link[id^="skin_"]').forEach(o=>o.media="not all"),document.querySelectorAll("link[data-premium-theme]").forEach(o=>o.remove());const t=document.querySelector(".matrix-rain-container");if(t&&t.remove(),window.matrixRain&&window.matrixRain.destroy(),localStorage.setItem("activeTheme",e),e==="default"){const o=document.getElementById("dark-mode-css");o&&(o.media=localStorage.getItem("darkMode")==="enabled"?"all":"not all");return}document.body.classList.add(e);const i=document.getElementById("skin_"+e);if(i)i.media="all";else{const o=document.createElement("link");o.rel="stylesheet",o.href=`./src/styles/Skins/${e}.css`,o.setAttribute("data-premium-theme",e),document.head.appendChild(o)}e==="matrix-code"&&(window.matrixRain&&window.matrixRain.init(),window.app?.initMatrixRain&&setTimeout(()=>window.app.initMatrixRain(),c.CONFIG.THEME_INIT_DELAY))}loadActiveTheme(){try{const e=localStorage.getItem("activeTheme");e&&e!=="default"&&setTimeout(()=>this.switchTheme(e),c.CONFIG.THEME_INIT_DELAY)}catch{localStorage.setItem("activeTheme","default")}}restoreDarkMode(){const e=localStorage.getItem("darkMode")==="enabled";document.body.classList.toggle("dark-mode",e);const t=document.getElementById("dark-mode-css"),i=document.getElementById("dark-mode-toggle");t&&(t.media=e?"all":"not all"),i&&(i.checked=e)}async attachNotificationsHandlers(){await this.hydrateNotificationSettings();const e=document.getElementById("master-notifications-toggle"),t=document.getElementById("notification-options"),i=document.getElementById("notification-start-time"),o=document.getElementById("notification-end-time"),a=document.getElementById("notification-frequency"),s=document.getElementById("timezone-display");let r;s&&(s.textContent=Intl.DateTimeFormat().resolvedOptions().timeZone);const d=()=>{clearTimeout(r),r=setTimeout(()=>this.saveNotificationSettings(),c.CONFIG.AUTOSAVE_DELAY)},p=()=>{if(!i?.value||!o?.value)return;const g=this.calculateTimeWindowHours(i.value,o.value),f=document.getElementById("frequency-warning");f&&(f.style.display=g<c.CONFIG.MIN_NOTIFICATION_WINDOW&&a.value==="full"?"block":"none")};e?.addEventListener("change",async g=>{if(g.target.checked){if(!await this.enablePushNotifications()){g.target.checked=!1;return}this.toggleNotificationOptions(t,!0)}else await this.disablePushNotifications(),this.toggleNotificationOptions(t,!1);d()}),i?.addEventListener("change",()=>{this.validateTimeWindow(i,o)&&(p(),d())}),o?.addEventListener("change",()=>{this.validateTimeWindow(i,o)&&(p(),d())}),a?.addEventListener("change",()=>{p(),d();const g=document.getElementById("frequency-explanation");g&&(g.innerHTML=this.renderFrequencyExplanationHTML(a.value))}),this.attachListener("save-notification-settings","click",()=>{this.validateTimeWindow(i,o)&&(clearTimeout(r),this.saveNotificationSettings())}),p()}calculateTimeWindowHours(e,t){const i=o=>{const[a,s]=o.split(":").map(Number);return a*60+s};return(i(t)-i(e))/60}validateTimeWindow(e,t){if(!e?.value||!t?.value)return!0;const i=this.timeToMinutes(e.value)<this.timeToMinutes(t.value),o=document.getElementById("time-validation-warning");return o&&(o.style.display=i?"none":"block"),i||this.app.showToast("Start time must be before end time","warning"),i}timeToMinutes(e){const[t,i]=e.split(":").map(Number);return t*60+i}toggleNotificationOptions(e,t){e&&(e.style.opacity=t?"1":".4",e.style.pointerEvents=t?"auto":"none")}async enablePushNotifications(){if(!this.currentUser?.id)return this.app.showToast("Please log in to enable notifications","error"),!1;if(!("serviceWorker"in navigator)||!("PushManager"in window))return this.app.showToast("Push not supported","error"),!1;try{if(await Notification.requestPermission()!=="granted")return this.app.showToast("Permission denied","error"),!1;const t=await navigator.serviceWorker.ready;let i=await t.pushManager.getSubscription();if(!i){const s=typeof ENV_VAPID_KEY<"u"?ENV_VAPID_KEY:"BGC3GSs75wSk-IXvSHfsmr725CJnQxNuYJHExJZ113yITzwPgAZrVe6-IGyD1zC_t5mtH3-HG1P4GndS8PnSrOc";i=await t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:this.urlBase64ToUint8Array(s)})}const o={...i.toJSON(),user_id:this.currentUser.id},a=await fetch("/api/save-sub",{method:"POST",headers:{"Content-Type":"application/json",...this.app.auth?.session?.access_token&&{Authorization:`Bearer ${this.app.auth.session.access_token}`}},body:JSON.stringify(o)});if(!a.ok){const s=await a.json().catch(()=>({}));throw new Error(s.error||`Save failed (${a.status})`)}return this.app.showToast("Notifications enabled","success"),!0}catch(e){return console.error("enablePushNotifications:",e),this.app.showToast("Enable failed: "+e.message,"error"),!1}}async disablePushNotifications(){this.app.showToast("Notifications disabled","success")}urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),i=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),o=atob(i);return Uint8Array.from([...o].map(a=>a.charCodeAt(0)))}saveNotificationSettings(){const e=Intl.DateTimeFormat().resolvedOptions().timeZone,t={enabled:document.getElementById("master-notifications-toggle")?.checked||!1,window:{start:document.getElementById("notification-start-time")?.value||"07:00",end:document.getElementById("notification-end-time")?.value||"22:00"},frequency:document.getElementById("notification-frequency")?.value||"minimum",timezone:e};localStorage.setItem("notification_settings",JSON.stringify(t)),u.from("notification_prefs").upsert({user_id:this.currentUser.id,prefs:t},{onConflict:"user_id"}).then(({error:i})=>{i?(console.error("Save error:",i),this.app.showToast("Saved locally only","warning")):this.app.showToast("Settings saved","success")})}async hydrateNotificationSettings(){const e=this.currentUser?.id;if(e)try{const{data:t,error:i}=await u.from("notification_prefs").select("prefs").eq("user_id",e).single();if(t?.prefs)localStorage.setItem("notification_settings",JSON.stringify(t.prefs)),this.restoreNotificationUI(t.prefs);else{const o=localStorage.getItem("notification_settings");o&&this.restoreNotificationUI(JSON.parse(o))}}catch(t){console.warn("Settings sync error:",t)}}restoreNotificationUI(e){if(!e)return;const t=document.getElementById("master-notifications-toggle"),i=document.getElementById("notification-options"),o=document.getElementById("notification-start-time"),a=document.getElementById("notification-end-time"),s=document.getElementById("notification-frequency"),r=document.getElementById("timezone-display");t&&(t.checked=e.enabled||!1,this.toggleNotificationOptions(i,e.enabled)),o&&e.window?.start&&(o.value=e.window.start),a&&e.window?.end&&(a.value=e.window.end),s&&e.frequency&&(s.value=e.frequency),r&&(r.textContent=e.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone)}attachRulesHandlers(e){e.querySelectorAll(".rules-collapse-btn").forEach(t=>{t.addEventListener("click",()=>{const i=e.querySelector("#"+t.dataset.target),o=t.classList.contains("active");t.classList.toggle("active",!o),i.classList.toggle("show",!o)})}),e.querySelectorAll(".rules-category-title").forEach(t=>{t.addEventListener("click",()=>t.parentElement.classList.toggle("open"))})}showPricingModal(){const e=document.getElementById("pricing-modal-overlay");if(!e)return;const t=[...c.THEME_CLASSES].find(i=>document.body.classList.contains(i));t&&e.classList.add(t),document.body.classList.contains("dark-mode")&&e.classList.add("dark-mode"),e.classList.add("show"),document.body.classList.add("blur-behind"),this.attachPricingButtons(e),window.innerWidth<=768&&this.initMobileCarousel()}initMobileCarousel(){const e=document.getElementById("pricing-cards-container"),t=document.querySelectorAll(".pricing-dot"),i=e.querySelectorAll(".pricing-card"),o=i.length?i[0].getBoundingClientRect().width+20:0;e.scrollTo({left:0,behavior:"smooth"}),e.addEventListener("scroll",()=>{if(!o)return;const a=Math.round(e.scrollLeft/o);t.forEach((s,r)=>s.classList.toggle("active",r===a))},{passive:!0}),t.forEach((a,s)=>{a.addEventListener("click",()=>{o&&e.scrollTo({left:o*s,behavior:"smooth"})})})}closePricingModal(){const e=document.getElementById("pricing-modal-overlay");e&&e.classList.remove("show"),document.body.classList.remove("blur-behind")}attachPricingButtons(e){e.querySelectorAll(".pricing-btn").forEach(t=>t.addEventListener("click",i=>{const o=i.currentTarget.dataset.plan;this.app.startCheckout(o),this.closePricingModal()},{once:!0}))}updateStatusRing(e="offline"){const t=c.STATUS_COLORS[e]||c.STATUS_COLORS.offline;this.btn&&(this.btn.style.setProperty("--status-ring-color",t),this.btn.classList.add("has-status-ring")),document.querySelectorAll(".status-option-btn").forEach(i=>{i.classList.toggle("active",i.dataset.status===e)})}async setStatus(e,t,i){this.currentUser&&(this.currentUser.community_status=e,this.currentUser.status=e),this.updateStatusRing(e),document.querySelectorAll(".status-option-btn").forEach(r=>{r.classList.toggle("active",r.dataset.status===e)});const o=this.currentUser?.id;o&&window.ActiveMembers&&window.ActiveMembers.updateMemberStatus(o,e);const s={online:"✨ Available",available:"✨ Available",away:"🌿 Away",silent:"🤫 In Silence",deep:"🧘 Deep Practice",offline:"💤 Offline"}[e]||"✨ Available";try{if(!o)throw new Error("Not logged in");const r=[u.from("profiles").update({community_status:e}).eq("id",o)];window.CommunityDB?.ready&&r.push(window.CommunityDB.setPresence(e,s,window.Core?.state?.currentRoom||null));const p=(await Promise.all(r))[0]?.error;if(p)throw p;this.app.showToast(`Status set to ${i}`,"success")}catch(r){console.error("setStatus error:",r),this.app.showToast("Could not update status","error")}window.dispatchEvent(new CustomEvent("statusChanged",{detail:{status:e}}))}syncAvatar(){const{avatar_url:e,emoji:t='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'}=this.currentUser||{},i=this.btn?.querySelector(".disc-avatar-img"),o=this.btn?.querySelector(".disc-avatar-emoji");if(!i||!o)return;const a=e?.trim();i.classList.toggle("hidden",!a),o.classList.toggle("hidden",!!a),this.btn.classList.toggle("avatar-mode",!!a),a?i.src=e:o.innerHTML=b(t)}showDeleteAccountModal(){document.getElementById("delete-account-modal-overlay")||document.documentElement.insertAdjacentHTML("afterbegin",G());const e=document.getElementById("delete-account-modal-overlay"),t=document.getElementById("delete-account-confirm-input"),i=document.getElementById("delete-account-confirm-btn"),o=document.getElementById("delete-account-cancel-btn");t.value="",i.disabled=!0,e.classList.add("show");const a=()=>{i.disabled=t.value.trim()!=="DELETE"};t.addEventListener("input",a);const s=()=>{e.classList.remove("show"),t.removeEventListener("input",a)};o.addEventListener("click",s,{once:!0}),e.addEventListener("click",r=>{r.target===e&&s()},{once:!0}),i.addEventListener("click",async()=>{t.value.trim()==="DELETE"&&(s(),await this.handleDeleteAccount())},{once:!0}),setTimeout(()=>t.focus(),100)}async handleDeleteAccount(){if(this.currentUser?.id){this.toggleDropdown(!1),this.app.showToast("Deleting your account…","info");try{const{data:{session:t}}=await u.auth.getSession();if(!t?.access_token)throw new Error("No active session");const i=await fetch(`${u.supabaseUrl}/functions/v1/delete-account`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t.access_token}`,apikey:u.supabaseKey}}),o=await i.json();if(!i.ok)throw new Error(o?.error||"Deletion failed");localStorage.clear(),sessionStorage.clear(),await u.auth.signOut(),this.app.showToast("Account deleted. Goodbye 🙏","success"),setTimeout(()=>{typeof this.app.logout=="function"?this.app.logout():window.location.reload()},1500)}catch(t){console.error("handleDeleteAccount error:",t),this.app.showToast(`Deletion failed: ${t.message}`,"error")}}}async handleLogout(){try{this.toggleDropdown(!1),this.app&&typeof this.app.logout=="function"?await this.app.logout():(console.error("app.logout() not available"),this.app?.showToast("Logout failed","error"))}catch(e){console.error("Logout error:",e),this.app?.showToast("Logout error","error")}}renderFrequencyExplanationHTML(e){const t='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/></svg>',i='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',o='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',a='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/></svg>';return e==="minimum"?`<div>${t} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${i} <strong>Integration:</strong> Integrating the Day</div>`:`<div>${t} <strong>Awakening:</strong> Checking-in and Focusing</div><div>${o} <strong>Recharge:</strong> Quick reset and Mindfulness</div><div>${a} <strong>Reflect:</strong> Gratitude and Inspiration</div><div>${i} <strong>Integration:</strong> Integrating the Day</div>`}attachListener(e,t,i,o={}){document.getElementById(e)?.addEventListener(t,i,o)}};y(c,"CONFIG",{MAX_AVATAR_SIZE:5242880,AUTOSAVE_DELAY:1500,THEME_INIT_DELAY:100,MIN_NOTIFICATION_WINDOW:6}),y(c,"THEME_CLASSES",new Set(["champagne-gold","royal-indigo","earth-luxury","matrix-code"])),y(c,"STATUS_COLORS",{online:"#6b9b37",available:"#6b9b37",away:"#e53e3e",guiding:"#e53e3e",silent:"#7c3aed",deep:"#1e40af",offline:"#9ca3af"});let k=c;const pe=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));export{k as U,pe as a,b as r,u as s};
