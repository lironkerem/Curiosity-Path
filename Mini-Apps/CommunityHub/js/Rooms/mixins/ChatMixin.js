/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHAT MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin ChatMixin
 * @description Adds chat/messaging functionality to practice rooms
 * @version 3.1.0 — PATCHED: Messages saved to Supabase, loaded from DB with realtime
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, ChatMixin);
 * 
 * Features:
 *   - Message sending and rendering
 *   - Multiple chat channels support
 *   - ✅ Supabase persistence (replaces localStorage)
 *   - ✅ Realtime incoming messages
 * 
 * Channel → room_id mapping:
 *   channel 'main'            → room_id: this.roomId          (e.g. 'campfire')
 *   channel 'daily'/'personal' → room_id: this.roomId-channel (e.g. 'tarot-daily')
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ChatMixin = {
    /**
     * Initialize chat state
     * @param {Array<string>} channels - Chat channel names (e.g., ['daily', 'personal'])
     */
    initChatState(channels = ['main']) {
        this.chatChannels = channels;
        this.state.messages = {};
        
        channels.forEach(channel => {
            this.state.messages[channel] = [];
        });
    },

    /**
     * Compute the Supabase room_id for a given local channel.
     * 'main' → this.roomId
     * anything else → `${this.roomId}-${channel}`
     * @param {string} channel
     * @returns {string}
     */
    _getDbRoomId(channel = 'main') {
        return channel === 'main' ? this.roomId : `${this.roomId}-${channel}`;
    },

    /**
     * Send a message to a channel.
     * Renders locally immediately (optimistic), then saves to Supabase.
     * @param {string} channel - Channel name
     * @param {string} inputId - Optional input element ID override
     */
    async sendMessage(channel = 'main', inputId = null) {
        const input = document.getElementById(inputId || `${this.roomId}${this.capitalize(channel)}Input`);
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        const messagesContainer = document.getElementById(`${this.roomId}${this.capitalize(channel)}Messages`);
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
        const currentUser = window.Core?.state?.currentUser || {};
        const name      = currentUser.name || 'You';
        const initial   = (currentUser.emoji) || name.charAt(0).toUpperCase();
        const avatarUrl = currentUser.avatar_url || '';
        const gradient  = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(currentUser.id || name)
            : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

        const msgData = {
            name,
            initial,
            avatarUrl,
            avatarBg: gradient,
            userId:   currentUser.id || null,
            time,
            text: message,
            country: null,
            timestamp: Date.now()
        };
        
        // Add custom message data if provided by room
        if (this.getCustomMessageData) {
            Object.assign(msgData, this.getCustomMessageData(channel));
        }
        
        // Add to local state
        this.state.messages[channel].push(msgData);
        
        // Render to DOM immediately
        if (messagesContainer) {
            const msgHTML = this.buildMessageHTML(msgData);
            messagesContainer.insertAdjacentHTML('beforeend', msgHTML);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        input.value = '';
        Core.showToast('Message sent');

        // ── Persist to Supabase ────────────────────────────────────────────
        if (window.CommunityDB && CommunityDB.ready) {
            try {
                await CommunityDB.sendRoomMessage(this._getDbRoomId(channel), message);
            } catch (error) {
                console.error('[ChatMixin] sendRoomMessage error:', error);
            }
        }
    },
    
    /**
     * Build message HTML.
     * Supports real avatar images (msgData.avatarUrl) as well as gradient+initial fallback.
     * Names are clickable to open MemberProfileModal when msgData.userId is present.
     * @param {Object} msgData - Message data
     * @returns {string} Message HTML
     */
    buildMessageHTML(msgData) {
        // Avatar: real image takes priority, fallback to gradient + initial/emoji
        const avatarInner = msgData.avatarUrl
            ? `<img src="${msgData.avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${msgData.name}">`
            : `<span style="color:white;font-size:13px;font-weight:600;line-height:1;">${msgData.initial}</span>`;
        const avatarBg = msgData.avatarUrl ? 'background:transparent;' : `background:${msgData.avatarBg};`;

        // Name: clickable if we have a userId
        const nameEl = msgData.userId
            ? `<span class="campfire-msg-name" style="cursor:pointer;" onclick="openMemberProfileAboveRoom('${msgData.userId}')">${msgData.name}</span>`
            : `<span class="campfire-msg-name">${msgData.name}</span>`;

        return `
        <div class="campfire-msg">
            <div class="campfire-msg-avatar" style="${avatarBg}overflow:hidden;display:flex;align-items:center;justify-content:center;">${avatarInner}</div>
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

    /**
     * Load message history from Supabase and render it.
     * Also subscribes to realtime incoming messages for this channel.
     * Call from onEnter() to replace renderSavedMessages() / loadMessagesFromStorage().
     * @param {string} channel - Channel name
     */
    async loadRoomChatFromDB(channel = 'main') {
        if (!window.CommunityDB || !CommunityDB.ready) {
            // Fallback to localStorage if DB not available
            this.loadMessagesFromStorage(channel);
            this.renderSavedMessages(channel);
            return;
        }

        const roomId = this._getDbRoomId(channel);
        const messagesContainer = document.getElementById(
            `${this.roomId}${this.capitalize(channel)}Messages`
        );

        try {
            const rows = await CommunityDB.getRoomMessages(roomId, 50);
            const blocked = await CommunityDB.getBlockedUsers();

            if (messagesContainer && rows.length > 0) {
                const visibleRows = rows.filter(r => !blocked.has(r.profiles?.id));

                visibleRows.forEach(row => {
                    const profile   = row.profiles || {};
                    const isOwn     = profile.id === window.Core?.state?.currentUser?.id;
                    const name      = isOwn ? (window.Core?.state?.currentUser?.name || 'You') : (profile.name || 'Member');
                    const avatarUrl = isOwn ? (window.Core?.state?.currentUser?.avatar_url || '') : (profile.avatar_url || '');
                    const initial   = profile.emoji || name.charAt(0).toUpperCase();
                    const gradient  = window.Core?.getAvatarGradient
                        ? Core.getAvatarGradient(profile.id || name)
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    const time = new Date(row.created_at)
                        .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    const msgData = {
                        name, initial, avatarUrl, avatarBg: gradient,
                        userId: profile.id || null,
                        time, text: row.message, country: null
                    };

                    messagesContainer.insertAdjacentHTML('beforeend', this.buildMessageHTML(msgData));
                });

                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }

            // Subscribe to realtime new messages for this channel
            CommunityDB.subscribeToRoomChat(roomId, async (newMsg) => {
                // Skip own messages — already rendered optimistically
                if (newMsg.profiles?.id === window.Core?.state?.currentUser?.id) return;

                const blocked = await CommunityDB.getBlockedUsers();
                if (blocked.has(newMsg.profiles?.id)) return;

                if (!messagesContainer) return;

                const profile   = newMsg.profiles || {};
                const name      = profile.name || 'Member';
                const avatarUrl = profile.avatar_url || '';
                const initial   = profile.emoji || name.charAt(0).toUpperCase();
                const gradient  = window.Core?.getAvatarGradient
                    ? Core.getAvatarGradient(profile.id || name)
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                const time = new Date(newMsg.created_at)
                    .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                const msgData = {
                    name, initial, avatarUrl, avatarBg: gradient,
                    userId: profile.id || null,
                    time, text: newMsg.message, country: null
                };
                messagesContainer.insertAdjacentHTML('beforeend', this.buildMessageHTML(msgData));
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });

        } catch (error) {
            console.error(`[ChatMixin] loadRoomChatFromDB error (${channel}):`, error);
        }
    },

    // ── LEGACY / FALLBACK METHODS (kept for rooms that call them directly) ─

    /**
     * Load messages from localStorage (fallback only)
     * @param {string} channel
     */
    loadMessagesFromStorage(channel = 'main') {
        const storageKey = `${this.roomId}_messages_${channel}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                this.state.messages[channel] = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load messages from storage:', e);
                this.state.messages[channel] = [];
            }
        }
    },
    
    /**
     * Save messages to localStorage (legacy fallback)
     * @param {string} channel
     */
    saveMessagesToStorage(channel = 'main') {
        try {
            const storageKey = `${this.roomId}_messages_${channel}`;
            localStorage.setItem(storageKey, JSON.stringify(this.state.messages[channel]));
        } catch (e) {
            console.error('Failed to save messages:', e);
        }
    },
    
    /**
     * Render saved messages from local state (legacy fallback)
     * @param {string} channel
     */
    renderSavedMessages(channel = 'main') {
        const messagesContainer = document.getElementById(
            `${this.roomId}${this.capitalize(channel)}Messages`
        );
        if (!messagesContainer || this.state.messages[channel].length === 0) return;
        
        this.state.messages[channel].forEach(msg => {
            messagesContainer.insertAdjacentHTML('beforeend', this.buildMessageHTML(msg));
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    /**
     * Build chat container HTML.
     * Messages area grows to fill available space; input row is pinned to the bottom.
     * A sender-avatar slot is included before the input — call _injectSenderAvatar()
     * from onEnter() to populate it with the current user's real profile image.
     * @param {string} channel
     * @param {string} placeholder
     * @returns {string}
     */
    buildChatContainer(channel = 'main', placeholder = 'Type your message...') {
        const channelCap    = this.capitalize(channel);
        const avatarSlotId  = `${this.roomId}${channelCap}SenderAvatar`;

        return `
        <div class="chat-container" id="${this.roomId}${channelCap}ChatContainer"
             style="display:flex;flex-direction:column;height:100%;">
            <div class="chat-messages" id="${this.roomId}${channelCap}Messages"
                 style="flex:1;overflow-y:auto;min-height:0;">
                <!-- Messages rendered here -->
            </div>
            <div class="chat-input-container" style="margin-top:auto;padding-top:8px;">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                    <!-- Current user avatar, populated by _injectSenderAvatar() -->
                    <div id="${avatarSlotId}" style="flex-shrink:0;width:28px;height:28px;">
                        <div style="width:28px;height:28px;border-radius:50%;background:var(--border);"></div>
                    </div>
                    <input type="text"
                           class="chat-input"
                           id="${this.roomId}${channelCap}Input"
                           placeholder="${placeholder}"
                           onkeypress="if(event.key==='Enter')${this.getClassName()}.sendMessage('${channel}')"
                           style="flex:1;min-width:0;width:100%;">
                    <button class="chat-send" onclick="${this.getClassName()}.sendMessage('${channel}')" style="flex-shrink:0;">
                        <span style="font-size:20px;">→</span>
                    </button>
                </div>
            </div>
        </div>`;
    },
    
    /**
     * Clear messages from a channel
     * @param {string} channel
     */
    clearMessages(channel = 'main') {
        this.state.messages[channel] = [];
        
        const storageKey = `${this.roomId}_messages_${channel}`;
        localStorage.removeItem(storageKey);
        
        const messagesContainer = document.getElementById(
            `${this.roomId}${this.capitalize(channel)}Messages`
        );
        if (messagesContainer) messagesContainer.innerHTML = '';
        
        Core.showToast('Messages cleared');
    },
    
    /**
     * Capitalize first letter of string
     * @param {string} str
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Populate the sender-avatar slot(s) built by buildChatContainer with the
     * current user's real profile image (or emoji/initial fallback).
     * Called automatically by initializeChat(). Safe to call again if the user
     * profile loads later.
     * @param {string|null} channel - If null, injects for all chatChannels
     */
    _injectSenderAvatar(channel = null) {
        const channels = channel ? [channel] : (this.chatChannels || ['main']);
        const user     = window.Core?.state?.currentUser;
        if (!user) return;

        const name      = user.name || 'Me';
        const avatarUrl = user.avatar_url || '';
        const emoji     = user.emoji || '';
        const initial   = emoji || name.charAt(0).toUpperCase();
        const gradient  = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(user.id || name)
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

        const inner = avatarUrl
            ? `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="${name}">`
            : `<span style="color:white;font-weight:600;font-size:12px;">${initial}</span>`;
        const bg = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        channels.forEach(ch => {
            const slotId  = `${this.roomId}${this.capitalize(ch)}SenderAvatar`;
            const wrapper = document.getElementById(slotId);
            if (!wrapper) return;
            wrapper.innerHTML = `
                <div style="width:32px;height:32px;border-radius:50%;${bg}display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                    ${inner}
                </div>`;
        });
    },

    /**
     * Initialize chat on room entry.
     * Loads history from Supabase for every channel, then injects sender avatar.
     */
    async initializeChat() {
        for (const channel of this.chatChannels) {
            await this.loadRoomChatFromDB(channel);
        }
        // Defer avatar injection slightly to ensure DOM is ready
        setTimeout(() => this._injectSenderAvatar(), 200);
    },

    /**
     * Escape HTML for safe display
     * @param {string} str
     * @returns {string}
     */
    _escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.ChatMixin = ChatMixin;
