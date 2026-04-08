// Features/ChatBotAI.js - AI Chat Assistant Module

/**
 * ChatBotAI - Handles AI chat interface and interactions
 * Provides streaming responses, abort capability, and conversation history
 */
export class ChatBotAI {
  // Configuration constants
  static API_URL = '/api/chat';
  static MAX_INPUT_HEIGHT = 120;
  static MIN_INPUT_HEIGHT = 52;
  static GREETING = 'Hello! How can I help you today my friend?';
  static ERROR_MESSAGE = 'Sorry, something went wrong. Please try again.';
  static LS_KEY = 'chatbot_conversations';

  constructor(app) {
    this.app = app;
    this.messages = [];
    this.abortCtrl = null;
    this.isInitialized = false;
    this.currentConversationId = null;
    this.conversations = []; // cached list
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  render() {
    const tab = this._getOrCreateTab();

    if (this.isInitialized) {
      this._showTab(tab);
      return;
    }

    tab.innerHTML = this._getHTML();
    this.attachHandlers();
    this._startNewConversation(false); // start fresh, no greeting yet
    this.isInitialized = true;
  }

  _getOrCreateTab() {
    let tab = document.getElementById('chatbot-tab');
    if (!tab) {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) throw new Error('Required element #main-content not found');
      tab = document.createElement('div');
      tab.id = 'chatbot-tab';
      tab.className = 'tab-content';
      mainContent.appendChild(tab);
    }
    this._showTab(tab);
    return tab;
  }

  _showTab(tab) {
    tab.classList.add('active');
    tab.style.display = 'block';
    tab.setAttribute('aria-hidden', 'false');
  }

  // ─── HTML Template ────────────────────────────────────────────────────────

  _getHTML() {
    return `
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
      </div>`;
  }

  // ─── Event Handlers ───────────────────────────────────────────────────────

