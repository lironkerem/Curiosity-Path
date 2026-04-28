import{C as h,a as j,S as ve}from"./community-hub-CJhlSKys.js";const W={ENDED:0,PLAYING:1},ae={initPlayerState(){this.state.player=null,this.state.playerReady=!1,this.state.playerInitialized=!1,this.state.sessionStarted=!1,this._progressInterval=null},preloadYouTubeAPI(){if(document.querySelector('script[src*="youtube.com/iframe_api"]'))return;const n=document.createElement("script");n.src="https://www.youtube.com/iframe_api",document.head.appendChild(n)},loadYouTubeAPI(){if(window.YT?.Player){this.initPlayer();return}const n=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{n?.(),this.initPlayer()}},initPlayer(){if(this.state.playerInitialized)return;const n=this.getCurrentSession();if(!n?.videoId){console.warn(`[${this.roomId}] No video session available`);return}this.state.player=new YT.Player(`${this.roomId}-youtube-player`,{videoId:n.videoId,playerVars:{autoplay:0,controls:1,modestbranding:1,rel:0,mute:1},events:{onReady:e=>this.onPlayerReady(e),onStateChange:e=>this.onPlayerStateChange(e)}}),this.state.playerInitialized=!0},onPlayerReady(n){this.state.playerReady=!0,n.target.cueVideoById(this.getCurrentSession()?.videoId),this.state.isInSession&&window.Core.state?.currentUser?.is_admin&&this._startAtCycleOffset(n.target),this.onPlayerReadyCustom?.(n)},_startAtCycleOffset(n){const e=this.config.cycleDuration*1e3,t=this.config.openDuration*1e3,o=(Date.now()-this.state.cycleStartTime)%e,a=Math.max(0,(o-t)/1e3);n.seekTo(a,!0),n.unMute(),n.setVolume(100),n.playVideo(),this.state.sessionStarted=!0,this._showPlayer();const s=this.getCurrentSession();s&&window.Core.showToast(`${s.emoji} Joining session in progress…`)},onPlayerStateChange(n){n.data===W.PLAYING?this.onVideoPlaying():n.data===W.ENDED&&this.onVideoEnded()},onVideoPlaying(){this._showPlayer(),this.startProgressTracking()},onVideoEnded(){this.stopProgressTracking(),window.Core.showToast("Session complete")},startSession(){if(!this.state.playerReady||this.state.sessionStarted)return;const n=this.getCurrentSession();n&&(this._showPlayer(),this.state.player?.unMute(),this.state.player?.setVolume(100),this.state.player?.playVideo(),this.state.sessionStarted=!0,window.Core.showToast(`${n.emoji} Session starting…`))},togglePlayPause(){if(!this.state.player)return;const n=this.state.player.getPlayerState()===W.PLAYING;n?this.state.player.pauseVideo():this.state.player.playVideo();const e=document.getElementById(`${this.roomId}PlayBtn`);e&&(e.innerHTML=`<span style="font-size:24px;">${n?"▶":"⏸"}</span>`)},_seek(n){this.state.player&&this.state.player.seekTo(Math.max(0,this.state.player.getCurrentTime()+n))},skipBackward(){this._seek(-10)},skipForward(){this._seek(10)},startProgressTracking(){this._progressInterval||(this._progressInterval=setInterval(()=>this.updateTimeDisplay(),1e3))},stopProgressTracking(){this._progressInterval&&(clearInterval(this._progressInterval),this._progressInterval=null)},updateTimeDisplay(){if(!this.state.player?.getCurrentTime)return;const n=document.getElementById(`${this.roomId}TimeDisplay`);if(n){const e=Math.floor(this.state.player.getCurrentTime()),t=Math.floor(this.state.player.getDuration());n.textContent=`${this.formatTime(e)} / ${this.formatTime(t)}`}},_showPlayer(){const n=document.getElementById(`${this.roomId}PlayerOverlay`);n&&(n.style.display="none");const e=document.getElementById(`${this.roomId}Controls`);e&&(e.style.display="flex")},buildPlayerContainer(){const n=this.getCurrentSession();return`
        <div class="guided-player-container" role="region" aria-label="Video player">
            <div id="${this.roomId}-youtube-player"></div>
            <div class="player-overlay" id="${this.roomId}PlayerOverlay">
                <div class="session-info" aria-live="polite">
                    <div class="session-emoji"    id="${this.roomId}SessionEmoji"   >${n?.emoji||"🎧"}</div>
                    <div class="session-title"    id="${this.roomId}SessionTitle"   >${n?.title||"Loading..."}</div>
                    <div class="session-duration" id="${this.roomId}SessionDuration">${n?.duration||"00:00"}</div>
                    <div class="session-starts"   id="${this.roomId}SessionStatus"  >Waiting to start…</div>
                </div>
            </div>
        </div>`},buildPlayerControls(){return`
        <div class="guided-controls" id="${this.roomId}Controls" style="display:none;">
            <div class="control-buttons">
                <button type="button" class="control-btn" aria-label="Skip backward 10 seconds" data-action="skipBackward"><span style="font-size:20px;">⏪</span></button>
                <button type="button" class="control-btn primary" aria-label="Play or pause" data-action="togglePlayPause" id="${this.roomId}PlayBtn"><span style="font-size:24px;">⏸</span></button>
                <button type="button" class="control-btn" aria-label="Skip forward 10 seconds" data-action="skipForward"><span style="font-size:20px;">⏩</span></button>
            </div>
            <div class="time-display" id="${this.roomId}TimeDisplay">0:00 / 0:00</div>
        </div>`},cleanupPlayer(){this.stopProgressTracking(),this.state.player?.destroy(),this.state.player=null,this.state.playerReady=!1,this.state.playerInitialized=!1,this.state.sessionStarted=!1}},Te=Object.freeze(Object.defineProperty({__proto__:null,YouTubePlayerMixin:ae},Symbol.toStringTag,{value:"Module"})),se={initCycleState(){this.state.isOpen=!1,this.state.isInSession=!1,this.state.cycleStartTime=null,this.state.nextOpenTime=null,this.state.nextSessionStart=null,this._cycleInterval=null},initializeCycle(){const n=Date.now(),e=this.config.cycleDuration*1e3;this.state.cycleStartTime=n-n%e,this.setSessions?.(n),this.calculateCycleState(),this._cycleInterval&&clearInterval(this._cycleInterval),this._cycleInterval=setInterval(()=>{this.calculateCycleState(),this.updateRoomCard()},1e3)},calculateCycleState(){const n=Date.now(),e=this.config.cycleDuration*1e3,t=this.config.openDuration*1e3,i=(n-this.state.cycleStartTime)%e,o=n-i;o!==this.state.cycleStartTime&&(this.state.cycleStartTime=o,this.setSessions?.(n));const a=i<t;if(this.state.isOpen=a,this.state.isInSession=!a,a){const s=t-i;this.state.nextSessionStart=n+s,this.state.nextOpenTime=n+s+this.config.sessionDuration*1e3}else this.state.nextOpenTime=n+(e-i),this.state.nextSessionStart=null;this.state.isInSession&&!this.state.sessionStarted&&this.isUserInRoom()&&this.startSession?.()},isUserInRoom(){return window.Core?.state?.currentRoom===this.roomId},canEnterRoom(){return window.Core.state?.currentUser?.is_admin||this.state.isOpen},_checkCycleWindow(){return this.state.isOpen},_formatCountdown(n,e){if(!n)return"";const t=Math.max(0,n-Date.now()),i=Math.floor(t/6e4),o=Math.floor(t%6e4/1e3);return`${e} ${i}:${String(o).padStart(2,"0")}`},getTimeUntilSessionStarts(){return this._formatCountdown(this.state.nextSessionStart,"Session begins in")},getCountdownToNextOpen(){return this._formatCountdown(this.state.nextOpenTime,"Opens in")},getTimerText(){const n=this.getNextSession?.()?.title??"Next Session",e=this.state.isOpen?this.getTimeUntilSessionStarts():this.getCountdownToNextOpen();return`<strong>Next:</strong> ${n}<br>${e}`},buildScheduleLink(){return`
        <button type="button" class="view-schedule" data-action="showSchedule"
                style="text-align:center;font-size:11px;color:var(--text-secondary);text-decoration:underline;cursor:pointer;background:none;border:none;padding:0;display:inline-flex;align-items:center;gap:0.3rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> View Schedule
        </button>`},cleanupCycle(){this._cycleInterval&&(clearInterval(this._cycleInterval),this._cycleInterval=null)}},Se=Object.freeze(Object.defineProperty({__proto__:null,CycleStateMixin:se},Symbol.toStringTag,{value:"Module"})),H=n=>n.charAt(0).toUpperCase()+n.slice(1);function q(n,e,t,i){const o=t||n.charAt(0).toUpperCase(),a=window.Core?.getAvatarGradient?.(i||n)??"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",s=e?`<img src="${e}" width="36" height="36" style="width:36px;height:36px;object-fit:cover;border-radius:50%;display:block;flex-shrink:0;" alt="${n}" loading="lazy" decoding="async">`:`<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${o}</span>`,r=e?"background:transparent;":`background:${a};`;return{inner:s,bg:r,gradient:a,initial:o}}const ee=n=>new Date(n).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});function be(n){return!n||typeof n!="string"?"":n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const z={initChatState(n=["main"]){this.chatChannels=n,this.state.messages=Object.fromEntries(n.map(e=>[e,[]]))},async initializeChat(){await Promise.all(this.chatChannels.map(n=>this.loadRoomChatFromDB(n))),setTimeout(()=>this._injectSenderAvatar(),200)},_getDbRoomId(n="main"){return n==="main"?this.roomId:`${this.roomId}-${n}`},_msgContainerId(n){return`${this.roomId}${H(n)}Messages`},_inputId(n){return`${this.roomId}${H(n)}Input`},_rowToMsgData(n,e=!1){const t=n.profiles||{},i=window.Core?.state?.currentUser||{},o=e?i.name||"You":t.name||"Member",a=e?i.avatar_url||"":t.avatar_url||"",s=e?i.emoji||"":t.emoji||"",r=t.id||null,{gradient:l,initial:c}=q(o,a,s,r);return{name:o,initial:c,avatarUrl:a,avatarBg:l,userId:r,time:ee(n.created_at),text:n.message,country:null}},async sendMessage(n="main",e=null){const t=document.getElementById(e||this._inputId(n));if(!t?.value.trim())return;const i=t.value.trim(),o=document.getElementById(this._msgContainerId(n)),a=window.Core?.state?.currentUser||{},s=a.name||"You",{gradient:r,initial:l}=q(s,a.avatar_url||"",a.emoji||"",a.id),c={name:s,initial:l,avatarUrl:a.avatar_url||"",avatarBg:r,userId:a.id||null,time:ee(new Date),text:i,country:null,timestamp:Date.now(),...this.getCustomMessageData?.(n)};if(this.state.messages[n].push(c),o&&(o.insertAdjacentHTML("beforeend",this.buildMessageHTML(c)),o.scrollTop=o.scrollHeight),t.value="",window.Core.showToast("Message sent"),h?.ready)try{await h.sendRoomMessage(this._getDbRoomId(n),i)}catch(d){console.error("[ChatMixin] sendRoomMessage error:",d)}},async loadRoomChatFromDB(n="main"){if(!h?.ready){this.loadMessagesFromStorage(n),this.renderSavedMessages(n);return}const e=this._getDbRoomId(n),t=document.getElementById(this._msgContainerId(n)),i=window.Core?.state?.currentUser?.id;try{const[o,a]=await Promise.all([h.getRoomMessages(e,50),h.getBlockedUsers()]);if(t&&o.length){const s=o.filter(r=>!a.has(r.profiles?.id)).map(r=>{const l=r.profiles?.id===i;return this.buildMessageHTML(this._rowToMsgData(r,l))}).join("");s&&(t.insertAdjacentHTML("beforeend",s),t.scrollTop=t.scrollHeight)}h.subscribeToRoomChat(e,async s=>{s.profiles?.id===i||(await h.getBlockedUsers()).has(s.profiles?.id)||!t||(t.insertAdjacentHTML("beforeend",this.buildMessageHTML(this._rowToMsgData(s))),t.scrollTop=t.scrollHeight)})}catch(o){console.error(`[ChatMixin] loadRoomChatFromDB error (${n}):`,o)}},buildMessageHTML(n){const e=n.avatarUrl?`background-image:url('${n.avatarUrl}');background-size:cover;background-position:center;`:`background:${n.avatarBg};`,t=n.avatarUrl?"":`<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${n.initial}</span>`,i=n.userId?`<span class="campfire-msg-name" role="button" tabindex="0" style="cursor:pointer;" onclick="openMemberProfileAboveRoom('${n.userId}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${n.userId}');}" aria-label="View profile of ${n.name}">${n.name}</span>`:`<span class="campfire-msg-name">${n.name}</span>`;return`
        <div class="campfire-msg">
            <div class="campfire-msg-avatar" aria-hidden="true" style="${e}width:36px;height:36px;min-width:36px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${t}</div>
            <div class="campfire-msg-content">
                <div class="campfire-msg-header">
                    ${i}
                    ${n.country?`<span class="campfire-msg-country">${n.country}</span>`:""}
                    <span class="campfire-msg-time">${n.time}</span>
                </div>
                <div class="campfire-msg-text">${this._escapeHtml(n.text)}</div>
            </div>
        </div>`},buildChatContainer(n="main",e="Type your message..."){const t=H(n),i=`${this.roomId}${t}SenderAvatar`,o=`${this.roomId}${t}SendBtn`;return`
        <div class="chat-container" id="${this.roomId}${t}ChatContainer"
             style="display:flex;flex-direction:column;">
            <div class="chat-messages" id="${this.roomId}${t}Messages"></div>
            <div class="chat-input-container" style="padding-top:8px;border-top:none;padding-left:0;padding-right:0;padding-bottom:0;">
                <div style="display:flex;align-items:center;gap:6px;width:100%;flex-wrap:nowrap;box-sizing:border-box;">
                    <div id="${i}" style="flex-shrink:0;width:28px;height:28px;">
                        <div style="width:28px;height:28px;border-radius:50%;background:var(--border);"></div>
                    </div>
                    <input type="text"
                           class="chat-input"
                           id="${this.roomId}${t}Input"
                           aria-label="${e}"
                           placeholder="${e}"
                           onkeypress="if(event.key==='Enter')document.getElementById('${o}')?.click()"
                           style="flex:1;min-width:0;width:100%;">
                    <button type="button" class="chat-send" id="${o}"
                            data-action="sendMessage" data-channel="${n}"
                            aria-label="Send message" style="flex-shrink:0;">
                        <span style="font-size:20px;">→</span>
                    </button>
                </div>
            </div>
        </div>`},_injectSenderAvatar(n=null){const e=n?[n]:this.chatChannels||["main"],t=window.Core?.state?.currentUser;if(!t)return;const{inner:i,bg:o}=q(t.name||"Me",t.avatar_url||"",t.emoji||"",t.id);e.forEach(a=>{const s=document.getElementById(`${this.roomId}${H(a)}SenderAvatar`);if(!s)return;const r=t.avatar_url?`width:32px;height:32px;border-radius:50%;background-image:url('${t.avatar_url}');background-size:cover;background-position:center;flex-shrink:0;`:`width:32px;height:32px;border-radius:50%;${o}display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;`,l=t.avatar_url?"":i;s.innerHTML=`<div style="${r}">${l}</div>`})},loadMessagesFromStorage(n="main"){try{const e=localStorage.getItem(`${this.roomId}_messages_${n}`);e&&(this.state.messages[n]=JSON.parse(e))}catch(e){console.error("[ChatMixin] loadMessagesFromStorage error:",e),this.state.messages[n]=[]}},saveMessagesToStorage(n="main"){try{localStorage.setItem(`${this.roomId}_messages_${n}`,JSON.stringify(this.state.messages[n]))}catch(e){console.error("[ChatMixin] saveMessagesToStorage error:",e)}},renderSavedMessages(n="main"){const e=document.getElementById(this._msgContainerId(n)),t=this.state.messages[n];!e||!t.length||(e.insertAdjacentHTML("beforeend",t.map(i=>this.buildMessageHTML(i)).join("")),e.scrollTop=e.scrollHeight)},clearMessages(n="main"){this.state.messages[n]=[],localStorage.removeItem(`${this.roomId}_messages_${n}`);const e=document.getElementById(this._msgContainerId(n));e&&(e.innerHTML=""),window.Core.showToast("Messages cleared")},capitalize:H,_escapeHtml:be},Me=Object.freeze(Object.defineProperty({__proto__:null,ChatMixin:z},Symbol.toStringTag,{value:"Module"})),we=[{value:"tingsha",label:"Tingsha Bells"},{value:"bowl",label:"Singing Bowl"},{value:"chime",label:"Wind Chime"}],xe=[{value:"tibetan",label:"Tibetan Bowl"},{value:"gong",label:"Temple Gong"},{value:"bell",label:"Temple Bell"}],ke=[{value:"stream",label:"Gentle Stream"},{value:"rain",label:"Soft Rain"},{value:"forest",label:"Forest Birds"},{value:"ocean",label:"Ocean Waves"}],te={stream:"/Community/Ambient/Stream.mp3",rain:"/Community/Ambient/Rain.mp3",forest:"/Community/Ambient/Forrest.mp3",ocean:"/Community/Ambient/Ocean.mp3"},_e={tingsha:{baseFreq:900,partials:[{mult:1,gain:.6,decay:2.5},{mult:2.76,gain:.3,decay:1.8},{mult:5.4,gain:.15,decay:1}]},bowl:{baseFreq:220,partials:[{mult:1,gain:.7,decay:6},{mult:2.71,gain:.35,decay:4},{mult:5.2,gain:.12,decay:2.5}]},chime:{baseFreq:1200,partials:[{mult:1,gain:.5,decay:1.5},{mult:1.86,gain:.25,decay:1},{mult:3.01,gain:.1,decay:.6}]},tibetan:{baseFreq:180,partials:[{mult:1,gain:.7,decay:8},{mult:2.68,gain:.4,decay:6},{mult:5.1,gain:.15,decay:3.5}]},gong:{baseFreq:80,partials:[{mult:1,gain:.8,decay:6},{mult:2.2,gain:.5,decay:5},{mult:3.5,gain:.25,decay:3.5},{mult:5,gain:.1,decay:2}]},bell:{baseFreq:440,partials:[{mult:1,gain:.65,decay:4},{mult:2.75,gain:.3,decay:3},{mult:5.4,gain:.12,decay:1.8}]}},Y={initSoundState(){this.state.fiveMinBellEnabled=!1,this.state.ambientEnabled=!1,this.state.selectedBell="tingsha",this.state.selectedCompletion="tibetan",this.state.selectedAmbient="stream",this._audioCtx=null,this._ambientAudio=null},_getAudioCtx(){return this._audioCtx||(this._audioCtx=new(window.AudioContext||window.webkitAudioContext)),this._audioCtx.state==="suspended"&&this._audioCtx.resume(),this._audioCtx},_playBellProfile(n,e=1){const t=_e[n];if(!t)return;const i=this._getAudioCtx(),o=i.currentTime;t.partials.forEach(({mult:a,gain:s,decay:r})=>{const l=i.createOscillator(),c=i.createGain();l.type="sine",l.frequency.setValueAtTime(t.baseFreq*a,o),c.gain.setValueAtTime(s*e,o),c.gain.exponentialRampToValueAtTime(1e-4,o+r),l.connect(c),c.connect(i.destination),l.start(o),l.stop(o+r)})},toggleSoundSettings(){document.getElementById(`${this.roomId}SoundSettings`)?.classList.toggle("visible")},_toggleFeature(n,e,t,i,o,a){const s=!this.state[n];this.state[n]=s,document.getElementById(e)?.classList.toggle("active",s);const r=document.getElementById(t);r&&(r.style.display=s?"block":"none"),window.Core.showToast(`${i} ${s?"enabled":"disabled"}`),(s?o:a)?.call(this)},toggle5minBell(){this._toggleFeature("fiveMinBellEnabled",`${this.roomId}Toggle5min`,`${this.roomId}5minOptions`,"5-minute bell")},toggleAmbientSound(){this._toggleFeature("ambientEnabled",`${this.roomId}ToggleAmbient`,`${this.roomId}AmbientOptions`,"Ambient sound",this.playAmbientSound,this.stopAmbientSound)},selectBell(n){this.state.selectedBell=n},selectCompletion(n){this.state.selectedCompletion=n},selectAmbient(n){this.state.selectedAmbient=n,this.state.ambientEnabled&&(this.stopAmbientSound(),this.playAmbientSound())},previewSound(n,e){e?.stopPropagation(),this._playBellProfile(n),window.Core.showToast(`▶ ${n}`)},previewAmbient(n,e){e?.stopPropagation();const t=te[n];if(!t)return;this._previewAudio&&(this._previewAudio.pause(),this._previewAudio=null);const i=new Audio(t);i.volume=.5,i.play().catch(()=>window.Core.showToast("Preview unavailable")),this._previewAudio=i,setTimeout(()=>{i.pause(),this._previewAudio=null},4e3),window.Core.showToast(`▶ ${n}`)},playAmbientSound(){const n=te[this.state.selectedAmbient];if(!n)return;this.stopAmbientSound();const e=new Audio(n);e.loop=!0,e.volume=.35,e.play().catch(()=>window.Core.showToast("Ambient audio unavailable")),this._ambientAudio=e},stopAmbientSound(){this._ambientAudio&&(this._ambientAudio.pause(),this._ambientAudio.src="",this._ambientAudio=null)},play5MinBell(){this.state.fiveMinBellEnabled&&(this._playBellProfile(this.state.selectedBell,.7),window.Core.showToast("5-minute bell"))},playCompletionSound(){this._playBellProfile(this.state.selectedCompletion,1),window.Core.showToast("Session complete")},cleanupSound(){this.stopAmbientSound(),this._previewAudio&&(this._previewAudio.pause(),this._previewAudio=null),this._audioCtx&&(this._audioCtx.close(),this._audioCtx=null)},_soundOption(n,e,t,i,o){const a=this.state[`selected${n}`]===e;return`
        <div class="sound-option">
            <button type="button" class="sound-select-btn${a?" active":""}"
                    data-action="${o}" data-value="${e}"
                    aria-pressed="${a}"
                    style="flex:1;text-align:left;background:none;border:none;cursor:pointer;padding:4px 0;color:var(--text);font-size:14px;">
                ${a?"✓ ":""}${t}
            </button>
            <button type="button" class="sound-preview-btn"
                    data-action="${i}" data-value="${e}"
                    aria-label="Preview ${t}">▶</button>
        </div>`},buildSoundSettings(){const n=this.roomId,e=we.map(o=>this._soundOption("Bell",o.value,o.label,"previewSound","selectBell")).join(""),t=xe.map(o=>this._soundOption("Completion",o.value,o.label,"previewSound","selectCompletion")).join(""),i=ke.map(o=>this._soundOption("Ambient",o.value,o.label,"previewAmbient","selectAmbient")).join("");return`
        <div class="sound-settings" id="${n}SoundSettings">

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">5-Minute Bell</span>
                    <div class="toggle-switch" id="${n}Toggle5min" role="switch" aria-checked="false" tabindex="0"
                         data-action="toggle5minBell"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${n}5minOptions" style="display:none;">${e}</div>
            </div>

            <div class="sound-section">
                <div class="sound-section-title">Completion Sound</div>
                ${t}
            </div>

            <div class="sound-section">
                <div class="sound-toggle">
                    <span class="sound-toggle-label">Ambient Sound</span>
                    <div class="toggle-switch" id="${n}ToggleAmbient" role="switch" aria-checked="false" tabindex="0"
                         data-action="toggleAmbientSound"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
                        <div class="toggle-slider"></div>
                    </div>
                </div>
                <div id="${n}AmbientOptions" style="display:none;">${i}</div>
            </div>

        </div>`},buildSoundButton(){return`
        <button type="button" class="ps-leave"
                data-action="toggleSoundSettings"
                aria-label="Sound settings" aria-expanded="false"
                style="background:var(--surface);color:var(--text);padding:10px 16px;white-space:nowrap;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg> Sound
        </button>`}},Ee=Object.freeze(Object.defineProperty({__proto__:null,SoundSettingsMixin:Y},Symbol.toStringTag,{value:"Module"})),K=180,ie=+(2*Math.PI*K).toFixed(2),Ce=60,Ie=7200,oe={idle:"Begin",running:"Pause",paused:"Continue",done:"Complete"},Q={initTimerState(n=1200){this.state.timerRunning=!1,this.state.timeLeft=n,this.state.initialTime=n,this._timerInterval=null,this._timerHiddenAt=null,this._timerVisibilityHandler=null},toggleTimer(){this.state.timerRunning?this.pauseTimer():this.startTimer()},startTimer(){this.state.timerRunning||(this.state.timerRunning=!0,this._timerTickStart=Date.now(),this._setTimerBtn("running"),this._setTimerGlow("running"),this._timerInterval=setInterval(()=>{this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&this.play5MinBell?.(),this.state.timeLeft<=0&&this.completeTimer()},1e3),this._attachVisibilityHandler(),window.Core.showToast("Timer started"))},pauseTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this._setTimerBtn("paused"),this._setTimerGlow("paused")},completeTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this.state.timeLeft=0,this._setTimerBtn("done"),this._updateTimer(),this._setTimerGlow("idle"),this.playCompletionSound?.(),window.Core.showToast("Session complete!"),this.onTimerComplete?.()},resetTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1,this.state.timeLeft=this.state.initialTime,this._setTimerBtn("idle"),this._updateTimer(),this._setTimerGlow("idle")},adjustTime(n){this.state.timerRunning||(this.state.timeLeft=Math.min(Ie,Math.max(Ce,this.state.timeLeft+n*60)),this.state.initialTime=this.state.timeLeft,this._updateTimer())},cleanupTimer(){this._clearInterval(),this._detachVisibilityHandler(),this.state.timerRunning=!1},_attachVisibilityHandler(){this._timerVisibilityHandler||(this._timerVisibilityHandler=()=>{if(document.hidden)this._timerHiddenAt=Date.now(),this._clearInterval();else{if(this._timerHiddenAt!==null){const n=Math.round((Date.now()-this._timerHiddenAt)/1e3);if(this._timerHiddenAt=null,this.state.timeLeft=Math.max(0,this.state.timeLeft-n),this._updateTimer(),this.state.timeLeft<=0){this.completeTimer();return}}this.state.timerRunning&&!this._timerInterval&&(this._timerInterval=setInterval(()=>{this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&this.play5MinBell?.(),this.state.timeLeft<=0&&this.completeTimer()},1e3))}},document.addEventListener("visibilitychange",this._timerVisibilityHandler))},_detachVisibilityHandler(){this._timerVisibilityHandler&&(document.removeEventListener("visibilitychange",this._timerVisibilityHandler),this._timerVisibilityHandler=null),this._timerHiddenAt=null},_clearInterval(){this._timerInterval&&(clearInterval(this._timerInterval),this._timerInterval=null)},_setTimerBtn(n){const e=document.getElementById(`${this.roomId}TimerBtn`);e&&(e.textContent=oe[n])},_updateTimer(){const n=document.getElementById(`${this.roomId}TimerDisplay`);n&&(n.textContent=this.formatTime(this.state.timeLeft));const e=document.getElementById(`${this.roomId}TimerRing`);if(e){const t=this.state.timeLeft/this.state.initialTime;e.style.strokeDashoffset=ie*(1-t)}},updateTimerDisplay(){this._updateTimer()},updateTimerRing(){this._updateTimer()},buildTimerContainer({subtitle:n="in practice",gradientId:e=`timerGrad_${this.roomId}`,color1:t="#a78bfa",color2:i="#c084fc",glowColor:o="rgba(167,139,250,0.35)",subtitleHtml:a=null}={}){this._glowColor=o;const s=ie,r=163,l=+(2*Math.PI*r).toFixed(2),c=+(l*35/360).toFixed(2),d=+(l*120/360).toFixed(2),u=+(l-c).toFixed(2),m=+(l-d).toFixed(2),p=a??`<div style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${n}</div>`;return`
        <style>
            /* Outer ring glow pulse while running */
            @keyframes timerGlow_${this.roomId} {
                0%,100% { filter: drop-shadow(0 0 6px ${o}) drop-shadow(0 0 18px ${o}) drop-shadow(0 0 35px ${o}); }
                50%      { filter: drop-shadow(0 0 12px ${o}) drop-shadow(0 0 35px ${o}) drop-shadow(0 0 70px ${o}); }
            }
            #${this.roomId}OuterSvg {
                filter: none;
                transition: filter 1.5s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}OuterSvg {
                animation: timerGlow_${this.roomId} 3s ease-in-out infinite;
                transition: none;
            }

            /* Comet head races clockwise: dashoffset 0 → -C in 1s */
            @keyframes cometHead_${this.roomId} {
                from { stroke-dashoffset: 0; }
                to   { stroke-dashoffset: -${l}; }
            }
            /* Trail follows, slightly delayed */
            @keyframes cometTrail_${this.roomId} {
                from { stroke-dashoffset: ${c}; }
                to   { stroke-dashoffset: ${c-l}; }
            }

            #${this.roomId}CometHead {
                stroke-dasharray:  ${c} ${u};
                stroke-dashoffset: 0;
                animation: cometHead_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}CometTrail {
                stroke-dasharray:  ${d} ${m};
                stroke-dashoffset: ${c};
                animation: cometTrail_${this.roomId} 1s linear infinite;
                animation-play-state: paused;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometHead,
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometTrail {
                animation-play-state: running;
            }
            /* Comet: hidden until timer starts, freezes on pause, hides on reset */
            #${this.roomId}CometSvg {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            #${this.roomId}TimerRingWrap.running #${this.roomId}CometSvg {
                opacity: 1;
            }
            #${this.roomId}TimerRingWrap.paused #${this.roomId}CometSvg {
                opacity: 1; /* visible but animation is paused = frozen */
            }
            #${this.roomId}TimerDisplay {
                font-variant-numeric: tabular-nums;
            }
            @media (prefers-reduced-motion: reduce) {
                #${this.roomId}CometHead,
                #${this.roomId}CometTrail {
                    animation: none !important;
                }
                #${this.roomId}OuterSvg {
                    animation: none !important;
                }
            }
        </style>

        <div id="${this.roomId}TimerRingWrap"
             aria-hidden="true"
             style="position:relative;width:min(380px,82vw);height:min(380px,82vw);margin-bottom:36px;">

            <!-- Outer progress ring (clockwise countdown) -->
            <svg id="${this.roomId}OuterSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:2;">
                <defs>
                    <linearGradient id="${e}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stop-color="${t}"/>
                        <stop offset="100%" stop-color="${i}"/>
                    </linearGradient>
                </defs>
                <!-- Track -->
                <circle cx="200" cy="200" r="${K}"
                        fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="14"/>
                <!-- Progress -->
                <circle cx="200" cy="200" r="${K}"
                        fill="none" stroke="url(#${e})"
                        stroke-width="14" stroke-linecap="round"
                        stroke-dasharray="${s}" stroke-dashoffset="0"
                        id="${this.roomId}TimerRing"/>
            </svg>

            <!-- Inner dark track (always visible) -->
            <svg width="100%" height="100%" viewBox="0 0 400 400"
                 style="position:absolute;top:0;left:0;z-index:3;">
                <circle cx="200" cy="200" r="${r}"
                        fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="6"/>
            </svg>

            <!-- Inner comet ring (hidden until Start) -->
            <svg id="${this.roomId}CometSvg"
                 width="100%" height="100%" viewBox="0 0 400 400"
                 style="transform:rotate(-90deg);position:absolute;top:0;left:0;z-index:4;">
                <!-- Fading trail (neon blue, low opacity) -->
                <circle cx="200" cy="200" r="${r}"
                        fill="none" stroke="#00cfff"
                        stroke-width="5" stroke-linecap="round"
                        opacity="0.25"
                        id="${this.roomId}CometTrail"/>
                <!-- Comet head (bright neon blue, glowing) -->
                <circle cx="200" cy="200" r="${r}"
                        fill="none"
                        stroke="#00eeff"
                        stroke-width="6" stroke-linecap="round"
                        style="filter:drop-shadow(0 0 4px #00eeff) drop-shadow(0 0 10px #00cfff);"
                        id="${this.roomId}CometHead"/>
            </svg>

            <!-- Text content -->
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:5;width:65%;">
                <div id="${this.roomId}TimerDisplay"
                     role="timer" aria-live="off" aria-label="Timer"
                     style="font-size:clamp(2.8rem,12vw,5rem);font-weight:200;letter-spacing:0.04em;line-height:1;margin-bottom:10px;">
                    ${this.formatTime(this.state.timeLeft)}
                </div>
                ${p}
            </div>
        </div>`},buildTimerControls(){return`
        <div class="timer-controls" role="group" aria-label="Timer controls">
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="-5" aria-label="Subtract 5 minutes">−5m</button>
            <button type="button" class="t-btn primary" data-action="toggleTimer" id="${this.roomId}TimerBtn" aria-live="polite">${oe.idle}</button>
            <button type="button" class="t-btn" data-action="adjustTime" data-minutes="5" aria-label="Add 5 minutes">+5m</button>
        </div>`},_setTimerGlow(n){const e=document.getElementById(`${this.roomId}TimerRingWrap`),t=document.getElementById(`${this.roomId}OuterSvg`);!e||!t||(clearTimeout(this._glowTransitionTimer),e.classList.remove("running","paused"),n==="running"&&e.classList.add("running"),n==="paused"&&e.classList.add("paused"),n==="running"?(t.style.animation="",t.style.transition="filter 1.2s ease",t.style.filter=`drop-shadow(0 0 12px ${this._glowColor}) drop-shadow(0 0 35px ${this._glowColor}) drop-shadow(0 0 70px ${this._glowColor})`,this._glowTransitionTimer=setTimeout(()=>{e.classList.add("running"),requestAnimationFrame(()=>{t.style.transition="",t.style.filter=""})},1200)):(t.style.animation="none",t.style.transition="filter 1.2s ease",t.style.filter="none"))}},Ae=Object.freeze(Object.defineProperty({__proto__:null,TimerMixin:Q},Symbol.toStringTag,{value:"Module"})),N='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',ne='<span style="background:rgba(239,68,68,0.85);color:white;font-size:11px;font-weight:700;letter-spacing:0.08em;padding:4px 10px;border-radius:4px;text-transform:uppercase;">In Session</span>',F={MAX:5,fallbackGradient:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};function x(n){return n?String(n).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"):""}const I={bless:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.8;"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg>',leave:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4l-6 2v14l6 2"/></svg>',shield:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',book:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',alert:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',block:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',mute:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>',help:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>'},J={data:null,fetchedAt:0,TTL_MS:12e4,async get(){const n=Date.now();if(this.data&&n-this.fetchedAt<this.TTL_MS)return this.data;try{this.data=await h.getBlockedUsers(),this.fetchedAt=n}catch{this.data=this.data??new Set}return this.data},invalidate(){this.data=null,this.fetchedAt=0}};class y{constructor(e){this.roomId=e.roomId,this.roomType=e.roomType,this.config={name:"Practice Room",icon:"🧘",description:"A space for practice",energy:"Peaceful",statusRingColor:"var(--neuro-accent)",imageUrl:"",...e},this.state={participants:e.participants||0,isActive:!0,...e.state},this.eventListeners=[],this._actionsCache=null}_dbReady(){return!!h?.ready}init(){this.updateRoomCard(),window[`${this.roomId}_blessRoom`]=()=>this._blessRoom(),window[`${this.roomId}_showScheduleModal`]=()=>this.showScheduleModal?.(),window[`${this.roomId}_closeScheduleModal`]=()=>this.closeScheduleModal?.(),this.mountHubModals(),this._loadBlessingCount(),this.onInit?.()}mountHubModals(){const e=this.buildHubModals?.()||"";if(!e)return;let t=document.getElementById("roomHubModals");t||(t=Object.assign(document.createElement("div"),{id:"roomHubModals"}),t.style.cssText="position:relative;z-index:200000;",document.body.appendChild(t)),document.getElementById(`${this.roomId}HubModalsSlot`)?.remove();const i=Object.assign(document.createElement("div"),{id:`${this.roomId}HubModalsSlot`,innerHTML:e});t.appendChild(i)}buildHubModals(){return""}enterRoom(){if(!this.canEnterRoom()){window.Core.showToast("Session in progress. Please wait for the next opening.");return}y.stopHubPresence(),this._createPracticeViewDeferred(),window.Core.navigateTo("practiceRoomView"),window.Core.showToast(`${this.config.icon} Entered ${this.config.name}`),this._actionsCache=null,this.setupEventListeners(),this.onEnter?.(),this._setRoomPresence(this.roomId),j&&!j.state.isContributing&&j._startWave(),requestAnimationFrame(()=>{this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`),requestAnimationFrame(()=>{this._refreshBlessingCounter(),this._subscribeToBlessings()})}),h.logRoomEntry(this.roomId).then(e=>{this._roomEntryId=e}).catch(()=>{})}_createPracticeViewDeferred(){ve.injectModals();const e=document.getElementById("dynamicRoomContent"),t=this.buildHeader(),i=[this.buildInstructionsModal(),this.buildAdditionalModals?.()??""].join(""),o=`<div class="ps-body" id="${this.roomId}BodyPlaceholder" style="flex:1;display:flex;align-items:center;justify-content:center;min-height:200px;"><div style="opacity:0.4;font-size:14px;">Loading…</div></div>`;if(e)e.innerHTML=t+o+i;else{if(document.getElementById(`${this.roomId}View`))return;const a=document.createElement("div");a.className="view practice-space",a.id=`${this.roomId}View`,a.innerHTML=t+o+i,document.body.appendChild(a)}requestAnimationFrame(()=>{const a=document.getElementById(`${this.roomId}BodyPlaceholder`),s=this.buildBody();if(a){const r=document.createElement("div");r.innerHTML=s,a.replaceWith(...Array.from(r.childNodes))}else e&&(e.innerHTML=t+s+i);this._onEnterDeferred()})}_onEnterDeferred(){this.onEnter?.(),requestAnimationFrame(()=>{this._refreshParticipantSidebar(`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`),requestAnimationFrame(()=>{this._refreshBlessingCounter(),this._subscribeToBlessings()})})}createPracticeView(){this._createPracticeViewDeferred()}leaveRoom(){this._exitCleanup(),window.Core.navigateTo("hubView"),window.Core.showToast(`Left ${this.config.name}`),this.onLeave?.(),y.startHubPresence()}gentlyLeave(){this._exitCleanup(),this.onLeave?.(),y.startHubPresence(),window.Rituals?Rituals.showClosing():window.Core.navigateTo("hubView")}_exitCleanup(){this._teardownDelegatedListeners(),j?.state.isContributing&&j._endWave(),this._clearRoomPresence(),J.invalidate(),this._lastParticipantKey=null,this._participantFetchInFlight=!1,this._blessingRows=null,this._actionsCache=null,clearTimeout(this._blessingRefreshTimer),this._roomEntryId&&(h.logRoomExit(this._roomEntryId).catch(()=>{}),this._roomEntryId=null);for(const e of["_presenceSub","_sidebarPresenceSub"])if(this[e]){try{this[e].unsubscribe()}catch{}this[e]=null}h&&h.unsubscribeFromBlessings(this.roomId),this.cleanup()}canEnterRoom(){return!0}_isWithinOpenWindow(){return this.roomType!=="timed"?!0:typeof this._checkCycleWindow=="function"?this._checkCycleWindow():!0}cleanup(){this.eventListeners.forEach(({element:e,event:t,handler:i})=>e.removeEventListener(t,i)),this.eventListeners=[],this.onCleanup?.()}_setRoomPresence(e){if(this._dbReady())try{const t=y.ROOM_ACTIVITIES[e]??`${this.config.icon} ${this.config.name}`;h.setPresence("online",t,e),window.Core?.state&&(window.Core.state.currentRoom=e,window.Core.state.currentUser&&(window.Core.state.currentUser.activity=t))}catch(t){console.error("[PracticeRoom] _setRoomPresence error:",t)}}_clearRoomPresence(){if(this._dbReady())try{h.setPresence("online","✨ Available",null),window.Core?.state&&(window.Core.state.currentRoom=null,window.Core.state.currentUser&&(window.Core.state.currentUser.activity="✨ Available"))}catch(e){console.error("[PracticeRoom] _clearRoomPresence error:",e)}}async fetchRoomParticipants(){if(this._dbReady())try{const[e,t]=await Promise.all([h.getRoomParticipants(this.roomId),J.get()]),i=e.filter(o=>!t.has(o.user_id));this.state.participants=i.length,this._updateParticipantUI(i),this._updateRoomCardCount(i.length)}catch(e){console.error(`[${this.roomId}] fetchRoomParticipants error:`,e)}}_updateParticipantUI(e){const t=document.getElementById(`${this.roomId}ParticipantCount`);t&&(t.textContent=this.getParticipantText());const i=document.getElementById(`${this.roomId}ParticipantStack`);i&&(i.innerHTML=this._buildAvatarStack(e))}async _refreshParticipantSidebar(e,t=null){if(!this._dbReady())return;const i=async()=>{if(this._participantFetchInFlight)return;this._participantFetchInFlight=!0;const[o,a]=await Promise.all([h.getRoomParticipants(this.roomId),J.get()]),s=o.filter(c=>!a.has(c.user_id));this._participantFetchInFlight=!1;const r=s.map(c=>c.user_id).sort().join(",");if(r===this._lastParticipantKey)return;this._lastParticipantKey=r,this.state.participants=s.length,this._updateParticipantUI(s);const l=document.getElementById(e);if(l&&this._renderParticipantList(l,s),t){const c=document.getElementById(t);c&&(c.textContent=`${s.length} present`)}this._updateRoomCardCount(s.length)};try{await i()}catch(o){this._participantFetchInFlight=!1,console.error(`[${this.roomId}] _refreshParticipantSidebar error:`,o);return}this._sidebarPresenceSub?.unsubscribe(),this._sidebarPresenceSub=h.subscribeToPresence(async()=>{document.getElementById(e)?await i():(this._sidebarPresenceSub?.unsubscribe(),this._sidebarPresenceSub=null)})}_updateRoomCardCount(e){this.state.participants=e;const t=document.querySelector(`[data-room-id="${this.roomId}"] .room-participants`);t&&(t.textContent=this.getParticipantText())}_buildAvatarStack(e,t=22,i=9){const{MAX:o,fallbackGradient:a}=F,s=e.slice(0,o),r=e.length-o,l=s.map(d=>{const u=d.profiles||{},m=x(u.name||"Member"),p=x(u.avatar_url||""),C=x(u.emoji||"")||m.charAt(0).toUpperCase(),$=window.Core?.getAvatarGradient?.(d.user_id||m)??a,M=p?`<img src="${p}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${m}" loading="lazy" decoding="async">`:`<span style="color:white;font-size:${i}px;font-weight:700;">${C}</span>`;return`<div title="${m}" style="width:${t}px;height:${t}px;border-radius:50%;background:${p?"transparent":$};border:2px solid var(--surface);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-left:-6px;flex-shrink:0;">${M}</div>`}).join(""),c=r>0?`<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${r}</span>`:"";return l+c}_buildRealAvatars(e){const{MAX:t,fallbackGradient:i}=F,o=e.slice(0,t),a=e.length-t;return o.map(r=>{const l=r.profiles||{},c=r.user_id||l.id||"",d=x(l.name||"Member"),u=x(l.avatar_url||""),m=x(l.emoji||""),p=window.Core?.getAvatarGradient?.(c||d)??i,g=u?`<img src="${u}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${d}" loading="lazy" decoding="async">`:`<span aria-hidden="true">${m||d.charAt(0).toUpperCase()}</span>`,C=u?"background:transparent;":`background:${p};`,$=c?`onclick="openMemberProfileAboveRoom('${c}')"`:"",M=c?"button":"img",T=c?'tabindex="0"':"",v=c?`onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${c}');}"`:"",b=`aria-label="${d}"`;return`<div class="p-avatar" style="${C}" title="${d}" role="${M}" ${T} ${b} ${$} ${v}>${g}</div>`}).join("")+(a>0?`<div class="p-avatar" style="background:var(--surface);color:var(--text-muted);font-size:11px;">+${a}</div>`:"")}_renderParticipantList(e,t){if(!t.length){e.innerHTML='<div style="color:var(--text-muted);font-size:13px;padding:8px;">Just you here 🕯️</div>';return}const{fallbackGradient:i}=F;e.innerHTML=t.map(o=>{const a=o.profiles||{},s=o.user_id||a.id||"",r=x(a.name||"Member"),l=x(a.avatar_url||""),c=x(a.emoji||""),d=window.Core?.getAvatarGradient?.(s||r)??i,u=l?`<img src="${l}" referrerpolicy="no-referrer" width="40" height="40" style="width:40px;height:40px;min-width:40px;min-height:40px;object-fit:cover;border-radius:50%;display:block;" alt="${r}" loading="lazy" decoding="async">`:`<span style="color:white;font-weight:600;font-size:13px;">${c||r.charAt(0).toUpperCase()}</span>`,m=l?"background:transparent;":`background:${d};`,p=s?`onclick="openMemberProfileAboveRoom('${s}')"`:"",g=s?`onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openMemberProfileAboveRoom('${s}');}"`:"";return`
            <div class="campfire-participant" ${p} ${g} ${s?'role="button" tabindex="0"':""} style="${s?"cursor:pointer;":""}">
                <div class="campfire-participant-avatar" style="${m}width:40px;height:40px;min-width:40px;min-height:40px;display:flex;align-items:center;justify-content:center;overflow:hidden;">${u}</div>
                <div class="campfire-participant-info">
                    <div class="campfire-participant-name">${r}</div>
                    <div class="campfire-participant-country">${x(o.activity||"✨ Available")}</div>
                </div>
            </div>`}).join("")}async _blessRoom(){const e=document.getElementById(`${this.roomId}BlessBtn`);if(!this._dbReady()){window.Core.showToast("Blessing sent ✨"),this._showBlessingAnimation(null);return}const t=Date.now(),i=this._lastBlessedAt??0,o=6e4;if(t-i<o){const r=Math.ceil((o-(t-i))/1e3);window.Core.showToast(`✦ Room is holding your blessing — try again in ${r}s`);return}if(e){if(e.dataset.blessed)return;e.dataset.blessed="1",e.style.opacity="0.7",e.innerHTML=`${N} Blessed ✦`,setTimeout(()=>{delete e.dataset.blessed,e.style.opacity="1";const r='<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>';e.innerHTML=`${r} ${N} Bless this room ${r}`},3e3)}this._lastBlessedAt=t,this._showBlessingAnimation(null),window.Core.showToast("Blessing sent ✨");const a=await h.blessRoom(this.roomId);if(a.status==="cooldown"){window.Core.showToast("✦ This room is still holding your last blessing"),this._lastBlessedAt=t;return}if(a.status==="error")return;this._blessingRows=this._blessingRows??[];const s=h.userId;if(s&&!this._blessingRows.some(r=>(r.user_id||r.userId)===s)){const r=a.data?.profiles??null;this._blessingRows=[...this._blessingRows,{user_id:s,profiles:r}]}this._updateCardBlessingBadge(this._blessingRows.length),this._refreshBlessingCounter()}async _loadBlessingCount(){if(this._dbReady())try{const e=await h.getRoomBlessings(this.roomId);this._blessingRows=e,this._updateCardBlessingBadge(e.length)}catch{}}_updateCardBlessingBadge(e){const t=document.getElementById(`${this.roomId}BlessBtn`);if(!t)return;const i='<div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>';t.style.color="#fff",t.innerHTML=`${i} ${N} Bless this room ${i}`}_subscribeToBlessings(){this._dbReady()&&h.subscribeToBlessings(this.roomId,e=>{this._showBlessingAnimation(e),this._optimisticBlessingBump(e),this._debouncedRefreshBlessingCounter()})}_optimisticBlessingBump(e){this._blessingRows=this._blessingRows??[];const t=e?.userId||e?.user_id;t&&!this._blessingRows.some(i=>(i.user_id||i.userId)===t)&&(this._blessingRows=[...this._blessingRows,e]),this._renderBlessingCounter(this._blessingRows),this._updateCardBlessingBadge(this._blessingRows.length)}_debouncedRefreshBlessingCounter(){clearTimeout(this._blessingRefreshTimer),this._blessingRefreshTimer=setTimeout(()=>this._refreshBlessingCounter(),3e3)}async _refreshBlessingCounter(){if(this._dbReady())try{const e=await h.getRoomBlessings(this.roomId);this._blessingRows=e,this._renderBlessingCounter(e),this._updateCardBlessingBadge(e.length)}catch{}}_normaliseBlessingRow(e){return e.profiles?e:{user_id:e.userId||e.user_id,profiles:{name:e.name||"A member",avatar_url:e.avatarUrl||"",emoji:e.emoji||""}}}_renderBlessingCounter(e){const t=document.getElementById(`${this.roomId}BlessedCounter`);if(!t)return;if(!e.length){t.innerHTML='<span style="font-size:12px;color:var(--text-muted);opacity:0.6;">No blessings yet</span>';return}const i=e.map(r=>this._normaliseBlessingRow(r)),o=this._buildAvatarStack(i),a=Math.max(0,e.length-F.MAX),s=a>0?`<span style="font-size:10px;color:var(--text-muted);margin-left:4px;">+${a}</span>`:"";t.innerHTML=`
            <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;margin-right:4px;display:inline-flex;align-items:center;gap:0.25rem;">${I.bless} Blessed by</span>
            <div style="display:flex;align-items:center;margin-left:6px;">${o}</div>
            ${s}`}_showBlessingAnimation(e){if(document.getElementById("blessingAnimationOverlay"))return;const t=3e3,i=window.innerWidth<768,o=window.innerWidth,a=window.innerHeight,s=o/2,r=a/2,l=document.createElement("div");l.id="blessingAnimationOverlay",l.style.cssText=["position:fixed;inset:0;pointer-events:none;z-index:999999;","backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);","background:rgba(0,0,0,0);","transition:background 0.2s ease;"].join(""),document.body.appendChild(l),requestAnimationFrame(()=>{l.style.background="rgba(0,0,0,0.25)"});const c=document.createElement("canvas");c.width=o,c.height=a,c.style.cssText="position:absolute;inset:0;width:100%;height:100%;background:transparent;",l.appendChild(c);const d=c.getContext("2d"),u=document.createElement("div");u.style.cssText=["position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.6);","color:rgba(255,230,120,0.95);font-size:clamp(36px,8vw,72px);font-weight:300;","letter-spacing:0.25em;text-transform:uppercase;white-space:nowrap;","font-family:var(--serif,Georgia,serif);","text-shadow:0 0 40px rgba(255,200,60,0.8),0 0 80px rgba(255,180,40,0.4);","opacity:0;transition:opacity 0.35s ease,transform 0.5s cubic-bezier(0.34,1.56,0.64,1);","pointer-events:none;"].join(""),u.textContent="✦  Blessed  ✦",l.appendChild(u),setTimeout(()=>{u.style.opacity="1",u.style.transform="translate(-50%,-50%) scale(1)"},t*.42),setTimeout(()=>{u.style.opacity="0",u.style.transform="translate(-50%,-50%) scale(1.15)",u.style.transition="opacity 0.4s ease,transform 0.4s ease"},t-600);const m=e?.name??null;if(m){const p=document.createElement("div");p.style.cssText=["position:absolute;bottom:18%;left:50%;transform:translateX(-50%);","color:rgba(255,230,160,0.9);font-size:15px;font-weight:400;","letter-spacing:0.18em;text-transform:uppercase;white-space:nowrap;","font-family:var(--serif,Georgia,serif);","opacity:0;transition:opacity 0.6s ease 0.6s;"].join(""),p.textContent=`✦  ${m} blesses this room  ✦`,l.appendChild(p),requestAnimationFrame(()=>{p.style.opacity="1"}),setTimeout(()=>{p.style.opacity="0",p.style.transition="opacity 0.4s ease"},t-500)}requestAnimationFrame(()=>{const p=i?120:260,g=[];for(let T=0;T<p;T++){const v=Math.random()*Math.PI*2,b=20+Math.random()*Math.max(o,a)*.55,w=Math.random()<.75,B=w?38+Math.random()*18:265+Math.random()*25,f=w?85+Math.random()*15:70+Math.random()*20,k=60+Math.random()*25;g.push({angle:v,radius:b,x:s+Math.cos(v)*b,y:r+Math.sin(v)*b,size:1+Math.random()*(i?2:3),hue:B,sat:f,lit:k,delay:Math.random()*.3,speed:.8+Math.random()})}const C=performance.now();let $;const M=T=>{const v=(T-C)/t,b=.42,w=.48,B=1;if(d.globalCompositeOperation="destination-out",d.globalAlpha=.18,d.fillStyle="rgba(0,0,0,1)",d.fillRect(0,0,o,a),d.globalCompositeOperation="source-over",d.globalAlpha=1,v>b*.6&&v<B*.85){const f=v<w?(v-b*.6)/(w-b*.6):1-(v-w)/(B-w),k=Math.max(0,Math.min(1,f)),S=80+f*120,_=d.createRadialGradient(s,r,0,s,r,S);_.addColorStop(0,`rgba(255,220,100,${.55*k})`),_.addColorStop(.5,`rgba(200,150, 60,${.25*k})`),_.addColorStop(1,"rgba(200,150, 60,0)"),d.globalAlpha=1,d.fillStyle=_,d.beginPath(),d.arc(s,r,S,0,Math.PI*2),d.fill()}g.forEach(f=>{const k=Math.max(0,v-f.delay*.3);let S,_,R;if(k<b){const E=k/b,P=1-(1-E)*(1-E),L=f.radius*(1-P*.97),D=P*Math.PI*2.5*(f.radius>0?1:-1);S=s+Math.cos(f.angle+D)*L,_=r+Math.sin(f.angle+D)*L,R=Math.min(1,P*2.5)}else if(k<w)S=s+(Math.random()-.5)*8,_=r+(Math.random()-.5)*8,R=1;else{const E=(k-w)/(B-w),P=E*E,L=f.angle+Math.PI*(.7+Math.random()*.6),D=P*Math.max(o,a)*.7*f.speed;S=s+Math.cos(L)*D,_=r+Math.sin(L)*D,R=Math.max(0,1-E*1.15)}R<=0||(d.globalAlpha=R,d.fillStyle=`hsl(${f.hue},${f.sat}%,${f.lit}%)`,d.shadowBlur=i?4:8,d.shadowColor=`hsl(${f.hue},100%,70%)`,d.beginPath(),d.arc(S,_,f.size,0,Math.PI*2),d.fill())}),d.globalAlpha=1,d.shadowBlur=0,v<1?$=requestAnimationFrame(M):(l.style.transition="opacity 0.3s ease",l.style.opacity="0",setTimeout(()=>l.remove(),350),cancelAnimationFrame($))};$=requestAnimationFrame(M)})}buildHeader(){return`
        <header class="ps-header" style="padding:12px 16px;display:flex;flex-direction:column;gap:12px;${this.getHeaderGradient()}">
            <div class="ps-info" style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">
                <div style="width:100%;display:flex;justify-content:flex-start;">
                    <img src="${this.config.imageUrl}" alt="${this.config.name}" width="600" height="400" loading="lazy" decoding="async" style="max-width:600px;width:100%;height:auto;display:block;">
                </div>
                <div style="display:flex;align-items:center;gap:20px;margin-top:16px;flex-wrap:wrap;">
                    <div class="ps-participants" style="display:flex;align-items:center;gap:8px;">
                        ${this.buildParticipantAvatars()}
                        <span id="${this.roomId}ParticipantCount" style="font-size:14px;font-weight:500;letter-spacing:0.05em;">${this.getParticipantText()}</span>
                    </div>
                    <div id="${this.roomId}BlessedCounter" style="display:flex;align-items:center;gap:4px;opacity:0.85;">
                        <span style="font-size:12px;color:var(--text-muted);">Loading blessings…</span>
                    </div>
                </div>
            </div>
            <div class="ps-header-btn-grid">
                ${this.buildAdditionalHeaderButtons?.()??""}
                ${this.buildSafetyDropdown()}
                <button type="button" class="ps-leave ps-header-btn" data-action="gentlyLeave">
                    ${I.leave} Gently Leave
                </button>
            </div>
        </header>`}buildSafetyDropdown(){const e=[["CommunityModule.showReportModal()",I.alert,"Report Issue"],["CommunityModule.showBlockModal()",I.block,"Block User"],["CommunityModule.muteChat()",I.mute,"Mute Chat"],["CommunityModule.showHelpModal()",I.help,"Get Help"]];return`
        <div style="position:relative;" id="${this.roomId}SafetyDropdownContainer">
            <button type="button" class="ps-leave" data-action="toggleSafety"
                    aria-haspopup="true" aria-expanded="false"
                    style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2);white-space:nowrap;padding:10px 16px;">
                ${I.shield} Safety <span style="font-size:12px;">▼</span>
            </button>
            <div id="${this.roomId}SafetyDropdown"
                 style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);min-width:200px;box-shadow:0 8px 24px rgba(0,0,0,0.3);z-index:100001;">
                <button type="button" data-action="showInstructions"
                        style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text);">
                    <span aria-hidden="true">${I.book}</span> Instructions
                </button>
                ${e.map(([t,i,o],a,s)=>{const r=a<s.length-1?"border-bottom:1px solid var(--border);":"";return`<button type="button" onclick="${t}" style="width:100%;padding:12px 16px;text-align:left;background:none;border:none;${r}cursor:pointer;display:flex;align-items:center;gap:12px;color:var(--text);"><span aria-hidden="true">${i}</span> ${o}</button>`}).join("")}
            </div>
        </div>`}buildParticipantAvatars(){const[e,t]=this.config.name.split(" ").map(i=>i[0]);return`
        <div class="participant-stack" id="${this.roomId}ParticipantStack">
            <div class="p-avatar" style="background:linear-gradient(135deg,#f093fb,#f5576c);" aria-hidden="true">${e||"P"}</div>
            <div class="p-avatar" style="background:linear-gradient(135deg,#4facfe,#00f2fe);" aria-hidden="true">${t||"R"}</div>
        </div>`}buildBody(){return'<div class="ps-body"><main class="ps-main"><p>Override buildBody() in your room class.</p></main></div>'}buildInstructionsModal(){return`
        <div class="modal-overlay" id="${this.roomId}InstructionsModal">
            <div class="modal-card">
                <button type="button" class="modal-close" aria-label="Close modal" data-action="closeInstructions">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;display:flex;align-items:center;gap:0.5rem;"><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> ${this.config.name}</h2>
                    ${this.getInstructions()}
                    <button type="button" data-action="closeInstructions" style="width:100%;padding:12px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;margin-top:16px;">Close</button>
                </div>
            </div>
        </div>`}getInstructions(){return`
            <p><strong>Welcome to ${this.config.name}.</strong></p>
            <h3>How to Practice:</h3>
            <ul>
                <li>Find a comfortable space</li>
                <li>Focus on your intention</li>
                <li>Practice with presence</li>
            </ul>`}buildParticipantSidebarHTML(e,t,i,o="400px"){return`
        <div style="border:1px solid var(--border);border-radius:var(--radius-md);padding:6px 8px;background:var(--background);">
            <div style="font-weight:600;font-size:13px;margin-bottom:2px;text-align:center;">${e}</div>
            <div id="${i}" style="font-size:11px;color:var(--text-muted);margin-bottom:4px;text-align:center;">${this.state.participants} present</div>
            <div id="${t}" class="campfire-participants" style="height:${o};overflow-y:auto;">
                <div style="color:var(--text-muted);font-size:13px;padding:8px;">Loading...</div>
            </div>
        </div>`}updateRoomCard(){const e=document.querySelector(`[data-room-id="${this.roomId}"]`);if(!e)return;const t=e.querySelector(".room-energy span");if(t&&(t.textContent=this.getParticipantText()),this.roomType==="timed"){const i=this.canEnterRoom(),o=this._isWithinOpenWindow();e.style.cursor=i?"pointer":"not-allowed",e.style.opacity=o?"1":"0.55",e.style.border=`3px solid ${o?"#22c55e":"#ef4444"}`,e.onclick=i?()=>this.enterRoom():null,e.classList.toggle("active",o),e.classList.toggle("in-session",!o);let a=e.querySelector(".in-session-label");!o&&!a?(a=document.createElement("div"),a.className="in-session-label",a.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;",a.innerHTML=ne,e.appendChild(a)):o&&a&&a.remove();const s=e.querySelector(".room-timer");s&&this.getTimerText&&(s.innerHTML=this.getTimerText())}else e.style.border="3px solid #22c55e",e.classList.add("active");this.onUpdateCard?.(e)}getRoomCardHTML(){const e=this.canEnterRoom(),t=this.roomType==="timed",i=!t||this._isWithinOpenWindow(),o=`${this.roomId}_enterRoom`;return window[o]=()=>this.enterRoom(),`
        <div class="practice-room ${i?"active":"in-session"}"
             data-room-type="${this.roomType}"
             data-room-id="${this.roomId}"
             ${e?`onclick="${o}()"`:""}
             style="cursor:${e?"pointer":"not-allowed"};border:3px solid ${i?"#22c55e":"#ef4444"};position:relative;opacity:${i?"1":"0.55"};display:flex;flex-direction:column;">

            ${this.getDevModeBadge()}

            ${!i&&t?`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2;pointer-events:none;">${ne}</div>`:""}

            <img src="${this.config.imageUrl}" alt="${this.config.name}" width="800" height="450" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;margin-bottom:12px;">

            <div class="room-desc" style="text-align:center;margin-bottom:16px;">${this.config.description}</div>

            <div style="flex:1;">${this.buildCardFooter()}</div>

            <div style="width:100%;padding:16px 24px 0 24px;box-sizing:border-box;">
                <div id="${this.roomId}BlessBtn"
                     role="button" tabindex="0"
                     onclick="event.stopPropagation();${this.roomId}_blessRoom()"
                     onkeydown="if(event.key==='Enter'||event.key===' '){event.stopPropagation();${this.roomId}_blessRoom();}"
                     title="Send a blessing to everyone inside"
                     class="bless-room-btn"
                     style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px 16px;font-size:11px;font-weight:600;letter-spacing:0.09em;text-transform:uppercase;color:#fff;background:linear-gradient(135deg,#c8a96e,#e8d5a0,#a8824a,#dfc87a);border-radius:20px;cursor:pointer;white-space:nowrap;transition:opacity 0.2s,transform 0.15s;user-select:none;box-shadow:2px 2px 6px rgba(120,80,20,0.25),-1px -1px 4px rgba(255,230,160,0.4);">
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                    ${N} Bless this room
                    <div class="bless-dots"><div class="bless-dot"></div><div class="bless-dot"></div><div class="bless-dot"></div></div>
                </div>
            </div>
        </div>`}buildCardFooter(){if(this.roomType==="timed"&&this.getTimerText){const e=this.showScheduleModal?`<button type="button" class="view-schedule" onclick="event.stopPropagation();window['${this.roomId}_showScheduleModal']()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> View Schedule</button>`:"";return`
            <div class="room-participants" style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">${this.state.participants} present</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                ${e}
                <div class="room-timer" style="font-size:11px;color:var(--text-muted);text-align:right;line-height:1.4;margin-left:auto;">${this.getTimerText()}</div>
            </div>`}return`
        <div style="text-align:left;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
        </div>`}setupEventListeners(){this._teardownDelegatedListeners(),this._actionsCache=this.getActions();const e=i=>{const o=i.target.closest("[data-action]");if(o){i.stopPropagation();const a=this._actionsCache[o.dataset.action];if(a){a(i);return}console.warn(`[${this.roomId}] Unknown data-action: "${o.dataset.action}"`);return}this._handleOutsideClick(i)},t=i=>{if(i.target.tagName!=="SELECT")return;const o=i.target.closest("[data-action]");if(!o)return;const a=this._actionsCache[o.dataset.action];a&&a(i)};document.addEventListener("click",e),document.addEventListener("change",t),this._delegatedClickHandler=e,this._delegatedChangeHandler=t,this.eventListeners.push({element:document,event:"click",handler:e},{element:document,event:"change",handler:t})}_teardownDelegatedListeners(){this._delegatedClickHandler&&(document.removeEventListener("click",this._delegatedClickHandler),document.removeEventListener("change",this._delegatedChangeHandler),this.eventListeners=this.eventListeners.filter(({handler:e})=>e!==this._delegatedClickHandler&&e!==this._delegatedChangeHandler),this._delegatedClickHandler=null,this._delegatedChangeHandler=null)}getActions(){return{gentlyLeave:()=>this.gentlyLeave(),toggleSafety:e=>this.toggleSafetyDropdown(e),showInstructions:()=>this.showInstructions(),closeInstructions:()=>this.closeInstructions(),showSchedule:()=>this.showScheduleModal?.(),closeScheduleModal:()=>this.closeScheduleModal?.(),toggleDimMode:()=>this.toggleDimMode?.(),toggleTimer:()=>this.toggleTimer?.(),adjustTime:e=>this.adjustTime?.(+this._actionEl(e).dataset.minutes),toggleSoundSettings:()=>this.toggleSoundSettings?.(),toggle5minBell:()=>this.toggle5minBell?.(),toggleAmbientSound:()=>this.toggleAmbientSound?.(),selectBell:e=>this.selectBell?.(this._actionEl(e).dataset.value),selectCompletion:e=>this.selectCompletion?.(this._actionEl(e).dataset.value),selectAmbient:e=>this.selectAmbient?.(this._actionEl(e).dataset.value),previewSound:e=>this.previewSound?.(this._actionEl(e).dataset.value,e),previewAmbient:e=>this.previewAmbient?.(this._actionEl(e).dataset.value,e),sendMessage:e=>this.sendMessage?.(this._actionEl(e).dataset.channel),switchTab:e=>this.switchTab?.(this._actionEl(e).dataset.tab),skipBackward:()=>this.skipBackward?.(),togglePlayPause:()=>this.togglePlayPause?.(),skipForward:()=>this.skipForward?.()}}_actionEl(e){return e.target.closest("[data-action]")}_handleOutsideClick(e){const t=document.getElementById(`${this.roomId}SafetyDropdownContainer`);if(t&&!t.contains(e.target)){const i=document.getElementById(`${this.roomId}SafetyDropdown`);i&&(i.style.display="none")}this.onOutsideClick?.(e)}toggleSafetyDropdown(e){e?.stopPropagation();const t=document.getElementById(`${this.roomId}SafetyDropdown`),i=document.getElementById(`${this.roomId}SafetyDropdownContainer`);if(t){if(t.style.display==="block"){t.style.display="none";return}if(i){const{bottom:o,right:a}=i.getBoundingClientRect();Object.assign(t.style,{position:"fixed",top:`${o+6}px`,right:`${window.innerWidth-a}px`,left:"auto",zIndex:"2147483640",marginTop:"0"})}t.style.display="block"}}showInstructions(){document.getElementById(`${this.roomId}SafetyDropdown`)?.style.setProperty("display","none"),document.getElementById(`${this.roomId}InstructionsModal`)?.classList.add("active")}closeInstructions(){document.getElementById(`${this.roomId}InstructionsModal`)?.classList.remove("active")}getParticipantText(){return`${this.state.participants} present`}getHeaderGradient(){return"background:linear-gradient(135deg,rgba(139,92,246,0.1) 0%,rgba(168,85,247,0.05) 100%);"}getDevModeBadge(){return""}formatTime(e){return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}registerEventListener(e,t,i){e.addEventListener(t,i),this.eventListeners.push({element:e,event:t,handler:i})}}y._hubPresenceSub=null;y._hubRooms=[];y.ROOM_ACTIVITIES={"silent-room":"🧘 Silent practice","guided-room":"🎧 Guided session","breathwork-room":"💨 Breathwork","campfire-room":"🔥 Around the fire","osho-room":"🌀 Osho space","deepwork-room":"🎯 Deep work","tarot-room":"🔮 Tarot reading","reiki-room":"✨ Reiki session"};y.startHubPresence=async function(n){n&&(y._hubRooms=n);const e=y._hubRooms;if(!e.length)return;if(!h?.ready){const i=setInterval(()=>{h?.ready&&(clearInterval(i),y.startHubPresence())},500);return}y.stopHubPresence();const t=async()=>{const i=await h.getActiveMembers(),o=i.filter(a=>a.is_phantom).length;e.forEach(a=>{const s=i.filter(r=>r.room_id===a.roomId).length;a.state.participants=s+o,a._updateRoomCardCount(s+o)})};await t(),y._hubPresenceSub=h.subscribeToPresence(t)};y.stopHubPresence=function(){if(y._hubPresenceSub){try{y._hubPresenceSub.unsubscribe()}catch{}y._hubPresenceSub=null}};window.PracticeRoom=y;window.dispatchRoomReady=function(n){document.dispatchEvent(new CustomEvent("practiceRoomReady",{detail:{roomKey:n}}))};window.openMemberProfileAboveRoom=function(n){!window.MemberProfileModal||!n||(MemberProfileModal.open(n),requestAnimationFrame(()=>{const e=openMemberProfileAboveRoom._cachedEls;(!e||e.some(t=>!t.isConnected))&&(openMemberProfileAboveRoom._cachedEls=[document.getElementById("memberProfileModal"),document.getElementById("memberProfileOverlay"),document.querySelector(".member-profile-overlay"),document.querySelector(".member-profile-modal"),document.querySelector('[class*="member"][class*="modal"]'),document.querySelector('[id*="memberProfile"]')].filter(Boolean)),openMemberProfileAboveRoom._cachedEls.forEach(t=>{t.style.zIndex="200000"})}))};const Be=Object.freeze(Object.defineProperty({__proto__:null,PracticeRoom:y},Symbol.toStringTag,{value:"Module"}));class A extends y{constructor(e){super(e),this.initPlayerState(),this.initCycleState(),this.sessions=[],this.scheduleModalTitle="📅 Upcoming Sessions",this.state.currentSession=null,this.state.nextSession=null}onInit(){this.initializeCycle(),this.preloadYouTubeAPI()}onEnter(){this.loadYouTubeAPI()}onCleanup(){this.cleanupPlayer(),this.cleanupCycle()}setSessions(e){const t=Math.floor(e/(this.config.cycleDuration*1e3))%this.sessions.length;this.state.currentSession=this.sessions[t],this.state.nextSession=this.sessions[(t+1)%this.sessions.length]}getCurrentSession(){return this.state.currentSession}getNextSession(){return this.state.nextSession}buildBody(){const e=this.getCurrentSession();return`
        <div class="ps-body">
            <main class="ps-main">
                <h2 style="text-align:center;margin:20px 0;font-size:24px;font-weight:600;color:var(--text);"
                    id="${this.roomId}SessionHeading" aria-live="polite">
                    Current Session - ${e?.title||"Loading…"}
                </h2>
                ${this.buildPlayerContainer()}
                ${this.buildPlayerControls()}
            </main>
        </div>`}buildHubModals(){return this._buildScheduleModalShell()}_buildScheduleModalShell(){return`
        <div class="modal-overlay" id="${this.roomId}ScheduleModal" role="dialog" aria-modal="true" aria-labelledby="${this.roomId}ScheduleTitle">
            <div class="modal-card schedule-modal">
                <button type="button" class="modal-close" aria-label="Close schedule modal" data-action="closeScheduleModal">×</button>
                <h2 id="${this.roomId}ScheduleTitle">${this.scheduleModalTitle}</h2>
                <div class="schedule-content" id="${this.roomId}ScheduleContent"></div>
            </div>
        </div>`}showScheduleModal(){const e=document.getElementById(`${this.roomId}ScheduleModal`),t=document.getElementById(`${this.roomId}ScheduleContent`);if(!e||!t)return;const i=Date.now(),o=this.config.cycleDuration*1e3,a=this.config.openDuration*1e3,s=Math.floor(i/o),r=Array.from({length:6},(l,c)=>this._buildScheduleRow(i,o,a,s+c,c===0)).join("");t.innerHTML=`<div class="schedule-list">${r}</div>`,e.classList.add("active")}_buildScheduleRow(e,t,i,o,a){const s=o*t,r=s+i,l=this.sessions[o%this.sessions.length],c=e-s,d=a&&c>=0&&c<i,u=a&&c>=i,m=C=>new Date(C).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),p=d?'<span style="background:#22c55e;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">OPEN NOW</span>':u?'<span style="background:rgba(239,68,68,0.15);color:#ef4444;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;margin-left:8px;">IN SESSION</span>':"";return`
        <div class="schedule-item${a?" current":""}"
             style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-radius:var(--radius-md);margin-bottom:8px;${d?"background:var(--accent);color:white;":"background:var(--surface);"}">
            <div style="display:flex;align-items:center;gap:12px;flex:1;">
                <span style="font-size:24px;">${l.emoji}</span>
                <div>
                    <div style="font-weight:600;font-size:14px;">${l.title}${p}</div>
                    <div style="font-size:11px;opacity:0.7;">${[l.category,l.duration].filter(Boolean).join(" · ")}</div>
                </div>
            </div>
            <div style="text-align:right;font-size:12px;white-space:nowrap;margin-left:12px;">
                <div style="font-weight:600;">${m(s)}</div>
                <div style="opacity:0.6;">closes ${m(r)}</div>
            </div>
        </div>`}closeScheduleModal(){document.getElementById(`${this.roomId}ScheduleModal`)?.classList.remove("active")}}Object.assign(A.prototype,ae);Object.assign(A.prototype,se);const Re=Object.freeze(Object.defineProperty({__proto__:null,TimedVideoRoom:A},Symbol.toStringTag,{value:"Module"})),Z={switchTab(n){const e=document.getElementById(`${this.roomId}DailyTab`),t=document.getElementById(`${this.roomId}PersonalTab`),i=document.getElementById(`${this.roomId}TabDaily`),o=document.getElementById(`${this.roomId}TabPersonal`);if(!e||!t||!i||!o)return;const a=n==="daily";e.style.display=a?"block":"none",t.style.display=a?"none":"block",i.setAttribute("aria-selected",String(a)),o.setAttribute("aria-selected",String(!a)),this._styleTab(i,a),this._styleTab(o,!a),this.state.currentTab=n,n==="personal"&&typeof this.onPersonalTabEnter=="function"&&this.onPersonalTabEnter()},_styleTab(n,e){n.style.background=e?"linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%)":"transparent",n.style.color=e?"white":"var(--text)",n.style.borderBottom=e?"3px solid var(--neuro-accent)":"3px solid transparent"},buildTabNav(n,e){return`
        <div role="tablist" style="display:flex;gap:8px;margin-bottom:24px;border-bottom:2px solid var(--border);flex-wrap:wrap;">
            <button type="button" id="${this.roomId}TabDaily"
                    data-action="switchTab" data-tab="daily"
                    role="tab" aria-selected="true" aria-controls="${this.roomId}DailyTab"
                    style="padding:10px 16px;background:linear-gradient(135deg,var(--neuro-accent) 0%,var(--neuro-accent-light) 100%);color:white;border:none;border-bottom:3px solid var(--neuro-accent);cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${n}
            </button>
            <button type="button" id="${this.roomId}TabPersonal"
                    data-action="switchTab" data-tab="personal"
                    role="tab" aria-selected="false" aria-controls="${this.roomId}PersonalTab"
                    style="padding:10px 16px;background:transparent;color:var(--text);border:none;border-bottom:3px solid transparent;cursor:pointer;font-weight:600;font-size:14px;border-radius:8px 8px 0 0;white-space:nowrap;">
                ${e}
            </button>
        </div>`}},Pe=Object.freeze(Object.defineProperty({__proto__:null,TabRoomMixin:Z},Symbol.toStringTag,{value:"Module"}));class U extends y{constructor(){super({roomId:"silent",roomType:"always-open",name:"Silent Meditation",icon:"🧘",description:"Join others in silence. No guidance, shared energy.",energy:"Peaceful",imageUrl:"/Community/Silent.webp",participants:4}),this.initTimerState(1200),this.initSoundState(),this.affirmations=["Breathe in peace, breathe out tension","This moment is enough","I am here, I am present","Let go of what was, embrace what is","In stillness, I find clarity","My breath is my anchor","I trust the process of life","Peace begins within","I am worthy of this rest","This too shall pass"],this._affirmationInterval=null}onEnter(){this.startAffirmations()}onLeave(){this.resetTimer(),this._resetDimMode()}onCleanup(){this.cleanupTimer(),this.cleanupSound(),this._affirmationInterval&&(clearInterval(this._affirmationInterval),this._affirmationInterval=null),this._affirmationVisibilityHandler&&(document.removeEventListener("visibilitychange",this._affirmationVisibilityHandler),this._affirmationVisibilityHandler=null)}onOutsideClick(e){const t=document.getElementById(`${this.roomId}SoundSettings`);t&&!t.contains(e.target)&&!e.target.closest('[data-action="toggleSoundSettings"]')&&t.classList.remove("visible")}buildAdditionalHeaderButtons(){return`
            ${this.buildSoundButton()}
            <button type="button" class="ps-leave" data-action="toggleDimMode"
                    id="${this.roomId}DimModeBtn" style="padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`}buildBody(){return`
        ${this.buildSoundSettings()}
        <div class="ps-body">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;">
                <div id="${this.roomId}RotatingAffirmation" aria-live="polite" aria-atomic="true"
                     style="position:relative;max-width:650px;text-align:center;font-size:22px;font-weight:600;letter-spacing:0.02em;line-height:1.6;margin-bottom:30px;z-index:10;opacity:0.7;transition:opacity 0.5s ease;">
                </div>
                ${this.buildTimerContainer({subtitle:"in silence",gradientId:"silentTimerGrad",color1:"#4ade80",color2:"#16a34a",glowColor:"rgba(74,222,128,0.7)"})}
                ${this.buildTimerControls()}
            </main>
        </div>`}getInstructions(){return`
            <p><strong>Welcome to the Silent Meditation space.</strong></p>
            <h3>How to Practice:</h3>
            <ul>
                <li>Set your timer using +/- buttons</li>
                <li>Click "Begin" to start</li>
                <li>Focus on your breath</li>
                <li>Use the timer ring as a visual anchor</li>
            </ul>
            <h3>Sound Settings:</h3>
            <ul>
                <li>5-minute bells for gentle reminders</li>
                <li>Ambient sounds for atmosphere</li>
                <li>Completion bell when session ends</li>
            </ul>`}startAffirmations(){this.rotateAffirmation(),this._affirmationInterval=setInterval(()=>this.rotateAffirmation(),8e3),this._affirmationVisibilityHandler=()=>{document.hidden?this._affirmationInterval&&(clearInterval(this._affirmationInterval),this._affirmationInterval=null):this._affirmationInterval||(this.rotateAffirmation(),this._affirmationInterval=setInterval(()=>this.rotateAffirmation(),8e3))},document.addEventListener("visibilitychange",this._affirmationVisibilityHandler)}rotateAffirmation(){const e=document.getElementById(`${this.roomId}RotatingAffirmation`);e&&(e.style.opacity="0",setTimeout(()=>{e.textContent=this.affirmations[Math.floor(Math.random()*this.affirmations.length)],e.style.opacity="0.7"},500))}toggleDimMode(){const e=document.getElementById("dynamicRoomContent");if(!e)return;e.classList.toggle("dimmed");const t=e.classList.contains("dimmed"),i=document.getElementById(`${this.roomId}DimModeBtn`);i&&(i.innerHTML=t?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim');const o=document.getElementById("communityHubFullscreenContainer");o&&(o.style.background=t?"rgba(0,0,0,0.85)":"transparent")}_resetDimMode(){const e=document.getElementById("dynamicRoomContent");e&&e.classList.remove("dimmed");const t=document.getElementById("communityHubFullscreenContainer");t&&(t.style.background="transparent");const i=document.getElementById(`${this.roomId}DimModeBtn`);i&&(i.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim')}offerGratitude(){window.Core.showToast("Gratitude offered to the space");const e=document.getElementById(`${this.roomId}GratitudeContainer`);e&&(e.style.transform="scale(1.05)",setTimeout(()=>{e.style.transform="scale(1)"},200))}getActions(){return{...super.getActions(),toggleDimMode:()=>this.toggleDimMode()}}}Object.assign(U.prototype,Q);Object.assign(U.prototype,Y);const re=new U;window.SilentRoom=re;window.dispatchRoomReady?.("silent");const Le=Object.freeze(Object.defineProperty({__proto__:null,SilentRoom:U,silentRoom:re},Symbol.toStringTag,{value:"Module"}));class le extends A{constructor(){super({roomId:"guided",roomType:"timed",name:"Guided Meditation",icon:"🎧",description:"Aanandoham's Curated Guided Visualizations. Synchronized guided sessions for the whole community - together, worldwide. A new meditation begins every hour. Drop in, tune out, come back renewed. View Schedule for details.",energy:"Focused",imageUrl:"/Community/Visualization.webp",participants:0,cycleDuration:3600,openDuration:900,sessionDuration:2700}),this.scheduleModalTitle="📅 Today's Meditation Schedule",this.sessions=[{title:"Grounding to the Center of Earth",duration:"29:56",category:"Grounding",videoId:"_KedpeSYwgA",emoji:"🌍"},{title:"Aura Adjustment and Cleaning",duration:"29:56",category:"Energy",videoId:"gIMfdNkAC4g",emoji:"✨"},{title:"Chakra Cleaning",duration:"39:58",category:"Chakras",videoId:"BFvmLeYg7cE",emoji:"🌈"},{title:"The Center of the Universe",duration:"29:56",category:"Spiritual",videoId:"1T2dNQ4M7Ko",emoji:"🌌"},{title:"Blowing Roses Healing Technique",duration:"29:56",category:"Healing",videoId:"3yQrtsHbSBo",emoji:"🌹"},{title:"3 Wishes Manifestation",duration:"29:52",category:"Manifestation",videoId:"EvRa_qwgJao",emoji:"⭐"},{title:"Meeting your Higher Self",duration:"29:56",category:"Premium",videoId:"34mla-PnpeU",emoji:"💎"},{title:"Inner Temple",duration:"29:46",category:"Premium",videoId:"t6o6lpftZBA",emoji:"🔮"},{title:"Gratitude Practice",duration:"29:56",category:"Premium",videoId:"JyTwWAhsiq8",emoji:"👑"}]}getInstructions(){return`
            <p><strong>Hourly guided meditation sessions.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>A new session begins every hour, on the hour</li>
                <li>Open window: :00 to :15 - enter before :15 to join</li>
                <li>Session runs 45 minutes · Room closes at :15</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>9 meditations rotating hourly</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Find a comfortable seated position</li>
                <li>Close your eyes or soften your gaze</li>
                <li>Follow the guided instructions</li>
                <li>Allow yourself to fully receive</li>
            </ul>`}}const de=new le;window.GuidedRoom=de;window.dispatchRoomReady?.("guided");const De=Object.freeze(Object.defineProperty({__proto__:null,GuidedRoom:le,guidedRoom:de},Symbol.toStringTag,{value:"Module"}));class ce extends A{constructor(){super({roomId:"osho",roomType:"timed",name:"OSHO Active",icon:"💃",description:"OSHO Active Meditations practices (with instructions). View Schedule for details.",energy:"Dynamic",imageUrl:"/Community/OSHO.webp",participants:0,cycleDuration:5400,openDuration:600,sessionDuration:4800}),this.scheduleModalTitle="📅 Upcoming OSHO Sessions",this.sessions=[{title:"OSHO Dynamic Meditation",duration:"77:00",category:"Energy",introVideoId:"Q_PFlkHH7IA",videoId:"tLUxtq3peR8",emoji:"🔥"},{title:"OSHO Kundalini Meditation",duration:"77:00",category:"Movement",introVideoId:"O3-wH2VBdN8",videoId:"vEyageQp6w8",emoji:"💃"},{title:"OSHO Nadabrahma Meditation",duration:"77:00",category:"Humming",introVideoId:"tnVsMXf88Pw",videoId:"yVGhzBVT64A",emoji:"🕉️"},{title:"OSHO Nataraj Meditation",duration:"77:00",category:"Dance",introVideoId:"pxg3FmOeQhk",videoId:"grSjP12Q4Oc",emoji:"🎭"},{title:"OSHO Whirling Meditation",duration:"77:00",category:"Spinning",introVideoId:"Jk2AaABIKTY",videoId:"EKvLFs9niXY",emoji:"🌀"}]}onEnter(){this._playingIntro=!1,super.onEnter()}initPlayer(){if(this.state.playerInitialized)return;const e=this.getCurrentSession();if(!e?.introVideoId){super.initPlayer();return}this._playingIntro=!0,this.state.player=new YT.Player(`${this.roomId}-youtube-player`,{videoId:e.introVideoId,playerVars:{autoplay:0,controls:1,modestbranding:1,rel:0,mute:1},events:{onReady:t=>this.onPlayerReady(t),onStateChange:t=>this.onPlayerStateChange(t)}}),this.state.playerInitialized=!0}startSession(){if(!this.state.playerReady||this.state.sessionStarted)return;const e=this.getCurrentSession();e&&(this._playingIntro=!0,this._showPlayer(),this.state.player?.unMute(),this.state.player?.setVolume(100),this.state.player?.playVideo(),this.state.sessionStarted=!0,window.Core.showToast(`${e.emoji} Intro starting…`))}onVideoEnded(){if(this._playingIntro){this._playingIntro=!1;const e=this.getCurrentSession();e?.videoId&&this.state.player&&(this.state.player.loadVideoById(e.videoId),this.state.player.playVideo(),window.Core.showToast(`${e.emoji} Practice starting…`))}else this.stopProgressTracking(),window.Core.showToast("Session complete")}getInstructions(){return`
            <p><strong>Active OSHO meditation techniques every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>Each session begins with guided instructions, then the full practice</li>
                <li>5 OSHO methods rotating each cycle</li>
            </ul>
            <h3>Practice Guidelines:</h3>
            <ul>
                <li>Enter during the open window</li>
                <li>Express freely - move, breathe, sound</li>
                <li>Allow whatever arises</li>
            </ul>
            <h3>The 5 Methods:</h3>
            <ul>
                <li>🔥 Dynamic - Cathartic active meditation</li>
                <li>💃 Kundalini - Shaking and dancing</li>
                <li>🕉️ Nadabrahma - Humming meditation</li>
                <li>🎭 Nataraj - Dance meditation</li>
                <li>🌀 Whirling - Sufi spinning meditation</li>
            </ul>`}}const ue=new ce;window.OshoRoom=ue;window.dispatchRoomReady?.("osho");const je=Object.freeze(Object.defineProperty({__proto__:null,OshoRoom:ce,oshoRoom:ue},Symbol.toStringTag,{value:"Module"}));class he extends A{constructor(){super({roomId:"breathwork",roomType:"timed",name:"Breathwork",icon:"💨",description:"Unique Breathwork Sessions, from different modalities and techniques. View Schedule for details.",energy:"Transformative",imageUrl:"/Community/Breathwork.webp",participants:0,cycleDuration:5400,openDuration:600,sessionDuration:4800}),this.scheduleModalTitle="📅 Upcoming Breathwork Sessions",this.sessions=[{title:"Trauma Release & Emotional Renewal",duration:"70:00",category:"Healing",videoId:"eocuqWqaKgk",emoji:"💫"},{title:"Rewire Your Brain",duration:"70:00",category:"Transformation",videoId:"6JrHM6UjVpw",emoji:"🧠"},{title:"Meet Your Higher Self",duration:"70:00",category:"Spiritual",videoId:"DAVdAGn5ELw",emoji:"✨"},{title:"Deep Sleep Breathing & Affirmations",duration:"70:00",category:"Rest",videoId:"q3DygsrH9q8",emoji:"🌙"},{title:"Darkness to Light Breathwork Experience",duration:"70:00",category:"Energy",videoId:"Kv7GhUpLUE4",emoji:"🌅"},{title:"Wim Hof Method Breathwork",duration:"70:00",category:"Power",videoId:"CQnW0rLozww",emoji:"❄️"}]}getInstructions(){return`
            <p><strong>Transformative breathwork sessions every 90 minutes.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Sessions open every 1.5 hours from midnight UTC - enter before :10 to join</li>
                <li>Session runs 80 minutes · Room closes at :10</li>
                <li>All users worldwide join the same session simultaneously</li>
                <li>6 techniques rotating each cycle</li>
            </ul>
            <h3>Safety Guidelines:</h3>
            <ul>
                <li>Find a safe position (lying or seated)</li>
                <li>Never practice while driving or in water</li>
                <li>Stop if you feel dizzy or uncomfortable</li>
            </ul>
            <h3>Techniques:</h3>
            <ul>
                <li>💫 Trauma Release - Emotional renewal and healing</li>
                <li>🧠 Rewire Your Brain - Transformational breathwork</li>
                <li>✨ Higher Self - Spiritual guided breathwork</li>
                <li>🌙 Deep Sleep - Breathing and affirmations</li>
                <li>🌅 Darkness to Light - Energy breathwork experience</li>
                <li>❄️ Wim Hof - Power breathing and breath holds</li>
            </ul>`}}const pe=new he;window.BreathworkRoom=pe;window.dispatchRoomReady?.("breathwork");const He=Object.freeze(Object.defineProperty({__proto__:null,BreathworkRoom:he,breathworkRoom:pe},Symbol.toStringTag,{value:"Module"}));class O extends y{constructor(){super({roomId:"deepwork",roomType:"always-open",name:"Digital Nomads Deep Work",icon:"🎯",description:"Focus sessions with your community. Do hard things together. Set your intention. Start the timer. Get it done.",energy:"Focused",imageUrl:"/Community/Focus.webp",participants:12}),this.devMode=!0,this.initTimerState(1800),this.initSoundState(),this.initChatState(["main"]),this.state.currentStatus="deep-focus",this.state.lastFocusStatus="deep-focus",this.state.currentIntention="",this.state.currentCategory="work",this.state.selectedDuration=25,this.state.showSetup=!0,this.CATEGORIES={work:{icon:"💼",label:"WORK",gradient:"linear-gradient(135deg,rgba(245,158,11,0.2),rgba(239,68,68,0.2))",border:"rgba(245,158,11,0.3)"},study:{icon:"📚",label:"STUDY",gradient:"linear-gradient(135deg,rgba(59,130,246,0.2),rgba(147,51,234,0.2))",border:"rgba(59,130,246,0.3)"},creative:{icon:"🎨",label:"CREATIVE",gradient:"linear-gradient(135deg,rgba(236,72,153,0.2),rgba(168,85,247,0.2))",border:"rgba(236,72,153,0.3)"},reading:{icon:"📖",label:"READING",gradient:"linear-gradient(135deg,rgba(34,197,94,0.2),rgba(59,130,246,0.2))",border:"rgba(34,197,94,0.3)"},planning:{icon:"📋",label:"PLANNING",gradient:"linear-gradient(135deg,rgba(139,92,246,0.2),rgba(59,130,246,0.2))",border:"rgba(139,92,246,0.3)"},coding:{icon:"💻",label:"CODING",gradient:"linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2))",border:"rgba(16,185,129,0.3)"}}}onEnter(){this.state.showSetup&&setTimeout(()=>this.showSetupModal(),300),this.loadRoomChatFromDB("main"),this._injectSenderAvatar("main"),requestAnimationFrame(()=>{document.querySelector(`#${this.roomId}View .ps-main`)?.scrollTo(0,0)})}onCleanup(){if(this.cleanupTimer(),this.cleanupSound(),h?.ready)try{h.unsubscribeFromRoomChat("deepwork")}catch{}const e=document.getElementById("communityHubFullscreenContainer");e&&(e.style.background="transparent"),document.getElementById("dynamicRoomContent")?.classList.remove("dimmed")}onTimerComplete(){this._switchToBreak()}onOutsideClick(e){const t=document.getElementById(`${this.roomId}SoundSettings`);t&&!t.contains(e.target)&&!e.target.closest('[data-action="toggleSoundSettings"]')&&t.classList.remove("visible")}pauseTimer(){this._clearInterval(),this.state.timerRunning=!1,this._setTimerBtn("paused"),this._setTimerGlow("paused"),this._switchToBreak()}_setTimerBtn(e){const t=document.getElementById(`${this.roomId}TimerBtn`);if(!t)return;const i={idle:"Begin",running:"Break",paused:"Continue",done:"Complete"};t.textContent=i[e]??e}startTimer(){this.state.timerRunning||(this.state.timerRunning=!0,this._setTimerGlow("running"),this._timerInterval=setInterval(()=>{this.state.timeLeft--,this._updateTimer(),this.state.timeLeft>0&&this.state.timeLeft%300===0&&this.state.fiveMinBellEnabled&&this.play5MinBell?.(),this.state.timeLeft<=0&&this.completeTimer()},1e3),this._attachVisibilityHandler(),this._restoreFocusStatus(),window.Core.showToast("Timer started"))}_switchToBreak(){this.state.currentStatus!=="break"&&(this.state.lastFocusStatus=this.state.currentStatus),this._applyStatus("break")}_restoreFocusStatus(){this._applyStatus(this.state.lastFocusStatus||"deep-focus")}_applyStatus(e){this.state.currentStatus=e;const t=e==="break",i=document.getElementById("currentStatus");i&&(i.textContent=this.getStatusText()),document.querySelectorAll(".dw-status-btn").forEach(o=>{const a=o.dataset.status===e;o.style.background=a?"var(--accent)":"var(--surface)",o.style.color=a?"white":"var(--text)",o.style.border=`2px solid ${a?"var(--accent)":"var(--border)"}`}),this._setChatPanelOpen(t),window.Core.showToast(t?"Break time — chat unlocked!":`${this.getStatusText()}`)}_setChatPanelOpen(e){const t=document.getElementById(`${this.roomId}ChatPanelBody`),i=t?.previousElementSibling,o=document.getElementById(`${this.roomId}ChatChevron`);t&&(t.style.maxHeight=e?"600px":"0px",t.style.opacity=e?"1":"0"),i&&(i.style.opacity=e?"1":"0.35"),o&&(o.style.transform=e?"rotate(0deg)":"rotate(-90deg)");const a=document.getElementById(`${this.roomId}MainInput`),s=document.getElementById(`${this.roomId}MainSendBtn`);a&&(a.disabled=!e,a.placeholder=e?"Share during your break...":"Pause timer to chat"),s&&(s.disabled=!e)}_toggleChatPanel(){if(this.state.currentStatus!=="break")return;const e=document.getElementById(`${this.roomId}ChatPanelBody`);if(!e)return;const t=e.style.maxHeight!=="0px";this._setChatPanelOpen(!t)}getStatusText(){return{"deep-focus":"DEEP FOCUS","light-focus":"LIGHT FOCUS",break:"BREAK TIME"}[this.state.currentStatus]||"DEEP FOCUS"}changeStatus(e){e!=="break"&&(this.state.lastFocusStatus=e),this._applyStatus(e)}showSetupModal(){document.getElementById(`${this.roomId}SetupModal`)?.classList.add("active")}closeSetupModal(){document.getElementById(`${this.roomId}SetupModal`)?.classList.remove("active")}confirmSetup(){const e=document.getElementById(`${this.roomId}IntentionInput`);this.state.currentIntention=e?.value.trim()||"Focus session";const t=this.state.selectedDuration,i=parseInt(t==="custom"?document.getElementById(`${this.roomId}CustomMinutes`)?.value:t),a=Math.max(1,Math.min(180,i||25))*60;this.state.timeLeft=a,this.state.initialTime=a,this.state.showSetup=!1,this.closeSetupModal(),requestAnimationFrame(()=>{this._updateTimer(),this._setTimerBtn("idle"),setTimeout(()=>this._updateTimer(),50)});const s=document.getElementById("currentIntention"),r=document.getElementById("categoryBadge");if(s&&(s.textContent=this.state.currentIntention||"Use this time to focus and get things done"),r){const l=this.CATEGORIES[this.state.currentCategory];r.innerHTML=`${l.icon} ${l.label}`,r.style.background=l.gradient,r.style.border=`2px solid ${l.border}`}window.Core.showToast("Session set - click Begin!")}_selectTile(e,t,i){document.querySelectorAll(`#${e} [${t}]`).forEach(o=>{const a=String(o.getAttribute(t))===String(i);o.style.border=`2px solid ${a?"var(--accent)":"var(--border)"}`,o.style.background=a?"rgba(139,92,246,0.12)":"var(--surface)"})}selectCategory(e){this.state.currentCategory=e,this._selectTile(`${this.roomId}CategoryTiles`,"data-cat",e)}selectDuration(e){this.state.selectedDuration=e,this._selectTile(`${this.roomId}DurationTiles`,"data-dur",e);const t=document.getElementById(`${this.roomId}CustomDurationDiv`);t&&(t.style.display=e==="custom"?"block":"none")}toggleDimMode(){const e=document.getElementById("dynamicRoomContent");if(!e)return;e.classList.toggle("dimmed");const t=e.classList.contains("dimmed");document.getElementById(`${this.roomId}DimModeBtn`)?.textContent!==void 0&&(document.getElementById(`${this.roomId}DimModeBtn`).innerHTML=t?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg> Bright':'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim');const i=document.getElementById("communityHubFullscreenContainer");i&&(i.style.background=t?"rgba(0,0,0,0.85)":"transparent")}getParticipantText(){return`${this.state.participants} working together`}buildAdditionalHeaderButtons(){return`
            ${this.buildSoundButton()}
            <button type="button" class="ps-leave" data-action="toggleDimMode"
                    id="${this.roomId}DimModeBtn" style="margin:0;padding:10px 16px;white-space:nowrap;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> Dim
            </button>`}buildBody(){const e=this.CATEGORIES[this.state.currentCategory],t=this.state.currentStatus==="break";return`
        ${this.buildSoundSettings()}
        <div class="ps-body" style="display:flex;flex-direction:column;">
            <main class="ps-main" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">

                <!-- Category pill (always shown, fallback "Focus") -->
                <div style="margin-bottom:16px;">
                    <span id="categoryBadge" style="display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:${e.gradient};border:2px solid ${e.border};border-radius:var(--radius-full);font-size:14px;font-weight:700;letter-spacing:0.05em;">
                        ${e.icon} ${this.state.currentCategory?e.label:"Focus"}
                    </span>
                </div>

                <!-- Intention -->
                <div style="text-align:center;max-width:600px;margin-bottom:20px;">
                    <div id="currentIntention" style="font-size:clamp(1.1rem,4vw,1.75rem);font-weight:700;letter-spacing:0.02em;line-height:1.4;opacity:0.9;">
                        ${this.state.currentIntention||"Use this time to focus and get things done"}
                    </div>
                </div>

                <!-- Timer ring -->
                ${this.buildTimerContainer({gradientId:"deepworkTimerGrad",color1:"#c1705a",color2:"#8b3a2a",glowColor:"rgba(193,112,90,0.7)",subtitleHtml:`<div id="currentStatus" aria-live="polite" style="font-size:13px;text-transform:uppercase;letter-spacing:0.22em;opacity:0.5;font-weight:500;">${this.getStatusText()}</div>`})}

                <!-- Timer controls -->
                <div style="margin-bottom:24px;">
                ${this.buildTimerControls()}
                </div>

                <!-- Status buttons (below timer) -->
                <div style="display:flex;gap:8px;margin-top:20px;margin-bottom:32px;flex-wrap:wrap;justify-content:center;">
                    ${["deep-focus","light-focus","break"].map(i=>`
                    <button type="button" class="dw-status-btn" data-status="${i}"
                            data-action="changeStatus" data-status="${i}"
                            style="padding:10px 20px;border:2px solid ${this.state.currentStatus===i?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${this.state.currentStatus===i?"var(--accent)":"var(--surface)"};color:${this.state.currentStatus===i?"white":"var(--text)"};cursor:pointer;font-weight:600;font-size:13px;transition:all 0.2s;">
                        ${{"deep-focus":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> Deep Focus',"light-focus":'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Light Focus',break:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg> Break Time'}[i]}
                    </button>`).join("")}
                </div>
            </main>

            <!-- Chat below timer — collapsible -->
            <div style="padding:0 20px 20px;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;">
                    <!-- Header / toggle row -->
                    <div data-action="toggleChatPanel"
                         style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;cursor:pointer;user-select:none;opacity:${t?"1":"0.35"};">
                        <div style="display:flex;align-items:center;gap:8px;font-family:var(--serif);font-size:17px;font-weight:600;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:18px;height:18px;"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                            Break Room Chat
                        </div>
                        <div style="display:flex;align-items:center;gap:8px;">
                            ${t?"":'<span style="font-size:11px;opacity:0.6;font-style:italic;">☕ Opens on Break</span>'}
                            <svg id="${this.roomId}ChatChevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;transition:transform 0.25s;transform:${t?"rotate(0deg)":"rotate(-90deg)"};">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </div>
                    </div>
                    <!-- Collapsible body -->
                    <div id="${this.roomId}ChatPanelBody"
                         style="overflow:hidden;max-height:${t?"600px":"0px"};transition:max-height 0.3s ease;opacity:${t?"1":"0"};transition:max-height 0.3s ease,opacity 0.3s ease;">
                        <div style="padding:0 8px 24px;" class="tarot-daily-grid">
                            <div>
                                ${this.buildChatContainer("main","Share during your break...")}
                            </div>
                            ${this.buildParticipantSidebarHTML("Working Together",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
                        </div>
                    </div>
                </div>
            </div>
        </div>`}buildHubModals(){return`
        <div class="modal-overlay" id="${this.roomId}SetupModal" style="z-index:200001;">
            <div class="modal-card" style="max-width:550px;max-height:90vh;overflow-y:auto;">
                <button type="button" class="modal-close" aria-label="Close setup modal" data-action="closeSetupModal">×</button>
                <div class="modal-content">
                    <h2 style="font-family:var(--serif);margin-top:0;margin-bottom:8px;text-align:center;">Start Deep Work Session</h2>
                    <p style="text-align:center;color:var(--text-muted);font-size:13px;margin-bottom:24px;">Set your intention. Choose your time. Work in flow.</p>

                    <div style="margin-bottom:24px;">
                        <label for="${this.roomId}IntentionInput" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Your Intention</label>
                        <input type="text" id="${this.roomId}IntentionInput"
                               aria-label="Set your intention for this session"
                               placeholder="e.g., Finish proposal, Code feature..."
                               style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}CategoryLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Category</label>
                        <div id="${this.roomId}CategoryTiles" role="radiogroup" aria-labelledby="${this.roomId}CategoryLabel" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                            ${Object.entries(this.CATEGORIES).map(([e,t],i)=>`
                            <button type="button" data-action="selectCategory" data-cat="${e}"
                                    style="padding:12px;text-align:center;border:2px solid ${i===0?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${i===0?"rgba(139,92,246,0.12)":"var(--surface)"};cursor:pointer;font-size:13px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${t.icon} ${t.label.charAt(0)+t.label.slice(1).toLowerCase()}
                            </button>`).join("")}
                        </div>
                    </div>

                    <div style="margin-bottom:24px;">
                        <label id="${this.roomId}DurationLabel" style="display:block;font-weight:600;margin-bottom:8px;font-size:14px;">Duration</label>
                        <div id="${this.roomId}DurationTiles" role="radiogroup" aria-labelledby="${this.roomId}DurationLabel" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
                            ${[25,50,90].map((e,t)=>`
                            <button type="button" data-action="selectDuration" data-dur="${e}"
                                    style="padding:12px;text-align:center;border:2px solid ${t===0?"var(--accent)":"var(--border)"};border-radius:var(--radius-md);background:${t===0?"rgba(139,92,246,0.12)":"var(--surface)"};cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                ${e} min
                            </button>`).join("")}
                            <button type="button" data-action="selectDuration" data-dur="custom"
                                    style="padding:12px;text-align:center;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;font-size:14px;font-weight:600;transition:all 0.15s;user-select:none;width:100%;">
                                Custom
                            </button>
                        </div>
                        <div id="${this.roomId}CustomDurationDiv" style="display:none;margin-top:12px;">
                            <label for="${this.roomId}CustomMinutes" style="display:block;font-size:12px;color:var(--text-muted);margin-bottom:4px;">Custom duration (minutes)</label>
                            <input type="number" id="${this.roomId}CustomMinutes"
                                   placeholder="Minutes (1–180)" min="1" max="180"
                                   style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);font-size:14px;box-sizing:border-box;">
                        </div>
                    </div>

                    <button type="button" data-action="confirmSetup"
                            style="width:100%;padding:14px;background:var(--accent);border:none;border-radius:var(--radius-md);color:white;cursor:pointer;font-weight:600;font-size:16px;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Start Session
                    </button>
                </div>
            </div>
        </div>`}getActions(){return{...super.getActions(),toggleDimMode:()=>this.toggleDimMode(),toggleChatPanel:()=>this._toggleChatPanel(),changeStatus:e=>this.changeStatus(this._actionEl(e).dataset.status),closeSetupModal:()=>this.closeSetupModal(),selectCategory:e=>this.selectCategory(this._actionEl(e).dataset.cat),selectDuration:e=>this.selectDuration(this._actionEl(e).dataset.dur),confirmSetup:()=>this.confirmSetup()}}getInstructions(){return`
            <p><strong>Digital Nomads Deep Work space.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li>Set your intention and duration, then click Begin</li>
                <li>Pause → automatically switches to Break (chat unlocks)</li>
                <li>Continue → restores your previous focus mode</li>
                <li>Or switch modes manually using the status buttons</li>
            </ul>
            <h3>Focus Levels:</h3>
            <ul>
                <li>🎯 <strong>Deep Focus</strong> - Maximum concentration</li>
                <li>✨ <strong>Light Focus</strong> - Gentle background work</li>
                <li>☕ <strong>Break</strong> - Recharge and connect</li>
            </ul>
            <h3>Tips:</h3>
            <ul>
                <li>Pomodoro: 25–50 min work, 5–15 min break</li>
                <li>Chat only available during Break mode</li>
                <li>Use 🌙 Dim to reduce distractions</li>
            </ul>`}}Object.assign(O.prototype,Q);Object.assign(O.prototype,Y);Object.assign(O.prototype,z);const me=new O;window.DeepWorkRoom=me;window.dispatchRoomReady?.("deepwork");const ze=Object.freeze(Object.defineProperty({__proto__:null,DeepWorkRoom:O,deepWorkRoom:me},Symbol.toStringTag,{value:"Module"}));class X extends y{constructor(){super({roomId:"campfire",roomType:"always-open",name:"Community Campfire",icon:"🔥",description:"A warm space to share, reflect, and connect with the community. Pull up a chair. Real conversations, real people, real connection.",energy:"Social",imageUrl:"/Community/Campfire.webp",participants:12}),this.initChatState(["main"])}onEnter(){this.loadRoomChatFromDB("main"),this._injectSenderAvatar("main")}getHeaderGradient(){return"background:linear-gradient(135deg,rgba(234,88,12,0.1) 0%,rgba(251,146,60,0.05) 100%);"}getParticipantText(){return`${this.state.participants} around the fire`}buildBody(){return`
        <div class="ps-body">
            <main class="campfire-main" aria-label="Community Campfire chat" style="padding:20px;min-width:0;">
                <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
                    <div>
                        <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;">Gather Around the Fire</h4>
                        <div style="display:flex;flex-direction:column;height:auto;">
                            ${this.buildChatContainer("main","Share from the heart...")}
                        </div>
                        <div class="campfire-hint" style="text-align:center;margin-top:8px;font-size:12px;color:var(--text-muted);font-style:italic;">
                            💫 Speak from the heart · Listen with presence
                        </div>
                    </div>
                    ${this.buildParticipantSidebarHTML("Around the Fire",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
                </div>
            </main>
        </div>`}getInstructions(){return`
            <p><strong>A warm gathering space for authentic connection.</strong></p>
            <h3>Campfire Values:</h3>
            <ul>
                <li>💫 Share authentically from the heart</li>
                <li>❤️ Listen with presence and care</li>
                <li>🌟 Inspire and uplift each other</li>
                <li>🤝 Connect across all borders</li>
            </ul>
            <h3>What to Share:</h3>
            <ul>
                <li>Reflections from your practice</li>
                <li>Insights and breakthroughs</li>
                <li>Gratitude and appreciation</li>
                <li>Questions and curiosity</li>
                <li>Support and encouragement</li>
            </ul>
            <h3>Guidelines:</h3>
            <ul>
                <li>Be respectful and kind</li>
                <li>Keep it positive and uplifting</li>
                <li>No spam or self-promotion</li>
                <li>Honor everyone's journey</li>
            </ul>`}}Object.assign(X.prototype,z);const ge=new X;window.CampfireRoom=ge;window.dispatchRoomReady?.("campfire");const Oe=Object.freeze(Object.defineProperty({__proto__:null,CampfireRoom:X,campfireRoom:ge},Symbol.toStringTag,{value:"Module"}));class G extends y{constructor(){super({roomId:"tarot",roomType:"always-open",name:"Tarot Room",icon:"🔮",description:"Explore the cards, reflect on the messages and share your insights with the community. Guidance, intuition, and community wisdom - one card at a time.",energy:"Intuitive",imageUrl:"/Community/Tarot.webp",participants:8}),this.initChatState(["daily","personal"]),this._tarotDataReady=!1,this._pendingDailyRender=!1,this._interpPurgedToday=!1,this._enrichedCache={},this._personalDataLoaded=!1,this._personalTabHydrated=!1,this.state.dailyCard=null,this.state.personalDeck=[],this.state.personalDrawn=!1,this.state.currentTab="daily",this._initializeTarotData()}async _initializeTarotData(){this.TAROT_BASE_URL="/Tarot%20Cards%20images/",this.suits=["pentacles","swords","cups","wands"],this.SUIT_NAMES={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},this.COURT_RANKS={11:"Page",12:"Knight",13:"Queen",14:"King"};try{const e=await fetch("/Data/tarot-data.json");if(e.ok){const t=await e.json();this._tarotData=t,this.MAJOR_ARCANA_NAMES={},this.MAJOR_ARCANA_MEANINGS={},t.majorArcana.forEach(i=>{this.MAJOR_ARCANA_NAMES[i.id]=i.name,this.MAJOR_ARCANA_MEANINGS[i.id]=i.upright}),this.MINOR_ARCANA_MEANINGS={},this.COURT_CARD_MEANINGS={},["pentacles","swords","cups","wands"].forEach(i=>{this.MINOR_ARCANA_MEANINGS[i]={},this.COURT_CARD_MEANINGS[i]={},(t.minorArcana[i]||[]).forEach(o=>{this.MINOR_ARCANA_MEANINGS[i][o.number]=o.upright}),(t.courtCards[i]||[]).forEach(o=>{this.COURT_CARD_MEANINGS[i][o.rank]=o.upright})})}else this._loadInlineTarotData()}catch{this._loadInlineTarotData()}this.state.personalDeck=this._buildFullDeck(),this._drawDailyCard(),this._tarotDataReady=!0,this.updateRoomCard(),this._pendingDailyRender&&(this._pendingDailyRender=!1,this._drawAndRenderDaily())}_loadInlineTarotData(){this.MAJOR_ARCANA_NAMES={0:"The Fool",1:"The Magician",2:"The High Priestess",3:"The Empress",4:"The Emperor",5:"The Hierophant",6:"The Lovers",7:"The Chariot",8:"Strength",9:"The Hermit",10:"Wheel of Fortune",11:"Justice",12:"The Hanged Man",13:"Death",14:"Temperance",15:"The Devil",16:"The Tower",17:"The Star",18:"The Moon",19:"The Sun",20:"Judgement",21:"The World"},this.MAJOR_ARCANA_MEANINGS={0:"A sacred beginning, full of faith and curiosity. Trust the unknown path before you.",1:"All the tools are in your hands. You are the bridge between spirit and matter.",2:"Silence holds the answers you seek. Trust your inner knowing.",3:"The Earth mirrors your abundance. Nurture what you love.",4:"True power is built through order and wisdom. Take authority over your life.",5:"Seek guidance in tradition and timeless truth. Knowledge becomes lived wisdom.",6:"Union of soul and choice of heart. Harmony is born when love aligns with truth.",7:"Willpower shapes destiny. Victory is achieved through balance of heart and mind.",8:"Gentle courage tames inner storms. True strength is soft yet unbreakable.",9:"Withdraw to reconnect with your light. The answers you seek are within.",10:"Life turns in divine rhythm. Every rise and fall carries hidden blessings.",11:"The scales always balance in time. Choose integrity.",12:"Surrender brings revelation. Sometimes you must pause to see from a higher angle.",13:"Endings are beginnings disguised. Transformation renews you into higher truth.",14:"Balance is your sacred art. Patience and moderation bring peace.",15:"Bondage is often self-made. Recognize what controls you and reclaim your power.",16:"When illusion collapses, liberation follows. Trust the breakdown.",17:"Hope returns like light after storm. Believe again in miracles.",18:"The path is unclear but alive with mystery. Feel your way through intuition.",19:"Joy, clarity, and vitality fill your being. Let your light shine.",20:"Awakening through self-realization. Rise into your higher purpose.",21:"Completion, integration, and mastery. Celebrate how far you've come."},this.MINOR_ARCANA_MEANINGS={pentacles:{1:"New financial opportunity or material beginning. Plant seeds for future abundance.",2:"Balance between multiple priorities. Juggling responsibilities with grace.",3:"Collaboration and teamwork. Your skills are recognized and valued.",4:"Holding on too tightly. Security through control or fear of loss.",5:"Financial or material hardship. Temporary struggle leads to resilience.",6:"Generosity and fair exchange. Giving and receiving in balance.",7:"Patience with long-term investments. Results take time to manifest.",8:"Mastery through practice. Dedication to craft and skill development.",9:"Self-sufficiency and material comfort. Enjoying the fruits of your labor.",10:"Lasting wealth and legacy. Family, tradition, and generational abundance."},swords:{1:"Mental clarity and breakthrough. Truth cuts through confusion.",2:"Difficult decision or stalemate. Time to weigh options carefully.",3:"Heartbreak or painful truth. Necessary release brings healing.",4:"Rest and recovery. Taking time to recharge mentally.",5:"Conflict and defeat. Learning humility through challenge.",6:"Transition to calmer waters. Moving away from turmoil.",7:"Deception or strategy. Proceed with awareness and caution.",8:"Mental restriction. Breaking free from limiting beliefs.",9:"Anxiety and worry. Nightmares that lose power in daylight.",10:"Ending of a difficult cycle. Rock bottom becomes foundation."},cups:{1:"New emotional beginning. Opening your heart to love and connection.",2:"Partnership and mutual attraction. Harmony between two souls.",3:"Celebration and friendship. Joy shared multiplies.",4:"Emotional apathy or missed opportunity. Look beyond dissatisfaction.",5:"Loss and disappointment. Grief that teaches perspective.",6:"Nostalgia and innocence. Returning to simpler joys.",7:"Fantasy and illusion. Choose wisely between dreams and reality.",8:"Walking away from what no longer serves. Seeking deeper meaning.",9:"Emotional fulfillment and contentment. Wishes coming true.",10:"Lasting happiness and harmony. Love overflowing in all forms."},wands:{1:"Creative inspiration and new venture. Pure potential ready to ignite.",2:"Planning and vision. The world is yours to explore.",3:"Expansion and foresight. Leadership with strategic thinking.",4:"Celebration and homecoming. Achievement and stability.",5:"Competition and conflict. Challenges that test resolve.",6:"Victory and recognition. Success earned through effort.",7:"Standing your ground. Defense of values and boundaries.",8:"Swift action and momentum. Things moving quickly forward.",9:"Resilience and persistence. Last push before completion.",10:"Burden of responsibility. Strength to carry what must be carried."}},this.COURT_CARD_MEANINGS={pentacles:{Page:"Studious and practical messenger. New opportunities in material realm.",Knight:"Reliable and methodical worker. Steady progress toward goals.",Queen:"Nurturing and prosperous provider. Grounded in abundance.",King:"Master of material world. Wealth through wisdom and patience."},swords:{Page:"Curious and vigilant observer. Mental agility and truth-seeking.",Knight:"Swift and direct communicator. Action driven by intellect.",Queen:"Clear-minded and independent thinker. Wisdom through experience.",King:"Authoritative and analytical leader. Justice and mental mastery."},cups:{Page:"Sensitive and intuitive messenger. Emotional openness and creativity.",Knight:"Romantic and idealistic dreamer. Following the heart's calling.",Queen:"Compassionate and emotionally intelligent. Nurturing through love.",King:"Emotionally balanced and wise. Mastery of feelings and relationships."},wands:{Page:"Enthusiastic and adventurous explorer. Creative spark and potential.",Knight:"Passionate and impulsive adventurer. Bold action and courage.",Queen:"Confident and charismatic leader. Warmth and determination.",King:"Visionary and inspirational leader. Creative mastery and enterprise."}}}_seededRng(e){let t=e>>>0;return function(){t+=1831565813;let i=Math.imul(t^t>>>15,1|t);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296}}_todaySeed(){const e=new Date;return e.getFullYear()*1e4+(e.getMonth()+1)*100+e.getDate()}_drawDailyCard(){const e=this._buildFullDeck(),t=this._seededRng(this._todaySeed());this.state.dailyCard=e[Math.floor(t()*e.length)]}_drawAndRenderDaily(){this._drawDailyCard();const e=document.getElementById(`${this.roomId}DailyCardContainer`);e&&this.state.dailyCard&&(e.innerHTML=this._buildCardDisplay(this.state.dailyCard));const t=document.getElementById(`${this.roomId}EnrichedSections`);t&&this.state.dailyCard&&(t.innerHTML=this._getEnrichedHTML(this.state.dailyCard,!0)),requestAnimationFrame(()=>this._loadInterpretations())}_buildFullDeck(){return[...Array.from({length:22},(e,t)=>({type:"major",number:t,suit:"major"})),...this.suits.flatMap(e=>Array.from({length:14},(t,i)=>({type:i<10?"minor":"court",number:i+1,suit:e})))]}_shuffleDeck(e){const t=[...e];for(let i=t.length-1;i>0;i--){const o=Math.floor(Math.random()*(i+1));[t[i],t[o]]=[t[o],t[i]]}return t}getCardName(e,t="major"){return t==="major"?this.MAJOR_ARCANA_NAMES?.[e]??"The Fool":e<=10?`${e} of ${this.SUIT_NAMES[t]}`:`${this.COURT_RANKS[e]} of ${this.SUIT_NAMES[t]}`}getCardMeaning(e,t="major"){return t==="major"?this.MAJOR_ARCANA_MEANINGS?.[e]??"":e<=10?this.MINOR_ARCANA_MEANINGS?.[t]?.[e]??"":this.COURT_CARD_MEANINGS?.[t]?.[this.COURT_RANKS[e]]??""}getCardData(e,t="major"){if(!this._tarotData)return null;if(t==="major")return this._tarotData.majorArcana.find(o=>o.id===e)??null;if(e<=10)return(this._tarotData.minorArcana[t]??[]).find(o=>o.number===e)??null;const i=this.COURT_RANKS[e];return(this._tarotData.courtCards[t]??[]).find(o=>o.rank===i)??null}getCardImage(e,t="major"){const i=String(e).padStart(2,"0");if(t==="major")return`${this.TAROT_BASE_URL}${i}-${this.getCardName(e,"major").replace(/\s+/g,"")}.webp`;const o=t.charAt(0).toUpperCase()+t.slice(1);return`${this.TAROT_BASE_URL}${o}${i}.webp`}_buildCardDisplay(e){const i=this.getCardData(e.number,e.suit)?.title??"";return`
        <picture style="display:contents;">
          <source srcset="${this.getCardImage(e.number,e.suit)}" type="image/webp">
          <img width="280" height="480" loading="lazy" decoding="async" src="${this.getCardImage(e.number,e.suit).replace(".webp",".jpg")}"
               style="width:min(280px,100%);height:auto;border-radius:12px;box-shadow:var(--shadow);display:block;"
               alt="${this.getCardName(e.number,e.suit)}"
               onerror="this.src='${this.TAROT_BASE_URL}CardBacks.webp'">
        </picture>
        <h4 style="font-family:var(--serif);font-size:20px;margin:12px 0 4px;text-align:center;">${this.getCardName(e.number,e.suit)}</h4>
        ${i?`<p style="font-family:var(--serif);font-size:16px;font-weight:700;color:var(--text);text-align:center;margin:0;letter-spacing:.01em;">${i}</p>`:""}`}_getEnrichedHTML(e,t=!0){const i=`${e.suit}-${e.number}-${t}`;return this._enrichedCache[i]||(this._enrichedCache[i]=this._buildEnrichedSections(e,t)),this._enrichedCache[i]}_buildEnrichedSections(e,t=!0){const i=this.getCardData(e.number,e.suit);if(!i)return"";const o={pentacles:"Earth",swords:"Air",cups:"Water",wands:"Fire"},a={pentacles:"Physical",swords:"Mental",cups:"Emotional",wands:"Spiritual"},s={Air:"Air",Fire:"Fire",Water:"Water",Earth:"Earth"};let r=null,l=null;e.suit==="major"?r=s[i.correspondence]??null:(r=o[e.suit]??null,l=a[e.suit]??null);const c=(i.keywords||[]).map(g=>`<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${g}</span>`).join(""),d=[];i.astrology&&i.astrology!=="-"&&d.push({label:"Astrology",value:i.astrology}),r&&d.push({label:"Element",value:r}),l&&d.push({label:"Aspect",value:l}),i.treeOfLife&&d.push({label:"Tree of Life",value:i.treeOfLife});const u=d.map(g=>`
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${g.label}</div>
                <div style="font-size:13px;font-weight:500;">${g.value}</div>
            </div>`).join(""),m=(i.symbols||[]).map(g=>`<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${g}</li>`).join(""),p=this.roomId;return`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            ${i.narrative?`
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">${i.narrative}</p>
            </div>`:""}
            ${c?`
            <div style="margin-bottom:20px;${i.narrative?"padding-top:20px;border-top:1px solid var(--border);":""}">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${c}</div>
            </div>`:""}
            ${u?`
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:20px;">
                ${u}
            </div>`:""}
            <div style="display:flex;justify-content:center;gap:8px;margin-bottom:16px;">
                <button id="${p}UprightBtn"
                    onclick="window.TarotRoom._setMeaningTab('upright')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--accent);background:var(--accent);color:#fff;font-size:13px;font-weight:600;cursor:pointer;">
                    Upright
                </button>
                <button id="${p}ReversedBtn"
                    onclick="window.TarotRoom._setMeaningTab('reversed')"
                    style="padding:7px 20px;border-radius:20px;border:1px solid var(--border);background:transparent;color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;">
                    Reversed
                </button>
            </div>
            <div id="${p}MeaningText" style="text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;">${i.upright||""}</div>
            <div id="${p}MeaningTextReversed" style="display:none;text-align:center;font-size:15px;line-height:1.7;max-width:560px;margin:0 auto;color:var(--text-muted);">${i.reversed||""}</div>
            ${m?`
            <details style="margin-top:20px;border-top:1px solid var(--border);padding-top:16px;">
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;">
                    <span style="display:inline-block;">▶</span> Symbols Guide
                </summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">${m}</ul>
            </details>`:""}
        </div>
        ${i.mysticalQuestion||i.dailyQuestion?`
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">🔮 Today's Question</div>
            ${i.dailyQuestion?`<p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">${i.dailyQuestion}</p>`:""}
            ${i.mysticalQuestion?`<p style="font-size:13px;color:var(--text-muted);margin:10px auto 0;max-width:480px;font-style:italic;">Mystical: ${i.mysticalQuestion}</p>`:""}
        </div>`:""}
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Card Journal</div>
                <button onclick="window.TarotRoom._toggleJournalLog()" id="${p}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">Look closely at the card. What do you notice? Describe what you see — the characters, their posture, expression, actions. What colors stand out? Any symbols, objects, or small details that catch your eye? How does it make you feel?</p>
            <div id="${p}JournalForm">
                <textarea id="${p}JournalInput"
                    placeholder="e.g. A figure stands at the edge of a cliff, looking up… the colors feel warm and golden… I notice a small dog at their feet…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"></textarea>
                <button onclick="window.TarotRoom._saveJournalEntry()"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <div id="${p}JournalLog" style="display:none;">
                <div id="${p}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>
        ${t?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Interpretations</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line interpretation of today's card.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${p}InterpInput" type="text" maxlength="140"
                    aria-label="Your interpretation of this card"
                    placeholder="One line — what does this card say to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')window.TarotRoom._submitInterpretation()"
                />
                <button onclick="window.TarotRoom._submitInterpretation()"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${p}InterpList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading interpretations…</div>
            </div>
        </div>`:""}`}_setMeaningTab(e){const t=document.getElementById(`${this.roomId}UprightBtn`),i=document.getElementById(`${this.roomId}ReversedBtn`),o=document.getElementById(`${this.roomId}MeaningText`),a=document.getElementById(`${this.roomId}MeaningTextReversed`);t&&(e==="upright"?(t.style.background="var(--accent)",t.style.color="#fff",t.style.borderColor="var(--accent)",i.style.background="transparent",i.style.color="var(--text-muted)",i.style.borderColor="var(--border)",o.style.display="",a.style.display="none"):(i.style.background="var(--accent)",i.style.color="#fff",i.style.borderColor="var(--accent)",t.style.background="transparent",t.style.color="var(--text-muted)",t.style.borderColor="var(--border)",o.style.display="none",a.style.display=""))}_toggleJournalLog(){const e=document.getElementById(`${this.roomId}JournalLog`),t=document.getElementById(`${this.roomId}JournalForm`),i=document.getElementById(`${this.roomId}JournalLogBtn`);if(!e)return;const o=e.style.display!=="none";e.style.display=o?"none":"",t.style.display=o?"":"none",i.textContent=o?"View Log":"Write Entry",o||this._loadJournalLog()}async _saveJournalEntry(){const e=document.getElementById(`${this.roomId}JournalInput`),t=e?.value?.trim();if(!t){window.Core.showToast("Please write something first");return}const i=window.Core.state.currentUser,o=this.state.dailyCard,a=new Date().toISOString().slice(0,10);try{await h._sb.from("tarot_reflections").insert({user_id:i?.id,card_key:`${o.suit}-${o.number}`,card_name:this.getCardName(o.number,o.suit),date:a,reflection:t}),e.value="",window.Core.showToast("Saved to your journal ✨")}catch(s){console.warn("[TarotRoom] journal save failed",s),window.Core.showToast("Could not save — please try again")}}async _loadJournalLog(){const e=window.Core.state.currentUser,t=document.getElementById(`${this.roomId}JournalLogList`);if(!(!t||!e?.id)){t.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>';try{const{data:i,error:o}=await h._sb.from("tarot_reflections").select("id, card_name, date, reflection").eq("user_id",e.id).order("created_at",{ascending:!1}).limit(30);if(o)throw o;if(!i||i.length===0){t.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>';return}t.innerHTML=i.map(a=>`
                <div id="jr-${a.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escapeHtml(a.card_name||"")} · ${a.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.TarotRoom._editJournalEntry('${a.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.TarotRoom._deleteJournalEntry('${a.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="jr-text-${a.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escapeHtml(a.reflection)}</div>
                    <div id="jr-edit-${a.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escapeHtml(a.reflection)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.TarotRoom._saveEditedEntry('${a.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.TarotRoom._cancelEditEntry('${a.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join("")}catch(i){console.warn("[TarotRoom] load journal failed",i),t.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>'}}}_editJournalEntry(e){document.getElementById(`jr-text-${e}`)?.style&&(document.getElementById(`jr-text-${e}`).style.display="none"),document.getElementById(`jr-edit-${e}`)?.style&&(document.getElementById(`jr-edit-${e}`).style.display="")}_cancelEditEntry(e){document.getElementById(`jr-text-${e}`)?.style&&(document.getElementById(`jr-text-${e}`).style.display=""),document.getElementById(`jr-edit-${e}`)?.style&&(document.getElementById(`jr-edit-${e}`).style.display="none")}async _saveEditedEntry(e){const o=document.getElementById(`jr-edit-${e}`)?.querySelector("textarea")?.value?.trim();if(o)try{await h._sb.from("tarot_reflections").update({reflection:o}).eq("id",e);const a=document.getElementById(`jr-text-${e}`);a&&(a.textContent=o),this._cancelEditEntry(e),window.Core.showToast("Entry updated")}catch(a){console.warn("[TarotRoom] edit failed",a),window.Core.showToast("Could not update entry")}}async _deleteJournalEntry(e){try{await h._sb.from("tarot_reflections").delete().eq("id",e),document.getElementById(`jr-${e}`)?.remove(),window.Core.showToast("Entry deleted")}catch(t){console.warn("[TarotRoom] delete failed",t),window.Core.showToast("Could not delete entry")}}async _submitInterpretation(){const e=document.getElementById(`${this.roomId}InterpInput`),t=e?.value?.trim();if(!t)return;const i=window.Core.state.currentUser,o=this.state.dailyCard,a=new Date().toISOString().slice(0,10);try{await h._sb.from("tarot_interpretations").insert({user_id:i?.id,display_name:i?.display_name||i?.username||"A seeker",card_key:`${o.suit}-${o.number}`,date:a,interpretation:t}),e.value="",await this._loadInterpretations(),window.Core.showToast("Shared 🌀")}catch(s){console.warn("[TarotRoom] interpretation save failed",s),window.Core.showToast("Could not share — please try again")}}async _loadInterpretations(){const e=this.state.dailyCard,t=new Date().toISOString().slice(0,10),i=document.getElementById(`${this.roomId}InterpList`);if(!(!i||!e)){this._interpPurgedToday||(this._interpPurgedToday=!0,h._sb.from("tarot_interpretations").delete().lt("date",t).then(()=>{}));try{const{data:o,error:a}=await h._sb.from("tarot_interpretations").select("display_name, interpretation, created_at").eq("card_key",`${e.suit}-${e.number}`).eq("date",t).order("created_at",{ascending:!1}).limit(50);if(a)throw a;if(!o||o.length===0){i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share an interpretation.</div>';return}i.innerHTML=o.map(s=>`
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escapeHtml(s.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escapeHtml(s.interpretation)}</span>
                </div>`).join("")}catch(o){console.warn("[TarotRoom] load interpretations failed",o),i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load interpretations.</div>'}}}onPersonalTabEnter(){if(!this._personalTabHydrated){const e=document.getElementById(`${this.roomId}PersonalTab`);e&&(e.innerHTML=this._buildPersonalTab(),this._personalTabHydrated=!0)}this._personalDataLoaded||(this._loadDrawHistory(),this._loadMastery())}drawPersonalCard(){["Major","Minor","Court"].forEach(t=>{const i=document.getElementById(`${this.roomId}${t}Select`);i&&(i.value="")});const e=this._shuffleDeck(this.state.personalDeck);this._renderPersonalCard(e[0])}_renderPersonalCard(e){const t=document.getElementById(`${this.roomId}PersonalCardContainer`),i=document.getElementById(`${this.roomId}PersonalEnrichedSections`);t&&(t.innerHTML=this._buildCardDisplay(e)),i&&(i.innerHTML=this._getEnrichedHTML(e,!1)),t?.scrollIntoView({behavior:"smooth",block:"start"}),this._logDraw(e),this._personalDataLoaded=!1,this.state.currentTab==="personal"&&(this._loadDrawHistory(),this._loadMastery())}_cardKey(e){return e.suit==="major"?`major-${e.number}`:e.number<=10?`minor-${e.number}-${e.suit}`:`court-${e.number}-${e.suit}`}async _logDraw(e){if(!h._sb)return;const t=window.Core?.state?.currentUser;if(!t?.id)return;const i=this.getCardName(e.number,e.suit),o=e.suit==="major"?"major":e.number<=10?"minor":"court";try{await h._sb.from("tarot_draws").insert({user_id:t.id,card_key:this._cardKey(e),card_name:i,card_type:o})}catch(a){console.warn("[TarotRoom] logDraw failed",a)}}async _loadDrawHistory(){const e=document.getElementById(`${this.roomId}DrawHistory`);if(!e||!h._sb)return;const t=window.Core?.state?.currentUser;if(t?.id)try{const{data:i}=await h._sb.from("tarot_draws").select("card_name, card_type, drawn_at").eq("user_id",t.id).order("drawn_at",{ascending:!1}).limit(50);if(!i?.length){e.innerHTML='<span style="color:var(--text-muted);font-size:13px;">No cards drawn yet.</span>';return}const o={major:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>',minor:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',court:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M2 20h20"/><path d="m4 14 4-8 4 8 4-8 4 8"/></svg>'};e.innerHTML=i.map(a=>{const s=new Date(a.drawn_at).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"}),r=new Date(a.drawn_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
                <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:16px;">${o[a.card_type]||"🃏"}</span>
                        <span style="font-size:14px;font-weight:500;">${this._escapeHtml(a.card_name)}</span>
                    </div>
                    <span style="font-size:11px;color:var(--text-muted);white-space:nowrap;">${s} · ${r}</span>
                </div>`}).join(""),this._personalDataLoaded=!0}catch(i){console.warn("[TarotRoom] loadDrawHistory failed",i)}}async _loadMastery(){const e=document.getElementById(`${this.roomId}MasteryCount`),t=document.getElementById(`${this.roomId}MasteryProgress`),i=document.getElementById(`${this.roomId}MasteryCards`);if(!e||!h._sb)return;const o=window.Core?.state?.currentUser;if(o?.id)try{const{data:a}=await h._sb.from("tarot_draws").select("card_key").eq("user_id",o.id).eq("card_type","major"),s=new Set((a||[]).map(d=>d.card_key)),r=22,l=s.size,c=Math.round(l/r*100);if(e&&(e.textContent=`${l} / ${r}`),t&&(t.style.width=`${c}%`),i){const d=this.MAJOR_ARCANA_NAMES||{};i.innerHTML=Object.entries(d).map(([u,m])=>{const p=`major-${u}`,g=s.has(p);return`<span style="padding:3px 8px;border-radius:12px;font-size:12px;border:1px solid var(--border);
                        background:${g?"var(--neuro-accent)":"transparent"};
                        color:${g?"white":"var(--text-muted)"};
                        opacity:${g?"1":"0.6"};"
                        title="${m}">${g?"✓ ":""}${m}</span>`}).join("")}}catch(a){console.warn("[TarotRoom] loadMastery failed",a)}}async _clearDrawHistory(){if(!h._sb)return;const e=window.Core?.state?.currentUser;if(e?.id&&confirm("Clear your entire draw history? This cannot be undone."))try{await h._sb.from("tarot_draws").delete().eq("user_id",e.id),this._personalDataLoaded=!1,this._loadDrawHistory(),this._loadMastery(),window.Core.showToast("Draw history cleared")}catch(t){console.warn("[TarotRoom] clearDrawHistory failed",t)}}onEnter(){this.state.personalDeck.length||(this.state.personalDeck=this._buildFullDeck()),this._personalTabHydrated=!1,this._tarotDataReady?this._drawAndRenderDaily():this._pendingDailyRender=!0,this.initializeChat(),requestAnimationFrame(()=>document.querySelector(`#${this.roomId}View .tarot-main`)?.scrollTo(0,0))}getParticipantText(){return`${this.state.participants} seeking guidance`}buildCardFooter(){const e=this.state.dailyCard,t=e?this.getCardName(e.number,e.suit):null;return`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            ${t?`<span style="font-size:11px;color:var(--text-muted);">Daily Card: <strong style="color:var(--text);font-weight:600;">${t}</strong></span>`:""}
        </div>`}buildBody(){return`
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg> Solo Card Learning')}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTab()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTabPlaceholder()}</div>
                </div>
            </main>
        </div>`}_buildDailyTab(){return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="14" y2="14"/></svg> Daily Community Card</h3>
            <div id="${this.roomId}DailyCardContainer" style="display:flex;flex-direction:column;align-items:center;gap:16px;">
                <div style="color:var(--text-muted);font-size:14px;padding:40px;">Loading today's card…</div>
            </div>
        </div>
        <div id="${this.roomId}EnrichedSections"></div>
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer("daily","Share your thoughts on today's card...")}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML("Online Practitioners",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
        </div>`}_buildPersonalTabPlaceholder(){return`<div style="display:flex;align-items:center;justify-content:center;padding:60px 20px;">
            <div style="text-align:center;color:var(--text-muted);font-size:14px;">Loading Solo Card Learning…</div>
        </div>`}_buildPersonalTab(){const e=this.roomId,t=Object.entries(this.MAJOR_ARCANA_NAMES||{}).map(([d,u])=>`<option value="major:${d}">${u}</option>`).join(""),i=["pentacles","swords","cups","wands"],o={pentacles:"Pentacles",swords:"Swords",cups:"Cups",wands:"Wands"},a={1:"Ace",2:"Two",3:"Three",4:"Four",5:"Five",6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten"},s=i.map(d=>`<optgroup label="${o[d]}">${Array.from({length:10},(u,m)=>m+1).map(u=>`<option value="minor:${u}:${d}">${a[u]} of ${o[d]}</option>`).join("")}</optgroup>`).join(""),r={11:"Page",12:"Knight",13:"Queen",14:"King"},l=i.map(d=>`<optgroup label="${o[d]}">${Object.entries(r).map(([u,m])=>`<option value="court:${u}:${d}">${m} of ${o[d]}</option>`).join("")}</optgroup>`).join(""),c="width:100%;padding:10px 12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;cursor:pointer;";return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 24px 0;text-align:center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect x="2" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="14" height="18" rx="2"/></svg>
                Solo Card Learning
            </h3>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;">
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> Major Arcana</label>
                    <select id="${e}MajorSelect" style="${c}" data-action="personalSelectChange" data-source="major">
                        <option value="">— Select —</option>${t}
                    </select>
                </div>
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> Minor Arcana</label>
                    <select id="${e}MinorSelect" style="${c}" data-action="personalSelectChange" data-source="minor">
                        <option value="">— Select —</option>${s}
                    </select>
                </div>
                <div>
                    <label style="font-weight:700;font-size:15px;margin-bottom:6px;display:flex;align-items:center;gap:6px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M2 20h20"/><path d="m4 14 4-8 4 8 4-8 4 8"/></svg> Court Cards</label>
                    <select id="${e}CourtSelect" style="${c}" data-action="personalSelectChange" data-source="court">
                        <option value="">— Select —</option>${l}
                    </select>
                </div>
            </div>
            <div style="text-align:center;margin-bottom:24px;">
                <button type="button" data-action="drawPersonalCard"
                        style="display:inline-flex;align-items:center;gap:8px;padding:12px 28px;background:linear-gradient(135deg,var(--neuro-accent),var(--neuro-accent-light));color:white;border:none;border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:15px;letter-spacing:0.5px;box-shadow:var(--shadow-raised);">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg> Random Draw
                </button>
            </div>
            <div id="${e}PersonalCardContainer" style="display:flex;flex-direction:column;align-items:center;"></div>
            <div id="${e}PersonalEnrichedSections"></div>
            <div style="margin-top:32px;display:flex;flex-direction:column;gap:20px;">
                <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--background);">
                    <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Major Arcana Mastery</h4>
                    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
                        <span>Cards Discovered</span>
                        <span id="${e}MasteryCount">Loading…</span>
                    </div>
                    <div style="height:8px;border-radius:4px;background:var(--border);overflow:hidden;">
                        <div id="${e}MasteryProgress" style="height:100%;border-radius:4px;background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent-light));width:0%;transition:width 0.5s ease;"></div>
                    </div>
                    <div id="${e}MasteryCards" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;">
                        <span style="color:var(--text-muted);font-size:13px;">Loading…</span>
                    </div>
                </div>
                <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--background);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <h4 style="font-family:var(--serif);font-size:18px;margin:0;display:flex;align-items:center;gap:8px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg> Cards You've Drawn</h4>
                        <button type="button" data-action="clearDrawHistory" style="font-size:12px;color:var(--text-muted);background:none;border:1px solid var(--border);border-radius:var(--radius-md);padding:4px 10px;cursor:pointer;">Clear History</button>
                    </div>
                    <div id="${e}DrawHistory" style="max-height:260px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;">
                        <span style="color:var(--text-muted);font-size:13px;">No cards drawn yet.</span>
                    </div>
                </div>
            </div>
        </div>`}_onPersonalSelectChange(e){const t=this.roomId;["Major","Minor","Court"].forEach(s=>{if(s.toLowerCase()!==e){const r=document.getElementById(`${t}${s}Select`);r&&(r.value="")}});const i=document.getElementById(`${t}${e.charAt(0).toUpperCase()+e.slice(1)}Select`);if(!i?.value)return;const o=i.value.split(":");let a;o[0]==="major"?a={type:"major",number:parseInt(o[1]),suit:"major"}:o[0]==="minor"?a={type:"minor",number:parseInt(o[1]),suit:o[2]}:a={type:"court",number:parseInt(o[1]),suit:o[2]},this._renderPersonalCard(a)}getActions(){return{...super.getActions(),drawPersonalCard:()=>this.drawPersonalCard(),clearDrawHistory:()=>this._clearDrawHistory(),personalSelectChange:e=>this._onPersonalSelectChange(this._actionEl(e).dataset.source)}}getInstructions(){return`
            <p><strong>Daily guidance and personal card draws with community reflection.</strong></p>
            <h3>Two Types of Draws:</h3>
            <ul>
                <li>🌅 <strong>Daily Card</strong> - One shared card for the entire community each day. Resets at midnight.</li>
                <li>✨ <strong>Personal Draw</strong> - Your own card for specific questions.</li>
            </ul>
            <h3>How to Approach:</h3>
            <ul>
                <li>Approach with an open heart and curious mind</li>
                <li>There are no "bad" cards - only lessons and perspectives</li>
                <li>Your intuition matters more than memorized meanings</li>
                <li>Reflect deeply before sharing with the community</li>
            </ul>
            <h3>Guidelines:</h3>
            <ul>
                <li>Honor the sacred nature of divination</li>
                <li>Be respectful of others' interpretations</li>
                <li>Keep reflections authentic and thoughtful</li>
                <li>Avoid fortune-telling or predictions for others</li>
            </ul>`}}Object.assign(G.prototype,z);Object.assign(G.prototype,Z);const ye=new G;window.TarotRoom=ye;window.dispatchRoomReady?.("tarot");const Ne=Object.freeze(Object.defineProperty({__proto__:null,TarotRoom:G,tarotRoom:ye},Symbol.toStringTag,{value:"Module"}));class V extends y{constructor(){super({roomId:"reiki",roomType:"always-open",name:"Reiki Chakra Room",icon:"✨",description:"Daily chakra energy work aligned with the planetary cycle. Tune into your energy. Heal, balance, and flow.",energy:"Healing",imageUrl:"/Community/Reiki.webp",participants:15}),this.initChatState(["daily","personal"]),this._chakraDataReady=!1,this._energyPurgedToday=!1,this._chakraDisplayCache={},this._masteryLoaded=!1,this._personalTabHydrated=!1,this.state.currentDay=null,this.state.personalFocus=null,this.state.dailyImageIndex=0,this.state.personalImageIndex=0,this.state.currentTab="daily",this._initializeChakraData()}async _initializeChakraData(){this.DAY_MAP=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];try{const e=await fetch("/Data/chakra-data.json");e.ok?this.CHAKRA_SCHEDULE=await e.json():this._loadInlineChakraData()}catch{this._loadInlineChakraData()}this.state.currentDay=this.DAY_MAP[new Date().getDay()],this._buildChakraOptions(),this._chakraDataReady=!0,this.updateRoomCard()}_loadInlineChakraData(){this.CHAKRA_SCHEDULE={Monday:{key:"sacral",name:"Sacral Chakra - Svadhisthana",planet:"🌙 Moon",color:"Orange",theme:"Emotional flow, creativity, softness",element:"Water",sense:"Taste",symbol:"Lotus with 6 petals",endocrineGland:"Gonads (Sex glands)",bodyAreas:"Ovaries, testes, prostate, sexual organs, spleen, uterus, urinary bladder",location:"Two fingers below the navel.",visualization:"Sunrise, swimming in pure natural waters on full moon",keywords:["Emotions","creativity","flow","sexuality","relationships","self-worth","desires","empathy"],roleAndPurpose:"The second chakra is the center of our emotions and creativity. Through it, we begin to understand our responses to both our internal and external worlds. From here, we create through emotion and express it creatively to the outside world.",commonIssues:["Emotional repression","Dependency on others","Creative blocks","Kidney problems","Fertility issues"],fundamentalTruths:["I feel!","Honor your neighbors!"],guidedReflections:["Do I allow myself to fully feel my emotions, or do I suppress them to appear in control?","In what areas of life do I resist flow and spontaneity, and why?","How often do I create for the joy of creating, rather than for validation or outcome?"],image:"/Community/Chakras/Svadhistana1.webp",image2:"/Community/Chakras/Svadhistana2.webp",practice:["Gentle hip circles for 1 minute","Place hand on lower abdomen, breathe softly","Drink water slowly, noticing sensation","Move freely to music for 2 minutes","Write one sentence about how you feel right now","Stretch hips or lower back gently","Smile intentionally and hold it for 30 seconds","Take a warm shower mindfully","Name one thing you enjoy today","Say: I allow myself to feel"],practice2:["Rock pelvis forward and back while seated","Place warm hands on lower belly","Draw a simple shape or doodle","Notice one pleasant sensation in your body","Roll shoulders in slow circles","Stretch inner thighs lightly","Breathe into hips and lower back","Allow one emotion without judging it","Move hands like water for 1 minute","Say: I allow movement and change"],inquiry:"What am I feeling right now without judging it?"},Tuesday:{key:"root",name:"Root Chakra - Muladhara",planet:"♂️ Mars",color:"Bright red",theme:"Grounding, strength, action",element:"Earth",sense:"Smell",symbol:"Lotus with 4 petals",endocrineGland:"Adrenal glands",bodyAreas:"Kidneys, spine, large intestine, legs, bones",location:"At the base of the spine, between the genitals and the anus.",visualization:"Circulating blood, flowing lava at the center of the earth",keywords:["Physical","grounding","survival","security","stability","family","tribe","culture"],roleAndPurpose:"The role of the first chakra is the survival instinct in the physical world. It is connected to our primal emotions and programmed by the family, friends, and society in which we live.",commonIssues:["Addictions and uncontrollable desires","Nervous system problems","Poor blood circulation","Money and career issues"],fundamentalTruths:["I exist!","All is one!"],guidedReflections:["Do I feel safe existing as I am, without needing to prove or justify my worth?","Where in my life do I still operate out of fear of not having enough?","Do I trust life to provide for me, or do I feel I must constantly fight for survival?"],image:"/Community/Chakras/Muladhara1.webp",image2:"/Community/Chakras/Muladhara2.webp",practice:["Stand barefoot and feel your weight for 60 seconds","Slow inhale 4 sec, exhale 6 sec, 5 rounds","Name 3 things you can physically touch right now","Press feet firmly into the floor and tense legs for 10 sec","Eat something warm and simple with full attention","Walk slowly, feeling heel to toe contact","Place hands on lower belly and breathe","Clean or organize one small physical space","Sit and feel your spine connect to the ground","Say out loud: I am here, I am safe"],practice2:["Sit and press your feet into the floor for 30 seconds","Slow walk for 2 minutes without phone","Place a heavy object on your thighs and feel its weight","Eat one bite of food extremely slowly","Touch a solid surface and focus on texture","Stand and shift weight side to side","Tense entire body for 5 sec, release completely","Notice 3 red things around you","Visualize roots growing from your feet","Say: I am grounded and stable"],inquiry:"What concrete action strengthens my life today?"},Wednesday:{key:"throat",name:"Throat Chakra - Vishuddha",planet:"☿ Mercury",color:"Light blue, silver, blue-green",theme:"Truth, expression, clarity",element:"Ether (Space)",sense:"Hearing",symbol:"Lotus with 16 petals",endocrineGland:"Thyroid",bodyAreas:"Throat, bronchi, voice mechanism, lungs, digestive tract, mouth",location:"Throat.",visualization:"Blue clear skies, sky reflections on calm water",keywords:["Truth","courage","voice","communication","judgment","acceptance","trust"],roleAndPurpose:"The fifth chakra is our communication center and the foundation for creating our future and self-protection. Through it, we express our thoughts, feelings, and what we want and need.",commonIssues:['Inability to say "no" or "yes"',"Feeling victimized","Lack of assertiveness","Throat and jaw problems"],fundamentalTruths:["I feel, think, and express with love!","Surrender your will to the divine will!"],guidedReflections:["Do I express my truth openly, or do I censor myself to avoid conflict?","How often do I truly listen — not just hear — what others are saying?","What unspoken truths have been living in my throat, waiting to be released?"],image:"/Community/Chakras/Vissudha1.webp",image2:"/Community/Chakras/Vissudha2.webp",practice:["Take a deep breath and sigh out loud","Hum gently for 1 minute","Speak one honest sentence aloud","Roll shoulders and relax neck","Drink water mindfully","Write one thing you want to say but haven't","Sing one line of a song","Place hand on throat and breathe","Speak slower than usual for one minute","Say: My voice matters"],practice2:["Make any sound for 30 seconds","Gently massage your neck","Write and read aloud one true statement",'Practice saying "no" out loud',"Stretch your jaw wide, then relax","Whisper, then speak normally","Notice when you hold back words","Gargle water mindfully","Speak your name clearly 3 times","Say: I express my truth"],inquiry:"What truth wants to be spoken or written?"},Thursday:{key:"third-eye",name:"Third Eye Chakra - Ajna",planet:"♃ Jupiter",color:"Bright dark blue, transparent indigo",theme:"Intuition, vision, insight",element:"Light",sense:"All senses including supernatural senses",symbol:"Lotus with 96 petals",endocrineGland:"Pituitary",bodyAreas:"Lower brain, left eye, ears, nose, nervous system",location:"Center of the forehead, one finger above the eyebrows.",visualization:"Starry night skies, celestial bodies, galaxies",keywords:["Imagination","visualization","intuition","manifestation","creation","vision"],roleAndPurpose:"The sixth chakra is our center of vision — both inner and outer. Through it, we see reality and broadcast images and visions that represent our reality.",commonIssues:["Difficulty planning the future","Underdeveloped imagination","Vision problems","Hormonal imbalance"],fundamentalTruths:["I feel, think, and express my vision with love!","Seek only the truth!"],guidedReflections:["How clearly do I see my life direction right now?","Do I trust my intuition as a valid source of truth, or do I dismiss it?","How connected do I feel to my inner wisdom and higher guidance?"],image:"/Community/Chakras/Ajna1.webp",image2:"/Community/Chakras/Ajna2.webp",practice:["Focus on space between eyebrows","Close eyes and look inward","Trust your intuition on one decision","Meditate in darkness for 5 minutes","Notice synchronicities today","Visualize indigo light at third eye","Ask a question and listen for inner answer","Practice seeing with eyes closed","Trust your first instinct","Say: I see clearly"],practice2:["Gently press center of forehead","Imagine opening inner eye","Write down one intuitive hit","Notice patterns in your life","Practice visualization","Breathe indigo light through third eye","Trust gut feelings","Observe dreams and symbols","Release need to understand everything","Say: My intuition guides me"],inquiry:"What does my intuition know that my mind doesn't?"},Friday:{key:"heart",name:"Heart Chakra - Anahata",planet:"♀ Venus",color:"Bright green, bright pink, gold",theme:"Love, compassion, connection",element:"Air",sense:"Touch",symbol:"Lotus with 12 petals",endocrineGland:"Thymus",bodyAreas:"Heart, circulatory system, arms, hands",location:"Center of the chest, heart area.",visualization:"Green and blooming nature, plant blossoms, pink and endless skies",keywords:["Universal love","compassion","mercy","giving","balance","calm","integration"],roleAndPurpose:"The fourth chakra is our heart center and the point of balance. Its role is to combine the lessons of the other chakras, blend them with universal love and compassion, and radiate this energy outward from a stable place.",commonIssues:["Difficulties in relationships","Inability to give and receive love","Heart problems","Lung problems"],fundamentalTruths:["I feel and think with love!","Love is the divine power!"],guidedReflections:["Do I allow myself to receive love as easily as I give it?","How easily do I forgive myself and others?","What would change if I chose to let love, not fear, guide every decision?"],image:"/Community/Chakras/Anahata1.webp",image2:"/Community/Chakras/Anahata2.webp",practice:["Place both hands on your heart","Take 3 deep breaths into your chest","Think of someone you love","Hug yourself gently","Smile at your reflection","Write one thing you appreciate about yourself","Send a kind message to someone","Stretch arms wide and open chest","Notice something beautiful around you","Say: I am worthy of love"],practice2:["Press palms together at heart center","Breathe green light into chest","Forgive yourself for one small thing","List 3 people/things you're grateful for","Give yourself a compliment out loud","Visualize someone you care about happy","Place hand on heart and feel it beat","Do one act of kindness","Open arms wide and breathe deeply","Say: Love flows through me"],inquiry:"Where can I offer more compassion today - to myself or others?"},Saturday:{key:"crown",name:"Crown Chakra - Sahasrara",planet:"♄ Saturn",color:"Pure white, bright light, purple",theme:"Awareness, unity, transcendence",element:"Beyond element",sense:"Beyond sense",symbol:"Lotus with 1,000 petals",endocrineGland:"Pineal",bodyAreas:"Upper brain, right eye, cerebral cortex, central nervous system",location:"Top of the head, crown of the skull.",visualization:"Peak of a very high snowy mountain",keywords:["Cosmic consciousness","unity","wholeness","transcendence","inspiration","spiritual development"],roleAndPurpose:"The seventh chakra is our divinity center. It centralizes streams of high spiritual energy and our role and mission in this life.",commonIssues:["Lack of direction","Dizziness","Feelings of disconnection","Deep depression","Learning disabilities"],fundamentalTruths:["I feel, think, and express the vision of a higher purpose with love!","Live in the moment!"],guidedReflections:["How connected do I feel to a higher source or divine presence in my daily life?","Do I trust that my life has a meaningful purpose?","How can I embody the awareness that I am not separate from the universe?"],image:"/Community/Chakras/Sahasrara1.webp",image2:"/Community/Chakras/Sahasrara2.webp",practice:["Sit in silence for 3 minutes","Focus awareness at crown of head","Notice thoughts without following them","Breathe white or violet light","Feel connection to something larger","Practice gratitude for consciousness itself","Observe without judgment for 2 minutes","Visualize light entering crown","Rest in pure awareness","Say: I am connected to all that is"],practice2:["Meditate on infinite space","Gently touch top of head","Imagine boundaries dissolving","Breathe as if the universe breathes you","Notice awareness of being aware","Feel unity with all beings","Rest in stillness and openness","Visualize violet light at crown","Simply be, without doing","Say: I am one with everything"],inquiry:"What is awareness itself noticing right now?"},Sunday:{key:"solar",name:"Solar Plexus Chakra - Manipura",planet:"☉ Sun",color:"Bright yellow",theme:"Confidence, direction, expansion",element:"Fire",sense:"Sight",symbol:"Lotus with 10 petals",endocrineGland:"Pancreas",bodyAreas:"Stomach, liver, gallbladder, nervous system",location:"Two fingers above the navel.",visualization:"Gentle rays of the sun, a rich yellow wheat field",keywords:["Thoughts","intellect","ego","personal power","will","self-control","self-expression"],roleAndPurpose:'The third chakra is the mental power center, responsible for our opinions, beliefs, self-esteem and self-confidence. It acts as an "energy pump" for the physical body and subtle bodies.',commonIssues:["Power struggles","Anger","Resentment","Digestive and metabolic problems","Weight issues"],fundamentalTruths:["I feel and think!","Honor yourself!"],guidedReflections:["Do I trust myself to make the right decisions, or do I constantly seek external approval?","Where in my life do I give away my power, and why do I allow it?","What would my life look like if I fully trusted my inner fire?"],image:"/Community/Chakras/Manipura1.webp",image2:"/Community/Chakras/Manipura2.webp",practice:["Stand tall and open your chest for 30 seconds","Take 5 strong belly breaths","Place hand above navel and feel warmth","Do one small task you have been avoiding","Sit upright and feel your core engaged","Say your name out loud with confidence","Visualize a warm yellow light in your belly","Clench fists, release slowly, repeat 3 times","Make one clear decision today","Say: I trust myself"],practice2:["Stand in a power pose for 1 minute","Laugh out loud for 15 seconds","List 3 things you're good at","Breathe fire breath (quick exhales)","Straighten your posture fully","Make strong eye contact with yourself in mirror","Do 5 confident shoulder rolls","Visualize golden light expanding from core","Complete one unfinished task","Say: I am powerful and capable"],inquiry:"Where am I ready to step up or expand?"}}}_buildChakraOptions(){const e={root:"Tuesday",sacral:"Monday",solar:"Sunday",heart:"Friday",throat:"Wednesday","third-eye":"Thursday",crown:"Saturday"};this.CHAKRA_OPTIONS=[{value:"root",label:"Root Chakra",image:"/Community/Chakras/Muladhara1.jpg",image2:"/Community/Chakras/Muladhara2.webp"},{value:"sacral",label:"Sacral Chakra",image:"/Community/Chakras/Svadhistana1.jpg",image2:"/Community/Chakras/Svadhistana2.webp"},{value:"solar",label:"Solar Plexus",image:"/Community/Chakras/Manipura1.jpg",image2:"/Community/Chakras/Manipura2.webp"},{value:"heart",label:"Heart Chakra",image:"/Community/Chakras/Anahata1.jpg",image2:"/Community/Chakras/Anahata2.webp"},{value:"throat",label:"Throat Chakra",image:"/Community/Chakras/Vissudha1.jpg",image2:"/Community/Chakras/Vissudha2.webp"},{value:"third-eye",label:"Third Eye",image:"/Community/Chakras/Ajna1.jpg",image2:"/Community/Chakras/Ajna2.webp"},{value:"crown",label:"Crown Chakra",image:"/Community/Chakras/Sahasrara1.jpg",image2:"/Community/Chakras/Sahasrara2.webp"}],this.CHAKRA_OPTIONS.forEach(t=>{const i=e[t.value];if(i&&this.CHAKRA_SCHEDULE[i]){const o=this.CHAKRA_SCHEDULE[i];t.practices=o.practice,t.practices2=o.practice2,t.inquiry=o.inquiry,["name","planet","color","theme","element","sense","symbol","endocrineGland","bodyAreas","location","visualization","keywords","roleAndPurpose","commonIssues","fundamentalTruths","guidedReflections"].forEach(a=>{o[a]!==void 0&&(t[a]=t[a]??o[a])})}})}getParticipantText(){return`${this.state.participants} healing together`}buildCardFooter(){if(!this._chakraDataReady||!this.state.currentDay)return`<div style="text-align:left;"><span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span></div>`;const e=this.CHAKRA_SCHEDULE[this.state.currentDay],t=e?.name?.split(" - ")[0]??e?.name??"";return`
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px;">
            <span class="room-participants" style="font-size:12px;color:var(--text-muted);">${this.getParticipantText()}</span>
            <span style="font-size:11px;color:var(--text-muted);">Daily Chakra: <strong style="color:var(--text);font-weight:600;">${t}</strong></span>
        </div>`}onPersonalTabEnter(){if(!this._personalTabHydrated){const e=document.getElementById(`${this.roomId}PersonalTab`);e&&(e.innerHTML=this._buildPersonalTab(),this._personalTabHydrated=!0)}this._masteryLoaded||this._loadChakraMastery()}_stepDailyImage(e){this.state.dailyImageIndex=(this.state.dailyImageIndex+e+2)%2;const t=this.CHAKRA_SCHEDULE?.[this.state.currentDay],i=document.getElementById(`${this.roomId}DailyCarouselImg`);i&&t&&(i.src=this.state.dailyImageIndex===0?t.image:t.image2)}nextDailyImage(){this._stepDailyImage(1)}previousDailyImage(){this._stepDailyImage(-1)}_stepPersonalImage(e){this.state.personalImageIndex=(this.state.personalImageIndex+e+2)%2;const t=this.CHAKRA_OPTIONS?.find(o=>o.value===this.state.personalFocus),i=document.getElementById(`${this.roomId}PersonalCarouselImg`);i&&t&&(i.src=this.state.personalImageIndex===0?t.image:t.image2)}nextPersonalImage(){this._stepPersonalImage(1)}previousPersonalImage(){this._stepPersonalImage(-1)}startPersonalSession(){if(!this._chakraDataReady){window.Core.showToast("Loading chakra data, please wait…");return}const e=document.getElementById(`${this.roomId}PersonalFocus`)?.value;if(!e){window.Core.showToast("Please select a focus");return}this.state.personalFocus=e,this.state.personalImageIndex=0;const t=this.CHAKRA_OPTIONS.find(o=>o.value===e),i=document.getElementById(`${this.roomId}PersonalSession`);i&&(i.style.display="block",i.innerHTML=this._getChakraDisplayHTML(t,0,!1,!1),window.Core.showToast(`${t.label} session started`))}_getChakraDisplayHTML(e,t,i=!1,o=!1){const a=`${e.key}-${i?"daily":"personal"}-${o}`;return this._chakraDisplayCache[a]||(this._chakraDisplayCache[a]=this.buildChakraDisplay(e,t,i,o)),this._chakraDisplayCache[a]}buildChakraDisplay(e,t,i=!1,o=!1){const a=t===0?e.image:e.image2,s=(e.keywords||[]).map(g=>`<span style="display:inline-block;padding:4px 12px;border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--text-muted);margin:3px 4px;white-space:nowrap;">${g}</span>`).join(""),l=[{label:"Planet",value:e.planet},{label:"Element",value:e.element},{label:"Color",value:e.color},{label:"Symbol",value:e.symbol},{label:"Sense",value:e.sense},{label:"Location",value:e.location},{label:"Body Areas",value:e.bodyAreas},{label:"Gland",value:e.endocrineGland}].filter(g=>g.value).map(g=>`
            <div style="text-align:center;min-width:80px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);margin-bottom:3px;font-weight:700;">${g.label}</div>
                <div style="font-size:13px;font-weight:500;">${g.value}</div>
            </div>`).join(""),c=(e.commonIssues||[]).map(g=>`<li style="margin:6px 0;font-size:14px;color:var(--text-muted);line-height:1.5;">${g}</li>`).join(""),d=(e.guidedReflections||[]).map(g=>`<li style="margin:8px 0;font-size:14px;line-height:1.6;color:var(--text);">${g}</li>`).join(""),u=this.roomId,m=i?"daily":"personal",p=i?"Daily":"Personal";return`
        <div style="text-align:center;margin-bottom:24px;display:flex;align-items:center;justify-content:center;gap:8px;">
            <button type="button" data-action="prevChakraImage" data-scope="${m}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">‹</button>
            <img width="500" height="400" id="${u}${p}CarouselImg"
                 src="${a}" alt="${e.name}" loading="lazy" decoding="async"
                 style="max-width:min(500px,calc(100% - 100px));width:100%;height:auto;border-radius:var(--radius-md);box-shadow:0 4px 12px rgba(0,0,0,0.1);display:block;flex:1 1 auto;min-width:0;">
            <button type="button" data-action="nextChakraImage" data-scope="${m}" style="background:var(--surface);border:2px solid var(--border);border-radius:50%;width:40px;height:40px;min-width:40px;cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">›</button>
        </div>
        <h4 style="font-family:var(--serif);font-size:20px;margin:0 0 20px;text-align:center;">${e.name}</h4>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            ${e.roleAndPurpose?`
            <div style="text-align:center;margin-bottom:20px;">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:10px;">Represents</div>
                <p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--text-muted);max-width:560px;margin:0 auto;">${e.roleAndPurpose}</p>
            </div>`:""}
            ${e.theme?`
            <div style="text-align:center;margin-bottom:20px;padding-top:16px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">Theme</div>
                <p style="font-size:14px;font-weight:600;color:var(--text);margin:0;">${e.theme}</p>
            </div>`:""}
            ${s?`
            <div style="margin-bottom:20px;padding-top:20px;border-top:1px solid var(--border);">
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;text-align:center;margin-bottom:8px;">Keywords</div>
                <div style="display:flex;flex-wrap:wrap;justify-content:center;">${s}</div>
            </div>`:""}
            ${l?`
            <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;padding:16px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
                ${l}
            </div>`:""}
        </div>
        ${e.fundamentalTruths?.length||e.visualization?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:16px;text-align:center;">Fundamental Truths</div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${(e.fundamentalTruths||[]).map(g=>`<p style="font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.7;margin:0;text-align:center;color:var(--text);">"${g}"</p>`).join("")}
                ${e.visualization?`
                <div style="margin-top:8px;padding-top:12px;border-top:1px solid var(--border);">
                    <div style="font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--text-muted);font-weight:700;margin-bottom:6px;text-align:center;">Visualization</div>
                    <p style="font-size:14px;color:var(--text-muted);text-align:center;margin:0;font-style:italic;">${e.visualization}</p>
                </div>`:""}
            </div>
        </div>`:""}
        ${c||d?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;display:flex;flex-direction:column;gap:8px;">
            ${c?`
            <details>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;"><span>▶</span> Common Issues</summary>
                <ul style="margin:12px 0 0 0;padding:0 0 0 4px;list-style:none;">${c}</ul>
            </details>`:""}
            ${d?`
            <details ${c?'style="border-top:1px solid var(--border);padding-top:8px;"':""}>
                <summary style="cursor:pointer;font-size:13px;font-weight:600;letter-spacing:.04em;color:var(--text-muted);text-transform:uppercase;list-style:none;display:flex;align-items:center;gap:6px;"><span>▶</span> Guided Reflections for Clarity &amp; Growth</summary>
                <p style="font-size:13px;color:var(--text-muted);margin:10px 0 12px 0;line-height:1.6;font-style:italic;">Take a few moments to reflect on each question. Let your answers flow naturally, without overthinking or judgment.</p>
                <ul style="margin:0;padding:0;list-style:none;">${d}</ul>
            </details>`:""}
        </div>`:""}
        ${e.inquiry?`
        <div style="background:var(--surface);border:1px solid var(--accent);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;text-align:center;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);font-weight:700;margin-bottom:12px;">${i?"Today's":"Guiding"} Inquiry</div>
            <p style="font-family:var(--serif);font-size:17px;line-height:1.7;margin:0 auto;max-width:520px;">"${e.inquiry}"</p>
        </div>`:""}
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;">📓 Chakra Journal</div>
                <button type="button" data-action="toggleChakraJournal" data-prefix="${p}"
                    id="${u}${p}JournalLogBtn"
                    style="font-size:12px;color:var(--accent);background:none;border:none;cursor:pointer;padding:0;font-weight:600;">View Log</button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 14px 0;line-height:1.6;">Sit with this chakra's energy for a moment. What do you notice in your body? What emotions or thoughts arise? How does this energy center feel in your life right now?</p>
            <div id="${u}${p}JournalForm">
                <textarea id="${u}${p}JournalInput"
                    placeholder="e.g. I notice tension in my chest… this chakra feels blocked lately… I'm drawn to the color ${e.color}…"
                    style="width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;line-height:1.6;resize:vertical;min-height:110px;font-family:inherit;"></textarea>
                <button type="button" data-action="saveChakraJournal"
                    data-prefix="${p}" data-key="${e.key}"
                    style="margin-top:10px;padding:9px 22px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;">
                    Save to Journal
                </button>
            </div>
            <div id="${u}${p}JournalLog" style="display:none;">
                <div id="${u}${p}JournalLogList" style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;"></div>
            </div>
        </div>
        ${o?`
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:12px;">
            <div style="font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);font-weight:700;margin-bottom:6px;">🌀 Community Energy</div>
            <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px 0;">Share a one-line reflection on today's chakra energy.</p>
            <div style="display:flex;gap:8px;margin-bottom:16px;">
                <input id="${u}EnergyInput" type="text" maxlength="140"
                    aria-label="Your energy intention"
                    placeholder="One line — what does this chakra energy mean to you today?"
                    style="flex:1;min-width:0;padding:9px 12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--text);font-size:14px;font-family:inherit;"
                    onkeydown="if(event.key==='Enter')document.getElementById('${u}EnergyShareBtn')?.click()"
                />
                <button type="button" id="${u}EnergyShareBtn" data-action="submitCommunityEnergy"
                    style="padding:9px 18px;border:1px solid var(--accent);background:var(--accent);color:#fff;border-radius:var(--radius-md);font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;flex-shrink:0;">
                    Share
                </button>
            </div>
            <div id="${u}EnergyList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;">
                <div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>
            </div>
        </div>`:""}`}buildBody(){return`
        <div class="ps-body" style="display:flex;">
            <main class="tarot-main" style="flex:1;padding:24px;overflow-y:auto;display:flex;justify-content:center;align-items:flex-start;">
                <div style="width:100%;">
                    ${this.buildTabNav(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg> Today's Collective Energy`,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work')}
                    <div id="${this.roomId}DailyTab"    style="display:block;">${this._buildDailyTabSkeleton()}</div>
                    <div id="${this.roomId}PersonalTab" style="display:none;">${this._buildPersonalTabPlaceholder()}</div>
                </div>
            </main>
        </div>`}_buildDailyTabSkeleton(){return`
        <div id="${this.roomId}DailyTabContent" style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:24px 16px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;">Today's Collective Energy</h3>
            <div style="display:flex;align-items:center;justify-content:center;padding:48px 0;">
                <div style="color:var(--text-muted);font-size:14px;">Loading today's focus…</div>
            </div>
        </div>
        <div id="${this.roomId}DailyChatSection" style="display:none;background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:12px 8px 24px;" class="tarot-daily-grid">
            <div>
                <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 8px 0;text-align:center;">Community Discussion</h4>
                <div style="display:flex;flex-direction:column;height:100%;">
                    ${this.buildChatContainer("daily","Share your thoughts on today's chakra...")}
                </div>
            </div>
            ${this.buildParticipantSidebarHTML("Online Lightworkers",`${this.roomId}ParticipantListEl`,`${this.roomId}ParticipantCount`,"auto")}
        </div>`}_buildPersonalTabPlaceholder(){return`<div style="display:flex;align-items:center;justify-content:center;padding:60px 20px;">
            <div style="text-align:center;color:var(--text-muted);font-size:14px;">Loading Solo Chakra Work…</div>
        </div>`}_buildPersonalTab(){return`
        <div style="background:var(--surface);border:2px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:16px;">
            <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> Solo Chakra Work</h3>
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;font-weight:600;">Choose Your Focus:</label>
                <select id="${this.roomId}PersonalFocus"
                        style="width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-md);background:var(--background);font-size:14px;">
                    <option value="">Select a chakra...</option>
                    ${(this.CHAKRA_OPTIONS||[]).map(e=>`<option value="${e.value}">${e.label}</option>`).join("")}
                </select>
            </div>
            <button type="button" data-action="startPersonalSession"
                    style="width:100%;padding:14px;border:2px solid var(--border);background:var(--surface);border-radius:var(--radius-md);cursor:pointer;font-weight:600;font-size:16px;">
                Begin Session
            </button>
            <div id="${this.roomId}PersonalSession" style="margin-top:24px;display:none;"></div>
        </div>
        <div style="border:2px solid var(--border);border-radius:var(--radius-lg);padding:20px;background:var(--surface);margin-top:16px;">
            <h4 style="font-family:var(--serif);font-size:18px;margin:0 0 16px 0;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:16px;height:16px;vertical-align:middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Chakra Mastery
            </h4>
            <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);margin-bottom:6px;">
                <span>Chakras Explored</span>
                <span id="${this.roomId}MasteryCount">Loading…</span>
            </div>
            <div style="height:8px;border-radius:4px;background:var(--border);overflow:hidden;margin-bottom:16px;">
                <div id="${this.roomId}MasteryProgress" style="height:100%;border-radius:4px;background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent-light));width:0%;transition:width 0.5s ease;"></div>
            </div>
            <div id="${this.roomId}MasteryChakras" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
                <span style="color:var(--text-muted);font-size:13px;">Loading…</span>
            </div>
        </div>`}_toggleChakraJournalLog(e){const t=this.roomId,i=document.getElementById(`${t}${e}JournalLog`),o=document.getElementById(`${t}${e}JournalForm`),a=document.getElementById(`${t}${e}JournalLogBtn`);if(!i)return;const s=i.style.display!=="none";i.style.display=s?"none":"",o.style.display=s?"":"none",a.textContent=s?"View Log":"Write Entry",s||this._loadChakraJournalLog(e)}async _saveChakraJournalEntry(e,t){const i=this.roomId,o=document.getElementById(`${i}${e}JournalInput`),a=o?.value?.trim();if(!a){window.Core.showToast("Please write something first");return}const s=window.Core.state.currentUser,r=new Date().toISOString().slice(0,10),c=Object.values(this.CHAKRA_SCHEDULE||{}).find(d=>d.key===t)?.name||t;try{await h._sb.from("reiki_sessions").insert({user_id:s?.id,chakra_key:t,chakra_name:c,date:r,entry:a}),o.value="",window.Core.showToast("Saved to your chakra journal ✨"),this._masteryLoaded=!1,e==="Personal"&&this._loadChakraMastery()}catch(d){console.warn("[ReikiRoom] journal save failed",d),window.Core.showToast("Could not save — please try again")}}async _loadChakraJournalLog(e){const t=this.roomId,i=window.Core.state.currentUser,o=document.getElementById(`${t}${e}JournalLogList`);if(!(!o||!i?.id)){o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Loading…</div>';try{const{data:a,error:s}=await h._sb.from("reiki_sessions").select("id, chakra_name, date, entry").eq("user_id",i.id).order("created_at",{ascending:!1}).limit(30);if(s)throw s;if(!a||a.length===0){o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">No journal entries yet.</div>';return}o.innerHTML=a.map(r=>`
                <div id="rj-${r.id}" style="background:var(--background);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:12px;font-weight:600;color:var(--accent);">${this._escapeHtml(r.chakra_name||"")} · ${r.date}</span>
                        <div style="display:flex;gap:10px;">
                            <button onclick="window.ReikiRoom._editSessionEntry('${r.id}')" style="font-size:12px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0;">Edit</button>
                            <button onclick="window.ReikiRoom._deleteSessionEntry('${r.id}')" style="font-size:12px;color:#e57373;background:none;border:none;cursor:pointer;padding:0;">Delete</button>
                        </div>
                    </div>
                    <div id="rj-text-${r.id}" style="font-size:14px;line-height:1.6;color:var(--text);">${this._escapeHtml(r.entry)}</div>
                    <div id="rj-edit-${r.id}" style="display:none;">
                        <textarea style="width:100%;box-sizing:border-box;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);font-size:14px;line-height:1.5;resize:vertical;min-height:80px;font-family:inherit;margin-top:8px;">${this._escapeHtml(r.entry)}</textarea>
                        <div style="display:flex;gap:8px;margin-top:6px;">
                            <button onclick="window.ReikiRoom._saveEditedEntry('${r.id}')" style="padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;">Save</button>
                            <button onclick="window.ReikiRoom._cancelEditEntry('${r.id}')" style="padding:5px 14px;background:none;border:1px solid var(--border);border-radius:var(--radius-md);font-size:13px;cursor:pointer;color:var(--text-muted);">Cancel</button>
                        </div>
                    </div>
                </div>`).join("")}catch(a){console.warn("[ReikiRoom] load journal failed",a),o.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load journal.</div>'}}}_editSessionEntry(e){document.getElementById(`rj-text-${e}`)?.style&&(document.getElementById(`rj-text-${e}`).style.display="none"),document.getElementById(`rj-edit-${e}`)?.style&&(document.getElementById(`rj-edit-${e}`).style.display="")}_cancelEditEntry(e){document.getElementById(`rj-text-${e}`)?.style&&(document.getElementById(`rj-text-${e}`).style.display=""),document.getElementById(`rj-edit-${e}`)?.style&&(document.getElementById(`rj-edit-${e}`).style.display="none")}async _saveEditedEntry(e){const o=document.getElementById(`rj-edit-${e}`)?.querySelector("textarea")?.value?.trim();if(o)try{await h._sb.from("reiki_sessions").update({entry:o}).eq("id",e);const a=document.getElementById(`rj-text-${e}`);a&&(a.textContent=o),this._cancelEditEntry(e),window.Core.showToast("Entry updated")}catch(a){console.warn("[ReikiRoom] edit failed",a),window.Core.showToast("Could not update entry")}}async _deleteSessionEntry(e){try{await h._sb.from("reiki_sessions").delete().eq("id",e),document.getElementById(`rj-${e}`)?.remove(),window.Core.showToast("Entry deleted")}catch(t){console.warn("[ReikiRoom] delete failed",t),window.Core.showToast("Could not delete entry")}}async _submitCommunityEnergy(){const e=document.getElementById(`${this.roomId}EnergyInput`),t=e?.value?.trim();if(!t)return;const i=window.Core.state.currentUser,o=this.CHAKRA_SCHEDULE[this.state.currentDay],a=new Date().toISOString().slice(0,10);try{await h._sb.from("reiki_shares").insert({user_id:i?.id,display_name:i?.display_name||i?.username||i?.name||"A seeker",chakra_key:o?.key,date:a,share:t}),e.value="",await this._loadCommunityEnergy(),window.Core.showToast("Shared 🌀")}catch(s){console.warn("[ReikiRoom] community energy save failed",s),window.Core.showToast("Could not share — please try again")}}async _loadCommunityEnergy(){const e=this.CHAKRA_SCHEDULE[this.state.currentDay],t=new Date().toISOString().slice(0,10),i=document.getElementById(`${this.roomId}EnergyList`);if(!(!i||!e)){this._energyPurgedToday||(this._energyPurgedToday=!0,h._sb.from("reiki_shares").delete().lt("date",t).then(()=>{}));try{const{data:o,error:a}=await h._sb.from("reiki_shares").select("display_name, share, created_at").eq("chakra_key",e.key).eq("date",t).order("created_at",{ascending:!1}).limit(50);if(a)throw a;if(!o||o.length===0){i.innerHTML=`<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Be the first to share today's energy.</div>`;return}i.innerHTML=o.map(s=>`
                <div style="display:flex;gap:10px;align-items:baseline;padding:8px 10px;background:var(--background);border-radius:var(--radius-md);border:1px solid var(--border);">
                    <span style="font-size:12px;font-weight:600;color:var(--accent);white-space:nowrap;flex-shrink:0;">${this._escapeHtml(s.display_name)}</span>
                    <span style="font-size:14px;line-height:1.5;color:var(--text);">${this._escapeHtml(s.share)}</span>
                </div>`).join("")}catch(o){console.warn("[ReikiRoom] load community energy failed",o),i.innerHTML='<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:12px;">Could not load.</div>'}}}async _loadChakraMastery(){const e=window.Core.state.currentUser,t=document.getElementById(`${this.roomId}MasteryCount`),i=document.getElementById(`${this.roomId}MasteryProgress`),o=document.getElementById(`${this.roomId}MasteryChakras`);if(!o)return;const a=[{key:"root",label:"Root",color:"#ef4444"},{key:"sacral",label:"Sacral",color:"#f97316"},{key:"solar",label:"Solar Plexus",color:"#eab308"},{key:"heart",label:"Heart",color:"#22c55e"},{key:"throat",label:"Throat",color:"#3b82f6"},{key:"third-eye",label:"Third Eye",color:"#6366f1"},{key:"crown",label:"Crown",color:"#a855f7"}];if(!e?.id){o.innerHTML=a.map(s=>`<span style="padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;background:var(--border);color:var(--text-muted);">${s.label}</span>`).join(""),t&&(t.textContent="0 / 7");return}try{const{data:s,error:r}=await h._sb.from("reiki_sessions").select("chakra_key").eq("user_id",e.id);if(r)throw r;const l=new Set((s||[]).map(u=>u.chakra_key)),c=a.filter(u=>l.has(u.key)).length,d=Math.round(c/7*100);t&&(t.textContent=`${c} / 7`),i&&(i.style.width=`${d}%`),o.innerHTML=a.map(u=>{const m=l.has(u.key);return`<span style="padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;
                    background:${m?u.color:"var(--border)"};
                    color:${m?"#fff":"var(--text-muted)"};
                    opacity:${m?"1":"0.5"};
                    transition:all 0.3s ease;">${u.label}</span>`}).join(""),this._masteryLoaded=!0}catch(s){console.warn("[ReikiRoom] load mastery failed",s),t&&(t.textContent="— / 7")}}onEnter(){this._personalTabHydrated=!1,this._masteryLoaded=!1,this.initializeChat(),requestAnimationFrame(()=>{const e=document.getElementById(`${this.roomId}DailyTabContent`),t=document.getElementById(`${this.roomId}DailyChatSection`);if(e&&this._chakraDataReady&&this.state.currentDay){const i=this.CHAKRA_SCHEDULE[this.state.currentDay];e.innerHTML=`
                <h3 style="font-family:var(--serif);font-size:24px;margin:0 0 20px 0;text-align:center;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:20px;height:20px;vertical-align:middle;margin-right:6px;"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>
                    Today's Collective Energy
                </h3>
                ${this._getChakraDisplayHTML(i,this.state.dailyImageIndex,!0,!0)}`,t&&(t.style.display=""),this._loadCommunityEnergy()}document.querySelector(`#${this.roomId}View .tarot-main`)?.scrollTo(0,0)})}getActions(){return{...super.getActions(),startPersonalSession:()=>this.startPersonalSession(),prevChakraImage:e=>{this._actionEl(e).dataset.scope==="daily"?this.previousDailyImage():this.previousPersonalImage()},nextChakraImage:e=>{this._actionEl(e).dataset.scope==="daily"?this.nextDailyImage():this.nextPersonalImage()},toggleChakraJournal:e=>this._toggleChakraJournalLog(this._actionEl(e).dataset.prefix),saveChakraJournal:e=>{const t=this._actionEl(e);this._saveChakraJournalEntry(t.dataset.prefix,t.dataset.key)},submitCommunityEnergy:()=>this._submitCommunityEnergy()}}getInstructions(){return`
            <p><strong>A space for energy healing and chakra alignment.</strong></p>
            <h3>How It Works:</h3>
            <ul>
                <li><strong>Today's Collective Energy:</strong> Each day follows a planetary chakra cycle. The entire community focuses on one chakra energy.</li>
                <li><strong>Solo Chakra Work:</strong> Choose any chakra for your individual needs.</li>
                <li><strong>Community Discussion:</strong> Share your experiences and healing journey.</li>
            </ul>
            <h3>7-Day Planetary Chakra Cycle:</h3>
            <ul>
                <li><strong>Sunday (Sun):</strong> Solar Plexus - Confidence &amp; expansion</li>
                <li><strong>Monday (Moon):</strong> Sacral Chakra - Emotional flow &amp; creativity</li>
                <li><strong>Tuesday (Mars):</strong> Root Chakra - Grounding &amp; strength</li>
                <li><strong>Wednesday (Mercury):</strong> Throat Chakra - Truth &amp; expression</li>
                <li><strong>Thursday (Jupiter):</strong> Third Eye - Intuition &amp; vision</li>
                <li><strong>Friday (Venus):</strong> Heart Chakra - Love &amp; connection</li>
                <li><strong>Saturday (Saturn):</strong> Crown Chakra - Awareness &amp; unity</li>
            </ul>
            <h3>Energy Work Guidelines:</h3>
            <ul>
                <li>Find a quiet, comfortable space</li>
                <li>Practice non-forcing - allow energy to flow naturally</li>
                <li>Be patient with yourself</li>
                <li>This is complementary to medical care, not a replacement</li>
            </ul>`}}Object.assign(V.prototype,z);Object.assign(V.prototype,Z);const fe=new V;window.ReikiRoom=fe;window.dispatchRoomReady?.("reiki");const Fe=Object.freeze(Object.defineProperty({__proto__:null,ReikiRoom:V,reikiRoom:fe},Symbol.toStringTag,{value:"Module"}));export{Se as C,Be as P,Ee as S,Ae as T,Te as Y,Me as a,Re as b,Pe as c,He as d,ze as e,Oe as f,De as g,je as o,Fe as r,Le as s,Ne as t};
