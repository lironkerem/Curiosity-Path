/**
 * UPCOMING EVENTS MODULE
 * @version 1.1.0
 *
 * Manages dual rotating event displays:
 * - Left side:  Group classes (e.g., Tarot, Meditation)
 * - Right side: Private sessions (e.g., Tarot readings, Reiki)
 *
 * Features:
 * - Auto-rotating flyers with smooth transitions
 * - Independent staggered rotation timers
 * - Visual dot indicators per slide
 * - WhatsApp integration for bookings
 * - Admin flyer editor (admin users only)
 */

import { Core } from './core.js';
import { CommunityDB } from './community-supabase.js';

const UpcomingEvents = {

    // ============================================================================
    // DATA
    // ============================================================================

    classes: [
        {
            title:    'Tarot Masterclass',
            subtitle: 'Learn to read the cards with confidence',
            info:     'Discover the ancient wisdom of tarot through interactive lessons. Suitable for beginners and intermediate practitioners. Small group setting ensures personalized guidance.',
            type:     '🎴 Online Zoom Class',
            datetime: 'Monday, 10:00 AM (GMT+2)',
            image:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions4.jpg',
            whatsapp: 'http://wa.me/+972524588767',
        },
        {
            title:    'Classic Meditation Masterclass',
            subtitle: 'Foundational techniques for daily practice',
            info:     'Master the essential meditation techniques used for thousands of years. Learn breath control, mindfulness, and deep relaxation methods you can use every day.',
            type:     '🧘 Online Zoom Class',
            datetime: 'Thursday, 12:00 PM (GMT+2)',
            image:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions3.jpg',
            whatsapp: 'http://wa.me/+972524588767',
        },
    ],

    sessions: [
        {
            title:    'Private Tarot Spread',
            subtitle: 'Personal reading tailored to your questions',
            info:     'A one-on-one deep dive into your personal journey. Bring your questions about love, career, or life path. Receive guidance and clarity through the cards.',
            type:     '🎴 In-Person or Online',
            datetime: 'Daily • Flexible Hours',
            image:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions1.jpg',
            whatsapp: 'http://wa.me/+972524588767',
        },
        {
            title:    'Private Reiki Healing Session',
            subtitle: 'Energy healing for balance and wellness',
            info:     'Experience deep relaxation and energetic clearing. Reiki helps release blockages, reduce stress, and restore your natural state of wellbeing. Sessions tailored to your needs.',
            type:     '✨ In-Person or Online',
            datetime: 'Daily • Flexible Hours',
            image:    'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/Sessions/Sessions2.jpg',
            whatsapp: 'http://wa.me/+972524588767',
        },
    ],

    // ============================================================================
    // STATE & CONFIG
    // ============================================================================

    state: {
        classIndex:    0,
        sessionIndex:  0,
        classInterval:   null,
        sessionInterval: null,
        isInitialized:   false,
    },

    config: {
        ROTATION_INTERVAL: 15000,
        FADE_DURATION:     500,

        // Per-card static config - drives rotation, updateCard, and _adminSave
        CARDS: {
            classes: {
                imageId:     'classesImage',
                contentId:   'classesContent',
                cardSelector:'.classes-card',
                ctaText:     'Register via WhatsApp',
                stateKey:    'classIndex',
                intervalKey: 'classInterval',
                slots:       ['classes0', 'classes1'],
            },
            sessions: {
                imageId:     'sessionsImage',
                contentId:   'sessionsContent',
                cardSelector:'.sessions-card',
                ctaText:     'Book via WhatsApp',
                stateKey:    'sessionIndex',
                intervalKey: 'sessionInterval',
                slots:       ['sessions0', 'sessions1'],
            },
        },

        ADMIN_TABS: [
            { id: 'classes0',  label: '◀ Left Flyer 1' },
            { id: 'classes1',  label: '◀ Left Flyer 2' },
            { id: 'sessions0', label: 'Right Flyer 1 ▶' },
            { id: 'sessions1', label: 'Right Flyer 2 ▶' },
        ],

        FLYER_FILES: {
            Sessions:  ['Sessions1.jpg','Sessions2.jpg','Sessions3.jpg','Sessions4.jpg',
                        'Sessions5.jpg','Sessions6.jpg','Sessions7.jpg','Sessions8.jpg','Sessions9.jpg'],
            Workshops: ['Workshops1.jpg','Workshops2.jpg','Workshops3.jpg',
                        'Workshops4.jpg','Workshops5.jpg','Workshops6.jpg'],
        },
    },

    // ============================================================================
    // FLYER CATALOG
    // ============================================================================

    flyerCatalog: {
        'Sessions1.jpg': {
            title: '1 on 1 Private Tarot Reading',
            subtitle: 'A deeply personal reading just for you',
            info: 'Sit down one-on-one for an intimate tarot session tailored entirely to your questions and journey. Whether you seek clarity on love, career, purpose, or personal growth - the cards will meet you exactly where you are.',
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
            info: 'Learn the foundational meditation practices that have been used for thousands of years. Covering breath awareness, body scanning, and silent sitting - this class gives you practical tools you can return to every day.',
            type: '🧘 Online Zoom Class',
        },
        'Sessions4.jpg': {
            title: 'Tarot Masterclass',
            subtitle: 'Read the cards with depth and confidence',
            info: 'An immersive class exploring the full language of tarot - from Major Arcana archetypes to Minor Arcana nuance. Develop your intuition, learn how to construct meaningful spreads, and find your own voice as a reader.',
            type: '🎴 Online Zoom Class',
        },
        'Sessions5.jpg': {
            title: 'OSHO Active Meditations',
            subtitle: 'Move, release, and arrive in stillness',
            info: 'OSHO Active Meditations use dynamic movement, breath, and sound to shake loose tension and mental noise - before arriving at deep inner silence. Suitable for all levels, no experience required.',
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
            info: 'A traditional Sivananda yoga class integrating asana, pranayama, relaxation, and mantra. Rooted in the classical five-point system, this class nourishes the whole being - body, mind, and soul.',
            type: '🕉️ In-Person',
        },
        'Sessions9.jpg': {
            title: 'Divine Intimacy Lecture',
            subtitle: 'Explore the sacred relationship with the self',
            info: 'A reflective lecture-style session exploring the deeper dimensions of intimacy - with yourself, with life, and with the divine. Drawing from mystical traditions, this talk invites you into a more tender and conscious way of being.',
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
            info: 'An experiential workshop exploring multiple meditation styles - from breath-focused techniques to body awareness and mantra-based practice. You will leave with a personalised toolkit and the understanding to maintain a consistent daily practice.',
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
            info: 'An extended 4-day OSHO residential camp offering a deeper dive into the full spectrum of OSHO meditations. More time means more depth - more silence, more breakthroughs, and more space to simply be.',
            type: '🌀 4-Day Retreat',
        },
    },

    _flyerBase:      'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/CTA/',
    _adminModal:     null,
    _adminActiveTab: 'classes0',
    _adminDraft:     { classes0: null, classes1: null, sessions0: null, sessions1: null },
    _staggerTimeout: null,
    _lightboxEsc:    null,

    // ============================================================================
    // HTML GENERATION
    // ============================================================================

    getHTML() {
        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Upcoming Events</div>
                <div style="display:flex;align-items:center;gap:12px;">
                    <div style="font-size:12px;color:var(--text-muted);">Group classes & private sessions</div>
                </div>
            </div>
            <div class="events-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
                ${this._getCardHTML('classes')}
                ${this._getCardHTML('sessions')}
            </div>
        </section>`;
    },

    _getCardHTML(type) {
        const cfg  = this.config.CARDS[type];
        const data = this[type][0];
        return `
        <div class="event-card ${type}-card" style="position:relative;overflow:hidden;">
            ${this._getFlyerHTML(data, cfg.imageId, this[type].length)}
            ${this._getContentHTML(data, cfg.contentId, cfg.ctaText)}
        </div>`;
    },

    _getFlyerHTML(data, imageId, totalItems) {
        const dots = Array.from({ length: totalItems }, (_, i) =>
            `<span class="dot${i === 0 ? ' active' : ''}" data-index="${i}"
                   style="width:8px;height:8px;border-radius:50%;background:white;opacity:${i === 0 ? '1' : '0.5'};"></span>`
        ).join('');

        return `
        <div class="event-flyer" style="position:relative;height:450px;overflow:hidden;background:var(--neuro-bg);">
            <img src="${this.escapeHtml(data.image)}" alt="${this.escapeHtml(data.title)}" id="${imageId}"
                 onclick="UpcomingEvents.openLightbox(this.src)"
                 style="width:100%;height:100%;object-fit:contain;transition:opacity ${this.config.FADE_DURATION}ms ease;cursor:zoom-in;">
            <div class="flyer-indicator" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;">
                ${dots}
            </div>
        </div>`;
    },

    _getContentHTML(data, contentId, ctaText) {
        return `
        <div class="event-content" id="${contentId}" style="padding:20px;">
            <div class="event-type" style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">${this.escapeHtml(data.type)}</div>
            <h3 class="event-heading" style="font-family:var(--serif);font-size:20px;margin-bottom:4px;">${this.escapeHtml(data.title)}</h3>
            <div class="event-subheading" style="font-size:14px;color:var(--text-secondary);margin-bottom:12px;">${this.escapeHtml(data.subtitle)}</div>
            <div class="event-info" style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:16px;padding:12px;background:var(--neuro-bg);border-radius:var(--radius-sm);border-left:3px solid var(--accent);">
                ${this.escapeHtml(data.info)}
            </div>
            <div class="event-datetime" style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">📅 ${this.escapeHtml(data.datetime)}</div>
            <button class="event-btn" onclick="UpcomingEvents.openWhatsApp('${this.escapeHtml(data.whatsapp)}')"
                    >
                ${this.escapeHtml(ctaText)}
            </button>
        </div>`;
    },

    // ============================================================================
    // LIGHTBOX
    // ============================================================================

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

        requestAnimationFrame(() => {
            lb.style.opacity = '1';
            lb.querySelector('img').style.transform = 'scale(1)';
        });

        lb.addEventListener('click', e => { if (e.target === lb) this.closeLightbox(); });
        this._lightboxEsc = (e) => { if (e.key === 'Escape') this.closeLightbox(); };
        document.addEventListener('keydown', this._lightboxEsc);
    },

    closeLightbox() {
        const lb = document.getElementById('flyerLightbox');
        if (!lb) return;
        lb.style.opacity = '0';
        setTimeout(() => { lb.remove(); document.body.style.overflow = ''; }, 250);
        if (this._lightboxEsc) {
            document.removeEventListener('keydown', this._lightboxEsc);
            this._lightboxEsc = null;
        }
    },

    // ============================================================================
    // ROTATION
    // ============================================================================

    initRotation() {
        this.destroy();

        const start = (type, delay = 0) => {
            const cfg = this.config.CARDS[type];
            const tick = () => {
                this.state[cfg.stateKey] = (this.state[cfg.stateKey] + 1) % this[type].length;
                this.updateCard(type, this.state[cfg.stateKey]);
            };
            if (delay) {
                this._staggerTimeout = setTimeout(() => {
                    this.state[cfg.intervalKey] = setInterval(tick, this.config.ROTATION_INTERVAL);
                }, delay);
            } else {
                this.state[cfg.intervalKey] = setInterval(tick, this.config.ROTATION_INTERVAL);
            }
        };

        start('classes');
        start('sessions', this.config.ROTATION_INTERVAL / 2);
        console.log('✓ UpcomingEvents rotation initialized (staggered)');
    },

    updateCard(type, index) {
        const cfg     = this.config.CARDS[type];
        const data    = this[type][index];
        const image   = document.getElementById(cfg.imageId);
        const content = document.getElementById(cfg.contentId);

        if (!image || !content) {
            console.warn(`[UpcomingEvents] Elements not found: ${cfg.imageId} or ${cfg.contentId}`);
            return;
        }

        image.style.opacity = '0';
        setTimeout(() => {
            image.src = data.image;
            image.alt = data.title;
            content.innerHTML = this._getContentHTML(data, cfg.contentId, cfg.ctaText);
            this._updateDots(cfg.cardSelector, index);
            image.style.opacity = '1';
        }, this.config.FADE_DURATION);
    },

    _updateDots(cardSelector, activeIndex) {
        document.querySelector(cardSelector)?.querySelectorAll('.dot').forEach((dot, i) => {
            const isActive = i === activeIndex;
            dot.style.opacity = isActive ? '1' : '0.5';
            dot.classList.toggle('active', isActive);
        });
    },

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    async render() {
        if (this.state.isInitialized) { console.warn('UpcomingEvents already initialized'); return; }

        const container = document.getElementById('upcomingEventsContainer');
        if (!container) { console.warn('upcomingEventsContainer not found - skipping render'); return; }

        try {
            if (CommunityDB?.ready) {
                const saved = await CommunityDB.getAppSettings('upcoming_events');
                if (saved) {
                    // Current slot keys
                    ['classes0','classes1','sessions0','sessions1'].forEach(key => {
                        if (saved[key]) {
                            const [type, idx] = [key.slice(0,-1), +key.slice(-1)];
                            this[type][idx] = { ...this[type][idx], ...saved[key] };
                        }
                    });
                    // Backwards compat: old saves used 'classes'/'sessions' for slot 0
                    if (!saved.classes0  && saved.classes)  this.classes[0]  = { ...this.classes[0],  ...saved.classes };
                    if (!saved.sessions0 && saved.sessions) this.sessions[0] = { ...this.sessions[0], ...saved.sessions };
                }
            }

            container.innerHTML = this.getHTML();
            setTimeout(() => this.initRotation(), 100);
            this.state.isInitialized = true;
            console.log('✓ UpcomingEvents rendered');
        } catch (error) {
            console.error('UpcomingEvents render error:', error);
        }
    },

    injectAdminUI() {
        const isAdmin = Core?.state?.currentUser?.is_admin === true;
        const existing = document.getElementById('upcomingAdminBtn');
        if (existing) { existing.style.display = isAdmin ? 'inline-block' : 'none'; return; }
        if (!isAdmin) return;

        const header = document.querySelector('#upcomingEventsContainer .section-header > div:last-child');
        if (!header) return;

        const btn = document.createElement('button');
        btn.id = 'upcomingAdminBtn';
        btn.onclick = () => UpcomingEvents.openAdminModal();
        btn.style.cssText = 'font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px;border:none;cursor:pointer;background:rgba(139,92,246,0.12);color:rgba(139,92,246,0.9);text-transform:uppercase;letter-spacing:0.5px;';
        btn.textContent = '🛡️ Update Flyers';
        header.appendChild(btn);
    },

    destroy() {
        clearTimeout(this._staggerTimeout);
        clearInterval(this.state.classInterval);
        clearInterval(this.state.sessionInterval);
        this._staggerTimeout         = null;
        this.state.classInterval     = null;
        this.state.sessionInterval   = null;
        this.state.isInitialized     = false;
        console.log('✓ UpcomingEvents destroyed');
    },

    // ============================================================================
    // ADMIN MODAL
    // ============================================================================

    openAdminModal() {
        if (document.getElementById('eventsAdminModal')) return;
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
        document.getElementById('eventsAdminModal')?.remove();
        document.body.style.overflow = '';
    },

    _getAdminModalHTML() {
        const tabs = this.config.ADMIN_TABS;
        return `
        <div style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:24px;
                    max-width:560px;width:94%;max-height:90vh;overflow-y:auto;position:relative;
                    box-shadow:8px 8px 20px rgba(0,0,0,0.2);">
            <button onclick="UpcomingEvents.closeAdminModal()"
                    style="position:absolute;top:14px;right:16px;background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;
                        color:rgba(139,92,246,0.9);margin-bottom:16px;">🛡️ Update Flyers</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
                ${tabs.map((t, i) => `
                <button id="adminTab_${t.id}" onclick="UpcomingEvents._switchAdminTab('${t.id}')"
                        style="padding:9px;border-radius:10px;border:none;cursor:pointer;font-size:0.82rem;font-weight:600;
                               ${i === 0 ? 'background:rgba(139,92,246,0.85);color:#fff;' : 'background:rgba(139,92,246,0.1);color:rgba(139,92,246,0.9);'}">
                    ${t.label}
                </button>`).join('')}
            </div>
            <div id="adminTabContent"></div>
            <div style="display:flex;gap:10px;margin-top:20px;">
                <button onclick="UpcomingEvents._adminSave()"
                        style="flex:1;padding:11px;border-radius:12px;border:none;cursor:pointer;
                               font-size:0.92rem;font-weight:700;background:rgba(139,92,246,0.85);color:#fff;">
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
        this._readAdminFields(this._adminActiveTab);
        this._adminActiveTab = tab;
        this.config.ADMIN_TABS.forEach(({ id }) => {
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

        const draft    = this._adminDraft[tab];
        const { Sessions, Workshops } = this.config.FLYER_FILES;

        const flyerGrid = (folder, files) => files.map(f => {
            const url      = this._flyerBase + folder + '/' + f;
            const selected = draft.image === url;
            return `<div onclick="UpcomingEvents._selectFlyer('${tab}','${url}','${f}')"
                         style="cursor:pointer;border-radius:8px;overflow:hidden;
                                border:3px solid ${selected ? 'rgba(139,92,246,0.8)' : 'transparent'};
                                transition:border 0.15s;">
                        <img src="${url}" style="width:100%;height:90px;object-fit:cover;display:block;">
                        <div style="font-size:10px;text-align:center;padding:2px;color:var(--text-muted);">${f}</div>
                    </div>`;
        }).join('');

        const TAB_LABELS = { classes0:'Left Card - Flyer 1', classes1:'Left Card - Flyer 2', sessions0:'Right Card - Flyer 1', sessions1:'Right Card - Flyer 2' };
        const fieldStyle = `padding:9px;border-radius:10px;border:1px solid rgba(0,0,0,0.12);
                            font-size:0.88rem;background:var(--neuro-bg);color:var(--neuro-text);
                            width:100%;box-sizing:border-box;`;

        container.innerHTML = `
            <div style="font-size:0.78rem;font-weight:700;color:rgba(139,92,246,0.8);margin-bottom:12px;
                        text-transform:uppercase;letter-spacing:0.5px;">Editing: ${TAB_LABELS[tab]}</div>
            <div style="margin-bottom:14px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin-bottom:8px;">Sessions</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${flyerGrid('Sessions', Sessions)}</div>
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);margin:14px 0 8px;">Workshops</div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${flyerGrid('Workshops', Workshops)}</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;">
                <input id="adminField_title"    placeholder="Title"    value="${this.escapeHtml(draft.title||'')}"    style="${fieldStyle}">
                <input id="adminField_subtitle" placeholder="Subtitle" value="${this.escapeHtml(draft.subtitle||'')}" style="${fieldStyle}">
                <textarea id="adminField_info"  placeholder="Description" rows="3" style="${fieldStyle}resize:vertical;">${this.escapeHtml(draft.info||'')}</textarea>
                <input id="adminField_type"     placeholder="Type (e.g. 🎴 Online Zoom Class)"         value="${this.escapeHtml(draft.type||'')}"     style="${fieldStyle}">
                <input id="adminField_datetime" placeholder="Date & Time (e.g. Monday, 10:00 AM GMT+2)" value="${this.escapeHtml(draft.datetime||'')}" style="${fieldStyle}">
            </div>`;
    },

    _selectFlyer(tab, url, filename) {
        const meta = this.flyerCatalog[filename] || {};
        const d    = this._adminDraft[tab];
        this._adminDraft[tab] = {
            ...d,
            image:    url,
            title:    meta.title    || d.title,
            subtitle: meta.subtitle || d.subtitle,
            info:     meta.info     || d.info,
            type:     meta.type     || d.type,
        };
        this._renderAdminTab(tab);
    },

    _readAdminFields(tab) {
        if (!document.getElementById('adminField_title')) return;
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

        this._readAdminFields(this._adminActiveTab);

        try {
            const payload = {
                classes0:  this._adminDraft.classes0,
                classes1:  this._adminDraft.classes1,
                sessions0: this._adminDraft.sessions0,
                sessions1: this._adminDraft.sessions1,
            };
            const ok = await CommunityDB.saveAppSettings('upcoming_events', payload);
            if (!ok) throw new Error('saveAppSettings returned false');

            // Apply to live data
            ['classes0','classes1','sessions0','sessions1'].forEach(key => {
                const [type, idx] = [key.slice(0,-1), +key.slice(-1)];
                Object.assign(this[type][idx], this._adminDraft[key]);
            });

            // Re-render visible cards
            this.updateCard('classes',  this.state.classIndex);
            this.updateCard('sessions', this.state.sessionIndex);

            Core.showToast('✓ Flyers updated for all users');
            this.closeAdminModal();
        } catch (err) {
            console.error('_adminSave error:', err);
            Core.showToast('❌ Could not save - please try again');
            if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save & Publish'; }
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    openWhatsApp(url) {
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
    },

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
};

// ============================================================================
// AUTO-INITIALIZATION & GLOBAL EXPOSURE
// ============================================================================


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UpcomingEvents.render());
} else {
    UpcomingEvents.render();
}

// Window bridge: preserved for external callers
window.UpcomingEvents = UpcomingEvents;

export { UpcomingEvents };
