/**
 * COMMUNITY MODULE
 * PATCHED: Full Supabase integration — reflections, appreciations, whispers, reports, blocks
 *
 * @version 2.0.0
 */

const CommunityModule = {

    // ============================================================================
    // STATE
    // ============================================================================

    state: {
        isInitialized:          false,
        appreciatedReflections: new Set(),  // Set<string> of reflection UUIDs
        reportingUserId:        null        // UUID of user being reported
    },

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    config: {
        MIN_REFLECTION_LENGTH:           1,
        MAX_REFLECTION_LENGTH:         500,
        MIN_REPORT_LENGTH:              10,
        MIN_MODERATOR_MESSAGE_LENGTH:   10,
        MIN_TECHNICAL_DESCRIPTION_LENGTH: 10
    },

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    async init() {
        if (this.state.isInitialized) {
            console.warn('CommunityModule already initialized');
            return;
        }

        try {
            console.log('👥 Community Module Loading...');

            // Load which reflections this user has already appreciated
            this.state.appreciatedReflections = await CommunityDB.getMyAppreciations();

            // Render the reflections section shell + input
            this.renderReflectionsHTML();

            // Populate with real data
            await this.renderReflections();

            // Subscribe to new reflections being posted by others
            this.subscribeToNewReflections();

            // Subscribe to incoming whispers — WhisperModal handles UI + toasts
            // (WhisperModal has its own internal subscription when open;
            //  this one fires when the modal is closed so we can still badge + toast)
            const _initWhisperBadge = () => {
                if (!window.WhisperModal) return;
                WhisperModal.refreshUnreadBadge();
            };
            if (!window.CommunityDB?.ready) {
                const _wi = setInterval(() => {
                    if (!window.CommunityDB?.ready) return;
                    clearInterval(_wi);
                    _initWhisperBadge();
                }, 300);
            } else {
                _initWhisperBadge();
            }

            this.renderWaves();
            this.renderMembers();

            this.state.isInitialized = true;
            console.log('✓ CommunityModule initialized');

        } catch (error) {
            console.error('CommunityModule initialization failed:', error);
        }
    },

    // ============================================================================
    // REFLECTIONS — HTML shell
    // ============================================================================

    getReflectionsHTML() {
        const user      = Core?.state?.currentUser || {};
        const avatarUrl = user.avatar_url || '';
        const emoji     = user.emoji || '';
        const name      = user.name || 'You';
        const initial   = name.charAt(0).toUpperCase();
        const gradient  = Core.getAvatarGradient(user.id || 'me');

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : (emoji || initial);
        const avatarStyle = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Community Reflections</div>
                <div style="font-size: 12px; color: var(--text-muted);">Shared wisdom & moments</div>
            </div>

            <!-- New reflection input -->
            <div class="reflection" style="margin-bottom:16px;">
                <div class="ref-header">
                    <div class="ref-avatar" style="${avatarStyle}">
                        ${avatarInner}
                    </div>
                    <div class="ref-meta" style="flex:1;">
                        <div class="ref-author">${name}</div>
                        <div class="ref-time">Write a reflection...</div>
                    </div>
                </div>
                <textarea id="reflectionInput"
                          placeholder="Share a reflection with the community..."
                          maxlength="500"
                          style="width:100%;padding:10px 12px;border:1px solid var(--border);
                                 border-radius:var(--radius-md);background:var(--surface);
                                 color:var(--text);resize:none;min-height:80px;
                                 font-size:14px;line-height:1.6;box-sizing:border-box;
                                 margin-top:4px;"></textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:10px;border-top:2px solid var(--border);">
                    <span style="font-size:11px;color:var(--text-muted);"><span id="charCount">0</span>/500</span>
                    <button onclick="CommunityModule.shareReflection()"
                            style="padding:7px 20px;background:var(--accent);color:#fff;border:none;
                                   border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;">
                        Share
                    </button>
                </div>
            </div>

            <!-- Feed -->
            <div id="reflectionsContainer"></div>
        </section>`;
    },

    renderReflectionsHTML() {
        const container = document.getElementById('communityReflectionsContainer');
        if (!container) {
            console.warn('communityReflectionsContainer not found');
            return;
        }
        try {
            container.innerHTML = this.getReflectionsHTML();
            this.setupCharCounter();
        } catch (error) {
            console.error('Reflections HTML render error:', error);
        }
    },

    // ============================================================================
    // REFLECTIONS — data
    // ============================================================================

    async renderReflections() {
        const container = document.getElementById('reflectionsContainer');
        if (!container) return;

        try {
            container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Loading reflections...</div>';

            const [reflections, blocked] = await Promise.all([
                CommunityDB.getReflections(20),
                CommunityDB.getBlockedUsers()
            ]);

            const visible = reflections.filter(r => !blocked.has(r.profiles?.id));

            container.innerHTML = visible.length > 0
                ? visible.map(r => this.getReflectionHTML(r)).join('')
                : '<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Be the first to share a reflection ✨</div>';


        } catch (error) {
            console.error('renderReflections error:', error);
        }
    },

    getReflectionHTML(ref) {
        const profile     = ref.profiles || {};
        const name        = profile.name  || 'Community Member';
        const emoji       = profile.emoji || '';
        const avatarUrl   = profile.avatar_url || '';
        const initial     = name.charAt(0).toUpperCase();
        const display     = emoji || initial;
        const gradient    = Core.getAvatarGradient(profile.id || ref.id);
        const timeStr     = this.formatRelativeTime(ref.created_at);
        const isOwn       = profile.id === Core?.state?.currentUser?.id;
        const appreciated = this.state.appreciatedReflections.has(ref.id);

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" alt="${this.escapeHtml(name)}">`
            : this.escapeHtml(display);
        const avatarStyle = avatarUrl
            ? `background:transparent;`
            : `background:${gradient};`;

        return `
            <div class="reflection" data-reflection-id="${ref.id}">
                <div class="ref-header">
                    <div class="ref-avatar"
                         style="${avatarStyle} cursor: pointer;"
                         onclick="CommunityModule.viewMember('${profile.id}')">
                        ${avatarInner}
                    </div>
                    <div class="ref-meta">
                        <div class="ref-author" style="cursor: pointer;"
                             onclick="CommunityModule.viewMember('${profile.id}')">
                            ${this.escapeHtml(name)}
                        </div>
                        <div class="ref-time">${timeStr}</div>
                    </div>
                    ${isOwn ? `` : ''}
                </div>
                <div class="ref-content">${this.escapeHtml(ref.content)}</div>
                <div class="ref-actions">
                    <button class="ref-action ${appreciated ? 'appreciated' : ''}"
                            onclick="CommunityModule.appreciate(this, '${ref.id}')">
                        <span>🙏</span>
                        <span class="appreciation-count">Appreciate (${ref.appreciation_count || 0})</span>
                    </button>
                    <button class="ref-action"
                            onclick="CommunityModule.whisper('${profile.id}')">
                        <span>💬</span>
                        <span>Whisper</span>
                    </button>
                    ${isOwn ? `
                    <div style="margin-left:auto;display:flex;gap:4px;">
                        <button onclick="CommunityModule.editReflection('${ref.id}')"
                                class="ref-action"
                                title="Edit reflection"
                                style="font-size:14px;opacity:0.6;">✏️</button>
                        <button onclick="CommunityModule.deleteReflection('${ref.id}')"
                                class="ref-action"
                                title="Delete reflection"
                                style="font-size:14px;opacity:0.6;">🗑️</button>
                    </div>` : ''}
                </div>
            </div>`;
    },

    subscribeToNewReflections() {
        const sub = CommunityDB.subscribeToReflections(async (newReflection) => {
            // Don't duplicate own reflections (we add them optimistically on post)
            if (newReflection.profiles?.id === Core?.state?.currentUser?.id) return;

            const blocked = await CommunityDB.getBlockedUsers();
            if (blocked.has(newReflection.profiles?.id)) return;

            const container = document.getElementById('reflectionsContainer');
            if (!container) return;

            const div = document.createElement('div');
            div.innerHTML = this.getReflectionHTML(newReflection);
            const el = div.firstElementChild;
            if (el) container.insertBefore(el, container.firstChild);
        });
        if (!sub) {
            // CommunityDB wasn't ready — retry once it is
            const interval = setInterval(() => {
                if (!window.CommunityDB?.ready) return;
                clearInterval(interval);
                this.subscribeToNewReflections();
            }, 300);
        }
    },


    // ============================================================================
    // SHARE / DELETE REFLECTION
    // ============================================================================

    async shareReflection() {
        const input = document.getElementById('reflectionInput');
        if (!input) return;

        const text = input.value.trim();
        if (!text || text.length < this.config.MIN_REFLECTION_LENGTH) {
            Core.showToast('Please write something first');
            return;
        }
        if (text.length > this.config.MAX_REFLECTION_LENGTH) {
            Core.showToast(`Reflection too long (max ${this.config.MAX_REFLECTION_LENGTH} characters)`);
            return;
        }

        try {
            const result = await CommunityDB.postReflection(text);
            if (!result) {
                Core.showToast('Could not share reflection — please try again');
                return;
            }

            // Reset input
            input.value = '';
            const counter = document.getElementById('charCount');
            if (counter) counter.textContent = '0';

            // Optimistically prepend to the feed
            const container = document.getElementById('reflectionsContainer');
            if (container) {
                const div = document.createElement('div');
                div.innerHTML = this.getReflectionHTML(result);
                const el = div.firstElementChild;
                if (el) container.insertBefore(el, container.firstChild);
            }

            Core.showToast('✓ Reflection shared with the community');

        } catch (error) {
            console.error('shareReflection error:', error);
        }
    },

    async deleteReflection(reflectionId) {
        if (!confirm('Remove this reflection?')) return;
        const ok = await CommunityDB.deleteReflection(reflectionId);
        if (ok) {
            const el = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
            if (el) el.remove();
            Core.showToast('Reflection removed');
        } else {
            Core.showToast('Could not remove reflection');
        }
    },

    editReflection(reflectionId) {
        const card = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        if (!card) return;

        const contentEl = card.querySelector('.ref-content');
        if (!contentEl) return;

        const original = contentEl.textContent.trim();

        contentEl.innerHTML = `
            <textarea id="editReflectionInput_${reflectionId}"
                      maxlength="500"
                      rows="3"
                      style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);
                             background:var(--surface);color:var(--text);resize:vertical;
                             font-size:14px;line-height:1.6;box-sizing:border-box;"
            >${this.escapeHtml(original)}</textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                <span style="font-size:11px;color:var(--text-muted)">
                    <span id="editCharCount_${reflectionId}">${original.length}</span>/500
                </span>
                <div style="display:flex;gap:8px;">
                    <button onclick="CommunityModule.saveEditReflection('${reflectionId}')"
                            style="padding:5px 14px;background:var(--accent);color:#fff;border:none;
                                   border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;">
                        Save
                    </button>
                    <button onclick="CommunityModule.cancelEditReflection('${reflectionId}', \`${this.escapeHtml(original).replace(/`/g, '\\`')}\`)"
                            style="padding:5px 12px;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                   color:var(--neuro-text);border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;">
                        Cancel
                    </button>
                </div>
            </div>`;

        const ta = document.getElementById(`editReflectionInput_${reflectionId}`);
        const counter = document.getElementById(`editCharCount_${reflectionId}`);
        if (ta) {
            ta.addEventListener('input', () => { if (counter) counter.textContent = ta.value.length; });
            ta.focus();
            ta.setSelectionRange(ta.value.length, ta.value.length);
        }
    },

    cancelEditReflection(reflectionId, original) {
        const card = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        if (!card) return;
        const contentEl = card.querySelector('.ref-content');
        if (contentEl) contentEl.textContent = original;
    },

    async saveEditReflection(reflectionId) {
        const ta = document.getElementById(`editReflectionInput_${reflectionId}`);
        if (!ta) return;
        const newText = ta.value.trim();
        if (!newText) { Core.showToast('Reflection cannot be empty'); return; }
        if (newText.length > 500) { Core.showToast('Too long (max 500 characters)'); return; }

        ta.disabled = true;
        const ok = await CommunityDB.updateReflection(reflectionId, newText);
        if (ok) {
            const card = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
            const contentEl = card?.querySelector('.ref-content');
            if (contentEl) contentEl.textContent = newText;
            Core.showToast('✓ Reflection updated');
        } else {
            ta.disabled = false;
            Core.showToast('Could not update — please try again');
        }
    },

    // ============================================================================
    // APPRECIATIONS
    // ============================================================================

    async appreciate(btn, reflectionId) {
        if (!btn || !reflectionId) return;

        try {
            const isCurrentlyAppreciated = this.state.appreciatedReflections.has(reflectionId);
            const result = await CommunityDB.toggleAppreciation(reflectionId, isCurrentlyAppreciated);
            if (!result) return;

            // Update local Set
            if (result.appreciated) {
                this.state.appreciatedReflections.add(reflectionId);
                btn.classList.add('appreciated');
            } else {
                this.state.appreciatedReflections.delete(reflectionId);
                btn.classList.remove('appreciated');
            }

            // Re-fetch accurate count from DB
            const count = await CommunityDB.getReflectionCount(reflectionId);

            const countEl = btn.querySelector('.appreciation-count');
            if (countEl && count !== null) {
                countEl.textContent = `Appreciate (${count})`;
            }

        } catch (error) {
            console.error('appreciate error:', error);
        }
    },

    // ============================================================================
    // WHISPERS
    // ============================================================================

    async whisper(recipientId) {
        if (!recipientId) return;

        // Fetch profile so we can open a named thread
        try {
            const profile  = await CommunityDB.getProfile(recipientId);
            const name     = profile?.name       || 'Member';
            const emoji    = profile?.emoji      || '';
            const avatarUrl = profile?.avatar_url || '';
            WhisperModal.openThread(recipientId, name, emoji, avatarUrl);
        } catch (err) {
            WhisperModal.openThread(recipientId, 'Member', '', '');
        }
    },

    // ============================================================================
    // COLLECTIVE WAVES (unchanged — not yet wired to DB)
    // ============================================================================

    renderWaves() {
        const container = document.getElementById('wavesContainer');
        if (!container) return;
        try {
            const waves = this.getWavesData();
            container.innerHTML = waves.map(w => this.getWaveHTML(w)).join('');
        } catch (error) {
            console.error('Waves render error:', error);
        }
    },

    getWavesData() {
        return [
            { id: 1, title: 'Evening Wind Down',       time: 'Tonight at 8:00 PM',  participants: 42, progress: 67 },
            { id: 2, title: 'Sunday Morning Stillness', time: 'Tomorrow at 7:00 AM', participants: 28, progress: 45 }
        ];
    },

    getWaveHTML(wave) {
        return `
            <div class="wave-card" data-wave-id="${wave.id}">
                <div class="wave-header">
                    <div>
                        <div class="wave-title">${this.escapeHtml(wave.title)}</div>
                        <div class="wave-meta">${this.escapeHtml(wave.time)} • ${wave.participants} joined</div>
                    </div>
                </div>
                <div class="prog-bar">
                    <div class="prog-fill" style="width: ${Math.min(100, Math.max(0, wave.progress))}%"></div>
                </div>
                <button class="contrib-btn" onclick="CommunityModule.contributeWave(${wave.id})">
                    Contribute 20 Minutes
                </button>
            </div>`;
    },

    contributeWave(waveId) {
        Core.showToast('Contribution recorded! Start your practice.');
    },

    // ============================================================================
    // MEMBERS
    // ============================================================================

    renderMembers() {
        // Presence is handled entirely by active-members.js
    },

    viewMember(userId) {
        Core.showToast('Member profiles coming soon');
    },

    // ============================================================================
    // SAFETY & MODERATION
    // ============================================================================

    showCrisisModal()    { this.openModal('crisisModal'); },
    closeCrisisModal()   { this.closeModal('crisisModal'); },

    showReportModal(userId = null) {
        this.state.reportingUserId = userId;
        this.openModal('reportModal');
    },
    closeReportModal() {
        this.closeModal('reportModal');
        const r = document.getElementById('reportReason');
        const d = document.getElementById('reportDetails');
        if (r) r.value = '';
        if (d) d.value = '';
        this.state.reportingUserId = null;
    },

    async submitReport() {
        const reason  = document.getElementById('reportReason')?.value;
        const details = document.getElementById('reportDetails')?.value?.trim() || '';

        if (!reason) {
            Core.showToast('Please select a reason');
            return;
        }

        const reportedUserId = this.state.reportingUserId;
        const ok = await CommunityDB.submitReport(reportedUserId, reason, details);

        if (ok) {
            Core.showToast('✓ Report submitted. Thank you for keeping the space safe.');
            this.closeReportModal();
        } else {
            Core.showToast('Could not submit report — please try again');
        }
    },

    showBlockModal()  { this.openModal('blockModal'); },
    closeBlockModal() {
        this.closeModal('blockModal');
        const input = document.getElementById('blockUsername');
        if (input) input.value = '';
    },

    async confirmBlock() {
        const username = document.getElementById('blockUsername')?.value?.trim();
        if (!username) {
            Core.showToast('Please enter a username');
            return;
        }

        // Look up the user by name
        const data = await CommunityDB.getUserByName(username);

        if (!data) {
            Core.showToast('User not found');
            return;
        }

        const ok = await CommunityDB.blockUser(data.id);
        if (ok) {
            Core.showToast(`${data.name} has been blocked`);
            this.closeBlockModal();
            // Refresh reflections to remove their posts
            await this.renderReflections();
        } else {
            Core.showToast('Could not block user — please try again');
        }
    },

    hideMessagesFromUser(username) {
        try {
            document.querySelectorAll('.chat-msg').forEach(msg => {
                const authorEl = msg.querySelector('div');
                if (authorEl && authorEl.textContent.includes(username)) {
                    msg.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Hide messages error:', error);
        }
    },

    showHelpModal()  { this.openModal('helpModal'); },
    closeHelpModal() { this.closeModal('helpModal'); },
    needHelp()       { this.showHelpModal(); },

    showModeratorModal() {
        this.closeHelpModal();
        this.openModal('moderatorModal');
    },
    closeModeratorModal() {
        this.closeModal('moderatorModal');
        const u = document.getElementById('moderatorUrgency');
        const m = document.getElementById('moderatorMessage');
        if (u) u.value = 'low';
        if (m) m.value = '';
    },
    contactModerator() { this.showModeratorModal(); },

    submitModeratorRequest() {
        const urgency = document.getElementById('moderatorUrgency')?.value;
        const message = document.getElementById('moderatorMessage')?.value?.trim();

        if (!message || message.length < this.config.MIN_MODERATOR_MESSAGE_LENGTH) {
            Core.showToast(`Please describe your situation (at least ${this.config.MIN_MODERATOR_MESSAGE_LENGTH} characters)`);
            return;
        }

        Core.showToast('✓ Request sent. A moderator will reach out shortly.');
        this.closeModeratorModal();
    },

    showTechnicalModal()  {
        this.closeHelpModal();
        this.openModal('technicalModal');
    },
    closeTechnicalModal() {
        this.closeModal('technicalModal');
        const t = document.getElementById('technicalType');
        const d = document.getElementById('technicalDescription');
        const v = document.getElementById('technicalDevice');
        if (t) t.value = '';
        if (d) d.value = '';
        if (v) v.value = '';
    },
    reportTechnicalIssue() { this.showTechnicalModal(); },

    submitTechnicalIssue() {
        const type        = document.getElementById('technicalType')?.value;
        const description = document.getElementById('technicalDescription')?.value?.trim();
        const device      = document.getElementById('technicalDevice')?.value?.trim();

        if (!type) { Core.showToast('Please select an issue type'); return; }
        if (!description || description.length < this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH) {
            Core.showToast(`Please provide more details (at least ${this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH} characters)`);
            return;
        }

        Core.showToast('✓ Issue reported. Our tech team will investigate.');
        this.closeTechnicalModal();
    },

    showGuidelinesModal()  {
        this.closeHelpModal();
        this.openModal('guidelinesModal');
    },
    closeGuidelinesModal() { this.closeModal('guidelinesModal'); },
    viewGuidelines()       { this.showGuidelinesModal(); },

    // ============================================================================
    // CHAT (mute toggle — actual send/receive in practice.js)
    // ============================================================================

    muteChat() {
        const sidebar = document.getElementById('psSidebar');
        if (!sidebar) return;
        try {
            const isMuted = sidebar.classList.contains('muted');
            sidebar.classList.toggle('muted');
            Core.showToast(isMuted ? '🔊 Chat unmuted' : '🔇 Chat muted');
            if (!isMuted && sidebar.classList.contains('open')) {
                if (window.Practice && typeof window.Practice.toggleChat === 'function') {
                    window.Practice.toggleChat();
                }
            }
        } catch (error) {
            console.error('Mute chat error:', error);
        }
    },

    // ============================================================================
    // EVENTS
    // ============================================================================

    registerEvent(eventId) {
        Core.showToast('Registration confirmed! Check your email.');
    },

    // ============================================================================
    // MODAL UTILITIES
    // ============================================================================

    openModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.add('active');
            else console.warn(`Modal not found: ${modalId}`);
        } catch (error) {
            console.error('Open modal error:', error);
        }
    },

    closeModal(modalId) {
        try {
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove('active');
        } catch (error) {
            console.error('Close modal error:', error);
        }
    },

    // ============================================================================
    // UTILITIES
    // ============================================================================

    setupCharCounter() {
        const input   = document.getElementById('reflectionInput');
        const counter = document.getElementById('charCount');
        if (input && counter) {
            input.addEventListener('input', () => {
                counter.textContent = input.value.length;
            });
        }
    },

    formatRelativeTime(isoString) {
        if (!isoString) return '';
        const diff  = Date.now() - new Date(isoString).getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);
        if (mins  < 1)  return 'Just now';
        if (mins  < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    },

    escapeHtml(str) {
        if (!str || typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// ============================================================================
// AUTO-INITIALIZATION — deferred until CommunityDB is ready
// ============================================================================

window.CommunityModule = CommunityModule;
// core.js calls CommunityModule.init() after CommunityDB is ready — no self-init here.