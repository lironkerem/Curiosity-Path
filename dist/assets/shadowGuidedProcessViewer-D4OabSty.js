import{c as a}from"./modal-1yjDmyAf.js";function n(s){var o,i;const t=s.steps.map(e=>`
    <div class="qa-block">
      <div class="q">${e.question}</div>
      <div class="a">${e.answerText}</div>
      <div class="muted" style="font-size:0.85rem;margin-top:0.25rem">
        Emotion: ${e.emotion} | Intensity: ${e.intensity}/10
      </div>
    </div>`).join(""),{closeModal:d}=a({id:"shadowGuidedProcessViewModal",title:`Shadow Guided Process: ${s.caseId}`,subtitle:new Date(s.date).toLocaleString(),content:`
      <hr>
      <div class="scrollable-content">
        ${t}
        ${s.vent?`
          <div class="qa-block">
            <div class="q">Cathartic Release</div>
            <div class="a">${s.vent}</div>
          </div>`:""}
        <hr>
        <div class="qa-block">
          <div class="q">Analysis</div>
          <div class="muted">
            <strong>Themes:</strong> ${((o=s.themes)==null?void 0:o.join(", "))||"None"}<br>
            <strong>Primary Emotion:</strong> ${s.primaryEmotion||"Unknown"}<br>
            <strong>Suggested Practice:</strong> ${((i=s.suggestedPractice)==null?void 0:i.title)||"None"}
          </div>
        </div>
      </div>`,actions:'<button id="closeShadowGuidedProcessModal" class="btn">Close</button>'});document.getElementById("closeShadowGuidedProcessModal").addEventListener("click",d)}export{n as openShadowGuidedProcessViewModal};
