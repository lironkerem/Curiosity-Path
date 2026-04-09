const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/controller-B4fR5zRS.js","assets/main-5Sl9vfVp.js","assets/main-Ch1Nciyc.css"])))=>i.map(i=>d[i]);
import{_ as m}from"./main-5Sl9vfVp.js";import{c as v}from"./modal-1yjDmyAf.js";import{a as p}from"./controller-B4fR5zRS.js";import"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";function S(r){const e=window.archetypesEngine,t=e.setActiveShadow(r);if(!t)return p("Shadow journey not found","error");const{modal:n}=v({id:"subShadowJourneyModal",title:`${t.icon} ${t.title}`,subtitle:`${t.tagline}<br><span style="font-size:0.85rem;display:inline-flex;align-items:center;gap:0.25rem;flex-wrap:wrap;word-break:break-word;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:0.85rem;height:0.85rem;vertical-align:middle;"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg> ${t.estimatedTime}</span>`,content:'<div id="sub-shadow-journey-content" style="overflow-y:auto;max-height:calc(90vh - 200px)"></div>',actions:"",onClose:()=>{e.saveUserState(),window.AppController.renderDashboard()}}),a=n.querySelector(".modal-card");a.style.maxWidth="700px",a.style.maxHeight="90vh",d(n)}async function d(r){var c,l;const e=window.archetypesEngine,t=r.querySelector("#sub-shadow-journey-content"),n=e.state.selectedStepIndex,a=e.getActiveJourney();if(!a)return;const s=a.steps.length;if(n>=s)return b(r);const o=e.getStep(n),g=Math.round(n/s*100),u=e.state.answers[o.id]||"";t.innerHTML=`
    <div style="background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset-sm);margin-bottom:var(--spacing-md)">
      <h4 style="margin:0 0 var(--spacing-xs) 0;color:var(--neuro-accent)">${o.title}</h4>
      <p class="muted" style="font-size:0.9rem;margin:0">Step ${n+1} of ${s}</p>
    </div>
    <div class="progress-bar" style="margin:var(--spacing-md) 0"><div class="progress-fill" style="width:${g}%"></div></div>
    <p style="margin-bottom:var(--spacing-md);line-height:1.6">${o.description}</p>
    <div style="background:var(--neuro-bg);padding:var(--spacing-lg);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset);margin:var(--spacing-lg) 0">
      <p style="font-weight:600;margin-bottom:var(--spacing-sm)">${o.prompt}</p>
      <p class="muted" style="font-size:0.9rem;line-height:1.5">${o.guidance}</p>
    </div>
    ${h(o,u)}
    <div class="modal-actions">
      ${n>0?'<button id="step-back" class="btn">Back</button>':'<button id="step-close" class="btn">Close</button>'}
      <button id="step-next" class="btn btn-primary">${n===s-1?"Complete Journey":"Next Step"}</button>
    </div>`,(c=t.querySelector("#step-back"))==null||c.addEventListener("click",()=>{e.previousStep(),d(r)}),(l=t.querySelector("#step-close"))==null||l.addEventListener("click",()=>{e.saveUserState(),r.remove(),window.AppController.renderDashboard()}),t.querySelector("#step-next").addEventListener("click",()=>{const i=y(o,t);if(!i||typeof i=="string"&&i.trim()==="")return p("Please provide a response before continuing.","error");e.submitUserResponse(o.id,i),n<s-1?(e.nextStep(),d(r)):(e.state.selectedStepIndex=s,e.saveUserState(),d(r))})}function h(r,e=""){return r.expectedInputType==="choice"&&r.choices?`<div style="display:grid;grid-template-columns:1fr;gap:var(--spacing-sm);margin:var(--spacing-lg) 0">
      ${r.choices.map(t=>`
        <label class="btn" style="display:block;text-align:left;cursor:pointer;box-shadow:var(--shadow-raised);padding:var(--spacing-md)">
          <input type="radio" name="step-choice" value="${t}" ${e===t?"checked":""}> ${t}
        </label>`).join("")}
    </div>`:`<textarea id="step-textarea" class="form-input" style="min-height:180px;margin:var(--spacing-lg) 0;resize:none" placeholder="Take your time. Write from the heart...">${e}</textarea>`}function y(r,e){var t;if(r.expectedInputType==="choice"){const n=e.querySelector('input[name="step-choice"]:checked');return n?n.value:""}return((t=e.querySelector("#step-textarea"))==null?void 0:t.value.trim())||""}function b(r){const e=window.archetypesEngine,t=e.getActiveJourney(),a=(e.generateIntegrationSummary().journeyType==="shadow",5),s=r.querySelector("#sub-shadow-journey-content");s.innerHTML=`
    <h3 style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Journey Complete</h3>
    <div style="background:var(--neuro-bg);padding:var(--spacing-lg);border-radius:var(--radius-lg);box-shadow:var(--shadow-inset-lg);margin:var(--spacing-lg) 0">
      <p style="margin-bottom:var(--spacing-md);white-space:pre-line">${t.completionMessage}</p>
      <div style="background:var(--neuro-bg);padding:var(--spacing-md);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm);margin-top:var(--spacing-md)">
        <strong>Recommended Practice:</strong><br>${t.recommendedPractice}
      </div>
      <div style="margin-top:var(--spacing-md);padding:var(--spacing-md);background:var(--neuro-bg);border-radius:var(--radius-md);box-shadow:var(--shadow-inset-sm)">
        <strong>XP Earned:</strong> +${e.state.xp} points
      </div>
    </div>
    <div class="modal-actions">
      <button id="complete-journey" class="btn btn-primary">Complete & Earn Light-Particles</button>
    </div>`,s.querySelector("#complete-journey").addEventListener("click",()=>{window.AppController.addLightParticles(a),m(()=>import("./controller-B4fR5zRS.js").then(o=>o.u),__vite__mapDeps([0,1,2])).then(o=>o.showToast(`${t.title} complete! +${a} Light-Particles earned.`)),e.completeJourney(),e.clearUserState(),r.remove(),window.AppController.renderDashboard()})}export{S as openSubShadowJourneyModal,d as renderStep};
