var A=Object.defineProperty;var H=(m,e,t)=>e in m?A(m,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):m[e]=t;var u=(m,e,t)=>H(m,typeof e!="symbol"?e+"":e,t);const n=class n{constructor(e){this.app=e,this.searchQuery="",this.isDestroyed=!1,this.domCache={},this.resizeTimeout=null,this.searchDebounce=null,this.boundHandleResize=null,this._boundMoodHandler=null,this.currentCheckin=this.getTodayCheckin(),this.initializeListeners(),this.scheduleInitialRender()}initializeListeners(){this.boundHandleResize=this.handleResize.bind(this),window.addEventListener("resize",this.boundHandleResize)}scheduleInitialRender(){let e=0;const t=()=>{if(!this.isDestroyed){if(document.getElementById("energy-tab")){this.render();return}++e<n.MAX_RENDER_RETRIES&&requestAnimationFrame(t)}};requestAnimationFrame(t)}handleResize(){clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{!this.isDestroyed&&document.getElementById("energy-tab")?.offsetParent&&this.updateChartsOnly()},n.RESIZE_DEBOUNCE)}updateChartsOnly(){const e=document.querySelector(".weekly-chart-box"),t=document.querySelector(".chakra-balance-radar");e&&(e.innerHTML=this.renderWeeklyChart(this.getWeeklyData())),t&&(t.innerHTML=this.renderRadarChart(this.getChakraAverages(),200))}getTodayCheckin(){try{const e=this.getISODate(),a=(this.app.state.data.energyEntries||[]).find(i=>this.getISODate(i.timestamp)===e);return a?.chakras?{overallEnergy:a.energy||6,moodTags:a.moodTags||[],chakras:a.chakras,notes:a.notes||"",practicesDone:a.practicesDone||[],timestamp:a.timestamp,dayCheckin:a.dayCheckin||!1,nightCheckin:a.nightCheckin||!1}:this.createDefaultCheckin()}catch(e){return console.error("Error loading check-in:",e),this.createDefaultCheckin()}}createDefaultCheckin(){return{overallEnergy:6,moodTags:[],chakras:this.getDefaultChakraSnapshot(),notes:"",practicesDone:[],timestamp:Date.now(),dayCheckin:!1,nightCheckin:!1}}getDefaultChakraSnapshot(){const e={};return n.CHAKRAS.forEach(t=>e[t.key]=5),e}getISODate(e=Date.now()){const t=new Date(e);return t.setHours(0,0,0,0),t.toISOString().split("T")[0]}getTimeOfDayInfo(){const e=new Date().getHours(),t=e>=n.DAY_START_HOUR&&e<n.DAY_END_HOUR;let a;return e<12?a="morning":e<18?a="afternoon":a="evening",{period:t?"day":"night",greeting:a,isDay:t}}saveCheckin(e=!1){try{const{period:t}=this.getTimeOfDayInfo(),a=this.app.state.data.energyEntries||[],i=this.getISODate(),r=a.findIndex(c=>this.getISODate(c.timestamp)===i);t==="day"?this.currentCheckin.dayCheckin=!0:this.currentCheckin.nightCheckin=!0;const s={energy:this.currentCheckin.overallEnergy,moodTags:this.currentCheckin.moodTags,chakras:this.currentCheckin.chakras,notes:this.currentCheckin.notes,practicesDone:e?[...this.currentCheckin.practicesDone||[],"manual"]:this.currentCheckin.practicesDone||[],timestamp:Date.now(),date:i,dayCheckin:this.currentCheckin.dayCheckin,nightCheckin:this.currentCheckin.nightCheckin,timeOfDay:t};r>=0?(s.dayCheckin=s.dayCheckin||a[r].dayCheckin,s.nightCheckin=s.nightCheckin||a[r].nightCheckin,a[r]=s):a.unshift(s),this.app.state.data.energyEntries=a,this.app.state.saveAppData(),this.app.state.updateStreak(),this.app.gamification&&(this.app.gamification.progressEnergyCheckin(t),this.app.gamification.checkChakraBadges(this.currentCheckin.chakras)),this.app.showToast(`${t==="day"?"Day":"Night"} energy check-in saved!`,"success"),this.render()}catch(t){console.error("Error saving check-in:",t),this.app.showToast("Failed to save check-in","error")}}getWeeklyData(){const e=[];for(let a=6;a>=0;a--){const i=new Date;i.setDate(i.getDate()-a),e.push(this.getISODate(i.getTime()))}const t=this.app.state.data.energyEntries||[];return e.map(a=>{const i=t.find(r=>this.getISODate(r.timestamp)===a);return i?i.energy:0})}getChakraAverages(){const e=this.app.state.data.energyEntries||[];if(!e.length)return this.getDefaultChakraSnapshot();const t={};n.CHAKRAS.forEach(r=>t[r.key]=0);let a=0;if(e.forEach(r=>{r.chakras&&(a++,n.CHAKRAS.forEach(s=>{t[s.key]+=r.chakras[s.key]||0}))}),!a)return this.getDefaultChakraSnapshot();const i={};return n.CHAKRAS.forEach(r=>{i[r.key]=Math.round(t[r.key]/a*10)/10}),i}render(){if(this.isDestroyed)return;const e=document.getElementById("energy-tab");if(e)try{const t=this.app.state.getStats(),a=this.getWeeklyData(),i=this.getChakraAverages(),{period:r,greeting:s}=this.getTimeOfDayInfo(),c=r==="day"?this.currentCheckin.dayCheckin:this.currentCheckin.nightCheckin;e.innerHTML=this.buildMainHTML(t,a,i,s,r,c),this.clearDOMCache(),this.attachEventListeners()}catch(t){console.error("Render error:",t),e.innerHTML='<div class="card"><p>Error loading. Please refresh.</p></div>'}}clearDOMCache(){this.domCache={}}getElement(e){return this.domCache[e]||(this.domCache[e]=document.getElementById(e)),this.domCache[e]}buildMainHTML(e,t,a,i,r,s){const c=this.app.state.data.energyEntries||[],o=this.filterJournalEntries(c);return`
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">
          ${this.buildHeader()}
          ${this.buildCheckinCard(e,i,r,s)}
          ${this.buildReikiCTA()}
          ${this.buildChartsSection(t,a)}
          ${this.buildJournalSection(o)}
        </div>
      </div>
      ${this.buildStyles()}
    `}filterJournalEntries(e){if(!this.searchQuery)return e;const t=this.searchQuery.toLowerCase();return e.filter(a=>(a.notes||"").toLowerCase().includes(t)||(a.moodTags||[]).join(" ").toLowerCase().includes(t))}buildHeader(){return`
      <header class="main-header project-curiosity"
              style="--header-img:url('/Tabs/NavEnergy.webp');--header-title:'';
                     --header-tag:'Check, review, track and learn your energy patterns - Overall and Chakras'">
        <h1>Energy Tracker</h1>
        <h3>Check, review, track and learn your energy patterns - Overall and Chakras</h3>
      </header>`}buildReikiCTA(){return`
      <div class="community-link-card" style="padding-top:0;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:0;">
          <picture><source srcset="/Tabs/CommunityHub.webp" type="image/webp"><img src="/Tabs/CommunityHub.png" alt="Community" width="480" height="360" style="width:30rem;object-fit:contain;margin-top:1rem;margin-bottom:1rem;" loading="lazy" decoding="async"></picture>
          <h3 style="margin:0;font-size:1.15rem;text-align:center;">Learn &amp; Practice Reiki and Chakras with the Community</h3>
        </div>
        <p style="margin:0 0 1.5rem;font-size:0.92rem;line-height:1.6;">Deepen your energy practice together. Join live sessions, guided meditations, and group healing circles - all in one place.</p>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button onclick="document.activeElement?.blur();window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Enter the Community Hub
          </button>
          <button onclick="document.activeElement?.blur();window._pendingRoomOpen='reiki';window.app.nav.switchTab('community-hub')"
                  class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;flex:1 1 40%;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
            Enter the Reiki Room
          </button>
        </div>
      </div>`}buildCheckinCard(e,t,a,i){return`
      <div class="card" style="margin-bottom:2rem;">
        ${this.buildCheckinHeader(e,t,a,i)}
        ${this.buildOverallEnergySlider()}
        ${this.buildMoodSelector()}
        ${this.buildChakraSection()}
        ${this.buildNotesSection()}
        ${this.buildActionButtons(a)}
      </div>`}buildCheckinHeader(e,t,a,i){return`
      <div class="flex items-center justify-between" style="margin-bottom:2rem;">
        <div>
          <h3 class="text-2xl font-bold" style="color:var(--neuro-text);">Good ${t}</h3>
          <p class="text-sm" style="color:var(--neuro-text-light);">Log in your Overall Energy and your Specific Chakras</p>
          ${i?`<p class="text-sm mt-1" style="color:var(--neuro-success);">✓ ${a==="day"?"Day":"Night"} check-in completed</p>`:""}
        </div>
        <div class="text-right">
          <p class="text-sm" style="color:var(--neuro-text-light);">${new Date().toLocaleDateString()}</p>
          <p class="text-sm" style="color:var(--neuro-text-light);">Streak: ${e.currentStreak} day(s)</p>
          <div class="flex gap-2 mt-2 justify-end text-xs">
            <span class="${this.currentCheckin.dayCheckin?"badge badge-success":"badge"}" style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              ${this.currentCheckin.dayCheckin?"✓":""}
            </span>
            <span class="${this.currentCheckin.nightCheckin?"badge badge-success":"badge"}" style="padding:4px 8px;display:inline-flex;align-items:center;gap:4px;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:12px;height:12px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ${this.currentCheckin.nightCheckin?"✓":""}
            </span>
          </div>
        </div>
      </div>`}buildOverallEnergySlider(){return`
      <div style="margin-bottom:2rem;">
        <label class="form-label">Overall Energy Level</label>
        <div class="flex items-center gap-4">
          <input type="range" id="energy-overall-slider" min="0" max="10" step="0.5"
                 value="${this.currentCheckin.overallEnergy}" class="flex-1" aria-label="Overall energy level"/>
          <span id="energy-overall-value" class="text-3xl font-bold"
                style="color:var(--neuro-accent);min-width:3rem;text-align:center;">
            ${this.currentCheckin.overallEnergy}
          </span>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-sm" style="color:var(--neuro-text-light);">Low</span>
          <span class="text-sm" style="color:var(--neuro-text-light);">High</span>
        </div>
      </div>`}buildMoodSelector(){return`
      <div style="margin-bottom:2rem;">
        <label class="form-label">Current Mood</label>
        <div id="mood-chips" class="flex flex-wrap gap-2">
          ${n.MOODS.map(e=>`
            <button class="chip ${this.currentCheckin.moodTags.includes(e)?"active":""}"
                    data-mood="${e}" type="button">
              ${this.getMoodEmoji(e)} ${this.capitalize(e)}
            </button>`).join("")}
        </div>
      </div>`}buildChakraSection(){return`
      <div style="margin-bottom:2rem;">
        <label class="form-label">Chakra Check-in</label>
        <div id="chakra-row" class="chakra-row">${this.buildChakraRow()}</div>
      </div>`}buildNotesSection(){return`
      <div style="margin-bottom:2rem;">
        <label for="energy-notes" class="form-label">Notes, Thoughts, Emotions, Mood</label>
        <textarea id="energy-notes" class="form-input"
                  placeholder="Any reflections, situations, or notable events regarding your energies..."
                  aria-label="Energy notes">${this.currentCheckin.notes||""}</textarea>
      </div>`}buildActionButtons(e){return`
      <div class="energy-action-buttons">
        <button id="btn-save-checkin" class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
          Save ${e==="day"?"Day":"Night"} Check-in
        </button>
        <button id="btn-reset-today" class="btn btn-secondary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Form
        </button>
      </div>`}buildChakraRow(){return n.CHAKRAS.map(e=>{const t=this.currentCheckin.chakras[e.key]||5,a=Math.abs(5-t),i=Math.min(12,a*2+2),r=Math.min(.48,a/6+.08),s=Math.floor(r*255).toString(16).padStart(2,"0");return`
        <div class="chakra-mini-card" data-chakra="${e.key}">
          <div class="chakra-pulse"
               style="box-shadow:0 0 ${i}px ${e.color}${s};
                      opacity:${a>0?1:0};transform:scale(${1+a*.01})"></div>
          <div class="chakra-icon" style="background:${e.color}">${e.name.charAt(0)}</div>
          <div style="font-size:13px;font-weight:700;text-align:center">${e.name}</div>
          <input type="range" class="chakra-slider" data-chakra="${e.key}"
                 min="0" max="10" step="0.5" value="${t}" style="width:100%"
                 aria-label="${e.name} level"/>
          <div class="chakra-value" style="font-size:13px;font-weight:700">${t}</div>
        </div>`}).join("")}buildChartsSection(e,t){return`
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style="margin-bottom:2rem;">
        <div class="card p-4 card-flex">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom:1rem;">Weekly Trend</h3>
          <div class="card-body w-full">
            <div class="weekly-chart-box">${this.renderWeeklyChart(e)}</div>
          </div>
        </div>
        <div class="card p-4">
          <h3 class="text-lg font-bold" style="color:var(--neuro-text);margin-bottom:1rem;">Chakra Balance</h3>
          <div class="flex justify-center chakra-balance-radar">${this.renderRadarChart(t,200)}</div>
          <div class="grid grid-cols-4 gap-2 mt-3 text-xs text-center">
            ${n.CHAKRAS.map(a=>`
              <div>
                <div class="font-bold" style="color:${a.color};">${t[a.key]}</div>
                <div class="text-gray-500">${a.name}</div>
              </div>`).join("")}
          </div>
        </div>
      </div>`}buildJournalSection(e){return`
      <div class="card calc-expandable-card" id="journal-collapsible-card">
        <div class="calc-expandable-header" id="journal-collapsible-header">
          <span class="chevron">›</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--neuro-accent);flex-shrink:0;">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <h3 style="color:var(--neuro-text);margin:0;font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.1);letter-spacing:0.025em;">My Energy Tracker</h3>
        </div>
        <div class="calc-expandable-content">
          <div style="margin-bottom:2rem;">
            <input type="text" id="journal-search" class="form-input"
                   placeholder="Search notes or moods..." value="${this.searchQuery}"
                   aria-label="Search journal entries"/>
          </div>
          <div class="space-y-4">${this.buildJournalEntries(e)}</div>
        </div>
      </div>`}buildJournalEntries(e){if(!e.length)return`
        <div class="card text-center" style="padding:4rem;">
          <div style="display:flex;justify-content:center;margin-bottom:1rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:56px;height:56px;color:var(--neuro-text-light);"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>
          </div>
          <p style="color:var(--neuro-text-light);">
            ${this.searchQuery?"No entries found matching your search":"No journal entries yet. Your check-ins will appear here."}
          </p>
        </div>`;const t=e.slice(0,n.MAX_HISTORY_DISPLAY).map(i=>this.renderJournalEntry(i)).join(""),a=e.length>n.MAX_HISTORY_DISPLAY?`<div class="text-center mt-6"><p class="text-sm" style="color:var(--neuro-text-light);">Showing ${n.MAX_HISTORY_DISPLAY} most recent entries</p></div>`:"";return t+a}renderJournalEntry(e){const t=new Date(e.timestamp),a=t.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}),i=t.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"}),r=[];return e.dayCheckin&&r.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg> Day</span>'),e.nightCheckin&&r.push('<span class="badge badge-success" style="font-size:0.75rem;display:inline-flex;align-items:center;gap:4px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:11px;height:11px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Night</span>'),`
      <div class="card" style="border-left:4px solid var(--neuro-accent)">
        <div class="flex justify-between items-start" style="margin-bottom:1rem;">
          <div>
            <div class="font-bold text-lg" style="color:var(--neuro-text)">${a}</div>
            <div class="text-sm" style="color:var(--neuro-text-light)">${i}</div>
            ${r.length?`<div class="flex gap-2 mt-2">${r.join("")}</div>`:""}
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-3xl font-bold" style="color:var(--neuro-accent)">${e.energy}</div>
              <div class="text-sm" style="color:var(--neuro-text-light);">Energy</div>
            </div>
            <button class="btn-delete-entry" data-timestamp="${e.timestamp}" title="Delete entry"
                    style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;
                           border-radius:50%;border:none;cursor:pointer;background:rgba(224,75,75,0.1);
                           color:#e04b4b;flex-shrink:0;transition:background 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>
        ${this.buildEntryMoodTags(e)}
        ${this.buildEntryNotes(e)}
        ${this.buildEntryChakras(e)}
      </div>`}buildEntryMoodTags(e){return e.moodTags?.length?`
      <div class="flex flex-wrap gap-2" style="margin-bottom:1rem;">
        ${e.moodTags.map(t=>`
          <span class="badge" style="font-size:0.85rem">${this.getMoodEmoji(t)} ${this.capitalize(t)}</span>`).join("")}
      </div>`:""}buildEntryNotes(e){return e.notes?`<div style="color:var(--neuro-text);line-height:1.6;white-space:pre-wrap">${String(e.notes).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}</div>`:""}buildEntryChakras(e){return e.chakras?`
      <div class="mt-4 pt-4" style="border-top:1px solid rgba(0,0,0,.05)">
        <div class="text-sm font-bold" style="color:var(--neuro-text-light);margin-bottom:0.5rem;">Chakras:</div>
        <div class="grid grid-cols-4 md:grid-cols-7 gap-2">
          ${n.CHAKRAS.map(t=>`
            <div class="text-center">
              <div class="text-xs" style="color:var(--neuro-text-light);margin-bottom:0.25rem;">${t.name}</div>
              <div class="text-sm font-bold" style="color:${t.color}">${e.chakras[t.key]||5}</div>
            </div>`).join("")}
        </div>
      </div>`:""}renderWeeklyChart(e){const t=document.querySelector("#energy-tab .card-body");if(!t)return'<div style="padding:2rem;color:var(--neuro-text-light)">Loading...</div>';const a=t.clientWidth,i=t.clientHeight,r=20,c=i+105+r,o=.55,h=.01,d=a/7,y=i/10,f=d*h,b=d*o-f,S=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],M=l=>l===0?"#e04b4b":l<=3?"#f08a4b":l<=6?"#f6c24a":l<=9?"#6fcf97":"#ffd700";let g=`<svg viewBox="0 ${-r} ${a} ${c}" style="width:100%;height:100%;display:block">`;for(let l=0;l<=10;l+=2){const p=i-l*y;g+=`<line x1="0" y1="${p}" x2="${a}" y2="${p}" stroke="rgba(0,0,0,.08)" stroke-width="1"/>`,g+=`<text x="6" y="${p+5}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle">${l}</text>`}e.forEach((l,p)=>{const x=Math.min(10,Math.max(0,l)),w=x===0?6:x*y,C=p*d+f,$=C+b/2,T=i-w;g+=`<rect x="${C}" y="${T}" width="${b}" height="${w}" rx="2" fill="${M(x)}"/>`;const E=i+22;g+=`<text x="${$}" y="${E}" font-size="14" font-weight="bold" fill="var(--neuro-text-light)" text-anchor="middle" transform="rotate(-90,${$},${E})">${S[p]}</text>`});const v=e.filter(l=>l>0),D=v.length?(v.reduce((l,p)=>l+p,0)/v.length).toFixed(1):"-";return g+=`<text x="${a/2}" y="${i+85}" font-size="14" font-weight="bold" fill="var(--neuro-text)" text-anchor="middle">7 Days Average: ${D}</text>`,g+="</svg>",g}renderRadarChart(e,t){const a=n.CHAKRAS.map(o=>o.key),i=t/2,r=t/2,s=t/2-24,c=a.map((o,h)=>{const d=Math.PI*2*h/a.length-Math.PI/2,y=Math.max(0,Math.min(10,e[o]||0));return`${i+Math.cos(d)*s*(y/10)},${r+Math.sin(d)*s*(y/10)}`}).join(" ");return`
      <svg viewBox="0 0 ${t} ${t}" style="max-width:100%;height:auto">
        ${[.25,.5,.75,1].map(o=>`<circle cx="${i}" cy="${r}" r="${s*o}" stroke="#e6eef4" fill="none" stroke-width="1"/>`).join("")}
        ${a.map((o,h)=>{const d=Math.PI*2*h/a.length-Math.PI/2;return`<line x1="${i}" y1="${r}" x2="${i+Math.cos(d)*s}" y2="${r+Math.sin(d)*s}" stroke="#eef6fa" stroke-width="1"/>`}).join("")}
        <polygon points="${c}" fill="rgba(102,126,234,.2)" stroke="var(--neuro-accent)" stroke-width="2"/>
        ${n.CHAKRAS.map((o,h)=>{const d=Math.PI*2*h/a.length-Math.PI/2;return`<text x="${i+Math.cos(d)*(s+12)}" y="${r+Math.sin(d)*(s+12)}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="var(--neuro-text-light)">${o.name}</text>`}).join("")}
      </svg>`}attachEventListeners(){this.attachOverallEnergyListener(),this.attachNotesListener(),this.attachMoodListeners(),this.attachChakraListeners(),this.attachButtonListeners(),this.attachCollapsibleListener(),this.attachSearchListener(),this.attachDeleteListeners()}attachDeleteListeners(){document.querySelectorAll(".btn-delete-entry").forEach(e=>{e.addEventListener("click",t=>{const a=parseInt(t.currentTarget.dataset.timestamp);confirm("Delete this energy entry?")&&this.deleteEnergyEntry(a)})})}deleteEnergyEntry(e){try{const t=this.app.state.data.energyEntries||[],a=t.findIndex(i=>i.timestamp===e);a>=0&&(t.splice(a,1),this.app.state.data.energyEntries=t,this.app.state.saveAppData(),this.app.showToast("Entry deleted","success"),this.render())}catch(t){console.error("Error deleting entry:",t),this.app.showToast("Failed to delete entry","error")}}attachOverallEnergyListener(){const e=this.getElement("energy-overall-slider"),t=this.getElement("energy-overall-value");e&&t&&e.addEventListener("input",a=>{const i=parseFloat(a.target.value);this.currentCheckin.overallEnergy=i,t.textContent=i})}attachNotesListener(){const e=this.getElement("energy-notes");e&&e.addEventListener("input",t=>{this.currentCheckin.notes=t.target.value})}attachMoodListeners(){this._boundMoodHandler=e=>{const t=e.currentTarget;if(!t)return;const a=t.dataset.mood;if(!a)return;const i=this.currentCheckin.moodTags.indexOf(a);i>=0?(this.currentCheckin.moodTags.splice(i,1),t.classList.remove("active")):(this.currentCheckin.moodTags.push(a),t.classList.add("active"))},document.querySelectorAll("[data-mood]").forEach(e=>{e.removeEventListener("click",this._boundMoodHandler),e.addEventListener("click",this._boundMoodHandler)})}attachChakraListeners(){document.querySelectorAll(".chakra-slider").forEach(e=>{e.addEventListener("input",t=>{const a=t.target.dataset.chakra,i=parseFloat(t.target.value);this.currentCheckin.chakras[a]=i;const r=t.target.closest(".chakra-mini-card"),s=r?.querySelector(".chakra-value");s&&(s.textContent=i),this.updateChakraPulse(r,a,i)})})}updateChakraPulse(e,t,a){if(!e)return;const i=Math.abs(5-a),r=Math.min(12,i*2+2),s=Math.min(.48,i/6+.08),c=n.CHAKRAS.find(h=>h.key===t),o=e.querySelector(".chakra-pulse");if(o&&c){const h=Math.floor(s*255).toString(16).padStart(2,"0");o.style.boxShadow=`0 0 ${r}px ${c.color}${h}`,o.style.opacity=i>0?1:0,o.style.transform=`scale(${1+i*.01})`}}attachButtonListeners(){const e=this.getElement("btn-save-checkin"),t=this.getElement("btn-reset-today");e&&e.addEventListener("click",()=>this.saveCheckin(!1)),t&&t.addEventListener("click",()=>{confirm("Clear form? (saved entry stays)")&&(this.currentCheckin=this.createDefaultCheckin(),this.render())})}attachCollapsibleListener(){const e=this.getElement("journal-collapsible-header"),t=this.getElement("journal-collapsible-card");e&&t&&e.addEventListener("click",()=>t.classList.toggle("expanded"))}attachSearchListener(){const e=this.getElement("journal-search"),t=this.getElement("journal-collapsible-card");e&&e.addEventListener("input",a=>{clearTimeout(this.searchDebounce),this.searchDebounce=setTimeout(()=>{this.searchQuery=a.target.value,this.render(),t?.classList.add("expanded")},n.SEARCH_DEBOUNCE)})}buildStyles(){return`
      <style>
        .card-flex{display:flex;flex-direction:column;}
        .card-body{flex:1 1 0;min-height:0;width:100%;}
        .weekly-chart-box{aspect-ratio:7/10;max-width:100%;max-height:100%;margin:auto;display:flex;align-items:center;justify-content:center;}
        .chakra-row{display:flex;gap:12px;padding:8px 2px;}
        .chakra-mini-card{flex:1 1 0;min-width:112px;background:var(--neuro-bg);border-radius:12px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:8px;position:relative;box-shadow:8px 8px 18px var(--neuro-shadow-dark),-8px -8px 18px var(--neuro-shadow-light);}
        .chakra-icon{width:36px;height:36px;border-radius:50%;color:white;display:grid;place-items:center;font-weight:700;font-size:0.9rem;box-shadow:inset 4px 4px 8px rgba(0,0,0,.1),inset -4px -4px 8px rgba(255,255,255,.2);}
        .chakra-pulse{position:absolute;inset:-6px;border-radius:16px;pointer-events:none;transition:all 260ms ease;}
        .energy-action-buttons{display:flex;gap:0.75rem;}
        .energy-action-buttons .btn{flex:1;}
        .chip{background:rgba(31,45,61,0.04);border:1px solid rgba(0,0,0,0.02);padding:8px 16px;border-radius:999px;cursor:pointer;font-size:0.9rem;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:0.3rem;touch-action:manipulation;-webkit-tap-highlight-color:transparent;}
        .chip.active{background:linear-gradient(90deg,rgba(246,194,74,0.16),rgba(110,231,183,0.12));box-shadow:inset 4px 4px 8px rgba(0,0,0,.04),inset -4px -4px 8px rgba(255,255,255,.7);}
        .badge{display:inline-flex;align-items:center;justify-content:center;gap:4px;line-height:1;}
        .calc-expandable-header{padding:24px;cursor:pointer;display:flex;align-items:center;gap:12px;}
        .calc-expandable-header h3{margin:0;font-size:1.1rem;color:var(--neuro-text);}
        .chevron{font-size:1.5rem;transition:transform var(--transition-normal);color:var(--neuro-accent);}
        .calc-expandable-card.expanded .chevron{transform:rotate(90deg);}
        .calc-expandable-content{max-height:0;overflow:hidden;transition:max-height var(--transition-slow);}
        .calc-expandable-card.expanded .calc-expandable-content{max-height:5000px;padding:0 24px 24px;}
        @media(max-width:768px){
          .energy-action-buttons{flex-direction:column;}
          .energy-action-buttons .btn{width:100%;}
          .chakra-row{flex-wrap:wrap;}
          .chakra-mini-card{min-width:calc(50% - 6px);}
        }
      </style>`}getMoodEmoji(e){return n.MOOD_EMOJIS[e]||"😊"}capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1)}destroy(){this.isDestroyed=!0,window.removeEventListener("resize",this.boundHandleResize),clearTimeout(this.resizeTimeout),clearTimeout(this.searchDebounce),this.domCache={},this._boundMoodHandler=null}};u(n,"CHAKRAS",[{key:"root",name:"Root",color:"#e04b4b"},{key:"sacral",name:"Sacral",color:"#f08a4b"},{key:"solar",name:"Solar",color:"#f6c24a"},{key:"heart",name:"Heart",color:"#6fcf97"},{key:"throat",name:"Throat",color:"#5fb7f0"},{key:"thirdEye",name:"Third Eye",color:"#8b6be6"},{key:"crown",name:"Crown",color:"#c59ee9"}]),u(n,"MOODS",["grounded","anxious","calm","happy","creative","tired","focused","grateful","curious","confident"]),u(n,"MOOD_EMOJIS",{grounded:"🌍",anxious:"😰",calm:"😌",happy:"😊",creative:"🎨",tired:"😴",focused:"🎯",grateful:"🙏",curious:"🤔",confident:"💪"}),u(n,"RESIZE_DEBOUNCE",120),u(n,"SEARCH_DEBOUNCE",300),u(n,"MAX_RENDER_RETRIES",50),u(n,"MAX_HISTORY_DISPLAY",30),u(n,"DAY_START_HOUR",5),u(n,"DAY_END_HOUR",17);let k=n;typeof window<"u"&&(window.EnergyEngineEnhanced=k);export{k as default};
