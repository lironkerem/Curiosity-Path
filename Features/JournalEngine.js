// ============================================
// JOURNAL ENGINE - Personal Journal System with PIN Lock
// ============================================

import { NeumorphicModal } from '../Core/Modal.js';

// XSS escape helper
function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Constants ──────────────────────────────────────────────────────────────

// Whitelist of valid mood IDs — used to validate data-mood values
const MOOD_OPTIONS = Object.freeze([
  { id: 'happy',        emoji: '😊', title: 'Happy' },
  { id: 'joyful',       emoji: '😄', title: 'Joyful' },
  { id: 'excited',      emoji: '🤩', title: 'Excited' },
  { id: 'loved',        emoji: '🥰', title: 'Loved' },
  { id: 'grateful',     emoji: '🙏', title: 'Grateful' },
  { id: 'peaceful',     emoji: '😌', title: 'Peaceful' },
  { id: 'calm',         emoji: '🧘', title: 'Calm' },
  { id: 'relaxed',      emoji: '😎', title: 'Relaxed' },
  { id: 'proud',        emoji: '😤', title: 'Proud' },
  { id: 'confident',    emoji: '💪', title: 'Confident' },
  { id: 'hopeful',      emoji: '🌟', title: 'Hopeful' },
  { id: 'inspired',     emoji: '✨', title: 'Inspired' },
  { id: 'sad',          emoji: '😢', title: 'Sad' },
  { id: 'crying',       emoji: '😭', title: 'Crying' },
  { id: 'lonely',       emoji: '😔', title: 'Lonely' },
  { id: 'disappointed', emoji: '😞', title: 'Disappointed' },
  { id: 'anxious',      emoji: '😰', title: 'Anxious' },
  { id: 'worried',      emoji: '😟', title: 'Worried' },
  { id: 'stressed',     emoji: '😫', title: 'Stressed' },
  { id: 'overwhelmed',  emoji: '🤯', title: 'Overwhelmed' },
  { id: 'angry',        emoji: '😠', title: 'Angry' },
  { id: 'frustrated',   emoji: '😤', title: 'Frustrated' },
  { id: 'annoyed',      emoji: '😒', title: 'Annoyed' },
  { id: 'tired',        emoji: '😴', title: 'Tired' },
  { id: 'sick',         emoji: '🤒', title: 'Sick' },
  { id: 'confused',     emoji: '😕', title: 'Confused' },
  { id: 'surprised',    emoji: '😲', title: 'Surprised' },
  { id: 'shocked',      emoji: '😱', title: 'Shocked' },
  { id: 'nervous',      emoji: '😬', title: 'Nervous' },
  { id: 'embarrassed',  emoji: '😳', title: 'Embarrassed' }
]);

const VALID_MOOD_IDS = new Set(MOOD_OPTIONS.map(m => m.id));

const WRITING_PROMPTS = Object.freeze([
  'What made you smile today?',
  'What are you grateful for right now?',
  "What's on your mind?",
  'How are you really feeling?',
  'What would you like to remember about today?',
  'What challenged you today?',
  'What did you learn about yourself?',
  'What are you looking forward to?'
]);

const ANIMATION_DURATION = 400; // ms
const MAX_ENTRY_LENGTH   = 10000; // per-entry character cap

// ── JournalEngine ──────────────────────────────────────────────────────────

class JournalEngine {
  constructor(app) {
    this.app = app;
    this.currentPage  = 0;
    this.viewMode     = 'write'; // 'write' | 'read'
    this.isOpen       = false;
    this.isLocked     = false;
    this.activeModals = [];
  }

  // ── Main Render ────────────────────────────────────────────────────────────

  render() {
    let tab = document.getElementById('journal-tab');
    if (!tab) {
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;
      tab = document.createElement('div');
      tab.id = 'journal-tab';
      tab.className = 'tab-content';
      mainContent.appendChild(tab);
    }

    tab.innerHTML = `
      <div class="journal-container">
        <div class="universal-content">
          <header class="main-header project-curiosity"
                  style="--header-img:url('/public/Tabs/NavJournal.webp');
                         --header-title:'';
                         --header-tag:'Your safe, private, secret space, to open up, vent and write down your emotions and thoughts'">
            <h1>My Personal Journal</h1>
            <h3>Your safe, private, secret space, to open up, vent and write down your emotions and thoughts</h3>
            <span class="header-sub"></span>
          </header>
          <div class="journal-book-wrapper" id="journal-wrapper"></div>
        </div>
      </div>
    `;

    this.initializeLockState();
    this.renderJournal();
  }

