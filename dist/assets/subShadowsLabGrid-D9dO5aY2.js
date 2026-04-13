const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/controller-CsS69nTC.js","assets/communityHub-D6qpEoMP.js","assets/subShadowJourney-BfGqw4G-.js","assets/modal-1yjDmyAf.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./communityHub-D6qpEoMP.js";import{c}from"./modal-1yjDmyAf.js";import{g as h}from"./controller-CsS69nTC.js";const u=[{id:"hero",title:"Hero",color:"#ef4444"},{id:"lover",title:"Lover",color:"#ec4899"},{id:"warrior",title:"Warrior",color:"#f59e0b"},{id:"sage",title:"Sage",color:"#3b82f6"},{id:"healer",title:"Healer",color:"#22c55e"},{id:"shadow",title:"Shadow",color:"#8b5cf6"}];function g(){const o=`<div class="archetype-grid">
    ${u.map(e=>{const a=h(e.id);return`
        <button class="archetype-card" data-archetype="${e.id}" style="border:2px solid ${e.color}20">
          <div style="font-size:2.2rem;margin-bottom:.4rem">${a}</div>
          <div>${e.title}</div>
        </button>`}).join("")}
  </div>`,{modal:i,closeModal:s}=c({id:"subShadowsLabGridModal",title:"Sub-Shadows Lab",subtitle:"Choose an archetype to see its sub-shadows",content:o,actions:'<button class="btn" id="close-grid-btn">Close</button>'});i.querySelectorAll(".archetype-card").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.archetype;s(),b(a)})}),i.querySelector("#close-grid-btn").addEventListener("click",s)}function b(o){const i=window.archetypesEngine,s=i.getShadowsByArchetype(o),e=i.getCompletedShadows();if(!s.length){l(()=>import("./controller-CsS69nTC.js").then(t=>t.u),__vite__mapDeps([0,1])).then(t=>t.showToast("No sub-shadows for this archetype yet.","info"));return}const a=`
    <div class="scrollable-content" style="max-height:60vh;overflow-y:auto">
      ${s.map(t=>{const r=e.includes(t.id);return`
          <div class="shadow-library-item" data-shadow-id="${t.id}" style="
            padding:var(--spacing-md);border-radius:var(--radius-md);margin-bottom:var(--spacing-sm);
            box-shadow:${r?"var(--shadow-inset)":"var(--shadow-raised)"};
            cursor:pointer;transition:all var(--transition-fast);${r?"opacity:.7":""}">
            <div style="display:flex;align-items:center;gap:var(--spacing-sm)">
              <span style="font-size:1.3rem">${t.icon}</span>
              <strong>${t.title}</strong>
              ${r?'<span style="color:var(--neuro-success);margin-left:auto">✓</span>':""}
            </div>
            <div class="muted" style="font-size:.85rem;margin-top:var(--spacing-xs)">${t.tagline}</div>
          </div>`}).join("")}
    </div>`,{modal:d,closeModal:n}=c({id:"filteredShadowListModal",title:`${h(o)} ${u.find(t=>t.id===o).title} Sub-Shadows`,subtitle:"Pick a shadow to begin its 15-25 min journey",content:a,actions:'<button class="btn" id="close-filtered-btn">Close</button>'});d.querySelectorAll(".shadow-library-item").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.shadowId;n(),l(()=>import("./subShadowJourney-BfGqw4G-.js"),__vite__mapDeps([2,1,3,0])).then(p=>p.openSubShadowJourneyModal(r))})}),d.querySelector("#close-filtered-btn").addEventListener("click",n)}export{g as openSubShadowsLabGrid};
