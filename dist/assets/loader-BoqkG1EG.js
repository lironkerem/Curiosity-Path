const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/app-D9dh7q-t.js","assets/communityHub-Bb3vMneH.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./communityHub-Bb3vMneH.js";class h{constructor(t){this.bigApp=t,this.instance=null,this.isInitialized=!1}render(){const t=document.getElementById("calculator-tab");if(!t){console.error("❌ Calculator tab not found");return}if(this.isInitialized){this.revalidate();return}t.innerHTML='<div class="loading-spinner-inner"><div class="spinner"></div><p>Loading Self-Analysis Pro...</p></div>',fetch("/src/Mini-Apps/SelfAnalysisPro/index.html").then(e=>e.text()).then(e=>{const a=new DOMParser().parseFromString(e,"text/html").getElementById("app-page");if(!a)throw new Error("app-page element not found in HTML");return t.innerHTML=`
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!-- Big-App Unified Header -->
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavAnalysis.webp');
                     --header-title:'';
                     --header-tag:'Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot'">
        <h1>Self-Analysis Pro</h1>
        <h3>Analyse your 'Self', using Numerology, Astrology, Tree of Life and Tarot</h3>
        <span class="header-sub"></span>
      </header>

      <!-- Mini-App Content -->
      <div class="selfanalysis-scope">
        ${a.innerHTML}
      </div>

    </div>
  </div>
`,this.initializeComponents().then(()=>l(()=>import("./app-D9dh7q-t.js"),__vite__mapDeps([0,1])))}).then(e=>{if(typeof e.bootSelfAnalysis=="function")this.instance=e.bootSelfAnalysis(t),this.isInitialized=!0;else throw new Error("bootSelfAnalysis function not found")}).catch(e=>{console.error("❌ Self-Analysis loader failed:",e),t.innerHTML=`
          <div class="card" style="padding:2rem;text-align:center;color:var(--neuro-error);">
            <h2>Failed to Load Self-Analysis Pro</h2>
            <p>${e.message}</p>
            <button class="btn btn-primary" onclick="location.reload()">Reload Page</button>
          </div>
        `})}async initializeComponents(){try{const[{CustomDatePicker:t},{CustomTimePicker:e},{StepIndicator:r}]=await Promise.all([l(()=>import("./customDatePicker-D1KxK3Zv.js"),[]),l(()=>import("./customTimePicker-CV_1OXuF.js"),[]),l(()=>import("./stepindicator-DS_fPbqw.js"),[])]);document.getElementById("date-of-birth")&&(window.customDatePicker=new t("date-of-birth")),document.getElementById("time-of-birth")&&(window.customTimePicker=new e("time-of-birth")),document.getElementById("step-indicator")&&(window.stepIndicator=new r,window.resetStepIndicator=()=>{window.stepIndicator&&window.stepIndicator.reset()}),this.initializeLocationAutocomplete()}catch(t){throw console.error("❌ Failed to initialize components:",t),t}}initializeLocationAutocomplete(){const t=document.getElementById("location-birth"),e=document.getElementById("location-dropdown");if(!t||!e){console.warn("⚠️ Location elements not found");return}const r="/api/geocode";let a;const i=new Map,d=n=>{if(!n||!n.length){e.innerHTML='<div style="padding:10px;color:#888;">No locations found</div>',e.classList.add("active"),setTimeout(()=>e.classList.remove("active"),2e3);return}e.innerHTML=n.map(o=>`
      <div class="location-option" data-lat="${o.lat}" data-lon="${o.lon}" data-name="${o.display_name}">
        ${o.display_name}
      </div>`).join(""),e.classList.add("active"),e.querySelectorAll(".location-option").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.name,c=o.dataset.lat,u=o.dataset.lon;t.value=s,t.dataset.lat=c,t.dataset.lon=u,e.classList.remove("active"),e.innerHTML="",t.style.borderColor="#4caf50",setTimeout(()=>t.style.borderColor="",1e3)})})},m=async n=>{try{const o=await fetch(`${r}?q=${encodeURIComponent(n)}`);if(!o.ok){const c=await o.text();throw console.error("❌ Geocode error:",c),new Error("geo err")}const s=await o.json();i.set(n.toLowerCase(),s),i.size>50&&i.delete(i.keys().next().value),d(s)}catch(o){console.warn("❌ Location fetch error:",o.message),e.innerHTML='<div style="padding:10px;color:#d32f2f;background:#ffebee;">Unable to load suggestions. Try typing your city name.</div>',e.classList.add("active"),setTimeout(()=>e.classList.remove("active"),3e3)}};t.addEventListener("input",()=>{const n=t.value.trim();if(clearTimeout(a),n.length<3){e.classList.remove("active"),e.innerHTML="";return}const o=n.toLowerCase();if(i.has(o)){d(i.get(o));return}a=setTimeout(()=>m(n),400)}),document.addEventListener("click",n=>{n.target!==t&&!e.contains(n.target)&&e.classList.remove("active")})}revalidate(){window.revalidateForm&&typeof window.revalidateForm=="function"&&window.revalidateForm()}cleanup(){}}export{h as default};