  // ── Journal State Renderers ────────────────────────────────────────────────

  renderJournal() {
    const wrapper = document.getElementById('journal-wrapper');
    if (!wrapper) return;
    const hasPin = !!this.app.state.data.journalPin;
    if (!this.isOpen) this.renderClosedBook(wrapper, hasPin);
    else              this.renderOpenBook(wrapper, hasPin);
  }

  renderClosedBook(wrapper, hasPin) {
    const userName = esc(this.app.state.currentUser?.name || 'My');
    const lockIcon = hasPin && this.isLocked
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
      : '';

    wrapper.innerHTML = `
      <div class="journal-closed" id="open-journal"
           style="opacity:0;transform:scale(0.95);"
           role="button" tabindex="0"
           aria-label="Open journal"
           onkeydown="if(event.key==='Enter'||event.key===' ')this.click()">
        <div class="journal-cover-title">${userName}'s<br>Personal Journal</div>
        <div class="journal-cover-subtitle">Tap to open and begin writing</div>
        <div class="journal-lock" aria-hidden="true">${lockIcon}</div>
      </div>`;

    const coverEl = wrapper.querySelector('.journal-closed');
    requestAnimationFrame(() => {
      coverEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      coverEl.style.opacity    = '1';
      coverEl.style.transform  = 'scale(1)';
    });

    coverEl.addEventListener('click', () => {
      if (hasPin && this.isLocked) this.promptUnlock();
      else                         this.openBook();
    });
  }

  renderOpenBook(wrapper, hasPin) {
    // SVG icons inlined — all decorative, aria-hidden
    const lockIcon     = hasPin && this.isLocked
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
    const noLockIcon   = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';
    const displayLock  = hasPin ? lockIcon : noLockIcon;

    wrapper.innerHTML = `
      <div class="journal-book" style="opacity:0;transform:scale(0.95);">

        <!-- Top Navigation Bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <div class="mode-toggle">
            <button type="button" class="journal-btn-neuro mode-btn active" data-mode="write"
                    style="display:inline-flex;align-items:center;gap:0.4rem;" aria-pressed="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
              Write
            </button>
            <button type="button" class="journal-btn-neuro mode-btn" data-mode="read"
                    style="display:inline-flex;align-items:center;gap:0.4rem;" aria-pressed="false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Read
            </button>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;">
            <button type="button" class="journal-btn-neuro lock-toggle-btn" id="lock-toggle"
                    style="display:inline-flex;align-items:center;gap:0.4rem;"
                    aria-label="${hasPin ? (this.isLocked ? 'Unlock journal' : 'Lock journal') : 'Set journal PIN'}">
              ${displayLock} Lock Journal
            </button>
            ${hasPin ? `<button type="button" class="journal-btn-neuro" id="pin-settings" title="PIN Settings"
                                style="display:inline-flex;align-items:center;gap:0.4rem;"
                                aria-label="PIN settings">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>` : ''}
            <button type="button" class="journal-btn-neuro close-book-btn" id="close-journal"
                    style="display:inline-flex;align-items:center;gap:0.4rem;" aria-label="Close journal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Close
            </button>
          </div>
        </div>

        <!-- Pages Container -->
        <div class="journal-pages" id="journal-pages" aria-live="polite"></div>

        <!-- Bottom Controls -->
        <div class="journal-controls">
          <div class="journal-nav">
            <button type="button" class="journal-btn-neuro" id="prev-page" disabled aria-label="Previous entry">← Previous</button>
            <span class="page-indicator" id="page-indicator" aria-live="polite"></span>
            <button type="button" class="journal-btn-neuro" id="next-page" disabled aria-label="Next entry">Next →</button>
          </div>
          <div style="display:flex;justify-content:center;margin-top:1rem;">
            <button type="button" class="journal-btn-neuro save-btn" id="save-entry"
                    style="display:none;align-items:center;gap:0.4rem;" aria-label="Save journal entry">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>
              Save Entry
            </button>
          </div>
        </div>
      </div>`;

    const bookEl = wrapper.querySelector('.journal-book');
    requestAnimationFrame(() => {
      bookEl.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      bookEl.style.opacity    = '1';
      bookEl.style.transform  = 'scale(1)';
    });

    this.attachOpenEventListeners();
    this.renderCurrentView();
  }

