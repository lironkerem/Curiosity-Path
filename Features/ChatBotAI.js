// ChatBotAI.js - Tab version matching app design

export class ChatBotAI {
  constructor(opts = {}) {
    this.apiUrl = opts.apiUrl || '/api/chat';
    this.placeholder = opts.placeholder || 'Type your message/query/question…';
    this.title = opts.title || 'AI Assistant by Aanandoham';
    this.target = opts.attach || null;
    this.messages = [];
    this.abortCtrl = null;
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

  _renderChatBox() {
    this.target.innerHTML = `
<div style="padding:1.5rem;min-height:100vh;">
  <div class="universal-content">

    <!-- HEADER matching other tabs -->
    <header class="main-header project-curiosity">
      <h1>Aanandoham's AI Assistant</h1>
      <h3>Ask me anything about spirituality, self-development, guidance, or just chat with me</h3>
    </header>

    <!-- CHAT CARD -->
    <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 300px);min-height:500px;">
      
      <!-- Chat Messages Area -->
      <div class="chatbot-messages" style="flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;background:var(--neuro-bg);border-radius:12px;margin-bottom:1rem;">
      </div>

      <!-- Input Area -->
      <div style="display:flex;gap:0.75rem;align-items:flex-end;">
        <textarea 
          class="chatbot-input form-input" 
          placeholder="${this.placeholder}" 
          rows="1"
          style="flex:1;resize:none;max-height:120px;min-height:52px;"
        ></textarea>
        <button class="chatbot-send btn btn-primary" style="min-width:52px;height:52px;padding:0;display:grid;place-content:center;">
          ${this._sendSVG()}
        </button>
      </div>

    </div>

  </div>
</div>`;

    this.$body = this.target.querySelector('.chatbot-messages');
    this.$input = this.target.querySelector('.chatbot-input');
    this.$btn = this.target.querySelector('.chatbot-send');
    this._bindForm();
  }

  _bindForm() {
    this.$btn.addEventListener('click', () => this._onSubmit());
    this.$input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._onSubmit();
      }
    });
    this.$input.addEventListener('input', () => {
      this.$input.style.height = 'auto';
      this.$input.style.height = `${this.$input.scrollHeight}px`;
    });
  }

  _onSubmit() {
    const text = this.$input.value.trim();
    if (!text || this.$btn.disabled) return;
    this._pushMessage(text, 'user');
    this.$input.value = '';
    this.$input.style.height = 'auto';
    this._callBot(text);
  }

  _pushMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.style.cssText = sender === 'user' 
      ? 'align-self:flex-end;background:var(--neuro-accent);color:#fff;padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-right-radius:0.25rem;'
      : 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
    bubble.textContent = text;
    this.$body.appendChild(bubble);
    this._scrollToBottom();
  }

  _scrollToBottom() {
    this.$body.scrollTop = this.$body.scrollHeight;
  }

  async _callBot(userText) {
    this.$btn.disabled = true;
    this.$btn.innerHTML = '<div class="spinner"></div>';
    this.abortCtrl = new AbortController();

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.style.cssText = 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
    this.$body.appendChild(bubble);
    this._scrollToBottom();

    try {
      const res = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
        signal: this.abortCtrl.signal
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
      bubble.style.background = 'rgba(239, 68, 68, 0.1)';
      bubble.style.borderLeft = '3px solid #ef4444';
    } finally {
      this.$btn.disabled = false;
      this.$btn.innerHTML = this._sendSVG();
      this.abortCtrl = null;
    }
  }

  _sendSVG() {
    return `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
  }
}

// Add spinner style if not exists
if (!document.getElementById('chatbot-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'chatbot-spinner-style';
  style.textContent = `
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}