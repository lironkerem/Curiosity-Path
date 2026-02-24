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
        ROTATION_INTERVAL: 15000, // 15 seconds
        FADE_DURATION: 500 // 0.5 seconds
    },

    // ============================================================================
    // FLYER CATALOG — pre-made text for each flyer image
    // ============================================================================

    flyerCatalog: {
        'Sessions1.jpg': {
            title: '1 on 1 Private Tarot Reading',
            subtitle: 'A deeply personal reading just for you',
            info: 'Sit down one-on-one for an intimate tarot session tailored entirely to your questions and journey. Whether you seek clarity on love, career, purpose, or personal growth — the cards will meet you exactly where you are.',
            type: '🎴 In-Person or Online',
        },
        'Sessions2.jpg': {
            title: '1 on 1 Reiki Healing Session',
            subtitle: 'Deep energetic healing, tailored to you',
            info: 'A private Reiki session focused entirely on your energetic field. Release blockages, restore balance, and return to a natural state of ease and wholeness. Each session is intuitive and adapted to what your body and energy most need.',
            type: '✨ In-Person or Online',
        },
        'Sessions3.jpg': {
            title: 'Classic Meditation Class',
            subtitle: 'Timeless techniques for a calm, clear mind',
            info: 'Learn the foundational meditation practices that have been used for thousands of years. Covering breath awareness, body scanning, and silent sitting — this class gives you practical tools you can return to every day.',
            type: '🧘 Online Zoom Class',
        },
        'Sessions4.jpg': {
            title: 'Tarot Masterclass',
            subtitle: 'Read the cards with depth and confidence',
            info: 'An immersive class exploring the full language of tarot — from Major Arcana archetypes to Minor Arcana nuance. Develop your intuition, learn how to construct meaningful spreads, and find your own voice as a reader.',
            type: '🎴 Online Zoom Class',
        },
        'Sessions5.jpg': {
            title: 'OSHO Active Meditations',
            subtitle: 'Move, release, and arrive in stillness',
            info: 'OSHO Active Meditations use dynamic movement, breath, and sound to shake loose tension and mental noise — before arriving at deep inner silence. Suitable for all levels, no experience required.',
            type: '🌀 In-Person or Online',
        },
        'Sessions6.jpg': {
            title: 'Guided Visualization Session',
            subtitle: 'Journey inward through the power of the mind',
            info: 'A deeply relaxing guided session using vivid inner imagery to access clarity, healing, and inspiration. Ideal for stress relief, goal alignment, and connecting with your deeper wisdom.',
            type: '🌟 In-Person or Online',
        },
        'Sessions7.jpg': {
            title: 'E.F.T. Healing Session',
            subtitle: 'Tap into freedom from stress and old patterns',
            info: 'Emotional Freedom Technique (EFT) combines gentle tapping on acupressure points with focused intention to release emotional blocks, reduce anxiety, and shift limiting beliefs held in the body.',
            type: '🤲 In-Person or Online',
        },
        'Sessions8.jpg': {
            title: 'Sivananda Yoga Class',
            subtitle: 'Classical yoga for body, breath, and spirit',
            info: 'A traditional Sivananda yoga class integrating asana, pranayama, relaxation, and mantra. Rooted in the classical five-point system, this class nourishes the whole being — body, mind, and soul.',
            type: '🕉️ In-Person',
        },
        'Sessions9.jpg': {
            title: 'Divine Intimacy Lecture',
            subtitle: 'Explore the sacred relationship with the self',
            info: 'A reflective lecture-style session exploring the deeper dimensions of intimacy — with yourself, with life, and with the divine. Drawing from mystical traditions, this talk invites you into a more tender and conscious way of being.',
            type: '💫 In-Person or Online',
        },
        'Workshops1.jpg': {
            title: 'Tarot Workshop',
            subtitle: 'Your complete introduction to the cards',
            info: 'A full immersive workshop covering the 78-card system, major and minor arcana, spreads, and intuitive reading practice. You will leave with the confidence and foundation to read for yourself and others.',
            type: '🎴 Workshop',
        },
        'Workshops2.jpg': {
            title: 'Reiki Course',
            subtitle: 'Learn to channel healing energy',
            info: 'A comprehensive Reiki training covering the history, principles, hand positions, and attunement process. Whether you are a complete beginner or looking to deepen your practice, this course opens the door to self-healing and healing others.',
            type: '✨ Workshop',
        },
        'Workshops3.jpg': {
            title: 'Meditation Workshop',
            subtitle: 'Build a practice that transforms your life',
            info: 'An experiential workshop exploring multiple meditation styles — from breath-focused techniques to body awareness and mantra-based practice. You will leave with a personalised toolkit and the understanding to maintain a consistent daily practice.',
            type: '🧘 Workshop',
        },
        'Workshops4.jpg': {
            title: 'Rainbow Light-body Workshop',
            subtitle: 'Activate and align your energetic body',
            info: 'A profound workshop working with the subtle energy body, chakra system, and light-body activation. Through guided practices, visualization, and energy work, participants explore the luminous nature of their own being.',
            type: '🌈 Workshop',
        },
        'Workshops5.jpg': {
            title: 'OSHO Camp (3 Days)',
            subtitle: 'Three days of immersive meditation and awakening',
            info: 'A transformative 3-day residential camp using OSHO Active and silent meditations to strip away conditioning and awaken presence. Each day deepens your practice through movement, music, silence, and community.',
            type: '🌀 3-Day Retreat',
        },
        'Workshops6.jpg': {
            title: 'OSHO Camp (4 Days)',
            subtitle: 'Four days of deep immersion and inner freedom',
            info: 'An extended 4-day OSHO residential camp offering a deeper dive into the full spectrum of OSHO meditations. More time means more depth — more silence, more breakthroughs, and more space to simply be.',
            type: '🌀 4-Day Retreat',
        },
    },

    // Base URL for flyer images
    _flyerBase: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/',

    // Admin modal state
    _adminModal: null,
    _adminActiveTab: 'classes', // 'classes' | 'sessions'
    _adminDraft: { classes: null, sessions: null },

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
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size: 12px; color: var(--text-muted);">Group classes & private sessions</div>
                    <!-- Admin button injected by injectAdminUI() after Core loads user -->
                </div>
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
                 onclick="UpcomingEvents.openLightbox(this.src)"
                 style="width: 100%; height: 100%; object-fit: contain; transition: opacity ${this.config.FADE_DURATION}ms ease;
                        cursor: zoom-in;">
            <div class="flyer-indicator" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">
                ${dots}
            </div>
        </div>
        `;
    },

    openLightbox(src) {
        if (document.getElementById('flyerLightbox')) return;
        const lb = document.createElement('div');
        lb.id = 'flyerLightbox';
        lb.style.cssText = `position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);
            display:flex;align-items:center;justify-content:center;
            cursor:zoom-out;opacity:0;transition:opacity 0.25s ease;`;
        lb.innerHTML = `
            <img src="${src}" style="max-width:94vw;max-height:94vh;object-fit:contain;
                border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.6);
                transform:scale(0.95);transition:transform 0.25s ease;">
            <button onclick="UpcomingEvents.closeLightbox()"
                    style="position:absolute;top:18px;right:22px;background:none;border:none;
                           cursor:pointer;font-size:28px;color:#fff;opacity:0.7;line-height:1;">✕</button>`;
        document.body.appendChild(lb);
        document.body.style.overflow = 'hidden';

        // Animate in
        requestAnimationFrame(() => {
            lb.style.opacity = '1';
            lb.querySelector('img').style.transform = 'scale(1)';
        });

        // Close on backdrop click
        lb.addEventListener('click', e => { if (e.target === lb) this.closeLightbox(); });

        // Close on Escape
        this._lightboxEsc = (e) => { if (e.key === 'Escape') this.closeLightbox(); };
        document.addEventListener('keydown', this._lightboxEsc);
    },

    closeLightbox() {
        const lb = document.getElementById('flyerLightbox');
        if (!lb) return;
        lb.style.opacity = '0';
        setTimeout(() => {
            lb.remove();
            document.body.style.overflow = '';
        }, 250);
        if (this._lightboxEsc) {
            document.removeEventListener('keydown', this._lightboxEsc);
        }
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

        // Left card starts immediately
        this.state.classInterval = setInterval(() => {
            try { this.rotateClasses(); } catch (error) { console.error('Classes rotation error:', error); }
        }, this.config.ROTATION_INTERVAL);

        // Right card starts offset by half the interval so they never change together
        this._staggerTimeout = setTimeout(() => {
            this.state.sessionInterval = setInterval(() => {
                try { this.rotateSessions(); } catch (error) { console.error('Sessions rotation error:', error); }
            }, this.config.ROTATION_INTERVAL);
        }, this.config.ROTATION_INTERVAL / 2);

        console.log('✓ UpcomingEvents rotation initialized (staggered)');
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
    injectAdminUI() {
        const isAdmin = window.Core?.state?.currentUser?.is_admin === true;
        // Look for existing button
        const existing = document.getElementById('upcomingAdminBtn');
        if (existing) { existing.style.display = isAdmin ? 'inline-block' : 'none'; return; }
        if (!isAdmin) return;
        // Inject button into section header
        const header = document.querySelector('#upcomingEventsContainer .section-header > div:last-child');
        if (!header) return;
        const btn = document.createElement('button');
        btn.id = 'upcomingAdminBtn';
        btn.onclick = () => UpcomingEvents.openAdminModal();
        btn.style.cssText = 'font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:none;cursor:pointer;background:rgba(139,92,246,0.12);color:rgba(139,92,246,0.9);text-transform:uppercase;letter-spacing:0.5px;';
        btn.textContent = '🛡️ Update Flyers';
        header.appendChild(btn);
    },

    async render() {
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
            // Load saved config from Supabase if available
            if (window.CommunityDB?.ready) {
                const saved = await CommunityDB.getAppSettings('upcoming_events');
                if (saved?.classes) this.classes[0] = { ...this.classes[0], ...saved.classes };
                if (saved?.sessions) this.sessions[0] = { ...this.sessions[0], ...saved.sessions };
            }

            container.innerHTML = this.getHTML();
            
            // Start rotation after render
            setTimeout(() => this.initRotation(), 100);
            
            this.state.isInitialized = true;
            console.log('✓ UpcomingEvents rendered');
            
        } catch (error) {
            console.error('UpcomingEvents render error:', error);
        }
    },

    // ============================================================================
    // ADMIN MODAL
    // ============================================================================

    openAdminModal() {
        if (document.getElementById('eventsAdminModal')) return;

        // Init drafts from current data
        this._adminDraft = {
            classes:  { ...this.classes[0] },
            sessions: { ...this.sessions[0] },
        };
        this._adminActiveTab = 'classes';

        const modal = document.createElement('div');
        modal.id = 'eventsAdminModal';
        modal.style.cssText = `position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);
            backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;`;
        modal.innerHTML = this._getAdminModalHTML();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close on backdrop
        modal.addEventListener('click', e => { if (e.target === modal) this.closeAdminModal(); });

        this._renderAdminTab('classes');
    },

    closeAdminModal() {
        const modal = document.getElementById('eventsAdminModal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    },

    _getAdminModalHTML() {
        return `
        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:24px;
                    max-width:560px;width:94%;max-height:90vh;overflow-y:auto;position:relative;
                    box-shadow:8px 8px 20px rgba(0,0,0,0.2);">
            <button onclick="UpcomingEvents.closeAdminModal()"
                    style="position:absolute;top:14px;right:16px;background:none;border:none;
                           cursor:pointer;font-size:18px;opacity:0.5;">✕</button>

            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                        color:rgba(139,92,246,0.9);margin-bottom:16px;">🛡️ Update Flyers</div>

            <!-- Tabs -->
            <div style="display:flex;gap:8px;margin-bottom:20px;">
                <button id="adminTabClasses" onclick="UpcomingEvents._switchAdminTab('classes')"
                        style="flex:1;padding:9px;border-radius:10px;border:none;cursor:pointer;
                               font-size:0.88rem;font-weight:600;
                               background:rgba(139,92,246,0.85);color:#fff;">
                    Left Card (Classes)
                </button>
                <button id="adminTabSessions" onclick="UpcomingEvents._switchAdminTab('sessions')"
                        style="flex:1;padding:9px;border-radius:10px;border:none;cursor:pointer;
                               font-size:0.88rem;font-weight:600;
                               background:rgba(139,92,246,0.1);color:rgba(139,92,246,0.9);">
                    Right Card (Sessions)
                </button>
            </div>

            <!-- Tab content injected here -->
            <div id="adminTabContent"></div>

            <!-- Save -->
            <div style="display:flex;gap:10px;margin-top:20px;">
                <button onclick="UpcomingEvents._adminSave()"
                        style="flex:1;padding:11px;border-radius:12px;border:none;cursor:pointer;
                               font-size:0.92rem;font-weight:700;
                               background:rgba(139,92,246,0.85);color:#fff;">
                    Save & Publish
                </button>
                <button onclick="UpcomingEvents.closeAdminModal()"
                        style="padding:11px 18px;border-radius:12px;border:none;cursor:pointer;
                               font-size:0.92rem;background:rgba(0,0,0,0.06);color:var(--neuro-text);">
                    Cancel
                </button>
            </div>
        </div>`;
    },

    _switchAdminTab(tab) {
        this._adminActiveTab = tab;
        const cBtn = document.getElementById('adminTabClasses');
        const sBtn = document.getElementById('adminTabSessions');
        if (cBtn) { cBtn.style.background = tab === 'classes' ? 'rgba(139,92,246,0.85)' : 'rgba(139,92,246,0.1)'; cBtn.style.color = tab === 'classes' ? '#fff' : 'rgba(139,92,246,0.9)'; }
        if (sBtn) { sBtn.style.background = tab === 'sessions' ? 'rgba(139,92,246,0.85)' : 'rgba(139,92,246,0.1)'; sBtn.style.color = tab === 'sessions' ? '#fff' : 'rgba(139,92,246,0.9)'; }
        this._renderAdminTab(tab);
    },

    _renderAdminTab(tab) {
        const container = document.getElementById('adminTabContent');
        if (!container) return;
        const draft = this._adminDraft[tab];
        const sessions = ['Sessions1.jpg','Sessions2.jpg','Sessions3.jpg','Sessions4.jpg',
                          'Sessions5.jpg','Sessions6.jpg','Sessions7.jpg','Sessions8.jpg','Sessions9.jpg'];
        const workshops = ['Workshops1.jpg','Workshops2.jpg','Workshops3.jpg',
                           'Workshops4.jpg','Workshops5.jpg','Workshops6.jpg'];

        const flyerGrid = (folder, files) => files.map(f => {
            const url = this._flyerBase + folder + '/' + f;
            const selected = draft.image === url;
            return `<div onclick="UpcomingEvents._selectFlyer('${tab}','${url}','${f}')"
                         style="cursor:pointer;border-radius:8px;overflow:hidden;
                                border:3px solid ${selected ? 'rgba(139,92,246,0.8)' : 'transparent'};
                                transition:border 0.15s;">
                        <img src="${url}" style="width:100%;height:90px;object-fit:cover;display:block;">
                        <div style="font-size:10px;text-align:center;padding:2px;color:var(--text-muted);">${f}</div>
                    </div>`;
        }).join('');

        container.innerHTML = `
            <div style="margin-bottom:14px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                            color:var(--text-muted);margin-bottom:8px;">Sessions</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${flyerGrid('Sessions', sessions)}
                </div>
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;
                            color:var(--text-muted);margin:14px 0 8px;">Workshops</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${flyerGrid('Workshops', workshops)}
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:10px;">
                <input id="adminField_title" placeholder="Title" value="${this.escapeHtml(draft.title||'')}"
                       style="padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                              font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);width:100%;box-sizing:border-box;">
                <input id="adminField_subtitle" placeholder="Subtitle" value="${this.escapeHtml(draft.subtitle||'')}"
                       style="padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                              font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);width:100%;box-sizing:border-box;">
                <textarea id="adminField_info" placeholder="Description" rows="3"
                          style="padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                                 font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);
                                 width:100%;box-sizing:border-box;resize:vertical;">${this.escapeHtml(draft.info||'')}</textarea>
                <input id="adminField_type" placeholder="Type (e.g. 🎴 Online Zoom Class)" value="${this.escapeHtml(draft.type||'')}"
                       style="padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                              font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);width:100%;box-sizing:border-box;">
                <input id="adminField_datetime" placeholder="Date & Time (e.g. Monday, 10:00 AM GMT+2)" value="${this.escapeHtml(draft.datetime||'')}"
                       style="padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                              font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);width:100%;box-sizing:border-box;">
            </div>
        `;
    },

    _selectFlyer(tab, url, filename) {
        const meta = this.flyerCatalog[filename] || {};
        this._adminDraft[tab] = {
            ...this._adminDraft[tab],
            image:    url,
            title:    meta.title    || this._adminDraft[tab].title,
            subtitle: meta.subtitle || this._adminDraft[tab].subtitle,
            info:     meta.info     || this._adminDraft[tab].info,
            type:     meta.type     || this._adminDraft[tab].type,
        };
        this._renderAdminTab(tab);
    },

    _readAdminFields(tab) {
        const g = id => document.getElementById(id)?.value?.trim() || '';
        this._adminDraft[tab] = {
            ...this._adminDraft[tab],
            title:    g('adminField_title'),
            subtitle: g('adminField_subtitle'),
            info:     g('adminField_info'),
            type:     g('adminField_type'),
            datetime: g('adminField_datetime'),
        };
    },

    async _adminSave() {
        const saveBtn = document.querySelector('#eventsAdminModal button[onclick*="_adminSave"]');
        if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

        // Capture current tab fields before saving
        this._readAdminFields(this._adminActiveTab);

        try {
            const ok = await CommunityDB.saveAppSettings('upcoming_events', {
                classes:  this._adminDraft.classes,
                sessions: this._adminDraft.sessions,
            });
            if (!ok) throw new Error('saveAppSettings returned false');

            // Apply to live cards immediately
            const cd = this._adminDraft.classes;
            const sd = this._adminDraft.sessions;
            if (cd) {
                Object.assign(this.classes[0], cd);
                this.updateCard(this.classes[0], 'classesImage', 'classesContent', '.classes-card', 'Register via WhatsApp', this.state.classIndex);
            }
            if (sd) {
                Object.assign(this.sessions[0], sd);
                this.updateCard(this.sessions[0], 'sessionsImage', 'sessionsContent', '.sessions-card', 'Book via WhatsApp', this.state.sessionIndex);
            }

            Core.showToast('✓ Flyers updated for all users');
            this.closeAdminModal();
        } catch (err) {
            console.error('_adminSave error:', err);
            Core.showToast('❌ Could not save — please try again');
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save & Publish'; }
        }
    },

    /**
     * Clean up intervals and reset state
     */
    destroy() {
        if (this._staggerTimeout) {
            clearTimeout(this._staggerTimeout);
            this._staggerTimeout = null;
        }
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
