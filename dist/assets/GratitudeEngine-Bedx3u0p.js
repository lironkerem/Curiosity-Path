var u=Object.defineProperty;var p=(s,t,n)=>t in s?u(s,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[t]=n;var o=(s,t,n)=>p(s,typeof t!="symbol"?t+"":t,n);import{N as c}from"./Modal-RTvCjrt_.js";import"./community-hub-Bv-lWZW8.js";import"./features-lazy-bN0WDG2L.js";import"./main-B116ipzn.js";import"./supabase-k82gbVKr.js";const a=class a{constructor(t){this.app=t,this.cachedEntries=null,this._boundHandler=null}getAllEntries(){const t=this.app.state.data.gratitudeEntries||[],n=t.filter(e=>e.entries&&e.entries.length>0);return n.length!==t.length&&(this.app.state.data.gratitudeEntries=n,this.app.state.saveAppData()),this.cachedEntries=n.sort((e,i)=>new Date(i.timestamp)-new Date(e.timestamp)),this.cachedEntries}getTodayTotal(){return this.app.state.getTodayEntries(a.TYPE).reduce((n,e)=>n+e.entries.length,0)}isDailyQuestComplete(){return this.getTodayTotal()>=a.MAX_ENTRIES}escapeHtml(t){const n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return String(t).replace(/[&<>"']/g,e=>n[e])}parseGratitudes(t){return t.split(`
`).map(n=>n.replace(/^\d+\.\s*/,"").trim()).filter(n=>n.length>0)}countCurrentGratitudes(){const t=document.getElementById("gratitude-input");return t?this.parseGratitudes(t.value).length:0}buildCommunityCTA(){return`
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
    `}render(){const t=document.getElementById("gratitude-tab");if(!t){console.error("GratitudeEngine: gratitude-tab not found");return}const n=this.getAllEntries(),e=this.getTodayTotal(),i=this.isDailyQuestComplete();t.innerHTML=this._getHTML(n,e,i),this.attachHandlers(),this.updateCounter()}_getHTML(t,n,e){return`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          ${this._getHeaderHTML()}
          
          <div class="space-y-6">
            ${this._getInputCardHTML(n,e)}
            ${this._getHistoryCardHTML(t)}
            ${this.buildCommunityCTA()}
          </div>

        </div>
      </div>
      ${this._getStyles()}
    `}_getHeaderHTML(){return`
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavGratitude.webp');
                     --header-title:'';
                     --header-tag:'Log in your gratitudes, as much as possible, to open-up for abundance'">
        <h1>Gratitude Practice</h1>
        <h3>Log in your gratitudes, as much as possible, to open-up for abundance</h3>
        <span class="header-sub"></span>
      </header>
    `}_getInputCardHTML(t,n){return`
      <div class="card">
        <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
          <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">My Gratitudes for Today</h3>
          <span style="display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${n?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(var(--neuro-accent-rgb,102,126,234),0.15);color:var(--neuro-accent);border:1px solid rgba(var(--neuro-accent-rgb,102,126,234),0.3);"}">
            <span id="today-counter">${t}</span><span>/ ${a.MAX_ENTRIES} Quest</span>
          </span>
        </div>

        ${n?this._getQuestCompleteHTML():""}

        <form id="gratitude-form" style="margin-bottom: 1rem;">
          <textarea 
            id="gratitude-input" 
            class="form-input" 
            rows="8" 
            style="resize: vertical;font-family: monospace;"
            placeholder="Today, I am Grateful for..." 
            required
            aria-label="Gratitude entries"
          >1. </textarea>
          
          <div class="gratitude-action-buttons" style="margin-top: 1rem;">
            <button type="button" id="add-one-more-btn" class="btn btn-secondary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add 1 More
            </button>
            <button type="submit" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
              Save my Gratitudes
            </button>
          </div>
        </form>

        ${this._getInspirationHTML()}
      </div>
    `}_getQuestCompleteHTML(){return`
      <div style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
        <p class="text-center" style="color: #22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          Daily quest complete! Keep going if you'd like!
        </p>
      </div>
    `}_getInspirationHTML(){return`
      <div class="gratitude-inspiration-container">
        <p class="suggestion-label" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Need Inspiration?</p>
        <div class="gratitude-inspiration-grid" id="inspiration-grid">
          ${a.INSPIRATION_PROMPTS.map(t=>`
            <button 
              class="suggestion-btn" 
              data-text="${this.escapeHtml(t)}"
              type="button"
            >
              ${this.escapeHtml(t)}
            </button>
          `).join("")}
        </div>
      </div>
    `}_getHistoryCardHTML(t){return`
      <div class="card calc-expandable-card" id="gratitude-collapsible-card">
        <div class="calc-expandable-header" id="gratitude-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">
            My Gratitudes
          </h3>
        </div>
        <div class="calc-expandable-content">
          ${t.length===0?this._getEmptyStateHTML():this._getEntriesListHTML(t)}
        </div>
      </div>
    `}_getEmptyStateHTML(){return`
      <div class="text-center py-12" style="color: var(--neuro-text-light);">
        <div style="display:flex;justify-content:center;margin-bottom:1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <p>Your gratitude list will appear here</p>
      </div>
    `}_getEntriesListHTML(t){return`
      <div class="space-y-6" id="history-entries">
        ${t.slice(0,a.MAX_HISTORY_DISPLAY).map(e=>this._getEntryHTML(e)).join("")}
      </div>
      ${t.length>a.MAX_HISTORY_DISPLAY?`
        <div class="text-center" style="margin-top: 1.5rem;">
          <p class="text-sm" style="color: var(--neuro-text-light);">
            Showing ${a.MAX_HISTORY_DISPLAY} most recent entries
          </p>
        </div>
      `:""}
    `}_getEntryHTML(t){return`
      <div class="journal-entry" style="background: rgba(102,126,234,0.05); border-radius: 12px; padding: 20px; border-left: 4px solid var(--neuro-success);">
        <div class="text-sm" style="color: var(--neuro-text-light);margin-bottom: 0.75rem;">
          ${new Date(t.timestamp).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </div>
        <div class="space-y-2">
          ${t.entries.map((i,r)=>this._getEntryItemHTML(i,r,t.timestamp)).join("")}
        </div>
      </div>
    `}_getEntryItemHTML(t,n,e){return`
      <div class="flex items-start gap-2">
        <span class="text-green-400" style="min-width: 20px;">${n+1}.</span>
        <p class="flex-1" style="color: var(--neuro-text);">${this.escapeHtml(t)}</p>
        <div class="flex gap-2" style="color: var(--neuro-text-light);">
          <button 
            data-action="edit-history" 
            data-timestamp="${e}" 
            data-index="${n}" 
            title="Edit" 
            class="hover:text-white"
            type="button"
            aria-label="Edit entry"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg></button>
          <button 
            data-action="delete-history" 
            data-timestamp="${e}" 
            data-index="${n}" 
            title="Delete" 
            class="hover:text-red-400"
            type="button"
            aria-label="Delete entry"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
        </div>
      </div>
    `}_getStyles(){return`
      <style>
        .gratitude-inspiration-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .calc-expandable-header { 
          padding: 24px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .calc-expandable-header h3 { 
          margin: 0; 
          font-size: 1.1rem; 
          color: var(--neuro-text); 
        }
        .chevron { 
          font-size: 1.5rem; 
          transition: transform var(--transition-normal); 
          color: var(--neuro-accent); 
        }
        .calc-expandable-card.expanded .chevron { 
          transform: rotate(90deg); 
        }
        .calc-expandable-content { 
          max-height: 0; 
          overflow: hidden; 
          transition: max-height var(--transition-slow); 
        }
        .calc-expandable-card.expanded .calc-expandable-content { 
          max-height: 5000px; 
          padding: 0 24px 24px; 
        }

        .gratitude-action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .gratitude-action-buttons .btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .gratitude-inspiration-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .gratitude-action-buttons {
            flex-direction: column;
          }
          .gratitude-action-buttons .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .gratitude-inspiration-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `}attachHandlers(){const t=document.getElementById("gratitude-tab");if(!t)return;this._boundHandler&&t.removeEventListener("click",this._boundHandler),this._boundHandler=i=>this._handleClick(i),t.addEventListener("click",this._boundHandler);const n=document.getElementById("gratitude-form");n==null||n.addEventListener("submit",i=>this.save(i));const e=document.getElementById("gratitude-input");e==null||e.addEventListener("input",()=>this.updateCounter())}_handleClick(t){const n=t.target.closest("[data-action]");if(n){this._handleActionClick(n);return}if(t.target.closest("#add-one-more-btn")){this.addOneMore();return}const e=t.target.closest(".suggestion-btn");if(e){this._handleInspirationClick(e);return}if(t.target.closest("#gratitude-collapsible-header")){this._toggleCollapsible();return}}_handleActionClick(t){const n=t.dataset.action,e=parseInt(t.dataset.index),i=t.dataset.timestamp;switch(n){case"edit-history":this.editHistoryEntry(i,e);break;case"delete-history":this.deleteHistoryEntry(i,e);break}}_handleInspirationClick(t){const n=t.dataset.text,e=document.getElementById("gratitude-input");if(!e)return;const i=this.countCurrentGratitudes(),r=e.value.split(`
`),d=r[r.length-1].trim();d===""||/^\d+\.\s*$/.test(d)?(r[r.length-1]=`${i+1}. ${n}`,e.value=r.join(`
`)):e.value=e.value.trim()+" "+n,e.focus(),this.updateCounter()}_toggleCollapsible(){const t=document.getElementById("gratitude-collapsible-card");t==null||t.classList.toggle("expanded")}addOneMore(){const t=document.getElementById("gratitude-input");if(!t)return;const e=this.countCurrentGratitudes()+1,i=t.value.trim();t.value=i+(i?`
`:"")+`${e}. `,t.focus(),t.setSelectionRange(t.value.length,t.value.length),this.updateCounter()}updateCounter(){const t=document.getElementById("today-counter");if(!t)return;const n=this.countCurrentGratitudes(),e=this.getTodayTotal();t.textContent=e+n}editHistoryEntry(t,n){const e=this.app.state.data.gratitudeEntries.find(r=>r.timestamp===t);if(!e)return;const i=e.entries[n];c.showPrompt("Edit your gratitude entry:",i,r=>{e.entries[n]=r,this.app.state.saveAppData(),this.cachedEntries=null,this.render()},{title:"Edit Gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',placeholder:"I am grateful for..."})}deleteHistoryEntry(t,n){c.showConfirm("Are you sure you want to delete this gratitude entry? This action cannot be undone.",()=>{const e=this.app.state.data.gratitudeEntries.find(i=>i.timestamp===t);e&&(e.entries.splice(n,1),e.entries.length===0&&(this.app.state.data.gratitudeEntries=this.app.state.data.gratitudeEntries.filter(i=>i.timestamp!==t)),this.app.state.saveAppData(),this.cachedEntries=null,this.render())},{title:"Delete Gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',confirmText:"Delete",isDanger:!0})}save(t){t.preventDefault();const n=document.getElementById("gratitude-input"),e=this.parseGratitudes(n.value);if(e.length===0){this.app.showToast("Please write at least one gratitude","warning");return}this.app.state.addEntry(a.TYPE,{entries:e});const i=e.length>1?"s":"";this.app.showToast(`${e.length} gratitude${i} saved!`,"success"),n.value="1. ",this.cachedEntries=null,this.render()}destroy(){const t=document.getElementById("gratitude-tab");this._boundHandler&&t&&(t.removeEventListener("click",this._boundHandler),this._boundHandler=null),this.cachedEntries=null}};o(a,"TYPE","gratitude"),o(a,"MAX_ENTRIES",10),o(a,"MAX_HISTORY_DISPLAY",30),o(a,"INSPIRATION_PROMPTS",["A person who made you smile","A comfortable place you enjoy","Something in nature","A skill or talent you have","A recent act of kindness","A small win you had today"]);let l=a;typeof window<"u"&&(window.GratitudeEngine=l);export{l as default};
