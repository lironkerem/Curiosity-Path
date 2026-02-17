/**
 * LUNAR-UI.JS v2.0
 * UI rendering singleton for all lunar phase rooms
 * 
 * IMPROVEMENTS:
 * - Removed inline onclick handlers (XSS vulnerability)
 * - Added data attributes for event delegation
 * - Cached CSS injection check
 * - Improved performance with template literals
 * - Better error handling
 * - Constants for magic numbers
 * 
 * @namespace LunarUI
 */

const LunarUI = {
    // ============================================================================
    // CONSTANTS
    // ============================================================================
    
    CONSTANTS: {
        DEFAULT_STAR_COUNT: 50,
        AVATAR_MAX_DISPLAY: 5,
        AVATAR_COLORS: ['#8B7AFF', '#FF9B71', '#71E8FF', '#FFD371', '#FF71B4'],
        AVATAR_INITIALS: ['L', 'S', 'N', 'A', 'M'],
        WORD_CLOUD_COLORS: ['#8B7AFF', '#FF9B71', '#71E8FF', '#FFD371', '#FF71B4', '#71ffaa']
    },

    // Track if styles have been injected
    _stylesInjected: false,

    // ============================================================================
    // STARFIELD GENERATION
    // ============================================================================

    /**
     * Generate starfield HTML with animated stars
     * @param {number} count - Number of stars to generate
     * @returns {string} HTML string of stars
     */
    generateStarfield(count = LunarUI.CONSTANTS.DEFAULT_STAR_COUNT) {
        try {
            const stars = [];
            for (let i = 0; i < count; i++) {
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const delay = Math.random() * 3;
                const opacity = Math.random() * 0.5 + 0.3;
                
                stars.push(
                    `<div class="lunar-star" style="left: ${left}%; top: ${top}%; animation-delay: ${delay}s; opacity: ${opacity};"></div>`
                );
            }
            return stars.join('');
        } catch (error) {
            console.error('Error generating starfield:', error);
            return '';
        }
    },

    // ============================================================================
    // COMPONENT RENDERERS
    // ============================================================================

    /**
     * Render top navigation bar
     * @param {Object} options - Configuration options
     * @param {string} options.emoji - Phase emoji
     * @param {string} options.name - Phase name
     * @param {string} options.daysText - Days remaining/until text
     * @param {number} options.livingPresenceCount - Number of present members
     * @param {string} options.cssPrefix - CSS class prefix
     * @returns {string} HTML string
     */
    renderTopBar({ emoji, name, daysText, livingPresenceCount, cssPrefix }) {
        try {
            return `
                <div class="${cssPrefix}-top-bar lunar-top-bar">
                    <div class="${cssPrefix}-phase-left lunar-phase-left">
                        <div class="${cssPrefix}-moon-icon lunar-moon-icon-large">${emoji}</div>
                        <div class="${cssPrefix}-phase-info lunar-phase-info">
                            <h2>${name}</h2>
                            <p>${daysText}</p>
                        </div>
                    </div>

                    <div class="${cssPrefix}-live-count-top lunar-live-count-top">
                        <div class="lunar-pulse-dot"></div>
                        <span>${livingPresenceCount} members practicing with you now</span>
                    </div>

                    <button data-action="back-to-hub" class="${cssPrefix}-back-hub-btn lunar-back-hub-btn" aria-label="Leave practice and return to hub">
                        Leave Practice
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering top bar:', error);
            return '';
        }
    },

    /**
     * Render moon visual element
     * @param {Object} options - Configuration options
     * @param {string} options.cssPrefix - CSS class prefix
     * @param {string} options.sphereClass - Moon sphere CSS class
     * @param {string} options.glowClass - Moon glow CSS class
     * @returns {string} HTML string
     */
    renderMoonVisual({ cssPrefix, sphereClass, glowClass }) {
        try {
            return `
                <div class="${cssPrefix}-moon-visual lunar-moon-visual">
                    <div class="${glowClass} lunar-moon-glow">
                        <div class="${sphereClass} lunar-moon-sphere"></div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering moon visual:', error);
            return '';
        }
    },

    /**
     * Render intro card with image and description
     * @param {Object} options - Configuration options
     * @param {string} options.imageUrl - Image URL
     * @param {string} options.description - Phase description
     * @returns {string} HTML string
     */
    renderIntroCard({ imageUrl, description }) {
        try {
            return `
                <div class="lunar-intro-card">
                    <img src="${imageUrl}" alt="Moon Phase" class="lunar-intro-image" loading="lazy">
                    <p>${description}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering intro card:', error);
            return '';
        }
    },

    /**
     * Render mode toggle (Solo/Group)
     * @param {Object} options - Configuration options
     * @param {string} options.cssPrefix - CSS class prefix
     * @param {string} options.globalName - Global room instance name
     * @returns {string} HTML string
     */
    renderModeToggle({ cssPrefix, globalName }) {
        try {
            return `
                <div class="${cssPrefix}-mode-toggle lunar-mode-toggle">
                    <button class="lunar-mode-btn active" data-mode="solo" data-action="switch-mode" aria-pressed="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>Solo Practice</span>
                    </button>
                    <button class="lunar-mode-btn" data-mode="group" data-action="switch-mode" aria-pressed="false">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span>Group Circle</span>
                    </button>
                </div>
            `;
        } catch (error) {
            console.error('Error rendering mode toggle:', error);
            return '';
        }
    },

    /**
     * Render mock avatars for group display
     * @param {number} count - Number of avatars (max 5 displayed)
     * @returns {string} HTML string
     */
    renderMockAvatars(count) {
        try {
            const { AVATAR_MAX_DISPLAY, AVATAR_COLORS, AVATAR_INITIALS } = LunarUI.CONSTANTS;
            const displayCount = Math.min(count, AVATAR_MAX_DISPLAY);
            
            const avatars = [];
            for (let i = 0; i < displayCount; i++) {
                avatars.push(`
                    <div class="lunar-avatar" 
                         style="background-color: ${AVATAR_COLORS[i]}; animation-delay: ${i * 0.1}s;"
                         aria-label="Member ${AVATAR_INITIALS[i]}">
                        ${AVATAR_INITIALS[i]}
                    </div>
                `);
            }
            
            avatars.push(`
                <div class="lunar-avatar lunar-join-avatar" aria-label="Join circle">
                    <span>+</span>
                </div>
            `);
            
            return avatars.join('');
        } catch (error) {
            console.error('Error rendering avatars:', error);
            return '';
        }
    },

    /**
     * Render word cloud from array of words
     * @param {Array<{word: string, timestamp: number}>} words - Array of word objects
     * @returns {string} HTML string
     */
    renderWordCloud(words) {
        try {
            if (!Array.isArray(words) || words.length === 0) {
                return '<p style="color: rgba(224, 224, 255, 0.6);">No words yet</p>';
            }

            const { WORD_CLOUD_COLORS } = LunarUI.CONSTANTS;
            
            return words.map((item, i) => {
                const fontSize = Math.random() * 1.5 + 1;
                const color = WORD_CLOUD_COLORS[Math.floor(Math.random() * WORD_CLOUD_COLORS.length)];
                const delay = i * 0.1;
                
                return `
                    <div class="lunar-word-cloud-item" 
                         style="font-size: ${fontSize}rem; color: ${color}; animation-delay: ${delay}s;"
                         aria-label="Intention word: ${item.word}">
                        ${item.word}
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error rendering word cloud:', error);
            return '';
        }
    },

    /**
     * Render wisdom quote text
     * @param {string} quote - Quote text
     * @returns {string} HTML string
     */
    renderWisdomText(quote) {
        try {
            return `
                <div class="lunar-wisdom-text">
                    "${quote}"
                </div>
            `;
        } catch (error) {
            console.error('Error rendering wisdom text:', error);
            return '';
        }
    },

    // ============================================================================
    // POPUP CREATION
    // ============================================================================

    /**
     * Create popup element with event delegation support
     * @param {Object} options - Popup configuration
     * @param {string} options.icon - Icon HTML
     * @param {string} options.title - Popup title
     * @param {string} options.subtitle - Popup subtitle
     * @param {string} options.content - Popup content HTML
     * @param {string} options.cssPrefix - CSS class prefix
     * @param {boolean} options.hasFooter - Whether to include footer
     * @param {Function} options.onClose - Close callback
     * @returns {HTMLElement} Popup DOM element
     */
    createPopup({ icon, title, subtitle, content, cssPrefix, hasFooter = true, onClose }) {
        try {
            const popup = document.createElement('div');
            popup.className = `lunar-practice-popup ${cssPrefix}-practice-popup`;
            popup.setAttribute('role', 'dialog');
            popup.setAttribute('aria-labelledby', 'popup-title');
            popup.setAttribute('aria-describedby', 'popup-subtitle');
            
            const footer = hasFooter ? `
                <div class="lunar-popup-footer">
                    <button class="lunar-popup-btn" data-action="close-popup" aria-label="Close practice">
                        Close Practice
                    </button>
                </div>
            ` : '';

            popup.innerHTML = `
                <div class="lunar-popup-content ${cssPrefix}-popup-content">
                    <button class="lunar-popup-close" data-action="close-popup" aria-label="Close popup">✕</button>
                    
                    <div class="lunar-popup-header">
                        <div class="lunar-popup-icon" aria-hidden="true">${icon}</div>
                        <div class="lunar-popup-title">
                            <h2 id="popup-title">${title}</h2>
                            <p class="lunar-popup-subtitle" id="popup-subtitle">${subtitle}</p>
                        </div>
                    </div>

                    <div class="lunar-popup-body" id="collectiveIntentionContent">
                        ${content}
                    </div>

                    ${footer}
                </div>
            `;

            return popup;
        } catch (error) {
            console.error('Error creating popup:', error);
            
            // Return minimal fallback popup
            const fallback = document.createElement('div');
            fallback.className = 'lunar-practice-popup';
            fallback.innerHTML = '<p>Error loading popup</p>';
            return fallback;
        }
    },

    // ============================================================================
    // STYLE INJECTION
    // ============================================================================

    /**
     * Inject shared CSS styles (only once)
     * @param {string} cssPrefix - CSS class prefix for phase-specific styles
     */
    injectStyles(cssPrefix) {
        // Only inject once
        if (this._stylesInjected) {
            return;
        }

        try {
            if (document.getElementById('lunar-shared-styles')) {
                this._stylesInjected = true;
                return;
            }

            const style = document.createElement('style');
            style.id = 'lunar-shared-styles';
            style.textContent = this.getSharedCSS(cssPrefix);
            document.head.appendChild(style);
            
            this._stylesInjected = true;
        } catch (error) {
            console.error('Error injecting styles:', error);
        }
    },

    /**
     * Get shared CSS as string
     * @param {string} cssPrefix - CSS class prefix
     * @returns {string} CSS string
     */
    getSharedCSS(cssPrefix) {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&display=swap');

            /* ===== BASE LAYOUT ===== */
            .lunar-room-bg {
                min-height: 100vh;
                width: 100%;
                background: linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1e 100%);
                position: relative;
                overflow-x: clip;
            }

            .practice-room-container {
                min-height: 100vh;
                width: 100%;
                position: relative;
                overflow-x: hidden;
                padding: 2rem 1rem;
            }

            .practice-room-container .back-to-hub-btn {
                display: none;
            }

            /* ===== STARFIELDS ===== */
            .lunar-starfield {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 0;
            }

            .lunar-star {
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                animation: lunar-twinkle 3s infinite;
            }

            @keyframes lunar-twinkle {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 1; }
            }

            /* ===== TOP BAR (matches Solar style) ===== */
            .lunar-top-bar {
                position: sticky;
                top: 0;
                left: 0;
                right: 0;
                z-index: 100;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem 2rem;
                background: transparent;
                backdrop-filter: none;
                border: none;
                margin-bottom: 0;
            }

            .lunar-phase-left {
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .lunar-moon-icon-large {
                font-size: 3rem;
                filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
            }

            .lunar-phase-info h2 {
                margin: 0;
                font-size: 1.5rem;
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
            }

            .lunar-phase-info p {
                margin: 0.5rem 0 0 0;
                color: rgba(224, 224, 255, 0.7);
                font-size: 0.95rem;
            }

            .lunar-live-count-top {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.5rem;
                background: rgba(139, 122, 255, 0.15);
                border-radius: 50px;
                border: 1px solid rgba(139, 122, 255, 0.3);
            }

            .lunar-pulse-dot {
                width: 8px;
                height: 8px;
                background: #8B7AFF;
                border-radius: 50%;
                animation: lunar-pulse 2s infinite;
            }

            @keyframes lunar-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }

            .lunar-live-count-top span {
                color: rgba(224, 224, 255, 0.9);
                font-size: 0.95rem;
                font-weight: 500;
            }

            .lunar-back-hub-btn {
                padding: 0.75rem 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                color: rgba(224, 224, 255, 0.9);
                font-size: 0.95rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lunar-back-hub-btn:hover {
                background: rgba(255, 255, 255, 0.15);
                transform: translateX(-4px);
            }

            /* ===== CONTENT WRAPPER ===== */
            .lunar-content-wrapper {
                position: relative;
                z-index: 5;
                max-width: 1200px;
                margin: 0 auto;
            }

            /* ===== MOON VISUAL ===== */
            .lunar-moon-visual {
                display: flex;
                justify-content: center;
                margin: 3rem 0;
            }

            .lunar-moon-glow {
                position: relative;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lunar-moon-sphere {
                width: 160px;
                height: 160px;
                border-radius: 50%;
                animation: lunar-float 6s ease-in-out infinite;
            }

            @keyframes lunar-float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }

            /* ===== INTRO CARD (matches Solar style) ===== */
            .lunar-intro-card {
                text-align: center;
                margin: 2rem 0;
                padding: 0;
                background: transparent;
                border: none;
                backdrop-filter: none;
            }

            .lunar-intro-image {
                width: 100%;
                max-width: 500px;
                height: auto;
                margin: 0 auto 1.5rem;
                display: block;
                border: none;
                border-radius: 0;
                box-shadow: none;
                filter: invert(1);
            }

            .lunar-intro-card p {
                color: rgba(224, 224, 255, 0.8);
                font-size: 1.1rem;
                line-height: 1.8;
                max-width: 600px;
                margin: 0 auto;
                font-family: 'Cormorant Garamond', serif;
            }

            /* ===== MODE TOGGLE ===== */
            .lunar-mode-toggle {
                display: flex;
                gap: 1rem;
                margin: 2rem 0;
                justify-content: center;
            }

            /* ===== MODE DESCRIPTION ===== */
            .lunar-mode-description {
                text-align: center;
                margin: 2rem 0 3rem;
            }

            .lunar-mode-description h3 {
                color: #e0e0ff;
                font-size: 1.8rem;
                font-family: 'Cormorant Garamond', serif;
                margin-bottom: 0.5rem;
            }

            .lunar-mode-description p {
                color: rgba(224, 224, 255, 0.7);
                font-size: 1.1rem;
                line-height: 1.6;
            }

            .lunar-mode-btn {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 2rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: rgba(224, 224, 255, 0.6);
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lunar-mode-btn:hover {
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .lunar-mode-btn.active {
                background: linear-gradient(135deg, rgba(139, 122, 255, 0.3) 0%, rgba(107, 95, 216, 0.3) 100%);
                border-color: rgba(139, 122, 255, 0.5);
                color: #e0e0ff;
            }

            .lunar-mode-btn svg {
                flex-shrink: 0;
            }

            /* ===== PRACTICE MODES ===== */
            .lunar-practice-mode {
                display: none;
                animation: lunar-fade-in 0.5s ease-out;
            }

            .lunar-practice-mode.active {
                display: block;
            }

            /* ===== WISDOM SECTION ===== */
            .lunar-wisdom-section {
                margin: 3rem 0;
            }

            .lunar-wisdom-text {
                background: linear-gradient(135deg, rgba(139, 122, 255, 0.15) 0%, rgba(107, 95, 216, 0.15) 100%);
                border-left: 4px solid rgba(139, 122, 255, 0.6);
                padding: 2rem 2.5rem;
                border-radius: 12px;
                color: rgba(224, 224, 255, 0.9);
                font-size: 1.3rem;
                font-style: italic;
                font-family: 'Cormorant Garamond', serif;
                line-height: 1.8;
                text-align: center;
            }

            /* ===== SAVED INPUTS ===== */
            .lunar-saved-inputs {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 2rem;
                margin: 2rem 0;
                border: 1px solid rgba(139, 122, 255, 0.3);
            }

            .lunar-saved-inputs h3 {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.5rem;
                margin: 0 0 1.5rem 0;
                text-align: center;
            }

            .lunar-saved-item {
                margin: 1.5rem 0;
                padding: 1.5rem;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                border-left: 3px solid rgba(139, 122, 255, 0.5);
            }

            .lunar-saved-label {
                color: rgba(139, 122, 255, 0.8);
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 0.75rem;
            }

            .lunar-saved-text {
                color: rgba(224, 224, 255, 0.9);
                font-size: 1.1rem;
                line-height: 1.6;
                font-family: 'Cormorant Garamond', serif;
            }

            .lunar-saved-footer {
                text-align: center;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                color: rgba(224, 224, 255, 0.6);
                font-size: 0.9rem;
                font-style: italic;
            }

            /* ===== PRACTICES SECTION ===== */
            .lunar-practices-section {
                margin: 3rem 0;
            }

            .lunar-section-title {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.8rem;
                margin-bottom: 1.5rem;
                text-align: center;
            }

            .lunar-practices-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                margin-top: 2rem;
            }

            .lunar-practice-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 2rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .lunar-practice-card:hover {
                transform: translateY(-5px);
                border-color: rgba(139, 122, 255, 0.5);
                background: rgba(139, 122, 255, 0.1);
                box-shadow: 0 10px 30px rgba(139, 122, 255, 0.2);
            }

            .lunar-practice-card.locked {
                opacity: 0.6;
                cursor: default;
            }

            .lunar-practice-card.locked:hover {
                transform: none;
                border-color: rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.3);
                box-shadow: none;
            }

            .lunar-practice-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lunar-practice-icon svg {
                width: 40px;
                height: 40px;
            }

            .lunar-practice-info h4 {
                color: #e0e0ff;
                font-size: 1.2rem;
                margin: 0 0 0.75rem 0;
                font-family: 'Cormorant Garamond', serif;
            }

            .lunar-practice-info p {
                color: rgba(224, 224, 255, 0.7);
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0;
            }

            .lunar-lock-badge {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                border: 1px solid rgba(34, 197, 94, 0.3);
            }

            /* ===== GROUP CIRCLE ===== */
            .lunar-group-intro {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                margin: 2rem 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lunar-group-intro h3 {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 2rem;
                margin: 0 0 1rem 0;
            }

            .lunar-group-intro p {
                color: rgba(224, 224, 255, 0.8);
                font-size: 1.1rem;
                line-height: 1.8;
                max-width: 600px;
                margin: 0 auto 2rem;
            }

            .lunar-live-presence {
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.5rem;
                background: rgba(139, 122, 255, 0.15);
                border-radius: 50px;
                border: 1px solid rgba(139, 122, 255, 0.3);
                margin: 1.5rem 0;
            }

            .lunar-live-presence span {
                color: rgba(224, 224, 255, 0.9);
                font-size: 0.95rem;
                font-weight: 500;
            }

            .lunar-group-avatars {
                display: flex;
                justify-content: center;
                gap: -12px;
                margin: 2rem 0;
            }

            .lunar-avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                font-size: 1.1rem;
                border: 3px solid rgba(0, 0, 0, 0.5);
                margin-left: -12px;
                animation: lunar-fade-in 0.5s ease-out backwards;
            }

            .lunar-avatar:first-child {
                margin-left: 0;
            }

            .lunar-join-avatar {
                background: rgba(139, 122, 255, 0.3);
                border-color: rgba(139, 122, 255, 0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lunar-join-avatar:hover {
                transform: scale(1.1);
                background: rgba(139, 122, 255, 0.5);
            }

            .lunar-join-circle-btn {
                margin-top: 2rem;
                padding: 1.25rem 3rem;
                background: linear-gradient(135deg, #8B7AFF 0%, #6B5FD8 100%);
                border: none;
                border-radius: 50px;
                color: white;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 8px 20px rgba(139, 122, 255, 0.3);
            }

            .lunar-join-circle-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 30px rgba(139, 122, 255, 0.4);
            }

            /* ===== CLOSURE SECTION ===== */
            .lunar-closure-section {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 2.5rem;
                margin: 3rem 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lunar-closure-section h3 {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.8rem;
                margin: 0 0 1rem 0;
                text-align: center;
            }

            .lunar-closure-section p {
                color: rgba(224, 224, 255, 0.8);
                font-size: 1.1rem;
                line-height: 1.6;
                text-align: center;
                margin-bottom: 2rem;
            }

            /* ===== POPUPS ===== */
            .lunar-practice-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                animation: lunar-fade-in 0.3s ease-out;
            }

            .lunar-popup-content {
                background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(15, 15, 30, 0.95) 100%);
                border-radius: 24px;
                max-width: 700px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                border: 1px solid rgba(139, 122, 255, 0.3);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: lunar-fade-in-up 0.4s ease-out;
                position: relative;
            }

            .lunar-popup-close {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgba(224, 224, 255, 0.8);
                font-size: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
            }

            .lunar-popup-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg);
            }

            .lunar-popup-header {
                padding: 2.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                gap: 1.5rem;
            }

            .lunar-popup-icon {
                font-size: 3rem;
                flex-shrink: 0;
            }

            .lunar-popup-icon svg {
                width: 48px;
                height: 48px;
                color: #8B7AFF;
            }

            .lunar-popup-title h2 {
                margin: 0;
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.8rem;
            }

            .lunar-popup-subtitle {
                margin: 0.5rem 0 0 0;
                color: rgba(224, 224, 255, 0.7);
                font-size: 1rem;
            }

            .lunar-popup-body {
                padding: 2.5rem;
            }

            .lunar-popup-section {
                margin-bottom: 2rem;
            }

            .lunar-popup-section:last-child {
                margin-bottom: 0;
            }

            .lunar-popup-section h3 {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                font-size: 1.5rem;
                margin: 0 0 1rem 0;
            }

            .lunar-popup-section h4 {
                color: #e0e0ff;
                font-size: 1.2rem;
                margin: 0 0 0.75rem 0;
            }

            .lunar-popup-section p {
                color: rgba(224, 224, 255, 0.8);
                line-height: 1.8;
                margin: 0.75rem 0;
            }

            .lunar-popup-section ul, 
            .lunar-popup-section ol {
                color: rgba(224, 224, 255, 0.8);
                line-height: 2;
                padding-left: 1.5rem;
                margin: 1rem 0;
            }

            .lunar-popup-section li {
                margin: 0.5rem 0;
                font-size: 1.05rem;
            }

            .lunar-popup-section ol {
                font-size: 1.05rem;
            }

            .lunar-popup-highlight {
                background: rgba(139, 122, 255, 0.15);
                border-left: 3px solid rgba(139, 122, 255, 0.6);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                margin: 1.5rem 0;
            }

            .lunar-popup-highlight p {
                margin: 0;
                font-style: italic;
                color: rgba(224, 224, 255, 0.9);
            }

            .lunar-popup-footer {
                margin-top: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .lunar-popup-btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #8B7AFF 0%, #6B5FD8 100%);
                border: none;
                border-radius: 12px;
                color: white;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .lunar-popup-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 24px rgba(139, 122, 255, 0.4);
            }

            .lunar-popup-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .lunar-btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                margin-top: 1rem;
            }

            .lunar-btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .lunar-btn-success {
                background: linear-gradient(135deg, #71ffaa 0%, #5FD89E 100%);
            }

            .lunar-btn-success:hover {
                box-shadow: 0 8px 24px rgba(113, 255, 170, 0.4);
            }

            /* ===== FORM ELEMENTS ===== */
            .lunar-textarea-large {
                width: 100%;
                min-height: 150px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 1.5rem;
                color: #e0e0ff;
                font-family: inherit;
                font-size: 1.1rem;
                line-height: 1.6;
                margin: 1.5rem 0;
                resize: vertical;
                transition: border-color 0.3s ease;
            }

            .lunar-textarea-large:focus {
                outline: none;
                border-color: rgba(139, 122, 255, 0.5);
            }

            .lunar-intention-preview {
                background: rgba(139, 122, 255, 0.1);
                border-radius: 12px;
                padding: 1.5rem;
                margin: 1.5rem 0;
            }

            .lunar-preview-label {
                font-style: italic;
                color: rgba(224, 224, 255, 0.6);
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .lunar-word-input {
                width: 100%;
                padding: 1.5rem;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: #e0e0ff;
                font-size: 1.5rem;
                text-align: center;
                font-family: 'Cormorant Garamond', serif;
                margin: 1.5rem 0;
                transition: border-color 0.3s ease;
            }

            .lunar-word-input:focus {
                outline: none;
                border-color: rgba(139, 122, 255, 0.5);
            }

            .lunar-timer-display {
                font-size: 4rem;
                color: #8B7AFF;
                font-family: 'Cormorant Garamond', serif;
                margin: 2rem 0;
            }

            .lunar-timer-small {
                font-size: 2rem;
                color: #8B7AFF;
                font-family: 'Cormorant Garamond', serif;
                margin: 1rem 0;
            }

            .lunar-progress-container {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin: 2rem 0;
            }

            .lunar-progress-bar {
                height: 100%;
                background: linear-gradient(135deg, #8B7AFF 0%, #6B5FD8 100%);
                transition: width 1s linear;
            }

            .lunar-word-cloud {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 16px;
                padding: 3rem;
                min-height: 300px;
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                align-items: center;
                justify-content: center;
                margin: 2rem 0;
            }

            .lunar-word-cloud-item {
                font-family: 'Cormorant Garamond', serif;
                opacity: 0.8;
                animation: lunar-fade-in-scale 0.6s ease-out backwards;
                font-weight: 500;
            }

            .lunar-word-count {
                color: rgba(224, 224, 255, 0.6);
                font-size: 0.9rem;
                margin: 2rem 0;
            }

            .lunar-witness-title {
                color: #e0e0ff;
                font-family: 'Cormorant Garamond', serif;
                margin-bottom: 1rem;
            }

            /* ===== ANIMATIONS ===== */
            @keyframes lunar-fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes lunar-fade-in-down {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes lunar-fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes lunar-fade-in-scale {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 0.8; transform: scale(1); }
            }

            /* ===== RESPONSIVE ===== */
            @media (max-width: 768px) {
                .lunar-top-bar {
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 1rem;
                    gap: 1rem;
                }

                .lunar-phase-left {
                    order: 1;
                }

                .lunar-moon-icon-large {
                    font-size: 2rem;
                }

                .lunar-phase-info h2 {
                    font-size: 1.1rem;
                }

                .lunar-phase-info p {
                    font-size: 0.85rem;
                }

                .lunar-back-hub-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    padding: 0.5rem 1rem;
                    font-size: 0.85rem;
                    order: 3;
                }

                .lunar-live-count-top {
                    order: 2;
                    margin-left: 0;
                }

                .lunar-live-count-top span {
                    font-size: 0.85rem;
                }

                .lunar-wisdom-text {
                    font-size: 1.2rem;
                    padding: 1.5rem;
                }

                .lunar-practices-grid {
                    grid-template-columns: 1fr;
                }

                .lunar-popup-content {
                    padding: 1.5rem;
                    margin: 1rem;
                }

                .lunar-timer-display {
                    font-size: 3rem;
                }

                .lunar-mode-toggle {
                    flex-direction: column;
                }

                .lunar-mode-btn {
                    width: 100%;
                }
            }

            /* ===== ACCESSIBILITY ===== */
            .lunar-practice-card:focus,
            .lunar-popup-btn:focus,
            .lunar-mode-btn:focus,
            .lunar-back-hub-btn:focus {
                outline: 2px solid rgba(139, 122, 255, 0.6);
                outline-offset: 2px;
            }

            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
    }
};

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

// Expose UI singleton globally
window.LunarUI = LunarUI;

// Expose constants
window.LunarUI.CONSTANTS = LunarUI.CONSTANTS;