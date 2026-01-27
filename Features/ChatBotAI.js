// Features/ChatBotAI.js - AI Chat Assistant Module

/**
 * ChatBotAI - Handles AI chat interface and interactions
 * Provides streaming responses with abort capability
 */
export class ChatBotAI {
  // Configuration constants
  static API_URL = '/api/chat';
  static MAX_INPUT_HEIGHT = 120;
  static MIN_INPUT_HEIGHT = 52;
  static GREETING = 'Hello! How can I help you today my friend?';
  static ERROR_MESSAGE = 'Sorry, something went wrong. Please try again.';

  constructor(app) {
    this.app = app;
    this.messages = [];
    this.abortCtrl = null;
    this.isInitialized = false;
  }

  /**
   * Renders the chatbot interface
   * Only initializes once to prevent DOM rebuilding
   */
  render() {
    const tab = this._getOrCreateTab();
    
    // Prevent re-initialization
    if (this.isInitialized) {
      this._showTab(tab);
      return;
    }

    tab.innerHTML = this._getHTML();
    this.attachHandlers();
    this._pushMessage(ChatBotAI.GREETING, 'bot');
    this.isInitialized = true;
  }

  /**
   * Gets existing tab or creates new one
   * @returns {HTMLElement} The chatbot tab element
   */
  _getOrCreateTab() {
    let tab = document.getElementById('chatbot-tab');
    
    if (!tab) {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) {
        throw new Error('Required element #main-content not found');
      }
      
      tab = document.createElement('div');
      tab.id = 'chatbot-tab';
      tab.className = 'tab-content';
      mainContent.appendChild(tab);
    }
    
    this._showTab(tab);
    return tab;
  }

  /**
   * Makes tab visible with proper accessibility attributes
   */
  _showTab(tab) {
    tab.classList.add('active');
    tab.style.display = 'block';
    tab.setAttribute('aria-hidden', 'false');
  }

  /**
   * Returns HTML template for chatbot interface
   */
  _getHTML() {
    return `
      <div style="padding:1.5rem;min-height:100vh;">
        <div class="universal-content">

          <header class="main-header project-curiosity"
                  style="--header-img:url('https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Tabs/Chat.png');
                         --header-title:'';
                         --header-tag:'Ask me anything about spirituality, self-development, guidance, or just chat with me'">
            <h1>Aanandoham's AI Assistant</h1>
            <h3>Ask me anything about spirituality, self-development, guidance, or just chat with me</h3>
            <span class="header-sub"></span>
          </header>

          <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 300px);min-height:500px;">
            
            <div class="chatbot-messages" 
                 style="flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;background:var(--neuro-bg);border-radius:12px;margin-bottom:1rem;">
            </div>

            <div style="display:flex;gap:0.75rem;align-items:flex-end;">
              <textarea 
                id="chatbot-input"
                class="form-input" 
                placeholder="Type your message/query/question…" 
                rows="1"
                style="flex:1;resize:none;max-height:${ChatBotAI.MAX_INPUT_HEIGHT}px;min-height:${ChatBotAI.MIN_INPUT_HEIGHT}px;"
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
      </div>`;
  }

  /**
   * Attaches event handlers to input and send button
   */
  attachHandlers() {
    const btn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    
    if (!btn || !input) {
      console.error('ChatBot: Required elements not found');
      return;
    }

    // Send on button click
    btn.addEventListener('click', () => this._onSubmit());
    
    // Send on Enter (without Shift)
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this._onSubmit();
      }
    });
    
    // Auto-resize textarea as user types
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, ChatBotAI.MAX_INPUT_HEIGHT)}px`;
    });
  }

  /**
   * Handles message submission
   */
  _onSubmit() {
    const input = document.getElementById('chatbot-input');
    const btn = document.getElementById('chatbot-send');
    const text = input?.value.trim();
    
    if (!text || btn?.disabled) return;
    
    // Add user message and reset input
    this._pushMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    
    // Get bot response
    this._callBot(text);
  }

  /**
   * Adds a message to the chat interface and history
   * @param {string} text - Message content
   * @param {string} sender - 'user' or 'bot'
   */
  _pushMessage(text, sender) {
    const container = document.querySelector('.chatbot-messages');
    if (!container) return;

    // Store in message history
    this.messages.push({
      text,
      sender,
      timestamp: Date.now()
    });

    // Create and style message bubble
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.style.cssText = this._getBubbleStyles(sender);
    bubble.textContent = text;
    
    container.appendChild(bubble);
    this._scrollToBottom(container);
  }

  /**
   * Returns styles for message bubbles
   */
  _getBubbleStyles(sender) {
    const baseStyles = 'padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;';
    
    if (sender === 'user') {
      return baseStyles + 'align-self:flex-end;background:var(--neuro-accent);color:#fff;border-bottom-right-radius:0.25rem;';
    }
    
    return baseStyles + 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
  }

  /**
   * Calls AI API and streams response
   * @param {string} userText - User's message
   */
  async _callBot(userText) {
    const btn = document.getElementById('chatbot-send');
    const container = document.querySelector('.chatbot-messages');
    if (!btn || !container) return;

    // Disable input and show loading
    btn.disabled = true;
    btn.innerHTML = this._getSpinnerIcon();
    this.abortCtrl = new AbortController();

    // Create bot response bubble
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    bubble.style.cssText = this._getBubbleStyles('bot');
    container.appendChild(bubble);
    this._scrollToBottom(container);

    try {
      const response = await fetch(ChatBotAI.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
        signal: this.abortCtrl.signal
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      // Stream response chunks
      await this._streamResponse(response, bubble, container);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        bubble.textContent = 'Request cancelled.';
      } else {
        console.error('ChatBot API error:', err);
        bubble.textContent = ChatBotAI.ERROR_MESSAGE;
        bubble.style.background = 'rgba(239, 68, 68, 0.1)';
        bubble.style.borderLeft = '3px solid #ef4444';
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = this._getSendIcon();
      this.abortCtrl = null;
    }
  }

  /**
   * Streams and displays response chunks
   */
  async _streamResponse(response, bubble, container) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      bubble.textContent = buffer;
      this._scrollToBottom(container);
    }
    
    // Store final bot message in history
    this.messages.push({
      text: buffer,
      sender: 'bot',
      timestamp: Date.now()
    });
  }

  /**
   * Scrolls container to bottom
   */
  _scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Returns send icon SVG
   */
  _getSendIcon() {
    return `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;" aria-hidden="true">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>`;
  }

  /**
   * Returns loading spinner HTML
   */
  _getSpinnerIcon() {
    return '<div class="spinner" aria-label="Loading"></div>';
  }

  /**
   * Cleanup method - aborts pending requests
   */
  destroy() {
    this.abortCtrl?.abort();
    this.messages = [];
    this.isInitialized = false;
  }
}

// Inject spinner styles globally (only once)
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
    @keyframes spin { 
      to { transform: rotate(360deg); } 
    }
  `;
  document.head.appendChild(style);
}

export default ChatBotAI;