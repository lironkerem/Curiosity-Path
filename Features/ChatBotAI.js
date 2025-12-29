// ChatBotAI.js  (skin-aware, neumorphic, no hard-coded colours)

export class ChatBotAI {
  constructor(opts = {}) {
    this.apiUrl        = opts.apiUrl   || '/api/chat';
    this.placeholder   = opts.placeholder || 'Type your message/query/question…';
    this.title         = opts.title      || 'AI Assistant by Aanandoham';
    this.target        = opts.attach     || null;
    this.messages      = [];
    this.abortCtrl     = null;
    this.isFloat       = false;
    this.styleId       = 'chatbot-ai-core-style';
    this._injectCoreCSS();
  }

  mount(selector) {
    this.target = typeof selector === 'string'
                ? document.querySelector(selector)
                : selector;
    if (!this.target) throw new Error('ChatBotAI: mount target not found');
    this._renderChatBox();
    this._pushMessage('Hello! How can I help you today my friend?', 'bot');
    return this;
  }

static float(opts = {}) {
  if (document.getElementById('chatbot-float-root')) return;
  const instance = new ChatBotAI({...opts, attach:null});
  instance.isFloat = true;
  instance._injectFloatCSS();
  instance._renderFloatSkeleton();
  instance._pushMessage('Hello! How can I help you today my friend?', 'bot');
  
  // NEW: Expose global method to open panel
  window.openChatBot = () => instance._openPanel();
  
  return instance;
};

  /* ----------  DOM builders  ---------- */
  _renderChatBox() {
    this.target.innerHTML = `
<div class="chatbot-ai-core">
  <div class="chatbot-ai-header">${this.title}</div>
  <div class="chatbot-ai-body" style="margin-bottom: 0.5rem;"></div>
  <form class="chatbot-ai-footer">
    <textarea class="chatbot-ai-input" placeholder="${this.placeholder}" rows="1"></textarea>
    <button class="chatbot-ai-send" aria-label="Send">${this._sendSVG()}</button>
  </form>
</div>`;
    this.$body  = this.target.querySelector('.chatbot-ai-body');
    this.$form  = this.target.querySelector('form');
    this.$input = this.target.querySelector('textarea');
    this.$btn   = this.target.querySelector('button');
    this._bindForm();
  }

