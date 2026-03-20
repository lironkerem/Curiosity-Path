// Features/ChatBotAI.js - AI Chat Assistant Module

/**
 * ChatBotAI - Handles AI chat interface and interactions
 * Streaming responses, abort capability, conversation history
 */

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Safe localStorage wrapper
const ls = {
  get:    k      => { try { return localStorage.getItem(k); }    catch { return null; } },
  set:    (k, v) => { try { localStorage.setItem(k, v); }        catch { /* noop */  } },
  remove: k      => { try { localStorage.removeItem(k); }        catch { /* noop */  } }
};

export class ChatBotAI {
  static API_URL          = '/api/chat';
  static MAX_INPUT_HEIGHT = 120;
  static MIN_INPUT_HEIGHT = 52;
  static GREETING         = 'Hello! How can I help you today my friend?';
  static ERROR_MESSAGE    = 'Sorry, something went wrong. Please try again.';
  static LS_KEY           = 'chatbot_conversations';
  static MAX_MESSAGE_LEN  = 4000; // input length cap

  constructor(app) {
    this.app = app;
    this.messages = [];
    this.abortCtrl = null;
    this.isInitialized = false;
    this.currentConversationId = null;
    this.conversations = [];
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  render() {
    const tab = this._getOrCreateTab();
    if (this.isInitialized) { this._showTab(tab); return; }
    tab.innerHTML = this._getHTML();
    this.attachHandlers();
    this._startNewConversation();
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
                  style="--header-img:url('/public/Tabs/Chat.webp');
                         --header-title:'';
                         --header-tag:'Ask me anything about spirituality, self-development, guidance, or just chat with me'">
            <h1>Aanandoham's AI Assistant</h1>
            <h3>Ask me anything about spirituality, self-development, guidance, or just chat with me</h3>
            <span class="header-sub"></span>
          </header>

          <div class="card" style="display:flex;flex-direction:column;height:calc(100vh - 300px);min-height:500px;">

            <!-- Toolbar -->
            <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;align-items:center;">
              <button id="chatbot-history-btn" type="button" class="btn btn-primary"
                      style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;min-width:52px;height:52px;padding:0 1rem;"
                      aria-label="Conversation history">
                ${this._getHistoryIcon()} History
              </button>
              <button id="chatbot-new-btn" type="button" class="btn btn-primary"
                      style="display:flex;align-items:center;gap:0.4rem;font-size:0.85rem;min-width:52px;height:52px;padding:0 1rem;"
                      aria-label="New conversation">
                ${this._getPlusIcon()} New Chat
              </button>
            </div>

            <!-- Messages -->
            <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages"
                 style="flex:1;overflow-y:auto;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;background:var(--neuro-bg);border-radius:12px;margin-bottom:1rem;">
            </div>

            <!-- Input row -->
            <div style="display:flex;gap:0.75rem;align-items:flex-end;">
              <textarea
                id="chatbot-input"
                class="form-input"
                placeholder="Type your message/query/question…"
                rows="1"
                maxlength="${ChatBotAI.MAX_MESSAGE_LEN}"
                style="flex:1;resize:none;max-height:${ChatBotAI.MAX_INPUT_HEIGHT}px;min-height:${ChatBotAI.MIN_INPUT_HEIGHT}px;"
                aria-label="Chat message input"
              ></textarea>
              <button
                id="chatbot-send"
                type="button"
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
            <button id="chatbot-history-close" type="button" aria-label="Close history"
                    style="background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.6;font-size:1.25rem;line-height:1;">✕</button>
          </div>
          <div id="chatbot-history-list"
               style="flex:1;overflow-y:auto;padding:0.75rem;display:flex;flex-direction:column;gap:0.4rem;">
            <p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>
          </div>
        </div>
      </div>`;
  }

  // ─── Event Handlers ───────────────────────────────────────────────────────

  attachHandlers() {
    const btn      = document.getElementById('chatbot-send');
    const input    = document.getElementById('chatbot-input');
    const histBtn  = document.getElementById('chatbot-history-btn');
    const newBtn   = document.getElementById('chatbot-new-btn');
    const modal    = document.getElementById('chatbot-history-modal');
    const closeBtn = document.getElementById('chatbot-history-close');

    if (!btn || !input) { console.error('ChatBotAI: Required elements not found'); return; }

    btn.addEventListener('click',   () => this._onSubmit());
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this._onSubmit(); }
    });
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, ChatBotAI.MAX_INPUT_HEIGHT)}px`;
    });

