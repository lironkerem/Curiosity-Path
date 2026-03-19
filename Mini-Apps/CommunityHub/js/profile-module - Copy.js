/**
 * PROFILE MODULE
 * v3.1.0 - Full Supabase integration
 * - Avatar: shows Google/uploaded image from profiles.avatar_url
 * - Name: from profiles.name
 * - Karma / XP: from GamificationEngine (with profile fallback)
 * - Sessions / Gifts / Minutes: from profiles.*
 * - Badges: from GamificationEngine (earned badges)
 * - Birthday + Country: from profiles.birthday / profiles.country (editable)
 * - No auto-init: core.js calls init() after CommunityDB is ready
 */

import { Core } from './core.js';
import { CommunityDB } from './community-supabase.js';

const ProfileModule = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        currentView:   'public',
        isInitialized: false
    },

    config: {
        MAX_INSPIRATION_LENGTH: 200,
        PULSE_ANIMATION_DURATION: 600,

        LEVEL_TITLES: {
            1:'Seeker', 2:'Practitioner', 3:'Adept', 4:'Healer', 5:'Master',
            6:'Sage', 7:'Enlightened', 8:'Buddha', 9:'Light', 10:'Emptiness'
        },

        RARITY_COLORS: {
            common:'#9ca3af', uncommon:'#10b981', rare:'#3b82f6',
            epic:'#a855f7', legendary:'#f59e0b'
        },
        RARITY_LABELS: {
            common:'Common', uncommon:'Uncommon', rare:'Rare',
            epic:'Epic', legendary:'Legendary'
        },

        STATUS_RING: {
            online:    { color: 'var(--ring-available, #6b9b37)', label: 'Available'      },
            available: { color: 'var(--ring-available, #6b9b37)', label: 'Available'      },
            away:      { color: 'var(--ring-guiding,   #e53e3e)', label: 'Away'           },
            guiding:   { color: 'var(--ring-guiding,   #e53e3e)', label: 'Away'           },
            silent:    { color: 'var(--ring-silent,    #7c3aed)', label: 'In Silence'     },
            deep:      { color: 'var(--ring-deep,      #1e40af)', label: 'Deep Practice'  },
            offline:   { color: 'var(--ring-offline,   #9ca3af)', label: 'Offline'        },
        },

        STATUS_ACTIVITIES: {
            online:  '✨ Available',
            away:    '🌿 Away',
            silent:  '🤫 In Silence',
            deep:    '🧘 Deep Practice',
            offline: '💤 Offline',
        },

        // ISO-3166 alpha-2 code lookup (lowercase key → code)
        COUNTRY_CODES: {
            'israel':'IL','united states':'US','usa':'US','us':'US',
            'united kingdom':'GB','uk':'GB','canada':'CA','australia':'AU',
            'germany':'DE','france':'FR','spain':'ES','italy':'IT',
            'netherlands':'NL','belgium':'BE','switzerland':'CH','sweden':'SE',
            'norway':'NO','denmark':'DK','finland':'FI','poland':'PL',
            'portugal':'PT','austria':'AT','india':'IN','china':'CN',
            'japan':'JP','south korea':'KR','brazil':'BR','mexico':'MX',
            'argentina':'AR','south africa':'ZA','russia':'RU','ukraine':'UA',
            'greece':'GR','turkey':'TR','egypt':'EG','new zealand':'NZ',
            'ireland':'IE','singapore':'SG','thailand':'TH','indonesia':'ID',
            'malaysia':'MY','philippines':'PH',
        },
    },

    // ============================================================================
    // HELPERS
    // ============================================================================

    /** Returns Core.state.currentUser or null. */
    _user() {
        return Core?.state?.currentUser ?? null;
    },

    /** Escapes a string for safe HTML insertion. */
    _esc(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },

    _formatEntryDate(ts) {
        if (!ts) return '';
        try {
            return new Date(ts).toLocaleDateString(undefined, {
                weekday:'short', month:'short', day:'numeric', year:'numeric'
            });
        } catch { return String(ts); }
    },

    _countryFlag(countryName) {
        const code = this.config.COUNTRY_CODES[countryName.toLowerCase().trim()];
        if (!code) return '🌍';
        return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
    },

    formatMinutes(totalMinutes, el) {
        const n = (typeof totalMinutes === 'number' && totalMinutes >= 0) ? totalMinutes : 0;
        const hours = Math.floor(n / 60);
        const mins  = n % 60;
        const text  = hours === 0 ? `${mins} minutes`
                    : mins  === 0 ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
                    : `${hours}h ${mins}m`;
        if (el) el.textContent = text;
        return text;
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    init() {
        if (this.state.isInitialized) {
            console.warn('ProfileModule already initialized');
            return;
        }
        try {
            this.renderHTML();
            this.populateData();
            this.setupCharCounter();
            this.state.isInitialized = true;

        // Listen for status changes from User Tab
        window.addEventListener('statusChanged', (e) => {
            const { status } = e.detail || {};
            if (!status) return;
            const cu = this._user();
            if (cu) {
                cu.status = status;
                cu.community_status = status; // keep both fields in sync
            }
            this.updateStatusRing(status);
            const dot = document.getElementById('statusPickerDot');
            const lbl = document.getElementById('statusPickerLabel');
            const cfg = this.config.STATUS_RING[status] || this.config.STATUS_RING.offline;
            if (dot) dot.style.background = cfg.color;
            if (lbl) lbl.textContent = cfg.label;
        });

        } catch (error) {
            console.error('ProfileModule initialization failed:', error);
        }
    },

    // ============================================================================
    // HTML GENERATION
    // ============================================================================

    getHTML() {
        const statusOptions = [
            { status:'online',  label:'Available',     color:'var(--ring-available,#6b9b37)', icon:'🟢' },
            { status:'away',    label:'Away',           color:'var(--ring-guiding,#e53e3e)',   icon:'🔴' },
            { status:'silent',  label:'In Silence',     color:'var(--ring-silent,#7c3aed)',    icon:'🟣' },
            { status:'deep',    label:'Deep Practice',  color:'var(--ring-deep,#1e40af)',      icon:'🔵' },
            { status:'offline', label:'Offline',        color:'var(--ring-offline,#9ca3af)',   icon:'⚫' },
        ];

        const activityCards = [
            { type:'journal',   icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`, label:'Journal',          count:'entries'   },
            { type:'gratitude', icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg>`, label:'Gratitude',        count:'entries'   },
            { type:'energy',    icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`, label:'Energy',           count:'check-ins' },
            { type:'flip',      icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`, label:'Flip the Script',  count:'entries'   },
        ];

        const cardStyle = `background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:14px;
            cursor:pointer;text-align:center;
            box-shadow:4px 4px 10px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
            transition:transform 0.15s,box-shadow 0.15s;`;

        return `
        <!-- ── Profile Hero ───────────────────────────────────────── -->
        <header class="profile-hero" style="border-radius:20px 20px 0 0;overflow:hidden;">
            <div class="profile-container">
                <div class="profile-content">
                    <div class="profile-avatar-section">
                        <div class="profile-avatar-wrap" style="position:relative;width:fit-content;">
                            <div class="profile-avatar" id="profileAvatar" aria-label="Profile avatar">
                                <img id="profileAvatarImg" width="80" height="80" loading="lazy" decoding="async"
                                     style="display:none;width:100%;height:100%;object-fit:cover;border-radius:inherit;"
                                     alt="Profile photo">
                                <span id="profileAvatarFallback">?</span>
                            </div>
                            <div class="profile-status-ring" id="statusRing" aria-hidden="true"></div>
                            <button class="edit-avatar"
                                    onclick="ProfileModule.editProfile()"
                                    aria-label="Edit profile"
                                    style="position:absolute;bottom:2px;right:2px;
                                           width:26px;height:26px;border-radius:50%;border:none;
                                           background:var(--neuro-bg,#f0f0f3);
                                           box-shadow:2px 2px 6px rgba(0,0,0,0.15),-1px -1px 4px rgba(255,255,255,0.7);
                                           cursor:pointer;font-size:13px;
                                           display:flex;align-items:center;justify-content:center;
                                           transition:transform 0.15s;z-index:2;"
                                    onmouseover="this.style.transform='scale(1.15)'"
                                    onmouseout="this.style.transform='scale(1)'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></button>
                        </div>

                        <!-- Status picker -->
                        <div style="position:relative;">
                            <button id="statusPickerBtn"
                                    onclick="ProfileModule.toggleStatusPicker()"
                                    style="display:flex;align-items:center;gap:6px;
                                           padding:5px 12px;border-radius:99px;border:none;
                                           cursor:pointer;font-size:0.78rem;font-weight:600;
                                           background:var(--neuro-bg,#f0f0f3);color:var(--neuro-text);
                                           box-shadow:2px 2px 6px rgba(0,0,0,0.1),-1px -1px 4px rgba(255,255,255,0.7);
                                           transition:box-shadow 0.15s;">
                                <span id="statusPickerDot"
                                      style="width:9px;height:9px;border-radius:50%;
                                             background:var(--ring-available,#6b9b37);flex-shrink:0;"></span>
                                <span id="statusPickerLabel">Available</span>
                                <span style="opacity:0.5;font-size:10px;">▼</span>
                            </button>

                            <div id="statusPickerDropdown"
                                 style="display:none;position:absolute;top:calc(100% + 8px);left:50%;
                                        transform:translateX(-50%);
                                        background:var(--neuro-bg,#f0f0f3);border-radius:14px;padding:6px;
                                        box-shadow:6px 6px 16px rgba(0,0,0,0.15),-3px -3px 10px rgba(255,255,255,0.7);
                                        z-index:999;min-width:170px;">
                                ${statusOptions.map(s => `
                                <button onclick="ProfileModule.setStatus('${s.status}','${s.label}','${s.color}')"
                                        style="display:flex;align-items:center;gap:10px;width:100%;
                                               padding:8px 10px;border:none;border-radius:10px;
                                               background:none;cursor:pointer;font-size:0.82rem;
                                               color:var(--neuro-text);text-align:left;transition:background 0.15s;"
                                        onmouseover="this.style.background='rgba(0,0,0,0.05)'"
                                        onmouseout="this.style.background='none'">
                                    <span style="width:10px;height:10px;border-radius:50%;background:${s.color};flex-shrink:0;"></span>
                                    ${s.label}
                                </button>`).join('')}
                            </div>
                        </div>
                    </div>

                    <div class="profile-info">
                        <div class="profile-name-row">
                            <div class="profile-name" id="profileName">Loading...</div>
                        </div>

                        <!-- Role · Birthday · Country meta row -->
                        <div id="profileMetaRow"
                             style="display:inline-flex;align-items:center;gap:0;
                                    margin:0.4rem 0 0.75rem;
                                    background:var(--neuro-bg,#f0f0f3);
                                    border-radius:99px;
                                    box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.75);
                                    overflow:hidden;max-width:100%;">

                            <!-- Role -->
                            <div id="profileRoleBadge"
                                 style="display:flex;align-items:center;gap:5px;
                                        font-size:0.76rem;font-weight:700;
                                        color:var(--neuro-accent);
                                        padding:5px 12px;white-space:nowrap;">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Member
                            </div>

                            <!-- Separator -->
                            <span class="profile-meta-sep"
                                  style="width:1px;height:16px;
                                         background:rgba(0,0,0,0.1);
                                         flex-shrink:0;"></span>

                            <!-- Birthday -->
                            <span id="profileBirthdayDisplay"
                                  style="font-size:0.76rem;font-weight:600;
                                         color:var(--text-muted);
                                         padding:5px 12px;white-space:nowrap;"></span>

                            <!-- Country separator (hidden if no country) -->
                            <span id="profileCountrySep"
                                  style="width:1px;height:16px;
                                         background:rgba(0,0,0,0.1);
                                         flex-shrink:0;display:none;"></span>

                            <!-- Country -->
                            <span id="profileCountryDisplay"
                                  style="font-size:0.76rem;font-weight:600;
                                         color:var(--text-muted);
                                         padding:5px 12px;white-space:nowrap;"></span>
                        </div>

                        <div class="profile-inspiration">
                            <span id="profileInspiration">"Here to practice with intention."</span>
                            <button class="edit-inspiration-btn" onclick="ProfileModule.editInspiration()" aria-label="Edit inspiration"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                        </div>

                        <!-- ── Gamification Section ───────────────── -->
                        ${this._getGamificationHTML()}

                        <div class="view-toggle">
                            <button class="v-btn active" onclick="ProfileModule.toggleProfileView('public')" aria-pressed="true">Public View</button>
                            <button class="v-btn" onclick="ProfileModule.toggleProfileView('private')" aria-pressed="false">My Activity</button>
                        </div>

                        <div class="private-details" id="privateDetails">
                            <div id="myActivityGrid"
                                 style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:4px;">
                                ${activityCards.map(c => `
                                <div class="activity-card" onclick="ProfileModule.openActivityModal('${c.type}')" style="${cardStyle}">
                                    <div style="font-size:1.6rem;margin-bottom:6px;">${c.icon}</div>
                                    <div style="font-weight:700;font-size:0.88rem;color:var(--neuro-text);">${c.label}</div>
                                    <div id="activityCount_${c.type}"
                                         style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">- ${c.count}</div>
                                </div>`).join('')}
                            </div>
                        </div>

                        <!-- ── Divider line ───────────────────────── -->
                        <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.1),transparent);margin-top:1rem;"></div>

                        <!-- Activity Modal -->
                        <div id="activityModal"
                             style="display:none;position:fixed;inset:0;z-index:9999;
                                    background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                                    align-items:center;justify-content:center;
                                    opacity:0;transition:opacity 0.25s ease;">
                            <div id="activityModalInner"
                                 style="background:var(--neuro-bg,#f0f0f3);border-radius:20px;padding:1.5rem;
                                        max-width:480px;width:92%;max-height:80vh;
                                        position:relative;display:flex;flex-direction:column;
                                        box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                                        transform:translateY(16px);transition:transform 0.25s ease;">
                                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
                                    <div id="activityModalTitle" style="font-size:1.1rem;font-weight:700;color:var(--neuro-text);"></div>
                                    <button onclick="ProfileModule.closeActivityModal()"
                                            style="background:none;border:none;cursor:pointer;font-size:18px;opacity:0.5;">✕</button>
                                </div>
                                <div id="activityModalBody" style="overflow-y:auto;flex:1;padding-right:4px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>`;
    },

    /**
     * Builds the gamification progress section HTML.
     * Called by getHTML(); also callable standalone to re-render just this section.
     * @returns {string}
     */
    _getGamificationHTML() {
        const g         = window.app?.gamification;
        const status    = g?.getStatusSummary?.() ?? {
            xp:0, karma:0, badges:[], streak:{current:0},
            totalJournalEntries:0, totalHappinessViews:0,
            totalTarotSpreads:0, totalWellnessRuns:0
        };
        const levelInfo = g?.calculateLevel?.() ?? { level:1, title:'Seeker', progress:0, pointsToNext:100 };
        const appStats  = window.app?.state?.getStats?.() ?? {};
        const article   = levelInfo.title.match(/^[aeiou]/i) ? 'an' : 'a';
        const xpPct     = Math.min(100, Math.max(0, levelInfo.progress ?? 0));

        const statItems = [
            { value: status.karma,                 label:'Karma',    emoji:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`, id:'statKarma'    },
            { value: 0,                            label:'Blessings',emoji:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg>`, id:'statBlessings' },
            { value: '-',                          label:'Fav Room', emoji:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, id:'statFavRoom'   },
            { value: (status.badges || []).length, label:'Badges',   emoji:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`, id:'statBadges'   },
        ];

        return `
        <div class="profile-gamification-section"
             style="padding:1.25rem 1.5rem 1.75rem;background:var(--neuro-bg,#f0f0f3);
                    border-radius:20px;margin-bottom:0.75rem;
                    box-shadow:4px 4px 12px rgba(0,0,0,0.08),-2px -2px 8px rgba(255,255,255,0.7);">

            <!-- Level title + XP bar -->
            <div style="text-align:center;margin-bottom:0.75rem;">
                <div style="font-size:1.25rem;font-weight:700;color:var(--neuro-text);margin-bottom:0.5rem;">
                    <strong style="color:var(--neuro-accent);">${article.charAt(0).toUpperCase() + article.slice(1)} ${levelInfo.title}</strong>
                    - Level ${levelInfo.level}
                </div>
                <!-- XP progress bar -->
                <div style="height:10px;border-radius:99px;
                            background:rgba(0,0,0,0.07);
                            box-shadow:inset 1px 1px 4px rgba(0,0,0,0.1);
                            overflow:hidden;margin-bottom:0.4rem;">
                    <div id="profileGamificationXpBar"
                         class="profile-xp-bar-fill"
                         data-width="${xpPct}"
                         style="width:0%;height:100%;border-radius:99px;
                                background:linear-gradient(90deg,var(--neuro-accent),var(--neuro-accent,#a855f7));
                                transition:width 0.9s cubic-bezier(0.4,0,0.2,1);
                                position:relative;overflow:hidden;">
                        <div style="position:absolute;inset:0;
                                    background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.4) 50%,transparent 100%);
                                    animation:profile-xp-shimmer 2.4s infinite;"></div>
                    </div>
                </div>
                <div style="font-size:0.82rem;color:var(--text-muted);">
                    <span style="font-weight:800;font-size:1rem;color:var(--neuro-accent);" id="profileGamificationXP">${status.xp}</span> XP
                    <span style="margin:0 4px;opacity:0.4;">·</span>
                    <span id="profileGamificationXPNext">${levelInfo.pointsToNext}</span> to next level
                </div>
            </div>

            <!-- 8-stat grid -->
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
                ${statItems.map(item => `
                <div style="background:var(--neuro-bg,#f0f0f3);border-radius:14px;
                            padding:10px 6px;text-align:center;
                            box-shadow:3px 3px 8px rgba(0,0,0,0.09),-2px -2px 6px rgba(255,255,255,0.7);
                            transition:transform 0.15s;"
                     onmouseover="this.style.transform='translateY(-2px)'"
                     onmouseout="this.style.transform=''">
                    <div style="font-size:1.3rem;line-height:1;margin-bottom:4px;">${item.emoji}</div>
                    <div ${item.id ? `id="${item.id}"` : ''} style="font-size:1.15rem;font-weight:800;
                                color:var(--neuro-accent);line-height:1;">${item.value}</div>
                    <div style="font-size:0.65rem;color:var(--text-muted);
                                font-weight:600;text-transform:uppercase;
                                letter-spacing:0.03em;margin-top:3px;">${item.label}</div>
                </div>`).join('')}
            </div>
        </div>

        <style>
            @keyframes profile-xp-shimmer {
                0%   { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
        </style>`;
    },

    /**
     * Animates the XP progress bar after render.
     * Called automatically by init() via populateData().
     */
    animateGamificationBar() {
        requestAnimationFrame(() => {
            const bar = document.getElementById('profileGamificationXpBar');
            if (bar) bar.style.width = (bar.dataset.width || 0) + '%';
        });
    },

    /**
     * Re-renders only the gamification section (e.g. after XP/level change).
     * Replaces the .profile-gamification-section element in place.
     */
    refreshGamification() {
        const section = document.querySelector('.profile-gamification-section');
        if (!section) return;
        const temp = document.createElement('div');
        temp.innerHTML = this._getGamificationHTML();
        section.replaceWith(temp.firstElementChild);
        this.animateGamificationBar();
    },

    renderHTML() {
        const container = document.getElementById('profileHeroContainer');
        if (!container) {
            console.warn('profileHeroContainer not found - skipping profile render');
            return;
        }
        container.innerHTML = this.getHTML();
    },

    // ============================================================================
    // DATA POPULATION
    // ============================================================================

    populateData() {
        const user = this._user();
        if (!user) {
            console.warn('Core.state.currentUser not available');
            return;
        }
        try {
            this.updateAvatar(user);
            this.updateName(user);
            this.updateKarma(user);
            this.updateBio(user);
            this.updateStatusRing(user.status);
            this.updateRole(user);
            this.updateBadges();
            this.updateBirthday(user);
            this.updateCountry(user);
            this.updateProfileLocationRow(user);
            this.animateGamificationBar();
            this.loadActivityData().catch(() => {});
            this.loadCommunityStats().catch(() => {});
        } catch (error) {
            console.error('Profile data population error:', error);
        }
    },

    // ── Avatar ───────────────────────────────────────────────────────────────────

    updateAvatar(user) {
        const avatarWrap     = document.getElementById('profileAvatar');
        const avatarImg      = document.getElementById('profileAvatarImg');
        const avatarFallback = document.getElementById('profileAvatarFallback');
        if (!avatarWrap) return;

        const photoUrl = user.avatar_url || user.avatarUrl;
        if (photoUrl && avatarImg) {
            avatarImg.src = photoUrl;
            avatarImg.style.display = 'block';
            if (avatarFallback) avatarFallback.style.display = 'none';
            avatarWrap.style.background = 'transparent';
            return;
        }

        if (avatarFallback) {
            avatarFallback.textContent = user.emoji || user.avatar || '?';
            avatarFallback.style.display = 'block';
            if (avatarImg) avatarImg.style.display = 'none';
        }

        if (Core?.getAvatarGradient) {
            avatarWrap.style.background = Core.getAvatarGradient(user.id || user.name || 'default');
        }
    },

    // ── Name ─────────────────────────────────────────────────────────────────────

    updateName(user) {
        const el = document.getElementById('profileName');
        if (el) el.textContent = user.name || user.displayName || 'Member';
    },

    // ── Karma / XP / Level ───────────────────────────────────────────────────────

    updateKarma(user) {
        const g = CommunityDB?.getOwnGamificationState?.();

        const karma = g?.karma  ?? user.karma  ?? 0;
        const xp    = g?.xp     ?? user.xp     ?? 0;
        const level = g?.level  ?? user.level  ?? 1;

        // XP display + bar
        const xpEl   = document.getElementById('profileGamificationXP');
        const xpNext = document.getElementById('profileGamificationXPNext');
        const xpBar  = document.getElementById('profileGamificationXpBar');
        if (xpEl) xpEl.textContent = xp.toLocaleString();
        if (xpBar) {
            const ladder = [0,800,2000,4200,7000,12000,30000,60000,180000,450000];
            const cur    = ladder[level - 1] || 0;
            const next   = ladder[level]     || ladder[ladder.length - 1];
            const pct    = next > cur ? Math.min(100, Math.round(((xp - cur) / (next - cur)) * 100)) : 100;
            xpBar.dataset.width = pct;
            xpBar.style.width   = pct + '%';
            if (xpNext) xpNext.textContent = Math.max(0, next - xp).toLocaleString();
        }

        // Karma stat card
        const karmaEl = document.getElementById('statKarma');
        if (karmaEl) karmaEl.textContent = karma.toLocaleString();
    },

    // ── Community stats (blessings + fav room) ───────────────────────────────────

    async loadCommunityStats() {
        if (!CommunityDB?.ready) return;
        const userId = this._user()?.id;
        if (!userId) return;

        try {
            const [{ count: blessingCount, error: bErr }, { data: entries, error: rErr }] = await Promise.all([
                CommunityDB._sb
                    .from('room_blessings')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', userId),
                CommunityDB._sb
                    .from('room_entries')
                    .select('room_id')
                    .eq('user_id', userId),
            ]);

            const statBlessings = document.getElementById('statBlessings');
            if (statBlessings) {
                statBlessings.textContent = (!bErr && blessingCount != null)
                    ? blessingCount.toLocaleString() : '0';
            }

            const statFavRoom = document.getElementById('statFavRoom');
            if (statFavRoom) {
                if (!rErr && entries?.length > 0) {
                    const counts = {};
                    entries.forEach(e => { counts[e.room_id] = (counts[e.room_id] || 0) + 1; });
                    const favRoomId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                    statFavRoom.textContent = favRoomId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                } else {
                    statFavRoom.textContent = '-';
                }
            }
        } catch (e) {
            console.warn('[ProfileModule] loadCommunityStats error:', e);
        }
    },

    // ── Bio ──────────────────────────────────────────────────────────────────────

    updateBio(user) {
        const el   = document.getElementById('profileInspiration');
        const text = user.bio || user.inspiration;
        if (el && text) el.textContent = `"${text}"`;
    },

    // ── Role / Status ────────────────────────────────────────────────────────────

    updateRole(user) {
        const role   = user.community_role || user.role || 'Member';
        const status = user.status || 'available';

        const roleBadge = document.getElementById('profileRoleBadge');
        if (roleBadge) roleBadge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${role}`;

        const privateRole = document.getElementById('privateRole');
        if (privateRole) privateRole.textContent = role;

        const privateStatus = document.getElementById('privateStatus');
        if (privateStatus) privateStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    },

    // ── Birthday ─────────────────────────────────────────────────────────────────

    updateBirthday(user) {
        const el = document.getElementById('privateBirthday');
        if (!el) return;
        if (user.birthday) {
            try {
                el.textContent = new Date(user.birthday + 'T00:00:00')
                    .toLocaleDateString(undefined, { month:'long', day:'numeric', year:'numeric' });
            } catch { el.textContent = user.birthday; }
        } else {
            el.textContent = '-';
        }
    },

    // ── Country ──────────────────────────────────────────────────────────────────

    updateCountry(user) {
        const el = document.getElementById('privateCountry');
        if (el) el.textContent = user.country || '-';
    },

    async updateProfileLocationRow(user) {
        let { birthday, country } = user;

        if (!birthday && !country && CommunityDB?.ready) {
            try {
                const profile = await CommunityDB.getMyProfile();
                if (profile) {
                    birthday = profile.birthday;
                    country  = profile.country;
                    const cu = this._user();
                    if (cu) { cu.birthday = birthday; cu.country = country; }
                }
            } catch { /* silent */ }
        }

        const birthdayEl = document.getElementById('profileBirthdayDisplay');
        if (birthdayEl) {
            if (birthday) {
                try {
                    const formatted = new Date(birthday + 'T00:00:00')
                        .toLocaleDateString(undefined, { month:'long', day:'numeric' });
                    birthdayEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${formatted}`;
                } catch { birthdayEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2 1 2 1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg> ${birthday}`; }
            } else {
                birthdayEl.textContent = '';
            }
        }

        const countryEl = document.getElementById('profileCountryDisplay');
        if (countryEl) {
            countryEl.textContent = country ? `${this._countryFlag(country)} ${country}` : '';
        }

        // Show/hide country separator
        const countrySep = document.getElementById('profileCountrySep');
        if (countrySep) countrySep.style.display = country ? '' : 'none';

        // Hide the main separator if both birthday and country are empty
        const sep = document.querySelector('#profileMetaRow .profile-meta-sep');
        if (sep) sep.style.display = (birthday || country) ? '' : 'none';
    },

    // ============================================================================
    // MY ACTIVITY - data loading + modals
    // ============================================================================

    async loadActivityData() {
        if (window.app?.state?.ready) {
            try { await window.app.state.ready; } catch { /* ignore */ }
        }

        let data = null;
        const appData = window.app?.state?.data;

        if (appData) {
            data = {
                journalEntries:   appData.journalEntries   || [],
                energyEntries:    appData.energyEntries    || [],
                gratitudeEntries: appData.gratitudeEntries || [],
                flipEntries:      appData.flipEntries      || [],
            };
        }

        // Fallback: fetch from DB if all arrays empty
        if (!data || Object.values(data).every(arr => arr.length === 0)) {
            try {
                if (CommunityDB?.ready) {
                    const payload = await CommunityDB.getOwnFullProgress();
                    if (payload) {
                        data = {
                            journalEntries:   payload.journalEntries   || [],
                            energyEntries:    payload.energyEntries    || [],
                            gratitudeEntries: payload.gratitudeEntries || [],
                            flipEntries:      payload.flipEntries      || [],
                        };
                    }
                }
            } catch (e) {
                console.warn('[ProfileModule] loadActivityData fallback failed:', e);
            }
        }

        if (!data) return;
        this._activityData = data;

        this._setActivityCount('journal',   data.journalEntries.length,   'entries');
        this._setActivityCount('gratitude', data.gratitudeEntries.length, 'entries');
        this._setActivityCount('energy',    data.energyEntries.length,    'check-ins');
        this._setActivityCount('flip',      data.flipEntries.length,      'entries');
    },

    _setActivityCount(type, count, label) {
        const el = document.getElementById(`activityCount_${type}`);
        if (el) el.textContent = count > 0 ? `${count} ${label}` : `No ${label} yet`;
    },

    async openActivityModal(type) {
        if (!this._activityData) await this.loadActivityData();

        const MODAL_CONFIG = {
            journal:   { title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> Journal Entries`   },
            gratitude: { title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg> Gratitude Entries` },
            energy:    { title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy Check-ins`   },
            flip:      { title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> Flip the Script`   },
        };

        const cfg     = MODAL_CONFIG[type];
        const entries = this._activityData?.[`${type}Entries`] || [];

        const titleEl = document.getElementById('activityModalTitle');
        const bodyEl  = document.getElementById('activityModalBody');
        if (titleEl) titleEl.textContent = cfg.title;
        if (bodyEl)  bodyEl.innerHTML = entries.length
            ? entries.map(e => this._renderActivityEntry(type, e)).join('')
            : `<div style="text-align:center;color:var(--text-muted);padding:2rem;">No entries yet</div>`;

        const modal = document.getElementById('activityModal');
        const inner = document.getElementById('activityModalInner');
        if (!modal) return;

        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity    = '1';
            inner.style.transform  = 'translateY(0)';
        });

        modal.onclick = (e) => { if (e.target === modal) this.closeActivityModal(); };
        this._activityEscHandler = (e) => { if (e.key === 'Escape') this.closeActivityModal(); };
        document.addEventListener('keydown', this._activityEscHandler);
    },

    closeActivityModal() {
        const modal = document.getElementById('activityModal');
        const inner = document.getElementById('activityModalInner');
        if (!modal) return;
        modal.style.opacity   = '0';
        inner.style.transform = 'translateY(16px)';
        setTimeout(() => { modal.style.display = 'none'; }, 250);
        if (this._activityEscHandler) {
            document.removeEventListener('keydown', this._activityEscHandler);
            this._activityEscHandler = null;
        }
    },

    _renderActivityEntry(type, entry) {
        const date = this._formatEntryDate(entry.timestamp || entry.date);
        const base = `border-radius:12px;padding:12px 14px;margin-bottom:10px;
                      background:var(--surface,rgba(0,0,0,0.03));
                      border-left:3px solid var(--neuro-accent);
                      font-size:0.86rem;line-height:1.6;`;

        switch (type) {
            case 'journal': {
                const text = entry.situation || entry.feelings || '';
                const mood = entry.mood ? `<span style="margin-left:6px;opacity:0.7;">${entry.mood}</span>` : '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}${mood}</div>
                    <div style="color:var(--neuro-text);">${this._esc(text)}</div>
                </div>`;
            }
            case 'gratitude': {
                const items = entry.entries || [];
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">${date}</div>
                    ${items.map(g => `<div style="margin-bottom:3px;display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg> ${this._esc(g)}</div>`).join('')}
                </div>`;
            }
            case 'energy': {
                const level = entry.energy ?? '-';
                const notes = entry.notes ? `<div style="margin-top:4px;opacity:0.8;">${this._esc(entry.notes)}</div>` : '';
                const tags  = (entry.moodTags || []).length
                    ? `<div style="margin-top:5px;display:flex;flex-wrap:wrap;gap:4px;">
                        ${entry.moodTags.map(t => `<span style="background:var(--neuro-accent-a10);color:var(--neuro-accent);border-radius:99px;padding:2px 8px;font-size:0.72rem;">${this._esc(t)}</span>`).join('')}
                       </div>` : '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}</div>
                    <div style="font-size:1rem;font-weight:700;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg> Energy: ${level}/10</div>
                    ${tags}${notes}
                </div>`;
            }
            case 'flip': {
                const text    = entry.situation || entry.original || entry.text || entry.content || '';
                const reframe = entry.reframe   || entry.flipped  || '';
                return `<div style="${base}">
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">${date}</div>
                    ${text    ? `<div style="color:var(--neuro-text);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> ${this._esc(text)}</div>` : ''}
                    ${reframe ? `<div style="margin-top:6px;color:var(--neuro-accent);display:flex;align-items:center;gap:0.3rem;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2 19 5"/><path d="m3 21 9-9"/><path d="M12.2 6.2 11 5"/></svg> ${this._esc(reframe)}</div>` : ''}
                </div>`;
            }
            default: return '';
        }
    },

    // ── Badges ───────────────────────────────────────────────────────────────────

    updateBadges() {
        const earned = window.app?.gamification?.state?.badges ?? [];
        const countEl = document.getElementById('statBadges');
        if (countEl) countEl.textContent = earned.length;
    },

    // ── Status Ring ──────────────────────────────────────────────────────────────

    updateStatusRing(status) {
        const cfg  = this.config.STATUS_RING[status] || this.config.STATUS_RING.offline;
        const ring = document.getElementById('statusRing');
        if (ring) {
            ring.style.borderColor = cfg.color;
            ring.style.boxShadow   = `0 0 0 4px ${cfg.color}33`;
        }
        const dot = document.getElementById('statusPickerDot');
        const lbl = document.getElementById('statusPickerLabel');
        if (dot) dot.style.background = cfg.color;
        if (lbl) lbl.textContent = cfg.label;
    },

    toggleStatusPicker() {
        const dropdown = document.getElementById('statusPickerDropdown');
        if (!dropdown) return;
        const isOpen = dropdown.style.display !== 'none';
        dropdown.style.display = isOpen ? 'none' : 'block';

        if (!isOpen) {
            const close = (e) => {
                if (!document.getElementById('statusPickerBtn')?.contains(e.target) &&
                    !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                    document.removeEventListener('click', close);
                }
            };
            setTimeout(() => document.addEventListener('click', close), 0);
        }
    },

    async setStatus(status, label, color) {
        const dropdown = document.getElementById('statusPickerDropdown');
        if (dropdown) dropdown.style.display = 'none';

        // Optimistic instant update: update own dot in Active Members grid immediately
        const uid = this._user()?.id;
        if (uid && window.ActiveMembers) {
            window.ActiveMembers.updateMemberStatus(uid, status);
        }

        const activity = this.config.STATUS_ACTIVITIES[status] || '✨ Available';

        this.updateStatusRing(status);
        const dot = document.getElementById('statusPickerDot');
        const lbl = document.getElementById('statusPickerLabel');
        if (dot) dot.style.background = color;
        if (lbl) lbl.textContent = label;

        const cu = this._user();
        if (cu) {
            cu.status = status;
            cu.community_status = status; // keep both fields in sync
        }

        try {
            const roomId = Core?.state?.currentRoom || null;
            await Promise.all([
                CommunityDB.setPresence(status, activity, roomId),
                CommunityDB.updateProfile({ community_status: status }),
            ]);
            Core.showToast(`Status set to ${label}`);
        } catch (err) {
            console.error('[ProfileModule] setStatus error:', err);
            Core.showToast('Could not update status - please try again');
        }

        // Notify User Tab ring
        window.dispatchEvent(new CustomEvent('statusChanged', { detail: { status } }));
    },

    updatePresenceCount() {
        Core?.updatePresenceCount?.();
    },

    // ============================================================================
    // VIEW TOGGLE
    // ============================================================================

    toggleProfileView(view) {
        if (view !== 'public' && view !== 'private') return;
        document.querySelectorAll('.v-btn').forEach(btn => {
            const isPublic  = btn.textContent.trim() === 'Public View';
            const isActive  = (view === 'public' && isPublic) || (view === 'private' && !isPublic);
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });
        document.getElementById('privateDetails')?.classList.toggle('visible', view === 'private');
        this.state.currentView = view;
    },

    // ============================================================================
    // PULSE
    // ============================================================================

    async sendPulse() {
        const state = Core?.state;
        if (!state) { console.error('Core not available'); return; }
        if (state.pulseSent) { Core.showToast('Already offered'); return; }

        const btn = document.getElementById('pulseBtn');
        if (!btn) return;

        try {
            btn.classList.add('sending');
            setTimeout(async () => {
                btn.classList.remove('sending');
                btn.classList.add('sent');
                btn.innerHTML = '✓<span class="pulse-ripple"></span>';
                state.pulseSent = true;

                const pulseFill = document.getElementById('pulseFill');
                if (pulseFill) pulseFill.style.width = '50%';

                Core.showToast('Calm offered to the community');
                await CommunityDB.setPresence('online', '💗 Offering calm', state.currentRoom || null);
                const cu = this._user();
                if (cu) cu.activity = '💗 Offering calm';
            }, this.config.PULSE_ANIMATION_DURATION);
        } catch (error) {
            console.error('Error sending pulse:', error);
        }
    },

    // ============================================================================
    // EDITING
    // ============================================================================

    editProfile() {
        let input = document.getElementById('_avatarFileInput');
        if (!input) {
            input = document.createElement('input');
            input.id      = '_avatarFileInput';
            input.type    = 'file';
            input.accept  = 'image/jpeg,image/png,image/webp,image/gif';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.addEventListener('change', () => {
                const file = input.files?.[0];
                if (file) this._uploadAvatar(file);
                input.value = '';
            });
        }
        input.click();
    },

    async _uploadAvatar(file) {
        if (file.size > 5 * 1024 * 1024) {
            Core.showToast('Image too large - max 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img      = document.getElementById('profileAvatarImg');
            const fallback = document.getElementById('profileAvatarFallback');
            const wrap     = document.getElementById('profileAvatar');
            if (img)      { img.src = e.target.result; img.style.display = 'block'; }
            if (fallback)  fallback.style.display = 'none';
            if (wrap)      wrap.style.background  = 'transparent';
        };
        reader.readAsDataURL(file);

        Core.showToast('Uploading photo...');
        const url = await CommunityDB.uploadAvatar(file);
        if (url) {
            const cu = this._user();
            if (cu) cu.avatar_url = url;
            Core.showToast('Profile photo updated');
        } else {
            Core.showToast('Upload failed - please try again');
            this.updateAvatar(this._user());
        }
    },

    async editRole() {
        const current = this._user()?.role || '';
        const newVal  = prompt('Enter your community role (e.g. Meditator, Healer, Teacher):', current);
        if (newVal === null) return;

        const trimmed = newVal.trim().substring(0, 60);
        const ok = await CommunityDB.updateProfile({ community_role: trimmed || null });
        if (!ok) { Core.showToast('Could not save - please try again'); return; }

        const cu = this._user();
        if (cu) { cu.community_role = trimmed || 'Member'; cu.role = trimmed || 'Member'; }
        this.updateRole(this._user());
        Core.showToast('Role updated');
    },

    async editInspiration() {
        const el = document.getElementById('profileInspiration');
        if (!el) return;
        const current  = el.textContent.replace(/"/g, '').trim();
        const newText  = prompt('Edit your inspiration message:', current);
        if (!newText?.trim()) return;

        const sanitized = newText.trim().substring(0, this.config.MAX_INSPIRATION_LENGTH).replace(/<[^>]*>/g, '');
        if (!sanitized) return;

        const ok = await CommunityDB.updateProfile({ inspiration: sanitized });
        if (!ok) { Core.showToast('Could not save - please try again'); return; }

        el.textContent = `"${sanitized}"`;
        const cu = this._user();
        if (cu) cu.inspiration = sanitized;
        Core.showToast('Inspiration updated');
    },

    /**
     * Shared inline editor for birthday and country fields.
     * @param {object} opts
     * @param {string} opts.fieldId        - ID of the display element
     * @param {string} opts.dbKey          - Key to pass to CommunityDB.updateProfile
     * @param {string} opts.currentValue   - Pre-filled value
     * @param {string} opts.inputType      - 'date' | 'text'
     * @param {string} opts.placeholder    - Input placeholder
     * @param {number} opts.maxLength      - Max character length
     * @param {string} opts.successToast   - Toast text on success
     * @param {Function} opts.validate     - Optional (value) => string|null validator
     * @param {Function} opts.onSave       - Called with (trimmed) after successful save
     */
    async _createInlineEditor({ fieldId, dbKey, currentValue, inputType, placeholder, maxLength, successToast, validate, onSave }) {
        const valEl  = document.getElementById(fieldId);
        const row    = valEl?.closest('.detail-row');
        if (!row || row.querySelector('input')) return; // already editing

        const editBtn = row.querySelector('.edit-inline-btn');
        if (valEl)   valEl.style.display   = 'none';
        if (editBtn) editBtn.style.display = 'none';

        const sharedInputStyle = `flex:1;padding:4px 8px;border-radius:8px;
            border:1px solid rgba(0,0,0,0.15);font-size:0.85rem;
            background:var(--neuro-bg);color:var(--neuro-text);`;
        const sharedSaveStyle  = `margin-left:6px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;font-weight:700;
            background:var(--neuro-accent);color:#fff;`;
        const sharedCancelStyle = `margin-left:4px;padding:4px 8px;border-radius:8px;border:none;
            cursor:pointer;font-size:0.85rem;opacity:0.6;
            background:rgba(0,0,0,0.06);color:var(--neuro-text);`;

        const input     = document.createElement('input');
        input.type      = inputType;
        input.value     = currentValue;
        input.maxLength = maxLength;
        input.placeholder = placeholder;
        input.style.cssText = sharedInputStyle;

        const saveBtn   = document.createElement('button');
        saveBtn.textContent = '✓';
        saveBtn.style.cssText = sharedSaveStyle;

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '✕';
        cancelBtn.style.cssText = sharedCancelStyle;

        const cancel = () => {
            input.remove(); saveBtn.remove(); cancelBtn.remove();
            if (valEl)   valEl.style.display   = '';
            if (editBtn) editBtn.style.display = '';
        };

        const save = async () => {
            const trimmed = input.value.trim().substring(0, maxLength);
            if (validate) {
                const err = validate(trimmed);
                if (err) { Core.showToast(err); return; }
            }
            saveBtn.disabled = true;
            saveBtn.textContent = '...';
            const ok = await CommunityDB.updateProfile({ [dbKey]: trimmed || null });
            if (!ok) {
                Core.showToast('Could not save - please try again');
                saveBtn.disabled = false;
                saveBtn.textContent = '✓';
                return;
            }
            cancel();
            onSave(trimmed || null);
            Core.showToast(successToast);
        };

        saveBtn.onclick   = save;
        cancelBtn.onclick = cancel;
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') cancel();
        });

        row.appendChild(input);
        row.appendChild(saveBtn);
        row.appendChild(cancelBtn);
        input.focus();
    },

    editBirthday() {
        const valEl = document.getElementById('profileBirthdayDisplay');
        if (!valEl) return;

        const current = this._user()?.birthday || '';
        const input   = document.createElement('input');
        input.type    = 'date';
        input.value   = current;
        input.style.cssText = `padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);`;

        const save = async () => {
            const val = input.value.trim();
            if (val && !/^\d{4}-\d{2}-\d{2}$/.test(val)) { Core.showToast('Invalid date'); return; }
            const ok = await CommunityDB.updateProfile({ birthday: val || null });
            if (!ok) { Core.showToast('Could not save - please try again'); return; }
            const cu = this._user();
            if (cu) cu.birthday = val;
            input.replaceWith(valEl);
            valEl.style.display = '';
            this.updateBirthday(this._user());
            this.updateProfileLocationRow(this._user());
            Core.showToast('Birthday updated');
        };

        input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { input.replaceWith(valEl); valEl.style.display = ''; } });
        input.addEventListener('blur', save);
        valEl.style.display = 'none';
        valEl.parentNode.insertBefore(input, valEl.nextSibling);
        input.focus();
    },

    editCountry() {
        const valEl = document.getElementById('profileCountryDisplay');
        if (!valEl) return;

        const current = this._user()?.country || '';
        const input   = document.createElement('input');
        input.type    = 'text';
        input.value   = current;
        input.placeholder = 'Your country';
        input.maxLength   = 60;
        input.style.cssText = `padding:3px 8px;border-radius:8px;border:1px solid rgba(0,0,0,0.15);
            font-size:0.8rem;background:var(--neuro-bg);color:var(--neuro-text);width:90px;`;

        const save = async () => {
            const val = input.value.trim();
            const ok  = await CommunityDB.updateProfile({ country: val || null });
            if (!ok) { Core.showToast('Could not save - please try again'); return; }
            const cu = this._user();
            if (cu) cu.country = val;
            input.replaceWith(valEl);
            valEl.style.display = '';
            this.updateCountry(this._user());
            this.updateProfileLocationRow(this._user());
            Core.showToast('Country updated');
        };

        input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { input.replaceWith(valEl); valEl.style.display = ''; } });
        input.addEventListener('blur', save);
        valEl.style.display = 'none';
        valEl.parentNode.insertBefore(input, valEl.nextSibling);
        input.focus();
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    setupCharCounter() {
        const input   = document.getElementById('reflectionInput');
        const counter = document.getElementById('charCount');
        if (input && counter) {
            input.addEventListener('input', () => { counter.textContent = input.value.length; });
        }
    },

    refresh() {
        this.populateData();
    },
};

// core.js calls ProfileModule.init() after CommunityDB is ready - no self-init here.

// Window bridge: preserved for external callers
window.ProfileModule = ProfileModule;

export { ProfileModule };
