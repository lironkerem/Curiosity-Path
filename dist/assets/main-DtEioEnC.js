const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HappinessEngine-CYGd-V4Q.js","assets/InquiryEngine-BOqjDi6m.js","assets/features-lazy-bN0WDG2L.js","assets/community-hub-uUiMGgF_.js","assets/supabase-k82gbVKr.js","assets/GratitudeEngine-CGH7Iehb.js","assets/Modal-CugUVGir.js","assets/JournalEngine-n3UWMAm1.js","assets/self-analysis-D8TQEy_e.js","assets/Index-DLrUEHAr.js","assets/User-Tab-B5acZz4N.js","assets/GamificationEngine-EfFpmezy.js"])))=>i.map(i=>d[i]);
var L=t=>{throw TypeError(t)};var J=(t,e,i)=>e.has(t)||L("Cannot "+i);var N=(t,e,i)=>(J(t,e,"read from private field"),i?i.call(t):e.get(t)),P=(t,e,i)=>e.has(t)?L("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i);import{_ as u}from"./features-lazy-bN0WDG2L.js";import"./community-hub-uUiMGgF_.js";import{c as q}from"./supabase-k82gbVKr.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();(function(){const t={CHARS:"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789",COLUMNS_MOBILE:12,COLUMNS_DESKTOP:25,CHAR_COUNT:100,SPEED_MOBILE:3,SPEED_DESKTOP:3,RANDOM_MOBILE:4,RANDOM_DESKTOP:4,FONT_MOBILE:16,FONT_DESKTOP:24,LINE_MOBILE:20,LINE_DESKTOP:28};class e{constructor(){this.container=null,this.columns=[],this.animationId=null,this.isRunning=!1}init(){document.body.classList.contains("matrix-code")&&(this.createContainer(),this.createColumns(),this.isRunning=!0,this.animate())}createContainer(){this.container=document.createElement("div"),this.container.style.cssText="position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;z-index:1!important;pointer-events:none!important;overflow:hidden!important;",document.body.insertBefore(this.container,document.body.firstChild)}createColumns(){const a=window.innerWidth<=768,n=a?t.COLUMNS_MOBILE:t.COLUMNS_DESKTOP,c=a?t.SPEED_MOBILE:t.SPEED_DESKTOP,m=a?t.RANDOM_MOBILE:t.RANDOM_DESKTOP,g=a?t.FONT_MOBILE:t.FONT_DESKTOP,y=a?t.LINE_MOBILE:t.LINE_DESKTOP,d=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";for(let w=0;w<n;w++){const l=document.createElement("div"),r=w/n*100+50/n;l.style.cssText=`font-family:monospace;font-size:${g}px;line-height:${y}px;color:${d};opacity:0.5;white-space:pre;text-shadow:0 0 10px ${d};position:absolute;left:${r}%;top:0;transform:translateX(-50%)`;let o="";for(let h=0;h<t.CHAR_COUNT;h++)o+=t.CHARS[Math.floor(Math.random()*t.CHARS.length)]+`
`;l.textContent=o,this.container.appendChild(l),this.columns.push({el:l,y:-Math.random()*4e3,speed:c+Math.random()*m})}}animate(){if(!this.isRunning)return;const a=window.innerHeight;this.columns.forEach(n=>{n.y+=n.speed,n.y>a+2e3&&(n.y=-2e3),n.el.style.transform=`translateX(-50%) translateY(${n.y}px)`}),this.animationId=requestAnimationFrame(()=>this.animate())}destroy(){this.isRunning=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.container&&this.container.remove()}updateColors(){const n=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";this.columns.forEach(c=>{c.el.style.color=n,c.el.style.textShadow=`0 0 10px ${n}`})}}window.MatrixRain=e,window.matrixRain=new e;function i(){document.body.classList.contains("matrix-code")&&window.matrixRain.init()}window.MutationObserver&&new MutationObserver(()=>{window.matrixRain&&window.matrixRain.isRunning&&window.matrixRain.updateColors()}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",i),setTimeout(i,100),setTimeout(i,500),setTimeout(i,1e3)})();const _=Object.freeze({MAX_NAME_LENGTH:120,MAX_LOCATION_LENGTH:200,MAX_INPUT_LENGTH:200,MIN_YEAR:1900}),S=Object.freeze({NAME:/^[A-Za-z\u00C0-\u017F' -]+$/,DATE:/^\d{4}-\d{2}-\d{2}$/,TIME:/^\d{2}:\d{2}$/}),D=Object.freeze({MAX_LOCATION_CACHE:50,CACHE_EXPIRY_MS:1e3*60*60*24}),Q={escapeHtml(t){if(!t)return"";const e=document.createElement("div");return e.textContent=String(t),e.innerHTML},sanitizeInput(t){return t?String(t).trim().replace(/[<>]/g,"").replace(/[\x00-\x1F\x7F]/g,"").substring(0,_.MAX_INPUT_LENGTH):""},debounce(t,e){let i;return function(...a){clearTimeout(i),i=setTimeout(()=>t.apply(this,a),e)}},throttle(t,e){let i;return function(...a){i||(t.apply(this,a),i=!0,setTimeout(()=>{i=!1},e))}},_locationCache:new Map,getCachedLocation(t){const e=t.toLowerCase().trim(),i=this._locationCache.get(e);return i?Date.now()-i.timestamp>D.CACHE_EXPIRY_MS?(this._locationCache.delete(e),null):i.data:null},setCachedLocation(t,e){const i=t.toLowerCase().trim();this._locationCache.size>=D.MAX_LOCATION_CACHE&&this._locationCache.delete(this._locationCache.keys().next().value),this._locationCache.set(i,{data:e,timestamp:Date.now()})},clearLocationCache(){this._locationCache.clear()},formatDate(t){const e=t instanceof Date?t:new Date(t);return isNaN(e)?"Invalid Date":e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})},deepClone(t){if(typeof structuredClone=="function")return structuredClone(t);if(t===null||typeof t!="object")return t;if(t instanceof Date)return new Date(t);if(Array.isArray(t))return t.map(i=>this.deepClone(i));const e=Object.create(null);for(const i of Object.keys(t))e[i]=this.deepClone(t[i]);return e}},Z={validateName(t){if(!(t!=null&&t.trim()))return{valid:!1,message:"Name is required"};const e=t.trim();return e.length>_.MAX_NAME_LENGTH?{valid:!1,message:`Maximum ${_.MAX_NAME_LENGTH} characters`}:S.NAME.test(e)?{valid:!0}:{valid:!1,message:"Only letters, spaces, hyphens, and apostrophes allowed"}},validateDateOfBirth(t){if(!t)return{valid:!1,message:"Date of birth is required"};if(!S.DATE.test(t))return{valid:!1,message:"Use YYYY-MM-DD format"};const e=new Date(t);return isNaN(e.getTime())?{valid:!1,message:"Invalid date"}:e.getFullYear()<_.MIN_YEAR?{valid:!1,message:`Year must be ${_.MIN_YEAR} or later`}:e>new Date?{valid:!1,message:"Future date not allowed"}:{valid:!0}},validateTimeOfBirth(t){if(!t)return{valid:!0};if(!S.TIME.test(t))return{valid:!1,message:"Use HH:MM format (24-hour)"};const[e,i]=t.split(":").map(Number);return e<0||e>23||i<0||i>59?{valid:!1,message:"Invalid time"}:{valid:!0}},validateLocation(t){return t!=null&&t.trim()?t.length>_.MAX_LOCATION_LENGTH?{valid:!1,message:`Maximum ${_.MAX_LOCATION_LENGTH} characters`}:{valid:!0}:{valid:!0}},validateEmail(t){return t!=null&&t.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.trim())?{valid:!0}:{valid:!1,message:"Invalid email format"}:{valid:!1,message:"Email is required"}}};var E;const k=class k{constructor(){this.reset()}updateFormData(e,i){if(!N(k,E).has(e)){console.warn(`[FormState] Unknown field "${e}"`);return}this.formData[e]=i}setAnalysisResults(e){this.analysisResults=e}getAnalysisResults(){return this.analysisResults}setNarrativeResults(e){this.narrativeResults=e}getNarrativeResults(){return this.narrativeResults}reset(){this.formData={firstName:"",middleName:"",lastName:"",dateOfBirth:"",timeOfBirth:"",locationOfBirth:"",includeY:!1},this.analysisResults=null,this.narrativeResults=null}isComplete(){return!!(this.formData.firstName&&this.formData.lastName&&this.formData.dateOfBirth)}};E=new WeakMap,P(k,E,new Set(["firstName","middleName","lastName","dateOfBirth","timeOfBirth","locationOfBirth","includeY"]));let C=k;typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&(window.__utils={Utils:Q,Validation:Z,FormState:C});const v=Object.freeze({MEDITATIONS:"meditations",TAROT:"tarot",ENERGY:"energy",HAPPINESS:"happiness",GRATITUDE:"gratitude",QUOTES:"quotes",AFFIRMATIONS:"affirmations",PROGRESS:"progress",FLIP_SCRIPT:"flip-script",JOURNAL:"journal",SHADOW_ALCHEMY:"shadow-alchemy",KARMA_SHOP:"karma-shop",CHATBOT:"chatbot",COMMUNITY_HUB:"community-hub",CALCULATOR:"calculator"}),B=Object.freeze({[v.MEDITATIONS]:()=>u(()=>import("./MeditationsEngine-CES81Rz5.js"),[]).then(t=>t.default),[v.TAROT]:()=>u(()=>Promise.resolve().then(()=>K),void 0).then(t=>t.default),[v.ENERGY]:()=>u(()=>import("./EnergyTracker-4z8lVD8r.js"),[]).then(t=>t.default),[v.HAPPINESS]:()=>u(()=>import("./HappinessEngine-CYGd-V4Q.js"),__vite__mapDeps([0,1,2,3,4])).then(t=>t.default),[v.GRATITUDE]:()=>u(()=>import("./GratitudeEngine-CGH7Iehb.js"),__vite__mapDeps([5,6,3,2,4])).then(t=>t.default),[v.QUOTES]:()=>u(()=>import("./QuotesEngine-CvgXYYCr.js"),[]).then(t=>t.default),[v.AFFIRMATIONS]:()=>u(()=>Promise.resolve().then(()=>pe),void 0).then(t=>t.default),[v.PROGRESS]:()=>u(()=>import("./GamificationEngine-EfFpmezy.js"),[]).then(t=>t.default),[v.FLIP_SCRIPT]:()=>u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.i),[]).then(t=>t.default),[v.JOURNAL]:()=>u(()=>import("./JournalEngine-n3UWMAm1.js"),__vite__mapDeps([7,6,3,2,4])).then(t=>t.default),[v.SHADOW_ALCHEMY]:()=>u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.s),[]).then(t=>t.default),[v.KARMA_SHOP]:()=>u(()=>import("./KarmaShopEngine-D1yE7bQ-.js"),[]).then(t=>t.default),[v.CHATBOT]:()=>u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.C),[]).then(t=>t.ChatBotAI),[v.COMMUNITY_HUB]:()=>u(()=>import("./community-hub-uUiMGgF_.js").then(t=>t.c),__vite__mapDeps([3,2])).then(t=>t.default),[v.CALCULATOR]:()=>u(()=>import("./self-analysis-D8TQEy_e.js"),__vite__mapDeps([8,2])).then(t=>t.default)});class ee{constructor(e){if(!e)throw new Error("[Features] FeaturesManager requires app instance");this.app=e,this.engines={},this._loading={}}async init(e){var i,s,a;try{if(this.engines[e])return(s=(i=this.engines[e]).render)==null||s.call(i),!0;if(!this._loading[e]){const c=B[e];if(!c)return console.error(`[Features] Unknown feature: "${e}"`),!1;this._loading[e]=c().then(m=>(this.engines[e]=new m(this.app),delete this._loading[e],this.engines[e]))}const n=await this._loading[e];return(a=n.render)==null||a.call(n),!0}catch(n){return console.error(`[Features] Error initialising "${e}":`,n),delete this._loading[e],!1}}async initMultiple(e){const i=await Promise.all(e.map(async n=>({id:n,success:await this.init(n)}))),s=i.filter(n=>n.success).length,a=i.filter(n=>!n.success).length;return{results:i,successful:s,failed:a,total:e.length}}getEngine(e){return this.engines[e]??null}isInitialized(e){return!!this.engines[e]}getInitializedFeatures(){return Object.keys(this.engines)}getInitializedCount(){return Object.keys(this.engines).length}getAvailableFeatures(){return Object.keys(B)}destroy(e){var i;try{const s=this.engines[e];return s?((i=s.destroy)==null||i.call(s),delete this.engines[e],!0):(console.warn(`[Features] Cannot destroy uninitialised feature: "${e}"`),!1)}catch(s){return console.error(`[Features] Error destroying "${e}":`,s),!1}}destroyAll(){const e=Object.keys(this.engines);let i=0;return e.forEach(s=>{this.destroy(s)&&i++}),{destroyed:i,total:e.length}}getDebugInfo(){return{initialized:this.getInitializedFeatures(),initializedCount:this.getInitializedCount(),available:this.getAvailableFeatures(),availableCount:this.getAvailableFeatures().length,loading:Object.keys(this._loading),engines:Object.fromEntries(Object.keys(this.engines).map(e=>[e,{hasRender:typeof this.engines[e].render=="function",hasDestroy:typeof this.engines[e].destroy=="function"}]))}}}typeof window<"u"&&(window.FeaturesManager=ee,window.FEATURE_IDS=v);const I={ANIMATION_DELAY:10,SHOW_DURATION:3e3,FADE_OUT_DURATION:400,QUEUE_SPACING:200,CONTAINER_ID:"toast-container"},te={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'};class ie{constructor(){this.queue=[],this.isShowing=!1,this.currentToast=null,this.containerCache=null,this.observerSetup=!1}async show(e,i="info",s=null,a={}){const{duration:n=I.SHOW_DURATION,dismissible:c=!1,icon:m=te[i]}=a;s&&this.queue.some(g=>g.key===s)||(this.queue.push({msg:e,type:i,key:s,duration:n,dismissible:c,icon:m}),this.isShowing||await this.processQueue())}async processQueue(){var a;if(!this.queue.length){this.isShowing=!1;return}this.isShowing=!0;const e=this.queue.shift(),i=this.getContainer();if(!i){console.error(`Toast container "#${I.CONTAINER_ID}" not found in DOM`),this.isShowing=!1,this.queue=[];return}(a=this.currentToast)!=null&&a.parentNode&&this.currentToast.remove();const s=this.createToastElement(e);this.currentToast=s,i.appendChild(s),setTimeout(()=>s.classList.add("show"),I.ANIMATION_DELAY),await this.waitForToast(s,e.duration),await this.sleep(I.QUEUE_SPACING),await this.processQueue()}createToastElement(e){const i=document.createElement("div");if(i.className=`toast ${e.type}`,i.setAttribute("role","alert"),i.setAttribute("aria-live","polite"),e.icon){const a=document.createElement("span");a.className="toast-icon",a.innerHTML=e.icon,i.appendChild(a)}const s=document.createElement("span");if(s.className="toast-message",s.textContent=e.msg,i.appendChild(s),e.dismissible){const a=document.createElement("button");a.className="toast-dismiss",a.textContent="×",a.setAttribute("aria-label","Dismiss notification"),a.addEventListener("click",()=>{this.dismissToast(i)}),i.appendChild(a)}return i}waitForToast(e,i){return new Promise(s=>{const a=setTimeout(()=>{this.hideToast(e,s)},i);e._timeoutId=a})}hideToast(e,i){e.classList.remove("show"),setTimeout(()=>{e.parentNode&&e.remove(),this.currentToast===e&&(this.currentToast=null),i&&i()},I.FADE_OUT_DURATION)}dismissToast(e){e._timeoutId&&clearTimeout(e._timeoutId),this.hideToast(e)}getContainer(){return this.containerCache&&document.contains(this.containerCache)?this.containerCache:(this.containerCache=document.getElementById(I.CONTAINER_ID),this.containerCache||(console.warn(`Toast container "#${I.CONTAINER_ID}" not found. Creating one.`),this.createContainer()),this.containerCache)}createContainer(){const e=document.createElement("div");e.id=I.CONTAINER_ID,e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),document.body.appendChild(e),this.containerCache=e}clear(){var e;this.queue=[],(e=this.currentToast)!=null&&e.parentNode&&(this.currentToast._timeoutId&&clearTimeout(this.currentToast._timeoutId),this.hideToast(this.currentToast)),this.isShowing=!1}sleep(e){return new Promise(i=>setTimeout(i,e))}getQueueLength(){return this.queue.length}isActive(){return this.isShowing}}let A=null;function T(){return A||(A=new ie),A}const ae=(t,e="info",i=null,s={})=>T().show(t,e,i,s),se=()=>{T().clear()},Ee=()=>T().getQueueLength(),ke=()=>T().isActive();typeof window<"u"&&import.meta.url.includes("localhost")&&(window.__toast={show:ae,clear:se,getQueue:()=>T(),config:I});const G={dev:{url:"https://caayiswyoynmeuimvwyn.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0"},prod:{url:"https://qfbarhxfmzpgbgkaymuk.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}};function ne(){try{return"https://qfbarhxfmzpgbgkaymuk.supabase.co"}catch{}return G.prod.url}function re(){try{return"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}catch{}return G.prod.anonKey}const O=ne(),oe=re(),le={auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:typeof window<"u"?window.localStorage:void 0},global:{headers:{"x-app-name":"digital-curiosity","x-app-version":"1.0.0"}},realtime:{timeout:1e4}};let b=null;try{b=q(O,oe,le)}catch(t){console.error("[Supabase] Failed to initialise client:",t)}const Se=b;typeof window<"u"&&(window.AppSupabase=b);function M(){return b?!0:(console.error("[Supabase] Client not initialised"),!1)}async function W(){if(!M())return null;try{const{data:{user:t},error:e}=await b.auth.getUser();if(e)throw e;return t}catch(t){return console.error("[Supabase] getCurrentUser failed:",t),null}}async function ce(){return!!await W()}async function de(){if(!M())return!1;try{const{error:t}=await b.auth.signOut();if(t)throw t;return!0}catch(t){return console.error("[Supabase] signOut failed:",t),!1}}async function he(){if(!M())return!1;try{const{error:t}=await b.from("user_data").select("count",{count:"exact",head:!0});if(t&&t.code!=="PGRST116")throw t;return!0}catch(t){return console.error("[Supabase] Connection test failed:",t),!1}}function ue(){let t=!1;try{t=!0}catch{}return{url:O,usingEnvironmentVariables:t,source:t?"Vite environment":"hardcoded fallback",initialized:!!b}}typeof window<"u"&&window.location.hostname==="localhost"&&(window.__supabase={client:b,config:ue(),test:he,getCurrentUser:W,isAuthenticated:ce,signOut:de,url:O});const R={general_positive_affirmations:[{text:"I am fully capable of creating the life I desire.",tags:[]},{text:"I choose peace over fear, clarity over confusion, and love over doubt.",tags:["love","peace","focus"]},{text:"My mind is focused, calm, and aligned with my highest truth.",tags:["peace"]},{text:"I am worthy of all good things that come my way.",tags:["self-worth"]},{text:"I trust the timing of my life and flow with it effortlessly.",tags:["trust"]},{text:"Every challenge I face strengthens my wisdom and resilience.",tags:[]},{text:"I radiate confidence, courage, and authenticity in all that I do.",tags:["confidence"]},{text:"I allow abundance to flow into my life with ease and grace.",tags:["abundance"]},{text:"My energy attracts people and opportunities that serve my growth.",tags:["energy"]},{text:"I forgive myself and release the past with compassion.",tags:["love","forgiveness"]},{text:"I am open to receiving love, success, and joy in infinite forms.",tags:["joy","love","abundance"]},{text:"I am grounded, present, and connected to the now.",tags:["focus"]},{text:"I honor my emotions as sacred messengers guiding me forward.",tags:[]},{text:"I am constantly evolving into the best version of myself.",tags:[]},{text:"My body is strong, healthy, and filled with vital energy.",tags:["confidence","energy"]},{text:"I am safe, supported, and guided by life itself.",tags:[]},{text:"I speak my truth with confidence, kindness, and clarity.",tags:["confidence","love","focus"]},{text:"I am a magnet for miracles, blessings, and divine synchronicity.",tags:[]},{text:"I release all resistance and allow my natural flow of wellbeing.",tags:["forgiveness"]},{text:"I am surrounded by love, light, and positive energy.",tags:["love","energy"]},{text:"I choose thoughts that uplift, inspire, and empower me.",tags:[]},{text:"I trust my intuition-it always leads me in the right direction.",tags:["trust","purpose"]},{text:"I am grateful for every experience that shapes my growth.",tags:[]},{text:"I am free from comparison and embrace my unique path.",tags:[]},{text:"My presence inspires peace, healing, and transformation in others.",tags:["peace"]},{text:"I am creative, resourceful, and capable of achieving anything I set my mind to.",tags:[]},{text:"I honor my boundaries and attract relationships that respect them.",tags:[]},{text:"I am in harmony with the universe and at peace with myself.",tags:["peace"]},{text:"I am love, I am light, I am whole.",tags:["love"]},{text:"I wake each day ready to create something beautiful and meaningful.",tags:[]},{text:"I am in alignment with life and everything unfolds for my highest good.",tags:[]},{text:"I am calm, confident, and centered no matter what happens around me.",tags:["peace"]},{text:"I am open to receiving love, abundance, and wisdom in all forms.",tags:["love","abundance"]},{text:"I trust myself completely and move forward with clarity and courage.",tags:["confidence","trust","focus"]},{text:"I am grateful for this moment and all that it teaches me.",tags:[]},{text:"I am a magnet for opportunities that support my purpose and joy.",tags:["joy","purpose"]},{text:"I release resistance and allow peace to flow through me.",tags:["forgiveness","peace"]},{text:"I radiate positive energy and attract people who uplift and inspire me.",tags:["energy"]},{text:"I choose to see challenges as stepping stones toward mastery.",tags:[]},{text:"I am grounded, balanced, and capable of handling anything life brings.",tags:[]},{text:"I deserve happiness, love, success, and inner peace.",tags:["joy","love","peace","abundance","self-worth"]},{text:"I am aligned with the flow of life and trust my path unfolds perfectly.",tags:["trust"]},{text:"Every challenge I face strengthens my character and deepens my wisdom.",tags:[]},{text:"I am worthy of love, success, and peace simply because I exist.",tags:["abundance","love","self-worth","peace"]},{text:"I create my reality through focused thought and inspired action.",tags:[]},{text:"I am open to receive abundance in all its forms.",tags:["abundance"]},{text:"I forgive myself and others easily, freeing space for joy to grow.",tags:["growth","joy","forgiveness"]},{text:"My energy attracts positive people, opportunities, and outcomes.",tags:["energy"]},{text:"I am at peace with my past and excited for my future.",tags:["peace"]},{text:"My mind is clear, my heart is open, and my spirit is strong.",tags:["confidence","love"]}],"loneliness_&_isolation":[{text:"I am connected to the world around me in deep and meaningful ways.",tags:[]},{text:"I allow love and friendship to flow freely into my life.",tags:["love"]},{text:"I enjoy my own company and find peace in solitude.",tags:["peace"]},{text:"Every day I am meeting people who resonate with my authentic self.",tags:[]},{text:"I am open to giving and receiving connection without fear.",tags:[]},{text:"My heart is open, and I attract genuine, supportive relationships.",tags:["love"]},{text:"I release the story that I am alone; I am part of something larger.",tags:["forgiveness"]},{text:"I am surrounded by people who care about me, even if unseen.",tags:[]},{text:"I belong here, and my presence makes a difference.",tags:[]},{text:"I am love, and love always finds its way back to me.",tags:["love"]}],"emptiness_&_numbness":[{text:"I allow myself to feel again, gently and safely.",tags:[]},{text:"My emotions are valid and welcome.",tags:[]},{text:"I reconnect with the beauty and wonder of being alive.",tags:[]},{text:"Every breath fills me with new energy and purpose.",tags:["energy","purpose"]},{text:"I am rediscovering joy in the small moments of life.",tags:["joy"]},{text:"My heart is waking up to passion and curiosity.",tags:["love"]},{text:"I trust that my inner light is returning stronger than before.",tags:["trust"]},{text:"I am not empty; I am creating space for something new.",tags:[]},{text:"I am reconnecting with what truly matters to me.",tags:[]},{text:"Life moves through me, and I allow it to be felt fully.",tags:[]}],"shame_&_guilt":[{text:"I release past mistakes and choose compassion for myself.",tags:["love","forgiveness"]},{text:"I am worthy regardless of what I have done or not done.",tags:["self-worth"]},{text:"I forgive myself and make wise, loving choices now.",tags:["forgiveness","love"]},{text:"My worth is inherent; it is not defined by my actions.",tags:["self-worth"]},{text:"I learn from regret and grow stronger every day.",tags:["growth"]},{text:"I let go of self-blame and welcome healing into my heart.",tags:["love","forgiveness","healing"]},{text:"I accept myself fully and move forward with integrity.",tags:[]},{text:"I replace shame with understanding and curiosity.",tags:[]},{text:"I embrace my imperfections as part of my humanity.",tags:[]},{text:"I am free to start anew; my past does not imprison me.",tags:[]}],"grief_&_loss":[{text:"I allow myself to grieve and honor what was lost.",tags:[]},{text:"Grief is love's reflection; I hold it gently and let it heal.",tags:["love","healing"]},{text:"I am supported as I move through change and loss.",tags:[]},{text:"Memories bring gratitude and peaceful acceptance.",tags:["joy","peace"]},{text:"I make space for sorrow and for new meaning to emerge.",tags:["purpose"]},{text:"My heart heals in its own time and I trust the process.",tags:["trust","love","healing"]},{text:"I carry the love forward and let go of what no longer serves.",tags:["love","forgiveness"]},{text:"I am present to my feelings without being consumed by them.",tags:["focus"]},{text:"Each day I find new ways to remember and to live fully.",tags:[]},{text:"Love remains; loss transforms my life into deeper wisdom.",tags:["love"]}],"anger_&_resentment":[{text:"I acknowledge my anger and release it in healthy ways.",tags:["forgiveness"]},{text:"I choose clarity and calm over prolonged resentment.",tags:["peace","focus"]},{text:"Expressing my truth brings relief and restores my power.",tags:[]},{text:"I set boundaries to protect my peace and dignity.",tags:["peace"]},{text:"I forgive to free myself, not to condone harm.",tags:["forgiveness"]},{text:"Anger guides me to what needs to change; I act wisely.",tags:[]},{text:"I reclaim my energy by letting go of grudges and bitterness.",tags:["energy","forgiveness"]},{text:"I respond with strength and compassion, not with reactivity.",tags:["love"]},{text:"My heart opens as I choose understanding over contempt.",tags:["love"]},{text:"I am in control of my reactions and I choose peace.",tags:["peace"]}],perfectionism:[{text:"I release the need to be perfect; being real is enough.",tags:["self-worth","forgiveness"]},{text:"I celebrate progress, not perfection.",tags:[]},{text:"Mistakes are teachers guiding me toward wisdom.",tags:[]},{text:"I am free to be human, imperfect, and whole.",tags:[]},{text:"I allow myself to rest without guilt or pressure.",tags:["energy"]},{text:"I no longer measure my worth by achievements.",tags:["self-worth"]},{text:"I am learning and growing at my natural pace.",tags:["growth"]},{text:"I replace criticism with compassion for myself.",tags:["love"]},{text:"I am proud of how far I've come, even if I'm not there yet.",tags:[]},{text:"I choose authenticity over approval.",tags:[]}],"overthinking_&_indecision":[{text:"I trust my inner guidance to lead me wisely.",tags:["trust"]},{text:"I release the need to control every outcome.",tags:["forgiveness"]},{text:"Clarity comes when I relax and allow life to unfold.",tags:["focus","peace"]},{text:"I choose action over endless thought.",tags:[]},{text:"My intuition knows what my mind cannot see.",tags:[]},{text:"I let go of mental clutter and make space for peace.",tags:["forgiveness","peace"]},{text:"Every decision I make teaches me something valuable.",tags:[]},{text:"I am learning to trust myself more each day.",tags:["trust"]},{text:"I do not need all the answers to move forward.",tags:[]},{text:"Peace of mind is my natural state, and I return to it often.",tags:["peace"]}],"procrastination_&_self-sabotage":[{text:"I begin now, taking small consistent steps toward my goals.",tags:[]},{text:"My actions create momentum, and momentum creates results.",tags:[]},{text:"I release fear of failure and welcome growth through doing.",tags:["forgiveness","growth"]},{text:"I am disciplined, focused, and kind to myself in the process.",tags:["focus"]},{text:"Each completed task strengthens my confidence and clarity.",tags:["confidence","focus"]},{text:"I replace avoidance with curiosity and forward motion.",tags:[]},{text:"I honor my energy and schedule tasks that match my capacity.",tags:["energy"]},{text:"I forgive past inaction and recommit to steady progress.",tags:["forgiveness"]},{text:"I choose forward movement over perfection paralysis.",tags:[]},{text:"I am capable of finishing what I start with calm focus.",tags:["peace","focus"]}],"people-pleasing_&_approval_addiction":[{text:"I honor my needs and say no when it protects my wellbeing.",tags:[]},{text:"My worth does not depend on others' approval.",tags:["self-worth"]},{text:"I express my truth with kindness and without apology.",tags:["love"]},{text:"I choose integrity over pleasing; my voice matters.",tags:[]},{text:"Setting boundaries cultivates respect and authentic connection.",tags:[]},{text:"I receive feedback without losing my center or identity.",tags:[]},{text:"I trust myself to decide what is right for me.",tags:["trust"]},{text:"I do not need to prove my value through constant compliance.",tags:["self-worth"]},{text:"I am loved for who I am, not for how well I please others.",tags:["love"]},{text:"I choose authenticity over popularity and peace over approval.",tags:["peace"]}],imposter_syndrome:[{text:"I earned my place; my achievements are real and deserved.",tags:[]},{text:"I celebrate my skills and acknowledge my growth.",tags:["growth"]},{text:"I am competent, valuable, and worthy of success.",tags:["self-worth","abundance"]},{text:"Feeling uncertain does not negate my capability.",tags:[]},{text:"I welcome learning as a sign of strength, not flaw.",tags:[]},{text:"I accept praise graciously and internalize my wins.",tags:[]},{text:"I release doubts and stand in the truth of my experience.",tags:["forgiveness"]},{text:"I am qualified and prepared for the opportunities I receive.",tags:[]},{text:"My contribution matters; I bring unique value to the world.",tags:["self-worth"]},{text:"I am enough; I do not need to prove myself to deserve success.",tags:["self-worth","abundance"]}],disconnection_from_purpose:[{text:"My life has meaning, even when I can't see it clearly.",tags:["purpose"]},{text:"I am guided toward purpose one step at a time.",tags:["purpose"]},{text:"I trust that my experiences are shaping me for something greater.",tags:["trust"]},{text:"I am open to discovering new passions and callings.",tags:[]},{text:"My presence alone has value and purpose.",tags:["self-worth","purpose"]},{text:"I align my actions with what feels true to my heart.",tags:["love"]},{text:"I am exactly where I need to be on my journey.",tags:[]},{text:"I release pressure and allow my purpose to reveal itself.",tags:["forgiveness","purpose"]},{text:"I am living a meaningful life right now, in this moment.",tags:[]},{text:"My soul knows the way, and I follow with trust.",tags:["trust"]}],fear_of_death_or_the_unknown:[{text:"I release fear and embrace the mystery of life.",tags:["forgiveness"]},{text:"I trust that life continues beyond what I can see.",tags:["trust"]},{text:"Every breath reminds me that I am part of something eternal.",tags:[]},{text:"I accept impermanence as a natural rhythm of existence.",tags:[]},{text:"I find peace in the cycles of birth, growth, and transformation.",tags:["peace"]},{text:"I focus on living fully rather than fearing endings.",tags:["focus"]},{text:"I am grateful for each moment I am given.",tags:[]},{text:"I trust that my spirit is timeless and free.",tags:["trust"]},{text:"Death is not an end but a return to source.",tags:[]},{text:"I live each day with love, presence, and gratitude.",tags:["joy","love"]}],loss_of_faith_or_meaning:[{text:"I am open to rediscovering meaning in new and unexpected ways.",tags:["purpose"]},{text:"Doubt is a doorway to deeper understanding, not a dead end.",tags:[]},{text:"I am connected to life even when answers are not clear.",tags:[]},{text:"Each day I find small things that restore my sense of wonder.",tags:["healing"]},{text:"I allow my faith to evolve as I grow and learn.",tags:["growth","trust"]},{text:"Purpose emerges when I align with what matters most to me.",tags:["purpose"]},{text:"I trust the unfolding of my spiritual journey without forcing it.",tags:["trust"]},{text:"I find meaning in acts of kindness, presence, and service.",tags:["love","purpose"]},{text:"I am supported by the mystery of life and the love that flows through it.",tags:["love"]},{text:"I open my heart to curiosity, and meaning returns naturally.",tags:["love","purpose"]}],ego_conflict_spiritual:[{text:"I notice my ego with compassion and choose the soul's wisdom.",tags:["love"]},{text:"My true self is quiet, humble, and free from constant seeking.",tags:[]},{text:"I release the need to control identity and embrace deeper truth.",tags:["forgiveness"]},{text:"I choose presence and service over pride and defense.",tags:[]},{text:"The voice of my soul guides me toward alignment and peace.",tags:["peace"]},{text:"I welcome honesty and humility as allies on my path.",tags:[]},{text:"I am more than thoughts, roles, and titles assigned to me.",tags:[]},{text:"I surrender ego-driven fears and act from love and clarity.",tags:["trust","love","focus"]},{text:"I integrate my expressed self with my soul's deepest values.",tags:[]},{text:"I balance healthy self-respect with openness and surrender.",tags:["trust","healing"]}],"rejection_&_abandonment":[{text:"I am whole and complete even when others leave or change.",tags:[]},{text:"I deserve connection and I attract relationships that stay.",tags:["self-worth"]},{text:"My value does not depend on being chosen by anyone else.",tags:["self-worth"]},{text:"I heal from past abandonment with self-compassion and care.",tags:["love","healing"]},{text:"I create safe attachments by showing up honestly and consistently.",tags:[]},{text:"I release fear of being left and trust in my resilience.",tags:["trust","forgiveness"]},{text:"I am loved deeply by myself and others who reflect that care.",tags:["love"]},{text:"Vulnerability invites true connection, not guaranteed rejection.",tags:[]},{text:"Each relationship teaches and strengthens me; I grow from it.",tags:["growth"]},{text:"I am always connected to life and love, even through change.",tags:["love"]}],"failure_&_disappointment":[{text:"Failure is feedback that guides me closer to success.",tags:["abundance"]},{text:"I learn faster when outcomes are not as expected.",tags:["growth"]},{text:"I am resilient and adapt with creativity after setbacks.",tags:[]},{text:"Disappointment clears the path for new choices and opportunities.",tags:[]},{text:"I separate my worth from a single result or outcome.",tags:["self-worth"]},{text:"I am brave enough to try again with more wisdom and skill.",tags:["confidence","self-worth"]},{text:"Setbacks are temporary; my commitment endures.",tags:[]},{text:"I use disappointment as fuel for refining my approach.",tags:[]},{text:"I celebrate effort and progress, not only finished outcomes.",tags:[]},{text:"I am growing stronger from every challenge I face.",tags:["growth"]}],financial_insecurity:[{text:"I am learning to manage money wisely and with confidence.",tags:["confidence"]},{text:"Opportunities for income and stability are available to me now.",tags:[]},{text:"I deserve financial security and I take steps to build it.",tags:["self-worth"]},{text:"I am capable of creating sustainable income streams.",tags:[]},{text:"I release scarcity thoughts and embrace practical abundance.",tags:["forgiveness","abundance"]},{text:"I make choices that protect my future and my peace.",tags:["peace"]},{text:"My financial situation is improving through my consistent actions.",tags:[]},{text:"I attract resources that support my wellbeing and growth.",tags:["growth"]},{text:"I am worthy of prosperity and I plan for it with clarity.",tags:["self-worth","abundance","focus"]},{text:"I trust my ability to create safety and abundance over time.",tags:["trust","abundance"]}],"injustice_&_inequality":[{text:"My voice matters and I use it to promote fairness and dignity.",tags:[]},{text:"I deserve to be treated with respect and equality.",tags:["self-worth"]},{text:"I stand for justice while holding compassion for all involved.",tags:["love"]},{text:"I release internalized oppression and reclaim my inherent worth.",tags:["forgiveness","self-worth"]},{text:"I join with others to create change that uplifts communities.",tags:[]},{text:"I choose productive action over endless resentment.",tags:[]},{text:"I honor my experiences while seeking constructive solutions.",tags:[]},{text:"I am an agent of positive change within my circle of influence.",tags:[]},{text:"I deserve to be seen and compensated fairly for my contributions.",tags:["self-worth"]},{text:"My courage to speak truth paves the way for collective healing.",tags:["confidence","healing"]}],"comparison_&_envy":[{text:"My path is unique and cannot be measured against another's.",tags:[]},{text:"I celebrate others' success and trust mine is unfolding too.",tags:["trust","abundance"]},{text:"Comparison steals joy; I reclaim my own by focusing inward.",tags:["joy"]},{text:"I am inspired, not diminished, by someone else's achievements.",tags:[]},{text:"I measure progress by my values and personal growth.",tags:["growth"]},{text:"Gratitude for what I have transforms envy into motivation.",tags:["joy"]},{text:"I embrace my timing; my season is arriving in perfect order.",tags:[]},{text:"I honor my strengths and work gently on my growth edges.",tags:["growth"]},{text:"I am enough; others' lives do not define my worth.",tags:["self-worth"]},{text:"I am focused on becoming a better version of myself today.",tags:[]}],"information-overload_&_distractions":[{text:"I control my attention; I choose depth over endless input.",tags:["focus"]},{text:"I create quiet space to think, rest, and integrate.",tags:["energy"]},{text:"I limit distractions and protect my mental clarity.",tags:["focus"]},{text:"I process information with calm, not overwhelm.",tags:["peace"]},{text:"I prioritize what matters and release the rest with ease.",tags:["forgiveness","energy"]},{text:"My focus grows stronger each time I practice it.",tags:["focus"]},{text:"I schedule time for meaningful work and for restorative rest.",tags:["energy"]},{text:"I am present with one thing at a time and do it well.",tags:["focus"]},{text:"I am discerning about what I consume and why I consume it.",tags:[]},{text:"I create boundaries with devices and information sources.",tags:[]}],"addiction_&_escapism":[{text:"I am learning healthier ways to soothe and connect with life.",tags:[]},{text:"I choose presence, even when discomfort calls for escape.",tags:[]},{text:"I release habits that numb my heart and limit my freedom.",tags:["love","forgiveness"]},{text:"I replace avoidance with small, sustainable acts of care.",tags:[]},{text:"I am stronger than impulses that lead me away from my goals.",tags:[]},{text:"Support and community help me stay consistent and grounded.",tags:[]},{text:"I forgive myself for past escapes and recommit to wellbeing.",tags:["forgiveness"]},{text:"I welcome curiosity about my needs instead of numbing them.",tags:[]},{text:"I create routines that nourish body, heart, and mind.",tags:["love"]},{text:"Each day I move closer to freedom from unhealthy patterns.",tags:[]}],"burnout_&_exhaustion":[{text:"I honor my limits and replenish my energy before it runs low.",tags:["energy"]},{text:"Rest is productive; recovery strengthens my capacity to perform.",tags:["energy"]},{text:"I set boundaries that protect my time, energy, and health.",tags:["energy"]},{text:"Saying no to some things makes room for what truly matters.",tags:[]},{text:"I balance effort with rest to sustain long-term wellbeing.",tags:["energy","healing"]},{text:"I listen to my body and give it what it needs to recover.",tags:["healing"]},{text:"I reclaim joy through simple, consistent self-care practices.",tags:["joy"]},{text:"I am allowed to pause, reflect, and refuel without guilt.",tags:[]},{text:"I work smart, not just hard, and I delegate when needed.",tags:[]},{text:"My vitality grows as I respect and restore my limits.",tags:["energy","healing"]}],identity_confusion:[{text:"I am allowed to explore and evolve without pressure to decide now.",tags:["growth"]},{text:"My identity is a living process that unfolds with experience.",tags:[]},{text:"I trust myself to discover who I am through curiosity and action.",tags:["trust"]},{text:"I release labels that limit me and embrace my complexity.",tags:["forgiveness"]},{text:"I am grounded in values that guide my choices and shape my identity.",tags:[]},{text:"I accept uncertainty as part of becoming more alive and whole.",tags:[]},{text:"I give myself permission to shift and change authentically.",tags:[]},{text:"I am enough while I explore different parts of myself.",tags:["self-worth"]},{text:"I find clarity through honest reflection and compassionate experimentation.",tags:["focus","love"]},{text:"My true self emerges when I act from integrity and presence.",tags:[]}],ego_conflict_modern_world:[{text:"I notice when the ego reacts and I choose a wiser response.",tags:[]},{text:"I balance ambition with humility and service to others.",tags:["healing"]},{text:"I refuse to let status, image, or approval drive my life.",tags:[]},{text:"I act from values, not from the need to be seen or superior.",tags:[]},{text:"I am aware of my stories and I question them with kindness.",tags:["love"]},{text:"I integrate success with inner simplicity and presence.",tags:["abundance"]},{text:"I honor achievements without inflating or deflating my worth.",tags:["self-worth"]},{text:"I choose connection over competition in daily interactions.",tags:[]},{text:"I observe ego's fears and return to the heart's steady guidance.",tags:["love"]},{text:"I let go of identity traps and act from authentic purpose.",tags:["forgiveness","purpose"]}]};typeof window<"u"&&(window.affirmations=R);const me=Object.freeze(Object.defineProperty({__proto__:null,default:R},Symbol.toStringTag,{value:"Module"})),ge={DEFAULT_AFFIRMATIONS:[{text:"I am worthy of love and belonging exactly as I am",tags:[]},{text:"I trust in the divine timing of my life",tags:[]},{text:"I am safe, protected, and guided",tags:[]}]};class X{constructor(e){this.app=e,this.affirmations=window.affirmations||R||{general_positive_affirmations:ge.DEFAULT_AFFIRMATIONS},this.currentAffirmation=null,this._allAffirmations=null}_getAllAffirmations(){return this._allAffirmations?this._allAffirmations:(this._allAffirmations=Object.values(this.affirmations).flat().filter(Boolean),this._allAffirmations)}_extractText(e){return typeof e=="string"?e:e.text}_getDayOfYear(){const e=new Date,i=new Date(e.getFullYear(),0,0);return Math.floor((e-i)/864e5)}getDailyAffirmation(){const e=this.affirmations.general_positive_affirmations||[];if(!e.length)return console.warn("⚠️ No affirmations loaded, using default"),"I am worthy of love and belonging exactly as I am.";const i=this._getDayOfYear()%e.length,s=e[i];return this._extractText(s)}randomCard(){const e=this._getAllAffirmations();if(!e.length)console.warn("⚠️ No affirmations available, using default"),this.currentAffirmation="I am worthy of love and belonging exactly as I am.";else{const i=Math.floor(Math.random()*e.length),s=e[i];this.currentAffirmation=this._extractText(s)}this.render()}reset(){this.currentAffirmation=null,this.render()}render(){const e=document.getElementById("affirmations-tab");e&&(e.innerHTML=this.currentAffirmation?this._renderFullScreen():this._renderDashboard())}_renderDashboard(){return`
      <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          <h2 class="text-4xl font-bold text-white" style="margin-bottom: 1.5rem;">Positive Affirmations</h2>
          <p class="text-gray-400" style="margin-bottom: 2rem;">Powerful statements to reprogram your mindset</p>

          <div class="text-center" style="margin-bottom: 3rem;">
            <!-- Daily Affirmation Flip Card -->
            <div class="flip-card inline-block w-80 h-48" style="margin-bottom: 2rem;" onclick="this.classList.toggle('flipped')">
              <div class="flip-card-inner">
                <div class="flip-card-front bg-gradient-to-br from-pink-600 to-purple-600 p-8 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-white text-2xl font-bold" style="margin-bottom: 1rem;">Daily Affirmation</p>
                    <p class="text-pink-100" style="display:flex;align-items:center;justify-content:center;gap:0.4rem;">Tap to reveal <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg></p>
                  </div>
                </div>
                <div class="flip-card-back bg-gradient-to-br from-purple-600 to-blue-600 p-8 flex items-center justify-center">
                  <p class="text-white text-xl font-semibold text-center">
                    "${this.getDailyAffirmation()}"
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Random Affirmation Button -->
            <div>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary text-lg" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Random Affirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    `}_renderFullScreen(){return`
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-4xl mx-auto flex items-center justify-center min-h-[80vh]">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-center w-full max-w-2xl">
            
            <!-- Icon Circle -->
            <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto" style="margin-bottom: 2rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;color:white;"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            </div>
            
            <!-- Affirmation Text -->
            <p class="text-white text-4xl font-bold" style="margin-bottom: 3rem;">
              "${this.currentAffirmation}"
            </p>
            
            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
              <button onclick="window.featuresManager.engines.affirmations.reset()" class="btn btn-secondary">
                ← Back
              </button>
              <button onclick="window.featuresManager.engines.affirmations.randomCard()" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/></svg>
                Another One
              </button>
            </div>
          </div>
        </div>
      </div>
    `}}typeof window<"u"&&(window.AffirmationsEngine=X);const pe=Object.freeze(Object.defineProperty({__proto__:null,default:X},Symbol.toStringTag,{value:"Module"})),fe={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},ye={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},we={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Illusion and fantasy. Ground dreams in reality.",8:"Walking away from the familiar. Seeking deeper meaning.",9:"Emotional fulfillment. Wishes granted, contentment realized.",10:"Lasting happiness and family harmony. Emotional abundance overflows."},wands:{1:"Creative spark and new inspiration. Bold initiative ignites passion.",2:"Future planning and decisions. Vision meets preparation.",3:"Expansion and foresight. Progress through strategic action.",4:"Celebration and homecoming. Stability through joyful foundation.",5:"Competition and conflict. Growth through challenge.",6:"Victory and recognition. Success earned through perseverance.",7:"Standing your ground. Defending your position with courage.",8:"Swift action and momentum. Things move quickly now.",9:"Resilience and persistence. Nearly there-don't give up.",10:"Burden of responsibility. Carrying weight that may not be yours."}},ve={pentacles:{Page:"Student of the material world. Eager to learn practical skills and build security.",Knight:"Methodical and reliable. Steady progress toward tangible goals.",Queen:"Nurturer of resources. Abundant, practical, and grounded in care.",King:"Master of the material realm. Wealthy in wisdom and resources."},swords:{Page:"Curious mind seeking truth. Quick wit but inexperienced with consequences.",Knight:"Driven by ideals and logic. Charging forward with mental clarity.",Queen:"Sharp intellect with experience. Clear boundaries and honest communication.",King:"Authority through wisdom. Just, logical, and fair in judgment."},cups:{Page:"Emotionally open and intuitive. Beginning to understand feelings and dreams.",Knight:"Romantic and idealistic. Following the heart with passion.",Queen:"Emotionally mature and compassionate. Deeply intuitive and nurturing.",King:"Emotional mastery and diplomacy. Calm waters and balanced heart."},wands:{Page:"Enthusiastic explorer. New creative ventures and bold messages.",Knight:"Adventurous and impulsive. Chasing passion with fiery energy.",Queen:"Confident and charismatic. Inspiring others through authentic presence.",King:"Visionary leader. Turning inspiration into lasting impact."}},$={11:"Page",12:"Knight",13:"Queen",14:"King"},F={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},j={FLIP_DURATION:900,SCROLL_DELAY:100};class Y{constructor(e){this.app=e,this.TAROT_BASE_URL="/Tarot Cards images/",this.CARD_BACK_URL="/Tarot Cards images/CardBacks.webp",this.spreads={single:{name:"A Single Card Oracle Spread",cards:1,desc:"A Single Card Clarification",positions:["A Single Card"]},three:{name:"A 3 Cards Quick Spread",cards:3,desc:"Past • Present • Future",positions:["Past","Present","Future"]},six:{name:"A 6 Cards Insight Spread",cards:6,desc:"Situational Analysis",positions:["Situation","Challenge","Past Influence","Future Influence","Your Power","Outcome"]},options:{name:"The Options Spread",cards:9,desc:"Evaluate your different Options",positions:["Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)"]},pyramid:{name:"The Pyramid Spread",cards:9,desc:"Triangle of Past – Present – Future",positions:["Where you came from","Where you came from","Where you came from","Where you are now","Where you are now","Where you are now","Where are you going","Where are you going","Where are you going"]},cross:{name:"The Simple Cross Spread",cards:5,desc:"A Simple Cross Snapshot of Now",positions:["Direction of the Situation","The Root of the Situation","Summary","Positive side of Situation","Obstacles-Challenges"]}},this.selectedSpread="single",this.shuffledDeck=[],this.flippedCards=new Set,this.currentReading=[],this.cleanup=null,this.cachedElements={},this.prepareReading()}getTarotCardName(e,i="major"){return i==="major"?fe[e]||"The Fool":e<=10?`${e} of ${F[i]}`:`${$[e]} of ${F[i]}`}getTarotCardImage(e,i="major"){if(i==="major"){const n=String(e).padStart(2,"0"),c=this.getTarotCardName(e,"major").replace(/\s+/g,"");return`${this.TAROT_BASE_URL}${n}-${c}.webp`}const s=i.charAt(0).toUpperCase()+i.slice(1),a=String(e).padStart(2,"0");return`${this.TAROT_BASE_URL}${s}${a}.webp`}getTarotCardMeaning(e,i="major"){var a,n;if(i==="major")return ye[e]||"New beginnings and infinite possibility await you.";if(e<=10)return((a=we[i])==null?void 0:a[e])||"This card brings its unique energy to your reading.";const s=$[e];return((n=ve[i])==null?void 0:n[s])||"This court card represents a person or energy in your life."}buildFullDeck(){const e=["pentacles","swords","cups","wands"];return[...Array.from({length:22},(i,s)=>({type:"major",number:s,suit:"major"})),...e.flatMap(i=>Array.from({length:14},(s,a)=>({type:a<10?"minor":"court",number:a+1,suit:i})))]}shuffleDeck(e){const i=[...e];for(let s=i.length-1;s>0;s--){const a=Math.floor(Math.random()*(s+1));[i[s],i[a]]=[i[a],i[s]]}return i}prepareReading(){const e=this.buildFullDeck();this.shuffledDeck=this.shuffleDeck(e),this.flippedCards.clear(),this.currentReading=[],this.cachedElements={}}flipCard(e){if(this.flippedCards.has(e)||!this.shuffledDeck.length)return;const i=this.cachedElements.pyramid||(this.cachedElements.pyramid=document.querySelector(".pyramid-triangle"));i&&requestAnimationFrame(()=>{i.style.minHeight=`${i.offsetHeight}px`,i.classList.add("flipping"),setTimeout(()=>{i.classList.remove("flipping"),i.style.minHeight=""},j.FLIP_DURATION)}),this.flippedCards.add(e);const s=this.shuffledDeck.pop(),a={name:this.getTarotCardName(s.number,s.suit),meaning:this.getTarotCardMeaning(s.number,s.suit),imageUrl:this.getTarotCardImage(s.number,s.suit),cardData:s};this.currentReading.push(a);const n=document.getElementById(`tarot-card-container-${e}`),c=n==null?void 0:n.querySelector(".tarot-card-front"),m=document.getElementById(`tarot-card-details-${e}`);if(!n||!c||!m){console.error(`[TarotEngine] Failed to find card elements for index ${e}`);return}c.innerHTML=`<img src="${a.imageUrl}" alt="${a.name}" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class='tarot-card-error'>🃏</div>'">`,m.innerHTML=`<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${a.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${a.meaning}</p>`,m.style.opacity="1",m.style.transition="opacity 0.5s ease 0.5s",n.classList.add("flipped"),this.checkSpreadCompletion()}checkSpreadCompletion(){this.flippedCards.size===this.spreads[this.selectedSpread].cards&&this.completeTarotSpread()}completeTarotSpread(){const e=this.spreads[this.selectedSpread].name;if(!["single","three"].includes(this.selectedSpread)){if(this.app.state){const s={spreadType:e,spreadKey:this.selectedSpread,cards:this.currentReading.map(a=>({name:a.name,meaning:a.meaning})),timestamp:new Date().toISOString(),date:new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})};this.app.state.addEntry("tarot",s)}this.app.gamification&&this.app.gamification.incrementTarotSpreads(),this.checkAchievements()}}checkAchievements(){var s,a;const e=((a=(s=this.app.gamification)==null?void 0:s.state)==null?void 0:a.totalTarotSpreads)||0,i=this.app.gamification;i&&(e>=1&&i.checkAndGrantBadge("first_tarot",i.getBadgeDefinitions()),e>=10&&i.checkAndGrantBadge("tarot_apprentice",i.getBadgeDefinitions()),e>=25&&i.checkAndGrantBadge("tarot_mystic",i.getBadgeDefinitions()),e>=75&&i.checkAndGrantBadge("tarot_oracle",i.getBadgeDefinitions()),e>=150&&i.checkAndGrantBadge("tarot_150",i.getBadgeDefinitions()),e>=400&&i.checkAndGrantBadge("tarot_400",i.getBadgeDefinitions()))}buildTarotCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" loading="lazy" decoding="async" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Learn & Practice Tarot with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Explore the cards together. Join live readings, share interpretations,
          and deepen your intuition in a space of collective wisdom.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'tarot'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 8l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z"/></svg>
            Enter the Tarot Room
          </button>
        </div>
      </div>
    `}render(){this.cleanup&&this.cleanup();const e=document.getElementById("tarot-tab");if(!e){console.error("[TarotEngine] tarot-tab element not found");return}const i=this.spreads[this.selectedSpread],s=["options","pyramid","cross"];let a="";if(s.includes(this.selectedSpread))a=this.renderCustomSpread(this.selectedSpread);else{const n=i.cards;let c="md:grid-cols-1";(n===3||n===6)&&(c="tarot-3col-grid");const m=n===1;a=`<div class="grid ${c}${m?"":" place-items-center"}${m?" tarot-single-grid":""}">${Array.from({length:n}).map((y,p)=>this.cardMarkup(p,i.positions[p],m)).join("")}</div>`}e.innerHTML=`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavTarot.webp');
                         --header-title:'';
                         --header-tag:'Self divination, through different Tarot spreads, to assist you in understanding yourself better'">
            <h1>Tarot Cards Guidance</h1>
            <h3>Self divination, through different Tarot spreads, to assist you in understanding yourself better</h3>
            <span class="header-sub"></span>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="margin-bottom: 3rem;">
            ${Object.entries(this.spreads).map(([n,c])=>{var p,d,w,l,r,o,h;const m=["options","pyramid","cross"].includes(n),g=((d=(p=this.app.state)==null?void 0:p.currentUser)==null?void 0:d.isAdmin)||((l=(w=this.app.state)==null?void 0:w.currentUser)==null?void 0:l.isVip),y=m&&!g&&!((h=(o=(r=this.app.gamification)==null?void 0:r.state)==null?void 0:o.unlockedFeatures)!=null&&h.includes("advance_tarot_spreads"));return`
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${n}')"
                   class="card cursor-pointer relative ${this.selectedSpread===n?"border-4":""} ${y?"opacity-75":""}"
                   style="${this.selectedSpread===n?"border-color: var(--neuro-accent);":""} padding: 1.5rem;"
                   title="${y?"Purchase Advanced Tarot Spreads in Karma Shop to unlock":""}">
                ${m?'<span class="premium-badge-tr">PREMIUM</span>':""}
                ${y?'<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':""}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${c.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${c.desc}</p>
              </div>`}).join("")}
          </div>

          <div style="margin-bottom: 3rem; padding: 0 1.5rem;">
            ${(()=>{var g,y,p,d,w,l,r,o,h,f;const m=!(((p=(y=(g=this.app)==null?void 0:g.state)==null?void 0:y.currentUser)==null?void 0:p.isAdmin)||((l=(w=(d=this.app)==null?void 0:d.state)==null?void 0:w.currentUser)==null?void 0:l.isVip)||((f=(h=(o=(r=this.app)==null?void 0:r.gamification)==null?void 0:o.state)==null?void 0:h.unlockedFeatures)==null?void 0:f.includes("tarot_vision_ai")));return`
                <button id="tarot-vision-ai-btn"
                        class="btn ${m?"opacity-50 cursor-not-allowed":"hover:scale-[1.02]"}"
                        style="position:relative;display:flex !important;align-items:center;gap:1.25rem;
                               width:100%;padding:1.25rem 1.5rem;text-align:left;border-radius:0.75rem;
                               min-height:5rem;box-sizing:border-box;">
                  <span class="premium-badge" style="position:absolute;top:0.6rem;right:0.6rem;margin:0;z-index:1;">PREMIUM</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;flex-shrink:0;"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12s1.5-3 5-3 5 3 5 3-1.5 3-5 3-5-3-5-3Z"/><circle cx="12" cy="12" r="1"/></svg>
                  <span style="display:flex;flex-direction:column;gap:0.2rem;flex:1;min-width:0;padding-right:${m?"3rem":"4rem"};">
                    <span style="font-size:1.2rem;font-weight:700;line-height:1.2;white-space:nowrap;">Tarot Vision AI</span>
                    <span style="font-size:0.9rem;font-weight:400;opacity:0.85;line-height:1.3;white-space:normal;">Take a picture or upload a tarot card to analyse it</span>
                  </span>
                  ${m?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.75rem;height:1.75rem;opacity:0.45;flex-shrink:0;margin-left:auto;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                </button>`})()}
          </div>

          <div class="card" id="tarot-cards-result" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${i.name}</h3>
            </div>
            ${a}
          </div>

          ${this.buildTarotCTA()}

        </div>
      </div>

<style>
  .tarot-card-flip-container { 
    width: 100%;
    aspect-ratio: 200 / 350; 
    perspective: 1000px; 
    cursor: pointer; 
    position: relative;
    margin: 0 auto;
  }
  
  .tarot-card-flip-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
  }
  
  .tarot-card-flip-container.flipped .tarot-card-flip-inner {
    transform: rotateY(180deg);
  }
  
  .tarot-card-front,
  .tarot-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .tarot-card-back {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .tarot-card-back img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .card-reveal-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    text-align: center;
    color: var(--neuro-text);
    font-weight: 600;
    margin: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: 2px solid rgba(128, 0, 128, 0.8);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    white-space: nowrap;
    font-size: 0.7rem;
    max-width: 90%;
  }
  
  .tarot-card-front {
    transform: rotateY(180deg);
  }
  
  .tarot-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .tarot-card-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background: #1a1a1a;
    border-radius: 8px;
  }
  
  /* Single card spread - fills container on mobile, capped on desktop */
  .tarot-single-grid {
    width: 100%;
  }
  .tarot-single-grid .flex.flex-col.items-center.mx-auto {
    width: 100%;
    max-width: 100%;
  }
  .tarot-single-grid .tarot-card-flip-container {
    width: 100%;
    max-width: 100%;
  }

  /* Shared 3-column grid — always 3 cols, always fits container */
  .tarot-3col-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 0.5rem;
    width: 100%;
    overflow: hidden;
  }
  .tarot-3col-grid .flex.flex-col.items-center.mx-auto {
    width: 100% !important;
    max-width: 100% !important;
  }
  .tarot-3col-grid .tarot-card-flip-container {
    max-width: 100% !important;
    width: 100% !important;
  }

  @media (min-width: 400px) {
    .tarot-3col-grid { gap: 0.65rem; }
  }
  @media (min-width: 640px) {
    .tarot-3col-grid { gap: 0.75rem; }
  }
  @media (min-width: 768px) {
    .tarot-3col-grid { gap: 1rem 1.5rem; }
    .tarot-card-flip-container { max-width: 220px; }
    .tarot-single-grid .flex.flex-col.items-center.mx-auto { width: 320px; max-width: 320px; }
    .tarot-single-grid .tarot-card-flip-container { max-width: 320px !important; }
    .card-reveal-prompt {
      padding: 1rem 1.5rem;
      border-width: 3px;
      font-size: 1rem;
    }
  }
  @media (min-width: 1600px) {
    .tarot-card-flip-container { max-width: 240px; }
    .tarot-single-grid .flex.flex-col.items-center.mx-auto { width: 360px; max-width: 360px; }
    .tarot-single-grid .tarot-card-flip-container { max-width: 360px !important; }
  }
  
  /* Pyramid layout */
  .pyramid-triangle { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .pyr-row { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
    width: 100%; 
  }
  
  @media (min-width: 768px) {
    .pyramid-triangle { gap: 1rem; }
    .pyr-row { gap: 1rem; }
    .pyr-apex { gap: 2rem; }
    .pyr-upper { gap: 8rem; }
    .pyr-lower { gap: 14rem; }
    .pyr-base { gap: 6rem; }
  }
  
  @media (min-width: 1024px) {
    .pyr-upper { gap: 15rem; }
    .pyr-lower { gap: 25rem; }
    .pyr-base { gap: 12rem; }
  }
  
  /* Cross layout */
  .cross-shape { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 0.5rem; 
  }
  
  .cross-top, 
  .cross-bot { 
    display: flex; 
    justify-content: center; 
  }
  
  .cross-mid { 
    display: flex; 
    justify-content: center; 
    gap: 0.5rem; 
  }
  
  @media (min-width: 768px) {
    .cross-shape { gap: 1rem; }
    .cross-mid { gap: 8rem; }
  }
  
  @media (min-width: 1024px) {
    .cross-mid { gap: 15rem; }
  }
  
  .premium-badge {
    position: static;
    transform: none;
    margin-left: 0.75rem;
    background: linear-gradient(135deg, #fcd34d, #f59e0b);
    color: #111;
    font-size: .65rem;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 9999px;
    letter-spacing: .5px;
  }
</style>
    `,this.init()}cardMarkup(e,i,s=!1){const a=s?"width:100%;":"width: clamp(140px, 24vw, 250px);",n=s?"clamp(80px, 16vw, 120px)":"clamp(60px, 12vw, 100px)";return`
      <div class="flex flex-col items-center mx-auto" style="${a}">
        <h4 class="text-lg font-bold h-8" style="color: var(--neuro-accent); margin-bottom: 0rem;">${i}</h4>
        <div class="tarot-card-flip-container" id="tarot-card-container-${e}" onclick="window.featuresManager.engines.tarot.flipCard(${e})">
          <div class="tarot-card-flip-inner">
            <div class="tarot-card-back">
              <p class="card-reveal-prompt">Click to reveal</p>
              <img src="${this.CARD_BACK_URL}" alt="Card Back" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350">
            </div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div id="tarot-card-details-${e}" class="text-center" style="opacity: 0; height: ${n}; overflow-y: auto; margin-top: 0rem;"></div>
      </div>`}renderCustomSpread(e){const i=this.spreads[e].positions;if(e==="options")return`
        <div class="flex flex-col items-center" style="width:100%;">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${i.slice(0,3).map((s,a)=>this.cardMarkup(a,s)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${i.slice(3,6).map((s,a)=>this.cardMarkup(a+3,s)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid tarot-3col-grid place-items-center" style="width:100%;">
            ${i.slice(6,9).map((s,a)=>this.cardMarkup(a+6,s)).join("")}
          </div>
        </div>`;if(e==="pyramid")return`
        <div class="pyramid-triangle">
          <div class="pyr-row pyr-apex">${this.cardMarkup(8,i[8])}${this.cardMarkup(0,i[0])}</div>
          <div class="pyr-row pyr-upper">${this.cardMarkup(7,i[7])}${this.cardMarkup(1,i[1])}</div>
          <div class="pyr-row pyr-lower">${this.cardMarkup(6,i[6])}${this.cardMarkup(2,i[2])}</div>
          <div class="pyr-row pyr-base">${this.cardMarkup(5,i[5])}${this.cardMarkup(4,i[4])}${this.cardMarkup(3,i[3])}</div>
        </div>`;if(e==="cross")return`
        <div class="cross-shape">
          <div class="cross-top">${this.cardMarkup(3,i[3])}</div>
          <div class="cross-mid">${this.cardMarkup(0,i[0])}${this.cardMarkup(2,i[2])}${this.cardMarkup(1,i[1])}</div>
          <div class="cross-bot">${this.cardMarkup(4,i[4])}</div>
        </div>`}init(){setTimeout(()=>{const e=document.getElementById("tarot-vision-ai-btn");if(e){const i=()=>{var n,c,m,g,y,p,d,w,l,r,o,h,f,x;!(((m=(c=(n=this.app)==null?void 0:n.state)==null?void 0:c.currentUser)==null?void 0:m.isAdmin)||((p=(y=(g=this.app)==null?void 0:g.state)==null?void 0:y.currentUser)==null?void 0:p.isVip))&&!((r=(l=(w=(d=this.app)==null?void 0:d.gamification)==null?void 0:w.state)==null?void 0:l.unlockedFeatures)!=null&&r.includes("tarot_vision_ai"))?(h=(o=this.app)==null?void 0:o.showToast)==null||h.call(o,"Unlock Tarot Vision AI in the Karma Shop!","info"):(x=(f=this.app)==null?void 0:f.showToast)==null||x.call(f,"Tarot Vision AI opening...","info")};e.onclick=i,this.cleanup=()=>{e.onclick=null}}},0)}selectSpread(e){var a,n,c,m,g,y,p,d,w,l,r,o;const i=["options","pyramid","cross"];if(!(((c=(n=(a=this.app)==null?void 0:a.state)==null?void 0:n.currentUser)==null?void 0:c.isAdmin)||((y=(g=(m=this.app)==null?void 0:m.state)==null?void 0:g.currentUser)==null?void 0:y.isVip))&&i.includes(e)&&!((l=(w=(d=(p=this.app)==null?void 0:p.gamification)==null?void 0:d.state)==null?void 0:w.unlockedFeatures)!=null&&l.includes("advance_tarot_spreads"))){(o=(r=this.app)==null?void 0:r.showToast)==null||o.call(r,"Unlock Advanced Tarot Spreads in the Karma Shop!","info");return}this.selectedSpread=e,this.prepareReading(),this.render(),setTimeout(()=>{const h=document.querySelector("#tarot-cards-result");h&&h.scrollIntoView({behavior:"smooth",block:"start"})},j.SCROLL_DELAY)}reset(){this.selectSpread(this.selectedSpread)}}typeof window<"u"&&(window.TarotEngine=Y);const K=Object.freeze(Object.defineProperty({__proto__:null,default:Y},Symbol.toStringTag,{value:"Module"}));(function(){const t={PULSE_POOL_SIZE:10,AUTO_TRIGGER:!1},e={BREATH_PULSE_INTERVAL:1e3,EXHALE_PULSE_INTERVAL:900,RELAX_PULSE_INTERVAL:1800,RELAX_TRANSITION:2600,TEXT_FADE:100,SCALE_BOUNCE:240,ESCAPE_DEBOUNCE:300},i={inhale:"Inhale deeply",hold:"HOLD",exhale:"Exhale slowly",relax:"Now Relax"},s={selfReset:{id:"selfreset",title:"Self Reset",duration:60,type:"breathing",breathIn:7,breathHold:3,breathOut:7,completeRounds:3,storagePrefix:"pc_wellness_selfreset",gradient:"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"},fullBodyScan:{id:"fullbodyscan",title:"Full Body Scan",duration:120,type:"zones",zones:["Top of head","Back of head","Face","Throat and neck","Shoulders","Arms and hands","Chest","Stomach","Back (upper and lower)","Pelvic area","Legs","Feet"],storagePrefix:"pc_wellness_fullbodyscan",gradient:"linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"},nervousSystem:{id:"nervoussystem",title:"Nervous System Reset",duration:60,type:"steps",steps:["Shake your hands","Roll your shoulders","Stick out your tongue to relax the jaw","Relax your face, especially around the eyes","Take one long sigh","Feel your feet on the ground","Settle your breath naturally"],stepDurations:[9,9,9,9,8,8,8],storagePrefix:"pc_wellness_nervoussystem",gradient:"linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"},tensionSweep:{id:"tensionsweep",title:"Tension Sweep",duration:120,type:"zones",zones:["Lift shoulders to your ears then drop","Shake your arms loosely","Shake your legs","Twist your spine gently left and right","Circle your hips slowly","Open your chest, expand your ribcage","Drop your head forward and roll gently","Shake your whole body lightly"],storagePrefix:"pc_wellness_tensionsweep",gradient:"linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"}},a=`
  /* Wellness Kit styles - inherits CSS variables from main-styles.css */

  .wk-overlay {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    background: transparent;
    backdrop-filter: blur(6px);
    z-index: 999995;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .wk-box {
    width: 460px;
    max-width: calc(100% - 32px);
    border-radius: var(--radius-xl);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    padding: 32px;
    text-align: center;
    animation: wk-fadeIn 400ms ease;
    position: relative;
    overflow: hidden;
  }

  .wk-box::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.95;
    z-index: -1;
  }

  .wk-box h2 {
    margin: 0 0 20px 0;
    font-size: 32px;
    font-weight: 800;
    color: #1a202c;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .wk-ring-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 200px;
    height: 200px;
    margin: 12px auto 20px;
  }

  .wk-timer {
    position: absolute;
    z-index: 4;
    font-size: 44px;
    font-weight: 700;
    color: var(--neuro-text);
    user-select: none;
  }

  .wk-ring {
    width: 200px;
    height: 200px;
    transform: rotate(-90deg);
    z-index: 2;
  }

  .wk-anim {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.4),
                0 0 80px rgba(255, 215, 0, 0.2),
                inset 0 0 60px rgba(255, 255, 255, 0.3);
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 215, 0, 0.3) 50%, transparent 70%);
    animation: wk-breathePulse 3s ease-in-out infinite;
    will-change: transform;
  }

  @keyframes wk-breathePulse {
    0%, 100% { 
      transform: scale(1); 
      box-shadow: 0 0 40px rgba(255, 215, 0, 0.4),
                  0 0 80px rgba(255, 215, 0, 0.2),
                  inset 0 0 60px rgba(255, 255, 255, 0.3);
    }
    50% { 
      transform: scale(1.15); 
      box-shadow: 0 0 60px rgba(255, 215, 0, 0.6),
                  0 0 120px rgba(255, 215, 0, 0.4),
                  inset 0 0 80px rgba(255, 255, 255, 0.5);
    }
  }

  .wk-pulses {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .wk-pulse {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0.2);
    background: radial-gradient(circle, rgba(102, 126, 234, 0.18), transparent 60%);
    opacity: 0;
    will-change: transform, opacity;
  }

  .wk-pulse.active {
    animation: wk-pulseGrow 1100ms ease-out forwards;
  }

  @keyframes wk-pulseGrow {
    to { transform: translate(-50%, -50%) scale(3.2); opacity: 0; }
  }

  .wk-text {
    margin-top: 12px;
    font-weight: 700;
    color: #1a202c;
    font-size: 22px;
    min-height: 32px;
    transition: opacity 200ms ease;
    line-height: 1.3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .wk-text.changing {
    opacity: 0.5;
  }

  .wk-mini-count {
    font-weight: 700;
    font-size: 18px;
    color: #2d3748;
    opacity: 0.9;
    margin-top: 8px;
    min-height: 24px;
  }

  .wk-stats {
    display: none;
  }

  .wk-footer {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }

  .wk-btn {
    padding: 12px 24px;
    border-radius: 14px;
    border: none;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: var(--neuro-text);
    font-weight: 700;
    cursor: pointer;
    transition: all 180ms ease-in-out;
    min-width: 90px;
    font-size: 15px;
  }

  .wk-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .wk-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .wk-toast {
    position: fixed;
    right: 18px;
    bottom: 18px;
    background: var(--neuro-bg);
    box-shadow: var(--shadow-raised);
    padding: 10px 14px;
    border-radius: 12px;
    color: var(--neuro-text);
    font-weight: 700;
    z-index: 1000001;
    opacity: 0;
    transform: translateY(8px);
    transition: all 260ms ease;
  }

  .wk-toast.show {
    opacity: 1;
    transform: translateY(0);
  }

  .hidden { display: none !important; }

  @keyframes wk-fadeIn {
    from { opacity: 0; transform: translateY(12px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  :focus-visible {
    outline: 3px solid rgba(102, 126, 234, 0.3);
    outline-offset: 3px;
  }
  `,n=document.createElement("style");n.textContent=a,document.head.appendChild(n);const c={ctx:null};function m(){try{c.ctx||(c.ctx=new(window.AudioContext||window.webkitAudioContext));const l=c.ctx,r=l.currentTime,o=l.createOscillator(),h=l.createOscillator(),f=l.createGain(),x=l.createBiquadFilter();o.type="sine",h.type="sine",o.frequency.value=660,h.frequency.value=990,h.detune.value=6,x.type="lowpass",x.frequency.value=2600,f.gain.setValueAtTime(1e-4,r),f.gain.exponentialRampToValueAtTime(.28,r+.02),f.gain.exponentialRampToValueAtTime(.001,r+1.5),o.connect(x),h.connect(x),x.connect(f),f.connect(l.destination),o.start(r),h.start(r),o.stop(r+1.5),h.stop(r+1.5)}catch(l){console.warn("WellnessKit: Audio playback failed",l)}}class g{constructor(r){if(!r||!r.id||!r.duration||!r.type)throw new Error("WellnessKit: Invalid tool configuration");this.config=r,this.state={remaining:r.duration,mainInterval:null,phaseTimeout:null,pulseInterval:null,currentIndex:0,isRunning:!1,countdownInterval:null},this.createUI(),this.initPulsePool(),this.attachEvents(),this.resetState()}createUI(){const r=document.createElement("div");r.innerHTML=`
        <div class="wk-overlay" id="wk-${this.config.id}-overlay" role="dialog" aria-labelledby="wk-${this.config.id}-title" aria-modal="true">
          <div class="wk-box" id="wk-${this.config.id}-box">
            <h2 id="wk-${this.config.id}-title">${this.config.title}</h2>
            <div class="wk-ring-wrap">
              <div class="wk-anim" id="wk-${this.config.id}-anim"></div>
              <svg class="wk-ring" viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="wk-${this.config.id}-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#667eea"/>
                    <stop offset="100%" stop-color="#764ba2"/>
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" stroke="rgba(0,0,0,0.06)" stroke-width="8" fill="none"/>
                <circle id="wk-${this.config.id}-progress" cx="50" cy="50" r="40" stroke="url(#wk-${this.config.id}-grad)" stroke-width="8" stroke-linecap="round" fill="none" stroke-dasharray="251.2" stroke-dashoffset="0"/>
              </svg>
              <div class="wk-pulses" id="wk-${this.config.id}-pulses"></div>
              <div class="wk-timer" id="wk-${this.config.id}-timer" aria-live="polite">${this.config.duration}</div>
            </div>
            <div class="wk-text" id="wk-${this.config.id}-text" aria-live="polite"></div>
            ${this.config.type==="breathing"?'<div class="wk-mini-count" id="wk-'+this.config.id+'-count" aria-live="polite"></div>':""}
            <div class="wk-footer">
              <button class="wk-btn" id="wk-${this.config.id}-start" aria-label="Start session">Start</button>
              <button class="wk-btn hidden" id="wk-${this.config.id}-finish" aria-label="Mark as finished">Finished</button>
              <button class="wk-btn" id="wk-${this.config.id}-close" aria-label="Close session">Close</button>
            </div>
          </div>
        </div>
      `,document.body.appendChild(r),this.elements={overlay:document.getElementById(`wk-${this.config.id}-overlay`),box:document.getElementById(`wk-${this.config.id}-box`),timer:document.getElementById(`wk-${this.config.id}-timer`),progress:document.getElementById(`wk-${this.config.id}-progress`),pulses:document.getElementById(`wk-${this.config.id}-pulses`),anim:document.getElementById(`wk-${this.config.id}-anim`),text:document.getElementById(`wk-${this.config.id}-text`),count:document.getElementById(`wk-${this.config.id}-count`),btnStart:document.getElementById(`wk-${this.config.id}-start`),btnFinish:document.getElementById(`wk-${this.config.id}-finish`),btnClose:document.getElementById(`wk-${this.config.id}-close`)},this.elements.box.style.background=this.config.gradient,this.R=40,this.CIRC=2*Math.PI*this.R,this.elements.progress.style.strokeDasharray=this.CIRC}initPulsePool(){this.pulsePool=[],this.pulseIndex=0;for(let r=0;r<t.PULSE_POOL_SIZE;r++){const o=document.createElement("div");o.className="wk-pulse",this.elements.pulses.appendChild(o),this.pulsePool.push(o)}}spawnPulse(){const r=this.pulsePool[this.pulseIndex];this.pulseIndex=(this.pulseIndex+1)%t.PULSE_POOL_SIZE,r.classList.remove("active"),r.offsetWidth,r.classList.add("active")}spawnPulseWithInterval(r){this.spawnPulse(),this.state.pulseInterval&&clearInterval(this.state.pulseInterval),this.state.pulseInterval=setInterval(()=>this.spawnPulse(),r)}setProgress(r,o){const h=Math.max(0,Math.min(1,r/o)),f=this.CIRC*(1-h);this.elements.progress.style.strokeDashoffset=f}clearTimers(){[this.state.mainInterval,this.state.phaseTimeout,this.state.pulseInterval,this.state.countdownInterval].forEach(o=>{o&&(clearInterval(o),clearTimeout(o))}),this.state.mainInterval=null,this.state.phaseTimeout=null,this.state.pulseInterval=null,this.state.countdownInterval=null}resetAnimationTransition(){this.elements.anim.style.transition=""}resetState(){this.clearTimers(),this.state.remaining=this.config.duration,this.state.currentIndex=0,this.state.isRunning=!1,this.elements.timer.textContent=String(this.config.duration),this.setProgress(this.config.duration,this.config.duration),this.elements.btnFinish.classList.add("hidden"),this.elements.btnStart.classList.remove("hidden"),this.elements.btnStart.textContent="Start",this.elements.anim.style.transform="scale(1.0)",this.elements.anim.style.opacity="0.9",this.resetAnimationTransition(),this.config.type==="breathing"?(this.elements.text.textContent=i.inhale,this.elements.count&&(this.elements.count.textContent=String(this.config.breathIn))):this.config.type==="zones"?this.elements.text.textContent=this.config.zones[0]:this.config.type==="steps"&&(this.elements.text.textContent=this.config.steps[0])}startMainTimer(){this.state.mainInterval||(this.state.isRunning=!0,this.elements.btnStart.textContent="Stop",this.config.type==="breathing"?this.startBreathingCycle():this.startPhaseLoop(),this.state.mainInterval=setInterval(()=>{this.state.remaining-=1,this.state.remaining<0&&(this.state.remaining=0),this.elements.timer.textContent=String(this.state.remaining),this.setProgress(this.state.remaining,this.config.duration),this.state.remaining<=0&&(this.clearTimers(),this.finalizeSession())},1e3))}stopMainTimer(){this.clearTimers(),this.state.isRunning=!1,this.elements.btnStart.textContent="Start",this.resetAnimationTransition()}getCompletedCycles(){const r=this.config.duration-this.state.remaining,o=this.config.breathIn+this.config.breathHold+this.config.breathOut;return Math.floor(r/o)}startBreathingCycle(){const r=()=>{m(),this.setBreathPhase("inhale",this.config.breathIn),this.elements.anim.style.transition=`transform ${this.config.breathIn}s linear`,this.elements.anim.style.transform="scale(1.14)",this.spawnPulseWithInterval(e.BREATH_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),o()},this.config.breathIn*1e3)},o=()=>{this.state.remaining<=0||(this.setBreathPhase("hold",this.config.breathHold),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${this.config.breathHold}s linear`,this.elements.anim.style.transform="scale(1.18)",this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),h()},this.config.breathHold*1e3))},h=()=>{this.state.remaining<=0||(this.setBreathPhase("exhale",this.config.breathOut),this.elements.anim.style.transition=`transform ${this.config.breathOut}s linear`,this.elements.anim.style.transform="scale(0.94)",this.spawnPulseWithInterval(e.EXHALE_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),f()},this.config.breathOut*1e3))},f=()=>{if(this.state.remaining<=0)return;this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.getCompletedCycles()>=this.config.completeRounds?x():r()},x=()=>{this.setBreathPhase("relax",null),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${e.RELAX_TRANSITION}ms ease-in-out`,this.elements.anim.style.transform="scale(1.0)",this.spawnPulseWithInterval(e.RELAX_PULSE_INTERVAL)};r()}setBreathPhase(r,o){if(this.elements.text.textContent=i[r]||"",r==="relax"){this.elements.count&&(this.elements.count.textContent="");return}if(this.elements.count&&o){this.state.countdownInterval&&clearInterval(this.state.countdownInterval);let h=o;this.elements.count.textContent=String(h),this.state.countdownInterval=setInterval(()=>{h-=1,h<=0?(this.elements.count.textContent="0",clearInterval(this.state.countdownInterval),this.state.countdownInterval=null):this.elements.count.textContent=String(h)},1e3)}}startPhaseLoop(){const r=this.config.zones||this.config.steps,o=()=>{if(!(this.state.remaining<=0)&&(this.elements.text.classList.add("changing"),setTimeout(()=>{this.elements.text.textContent=r[this.state.currentIndex],this.elements.text.classList.remove("changing"),this.spawnPulse(),this.elements.anim.style.transition="transform 0.24s ease-out",this.elements.anim.style.transform="scale(1.08)",setTimeout(()=>{this.elements.anim.style.transform="scale(1.0)",setTimeout(()=>this.resetAnimationTransition(),e.SCALE_BOUNCE)},e.SCALE_BOUNCE)},e.TEXT_FADE),this.state.currentIndex<r.length-1)){const f=this.config.stepDurations?this.config.stepDurations[this.state.currentIndex]*1e3:this.config.duration/r.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,o()},f)}};this.elements.text.textContent=r[0],this.spawnPulse();const h=this.config.stepDurations?this.config.stepDurations[0]*1e3:this.config.duration/r.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,o()},h)}completeSession(){var r;m();try{(r=window.app)!=null&&r.gamification&&(window.app.gamification.incrementWellnessRuns(),window.app.gamification.addBoth(10,1,"Wellness Practice"))}catch(o){console.warn("WellnessKit: Gamification integration failed",o)}}finalizeSession(){this.completeSession(),this.elements.btnStart.classList.add("hidden"),this.elements.btnFinish.classList.remove("hidden"),setTimeout(()=>this.close(),1200)}open(){this.resetState(),this.elements.overlay.style.display="flex",setTimeout(()=>this.elements.btnStart.focus(),100)}close(){this.stopMainTimer(),this.elements.overlay.style.display="none",this.resetState()}attachEvents(){this.elements.btnStart.addEventListener("click",()=>{this.state.mainInterval?this.stopMainTimer():(this.state.remaining<=0&&this.resetState(),this.startMainTimer())}),this.elements.btnFinish.addEventListener("click",()=>{this.completeSession(),this.close()}),this.elements.btnClose.addEventListener("click",()=>this.close()),this.elements.overlay.addEventListener("click",r=>{r.target===this.elements.overlay&&this.close()})}getStats(){return{autoTriggerEnabled:t.AUTO_TRIGGER}}destroy(){this.clearTimers(),this.elements.overlay&&this.elements.overlay.parentNode&&this.elements.overlay.parentNode.removeChild(this.elements.overlay)}}const y=new Set;let p=null;document.addEventListener("keydown",l=>{if(l.key==="Escape"){if(p)return;p=setTimeout(()=>p=null,e.ESCAPE_DEBOUNCE),y.forEach(r=>{r.elements.overlay.style.display==="flex"&&r.close()})}});const d={selfReset:new g(s.selfReset),fullBodyScan:new g(s.fullBodyScan),nervousSystem:new g(s.nervousSystem),tensionSweep:new g(s.tensionSweep)};Object.values(d).forEach(l=>y.add(l)),window.addEventListener("beforeunload",()=>{if(Object.values(d).forEach(l=>{l.clearTimers(),l.destroy()}),c.ctx)try{c.ctx.close(),c.ctx=null}catch(l){console.warn("WellnessKit: Audio context cleanup failed",l)}}),window.WellnessKit={openSelfReset:()=>d.selfReset.open(),openFullBodyScan:()=>d.fullBodyScan.open(),openNervousReset:()=>d.nervousSystem.open(),openTensionSweep:()=>d.tensionSweep.open(),closeSelfReset:()=>d.selfReset.close(),closeFullBodyScan:()=>d.fullBodyScan.close(),closeNervousReset:()=>d.nervousSystem.close(),closeTensionSweep:()=>d.tensionSweep.close(),getSelfResetStats:()=>d.selfReset.getStats(),getFullBodyScanStats:()=>d.fullBodyScan.getStats(),getNervousResetStats:()=>d.nervousSystem.getStats(),getTensionSweepStats:()=>d.tensionSweep.getStats(),getAllStats:()=>({selfReset:d.selfReset.getStats(),fullBodyScan:d.fullBodyScan.getStats(),nervousSystem:d.nervousSystem.getStats(),tensionSweep:d.tensionSweep.getStats()}),playChime:m},["SelfReset","FullBodyScan","NervousReset","TensionSweep"].forEach(l=>{window[`open${l}`]=window.WellnessKit[`open${l}`],window[`close${l}`]=window.WellnessKit[`close${l}`],window[`get${l}Stats`]=window.WellnessKit[`get${l}Stats`]})})();const U=()=>Promise.all([u(()=>Promise.resolve().then(()=>K),void 0),u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.T),[]),u(()=>import("./KarmaShopEngine-D1yE7bQ-.js"),[]),u(()=>import("./EnergyTracker-4z8lVD8r.js"),[]),u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.C),[]),u(()=>import("./GratitudeEngine-CGH7Iehb.js"),__vite__mapDeps([5,6,3,2,4])),u(()=>import("./HappinessEngine-CYGd-V4Q.js"),__vite__mapDeps([0,1,2,3,4])),u(()=>import("./InquiryEngine-BOqjDi6m.js"),[]),u(()=>import("./JournalEngine-n3UWMAm1.js"),__vite__mapDeps([7,6,3,2,4])),u(()=>import("./MeditationsEngine-CES81Rz5.js"),[])]),z=()=>Promise.all([u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.i),[]),u(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.s),[])]);let H=!1;window.lazyLoadCommunityHub=async function(){H||(H=!0,await u(()=>import("./community-hub-uUiMGgF_.js").then(t=>t.c),__vite__mapDeps([3,2])))};"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch(t=>console.error("[SW] Registration failed:",t))});async function V(){try{const[t,{QUOTES:e,getRandomQuote:i,getQuoteOfTheDay:s},a,{default:n}]=await Promise.all([u(()=>Promise.resolve().then(()=>me),void 0),u(()=>import("./QuotesList-BeF9xuKi.js"),[]),u(()=>import("./Index-DLrUEHAr.js"),__vite__mapDeps([9,10,3,2,4,1,6,11])),u(()=>import("./User-Tab-B5acZz4N.js"),__vite__mapDeps([10,3,2,4]))]);window.affirmations=t.default,window.QuotesData={QUOTES:e,getRandomQuote:i,getQuoteOfTheDay:s},window.app=new a.ProjectCuriosityApp({AppState:a.AppState,AuthManager:a.AuthManager,NavigationManager:a.NavigationManager,DashboardManager:a.DashboardManager,UserTab:n}),window.app.init(),typeof requestIdleCallback=="function"?requestIdleCallback(()=>{U(),z()},{timeout:3e3}):setTimeout(()=>{U(),z()},1500)}catch(t){console.error("[FATAL] Bootstrap failed:",t),document.body.innerHTML='<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",V):V();export{Y as T,R as a,ae as b,se as c,Ee as g,ke as i,Se as s};
