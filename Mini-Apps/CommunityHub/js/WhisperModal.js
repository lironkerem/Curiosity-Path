/**
 * WHISPER MODAL
 * Full private messaging UI for the Community Hub.
 * @version 1.1.0
 *
 * Features:
 * - Inbox view: list of conversations, unread badge per thread
 * - Thread view: full message history with a partner
 * - Send reply inline (Cmd/Ctrl+Enter or button)
 * - Realtime: new incoming whispers update inbox + open thread live
 * - Unread badge on the inbox trigger button
 *
 * Public API:
 *   WhisperModal.open()                               - open inbox
 *   WhisperModal.openThread(userId, name, emoji, avatarUrl)  - open directly to a thread
 *   WhisperModal.refreshUnreadBadge()                 - update the hub badge
 */

import { CommunityDB } from './community-supabase.js';
import { Core } from './core.js';

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
    },

    // ============================================================================
    // INIT - inject modal shell once
    // ============================================================================

    init() {
        if (document.getElementById('whisperModal')) return;

        const shell = document.createElement('div');
        shell.innerHTML = `
            <div id="whisperModal"
                 role="dialog" aria-modal="true" aria-label="Whispers"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                        display:flex;align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">

                <div id="whisperModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:0;
                            max-width:420px;width:92%;max-height:85vh;position:relative;
                            display:flex;flex-direction:column;overflow:hidden;
                            box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                            transform:translateY(16px);transition:transform 0.25s ease;">

                    <!-- Header -->
                    <div id="whisperModalHeader"
                         style="display:flex;align-items:center;gap:10px;
                                padding:1.1rem 1.25rem 1rem;
                                border-bottom:1px solid rgba(0,0,0,0.07);flex-shrink:0;">
                        <button type="button" id="whisperModalBack" onclick="WhisperModal._showInbox()"
                                aria-label="Back to inbox"
                                style="display:none;background:none;border:none;cursor:pointer;
                                       font-size:1.1rem;padding:0 4px;opacity:0.6;line-height:1;">←</button>
                        <div style="flex:1;">
                            <div id="whisperModalTitle"
                                 style="font-size:1rem;font-weight:700;color:var(--neuro-text);" style="display:flex;align-items:center;gap:0.4rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whispers</div>
                            <div id="whisperModalSubtitle"
                                 style="font-size:0.75rem;color:var(--text-muted);margin-top:1px;display:none;"></div>
                        </div>
                        <button type="button" onclick="WhisperModal.close()" aria-label="Close"
                                style="background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;line-height:1;padding:0;">✕</button>
                    </div>

                    <!-- Inbox view -->
                    <div id="whisperInboxView" style="flex:1;overflow-y:auto;padding:0.75rem 0;">
                        <div id="whisperInboxLoading"
                             style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading conversations...
                        </div>
                        <div id="whisperInboxEmpty"
                             style="display:none;text-align:center;padding:2.5rem 1rem;color:var(--text-muted);">
                            <div style="margin-bottom:0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                            <div style="font-size:0.88rem;">No whispers yet.</div>
                            <div style="font-size:0.8rem;margin-top:4px;opacity:0.7;">Visit a member's profile to send one.</div>
                        </div>
                        <div id="whisperInboxList"></div>
                    </div>

                    <!-- Thread view -->
                    <div id="whisperThreadView"
                         style="display:none;flex:1;overflow-y:auto;
                                padding:0.75rem 1rem;flex-direction:column;gap:8px;">
                        <div id="whisperThreadLoading"
                             style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.88rem;">
                            Loading messages...
                        </div>
                        <div id="whisperThreadMessages" style="display:flex;flex-direction:column;gap:8px;"></div>
                    </div>

                    <!-- Reply bar (thread view only) -->
                    <div id="whisperReplyBar"
                         style="display:none;padding:0.75rem 1rem 1rem;
                                border-top:1px solid rgba(0,0,0,0.07);flex-shrink:0;">
                        <div style="display:flex;gap:8px;align-items:flex-end;">
                            <textarea id="whisperReplyText" placeholder="Write a whisper..."
                                      maxlength="500" rows="2"
                                      onkeydown="WhisperModal._replyKeydown(event)"
                                      style="flex:1;padding:10px;border-radius:12px;
                                             border:1px solid rgba(0,0,0,0.12);font-size:0.88rem;
                                             resize:none;background:var(--neuro-bg);color:var(--neuro-text);
                                             box-sizing:border-box;font-family:inherit;"></textarea>
                            <button type="button" id="whisperReplyBtn" onclick="WhisperModal._sendReply()"
                                    style="padding:10px 16px;border-radius:12px;border:none;cursor:pointer;
                                           font-size:0.88rem;font-weight:600;
                                           background:var(--primary,#667eea);color:#fff;
                                           white-space:nowrap;align-self:flex-end;">Send</button>
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

        modal.style.opacity    = '0';
        inner.style.transform  = 'translateY(16px)';

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
    // VIEW SWITCHING HELPER
    // ============================================================================

    _setView(view) {
        const isInbox = view === 'inbox';
        document.getElementById('whisperInboxView').style.display  = isInbox ? 'block' : 'none';
        document.getElementById('whisperThreadView').style.display  = isInbox ? 'none'  : 'flex';
        document.getElementById('whisperReplyBar').style.display    = isInbox ? 'none'  : 'block';
        document.getElementById('whisperModalBack').style.display   = isInbox ? 'none'  : 'inline';

        const subtitle = document.getElementById('whisperModalSubtitle');
        if (isInbox) {
            document.getElementById('whisperModalTitle').innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Whispers`;
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
        list.querySelectorAll('[data-partner-id]').forEach(row => {
            const open = () => this._showThread(
                row.dataset.partnerId,
                row.dataset.partnerName,
                row.dataset.partnerEmoji,
                row.dataset.partnerAvatar
            );
            row.addEventListener('click', open);
            row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        });
        this._setBadge(conversations.reduce((sum, c) => sum + c.unread, 0));
    },

    _conversationRowHTML(c) {
        const partner     = c.partner || {};
        const name        = this._escape(partner.name || 'Member');
        const avatar      = this._avatarHTML(partner, 38);
        const preview     = this._escape(c.lastMessage || '');
        const time        = this._relativeTime(c.lastAt);
        const safeId      = this._escape(partner.id      || '');
        const safeEmoji   = this._escape(partner.emoji   || '');
        const safeAvatar  = this._escape(partner.avatar_url || '');
        const unreadBadge = c.unread > 0
            ? `<span style="background:var(--primary,#667eea);color:#fff;border-radius:99px;
                            font-size:0.7rem;font-weight:700;padding:2px 7px;min-width:18px;
                            text-align:center;">${c.unread}</span>`
            : '';

        return `
            <div role="button" tabindex="0"
                 data-partner-id="${safeId}"
                 data-partner-name="${name}"
                 data-partner-emoji="${safeEmoji}"
                 data-partner-avatar="${safeAvatar}"
                 aria-label="Open whisper thread with ${name}"
                 style="display:flex;align-items:center;gap:12px;padding:0.75rem 1.25rem;
                        cursor:pointer;transition:background 0.15s;border-radius:0;"
                 onmouseover="this.style.background='rgba(0,0,0,0.03)'"
                 onmouseout="this.style.background='transparent'">
                <div style="flex-shrink:0;">${avatar}</div>
                <div style="flex:1;min-width:0;">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;">
                        <span style="font-weight:${c.unread > 0 ? '700' : '500'};font-size:0.9rem;
                                     color:var(--neuro-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                            ${name}
                        </span>
                        <span style="font-size:0.72rem;color:var(--text-muted);flex-shrink:0;">${time}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
                        <span style="font-size:0.8rem;color:var(--text-muted);white-space:nowrap;
                                     overflow:hidden;text-overflow:ellipsis;flex:1;">${preview}</span>
                        ${unreadBadge}
                    </div>
                </div>
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

        const title    = document.getElementById('whisperModalTitle');
        const subtitle = document.getElementById('whisperModalSubtitle');
        title.textContent    = name;
        subtitle.textContent = 'Private whisper thread';
        subtitle.style.display = 'block';

        const loading  = document.getElementById('whisperThreadLoading');
        const messages = document.getElementById('whisperThreadMessages');
        const threadView = document.getElementById('whisperThreadView');

        loading.style.display = 'block';
        messages.innerHTML    = '';

        CommunityDB.markConversationRead(userId).catch(() => {});

        const msgs = await CommunityDB.getWhispers(userId);
        loading.style.display = 'none';
        this._renderThreadMessages(msgs);

        setTimeout(() => { threadView.scrollTop = threadView.scrollHeight; }, 50);
        document.getElementById('whisperReplyText')?.focus();
        this.refreshUnreadBadge();
    },

    _renderThreadMessages(messages) {
        const container = document.getElementById('whisperThreadMessages');
        if (!container) return;

        if (!messages.length) {
            container.innerHTML = `
                <div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.85rem;">
                    No messages yet - say something ✨
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
            <div style="display:flex;flex-direction:column;align-items:${isMe ? 'flex-end' : 'flex-start'};gap:2px;">
                <div style="max-width:78%;padding:9px 13px;
                            border-radius:${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'};
                            background:${isMe ? 'var(--primary,#667eea)' : 'rgba(0,0,0,0.06)'};
                            color:${isMe ? '#fff' : 'var(--neuro-text)'};
                            font-size:0.88rem;line-height:1.45;word-break:break-word;">
                    ${text}
                </div>
                <span style="font-size:0.7rem;color:var(--text-muted);padding:0 4px;">${time}</span>
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
        if (btn) { btn.disabled = true; btn.textContent = '...'; }
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
                Core.showToast('Could not send - please try again');
            }
        } catch (err) {
            console.error('[WhisperModal] sendReply error');
            Core.showToast('Could not send - please try again');
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
                Core.showToast(`New whisper from ${whisper.sender?.name || 'Someone'}`);
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

    // ============================================================================
    // HELPERS
    // ============================================================================

    _avatarHTML(profile, size = 38) {
        const s = size + 'px';
        if (profile?.avatar_url) {
            return `<img src="${profile.avatar_url}"
                         width="48" height="48" loading="lazy" decoding="async"
                         style="width:${s};height:${s};border-radius:50%;object-fit:cover;display:block;"
                         alt="${this._escape(profile.name || '')}">`;
        }
        const gradient = Core.getAvatarGradient(profile?.id || '');
        const label = profile?.emoji || (profile?.name || '?').charAt(0).toUpperCase();
        return `<div style="width:${s};height:${s};border-radius:50%;background:${gradient};
                            display:flex;align-items:center;justify-content:center;
                            font-size:${Math.round(size * 0.45)}px;flex-shrink:0;">
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
        return new Date(iso).toLocaleDateString(undefined, { month:'short', day:'numeric' });
    },

    _escape(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },
};

// bfcache: clean up realtime sub on pagehide
window.addEventListener('pagehide', () => {
    WhisperModal.state.realtimeSub?.unsubscribe?.();
    WhisperModal.state.realtimeSub = null;
});

// Named export for ES module consumers
export { WhisperModal };

// Keep window assignment for classic scripts
window.WhisperModal = WhisperModal;
