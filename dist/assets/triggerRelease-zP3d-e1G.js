import{c as F}from"./modal-1yjDmyAf.js";import{a,s as l,b as v,c as S}from"./controller-C7YUD7fi.js";import"./communityHub-Dsl5QNXw.js";function C(i=null){const r=!!i,n={"Fear Based Triggers":["Fear","Anxiety","Panic","Worry","Insecurity","Vulnerability","Helplessness","Overwhelm","Shock","Apprehension"],"Anger Based Triggers":["Anger","Rage","Frustration","Irritation","Resentment","Bitterness","Contempt","Disgust","Hostility","Annoyance"],"Shame Based Triggers":["Shame","Embarrassment","Guilt","Humiliation","Unworthiness","Failure","Self hatred","Regret","Inferiority","Social fear of judgment"],"Sadness Based Triggers":["Sadness","Grief","Disappointment","Loneliness","Abandonment","Hopelessness","Despair","Feeling misunderstood","Feeling unseen","Melancholy"],"Control Based Triggers":["Powerlessness","Lack of control","Uncertainty","Confusion","Jealousy","Envy","Possessiveness","Fear of loss","Distrust"],"Relationship Based Triggers":["Rejection","Betrayal","Neglect","Being ignored","Feeling dismissed","Lack of appreciation","Lack of validation","Feeling replaced","Feeling unwanted","Feeling unimportant"],"Identity Based Triggers":["Feeling attacked","Feeling criticized","Feeling excluded","Feeling misunderstood","Feeling judged","Feeling insufficient","Feeling disrespected","Feeling invisible","Feeling compared","Feeling underestimated"],"Boundary Based Triggers":["Feeling invaded","Feeling controlled","Feeling pressured","Feeling manipulated","Feeling used","Feeling exploited","Feeling trapped","Feeling suffocated"],"Performance Based Triggers":["Fear of failure","Fear of success","High expectations","Perfectionism","Pressure","Competition","Judgement from others","Self criticism"],"Existential Based Triggers":["Meaninglessness","Emptiness","Loss of purpose","Loss of identity","Isolation","Time pressure","Mortality","Change","Unpredictability"]},y=Object.keys(n).map(e=>`<option value="${e}" ${r&&i.coreTrigger===e?"selected":""}>${e}</option>`).join("");let p='<option value="">First select a Core Trigger</option>';r&&i.coreTrigger&&n[i.coreTrigger]&&(p=n[i.coreTrigger].map(e=>`<option value="${e}" ${i.emotion===e?"selected":""}>${e}</option>`).join(""));const{modal:t,closeModal:g}=F({id:"triggerReleaseModal",title:r?"View / Edit Trigger":"Trigger Release",subtitle:"Record emotional reactions and patterns to understand your inner landscape.",content:`
      <div style="display:flex;flex-direction:column;gap:var(--spacing-md);max-height:calc(90vh - 220px);overflow-y:auto;padding-right:var(--spacing-sm)">

        <!-- inputs -->
        <div>
          <label class="form-label">Who or What Triggered you?</label>
          <input type="text" id="trigger-source" class="form-input" placeholder="e.g., My boss, A comment, Traffic..." value="${r&&i.source?i.source:""}">
        </div>

        <label class="form-label">Describe your trigger</label>
        <textarea id="trigger-textarea" class="form-input" style="min-height:150px;resize:none;margin-bottom:1.5rem" placeholder="What happened and how did it make you feel?">${r?i.text:""}</textarea>

        <div class="trigger-grid-2col" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-md)">
          <div>
            <label class="form-label">Core Trigger:</label>
            <select id="trigger-core-trigger" class="form-input"><option value="">Choose Core Trigger</option>${y}</select>
          </div>
          <div>
            <label class="form-label">Specific emotion:</label>
            <select id="trigger-emotion" class="form-input" ${!r||!i.coreTrigger?"disabled":""} style="color:${!r||!i.coreTrigger?"#9ca3af":""}">
              ${p}
            </select>
          </div>
        </div>

        <div>
          <label class="form-label">Intensity (0-10):</label>
          <div style="display:flex;align-items:center;gap:var(--spacing-sm)">
            <input type="range" id="trigger-intensity-slider" class="intensity-slider" min="0" max="10" value="${r?i.intensity:5}" style="flex:1">
            <span id="trigger-intensity-value" class="intensity-value">${r?i.intensity:5}</span>
          </div>
        </div>
      </div>
    `,actions:`
      ${r?'<button id="deleteTriggerEntry" class="btn">Delete</button>':""}
      <button id="closeTriggerModal" class="btn">Close</button>
      <button id="saveTriggerEntry" class="btn btn-primary">Save Entry</button>
    `}),d=t.querySelector("#trigger-intensity-slider"),T=t.querySelector("#trigger-intensity-value");d.addEventListener("input",()=>T.textContent=d.value);const m=t.querySelector("#trigger-core-trigger"),s=t.querySelector("#trigger-emotion");m.addEventListener("change",()=>{const e=m.value;e&&n[e]?(s.disabled=!1,s.style.color="",s.innerHTML=n[e].map(o=>`<option value="${o}">${o}</option>`).join("")):(s.disabled=!0,s.style.color="#9ca3af",s.innerHTML='<option value="">First select a Core Trigger</option>')}),t.querySelector("#saveTriggerEntry").addEventListener("click",()=>{const e=t.querySelector("#trigger-source").value.trim(),o=t.querySelector("#trigger-textarea").value.trim(),c=t.querySelector("#trigger-core-trigger").value,u=t.querySelector("#trigger-emotion").value,f=parseInt(d.value);if(!o||!c||!u)return a("Required fields missing","error");if(r){const b=l.triggers.findIndex(h=>h.id===i.id);Object.assign(l.triggers[b],{source:e,text:o,coreTrigger:c,emotion:u,intensity:f}),a("Trigger updated successfully")}else l.triggers.push({id:`trigger-${Date.now()}`,date:new Date().toISOString(),source:e,text:o,coreTrigger:c,emotion:u,intensity:f}),window.AppController.addLightParticles(1),a("Trigger released successfully");v(),window.AppController.renderDashboard(),g()}),r&&t.querySelector("#deleteTriggerEntry").addEventListener("click",()=>{S("Delete this trigger? This action cannot be undone.",()=>{l.triggers=l.triggers.filter(e=>e.id!==i.id),v(),window.AppController.renderDashboard(),g(),a("Trigger deleted")})}),t.querySelector("#closeTriggerModal").addEventListener("click",g)}export{C as openTriggerReleaseModal};
