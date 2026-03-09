/**
 * CHAT MIXIN
 * Adds chat/messaging functionality to practice rooms.
 *
 * Usage: Object.assign(YourRoom.prototype, ChatMixin);
 *
 * Channel → room_id mapping:
 *   'main'            → this.roomId            (e.g. 'campfire')
 *   'daily'/'personal' → this.roomId-channel   (e.g. 'tarot-daily')
 *
 * NOTE: This mixin provides the canonical _escapeHtml() implementation.
 * Do NOT redefine it in room subclasses.
 */

import { Core } from '../../core.js';
import { CommunityDB } from '../../community-supabase.js';

// ─── Module-level helpers (not mixed into instances) ─────────────────────────

/** Capitalise first letter. */
const _cap = str => str.charAt(0).toUpperCase() + str.slice(1);

/** Build a consistent avatar { inner, bg } pair from profile data. */
function _avatarParts(name, avatarUrl, emoji, userId) {
    const initial  = emoji || name.charAt(0).toUpperCase();
    const gradient = Core?.getAvatarGradient?.(userId || name)
        ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const inner = avatarUrl
        ? `<img src="${avatarUrl}" style="width:36px;height:36px;object-fit:cover;border-radius:50%;display:block;flex-shrink:0;" alt="${name}">`
        : `<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${initial}</span>`;
    const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;
    return { inner, bg, gradient, initial };
}

