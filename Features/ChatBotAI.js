// Features/ChatBotAI.js - Matching app structure

export class ChatBotAI {
  constructor(app) {
    this.app = app;
    this.apiUrl = '/api/chat';
    this.messages = [];
    this.abortCtrl = null;
  }

  render() {
    let tab = document.getElementById('chatbot-tab');
    
    // If tab doesn't exist, create it
    if (!tab) {
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        tab = document.createElement('div');
        tab.id = 'chatbot-tab';
        tab.className = 'tab-content';
        mainContent.appendChild(tab);
      } else {
        console.error('main-content not found');
        return;
      }
    }
    
    // Make sure tab is visible
    tab.classList.add('active');
    tab.style.display = 'block';
    tab.setAttribute('aria-hidden', 'false');

tab.innerHTML = `
  <div style="padding:1.5rem;min-height:100vh;">
    <div class="universal-content">

<!--  IMAGE-ONLY MOBILE HEADER  -->
      <header class="main-header project-curiosity"
              style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/assets/Tabs/Chat.png');
                     --header-title:'';
                     --header-tag:'Ask me anything about spirituality, self-development, guidance, or just chat with me'">
      <h1>Aanandoham's AI Assistant</h1>
      <h3>Ask me anything about spirituality, self-development, guidance, or just chat with me</h3>
      <span class="header-sub"></span>
    </header>

    <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 300px);min-height:500px;">
      
      <div class="chatbot-messages" style="flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;background:var(--neuro-bg);border-radius:12px;margin-bottom:1rem;">
      </div>

      <div style="display:flex;gap:0.75rem;align-items:flex-end;">
        <textarea 
          id="chatbot-input"
          class="form-input" 
          placeholder="Type your message/query/question…" 
          rows="1"
          style="flex:1;resize:none;max-height:120px;min-height:52px;"
        ></textarea>
        <button id="chatbot-send" class="btn btn-primary" style="min-width:52px;height:52px;padding:0;display:grid;place-content:center;">
          ${this._sendSVG()}
        </button>
      </div>

    </div>

  </div>
</div>`;

    this.attachHandlers();
    this._pushMessage('Hello! How can I help you today my friend?', 'bot');
  }

  attachHandlers() {
    const btn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    if (!btn || !input) return;

    btn.addEventListener('click', () => this._onSubmit());
    
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._onSubmit();
      }
    });
    
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${input.scrollHeight}px`;
    });
  }

  _onSubmit() {
    const input = document.getElementById('chatbot-input');
    const btn = document.getElementById('chatbot-send');
    const text = input?.value.trim();
    
    if (!text || btn?.disabled) return;
    
    this._pushMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    this._callBot(text);
  }

  _pushMessage(text, sender) {
    const container = document.querySelector('.chatbot-messages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.style.cssText = sender === 'user' 
      ? 'align-self:flex-end;background:var(--neuro-accent);color:#fff;padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-right-radius:0.25rem;'
      : 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
    bubble.textContent = text;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  async _callBot(userText) {
    const btn = document.getElementById('chatbot-send');
    const container = document.querySelector('.chatbot-messages');
    if (!btn || !container) return;

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div>';
    this.abortCtrl = new AbortController();

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.style.cssText = 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

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
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      bubble.textContent = 'Sorry, something went wrong. Please try again.';
      bubble.style.background = 'rgba(239, 68, 68, 0.1)';
      bubble.style.borderLeft = '3px solid #ef4444';
    } finally {
      btn.disabled = false;
      btn.innerHTML = this._sendSVG();
      this.abortCtrl = null;
    }
  }

  _sendSVG() {
    return `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
  }
}

// Spinner style
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

export default ChatBotAI;