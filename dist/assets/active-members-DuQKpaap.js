import{C as o,r as b}from"./community-hub-BgfS3zJG.js";import"./active-members-DuQKpaap.js";import"./features-lazy-COJZCo6-.js";const a={_instances:new Set,_subscribed:!1,_retryTimer:null,_blockedCache:null,register(t){this._instances.add(t),this._subscribed||this._subscribe()},unregister(t){this._instances.delete(t),this._instances.size===0&&(this._unsubscribe(),this._blockedCache=null)},async getBlocked(){return this._blockedCache||(this._blockedCache=o.getBlockedUsers().catch(()=>new Set)),this._blockedCache},invalidateBlocked(){this._blockedCache=null},_subscribe(){if(!o.ready){this._retryTimer=setInterval(()=>{o.ready&&(clearInterval(this._retryTimer),this._retryTimer=null,this._doSubscribe())},300);return}this._doSubscribe()},_doSubscribe(){const t=o.subscribeToPresence(async e=>{const i=await this.getBlocked(),r=e.filter(n=>!i.has(n.user_id));this._instances.forEach(n=>n._onPresenceUpdate(r))});this._subscribed=!!t},_unsubscribe(){clearInterval(this._retryTimer),this._retryTimer=null,this._subscribed=!1}},g=new Set(["online","available","away","guiding","silent","deep","offline"]),f={online:"online",available:"online",away:"away",guiding:"away",silent:"silent",deep:"deep",offline:"offline"},w=1e4,M=150;class T{constructor(e){if(!(e instanceof HTMLElement))throw new TypeError("[ActiveMembersWidget] containerEl must be an HTMLElement");this.container=e,this.isRendered=!1,this._destroyed=!1}render(){this.container.innerHTML=this._buildShell("Loading..."),this._waitForDB().then(()=>Promise.all([o.getActiveMembers(),a.getBlocked()])).then(([e,i])=>{if(this._destroyed)return;const r=e.filter(n=>!i.has(n.user_id));this._paint(r),a.register(this),this.isRendered=!0}).catch(e=>{this._destroyed||(console.error("[ActiveMembersWidget] render error:",e),this.container.innerHTML=this._buildShell("Could not load members."))})}async refresh(){this.isRendered=!1,this.render()}updateMemberStatus(e,i){if(!g.has(i))return;const r=this.container.querySelector(`[data-member-id="${e}"]`),n=r==null?void 0:r.querySelector(".member-mini-status");n&&(["online","away","offline","silent","deep"].forEach(s=>n.classList.remove(s)),n.classList.add(f[i]||"offline"),n.setAttribute("aria-label",i),n.setAttribute("title",m(i)))}updateMemberActivity(e,i){if(!i||typeof i!="string")return;const r=this.container.querySelector(`[data-member-id="${e}"] .member-mini-info`);r&&(r.textContent=i)}updateMemberAvatar(e,{emoji:i,avatarUrl:r}={}){const n=this.container.querySelector(`[data-member-id="${e}"]`),s=n==null?void 0:n.querySelector(".member-mini-avatar");s&&(r?(s.style.background="transparent",s.innerHTML=`<img src="${r}"
                style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                alt="" loading="lazy" decoding="async">`):i&&(s.style.background="",s.innerHTML=`<span class="member-avatar-icon">${b(i)}</span>`))}destroy(){this._destroyed=!0,a.unregister(this),this.isRendered=!1}_waitForDB(){return o.ready?Promise.resolve():new Promise((e,i)=>{const r=Date.now(),n=setInterval(()=>{this._destroyed?(clearInterval(n),i(new Error("widget destroyed"))):o.ready?(clearInterval(n),e()):Date.now()-r>w&&(clearInterval(n),i(new Error("CommunityDB not ready after timeout")))},M)})}_onPresenceUpdate(e){this._paint(e)}_paint(e){const i=e.filter(s=>s.status==="online"||s.status==="available").length,r=this.container.querySelector(".active-members-online-count"),n=this.container.querySelector(".active-members-grid");r&&n?(r.textContent=`${i} online`,n.innerHTML=h(e)):this.container.innerHTML=this._buildShell(`${i} online`,e)}_buildShell(e,i=null){const r=i===null?"":`
            <div class="active-members-grid">
                ${h(i)}
            </div>
            <button type="button" onclick="window.WhisperModal?.open()"
                    style="width:100%;margin-top:12px;padding:12px;border-radius:12px;border:none;
                           cursor:pointer;font-size:0.88rem;font-weight:600;
                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                           box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           position:relative;transition:opacity 0.15s;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round" class="lucide-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Whispers
                <span id="whisperUnreadBadge"
                      style="display:none;background:var(--neuro-accent);color:#fff;
                             border-radius:99px;font-size:0.7rem;font-weight:700;
                             padding:2px 7px;min-width:18px;text-align:center;"></span>
            </button>`;return`
            <section class="section" aria-labelledby="activeMembersTitle-${this._uid}">
                <div class="section-header">
                    <div class="section-title" id="activeMembersTitle-${this._uid}">Active Members</div>
                    <div class="active-members-online-count"
                         style="font-size:12px;color:var(--text-muted);">${e}</div>
                </div>
                ${r}
            </section>`}get _uid(){return this.__uid||(this.__uid=Math.random().toString(36).slice(2,7)),this.__uid}}function h(t){return t!=null&&t.length?t.map(x).join(""):'<div style="color:var(--text-muted);font-size:13px;padding:12px">No members online</div>'}function x(t){var u;if(!t)return"";const e=t.profiles||{},i=e.name||"Member",r=e.emoji||"",n=e.avatar_url||"",s=t.status||"online",v=t.activity||"✨ Available",c=t.user_id,p=(u=window.Core)==null?void 0:u.getAvatarGradient(c||i),l=d(i),_=f[s]||"offline",y=n?`<img src="${n}"
               style="width:100%;height:100%;object-fit:cover;border-radius:inherit;"
               alt="${l}" loading="lazy">`:r?`<span class="member-avatar-icon">${b(r)}</span>`:`<span>${d(i.charAt(0).toUpperCase())}</span>`;return`
        <div class="member-card-mini"
             onclick="window._activeMembersHandleView('${c}')"
             data-member-id="${c}"
             role="button"
             tabindex="0"
             aria-label="View ${l}'s profile"
             onkeydown="if(event.key==='Enter'||event.key===' '){
                 event.preventDefault();
                 window._activeMembersHandleView('${c}');
             }">
            <div class="member-mini-avatar"
                 style="${n?"background:transparent;":`background:${p};`}"
                 aria-hidden="true">
                ${y}
            </div>
            <div class="member-mini-status ${_}"
                 aria-label="${s}"
                 title="${m(s)}"></div>
            <div class="member-mini-name">${l}</div>
            <div class="member-mini-info">${d(v)}</div>
        </div>`}function d(t){if(!t||typeof t!="string")return"";const e=document.createElement("div");return e.textContent=t,e.innerHTML}function m(t){return!t||typeof t!="string"?"":t.charAt(0).toUpperCase()+t.slice(1)}window._activeMembersHandleView=function(t){var e;t&&(window.MemberProfileModal?window.MemberProfileModal.open(t):(e=window.Core)==null||e.showToast("Member profiles loading..."))};window.addEventListener("avatarChanged",t=>{const{userId:e,emoji:i,avatarUrl:r}=t.detail||{};e&&a._instances.forEach(n=>{n.updateMemberAvatar(e,{emoji:i,avatarUrl:r})})});window.ActiveMembers={async render(){a._instances.size>0&&a._instances.forEach(t=>t.refresh())},updateMemberStatus(t,e){a._instances.forEach(i=>i.updateMemberStatus(t,e))},updateMemberActivity(t,e){a._instances.forEach(i=>i.updateMemberActivity(t,e))},async refresh(){a._instances.forEach(t=>t.refresh())},get state(){return{isRendered:a._instances.size>0}}};export{T as ActiveMembersWidget,a as PresenceManager};