    histBtn?.addEventListener('click', () => this._openHistoryModal());
    newBtn?.addEventListener('click',  () => this._startNewConversation());
    closeBtn?.addEventListener('click',() => this._closeHistoryModal());
    modal?.addEventListener('click',   e => { if (e.target === modal) this._closeHistoryModal(); });
  }

  // ─── Conversation Management ──────────────────────────────────────────────

  _startNewConversation() {
    this.currentConversationId = null;
    this.messages = [];
    const container = document.querySelector('.chatbot-messages');
    if (container) container.innerHTML = '';
    this._pushMessage(ChatBotAI.GREETING, 'bot');
  }

  async _openHistoryModal() {
    const modal = document.getElementById('chatbot-history-modal');
    if (modal) { modal.style.display = 'flex'; }
    await this._loadAndRenderHistory();
  }

  _closeHistoryModal() {
    const modal = document.getElementById('chatbot-history-modal');
    if (modal) modal.style.display = 'none';
  }

  async _loadAndRenderHistory() {
    const list = document.getElementById('chatbot-history-list');
    if (!list) return;
    list.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">Loading…</p>';

    let convos = [];

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
      console.warn('ChatBotAI: Supabase history load failed, falling back to localStorage', e);
    }

    if (!convos.length) {
      convos = this._getLSConversations().map(c => ({
        id: c.id, title: c.title,
        created_at: c.created_at, updated_at: c.updated_at
      }));
    }

    this.conversations = convos;
    this._renderHistoryList(convos);
  }

  _renderHistoryList(convos) {
    const list = document.getElementById('chatbot-history-list');
    if (!list) return;

    if (!convos.length) {
      list.innerHTML = '<p style="text-align:center;opacity:0.5;padding:2rem 0;margin:0;">No saved conversations yet.</p>';
      return;
    }

    list.innerHTML = '';
    convos.forEach(c => {
      const date = new Date(c.updated_at || c.created_at)
        .toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      const isActive = c.id === this.currentConversationId;

      const row = document.createElement('div');
      row.dataset.convoId = c.id;
      row.style.cssText = `display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem;border-radius:10px;cursor:pointer;background:${isActive ? 'var(--neuro-accent,#7c6ef2)22' : 'transparent'};border:1px solid ${isActive ? 'var(--neuro-accent,#7c6ef2)44' : 'transparent'};transition:background 0.15s;`;
      row.addEventListener('mouseover', () => { row.style.background = 'var(--neuro-bg,#2a2a3e)'; });
      row.addEventListener('mouseout',  () => { row.style.background = isActive ? 'var(--neuro-accent,#7c6ef2)22' : 'transparent'; });

      const info = document.createElement('div');
      info.style.cssText = 'flex:1;min-width:0;';

      const titleDiv = document.createElement('div');
      titleDiv.style.cssText = 'font-size:0.9rem;color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
      titleDiv.textContent = c.title; // textContent is safe — no XSS

      const dateDiv = document.createElement('div');
      dateDiv.style.cssText = 'font-size:0.75rem;opacity:0.45;margin-top:2px;';
      dateDiv.textContent = date;

      info.appendChild(titleDiv);
      info.appendChild(dateDiv);

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.dataset.deleteId = c.id;
      delBtn.setAttribute('aria-label', 'Delete conversation');
      delBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:var(--neuro-text);opacity:0.3;font-size:1rem;padding:0.25rem 0.4rem;margin-left:0.5rem;border-radius:6px;flex-shrink:0;';
      delBtn.textContent = '✕';
      delBtn.addEventListener('mouseover', () => { delBtn.style.opacity = '0.8'; delBtn.style.color = '#ef4444'; });
      delBtn.addEventListener('mouseout',  () => { delBtn.style.opacity = '0.3'; delBtn.style.color = 'var(--neuro-text)'; });

      row.appendChild(info);
      row.appendChild(delBtn);

      row.addEventListener('click', e => {
        if (e.target.closest('[data-delete-id]')) {
          e.stopPropagation();
          this._deleteConversation(delBtn.dataset.deleteId);
        } else {
          this._loadConversation(row.dataset.convoId);
        }
      });

      list.appendChild(row);
    });
  }

  async _loadConversation(id) {
    let messages = null;

    try {
      const supabase = this._getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('chat_conversations').select('messages').eq('id', id).single();
        if (!error && data) messages = data.messages;
      }
    } catch { /* fallback */ }

    if (!messages) {
      const stored = this._getLSConversations();
      const found = stored.find(c => c.id === id);
      if (found) messages = found.messages;
    }

    if (!messages) return;

    this.currentConversationId = id;
    this.messages = messages;

    const container = document.querySelector('.chatbot-messages');
    if (!container) return;
    container.innerHTML = '';
    messages.forEach(m => this._renderBubble(m.text, m.sender));
    this._scrollToBottom(container);
    this._closeHistoryModal();
  }

  async _deleteConversation(id) {
    try {
      const supabase = this._getSupabase();
      if (supabase) await supabase.from('chat_conversations').delete().eq('id', id);
    } catch { /* ignore */ }

    const updated = this._getLSConversations().filter(c => c.id !== id);
    this._saveLSConversations(updated);

    if (this.currentConversationId === id) this._startNewConversation();
    await this._loadAndRenderHistory();
  }

  // ─── Save Conversation ────────────────────────────────────────────────────

  async _saveConversation() {
    if (!this.messages.length) return;

    const firstUser = this.messages.find(m => m.sender === 'user');
    const rawTitle  = firstUser
      ? firstUser.text.slice(0, 60) + (firstUser.text.length > 60 ? '…' : '')
      : 'Conversation';

    const payload = {
      title:      rawTitle,
      messages:   this.messages,
      updated_at: new Date().toISOString()
    };

    try {
      const supabase = this._getSupabase();
      if (supabase) {
        if (this.currentConversationId) {
          await supabase.from('chat_conversations').update(payload).eq('id', this.currentConversationId);
        } else {
          const { data, error } = await supabase
            .from('chat_conversations').insert({ ...payload }).select('id').single();
          if (!error && data) this.currentConversationId = data.id;
        }
      }
    } catch (e) {
      console.warn('ChatBotAI: Supabase save failed, using localStorage only', e);
    }

    const stored = this._getLSConversations();
    const now    = new Date().toISOString();

    if (this.currentConversationId) {
      const idx = stored.findIndex(c => c.id === this.currentConversationId);
      if (idx >= 0) stored[idx] = { ...stored[idx], ...payload };
      else          stored.unshift({ id: this.currentConversationId, ...payload, created_at: now });
    } else {
      const newId = crypto.randomUUID();
      this.currentConversationId = newId;
      stored.unshift({ id: newId, ...payload, created_at: now });
    }

    this._saveLSConversations(stored.slice(0, 100));
  }

  // ─── Message Flow ─────────────────────────────────────────────────────────

  _onSubmit() {
    const input = document.getElementById('chatbot-input');
    const btn   = document.getElementById('chatbot-send');
    const raw   = input?.value.trim();
    if (!raw || btn?.disabled) return;

    // Enforce length cap (belt-and-suspenders beyond maxlength attribute)
    const text = raw.slice(0, ChatBotAI.MAX_MESSAGE_LEN);

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
    bubble.textContent = text; // textContent — safe, no XSS
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

    btn.disabled  = true;
    btn.innerHTML = this._getSpinnerIcon();
    this.abortCtrl = new AbortController();

    const bubble = document.createElement('div');
    bubble.className  = 'chat-bubble bot';
    bubble.style.cssText = this._getBubbleStyles('bot');
    container.appendChild(bubble);
    this._scrollToBottom(container);

    try {
      const response = await fetch(ChatBotAI.API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: userText }),
        signal:  this.abortCtrl.signal
      });
      if (!response.ok) throw new Error(await response.text());
      await this._streamResponse(response, bubble, container);
    } catch (err) {
      if (err.name === 'AbortError') {
        bubble.textContent = 'Request cancelled.';
      } else {
        console.error('ChatBotAI API error:', err);
        bubble.textContent = ChatBotAI.ERROR_MESSAGE;
        bubble.style.background   = 'rgba(239,68,68,0.1)';
        bubble.style.borderLeft   = '3px solid #ef4444';
      }
    } finally {
      btn.disabled  = false;
      btn.innerHTML = this._getSendIcon();
      this.abortCtrl = null;
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
      bubble.textContent = buffer; // textContent — safe
      this._scrollToBottom(container);
    }

    this.messages.push({ text: buffer, sender: 'bot', timestamp: Date.now() });
  }

  // ─── localStorage Helpers ─────────────────────────────────────────────────

  _getLSConversations() {
    try { return JSON.parse(ls.get(ChatBotAI.LS_KEY) || '[]'); }
    catch { return []; }
  }

  _saveLSConversations(list) {
    try { ls.set(ChatBotAI.LS_KEY, JSON.stringify(list)); }
    catch (e) { console.warn('ChatBotAI: localStorage save failed', e); }
  }

  // ─── Supabase Helper ──────────────────────────────────────────────────────

  _getSupabase() {
    return this.app?.supabase || this.app?.core?.supabase || window.supabase || null;
  }

  // ─── Utilities ────────────────────────────────────────────────────────────

  _scrollToBottom(container) { container.scrollTop = container.scrollHeight; }

  _getSendIcon() {
    return `<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:currentColor;" aria-hidden="true" focusable="false"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;
  }

  _getSpinnerIcon() {
    return '<div class="spinner" role="status" aria-label="Loading"></div>';
  }

  _getHistoryIcon() {
    return `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true" focusable="false"><path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`;
  }

  _getPlusIcon() {
    return `<svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;" aria-hidden="true" focusable="false"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  destroy() {
    this.abortCtrl?.abort();
    this.messages = [];
    this.isInitialized = false;
    this.currentConversationId = null;
  }
}

// Inject spinner styles (once)
if (typeof document !== 'undefined' && !document.getElementById('chatbot-spinner-style')) {
  const style = document.createElement('style');
  style.id = 'chatbot-spinner-style';
  style.textContent = `
    .spinner {
      width:20px;height:20px;
      border:2px solid rgba(255,255,255,0.3);
      border-top-color:#fff;
      border-radius:50%;
      animation:spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform:rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

export default ChatBotAI;
