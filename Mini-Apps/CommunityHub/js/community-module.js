/**
 * COMMUNITY MODULE
 * Reflections, appreciations, whispers, reports, blocks - Supabase integrated
 * @version 2.1.0
 */

import { CommunityDB } from './community-supabase.js';

const CommunityModule = {

    // =========================================================================
    // STATE & CONFIG
    // =========================================================================

    state: {
        isInitialized:          false,
        appreciatedReflections: new Set(),  // Set<string> of reflection UUIDs
        reportingUserId:        null,
    },

    config: {
        MIN_REFLECTION_LENGTH:            1,
        MAX_REFLECTION_LENGTH:          500,
        MIN_REPORT_LENGTH:               10,
        MIN_MODERATOR_MESSAGE_LENGTH:    10,
        MIN_TECHNICAL_DESCRIPTION_LENGTH: 10,
    },

    // =========================================================================
    // INIT
    // =========================================================================

    async init() {
        if (this.state.isInitialized) return;

        try {
            this.state.appreciatedReflections = await CommunityDB.getMyAppreciations();
            this.renderReflectionsHTML();
            await this.renderReflections();
            this.subscribeToNewReflections();
            this._initWhisperBadge();
            this.state.isInitialized = true;
        } catch (err) {
            console.error('[CommunityModule] init failed:', err);
        }
    },

    _initWhisperBadge() {
        const refresh = () => window.WhisperModal?.refreshUnreadBadge();
        if (CommunityDB?.ready) {
            refresh();
        } else {
            const interval = setInterval(() => {
                if (!CommunityDB?.ready) return;
                clearInterval(interval);
                refresh();
            }, 300);
        }
    },

    // =========================================================================
    // REFLECTIONS - SHELL
    // =========================================================================

    renderReflectionsHTML() {
        const container = document.getElementById('communityReflectionsContainer');
        if (!container) {
            console.warn('[CommunityModule] #communityReflectionsContainer not found');
            return;
        }
        container.innerHTML = this._buildReflectionsShell();
        this._setupCharCounter('reflectionInput', 'charCount');
    },

    _buildReflectionsShell() {
        const user      = Core?.state?.currentUser || {};
        const name      = user.name      || 'You';
        const avatarUrl = user.avatar_url || '';
        const gradient  = Core.getAvatarGradient(user.id || 'me');

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" alt="${name}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" loading="lazy" decoding="async">`
            : (user.emoji || name.charAt(0).toUpperCase());
        const avatarStyle = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        return `
        <section class="section">
            <div class="section-header">
                <div class="section-title">Community Reflections</div>
                <div style="font-size:12px;color:var(--text-muted);">Shared wisdom & moments</div>
            </div>

            <div class="reflection" style="margin-bottom:16px;">
                <div class="ref-header">
                    <div class="ref-avatar" style="${avatarStyle}cursor:pointer;"
                         role="button" tabindex="0"
                         aria-label="View profile"
                         onclick="CommunityModule.viewMember('${user.id}')"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();CommunityModule.viewMember('${user.id}');}">
                        ${avatarInner}
                    </div>
                    <div class="ref-meta" style="flex:1;">
                        <div class="ref-author">${this._esc(name)}</div>
                        <div class="ref-time">Write a reflection...</div>
                    </div>
                </div>
                <textarea id="reflectionInput"
                          aria-label="Write a reflection"
                          placeholder="Share a reflection with the community..."
                          maxlength="${this.config.MAX_REFLECTION_LENGTH}"
                          style="width:100%;padding:10px 12px;border:1px solid var(--border);
                                 border-radius:var(--radius-md);background:var(--neuro-bg);
                                 color:var(--text);resize:none;min-height:80px;
                                 font-size:14px;line-height:1.6;box-sizing:border-box;margin-top:4px;"></textarea>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;padding-top:10px;border-top:2px solid var(--border);">
                    <span style="font-size:11px;color:var(--text-muted);"><span id="charCount">0</span>/${this.config.MAX_REFLECTION_LENGTH}</span>
                    <button type="button" onclick="CommunityModule.shareReflection()"
                            class="btn btn-primary" style="display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;padding:7px 20px;font-size:13px;">
                        Share
                    </button>
                </div>
            </div>

            <div id="reflectionsContainer"></div>
        </section>`;
    },

    // =========================================================================
    // REFLECTIONS - DATA
    // =========================================================================

    async renderReflections() {
        const container = document.getElementById('reflectionsContainer');
        if (!container) return;

        container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Loading reflections...</div>';

        try {
            const [reflections, blocked] = await Promise.all([
                CommunityDB.getReflections(20),
                CommunityDB.getBlockedUsers(),
            ]);

            const visible = reflections.filter(r => !blocked.has(r.profiles?.id));
            container.innerHTML = visible.length
                ? visible.map(r => this._buildReflectionHTML(r)).join('')
                : '<div style="color:var(--text-muted);font-size:13px;padding:16px;text-align:center">Be the first to share a reflection ✨</div>';

        } catch (err) {
            console.error('[CommunityModule] renderReflections error:', err);
        }
    },

    _buildReflectionHTML(ref) {
        const profile   = ref.profiles || {};
        const name      = profile.name      || 'Community Member';
        const avatarUrl = profile.avatar_url || '';
        const gradient  = Core.getAvatarGradient(profile.id || ref.id);
        const timeStr   = this._timeAgo(ref.created_at);
        const isOwn     = profile.id === Core?.state?.currentUser?.id;
        const isAdmin   = Core?.state?.currentUser?.is_admin === true;
        const appreciated = this.state.appreciatedReflections.has(ref.id);

        const avatarInner = avatarUrl
            ? `<img src="${avatarUrl}" alt="${this._esc(name)}" width="40" height="40" loading="lazy" decoding="async">`
            : this._esc(profile.emoji || name.charAt(0).toUpperCase());
        const avatarStyle = avatarUrl ? 'background:transparent;' : `background:${gradient};`;

        const ownerActions = isOwn ? `
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.editReflection('${ref.id}')"   class="ref-action" title="Edit"           style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></button>
                <button type="button" onclick="CommunityModule.deleteReflection('${ref.id}')" class="ref-action" title="Delete"         style="font-size:14px;opacity:0.6;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>` : isAdmin ? `
            <div style="margin-left:auto;display:flex;gap:4px;">
                <button type="button" onclick="CommunityModule.deleteReflection('${ref.id}')" class="ref-action" title="Delete (Admin)" style="font-size:14px;opacity:0.6;color:var(--neuro-accent);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>
            </div>` : '';

        return `
            <div class="reflection" data-reflection-id="${ref.id}">
                <div class="ref-header">
                    <div class="ref-avatar" style="${avatarStyle}cursor:pointer;"
                         onclick="CommunityModule.viewMember('${profile.id}')">
                        ${avatarInner}
                    </div>
                    <div class="ref-meta">
                        <div class="ref-author" style="cursor:pointer;"
                             onclick="CommunityModule.viewMember('${profile.id}')">
                            ${this._esc(name)}
                        </div>
                        <div class="ref-time">${timeStr}</div>
                    </div>
                </div>
                <div class="ref-content">${this._esc(ref.content)}</div>
                <div class="ref-actions">
                    <button type="button" class="ref-action ${appreciated ? 'appreciated' : ''}"
                            onclick="CommunityModule.appreciate(this, '${ref.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5Z"/><path d="M5 3L5.75 5.25L8 6L5.75 6.75L5 9L4.25 6.75L2 6L4.25 5.25Z"/><path d="M19 14L19.75 16.25L22 17L19.75 17.75L19 20L18.25 17.75L16 17L18.25 16.25Z"/></svg></span>
                        <span class="appreciation-count">Appreciate (${ref.appreciation_count || 0})</span>
                    </button>
                    <button type="button" class="ref-action" onclick="CommunityModule.whisper('${profile.id}')">
                        <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>Whisper</span>
                    </button>
                    ${ownerActions}
                </div>
            </div>`;
    },

    subscribeToNewReflections() {
        const sub = CommunityDB.subscribeToReflections(async (ref) => {
            if (ref.profiles?.id === Core?.state?.currentUser?.id) return; // skip own (optimistic)
            const blocked = await CommunityDB.getBlockedUsers();
            if (blocked.has(ref.profiles?.id)) return;
            this._prependReflection(ref);
        });

        if (!sub) {
            const interval = setInterval(() => {
                if (!CommunityDB?.ready) return;
                clearInterval(interval);
                this.subscribeToNewReflections();
            }, 300);
        }
    },

    // Shared helper - used by subscribeToNewReflections and shareReflection
    _prependReflection(ref) {
        const container = document.getElementById('reflectionsContainer');
        if (!container) return;
        const div = document.createElement('div');
        div.innerHTML = this._buildReflectionHTML(ref);
        const el = div.firstElementChild;
        if (el) container.insertBefore(el, container.firstChild);
    },

    // =========================================================================
    // SHARE / EDIT / DELETE REFLECTION
    // =========================================================================

    async shareReflection() {
        const input = document.getElementById('reflectionInput');
        if (!input) return;

        const text = input.value.trim();
        if (text.length < this.config.MIN_REFLECTION_LENGTH) {
            Core.showToast('Please write something first');
            return;
        }
        if (text.length > this.config.MAX_REFLECTION_LENGTH) {
            Core.showToast(`Reflection too long (max ${this.config.MAX_REFLECTION_LENGTH} characters)`);
            return;
        }

        try {
            const result = await CommunityDB.postReflection(text);
            if (!result) { Core.showToast('Could not share reflection - please try again'); return; }

            input.value = '';
            const counter = document.getElementById('charCount');
            if (counter) counter.textContent = '0';

            this._prependReflection(result);
            Core.showToast('Reflection shared with the community');

        } catch (err) {
            console.error('[CommunityModule] shareReflection error:', err);
        }
    },

    async deleteReflection(reflectionId) {
        if (!confirm('Remove this reflection?')) return;
        const ok = await CommunityDB.deleteReflection(reflectionId);
        if (ok) {
            document.querySelector(`[data-reflection-id="${reflectionId}"]`)?.remove();
            Core.showToast('Reflection removed');
        } else {
            Core.showToast('Could not remove reflection');
        }
    },

    editReflection(reflectionId) {
        const card      = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        const contentEl = card?.querySelector('.ref-content');
        if (!contentEl) return;

        const original = contentEl.textContent.trim();

        contentEl.innerHTML = `
            <textarea id="editReflectionInput_${reflectionId}" maxlength="500" rows="3"
                      style="width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);
                             background:var(--surface);color:var(--text);resize:vertical;
                             font-size:14px;line-height:1.6;box-sizing:border-box;"
            >${this._esc(original)}</textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                <span style="font-size:11px;color:var(--text-muted)">
                    <span id="editCharCount_${reflectionId}">${original.length}</span>/500
                </span>
                <div style="display:flex;gap:8px;">
                    <button type="button" onclick="CommunityModule.saveEditReflection('${reflectionId}')"
                            style="padding:5px 14px;background:var(--accent);color:#fff;border:none;
                                   border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;">Save</button>
                    <button type="button" onclick="CommunityModule.cancelEditReflection('${reflectionId}')"
                            style="padding:5px 12px;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));
                                   color:var(--neuro-text);border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;">Cancel</button>
                </div>
            </div>`;

        const ta = document.getElementById(`editReflectionInput_${reflectionId}`);
        if (ta) {
            this._setupCharCounter(`editReflectionInput_${reflectionId}`, `editCharCount_${reflectionId}`);
            ta.focus();
            ta.setSelectionRange(ta.value.length, ta.value.length);
        }
    },

    cancelEditReflection(reflectionId) {
        const card      = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        const contentEl = card?.querySelector('.ref-content');
        // Re-fetch from DB to restore accurate content
        if (contentEl) {
            CommunityDB.getReflections(20).then(all => {
                const ref = all.find(r => r.id === reflectionId);
                if (ref) contentEl.textContent = ref.content;
            }).catch(() => {}); // silent fallback - content stays as-is
        }
    },

    async saveEditReflection(reflectionId) {
        const ta = document.getElementById(`editReflectionInput_${reflectionId}`);
        if (!ta) return;

        const newText = ta.value.trim();
        if (!newText)           { Core.showToast('Reflection cannot be empty'); return; }
        if (newText.length > 500) { Core.showToast('Too long (max 500 characters)'); return; }

        ta.disabled = true;
        const ok = await CommunityDB.updateReflection(reflectionId, newText);
        if (ok) {
            const contentEl = document.querySelector(`[data-reflection-id="${reflectionId}"] .ref-content`);
            if (contentEl) contentEl.textContent = newText;
            Core.showToast('Reflection updated');
        } else {
            ta.disabled = false;
            Core.showToast('Could not update - please try again');
        }
    },

    // =========================================================================
    // APPRECIATIONS
    // =========================================================================

    async appreciate(btn, reflectionId) {
        if (!btn || !reflectionId) return;
        try {
            const wasAppreciated = this.state.appreciatedReflections.has(reflectionId);
            const result = await CommunityDB.toggleAppreciation(reflectionId, wasAppreciated);
            if (!result) return;

            this.state.appreciatedReflections[result.appreciated ? 'add' : 'delete'](reflectionId);
            btn.classList.toggle('appreciated', result.appreciated);

            const count   = await CommunityDB.getReflectionCount(reflectionId);
            const countEl = btn.querySelector('.appreciation-count');
            if (countEl && count !== null) countEl.textContent = `Appreciate (${count})`;

        } catch (err) {
            console.error('[CommunityModule] appreciate error:', err);
        }
    },

    // =========================================================================
    // WHISPERS
    // =========================================================================

    async whisper(recipientId) {
        if (!recipientId) return;
        try {
            const profile = await CommunityDB.getProfile(recipientId);
            WhisperModal.openThread(
                recipientId,
                profile?.name      || 'Member',
                profile?.emoji     || '',
                profile?.avatar_url || ''
            );
        } catch {
            WhisperModal.openThread(recipientId, 'Member', '', '');
        }
    },

    // =========================================================================
    // MEMBERS
    // =========================================================================

    // Presence handled entirely by active-members.js
    renderMembers() {},

    viewMember(userId) {
        if (!userId) return;
        if (window.MemberProfileModal) {
            MemberProfileModal.open(userId);
        } else {
            Core.showToast('Member profiles loading...');
        }
    },

    // =========================================================================
    // WAVES (stub - not yet wired to DB)
    // =========================================================================

    renderWaves() {
        const container = document.getElementById('wavesContainer');
        if (!container) return;
        const waves = [
            { id: 1, title: 'Evening Wind Down',        time: 'Tonight at 8:00 PM',  participants: 42, progress: 67 },
            { id: 2, title: 'Sunday Morning Stillness', time: 'Tomorrow at 7:00 AM', participants: 28, progress: 45 },
        ];
        container.innerHTML = waves.map(w => `
            <div class="wave-card" data-wave-id="${w.id}">
                <div class="wave-header">
                    <div>
                        <div class="wave-title">${this._esc(w.title)}</div>
                        <div class="wave-meta">${this._esc(w.time)} • ${w.participants} joined</div>
                    </div>
                </div>
                <div class="prog-bar">
                    <div class="prog-fill" style="width:${Math.min(100, Math.max(0, w.progress))}%"></div>
                </div>
                <button type="button" class="contrib-btn" onclick="CommunityModule.contributeWave(${w.id})">
                    Contribute 20 Minutes
                </button>
            </div>`).join('');
    },

    contributeWave() {
        Core.showToast('Contribution recorded! Start your practice.');
    },

    // =========================================================================
    // SAFETY & MODERATION
    // =========================================================================

    showCrisisModal()  { this.openModal('crisisModal'); },
    closeCrisisModal() { this.closeModal('crisisModal'); },

    showReportModal(userId = null) {
        this.state.reportingUserId = userId;
        this.openModal('reportModal');
    },
    closeReportModal() {
        this.closeModal('reportModal');
        this._clearFields(['reportReason', 'reportDetails']);
        this.state.reportingUserId = null;
    },

    async submitReport() {
        const reason  = document.getElementById('reportReason')?.value;
        const details = document.getElementById('reportDetails')?.value?.trim() || '';
        if (!reason) { Core.showToast('Please select a reason'); return; }

        const ok = await CommunityDB.submitReport(this.state.reportingUserId, reason, details);
        if (ok) {
            Core.showToast('Report submitted. Thank you for keeping the space safe.');
            this.closeReportModal();
        } else {
            Core.showToast('Could not submit report - please try again');
        }
    },

    showBlockModal()  { this.openModal('blockModal'); },
    closeBlockModal() {
        this.closeModal('blockModal');
        this._clearFields(['blockUsername']);
    },

    async confirmBlock() {
        const username = document.getElementById('blockUsername')?.value?.trim();
        if (!username) { Core.showToast('Please enter a username'); return; }

        const data = await CommunityDB.getUserByName(username);
        if (!data) { Core.showToast('User not found'); return; }

        const ok = await CommunityDB.blockUser(data.id);
        if (ok) {
            Core.showToast(`${data.name} has been blocked`);
            this.closeBlockModal();
            await this.renderReflections();
        } else {
            Core.showToast('Could not block user - please try again');
        }
    },

    hideMessagesFromUser(username) {
        document.querySelectorAll('.chat-msg').forEach(msg => {
            if (msg.querySelector('div')?.textContent.includes(username)) {
                msg.style.display = 'none';
            }
        });
    },

    showHelpModal()  { this.openModal('helpModal'); },
    closeHelpModal() { this.closeModal('helpModal'); },
    needHelp()       { this.showHelpModal(); },

    showModeratorModal()  { this.closeHelpModal(); this.openModal('moderatorModal'); },
    closeModeratorModal() {
        this.closeModal('moderatorModal');
        this._clearFields(['moderatorMessage']);
        const u = document.getElementById('moderatorUrgency');
        if (u) u.value = 'low';
    },
    contactModerator() { this.showModeratorModal(); },

    submitModeratorRequest() {
        const message = document.getElementById('moderatorMessage')?.value?.trim();
        if (!message || message.length < this.config.MIN_MODERATOR_MESSAGE_LENGTH) {
            Core.showToast(`Please describe your situation (at least ${this.config.MIN_MODERATOR_MESSAGE_LENGTH} characters)`);
            return;
        }
        Core.showToast('Request sent. A moderator will reach out shortly.');
        this.closeModeratorModal();
    },

    showTechnicalModal()  { this.closeHelpModal(); this.openModal('technicalModal'); },
    closeTechnicalModal() {
        this.closeModal('technicalModal');
        this._clearFields(['technicalType', 'technicalDescription', 'technicalDevice']);
    },
    reportTechnicalIssue() { this.showTechnicalModal(); },

    submitTechnicalIssue() {
        const type        = document.getElementById('technicalType')?.value;
        const description = document.getElementById('technicalDescription')?.value?.trim();
        if (!type) { Core.showToast('Please select an issue type'); return; }
        if (!description || description.length < this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH) {
            Core.showToast(`Please provide more details (at least ${this.config.MIN_TECHNICAL_DESCRIPTION_LENGTH} characters)`);
            return;
        }
        Core.showToast('Issue reported. Our tech team will investigate.');
        this.closeTechnicalModal();
    },

    showGuidelinesModal()  { this.closeHelpModal(); this.openModal('guidelinesModal'); },
    closeGuidelinesModal() { this.closeModal('guidelinesModal'); },
    viewGuidelines()       { this.showGuidelinesModal(); },

    // =========================================================================
    // CHAT
    // =========================================================================

    muteChat() {
        const sidebar = document.getElementById('psSidebar');
        if (!sidebar) return;
        const isMuted = sidebar.classList.contains('muted');
        sidebar.classList.toggle('muted');
        Core.showToast(isMuted ? 'Chat unmuted' : 'Chat muted');
        if (!isMuted && sidebar.classList.contains('open')) {
            // Close the sidebar when muting
            sidebar.classList.remove('open');
            document.getElementById('fabChat')?.classList.remove('hidden');
        }
    },

    // =========================================================================
    // EVENTS
    // =========================================================================

    registerEvent() {
        Core.showToast('Registration confirmed! Check your email.');
    },

    // =========================================================================
    // MODAL UTILITIES
    // =========================================================================

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
        else console.warn(`[CommunityModule] Modal not found: ${id}`);
    },

    closeModal(id) {
        document.getElementById(id)?.classList.remove('active');
    },

    // =========================================================================
    // UTILITIES
    // =========================================================================

    _setupCharCounter(inputId, counterId) {
        const input   = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        if (input && counter) {
            input.addEventListener('input', () => { counter.textContent = input.value.length; });
        }
    },

    // Clear value on a list of element IDs
    _clearFields(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    },

    _timeAgo(iso) {
        if (!iso) return '';
        const diff  = Date.now() - new Date(iso).getTime();
        const mins  = Math.floor(diff / 60_000);
        const hours = Math.floor(diff / 3_600_000);
        const days  = Math.floor(diff / 86_400_000);
        if (mins  < 1)  return 'Just now';
        if (mins  < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    },

    _esc(str) {
        if (!str || typeof str !== 'string') return '';
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    },
};

// core.js calls CommunityModule.init() after CommunityDB is ready

// Window bridge: preserved for external callers
window.CommunityModule = CommunityModule;

export { CommunityModule };
