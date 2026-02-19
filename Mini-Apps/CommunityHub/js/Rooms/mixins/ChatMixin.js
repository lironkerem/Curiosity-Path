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
        const name = currentUser.name || 'You';
        const initial = (currentUser.emoji) || name.charAt(0).toUpperCase();
        const gradient = window.Core?.getAvatarGradient
            ? Core.getAvatarGradient(currentUser.id || name)
            : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';

        const msgData = {
            name,
            initial,
            avatarBg: gradient,
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
     * Build message HTML
     * @param {Object} msgData - Message data
     * @returns {string} Message HTML
     */
    buildMessageHTML(msgData) {
        return `
        <div class="campfire-msg">
            <div class="campfire-msg-avatar" style="background: ${msgData.avatarBg};">${msgData.initial}</div>
            <div class="campfire-msg-content">
                <div class="campfire-msg-header">
                    <span class="campfire-msg-name">${msgData.name}</span>
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
                    const profile = row.profiles || {};
                    const isOwn = profile.id === window.Core?.state?.currentUser?.id;
                    const name = isOwn ? 'You' : (profile.name || 'Member');
                    const initial = profile.emoji || name.charAt(0).toUpperCase();
                    const gradient = window.Core?.getAvatarGradient
                        ? Core.getAvatarGradient(profile.id || name)
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    const time = new Date(row.created_at)
                        .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                    const msgData = {
                        name, initial, avatarBg: gradient, time,
                        text: row.message, country: null
                    };

                    const msgHTML = this.buildMessageHTML(msgData);
                    messagesContainer.insertAdjacentHTML('beforeend', msgHTML);
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

                const profile = newMsg.profiles || {};
                const name = profile.name || 'Member';
                const initial = profile.emoji || name.charAt(0).toUpperCase();
                const gradient = window.Core?.getAvatarGradient
                    ? Core.getAvatarGradient(profile.id || name)
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                const time = new Date(newMsg.created_at)
                    .toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

                const msgData = { name, initial, avatarBg: gradient, time, text: newMsg.message, country: null };
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
     * Build chat container HTML
     * @param {string} channel
     * @param {string} placeholder
     * @returns {string}
     */
    buildChatContainer(channel = 'main', placeholder = 'Type your message...') {
        const channelCap = this.capitalize(channel);
        
        return `
        <div class="chat-container" id="${this.roomId}${channelCap}ChatContainer">
            <div class="chat-messages" id="${this.roomId}${channelCap}Messages">
                <!-- Messages will be rendered here -->
            </div>
            <div class="chat-input-container">
                <input type="text" 
                       class="chat-input" 
                       id="${this.roomId}${channelCap}Input"
                       placeholder="${placeholder}"
                       onkeypress="if(event.key==='Enter')${this.getClassName()}.sendMessage('${channel}')">
                <button class="chat-send" onclick="${this.getClassName()}.sendMessage('${channel}')">
                    <span style="font-size: 20px;">→</span>
                </button>
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
     * Initialize chat on room entry.
     * PATCHED: Now loads from Supabase DB instead of localStorage.
     * Call this from onEnter() for rooms with chat.
     */
    async initializeChat() {
        for (const channel of this.chatChannels) {
            await this.loadRoomChatFromDB(channel);
        }
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
