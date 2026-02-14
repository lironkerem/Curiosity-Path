/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHAT MIXIN
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * @mixin ChatMixin
 * @description Adds chat/messaging functionality to practice rooms
 * @version 3.0.0
 * 
 * Usage:
 *   Object.assign(YourRoom.prototype, ChatMixin);
 * 
 * Features:
 *   - Message sending and rendering
 *   - Multiple chat channels support
 *   - LocalStorage persistence (optional)
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
     * Send a message to a channel
     * @param {string} channel - Channel name
     * @param {string} inputId - Input element ID
     */
    sendMessage(channel = 'main', inputId = null) {
        const input = document.getElementById(inputId || `${this.roomId}${this.capitalize(channel)}Input`);
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        const messagesContainer = document.getElementById(`${this.roomId}${this.capitalize(channel)}Messages`);
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
        const msgData = {
            name: 'You',
            initial: 'Y',
            avatarBg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            time: time,
            text: message,
            country: null,
            timestamp: Date.now()
        };
        
        // Add custom message data if provided
        if (this.getCustomMessageData) {
            Object.assign(msgData, this.getCustomMessageData(channel));
        }
        
        // Add to state
        this.state.messages[channel].push(msgData);
        
        // Save to localStorage if enabled
        if (this.chatPersistence) {
            this.saveMessagesToStorage(channel);
        }
        
        // Render to DOM
        if (messagesContainer) {
            const msgHTML = this.buildMessageHTML(msgData);
            messagesContainer.insertAdjacentHTML('beforeend', msgHTML);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        input.value = '';
        Core.showToast('Message sent');
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
                <div class="campfire-msg-text">${msgData.text}</div>
            </div>
        </div>`;
    },
    
    /**
     * Load messages from localStorage
     * @param {string} channel - Channel name
     */
    loadMessagesFromStorage(channel = 'main') {
        const storageKey = `${this.roomId}_messages_${channel}`;
        const saved = localStorage.getItem(storageKey);
        
        if (saved) {
            try {
                this.state.messages[channel] = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load messages:', e);
                this.state.messages[channel] = [];
            }
        }
    },
    
    /**
     * Save messages to localStorage
     * @param {string} channel - Channel name
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
     * Render saved messages
     * @param {string} channel - Channel name
     */
    renderSavedMessages(channel = 'main') {
        const messagesContainer = document.getElementById(`${this.roomId}${this.capitalize(channel)}Messages`);
        if (!messagesContainer || this.state.messages[channel].length === 0) return;
        
        this.state.messages[channel].forEach(msg => {
            const msgHTML = this.buildMessageHTML(msg);
            messagesContainer.insertAdjacentHTML('beforeend', msgHTML);
        });
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },
    
    /**
     * Build chat container HTML
     * @param {string} channel - Channel name
     * @param {string} placeholder - Input placeholder text
     * @returns {string} Chat HTML
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
     * @param {string} channel - Channel name
     */
    clearMessages(channel = 'main') {
        this.state.messages[channel] = [];
        
        if (this.chatPersistence) {
            const storageKey = `${this.roomId}_messages_${channel}`;
            localStorage.removeItem(storageKey);
        }
        
        const messagesContainer = document.getElementById(`${this.roomId}${this.capitalize(channel)}Messages`);
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        
        Core.showToast('Messages cleared');
    },
    
    /**
     * Capitalize first letter of string
     * @param {string} str - String to capitalize
     * @returns {string} Capitalized string
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    /**
     * Initialize chat on room entry
     * Call this in room's onEnter() method
     */
    initializeChat() {
        if (!this.chatPersistence) return;
        
        this.chatChannels.forEach(channel => {
            this.loadMessagesFromStorage(channel);
            this.renderSavedMessages(channel);
        });
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL EXPORT
// ═══════════════════════════════════════════════════════════════════════════

window.ChatMixin = ChatMixin;