  _bindForm() {
    this.$form.addEventListener('submit', e => this._onSubmit(e));
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._onSubmit(); }
    });
    this.$input.addEventListener('input', () => {
      this.$input.style.height = 'auto';
      this.$input.style.height = `${this.$input.scrollHeight}px`;
    });
  }

  _renderFloatSkeleton() {
    const root = document.createElement('div');
    root.id = 'chatbot-float-root';
    root.innerHTML = `
<div id="chatbot-float-bubble" style="display:none" title="Open chat">${this._bubbleSVG()}</div>
<div id="chatbot-float-panel">
  <div id="chatbot-float-header">
    <span>${this.title}</span>
    <button id="chatbot-float-close">&times;</button>
  </div>
  <div id="chatbot-float-body" style="margin-bottom: 0.5rem;"></div>
</div>`;
    document.body.appendChild(root);

    this.$bubble = root.querySelector('#chatbot-float-bubble');
    this.$panel  = root.querySelector('#chatbot-float-panel');
    this.target  = root.querySelector('#chatbot-float-body');
    this.$close  = root.querySelector('#chatbot-float-close');

    this.$bubble.addEventListener('click', () => this._openPanel());
    this.$close .addEventListener('click', () => this._closePanel());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.$panel.classList.contains('open')) this._closePanel();
    });
    this._renderChatBox();
  }

  _openPanel() {
    this.$panel.classList.add('open');
    this.$bubble.style.display = 'none';
    this.$input.focus();
  }

  _closePanel() {
    this.$panel.classList.remove('open');
    this.$bubble.style.display = 'none';
  }

  _onSubmit(e) {
    if (e) e.preventDefault();
    const text = this.$input.value.trim();
    if (!text || this.$btn.disabled) return;
    this._pushMessage(text, 'user');
    this.$input.value = '';
    this.$input.style.height = 'auto';
    this._callBot(text);
  }

  _pushMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `chatbot-ai-bubble ${sender}`;
    div.textContent = text;
    this.$body.appendChild(div);
    this._scrollToBottom();
  }

  _scrollToBottom() {
    this.$body.scrollTop = this.$body.scrollHeight;
  }

  async _callBot(userText) {
    this.$btn.disabled = true;
    this.$btn.innerHTML = '<div class="chatbot-ai-spinner"></div>';
    this.abortCtrl = new AbortController();

    const bubble = document.createElement('div');
    bubble.className = 'chatbot-ai-bubble bot';
    this.$body.appendChild(bubble);
    this._scrollToBottom();

    try {
      const res = await fetch(this.apiUrl, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ message: userText }),
        signal : this.abortCtrl.signal
      });
      if (!res.ok) throw new Error(await res.text());
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buf += dec.decode(value, {stream:true});
        bubble.textContent = buf;
        this._scrollToBottom();
      }
    } catch (err) {
      bubble.textContent = 'Sorry, something went wrong. Please try again.';
    } finally {
      this.$btn.disabled = false;
      this.$btn.innerHTML = this._sendSVG();
      this.abortCtrl = null;
    }
  }

  /* ----------  SVG helpers (no colour)  ---------- */
  _sendSVG() {
    // removed fill colour – CSS will paint it
    return `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2z"/></svg>`;
  }
  _bubbleSVG() {
    return `<span style="font-size:28px;filter:drop-shadow(1px 1px 2px rgba(0,0,0,.2))">💬</span>`;
  }

  /* ----------  CSS injection (tokenised)  ---------- */
  _injectCoreCSS() {
    if (document.getElementById(this.styleId)) return;
    const s = document.createElement('style');
    s.id = this.styleId;
    s.textContent = `
.chatbot-ai-core{
  display:flex;
  flex-direction:column;
  height:100%;
  background:var(--chat-bg, #111827);
  color:var(--chat-text, #e5e7eb);
  border:var(--chat-border, 1px solid #374151);
  border-radius:.75rem;
  overflow:hidden;
  box-shadow:var(--chat-shadow, 0 10px 15px -3px rgba(0,0,0,.4));
}
.chatbot-ai-header{
  padding:.75rem 1rem;
  background:var(--chat-header-bg, #1f2937);
  font-weight:600;
  font-size:.875rem;
  border-bottom:var(--chat-border, 1px solid #374151);
}
.chatbot-ai-body{
  flex:1 1 0;
  padding:1rem;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:.75rem;
  background:var(--chat-bg, #111827);
}
.chatbot-ai-bubble{
  max-width:80%;
  padding:.75rem 1rem;
  border-radius:1rem;
  font-size:.925em;
  line-height:1.4;
}
.chatbot-ai-bubble.user{
  align-self:flex-end;
  background:var(--chat-accent, #8b5cf6);
  color:#fff;
  border-bottom-right-radius:.25rem;
}
.chatbot-ai-bubble.bot{
  align-self:flex-start;
  background:var(--chat-bg-light, #374151);
  color:var(--chat-text, #e5e7eb);
  border-bottom-left-radius:.25rem;
}
.chatbot-ai-footer{
  display:flex;
  border-top:var(--chat-border, 1px solid #374151);
  background:var(--chat-header-bg, #111827);
}
.chatbot-ai-input{
  flex:1;
  background:var(--chat-bg-input, var(--chat-bg, #111827));
  border:none;
  color:var(--chat-text, #e5e7eb);
  padding:.75rem 1rem;
  resize:none;
  max-height:120px;
  outline:none;
  border-radius:16px;
  box-shadow:var(--chat-inset, inset 0 0 8px rgba(0,0,0,.4));
}
.chatbot-ai-send{
  width:52px;
  height:52px;
  border:none;
  background:var(--chat-accent, #8b5cf6);
  color:#fff;
  display:grid;
  place-content:center;
  cursor:pointer;
  border-radius:50%;
  box-shadow:var(--chat-shadow, 0 4px 14px rgba(139,92,246,.45));
}
.chatbot-ai-send:disabled{
  background:var(--chat-bg-disabled, #4b5563);
  cursor:not-allowed;
}
.chatbot-ai-send svg{
  width:20px;
  height:20px;
  fill:#fff;
}
.chatbot-ai-spinner{
  width:20px;
  height:20px;
  border:2px solid #fff;
  border-top-color:transparent;
  border-radius:50%;
  animation:chatbot-spin .6s linear infinite;
}
@keyframes chatbot-spin{to{transform:rotate(360deg)}}
`;
    document.head.appendChild(s);
  }

  _injectFloatCSS() {
    if (document.getElementById('chatbot-float-style')) return;
    const s = document.createElement('style');
    s.id = 'chatbot-float-style';
    s.textContent = `
#chatbot-float-root{
  z-index:9999;
  position:fixed;
  font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
  pointer-events:none;
}
#chatbot-float-bubble{
  display:none;
  width:64px;
  height:64px;
  border-radius:50%;
  background:var(--chat-accent, #8b5cf6);
  box-shadow:0 4px 14px rgba(139,92,246,.45);
  cursor:pointer;
  place-content:center;
  transition:transform .2s;
  pointer-events:auto;
}
#chatbot-float-bubble:hover{transform:scale(1.08)}
#chatbot-float-panel{
  position:fixed;
  background:var(--chat-bg, #111827);
  border:var(--chat-border, 1px solid #374151);
  box-shadow:var(--chat-shadow, 0 -4px 24px rgba(0,0,0,.5));
  display:flex;
  flex-direction:column;
  transition:transform .35s cubic-bezier(.4,0,.2,1);
  visibility:hidden;
  z-index:10000;
  pointer-events:none;
}
#chatbot-float-panel.open{
  transform:translateY(0);
  visibility:visible;
  pointer-events:auto;
}
#chatbot-float-header{
  padding:12px 16px;
  background:var(--chat-header-bg, #1f2937);
  display:flex;
  align-items:center;
  justify-content:space-between;
  font-size:15px;
  font-weight:600;
  color:var(--chat-text, #e5e7eb);
  flex-shrink:0;
}
#chatbot-float-close{
  background:none;
  border:none;
  color:#9ca3af;
  font-size:24px;
  cursor:pointer;
  line-height:1;
  padding:0;
  width:32px;
  height:32px;
}
#chatbot-float-body{
  flex:1 1 0;
  overflow:hidden;
  min-height:0;
  background:var(--chat-bg, #111827);
}

/* Desktop */
@media (min-width:769px){
#chatbot-float-root{bottom:24px;right:24px}
#chatbot-float-panel{bottom:0;right:24px;width:380px;height:680px;max-height:90vh;border-bottom:none;border-radius:16px 16px 0 0;transform:translateY(100%)}
#chatbot-float-header{border-radius:16px 16px 0 0}
}

/* Mobile */
@media (max-width:768px){
#chatbot-float-root{bottom:100px;left:16px;right:auto;width:auto}
#chatbot-float-panel{position:fixed;bottom:100px;left:16px;right:auto;width:calc(100vw - 32px);max-width:320px;height:400px;max-height:60vh;border-radius:16px;border:var(--chat-border, 1px solid #374151);transform:translateY(calc(100% + 20px)) scale(0.95);transform-origin:bottom left}
#chatbot-float-panel.open{transform:translateY(0) scale(1)}
#chatbot-float-header{border-radius:16px 16px 0 0}
#chatbot-float-body{border-radius:0 0 16px 16px}
}

/* Tiny screens */
@media (max-width:400px){
#chatbot-float-panel{width:calc(100vw - 24px);max-width:none;left:12px;height:380px}
#chatbot-float-root{left:12px}
}
`;
    document.head.appendChild(s);
  }
}