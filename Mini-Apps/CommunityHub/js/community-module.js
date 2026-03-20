/**
 * COMMUNITY MODULE
 * Reflections, appreciations, whispers, reports, blocks - Supabase integrated
 * @version 2.2.0
 */

import { CommunityDB } from './community-supabase.js';

// XSS escape helper
function esc(v) {
    return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const CommunityModule = {

    // =========================================================================
    // STATE & CONFIG
    // =========================================================================

    state: {
        isInitialized:          false,
        appreciatedReflections: new Set(),
        reportingUserId:        null,
    },

    config: Object.freeze({
        MIN_REFLECTION_LENGTH:             1,
        MAX_REFLECTION_LENGTH:           500,
        MIN_REPORT_LENGTH:                10,
        MIN_MODERATOR_MESSAGE_LENGTH:     10,
        MIN_TECHNICAL_DESCRIPTION_LENGTH: 10,
    }),

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
            console.error('[CommunityModule] init failed');
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
        const userId    = user.id || '';

        const avatarInner = avatarUrl
            ? `<img src="${esc(avatarUrl)}" alt="${esc(name)}" width="40" height="40" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" loading="lazy" decoding="async">`
            : (user.emoji ? esc(user.emoji) : esc(name.charAt(0).toUpperCase()));
        const avatarStyle = avatarUrl ? 'background:transparent;' : `background:${esc(gradient)};`;

        return `
        <section class="section" aria-labelledby="communityReflectionsTitle">
            <div class="section-header">
                <div class="section-title" id="communityReflectionsTitle">Community Reflections</div>
                <div style="font-size:12px;color:var(--text-muted);">Shared wisdom &amp; moments</div>
            </div>

            <div class="reflection" style="margin-bottom:16px;">
                <div class="ref-header">
                    <div class="ref-avatar" style="${avatarStyle}cursor:pointer;"
                         role="button" tabindex="0"
                         aria-label="View your profile"
                         data-view-member="${esc(userId)}"
                         onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();CommunityModule.viewMember(this.dataset.viewMember);}">
                        ${avatarInner}
                    </div>
                    <div class="ref-meta" style="flex:1;">
                        <div class="ref-author">${esc(name)}</div>
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
                    <button type="button" id="shareReflectionBtn"
                            class="btn btn-primary" style="padding:7px 20px;font-size:13px;">
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

        const loading = document.createElement('div');
        loading.style.cssText = 'color:var(--text-muted);font-size:13px;padding:16px;text-align:center';
        loading.textContent = 'Loading reflections...';
        container.innerHTML = '';
        container.appendChild(loading);

        try {
            const [reflections, blocked] = await Promise.all([
                CommunityDB.getReflections(20),
                CommunityDB.getBlockedUsers(),
            ]);

            const visible = reflections.filter(r => !blocked.has(r.profiles?.id));
            container.innerHTML = '';

            if (visible.length) {
                visible.forEach(r => this._appendReflection(container, r));
            } else {
                const empty = document.createElement('div');
                empty.style.cssText = 'color:var(--text-muted);font-size:13px;padding:16px;text-align:center';
                empty.textContent = 'Be the first to share a reflection ✨';
                container.appendChild(empty);
            }

        } catch (err) {
            console.error('[CommunityModule] renderReflections error');
        }
    },

    _appendReflection(container, ref, prepend = false) {
        const el = this._buildReflectionElement(ref);
        if (!el) return;
        if (prepend && container.firstChild) {
            container.insertBefore(el, container.firstChild);
        } else {
            container.appendChild(el);
        }
    },

    _buildReflectionElement(ref) {
        if (!ref) return null;

        const profile    = ref.profiles || {};
        const name       = profile.name      || 'Community Member';
        const avatarUrl  = profile.avatar_url || '';
        const gradient   = Core.getAvatarGradient(profile.id || ref.id);
        const timeStr    = this._timeAgo(ref.created_at);
        const isOwn      = profile.id === Core?.state?.currentUser?.id;
        const isAdmin    = Core?.state?.currentUser?.is_admin === true;
        const appreciated = this.state.appreciatedReflections.has(ref.id);
        const profileId  = profile.id || '';

        const card = document.createElement('div');
        card.className = 'reflection';
        card.dataset.reflectionId = ref.id;

        // Header
        const header = document.createElement('div');
        header.className = 'ref-header';

        const avatarEl = document.createElement('div');
        avatarEl.className = 'ref-avatar';
        avatarEl.style.cssText = (avatarUrl ? 'background:transparent;' : `background:${gradient};`) + 'cursor:pointer;';
        avatarEl.setAttribute('role', 'button');
        avatarEl.setAttribute('tabindex', '0');
        avatarEl.setAttribute('aria-label', `View ${name}'s profile`);
        avatarEl.addEventListener('click', () => CommunityModule.viewMember(profileId));
        avatarEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); CommunityModule.viewMember(profileId); }
        });

        if (avatarUrl) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = name;
            img.width = 40;
            img.height = 40;
            img.loading = 'lazy';
            img.decoding = 'async';
            avatarEl.appendChild(img);
        } else {
            avatarEl.textContent = profile.emoji || name.charAt(0).toUpperCase();
        }

        const meta = document.createElement('div');
        meta.className = 'ref-meta';

        const authorEl = document.createElement('div');
        authorEl.className = 'ref-author';
        authorEl.style.cursor = 'pointer';
        authorEl.textContent = name;
        authorEl.addEventListener('click', () => CommunityModule.viewMember(profileId));

        const timeEl = document.createElement('div');
        timeEl.className = 'ref-time';
        timeEl.textContent = timeStr;

        meta.appendChild(authorEl);
        meta.appendChild(timeEl);
        header.appendChild(avatarEl);
        header.appendChild(meta);

        // Owner / admin actions
        if (isOwn || isAdmin) {
            const actionsDiv = document.createElement('div');
            actionsDiv.style.cssText = 'margin-left:auto;display:flex;gap:4px;';

            if (isOwn) {
                const editBtn = document.createElement('button');
                editBtn.type = 'button';
                editBtn.className = 'ref-action';
                editBtn.title = 'Edit';
                editBtn.setAttribute('aria-label', 'Edit reflection');
                editBtn.style.cssText = 'font-size:14px;opacity:0.6;';
                editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>';
                editBtn.addEventListener('click', () => CommunityModule.editReflection(ref.id));
                actionsDiv.appendChild(editBtn);
            }

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'ref-action';
            delBtn.title = isAdmin && !isOwn ? 'Delete (Admin)' : 'Delete';
            delBtn.setAttribute('aria-label', 'Delete reflection');
            delBtn.style.cssText = 'font-size:14px;opacity:0.6;' + (isAdmin && !isOwn ? 'color:var(--neuro-accent);' : '');
            delBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>';
            delBtn.addEventListener('click', () => CommunityModule.deleteReflection(ref.id));
            actionsDiv.appendChild(delBtn);

            header.appendChild(actionsDiv);
        }

        card.appendChild(header);

        // Content
        const contentEl = document.createElement('div');
        contentEl.className = 'ref-content';
        contentEl.textContent = ref.content;  // textContent — safe, no XSS
        card.appendChild(contentEl);

        // Actions row
        const actionsRow = document.createElement('div');
        actionsRow.className = 'ref-actions';

        const appreciateBtn = document.createElement('button');
        appreciateBtn.type = 'button';
        appreciateBtn.className = `ref-action${appreciated ? ' appreciated' : ''}`;
        appreciateBtn.setAttribute('aria-label', 'Appreciate this reflection');
        appreciateBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v.01"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.828.006L12 15"/><path d="M20.2 20.2 22 22"/><circle cx="18" cy="6" r="3"/></svg></span>`;
        const countSpan = document.createElement('span');
        countSpan.className = 'appreciation-count';
        countSpan.textContent = `Appreciate (${ref.appreciation_count || 0})`;
        appreciateBtn.appendChild(countSpan);
        appreciateBtn.addEventListener('click', () => CommunityModule.appreciate(appreciateBtn, ref.id));

        const whisperBtn = document.createElement('button');
        whisperBtn.type = 'button';
        whisperBtn.className = 'ref-action';
        whisperBtn.setAttribute('aria-label', `Whisper to ${name}`);
        whisperBtn.innerHTML = `<span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span><span>Whisper</span>`;
        whisperBtn.addEventListener('click', () => CommunityModule.whisper(profileId));

        actionsRow.appendChild(appreciateBtn);
        actionsRow.appendChild(whisperBtn);
        card.appendChild(actionsRow);

        return card;
    },

    subscribeToNewReflections() {
        const sub = CommunityDB.subscribeToReflections(async (ref) => {
            if (ref.profiles?.id === Core?.state?.currentUser?.id) return;
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

    _prependReflection(ref) {
        const container = document.getElementById('reflectionsContainer');
        if (!container) return;
        this._appendReflection(container, ref, true);
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
            console.error('[CommunityModule] shareReflection error');
        }
    },

    async deleteReflection(reflectionId) {
        if (!reflectionId) return;
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
        if (!reflectionId) return;
        const card      = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        const contentEl = card?.querySelector('.ref-content');
        if (!contentEl) return;

        const original = contentEl.textContent.trim();

        // Build edit UI via DOM API
        contentEl.innerHTML = '';

        const ta = document.createElement('textarea');
        ta.id = `editReflectionInput_${reflectionId}`;
        ta.maxLength = 500;
        ta.rows = 3;
        ta.value = original;
        ta.style.cssText = 'width:100%;padding:8px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);color:var(--text);resize:vertical;font-size:14px;line-height:1.6;box-sizing:border-box;';

        const meta = document.createElement('div');
        meta.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:6px;';

        const counterSpan = document.createElement('span');
        counterSpan.style.cssText = 'font-size:11px;color:var(--text-muted)';

        const countEl = document.createElement('span');
        countEl.id = `editCharCount_${reflectionId}`;
        countEl.textContent = original.length;
        counterSpan.appendChild(countEl);
        const limitSpan = document.createElement('span');
        limitSpan.textContent = '/500';
        counterSpan.appendChild(limitSpan);

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:8px;';

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.textContent = 'Save';
        saveBtn.style.cssText = 'padding:5px 14px;background:var(--accent);color:#fff;border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;font-weight:600;';
        saveBtn.addEventListener('click', () => CommunityModule.saveEditReflection(reflectionId));

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = 'padding:5px 12px;background:var(--neuro-shadow-light,rgba(0,0,0,0.06));color:var(--neuro-text);border:none;border-radius:var(--radius-md);cursor:pointer;font-size:13px;';
        cancelBtn.addEventListener('click', () => CommunityModule.cancelEditReflection(reflectionId));

        btnRow.appendChild(saveBtn);
        btnRow.appendChild(cancelBtn);
        meta.appendChild(counterSpan);
        meta.appendChild(btnRow);

        contentEl.appendChild(ta);
        contentEl.appendChild(meta);

        this._setupCharCounter(`editReflectionInput_${reflectionId}`, `editCharCount_${reflectionId}`);
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
    },

    cancelEditReflection(reflectionId) {
        if (!reflectionId) return;
        const card      = document.querySelector(`[data-reflection-id="${reflectionId}"]`);
        const contentEl = card?.querySelector('.ref-content');
        if (contentEl) {
            CommunityDB.getReflections(20).then(all => {
                const ref = all.find(r => r.id === reflectionId);
                if (ref) contentEl.textContent = ref.content;
            }).catch(() => {});
        }
    },

    async saveEditReflection(reflectionId) {
        if (!reflectionId) return;
        const ta = document.getElementById(`editReflectionInput_${reflectionId}`);
        if (!ta) return;

        const newText = ta.value.trim();
        if (!newText)             { Core.showToast('Reflection cannot be empty'); return; }
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
            console.error('[CommunityModule] appreciate error');
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
                profile?.name       || 'Member',
                profile?.emoji      || '',
                profile?.avatar_url || ''
            );
        } catch {
            WhisperModal.openThread(recipientId, 'Member', '', '');
        }
    },

    // =========================================================================
    // MEMBERS
    // =========================================================================

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
    // WAVES (stub)
    // =========================================================================

    renderWaves() {
        const container = document.getElementById('wavesContainer');
        if (!container) return;
        const waves = [
            { id: 1, title: 'Evening Wind Down',        time: 'Tonight at 8:00 PM',  participants: 42, progress: 67 },
            { id: 2, title: 'Sunday Morning Stillness', time: 'Tomorrow at 7:00 AM', participants: 28, progress: 45 },
        ];
        container.innerHTML = '';
        waves.forEach(w => {
            const card = document.createElement('div');
            card.className = 'wave-card';
            card.dataset.waveId = w.id;

            const headerDiv = document.createElement('div');
            headerDiv.className = 'wave-header';
            const titleDiv = document.createElement('div');
            const titleEl = document.createElement('div');
            titleEl.className = 'wave-title';
            titleEl.textContent = w.title;
            const metaEl = document.createElement('div');
            metaEl.className = 'wave-meta';
            metaEl.textContent = `${w.time} • ${w.participants} joined`;
            titleDiv.appendChild(titleEl);
            titleDiv.appendChild(metaEl);
            headerDiv.appendChild(titleDiv);

            const progBar = document.createElement('div');
            progBar.className = 'prog-bar';
            const progFill = document.createElement('div');
            progFill.className = 'prog-fill';
            progFill.style.width = `${Math.min(100, Math.max(0, w.progress))}%`;
            progBar.appendChild(progFill);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'contrib-btn';
            btn.textContent = 'Contribute 20 Minutes';
            btn.addEventListener('click', () => CommunityModule.contributeWave(w.id));

            card.appendChild(headerDiv);
            card.appendChild(progBar);
            card.appendChild(btn);
            container.appendChild(card);
        });
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
        if (!username || username.length > 120) { Core.showToast('Please enter a username'); return; }

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
        if (!username || typeof username !== 'string') return;
        document.querySelectorAll('.chat-msg').forEach(msg => {
            const nameEl = msg.querySelector('div');
            if (nameEl?.textContent.includes(username)) {
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

    _esc: esc,
};

// Wire share button after DOM build (delegated from renderReflectionsHTML)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'shareReflectionBtn') {
        CommunityModule.shareReflection();
    }
    // Avatar click delegation
    const avatarEl = e.target.closest('[data-view-member]');
    if (avatarEl) {
        CommunityModule.viewMember(avatarEl.dataset.viewMember);
    }
});

window.CommunityModule = CommunityModule;

// bfcache: reset init state so module re-initialises on next visit
window.addEventListener('pagehide', () => {
    CommunityModule.state.isInitialized = false;
});

export { CommunityModule };
