const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HappinessEngine-COC8D6fL.js","assets/AffirmationsList-BRihhJ1z.js","assets/InquiryEngine-B7K3N7NS.js","assets/GratitudeEngine-8ZEFJ6la.js","assets/Modal-D1w-jT8W.js","assets/community-hub-Bv-lWZW8.js","assets/features-lazy-bN0WDG2L.js","assets/supabase-k82gbVKr.js","assets/AffirmationsEngine-Bx6vBmMJ.js","assets/JournalEngine-ClVG77ET.js","assets/self-analysis-DTZq9LK-.js","assets/css-user-tab-Ccb-nWXy.css","assets/css-community-DfQOeiJH.css","assets/mobile-styles-DQ9VeK4i.css","assets/Index-BnNv-RrP.js","assets/User-Tab-B7kyMKGf.js","assets/GamificationEngine-EfFpmezy.js"])))=>i.map(i=>d[i]);
var L=t=>{throw TypeError(t)};var X=(t,e,i)=>e.has(t)||L("Cannot "+i);var N=(t,e,i)=>(X(t,e,"read from private field"),i?i.call(t):e.get(t)),M=(t,e,i)=>e.has(t)?L("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i);import{_ as p}from"./features-lazy-bN0WDG2L.js";import"./community-hub-Bv-lWZW8.js";import{c as Y}from"./supabase-k82gbVKr.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function i(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=i(n);fetch(n.href,a)}})();(function(){const t={CHARS:"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789",COLUMNS_MOBILE:12,COLUMNS_DESKTOP:25,CHAR_COUNT:100,SPEED_MOBILE:3,SPEED_DESKTOP:3,RANDOM_MOBILE:4,RANDOM_DESKTOP:4,FONT_MOBILE:16,FONT_DESKTOP:24,LINE_MOBILE:20,LINE_DESKTOP:28};class e{constructor(){this.container=null,this.columns=[],this.animationId=null,this.isRunning=!1}init(){document.body.classList.contains("matrix-code")&&(this.createContainer(),this.createColumns(),this.isRunning=!0,this.animate())}createContainer(){this.container=document.createElement("div"),this.container.style.cssText="position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;z-index:1!important;pointer-events:none!important;overflow:hidden!important;",document.body.insertBefore(this.container,document.body.firstChild)}createColumns(){const n=window.innerWidth<=768,a=n?t.COLUMNS_MOBILE:t.COLUMNS_DESKTOP,c=n?t.SPEED_MOBILE:t.SPEED_DESKTOP,u=n?t.RANDOM_MOBILE:t.RANDOM_DESKTOP,m=n?t.FONT_MOBILE:t.FONT_DESKTOP,y=n?t.LINE_MOBILE:t.LINE_DESKTOP,d=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";for(let w=0;w<a;w++){const l=document.createElement("div"),r=w/a*100+50/a;l.style.cssText=`font-family:monospace;font-size:${m}px;line-height:${y}px;color:${d};opacity:0.5;white-space:pre;text-shadow:0 0 10px ${d};position:absolute;left:${r}%;top:0;transform:translateX(-50%)`;let o="";for(let h=0;h<t.CHAR_COUNT;h++)o+=t.CHARS[Math.floor(Math.random()*t.CHARS.length)]+`
`;l.textContent=o,this.container.appendChild(l),this.columns.push({el:l,y:-Math.random()*4e3,speed:c+Math.random()*u})}}animate(){if(!this.isRunning)return;const n=window.innerHeight;this.columns.forEach(a=>{a.y+=a.speed,a.y>n+2e3&&(a.y=-2e3),a.el.style.transform=`translateX(-50%) translateY(${a.y}px)`}),this.animationId=requestAnimationFrame(()=>this.animate())}destroy(){this.isRunning=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.container&&this.container.remove()}updateColors(){const a=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";this.columns.forEach(c=>{c.el.style.color=a,c.el.style.textShadow=`0 0 10px ${a}`})}}window.MatrixRain=e,window.matrixRain=new e;function i(){document.body.classList.contains("matrix-code")&&window.matrixRain.init()}window.MutationObserver&&new MutationObserver(()=>{window.matrixRain&&window.matrixRain.isRunning&&window.matrixRain.updateColors()}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",i),setTimeout(i,100),setTimeout(i,500),setTimeout(i,1e3)})();const _=Object.freeze({MAX_NAME_LENGTH:120,MAX_LOCATION_LENGTH:200,MAX_INPUT_LENGTH:200,MIN_YEAR:1900}),A=Object.freeze({NAME:/^[A-Za-z\u00C0-\u017F' -]+$/,DATE:/^\d{4}-\d{2}-\d{2}$/,TIME:/^\d{2}:\d{2}$/}),P=Object.freeze({MAX_LOCATION_CACHE:50,CACHE_EXPIRY_MS:1e3*60*60*24}),K={escapeHtml(t){if(!t)return"";const e=document.createElement("div");return e.textContent=String(t),e.innerHTML},sanitizeInput(t){return t?String(t).trim().replace(/[<>]/g,"").replace(/[\x00-\x1F\x7F]/g,"").substring(0,_.MAX_INPUT_LENGTH):""},debounce(t,e){let i;return function(...n){clearTimeout(i),i=setTimeout(()=>t.apply(this,n),e)}},throttle(t,e){let i;return function(...n){i||(t.apply(this,n),i=!0,setTimeout(()=>{i=!1},e))}},_locationCache:new Map,getCachedLocation(t){const e=t.toLowerCase().trim(),i=this._locationCache.get(e);return i?Date.now()-i.timestamp>P.CACHE_EXPIRY_MS?(this._locationCache.delete(e),null):i.data:null},setCachedLocation(t,e){const i=t.toLowerCase().trim();this._locationCache.size>=P.MAX_LOCATION_CACHE&&this._locationCache.delete(this._locationCache.keys().next().value),this._locationCache.set(i,{data:e,timestamp:Date.now()})},clearLocationCache(){this._locationCache.clear()},formatDate(t){const e=t instanceof Date?t:new Date(t);return isNaN(e)?"Invalid Date":e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})},deepClone(t){if(typeof structuredClone=="function")return structuredClone(t);if(t===null||typeof t!="object")return t;if(t instanceof Date)return new Date(t);if(Array.isArray(t))return t.map(i=>this.deepClone(i));const e=Object.create(null);for(const i of Object.keys(t))e[i]=this.deepClone(t[i]);return e}},J={validateName(t){if(!(t!=null&&t.trim()))return{valid:!1,message:"Name is required"};const e=t.trim();return e.length>_.MAX_NAME_LENGTH?{valid:!1,message:`Maximum ${_.MAX_NAME_LENGTH} characters`}:A.NAME.test(e)?{valid:!0}:{valid:!1,message:"Only letters, spaces, hyphens, and apostrophes allowed"}},validateDateOfBirth(t){if(!t)return{valid:!1,message:"Date of birth is required"};if(!A.DATE.test(t))return{valid:!1,message:"Use YYYY-MM-DD format"};const e=new Date(t);return isNaN(e.getTime())?{valid:!1,message:"Invalid date"}:e.getFullYear()<_.MIN_YEAR?{valid:!1,message:`Year must be ${_.MIN_YEAR} or later`}:e>new Date?{valid:!1,message:"Future date not allowed"}:{valid:!0}},validateTimeOfBirth(t){if(!t)return{valid:!0};if(!A.TIME.test(t))return{valid:!1,message:"Use HH:MM format (24-hour)"};const[e,i]=t.split(":").map(Number);return e<0||e>23||i<0||i>59?{valid:!1,message:"Invalid time"}:{valid:!0}},validateLocation(t){return t!=null&&t.trim()?t.length>_.MAX_LOCATION_LENGTH?{valid:!1,message:`Maximum ${_.MAX_LOCATION_LENGTH} characters`}:{valid:!0}:{valid:!0}},validateEmail(t){return t!=null&&t.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.trim())?{valid:!0}:{valid:!1,message:"Invalid email format"}:{valid:!1,message:"Email is required"}}};var S;const I=class I{constructor(){this.reset()}updateFormData(e,i){if(!N(I,S).has(e)){console.warn(`[FormState] Unknown field "${e}"`);return}this.formData[e]=i}setAnalysisResults(e){this.analysisResults=e}getAnalysisResults(){return this.analysisResults}setNarrativeResults(e){this.narrativeResults=e}getNarrativeResults(){return this.narrativeResults}reset(){this.formData={firstName:"",middleName:"",lastName:"",dateOfBirth:"",timeOfBirth:"",locationOfBirth:"",includeY:!1},this.analysisResults=null,this.narrativeResults=null}isComplete(){return!!(this.formData.firstName&&this.formData.lastName&&this.formData.dateOfBirth)}};S=new WeakMap,M(I,S,new Set(["firstName","middleName","lastName","dateOfBirth","timeOfBirth","locationOfBirth","includeY"]));let k=I;typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&(window.__utils={Utils:K,Validation:J,FormState:k});const v=Object.freeze({MEDITATIONS:"meditations",TAROT:"tarot",ENERGY:"energy",HAPPINESS:"happiness",GRATITUDE:"gratitude",QUOTES:"quotes",AFFIRMATIONS:"affirmations",PROGRESS:"progress",FLIP_SCRIPT:"flip-script",JOURNAL:"journal",SHADOW_ALCHEMY:"shadow-alchemy",KARMA_SHOP:"karma-shop",CHATBOT:"chatbot",COMMUNITY_HUB:"community-hub",CALCULATOR:"calculator"}),D=Object.freeze({[v.MEDITATIONS]:()=>p(()=>import("./MeditationsEngine-CES81Rz5.js"),[]).then(t=>t.default),[v.TAROT]:()=>p(()=>Promise.resolve().then(()=>me),void 0).then(t=>t.default),[v.ENERGY]:()=>p(()=>import("./EnergyTracker-4z8lVD8r.js"),[]).then(t=>t.default),[v.HAPPINESS]:()=>p(()=>import("./HappinessEngine-COC8D6fL.js"),__vite__mapDeps([0,1,2])).then(t=>t.default),[v.GRATITUDE]:()=>p(()=>import("./GratitudeEngine-8ZEFJ6la.js"),__vite__mapDeps([3,4,5,6,7])).then(t=>t.default),[v.QUOTES]:()=>p(()=>import("./QuotesEngine-CvgXYYCr.js"),[]).then(t=>t.default),[v.AFFIRMATIONS]:()=>p(()=>import("./AffirmationsEngine-Bx6vBmMJ.js"),__vite__mapDeps([8,1])).then(t=>t.default),[v.PROGRESS]:()=>p(()=>import("./GamificationEngine-EfFpmezy.js"),[]).then(t=>t.default),[v.FLIP_SCRIPT]:()=>p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.i),[]).then(t=>t.default),[v.JOURNAL]:()=>p(()=>import("./JournalEngine-ClVG77ET.js"),__vite__mapDeps([9,4,5,6,7])).then(t=>t.default),[v.SHADOW_ALCHEMY]:()=>p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.s),[]).then(t=>t.default),[v.KARMA_SHOP]:()=>p(()=>import("./KarmaShopEngine-BQ8iNTfy.js"),[]).then(t=>t.default),[v.CHATBOT]:()=>p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.C),[]).then(t=>t.ChatBotAI),[v.COMMUNITY_HUB]:()=>p(()=>import("./community-hub-Bv-lWZW8.js").then(t=>t.e),__vite__mapDeps([5,6])).then(t=>t.default),[v.CALCULATOR]:()=>p(()=>import("./self-analysis-DTZq9LK-.js"),__vite__mapDeps([10,6])).then(t=>t.default)});class Q{constructor(e){if(!e)throw new Error("[Features] FeaturesManager requires app instance");this.app=e,this.engines={},this._loading={}}async init(e){var i,s,n;try{if(this.engines[e])return(s=(i=this.engines[e]).render)==null||s.call(i),!0;if(!this._loading[e]){const c=D[e];if(!c)return console.error(`[Features] Unknown feature: "${e}"`),!1;this._loading[e]=c().then(u=>(this.engines[e]=new u(this.app),delete this._loading[e],this.engines[e]))}const a=await this._loading[e];return(n=a.render)==null||n.call(a),!0}catch(a){return console.error(`[Features] Error initialising "${e}":`,a),delete this._loading[e],!1}}async initMultiple(e){const i=await Promise.all(e.map(async a=>({id:a,success:await this.init(a)}))),s=i.filter(a=>a.success).length,n=i.filter(a=>!a.success).length;return{results:i,successful:s,failed:n,total:e.length}}getEngine(e){return this.engines[e]??null}isInitialized(e){return!!this.engines[e]}getInitializedFeatures(){return Object.keys(this.engines)}getInitializedCount(){return Object.keys(this.engines).length}getAvailableFeatures(){return Object.keys(D)}destroy(e){var i;try{const s=this.engines[e];return s?((i=s.destroy)==null||i.call(s),delete this.engines[e],!0):(console.warn(`[Features] Cannot destroy uninitialised feature: "${e}"`),!1)}catch(s){return console.error(`[Features] Error destroying "${e}":`,s),!1}}destroyAll(){const e=Object.keys(this.engines);let i=0;return e.forEach(s=>{this.destroy(s)&&i++}),{destroyed:i,total:e.length}}getDebugInfo(){return{initialized:this.getInitializedFeatures(),initializedCount:this.getInitializedCount(),available:this.getAvailableFeatures(),availableCount:this.getAvailableFeatures().length,loading:Object.keys(this._loading),engines:Object.fromEntries(Object.keys(this.engines).map(e=>[e,{hasRender:typeof this.engines[e].render=="function",hasDestroy:typeof this.engines[e].destroy=="function"}]))}}}typeof window<"u"&&(window.FeaturesManager=Q,window.FEATURE_IDS=v);const x={ANIMATION_DELAY:10,SHOW_DURATION:3e3,FADE_OUT_DURATION:400,QUEUE_SPACING:200,CONTAINER_ID:"toast-container"},q={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'};class Z{constructor(){this.queue=[],this.isShowing=!1,this.currentToast=null,this.containerCache=null,this.observerSetup=!1}async show(e,i="info",s=null,n={}){const{duration:a=x.SHOW_DURATION,dismissible:c=!1,icon:u=q[i]}=n;s&&this.queue.some(m=>m.key===s)||(this.queue.push({msg:e,type:i,key:s,duration:a,dismissible:c,icon:u}),this.isShowing||await this.processQueue())}async processQueue(){var n;if(!this.queue.length){this.isShowing=!1;return}this.isShowing=!0;const e=this.queue.shift(),i=this.getContainer();if(!i){console.error(`Toast container "#${x.CONTAINER_ID}" not found in DOM`),this.isShowing=!1,this.queue=[];return}(n=this.currentToast)!=null&&n.parentNode&&this.currentToast.remove();const s=this.createToastElement(e);this.currentToast=s,i.appendChild(s),setTimeout(()=>s.classList.add("show"),x.ANIMATION_DELAY),await this.waitForToast(s,e.duration),await this.sleep(x.QUEUE_SPACING),await this.processQueue()}createToastElement(e){const i=document.createElement("div");if(i.className=`toast ${e.type}`,i.setAttribute("role","alert"),i.setAttribute("aria-live","polite"),e.icon){const n=document.createElement("span");n.className="toast-icon",n.innerHTML=e.icon,i.appendChild(n)}const s=document.createElement("span");if(s.className="toast-message",s.textContent=e.msg,i.appendChild(s),e.dismissible){const n=document.createElement("button");n.className="toast-dismiss",n.textContent="×",n.setAttribute("aria-label","Dismiss notification"),n.addEventListener("click",()=>{this.dismissToast(i)}),i.appendChild(n)}return i}waitForToast(e,i){return new Promise(s=>{const n=setTimeout(()=>{this.hideToast(e,s)},i);e._timeoutId=n})}hideToast(e,i){e.classList.remove("show"),setTimeout(()=>{e.parentNode&&e.remove(),this.currentToast===e&&(this.currentToast=null),i&&i()},x.FADE_OUT_DURATION)}dismissToast(e){e._timeoutId&&clearTimeout(e._timeoutId),this.hideToast(e)}getContainer(){return this.containerCache&&document.contains(this.containerCache)?this.containerCache:(this.containerCache=document.getElementById(x.CONTAINER_ID),this.containerCache||(console.warn(`Toast container "#${x.CONTAINER_ID}" not found. Creating one.`),this.createContainer()),this.containerCache)}createContainer(){const e=document.createElement("div");e.id=x.CONTAINER_ID,e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),document.body.appendChild(e),this.containerCache=e}clear(){var e;this.queue=[],(e=this.currentToast)!=null&&e.parentNode&&(this.currentToast._timeoutId&&clearTimeout(this.currentToast._timeoutId),this.hideToast(this.currentToast)),this.isShowing=!1}sleep(e){return new Promise(i=>setTimeout(i,e))}getQueueLength(){return this.queue.length}isActive(){return this.isShowing}}let C=null;function E(){return C||(C=new Z),C}const ee=(t,e="info",i=null,s={})=>E().show(t,e,i,s),te=()=>{E().clear()},be=()=>E().getQueueLength(),xe=()=>E().isActive();typeof window<"u"&&import.meta.url.includes("localhost")&&(window.__toast={show:ee,clear:te,getQueue:()=>E(),config:x});const V={dev:{url:"https://caayiswyoynmeuimvwyn.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0"},prod:{url:"https://qfbarhxfmzpgbgkaymuk.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}};function ie(){try{return"https://qfbarhxfmzpgbgkaymuk.supabase.co"}catch{}return V.prod.url}function ne(){try{return"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}catch{}return V.prod.anonKey}const O=ie(),se=ne(),ae={auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:typeof window<"u"?window.localStorage:void 0},global:{headers:{"x-app-name":"digital-curiosity","x-app-version":"1.0.0"}},realtime:{timeout:1e4}};let T=null;try{T=Y(O,se,ae)}catch(t){console.error("[Supabase] Failed to initialise client:",t)}const Te=T;typeof window<"u"&&(window.AppSupabase=T);function R(){return T?!0:(console.error("[Supabase] Client not initialised"),!1)}async function G(){if(!R())return null;try{const{data:{user:t},error:e}=await T.auth.getUser();if(e)throw e;return t}catch(t){return console.error("[Supabase] getCurrentUser failed:",t),null}}async function re(){return!!await G()}async function oe(){if(!R())return!1;try{const{error:t}=await T.auth.signOut();if(t)throw t;return!0}catch(t){return console.error("[Supabase] signOut failed:",t),!1}}async function le(){if(!R())return!1;try{const{error:t}=await T.from("user_data").select("count",{count:"exact",head:!0});if(t&&t.code!=="PGRST116")throw t;return!0}catch(t){return console.error("[Supabase] Connection test failed:",t),!1}}function ce(){let t=!1;try{t=!0}catch{}return{url:O,usingEnvironmentVariables:t,source:t?"Vite environment":"hardcoded fallback",initialized:!!T}}typeof window<"u"&&window.location.hostname==="localhost"&&(window.__supabase={client:T,config:ce(),test:le,getCurrentUser:G,isAuthenticated:re,signOut:oe,url:O});const de={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},he={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},ue={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Illusion and fantasy. Ground dreams in reality.",8:"Walking away from the familiar. Seeking deeper meaning.",9:"Emotional fulfillment. Wishes granted, contentment realized.",10:"Lasting happiness and family harmony. Emotional abundance overflows."},wands:{1:"Creative spark and new inspiration. Bold initiative ignites passion.",2:"Future planning and decisions. Vision meets preparation.",3:"Expansion and foresight. Progress through strategic action.",4:"Celebration and homecoming. Stability through joyful foundation.",5:"Competition and conflict. Growth through challenge.",6:"Victory and recognition. Success earned through perseverance.",7:"Standing your ground. Defending your position with courage.",8:"Swift action and momentum. Things move quickly now.",9:"Resilience and persistence. Nearly there-don't give up.",10:"Burden of responsibility. Carrying weight that may not be yours."}},pe={pentacles:{Page:"Student of the material world. Eager to learn practical skills and build security.",Knight:"Methodical and reliable. Steady progress toward tangible goals.",Queen:"Nurturer of resources. Abundant, practical, and grounded in care.",King:"Master of the material realm. Wealthy in wisdom and resources."},swords:{Page:"Curious mind seeking truth. Quick wit but inexperienced with consequences.",Knight:"Driven by ideals and logic. Charging forward with mental clarity.",Queen:"Sharp intellect with experience. Clear boundaries and honest communication.",King:"Authority through wisdom. Just, logical, and fair in judgment."},cups:{Page:"Emotionally open and intuitive. Beginning to understand feelings and dreams.",Knight:"Romantic and idealistic. Following the heart with passion.",Queen:"Emotionally mature and compassionate. Deeply intuitive and nurturing.",King:"Emotional mastery and diplomacy. Calm waters and balanced heart."},wands:{Page:"Enthusiastic explorer. New creative ventures and bold messages.",Knight:"Adventurous and impulsive. Chasing passion with fiery energy.",Queen:"Confident and charismatic. Inspiring others through authentic presence.",King:"Visionary leader. Turning inspiration into lasting impact."}},B={11:"Page",12:"Knight",13:"Queen",14:"King"},$={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},F={FLIP_DURATION:900,SCROLL_DELAY:100};class W{constructor(e){this.app=e,this.TAROT_BASE_URL="/Tarot Cards images/",this.CARD_BACK_URL="/Tarot Cards images/CardBacks.webp",this.spreads={single:{name:"A Single Card Oracle Spread",cards:1,desc:"A Single Card Clarification",positions:["A Single Card"]},three:{name:"A 3 Cards Quick Spread",cards:3,desc:"Past • Present • Future",positions:["Past","Present","Future"]},six:{name:"A 6 Cards Insight Spread",cards:6,desc:"Situational Analysis",positions:["Situation","Challenge","Past Influence","Future Influence","Your Power","Outcome"]},options:{name:"The Options Spread",cards:9,desc:"Evaluate your different Options",positions:["Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)"]},pyramid:{name:"The Pyramid Spread",cards:9,desc:"Triangle of Past – Present – Future",positions:["Where you came from","Where you came from","Where you came from","Where you are now","Where you are now","Where you are now","Where are you going","Where are you going","Where are you going"]},cross:{name:"The Simple Cross Spread",cards:5,desc:"A Simple Cross Snapshot of Now",positions:["Direction of the Situation","The Root of the Situation","Summary","Positive side of Situation","Obstacles-Challenges"]}},this.selectedSpread="single",this.shuffledDeck=[],this.flippedCards=new Set,this.currentReading=[],this.cleanup=null,this.cachedElements={},this.prepareReading()}getTarotCardName(e,i="major"){return i==="major"?de[e]||"The Fool":e<=10?`${e} of ${$[i]}`:`${B[e]} of ${$[i]}`}getTarotCardImage(e,i="major"){if(i==="major"){const a=String(e).padStart(2,"0"),c=this.getTarotCardName(e,"major").replace(/\s+/g,"");return`${this.TAROT_BASE_URL}${a}-${c}.webp`}const s=i.charAt(0).toUpperCase()+i.slice(1),n=String(e).padStart(2,"0");return`${this.TAROT_BASE_URL}${s}${n}.webp`}getTarotCardMeaning(e,i="major"){var n,a;if(i==="major")return he[e]||"New beginnings and infinite possibility await you.";if(e<=10)return((n=ue[i])==null?void 0:n[e])||"This card brings its unique energy to your reading.";const s=B[e];return((a=pe[i])==null?void 0:a[s])||"This court card represents a person or energy in your life."}buildFullDeck(){const e=["pentacles","swords","cups","wands"];return[...Array.from({length:22},(i,s)=>({type:"major",number:s,suit:"major"})),...e.flatMap(i=>Array.from({length:14},(s,n)=>({type:n<10?"minor":"court",number:n+1,suit:i})))]}shuffleDeck(e){const i=[...e];for(let s=i.length-1;s>0;s--){const n=Math.floor(Math.random()*(s+1));[i[s],i[n]]=[i[n],i[s]]}return i}prepareReading(){const e=this.buildFullDeck();this.shuffledDeck=this.shuffleDeck(e),this.flippedCards.clear(),this.currentReading=[],this.cachedElements={}}flipCard(e){if(this.flippedCards.has(e)||!this.shuffledDeck.length)return;const i=this.cachedElements.pyramid||(this.cachedElements.pyramid=document.querySelector(".pyramid-triangle"));i&&requestAnimationFrame(()=>{i.style.minHeight=`${i.offsetHeight}px`,i.classList.add("flipping"),setTimeout(()=>{i.classList.remove("flipping"),i.style.minHeight=""},F.FLIP_DURATION)}),this.flippedCards.add(e);const s=this.shuffledDeck.pop(),n={name:this.getTarotCardName(s.number,s.suit),meaning:this.getTarotCardMeaning(s.number,s.suit),imageUrl:this.getTarotCardImage(s.number,s.suit),cardData:s};this.currentReading.push(n);const a=document.getElementById(`tarot-card-container-${e}`),c=a==null?void 0:a.querySelector(".tarot-card-front"),u=document.getElementById(`tarot-card-details-${e}`);if(!a||!c||!u){console.error(`[TarotEngine] Failed to find card elements for index ${e}`);return}c.innerHTML=`<img src="${n.imageUrl}" alt="${n.name}" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class='tarot-card-error'>🃏</div>'">`,u.innerHTML=`<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${n.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${n.meaning}</p>`,u.style.opacity="1",u.style.transition="opacity 0.5s ease 0.5s",a.classList.add("flipped"),this.checkSpreadCompletion()}checkSpreadCompletion(){this.flippedCards.size===this.spreads[this.selectedSpread].cards&&this.completeTarotSpread()}completeTarotSpread(){const e=this.spreads[this.selectedSpread].name;if(!["single","three"].includes(this.selectedSpread)){if(this.app.state){const s={spreadType:e,spreadKey:this.selectedSpread,cards:this.currentReading.map(n=>({name:n.name,meaning:n.meaning})),timestamp:new Date().toISOString(),date:new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})};this.app.state.addEntry("tarot",s)}this.app.gamification&&this.app.gamification.incrementTarotSpreads(),this.checkAchievements()}}checkAchievements(){var s,n;const e=((n=(s=this.app.gamification)==null?void 0:s.state)==null?void 0:n.totalTarotSpreads)||0,i=this.app.gamification;i&&(e>=1&&i.checkAndGrantBadge("first_tarot",i.getBadgeDefinitions()),e>=10&&i.checkAndGrantBadge("tarot_apprentice",i.getBadgeDefinitions()),e>=25&&i.checkAndGrantBadge("tarot_mystic",i.getBadgeDefinitions()),e>=75&&i.checkAndGrantBadge("tarot_oracle",i.getBadgeDefinitions()),e>=150&&i.checkAndGrantBadge("tarot_150",i.getBadgeDefinitions()),e>=400&&i.checkAndGrantBadge("tarot_400",i.getBadgeDefinitions()))}buildTarotCTA(){return`
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
    `}render(){this.cleanup&&this.cleanup();const e=document.getElementById("tarot-tab");if(!e){console.error("[TarotEngine] tarot-tab element not found");return}const i=this.spreads[this.selectedSpread],s=["options","pyramid","cross"];let n="";if(s.includes(this.selectedSpread))n=this.renderCustomSpread(this.selectedSpread);else{const a=i.cards;let c="md:grid-cols-1";(a===3||a===6)&&(c="tarot-3col-grid");const u=a===1;n=`<div class="grid ${c}${u?"":" place-items-center"}${u?" tarot-single-grid":""}">${Array.from({length:a}).map((y,g)=>this.cardMarkup(g,i.positions[g],u)).join("")}</div>`}e.innerHTML=`
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
            ${Object.entries(this.spreads).map(([a,c])=>{var g,d,w,l,r,o,h;const u=["options","pyramid","cross"].includes(a),m=((d=(g=this.app.state)==null?void 0:g.currentUser)==null?void 0:d.isAdmin)||((l=(w=this.app.state)==null?void 0:w.currentUser)==null?void 0:l.isVip),y=u&&!m&&!((h=(o=(r=this.app.gamification)==null?void 0:r.state)==null?void 0:o.unlockedFeatures)!=null&&h.includes("advance_tarot_spreads"));return`
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${a}')"
                   class="card cursor-pointer relative ${this.selectedSpread===a?"border-4":""} ${y?"opacity-75":""}"
                   style="${this.selectedSpread===a?"border-color: var(--neuro-accent);":""} padding: 1.5rem;"
                   title="${y?"Purchase Advanced Tarot Spreads in Karma Shop to unlock":""}">
                ${u?'<span class="premium-badge-tr">PREMIUM</span>':""}
                ${y?'<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':""}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${c.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${c.desc}</p>
              </div>`}).join("")}
          </div>

          <div style="margin-bottom: 3rem; padding: 0 1.5rem;">
            ${(()=>{var m,y,g,d,w,l,r,o,h,f;const u=!(((g=(y=(m=this.app)==null?void 0:m.state)==null?void 0:y.currentUser)==null?void 0:g.isAdmin)||((l=(w=(d=this.app)==null?void 0:d.state)==null?void 0:w.currentUser)==null?void 0:l.isVip)||((f=(h=(o=(r=this.app)==null?void 0:r.gamification)==null?void 0:o.state)==null?void 0:h.unlockedFeatures)==null?void 0:f.includes("tarot_vision_ai")));return`
                <button id="tarot-vision-ai-btn"
                        class="btn ${u?"opacity-50 cursor-not-allowed":"hover:scale-[1.02]"}"
                        style="position:relative;display:flex !important;align-items:center;gap:1.25rem;
                               width:100%;padding:1.25rem 1.5rem;text-align:left;border-radius:0.75rem;
                               min-height:5rem;box-sizing:border-box;">
                  <span class="premium-badge" style="position:absolute;top:0.6rem;right:0.6rem;margin:0;z-index:1;">PREMIUM</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;flex-shrink:0;"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12s1.5-3 5-3 5 3 5 3-1.5 3-5 3-5-3-5-3Z"/><circle cx="12" cy="12" r="1"/></svg>
                  <span style="display:flex;flex-direction:column;gap:0.2rem;flex:1;min-width:0;padding-right:${u?"3rem":"4rem"};">
                    <span style="font-size:1.2rem;font-weight:700;line-height:1.2;white-space:nowrap;">Tarot Vision AI</span>
                    <span style="font-size:0.9rem;font-weight:400;opacity:0.85;line-height:1.3;white-space:normal;">Take a picture or upload a tarot card to analyse it</span>
                  </span>
                  ${u?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.75rem;height:1.75rem;opacity:0.45;flex-shrink:0;margin-left:auto;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                </button>`})()}
          </div>

          <div class="card" id="tarot-cards-result" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${i.name}</h3>
            </div>
            ${n}
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
    `,this.init()}cardMarkup(e,i,s=!1){const n=s?"width:100%;":"width: clamp(140px, 24vw, 250px);",a=s?"clamp(80px, 16vw, 120px)":"clamp(60px, 12vw, 100px)";return`
      <div class="flex flex-col items-center mx-auto" style="${n}">
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
        <div id="tarot-card-details-${e}" class="text-center" style="opacity: 0; height: ${a}; overflow-y: auto; margin-top: 0rem;"></div>
      </div>`}renderCustomSpread(e){const i=this.spreads[e].positions;if(e==="options")return`
        <div class="flex flex-col items-center" style="width:100%;">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${i.slice(0,3).map((s,n)=>this.cardMarkup(n,s)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${i.slice(3,6).map((s,n)=>this.cardMarkup(n+3,s)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid tarot-3col-grid place-items-center" style="width:100%;">
            ${i.slice(6,9).map((s,n)=>this.cardMarkup(n+6,s)).join("")}
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
        </div>`}init(){setTimeout(()=>{const e=document.getElementById("tarot-vision-ai-btn");if(e){const i=()=>{var a,c,u,m,y,g,d,w,l,r,o,h,f,b;!(((u=(c=(a=this.app)==null?void 0:a.state)==null?void 0:c.currentUser)==null?void 0:u.isAdmin)||((g=(y=(m=this.app)==null?void 0:m.state)==null?void 0:y.currentUser)==null?void 0:g.isVip))&&!((r=(l=(w=(d=this.app)==null?void 0:d.gamification)==null?void 0:w.state)==null?void 0:l.unlockedFeatures)!=null&&r.includes("tarot_vision_ai"))?(h=(o=this.app)==null?void 0:o.showToast)==null||h.call(o,"Unlock Tarot Vision AI in the Karma Shop!","info"):(b=(f=this.app)==null?void 0:f.showToast)==null||b.call(f,"Tarot Vision AI opening...","info")};e.onclick=i,this.cleanup=()=>{e.onclick=null}}},0)}selectSpread(e){var n,a,c,u,m,y,g,d,w,l,r,o;const i=["options","pyramid","cross"];if(!(((c=(a=(n=this.app)==null?void 0:n.state)==null?void 0:a.currentUser)==null?void 0:c.isAdmin)||((y=(m=(u=this.app)==null?void 0:u.state)==null?void 0:m.currentUser)==null?void 0:y.isVip))&&i.includes(e)&&!((l=(w=(d=(g=this.app)==null?void 0:g.gamification)==null?void 0:d.state)==null?void 0:w.unlockedFeatures)!=null&&l.includes("advance_tarot_spreads"))){(o=(r=this.app)==null?void 0:r.showToast)==null||o.call(r,"Unlock Advanced Tarot Spreads in the Karma Shop!","info");return}this.selectedSpread=e,this.prepareReading(),this.render(),setTimeout(()=>{const h=document.querySelector("#tarot-cards-result");h&&h.scrollIntoView({behavior:"smooth",block:"start"})},F.SCROLL_DELAY)}reset(){this.selectSpread(this.selectedSpread)}}typeof window<"u"&&(window.TarotEngine=W);const me=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));(function(){const t={PULSE_POOL_SIZE:10,AUTO_TRIGGER:!1},e={BREATH_PULSE_INTERVAL:1e3,EXHALE_PULSE_INTERVAL:900,RELAX_PULSE_INTERVAL:1800,RELAX_TRANSITION:2600,TEXT_FADE:100,SCALE_BOUNCE:240,ESCAPE_DEBOUNCE:300},i={inhale:"Inhale deeply",hold:"HOLD",exhale:"Exhale slowly",relax:"Now Relax"},s={selfReset:{id:"selfreset",title:"Self Reset",duration:60,type:"breathing",breathIn:7,breathHold:3,breathOut:7,completeRounds:3,storagePrefix:"pc_wellness_selfreset",gradient:"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"},fullBodyScan:{id:"fullbodyscan",title:"Full Body Scan",duration:120,type:"zones",zones:["Top of head","Back of head","Face","Throat and neck","Shoulders","Arms and hands","Chest","Stomach","Back (upper and lower)","Pelvic area","Legs","Feet"],storagePrefix:"pc_wellness_fullbodyscan",gradient:"linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"},nervousSystem:{id:"nervoussystem",title:"Nervous System Reset",duration:60,type:"steps",steps:["Shake your hands","Roll your shoulders","Stick out your tongue to relax the jaw","Relax your face, especially around the eyes","Take one long sigh","Feel your feet on the ground","Settle your breath naturally"],stepDurations:[9,9,9,9,8,8,8],storagePrefix:"pc_wellness_nervoussystem",gradient:"linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"},tensionSweep:{id:"tensionsweep",title:"Tension Sweep",duration:120,type:"zones",zones:["Lift shoulders to your ears then drop","Shake your arms loosely","Shake your legs","Twist your spine gently left and right","Circle your hips slowly","Open your chest, expand your ribcage","Drop your head forward and roll gently","Shake your whole body lightly"],storagePrefix:"pc_wellness_tensionsweep",gradient:"linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"}},n=`
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
  `,a=document.createElement("style");a.textContent=n,document.head.appendChild(a);const c={ctx:null};function u(){try{c.ctx||(c.ctx=new(window.AudioContext||window.webkitAudioContext));const l=c.ctx,r=l.currentTime,o=l.createOscillator(),h=l.createOscillator(),f=l.createGain(),b=l.createBiquadFilter();o.type="sine",h.type="sine",o.frequency.value=660,h.frequency.value=990,h.detune.value=6,b.type="lowpass",b.frequency.value=2600,f.gain.setValueAtTime(1e-4,r),f.gain.exponentialRampToValueAtTime(.28,r+.02),f.gain.exponentialRampToValueAtTime(.001,r+1.5),o.connect(b),h.connect(b),b.connect(f),f.connect(l.destination),o.start(r),h.start(r),o.stop(r+1.5),h.stop(r+1.5)}catch(l){console.warn("WellnessKit: Audio playback failed",l)}}class m{constructor(r){if(!r||!r.id||!r.duration||!r.type)throw new Error("WellnessKit: Invalid tool configuration");this.config=r,this.state={remaining:r.duration,mainInterval:null,phaseTimeout:null,pulseInterval:null,currentIndex:0,isRunning:!1,countdownInterval:null},this.createUI(),this.initPulsePool(),this.attachEvents(),this.resetState()}createUI(){const r=document.createElement("div");r.innerHTML=`
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
      `,document.body.appendChild(r),this.elements={overlay:document.getElementById(`wk-${this.config.id}-overlay`),box:document.getElementById(`wk-${this.config.id}-box`),timer:document.getElementById(`wk-${this.config.id}-timer`),progress:document.getElementById(`wk-${this.config.id}-progress`),pulses:document.getElementById(`wk-${this.config.id}-pulses`),anim:document.getElementById(`wk-${this.config.id}-anim`),text:document.getElementById(`wk-${this.config.id}-text`),count:document.getElementById(`wk-${this.config.id}-count`),btnStart:document.getElementById(`wk-${this.config.id}-start`),btnFinish:document.getElementById(`wk-${this.config.id}-finish`),btnClose:document.getElementById(`wk-${this.config.id}-close`)},this.elements.box.style.background=this.config.gradient,this.R=40,this.CIRC=2*Math.PI*this.R,this.elements.progress.style.strokeDasharray=this.CIRC}initPulsePool(){this.pulsePool=[],this.pulseIndex=0;for(let r=0;r<t.PULSE_POOL_SIZE;r++){const o=document.createElement("div");o.className="wk-pulse",this.elements.pulses.appendChild(o),this.pulsePool.push(o)}}spawnPulse(){const r=this.pulsePool[this.pulseIndex];this.pulseIndex=(this.pulseIndex+1)%t.PULSE_POOL_SIZE,r.classList.remove("active"),r.offsetWidth,r.classList.add("active")}spawnPulseWithInterval(r){this.spawnPulse(),this.state.pulseInterval&&clearInterval(this.state.pulseInterval),this.state.pulseInterval=setInterval(()=>this.spawnPulse(),r)}setProgress(r,o){const h=Math.max(0,Math.min(1,r/o)),f=this.CIRC*(1-h);this.elements.progress.style.strokeDashoffset=f}clearTimers(){[this.state.mainInterval,this.state.phaseTimeout,this.state.pulseInterval,this.state.countdownInterval].forEach(o=>{o&&(clearInterval(o),clearTimeout(o))}),this.state.mainInterval=null,this.state.phaseTimeout=null,this.state.pulseInterval=null,this.state.countdownInterval=null}resetAnimationTransition(){this.elements.anim.style.transition=""}resetState(){this.clearTimers(),this.state.remaining=this.config.duration,this.state.currentIndex=0,this.state.isRunning=!1,this.elements.timer.textContent=String(this.config.duration),this.setProgress(this.config.duration,this.config.duration),this.elements.btnFinish.classList.add("hidden"),this.elements.btnStart.classList.remove("hidden"),this.elements.btnStart.textContent="Start",this.elements.anim.style.transform="scale(1.0)",this.elements.anim.style.opacity="0.9",this.resetAnimationTransition(),this.config.type==="breathing"?(this.elements.text.textContent=i.inhale,this.elements.count&&(this.elements.count.textContent=String(this.config.breathIn))):this.config.type==="zones"?this.elements.text.textContent=this.config.zones[0]:this.config.type==="steps"&&(this.elements.text.textContent=this.config.steps[0])}startMainTimer(){this.state.mainInterval||(this.state.isRunning=!0,this.elements.btnStart.textContent="Stop",this.config.type==="breathing"?this.startBreathingCycle():this.startPhaseLoop(),this.state.mainInterval=setInterval(()=>{this.state.remaining-=1,this.state.remaining<0&&(this.state.remaining=0),this.elements.timer.textContent=String(this.state.remaining),this.setProgress(this.state.remaining,this.config.duration),this.state.remaining<=0&&(this.clearTimers(),this.finalizeSession())},1e3))}stopMainTimer(){this.clearTimers(),this.state.isRunning=!1,this.elements.btnStart.textContent="Start",this.resetAnimationTransition()}getCompletedCycles(){const r=this.config.duration-this.state.remaining,o=this.config.breathIn+this.config.breathHold+this.config.breathOut;return Math.floor(r/o)}startBreathingCycle(){const r=()=>{u(),this.setBreathPhase("inhale",this.config.breathIn),this.elements.anim.style.transition=`transform ${this.config.breathIn}s linear`,this.elements.anim.style.transform="scale(1.14)",this.spawnPulseWithInterval(e.BREATH_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),o()},this.config.breathIn*1e3)},o=()=>{this.state.remaining<=0||(this.setBreathPhase("hold",this.config.breathHold),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${this.config.breathHold}s linear`,this.elements.anim.style.transform="scale(1.18)",this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),h()},this.config.breathHold*1e3))},h=()=>{this.state.remaining<=0||(this.setBreathPhase("exhale",this.config.breathOut),this.elements.anim.style.transition=`transform ${this.config.breathOut}s linear`,this.elements.anim.style.transform="scale(0.94)",this.spawnPulseWithInterval(e.EXHALE_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),f()},this.config.breathOut*1e3))},f=()=>{if(this.state.remaining<=0)return;this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.getCompletedCycles()>=this.config.completeRounds?b():r()},b=()=>{this.setBreathPhase("relax",null),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${e.RELAX_TRANSITION}ms ease-in-out`,this.elements.anim.style.transform="scale(1.0)",this.spawnPulseWithInterval(e.RELAX_PULSE_INTERVAL)};r()}setBreathPhase(r,o){if(this.elements.text.textContent=i[r]||"",r==="relax"){this.elements.count&&(this.elements.count.textContent="");return}if(this.elements.count&&o){this.state.countdownInterval&&clearInterval(this.state.countdownInterval);let h=o;this.elements.count.textContent=String(h),this.state.countdownInterval=setInterval(()=>{h-=1,h<=0?(this.elements.count.textContent="0",clearInterval(this.state.countdownInterval),this.state.countdownInterval=null):this.elements.count.textContent=String(h)},1e3)}}startPhaseLoop(){const r=this.config.zones||this.config.steps,o=()=>{if(!(this.state.remaining<=0)&&(this.elements.text.classList.add("changing"),setTimeout(()=>{this.elements.text.textContent=r[this.state.currentIndex],this.elements.text.classList.remove("changing"),this.spawnPulse(),this.elements.anim.style.transition="transform 0.24s ease-out",this.elements.anim.style.transform="scale(1.08)",setTimeout(()=>{this.elements.anim.style.transform="scale(1.0)",setTimeout(()=>this.resetAnimationTransition(),e.SCALE_BOUNCE)},e.SCALE_BOUNCE)},e.TEXT_FADE),this.state.currentIndex<r.length-1)){const f=this.config.stepDurations?this.config.stepDurations[this.state.currentIndex]*1e3:this.config.duration/r.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,o()},f)}};this.elements.text.textContent=r[0],this.spawnPulse();const h=this.config.stepDurations?this.config.stepDurations[0]*1e3:this.config.duration/r.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,o()},h)}completeSession(){var r;u();try{(r=window.app)!=null&&r.gamification&&(window.app.gamification.incrementWellnessRuns(),window.app.gamification.addBoth(10,1,"Wellness Practice"))}catch(o){console.warn("WellnessKit: Gamification integration failed",o)}}finalizeSession(){this.completeSession(),this.elements.btnStart.classList.add("hidden"),this.elements.btnFinish.classList.remove("hidden"),setTimeout(()=>this.close(),1200)}open(){this.resetState(),this.elements.overlay.style.display="flex",setTimeout(()=>this.elements.btnStart.focus(),100)}close(){this.stopMainTimer(),this.elements.overlay.style.display="none",this.resetState()}attachEvents(){this.elements.btnStart.addEventListener("click",()=>{this.state.mainInterval?this.stopMainTimer():(this.state.remaining<=0&&this.resetState(),this.startMainTimer())}),this.elements.btnFinish.addEventListener("click",()=>{this.completeSession(),this.close()}),this.elements.btnClose.addEventListener("click",()=>this.close()),this.elements.overlay.addEventListener("click",r=>{r.target===this.elements.overlay&&this.close()})}getStats(){return{autoTriggerEnabled:t.AUTO_TRIGGER}}destroy(){this.clearTimers(),this.elements.overlay&&this.elements.overlay.parentNode&&this.elements.overlay.parentNode.removeChild(this.elements.overlay)}}const y=new Set;let g=null;document.addEventListener("keydown",l=>{if(l.key==="Escape"){if(g)return;g=setTimeout(()=>g=null,e.ESCAPE_DEBOUNCE),y.forEach(r=>{r.elements.overlay.style.display==="flex"&&r.close()})}});const d={selfReset:new m(s.selfReset),fullBodyScan:new m(s.fullBodyScan),nervousSystem:new m(s.nervousSystem),tensionSweep:new m(s.tensionSweep)};Object.values(d).forEach(l=>y.add(l)),window.addEventListener("beforeunload",()=>{if(Object.values(d).forEach(l=>{l.clearTimers(),l.destroy()}),c.ctx)try{c.ctx.close(),c.ctx=null}catch(l){console.warn("WellnessKit: Audio context cleanup failed",l)}}),window.WellnessKit={openSelfReset:()=>d.selfReset.open(),openFullBodyScan:()=>d.fullBodyScan.open(),openNervousReset:()=>d.nervousSystem.open(),openTensionSweep:()=>d.tensionSweep.open(),closeSelfReset:()=>d.selfReset.close(),closeFullBodyScan:()=>d.fullBodyScan.close(),closeNervousReset:()=>d.nervousSystem.close(),closeTensionSweep:()=>d.tensionSweep.close(),getSelfResetStats:()=>d.selfReset.getStats(),getFullBodyScanStats:()=>d.fullBodyScan.getStats(),getNervousResetStats:()=>d.nervousSystem.getStats(),getTensionSweepStats:()=>d.tensionSweep.getStats(),getAllStats:()=>({selfReset:d.selfReset.getStats(),fullBodyScan:d.fullBodyScan.getStats(),nervousSystem:d.nervousSystem.getStats(),tensionSweep:d.tensionSweep.getStats()}),playChime:u},["SelfReset","FullBodyScan","NervousReset","TensionSweep"].forEach(l=>{window[`open${l}`]=window.WellnessKit[`open${l}`],window[`close${l}`]=window.WellnessKit[`close${l}`],window[`get${l}Stats`]=window.WellnessKit[`get${l}Stats`]})})();window.addEventListener("load",()=>{p(()=>Promise.resolve({}),__vite__mapDeps([11])),p(()=>Promise.resolve({}),__vite__mapDeps([12]))});window.innerWidth<=767&&p(()=>Promise.resolve({}),__vite__mapDeps([13]));const U=()=>p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.T),[]),z=()=>Promise.all([p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.i),[]),p(()=>import("./features-lazy-bN0WDG2L.js").then(t=>t.s),[])]);let H=!1;window.lazyLoadCommunityHub=async function(){H||(H=!0,await p(()=>import("./community-hub-Bv-lWZW8.js").then(t=>t.e),__vite__mapDeps([5,6])))};"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch(t=>console.error("[SW] Registration failed:",t))});async function j(){try{const[t,{QUOTES:e,getRandomQuote:i,getQuoteOfTheDay:s},n,{default:a}]=await Promise.all([p(()=>import("./AffirmationsList-BRihhJ1z.js"),[]),p(()=>import("./QuotesList-BeF9xuKi.js"),[]),p(()=>import("./Index-BnNv-RrP.js"),__vite__mapDeps([14,15,5,6,7,2,4,16])),p(()=>import("./User-Tab-B7kyMKGf.js"),__vite__mapDeps([15,5,6,7]))]);window.affirmations=t.default,window.QuotesData={QUOTES:e,getRandomQuote:i,getQuoteOfTheDay:s},window.app=new n.ProjectCuriosityApp({AppState:n.AppState,AuthManager:n.AuthManager,NavigationManager:n.NavigationManager,DashboardManager:n.DashboardManager,UserTab:a}),window.app.init(),typeof requestIdleCallback=="function"?requestIdleCallback(()=>{U(),z()},{timeout:3e3}):setTimeout(()=>{U(),z()},1500)}catch(t){console.error("[FATAL] Bootstrap failed:",t),document.body.innerHTML='<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j();export{W as T,ee as a,te as c,be as g,xe as i,Te as s};
