/**
 * UPCOMING EVENTS MODULE
 * 
 * Manages dual rotating event displays:
 * - Left side: Group classes (e.g., Tarot, Meditation)
 * - Right side: Private sessions (e.g., Tarot readings, Reiki)
 * 
 * Features:
 * - Auto-rotating flyers with smooth transitions
 * - Independent rotation timers for each side
 * - Visual indicators for current slide
 * - WhatsApp integration for bookings
 * 
 * @version 1.0.0
 */

const UpcomingEvents = {
    // ============================================================================
    // DATA
    // ============================================================================
    
    /** Group classes data */
    classes: [
        {
            title: 'Tarot Masterclass',
            subtitle: 'Learn to read the cards with confidence',
            info: 'Discover the ancient wisdom of tarot through interactive lessons. Suitable for beginners and intermediate practitioners. Small group setting ensures personalized guidance.',
            type: '🎴 Online Zoom Class',
            datetime: 'Monday, 10:00 AM (GMT+2)',
            image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions4.jpg',
            whatsapp: 'http://wa.me/+972524588767'
        },
        {
            title: 'Classic Meditation Masterclass',
            subtitle: 'Foundational techniques for daily practice',
            info: 'Master the essential meditation techniques used for thousands of years. Learn breath control, mindfulness, and deep relaxation methods you can use every day.',
            type: '🧘 Online Zoom Class',
            datetime: 'Thursday, 12:00 PM (GMT+2)',
            image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions3.jpg',
            whatsapp: 'http://wa.me/+972524588767'
        }
    ],

    /** Private sessions data */
    sessions: [
        {
            title: 'Private Tarot Spread',
            subtitle: 'Personal reading tailored to your questions',
            info: 'A one-on-one deep dive into your personal journey. Bring your questions about love, career, or life path. Receive guidance and clarity through the cards.',
            type: '🎴 In-Person or Online',
            datetime: 'Daily • Flexible Hours',
            image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions1.jpg',
            whatsapp: 'http://wa.me/+972524588767'
        },
        {
            title: 'Private Reiki Healing Session',
            subtitle: 'Energy healing for balance and wellness',
            info: 'Experience deep relaxation and energetic clearing. Reiki helps release blockages, reduce stress, and restore your natural state of wellbeing. Sessions tailored to your needs.',
            type: '✨ In-Person or Online',
            datetime: 'Daily • Flexible Hours',
            image: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions2.jpg',
            whatsapp: 'http://wa.me/+972524588767'
        }
    ],

    // ============================================================================
    // STATE
    // ============================================================================
    
    state: {
        classIndex: 0,
        sessionIndex: 0,
        classInterval: null,
        sessionInterval: null,
        isInitialized: false
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================
    
    config: {
        ROTATION_INTERVAL: 8000, // 8 seconds
        FADE_DURATION: 500 // 0.5 seconds
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================
    
    /**
     * Generate HTML for the entire upcoming events section
     * @returns {string} HTML string
     */
    getHTML() {
        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Upcoming Events</div>
                <div style="font-size: 12px; color: var(--text-muted);">Group classes & private sessions</div>
            </div>
            
            <div class="events-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
                ${this.getClassesCardHTML()}
                ${this.getSessionsCardHTML()}
            </div>
        </section>
        `;
    },

    /**
     * Generate HTML for classes card (left side)
     * @returns {string} HTML string
     */
    getClassesCardHTML() {
        const data = this.classes[0];
        return `
        <div class="event-card classes-card" style="position: relative; overflow: hidden;">
            ${this.getFlyerHTML(data, 'classesImage', this.classes.length)}
            ${this.getContentHTML(data, 'classesContent', 'Register via WhatsApp')}
        </div>
        `;
    },

    /**
     * Generate HTML for sessions card (right side)
     * @returns {string} HTML string
     */
    getSessionsCardHTML() {
        const data = this.sessions[0];
        return `
        <div class="event-card sessions-card" style="position: relative; overflow: hidden;">
            ${this.getFlyerHTML(data, 'sessionsImage', this.sessions.length)}
            ${this.getContentHTML(data, 'sessionsContent', 'Book via WhatsApp')}
        </div>
        `;
    },

    /**
     * Generate HTML for flyer section (image + indicators)
     * @param {Object} data - Event data
     * @param {string} imageId - ID for the image element
     * @param {number} totalItems - Total number of items for indicators
     * @returns {string} HTML string
     */
    getFlyerHTML(data, imageId, totalItems) {
        const dots = Array.from({ length: totalItems }, (_, i) => 
            `<span class="dot ${i === 0 ? 'active' : ''}" 
                   data-index="${i}" 
                   style="width: 8px; height: 8px; border-radius: 50%; background: white; opacity: ${i === 0 ? '1' : '0.5'};"></span>`
        ).join('');

        return `
        <div class="event-flyer" style="position: relative; height: 450px; overflow: hidden; background: var(--surface);">
            <img src="${this.escapeHtml(data.image)}" 
                 alt="${this.escapeHtml(data.title)}" 
                 id="${imageId}"
                 style="width: 100%; height: 100%; object-fit: contain; transition: opacity ${this.config.FADE_DURATION}ms ease;">
            <div class="flyer-indicator" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
                ${dots}
            </div>
        </div>
        `;
    },

    /**
     * Generate HTML for content section (text + CTA)
     * @param {Object} data - Event data
     * @param {string} contentId - ID for the content container
     * @param {string} ctaText - Call-to-action button text
     * @returns {string} HTML string
     */
    getContentHTML(data, contentId, ctaText) {
        return `
        <div class="event-content" id="${contentId}" style="padding: 20px;">
            <div class="event-type" style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">
                ${this.escapeHtml(data.type)}
            </div>
            <h3 class="event-heading" style="font-family: var(--serif); font-size: 20px; margin-bottom: 4px;">
                ${this.escapeHtml(data.title)}
            </h3>
            <div class="event-subheading" style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">
                ${this.escapeHtml(data.subtitle)}
            </div>
            <div class="event-info" style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 16px; padding: 12px; background: var(--surface); border-radius: var(--radius-sm); border-left: 3px solid var(--accent);">
                ${this.escapeHtml(data.info)}
            </div>
            <div class="event-datetime" style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                📅 ${this.escapeHtml(data.datetime)}
            </div>
            ${this.getButtonHTML(data.whatsapp, ctaText)}
        </div>
        `;
    },

    /**
     * Generate HTML for CTA button
     * @param {string} url - WhatsApp URL
     * @param {string} text - Button text
     * @returns {string} HTML string
     */
    getButtonHTML(url, text) {
        return `
        <button class="event-btn" 
                onclick="UpcomingEvents.openWhatsApp('${this.escapeHtml(url)}')" 
                style="width: 100%;
                       padding: 14px 24px;
                       background: var(--primary);
                       color: var(--season-mood);
                       border: none;
                       border-radius: var(--radius-md);
                       font-size: 15px;
                       font-weight: 700;
                       cursor: pointer;
                       transition: all var(--transition-normal);
                       box-shadow: var(--shadow-raised);
                       text-transform: uppercase;
                       letter-spacing: 0.5px;">
            ${this.escapeHtml(text)}
        </button>
        `;
    },

    // ============================================================================
    // ROTATION LOGIC
    // ============================================================================
    
    /**
     * Initialize rotation timers for both classes and sessions
     */
    initRotation() {
        // Clear any existing intervals
        this.destroy();

        // Start rotation timers
        this.state.classInterval = setInterval(() => {
            try {
                this.rotateClasses();
            } catch (error) {
                console.error('Classes rotation error:', error);
            }
        }, this.config.ROTATION_INTERVAL);

        this.state.sessionInterval = setInterval(() => {
            try {
                this.rotateSessions();
            } catch (error) {
                console.error('Sessions rotation error:', error);
            }
        }, this.config.ROTATION_INTERVAL);

        console.log('✓ UpcomingEvents rotation initialized');
    },

    /**
     * Rotate to next class
     */
    rotateClasses() {
        const nextIndex = (this.state.classIndex + 1) % this.classes.length;
        this.state.classIndex = nextIndex;
        
        this.updateCard(
            this.classes[nextIndex],
            'classesImage',
            'classesContent',
            '.classes-card',
            'Register via WhatsApp',
            nextIndex
        );
    },

    /**
     * Rotate to next session
     */
    rotateSessions() {
        const nextIndex = (this.state.sessionIndex + 1) % this.sessions.length;
        this.state.sessionIndex = nextIndex;
        
        this.updateCard(
            this.sessions[nextIndex],
            'sessionsImage',
            'sessionsContent',
            '.sessions-card',
            'Book via WhatsApp',
            nextIndex
        );
    },

    /**
     * Update a card with new content (consolidated update logic)
     * @param {Object} data - Event data
     * @param {string} imageId - Image element ID
     * @param {string} contentId - Content container ID
     * @param {string} cardSelector - Card container selector
     * @param {string} ctaText - CTA button text
     * @param {number} index - Current index for indicators
     */
    updateCard(data, imageId, contentId, cardSelector, ctaText, index) {
        const image = document.getElementById(imageId);
        const content = document.getElementById(contentId);
        
        if (!image || !content) {
            console.warn(`Elements not found: ${imageId} or ${contentId}`);
            return;
        }

        // Fade out
        image.style.opacity = '0';
        
        setTimeout(() => {
            // Update image
            image.src = data.image;
            image.alt = data.title;
            
            // Update content
            content.innerHTML = this.getContentHTML(data, contentId, ctaText);
            
            // Update indicator dots
            this.updateDots(cardSelector, index);
            
            // Fade in
            image.style.opacity = '1';
        }, this.config.FADE_DURATION);
    },

    /**
     * Update indicator dots
     * @param {string} cardSelector - Card container selector
     * @param {number} activeIndex - Index of active dot
     */
    updateDots(cardSelector, activeIndex) {
        try {
            const card = document.querySelector(cardSelector);
            if (!card) return;

            const dots = card.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.style.opacity = i === activeIndex ? '1' : '0.5';
                if (i === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        } catch (error) {
            console.error('Error updating dots:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================
    
    /**
     * Open WhatsApp link in new tab
     * @param {string} url - WhatsApp URL
     */
    openWhatsApp(url) {
        if (!url) {
            console.error('WhatsApp URL is required');
            return;
        }
        
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
        }
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        if (!str) return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    // ============================================================================
    // LIFECYCLE
    // ============================================================================
    
    /**
     * Render upcoming events into container
     */
    render() {
        if (this.state.isInitialized) {
            console.warn('UpcomingEvents already initialized');
            return;
        }

        const container = document.getElementById('upcomingEventsContainer');
        if (!container) {
            console.warn('upcomingEventsContainer not found - skipping render');
            return;
        }

        try {
            container.innerHTML = this.getHTML();
            
            // Start rotation after render
            setTimeout(() => this.initRotation(), 100);
            
            this.state.isInitialized = true;
            console.log('✓ UpcomingEvents rendered');
            
        } catch (error) {
            console.error('UpcomingEvents render error:', error);
        }
    },

    /**
     * Clean up intervals and reset state
     */
    destroy() {
        if (this.state.classInterval) {
            clearInterval(this.state.classInterval);
            this.state.classInterval = null;
        }
        
        if (this.state.sessionInterval) {
            clearInterval(this.state.sessionInterval);
            this.state.sessionInterval = null;
        }
        
        this.state.isInitialized = false;
        console.log('✓ UpcomingEvents destroyed');
    }
};

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

// Auto-render when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UpcomingEvents.render());
} else {
    // DOM already loaded
    UpcomingEvents.render();
}

// ============================================================================
// GLOBAL EXPOSURE
// ============================================================================

window.UpcomingEvents = UpcomingEvents;
