/**
 * MEMBER PROFILE MODAL
 * Shows a read-only profile for any community member.
 * Opens as a modal overlay when clicking a member card.
 *
 * Features:
 * - Avatar (photo or emoji/initial with gradient)
 * - Name, role, inspiration
 * - Stats: sessions, gifts, karma
 * - Actions: Whisper, Report, Block
 *
 * @version 1.0.0
 */

const MemberProfileModal = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        isOpen:            false,
        currentUserId:     null,
        reportStep:        null,   // null | 'reason' | 'details'
        isAppreciated:     false,
        appreciationCount: 0
    },

    // ============================================================================
    // INIT — inject modal shell into DOM once
    // ============================================================================

    init() {
        if (document.getElementById('memberProfileModal')) return;

        const shell = document.createElement('div');
        shell.innerHTML = `
            <div id="memberProfileModal"
                 class="modal-overlay"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="memberModalName"
                 style="display:none;position:fixed;inset:0;z-index:9999;
                        background:rgba(0,0,0,0.55);backdrop-filter:blur(4px);
                        display:flex;align-items:center;justify-content:center;
                        opacity:0;transition:opacity 0.25s ease;">
                <div id="memberProfileModalInner"
                     style="background:var(--neuro-bg,#f0f0f3);
                            border-radius:20px;
                            padding:2rem;
                            max-width:380px;
                            width:90%;
                            position:relative;
                            box-shadow:8px 8px 20px rgba(0,0,0,0.15),-4px -4px 12px rgba(255,255,255,0.7);
                            transform:translateY(16px);
                            transition:transform 0.25s ease;">

                    <!-- Close button -->
                    <button onclick="MemberProfileModal.close()"
                            aria-label="Close"
                            style="position:absolute;top:14px;right:16px;
                                   background:none;border:none;cursor:pointer;
                                   font-size:18px;opacity:0.5;line-height:1;">✕</button>

                    <!-- Loading state -->
                    <div id="memberModalLoading" style="text-align:center;padding:2rem;color:var(--text-muted);">
                        Loading...
                    </div>

                    <!-- Profile content (hidden until loaded) -->
                    <div id="memberModalContent" style="display:none;">

                        <!-- Avatar + status ring + name -->
                        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:1.2rem;">
                            <div style="position:relative;width:90px;height:90px;">
                                <div id="memberModalAvatar"
                                     style="width:90px;height:90px;border-radius:50%;
                                            display:flex;align-items:center;justify-content:center;
                                            font-size:2.2rem;overflow:hidden;flex-shrink:0;">
                                </div>
                                <div id="memberModalStatusRing"
                                     style="position:absolute;top:-7px;left:-7px;
                                            width:calc(100% + 14px);height:calc(100% + 14px);
                                            border-radius:50%;border:4px solid var(--ring-available,#6b9b37);
                                            box-shadow:0 0 0 3px rgba(107,155,55,0.2);
                                            pointer-events:none;"></div>
                            </div>
                            <div style="text-align:center;">
                                <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
                                    <div id="memberModalName"
                                         style="font-size:1.2rem;font-weight:700;color:var(--neuro-text);"></div>
                                    <div id="memberModalRole"
                                         style="font-size:0.75rem;font-weight:600;
                                                color:var(--primary,#667eea);
                                                background:rgba(102,126,234,0.1);
                                                border-radius:99px;padding:2px 9px;
                                                white-space:nowrap;"></div>
                                </div>
                                <div id="memberModalLocation"
                                     style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;
                                            font-size:0.78rem;color:var(--text-muted);margin-top:5px;">
                                </div>
                            </div>
                        </div>

                        <!-- Inspiration -->
                        <div id="memberModalInspiration"
                             style="font-size:0.85rem;font-style:italic;
                                    color:var(--neuro-text-light,#555);
                                    text-align:center;margin-bottom:0.8rem;
                                    padding:0 0.5rem;line-height:1.5;">
                        </div>

                        <!-- Level badge — prominent -->
                        <div style="text-align:center;margin-bottom:0.8rem;">
                            <span id="memberModalLevel"
                                  style="font-size:0.92rem;font-weight:700;
                                         color:var(--primary,#667eea);
                                         background:rgba(102,126,234,0.12);
                                         border-radius:99px;padding:4px 14px;"></span>
                        </div>

                        <!-- Stats: XP, Karma, Streak -->
                        <div style="display:flex;justify-content:space-around;
                                    margin-bottom:0.8rem;padding:0.8rem 0.5rem;
                                    border-radius:12px;
                                    background:var(--neuro-shadow-light,rgba(0,0,0,0.04));">
                            <div style="text-align:center;">
                                <div id="memberModalXP"
                                     style="font-size:1.2rem;font-weight:700;color:var(--primary,#667eea);">—</div>
                                <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">XP</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="memberModalKarma"
                                     style="font-size:1.2rem;font-weight:700;color:var(--primary,#667eea);">—</div>
                                <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">Karma</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="memberModalStreak"
                                     style="font-size:1.2rem;font-weight:700;color:var(--primary,#667eea);">—</div>
                                <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;">🔥 Streak</div>
                            </div>
                        </div>

                        <!-- Activity counts -->
                        <div id="memberModalActivity"
                             style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;
                                    font-size:0.76rem;color:var(--text-muted);
                                    margin-bottom:0.8rem;min-height:1.2rem;">
                        </div>

                        <!-- Badges -->
                        <div id="memberModalBadges"
                             style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;
                                    margin-bottom:1rem;min-height:1.5rem;">
                        </div>

                        <!-- Appreciate button (full width, above other actions) -->
                        <button id="memberModalAppreciateBtn"
                                onclick="MemberProfileModal.toggleAppreciate()"
                                style="width:100%;padding:10px;border-radius:12px;border:none;
                                       cursor:pointer;font-size:0.9rem;font-weight:600;
                                       margin-bottom:10px;
                                       background:var(--neuro-bg,#f0f0f3);
                                       color:var(--neuro-text);
                                       box-shadow:3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7);
                                       transition:all 0.2s;">
                            🙏 Appreciate
                        </button>

                        <!-- Action buttons -->
                        <div style="display:flex;gap:10px;margin-bottom:1rem;">
                            <button id="memberModalWhisperBtn"
                                    onclick="MemberProfileModal.startWhisper()"
                                    style="flex:1;padding:10px;border-radius:12px;border:none;
                                           cursor:pointer;font-size:0.9rem;font-weight:600;
                                           background:var(--primary,#667eea);color:#fff;">
                                💬 Whisper
                            </button>
                            <button onclick="MemberProfileModal.startReport()"
                                    style="padding:10px 14px;border-radius:12px;border:none;
                                           cursor:pointer;font-size:0.9rem;
                                           background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                           color:var(--neuro-text);">
                                🚩 Report
                            </button>
                            <button onclick="MemberProfileModal.startBlock()"
                                    style="padding:10px 14px;border-radius:12px;border:none;
                                           cursor:pointer;font-size:0.9rem;
                                           background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                           color:var(--neuro-text);">
                                🚫 Block
                            </button>
                        </div>

                        <!-- Whisper input (hidden by default) -->
                        <div id="memberModalWhisperPanel" style="display:none;margin-top:0.5rem;">
                            <textarea id="memberModalWhisperText"
                                      placeholder="Write a private message..."
                                      maxlength="500"
                                      rows="3"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);
                                             font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);
                                             color:var(--neuro-text);
                                             box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.sendWhisper()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;
                                               cursor:pointer;font-size:0.88rem;font-weight:600;
                                               background:var(--primary,#667eea);color:#fff;">
                                    Send
                                </button>
                                <button onclick="MemberProfileModal.cancelWhisper()"
                                        style="padding:8px 14px;border-radius:10px;border:none;
                                               cursor:pointer;font-size:0.88rem;
                                               background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <!-- Report panel (hidden by default) -->
                        <div id="memberModalReportPanel" style="display:none;margin-top:0.5rem;">
                            <select id="memberModalReportReason"
                                    style="width:100%;padding:10px;border-radius:10px;
                                           border:1px solid rgba(0,0,0,0.12);
                                           font-size:0.88rem;margin-bottom:8px;
                                           background:var(--neuro-bg);color:var(--neuro-text);">
                                <option value="">Select a reason...</option>
                                <option value="harassment">Harassment</option>
                                <option value="spam">Spam</option>
                                <option value="inappropriate">Inappropriate content</option>
                                <option value="hate">Hate speech</option>
                                <option value="other">Other</option>
                            </select>
                            <textarea id="memberModalReportDetails"
                                      placeholder="Additional details (optional)"
                                      maxlength="300"
                                      rows="2"
                                      style="width:100%;padding:10px;border-radius:10px;
                                             border:1px solid rgba(0,0,0,0.12);
                                             font-size:0.88rem;resize:none;
                                             background:var(--neuro-bg);color:var(--neuro-text);
                                             box-sizing:border-box;"></textarea>
                            <div style="display:flex;gap:8px;margin-top:8px;">
                                <button onclick="MemberProfileModal.submitReport()"
                                        style="flex:1;padding:8px;border-radius:10px;border:none;
                                               cursor:pointer;font-size:0.88rem;font-weight:600;
                                               background:#ef4444;color:#fff;">
                                    Submit Report
                                </button>
                                <button onclick="MemberProfileModal.cancelReport()"
                                        style="padding:8px 14px;border-radius:10px;border:none;
                                               cursor:pointer;font-size:0.88rem;
                                               background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                               color:var(--neuro-text);">
                                    Cancel
                                </button>
                            </div>
                        </div>

                    </div><!-- /memberModalContent -->
                </div><!-- /inner -->
            </div><!-- /modal -->`;

        document.body.appendChild(shell.firstElementChild);

        // Close on backdrop click
        document.getElementById('memberProfileModal').addEventListener('click', (e) => {
            if (e.target.id === 'memberProfileModal') this.close();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) this.close();
        });
    },

    // ============================================================================
    // OPEN / CLOSE
    // ============================================================================

    async open(userId) {
        this.init();

        if (!userId) return;

        const isSelf = userId === window.CommunityDB?.userId;
        this.state.currentUserId = userId;
        this.state.isOpen = true;

        const modal = document.getElementById('memberProfileModal');
        const inner = document.getElementById('memberProfileModalInner');
        const loading = document.getElementById('memberModalLoading');
        const content = document.getElementById('memberModalContent');

        // Reset panels
        this._hideActionPanels();
        loading.style.display = 'block';
        content.style.display = 'none';

        // Show modal with animation
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            inner.style.transform = 'translateY(0)';
        });

        document.body.style.overflow = 'hidden';

        // Fetch profile
        try {
            const profile = await CommunityDB.getProfile(userId);
            if (!profile) {
                Core.showToast('Could not load member profile');
                this.close();
                return;
            }
            this._populate(profile);

            // Hide all action buttons for own profile
            const actionsRow = document.querySelector('#memberModalWhisperBtn')?.closest('div[style*="display:flex"]');
            if (actionsRow) actionsRow.style.display = isSelf ? 'none' : 'flex';
            const appreciateBtn = document.getElementById('memberModalAppreciateBtn');
            if (appreciateBtn) appreciateBtn.style.display = isSelf ? 'none' : 'block';

            // Load appreciate state for this user
            if (!isSelf) {
                this.state.isAppreciated = false;
                this.state.appreciationCount = 0;
                this._updateAppreciateBtn();
                Promise.all([
                    CommunityDB.getMyUserAppreciations(),
                    CommunityDB.getUserAppreciationCount(userId)
                ]).then(([set, count]) => {
                    this.state.isAppreciated = set.has(userId);
                    this.state.appreciationCount = count;
                    this._updateAppreciateBtn();
                }).catch(() => {});
            }

            // Fetch gamification data in parallel (non-blocking)
            CommunityDB.getUserProgress(userId).then(g => {
                if (g) this._populateGamification(g);
            }).catch(() => {});

            loading.style.display = 'none';
            content.style.display = 'block';
        } catch (err) {
            console.error('[MemberProfileModal] open error:', err);
            Core.showToast('Could not load member profile');
            this.close();
        }
    },

    close() {
        const modal = document.getElementById('memberProfileModal');
        const inner = document.getElementById('memberProfileModalInner');
        if (!modal) return;

        modal.style.opacity = '0';
        inner.style.transform = 'translateY(16px)';

        setTimeout(() => {
            modal.style.display = 'none';
            this.state.isOpen = false;
            this.state.currentUserId = null;
            document.body.style.overflow = '';
            this._hideActionPanels();
        }, 250);
    },

    // ============================================================================
    // POPULATE
    // ============================================================================

    _populate(profile) {
        // Avatar
        const avatarEl = document.getElementById('memberModalAvatar');
        if (avatarEl) {
            if (profile.avatar_url) {
                avatarEl.style.background = 'transparent';
                avatarEl.innerHTML = `<img src="${profile.avatar_url}"
                    style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
                    alt="${this._escape(profile.name)}">`;
            } else {
                const gradient = window.Core?.getAvatarGradient
                    ? Core.getAvatarGradient(profile.id)
                    : 'linear-gradient(135deg,#667eea,#764ba2)';
                avatarEl.style.background = gradient;
                avatarEl.innerHTML = `<span>${this._escape(profile.emoji || (profile.name || '?').charAt(0).toUpperCase())}</span>`;
            }
        }

        // Status ring
        const ring = document.getElementById('memberModalStatusRing');
        if (ring) {
            const colorMap = {
                online:    { c:'var(--ring-available,#6b9b37)', s:'rgba(107,155,55,0.2)'  },
                available: { c:'var(--ring-available,#6b9b37)', s:'rgba(107,155,55,0.2)'  },
                away:      { c:'var(--ring-guiding,#d4a574)',   s:'rgba(212,165,116,0.2)' },
                silent:    { c:'var(--ring-silent,#6ba3b3)',    s:'rgba(107,163,179,0.2)' },
                deep:      { c:'var(--ring-deep,#8b7355)',      s:'rgba(139,115,85,0.2)'  },
                offline:   { c:'var(--ring-offline,#a89279)',   s:'rgba(168,146,121,0.2)' },
            };
            const cfg = colorMap[profile.community_status] || colorMap.offline;
            ring.style.borderColor = cfg.c;
            ring.style.boxShadow   = `0 0 0 3px ${cfg.s}`;
        }

        // Name
        const nameEl = document.getElementById('memberModalName');
        if (nameEl) nameEl.textContent = profile.name || 'Member';

        // Role pill
        const roleEl = document.getElementById('memberModalRole');
        if (roleEl) roleEl.textContent = `👤 ${profile.community_role || 'Member'}`;

        // Birthday + Country
        const locationEl = document.getElementById('memberModalLocation');
        if (locationEl) {
            const parts = [];
            if (profile.birthday) {
                try {
                    const d = new Date(profile.birthday + 'T00:00:00');
                    parts.push(`🎂 ${d.toLocaleDateString(undefined, { month:'long', day:'numeric' })}`);
                } catch { parts.push(`🎂 ${profile.birthday}`); }
            }
            if (profile.country) {
                parts.push(`${this._countryFlag(profile.country)} ${profile.country}`);
            }
            locationEl.innerHTML = parts.map(p => `<span>${p}</span>`).join('');
        }

        // Inspiration
        const bioEl = document.getElementById('memberModalInspiration');
        if (bioEl) bioEl.textContent = profile.inspiration ? `"${profile.inspiration}"` : '';
    },

    _countryFlag(countryName) {
        const map = {
            'israel':'IL','united states':'US','usa':'US','us':'US','united kingdom':'GB','uk':'GB',
            'canada':'CA','australia':'AU','germany':'DE','france':'FR','spain':'ES','italy':'IT',
            'netherlands':'NL','belgium':'BE','switzerland':'CH','sweden':'SE','norway':'NO',
            'denmark':'DK','finland':'FI','poland':'PL','portugal':'PT','austria':'AT',
            'india':'IN','china':'CN','japan':'JP','south korea':'KR','brazil':'BR',
            'mexico':'MX','argentina':'AR','south africa':'ZA','russia':'RU','ukraine':'UA',
            'greece':'GR','turkey':'TR','egypt':'EG','new zealand':'NZ','ireland':'IE',
            'singapore':'SG','thailand':'TH','indonesia':'ID','malaysia':'MY','philippines':'PH',
        };
        const code = map[countryName.toLowerCase().trim()];
        if (!code) return '🌍';
        return [...code].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
    },

    _populateGamification(g) {
        const levelTitles = {1:'Seeker',2:'Practitioner',3:'Adept',4:'Healer',5:'Master',
                             6:'Sage',7:'Enlightened',8:'Buddha',9:'Light',10:'Emptiness'};

        // Level — prominent pill
        const level = document.getElementById('memberModalLevel');
        if (level) level.textContent = `✦ Level ${g.level} · ${levelTitles[g.level] || 'Seeker'}`;

        // Stats
        const karma = document.getElementById('memberModalKarma');
        if (karma) karma.textContent = (g.karma ?? 0).toLocaleString();

        const xp = document.getElementById('memberModalXP');
        if (xp) xp.textContent = (g.xp ?? 0).toLocaleString();

        const streak = document.getElementById('memberModalStreak');
        if (streak) streak.textContent = (g.streak ?? 0);

        // Activity counts
        const actEl = document.getElementById('memberModalActivity');
        if (actEl) {
            const items = [
                g.totalMeditations    > 0 ? `🧘 ${g.totalMeditations} meditations`          : null,
                g.totalTarotSpreads   > 0 ? `🔮 ${g.totalTarotSpreads} readings`             : null,
                g.totalJournalEntries > 0 ? `📓 ${g.totalJournalEntries} journal entries`    : null,
                g.streak              > 0 ? `🔥 ${g.streak}-day streak`                      : null,
            ].filter(Boolean);
            actEl.innerHTML = items.map(i => `<span>${i}</span>`).join('');
        }

        // Badges
        const badgesEl = document.getElementById('memberModalBadges');
        if (badgesEl) {
            const earned = g.badges || [];
            if (!earned.length) { badgesEl.innerHTML = ''; return; }
            const rarityColors = {common:'#9ca3af',uncommon:'#10b981',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b'};
            badgesEl.innerHTML = [...earned].slice(-8).reverse().map(b => {
                const color = rarityColors[b.rarity] || rarityColors.common;
                return `<div title="${b.name || 'Badge'}"
                             style="width:32px;height:32px;border-radius:50%;
                                    border:2px solid ${color};
                                    display:flex;align-items:center;justify-content:center;
                                    font-size:1.1rem;cursor:default;">${b.icon || '🏅'}</div>`;
            }).join('');
        }
    },

    // ============================================================================
    // APPRECIATE
    // ============================================================================

    async toggleAppreciate() {
        const btn = document.getElementById('memberModalAppreciateBtn');
        if (!btn || !this.state.currentUserId) return;

        btn.disabled = true;
        try {
            const result = await CommunityDB.toggleUserAppreciation(this.state.currentUserId, this.state.isAppreciated);
            if (!result) { Core.showToast('Could not update — please try again'); return; }
            this.state.isAppreciated = result.appreciated;
            // Refresh count
            const count = await CommunityDB.getUserAppreciationCount(this.state.currentUserId);
            this.state.appreciationCount = count;
            this._updateAppreciateBtn();
            Core.showToast(result.appreciated ? '🙏 Appreciation sent' : 'Appreciation removed');
        } catch (err) {
            console.error('[MemberProfileModal] toggleAppreciate error:', err);
            Core.showToast('Could not update — please try again');
        } finally {
            btn.disabled = false;
        }
    },

    _updateAppreciateBtn() {
        const btn = document.getElementById('memberModalAppreciateBtn');
        if (!btn) return;
        const count = this.state.appreciationCount ?? '';
        const countStr = count !== '' ? ` (${count})` : '';
        if (this.state.isAppreciated) {
            btn.textContent = `🙏 Appreciated${countStr}`;
            btn.style.background = 'var(--primary,#667eea)';
            btn.style.color = '#fff';
            btn.style.boxShadow = 'inset 2px 2px 5px rgba(0,0,0,0.15)';
        } else {
            btn.textContent = `🙏 Appreciate${countStr}`;
            btn.style.background = 'var(--neuro-bg,#f0f0f3)';
            btn.style.color = 'var(--neuro-text)';
            btn.style.boxShadow = '3px 3px 8px rgba(0,0,0,0.1),-2px -2px 6px rgba(255,255,255,0.7)';
        }
    },

    // ============================================================================
    // WHISPER
    // ============================================================================

    startWhisper() {
        this._hideActionPanels();
        const panel = document.getElementById('memberModalWhisperPanel');
        if (panel) {
            panel.style.display = 'block';
            document.getElementById('memberModalWhisperText')?.focus();
        }
    },

    cancelWhisper() {
        const panel = document.getElementById('memberModalWhisperPanel');
        if (panel) {
            panel.style.display = 'none';
            const txt = document.getElementById('memberModalWhisperText');
            if (txt) txt.value = '';
        }
    },

    async sendWhisper() {
        const txt = document.getElementById('memberModalWhisperText');
        const message = txt?.value.trim();
        if (!message) { Core.showToast('Please write a message first'); return; }

        const btn = document.querySelector('#memberModalWhisperPanel button');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

        try {
            const result = await CommunityDB.sendWhisper(this.state.currentUserId, message);
            if (result) {
                Core.showToast('💬 Whisper sent');
                this.cancelWhisper();
            } else {
                Core.showToast('Could not send — please try again');
            }
        } catch (err) {
            console.error('[MemberProfileModal] sendWhisper error:', err);
            Core.showToast('Could not send — please try again');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
        }
    },

    // ============================================================================
    // REPORT
    // ============================================================================

    startReport() {
        this._hideActionPanels();
        const panel = document.getElementById('memberModalReportPanel');
        if (panel) panel.style.display = 'block';
    },

    cancelReport() {
        const panel = document.getElementById('memberModalReportPanel');
        if (panel) {
            panel.style.display = 'none';
            const sel = document.getElementById('memberModalReportReason');
            const det = document.getElementById('memberModalReportDetails');
            if (sel) sel.value = '';
            if (det) det.value = '';
        }
    },

    async submitReport() {
        const reason  = document.getElementById('memberModalReportReason')?.value;
        const details = document.getElementById('memberModalReportDetails')?.value.trim() || '';

        if (!reason) { Core.showToast('Please select a reason'); return; }

        const btn = document.querySelector('#memberModalReportPanel button');
        if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }

        try {
            const ok = await CommunityDB.submitReport(this.state.currentUserId, reason, details);
            if (ok) {
                Core.showToast('✓ Report submitted — thank you');
                this.cancelReport();
            } else {
                Core.showToast('Could not submit — please try again');
            }
        } catch (err) {
            console.error('[MemberProfileModal] submitReport error:', err);
            Core.showToast('Could not submit — please try again');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = 'Submit Report'; }
        }
    },

    // ============================================================================
    // BLOCK
    // ============================================================================

    async startBlock() {
        const name = document.getElementById('memberModalName')?.textContent || 'this member';
        const confirmed = confirm(`Block ${name}? Their content will be hidden from you.`);
        if (!confirmed) return;

        try {
            const ok = await CommunityDB.blockUser(this.state.currentUserId);
            if (ok) {
                Core.showToast(`🚫 ${name} blocked`);
                this.close();
                // Refresh active members to remove blocked user
                if (window.ActiveMembers) ActiveMembers.refresh();
            } else {
                Core.showToast('Could not block — please try again');
            }
        } catch (err) {
            console.error('[MemberProfileModal] blockUser error:', err);
            Core.showToast('Could not block — please try again');
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    _hideActionPanels() {
        ['memberModalWhisperPanel', 'memberModalReportPanel'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const txt = document.getElementById('memberModalWhisperText');
        if (txt) txt.value = '';
        const sel = document.getElementById('memberModalReportReason');
        if (sel) sel.value = '';
        const det = document.getElementById('memberModalReportDetails');
        if (det) det.value = '';
    },

    _escape(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
};

window.MemberProfileModal = MemberProfileModal;
console.log('✓ MemberProfileModal loaded');
