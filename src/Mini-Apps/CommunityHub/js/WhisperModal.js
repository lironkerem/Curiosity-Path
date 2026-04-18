/**
 * WHISPER MODAL
 * Full private messaging UI for the Community Hub.
 * @version 1.3.0
 *
 * Changes from 1.2.0:
 * - Fix: unread badge inside inbox row is cleared immediately on thread open
 * - UI: larger modal, no back-arrow, cleaner professional layout
 */

import { CommunityDB } from './community-supabase.js';

const WhisperModal = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        isOpen:            false,
        view:              'inbox',  // 'inbox' | 'thread'
        threadPartnerId:   null,
        threadPartnerName: null,
        realtimeSub:       null,
        bgSub:             null,
    },

    // ============================================================================
    // INIT
    // ============================================================================

    init() {
        if (document.getElementById('whisperModal')) return;

        const shell = document.createElement('div');
        shell.innerHTML = `
            <div id="whisperModal"
                 role="dialog" aria-modal="true" aria-label="Whispers"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);
                        align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">

                <div id="whisperModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);
                            border-radius:24px;padding:0;
                            width:min(580px,95vw);max-height:88vh;
                            position:relative;display:flex;flex-direction:column;
                            overflow:hidden;
                            box-shadow:12px 12px 32px rgba(0,0,0,0.18),-6px -6px 18px rgba(255,255,255,0.65);
                            transform:translateY(20px);transition:transform 0.25s ease;">

                    <!-- Header -->
                    <div id="whisperModalHeader"
                         style="display:flex;align-items:center;gap:12px;
                                padding:1.4rem 1.75rem 1.2rem;
                                border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;
                                background:var(--neuro-bg-lighter,#e8e8eb);">

                        <div style="width:38px;height:38px;border-radius:50%;
                                    background:var(--neuro-accent-a10,rgba(107,155,55,0.1));
                                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                 viewBox="0 0 24 24" fill="none" stroke="var(--neuro-accent)"
                                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>

                        <div style="flex:1;min-width:0;">
                            <div id="whisperModalTitle"
                                 style="font-size:1.05rem;font-weight:700;
                                        color:var(--neuro-text);
                                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                                Whispers
                            </div>
                            <div id="whisperModalSubtitle"
                                 style="font-size:0.75rem;color:var(--text-muted);
                                        margin-top:2px;display:none;
                                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            </div>
                        </div>

                        <!-- View switcher pill (only visible in thread view) -->
                        <button id="whisperBackBtn"
                                onclick="WhisperModal._showInbox()"
                                aria-label="All conversations"
                                style="display:none;background:var(--neuro-bg);border:1px solid rgba(0,0,0,0.1);
                                       border-radius:99px;padding:5px 14px;font-size:0.78rem;font-weight:600;
                                       color:var(--text-muted);cursor:pointer;white-space:nowrap;
                                       transition:background 0.15s,color 0.15s;">
                            All Whispers
                        </button>

                        <button onclick="WhisperModal.close()" aria-label="Close"
                                style="width:32px;height:32px;border-radius:50%;
                                       background:rgba(0,0,0,0.06);border:none;cursor:pointer;
                                       font-size:16px;color:var(--text-muted);line-height:1;
                                       display:flex;align-items:center;justify-content:center;
                                       flex-shrink:0;transition:background 0.15s;">✕</button>
                    </div>

                    <!-- Inbox view -->
                    <div id="whisperInboxView" style="flex:1;overflow-y:auto;padding:0.5rem 0;">
                        <div id="whisperInboxLoading"
                             style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading conversations...
                        </div>
                        <div id="whisperInboxEmpty"
                             style="display:none;text-align:center;padding:3.5rem 1.5rem;">
                            <div style="width:56px;height:56px;border-radius:50%;
                                        background:var(--neuro-accent-a10,rgba(107,155,55,0.1));
                                        display:flex;align-items:center;justify-content:center;
                                        margin:0 auto 1rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                     viewBox="0 0 24 24" fill="none" stroke="var(--neuro-accent)"
                                     stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                            </div>
                            <div style="font-size:0.95rem;font-weight:600;color:var(--neuro-text);margin-bottom:6px;">
                                No whispers yet
                            </div>
                            <div style="font-size:0.82rem;color:var(--text-muted);">
                                Visit a member's profile to send one.
                            </div>
                        </div>
                        <div id="whisperInboxList"></div>
                    </div>

                    <!-- Thread view -->
                    <div id="whisperThreadView"
                         style="display:none;flex:1;overflow-y:auto;
                                padding:1rem 1.25rem;flex-direction:column;gap:10px;">
                        <div id="whisperThreadLoading"
                             style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading messages...
                        </div>
                        <div id="whisperThreadMessages" style="display:flex;flex-direction:column;gap:10px;"></div>
                    </div>

                    <!-- Reply bar (thread view only) -->
                    <div id="whisperReplyBar"
                         style="display:none;padding:1rem 1.25rem 1.25rem;
                                border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;
                                background:var(--neuro-bg-lighter,#e8e8eb);">
                        <div style="display:flex;gap:10px;align-items:flex-end;">
                            <textarea id="whisperReplyText" placeholder="Write a whisper…"
                                      maxlength="500" rows="2"
                                      onkeydown="WhisperModal._replyKeydown(event)"
                                      style="flex:1;padding:12px 14px;border-radius:14px;
                                             border:1.5px solid rgba(0,0,0,0.10);font-size:0.9rem;
                                             resize:none;background:var(--neuro-bg);color:var(--neuro-text);
                                             box-sizing:border-box;font-family:inherit;
                                             box-shadow:inset 2px 2px 5px rgba(0,0,0,0.06);
                                             transition:border-color 0.15s;outline:none;"
                                      onfocus="this.style.borderColor='var(--neuro-accent)'"
                                      onblur="this.style.borderColor='rgba(0,0,0,0.10)'"></textarea>
                            <button id="whisperReplyBtn" onclick="WhisperModal._sendReply()"
                                    style="padding:12px 20px;border-radius:14px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:700;
                                           background:var(--neuro-accent,#6b9b37);color:#fff;
                                           white-space:nowrap;align-self:flex-end;
                                           box-shadow:3px 3px 8px rgba(0,0,0,0.12);
                                           transition:opacity 0.15s,transform 0.15s;"
                                    onmouseover="this.style.opacity='0.88';this.style.transform='translateY(-1px)'"
                                    onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'">
                                Send
                            </button>
                        </div>
                        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:6px;text-align:right;">
                            ⌘ + Enter to send
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(shell.firstElementChild);
        document.getElementById('whisperModal').addEventListener('click', (e) => {
            if (e.target.id === 'whisperModal') this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) this.close();
        });

        const tryBg = () => {
            if (CommunityDB?.ready) { this.startBackgroundListener(); }
            else setTimeout(tryBg, 500);
        };
        tryBg();
    },

    // ============================================================================
    // OPEN / CLOSE
    // ============================================================================

    async open() {
        this._openShared();
        await this._showInbox();
    },

    async openThread(userId, name, emoji, avatarUrl) {
        this._openShared();
        await this._showThread(userId, name, emoji, avatarUrl);
    },

    _openShared() {
        this.init();
        this._animateIn();
        this.state.isOpen = true;
        document.body.style.overflow = 'hidden';
        this._subscribeRealtime();
    },

    close() {
        const modal = document.getElementById('whisperModal');
        const inner = document.getElementById('whisperModalInner');
        if (!modal) return;

        modal.style.opacity   = '0';
        inner.style.transform = 'translateY(20px)';

        setTimeout(() => {
            modal.style.display        = 'none';
            this.state.isOpen          = false;
            this.state.view            = 'inbox';
            this.state.threadPartnerId = null;
            document.body.style.overflow = '';
            this.state.realtimeSub?.unsubscribe?.();
            this.state.realtimeSub = null;
        }, 250);
    },

    _animateIn() {
        const modal = document.getElementById('whisperModal');
        const inner = document.getElementById('whisperModalInner');
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity   = '1';
            inner.style.transform = 'translateY(0)';
        });
    },

    // ============================================================================
    // VIEW SWITCHING
    // ============================================================================

    _setView(view) {
        const isInbox = view === 'inbox';
        document.getElementById('whisperInboxView').style.display  = isInbox ? 'block' : 'none';
        document.getElementById('whisperThreadView').style.display  = isInbox ? 'none'  : 'flex';
        document.getElementById('whisperReplyBar').style.display    = isInbox ? 'none'  : 'block';

        // Show "All Whispers" pill only in thread; hide subtitle in inbox
        document.getElementById('whisperBackBtn').style.display     = isInbox ? 'none'  : 'inline-flex';
        const subtitle = document.getElementById('whisperModalSubtitle');

        if (isInbox) {
            document.getElementById('whisperModalTitle').textContent = 'Whispers';
            subtitle.style.display = 'none';
        }
    },

    // ============================================================================
    // INBOX VIEW
    // ============================================================================

    async _showInbox() {
        this.state.view            = 'inbox';
        this.state.threadPartnerId = null;
        this._setView('inbox');

        const loading = document.getElementById('whisperInboxLoading');
        const empty   = document.getElementById('whisperInboxEmpty');
        const list    = document.getElementById('whisperInboxList');

        loading.style.display = 'block';
        empty.style.display   = 'none';
        list.innerHTML        = '';

        const conversations = await CommunityDB.getWhisperInbox();
        loading.style.display = 'none';

        if (!conversations.length) {
            empty.style.display = 'block';
            return;
        }

        list.innerHTML = conversations.map(c => this._conversationRowHTML(c)).join('');
        this._setBadge(conversations.reduce((sum, c) => sum + c.unread, 0));
    },

    _conversationRowHTML(c) {
        const partner    = c.partner || {};
        const name       = this._escape(partner.name || 'Member');
        const avatar     = this._avatarHTML(partner, 44);
        const preview    = this._escape(c.lastMessage || '');
        const time       = this._relativeTime(c.lastAt);
        const safeId     = this._escape(partner.id       || '');
        const safeEmoji  = this._escape(partner.emoji    || '');
        const safeAvatar = this._escape(partner.avatar_url || '');
        const hasUnread  = c.unread > 0;

        return `
            <div data-partner-id="${safeId}"
                 onclick="WhisperModal._showThread('${safeId}','${name}','${safeEmoji}','${safeAvatar}')"
                 style="display:flex;align-items:center;gap:14px;
                        padding:0.9rem 1.75rem;cursor:pointer;
                        transition:background 0.15s;
                        border-bottom:1px solid rgba(0,0,0,0.04);"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">

                <div style="position:relative;flex-shrink:0;">
                    ${avatar}
                    ${hasUnread ? `<span style="position:absolute;top:-2px;right:-2px;
                        width:10px;height:10px;border-radius:50%;
                        background:var(--neuro-accent);border:2px solid var(--neuro-bg);"></span>` : ''}
                </div>

                <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:3px;">
                        <span class="whisper-partner-name"
                              style="font-weight:${hasUnread ? '700' : '500'};font-size:0.9rem;
                                     color:var(--neuro-text);white-space:nowrap;
                                     overflow:hidden;text-overflow:ellipsis;">
                            ${name}
                        </span>
                        <span style="font-size:0.7rem;color:var(--text-muted);flex-shrink:0;">${time}</span>
                    </div>
                    <div style="font-size:0.8rem;color:var(--text-muted);
                                white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
                                font-weight:${hasUnread ? '600' : '400'};">
                        ${preview}
                    </div>
                </div>

                ${hasUnread ? `<span class="whisper-unread-badge"
                    style="background:var(--neuro-accent);color:#fff;border-radius:99px;
                           font-size:0.68rem;font-weight:700;padding:2px 8px;
                           min-width:20px;text-align:center;flex-shrink:0;">
                    ${c.unread}
                </span>` : '<span class="whisper-unread-badge" style="display:none;"></span>'}
            </div>`;
    },

    // ============================================================================
    // THREAD VIEW
    // ============================================================================

    async _showThread(userId, name, emoji, avatarUrl) {
        this.state.view              = 'thread';
        this.state.threadPartnerId   = userId;
        this.state.threadPartnerName = name;
        this._setView('thread');

        document.getElementById('whisperModalTitle').textContent    = name;
        const subtitle = document.getElementById('whisperModalSubtitle');
        subtitle.textContent  = 'Private whisper thread';
        subtitle.style.display = 'block';

        const loading    = document.getElementById('whisperThreadLoading');
        const messages   = document.getElementById('whisperThreadMessages');
        const threadView = document.getElementById('whisperThreadView');

        loading.style.display = 'block';
        messages.innerHTML    = '';

        const [msgs] = await Promise.all([
            CommunityDB.getWhispers(userId),
            CommunityDB.markConversationRead(userId).catch(() => {}),
        ]);
        loading.style.display = 'none';
        this._renderThreadMessages(msgs);

        setTimeout(() => { threadView.scrollTop = threadView.scrollHeight; }, 50);
        document.getElementById('whisperReplyText')?.focus();

        // ── Clear unread indicators in the inbox row immediately ──
        this._clearInboxRowUnread(userId);
        await this.refreshUnreadBadge();
    },

    /** Zero out unread dot + badge + bold styling on the inbox row for `userId`. */
    _clearInboxRowUnread(userId) {
        const row = document.querySelector(`#whisperInboxList [data-partner-id="${userId}"]`);
        if (!row) return;

        // Remove all <span> children of the avatar wrapper that act as the dot
        row.querySelectorAll('span').forEach(el => {
            if (el.style.position === 'absolute') el.remove();
        });

        // Count badge
        const badge = row.querySelector('.whisper-unread-badge');
        if (badge) badge.style.display = 'none';

        // Bold name → normal
        const nameEl = row.querySelector('.whisper-partner-name');
        if (nameEl) nameEl.style.fontWeight = '500';

        // Bold preview → normal (first div after the name row div)
        const nameRow = nameEl?.closest('div[style*="justify-content"]');
        const previewEl = nameRow?.nextElementSibling;
        if (previewEl) previewEl.style.fontWeight = '400';
    },

    _renderThreadMessages(messages) {
        const container = document.getElementById('whisperThreadMessages');
        if (!container) return;

        if (!messages.length) {
            container.innerHTML = `
                <div style="text-align:center;padding:3rem;color:var(--text-muted);font-size:0.85rem;">
                    No messages yet — say something ✨
                </div>`;
            return;
        }

        const myId = CommunityDB._uid;
        container.innerHTML = messages.map(m => {
            const isMe = m.sender_id === myId || m.sender?.id === myId;
            return this._messageBubbleHTML(isMe, this._escape(m.message), this._relativeTime(m.created_at));
        }).join('');
    },

    _appendMessage(message) {
        const container = document.getElementById('whisperThreadMessages');
        if (!container) return;

        container.querySelector('[data-empty]')?.remove();

        const myId = CommunityDB._uid;
        const isMe = message.sender_id === myId;

        const div = document.createElement('div');
        div.innerHTML = this._messageBubbleHTML(isMe, this._escape(message.message), this._relativeTime(message.created_at));
        container.appendChild(div.firstElementChild);

        document.getElementById('whisperThreadView')?.scrollTo({ top: 999999 });
    },

    _messageBubbleHTML(isMe, text, time) {
        return `
            <div style="display:flex;flex-direction:column;
                        align-items:${isMe ? 'flex-end' : 'flex-start'};gap:3px;">
                <div style="max-width:75%;padding:10px 14px;
                            border-radius:${isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
                            background:${isMe ? 'var(--neuro-accent,#6b9b37)' : 'rgba(0,0,0,0.06)'};
                            color:${isMe ? '#fff' : 'var(--neuro-text)'};
                            font-size:0.9rem;line-height:1.5;word-break:break-word;
                            box-shadow:${isMe ? '2px 3px 8px rgba(0,0,0,0.12)' : 'inset 1px 1px 4px rgba(0,0,0,0.05)'};">
                    ${text}
                </div>
                <span style="font-size:0.68rem;color:var(--text-muted);padding:0 4px;">${time}</span>
            </div>`;
    },

    // ============================================================================
    // SEND REPLY
    // ============================================================================

    async _sendReply() {
        const textarea = document.getElementById('whisperReplyText');
        const message  = textarea?.value.trim();
        if (!message || !this.state.threadPartnerId) return;

        const btn = document.getElementById('whisperReplyBtn');
        if (btn) { btn.disabled = true; btn.textContent = '…'; }
        textarea.disabled = true;

        try {
            const ok = await CommunityDB.sendWhisper(this.state.threadPartnerId, message);
            if (ok) {
                textarea.value = '';
                this._appendMessage({
                    sender_id:  CommunityDB._uid,
                    message,
                    created_at: new Date().toISOString(),
                });
            } else {
                window.Core.showToast('Could not send — please try again');
            }
        } catch (err) {
            console.error('[WhisperModal] sendReply error:', err);
            window.Core.showToast('Could not send — please try again');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
            textarea.disabled = false;
            textarea.focus();
        }
    },

    _replyKeydown(e) {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            this._sendReply();
        }
    },

    // ============================================================================
    // REALTIME
    // ============================================================================

    _subscribeRealtime() {
        this.state.realtimeSub?.unsubscribe?.();
        this.state.realtimeSub = CommunityDB.subscribeToWhispers((whisper) => {
            if (this.state.view === 'thread' && whisper.sender_id === this.state.threadPartnerId) {
                this._appendMessage(whisper);
                CommunityDB.markConversationRead(whisper.sender_id).catch(() => {});
            } else {
                window.Core.showToast(`New whisper from ${whisper.sender?.name || 'Someone'}`);
                if (this.state.view === 'inbox') this._showInbox();
                else this.refreshUnreadBadge();
            }
        });
    },

    // ============================================================================
    // UNREAD BADGE
    // ============================================================================

    async refreshUnreadBadge() {
        this._setBadge(await CommunityDB.getUnreadWhisperCount());
    },

    _setBadge(count) {
        const badge = document.getElementById('whisperUnreadBadge');
        if (!badge) return;
        badge.textContent   = count > 99 ? '99+' : count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
    },

    startBackgroundListener() {
        if (this.state.bgSub) return;
        if (!CommunityDB?.ready) return;

        this.refreshUnreadBadge().catch(() => {});

        this.state.bgSub = CommunityDB.subscribeToWhispersBackground((whisper) => {
            if (this.state.isOpen && this.state.view === 'thread' && whisper.sender_id === this.state.threadPartnerId) return;
            this.refreshUnreadBadge().catch(() => {});
        });
    },

    // ============================================================================
    // HELPERS
    // ============================================================================

    _avatarHTML(profile, size = 44) {
        const s = size + 'px';
        if (profile?.avatar_url) {
            return `<img src="${profile.avatar_url}"
                         width="${size}" height="${size}" loading="lazy" decoding="async"
                         style="width:${s};height:${s};border-radius:50%;object-fit:cover;display:block;"
                         alt="${this._escape(profile.name || '')}">`;
        }
        const gradient = window.Core.getAvatarGradient(profile?.id || '');
        const label    = profile?.emoji || (profile?.name || '?').charAt(0).toUpperCase();
        return `<div style="width:${s};height:${s};border-radius:50%;background:${gradient};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(size * 0.42)}px;flex-shrink:0;
                            box-shadow:2px 2px 6px rgba(0,0,0,0.1);">
                    ${this._escape(label)}
                </div>`;
    },

    _relativeTime(iso) {
        if (!iso) return '';
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1)  return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)  return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7)  return `${days}d ago`;
        return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    },

    _escape(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },
};

export { WhisperModal };
window.WhisperModal = WhisperModal;