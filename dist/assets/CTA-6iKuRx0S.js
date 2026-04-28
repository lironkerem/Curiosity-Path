var b=Object.defineProperty;var k=(a,e,t)=>e in a?b(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var y=(a,e,t)=>k(a,typeof e!="symbol"?e+"":e,t);const d=class d{constructor(){this.isOpen=!1,this.scrollObserver=null,this.elements=null,this.listeners=[]}render(){document.getElementById("cta-footer")||(document.getElementById("app-container")?.insertAdjacentHTML("beforeend",this.markup()),this.init())}init(){this.elements={toggle:document.getElementById("cta-toggle"),panel:document.getElementById("cta-panel"),live:document.getElementById("cta-aria-live")},this.setupToggleButton(),this.setupAccordionSections(),this.populateGrids(),this.setupCTASwipeClose(),this.preventBackgroundScroll()}setupToggleButton(){const e=()=>this.togglePanel();this.elements.toggle.addEventListener("click",e),this.listeners.push({element:this.elements.toggle,event:"click",handler:e})}togglePanel(){this.isOpen=!this.isOpen;const{toggle:e,panel:t,live:s}=this.elements;e.classList.toggle("open",this.isOpen),e.setAttribute("aria-expanded",this.isOpen),t.classList.toggle("open",this.isOpen),s.textContent=this.isOpen?"Footer panel opened":"Footer panel closed"}setupAccordionSections(){document.querySelectorAll(".lux-section-header").forEach(e=>{const t=()=>{const s=e.getAttribute("aria-expanded")==="true",o=e.parentElement.querySelector(".lux-section-body");e.setAttribute("aria-expanded",!s),o.classList.toggle("open",!s)};e.addEventListener("click",t),this.listeners.push({element:e,event:"click",handler:t})})}preventBackgroundScroll(){this.scrollObserver=new MutationObserver(()=>{const e=this.elements.toggle.classList.contains("open");document.body.style.overflow=e?"hidden":"",document.body.style.position=e?"fixed":"",document.body.style.width=e?"100%":""}),this.scrollObserver.observe(this.elements.toggle,{attributes:!0,attributeFilter:["class"]})}setupCTASwipeClose(){const{panel:e,toggle:t}=this.elements,{Y_THRESHOLD:s,VELOCITY_THRESHOLD:o,HAPTIC_DURATION:p,ANIMATION_DELAY:l}=d.SWIPE_CONFIG;let i=0,h=0,c=!1;const m=r=>{i=r.touches[0].clientY,h=Date.now(),c=!r.target.closest(".lux-grid, .lux-section-body"),c&&(e.style.transition="none",t.style.transition="none")},g=r=>{if(!c)return;let n=r.touches[0].clientY-i;if(n>0){const u=e.offsetHeight;n=Math.min(n,u),e.style.transform=`translateY(${n}px)`,t.style.transform=`translateY(${n}px)`}},v=r=>{if(e.style.transition="",t.style.transition="",!c){e.style.transform="",t.style.transform="";return}const n=r.changedTouches[0].clientY-i,u=Date.now()-h,w=n/u;n>s&&w>o?(navigator.vibrate&&navigator.vibrate(p),this.isOpen=!1,t.classList.remove("open"),t.setAttribute("aria-expanded","false"),e.classList.remove("open"),this.elements.live.textContent="Footer panel closed",setTimeout(()=>{e.style.transform="",t.style.transform=""},l)):(e.style.transform="",t.style.transform="")};e.addEventListener("touchstart",m,{passive:!0}),e.addEventListener("touchmove",g,{passive:!0}),e.addEventListener("touchend",v,{passive:!0}),this.listeners.push({element:e,event:"touchstart",handler:m},{element:e,event:"touchmove",handler:g},{element:e,event:"touchend",handler:v})}markup(){return`
      <footer id="cta-footer" class="lux-footer">
        <button id="cta-toggle" class="lux-toggle" aria-expanded="false">
          <img src="/Watermarks/Logo.svg"
               alt="Aanandoham" class="lux-logo" width="120" height="40">
          <div class="lux-text-group">
            <span class="lux-line1">Deepen your life experience with me</span>
            <span class="lux-line2">© 2026 Aanandoham (Liron Kerem)</span>
          </div>
          <span class="lux-chevron"></span>
        </button>

        <div id="cta-panel" class="lux-panel" style="touch-action: manipulation;">
          <div class="lux-scroll">
            <div class="lux-inner">
              <header class="lux-header">
                <h2 class="lux-title">Empower your <em>'Self'</em></h2>
                <p class="lux-intro">
                  Welcome to Project Curiosity - founded 2010.<br>
                  Explore my unique In-Person and Online offerings
                </p>

                <div class="lux-social-row" style="display:flex;gap:.9rem;justify-content:center;margin-top:1.5rem;flex-wrap:wrap;">
                  <a href="https://lironkerem.wixsite.com/project-curiosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip" style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="Official Website">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Website</span>
                  </a>

                  <a href="https://www.facebook.com/AanandohamsProjectCuriosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip" style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="Facebook Page">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <span style="font-weight:600;font-size:1rem">Facebook</span>
                  </a>

                  <a href="https://www.youtube.com/@Aanandoham-Project-Curiosity"
                     target="_blank" rel="noopener"
                     class="lux-social-chip" style="display:inline-flex;flex-direction:column;align-items:center;gap:.3rem;padding:.65rem .9rem;background:var(--neuro-bg);border-radius:999px;box-shadow:var(--shadow-raised);color:var(--neuro-text);text-decoration:none;transition:all .2s;"
                     aria-label="YouTube Channel">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    <span style="font-weight:600;font-size:1rem">YouTube</span>
                  </a>
                </div>
              </header>

              <section class="lux-section" data-section="sessions">
                <button class="lux-section-header" aria-expanded="false">
                  <h3>Private Sessions & Group Classes</h3>
                  <span class="lux-chevron"></span>
                </button>
                <div class="lux-section-body">
                  <div class="lux-grid" id="sessions-grid"></div>
                </div>
              </section>

              <section class="lux-section" data-section="workshops">
                <button class="lux-section-header" aria-expanded="false">
                  <h3>Group Workshops, Courses & Retreats</h3>
                  <span class="lux-chevron"></span>
                </button>
                <div class="lux-section-body">
                  <div class="lux-grid" id="workshops-grid"></div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <span id="cta-aria-live" aria-live="polite" class="sr-only"></span>
      </footer>`}populateGrids(){const e="/CTA/",t=["https://lironkerem.wixsite.com/project-curiosity/tarot","https://lironkerem.wixsite.com/project-curiosity/reiki","https://lironkerem.wixsite.com/project-curiosity/meditation","https://lironkerem.wixsite.com/project-curiosity/tarot","https://lironkerem.wixsite.com/project-curiosity/osho","https://lironkerem.wixsite.com/project-curiosity/guided-visualizations","https://lironkerem.wixsite.com/project-curiosity/eft","https://lironkerem.wixsite.com/project-curiosity/yoga","https://lironkerem.wixsite.com/project-curiosity/tantra"],s=["https://lironkerem.wixsite.com/project-curiosity/tarot","https://lironkerem.wixsite.com/project-curiosity/reiki","https://lironkerem.wixsite.com/project-curiosity/meditation","https://lironkerem.wixsite.com/project-curiosity/rainbow-body","https://lironkerem.wixsite.com/project-curiosity/osho","https://lironkerem.wixsite.com/project-curiosity/osho"],o=document.getElementById("sessions-grid"),p=document.getElementById("workshops-grid");t.forEach((l,i)=>o.appendChild(this.createCard(`${e}Sessions/Sessions${i+1}.jpg`,l,`Session ${i+1}`))),s.forEach((l,i)=>p.appendChild(this.createCard(`${e}Workshops/Workshops${i+1}.jpg`,l,`Workshop ${i+1}`)))}createCard(e,t,s){const o=document.createElement("a");return o.href=t,o.target="_blank",o.rel="noopener",o.className="lux-card",o.innerHTML=`<div class="lux-img-wrap"><picture><source srcset="${e.replace(/\.(jpg|jpeg|png)$/i,".webp")}" type="image/webp"><img src="${e}" alt="${s}" loading="lazy" decoding="async" width="300" height="200"></picture></div>`,o}destroy(){this.scrollObserver?.disconnect(),this.listeners.forEach(({element:e,event:t,handler:s})=>{e?.removeEventListener(t,s)}),this.listeners=[],document.getElementById("cta-footer")?.remove()}};y(d,"SWIPE_CONFIG",{Y_THRESHOLD:60,VELOCITY_THRESHOLD:.5,HAPTIC_DURATION:8,ANIMATION_DELAY:300});let f=d;export{f as default};
