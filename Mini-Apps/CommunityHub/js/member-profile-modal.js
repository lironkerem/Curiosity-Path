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
        isOpen:          false,
        currentUserId:   null,
        reportStep:      null   // null | 'reason' | 'details'
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

                        <!-- Avatar + name -->
                        <div style="display:flex;flex-direction:column;align-items:center;gap:10px;margin-bottom:1.5rem;">
                            <div id="memberModalAvatar"
                                 style="width:80px;height:80px;border-radius:50%;
                                        display:flex;align-items:center;justify-content:center;
                                        font-size:2rem;overflow:hidden;flex-shrink:0;">
                            </div>
                            <div>
                                <div id="memberModalName"
                                     style="font-size:1.2rem;font-weight:700;
                                            color:var(--neuro-text);text-align:center;"></div>
                                <div id="memberModalRole"
                                     style="font-size:0.8rem;color:var(--text-muted);
                                            text-align:center;margin-top:2px;"></div>
                            </div>
                        </div>

                        <!-- Inspiration -->
                        <div id="memberModalInspiration"
                             style="font-size:0.88rem;font-style:italic;
                                    color:var(--neuro-text-light,#555);
                                    text-align:center;margin-bottom:1.5rem;
                                    padding:0 0.5rem;line-height:1.5;">
                        </div>

                        <!-- Stats row -->
                        <div style="display:flex;justify-content:space-around;
                                    margin-bottom:1.75rem;
                                    padding:1rem;
                                    border-radius:12px;
                                    background:var(--neuro-shadow-light,rgba(0,0,0,0.04));">
                            <div style="text-align:center;">
                                <div id="memberModalSessions"
                                     style="font-size:1.3rem;font-weight:700;color:var(--primary,#667eea);">0</div>
                                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Sessions</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="memberModalGifts"
                                     style="font-size:1.3rem;font-weight:700;color:var(--primary,#667eea);">0</div>
                                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Gifts</div>
                            </div>
                            <div style="text-align:center;">
                                <div id="memberModalKarma"
                                     style="font-size:1.3rem;font-weight:700;color:var(--primary,#667eea);">0</div>
                                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Karma</div>
                            </div>
                        </div>

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
        if (userId === window.CommunityDB?.userId) {
            Core.showToast('This is your own profile');
            return;
        }

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

        // Name
        const nameEl = document.getElementById('memberModalName');
        if (nameEl) nameEl.textContent = profile.name || 'Member';

        // Role
        const roleEl = document.getElementById('memberModalRole');
        if (roleEl) roleEl.textContent = profile.community_role || 'Member';

        // Inspiration
        const bioEl = document.getElementById('memberModalInspiration');
        if (bioEl) {
            bioEl.textContent = profile.inspiration
                ? `"${profile.inspiration}"`
                : '';
        }

        // Stats
        const sessions = document.getElementById('memberModalSessions');
        if (sessions) sessions.textContent = (profile.total_sessions || 0).toLocaleString();

        const gifts = document.getElementById('memberModalGifts');
        if (gifts) gifts.textContent = (profile.gifts_given || 0).toLocaleString();

        // Karma: not in getProfile select — show dash for other users
        const karma = document.getElementById('memberModalKarma');
        if (karma) karma.textContent = '—';
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
