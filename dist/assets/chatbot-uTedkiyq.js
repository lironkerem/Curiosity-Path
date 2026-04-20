var u=Object.defineProperty;var m=(l,e,t)=>e in l?u(l,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[e]=t;var d=(l,e,t)=>m(l,typeof e!="symbol"?e+"":e,t);const i=class i{constructor(e){this.app=e,this.messages=[],this.abortCtrl=null,this.isInitialized=!1,this.currentConversationId=null,this.conversations=[]}render(){const e=this._getOrCreateTab();if(this.isInitialized){this._showTab(e);return}e.innerHTML=this._getHTML(),this.attachHandlers(),this._startNewConversation(!1),this.isInitialized=!0}_getOrCreateTab(){let e=document.getElementById("chatbot-tab");if(!e){const t=document.getElementById("main-content");if(!t)throw new Error("Required element #main-content not found");e=document.createElement("div"),e.id="chatbot-tab",e.className="tab-content",t.appendChild(e)}return this._showTab(e),e}_showTab(e){e.classList.add("active"),e.style.display="block",e.setAttribute("aria-hidden","false")}_getHTML(){return`
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
                style="flex:1;resize:none;max-height:${i.MAX_INPUT_HEIGHT}px;min-height:${i.MIN_INPUT_HEIGHT}px;"
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
      </div>`}attachHandlers(){const e=document.getElementById("chatbot-send"),t=document.getElementById("chatbot-input"),s=document.getElementById("chatbot-history-btn"),n=document.getElementById("chatbot-new-btn"),a=document.getElementById("chatbot-history-modal"),o=document.getElementById("chatbot-history-close");if(!e||!t){console.error("ChatBot: Required elements not found");return}e.addEventListener("click",()=>this._onSubmit()),t.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),this._onSubmit())}),t.addEventListener("input",()=>{t.style.height="auto",t.style.height=`${Math.min(t.scrollHeight,i.MAX_INPUT_HEIGHT)}px`}),s.addEventListener("click",()=>this._openHistoryModal()),n.addEventListener("click",()=>this._startNewConversation(!0)),o.addEventListener("click",()=>this._closeHistoryModal()),a.addEventListener("click",r=>{r.target===a&&this._closeHistoryModal()})}_startNewConversation(e=!0){this.currentConversationId=null,this.messages=[];const t=document.querySelector(".chatbot-messages");t&&(t.innerHTML=""),e?this._pushMessage(i.GREETING,"bot"):this._pushMessage(i.GREETING,"bot")}async _openHistoryModal(){const e=document.getElementById("chatbot-history-modal");e.style.display="flex",await this._loadAndRenderHistory()}_closeHistoryModal(){const e=document.getElementById("chatbot-history-modal");e.style.display="none"}async _loadAndRenderHistory(){const e=document.getElementById("chatbot-history-list");e.innerHTML='<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>';let t=[];try{const s=this._getSupabase();if(s){const{data:n,error:a}=await s.from("chat_conversations").select("id, title, created_at, updated_at").order("updated_at",{ascending:!1}).limit(50);!a&&n&&(t=n)}}catch(s){console.warn("ChatBot: Supabase history load failed, falling back to localStorage",s)}t.length||(t=this._getLSConversations().map(s=>({id:s.id,title:s.title,created_at:s.created_at,updated_at:s.updated_at}))),this.conversations=t,this._renderHistoryList(t)}_renderHistoryList(e){const t=document.getElementById("chatbot-history-list");if(!e.length){t.innerHTML='<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">No saved conversations yet.</p>';return}t.innerHTML=e.map(s=>{const n=new Date(s.updated_at||s.created_at).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"}),a=s.id===this.currentConversationId;return`
        <div data-convo-id="${s.id}"
             style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;cursor:pointer;
                    background:${a?"var(--neuro-accent,#7c6ef2)22":"transparent"};
                    border:1px solid ${a?"var(--neuro-accent,#7c6ef2)44":"transparent"};
                    transition:background 0.15s;"
             onmouseover="this.style.background='var(--neuro-bg,#2a2a3e)'"
             onmouseout="this.style.background='${a?"var(--neuro-accent,#7c6ef2)22":"transparent"}'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9rem;color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escapeHTML(s.title)}</div>
            <div style="font-size:0.75rem;opacity:0.45;margin-top:2px;">${n}</div>
          </div>
          <button data-delete-id="${s.id}" aria-label="Delete conversation"
                  style="background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.3;font-size:1rem;padding:0.25rem 0.4rem;margin-left:0.5rem;border-radius:6px;flex-shrink:0;"
                  onmouseover="this.style.opacity='0.8';this.style.color='#ef4444'"
                  onmouseout="this.style.opacity='0.3';this.style.color='var(--neuro-text)'">✕</button>
        </div>`}).join(""),t.querySelectorAll("[data-convo-id]").forEach(s=>{s.addEventListener("click",n=>{const a=n.target.closest("[data-delete-id]");a?(n.stopPropagation(),this._deleteConversation(a.dataset.deleteId)):this._loadConversation(s.dataset.convoId)})})}async _loadConversation(e){let t=null;try{const n=this._getSupabase();if(n){const{data:a,error:o}=await n.from("chat_conversations").select("messages").eq("id",e).single();!o&&a&&(t=a.messages)}}catch{}if(!t){const a=this._getLSConversations().find(o=>o.id===e);a&&(t=a.messages)}if(!t)return;this.currentConversationId=e,this.messages=t;const s=document.querySelector(".chatbot-messages");s&&(s.innerHTML="",t.forEach(n=>this._renderBubble(n.text,n.sender)),this._scrollToBottom(s),this._closeHistoryModal())}async _deleteConversation(e){try{const s=this._getSupabase();s&&await s.from("chat_conversations").delete().eq("id",e)}catch{}const t=this._getLSConversations().filter(s=>s.id!==e);this._saveLSConversations(t),this.currentConversationId===e&&this._startNewConversation(!1),await this._loadAndRenderHistory()}async _saveConversation(){if(!this.messages.length)return;const e=this.messages.find(o=>o.sender==="user"),s={title:e?e.text.slice(0,60)+(e.text.length>60?"…":""):"Conversation",messages:this.messages,updated_at:new Date().toISOString()};try{const o=this._getSupabase();if(o)if(this.currentConversationId)await o.from("chat_conversations").update(s).eq("id",this.currentConversationId);else{const{data:r,error:c}=await o.from("chat_conversations").insert({...s}).select("id").single();!c&&r&&(this.currentConversationId=r.id)}}catch(o){console.warn("ChatBot: Supabase save failed, using localStorage only",o)}const n=this._getLSConversations(),a=new Date().toISOString();if(this.currentConversationId){const o=n.findIndex(r=>r.id===this.currentConversationId);o>=0?n[o]={...n[o],...s}:n.unshift({id:this.currentConversationId,...s,created_at:a})}else{const o=crypto.randomUUID();this.currentConversationId=o,n.unshift({id:o,...s,created_at:a})}this._saveLSConversations(n.slice(0,100))}_onSubmit(){const e=document.getElementById("chatbot-input"),t=document.getElementById("chatbot-send"),s=e==null?void 0:e.value.trim();!s||t!=null&&t.disabled||(this._pushMessage(s,"user"),e.value="",e.style.height="auto",this._callBot(s))}_pushMessage(e,t){const s=document.querySelector(".chatbot-messages");s&&(this.messages.push({text:e,sender:t,timestamp:Date.now()}),this._renderBubble(e,t),this._scrollToBottom(s))}_renderBubble(e,t){const s=document.querySelector(".chatbot-messages");if(!s)return;const n=document.createElement("div");return n.className=`chat-bubble ${t}`,n.style.cssText=this._getBubbleStyles(t),n.textContent=e,s.appendChild(n),n}_getBubbleStyles(e){const t="padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;";return e==="user"?t+"align-self:flex-end;background:var(--neuro-accent);color:#fff;border-bottom-right-radius:0.25rem;":t+"align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);"}async _callBot(e){const t=document.getElementById("chatbot-send"),s=document.querySelector(".chatbot-messages");if(!t||!s)return;t.disabled=!0,t.innerHTML=this._getSpinnerIcon(),this.abortCtrl=new AbortController;const n=document.createElement("div");n.className="chat-bubble bot",n.style.cssText=this._getBubbleStyles("bot"),s.appendChild(n),this._scrollToBottom(s);try{const a=await fetch(i.API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e}),signal:this.abortCtrl.signal});if(!a.ok)throw new Error(await a.text());await this._streamResponse(a,n,s)}catch(a){a.name==="AbortError"?n.textContent="Request cancelled.":(console.error("ChatBot API error:",a),n.textContent=i.ERROR_MESSAGE,n.style.background="rgba(239,68,68,0.1)",n.style.borderLeft="3px solid #ef4444")}finally{t.disabled=!1,t.innerHTML=this._getSendIcon(),this.abortCtrl=null,await this._saveConversation()}}async _streamResponse(e,t,s){const n=e.body.getReader(),a=new TextDecoder;let o="";for(;;){const{done:r,value:c}=await n.read();if(r)break;o+=a.decode(c,{stream:!0}),t.textContent=o,this._scrollToBottom(s)}this.messages.push({text:o,sender:"bot",timestamp:Date.now()})}_getLSConversations(){try{return JSON.parse(localStorage.getItem(i.LS_KEY)||"[]")}catch{return[]}}_saveLSConversations(e){try{localStorage.setItem(i.LS_KEY,JSON.stringify(e))}catch(t){console.warn("ChatBot: localStorage save failed",t)}}_getSupabase(){var e,t,s;return((e=this.app)==null?void 0:e.supabase)||((s=(t=this.app)==null?void 0:t.core)==null?void 0:s.supabase)||window.supabase||null}_scrollToBottom(e){e.scrollTop=e.scrollHeight}_escapeHTML(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}_getSendIcon(){return'<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>'}_getSpinnerIcon(){return'<div class="spinner" aria-label="Loading"></div>'}_getHistoryIcon(){return'<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>'}_getPlusIcon(){return'<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'}destroy(){var e;(e=this.abortCtrl)==null||e.abort(),this.messages=[],this.isInitialized=!1,this.currentConversationId=null}};d(i,"API_URL","/api/chat"),d(i,"MAX_INPUT_HEIGHT",120),d(i,"MIN_INPUT_HEIGHT",52),d(i,"GREETING","Hello! How can I help you today my friend?"),d(i,"ERROR_MESSAGE","Sorry, something went wrong. Please try again."),d(i,"LS_KEY","chatbot_conversations");let h=i;if(!document.getElementById("chatbot-spinner-style")){const l=document.createElement("style");l.id="chatbot-spinner-style",l.textContent=`
    .spinner {
      width: 20px; height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,document.head.appendChild(l)}export{h as ChatBotAI,h as default};
