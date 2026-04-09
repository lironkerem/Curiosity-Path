function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function p({id:t,title:d,subtitle:i,content:r,actions:c,onClose:l}){const o=document.getElementById(t);o&&o.remove();const e=document.createElement("div");e.id=t,e.className="modal-overlay",e.style.zIndex="10000",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby",`${t}-title`),e.innerHTML=`
    <div class="modal-card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--spacing-md)">
        <div style="flex:1">
          <h3 id="${t}-title" style="margin:0">${m(d)}</h3>
          ${i?`<p class="muted" style="margin-top:var(--spacing-xs)">${i}</p>`:""}
        </div>
        <button type="button" class="btn modal-close-btn" aria-label="Close modal"
                style="padding:8px 12px;font-size:1.2rem;margin-left:var(--spacing-md);flex-shrink:0">✕</button>
      </div>
      ${r}
      <div class="modal-actions">${c}</div>
    </div>`,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("active"));const a=()=>{e.remove(),typeof l=="function"&&l()};e.querySelector(".modal-close-btn").addEventListener("click",a),e.addEventListener("click",n=>{n.target===e&&a()});const s=n=>{n.key==="Escape"&&(a(),document.removeEventListener("keydown",s))};return document.addEventListener("keydown",s),{modal:e,closeModal:a}}export{p as c};