/** Format a date string or Date to HH:MM. */
const _fmtTime = dateVal =>
    new Date(dateVal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─────────────────────────────────────────────────────────────────────────────

const ChatMixin = {

    // ── Initialisation ────────────────────────────────────────────────────────

    initChatState(channels = ['main']) {
        this.chatChannels   = channels;
        this.state.messages = Object.fromEntries(channels.map(ch => [ch, []]));
    },

    async initializeChat() {
        await Promise.all(this.chatChannels.map(ch => this.loadRoomChatFromDB(ch)));
        setTimeout(() => this._injectSenderAvatar(), 200);
    },

    // ── Routing ───────────────────────────────────────────────────────────────

    _getDbRoomId(channel = 'main') {
        return channel === 'main' ? this.roomId : `${this.roomId}-${channel}`;
    },

    _msgContainerId(channel) {
        return `${this.roomId}${_cap(channel)}Messages`;
    },

    _inputId(channel) {
        return `${this.roomId}${_cap(channel)}Input`;
    },

    // ── DB row → msgData ──────────────────────────────────────────────────────

    _rowToMsgData(row, isOwn = false) {
        const profile   = row.profiles || {};
        const cu        = Core?.state?.currentUser || {};
        const name      = isOwn ? (cu.name || 'You')          : (profile.name || 'Member');
        const avatarUrl = isOwn ? (cu.avatar_url || '')        : (profile.avatar_url || '');
        const emoji     = isOwn ? (cu.emoji || '')             : (profile.emoji || '');
        const userId    = profile.id || null;
        const { gradient, initial } = _avatarParts(name, avatarUrl, emoji, userId);

        return {
            name, initial, avatarUrl, avatarBg: gradient,
            userId,
            time:    _fmtTime(row.created_at),
            text:    row.message,
            country: null,
        };
    },

    // ── Send ──────────────────────────────────────────────────────────────────

    async sendMessage(channel = 'main', inputId = null) {
        const input = document.getElementById(inputId || this._inputId(channel));
        if (!input?.value.trim()) return;

        const message   = input.value.trim();
        const container = document.getElementById(this._msgContainerId(channel));
        const cu        = Core?.state?.currentUser || {};
        const name      = cu.name || 'You';
        const { gradient, initial } = _avatarParts(name, cu.avatar_url || '', cu.emoji || '', cu.id);

        const msgData = {
            name,
            initial,
            avatarUrl: cu.avatar_url || '',
            avatarBg:  gradient,
            userId:    cu.id || null,
            time:      _fmtTime(new Date()),
            text:      message,
            country:   null,
            timestamp: Date.now(),
            ...this.getCustomMessageData?.(channel),
        };

        this.state.messages[channel].push(msgData);

        if (container) {
            container.insertAdjacentHTML('beforeend', this.buildMessageHTML(msgData));
            container.scrollTop = container.scrollHeight;
        }

        input.value = '';
        Core.showToast('Message sent');

        if (CommunityDB?.ready) {
            try {
                await CommunityDB.sendRoomMessage(this._getDbRoomId(channel), message);
            } catch (e) {
                console.error('[ChatMixin] sendRoomMessage error:', e);
            }
        }
    },

    // ── Load history + realtime ───────────────────────────────────────────────

    async loadRoomChatFromDB(channel = 'main') {
        if (!CommunityDB?.ready) {
            this.loadMessagesFromStorage(channel);
            this.renderSavedMessages(channel);
            return;
        }

        const dbRoomId  = this._getDbRoomId(channel);
        const container = document.getElementById(this._msgContainerId(channel));
        const currentId = Core?.state?.currentUser?.id;

        try {
            const [rows, blocked] = await Promise.all([
                CommunityDB.getRoomMessages(dbRoomId, 50),
                CommunityDB.getBlockedUsers(),
            ]);

            if (container && rows.length) {
                rows
                    .filter(r => !blocked.has(r.profiles?.id))
                    .forEach(row => {
                        const isOwn = row.profiles?.id === currentId;
                        container.insertAdjacentHTML('beforeend',
                            this.buildMessageHTML(this._rowToMsgData(row, isOwn)));
                    });
                container.scrollTop = container.scrollHeight;
            }

            CommunityDB.subscribeToRoomChat(dbRoomId, async newMsg => {
                if (newMsg.profiles?.id === currentId) return;

                const blocked = await CommunityDB.getBlockedUsers();
                if (blocked.has(newMsg.profiles?.id) || !container) return;

                container.insertAdjacentHTML('beforeend',
                    this.buildMessageHTML(this._rowToMsgData(newMsg)));
                container.scrollTop = container.scrollHeight;
            });

        } catch (e) {
            console.error(`[ChatMixin] loadRoomChatFromDB error (${channel}):`, e);
        }
    },

    // ── Render ────────────────────────────────────────────────────────────────

    buildMessageHTML(msgData) {
        const avatarInner = msgData.avatarUrl
            ? ``
            : `<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${msgData.initial}</span>`;
        const avatarBg = msgData.avatarUrl
            ? `background-image:url('${msgData.avatarUrl}');background-size:cover;background-position:center;`
            : `background:${msgData.avatarBg};`;

        const nameEl = msgData.userId
            ? `<span class="campfire-msg-name" style="cursor:pointer;" onclick="openMemberProfileAboveRoom('${msgData.userId}')">${msgData.name}</span>`
            : `<span class="campfire-msg-name">${msgData.name}</span>`;

        return `
        <div class="campfire-msg">
            <div class="campfire-msg-avatar" style="${avatarBg}width:36px;height:36px;min-width:36px;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${avatarInner}</div>
            <div class="campfire-msg-content">
                <div class="campfire-msg-header">
                    ${nameEl}
                    ${msgData.country ? `<span class="campfire-msg-country">${msgData.country}</span>` : ''}
                    <span class="campfire-msg-time">${msgData.time}</span>
                </div>
                <div class="campfire-msg-text">${this._escapeHtml(msgData.text)}</div>
            </div>
        </div>`;
    },

    buildChatContainer(channel = 'main', placeholder = 'Type your message...') {
        const cap         = _cap(channel);
        const avatarSlot  = `${this.roomId}${cap}SenderAvatar`;
        const className   = this.getClassName();

        return `
        <div class="chat-container" id="${this.roomId}${cap}ChatContainer"
             style="display:flex;flex-direction:column;">
            <div class="chat-messages" id="${this.roomId}${cap}Messages"></div>
            <div class="chat-input-container" style="padding-top:8px;border-top:none;padding-left:0;padding-right:0;padding-bottom:0;">
                <div style="display:flex;align-items:center;gap:6px;width:100%;flex-wrap:nowrap;box-sizing:border-box;">
                    <div id="${avatarSlot}" style="flex-shrink:0;width:28px;height:28px;">
                        <div style="width:28px;height:28px;border-radius:50%;background:var(--border);"></div>
                    </div>
                    <input type="text"
                           class="chat-input"
                           id="${this.roomId}${cap}Input"
                           placeholder="${placeholder}"
                           onkeypress="if(event.key==='Enter')${className}.sendMessage('${channel}')"
                           style="flex:1;min-width:0;width:100%;">
                    <button class="chat-send" onclick="${className}.sendMessage('${channel}')" style="flex-shrink:0;">
                        <span style="font-size:20px;">→</span>
                    </button>
                </div>
            </div>
        </div>`;
    },

    // ── Sender avatar ─────────────────────────────────────────────────────────

    _injectSenderAvatar(channel = null) {
        const channels = channel ? [channel] : (this.chatChannels || ['main']);
        const cu = Core?.state?.currentUser;
        if (!cu) return;

        const { inner, bg } = _avatarParts(cu.name || 'Me', cu.avatar_url || '', cu.emoji || '', cu.id);

        channels.forEach(ch => {
            const wrapper = document.getElementById(`${this.roomId}${_cap(ch)}SenderAvatar`);
            if (!wrapper) return;
            const avatarStyle = cu.avatar_url
                ? `width:32px;height:32px;border-radius:50%;background-image:url('${cu.avatar_url}');background-size:cover;background-position:center;flex-shrink:0;`
                : `width:32px;height:32px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;`;
            const avatarContent = cu.avatar_url ? '' : inner;
            wrapper.innerHTML = `<div style="${avatarStyle}">${avatarContent}</div>`;
        });
    },

    // ── Legacy / fallback (localStorage) ─────────────────────────────────────

    loadMessagesFromStorage(channel = 'main') {
        try {
            const saved = localStorage.getItem(`${this.roomId}_messages_${channel}`);
            if (saved) this.state.messages[channel] = JSON.parse(saved);
        } catch (e) {
            console.error('[ChatMixin] loadMessagesFromStorage error:', e);
            this.state.messages[channel] = [];
        }
    },

    saveMessagesToStorage(channel = 'main') {
        try {
            localStorage.setItem(
                `${this.roomId}_messages_${channel}`,
                JSON.stringify(this.state.messages[channel])
            );
        } catch (e) {
            console.error('[ChatMixin] saveMessagesToStorage error:', e);
        }
    },

    renderSavedMessages(channel = 'main') {
        const container = document.getElementById(this._msgContainerId(channel));
        const msgs      = this.state.messages[channel];
        if (!container || !msgs.length) return;
        msgs.forEach(msg => container.insertAdjacentHTML('beforeend', this.buildMessageHTML(msg)));
        container.scrollTop = container.scrollHeight;
    },

    clearMessages(channel = 'main') {
        this.state.messages[channel] = [];
        localStorage.removeItem(`${this.roomId}_messages_${channel}`);
        const container = document.getElementById(this._msgContainerId(channel));
        if (container) container.innerHTML = '';
        Core.showToast('Messages cleared');
    },

    // ── Utility ───────────────────────────────────────────────────────────────

    capitalize: _cap,

    /**
     * Canonical HTML escape utility.
     * Available to all rooms via mixin — do NOT redefine in subclasses.
     */
    _escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
};

export { ChatMixin };