  attachHandlers() {
    const btn   = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');
    const histBtn   = document.getElementById('chatbot-history-btn');
    const newBtn    = document.getElementById('chatbot-new-btn');
    const modal     = document.getElementById('chatbot-history-modal');
    const closeBtn  = document.getElementById('chatbot-history-close');

    if (!btn || !input) { console.error('ChatBot: Required elements not found'); return; }

    btn.addEventListener('click', () => this._onSubmit());
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._onSubmit(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, ChatBotAI.MAX_INPUT_HEIGHT)}px`;
    });

    histBtn.addEventListener('click', () => this._openHistoryModal());
    newBtn.addEventListener('click',  () => this._startNewConversation(true));

    closeBtn.addEventListener('click', () => this._closeHistoryModal());
    modal.addEventListener('click', e => { if (e.target === modal) this._closeHistoryModal(); });
  }

  // ─── Conversation Management ──────────────────────────────────────────────

  _startNewConversation(showGreeting = true) {
    this.currentConversationId = null;
    this.messages = [];
    const container = document.querySelector('.chatbot-messages');
    if (container) container.innerHTML = '';
    if (showGreeting) this._pushMessage(ChatBotAI.GREETING, 'bot');
    else              this._pushMessage(ChatBotAI.GREETING, 'bot'); // always greet on new
  }

  async _openHistoryModal() {
    const modal = document.getElementById('chatbot-history-modal');
    modal.style.display = 'flex';
    await this._loadAndRenderHistory();
  }

  _closeHistoryModal() {
    const modal = document.getElementById('chatbot-history-modal');
    modal.style.display = 'none';
  }

  async _loadAndRenderHistory() {
    const list = document.getElementById('chatbot-history-list');
    list.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>';

    let convos = [];

    // Try Supabase first
    try {
      const supabase = this._getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('id, title, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .limit(50);
        if (!error && data) convos = data;
      }
    } catch (e) {
      console.warn('ChatBot: Supabase history load failed, falling back to localStorage', e);
    }

    // Fallback to localStorage
    if (!convos.length) {
      convos = this._getLSConversations().map(c => ({
        id: c.id,
        title: c.title,
        created_at: c.created_at,
        updated_at: c.updated_at
      }));
    }

    this.conversations = convos;
    this._renderHistoryList(convos);
  }

  _renderHistoryList(convos) {
    const list = document.getElementById('chatbot-history-list');

    if (!convos.length) {
      list.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">No saved conversations yet.</p>';
      return;
    }

    list.innerHTML = convos.map(c => {
      const date = new Date(c.updated_at || c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      const isActive = c.id === this.currentConversationId;
      return `
        <div data-convo-id="${c.id}"
             style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;cursor:pointer;
                    background:${isActive ? 'var(--neuro-accent,#7c6ef2)22' : 'transparent'};
                    border:1px solid ${isActive ? 'var(--neuro-accent,#7c6ef2)44' : 'transparent'};
                    transition:background 0.15s;"
             onmouseover="this.style.background='var(--neuro-bg,#2a2a3e)'"
             onmouseout="this.style.background='${isActive ? 'var(--neuro-accent,#7c6ef2)22' : 'transparent'}'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.9rem;color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${this._escapeHTML(c.title)}</div>
            <div style="font-size:0.75rem;opacity:0.45;margin-top:2px;">${date}</div>
          </div>
          <button data-delete-id="${c.id}" aria-label="Delete conversation"
                  style="background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.3;font-size:1rem;padding:0.25rem 0.4rem;margin-left:0.5rem;border-radius:6px;flex-shrink:0;"
                  onmouseover="this.style.opacity='0.8';this.style.color='#ef4444'"
                  onmouseout="this.style.opacity='0.3';this.style.color='var(--neuro-text)'">✕</button>
        </div>`;
    }).join('');

    // Load on row click, delete on ✕
    list.querySelectorAll('[data-convo-id]').forEach(row => {
      row.addEventListener('click', e => {
        const deleteBtn = e.target.closest('[data-delete-id]');
        if (deleteBtn) {
          e.stopPropagation();
          this._deleteConversation(deleteBtn.dataset.deleteId);
        } else {
          this._loadConversation(row.dataset.convoId);
        }
      });
    });
  }

  async _loadConversation(id) {
    let messages = null;

    // Try Supabase
    try {
      const supabase = this._getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('chat_conversations')
          .select('messages')
          .eq('id', id)
          .single();
        if (!error && data) messages = data.messages;
      }
    } catch (e) { /* fallback */ }

    // Fallback to localStorage
    if (!messages) {
      const ls = this._getLSConversations();
      const found = ls.find(c => c.id === id);
      if (found) messages = found.messages;
    }

    if (!messages) return;

    this.currentConversationId = id;
    this.messages = messages;

    // Re-render messages
    const container = document.querySelector('.chatbot-messages');
    if (!container) return;
    container.innerHTML = '';
    messages.forEach(m => this._renderBubble(m.text, m.sender));
    this._scrollToBottom(container);

    this._closeHistoryModal();
  }

  async _deleteConversation(id) {
    // Supabase delete
    try {
      const supabase = this._getSupabase();
      if (supabase) await supabase.from('chat_conversations').delete().eq('id', id);
    } catch (e) { /* ignore */ }

    // localStorage delete
    const ls = this._getLSConversations().filter(c => c.id !== id);
    this._saveLSConversations(ls);

    // If deleting current, start fresh
    if (this.currentConversationId === id) this._startNewConversation(false);

    // Refresh list
    await this._loadAndRenderHistory();
  }

  // ─── Save Conversation ────────────────────────────────────────────────────

  async _saveConversation() {
    if (!this.messages.length) return;

    // Auto-title from first user message
    const firstUserMsg = this.messages.find(m => m.sender === 'user');
    const title = firstUserMsg
      ? firstUserMsg.text.slice(0, 60) + (firstUserMsg.text.length > 60 ? '…' : '')
      : 'Conversation';

    const payload = {
      title,
      messages: this.messages,
      updated_at: new Date().toISOString()
    };

    // Supabase
    try {
      const supabase = this._getSupabase();
      if (supabase) {
        if (this.currentConversationId) {
          await supabase.from('chat_conversations').update(payload).eq('id', this.currentConversationId);
        } else {
          const { data, error } = await supabase.from('chat_conversations').insert({ ...payload }).select('id').single();
          if (!error && data) this.currentConversationId = data.id;
        }
      }
    } catch (e) {
      console.warn('ChatBot: Supabase save failed, using localStorage only', e);
    }

    // localStorage mirror
    const ls = this._getLSConversations();
    const now = new Date().toISOString();
    if (this.currentConversationId) {
      const idx = ls.findIndex(c => c.id === this.currentConversationId);
      if (idx >= 0) ls[idx] = { ...ls[idx], ...payload };
      else          ls.unshift({ id: this.currentConversationId, ...payload, created_at: now });
    } else {
      const newId = crypto.randomUUID();
      this.currentConversationId = newId;
      ls.unshift({ id: newId, ...payload, created_at: now });
    }
    this._saveLSConversations(ls.slice(0, 100)); // cap at 100
  }

  // ─── Message Flow ─────────────────────────────────────────────────────────

  _onSubmit() {
    const input = document.getElementById('chatbot-input');
    const btn   = document.getElementById('chatbot-send');
    const text  = input?.value.trim();
    if (!text || btn?.disabled) return;

    this._pushMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    this._callBot(text);
  }

  _pushMessage(text, sender) {
    const container = document.querySelector('.chatbot-messages');
    if (!container) return;

    this.messages.push({ text, sender, timestamp: Date.now() });
    this._renderBubble(text, sender);
    this._scrollToBottom(container);
  }

  _renderBubble(text, sender) {
    const container = document.querySelector('.chatbot-messages');
    if (!container) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.style.cssText = this._getBubbleStyles(sender);
    bubble.textContent = text;
    container.appendChild(bubble);
    return bubble;
  }

  _getBubbleStyles(sender) {
    const base = 'padding:0.875rem 1.25rem;border-radius:1rem;max-width:80%;word-wrap:break-word;';
    return sender === 'user'
      ? base + 'align-self:flex-end;background:var(--neuro-accent);color:#fff;border-bottom-right-radius:0.25rem;'
      : base + 'align-self:flex-start;background:var(--neuro-bg-secondary);color:var(--neuro-text);border-bottom-left-radius:0.25rem;box-shadow:var(--neuro-shadow-sm);';
  }

  // ─── API Call ─────────────────────────────────────────────────────────────

  async _callBot(userText) {
    const btn       = document.getElementById('chatbot-send');
    const container = document.querySelector('.chatbot-messages');
    if (!btn || !container) return;

    btn.disabled = true;
    btn.innerHTML = this._getSpinnerIcon();
    this.abortCtrl = new AbortController();

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
      if (!response.ok) throw new Error(await response.text());
      await this._streamResponse(response, bubble, container);
    } catch (err) {
      if (err.name === 'AbortError') {
        bubble.textContent = 'Request cancelled.';
      } else {
        console.error('ChatBot API error:', err);
        bubble.textContent = ChatBotAI.ERROR_MESSAGE;
        bubble.style.background = 'rgba(239,68,68,0.1)';
        bubble.style.borderLeft = '3px solid #ef4444';
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = this._getSendIcon();
      this.abortCtrl = null;
      // Auto-save after each bot response
      await this._saveConversation();
    }
  }

  async _streamResponse(response, bubble, container) {
    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      bubble.textContent = buffer;
      this._scrollToBottom(container);
    }

    this.messages.push({ text: buffer, sender: 'bot', timestamp: Date.now() });
  }

  // ─── localStorage Helpers ─────────────────────────────────────────────────

  _getLSConversations() {
    try { return JSON.parse(localStorage.getItem(ChatBotAI.LS_KEY) || '[]'); }
    catch { return []; }
  }

  _saveLSConversations(list) {
    try { localStorage.setItem(ChatBotAI.LS_KEY, JSON.stringify(list)); }
    catch (e) { console.warn('ChatBot: localStorage save failed', e); }
  }

  // ─── Supabase Helper ──────────────────────────────────────────────────────

  _getSupabase() {
    // Tries common patterns used across the app to find the Supabase client
    return this.app?.supabase
      || this.app?.core?.supabase
      || window.supabase
      || null;
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  _scrollToBottom(container) { container.scrollTop = container.scrollHeight; }

  _escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  _getSendIcon() {
    return `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
  }

  _getSpinnerIcon() { return '<div class="spinner" aria-label="Loading"></div>'; }

  _getHistoryIcon() {
    return `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
  }

  _getPlusIcon() {
    return `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  destroy() {
    this.abortCtrl?.abort();
    this.messages = [];
    this.isInitialized = false;
    this.currentConversationId = null;
  }
}

// Inject spinner styles globally (only once)
if (!document.getElementById('chatbot-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'chatbot-spinner-style';
  style.textContent = `
    .spinner {
      width: 20px; height: 20px;
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