  // ── View Mode Renderers ────────────────────────────────────────────────────

  renderWriteMode() {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn        = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'inline-flex';

    const randomPrompt = esc(this.getRandomPrompt());
    const currentDate  = esc(this.formatDate(new Date()));

    pagesContainer.innerHTML = `
      <div class="journal-page write-mode">
        <div class="journal-date">${currentDate}</div>

        <textarea class="journal-textarea"
                  id="journal-entry-text"
                  maxlength="${MAX_ENTRY_LENGTH}"
                  placeholder="Dear Journal, ${randomPrompt}"
                  aria-label="Journal entry text"></textarea>

        <div class="prompt-box">
          <div class="prompt-text" style="display:flex;align-items:center;gap:0.4rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            Writing prompt: ${randomPrompt}
          </div>
        </div>

        <div class="prompt-box">
          <div class="prompt-text">Your Mood</div>
          <div class="journal-mood" style="margin-top:.6rem;" role="group" aria-label="Mood selection">
            ${this.renderMoodButtons()}
          </div>
        </div>
      </div>`;

    this.attachMoodListeners(pagesContainer);
    this.updateNavigation();
  }

  renderReadMode(direction = 'none') {
    const pagesContainer = document.getElementById('journal-pages');
    const saveBtn        = document.getElementById('save-entry');
    if (saveBtn) saveBtn.style.display = 'none';

    const entries = this.app.state.data.journalEntries || [];
    if (!entries.length) { this.renderEmptyJournal(pagesContainer); return; }

    const sorted        = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const entry         = sorted[this.currentPage];
    const originalIndex = entries.indexOf(entry);
    const moodEmoji     = entry.mood ? this.getMoodEmoji(entry.mood) : '';
    const formattedDate = esc(entry.date || this.formatDate(new Date(entry.timestamp)));
    const flipClass     = direction === 'left' ? 'page-flip-left' : direction === 'right' ? 'page-flip-right' : '';

    pagesContainer.innerHTML = `
      <div class="journal-page read-mode ${flipClass}">
        <div class="entry-actions">
          <button type="button" class="action-btn"
                  data-action="edit" data-index="${originalIndex}"
                  style="display:inline-flex;align-items:center;gap:0.4rem;"
                  aria-label="Edit this entry">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
            Edit
          </button>
          <button type="button" class="action-btn"
                  data-action="delete" data-index="${originalIndex}"
                  style="display:inline-flex;align-items:center;gap:0.4rem;"
                  aria-label="Delete this entry">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            Delete
          </button>
        </div>
        <div class="journal-date">
          ${moodEmoji ? moodEmoji + ' ' : ''}${formattedDate}
        </div>
        <div class="entry-content">${esc(entry.situation || entry.feelings || '')}</div>
      </div>`;

    // Use event delegation — no inline onclick with index injection
    pagesContainer.querySelector('[data-action="edit"]')
      ?.addEventListener('click', () => this.editEntry(originalIndex));
    pagesContainer.querySelector('[data-action="delete"]')
      ?.addEventListener('click', () => this.deleteEntry(originalIndex));

    this.updateNavigation();
  }

  renderEmptyJournal(container) {
    container.innerHTML = `
      <div class="journal-page">
        <div class="empty-journal">
          <div class="empty-journal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" style="width:48px;height:48px;" aria-hidden="true" focusable="false"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <p>Your journal is empty</p>
          <p style="font-size:.9rem;margin-top:.5rem;">Switch to Write mode to create your first entry</p>
        </div>
      </div>`;
    this.updateNavigation();
  }

