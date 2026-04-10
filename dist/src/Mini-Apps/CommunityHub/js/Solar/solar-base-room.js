/**
 * SOLAR-BASE-ROOM.JS
 * Base prototype for all seasonal solar practice rooms.
 * Season rooms use Object.create(BaseSolarRoom) and override only
 * config, prebuiltAffirmations, practices, and content getters.
 */

import { SOLAR_CONSTANTS, SolarConfig } from './solar-config.js';
import { SolarUIManager } from './solar-ui.js';
import { SolarEngine } from './solarengine.js';
import { Core } from '../core.js';
import { CommunityDB } from '../community-supabase.js';

const BaseSolarRoom = {

  // ── Overridden by each season room ─────────────────────────────────────────
  config:               {},
  practices:            {},
  prebuiltAffirmations: [],

  // ── Shared defaults ────────────────────────────────────────────────────────
  userData: {
    intention:        '',
    affirmation:      '',
    releaseList:      '',
    practiceCount:    0,
    closureReflection:'',
    completedDate:    null,
    privateIntention: '',
    collectiveWord:   '',
    intentionShared:  false,
  },

  isActive:          false,
  startDate:         null,
  endDate:           null,
  collectiveTimer:   null,
  saveDebounceTimer: null,
  eventListeners:    [],

  CONSTANTS: {
    MAX_INTENTION_LENGTH:   500,
    MAX_AFFIRMATION_LENGTH: 300,
    MAX_RELEASE_LIST_LENGTH:1000,
    SAVE_DEBOUNCE_MS:       500,
  },

  // ============================================================================
  // UTILITIES
  // ============================================================================

  _sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .slice(0, 1000)
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<object[^>]*>.*?<\/object>/gi, '');
  },

  _escapeHtml: t => SolarConfig.escapeHtml(t),

  _removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) =>
      element?.removeEventListener(event, handler)
    );
    this.eventListeners = [];
  },

  _clearTimer() {
    if (this.collectiveTimer) {
      clearInterval(this.collectiveTimer);
      this.collectiveTimer = null;
    }
  },

  cleanup() {
    this._clearTimer();
    this._removeEventListeners();
    clearTimeout(this.saveDebounceTimer);
    this.saveDebounceTimer = null;
    this._unsubPresence();
    this._unsubCollectiveWords();
  },

  _unsubPresence() {
    try { this._presenceSub?.unsubscribe(); } catch(e) {}
    this._presenceSub = null;
  },

  _unsubCollectiveWords() {
    try { this._collectiveWordsSub?.unsubscribe(); } catch(e) {}
    this._collectiveWordsSub = null;
  },

  // ============================================================================
  // SHARED COUNTDOWN TIMER
  // ============================================================================

  _startCountdownTimer(timerElId, startBtnId, seconds, onComplete) {
    try {
      document.getElementById(startBtnId)?.style && (document.getElementById(startBtnId).style.display = 'none');
      const display = document.getElementById(timerElId);
      if (!display) return;
      display.setAttribute('role', 'timer');
      display.setAttribute('aria-live', 'off');

      let timeLeft = seconds;
      this._clearTimer();

      this.collectiveTimer = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        display.textContent = `${m}:${String(s).padStart(2, '0')}`;

        if (timeLeft <= 0) {
          this._clearTimer();
          display.textContent = 'Complete';
          onComplete?.();
        }
      }, 1000);
    } catch (err) {
      console.error('[BaseSolarRoom] _startCountdownTimer error:', err);
      this._clearTimer();
    }
  },

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  init() {
    try {
      this.checkIfActive();
      if (this.isActive) {
        this.calculateDates();
        this.loadData();
      }
    } catch (err) {
      console.error(`${this.config.displayName} init error:`, err);
    }
  },

  checkIfActive() {
    if (Core?.state?.currentUser?.is_admin === true) {
      this.isActive = true;
      return;
    }

    const now  = new Date();
    const year = now.getFullYear();
    const name = this.config.name;

    const curr = SolarEngine.getSeasonDates(year)[name];
    if (now >= curr.start && now <= curr.end) { this.isActive = true; return; }

    const prev = SolarEngine.getSeasonDates(year - 1)[name];
    this.isActive = now >= prev.start && now <= prev.end;
  },

  calculateDates() {
    const now  = new Date();
    const name = this.config.name;
    const prev = SolarEngine.getSeasonDates(now.getFullYear() - 1)[name];

    if (now >= prev.start && now <= prev.end) {
      this.startDate = prev.start;
      this.endDate   = prev.end;
      return;
    }

    const curr    = SolarEngine.getSeasonDates(now.getFullYear())[name];
    this.startDate = curr.start;
    this.endDate   = curr.end;
  },

  loadData() {
    const saved = SolarUIManager.storage.get(this.config.name);
    if (saved && new Date(saved.seasonStartDate).getTime() === this.startDate?.getTime()) {
      this.userData = saved.data;
    }
  },

  saveData() {
    const ok = SolarUIManager.storage.set(this.config.name, {
      seasonStartDate: this.startDate.toISOString(),
      data: this.userData,
    });
    if (!ok) SolarUIManager.showToast('Could not save data. Check storage limits.');
  },

  // ============================================================================
  // ROOM ENTER / LEAVE
  // ============================================================================

  enterRoom() {
    const isAdmin = Core?.state?.currentUser?.is_admin === true;
    if (!this.isActive && !isAdmin) {
      SolarUIManager.showToast(`${this.config.emoji} ${this.config.displayName} room opens during ${this.config.displayName.toLowerCase()} season`);
      return;
    }
    if (!this.startDate) this.calculateDates();

    Core?.navigateTo?.('practiceRoomView');
    window.PracticeRoom?.stopHubPresence?.();
    document.body.classList.add('solar-room-active');

    this.renderDashboard();
    this._setPresence();
    this._loadCollectiveWords();
  },

  leaveRoom() {
    try {
      this._clearPresence();
      this._unsubPresence();
      this._unsubCollectiveWords();
      this._clearTimer();
      this._removeEventListeners();
      document.body.classList.remove('solar-room-active');
      window.currentSolarRoom = null;
      window.PracticeRoom?.startHubPresence?.();
      Core?.navigateTo?.('hubView');
    } catch (err) {
      console.error('Error leaving solar room:', err);
    }
  },

  // ============================================================================
  // RENDER DASHBOARD
  // ============================================================================

  renderDashboard() {
    SolarUIManager.injectStyles();

    const container = document.getElementById('dynamicRoomContent');
    if (!container) { console.error('dynamicRoomContent not found'); return; }

    document.body.setAttribute('data-season', this.config.name);
    window.currentSolarRoom = this;

    const daysRemaining = SolarUIManager.utils.calculateDaysRemaining(this.endDate);
    const daysText      = `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`;
    const imageUrl      = `${SOLAR_CONSTANTS.IMAGE_BASE_URL}${this.config.displayName}.webp`;
    const presence      = this.getLivingPresenceCount();

    container.innerHTML = `
      <div class="solar-room-bg">
        <div class="solar-floating-bg">
          ${SolarUIManager.utils.generateFloatingElements(this.config.floatingEmojis)}
        </div>

        ${SolarUIManager.renderers.topBar({
          seasonName: this.config.displayName,
          emoji: this.config.emoji,
          daysText,
          livingPresenceCount: presence,
        })}

        <div class="solar-content-wrapper">
          <div class="solar-sun-visual">
            <div class="solar-sun-glow"><div class="solar-sun-sphere"></div></div>
          </div>

          <div class="solar-intro-card">
            <picture>
              <source srcset="${imageUrl}" type="image/webp">
              <img src="${imageUrl.replace('.webp', '.png')}" alt="${this.config.displayName} Season"
                   width="600" height="400" class="solar-season-img" loading="lazy" decoding="async">
            </picture>
            <p>${this.config.wisdom}</p>
          </div>

          ${SolarUIManager.renderers.modeToggle()}

          <div id="soloContent" class="solar-mode-content">
            <div class="solar-mode-description">
              <h3>Your Sacred Space</h3>
              <p>${this.config.modeDescription || 'Individual practices for this season'}</p>
            </div>
            <div class="solar-practices-grid" id="practicesGrid">
              ${Object.values(this.practices).map(p =>
                SolarUIManager.renderers.practiceCard(p, this.isPracticeLocked(p))
              ).join('')}
            </div>
            ${SolarUIManager.renderers.savedInputs(this.userData, this.config.displayName)}
          </div>

          <div id="groupContent" class="solar-mode-content" style="display:none;">
            ${SolarUIManager.renderers.groupPractice({
              seasonEmoji:    this.config.seasonEmoji,
              seasonName:     this.config.displayName,
              presenceCount:  presence,
              itemEmoji:      this.config.itemEmoji,
              sessionTimes:   this.config.sessionTimes,
              collectiveFocus:this.config.collectiveFocus,
              collectiveNoun: this.config.collectiveNoun,
            })}
          </div>

          ${daysRemaining <= 7 ? SolarUIManager.renderers.closureSection(this.config.closure) : ''}
        </div>
      </div>`;

    this._attachEventListeners(container);
    setTimeout(() => this._refreshLivePresence(), 300);
  },

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  _attachEventListeners(container) {
    try {
      this._removeEventListeners();

      const register = (element, event, handler) => {
        if (!element) return;
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
      };

      const grid = container.querySelector('#practicesGrid');
      const cardHandler = e => {
        const card = e.target.closest('.solar-practice-card');
        if (!card) return;
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        if (e.type === 'keydown') e.preventDefault();
        card.dataset.locked === 'true'
          ? SolarUIManager.showToast('Complete the first practice to unlock others')
          : this.showPracticePopup(card.dataset.practice);
      };
      register(grid, 'click', cardHandler);
      register(grid, 'keydown', cardHandler);

      register(container.querySelector('.solar-mode-toggle'), 'click', e => {
        const btn = e.target.closest('.solar-mode-btn');
        if (btn?.dataset.mode) SolarUIManager.switchMode(btn.dataset.mode);
      });

      const closureBtn = container.querySelector('[data-action="submit-closure"]');
      register(closureBtn, 'click', () => this.submitClosure());

    } catch (err) {
      console.error('Error attaching event listeners:', err);
    }
  },

  // ============================================================================
  // PRACTICE POPUP
  // ============================================================================

  isPracticeLocked: () => false,

  getPracticeContent(practiceId) {
    const method = `get${practiceId.charAt(0).toUpperCase()}${practiceId.slice(1)}Content`;
    if (typeof this[method] === 'function') return this[method]();
    console.error(`[BaseSolarRoom] Content method ${method} not found for ${practiceId}`);
    return '<div class="solar-popup-section"><p>Practice content not available.</p></div>';
  },

  showPracticePopup(practiceId) {
    try {
      const practice = this.practices[practiceId];
      if (!practice) { console.error(`Practice ${practiceId} not found`); return; }

      const popup = document.createElement('div');
      popup.id = 'practicePopup';
      popup.innerHTML = SolarUIManager.renderers.popup({
        title:         practice.title,
        content:       this.getPracticeContent(practiceId),
        hasSaveButton: !!practice.hasSaveData,
      });

      (document.getElementById('communityHubFullscreenContainer') || document.body).appendChild(popup);
      this._attachPopupListeners(popup, practiceId);
    } catch (err) {
      console.error('Error showing practice popup:', err);
    }
  },

  _attachPopupListeners(popup, practiceId) {
    try {
      popup.querySelectorAll('.solar-affirmation-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const el = document.getElementById('affirmationText');
          if (el) el.value = btn.dataset.affirmation;
        });
      });

      popup.querySelector('[data-action="save-practice"]')?.addEventListener('click', () => this.savePractice(practiceId));
      popup.querySelectorAll('[data-action="close-popup"]').forEach(btn =>
        btn.addEventListener('click', () => SolarUIManager.closePracticePopup())
      );
    } catch (err) {
      console.error('Error attaching popup listeners:', err);
    }
  },

  savePractice(practiceId) {
    try {
      const practice = this.practices[practiceId];
      if (!practice?.hasSaveData) return;

      const get = id => {
        const el = document.getElementById(id);
        return el ? this._sanitizeInput(el.value) : null;
      };

      const intention   = get('intentionText');
      const affirmation = get('affirmationText');
      const releaseList = get('releaseListText');

      if (intention   !== null) this.userData.intention   = intention;
      if (affirmation !== null) this.userData.affirmation = affirmation;
      if (releaseList !== null) this.userData.releaseList = releaseList;

      this.userData.practiceCount++;
      this.saveData();

      SolarUIManager.showToast('Practice saved');
      SolarUIManager.closePracticePopup();
      this.renderDashboard();
    } catch (err) {
      console.error('Error saving practice:', err);
      SolarUIManager.showToast('Failed to save practice');
    }
  },

  submitClosure() {
    const el = document.getElementById('closureReflection');
    if (!el) { SolarUIManager.showToast('Reflection field not found'); return; }

    const reflection = el.value.trim();
    if (!reflection) { SolarUIManager.showToast('Please write your closing reflection'); return; }
    if (reflection.length < SOLAR_CONSTANTS.MIN_REFLECTION_LENGTH) {
      SolarUIManager.showToast(`Please write at least ${SOLAR_CONSTANTS.MIN_REFLECTION_LENGTH} characters`);
      return;
    }

    this.userData.closureReflection = reflection;
    this.userData.completedDate     = new Date().toISOString();
    this.saveData();

    SolarUIManager.showToast(`${this.config.emoji} ${this.config.displayName} season complete. Rest well until the next cycle.`);
    setTimeout(() => this.init(), 1000);
  },

  // ============================================================================
  // GROUP CIRCLE / COLLECTIVE PRACTICE
  // ============================================================================

  showCollectiveIntentionPopup() {
    try {
      const popup = document.createElement('div');
      popup.id = 'collectivePopup';
      popup.className = 'solar-practice-popup';
      popup.innerHTML = `
        <div class="solar-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="collectivePopupTitle">
          <div class="solar-popup-content" onclick="event.stopPropagation()">
            <div class="solar-popup-header">
              <h2 id="collectivePopupTitle">${this.config.seasonEmoji} ${this.config.displayName} Group Circle</h2>
              <button type="button" class="solar-popup-close" aria-label="Close group circle" data-close-collective>×</button>
            </div>
            <div class="solar-popup-body" id="collectiveIntentionContent">
              ${this._renderCollectiveStep1()}
            </div>
          </div>
        </div>`;
      // Close on overlay click or close button
      popup.querySelector('.solar-popup-overlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) popup.remove();
      });
      popup.querySelector('[data-close-collective]').addEventListener('click', () => popup.remove());
      (document.getElementById('communityHubFullscreenContainer') || document.body).appendChild(popup);
    } catch (err) {
      console.error('Error showing collective popup:', err);
    }
  },

  _renderCollectiveStep1() {
    const count      = this.getLivingPresenceCount();
    const avatarHTML = this._cachedParticipants ? this._buildRealAvatars(this._cachedParticipants) : '';
    return `
      <div class="solar-popup-section" style="text-align:center;">
        <div class="solar-live-badge" style="margin-bottom:1rem;">
          <div class="solar-pulse-dot"></div>
          <span id="solarCollectivePresenceBadge">${count} practitioners in circle now</span>
        </div>
        ${avatarHTML ? `<div id="solarCollectiveAvatars" style="display:flex;gap:6px;justify-content:center;margin-bottom:2rem;">${avatarHTML}</div>` : ''}
        <h3>Welcome to the ${this.config.displayName} Circle</h3>
        <p style="margin:1.5rem 0;">This is a shared practice for ${this.config.collectiveFocus || 'seasonal alignment'}.</p>
        <p>You will be guided through 5 steps:</p>
        <ol style="text-align:left;max-width:500px;margin:2rem auto;line-height:1.8;">
          <li>Silent meditation (3 minutes)</li>
          <li>Write your private seasonal intention</li>
          <li>Choose one word for the collective field</li>
          <li>Witness the collective ${this.config.collectiveNoun || 'energy'}</li>
          <li>Silent witnessing (2 minutes)</li>
        </ol>
        <button class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep2()">Begin Practice</button>
      </div>`;
  },

  startCollectiveStep2() {
    try {
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      content.innerHTML = `
        <div class="solar-popup-section" style="text-align:center;">
          <h3>Step 1: Silent Meditation</h3>
          <p>Take 3 minutes to center yourself in the ${this.config.displayName} energy.</p>
          <div id="meditationTimer" class="solar-timer-display">3:00</div>
          <button type="button" id="startMeditationBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.startMeditationTimer()">Begin Meditation</button>
          <button type="button" id="skipToIntentionBtn" class="solar-popup-btn solar-btn-secondary"
                  onclick="window.currentSolarRoom.startCollectiveStep3()"
                  style="display:none;margin-top:1rem;">Continue to Intention</button>
        </div>`;
    } catch (err) { console.error('Error starting step 2:', err); }
  },

  startMeditationTimer() {
    this._startCountdownTimer('meditationTimer', 'startMeditationBtn', 180, () => {
      const skip = document.getElementById('skipToIntentionBtn');
      if (skip) { skip.textContent = 'Continue to Intention'; skip.style.display = 'block'; }
    });
    setTimeout(() => {
      const skip = document.getElementById('skipToIntentionBtn');
      if (skip) skip.style.display = 'block';
    }, 10_000);
  },

  startCollectiveStep3() {
    try {
      this._clearTimer();
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      content.innerHTML = `
        <div class="solar-popup-section">
          <h3>Step 2: Your Private Intention</h3>
          <p>Set a personal intention for this ${this.config.displayName} season. This remains private.</p>
          <label for="privateIntentionText" class="sr-only">Your private seasonal intention</label>
          <textarea id="privateIntentionText" class="solar-textarea"
            placeholder="This ${this.config.displayName}, I intend to..." maxlength="500"
            aria-label="Your private seasonal intention"
            style="min-height:120px;margin:1.5rem 0;"></textarea>
          <p style="font-size:0.9rem;color:rgba(224,224,255,0.7);">This intention is for you alone. It will not be shared.</p>
        </div>
        <div class="solar-popup-footer">
          <button type="button" class="solar-popup-btn" onclick="window.currentSolarRoom.startCollectiveStep4()">Continue</button>
        </div>`;
    } catch (err) { console.error('Error starting step 3:', err); }
  },

  startCollectiveStep4() {
    try {
      const intentionEl = document.getElementById('privateIntentionText');
      if (intentionEl) this.userData.privateIntention = intentionEl.value.trim();

      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;
      content.innerHTML = `
        <div class="solar-popup-section">
          <h3>Step 3: Share One Word</h3>
          <p>Choose a single word that captures your ${this.config.displayName} energy or intention.</p>
          <p style="font-size:0.9rem;color:rgba(224,224,255,0.7);margin-bottom:1.5rem;">This word will be shared with the collective field.</p>
          <input type="text" id="collectiveWordInput" class="solar-input"
                 aria-label="Enter your word for this solar season"
                 placeholder="Your word..." maxlength="50"
                 style="font-size:1.2rem;padding:1rem;text-align:center;margin:1rem 0;width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;color:var(--text);">
          <p style="font-size:0.85rem;color:rgba(224,224,255,0.6);margin-top:0.5rem;">Examples: Growth, Rest, Joy, Clarity, Strength, Peace</p>
        </div>
        <div class="solar-popup-footer">
          <button type="button" class="solar-popup-btn" onclick="window.currentSolarRoom.submitWordToCollective()">Add to Circle</button>
        </div>`;
    } catch (err) { console.error('Error starting step 4:', err); }
  },

  submitWordToCollective() {
    try {
      const word = document.getElementById('collectiveWordInput')?.value.trim() || '';
      if (!word)        { SolarUIManager.showToast('Please enter a word'); return; }
      if (word.length > 50) { SolarUIManager.showToast('Word is too long'); return; }

      this.userData.collectiveWord  = word;
      this.userData.intentionShared = true;

      if (CommunityDB?.ready) {
        CommunityDB.sendRoomMessage(`${this._getSolarRoomId()}-collective`, word)
          .catch(err => console.error('[BaseSolarRoom] submitWordToCollective DB error:', err));
      }

      this.startCollectiveStep5();
    } catch (err) { console.error('Error submitting word:', err); }
  },

  startCollectiveStep5() {
    try {
      const content = document.getElementById('collectiveIntentionContent');
      if (!content) return;

      const words         = this._dbCollectiveWords?.length ? this._dbCollectiveWords : this._getMockCollectiveWords();
      const wordCloudHTML = this._renderWordCloud(words);

      content.innerHTML = `
        <div class="solar-popup-section" style="text-align:center;">
          <h3>Step 4: The Collective ${this.config.displayName} Field</h3>
          <p>These are the ${this.config.collectiveNoun || 'intentions'} planted by practitioners in this circle.</p>
        </div>
        <div id="wordCloud" style="padding:2rem;margin:2rem 0;background:rgba(255,255,255,0.03);border-radius:12px;min-height:200px;display:flex;flex-wrap:wrap;gap:1rem;align-items:center;justify-content:center;">
          ${wordCloudHTML}
        </div>
        <p style="text-align:center;font-size:0.9rem;color:rgba(224,224,255,0.7);margin-bottom:2rem;">
          <span class="solar-word-count"><strong>${words.length}</strong></span> ${this.config.collectiveNoun || 'intentions'} in this ${this.config.displayName} cycle
        </p>
        <div style="margin:2rem 0;">
          <h4 style="text-align:center;margin-bottom:1rem;">Step 5: Silent Witnessing (2 min)</h4>
          <div id="witnessingTimer" class="solar-timer-display">2:00</div>
          <button type="button" id="startWitnessingBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.startWitnessingTimer()">Begin Silent Witnessing</button>
          <button type="button" id="completeBtn" class="solar-popup-btn"
                  onclick="window.currentSolarRoom.completeCollectivePractice()"
                  style="display:none;margin-top:1rem;background:var(--season-accent);color:white;">Complete Practice</button>
        </div>`;
    } catch (err) { console.error('Error starting step 5:', err); }
  },

  startWitnessingTimer() {
    this._startCountdownTimer('witnessingTimer', 'startWitnessingBtn', 120, () => {
      const btn = document.getElementById('completeBtn');
      if (btn) btn.style.display = 'block';
    });
  },

  completeCollectivePractice() {
    try {
      this.userData.practiceCount++;
      this.saveData();
      SolarUIManager.showToast(`${this.config.seasonEmoji} ${this.config.collectiveNoun || 'Intention'} planted with the collective`);
      document.getElementById('collectivePopup')?.remove();
      this.renderDashboard();
    } catch (err) { console.error('Error completing collective practice:', err); }
  },

  _getMockCollectiveWords() {
    const words = {
      spring: ['Growth','Renewal','Hope','Bloom','Energy','Fresh','Vitality','Emerge','Awaken','Begin'],
      summer: ['Radiance','Joy','Abundance','Vibrant','Expansion','Bright','Celebrate','Fullness','Alive','Shine'],
      autumn: ['Harvest','Gratitude','Release','Balance','Gather','Wisdom','Reflection','Abundance','Thanks','Ripen'],
      winter: ['Rest','Stillness','Peace','Wisdom','Quiet','Restore','Deep','Calm','Reflection','Inner'],
    };
    const list = words[this.config.name] || words.spring;
    const now  = Date.now();
    return list.map((word, i) => ({ word, timestamp: now - i * 3_600_000 }));
  },

  // ============================================================================
  // SUPABASE / PRESENCE
  // ============================================================================

  _getSolarRoomId: function() { return `${this.config.name}-solar`; },

  getLivingPresenceCount() {
    return typeof this._cachedPresenceCount === 'number' ? this._cachedPresenceCount : 0;
  },

  async _refreshLivePresence() {
    if (!CommunityDB?.ready) return;
    const roomId = this._getSolarRoomId();

    const refresh = async () => {
      try {
        const participants = await CommunityDB.getRoomParticipants(roomId);
        const blocked      = await CommunityDB.getBlockedUsers();
        const visible      = participants.filter(p => !blocked.has(p.user_id));
        const count        = visible.length;

        this._cachedPresenceCount = count;
        this._cachedParticipants  = visible;

        const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
        setText('solarLiveCountTop',          `${count} members practicing with you now`);
        setText('solarGroupPresenceBadge',     `${count} gathering now`);
        setText('solarGroupJoinCount',         count);
        setText('solarCollectivePresenceBadge',`${count} practitioners in circle now`);

        const avatarEl = document.getElementById('solarGroupAvatars');
        if (avatarEl) avatarEl.innerHTML = this._buildRealAvatars(visible);
      } catch (err) {
        console.warn('[BaseSolarRoom] _refreshLivePresence error:', err);
      }
    };

    await refresh();
    this._unsubPresence();
    this._presenceSub = CommunityDB.subscribeToPresence(refresh);
  },

  _buildRealAvatars(participants) {
    const MAX      = 5;
    const shown    = participants.slice(0, MAX);
    const overflow = participants.length - MAX;

    const avatarStyle = 'width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.2);';

    const html = shown.map(p => {
      const profile  = p.profiles || {};
      const name     = profile.name || profile.display_name || '?';
      const initial  = name.charAt(0).toUpperCase();
      const gradient = Core?.getAvatarGradient?.(p.user_id) ?? 'background:var(--season-accent,#f59e0b)';

      let inner;
      if (profile.avatar_url) {
        inner = `<img src="${profile.avatar_url}" alt="${initial}" width="40" height="40" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      } else if (profile.emoji) {
        inner = `<span style="font-size:18px;">${profile.emoji}</span>`;
      } else {
        inner = `<span style="font-size:13px;font-weight:600;">${initial}</span>`;
      }
      return `<div class="solar-avatar" style="${gradient};${avatarStyle}" aria-label="${name}">${inner}</div>`;
    }).join('');

    const overflowHTML = overflow > 0
      ? `<div class="solar-avatar" style="background:rgba(255,255,255,0.1);${avatarStyle}font-size:12px;">+${overflow}</div>`
      : '';

    return html + overflowHTML;
  },

  _setPresence() {
    if (!CommunityDB?.ready) return;
    try {
      const roomId   = this._getSolarRoomId();
      const activity = `${this.config.emoji} ${this.config.displayName}`;
      CommunityDB.setPresence('online', activity, roomId);
      if (Core?.state) {
        Core.state.currentRoom = roomId;
        if (Core.state.currentUser) Core.state.currentUser.activity = activity;
      }
    } catch (err) { console.error('[BaseSolarRoom] _setPresence error:', err); }
  },

  _clearPresence() {
    if (!CommunityDB?.ready) return;
    try {
      CommunityDB.setPresence('online', '✨ Available', null);
      if (Core?.state) {
        Core.state.currentRoom = null;
        if (Core.state.currentUser) Core.state.currentUser.activity = '✨ Available';
      }
    } catch (err) { console.error('[BaseSolarRoom] _clearPresence error:', err); }
  },

  async _loadCollectiveWords() {
    if (!CommunityDB?.ready) return;
    try {
      const roomId = `${this._getSolarRoomId()}-collective`;
      const load   = async () => {
        const rows = await CommunityDB.getRoomMessages(roomId, 100);
        if (!rows?.length) return;
        this._dbCollectiveWords = rows.map(r => ({
          word:      r.message,
          timestamp: new Date(r.created_at).getTime(),
        }));
        const cloudEl = document.getElementById('wordCloud');
        if (cloudEl) cloudEl.innerHTML = this._renderWordCloud(this._dbCollectiveWords);
        const countEl = document.querySelector('.solar-word-count strong');
        if (countEl) countEl.textContent = this._dbCollectiveWords.length;
      };

      await load();
      this._unsubCollectiveWords();
      this._collectiveWordsSub = CommunityDB.subscribeToRoomChat(roomId, load);
    } catch (err) {
      console.warn('[BaseSolarRoom] _loadCollectiveWords error:', err);
    }
  },

  _renderWordCloud(words) {
    if (!words?.length) return '<p style="color:rgba(224,224,255,0.5);">No words yet. Be the first to share.</p>';
    return words.map(({ word }) => {
      const size    = (1 + Math.random() * 1.5).toFixed(2);
      const opacity = (0.6 + Math.random() * 0.4).toFixed(2);
      return `<span class="solar-word-item" style="font-size:${size}rem;opacity:${opacity};color:var(--season-accent,#e0e0ff);font-weight:600;display:inline-block;margin:0.5rem;transition:all 0.3s;">${word}</span>`;
    }).join('');
  },
};

export { BaseSolarRoom };
