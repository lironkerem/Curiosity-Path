class b{constructor(e){this.app=e,this.ytPlayer=null,this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null,this.progressInterval=null,this.eventCleanup=[],this.pdfGuideUrl="/Source_PDF/Meditation_Demo.pdf",this.SKIP_SECONDS=15,this.MIN_PLAYER_WIDTH=380,this.PROGRESS_UPDATE_MS=1e3,this.loadYouTubeAPI(),this.meditations=this.getMeditationsData()}loadYouTubeAPI(){if(window.YT&&window.YT.Player){window.ytReady=!0;return}if(window.onYouTubeIframeAPIReady=()=>{window.ytReady=!0},!document.querySelector('script[src*="youtube.com/iframe_api"]')){const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",document.head.appendChild(e)}}getMeditationsData(){return[{id:1,title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",description:"Connect deeply with Earth energy and find your center",embedUrl:"https://www.youtube.com/embed/_KedpeSYwgA?enablejsapi=1&rel=0&playsinline=1",emoji:"🌍",type:"guided",premium:!1},{id:2,title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",description:"Cleanse and strengthen your energetic field",embedUrl:"https://www.youtube.com/embed/gIMfdNkAC4g?enablejsapi=1&rel=0&playsinline=1",emoji:"✨",type:"guided",premium:!1},{id:3,title:"Chakra Cleaning",duration:"39:58",category:"Chakras",description:"Balance and clear all seven energy centers",embedUrl:"https://www.youtube.com/embed/BFvmLeYg7cE?enablejsapi=1&rel=0&playsinline=1",emoji:"🌈",type:"guided",premium:!1},{id:4,title:"The Center of the Universe",duration:"29:56",category:"Spiritual",description:"Expand your consciousness to cosmic awareness",embedUrl:"https://www.youtube.com/embed/1T2dNQ4M7Ko?enablejsapi=1&rel=0&playsinline=1",emoji:"🌌",type:"guided",premium:!1},{id:5,title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",description:"Release emotional blockages with visualization",embedUrl:"https://www.youtube.com/embed/3yQrtsHbSBo?enablejsapi=1&rel=0&playsinline=1",emoji:"🌹",type:"guided",premium:!1},{id:6,title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",description:"Align your intentions with universal flow",embedUrl:"https://www.youtube.com/embed/EvRa_qwgJao?enablejsapi=1&rel=0&playsinline=1",emoji:"⭐",type:"guided",premium:!1},{id:7,title:"Meeting your Higher Self",duration:"29:56",category:"Premium",description:"Connect with your highest consciousness",embedUrl:"https://www.youtube.com/embed/34mla-PnpeU?enablejsapi=1&rel=0&playsinline=1",emoji:"💎",type:"guided",premium:!0},{id:8,title:"Inner Temple",duration:"29:46",category:"Premium",description:"Create your sacred inner sanctuary",embedUrl:"https://www.youtube.com/embed/t6o6lpftZBA?enablejsapi=1&rel=0&playsinline=1",emoji:"🔮",type:"guided",premium:!0},{id:9,title:"Gratitude Practice",duration:"29:56",category:"Premium",description:"Cultivate deep appreciation and abundance",embedUrl:"https://www.youtube.com/embed/JyTwWAhsiq8?enablejsapi=1&rel=0&playsinline=1",emoji:"👑",type:"guided",premium:!0}]}showMeditationSchedule(e){var c;const i={guided:{title:"Today's Meditation Schedule",cycleSec:3600,openSec:900,sessions:[{title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",emoji:"🌍"},{title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",emoji:"✨"},{title:"Chakra Cleaning",duration:"39:58",category:"Chakras",emoji:"🌈"},{title:"The Center of the Universe",duration:"29:56",category:"Spiritual",emoji:"🌌"},{title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",emoji:"🌹"},{title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",emoji:"⭐"},{title:"Meeting your Higher Self",duration:"29:56",category:"Premium",emoji:"💎"},{title:"Inner Temple",duration:"29:46",category:"Premium",emoji:"🔮"},{title:"Gratitude Practice",duration:"29:56",category:"Premium",emoji:"👑"}]},osho:{title:"Upcoming OSHO Sessions",cycleSec:5400,openSec:600,sessions:[{title:"OSHO Dynamic Meditation",duration:"77:00",category:"Energy",emoji:"🔥"},{title:"OSHO Kundalini Meditation",duration:"77:00",category:"Movement",emoji:"💃"},{title:"OSHO Nadabrahma Meditation",duration:"77:00",category:"Humming",emoji:"🕉️"},{title:"OSHO Nataraj Meditation",duration:"77:00",category:"Dance",emoji:"🎭"},{title:"OSHO Whirling Meditation",duration:"77:00",category:"Spinning",emoji:"🌀"}]}}[e];if(!i)return;const n=Date.now(),r=i.cycleSec*1e3,a=i.openSec*1e3,s=Math.floor(n/r),l=p=>new Date(p).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),d=Array.from({length:6},(p,u)=>{const w=(s+u)%i.sessions.length,h=i.sessions[w],m=(s+u)*r,v=m+a,g=n-m,y=u===0&&g>=0&&g<a,f=u===0&&g>=a,x=y?'<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>':f?'<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>':"";return`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:12px;margin-bottom:8px;${y?"background:var(--neuro-accent);color:white;":"background:var(--neuro-bg);"}
                    box-shadow:4px 4px 10px var(--neuro-shadow-dark),-4px -4px 10px var(--neuro-shadow-light);">
          <div style="display:flex;align-items:center;gap:12px;flex:1;">
            <span style="font-size:24px;">${h.emoji}</span>
            <div>
              <div style="font-weight:600;font-size:14px;">${h.title}${x}</div>
              <div style="font-size:11px;opacity:0.7;">${[h.category,h.duration].filter(Boolean).join(" · ")}</div>
            </div>
          </div>
          <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
            <div style="font-weight:600;">${l(m)}</div>
            <div style="opacity:0.6;">closes ${l(v)}</div>
          </div>
        </div>`}).join("");(c=document.getElementById("meditationScheduleModal"))==null||c.remove();const o=document.createElement("div");o.id="meditationScheduleModal",o.style.cssText=`
      position:fixed;inset:0;z-index:99999;
      background:rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      padding:1rem;
    `,o.innerHTML=`
      <div style="background:var(--neuro-bg);border-radius:16px;padding:1.5rem;max-width:520px;width:100%;
                  max-height:80vh;overflow-y:auto;
                  box-shadow:12px 12px 24px var(--neuro-shadow-dark),-12px -12px 24px var(--neuro-shadow-light);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;">
          <h2 style="margin:0;font-size:1.1rem;color:var(--neuro-text);">${i.title}</h2>
          <button onclick="document.getElementById('meditationScheduleModal')?.remove()"
                  style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--neuro-text-light);line-height:1;">×</button>
        </div>
        <div>${d}</div>
      </div>
    `,o.addEventListener("click",p=>{p.target===o&&o.remove()}),document.body.appendChild(o)}buildMeditationCTA(){const e=(r,a)=>{const s=Date.now(),l=r*1e3,d=a*1e3,o=s%l;if(o<d)return null;const c=l-o,p=Math.floor(c/6e4),u=Math.floor(c%6e4/1e3);return`Opens in ${p}:${String(u).padStart(2,"0")}`},t=e(3600,900),i=e(5400,600),n=`
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
    `,this.attachEventListeners()}renderMeditationCards(){return this.meditations.map(e=>{var r,a,s,l,d,o,c;const t=e.premium,i=((a=(r=this.app.state)==null?void 0:r.currentUser)==null?void 0:a.isAdmin)||((l=(s=this.app.state)==null?void 0:s.currentUser)==null?void 0:l.isVip),n=t&&!i&&!((c=(o=(d=this.app.gamification)==null?void 0:d.state)==null?void 0:o.unlockedFeatures)!=null&&c.includes("advanced_meditations"));return`
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
    `}attachEventListeners(){}playAudio(e){var n,r,a,s,l,d,o;const t=this.meditations.find(c=>c.id===e);if(!t)return;const i=((r=(n=this.app.state)==null?void 0:n.currentUser)==null?void 0:r.isAdmin)||((s=(a=this.app.state)==null?void 0:a.currentUser)==null?void 0:s.isVip);if(t.premium&&!i&&!((o=(d=(l=this.app.gamification)==null?void 0:l.state)==null?void 0:d.unlockedFeatures)!=null&&o.includes("advanced_meditations"))){this.app.showToast("Unlock Advanced Meditations in the Karma Shop!","info");return}this._play(t,!1)}playVideo(e){var n,r,a,s,l,d,o;const t=this.meditations.find(c=>c.id===e);if(!t)return;const i=((r=(n=this.app.state)==null?void 0:n.currentUser)==null?void 0:r.isAdmin)||((s=(a=this.app.state)==null?void 0:a.currentUser)==null?void 0:s.isVip);if(t.premium&&!i&&!((o=(d=(l=this.app.gamification)==null?void 0:l.state)==null?void 0:d.unlockedFeatures)!=null&&o.includes("advanced_meditations"))){this.app.showToast("Unlock Advanced Meditations in the Karma Shop!","info");return}this._play(t,!0)}_play(e,t){try{if(this.currentMeditation=e,this.sessionStartTime=Date.now(),this.ytPlayer&&!document.getElementById("yt-player-container")){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const i=document.getElementById("meditation-audio-player");document.getElementById("player-emoji").innerHTML=e.emoji,document.getElementById("player-title").textContent=e.title,i.classList.remove("hidden"),e.embedUrl&&this._startYouTubePlayer(e,t)}catch(i){console.error("Error starting meditation:",i),this.app.showToast("Error starting meditation","error")}}_startYouTubePlayer(e,t){if(!window.ytReady||!window.YT||!window.YT.Player){this.app.showToast("Initializing player… please tap again.","info");const i=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{window.ytReady=!0,typeof i=="function"&&i(),this._startYouTubePlayer(e,t)};return}try{const i=e.embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/)[1],n=window.location.origin&&window.location.origin!=="null"?window.location.origin:void 0;if(t?this._showVideoPane():this._hideVideoPane(),document.getElementById("play-pause-btn").disabled=!0,!this.ytPlayer||typeof this.ytPlayer.playVideo!="function"){if(this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const r={enablejsapi:1,rel:0,playsinline:1};n&&(r.origin=n),this.ytPlayer=new YT.Player("yt-player-container",{videoId:i,playerVars:r,events:{onReady:()=>{document.getElementById("play-pause-btn").disabled=!1,this.ytPlayer.playVideo(),this.app.showToast(t?"Playing – tap pause to stop":"Audio playing","success")},onStateChange:a=>this._handleYouTubeStateChange(a),onError:a=>{console.error("YouTube player error:",a),this.app.showToast("Video error – check connection or video availability","error")}}})}else this.ytPlayer.loadVideoById(i);this._startProgressUpdates()}catch(i){console.error("Error initializing YouTube player:",i),this.app.showToast("Error loading video","error")}}_handleYouTubeStateChange(e){const t=window.featuresManager.engines.meditations;e.data===YT.PlayerState.ENDED&&t.currentMeditation&&t.onMeditationComplete(),e.data===YT.PlayerState.PLAYING&&(t.isPlaying=!0,document.getElementById("play-pause-btn").textContent="⏸️"),e.data===YT.PlayerState.PAUSED&&(t.isPlaying=!1,document.getElementById("play-pause-btn").textContent="▶️")}_startProgressUpdates(){this.progressInterval&&clearInterval(this.progressInterval),this.progressInterval=setInterval(()=>{this.isPlaying&&this.updateProgress()},this.PROGRESS_UPDATE_MS)}_showVideoPane(){document.getElementById("video-pane").classList.remove("hidden"),document.getElementById("meditation-audio-player").classList.add("video-mode"),this.initDrag()}_hideVideoPane(){document.getElementById("video-pane").classList.add("hidden"),document.getElementById("meditation-audio-player").classList.remove("video-mode")}initDrag(){const e=document.querySelector(".player-info"),t=document.getElementById("meditation-player-wrapper");if(!e||!t)return;let i,n,r,a;const s=o=>{i=o.touches?o.touches[0].clientX:o.clientX,n=o.touches?o.touches[0].clientY:o.clientY;const c=t.getBoundingClientRect();r=i-c.left,a=n-c.top,document.addEventListener("mousemove",l),document.addEventListener("mouseup",d),document.addEventListener("touchmove",l,{passive:!1}),document.addEventListener("touchend",d,{passive:!0}),o.preventDefault()},l=o=>{const c=(o.touches?o.touches[0].clientX:o.clientX)-r,p=(o.touches?o.touches[0].clientY:o.clientY)-a;t.style.left=c+"px",t.style.top=p+"px",t.style.bottom="auto",t.style.right="auto"},d=()=>{document.removeEventListener("mousemove",l),document.removeEventListener("mouseup",d),document.removeEventListener("touchmove",l),document.removeEventListener("touchend",d)};e.addEventListener("mousedown",s),e.addEventListener("touchstart",s,{passive:!1}),this.eventCleanup.push(()=>{e.removeEventListener("mousedown",s),e.removeEventListener("touchstart",s)})}togglePlay(){if(this.currentMeditation&&this.ytPlayer&&typeof this.ytPlayer.playVideo=="function")try{this.isPlaying?this.ytPlayer.pauseVideo():this.ytPlayer.playVideo()}catch(e){console.error("Error toggling playback:",e),this.app.showToast("Player not ready","info")}}stopMeditation(){try{if(this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null,this.progressInterval&&(clearInterval(this.progressInterval),this.progressInterval=null),this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const e=document.getElementById("yt-player-container");e&&(e.innerHTML="");const t=document.getElementById("play-pause-btn");t&&(t.textContent="▶️");const i=document.getElementById("meditation-audio-player");i&&i.classList.add("hidden"),this._hideVideoPane()}catch(e){console.error("Error stopping meditation:",e)}}skipForward(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=this.ytPlayer.getDuration()||0,i=Math.min(e+this.SKIP_SECONDS,t);this.ytPlayer.seekTo(i,!0)}catch(e){console.error("Error skipping forward:",e)}}skipBackward(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=Math.max(e-this.SKIP_SECONDS,0);this.ytPlayer.seekTo(t,!0)}catch(e){console.error("Error skipping backward:",e)}}updateProgress(){if(!(!this.ytPlayer||typeof this.ytPlayer.getCurrentTime!="function"))try{const e=this.ytPlayer.getCurrentTime()||0,t=this.ytPlayer.getDuration()||0;t>0&&(document.getElementById("player-time").textContent=`${this.formatTime(e)} / ${this.formatTime(t)}`,this.updateRing(e,t))}catch(e){console.error("Error updating progress:",e)}}updateRing(e,t){const i=document.getElementById("player-progress-ring");if(!(!i||!t||t===0))try{const n=i.r.baseVal.value,r=2*Math.PI*n;i.style.strokeDasharray=`${r} ${r}`;const a=e/t,s=r-a*r;i.style.strokeDashoffset=isNaN(s)?r:s}catch(n){console.error("Error updating ring:",n)}}onMeditationComplete(){try{if(this.isPlaying=!1,document.getElementById("play-pause-btn").textContent="▶️",this.app.showToast("Meditation complete! Well done.","success"),!this.currentMeditation)return;const e=this.ytPlayer?Math.floor((this.ytPlayer.getDuration()||0)/60):0,t=Math.max(e,1),i=this.getChakraFromMeditation(this.currentMeditation.category),n={type:this.currentMeditation.type||"guided",meditationId:this.currentMeditation.id,title:this.currentMeditation.title,category:this.currentMeditation.category,duration:t,chakra:i,timestamp:new Date().toISOString(),sessionStartTime:this.sessionStartTime,completedAt:Date.now()};this.app.state&&this.app.state.addEntry("meditation",n),this.checkAchievements(),this.sessionStartTime=null}catch(e){console.error("Error completing meditation:",e)}}checkAchievements(){var e,t;try{const i=(((t=(e=this.app.state)==null?void 0:e.data)==null?void 0:t.meditationHistory)||[]).length,n=this.app.gamification;if(!n)return;const r=n.getBadgeDefinitions();i>=1&&n.checkAndGrantBadge("first_meditation",r),i>=20&&n.checkAndGrantBadge("meditation_devotee",r),i>=60&&n.checkAndGrantBadge("meditation_master",r),i>=100&&n.checkAndGrantBadge("meditation_100",r),i>=200&&n.checkAndGrantBadge("meditation_200",r)}catch(i){console.error("Error checking achievements:",i)}}getChakraFromMeditation(e){return{Grounding:"root",Energy:"sacral",Chakras:"heart",Spiritual:"crown",Healing:"heart",Manifestation:"solar",Premium:"crown"}[e]||null}formatTime(e){if(!e||isNaN(e)||e<0)return"0:00";const t=Math.floor(e/60),i=Math.floor(e%60);return`${t}:${i.toString().padStart(2,"0")}`}openPDFGuide(){this.pdfGuideUrl&&this.pdfGuideUrl!=="YOUR_PDF_URL_HERE"?window.open(this.pdfGuideUrl,"_blank"):this.app.showToast("PDF Guide is not yet available.","info")}destroy(){this.cleanup()}cleanup(){try{if(this.progressInterval&&(clearInterval(this.progressInterval),this.progressInterval=null),this.eventCleanup.forEach(t=>t()),this.eventCleanup=[],this.ytPlayer&&typeof this.ytPlayer.destroy=="function"){try{this.ytPlayer.destroy()}catch{}this.ytPlayer=null}const e=document.getElementById("yt-player-container");e&&(e.innerHTML=""),this.isPlaying=!1,this.currentMeditation=null,this.sessionStartTime=null}catch(e){console.error("Error during cleanup:",e)}}}typeof window<"u"&&(window.MeditationsEngine=b);export{b as default};
