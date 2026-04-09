import{c as s}from"./modal-1yjDmyAf.js";function a(){const{modal:n,closeModal:t}=s({id:"shadowGuidedProcessModal",title:"Shadow Guided Process",subtitle:"",content:'<div id="shadow-guided-process-content" style="overflow-y:auto;max-height:calc(90vh - 100px)"></div>',actions:"",onClose:()=>window.AppController.renderDashboard()}),o=n.querySelector(".modal-card");o.style.maxWidth="700px",o.style.maxHeight="90vh",o.style.display="flex",o.style.flexDirection="column";const e=n.querySelector("#shadow-guided-process-content");if(!window.DailyJourneyEngine){console.error("DailyJourneyEngine not found!"),e.innerHTML=`
      <div style="padding: 2rem; text-align: center; color: var(--neuro-error);">
        <h3>Engine Not Loaded</h3>
        <p>The Daily Journey Engine is not available. Please refresh the page.</p>
        <button id="close-error" class="btn" style="margin-top: 1rem;">Close</button>
      </div>
    `,e.querySelector("#close-error").addEventListener("click",t);return}setTimeout(()=>{try{window.DailyJourneyEngine.startDailyJourney(e)}catch(r){console.error("Failed to start Daily Journey:",r),e.innerHTML=`
        <div style="padding: 2rem; text-align: center; color: var(--neuro-error);">
          <h3>Error Starting Journey</h3>
          <p>${r.message}</p>
          <button id="close-error" class="btn" style="margin-top: 1rem;">Close</button>
        </div>
      `,e.querySelector("#close-error").addEventListener("click",t)}},100);const i=new MutationObserver(()=>{const r=e.querySelector("#return-dash");r&&(r.addEventListener("click",t),i.disconnect())});i.observe(e,{childList:!0,subtree:!0})}export{a as openShadowGuidedProcessModal};
