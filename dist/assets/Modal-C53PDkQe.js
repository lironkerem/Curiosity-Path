import{r as x}from"./community-hub-Bv-lWZW8.js";import{a as p}from"./main-BpdiQGYl.js";function r(a){const e=document.createElement("div");return e.textContent=String(a??""),e.innerHTML}const L={set:(a,e)=>{try{localStorage.setItem(a,e)}catch{}},get:a=>{try{return localStorage.getItem(a)}catch{return null}}};function f(a,e=null){const t=document.createElement("div");t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.innerHTML=a,document.body.appendChild(t);const l=document.activeElement;let n=null;const i=()=>{t.style.opacity="0",document.removeEventListener("keydown",n),setTimeout(()=>{t.remove(),l==null||l.focus(),e==null||e()},200)};return n=o=>{o.key==="Escape"&&i()},document.addEventListener("keydown",n),t.addEventListener("click",o=>{o.target===t&&i()}),setTimeout(()=>{const o=t.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');o==null||o.focus()},50),{overlay:t,cleanup:i}}class D{static showConfirm(e,t,l={}){const{title:n="Confirm Action",confirmText:i="Confirm",cancelText:o="Cancel",isDanger:c=!1,icon:s='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}=l,u=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${s}</div>
          <h3 class="modal-title" id="modal-title">${r(n)}</h3>
          <p class="modal-message">${r(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${r(o)}</button>
          <button type="button" class="btn btn-primary modal-confirm ${c?"modal-btn-danger":""}">${r(i)}</button>
        </div>
      </div>`,{overlay:m,cleanup:v}=f(u);m.setAttribute("aria-labelledby","modal-title"),m.querySelector(".modal-cancel").addEventListener("click",v),m.querySelector(".modal-confirm").addEventListener("click",()=>{v(),t==null||t()})}static showPrompt(e,t,l,n={}){const{title:i="Edit Entry",confirmText:o="Save",cancelText:c="Cancel",placeholder:s="Enter text...",icon:u='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',multiline:m=!1}=n,v="modal-prompt-input",E=m?`<textarea id="${v}" class="form-input" rows="4" placeholder="${r(s)}" aria-label="${r(s)}">${r(t||"")}</textarea>`:`<input id="${v}" type="text" class="form-input" placeholder="${r(s)}" aria-label="${r(s)}" value="${r(t||"")}">`,$=`
      <div class="neuro-modal" role="document">
        <div class="modal-header">
          <div class="modal-icon icon-small" aria-hidden="true">${u}</div>
          <h3 class="modal-title" id="modal-title">${r(i)}</h3>
          <p class="modal-message">${r(e)}</p>
        </div>
        <div class="modal-input-wrapper">${E}</div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${r(c)}</button>
          <button type="button" class="btn btn-primary modal-confirm">${r(o)}</button>
        </div>
      </div>`,{overlay:y,cleanup:h}=f($);y.setAttribute("aria-labelledby","modal-title");const b=y.querySelector("input, textarea"),w=()=>{const d=b.value.trim();d&&(h(),l==null||l(d))};setTimeout(()=>{var d;b.focus(),(d=b.select)==null||d.call(b)},100),y.querySelector(".modal-cancel").addEventListener("click",h),y.querySelector(".modal-confirm").addEventListener("click",w),b.addEventListener("keydown",d=>{d.key==="Enter"&&!d.shiftKey&&!m&&(d.preventDefault(),w()),d.key==="Escape"&&h()})}static showAlert(e,t={}){const{title:l="Notice",buttonText:n="OK",type:i="info",icon:o=null}=t,c={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},s=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${o||c[i]||c.info}</div>
          <h3 class="modal-title" id="modal-title">${r(l)}</h3>
          <p class="modal-message">${r(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary modal-confirm" style="width:100%">${r(n)}</button>
        </div>
      </div>`,{overlay:u,cleanup:m}=f(s);u.setAttribute("aria-labelledby","modal-title"),u.querySelector(".modal-confirm").addEventListener("click",m)}}function U(a){var t,l,n,i,o;const e=a.state.currentUser;e.name=(((t=document.getElementById("dropdown-displayname"))==null?void 0:t.value.trim())||"Seeker").slice(0,100),e.email=(((l=document.getElementById("dropdown-email"))==null?void 0:l.value.trim())||"").slice(0,254),e.phone=(((n=document.getElementById("dropdown-phone"))==null?void 0:n.value.trim())||"").slice(0,20),e.birthday=((i=document.getElementById("dropdown-birthday"))==null?void 0:i.value)||"",e.avatarEmoji=((o=document.getElementById("dropdown-emoji"))==null?void 0:o.value)||"",L.set("pc_user",JSON.stringify(e)),k(a),p("Profile saved ✔","success")}function k(a){const e=a.state.currentUser,t=document.getElementById("user-avatar-img"),l=document.getElementById("user-avatar-emoji"),n=document.getElementById("avatar-preview");if(e.avatarFile){if(t&&(t.src=e.avatarFile,t.style.display="block"),l&&(l.style.display="none"),n){n.textContent="";const o=document.createElement("img");o.src=e.avatarFile,o.alt="User avatar",o.width=80,o.height=80,o.style.cssText="width:100%;height:100%;border-radius:50%;object-fit:cover",o.loading="lazy",o.decoding="async",n.appendChild(o)}}else t&&(t.style.display="none"),l&&(l.style.display="block",l.innerHTML=x(e.avatarEmoji||"user")),n&&(n.innerHTML=x(e.avatarEmoji||"user"));const i=document.getElementById("user-name");i&&(i.textContent=e.name||"Seeker")}function N(a){var l,n;const e=(n=(l=document.getElementById("avatar-upload"))==null?void 0:l.files)==null?void 0:n[0];if(!e)return;if(!e.type.startsWith("image/")){p("Please upload an image file","error");return}const t=new FileReader;t.onload=i=>{const o=new Image;o.onload=()=>{const c=document.createElement("canvas");c.width=c.height=50,c.getContext("2d").drawImage(o,0,0,50,50),a.state.currentUser.avatarFile=c.toDataURL("image/png"),a.state.currentUser.avatarEmoji="",k(a)},o.onerror=()=>p("Could not load image","error"),o.src=i.target.result},t.onerror=()=>p("Could not read file","error"),t.readAsDataURL(e)}function g(a,e,t,l){var c;(c=document.getElementById(`${e}-modal`))==null||c.remove();const n=document.createElement("div");n.id=`${e}-modal`,n.className="modal-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-labelledby",`${e}-modal-title`),n.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="${e}-modal-title">${r(t)}</h2>
        <button type="button" class="modal-close-btn" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">${l}</div>
    </div>`,document.body.appendChild(n);const i=document.activeElement,o=()=>{n.remove(),i==null||i.focus()};return n.querySelector(".modal-close-btn").addEventListener("click",o),n.addEventListener("click",s=>{s.target===n&&o()}),document.addEventListener("keydown",function s(u){u.key==="Escape"&&(o(),document.removeEventListener("keydown",s))}),setTimeout(()=>{var s;(s=n.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))==null||s.focus()},50),n._app=a,n}function P(a){const e=g(a,"settings","Settings",S());B(e,a)}function z(a){g(a,"about","About",A())}function O(a){const e=g(a,"contact","Contact us",C());j(e,a)}function F(a){const e=g(a,"billing","Choose your plan",q(a));M(e,a)}const S=()=>`
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
  </div>`,A=()=>`
  <p>Digital Curiosity v1.0<br>
  Built with ❤️ by Aanandoham.<br>
  Licences: MIT (code), CC-BY (images).</p>`,C=()=>`
  <form class="contact-form" novalidate>
    <label for="contact-subject">Subject</label>
    <input id="contact-subject" class="form-input" name="subject" placeholder="Subject" maxlength="150" required>
    <label for="contact-body">Message</label>
    <textarea id="contact-body" class="form-input" name="body" rows="4" placeholder="Your message" maxlength="2000" required></textarea>
    <button type="submit" class="btn btn-primary">Send</button>
  </form>`,q=a=>`
  <div class="plans-grid">
    ${(a.plans||[]).map(e=>`
      <div class="plan-card ${r(e.id)}">
        <div class="plan-price">${r(e.price)}</div>
        <h3>${r(e.name)}</h3>
        <ul>${(e.features||[]).map(t=>`<li>${r(t)}</li>`).join("")}</ul>
        ${a.state.currentUser.plan===e.id?'<span class="badge badge-success">Current</span>':`<button type="button" class="btn btn-primary select-plan-btn" data-plan="${r(e.id)}">Choose</button>`}
      </div>`).join("")}
  </div>`;function B(a,e){var n;const t=a.querySelectorAll(".tab-btn"),l=a.querySelectorAll(".tab-pane");t.forEach(i=>i.addEventListener("click",()=>{var c;const o=i.dataset.tab;["general","privacy","notifs","data"].includes(o)&&(t.forEach(s=>{s.classList.remove("active"),s.setAttribute("aria-selected","false")}),l.forEach(s=>s.classList.remove("active")),i.classList.add("active"),i.setAttribute("aria-selected","true"),(c=a.querySelector(`#${o}`))==null||c.classList.add("active"))})),(n=a.querySelector(".export-data-btn"))==null||n.addEventListener("click",()=>{var i;(i=e.exportUserData)==null||i.call(e)})}function j(a,e){var t;(t=a.querySelector(".contact-form"))==null||t.addEventListener("submit",l=>{var n;l.preventDefault(),(n=e.sendContact)==null||n.call(e,l)})}function M(a,e){a.querySelectorAll(".select-plan-btn").forEach(t=>{t.addEventListener("click",()=>I(e,t.dataset.plan))})}const I=(a,e)=>{p(`Plan "${r(e)}" selected – payment integration needed`,"info")},R=(a,e)=>{var l;if(!["general","privacy","notifs","data"].includes(e))return;const t=a.target.closest(".modal-card");t&&(t.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),a.target.classList.add("active"),t.querySelectorAll(".tab-pane").forEach(n=>n.classList.remove("active")),(l=t.querySelector(`#${e}`))==null||l.classList.add("active"))};export{D as N,z as a,O as b,F as c,U as d,N as e,I as f,P as o,k as r,R as s};
