(function(){const d={PULSE_POOL_SIZE:10,AUTO_TRIGGER:!1},o={BREATH_PULSE_INTERVAL:1e3,EXHALE_PULSE_INTERVAL:900,RELAX_PULSE_INTERVAL:1800,RELAX_TRANSITION:2600,TEXT_FADE:100,SCALE_BOUNCE:240,ESCAPE_DEBOUNCE:300},m={inhale:"Inhale deeply",hold:"HOLD",exhale:"Exhale slowly",relax:"Now Relax"},c={selfReset:{id:"selfreset",title:"Self Reset",duration:60,type:"breathing",breathIn:7,breathHold:3,breathOut:7,completeRounds:3,storagePrefix:"pc_wellness_selfreset",gradient:"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"},fullBodyScan:{id:"fullbodyscan",title:"Full Body Scan",duration:120,type:"zones",zones:["Top of head","Back of head","Face","Throat and neck","Shoulders","Arms and hands","Chest","Stomach","Back (upper and lower)","Pelvic area","Legs","Feet"],storagePrefix:"pc_wellness_fullbodyscan",gradient:"linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"},nervousSystem:{id:"nervoussystem",title:"Nervous System Reset",duration:60,type:"steps",steps:["Shake your hands","Roll your shoulders","Stick out your tongue to relax the jaw","Relax your face, especially around the eyes","Take one long sigh","Feel your feet on the ground","Settle your breath naturally"],stepDurations:[9,9,9,9,8,8,8],storagePrefix:"pc_wellness_nervoussystem",gradient:"linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"},tensionSweep:{id:"tensionsweep",title:"Tension Sweep",duration:120,type:"zones",zones:["Lift shoulders to your ears then drop","Shake your arms loosely","Shake your legs","Twist your spine gently left and right","Circle your hips slowly","Open your chest, expand your ribcage","Drop your head forward and roll gently","Shake your whole body lightly"],storagePrefix:"pc_wellness_tensionsweep",gradient:"linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"}},w=`
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
  `,f=document.createElement("style");f.textContent=w,document.head.appendChild(f);const r={ctx:null};function u(){try{r.ctx||(r.ctx=new(window.AudioContext||window.webkitAudioContext));const e=r.ctx,t=e.currentTime,s=e.createOscillator(),n=e.createOscillator(),a=e.createGain(),l=e.createBiquadFilter();s.type="sine",n.type="sine",s.frequency.value=660,n.frequency.value=990,n.detune.value=6,l.type="lowpass",l.frequency.value=2600,a.gain.setValueAtTime(1e-4,t),a.gain.exponentialRampToValueAtTime(.28,t+.02),a.gain.exponentialRampToValueAtTime(.001,t+1.5),s.connect(l),n.connect(l),l.connect(a),a.connect(e.destination),s.start(t),n.start(t),s.stop(t+1.5),n.stop(t+1.5)}catch(e){console.warn("WellnessKit: Audio playback failed",e)}}class h{constructor(t){if(!t||!t.id||!t.duration||!t.type)throw new Error("WellnessKit: Invalid tool configuration");this.config=t,this.state={remaining:t.duration,mainInterval:null,phaseTimeout:null,pulseInterval:null,currentIndex:0,isRunning:!1,countdownInterval:null},this.createUI(),this.initPulsePool(),this.attachEvents(),this.resetState()}createUI(){const t=document.createElement("div");t.innerHTML=`
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
      `,document.body.appendChild(t),this.elements={overlay:document.getElementById(`wk-${this.config.id}-overlay`),box:document.getElementById(`wk-${this.config.id}-box`),timer:document.getElementById(`wk-${this.config.id}-timer`),progress:document.getElementById(`wk-${this.config.id}-progress`),pulses:document.getElementById(`wk-${this.config.id}-pulses`),anim:document.getElementById(`wk-${this.config.id}-anim`),text:document.getElementById(`wk-${this.config.id}-text`),count:document.getElementById(`wk-${this.config.id}-count`),btnStart:document.getElementById(`wk-${this.config.id}-start`),btnFinish:document.getElementById(`wk-${this.config.id}-finish`),btnClose:document.getElementById(`wk-${this.config.id}-close`)},this.elements.box.style.background=this.config.gradient,this.R=40,this.CIRC=2*Math.PI*this.R,this.elements.progress.style.strokeDasharray=this.CIRC}initPulsePool(){this.pulsePool=[],this.pulseIndex=0;for(let t=0;t<d.PULSE_POOL_SIZE;t++){const s=document.createElement("div");s.className="wk-pulse",this.elements.pulses.appendChild(s),this.pulsePool.push(s)}}spawnPulse(){const t=this.pulsePool[this.pulseIndex];this.pulseIndex=(this.pulseIndex+1)%d.PULSE_POOL_SIZE,t.classList.remove("active"),t.offsetWidth,t.classList.add("active")}spawnPulseWithInterval(t){this.spawnPulse(),this.state.pulseInterval&&clearInterval(this.state.pulseInterval),this.state.pulseInterval=setInterval(()=>this.spawnPulse(),t)}setProgress(t,s){const n=Math.max(0,Math.min(1,t/s)),a=this.CIRC*(1-n);this.elements.progress.style.strokeDashoffset=a}clearTimers(){[this.state.mainInterval,this.state.phaseTimeout,this.state.pulseInterval,this.state.countdownInterval].forEach(s=>{s&&(clearInterval(s),clearTimeout(s))}),this.state.mainInterval=null,this.state.phaseTimeout=null,this.state.pulseInterval=null,this.state.countdownInterval=null}resetAnimationTransition(){this.elements.anim.style.transition=""}resetState(){this.clearTimers(),this.state.remaining=this.config.duration,this.state.currentIndex=0,this.state.isRunning=!1,this.elements.timer.textContent=String(this.config.duration),this.setProgress(this.config.duration,this.config.duration),this.elements.btnFinish.classList.add("hidden"),this.elements.btnStart.classList.remove("hidden"),this.elements.btnStart.textContent="Start",this.elements.anim.style.transform="scale(1.0)",this.elements.anim.style.opacity="0.9",this.resetAnimationTransition(),this.config.type==="breathing"?(this.elements.text.textContent=m.inhale,this.elements.count&&(this.elements.count.textContent=String(this.config.breathIn))):this.config.type==="zones"?this.elements.text.textContent=this.config.zones[0]:this.config.type==="steps"&&(this.elements.text.textContent=this.config.steps[0])}startMainTimer(){this.state.mainInterval||(this.state.isRunning=!0,this.elements.btnStart.textContent="Stop",this.config.type==="breathing"?this.startBreathingCycle():this.startPhaseLoop(),this.state.mainInterval=setInterval(()=>{this.state.remaining-=1,this.state.remaining<0&&(this.state.remaining=0),this.elements.timer.textContent=String(this.state.remaining),this.setProgress(this.state.remaining,this.config.duration),this.state.remaining<=0&&(this.clearTimers(),this.finalizeSession())},1e3))}stopMainTimer(){this.clearTimers(),this.state.isRunning=!1,this.elements.btnStart.textContent="Start",this.resetAnimationTransition()}getCompletedCycles(){const t=this.config.duration-this.state.remaining,s=this.config.breathIn+this.config.breathHold+this.config.breathOut;return Math.floor(t/s)}startBreathingCycle(){const t=()=>{u(),this.setBreathPhase("inhale",this.config.breathIn),this.elements.anim.style.transition=`transform ${this.config.breathIn}s linear`,this.elements.anim.style.transform="scale(1.14)",this.spawnPulseWithInterval(o.BREATH_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),s()},this.config.breathIn*1e3)},s=()=>{this.state.remaining<=0||(this.setBreathPhase("hold",this.config.breathHold),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${this.config.breathHold}s linear`,this.elements.anim.style.transform="scale(1.18)",this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),n()},this.config.breathHold*1e3))},n=()=>{this.state.remaining<=0||(this.setBreathPhase("exhale",this.config.breathOut),this.elements.anim.style.transition=`transform ${this.config.breathOut}s linear`,this.elements.anim.style.transform="scale(0.94)",this.spawnPulseWithInterval(o.EXHALE_PULSE_INTERVAL),this.state.phaseTimeout=setTimeout(()=>{this.resetAnimationTransition(),a()},this.config.breathOut*1e3))},a=()=>{if(this.state.remaining<=0)return;this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.getCompletedCycles()>=this.config.completeRounds?l():t()},l=()=>{this.setBreathPhase("relax",null),this.state.pulseInterval&&(clearInterval(this.state.pulseInterval),this.state.pulseInterval=null),this.elements.anim.style.transition=`transform ${o.RELAX_TRANSITION}ms ease-in-out`,this.elements.anim.style.transform="scale(1.0)",this.spawnPulseWithInterval(o.RELAX_PULSE_INTERVAL)};t()}setBreathPhase(t,s){if(this.elements.text.textContent=m[t]||"",t==="relax"){this.elements.count&&(this.elements.count.textContent="");return}if(this.elements.count&&s){this.state.countdownInterval&&clearInterval(this.state.countdownInterval);let n=s;this.elements.count.textContent=String(n),this.state.countdownInterval=setInterval(()=>{n-=1,n<=0?(this.elements.count.textContent="0",clearInterval(this.state.countdownInterval),this.state.countdownInterval=null):this.elements.count.textContent=String(n)},1e3)}}startPhaseLoop(){const t=this.config.zones||this.config.steps,s=()=>{if(!(this.state.remaining<=0)&&(this.elements.text.classList.add("changing"),setTimeout(()=>{this.elements.text.textContent=t[this.state.currentIndex],this.elements.text.classList.remove("changing"),this.spawnPulse(),this.elements.anim.style.transition="transform 0.24s ease-out",this.elements.anim.style.transform="scale(1.08)",setTimeout(()=>{this.elements.anim.style.transform="scale(1.0)",setTimeout(()=>this.resetAnimationTransition(),o.SCALE_BOUNCE)},o.SCALE_BOUNCE)},o.TEXT_FADE),this.state.currentIndex<t.length-1)){const a=this.config.stepDurations?this.config.stepDurations[this.state.currentIndex]*1e3:this.config.duration/t.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,s()},a)}};this.elements.text.textContent=t[0],this.spawnPulse();const n=this.config.stepDurations?this.config.stepDurations[0]*1e3:this.config.duration/t.length*1e3;this.state.phaseTimeout=setTimeout(()=>{this.state.currentIndex++,s()},n)}completeSession(){u();try{window.app?.gamification&&(window.app.gamification.incrementWellnessRuns(),window.app.gamification.addBoth(10,1,"Wellness Practice"))}catch(t){console.warn("WellnessKit: Gamification integration failed",t)}}finalizeSession(){this.completeSession(),this.elements.btnStart.classList.add("hidden"),this.elements.btnFinish.classList.remove("hidden"),setTimeout(()=>this.close(),1200)}open(){this.resetState(),this.elements.overlay.style.display="flex",setTimeout(()=>this.elements.btnStart.focus(),100)}close(){this.stopMainTimer(),this.elements.overlay.style.display="none",this.resetState()}attachEvents(){this.elements.btnStart.addEventListener("click",()=>{this.state.mainInterval?this.stopMainTimer():(this.state.remaining<=0&&this.resetState(),this.startMainTimer())}),this.elements.btnFinish.addEventListener("click",()=>{this.completeSession(),this.close()}),this.elements.btnClose.addEventListener("click",()=>this.close()),this.elements.overlay.addEventListener("click",t=>{t.target===this.elements.overlay&&this.close()})}getStats(){return{autoTriggerEnabled:d.AUTO_TRIGGER}}destroy(){this.clearTimers(),this.elements.overlay&&this.elements.overlay.parentNode&&this.elements.overlay.parentNode.removeChild(this.elements.overlay)}}const g=new Set;let p=null;document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(p)return;p=setTimeout(()=>p=null,o.ESCAPE_DEBOUNCE),g.forEach(t=>{t.elements.overlay.style.display==="flex"&&t.close()})}});const i={selfReset:new h(c.selfReset),fullBodyScan:new h(c.fullBodyScan),nervousSystem:new h(c.nervousSystem),tensionSweep:new h(c.tensionSweep)};Object.values(i).forEach(e=>g.add(e)),window.addEventListener("beforeunload",()=>{if(Object.values(i).forEach(e=>{e.clearTimers(),e.destroy()}),r.ctx)try{r.ctx.close(),r.ctx=null}catch(e){console.warn("WellnessKit: Audio context cleanup failed",e)}}),window.WellnessKit={openSelfReset:()=>i.selfReset.open(),openFullBodyScan:()=>i.fullBodyScan.open(),openNervousReset:()=>i.nervousSystem.open(),openTensionSweep:()=>i.tensionSweep.open(),closeSelfReset:()=>i.selfReset.close(),closeFullBodyScan:()=>i.fullBodyScan.close(),closeNervousReset:()=>i.nervousSystem.close(),closeTensionSweep:()=>i.tensionSweep.close(),getSelfResetStats:()=>i.selfReset.getStats(),getFullBodyScanStats:()=>i.fullBodyScan.getStats(),getNervousResetStats:()=>i.nervousSystem.getStats(),getTensionSweepStats:()=>i.tensionSweep.getStats(),getAllStats:()=>({selfReset:i.selfReset.getStats(),fullBodyScan:i.fullBodyScan.getStats(),nervousSystem:i.nervousSystem.getStats(),tensionSweep:i.tensionSweep.getStats()}),playChime:u},["SelfReset","FullBodyScan","NervousReset","TensionSweep"].forEach(e=>{window[`open${e}`]=window.WellnessKit[`open${e}`],window[`close${e}`]=window.WellnessKit[`close${e}`],window[`get${e}Stats`]=window.WellnessKit[`get${e}Stats`]})})();
