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
    _adminActiveTab: 'classes0',
    _adminDraft: { classes0: null, classes1: null, sessions0: null, sessions1: null },

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
                <div class="ue-header-row">
                    <div class="section-subtitle">Group classes & private sessions</div>
                    <!-- Admin button injected by injectAdminUI() after Core loads user -->
                </div>
            </div>
            
            <div class="ue-grid">
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
        <div class="event-card classes-card">
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
        <div class="event-card sessions-card">
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
            `<span class="dot ue-dot ${i === 0 ? 'active' : ''}" 
                   data-index="${i}" 
                   style="opacity: ${i === 0 ? '1' : '0.5'};"></span>`
        ).join('');

        return `
        <div class="event-flyer">
            <img src="${this.escapeHtml(data.image)}" 
                 alt="${this.escapeHtml(data.title)}" 
                 id="${imageId}"
                 onclick="UpcomingEvents.openLightbox(this.src)"
                 class="ue-flyer-img-main"
                 style="transition: opacity ${this.config.FADE_DURATION}ms ease;">
            <div class="flyer-indicator">
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
            <img src="${src}" class="ue-lightbox-img">
            <button onclick="UpcomingEvents.closeLightbox()" class="ue-lightbox-close">✕</button>`;
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
        <div class="event-content" id="${contentId}">
            <div class="event-type">
                ${this.escapeHtml(data.type)}
            </div>
            <h3 class="event-heading">
                ${this.escapeHtml(data.title)}
            </h3>
            <div class="event-subheading">
                ${this.escapeHtml(data.subtitle)}
            </div>
            <div class="event-info">
                ${this.escapeHtml(data.info)}
            </div>
            <div class="event-datetime">
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
                onclick="UpcomingEvents.openWhatsApp('${this.escapeHtml(url)}')">
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
                if (saved?.classes0)  this.classes[0]  = { ...this.classes[0],  ...saved.classes0 };
                if (saved?.classes1)  this.classes[1]  = { ...this.classes[1],  ...saved.classes1 };
                if (saved?.sessions0) this.sessions[0] = { ...this.sessions[0], ...saved.sessions0 };
                if (saved?.sessions1) this.sessions[1] = { ...this.sessions[1], ...saved.sessions1 };
                // backwards compat: old saves used 'classes'/'sessions' keys for slot 0
                if (!saved?.classes0  && saved?.classes)  this.classes[0]  = { ...this.classes[0],  ...saved.classes };
                if (!saved?.sessions0 && saved?.sessions) this.sessions[0] = { ...this.sessions[0], ...saved.sessions };
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

        // Init drafts from current data — 4 slots total
        this._adminDraft = {
            classes0:  { ...this.classes[0] },
            classes1:  { ...this.classes[1] },
            sessions0: { ...this.sessions[0] },
            sessions1: { ...this.sessions[1] },
        };
        this._adminActiveTab = 'classes0';

        const modal = document.createElement('div');
        modal.id = 'eventsAdminModal';
        modal.style.cssText = `position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.6);
            backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;`;
        modal.innerHTML = this._getAdminModalHTML();
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', e => { if (e.target === modal) this.closeAdminModal(); });
        this._renderAdminTab('classes0');
    },

    closeAdminModal() {
        const modal = document.getElementById('eventsAdminModal');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    },

    _getAdminModalHTML() {
        const tabs = [
            { id: 'classes0',  label: '◀ Left Flyer 1' },
            { id: 'classes1',  label: '◀ Left Flyer 2' },
            { id: 'sessions0', label: 'Right Flyer 1 ▶' },
            { id: 'sessions1', label: 'Right Flyer 2 ▶' },
        ];
        return `
        <div class="ue-admin-card">
            <button onclick="UpcomingEvents.closeAdminModal()" class="ue-admin-close">✕</button>

            <div class="ue-admin-label">🛡️ Update Flyers</div>

            <!-- 4 tabs in a 2x2 grid -->
            <div class="ue-admin-tabs">
                ${tabs.map((t, i) => `
                <button id="adminTab_${t.id}" onclick="UpcomingEvents._switchAdminTab('${t.id}')"
                        class="ue-admin-tab"
                        style="${i === 0 ? 'background:rgba(139,92,246,0.85);color:#fff;' : 'background:rgba(139,92,246,0.1);color:rgba(139,92,246,0.9);'}">
                    ${t.label}
                </button>`).join('')}
            </div>

            <!-- Tab content injected here -->
            <div id="adminTabContent"></div>

            <!-- Save -->
            <div class="ue-admin-btns">
                <button onclick="UpcomingEvents._adminSave()" class="ue-admin-save">Save & Publish</button>
                <button onclick="UpcomingEvents.closeAdminModal()" class="ue-admin-cancel">Cancel</button>
            </div>
        </div>`;
    },

    _switchAdminTab(tab) {
        // Save current tab's fields before switching
        this._readAdminFields(this._adminActiveTab);
        this._adminActiveTab = tab;
        const tabs = ['classes0','classes1','sessions0','sessions1'];
        tabs.forEach(id => {
            const btn = document.getElementById(`adminTab_${id}`);
            if (!btn) return;
            const active = id === tab;
            btn.style.background = active ? 'rgba(139,92,246,0.85)' : 'rgba(139,92,246,0.1)';
            btn.style.color      = active ? '#fff' : 'rgba(139,92,246,0.9)';
        });
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
                         class="ue-flyer-thumb"
                         style="border:3px solid ${selected ? 'rgba(139,92,246,0.8)' : 'transparent'};">
                        <img src="${url}" class="ue-flyer-img">
                        <div class="ue-flyer-name">${f}</div>
                    </div>`;
        }).join('');

        const labels = { classes0:'Left Card — Flyer 1', classes1:'Left Card — Flyer 2', sessions0:'Right Card — Flyer 1', sessions1:'Right Card — Flyer 2' };

        container.innerHTML = `
            <div class="ue-edit-label">Editing: ${labels[tab]}</div>
            <div class="ue-grid-section">
                <div class="ue-grid-heading">Sessions</div>
                <div class="ue-flyer-grid">
                    ${flyerGrid('Sessions', sessions)}
                </div>
                <div class="ue-grid-heading ue-grid-heading--mt">Workshops</div>
                <div class="ue-flyer-grid">
                    ${flyerGrid('Workshops', workshops)}
                </div>
            </div>

            <div class="ue-fields">
                <input id="adminField_title" placeholder="Title" value="${this.escapeHtml(draft.title||'')}"
                       class="ue-admin-field">
                <input id="adminField_subtitle" placeholder="Subtitle" value="${this.escapeHtml(draft.subtitle||'')}"
                       class="ue-admin-field">
                <textarea id="adminField_info" placeholder="Description" rows="3"
                          class="ue-admin-field ue-admin-field--textarea">${this.escapeHtml(draft.info||'')}</textarea>
                <input id="adminField_type" placeholder="Type (e.g. 🎴 Online Zoom Class)" value="${this.escapeHtml(draft.type||'')}"
                       class="ue-admin-field">
                <input id="adminField_datetime" placeholder="Date & Time (e.g. Monday, 10:00 AM GMT+2)" value="${this.escapeHtml(draft.datetime||'')}"
                       class="ue-admin-field">
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
        if (!document.getElementById('adminField_title')) return; // panel not rendered
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
                classes0:  this._adminDraft.classes0,
                classes1:  this._adminDraft.classes1,
                sessions0: this._adminDraft.sessions0,
                sessions1: this._adminDraft.sessions1,
            });
            if (!ok) throw new Error('saveAppSettings returned false');

            // Apply to live data arrays immediately
            Object.assign(this.classes[0],  this._adminDraft.classes0);
            Object.assign(this.classes[1],  this._adminDraft.classes1);
            Object.assign(this.sessions[0], this._adminDraft.sessions0);
            Object.assign(this.sessions[1], this._adminDraft.sessions1);

            // Re-render whichever card is currently visible
            this.updateCard(this.classes[this.state.classIndex],   'classesImage',  'classesContent',  '.classes-card',  'Register via WhatsApp', this.state.classIndex);
            this.updateCard(this.sessions[this.state.sessionIndex], 'sessionsImage', 'sessionsContent', '.sessions-card', 'Book via WhatsApp',      this.state.sessionIndex);

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