  // ── PIN / Lock System ──────────────────────────────────────────────────────
  //
  // SECURITY NOTE: btoa() is BASE64 ENCODING, not cryptographic hashing.
  // For production use Web Crypto API (crypto.subtle.digest) or a proper
  // password hashing library. Current implementation is obfuscation only.

  initializeLockState() {
    if (this.app.state.data.journalPin) {
      this.isLocked = this.app.state.data.journalLocked !== false;
    }
  }

  promptSetPin() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
      title: 'Set Journal PIN',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label" for="pin-input">Enter 4-digit PIN</label>
          <input type="password" id="pin-input" class="form-input"
                 maxlength="4" pattern="[0-9]*" inputmode="numeric"
                 placeholder="••••" autocomplete="new-password">
          <label class="form-label" style="margin-top:1rem;" for="pin-confirm">Confirm PIN</label>
          <input type="password" id="pin-confirm" class="form-input"
                 maxlength="4" pattern="[0-9]*" inputmode="numeric"
                 placeholder="••••" autocomplete="new-password">
          <p style="font-size:.85rem;color:var(--neuro-text-muted);margin-top:.5rem;">
            You can reset PIN using your account password
          </p>
        </div>`,
      onConfirm: (modal) => {
        const pin     = modal.querySelector('#pin-input').value;
        const confirm = modal.querySelector('#pin-confirm').value;

        if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
          this.app.showToast('PIN must be exactly 4 digits', 'warning');
          return false;
        }
        if (pin !== confirm) {
          this.app.showToast('PINs do not match', 'warning');
          return false;
        }

        // WARNING: btoa is NOT encryption — see security note above
        this.app.state.data.journalPin = btoa(pin);
        this.app.state.saveAppData();
        this.isLocked = true;
        this.app.showToast('PIN set successfully!', 'success');
        this.renderJournal();
        return true;
      }
    });

    setTimeout(() => modal.querySelector('#pin-input')?.focus(), 100);
  }

  promptUnlock() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
      title: 'Unlock Journal',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label" for="unlock-pin">Enter your PIN</label>
          <input type="password" id="unlock-pin" class="form-input"
                 maxlength="4" pattern="[0-9]*" inputmode="numeric"
                 placeholder="••••" autocomplete="current-password">
          <button type="button" class="btn" id="forgot-pin" style="margin-top:.5rem;font-size:.85rem;">
            Forgot PIN? Use account password
          </button>
        </div>`,
      onConfirm: (modal) => {
        const pinInput = modal.querySelector('#unlock-pin');
        const pin      = pinInput.value;
        // Decode stored PIN — see security note
        const savedPin = atob(this.app.state.data.journalPin || '');

        if (pin === savedPin) {
          this.isLocked = false;
          this.isOpen   = true;
          this.app.showToast('Journal unlocked!', 'success');
          this.openBook();
          return true;
        } else {
          this.app.showToast('Incorrect PIN', 'error');
          pinInput.value = '';
          pinInput.focus();
          return false;
        }
      }
    });

    modal.querySelector('#forgot-pin')?.addEventListener('click', () => {
      this.closeModal(modal);
      this.resetPinWithAuth();
    });

    const pinInput = modal.querySelector('#unlock-pin');
    pinInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') modal.querySelector('.modal-confirm')?.click();
    });
    setTimeout(() => pinInput?.focus(), 100);
  }

  async resetPinWithAuth() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>',
      title: 'Reset PIN',
      content: `
        <div class="modal-input-wrapper">
          <p style="margin-bottom:1rem;">Enter your account password to reset your journal PIN</p>
          <label class="form-label" for="auth-password">Account Password</label>
          <input type="password" id="auth-password" class="form-input"
                 placeholder="Enter your password" autocomplete="current-password">
        </div>`,
      onConfirm: async (modal) => {
        const passwordInput = modal.querySelector('#auth-password');
        const password = passwordInput.value;
        if (!password) {
          this.app.showToast('Please enter your password', 'warning');
          return false;
        }
        try {
          const { error } = await this.app.supabase.auth.signInWithPassword({
            email: this.app.state.currentUser.email,
            password
          });
          if (error) {
            this.app.showToast('Incorrect password', 'error');
            passwordInput.value = '';
            passwordInput.focus();
            return false;
          }
          delete this.app.state.data.journalPin;
          this.app.state.saveAppData();
          this.isLocked = false;
          this.app.showToast('PIN reset! Set a new one', 'success');
          setTimeout(() => this.promptSetPin(), 300);
          return true;
        } catch (err) {
          console.error('JournalEngine: Authentication error:', err);
          this.app.showToast('Authentication failed', 'error');
          return false;
        }
      }
    });

    const passwordInput = modal.querySelector('#auth-password');
    passwordInput?.addEventListener('keydown', e => {
      if (e.key === 'Enter') modal.querySelector('.modal-confirm')?.click();
    });
    setTimeout(() => passwordInput?.focus(), 100);
  }

  showPinSettings() {
    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
      title: 'PIN Settings',
      content: `
        <div class="modal-input-wrapper">
          <button type="button" class="btn btn-primary" id="change-pin" style="width:100%;margin-bottom:.5rem;">Change PIN</button>
          <button type="button" class="btn" id="remove-pin" style="width:100%;">Remove PIN Lock</button>
        </div>`,
      cancelOnly: true
    });

    modal.querySelector('#change-pin')?.addEventListener('click', () => {
      this.closeModal(modal);
      this.promptSetPin();
    });

    modal.querySelector('#remove-pin')?.addEventListener('click', () => {
      this.closeModal(modal);
      NeumorphicModal.showConfirm(
        'Remove PIN lock from your journal? Your journal will remain accessible without a PIN.',
        () => {
          delete this.app.state.data.journalPin;
          this.app.state.saveAppData();
          this.isLocked = false;
          this.app.showToast('PIN removed', 'success');
          this.renderJournal();
        },
        {
          title:       'Remove PIN?',
          icon:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
          confirmText: 'Remove PIN'
        }
      );
    });
  }

  // ── Entry Management ───────────────────────────────────────────────────────

  saveEntry() {
    const textArea = document.getElementById('journal-entry-text');
    const rawText  = textArea?.value.trim();
    if (!rawText) {
      this.app.showToast('Please write something in your journal', 'warning');
      return;
    }

    const text = rawText.slice(0, MAX_ENTRY_LENGTH);

    // Validate mood from whitelist
    const activeMoodEl = document.querySelector('.mood-btn.active');
    const rawMood      = activeMoodEl?.dataset.mood || null;
    const mood         = rawMood && VALID_MOOD_IDS.has(rawMood) ? rawMood : null;

    const entry = {
      situation:  text,
      feelings:   '',
      mood,
      timestamp:  new Date().toISOString(),
      date:       this.formatDate(new Date())
    };

    this.app.state.addEntry('journal', entry);

    if (this.app.gamification) this.app.gamification.incrementJournalEntries();

    this.app.showToast('Journal entry saved!', 'success');

    textArea.value = '';
    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
    this.checkAchievements();
    this.switchMode('read');
  }

  editEntry(index) {
    const entries = this.app.state.data.journalEntries || [];
    const entry   = entries[index];
    if (!entry) return;

    const modal = this.createModal({
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>',
      title: 'Edit Journal Entry',
      content: `
        <div class="modal-input-wrapper">
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;">How did you feel?</label>
          <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem;" role="group" aria-label="Mood selection">
            ${this.renderMoodButtons(entry.mood)}
          </div>
          <label class="form-label" style="color:var(--neuro-text);margin-bottom:.5rem;display:block;" for="edit-entry">Entry</label>
          <textarea id="edit-entry" class="form-input" rows="8"
                    maxlength="${MAX_ENTRY_LENGTH}"
                    placeholder="Write your thoughts...">${esc(entry.situation || entry.feelings || '')}</textarea>
        </div>`,
      onConfirm: (modal) => {
        const newText = modal.querySelector('#edit-entry').value.trim();
        if (!newText) { this.app.showToast('Please write something', 'warning'); return false; }

        const activeMoodEl = modal.querySelector('.mood-btn.active');
        const rawMood      = activeMoodEl?.dataset.mood || null;
        const newMood      = rawMood && VALID_MOOD_IDS.has(rawMood) ? rawMood : null;

        entries[index].situation = newText.slice(0, MAX_ENTRY_LENGTH);
        entries[index].feelings  = '';
        entries[index].mood      = newMood;

        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('Journal entry updated!', 'success');
        this.renderCurrentView();
        return true;
      }
    });

    this.attachMoodListeners(modal);
    setTimeout(() => modal.querySelector('#edit-entry')?.focus(), 100);
  }

  deleteEntry(index) {
    NeumorphicModal.showConfirm(
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      () => {
        const entries = this.app.state.data.journalEntries || [];
        entries.splice(index, 1);
        this.app.state.data.journalEntries = entries;
        this.app.state.saveAppData();
        this.app.showToast('Journal entry deleted', 'info');
        if (this.currentPage >= entries.length) {
          this.currentPage = Math.max(0, entries.length - 1);
        }
        this.renderCurrentView();
      },
      {
        title:       'Delete Journal Entry',
        icon:        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon" aria-hidden="true" focusable="false"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        confirmText: 'Delete',
        isDanger:    true
      }
    );
  }

  // ── Navigation & Interaction ───────────────────────────────────────────────

  openBook() {
    const coverEl = document.querySelector('.journal-closed');
    if (!coverEl) { this.isOpen = true; this.renderJournal(); return; }
    coverEl.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in`;
    coverEl.style.opacity    = '0';
    coverEl.style.transform  = 'scale(0.9)';
    setTimeout(() => { this.isOpen = true; this.renderJournal(); }, ANIMATION_DURATION);
  }

  closeBook() {
    const bookEl = document.querySelector('.journal-book');
    if (!bookEl) { this.isOpen = false; this.renderJournal(); return; }
    bookEl.style.transition = `opacity ${ANIMATION_DURATION}ms ease-in, transform ${ANIMATION_DURATION}ms ease-in`;
    bookEl.style.opacity    = '0';
    bookEl.style.transform  = 'scale(0.9)';
    setTimeout(() => {
      this.isOpen = false;
      if (this.app.state.data.journalPin) {
        this.isLocked = true;
        this.app.state.data.journalLocked = true;
        this.app.state.saveAppData();
      }
      this.renderJournal();
    }, ANIMATION_DURATION);
  }

  switchMode(mode) {
    // Validate mode against known values
    if (mode !== 'write' && mode !== 'read') return;
    this.viewMode    = mode;
    this.currentPage = 0;
    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
    activeBtn?.classList.add('active');
    activeBtn?.setAttribute('aria-pressed', 'true');
    this.renderCurrentView();
  }

  navigatePage(direction) {
    const entries = this.app.state.data.journalEntries || [];
    const newPage = this.currentPage + direction;
    if (newPage < 0 || newPage > entries.length - 1) return;
    this.currentPage = newPage;
    this.renderReadMode(direction > 0 ? 'right' : 'left');
  }

  updateNavigation() {
    const entries   = this.app.state.data.journalEntries || [];
    const prevBtn   = document.getElementById('prev-page');
    const nextBtn   = document.getElementById('next-page');
    const indicator = document.getElementById('page-indicator');

    if (this.viewMode === 'write') {
      if (prevBtn)   prevBtn.style.display   = 'none';
      if (nextBtn)   nextBtn.style.display   = 'none';
      if (indicator) indicator.textContent   = '';
    } else {
      if (prevBtn) { prevBtn.style.display = 'block'; prevBtn.disabled = this.currentPage === 0; }
      if (nextBtn) { nextBtn.style.display = 'block'; nextBtn.disabled = this.currentPage >= entries.length - 1; }
      if (indicator) {
        indicator.textContent = entries.length
          ? `Entry ${this.currentPage + 1} of ${entries.length}`
          : '';
      }
    }
  }

  renderCurrentView() {
    this.viewMode === 'write' ? this.renderWriteMode() : this.renderReadMode();
  }

  // ── Event Listeners ────────────────────────────────────────────────────────

  attachOpenEventListeners() {
    document.getElementById('close-journal')?.addEventListener('click', () => this.closeBook());
    document.getElementById('lock-toggle')?.addEventListener('click',   () => this.handleLockToggle());
    document.getElementById('pin-settings')?.addEventListener('click',  () => this.showPinSettings());

    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const mode = e.currentTarget.dataset.mode;
        this.switchMode(mode);
      });
    });

    document.getElementById('prev-page')?.addEventListener('click', () => this.navigatePage(-1));
    document.getElementById('next-page')?.addEventListener('click', () => this.navigatePage(1));
    document.getElementById('save-entry')?.addEventListener('click', () => this.saveEntry());
  }

  handleLockToggle() {
    const hasPin = !!this.app.state.data.journalPin;
    if (!hasPin)          this.promptSetPin();
    else if (this.isLocked) this.promptUnlock();
    else {
      this.isLocked                     = true;
      this.app.state.data.journalLocked = true;
      this.app.state.saveAppData();
      this.app.showToast('Journal locked', 'info');
      this.renderJournal();
    }
  }

  attachMoodListeners(container) {
    container.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        container.querySelectorAll('.mood-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.setAttribute('aria-pressed', 'true');
      });
    });
  }

  // ── Achievements ───────────────────────────────────────────────────────────

  checkAchievements() {
    const total  = this.app.gamification?.state?.totalJournalEntries || 0;
    const gm     = this.app.gamification;
    if (!gm) return;
    const badges = gm.getBadgeDefinitions();
    if (total >= 1)   gm.checkAndGrantBadge('first_journal',  badges);
    if (total >= 20)  gm.checkAndGrantBadge('journal_keeper', badges);
    if (total >= 75)  gm.checkAndGrantBadge('journal_master', badges);
    if (total >= 150) gm.checkAndGrantBadge('journal_150',    badges);
    if (total >= 400) gm.checkAndGrantBadge('journal_400',    badges);
  }

  // ── Modal System ───────────────────────────────────────────────────────────

  createModal({ icon, title, content, onConfirm, cancelOnly = false }) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', title);
    overlay.innerHTML = `
      <div class="neuro-modal">
        <div class="modal-header">
          <div class="modal-icon icon-small" aria-hidden="true">${icon}</div>
          <h3 class="modal-title">${esc(title)}</h3>
        </div>
        ${content}
        <div class="modal-actions">
          <button type="button" class="btn modal-cancel">${cancelOnly ? 'Close' : 'Cancel'}</button>
          ${cancelOnly ? '' : '<button type="button" class="btn btn-primary modal-confirm">Confirm</button>'}
        </div>
      </div>`;

    document.body.appendChild(overlay);
    this.activeModals.push(overlay);

    const cancel = () => this.closeModal(overlay);
    overlay.querySelector('.modal-cancel').onclick = cancel;

    if (!cancelOnly && onConfirm) {
      overlay.querySelector('.modal-confirm').onclick = () => {
        const shouldClose = onConfirm(overlay);
        if (shouldClose !== false) this.closeModal(overlay);
      };
    }

    overlay.onclick = e => { if (e.target === overlay) cancel(); };

    const escHandler = e => {
      if (e.key === 'Escape') { cancel(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);

    return overlay;
  }

  closeModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      this.activeModals = this.activeModals.filter(m => m !== modal);
    }, 200);
  }

  cleanup() {
    this.activeModals.forEach(m => m.remove());
    this.activeModals = [];
  }

  // ── Helper Methods ─────────────────────────────────────────────────────────

  getRandomPrompt() {
    return WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
  }

  formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  renderMoodButtons(activeMood = null) {
    return MOOD_OPTIONS.map(m =>
      `<button type="button" class="mood-btn ${activeMood === m.id ? 'active' : ''}"
               data-mood="${esc(m.id)}"
               title="${esc(m.title)}"
               aria-label="${esc(m.title)}"
               aria-pressed="${activeMood === m.id ? 'true' : 'false'}">${m.emoji}</button>`
    ).join('');
  }

  getMoodEmoji(moodId) {
    // Validate against whitelist before lookup
    if (!VALID_MOOD_IDS.has(moodId)) return '';
    return MOOD_OPTIONS.find(m => m.id === moodId)?.emoji || '';
  }
}

export default JournalEngine;
