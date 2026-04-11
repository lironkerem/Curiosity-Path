const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Index-BVve0-cW.js","assets/User-Tab-CLFj08KU.js"])))=>i.map(i=>d[i]);
var Xe=Object.defineProperty;var Ae=s=>{throw TypeError(s)};var Ze=(s,e,t)=>e in s?Xe(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var _=(s,e,t)=>Ze(s,typeof e!="symbol"?e+"":e,t),et=(s,e,t)=>e.has(s)||Ae("Cannot "+t);var Re=(s,e,t)=>(et(s,e,"read from private field"),t?t.call(s):e.get(s)),Oe=(s,e,t)=>e.has(s)?Ae("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t);import{createClient as tt}from"https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const it="modulepreload",nt=function(s){return"/"+s},Pe={},q=function(e,t,i){let n=Promise.resolve();if(t&&t.length>0){let r=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),d=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=r(t.map(c=>{if(c=nt(c),c in Pe)return;Pe[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const p=document.createElement("link");if(p.rel=u?"stylesheet":it,u||(p.as="script"),p.crossOrigin="",p.href=c,d&&p.setAttribute("nonce",d),document.head.appendChild(p),u)return new Promise((m,g)=>{p.addEventListener("load",m),p.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return n.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})};(function(){const s={CHARS:"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789",COLUMNS_MOBILE:12,COLUMNS_DESKTOP:25,CHAR_COUNT:100,SPEED_MOBILE:3,SPEED_DESKTOP:3,RANDOM_MOBILE:4,RANDOM_DESKTOP:4,FONT_MOBILE:16,FONT_DESKTOP:24,LINE_MOBILE:20,LINE_DESKTOP:28};class e{constructor(){this.container=null,this.columns=[],this.animationId=null,this.isRunning=!1}init(){document.body.classList.contains("matrix-code")&&(this.createContainer(),this.createColumns(),this.isRunning=!0,this.animate())}createContainer(){this.container=document.createElement("div"),this.container.style.cssText="position:fixed!important;top:0!important;left:0!important;width:100%!important;height:100%!important;z-index:1!important;pointer-events:none!important;overflow:hidden!important;",document.body.insertBefore(this.container,document.body.firstChild)}createColumns(){const n=window.innerWidth<=768,o=n?s.COLUMNS_MOBILE:s.COLUMNS_DESKTOP,r=n?s.SPEED_MOBILE:s.SPEED_DESKTOP,l=n?s.RANDOM_MOBILE:s.RANDOM_DESKTOP,d=n?s.FONT_MOBILE:s.FONT_DESKTOP,c=n?s.LINE_MOBILE:s.LINE_DESKTOP,h=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";for(let p=0;p<o;p++){const m=document.createElement("div"),g=p/o*100+50/o;m.style.cssText=`font-family:monospace;font-size:${d}px;line-height:${c}px;color:${h};opacity:0.5;white-space:pre;text-shadow:0 0 10px ${h};position:absolute;left:${g}%;top:0;transform:translateX(-50%)`;let y="";for(let b=0;b<s.CHAR_COUNT;b++)y+=s.CHARS[Math.floor(Math.random()*s.CHARS.length)]+`
`;m.textContent=y,this.container.appendChild(m),this.columns.push({el:m,y:-Math.random()*4e3,speed:r+Math.random()*l})}}animate(){if(!this.isRunning)return;const n=window.innerHeight;this.columns.forEach(o=>{o.y+=o.speed,o.y>n+2e3&&(o.y=-2e3),o.el.style.transform=`translateX(-50%) translateY(${o.y}px)`}),this.animationId=requestAnimationFrame(()=>this.animate())}destroy(){this.isRunning=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.container&&this.container.remove()}updateColors(){const o=document.body.classList.contains("dark-mode")?"#ff0041":"#00ff41";this.columns.forEach(r=>{r.el.style.color=o,r.el.style.textShadow=`0 0 10px ${o}`})}}window.MatrixRain=e,window.matrixRain=new e;function t(){document.body.classList.contains("matrix-code")&&window.matrixRain.init()}window.MutationObserver&&new MutationObserver(()=>{window.matrixRain&&window.matrixRain.isRunning&&window.matrixRain.updateColors()}).observe(document.body,{attributes:!0,attributeFilter:["class"]}),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",t),setTimeout(t,100),setTimeout(t,500),setTimeout(t,1e3)})();const Y=Object.freeze({MAX_NAME_LENGTH:120,MAX_LOCATION_LENGTH:200,MAX_INPUT_LENGTH:200,MIN_YEAR:1900}),ue=Object.freeze({NAME:/^[A-Za-z\u00C0-\u017F' -]+$/,DATE:/^\d{4}-\d{2}-\d{2}$/,TIME:/^\d{2}:\d{2}$/}),Be=Object.freeze({MAX_LOCATION_CACHE:50,CACHE_EXPIRY_MS:1e3*60*60*24}),st={escapeHtml(s){if(!s)return"";const e=document.createElement("div");return e.textContent=String(s),e.innerHTML},sanitizeInput(s){return s?String(s).trim().replace(/[<>]/g,"").replace(/[\x00-\x1F\x7F]/g,"").substring(0,Y.MAX_INPUT_LENGTH):""},debounce(s,e){let t;return function(...n){clearTimeout(t),t=setTimeout(()=>s.apply(this,n),e)}},throttle(s,e){let t;return function(...n){t||(s.apply(this,n),t=!0,setTimeout(()=>{t=!1},e))}},_locationCache:new Map,getCachedLocation(s){const e=s.toLowerCase().trim(),t=this._locationCache.get(e);return t?Date.now()-t.timestamp>Be.CACHE_EXPIRY_MS?(this._locationCache.delete(e),null):t.data:null},setCachedLocation(s,e){const t=s.toLowerCase().trim();this._locationCache.size>=Be.MAX_LOCATION_CACHE&&this._locationCache.delete(this._locationCache.keys().next().value),this._locationCache.set(t,{data:e,timestamp:Date.now()})},clearLocationCache(){this._locationCache.clear()},formatDate(s){const e=s instanceof Date?s:new Date(s);return isNaN(e)?"Invalid Date":e.toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})},deepClone(s){if(typeof structuredClone=="function")return structuredClone(s);if(s===null||typeof s!="object")return s;if(s instanceof Date)return new Date(s);if(Array.isArray(s))return s.map(t=>this.deepClone(t));const e=Object.create(null);for(const t of Object.keys(s))e[t]=this.deepClone(s[t]);return e}},at={validateName(s){if(!(s!=null&&s.trim()))return{valid:!1,message:"Name is required"};const e=s.trim();return e.length>Y.MAX_NAME_LENGTH?{valid:!1,message:`Maximum ${Y.MAX_NAME_LENGTH} characters`}:ue.NAME.test(e)?{valid:!0}:{valid:!1,message:"Only letters, spaces, hyphens, and apostrophes allowed"}},validateDateOfBirth(s){if(!s)return{valid:!1,message:"Date of birth is required"};if(!ue.DATE.test(s))return{valid:!1,message:"Use YYYY-MM-DD format"};const e=new Date(s);return isNaN(e.getTime())?{valid:!1,message:"Invalid date"}:e.getFullYear()<Y.MIN_YEAR?{valid:!1,message:`Year must be ${Y.MIN_YEAR} or later`}:e>new Date?{valid:!1,message:"Future date not allowed"}:{valid:!0}},validateTimeOfBirth(s){if(!s)return{valid:!0};if(!ue.TIME.test(s))return{valid:!1,message:"Use HH:MM format (24-hour)"};const[e,t]=s.split(":").map(Number);return e<0||e>23||t<0||t>59?{valid:!1,message:"Invalid time"}:{valid:!0}},validateLocation(s){return s!=null&&s.trim()?s.length>Y.MAX_LOCATION_LENGTH?{valid:!1,message:`Maximum ${Y.MAX_LOCATION_LENGTH} characters`}:{valid:!0}:{valid:!0}},validateEmail(s){return s!=null&&s.trim()?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())?{valid:!0}:{valid:!1,message:"Invalid email format"}:{valid:!1,message:"Email is required"}}};var re;const le=class le{constructor(){this.reset()}updateFormData(e,t){if(!Re(le,re).has(e)){console.warn(`[FormState] Unknown field "${e}"`);return}this.formData[e]=t}setAnalysisResults(e){this.analysisResults=e}getAnalysisResults(){return this.analysisResults}setNarrativeResults(e){this.narrativeResults=e}getNarrativeResults(){return this.narrativeResults}reset(){this.formData={firstName:"",middleName:"",lastName:"",dateOfBirth:"",timeOfBirth:"",locationOfBirth:"",includeY:!1},this.analysisResults=null,this.narrativeResults=null}isComplete(){return!!(this.formData.firstName&&this.formData.lastName&&this.formData.dateOfBirth)}};re=new WeakMap,Oe(le,re,new Set(["firstName","middleName","lastName","dateOfBirth","timeOfBirth","locationOfBirth","includeY"]));let fe=le;typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&(window.__utils={Utils:st,Validation:at,FormState:fe});const B={SAVE_DEBOUNCE_MS:100,BADGE_CHECK_DEBOUNCE_MS:300,MAX_LOGS:1e3,LEVEL_UP_SPECTACLE_DURATION:4e3,PARTICLE_COUNT:60,QUEST_REWARDS:{DAILY_BONUS:{xp:50,karma:5},WEEKLY_BONUS:{xp:200,karma:20},MONTHLY_BONUS:{xp:800,karma:80}},LEVEL_UP_BONUS_XP:50},ot={common:3,uncommon:5,rare:10,epic:15,legendary:30},te=[{level:1,title:"Seeker",xp:0},{level:2,title:"Practitioner",xp:800},{level:3,title:"Adept",xp:2e3},{level:4,title:"Healer",xp:4200},{level:5,title:"Master",xp:7e3},{level:6,title:"Sage",xp:12e3},{level:7,title:"Enlightened",xp:3e4},{level:8,title:"Buddha",xp:6e4},{level:9,title:"Light",xp:18e4},{level:10,title:"Emptiness",xp:45e4}];class rt{constructor(e){_(this,"debouncedBadgeCheck",this.debounce(()=>{const e=Array.from(this.badgeCheckQueue);this.badgeCheckQueue.clear(),e.includes("all")?this.checkAllBadges():e.forEach(t=>this.checkBadgeCategory(t))},B.BADGE_CHECK_DEBOUNCE_MS));this.app=e,this.listeners={},this.state=this.loadState()||this.defaultState(),this.badgeCheckQueue=new Set,this.saveTimeout=null,this.initializeQuests()}defaultState(){return{xp:0,level:1,karma:0,streak:{current:0,best:0,lastCheckIn:null},completedSessions:{daily:0,weekly:0},badges:[],unlockedFeatures:[],quests:{daily:[],weekly:[],monthly:[]},logs:[],totalWellnessRuns:0,totalTarotSpreads:0,totalJournalEntries:0,totalHappinessViews:0,weeklyQuestCompletions:0,monthlyQuestCompletions:0,dailyQuestCompletions:0,totalQuestCompletions:0,dailyQuestStreak:0,activeBoosts:[],skipCaps:{},settings:{xpPerAction:10,xpPerLevel:100,streakResetDays:1,synergyBonus:10}}}initializeQuests(){const e=this.getQuestDefinitions();!this.state.quests.daily||this.state.quests.daily.length===0?(this.state.quests=e,this.saveState()):(["daily","weekly","monthly"].forEach(t=>{const i=this.state.quests[t]||[],n=e[t]||[],o=i.map(r=>{const l=n.find(d=>d.id===r.id);return l?{...l,...r}:r});n.forEach(r=>{o.find(l=>l.id===r.id)||o.push({...r})}),this.state.quests[t]=o}),this.saveState())}getQuestDefinitions(){return{daily:[{id:"gratitude_entry",tab:"gratitude",icon:"❤️",name:"Daily Gratitude Practice",inspirational:"Gratitude transforms what we have into enough.",target:"Log 10 gratitudes",goal:10,progress:0,xpReward:20,completed:!1,karmaReward:2},{id:"journal_entry",tab:"journal",icon:"📓",name:"Daily Journaling",inspirational:"Writing clarifies thoughts.",target:"Save 1 journal entry",goal:1,progress:0,xpReward:35,completed:!1,karmaReward:3},{id:"tarot_spread",tab:"tarot",icon:"🃏",name:"Daily Tarot Spread",inspirational:"The cards reveal truth.",target:"Complete one 6-card spread",goal:1,progress:0,xpReward:25,completed:!1,karmaReward:2},{id:"meditation_session",tab:"meditations",icon:"🧘",name:"Daily Meditation",inspirational:"Peace begins within.",target:"Finish 1 meditation",goal:1,progress:0,xpReward:30,completed:!1,karmaReward:3},{id:"energy_checkin",tab:"energy",icon:"⚡",name:"Daily Energy Check-in",inspirational:"Awareness is transformation.",target:"Day & night check-ins",goal:2,progress:0,xpReward:20,completed:!1,karmaReward:2,subProgress:{day:!1,night:!1}},{id:"daily_booster",tab:"happiness",icon:"✨",name:"Daily Affirmations",inspirational:"Joy is practice.",target:"Refresh cards 5 times",goal:5,progress:0,xpReward:15,completed:!1,karmaReward:1},{id:"flip_script",tab:"flip-script",icon:"🔄",name:"Flip The Script",inspirational:"Every negative thought holds the seed of its opposite.",target:"Flip 1 negative thought",goal:1,progress:0,xpReward:40,completed:!1,karmaReward:4}],weekly:[{id:"gratitude_streak_7",tab:"gratitude",icon:"💖",name:"Gratitude Streak",inspirational:"Consistency breeds abundance.",target:"Log 70 gratitudes across the week to complete this quest.",goal:70,progress:0,xpReward:100,completed:!1,karmaReward:10},{id:"journal_5",tab:"journal",icon:"📝",name:"Journal Writer",inspirational:"Your story matters.",target:"Save 5 journal entries across the week to complete this quest.",goal:5,progress:0,xpReward:150,completed:!1,karmaReward:15},{id:"energy_7",tab:"energy",icon:"⚡",name:"Weekly Energy Check-ins",inspirational:"Track your rhythm, honor your cycles.",target:"Tick 14 energy check-ins (day & night) across the week to complete this quest.",goal:14,progress:0,xpReward:80,completed:!1,karmaReward:8},{id:"happiness_boosters_20",tab:"happiness",icon:"🎨",name:"Happy and Motivated Week",inspirational:"Feed your mind with positivity.",target:"Refresh happiness cards 35 times across the week to complete this quest.",goal:35,progress:0,xpReward:120,completed:!1,karmaReward:12},{id:"tarot_4_days",tab:"tarot",icon:"🔮",name:"Tarot Lover",inspirational:"Seek wisdom in the cards.",target:"Complete five 6-card (or larger) spreads across the week to complete this quest.",goal:5,progress:0,xpReward:100,completed:!1,karmaReward:10},{id:"meditate_3",tab:"meditations",icon:"🌟",name:"Meditating Adept",inspirational:"Stillness is strength.",target:"Finish 5 meditation sessions across the week to complete this quest.",goal:5,progress:0,xpReward:120,completed:!1,karmaReward:12},{id:"flip_script_5",tab:"flip-script",icon:"🔄",name:"Script Flipper",inspirational:"Rewire your mind one thought at a time.",target:"Flip 5 negative thoughts across the week to complete this quest.",goal:5,progress:0,xpReward:150,completed:!1,karmaReward:15}],monthly:[{id:"monthly_flip_15",tab:"flip-script",icon:"🔄",name:"Master Script Flipper",inspirational:"You are the author of your own story.",target:"Flip 15 negative thoughts during the month to complete this quest.",goal:15,progress:0,xpReward:400,completed:!1,karmaReward:40},{id:"monthly_energy_28",tab:"energy",icon:"⚡",name:"Monthly Energy Check-ins",inspirational:"Know thyself through daily awareness.",target:"Tick 60 energy check-ins (day & night) during the month to complete this quest.",goal:60,progress:0,xpReward:300,completed:!1,karmaReward:30},{id:"monthly_tarot_15",tab:"tarot",icon:"🔮",name:"Tarot Enthusiast",inspirational:"The universe speaks through symbols.",target:"Complete twenty 6-card (or larger) spreads during the month to complete this quest.",goal:20,progress:0,xpReward:400,completed:!1,karmaReward:40},{id:"monthly_gratitude_28",tab:"gratitude",icon:"💖",name:"Gratitude Master",inspirational:"Gratitude unlocks the fullness of life.",target:"Log 300 gratitudes during the month to complete this quest.",goal:300,progress:0,xpReward:350,completed:!1,karmaReward:35},{id:"monthly_journal_20",tab:"journal",icon:"📝",name:"A Journalist",inspirational:"Write to understand, reflect to grow.",target:"Save 20 journal entries during the month to complete this quest.",goal:20,progress:0,xpReward:500,completed:!1,karmaReward:50},{id:"monthly_happiness_100",tab:"happiness",icon:"🎨",name:"Super Good Month",inspirational:"Choose joy every single day.",target:"Refresh happiness cards 150 times during the month to complete this quest.",goal:150,progress:0,xpReward:450,completed:!1,karmaReward:45},{id:"monthly_meditation_15",tab:"meditations",icon:"🌟",name:"Meditating Healer",inspirational:"Through stillness, we find our true power.",target:"Finish 20 meditation sessions during the month to complete this quest.",goal:20,progress:0,xpReward:600,completed:!1,karmaReward:60}]}}saveState(){clearTimeout(this.saveTimeout),this.saveTimeout=setTimeout(()=>{var e;try{try{localStorage.setItem("gamificationState",JSON.stringify(this.state))}catch{}if((e=this.app)!=null&&e.state){const{logs:t,...i}=this.state;this.app.state.data={...this.app.state.data,...i},this.app.state.saveAppData()}}catch(t){console.error("Failed to save gamification state:",t)}},B.SAVE_DEBOUNCE_MS)}loadState(){var e,t;try{if((t=(e=this.app)==null?void 0:e.state)!=null&&t.data&&this.app.state.data.xp!==void 0){const n={...this.app.state.data};return["streak.lastCheckIn","energyLevel","alignmentScore","chakraProgress","totalPracticeMinutes"].forEach(r=>{const l=r.split(".");l.length===2?n[l[0]]&&delete n[l[0]][l[1]]:delete n[r]}),{...this.defaultState(),...n}}let i=null;try{i=localStorage.getItem("gamificationState")}catch{}return i?{...this.defaultState(),...JSON.parse(i)}:null}catch(i){return console.error("Failed to load gamification state:",i),null}}async reloadFromDatabase(){var e;if((e=this.app)!=null&&e.state)try{await this.app.state.loadData(),this.state=this.loadState(),this.emit("stateReloaded",this.state),this.checkAllBadges()}catch(t){console.error("Failed to reload gamification state:",t)}}reset(){try{try{localStorage.removeItem("gamificationState")}catch{}this.state=this.defaultState(),this.emit("reset",null),this.saveState()}catch(e){console.error("Failed to reset gamification state:",e)}}on(e,t){return this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push(t),()=>this.off(e,t)}off(e,t){this.listeners[e]&&(this.listeners[e]=this.listeners[e].filter(i=>i!==t))}emit(e,t){this.listeners[e]&&this.listeners[e].forEach(i=>{try{i(t)}catch(n){console.error(`Error in event listener for ${e}:`,n)}})}destroy(){clearTimeout(this.saveTimeout),this.listeners={}}_incrementCounter(e,t,i){this.state[e]+=1,this.queueBadgeCheck(t),this.saveState(),this.emit(i,this.state[e])}incrementWellnessRuns(){this._incrementCounter("totalWellnessRuns","wellness","wellnessRunCompleted")}incrementTarotSpreads(){this._incrementCounter("totalTarotSpreads","tarot","tarotSpreadCompleted")}incrementJournalEntries(){this._incrementCounter("totalJournalEntries","journal","journalEntrySaved")}incrementHappinessViews(){this._incrementCounter("totalHappinessViews","happiness","happinessViewAdded")}queueBadgeCheck(e){this.badgeCheckQueue.add(e),this.debouncedBadgeCheck()}debounce(e,t){let i;return(...n)=>{clearTimeout(i),i=setTimeout(()=>e.apply(this,n),t)}}get currentData(){var e,t;return((t=(e=this.app)==null?void 0:e.state)==null?void 0:t.data)||{}}getCounts(){const e=this.currentData;return{gratitude:(e.gratitudeEntries||[]).length,journal:(e.journalEntries||[]).length,energy:(e.energyEntries||[]).length,tarot:this.state.totalTarotSpreads||0,meditation:(e.meditationEntries||[]).length,happiness:this.state.totalHappinessViews||0,wellness:this.state.totalWellnessRuns||0}}addXP(e,t="general",i=!1){if(!e||e<=0)return;let n=e;this.hasActiveXPBoost()&&(n=e*2),this.state.xp+=n,this.logAction("xp",{amount:n,source:t,boosted:n!==e}),this.emit("xpGained",{amount:n,source:t,skipToast:i}),this.checkLevelUp(),this.queueBadgeCheck("currency"),this.saveState()}addKarma(e,t="general",i=!1){if(!e||e<=0)return;let n=e;this.hasActiveKarmaBoost()&&(n=e*2),this.state.karma+=n,this.logAction("karma",{amount:n,source:t,boosted:n!==e}),this.emit("karmaGained",{amount:n,source:t,skipToast:i}),this.queueBadgeCheck("currency"),this.saveState()}addBoth(e,t,i="general"){var r;if(!e&&!t)return;let n=e,o=t;if(e>0&&(this.hasActiveXPBoost()&&(n=e*2),this.state.xp+=n,this.logAction("xp",{amount:n,source:i,boosted:n!==e}),this.emit("xpGained",{amount:n,source:i,skipToast:!0})),t>0&&(this.hasActiveKarmaBoost()&&(o=t*2),this.state.karma+=o,this.logAction("karma",{amount:o,source:i,boosted:o!==t}),this.emit("karmaGained",{amount:o,source:i,skipToast:!0})),(r=this.app)!=null&&r.showToast){const l=[];e>0&&l.push(`+${n} XP`),t>0&&l.push(`+${o} Karma`),this.app.showToast(`${l.join(" • ")} from ${i}`,"success")}e>0&&this.checkLevelUp(),this.queueBadgeCheck("currency"),this.saveState()}hasActiveXPBoost(){try{const e=this.state.activeBoosts||[],t=Date.now();return e.some(i=>(i.id==="xp_multiplier"||i.id==="double_boost")&&i.expiresAt>t)}catch{return!1}}hasActiveKarmaBoost(){try{const e=this.state.activeBoosts||[],t=Date.now();return e.some(i=>(i.id==="karma_multiplier"||i.id==="double_boost")&&i.expiresAt>t)}catch{return!1}}activateBoost(e,t){this.state.activeBoosts||(this.state.activeBoosts=[]),this.state.activeBoosts=this.state.activeBoosts.filter(n=>n.id!==e);const i=Date.now()+t;this.state.activeBoosts.push({id:e,expiresAt:i}),this.saveState(),this.emit("boostActivated",{id:e,expiresAt:i})}calculateLevel(){let e=te.length-1;for(;e>0&&this.state.xp<te[e].xp;)e--;const t=te[e],i=te[e+1]||t,n=i.xp===t.xp?100:(this.state.xp-t.xp)/(i.xp-t.xp)*100;return{level:t.level,title:t.title,progress:Math.round(n),pointsToNext:Math.max(0,i.xp-this.state.xp)}}checkLevelUp(){var n;const e=this.state.level,{level:t,title:i}=this.calculateLevel();t>e&&(this.state.level=t,this.emit("levelUp",{level:t,title:i}),this.addXP(B.LEVEL_UP_BONUS_XP,`Level ${t}`,!0),(n=this.app)!=null&&n.showToast&&this.app.showToast(`🎉 Level ${t} – ${i}  +${B.LEVEL_UP_BONUS_XP} XP`,"success"),lt({level:t,title:i,xp:B.LEVEL_UP_BONUS_XP,karma:0}),this.queueBadgeCheck("level"))}updateStreak(){const e=new Date().toDateString();if(this.state.streak.lastCheckIn===e)return;const t=this.state.streak.lastCheckIn?new Date(this.state.streak.lastCheckIn):null,i=t?(new Date(e)-t)/(1e3*60*60*24):null;!t||i>this.state.settings.streakResetDays?this.state.streak.current=1:this.state.streak.current+=1,this.state.streak.current>(this.state.streak.best||0)&&(this.state.streak.best=this.state.streak.current),this.state.streak.lastCheckIn=e,this.emit("streakUpdated",{current:this.state.streak.current,best:this.state.streak.best}),this.queueBadgeCheck("streak"),this.saveState()}getBadgeDefinitions(){return{first_step:{name:"First Step",icon:"🌱",description:"Any first action in the app",xp:10,rarity:"common",category:"first"},first_gratitude:{name:"First Gratitude",icon:"💚",description:"First gratitude entry",xp:10,rarity:"common",category:"first"},first_journal:{name:"First Journal",icon:"📝",description:"First journal entry",xp:10,rarity:"common",category:"first"},first_energy:{name:"First Energy",icon:"⚡",description:"First energy check-in",xp:10,rarity:"common",category:"first"},first_tarot:{name:"First Reading",icon:"🃏",description:"First tarot spread",xp:10,rarity:"common",category:"first"},first_meditation:{name:"First Meditation",icon:"🧘",description:"First meditation session",xp:10,rarity:"common",category:"first"},first_purchase:{name:"First Purchase",icon:"🛒",description:"First purchase in the Karma Shop",xp:50,rarity:"epic",category:"currency"},gratitude_warrior:{name:"Gratitude Warrior",icon:"❤️",description:"30 gratitude entries",xp:50,rarity:"uncommon",category:"gratitude"},gratitude_legend:{name:"Gratitude Legend",icon:"💗",description:"100 gratitude entries",xp:100,rarity:"rare",category:"gratitude"},gratitude_200:{name:"Gratitude Sage",icon:"💖",description:"200 gratitude entries",xp:200,rarity:"epic",category:"gratitude"},gratitude_500:{name:"Gratitude Titan",icon:"💘",description:"500 gratitude entries",xp:500,rarity:"legendary",category:"gratitude"},journal_keeper:{name:"Journal Keeper",icon:"📓",description:"20 journal entries",xp:50,rarity:"uncommon",category:"journal"},journal_master:{name:"Journal Master",icon:"📚",description:"75 journal entries",xp:100,rarity:"rare",category:"journal"},journal_150:{name:"Journal Sage",icon:"📖",description:"150 journal entries",xp:200,rarity:"epic",category:"journal"},journal_400:{name:"Journal Titan",icon:"📜",description:"400 journal entries",xp:500,rarity:"legendary",category:"journal"},energy_tracker:{name:"Energy Tracker",icon:"⚡",description:"30 energy logs",xp:50,rarity:"uncommon",category:"energy"},energy_sage:{name:"Energy Sage",icon:"🔋",description:"100 energy logs",xp:100,rarity:"rare",category:"energy"},energy_300:{name:"Energy Titan",icon:"🔌",description:"300 energy logs",xp:300,rarity:"epic",category:"energy"},energy_600:{name:"Energy Legend",icon:"⚡️",description:"600 energy logs",xp:600,rarity:"legendary",category:"energy"},tarot_apprentice:{name:"Tarot Apprentice",icon:"🔮",description:"10 tarot spreads",xp:25,rarity:"common",category:"tarot"},tarot_mystic:{name:"Tarot Mystic",icon:"🃏",description:"25 tarot spreads",xp:50,rarity:"uncommon",category:"tarot"},tarot_oracle:{name:"Tarot Oracle",icon:"🌙",description:"75 tarot spreads",xp:100,rarity:"rare",category:"tarot"},tarot_150:{name:"Tarot Sage",icon:"🧙",description:"150 tarot spreads",xp:200,rarity:"epic",category:"tarot"},tarot_400:{name:"Tarot Titan",icon:"🔮",description:"400 tarot spreads",xp:500,rarity:"legendary",category:"tarot"},meditation_devotee:{name:"Meditation Devotee",icon:"🧘",description:"20 meditation sessions",xp:50,rarity:"uncommon",category:"meditation"},meditation_master:{name:"Meditation Master",icon:"🕉️",description:"60 meditation sessions",xp:100,rarity:"rare",category:"meditation"},meditation_100:{name:"Meditation Sage",icon:"🧘‍♂️",description:"100 meditation sessions",xp:300,rarity:"epic",category:"meditation"},meditation_200:{name:"Meditation Titan",icon:"🧘‍♀️",description:"200 meditation sessions",xp:700,rarity:"legendary",category:"meditation"},happiness_seeker:{name:"Happiness Seeker",icon:"😊",description:"50 happiness booster views",xp:50,rarity:"uncommon",category:"happiness"},joy_master:{name:"Joy Master",icon:"🎉",description:"150 happiness booster views",xp:100,rarity:"rare",category:"happiness"},happiness_300:{name:"Happiness Sage",icon:"😍",description:"300 happiness booster views",xp:200,rarity:"epic",category:"happiness"},happiness_700:{name:"Happiness Titan",icon:"🤩",description:"700 happiness booster views",xp:500,rarity:"legendary",category:"happiness"},wellness_champion:{name:"Wellness Champion",icon:"🌿",description:"50 wellness exercises",xp:50,rarity:"uncommon",category:"wellness"},wellness_guru:{name:"Wellness Guru",icon:"🌳",description:"150 wellness exercises",xp:100,rarity:"rare",category:"wellness"},wellness_300:{name:"Wellness Titan",icon:"🌲",description:"300 wellness exercises",xp:300,rarity:"epic",category:"wellness"},wellness_700:{name:"Wellness Legend",icon:"🌎",description:"700 wellness exercises",xp:1e3,rarity:"legendary",category:"wellness"},perfect_week:{name:"Perfect Week",icon:"⭐",description:"Complete all daily quests 7 days straight",xp:75,rarity:"rare",category:"streak"},dedication_streak:{name:"Dedication",icon:"💎",description:"30-day streak",xp:100,rarity:"epic",category:"streak"},unstoppable:{name:"Unstoppable",icon:"🔥",description:"60-day streak",xp:150,rarity:"epic",category:"streak"},legendary_streak:{name:"Legendary Streak",icon:"👑",description:"100-day streak",xp:200,rarity:"legendary",category:"streak"},weekly_warrior:{name:"Weekly Warrior",icon:"🔥",description:"Finish every weekly quest 4 separate weeks",xp:100,rarity:"epic",category:"quest"},monthly_master:{name:"Monthly Master",icon:"🌟",description:"Finish every monthly quest at least once",xp:150,rarity:"epic",category:"quest"},quest_crusher:{name:"Quest Crusher",icon:"🎯",description:"100 total quests (any type)",xp:150,rarity:"epic",category:"quest"},daily_champion:{name:"Daily Champion",icon:"⭐",description:"Finish all dailies on 30 separate days",xp:100,rarity:"rare",category:"quest"},karma_collector:{name:"Karma Collector",icon:"💰",description:"500 karma accumulated",xp:50,rarity:"rare",category:"currency"},karma_lord:{name:"Karma Lord",icon:"💎",description:"2000 karma accumulated",xp:200,rarity:"legendary",category:"currency"},xp_milestone:{name:"XP Legend",icon:"⚡",description:"10000 XP earned",xp:100,rarity:"epic",category:"currency"},xp_titan:{name:"XP Titan",icon:"⚡",description:"50000 XP earned",xp:200,rarity:"legendary",category:"currency"},level_5_hero:{name:"Rising Star",icon:"🎯",description:"Reach Level 5",xp:100,rarity:"epic",category:"level"},level_7_hero:{name:"Enlightened Soul",icon:"🌟",description:"Reach Level 7",xp:150,rarity:"epic",category:"level"},level_10_hero:{name:"Enlightened Master",icon:"👑",description:"Reach Level 10",xp:300,rarity:"legendary",category:"level"},chakra_balancer:{name:"Chakra Balancer",icon:"🌈",description:"All 7 chakras ≥ 8 in one session",xp:75,rarity:"epic",category:"chakra"},chakra_master:{name:"Chakra Master",icon:"🎨",description:"All 7 chakras ≥ 9 in one session",xp:150,rarity:"legendary",category:"chakra"},triple_threat:{name:"Triple Threat",icon:"🎪",description:"Use 3 different features in one day",xp:25,rarity:"uncommon",category:"cross"},super_day:{name:"Super Day",icon:"💫",description:"Gratitude + journal + energy + meditation in one day",xp:50,rarity:"rare",category:"cross"},complete_explorer:{name:"Complete Explorer",icon:"🗺️",description:"Use every main feature at least once",xp:100,rarity:"epic",category:"cross"},renaissance_soul:{name:"Renaissance Soul",icon:"🎭",description:"≥ 10 actions in 5+ different features",xp:150,rarity:"epic",category:"cross"}}}checkBadgeCategory(e){const t=this.getBadgeDefinitions(),i=this.getCounts(),o={gratitude:()=>this.checkGratitudeBadges(t,i.gratitude),journal:()=>this.checkJournalBadges(t,i.journal),energy:()=>this.checkEnergyBadges(t,i.energy),tarot:()=>this.checkTarotBadges(t,i.tarot),meditation:()=>this.checkMeditationBadges(t,i.meditation),happiness:()=>this.checkHappinessBadges(t,i.happiness),wellness:()=>this.checkWellnessBadges(t,i.wellness),streak:()=>this.checkStreakBadges(t),quest:()=>this.checkQuestBadges(t),currency:()=>this.checkCurrencyBadges(t),level:()=>this.checkLevelBadges(t),cross:()=>this.checkCrossFeatureBadges(t)}[e];o&&o()}checkGratitudeBadges(e,t){t>=1&&this.checkAndGrantBadge("first_gratitude",e),t>=30&&this.checkAndGrantBadge("gratitude_warrior",e),t>=100&&this.checkAndGrantBadge("gratitude_legend",e),t>=200&&this.checkAndGrantBadge("gratitude_200",e),t>=500&&this.checkAndGrantBadge("gratitude_500",e)}checkJournalBadges(e,t){t>=1&&this.checkAndGrantBadge("first_journal",e),t>=20&&this.checkAndGrantBadge("journal_keeper",e),t>=75&&this.checkAndGrantBadge("journal_master",e),t>=150&&this.checkAndGrantBadge("journal_150",e),t>=400&&this.checkAndGrantBadge("journal_400",e)}checkEnergyBadges(e,t){t>=1&&this.checkAndGrantBadge("first_energy",e),t>=30&&this.checkAndGrantBadge("energy_tracker",e),t>=100&&this.checkAndGrantBadge("energy_sage",e),t>=300&&this.checkAndGrantBadge("energy_300",e),t>=600&&this.checkAndGrantBadge("energy_600",e)}checkTarotBadges(e,t){t>=1&&this.checkAndGrantBadge("first_tarot",e),t>=10&&this.checkAndGrantBadge("tarot_apprentice",e),t>=25&&this.checkAndGrantBadge("tarot_mystic",e),t>=75&&this.checkAndGrantBadge("tarot_oracle",e),t>=150&&this.checkAndGrantBadge("tarot_150",e),t>=400&&this.checkAndGrantBadge("tarot_400",e)}checkMeditationBadges(e,t){t>=1&&this.checkAndGrantBadge("first_meditation",e),t>=20&&this.checkAndGrantBadge("meditation_devotee",e),t>=60&&this.checkAndGrantBadge("meditation_master",e),t>=100&&this.checkAndGrantBadge("meditation_100",e),t>=200&&this.checkAndGrantBadge("meditation_200",e)}checkHappinessBadges(e,t){t>=50&&this.checkAndGrantBadge("happiness_seeker",e),t>=150&&this.checkAndGrantBadge("joy_master",e),t>=300&&this.checkAndGrantBadge("happiness_300",e),t>=700&&this.checkAndGrantBadge("happiness_700",e)}checkWellnessBadges(e,t){t>=50&&this.checkAndGrantBadge("wellness_champion",e),t>=150&&this.checkAndGrantBadge("wellness_guru",e),t>=300&&this.checkAndGrantBadge("wellness_300",e),t>=700&&this.checkAndGrantBadge("wellness_700",e)}checkStreakBadges(e){var i;const t=((i=this.state.streak)==null?void 0:i.current)||0;this.state.dailyQuestStreak>=7&&this.checkAndGrantBadge("perfect_week",e),t>=30&&this.checkAndGrantBadge("dedication_streak",e),t>=60&&this.checkAndGrantBadge("unstoppable",e),t>=100&&this.checkAndGrantBadge("legendary_streak",e)}checkLevelBadges(e){const t=this.calculateLevel().level;t>=5&&this.checkAndGrantBadge("level_5_hero",e),t>=7&&this.checkAndGrantBadge("level_7_hero",e),t>=10&&this.checkAndGrantBadge("level_10_hero",e)}checkCurrencyBadges(e){this.state.karma>=500&&this.checkAndGrantBadge("karma_collector",e),this.state.karma>=2e3&&this.checkAndGrantBadge("karma_lord",e),this.state.xp>=1e4&&this.checkAndGrantBadge("xp_milestone",e),this.state.xp>=5e4&&this.checkAndGrantBadge("xp_titan",e)}checkQuestBadges(e){this.state.weeklyQuestCompletions>=4&&this.checkAndGrantBadge("weekly_warrior",e),this.state.monthlyQuestCompletions>=1&&this.checkAndGrantBadge("monthly_master",e),this.state.totalQuestCompletions>=100&&this.checkAndGrantBadge("quest_crusher",e),this.state.dailyQuestCompletions>=30&&this.checkAndGrantBadge("daily_champion",e)}checkCrossFeatureBadges(e){const t=this.currentData,i=new Date().toDateString(),n=this.getCounts();Object.values(n).reduce((g,y)=>g+y,0)>=1&&this.checkAndGrantBadge("first_step",e);const r=(t.gratitudeEntries||[]).some(g=>new Date(g.timestamp).toDateString()===i),l=(t.journalEntries||[]).some(g=>new Date(g.timestamp).toDateString()===i),d=(t.energyEntries||[]).some(g=>new Date(g.timestamp).toDateString()===i),c=(t.tarotReadings||[]).some(g=>new Date(g.timestamp).toDateString()===i),u=(t.meditationEntries||[]).some(g=>new Date(g.timestamp).toDateString()===i);[r,l,d,c,u].filter(Boolean).length>=3&&this.checkAndGrantBadge("triple_threat",e),r&&l&&d&&u&&this.checkAndGrantBadge("super_day",e),[n.gratitude>0,n.journal>0,n.energy>0,n.tarot>0,n.meditation>0,n.happiness>0,n.wellness>0].every(Boolean)&&this.checkAndGrantBadge("complete_explorer",e),Object.values(n).filter(g=>g>=10).length>=5&&this.checkAndGrantBadge("renaissance_soul",e)}checkChakraBadges(e){const t=this.getBadgeDefinitions(),i=["root","sacral","solar","heart","throat","thirdEye","crown"],n=i.every(r=>(e[r]||0)>=8),o=i.every(r=>(e[r]||0)>=9);n&&this.checkAndGrantBadge("chakra_balancer",t),o&&this.checkAndGrantBadge("chakra_master",t)}checkAllBadges(){var i,n;if(!((n=(i=this.app)==null?void 0:i.state)!=null&&n.data))return;const e=this.getBadgeDefinitions(),t=this.getCounts();this.checkGratitudeBadges(e,t.gratitude),this.checkJournalBadges(e,t.journal),this.checkEnergyBadges(e,t.energy),this.checkTarotBadges(e,t.tarot),this.checkMeditationBadges(e,t.meditation),this.checkHappinessBadges(e,t.happiness),this.checkWellnessBadges(e,t.wellness),this.checkStreakBadges(e),this.checkQuestBadges(e),this.checkCurrencyBadges(e),this.checkLevelBadges(e),this.checkCrossFeatureBadges(e)}grantBadge(e){if(this.state.badges.find(i=>i.id===e.id))return;const t=ot[e.rarity]||0;t&&(this.state.karma+=t,this.logAction("karma",{amount:t,source:`Badge: ${e.id}`})),this.state.badges.push({...e,unlocked:!0,date:new Date().toISOString()}),this.emit("badgeUnlocked",e),e.xp&&this.addXP(e.xp,`Badge: ${e.id}`,!0),e.inspirational&&this.emit("inspirationalMessage",e.inspirational),this.saveState()}checkAndGrantBadge(e,t){if(this.state.badges.find(n=>n.id===e))return;const i=t[e];if(!i){console.warn(`Badge definition not found: ${e}`);return}this.grantBadge({id:e,name:i.name,icon:i.icon,description:i.description,xp:i.xp,rarity:i.rarity,inspirational:i.inspirational})}progressEnergyCheckin(e){var n;const t=this.state.quests.daily.find(o=>o.id==="energy_checkin");if(!t||t.completed)return;t.subProgress||(t.subProgress={day:!1,night:!1});const i=e==="day"?"day":e==="night"?"night":null;if(!(!i||t.subProgress[i])){if(t.subProgress[i]=!0,t.progress+=1,this.addXP(10,`Energy Check-in (${i})`,!0),this.state.karma+=1,this.emit("questProgress",t),t.progress>=t.goal&&(t.completed=!0,this.addXP(10,"Energy Check-in Bonus (Both Complete)",!0),this.state.karma+=2,t.inspirational&&this.emit("inspirationalMessage",t.inspirational),this.emit("questCompleted",t),this.state.quests.daily.every(o=>o.completed))){const{xp:o,karma:r}=B.QUEST_REWARDS.DAILY_BONUS;this.addXP(o,"Daily Quest Streak Bonus",!0),this.state.karma+=r,!this.state._bulkMode&&((n=this.app)!=null&&n.showToast)&&this.app.showToast(`Daily quests finished! +${o} XP +${r} Karma`,"success"),this.emit("dailyQuestsComplete",null)}this.saveState()}}progressQuest(e,t,i=1){var o,r;const n=(o=this.state.quests[e])==null?void 0:o.find(l=>l.id===t);if(!(!n||n.completed)){if(n.progress=Math.min(n.goal,n.progress+i),n.progress>=n.goal){if(n.completed=!0,this.addXP(n.xpReward||50,`Quest: ${n.name}`,!0),n.karmaReward&&(this.state.karma+=n.karmaReward),n.badge&&this.grantBadge(n.badge),n.inspirational&&this.emit("inspirationalMessage",n.inspirational),this.state._bulkMode||this.emit("questCompleted",n),e==="daily"&&this.state.quests.daily.every(l=>l.completed)){const{xp:l,karma:d}=B.QUEST_REWARDS.DAILY_BONUS;this.addXP(l,"Daily Quest Streak Bonus",!0),this.state.karma+=d,!this.state._bulkMode&&((r=this.app)!=null&&r.showToast)&&this.app.showToast(`Daily quests finished! +${l} XP +${d} Karma`,"success"),this.state._bulkMode||this.emit("dailyQuestsComplete",null)}this.queueBadgeCheck("quest")}else this.emit("questProgress",n);this.saveState()}}completeQuest(e,t){var n;const i=(n=this.state.quests[e])==null?void 0:n.find(o=>o.id===t);i&&this.progressQuest(e,t,i.goal-i.progress)}completeChakraQuest(e,t,i,n=1){this.progressQuest(e,t,n)}_resetQuests(e){var i,n,o,r;if((i=this.state.quests[e])==null?void 0:i.every(l=>l.completed)){if(e==="daily")this.state.dailyQuestCompletions=(this.state.dailyQuestCompletions||0)+1,this.state.dailyQuestStreak=(this.state.dailyQuestStreak||0)+1;else if(e==="weekly"){const{xp:l,karma:d}=B.QUEST_REWARDS.WEEKLY_BONUS;this.addXP(l,"Weekly Quest Completion Bonus",!0),this.state.karma+=d,(n=this.app)!=null&&n.showToast&&this.app.showToast(`Weekly quests finished! +${l} XP +${d} Karma`,"success"),this.state.weeklyQuestCompletions=(this.state.weeklyQuestCompletions||0)+1,this.state.dailyQuestStreak=0}else if(e==="monthly"){const{xp:l,karma:d}=B.QUEST_REWARDS.MONTHLY_BONUS;this.addXP(l,"Monthly Quest Completion Bonus",!0),this.state.karma+=d,(o=this.app)!=null&&o.showToast&&this.app.showToast(`Monthly quests finished! +${l} XP +${d} Karma`,"success"),this.state.monthlyQuestCompletions=(this.state.monthlyQuestCompletions||0)+1}this.queueBadgeCheck("quest")}(r=this.state.quests[e])==null||r.forEach(l=>{l.progress=0,l.completed=!1,l.id==="energy_checkin"&&(l.subProgress={day:!1,night:!1})}),this.emit("questsReset",e),this.saveState()}resetDailyQuests(){this._resetQuests("daily")}resetWeeklyQuests(){this._resetQuests("weekly")}resetMonthlyQuests(){this._resetQuests("monthly")}_completeBatch(e){const t=this.state.quests[e];if(!(t!=null&&t.length))return;let i=0,n=0,o=0;this.state._bulkMode=!0,t.forEach(r=>{r.completed||(this.completeQuest(e,r.id),i++,n+=r.xpReward||50,o+=r.karmaReward||0)}),this.state._bulkMode=!1,i&&this.emit("bulkQuestsComplete",{type:e,done:i,xp:n,karma:o})}completeAllDaily(){this._completeBatch("daily")}completeAllWeekly(){this._completeBatch("weekly")}completeAllMonthly(){this._completeBatch("monthly")}unlockFeature(e){this.state.unlockedFeatures.includes(e)||(this.state.unlockedFeatures.push(e),this.emit("featureUnlocked",e),this.saveState())}logAction(e,t={}){try{this.state.logs.push({timestamp:new Date().toISOString(),type:e,details:t}),this.state.logs.length>B.MAX_LOGS&&(this.state.logs=this.state.logs.slice(-B.MAX_LOGS)),this.saveState()}catch(i){console.error("Failed to log action:",i)}}getStatusSummary(){const e=this.calculateLevel();return{xp:this.state.xp,level:this.state.level,pointsToNext:e.pointsToNext,levelTitle:e.title,karma:this.state.karma,streak:this.state.streak,badges:this.state.badges,unlockedFeatures:this.state.unlockedFeatures,quests:this.state.quests,logs:this.state.logs,totalWellnessRuns:this.state.totalWellnessRuns,totalTarotSpreads:this.state.totalTarotSpreads,totalJournalEntries:this.state.totalJournalEntries,totalHappinessViews:this.state.totalHappinessViews}}}function lt({level:s,title:e,karma:t=0,xp:i=0}){if(document.getElementById("lvl-spectacle"))return;const n=B.LEVEL_UP_SPECTACLE_DURATION,o=document.createElement("style");o.id="lvl-spectacle-styles",o.textContent=`
    #lvl-spectacle {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .lvl-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(10, 5, 40, 0.7) 0%, rgba(0, 0, 0, 0.9) 80%);
      animation: fadeIn 0.6s ease-out forwards;
    }
    .lvl-ring {
      position: absolute;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 40px 0 #fff, 0 0 80px 0 #9f7aea, 0 0 120px 0 #4f46e5;
    }
    .lvl-ring-a {
      width: 30vmin;
      height: 30vmin;
      border: 2.5vmin solid transparent;
      background: conic-gradient(from 0deg, #c084fc, #818cf8, #60a5fa, #c084fc) border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: spin 2.5s linear infinite;
    }
    .lvl-ring-b {
      width: 40vmin;
      height: 40vmin;
      border: 1.5vmin solid rgba(255, 255, 255, 0.15);
      animation: spin 4s linear infinite reverse;
    }
    .lvl-flare {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 120vmin;
      height: 120vmin;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 60%);
      transform: translate(-50%, -50%) scale(0);
      animation: flare 1.2s 0.3s ease-out forwards;
    }
    .lvl-text {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #fff;
      animation: textIn 0.8s 0.5s ease-out forwards;
      opacity: 0;
    }
    .lvl-title {
      font-size: clamp(3rem, 12vmin, 8rem);
      font-weight: 900;
      letter-spacing: 0.05em;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fde68a 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
    }
    .lvl-sub {
      font-size: clamp(1.2rem, 4vmin, 2.5rem);
      margin-top: 0.5em;
      color: #e0e0ff;
    }
    .lvl-rewards {
      font-size: clamp(0.9rem, 3vmin, 1.3rem);
      margin-top: 1em;
      color: #c4b5fd;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes flare {
      to { transform: translate(-50%, -50%) scale(2); opacity: 0; }
    }
    @keyframes textIn {
      from { transform: translate(-50%, -30%); opacity: 0; }
      to { transform: translate(-50%, -50%); opacity: 1; }
    }
    @keyframes particle {
      to {
        transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy)));
        opacity: 0;
      }
    }
  `,document.head.appendChild(o);const r=document.createElement("div");r.id="lvl-spectacle",r.setAttribute("aria-hidden","true"),r.setAttribute("role","presentation"),r.innerHTML=`
    <div class="lvl-overlay"></div>
    <div class="lvl-ring lvl-ring-a"></div>
    <div class="lvl-ring lvl-ring-b"></div>
    <div class="lvl-flare"></div>
    <div class="lvl-text">
      <div class="lvl-title">LEVEL ${s}</div>
      <div class="lvl-sub">${e}</div>
      <div class="lvl-rewards">+${i} XP${t?` +${t} Karma`:""}</div>
    </div>
  `,document.body.appendChild(r);const l=r.querySelector(".lvl-flare");for(let d=0;d<B.PARTICLE_COUNT;d++){const c=document.createElement("div"),u=40+Math.random()*40;c.style.cssText=`
      position: absolute;
      left: 50%;
      top: 50%;
      width: 4px;
      height: 4px;
      background: hsl(${u}, 100%, 70%);
      border-radius: 50%;
      box-shadow: 0 0 6px hsl(${u}, 100%, 70%);
      transform: translate(-50%, -50%);
      animation: particle ${1.2+Math.random()*.8}s ${Math.random()*.3}s ease-out forwards;
    `;const h=Math.random()*Math.PI*2,p=30+Math.random()*50;c.style.setProperty("--dx",`${Math.cos(h)*p}vmin`),c.style.setProperty("--dy",`${Math.sin(h)*p}vmin`),l.appendChild(c)}setTimeout(()=>{r.remove(),o.remove()},n)}const I=class I{constructor(e){this.app=e,this.searchQuery="",this.isDestroyed=!1,this.domCache={},this.resizeTimeout=null,this.searchDebounce=null,this.boundHandleResize=null,this._boundMoodHandler=null,this.currentCheckin=this.getTodayCheckin(),this.initializeListeners(),this.scheduleInitialRender()}initializeListeners(){this.boundHandleResize=this.handleResize.bind(this),window.addEventListener("resize",this.boundHandleResize)}scheduleInitialRender(){let e=0;const t=()=>{if(!this.isDestroyed){if(document.getElementById("energy-tab")){this.render();return}++e<I.MAX_RENDER_RETRIES&&requestAnimationFrame(t)}};requestAnimationFrame(t)}handleResize(){clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{var e;!this.isDestroyed&&((e=document.getElementById("energy-tab"))!=null&&e.offsetParent)&&this.updateChartsOnly()},I.RESIZE_DEBOUNCE)}updateChartsOnly(){const e=document.querySelector(".weekly-chart-box"),t=document.querySelector(".chakra-balance-radar");e&&(e.innerHTML=this.renderWeeklyChart(this.getWeeklyData())),t&&(t.innerHTML=this.renderRadarChart(this.getChakraAverages(),200))}getTodayCheckin(){try{const e=this.getISODate(),i=(this.app.state.data.energyEntries||[]).find(n=>this.getISODate(n.timestamp)===e);return i!=null&&i.chakras?{overallEnergy:i.energy||6,moodTags:i.moodTags||[],chakras:i.chakras,notes:i.notes||"",practicesDone:i.practicesDone||[],timestamp:i.timestamp,dayCheckin:i.dayCheckin||!1,nightCheckin:i.nightCheckin||!1}:this.createDefaultCheckin()}catch(e){return console.error("Error loading check-in:",e),this.createDefaultCheckin()}}createDefaultCheckin(){return{overallEnergy:6,moodTags:[],chakras:this.getDefaultChakraSnapshot(),notes:"",practicesDone:[],timestamp:Date.now(),dayCheckin:!1,nightCheckin:!1}}getDefaultChakraSnapshot(){const e={};return I.CHAKRAS.forEach(t=>e[t.key]=5),e}getISODate(e=Date.now()){const t=new Date(e);return t.setHours(0,0,0,0),t.toISOString().split("T")[0]}getTimeOfDayInfo(){const e=new Date().getHours(),t=e>=I.DAY_START_HOUR&&e<I.DAY_END_HOUR;let i;return e<12?i="morning":e<18?i="afternoon":i="evening",{period:t?"day":"night",greeting:i,isDay:t}}saveCheckin(e=!1){try{const{period:t}=this.getTimeOfDayInfo(),i=this.app.state.data.energyEntries||[],n=this.getISODate(),o=i.findIndex(l=>this.getISODate(l.timestamp)===n);t==="day"?this.currentCheckin.dayCheckin=!0:this.currentCheckin.nightCheckin=!0;const r={energy:this.currentCheckin.overallEnergy,moodTags:this.currentCheckin.moodTags,chakras:this.currentCheckin.chakras,notes:this.currentCheckin.notes,practicesDone:e?[...this.currentCheckin.practicesDone||[],"manual"]:this.currentCheckin.practicesDone||[],timestamp:Date.now(),date:n,dayCheckin:this.currentCheckin.dayCheckin,nightCheckin:this.currentCheckin.nightCheckin,timeOfDay:t};o>=0?(r.dayCheckin=r.dayCheckin||i[o].dayCheckin,r.nightCheckin=r.nightCheckin||i[o].nightCheckin,i[o]=r):i.unshift(r),this.app.state.data.energyEntries=i,this.app.state.saveAppData(),this.app.state.updateStreak(),this.app.gamification&&(this.app.gamification.progressEnergyCheckin(t),this.app.gamification.checkChakraBadges(this.currentCheckin.chakras)),this.app.showToast(`${t==="day"?"Day":"Night"} energy check-in saved!`,"success"),this.render()}catch(t){console.error("Error saving check-in:",t),this.app.showToast("Failed to save check-in","error")}}getWeeklyData(){const e=[];for(let i=6;i>=0;i--){const n=new Date;n.setDate(n.getDate()-i),e.push(this.getISODate(n.getTime()))}const t=this.app.state.data.energyEntries||[];return e.map(i=>{const n=t.find(o=>this.getISODate(o.timestamp)===i);return n?n.energy:0})}getChakraAverages(){const e=this.app.state.data.energyEntries||[];if(!e.length)return this.getDefaultChakraSnapshot();const t={};I.CHAKRAS.forEach(o=>t[o.key]=0);let i=0;if(e.forEach(o=>{o.chakras&&(i++,I.CHAKRAS.forEach(r=>{t[r.key]+=o.chakras[r.key]||0}))}),!i)return this.getDefaultChakraSnapshot();const n={};return I.CHAKRAS.forEach(o=>{n[o.key]=Math.round(t[o.key]/i*10)/10}),n}render(){if(this.isDestroyed)return;const e=document.getElementById("energy-tab");if(e)try{const t=this.app.state.getStats(),i=this.getWeeklyData(),n=this.getChakraAverages(),{period:o,greeting:r}=this.getTimeOfDayInfo(),l=o==="day"?this.currentCheckin.dayCheckin:this.currentCheckin.nightCheckin;e.innerHTML=this.buildMainHTML(t,i,n,r,o,l),this.clearDOMCache(),this.attachEventListeners()}catch(t){console.error("Render error:",t),e.innerHTML='<div class="card"><p>Error loading. Please refresh.</p></div>'}}clearDOMCache(){this.domCache={}}getElement(e){return this.domCache[e]||(this.domCache[e]=document.getElementById(e)),this.domCache[e]}buildMainHTML(e,t,i,n,o,r){const l=this.app.state.data.energyEntries||[],d=this.filterJournalEntries(l);return`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          ${this.buildHeader()}
          ${this.buildCheckinCard(e,n,o,r)}
          ${this.buildReikiCTA()}
          ${this.buildChartsSection(t,i)}
          ${this.buildJournalSection(d)}
        </div>
      </div>
      ${this.buildStyles()}
    `}filterJournalEntries(e){if(!this.searchQuery)return e;const t=this.searchQuery.toLowerCase();return e.filter(i=>{const n=(i.notes||"").toLowerCase().includes(t),o=(i.moodTags||[]).join(" ").toLowerCase().includes(t);return n||o})}buildHeader(){return`
      <header class="main-header project-curiosity" 
              style="--header-img:url('/Tabs/NavEnergy.webp');
                     --header-title:'';
                     --header-tag:'Check, review, track and learn your energy patterns - Overall and Chakras'">
        <h1>Energy Tracker</h1>
        <h3>Check, review, track and learn your energy patterns - Overall and Chakras</h3>
      </header>
    `}buildReikiCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin:0;font-size:1.15rem;text-align:center;">
            Learn & Practice Reiki and Chakras with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Deepen your energy practice together. Join live sessions, guided meditations,
          and group healing circles - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Enter the Community Hub
          </button>
          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'reiki'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>Enter the Reiki Room
          </button>
        </div>
      </div>
    `}buildCheckinCard(e,t,i,n){return`
      <div class="card" style="margin-bottom: 2rem;">
        ${this.buildCheckinHeader(e,t,i,n)}
        ${this.buildOverallEnergySlider()}
        ${this.buildMoodSelector()}
        ${this.buildChakraSection()}
        ${this.buildNotesSection()}
        ${this.buildActionButtons(i)}
      </div>
    `}buildCheckinHeader(e,t,i,n){return`
      <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
        <div>
          <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">Good ${t}</h3>
          <p class="text-sm" style="color:var(--neuro-text-light);">
            Log in your Overall Energy and your Specific Chakras
          </p>
          ${n?`
            <p class="text-sm mt-1" style="color:var(--neuro-success);">
              ✓ ${i==="day"?"Day":"Night"} check-in completed
            </p>
          `:""}
        </div>
        <div class="text-right">
          <p class="text-sm" style="color:var(--neuro-text-light);">
            ${new Date().toLocaleDateString()}
          </p>
          <p class="text-sm" style="color:var(--neuro-text-light);">
            Streak: ${e.currentStreak} day(s)
          </p>
          <div class="flex gap-2 mt-2 justify-end text-xs">
            <span class="${this.currentCheckin.dayCheckin?"badge badge-success":"badge"}" 
                  style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              ${this.currentCheckin.dayCheckin?"✓":""}
            </span>
            <span class="${this.currentCheckin.nightCheckin?"badge badge-success":"badge"}" 
                  style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ${this.currentCheckin.nightCheckin?"✓":""}
            </span>
          </div>
        </div>
      </div>
    `}buildOverallEnergySlider(){return`
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Overall Energy Level</label>
        <div class="flex items-center gap-4">
          <input type="range" 
                 id="energy-overall-slider" 
                 min="0" 
                 max="10" 
                 step="0.5" 
                 value="${this.currentCheckin.overallEnergy}" 
                 class="flex-1"
                 aria-label="Overall energy level"/>
          <span id="energy-overall-value" 
                class="text-3xl font-bold" 
                style="color:var(--neuro-accent);min-width:3rem;text-align:center;">
            ${this.currentCheckin.overallEnergy}
          </span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-sm" style="color:var(--neuro-text-light);">Low</span>
          <span class="text-sm" style="color:var(--neuro-text-light);">High</span>
        </div>
      </div>
    `}buildMoodSelector(){return`
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Current Mood</label>
        <div id="mood-chips" class="flex flex-wrap gap-2">
          ${I.MOODS.map(e=>`
            <button class="chip ${this.currentCheckin.moodTags.includes(e)?"active":""}" 
                    data-mood="${e}"
                    type="button">
              ${this.getMoodEmoji(e)} ${this.capitalize(e)}
            </button>
          `).join("")}
        </div>
      </div>
    `}buildChakraSection(){return`
      <div style="margin-bottom: 2rem;">
        <label class="form-label">Chakra Check-in</label>
        <div id="chakra-row" class="chakra-row">
          ${this.buildChakraRow()}
        </div>
      </div>
    `}buildNotesSection(){return`
      <div style="margin-bottom: 2rem;">
        <label for="energy-notes" class="form-label">
          Notes, Thoughts, Emotions, Mood
        </label>
        <textarea id="energy-notes" 
                  class="form-input" 
                  placeholder="Any reflections, situations, or notable events regarding your energies..."
                  aria-label="Energy notes"
        >${this.currentCheckin.notes||""}</textarea>
      </div>
    `}buildActionButtons(e){return`
      <div class="energy-action-buttons">
        <button id="btn-save-checkin" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
          Save ${e==="day"?"Day":"Night"} Check-in
        </button>
        <button id="btn-reset-today" class="btn btn-secondary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Form
        </button>
      </div>
    `}buildChakraRow(){return I.CHAKRAS.map(e=>{const t=this.currentCheckin.chakras[e.key]||5,i=Math.abs(5-t),n=Math.min(12,i*2+2),o=Math.min(.48,i/6+.08),r=Math.floor(o*255).toString(16).padStart(2,"0");return`
        <div class="chakra-mini-card" data-chakra="${e.key}">
          <div class="chakra-pulse" 
               style="box-shadow:0 0 ${n}px ${e.color}${r};
                      opacity:${i>0?1:0};
                      transform:scale(${1+i*.01})">
          </div>
          <div class="chakra-icon" style="background:${e.color}">
            ${e.name.charAt(0)}
          </div>
          <div style="font-size:13px;font-weight:700;text-align:center">
            ${e.name}
          </div>
          <input type="range" 
                 class="chakra-slider" 
                 data-chakra="${e.key}" 
                 min="0" 
                 max="10" 
                 step="0.5" 
                 value="${t}" 
                 style="width:100%"
                 aria-label="${e.name} level"/>
          <div class="chakra-value" style="font-size:13px;font-weight:700">
            ${t}
          </div>
        </div>
      `}).join("")}buildChartsSection(e,t){return`
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom: 2rem;">
        <div class="card p-4 card-flex">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">
            Weekly Trend
          </h3>
          <div class="card-body w-full">
            <div class="weekly-chart-box">
              ${this.renderWeeklyChart(e)}
            </div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom: 1rem;">
            Chakra Balance
          </h3>
          <div class="flex justify-center chakra-balance-radar">
            ${this.renderRadarChart(t,200)}
          </div>
          <div class="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
            ${I.CHAKRAS.map(i=>`
              <div>
                <div class="font-bold" style="color:${i.color};">
                  ${t[i.key]}
                </div>
                <div class="text-gray-500">${i.name}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}buildJournalSection(e){return`
      <div class="card calc-expandable-card" id="journal-collapsible-card">
        <div class="calc-expandable-header" id="journal-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
               style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;
                     text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">
            My Energy Tracker
          </h3>
        </div>
        <div class="calc-expandable-content">
          <div style="margin-bottom: 2rem;">
            <input type="text" 
                   id="journal-search" 
                   class="form-input" 
                   placeholder="Search notes or moods..." 
                   value="${this.searchQuery}"
                   aria-label="Search journal entries"/>
          </div>
          <div class="space-y-4">
            ${this.buildJournalEntries(e)}
          </div>
        </div>
      </div>
    `}buildJournalEntries(e){if(e.length===0)return`
        <div class="card text-center" style="padding:4rem;">
          <div style="display:flex;justify-content:center;margin-bottom:1rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:56px;height:56px;color:var(--neuro-text-light);"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <p style="color:var(--neuro-text-light);">
            ${this.searchQuery?"No entries found matching your search":"No journal entries yet. Your check-ins will appear here."}
          </p>
        </div>
      `;const t=e.slice(0,I.MAX_HISTORY_DISPLAY).map(n=>this.renderJournalEntry(n)).join(""),i=e.length>I.MAX_HISTORY_DISPLAY?`<div class="text-center mt-6">
           <p class="text-sm" style="color:var(--neuro-text-light);">
             Showing ${I.MAX_HISTORY_DISPLAY} most recent entries
           </p>
         </div>`:"";return t+i}renderJournalEntry(e){const t=new Date(e.timestamp),i=t.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),n=t.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),o=[];return e.dayCheckin&&o.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Day</span>'),e.nightCheckin&&o.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Night</span>'),`
      <div class="card" style="border-left:4px solid var(--neuro-accent)">
        <div class="flex justify-between items-start" style="margin-bottom: 1rem;">
          <div>
            <div class="font-bold text-lg" style="color:var(--neuro-text)">${i}</div>
            <div class="text-sm" style="color:var(--neuro-text-light)">${n}</div>
            ${o.length?`<div class="flex gap-2 mt-2">${o.join("")}</div>`:""}
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-3xl font-bold" style="color:var(--neuro-accent)">${e.energy}</div>
              <div class="text-sm" style="color:var(--neuro-text-light);">Energy</div>
            </div>
            <button class="btn-delete-entry" data-timestamp="${e.timestamp}" 
                    title="Delete entry"
                    style="display:inline-flex;align-items:center;justify-content:center;
                           width:32px;height:32px;border-radius:50%;border:none;cursor:pointer;
                           background:rgba(224,75,75,0.1);color:#e04b4b;flex-shrink:0;
                           transition:background 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
        ${this.buildEntryMoodTags(e)}
        ${this.buildEntryNotes(e)}
        ${this.buildEntryChakras(e)}
      </div>
    `}buildEntryMoodTags(e){return!e.moodTags||e.moodTags.length===0?"":`
      <div class="flex flex-wrap gap-2" style="margin-bottom: 1rem;">
        ${e.moodTags.map(t=>`
          <span class="badge" style="font-size:0.85rem">
            ${this.getMoodEmoji(t)} ${this.capitalize(t)}
          </span>
        `).join("")}
      </div>
    `}buildEntryNotes(e){return e.notes?`
      <div style="color:var(--neuro-text);line-height:1.6;white-space:pre-wrap">
        ${e.notes}
      </div>
    `:""}buildEntryChakras(e){return e.chakras?`
      <div class="mt-4 pt-4" style="border-top:1px solid rgba(0,0,0,.05)">
        <div class="text-sm font-bold" style="color:var(--neuro-text-light);margin-bottom: 0.5rem;">
          Chakras:
        </div>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
          ${I.CHAKRAS.map(t=>`
            <div class="text-center">
              <div class="text-xs" style="color:var(--neuro-text-light);margin-bottom: 0.25rem;">
                ${t.name}
              </div>
              <div class="text-sm font-bold" style="color:${t.color}">
                ${e.chakras[t.key]||5}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `:""}renderWeeklyChart(e){const t=document.querySelector("#energy-tab .card-body");if(!t)return'<div style="padding:2rem;color:var(--neuro-text-light)">Loading...</div>';const i=t.clientWidth,n=t.clientHeight,o=20,l=n+105+o,d=.55,c=.01,u=i/7,h=n/10,p=u*c,m=u*d-p,g=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],y=C=>C===0?"#e04b4b":C<=3?"#f08a4b":C<=6?"#f6c24a":C<=9?"#6fcf97":"#ffd700";let b=`<svg viewBox="0 ${-o} ${i} ${l}" 
                    style="width:100%;height:100%;display:block">`;for(let C=0;C<=10;C+=2){const P=n-C*h;b+=`<line x1="0" y1="${P}" x2="${i}" y2="${P}" 
                    stroke="rgba(0,0,0,.08)" stroke-width="1"/>`,b+=`<text x="6" y="${P+5}" font-size="14" font-weight="bold" 
                    fill="var(--neuro-text-light)" text-anchor="middle">${C}</text>`}e.forEach((C,P)=>{const N=Math.min(10,Math.max(0,C)),G=N===0?6:N*h,X=P*u+p,j=X+m/2,D=n-G;b+=`<rect x="${X}" y="${D}" width="${m}" height="${G}" 
                    rx="2" fill="${y(N)}"/>`;const Z=n+22;b+=`<text x="${j}" y="${Z}" font-size="14" font-weight="bold" 
                    fill="var(--neuro-text-light)" text-anchor="middle" 
                    transform="rotate(-90,${j},${Z})">${g[P]}</text>`});const S=e.filter(C=>C>0),k=S.length?(S.reduce((C,P)=>C+P,0)/S.length).toFixed(1):"-";return b+=`<text x="${i/2}" y="${n+85}" font-size="14" font-weight="bold" 
                  fill="var(--neuro-text)" text-anchor="middle">
              7 Days Average: ${k}
            </text>`,b+="</svg>",b}renderRadarChart(e,t){const i=I.CHAKRAS.map(d=>d.key),n=t/2,o=t/2,r=t/2-24,l=i.map((d,c)=>{const u=Math.PI*2*c/i.length-Math.PI/2,h=Math.max(0,Math.min(10,e[d]||0)),p=n+Math.cos(u)*r*(h/10),m=o+Math.sin(u)*r*(h/10);return`${p},${m}`}).join(" ");return`
      <svg viewBox="0 0 ${t} ${t}" style="max-width:100%;height:auto">
        ${[.25,.5,.75,1].map(d=>`
          <circle cx="${n}" cy="${o}" r="${r*d}" 
                  stroke="#e6eef4" fill="none" stroke-width="1"/>
        `).join("")}
        
        ${i.map((d,c)=>{const u=Math.PI*2*c/i.length-Math.PI/2,h=n+Math.cos(u)*r,p=o+Math.sin(u)*r;return`<line x1="${n}" y1="${o}" x2="${h}" y2="${p}" 
                        stroke="#eef6fa" stroke-width="1"/>`}).join("")}
        
        <polygon points="${l}" 
                 fill="rgba(102,126,234,.2)" 
                 stroke="var(--neuro-accent)" 
                 stroke-width="2"/>
        
        ${I.CHAKRAS.map((d,c)=>{const u=Math.PI*2*c/i.length-Math.PI/2,h=n+Math.cos(u)*(r+12),p=o+Math.sin(u)*(r+12);return`<text x="${h}" y="${p}" text-anchor="middle" dominant-baseline="middle" 
                        font-size="10" fill="var(--neuro-text-light)">${d.name}</text>`}).join("")}
      </svg>
    `}attachEventListeners(){this.attachOverallEnergyListener(),this.attachNotesListener(),this.attachMoodListeners(),this.attachChakraListeners(),this.attachButtonListeners(),this.attachCollapsibleListener(),this.attachSearchListener(),this.attachDeleteListeners()}attachDeleteListeners(){document.querySelectorAll(".btn-delete-entry").forEach(e=>{e.addEventListener("click",t=>{const i=parseInt(t.currentTarget.dataset.timestamp);confirm("Delete this energy entry?")&&this.deleteEnergyEntry(i)})})}deleteEnergyEntry(e){try{const t=this.app.state.data.energyEntries||[],i=t.findIndex(n=>n.timestamp===e);i>=0&&(t.splice(i,1),this.app.state.data.energyEntries=t,this.app.state.saveAppData(),this.app.showToast("Entry deleted","success"),this.render())}catch(t){console.error("Error deleting entry:",t),this.app.showToast("Failed to delete entry","error")}}attachOverallEnergyListener(){const e=this.getElement("energy-overall-slider"),t=this.getElement("energy-overall-value");e&&t&&e.addEventListener("input",i=>{const n=parseFloat(i.target.value);this.currentCheckin.overallEnergy=n,t.textContent=n})}attachNotesListener(){const e=this.getElement("energy-notes");e&&e.addEventListener("input",t=>{this.currentCheckin.notes=t.target.value})}attachMoodListeners(){this._boundMoodHandler=e=>{const t=e.currentTarget;if(!t)return;const i=t.dataset.mood;if(!i)return;const n=this.currentCheckin.moodTags.indexOf(i);n>=0?(this.currentCheckin.moodTags.splice(n,1),t.classList.remove("active")):(this.currentCheckin.moodTags.push(i),t.classList.add("active"))},document.querySelectorAll("[data-mood]").forEach(e=>{e.removeEventListener("click",this._boundMoodHandler),e.addEventListener("click",this._boundMoodHandler)})}attachChakraListeners(){document.querySelectorAll(".chakra-slider").forEach(e=>{e.addEventListener("input",t=>{const i=t.target.dataset.chakra,n=parseFloat(t.target.value);this.currentCheckin.chakras[i]=n;const o=t.target.closest(".chakra-mini-card"),r=o==null?void 0:o.querySelector(".chakra-value");r&&(r.textContent=n),this.updateChakraPulse(o,i,n)})})}updateChakraPulse(e,t,i){if(!e)return;const n=Math.abs(5-i),o=Math.min(12,n*2+2),r=Math.min(.48,n/6+.08),l=I.CHAKRAS.find(c=>c.key===t),d=e.querySelector(".chakra-pulse");if(d&&l){const c=Math.floor(r*255).toString(16).padStart(2,"0");d.style.boxShadow=`0 0 ${o}px ${l.color}${c}`,d.style.opacity=n>0?1:0,d.style.transform=`scale(${1+n*.01})`}}attachButtonListeners(){const e=this.getElement("btn-save-checkin");e&&e.addEventListener("click",()=>this.saveCheckin(!1));const t=this.getElement("btn-reset-today");t&&t.addEventListener("click",()=>{confirm("Clear form? (saved entry stays)")&&(this.currentCheckin=this.createDefaultCheckin(),this.render())})}attachCollapsibleListener(){const e=this.getElement("journal-collapsible-header"),t=this.getElement("journal-collapsible-card");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("expanded")})}attachSearchListener(){const e=this.getElement("journal-search"),t=this.getElement("journal-collapsible-card");e&&e.addEventListener("input",i=>{clearTimeout(this.searchDebounce),this.searchDebounce=setTimeout(()=>{this.searchQuery=i.target.value,this.render(),t==null||t.classList.add("expanded")},I.SEARCH_DEBOUNCE)})}buildStyles(){return`
      <style>
        .card-flex { 
          display: flex; 
          flex-direction: column; 
        }
        .card-body { 
          flex: 1 1 0; 
          min-height: 0; 
          width: 100%; 
        }
        .weekly-chart-box { 
          aspect-ratio: 7/10; 
          max-width: 100%; 
          max-height: 100%; 
          margin: auto; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .chakra-row { 
          display: flex; 
          gap: 12px; 
          padding: 8px 2px; 
        }
        .chakra-mini-card { 
          flex: 1 1 0; 
          min-width: 112px; 
          background: var(--neuro-bg); 
          border-radius: 12px; 
          padding: 10px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 8px; 
          position: relative; 
          box-shadow: 8px 8px 18px var(--neuro-shadow-dark), 
                      -8px -8px 18px var(--neuro-shadow-light); 
        }
        .chakra-icon { 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          color: white; 
          display: grid; 
          place-items: center; 
          font-weight: 700; 
          font-size: 0.9rem; 
          box-shadow: inset 4px 4px 8px rgba(0,0,0,.1), 
                      inset -4px -4px 8px rgba(255,255,255,.2); 
        }
        .chakra-pulse { 
          position: absolute; 
          inset: -6px; 
          border-radius: 16px; 
          pointer-events: none; 
          transition: all 260ms ease; 
        }
        .energy-action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .energy-action-buttons .btn {
          flex: 1;
        }
        .chip {
          background: rgba(31,45,61,0.04);
          border: 1px solid rgba(0,0,0,0.02);
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all .2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .chip.active { 
          background: linear-gradient(90deg, rgba(246,194,74,0.16), rgba(110,231,183,0.12)); 
          box-shadow: inset 4px 4px 8px rgba(0,0,0,.04), 
                      inset -4px -4px 8px rgba(255,255,255,.7); 
        }
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          line-height: 1;
        }
        .calc-expandable-header { 
          padding: 24px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .calc-expandable-header h3 { 
          margin: 0; 
          font-size: 1.1rem; 
          color: var(--neuro-text); 
        }
        .chevron { 
          font-size: 1.5rem; 
          transition: transform var(--transition-normal); 
          color: var(--neuro-accent); 
        }
        .calc-expandable-card.expanded .chevron { 
          transform: rotate(90deg); 
        }
        .calc-expandable-content { 
          max-height: 0; 
          overflow: hidden; 
          transition: max-height var(--transition-slow); 
        }
        .calc-expandable-card.expanded .calc-expandable-content { 
          max-height: 5000px; 
          padding: 0 24px 24px; 
        }
        @media (max-width: 768px) {
          .energy-action-buttons {
            flex-direction: column;
          }
          .energy-action-buttons .btn {
            width: 100%;
          }
          .chakra-row {
            flex-wrap: wrap;
          }
          .chakra-mini-card {
            min-width: calc(50% - 6px);
          }
        }
      </style>
    `}getMoodEmoji(e){return I.MOOD_EMOJIS[e]||"😊"}capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}destroy(){this.isDestroyed=!0,window.removeEventListener("resize",this.boundHandleResize),clearTimeout(this.resizeTimeout),clearTimeout(this.searchDebounce),this.domCache={},this._boundMoodHandler=null}};_(I,"CHAKRAS",[{key:"root",name:"Root",color:"#e04b4b"},{key:"sacral",name:"Sacral",color:"#f08a4b"},{key:"solar",name:"Solar",color:"#f6c24a"},{key:"heart",name:"Heart",color:"#6fcf97"},{key:"throat",name:"Throat",color:"#5fb7f0"},{key:"thirdEye",name:"Third Eye",color:"#8b6be6"},{key:"crown",name:"Crown",color:"#c59ee9"}]),_(I,"MOODS",["grounded","anxious","calm","happy","creative","tired","focused","grateful","curious","confident"]),_(I,"MOOD_EMOJIS",{grounded:"🌍",anxious:"😰",calm:"😌",happy:"😊",creative:"🎨",tired:"😴",focused:"🎯",grateful:"🙏",curious:"🤔",confident:"💪"}),_(I,"RESIZE_DEBOUNCE",120),_(I,"SEARCH_DEBOUNCE",300),_(I,"MAX_RENDER_RETRIES",50),_(I,"MAX_HISTORY_DISPLAY",30),_(I,"DAY_START_HOUR",5),_(I,"DAY_END_HOUR",17);let ne=I;typeof window<"u"&&(window.EnergyEngineEnhanced=ne);const L=class L{constructor(e){this.app=e,this.activeBoosts=[],this.items=[],this.skipCaps={},this._boostTicker=null,this._renderQueued=!1,this._syncInProgress=!1,this._initialized=!1,this.init().then(()=>{this._initialized=!0}).catch(t=>{console.error("[KarmaShop] init failed:",t),this.activeBoosts=[],this.items=[],this._initialized=!0})}async init(){await this.loadFromCloud(),this.initSkipCaps(),this.checkExpiredBoosts(),this.buildCatalog()}destroy(){this._clearTicker()}_clearTicker(){this._boostTicker&&(clearInterval(this._boostTicker),this._boostTicker=null)}async loadFromCloud(){var e,t;try{const i=(t=(e=this.app)==null?void 0:e.state)==null?void 0:t.data;if(i!=null&&i.karmaShop){const n=i.karmaShop;this.activeBoosts=n.activeBoosts||[],n.purchaseHistory&&localStorage.setItem("karma_purchase_history",JSON.stringify(n.purchaseHistory)),localStorage.setItem("karma_active_boosts",JSON.stringify(this.activeBoosts));return}this.activeBoosts=this.loadActiveBoosts()}catch(i){console.error("[KarmaShop] Load failed, using localStorage:",i),this.activeBoosts=this.loadActiveBoosts()}}async saveToCloud(){var e;if(!this._syncInProgress){this._syncInProgress=!0;try{(e=this.app)!=null&&e.state&&(this.app.state.data={...this.app.state.data,karmaShop:{activeBoosts:this.activeBoosts,purchaseHistory:this.getPurchaseHistory(),lastSync:new Date().toISOString()}},await this.app.state.saveAppData()),this.saveActiveBoostsLocal()}catch(t){console.error("[KarmaShop] Save failed:",t),this.saveActiveBoostsLocal()}finally{this._syncInProgress=!1}}}_isAdmin(){var e;return!!((e=this.app.state.currentUser)!=null&&e.isAdmin)}initSkipCaps(){var n,o,r;const e=Date.now(),t={dailySkips:{key:this._weekKey(e)},weeklySkips:{key:this._monthKey(e)},monthlySkips:{key:this._yearKey(e)}},i=((r=(o=(n=this.app)==null?void 0:n.gamification)==null?void 0:o.state)==null?void 0:r.skipCaps)||{};Object.entries(t).forEach(([l,{key:d}])=>{const c=i[l];let u=(c==null?void 0:c.key)===d?c:null;if(!u){const h=this._getLocalStorage(`karma_skip_caps_${l}`,{});u=h.key===d?h:{key:d,used:0}}this.skipCaps[l]=u}),this._persistSkipCaps()}_persistSkipCaps(){var e,t;(t=(e=this.app)==null?void 0:e.gamification)!=null&&t.state&&(this.app.gamification.state.skipCaps={...this.skipCaps},this.app.gamification.saveState()),Object.entries(this.skipCaps).forEach(([i,n])=>{localStorage.setItem(`karma_skip_caps_${i}`,JSON.stringify(n))})}_weekKey(e){const t=new Date(e),i=t.getFullYear(),n=Math.ceil((t-new Date(i,0,1))/6048e5);return`${i}-W${String(n).padStart(2,"0")}`}_monthKey(e){return new Date(e).toISOString().slice(0,7)}_yearKey(e){return new Date(e).getFullYear().toString()}_useSkipCap(e){this._isAdmin()||(this.skipCaps[e].used+=1,this._persistSkipCaps(),this.queueRender())}_skipCapUsed(e){var t;return((t=this.skipCaps[e])==null?void 0:t.used)||0}_skipCapMax(e){return L.SKIP_CAP_LIMITS[e]||0}_whenResets(e){return{skip_all_daily:"tonight at midnight",skip_all_weekly:"next Sunday",skip_all_monthly:"the 1st of next month"}[e]||"soon"}buildCatalog(){const e={daily:Math.max(0,this._skipCapMax("dailySkips")-this._skipCapUsed("dailySkips")),weekly:Math.max(0,this._skipCapMax("weeklySkips")-this._skipCapUsed("weeklySkips")),monthly:Math.max(0,this._skipCapMax("monthlySkips")-this._skipCapUsed("monthlySkips"))};this.items=[{id:"xp_multiplier",name:"XP Multiplier",description:"Double all XP gains for 24 h",cost:15,icon:"⚡",category:"Power-Ups",consumable:!0,duration:864e5,rarity:"uncommon"},{id:"karma_multiplier",name:"Karma Multiplier",description:"Double all Karma gains for 24 h",cost:20,icon:"💫",category:"Power-Ups",consumable:!0,duration:864e5,rarity:"rare"},{id:"double_boost",name:"Double Boost",description:"Double your XP and Karma for 48 hours",cost:60,icon:"🔥",category:"Power-Ups",consumable:!0,duration:1728e5,rarity:"epic"},{id:"skip_all_daily",name:"Skip All Daily Quests",description:`Instantly complete all daily quests
(gaining 200 XP | 50 Karma)
Max 2 per week · ${e.daily} left this week.`,cost:70,icon:"⭐",category:"Quest Helpers",consumable:!0,rarity:"uncommon"},{id:"skip_all_weekly",name:"Skip All Weekly Quests",description:`Instantly complete all weekly quests
(gaining 500 XP | 125 Karma)
Max 2 per month · ${e.weekly} left this month.`,cost:200,icon:"📅",category:"Quest Helpers",consumable:!0,rarity:"rare"},{id:"skip_all_monthly",name:"Skip All Monthly Quests",description:`Instantly complete all monthly quests
(gaining 900 XP | 225 Karma)
Max 3 per year · ${e.monthly} left this year.`,cost:300,icon:"🗓️",category:"Quest Helpers",consumable:!0,rarity:"epic"},{id:"advanced_meditations",name:"Advanced Meditations",description:"Unlock premium guided meditation library",cost:150,icon:"🧘‍♀️",category:"Premium Features",consumable:!1,rarity:"rare"},{id:"shadow_alchemy_lab",name:"Shadow Alchemy Lab",description:"Transform shadows into personal growth tools",cost:200,icon:"🌑",category:"Premium Features",consumable:!1,rarity:"epic"},{id:"advance_tarot_spreads",name:"Advance Tarot Spreads",description:"Unlock premium spreads and TarotVision AI",cost:300,icon:"🃏",category:"Premium Features",consumable:!1,rarity:"legendary"},{id:"luxury_champagne_gold_skin",name:"Luxury Champagne-Gold Skin",description:"A rich champagne-gold colour theme for the entire app",cost:200,icon:"🥂",category:"Premium Skins",consumable:!1,rarity:"rare"},{id:"royal_indigo_skin",name:"Royal Indigo Skin",description:"Deep royal-indigo luxury dark theme for the entire app",cost:200,icon:"🟣",category:"Premium Skins",consumable:!1,rarity:"epic"},{id:"earth_luxury_skin",name:"Earth Luxury Skin",description:"Natural earth-tone luxury dark theme for the entire app",cost:300,icon:"🌍",category:"Premium Skins",consumable:!1,rarity:"legendary"},{id:"private_consultation",name:"Private Consultation with Aanandoham",description:"Online Video Session",cost:1e3,icon:"🧘",category:"Meet the Master",consumable:!0,rarity:"legendary"},{id:"private_tarot_reading",name:"Private Tarot Reading with Aanandoham",description:"Online Tarot Session",cost:1500,icon:"🔮",category:"Meet the Master",consumable:!0,rarity:"legendary"},{id:"reiki_healing",name:"Reiki Healing with Aanandoham",description:"Online Session and Distant Healing",cost:1500,icon:"💫",category:"Meet the Master",consumable:!0,rarity:"legendary"}]}safeUnlockFeature(e){try{this.app.gamification.unlockFeature(e)}catch(t){console.warn("[KarmaShop] unlockFeature error:",t)}}loadActiveBoosts(){return this._getLocalStorage("karma_active_boosts",[])}saveActiveBoostsLocal(){localStorage.setItem("karma_active_boosts",JSON.stringify(this.activeBoosts))}saveActiveBoosts(){this.saveActiveBoostsLocal(),this.saveToCloud()}_getLocalStorage(e,t){try{const i=localStorage.getItem(e);return i?JSON.parse(i):t}catch{return t}}_setLocalStorage(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(i){console.error(`[KarmaShop] localStorage write failed for ${e}:`,i)}}_nextQuestDailyReset(){const e=new Date;return e.setHours(24,0,0,0),e<=Date.now()&&e.setDate(e.getDate()+1),e.getTime()}_nextQuestWeeklyReset(){const e=new Date,t=(7-e.getDay())%7||7;return e.setDate(e.getDate()+t),e.setHours(0,0,0,0),e.getTime()}_nextQuestMonthlyReset(){const e=new Date;return e.setMonth(e.getMonth()+1,1),e.setHours(0,0,0,0),e.getTime()}_fmtDuration(e){const t=Math.max(0,Math.floor(e/1e3)),i=Math.floor(t/86400),n=Math.floor(t%86400/3600),o=Math.floor(t%3600/60),r=t%60,l=d=>d.toString().padStart(2,"0");return i?`${i}d ${l(n)}:${l(o)}:${l(r)}`:`${l(n)}:${l(o)}:${l(r)}`}checkExpiredBoosts(){const e=Date.now(),t=this.activeBoosts.length;this.activeBoosts=this.activeBoosts.filter(i=>i.id.startsWith("skip_all_")?e<(i.resetAt||0):i.expiresAt>e),t!==this.activeBoosts.length&&(this.saveActiveBoosts(),this.queueRender())}isBoostActive(e){if(e.startsWith("skip_all_")){const t=this.activeBoosts.find(i=>i.id===e);return t?Date.now()<(t.resetAt||0):!1}return this.activeBoosts.some(t=>t.id===e)}activateBoost(e,t){var i,n;(n=(i=this.app)==null?void 0:i.gamification)!=null&&n.activateBoost&&this.app.gamification.activateBoost(e,t),this.activeBoosts=this.activeBoosts.filter(o=>o.id!==e),this.activeBoosts.push({id:e,expiresAt:Date.now()+t}),this.saveActiveBoosts()}canPurchase(e){const t=this.items.find(n=>n.id===e);if(!t)return{can:!1,reason:"Item not found"};const i=this.app.gamification.state.karma;if(i<t.cost)return{can:!1,reason:`Need ${t.cost-i} more Karma`};if(t.consumable&&this.isBoostActive(e)&&!e.startsWith("skip_all_"))return{can:!1,reason:"Already active"};if(!t.consumable&&this.isItemOwned(e))return{can:!1,reason:"Already owned"};if(!this._isAdmin()&&L.CAP_MAP[e]){const n=L.CAP_MAP[e],o=this._skipCapUsed(n),r=this._skipCapMax(n);if(o>=r)return{can:!1,reason:`Cap reached (${r}/${r})`}}return{can:!0}}isItemOwned(e){var n,o,r;const t=this.getPurchaseHistory().some(l=>l.itemId===e),i=(r=(o=(n=this.app.gamification)==null?void 0:n.state)==null?void 0:o.unlockedFeatures)==null?void 0:r.includes(e);return t||i}purchase(e){const t=this.items.find(o=>o.id===e);if(!t)return this.app.showToast("Item not found","error"),!1;const i=this.canPurchase(e);if(!i.can){if(e.startsWith("skip_all_")){const o=L.CAP_MAP[e],r=o==="dailySkips"?"week":o==="weeklySkips"?"month":"year";this.app.showToast(`You've used all ${this._skipCapMax(o)} purchases for this ${r}. Resets ${this._whenResets(e)}.`,"info")}return this.app.showToast(`${i.reason}`,"error"),!1}return this.app.gamification.state.karma-=t.cost,this.app.gamification.saveState(),this.recordPurchase(e,t.cost),L.CAP_MAP[e]&&this._useSkipCap(L.CAP_MAP[e]),this.getPurchaseHistory().length===1&&this.app.gamification.grantBadge({id:"first_purchase",name:"First Purchase",icon:"🛒",description:"First purchase in the Karma Shop",xp:50,rarity:"epic"}),this.applyItemEffect(e,t),this.queueRender(),!0}recordPurchase(e,t){const i=this.getPurchaseHistory();i.push({itemId:e,cost:t,timestamp:new Date().toISOString()}),localStorage.setItem("karma_purchase_history",JSON.stringify(i)),this.saveToCloud()}getPurchaseHistory(){return this._getLocalStorage("karma_purchase_history",[])}applyItemEffect(e,t){try{e==="xp_multiplier"?(this.activateBoost("xp_multiplier",t.duration),this.app.showToast("2× XP active for 24 h!","success")):e==="karma_multiplier"?(this.activateBoost("karma_multiplier",t.duration),this.app.showToast("2× Karma active for 24 h!","success")):e==="double_boost"?(this.activateBoost("double_boost",t.duration),this.app.showToast("2× XP + 2× Karma active for 48 h!","success")):e.startsWith("skip_all_")?this._applyQuestSkip(e):e==="advanced_meditations"?(this.safeUnlockFeature("advanced_meditations"),this.app.showToast("Advanced meditations unlocked!","success")):e==="shadow_alchemy_lab"?(this.safeUnlockFeature("shadow_alchemy_lab"),this.app.showToast("Shadow Alchemy Lab unlocked!","success")):e==="advance_tarot_spreads"?(this.safeUnlockFeature("advance_tarot_spreads"),this.safeUnlockFeature("tarot_vision_ai"),this.app.showToast("Advanced Tarot Spreads & Tarot Vision AI unlocked!","success")):e==="luxury_champagne_gold_skin"?(this.safeUnlockFeature("luxury_champagne_gold_skin"),this.app.showToast("Luxury Champagne-Gold Skin unlocked!","success")):e==="royal_indigo_skin"?(this.safeUnlockFeature("royal_indigo_skin"),this.app.showToast("Royal Indigo Skin unlocked!","success")):e==="earth_luxury_skin"?(this.safeUnlockFeature("earth_luxury_skin"),this.app.showToast("Earth Luxury Skin unlocked!","success")):["private_consultation","private_tarot_reading","reiki_healing"].includes(e)&&this.showMasterPurchasePopup(t)}catch(i){console.error("[KarmaShop] applyItemEffect error:",i),this.app.showToast("Could not apply item – please reload","error")}}_applyQuestSkip(e){const i={skip_all_daily:{period:"daily",minXP:200,minKarma:50,resetFn:this._nextQuestDailyReset,label:"daily"},skip_all_weekly:{period:"weekly",minXP:500,minKarma:125,resetFn:this._nextQuestWeeklyReset,label:"weekly"},skip_all_monthly:{period:"monthly",minXP:900,minKarma:225,resetFn:this._nextQuestMonthlyReset,label:"monthly"}}[e];if(!i)return;const n=this.app.gamification,o=n.state.quests[i.period].filter(c=>!c.completed);let r=0,l=0;o.forEach(c=>{r+=c.xpReward??0,l+=c.karmaReward??0,c.completed=!0}),r=Math.max(r,i.minXP),l=Math.max(l,i.minKarma),n.state._bulkMode=!0,n.addXP(r,`Skip ${i.label} quests`,!0),n.addKarma(l,`Skip ${i.label} quests`,!0),n.state._bulkMode=!1,n.checkLevelUp(),n.queueBadgeCheck("quest"),n.saveState();const d=i.resetFn.call(this);this.activeBoosts.push({id:e,resetAt:d}),this.saveActiveBoosts(),this.app.showToast(`All ${i.label} quests completed! (+${r} XP | +${l} Karma)`,"success")}showMasterPurchasePopup(e){var r;const t=((r=this.app.state.currentUser)==null?void 0:r.name)||"Friend",i=e.cost,n=`${e.name} bought using ${i} Karma for ${t}.`,o=document.createElement("div");o.className="karma-shop-master-overlay",o.innerHTML=`
      <div class="card karma-shop-master-card">
        <div class="karma-shop-master-icon">🧘</div>
        <h3 class="karma-shop-master-title">Meet the Master</h3>
        <p class="karma-shop-master-message">${n}</p>
        <p class="karma-shop-master-instructions">Screenshot or save this message, then contact Aanandoham via WhatsApp to schedule your session:</p>
        <a href="https://wa.me/+972524588767?text=${encodeURIComponent(n)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary karma-shop-master-btn-wa">Open WhatsApp</a>
        <button onclick="this.closest('.karma-shop-master-overlay').remove()" class="btn btn-secondary karma-shop-master-btn-close">Close</button>
      </div>
    `,document.body.appendChild(o)}queueRender(){this._renderQueued||(this._renderQueued=!0,requestAnimationFrame(()=>{this.render(),this._renderQueued=!1}))}render(){const e=document.getElementById("karma-shop-tab");if(!e){console.error("[KarmaShop] karma-shop-tab element not found");return}if(!this._initialized){e.innerHTML=`
        <div class="karma-shop-container">
          <div class="karma-shop-content">
            <div class="card" style="text-align: center; padding: 3rem;">
              <h3>Loading Karma Shop...</h3>
              <p style="color: var(--neuro-text-light); margin-top: 1rem;">Syncing your data...</p>
            </div>
          </div>
        </div>
      `,setTimeout(()=>this.render(),100);return}this._clearTicker();const t=this.app.gamification.state.karma,i=this.getPurchaseHistory(),n=["Power-Ups","Quest Helpers","Premium Features","Premium Skins","Meet the Master"],o=this.renderActiveBoosts();e.innerHTML=`
      <div class="karma-shop-container">
        <div class="karma-shop-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavShop.webp');
                         --header-title:'';
                         --header-tag:'Exchange your Karma tokens for goodies and upgrades'">
            <h1>The Karma Shop</h1>
            <h3>Exchange your Karma tokens for goodies and upgrades</h3>
            <span class="header-sub"></span>
          </header>
          <div class="card karma-shop-balance">
            <h3 class="karma-shop-balance-title">Your Karma Balance</h3>
            <p class="karma-shop-balance-amount">${t}</p>
            <p class="karma-shop-balance-subtitle">Earn more by completing quests, using features and practices</p>
          </div>
          ${o}
          ${n.map(r=>{const l=this.items.filter(d=>d.category===r);return l.length===0?"":`
              <div class="karma-shop-category">
                <h3 class="karma-shop-category-title">${r}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  ${l.map(d=>this.renderShopItem(d)).join("")}
                </div>
              </div>
            `}).join("")}
          ${i.length>0?this.renderPurchaseHistory(i):""}
        </div>
      </div>
    `,this.startBoostTicker()}renderActiveBoosts(){return this.checkExpiredBoosts(),this.activeBoosts.length===0?"":`
      <div class="card karma-shop-boosts">
        <h3 class="karma-shop-boosts-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="16" height="10" x="2" y="7" rx="2" ry="2"/><path d="M22 11v2"/></svg> Active Boosts</h3>
        <div class="karma-shop-boosts-list" id="boosts-list-live">${this.activeBoosts.map(t=>{const n=t.id.startsWith("skip_all_")?(t.resetAt||0)-Date.now():t.expiresAt-Date.now();return`
        <div class="karma-shop-boost-item">
          <span class="karma-shop-boost-name">${L.NICE_NAMES[t.id]||t.id}</span>
          <span class="karma-shop-boost-time">${this._fmtDuration(n)}</span>
        </div>
      `}).join("")}</div>
      </div>
    `}startBoostTicker(){if(this.activeBoosts.length===0)return;const e=()=>{const t=document.getElementById("boosts-list-live");if(!t){console.warn("[KarmaShop] boosts-list-live element not found"),this._clearTicker();return}t.innerHTML=this.activeBoosts.map(i=>{const o=i.id.startsWith("skip_all_")?(i.resetAt||0)-Date.now():i.expiresAt-Date.now();return`
          <div class="karma-shop-boost-item">
            <span class="karma-shop-boost-name">${L.NICE_NAMES[i.id]||i.id}</span>
            <span class="karma-shop-boost-time">${this._fmtDuration(o)}</span>
          </div>
        `}).join("")};setTimeout(()=>{document.getElementById("boosts-list-live")?this._boostTicker=setInterval(e,5e3):console.error("[KarmaShop] Could not start boost ticker - element not found")},100)}renderShopItem(e){const t=this.canPurchase(e.id),i=!e.consumable&&this.isItemOwned(e.id),n=e.consumable&&this.isBoostActive(e.id),o=i?"OWNED":n?"ACTIVE":"",r=this.getRarityColor(e.rarity);return`
      <div class="card karma-shop-item" data-rarity="${e.rarity}" style="background:${r}">
        ${o?`<div class="karma-shop-item-owned-badge">${o}</div>`:""}
        <div class="karma-shop-item-content">
          <div class="karma-shop-item-icon">${e.icon}</div>
          <h4 class="karma-shop-item-name">${e.name}</h4>
          <p class="karma-shop-item-description">${e.description}</p>
        </div>
        <div class="karma-shop-item-footer">
          <div class="karma-shop-item-meta">
            <span class="karma-shop-item-rarity karma-shop-rarity-${e.rarity}">${e.rarity}</span>
            <span class="karma-shop-item-rarity karma-shop-item-cost karma-shop-rarity-${e.rarity}">${e.cost} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="display:inline;vertical-align:middle;width:14px;height:14px;"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg></span>
          </div>
          <button onclick="window.featuresManager.engines['karma-shop'].purchase('${e.id}')" class="btn ${t.can?"btn-primary":"btn-secondary"} karma-shop-item-btn" ${t.can?"":"disabled"}>
            ${i?"✓ Owned":n?"✓ Active":t.can?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="display:inline;vertical-align:middle;margin-right:0.3rem;"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>Purchase':t.reason}
          </button>
        </div>
      </div>
    `}renderPurchaseHistory(e){return`
      <div class="card karma-shop-history">
        <h3 class="karma-shop-history-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg> Purchase History</h3>
        <div class="karma-shop-history-list">
          ${e.slice(-10).reverse().map(t=>{const i=this.items.find(o=>o.id===t.itemId),n=new Date(t.timestamp).toLocaleDateString();return`
              <div class="karma-shop-history-item">
                <span class="karma-shop-history-item-name">${(i==null?void 0:i.icon)||"📦"} ${(i==null?void 0:i.name)||t.itemId}</span>
                <span class="karma-shop-history-item-meta">${n} • ${t.cost} Karma</span>
              </div>
            `}).join("")}
        </div>
      </div>
    `}getRarityColor(e){const t={common:"linear-gradient(135deg, rgba(245, 245, 247, 0.85) 0%, rgba(210, 214, 220, 0.85) 100%), linear-gradient(#f5f5f7, #d2d6dc)",uncommon:"linear-gradient(135deg, rgba(0, 224, 132, 0.85) 0%, rgba(0, 185, 108, 0.85) 100%), linear-gradient(#00e084, #00b96c)",rare:"linear-gradient(135deg, rgba(0, 168, 255, 0.85) 0%, rgba(0, 123, 204, 0.85) 100%), linear-gradient(#00a8ff, #007bcc)",epic:"linear-gradient(135deg, rgba(184, 0, 230, 0.85) 0%, rgba(142, 0, 204, 0.85) 100%), linear-gradient(#b800e6, #8e00cc)",legendary:"linear-gradient(135deg, rgba(255, 195, 0, 0.85) 0%, rgba(255, 135, 0, 0.85) 100%), linear-gradient(#ffc300, #ff8700)"};return t[e]||t.common}};_(L,"NICE_NAMES",{xp_multiplier:"⚡ 2× XP Boost",karma_multiplier:"💫 2× Karma Multiplier",double_boost:"🔥 Double Boost",skip_all_daily:"⭐ Skip Daily Quests",skip_all_weekly:"📅 Skip Weekly Quests",skip_all_monthly:"🗓️ Skip Monthly Quests"}),_(L,"SKIP_CAP_LIMITS",{dailySkips:2,weeklySkips:2,monthlySkips:3}),_(L,"CAP_MAP",{skip_all_daily:"dailySkips",skip_all_weekly:"weeklySkips",skip_all_monthly:"monthlySkips"});let ye=L;class ze{constructor(e){this.app=e,this.ytPlayer=null,this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null,this.progressInterval=null,this.eventCleanup=[],this.pdfGuideUrl="/Source_PDF/Meditation_Demo.pdf",this.SKIP_SECONDS=15,this.MIN_PLAYER_WIDTH=380,this.PROGRESS_UPDATE_MS=1e3,this.loadYouTubeAPI(),this.meditations=this.getMeditationsData()}loadYouTubeAPI(){if(window.YT&&window.YT.Player){window.ytReady=!0;return}if(window.onYouTubeIframeAPIReady=()=>{window.ytReady=!0},!document.querySelector('script[src*="youtube.com/iframe_api"]')){const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",document.head.appendChild(e)}}getMeditationsData(){return[{id:1,title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",description:"Connect deeply with Earth energy and find your center",embedUrl:"https://www.youtube.com/embed/_KedpeSYwgA?enablejsapi=1&rel=0&playsinline=1",emoji:"🌍",type:"guided",premium:!1},{id:2,title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",description:"Cleanse and strengthen your energetic field",embedUrl:"https://www.youtube.com/embed/gIMfdNkAC4g?enablejsapi=1&rel=0&playsinline=1",emoji:"✨",type:"guided",premium:!1},{id:3,title:"Chakra Cleaning",duration:"39:58",category:"Chakras",description:"Balance and clear all seven energy centers",embedUrl:"https://www.youtube.com/embed/BFvmLeYg7cE?enablejsapi=1&rel=0&playsinline=1",emoji:"🌈",type:"guided",premium:!1},{id:4,title:"The Center of the Universe",duration:"29:56",category:"Spiritual",description:"Expand your consciousness to cosmic awareness",embedUrl:"https://www.youtube.com/embed/1T2dNQ4M7Ko?enablejsapi=1&rel=0&playsinline=1",emoji:"🌌",type:"guided",premium:!1},{id:5,title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",description:"Release emotional blockages with visualization",embedUrl:"https://www.youtube.com/embed/3yQrtsHbSBo?enablejsapi=1&rel=0&playsinline=1",emoji:"🌹",type:"guided",premium:!1},{id:6,title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",description:"Align your intentions with universal flow",embedUrl:"https://www.youtube.com/embed/EvRa_qwgJao?enablejsapi=1&rel=0&playsinline=1",emoji:"⭐",type:"guided",premium:!1},{id:7,title:"Meeting your Higher Self",duration:"29:56",category:"Premium",description:"Connect with your highest consciousness",embedUrl:"https://www.youtube.com/embed/34mla-PnpeU?enablejsapi=1&rel=0&playsinline=1",emoji:"💎",type:"guided",premium:!0},{id:8,title:"Inner Temple",duration:"29:46",category:"Premium",description:"Create your sacred inner sanctuary",embedUrl:"https://www.youtube.com/embed/t6o6lpftZBA?enablejsapi=1&rel=0&playsinline=1",emoji:"🔮",type:"guided",premium:!0},{id:9,title:"Gratitude Practice",duration:"29:56",category:"Premium",description:"Cultivate deep appreciation and abundance",embedUrl:"https://www.youtube.com/embed/JyTwWAhsiq8?enablejsapi=1&rel=0&playsinline=1",emoji:"👑",type:"guided",premium:!0}]}showMeditationSchedule(e){var h;const i={guided:{title:"Today's Meditation Schedule",cycleSec:3600,openSec:900,sessions:[{title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",emoji:"🌍"},{title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",emoji:"✨"},{title:"Chakra Cleaning",duration:"39:58",category:"Chakras",emoji:"🌈"},{title:"The Center of the Universe",duration:"29:56",category:"Spiritual",emoji:"🌌"},{title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",emoji:"🌹"},{title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",emoji:"⭐"},{title:"Meeting your Higher Self",duration:"29:56",category:"Premium",emoji:"💎"},{title:"Inner Temple",duration:"29:46",category:"Premium",emoji:"🔮"},{title:"Gratitude Practice",duration:"29:56",category:"Premium",emoji:"👑"}]},osho:{title:"Upcoming OSHO Sessions",cycleSec:5400,openSec:600,sessions:[{title:"OSHO Dynamic Meditation",duration:"77:00",category:"Energy",emoji:"🔥"},{title:"OSHO Kundalini Meditation",duration:"77:00",category:"Movement",emoji:"💃"},{title:"OSHO Nadabrahma Meditation",duration:"77:00",category:"Humming",emoji:"🕉️"},{title:"OSHO Nataraj Meditation",duration:"77:00",category:"Dance",emoji:"🎭"},{title:"OSHO Whirling Meditation",duration:"77:00",category:"Spinning",emoji:"🌀"}]}}[e];if(!i)return;const n=Date.now(),o=i.cycleSec*1e3,r=i.openSec*1e3,l=Math.floor(n/o),d=p=>new Date(p).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),c=Array.from({length:6},(p,m)=>{const g=(l+m)%i.sessions.length,y=i.sessions[g],b=(l+m)*o,S=b+r,k=n-b,C=m===0&&k>=0&&k<r,P=m===0&&k>=r,N=C?'<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>':P?'<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>':"";return`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;margin-bottom:8px;${C?"background:var(--neuro-accent);color:white;":"background:var(--neuro-bg);"}
                    box-shadow:4px 4px 10px var(--neuro-shadow-dark),-4px -4px 10px var(--neuro-shadow-light);">
          <div style="display:flex;align-items:center;gap:12px;flex:1;">
            <span style="font-size:24px;">${y.emoji}</span>
            <div>
              <div style="font-weight:600;font-size:14px;">${y.title}${N}</div>
              <div style="font-size:11px;opacity:0.7;">${[y.category,y.duration].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
          <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
            <div style="font-weight:600;">${d(b)}</div>
            <div style="opacity:0.6;">closes ${d(S)}</div>
          </div>
        </div>`}).join("");(h=document.getElementById("meditationScheduleModal"))==null||h.remove();const u=document.createElement("div");u.id="meditationScheduleModal",u.style.cssText=`
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      padding:1rem;
    `,u.innerHTML=`
      <div style="background:var(--neuro-bg);border-radius:16px;padding:1.5rem;max-width:520px;width:100%;
                  max-height:80vh;overflow-y:auto;
                  box-shadow:12px 12px 24px var(--neuro-shadow-dark),-12px -12px 24px var(--neuro-shadow-light);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="margin:0;font-size:1.1rem;color:var(--neuro-text);">${i.title}</h2>
          <button onclick="document.getElementById('meditationScheduleModal')?.remove()"
                  style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--neuro-text-light);line-height:1;">×</button>
        </div>
        <div>${c}</div>
      </div>
    `,u.addEventListener("click",p=>{p.target===u&&u.remove()}),document.body.appendChild(u)}buildMeditationCTA(){const e=(o,r)=>{const l=Date.now(),d=o*1e3,c=r*1e3,u=l%d;if(u<c)return null;const h=d-u,p=Math.floor(h/6e4),m=Math.floor(h%6e4/1e3);return`Opens in ${p}:${String(m).padStart(2,"0")}`},t=e(3600,900),i=e(5400,600),n=`
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 999px;
      border: none;
      background: var(--neuro-bg);
      color: var(--neuro-text-light);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: not-allowed;
      opacity: 0.55;
      box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
    `;return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Meditate Together with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Practice in real time with others. Choose silence, guided visualization, or active OSHO techniques -
          all in shared, live spaces.
        </p>
        <div class="meditation-cta-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem;">

          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>

          <button
            onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'silent'; window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            Silent Meditation
          </button>

          ${t?`
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${n}" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Guided - ${t}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('guided')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `:`
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button
              onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'guided'; window.app.nav.switchTab('community-hub')"
              class="btn btn-primary"
              style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Guided Visualizations
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('guided')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `}

          ${i?`
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button type="button" disabled style="${n}" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22V12"/><path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M9 22v-4l3-2 3 2v4"/><path d="M7 15l5-3 5 3"/></svg>
              OSHO Active - ${i}
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('osho')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `:`
          <div style="display:flex;flex-direction:column;gap:0.35rem;">
            <button
              onclick="document.activeElement?.blur(); window._pendingRoomOpen = 'osho'; window.app.nav.switchTab('community-hub')"
              class="btn btn-primary"
              style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;white-space:nowrap;"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22V12"/><path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/><path d="M9 22v-4l3-2 3 2v4"/><path d="M7 15l5-3 5 3"/></svg>
              OSHO Active Meditations
            </button>
            <button type="button" onclick="event.stopPropagation(); window.featuresManager.engines.meditations.showMeditationSchedule('osho')"
              style="background:none;border:none;padding:0;font-size:11px;color:var(--neuro-text-light);cursor:pointer;text-decoration:underline;text-align:center;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              View Schedule
            </button>
          </div>
          `}

        </div>
      </div>
    `}render(){const e=document.getElementById("meditations-tab");e.innerHTML=`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavMeditations.webp');
                         --header-title:'';
                         --header-tag:'Aanandoham\\'s curated, unique collection of guided meditations'">
            <h1>Guided Meditations</h1>
            <h3>Aanandoham's curated, unique collection of guided meditations</h3>
            <span class="header-sub"></span>
          </header>

          <div class="text-center" style="margin-bottom: 2rem;">
            <button onclick="window.featuresManager.engines.meditations.openPDFGuide()" 
                    class="btn btn-primary" 
                    style="padding: 12px 32px; display: inline-flex; align-items: center; gap: 8px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              A Demo from the 'Art of Meditation' Workbook - Free For you (PDF)
            </button>
          </div>

          <div class="card dashboard-wellness-toolkit" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header">
              <h3 class="dashboard-wellness-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg> Wellness Toolkit</h3>
              <p class="dashboard-wellness-subtitle">Quick access to your daily reset practices</p>
            </div>
            <div class="wellness-buttons-grid">
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openSelfReset()" aria-label="Open 60-Second Self Reset">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Self Reset</h4>
                  <p class="wellness-tool-description">Short Breathing practice</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openFullBodyScan()" aria-label="Full Body Scan">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Full Body Scan</h4>
                  <p class="wellness-tool-description">Progressive relaxation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openNervousReset()" aria-label="Nervous System Reset">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Nervous System</h4>
                  <p class="wellness-tool-description">Balance & regulation</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
              <button class="wellness-tool-btn wellness-tool-active" onclick="window.openTensionSweep()" aria-label="Tension Sweep">
                <div class="wellness-tool-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20"/><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12"/><circle cx="12" cy="12" r="2"/></svg></div>
                <div class="wellness-tool-content">
                  <h4 class="wellness-tool-name">Tension Sweep</h4>
                  <p class="wellness-tool-description">Release stored tension</p>
                  <div class="wellness-tool-stats">
                    <span class="wellness-stat-xp">+10 XP</span>
                    <span class="wellness-stat-karma">+1 Karma</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

          ${this.buildMeditationCTA()}

          <div class="card" style="margin-bottom: 2rem;">
            <div class="dashboard-wellness-header" style="margin-bottom:1.5rem;">
              <h3 class="dashboard-wellness-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg> Guided Meditations</h3>
              <p class="dashboard-wellness-subtitle">Aanandoham's private, curated, unique collection</p>
            </div>

            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1.5rem;">
              ${this.renderMeditationCards()}
            </div>
          </div>

          ${this.renderPlayer()}

        </div>
      </div>

      ${this.renderStyles()}
    `,this.attachEventListeners()}renderMeditationCards(){return this.meditations.map(e=>{var o,r,l,d,c,u,h;const t=e.premium,i=((r=(o=this.app.state)==null?void 0:o.currentUser)==null?void 0:r.isAdmin)||((d=(l=this.app.state)==null?void 0:l.currentUser)==null?void 0:d.isVip),n=t&&!i&&!((h=(u=(c=this.app.gamification)==null?void 0:c.state)==null?void 0:u.unlockedFeatures)!=null&&h.includes("advanced_meditations"));return`
        <div class="meditation-card ${n?"locked":""}" 
             title="${n?"Purchase Advanced Meditations in Karma Shop to unlock":""}">
          ${t?'<span class="premium-badge">PREMIUM</span>':""}
          ${n?'<div class="lock-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':""}
          
          <div class="meditation-header">
            <span class="meditation-emoji">${e.emoji}</span>
            <span class="meditation-duration">${e.duration}</span>
          </div>
          
          <h4 class="meditation-title">${e.title}</h4>
          <p class="meditation-description">${e.description}</p>

          <div class="meditation-actions">
            <button class="btn btn-secondary flex-1" onclick="window.featuresManager.engines.meditations.playAudio(${e.id})" style="display:inline-flex;align-items:center;justify-content:center;gap:0.4rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
              Audio
            </button>
            <button class="btn btn-primary flex-1" onclick="window.featuresManager.engines.meditations.playVideo(${e.id})">
              ▶️ Video
            </button>
          </div>
        </div>
      `}).join("")}renderPlayer(){return`
      <div id="meditation-player-wrapper" class="player-wrapper">
        <div id="meditation-audio-player" class="compact-player hidden">
          <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="player-close-btn">✕</button>
          
          <div id="video-pane" class="video-pane hidden">
            <div id="yt-player-container"></div>
          </div>
          
          <div class="player-info">
            <div id="player-emoji" class="player-emoji"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg></div>
            <div class="player-text">
              <h4 id="player-title" class="font-bold">No Meditation Selected</h4>
              <p id="player-time" class="text-sm">0:00 / 0:00</p>
            </div>
          </div>
          
          <div class="player-controls">
            <button onclick="window.featuresManager.engines.meditations.skipBackward()" class="icon-btn" aria-label="Skip backward 10 seconds">⏪</button>
            <div class="play-pause-wrapper">
              <svg class="progress-ring" width="60" height="60">
                <circle class="progress-ring-bg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
                <circle id="player-progress-ring" class="progress-ring-fg" stroke-width="4" fill="transparent" r="28" cx="30" cy="30" />
              </svg>
              <button onclick="window.featuresManager.engines.meditations.togglePlay()" id="play-pause-btn" class="btn btn-primary play-pause-btn">▶️</button>
              <button onclick="window.featuresManager.engines.meditations.stopMeditation()" class="stop-btn" title="Stop">⏹️</button>
            </div>
            <button onclick="window.featuresManager.engines.meditations.skipForward()" class="icon-btn" aria-label="Skip forward 10 seconds">⏩</button>
          </div>
        </div>
      </div>
    `}renderStyles(){return`
      <style>
        @media (max-width: 600px) {
          .meditation-cta-grid { grid-template-columns: 1fr !important; }
        }
        /* Meditation Cards */
        .meditation-card {
          flex: 0 1 320px;
          max-width: 320px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 1.5rem;
          box-shadow: 8px 8px 16px var(--neuro-shadow-dark), -8px -8px 16px var(--neuro-shadow-light);
          position: relative;
          transition: transform 0.2s;
        }
        .meditation-card.locked { opacity: 0.75; }
        .premium-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .lock-icon {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 3rem;
          opacity: 0.3;
          z-index: 1;
        }
        .meditation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .meditation-emoji { font-size: 2rem; }
        .meditation-duration {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
        }
        .meditation-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--neuro-text);
          margin-bottom: 0.5rem;
        }
        .meditation-description {
          font-size: 0.875rem;
          color: var(--neuro-text-light);
          margin-bottom: 0.75rem;
        }
        .meditation-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        /* Player Wrapper - Fixed positioning */
        .player-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          transition: none;
        }
        .compact-player {
          width: 380px;
          min-width: 380px;
          background: var(--neuro-bg);
          border-radius: var(--radius-2xl);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-shadow: 20px 20px 40px var(--neuro-shadow-dark), -20px -20px 40px var(--neuro-shadow-light);
          user-select: none;
          position: relative;
          transition: opacity 0.3s, transform 0.3s;
        }
        .compact-player.hidden {
          transform: translateY(100px);
          opacity: 0;
          pointer-events: none;
        }
        .compact-player.video-mode {
          max-width: none;
          padding: 12px;
        }
        .player-close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 30px;
          height: 30px;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--neuro-text-light);
          font-size: 1.2rem;
          z-index: 10;
        }
        
        /* Player Info - Draggable header */
        .player-info {
          cursor: grab;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .player-info:active { cursor: grabbing; }
        .player-emoji {
          width: 50px;
          height: 50px;
          flex-shrink: 0;
          background: var(--neuro-bg);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .player-text #player-title {
          color: var(--neuro-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .player-text #player-time { color: var(--neuro-text-light); }
        
        /* Player Controls */
        .player-controls {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-shrink: 0;
        }
        .play-pause-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
        }
        .play-pause-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 0;
        }
        .play-pause-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        /* Progress Ring */
        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
        }
        .progress-ring-bg { stroke: var(--neuro-shadow-dark); }
        .progress-ring-fg {
          stroke: var(--neuro-accent);
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.1s linear;
        }
        .player-controls .icon-btn {
          width: 40px;
          height: 40px;
          padding: 0;
        }
        
        /* Video Pane */
        .video-pane {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 240px;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
          box-shadow: inset 4px 4px 8px var(--neuro-shadow-dark), inset -4px -4px 8px var(--neuro-shadow-light);
        }
        .video-pane #yt-player-container,
        .video-pane #yt-player-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .video-pane.hidden { display: none; }
        
        /* Stop Button */
        .stop-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateX(34px);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: var(--neuro-bg);
          box-shadow: 2px 2px 6px var(--neuro-shadow-dark), -2px -2px 6px var(--neuro-shadow-light);
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--neuro-text);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        .stop-btn:active {
          box-shadow: inset 2px 2px 4px var(--neuro-shadow-dark), inset -2px -2px 4px var(--neuro-shadow-light);
        }
      </style>
    `}attachEventListeners(){}playAudio(e){var n,o,r,l,d,c,u;const t=this.meditations.find(h=>h.id===e);if(!t)return;const i=((o=(n=this.app.state)==null?void 0:n.currentUser)==null?void 0:o.isAdmin)||((l=(r=this.app.state)==null?void 0:r.currentUser)==null?void 0:l.isVip);if(t.premium&&!i&&!((u=(c=(d=this.app.gamification)==null?void 0:d.state)==null?void 0:c.unlockedFeatures)!=null&&u.includes("advanced_meditations"))){this.app.showToast("Unlock Advanced Meditations in the Karma Shop!","info");return}this._play(t,!1)}playVideo(e){var n,o,r,l,d,c,u;const t=this.meditations.find(h=>h.id===e);if(!t)return;const i=((o=(n=this.app.state)==null?void 0:n.currentUser)==null?void 0:o.isAdmin)||((l=(r=this.app.state)==null?void 0:r.currentUser)==null?void 0:l.isVip);if(t.premium&&!i&&!((u=(c=(d=this.app.gamification)==null?void 0:d.state)==null?void 0:c.unlockedFeatures)!=null&&u.includes("advanced_meditations"))){this.app.showToast("Unlock Advanced Meditations in the Karma Shop!","info");return}this._play(t,!0)}_play(e,t){try{if(this.currentMeditation=e,this.sessionStartTime=Date.now(),this.ytPlayer&&!document.getElementById("yt-player-container")){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const i=document.getElementById("meditation-audio-player");document.getElementById("player-emoji").innerHTML=e.emoji,document.getElementById("player-title").textContent=e.title,i.classList.remove("hidden"),e.embedUrl&&this._startYouTubePlayer(e,t)}catch(i){console.error("Error starting meditation:",i),this.app.showToast("Error starting meditation","error")}}_startYouTubePlayer(e,t){if(!window.ytReady||!window.YT||!window.YT.Player){this.app.showToast("Initializing player… please tap again.","info");const i=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{window.ytReady=!0,typeof i=="function"&&i(),this._startYouTubePlayer(e,t)};return}try{const i=e.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1],n=window.location.origin&&window.location.origin!=="null"?window.location.origin:void 0;if(t?this._showVideoPane():this._hideVideoPane(),document.getElementById("play-pause-btn").disabled=!0,!this.ytPlayer||typeof this.ytPlayer.playVideo!="function"){if(this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const o={enablejsapi:1,rel:0,playsinline:1};n&&(o.origin=n),this.ytPlayer=new YT.Player("yt-player-container",{videoId:i,playerVars:o,events:{onReady:()=>{document.getElementById("play-pause-btn").disabled=!1,this.ytPlayer.playVideo(),this.app.showToast(t?"Playing – tap pause to stop":"Audio playing","success")},onStateChange:r=>this._handleYouTubeStateChange(r),onError:r=>{console.error("YouTube player error:",r),this.app.showToast("Video error – check connection or video availability","error")}}})}else this.ytPlayer.loadVideoById(i);this._startProgressUpdates()}catch(i){console.error("Error initializing YouTube player:",i),this.app.showToast("Error loading video","error")}}_handleYouTubeStateChange(e){const t=window.featuresManager.engines.meditations;e.data===YT.PlayerState.ENDED&&t.currentMeditation&&t.onMeditationComplete(),e.data===YT.PlayerState.PLAYING&&(t.isPlaying=!0,document.getElementById("play-pause-btn").textContent="⏸️"),e.data===YT.PlayerState.PAUSED&&(t.isPlaying=!1,document.getElementById("play-pause-btn").textContent="▶️")}_startProgressUpdates(){this.progressInterval&&clearInterval(this.progressInterval),this.progressInterval=setInterval(()=>{this.isPlaying&&this.updateProgress()},this.PROGRESS_UPDATE_MS)}_showVideoPane(){document.getElementById("video-pane").classList.remove("hidden"),document.getElementById("meditation-audio-player").classList.add("video-mode"),this.initDrag()}_hideVideoPane(){document.getElementById("video-pane").classList.add("hidden"),document.getElementById("meditation-audio-player").classList.remove("video-mode")}initDrag(){const e=document.querySelector(".player-info"),t=document.getElementById("meditation-player-wrapper");if(!e||!t)return;let i,n,o,r;const l=u=>{i=u.touches?u.touches[0].clientX:u.clientX,n=u.touches?u.touches[0].clientY:u.clientY;const h=t.getBoundingClientRect();o=i-h.left,r=n-h.top,document.addEventListener("mousemove",d),document.addEventListener("mouseup",c),document.addEventListener("touchmove",d,{passive:!1}),document.addEventListener("touchend",c,{passive:!0}),u.preventDefault()},d=u=>{const h=(u.touches?u.touches[0].clientX:u.clientX)-o,p=(u.touches?u.touches[0].clientY:u.clientY)-r;t.style.left=h+"px",t.style.top=p+"px",t.style.bottom="auto",t.style.right="auto"},c=()=>{document.removeEventListener("mousemove",d),document.removeEventListener("mouseup",c),document.removeEventListener("touchmove",d),document.removeEventListener("touchend",c)};e.addEventListener("mousedown",l),e.addEventListener("touchstart",l,{passive:!1}),this.eventCleanup.push(()=>{e.removeEventListener("mousedown",l),e.removeEventListener("touchstart",l)})}togglePlay(){if(this.currentMeditation&&this.ytPlayer&&typeof this.ytPlayer.playVideo=="function")try{this.isPlaying?this.ytPlayer.pauseVideo():this.ytPlayer.playVideo()}catch(e){console.error("Error toggling playback:",e),this.app.showToast("Player not ready","info")}}stopMeditation(){try{if(this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null,this.progressInterval&&(clearInterval(this.progressInterval),this.progressInterval=null),this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const e=document.getElementById("yt-player-container");e&&(e.innerHTML="");const t=document.getElementById("play-pause-btn");t&&(t.textContent="▶️");const i=document.getElementById("meditation-audio-player");i&&i.classList.add("hidden"),this._hideVideoPane()}catch(e){console.error("Error stopping meditation:",e)}}skipForward(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=this.ytPlayer.getDuration()||0,i=Math.min(e+this.SKIP_SECONDS,t);this.ytPlayer.seekTo(i,!0)}catch(e){console.error("Error skipping forward:",e)}}skipBackward(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=Math.max(e-this.SKIP_SECONDS,0);this.ytPlayer.seekTo(t,!0)}catch(e){console.error("Error skipping backward:",e)}}updateProgress(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=this.ytPlayer.getDuration()||0;t>0&&(document.getElementById("player-time").textContent=`${this.formatTime(e)} / ${this.formatTime(t)}`,this.updateRing(e,t))}catch(e){console.error("Error updating progress:",e)}}updateRing(e,t){const i=document.getElementById("player-progress-ring");if(!(!i||!t||t===0))try{const n=i.r.baseVal.value,o=2*Math.PI*n;i.style.strokeDasharray=`${o} ${o}`;const r=e/t,l=o-r*o;i.style.strokeDashoffset=isNaN(l)?o:l}catch(n){console.error("Error updating ring:",n)}}onMeditationComplete(){try{if(this.isPlaying=!1,document.getElementById("play-pause-btn").textContent="▶️",this.app.showToast("Meditation complete! Well done.","success"),!this.currentMeditation)return;const e=this.ytPlayer?Math.floor((this.ytPlayer.getDuration()||0)/60):0,t=Math.max(e,1),i=this.getChakraFromMeditation(this.currentMeditation.category),n={type:this.currentMeditation.type||"guided",meditationId:this.currentMeditation.id,title:this.currentMeditation.title,category:this.currentMeditation.category,duration:t,chakra:i,timestamp:new Date().toISOString(),sessionStartTime:this.sessionStartTime,completedAt:Date.now()};this.app.state&&this.app.state.addEntry("meditation",n),this.checkAchievements(),this.sessionStartTime=null}catch(e){console.error("Error completing meditation:",e)}}checkAchievements(){var e,t;try{const i=(((t=(e=this.app.state)==null?void 0:e.data)==null?void 0:t.meditationHistory)||[]).length,n=this.app.gamification;if(!n)return;const o=n.getBadgeDefinitions();i>=1&&n.checkAndGrantBadge("first_meditation",o),i>=20&&n.checkAndGrantBadge("meditation_devotee",o),i>=60&&n.checkAndGrantBadge("meditation_master",o),i>=100&&n.checkAndGrantBadge("meditation_100",o),i>=200&&n.checkAndGrantBadge("meditation_200",o)}catch(i){console.error("Error checking achievements:",i)}}getChakraFromMeditation(e){return{Grounding:"root",Energy:"sacral",Chakras:"heart",Spiritual:"crown",Healing:"heart",Manifestation:"solar",Premium:"crown"}[e]||null}formatTime(e){if(!e||isNaN(e)||e<0)return"0:00";const t=Math.floor(e/60),i=Math.floor(e%60);return`${t}:${i.toString().padStart(2,"0")}`}openPDFGuide(){this.pdfGuideUrl&&this.pdfGuideUrl!=="YOUR_PDF_URL_HERE"?window.open(this.pdfGuideUrl,"_blank"):this.app.showToast("PDF Guide is not yet available.","info")}destroy(){this.cleanup()}cleanup(){try{if(this.progressInterval&&(clearInterval(this.progressInterval),this.progressInterval=null),this.eventCleanup.forEach(t=>t()),this.eventCleanup=[],this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const e=document.getElementById("yt-player-container");e&&(e.innerHTML=""),this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null}catch(e){console.error("Error during cleanup:",e)}}}typeof window<"u"&&(window.MeditationsEngine=ze);const dt={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},ct={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},ut={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Illusion and fantasy. Ground dreams in reality.",8:"Walking away from the familiar. Seeking deeper meaning.",9:"Emotional fulfillment. Wishes granted, contentment realized.",10:"Lasting happiness and family harmony. Emotional abundance overflows."},wands:{1:"Creative spark and new inspiration. Bold initiative ignites passion.",2:"Future planning and decisions. Vision meets preparation.",3:"Expansion and foresight. Progress through strategic action.",4:"Celebration and homecoming. Stability through joyful foundation.",5:"Competition and conflict. Growth through challenge.",6:"Victory and recognition. Success earned through perseverance.",7:"Standing your ground. Defending your position with courage.",8:"Swift action and momentum. Things move quickly now.",9:"Resilience and persistence. Nearly there-don't give up.",10:"Burden of responsibility. Carrying weight that may not be yours."}},ht={pentacles:{Page:"Student of the material world. Eager to learn practical skills and build security.",Knight:"Methodical and reliable. Steady progress toward tangible goals.",Queen:"Nurturer of resources. Abundant, practical, and grounded in care.",King:"Master of the material realm. Wealthy in wisdom and resources."},swords:{Page:"Curious mind seeking truth. Quick wit but inexperienced with consequences.",Knight:"Driven by ideals and logic. Charging forward with mental clarity.",Queen:"Sharp intellect with experience. Clear boundaries and honest communication.",King:"Authority through wisdom. Just, logical, and fair in judgment."},cups:{Page:"Emotionally open and intuitive. Beginning to understand feelings and dreams.",Knight:"Romantic and idealistic. Following the heart with passion.",Queen:"Emotionally mature and compassionate. Deeply intuitive and nurturing.",King:"Emotional mastery and diplomacy. Calm waters and balanced heart."},wands:{Page:"Enthusiastic explorer. New creative ventures and bold messages.",Knight:"Adventurous and impulsive. Chasing passion with fiery energy.",Queen:"Confident and charismatic. Inspiring others through authentic presence.",King:"Visionary leader. Turning inspiration into lasting impact."}},Le={11:"Page",12:"Knight",13:"Queen",14:"King"},Ne={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},We={FLIP_DURATION:900,SCROLL_DELAY:100};class Ye{constructor(e){this.app=e,this.TAROT_BASE_URL="/Tarot Cards images/",this.CARD_BACK_URL="/Tarot Cards images/CardBacks.webp",this.spreads={single:{name:"A Single Card Oracle Spread",cards:1,desc:"A Single Card Clarification",positions:["A Single Card"]},three:{name:"A 3 Cards Quick Spread",cards:3,desc:"Past • Present • Future",positions:["Past","Present","Future"]},six:{name:"A 6 Cards Insight Spread",cards:6,desc:"Situational Analysis",positions:["Situation","Challenge","Past Influence","Future Influence","Your Power","Outcome"]},options:{name:"The Options Spread",cards:9,desc:"Evaluate your different Options",positions:["Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)","Past (Subconscious)","Present (Conscious)","Future (Unconscious)"]},pyramid:{name:"The Pyramid Spread",cards:9,desc:"Triangle of Past – Present – Future",positions:["Where you came from","Where you came from","Where you came from","Where you are now","Where you are now","Where you are now","Where are you going","Where are you going","Where are you going"]},cross:{name:"The Simple Cross Spread",cards:5,desc:"A Simple Cross Snapshot of Now",positions:["Direction of the Situation","The Root of the Situation","Summary","Positive side of Situation","Obstacles-Challenges"]}},this.selectedSpread="single",this.shuffledDeck=[],this.flippedCards=new Set,this.currentReading=[],this.cleanup=null,this.cachedElements={},this.prepareReading()}getTarotCardName(e,t="major"){return t==="major"?dt[e]||"The Fool":e<=10?`${e} of ${Ne[t]}`:`${Le[e]} of ${Ne[t]}`}getTarotCardImage(e,t="major"){if(t==="major"){const o=String(e).padStart(2,"0"),r=this.getTarotCardName(e,"major").replace(/\s+/g,"");return`${this.TAROT_BASE_URL}${o}-${r}.webp`}const i=t.charAt(0).toUpperCase()+t.slice(1),n=String(e).padStart(2,"0");return`${this.TAROT_BASE_URL}${i}${n}.webp`}getTarotCardMeaning(e,t="major"){var n,o;if(t==="major")return ct[e]||"New beginnings and infinite possibility await you.";if(e<=10)return((n=ut[t])==null?void 0:n[e])||"This card brings its unique energy to your reading.";const i=Le[e];return((o=ht[t])==null?void 0:o[i])||"This court card represents a person or energy in your life."}buildFullDeck(){const e=["pentacles","swords","cups","wands"];return[...Array.from({length:22},(t,i)=>({type:"major",number:i,suit:"major"})),...e.flatMap(t=>Array.from({length:14},(i,n)=>({type:n<10?"minor":"court",number:n+1,suit:t})))]}shuffleDeck(e){const t=[...e];for(let i=t.length-1;i>0;i--){const n=Math.floor(Math.random()*(i+1));[t[i],t[n]]=[t[n],t[i]]}return t}prepareReading(){const e=this.buildFullDeck();this.shuffledDeck=this.shuffleDeck(e),this.flippedCards.clear(),this.currentReading=[],this.cachedElements={}}flipCard(e){if(this.flippedCards.has(e)||!this.shuffledDeck.length)return;const t=this.cachedElements.pyramid||(this.cachedElements.pyramid=document.querySelector(".pyramid-triangle"));t&&requestAnimationFrame(()=>{t.style.minHeight=`${t.offsetHeight}px`,t.classList.add("flipping"),setTimeout(()=>{t.classList.remove("flipping"),t.style.minHeight=""},We.FLIP_DURATION)}),this.flippedCards.add(e);const i=this.shuffledDeck.pop(),n={name:this.getTarotCardName(i.number,i.suit),meaning:this.getTarotCardMeaning(i.number,i.suit),imageUrl:this.getTarotCardImage(i.number,i.suit),cardData:i};this.currentReading.push(n);const o=document.getElementById(`tarot-card-container-${e}`),r=o==null?void 0:o.querySelector(".tarot-card-front"),l=document.getElementById(`tarot-card-details-${e}`);if(!o||!r||!l){console.error(`[TarotEngine] Failed to find card elements for index ${e}`);return}r.innerHTML=`<img src="${n.imageUrl}" alt="${n.name}" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class='tarot-card-error'>🃏</div>'">`,l.innerHTML=`<h4 class="font-bold mt-4 mb-2" style="color: var(--neuro-text);">${n.name}</h4><p style="color: var(--neuro-text-light);" class="text-sm leading-relaxed">${n.meaning}</p>`,l.style.opacity="1",l.style.transition="opacity 0.5s ease 0.5s",o.classList.add("flipped"),this.checkSpreadCompletion()}checkSpreadCompletion(){this.flippedCards.size===this.spreads[this.selectedSpread].cards&&this.completeTarotSpread()}completeTarotSpread(){const e=this.spreads[this.selectedSpread].name;if(!["single","three"].includes(this.selectedSpread)){if(this.app.state){const i={spreadType:e,spreadKey:this.selectedSpread,cards:this.currentReading.map(n=>({name:n.name,meaning:n.meaning})),timestamp:new Date().toISOString(),date:new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})};this.app.state.addEntry("tarot",i)}this.app.gamification&&this.app.gamification.incrementTarotSpreads(),this.checkAchievements()}}checkAchievements(){var i,n;const e=((n=(i=this.app.gamification)==null?void 0:i.state)==null?void 0:n.totalTarotSpreads)||0,t=this.app.gamification;t&&(e>=1&&t.checkAndGrantBadge("first_tarot",t.getBadgeDefinitions()),e>=10&&t.checkAndGrantBadge("tarot_apprentice",t.getBadgeDefinitions()),e>=25&&t.checkAndGrantBadge("tarot_mystic",t.getBadgeDefinitions()),e>=75&&t.checkAndGrantBadge("tarot_oracle",t.getBadgeDefinitions()),e>=150&&t.checkAndGrantBadge("tarot_150",t.getBadgeDefinitions()),e>=400&&t.checkAndGrantBadge("tarot_400",t.getBadgeDefinitions()))}buildTarotCTA(){return`
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
    `}render(){this.cleanup&&this.cleanup();const e=document.getElementById("tarot-tab");if(!e){console.error("[TarotEngine] tarot-tab element not found");return}const t=this.spreads[this.selectedSpread],i=["options","pyramid","cross"];let n="";if(i.includes(this.selectedSpread))n=this.renderCustomSpread(this.selectedSpread);else{const o=t.cards;let r="md:grid-cols-1";(o===3||o===6)&&(r="tarot-3col-grid");const l=o===1;n=`<div class="grid ${r}${l?"":" place-items-center"}${l?" tarot-single-grid":""}">${Array.from({length:o}).map((c,u)=>this.cardMarkup(u,t.positions[u],l)).join("")}</div>`}e.innerHTML=`
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
            ${Object.entries(this.spreads).map(([o,r])=>{var u,h,p,m,g,y,b;const l=["options","pyramid","cross"].includes(o),d=((h=(u=this.app.state)==null?void 0:u.currentUser)==null?void 0:h.isAdmin)||((m=(p=this.app.state)==null?void 0:p.currentUser)==null?void 0:m.isVip),c=l&&!d&&!((b=(y=(g=this.app.gamification)==null?void 0:g.state)==null?void 0:y.unlockedFeatures)!=null&&b.includes("advance_tarot_spreads"));return`
              <div onclick="window.featuresManager.engines.tarot.selectSpread('${o}')"
                   class="card cursor-pointer relative ${this.selectedSpread===o?"border-4":""} ${c?"opacity-75":""}"
                   style="${this.selectedSpread===o?"border-color: var(--neuro-accent);":""} padding: 1.5rem;"
                   title="${c?"Purchase Advanced Tarot Spreads in Karma Shop to unlock":""}">
                ${l?'<span class="premium-badge-tr">PREMIUM</span>':""}
                ${c?'<div style="position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); font-size: 3rem; opacity: 0.3;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>':""}
                <h4 class="text-xl font-bold" style="color: var(--neuro-text);margin-bottom: 0.5rem;">${r.name}</h4>
                <p style="color: var(--neuro-text-light);" class="text-sm">${r.desc}</p>
              </div>`}).join("")}
          </div>

          <div style="margin-bottom: 3rem; padding: 0 1.5rem;">
            ${(()=>{var d,c,u,h,p,m,g,y,b,S;const l=!(((u=(c=(d=this.app)==null?void 0:d.state)==null?void 0:c.currentUser)==null?void 0:u.isAdmin)||((m=(p=(h=this.app)==null?void 0:h.state)==null?void 0:p.currentUser)==null?void 0:m.isVip)||((S=(b=(y=(g=this.app)==null?void 0:g.gamification)==null?void 0:y.state)==null?void 0:b.unlockedFeatures)==null?void 0:S.includes("tarot_vision_ai")));return`
                <button id="tarot-vision-ai-btn"
                        class="btn ${l?"opacity-50 cursor-not-allowed":"hover:scale-[1.02]"}"
                        style="position:relative;display:flex !important;align-items:center;gap:1.25rem;
                               width:100%;padding:1.25rem 1.5rem;text-align:left;border-radius:0.75rem;
                               min-height:5rem;box-sizing:border-box;">
                  <span class="premium-badge" style="position:absolute;top:0.6rem;right:0.6rem;margin:0;z-index:1;">PREMIUM</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:3rem;height:3rem;flex-shrink:0;"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12s1.5-3 5-3 5 3 5 3-1.5 3-5 3-5-3-5-3Z"/><circle cx="12" cy="12" r="1"/></svg>
                  <span style="display:flex;flex-direction:column;gap:0.2rem;flex:1;min-width:0;padding-right:${l?"3rem":"4rem"};">
                    <span style="font-size:1.2rem;font-weight:700;line-height:1.2;white-space:nowrap;">Tarot Vision AI</span>
                    <span style="font-size:0.9rem;font-weight:400;opacity:0.85;line-height:1.3;white-space:normal;">Take a picture or upload a tarot card to analyse it</span>
                  </span>
                  ${l?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.75rem;height:1.75rem;opacity:0.45;flex-shrink:0;margin-left:auto;"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':""}
                </button>`})()}
          </div>

          ${this.buildTarotCTA()}

          <div class="card" id="tarot-cards-result" style="padding: 2rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 5rem;">
              <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">${t.name}</h3>
            </div>
            ${n}
          </div>

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
    `,this.init()}cardMarkup(e,t,i=!1){const n=i?"width:100%;":"width: clamp(140px, 24vw, 250px);",o=i?"clamp(80px, 16vw, 120px)":"clamp(60px, 12vw, 100px)";return`
      <div class="flex flex-col items-center mx-auto" style="${n}">
        <h4 class="text-lg font-bold h-8" style="color: var(--neuro-accent); margin-bottom: 0rem;">${t}</h4>
        <div class="tarot-card-flip-container" id="tarot-card-container-${e}" onclick="window.featuresManager.engines.tarot.flipCard(${e})">
          <div class="tarot-card-flip-inner">
            <div class="tarot-card-back">
              <p class="card-reveal-prompt">Click to reveal</p>
              <img src="${this.CARD_BACK_URL}" alt="Card Back" class="tarot-card-image" loading="lazy" decoding="async" width="200" height="350">
            </div>
            <div class="tarot-card-front"></div>
          </div>
        </div>
        <div id="tarot-card-details-${e}" class="text-center" style="opacity: 0; height: ${o}; overflow-y: auto; margin-top: 0rem;"></div>
      </div>`}renderCustomSpread(e){const t=this.spreads[e].positions;if(e==="options")return`
        <div class="flex flex-col items-center" style="width:100%;">
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;margin-top: 2rem;">Option 1</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${t.slice(0,3).map((i,n)=>this.cardMarkup(n,i)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 2</h3>
          <div class="grid tarot-3col-grid place-items-center" style="margin-bottom: 1.5rem;width:100%;">
            ${t.slice(3,6).map((i,n)=>this.cardMarkup(n+3,i)).join("")}
          </div>
          <h3 class="text-2xl font-bold" style="margin-bottom: 1rem;">Option 3</h3>
          <div class="grid tarot-3col-grid place-items-center" style="width:100%;">
            ${t.slice(6,9).map((i,n)=>this.cardMarkup(n+6,i)).join("")}
          </div>
        </div>`;if(e==="pyramid")return`
        <div class="pyramid-triangle">
          <div class="pyr-row pyr-apex">${this.cardMarkup(8,t[8])}${this.cardMarkup(0,t[0])}</div>
          <div class="pyr-row pyr-upper">${this.cardMarkup(7,t[7])}${this.cardMarkup(1,t[1])}</div>
          <div class="pyr-row pyr-lower">${this.cardMarkup(6,t[6])}${this.cardMarkup(2,t[2])}</div>
          <div class="pyr-row pyr-base">${this.cardMarkup(5,t[5])}${this.cardMarkup(4,t[4])}${this.cardMarkup(3,t[3])}</div>
        </div>`;if(e==="cross")return`
        <div class="cross-shape">
          <div class="cross-top">${this.cardMarkup(3,t[3])}</div>
          <div class="cross-mid">${this.cardMarkup(0,t[0])}${this.cardMarkup(2,t[2])}${this.cardMarkup(1,t[1])}</div>
          <div class="cross-bot">${this.cardMarkup(4,t[4])}</div>
        </div>`}init(){setTimeout(()=>{const e=document.getElementById("tarot-vision-ai-btn");if(e){const t=()=>{var o,r,l,d,c,u,h,p,m,g,y,b,S,k;!(((l=(r=(o=this.app)==null?void 0:o.state)==null?void 0:r.currentUser)==null?void 0:l.isAdmin)||((u=(c=(d=this.app)==null?void 0:d.state)==null?void 0:c.currentUser)==null?void 0:u.isVip))&&!((g=(m=(p=(h=this.app)==null?void 0:h.gamification)==null?void 0:p.state)==null?void 0:m.unlockedFeatures)!=null&&g.includes("tarot_vision_ai"))?(b=(y=this.app)==null?void 0:y.showToast)==null||b.call(y,"Unlock Tarot Vision AI in the Karma Shop!","info"):(k=(S=this.app)==null?void 0:S.showToast)==null||k.call(S,"Tarot Vision AI opening...","info")};e.onclick=t,this.cleanup=()=>{e.onclick=null}}},0)}selectSpread(e){var n,o,r,l,d,c,u,h,p,m,g,y;const t=["options","pyramid","cross"];if(!(((r=(o=(n=this.app)==null?void 0:n.state)==null?void 0:o.currentUser)==null?void 0:r.isAdmin)||((c=(d=(l=this.app)==null?void 0:l.state)==null?void 0:d.currentUser)==null?void 0:c.isVip))&&t.includes(e)&&!((m=(p=(h=(u=this.app)==null?void 0:u.gamification)==null?void 0:h.state)==null?void 0:p.unlockedFeatures)!=null&&m.includes("advance_tarot_spreads"))){(y=(g=this.app)==null?void 0:g.showToast)==null||y.call(g,"Unlock Advanced Tarot Spreads in the Karma Shop!","info");return}this.selectedSpread=e,this.prepareReading(),this.render(),setTimeout(()=>{const b=document.querySelector("#tarot-cards-result");b&&b.scrollIntoView({behavior:"smooth",block:"start"})},We.SCROLL_DELAY)}reset(){this.selectSpread(this.selectedSpread)}}typeof window<"u"&&(window.TarotEngine=Ye);const de={general_positive_affirmations:[{text:"I am fully capable of creating the life I desire.",tags:[]},{text:"I choose peace over fear, clarity over confusion, and love over doubt.",tags:["love","peace","focus"]},{text:"My mind is focused, calm, and aligned with my highest truth.",tags:["peace"]},{text:"I am worthy of all good things that come my way.",tags:["self-worth"]},{text:"I trust the timing of my life and flow with it effortlessly.",tags:["trust"]},{text:"Every challenge I face strengthens my wisdom and resilience.",tags:[]},{text:"I radiate confidence, courage, and authenticity in all that I do.",tags:["confidence"]},{text:"I allow abundance to flow into my life with ease and grace.",tags:["abundance"]},{text:"My energy attracts people and opportunities that serve my growth.",tags:["energy"]},{text:"I forgive myself and release the past with compassion.",tags:["love","forgiveness"]},{text:"I am open to receiving love, success, and joy in infinite forms.",tags:["joy","love","abundance"]},{text:"I am grounded, present, and connected to the now.",tags:["focus"]},{text:"I honor my emotions as sacred messengers guiding me forward.",tags:[]},{text:"I am constantly evolving into the best version of myself.",tags:[]},{text:"My body is strong, healthy, and filled with vital energy.",tags:["confidence","energy"]},{text:"I am safe, supported, and guided by life itself.",tags:[]},{text:"I speak my truth with confidence, kindness, and clarity.",tags:["confidence","love","focus"]},{text:"I am a magnet for miracles, blessings, and divine synchronicity.",tags:[]},{text:"I release all resistance and allow my natural flow of wellbeing.",tags:["forgiveness"]},{text:"I am surrounded by love, light, and positive energy.",tags:["love","energy"]},{text:"I choose thoughts that uplift, inspire, and empower me.",tags:[]},{text:"I trust my intuition-it always leads me in the right direction.",tags:["trust","purpose"]},{text:"I am grateful for every experience that shapes my growth.",tags:[]},{text:"I am free from comparison and embrace my unique path.",tags:[]},{text:"My presence inspires peace, healing, and transformation in others.",tags:["peace"]},{text:"I am creative, resourceful, and capable of achieving anything I set my mind to.",tags:[]},{text:"I honor my boundaries and attract relationships that respect them.",tags:[]},{text:"I am in harmony with the universe and at peace with myself.",tags:["peace"]},{text:"I am love, I am light, I am whole.",tags:["love"]},{text:"I wake each day ready to create something beautiful and meaningful.",tags:[]},{text:"I am in alignment with life and everything unfolds for my highest good.",tags:[]},{text:"I am calm, confident, and centered no matter what happens around me.",tags:["peace"]},{text:"I am open to receiving love, abundance, and wisdom in all forms.",tags:["love","abundance"]},{text:"I trust myself completely and move forward with clarity and courage.",tags:["confidence","trust","focus"]},{text:"I am grateful for this moment and all that it teaches me.",tags:[]},{text:"I am a magnet for opportunities that support my purpose and joy.",tags:["joy","purpose"]},{text:"I release resistance and allow peace to flow through me.",tags:["forgiveness","peace"]},{text:"I radiate positive energy and attract people who uplift and inspire me.",tags:["energy"]},{text:"I choose to see challenges as stepping stones toward mastery.",tags:[]},{text:"I am grounded, balanced, and capable of handling anything life brings.",tags:[]},{text:"I deserve happiness, love, success, and inner peace.",tags:["joy","love","peace","abundance","self-worth"]},{text:"I am aligned with the flow of life and trust my path unfolds perfectly.",tags:["trust"]},{text:"Every challenge I face strengthens my character and deepens my wisdom.",tags:[]},{text:"I am worthy of love, success, and peace simply because I exist.",tags:["abundance","love","self-worth","peace"]},{text:"I create my reality through focused thought and inspired action.",tags:[]},{text:"I am open to receive abundance in all its forms.",tags:["abundance"]},{text:"I forgive myself and others easily, freeing space for joy to grow.",tags:["growth","joy","forgiveness"]},{text:"My energy attracts positive people, opportunities, and outcomes.",tags:["energy"]},{text:"I am at peace with my past and excited for my future.",tags:["peace"]},{text:"My mind is clear, my heart is open, and my spirit is strong.",tags:["confidence","love"]}],"loneliness_&_isolation":[{text:"I am connected to the world around me in deep and meaningful ways.",tags:[]},{text:"I allow love and friendship to flow freely into my life.",tags:["love"]},{text:"I enjoy my own company and find peace in solitude.",tags:["peace"]},{text:"Every day I am meeting people who resonate with my authentic self.",tags:[]},{text:"I am open to giving and receiving connection without fear.",tags:[]},{text:"My heart is open, and I attract genuine, supportive relationships.",tags:["love"]},{text:"I release the story that I am alone; I am part of something larger.",tags:["forgiveness"]},{text:"I am surrounded by people who care about me, even if unseen.",tags:[]},{text:"I belong here, and my presence makes a difference.",tags:[]},{text:"I am love, and love always finds its way back to me.",tags:["love"]}],"emptiness_&_numbness":[{text:"I allow myself to feel again, gently and safely.",tags:[]},{text:"My emotions are valid and welcome.",tags:[]},{text:"I reconnect with the beauty and wonder of being alive.",tags:[]},{text:"Every breath fills me with new energy and purpose.",tags:["energy","purpose"]},{text:"I am rediscovering joy in the small moments of life.",tags:["joy"]},{text:"My heart is waking up to passion and curiosity.",tags:["love"]},{text:"I trust that my inner light is returning stronger than before.",tags:["trust"]},{text:"I am not empty; I am creating space for something new.",tags:[]},{text:"I am reconnecting with what truly matters to me.",tags:[]},{text:"Life moves through me, and I allow it to be felt fully.",tags:[]}],"shame_&_guilt":[{text:"I release past mistakes and choose compassion for myself.",tags:["love","forgiveness"]},{text:"I am worthy regardless of what I have done or not done.",tags:["self-worth"]},{text:"I forgive myself and make wise, loving choices now.",tags:["forgiveness","love"]},{text:"My worth is inherent; it is not defined by my actions.",tags:["self-worth"]},{text:"I learn from regret and grow stronger every day.",tags:["growth"]},{text:"I let go of self-blame and welcome healing into my heart.",tags:["love","forgiveness","healing"]},{text:"I accept myself fully and move forward with integrity.",tags:[]},{text:"I replace shame with understanding and curiosity.",tags:[]},{text:"I embrace my imperfections as part of my humanity.",tags:[]},{text:"I am free to start anew; my past does not imprison me.",tags:[]}],"grief_&_loss":[{text:"I allow myself to grieve and honor what was lost.",tags:[]},{text:"Grief is love's reflection; I hold it gently and let it heal.",tags:["love","healing"]},{text:"I am supported as I move through change and loss.",tags:[]},{text:"Memories bring gratitude and peaceful acceptance.",tags:["joy","peace"]},{text:"I make space for sorrow and for new meaning to emerge.",tags:["purpose"]},{text:"My heart heals in its own time and I trust the process.",tags:["trust","love","healing"]},{text:"I carry the love forward and let go of what no longer serves.",tags:["love","forgiveness"]},{text:"I am present to my feelings without being consumed by them.",tags:["focus"]},{text:"Each day I find new ways to remember and to live fully.",tags:[]},{text:"Love remains; loss transforms my life into deeper wisdom.",tags:["love"]}],"anger_&_resentment":[{text:"I acknowledge my anger and release it in healthy ways.",tags:["forgiveness"]},{text:"I choose clarity and calm over prolonged resentment.",tags:["peace","focus"]},{text:"Expressing my truth brings relief and restores my power.",tags:[]},{text:"I set boundaries to protect my peace and dignity.",tags:["peace"]},{text:"I forgive to free myself, not to condone harm.",tags:["forgiveness"]},{text:"Anger guides me to what needs to change; I act wisely.",tags:[]},{text:"I reclaim my energy by letting go of grudges and bitterness.",tags:["energy","forgiveness"]},{text:"I respond with strength and compassion, not with reactivity.",tags:["love"]},{text:"My heart opens as I choose understanding over contempt.",tags:["love"]},{text:"I am in control of my reactions and I choose peace.",tags:["peace"]}],perfectionism:[{text:"I release the need to be perfect; being real is enough.",tags:["self-worth","forgiveness"]},{text:"I celebrate progress, not perfection.",tags:[]},{text:"Mistakes are teachers guiding me toward wisdom.",tags:[]},{text:"I am free to be human, imperfect, and whole.",tags:[]},{text:"I allow myself to rest without guilt or pressure.",tags:["energy"]},{text:"I no longer measure my worth by achievements.",tags:["self-worth"]},{text:"I am learning and growing at my natural pace.",tags:["growth"]},{text:"I replace criticism with compassion for myself.",tags:["love"]},{text:"I am proud of how far I've come, even if I'm not there yet.",tags:[]},{text:"I choose authenticity over approval.",tags:[]}],"overthinking_&_indecision":[{text:"I trust my inner guidance to lead me wisely.",tags:["trust"]},{text:"I release the need to control every outcome.",tags:["forgiveness"]},{text:"Clarity comes when I relax and allow life to unfold.",tags:["focus","peace"]},{text:"I choose action over endless thought.",tags:[]},{text:"My intuition knows what my mind cannot see.",tags:[]},{text:"I let go of mental clutter and make space for peace.",tags:["forgiveness","peace"]},{text:"Every decision I make teaches me something valuable.",tags:[]},{text:"I am learning to trust myself more each day.",tags:["trust"]},{text:"I do not need all the answers to move forward.",tags:[]},{text:"Peace of mind is my natural state, and I return to it often.",tags:["peace"]}],"procrastination_&_self-sabotage":[{text:"I begin now, taking small consistent steps toward my goals.",tags:[]},{text:"My actions create momentum, and momentum creates results.",tags:[]},{text:"I release fear of failure and welcome growth through doing.",tags:["forgiveness","growth"]},{text:"I am disciplined, focused, and kind to myself in the process.",tags:["focus"]},{text:"Each completed task strengthens my confidence and clarity.",tags:["confidence","focus"]},{text:"I replace avoidance with curiosity and forward motion.",tags:[]},{text:"I honor my energy and schedule tasks that match my capacity.",tags:["energy"]},{text:"I forgive past inaction and recommit to steady progress.",tags:["forgiveness"]},{text:"I choose forward movement over perfection paralysis.",tags:[]},{text:"I am capable of finishing what I start with calm focus.",tags:["peace","focus"]}],"people-pleasing_&_approval_addiction":[{text:"I honor my needs and say no when it protects my wellbeing.",tags:[]},{text:"My worth does not depend on others' approval.",tags:["self-worth"]},{text:"I express my truth with kindness and without apology.",tags:["love"]},{text:"I choose integrity over pleasing; my voice matters.",tags:[]},{text:"Setting boundaries cultivates respect and authentic connection.",tags:[]},{text:"I receive feedback without losing my center or identity.",tags:[]},{text:"I trust myself to decide what is right for me.",tags:["trust"]},{text:"I do not need to prove my value through constant compliance.",tags:["self-worth"]},{text:"I am loved for who I am, not for how well I please others.",tags:["love"]},{text:"I choose authenticity over popularity and peace over approval.",tags:["peace"]}],imposter_syndrome:[{text:"I earned my place; my achievements are real and deserved.",tags:[]},{text:"I celebrate my skills and acknowledge my growth.",tags:["growth"]},{text:"I am competent, valuable, and worthy of success.",tags:["self-worth","abundance"]},{text:"Feeling uncertain does not negate my capability.",tags:[]},{text:"I welcome learning as a sign of strength, not flaw.",tags:[]},{text:"I accept praise graciously and internalize my wins.",tags:[]},{text:"I release doubts and stand in the truth of my experience.",tags:["forgiveness"]},{text:"I am qualified and prepared for the opportunities I receive.",tags:[]},{text:"My contribution matters; I bring unique value to the world.",tags:["self-worth"]},{text:"I am enough; I do not need to prove myself to deserve success.",tags:["self-worth","abundance"]}],disconnection_from_purpose:[{text:"My life has meaning, even when I can't see it clearly.",tags:["purpose"]},{text:"I am guided toward purpose one step at a time.",tags:["purpose"]},{text:"I trust that my experiences are shaping me for something greater.",tags:["trust"]},{text:"I am open to discovering new passions and callings.",tags:[]},{text:"My presence alone has value and purpose.",tags:["self-worth","purpose"]},{text:"I align my actions with what feels true to my heart.",tags:["love"]},{text:"I am exactly where I need to be on my journey.",tags:[]},{text:"I release pressure and allow my purpose to reveal itself.",tags:["forgiveness","purpose"]},{text:"I am living a meaningful life right now, in this moment.",tags:[]},{text:"My soul knows the way, and I follow with trust.",tags:["trust"]}],fear_of_death_or_the_unknown:[{text:"I release fear and embrace the mystery of life.",tags:["forgiveness"]},{text:"I trust that life continues beyond what I can see.",tags:["trust"]},{text:"Every breath reminds me that I am part of something eternal.",tags:[]},{text:"I accept impermanence as a natural rhythm of existence.",tags:[]},{text:"I find peace in the cycles of birth, growth, and transformation.",tags:["peace"]},{text:"I focus on living fully rather than fearing endings.",tags:["focus"]},{text:"I am grateful for each moment I am given.",tags:[]},{text:"I trust that my spirit is timeless and free.",tags:["trust"]},{text:"Death is not an end but a return to source.",tags:[]},{text:"I live each day with love, presence, and gratitude.",tags:["joy","love"]}],loss_of_faith_or_meaning:[{text:"I am open to rediscovering meaning in new and unexpected ways.",tags:["purpose"]},{text:"Doubt is a doorway to deeper understanding, not a dead end.",tags:[]},{text:"I am connected to life even when answers are not clear.",tags:[]},{text:"Each day I find small things that restore my sense of wonder.",tags:["healing"]},{text:"I allow my faith to evolve as I grow and learn.",tags:["growth","trust"]},{text:"Purpose emerges when I align with what matters most to me.",tags:["purpose"]},{text:"I trust the unfolding of my spiritual journey without forcing it.",tags:["trust"]},{text:"I find meaning in acts of kindness, presence, and service.",tags:["love","purpose"]},{text:"I am supported by the mystery of life and the love that flows through it.",tags:["love"]},{text:"I open my heart to curiosity, and meaning returns naturally.",tags:["love","purpose"]}],ego_conflict_spiritual:[{text:"I notice my ego with compassion and choose the soul's wisdom.",tags:["love"]},{text:"My true self is quiet, humble, and free from constant seeking.",tags:[]},{text:"I release the need to control identity and embrace deeper truth.",tags:["forgiveness"]},{text:"I choose presence and service over pride and defense.",tags:[]},{text:"The voice of my soul guides me toward alignment and peace.",tags:["peace"]},{text:"I welcome honesty and humility as allies on my path.",tags:[]},{text:"I am more than thoughts, roles, and titles assigned to me.",tags:[]},{text:"I surrender ego-driven fears and act from love and clarity.",tags:["trust","love","focus"]},{text:"I integrate my expressed self with my soul's deepest values.",tags:[]},{text:"I balance healthy self-respect with openness and surrender.",tags:["trust","healing"]}],"rejection_&_abandonment":[{text:"I am whole and complete even when others leave or change.",tags:[]},{text:"I deserve connection and I attract relationships that stay.",tags:["self-worth"]},{text:"My value does not depend on being chosen by anyone else.",tags:["self-worth"]},{text:"I heal from past abandonment with self-compassion and care.",tags:["love","healing"]},{text:"I create safe attachments by showing up honestly and consistently.",tags:[]},{text:"I release fear of being left and trust in my resilience.",tags:["trust","forgiveness"]},{text:"I am loved deeply by myself and others who reflect that care.",tags:["love"]},{text:"Vulnerability invites true connection, not guaranteed rejection.",tags:[]},{text:"Each relationship teaches and strengthens me; I grow from it.",tags:["growth"]},{text:"I am always connected to life and love, even through change.",tags:["love"]}],"failure_&_disappointment":[{text:"Failure is feedback that guides me closer to success.",tags:["abundance"]},{text:"I learn faster when outcomes are not as expected.",tags:["growth"]},{text:"I am resilient and adapt with creativity after setbacks.",tags:[]},{text:"Disappointment clears the path for new choices and opportunities.",tags:[]},{text:"I separate my worth from a single result or outcome.",tags:["self-worth"]},{text:"I am brave enough to try again with more wisdom and skill.",tags:["confidence","self-worth"]},{text:"Setbacks are temporary; my commitment endures.",tags:[]},{text:"I use disappointment as fuel for refining my approach.",tags:[]},{text:"I celebrate effort and progress, not only finished outcomes.",tags:[]},{text:"I am growing stronger from every challenge I face.",tags:["growth"]}],financial_insecurity:[{text:"I am learning to manage money wisely and with confidence.",tags:["confidence"]},{text:"Opportunities for income and stability are available to me now.",tags:[]},{text:"I deserve financial security and I take steps to build it.",tags:["self-worth"]},{text:"I am capable of creating sustainable income streams.",tags:[]},{text:"I release scarcity thoughts and embrace practical abundance.",tags:["forgiveness","abundance"]},{text:"I make choices that protect my future and my peace.",tags:["peace"]},{text:"My financial situation is improving through my consistent actions.",tags:[]},{text:"I attract resources that support my wellbeing and growth.",tags:["growth"]},{text:"I am worthy of prosperity and I plan for it with clarity.",tags:["self-worth","abundance","focus"]},{text:"I trust my ability to create safety and abundance over time.",tags:["trust","abundance"]}],"injustice_&_inequality":[{text:"My voice matters and I use it to promote fairness and dignity.",tags:[]},{text:"I deserve to be treated with respect and equality.",tags:["self-worth"]},{text:"I stand for justice while holding compassion for all involved.",tags:["love"]},{text:"I release internalized oppression and reclaim my inherent worth.",tags:["forgiveness","self-worth"]},{text:"I join with others to create change that uplifts communities.",tags:[]},{text:"I choose productive action over endless resentment.",tags:[]},{text:"I honor my experiences while seeking constructive solutions.",tags:[]},{text:"I am an agent of positive change within my circle of influence.",tags:[]},{text:"I deserve to be seen and compensated fairly for my contributions.",tags:["self-worth"]},{text:"My courage to speak truth paves the way for collective healing.",tags:["confidence","healing"]}],"comparison_&_envy":[{text:"My path is unique and cannot be measured against another's.",tags:[]},{text:"I celebrate others' success and trust mine is unfolding too.",tags:["trust","abundance"]},{text:"Comparison steals joy; I reclaim my own by focusing inward.",tags:["joy"]},{text:"I am inspired, not diminished, by someone else's achievements.",tags:[]},{text:"I measure progress by my values and personal growth.",tags:["growth"]},{text:"Gratitude for what I have transforms envy into motivation.",tags:["joy"]},{text:"I embrace my timing; my season is arriving in perfect order.",tags:[]},{text:"I honor my strengths and work gently on my growth edges.",tags:["growth"]},{text:"I am enough; others' lives do not define my worth.",tags:["self-worth"]},{text:"I am focused on becoming a better version of myself today.",tags:[]}],"information-overload_&_distractions":[{text:"I control my attention; I choose depth over endless input.",tags:["focus"]},{text:"I create quiet space to think, rest, and integrate.",tags:["energy"]},{text:"I limit distractions and protect my mental clarity.",tags:["focus"]},{text:"I process information with calm, not overwhelm.",tags:["peace"]},{text:"I prioritize what matters and release the rest with ease.",tags:["forgiveness","energy"]},{text:"My focus grows stronger each time I practice it.",tags:["focus"]},{text:"I schedule time for meaningful work and for restorative rest.",tags:["energy"]},{text:"I am present with one thing at a time and do it well.",tags:["focus"]},{text:"I am discerning about what I consume and why I consume it.",tags:[]},{text:"I create boundaries with devices and information sources.",tags:[]}],"addiction_&_escapism":[{text:"I am learning healthier ways to soothe and connect with life.",tags:[]},{text:"I choose presence, even when discomfort calls for escape.",tags:[]},{text:"I release habits that numb my heart and limit my freedom.",tags:["love","forgiveness"]},{text:"I replace avoidance with small, sustainable acts of care.",tags:[]},{text:"I am stronger than impulses that lead me away from my goals.",tags:[]},{text:"Support and community help me stay consistent and grounded.",tags:[]},{text:"I forgive myself for past escapes and recommit to wellbeing.",tags:["forgiveness"]},{text:"I welcome curiosity about my needs instead of numbing them.",tags:[]},{text:"I create routines that nourish body, heart, and mind.",tags:["love"]},{text:"Each day I move closer to freedom from unhealthy patterns.",tags:[]}],"burnout_&_exhaustion":[{text:"I honor my limits and replenish my energy before it runs low.",tags:["energy"]},{text:"Rest is productive; recovery strengthens my capacity to perform.",tags:["energy"]},{text:"I set boundaries that protect my time, energy, and health.",tags:["energy"]},{text:"Saying no to some things makes room for what truly matters.",tags:[]},{text:"I balance effort with rest to sustain long-term wellbeing.",tags:["energy","healing"]},{text:"I listen to my body and give it what it needs to recover.",tags:["healing"]},{text:"I reclaim joy through simple, consistent self-care practices.",tags:["joy"]},{text:"I am allowed to pause, reflect, and refuel without guilt.",tags:[]},{text:"I work smart, not just hard, and I delegate when needed.",tags:[]},{text:"My vitality grows as I respect and restore my limits.",tags:["energy","healing"]}],identity_confusion:[{text:"I am allowed to explore and evolve without pressure to decide now.",tags:["growth"]},{text:"My identity is a living process that unfolds with experience.",tags:[]},{text:"I trust myself to discover who I am through curiosity and action.",tags:["trust"]},{text:"I release labels that limit me and embrace my complexity.",tags:["forgiveness"]},{text:"I am grounded in values that guide my choices and shape my identity.",tags:[]},{text:"I accept uncertainty as part of becoming more alive and whole.",tags:[]},{text:"I give myself permission to shift and change authentically.",tags:[]},{text:"I am enough while I explore different parts of myself.",tags:["self-worth"]},{text:"I find clarity through honest reflection and compassionate experimentation.",tags:["focus","love"]},{text:"My true self emerges when I act from integrity and presence.",tags:[]}],ego_conflict_modern_world:[{text:"I notice when the ego reacts and I choose a wiser response.",tags:[]},{text:"I balance ambition with humility and service to others.",tags:["healing"]},{text:"I refuse to let status, image, or approval drive my life.",tags:[]},{text:"I act from values, not from the need to be seen or superior.",tags:[]},{text:"I am aware of my stories and I question them with kindness.",tags:["love"]},{text:"I integrate success with inner simplicity and presence.",tags:["abundance"]},{text:"I honor achievements without inflating or deflating my worth.",tags:["self-worth"]},{text:"I choose connection over competition in daily interactions.",tags:[]},{text:"I observe ego's fears and return to the heart's steady guidance.",tags:["love"]},{text:"I let go of identity traps and act from authentic purpose.",tags:["forgiveness","purpose"]}]};typeof window<"u"&&(window.affirmations=de);const gt=Object.freeze(Object.defineProperty({__proto__:null,default:de},Symbol.toStringTag,{value:"Module"})),a={RESPONSIBILITY:"Responsibility and Power",EMOTION:"Emotional Honesty",IDENTITY:"Identity and Roles",CREATIVITY:"Creativity and Expression",SHADOW:"Shadow and Integration",WISDOM:"Wisdom and Insight",JOY:"Joy and Fulfillment",PHYSICAL:"Physical Well-Being and Energy",RELATIONSHIPS:"Relationship",SPIRITUAL:"Spiritual Growth",FEAR:"Fear and Resistance",BOUNDARIES:"Boundaries and Consent",PURPOSE:"Purpose and Direction",MIND:"Mind and Awareness"},V=[{id:"RP-001",domain:a.RESPONSIBILITY,intensity:1,question:"Where do I still have choice today?",holding:"Feel this in the body.",tags:["choice"],beginnerSafe:!0},{id:"RP-002",domain:a.RESPONSIBILITY,intensity:1,question:"What small decision is available right now?",holding:"Notice simplicity.",tags:["decision"],beginnerSafe:!0},{id:"RP-003",domain:a.RESPONSIBILITY,intensity:1,question:"Where do I feel capable today?",holding:"Acknowledge capacity.",tags:["capacity"],beginnerSafe:!0},{id:"RP-004",domain:a.RESPONSIBILITY,intensity:1,question:"What can I influence in this moment?",holding:"Stay with what is reachable.",tags:["influence"],beginnerSafe:!0},{id:"RP-005",domain:a.RESPONSIBILITY,intensity:1,question:"What feels within my control right now?",holding:"Notice steadiness.",tags:["control"],beginnerSafe:!0},{id:"RP-006",domain:a.RESPONSIBILITY,intensity:1,question:"What action feels possible today?",holding:"Sense feasibility.",tags:["action"],beginnerSafe:!0},{id:"RP-007",domain:a.RESPONSIBILITY,intensity:1,question:"Where am I already showing up?",holding:"Recognize presence.",tags:["engagement"],beginnerSafe:!0},{id:"RP-008",domain:a.RESPONSIBILITY,intensity:1,question:"What responsibility feels light today?",holding:"Notice ease.",tags:["responsibility"],beginnerSafe:!0},{id:"RP-009",domain:a.RESPONSIBILITY,intensity:1,question:"What choice feels obvious right now?",holding:"Trust clarity.",tags:["clarity"],beginnerSafe:!0},{id:"RP-010",domain:a.RESPONSIBILITY,intensity:1,question:"Where do I feel agency in my body?",holding:"Sense strength.",tags:["agency"],beginnerSafe:!0},{id:"RP-011",domain:a.RESPONSIBILITY,intensity:1,question:"What am I already handling well?",holding:"Acknowledge competence.",tags:["competence"],beginnerSafe:!0},{id:"RP-012",domain:a.RESPONSIBILITY,intensity:1,question:"What feels manageable today?",holding:"Stay with what fits.",tags:["capacity"],beginnerSafe:!0},{id:"RP-013",domain:a.RESPONSIBILITY,intensity:2,question:"What decision am I postponing?",holding:"Notice hesitation.",tags:["delay"],beginnerSafe:!0},{id:"RP-014",domain:a.RESPONSIBILITY,intensity:2,question:"Where am I waiting instead of choosing?",holding:"Observe passivity.",tags:["waiting"],beginnerSafe:!0},{id:"RP-015",domain:a.RESPONSIBILITY,intensity:2,question:"What choice do I keep circling around?",holding:"Notice repetition.",tags:["pattern"],beginnerSafe:!0},{id:"RP-016",domain:a.RESPONSIBILITY,intensity:2,question:"What am I hoping will decide itself?",holding:"See avoidance gently.",tags:["avoidance"],beginnerSafe:!0},{id:"RP-017",domain:a.RESPONSIBILITY,intensity:2,question:"What outcome am I quietly choosing?",holding:"Notice subtle commitment.",tags:["outcome"],beginnerSafe:!0},{id:"RP-018",domain:a.RESPONSIBILITY,intensity:2,question:"Where am I unclear about my responsibility?",holding:"Let clarity form slowly.",tags:["clarity"],beginnerSafe:!0},{id:"RP-019",domain:a.RESPONSIBILITY,intensity:2,question:"What am I leaving undecided?",holding:"Notice suspension.",tags:["indecision"],beginnerSafe:!0},{id:"RP-020",domain:a.RESPONSIBILITY,intensity:2,question:"What choice feels heavier than it needs to be?",holding:"Sense unnecessary weight.",tags:["weight"],beginnerSafe:!0},{id:"RP-021",domain:a.RESPONSIBILITY,intensity:2,question:"What decision do I delay by overthinking?",holding:"Notice mental loops.",tags:["overthinking"],beginnerSafe:!0},{id:"RP-022",domain:a.RESPONSIBILITY,intensity:2,question:"What responsibility do I partially accept?",holding:"Notice partial ownership.",tags:["ownership"],beginnerSafe:!0},{id:"RP-023",domain:a.RESPONSIBILITY,intensity:2,question:"What am I hoping someone else will handle?",holding:"Notice delegation patterns.",tags:["delegation"],beginnerSafe:!0},{id:"RP-024",domain:a.RESPONSIBILITY,intensity:2,question:"Where do I feel unsure about choosing?",holding:"Stay with uncertainty.",tags:["uncertainty"],beginnerSafe:!0},{id:"RP-025",domain:a.RESPONSIBILITY,intensity:2,question:"What decision feels inevitable?",holding:"Sense readiness.",tags:["inevitable"],beginnerSafe:!0},{id:"RP-026",domain:a.RESPONSIBILITY,intensity:2,question:"What choice am I waiting to feel ready for?",holding:"Notice readiness stories.",tags:["readiness"],beginnerSafe:!0},{id:"RP-027",domain:a.RESPONSIBILITY,intensity:3,question:"Where am I giving my power away?",holding:"Observe any urge to justify.",tags:["power"],beginnerSafe:!1},{id:"RP-028",domain:a.RESPONSIBILITY,intensity:3,question:"What choice am I pretending I do not have?",holding:"Notice resistance.",tags:["denial"],beginnerSafe:!1},{id:"RP-029",domain:a.RESPONSIBILITY,intensity:3,question:"Where am I blaming circumstances instead of deciding?",holding:"Stay grounded with accountability.",tags:["blame"],beginnerSafe:!1},{id:"RP-030",domain:a.RESPONSIBILITY,intensity:3,question:"What outcome am I creating but denying?",holding:"Let consequences be seen.",tags:["consequence"],beginnerSafe:!1},{id:"RP-031",domain:a.RESPONSIBILITY,intensity:3,question:"Where am I choosing comfort over agency?",holding:"Notice the trade-off.",tags:["comfort"],beginnerSafe:!1},{id:"RP-032",domain:a.RESPONSIBILITY,intensity:3,question:"What responsibility am I avoiding owning?",holding:"Stay with discomfort.",tags:["avoidance"],beginnerSafe:!1},{id:"RP-033",domain:a.RESPONSIBILITY,intensity:3,question:"What decision am I outsourcing?",holding:"Notice dependence.",tags:["outsourcing"],beginnerSafe:!1},{id:"RP-034",domain:a.RESPONSIBILITY,intensity:3,question:"Where am I waiting to be rescued?",holding:"Observe expectation.",tags:["rescue"],beginnerSafe:!1},{id:"RP-035",domain:a.RESPONSIBILITY,intensity:3,question:"What power do I deny having?",holding:"Notice disbelief.",tags:["denial"],beginnerSafe:!1},{id:"RP-036",domain:a.RESPONSIBILITY,intensity:3,question:"What choice feels risky but true?",holding:"Stay with the edge.",tags:["risk"],beginnerSafe:!1},{id:"RP-037",domain:a.RESPONSIBILITY,intensity:3,question:"What am I tolerating instead of changing?",holding:"Notice tolerance limits.",tags:["tolerance"],beginnerSafe:!1},{id:"RP-038",domain:a.RESPONSIBILITY,intensity:3,question:"Where do I confuse patience with avoidance?",holding:"Differentiate clearly.",tags:["confusion"],beginnerSafe:!1},{id:"RP-039",domain:a.RESPONSIBILITY,intensity:4,question:"Who am I without blame?",holding:"Stay present in not knowing.",tags:["identity"],beginnerSafe:!1},{id:"RP-040",domain:a.RESPONSIBILITY,intensity:4,question:"Who am I when I fully own my choices?",holding:"Let identity soften.",tags:["ownership"],beginnerSafe:!1},{id:"RP-041",domain:a.RESPONSIBILITY,intensity:4,question:"What collapses when I stop outsourcing responsibility?",holding:"Stay with the collapse.",tags:["collapse"],beginnerSafe:!1},{id:"RP-042",domain:a.RESPONSIBILITY,intensity:4,question:"What remains when I stop resisting responsibility?",holding:"Sense what is left.",tags:["being"],beginnerSafe:!1},{id:"RP-043",domain:a.RESPONSIBILITY,intensity:4,question:"Who am I without control or avoidance?",holding:"Rest in openness.",tags:["freedom"],beginnerSafe:!1},{id:"RP-044",domain:a.RESPONSIBILITY,intensity:4,question:"What remains when responsibility is fully embraced?",holding:"Stay with grounded presence.",tags:["integration"],beginnerSafe:!1},{id:"EH-001",domain:a.EMOTION,intensity:1,question:"What am I feeling most clearly right now?",holding:"Name the sensation, not the story.",tags:["feeling"],beginnerSafe:!0},{id:"EH-002",domain:a.EMOTION,intensity:1,question:"Where in my body do I notice tension or ease?",holding:"Breathe into the sensation.",tags:["body-awareness"],beginnerSafe:!0},{id:"EH-003",domain:a.EMOTION,intensity:1,question:"What emotion is just beneath the surface?",holding:"Observe quietly.",tags:["subtle-feelings"],beginnerSafe:!0},{id:"EH-004",domain:a.EMOTION,intensity:1,question:"What feeling is easiest to accept today?",holding:"Acknowledge gently.",tags:["acceptance"],beginnerSafe:!0},{id:"EH-005",domain:a.EMOTION,intensity:1,question:"What small emotional shift do I notice?",holding:"Let awareness expand.",tags:["shift"],beginnerSafe:!0},{id:"EH-006",domain:a.EMOTION,intensity:1,question:"Which feeling feels familiar right now?",holding:"Observe without judgment.",tags:["familiarity"],beginnerSafe:!0},{id:"EH-007",domain:a.EMOTION,intensity:1,question:"What emotion is supporting me in this moment?",holding:"Notice gratitude for the feeling.",tags:["support"],beginnerSafe:!0},{id:"EH-008",domain:a.EMOTION,intensity:1,question:"What minor irritation is present?",holding:"Do not suppress it.",tags:["irritation"],beginnerSafe:!0},{id:"EH-009",domain:a.EMOTION,intensity:1,question:"What feeling arises without story attached?",holding:"Observe pure emotion.",tags:["purity"],beginnerSafe:!0},{id:"EH-010",domain:a.EMOTION,intensity:1,question:"Which emotion is strongest right now?",holding:"Acknowledge fully.",tags:["strength"],beginnerSafe:!0},{id:"EH-011",domain:a.EMOTION,intensity:1,question:"What emotion do I notice recurring?",holding:"See patterns gently.",tags:["patterns"],beginnerSafe:!0},{id:"EH-012",domain:a.EMOTION,intensity:1,question:"What feeling can I simply allow?",holding:"Rest with it for a moment.",tags:["allowing"],beginnerSafe:!0},{id:"EH-013",domain:a.EMOTION,intensity:2,question:"What emotion am I minimizing?",holding:"Let it have space.",tags:["honesty"],beginnerSafe:!0},{id:"EH-014",domain:a.EMOTION,intensity:2,question:"What feeling do I hide from others?",holding:"Notice without shame.",tags:["hiding"],beginnerSafe:!0},{id:"EH-015",domain:a.EMOTION,intensity:2,question:"What emotion do I judge most strongly?",holding:"Observe judgment neutrally.",tags:["judgment"],beginnerSafe:!0},{id:"EH-016",domain:a.EMOTION,intensity:2,question:"What feeling am I avoiding because it feels too big?",holding:"Stay with the edge.",tags:["avoidance"],beginnerSafe:!0},{id:"EH-017",domain:a.EMOTION,intensity:2,question:"Which emotion is driving my choices today?",holding:"Notice influence without judgment.",tags:["influence"],beginnerSafe:!0},{id:"EH-018",domain:a.EMOTION,intensity:2,question:"Where do I numb or distract myself from feeling?",holding:"Observe patterns gently.",tags:["numbing"],beginnerSafe:!0},{id:"EH-019",domain:a.EMOTION,intensity:2,question:"What feeling am I secretly indulging?",holding:"Notice without guilt.",tags:["indulgence"],beginnerSafe:!0},{id:"EH-020",domain:a.EMOTION,intensity:2,question:"What emotion do I wish would go away?",holding:"Stay present with discomfort.",tags:["resistance"],beginnerSafe:!0},{id:"EH-021",domain:a.EMOTION,intensity:2,question:"What feeling am I unaware of in my interactions?",holding:"Observe subtleties.",tags:["awareness"],beginnerSafe:!0},{id:"EH-022",domain:a.EMOTION,intensity:2,question:"Which emotion am I over-identifying with?",holding:"Notice attachment.",tags:["attachment"],beginnerSafe:!0},{id:"EH-023",domain:a.EMOTION,intensity:2,question:"What feeling is beneath my words today?",holding:"Listen silently.",tags:["subtext"],beginnerSafe:!0},{id:"EH-024",domain:a.EMOTION,intensity:2,question:"Where am I emotionally reactive instead of responsive?",holding:"Observe impulses carefully.",tags:["reactivity"],beginnerSafe:!0},{id:"EH-025",domain:a.EMOTION,intensity:2,question:"What feeling am I protecting by not speaking?",holding:"Notice protection without guilt.",tags:["protection"],beginnerSafe:!0},{id:"EH-026",domain:a.EMOTION,intensity:2,question:"What emotion needs acknowledgment today?",holding:"Give it attention without commentary.",tags:["acknowledgment"],beginnerSafe:!0},{id:"EH-027",domain:a.EMOTION,intensity:3,question:"What feeling am I avoiding experiencing fully?",holding:"Breathe and stay with it.",tags:["avoidance"],beginnerSafe:!1},{id:"EH-028",domain:a.EMOTION,intensity:3,question:"What emotion triggers shame or guilt?",holding:"Notice without defending.",tags:["shame"],beginnerSafe:!1},{id:"EH-029",domain:a.EMOTION,intensity:3,question:"What feeling am I repressing right now?",holding:"Observe tension in the body.",tags:["repression"],beginnerSafe:!1},{id:"EH-030",domain:a.EMOTION,intensity:3,question:"Where am I using logic to override feeling?",holding:"Notice bypass without judgment.",tags:["overriding"],beginnerSafe:!1},{id:"EH-031",domain:a.EMOTION,intensity:3,question:"What emotion am I afraid will overwhelm me?",holding:"Stay with intensity gently.",tags:["fear"],beginnerSafe:!1},{id:"EH-032",domain:a.EMOTION,intensity:3,question:"What am I hiding from myself emotionally?",holding:"Notice without shame.",tags:["hiding"],beginnerSafe:!1},{id:"EH-033",domain:a.EMOTION,intensity:3,question:"Which feeling am I resisting in relationships?",holding:"Observe boundaries gently.",tags:["relationships"],beginnerSafe:!1},{id:"EH-034",domain:a.EMOTION,intensity:3,question:"What emotion feels forbidden to me?",holding:"Stay with curiosity.",tags:["forbidden"],beginnerSafe:!1},{id:"EH-035",domain:a.EMOTION,intensity:3,question:"Where am I emotionally stuck?",holding:"Notice without forcing movement.",tags:["stuck"],beginnerSafe:!1},{id:"EH-036",domain:a.EMOTION,intensity:3,question:"What emotion am I masking with action?",holding:"Observe patterns honestly.",tags:["masking"],beginnerSafe:!1},{id:"EH-037",domain:a.EMOTION,intensity:3,question:"Which feeling triggers defensiveness?",holding:"Notice reaction without reacting.",tags:["defensiveness"],beginnerSafe:!1},{id:"EH-038",domain:a.EMOTION,intensity:3,question:"What emotion do I deny to avoid discomfort?",holding:"Observe denial gently.",tags:["denial"],beginnerSafe:!1},{id:"EH-039",domain:a.EMOTION,intensity:4,question:"Who am I without emotional control?",holding:"Sense rather than think.",tags:["identity"],beginnerSafe:!1},{id:"EH-040",domain:a.EMOTION,intensity:4,question:"What remains when I fully allow my emotions?",holding:"Rest in awareness.",tags:["allowance"],beginnerSafe:!1},{id:"EH-041",domain:a.EMOTION,intensity:4,question:"Who am I when I stop managing feelings?",holding:"Stay present.",tags:["being"],beginnerSafe:!1},{id:"EH-042",domain:a.EMOTION,intensity:4,question:"What is left when emotional resistance dissolves?",holding:"Sense openness.",tags:["openness"],beginnerSafe:!1},{id:"EH-043",domain:a.EMOTION,intensity:4,question:"Who am I without fear, shame, or guilt?",holding:"Notice spaciousness.",tags:["freedom"],beginnerSafe:!1},{id:"EH-044",domain:a.EMOTION,intensity:4,question:"What remains when I stop editing my feelings?",holding:"Rest in raw awareness.",tags:["rawness"],beginnerSafe:!1},{id:"IR-001",domain:a.IDENTITY,intensity:1,question:"Who am I in this moment, beyond labels?",holding:"Notice presence without judgment.",tags:["self-awareness"],beginnerSafe:!0},{id:"IR-002",domain:a.IDENTITY,intensity:1,question:"What role feels most natural today?",holding:"Observe ease and comfort.",tags:["roles"],beginnerSafe:!0},{id:"IR-003",domain:a.IDENTITY,intensity:1,question:"What part of myself is quiet but present?",holding:"Feel subtle presence.",tags:["inner-self"],beginnerSafe:!0},{id:"IR-004",domain:a.IDENTITY,intensity:1,question:"Which identity feels supportive today?",holding:"Notice alignment.",tags:["support"],beginnerSafe:!0},{id:"IR-005",domain:a.IDENTITY,intensity:1,question:"What aspect of me is lightly visible to others?",holding:"Observe without judgment.",tags:["visibility"],beginnerSafe:!0},{id:"IR-006",domain:a.IDENTITY,intensity:1,question:"Which role feels familiar and safe?",holding:"Acknowledge comfort.",tags:["familiarity"],beginnerSafe:!0},{id:"IR-007",domain:a.IDENTITY,intensity:1,question:"What part of myself do I notice in my actions?",holding:"Observe gently.",tags:["behavior"],beginnerSafe:!0},{id:"IR-008",domain:a.IDENTITY,intensity:1,question:"What identity is easiest to claim today?",holding:"Notice ease without forcing.",tags:["ease"],beginnerSafe:!0},{id:"IR-009",domain:a.IDENTITY,intensity:1,question:"Which role is lightly influencing my choices?",holding:"Observe influence gently.",tags:["influence"],beginnerSafe:!0},{id:"IR-010",domain:a.IDENTITY,intensity:1,question:"What part of me is present but unnoticed?",holding:"Feel subtle awareness.",tags:["subtlety"],beginnerSafe:!0},{id:"IR-011",domain:a.IDENTITY,intensity:1,question:"Which identity feels natural in my surroundings?",holding:"Observe harmony.",tags:["alignment"],beginnerSafe:!0},{id:"IR-012",domain:a.IDENTITY,intensity:1,question:"What role feels light and effortless?",holding:"Notice without expectation.",tags:["effortlessness"],beginnerSafe:!0},{id:"IR-013",domain:a.IDENTITY,intensity:2,question:"Which part of myself am I over-identifying with?",holding:"Observe attachment with curiosity.",tags:["attachment"],beginnerSafe:!0},{id:"IR-014",domain:a.IDENTITY,intensity:2,question:"What role do I perform to gain approval?",holding:"Notice motivation without judgment.",tags:["approval"],beginnerSafe:!0},{id:"IR-015",domain:a.IDENTITY,intensity:2,question:"What part of me feels hidden from others?",holding:"Observe presence quietly.",tags:["hidden"],beginnerSafe:!0},{id:"IR-016",domain:a.IDENTITY,intensity:2,question:"Which identity feels imposed by expectation?",holding:"Notice influence gently.",tags:["expectation"],beginnerSafe:!0},{id:"IR-017",domain:a.IDENTITY,intensity:2,question:"Where do I perform roles instead of choosing them?",holding:"Observe without criticism.",tags:["performance"],beginnerSafe:!0},{id:"IR-018",domain:a.IDENTITY,intensity:2,question:"What identity am I resisting claiming?",holding:"Notice tension without pushing.",tags:["resistance"],beginnerSafe:!0},{id:"IR-019",domain:a.IDENTITY,intensity:2,question:"Which role limits my authenticity?",holding:"Observe restriction clearly.",tags:["restriction"],beginnerSafe:!0},{id:"IR-020",domain:a.IDENTITY,intensity:2,question:"What identity feels contradictory today?",holding:"Notice without forcing resolution.",tags:["contradiction"],beginnerSafe:!0},{id:"IR-021",domain:a.IDENTITY,intensity:2,question:"Where do I exaggerate traits to fit in?",holding:"Observe without judgment.",tags:["exaggeration"],beginnerSafe:!0},{id:"IR-022",domain:a.IDENTITY,intensity:2,question:"Which part of me feels most authentic?",holding:"Notice grounding in truth.",tags:["authenticity"],beginnerSafe:!0},{id:"IR-023",domain:a.IDENTITY,intensity:2,question:"What role am I unconsciously playing?",holding:"Observe patterns quietly.",tags:["unconscious"],beginnerSafe:!0},{id:"IR-024",domain:a.IDENTITY,intensity:2,question:"Which identity do I present to avoid conflict?",holding:"Notice avoidance gently.",tags:["avoidance"],beginnerSafe:!0},{id:"IR-025",domain:a.IDENTITY,intensity:2,question:"Where am I negotiating who I am?",holding:"Observe inner compromises.",tags:["negotiation"],beginnerSafe:!0},{id:"IR-026",domain:a.IDENTITY,intensity:2,question:"Which role feels most draining?",holding:"Notice without judgment.",tags:["draining"],beginnerSafe:!0},{id:"IR-027",domain:a.IDENTITY,intensity:3,question:"Where am I hiding behind my roles?",holding:"Notice honestly.",tags:["hiding"],beginnerSafe:!1},{id:"IR-028",domain:a.IDENTITY,intensity:3,question:"Which identity do I defend at all costs?",holding:"Observe defense without argument.",tags:["defense"],beginnerSafe:!1},{id:"IR-029",domain:a.IDENTITY,intensity:3,question:"What part of me feels fractured between roles?",holding:"Observe fragmentation calmly.",tags:["fracture"],beginnerSafe:!1},{id:"IR-030",domain:a.IDENTITY,intensity:3,question:"Where do I exaggerate identity to hide vulnerability?",holding:"Notice without shame.",tags:["exaggeration"],beginnerSafe:!1},{id:"IR-031",domain:a.IDENTITY,intensity:3,question:"Which role am I avoiding fully claiming?",holding:"Observe resistance gently.",tags:["resistance"],beginnerSafe:!1},{id:"IR-032",domain:a.IDENTITY,intensity:3,question:"What identity am I clinging to out of fear?",holding:"Notice attachment without judgment.",tags:["fear"],beginnerSafe:!1},{id:"IR-033",domain:a.IDENTITY,intensity:3,question:"Where do I feel inauthentic with myself?",holding:"Observe without blame.",tags:["inauthenticity"],beginnerSafe:!1},{id:"IR-034",domain:a.IDENTITY,intensity:3,question:"What role masks my truth?",holding:"Notice patterns clearly.",tags:["masking"],beginnerSafe:!1},{id:"IR-035",domain:a.IDENTITY,intensity:3,question:"Where do I perform identity instead of living it?",holding:"Observe consciously.",tags:["performance"],beginnerSafe:!1},{id:"IR-036",domain:a.IDENTITY,intensity:3,question:"Which role limits my growth?",holding:"Notice gently.",tags:["limitation"],beginnerSafe:!1},{id:"IR-037",domain:a.IDENTITY,intensity:3,question:"Where do I hide vulnerability behind identity?",holding:"Observe fearlessly.",tags:["vulnerability"],beginnerSafe:!1},{id:"IR-038",domain:a.IDENTITY,intensity:3,question:"Which identity keeps me small?",holding:"Notice patterns clearly.",tags:["limitation"],beginnerSafe:!1},{id:"IR-039",domain:a.IDENTITY,intensity:4,question:"Who am I without roles or labels?",holding:"Rest in pure presence.",tags:["identity"],beginnerSafe:!1},{id:"IR-040",domain:a.IDENTITY,intensity:4,question:"What remains when I release performance?",holding:"Sense openness.",tags:["freedom"],beginnerSafe:!1},{id:"IR-041",domain:a.IDENTITY,intensity:4,question:"Who am I beyond expectations?",holding:"Observe essence directly.",tags:["essence"],beginnerSafe:!1},{id:"IR-042",domain:a.IDENTITY,intensity:4,question:"What is left when I stop hiding behind identity?",holding:"Rest in awareness.",tags:["awareness"],beginnerSafe:!1},{id:"IR-043",domain:a.IDENTITY,intensity:4,question:"Who am I without attachment to roles?",holding:"Notice spaciousness.",tags:["spaciousness"],beginnerSafe:!1},{id:"IR-044",domain:a.IDENTITY,intensity:4,question:"What remains when identity dissolves completely?",holding:"Rest in pure being.",tags:["being"],beginnerSafe:!1},{id:"FR-001",domain:a.FEAR,intensity:1,question:"What small fear am I noticing right now?",holding:"Observe it without reacting.",tags:["awareness"],beginnerSafe:!0},{id:"FR-002",domain:a.FEAR,intensity:1,question:"Where do I feel tension or hesitation?",holding:"Breathe into the sensation.",tags:["tension"],beginnerSafe:!0},{id:"FR-003",domain:a.FEAR,intensity:1,question:"Which minor resistance shows up today?",holding:"Notice gently.",tags:["resistance"],beginnerSafe:!0},{id:"FR-004",domain:a.FEAR,intensity:1,question:"What hesitation is easy to acknowledge?",holding:"Stay with simplicity.",tags:["hesitation"],beginnerSafe:!0},{id:"FR-005",domain:a.FEAR,intensity:1,question:"What discomfort feels manageable?",holding:"Notice without judgment.",tags:["discomfort"],beginnerSafe:!0},{id:"FR-006",domain:a.FEAR,intensity:1,question:"Which reaction feels light and observable?",holding:"Observe without story.",tags:["reaction"],beginnerSafe:!0},{id:"FR-007",domain:a.FEAR,intensity:1,question:"What tiny avoidance appears in thought or action?",holding:"Notice gently.",tags:["avoidance"],beginnerSafe:!0},{id:"FR-008",domain:a.FEAR,intensity:1,question:"Where does my body hint at subtle fear?",holding:"Scan calmly.",tags:["body-awareness"],beginnerSafe:!0},{id:"FR-009",domain:a.FEAR,intensity:1,question:"Which small step feels uncomfortable but safe?",holding:"Acknowledge awareness.",tags:["challenge"],beginnerSafe:!0},{id:"FR-010",domain:a.FEAR,intensity:1,question:"What is the lightest worry I notice?",holding:"Observe without feeding it.",tags:["worry"],beginnerSafe:!0},{id:"FR-011",domain:a.FEAR,intensity:1,question:"What subtle urge to avoid is present?",holding:"Feel it without reaction.",tags:["avoidance"],beginnerSafe:!0},{id:"FR-012",domain:a.FEAR,intensity:1,question:"Where is curiosity stronger than fear today?",holding:"Notice openness.",tags:["curiosity"],beginnerSafe:!0},{id:"FR-013",domain:a.FEAR,intensity:2,question:"Which fear am I gently avoiding?",holding:"Observe without pushing.",tags:["avoidance"],beginnerSafe:!0},{id:"FR-014",domain:a.FEAR,intensity:2,question:"Where do I hesitate to act due to uncertainty?",holding:"Notice gently.",tags:["hesitation"],beginnerSafe:!0},{id:"FR-015",domain:a.FEAR,intensity:2,question:"What fear influences my choices today?",holding:"Observe without judgment.",tags:["influence"],beginnerSafe:!0},{id:"FR-016",domain:a.FEAR,intensity:2,question:"Where do I resist trying something new?",holding:"Notice the resistance.",tags:["resistance"],beginnerSafe:!0},{id:"FR-017",domain:a.FEAR,intensity:2,question:"Which emotion is disguised as fear?",holding:"Observe subtlety.",tags:["emotion"],beginnerSafe:!0},{id:"FR-018",domain:a.FEAR,intensity:2,question:"Where do I postpone action due to worry?",holding:"Notice pattern without judgment.",tags:["procrastination"],beginnerSafe:!0},{id:"FR-019",domain:a.FEAR,intensity:2,question:"What fear feels familiar and recurring?",holding:"Observe without feeding it.",tags:["recurring"],beginnerSafe:!0},{id:"FR-020",domain:a.FEAR,intensity:2,question:"Where do I feel resistance to change?",holding:"Observe honestly.",tags:["change"],beginnerSafe:!0},{id:"FR-021",domain:a.FEAR,intensity:2,question:"What fear prevents me from being fully present?",holding:"Notice without self-criticism.",tags:["presence"],beginnerSafe:!0},{id:"FR-022",domain:a.FEAR,intensity:2,question:"Where am I exaggerating risk in my mind?",holding:"Observe perception gently.",tags:["perception"],beginnerSafe:!0},{id:"FR-023",domain:a.FEAR,intensity:2,question:"Which hesitation is unnecessary?",holding:"Notice clearly.",tags:["hesitation"],beginnerSafe:!0},{id:"FR-024",domain:a.FEAR,intensity:2,question:"Where do I avoid discomfort instead of facing it?",holding:"Observe gently.",tags:["avoidance"],beginnerSafe:!0},{id:"FR-025",domain:a.FEAR,intensity:2,question:"Which fear is subtly guiding my behavior?",holding:"Notice influence calmly.",tags:["guidance"],beginnerSafe:!0},{id:"FR-026",domain:a.FEAR,intensity:2,question:"Where do I resist possibilities due to fear?",holding:"Observe resistance.",tags:["possibility"],beginnerSafe:!0},{id:"FR-027",domain:a.FEAR,intensity:3,question:"Which fear limits my potential?",holding:"Observe without judgment.",tags:["limitation"],beginnerSafe:!1},{id:"FR-028",domain:a.FEAR,intensity:3,question:"Where do I resist facing truth because it feels unsafe?",holding:"Stay present with discomfort.",tags:["resistance"],beginnerSafe:!1},{id:"FR-029",domain:a.FEAR,intensity:3,question:"What fear am I avoiding by distraction?",holding:"Notice patterns clearly.",tags:["avoidance"],beginnerSafe:!1},{id:"FR-030",domain:a.FEAR,intensity:3,question:"Which fear is disguised as rational caution?",holding:"Observe subtle reasoning.",tags:["disguise"],beginnerSafe:!1},{id:"FR-031",domain:a.FEAR,intensity:3,question:"Where do I overestimate danger?",holding:"Notice perception clearly.",tags:["perception"],beginnerSafe:!1},{id:"FR-032",domain:a.FEAR,intensity:3,question:"What fear am I denying within myself?",holding:"Stay present with honesty.",tags:["denial"],beginnerSafe:!1},{id:"FR-033",domain:a.FEAR,intensity:3,question:"Which fear prevents me from stepping forward?",holding:"Notice blocks without blame.",tags:["inaction"],beginnerSafe:!1},{id:"FR-034",domain:a.FEAR,intensity:3,question:"Where do I resist growth due to fear?",holding:"Observe gently.",tags:["growth"],beginnerSafe:!1},{id:"FR-035",domain:a.FEAR,intensity:3,question:"Which fear triggers defensiveness?",holding:"Notice reaction carefully.",tags:["defensiveness"],beginnerSafe:!1},{id:"FR-036",domain:a.FEAR,intensity:3,question:"Where do I avoid facing discomfort?",holding:"Observe patterns honestly.",tags:["avoidance"],beginnerSafe:!1},{id:"FR-037",domain:a.FEAR,intensity:3,question:"Which fear holds me back from truth?",holding:"Notice without judgment.",tags:["truth"],beginnerSafe:!1},{id:"FR-038",domain:a.FEAR,intensity:3,question:"Where do I resist possibilities due to fear?",holding:"Observe gently.",tags:["possibility"],beginnerSafe:!1},{id:"FR-039",domain:a.FEAR,intensity:4,question:"Who am I without fear?",holding:"Rest in openness.",tags:["identity"],beginnerSafe:!1},{id:"FR-040",domain:a.FEAR,intensity:4,question:"What remains when resistance dissolves?",holding:"Notice spaciousness.",tags:["spaciousness"],beginnerSafe:!1},{id:"FR-041",domain:a.FEAR,intensity:4,question:"Who am I when fear no longer guides me?",holding:"Observe essence directly.",tags:["essence"],beginnerSafe:!1},{id:"FR-042",domain:a.FEAR,intensity:4,question:"What remains when fear is fully acknowledged?",holding:"Rest in presence.",tags:["presence"],beginnerSafe:!1},{id:"FR-043",domain:a.FEAR,intensity:4,question:"Who am I without resistance?",holding:"Notice spaciousness.",tags:["freedom"],beginnerSafe:!1},{id:"FR-044",domain:a.FEAR,intensity:4,question:"What remains when I release fear completely?",holding:"Rest in pure being.",tags:["being"],beginnerSafe:!1},{id:"BC-001",domain:a.BOUNDARIES,intensity:1,question:"Where do I feel comfortable saying yes or no today?",holding:"Notice ease and resistance gently.",tags:["comfort"],beginnerSafe:!0},{id:"BC-002",domain:a.BOUNDARIES,intensity:1,question:"Which situations feel natural to engage with?",holding:"Observe without judgment.",tags:["engagement"],beginnerSafe:!0},{id:"BC-003",domain:a.BOUNDARIES,intensity:1,question:"What limits feel safe to maintain?",holding:"Notice presence without tension.",tags:["limits"],beginnerSafe:!0},{id:"BC-004",domain:a.BOUNDARIES,intensity:1,question:"Where is my comfort level highest today?",holding:"Observe bodily and emotional ease.",tags:["comfort"],beginnerSafe:!0},{id:"BC-005",domain:a.BOUNDARIES,intensity:1,question:"What area feels easy to protect?",holding:"Notice without effort.",tags:["protection"],beginnerSafe:!0},{id:"BC-006",domain:a.BOUNDARIES,intensity:1,question:"Where do I feel naturally assertive?",holding:"Observe confidence gently.",tags:["assertion"],beginnerSafe:!0},{id:"BC-007",domain:a.BOUNDARIES,intensity:1,question:"What interactions feel safe to participate in?",holding:"Notice comfort without overthinking.",tags:["interaction"],beginnerSafe:!0},{id:"BC-008",domain:a.BOUNDARIES,intensity:1,question:"Where do I feel naturally protected?",holding:"Observe ease and stability.",tags:["protection"],beginnerSafe:!0},{id:"BC-009",domain:a.BOUNDARIES,intensity:1,question:"Which limits feel easy to honor today?",holding:"Notice without resistance.",tags:["honoring"],beginnerSafe:!0},{id:"BC-010",domain:a.BOUNDARIES,intensity:1,question:"Where is saying no effortless?",holding:"Observe simplicity.",tags:["no"],beginnerSafe:!0},{id:"BC-011",domain:a.BOUNDARIES,intensity:1,question:"Which personal space feels most comfortable?",holding:"Notice ease and awareness.",tags:["space"],beginnerSafe:!0},{id:"BC-012",domain:a.BOUNDARIES,intensity:1,question:"Where is consent clear and simple?",holding:"Observe clarity without thought.",tags:["consent"],beginnerSafe:!0},{id:"BC-013",domain:a.BOUNDARIES,intensity:2,question:"Which boundary do I hesitate to enforce?",holding:"Observe hesitation gently.",tags:["hesitation"],beginnerSafe:!0},{id:"BC-014",domain:a.BOUNDARIES,intensity:2,question:"Where do I feel pressure to overextend?",holding:"Notice influence without judgment.",tags:["pressure"],beginnerSafe:!0},{id:"BC-015",domain:a.BOUNDARIES,intensity:2,question:"Which relationship challenges my limits?",holding:"Observe calmly.",tags:["relationships"],beginnerSafe:!0},{id:"BC-016",domain:a.BOUNDARIES,intensity:2,question:"Where do I allow others to cross my boundaries unconsciously?",holding:"Notice patterns gently.",tags:["unconscious"],beginnerSafe:!0},{id:"BC-017",domain:a.BOUNDARIES,intensity:2,question:"Which limits do I compromise too easily?",holding:"Observe without self-criticism.",tags:["compromise"],beginnerSafe:!0},{id:"BC-018",domain:a.BOUNDARIES,intensity:2,question:"Where do I struggle to say no?",holding:"Notice gently and without judgment.",tags:["no"],beginnerSafe:!0},{id:"BC-019",domain:a.BOUNDARIES,intensity:2,question:"Which space feels difficult to protect?",holding:"Observe discomfort without reacting.",tags:["space"],beginnerSafe:!0},{id:"BC-020",domain:a.BOUNDARIES,intensity:2,question:"Where do I feel reluctant to assert myself?",holding:"Notice gently without force.",tags:["assertion"],beginnerSafe:!0},{id:"BC-021",domain:a.BOUNDARIES,intensity:2,question:"Which consent do I struggle to communicate clearly?",holding:"Observe patterns calmly.",tags:["consent"],beginnerSafe:!0},{id:"BC-022",domain:a.BOUNDARIES,intensity:2,question:"Where do I bend my limits for approval?",holding:"Notice without judgment.",tags:["approval"],beginnerSafe:!0},{id:"BC-023",domain:a.BOUNDARIES,intensity:2,question:"Which boundary feels blurred today?",holding:"Observe edges gently.",tags:["blurred"],beginnerSafe:!0},{id:"BC-024",domain:a.BOUNDARIES,intensity:2,question:"Where do I unconsciously consent to discomfort?",holding:"Notice without reaction.",tags:["unconscious-consent"],beginnerSafe:!0},{id:"BC-025",domain:a.BOUNDARIES,intensity:2,question:"Which limits am I unclear about today?",holding:"Observe uncertainty calmly.",tags:["clarity"],beginnerSafe:!0},{id:"BC-026",domain:a.BOUNDARIES,intensity:2,question:"Where do I hesitate to enforce boundaries out of fear?",holding:"Notice fear gently.",tags:["fear"],beginnerSafe:!0},{id:"BC-027",domain:a.BOUNDARIES,intensity:3,question:"Where have I violated my own limits?",holding:"Observe without self-blame.",tags:["violation"],beginnerSafe:!1},{id:"BC-028",domain:a.BOUNDARIES,intensity:3,question:"Which boundary am I avoiding defending?",holding:"Notice resistance honestly.",tags:["avoidance"],beginnerSafe:!1},{id:"BC-029",domain:a.BOUNDARIES,intensity:3,question:"Where do I give consent reluctantly?",holding:"Observe inner conflict clearly.",tags:["reluctance"],beginnerSafe:!1},{id:"BC-030",domain:a.BOUNDARIES,intensity:3,question:"Which limits do I compromise due to fear of rejection?",holding:"Notice honestly without judgment.",tags:["compromise"],beginnerSafe:!1},{id:"BC-031",domain:a.BOUNDARIES,intensity:3,question:"Where do I feel overextended due to unclear boundaries?",holding:"Observe discomfort calmly.",tags:["overextension"],beginnerSafe:!1},{id:"BC-032",domain:a.BOUNDARIES,intensity:3,question:"Which boundary do I resist enforcing?",holding:"Notice tension without reacting.",tags:["resistance"],beginnerSafe:!1},{id:"BC-033",domain:a.BOUNDARIES,intensity:3,question:"Where am I unclear about my consent to myself?",holding:"Observe honestly.",tags:["self-consent"],beginnerSafe:!1},{id:"BC-034",domain:a.BOUNDARIES,intensity:3,question:"Which limits feel painful to assert?",holding:"Notice without forcing.",tags:["pain"],beginnerSafe:!1},{id:"BC-035",domain:a.BOUNDARIES,intensity:3,question:"Where do I compromise to avoid conflict?",holding:"Observe pattern clearly.",tags:["conflict"],beginnerSafe:!1},{id:"BC-036",domain:a.BOUNDARIES,intensity:3,question:"Which boundary am I unclear about with others?",holding:"Notice edges gently.",tags:["clarity"],beginnerSafe:!1},{id:"BC-037",domain:a.BOUNDARIES,intensity:3,question:"Where do I allow intrusion unconsciously?",holding:"Observe without shame.",tags:["intrusion"],beginnerSafe:!1},{id:"BC-038",domain:a.BOUNDARIES,intensity:3,question:"Which limits do I avoid defining clearly?",holding:"Notice resistance gently.",tags:["definition"],beginnerSafe:!1},{id:"BC-039",domain:a.BOUNDARIES,intensity:4,question:"Who am I without any boundaries or rules?",holding:"Rest in spacious awareness.",tags:["identity"],beginnerSafe:!1},{id:"BC-040",domain:a.BOUNDARIES,intensity:4,question:"What remains when resistance and fear dissolve?",holding:"Notice presence fully.",tags:["freedom"],beginnerSafe:!1},{id:"BC-041",domain:a.BOUNDARIES,intensity:4,question:"Who am I without consent or refusal?",holding:"Observe essence without labels.",tags:["essence"],beginnerSafe:!1},{id:"BC-042",domain:a.BOUNDARIES,intensity:4,question:"What remains when I release all protective limits?",holding:"Rest in raw awareness.",tags:["awareness"],beginnerSafe:!1},{id:"BC-043",domain:a.BOUNDARIES,intensity:4,question:"Who am I when boundaries no longer define me?",holding:"Notice spaciousness.",tags:["spaciousness"],beginnerSafe:!1},{id:"BC-044",domain:a.BOUNDARIES,intensity:4,question:"What remains when consent, yes or no, dissolves completely?",holding:"Rest in pure being.",tags:["being"],beginnerSafe:!1},{id:"RC-001",domain:a.RELATIONSHIPS,intensity:1,question:"Who do I feel closest to today?",holding:"Notice warmth and ease.",tags:["closeness"],beginnerSafe:!0},{id:"RC-002",domain:a.RELATIONSHIPS,intensity:1,question:"Where do I feel naturally connected?",holding:"Observe without judgment.",tags:["connection"],beginnerSafe:!0},{id:"RC-003",domain:a.RELATIONSHIPS,intensity:1,question:"Which interaction feels light and effortless?",holding:"Notice ease in engagement.",tags:["interaction"],beginnerSafe:!0},{id:"RC-004",domain:a.RELATIONSHIPS,intensity:1,question:"Who brings me joy in their presence?",holding:"Observe happiness gently.",tags:["joy"],beginnerSafe:!0},{id:"RC-005",domain:a.RELATIONSHIPS,intensity:1,question:"Which relationship feels harmonious today?",holding:"Notice alignment and balance.",tags:["harmony"],beginnerSafe:!0},{id:"RC-006",domain:a.RELATIONSHIPS,intensity:1,question:"Where do I feel accepted without effort?",holding:"Observe comfort.",tags:["acceptance"],beginnerSafe:!0},{id:"RC-007",domain:a.RELATIONSHIPS,intensity:1,question:"Which connection feels naturally supportive?",holding:"Notice without judgment.",tags:["support"],beginnerSafe:!0},{id:"RC-008",domain:a.RELATIONSHIPS,intensity:1,question:"Who can I be myself around effortlessly?",holding:"Observe authenticity in connection.",tags:["authenticity"],beginnerSafe:!0},{id:"RC-009",domain:a.RELATIONSHIPS,intensity:1,question:"Which interaction feels lighthearted today?",holding:"Notice simplicity in engagement.",tags:["lighthearted"],beginnerSafe:!0},{id:"RC-010",domain:a.RELATIONSHIPS,intensity:1,question:"Where do I feel emotionally safe?",holding:"Observe openness and ease.",tags:["safety"],beginnerSafe:!0},{id:"RC-011",domain:a.RELATIONSHIPS,intensity:1,question:"Who inspires me through presence alone?",holding:"Notice influence without expectation.",tags:["inspiration"],beginnerSafe:!0},{id:"RC-012",domain:a.RELATIONSHIPS,intensity:1,question:"Which relationships feel naturally balanced?",holding:"Observe equilibrium.",tags:["balance"],beginnerSafe:!0},{id:"RC-013",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I feel tension in connection?",holding:"Notice discomfort without judgment.",tags:["tension"],beginnerSafe:!0},{id:"RC-014",domain:a.RELATIONSHIPS,intensity:2,question:"Which relationship challenges me today?",holding:"Observe reactions gently.",tags:["challenge"],beginnerSafe:!0},{id:"RC-015",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I feel unseen or unheard?",holding:"Notice without self-blame.",tags:["unseen"],beginnerSafe:!0},{id:"RC-016",domain:a.RELATIONSHIPS,intensity:2,question:"Which interaction evokes defensiveness?",holding:"Observe triggers calmly.",tags:["defensiveness"],beginnerSafe:!0},{id:"RC-017",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I unconsciously avoid connection?",holding:"Notice patterns without judgment.",tags:["avoidance"],beginnerSafe:!0},{id:"RC-018",domain:a.RELATIONSHIPS,intensity:2,question:"Which relationship feels draining rather than nourishing?",holding:"Observe energy exchange.",tags:["draining"],beginnerSafe:!0},{id:"RC-019",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I struggle to express needs?",holding:"Notice without self-judgment.",tags:["needs"],beginnerSafe:!0},{id:"RC-020",domain:a.RELATIONSHIPS,intensity:2,question:"Which interaction feels forced or unnatural?",holding:"Observe discomfort calmly.",tags:["forced"],beginnerSafe:!0},{id:"RC-021",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I overextend to maintain connection?",holding:"Notice balance without blame.",tags:["overextension"],beginnerSafe:!0},{id:"RC-022",domain:a.RELATIONSHIPS,intensity:2,question:"Which relationship evokes subtle fear or anxiety?",holding:"Observe without judgment.",tags:["fear","anxiety"],beginnerSafe:!0},{id:"RC-023",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I give more than I receive?",holding:"Observe imbalance gently.",tags:["imbalance"],beginnerSafe:!0},{id:"RC-024",domain:a.RELATIONSHIPS,intensity:2,question:"Which interaction evokes subtle joy or comfort?",holding:"Notice positive influence.",tags:["joy","comfort"],beginnerSafe:!0},{id:"RC-025",domain:a.RELATIONSHIPS,intensity:2,question:"Where do I unconsciously seek approval?",holding:"Observe motivation gently.",tags:["approval"],beginnerSafe:!0},{id:"RC-026",domain:a.RELATIONSHIPS,intensity:2,question:"Which relationship feels stagnant or repetitive?",holding:"Notice without judgment.",tags:["stagnation"],beginnerSafe:!0},{id:"RC-027",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I avoid difficult conversations?",holding:"Observe honestly without avoidance.",tags:["avoidance","confrontation"],beginnerSafe:!1},{id:"RC-028",domain:a.RELATIONSHIPS,intensity:3,question:"Which relationship triggers old wounds?",holding:"Notice patterns clearly.",tags:["triggers","wounds"],beginnerSafe:!1},{id:"RC-029",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I fear being misunderstood?",holding:"Observe fear without blame.",tags:["misunderstanding"],beginnerSafe:!1},{id:"RC-030",domain:a.RELATIONSHIPS,intensity:3,question:"Which relationship challenges my authenticity?",holding:"Observe patterns honestly.",tags:["authenticity"],beginnerSafe:!1},{id:"RC-031",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I suppress feelings to maintain peace?",holding:"Notice suppression gently.",tags:["suppression"],beginnerSafe:!1},{id:"RC-032",domain:a.RELATIONSHIPS,intensity:3,question:"Which connection evokes subtle resentment?",holding:"Observe without judgment.",tags:["resentment"],beginnerSafe:!1},{id:"RC-033",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I unconsciously people-please?",holding:"Notice motivation clearly.",tags:["people-pleasing"],beginnerSafe:!1},{id:"RC-034",domain:a.RELATIONSHIPS,intensity:3,question:"Which relationship feels controlling or controlling me?",holding:"Observe influence gently.",tags:["control"],beginnerSafe:!1},{id:"RC-035",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I resist connection due to fear?",holding:"Notice fear clearly.",tags:["resistance","fear"],beginnerSafe:!1},{id:"RC-036",domain:a.RELATIONSHIPS,intensity:3,question:"Which interactions feel emotionally heavy?",holding:"Observe energy without judgment.",tags:["heaviness"],beginnerSafe:!1},{id:"RC-037",domain:a.RELATIONSHIPS,intensity:3,question:"Where do I feel misunderstood yet stay silent?",holding:"Notice without blame.",tags:["silence","misunderstanding"],beginnerSafe:!1},{id:"RC-038",domain:a.RELATIONSHIPS,intensity:3,question:"Which relationship challenges my boundaries?",holding:"Observe tension without judgment.",tags:["boundaries"],beginnerSafe:!1},{id:"RC-039",domain:a.RELATIONSHIPS,intensity:4,question:"Who am I without any relational roles?",holding:"Rest in spacious awareness.",tags:["identity"],beginnerSafe:!1},{id:"RC-040",domain:a.RELATIONSHIPS,intensity:4,question:"What remains when attachment and expectation dissolve?",holding:"Notice presence fully.",tags:["freedom"],beginnerSafe:!1},{id:"RC-041",domain:a.RELATIONSHIPS,intensity:4,question:"Who am I when all connection is unconditional?",holding:"Observe essence without labels.",tags:["essence"],beginnerSafe:!1},{id:"RC-042",domain:a.RELATIONSHIPS,intensity:4,question:"What remains when I release need for approval?",holding:"Rest in raw awareness.",tags:["awareness"],beginnerSafe:!1},{id:"RC-043",domain:a.RELATIONSHIPS,intensity:4,question:"Who am I without expectation in relationships?",holding:"Notice spaciousness.",tags:["spaciousness"],beginnerSafe:!1},{id:"RC-044",domain:a.RELATIONSHIPS,intensity:4,question:"What remains when relational patterns dissolve completely?",holding:"Rest in pure being.",tags:["being"],beginnerSafe:!1},{id:"PD-001",domain:a.PURPOSE,intensity:1,question:"What small action feels meaningful today?",holding:"Notice without overthinking.",tags:["meaning"],beginnerSafe:!0},{id:"PD-002",domain:a.PURPOSE,intensity:1,question:"Where do I feel naturally guided?",holding:"Observe ease and flow.",tags:["guidance"],beginnerSafe:!0},{id:"PD-003",domain:a.PURPOSE,intensity:1,question:"Which activity brings me quiet satisfaction?",holding:"Notice contentment gently.",tags:["satisfaction"],beginnerSafe:!0},{id:"PD-004",domain:a.PURPOSE,intensity:1,question:"Where do I feel aligned with today’s intentions?",holding:"Observe alignment naturally.",tags:["alignment"],beginnerSafe:!0},{id:"PD-005",domain:a.PURPOSE,intensity:1,question:"Which task feels worth doing without effort?",holding:"Notice without forcing motivation.",tags:["effortless"],beginnerSafe:!0},{id:"PD-006",domain:a.PURPOSE,intensity:1,question:"Where do I feel naturally curious today?",holding:"Observe curiosity gently.",tags:["curiosity"],beginnerSafe:!0},{id:"PD-007",domain:a.PURPOSE,intensity:1,question:"Which intention feels clear and simple?",holding:"Notice clarity without judgment.",tags:["clarity"],beginnerSafe:!0},{id:"PD-008",domain:a.PURPOSE,intensity:1,question:"Where does focus come easily?",holding:"Observe ease and attention.",tags:["focus"],beginnerSafe:!0},{id:"PD-009",domain:a.PURPOSE,intensity:1,question:"Which moment feels naturally directed?",holding:"Notice flow without effort.",tags:["flow"],beginnerSafe:!0},{id:"PD-010",domain:a.PURPOSE,intensity:1,question:"Where do I feel satisfaction in small contributions?",holding:"Observe without expectation.",tags:["contribution"],beginnerSafe:!0},{id:"PD-011",domain:a.PURPOSE,intensity:1,question:"Which decision feels naturally aligned?",holding:"Notice without overanalyzing.",tags:["decision"],beginnerSafe:!0},{id:"PD-012",domain:a.PURPOSE,intensity:1,question:"Where does my energy feel directed naturally?",holding:"Observe flow without forcing.",tags:["energy"],beginnerSafe:!0},{id:"PD-013",domain:a.PURPOSE,intensity:2,question:"Which goals feel meaningful yet challenging?",holding:"Notice without pressure.",tags:["goals"],beginnerSafe:!0},{id:"PD-014",domain:a.PURPOSE,intensity:2,question:"Where do I feel uncertain about my direction?",holding:"Observe uncertainty calmly.",tags:["uncertainty"],beginnerSafe:!0},{id:"PD-015",domain:a.PURPOSE,intensity:2,question:"Which intention feels most aligned with my values?",holding:"Notice alignment clearly.",tags:["values"],beginnerSafe:!0},{id:"PD-016",domain:a.PURPOSE,intensity:2,question:"Where do I feel pulled in multiple directions?",holding:"Observe tension without judgment.",tags:["tension"],beginnerSafe:!0},{id:"PD-017",domain:a.PURPOSE,intensity:2,question:"Which choice feels significant yet manageable?",holding:"Notice without fear.",tags:["choice"],beginnerSafe:!0},{id:"PD-018",domain:a.PURPOSE,intensity:2,question:"Where do I resist clarity of intention?",holding:"Observe resistance gently.",tags:["resistance"],beginnerSafe:!0},{id:"PD-019",domain:a.PURPOSE,intensity:2,question:"Which goal do I hesitate to pursue?",holding:"Notice hesitation without judgment.",tags:["hesitation"],beginnerSafe:!0},{id:"PD-020",domain:a.PURPOSE,intensity:2,question:"Where do I feel scattered or unfocused?",holding:"Observe patterns gently.",tags:["focus"],beginnerSafe:!0},{id:"PD-021",domain:a.PURPOSE,intensity:2,question:"Which direction excites me despite fear?",holding:"Notice courage calmly.",tags:["excitement"],beginnerSafe:!0},{id:"PD-022",domain:a.PURPOSE,intensity:2,question:"Where do I feel unsure about my priorities?",holding:"Observe uncertainty gently.",tags:["priorities"],beginnerSafe:!0},{id:"PD-023",domain:a.PURPOSE,intensity:2,question:"Which path feels blocked or constrained?",holding:"Notice obstacles without judgment.",tags:["blockages"],beginnerSafe:!0},{id:"PD-024",domain:a.PURPOSE,intensity:2,question:"Where do I overthink my purpose?",holding:"Observe mental patterns gently.",tags:["overthinking"],beginnerSafe:!0},{id:"PD-025",domain:a.PURPOSE,intensity:2,question:"Which intention feels authentic yet challenging?",holding:"Notice authenticity calmly.",tags:["authenticity"],beginnerSafe:!0},{id:"PD-026",domain:a.PURPOSE,intensity:2,question:"Where do I feel conflicted about direction?",holding:"Observe honestly without forcing.",tags:["conflict"],beginnerSafe:!0},{id:"PD-027",domain:a.PURPOSE,intensity:3,question:"Where do I resist pursuing what matters most?",holding:"Observe resistance clearly.",tags:["resistance"],beginnerSafe:!1},{id:"PD-028",domain:a.PURPOSE,intensity:3,question:"Which direction do I fear committing to?",holding:"Notice fear without judgment.",tags:["fear"],beginnerSafe:!1},{id:"PD-029",domain:a.PURPOSE,intensity:3,question:"Where do I compromise purpose for comfort?",holding:"Observe patterns honestly.",tags:["compromise"],beginnerSafe:!1},{id:"PD-030",domain:a.PURPOSE,intensity:3,question:"Which goal do I avoid because it feels risky?",holding:"Notice avoidance gently.",tags:["avoidance"],beginnerSafe:!1},{id:"PD-031",domain:a.PURPOSE,intensity:3,question:"Where do I feel stuck despite knowing direction?",holding:"Observe stuckness without blame.",tags:["stuckness"],beginnerSafe:!1},{id:"PD-032",domain:a.PURPOSE,intensity:3,question:"Which path do I avoid out of fear of failure?",holding:"Notice without judgment.",tags:["failure"],beginnerSafe:!1},{id:"PD-033",domain:a.PURPOSE,intensity:3,question:"Where do I seek external validation for direction?",holding:"Observe motivations honestly.",tags:["validation"],beginnerSafe:!1},{id:"PD-034",domain:a.PURPOSE,intensity:3,question:"Which choice feels essential yet terrifying?",holding:"Notice tension without reacting.",tags:["essential","fear"],beginnerSafe:!1},{id:"PD-035",domain:a.PURPOSE,intensity:3,question:"Where do I postpone action despite knowing what’s right?",holding:"Observe procrastination clearly.",tags:["procrastination"],beginnerSafe:!1},{id:"PD-036",domain:a.PURPOSE,intensity:3,question:"Which goal do I fear realizing fully?",holding:"Notice fear calmly.",tags:["realization"],beginnerSafe:!1},{id:"PD-037",domain:a.PURPOSE,intensity:3,question:"Where do I doubt my capacity to follow through?",holding:"Observe self-doubt gently.",tags:["self-doubt"],beginnerSafe:!1},{id:"PD-038",domain:a.PURPOSE,intensity:3,question:"Which path do I resist despite inner knowing?",holding:"Notice inner conflict without judgment.",tags:["resistance"],beginnerSafe:!1},{id:"PD-039",domain:a.PURPOSE,intensity:4,question:"Who am I without goals or direction?",holding:"Rest in spacious awareness.",tags:["identity"],beginnerSafe:!1},{id:"PD-040",domain:a.PURPOSE,intensity:4,question:"What remains when all resistance dissolves?",holding:"Notice presence fully.",tags:["freedom"],beginnerSafe:!1},{id:"PD-041",domain:a.PURPOSE,intensity:4,question:"Who am I without striving or doing?",holding:"Observe essence without labels.",tags:["essence"],beginnerSafe:!1},{id:"PD-042",domain:a.PURPOSE,intensity:4,question:"What remains when attachment to outcome dissolves?",holding:"Rest in raw awareness.",tags:["awareness"],beginnerSafe:!1},{id:"PD-043",domain:a.PURPOSE,intensity:4,question:"Who am I when purpose flows naturally without resistance?",holding:"Notice spaciousness.",tags:["spaciousness"],beginnerSafe:!1},{id:"PD-044",domain:a.PURPOSE,intensity:4,question:"What remains when direction dissolves completely?",holding:"Rest in pure being.",tags:["being"],beginnerSafe:!1},{id:"MA-001",domain:a.MIND,intensity:1,question:"Where is my attention naturally resting right now?",holding:"Notice without effort.",tags:["attention"],beginnerSafe:!0},{id:"MA-002",domain:a.MIND,intensity:1,question:"What thoughts arise without judgment?",holding:"Observe mental patterns gently.",tags:["thoughts"],beginnerSafe:!0},{id:"MA-003",domain:a.MIND,intensity:1,question:"Which sensation feels most present in my body?",holding:"Notice without trying to change it.",tags:["sensation"],beginnerSafe:!0},{id:"MA-004",domain:a.MIND,intensity:1,question:"Where does clarity naturally emerge today?",holding:"Observe gently without forcing.",tags:["clarity"],beginnerSafe:!0},{id:"MA-005",domain:a.MIND,intensity:1,question:"Which moment feels fully alive?",holding:"Notice presence gently.",tags:["presence"],beginnerSafe:!0},{id:"MA-006",domain:a.MIND,intensity:1,question:"Where do I feel naturally alert?",holding:"Observe awareness without effort.",tags:["alertness"],beginnerSafe:!0},{id:"MA-007",domain:a.MIND,intensity:1,question:"Which thought brings gentle curiosity?",holding:"Notice curiosity without analysis.",tags:["curiosity"],beginnerSafe:!0},{id:"MA-008",domain:a.MIND,intensity:1,question:"Where does focus come naturally today?",holding:"Observe without forcing attention.",tags:["focus"],beginnerSafe:!0},{id:"MA-009",domain:a.MIND,intensity:1,question:"Which perception feels vivid right now?",holding:"Notice clarity without judgment.",tags:["perception"],beginnerSafe:!0},{id:"MA-010",domain:a.MIND,intensity:1,question:"Where do I feel mentally spacious?",holding:"Observe openness without effort.",tags:["spaciousness"],beginnerSafe:!0},{id:"MA-011",domain:a.MIND,intensity:1,question:"Which sensation or thought is easiest to notice?",holding:"Observe without attachment.",tags:["noticeability"],beginnerSafe:!0},{id:"MA-012",domain:a.MIND,intensity:1,question:"Where do I feel naturally mindful?",holding:"Notice awareness gently.",tags:["mindfulness"],beginnerSafe:!0},{id:"MA-013",domain:a.MIND,intensity:2,question:"Which recurring thought captures my attention today?",holding:"Notice patterns without judgment.",tags:["recurrence"],beginnerSafe:!0},{id:"MA-014",domain:a.MIND,intensity:2,question:"Where do I feel mentally scattered?",holding:"Observe without frustration.",tags:["scattered"],beginnerSafe:!0},{id:"MA-015",domain:a.MIND,intensity:2,question:"Which thought feels compelling but unnecessary?",holding:"Notice without engaging.",tags:["compelling"],beginnerSafe:!0},{id:"MA-016",domain:a.MIND,intensity:2,question:"Where does mental tension arise?",holding:"Observe sensation without reacting.",tags:["tension"],beginnerSafe:!0},{id:"MA-017",domain:a.MIND,intensity:2,question:"Which perception feels distorted today?",holding:"Notice clarity gently.",tags:["distortion"],beginnerSafe:!0},{id:"MA-018",domain:a.MIND,intensity:2,question:"Where do I unconsciously judge thoughts?",holding:"Observe without criticism.",tags:["judgment"],beginnerSafe:!0},{id:"MA-019",domain:a.MIND,intensity:2,question:"Which mental habit feels strongest?",holding:"Notice pattern without reacting.",tags:["habit"],beginnerSafe:!0},{id:"MA-020",domain:a.MIND,intensity:2,question:"Where do I overthink unnecessarily?",holding:"Observe overthinking calmly.",tags:["overthinking"],beginnerSafe:!0},{id:"MA-021",domain:a.MIND,intensity:2,question:"Which thought evokes subtle discomfort?",holding:"Notice without resistance.",tags:["discomfort"],beginnerSafe:!0},{id:"MA-022",domain:a.MIND,intensity:2,question:"Where do I feel mentally fragmented?",holding:"Observe fragments gently.",tags:["fragmentation"],beginnerSafe:!0},{id:"MA-023",domain:a.MIND,intensity:2,question:"Which perception feels effortless and clear?",holding:"Notice clarity naturally.",tags:["effortless"],beginnerSafe:!0},{id:"MA-024",domain:a.MIND,intensity:2,question:"Where do I seek control over thoughts?",holding:"Observe control gently.",tags:["control"],beginnerSafe:!0},{id:"MA-025",domain:a.MIND,intensity:2,question:"Which moment feels fully attentive?",holding:"Notice presence clearly.",tags:["attention"],beginnerSafe:!0},{id:"MA-026",domain:a.MIND,intensity:2,question:"Where do I resist letting thoughts settle?",holding:"Observe resistance gently.",tags:["resistance"],beginnerSafe:!0},{id:"MA-027",domain:a.MIND,intensity:3,question:"Where do I feel mentally stuck or blocked?",holding:"Notice without frustration.",tags:["stuck"],beginnerSafe:!1},{id:"MA-028",domain:a.MIND,intensity:3,question:"Which thought patterns limit me unconsciously?",holding:"Observe honestly without judgment.",tags:["limiting"],beginnerSafe:!1},{id:"MA-029",domain:a.MIND,intensity:3,question:"Where do I resist clarity of awareness?",holding:"Notice resistance calmly.",tags:["resistance"],beginnerSafe:!1},{id:"MA-030",domain:a.MIND,intensity:3,question:"Which mental habit causes subtle suffering?",holding:"Observe without blaming.",tags:["habit","suffering"],beginnerSafe:!1},{id:"MA-031",domain:a.MIND,intensity:3,question:"Where do I chase thoughts instead of resting in awareness?",holding:"Notice attachment gently.",tags:["attachment"],beginnerSafe:!1},{id:"MA-032",domain:a.MIND,intensity:3,question:"Which mental pattern repeats unconsciously?",holding:"Observe repetition calmly.",tags:["repetition"],beginnerSafe:!1},{id:"MA-033",domain:a.MIND,intensity:3,question:"Where do I over-analyze unnecessarily?",holding:"Observe without engaging.",tags:["overanalysis"],beginnerSafe:!1},{id:"MA-034",domain:a.MIND,intensity:3,question:"Which perception causes subtle fear or tension?",holding:"Notice tension without reacting.",tags:["fear","tension"],beginnerSafe:!1},{id:"MA-035",domain:a.MIND,intensity:3,question:"Where do I unconsciously judge myself mentally?",holding:"Observe patterns gently.",tags:["judgment"],beginnerSafe:!1},{id:"MA-036",domain:a.MIND,intensity:3,question:"Which thought triggers subtle frustration?",holding:"Notice without reaction.",tags:["frustration"],beginnerSafe:!1},{id:"MA-037",domain:a.MIND,intensity:3,question:"Where do I feel mentally tight or constricted?",holding:"Observe without pushing.",tags:["constriction"],beginnerSafe:!1},{id:"MA-038",domain:a.MIND,intensity:3,question:"Which mental resistance keeps me from awareness?",holding:"Observe clearly without judgment.",tags:["resistance"],beginnerSafe:!1},{id:"MA-039",domain:a.MIND,intensity:4,question:"Who am I without thoughts?",holding:"Rest in spacious awareness.",tags:["identity","essence"],beginnerSafe:!1},{id:"MA-040",domain:a.MIND,intensity:4,question:"What remains when mental patterns dissolve completely?",holding:"Notice pure awareness.",tags:["awareness","freedom"],beginnerSafe:!1},{id:"MA-041",domain:a.MIND,intensity:4,question:"Who am I when attention rests naturally without effort?",holding:"Observe spacious presence.",tags:["spaciousness"],beginnerSafe:!1},{id:"MA-042",domain:a.MIND,intensity:4,question:"Where is pure clarity when judgment dissolves?",holding:"Rest in pure seeing.",tags:["clarity","seeing"],beginnerSafe:!1},{id:"MA-043",domain:a.MIND,intensity:4,question:"Who am I without mental constructs or labels?",holding:"Observe essence naturally.",tags:["essence"],beginnerSafe:!1},{id:"MA-044",domain:a.MIND,intensity:4,question:"What remains when awareness is complete and effortless?",holding:"Rest in pure being.",tags:["being","awareness"],beginnerSafe:!1},{id:"SG-001",domain:a.SPIRITUAL,intensity:1,question:"Where do I feel naturally connected to something greater?",holding:"Notice connection without effort.",tags:["connection"],beginnerSafe:!0},{id:"SG-002",domain:a.SPIRITUAL,intensity:1,question:"Which moment today feels sacred or meaningful?",holding:"Observe significance gently.",tags:["sacred"],beginnerSafe:!0},{id:"SG-003",domain:a.SPIRITUAL,intensity:1,question:"Where do I feel inspired by presence itself?",holding:"Notice without expectation.",tags:["inspiration"],beginnerSafe:!0},{id:"SG-004",domain:a.SPIRITUAL,intensity:1,question:"Which simple act feels aligned with my soul?",holding:"Observe alignment naturally.",tags:["alignment"],beginnerSafe:!0},{id:"SG-005",domain:a.SPIRITUAL,intensity:1,question:"Where do I feel expansive and open?",holding:"Notice spaciousness gently.",tags:["openness"],beginnerSafe:!0},{id:"SG-006",domain:a.SPIRITUAL,intensity:1,question:"Which moment evokes gratitude effortlessly?",holding:"Observe gratitude without forcing.",tags:["gratitude"],beginnerSafe:!0},{id:"SG-007",domain:a.SPIRITUAL,intensity:1,question:"Where do I feel aligned with my higher self?",holding:"Notice alignment calmly.",tags:["higher-self"],beginnerSafe:!0},{id:"SG-008",domain:a.SPIRITUAL,intensity:1,question:"Which experience today feels transcendent?",holding:"Observe subtly without analyzing.",tags:["transcendence"],beginnerSafe:!0},{id:"SG-009",domain:a.SPIRITUAL,intensity:1,question:"Where do I feel naturally attuned to presence?",holding:"Notice gently.",tags:["presence"],beginnerSafe:!0},{id:"SG-010",domain:a.SPIRITUAL,intensity:1,question:"Which interaction feels infused with kindness?",holding:"Observe kindness effortlessly.",tags:["kindness"],beginnerSafe:!0},{id:"SG-011",domain:a.SPIRITUAL,intensity:1,question:"Where do I sense an inner calm naturally?",holding:"Observe calmness gently.",tags:["calm"],beginnerSafe:!0},{id:"SG-012",domain:a.SPIRITUAL,intensity:1,question:"Which simple observation evokes awe?",holding:"Notice awe without forcing.",tags:["awe"],beginnerSafe:!0},{id:"SG-013",domain:a.SPIRITUAL,intensity:2,question:"Where do I resist connection with my inner self?",holding:"Observe resistance without judgment.",tags:["resistance","inner-self"],beginnerSafe:!0},{id:"SG-014",domain:a.SPIRITUAL,intensity:2,question:"Which belief limits my spiritual growth?",holding:"Notice without criticism.",tags:["limiting-belief"],beginnerSafe:!0},{id:"SG-015",domain:a.SPIRITUAL,intensity:2,question:"Where do I feel blocked from deeper insight?",holding:"Observe gently without forcing.",tags:["blockage"],beginnerSafe:!0},{id:"SG-016",domain:a.SPIRITUAL,intensity:2,question:"Which attachment keeps me from surrender?",holding:"Notice without resistance.",tags:["attachment"],beginnerSafe:!0},{id:"SG-017",domain:a.SPIRITUAL,intensity:2,question:"Where do I seek external validation spiritually?",holding:"Observe motives clearly.",tags:["validation"],beginnerSafe:!0},{id:"SG-018",domain:a.SPIRITUAL,intensity:2,question:"Which pattern hinders my inner awakening?",holding:"Observe patterns honestly.",tags:["pattern","awakening"],beginnerSafe:!0},{id:"SG-019",domain:a.SPIRITUAL,intensity:2,question:"Where do I feel disconnected from life’s flow?",holding:"Observe gently without forcing.",tags:["disconnection","flow"],beginnerSafe:!0},{id:"SG-020",domain:a.SPIRITUAL,intensity:2,question:"Which thought or belief clouds spiritual clarity?",holding:"Notice without judgment.",tags:["clarity"],beginnerSafe:!0},{id:"SG-021",domain:a.SPIRITUAL,intensity:2,question:"Where do I resist unconditional presence?",holding:"Observe resistance calmly.",tags:["presence","resistance"],beginnerSafe:!0},{id:"SG-022",domain:a.SPIRITUAL,intensity:2,question:"Which habit keeps me from inner peace?",holding:"Notice gently without self-blame.",tags:["habit","peace"],beginnerSafe:!0},{id:"SG-023",domain:a.SPIRITUAL,intensity:2,question:"Where do I overidentify with ego-driven concerns?",holding:"Observe ego patterns calmly.",tags:["ego"],beginnerSafe:!0},{id:"SG-024",domain:a.SPIRITUAL,intensity:2,question:"Which moment evokes longing for deeper connection?",holding:"Notice without neediness.",tags:["longing","connection"],beginnerSafe:!0},{id:"SG-025",domain:a.SPIRITUAL,intensity:2,question:"Where do I resist surrender to what is?",holding:"Observe resistance gently.",tags:["surrender"],beginnerSafe:!0},{id:"SG-026",domain:a.SPIRITUAL,intensity:2,question:"Which pattern keeps me from full awareness?",holding:"Observe without attachment.",tags:["pattern","awareness"],beginnerSafe:!0},{id:"SG-027",domain:a.SPIRITUAL,intensity:3,question:"Where do I resist letting go completely?",holding:"Notice without forcing.",tags:["resistance","letting-go"],beginnerSafe:!1},{id:"SG-028",domain:a.SPIRITUAL,intensity:3,question:"Which attachment causes subtle suffering?",holding:"Observe honestly without judgment.",tags:["attachment","suffering"],beginnerSafe:!1},{id:"SG-029",domain:a.SPIRITUAL,intensity:3,question:"Where do I fear emptiness or stillness?",holding:"Notice fear calmly.",tags:["fear","emptiness"],beginnerSafe:!1},{id:"SG-030",domain:a.SPIRITUAL,intensity:3,question:"Which ego-driven desire blocks surrender?",holding:"Observe desire without attachment.",tags:["ego","desire"],beginnerSafe:!1},{id:"SG-031",domain:a.SPIRITUAL,intensity:3,question:"Where do I resist unconditional love for self or others?",holding:"Notice gently without judgment.",tags:["love","resistance"],beginnerSafe:!1},{id:"SG-032",domain:a.SPIRITUAL,intensity:3,question:"Which pattern prevents me from full presence?",holding:"Observe honestly and calmly.",tags:["pattern","presence"],beginnerSafe:!1},{id:"SG-033",domain:a.SPIRITUAL,intensity:3,question:"Where do I unconsciously seek control spiritually?",holding:"Notice control gently.",tags:["control","spirituality"],beginnerSafe:!1},{id:"SG-034",domain:a.SPIRITUAL,intensity:3,question:"Which fear keeps me from inner freedom?",holding:"Observe fear without judgment.",tags:["fear","freedom"],beginnerSafe:!1},{id:"SG-035",domain:a.SPIRITUAL,intensity:3,question:"Where do I resist seeing things as they are?",holding:"Notice clarity gently.",tags:["resistance","clarity"],beginnerSafe:!1},{id:"SG-036",domain:a.SPIRITUAL,intensity:3,question:"Which attachment subtly dictates my choices?",holding:"Observe honestly.",tags:["attachment","choices"],beginnerSafe:!1},{id:"SG-037",domain:a.SPIRITUAL,intensity:3,question:"Where do I unconsciously judge spiritual experiences?",holding:"Notice judgment calmly.",tags:["judgment"],beginnerSafe:!1},{id:"SG-038",domain:a.SPIRITUAL,intensity:3,question:"Which experience evokes subtle longing for transcendence?",holding:"Observe gently without grasping.",tags:["longing","transcendence"],beginnerSafe:!1},{id:"SG-039",domain:a.SPIRITUAL,intensity:4,question:"Who am I beyond identity, ego, or roles?",holding:"Rest in pure being.",tags:["identity","ego","essence"],beginnerSafe:!1},{id:"SG-040",domain:a.SPIRITUAL,intensity:4,question:"What remains when all attachments dissolve completely?",holding:"Notice spacious awareness.",tags:["attachments","awareness"],beginnerSafe:!1},{id:"SG-041",domain:a.SPIRITUAL,intensity:4,question:"Who am I without expectation or need?",holding:"Observe essence naturally.",tags:["essence","freedom"],beginnerSafe:!1},{id:"SG-042",domain:a.SPIRITUAL,intensity:4,question:"Where is pure consciousness without form or thought?",holding:"Rest in presence.",tags:["consciousness"],beginnerSafe:!1},{id:"SG-043",domain:a.SPIRITUAL,intensity:4,question:"Who am I beyond doing or becoming?",holding:"Notice spacious being.",tags:["being"],beginnerSafe:!1},{id:"SG-044",domain:a.SPIRITUAL,intensity:4,question:"What remains when all layers of self dissolve completely?",holding:"Rest in pure awareness.",tags:["awareness","essence"],beginnerSafe:!1},{id:"CE-001",domain:a.CREATIVITY,intensity:1,question:"Which small act of creation feels enjoyable today?",holding:"Notice joy without expectation.",tags:["creation","joy"],beginnerSafe:!0},{id:"CE-002",domain:a.CREATIVITY,intensity:1,question:"Where does inspiration arise naturally?",holding:"Observe gently without forcing.",tags:["inspiration"],beginnerSafe:!0},{id:"CE-003",domain:a.CREATIVITY,intensity:1,question:"Which activity allows me to express myself freely?",holding:"Notice without judgment.",tags:["expression"],beginnerSafe:!0},{id:"CE-004",domain:a.CREATIVITY,intensity:1,question:"Where do I feel playful or experimental?",holding:"Observe playfulness gently.",tags:["play","experimentation"],beginnerSafe:!0},{id:"CE-005",domain:a.CREATIVITY,intensity:1,question:"Which sensory experience sparks curiosity?",holding:"Notice sensations without analysis.",tags:["curiosity","senses"],beginnerSafe:!0},{id:"CE-006",domain:a.CREATIVITY,intensity:1,question:"Where do ideas flow naturally?",holding:"Observe flow without forcing.",tags:["ideas","flow"],beginnerSafe:!0},{id:"CE-007",domain:a.CREATIVITY,intensity:1,question:"Which moment today invites gentle experimentation?",holding:"Notice without overthinking.",tags:["experimentation"],beginnerSafe:!0},{id:"CE-008",domain:a.CREATIVITY,intensity:1,question:"Where do I feel naturally inventive?",holding:"Observe creativity calmly.",tags:["invention","creativity"],beginnerSafe:!0},{id:"CE-009",domain:a.CREATIVITY,intensity:1,question:"Which small expression feels authentic?",holding:"Notice authenticity gently.",tags:["authenticity","expression"],beginnerSafe:!0},{id:"CE-010",domain:a.CREATIVITY,intensity:1,question:"Where does imagination arise effortlessly?",holding:"Observe without attachment.",tags:["imagination"],beginnerSafe:!0},{id:"CE-011",domain:a.CREATIVITY,intensity:1,question:"Which activity evokes a sense of wonder?",holding:"Notice wonder naturally.",tags:["wonder"],beginnerSafe:!0},{id:"CE-012",domain:a.CREATIVITY,intensity:1,question:"Where do I feel naturally expressive today?",holding:"Observe expression without effort.",tags:["expression"],beginnerSafe:!0},{id:"CE-013",domain:a.CREATIVITY,intensity:2,question:"Where do I resist expressing myself fully?",holding:"Observe resistance without judgment.",tags:["resistance","expression"],beginnerSafe:!0},{id:"CE-014",domain:a.CREATIVITY,intensity:2,question:"Which idea do I hesitate to explore?",holding:"Notice hesitation gently.",tags:["ideas","hesitation"],beginnerSafe:!0},{id:"CE-015",domain:a.CREATIVITY,intensity:2,question:"Where do I feel blocked in imagination?",holding:"Observe blocks calmly.",tags:["blockage","imagination"],beginnerSafe:!0},{id:"CE-016",domain:a.CREATIVITY,intensity:2,question:"Which form of expression feels most authentic yet unpracticed?",holding:"Notice authenticity without fear.",tags:["authenticity","practice"],beginnerSafe:!0},{id:"CE-017",domain:a.CREATIVITY,intensity:2,question:"Where do I self-censor unnecessarily?",holding:"Observe gently without blame.",tags:["self-censorship"],beginnerSafe:!0},{id:"CE-018",domain:a.CREATIVITY,intensity:2,question:"Which habit limits creative flow?",holding:"Notice without judgment.",tags:["habit","flow"],beginnerSafe:!0},{id:"CE-019",domain:a.CREATIVITY,intensity:2,question:"Where do I overthink before creating?",holding:"Observe overthinking calmly.",tags:["overthinking"],beginnerSafe:!0},{id:"CE-020",domain:a.CREATIVITY,intensity:2,question:"Which idea feels blocked by fear of failure?",holding:"Notice fear gently.",tags:["fear","ideas"],beginnerSafe:!0},{id:"CE-021",domain:a.CREATIVITY,intensity:2,question:"Where do I seek validation for my creative work?",holding:"Observe motives without judgment.",tags:["validation","creativity"],beginnerSafe:!0},{id:"CE-022",domain:a.CREATIVITY,intensity:2,question:"Which activity evokes effortless flow?",holding:"Notice without forcing.",tags:["flow","effortless"],beginnerSafe:!0},{id:"CE-023",domain:a.CREATIVITY,intensity:2,question:"Where do I resist experimenting freely?",holding:"Observe resistance calmly.",tags:["resistance","experimentation"],beginnerSafe:!0},{id:"CE-024",domain:a.CREATIVITY,intensity:2,question:"Which expression feels authentic but uncomfortable?",holding:"Notice without pushing.",tags:["authenticity","expression"],beginnerSafe:!0},{id:"CE-025",domain:a.CREATIVITY,intensity:2,question:"Where do I unconsciously compare my creations to others?",holding:"Observe without judgment.",tags:["comparison"],beginnerSafe:!0},{id:"CE-026",domain:a.CREATIVITY,intensity:2,question:"Which moment sparks curiosity for new ideas?",holding:"Notice curiosity naturally.",tags:["curiosity","ideas"],beginnerSafe:!0},{id:"CE-027",domain:a.CREATIVITY,intensity:3,question:"Where do I fear expressing my deepest self?",holding:"Observe fear without resisting.",tags:["fear","expression"],beginnerSafe:!1},{id:"CE-028",domain:a.CREATIVITY,intensity:3,question:"Which attachment to perfection blocks flow?",holding:"Notice without judgment.",tags:["perfection","attachment"],beginnerSafe:!1},{id:"CE-029",domain:a.CREATIVITY,intensity:3,question:"Where do I avoid vulnerability in creation?",holding:"Observe without shame.",tags:["vulnerability","avoidance"],beginnerSafe:!1},{id:"CE-030",domain:a.CREATIVITY,intensity:3,question:"Which fear of failure keeps me from experimenting?",holding:"Notice fear calmly.",tags:["fear","failure"],beginnerSafe:!1},{id:"CE-031",domain:a.CREATIVITY,intensity:3,question:"Where do I resist authentic expression due to others’ expectations?",holding:"Observe without attachment.",tags:["resistance","authenticity"],beginnerSafe:!1},{id:"CE-032",domain:a.CREATIVITY,intensity:3,question:"Which internal critic limits my creative freedom?",holding:"Notice critic without fighting.",tags:["internal-critic"],beginnerSafe:!1},{id:"CE-033",domain:a.CREATIVITY,intensity:3,question:"Where do I feel creatively blocked despite desire to express?",holding:"Observe blocks calmly.",tags:["blockage","desire"],beginnerSafe:!1},{id:"CE-034",domain:a.CREATIVITY,intensity:3,question:"Which attachment to outcome blocks authentic creation?",holding:"Notice attachment gently.",tags:["attachment","outcome"],beginnerSafe:!1},{id:"CE-035",domain:a.CREATIVITY,intensity:3,question:"Where do I fear judgment for unconventional ideas?",holding:"Observe fear calmly.",tags:["fear","judgment"],beginnerSafe:!1},{id:"CE-036",domain:a.CREATIVITY,intensity:3,question:"Which pattern prevents me from full creative flow?",holding:"Observe honestly.",tags:["pattern","flow"],beginnerSafe:!1},{id:"CE-037",domain:a.CREATIVITY,intensity:3,question:"Where do I unconsciously self-censor ideas?",holding:"Observe without judgment.",tags:["self-censorship"],beginnerSafe:!1},{id:"CE-038",domain:a.CREATIVITY,intensity:3,question:"Which fear of inadequacy blocks authentic expression?",holding:"Notice without resistance.",tags:["fear","inadequacy"],beginnerSafe:!1},{id:"CE-039",domain:a.CREATIVITY,intensity:4,question:"Who am I beyond my creations and ideas?",holding:"Rest in pure being.",tags:["identity","essence"],beginnerSafe:!1},{id:"CE-040",domain:a.CREATIVITY,intensity:4,question:"What remains when all judgment and attachment dissolve?",holding:"Notice spacious awareness.",tags:["judgment","attachment","awareness"],beginnerSafe:!1},{id:"CE-041",domain:a.CREATIVITY,intensity:4,question:"Who am I without the need to create or perform?",holding:"Observe essence naturally.",tags:["being","essence"],beginnerSafe:!1},{id:"CE-042",domain:a.CREATIVITY,intensity:4,question:"Where is pure expression without expectation or outcome?",holding:"Rest in effortless being.",tags:["expression","being"],beginnerSafe:!1},{id:"CE-043",domain:a.CREATIVITY,intensity:4,question:"Who am I beyond imagination and ideas?",holding:"Notice spacious presence.",tags:["identity","imagination"],beginnerSafe:!1},{id:"CE-044",domain:a.CREATIVITY,intensity:4,question:"What remains when all patterns of creative thought dissolve?",holding:"Rest in pure awareness.",tags:["patterns","awareness"],beginnerSafe:!1},{id:"PW-001",domain:a.PHYSICAL,intensity:1,question:"Where do I feel most grounded in my body right now?",holding:"Notice sensation without effort.",tags:["grounding","body"],beginnerSafe:!0},{id:"PW-002",domain:a.PHYSICAL,intensity:1,question:"Which part of my body feels alive or alert?",holding:"Observe without judgment.",tags:["alertness","body-awareness"],beginnerSafe:!0},{id:"PW-003",domain:a.PHYSICAL,intensity:1,question:"Where do I feel natural ease in movement?",holding:"Notice gently without forcing.",tags:["ease","movement"],beginnerSafe:!0},{id:"PW-004",domain:a.PHYSICAL,intensity:1,question:"Which breath feels easiest and most natural?",holding:"Observe breath without changing it.",tags:["breath","ease"],beginnerSafe:!0},{id:"PW-005",domain:a.PHYSICAL,intensity:1,question:"Where do I feel warmth or comfort in my body?",holding:"Notice sensations naturally.",tags:["comfort","warmth"],beginnerSafe:!0},{id:"PW-006",domain:a.PHYSICAL,intensity:1,question:"Which part of my body feels relaxed right now?",holding:"Observe relaxation without forcing.",tags:["relaxation","body-awareness"],beginnerSafe:!0},{id:"PW-007",domain:a.PHYSICAL,intensity:1,question:"Where do I feel energy flowing naturally?",holding:"Notice movement of energy gently.",tags:["energy","flow"],beginnerSafe:!0},{id:"PW-008",domain:a.PHYSICAL,intensity:1,question:"Which simple movement feels enjoyable today?",holding:"Observe without judgment.",tags:["movement","enjoyment"],beginnerSafe:!0},{id:"PW-009",domain:a.PHYSICAL,intensity:1,question:"Where do I feel natural support from the ground or floor?",holding:"Notice grounding sensation calmly.",tags:["grounding","support"],beginnerSafe:!0},{id:"PW-010",domain:a.PHYSICAL,intensity:1,question:"Which posture feels easiest and most natural?",holding:"Observe posture gently.",tags:["posture","ease"],beginnerSafe:!0},{id:"PW-011",domain:a.PHYSICAL,intensity:1,question:"Where do I feel comfortable in stillness?",holding:"Notice stillness without effort.",tags:["stillness","comfort"],beginnerSafe:!0},{id:"PW-012",domain:a.PHYSICAL,intensity:1,question:"Which bodily sensation is most vivid right now?",holding:"Observe vividly without judgment.",tags:["sensation","awareness"],beginnerSafe:!0},{id:"PW-013",domain:a.PHYSICAL,intensity:2,question:"Where do I feel tension or tightness?",holding:"Observe gently without forcing relaxation.",tags:["tension","tightness"],beginnerSafe:!0},{id:"PW-014",domain:a.PHYSICAL,intensity:2,question:"Which habits affect my energy positively or negatively?",holding:"Notice patterns without judgment.",tags:["habits","energy"],beginnerSafe:!0},{id:"PW-015",domain:a.PHYSICAL,intensity:2,question:"Where do I unconsciously hold stress in my body?",holding:"Observe stress gently without tension.",tags:["stress","body-awareness"],beginnerSafe:!0},{id:"PW-016",domain:a.PHYSICAL,intensity:2,question:"Which movement or activity drains or energizes me?",holding:"Notice without forcing change.",tags:["movement","energy"],beginnerSafe:!0},{id:"PW-017",domain:a.PHYSICAL,intensity:2,question:"Where do I feel subtle discomfort or imbalance?",holding:"Observe without judgment.",tags:["discomfort","imbalance"],beginnerSafe:!0},{id:"PW-018",domain:a.PHYSICAL,intensity:2,question:"Which energy center feels most active or blocked?",holding:"Notice without manipulating.",tags:["energy","chakra"],beginnerSafe:!0},{id:"PW-019",domain:a.PHYSICAL,intensity:2,question:"Where do I feel mindful of breath, posture, or sensation?",holding:"Observe naturally.",tags:["mindfulness","body"],beginnerSafe:!0},{id:"PW-020",domain:a.PHYSICAL,intensity:2,question:"Which movement feels restricted today?",holding:"Notice without forcing freedom.",tags:["restriction","movement"],beginnerSafe:!0},{id:"PW-021",domain:a.PHYSICAL,intensity:2,question:"Where do I feel subtle tension from thoughts or emotions?",holding:"Observe connection calmly.",tags:["tension","mind-body"],beginnerSafe:!0},{id:"PW-022",domain:a.PHYSICAL,intensity:2,question:"Which activity restores vitality naturally?",holding:"Notice restoration without forcing.",tags:["energy","restoration"],beginnerSafe:!0},{id:"PW-023",domain:a.PHYSICAL,intensity:2,question:"Where do I unconsciously resist bodily ease?",holding:"Observe gently without pushing.",tags:["resistance","ease"],beginnerSafe:!0},{id:"PW-024",domain:a.PHYSICAL,intensity:2,question:"Which posture or habit supports my well-being?",holding:"Notice support naturally.",tags:["posture","habit","well-being"],beginnerSafe:!0},{id:"PW-025",domain:a.PHYSICAL,intensity:2,question:"Where does subtle energy move freely or feel blocked?",holding:"Observe flow calmly.",tags:["energy","flow"],beginnerSafe:!0},{id:"PW-026",domain:a.PHYSICAL,intensity:2,question:"Which moment today invites mindful movement or stillness?",holding:"Notice naturally.",tags:["movement","stillness"],beginnerSafe:!0},{id:"PW-027",domain:a.PHYSICAL,intensity:3,question:"Where do I resist feeling my body fully?",holding:"Observe resistance without judgment.",tags:["resistance","body-awareness"],beginnerSafe:!1},{id:"PW-028",domain:a.PHYSICAL,intensity:3,question:"Which habit unconsciously drains my energy?",holding:"Notice honestly without judgment.",tags:["habit","energy"],beginnerSafe:!1},{id:"PW-029",domain:a.PHYSICAL,intensity:3,question:"Where do I fear discomfort or pain in my body?",holding:"Observe fear calmly.",tags:["fear","discomfort"],beginnerSafe:!1},{id:"PW-030",domain:a.PHYSICAL,intensity:3,question:"Which tension persists despite effort to release it?",holding:"Notice without pushing.",tags:["tension","release"],beginnerSafe:!1},{id:"PW-031",domain:a.PHYSICAL,intensity:3,question:"Where do I unconsciously resist restorative practices?",holding:"Observe gently without judgment.",tags:["resistance","restoration"],beginnerSafe:!1},{id:"PW-032",domain:a.PHYSICAL,intensity:3,question:"Which energy blocks subtle awareness or vitality?",holding:"Notice flow without forcing.",tags:["energy","blockage"],beginnerSafe:!1},{id:"PW-033",domain:a.PHYSICAL,intensity:3,question:"Where do I resist listening to my body’s signals?",holding:"Observe without judgment.",tags:["resistance","awareness"],beginnerSafe:!1},{id:"PW-034",domain:a.PHYSICAL,intensity:3,question:"Which habitual posture causes subtle discomfort?",holding:"Notice without forcing change.",tags:["habit","posture","discomfort"],beginnerSafe:!1},{id:"PW-035",domain:a.PHYSICAL,intensity:3,question:"Where do I unconsciously resist stillness or movement?",holding:"Observe without judgment.",tags:["resistance","movement","stillness"],beginnerSafe:!1},{id:"PW-036",domain:a.PHYSICAL,intensity:3,question:"Which energy blockages create subtle tension or fatigue?",holding:"Notice without forcing.",tags:["energy","blockage","tension"],beginnerSafe:!1},{id:"PW-037",domain:a.PHYSICAL,intensity:3,question:"Where do I unconsciously resist nourishing my body?",holding:"Observe gently.",tags:["resistance","nourishment"],beginnerSafe:!1},{id:"PW-038",domain:a.PHYSICAL,intensity:3,question:"Which subtle sensation evokes tension or discomfort?",holding:"Notice without reacting.",tags:["sensation","tension"],beginnerSafe:!1},{id:"PW-039",domain:a.PHYSICAL,intensity:4,question:"Who am I beyond physical sensations or limits?",holding:"Rest in pure being.",tags:["body","essence"],beginnerSafe:!1},{id:"PW-040",domain:a.PHYSICAL,intensity:4,question:"What remains when all bodily tension dissolves completely?",holding:"Notice spacious awareness.",tags:["tension","awareness"],beginnerSafe:!1},{id:"PW-041",domain:a.PHYSICAL,intensity:4,question:"Who am I without habits, posture, or movement?",holding:"Observe essence naturally.",tags:["identity","essence"],beginnerSafe:!1},{id:"PW-042",domain:a.PHYSICAL,intensity:4,question:"Where is pure vitality without effort or control?",holding:"Rest in effortless awareness.",tags:["energy","vitality"],beginnerSafe:!1},{id:"PW-043",domain:a.PHYSICAL,intensity:4,question:"Who am I beyond bodily experience?",holding:"Notice spacious presence.",tags:["essence","body"],beginnerSafe:!1},{id:"PW-044",domain:a.PHYSICAL,intensity:4,question:"What remains when all energy patterns dissolve completely?",holding:"Rest in pure awareness.",tags:["energy","patterns"],beginnerSafe:!1},{id:"SI-001",domain:a.SHADOW,intensity:1,question:"Which thought or feeling am I noticing without judgment?",holding:"Observe gently without reacting.",tags:["awareness","observation"],beginnerSafe:!0},{id:"SI-002",domain:a.SHADOW,intensity:1,question:"Where in my body do I feel subtle tension or discomfort?",holding:"Notice sensation calmly.",tags:["body","tension"],beginnerSafe:!0},{id:"SI-003",domain:a.SHADOW,intensity:1,question:"Which small habit am I aware of today?",holding:"Observe naturally.",tags:["habit","awareness"],beginnerSafe:!0},{id:"SI-004",domain:a.SHADOW,intensity:1,question:"Where do I feel subtle discomfort in relationships?",holding:"Notice without judgment.",tags:["relationship","discomfort"],beginnerSafe:!0},{id:"SI-005",domain:a.SHADOW,intensity:1,question:"Which emotion feels strongest in this moment?",holding:"Observe honestly without pushing.",tags:["emotion","awareness"],beginnerSafe:!0},{id:"SI-006",domain:a.SHADOW,intensity:1,question:"Where do I feel subtle resistance within myself?",holding:"Notice resistance gently.",tags:["resistance","self"],beginnerSafe:!0},{id:"SI-007",domain:a.SHADOW,intensity:1,question:"Which small discomfort do I tend to ignore?",holding:"Observe without judgment.",tags:["discomfort","awareness"],beginnerSafe:!0},{id:"SI-008",domain:a.SHADOW,intensity:1,question:"Where do I feel subtle tension in my thoughts?",holding:"Notice without reacting.",tags:["tension","thoughts"],beginnerSafe:!0},{id:"SI-009",domain:a.SHADOW,intensity:1,question:"Which minor irritation draws my attention today?",holding:"Observe calmly without judgment.",tags:["irritation","attention"],beginnerSafe:!0},{id:"SI-010",domain:a.SHADOW,intensity:1,question:"Where do I notice subtle patterns in my reactions?",holding:"Observe naturally.",tags:["pattern","reaction"],beginnerSafe:!0},{id:"SI-011",domain:a.SHADOW,intensity:1,question:"Which moment evokes a sense of discomfort gently?",holding:"Notice gently without resistance.",tags:["discomfort","awareness"],beginnerSafe:!0},{id:"SI-012",domain:a.SHADOW,intensity:1,question:"Where in my day do I feel subtle tension in choices?",holding:"Observe without judgment.",tags:["choices","tension"],beginnerSafe:!0},{id:"SI-013",domain:a.SHADOW,intensity:2,question:"Which hidden fear am I noticing?",holding:"Observe fear gently without pushing.",tags:["fear","awareness"],beginnerSafe:!0},{id:"SI-014",domain:a.SHADOW,intensity:2,question:"Where do I notice subtle self-judgment?",holding:"Observe honestly without criticism.",tags:["self-judgment","awareness"],beginnerSafe:!0},{id:"SI-015",domain:a.SHADOW,intensity:2,question:"Which behavior patterns limit my authentic expression?",holding:"Notice without judgment.",tags:["behavior","authenticity"],beginnerSafe:!0},{id:"SI-016",domain:a.SHADOW,intensity:2,question:"Where do I unconsciously project onto others?",holding:"Observe gently without reacting.",tags:["projection","awareness"],beginnerSafe:!0},{id:"SI-017",domain:a.SHADOW,intensity:2,question:"Which fear subtly influences my decisions?",holding:"Notice without judgment.",tags:["fear","decisions"],beginnerSafe:!0},{id:"SI-018",domain:a.SHADOW,intensity:2,question:"Where do I resist uncomfortable emotions?",holding:"Observe resistance calmly.",tags:["resistance","emotions"],beginnerSafe:!0},{id:"SI-019",domain:a.SHADOW,intensity:2,question:"Which habit subtly avoids self-awareness?",holding:"Notice honestly without judgment.",tags:["habit","self-awareness"],beginnerSafe:!0},{id:"SI-020",domain:a.SHADOW,intensity:2,question:"Where do I unconsciously withhold from myself?",holding:"Observe without judgment.",tags:["withholding","self"],beginnerSafe:!0},{id:"SI-021",domain:a.SHADOW,intensity:2,question:"Which hidden need influences my choices today?",holding:"Observe gently without attachment.",tags:["need","choices"],beginnerSafe:!0},{id:"SI-022",domain:a.SHADOW,intensity:2,question:"Where do I resist feeling subtle discomfort in others?",holding:"Observe without reaction.",tags:["discomfort","others"],beginnerSafe:!0},{id:"SI-023",domain:a.SHADOW,intensity:2,question:"Which minor irritations reveal hidden shadows?",holding:"Notice honestly without judgment.",tags:["irritation","shadow"],beginnerSafe:!0},{id:"SI-024",domain:a.SHADOW,intensity:2,question:"Where do I overidentify with a specific pattern?",holding:"Observe pattern without judgment.",tags:["pattern","overidentification"],beginnerSafe:!0},{id:"SI-025",domain:a.SHADOW,intensity:2,question:"Which subtle fear keeps me from authentic engagement?",holding:"Notice gently without pushing.",tags:["fear","authenticity"],beginnerSafe:!0},{id:"SI-026",domain:a.SHADOW,intensity:2,question:"Where do I unconsciously avoid responsibility?",holding:"Observe without judgment.",tags:["avoidance","responsibility"],beginnerSafe:!0},{id:"SI-027",domain:a.SHADOW,intensity:3,question:"Which recurring shadow am I unwilling to face?",holding:"Observe honestly without resistance.",tags:["shadow","recurring"],beginnerSafe:!1},{id:"SI-028",domain:a.SHADOW,intensity:3,question:"Where do I project discomfort onto others unconsciously?",holding:"Notice without judgment.",tags:["projection","unconscious"],beginnerSafe:!1},{id:"SI-029",domain:a.SHADOW,intensity:3,question:"Which fear limits my authentic expression repeatedly?",holding:"Observe fear calmly.",tags:["fear","expression"],beginnerSafe:!1},{id:"SI-030",domain:a.SHADOW,intensity:3,question:"Where do I resist feeling uncomfortable truths about myself?",holding:"Notice resistance gently.",tags:["resistance","truth"],beginnerSafe:!1},{id:"SI-031",domain:a.SHADOW,intensity:3,question:"Which attachment keeps me from self-acceptance?",holding:"Observe without judgment.",tags:["attachment","self-acceptance"],beginnerSafe:!1},{id:"SI-032",domain:a.SHADOW,intensity:3,question:"Where do I unconsciously deny parts of myself?",holding:"Notice gently without judgment.",tags:["denial","self"],beginnerSafe:!1},{id:"SI-033",domain:a.SHADOW,intensity:3,question:"Which recurring internal critic limits my growth?",holding:"Observe honestly without resistance.",tags:["critic","internal"],beginnerSafe:!1},{id:"SI-034",domain:a.SHADOW,intensity:3,question:"Where do I resist acknowledging uncomfortable emotions?",holding:"Observe gently without avoiding.",tags:["resistance","emotions"],beginnerSafe:!1},{id:"SI-035",domain:a.SHADOW,intensity:3,question:"Which fear or shame subtly controls my actions?",holding:"Notice without judgment.",tags:["fear","shame"],beginnerSafe:!1},{id:"SI-036",domain:a.SHADOW,intensity:3,question:"Where do I unconsciously repeat self-sabotaging patterns?",holding:"Observe honestly without judgment.",tags:["patterns","self-sabotage"],beginnerSafe:!1},{id:"SI-037",domain:a.SHADOW,intensity:3,question:"Which aspect of my shadow resists integration?",holding:"Notice without forcing.",tags:["shadow","integration"],beginnerSafe:!1},{id:"SI-038",domain:a.SHADOW,intensity:3,question:"Where do I unconsciously avoid self-responsibility?",holding:"Observe without judgment.",tags:["avoidance","responsibility"],beginnerSafe:!1},{id:"SI-039",domain:a.SHADOW,intensity:4,question:"Who am I beyond fear, shame, and resistance?",holding:"Rest in pure being.",tags:["essence","freedom"],beginnerSafe:!1},{id:"SI-040",domain:a.SHADOW,intensity:4,question:"What remains when all shadow patterns dissolve completely?",holding:"Notice spacious awareness.",tags:["patterns","awareness"],beginnerSafe:!1},{id:"SI-041",domain:a.SHADOW,intensity:4,question:"Who am I beyond self-criticism and judgment?",holding:"Observe essence naturally.",tags:["essence","judgment"],beginnerSafe:!1},{id:"SI-042",domain:a.SHADOW,intensity:4,question:"Where is pure acceptance beyond resistance?",holding:"Rest in effortless awareness.",tags:["acceptance","resistance"],beginnerSafe:!1},{id:"SI-043",domain:a.SHADOW,intensity:4,question:"Who am I beyond hidden fears and avoidance?",holding:"Notice spacious presence.",tags:["essence","fear","avoidance"],beginnerSafe:!1},{id:"SI-044",domain:a.SHADOW,intensity:4,question:"What remains when all aspects of my shadow integrate completely?",holding:"Rest in pure awareness.",tags:["integration","awareness"],beginnerSafe:!1},{id:"WI-001",domain:a.WISDOM,intensity:1,question:"Which small insight did I notice today?",holding:"Observe without analysis.",tags:["insight","awareness"],beginnerSafe:!0},{id:"WI-002",domain:a.WISDOM,intensity:1,question:"Where do I feel clarity in my thoughts?",holding:"Notice gently without effort.",tags:["clarity","thoughts"],beginnerSafe:!0},{id:"WI-003",domain:a.WISDOM,intensity:1,question:"Which observation feels meaningful yet simple?",holding:"Notice without judgment.",tags:["observation","meaning"],beginnerSafe:!0},{id:"WI-004",domain:a.WISDOM,intensity:1,question:"Where do I naturally understand a situation deeply?",holding:"Observe insight gently.",tags:["understanding","depth"],beginnerSafe:!0},{id:"WI-005",domain:a.WISDOM,intensity:1,question:"Which small recognition feels enlightening today?",holding:"Notice without analysis.",tags:["recognition","enlightenment"],beginnerSafe:!0},{id:"WI-006",domain:a.WISDOM,intensity:1,question:"Where do I feel naturally reflective?",holding:"Observe reflection gently.",tags:["reflection","awareness"],beginnerSafe:!0},{id:"WI-007",domain:a.WISDOM,intensity:1,question:"Which moment gives me intuitive understanding?",holding:"Notice intuition gently.",tags:["intuition","understanding"],beginnerSafe:!0},{id:"WI-008",domain:a.WISDOM,intensity:1,question:"Where do I feel naturally discerning?",holding:"Observe without judgment.",tags:["discernment","awareness"],beginnerSafe:!0},{id:"WI-009",domain:a.WISDOM,intensity:1,question:"Which small truth feels self-evident today?",holding:"Notice without analysis.",tags:["truth","clarity"],beginnerSafe:!0},{id:"WI-010",domain:a.WISDOM,intensity:1,question:"Where do I feel naturally aware of my thoughts?",holding:"Observe gently without effort.",tags:["awareness","thoughts"],beginnerSafe:!0},{id:"WI-011",domain:a.WISDOM,intensity:1,question:"Which small insight feels applicable today?",holding:"Notice without judgment.",tags:["insight","application"],beginnerSafe:!0},{id:"WI-012",domain:a.WISDOM,intensity:1,question:"Where do I feel naturally curious and observant?",holding:"Observe curiosity gently.",tags:["curiosity","observation"],beginnerSafe:!0},{id:"WI-013",domain:a.WISDOM,intensity:2,question:"Which assumption do I notice guiding my choices?",holding:"Observe without judgment.",tags:["assumption","choices"],beginnerSafe:!0},{id:"WI-014",domain:a.WISDOM,intensity:2,question:"Where do I seek clarity but resist insight?",holding:"Notice resistance gently.",tags:["clarity","resistance"],beginnerSafe:!0},{id:"WI-015",domain:a.WISDOM,intensity:2,question:"Which belief feels limiting today?",holding:"Observe without judgment.",tags:["belief","limitation"],beginnerSafe:!0},{id:"WI-016",domain:a.WISDOM,intensity:2,question:"Where do I resist seeing deeper truth?",holding:"Observe gently without pushing.",tags:["resistance","truth"],beginnerSafe:!0},{id:"WI-017",domain:a.WISDOM,intensity:2,question:"Which habitual thought obscures understanding?",holding:"Notice without judgment.",tags:["habit","thought"],beginnerSafe:!0},{id:"WI-018",domain:a.WISDOM,intensity:2,question:"Where do I unconsciously avoid insight about myself?",holding:"Observe honestly.",tags:["avoidance","self-awareness"],beginnerSafe:!0},{id:"WI-019",domain:a.WISDOM,intensity:2,question:"Which subtle fear blocks discernment?",holding:"Notice without judgment.",tags:["fear","discernment"],beginnerSafe:!0},{id:"WI-020",domain:a.WISDOM,intensity:2,question:"Where do I over-intellectualize instead of feeling insight?",holding:"Observe gently without analysis.",tags:["overthinking","insight"],beginnerSafe:!0},{id:"WI-021",domain:a.WISDOM,intensity:2,question:"Which habitual lens shapes my understanding today?",holding:"Observe without judgment.",tags:["lens","habit"],beginnerSafe:!0},{id:"WI-022",domain:a.WISDOM,intensity:2,question:"Where do I resist noticing patterns in my experience?",holding:"Observe gently.",tags:["resistance","patterns"],beginnerSafe:!0},{id:"WI-023",domain:a.WISDOM,intensity:2,question:"Which insight feels difficult to accept?",holding:"Notice without pushing.",tags:["insight","acceptance"],beginnerSafe:!0},{id:"WI-024",domain:a.WISDOM,intensity:2,question:"Where does subtle confusion guide my understanding?",holding:"Observe without judgment.",tags:["confusion","guidance"],beginnerSafe:!0},{id:"WI-025",domain:a.WISDOM,intensity:2,question:"Which habitual preference blocks deeper insight?",holding:"Notice gently.",tags:["habit","preference","insight"],beginnerSafe:!0},{id:"WI-026",domain:a.WISDOM,intensity:2,question:"Where do I unconsciously resist seeing the bigger picture?",holding:"Observe calmly without judgment.",tags:["resistance","perspective"],beginnerSafe:!0},{id:"WI-027",domain:a.WISDOM,intensity:3,question:"Which belief do I cling to despite clear insight?",holding:"Observe honestly without judgment.",tags:["belief","insight","resistance"],beginnerSafe:!1},{id:"WI-028",domain:a.WISDOM,intensity:3,question:"Where do I resist knowing uncomfortable truths?",holding:"Notice resistance without pushing.",tags:["resistance","truth"],beginnerSafe:!1},{id:"WI-029",domain:a.WISDOM,intensity:3,question:"Which habitual thinking limits my perception today?",holding:"Observe honestly.",tags:["habit","perception"],beginnerSafe:!1},{id:"WI-030",domain:a.WISDOM,intensity:3,question:"Where do I unconsciously avoid understanding myself deeply?",holding:"Observe gently.",tags:["avoidance","self-awareness"],beginnerSafe:!1},{id:"WI-031",domain:a.WISDOM,intensity:3,question:"Which fear blocks my inner clarity?",holding:"Notice fear calmly.",tags:["fear","clarity"],beginnerSafe:!1},{id:"WI-032",domain:a.WISDOM,intensity:3,question:"Where do I resist observing my habitual patterns?",holding:"Observe honestly.",tags:["resistance","pattern"],beginnerSafe:!1},{id:"WI-033",domain:a.WISDOM,intensity:3,question:"Which subtle attachment clouds my insight?",holding:"Notice without judgment.",tags:["attachment","insight"],beginnerSafe:!1},{id:"WI-034",domain:a.WISDOM,intensity:3,question:"Where do I unconsciously resist accepting reality as it is?",holding:"Observe gently.",tags:["resistance","acceptance"],beginnerSafe:!1},{id:"WI-035",domain:a.WISDOM,intensity:3,question:"Which habitual lens prevents me from seeing clearly?",holding:"Observe calmly without judgment.",tags:["habit","lens"],beginnerSafe:!1},{id:"WI-036",domain:a.WISDOM,intensity:3,question:"Where do I resist integrating uncomfortable insights?",holding:"Notice without pushing.",tags:["resistance","integration"],beginnerSafe:!1},{id:"WI-037",domain:a.WISDOM,intensity:3,question:"Which thought patterns obscure my deeper understanding?",holding:"Observe honestly without judgment.",tags:["thought","patterns"],beginnerSafe:!1},{id:"WI-038",domain:a.WISDOM,intensity:3,question:"Where do I unconsciously avoid profound insight?",holding:"Observe gently.",tags:["avoidance","insight"],beginnerSafe:!1},{id:"WI-039",domain:a.WISDOM,intensity:4,question:"Who am I beyond thought, belief, and understanding?",holding:"Rest in pure being.",tags:["essence","awareness"],beginnerSafe:!1},{id:"WI-040",domain:a.WISDOM,intensity:4,question:"What remains when all mental patterns dissolve completely?",holding:"Notice spacious awareness.",tags:["patterns","awareness"],beginnerSafe:!1},{id:"WI-041",domain:a.WISDOM,intensity:4,question:"Who am I beyond analysis and discernment?",holding:"Observe essence naturally.",tags:["essence","clarity"],beginnerSafe:!1},{id:"WI-042",domain:a.WISDOM,intensity:4,question:"Where is pure insight without effort or thinking?",holding:"Rest in effortless awareness.",tags:["insight","being"],beginnerSafe:!1},{id:"WI-043",domain:a.WISDOM,intensity:4,question:"Who am I beyond knowledge and understanding?",holding:"Notice spacious presence.",tags:["essence","knowledge"],beginnerSafe:!1},{id:"WI-044",domain:a.WISDOM,intensity:4,question:"What remains when all mental patterns integrate fully?",holding:"Rest in pure awareness.",tags:["integration","awareness"],beginnerSafe:!1},{id:"JF-001",domain:a.JOY,intensity:1,question:"Which small moment brings me joy today?",holding:"Notice it gently without forcing.",tags:["joy","awareness"],beginnerSafe:!0},{id:"JF-002",domain:a.JOY,intensity:1,question:"Where do I feel content in this present moment?",holding:"Observe without judgment.",tags:["contentment","presence"],beginnerSafe:!0},{id:"JF-003",domain:a.JOY,intensity:1,question:"Which simple activity uplifts my spirit today?",holding:"Notice without effort.",tags:["uplift","activity"],beginnerSafe:!0},{id:"JF-004",domain:a.JOY,intensity:1,question:"Where do I naturally feel light-hearted?",holding:"Observe gently.",tags:["lightness","joy"],beginnerSafe:!0},{id:"JF-005",domain:a.JOY,intensity:1,question:"Which small pleasure do I fully experience?",holding:"Notice it without distraction.",tags:["pleasure","awareness"],beginnerSafe:!0},{id:"JF-006",domain:a.JOY,intensity:1,question:"Where do I feel naturally playful?",holding:"Observe playfulness gently.",tags:["playfulness","presence"],beginnerSafe:!0},{id:"JF-007",domain:a.JOY,intensity:1,question:"Which small accomplishment brings me satisfaction?",holding:"Notice without analysis.",tags:["satisfaction","accomplishment"],beginnerSafe:!0},{id:"JF-008",domain:a.JOY,intensity:1,question:"Where do I feel naturally grateful today?",holding:"Observe gratitude gently.",tags:["gratitude","awareness"],beginnerSafe:!0},{id:"JF-009",domain:a.JOY,intensity:1,question:"Which small connection brings warmth to my heart?",holding:"Notice without judgment.",tags:["connection","warmth"],beginnerSafe:!0},{id:"JF-010",domain:a.JOY,intensity:1,question:"Where do I feel naturally relaxed and joyful?",holding:"Observe gently without forcing.",tags:["relaxation","joy"],beginnerSafe:!0},{id:"JF-011",domain:a.JOY,intensity:1,question:"Which simple act feels meaningful and satisfying?",holding:"Notice naturally.",tags:["meaning","satisfaction"],beginnerSafe:!0},{id:"JF-012",domain:a.JOY,intensity:1,question:"Where in my day do I feel light and unburdened?",holding:"Observe gently without effort.",tags:["lightness","presence"],beginnerSafe:!0},{id:"JF-013",domain:a.JOY,intensity:2,question:"Which desire brings me genuine fulfillment?",holding:"Notice without attachment.",tags:["desire","fulfillment"],beginnerSafe:!0},{id:"JF-014",domain:a.JOY,intensity:2,question:"Where do I unconsciously block my joy?",holding:"Observe without judgment.",tags:["blockage","joy"],beginnerSafe:!0},{id:"JF-015",domain:a.JOY,intensity:2,question:"Which expectation limits my satisfaction?",holding:"Notice gently without forcing change.",tags:["expectation","satisfaction"],beginnerSafe:!0},{id:"JF-016",domain:a.JOY,intensity:2,question:"Where do I resist feeling pleasure fully?",holding:"Observe resistance calmly.",tags:["resistance","pleasure"],beginnerSafe:!0},{id:"JF-017",domain:a.JOY,intensity:2,question:"Which habitual thought dulls my joy?",holding:"Notice honestly without judgment.",tags:["habit","joy"],beginnerSafe:!0},{id:"JF-018",domain:a.JOY,intensity:2,question:"Where do I unconsciously postpone happiness?",holding:"Observe gently.",tags:["postponement","happiness"],beginnerSafe:!0},{id:"JF-019",domain:a.JOY,intensity:2,question:"Which small act could increase my daily joy?",holding:"Notice naturally without pressure.",tags:["action","joy"],beginnerSafe:!0},{id:"JF-020",domain:a.JOY,intensity:2,question:"Where do I unconsciously resist gratitude?",holding:"Observe gently.",tags:["resistance","gratitude"],beginnerSafe:!0},{id:"JF-021",domain:a.JOY,intensity:2,question:"Which connection or interaction lifts my spirit?",holding:"Notice without attachment.",tags:["connection","uplift"],beginnerSafe:!0},{id:"JF-022",domain:a.JOY,intensity:2,question:"Where do I feel tension that reduces enjoyment?",holding:"Observe tension gently.",tags:["tension","enjoyment"],beginnerSafe:!0},{id:"JF-023",domain:a.JOY,intensity:2,question:"Which expectation clouds my perception of joy?",holding:"Notice gently without judgment.",tags:["expectation","perception"],beginnerSafe:!0},{id:"JF-024",domain:a.JOY,intensity:2,question:"Where could I allow myself to fully celebrate today?",holding:"Observe opportunity naturally.",tags:["celebration","joy"],beginnerSafe:!0},{id:"JF-025",domain:a.JOY,intensity:2,question:"Which habitual comparison reduces my fulfillment?",holding:"Notice without judgment.",tags:["comparison","fulfillment"],beginnerSafe:!0},{id:"JF-026",domain:a.JOY,intensity:2,question:"Where do I unconsciously avoid pleasure or happiness?",holding:"Observe gently without judgment.",tags:["avoidance","pleasure"],beginnerSafe:!0},{id:"JF-027",domain:a.JOY,intensity:3,question:"Which fear limits my ability to experience joy fully?",holding:"Observe honestly without judgment.",tags:["fear","joy"],beginnerSafe:!1},{id:"JF-028",domain:a.JOY,intensity:3,question:"Where do I resist celebrating my accomplishments?",holding:"Notice resistance gently.",tags:["resistance","celebration"],beginnerSafe:!1},{id:"JF-029",domain:a.JOY,intensity:3,question:"Which habit dulls my inner fulfillment?",holding:"Observe without judgment.",tags:["habit","fulfillment"],beginnerSafe:!1},{id:"JF-030",domain:a.JOY,intensity:3,question:"Where do I unconsciously avoid gratitude and joy?",holding:"Observe gently without resisting.",tags:["avoidance","gratitude","joy"],beginnerSafe:!1},{id:"JF-031",domain:a.JOY,intensity:3,question:"Which attachment prevents full enjoyment?",holding:"Notice without judgment.",tags:["attachment","enjoyment"],beginnerSafe:!1},{id:"JF-032",domain:a.JOY,intensity:3,question:"Where do I resist feeling contentment deeply?",holding:"Observe gently without effort.",tags:["resistance","contentment"],beginnerSafe:!1},{id:"JF-033",domain:a.JOY,intensity:3,question:"Which fear or shame subtly blocks fulfillment?",holding:"Notice without judgment.",tags:["fear","shame","fulfillment"],beginnerSafe:!1},{id:"JF-034",domain:a.JOY,intensity:3,question:"Where do I unconsciously diminish my happiness?",holding:"Observe honestly without judgment.",tags:["self-sabotage","happiness"],beginnerSafe:!1},{id:"JF-035",domain:a.JOY,intensity:3,question:"Which subtle belief blocks my inner joy?",holding:"Notice gently.",tags:["belief","joy"],beginnerSafe:!1},{id:"JF-036",domain:a.JOY,intensity:3,question:"Where do I resist fully receiving pleasure and fulfillment?",holding:"Observe gently without judgment.",tags:["resistance","pleasure","fulfillment"],beginnerSafe:!1},{id:"JF-037",domain:a.JOY,intensity:3,question:"Which expectation diminishes my enjoyment of life?",holding:"Notice honestly without judgment.",tags:["expectation","enjoyment"],beginnerSafe:!1},{id:"JF-038",domain:a.JOY,intensity:3,question:"Where do I unconsciously resist celebrating myself?",holding:"Observe gently.",tags:["resistance","celebration"],beginnerSafe:!1},{id:"JF-039",domain:a.JOY,intensity:4,question:"Who am I beyond pleasure, fear, and attachment?",holding:"Rest in pure being.",tags:["essence","joy"],beginnerSafe:!1},{id:"JF-040",domain:a.JOY,intensity:4,question:"What remains when all blocks to joy dissolve completely?",holding:"Notice spacious awareness.",tags:["blocks","joy","awareness"],beginnerSafe:!1},{id:"JF-041",domain:a.JOY,intensity:4,question:"Who am I beyond attachment, expectation, and resistance?",holding:"Observe essence naturally.",tags:["essence","freedom"],beginnerSafe:!1},{id:"JF-042",domain:a.JOY,intensity:4,question:"Where is pure fulfillment without effort or desire?",holding:"Rest in effortless awareness.",tags:["fulfillment","being"],beginnerSafe:!1},{id:"JF-043",domain:a.JOY,intensity:4,question:"Who am I beyond seeking pleasure or avoiding discomfort?",holding:"Notice spacious presence.",tags:["essence","joy","detachment"],beginnerSafe:!1},{id:"JF-044",domain:a.JOY,intensity:4,question:"What remains when all joy, fulfillment, and longing integrate completely?",holding:"Rest in pure awareness.",tags:["integration","joy","fulfillment"],beginnerSafe:!1}],z=Object.freeze({INTENSITY_MAP:Object.freeze({beginner:Object.freeze([1,2]),intermediate:Object.freeze([1,2,3]),advanced:Object.freeze([1,2,3,4])}),DEFAULT_LEVEL:"beginner"});class mt{constructor(e=z.DEFAULT_LEVEL){this.userLevel=e,this.todaySelections=[]}getAllowedIntensities(){return z.INTENSITY_MAP[this.userLevel]||z.INTENSITY_MAP[z.DEFAULT_LEVEL]}setUserLevel(e){z.INTENSITY_MAP[e]?this.userLevel=e:(console.warn(`InquiryEngine: Invalid level "${e}". Using "${z.DEFAULT_LEVEL}".`),this.userLevel=z.DEFAULT_LEVEL)}resetDailySelections(){this.todaySelections=[]}getRandomQuestion(e){const t=this.getAllowedIntensities();let i=V.filter(o=>o.domain===e&&t.includes(o.intensity)&&!this.todaySelections.includes(o.id));i.length||(this._resetDomainSelections(e),i=V.filter(o=>o.domain===e&&t.includes(o.intensity))),i.length||(i=V.filter(o=>o.domain===e)),i.length||(console.warn(`InquiryEngine: No questions for domain "${e}". Using fallback.`),i=V);const n=i[Math.floor(Math.random()*i.length)];return this.todaySelections.push(n.id),n}generateDailyInquiries(e=null){return(e||this._getUniqueDomains()).map(i=>this.getRandomQuestion(i)).filter(Boolean)}_resetDomainSelections(e){this.todaySelections=this.todaySelections.filter(t=>{const i=V.find(n=>n.id===t);return(i==null?void 0:i.domain)!==e})}_getUniqueDomains(){return[...new Set(V.map(e=>e.domain))]}}const M=class M{constructor(e){this.app=e,this.boosters=[{id:1,title:"5-Minute Dance Party",emoji:"💃",description:"Put on your favorite song and move your body!",duration:"5 min",category:"Movement"},{id:2,title:"Gratitude Snapshot",emoji:"📸",description:"Quickly name 3 things you're grateful for right now.",duration:"3 min",category:"Mindfulness"},{id:3,title:"Power Pose",emoji:"🦸",description:"Stand like a superhero for 2 minutes to boost confidence.",duration:"2 min",category:"Confidence"},{id:4,title:"Mindful Sip",emoji:"🍵",description:"Drink a glass of water or tea, focusing only on the sensation.",duration:"4 min",category:"Calm"},{id:5,title:"Quick Stretch",emoji:"🤸",description:"Gently stretch your arms, neck, and back for 3 minutes.",duration:"3 min",category:"Body"},{id:6,title:"Listen to One Song",emoji:"🎶",description:"Listen to one favorite song without any distractions.",duration:"4 min",category:"Joy"}],this.boostersLoaded=!1,this.currentBooster=this.getRandomBooster(),this.currentQuote=null,this.currentAffirmation=null,this.currentInquiry=null,this.affirmations=de,this.inquiryEngine=new mt("beginner"),this._lastTracked=0,this._cachedElements={},this.loadBoosters()}async loadBoosters(){try{const e=await fetch("./src/Features/Data/HappinessBoostersList.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();this.boosters=t.boosters,this.boostersLoaded=!0;const i=this._getElement("happiness-tab");i&&!i.classList.contains("hidden")&&this.render()}catch(e){console.error("Failed to load happiness boosters:",e),this.boostersLoaded=!0}}_getElement(e){return(!this._cachedElements[e]||!document.getElementById(e))&&(this._cachedElements[e]=document.getElementById(e)),this._cachedElements[e]}_getDayOfYear(){const e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((e-t)/864e5)}getDailyBooster(){return this.boosters[this._getDayOfYear()%this.boosters.length]}getRandomBooster(){return this.app.randomFrom(this.boosters)}getDailyAffirmation(){var i;const e=(i=this.affirmations)==null?void 0:i.general_positive_affirmations;if(!(e!=null&&e.length))return"You are doing great.";const t=e[this._getDayOfYear()%e.length];return typeof t=="string"?t:t.text}getRandomAffirmation(){const e=Object.values(this.affirmations||{}).flat().filter(Boolean);if(!e.length)return"You are capable of amazing things.";const t=this.app.randomFrom(e);return(t==null?void 0:t.text)||t||"You are capable of amazing things."}getRandomInquiry(){const e=this.inquiryEngine._getUniqueDomains(),t=e[Math.floor(Math.random()*e.length)];return this.inquiryEngine.getRandomQuestion(t)}getRandomQuote(){var e;return((e=window.QuotesData)==null?void 0:e.getRandomQuote())||{text:"Stay positive!",author:"Unknown"}}trackView(){const e=Date.now();if(this._lastTracked&&e-this._lastTracked<M.DEBOUNCE_MS)return this.getTodayViewCount();this._lastTracked=e;const t=new Date().toDateString();let i=this._getStorageData(t);if(i.count+=1,localStorage.setItem("daily_booster_views",JSON.stringify(i)),this.app.gamification){const n=this.app.gamification;n.progressQuest("daily","daily_booster",1),n.progressQuest("weekly","happiness_boosters_20",1),n.progressQuest("monthly","monthly_happiness_100",1)}return i.count}getTodayViewCount(){return this._getStorageData(new Date().toDateString()).count}_getStorageData(e){try{const t=localStorage.getItem("daily_booster_views");if(t){const i=JSON.parse(t);if(i.date===e)return i}}catch(t){console.error("Failed to parse storage data:",t)}return{date:e,count:0}}updateQuestDisplay(){const e=this.getTodayViewCount(),t=document.getElementById("happiness-quest-badge");if(t){const i=e>=M.QUEST_TARGET;t.style.cssText=`display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${i?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);"}`;const n=document.getElementById("happiness-quest-count");n&&(n.textContent=e)}this._toggleQuestCompleteBanner(e)}_toggleQuestCompleteBanner(e){const t="happiness-quest-complete";let i=document.getElementById(t);if(e>=M.QUEST_TARGET&&!i){i=document.createElement("div"),i.id=t,i.style.cssText="margin-bottom:2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);",i.innerHTML=`<p class="text-center" style="color:#22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide-icon'><path d='M18 6 7 17l-5-5'/><path d='m22 10-7.5 7.5L13 16'/></svg> Daily quest complete! Keep exploring if you'd like!</p>`;const n=document.querySelector("#happiness-tab .universal-content");n==null||n.insertBefore(i,n.querySelector("main"))}else e<M.QUEST_TARGET&&i&&i.remove()}_flipCard(e,t){const i=this._getElement(e);if(!i)return;const n=i.querySelector(".flip-card-inner"),o=i.querySelector(".flip-card-back");o.innerHTML=t;const r=n.style.transform.match(/-?\d+\.?\d*/),l=r?parseFloat(r[0]):0;n.style.transform=`rotateY(${l+M.ROTATION_DEG}deg)`;const d=()=>{n.removeEventListener("transitionend",d),i.querySelector(".flip-card-front").innerHTML=t};n.addEventListener("transitionend",d)}_refreshContent(e,t,i,n,o,r){this[`current${e}`]=t.call(this);const l=this.trackView(),d=r.call(this,this[`current${e}`],n,o);if(this._flipCard(i,d),this.updateQuestDisplay(),this.app.gamification&&this.app.gamification.incrementHappinessViews(),this.app.showToast){const u=l>=M.QUEST_TARGET?`Quest complete! You've viewed ${M.QUEST_TARGET} items today!`:`New ${o.toLowerCase()} revealed! (${l}/${M.QUEST_TARGET})`;this.app.showToast(u,"success")}}refreshBooster(){this._refreshContent("Booster",this.getRandomBooster,"booster-card","booster","Booster",this._formatBooster)}refreshQuote(){this._refreshContent("Quote",this.getRandomQuote,"quote-card","quote","Quote",this._formatQuote)}refreshAffirmation(){this._refreshContent("Affirmation",this.getRandomAffirmation,"affirm-card","affirmation","Affirmation",this._formatAffirmation)}refreshInquiry(){this._refreshContent("Inquiry",this.getRandomInquiry,"inquiry-card","inquiry","Inquiry",this._formatInquiry)}_formatBooster(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> A Quick Happiness Booster</h2>
      </div>
      <div class="text-center">
        <h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${e.title}</h3>
        <p class="mt-2 text-lg">${e.description}</p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>${e.duration}</span> • <span>${e.category}</span> • <span>${e.emoji}</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshBooster()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatQuote(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Inspirational Quote</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${e.text}"
      </p>
      <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
        - ${e.author}
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshQuote()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatAffirmation(e){return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Positive Affirmation</h2>
      </div>
      <p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
        "${e}"
      </p>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshAffirmation()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}_formatInquiry(e){const t=M.INTENSITY_EMOJIS[e.intensity]||"💭";return`
      <div class="flex items-center" style="margin-bottom: 1rem;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
        <h2 class="text-2xl font-bold" style="color: var(--neuro-text);"> Self Inquiry</h2>
      </div>
      <div class="text-center">
        <div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
          <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
            ${e.domain}
          </span>
        </div>
        <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
          ${e.question}
        </p>
        <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
          ${e.holding}
        </p>
        <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
          <span>Level ${e.intensity}</span> • <span>${t} Self-Inquiry</span>
        </div>
      </div>
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button onclick="window.featuresManager.engines.happiness.refreshInquiry()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
      </div>`}render(){const e=this._getElement("happiness-tab");if(!e)return;this.currentBooster=this.getRandomBooster(),this.currentQuote=this.getRandomQuote(),this.currentAffirmation=this.getRandomAffirmation(),this.currentInquiry=this.getRandomInquiry();const t=this.getTodayViewCount();e.innerHTML=`
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavHappiness.webp');
                     --header-title:'';
                     --header-tag:'Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry'">
        <h1>Happiness and Motivation</h1>
        <h3>Your daily dose of Inspirational Quotes with Happiness Boosters, Positive-Affirmations, and Self-Inquiry</h3>
        <span class="header-sub"></span>
      </header>

      <div class="flex items-center justify-between" style="margin-bottom: 2rem; padding: 1rem; background: rgba(102, 126, 234, 0.05); border-radius: 8px;">
        <span style="color: var(--neuro-text); font-weight: 600;">Daily Quest Progress</span>
        <span id="happiness-quest-badge" style="display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${t>=M.QUEST_TARGET?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(102,126,234,0.15);color:var(--neuro-accent);border:1px solid rgba(102,126,234,0.3);"}"><span id="happiness-quest-count">${t}</span><span>/ ${M.QUEST_TARGET} Quest</span></span>
      </div>

      ${t>=M.QUEST_TARGET?`
        <div id="happiness-quest-complete" style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
          <p class="text-center" style="color: #22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg> Daily quest complete! Keep exploring if you'd like!</p>
        </div>
      `:""}

      <main class="space-y-6">
        ${this._renderCard("affirm-card","affirmation","Positive Affirmation",`<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentAffirmation}"
          </p>`,"refreshAffirmation")}

        ${this._renderCard("quote-card","quote","Inspirational Quote",`<p class="text-2xl font-semibold text-center" style="color: var(--neuro-accent);">
            "${this.currentQuote.text}"
          </p>
          <p class="mt-3 text-center text-lg" style="color: var(--neuro-text);">
            - ${this.currentQuote.author}
          </p>`,"refreshQuote")}

        ${this._renderCard("booster-card","booster","A Quick Happiness Booster",`<h3 class="text-2xl font-bold" style="color: var(--neuro-accent);">${this.currentBooster.title}</h3>
          <p class="mt-2 text-lg">${this.currentBooster.description}</p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>${this.currentBooster.duration}</span> • <span>${this.currentBooster.category}</span>
          </div>`,"refreshBooster")}

        ${this._renderCard("inquiry-card","inquiry","Self Inquiry",`<div style="margin-bottom: 1rem; padding: 0.5rem; background: var(--neuro-bg-secondary); border-radius: 8px; display: inline-block;">
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--neuro-accent);">
              ${this.currentInquiry.domain}
            </span>
          </div>
          <p class="text-2xl font-semibold" style="color: var(--neuro-accent); line-height: 1.4; margin-bottom: 1rem;">
            ${this.currentInquiry.question}
          </p>
          <p class="mt-2 text-lg" style="font-style: italic; color: var(--neuro-text-secondary);">
            ${this.currentInquiry.holding}
          </p>
          <div class="mt-4 text-sm" style="color: var(--neuro-text-light);">
            <span>Level ${this.currentInquiry.intensity}</span> • <span>Self-Inquiry</span>
          </div>`,"refreshInquiry")}
        ${this.buildCommunityCTA()}
      </main>
    </div>
  </div>`}buildCommunityCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Mingle & Practice, Chat and Be one with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>
    `}_renderCard(e,t,i,n,o){const l={affirmation:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',quote:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></svg>',booster:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',inquiry:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="margin-right:0.5rem;flex-shrink:0;"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>'}[t]||"";return`
      <div class="neuro-card flip-card" id="${e}">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="flex items-center" style="margin-bottom: 1rem;">
              ${l}
              <h2 class="text-2xl font-bold" style="color: var(--neuro-text);">${i}</h2>
            </div>
            <div class="text-center">
              ${n}
            </div>
            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
              <button onclick="window.featuresManager.engines.happiness.${o}()" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Refresh</button>
            </div>
          </div>
          <div class="flip-card-back"></div>
        </div>
      </div>`}};_(M,"QUEST_TARGET",5),_(M,"DEBOUNCE_MS",1e3),_(M,"ROTATION_DEG",360),_(M,"INTENSITY_EMOJIS",{1:"🌱",2:"🌿",3:"🌳",4:"🔥"});let se=M;typeof window<"u"&&(window.HappinessEngine=se);const T='xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"',he={user:`<svg ${T}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,aries:`<svg ${T}><path d="M12 20V10c0-3.31-2.69-6-6-6"/><path d="M12 20V10c0-3.31 2.69-6 6-6"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg>`,taurus:`<svg ${T}><circle cx="12" cy="14" r="7"/><path d="M5 9C5 6 7 3 12 3s7 3 7 6"/><path d="M9 9H4"/><path d="M20 9h-5"/></svg>`,gemini:`<svg ${T}><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,cancer:`<svg ${T}><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M4 8c0-2 1-4 4-4"/><path d="M20 16c0 2-1 4-4 4"/></svg>`,leo:`<svg ${T}><circle cx="8" cy="8" r="4"/><path d="M12 8h4a4 4 0 0 1 0 8h-1"/><path d="M15 16v4"/></svg>`,virgo:`<svg ${T}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4V8a6 6 0 0 0-12 0"/><path d="M15 16v4"/><path d="M17 16l1.5 4"/></svg>`,libra:`<svg ${T}><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 16a6 6 0 0 0 12 0"/></svg>`,scorpio:`<svg ${T}><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="18" y1="4" x2="18" y2="12"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4"/><polyline points="15 9 18 12 21 9"/></svg>`,sagittarius:`<svg ${T}><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/><line x1="5" y1="19" x2="12" y2="12"/></svg>`,capricorn:`<svg ${T}><path d="M6 20V8a4 4 0 0 1 8 0v4a4 4 0 0 0 4 4h0"/><path d="M18 16l2 2-2 2"/></svg>`,aquarius:`<svg ${T}><path d="M3 10c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/><path d="M3 16c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/></svg>`,pisces:`<svg ${T}><line x1="12" y1="4" x2="12" y2="20"/><path d="M4 8c2 2 4 4 8 4s6-2 8-4"/><path d="M4 16c2-2 4-4 8-4s6 2 8 4"/></svg>`,meditation:`<svg ${T}><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M6 17c0-2 2-4 6-4s6 2 6 4"/></svg>`,moon:`<svg ${T}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,sun:`<svg ${T}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,star:`<svg ${T}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,crystal:`<svg ${T}><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></svg>`,butterfly:`<svg ${T}><path d="M12 22V12"/><path d="M12 12C12 12 8 9 4 10c-3 1-3 5 0 6 2 1 5 0 8-4z"/><path d="M12 12C12 12 16 9 20 10c3 1 3 5 0 6-2 1-5 0-8-4z"/><circle cx="12" cy="5" r="2"/></svg>`,leaf:`<svg ${T}><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>`,flower:`<svg ${T}><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>`,om:`<svg ${T}><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 0 8 0"/><circle cx="12" cy="8" r="1"/></svg>`,clover:`<svg ${T}><path d="M12 12c-2-2.5-4-3-6-2s-3 4-1 6 5 2 7-4z"/><path d="M12 12c2-2.5 4-3 6-2s3 4 1 6-5 2-7-4z"/><path d="M12 12c-2.5-2-3-4-2-6s4-3 6-1-2 5-4 7z"/><path d="M12 12c2.5-2 3-4 2-6s-4-3-6-1 2 5 4 7z"/><line x1="12" y1="12" x2="12" y2="22"/></svg>`},pt={"👤":"user","♈️":"aries","♉️":"taurus","♊️":"gemini","♋️":"cancer","♌️":"leo","♍️":"virgo","♎️":"libra","♏️":"scorpio","♐️":"sagittarius","♑️":"capricorn","♒️":"aquarius","♓️":"pisces","🧘‍♀️":"meditation","🌙":"moon","☀️":"sun","🌟":"star","🔮":"crystal","🦋":"butterfly","🌿":"leaf","🌸":"flower","🕉️":"om","🍀":"clover"};function qe(s){return he[s]||he[pt[s]]||he.user}const $={ANIMATION_DELAY:10,SHOW_DURATION:3e3,FADE_OUT_DURATION:400,QUEUE_SPACING:200,CONTAINER_ID:"toast-container"},ft={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'};class yt{constructor(){this.queue=[],this.isShowing=!1,this.currentToast=null,this.containerCache=null,this.observerSetup=!1}async show(e,t="info",i=null,n={}){const{duration:o=$.SHOW_DURATION,dismissible:r=!1,icon:l=ft[t]}=n;i&&this.queue.some(d=>d.key===i)||(this.queue.push({msg:e,type:t,key:i,duration:o,dismissible:r,icon:l}),this.isShowing||await this.processQueue())}async processQueue(){var n;if(!this.queue.length){this.isShowing=!1;return}this.isShowing=!0;const e=this.queue.shift(),t=this.getContainer();if(!t){console.error(`Toast container "#${$.CONTAINER_ID}" not found in DOM`),this.isShowing=!1,this.queue=[];return}(n=this.currentToast)!=null&&n.parentNode&&this.currentToast.remove();const i=this.createToastElement(e);this.currentToast=i,t.appendChild(i),setTimeout(()=>i.classList.add("show"),$.ANIMATION_DELAY),await this.waitForToast(i,e.duration),await this.sleep($.QUEUE_SPACING),await this.processQueue()}createToastElement(e){const t=document.createElement("div");if(t.className=`toast ${e.type}`,t.setAttribute("role","alert"),t.setAttribute("aria-live","polite"),e.icon){const n=document.createElement("span");n.className="toast-icon",n.innerHTML=e.icon,t.appendChild(n)}const i=document.createElement("span");if(i.className="toast-message",i.textContent=e.msg,t.appendChild(i),e.dismissible){const n=document.createElement("button");n.className="toast-dismiss",n.textContent="×",n.setAttribute("aria-label","Dismiss notification"),n.addEventListener("click",()=>{this.dismissToast(t)}),t.appendChild(n)}return t}waitForToast(e,t){return new Promise(i=>{const n=setTimeout(()=>{this.hideToast(e,i)},t);e._timeoutId=n})}hideToast(e,t){e.classList.remove("show"),setTimeout(()=>{e.parentNode&&e.remove(),this.currentToast===e&&(this.currentToast=null),t&&t()},$.FADE_OUT_DURATION)}dismissToast(e){e._timeoutId&&clearTimeout(e._timeoutId),this.hideToast(e)}getContainer(){return this.containerCache&&document.contains(this.containerCache)?this.containerCache:(this.containerCache=document.getElementById($.CONTAINER_ID),this.containerCache||(console.warn(`Toast container "#${$.CONTAINER_ID}" not found. Creating one.`),this.createContainer()),this.containerCache)}createContainer(){const e=document.createElement("div");e.id=$.CONTAINER_ID,e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),document.body.appendChild(e),this.containerCache=e}clear(){var e;this.queue=[],(e=this.currentToast)!=null&&e.parentNode&&(this.currentToast._timeoutId&&clearTimeout(this.currentToast._timeoutId),this.hideToast(this.currentToast)),this.isShowing=!1}sleep(e){return new Promise(t=>setTimeout(t,e))}getQueueLength(){return this.queue.length}isActive(){return this.isShowing}}let ge=null;function K(){return ge||(ge=new yt),ge}const Q=(s,e="info",t=null,i={})=>K().show(s,e,t,i),bt=()=>{K().clear()},Qt=()=>K().getQueueLength(),Kt=()=>K().isActive();typeof window<"u"&&import.meta.url.includes("localhost")&&(window.__toast={show:Q,clear:bt,getQueue:()=>K(),config:$});function E(s){const e=document.createElement("div");return e.textContent=String(s??""),e.innerHTML}const vt={set:(s,e)=>{try{localStorage.setItem(s,e)}catch{}},get:s=>{try{return localStorage.getItem(s)}catch{return null}}};function me(s,e=null){const t=document.createElement("div");t.className="modal-overlay",t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.innerHTML=s,document.body.appendChild(t);const i=document.activeElement;let n=null;const o=()=>{t.style.opacity="0",document.removeEventListener("keydown",n),setTimeout(()=>{t.remove(),i==null||i.focus(),e==null||e()},200)};return n=r=>{r.key==="Escape"&&o()},document.addEventListener("keydown",n),t.addEventListener("click",r=>{r.target===t&&o()}),setTimeout(()=>{const r=t.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');r==null||r.focus()},50),{overlay:t,cleanup:o}}class ae{static showConfirm(e,t,i={}){const{title:n="Confirm Action",confirmText:o="Confirm",cancelText:r="Cancel",isDanger:l=!1,icon:d='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'}=i,c=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${d}</div>
          <h3 class="modal-title" id="modal-title">${E(n)}</h3>
          <p class="modal-message">${E(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${E(r)}</button>
          <button type="button" class="btn btn-primary modal-confirm ${l?"modal-btn-danger":""}">${E(o)}</button>
        </div>
      </div>`,{overlay:u,cleanup:h}=me(c);u.setAttribute("aria-labelledby","modal-title"),u.querySelector(".modal-cancel").addEventListener("click",h),u.querySelector(".modal-confirm").addEventListener("click",()=>{h(),t==null||t()})}static showPrompt(e,t,i,n={}){const{title:o="Edit Entry",confirmText:r="Save",cancelText:l="Cancel",placeholder:d="Enter text...",icon:c='<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',multiline:u=!1}=n,h="modal-prompt-input",p=u?`<textarea id="${h}" class="form-input" rows="4" placeholder="${E(d)}" aria-label="${E(d)}">${E(t||"")}</textarea>`:`<input id="${h}" type="text" class="form-input" placeholder="${E(d)}" aria-label="${E(d)}" value="${E(t||"")}">`,m=`
      <div class="neuro-modal" role="document">
        <div class="modal-header">
          <div class="modal-icon icon-small" aria-hidden="true">${c}</div>
          <h3 class="modal-title" id="modal-title">${E(o)}</h3>
          <p class="modal-message">${E(e)}</p>
        </div>
        <div class="modal-input-wrapper">${p}</div>
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${E(l)}</button>
          <button type="button" class="btn btn-primary modal-confirm">${E(r)}</button>
        </div>
      </div>`,{overlay:g,cleanup:y}=me(m);g.setAttribute("aria-labelledby","modal-title");const b=g.querySelector("input, textarea"),S=()=>{const k=b.value.trim();k&&(y(),i==null||i(k))};setTimeout(()=>{var k;b.focus(),(k=b.select)==null||k.call(b)},100),g.querySelector(".modal-cancel").addEventListener("click",y),g.querySelector(".modal-confirm").addEventListener("click",S),b.addEventListener("keydown",k=>{k.key==="Enter"&&!k.shiftKey&&!u&&(k.preventDefault(),S()),k.key==="Escape"&&y()})}static showAlert(e,t={}){const{title:i="Notice",buttonText:n="OK",type:o="info",icon:r=null}=t,l={info:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/></svg>',success:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',warning:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',error:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'},d=`
      <div class="neuro-modal modal-small" role="document">
        <div class="modal-header">
          <div class="modal-icon" aria-hidden="true">${r||l[o]||l.info}</div>
          <h3 class="modal-title" id="modal-title">${E(i)}</h3>
          <p class="modal-message">${E(e)}</p>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-primary modal-confirm" style="width:100%">${E(n)}</button>
        </div>
      </div>`,{overlay:c,cleanup:u}=me(d);c.setAttribute("aria-labelledby","modal-title"),c.querySelector(".modal-confirm").addEventListener("click",u)}}function Xt(s){var t,i,n,o,r;const e=s.state.currentUser;e.name=(((t=document.getElementById("dropdown-displayname"))==null?void 0:t.value.trim())||"Seeker").slice(0,100),e.email=(((i=document.getElementById("dropdown-email"))==null?void 0:i.value.trim())||"").slice(0,254),e.phone=(((n=document.getElementById("dropdown-phone"))==null?void 0:n.value.trim())||"").slice(0,20),e.birthday=((o=document.getElementById("dropdown-birthday"))==null?void 0:o.value)||"",e.avatarEmoji=((r=document.getElementById("dropdown-emoji"))==null?void 0:r.value)||"",vt.set("pc_user",JSON.stringify(e)),Ge(s),Q("Profile saved ✔","success")}function Ge(s){const e=s.state.currentUser,t=document.getElementById("user-avatar-img"),i=document.getElementById("user-avatar-emoji"),n=document.getElementById("avatar-preview");if(e.avatarFile){if(t&&(t.src=e.avatarFile,t.style.display="block"),i&&(i.style.display="none"),n){n.textContent="";const r=document.createElement("img");r.src=e.avatarFile,r.alt="User avatar",r.width=80,r.height=80,r.style.cssText="width:100%;height:100%;border-radius:50%;object-fit:cover",r.loading="lazy",r.decoding="async",n.appendChild(r)}}else t&&(t.style.display="none"),i&&(i.style.display="block",i.innerHTML=qe(e.avatarEmoji||"user")),n&&(n.innerHTML=qe(e.avatarEmoji||"user"));const o=document.getElementById("user-name");o&&(o.textContent=e.name||"Seeker")}function Zt(s){var i,n;const e=(n=(i=document.getElementById("avatar-upload"))==null?void 0:i.files)==null?void 0:n[0];if(!e)return;if(!e.type.startsWith("image/")){Q("Please upload an image file","error");return}const t=new FileReader;t.onload=o=>{const r=new Image;r.onload=()=>{const l=document.createElement("canvas");l.width=l.height=50,l.getContext("2d").drawImage(r,0,0,50,50),s.state.currentUser.avatarFile=l.toDataURL("image/png"),s.state.currentUser.avatarEmoji="",Ge(s)},r.onerror=()=>Q("Could not load image","error"),r.src=o.target.result},t.onerror=()=>Q("Could not read file","error"),t.readAsDataURL(e)}function ce(s,e,t,i){var l;(l=document.getElementById(`${e}-modal`))==null||l.remove();const n=document.createElement("div");n.id=`${e}-modal`,n.className="modal-overlay",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-labelledby",`${e}-modal-title`),n.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="${e}-modal-title">${E(t)}</h2>
        <button type="button" class="modal-close-btn" aria-label="Close modal">✕</button>
      </div>
      <div class="modal-body">${i}</div>
    </div>`,document.body.appendChild(n);const o=document.activeElement,r=()=>{n.remove(),o==null||o.focus()};return n.querySelector(".modal-close-btn").addEventListener("click",r),n.addEventListener("click",d=>{d.target===n&&r()}),document.addEventListener("keydown",function d(c){c.key==="Escape"&&(r(),document.removeEventListener("keydown",d))}),setTimeout(()=>{var d;(d=n.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))==null||d.focus()},50),n._app=s,n}function ei(s){const e=ce(s,"settings","Settings",wt());It(e,s)}function ti(s){ce(s,"about","About",xt())}function ii(s){const e=ce(s,"contact","Contact us",St());_t(e,s)}function ni(s){const e=ce(s,"billing","Choose your plan",kt(s));Et(e,s)}const wt=()=>`
  <div class="settings-tabs" role="tablist">
    <button type="button" class="tab-btn active" data-tab="general" role="tab" aria-selected="true"  aria-controls="general">General</button>
    <button type="button" class="tab-btn"         data-tab="privacy" role="tab" aria-selected="false" aria-controls="privacy">Privacy</button>
    <button type="button" class="tab-btn"         data-tab="notifs"  role="tab" aria-selected="false" aria-controls="notifs">Notifications</button>
    <button type="button" class="tab-btn"         data-tab="data"    role="tab" aria-selected="false" aria-controls="data">Data</button>
  </div>
  <div id="general" class="tab-pane active" role="tabpanel" aria-labelledby="tab-general">
    <label for="settings-lang">App language</label>
    <select id="settings-lang" class="form-input"><option>English</option></select>
    <label for="settings-theme">Theme</label>
    <select id="settings-theme" class="form-input"><option>Neumorphic Light</option></select>
    <label for="settings-reminder">Daily reminder</label>
    <input id="settings-reminder" type="time" class="form-input" aria-label="Select reminder time">
  </div>
  <div id="privacy" class="tab-pane" role="tabpanel" aria-labelledby="tab-privacy">
    <label><input type="checkbox"> Allow analytics</label>
    <label><input type="checkbox"> Share progress with friends</label>
  </div>
  <div id="notifs" class="tab-pane" role="tabpanel" aria-labelledby="tab-notifs">
    <label><input type="checkbox" checked> Morning quote</label>
    <label><input type="checkbox" checked> Streak reminder</label>
  </div>
  <div id="data" class="tab-pane" role="tabpanel" aria-labelledby="tab-data">
    <p>Download everything we store about you.</p>
    <button type="button" class="btn btn-secondary export-data-btn">Export JSON</button>
  </div>`,xt=()=>`
  <p>Digital Curiosity v1.0<br>
  Built with ❤️ by Aanandoham.<br>
  Licences: MIT (code), CC-BY (images).</p>`,St=()=>`
  <form class="contact-form" novalidate>
    <label for="contact-subject">Subject</label>
    <input id="contact-subject" class="form-input" name="subject" placeholder="Subject" maxlength="150" required>
    <label for="contact-body">Message</label>
    <textarea id="contact-body" class="form-input" name="body" rows="4" placeholder="Your message" maxlength="2000" required></textarea>
    <button type="submit" class="btn btn-primary">Send</button>
  </form>`,kt=s=>`
  <div class="plans-grid">
    ${(s.plans||[]).map(e=>`
      <div class="plan-card ${E(e.id)}">
        <div class="plan-price">${E(e.price)}</div>
        <h3>${E(e.name)}</h3>
        <ul>${(e.features||[]).map(t=>`<li>${E(t)}</li>`).join("")}</ul>
        ${s.state.currentUser.plan===e.id?'<span class="badge badge-success">Current</span>':`<button type="button" class="btn btn-primary select-plan-btn" data-plan="${E(e.id)}">Choose</button>`}
      </div>`).join("")}
  </div>`;function It(s,e){var n;const t=s.querySelectorAll(".tab-btn"),i=s.querySelectorAll(".tab-pane");t.forEach(o=>o.addEventListener("click",()=>{var l;const r=o.dataset.tab;["general","privacy","notifs","data"].includes(r)&&(t.forEach(d=>{d.classList.remove("active"),d.setAttribute("aria-selected","false")}),i.forEach(d=>d.classList.remove("active")),o.classList.add("active"),o.setAttribute("aria-selected","true"),(l=s.querySelector(`#${r}`))==null||l.classList.add("active"))})),(n=s.querySelector(".export-data-btn"))==null||n.addEventListener("click",()=>{var o;(o=e.exportUserData)==null||o.call(e)})}function _t(s,e){var t;(t=s.querySelector(".contact-form"))==null||t.addEventListener("submit",i=>{var n;i.preventDefault(),(n=e.sendContact)==null||n.call(e,i)})}function Et(s,e){s.querySelectorAll(".select-plan-btn").forEach(t=>{t.addEventListener("click",()=>Tt(e,t.dataset.plan))})}const Tt=(s,e)=>{Q(`Plan "${E(e)}" selected – payment integration needed`,"info")},si=(s,e)=>{var i;if(!["general","privacy","notifs","data"].includes(e))return;const t=s.target.closest(".modal-card");t&&(t.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),s.target.classList.add("active"),t.querySelectorAll(".tab-pane").forEach(n=>n.classList.remove("active")),(i=t.querySelector(`#${e}`))==null||i.classList.add("active"))},O=class O{constructor(e){this.app=e,this.cachedEntries=null,this._boundHandler=null}getAllEntries(){const e=this.app.state.data.gratitudeEntries||[],t=e.filter(i=>i.entries&&i.entries.length>0);return t.length!==e.length&&(this.app.state.data.gratitudeEntries=t,this.app.state.saveAppData()),this.cachedEntries=t.sort((i,n)=>new Date(n.timestamp)-new Date(i.timestamp)),this.cachedEntries}getTodayTotal(){return this.app.state.getTodayEntries(O.TYPE).reduce((t,i)=>t+i.entries.length,0)}isDailyQuestComplete(){return this.getTodayTotal()>=O.MAX_ENTRIES}escapeHtml(e){const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return String(e).replace(/[&<>"']/g,i=>t[i])}parseGratitudes(e){return e.split(`
`).map(t=>t.replace(/^\d+\.\s*/,"").trim()).filter(t=>t.length>0)}countCurrentGratitudes(){const e=document.getElementById("gratitude-input");return e?this.parseGratitudes(e.value).length:0}buildCommunityCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin: 0 0 0.75rem; font-size: 1.15rem; text-align:center;">
            Mingle & Practice, Chat and Be one with the Community
          </h3>
        </div>
        <p style="margin: 0 0 1.5rem; font-size: 0.92rem; line-height: 1.6;">
          Deepen your connection with the community. Join live practice rooms, Sync with the Sun and Moon, Learn and Evolve - all in one place.
        </p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button
            onclick="document.activeElement?.blur(); window.app.nav.switchTab('community-hub')"
            class="btn btn-primary"
            style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 100%;white-space:nowrap;"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
        </div>
      </div>
    `}render(){const e=document.getElementById("gratitude-tab");if(!e){console.error("GratitudeEngine: gratitude-tab not found");return}const t=this.getAllEntries(),i=this.getTodayTotal(),n=this.isDailyQuestComplete();e.innerHTML=this._getHTML(t,i,n),this.attachHandlers(),this.updateCounter()}_getHTML(e,t,i){return`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          ${this._getHeaderHTML()}
          
          <div class="space-y-6">
            ${this._getInputCardHTML(t,i)}
            ${this._getHistoryCardHTML(e)}
            ${this.buildCommunityCTA()}
          </div>

        </div>
      </div>
      ${this._getStyles()}
    `}_getHeaderHTML(){return`
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavGratitude.webp');
                     --header-title:'';
                     --header-tag:'Log in your gratitudes, as much as possible, to open-up for abundance'">
        <h1>Gratitude Practice</h1>
        <h3>Log in your gratitudes, as much as possible, to open-up for abundance</h3>
        <span class="header-sub"></span>
      </header>
    `}_getInputCardHTML(e,t){return`
      <div class="card">
        <div class="flex items-center justify-between" style="margin-bottom: 2rem;">
          <h3 class="text-2xl font-bold" style="color: var(--neuro-text);">My Gratitudes for Today</h3>
          <span style="display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;white-space:nowrap;padding:0.35rem 0.85rem;border-radius:9999px;font-size:0.85rem;font-weight:600;line-height:1.4;${t?"background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);":"background:rgba(var(--neuro-accent-rgb,102,126,234),0.15);color:var(--neuro-accent);border:1px solid rgba(var(--neuro-accent-rgb,102,126,234),0.3);"}">
            <span id="today-counter">${e}</span><span>/ ${O.MAX_ENTRIES} Quest</span>
          </span>
        </div>

        ${t?this._getQuestCompleteHTML():""}

        <form id="gratitude-form" style="margin-bottom: 1rem;">
          <textarea 
            id="gratitude-input" 
            class="form-input" 
            rows="8" 
            style="resize: vertical;font-family: monospace;"
            placeholder="Today, I am Grateful for..." 
            required
            aria-label="Gratitude entries"
          >1. </textarea>
          
          <div class="gratitude-action-buttons" style="margin-top: 1rem;">
            <button type="button" id="add-one-more-btn" class="btn btn-secondary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add 1 More
            </button>
            <button type="submit" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light)) !important;color:#fff !important;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
              Save my Gratitudes
            </button>
          </div>
        </form>

        ${this._getInspirationHTML()}
      </div>
    `}_getQuestCompleteHTML(){return`
      <div style="margin-bottom: 2rem;padding:1rem;border-radius:0.5rem;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);">
        <p class="text-center" style="color: #22c55e;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>
          Daily quest complete! Keep going if you'd like!
        </p>
      </div>
    `}_getInspirationHTML(){return`
      <div class="gratitude-inspiration-container">
        <p class="suggestion-label" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Need Inspiration?</p>
        <div class="gratitude-inspiration-grid" id="inspiration-grid">
          ${O.INSPIRATION_PROMPTS.map(e=>`
            <button 
              class="suggestion-btn" 
              data-text="${this.escapeHtml(e)}"
              type="button"
            >
              ${this.escapeHtml(e)}
            </button>
          `).join("")}
        </div>
      </div>
    `}_getHistoryCardHTML(e){return`
      <div class="card calc-expandable-card" id="gratitude-collapsible-card">
        <div class="calc-expandable-header" id="gratitude-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">
            My Gratitudes
          </h3>
        </div>
        <div class="calc-expandable-content">
          ${e.length===0?this._getEmptyStateHTML():this._getEntriesListHTML(e)}
        </div>
      </div>
    `}_getEmptyStateHTML(){return`
      <div class="text-center py-12" style="color: var(--neuro-text-light);">
        <div style="display:flex;justify-content:center;margin-bottom:1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <p>Your gratitude list will appear here</p>
      </div>
    `}_getEntriesListHTML(e){return`
      <div class="space-y-6" id="history-entries">
        ${e.slice(0,O.MAX_HISTORY_DISPLAY).map(i=>this._getEntryHTML(i)).join("")}
      </div>
      ${e.length>O.MAX_HISTORY_DISPLAY?`
        <div class="text-center" style="margin-top: 1.5rem;">
          <p class="text-sm" style="color: var(--neuro-text-light);">
            Showing ${O.MAX_HISTORY_DISPLAY} most recent entries
          </p>
        </div>
      `:""}
    `}_getEntryHTML(e){return`
      <div class="journal-entry" style="background: rgba(102,126,234,0.05); border-radius: 12px; padding: 20px; border-left: 4px solid var(--neuro-success);">
        <div class="text-sm" style="color: var(--neuro-text-light);margin-bottom: 0.75rem;">
          ${new Date(e.timestamp).toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </div>
        <div class="space-y-2">
          ${e.entries.map((n,o)=>this._getEntryItemHTML(n,o,e.timestamp)).join("")}
        </div>
      </div>
    `}_getEntryItemHTML(e,t,i){return`
      <div class="flex items-start gap-2">
        <span class="text-green-400" style="min-width: 20px;">${t+1}.</span>
        <p class="flex-1" style="color: var(--neuro-text);">${this.escapeHtml(e)}</p>
        <div class="flex gap-2" style="color: var(--neuro-text-light);">
          <button 
            data-action="edit-history" 
            data-timestamp="${i}" 
            data-index="${t}" 
            title="Edit" 
            class="hover:text-white"
            type="button"
            aria-label="Edit entry"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg></button>
          <button 
            data-action="delete-history" 
            data-timestamp="${i}" 
            data-index="${t}" 
            title="Delete" 
            class="hover:text-red-400"
            type="button"
            aria-label="Delete entry"
          ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
        </div>
      </div>
    `}_getStyles(){return`
      <style>
        .gratitude-inspiration-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .calc-expandable-header { 
          padding: 24px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
        }
        .calc-expandable-header h3 { 
          margin: 0; 
          font-size: 1.1rem; 
          color: var(--neuro-text); 
        }
        .chevron { 
          font-size: 1.5rem; 
          transition: transform var(--transition-normal); 
          color: var(--neuro-accent); 
        }
        .calc-expandable-card.expanded .chevron { 
          transform: rotate(90deg); 
        }
        .calc-expandable-content { 
          max-height: 0; 
          overflow: hidden; 
          transition: max-height var(--transition-slow); 
        }
        .calc-expandable-card.expanded .calc-expandable-content { 
          max-height: 5000px; 
          padding: 0 24px 24px; 
        }

        .gratitude-action-buttons {
          display: flex;
          gap: 0.75rem;
        }
        .gratitude-action-buttons .btn {
          flex: 1;
        }

        @media (max-width: 768px) {
          .gratitude-inspiration-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .gratitude-action-buttons {
            flex-direction: column;
          }
          .gratitude-action-buttons .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .gratitude-inspiration-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `}attachHandlers(){const e=document.getElementById("gratitude-tab");if(!e)return;this._boundHandler&&e.removeEventListener("click",this._boundHandler),this._boundHandler=n=>this._handleClick(n),e.addEventListener("click",this._boundHandler);const t=document.getElementById("gratitude-form");t==null||t.addEventListener("submit",n=>this.save(n));const i=document.getElementById("gratitude-input");i==null||i.addEventListener("input",()=>this.updateCounter())}_handleClick(e){const t=e.target.closest("[data-action]");if(t){this._handleActionClick(t);return}if(e.target.closest("#add-one-more-btn")){this.addOneMore();return}const i=e.target.closest(".suggestion-btn");if(i){this._handleInspirationClick(i);return}if(e.target.closest("#gratitude-collapsible-header")){this._toggleCollapsible();return}}_handleActionClick(e){const t=e.dataset.action,i=parseInt(e.dataset.index),n=e.dataset.timestamp;switch(t){case"edit-history":this.editHistoryEntry(n,i);break;case"delete-history":this.deleteHistoryEntry(n,i);break}}_handleInspirationClick(e){const t=e.dataset.text,i=document.getElementById("gratitude-input");if(!i)return;const n=this.countCurrentGratitudes(),o=i.value.split(`
`),r=o[o.length-1].trim();r===""||/^\d+\.\s*$/.test(r)?(o[o.length-1]=`${n+1}. ${t}`,i.value=o.join(`
`)):i.value=i.value.trim()+" "+t,i.focus(),this.updateCounter()}_toggleCollapsible(){const e=document.getElementById("gratitude-collapsible-card");e==null||e.classList.toggle("expanded")}addOneMore(){const e=document.getElementById("gratitude-input");if(!e)return;const i=this.countCurrentGratitudes()+1,n=e.value.trim();e.value=n+(n?`
`:"")+`${i}. `,e.focus(),e.setSelectionRange(e.value.length,e.value.length),this.updateCounter()}updateCounter(){const e=document.getElementById("today-counter");if(!e)return;const t=this.countCurrentGratitudes(),i=this.getTodayTotal();e.textContent=i+t}editHistoryEntry(e,t){const i=this.app.state.data.gratitudeEntries.find(o=>o.timestamp===e);if(!i)return;const n=i.entries[t];ae.showPrompt("Edit your gratitude entry:",n,o=>{i.entries[t]=o,this.app.state.saveAppData(),this.cachedEntries=null,this.render()},{title:"Edit Gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',placeholder:"I am grateful for..."})}deleteHistoryEntry(e,t){ae.showConfirm("Are you sure you want to delete this gratitude entry? This action cannot be undone.",()=>{const i=this.app.state.data.gratitudeEntries.find(n=>n.timestamp===e);i&&(i.entries.splice(t,1),i.entries.length===0&&(this.app.state.data.gratitudeEntries=this.app.state.data.gratitudeEntries.filter(n=>n.timestamp!==e)),this.app.state.saveAppData(),this.cachedEntries=null,this.render())},{title:"Delete Gratitude",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',confirmText:"Delete",isDanger:!0})}save(e){e.preventDefault();const t=document.getElementById("gratitude-input"),i=this.parseGratitudes(t.value);if(i.length===0){this.app.showToast("Please write at least one gratitude","warning");return}this.app.state.addEntry(O.TYPE,{entries:i});const n=i.length>1?"s":"";this.app.showToast(`${i.length} gratitude${n} saved!`,"success"),t.value="1. ",this.cachedEntries=null,this.render()}destroy(){const e=document.getElementById("gratitude-tab");this._boundHandler&&e&&(e.removeEventListener("click",this._boundHandler),this._boundHandler=null),this.cachedEntries=null}};_(O,"TYPE","gratitude"),_(O,"MAX_ENTRIES",10),_(O,"MAX_HISTORY_DISPLAY",30),_(O,"INSPIRATION_PROMPTS",["A person who made you smile","A comfortable place you enjoy","Something in nature","A skill or talent you have","A recent act of kindness","A small win you had today"]);let oe=O;typeof window<"u"&&(window.GratitudeEngine=oe);function ie(s){return String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ct=Object.freeze({DEFAULT_QUOTES:Object.freeze([{text:"The quieter you become, the more you are able to hear",author:"Rumi"},{text:"Be the change you wish to see in the world",author:"Gandhi"},{text:"Peace comes from within. Do not seek it without",author:"Buddha"}])});class Mt{constructor(e){this.app=e,this.quotes=Ct.DEFAULT_QUOTES}getDailyQuote(){const e=this._getDayOfYear();return this.quotes[e%this.quotes.length]}_getDayOfYear(){const e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((e-t)/864e5)}render(){const e=document.getElementById("quotes-tab");if(!e)return;const t=this.getDailyQuote();e.innerHTML=`
      <div class="min-h-screen bg-gray-900 p-6">
        <div class="max-w-7xl mx-auto">

          <h2 class="text-4xl font-bold text-white" style="margin-bottom:1rem;">Wisdom &amp; Quotes</h2>
          <p class="text-gray-400" style="margin-bottom:2rem;">Inspiration from spiritual teachers</p>

          <!-- Featured Daily Quote -->
          <div class="bg-gradient-to-r from-purple-900 to-blue-900 rounded-3xl p-12 text-center border border-purple-500/30" style="margin-bottom:3rem;">
            <p class="text-purple-200 text-sm uppercase tracking-wider" style="margin-bottom:1.5rem;">Quote of the Day</p>
            <p class="text-white text-4xl font-light italic" style="margin-bottom:2rem;">"${ie(t.text)}"</p>
            <p class="text-purple-300 text-xl">- ${ie(t.author)}</p>
          </div>

          <!-- All Quotes Gallery -->
          <h3 class="text-2xl font-bold text-white" style="margin-bottom:1.5rem;">All Quotes</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${this._renderQuotesGrid()}
          </div>
        </div>
      </div>
    `}_renderQuotesGrid(){return this.quotes.map(e=>`
      <div class="card">
        <p class="text-white text-lg italic" style="margin-bottom:1rem;">"${ie(e.text)}"</p>
        <p class="text-purple-400">- ${ie(e.author)}</p>
      </div>
    `).join("")}}const At={DEFAULT_AFFIRMATIONS:[{text:"I am worthy of love and belonging exactly as I am",tags:[]},{text:"I trust in the divine timing of my life",tags:[]},{text:"I am safe, protected, and guided",tags:[]}]};class Ve{constructor(e){this.app=e,this.affirmations=window.affirmations||de||{general_positive_affirmations:At.DEFAULT_AFFIRMATIONS},this.currentAffirmation=null,this._allAffirmations=null}_getAllAffirmations(){return this._allAffirmations?this._allAffirmations:(this._allAffirmations=Object.values(this.affirmations).flat().filter(Boolean),this._allAffirmations)}_extractText(e){return typeof e=="string"?e:e.text}_getDayOfYear(){const e=new Date,t=new Date(e.getFullYear(),0,0);return Math.floor((e-t)/864e5)}getDailyAffirmation(){const e=this.affirmations.general_positive_affirmations||[];if(!e.length)return console.warn("⚠️ No affirmations loaded, using default"),"I am worthy of love and belonging exactly as I am.";const t=this._getDayOfYear()%e.length,i=e[t];return this._extractText(i)}randomCard(){const e=this._getAllAffirmations();if(!e.length)console.warn("⚠️ No affirmations available, using default"),this.currentAffirmation="I am worthy of love and belonging exactly as I am.";else{const t=Math.floor(Math.random()*e.length),i=e[t];this.currentAffirmation=this._extractText(i)}this.render()}reset(){this.currentAffirmation=null,this.render()}render(){const e=document.getElementById("affirmations-tab");e&&(e.innerHTML=this.currentAffirmation?this._renderFullScreen():this._renderDashboard())}_renderDashboard(){return`
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
    `}}typeof window<"u"&&(window.AffirmationsEngine=Ve);const je=[{id:"happy",emoji:"😊",title:"Happy"},{id:"joyful",emoji:"😄",title:"Joyful"},{id:"excited",emoji:"🤩",title:"Excited"},{id:"loved",emoji:"🥰",title:"Loved"},{id:"grateful",emoji:"🙏",title:"Grateful"},{id:"peaceful",emoji:"😌",title:"Peaceful"},{id:"calm",emoji:"🧘",title:"Calm"},{id:"relaxed",emoji:"😎",title:"Relaxed"},{id:"proud",emoji:"😤",title:"Proud"},{id:"confident",emoji:"💪",title:"Confident"},{id:"hopeful",emoji:"🌟",title:"Hopeful"},{id:"inspired",emoji:"✨",title:"Inspired"},{id:"sad",emoji:"😢",title:"Sad"},{id:"crying",emoji:"😭",title:"Crying"},{id:"lonely",emoji:"😔",title:"Lonely"},{id:"disappointed",emoji:"😞",title:"Disappointed"},{id:"anxious",emoji:"😰",title:"Anxious"},{id:"worried",emoji:"😟",title:"Worried"},{id:"stressed",emoji:"😫",title:"Stressed"},{id:"overwhelmed",emoji:"🤯",title:"Overwhelmed"},{id:"angry",emoji:"😠",title:"Angry"},{id:"frustrated",emoji:"😤",title:"Frustrated"},{id:"annoyed",emoji:"😒",title:"Annoyed"},{id:"tired",emoji:"😴",title:"Tired"},{id:"sick",emoji:"🤒",title:"Sick"},{id:"confused",emoji:"😕",title:"Confused"},{id:"surprised",emoji:"😲",title:"Surprised"},{id:"shocked",emoji:"😱",title:"Shocked"},{id:"nervous",emoji:"😬",title:"Nervous"},{id:"embarrassed",emoji:"😳",title:"Embarrassed"}],De=["What made you smile today?","What are you grateful for right now?","What's on your mind?","How are you really feeling?","What would you like to remember about today?","What challenged you today?","What did you learn about yourself?","What are you looking forward to?"],J=400;class Rt{constructor(e){this.app=e,this.currentPage=0,this.viewMode="write",this.isOpen=!1,this.isLocked=!1,this.activeModals=[]}render(){let e=document.getElementById("journal-tab");if(!e){const t=document.getElementById("main-content");if(!t)return;e=document.createElement("div"),e.id="journal-tab",e.className="tab-content",t.appendChild(e)}e.innerHTML=`
      <div class="journal-container">
        <div class="universal-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavJournal.webp');
                         --header-title:'';
                         --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
            <h1>My Personal Journal</h1>
            <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
            <span class="header-sub"></span>
          </header>
          
          <div class="journal-book-wrapper" id="journal-wrapper">
            <!-- Journal content injected here -->
          </div>
        </div>
      </div>
    `,this.initializeLockState(),this.renderJournal()}renderJournal(){const e=document.getElementById("journal-wrapper");if(!e)return;const t=!!this.app.state.data.journalPin;this.isOpen?this.renderOpenBook(e,t):this.renderClosedBook(e,t)}renderClosedBook(e,t){var r;const i=((r=this.app.state.currentUser)==null?void 0:r.name)||"My",n=t&&this.isLocked?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':"";e.innerHTML=`
      <div class="journal-closed" id="open-journal" style="opacity: 0; transform: scale(0.95);">
        <div class="journal-cover-title">${i}'s<br>Personal Journal</div>
        <div class="journal-cover-subtitle">Tap to open and begin writing</div>
        <div class="journal-lock">${n}</div>
      </div>`;const o=e.querySelector(".journal-closed");requestAnimationFrame(()=>{o.style.transition="opacity 0.5s ease-out, transform 0.5s ease-out",o.style.opacity="1",o.style.transform="scale(1)"}),o.addEventListener("click",()=>{t&&this.isLocked?this.promptUnlock():this.openBook()})}renderOpenBook(e,t){e.innerHTML=`
      <div class="journal-book" style="opacity: 0; transform: scale(0.95);">
        <!-- Top Navigation Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div class="mode-toggle">
            <button class="journal-btn-neuro mode-btn active" data-mode="write" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Write</button>
            <button class="journal-btn-neuro mode-btn" data-mode="read" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Read</button>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <button class="journal-btn-neuro lock-toggle-btn" id="lock-toggle" style="display:inline-flex;align-items:center;gap:0.4rem;">
              ${t&&this.isLocked?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'} Lock Journal
            </button>
            ${t?'<button class="journal-btn-neuro" id="pin-settings" title="PIN Settings" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>':""}
            <button class="journal-btn-neuro close-book-btn" id="close-journal" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Close</button>
          </div>
        </div>

        <!-- Pages Container -->
        <div class="journal-pages" id="journal-pages"></div>

        <!-- Bottom Controls -->
        <div class="journal-controls">
          <div class="journal-nav">
            <button class="journal-btn-neuro" id="prev-page" disabled>← Previous</button>
            <span class="page-indicator" id="page-indicator"></span>
            <button class="journal-btn-neuro" id="next-page" disabled>Next →</button>
          </div>
          <div style="display:flex;justify-content:center;margin-top:1rem;">
            <button class="journal-btn-neuro save-btn" id="save-entry" style="display:none;display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg> Save Entry</button>
          </div>
        </div>
      </div>`;const i=e.querySelector(".journal-book");requestAnimationFrame(()=>{i.style.transition="opacity 0.5s ease-out, transform 0.5s ease-out",i.style.opacity="1",i.style.transform="scale(1)"}),this.attachOpenEventListeners(),this.renderCurrentView()}renderWriteMode(){const e=document.getElementById("journal-pages"),t=document.getElementById("save-entry");t&&(t.style.display="block");const i=this.getRandomPrompt(),n=this.formatDate(new Date);e.innerHTML=`
      <div class="journal-page write-mode">
        <div class="journal-date">${n}</div>

        <textarea class="journal-textarea" 
                  id="journal-entry-text" 
                  placeholder="Dear Journal, ${i}"></textarea>

        <div class="prompt-box">
          <div class="prompt-text" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> Writing prompt: ${i}</div>
        </div>

        <div class="prompt-box">
          <div class="prompt-text">Your Mood</div>
          <div class="journal-mood" style="margin-top:.6rem;">
            ${this.renderMoodButtons()}
          </div>
        </div>
      </div>`,this.attachMoodListeners(e),this.updateNavigation()}renderReadMode(e="none"){const t=document.getElementById("journal-pages"),i=document.getElementById("save-entry");i&&(i.style.display="none");const n=this.app.state.data.journalEntries||[];if(n.length===0){this.renderEmptyJournal(t);return}const r=[...n].sort((h,p)=>new Date(p.timestamp)-new Date(h.timestamp))[this.currentPage],l=n.indexOf(r),d=r.mood?this.getMoodEmoji(r.mood):"",c=r.date||this.formatDate(new Date(r.timestamp)),u=e==="left"?"page-flip-left":e==="right"?"page-flip-right":"";t.innerHTML=`
      <div class="journal-page read-mode ${u}">
        <div class="entry-actions">
          <button class="action-btn" onclick="window.featuresManager.engines.journal.editEntry(${l})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg> Edit</button>
          <button class="action-btn" onclick="window.featuresManager.engines.journal.deleteEntry(${l})" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg> Delete</button>
        </div>
        <div class="journal-date">
          ${d?d+" ":""}
          ${c}
        </div>
        <div class="entry-content">${this.escapeHtml(r.situation||r.feelings||"")}</div>
      </div>`,this.updateNavigation()}renderEmptyJournal(e){e.innerHTML=`
      <div class="journal-page">
        <div class="empty-journal">
          <div class="empty-journal-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
          <p>Your journal is empty</p>
          <p style="font-size:.9rem;margin-top:.5rem;">Switch to Write mode to create your first entry</p>
        </div>
      </div>`,this.updateNavigation()}initializeLockState(){this.app.state.data.journalPin&&(this.isLocked=this.app.state.data.journalLocked!==!1)}promptSetPin(){const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',title:"Set Journal PIN",content:`
        <div class="modal-input-wrapper">
          <label class="form-label">Enter 4-digit PIN</label>
          <input type="password" id="pin-input" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <label class="form-label" style="margin-top:1rem;">Confirm PIN</label>
          <input type="password" id="pin-confirm" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <p style="font-size:.85rem;color:var(--neuro-text-muted);margin-top:.5rem;">
            You can reset PIN using your account password
          </p>
        </div>
      `,onConfirm:t=>{const i=t.querySelector("#pin-input"),n=t.querySelector("#pin-confirm"),o=i.value,r=n.value;return o.length!==4||!/^\d{4}$/.test(o)?(this.app.showToast("PIN must be 4 digits","warning"),!1):o!==r?(this.app.showToast("PINs do not match","warning"),!1):(this.app.state.data.journalPin=btoa(o),this.app.state.saveAppData(),this.isLocked=!0,this.app.showToast("PIN set successfully!","success"),this.renderJournal(),!0)}});setTimeout(()=>{var t;return(t=e.querySelector("#pin-input"))==null?void 0:t.focus()},100)}promptUnlock(){var i;const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',title:"Unlock Journal",content:`
        <div class="modal-input-wrapper">
          <label class="form-label">Enter your PIN</label>
          <input type="password" id="unlock-pin" class="form-input" 
                 maxlength="4" pattern="[0-9]*" inputmode="numeric" placeholder="••••">
          <button class="btn" id="forgot-pin" style="margin-top:.5rem;font-size:.85rem;">
            Forgot PIN? Use account password
          </button>
        </div>
      `,onConfirm:n=>{const o=n.querySelector("#unlock-pin"),r=o.value,l=atob(this.app.state.data.journalPin||"");return r===l?(this.isLocked=!1,this.isOpen=!0,this.app.showToast("Journal unlocked!","success"),this.openBook(),!0):(this.app.showToast("Incorrect PIN","error"),o.value="",o.focus(),!1)}});(i=e.querySelector("#forgot-pin"))==null||i.addEventListener("click",()=>{this.closeModal(e),this.resetPinWithAuth()});const t=e.querySelector("#unlock-pin");t==null||t.addEventListener("keydown",n=>{var o;n.key==="Enter"&&((o=e.querySelector(".modal-confirm"))==null||o.click())}),setTimeout(()=>t==null?void 0:t.focus(),100)}async resetPinWithAuth(){const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',title:"Reset PIN",content:`
        <div class="modal-input-wrapper">
          <p style="margin-bottom:1rem;">Enter your account password to reset your journal PIN</p>
          <label class="form-label">Account Password</label>
          <input type="password" id="auth-password" class="form-input" placeholder="Enter your password">
        </div>
      `,onConfirm:async i=>{const n=i.querySelector("#auth-password"),o=n.value;if(!o)return this.app.showToast("Please enter your password","warning"),!1;try{const{error:r}=await this.app.supabase.auth.signInWithPassword({email:this.app.state.currentUser.email,password:o});return r?(this.app.showToast("Incorrect password","error"),n.value="",n.focus(),!1):(delete this.app.state.data.journalPin,this.app.state.saveAppData(),this.isLocked=!1,this.app.showToast("PIN reset! Set a new one","success"),setTimeout(()=>this.promptSetPin(),300),!0)}catch(r){return console.error("Authentication error:",r),this.app.showToast("Authentication failed","error"),!1}}}),t=e.querySelector("#auth-password");t==null||t.addEventListener("keydown",i=>{var n;i.key==="Enter"&&((n=e.querySelector(".modal-confirm"))==null||n.click())}),setTimeout(()=>t==null?void 0:t.focus(),100)}showPinSettings(){var t,i;const e=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',title:"PIN Settings",content:`
        <div class="modal-input-wrapper">
          <button class="btn btn-primary" id="change-pin" style="width:100%;margin-bottom:.5rem;">
            Change PIN
          </button>
          <button class="btn" id="remove-pin" style="width:100%;">
            Remove PIN Lock
          </button>
        </div>
      `,cancelOnly:!0});(t=e.querySelector("#change-pin"))==null||t.addEventListener("click",()=>{this.closeModal(e),this.promptSetPin()}),(i=e.querySelector("#remove-pin"))==null||i.addEventListener("click",()=>{this.closeModal(e),ae.showConfirm("Remove PIN lock from your journal? Your journal will remain accessible without a PIN.",()=>{delete this.app.state.data.journalPin,this.app.state.saveAppData(),this.isLocked=!1,this.app.showToast("PIN removed","success"),this.renderJournal()},{title:"Remove PIN?",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',confirmText:"Remove PIN"})})}saveEntry(){const e=document.getElementById("journal-entry-text"),t=e==null?void 0:e.value.trim();if(!t){this.app.showToast("Please write something in your journal","warning");return}const i=document.querySelector(".mood-btn.active"),n=(i==null?void 0:i.dataset.mood)||null,o={situation:t,feelings:"",mood:n,timestamp:new Date().toISOString(),date:this.formatDate(new Date)};this.app.state.addEntry("journal",o),this.app.gamification&&this.app.gamification.incrementJournalEntries(),this.app.showToast("Journal entry saved!","success"),e.value="",document.querySelectorAll(".mood-btn").forEach(r=>r.classList.remove("active")),this.checkAchievements(),this.switchMode("read")}editEntry(e){const t=this.app.state.data.journalEntries||[],i=t[e];if(!i)return;const n=this.createModal({icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',title:"Edit Journal Entry",content:`
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            How did you feel?
          </label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;">
            ${this.renderMoodButtons(i.mood)}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">
            Entry
          </label>
          <textarea id="edit-entry" class="form-input" rows="8" placeholder="Write your thoughts...">${this.escapeHtml(i.situation||i.feelings||"")}</textarea>
        </div>
      `,onConfirm:o=>{const l=o.querySelector("#edit-entry").value.trim();if(!l)return this.app.showToast("Please write something","warning"),!1;const d=o.querySelector(".mood-btn.active"),c=(d==null?void 0:d.dataset.mood)||null;return t[e].situation=l,t[e].feelings="",t[e].mood=c,this.app.state.data.journalEntries=t,this.app.state.saveAppData(),this.app.showToast("Journal entry updated!","success"),this.renderCurrentView(),!0}});this.attachMoodListeners(n),setTimeout(()=>{var o;return(o=n.querySelector("#edit-entry"))==null?void 0:o.focus()},100)}deleteEntry(e){ae.showConfirm("Are you sure you want to delete this journal entry? This action cannot be undone.",()=>{const t=this.app.state.data.journalEntries||[];t.splice(e,1),this.app.state.data.journalEntries=t,this.app.state.saveAppData(),this.app.showToast("Journal entry deleted","info"),this.currentPage>=t.length&&(this.currentPage=Math.max(0,t.length-1)),this.renderCurrentView()},{title:"Delete Journal Entry",icon:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',confirmText:"Delete",isDanger:!0})}openBook(){const e=document.querySelector(".journal-closed");if(!e){this.isOpen=!0,this.renderJournal();return}e.style.transition=`opacity ${J}ms ease-in, transform ${J}ms ease-in`,e.style.opacity="0",e.style.transform="scale(0.9)",setTimeout(()=>{this.isOpen=!0,this.renderJournal()},J)}closeBook(){const e=document.querySelector(".journal-book");if(!e){this.isOpen=!1,this.renderJournal();return}e.style.transition=`opacity ${J}ms ease-in, transform ${J}ms ease-in`,e.style.opacity="0",e.style.transform="scale(0.9)",setTimeout(()=>{this.isOpen=!1,this.app.state.data.journalPin&&(this.isLocked=!0,this.app.state.data.journalLocked=!0,this.app.state.saveAppData()),this.renderJournal()},J)}switchMode(e){var t;this.viewMode=e,this.currentPage=0,document.querySelectorAll(".mode-btn").forEach(i=>i.classList.remove("active")),(t=document.querySelector(`[data-mode="${e}"]`))==null||t.classList.add("active"),this.renderCurrentView()}navigatePage(e){const i=(this.app.state.data.journalEntries||[]).length-1,n=this.currentPage+e;n<0||n>i||(this.currentPage=n,this.renderReadMode(e>0?"right":"left"))}updateNavigation(){const e=this.app.state.data.journalEntries||[],t=document.getElementById("prev-page"),i=document.getElementById("next-page"),n=document.getElementById("page-indicator");this.viewMode==="write"?(t&&(t.style.display="none"),i&&(i.style.display="none"),n&&(n.textContent="")):(t&&(t.style.display="block",t.disabled=this.currentPage===0),i&&(i.style.display="block",i.disabled=this.currentPage>=e.length-1),n&&(n.textContent=e.length?`Entry ${this.currentPage+1} of ${e.length}`:""))}renderCurrentView(){this.viewMode==="write"?this.renderWriteMode():this.renderReadMode()}attachOpenEventListeners(){const e=document.getElementById("close-journal");e==null||e.addEventListener("click",()=>this.closeBook());const t=document.getElementById("lock-toggle");t==null||t.addEventListener("click",()=>this.handleLockToggle());const i=document.getElementById("pin-settings");i==null||i.addEventListener("click",()=>this.showPinSettings()),document.querySelectorAll(".mode-btn").forEach(l=>{l.addEventListener("click",d=>{const c=d.target.dataset.mode;this.switchMode(c)})});const n=document.getElementById("prev-page"),o=document.getElementById("next-page");n==null||n.addEventListener("click",()=>this.navigatePage(-1)),o==null||o.addEventListener("click",()=>this.navigatePage(1));const r=document.getElementById("save-entry");r==null||r.addEventListener("click",()=>this.saveEntry())}handleLockToggle(){!!this.app.state.data.journalPin?this.isLocked?this.promptUnlock():(this.isLocked=!0,this.app.state.data.journalLocked=!0,this.app.state.saveAppData(),this.app.showToast("Journal locked","info"),this.renderJournal()):this.promptSetPin()}attachMoodListeners(e){e.querySelectorAll(".mood-btn").forEach(t=>{t.addEventListener("click",i=>{e.querySelectorAll(".mood-btn").forEach(n=>n.classList.remove("active")),i.currentTarget.classList.add("active")})})}checkAchievements(){var n,o;const e=((o=(n=this.app.gamification)==null?void 0:n.state)==null?void 0:o.totalJournalEntries)||0,t=this.app.gamification;if(!t)return;const i=t.getBadgeDefinitions();e>=1&&t.checkAndGrantBadge("first_journal",i),e>=20&&t.checkAndGrantBadge("journal_keeper",i),e>=75&&t.checkAndGrantBadge("journal_master",i),e>=150&&t.checkAndGrantBadge("journal_150",i),e>=400&&t.checkAndGrantBadge("journal_400",i)}createModal({icon:e,title:t,content:i,onConfirm:n,cancelOnly:o=!1}){const r=document.createElement("div");r.className="modal-overlay",r.innerHTML=`
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small">${e}</div>
          <h3 class="modal-title">${t}</h3>
        </div>
        ${i}
        <div class="modal-actions">
          <button class="btn modal-cancel">${o?"Close":"Cancel"}</button>
          ${o?"":'<button class="btn btn-primary modal-confirm">Confirm</button>'}
        </div>
      </div>`,document.body.appendChild(r),this.activeModals.push(r);const l=()=>this.closeModal(r);r.querySelector(".modal-cancel").onclick=l,!o&&n&&(r.querySelector(".modal-confirm").onclick=()=>{n(r)!==!1&&this.closeModal(r)}),r.onclick=c=>{c.target===r&&l()};const d=c=>{c.key==="Escape"&&(l(),document.removeEventListener("keydown",d))};return document.addEventListener("keydown",d),r}closeModal(e){e.style.opacity="0",setTimeout(()=>{e.remove(),this.activeModals=this.activeModals.filter(t=>t!==e)},200)}cleanup(){this.activeModals.forEach(e=>e.remove()),this.activeModals=[]}getRandomPrompt(){return De[Math.floor(Math.random()*De.length)]}formatDate(e){return e.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}renderMoodButtons(e=null){return je.map(t=>`<button class="mood-btn ${e===t.id?"active":""}" 
              data-mood="${t.id}" 
              title="${t.title}">${t.emoji}</button>`).join("")}getMoodEmoji(e){const t=je.find(i=>i.id===e);return t?t.emoji:""}escapeHtml(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}}class Ot{constructor(e){this.app=e,this.initialized=!1}async render(){var n,o,r,l,d,c,u,h;const e=document.getElementById("shadow-alchemy-tab");if(!(((o=(n=this.app.state)==null?void 0:n.currentUser)==null?void 0:o.isAdmin)||((l=(r=this.app.state)==null?void 0:r.currentUser)==null?void 0:l.isVip))&&!((u=(c=(d=this.app.gamification)==null?void 0:d.state)==null?void 0:c.unlockedFeatures)!=null&&u.includes("shadow_alchemy_lab"))){e.innerHTML=`
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

   <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavShadow.webp');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub"></span>
      </header>

      <div class="card relative" style="padding:3rem; text-align:center; opacity: 0.75;">
        <div style="margin-bottom: 1rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:5rem;height:5rem;opacity:0.3;"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
        <h2 style="color: var(--neuro-text); font-size: 2rem; margin-bottom: 1rem;">Premium Feature Locked</h2>
        <p style="color: var(--neuro-text-light); font-size: 1.2rem; margin-bottom: 2rem;">
          Unlock the Shadow Alchemy Lab in the Karma Shop to access this powerful transformation tool.
        </p>
        <button onclick="window.app.nav.switchTab('karma-shop')" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg> Visit Karma Shop
        </button>
      </div>

    </div>
  </div>
`;return}e.innerHTML=`
  <div style="background:var(--neuro-bg);padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

   <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavShadow.webp');
                     --header-title:'';
                     --header-tag:'Transform your Shadows into Golden wisdom'">
        <h1>Shadow Alchemy Lab</h1>
        <h3>Transform your Shadows into Golden wisdom</h3>
        <span class="header-sub"></span>
      </header>

      <main id="shadow-alchemy-main-content"></main>

    </div>
  </div>
`,this.initialized?(h=window.AppController)!=null&&h.renderDashboard&&window.AppController.renderDashboard():(await this.initializeShadowAlchemy(),this.initialized=!0)}async initializeShadowAlchemy(){var e;try{await q(()=>import("./archetypesEngine-C2YSgS9x.js"),[]),await q(()=>import("./DailyJourneyEngine-CClVLJQA.js"),[]),await q(()=>import("./controller-B8AnAKIZ.js").then(t=>t.d),[]),(e=window.AppController)!=null&&e.init&&await window.AppController.init()}catch(t){console.error("❌ Failed to load Shadow Alchemy Lab:",t);const i=document.getElementById("shadow-alchemy-main-content");i&&(i.innerHTML=`
        <div class="card" style="text-align:center;padding:var(--spacing-xl)">
          <h3 style="color:var(--neuro-text)">Failed to Load</h3>
          <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
          <p style="color:var(--neuro-text-lighter);font-size:0.9rem;margin-top:1rem">${t.message}</p>
        </div>
      `)}}}const Je=window.AppSupabase||null;window.CommunitySupabase=Je;const v={_sb:null,_uid:null,_subs:{},_heartbeatTimer:null,async init(){if(this._sb=window.AppSupabase||Je,!this._sb)return console.error("[CommunityDB] CommunitySupabase not ready — window.AppSupabase is null"),!1;const{data:{user:s},error:e}=await this._sb.auth.getUser();return e||!s?(console.error("[CommunityDB] No authenticated user:",e==null?void 0:e.message),!1):(this._uid=s.id,!0)},get userId(){return this._uid},get ready(){return!!(this._sb&&this._uid)},_err(s,e){console.error(`[CommunityDB] ${s}:`,(e==null?void 0:e.message)??e)},_profileSelect:"id, name, emoji, avatar_url",_ago(s){return new Date(Date.now()-s).toISOString()},_todayUTC(){const s=new Date;return s.setUTCHours(0,0,0,0),s.toISOString()},async getMyProfile(){if(!this.ready)return null;const{data:s,error:e}=await this._sb.from("profiles").select("*").eq("id",this._uid).single();return e?(this._err("getMyProfile",e),null):s},async getProfile(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("profiles").select("id, name, emoji, avatar_url, inspiration, community_status, community_role, total_sessions, total_minutes, gifts_given, birthday, country").eq("id",s).single();return t?(this._err("getProfile",t),null):e},_parseProgress(s){var t,i,n,o,r,l;const e=typeof s=="string"?JSON.parse(s):s;return{xp:e.xp??0,karma:e.karma??0,level:e.level??1,badges:e.badges??[],unlockedFeatures:e.unlockedFeatures??[],streak:((t=e.streaks)==null?void 0:t.current)??((i=e.streak)==null?void 0:i.current)??0,longestStreak:((n=e.streaks)==null?void 0:n.longest)??0,totalSessions:((o=e.stats)==null?void 0:o.totalSessions)??0,totalMeditations:((r=e.stats)==null?void 0:r.totalMeditations)??0,totalReadings:((l=e.stats)==null?void 0:l.totalReadings)??0,totalTarotSpreads:e.totalTarotSpreads??0,totalJournalEntries:e.totalJournalEntries??0,totalWellnessRuns:e.totalWellnessRuns??0,totalHappinessViews:e.totalHappinessViews??0}},async getUserProgress(s){if(!this.ready)return null;try{const{data:e,error:t}=await this._sb.from("user_progress").select("payload").eq("user_id",s).single();return t||!e?null:this._parseProgress(e.payload)}catch(e){return this._err("getUserProgress",e),null}},getOwnGamificationState(){var e;const s=(e=window.app)==null?void 0:e.gamification;return s?this._parseProgress(s.state??s):null},async uploadAvatar(s){if(!this.ready)return null;try{const e=s.name.split(".").pop().toLowerCase()||"jpg",t=`avatars/${this._uid}.${e}`,{error:i}=await this._sb.storage.from("community-avatars").upload(t,s,{upsert:!0,contentType:s.type});if(i)return this._err("uploadAvatar upload",i),null;const{data:n}=this._sb.storage.from("community-avatars").getPublicUrl(t),o=n==null?void 0:n.publicUrl;if(!o)return null;const r=`${o}?t=${Date.now()}`;return await this.updateProfile({avatar_url:r})?r:null}catch(e){return this._err("uploadAvatar",e),null}},async updateProfile(s){if(!this.ready)return!1;const{error:e}=await this._sb.from("profiles").update({...s,updated_at:new Date().toISOString()}).eq("id",this._uid);return e?(this._err("updateProfile",e),!1):!0},async setPresence(s="online",e="✨ Available",t=null){if(!this.ready)return!1;const i=new Date().toISOString(),{error:n}=await this._sb.from("community_presence").upsert({user_id:this._uid,status:s,activity:e,room_id:t,last_seen:i,updated_at:i},{onConflict:"user_id"});return n&&this._err("setPresence",n),!n},async setOffline(){return this.setPresence("offline","💤 Offline",null)},async getActiveMembers(){if(!this.ready)return[];const{data:s,error:e}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!1});return e?(this._err("getActiveMembers",e),[]):s||[]},async getRoomParticipants(s){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("community_presence").select(`user_id, status, activity, room_id, is_phantom, last_seen, profiles ( ${this._profileSelect} )`).or(`room_id.eq.${s},is_phantom.eq.true`).neq("status","offline").gte("last_seen",this._ago(5*6e4)).order("is_phantom",{ascending:!1}).order("last_seen",{ascending:!0});return t?(this._err("getRoomParticipants",t),[]):e||[]},subscribeToPresence(s){return this._subs.presence&&this._subs.presence.unsubscribe(),this._subs.presence=this._sb.channel("community-presence").on("postgres_changes",{event:"*",schema:"public",table:"community_presence"},async()=>s(await this.getActiveMembers())).subscribe(),this._subs.presence},startHeartbeat(s=6e4){this.stopHeartbeat(),this._heartbeatTimer=setInterval(async()=>{var t,i,n;if(!this.ready)return;const e=(t=typeof Core<"u"?Core:window.Core)==null?void 0:t.state;await this.setPresence(((i=e==null?void 0:e.currentUser)==null?void 0:i.status)||"online",((n=e==null?void 0:e.currentUser)==null?void 0:n.activity)||"✨ Available",(e==null?void 0:e.currentRoom)||null)},s),window.addEventListener("beforeunload",()=>this._cleanup())},stopHeartbeat(){this._heartbeatTimer&&(clearInterval(this._heartbeatTimer),this._heartbeatTimer=null)},_reflectionSelect:"id, content, appreciation_count, created_at, profiles ( id, name, emoji, avatar_url )",async getReflections(s=30){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("reflections").select(this._reflectionSelect).order("created_at",{ascending:!1}).limit(s);return t?(this._err("getReflections",t),[]):e||[]},async postReflection(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("reflections").insert({user_id:this._uid,content:s}).select(this._reflectionSelect).single();return t?(this._err("postReflection",t),null):e},async deleteReflection(s){if(!this.ready)return!1;const{error:e}=await this._sb.from("reflections").delete().eq("id",s);return e?(this._err("deleteReflection",e),!1):!0},async updateReflection(s,e){if(!this.ready)return!1;const{error:t}=await this._sb.from("reflections").update({content:e}).eq("id",s).eq("user_id",this._uid);return t?(this._err("updateReflection",t),!1):!0},subscribeToReflections(s){return this._subs.reflections&&this._subs.reflections.unsubscribe(),this._subs.reflections=this._sb.channel("community-reflections").on("postgres_changes",{event:"INSERT",schema:"public",table:"reflections"},async({new:e})=>{const{data:t}=await this._sb.from("reflections").select(this._reflectionSelect).eq("id",e.id).single();t&&s(t)}).subscribe(),this._subs.reflections},async getMyAppreciations(){if(!this.ready)return new Set;const{data:s,error:e}=await this._sb.from("appreciations").select("reflection_id").eq("user_id",this._uid);return e?(this._err("getMyAppreciations",e),new Set):new Set(s.map(t=>t.reflection_id))},async toggleAppreciation(s,e){if(!this.ready)return null;if(e){const{error:t}=await this._sb.from("appreciations").delete().eq("user_id",this._uid).eq("reflection_id",s);return t?(this._err("removeAppreciation",t),null):{appreciated:!1}}else{const{error:t}=await this._sb.from("appreciations").insert({user_id:this._uid,reflection_id:s});return t?(this._err("addAppreciation",t),null):{appreciated:!0}}},async getReflectionCount(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("reflections").select("appreciation_count").eq("id",s).single();return t?(this._err("getReflectionCount",t),null):(e==null?void 0:e.appreciation_count)??null},async getMyUserAppreciations(){if(!this.ready)return new Set;const{data:s,error:e}=await this._sb.from("user_appreciations").select("appreciated_user_id").eq("user_id",this._uid);return e?(this._err("getMyUserAppreciations",e),new Set):new Set(s.map(t=>t.appreciated_user_id))},async toggleUserAppreciation(s,e){if(!this.ready)return null;if(e){const{error:t}=await this._sb.from("user_appreciations").delete().eq("user_id",this._uid).eq("appreciated_user_id",s);return t?(this._err("removeUserAppreciation",t),null):{appreciated:!1}}else{const{error:t}=await this._sb.from("user_appreciations").insert({user_id:this._uid,appreciated_user_id:s});return t?(this._err("addUserAppreciation",t),null):{appreciated:!0}}},async getUserAppreciationCount(s){if(!this.ready)return 0;const{count:e,error:t}=await this._sb.from("user_appreciations").select("*",{count:"exact",head:!0}).eq("appreciated_user_id",s);return t?(this._err("getUserAppreciationCount",t),0):e||0},_roomMsgSelect:"id, message, created_at, profiles ( id, name, emoji, avatar_url )",async getRoomMessages(s,e=50){if(!this.ready)return[];const{data:t,error:i}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("room_id",s).order("created_at",{ascending:!0}).limit(e);return i?(this._err("getRoomMessages",i),[]):t||[]},async sendRoomMessage(s,e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("room_messages").insert({user_id:this._uid,room_id:s,message:e}).select(this._roomMsgSelect).single();return i?(this._err("sendRoomMessage",i),null):t},subscribeToRoomChat(s,e){const t=`room-${s}`;return this._subs[t]&&this._subs[t].unsubscribe(),this._subs[t]=this._sb.channel(`room-chat-${s}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_messages",filter:`room_id=eq.${s}`},async({new:i})=>{const{data:n}=await this._sb.from("room_messages").select(this._roomMsgSelect).eq("id",i.id).single();n&&e(n)}).subscribe(),this._subs[t]},unsubscribeFromRoomChat(s){this._unsub(`room-${s}`)},async sendWhisper(s,e){if(!this.ready)return null;const{data:t,error:i}=await this._sb.from("whispers").insert({sender_id:this._uid,recipient_id:s,message:e}).select().single();return i?(this._err("sendWhisper",i),null):t},async getWhispers(s){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("whispers").select(`
                id, message, read, created_at,
                sender:profiles!whispers_sender_id_fkey ( id, name, emoji ),
                recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji )
            `).or(`and(sender_id.eq.${this._uid},recipient_id.eq.${s}),and(sender_id.eq.${s},recipient_id.eq.${this._uid})`).order("created_at",{ascending:!0});return t?(this._err("getWhispers",t),[]):e||[]},async markWhisperRead(s){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("id",s)},async markConversationRead(s){this.ready&&await this._sb.from("whispers").update({read:!0}).eq("recipient_id",this._uid).eq("sender_id",s).eq("read",!1)},async getWhisperInbox(){if(!this.ready)return[];try{const{data:s,error:e}=await this._sb.from("whispers").select(`
                    id, message, read, created_at, sender_id, recipient_id,
                    sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url ),
                    recipient:profiles!whispers_recipient_id_fkey ( id, name, emoji, avatar_url )
                `).or(`sender_id.eq.${this._uid},recipient_id.eq.${this._uid}`).order("created_at",{ascending:!1}).limit(200);if(e)return this._err("getWhisperInbox",e),[];const t={};for(const i of s||[]){const n=i.sender_id===this._uid?i.recipient_id:i.sender_id,o=i.sender_id===this._uid?i.recipient:i.sender;t[n]||(t[n]={partnerId:n,partner:o,lastMessage:i.message,lastAt:i.created_at,unread:0}),i.recipient_id===this._uid&&!i.read&&t[n].unread++}return Object.values(t).sort((i,n)=>new Date(n.lastAt)-new Date(i.lastAt))}catch(s){return this._err("getWhisperInbox",s),[]}},async getUnreadWhisperCount(){if(!this.ready)return 0;const{count:s,error:e}=await this._sb.from("whispers").select("id",{count:"exact",head:!0}).eq("recipient_id",this._uid).eq("read",!1);return e?0:s||0},subscribeToWhispers(s){return this._subs.whispersFg&&this._subs.whispersFg.unsubscribe(),this._subs.whispersFg=this._sb.channel("my-whispers-fg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:e})=>{const{data:t}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",e.id).single();t&&s(t)}).subscribe(),this._subs.whispersFg},subscribeToWhispersBackground(s){return this._subs.whispersBg&&this._subs.whispersBg.unsubscribe(),this._subs.whispersBg=this._sb.channel("my-whispers-bg").on("postgres_changes",{event:"INSERT",schema:"public",table:"whispers",filter:`recipient_id=eq.${this._uid}`},async({new:e})=>{const{data:t}=await this._sb.from("whispers").select(`
                        id, message, read, created_at, sender_id,
                        sender:profiles!whispers_sender_id_fkey ( id, name, emoji, avatar_url )
                    `).eq("id",e.id).single();t&&s(t)}).subscribe(),this._subs.whispersBg},async submitReport(s,e,t=""){if(!this.ready)return!1;const{error:i}=await this._sb.from("reports").insert({reporter_id:this._uid,reported_user_id:s,reason:e,details:t});return i?(this._err("submitReport",i),!1):!0},async blockUser(s){if(!this.ready)return!1;const{error:e}=await this._sb.from("blocked_users").insert({user_id:this._uid,blocked_user_id:s});return e?(this._err("blockUser",e),!1):!0},async getBlockedUsers(){if(!this.ready)return new Set;const{data:s,error:e}=await this._sb.from("blocked_users").select("blocked_user_id").eq("user_id",this._uid);return e?new Set:new Set(s.map(t=>t.blocked_user_id))},async getUserByName(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("profiles").select("id, name").ilike("name",s).single();return t?(this._err("getUserByName",t),null):e},async getOwnFullProgress(){if(!this.ready)return null;try{const{data:s,error:e}=await this._sb.from("user_progress").select("payload").eq("user_id",this._uid).single();if(e||!s)return null;const t=typeof s.payload=="string"?JSON.parse(s.payload):s.payload;return{journalEntries:t.journalEntries||[],energyEntries:t.energyEntries||[],gratitudeEntries:t.gratitudeEntries||[],flipEntries:t.flipEntries||[],tarotReadings:t.tarotReadings||[],meditationEntries:t.meditationEntries||[]}}catch(s){return this._err("getOwnFullProgress",s),null}},async getRoomBlessings(s){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",s).order("created_at",{ascending:!1});return t?(this._err("getRoomBlessings",t),[]):e||[]},async blessRoom(s){if(!this.ready)return{status:"error"};const{data:e,error:t}=await this._sb.rpc("bless_room_with_cooldown",{p_room_id:s,p_cooldown_seconds:60});if(t)return this._err("blessRoom rpc",t),{status:"error"};if(e==="cooldown")return{status:"cooldown"};if(e!=="ok")return{status:"error"};const{data:i,error:n}=await this._sb.from("room_blessings").select("user_id, created_at, profiles ( name, avatar_url, emoji )").eq("room_id",s).eq("user_id",this._uid).single();return n?(this._err("blessRoom fetch",n),{status:"ok",data:null}):{status:"ok",data:i}},subscribeToBlessings(s,e){const t=`bless-${s}`;this._subs[t]&&this._subs[t].unsubscribe();const i=async({new:n})=>{if(!(n!=null&&n.user_id))return;const{data:o}=await this._sb.from("profiles").select("name, avatar_url, emoji").eq("id",n.user_id).single();e({roomId:s,userId:n.user_id,name:(o==null?void 0:o.name)||"A member",avatarUrl:(o==null?void 0:o.avatar_url)||"",emoji:(o==null?void 0:o.emoji)||""})};return this._subs[t]=this._sb.channel(t).on("postgres_changes",{event:"INSERT",schema:"public",table:"room_blessings",filter:`room_id=eq.${s}`},i).on("postgres_changes",{event:"UPDATE",schema:"public",table:"room_blessings",filter:`room_id=eq.${s}`},i).subscribe(),this._subs[t]},unsubscribeFromBlessings(s){this._unsub(`bless-${s}`)},async getAppSettings(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("app_settings").select("value").eq("key",s).single();return t?(this._err("getAppSettings",t),null):(e==null?void 0:e.value)??null},async saveAppSettings(s,e){if(!this.ready)return!1;const{error:t}=await this._sb.from("app_settings").upsert({key:s,value:e,updated_at:new Date().toISOString()},{onConflict:"key"});return t?(this._err("saveAppSettings",t),!1):!0},async logRoomEntry(s){if(!this.ready)return null;const{data:e,error:t}=await this._sb.from("room_entries").insert({user_id:this._uid,room_id:s}).select("id").single();return t?(this._err("logRoomEntry",t),null):(e==null?void 0:e.id)||null},async logRoomExit(s){if(!s||!this.ready)return;const{data:e}=await this._sb.from("room_entries").select("entered_at").eq("id",s).single();if(!e)return;const t=Math.round((Date.now()-new Date(e.entered_at).getTime())/1e3);await this._sb.from("room_entries").update({left_at:new Date().toISOString(),duration_seconds:t}).eq("id",s)},async broadcastMessage(s,e){if(!this.ready||!(s!=null&&s.length))return{sent:0,failed:0};const t=s.map(o=>({sender_id:this._uid,recipient_id:o,message:e})),{data:i,error:n}=await this._sb.from("whispers").insert(t).select("id");return n?(this._err("broadcastMessage",n),{sent:0,failed:s.length}):{sent:(i==null?void 0:i.length)||0,failed:s.length-((i==null?void 0:i.length)||0)}},async getAdminNotifications(s=50){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("admin_notifications").select("*").order("created_at",{ascending:!1}).limit(s);return t?(this._err("getAdminNotifications",t),[]):e||[]},async markNotificationRead(s){if(!this.ready)return!1;const{error:e}=await this._sb.from("admin_notifications").update({read:!0}).eq("id",s);return e?(this._err("markNotificationRead",e),!1):!0},async markAllNotificationsRead(){if(!this.ready)return!1;const{error:s}=await this._sb.from("admin_notifications").update({read:!0}).eq("read",!1);return s?(this._err("markAllNotificationsRead",s),!1):!0},async getUnreadNotificationCount(){if(!this.ready)return 0;const{count:s,error:e}=await this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1);return e?(this._err("getUnreadNotificationCount",e),0):s||0},async getAdminMemberStats(){if(!this.ready)return{};const[s,e,t]=await Promise.all([this._sb.from("profiles").select("*",{count:"exact",head:!0}),this._sb.from("profiles").select("*",{count:"exact",head:!0}).gte("updated_at",this._ago(10080*6e4)),this._sb.from("community_presence").select("*",{count:"exact",head:!0}).neq("status","offline").gte("last_seen",this._ago(5*6e4))]);return{total:s.count||0,newThisWeek:e.count||0,onlineNow:t.count||0}},async getAdminEngagementStats(){if(!this.ready)return{};const s=this._todayUTC(),[e,t,i,n]=await Promise.all([this._sb.from("reflections").select("*",{count:"exact",head:!0}).gte("created_at",s),this._sb.from("reflections").select("*",{count:"exact",head:!0}),this._sb.from("whispers").select("*",{count:"exact",head:!0}).gte("created_at",s),this._sb.from("appreciations").select("*",{count:"exact",head:!0}).gte("created_at",s)]);return{reflectionsToday:e.count||0,reflectionsTotal:t.count||0,whispersToday:i.count||0,appreciationsToday:n.count||0}},async getLeaderboard(){if(!this.ready)return{xp:[],karma:[]};const{data:s,error:e}=await this._sb.from("user_progress").select("user_id, payload->xp, payload->karma, payload->level").limit(50);if(e)return this._err("getLeaderboard",e),{xp:[],karma:[]};const t=(s||[]).map(l=>l.user_id);if(!t.length)return{xp:[],karma:[]};const{data:i}=await this._sb.from("profiles").select("id, name, emoji, avatar_url").in("id",t),n=Object.fromEntries((i||[]).map(l=>[l.id,l])),o=(s||[]).filter(l=>n[l.user_id]).map(l=>({user_id:l.user_id,profiles:n[l.user_id],payload:{xp:l.xp??0,karma:l.karma??0,level:l.level??1}})),r=l=>[...o].sort((d,c)=>{var u,h;return(((u=c.payload)==null?void 0:u[l])||0)-(((h=d.payload)==null?void 0:h[l])||0)}).slice(0,3);return{xp:r("xp"),karma:r("karma")}},async getRoomUsageToday(){if(!this.ready)return[];const{data:s,error:e}=await this._sb.from("room_entries").select("room_id, duration_seconds").gte("entered_at",this._todayUTC());if(e)return this._err("getRoomUsageToday",e),[];const t={};for(const i of s||[])t[i.room_id]||(t[i.room_id]={room_id:i.room_id,entries:0,totalSeconds:0}),t[i.room_id].entries++,t[i.room_id].totalSeconds+=i.duration_seconds||0;return Object.values(t).sort((i,n)=>n.entries-i.entries)},async getPushSubscriptionCount(){if(!this.ready)return 0;const{count:s,error:e}=await this._sb.from("push_subscriptions").select("*",{count:"exact",head:!0});return e?(this._err("getPushSubscriptionCount",e),0):s||0},async getRetentionSignals(){if(!this.ready)return{quietMembers:[],streakMembers:[]};const[s,e,t]=await Promise.all([this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(10080*6e4)).neq("status","offline"),this._sb.from("community_presence").select("user_id").gte("last_seen",this._ago(336*60*6e4)).lt("last_seen",this._ago(10080*6e4)),this._sb.from("community_presence").select("user_id, profiles(name, emoji)").gte("last_seen",this._ago(4320*6e4))]),i=new Set((s.data||[]).map(l=>l.user_id)),o=[...new Set((e.data||[]).map(l=>l.user_id))].filter(l=>!i.has(l)).slice(0,5),r=(t.data||[]).filter(l=>l.profiles).slice(0,5).map(l=>{var d,c;return{user_id:l.user_id,name:(d=l.profiles)==null?void 0:d.name,emoji:(c=l.profiles)==null?void 0:c.emoji}});return{quietMembers:o,streakMembers:r}},async getSafetyStats(){if(!this.ready)return{};const[s,e,t]=await Promise.all([this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("type","report").gte("created_at",this._ago(10080*6e4)),this._sb.from("blocked_users").select("*",{count:"exact",head:!0}),this._sb.from("admin_notifications").select("*",{count:"exact",head:!0}).eq("read",!1)]);return{reportsThisWeek:s.count||0,blockedTotal:e.count||0,unreadNotifs:t.count||0}},async getRecentReflectionsAdmin(s=5){if(!this.ready)return[];const{data:e,error:t}=await this._sb.from("reflections").select("id, content, created_at, user_id, profiles!reflections_user_id_fkey(id, name, emoji, avatar_url)").order("created_at",{ascending:!1}).limit(s);if(t){this._err("getRecentReflectionsAdmin",t);const{data:i}=await this._sb.from("reflections").select("id, content, created_at, author_id").order("created_at",{ascending:!1}).limit(s);return i||[]}return e||[]},async adminUpdateGamification(s,{xpDelta:e=0,karmaDelta:t=0,unlockFeature:i=null,badgeId:n=null,badgeName:o=null,badgeIcon:r="🏅",badgeRarity:l="common",badgeXp:d=0,badgeDesc:c=""}={}){if(!this.ready)return!1;try{const{error:u}=await this._sb.rpc("update_user_gamification",{target_user_id:s,xp_delta:e,karma_delta:t,unlock_feature:i,badge_id:n,badge_name:o,badge_icon:r,badge_rarity:l,badge_xp:d,badge_desc:c});if(u)throw new Error(u.message);return!0}catch(u){return this._err("adminUpdateGamification",u),!1}},_unsub(s){this._subs[s]&&(this._subs[s].unsubscribe(),delete this._subs[s])},unsubscribeAll(){for(const s of Object.values(this._subs))try{s.unsubscribe()}catch{}this._subs={}},async _cleanup(){this.stopHeartbeat(),await this.setOffline(),this.unsubscribeAll()}};window.addEventListener("pagehide",()=>v._cleanup());window.CommunityDB=v;const w={state:{currentUser:{id:null,name:"Loading...",avatar:"?",emoji:"",avatar_url:null,bio:"",status:"online",role:"Member",karma:0,xp:0,badges:[],minutes:0,circles:0,offered:0,birthday:null,country:null,email:"",is_admin:!1},currentRoom:null,currentActivity:"✨ Available",presenceCount:0,presenceInterval:null,pulseSent:!1,timerRunning:!1,timeLeft:1200,currentView:"hubView",initialized:!1},config:{ROOM_MODULES:["SilentRoom","CampfireRoom","GuidedRoom","BreathworkRoom","OshoRoom","DeepWorkRoom","TarotRoom","ReikiRoom"],STATUS_RINGS:{silent:"#60a5fa",available:"#34d399",guiding:"#fbbf24",deep:"#a78bfa",resonant:"#f472b6",offline:"#d1d5db"},AVATAR_GRADIENTS:["linear-gradient(135deg, #667eea 0%, #764ba2 100%)","linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)","linear-gradient(135deg, #fa709a 0%, #fee140 100%)"],ADMIN_MODULES:["CollectiveField","LunarEngine","SolarEngine","UpcomingEvents","AdminDashboard"],RENDER_DELAY:100,CELESTIAL_INIT_DELAY:500,CELESTIAL_POLL_MAX:25,PRESENCE_INTERVAL:3e4,HEARTBEAT_INTERVAL:6e4,PULSE_COOLDOWN:6e4},async init(){if(this.state.initialized){console.warn("[Core] Already initialized");return}try{if(!await v.init())throw new Error("Database not ready - is the user logged in?");if(await this.loadCurrentUser(),await v.setPresence(this.state.currentUser.status||"online",this.state.currentUser.activity||"✨ Available",null),v.startHeartbeat(this.config.HEARTBEAT_INTERVAL),window.addEventListener("pagehide",()=>{v.setOffline(),v.unsubscribeAll()}),this.setupEventListeners(),this.initializeSafetyModals(),this.initializeModules(),this.initializePracticeRooms(),this.scheduleRoomRendering(),this.scheduleCelestialInit(),this.updatePresenceCount(),setTimeout(()=>this._injectAdminUIAll(),1e3),this.state.initialized=!0,window._pendingHubScrollTarget){const e=window._pendingHubScrollTarget;window._pendingHubScrollTarget=null,(()=>{let n=0,o=0,r=0;const l=setInterval(()=>{if(n++,document.body.classList.contains("ritual-active")){o=0,r=0;return}const d=document.getElementById(e),c=d?d.offsetHeight:0;if(c>10&&(c===o?r++:r=0,o=c),(r>=3||n>=60)&&c>0){clearInterval(l);const h=document.getElementById("mobile-bottom-bar"),p=h?h.offsetHeight+16:16;requestAnimationFrame(()=>{const m=d.getBoundingClientRect().top+window.scrollY-p;window.scrollTo({top:m,behavior:"smooth"})})}else n>=60&&clearInterval(l)},100)})()}}catch(s){console.error("❌ [Core] Initialization failed:",s),this.handleInitializationError(s)}},async loadCurrentUser(){var s,e,t,i,n,o,r,l,d;try{const c=await v.getMyProfile();if(!c){console.warn("[Core] No profile found for current user");return}const h=new Set(["online","available","away","guiding","silent","deep","offline"]).has(c.community_status)?c.community_status:"online";this.state.currentUser={id:c.id,name:c.name||"Anonymous",avatar:(c.name||"A").charAt(0).toUpperCase(),emoji:c.emoji||"",avatar_url:c.avatar_url||null,bio:c.inspiration||"Here to practice with intention.",status:h,community_status:h,role:c.is_admin===!0?"Admin":c.community_role||"Member",minutes:c.total_minutes||0,circles:c.total_sessions||0,offered:c.gifts_given||0,birthday:c.birthday||null,country:c.country||null,email:c.email||"",is_admin:c.is_admin===!0,karma:((t=(e=(s=window.app)==null?void 0:s.gamification)==null?void 0:e.state)==null?void 0:t.karma)??0,xp:((o=(n=(i=window.app)==null?void 0:i.gamification)==null?void 0:n.state)==null?void 0:o.xp)??0,badges:((d=(l=(r=window.app)==null?void 0:r.gamification)==null?void 0:l.state)==null?void 0:d.badges)??[]}}catch(c){console.error("[Core] loadCurrentUser failed:",c)}},initializeModules(){var e;const s=[{name:"Rituals",instance:window.Rituals},{name:"ProfileModule",instance:window.ProfileModule},{name:"CommunityModule",instance:window.CommunityModule}];for(const{name:t,instance:i}of s)if(i!=null&&i.init)try{i.init()}catch(n){console.error(`✗ [Core] ${t} init failed:`,n)}else console.warn(`⚠ [Core] ${t} not found or missing init()`);(e=window.ActiveMembers)!=null&&e.render?window.ActiveMembers.render().catch(t=>console.error("✗ [Core] ActiveMembers.render() failed:",t)):console.warn("⚠ [Core] ActiveMembers not found")},_injectAdminUIAll(){for(const s of this.config.ADMIN_MODULES){const e=window[s];if(e!=null&&e.injectAdminUI)try{e.injectAdminUI()}catch(t){console.warn(`[Core] injectAdminUI failed on ${s}:`,t)}}},handleInitializationError(s){this.showToast("Failed to initialize. Please refresh the page."),console.error("[Core] Init error details:",{message:s.message,stack:s.stack,state:this.state})},initializePracticeRooms(){const s=[];for(const e of this.config.ROOM_MODULES){const t=window[e];if(!t){console.warn(`⚠ [Core] ${e} not found on window`);continue}if(!t.init){console.warn(`⚠ [Core] ${e} missing init()`);continue}try{t.init(),s.push(t)}catch(i){console.error(`✗ [Core] ${e} init failed:`,i)}}window.PracticeRoom&&s.length&&PracticeRoom.startHubPresence(s)},scheduleRoomRendering(){setTimeout(()=>{try{this.renderRooms()}catch(s){console.error("[Core] Room rendering failed:",s)}},this.config.RENDER_DELAY)},renderRooms(){const s=document.getElementById("roomsGrid");if(!s){console.warn("[Core] #roomsGrid not found - skipping render");return}const e=this.config.ROOM_MODULES.reduce((t,i)=>{const n=window[i];if(!(n!=null&&n.getRoomCardHTML))return console.warn(`⚠ [Core] ${i} missing getRoomCardHTML()`),t;try{const o=n.getRoomCardHTML();o&&t.push(o)}catch(o){console.error(`✗ [Core] getRoomCardHTML failed for ${i}:`,o)}return t},[]);e.length?s.innerHTML=e.join(""):console.warn("[Core] No room cards to render")},scheduleCelestialInit(){setTimeout(()=>{try{this.initializeCelestialSystems()}catch(s){console.error("[Core] Celestial init failed:",s)}},this.config.CELESTIAL_INIT_DELAY)},initializeCelestialSystems(){const s=e=>{if(typeof SunCalc>"u"){e>0?setTimeout(()=>s(e-1),200):console.error("[Core] SunCalc never loaded - celestial systems unavailable");return}for(const[t,i]of[["LunarEngine",window.LunarEngine],["SolarEngine",window.SolarEngine]])if(i!=null&&i.init)try{i.init()}catch(n){console.error(`✗ [Core] ${t} init failed:`,n)}else console.warn(`⚠ [Core] ${t} not found`)};s(this.config.CELESTIAL_POLL_MAX)},navigateTo(s){var e,t;try{const i=document.getElementById("communityHubFullscreenContainer"),n=document.getElementById("community-hub-tab");s==="hubView"?(i&&(i.style.display="none"),n&&(n.style.display="block"),document.body.style.overflow="",document.querySelectorAll("#hubView").forEach(o=>o.classList.add("active")),this.state.currentView="hubView"):s==="practiceRoomView"?(i&&(i.style.display="flex",(e=i.querySelector("#openingOverlay"))==null||e.classList.remove("active"),(t=i.querySelector("#closingOverlay"))==null||t.classList.remove("active")),n?n.style.display="none":console.error("[Core] Hub tab element not found"),document.body.style.overflow="hidden",this.state.currentView="practiceRoomView"):console.warn(`[Core] Unknown viewId: "${s}"`)}catch(i){console.error("[Core] Navigation error:",i)}},setupEventListeners(){document.addEventListener("click",s=>{s.target.classList.contains("modal-overlay")&&s.target.classList.remove("active")}),document.addEventListener("keydown",s=>{var e;s.key==="Escape"&&((e=document.querySelector(".modal-overlay.active"))==null||e.classList.remove("active"))})},async updatePresenceCount(){this.state.presenceInterval&&clearInterval(this.state.presenceInterval);const s=async()=>{try{if(!v.ready)return;const e=await v.getActiveMembers();this.state.presenceCount=e.length;const t=document.getElementById("presenceCount");t&&(t.textContent=e.length)}catch(e){console.error("[Core] updatePresenceCount error:",e)}};await s(),this.state.presenceInterval=setInterval(s,this.config.PRESENCE_INTERVAL)},sendPulse(){if(this.state.pulseSent){this.showToast("Please wait before sending another pulse");return}this.state.pulseSent=!0,this.showToast("Pulse sent to the community"),setTimeout(()=>{this.state.pulseSent=!1},this.config.PULSE_COOLDOWN)},showToast(s,e=3e3){const t=document.getElementById("toast");if(!t){console.warn("[Core] #toast element not found");return}t.textContent=s,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),e)},initializeSafetyModals(){document.getElementById("reportModal")||document.body.insertAdjacentHTML("beforeend",`
            <!-- Report Modal -->
            <div class="modal-overlay" id="reportModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close report modal" onclick="CommunityModule.closeReportModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> Report Issue</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Help us maintain a safe space. Your report is confidential.</p>
                        <label for="reportReason" style="display:block; margin-bottom:8px; font-weight:600;">Reason:</label>
                        <select id="reportReason" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;">
                            <option value="">Select a reason...</option>
                            <option value="harassment">Harassment or bullying</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="spam">Spam or advertising</option>
                            <option value="safety">Safety concern</option>
                            <option value="other">Other</option>
                        </select>
                        <label for="reportDetails" style="display:block; margin-bottom:8px; font-weight:600;">Details (optional):</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide any additional context..." style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); resize:vertical; margin-bottom:16px;"></textarea>
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeReportModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.submitReport()" style="flex:1; padding:12px; background:var(--accent); color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Submit Report</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Block Modal -->
            <div class="modal-overlay" id="blockModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close block modal" onclick="CommunityModule.closeBlockModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block User</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px; color:var(--text-muted);">Blocking will hide all messages from this user.</p>
                        <label for="blockUsername" style="display:block; margin-bottom:8px; font-weight:600;">Username:</label>
                        <input type="text" id="blockUsername" placeholder="Enter username to block" autocomplete="off" style="width:100%; padding:10px; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--surface); color:var(--text); margin-bottom:16px;" />
                        <div style="display:flex; gap:12px;">
                            <button type="button" onclick="CommunityModule.closeBlockModal()" style="flex:1; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Cancel</button>
                            <button type="button" onclick="CommunityModule.confirmBlock()" style="flex:1; padding:12px; background:#e74c3c; color:white; border:none; border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Block User</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Help Modal -->
            <div class="modal-overlay" id="helpModal">
                <div class="modal-card">
                    <button type="button" class="modal-close" aria-label="Close help modal" onclick="CommunityModule.closeHelpModal()">×</button>
                    <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg> Get Help</h2>
                    <div class="modal-content">
                        <p style="margin-bottom:16px;">If you're experiencing a crisis or need immediate support:</p>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Crisis Resources</h3>
                            <p style="margin:8px 0;"><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988</p>
                            <p style="margin:8px 0;"><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                            <p style="margin:8px 0;"><strong>International:</strong> <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">findahelpline.com</a></p>
                        </div>
                        <div style="background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px;">
                            <h3 style="margin-top:0; font-size:16px;">Community Support</h3>
                            <p style="margin:8px 0;">Contact our moderators for non-emergency concerns</p>
                            <p style="margin:8px 0;"><strong>Email:</strong> support@community.example.com</p>
                        </div>
                        <button type="button" onclick="CommunityModule.closeHelpModal()" style="width:100%; padding:12px; border:1px solid var(--border); background:var(--surface); border-radius:var(--radius-md); cursor:pointer; font-weight:600;">Close</button>
                    </div>
                </div>
            </div>
        `)},formatTime(s){if(typeof s!="number"||s<0)return"0:00";const e=Math.floor(s/60),t=Math.floor(s%60);return`${e}:${t.toString().padStart(2,"0")}`},getAvatarGradient(s){(!s||typeof s!="string")&&(s="default");const e=s.split("").reduce((t,i)=>t+i.charCodeAt(0),0);return this.config.AVATAR_GRADIENTS[Math.abs(e)%this.config.AVATAR_GRADIENTS.length]}};window.Core=w;const pe={user:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',aries:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10c0-3.31-2.69-6-6-6"/><path d="M12 20V10c0-3.31 2.69-6 6-6"/><circle cx="6" cy="4" r="2"/><circle cx="18" cy="4" r="2"/></svg>',taurus:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="M5 9C5 6 7 3 12 3s7 3 7 6"/><path d="M9 9H4"/><path d="M20 9h-5"/></svg>',gemini:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="4" x2="8" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/><line x1="8" y1="4" x2="16" y2="4"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',cancer:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="12" r="4"/><circle cx="16" cy="12" r="4"/><path d="M4 8c0-2 1-4 4-4"/><path d="M20 16c0 2-1 4-4 4"/></svg>',leo:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4"/><path d="M12 8h4a4 4 0 0 1 0 8h-1"/><path d="M15 16v4"/></svg>',virgo:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4V8a6 6 0 0 0-12 0"/><path d="M15 16v4"/><path d="M17 16l1.5 4"/></svg>',libra:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="20" x2="21" y2="20"/><line x1="12" y1="4" x2="12" y2="16"/><path d="M6 16a6 6 0 0 0 12 0"/></svg>',scorpio:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="4" x2="6" y2="16"/><line x1="12" y1="4" x2="12" y2="16"/><line x1="18" y1="4" x2="18" y2="12"/><path d="M6 12c0 2.5 2 4 6 4s6-1.5 6-4"/><polyline points="15 9 18 12 21 9"/></svg>',sagittarius:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="12 5 19 5 19 12"/><line x1="5" y1="19" x2="12" y2="12"/></svg>',capricorn:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20V8a4 4 0 0 1 8 0v4a4 4 0 0 0 4 4h0"/><path d="M18 16l2 2-2 2"/></svg>',aquarius:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/><path d="M3 16c2-2 4 0 6 0s4-2 6 0 4 0 6 0"/></svg>',pisces:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="4" x2="12" y2="20"/><path d="M4 8c2 2 4 4 8 4s6-2 8-4"/><path d="M4 16c2-2 4-4 8-4s6 2 8 4"/></svg>',meditation:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v5l-3 3"/><path d="M12 12l3 3"/><path d="M6 17c0-2 2-4 6-4s6 2 6 4"/></svg>',moon:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',sun:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',star:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',crystal:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4-4-4z"/></svg>',butterfly:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V12"/><path d="M12 12C12 12 8 9 4 10c-3 1-3 5 0 6 2 1 5 0 8-4z"/><path d="M12 12C12 12 16 9 20 10c3 1 3 5 0 6-2 1-5 0-8-4z"/><circle cx="12" cy="5" r="2"/></svg>',leaf:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75"/><path d="M22 2C11 2 2 11 2 22c5.5 0 11-2.5 14.5-6S22 7.5 22 2z"/></svg>',flower:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M12 14a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M14 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>',om:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 0 8 0"/><circle cx="12" cy="8" r="1"/></svg>',clover:'<svg xmlns="http://www.w3.org/2000/svg" class="lucide-avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-3-6-2s-3 4-1 6 5 2 7-4z"/><path d="M12 12c2-2.5 4-3 6-2s3 4 1 6-5 2-7-4z"/><path d="M12 12c-2.5-2-3-4-2-6s4-3 6-1-2 5-4 7z"/><path d="M12 12c2.5-2 3-4 2-6s-4-3-6-1 2 5 4 7z"/><line x1="12" y1="12" x2="12" y2="22"/></svg>'},$e={"👤":"user","♈️":"aries","♉️":"taurus","♊️":"gemini","♋️":"cancer","♌️":"leo","♍️":"virgo","♎️":"libra","♏️":"scorpio","♐️":"sagittarius","♑️":"capricorn","♒️":"aquarius","♓️":"pisces","🧘‍♀️":"meditation","🌙":"moon","☀️":"sun","🌟":"star","🔮":"crystal","🦋":"butterfly","🌿":"leaf","🌸":"flower","🕉️":"om","🍀":"clover"};function Pt(s){return pe[s]||pe[s in $e?$e[s]:"user"]||pe.user}const Bt={state:{isOpen:!1,currentUserId:null,isAppreciated:!1,appreciationCount:0},_LEVEL_TITLES:{1:"Seeker",2:"Practitioner",3:"Adept",4:"Healer",5:"Master",6:"Sage",7:"Enlightened",8:"Buddha",9:"Light",10:"Emptiness"},_STATUS_RINGS:{online:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},available:{c:"var(--ring-available,#6b9b37)",s:"rgba(107,155,55,0.2)"},away:{c:"var(--ring-guiding,#e53e3e)",s:"rgba(229,62,62,0.2)"},silent:{c:"var(--ring-silent,#7c3aed)",s:"rgba(124,58,237,0.2)"},deep:{c:"var(--ring-deep,#1e40af)",s:"rgba(30,64,175,0.2)"},offline:{c:"var(--ring-offline,#9ca3af)",s:"rgba(156,163,175,0.2)"}},_RARITY_COLORS:{common:"#9ca3af",uncommon:"#10b981",rare:"#3b82f6",epic:"#a855f7",legendary:"#f59e0b"},_RARITY_LABELS:{common:"Common",uncommon:"Uncommon",rare:"Rare",epic:"Epic",legendary:"Legendary"},_COUNTRY_CODES:{israel:"IL","united states":"US",usa:"US",us:"US","united kingdom":"GB",uk:"GB",canada:"CA",australia:"AU",germany:"DE",france:"FR",spain:"ES",italy:"IT",netherlands:"NL",belgium:"BE",switzerland:"CH",sweden:"SE",norway:"NO",denmark:"DK",finland:"FI",poland:"PL",portugal:"PT",austria:"AT",india:"IN",china:"CN",japan:"JP","south korea":"KR",brazil:"BR",mexico:"MX",argentina:"AR","south africa":"ZA",russia:"RU",ukraine:"UA",greece:"GR",turkey:"TR",egypt:"EG","new zealand":"NZ",ireland:"IE",singapore:"SG",thailand:"TH",indonesia:"ID",malaysia:"MY",philippines:"PH"},_ADMIN_SUB_IDS:["adminSubRole","adminSubXp","adminSubKarma","adminSubBadge","adminSubPremium","adminSubMessage"],init(){if(document.getElementById("memberProfileModal"))return;window.addEventListener("statusChanged",e=>{var r;const{status:t}=e.detail||{};if(!t||!this.state.isOpen||!(this.state.currentUserId===((r=w.state.currentUser)==null?void 0:r.id)))return;const n=document.getElementById("memberModalStatusRing");if(!n)return;const o=this._STATUS_RINGS[t]||this._STATUS_RINGS.offline;n.style.borderColor=o.c,n.style.boxShadow=`0 0 0 3px ${o.s}`}),window.addEventListener("avatarChanged",e=>{const{userId:t,emoji:i,avatarUrl:n}=e.detail||{};if(!t||!this.state.isOpen||this.state.currentUserId!==t)return;const o=document.getElementById("memberModalAvatar");o&&(n?(o.style.background="transparent",o.innerHTML=`<img src="${n}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="avatar">`):i&&(o.style.background="",o.innerHTML=`<span>${Pt(i)}</span>`))});const s=document.createElement("div");s.innerHTML=`
            <div id="memberProfileModal"
                 class="modal-overlay"
                 role="dialog" aria-modal="true" aria-labelledby="memberModalName"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                        display:flex;align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">
                <div id="memberProfileModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:2rem;
                            max-width:380px;width:90%;position:relative;
                            max-height:90vh;overflow-y:auto;
                            box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                            transform:translateY(16px);transition:transform 0.25s ease;">

                    <button onclick="MemberProfileModal.close()" aria-label="Close"
                            style="position:absolute;top:14px;right:16px;background:none;border:none;
                                   cursor:pointer;font-size:18px;opacity:0.5;line-height:1;">✕</button>

                    <div id="memberModalLoading" style="text-align:center;padding:2rem;color:var(--text-muted);">
                        Loading...
                    </div>

                    <div id="memberModalContent" style="display:none;">

                        <!-- Avatar + name + meta row -->
                        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:1rem;">
                            <div style="position:relative;width:90px;height:90px;flex-shrink:0;">
                                <div id="memberModalAvatar"
                                     style="width:90px;height:90px;min-width:90px;min-height:90px;
                                            border-radius:50%;
                                            display:flex;align-items:center;justify-content:center;
                                            font-size:2.2rem;overflow:hidden;flex-shrink:0;"></div>
                                <div id="memberModalStatusRing"
                                     style="position:absolute;top:-7px;left:-7px;
                                            width:calc(100% + 14px);height:calc(100% + 14px);
                                            border-radius:50%;border:4px solid var(--ring-available,#6b9b37);
                                            box-shadow:0 0 0 3px rgba(107,155,55,0.2);
                                            pointer-events:none;"></div>
                            </div>

                            <!-- Name -->
                            <div id="memberModalName"
                                 style="font-size:1.25rem;font-weight:800;color:var(--neuro-text);text-align:center;"></div>

                            <!-- Meta pill: Role · Birthday · Country -->
                            <div id="memberModalMetaRow"
                                 style="display:inline-flex;align-items:center;gap:0;
                                        background:var(--neuro-bg,#f0f0f3);border-radius:99px;
                                        box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                        overflow:hidden;max-width:100%;">
                                <div id="memberModalRole"
                                     style="display:flex;align-items:center;gap:5px;
                                            font-size:0.76rem;font-weight:700;
                                            color:var(--primary,#667eea);
                                            padding:5px 12px;white-space:nowrap;"></div>
                                <span id="memberModalMetaSep"
                                      style="width:1px;height:16px;background:rgba(0,0,0,0.1);flex-shrink:0;display:none;"></span>
                                <div id="memberModalLocation"
                                     style="display:flex;align-items:center;gap:0;"></div>
                            </div>
                        </div>

                        <!-- Inspiration -->
                        <div id="memberModalInspiration"
                             style="font-size:0.85rem;font-style:italic;color:var(--neuro-text-light,#555);
                                    text-align:center;margin-bottom:1rem;padding:0 0.5rem;line-height:1.5;"></div>

                        <!-- Level + XP bar -->
                        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:16px;padding:1rem 1rem 0.75rem;
                                    box-shadow:3px 3px 8px rgba(0,0,0,0.08),-2px -2px 6px rgba(255,255,255,0.7);
                                    margin-bottom:0.9rem;">
                            <div style="text-align:center;margin-bottom:0.5rem;">
                                <span id="memberModalLevel"
                                      style="font-size:1.1rem;font-weight:700;color:var(--neuro-text);"></span>
                            </div>
                            <div style="height:8px;border-radius:99px;background:rgba(0,0,0,0.07);
                                        box-shadow:inset 1px 1px 3px rgba(0,0,0,0.1);overflow:hidden;margin-bottom:0.35rem;">
                                <div id="memberModalXpBar"
                                     style="height:100%;border-radius:99px;width:0%;
                                            background:linear-gradient(90deg,var(--primary,#667eea),var(--neuro-accent,#a855f7));
                                            transition:width 0.9s cubic-bezier(0.4,0,0.2,1);"></div>
                            </div>
                            <div style="font-size:0.78rem;color:var(--text-muted);text-align:center;">
                                <span id="memberModalXP"
                                      style="font-weight:800;font-size:0.95rem;color:var(--primary,#667eea);">-</span> XP
                            </div>
                        </div>

                        <!-- 4-stat grid -->
                        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:1rem;">
                            ${[["memberModalKarma",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>',"Karma"],["memberModalBlessings",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',"Blessings"],["memberModalFavRoom",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',"Fav Room"],["memberModalBadgeCount",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',"Badges"]].map(([e,t,i])=>`
                                <div style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;
                                            padding:10px 6px;text-align:center;
                                            box-shadow:3px 3px 8px rgba(0,0,0,0.09),-2px -2px 6px rgba(255,255,255,0.7);
                                            transition:transform 0.15s;"
                                     onmouseover="this.style.transform='translateY(-2px)'"
                                     onmouseout="this.style.transform=''">
                                    <div style="font-size:1.2rem;line-height:1;margin-bottom:3px;">${t}</div>
                                    <div id="${e}" style="font-size:1rem;font-weight:800;
                                                           color:var(--primary,#667eea);line-height:1;">-</div>
                                    <div style="font-size:0.62rem;color:var(--text-muted);font-weight:600;
                                                text-transform:uppercase;letter-spacing:0.03em;margin-top:3px;">${i}</div>
                                </div>`).join("")}
                        </div>

                        <!-- Appreciate -->
                        <button id="memberModalAppreciateBtn"
                                onclick="MemberProfileModal.toggleAppreciate()"
                                style="width:100%;padding:10px;border-radius:12px;border:none;cursor:pointer;
                                       font-size:0.9rem;font-weight:600;margin-bottom:10px;
                                       background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                                       box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                       transition:all 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate
                        </button>

                        <!-- Actions -->
                        <div id="memberModalActions" style="display:flex;gap:10px;margin-bottom:1rem;">
                            <button id="memberModalWhisperBtn" onclick="MemberProfileModal.startWhisper()"
                                    style="flex:1;padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--primary,#667eea);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whisper
                            </button>
                            <button onclick="MemberProfileModal.startReport()"
                                    style="padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--text-muted,#718096);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> Report
                            </button>
                            <button onclick="MemberProfileModal.startBlock()"
                                    style="padding:10px 14px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--text-muted,#718096);
                                           box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                           transition:all 0.15s;"
                                    onmouseover="this.style.boxShadow='2px 2px 6px rgba(0,0,0,0.12),-1px -1px 4px rgba(255,255,255,0.8)';this.style.transform='translateY(1px)'"
                                    onmouseout="this.style.boxShadow='4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75)';this.style.transform=''">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg> Block
                            </button>
                        </div>

                        <!-- Whisper panel -->
                        <div id="memberModalWhisperPanel" style="display:none;margin-top:0.5rem;">
                            <textarea id="memberModalWhisperText" placeholder="Write a private message..."
                                      maxlength="500" rows="3"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);color:var(--neuro-text);box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.sendWhisper()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;font-weight:600;
                                               background:var(--primary,#667eea);color:#fff;">Send</button>
                                <button onclick="MemberProfileModal.cancelWhisper()"
                                        style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">Cancel</button>
                            </div>
                        </div>

                        <!-- Report panel -->
                        <div id="memberModalReportPanel" style="display:none;margin-top:0.5rem;">
                            <select id="memberModalReportReason"
                                    style="width:100%;padding:10px;border-radius:10px;
                                           border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                           margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                <option value="">Select a reason...</option>
                                <option value="harassment">Harassment</option>
                                <option value="spam">Spam</option>
                                <option value="inappropriate">Inappropriate content</option>
                                <option value="hate">Hate speech</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea id="memberModalReportDetails" placeholder="Additional details (optional)"
                                      maxlength="300" rows="2"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);color:var(--neuro-text);box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.submitReport()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;font-weight:600;background:#ef4444;color:#fff;">
                                    Submit Report
                                </button>
                                <button onclick="MemberProfileModal.cancelReport()"
                                        style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                                               font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">Cancel</button>
                            </div>
                        </div>

                        <!-- Admin section -->
                        <div id="memberModalAdminSection" style="display:none;margin-top:1rem;">
                            <div onclick="MemberProfileModal._toggleAdminPanel()"
                                 style="display:flex;align-items:center;justify-content:space-between;
                                        padding:10px 14px;border-radius:12px;cursor:pointer;
                                        background:rgba(var(--neuro-accent-rgb, 168,85,247),0.08);border:2px dashed rgba(var(--neuro-accent-rgb, 168,85,247),0.4);
                                        user-select:none;">
                                <span style="font-size:0.78rem;font-weight:700;text-transform:uppercase;
                                             letter-spacing:1px;color:var(--neuro-accent);"style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admin Controls</span>
                                <span id="memberModalAdminToggle" style="font-size:0.75rem;color:var(--neuro-accent);">▶</span>
                            </div>

                            <div id="memberModalAdminBody" style="display:none;margin-top:10px;">
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
                                    ${[["role","👤 Change Role"],["xp","⭐ Send XP"],["karma","🌀 Send Karma"],["badge","🎖️ Send Badge"],["premium","🔓 Unlock Premium"],["message","📩 Send Message"]].map(([e,t])=>`<button onclick="MemberProfileModal._openAdminSub('${e}')"
                                                style="padding:9px 6px;border-radius:10px;border:none;cursor:pointer;
                                                       font-size:0.82rem;font-weight:600;
                                                       background:rgba(var(--neuro-accent-rgb, 168,85,247),0.1);color:var(--neuro-accent);">
                                            ${t}
                                        </button>`).join("")}
                                </div>

                                <!-- Sub: Change Role -->
                                <div id="adminSubRole" style="display:none;" class="admin-sub-panel">
                                    <select id="adminRoleSelect"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        <option>Member</option><option>Moderator</option>
                                        <option>Guide</option><option>Elder</option><option>VIP</option><option>Admin</option>
                                    </select>
                                    ${this._adminSubFooter("_adminChangeRole","Save Role")}
                                </div>

                                <!-- Sub: Send XP -->
                                <div id="adminSubXp" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminXpAmount" min="1" value="100" placeholder="XP amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendXP","Send XP")}
                                </div>

                                <!-- Sub: Send Karma -->
                                <div id="adminSubKarma" style="display:none;" class="admin-sub-panel">
                                    <input type="number" id="adminKarmaAmount" min="1" value="50" placeholder="Karma amount"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    ${this._adminSubFooter("_adminSendKarma","Send Karma")}
                                </div>

                                <!-- Sub: Send Badge -->
                                <div id="adminSubBadge" style="display:none;" class="admin-sub-panel">
                                    <select id="adminBadgeSelect"
                                            style="width:100%;padding:9px;border-radius:10px;margin-bottom:8px;
                                                   border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                   background:var(--neuro-bg);color:var(--neuro-text);">
                                        <option value="early_supporter"  data-icon="🌟" data-rarity="epic"      data-xp="100" data-desc="Joined during early access">🌟 Early Supporter</option>
                                        <option value="vip_member"       data-icon="👑" data-rarity="legendary" data-xp="150" data-desc="VIP community member">👑 VIP Member</option>
                                        <option value="beta_tester"      data-icon="🧪" data-rarity="rare"      data-xp="100" data-desc="Helped test new features">🧪 Beta Tester</option>
                                        <option value="spiritual_guide"  data-icon="🕉️" data-rarity="epic"      data-xp="150" data-desc="Community mentor and guide">🕉️ Spiritual Guide</option>
                                        <option value="community_hero"   data-icon="🦸" data-rarity="legendary" data-xp="200" data-desc="Outstanding community contribution">🦸 Community Hero</option>
                                    </select>
                                    ${this._adminSubFooter("_adminSendBadge","Award Badge")}
                                </div>

                                <!-- Sub: Unlock Premium -->
                                <div id="adminSubPremium" style="display:none;" class="admin-sub-panel">
                                    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;
                                                max-height:160px;overflow-y:auto;padding:4px 0;">
                                        ${[["advance_tarot_spreads","Advanced Tarot Spreads"],["tarot_vision_ai","Tarot Vision AI"],["shadow_alchemy_lab","Shadow Alchemy Lab"],["advanced_meditations","Advanced Meditations"],["luxury_blush_champagne_skin","Blush Champagne Skin"],["luxury_champagne_gold_skin","Champagne Gold Skin"],["luxury_marble_bronze_skin","Marble Bronze Skin"],["royal_indigo_skin","Royal Indigo Skin"],["earth_luxury_skin","Earth Luxury Skin"]].map(([e,t])=>`<label style="display:flex;align-items:center;gap:8px;font-size:0.83rem;cursor:pointer;">
                                                <input type="checkbox" value="${e}"> ${t}
                                            </label>`).join("")}
                                    </div>
                                    ${this._adminSubFooter("_adminUnlockPremium","Unlock Selected")}
                                </div>

                                <!-- Sub: Send Message -->
                                <div id="adminSubMessage" style="display:none;" class="admin-sub-panel">
                                    <input type="text" id="adminMessageTitle" placeholder="Message title" maxlength="100"
                                           style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                  border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                                  margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);">
                                    <textarea id="adminMessageContent" placeholder="Write your message..." rows="3" maxlength="1000"
                                              style="width:100%;padding:9px;border-radius:10px;box-sizing:border-box;
                                                     border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;resize:none;
                                                     margin-bottom:8px;background:var(--neuro-bg);color:var(--neuro-text);"></textarea>
                                    ${this._adminSubFooter("_adminSendMessage","Send Message")}
                                </div>

                            </div>
                        </div>

                    </div><!-- /content -->
                </div><!-- /inner -->
            </div><!-- /modal -->`,document.body.appendChild(s.firstElementChild),document.getElementById("memberProfileModal").addEventListener("click",e=>{e.target.id==="memberProfileModal"&&this.close()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.state.isOpen&&this.close()})},_adminSubFooter(s,e){return`<div style="display:flex;gap:8px;">
            <button onclick="MemberProfileModal.${s}()"
                    style="flex:1;padding:8px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;font-weight:600;background:var(--neuro-accent);color:#fff;">
                ${e}
            </button>
            <button onclick="MemberProfileModal._closeAdminSubs()"
                    style="padding:8px 14px;border-radius:10px;border:none;cursor:pointer;
                           font-size:0.88rem;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                           color:var(--neuro-text);">Cancel</button>
        </div>`},async open(s){var r,l;if(this.init(),!s)return;const e=s===((r=w.state.currentUser)==null?void 0:r.id);this.state.currentUserId=s,this.state.isOpen=!0;const t=document.getElementById("memberProfileModal"),i=document.getElementById("memberProfileModalInner"),n=document.getElementById("memberModalLoading"),o=document.getElementById("memberModalContent");this._hideActionPanels(),n.style.display="block",o.style.display="none",t.style.display="flex",requestAnimationFrame(()=>{t.style.opacity="1",i.style.transform="translateY(0)"}),document.body.style.overflow="hidden";try{const d=await v.getProfile(s);if(!d){w.showToast("Could not load member profile"),this.close();return}if(this._populate(d),!e){const m=v.subscribeToPresence(g=>{const y=g.find(k=>k.user_id===s);if(!y||!this.state.isOpen)return;const b=document.getElementById("memberModalStatusRing");if(!b)return;const S=this._STATUS_RINGS[y.status]||this._STATUS_RINGS.offline;b.style.borderColor=S.c,b.style.boxShadow=`0 0 0 3px ${S.s}`});this._presenceUnsub=()=>{try{m==null||m.unsubscribe()}catch{}}}const c=document.getElementById("memberModalActions"),u=document.getElementById("memberModalAppreciateBtn");c&&(c.style.display=e?"none":"flex"),u&&(u.style.display=e?"none":"block");const h=document.getElementById("memberModalAdminSection"),p=((l=w.state.currentUser)==null?void 0:l.is_admin)===!0;if(h){if(h.style.display=p?"block":"none",p&&d.community_role){const b=document.getElementById("adminRoleSelect");b&&(b.value=d.community_role)}const m=document.getElementById("memberModalAdminBody"),g=document.getElementById("memberModalAdminToggle");m&&(m.style.display="none"),g&&(g.textContent="▶"),this._closeAdminSubs();const y=document.querySelector(`button[onclick*="_openAdminSub('role')"]`);y&&(y.style.display=e?"none":"inline-block")}e||(this.state.isAppreciated=!1,this.state.appreciationCount=0,this._updateAppreciateBtn(),Promise.all([v.getMyUserAppreciations(),v.getUserAppreciationCount(s)]).then(([m,g])=>{this.state.isAppreciated=m.has(s),this.state.appreciationCount=g,this._updateAppreciateBtn()}).catch(()=>{})),v.getUserProgress(s).then(m=>{m&&this._populateGamification(m)}).catch(()=>{}),this._loadMemberCommunityStats(s).catch(()=>{}),n.style.display="none",o.style.display="block"}catch(d){console.error("[MemberProfileModal] open error:",d),w.showToast("Could not load member profile"),this.close()}},close(){const s=document.getElementById("memberProfileModal"),e=document.getElementById("memberProfileModalInner");s&&(s.style.opacity="0",e.style.transform="translateY(16px)",setTimeout(()=>{s.style.display="none",this.state.isOpen=!1,this.state.currentUserId=null,document.body.style.overflow="",this._hideActionPanels(),this._presenceUnsub&&(this._presenceUnsub(),this._presenceUnsub=null)},250))},_populate(s){const e=document.getElementById("memberModalAvatar");e&&(s.avatar_url?(e.style.background="transparent",e.innerHTML=`<img src="${s.avatar_url}" loading="lazy" decoding="async" width="80" height="80"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
                    alt="${this._esc(s.name)}">`):(e.style.background=w.getAvatarGradient(s.id),e.innerHTML=`<span>${this._esc(s.emoji||(s.name||"?").charAt(0).toUpperCase())}</span>`));const t=document.getElementById("memberModalStatusRing");if(t){const o=this._STATUS_RINGS[s.community_status]||this._STATUS_RINGS.offline;t.style.borderColor=o.c,t.style.boxShadow=`0 0 0 3px ${o.s}`}this._setText("memberModalName",s.name||"Member"),this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${s.community_role||"Member"}`),this._setText("memberModalInspiration",s.inspiration?`"${s.inspiration}"`:"");const i=document.getElementById("memberModalLocation"),n=document.getElementById("memberModalMetaSep");if(i){const o=[];if(s.birthday)try{const r=new Date(s.birthday+"T00:00:00");o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${r.toLocaleDateString(void 0,{month:"long",day:"numeric"})}`)}catch{o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${s.birthday}`)}s.country&&o.push(`${this._countryFlag(s.country)} ${s.country}`),o.length?(i.innerHTML=o.map((r,l)=>`${l>0?'<span style="width:1px;height:16px;background:rgba(0,0,0,0.1);flex-shrink:0;display:inline-block;"></span>':""}
                     <span style="font-size:0.76rem;font-weight:600;color:var(--text-muted);padding:5px 12px;white-space:nowrap;">${r}</span>`).join(""),n&&(n.style.display="")):(i.innerHTML="",n&&(n.style.display="none"))}},_populateGamification(s){const e=this._LEVEL_TITLES[s.level]||"Seeker",t=e.match(/^[aeiou]/i)?"An":"A",i=document.getElementById("memberModalLevel");i&&(i.textContent=`${t} ${e} - Level ${s.level}`);const n=document.getElementById("memberModalXpBar");if(n){const o=[0,800,2e3,4200,7e3,12e3,3e4,6e4,18e4,45e4],r=o[s.level-1]||0,l=o[s.level]||o[o.length-1],d=l>r?Math.min(100,Math.round((s.xp-r)/(l-r)*100)):100;requestAnimationFrame(()=>{n.style.width=d+"%"})}this._setText("memberModalXP",(s.xp??0).toLocaleString()),this._setText("memberModalKarma",(s.karma??0).toLocaleString()),this._setText("memberModalBadgeCount",(s.badges||[]).length)},async _loadMemberCommunityStats(s){if(!v.ready)return;const e=v._sb;try{const[t,i]=await Promise.all([e.from("room_blessings").select("*",{count:"exact",head:!0}).eq("user_id",s),e.from("room_entries").select("room_id").eq("user_id",s)]);this._setText("memberModalBlessings",!t.error&&t.count!=null?t.count.toLocaleString():"0");const n=i.data;if(!i.error&&(n!=null&&n.length)){const o={};for(const l of n)o[l.room_id]=(o[l.room_id]||0)+1;const r=Object.entries(o).sort((l,d)=>d[1]-l[1])[0][0];this._setText("memberModalFavRoom",r.replace(/-/g," ").replace(/\b\w/g,l=>l.toUpperCase()))}else this._setText("memberModalFavRoom","-")}catch(t){console.warn("[MemberProfileModal] _loadMemberCommunityStats:",t)}},async toggleAppreciate(){const s=document.getElementById("memberModalAppreciateBtn");if(!(!s||!this.state.currentUserId)){s.disabled=!0;try{const e=await v.toggleUserAppreciation(this.state.currentUserId,this.state.isAppreciated);if(!e){w.showToast("Could not update - please try again");return}this.state.isAppreciated=e.appreciated,this.state.appreciationCount=await v.getUserAppreciationCount(this.state.currentUserId),this._updateAppreciateBtn(),w.showToast(e.appreciated?"Appreciation sent":"Appreciation removed")}catch(e){console.error("[MemberProfileModal] toggleAppreciate error:",e),w.showToast("Could not update - please try again")}finally{s.disabled=!1}}},_updateAppreciateBtn(){const s=document.getElementById("memberModalAppreciateBtn");if(!s)return;const e=this.state.appreciationCount??"",t=e!==""?` (${e})`:"";this.state.isAppreciated?(s.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciated${t}`,s.style.background="var(--primary,#667eea)",s.style.color="#fff",s.style.boxShadow="inset 2px 2px 5px rgba(0,0,0,0.15)"):(s.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg> Appreciate${t}`,s.style.background="var(--neuro-bg,#f0f0f3)",s.style.color="var(--neuro-text)",s.style.boxShadow="3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7)")},startWhisper(){var e;this._hideActionPanels();const s=document.getElementById("memberModalWhisperPanel");s&&(s.style.display="block",(e=document.getElementById("memberModalWhisperText"))==null||e.focus())},cancelWhisper(){const s=document.getElementById("memberModalWhisperPanel");if(!s)return;s.style.display="none";const e=document.getElementById("memberModalWhisperText");e&&(e.value="")},async sendWhisper(){const s=document.getElementById("memberModalWhisperText"),e=s==null?void 0:s.value.trim();if(!e){w.showToast("Please write a message first");return}await this._withBtnState("#memberModalWhisperPanel button","Sending...","Send",async()=>{await v.sendWhisper(this.state.currentUserId,e)?(w.showToast("Whisper sent"),this.cancelWhisper()):w.showToast("Could not send - please try again")})},startReport(){var s;this._hideActionPanels(),(s=document.getElementById("memberModalReportPanel"))!=null&&s.style&&(document.getElementById("memberModalReportPanel").style.display="block")},cancelReport(){const s=document.getElementById("memberModalReportPanel");if(!s)return;s.style.display="none";const e=document.getElementById("memberModalReportReason"),t=document.getElementById("memberModalReportDetails");e&&(e.value=""),t&&(t.value="")},async submitReport(){var t,i;const s=(t=document.getElementById("memberModalReportReason"))==null?void 0:t.value,e=((i=document.getElementById("memberModalReportDetails"))==null?void 0:i.value.trim())||"";if(!s){w.showToast("Please select a reason");return}await this._withBtnState("#memberModalReportPanel button","Submitting...","Submit Report",async()=>{await v.submitReport(this.state.currentUserId,s,e)?(w.showToast("Report submitted - thank you"),this.cancelReport()):w.showToast("Could not submit - please try again")})},async startBlock(){var e,t;const s=((e=document.getElementById("memberModalName"))==null?void 0:e.textContent)||"this member";if(confirm(`Block ${s}? Their content will be hidden from you.`))try{await v.blockUser(this.state.currentUserId)?(w.showToast(`${s} blocked`),this.close(),(t=window.ActiveMembers)==null||t.refresh()):w.showToast("Could not block - please try again")}catch(i){console.error("[MemberProfileModal] blockUser error:",i),w.showToast("Could not block - please try again")}},_toggleAdminPanel(){const s=document.getElementById("memberModalAdminBody"),e=document.getElementById("memberModalAdminToggle");if(!s)return;const t=s.style.display!=="none";s.style.display=t?"none":"block",e.textContent=t?"▶":"▼",t&&this._closeAdminSubs()},_openAdminSub(s){this._closeAdminSubs();const e=document.getElementById(`adminSub${s.charAt(0).toUpperCase()+s.slice(1)}`);e&&(e.style.display="block")},_closeAdminSubs(){for(const s of this._ADMIN_SUB_IDS){const e=document.getElementById(s);e&&(e.style.display="none")}},async _adminChangeRole(){var e;const s=(e=document.getElementById("adminRoleSelect"))==null?void 0:e.value;!s||!this.state.currentUserId||await this._withBtnState("#adminSubRole button","Saving...","Save Role",async()=>{const t={community_role:s};s==="VIP"?t.is_vip=!0:t.is_vip=!1,s==="Admin"?t.is_admin=!0:t.is_admin=!1;const{error:i}=await v._sb.rpc("admin_update_profile",{target_user_id:this.state.currentUserId,new_role:t.community_role,new_is_vip:t.is_vip,new_is_admin:t.is_admin});if(i)throw i;this._setHTML("memberModalRole",`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${s}`),await this._adminPushNotify(this.state.currentUserId,"👤 Role Updated",`Your community role has been changed to ${s}.`),w.showToast(`Role changed to ${s}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendXP(){var e;const s=parseInt((e=document.getElementById("adminXpAmount"))==null?void 0:e.value,10);if(!s||s<1){w.showToast("Enter a valid XP amount");return}await this._withBtnState("#adminSubXp button","Sending...","Send XP",async()=>{if(!await v.adminUpdateGamification(this.state.currentUserId,{xpDelta:s}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${s} XP!`),w.showToast(`Sent ${s} XP`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendKarma(){var e;const s=parseInt((e=document.getElementById("adminKarmaAmount"))==null?void 0:e.value,10);if(!s||s<1){w.showToast("Enter a valid Karma amount");return}await this._withBtnState("#adminSubKarma button","Sending...","Send Karma",async()=>{if(!await v.adminUpdateGamification(this.state.currentUserId,{karmaDelta:s}))throw new Error("Save failed");await this._adminPushNotify(this.state.currentUserId,"🎁 Gift from Aanandoham!",`You received +${s} Karma!`),w.showToast(`Sent ${s} Karma`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendBadge(){var t;const s=(t=document.getElementById("adminBadgeSelect"))==null?void 0:t.selectedOptions[0];if(!s)return;const e={id:s.value,name:s.textContent.replace(/^.+? /,"").trim(),icon:s.dataset.icon||"🏅",rarity:s.dataset.rarity||"common",xp:parseInt(s.dataset.xp,10)||0,description:s.dataset.desc||""};await this._withBtnState("#adminSubBadge button","Awarding...","Award Badge",async()=>{const{data:i}=await v._sb.from("user_progress").select("payload").eq("user_id",this.state.currentUserId).single(),n=(i==null?void 0:i.payload)||{},o=n.badges||[];if(o.find(l=>l.id===e.id)){w.showToast("Member already has this badge");return}o.push({...e,date:new Date().toISOString(),unlocked:!0});const{error:r}=await v._sb.from("user_progress").update({payload:{...n,badges:o},updated_at:new Date().toISOString()}).eq("user_id",this.state.currentUserId);if(r)throw r;await this._adminPushNotify(this.state.currentUserId,"🎖️ New Badge Earned!",`You received the ${e.name} badge!`),w.showToast(`Awarded ${e.icon} ${e.name}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminUnlockPremium(){const s=[...document.querySelectorAll("#adminSubPremium input[type=checkbox]:checked")].map(e=>e.value);if(!s.length){w.showToast("Select at least one feature");return}await this._withBtnState("#adminSubPremium button","Unlocking...","Unlock Selected",async()=>{let e=0;const t=[];for(const n of s)await v.adminUpdateGamification(this.state.currentUserId,{unlockFeature:n})?e++:t.push(n);if(t.length&&console.warn("[AdminPanel] Failed to unlock:",t),!e)throw new Error("All unlocks failed");const i=s.map(n=>n.replace(/_/g," ").replace(/\b\w/g,o=>o.toUpperCase())).join(", ");await this._adminPushNotify(this.state.currentUserId,"🔓 New Features Unlocked!",`Admin unlocked: ${i}`),w.showToast(`Unlocked ${e}/${s.length} feature(s)${t.length?` (${t.length} failed)`:""}`),this._closeAdminSubs(),await this._safeRefresh(this.state.currentUserId)})},async _adminSendMessage(){var t,i;const s=(t=document.getElementById("adminMessageTitle"))==null?void 0:t.value.trim(),e=(i=document.getElementById("adminMessageContent"))==null?void 0:i.value.trim();if(!s){w.showToast("Please enter a message title");return}if(!e){w.showToast("Please enter a message");return}await this._withBtnState("#adminSubMessage button","Sending...","Send Message",async()=>{const{data:n}=await v._sb.from("user_progress").select("payload").eq("user_id",this.state.currentUserId).single(),o=(n==null?void 0:n.payload)||{},r=o.adminMessages||[];r.push({id:Date.now()+Math.random(),title:s,content:e,date:new Date().toISOString(),read:!1});const{error:l}=await v._sb.from("user_progress").update({payload:{...o,adminMessages:r},updated_at:new Date().toISOString()}).eq("user_id",this.state.currentUserId);if(l)throw l;const d=e.length>80?e.slice(0,80)+"...":e;await this._adminPushNotify(this.state.currentUserId,`💬 ${s}`,d),w.showToast("Message sent"),this._closeAdminSubs(),document.getElementById("adminMessageTitle").value="",document.getElementById("adminMessageContent").value=""})},async _safeRefresh(s){var i,n,o,r,l,d,c,u,h;const e=(i=w.state.currentUser)==null?void 0:i.id;if(s===e){const p=(n=window.app)==null?void 0:n.gamification;p!=null&&p.saveTimeout&&(clearTimeout(p.saveTimeout),p.saveTimeout=null),(r=(o=window.DB)==null?void 0:o.clearCache)==null||r.call(o),(c=(d=(l=window.app)==null?void 0:l.state)==null?void 0:d.clearCache)==null||c.call(d);try{const m=await v.getUserProgress(s);m&&(p!=null&&p.state)&&(m.xp!==void 0&&(p.state.xp=m.xp),m.karma!==void 0&&(p.state.karma=m.karma),m.level!==void 0&&(p.state.level=m.level),Array.isArray(m.badges)&&(p.state.badges=m.badges),Array.isArray(m.unlockedFeatures)&&(p.state.unlockedFeatures=m.unlockedFeatures)),m&&((h=(u=window.app)==null?void 0:u.state)!=null&&h.data)&&(m.xp!==void 0&&(window.app.state.data.xp=m.xp),m.karma!==void 0&&(window.app.state.data.karma=m.karma),m.level!==void 0&&(window.app.state.data.level=m.level),Array.isArray(m.badges)&&(window.app.state.data.badges=m.badges),Array.isArray(m.unlockedFeatures)&&(window.app.state.data.unlockedFeatures=m.unlockedFeatures))}catch(m){console.warn("[_safeRefresh] pre-patch failed:",m)}}await this._refreshMainProfileStats(s)},async _refreshMainProfileStats(s){var e,t,i,n,o,r;try{const l=(e=w.state.currentUser)==null?void 0:e.id;if(!l)return;const d=s||l,c=await v.getUserProgress(d);if(!c)return;if(d===l){c.xp!==void 0&&(w.state.currentUser.xp=c.xp),c.karma!==void 0&&(w.state.currentUser.karma=c.karma),c.level!==void 0&&(w.state.currentUser.level=c.level),await((n=(i=(t=window.app)==null?void 0:t.gamification)==null?void 0:i.reloadFromDatabase)==null?void 0:n.call(i));const u=document.getElementById("profileGamificationXP");u&&c.xp!==void 0&&(u.textContent=c.xp.toLocaleString()),(r=(o=window.ProfileModule)==null?void 0:o.refreshGamification)==null||r.call(o)}this._populateGamification(c)}catch(l){console.warn("[AdminPanel] _refreshMainProfileStats:",l)}},async _adminPushNotify(s,e,t){try{const{data:i}=await v._sb.from("push_subscriptions").select("subscription").eq("user_id",s);if(!(i!=null&&i.length))return;await Promise.allSettled(i.map(n=>fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sub:n.subscription,payload:{title:e,body:t,icon:"/icons/icon-192x192.png",data:{url:"/"}}})}).catch(()=>{})))}catch(i){console.error("[AdminPanel] push notify error:",i)}},_hideActionPanels(){["memberModalWhisperPanel","memberModalReportPanel"].forEach(i=>{const n=document.getElementById(i);n&&(n.style.display="none")});const s=document.getElementById("memberModalWhisperText");s&&(s.value="");const e=document.getElementById("memberModalReportReason"),t=document.getElementById("memberModalReportDetails");e&&(e.value=""),t&&(t.value=""),this._closeAdminSubs()},_setText(s,e){const t=document.getElementById(s);t&&(t.textContent=e)},_setHTML(s,e){const t=document.getElementById(s);t&&(t.innerHTML=e)},async _withBtnState(s,e,t,i){const n=document.querySelector(s);n&&(n.disabled=!0,n.textContent=e);try{await i()}catch(o){console.error(`[AdminPanel] ${t} error:`,o),w.showToast(`Could not complete: ${t}`)}finally{n&&(n.disabled=!1,n.textContent=t)}},_countryFlag(s){const e=this._COUNTRY_CODES[s.toLowerCase().trim()];return e?[...e].map(t=>String.fromCodePoint(127462+t.charCodeAt(0)-65)).join(""):"🌍"},_esc(s){if(!s||typeof s!="string")return"";const e=document.createElement("div");return e.textContent=s,e.innerHTML}};window.MemberProfileModal=Bt;const Lt={state:{isOpen:!1,view:"inbox",threadPartnerId:null,threadPartnerName:null,realtimeSub:null,bgSub:null},init(){if(document.getElementById("whisperModal"))return;const s=document.createElement("div");s.innerHTML=`
            <div id="whisperModal"
                 role="dialog" aria-modal="true" aria-label="Whispers"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                        align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">

                <div id="whisperModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:0;
                            max-width:420px;width:92%;max-height:85vh;position:relative;
                            display:flex;flex-direction:column;overflow:hidden;
                            box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                            transform:translateY(16px);transition:transform 0.25s ease;">

                    <!-- Header -->
                    <div id="whisperModalHeader"
                         style="display:flex;align-items:center;gap:10px;
                                padding:1.1rem 1.25rem 1rem;
                                border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;">
                        <button id="whisperModalBack" onclick="WhisperModal._showInbox()"
                                aria-label="Back to inbox"
                                style="display:none;background:none;border:none;cursor:pointer;
                                       font-size:1.1rem;padding:0 4px;opacity:0.6;line-height:1;">←</button>
                        <div style="flex:1;">
                            <div id="whisperModalTitle"
                                 style="font-size:1rem;font-weight:700;color:var(--neuro-text);display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whispers</div>
                            <div id="whisperModalSubtitle"
                                 style="font-size:0.75rem;color:var(--text-muted);margin-top:1px;display:none;"></div>
                        </div>
                        <button onclick="WhisperModal.close()" aria-label="Close"
                                style="background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;line-height:1;padding:0;">✕</button>
                    </div>

                    <!-- Inbox view -->
                    <div id="whisperInboxView" style="flex:1;overflow-y:auto;padding:0.75rem 0;">
                        <div id="whisperInboxLoading"
                             style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading conversations...
                        </div>
                        <div id="whisperInboxEmpty"
                             style="display:none;text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
                            <div style="margin-bottom:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                            <div style="font-size:0.88rem;">No whispers yet.</div>
                            <div style="font-size:0.8rem;margin-top:4px;opacity:0.7;">Visit a member's profile to send one.</div>
                        </div>
                        <div id="whisperInboxList"></div>
                    </div>

                    <!-- Thread view -->
                    <div id="whisperThreadView"
                         style="display:none;flex:1;overflow-y:auto;
                                padding:0.75rem 1rem;flex-direction:column;gap:8px;">
                        <div id="whisperThreadLoading"
                             style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading messages...
                        </div>
                        <div id="whisperThreadMessages" style="display:flex;flex-direction:column;gap:8px;"></div>
                    </div>

                    <!-- Reply bar (thread view only) -->
                    <div id="whisperReplyBar"
                         style="display:none;padding:0.75rem 1rem 1rem;
                                border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;">
                        <div style="display:flex;gap:8px;align-items:flex-end;">
                            <textarea id="whisperReplyText" placeholder="Write a whisper..."
                                      maxlength="500" rows="2"
                                      onkeydown="WhisperModal._replyKeydown(event)"
                                      style="flex:1;padding:10px;border-radius:12px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                             resize:none;background:var(--neuro-bg);color:var(--neuro-text);
                                             box-sizing:border-box;font-family:inherit;"></textarea>
                            <button id="whisperReplyBtn" onclick="WhisperModal._sendReply()"
                                    style="padding:10px 16px;border-radius:12px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:600;
                                           background:var(--primary,#667eea);color:#fff;
                                           white-space:nowrap;align-self:flex-end;">Send</button>
                        </div>
                    </div>
                </div>
            </div>`,document.body.appendChild(s.firstElementChild),document.getElementById("whisperModal").addEventListener("click",t=>{t.target.id==="whisperModal"&&this.close()}),document.addEventListener("keydown",t=>{t.key==="Escape"&&this.state.isOpen&&this.close()});const e=()=>{v!=null&&v.ready?this.startBackgroundListener():setTimeout(e,500)};e()},async open(){this._openShared(),await this._showInbox()},async openThread(s,e,t,i){this._openShared(),await this._showThread(s,e,t,i)},_openShared(){this.init(),this._animateIn(),this.state.isOpen=!0,document.body.style.overflow="hidden",this._subscribeRealtime()},close(){const s=document.getElementById("whisperModal"),e=document.getElementById("whisperModalInner");s&&(s.style.opacity="0",e.style.transform="translateY(16px)",setTimeout(()=>{var t,i;s.style.display="none",this.state.isOpen=!1,this.state.view="inbox",this.state.threadPartnerId=null,document.body.style.overflow="",(i=(t=this.state.realtimeSub)==null?void 0:t.unsubscribe)==null||i.call(t),this.state.realtimeSub=null},250))},_animateIn(){const s=document.getElementById("whisperModal"),e=document.getElementById("whisperModalInner");s.style.display="flex",requestAnimationFrame(()=>{s.style.opacity="1",e.style.transform="translateY(0)"})},_setView(s){const e=s==="inbox";document.getElementById("whisperInboxView").style.display=e?"block":"none",document.getElementById("whisperThreadView").style.display=e?"none":"flex",document.getElementById("whisperReplyBar").style.display=e?"none":"block",document.getElementById("whisperModalBack").style.display=e?"none":"inline";const t=document.getElementById("whisperModalSubtitle");e&&(document.getElementById("whisperModalTitle").innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whispers',t.style.display="none")},async _showInbox(){this.state.view="inbox",this.state.threadPartnerId=null,this._setView("inbox");const s=document.getElementById("whisperInboxLoading"),e=document.getElementById("whisperInboxEmpty"),t=document.getElementById("whisperInboxList");s.style.display="block",e.style.display="none",t.innerHTML="";const i=await v.getWhisperInbox();if(s.style.display="none",!i.length){e.style.display="block";return}t.innerHTML=i.map(n=>this._conversationRowHTML(n)).join(""),this._setBadge(i.reduce((n,o)=>n+o.unread,0))},_conversationRowHTML(s){const e=s.partner||{},t=this._escape(e.name||"Member"),i=this._avatarHTML(e,38),n=this._escape(s.lastMessage||""),o=this._relativeTime(s.lastAt),r=this._escape(e.id||""),l=this._escape(e.emoji||""),d=this._escape(e.avatar_url||""),c=s.unread>0?`<span style="background:var(--primary,#667eea);color:#fff;border-radius:99px;
                            font-size:0.7rem;font-weight:700;padding:2px 7px;min-width:18px;
                            text-align:center;">${s.unread}</span>`:"";return`
            <div onclick="WhisperModal._showThread('${r}','${t}','${l}','${d}')"
                 style="display:flex;align-items:center;gap:12px;padding:0.75rem 1.25rem;
                        cursor:pointer;transition:background 0.15s;border-radius:0;"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">
                <div style="flex-shrink:0;">${i}</div>
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
                        <span style="font-weight:${s.unread>0?"700":"500"};font-size:0.9rem;
                                     color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${t}
                        </span>
                        <span style="font-size:0.72rem;color:var(--text-muted);flex-shrink:0;">${o}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
                        <span style="font-size:0.8rem;color:var(--text-muted);white-space:nowrap;
                                     overflow:hidden;text-overflow:ellipsis;flex:1;">${n}</span>
                        ${c}
                    </div>
                </div>
            </div>`},async _showThread(s,e,t,i){var u;this.state.view="thread",this.state.threadPartnerId=s,this.state.threadPartnerName=e,this._setView("thread");const n=document.getElementById("whisperModalTitle"),o=document.getElementById("whisperModalSubtitle");n.textContent=e,o.textContent="Private whisper thread",o.style.display="block";const r=document.getElementById("whisperThreadLoading"),l=document.getElementById("whisperThreadMessages"),d=document.getElementById("whisperThreadView");r.style.display="block",l.innerHTML="";const[c]=await Promise.all([v.getWhispers(s),v.markConversationRead(s).catch(()=>{})]);r.style.display="none",this._renderThreadMessages(c),setTimeout(()=>{d.scrollTop=d.scrollHeight},50),(u=document.getElementById("whisperReplyText"))==null||u.focus(),await this.refreshUnreadBadge()},_renderThreadMessages(s){const e=document.getElementById("whisperThreadMessages");if(!e)return;if(!s.length){e.innerHTML=`
                <div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem;">
                    No messages yet - say something ✨
                </div>`;return}const t=v._uid;e.innerHTML=s.map(i=>{var o;const n=i.sender_id===t||((o=i.sender)==null?void 0:o.id)===t;return this._messageBubbleHTML(n,this._escape(i.message),this._relativeTime(i.created_at))}).join("")},_appendMessage(s){var o,r;const e=document.getElementById("whisperThreadMessages");if(!e)return;(o=e.querySelector("[data-empty]"))==null||o.remove();const t=v._uid,i=s.sender_id===t,n=document.createElement("div");n.innerHTML=this._messageBubbleHTML(i,this._escape(s.message),this._relativeTime(s.created_at)),e.appendChild(n.firstElementChild),(r=document.getElementById("whisperThreadView"))==null||r.scrollTo({top:999999})},_messageBubbleHTML(s,e,t){return`
            <div style="display:flex;flex-direction:column;align-items:${s?"flex-end":"flex-start"};gap:2px;">
                <div style="max-width:78%;padding:9px 13px;
                            border-radius:${s?"16px 16px 4px 16px":"16px 16px 16px 4px"};
                            background:${s?"var(--primary,#667eea)":"rgba(0,0,0,0.06)"};
                            color:${s?"#fff":"var(--neuro-text)"};
                            font-size:0.88rem;line-height:1.45;word-break:break-word;">
                    ${e}
                </div>
                <span style="font-size:0.7rem;color:var(--text-muted);padding:0 4px;">${t}</span>
            </div>`},async _sendReply(){const s=document.getElementById("whisperReplyText"),e=s==null?void 0:s.value.trim();if(!e||!this.state.threadPartnerId)return;const t=document.getElementById("whisperReplyBtn");t&&(t.disabled=!0,t.textContent="..."),s.disabled=!0;try{await v.sendWhisper(this.state.threadPartnerId,e)?(s.value="",this._appendMessage({sender_id:v._uid,message:e,created_at:new Date().toISOString()})):w.showToast("Could not send - please try again")}catch(i){console.error("[WhisperModal] sendReply error:",i),w.showToast("Could not send - please try again")}finally{t&&(t.disabled=!1,t.textContent="Send"),s.disabled=!1,s.focus()}},_replyKeydown(s){s.key==="Enter"&&(s.metaKey||s.ctrlKey)&&(s.preventDefault(),this._sendReply())},_subscribeRealtime(){var s,e;(e=(s=this.state.realtimeSub)==null?void 0:s.unsubscribe)==null||e.call(s),this.state.realtimeSub=v.subscribeToWhispers(t=>{var i;this.state.view==="thread"&&t.sender_id===this.state.threadPartnerId?(this._appendMessage(t),v.markConversationRead(t.sender_id).catch(()=>{})):(w.showToast(`New whisper from ${((i=t.sender)==null?void 0:i.name)||"Someone"}`),this.state.view==="inbox"?this._showInbox():this.refreshUnreadBadge())})},async refreshUnreadBadge(){this._setBadge(await v.getUnreadWhisperCount())},_setBadge(s){const e=document.getElementById("whisperUnreadBadge");e&&(e.textContent=s>99?"99+":s,e.style.display=s>0?"inline-flex":"none")},startBackgroundListener(){this.state.bgSub||v!=null&&v.ready&&(this.refreshUnreadBadge().catch(()=>{}),this.state.bgSub=v.subscribeToWhispersBackground(s=>{this.state.isOpen&&this.state.view==="thread"&&s.sender_id===this.state.threadPartnerId||this.refreshUnreadBadge().catch(()=>{})}))},_avatarHTML(s,e=38){const t=e+"px";if(s!=null&&s.avatar_url)return`<img src="${s.avatar_url}"
                         width="48" height="48" loading="lazy" decoding="async"
                         style="width:${t};height:${t};border-radius:50%;object-fit:cover;display:block;"
                         alt="${this._escape(s.name||"")}">`;const i=w.getAvatarGradient((s==null?void 0:s.id)||""),n=(s==null?void 0:s.emoji)||((s==null?void 0:s.name)||"?").charAt(0).toUpperCase();return`<div style="width:${t};height:${t};border-radius:50%;background:${i};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(e*.45)}px;flex-shrink:0;">
                    ${this._escape(n)}
                </div>`},_relativeTime(s){if(!s)return"";const e=Date.now()-new Date(s).getTime(),t=Math.floor(e/6e4);if(t<1)return"just now";if(t<60)return`${t}m ago`;const i=Math.floor(t/60);if(i<24)return`${i}h ago`;const n=Math.floor(i/24);return n<7?`${n}d ago`:new Date(s).toLocaleDateString(void 0,{month:"short",day:"numeric"})},_escape(s){if(!s||typeof s!="string")return"";const e=document.createElement("div");return e.textContent=s,e.innerHTML}};window.WhisperModal=Lt;const Nt="/src/Mini-Apps/CommunityHub",He=["Enter with intention, leave with gratitude","This space holds you. Enter with presence.","Breathe in. You are welcome here.","Leave the noise behind. Step into stillness.","You are exactly where you need to be.","Enter gently. This moment is yours.","Set down what you carry. Enter with an open heart.","The space is ready. So are you.","Come as you are. This is a place of welcome.","Arrive fully. Begin with intention."];class Wt{constructor(e){this.app=e,this.initialized=!1}async render(){const e=document.getElementById("community-hub-tab");if(!e){console.error("[CommunityHub] Tab element not found");return}if(this.createFullscreenRoomContainer(),this.initialized||(e.innerHTML=this._buildTabHTML()),requestAnimationFrame(()=>requestAnimationFrame(()=>this._showRitualImmediately())),this.initialized?this._refreshHubPresence():(await this.initializeCommunityHub(),this.initialized=!0),this._attachHubVisibility(),window._pendingRoomOpen){const t=window._pendingRoomOpen;window._pendingRoomOpen=null;const i=window[`${t}_enterRoom`];if(typeof i=="function")i();else{const n=o=>{var r,l;((r=o.detail)==null?void 0:r.roomKey)===t&&(document.removeEventListener("practiceRoomReady",n),(l=window[`${t}_enterRoom`])==null||l.call(window))};document.addEventListener("practiceRoomReady",n),setTimeout(()=>document.removeEventListener("practiceRoomReady",n),8e3)}}}_buildTabHTML(){return`
      <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/NavCommunity.webp');
                         --header-title:'';
                         --header-tag:'A space for mindful practice and togetherness'">
            <h1>Community Hub</h1>
            <h3>A space for mindful practice and togetherness</h3>
            <span class="header-sub"></span>
          </header>

            <div class="season-flash" id="seasonFlash" aria-live="polite"></div>

            <a href="https://chat.whatsapp.com/HQGczWRf70tGqIspByIrL4"
               target="_blank" rel="noopener noreferrer"
               class="whatsapp-float"
               aria-label="Join our Community Chat on WhatsApp">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                   alt="" width="24" height="24" aria-hidden="true" role="presentation">
              <span>Join our Community Chat</span>
            </a>

            <div id="hubView" class="view active">
              <div id="profileHeroContainer"></div>

              <div class="sanctuary-content">
                <div id="activeMembersContainer"></div>
                <div id="collectiveFieldContainer"></div>
                <div id="resonanceContainer"></div>

                <section class="section" aria-labelledby="practiceSpacesTitle">
                  <div class="section-header">
                    <div class="section-title" id="practiceSpacesTitle">Practice Spaces</div>
                  </div>
                  <div class="rooms-grid" id="roomsGrid"></div>
                </section>

                <section class="section" id="celestialLunarSection" aria-labelledby="celestialCyclesTitle">
                  <div class="section-header">
                    <div class="section-title" id="celestialCyclesTitle">Celestial Cycles</div>
                  </div>
                  <div id="lunarContainer" class="celestial-container"></div>
                </section>

                <section class="section" id="celestialSolarSection" aria-label="Solar Cycles">
                  <div id="solarContainer" class="celestial-container"></div>
                </section>

                <div id="communityReflectionsContainer"></div>
                <div id="upcomingEventsContainer"></div>
              </div>
            </div>


        </div>
    `}_buildCandleSVG(e){return`
      <svg viewBox="0 0 48 70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse class="flame-outer" cx="24" cy="16" rx="7" ry="11" fill="url(#flameGradOuter-${e})" opacity="0.9"/>
        <ellipse class="flame-inner" cx="24" cy="18" rx="4.5" ry="7.5" fill="url(#flameGradInner-${e})" opacity="0.95"/>
        <ellipse class="flame-core"  cx="24" cy="20" rx="2" ry="3.5" fill="#fff9e6" opacity="0.95"/>
        <line x1="24" y1="26" x2="24" y2="29" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <rect x="14" y="29" width="20" height="34" rx="3" fill="url(#candleGrad-${e})"/>
        <path d="M14 35 Q11 38 12 43 Q13 46 14 48 L14 35Z" fill="url(#dripGrad-${e})" opacity="0.7"/>
        <path d="M34 38 Q37 41 36 46 Q35 48 34 49 L34 38Z" fill="url(#dripGrad-${e})" opacity="0.5"/>
        <ellipse cx="24" cy="29" rx="10" ry="2.5" fill="url(#topGrad-${e})"/>
        <rect x="17" y="31" width="4" height="28" rx="2" fill="white" opacity="0.08"/>
        <defs>
          <radialGradient id="flameGradOuter-${e}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#ffe066"/>
            <stop offset="50%"  stop-color="#ff9a00"/>
            <stop offset="100%" stop-color="#ff4400" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameGradInner-${e}" cx="50%" cy="80%" r="60%">
            <stop offset="0%"   stop-color="#fff5c0"/>
            <stop offset="60%"  stop-color="#ffb830"/>
            <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="candleGrad-${e}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#c8a882"/>
            <stop offset="40%"  stop-color="#e8d0b0"/>
            <stop offset="70%"  stop-color="#d4b88a"/>
            <stop offset="100%" stop-color="#b89060"/>
          </linearGradient>
          <linearGradient id="dripGrad-${e}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#e8d0b0"/>
            <stop offset="100%" stop-color="#c8a882" stop-opacity="0"/>
          </linearGradient>
          <radialGradient id="topGrad-${e}" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#f0dfc0"/>
            <stop offset="100%" stop-color="#c8a882"/>
          </radialGradient>
        </defs>
      </svg>`}_buildRitualCard({id:e,textId:t,type:i,action:n,label:o,buttonText:r}){return`
      <div class="ritual-overlay ${i}" id="${e}" role="dialog" aria-modal="true" aria-labelledby="${t}">
        <div class="ritual-card">
          <div class="ritual-candle" aria-hidden="true">${this._buildCandleSVG(i[0])}</div>
          <div class="ritual-text" id="${t}"></div>
          <button class="ritual-btn" data-action="${n}" aria-label="${o}">${r}</button>
        </div>
      </div>`}createFullscreenRoomContainer(){if(document.getElementById("communityHubFullscreenContainer"))return;const e=document.createElement("div");if(e.id="communityHubFullscreenContainer",e.style.cssText="position:fixed;inset:0;z-index:99999;background:transparent;display:none;overflow:auto;pointer-events:auto;",e.innerHTML=`
      ${this._buildRitualCard({id:"closingOverlay",textId:"closingRitualText",type:"closing",action:"ritual-closing",label:"Close gently",buttonText:"Close Gently"})}
      <div id="dynamicRoomContent" style="display:flex;flex-direction:column;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;width:100%;"></div>
    `,document.body.appendChild(e),!document.getElementById("openingOverlay")){const t=document.createElement("div");t.innerHTML=this._buildRitualCard({id:"openingOverlay",textId:"openingRitualText",type:"opening",action:"ritual-opening",label:"Enter the space",buttonText:"Enter the Space"}),(document.getElementById("app-container")||document.body).appendChild(t.firstElementChild)}}_showRitualImmediately(){var i,n;if((n=(i=window.Rituals)==null?void 0:i.state)!=null&&n.hasSeenOpening)return;const e=document.getElementById("openingOverlay");if(!e)return;const t=document.getElementById("openingRitualText");t&&(t.textContent=`"${He[Math.floor(Math.random()*He.length)]}"`),document.body.classList.add("ritual-active"),e.classList.add("active"),setTimeout(()=>{window.Rituals?window.Rituals.completeOpening():(e.classList.remove("active"),document.body.classList.remove("ritual-active"))},5e3)}_refreshHubPresence(){var e,t,i;try{(t=(e=window.PracticeRoom)==null?void 0:e._hubRooms)!=null&&t.length&&PracticeRoom.startHubPresence(),(i=window.CollectiveFieldDB)!=null&&i.refreshCount&&window.CollectiveFieldDB.refreshCount()}catch(n){console.warn("[CommunityHub] _refreshHubPresence fallback to Core.init",n),w.state.initialized=!1,w.init()}}_preloadYouTubeAPI(){var t;if((t=window.YT)!=null&&t.Player||document.querySelector('script[src*="youtube.com/iframe_api"]'))return;const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",e.async=!0,document.head.appendChild(e)}_attachHubVisibility(){this._hubVisibilityHandler||(this._hubVisibilityHandler=()=>{var e,t;if(document.hidden)(e=this._hubChatRooms)==null||e.forEach(i=>{try{v.unsubscribeFromRoomChat(i)}catch{}});else{const i=(t=w==null?void 0:w.state)==null?void 0:t.currentRoom;i&&this._hubChatResubscribe&&this._hubChatResubscribe(i)}},document.addEventListener("visibilitychange",this._hubVisibilityHandler))}registerHubChatRooms(e,t){this._hubChatRooms=e,this._hubChatResubscribe=t}loadStylesheet(e,{critical:t=!1}={}){if(document.querySelector(`link[href="${e}"]`))return;const i=document.createElement("link");i.rel="stylesheet",i.href=e,t||(i.rel="preload",i.as="style",i.onload=function(){this.rel="stylesheet"}),document.head.appendChild(i)}loadScript(e){return new Promise((t,i)=>{if(document.querySelector(`script[src="${e}"]`))return t();const n=Object.assign(document.createElement("script"),{src:e,async:!0});n.onload=t,n.onerror=()=>i(new Error(`Failed to load: ${e}`)),document.body.appendChild(n)})}_import(e){return q(()=>import(`${Nt}/${e}`),[])}_importAll(e){return Promise.all(e.map(t=>this._import(t)))}async initializeCommunityHub(){var e,t;try{if(await this.loadScript("https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js"),this._preloadYouTubeAPI(),await this._importAll(["js/rituals.js","js/profile-module.js","js/community-module.js","js/SafetyBar.js","js/AdminDashboard.js","js/collective-field-db.js","js/Rooms/PracticeRoom.js"]),await this._importAll(["js/Rooms/mixins/YouTubePlayerMixin.js","js/Rooms/mixins/CycleStateMixin.js","js/Rooms/mixins/ChatMixin.js","js/Rooms/mixins/SoundSettingsMixin.js","js/Rooms/mixins/TimerMixin.js","js/Solar/solar-config.js","js/Lunar/lunar-core.js","js/Lunar/lunar-ui.js","js/Lunar/lunar-config.js","js/Lunar/lunarengine.js","js/Rooms/mixins/TimedVideoRoom.js","js/Rooms/mixins/TabRoomMixin.js"]),(t=(e=window.LunarEngine)==null?void 0:e.init)==null||t.call(e),await this._import("js/Solar/solar-ui.js"),await this._import("js/Solar/solar-base-room.js"),await this._importAll(["js/Rooms/silent-room.js","js/Rooms/guided-room.js","js/Rooms/osho-room.js","js/Rooms/breathwork-room.js","js/Rooms/deepwork-room.js","js/Rooms/campfire-room.js","js/Rooms/tarot-room.js","js/Rooms/reiki-room.js","js/collective-field.js","js/resonance.js","js/upcoming-events.js"]),await this._import("js/Solar/solarengine.js"),!(w!=null&&w.init))throw new Error("Core module not found");w.init(),window.Rituals&&(window.Rituals.state.hasSeenOpening=!1),window.CollectiveFieldDB&&await window.CollectiveFieldDB.init()}catch(i){console.error("❌ Failed to load Community Hub:",i);const n=document.getElementById("community-hub-main-content");n&&(n.innerHTML=`
          <div class="card" style="text-align:center; padding:var(--spacing-xl)">
            <h3 style="color:var(--neuro-text)">Failed to Load</h3>
            <p style="color:var(--neuro-text-light)">Please refresh the page and try again.</p>
            <p style="color:var(--neuro-text-lighter); font-size:0.9rem; margin-top:1rem">${i.message}</p>
          </div>`)}}}const A=class A{constructor(e){this.app=e,this.messages=[],this.abortCtrl=null,this.isInitialized=!1,this.currentConversationId=null,this.conversations=[]}render(){const e=this._getOrCreateTab();if(this.isInitialized){this._showTab(e);return}e.innerHTML=this._getHTML(),this.attachHandlers(),this._startNewConversation(!1),this.isInitialized=!0}_getOrCreateTab(){let e=document.getElementById("chatbot-tab");if(!e){const t=document.getElementById("main-content");if(!t)throw new Error("Required element #main-content not found");e=document.createElement("div"),e.id="chatbot-tab",e.className="tab-content",t.appendChild(e)}return this._showTab(e),e}_showTab(e){e.classList.add("active"),e.style.display="block",e.setAttribute("aria-hidden","false")}_getHTML(){return`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('/Tabs/Chat.webp');
                         --header-title:'';
                         --header-tag:'Ask me anything about spirituality, self-development, guidance, or just chat with me'">
            <h1>Aanandoham's AI Assistant</h1>
            <h3>Ask me anything about spirituality, self-development, guidance, or just chat with me</h3>
            <span class="header-sub"></span>
          </header>

          <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 300px);min-height:500px;">

            <!-- Toolbar -->
            <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;align-items:center;">
              <button id="chatbot-history-btn" class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;min-width:52px;height:52px;padding:0 1rem;" aria-label="Conversation history">
                ${this._getHistoryIcon()} History
              </button>
              <button id="chatbot-new-btn" class="btn btn-primary" style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;min-width:52px;height:52px;padding:0 1rem;" aria-label="New conversation">
                ${this._getPlusIcon()} New Chat
              </button>
            </div>

            <!-- Messages -->
            <div class="chatbot-messages"
                 style="flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;background:var(--neuro-bg);border-radius:12px;margin-bottom:1rem;">
            </div>

            <!-- Input row -->
            <div style="display:flex;gap:0.75rem;align-items:flex-end;">
              <textarea
                id="chatbot-input"
                class="form-input"
                placeholder="Type your message/query/question…"
                rows="1"
                style="flex:1;resize:none;max-height:${A.MAX_INPUT_HEIGHT}px;min-height:${A.MIN_INPUT_HEIGHT}px;"
                aria-label="Chat message input"
              ></textarea>
              <button
                id="chatbot-send"
                class="btn btn-primary"
                style="min-width:52px;height:52px;padding:0;display:grid;place-content:center;"
                aria-label="Send message"
              >
                ${this._getSendIcon()}
              </button>
            </div>

          </div>
        </div>
      </div>

      <!-- History Modal -->
      <div id="chatbot-history-modal" role="dialog" aria-modal="true" aria-label="Conversation History"
           style="display:none;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
        <div style="background:var(--neuro-card-bg,var(--neuro-bg-secondary,var(--neuro-bg)));border-radius:16px;width:min(480px,90vw);max-height:70vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
          <div style="display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--neuro-border,rgba(255,255,255,0.08));">
            <h3 style="margin:0;font-size:1rem;color:var(--neuro-text);">Conversation History</h3>
            <button id="chatbot-history-close" aria-label="Close" style="background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.6;font-size:1.25rem;line-height:1;">✕</button>
          </div>
          <div id="chatbot-history-list" style="flex:1;overflow-y:auto;padding:0.75rem;display:flex;flex-direction:column;gap:0.4rem;">
            <p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>
          </div>
        </div>
      </div>`}attachHandlers(){const e=document.getElementById("chatbot-send"),t=document.getElementById("chatbot-input"),i=document.getElementById("chatbot-history-btn"),n=document.getElementById("chatbot-new-btn"),o=document.getElementById("chatbot-history-modal"),r=document.getElementById("chatbot-history-close");if(!e||!t){console.error("ChatBot: Required elements not found");return}e.addEventListener("click",()=>this._onSubmit()),t.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),this._onSubmit())}),t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,A.MAX_INPUT_HEIGHT)}px`}),i.addEventListener("click",()=>this._openHistoryModal()),n.addEventListener("click",()=>this._startNewConversation(!0)),r.addEventListener("click",()=>this._closeHistoryModal()),o.addEventListener("click",l=>{l.target===o&&this._closeHistoryModal()})}_startNewConversation(e=!0){this.currentConversationId=null,this.messages=[];const t=document.querySelector(".chatbot-messages");t&&(t.innerHTML=""),e?this._pushMessage(A.GREETING,"bot"):this._pushMessage(A.GREETING,"bot")}async _openHistoryModal(){const e=document.getElementById("chatbot-history-modal");e.style.display="flex",await this._loadAndRenderHistory()}_closeHistoryModal(){const e=document.getElementById("chatbot-history-modal");e.style.display="none"}async _loadAndRenderHistory(){const e=document.getElementById("chatbot-history-list");e.innerHTML='<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>';let t=[];try{const i=this._getSupabase();if(i){const{data:n,error:o}=await i.from("chat_conversations").select("id, title, created_at, updated_at").order("updated_at",{ascending:!1}).limit(50);!o&&n&&(t=n)}}catch(i){console.warn("ChatBot: Supabase history load failed, falling back to localStorage",i)}t.length||(t=this._getLSConversations().map(i=>({id:i.id,title:i.title,created_at:i.created_at,updated_at:i.updated_at}))),this.conversations=t,this._renderHistoryList(t)}_renderHistoryList(e){const t=document.getElementById("chatbot-history-list");if(!e.length){t.innerHTML='<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">No saved conversations yet.</p>';return}t.innerHTML=e.map(i=>{const n=new Date(i.updated_at||i.created_at).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),o=i.id===this.currentConversationId;return`
        <div data-convo-id="${i.id}"
             style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;cursor:pointer;
                    background:${o?"var(--neuro-accent,#7c6ef2)22":"transparent"};
                    border:1px solid ${o?"var(--neuro-accent,#7c6ef2)44":"transparent"};
                    transition:background 0.15s;"
             onmouseover="this.style.background='var(--neuro-bg,#2a2a3e)'"
             onmouseout="this.style.background='${o?"var(--neuro-accent,#7c6ef2)22":"transparent"}'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9rem;color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escapeHTML(i.title)}</div>
            <div style="font-size:0.75rem;opacity:0.45;margin-top:2px;">${n}</div>
          </div>
          <button data-delete-id="${i.id}" aria-label="Delete conversation"
                  style="background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.3;font-size:1rem;padding:0.25rem 0.4rem;margin-left:0.5rem;border-radius:6px;flex-shrink:0;"
                  onmouseover="this.style.opacity='0.8';this.style.color='#ef4444'"
                  onmouseout="this.style.opacity='0.3';this.style.color='var(--neuro-text)'">✕</button>
        </div>`}).join(""),t.querySelectorAll("[data-convo-id]").forEach(i=>{i.addEventListener("click",n=>{const o=n.target.closest("[data-delete-id]");o?(n.stopPropagation(),this._deleteConversation(o.dataset.deleteId)):this._loadConversation(i.dataset.convoId)})})}async _loadConversation(e){let t=null;try{const n=this._getSupabase();if(n){const{data:o,error:r}=await n.from("chat_conversations").select("messages").eq("id",e).single();!r&&o&&(t=o.messages)}}catch{}if(!t){const o=this._getLSConversations().find(r=>r.id===e);o&&(t=o.messages)}if(!t)return;this.currentConversationId=e,this.messages=t;const i=document.querySelector(".chatbot-messages");i&&(i.innerHTML="",t.forEach(n=>this._renderBubble(n.text,n.sender)),this._scrollToBottom(i),this._closeHistoryModal())}async _deleteConversation(e){try{const i=this._getSupabase();i&&await i.from("chat_conversations").delete().eq("id",e)}catch{}const t=this._getLSConversations().filter(i=>i.id!==e);this._saveLSConversations(t),this.currentConversationId===e&&this._startNewConversation(!1),await this._loadAndRenderHistory()}async _saveConversation(){if(!this.messages.length)return;const e=this.messages.find(r=>r.sender==="user"),i={title:e?e.text.slice(0,60)+(e.text.length>60?"…":""):"Conversation",messages:this.messages,updated_at:new Date().toISOString()};try{const r=this._getSupabase();if(r)if(this.currentConversationId)await r.from("chat_conversations").update(i).eq("id",this.currentConversationId);else{const{data:l,error:d}=await r.from("chat_conversations").insert({...i}).select("id").single();!d&&l&&(this.currentConversationId=l.id)}}catch(r){console.warn("ChatBot: Supabase save failed, using localStorage only",r)}const n=this._getLSConversations(),o=new Date().toISOString();if(this.currentConversationId){const r=n.findIndex(l=>l.id===this.currentConversationId);r>=0?n[r]={...n[r],...i}:n.unshift({id:this.currentConversationId,...i,created_at:o})}else{const r=crypto.randomUUID();this.currentConversationId=r,n.unshift({id:r,...i,created_at:o})}this._saveLSConversations(n.slice(0,100))}_onSubmit(){const e=document.getElementById("chatbot-input"),t=document.getElementById("chatbot-send"),i=e==null?void 0:e.value.trim();!i||t!=null&&t.disabled||(this._pushMessage(i,"user"),e.value="",e.style.height="auto",this._callBot(i))}_pushMessage(e,t){const i=document.querySelector(".chatbot-messages");i&&(this.messages.push({text:e,sender:t,timestamp:Date.now()}),this._renderBubble(e,t),this._scrollToBottom(i))}_renderBubble(e,t){const i=document.querySelector(".chatbot-messages");if(!i)return;const n=document.createElement("div");return n.className=`chat-bubble ${t}`,n.style.cssText=this._getBubbleStyles(t),n.textContent=e,i.appendChild(n),n}_getBubbleStyles(e){const t="padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;";return e==="user"?t+"align-self:flex-end;background:var(--neuro-accent);color:#fff;border-bottom-right-radius:0.25rem;":t+"align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);"}async _callBot(e){const t=document.getElementById("chatbot-send"),i=document.querySelector(".chatbot-messages");if(!t||!i)return;t.disabled=!0,t.innerHTML=this._getSpinnerIcon(),this.abortCtrl=new AbortController;const n=document.createElement("div");n.className="chat-bubble bot",n.style.cssText=this._getBubbleStyles("bot"),i.appendChild(n),this._scrollToBottom(i);try{const o=await fetch(A.API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e}),signal:this.abortCtrl.signal});if(!o.ok)throw new Error(await o.text());await this._streamResponse(o,n,i)}catch(o){o.name==="AbortError"?n.textContent="Request cancelled.":(console.error("ChatBot API error:",o),n.textContent=A.ERROR_MESSAGE,n.style.background="rgba(239,68,68,0.1)",n.style.borderLeft="3px solid #ef4444")}finally{t.disabled=!1,t.innerHTML=this._getSendIcon(),this.abortCtrl=null,await this._saveConversation()}}async _streamResponse(e,t,i){const n=e.body.getReader(),o=new TextDecoder;let r="";for(;;){const{done:l,value:d}=await n.read();if(l)break;r+=o.decode(d,{stream:!0}),t.textContent=r,this._scrollToBottom(i)}this.messages.push({text:r,sender:"bot",timestamp:Date.now()})}_getLSConversations(){try{return JSON.parse(localStorage.getItem(A.LS_KEY)||"[]")}catch{return[]}}_saveLSConversations(e){try{localStorage.setItem(A.LS_KEY,JSON.stringify(e))}catch(t){console.warn("ChatBot: localStorage save failed",t)}}_getSupabase(){var e,t,i;return((e=this.app)==null?void 0:e.supabase)||((i=(t=this.app)==null?void 0:t.core)==null?void 0:i.supabase)||window.supabase||null}_scrollToBottom(e){e.scrollTop=e.scrollHeight}_escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}_getSendIcon(){return'<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'}_getSpinnerIcon(){return'<div class="spinner" aria-label="Loading"></div>'}_getHistoryIcon(){return'<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'}_getPlusIcon(){return'<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'}destroy(){var e;(e=this.abortCtrl)==null||e.abort(),this.messages=[],this.isInitialized=!1,this.currentConversationId=null}};_(A,"API_URL","/api/chat"),_(A,"MAX_INPUT_HEIGHT",120),_(A,"MIN_INPUT_HEIGHT",52),_(A,"GREETING","Hello! How can I help you today my friend?"),_(A,"ERROR_MESSAGE","Sorry, something went wrong. Please try again."),_(A,"LS_KEY","chatbot_conversations");let be=A;if(!document.getElementById("chatbot-spinner-style")){const s=document.createElement("style");s.id="chatbot-spinner-style",s.textContent=`
    .spinner {
      width: 20px; height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,document.head.appendChild(s)}class qt{constructor(e){this.app=e}async render(){if(!window.affirmations)try{const t=await q(()=>import("./data-DOM1BW4p.js"),[]);window.affirmations=t.default||t.affirmations}catch(t){console.error("Failed to load affirmations:",t)}if(!window.FlipEngine)try{await q(()=>import("./engine-BhPMoS0d.js"),[])}catch(t){console.error("Failed to load FlipEngine:",t)}const e=document.getElementById("flip-script-tab");e.innerHTML=`
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

      <!--  MOBILE-ONLY IMAGE + SUBTITLE HEADER  -->
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavFlip.webp');
                     --header-title:'';
                     --header-tag:'Flip your Negative thoughts, into Positive affirmations'">
        <h1>Flip the Script</h1>
        <p class="header-subtitle">Flip your Negative thoughts, into Positive affirmations</p>
        <span class="header-sub"></span>
      </header>

      <!--  main card  -->
      <div class="card" style="padding:2rem;margin-bottom: 2rem;">
        <section class="input-section" id="input-section">
          <div class="input-layout">
            <div class="input-main">
              <div class="textarea-wrapper">
                <textarea id="negative-input" placeholder="Type or say your negative thought or belief here.." maxlength="500"></textarea>
                <button id="voice-input-btn" class="voice-input-btn" title="Speak your thought" aria-label="Speak your thought"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 19v3"/><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg></button>
                <div class="char-counter"><span id="char-count">0</span>/500 characters</div>
              </div>
            </div>
            <div class="flip-suggestions">
              <p class="suggestion-label" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Try being more specific:</p>
              <div class="suggestion-buttons-grid">
                <button class="suggestion-btn" data-text="I feel ">I feel...</button>
                <button class="suggestion-btn" data-text="I can't ">I can't...</button>
                <button class="suggestion-btn" data-text="I'm worried about ">I'm worried about...</button>
                <button class="suggestion-btn" data-text="I hate ">I hate...</button>
                <button class="suggestion-btn" data-text="I'm afraid that ">I'm afraid that...</button>
                <button class="suggestion-btn" data-text="I always ">I always...</button>
              </div>
            </div>
          </div>

          <!--  buttons with roomy gap  -->
          <div class="btn-group-vertical" style="gap:1.25rem;">
            <button id="flip-btn" class="btn primary flip-main-btn" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/></svg> Flip It Now</button>
            <button id="clear-btn" class="btn secondary clear-small-btn">Clear</button>
          </div>

          <div class="progress-wrapper hidden" id="progress-wrapper">
            <div class="progress-bar">
              <div class="progress-inner" id="progress-inner">0%</div>
            </div>
          </div>
        </section>

        <section id="output-section" class="output-main-event hidden">
          <div class="output-card">
            <div class="output-header">
              <h2 style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/></svg> Your Flipped Script</h2>
            </div>
            <div class="output-content">
              <p id="extended-flip" class="flipped-text">Your Flipped Script will appear here...</p>
            </div>
            <button id="flip-another-btn" class="btn flip-another-inside" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Flip Another Thought</button>
            <div class="action-icons">
              <button id="save-extended" class="icon-btn" title="Save" aria-label="Save flip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg></button>
              <button id="audio-extended" class="icon-btn" title="Listen" aria-label="Listen to flip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg></button>
            </div>
          </div>
        </section>
      </div>

      <!--  Saved Flips  -->
      <div class="card collapsible-card" id="saved-section">
        <button class="collapse-toggle" aria-expanded="false" style="padding: 24px; cursor: pointer; display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; text-align: left;">
          <span class="collapse-icon chevron" style="font-size: 1.5rem; transition: transform var(--transition-normal); color: var(--neuro-accent);">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--neuro-accent); flex-shrink: 0;">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">My Flips</h2>
        </button>
        <div class="collapse-content collapsed">
          <div style="padding: 0 24px 24px;">
            <div class="saved-controls" style="margin-bottom: 1rem;">
              <input type="text" id="search-saved" class="search-input w-full" placeholder="Search saved flips...">
            </div>
            <ul id="saved-list" style="margin-bottom: 1rem;"></ul>
            <div class="backup-restore flex gap-3">
              <button id="backup-id" class="btn flex-1" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Backup</button>
              <button id="restore-id" class="btn flex-1" style="display:inline-flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Restore</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!--  responsive width helper  -->
  <style>
    .fts-wrapper{
      width:100%;
      max-width:80rem;          /* 1280 px  */
      margin:0 auto;
    }
    @media (max-width:80rem){
      .fts-wrapper{ max-width:calc(100% - 3rem); } /* 100 % - 24 px  */
    }
    /*  purple gradient title card  */
    #flip-script-tab .text-center{
      background:linear-gradient(135deg,#8e44ad,#667eea);
      color:#fff;
      border-radius:var(--radius-2xl);
      padding:1.25rem 1.5rem;
      box-shadow:var(--shadow-raised-lg);
    }
    #flip-script-tab .text-center h2,
    #flip-script-tab .text-center p{ color:#fff; margin:0; }

    /*  utilities for saved-card content  */
    .w-full{width:100%;}
    .flex{display:flex;}
    .flex-1{flex:1 1 0%;}
    .gap-3{gap:0.75rem;}
    
    /* Collapsible styles */
    .collapse-content { 
      max-height: 5000px; 
      overflow: hidden; 
      transition: max-height var(--transition-slow); 
    }
    .collapse-content.collapsed { 
      max-height: 0 !important; 
    }
    .chevron { 
      font-size: 1.5rem; 
      transition: transform var(--transition-normal); 
      color: var(--neuro-accent); 
    }
    .collapse-toggle[aria-expanded="true"] .chevron { 
      transform: rotate(90deg); 
    }
  </style>
`,q(()=>import("./ui-cFve4UsT.js"),[]).then(t=>t.mountUI(this.app))}}const R=Object.freeze({MEDITATIONS:"meditations",TAROT:"tarot",ENERGY:"energy",HAPPINESS:"happiness",GRATITUDE:"gratitude",QUOTES:"quotes",AFFIRMATIONS:"affirmations",PROGRESS:"progress",FLIP_SCRIPT:"flip-script",JOURNAL:"journal",SHADOW_ALCHEMY:"shadow-alchemy",KARMA_SHOP:"karma-shop",CHATBOT:"chatbot",COMMUNITY_HUB:"community-hub"}),Ue=Object.freeze({[R.MEDITATIONS]:ze,[R.TAROT]:Ye,[R.ENERGY]:ne,[R.HAPPINESS]:se,[R.GRATITUDE]:oe,[R.QUOTES]:Mt,[R.AFFIRMATIONS]:Ve,[R.PROGRESS]:rt,[R.FLIP_SCRIPT]:qt,[R.JOURNAL]:Rt,[R.SHADOW_ALCHEMY]:Ot,[R.KARMA_SHOP]:ye,[R.CHATBOT]:be,[R.COMMUNITY_HUB]:Wt});class jt{constructor(e){if(!e)throw new Error("[Features] FeaturesManager requires app instance");this.app=e,this.engines={}}init(e){var t,i;try{const n=Ue[e];if(!n)return console.error(`[Features] Unknown feature: "${e}"`),!1;const o=(t=this.engines)[e]??(t[e]=new n(this.app));return(i=o.render)==null||i.call(o),!0}catch(n){return console.error(`[Features] Error initialising "${e}":`,n),!1}}initMultiple(e){const t=e.map(o=>({id:o,success:this.init(o)})),i=t.filter(o=>o.success).length,n=t.filter(o=>!o.success).length;return{results:t,successful:i,failed:n,total:e.length}}getEngine(e){return this.engines[e]??null}isInitialized(e){return!!this.engines[e]}getInitializedFeatures(){return Object.keys(this.engines)}getInitializedCount(){return Object.keys(this.engines).length}getAvailableFeatures(){return Object.keys(Ue)}destroy(e){var t;try{const i=this.engines[e];return i?((t=i.destroy)==null||t.call(i),delete this.engines[e],!0):(console.warn(`[Features] Cannot destroy uninitialised feature: "${e}"`),!1)}catch(i){return console.error(`[Features] Error destroying "${e}":`,i),!1}}destroyAll(){const e=Object.keys(this.engines);let t=0;return e.forEach(i=>{this.destroy(i)&&t++}),{destroyed:t,total:e.length}}getDebugInfo(){return{initialized:this.getInitializedFeatures(),initializedCount:this.getInitializedCount(),available:this.getAvailableFeatures(),availableCount:this.getAvailableFeatures().length,engines:Object.fromEntries(Object.keys(this.engines).map(e=>[e,{hasRender:typeof this.engines[e].render=="function",hasDestroy:typeof this.engines[e].destroy=="function"}]))}}}typeof window<"u"&&(window.FeaturesManager=jt,window.FEATURE_IDS=R);const H={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1},Qe={dev:{url:"https://caayiswyoynmeuimvwyn.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0"},prod:{url:"https://qfbarhxfmzpgbgkaymuk.supabase.co",anonKey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk"}};function Dt(){try{if(H!=null&&H.VITE_SUPABASE_URL)return}catch{}return Qe.prod.url}function $t(){try{if(H!=null&&H.VITE_SUPABASE_ANON_KEY)return}catch{}return Qe.prod.anonKey}const ve=Dt(),Ht=$t(),Ut={auth:{autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,storage:typeof window<"u"?window.localStorage:void 0},global:{headers:{"x-app-name":"digital-curiosity","x-app-version":"1.0.0"}},realtime:{timeout:1e4}};let U=null;try{U=tt(ve,Ht,Ut)}catch(s){console.error("[Supabase] Failed to initialise client:",s)}const ai=U;typeof window<"u"&&(window.AppSupabase=U);function we(){return U?!0:(console.error("[Supabase] Client not initialised"),!1)}async function Ke(){if(!we())return null;try{const{data:{user:s},error:e}=await U.auth.getUser();if(e)throw e;return s}catch(s){return console.error("[Supabase] getCurrentUser failed:",s),null}}async function Ft(){return!!await Ke()}async function zt(){if(!we())return!1;try{const{error:s}=await U.auth.signOut();if(s)throw s;return!0}catch(s){return console.error("[Supabase] signOut failed:",s),!1}}async function Yt(){if(!we())return!1;try{const{error:s}=await U.from("user_data").select("count",{count:"exact",head:!0});if(s&&s.code!=="PGRST116")throw s;return!0}catch(s){return console.error("[Supabase] Connection test failed:",s),!1}}function Gt(){let s=!1;try{s=!!(H!=null&&H.VITE_SUPABASE_URL)}catch{}return{url:ve,usingEnvironmentVariables:s,source:s?"Vite environment":"hardcoded fallback",initialized:!!U}}typeof window<"u"&&window.location.hostname==="localhost"&&(window.__supabase={client:U,config:Gt(),test:Yt,getCurrentUser:Ke,isAuthenticated:Ft,signOut:zt,url:ve});(()=>{const s={MAX_FILE_SIZE:4194304,ALLOWED_TYPES:["image/jpeg","image/png"],API_ROUTE:"/api/tarot-vision",RETRY_COUNT:3,TIMEOUT_MS:25e3,CAMERA_CONSTRAINTS:{video:{facingMode:"environment",width:{ideal:1920},height:{ideal:1080}},audio:!1},IMAGE_QUALITY:.92};let e={imageBase64:null,stream:null,isAnalyzing:!1},t={video:null,canvas:null,preview:null,placeholder:null,captureBtn:null,uploadBtn:null,uploadInput:null,analyzeBtn:null,resetBtn:null,result:null,loader:null};async function i(){await Promise.resolve();const f=x=>document.querySelector(x);t.video=f("#video"),t.canvas=f("#canvas"),t.preview=f("#image-preview"),t.placeholder=f("#upload-placeholder"),t.captureBtn=f("#capture-btn"),t.uploadBtn=f("#upload-btn"),t.uploadInput=f("#upload-input"),t.analyzeBtn=f("#analyze-btn"),t.resetBtn=f("#reset-btn"),t.result=f("#result"),t.loader=f("#loading-spinner"),n()}function n(){t.uploadInput.addEventListener("change",m,{passive:!0}),t.captureBtn.addEventListener("click",c,{passive:!0}),t.uploadBtn.addEventListener("click",()=>t.uploadInput.click(),{passive:!0}),t.analyzeBtn.addEventListener("click",y,{passive:!0}),t.resetBtn.addEventListener("click",G,{passive:!0})}function o(){if(document.getElementById("tarot-vision-popup"))return;const f=document.createElement("div");f.id="tarot-vision-popup",f.innerHTML=`
      <div class="vision-popup-overlay">
        <div class="vision-popup-card">
          <!-- Header -->
          <header class="vision-popup-header">
            <h3 class="vision-popup-title" style="display:flex;align-items:center;gap:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:1.25rem;height:1.25rem;flex-shrink:0;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg> Tarot Vision AI</h3>
            <button id="vision-close" class="vision-close-btn" aria-label="Close">&times;</button>
          </header>

          <!-- Body -->
          <section class="vision-popup-body">
            <!-- Camera video stream -->
            <video id="video" class="hidden" playsinline autoplay muted></video>
            
            <!-- Canvas for photo capture -->
            <canvas id="canvas" class="hidden"></canvas>
            
            <!-- Image preview -->
            <img id="image-preview" class="hidden" alt="Preview" width="400" height="400" loading="lazy" decoding="async">

            <!-- Placeholder -->
            <div id="upload-placeholder" class="placeholder-box">
              <span class="placeholder-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:2rem;height:2rem;"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></span>
              <p>Take a photo or upload an image of your cards</p>
            </div>

            <!-- Control buttons -->
            <div class="vision-controls">
              <button id="capture-btn" type="button" class="vision-btn">
                ${j("camera")} Camera
              </button>
              <button id="upload-btn" type="button" class="vision-btn">
                ${j("photo")} Upload
              </button>
              <button id="analyze-btn" type="button" class="vision-btn btn-primary" disabled>
                ${j("search")} Analyze
              </button>
            </div>

            <!-- Hidden file input -->
            <input id="upload-input" type="file" accept="image/jpeg,image/png" class="hidden">
            
            <!-- Reset button (hidden by default) -->
            <button id="reset-btn" type="button" class="vision-btn hidden">🔄 Reset</button>

            <!-- Results display -->
            <div id="result" class="vision-result">
              <p class="placeholder-text">Your tarot reading will appear here...</p>
            </div>
            
            <!-- Loading spinner -->
            <div id="loading-spinner" class="hidden">
              <div class="spinner"></div>
              <p>Analyzing cards...</p>
            </div>
          </section>
        </div>
      </div>
    `,document.body.appendChild(f),r(f)}function r(f){f.addEventListener("click",x=>{(x.target===f||x.target.id==="vision-close")&&d()}),document.addEventListener("keydown",x=>{x.key==="Escape"&&d()})}async function l(){o(),document.getElementById("tarot-vision-popup").classList.add("active"),document.body.style.overflow="hidden",await i()}function d(){const f=document.getElementById("tarot-vision-popup");f&&(f.classList.remove("active"),document.body.style.overflow="",G(),h())}async function c(){var f;if(e.stream){u();return}try{if(N(!0),!((f=navigator.mediaDevices)!=null&&f.getUserMedia))throw new Error("Camera API not supported in this browser");e.stream=await navigator.mediaDevices.getUserMedia(s.CAMERA_CONSTRAINTS),t.video.srcObject=e.stream,t.video.muted=!0,t.video.setAttribute("playsinline",""),await t.video.play(),t.video.classList.remove("hidden"),t.placeholder.classList.add("hidden"),t.preview.classList.add("hidden"),t.captureBtn.innerHTML=`${j("photo")} Take Photo`}catch(x){p(x)}finally{N(!1)}}function u(){const f=t.canvas.getContext("2d");t.canvas.width=t.video.videoWidth,t.canvas.height=t.video.videoHeight,f.drawImage(t.video,0,0),e.imageBase64=t.canvas.toDataURL("image/jpeg",s.IMAGE_QUALITY),t.preview.src=e.imageBase64,h(),S(),P(),t.captureBtn.innerHTML=`${j("camera")} Use Camera`}function h(){e.stream&&(e.stream.getTracks().forEach(f=>f.stop()),e.stream=null,t.video.srcObject=null)}function p(f){console.error("Camera error:",f);let x="Unable to access camera. ";f.name==="NotAllowedError"?x+="Please grant camera permissions and try again.":f.name==="NotFoundError"?x+="No camera found on this device.":f.name==="NotReadableError"?x+="Camera is already in use by another application.":x+=f.message||"Please try again.",D(x,"error")}function m(f){var F;const x=(F=f.target.files)==null?void 0:F[0];if(!x)return;if(!s.ALLOWED_TYPES.includes(x.type)){D("Only JPEG and PNG images are allowed.","warning");return}if(x.size>s.MAX_FILE_SIZE){D("Image must be 4 MB or smaller.","warning");return}const W=new FileReader;W.onload=ee=>{g(ee.target.result)},W.onerror=()=>{D("Failed to read image file.","error")},W.readAsDataURL(x)}function g(f){const x=new Image;x.onload=()=>{e.imageBase64=f,t.preview.src=f,S(),P()},x.onerror=()=>{D("Failed to load image.","error")},x.src=f}async function y(){if(!e.imageBase64){D("No image to analyze.","warning");return}if(!e.isAnalyzing){e.isAnalyzing=!0,N(!0),t.analyzeBtn.disabled=!0,t.result.innerHTML='<p class="placeholder-text">Interpreting the cards...</p>';for(let f=1;f<=s.RETRY_COUNT;f++)try{const x=await b();k(x.text||"No interpretation returned."),C();return}catch(x){console.error(`Analysis attempt ${f} failed:`,x),f===s.RETRY_COUNT&&(k("Sorry, we could not complete the reading. Please try again later."),t.analyzeBtn.disabled=!1)}N(!1),e.isAnalyzing=!1}}async function b(){const f=new AbortController,x=setTimeout(()=>f.abort(),s.TIMEOUT_MS);try{const W=e.imageBase64.split(",")[1],F=await fetch(s.API_ROUTE,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({image:W}),signal:f.signal});if(clearTimeout(x),!F.ok)throw new Error(`Network error: ${F.status} ${F.statusText}`);return await F.json()}catch(W){throw clearTimeout(x),W}}function S(){t.video.classList.add("hidden"),t.preview.classList.remove("hidden"),t.placeholder.classList.add("hidden")}function k(f){N(!1);const x=X(f);t.result.innerHTML=`<div class="result-content">${x}</div>`,e.isAnalyzing=!1}function C(){[t.captureBtn,t.uploadBtn,t.analyzeBtn].forEach(f=>{f.classList.add("hidden")}),t.resetBtn.classList.remove("hidden")}function P(){t.analyzeBtn.disabled=!1}function N(f){f?t.loader.classList.remove("hidden"):t.loader.classList.add("hidden")}function G(){e.imageBase64=null,e.isAnalyzing=!1,t.uploadInput.value="",h(),t.preview.src="",t.preview.classList.add("hidden"),t.placeholder.classList.remove("hidden"),t.result.innerHTML='<p class="placeholder-text">Your tarot reading will appear here...</p>',[t.captureBtn,t.uploadBtn,t.analyzeBtn].forEach(f=>{f.classList.remove("hidden"),f.disabled=!1}),t.analyzeBtn.disabled=!0,t.resetBtn.classList.add("hidden"),t.captureBtn.innerHTML=`${j("camera")} Camera`}function X(f){return f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function j(f){return{camera:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>',photo:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/></svg>',search:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>'}[f]||""}function D(f,x="info"){var W;(W=window.app)!=null&&W.showToast?window.app.showToast(f,x):alert(f)}function Z(){if(document.getElementById("vision-popup-styles"))return;const f=document.createElement("style");f.id="vision-popup-styles",f.textContent=`
      /* Popup Overlay — matches .modal-overlay */
      #tarot-vision-popup {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(196, 173, 145, 0.85);
        backdrop-filter: blur(4px);
        padding: var(--spacing-md);
        animation: fadeIn 0.3s ease;
      }

      #tarot-vision-popup.active {
        display: flex;
      }

      /* Popup Card — matches .modal-card */
      .vision-popup-card {
        background: var(--neuro-bg);
        border-radius: var(--radius-2xl);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: var(--shadow-raised-lg);
        overflow: hidden;
        margin: auto;
        animation: slideUpShadow 0.4s ease;
        position: relative;
        z-index: 10001;
      }

      /* Header */
      .vision-popup-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        border-bottom: 1px solid var(--neuro-shadow-dark);
        background: var(--neuro-bg);
      }

      .vision-popup-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--neuro-text);
        margin: 0;
      }

      /* Close btn — matches .modal-close-btn */
      .vision-close-btn {
        background: var(--neuro-bg);
        border: none;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--neuro-text-light);
        box-shadow: var(--shadow-raised);
        border-radius: var(--radius-sm);
        padding: 0.4rem 0.65rem;
        transition: box-shadow var(--transition-fast);
      }

      .vision-close-btn:hover {
        box-shadow: var(--shadow-inset);
        color: var(--neuro-text);
      }

      /* Body */
      .vision-popup-body {
        padding: var(--spacing-lg);
        flex: 1 1 auto;
        overflow-y: auto;
        color: var(--neuro-text);
      }

      /* Placeholder box */
      .placeholder-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl);
        border: 2px dashed var(--neuro-shadow-dark);
        border-radius: var(--radius-lg);
        margin-bottom: var(--spacing-md);
        background: var(--neuro-bg-lighter);
        box-shadow: var(--shadow-inset-sm);
      }

      .placeholder-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-sm);
        color: var(--neuro-text-lighter);
      }

      .placeholder-text {
        color: var(--neuro-text-light);
        text-align: center;
      }

      /* Controls */
      .vision-controls {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-md);
      }

      /* Buttons — inherit .btn + .btn-primary from main styles */
      .vision-btn {
        /* inherits from global .btn via button[type="button"] */
      }

      .vision-btn svg {
        width: 1.1rem;
        height: 1.1rem;
      }

      /* Media elements */
      #video,
      #image-preview {
        max-width: 100%;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        display: block;
        box-shadow: var(--shadow-raised);
      }

      /* Result area */
      .vision-result {
        margin-top: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--neuro-bg-lighter);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-inset);
      }

      .result-content {
        white-space: pre-wrap;
        line-height: 1.6;
        color: var(--neuro-text);
      }

      /* Loading Spinner */
      #loading-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
        margin-top: var(--spacing-md);
        padding: var(--spacing-xl);
        text-align: center;
        font-weight: 600;
        color: var(--neuro-accent);
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--neuro-shadow-light);
        border-top-color: var(--neuro-accent);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      /* Utility */
      .hidden {
        display: none !important;
      }
    `,document.head.appendChild(f)}window.TarotVisionAI=async()=>{Z(),o(),await l()},document.addEventListener("click",f=>{var ee,xe,Se,ke,Ie,_e,Ee,Te,Ce,Me;if(!f.target.closest("#tarot-vision-ai-btn"))return;if(!(((Se=(xe=(ee=window.app)==null?void 0:ee.state)==null?void 0:xe.currentUser)==null?void 0:Se.isAdmin)||((_e=(Ie=(ke=window.app)==null?void 0:ke.state)==null?void 0:Ie.currentUser)==null?void 0:_e.isVip)||((Me=(Ce=(Te=(Ee=window.app)==null?void 0:Ee.gamification)==null?void 0:Te.state)==null?void 0:Ce.unlockedFeatures)==null?void 0:Me.includes("tarot_vision_ai")))){D("Purchase Tarot Vision AI in the Karma Shop to use this feature.","info");return}window.TarotVisionAI()})})();(function(){const s={PULSE_POOL_SIZE:10,AUTO_TRIGGER:!1},e={BREATH_PULSE_INTERVAL:1e3,EXHALE_PULSE_INTERVAL:900,RELAX_PULSE_INTERVAL:1800,RELAX_TRANSITION:2600,TEXT_FADE:100,SCALE_BOUNCE:240,ESCAPE_DEBOUNCE:300},t={inhale:"Inhale deeply",hold:"HOLD",exhale:"Exhale slowly",relax:"Now Relax"},i={selfReset:{id:"selfreset",title:"Self Reset",duration:60,type:"breathing",breathIn:7,breathHold:3,breathOut:7,completeRounds:3,storagePrefix:"pc_wellness_selfreset",gradient:"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"},fullBodyScan:{id:"fullbodyscan",title:"Full Body Scan",duration:120,type:"zones",zones:["Top of head","Back of head","Face","Throat and neck","Shoulders","Arms and hands","Chest","Stomach","Back (upper and lower)","Pelvic area","Legs","Feet"],storagePrefix:"pc_wellness_fullbodyscan",gradient:"linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"},nervousSystem:{id:"nervoussystem",title:"Nervous System Reset",duration:60,type:"steps",steps:["Shake your hands","Roll your shoulders","Stick out your tongue to relax the jaw","Relax your face, especially around the eyes","Take one long sigh","Feel your feet on the ground","Settle your breath naturally"],stepDurations:[9,9,9,9,8,8,8],storagePrefix:"pc_wellness_nervoussystem",gradient:"linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"},tensionSweep:{id:"tensionsweep",title:"Tension Sweep",duration:120,type:"zones",zones:["Lift shoulders to your ears then drop","Shake your arms loosely","Shake your legs","Twist your spine gently left and right","Circle your hips slowly","Open your chest, expand your ribcage","Drop your head forward and roll gently","Shake your whole body lightly"],storagePrefix:"pc_wellness_tensionsweep",gradient:"linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"}},n=`
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
  `,o=document.createElement("style");o.textContent=n,document.head.appendChild(o);const r={ctx:null};function l(){try{r.ctx||(r.ctx=new(window.AudioContext||window.webkitAudioContext));const m=r.ctx,g=m.currentTime,y=m.createOscillator(),b=m.createOscillator(),S=m.createGain(),k=m.createBiquadFilter();y.type="sine",b.type="sine",y.frequency.value=660,b.frequency.value=990,b.detune.value=6,k.type="lowpass",k.frequency.value=2600,S.gain.setValueAtTime(1e-4,g),S.gain.exponentialRampToValueAtTime(.28,g+.02),S.gain.exponentialRampToValueAtTime(.001,g+1.5),y.connect(k),b.connect(k),k.connect(S),S.connect(m.destination),y.start(g),b.start(g),y.stop(g+1.5),b.stop(g+1.5)}catch(m){console.warn("WellnessKit: Audio playback failed",m)}}class d{constructor(g){if(!g||!g.id||!g.duration||!g.type)throw new Error("WellnessKit: Invalid tool configuration");this.config=g,this.state={remaining:g.duration,mainInterval:null,phaseTimeout:null,pulseInterval:null,currentIndex:0,isRunning:!1,countdownInterval:null},this.createUI(),this.initPulsePool(),this.attachEvents(),this.resetState()}createUI(){const g=document.createElement("div");g.innerHTML=`
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
      `,document.body.appendChild(g),this.elements={overlay:document.getElementById(`wk-${this.config.id}-overlay`),box:document.getElementById(`wk-${this.config.id}-box`),timer:document.getElementById(`wk-${this.config.id}-timer`),progress:document.getElementById(`wk-${this.config.id}-progress`),pulses:document.getElementById(`wk-${this.config.id}-pulses`),anim:document.getElementById(`wk-${this.config.id}-anim`),text:document.getElementById(`wk-${this.config.id}-text`),count:document.getElementById(`wk-${this.config.id}-count`),btnStart:document.getElementById(`wk-${this.config.id}-start`),btnFinish:document.getElementById(`wk-${this.config.id}-finish`),btnClose:document.getElementById(`wk-${this.config.id}-close`)},this.elements.box.style.background=this.config.gradient,this.R=40,this.CIRC=2*Math.PI*this.R,this.elements.progress.style.strokeDasharray=this.CIRC}initPulsePool(){this.pulsePool=[],this.pulseIndex=0;for(let g=0;g<s.PULSE_POOL_SIZE;g++){const y=document.createElement("div");y.className="wk-pulse",this.elements.pulses.appendChild(y),this.pulsePool.push(y)}}spawnPulse(){const g=this.pulsePool[this.pulseIndex];this.pulseIndex=(this.pulseIndex+1)%s.PULSE_POOL_SIZE,g.classList.remove("active"),g.offsetWidth,g.classList.add("active")}spawnPulseWithInterval(g){this.spawnPulse(),this.state.pulseInterval&&clearInterval(this.state.pulseInterval),this.state.pulseInterval=setInterval(()=>this.spawnPulse(),g)}setProgress(g,y){const b=Math.max(0,Math.min(1,g/y)),S=this.CIRC*(1-b);this.elements.progress.style.strokeDashoffset=S}clearTimers(){[this.state.mainInterval,this.state.phaseTimeout,this.state.pulseInterval,this.state.countdownInterval].forEach(y=>{y&&(clearInterval(y),clearTimeout(y))}),this.state.mainInterval=null,this.state.phaseTimeout=null,this.state.pulseInterval=null,this.state.countdownInterval=null}resetAnimationTransition(){this.elements.anim.style.transition=""}resetState(){this.clearTimers(),this.state.remaining=this.config.duration,this.state.currentIndex=0,this.state.isRunning=!1,this.elements.timer.textContent=String(this.config.duration),this.setProgress(this.config.duration,this.config.duration),this.elements.btnFinish.classList.add("hidden"),this.elements.btnStart.classList.remove("hidden"),this.elements.btnStart.textContent="Start",this.elements.anim.style.transform="scale(1.0)",this.elements.anim.style.opacity="0.9",this.resetAnimationTransition(),this.config.type==="breathing"?(this.elements.text.textContent=t.inhale,this.elements.count&&(this.elements.count.textContent=String(this.config.breathIn))):this.config.type==="zones"?this.elements.text.textContent=this.config.zones[0]:this.config.type==="steps"&&(this.elements.text.textContent=this.config.steps[0])}startMainTimer(){this.state.mainInterval||(this.state.isRunning=!0,this.elements.btnStart.textContent="Stop",this.config.type==="breathing"?this.startBreathingCycle():this.startPhaseLoop(),this.state.mainInterval=setInterval(()=>{this.state.remaining-=1,this.state.remaining<0&&(this.state.remaining=0),this.elements.timer.textContent=String(this.state.remaining),this.setProgress(this.state.remaining,this.config.duration),this.state.remaining<=0&&(this.clearTimers(),this.finalizeSession())},1e3))}stopMainTimer(){this.clearTimers(),this.state.isRunning=!1,this.elements.btnStart.textContent="Start",this.resetAnimationTransition()}getCompletedCycles(){const g=this.config.duration-this.state.remaining,y=this.config.breathIn+this.config.breathHold+this.config.breathOut;return Math.floor(g/y)}startBreathingCycle(){const g=()=>{l(),this.setBreathPhase("inhale",this.config.breathIn),this.elements.anim.style.transition=`transform ${this.config.breathIn}s linear`,this.elements.anim.style.transform="scale(1.14)",this.spawnPulseWithInterval(e.BREATH_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),y()},this.config.breathIn*1e3)},y=()=>{this.state.remaining<=0||(this.setBreathPhase("hold",this.config.breathHold),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${this.config.breathHold}s linear`,this.elements.anim.style.transform="scale(1.18)",this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),b()},this.config.breathHold*1e3))},b=()=>{this.state.remaining<=0||(this.setBreathPhase("exhale",this.config.breathOut),this.elements.anim.style.transition=`transform ${this.config.breathOut}s linear`,this.elements.anim.style.transform="scale(0.94)",this.spawnPulseWithInterval(e.EXHALE_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),S()},this.config.breathOut*1e3))},S=()=>{if(this.state.remaining<=0)return;this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.getCompletedCycles()>=this.config.completeRounds?k():g()},k=()=>{this.setBreathPhase("relax",null),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${e.RELAX_TRANSITION}ms ease-in-out`,this.elements.anim.style.transform="scale(1.0)",this.spawnPulseWithInterval(e.RELAX_PULSE_INTERVAL)};g()}setBreathPhase(g,y){if(this.elements.text.textContent=t[g]||"",g==="relax"){this.elements.count&&(this.elements.count.textContent="");return}if(this.elements.count&&y){this.state.countdownInterval&&clearInterval(this.state.countdownInterval);let b=y;this.elements.count.textContent=String(b),this.state.countdownInterval=setInterval(()=>{b-=1,b<=0?(this.elements.count.textContent="0",clearInterval(this.state.countdownInterval),this.state.countdownInterval=null):this.elements.count.textContent=String(b)},1e3)}}startPhaseLoop(){const g=this.config.zones||this.config.steps,y=()=>{if(!(this.state.remaining<=0)&&(this.elements.text.classList.add("changing"),setTimeout(()=>{this.elements.text.textContent=g[this.state.currentIndex],this.elements.text.classList.remove("changing"),this.spawnPulse(),this.elements.anim.style.transition="transform 0.24s ease-out",this.elements.anim.style.transform="scale(1.08)",setTimeout(()=>{this.elements.anim.style.transform="scale(1.0)",setTimeout(()=>this.resetAnimationTransition(),e.SCALE_BOUNCE)},e.SCALE_BOUNCE)},e.TEXT_FADE),this.state.currentIndex<g.length-1)){const S=this.config.stepDurations?this.config.stepDurations[this.state.currentIndex]*1e3:this.config.duration/g.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,y()},S)}};this.elements.text.textContent=g[0],this.spawnPulse();const b=this.config.stepDurations?this.config.stepDurations[0]*1e3:this.config.duration/g.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,y()},b)}completeSession(){var g;l();try{(g=window.app)!=null&&g.gamification&&(window.app.gamification.incrementWellnessRuns(),window.app.gamification.addBoth(10,1,"Wellness Practice"))}catch(y){console.warn("WellnessKit: Gamification integration failed",y)}}finalizeSession(){this.completeSession(),this.elements.btnStart.classList.add("hidden"),this.elements.btnFinish.classList.remove("hidden"),setTimeout(()=>this.close(),1200)}open(){this.resetState(),this.elements.overlay.style.display="flex",setTimeout(()=>this.elements.btnStart.focus(),100)}close(){this.stopMainTimer(),this.elements.overlay.style.display="none",this.resetState()}attachEvents(){this.elements.btnStart.addEventListener("click",()=>{this.state.mainInterval?this.stopMainTimer():(this.state.remaining<=0&&this.resetState(),this.startMainTimer())}),this.elements.btnFinish.addEventListener("click",()=>{this.completeSession(),this.close()}),this.elements.btnClose.addEventListener("click",()=>this.close()),this.elements.overlay.addEventListener("click",g=>{g.target===this.elements.overlay&&this.close()})}getStats(){return{autoTriggerEnabled:s.AUTO_TRIGGER}}destroy(){this.clearTimers(),this.elements.overlay&&this.elements.overlay.parentNode&&this.elements.overlay.parentNode.removeChild(this.elements.overlay)}}const c=new Set;let u=null;document.addEventListener("keydown",m=>{if(m.key==="Escape"){if(u)return;u=setTimeout(()=>u=null,e.ESCAPE_DEBOUNCE),c.forEach(g=>{g.elements.overlay.style.display==="flex"&&g.close()})}});const h={selfReset:new d(i.selfReset),fullBodyScan:new d(i.fullBodyScan),nervousSystem:new d(i.nervousSystem),tensionSweep:new d(i.tensionSweep)};Object.values(h).forEach(m=>c.add(m)),window.addEventListener("beforeunload",()=>{if(Object.values(h).forEach(m=>{m.clearTimers(),m.destroy()}),r.ctx)try{r.ctx.close(),r.ctx=null}catch(m){console.warn("WellnessKit: Audio context cleanup failed",m)}}),window.WellnessKit={openSelfReset:()=>h.selfReset.open(),openFullBodyScan:()=>h.fullBodyScan.open(),openNervousReset:()=>h.nervousSystem.open(),openTensionSweep:()=>h.tensionSweep.open(),closeSelfReset:()=>h.selfReset.close(),closeFullBodyScan:()=>h.fullBodyScan.close(),closeNervousReset:()=>h.nervousSystem.close(),closeTensionSweep:()=>h.tensionSweep.close(),getSelfResetStats:()=>h.selfReset.getStats(),getFullBodyScanStats:()=>h.fullBodyScan.getStats(),getNervousResetStats:()=>h.nervousSystem.getStats(),getTensionSweepStats:()=>h.tensionSweep.getStats(),getAllStats:()=>({selfReset:h.selfReset.getStats(),fullBodyScan:h.fullBodyScan.getStats(),nervousSystem:h.nervousSystem.getStats(),tensionSweep:h.tensionSweep.getStats()}),playChime:l},["SelfReset","FullBodyScan","NervousReset","TensionSweep"].forEach(m=>{window[`open${m}`]=window.WellnessKit[`open${m}`],window[`close${m}`]=window.WellnessKit[`close${m}`],window[`get${m}Stats`]=window.WellnessKit[`get${m}Stats`]})})();"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/service-worker.js",{scope:"/"}).catch(s=>console.error("[SW] Registration failed:",s))});async function Fe(){try{const[s,{QUOTES:e,getRandomQuote:t,getQuoteOfTheDay:i},n,{default:o}]=await Promise.all([q(()=>Promise.resolve().then(()=>gt),void 0),q(()=>import("./QuotesList-BeF9xuKi.js"),[]),q(()=>import("./Index-BVve0-cW.js"),__vite__mapDeps([0,1])),q(()=>import("./User-Tab-CLFj08KU.js"),[])]);window.affirmations=s.default,window.QuotesData={QUOTES:e,getRandomQuote:t,getQuoteOfTheDay:i},window.app=new n.ProjectCuriosityApp({AppState:n.AppState,AuthManager:n.AuthManager,NavigationManager:n.NavigationManager,DashboardManager:n.DashboardManager,UserTab:o}),window.app.init()}catch(s){console.error("[FATAL] Bootstrap failed:",s),document.body.innerHTML='<div style="padding:2rem;text-align:center;font-family:system-ui"><h1>Loading Error</h1><p>Unable to load the application. Please refresh the page.</p><button onclick="location.reload()" style="margin-top:1.5rem;padding:0.75rem 2rem;background:#6b9b37;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer">Retry</button></div>'}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Fe):Fe();export{he as A,w as C,pt as E,rt as G,mt as I,Ye as T,Lt as W,q as _,ti as a,ii as b,ni as c,Xt as d,Zt as e,Tt as f,ai as g,Pt as h,v as i,Q as j,bt as k,Qt as l,Kt as m,qe as n,ei as o,Ge as r,si as s};
