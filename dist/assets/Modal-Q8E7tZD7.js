import{r as x}from"./community-hub-CJhlSKys.js";import{showToast as v}from"./Toast-BsKw3S6L.js";import"./vendor-suncalc-BBoG6fSx.js";function l(t){const e=document.createElement("div");return e.textContent=String(t??""),e.innerHTML}const L={set:(t,e)=>{try{localStorage.setItem(t,e)}catch{}},get:t=>{try{return localStorage.getItem(t)}catch{return null}}};function h(t,e=null){const a=document.createElement("div");a.className="modal-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),a.innerHTML=t,document.body.appendChild(a);const i=document.activeElement;let n=null;const r=()=>{a.style.opacity="0",document.removeEventListener("keydown",n),setTimeout(()=>{a.remove(),i?.focus(),e?.()},200)};return n=o=>{o.key==="Escape"&&r()},document.addEventListener("keydown",n),a.addEventListener("click",o=>{o.target===a&&r()}),setTimeout(()=>{a.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()},50),{overlay:a,cleanup:r}}class U{static showConfirm(e,a,i={}){const{title:n="Confirm Action",confirmText:r="Confirm",cancelText:o="Cancel",isDanger:s=!1,icon:c='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}=i,m=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${c}</div>
          <h3 class="modal-title" id="modal-title">${l(n)}</h3>
          <p class="modal-message">${l(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${l(o)}</button>
          <button type="button" class="btn btn-primary modal-confirm ${s?"modal-btn-danger":""}">${l(r)}</button>
        </div>
      </div>`,{overlay:d,cleanup:b}=h(m);d.setAttribute("aria-labelledby","modal-title"),d.querySelector(".modal-cancel").addEventListener("click",b),d.querySelector(".modal-confirm").addEventListener("click",()=>{b(),a?.()})}static showPrompt(e,a,i,n={}){const{title:r="Edit Entry",confirmText:o="Save",cancelText:s="Cancel",placeholder:c="Enter text...",icon:m='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',multiline:d=!1}=n,b="modal-prompt-input",E=d?`<textarea id="${b}" class="form-input" rows="4" placeholder="${l(c)}" aria-label="${l(c)}">${l(a||"")}</textarea>`:`<input id="${b}" type="text" class="form-input" placeholder="${l(c)}" aria-label="${l(c)}" value="${l(a||"")}">`,$=`
      <div class="neuro-modal" role="document">
        <div class="modal-header">
          <div class="modal-icon icon-small" aria-hidden="true">${m}</div>
          <h3 class="modal-title" id="modal-title">${l(r)}</h3>
          <p class="modal-message">${l(e)}</p>
        </div>
        <div class="modal-input-wrapper">${E}</div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${l(s)}</button>
          <button type="button" class="btn btn-primary modal-confirm">${l(o)}</button>
        </div>
      </div>`,{overlay:p,cleanup:f}=h($);p.setAttribute("aria-labelledby","modal-title");const y=p.querySelector("input, textarea"),w=()=>{const u=y.value.trim();u&&(f(),i?.(u))};setTimeout(()=>{y.focus(),y.select?.()},100),p.querySelector(".modal-cancel").addEventListener("click",f),p.querySelector(".modal-confirm").addEventListener("click",w),y.addEventListener("keydown",u=>{u.key==="Enter"&&!u.shiftKey&&!d&&(u.preventDefault(),w()),u.key==="Escape"&&f()})}static showAlert(e,a={}){const{title:i="Notice",buttonText:n="OK",type:r="info",icon:o=null}=a,s={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},c=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${o||s[r]||s.info}</div>
          <h3 class="modal-title" id="modal-title">${l(i)}</h3>
          <p class="modal-message">${l(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary modal-confirm" style="width:100%">${l(n)}</button>
        </div>
      </div>`,{overlay:m,cleanup:d}=h(c);m.setAttribute("aria-labelledby","modal-title"),m.querySelector(".modal-confirm").addEventListener("click",d)}}function N(t){const e=t.state.currentUser;e.name=(document.getElementById("dropdown-displayname")?.value.trim()||"Seeker").slice(0,100),e.email=(document.getElementById("dropdown-email")?.value.trim()||"").slice(0,254),e.phone=(document.getElementById("dropdown-phone")?.value.trim()||"").slice(0,20),e.birthday=document.getElementById("dropdown-birthday")?.value||"",e.avatarEmoji=document.getElementById("dropdown-emoji")?.value||"",L.set("pc_user",JSON.stringify(e)),k(t),v("Profile saved ✔","success")}function k(t){const e=t.state.currentUser,a=document.getElementById("user-avatar-img"),i=document.getElementById("user-avatar-emoji"),n=document.getElementById("avatar-preview");if(e.avatarFile){if(a&&(a.src=e.avatarFile,a.style.display="block"),i&&(i.style.display="none"),n){n.textContent="";const o=document.createElement("img");o.src=e.avatarFile,o.alt="User avatar",o.width=80,o.height=80,o.style.cssText="width:100%;height:100%;border-radius:50%;object-fit:cover",o.loading="lazy",o.decoding="async",n.appendChild(o)}}else a&&(a.style.display="none"),i&&(i.style.display="block",i.innerHTML=x(e.avatarEmoji||"user")),n&&(n.innerHTML=x(e.avatarEmoji||"user"));const r=document.getElementById("user-name");r&&(r.textContent=e.name||"Seeker")}function F(t){const e=document.getElementById("avatar-upload")?.files?.[0];if(!e)return;if(!e.type.startsWith("image/")){v("Please upload an image file","error");return}const a=new FileReader;a.onload=i=>{const n=new Image;n.onload=()=>{const r=document.createElement("canvas");r.width=r.height=50,r.getContext("2d").drawImage(n,0,0,50,50),t.state.currentUser.avatarFile=r.toDataURL("image/png"),t.state.currentUser.avatarEmoji="",k(t)},n.onerror=()=>v("Could not load image","error"),n.src=i.target.result},a.onerror=()=>v("Could not read file","error"),a.readAsDataURL(e)}function g(t,e,a,i){document.getElementById(`${e}-modal`)?.remove();const n=document.createElement("div");n.id=`${e}-modal`,n.className="modal-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-labelledby",`${e}-modal-title`),n.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="${e}-modal-title">${l(a)}</h2>
        <button type="button" class="modal-close-btn" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">${i}</div>
    </div>`,document.body.appendChild(n);const r=document.activeElement,o=()=>{n.remove(),r?.focus()};return n.querySelector(".modal-close-btn").addEventListener("click",o),n.addEventListener("click",s=>{s.target===n&&o()}),document.addEventListener("keydown",function s(c){c.key==="Escape"&&(o(),document.removeEventListener("keydown",s))}),setTimeout(()=>{n.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])')?.focus()},50),n._app=t,n}function P(t){const e=g(t,"settings","Settings",S());B(e,t)}function z(t){g(t,"about","About",C())}function O(t){const e=g(t,"contact","Contact us",A());j(e,t)}function R(t){const e=g(t,"billing","Choose your plan",q(t));M(e,t)}const S=()=>`
  <div class="settings-tabs" role="tablist">
    <button type="button" class="tab-btn active" data-tab="general" role="tab" aria-selected="true"  aria-controls="general">General</button>
    <button type="button" class="tab-btn"         data-tab="privacy" role="tab" aria-selected="false" aria-controls="privacy">Privacy</button>
    <button type="button" class="tab-btn"         data-tab="notifs"  role="tab" aria-selected="false" aria-controls="notifs">Notifications</button>
    <button type="button" class="tab-btn"         data-tab="data"    role="tab" aria-selected="false" aria-controls="data">Data</button>
  </div>
  <div id="general" class="tab-pane active" role="tabpanel" aria-labelledby="tab-general">
    <label for="settings-lang">App language</label>
    <select id="settings-lang" class="form-input"><option>English</option></select>
    <label for="settings-theme">Theme</label>
    <select id="settings-theme" class="form-input"><option>Neumorphic Light</option></select>
    <label for="settings-reminder">Daily reminder</label>
    <input id="settings-reminder" type="time" class="form-input" aria-label="Select reminder time">
  </div>
  <div id="privacy" class="tab-pane" role="tabpanel" aria-labelledby="tab-privacy">
    <label><input type="checkbox"> Allow analytics</label>
    <label><input type="checkbox"> Share progress with friends</label>
  </div>
  <div id="notifs" class="tab-pane" role="tabpanel" aria-labelledby="tab-notifs">
    <label><input type="checkbox" checked> Morning quote</label>
    <label><input type="checkbox" checked> Streak reminder</label>
  </div>
  <div id="data" class="tab-pane" role="tabpanel" aria-labelledby="tab-data">
    <p>Download everything we store about you.</p>
    <button type="button" class="btn btn-secondary export-data-btn">Export JSON</button>
  </div>`,C=()=>`
  <p>Digital Curiosity v1.0<br>
  Built with ❤️ by Aanandoham.<br>
  Licences: MIT (code), CC-BY (images).</p>`,A=()=>`
  <form class="contact-form" novalidate>
    <label for="contact-subject">Subject</label>
    <input id="contact-subject" class="form-input" name="subject" placeholder="Subject" maxlength="150" required>
    <label for="contact-body">Message</label>
    <textarea id="contact-body" class="form-input" name="body" rows="4" placeholder="Your message" maxlength="2000" required></textarea>
    <button type="submit" class="btn btn-primary">Send</button>
  </form>`,q=t=>`
  <div class="plans-grid">
    ${(t.plans||[]).map(e=>`
      <div class="plan-card ${l(e.id)}">
        <div class="plan-price">${l(e.price)}</div>
        <h3>${l(e.name)}</h3>
        <ul>${(e.features||[]).map(a=>`<li>${l(a)}</li>`).join("")}</ul>
        ${t.state.currentUser.plan===e.id?'<span class="badge badge-success">Current</span>':`<button type="button" class="btn btn-primary select-plan-btn" data-plan="${l(e.id)}">Choose</button>`}
      </div>`).join("")}
  </div>`;function B(t,e){const a=t.querySelectorAll(".tab-btn"),i=t.querySelectorAll(".tab-pane");a.forEach(n=>n.addEventListener("click",()=>{const r=n.dataset.tab;["general","privacy","notifs","data"].includes(r)&&(a.forEach(o=>{o.classList.remove("active"),o.setAttribute("aria-selected","false")}),i.forEach(o=>o.classList.remove("active")),n.classList.add("active"),n.setAttribute("aria-selected","true"),t.querySelector(`#${r}`)?.classList.add("active"))})),t.querySelector(".export-data-btn")?.addEventListener("click",()=>{e.exportUserData?.()})}function j(t,e){t.querySelector(".contact-form")?.addEventListener("submit",a=>{a.preventDefault(),e.sendContact?.(a)})}function M(t,e){t.querySelectorAll(".select-plan-btn").forEach(a=>{a.addEventListener("click",()=>I(e,a.dataset.plan))})}const I=(t,e)=>{v(`Plan "${l(e)}" selected – payment integration needed`,"info")},J=(t,e)=>{if(!["general","privacy","notifs","data"].includes(e))return;const a=t.target.closest(".modal-card");a&&(a.querySelectorAll(".tab-btn").forEach(i=>i.classList.remove("active")),t.target.classList.add("active"),a.querySelectorAll(".tab-pane").forEach(i=>i.classList.remove("active")),a.querySelector(`#${e}`)?.classList.add("active"))};export{U as NeumorphicModal,C as aboutModalContent,F as avatarUploadHandler,q as billingModalContent,g as buildModal,A as contactModalContent,z as openAbout,R as openBilling,O as openContact,P as openSettings,k as refreshAvatar,N as saveQuickProfile,I as selectPlan,S as settingsModalContent,J as switchSettingTab};
